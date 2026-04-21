"use client"

import { ShoppingBag, Truck, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface OrderCardProps {
  order: any
  onViewDetails: () => void
}

export function OrderCard({ order, onViewDetails }: OrderCardProps) {
  return (
    <div className="bg-white border border-stone-100 rounded-4xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 group">
       <div className="flex flex-col sm:flex-row gap-6">
          <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-3xl overflow-hidden shrink-0 border border-stone-50 bg-stone-50">
             <img src={order.mainImage} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" alt={order.productName} />
          </div>
          
          <div className="flex-1 flex flex-col justify-between py-1">
             <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                   <div className="flex items-center gap-3 mb-1.5">
                      <h3 className="text-sm font-bold text-stone-900 line-clamp-1">{order.productName}</h3>
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-bold uppercase tracking-widest border-none px-2.5 py-0.5 rounded-lg",
                        order.statusColor === "green" ? "bg-green-50 text-green-600" :
                        order.statusColor === "blue" ? "bg-blue-50 text-blue-600" :
                        "bg-amber-50 text-amber-600"
                      )}>
                        {order.status}
                      </Badge>
                   </div>
                   <div className="flex flex-wrap items-center gap-y-1 gap-x-4">
                      <p className="text-xs font-medium text-stone-400 flex items-center gap-1.5">
                        <ShoppingBag className="h-3 w-3" />
                        ID: <span className="text-stone-600 font-bold">{order.id}</span>
                      </p>
                      <p className="text-xs font-medium text-stone-400 flex items-center gap-1.5">
                        <Truck className="h-3 w-3" />
                        Guía: <span className="text-stone-600 font-bold">{order.trackingId}</span>
                      </p>
                      <p className="text-xs font-medium text-stone-400 flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        {order.date}
                      </p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-xs font-medium text-stone-400 mb-0.5">{order.items} Artículo{order.items > 1 ? 's' : ''}</p>
                   <p className="text-xl font-bold text-stone-900 tracking-tight">${order.total.toFixed(2)}</p>
                </div>
             </div>
             
             <div className="flex items-center justify-between gap-4 pt-4 border-t border-stone-50">
                 <div className="flex items-center gap-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-10 text-xs font-bold text-stone-500 hover:text-primary hover:bg-primary/5 rounded-2xl px-4 transition-all"
                      onClick={onViewDetails}
                    >
                       Detalles del pedido
                    </Button>  
                 </div>
                <Button size="sm" className="h-10 rounded-2xl px-6 bg-stone-900 text-white font-bold text-xs transition-all hover:bg-stone-800 shadow-lg shadow-stone-200">
                   Rastrear Envío
                </Button>
             </div>
          </div>
       </div>
    </div>
  )
}
