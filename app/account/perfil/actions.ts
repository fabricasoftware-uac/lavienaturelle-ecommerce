'use server'

import { createClient } from '@/lib/supabase/server'

export interface SessionUser {
  id: string
  email: string
  name: string
  phone: string | null
  document_number: string | null
  role: string
}

export async function getSessionUserAction(): Promise<SessionUser | null> {
  const supabase = await createClient()

  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims
  if (!claims?.sub) return null

  return {
    id: claims.sub,
    email: claims.email ?? '',
    name: claims.user_metadata?.full_name || claims.user_metadata?.name || '',
    phone: claims.user_metadata?.phone || null,
    document_number: claims.user_metadata?.document_number || null,
    role: claims.app_metadata?.role || 'customer',
  }
}

export async function updateProfileAction(data: {
  name: string
  phone: string
  document_number: string
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { data: claims } = await supabase.auth.getClaims()
  const userId = claims?.claims?.sub
  if (!userId) return { success: false, error: 'No autenticado' }

  const updatePayload = {
    full_name: data.name,
    phone: data.phone,
    document_number: data.document_number,
  }

  const { error: authError } = await supabase.auth.updateUser({
    data: updatePayload,
  })
  if (authError) {
    console.error('Error updating auth user:', authError)
    return { success: false, error: authError.message }
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update(updatePayload)
    .eq('id', userId)

  if (profileError) {
    console.error('Error updating profile:', profileError)
    return { success: false, error: profileError.message }
  }

  return { success: true }
}

export async function changePasswordAction(
  password: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    console.error('Error changing password:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
