"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddressDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddressDialog({ open, onOpenChange }: AddressDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 rounded-[40px] border-none shadow-2xl p-0 overflow-hidden bg-[#FDFCFB]">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-2xl font-serif font-bold text-stone-900">Nueva Dirección</DialogTitle>
        </DialogHeader>
        <div className="p-8 pt-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="label" className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1">Etiqueta</Label>
              <Input id="label" placeholder="Ej. Casa, Oficina" className="rounded-2xl border-stone-100 h-12 focus-visible:ring-primary/20" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1">Nombre Completo</Label>
              <Input id="name" placeholder="Quién recibe" className="rounded-2xl border-stone-100 h-12 focus-visible:ring-primary/20" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="street" className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1">Calle y Número</Label>
            <Input id="street" placeholder="Dirección completa" className="rounded-2xl border-stone-100 h-12 focus-visible:ring-primary/20" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1">Ciudad / Estado</Label>
              <Input id="city" placeholder="Ciudad" className="rounded-2xl border-stone-100 h-12 focus-visible:ring-primary/20" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip" className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1">Código Postal</Label>
              <Input id="zip" placeholder="00000" className="rounded-2xl border-stone-100 h-12 focus-visible:ring-primary/20" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1">Teléfono de Contacto</Label>
            <Input id="phone" placeholder="+52 ..." className="rounded-2xl border-stone-100 h-12 focus-visible:ring-primary/20" />
          </div>
        </div>
        <DialogFooter className="p-8 pt-4 bg-stone-50">
          <Button variant="ghost" className="rounded-2xl font-bold text-stone-500 hover:text-stone-900" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button className="rounded-2xl bg-stone-900 text-white font-bold px-8 h-12 shadow-lg shadow-stone-200">Guardar Dirección</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
