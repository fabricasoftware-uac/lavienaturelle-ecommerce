'use server'

import { randomUUID } from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { Order, OrderStatus, PaymentStatus } from '@/lib/supabase/types/database'

interface CartItem {
  id: string
  name: string
  sku?: string
  price: number
  quantity: number
}

interface CreateOrderResult {
  success: boolean
  orderId?: string
  orderNumber?: string
  error?: string
}

export async function createOrderAction(
  orderData: Partial<Order>,
  items: CartItem[]
): Promise<CreateOrderResult> {
  const supabase = await createClient()

  try {
    // 1. Generate order number and id if not provided
    if (!orderData.order_number) {
      orderData.order_number = `LVN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    }
    const orderId = orderData.id ?? randomUUID()
    const orderDataWithId = { ...orderData, id: orderId }

    // 2. Insert order (no .select() to avoid RLS SELECT denial for anon users)
    const { error: orderError } = await supabase
      .from('orders')
      .insert([orderDataWithId as any])

    if (orderError) {
      console.error('Error creating order:', orderError)
      return { success: false, error: orderError.message }
    }

    // 3. Insert order items
    const orderItems = items.map((item) => ({
      order_id: orderId,
      product_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
      product_name_snapshot: item.name,
      product_sku_snapshot: item.sku || '',
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      return { success: false, error: itemsError.message }
    }

    return {
      success: true,
      orderId,
      orderNumber: orderData.order_number,
    }
  } catch (err: any) {
    console.error('Unexpected error creating order:', err)
    return { success: false, error: err.message || 'Error inesperado' }
  }
}

export async function saveUserAddressAction(
  userId: string,
  addressData: Partial<{
    address_line1: string
    address_line2?: string
    city: string
    state: string
    country: string
  }>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.from('addresses').insert({
    user_id: userId,
    ...addressData,
  } as any)

  if (error) {
    console.error('Error saving address:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
