"use client"

import Link from "next/link"
import Image from "next/image"
import { X, Plus, Minus, ShoppingBag, AlertTriangle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/cart-context"
import { cn, formatPrice, getItemUnitPrice, getWholesalePrice } from "@/lib/utils"

export function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal } = useStore()

  const hasOutOfStock = cart.some((item) => (item.stockQuantity ?? 1) <= 0)

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 transition-opacity duration-300",
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-card shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col",
          isCartOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-lg font-semibold text-foreground">Tu Carrito</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCartOpen(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground mb-2">Tu carrito esta vacio</p>
              <p className="text-sm text-muted-foreground/70">Agrega productos naturales a tu carrito</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => {
                const stock = item.stockQuantity ?? Infinity
                const isLow = stock > 0 && stock <= 5
                const isOut = stock <= 0
                const isWholesale = item.quantity >= 12
                const unitPrice = getItemUnitPrice(item, item.quantity)
                const wholesalePrice = getWholesalePrice(item.price, item.wholesalePrice)
                const itemTotal = unitPrice * item.quantity

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-2 p-4 bg-secondary/30 rounded-2xl border border-border/50"
                  >
                    <div className="flex gap-3">
                      <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-muted border border-border/40">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground text-sm leading-tight truncate">
                          {item.name}
                        </h3>
                        
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-primary font-bold text-sm">
                            {formatPrice(unitPrice)}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            x {item.quantity} = <strong>{formatPrice(itemTotal)}</strong>
                          </span>
                        </div>

                        {/* Wholesale Indicator / Suggestion */}
                        {isWholesale ? (
                          <div className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <Sparkles className="h-3 w-3" />
                            Precio por mayor aplicado (12+ uds)
                          </div>
                        ) : stock >= 12 ? (
                          <p className="text-[10px] text-muted-foreground mt-1">
                            Lleva {12 - item.quantity} más para precio mayorista ({formatPrice(wholesalePrice)}/ud)
                          </p>
                        ) : null}

                        {isLow && (
                          <p className="text-xs text-amber-600 font-medium mt-1 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Solo {stock} {stock === 1 ? 'unidad' : 'unidades'} disponibles
                          </p>
                        )}
                        {isOut && (
                          <p className="text-xs text-red-500 font-medium mt-1">Agotado</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-lg"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-bold w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-lg"
                          disabled={isOut || item.quantity >= stock}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive text-xs h-7 px-2"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-border p-6 space-y-4">
            <div className="flex items-center justify-between text-lg">
              <span className="font-medium text-foreground">Subtotal</span>
              <span className="font-serif font-semibold text-foreground">{formatPrice(cartTotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Envio e impuestos calculados al finalizar</p>
            <div className="flex flex-col gap-2">
              <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-14"
                  disabled={hasOutOfStock}
                >
                  {hasOutOfStock ? "Productos agotados en el carrito" : "Finalizar Compra"}
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsCartOpen(false)}
              >
                Seguir Comprando
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
