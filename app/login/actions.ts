'use server'

import { createClient } from "@/supabase/types/server"
import { claimGuestOrdersAction } from "../account/perfil/actions"

const errorTranslations: Record<string, string> = {
  'Invalid login credentials': 'Correo o contraseña incorrectos',
  'Email not confirmed': 'Correo electrónico no confirmado',
  'Invalid email or password': 'Correo o contraseña incorrectos',
  'User already registered': 'Este correo ya está registrado',
  'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
  'Email rate limit exceeded': 'Demasiados intentos. Intenta de nuevo más tarde',
  'Signup requires a valid password': 'La contraseña debe tener al menos 6 caracteres',
}

function translateError(message: string): string {
  return errorTranslations[message] || message
}

export async function loginAction(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error: translateError(error.message) }
  }

  const role = data.user?.app_metadata?.role || "customer"

  // Link any guest orders placed with this email to the authenticated user
  await claimGuestOrdersAction()

  return { success: true, role }
}
export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}