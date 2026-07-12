import { HeroSection } from "@/components/hero-section"
import { ProductCatalog } from "@/components/product-catalog"
import { Footer } from "@/components/footer"
import { CartDrawer } from "@/components/cart-drawer"
import { getProducts, getCategories } from "@/supabase/types/products"

export default async function HomePage() {
  const products = await getProducts()
  const categories = await getCategories()

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroSection />
        <ProductCatalog initialProducts={products} initialCategories={categories} />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
