'use server'

import { z } from 'zod'
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
  totalAmount?: number
  error?: string
}

const orderSchema = z.object({
  order_number: z.string().min(1),
  user_id: z.string().uuid().nullable().optional(),
  email: z.string().email('Email inválido'),
  full_name: z.string().min(2, 'El nombre es requerido'),
  phone: z.string().optional().nullable(),
  document_number: z.string().min(1, 'El número de documento es requerido'),
  total_amount: z.number().min(0).optional(),
  shipping_cost: z.number().min(0).optional(),
  tax_amount: z.number().min(0).optional(),
  shipping_address_line1: z.string().min(1, 'La dirección es requerida'),
  shipping_address_line2: z.string().optional().nullable(),
  shipping_city: z.string().min(1, 'La ciudad es requerida'),
  shipping_state: z.string().min(1, 'El departamento es requerido'),
  shipping_country: z.string().optional(),
  payment_status: z.string().optional(),
  payment_method: z.string().optional(),
  status: z.string().optional(),
})

const itemsSchema = z.array(z.object({
  id: z.string().uuid('ID de producto inválido'),
  name: z.string().min(1),
  sku: z.string().optional().default(''),
  price: z.number().positive(),
  quantity: z.number().int().positive('La cantidad debe ser mayor a 0'),
})).min(1, 'El carrito no puede estar vacío')

export async function createOrderAction(
  orderData: Partial<Order>,
  items: CartItem[]
): Promise<CreateOrderResult> {
  const supabase = await createClient()

  try {
    // 1. Validate input with Zod
    const orderInput = {
      order_number: orderData.order_number || `LVN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      user_id: orderData.user_id || null,
      email: orderData.email,
      full_name: orderData.full_name,
      phone: orderData.phone || null,
      document_number: orderData.document_number,
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

    const orderValidation = orderSchema.safeParse(orderInput)
    if (!orderValidation.success) {
      const firstError = orderValidation.error.errors[0]
      return { success: false, error: firstError?.message || 'Datos del pedido inválidos' }
    }

    const itemsValidation = itemsSchema.safeParse(items)
    if (!itemsValidation.success) {
      const firstError = itemsValidation.error.errors[0]
      return { success: false, error: firstError?.message || 'Productos del carrito inválidos' }
    }

    // 2. Build JSON payloads for the RPC
    const p_order = orderValidation.data
    const p_items = itemsValidation.data.map((item) => ({
      id: item.id,
      name: item.name,
      sku: item.sku,
      price: item.price,
      quantity: item.quantity,
    }))

    // 3. Use SECURITY DEFINER RPC to bypass RLS entirely.
    //    RPC reads prices from DB (not client), calculates total, decrements stock.
    const { data, error } = await supabase.rpc('create_order_with_items', {
      p_order,
      p_items,
    })

    if (error) {
      console.error('Error creating order via RPC:', error)
      const msg = error.message || 'Error al procesar el pedido'
      // Make stock errors user-friendly
      if (msg.includes('Stock insuficiente')) {
        return { success: false, error: msg }
      }
      return { success: false, error: msg }
    }

    const result = data as Record<string, any> | null

    return {
      success: true,
      orderId: result?.id as string,
      orderNumber: result?.order_number as string,
      totalAmount: result?.total_amount as number,
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