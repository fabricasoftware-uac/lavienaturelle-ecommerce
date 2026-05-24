"use client"

import { useState, useEffect } from "react"
import { Camera, Bell, Lock, Loader2, Save, KeyRound, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStore } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

export function ProfileSection() {
  const { user, updateProfile, changePassword } = useStore()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    document_number: ""
  })

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: ""
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        document_number: user.document_number || ""
      })
    }
  }, [user])

  if (!user) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-stone-300" />
      </div>
    )
  }

  const formatMemberSince = (dateString?: string) => {
    if (!dateString) return "Reciente"
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
  }

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const result = await updateProfile(formData)
      if (result.success) {
        toast({
          title: "Perfil actualizado",
          description: "Tus datos han sido guardados correctamente.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo actualizar el perfil",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Contraseña muy corta",
        description: "La contraseña debe tener al menos 6 caracteres.",
        variant: "destructive"
      })
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error de validación",
        description: "Las contraseñas no coinciden.",
        variant: "destructive"
      })
      return
    }

    setPasswordLoading(true)
    try {
      const result = await changePassword(passwordData.newPassword)
      if (result.success) {
        toast({
          title: "Contraseña actualizada",
          description: "Tu contraseña ha sido cambiada con éxito.",
        })
        setShowPasswordDialog(false)
        setPasswordData({ newPassword: "", confirmPassword: "" })
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo cambiar la contraseña",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive"
      })
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="max-w-5xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
       {/* Profile Header */}
       <div className="flex max-w-2xl flex-col md:flex-row items-center gap-8 bg-white border border-stone-100 p-10 rounded-[40px] shadow-sm">
          <div className="text-center md:text-left space-y-1">
             <h2 className="text-3xl font-serif font-bold text-stone-900">{user.name}</h2>
             <p className="text-stone-500 font-medium">{user.email}</p>
             <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
                   <span className="text-xs text-stone-400 font-medium">Miembro desde {formatMemberSince(user.created_at)}</span>
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
                      <Label className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1">Nombre Completo</Label>
                      <Input 
                        value={formData.name} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="rounded-2xl border-stone-100 h-12 focus-visible:ring-primary/20" 
                        placeholder="Tu nombre completo"
                      />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1">Email</Label>
                      <Input 
                        value={user.email} 
                        readOnly 
                        className="rounded-2xl border-stone-100 h-12 bg-stone-50/50 focus-visible:ring-0 cursor-default text-stone-400" 
                      />
                      <p className="text-[10px] text-stone-400 pl-1 font-medium italic">El email no puede ser modificado</p>
                   </div>
                   <div className="space-y-2">
                      <Label className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1">Teléfono</Label>
                      <Input 
                        value={formData.phone} 
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="rounded-2xl border-stone-100 h-12 focus-visible:ring-primary/20" 
                        placeholder="+57 300 000 0000"
                      />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1">Documento de Identidad</Label>
                      <Input 
                        value={formData.document_number} 
                        onChange={(e) => setFormData({ ...formData, document_number: e.target.value })}
                        className="rounded-2xl border-stone-100 h-12 focus-visible:ring-primary/20" 
                        placeholder="CC / NIT"
                      />
                   </div>
                </div>
                <div className="pt-4 flex justify-end">
                   <Button 
                    onClick={handleUpdate}
                    disabled={loading}
                    className="rounded-2xl bg-stone-900 text-white font-bold px-8 h-12 shadow-lg shadow-stone-200 hover:bg-stone-800 transition-all flex items-center gap-2"
                   >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Guardar Cambios
                   </Button>
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
                         <p className="text-xs text-stone-400">Protege tu cuenta con una contraseña segura</p>
                      </div>
                   </div>
                   
                   <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                      <DialogTrigger asChild>
                         <Button variant="outline" className="rounded-xl border-stone-200 text-stone-600 font-bold text-xs h-9 px-4 hover:bg-stone-50">
                            Cambiar
                         </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md rounded-[32px] border-stone-100">
                         <DialogHeader>
                            <DialogTitle className="text-xl font-serif font-bold text-stone-900">Cambiar Contraseña</DialogTitle>
                            <DialogDescription className="text-stone-500 font-medium">
                               Ingresa tu nueva contraseña a continuación.
                            </DialogDescription>
                         </DialogHeader>
                         <div className="space-y-4 py-4">
                            <div className="space-y-2">
                               <Label className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1">Nueva Contraseña</Label>
                               <div className="relative">
                                  <Input 
                                    type={showPassword ? "text" : "password"}
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="rounded-2xl border-stone-100 h-12 focus-visible:ring-primary/20 pr-10" 
                                    placeholder="••••••••"
                                  />
                                  <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                                  >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </button>
                               </div>
                            </div>
                            <div className="space-y-2">
                               <Label className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1">Confirmar Contraseña</Label>
                               <Input 
                                 type={showPassword ? "text" : "password"}
                                 value={passwordData.confirmPassword}
                                 onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                 className="rounded-2xl border-stone-100 h-12 focus-visible:ring-primary/20" 
                                 placeholder="••••••••"
                               />
                            </div>
                         </div>
                         <DialogFooter className="sm:justify-end">
                            <Button
                               type="button"
                               variant="ghost"
                               className="rounded-2xl font-bold text-stone-500"
                               onClick={() => setShowPasswordDialog(false)}
                            >
                               Cancelar
                            </Button>
                            <Button
                               type="button"
                               disabled={passwordLoading}
                               className="rounded-2xl bg-stone-900 text-white font-bold px-6 h-12 shadow-lg shadow-stone-200"
                               onClick={handlePasswordChange}
                            >
                               {passwordLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Actualizar Contraseña"}
                            </Button>
                         </DialogFooter>
                      </DialogContent>
                   </Dialog>
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
