"use client"

import { Camera, Bell, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { USER_DATA } from "../constants"

export function ProfileSection() {
  return (
    <div className="max-w-5xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
       {/* Profile Header */}
       <div className="flex max-w-2xl flex-col md:flex-row items-center gap-8 bg-white border border-stone-100 p-10 rounded-[40px] shadow-sm">
          <div className="text-center md:text-left space-y-1">
             <h2 className="text-3xl font-serif font-bold text-stone-900">{USER_DATA.name}</h2>
             <p className="text-stone-500 font-medium">{USER_DATA.email}</p>
             <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
                   <span className="text-xs text-stone-400 font-medium">Miembro desde {USER_DATA.memberSince}</span>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
             {/* Personal Info Form */}
             <div className="bg-white border border-stone-100 p-8 rounded-4xl space-y-6">
                <h3 className="text-lg font-bold text-stone-900 border-b border-stone-50 pb-4">Información Personal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <Label className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1">Nombre</Label>
                      <Input defaultValue={USER_DATA.name} className="rounded-2xl border-stone-100 h-12 focus-visible:ring-primary/20" />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1">Email</Label>
                      <Input defaultValue={USER_DATA.email} className="rounded-2xl border-stone-100 h-12 focus-visible:ring-primary/20" />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1">Teléfono</Label>
                      <Input defaultValue={USER_DATA.phone} className="rounded-2xl border-stone-100 h-12 focus-visible:ring-primary/20" />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1">Fecha de Nacimiento</Label>
                      <Input type="date" className="rounded-2xl border-stone-100 h-12 focus-visible:ring-primary/20" />
                   </div>
                </div>
                <div className="pt-4 flex justify-end">
                   <Button className="rounded-2xl bg-stone-900 text-white font-bold px-8 h-12 shadow-lg shadow-stone-200">Guardar Cambios</Button>
                </div>
             </div>
             
             {/* Security Section */}
             <div className="bg-white border border-stone-100 p-8 rounded-4xl space-y-6">
                <h3 className="text-lg font-bold text-stone-900 border-b border-stone-50 pb-4">Seguridad</h3>
                <div className="flex items-center justify-between">
                   <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400">
                         <Lock className="h-5 w-5" />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-stone-800">Contraseña</p>
                         <p className="text-xs text-stone-400">Último cambio hace 3 meses</p>
                      </div>
                   </div>
                   <Button variant="outline" className="rounded-xl border-stone-200 font-bold text-xs h-9 px-4">Cambiar</Button>
                </div>
             </div>
          </div>

          <div className="space-y-8">
             <div className="bg-red-50/50 border border-red-100 p-8 rounded-4xl space-y-4">
                <h3 className="text-sm font-bold text-red-900 uppercase tracking-widest">Zona de Riesgo</h3>
                <p className="text-xs text-red-800 leading-relaxed font-medium">Al eliminar tu cuenta, perderás todos tus beneficios y el historial de tus pedidos de forma permanente.</p>
                <Button variant="link" className="p-0 h-auto text-red-600 font-bold text-xs hover:text-red-700">Eliminar Cuenta definitivamente</Button>
             </div>
          </div>
       </div>
    </div>
  )
}
