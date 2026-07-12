"use client"

import { Button } from "@/components/ui/button"
import { OrderCard } from "./OrderCard"
import { Skeleton } from "@/components/ui/skeleton"
import { MappedOrder } from "@/supabase/types/database"

interface OrdersSectionProps {
  orders: MappedOrder[]
  onViewDetails: (order: MappedOrder) => void
  onTrack: (order: MappedOrder) => void
}

export function OrdersSection({ orders, onViewDetails, onTrack }: OrdersSectionProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-20 bg-white border border-stone-100 rounded-4xl">
        <p className="text-stone-400 font-medium">Aún no tienes pedidos.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm font-medium text-stone-500">Gestiona y rastrea tus pedidos recientes.</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-xl border-stone-200 text-xs font-bold bg-white h-9">
            Todos
          </Button>
          <Button variant="ghost" size="sm" className="rounded-xl text-xs font-bold text-stone-400 h-9">
            En Proceso
          </Button>
          <Button variant="ghost" size="sm" className="rounded-xl text-xs font-bold text-stone-400 h-9">
            Completados
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onViewDetails={() => onViewDetails(order)}
            onTrack={() => onTrack(order)}
          />
        ))}
      </div>
    </div>
  )
}
