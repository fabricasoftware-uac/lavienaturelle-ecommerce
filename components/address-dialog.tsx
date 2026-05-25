"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { createAddress, updateAddress } from "@/lib/supabase/addresses"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { Address } from "@/lib/supabase/types/database"

interface AddressDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  address?: Address
  onSuccess?: () => void
}

export function AddressDialog({ open, onOpenChange, address, onSuccess }: AddressDialogProps) {
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState("")
  const [userPhone, setUserPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    label: "",
    full_name: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "Colombia",
    phone: "",
    is_default: false
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUserId(data.user.id)
        setUserName(data.user.user_metadata?.full_name || data.user.user_metadata?.name || "")
        setUserPhone(data.user.user_metadata?.phone || "")
      }
    })
  }, [supabase])

  useEffect(() => {
    if (address) {
      setFormData({
        label: address.label || "",
        full_name: address.full_name || "",
        address_line1: address.address_line1 || "",
        address_line2: address.address_line2 || "",
        city: address.city || "",
        state: address.state || "",
        country: address.country || "Colombia",
        phone: address.phone || "",
        is_default: address.is_default || false
      })
    } else {
      setFormData({
        label: "",
        full_name: userName,
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        country: "Colombia",
        phone: userPhone,
        is_default: false
      })
    }
  }, [address, userName, userPhone, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    setLoading(true)
    try {
      const result = address 
        ? await updateAddress(address.id, { ...formData, user_id: userId })
        : await createAddress({ ...formData, user_id: userId })

      if (result.success) {
        toast.success(address ? "Dirección actualizada" : "Dirección guardada")
        onSuccess?.()
        onOpenChange(false)
      } else {
        toast.error("Error: " + result.error)
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-[40px] border-none shadow-2xl p-0 overflow-hidden bg-background">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="p-8 pb-4">
            <DialogTitle className="text-2xl font-serif font-bold text-stone-900">
              {address ? "Editar Dirección" : "Nueva Dirección"}
            </DialogTitle>
            <DialogDescription className="text-stone-500 text-xs font-medium">
              Ingresa los detalles para el envío de tus productos.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-8 pt-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="label" className="text-[10px] font-bold text-stone-400 uppercase tracking-widest pl-1">Alias o apodo</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({...formData, label: e.target.value})}
                  placeholder="Ej. Casa, Oficina"
                  className="rounded-2xl border-stone-100 h-12 focus-visible:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-[10px] font-bold text-stone-400 uppercase tracking-widest pl-1">Nombre Completo</Label>
                <Input 
                  id="full_name" 
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  placeholder="Quién recibe" 
                  className="rounded-2xl border-stone-100 h-12 focus-visible:ring-primary/20" 
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address_line1" className="text-[10px] font-bold text-stone-400 uppercase tracking-widest pl-1">Dirección</Label>
              <Input
                id="address_line1"
                value={formData.address_line1}
                onChange={(e) => setFormData({...formData, address_line1: e.target.value})}
                placeholder="Calle, número, apto..."
                className="rounded-2xl border-stone-100 h-12 focus-visible:ring-primary/20"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address_line2" className="text-[10px] font-bold text-stone-400 uppercase tracking-widest pl-1">Descripción (opcional)</Label>
              <Input
                id="address_line2"
                value={formData.address_line2}
                onChange={(e) => setFormData({...formData, address_line2: e.target.value})}
                placeholder="Apartamento, casa, bloque, etc."
                className="rounded-2xl border-stone-100 h-12 focus-visible:ring-primary/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-[10px] font-bold text-stone-400 uppercase tracking-widest pl-1">Ciudad</Label>
                <Input 
                  id="city" 
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  placeholder="Ciudad" 
                  className="rounded-2xl border-stone-100 h-12 focus-visible:ring-primary/20" 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-[10px] font-bold text-stone-400 uppercase tracking-widest pl-1">Departamento</Label>
                <Input 
                  id="state" 
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  placeholder="Departamento" 
                  className="rounded-2xl border-stone-100 h-12 focus-visible:ring-primary/20" 
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[10px] font-bold text-stone-400 uppercase tracking-widest pl-1">Teléfono</Label>
              <Input 
                id="phone" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+57..." 
                className="rounded-2xl border-stone-100 h-12 focus-visible:ring-primary/20" 
                required
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input 
                type="checkbox" 
                id="is_default" 
                checked={formData.is_default}
                onChange={(e) => setFormData({...formData, is_default: e.target.checked})}
                className="w-5 h-5 rounded-lg border-stone-200 text-primary focus:ring-primary/20"
              />
              <Label htmlFor="is_default" className="text-xs font-bold text-stone-600 cursor-pointer">Definir como predeterminada</Label>
            </div>
          </div>

          <DialogFooter className="p-8 pt-4 bg-stone-50">
            <Button 
              type="button"
              variant="ghost" 
              className="rounded-2xl font-bold text-stone-500 hover:text-stone-900" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-stone-900 text-white font-bold px-8 h-12 shadow-lg shadow-stone-200"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar Dirección"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
