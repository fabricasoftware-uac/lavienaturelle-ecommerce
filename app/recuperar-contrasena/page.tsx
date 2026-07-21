"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/supabase/types/client"

const COOLDOWN_SECONDS = 120

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function RecuperarContrasenaPage() {
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (loading || cooldown > 0) return
      if (!isValidEmail(email)) return

      setLoading(true)

      const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/cambiar-contrasena`

      await supabase.auth.resetPasswordForEmail(email, { redirectTo })

      setLoading(false)
      setSent(true)
      setCooldown(COOLDOWN_SECONDS)
    },
    [email, loading, cooldown, supabase]
  )

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio de sesión
          </Link>

          <div className="h-16 w-16 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/10">
            <Mail className="h-8 w-8 text-primary-foreground" />
          </div>

          <h1 className="text-3xl font-serif font-bold text-foreground">
            Recuperar contraseña
          </h1>
          <p className="text-muted-foreground font-medium">
            Te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>

        {sent ? (
          <div className="bg-card border border-border p-10 rounded-[40px] shadow-sm text-center space-y-6">
            <div className="h-12 w-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">Revisa tu correo</h2>
              <p className="text-sm text-muted-foreground font-medium">
                Si existe una cuenta con <strong>{email}</strong>, recibirás un enlace
                para restablecer tu contraseña.
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full rounded-2xl h-12 font-bold"
              disabled={cooldown > 0}
              onClick={() => {
                setSent(false)
                setEmail("")
              }}
            >
              {cooldown > 0
                ? `Reintentar en ${cooldown}s`
                : "Enviar otro enlace"}
            </Button>
          </div>
        ) : (
          <div className="bg-card border border-border p-10 rounded-[40px] shadow-sm space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1"
                >
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 rounded-2xl border-border h-14 focus-visible:ring-primary/20 bg-muted/30"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 shadow-lg shadow-primary/10 transition-all flex items-center justify-center gap-2"
                disabled={loading || cooldown > 0}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Enviar enlace de recuperación"
                )}
              </Button>
            </form>
          </div>
        )}

        <p className="text-center text-sm text-muted-foreground font-medium">
          ¿Recordaste tu contraseña?{" "}
          <Link
            href="/login"
            className="text-foreground hover:underline font-bold"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
