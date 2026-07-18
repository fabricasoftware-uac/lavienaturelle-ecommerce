"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { createClient } from "@/supabase/types/client"
import { CatalogProduct, Category, ProductWithDetails } from "@/supabase/types/database"

export function useRealtimeProducts(
  initialProducts: CatalogProduct[],
  initialCategories: Category[]
) {
  const supabase = useMemo(() => createClient(), [])
  const [products, setProducts] = useState<CatalogProduct[]>(initialProducts)
  const [categories, setCategories] = useState<Category[]>(initialCategories)

  const refetchProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories (id, name, slug),
        product_multimedia (url, display_order)
      `)
      .is("deleted_at", null)
      .in("status", ["published", "out_of_stock"])
      .order("created_at", { ascending: false })

    if (error || !data) return

    const mapped: CatalogProduct[] = (data as ProductWithDetails[]).map((p) => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      category: p.categories?.slug || "otros",
      categoryName: p.categories?.name || "Otros",
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
        benefits: p.benefits || [],
      },
      inStock: p.stock_quantity > 0,
      stockQuantity: p.stock_quantity,
    }))

    setProducts(mapped)
  }, [supabase])

  const refetchCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .is("deleted_at", null)
      .order("name")

    if (error || !data) return
    setCategories(data as Category[])
  }, [supabase])

  useEffect(() => {
    const channel = supabase
      .channel("catalog-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          refetchProducts()
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "categories" },
        () => {
          refetchCategories()
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "product_multimedia" },
        () => {
          refetchProducts()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, refetchProducts, refetchCategories])

  return { products, categories }
}
