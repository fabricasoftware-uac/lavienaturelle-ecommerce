import { createClient } from "./client"
import type { Order } from "@/lib/supabase/types/database"

export async function getOrders() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error)
    return []
  }

  return data
}

export async function updateOrder(orderId: string, updates: Partial<Order>) {
  const supabase = createClient()

  const { error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId)

  if (error) {
    console.error("Error updating order:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function getOrderByTracking(orderNumber: string, documentNumber: string) {
  const supabase = createClient()

  const { data, error } = await supabase.rpc('get_order_by_tracking', {
    order_num: orderNumber,
    doc_num: documentNumber,
  })

  if (error) {
    console.error("Error fetching tracking order:", error)
    return null
  }

  return data as Record<string, any> | null
}

export async function deleteOrder(orderId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId)

  if (error) {
    console.error("Error deleting order:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
