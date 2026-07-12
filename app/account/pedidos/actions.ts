'use server'

import { createClient } from '@/supabase/types/server'
import { OrderWithDetails, MappedOrder } from '@/supabase/types/database'

export async function getUserOrdersAction(): Promise<MappedOrder[]> {
  const supabase = await createClient()

  const { data: claims } = await supabase.auth.getClaims()
  const userId = claims?.claims?.sub
  if (!userId) return []

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (
          product_multimedia (url)
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user orders:', error)
    return []
  }

  const statusLabel: Record<string, string> = {
    pending: 'Pendiente',
    paid: 'Pagado',
    processing: 'Procesando',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
    refunded: 'Reembolsado',
  }

  return (data as OrderWithDetails[]).map((o) => {
    const status = o.status || 'pending'
    return {
      id: o.order_number || o.id,
      realId: o.id,
      full_name: o.full_name,
      phone: o.phone ?? null,
      productName: o.order_items?.[0]?.product_name_snapshot || 'Pedido',
      mainImage: o.order_items?.[0]?.products?.product_multimedia?.[0]?.url || '/logo-script.png',
      status: statusLabel[status] || status,
      statusRaw: status,
      statusColor: status === 'delivered' ? 'green' : status === 'shipped' ? 'blue' : 'amber',
      tracking_number: o.tracking_number ?? null,
      courier_name: o.courier_name ?? null,
      trackingId: o.tracking_number || 'Pendiente',
      carrier: o.courier_name || 'Pendiente',
      date: o.created_at ? new Date(o.created_at).toLocaleDateString() : 'N/A',
      items: o.order_items?.length || 0,
      total: Number(o.total_amount) || 0,
      order_items: o.order_items || [],
      address: [o.shipping_address_line1, o.shipping_address_line2, o.shipping_city, o.shipping_state]
        .filter(Boolean)
        .join(', ') || 'Dirección no registrada',
      paymentMethod: o.payment_method ?? 'Tarjeta de Crédito',
    }
  })
}
