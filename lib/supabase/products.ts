import { createClient as createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

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

  return data.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    category: p.categories?.slug || 'otros',
    categoryName: p.categories?.name || 'Otros',
    image: p.product_multimedia?.[0]?.url || "https://via.placeholder.com/300?text=No+Image",
    images: p.product_multimedia?.map((m: any) => m.url) || [],
    description: p.description,
    fullDescription: p.full_description,
    badge: p.badge,
    details: {
      weight: p.weight,
      origin: p.origin,
      ingredients: p.ingredients,
      usage: p.usage_instructions,
      benefits: p.benefits || []
    },
    inStock: p.stock_quantity > 0
  }))
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

  return data
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

  return {
    id: data.id,
    name: data.name,
    price: data.price,
    category: data.categories?.slug || 'otros',
    categoryName: data.categories?.name || 'Otros',
    image: data.product_multimedia?.[0]?.url || "https://via.placeholder.com/300?text=No+Image",
    images: data.product_multimedia?.map((m: any) => m.url) || [],
    description: data.description,
    fullDescription: data.full_description,
    badge: data.badge,
    details: {
      weight: data.weight,
      origin: data.origin,
      ingredients: data.ingredients,
      usage: data.usage_instructions,
      benefits: data.benefits || []
    },
    inStock: data.stock_quantity > 0
  }
}
