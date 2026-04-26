"use client"

import { useState } from "react"
import { Search, Package, ArrowRight, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export function TrackingWidget() {
  const [orderId, setOrderId] = useState("")
  const [documentNumber, setDocumentNumber] = useState("")
  const router = useRouter()

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (orderId && documentNumber) {
      // Navigate to the guest inquiry page with query parameters
      router.push(`/consulta-pedido?orderId=${orderId}&documentNumber=${documentNumber}`)
    } else if (orderId || documentNumber) {
        // If only one is filled, still navigate but maybe let them finish there
        router.push(`/consulta-pedido?orderId=${orderId}&documentNumber=${documentNumber}`)
    } else {
      router.push("/consulta-pedido")
    }
  }

  return (
    <div className="relative -mt-8 mx-auto max-w-4xl px-4 z-20">
      <div className="bg-white rounded-[2rem] p-4 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-stone-100">
        <form onSubmit={handleQuickSearch} className="flex flex-col md:flex-row items-center gap-4">
          {/* Label/Icon */}
          <div className="flex items-center gap-3 px-4 py-2 border-b md:border-b-0 md:border-r border-stone-100 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Truck className="w-5 h-5 text-primary" />
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Rastreo rápido</p>
              <p className="text-sm font-bold text-stone-900">Consulta tu pedido</p>
            </div>
          </div>

          {/* Input 1 */}
          <div className="flex-1 w-full relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="ID de Pedido (Ej: ORD-7721)" 
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="h-12 pl-11 bg-transparent border-none focus-visible:ring-0 text-sm font-medium placeholder:text-stone-300"
            />
          </div>

          {/* Separator for desktop */}
          <div className="hidden md:block w-px h-6 bg-stone-100" />

          {/* Input 2 */}
          <div className="flex-1 w-full relative group">
            <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Documento de Identidad" 
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              className="h-12 pl-11 bg-transparent border-none focus-visible:ring-0 text-sm font-medium placeholder:text-stone-300"
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit"
            className="w-full md:w-auto h-12 px-8 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-lg shadow-stone-200 group"
          >
            Rastrear
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>
      </div>
      
      {/* Subtle Hint */}
      <div className="mt-3 flex justify-center">
        <p className="text-[10px] text-stone-400 font-medium uppercase tracking-widest">
            ¿No tienes estos datos? <a href="/login" className="text-primary hover:underline ml-1">Inicia sesión</a> para ver tu historial
        </p>
      </div>
    </div>
  )
}
