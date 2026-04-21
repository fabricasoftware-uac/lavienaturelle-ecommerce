"use client"

import { Pencil, Trash2, MapPinned } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface AddressCardProps {
  addr: any
}

export function AddressCard({ addr }: AddressCardProps) {
  return (
    <div key={addr.id} className={cn(
      "group relative bg-white border rounded-4xl p-8 transition-all duration-300",
      addr.isDefault 
        ? "border-primary/20 ring-1 ring-primary/10 shadow-sm" 
        : "border-stone-100 hover:border-primary/10 hover:shadow-md"
    )}>
      {addr.isDefault && (
        <div className="absolute top-8 right-8">
           <Badge className="bg-primary/10 text-primary border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1">Predeterminada</Badge>
        </div>
      )}
      
      <div className="flex flex-col h-full">
         <div className="h-12 w-12 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-400 mb-6 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
            <MapPinned className="h-6 w-6" />
         </div>
         
         <h3 className="text-lg font-bold text-stone-900 mb-1">{addr.label}</h3>
         <p className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">{addr.name}</p>
         
         <div className="space-y-1 mb-8">
            <p className="text-stone-600 font-medium leading-relaxed">{addr.street}</p>
            <p className="text-stone-500 text-sm">{addr.city}, {addr.zip}</p>
            <p className="text-stone-500 text-sm mt-2">{addr.phone}</p>
         </div>
         
         <div className="mt-auto flex items-center gap-3 pt-6 border-t border-stone-50">
            <Button variant="ghost" size="sm" className="h-10 px-4 rounded-xl text-stone-500 hover:text-stone-900 font-bold text-xs">
               <Pencil className="h-3.5 w-3.5 mr-2" /> Editar
            </Button>
            <Button variant="ghost" size="sm" className="h-10 px-4 rounded-xl text-stone-400 hover:text-red-600 font-bold text-xs">
               <Trash2 className="h-3.5 w-3.5 mr-2" /> Eliminar
            </Button>
         </div>
      </div>
    </div>
  )
}
