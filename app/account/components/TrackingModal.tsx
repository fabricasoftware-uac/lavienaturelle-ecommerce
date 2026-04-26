"use client"

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog"
import { Package, Truck, MessageCircle, AlertCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getWhatsAppTrackingLink } from "@/lib/whatsapp"
import { cn } from "@/lib/utils"

interface TrackingModalProps {
  order: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TrackingModal({ order, open, onOpenChange }: TrackingModalProps) {
  if (!order) return null

  const whatsappLink = getWhatsAppTrackingLink(
    "Salomon V.",
    order.trackingId,
    order.carrier
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-none p-0 overflow-hidden shadow-2xl">
        <div className="bg-stone-900 px-8 py-10 text-white relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/5 rounded-full blur-3xl" />
          
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 mb-2">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-serif font-bold tracking-tight">Rastrear Envío</DialogTitle>
              <DialogDescription className="text-stone-400 text-sm font-medium mt-1">
                Información de seguimiento para el pedido <span className="text-white font-bold">{order.id}</span>
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6 bg-white">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Estado Actual</p>
              <Badge variant="outline" className={cn(
                "text-[10px] font-bold uppercase tracking-widest border-none px-3 py-1 rounded-full",
                order.statusColor === "green" ? "bg-green-50 text-green-600" :
                order.statusColor === "blue" ? "bg-blue-50 text-blue-600" :
                "bg-amber-50 text-amber-600"
              )}>
                {order.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-3xl bg-stone-50 border border-stone-100 space-y-1">
                <div className="flex items-center gap-2 text-stone-400 mb-1">
                  <Truck className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Transportadora</span>
                </div>
                <p className="text-xs font-bold text-stone-900">{order.carrier || "Pendiente"}</p>
              </div>
              <div className="p-4 rounded-3xl bg-stone-50 border border-stone-100 space-y-1">
                <div className="flex items-center gap-2 text-stone-400 mb-1">
                  <Package className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Número de Guía</span>
                </div>
                <p className="text-xs font-bold text-stone-900 tracking-tight">{order.trackingId}</p>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-primary/5 border border-primary/10 flex items-start gap-3">
               <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
               <p className="text-[10px] leading-relaxed text-stone-600 font-medium">
                  Para más detalles, usa el número de guía directamente en el portal de <strong>{order.carrier}</strong>.
               </p>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}
