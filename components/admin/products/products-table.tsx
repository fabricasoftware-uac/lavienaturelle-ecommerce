"use client"

import { Eye, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPrice } from "@/lib/utils"

interface ProductsTableProps {
  products: any[]
  loading: boolean
  onOpenDetail: (product: any) => void
}

export function ProductsTable({ products, loading, onOpenDetail }: ProductsTableProps) {
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
    <div className="hidden md:block bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/10 border-b border-border">
              <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Producto</th>
              <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Categoría</th>
              <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Precio</th>
              <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Stock</th>
              <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}><td colSpan={5} className="px-6 py-6"><Skeleton className="h-10 w-full rounded-xl" /></td></tr>
              ))
            ) : products.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-24 text-center text-muted-foreground font-medium italic opacity-60">No se encontraron productos coincidentes.</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-primary/2 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl border border-border bg-muted overflow-hidden shrink-0 shadow-sm transition-transform group-hover:scale-105">
                        <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <span className="text-sm font-bold text-foreground leading-none">{p.name}</span>
                           {getProductBadge(p.badge)}
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">ID: {p.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-semibold text-muted-foreground/80">{p.category}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-foreground tabular-nums">{formatPrice(p.price || 0)}</span>
                  </td>
                  <td className="px-6 py-5">
                    {getStockBadge(p.stockStatus)}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onOpenDetail(p)}
                      className="h-10 text-[11px] font-bold px-5 rounded-xl border-border hover:bg-secondary hover:text-primary transition-all cursor-pointer shadow-sm group/btn"
                    >
                      <Eye className="h-3.5 w-3.5 mr-2 transition-transform group-hover/btn:scale-110" />
                      Ver Detalles
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
