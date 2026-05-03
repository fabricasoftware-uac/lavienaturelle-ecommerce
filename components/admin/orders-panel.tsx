"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Calendar,
  CreditCard,
  Truck,
  User,
  MapPin,
  Save,
  RotateCcw,
  Phone,
  Mail,
  ArrowRight,
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn, formatPrice } from "@/lib/utils"
import { ShipmentModal } from "./shipment-modal"
import { getOrders, updateOrder } from "@/lib/supabase/orders"
import { Order, OrderStatus, PaymentStatus } from "@/types/database"

// INITIAL_ORDERS removed - using Supabase data

export function OrdersPanel() {
  const [orders, setOrders] = useState<any[]>([]) // Keeping any[] for the mapped UI structure but could define a UIOther interface
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [shippingFilter, setShippingFilter] = useState("All")
  const [paymentFilter, setPaymentFilter] = useState("All")
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<any>(null)

  // Shipment Modal State
  const [shipmentModalOrder, setShipmentModalOrder] = useState<any>(null)
  const [isShipmentModalOpen, setIsShipmentModalOpen] = useState(false)

  useEffect(() => {
    async function loadOrders() {
      setLoading(true)
      const data = await getOrders()
      
      // Map Supabase data to UI structure
      const mappedOrders = data.map((o: any) => ({
        id: o.order_number || o.id,
        realId: o.id,
        customer: {
          name: o.full_name,
          email: o.email,
          phone: o.phone || "No especificado",
          address: `${o.shipping_address_line1}${o.shipping_address_line2 ? ', ' + o.shipping_address_line2 : ''}, ${o.shipping_city}, ${o.shipping_state}`,
        },
        date: o.created_at,
        shippingStatus: o.status.charAt(0).toUpperCase() + o.status.slice(1),
        paymentStatus: o.payment_status.charAt(0).toUpperCase() + o.payment_status.slice(1),
        total: Number(o.total_amount),
        items: o.order_items.map((item: any) => ({
          id: item.product_id,
          name: item.product_name_snapshot,
          price: Number(item.unit_price),
          quantity: item.quantity
        })),
        history: [
          { status: "Pedido Realizado", date: o.created_at }
        ]
      }))
      
      setOrders(mappedOrders)
      setLoading(false)
    }
    
    loadOrders()
  }, [])

  const handleOpenShipmentModal = (order: any) => {
    setShipmentModalOrder(order)
    setIsShipmentModalOpen(true)
  }

  const handleConfirmShipment = async (carrier: string, trackingId: string) => {
    if (!shipmentModalOrder) return
    
    const res = await updateOrder(shipmentModalOrder.realId, {
      status: "shipped",
      courier_name: carrier,
      tracking_number: trackingId
    })

    if (res.success) {
      setOrders(prev => prev.map(order => 
        order.realId === shipmentModalOrder.realId 
          ? { 
              ...order, 
              shippingStatus: "Shipped" as const,
              carrier,
              trackingId,
              history: [
                { status: "Shipped", date: new Date().toISOString() },
                ...order.history
              ]
            } 
          : order
      ))
    }
    
    setIsShipmentModalOpen(false)
    setShipmentModalOrder(null)
  }

  const handleOpenDetail = (order: any) => {
    setSelectedOrder(order)
    setEditForm({
      customerName: order.customer.name,
      customerEmail: order.customer.email,
      customerPhone: order.customer.phone,
      customerAddress: order.customer.address,
      shippingStatus: order.shippingStatus,
      paymentStatus: order.paymentStatus,
    })
    setIsDetailOpen(true)
    setIsEditing(false)
  }

  const handleSaveEdit = async () => {
    if (!selectedOrder) return
    
    const res = await updateOrder(selectedOrder.realId, {
      full_name: editForm.customerName,
      email: editForm.customerEmail,
      phone: editForm.customerPhone,
      shipping_address_line1: editForm.customerAddress,
      status: editForm.shippingStatus.toLowerCase() as OrderStatus,
      payment_status: editForm.paymentStatus.toLowerCase() as PaymentStatus
    })

    if (res.success) {
      setOrders(prev => prev.map(order => 
        order.realId === selectedOrder.realId 
          ? { 
              ...order, 
              customer: { ...order.customer, name: editForm.customerName, email: editForm.customerEmail, phone: editForm.customerPhone, address: editForm.customerAddress },
              shippingStatus: editForm.shippingStatus,
              paymentStatus: editForm.paymentStatus,
            } 
          : order
      ))
      setSelectedOrder(null)
      setIsDetailOpen(false)
      setIsEditing(false)
    } else {
      alert("Error al actualizar: " + res.error)
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || order.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesShipping = shippingFilter === "All" || order.shippingStatus === shippingFilter
    const matchesPayment = paymentFilter === "All" || order.paymentStatus === paymentFilter
    return matchesSearch && matchesShipping && matchesPayment
  })

  const getShippingBadge = (status: string) => {
    switch (status) {
      case "Pending": return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 font-medium">Pendiente</Badge>
      case "Processing": return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">Procesando</Badge>
      case "Shipped": return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-medium">Enviado</Badge>
      case "Delivered": return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium">Entregado</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "Paid": return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1.5 font-medium"><CheckCircle className="h-3 w-3" /> Pagado</Badge>
      case "Pending": return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1.5 font-medium"><Clock className="h-3 w-3" /> Pendiente</Badge>
      case "Failed": return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1.5 font-medium"><AlertCircle className="h-3 w-3" /> Fallido</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground tracking-tight">Gestión de Pedidos</h1>
          <p className="text-muted-foreground mt-1 text-sm">Administra las compras de tus clientes.</p>
        </div>
        <Button variant="outline" size="sm" className="hidden sm:flex rounded-lg">
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-3 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar pedido..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/30 border-none h-10 rounded-lg text-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <select
              value={shippingFilter}
              onChange={(e) => setShippingFilter(e.target.value)}
              className="bg-secondary/30 rounded-lg px-2 py-1.5 text-xs font-medium border-none h-9 outline-none"
            >
              <option value="All">Todos los envíos</option>
              <option value="Pending">Pendiente</option>
              <option value="Processing">Procesando</option>
              <option value="Shipped">Enviado</option>
              <option value="Delivered">Entregado</option>
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-secondary/30 rounded-lg px-2 py-1.5 text-xs font-medium border-none h-9 outline-none"
            >
              <option value="All">Todos los pagos</option>
              <option value="Paid">Pagado</option>
              <option value="Pending">Pendiente</option>
              <option value="Failed">Fallido</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/10 border-b border-border">
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Dirección</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}><td colSpan={5} className="px-6 py-4"><Skeleton className="h-6 w-full" /></td></tr>
              ))
            ) : filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-muted/5 transition-colors">
                <td className="px-6 py-4 text-sm font-medium">{order.id}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold">{order.customer.name}</div>
                  <div className="text-[11px] text-muted-foreground">{order.customer.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs text-muted-foreground max-w-45 truncate font-medium" title={order.customer.address}>
                    {order.customer.address}
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">{getShippingBadge(order.shippingStatus)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {order.shippingStatus !== "Shipped" && order.shippingStatus !== "Delivered" && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleOpenShipmentModal(order)}
                        className="bg-primary text-white hover:bg-primary/90 h-8 text-xs font-semibold px-3 rounded-lg cursor-pointer"
                      >
                        Enviar
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleOpenDetail(order)} 
                      className="h-8 text-xs font-semibold px-3 rounded-lg border-border hover:bg-secondary cursor-pointer"
                    >
                      Ver Detalles
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sidebar de Detalles (Fixed Scroll) */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="sm:max-w-xl p-0 flex flex-col h-full border-l border-border bg-background">
          {selectedOrder && editForm && (
            <>
              {/* Header Fijo */}
              <div className="px-8 pt-10 pb-6 border-b border-border bg-card shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <SheetTitle className="text-lg font-bold tracking-tight">Pedido {selectedOrder.id}</SheetTitle>
                    <SheetDescription className="text-xs font-medium text-muted-foreground">
                      {new Date(selectedOrder.date).toLocaleString()}
                    </SheetDescription>
                  </div>
                  <div className="flex items-center gap-2 mr-6">
                    {!isEditing ? (
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="h-8 text-xs font-medium rounded-lg">Editar</Button>
                    ) : (
                      <div className="flex items-center gap-2 animate-in fade-in transition-all">
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="h-8 text-xs font-medium">Cancelar</Button>
                        <Button size="sm" onClick={handleSaveEdit} className="h-8 text-xs font-medium bg-primary text-white rounded-lg">Guardar</Button>
                      </div>
                    )}
                  </div>
                </div>
                {!isEditing ? (
                  <div className="flex gap-4">
                    {getShippingBadge(selectedOrder.shippingStatus)}
                    {getPaymentBadge(selectedOrder.paymentStatus)}
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <select
                      value={editForm.shippingStatus}
                      onChange={(e) => setEditForm({ ...editForm, shippingStatus: e.target.value })}
                      className="bg-secondary/50 rounded-lg px-2 py-1 text-xs font-medium border-none outline-none h-8 cursor-pointer"
                    >
                      <option value="Pending">Pendiente</option>
                      <option value="Processing">Procesando</option>
                      <option value="Shipped">Enviado</option>
                      <option value="Delivered">Entregado</option>
                    </select>
                    <select
                      value={editForm.paymentStatus}
                      onChange={(e) => setEditForm({ ...editForm, paymentStatus: e.target.value })}
                      className="bg-secondary/50 rounded-lg px-2 py-1 text-xs font-medium border-none outline-none h-8 cursor-pointer"
                    >
                      <option value="Paid">Pagado</option>
                      <option value="Pending">Pendiente</option>
                      <option value="Failed">Fallido</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Área de Scroll - He removido el ScrollArea de Shadcn y usado CSS nativo para descartar problemas de libreria */}
              <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10 scrollbar-thin scrollbar-thumb-border">
                {/* Cliente */}
                <section className="space-y-4">
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Información del Cliente</h3>
                  {isEditing ? (
                    <div className="space-y-3 p-4 rounded-xl bg-muted/20 border border-border">
                      <div className="space-y-1">
                        <label className="text-[10px] font-medium text-muted-foreground uppercase">Nombre</label>
                        <Input value={editForm.customerName} onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })} className="h-9 text-sm" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-medium text-muted-foreground uppercase">Email</label>
                          <Input value={editForm.customerEmail} onChange={(e) => setEditForm({ ...editForm, customerEmail: e.target.value })} className="h-9 text-sm" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-medium text-muted-foreground uppercase">Teléfono</label>
                          <Input value={editForm.customerPhone} onChange={(e) => setEditForm({ ...editForm, customerPhone: e.target.value })} className="h-9 text-sm" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      <div className="p-4 rounded-xl border border-border bg-card">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Nombre Completo</p>
                        <p className="text-sm font-semibold">{selectedOrder.customer.name}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 rounded-xl border border-border bg-card">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Email</p>
                          <p className="text-sm font-semibold truncate">{selectedOrder.customer.email}</p>
                        </div>
                        <div className="p-4 rounded-xl border border-border bg-card">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Teléfono</p>
                          <p className="text-sm font-semibold">{selectedOrder.customer.phone}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* Envío */}
                <section className="space-y-4">
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Detalles de Envío</h3>
                  {isEditing ? (
                    <div className="p-4 rounded-xl bg-muted/20 border border-border">
                      <label className="text-[10px] font-medium text-muted-foreground uppercase block mb-1">Dirección Completa</label>
                      <textarea
                        value={editForm.customerAddress}
                        onChange={(e) => setEditForm({ ...editForm, customerAddress: e.target.value })}
                        className="w-full min-h-20 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                      />
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-border bg-card flex gap-4">
                      <MapPin className="h-5 w-5 text-primary/50 shrink-0" />
                      <p className="text-sm font-medium leading-relaxed italic text-foreground/80">{selectedOrder.customer.address}</p>
                    </div>
                  )}
                </section>

                {/* Productos */}
                <section className="space-y-4">
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Resumen de Compra</h3>
                  <div className="rounded-xl border border-border bg-card divide-y divide-border">
                    {selectedOrder.items.map((item: any, id: number) => (
                      <div key={id} className="p-4 flex justify-between items-center text-sm">
                        <div className="flex gap-3 items-center">
                          <div className="h-8 w-8 rounded flex items-center justify-center bg-secondary font-bold text-xs">{item.quantity}</div>
                          <span className="font-semibold">{item.name}</span>
                        </div>
                        <span className="font-medium text-muted-foreground">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                    <div className="p-5 flex justify-between items-center bg-muted/5 border-t border-border mt-auto">
                      <span className="text-[10px] font-bold text-primary uppercase">Total Pagado</span>
                      <span className="text-xl font-serif font-bold text-primary">{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </section>

                {/* Historial */}
                <section className="space-y-6 pb-6">
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Historial de Eventos</h3>
                  <div className="relative space-y-6 pl-3 before:absolute before:left-2.75 before:top-2 before:bottom-2 before:w-px before:bg-border">
                    {selectedOrder.history.map((entry: any, idx: number) => (
                      <div key={idx} className="relative pl-8">
                        <div className={cn("absolute left-0 top-1.5 h-6 w-6 rounded-full flex items-center justify-center z-10", idx === 0 ? "bg-primary text-white scale-110" : "bg-muted border border-border scale-90")}>
                          {idx === 0 ? <CheckCircle className="h-3 w-3" /> : <div className="h-1 w-1 rounded-full bg-muted-foreground/50" />}
                        </div>
                        <div className="space-y-0.5">
                          <p className={cn("text-xs font-bold", idx === 0 ? "text-foreground" : "text-muted-foreground")}>{entry.status}</p>
                          <p className="text-[10px] text-muted-foreground font-medium">{new Date(entry.date).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Footer Fijo */}
              <div className="p-8 border-t border-border bg-card shrink-0">
                <div className="flex gap-3">
                  <Button className="flex-1 bg-primary text-white h-11 rounded-lg text-xs font-bold">
                    <Mail className="h-4 w-4 mr-2" /> Notificar al Cliente
                  </Button>
                  <Button variant="outline" className="h-11 w-11 rounded-lg border-border">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      <ShipmentModal 
        order={shipmentModalOrder}
        open={isShipmentModalOpen}
        onOpenChange={setIsShipmentModalOpen}
        onConfirm={handleConfirmShipment}
      />
    </div>
  )
}
