"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ChevronRight,
  MoreVertical,
  UserX,
  UserCheck,
  Download,
  Save,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
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
  SheetFooter,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Mock Data for Clients
const INITIAL_CLIENTS = [
  {
    id: "CLI-1001",
    name: "Carlos Mendoza",
    email: "carlos.m@example.com",
    registrationDate: "2026-01-15T10:30:00Z",
    totalOrders: 12,
    status: "Active",
    phone: "+57 301 555 1234",
    address: "Calle 127 #45-12, Bogotá, Colombia",
    orderHistory: [
      { id: "ORD-9821", date: "2026-04-10T15:20:00Z", paymentStatus: "Paid", total: 45.99 },
      { id: "ORD-9750", date: "2026-03-22T09:15:00Z", paymentStatus: "Paid", total: 124.50 },
      { id: "ORD-9612", date: "2026-02-05T18:45:00Z", paymentStatus: "Paid", total: 89.00 },
    ]
  },
  {
    id: "CLI-1002",
    name: "Valentina Rojas",
    email: "v.rojas@botanica.co",
    registrationDate: "2026-02-20T14:45:00Z",
    totalOrders: 5,
    status: "Active",
    phone: "+57 312 444 9876",
    address: "Carrera 7 #72-10, Apto 402, Bogotá, Colombia",
    orderHistory: [
      { id: "ORD-9835", date: "2026-04-18T11:00:00Z", paymentStatus: "Pending", total: 67.20 },
      { id: "ORD-9701", date: "2026-03-10T16:30:00Z", paymentStatus: "Paid", total: 210.00 },
    ]
  },
  {
    id: "CLI-1003",
    name: "Andrés Felipe Sierra",
    email: "andres.sierra@pyme.com",
    registrationDate: "2026-03-05T08:20:00Z",
    totalOrders: 2,
    status: "Inactive",
    phone: "+57 300 111 2233",
    address: "Circular 4 #70-15, Medellín, Colombia",
    orderHistory: [
      { id: "ORD-9801", date: "2026-04-02T14:10:00Z", paymentStatus: "Failed", total: 55.00 },
    ]
  },
  {
    id: "CLI-1004",
    name: "Mariana Holguín",
    email: "m.holguin@gmail.com",
    registrationDate: "2026-03-12T19:00:00Z",
    totalOrders: 8,
    status: "Active",
    phone: "+57 315 777 5544",
    address: "Calle 50 #12-45, Barranquilla, Colombia",
    orderHistory: [
      { id: "ORD-9840", date: "2026-04-19T20:15:00Z", paymentStatus: "Paid", total: 34.50 },
      { id: "ORD-9790", date: "2026-03-28T12:40:00Z", paymentStatus: "Paid", total: 112.00 },
    ]
  },
]

