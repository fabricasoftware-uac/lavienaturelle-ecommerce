"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore, type Product } from "@/lib/store-context"
import { getCategoryById } from "@/lib/products"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useStore()
  const router = useRouter()
  const category = getCategoryById(product.category)

  const handleViewProduct = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/producto/${product.id}`)
  }

  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50">
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-3 left-3 z-10">
          <span
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-full shadow-sm",
              product.badge === "Mas Vendido" && "bg-primary text-primary-foreground",
              product.badge === "Nuevo" && "bg-accent text-accent-foreground",
              product.badge === "Popular" && "bg-chart-4 text-foreground",
              product.badge === "Organico" && "bg-chart-3 text-foreground"
            )}
          >
            {product.badge}
          </span>
        </div>
      )}

      {/* Image Container */}
      <Link href={`/producto/${product.id}`} className="block">
        <div className="relative aspect-4/5 overflow-hidden bg-secondary/30">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
          
          {/* Quick Actions - Visible on Hover */}
          <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <Button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                addToCart(product)
              }}
              className="flex-1 bg-card/95 hover:bg-card text-foreground border border-border shadow-lg rounded-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
            <Button
              variant="outline"
              className="bg-card/95 hover:bg-card border-border shadow-lg rounded-xl"
              onClick={handleViewProduct}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <p className="text-xs text-primary font-medium uppercase tracking-wider mb-2">
          {category?.name || product.category}
        </p>
        
        {/* Title */}
        <Link href={`/producto/${product.id}`}>
          <h3 className="font-medium text-foreground leading-tight mb-2 line-clamp-2 hover:text-primary transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>
        
        {/* Price & Quick Add */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="font-serif text-xl font-semibold text-primary">
            ${product.price.toFixed(2)}
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="text-primary hover:bg-primary/10 rounded-lg"
            onClick={() => addToCart(product)}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Agregar al carrito</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
