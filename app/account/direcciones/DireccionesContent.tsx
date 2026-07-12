"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import { Address } from "@/supabase/types/database"
import { AddressesSection } from "../components/AddressesSection"
import { AddressDialog } from "@/components/address-dialog"
import { getUserAddressesAction, createAddressAction, updateAddressAction, deleteAddressAction } from "./actions"

interface DireccionesContentProps {
  addresses: Address[]
}

export function DireccionesContent({ addresses: initialAddresses }: DireccionesContentProps) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses)
  const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const loadAddresses = useCallback(async () => {
    const data = await getUserAddressesAction()
    setAddresses(data)
  }, [])

  const handleEdit = (addr: Address) => {
    setEditingAddress(addr)
    setIsDialogOpen(true)
  }

  const handleAddNew = () => {
    setEditingAddress(undefined)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta dirección?")) return

    const result = await deleteAddressAction(id)
    if (result.success) {
      toast.success("Dirección eliminada")
      loadAddresses()
    } else {
      toast.error("Error al eliminar")
    }
  }

  return (
    <>
      <AddressesSection
        addresses={addresses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddNew={handleAddNew}
      />

      <AddressDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        address={editingAddress}
        onSuccess={loadAddresses}
      />
    </>
  )
}
