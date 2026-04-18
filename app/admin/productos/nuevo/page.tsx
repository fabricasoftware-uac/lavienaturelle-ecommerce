"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Trash2,
  Package,
  DollarSign,
  Tag,
  Info,
  MapPin,
  FlaskConical,
  Zap,
  BookOpen,
  PlusCircle,
  ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { categories as initialCategories, type CategoryConfig } from "@/lib/products"
import { cn } from "@/lib/utils"

export default function NewProductPage() {
  const router = useRouter()

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    content: "",
    origin: "",
    category: "",
    ingredients: "",
    usage: "",
    badge: "",
  })

  const [benefits, setBenefits] = useState<string[]>([])
  const [newBenefit, setNewBenefit] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  
  // Categories State
  const [categories, setCategories] = useState<CategoryConfig[]>(initialCategories)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategory, setNewCategory] = useState({ id: "", name: "", namePlural: "" })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddBenefit = () => {
    if (newBenefit.trim()) {
      setBenefits([...benefits, newBenefit.trim()])
      setNewBenefit("")
    }
  }

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index))
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter((f) => f.type.startsWith("image/"))
    const totalCurrent = images.length
    const allowed = 2 - totalCurrent

    if (allowed <= 0) return

    const selected = validFiles.slice(0, allowed)
    setImages([...images, ...selected])

    const nextPreviews = selected.map((f) => URL.createObjectURL(f))
    setPreviews([...previews, ...nextPreviews])
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    const newPreviews = [...previews]
    URL.revokeObjectURL(newPreviews[index])
    newImages.splice(index, 1)
    newPreviews.splice(index, 1)
    setImages(newImages)
    setPreviews(newPreviews)
  }

  const handleCreateCategory = () => {
    if (newCategory.name && newCategory.id) {
      const cat: any = {
        ...newCategory,
        description: `Productos de ${newCategory.name}`,
        icon: Package, // Default icon
        href: `/categoria/${newCategory.id}`
      }
      setCategories([...categories, cat])
      setFormData(prev => ({ ...prev, category: cat.id }))
      setNewCategory({ id: "", name: "", namePlural: "" })
      setShowAddCategory(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, we would send this to an API
    console.log("Saving product:", { ...formData, benefits, images })
    alert("Producto guardado con exito (Simulacion)")
    router.push("/admin")
  }

  return (
    <div className="min-h-screen bg-secondary/30 pb-20">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-border">
        <div className="mx-auto max-w-5xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="font-serif text-xl font-semibold text-foreground">Añadir Nuevo Producto</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="ghost">Cancelar</Button>
            </Link>
            <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90 text-primary-foreground px-6">
              Guardar Producto
            </Button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Section */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-5 w-5 text-primary" />
                <h2 className="font-medium text-foreground">Información General</h2>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nombre del Producto</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="ej. Tónico de Romero y Lavanda"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Precio ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="pl-9"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Stock (unidades)</label>
                  <Input
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="ej. 50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full min-h-30 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Describe las características principales del producto..."
                  required
                />
              </div>
            </div>

            {/* Additional Details Sections */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-primary" />
                <h2 className="font-medium text-foreground">Detalles del Producto (Opcional)</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Zap className="h-4 w-4 text-muted-foreground" /> Contenido
                    </label>
                    <Input name="content" value={formData.content} onChange={handleInputChange} placeholder="ej. 250ml, 50g" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" /> Origen
                    </label>
                    <Input name="origin" value={formData.origin} onChange={handleInputChange} placeholder="ej. Valle del Cauca, Colombia" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <FlaskConical className="h-4 w-4 text-muted-foreground" /> Ingredientes
                    </label>
                    <Input name="ingredients" value={formData.ingredients} onChange={handleInputChange} placeholder="ej. Agua, Romero, Aceite de Coco" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" /> Modo de Uso
                    </label>
                    <Input name="usage" value={formData.usage} onChange={handleInputChange} placeholder="ej. Aplicar sobre el cabello húmedo..." />
                  </div>
                </div>
              </div>

              {/* Benefits List */}
              <div className="space-y-3 pt-2">
                <label className="text-sm font-medium text-foreground">Beneficios</label>
                <div className="flex gap-2">
                  <Input 
                    value={newBenefit} 
                    onChange={(e) => setNewBenefit(e.target.value)} 
                    placeholder="ej. Fortalece la raíz"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBenefit())}
                  />
                  <Button type="button" variant="secondary" onClick={handleAddBenefit}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {benefits.map((benefit, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-xs font-medium text-primary">
                      {benefit}
                      <button type="button" onClick={() => removeBenefit(i)} className="hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Images & Category */}
          <div className="space-y-6">
            {/* Category Section */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Categoría</label>
                <button 
                  type="button" 
                  onClick={() => setShowAddCategory(!showAddCategory)}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <PlusCircle className="h-3 w-3" />
                  Nueva categoría
                </button>
              </div>

              {showAddCategory ? (
                <div className="p-3 bg-secondary/50 rounded-lg space-y-3 animate-in fade-in slide-in-from-top-2">
                  <Input 
                    placeholder="ID (ej. capilares)" 
                    size={1} // use small style if available
                    value={newCategory.id}
                    onChange={(e) => setNewCategory({...newCategory, id: e.target.value})}
                  />
                  <Input 
                    placeholder="Nombre (ej. Cuidado Capilar)" 
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  />
                  <div className="flex gap-2 mt-2">
                    <Button type="button" size="sm" className="flex-1" onClick={handleCreateCategory}>Crear</Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => setShowAddCategory(false)}>X</Button>
                  </div>
                </div>
              ) : (
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  required
                >
                  <option value="">Selecciona...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.namePlural}</option>
                  ))}
                </select>
              )}

              <div className="pt-2">
                <label className="text-sm font-medium text-foreground">Badge del Producto</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Nuevo!", "Oferta!", "Popular", "Organico"].map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setFormData({ ...formData, badge: formData.badge === label ? "" : label })}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                        formData.badge === label
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-muted-foreground border-border hover:border-primary/50"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-4">
              <label className="text-sm font-medium text-foreground">Imágenes del Producto (Máx. 2)</label>
              
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                className={cn(
                  "border-2 border-dashed border-border rounded-xl p-8 text-center transition-all cursor-pointer",
                  images.length < 2 ? "hover:border-primary/50 hover:bg-primary/5" : "opacity-50 cursor-not-allowed"
                )}
                onClick={() => images.length < 2 && document.getElementById('file-upload')?.click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                  disabled={images.length >= 2}
                />
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-foreground font-medium">Click o arrastra imágenes</p>
                  <p className="text-xs text-muted-foreground">Formato JPG, PNG o WebP</p>
                </div>
              </div>

              {/* Previews */}
              <div className="grid grid-cols-2 gap-4">
                {previews.map((preview, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                    <img src={preview} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                      className="absolute top-1 right-1 h-6 w-6 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                {images.length === 0 && (
                  <div className="col-span-2 p-4 rounded-lg bg-secondary/30 border border-dashed border-border flex flex-col items-center justify-center text-center">
                    <ImageIcon className="h-6 w-6 text-muted-foreground/50 mb-2" />
                    <p className="text-xs text-muted-foreground italic">Sin imágenes - se usará una predeterminada</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
