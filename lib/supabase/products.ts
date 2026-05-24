import { createClient as createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { CatalogProduct, Category, ProductWithDetails } from "@/lib/supabase/types/database"

export async function getProducts(): Promise<CatalogProduct[]> {
  // 1. Obtenemos el store de cookies del servidor
  // 2. Se lo pasamos a tu inicializador (con un solo await si tu función es asíncrona)
  const supabase = await createServerClient()
  
  // 3. Limpiamos el query quitando el doble await
  const { data, error } = await supabase.from('products')
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
    category: p.categories?.slug || 'otros',
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
    inStock: p.stock_quantity > 0,
    stockQuantity: p.stock_quantity
  })) as CatalogProduct[]
}

export async function getCategories() {
  const supabase = await createServerClient()
  
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

export async function getProductBySlugOrId(id: string): Promise<CatalogProduct | null> {
  const supabase = await createServerClient()
  
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
    category: p.categories?.slug || 'otros',
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
    inStock: p.stock_quantity > 0,
    stockQuantity: p.stock_quantity
  }
}