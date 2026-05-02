"use client"

import Link from "next/link"
import { ShoppingBag, User, Truck, Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store-context"
import Image from "next/image"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { LogoutDialog } from "@/components/logout-dialog"
import { useState } from "react"

export function Header() {
  const { cartCount, setIsCartOpen, user } = useStore()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 border-b border-border">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Mobile Menu (Left) */}
          <div className="flex sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <SheetHeader className="border-b pb-4">
                  <SheetTitle className="text-left flex items-center gap-2">
                    <Image 
                      src="/logo_header.png" 
                      alt="Logo" 
                      width={40} 
                      height={40} 
                      className="object-contain"
                    />
                    <span className="font-bold text-primary">La Vie Naturelle</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-6">
                  <Link 
                    href="/consulta-pedido" 
                    className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                  >
                    <Truck className="h-5 w-5 text-stone-500" />
                    Rastrear Pedido
                  </Link>
                  
                  <div className="h-px bg-border my-2" />
                  
                  {user ? (
                    <div className="flex flex-col gap-4">
                      <Link 
                        href={user.role === "admin" ? "/admin" : "/account"}
                        className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                      >
                        <User className="h-5 w-5 text-stone-500" />
                        Mi Cuenta
                      </Link>
                      <button 
                        onClick={() => setShowLogoutDialog(true)}
                        className="flex items-center gap-3 text-lg font-medium text-destructive hover:opacity-80 transition-opacity text-left"
                      >
                        <LogOut className="h-5 w-5" />
                        Cerrar Sesión
                      </button>
                    </div>
                  ) : (
                    <Link 
                      href="/login" 
                      className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                    >
                      <User className="h-5 w-5 text-stone-500" />
                      Iniciar Sesión
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Spacer (Hidden on mobile) */}
          <div className="hidden sm:block w-12" />

          {/* Centered Logo & Brand */}
          <div className="flex-1 flex justify-center sm:ml-12">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/logo_header.png" 
                alt="La Vie Naturelle Logo" 
                className="h-16 w-auto object-contain"
                height={100}
                width={100}
                priority
              />
             
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Quick Track Link */}
            <Link href="/consulta-pedido" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-stone-500 hover:text-primary hover:bg-primary/5 transition-all">
              <Truck className="h-3.5 w-3.5" />
              Rastrear Pedido
            </Link>

            {/* User Account */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link href={user.role === "admin" ? "/admin" : "/account"}>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    <User className="h-4 w-4 mr-2" />
                    {user.name}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => setShowLogoutDialog(true)} className="text-muted-foreground hover:text-destructive">
                  Salir
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Cuenta</span>
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              <span className="sr-only">Carrito de compras</span>
            </Button>
          </div>
        </div>
      </nav>
      <LogoutDialog 
        open={showLogoutDialog} 
        onOpenChange={setShowLogoutDialog} 
      />
    </header>
  )
}
