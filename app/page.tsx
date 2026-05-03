import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ProductCatalog } from "@/components/product-catalog"
import { Footer } from "@/components/footer"
import { CartDrawer } from "@/components/cart-drawer"
import { getProducts, getCategories } from "@/lib/supabase/products"

export default async function HomePage() {
  const products = await getProducts()
  const categories = await getCategories()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <div className="pt-20">
          <ProductCatalog initialProducts={products} initialCategories={categories} />
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
