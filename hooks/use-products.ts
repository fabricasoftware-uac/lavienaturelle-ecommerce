"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { slugify } from "@/lib/utils"
import { deleteImage } from "@/lib/supabase/storage"
import { AppProduct, Category, ProductWithDetails } from "@/types/database"

export function useProducts() {
  const supabase = createClient()
  const [products, setProducts] = useState<AppProduct[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch categories
      const { data: catsData, error: catsError } = await supabase
        .from('categories')
        .select('*')
        .is('deleted_at', null)
        .order('name')
      
      if (catsError) throw catsError
      setCategories(catsData || [])

      // Fetch products
      const { data: prodsData, error: prodsError } = await supabase
        .from('products')
        .select(`
          *,
          categories (name),
          product_multimedia (url, display_order)
        `)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
      
      if (prodsError) throw prodsError
      
      const mappedProducts: AppProduct[] = (prodsData as ProductWithDetails[] || []).map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku || "",
        category: p.categories?.name || "Sin categoría",
        categoryId: p.category_id || "",
        price: Number(p.price),
        stock: p.stock_quantity || 0,
        stockStatus: (p.stock_quantity || 0) > 10 ? "In Stock" : (p.stock_quantity || 0) > 0 ? "Low Stock" : "Out of Stock",
        status: p.status === 'published' ? 'Active' : 'Draft',
        image: p.product_multimedia?.[0]?.url || "/logo-script.png",
        images: p.product_multimedia?.map((m: any) => m.url) || [],
        description: p.description || "",
        fullDescription: p.full_description || "",
        content: p.weight || "",
        origin: p.origin || "",
        ingredients: p.ingredients || "",
        benefits: p.benefits || [],
        usage: p.usage_instructions || "",
        badge: p.badge || "",
      }))
      
      setProducts(mappedProducts)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const saveProduct = async (id: string, form: any, originalProduct: any) => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: form.name,
          slug: slugify(form.name),
          price: Number(form.price),
          stock_quantity: Number(form.stock),
          description: form.description,
          weight: form.content,
          origin: form.origin,
          ingredients: form.ingredients,
          benefits: form.benefits,
          usage_instructions: form.usage,
          badge: form.badge,
          category_id: categories.find(c => c.name === form.category)?.id
        })
        .eq('id', id)

      if (error) throw error

      // 1. Physical deletion from Storage for removed images
      const originalImages = originalProduct.images || []
      const currentImages = form.images || []
      const removedImages = originalImages.filter((img: string) => !currentImages.includes(img))

      for (const imageUrl of removedImages) {
        try {
          await deleteImage(imageUrl)
        } catch (err) {
          console.error("Error deleting physical file from storage:", err)
        }
      }

      // 2. Sync images in Database
      if (form.images && Array.isArray(form.images)) {
        // Simple approach: delete existing and insert new ones
        await supabase
          .from('product_multimedia')
          .delete()
          .eq('product_id', id)

        if (form.images.length > 0) {
          const multimediaToInsert = form.images.map((url: string, index: number) => ({
            product_id: id,
            url: url,
            type: 'image',
            display_order: index
          }))

          const { error: multimediaError } = await supabase
            .from('product_multimedia')
            .insert(multimediaToInsert)

          if (multimediaError) throw multimediaError
        }
      }
      
      await fetchData()
      return { success: true }
    } catch (error) {
      console.error("Error saving product:", error)
      return { success: false, error }
    } finally {
      setSaving(false)
    }
  }

  const createProduct = async (form: any) => {
    setSaving(true)
    try {
      const productSlug = slugify(form.name)
      const productSku = `LVN-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
      
      const { data: newProd, error } = await supabase
        .from('products')
        .insert({
          name: form.name,
          slug: productSlug,
          sku: productSku,
          price: Number(form.price),
          stock_quantity: Number(form.stock),
          description: form.description,
          weight: form.content,
          origin: form.origin,
          ingredients: form.ingredients,
          benefits: form.benefits,
          usage_instructions: form.usage,
          badge: form.badge,
          category_id: categories.find(c => c.name === form.category)?.id,
          status: 'published'
        })
        .select()
        .single()

      if (error) throw error

      if (form.images && Array.isArray(form.images) && form.images.length > 0) {
        const multimediaToInsert = form.images.map((url: string, index: number) => ({
          product_id: newProd.id,
          url: url,
          type: 'image',
          display_order: index
        }))

        await supabase
          .from('product_multimedia')
          .insert(multimediaToInsert)
      }

      await fetchData()
      return { success: true }
    } catch (error) {
      console.error("Error creating product:", error)
      return { success: false, error }
    } finally {
      setSaving(false)
    }
  }

  const addCategory = async (newCatName: string) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: newCatName,
          slug: slugify(newCatName)
        })
        .select()
        .single()
      
      if (error) throw error
      
      setCategories(prev => [...prev, data])
      return { success: true, data }
    } catch (error) {
      console.error("Error adding category:", error)
      return { success: false, error }
    }
  }

  const deleteProduct = async (id: string) => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('products')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      
      await fetchData()
      return { success: true }
    } catch (error) {
      console.error("Error deleting product:", error)
      return { success: false, error }
    } finally {
      setSaving(false)
    }
  }

  return {
    products,
    categories,
    loading,
    saving,
    saveProduct,
    createProduct,
    addCategory,
    deleteProduct,
    refresh: fetchData
  }
}
