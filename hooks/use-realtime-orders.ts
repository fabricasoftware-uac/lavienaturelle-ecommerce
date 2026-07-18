"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { createClient } from "@/supabase/types/client"

export function useRealtimeOrders(initialOrders: any[] = []) {
  const supabase = useMemo(() => createClient(), [])
  const [orders, setOrders] = useState<any[]>(initialOrders)
  const [loading, setLoading] = useState(true)

  const refetchOrders = useCallback(async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `)
      .order("created_at", { ascending: false })

    if (error || !data) return

    const mappedOrders = data.map((o: any) => ({
      id: o.order_number || o.id,
      realId: o.id,
      customer: {
        name: o.full_name ?? "Sin nombre",
        email: o.email ?? "",
        phone: o.phone || "No especificado",
        documentNumber: o.document_number || "No especificado",
        address: `${o.shipping_address_line1 ?? ""}${o.shipping_address_line2 ? ', ' + o.shipping_address_line2 : ''}, ${o.shipping_city ?? ""}, ${o.shipping_state ?? ""}`,
        addressLine1: o.shipping_address_line1 ?? "",
        addressLine2: o.shipping_address_line2 || "",
        city: o.shipping_city ?? "",
        state: o.shipping_state ?? "",
      },
      date: o.created_at,
      shippingStatus: (o.status ?? "pending").charAt(0).toUpperCase() + (o.status ?? "pending").slice(1),
      paymentStatus: (o.payment_status ?? "pending").charAt(0).toUpperCase() + (o.payment_status ?? "pending").slice(1),
      total: Number(o.total_amount ?? 0),
      items: (o.order_items ?? []).map((item: any) => ({
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
  }, [supabase])

  useEffect(() => {
    setLoading(true)
    refetchOrders().finally(() => setLoading(false))
  }, [refetchOrders])

  useEffect(() => {
    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          refetchOrders()
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "order_items" },
        () => {
          refetchOrders()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, refetchOrders])

  return { orders, loading, refetch: refetchOrders }
}
