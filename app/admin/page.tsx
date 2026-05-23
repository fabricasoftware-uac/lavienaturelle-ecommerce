"use client"

import {
  ShoppingCart,
  Package,
  Users,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const stats = [
  {
    name: "Pedidos Pendientes",
    value: "14",
    change: "3 urgentes",
    trend: "down",
    icon: ShoppingCart,
  },
  {
    name: "Stock Crítico",
    value: "8",
    change: "Requiere acción",
    trend: "down",
    icon: Package,
  },
  {
    name: "Clientes Nuevos",
    value: "24",
    change: "+12% hoy",
    trend: "up",
    icon: Users,
  },
  {
    name: "Envíos hoy",
    value: "12",
    change: "8 en camino",
    trend: "up",
    icon: ShoppingBag,
  },
]

const recentOrders = [
  { id: "ORD-001", customer: "Maria Garcia",    total: "$124.99", status: "Completado", date: "Hace 2 horas" },
  { id: "ORD-002", customer: "Juan Perez",      total: "$89.50",  status: "Procesando", date: "Hace 5 horas" },
  { id: "ORD-003", customer: "Ana Rodriguez",   total: "$256.00", status: "Enviado",    date: "Hace 1 dia" },
  { id: "ORD-004", customer: "Carlos Lopez",    total: "$45.99",  status: "Pendiente",  date: "Hace 1 dia" },
  { id: "ORD-005", customer: "Sofia Martinez",  total: "$178.00", status: "Completado", date: "Hace 2 dias" },
]

export default function AdminDashboardPage() {
  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-foreground">Panel de Control</h1>
        <p className="text-muted-foreground mt-1">
          Bienvenido de vuelta! Aquí está lo que sucede en tu tienda.
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
                  "inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md",
                  stat.trend === "up" ? "text-green-600 bg-green-50" : "text-amber-600 bg-amber-50"
                )}
              >
                {stat.change}
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
                        order.status === "Completado" && "bg-green-100 text-green-700",
                        order.status === "Procesando" && "bg-blue-100 text-blue-700",
                        order.status === "Enviado"    && "bg-purple-100 text-purple-700",
                        order.status === "Pendiente"  && "bg-yellow-100 text-yellow-700"
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
  )
}
