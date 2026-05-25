"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Leaf,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LogoutDialog } from "@/components/logout-dialog"
import { NotificationCenter } from "@/components/admin/notification-center"

const navigation = [
  { name: "Panel",      icon: LayoutDashboard, href: "/admin" },
  { name: "Analíticas", icon: TrendingUp,       href: "/admin/analiticas" },
  { name: "Productos",  icon: Package,          href: "/admin/productos" },
  { name: "Pedidos",    icon: ShoppingCart,     href: "/admin/pedidos" },
  { name: "Clientes",   icon: Users,            href: "/admin/clientes" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-stone-100 transform transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center justify-between mb-10 px-2">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="h-7 w-7 text-primary" />
              <span className="font-serif text-lg font-semibold text-foreground">La Vie Naturelle</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1.5">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive(item.href) ? "text-primary" : "text-stone-400")} />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="pt-6 border-t border-stone-100">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-4 py-3 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-colors"
              onClick={() => setShowLogoutDialog(true)}
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-100/60">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-stone-500 hover:text-primary"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-2 ml-auto">
              <NotificationCenter onNavigateToOrders={() => router.push("/admin/pedidos")} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 sm:p-10">
          {children}
        </main>
      </div>

      <LogoutDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
      />
    </div>
  )
}
