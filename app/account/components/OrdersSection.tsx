"use client"

import { Button } from "@/components/ui/button"
import { OrderCard } from "./OrderCard"
import { getUserOrders } from "@/lib/supabase/orders"
import { useStore } from "@/lib/cart-context"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { OrderWithDetails, MappedOrder } from "@/types/database"

interface OrdersSectionProps {
  onViewDetails: (order: MappedOrder) => void
  onTrack: (order: MappedOrder) => void
}

export function OrdersSection({ onViewDetails, onTrack }: OrdersSectionProps) {
  const { user } = useStore()
  const [orders, setOrders] = useState<MappedOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOrders() {
      if (!user?.id) return
      setLoading(true)
      const data = await getUserOrders(user.id) as OrderWithDetails[]
      
      const mappedOrders: MappedOrder[] = data.map((o: OrderWithDetails) => {
        const status = o.status || 'pending'
        return {
          id: o.order_number || o.id,
          realId: o.id,
          full_name: o.full_name,
          phone: o.phone ?? null,
          productName: o.order_items?.[0]?.product_name_snapshot || "Pedido",
          mainImage: o.order_items?.[0]?.products?.product_multimedia?.[0]?.url || "/logo-script.png",
          status: status.charAt(0).toUpperCase() + status.slice(1),
          statusColor: status === 'delivered' ? 'green' : status === 'shipped' ? 'blue' : 'amber',
          tracking_number: o.tracking_number ?? null,
          courier_name: o.courier_name ?? null,
          trackingId: o.tracking_number || "Pendiente",
          carrier: o.courier_name || "Pendiente",
          date: o.created_at ? new Date(o.created_at).toLocaleDateString() : "N/A",
          items: o.order_items?.length || 0,
          total: Number(o.total_amount) || 0,
          order_items: o.order_items || [],
          address: [
            o.shipping_address_line1,
            o.shipping_address_line2,
            o.shipping_city,
            o.shipping_state
          ].filter(Boolean).join(', ') || "Dirección no registrada",
          paymentMethod: o.payment_method ?? "Tarjeta de Crédito"
        }
      })

      setOrders(mappedOrders)
      setLoading(false)
    }

    loadOrders()
  }, [user])

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <p className="text-sm font-medium text-stone-500">Gestiona y rastrea tus pedidos recientes.</p>
         <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-xl border-stone-200 text-xs font-bold bg-white h-9">Todos</Button>
            <Button variant="ghost" size="sm" className="rounded-xl text-xs font-bold text-stone-400 h-9">En Proceso</Button>
            <Button variant="ghost" size="sm" className="rounded-xl text-xs font-bold text-stone-400 h-9">Completados</Button>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-4xl" />
          ))
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onViewDetails={() => onViewDetails(order)} 
              onTrack={() => onTrack(order)}
            />
          ))
        ) : (
          <div className="text-center py-20 bg-white border border-stone-100 rounded-4xl">
            <p className="text-stone-400 font-medium">Aún no tienes pedidos.</p>
          </div>
        )}
      </div>
    </div>
  )
}
