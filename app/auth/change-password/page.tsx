"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Lock, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export default function ChangePasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    setIsLoading(true)

    const { error } = await supabase.auth.updateUser({ password })

    if (!error) {
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido restablecida correctamente. Ahora puedes iniciar sesión.",
      })
      router.push("/login")
    } else {
      setError(error.message || "No se pudo actualizar la contraseña")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <div className="h-16 w-16 bg-stone-900 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-stone-200">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>

          <h1 className="text-3xl font-serif font-bold text-stone-900">Nueva Contraseña</h1>
          <p className="text-stone-500 font-medium">
            Por favor ingresa tu nueva contraseña segura.
          </p>
        </div>

        <div className="bg-white border border-stone-100 p-10 rounded-[40px] shadow-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-bold border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1">
                Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-300" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 rounded-2xl border-stone-100 h-14 focus-visible:ring-primary/20 bg-stone-50/30"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-300" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                "Restablecer contraseña"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
