"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  Check,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  ShoppingCart,
  Lock,
  X,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store-context"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

type CheckoutStep = "informacion" | "envio" | "pago" | "confirmacion"

const stepLabels: Record<CheckoutStep, string> = {
  informacion: "Informacion",
  envio: "Envio",
  pago: "Pago",
  confirmacion: "Confirmacion",
}

function CheckoutForm() {
  const router = useRouter()
  const { cart, cartTotal, clearCart, user, register } = useStore()
  const [step, setStep] = useState<CheckoutStep>("informacion")
  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    country: "Colombia",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  })

  const [orderSummary, setOrderSummary] = useState<any>(null)
  const [orderId, setOrderId] = useState("")

  // Registration Modal States
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [regPassword, setRegPassword] = useState("")
  const [regConfirmPassword, setRegConfirmPassword] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [registerError, setRegisterError] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError("")
    
    if (regPassword !== regConfirmPassword) {
      setRegisterError("Las contraseñas no coinciden")
      return
    }

    if (regPassword.length < 6) {
      setRegisterError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setIsRegistering(true)
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const success = register(orderSummary.name, orderSummary.email, regPassword)
    
    if (success) {
      setRegistrationSuccess(true)
      setTimeout(() => {
        setShowRegisterModal(false)
        router.push("/account")
      }, 2000)
    } else {
      setRegisterError("Error al crear la cuenta. Inténtalo de nuevo.")
      setIsRegistering(false)
    }
  }

  const shippingCost = cartTotal
  const total = cartTotal

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === "informacion") {
      setStep("envio")
    } else if (step === "envio") {
      setStep("pago")
    } else if (step === "pago") {
      // Store summary and order ID before clearing
      setOrderSummary({
        items: [...cart],
        total: total,
        email: formData.email,
        name: formData.firstName
      })
      setOrderId(`LVN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`)
      setStep("confirmacion")
      clearCart()
    }
  }

  if (cart.length === 0 && step !== "confirmacion") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="h-10 w-10 text-stone-300" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mb-4">
            Tu carrito está vacío
          </h1>
          <p className="text-stone-500 mb-8 leading-relaxed">
            Parece que aún no has añadido tesoros naturales a tu carrito. ¡Explora nuestra colección y encuentra algo especial!
          </p>
          <Link href="/">
            <Button className="h-12 px-8 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-stone-200">
              Explorar Colección
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (step === "confirmacion" && orderSummary) {
    return (
      <div className="min-h-screen bg-green py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-stone-100 overflow-hidden">
            {/* Success Header */}
            <div className="bg-primary  px-8 py-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-20%] right-[-10%] w-60 h-60 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-10%] w-40 h-40 bg-white/5 rounded-full blur-2xl" />
              </div>
              
              <div className="relative z-10">
                <div className="mx-auto w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10 animate-in zoom-in-50 duration-500">
                  <Check className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
                  ¡Pedido Recibido!
                </h1>
                <p className="text-stone-100 font-medium max-w-sm mx-auto text-sm leading-relaxed">
                  Gracias por confiar en La Vie Naturelle. Tu pedido ya está en camino a ser procesado.
                </p>
              </div>
            </div>

            <div className="p-8 sm:p-12 space-y-10">
              {/* Order Info Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-stone-50 rounded-2xl p-5 border border-stone-100">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">ID del Pedido</p>
                  <p className="text-lg font-bold">{orderId}</p>
                </div>
              </div>

              {/* Create Account Section */}
              {!user && (
                <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 relative overflow-hidden group">
                  <div className="absolute top-[-20%] right-[-5%] w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-primary/10 flex items-center justify-center shrink-0">
                      <User className="h-7 w-7 text-primary" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-bold text-stone-900 mb-1">¿Quieres guardar tu información?</h3>
                      <p className="text-xs text-stone-500 font-medium leading-relaxed">
                        Crea una cuenta en un clic usando los datos de este pedido para rastrear tus envíos y comprar más rápido la próxima vez.
                      </p>
                      <Button 
                        onClick={() => setShowRegisterModal(true)}
                        className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-xs uppercase tracking-widest transition-all mt-4"
                      >
                        Crear mi Cuenta
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary Summary */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Resumen de la compra</h3>
                <div className="border border-stone-100 rounded-3xl overflow-hidden divide-y divide-stone-100">
                  {orderSummary.items.slice(0, 2).map((item: any) => (
                    <div key={item.id} className="p-4 flex items-center gap-4 bg-white">
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-stone-50 shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-stone-900 truncate">{item.name}</p>
                        <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Cant: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-stone-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  {orderSummary.items.length > 2 && (
                    <div className="p-3 text-center bg-stone-50/50">
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Y {orderSummary.items.length - 2} productos más</p>
                    </div>
                  )}
                  <div className="p-6 bg-stone-50 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Total Pagado</span>
                    <span className="font-serif text-2xl font-bold text-primary">${orderSummary.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-5 pt-6">
                <Link href="/" className="flex-1">
                  <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-bold text-sm transition-all shadow-lg shadow-primary/10">
                    Seguir Comprando
                  </Button>
                </Link>
                <Link href="/consulta-pedido" className="flex-1">
                  <Button variant="outline" className="w-full h-14 rounded-2xl border-border hover:bg-secondary/50 font-bold text-sm text-muted-foreground hover:text-foreground transition-all">
                    Rastrear mi Pedido
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <p className="mt-10 text-center text-[10px] text-muted-foreground font-bold uppercase tracking-[0.4em] opacity-60">
            La Vie Naturelle — Esencia Botánica Premium
          </p>
        </div>

        {/* One-Click Register Modal */}
        {showRegisterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="bg-primary p-8 text-center relative overflow-hidden">
                 <button 
                  onClick={() => setShowRegisterModal(false)}
                  className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="relative z-10">
                  <div className="mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/10">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-white mb-2">Crea tu cuenta</h2>
                  <p className="text-primary-foreground/70 text-xs font-medium">Solo falta asignar una contraseña para tu nueva cuenta.</p>
                </div>
              </div>

              <div className="p-8 space-y-6">
                {registrationSuccess ? (
                  <div className="text-center py-8 animate-in zoom-in duration-500">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">¡Cuenta creada!</h3>
                    <p className="text-sm text-stone-500">Te estamos redirigiendo a tu perfil...</p>
                  </div>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    {registerError && (
                      <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs border border-destructive/20">
                        {registerError}
                      </div>
                    )}

                    <div className="space-y-4 opacity-60">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Nombre</label>
                        <Input disabled value={orderSummary.name} className="h-11 bg-stone-50 border-stone-100" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Email</label>
                        <Input disabled value={orderSummary.email} className="h-11 bg-stone-50 border-stone-100" />
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-900 uppercase tracking-widest flex items-center gap-2">
                          <Lock className="h-3 w-3" /> Contraseña
                        </label>
                        <Input 
                          type="password" 
                          required 
                          placeholder="Mínimo 6 caracteres" 
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="h-12 rounded-xl focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-900 uppercase tracking-widest">Confirmar Contraseña</label>
                        <Input 
                          type="password" 
                          required 
                          placeholder="Repite tu contraseña" 
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          className="h-12 rounded-xl focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit"
                      disabled={isRegistering}
                      className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-bold text-sm mt-4 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                    >
                      {isRegistering ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Procesando...</span>
                        </div>
                      ) : (
                        "Confirmar y Guardar Cuenta"
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo_header.png"
                alt="La Vie Naturelle Logo"
                className="h-10 w-auto object-contain"
                height={10}
                width={10}
              />
            </Link>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="hidden sm:flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Compra Segura
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a la tienda
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Form */}
          <div>
            {/* Progress Steps */}
            <div className="flex items-center gap-2 mb-8 justify-center">
              {(["informacion", "envio", "pago"] as CheckoutStep[]).map((s, i) => (
                <div key={s} className="flex items-center">
                  <div
                    className={cn(
                      "flex items-center justify-center h-8 w-8 rounded-full text-sm font-medium",
                      step === s
                        ? "bg-primary text-primary-foreground"
                        : i < ["informacion", "envio", "pago"].indexOf(step)
                          ? "bg-primary/20 text-primary"
                          : "bg-secondary text-muted-foreground"
                    )}
                  >
                    {i < ["informacion", "envio", "pago"].indexOf(step) ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={cn(
                      "ml-2 text-sm hidden sm:block",
                      step === s ? "text-foreground font-medium" : "text-muted-foreground"
                    )}
                  >
                    {stepLabels[s]}
                  </span>
                  {i < 2 && (
                    <div className="w-8 sm:w-16 h-px bg-border mx-2 sm:mx-4" />
                  )}
                </div>
              ))}
            </div>

            {/* Guest Checkout Option */}
            {step === "informacion" && !user && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8 max-w-sm md:max-w-full">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Continuar como Invitado</p>
                    <p className="text-sm text-muted-foreground">
                      No necesitas una cuenta. O{" "}
                      <Link href="/register" className="text-green-600 hover:underline">
                        crea una nueva
                      </Link>{" "}
                      para compras mas rapidas.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-sm md:max-w-full">
              {/* Information Step */}
              {step === "informacion" && (
                <div className="space-y-6">
                  <h2 className="font-serif text-xl font-semibold text-foreground">
                    Informacion de Contacto
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Correo Electronico
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Ingresa tu correo"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Nombre Completeo
                        </label>
                        <Input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Ingresa tu nomnbre y apellido"
                          className="w-full"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Telefono
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Ingresa tu numero de telefono"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping Step */}
              {step === "envio" && (
                <div className="space-y-6">
                  <h2 className="font-serif text-xl font-semibold text-foreground">
                    Direccion de Envio
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Direccion
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Ingresa tu direccion"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Apartamento, casa, etc. (opcional)
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          name="apartment"
                          value={formData.apartment}
                          onChange={handleInputChange}
                          placeholder="Ingresa detalles adicionales"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Ciudad
                        </label>
                        <Input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Ingresa la ciudad"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Departamento
                        </label>
                        <Input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="Ingresa el departamento"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Pais
                        </label>
                        <Input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Step */}
              {step === "pago" && (
                <div className="space-y-6">
                  <h2 className="font-serif text-xl font-semibold text-foreground">
                    Detalles de Pago
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Numero de Tarjeta
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="Ingresa el numero de tu tarjeta"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Nombre en la Tarjeta
                      </label>
                      <Input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        placeholder="Juan Perez"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Fecha de Vencimiento
                        </label>
                        <Input
                          type="text"
                          name="expiry"
                          value={formData.expiry}
                          onChange={handleInputChange}
                          placeholder="MM/AA"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          CVV
                        </label>
                        <Input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-secondary/50 rounded-lg p-4 flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Tu informacion de pago esta encriptada y segura.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex gap-4">
                {step !== "informacion" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (step === "envio") setStep("informacion")
                      if (step === "pago") setStep("envio")
                    }}
                    className="flex-1"
                  >
                    Atras
                  </Button>
                )}
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {step === "pago" ? "Completar Pedido" : "Continuar"}
                </Button>
              </div>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:pl-8 max-w-sm md:max-w-full">
            <div className="sticky top-24 bg-card rounded-xl border border-border p-6">
              <h2 className="font-serif text-lg font-semibold text-foreground mb-6">
                Resumen del Pedido
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 rounded-lg">
                    <div className="relative h-16 w-16 shrink-0 border  bg-muted">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-foreground truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Cant: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-serif text-xl font-semibold text-primary">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Transaccion 100% segura</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function CheckoutPage() {
  return <CheckoutForm />
}
