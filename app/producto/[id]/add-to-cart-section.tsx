"use client"

import { useState } from "react"
import { ShoppingCart, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store-context"

interface AddToCartSectionProps {
  product: any
}

export function AddToCartSection({ product }: AddToCartSectionProps) {
  const { addToCart } = useStore()
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
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
          onClick={() => setQuantity(quantity + 1)}
          className="p-3.5 hover:bg-secondary/50 transition-colors"
          aria-label="Aumentar cantidad"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
      <Button 
        size="lg" 
        className="flex-1 p-5 gap-3 rounded-xl text-base font-bold shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all active:scale-[0.98]"
        onClick={handleAddToCart}
      >
        <ShoppingCart className="h-5 w-5" />
        Agregar al Carrito
      </Button>
    </div>
  )
}
