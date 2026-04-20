"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Leaf,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Search,
  Bell,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Edit,
  Trash2,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store-context"
import { products } from "@/lib/products"
import { cn } from "@/lib/utils"
import { OrdersPanel } from "@/components/admin/orders-panel"
import { ProductsPanel } from "@/components/admin/products-panel"
import { ClientsPanel } from "@/components/admin/clients-panel"

const navigation = [
  { name: "Panel", icon: LayoutDashboard, href: "#" },
  { name: "Productos", icon: Package, href: "#" },
  { name: "Pedidos", icon: ShoppingCart, href: "#" },
  { name: "Clientes", icon: Users, href: "#" },
  { name: "Configuracion", icon: Settings, href: "#" },
]

const stats = [
  {
    name: "Ingresos Totales",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
  },
  {
    name: "Pedidos",
    value: "2,350",
    change: "+15.3%",
    trend: "up",
    icon: ShoppingBag,
  },
  {
    name: "Clientes",
    value: "1,247",
    change: "+8.2%",
    trend: "up",
    icon: Users,
  },
  {
    name: "Tasa de Conversion",
    value: "3.24%",
    change: "-2.1%",
    trend: "down",
    icon: TrendingUp,
  },
]

const recentOrders = [
  { id: "ORD-001", customer: "Maria Garcia", total: "$124.99", status: "Completado", date: "Hace 2 horas" },
  { id: "ORD-002", customer: "Juan Perez", total: "$89.50", status: "Procesando", date: "Hace 5 horas" },
  { id: "ORD-003", customer: "Ana Rodriguez", total: "$256.00", status: "Enviado", date: "Hace 1 dia" },
  { id: "ORD-004", customer: "Carlos Lopez", total: "$45.99", status: "Pendiente", date: "Hace 1 dia" },
  { id: "ORD-005", customer: "Sofia Martinez", total: "$178.00", status: "Completado", date: "Hace 2 dias" },
]

function AdminDashboard() {
  const router = useRouter()
  const { user, logout } = useStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("Panel")

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="h-7 w-7 text-primary" />
              <span className="font-serif text-lg font-semibold text-foreground">Admin</span>
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
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  activeTab === item.name
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </button>
            ))}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">AD</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Admin</p>
                <p className="text-xs text-muted-foreground">admin@gmail.com</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={() => router.push("/login")}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesion
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-border">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar..."
                  className="pl-10 w-64 bg-secondary/50"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
              </Button>
              <Link href="/">
                <Button variant="outline" size="sm">
                  Ver Tienda
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {activeTab === "Panel" && (
            <>
              {/* Page Header */}
              <div className="mb-8">
                <h1 className="font-serif text-2xl font-semibold text-foreground">Panel de Control</h1>
                <p className="text-muted-foreground mt-1">
                  Bienvenido de vuelta! Aqui esta lo que sucede en tu tienda.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => (
                  <div
                    key={stat.name}
                    className="bg-card rounded-xl p-6 border border-border"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <stat.icon className="h-5 w-5 text-primary" />
                      </div>
                      <span
                        className={cn(
                          "inline-flex items-center text-sm font-medium",
                          stat.trend === "up" ? "text-green-600" : "text-red-500"
                        )}
                      >
                        {stat.change}
                        {stat.trend === "up" ? (
                          <ArrowUpRight className="h-4 w-4 ml-1" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 ml-1" />
                        )}
                      </span>
                    </div>
                    <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{stat.name}</p>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="bg-card rounded-xl border border-border">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <h2 className="font-medium text-foreground">Pedidos Recientes</h2>
                  <Button variant="ghost" size="sm" className="text-primary">
                    Ver todos
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Pedido
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Cliente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Fecha
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-secondary/30">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                            {order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {order.customer}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            {order.total}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={cn(
                                "inline-flex px-2.5 py-1 rounded-full text-xs font-medium",
                                order.status === "Completado" &&
                                  "bg-green-100 text-green-700",
                                order.status === "Procesando" &&
                                  "bg-blue-100 text-blue-700",
                                order.status === "Enviado" &&
                                  "bg-purple-100 text-purple-700",
                                order.status === "Pendiente" &&
                                  "bg-yellow-100 text-yellow-700"
                              )}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {order.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === "Productos" && (
            <ProductsPanel />
          )}

          {activeTab === "Pedidos" && (
            <OrdersPanel />
          )}

          {activeTab === "Clientes" && (
            <ClientsPanel />
          )}

          {activeTab === "Configuracion" && (
            <div className="flex items-center justify-center h-64 bg-card rounded-xl border border-border">
              <p className="text-muted-foreground">Pagina de {activeTab} proximamente...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return <AdminDashboard />
}
