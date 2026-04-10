import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ProductCatalog } from "@/components/product-catalog"
import { Footer } from "@/components/footer"
import { CartDrawer } from "@/components/cart-drawer"
import { StoreProvider } from "@/lib/store-context"

export default function HomePage() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <HeroSection />
          <ProductCatalog />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </StoreProvider>
  )
}
