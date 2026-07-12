"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/cart-context"
import { cn, formatPrice } from "@/lib/utils"
import { CatalogProduct } from "@/supabase/types/database"

interface ProductCardProps {
  product: CatalogProduct
  index?: number
}

const badgeStyles: Record<string, string> = {
  "Nuevo!": "bg-emerald-500/90 text-white",
  "Oferta!": "bg-orange-500/90 text-white",
  "Mas Vendido": "bg-primary/90 text-primary-foreground",
  "Popular": "bg-violet-500/90 text-white",
  "Organico": "bg-green-600/90 text-white",
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useStore()
  const router = useRouter()

  const handleViewProduct = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/producto/${product.id}`)
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-[1.75rem] overflow-hidden transition-all duration-500",
        "bg-card border border-border/40",
        "hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] hover:-translate-y-1",
        !product.inStock && "opacity-60 hover:opacity-70"
      )}
      style={{
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-3 left-3 z-20">
          <span
            className={cn(
              "px-3 py-1 text-[10px] font-bold rounded-full backdrop-blur-md tracking-wider shadow-lg",
              badgeStyles[product.badge] || "bg-primary/90 text-primary-foreground"
            )}
          >
            {product.badge}
          </span>
        </div>
      )}

      {/* Image */}
      <Link href={`/producto/${product.id}`} className="block overflow-hidden">
        <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-secondary/40 to-secondary/10">
          <Image
            src={product.image || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:saturate-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />

          {/* Hover overlay with quick actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-400 ease-out pointer-events-auto">
            <Button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (product.inStock) addToCart(product)
              }}
              disabled={!product.inStock}
              className="flex-1 h-10 bg-white/95 hover:bg-white text-foreground border-0 shadow-xl backdrop-blur-md rounded-xl text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.inStock ? (
                <><Plus className="h-3.5 w-3.5 mr-1.5" /> Agregar</>
              ) : (
                "Agotado"
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 bg-white/95 hover:bg-white border-0 shadow-xl backdrop-blur-md rounded-xl"
              onClick={handleViewProduct}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          {/* Out of stock indicator */}
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[1px]">
              <span className="px-4 py-1.5 bg-stone-800/90 text-white text-xs font-bold rounded-full backdrop-blur-md tracking-wider shadow-lg">
                Agotado
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4 pt-3">
        {/* Category tag */}
        <p className="text-[10px] font-bold text-primary/70 uppercase tracking-[0.15em] mb-1.5">
          {product.categoryName}
        </p>

        {/* Title */}
        <Link href={`/producto/${product.id}`} className="flex-1">
          <h3 className="font-serif text-base leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        {product.description && (
          <p className="text-xs text-muted-foreground/80 line-clamp-1 mt-1 mb-3 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Price + Add */}
        <div className="flex items-end justify-between mt-auto pt-2 border-t border-border/30">
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold text-primary leading-none">
              {formatPrice(product.price)}
            </span>
          </div>
          <button
            onClick={() => product.inStock && addToCart(product)}
            disabled={!product.inStock}
            className={cn(
              "flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300",
              product.inStock
                ? "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>
      </div>
    </div>
  )
}
