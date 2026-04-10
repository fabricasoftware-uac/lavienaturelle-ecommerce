"use client"

import Link from "next/link"
import { useState } from "react"
import { Search, ShoppingBag, User, Menu, X, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store-context"
import { categories } from "@/lib/products"
import { cn } from "@/lib/utils"

export function Header() {
  const { cartCount, setIsCartOpen, user, logout } = useStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="font-serif text-xl font-semibold text-foreground tracking-tight">
              La Vie Naturelle
            </span>
          </Link>

          {/* Desktop Navigation - Dynamic from categories */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categoria/${category.id}`}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {category.namePlural}
              </Link>
            ))}
            <Link
              href="/nosotros"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Nosotros
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {/* Search */}
            <div className={cn("flex items-center transition-all", searchOpen ? "w-64" : "w-auto")}>
              {searchOpen ? (
                <div className="relative w-full">
                  <Input
                    type="search"
                    placeholder="Buscar productos..."
                    className="pr-10 bg-secondary/50"
                    autoFocus
                    onBlur={() => setSearchOpen(false)}
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Buscar</span>
                </Button>
              )}
            </div>

            {/* User Account */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link href={user.role === "admin" ? "/admin" : "/account"}>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    <User className="h-4 w-4 mr-2" />
                    {user.name}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground">
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
              className="relative text-muted-foreground hover:text-primary"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              <span className="sr-only">Carrito de compras</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-muted-foreground"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="space-y-4">
              <div className="relative">
                <Input type="search" placeholder="Buscar productos..." className="pr-10 bg-secondary/50" />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col gap-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categoria/${category.id}`}
                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.namePlural}
                  </Link>
                ))}
                <Link
                  href="/nosotros"
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Nosotros
                </Link>
                {user ? (
                  <>
                    <Link
                      href={user.role === "admin" ? "/admin" : "/account"}
                      className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors flex items-center gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      {user.name}
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setMobileMenuOpen(false)
                      }}
                      className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors text-left"
                    >
                      Salir
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Iniciar Sesion
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
