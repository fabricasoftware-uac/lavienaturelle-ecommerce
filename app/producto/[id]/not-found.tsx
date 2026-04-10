import Link from "next/link"
import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/50 mb-6">
          <Package className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="font-serif text-3xl font-semibold text-foreground mb-3">
          Producto no encontrado
        </h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          Lo sentimos, el producto que buscas no existe o ha sido descontinuado.
        </p>
        <Button asChild>
          <Link href="/#catalogo">
            Ver catalogo de productos
          </Link>
        </Button>
      </div>
    </div>
  )
}
