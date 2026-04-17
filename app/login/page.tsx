"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Leaf, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store-context"

function LoginForm() {
  const router = useRouter()
  const { login } = useStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const success = login(email, password)
    if (success) {
      // Check if admin or user
      if (email === "admin@gmail.com") {
        router.push("/admin")
      } else {
        router.push("/")
      }
    } else {
      setError("Correo o contrasena invalidos")
    }
    setIsLoading(false)
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
          <Link href="/" className="flex items-center gap-3 mb-8">
            <Leaf className="h-12 w-12 text-primary" />
            <span className="font-serif text-3xl font-semibold text-foreground">La Vie Naturelle</span>
          </Link>
          <div className="max-w-md text-center">
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
              Bienvenido de vuelta a la naturaleza
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Inicia sesion para acceder a tu cuenta, rastrear pedidos y descubrir 
              recomendaciones personalizadas para tu viaje de bienestar.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=200&h=200&fit=crop"
              alt="Aceites esenciales"
              className="w-32 h-32 rounded-2xl object-cover shadow-lg"
            />
            <img
              src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200&h=200&fit=crop"
              alt="Te herbal"
              className="w-32 h-32 rounded-2xl object-cover shadow-lg mt-8"
            />
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la tienda
          </Link>

          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="font-serif text-xl font-semibold text-foreground">La Vie Naturelle</span>
          </div>

          <h1 className="font-serif text-3xl font-semibold text-foreground mb-2">Iniciar Sesion</h1>
          <p className="text-muted-foreground mb-8">
            Ingresa tus credenciales para acceder a tu cuenta
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Correo Electronico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Contrasena
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contrasena"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Olvidaste tu contrasena?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesion..." : "Iniciar Sesion"}
            </Button>
          </form>

          <div className="mt-8 p-4 rounded-xl bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground mb-2 font-medium">Credenciales de Prueba:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><span className="font-medium">Usuario:</span> usuario@gmail.com / testuser</p>
              <p><span className="font-medium">Admin:</span> admin@gmail.com / testuser</p>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            No tienes una cuenta?{" "}
            <a href="/register" className="text-primary hover:underline font-medium">
              Crear una
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <LoginForm />
}