export function ClientsPanel() {
  const [clients, setClients] = useState(INITIAL_CLIENTS)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [dateSort, setDateSort] = useState("desc")
  
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<any>(null)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  const handleOpenDetail = (client: any) => {
    setSelectedClient(client)
    setEditForm({ ...client })
    setIsDetailOpen(true)
    setIsEditing(false)
  }

  const handleToggleStatus = (clientId: string) => {
    setClients(prev => prev.map(c => 
      c.id === clientId 
        ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" } 
        : c
    ))
    if (selectedClient && selectedClient.id === clientId) {
      setSelectedClient({ ...selectedClient, status: selectedClient.status === "Active" ? "Inactive" : "Active" })
    }
  }

  const handleSaveEdit = () => {
    setClients(prev => prev.map(c => c.id === selectedClient.id ? { ...editForm } : c))
    setSelectedClient({ ...editForm })
    setIsEditing(false)
  }

  const filteredClients = clients
    .filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           c.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "All" || c.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      const dateA = new Date(a.registrationDate).getTime()
      const dateB = new Date(b.registrationDate).getTime()
      return dateSort === "desc" ? dateB - dateA : dateA - dateB
    })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active": 
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-bold px-3">Activo</Badge>
      case "Inactive": 
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 font-bold px-3">Inactivo</Badge>
      default: 
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "Paid": return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100 text-[10px] font-bold">Pagado</Badge>
      case "Pending": return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-100 text-[10px] font-bold">Pendiente</Badge>
      case "Failed": return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-100 text-[10px] font-bold">Fallido</Badge>
      default: return <Badge variant="outline">{status}</Badge>
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
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-card h-11 rounded-xl px-5 font-bold text-xs uppercase tracking-widest border-border hover:bg-secondary transition-all">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
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
          <div className="grid grid-cols-2 lg:flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-secondary/30 rounded-xl px-4 py-1.5 text-xs font-semibold focus:outline-none border-none cursor-pointer h-11 transition-colors hover:bg-secondary/50"
            >
              <option value="All">Todos los estados</option>
              <option value="Active">Activos</option>
              <option value="Inactive">Inactivos</option>
            </select>
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
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Estado</th>
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
                    <td className="px-6 py-5 text-xs font-bold text-muted-foreground">{c.id}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-sm font-bold text-foreground leading-none">{c.name}</p>
                          <p className="text-[11px] text-muted-foreground mt-1 font-medium">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground/80">{new Date(c.registrationDate).toLocaleDateString()}</span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{new Date(c.registrationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-sm font-black text-foreground">{c.totalOrders}</span>
                    </td>
                    <td className="px-6 py-5">
                      {getStatusBadge(c.status)}
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
              <div className="flex gap-4">
                <Skeleton className="h-16 w-16 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
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
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-sm font-bold text-foreground leading-tight truncate">{c.name}</span>
                    {getStatusBadge(c.status)}
                  </div>
                  <p className="text-[11px] font-medium text-muted-foreground mb-2 truncate">{c.email}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                      <Package className="h-3 w-3" /> {c.totalOrders} Pedidos
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border/50 pt-4">
                <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">Registrado: {new Date(c.registrationDate).toLocaleDateString()}</span>
                <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold text-primary">
                  Ver Perfil
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
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
                      <SheetTitle className="text-lg sm:text-2xl font-bold tracking-tight text-foreground leading-none">{selectedClient.name}</SheetTitle>
                      <SheetDescription className="text-[10px] sm:text-xs font-semibold text-muted-foreground mt-2 uppercase tracking-widest flex items-center gap-2">
                        <span className="bg-muted px-2 py-0.5 rounded">{selectedClient.id}</span>
                        <span className="h-1 w-1 rounded-full bg-border" />
                        Registrado el {new Date(selectedClient.registrationDate).toLocaleDateString()}
                      </SheetDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {isEditing ? (
                      <div className="flex gap-2 w-full">
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="flex-1 sm:flex-initial h-10 rounded-xl px-5 text-[11px] font-bold text-muted-foreground uppercase">Cancelar</Button>
                        <Button onClick={handleSaveEdit} className="flex-1 sm:flex-initial h-10 bg-primary text-white rounded-xl px-6 text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-primary/10">
                          <Save className="h-3.5 w-3.5 mr-2" /> Guardar
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2 w-full">
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="flex-1 sm:flex-initial h-10 rounded-xl px-5 text-[11px] font-bold uppercase tracking-wider border-border hover:bg-secondary">
                          <Edit className="h-3.5 w-3.5 mr-2" /> Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(selectedClient.id)}
                          className={cn(
                            "flex-1 sm:flex-initial h-10 rounded-xl px-5 text-[11px] font-bold uppercase tracking-wider border-border",
                            selectedClient.status === "Active" ? "text-red-600 hover:bg-red-50 hover:border-red-100" : "text-green-600 hover:bg-green-50 hover:border-green-100"
                          )}
                        >
                          {selectedClient.status === "Active" ? (
                            <><UserX className="h-3.5 w-3.5 mr-2" /> Suspender</>
                          ) : (
                            <><UserCheck className="h-3.5 w-3.5 mr-2" /> Activar</>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                {!isEditing && (
                  <div className="flex flex-wrap gap-2">
                    {getStatusBadge(selectedClient.status)}
                    <Badge variant="outline" className="bg-secondary/40 border-none font-bold text-[10px] px-3">{selectedClient.totalOrders} Pedidos realizados</Badge>
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
                          <Input value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="h-12 bg-secondary/20 rounded-2xl border-none font-bold text-sm" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">Email</label>
                            <Input value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="h-12 bg-secondary/20 rounded-2xl border-none font-bold text-sm" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">Teléfono</label>
                            <Input value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} className="h-12 bg-secondary/20 rounded-2xl border-none font-bold text-sm" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">Dirección de Envío</label>
                          <textarea 
                            value={editForm.address} 
                            onChange={(e) => setEditForm({...editForm, address: e.target.value})} 
                            className="w-full min-h-25 bg-secondary/20 rounded-2xl border-none p-4 font-bold text-sm outline-none resize-none" 
                          />
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
                         <p className="text-sm font-bold text-foreground">{selectedClient.phone}</p>
                       </div>
                       <div className="p-6 rounded-3xl bg-secondary/10 border border-border/40 sm:col-span-2 group hover:bg-secondary/20 transition-colors">
                         <div className="flex gap-4">
                           <div className="h-12 w-12 rounded-2xl bg-white border border-border flex items-center justify-center shrink-0 shadow-sm">
                             <MapPin className="h-5 w-5 text-primary" />
                           </div>
                           <div>
                             <p className="text-[10px] text-muted-foreground font-black uppercase mb-1">Dirección Primaria de Envío</p>
                             <p className="text-sm font-medium leading-relaxed italic text-foreground/80">{selectedClient.address}</p>
                           </div>
                         </div>
                       </div>
                    </div>
                  )}
                </section>

                {/* Order History */}
                <section className="space-y-6">
                  <h3 className="text-[11px] font-black text-foreground uppercase tracking-widest flex items-center justify-between">
                    <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Historial de Pedidos</span>
                    <span className="text-[9px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded tracking-normal">Últimos {selectedClient.orderHistory.length} registros</span>
                  </h3>
                  
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
                        {selectedClient.orderHistory.map((order: any) => (
                          <tr key={order.id} className="hover:bg-primary/1 transition-colors">
                            <td className="px-4 py-4 text-xs font-bold text-foreground">{order.id}</td>
                            <td className="px-4 py-4 text-xs font-medium text-muted-foreground">{new Date(order.date).toLocaleDateString()}</td>
                            <td className="px-4 py-4">
                              {getPaymentBadge(order.paymentStatus)}
                            </td>
                            <td className="px-4 py-4 text-right">
                              <span className="text-xs font-black text-foreground">${order.total.toFixed(2)}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>

              {/* Footer */}
              {!isEditing && (
                <div className="p-5 sm:p-8 border-t border-border bg-card/80 backdrop-blur-md shrink-0">
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-12 rounded-2xl border-border text-foreground font-black text-[10px] uppercase tracking-widest">
                       Ver Todos los Pedidos
                    </Button>
                    <Button variant="outline" className="h-12 rounded-2xl border-destructive/20 text-destructive hover:bg-destructive/10 font-black text-[10px] uppercase tracking-widest">
                       Suspender Cuenta
                    </Button>
                 </div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
