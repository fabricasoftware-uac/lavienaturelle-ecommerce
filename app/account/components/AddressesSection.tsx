"use client"

import { Plus, MapPinned, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddressCard } from "./AddressCard"
import { getUserAddresses, deleteAddress } from "@/lib/supabase/addresses"
import { useStore } from "@/lib/cart-context"
import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { AddressDialog } from "@/components/address-dialog"
import { Skeleton } from "@/components/ui/skeleton"

export function AddressesSection() {
  const { user } = useStore()
  const [addresses, setAddresses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAddress, setEditingAddress] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const loadAddresses = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    const data = await getUserAddresses(user.id)
    setAddresses(data)
    setLoading(false)
  }, [user?.id])

  useEffect(() => {
    loadAddresses()
  }, [loadAddresses])

  const handleEdit = (addr: any) => {
    setEditingAddress(addr)
    setIsDialogOpen(true)
  }

  const handleAddNew = () => {
    setEditingAddress(null)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta dirección?")) return
    
    const result = await deleteAddress(id)
    if (result.success) {
      toast.success("Dirección eliminada")
      loadAddresses()
    } else {
      toast.error("Error al eliminar")
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">Mis Direcciones</h2>
            <p className="text-sm font-medium text-stone-500 mt-1">Gestiona tus lugares de entrega frecuentes.</p>
          </div>
          <Button 
            className="rounded-2xl bg-stone-900 text-white font-bold px-6 h-12 shadow-lg shadow-stone-200 flex items-center gap-2"
            onClick={handleAddNew}
          >
            <Plus className="h-4 w-4" />
            Nueva Dirección
          </Button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {loading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-4xl" />
            ))
          ) : addresses.length > 0 ? (
            addresses.map((addr) => (
              <AddressCard 
                key={addr.id} 
                addr={addr} 
                onEdit={() => handleEdit(addr)}
                onDelete={() => handleDelete(addr.id)}
              />
            ))
          ) : null}

          {!loading && (
            <button 
              className="h-full min-h-62.5 border-2 border-dashed border-stone-100 rounded-4xl flex flex-col items-center justify-center p-8 hover:border-primary/20 hover:bg-primary/5 transition-all group"
              onClick={handleAddNew}
            >
               <div className="h-14 w-14 rounded-full bg-stone-50 flex items-center justify-center text-stone-300 group-hover:scale-110 transition-transform mb-4">
                  <Plus className="h-6 w-6" />
               </div>
               <p className="text-sm font-bold text-stone-400 group-hover:text-primary">Agregar otra ubicación</p>
            </button>
          )}
       </div>

       <AddressDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen} 
          address={editingAddress}
          onSuccess={loadAddresses}
       />
    </div>
  )
}
