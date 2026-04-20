"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Copy,
  Package,
  ChevronLeft,
  ChevronRight,
  Download,
  Image as ImageIcon,
  Save,
  X,
  PlusCircle,
  Tag,
  DollarSign,
  Layers,
  CheckCircle2,
  AlertCircle,
  Box,
  MapPin,
  ListChecks,
  Info,
  Beaker,
  Sparkles,
  UploadCloud,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

// Mock Data for Products
const INITIAL_PRODUCTS = [
  {
    id: "PROD-001",
    name: "Aceite de Lavanda Orgánico",
    sku: "LAV-001",
    category: "Aceites Esenciales",
    price: 24.99,
    stock: 45,
    stockStatus: "In Stock",
    status: "Active",
    image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&q=80&w=300",
    description: "Aceite esencial de lavanda 100% puro y orgánico, ideal para relajación y aromaterapia.",
    content: "30ml",
    origin: "Francia",
    ingredients: "Lavandula angustifolia essential oil",
    benefits: ["Relajante", "Antiséptico", "Facilita el sueño"],
    usage: "Aplicar 2-3 gotas en el difusor o diluir en aceite portador.",
    badge: "Nuevo!",
  },
  {
    id: "PROD-002",
    name: "Jabón Artesanal de Romero",
    sku: "ROM-JAB",
    category: "Higiene Personal",
    price: 12.50,
    stock: 8,
    stockStatus: "Low Stock",
    status: "Active",
    image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=300",
    description: "Jabón hecho a mano con extracto de romero fresco y aceites vegetales.",
    content: "100g",
    origin: "España",
    ingredients: "Glicerina vegetal, extracto de romero, aceite de oliva.",
    benefits: ["Antioxidante", "Tonificante", "Libre de parabenos"],
    usage: "Usar diariamente en la ducha.",
    badge: "Oferta!",
  },
]

const INITIAL_CATEGORIES = ["Aceites Esenciales", "Higiene Personal", "Cuidado Capilar", "Hogar"]

