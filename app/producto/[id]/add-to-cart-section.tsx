"use client"

import { useState } from "react"
import { ShoppingCart, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/cart-context"
import type { CatalogProduct } from "@/supabase/types/database"

interface AddToCartSectionProps {
  product: CatalogProduct
}

export function AddToCartSection({ product }: AddToCartSectionProps) {
  const { addToCart } = useStore()
  const [quantity, setQuantity] = useState(1)

  const maxQuantity = product.stockQuantity || 0

  const handleAddToCart = () => {
    if (maxQuantity === 0) return
    for (let i = 0; i < Math.min(quantity, maxQuantity); i++) {
      addToCart(product)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-2">
      <div className="flex items-center border border-border rounded-2xl overflow-hidden bg-card sm:w-auto w-full justify-center sm:justify-start">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="p-4 hover:bg-secondary/50 transition-colors"
          aria-label="Reducir cantidad"
        >
          <Minus className="h-5 w-5" />
        </button>
        <span className="w-14 text-center font-bold text-lg">{quantity}</span>
        <button
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
        className="h-14 "
        onClick={handleAddToCart}
      >
        <ShoppingCart className="h-5 w-5" />
        {maxQuantity === 0 ? "Agotado" : "Agregar al Carrito"}
      </Button>
    </div>
  )
}
