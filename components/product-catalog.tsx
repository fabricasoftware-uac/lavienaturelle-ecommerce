"use client"

import { useState, useMemo } from "react"
import { Sparkles, Grid3X3, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { products, categories, type Category, getCategoryIcon } from "@/lib/products"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const PRODUCTS_PER_PAGE = 8

interface ProductCatalogProps {
  initialProducts?: any[]
  initialCategories?: any[]
}

export function ProductCatalog({ initialProducts, initialCategories }: ProductCatalogProps) {
  const displayProducts = initialProducts || products
  const displayCategories = initialCategories || categories
  
  const [activeCategory, setActiveCategory] = useState<string | "all">("all")
  const [gridSize, setGridSize] = useState<"compact" | "comfortable">("comfortable")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredProducts = useMemo(() => {
    return activeCategory === "all"
      ? displayProducts
      : displayProducts.filter((p) => p.category === activeCategory)
  }, [activeCategory, displayProducts])

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const endIndex = startIndex + PRODUCTS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  // Reset to page 1 when category changes
  const handleCategoryChange = (category: string | "all") => {
    setActiveCategory(category)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of catalog
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" })
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "ellipsis", totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages)
      }
    }
    return pages
  }

  return (
    <section id="catalogo" className="py-20 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Nuestra Coleccion
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
            Productos Naturales
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-pretty">
            Explora nuestra seleccion cuidadosamente curada de productos naturales premium, 
            obtenidos de los mejores ingredientes organicos.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => handleCategoryChange("all")}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer",
                activeCategory === "all"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-muted-foreground hover:bg-primary/10 hover:text-primary border border-border"
              )}
            >
              Todos
            </button>
            {displayCategories.map((cat) => {
              const Icon = getCategoryIcon(cat.id || cat.slug)
              return (
                <button
                  key={cat.id || cat.slug}
                  onClick={() => handleCategoryChange(cat.slug || cat.id)}
                  className={cn(
                    "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer",
                    activeCategory === (cat.slug || cat.id)
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-card text-muted-foreground hover:bg-primary/10 hover:text-primary border border-border"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {cat.namePlural || cat.name}
                </button>
              )
            })}
          </div>

          {/* Grid Toggle - Desktop only */}
          <div className="hidden md:flex items-center gap-2 bg-card rounded-lg border border-border p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setGridSize("comfortable")}
              className={cn(
                "rounded-md",
                gridSize === "comfortable" && "bg-secondary"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setGridSize("compact")}
              className={cn(
                "rounded-md",
                gridSize === "compact" && "bg-secondary"
              )}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Results Count & Category Link */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} de {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""}
            {activeCategory !== "all" && (
              <span> en {displayCategories.find(c => (c.slug || c.id) === activeCategory)?.namePlural || displayCategories.find(c => (c.slug || c.id) === activeCategory)?.name}</span>
            )}
          </p>
          {activeCategory !== "all" && (
            <Link 
              href={`/categoria/${activeCategory}`}
              className="text-sm text-primary hover:underline"
            >
              Ver todos en esta categoria
            </Link>
          )}
        </div>

        {/* Product Grid */}
        <div 
          className={cn(
            "grid gap-6 transition-all duration-300",
            gridSize === "comfortable" 
              ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          )}
        >
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 mb-4">
              <Sparkles className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-xl font-medium text-foreground mb-2">
              Sin productos
            </h3>
            <p className="text-muted-foreground">
              No se encontraron productos en esta categoria.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => handleCategoryChange("all")}
            >
              Ver todos los productos
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Pagina anterior</span>
            </Button>

            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => (
                page === "ellipsis" ? (
                  <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">...</span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={cn(
                      "w-10 h-10 rounded-full",
                      currentPage === page && "bg-primary text-primary-foreground"
                    )}
                  >
                    {page}
                  </Button>
                )
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Pagina siguiente</span>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
