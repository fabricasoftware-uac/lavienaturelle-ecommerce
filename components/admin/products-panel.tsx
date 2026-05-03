"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

import { useProducts } from "@/hooks/use-products"
import { ProductsTable } from "./products/products-table"
import { ProductMobileCard } from "./products/product-mobile-card"
import { ProductFormSheet } from "./products/product-form-sheet"

export function ProductsPanel() {
  const {
    products,
    categories,
    loading,
    saving,
    saveProduct,
    createProduct,
    addCategory,
    deleteProduct,
  } = useProducts()

  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [stockFilter, setStockFilter] = useState("All")
  
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [activeProduct, setActiveProduct] = useState<any>(null)
  
  const [form, setForm] = useState<any>({
    name: "",
    price: "",
    stock: "",
    description: "",
    content: "",
    origin: "",
    ingredients: "",
    benefits: [],
    usage: "",
    category: "",
    badge: "",
    images: [],
  })

  const handleOpenDetail = (product: any) => {
    setActiveProduct(product)
    setForm({ ...product })
    setIsEditing(false)
    setIsDetailOpen(true)
  }

  const handleOpenCreate = () => {
    resetForm()
    setIsCreateOpen(true)
  }

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      stock: "",
      description: "",
      content: "",
      origin: "",
      ingredients: "",
      benefits: [],
      usage: "",
      category: "",
      badge: "",
      images: [],
    })
  }

  const handleSave = async () => {
    const res = await saveProduct(activeProduct.id, form, activeProduct)
    if (res.success) {
      setIsDetailOpen(false)
      setIsEditing(false)
    }
  }

  const handleCreate = async (e?: any) => {
    if (e) e.preventDefault()
    const res = await createProduct(form)
    if (res.success) {
      setIsCreateOpen(false)
      resetForm()
    }
  }

  const handleAddCategory = async (name: string) => {
    const res = await addCategory(name)
    if (res.success) {
      setForm((prev: any) => ({ ...prev, category: res.data.name }))
    }
  }

  const handleDelete = async (id: string) => {
    const res = await deleteProduct(id)
    if (res.success) {
      setIsDetailOpen(false)
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter
    const matchesStock = stockFilter === "All" || p.stockStatus === stockFilter
    return matchesSearch && matchesCategory && matchesStock
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/30 border-none h-11 rounded-xl text-sm font-medium"
            />
          </div>
          <div className="grid grid-cols-2 lg:flex items-center gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-secondary/30 rounded-xl px-4 py-1.5 text-xs font-semibold focus:outline-none border-none cursor-pointer h-11 transition-colors hover:bg-secondary/50 lg:min-w-37.5"
            >
              <option value="All">Todas las Categorías</option>
              {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
            </select>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="bg-secondary/30 rounded-xl px-4 py-1.5 text-xs font-semibold focus:outline-none border-none cursor-pointer h-11 transition-colors hover:bg-secondary/50"
            >
              <option value="All">Estado Stock</option>
              <option value="In Stock">En Stock</option>
              <option value="Low Stock">Bajo</option>
              <option value="Out of Stock">Agotado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <ProductsTable 
        products={filteredProducts} 
        loading={loading} 
        onOpenDetail={handleOpenDetail} 
      />

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

      {/* Detail/Edit Sheet */}
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
