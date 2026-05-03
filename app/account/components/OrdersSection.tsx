"use client"

import { Button } from "@/components/ui/button"
import { OrderCard } from "./OrderCard"
import { getUserOrders } from "@/lib/supabase/orders"
import { useStore } from "@/lib/store-context"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface OrdersSectionProps {
  onViewDetails: (order: any) => void
  onTrack: (order: any) => void
}

export function OrdersSection({ onViewDetails, onTrack }: OrdersSectionProps) {
  const { user } = useStore()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOrders() {
      if (!user?.id) return
      setLoading(true)
      const data = await getUserOrders(user.id)
      
      const mappedOrders = data.map((o: any) => ({
        id: o.order_number || o.id,
        realId: o.id,
        productName: o.order_items[0]?.product_name_snapshot || "Pedido",
        mainImage: "/placeholder-product.png", // We could try to find the real image if we fetched it
        status: o.status.charAt(0).toUpperCase() + o.status.slice(1),
        statusColor: o.status === 'delivered' ? 'green' : o.status === 'shipped' ? 'blue' : 'amber',
        trackingId: o.tracking_number || "Pendiente",
        date: new Date(o.created_at).toLocaleDateString(),
        items: o.order_items.length,
        total: Number(o.total_amount),
        carrier: o.courier_name || "Pendiente",
        order_items: o.order_items // Keep for details
      }))

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
