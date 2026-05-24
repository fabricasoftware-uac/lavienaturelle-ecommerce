import { createClient } from "./client"
import { Address } from "@/lib/supabase/types/database"

export async function getUserAddresses(userId: string): Promise<Address[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching user addresses:", error)
    return []
  }

  return data || []
}

export async function createAddress(addressData: Partial<Address>) {
  const supabase = createClient()
  
  // If this is the first address, or is_default is true, we might want to handle default logic
  if (addressData.is_default) {
    // Reset other defaults
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', addressData.user_id!)
  }

  const { data, error } = await supabase
    .from('addresses')
    .insert([addressData])
    .select()
    .single()

  if (error) {
    console.error("Error creating address:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function updateAddress(addressId: string, updates: Partial<Address>) {
  const supabase = createClient()
  
  if (updates.is_default && updates.user_id) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', updates.user_id)
      .neq('id', addressId)
  }

  const { data, error } = await supabase
    .from('addresses')
    .update(updates)
    .eq('id', addressId)
    .select()
    .single()

  if (error) {
    console.error("Error updating address:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function deleteAddress(addressId: string) {
  const supabase = createClient()
  
  // Logical delete
  const { error } = await supabase
    .from('addresses')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', addressId)

  if (error) {
    console.error("Error deleting address:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
