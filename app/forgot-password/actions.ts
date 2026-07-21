"use server"

import * as React from "react"
import { createServiceRoleClient } from "@/supabase/types/service-role"
import { resend } from "@/lib/email/resend"
import { PasswordResetEmail } from "@/lib/email/templates/password-reset"

export async function sendPasswordResetEmail(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServiceRoleClient()

    const { data, error } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/change-password`,
      },
    })

    if (error || !data.properties.action_link) {
      // No revelar si el usuario existe o no — siempre responder éxito
      console.error("Error generating reset link:", error?.message || "No action link")
      return { success: true }
    }

    const resetLink = data.properties.action_link

    const { error: emailError } = await resend.emails.send({
      from: process.env.RESEND_FROM || "La Vie Naturelle <noreply@lavienaturelle.com>",
      to: email,
      subject: "Restablece tu contraseña — La Vie Naturelle",
      react: React.createElement(PasswordResetEmail, { resetLink }),
    })

    if (emailError) {
      console.error("Error sending email:", emailError)
      return { success: false, error: "No se pudo enviar el correo de recuperación" }
    }

    return { success: true }
  } catch (err: any) {
    console.error("Unexpected error:", err)
    return { success: false, error: "Error inesperado al enviar el correo" }
  }
}
