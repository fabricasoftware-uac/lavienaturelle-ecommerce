"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/change-password`,
    })

    if (!error) {
      setIsSent(true)
    } else {
      setError(error.message || "No se pudo enviar el correo de recuperación")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 mb-6 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio de sesión
          </Link>

          <div className="h-16 w-16 bg-stone-900 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-stone-200">
            <Mail className="h-8 w-8 text-white" />
          </div>

          <h1 className="text-3xl font-serif font-bold text-stone-900">¿Olvidaste tu contraseña?</h1>
          <p className="text-stone-500 font-medium">
            No te preocupes, te enviaremos instrucciones para restablecerla.
          </p>
        </div>

        {isSent ? (
          <div className="bg-white border border-stone-100 p-10 rounded-[40px] shadow-sm text-center space-y-6">
            <div className="h-12 w-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-stone-900">Correo enviado</h2>
              <p className="text-sm text-stone-500 font-medium">
                Hemos enviado un enlace de recuperación a <strong>{email}</strong>. Por favor, revisa tu bandeja de entrada.
              </p>
            </div>
            <Button
              className="w-full rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold h-12 transition-all"
              onClick={() => setIsSent(false)}
            >
              Intentar con otro correo
            </Button>
          </div>
        ) : (
          <div className="bg-white border border-stone-100 p-10 rounded-[40px] shadow-sm space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-bold border border-red-100">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-300" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 rounded-2xl border-stone-100 h-14 focus-visible:ring-primary/20 bg-stone-50/30"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold h-14 shadow-lg shadow-stone-200 transition-all flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Enviar enlace de recuperación"
                )}
              </Button>
            </form>
          </div>
        )}

        <p className="text-center text-sm text-stone-400 font-medium">
          ¿Recordaste tu contraseña?{" "}
          <Link href="/login" className="text-stone-900 hover:underline font-bold">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
