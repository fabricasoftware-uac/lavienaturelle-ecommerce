"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Grid3X3, LayoutGrid, ArrowLeft, SlidersHorizontal } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getCategoryIcon } from "@/lib/products"

const PRODUCTS_PER_PAGE = 12

type SortOption = "featured" | "price-asc" | "price-desc" | "name"

interface CategoryContentProps {
  category: any
  products: any[]
  allCategories: any[]
  allProducts: any[]
}

export function CategoryContent({ category, products, allCategories, allProducts }: CategoryContentProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [gridSize, setGridSize] = useState<"compact" | "comfortable">("comfortable")
  const [sortBy, setSortBy] = useState<SortOption>("featured")

  const CategoryIcon = getCategoryIcon(category.slug || category.id)

  // Filter and sort products
  const sortedProducts = useMemo(() => {
    let filtered = [...products]
    
    switch (sortBy) {
      case "price-asc":
        return filtered.sort((a, b) => a.price - b.price)
      case "price-desc":
        return filtered.sort((a, b) => b.price - a.price)
      case "name":
        return filtered.sort((a, b) => a.name.localeCompare(b.name))
      default:
        return filtered
    }
  }, [products, sortBy])

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const endIndex = startIndex + PRODUCTS_PER_PAGE
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

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
    <>
      {/* Hero Banner */}
      <section className="bg-linear-to-br from-primary/10 via-secondary/50 to-accent/10 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <Link href="/#catalogo" className="hover:text-primary transition-colors">
              Catálogo
            </Link>
            <span>/</span>
            <span className="text-foreground">{category.namePlural || category.name}</span>
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20">
              <CategoryIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
                {category.namePlural || category.name}
              </h1>
              {category.description && (
                <p className="text-muted-foreground mt-1">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
            <div className="flex items-center gap-4">
              <Link href="/#catalogo">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Volver al catálogo
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                {sortedProducts.length} producto{sortedProducts.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as SortOption)
                    setCurrentPage(1)
                  }}
                  className="text-sm bg-card border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="featured">Destacados</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="name">Nombre A-Z</option>
                </select>
              </div>

              <div className="hidden md:flex items-center gap-1 bg-card rounded-lg border border-border p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setGridSize("comfortable")}
                  className={cn("rounded-md h-8 w-8 p-0", gridSize === "comfortable" && "bg-secondary")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setGridSize("compact")}
                  className={cn("rounded-md h-8 w-8 p-0", gridSize === "compact" && "bg-secondary")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
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
          {sortedProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 mb-4">
                <CategoryIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-serif text-xl font-medium text-foreground mb-2">
                Sin productos
              </h3>
              <p className="text-muted-foreground">
                No hay productos disponibles en esta categoría.
              </p>
              <Link href="/#catalogo">
                <Button variant="outline" className="mt-4">
                  Ver todos los productos
                </Button>
              </Link>
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
                      className={cn("w-10 h-10 rounded-full", currentPage === page && "bg-primary text-primary-foreground")}
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
              </Button>
            </div>
          )}

          {/* Other Categories */}
          <div className="mt-16 pt-12 border-t border-border">
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
              Otras Categorías
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allCategories
                .filter((c) => (c.slug || c.id) !== (category.slug || category.id))
                .map((cat) => {
                  const Icon = getCategoryIcon(cat.slug || cat.id)
                  const productCount = allProducts.filter((p) => p.category === (cat.slug || cat.id)).length
                  return (
                    <Link
                      key={cat.id}
                      href={`/categoria/${cat.slug || cat.id}`}
                      className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{cat.namePlural || cat.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {productCount} producto{productCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </Link>
                  )
                })}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
