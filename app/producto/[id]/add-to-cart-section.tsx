"use client"

import { useState } from "react"
import { ShoppingCart, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/cart-context"
import type { CatalogProduct } from "@/lib/supabase/types/database"

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
    <div className="flex flex-col sm:flex-row gap-4 pt-2">
      <div className="flex items-center border border-border rounded-xl overflow-hidden bg-white sm:w-auto w-full justify-between sm:justify-start">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="p-3.5 hover:bg-secondary/50 transition-colors"
          aria-label="Reducir cantidad"
        >
          <Minus className="h-5 w-5" />
        </button>
        <span className="w-14 text-center font-bold text-lg">{quantity}</span>
        <button
          onClick={() => setQuantity(Math.min(maxQuantity || 1, quantity + 1))}
          className="p-3.5 hover:bg-secondary/50 transition-colors"
          aria-label="Aumentar cantidad"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
      <Button 
        size="lg" 
        disabled={maxQuantity === 0}
        className="flex-1 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold h-14 shadow-lg shadow-stone-200 transition-all active:scale-[0.98] gap-3"
        onClick={handleAddToCart}
      >
        <ShoppingCart className="h-5 w-5" />
        {maxQuantity === 0 ? "Agotado" : "Agregar al Carrito"}
      </Button>
    </div>
  )
}
