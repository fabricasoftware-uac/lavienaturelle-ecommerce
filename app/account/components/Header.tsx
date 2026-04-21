"use client"

import Link from "next/link"
import { Menu, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NAVIGATION, USER_DATA } from "../constants"

interface HeaderProps {
  activeSegment: string
  setSidebarOpen: (open: boolean) => void
}

export function Header({ activeSegment, setSidebarOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-100/60 px-6 sm:px-10 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <Link href="/">
            <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2 text-stone-500 hover:text-primary transition-colors px-0 hover:bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Volver a la tienda</span>
            </Button>
          </Link>
          <div className="h-4 w-px bg-stone-100 hidden sm:block mx-1" />
          <h1 className="text-xl font-bold text-stone-800 tracking-tight">
            {NAVIGATION.find(n => n.id === activeSegment)?.name}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end mr-2">
              <p className="text-sm font-bold text-stone-900">{USER_DATA.name}</p>
          </div>
        </div>
    </header>
  )
}