export function ProductsPanel() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS)
  const [categories, setCategories] = useState(INITIAL_CATEGORIES)
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  const handleOpenDetail = (product: any) => {
    setActiveProduct(product)
    setForm({ ...product })
    setIsEditing(false)
    setIsDetailOpen(true)
  }

  const handleSaveProduct = () => {
    setProducts(prev => prev.map(p => 
      p.id === activeProduct.id 
        ? { ...form, stockStatus: Number(form.stock) > 10 ? "In Stock" : Number(form.stock) > 0 ? "Low Stock" : "Out of Stock" } 
        : p
    ))
    setIsDetailOpen(false)
    setIsEditing(false)
  }

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault()
    const newProd = {
      ...form,
      id: `PROD-${Math.floor(100 + Math.random() * 900)}`,
      sku: `SKU-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      stockStatus: Number(form.stock) > 0 ? "In Stock" : "Out of Stock",
      status: "Active",
      image: form.images[0] || "https://via.placeholder.com/300?text=No+Image",
    }
    setProducts([newProd, ...products])
    setIsCreateOpen(false)
    resetForm()
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

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter
    const matchesStock = stockFilter === "All" || p.stockStatus === stockFilter
    return matchesSearch && matchesCategory && matchesStock
  })

  const getStockBadge = (status: string) => {
    switch (status) {
      case "In Stock": return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium">En Stock</Badge>
      case "Low Stock": return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 font-medium">Stock Bajo</Badge>
      case "Out of Stock": return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 font-medium">Sin Stock</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  const getProductBadge = (badge: string) => {
    if (!badge) return null
    if (badge === "Nuevo!") return <Badge className="bg-primary text-white border-none text-[10px] font-bold">{badge}</Badge>
    if (badge === "Oferta!") return <Badge className="bg-orange-500 text-white border-none text-[10px] font-bold">{badge}</Badge>
    return <Badge variant="secondary" className="text-[10px] font-bold">{badge}</Badge>
  }

  const addNewCategory = (newCat: string) => {
    if (newCat && !categories.includes(newCat)) {
      setCategories([...categories, newCat])
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground tracking-tight">Gestión de Inventario</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Panel de control de productos y categorías.</p>
        </div>
        <Button 
          onClick={() => { resetForm(); setIsCreateOpen(true); }}
          className="bg-primary hover:bg-primary/90 text-white h-11 rounded-xl px-6 font-bold text-xs uppercase tracking-widest cursor-pointer shadow-lg shadow-primary/10 transition-all active:scale-95"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Añadir Producto</span>
          <span className="sm:hidden">Añadir Producto</span>
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
              className="bg-secondary/30 rounded-xl px-4 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary/40 border-none cursor-pointer h-11 transition-colors hover:bg-secondary/50 lg:min-w-37.5"
            >
              <option value="All">Todas las Categorías</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="bg-secondary/30 rounded-xl px-4 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary/40 border-none cursor-pointer h-11 transition-colors hover:bg-secondary/50"
            >
              <option value="All">Estado Stock</option>
              <option value="In Stock">En Stock</option>
              <option value="Low Stock">Bajo</option>
              <option value="Out of Stock">Agotado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/10 border-b border-border">
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Producto</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Categoría</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Precio</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Stock</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-6 py-6"><Skeleton className="h-10 w-full rounded-xl" /></td></tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-24 text-center text-muted-foreground font-medium italic opacity-60">No se encontraron productos coincidentes.</td></tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-primary/2 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl border border-border bg-muted overflow-hidden shrink-0 shadow-sm transition-transform group-hover:scale-105">
                          <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                             <span className="text-sm font-bold text-foreground leading-none">{p.name}</span>
                             {getProductBadge(p.badge)}
                          </div>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">ID: {p.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-semibold text-muted-foreground/80">{p.category}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-foreground tabular-nums">${Number(p.price || 0).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-5">
                      {getStockBadge(p.stockStatus)}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleOpenDetail(p)}
                        className="h-10 text-[11px] font-bold px-5 rounded-xl border-border hover:bg-secondary hover:text-primary transition-all cursor-pointer shadow-sm group/btn"
                      >
                        <Eye className="h-3.5 w-3.5 mr-2 transition-transform group-hover/btn:scale-110" />
                        Ver Detalles
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-4 space-y-4 shadow-sm">
              <div className="flex gap-4">
                <Skeleton className="h-16 w-16 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))
        ) : filteredProducts.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-12 text-center text-muted-foreground font-medium italic opacity-60">
            No se encontraron productos.
          </div>
        ) : (
          filteredProducts.map((p) => (
            <div key={p.id} className="bg-card rounded-2xl border border-border p-4 shadow-sm active:scale-[0.98] transition-all" onClick={() => handleOpenDetail(p)}>
              <div className="flex gap-4 mb-4">
                <div className="h-20 w-20 rounded-xl border border-border bg-muted overflow-hidden shrink-0 shadow-sm">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-sm font-bold text-foreground leading-tight truncate">{p.name}</span>
                    {getProductBadge(p.badge)}
                  </div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2 tracking-tighter">ID: {p.id}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground/80">{p.category}</span>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <span className="text-sm font-black text-foreground">${Number(p.price || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border/50 pt-4">
                {getStockBadge(p.stockStatus)}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-[11px] font-bold text-primary"
                >
                  Ver Detalles
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <ProductFormSheet 
        isOpen={isDetailOpen} 
        setIsOpen={setIsDetailOpen} 
        data={form} 
        setForm={setForm}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onSave={handleSaveProduct}
        title="Detalle del Producto"
        categories={categories}
        onAddCategory={addNewCategory}
      />

      <ProductFormSheet 
        isOpen={isCreateOpen} 
        setIsOpen={setIsCreateOpen} 
        data={form} 
        setForm={setForm}
        isEditing={true}
        setIsEditing={() => {}} 
        onSave={handleCreateProduct}
        title="Nuevo Producto"
        categories={categories}
        onAddCategory={addNewCategory}
      />
    </div>
  )
}

function ProductFormSheet({ isOpen, setIsOpen, data, setForm, isEditing, setIsEditing, onSave, title, categories, onAddCategory }: any) {
  const isCreation = title === "Nuevo Producto"
  const [newCategoryName, setNewCategoryName] = useState("")
  const [showCategoryInput, setShowCategoryInput] = useState(false)

  const addBenefit = () => setForm({ ...data, benefits: [...(data.benefits || []), ""] })
  const updateBenefit = (val: string, idx: number) => {
    const next = [...data.benefits]
    next[idx] = val
    setForm({ ...data, benefits: next })
  }
  const removeBenefit = (idx: number) => setForm({ ...data, benefits: data.benefits.filter((_: any, i: number) => i !== idx) })

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim())
      setForm({ ...data, category: newCategoryName.trim() })
      setNewCategoryName("")
      setShowCategoryInput(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="sm:max-w-2xl p-0 flex flex-col h-full border-l border-border bg-background shadow-2xl">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="px-5 sm:px-8 pt-8 sm:pt-10 pb-6 border-b border-border bg-card/50 backdrop-blur-md z-30 shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <SheetTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground">{title}</SheetTitle>
                <SheetDescription className="text-[10px] sm:text-xs font-semibold text-muted-foreground mt-1">
                  {isCreation ? "Añade un nuevo producto a tu catálogo botánico." : `Gestión de información para ID: ${data.id}`}
                </SheetDescription>
              </div>
              <div className="flex items-center gap-2">
                 {!isCreation && !isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="flex-1 sm:flex-initial rounded-xl h-9 px-5 text-[11px] font-bold uppercase tracking-wider cursor-pointer">
                    <Edit className="h-3.5 w-3.5 mr-2" /> Editar
                  </Button>
                 ) : (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="flex-1 sm:flex-initial rounded-xl h-9 px-4 text-[11px] font-bold text-muted-foreground">Cancelar</Button>
                    <Button onClick={onSave} className="flex-1 sm:flex-initial bg-primary text-white rounded-xl h-9 px-6 text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-primary/10 transition-all hover:bg-primary/90">
                      <Save className="h-3.5 w-3.5 mr-2" /> {isCreation ? "Crear" : "Guardar"}
                    </Button>
                  </div>
                 )}
              </div>
            </div>
            {!isEditing && (
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px]">{data.category}</Badge>
                {data.badge && <Badge className="bg-orange-500 text-white border-none text-[10px]">{data.badge}</Badge>}
              </div>
            )}
          </div>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 sm:py-8 space-y-10 sm:space-y-12">
            
            {/* Image Upload Pattern */}
            <section className="space-y-4">
              <h3 className="text-[11px] font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" /> Imágenes del Producto <span className="text-[9px] lowercase font-medium opacity-50">(opcional)</span>
              </h3>
              {isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="h-40 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:bg-muted/30 transition-all cursor-pointer group">
                    <UploadCloud className="h-8 w-8 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                    <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">Subir</p>
                    <p className="text-[9px] text-muted-foreground italic">(Máx 2)</p>
                  </div>
                  {data.image ? (
                    <div className="h-40 rounded-2xl bg-muted overflow-hidden border border-border group relative">
                       <img src={data.image} alt="" className="w-full h-full object-cover" />
                       <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                         <X className="h-4 w-4" />
                       </Button>
                    </div>
                  ) : (
                    <div className="h-40 rounded-2xl border border-border bg-muted/20 flex items-center justify-center italic text-muted-foreground text-[10px] opacity-40 uppercase font-bold tracking-tighter">
                      Sin imagen
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-48 sm:h-64 w-full rounded-2xl overflow-hidden border border-border shadow-inner">
                   <img src={data.image || "https://via.placeholder.com/300?text=No+Image"} alt={data.name} className="h-full w-full object-cover" />
                </div>
              )}
            </section>

            {/* General Info */}
            <section className="space-y-6">
               <h3 className="text-[11px] font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                 <Info className="h-4 w-4 text-primary" /> Información General
               </h3>
               {isEditing ? (
                  <div className="grid grid-cols-1 gap-5 p-5 sm:p-7 rounded-3xl sm:rounded-4xl bg-white border border-border shadow-inner animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">Nombre Comercial</label>
                        <Input placeholder="Ej: Jabón de Romero" value={data.name} onChange={(e) => setForm({...data, name: e.target.value})} className="h-12 bg-secondary/20 rounded-2xl border-none font-bold text-sm" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">Precio ($)</label>
                          <Input type="number" value={data.price} onChange={(e) => setForm({...data, price: e.target.value})} className="h-12 bg-secondary/20 rounded-2xl border-none font-bold text-sm" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">Stock</label>
                          <Input type="number" value={data.stock} onChange={(e) => setForm({...data, stock: e.target.value})} className="h-12 bg-secondary/20 rounded-2xl border-none font-bold text-sm" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">Categoría</label>
                          <div className="flex gap-2">
                            {showCategoryInput ? (
                              <div className="flex-1 flex gap-2 animate-in zoom-in-95 duration-200">
                                <Input 
                                  placeholder="Nombre de la nueva categoría" 
                                  value={newCategoryName} 
                                  onChange={(e) => setNewCategoryName(e.target.value)}
                                  className="h-12 bg-secondary/20 rounded-2xl border-none font-bold text-sm"
                                />
                                <Button type="button" onClick={handleCreateCategory} className="h-12 w-12 rounded-2xl bg-primary text-white shrink-0"><CheckCircle2 className="h-5 w-5" /></Button>
                                <Button type="button" onClick={() => setShowCategoryInput(false)} variant="ghost" className="h-12 w-12 rounded-2xl text-muted-foreground shrink-0"><X className="h-5 w-5" /></Button>
                              </div>
                            ) : (
                              <div className="flex-1 flex gap-2">
                                <select 
                                  value={data.category} 
                                  onChange={(e) => setForm({...data, category: e.target.value})} 
                                  className="flex-1 bg-secondary/20 h-12 rounded-2xl border-none outline-none font-bold text-sm px-4"
                                >
                                  <option value="">Seleccionar...</option>
                                  {categories.map((cat: string) => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                                <Button type="button" onClick={() => setShowCategoryInput(true)} variant="outline" className="h-12 w-12 rounded-2xl border-border hover:bg-secondary shrink-0"><PlusCircle className="h-5 w-5 text-primary" /></Button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">Etiqueta <span className="text-[9px] lowercase font-medium opacity-50">(opcional)</span></label>
                           <select value={data.badge} onChange={(e) => setForm({...data, badge: e.target.value})} className="w-full bg-secondary/20 h-12 rounded-2xl border-none outline-none font-bold text-sm px-4">
                              <option value="">Ninguna</option>
                              <option value="Nuevo!">Nuevo!</option>
                              <option value="Oferta!">Oferta!</option>
                           </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">Descripción</label>
                        <textarea 
                          value={data.description} 
                          onChange={(e) => setForm({...data, description: e.target.value})} 
                          className="w-full min-h-25 bg-secondary/20 rounded-2xl border-none p-4 font-bold text-sm outline-none resize-none" 
                        />
                      </div>
                    </div>
                 </div>
               ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="p-5 rounded-3xl bg-secondary/10 border border-border/40">
                       <p className="text-[10px] text-muted-foreground font-black uppercase mb-1">Precio</p>
                       <p className="text-sm font-black text-foreground">${Number(data.price || 0).toFixed(2)}</p>
                     </div>
                     <div className="p-5 rounded-3xl bg-secondary/10 border border-border/40">
                       <p className="text-[10px] text-muted-foreground font-black uppercase mb-1">Stock</p>
                       <p className="text-sm font-black text-foreground">{data.stock} unidades</p>
                     </div>
                     <div className="p-6 rounded-3xl bg-secondary/10 border border-border/40 sm:col-span-2">
                       <p className="text-[10px] text-muted-foreground font-black uppercase mb-1">Descripción</p>
                       <p className="text-sm font-medium leading-relaxed italic text-foreground/80">{data.description}</p>
                     </div>
                  </div>
               )}
            </section>

            {/* Technical Details (Optional Parameters) */}
            <section className="space-y-8">
               <h3 className="text-[11px] font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                 <Sparkles className="h-4 w-4 text-primary" /> Detalles Técnicos <span className="text-[9px] lowercase font-medium opacity-50">(todos opcionales)</span>
               </h3>
               
               <div className="space-y-8">
                 {/* Content, Origin, Ingredients */}
                 <div className={cn("grid grid-cols-1 gap-5", isEditing ? "p-5 sm:p-7 rounded-3xl sm:rounded-4xl bg-muted/20 border border-border" : "")}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">Contenido <span className="opacity-40">(opcional)</span></label>
                        {isEditing ? <Input placeholder="Ej: 30ml" value={data.content} onChange={(e) => setForm({...data, content: e.target.value})} className="h-11 bg-card rounded-xl border-border font-bold text-xs" /> : <p className="text-sm font-bold text-foreground/80">{data.content || "N/A"}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">Origen <span className="opacity-40">(opcional)</span></label>
                        {isEditing ? <Input placeholder="Ej: Colombia" value={data.origin} onChange={(e) => setForm({...data, origin: e.target.value})} className="h-11 bg-card rounded-xl border-border font-bold text-xs" /> : <p className="text-sm font-bold text-foreground/80">{data.origin || "N/A"}</p>}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">Ingredientes <span className="opacity-40">(opcional)</span></label>
                      {isEditing ? <textarea placeholder="Lista de ingredientes..." value={data.ingredients} onChange={(e) => setForm({...data, ingredients: e.target.value})} className="w-full min-h-20 bg-card rounded-xl border-border p-3 text-xs font-bold outline-none resize-none" /> : <p className="text-sm font-bold text-foreground/80 leading-relaxed">{data.ingredients || "No especificado."}</p>}
                    </div>
                 </div>

                 {/* Benefits (List) */}
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-muted-foreground uppercase ml-1 flex items-center justify-between">
                      Beneficios Clave <span className="text-[9px] lowercase font-medium opacity-50 ml-2">(opcional)</span>
                      {isEditing && <Button variant="ghost" size="sm" onClick={addBenefit} className="h-7 px-2 text-[9px] font-black uppercase text-primary border border-primary/20"><Plus className="h-3 w-3 mr-1" /> Añadir</Button>}
                    </label>
                    <div className="space-y-3">
                       {data.benefits?.map((b: string, idx: number) => (
                         <div key={idx} className="flex items-center gap-3 animate-in slide-in-from-left-2 duration-200">
                           <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0"><CheckCircle2 className="h-3 w-3" /></div>
                           {isEditing ? (
                              <div className="flex-1 flex gap-2">
                                <Input value={b} onChange={(e) => updateBenefit(e.target.value, idx)} className="h-10 bg-secondary/10 border-none font-bold text-xs" />
                                <Button variant="ghost" size="icon" onClick={() => removeBenefit(idx)} className="h-10 w-10 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                              </div>
                           ) : (
                             <p className="text-xs font-bold text-foreground/80">{b}</p>
                           )}
                         </div>
                       ))}
                       {!isEditing && (!data.benefits || data.benefits.length === 0) && <p className="text-xs text-muted-foreground italic ml-9">Sin beneficios listados.</p>}
                    </div>
                 </div>

                 {/* Usage */}
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">Modo de Uso <span className="text-[9px] lowercase font-medium opacity-50 ml-2">(opcional)</span></label>
                    {isEditing ? <textarea placeholder="Instrucciones de uso..." value={data.usage} onChange={(e) => setForm({...data, usage: e.target.value})} className="w-full min-h-20 bg-muted/20 rounded-xl border-border p-3 text-xs font-bold outline-none resize-none" /> : <div className="p-5 rounded-3xl bg-primary/5 border border-primary/10 italic text-xs font-bold text-primary/80 leading-relaxed"><Beaker className="h-4 w-4 mb-2 opacity-50" />{data.usage || "No especificado."}</div>}
                 </div>
               </div>
            </section>
          </div>

          {!isEditing && (
             <div className="p-5 sm:p-8 border-t border-border bg-card/80 backdrop-blur-md shrink-0">
               <Button variant="outline" className="w-full h-12 rounded-2xl border-destructive/20 text-destructive hover:bg-destructive/10 font-black text-[10px] uppercase tracking-widest cursor-pointer shadow-sm">
                 <Trash2 className="h-4 w-4 mr-2" /> Eliminar Producto
               </Button>
             </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
