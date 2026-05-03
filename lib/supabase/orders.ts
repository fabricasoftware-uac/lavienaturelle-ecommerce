import { createClient } from "./client"
import { Order, OrderItem, Address } from "@/types/database"

export async function createOrder(orderData: Partial<Order>, items: any[]) {
  const supabase = createClient()
  
  // 1. Insert order
  if (!orderData.order_number) {
    orderData.order_number = `LVN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single()

  if (orderError) {
    console.error("Error creating order:", orderError)
    return { success: false, error: orderError.message }
  }

  // 2. Insert order items
  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    unit_price: item.price,
    total_price: item.price * item.quantity,
    product_name_snapshot: item.name,
    product_sku_snapshot: item.sku || ''
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    console.error("Error creating order items:", itemsError)
    // Optional: Delete the order if items fail (but Supabase doesn't have transactions across multiple calls easily without RPC)
    return { success: false, error: itemsError.message }
  }

  return { success: true, orderId: order.id, orderNumber: order.order_number }
}

export async function saveUserAddress(userId: string, addressData: Partial<Address>) {
  const supabase = createClient()
  
  // Insert the address for the user
  const { error } = await supabase
    .from('addresses')
    .insert({
      user_id: userId,
      ...addressData,
      is_default: true,
    })

  if (error) {
    console.error("Error saving address:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

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

export async function getUserOrders(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching user orders:", error)
    return []
  }

  return data
}

export async function getOrderByTracking(orderNumber: string, documentNumber: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('order_number', orderNumber.toUpperCase())
    .eq('document_number', documentNumber)
    .single()

  if (error) {
    console.error("Error fetching tracking order:", error)
    return null
  }

  return data
}
