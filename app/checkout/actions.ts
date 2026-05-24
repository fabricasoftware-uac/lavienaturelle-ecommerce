'use server'

import { createClient } from '@/lib/supabase/server'
import { Order } from '@/lib/supabase/types/database'

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
    // 1. Generate order number if not provided
    if (!orderData.order_number) {
      orderData.order_number = `LVN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    }

    // 2. Build JSON payloads for the RPC
    const p_order = {
      order_number: orderData.order_number,
      user_id: orderData.user_id || null,
      email: orderData.email,
      full_name: orderData.full_name,
      phone: orderData.phone || null,
      document_number: orderData.document_number || null,
      total_amount: orderData.total_amount,
      shipping_cost: orderData.shipping_cost || 0,
      tax_amount: orderData.tax_amount || 0,
      shipping_address_line1: orderData.shipping_address_line1,
      shipping_address_line2: orderData.shipping_address_line2 || null,
      shipping_city: orderData.shipping_city,
      shipping_state: orderData.shipping_state,
      shipping_country: orderData.shipping_country || 'Colombia',
      payment_status: orderData.payment_status || 'pending',
      payment_method: orderData.payment_method || null,
      status: orderData.status || 'pending',
    }

    const p_items = items.map((item) => ({
      id: item.id,
      name: item.name,
      sku: item.sku || '',
      price: item.price,
      quantity: item.quantity,
    }))

    // 3. Use SECURITY DEFINER RPC to bypass RLS entirely.
    //    Inserts order + items atomically and returns { id, order_number }.
    const { data, error } = await supabase.rpc('create_order_with_items', {
      p_order,
      p_items,
    })

    if (error) {
      console.error('Error creating order via RPC:', error)
      return { success: false, error: error.message }
    }

    const result = data as Record<string, any> | null

    return {
      success: true,
      orderId: result?.id as string,
      orderNumber: result?.order_number as string,
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
