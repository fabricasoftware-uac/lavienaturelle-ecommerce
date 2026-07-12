"use client"

import { MapPin, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn, formatPrice } from "@/lib/utils"
import { StatusBadge } from "@/components/status-badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

import { MappedOrder } from "@/supabase/types/database"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { OrderInvoice } from "./OrderInvoice"

interface OrderDetailsSheetProps {
  order: MappedOrder | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onTrack?: (order: MappedOrder) => void
}

export function OrderDetailsSheet({ order, open, onOpenChange, onTrack }: OrderDetailsSheetProps) {
  if (!order) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md border-none bg-background">
        <SheetHeader className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <StatusBadge status={order.statusRaw} />
            <span className="text-xs font-medium text-stone-400">#{order?.id}</span>
          </div>
          <SheetTitle className="text-2xl font-serif font-bold text-stone-900">Detalles del Pedido</SheetTitle>
          <SheetDescription className="text-stone-500">
            Realizado el {order?.date}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8 overflow-y-auto p-6 max-h-[calc(100vh-180px)]">
          {/* Items List */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">Artículos</h4>
            <div className="space-y-4">
              {(order?.order_items || []).map((item: any, i: number) => {
                const imageUrl = item.products?.product_multimedia?.[0]?.url || "/logo-script.png";
                return (
                  <div key={i} className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="h-12 w-12 rounded-xl bg-stone-50 border border-stone-100 overflow-hidden shrink-0">
                        <img src={imageUrl} alt={item.product_name_snapshot} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-stone-800 leading-tight">{item.product_name_snapshot}</p>
                        <p className="text-xs text-stone-400 mt-0.5">Cantidad: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-stone-900">{formatPrice(Number(item.unit_price) * item.quantity)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-stone-50 rounded-3xl p-5 space-y-4">
            <div>
               <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <MapPin className="h-3 w-3" /> Dirección de Envío
               </h4>
               <p className="text-sm font-medium text-stone-800 leading-relaxed">
                 {order?.address || "Dirección no disponible"}
               </p>
            </div>
            <div className="pt-4 border-t border-stone-100">
               <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <CreditCard className="h-3 w-3" /> Método de Pago
               </h4>
               <p className="text-sm font-medium text-stone-800">
                 {order?.paymentMethod || "Tarjeta de Crédito"}
               </p>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2 border-t border-stone-100 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Subtotal</span>
              <span className="font-medium text-stone-900">{formatPrice(order?.total)}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-primary/10 mt-4">
              <span className="text-lg font-bold text-stone-900">Total</span>
              <span className="text-2xl font-bold text-primary tracking-tight">{formatPrice(order?.total)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
             <PDFDownloadLink 
               document={<OrderInvoice order={order} />} 
               fileName={`Pedido_${order.id}.pdf`}
               className="flex-1"
             >
               {({ loading }) => (
                 <Button 
                   variant="outline" 
                   className="rounded-2xl border-stone-200 font-bold h-12 w-full"
                   disabled={loading}
                 >
                   {loading ? "Generando..." : "Descargar PDF"}
                 </Button>
               )}
             </PDFDownloadLink>
             <Button 
               className="rounded-2xl bg-stone-900 text-white font-bold h-12 shadow-lg shadow-stone-200"
               onClick={() => onTrack?.(order)}
             >
               Rastrear
             </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
