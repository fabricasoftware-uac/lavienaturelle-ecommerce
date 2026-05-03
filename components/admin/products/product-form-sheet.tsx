"use client"

import { useState } from "react"
import {
  X,
  Plus,
  Save,
  Image as ImageIcon,
  Info,
  Sparkles,
  CheckCircle2,
  PlusCircle,
  Beaker,
  Trash2,
  Loader2,
  Upload,
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
} from "@/components/ui/sheet"
import { cn, formatPrice } from "@/lib/utils"
import { uploadImage, deleteImage } from "@/lib/supabase/storage"
import { AppProduct, Category } from "@/types/database"

interface ProductFormSheetProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  data: Partial<AppProduct>
  setForm: (data: Partial<AppProduct>) => void
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  onSave: (e?: any) => void
  title: string
  categories: Category[]
  onAddCategory: (name: string) => void
  onDelete: (id: string) => void
  saving: boolean
}

export function ProductFormSheet({
  isOpen,
  setIsOpen,
  data,
  setForm,
  isEditing,
  setIsEditing,
  onSave,
  title,
  categories,
  onAddCategory,
  onDelete,
  saving,
}: ProductFormSheetProps) {
  const isCreation = title === "Nuevo Producto"
  const [newCategoryName, setNewCategoryName] = useState("")
  const [showCategoryInput, setShowCategoryInput] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [uploading, setUploading] = useState(false)

  const MAX_IMAGES = 2
  const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

  const addBenefit = () => setForm({ ...data, benefits: [...(data.benefits || []), ""] })
  const updateBenefit = (val: string, idx: number) => {
    const next = [...(data.benefits || [])]
    next[idx] = val
    setForm({ ...data, benefits: next })
  }
  const removeBenefit = (idx: number) => setForm({ ...data, benefits: (data.benefits || []).filter((_, i) => i !== idx) })

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim())
      setNewCategoryName("")
      setShowCategoryInput(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const currentImages = data.images || []
    if (currentImages.length >= MAX_IMAGES) {
      alert(`Máximo ${MAX_IMAGES} imágenes permitidas.`)
      return
    }

    const file = files[0]
    if (file.size > MAX_FILE_SIZE) {
      alert("La imagen es muy pesada. Máximo 2MB.")
      return
    }

    setUploading(true)
    try {
      const folder = data.id || "temp"
      const publicUrl = await uploadImage(file, folder)
      setForm({ ...data, images: [...currentImages, publicUrl] })
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Error al cargar la imagen.")
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = async (idx: number) => {
    const currentImages = [...(data.images || [])]
    const removedUrl = currentImages[idx]
    
    // We don't necessarily want to delete from storage immediately if it's an existing product
    // but for simplicity and following the user request, we'll just update the form state
    // If it's a newly uploaded image (temp folder or recently added), we might want to delete it.
    // For now, let's just remove it from the array.
    currentImages.splice(idx, 1)
    setForm({ ...data, images: currentImages })
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
                    Editar
                  </Button>
                ) : (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="flex-1 sm:flex-initial rounded-xl h-9 px-4 text-[11px] font-bold text-muted-foreground">Cancelar</Button>
                    <Button onClick={onSave} disabled={saving} className="flex-1 sm:flex-initial bg-primary text-white rounded-xl h-9 px-6 text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-primary/10 transition-all hover:bg-primary/90">
                      {saving ? <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" /> : <Save className="h-3.5 w-3.5 mr-2" />} {isCreation ? "Crear" : "Guardar"}
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
            {/* Image Section */}
            <section className="space-y-4">
              <h3 className="text-[11px] font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" /> Imágenes del Producto <span className="text-[9px] lowercase font-medium opacity-50">({data.images?.length || 0}/{MAX_IMAGES})</span>
              </h3>
              <p className="text-[9px] text-muted-foreground ml-6 -mt-3 italic">
                Carga hasta 2 imágenes. Máximo 2MB por archivo. Formatos sugeridos: JPG, PNG, WEBP.
              </p>
              
              {isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.images?.map((img: string, idx: number) => (
                    <div key={idx} className="h-40 rounded-2xl bg-muted overflow-hidden border border-border group relative">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        onClick={() => handleRemoveImage(idx)} 
                        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {(!data.images || data.images.length < MAX_IMAGES) && (
                    <label className={cn(
                      "h-40 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary/50 transition-all cursor-pointer",
                      uploading && "opacity-50 pointer-events-none"
                    )}>
                      {uploading ? (
                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-muted-foreground/50" />
                          <p className="text-[10px] font-bold uppercase tracking-tighter">Subir Imagen</p>
                        </>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.images && data.images.length > 0 ? (
                    data.images.map((img: string, idx: number) => (
                      <div key={idx} className="h-48 sm:h-64 w-full rounded-2xl overflow-hidden border border-border shadow-inner">
                        <img src={img} alt={`${data.name} ${idx + 1}`} className="h-full w-full object-cover" />
                      </div>
                    ))
                  ) : (
                    <div className="h-48 sm:h-64 w-full rounded-2xl overflow-hidden border border-border shadow-inner">
                      <img src={data.image || "https://via.placeholder.com/300?text=No+Image"} alt={data.name} className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Info Section */}
            <section className="space-y-6">
              <h3 className="text-[11px] font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" /> Información General
              </h3>
              {isEditing ? (
                <div className="grid grid-cols-1 gap-5 p-5 sm:p-7 rounded-3xl sm:rounded-4xl bg-white border border-border shadow-inner">
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">Nombre Comercial</label>
                      <Input placeholder="Ej: Jabón de Romero" value={data.name} onChange={(e) => setForm({...data, name: e.target.value})} className="h-12 bg-secondary/20 rounded-2xl border-none font-bold text-sm" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">Precio ($)</label>
                        <Input 
                          type="text" 
                          placeholder="0"
                          value={data.price ? Number(data.price).toLocaleString('es-CO') : ''} 
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/\D/g, '')
                            setForm({...data, price: Number(rawValue)})
                          }} 
                          className="h-12 bg-secondary/20 rounded-2xl border-none font-bold text-sm" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">Stock</label>
                        <Input type="number" value={data.stock} onChange={(e) => setForm({...data, stock: Number(e.target.value)})} className="h-12 bg-secondary/20 rounded-2xl border-none font-bold text-sm" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">Categoría</label>
                      <div className="flex gap-2">
                        {showCategoryInput ? (
                          <div className="flex-1 flex gap-2">
                            <Input placeholder="Nueva categoría" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="h-12 bg-secondary/20 rounded-2xl border-none font-bold text-sm" />
                            <Button type="button" onClick={handleCreateCategory} className="h-12 w-12 rounded-2xl bg-primary text-white shrink-0"><CheckCircle2 className="h-5 w-5" /></Button>
                            <Button type="button" onClick={() => setShowCategoryInput(false)} variant="ghost" className="h-12 w-12 rounded-2xl text-muted-foreground shrink-0"><X className="h-5 w-5" /></Button>
                          </div>
                        ) : (
                          <div className="flex-1 flex gap-2">
                            <select value={data.category} onChange={(e) => setForm({...data, category: e.target.value})} className="flex-1 bg-secondary/20 h-12 rounded-2xl border-none outline-none font-bold text-sm px-4">
                              <option value="">Seleccionar...</option>
                              {categories.map((cat) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                            </select>
                            <Button type="button" onClick={() => setShowCategoryInput(true)} variant="outline" className="h-12 w-12 rounded-2xl border-border hover:bg-secondary shrink-0"><PlusCircle className="h-5 w-5 text-primary" /></Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">Etiqueta</label>
                      <select value={data.badge} onChange={(e) => setForm({...data, badge: e.target.value})} className="w-full bg-secondary/20 h-12 rounded-2xl border-none outline-none font-bold text-sm px-4">
                        <option value="">Ninguna</option>
                        <option value="Nuevo!">Nuevo!</option>
                        <option value="Oferta!">Oferta!</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">Descripción</label>
                      <textarea value={data.description} onChange={(e) => setForm({...data, description: e.target.value})} className="w-full min-h-25 bg-secondary/20 rounded-2xl border-none p-4 font-bold text-sm outline-1 resize-none" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-3xl bg-secondary/10 border border-border/40">
                    <p className="text-[10px] text-muted-foreground font-black uppercase mb-1">Precio</p>
                    <p className="text-sm font-black text-foreground">{formatPrice(data.price || 0)}</p>
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

            {/* Technical Section */}
            <section className="space-y-8">
              <h3 className="text-[11px] font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Detalles Técnicos
              </h3>
              <div className="space-y-8">
                <div className={cn("grid grid-cols-1 gap-5", isEditing ? "p-5 sm:p-7 rounded-3xl bg-muted/20 border border-border" : "")}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">Contenido</label>
                      {isEditing ? <Input placeholder="Ej: 30ml" value={data.content} onChange={(e) => setForm({...data, content: e.target.value})} className="h-11 bg-card rounded-xl border-border font-bold text-xs" /> : <p className="text-sm font-bold text-foreground/80">{data.content || "N/A"}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">Origen</label>
                      {isEditing ? <Input placeholder="Ej: Colombia" value={data.origin} onChange={(e) => setForm({...data, origin: e.target.value})} className="h-11 bg-card rounded-xl border-border font-bold text-xs" /> : <p className="text-sm font-bold text-foreground/80">{data.origin || "N/A"}</p>}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">Ingredientes</label>
                    {isEditing ? <textarea placeholder="Ingredientes..." value={data.ingredients} onChange={(e) => setForm({...data, ingredients: e.target.value})} className="w-full min-h-20 bg-card rounded-xl border-border p-3 text-xs font-bold outline-none resize-none" /> : <p className="text-sm font-bold text-foreground/80 leading-relaxed">{data.ingredients || "No especificado."}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-muted-foreground uppercase ml-1 flex items-center justify-between">
                    Beneficios Clave
                    {isEditing && <Button variant="ghost" size="sm" onClick={addBenefit} className="h-7 px-2 text-[9px] font-black text-primary border border-primary/20"><Plus className="h-3 w-3 mr-1" /> Añadir</Button>}
                  </label>
                  <div className="space-y-3">
                    {data.benefits?.map((b: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-3">
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
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">Modo de Uso</label>
                  {isEditing ? <textarea placeholder="Instrucciones..." value={data.usage} onChange={(e) => setForm({...data, usage: e.target.value})} className="w-full min-h-20 bg-muted/20 rounded-xl border-border p-3 text-xs font-bold outline-1 resize-none" /> : <div className="p-5 rounded-3xl bg-primary/5 border border-primary/10 italic text-xs font-bold text-primary/80"><Beaker className="h-4 w-4 mb-2 opacity-50" />{data.usage || "No especificado."}</div>}
                </div>
              </div>
            </section>
          </div>

          {!isEditing && (
            <div className="p-5 sm:p-8 border-t border-border bg-card/80 backdrop-blur-md shrink-0">
              {showConfirmDelete ? (
                <div className="flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
                  <p className="text-[10px] font-bold text-center text-destructive uppercase tracking-widest">¿Estás seguro de eliminar este producto?</p>
                  <div className="flex gap-2">
                    <Button 
                      variant="destructive" 
                      className="flex-1 h-11 rounded-xl font-black text-[10px] uppercase tracking-widest"
                      onClick={() => data.id && onDelete(data.id)}
                      disabled={saving}
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sí, Eliminar"}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 h-11 rounded-xl font-black text-[10px] uppercase tracking-widest"
                      onClick={() => setShowConfirmDelete(false)}
                      disabled={saving}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full h-12 rounded-2xl border-destructive/20 text-destructive hover:bg-destructive/10 font-black text-[10px] uppercase tracking-widest shadow-sm"
                  onClick={() => setShowConfirmDelete(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Eliminar Producto
                </Button>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
