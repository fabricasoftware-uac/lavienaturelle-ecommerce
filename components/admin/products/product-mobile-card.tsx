"use client"

import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"

interface ProductMobileCardProps {
  product: any
  onOpenDetail: (product: any) => void
}

export function ProductMobileCard({ product, onOpenDetail }: ProductMobileCardProps) {
  const getStockBadge = (status: string) => {
    switch (status) {
      case "In Stock": return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium">En Stock</Badge>
      case "Low Stock": return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 font-medium">Stock Bajo</Badge>
      case "Out of Stock": return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 font-medium">Sin Stock</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  const getProductBadge = (badge: string) => {
    if (!badge) return null
    if (badge === "Nuevo!") return <Badge className="bg-primary text-white border-none text-[10px] font-bold">{badge}</Badge>
    if (badge === "Oferta!") return <Badge className="bg-orange-500 text-white border-none text-[10px] font-bold">{badge}</Badge>
    return <Badge variant="secondary" className="text-[10px] font-bold">{badge}</Badge>
  }

  return (
    <div 
      className="bg-card rounded-2xl border border-border p-4 shadow-sm active:scale-[0.98] transition-all" 
      onClick={() => onOpenDetail(product)}
    >
      <div className="flex gap-4 mb-4">
        <div className="h-20 w-20 rounded-xl border border-border bg-muted overflow-hidden shrink-0 shadow-sm">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="text-sm font-bold text-foreground leading-tight truncate">{product.name}</span>
            {getProductBadge(product.badge)}
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2 tracking-tighter">ID: {product.id}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground/80">{product.category}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="text-sm font-black text-foreground">{formatPrice(product.price || 0)}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border/50 pt-4">
        {getStockBadge(product.stockStatus)}
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-[11px] font-bold text-primary"
        >
          Ver Detalles
          <ChevronRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </div>
    </div>
  )
}
