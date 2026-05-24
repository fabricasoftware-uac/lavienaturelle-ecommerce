"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddressCard } from "./AddressCard"
import { Address } from "@/lib/supabase/types/database"

interface AddressesSectionProps {
  addresses: Address[]
  onEdit: (addr: Address) => void
  onDelete: (id: string) => void
  onAddNew: () => void
}

export function AddressesSection({ addresses, onEdit, onDelete, onAddNew }: AddressesSectionProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">Mis Direcciones</h2>
          <p className="text-sm font-medium text-stone-500 mt-1">Gestiona tus lugares de entrega frecuentes.</p>
        </div>
        <Button
          className="rounded-2xl bg-stone-900 text-white font-bold px-6 h-12 shadow-lg shadow-stone-200 flex items-center gap-2"
          onClick={onAddNew}
        >
          <Plus className="h-4 w-4" />
          Nueva Dirección
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {addresses.length > 0 ? (
          addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              addr={addr}
              onEdit={() => onEdit(addr)}
              onDelete={() => onDelete(addr.id)}
            />
          ))
        ) : null}

        <button
          className="h-full min-h-62.5 border-2 border-dashed border-stone-100 rounded-4xl flex flex-col items-center justify-center p-8 hover:border-primary/20 hover:bg-primary/5 transition-all group"
          onClick={onAddNew}
        >
          <div className="h-14 w-14 rounded-full bg-stone-50 flex items-center justify-center text-stone-300 group-hover:scale-110 transition-transform mb-4">
            <Plus className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-stone-400 group-hover:text-primary">Agregar otra ubicación</p>
        </button>
      </div>
    </div>
  )
}
