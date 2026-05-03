"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { slugify } from "@/lib/utils"

export function useProducts() {
  const supabase = createClient()
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
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
      
      const mappedProducts = (prodsData || []).map(p => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        category: p.categories?.name || "Sin categoría",
        categoryId: p.category_id,
        price: p.price,
        stock: p.stock_quantity,
        stockStatus: p.stock_quantity > 10 ? "In Stock" : p.stock_quantity > 0 ? "Low Stock" : "Out of Stock",
        status: p.status === 'published' ? 'Active' : 'Draft',
        image: p.product_multimedia?.[0]?.url || "https://via.placeholder.com/300?text=No+Image",
        images: p.product_multimedia?.map((m: any) => m.url) || [],
        description: p.description,
        fullDescription: p.full_description,
        content: p.weight,
        origin: p.origin,
        ingredients: p.ingredients,
        benefits: p.benefits || [],
        usage: p.usage_instructions,
        badge: p.badge,
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

      if (form.image && form.image !== originalProduct.image) {
        const { data: existingImg } = await supabase
          .from('product_multimedia')
          .select('id')
          .eq('product_id', id)
          .eq('display_order', 0)
          .single()

        if (existingImg) {
          await supabase
            .from('product_multimedia')
            .update({ url: form.image })
            .eq('id', existingImg.id)
        } else {
          await supabase
            .from('product_multimedia')
            .insert({
              product_id: id,
              url: form.image,
              type: 'image',
              display_order: 0
            })
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

      if (form.image && form.image.startsWith('http')) {
        await supabase
          .from('product_multimedia')
          .insert({
            product_id: newProd.id,
            url: form.image,
            type: 'image',
            display_order: 0
          })
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

  return {
    products,
    categories,
    loading,
    saving,
    saveProduct,
    createProduct,
    addCategory,
    refresh: fetchData
  }
}
