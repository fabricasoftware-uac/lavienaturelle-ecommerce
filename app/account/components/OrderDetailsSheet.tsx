"use client"

import { MapPin, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

interface OrderDetailsSheetProps {
  order: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDetailsSheet({ order, open, onOpenChange }: OrderDetailsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md border-none bg-[#FDFCFB]">
        <SheetHeader className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="outline" className={cn(
              "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-lg border-none",
              order?.statusColor === "green" ? "bg-green-50 text-green-600" :
              order?.statusColor === "blue" ? "bg-blue-50 text-blue-600" :
              "bg-amber-50 text-amber-600"
            )}>
              {order?.status}
            </Badge>
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
              {(order?.items_list || [
                { name: "Aceite Esencial de Lavanda", price: 28.50, quantity: 1 },
                { name: "Jabón de Romero", price: 12.00, quantity: 2 },
              ]).map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="h-12 w-12 rounded-xl bg-stone-100 border border-stone-200 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-stone-800 leading-tight">{item.name}</p>
                      <p className="text-xs text-stone-400 mt-0.5">Cantidad: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-stone-900">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-stone-50 rounded-3xl p-5 space-y-4">
            <div>
               <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <MapPin className="h-3 w-3" /> Dirección de Envío
               </h4>
               <p className="text-sm font-medium text-stone-800 leading-relaxed">
                 {order?.address || "Calle de las Flores #123, Col. Roma Norte, CDMX"}
               </p>
            </div>
            <div className="pt-4 border-t border-stone-100">
               <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <CreditCard className="h-3 w-3" /> Método de Pago
               </h4>
               <p className="text-sm font-medium text-stone-800">
                 Tarjeta de Crédito (**** {order?.paymentMethod || "4421"})
               </p>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2 border-t border-stone-100 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Subtotal</span>
              <span className="font-medium text-stone-900">${(order?.total - 10).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Envío</span>
              <span className="font-medium text-green-600">Gratis</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Impuestos</span>
              <span className="font-medium text-stone-900">$10.00</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-primary/10 mt-4">
              <span className="text-lg font-bold text-stone-900">Total</span>
              <span className="text-2xl font-bold text-primary tracking-tight">${order?.total?.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
             <Button variant="outline" className="rounded-2xl border-stone-200 font-bold h-12">Descargar PDF</Button>
             <Button className="rounded-2xl bg-stone-900 text-white font-bold h-12 shadow-lg shadow-stone-200">Rastrear</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
