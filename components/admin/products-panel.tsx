"use client"

import { useState, useEffect } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

import { useProducts } from "@/hooks/use-products"
import { ProductsTable } from "./products/products-table"
import { ProductMobileCard } from "./products/product-mobile-card"
import { ProductFormSheet } from "./products/product-form-sheet"
import { InfiniteScroll } from "@/components/infinite-scroll"
import { AppProduct } from "@/supabase/types/database"

const INITIAL_FORM_STATE: Partial<AppProduct> = {
  name: "",
  price: 0,
  stock: 0,
  description: "",
  content: "",
  origin: "",
  ingredients: "",
  benefits: [],
  usage: "",
  category: "",
  badge: "",
  images: [],
}

export function ProductsPanel() {
  const {
    products,
    categories,
    loading,
    saving,
    error, 
    saveProduct,
    createProduct,
    addCategory,
    deleteProduct,
  } = useProducts()

  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [stockFilter, setStockFilter] = useState("All")
  const [displayCount, setDisplayCount] = useState(20)
  const STEP = 20

  
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [activeProduct, setActiveProduct] = useState<AppProduct | null>(null)
  
  // Estado del formulario
  const [form, setForm] = useState<Partial<AppProduct>>(INITIAL_FORM_STATE)

  const handleOpenDetail = (product: AppProduct) => {
    setActiveProduct(product)
    setForm({ ...product })
    setIsEditing(false)
    setIsDetailOpen(true)
  }

  const handleOpenCreate = () => {
    setForm(INITIAL_FORM_STATE) // Limpieza inmediata y segura
    setIsCreateOpen(true)
  }

  const handleSave = async () => {
    if (!activeProduct?.id) return
    if (Number(form.stock) < 0) {
      toast.error("El stock no puede ser negativo")
      return
    }
    const res = await saveProduct(activeProduct.id, form, activeProduct)
    if (res.success) {
      setIsDetailOpen(false)
      setIsEditing(false)
    }
  }

  const handleCreate = async (e?: any) => {
    if (e) e.preventDefault()
    if (Number(form.stock) < 0) {
      toast.error("El stock no puede ser negativo")
      return
    }
    const res = await createProduct(form)
    if (res.success) {
      setIsCreateOpen(false)
      setForm(INITIAL_FORM_STATE)
    }
  }

  const handleAddCategory = async (name: string) => {
    const res = await addCategory(name)
    if (res.success) {
      // Sincronizamos con el slug para mantener consistencia con el resto del flujo
      setForm((prev) => ({ ...prev, category: res.data?.slug }))
    }
  }

  const handleDelete = async (id: string) => {
    const res = await deleteProduct(id)
    if (res.success) {
      setIsDetailOpen(false)
    }
  }

  // Filtrado optimizado y seguro contra errores de runtime
  const filteredProducts = products.filter(p => {
    const nameMatch = p.name?.toLowerCase() || ""
    const idMatch = p.id?.toLowerCase() || ""
    const search = searchQuery.toLowerCase()

    const matchesSearch = nameMatch.includes(search) || idMatch.includes(search)
    
    // Filtramos usando el SLUG de la categoría para evitar discrepancias de mayúsculas o tildes
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter
    const matchesStock = stockFilter === "All" || p.stockStatus === stockFilter
    
    return matchesSearch && matchesCategory && matchesStock
  })
  .sort((a, b) => a.name.localeCompare(b.name))

  useEffect(() => { setDisplayCount(STEP) }, [searchQuery, categoryFilter, stockFilter])

  const visibleProducts = filteredProducts.slice(0, displayCount)
  const hasMore = displayCount < filteredProducts.length

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Banner de error global si el hook falla */}
      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-xl border border-destructive/20 text-sm font-medium">
          ⚠️ {error} - Intenta recargar si el problema persiste.
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground tracking-tight">Gestión de Inventario</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Panel de control de productos y categorías.</p>
        </div>
        <Button 
          onClick={handleOpenCreate}
          className="bg-primary hover:bg-primary/90 text-white h-11 rounded-xl px-6 font-bold text-xs uppercase tracking-widest cursor-pointer shadow-lg shadow-primary/10 transition-all active:scale-95"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span>Añadir Producto</span>
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="bg-card rounded-xl border border-border p-3 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o ID..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setDisplayCount(STEP) }}
              className="pl-10 bg-secondary/30 border-none h-11 rounded-xl text-sm font-medium"
            />
          </div>
          <div className="grid grid-cols-2 lg:flex items-center gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setDisplayCount(STEP) }}
              className="bg-secondary/30 rounded-xl px-4 py-1.5 text-xs font-semibold focus:outline-none border-none cursor-pointer h-11 transition-colors hover:bg-secondary/50 lg:min-w-37.5"
            >
              <option value="All">Todas las Categorías</option>
              {/* onChange también resetea página */}
              {/* IMPORTANTE: El value debe ser el SLUG para que coincida con tu p.category del hook */}
              {categories.map(cat => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <InfiniteScroll loadMore={() => setDisplayCount(prev => prev + STEP)} hasMore={hasMore}>
        <ProductsTable 
          products={visibleProducts} 
          loading={loading} 
          onOpenDetail={handleOpenDetail} 
        />
      </InfiniteScroll>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-4 space-y-4 shadow-sm">
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          ))
        ) : filteredProducts.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-12 text-center text-muted-foreground font-medium italic opacity-60">
            No se encontraron productos.
          </div>
        ) : (
          filteredProducts.map((p) => (
            <ProductMobileCard 
              key={p.id} 
              product={p} 
              onOpenDetail={handleOpenDetail} 
            />
          ))
        )}
      </div>

      {/* Detalle/Edit Sheet */}
      <ProductFormSheet 
        isOpen={isDetailOpen} 
        setIsOpen={setIsDetailOpen} 
        data={form} 
        setForm={setForm}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onSave={handleSave}
        title="Detalle del Producto"
        categories={categories}
        onAddCategory={handleAddCategory}
        onDelete={handleDelete}
        saving={saving}
      />

      {/* Create Sheet */}
      <ProductFormSheet 
        isOpen={isCreateOpen} 
        setIsOpen={setIsCreateOpen} 
        data={form} 
        setForm={setForm}
        isEditing={true}
        setIsEditing={() => {}} 
        onSave={handleCreate}
        title="Nuevo Producto"
        categories={categories}
        onAddCategory={handleAddCategory}
        onDelete={() => {}} 
        saving={saving}
      />
    </div>
  )
}