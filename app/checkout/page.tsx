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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store-context"
import { cn } from "@/lib/utils"

type CheckoutStep = "informacion" | "envio" | "pago" | "confirmacion"

const stepLabels: Record<CheckoutStep, string> = {
  informacion: "Informacion",
  envio: "Envio",
  pago: "Pago",
  confirmacion: "Confirmacion",
}

function CheckoutForm() {
  const { cart, cartTotal, clearCart, user } = useStore()
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

  const shippingCost = cartTotal
  const total = cartTotal
  console.log(total)
  console.log(cart)
  console.log(cartTotal)
  console.log(shippingCost)

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
      setStep("confirmacion")
      clearCart()
    }
  }
  if (cart.length === 0 && step == "confirmacion") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-semibold text-foreground mb-4">
            Tu carrito esta vacio
          </h1>
          <p className="text-muted-foreground mb-6">
            Agrega algunos productos a tu carrito antes de finalizar la compra.
          </p>
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Seguir Comprando
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (step == "confirmacion") {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-serif text-3xl font-semibold text-foreground mb-2">
              Pedido Confirmado!
            </h1>
            <p className="text-muted-foreground mb-8">
              Gracias por tu compra. Hemos enviado un correo de confirmacion a {formData.email}.
            </p>
            <div className="bg-card rounded-xl border border-border p-6 text-left mb-8">
              <p className="text-sm text-muted-foreground mb-2">Numero de pedido</p>
              <p className="font-mono text-lg font-semibold text-foreground">
                #LVN-{Math.random().toString(36).substring(2, 8).toUpperCase()}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Seguir Comprando
                </Button>
              </Link>
              <Button variant="outline">Rastrear Pedido</Button>
            </div>
          </div>
        </div>
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
                src="/logo-full.png" 
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
            <div className="flex items-center gap-2 mb-8">
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
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Continuar como Invitado</p>
                    <p className="text-sm text-muted-foreground">
                      No necesitas una cuenta. O{" "}
                      <Link href="/login" className="text-primary hover:underline">
                        inicia sesion
                      </Link>{" "}
                      para una compra mas rapida.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
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
                          placeholder="tu@ejemplo.com"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Nombre
                        </label>
                        <Input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Juan"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Apellido
                        </label>
                        <Input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Perez"
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
                          placeholder="+52 (55) 1234-5678"
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
                          placeholder="Calle Principal 123"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Apartamento, suite, etc. (opcional)
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          name="apartment"
                          value={formData.apartment}
                          onChange={handleInputChange}
                          placeholder="Depto 4B"
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

                  {/* Shipping Method */}
                  <div className="mt-8">
                    <h3 className="font-medium text-foreground mb-4">Informacion del envio</h3>
                    <div className="space-y-3">
                      
                      <label className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            className="text-primary focus:ring-primary"
                          />
                          <div>
                            <p className="font-medium text-foreground">Envio Express</p>
                            <p className="text-sm text-muted-foreground">2-3 dias habiles</p>
                          </div>
                        </div>
                        <span className="font-medium text-foreground">$15.000</span>
                      </label>
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
                          placeholder="4242 4242 4242 4242"
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
          <div className="lg:pl-8">
            <div className="sticky top-24 bg-card rounded-xl border border-border p-6">
              <h2 className="font-serif text-lg font-semibold text-foreground mb-6">
                Resumen del Pedido
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-muted">
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
