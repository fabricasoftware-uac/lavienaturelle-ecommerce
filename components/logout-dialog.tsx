"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useStore } from "@/lib/store-context"
import { useRouter } from "next/navigation"

interface LogoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LogoutDialog({ open, onOpenChange }: LogoutDialogProps) {
  const { logout } = useStore()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    onOpenChange(false)
    router.push("/")
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-3xl border-stone-100 shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-stone-900">
            ¿Cerrar sesión?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-stone-500">
            ¿Estás seguro de que deseas cerrar tu sesión actual? Tendrás que volver a ingresar tus credenciales para acceder a tu cuenta.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3 ">
          <AlertDialogCancel className="rounded-xl border-stone-200 text-stone-600 hover:bg-stone-50">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleLogout}
            className="rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200"
          >
            Cerrar Sesión
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
