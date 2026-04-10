import Link from "next/link"
import { FolderSearch } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CategoryNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/50 mb-6">
          <FolderSearch className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="font-serif text-3xl font-semibold text-foreground mb-2">
          Categoria no encontrada
        </h1>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          La categoria que buscas no existe o ha sido movida. 
          Explora nuestro catalogo para encontrar lo que necesitas.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/#catalogo">
            <Button>Ver Catalogo</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Ir al Inicio</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
