"use client"

import { useState, useEffect, Suspense } from "react"
import { Search, Package, Truck, ExternalLink, MessageCircle, AlertCircle, ArrowRight, User, ChevronLeft, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getWhatsAppTrackingLink, getWhatsAppHelpLink } from "@/lib/whatsapp"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { getOrderByTracking } from "@/lib/supabase/orders"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"

function TrackingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderId, setOrderId] = useState("")
  const [documentNumber, setDocumentNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState<any>(null)
  const [searched, setSearched] = useState(false)

  // ... rest of the component logic remains same until return ...

  // Initial search from query params
  useEffect(() => {
    const qOrderId = searchParams.get("orderId")
    const qDocNum = searchParams.get("documentNumber")

    if (qOrderId) setOrderId(qOrderId)
    if (qDocNum) setDocumentNumber(qDocNum)

    if (qOrderId && qDocNum) {
      performSearch(qOrderId, qDocNum)
    }
  }, [searchParams])

  const performSearch = async (oId: string, dNum: string) => {
    setLoading(true)
    setOrder(null)
    setSearched(true)
 
    try {
      const data = await getOrderByTracking(oId, dNum)
      
      if (data) {
        const mappedOrder = {
          id: data.order_number || data.id,
          realId: data.id,
          status: data.status.charAt(0).toUpperCase() + data.status.slice(1),
          statusColor: data.status === 'delivered' ? 'green' : data.status === 'shipped' ? 'blue' : 'amber',
          trackingId: data.tracking_number || "No generado",
          carrier: data.courier_name || "N/A",
          date: new Date(data.created_at).toLocaleDateString(),
          total: Number(data.total_amount),
          documentNumber: data.document_number
        }
        setOrder(mappedOrder)
        toast.success("Pedido encontrado")
      } else {
        toast.error("No se encontró ningún pedido con esos datos")
      }
    } catch (error) {
      console.error("Tracking error:", error)
      toast.error("Error al buscar el pedido")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(orderId, documentNumber)
  }

  const whatsappLink = order ? getWhatsAppHelpLink(order.id) : "#"

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 sm:p-12">
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-primary/3 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-xl">
        {/* Back Button */}
        <div className="mb-8">
           <Link 
             href="/" 
             className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors text-xs font-bold uppercase tracking-widest group"
           >
              <div className="w-8 h-8 rounded-full border border-stone-100 flex items-center justify-center group-hover:border-stone-200 group-hover:bg-white transition-all">
                <ChevronLeft className="w-4 h-4" />
              </div>
              Volver al Inicio
           </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-sm border border-stone-100 mb-2">
            <Package className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 tracking-tight">Rastrea tu Pedido</h1>
          <p className="text-stone-500 text-sm max-w-sm mx-auto font-medium">
            Ingresa los detalles de tu compra para conocer el estado de tu envío en tiempo real.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-stone-100">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">ID de Pedido</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-primary transition-colors">
                    <Search className="w-4 h-4" />
                  </div>
                  <Input
                    placeholder="Ej: ORD-7721"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    required
                    className="h-14 pl-11 rounded-2xl bg-stone-50 border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Número de Documento</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-primary transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <Input
                    placeholder="Ingresa tu documento"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    required
                    className="h-14 pl-11 rounded-2xl bg-stone-50 border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-sm font-semibold"
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm transition-all shadow-lg shadow-stone-200 group relative overflow-hidden"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Buscando...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Consultar Pedido
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>

          {/* Results Area */}
          {searched && !loading && (
            <div className="mt-10 animate-in fade-in slide-in-from-top-4 duration-500">
              {order ? (
                <div className="space-y-6 pt-8 border-t border-stone-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Estado del Envío</p>
                      <Badge variant="outline" className={cn(
                        "text-[10px] font-bold uppercase tracking-widest border-none px-3 py-1 rounded-full",
                        order.statusColor === "green" ? "bg-green-50 text-green-600" :
                        order.statusColor === "blue" ? "bg-blue-50 text-blue-600" :
                        "bg-amber-50 text-amber-600"
                      )}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Fecha</p>
                      <p className="text-xs font-bold text-stone-900">{order.date}</p>
                    </div>
                  </div>

                  {!(order.status === "Pending" || order.status === "Paid") && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-5 rounded-3xl bg-stone-50 border border-stone-100 space-y-1">
                          <div className="flex items-center gap-2 text-stone-400 mb-1">
                            <Truck className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Transportadora</span>
                          </div>
                          <p className="text-sm font-bold text-stone-900">{order.carrier}</p>
                        </div>
                        <div className="p-5 rounded-3xl bg-stone-50 border border-stone-100 space-y-1">
                          <div className="flex items-center gap-2 text-stone-400 mb-1">
                            <Package className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Número de Guía</span>
                          </div>
                          <p className="text-sm font-bold text-stone-900 tracking-tight">{order.trackingId}</p>
                        </div>
                      </div>

                      <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-primary/10">
                          <AlertCircle className="w-5 h-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-stone-900">Nota importante</p>
                          <p className="text-[11px] leading-relaxed text-stone-600 font-medium">
                            Para ver detalles granulares del recorrido de tu paquete, te recomendamos ingresar el número de guía directamente en el portal oficial de <strong>{order.carrier}</strong>.
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {(order.status === "Pending" || order.status === "Paid") && (
                    <div className="p-8 rounded-3xl bg-stone-50 border border-stone-100 text-center space-y-2">
                       <Clock className="w-8 h-8 text-stone-300 mx-auto" />
                       <p className="text-sm font-bold text-stone-900">Preparando tu envío</p>
                       <p className="text-xs text-stone-500 font-medium">Estamos alistando tus productos. Una vez sea despachado, podrás ver aquí el número de guía.</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a 
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full h-12 rounded-2xl border-stone-100 bg-white hover:bg-stone-50 text-stone-900 font-bold text-xs gap-2 transition-all group">
                        <MessageCircle className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform" />
                        Solicitar ayuda por WhatsApp
                      </Button>
                    </a>
                    
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="w-10 h-10 text-stone-300" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-stone-900">No encontramos resultados</p>
                    <p className="text-xs text-stone-500 max-w-[240px] mx-auto leading-relaxed">
                      Verifica que el ID de Pedido y tu Documento coincidan con la información de tu compra.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <p className="mt-8 text-center text-[10px] text-stone-400 font-medium uppercase tracking-[0.2em]">
          La Vie Naturelle — Ecommerce Boutique
        </p>
      </div>
    </div>
  )
}

export default function GuestTrackingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <TrackingContent />
    </Suspense>
  )
}
