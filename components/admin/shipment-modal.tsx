"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Truck, MessageCircle, Send, Package, AlertCircle } from "lucide-react"
import { getWhatsAppTrackingLink } from "@/lib/whatsapp"

interface ShipmentModalProps {
  order: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (carrier: string, trackingId: string) => void
}

export function ShipmentModal({ order, open, onOpenChange, onConfirm }: ShipmentModalProps) {
  const [carrier, setCarrier] = useState("")
  const [trackingId, setTrackingId] = useState("")

  if (!order) return null

  const handleConfirm = () => {
    if (!carrier || !trackingId) return
    onConfirm(carrier, trackingId)
    onOpenChange(false)
    setCarrier("")
    setTrackingId("")
  }

  const whatsappLink = getWhatsAppTrackingLink(
    order.customer.name,
    trackingId || "[GUIA]",
    carrier || "[TRANSPORTADORA]",
    order.customer.phone.replace(/\D/g, '') // Clean phone number
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl rounded-[2rem]">
        {/* Header Section */}
        <div className="bg-stone-900 px-8 py-10 text-white relative">
           <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/5 rounded-full blur-3xl" />
           <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-serif font-bold tracking-tight">Gestionar Envío</DialogTitle>
                <DialogDescription className="text-stone-400 text-xs font-medium mt-1">
                  Pedido: <span className="text-white font-bold">{order.id}</span> — {order.customer.name}
                </DialogDescription>
              </div>
           </div>
        </div>

        {/* Body Section */}
        <div className="p-8 space-y-8 bg-white">
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="carrier" className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">
                Transportadora
              </Label>
              <div className="relative group">
                <Truck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 group-focus-within:text-primary transition-colors" />
                <Input
                  id="carrier"
                  placeholder="Ej: Servientrega, DHL, Interrapidisimo"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="h-12 pl-10 rounded-xl bg-stone-50 border-transparent focus:border-primary/20 focus:bg-white transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tracking" className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">
                Número de Guía
              </Label>
              <div className="relative group">
                <Package className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 group-focus-within:text-primary transition-colors" />
                <Input
                  id="tracking"
                  placeholder="Ej: LX-99283100"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="h-12 pl-10 rounded-xl bg-stone-50 border-transparent focus:border-primary/20 focus:bg-white transition-all text-sm font-medium"
                />
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-100 flex items-start gap-3">
             <AlertCircle className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
             <p className="text-[11px] leading-relaxed text-stone-600 font-medium">
                Completa los datos para habilitar las opciones de despacho y notificación.
             </p>
          </div>
        </div>

        <DialogFooter className="p-8 pt-0 bg-white">
          <div className="flex flex-col w-full gap-3">
             <div className="flex gap-3">
                <a 
                  href={whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button 
                    variant="outline" 
                    disabled={!carrier || !trackingId}
                    className="w-full h-12 rounded-xl border-green-100 bg-green-50/30 text-green-700 hover:bg-green-50 text-xs font-bold gap-2 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Notificar WhatsApp
                  </Button>
                </a>
                <Button 
                  className="flex-1 h-12 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs gap-2 shadow-lg shadow-stone-200 transition-all"
                  onClick={handleConfirm}
                  disabled={!carrier || !trackingId}
                >
                  <Send className="w-4 h-4" />
                  Confirmar Envío
                </Button>
             </div>
             <Button 
               variant="ghost" 
               className="w-full h-10 rounded-xl text-stone-400 hover:text-stone-900 font-bold text-[10px] uppercase tracking-widest"
               onClick={() => onOpenChange(false)}
             >
                Cancelar
             </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
