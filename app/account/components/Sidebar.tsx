"use client"

import Link from "next/link"
import { LogOut, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { NAVIGATION } from "../constants"

interface SidebarProps {
  activeSegment: string
  setActiveSegment: (segment: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  onLogout?: () => void
}

export function Sidebar({ 
  activeSegment, 
  setActiveSegment, 
  sidebarOpen, 
  setSidebarOpen 
}: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed top-0 left-0 h-full w-72 bg-white border-r border-stone-100 z-50 transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10 px-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-serif text-primary font-bold">L</div>
              <span className="font-serif text-xl font-bold tracking-tight">Vienaturelle</span>
            </Link>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1.5">
            {NAVIGATION.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSegment(item.id)
                  setSidebarOpen(false)
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200",
                  activeSegment === item.id 
                    ? "bg-primary/10 text-primary" 
                    : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"
                )}
              >
                <item.icon className={cn("h-5 w-5", activeSegment === item.id ? "text-primary" : "text-stone-400")} />
                {item.name}
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-stone-100">
            <Button variant="ghost" className="w-full justify-start gap-3 px-4 py-3 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-colors">
              <LogOut className="h-5 w-5" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
