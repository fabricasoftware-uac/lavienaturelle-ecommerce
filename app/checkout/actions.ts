'use server'

import { createClient } from '@/supabase/types/server'
import { Order } from '@/supabase/types/database'

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

export async function validateStockAction(
  items: { id: string; quantity: number }[]
): Promise<{ valid: boolean; error?: string }> {
  const supabase = await createClient()

  const productIds = items.map((i) => i.id)
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, stock_quantity')
    .in('id', productIds)

  if (error) {
    return { valid: false, error: 'Error al verificar inventario' }
  }

  const stockMap = new Map(products?.map((p: any) => [p.id, p]) || [])

  for (const item of items) {
    const product = stockMap.get(item.id)
    if (!product) {
      return { valid: false, error: `Producto no encontrado en el inventario` }
    }
    if (product.stock_quantity < item.quantity) {
      return {
        valid: false,
        error: `Stock insuficiente para ${product.name}: disponible ${product.stock_quantity}, requerido ${item.quantity}`,
      }
    }
  }

  return { valid: true }
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

  // Check if this exact address already exists for the user
  const { data: existing } = await supabase
    .from('addresses')
    .select('id')
    .eq('user_id', userId)
    .eq('address_line1', addressData.address_line1!)
    .eq('city', addressData.city!)
    .eq('state', addressData.state!)
    .is('deleted_at', null)
    .maybeSingle()

  if (existing) {
    // Address already exists – skip duplicate
    return { success: true }
  }

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
