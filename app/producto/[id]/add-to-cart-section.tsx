"use client"

import { useState } from "react"
import { ShoppingCart, Minus, Plus, Sparkles, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/cart-context"
import { formatPrice, getWholesalePrice, getItemUnitPrice } from "@/lib/utils"
import type { CatalogProduct } from "@/supabase/types/database"

interface AddToCartSectionProps {
  product: CatalogProduct
}

export function AddToCartSection({ product }: AddToCartSectionProps) {
  const { addToCart } = useStore()
  const [quantity, setQuantity] = useState(1)

  const maxQuantity = product.stockQuantity || 0
  const isWholesale = quantity >= 12
  const wholesalePrice = getWholesalePrice(product.price, product.wholesalePrice)
  const unitPrice = getItemUnitPrice(product, quantity)
  const subtotal = unitPrice * quantity

  const handleAddToCart = () => {
    if (maxQuantity === 0) return
    const qtyToAdd = Math.min(quantity, maxQuantity)
    addToCart(product, qtyToAdd)
  }

  const handleSetWholesaleQty = () => {
    if (maxQuantity < 12) return
    setQuantity(12)
  }

  return (
    <div className="space-y-4 pt-2">
      {/* Wholesale Banner / Guidance */}
      {maxQuantity >= 12 && (
        <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-primary/5 border border-primary/15 text-xs">
          {isWholesale ? (
            <div className="flex items-center gap-2 text-primary font-bold">
              <Sparkles className="h-4 w-4 shrink-0 text-primary" />
              <span>¡Precio al por mayor aplicado ({formatPrice(wholesalePrice)} c/u)!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground font-medium">
              <Tag className="h-4 w-4 shrink-0 text-primary" />
              <span>
                Lleva <strong>{12 - quantity} {12 - quantity === 1 ? 'unidad más' : 'unidades más'}</strong> para activar precio mayorista ({formatPrice(wholesalePrice)}/ud).
              </span>
            </div>
          )}
          {!isWholesale && maxQuantity >= 12 && (
            <button
              type="button"
              onClick={handleSetWholesaleQty}
              className="text-[11px] font-bold text-primary underline hover:text-primary/80 shrink-0 cursor-pointer"
            >
              Pedir 12 uds
            </button>
          )}
        </div>
      )}

      {/* Selector & Add Button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center border border-border rounded-2xl overflow-hidden bg-card sm:w-auto w-full justify-between sm:justify-start">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-4 hover:bg-secondary/50 transition-colors"
            aria-label="Reducir cantidad"
          >
            <Minus className="h-5 w-5" />
          </button>
          <span className="w-14 text-center font-bold text-lg">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(Math.min(maxQuantity || 1, quantity + 1))}
            className="p-4 hover:bg-secondary/50 transition-colors"
            aria-label="Aumentar cantidad"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <Button
          size="lg"
          disabled={maxQuantity === 0}
          className="h-14 flex-1 text-sm font-bold shadow-lg shadow-primary/10"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-5 w-5 mr-1.5" />
          {maxQuantity === 0
            ? "Agotado"
            : `Agregar ${quantity} al Carrito — ${formatPrice(subtotal)}`}
        </Button>
      </div>
    </div>
  )
}
