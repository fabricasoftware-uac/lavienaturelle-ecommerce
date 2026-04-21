"use client"

import { useState } from "react"
import { Sidebar } from "./components/Sidebar"
import { Header } from "./components/Header"
import { OrdersSection } from "./components/OrdersSection"
import { AddressesSection } from "./components/AddressesSection"
import { ProfileSection } from "./components/ProfileSection"
import { OrderDetailsSheet } from "./components/OrderDetailsSheet"
import { AddressDialog } from "./components/AddressDialog"
import { NAVIGATION } from "./constants"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ClientDashboard() {
  const [activeSegment, setActiveSegment] = useState("orders")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <Sidebar 
        activeSegment={activeSegment} 
        setActiveSegment={setActiveSegment}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="lg:pl-72 min-h-screen">
        <Header 
          activeSegment={activeSegment} 
          setSidebarOpen={setSidebarOpen} 
        />

        <div className="p-6 sm:p-10 max-w-6xl mx-auto space-y-10">
          {activeSegment === "orders" && (
            <OrdersSection onViewDetails={setSelectedOrder} />
          )}

          {activeSegment === "addresses" && (
            <AddressesSection onAddNew={() => setIsAddressDialogOpen(true)} />
          )}

          {activeSegment === "profile" && <ProfileSection />}

          {["payments", "wishlist"].includes(activeSegment) && (
             <div className="h-96 flex flex-col items-center justify-center text-center space-y-4 bg-white border border-stone-100 rounded-4xl shadow-sm">
                <div className="h-16 w-16 rounded-3xl bg-stone-50 flex items-center justify-center text-stone-300">
                   <Clock className="h-8 w-8" />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-stone-800 tracking-tight">Sección en Construcción</h3>
                   <p className="text-sm text-stone-400 max-w-70 mx-auto mt-1 font-medium">Estamos trabajando para brindarte la mejor experiencia en {NAVIGATION.find(n => n.id === activeSegment)?.name}.</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-2xl border-stone-200 font-bold" onClick={() => setActiveSegment("orders")}>
                  Ir a Mis Pedidos
                </Button>
            </div>
          )}
        </div>

        <OrderDetailsSheet 
            order={selectedOrder} 
            open={!!selectedOrder} 
            onOpenChange={(open) => !open && setSelectedOrder(null)} 
        />

        <AddressDialog 
            open={isAddressDialogOpen} 
            onOpenChange={setIsAddressDialogOpen} 
        />
      </main>
    </div>
  )
}
