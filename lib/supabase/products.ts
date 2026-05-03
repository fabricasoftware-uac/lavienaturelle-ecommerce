import { createClient as createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { AppProduct, Category, ProductWithDetails } from "@/types/database"

export async function getProducts() {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (id, name, slug),
      product_multimedia (url, display_order)
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  const products = data as ProductWithDetails[]

  return products.map(p => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    category: p.categories?.name || 'otros',
    categoryName: p.categories?.name || 'Otros',
    image: p.product_multimedia?.[0]?.url || "/logo-script.png",
    images: p.product_multimedia?.map((m) => m.url) || [],
    description: p.description || "",
    fullDescription: p.full_description || "",
    badge: p.badge || "",
    details: {
      weight: p.weight || "",
      origin: p.origin || "",
      ingredients: p.ingredients || "",
      usage: p.usage_instructions || "",
      benefits: p.benefits || []
    },
    inStock: p.stock_quantity > 0
  })) as any[] // Keeping as any[] for now to avoid breaking UI that expects the old AppProduct structure if it differs slightly
}

export async function getCategories() {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .is('deleted_at', null)
    .order('name')

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data as Category[]
}

export async function getProductBySlugOrId(id: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (id, name, slug),
      product_multimedia (url, display_order)
    `)
    .or(`id.eq.${id},slug.eq.${id}`)
    .is('deleted_at', null)
    .single()

  if (error) {
    console.error("Error fetching product:", error)
    return null
  }

  const p = data as ProductWithDetails

  return {
    id: p.id,
    name: p.name,
    price: Number(p.price),
    category: p.categories?.name || 'otros',
    categoryName: p.categories?.name || 'Otros',
    image: p.product_multimedia?.[0]?.url || "/logo-script.png",
    images: p.product_multimedia?.map((m) => m.url) || [],
    description: p.description || "",
    fullDescription: p.full_description || "",
    badge: p.badge || "",
    details: {
      weight: p.weight || "",
      origin: p.origin || "",
      ingredients: p.ingredients || "",
      usage: p.usage_instructions || "",
      benefits: p.benefits || []
    },
    inStock: p.stock_quantity > 0
  }
}
