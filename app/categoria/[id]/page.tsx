import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartDrawer } from "@/components/cart-drawer"
import { getProducts, getCategories } from "@/lib/supabase/products"
import { CategoryContent } from "./category-content"

interface CategoryPageProps {
  params: Promise<{ id: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params
  const categoryIdOrSlug = resolvedParams.id

  const allCategories = await getCategories()
  const category = allCategories.find(c => c.slug === categoryIdOrSlug || c.id === categoryIdOrSlug)

  if (!category) {
    notFound()
  }

  const allProducts = await getProducts()
  const categoryProducts = allProducts.filter(p => p.category === (category.slug || category.id))

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <CategoryContent 
          category={category} 
          products={categoryProducts} 
          allCategories={allCategories} 
          allProducts={allProducts}
        />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
