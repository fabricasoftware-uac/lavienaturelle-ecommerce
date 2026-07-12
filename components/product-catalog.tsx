"use client"

import { useState, useMemo } from "react"
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { getCategoryIcon } from "@/lib/products"
import { cn } from "@/lib/utils"
import { CatalogProduct, Category } from "@/supabase/types/database"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const PRODUCTS_PER_PAGE = 8

interface ProductCatalogProps {
  initialProducts: CatalogProduct[]
  initialCategories: Category[]
}

export function ProductCatalog({ initialProducts, initialCategories }: ProductCatalogProps) {
  const displayProducts = initialProducts
  const displayCategories = initialCategories

  const [activeCategory, setActiveCategory] = useState<string | "all">("all")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredProducts = useMemo(() => {
    return activeCategory === "all"
      ? displayProducts
      : displayProducts.filter((p) => p.category === activeCategory)
  }, [activeCategory, displayProducts])

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const endIndex = startIndex + PRODUCTS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  const handleCategoryChange = (category: string | "all") => {
    setActiveCategory(category)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" })
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

  const activeCategoryName = activeCategory !== "all"
    ? displayCategories.find(c => c.slug === activeCategory)?.name
    : null

  return (
    <section id="catalogo" className="relative py-20 sm:py-28">
      {/* Background atmosphere - larger, more present */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/[0.04] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-0 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[130px]" />
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-accent/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Unified Header Block */}
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/[0.06] text-primary text-[11px] font-bold uppercase tracking-[0.25em] mb-4 border border-primary/10">
            <Sparkles className="h-3 w-3" />
            Coleccion
          </div>

          {/* Title + Subtitle inline */}
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground tracking-tight text-balance leading-[1.15]">
            Productos que{" "}
            <span className="text-primary italic">transforman</span>{" "}
            tu ritual diario
          </h2>
          <p className="mt-3 text-muted-foreground/70 text-sm leading-relaxed max-w-md mx-auto font-medium">
            Ingredientes puros que honran la sabiduria botanica.
          </p>
        </div>

        {/* Filters + Results inline bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 pb-5 border-b border-border/40">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[{ slug: "all", name: "Todos" }, ...displayCategories].map((cat) => {
              const isActive = cat.slug === "all" ? activeCategory === "all" : activeCategory === cat.slug
              const isRealCategory = cat.slug !== "all"
              const Icon = isRealCategory ? getCategoryIcon(cat.slug) : null
              return (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/15"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  )}
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  {cat.name}
                </button>
              )
            })}
          </div>

          {/* Results count - inline with filters */}
          <p className="text-[11px] text-muted-foreground/60 font-medium tracking-wide uppercase shrink-0">
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""}
            {activeCategoryName && <span> en {activeCategoryName}</span>}
          </p>
        </div>

        {/* Category page link */}
        {activeCategory !== "all" && (
          <Link
            href={`/categoria/${activeCategory}`}
            className="group inline-flex items-center gap-2 mb-5 px-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Ver coleccion completa de {activeCategoryName}
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {paginatedProducts.map((product, i) => (
                <div
                  key={product.id}
                  className="animate-in fade-in slide-in-from-bottom-3 duration-400"
                  style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
                >
                  <ProductCard product={product} index={i} />
                </div>
              ))}
            </div>

            {/* Pagination - cleaner, more integrated */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-10 pt-8 border-t border-border/30">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {getPageNumbers().map((page, idx) =>
                  page === "ellipsis" ? (
                    <span key={`e-${idx}`} className="w-6 text-center text-muted-foreground/30 text-xs font-medium">...</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={cn(
                        "w-9 h-9 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer",
                        currentPage === page
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                      )}
                    >
                      {page}
                    </button>
                  )
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          /* Empty State - more compact */
          <div className="text-center py-16 border-t border-border/30">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
              <Sparkles className="h-7 w-7 text-muted-foreground/30" />
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground mb-1">Sin productos</h3>
            <p className="text-muted-foreground/60 text-sm mb-5">
              No hay productos en esta categoria todavia.
            </p>
            <Button
              variant="outline"
              className="rounded-full px-6 h-10 text-xs font-semibold"
              onClick={() => handleCategoryChange("all")}
            >
              Ver todos los productos
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
