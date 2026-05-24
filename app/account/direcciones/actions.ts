'use server'

import { createClient } from '@/lib/supabase/server'
import { Address } from '@/lib/supabase/types/database'

export async function getUserAddressesAction(): Promise<Address[]> {
  const supabase = await createClient()

  const { data: claims } = await supabase.auth.getClaims()
  const userId = claims?.claims?.sub
  if (!userId) return []

  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching addresses:', error)
    return []
  }

  return data || []
}

export async function createAddressAction(
  addressData: Address
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { data: claims } = await supabase.auth.getClaims()
  const userId = claims?.claims?.sub
  if (!userId) return { success: false, error: 'No autenticado' }

  if (addressData.is_default) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', userId)
  }

  const { error } = await supabase
    .from('addresses')
    .insert([{ ...addressData, user_id: userId }])

  if (error) {
    console.error('Error creating address:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function updateAddressAction(
  addressId: string,
  updates: Partial<Address>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { data: claims } = await supabase.auth.getClaims()
  const userId = claims?.claims?.sub
  if (!userId) return { success: false, error: 'No autenticado' }

  if (updates.is_default && userId) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', userId)
      .neq('id', addressId)
  }

  const { error } = await supabase
    .from('addresses')
    .update(updates)
    .eq('id', addressId)

  if (error) {
    console.error('Error updating address:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteAddressAction(
  addressId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('addresses')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', addressId)

  if (error) {
    console.error('Error deleting address:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
