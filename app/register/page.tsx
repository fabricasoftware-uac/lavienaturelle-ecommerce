"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Leaf, Mail, Lock, User, Eye, EyeOff, ArrowLeft, CheckCircle2, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store-context"
import Image from "next/image"

function RegisterForm() {
  const router = useRouter()
  const { register } = useStore()
  
  const [name, setName] = useState("")
  const [documentNumber, setDocumentNumber] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (password !== confirmPassword) {
      setError("Las contrasenas no coinciden")
      return
    }

    if (password.length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres")
      return
    }

    setIsLoading(true)
    
    const result = await register(name, email, password, documentNumber, phone)
    
    if (result.success) {
      setIsSuccess(true)
      setTimeout(() => {
        router.push("/")
      }, 1000)
    } else {
      setError(result.error || "Error al crear la cuenta. Intentalo de nuevo.")
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 text-center">
        <div className="max-w-md space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">Cuenta creada con exito!</h1>
          <p className="text-muted-foreground">
            Bienvenido a La Vie Naturelle, {name}. Te estamos redirigiendo a la tienda...
          </p>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-40 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <Link href="/" className="flex items-center gap-3 mb-8">
            <Image
                src="/logo_header.png"
                alt="La Vie Naturelle Logo"
                className="h-20 w-auto object-contain"
                height={50}
                width={50}
            />
          </Link>
          <div className="max-w-md text-center">
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
              Comienza tu viaje hacia lo natural
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Unate a nuestra comunidad y descubre como los ingredientes naturales 
              pueden transformar tu rutina de cuidado personal.
            </p>
          </div>
          <div className="mt-12 relative">
            <div className="absolute -inset-4 bg-linear-to-tr from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-50" />
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=400&fit=crop"
              alt="Natural products"
              className="relative w-64 h-64 rounded-2xl object-cover shadow-2xl border-4 border-white/50"
            />
          </div>
          <div className="mt-8 flex gap-4">
            <div className="px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-border text-xs font-medium text-primary">
              100% Organico
            </div>
            <div className="px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-border text-xs font-medium text-primary">
              Sin Quimicos
            </div>
            <div className="px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-border text-xs font-medium text-primary">
              Cruelty Free
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la tienda
          </Link>

          <div className="lg:hidden flex items-center gap-2 mb-8 text-primary">
            <Image
                src="/logo_header.png"
                alt="La Vie Naturelle Logo"
                className="h-12 w-auto object-contain"
                height={50}
                width={50}
            />
          </div>

          <div className="mb-8">
            <h1 className="font-serif text-3xl font-semibold text-foreground mb-2">Crear Cuenta</h1>
            <p className="text-muted-foreground">
              Registrate para comenzar a disfrutar de beneficios exclusivos
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20 animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Nombre Completo
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Juan Perez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-11 transition-all focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="documentNumber" className="text-sm font-medium text-foreground">
                  Numero de Documento
                </label>
                <div className="relative group">
                  <Input
                    id="documentNumber"
                    type="text"
                    placeholder="1234567890"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    className="h-11 transition-all focus:ring-primary/20"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-foreground">
                  Telefono
                </label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="300 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 h-11 transition-all focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Correo Electronico
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 transition-all focus:ring-primary/20"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Contrasena
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 transition-all focus:ring-primary/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirmar contraseña
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 transition-all focus:ring-primary/20"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary transition-all cursor-pointer" 
                  required
                />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  Acepto los <a href="#" className="text-primary hover:underline font-medium">Terminos de Servicio</a> y la{" "}
                  <a href="#" className="text-primary hover:underline font-medium">Politica de Privacidad</a> de La Vie Naturelle.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creando cuenta...</span>
                </div>
              ) : (
                "Crear Cuenta"
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-primary hover:underline font-semibold tracking-tight">
              Inicia Sesion
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return <RegisterForm />
}
