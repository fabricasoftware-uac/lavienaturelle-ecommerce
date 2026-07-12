import Link from "next/link"
import { notFound } from "next/navigation"
import { 
  ChevronLeft, 
  Check, 
  Shield,
  Leaf,
  Package,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartDrawer } from "@/components/cart-drawer"
import { Footer } from "@/components/footer"
import { ProductGallery } from "@/components/product-gallery"
import { getProductBySlugOrId, getProducts } from "@/supabase/types/products"
import { cn, formatPrice } from "@/lib/utils"
import { ProductCard } from "@/components/product-card"
import { Sparkles } from "lucide-react"
import { AddToCartSection } from "./add-to-cart-section"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params
  const product = await getProductBySlugOrId(resolvedParams.id)

  if (!product) {
    notFound()
  }

  // Get related products (same category)
  const allProducts = await getProducts()
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const images = product.images.length > 0 ? product.images : [product.image]

  return (
    <div className="min-h-screen bg-background">
      <CartDrawer />
      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors font-medium">
              Inicio
            </Link>
            <span>/</span>
            <Link
              href={`/categoria/${product.category}`}
              className="hover:text-primary transition-colors uppercase tracking-tight font-medium"
            >
              {product.categoryName}
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-40">{product.name}</span>
          </nav>
        </div>

        {/* Product Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <ProductGallery
              images={images}
              alt={product.name}
              badge={product.badge}
            />

            {/* Product Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-primary font-medium uppercase tracking-wider">
                  {product.categoryName}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground text-balance">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.inStock ? (
                  <span className="inline-flex items-center gap-1 text-sm font-bold">
                    {product.stockQuantity <= 5 ? (
                      <span className="inline-flex items-center gap-1 text-chart-4">
                        <Package className="h-4 w-4" />
                        Solo {product.stockQuantity} {product.stockQuantity === 1 ? 'unidad' : 'unidades'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-chart-1">
                        <Check className="h-4 w-4" />
                        En stock
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    Agotado
                  </span>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {product.fullDescription || product.description}
              </p>

              {/* Technical Details */}
              {(product.details.weight || product.details.origin) && (
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
                  {product.details.weight && (
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Contenido</span>
                      <p className="text-sm font-medium text-foreground">{product.details.weight}</p>
                    </div>
                  )}
                  {product.details.origin && (
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Origen</span>
                      <p className="text-sm font-medium text-foreground">{product.details.origin}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity & Add to Cart (Client Component) */}
              <AddToCartSection product={product} />

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/50 p-3 rounded-2xl border border-border">
                  <div className="p-2 rounded-lg bg-card shadow-sm">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">Garantía La Vie</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/50 p-3 rounded-2xl border border-border">
                  <div className="p-2 rounded-lg bg-card shadow-sm">
                    <Leaf className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">100% Natural</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits & Instructions */}
        {(product.details.ingredients || product.details.usage || (product.details.benefits && product.details.benefits.length > 0)) && (
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {product.details.ingredients && (
                  <div className="bg-card rounded-[2rem] p-8 border border-border/50 shadow-sm">
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-4">Ingredientes</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{product.details.ingredients}</p>
                  </div>
                )}
                {product.details.usage && (
                  <div className="bg-card rounded-[2rem] p-8 border border-border/50 shadow-sm">
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-4">Modo de Uso</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{product.details.usage}</p>
                  </div>
                )}
              </div>

              {product.details.benefits && product.details.benefits.length > 0 && (
                <div className="bg-primary/5 rounded-[2.5rem] p-8 border border-primary/10">
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Beneficios
                  </h3>
                  <ul className="space-y-4">
                    {product.details.benefits.map((benefit: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-4">
                        <div className="mt-1 p-1 rounded-full bg-white shadow-sm border border-primary/10">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-muted-foreground font-medium text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
             <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">También te puede gustar</h2>
                  <p className="text-muted-foreground text-sm mt-1">Productos seleccionados para complementar tu rutina.</p>
                </div>
             </div>
             <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
             </div>
          </section>
        )}

        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20 pt-4 flex justify-center">
          <Link
            href="/#catalogo"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-stone-200 transition-all group"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Ver catálogo completo
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}
