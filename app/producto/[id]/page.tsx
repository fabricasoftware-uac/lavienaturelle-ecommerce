"use client"

import { useState, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { 
  ChevronLeft, 
  ShoppingCart, 
  Check, 
  Minus, 
  Plus,
  Truck,
  Shield,
  Leaf,
  Package
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { CartDrawer } from "@/components/cart-drawer"
import { Footer } from "@/components/footer"
import { useStore } from "@/lib/store-context"
import { getProductById, getCategoryById, products } from "@/lib/products"
import { cn, formatPrice } from "@/lib/utils"
import { ProductCard } from "@/components/product-card"
import { Sparkles } from "lucide-react"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

function ProductDetailContent({ productId }: { productId: string }) {
  const product = getProductById(productId)
  const { addToCart } = useStore()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    notFound()
  }

  const category = getCategoryById(product.category)
  const images = product.images || [product.image]

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <Link href={`/categoria/${category?.id}`} className="hover:text-primary transition-colors">
              {category?.namePlural || "Productos"}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>

        {/* Product Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary/30 border border-border/50">
                {product.badge && (
                  <div className="absolute top-4 left-4 z-10">
                    <span
                      className={cn(
                        "px-4 py-1.5 text-sm font-medium rounded-full",
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
                <Image
                  src={images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={cn(
                        "relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all",
                        selectedImage === idx 
                          ? "border-primary ring-2 ring-primary/20" 
                          : "border-border/50 hover:border-primary/50"
                      )}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} - imagen ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-primary font-medium uppercase tracking-wider">
                  {category?.name || product.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground text-balance">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.inStock !== false && (
                  <span className="inline-flex items-center gap-1 text-sm text-chart-1">
                    <Check className="h-4 w-4" />
                    En stock
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {product.fullDescription || product.description}
              </p>

              {/* Details */}
              {product.details && (
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
                  {product.details.weight && (
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Contenido</span>
                      <p className="text-sm font-medium text-foreground">{product.details.weight}</p>
                    </div>
                  )}
                  {product.details.origin && (
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Origen</span>
                      <p className="text-sm font-medium text-foreground">{product.details.origin}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <div className="flex items-center border border-border rounded-xl overflow-hidden bg-white sm:w-auto w-full justify-between sm:justify-start">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3.5 hover:bg-secondary/50 transition-colors"
                    aria-label="Reducir cantidad"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="w-14 text-center font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3.5 hover:bg-secondary/50 transition-colors"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                <Button 
                  size="lg" 
                  className="flex-1 p-5 gap-3 rounded-xl text-base font-bold shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all active:scale-[0.98]"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Agregar al Carrito
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground bg-stone-50/50 p-3 rounded-2xl border border-stone-100">
                  <div className="p-2 rounded-lg bg-white shadow-sm">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">Garantia</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground bg-stone-50/50 p-3 rounded-2xl border border-stone-100">
                  <div className="p-2 rounded-lg bg-white shadow-sm">
                    <Leaf className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">100% Natural</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Details Tabs */}
        {product.details && (
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Ingredients & Usage */}
              <div className="space-y-6">
                {product.details.ingredients && (
                  <div className="bg-card rounded-[2rem] p-8 border border-border/50 shadow-sm">
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                      Ingredientes
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {product.details.ingredients}
                    </p>
                  </div>
                )}
                {product.details.usage && (
                  <div className="bg-card rounded-[2rem] p-8 border border-border/50 shadow-sm">
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                      Modo de Uso
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {product.details.usage}
                    </p>
                  </div>
                )}
              </div>

              {/* Benefits */}
              {product.details.benefits && product.details.benefits.length > 0 && (
                <div className="bg-primary/5 rounded-[2.5rem] p-8 border border-primary/10">
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Beneficios
                  </h3>
                  <ul className="space-y-4">
                    {product.details.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <div className="mt-1 p-1 rounded-full bg-white shadow-sm border border-primary/10">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-stone-600 font-medium text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Related Products */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-stone-100">
           <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">También te puede gustar</h2>
                <p className="text-stone-500 text-sm mt-1">Productos seleccionados para complementar tu rutina.</p>
              </div>
           </div>
           
           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {products
                .filter(p => p.category === product.category && p.id !== product.id)
                .slice(0, 4)
                .map(p => (
                  <ProductCard key={p.id} product={p} />
                ))
              }
           </div>
        </section>

        {/* Back to Catalog */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20 flex justify-center">
          <Link
            href="/#catalogo"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-stone-50 text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-all font-bold text-xs uppercase tracking-widest group"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Volver al catalogo completo
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = use(params)

  return <ProductDetailContent productId={resolvedParams.id} />
}
