"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Leaf, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/cart-context"
import { loginAction } from "./actions"

function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    const result = await loginAction(email, password)
    
    if (result.success) {
      router.push("/")
      router.refresh()
    } else {
      setError(result.error || "Correo o contraseña inválidos")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <div className="max-w-md text-center">
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
              Bienvenido de vuelta!
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Inicia sesion para acceder a tu cuenta, rastrear pedidos y descubrir 
              recomendaciones para tu bienestar.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-lg space-y-8">
          {/* Logo (Mobile) */}
          <div className="flex lg:hidden items-center justify-center mb-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo_header.png"
                alt="La Vie Naturelle Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </Link>
          </div>

          <div className="bg-white border border-border p-10 rounded-[40px] shadow-sm space-y-6">
            <div className="text-center space-y-2">
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium mb-6">
                <ArrowLeft className="h-4 w-4" />
                Volver a la tienda
              </Link>
              <h1 className="font-serif text-3xl font-bold text-foreground">Iniciar Sesion</h1>
              <p className="text-muted-foreground font-medium">
                Ingresa tus credenciales para acceder a tu cuenta
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-bold border border-red-100">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">
                  Correo Electronico
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 rounded-2xl border-border h-12 focus-visible:ring-primary/20 bg-muted/30"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">
                  Contrasena
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contrasena"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 rounded-2xl border-border h-12 focus-visible:ring-primary/20 bg-muted/30"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Link href="/forgot-password" className="text-xs font-bold text-primary hover:underline">
                  Olvidaste tu contrasena?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold h-14 shadow-lg shadow-stone-200 transition-all"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesion..." : "Iniciar Sesion"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground font-medium pt-4">
              No tienes una cuenta?{" "}
              <a href="/register" className="text-foreground hover:underline font-bold ml-1">
                Crear una
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


export default function LoginPage() {
  return <LoginForm />
}
