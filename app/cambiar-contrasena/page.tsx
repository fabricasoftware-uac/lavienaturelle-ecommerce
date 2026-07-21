"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Lock, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/supabase/types/client"
import { useToast } from "@/hooks/use-toast"

export default function CambiarContrasenaPage() {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  const [isRecovery, setIsRecovery] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setIsRecovery(true)
    })

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
    console.log("🔍 Session:", data.session)
    console.log("❌ Error:", error)
  })
}, [])
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }

    setLoading(true)

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    setSuccess(true)

    toast({
      title: "Contraseña actualizada",
      description: "Tu contraseña ha sido restablecida correctamente.",
    })

    setTimeout(() => {
      supabase.auth.signOut()
      router.push("/login")
      router.refresh()
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <div className="h-16 w-16 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/10">
            <ShieldCheck className="h-8 w-8 text-primary-foreground" />
          </div>

          <h1 className="text-3xl font-serif font-bold text-foreground">
            Nueva contraseña
          </h1>
          <p className="text-muted-foreground font-medium">
            Ingresa tu nueva contraseña segura.
          </p>
        </div>

        <div className="bg-card border border-border p-10 rounded-[40px] shadow-sm space-y-6">
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="h-14 w-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Redirigiendo al inicio de sesión...
              </p>
            </div>
          ) : !isRecovery ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-2xl bg-destructive/10 text-destructive text-sm font-bold border border-destructive/20">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="newPassword"
                  className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1"
                >
                  Nueva contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-12 pr-12 rounded-2xl border-border h-14 focus-visible:ring-primary/20 bg-muted/30"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1"
                >
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-12 rounded-2xl border-border h-14 focus-visible:ring-primary/20 bg-muted/30"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 shadow-lg shadow-primary/10 transition-all flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Restablecer contraseña"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
