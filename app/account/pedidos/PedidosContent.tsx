"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { MappedOrder } from "@/lib/supabase/types/database"
import { OrdersSection } from "../components/OrdersSection"
import { InfiniteScroll } from "@/components/infinite-scroll"

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
  const [displayCount, setDisplayCount] = useState(10)
  const STEP = 10

  const visibleOrders = orders.slice(0, displayCount)
  const hasMore = displayCount < orders.length

  return (
    <>
      <OrdersSection
        orders={visibleOrders}
        onViewDetails={setSelectedOrder}
        onTrack={setTrackingOrder}
      />

      <InfiniteScroll loadMore={() => setDisplayCount(prev => prev + STEP)} hasMore={hasMore} />

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
