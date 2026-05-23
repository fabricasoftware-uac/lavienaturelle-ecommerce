"use client"

import { useState, useEffect } from "react"
import {
  ShoppingCart,
  Package,
  Users,
  ShoppingBag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

interface DashboardStats {
  pendingOrders: number
  criticalStock: number
  newUsersToday: number
  shipmentsToday: number
}

interface RecentOrder {
  id: string
  customer: string
  total: string
  status: string
  statusRaw: string
  date: string
}

export default function AdminDashboardPage() {
  const supabase = createClient()
  const [stats, setStats] = useState<DashboardStats>({
    pendingOrders: 0,
    criticalStock: 0,
    newUsersToday: 0,
    shipmentsToday: 0,
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const [pendingRes, stockRes, usersRes, shipmentsRes, ordersRes] = await Promise.all([
        supabase.from('orders').select('id', { count: 'exact', head: true }).in('status', ['pending', 'processing']),
        supabase.from('products').select('id', { count: 'exact', head: true }).lte('stock_quantity', 5).is('deleted_at', null),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'shipped').gte('updated_at', today.toISOString()),
        supabase.from('orders').select('id, full_name, total_amount, status, created_at').order('created_at', { ascending: false }).limit(5),
      ])

      setStats({
        pendingOrders: pendingRes.count ?? 0,
        criticalStock: stockRes.count ?? 0,
        newUsersToday: usersRes.count ?? 0,
        shipmentsToday: shipmentsRes.count ?? 0,
      })

      const statusMap: Record<string, string> = {
        pending: 'Pendiente',
        paid: 'Pagado',
        processing: 'Procesando',
        shipped: 'Enviado',
        delivered: 'Completado',
        cancelled: 'Cancelado',
        refunded: 'Reembolsado',
      }

      const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime()
        const hours = Math.floor(diff / 3600000)
        if (hours < 1) return 'Hace unos minutos'
        if (hours < 24) return `Hace ${hours} hora${hours !== 1 ? 's' : ''}`
        const days = Math.floor(hours / 24)
        return `Hace ${days} dia${days !== 1 ? 's' : ''}`
      }

      setRecentOrders((ordersRes.data ?? []).map(o => ({
        id: o.id,
        customer: o.full_name,
        total: `$${Number(o.total_amount).toFixed(2)}`,
        status: statusMap[o.status] || o.status,
        statusRaw: o.status,
        date: timeAgo(o.created_at),
      })))
      setLoading(false)
    }
    loadDashboard()
  }, [supabase])
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
        {[
          { icon: ShoppingCart, value: stats.pendingOrders, label: "Pedidos Pendientes", change: "Requiere atención" },
          { icon: Package, value: stats.criticalStock, label: "Stock Crítico", change: stats.criticalStock > 0 ? "Requiere acción" : "Sin novedad" },
          { icon: Users, value: stats.newUsersToday, label: "Clientes Nuevos Hoy", change: `+${stats.newUsersToday} hoy` },
          { icon: ShoppingBag, value: stats.shipmentsToday, label: "Envíos Hoy", change: `${stats.shipmentsToday} en camino` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-xl p-6 border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <span
                className={cn(
                  "inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md",
                  "text-amber-600 bg-amber-50"
                )}
              >
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-semibold text-foreground">{loading ? "..." : stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
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
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">
                    Cargando pedidos...
                  </td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">
                    No hay pedidos recientes
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
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
                          order.statusRaw === "delivered" && "bg-green-100 text-green-700",
                          order.statusRaw === "processing" && "bg-blue-100 text-blue-700",
                          order.statusRaw === "shipped"    && "bg-purple-100 text-purple-700",
                          order.statusRaw === "pending"  && "bg-yellow-100 text-yellow-700",
                          order.statusRaw === "paid" && "bg-teal-100 text-teal-700"
                        )}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {order.date}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
