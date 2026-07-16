"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { createClient } from "@/supabase/types/client"
import { slugify } from "@/lib/utils"
import { deleteImage } from "@/supabase/types/storage"
import { AppProduct, Category, ProductWithDetails } from "@/supabase/types/database"

export function useProducts() {
  //useMemo asegura que no recreamos la instancia de supabase en cada render innecesariamente
  const supabase = useMemo(() => createClient(), [])
  
  const [products, setProducts] = useState<AppProduct[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null) // Para mostrar feedback al usuario

  const fetchData = useCallback(async (signal?: { cancelled: boolean }) => {
    setLoading(true)
    setError(null)
    try {
      // Ejecutamos ambas consultas en paralelo para mejorar el rendimiento notablemente
      const [catsResponse, prodsResponse] = await Promise.all([
        supabase.from('categories').select('*').is('deleted_at', null).order('name'),
        supabase.from('products').select(`
          *,
          categories (name, slug),
          product_multimedia (url, display_order)
        `).is('deleted_at', null).order('created_at', { ascending: false })
      ])

      if (signal?.cancelled) return

      if (catsResponse.error) throw catsResponse.error
      if (prodsResponse.error) throw prodsResponse.error

      setCategories(catsResponse.data || [])

      const mappedProducts: AppProduct[] = (prodsResponse.data as ProductWithDetails[] || []).map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku || "",
        category: p.categories?.slug || "sin-categoria",
        categoryName: p.categories?.name || "Sin categoría",
        categoryId: p.category_id || "",
        price: Number(p.price),
        stock: p.stock_quantity || 0,
        stockStatus: (p.stock_quantity || 0) > 10 ? "In Stock" : (p.stock_quantity || 0) > 0 ? "Low Stock" : "Out of Stock",
        status: p.status === 'published' ? 'Active' : p.status === 'out_of_stock' ? 'Out of Stock' : 'Draft',
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
    } catch (err: any) {
      if (signal?.cancelled) return
      console.error("Error fetching data:", err)
      setError(err.message || "Error al cargar los datos.")
    } finally {
      if (!signal?.cancelled) setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    const signal = { cancelled: false }
    fetchData(signal)
    return () => { signal.cancelled = true }
  }, [fetchData])

  const saveProduct = async (id: string, form: any, originalProduct: any) => {
    setSaving(true)
    setError(null)
    try {
      const targetCategoryId = categories.find(c => c.slug === form.category)?.id

      const { error: productError } = await supabase
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
          category_id: targetCategoryId || null,
        })
        .eq('id', id)

      if (productError) throw productError

      // 1. Limpieza física de imágenes borradas
      const originalImages = originalProduct.images || []
      const currentImages = form.images || []
      const removedImages = originalImages.filter((img: string) => !currentImages.includes(img))

      for (const imageUrl of removedImages) {
        try {
          await deleteImage(imageUrl)
        } catch (err) {
          console.error("Error borrando archivo del storage:", err)
        }
      }

      // 2. Sincronización en Base de Datos de imágenes
      if (form.images && Array.isArray(form.images)) {
        // Borramos registros anteriores de multimedia
        const { error: deleteMultiError } = await supabase
          .from('product_multimedia')
          .delete()
          .eq('product_id', id)

        if (deleteMultiError) throw deleteMultiError

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
      
      // Forzamos la re-validación de datos y esperamos a que termine
      await fetchData()
      return { success: true }
    } catch (err: any) {
      console.error("Error saving product:", err)
      setError(err.message || "Error al guardar el producto")
      return { success: false, error: err }
    } finally {
      setSaving(false)
    }
  }

  const createProduct = async (form: any) => {
    setSaving(true)
    setError(null)
    try {
      const productSlug = slugify(form.name)
      const productSku = `LVN-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
      const targetCategoryId = categories.find(c => c.slug === form.category)?.id

      const { data: newProd, error: insertError } = await supabase
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
          category_id: targetCategoryId || null,
          status: 'published'
        })
        .select()
        .single()

      if (insertError) throw insertError

      if (form.images && Array.isArray(form.images) && form.images.length > 0) {
        const multimediaToInsert = form.images.map((url: string, index: number) => ({
          product_id: newProd.id,
          url: url,
          type: 'image',
          display_order: index
        }))

        const { error: multimediaError } = await supabase
          .from('product_multimedia')
          .insert(multimediaToInsert)

        if (multimediaError) throw multimediaError
      }

      await fetchData()
      return { success: true }
    } catch (err: any) {
      console.error("Error creating product:", err)
      setError(err.message || "Error al crear el producto")
      return { success: false, error: err }
    } finally {
      setSaving(false)
    }
  }

  const addCategory = async (newCatName: string) => {
    setError(null)
    try {
      const { data, error: catError } = await supabase
        .from('categories')
        .insert({
          name: newCatName,
          slug: slugify(newCatName)
        })
        .select()
        .single()
      
      if (catError) throw catError
      
      setCategories(prev => [...prev, data])
      return { success: true, data }
    } catch (err: any) {
      console.error("Error adding category:", err)
      setError(err.message || "Error al añadir categoría")
      return { success: false, error: err }
    }
  }

  const deleteCategory = async (id: string) => {
    setError(null)
    try {
      const { error } = await supabase
        .from('categories')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      setCategories(prev => prev.filter(c => c.id !== id))
      return { success: true }
    } catch (err: any) {
      console.error("Error deleting category:", err)
      setError(err.message || "Error al eliminar categoría")
      return { success: false, error: err }
    }
  }

  const deleteProduct = async (id: string) => {
    setSaving(true)
    setError(null)
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

      if (deleteError) throw deleteError
      
      await fetchData()
      return { success: true }
    } catch (err: any) {
      console.error("Error deleting product:", err)
      setError(err.message || "Error al eliminar producto")
      return { success: false, error: err }
    } finally {
      setSaving(false)
    }
  }

  return {
    products,
    categories,
    loading,
    saving,
    error, // Expuesto para pintar una alerta en el dashboard si algo falla
    saveProduct,
    createProduct,
    addCategory,
    deleteCategory,
    deleteProduct,
    refresh: fetchData
  }
}