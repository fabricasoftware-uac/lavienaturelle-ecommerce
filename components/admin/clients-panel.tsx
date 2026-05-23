"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Search,
  Eye,
  Edit,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { cn, formatPrice } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

interface OrderSummary {
  id: string
  order_number: string
  date: string
  payment_status: string
  total: number
}

interface ClientData {
  id: string
  email: string
  full_name: string
  phone: string | null
  document_number: string | null
  role: string
  created_at: string
  totalOrders: number
  orders: OrderSummary[]
}

export function ClientsPanel() {
  const supabase = useMemo(() => createClient(), [])
  const [clients, setClients] = useState<ClientData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dateSort, setDateSort] = useState("desc")

  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<ClientData> | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function loadClients() {
      try {
        setLoading(true)
        const { data: profiles } = await supabase
          .from("profiles")
          .select("*")
          .is("deleted_at", null)
          .order("created_at", { ascending: false })

        const profilesWithOrders: ClientData[] = []
        if (profiles && profiles.length > 0) {
          const profileIds = profiles.map((p: any) => p.id)
          const { data: allOrders } = await supabase
            .from("orders")
            .select("id, order_number, created_at, payment_status, total_amount, user_id")
            .in("user_id", profileIds)
            .order("created_at", { ascending: false })

          const ordersByUser: Record<string, typeof allOrders> = {}
          const orderCountByUser: Record<string, number> = {}

          for (const o of allOrders ?? []) {
            if (!ordersByUser[o.user_id]) {
              ordersByUser[o.user_id] = []
              orderCountByUser[o.user_id] = 0
            }
            if (ordersByUser[o.user_id].length < 10) {
              ordersByUser[o.user_id].push(o)
            }
            orderCountByUser[o.user_id]++
          }

          for (const p of profiles) {
            const userOrders = ordersByUser[p.id] ?? []
            profilesWithOrders.push({
              id: p.id,
              email: p.email,
              full_name: p.full_name || "Sin nombre",
              phone: p.phone,
              document_number: p.document_number,
              role: p.role,
              created_at: p.created_at,
              totalOrders: orderCountByUser[p.id] ?? 0,
              orders: userOrders.map((o: any) => ({
                id: o.id,
                order_number: o.order_number,
                date: o.created_at,
                payment_status: o.payment_status,
                total: Number(o.total_amount),
              })),
            })
          }
        }

        if (cancelled) return
        setClients(profilesWithOrders)
      } catch (err) {
        console.error("Error loading clients:", err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadClients()
    return () => { cancelled = true }
  }, [])

  const handleOpenDetail = (client: ClientData) => {
    setSelectedClient(client)
    setEditForm({ ...client })
    setIsDetailOpen(true)
    setIsEditing(false)
  }

  const handleSaveEdit = async () => {
    if (!selectedClient || !editForm) return
    setSaving(true)
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: editForm.full_name,
        email: editForm.email,
        phone: editForm.phone,
      })
      .eq("id", selectedClient.id)

    if (!error) {
      setClients(prev =>
        prev.map(c =>
          c.id === selectedClient.id
            ? { ...c, full_name: editForm.full_name || c.full_name, email: editForm.email || c.email, phone: editForm.phone || c.phone }
            : c
        )
      )
      setSelectedClient(prev => prev ? { ...prev, ...editForm } : null)
      setIsEditing(false)
    }
    setSaving(false)
  }

  const filteredClients = clients
    .filter(c => {
      const q = searchQuery.toLowerCase()
      return (
        c.full_name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return dateSort === "desc" ? dateB - dateA : dateA - dateB
    })

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100 text-[10px] font-bold">Pagado</Badge>
      case "pending": return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-100 text-[10px] font-bold">Pendiente</Badge>
      case "failed": return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-100 text-[10px] font-bold">Fallido</Badge>
      case "refunded": return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-100 text-[10px] font-bold">Reembolsado</Badge>
      default: return <Badge variant="outline" className="text-[10px] font-bold">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground tracking-tight">Gestión de Clientes</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Administra la base de datos de usuarios y su actividad.</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-card rounded-xl border border-border p-3 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, email o ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/30 border-none h-11 rounded-xl text-sm font-medium"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={dateSort}
              onChange={(e) => setDateSort(e.target.value)}
              className="bg-secondary/30 rounded-xl px-4 py-1.5 text-xs font-semibold focus:outline-none border-none cursor-pointer h-11 transition-colors hover:bg-secondary/50"
            >
              <option value="desc">Más recientes</option>
              <option value="asc">Más antiguos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/10 border-b border-border">
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Cliente</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Registro</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Pedidos</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Rol</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-6 py-6"><Skeleton className="h-10 w-full rounded-xl" /></td></tr>
                ))
              ) : filteredClients.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-24 text-center text-muted-foreground font-medium italic opacity-60">No se encontraron clientes.</td></tr>
              ) : (
                filteredClients.map((c) => (
                  <tr key={c.id} className="hover:bg-primary/1 transition-colors group">
                    <td className="px-6 py-5 text-xs font-bold text-muted-foreground font-mono">{c.id.slice(0, 8)}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-sm font-bold text-foreground leading-none">{c.full_name}</p>
                          <p className="text-[11px] text-muted-foreground mt-1 font-medium">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground/80">{new Date(c.created_at).toLocaleDateString()}</span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-sm font-black text-foreground">{c.totalOrders}</span>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant="outline" className={cn(
                        "font-bold px-3 text-[10px]",
                        c.role === "admin" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-blue-50 text-blue-700 border-blue-200"
                      )}>
                        {c.role === "admin" ? "Admin" : "Cliente"}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleOpenDetail(c)}
                        className="h-9 text-[11px] font-bold px-4 rounded-xl border-border hover:bg-secondary hover:text-primary transition-all cursor-pointer shadow-sm group/btn"
                      >
                        <Eye className="h-3.5 w-3.5 mr-2 transition-transform group-hover/btn:scale-110" />
                        Ver Perfil
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-4 space-y-4 shadow-sm">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))
        ) : filteredClients.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-12 text-center text-muted-foreground font-medium italic opacity-60">
            No se encontraron clientes.
          </div>
        ) : (
          filteredClients.map((c) => (
            <div key={c.id} className="bg-card rounded-2xl border border-border p-4 shadow-sm active:scale-[0.98] transition-all" onClick={() => handleOpenDetail(c)}>
              <div className="flex gap-4 mb-4">
                <div className="h-14 w-14 rounded-full bg-secondary/50 border border-border flex items-center justify-center text-primary shrink-0 transition-transform">
                  <User className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-bold text-foreground leading-tight block truncate">{c.full_name}</span>
                  <p className="text-[11px] font-medium text-muted-foreground mb-2 truncate">{c.email}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                      <Package className="h-3 w-3" /> {c.totalOrders} Pedidos
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border/50 pt-4">
                <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">Registrado: {new Date(c.created_at).toLocaleDateString()}</span>
                <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold text-primary">
                  Ver Perfil
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Client Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="sm:max-w-2xl p-0 flex flex-col h-full border-l border-border bg-background shadow-2xl">
          {selectedClient && (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Header */}
              <div className="px-5 sm:px-8 pt-8 sm:pt-10 pb-6 border-b border-border bg-card/50 backdrop-blur-md z-30 shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                      <User className="h-8 w-8" />
                    </div>
                    <div>
                      <SheetTitle className="text-lg sm:text-2xl font-bold tracking-tight text-foreground leading-none">{selectedClient.full_name}</SheetTitle>
                      <SheetDescription className="text-[10px] sm:text-xs font-semibold text-muted-foreground mt-2 uppercase tracking-widest flex items-center gap-2">
                        <span className="bg-muted px-2 py-0.5 rounded font-mono">{selectedClient.id.slice(0, 8)}</span>
                        <span className="h-1 w-1 rounded-full bg-border" />
                        Registrado el {new Date(selectedClient.created_at).toLocaleDateString()}
                      </SheetDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {isEditing ? (
                      <div className="flex gap-2 w-full">
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="flex-1 sm:flex-initial h-10 rounded-xl px-5 text-[11px] font-bold text-muted-foreground uppercase">Cancelar</Button>
                        <Button onClick={handleSaveEdit} disabled={saving} className="flex-1 sm:flex-initial h-10 bg-primary text-white rounded-xl px-6 text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-primary/10">
                          <Save className="h-3.5 w-3.5 mr-2" /> {saving ? "Guardando..." : "Guardar"}
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="h-10 rounded-xl px-5 text-[11px] font-bold uppercase tracking-wider border-border hover:bg-secondary">
                        <Edit className="h-3.5 w-3.5 mr-2" /> Editar
                      </Button>
                    )}
                  </div>
                </div>
                {!isEditing && (
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-secondary/40 border-none font-bold text-[10px] px-3">{selectedClient.totalOrders} Pedidos realizados</Badge>
                    <Badge variant="outline" className={cn(
                      "font-bold text-[10px] px-3",
                      selectedClient.role === "admin" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-blue-50 text-blue-700 border-blue-200"
                    )}>
                      {selectedClient.role === "admin" ? "Admin" : "Cliente"}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 sm:py-8 space-y-10 sm:space-y-12">
                {/* Basic Info */}
                <section className="space-y-6">
                  <h3 className="text-[11px] font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" /> Detalles del Perfil
                  </h3>
                  
                  {isEditing ? (
                    <div className="grid grid-cols-1 gap-5 p-5 sm:p-7 rounded-3xl sm:rounded-4xl bg-white border border-border shadow-inner">
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">Nombre Completo</label>
                          <Input value={editForm?.full_name || ""} onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))} className="h-12 bg-secondary/20 rounded-2xl border-none font-bold text-sm" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">Email</label>
                            <Input value={editForm?.email || ""} onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))} className="h-12 bg-secondary/20 rounded-2xl border-none font-bold text-sm" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">Teléfono</label>
                            <Input value={editForm?.phone || ""} onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))} className="h-12 bg-secondary/20 rounded-2xl border-none font-bold text-sm" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div className="p-5 rounded-3xl bg-secondary/10 border border-border/40 group hover:bg-secondary/20 transition-colors">
                         <p className="text-[10px] text-muted-foreground font-black uppercase mb-2 flex items-center gap-1.5"><Mail className="h-3 w-3" /> Email</p>
                         <p className="text-sm font-bold text-foreground break-all">{selectedClient.email}</p>
                       </div>
                       <div className="p-5 rounded-3xl bg-secondary/10 border border-border/40 group hover:bg-secondary/20 transition-colors">
                         <p className="text-[10px] text-muted-foreground font-black uppercase mb-2 flex items-center gap-1.5"><Phone className="h-3 w-3" /> Teléfono</p>
                         <p className="text-sm font-bold text-foreground">{selectedClient.phone || "No registrado"}</p>
                       </div>
                       {selectedClient.document_number && (
                         <div className="p-6 rounded-3xl bg-secondary/10 border border-border/40 sm:col-span-2 group hover:bg-secondary/20 transition-colors">
                           <div className="flex gap-4">
                             <div className="h-12 w-12 rounded-2xl bg-white border border-border flex items-center justify-center shrink-0 shadow-sm">
                               <MapPin className="h-5 w-5 text-primary" />
                             </div>
                             <div>
                               <p className="text-[10px] text-muted-foreground font-black uppercase mb-1">Documento</p>
                               <p className="text-sm font-medium leading-relaxed text-foreground/80">{selectedClient.document_number}</p>
                             </div>
                           </div>
                         </div>
                       )}
                    </div>
                  )}
                </section>

                {/* Order History */}
                <section className="space-y-6">
                  <h3 className="text-[11px] font-black text-foreground uppercase tracking-widest flex items-center justify-between">
                    <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Historial de Pedidos</span>
                    <span className="text-[9px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded tracking-normal">{selectedClient.orders.length} registros</span>
                  </h3>
                  
                  {selectedClient.orders.length > 0 ? (
                    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-muted/10 border-b border-border">
                            <th className="px-4 py-3 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">ID Pedido</th>
                            <th className="px-4 py-3 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Fecha</th>
                            <th className="px-4 py-3 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Pago</th>
                            <th className="px-4 py-3 text-[9px] font-bold text-muted-foreground uppercase tracking-widest text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {selectedClient.orders.map((order) => (
                            <tr key={order.id} className="hover:bg-primary/1 transition-colors">
                              <td className="px-4 py-4 text-xs font-bold text-foreground font-mono">{order.order_number}</td>
                              <td className="px-4 py-4 text-xs font-medium text-muted-foreground">{new Date(order.date).toLocaleDateString()}</td>
                              <td className="px-4 py-4">
                                {getPaymentBadge(order.payment_status)}
                              </td>
                              <td className="px-4 py-4 text-right">
                                <span className="text-xs font-black text-foreground">{formatPrice(order.total)}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-sm text-muted-foreground bg-secondary/20 rounded-2xl border border-border">
                      Este cliente aún no ha realizado pedidos.
                    </div>
                  )}
                </section>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
