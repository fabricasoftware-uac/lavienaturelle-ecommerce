"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { MappedOrder } from "@/lib/supabase/types/database"
import { OrdersSection } from "../components/OrdersSection"

const OrderDetailsSheet = dynamic(
  () => import("../components/OrderDetailsSheet").then((mod) => mod.OrderDetailsSheet),
  { ssr: false }
)

import { TrackingModal } from "../components/TrackingModal"

interface PedidosContentProps {
  orders: MappedOrder[]
}

export function PedidosContent({ orders }: PedidosContentProps) {
  const [selectedOrder, setSelectedOrder] = useState<MappedOrder | null>(null)
  const [trackingOrder, setTrackingOrder] = useState<MappedOrder | null>(null)

  return (
    <>
      <OrdersSection
        orders={orders}
        onViewDetails={setSelectedOrder}
        onTrack={setTrackingOrder}
      />

      <OrderDetailsSheet
        order={selectedOrder}
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
        onTrack={(order) => {
          setSelectedOrder(null)
          setTrackingOrder(order)
        }}
      />

      <TrackingModal
        order={trackingOrder}
        open={!!trackingOrder}
        onOpenChange={(open) => !open && setTrackingOrder(null)}
      />
    </>
  )
}
