'use server'

import { createClient } from "@/lib/supabase/server"

export async function loginAction(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  const role = data.user?.app_metadata?.role || "customer"
  
  return { success: true, role }
}
export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}