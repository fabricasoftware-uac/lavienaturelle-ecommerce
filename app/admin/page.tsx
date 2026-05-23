"use client"

import { useState, useEffect, useMemo } from "react"
import {
  DollarSign,
  ShoppingCart,
  Package,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

interface DashboardStats {
  monthlyRevenue: number
  monthlyOrders: number
  pendingOrders: number
  lowStock: number
}

interface RecentOrder {
  id: string
  customer: string
  total: string
  status: string
  statusRaw: string
  date: string
}

interface RecentOrderRow {
  id: string
  full_name: string
  total_amount: number
  status: string
  created_at: string
}

export default function AdminDashboardPage() {
  const supabase = useMemo(() => createClient(), [])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function loadDashboard() {
      try {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

        const [revenueRes, monthlyOrdersRes, pendingOrders, lowStock, ordersData] = await Promise.all([
          supabase.from("orders").select("total_amount").gte("created_at", startOfMonth).not("status", "eq", "cancelled"),
          supabase.from("orders").select("id", { count: "exact", head: true }).gte("created_at", startOfMonth).not("status", "eq", "cancelled"),
          supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
          supabase.from("products").select("*", { count: "exact", head: true }).lt("stock_quantity", 5),
          supabase.from("orders").select("id, full_name, total_amount, status, created_at").order("created_at", { ascending: false }).limit(5),
        ])

        if (cancelled) return
        const monthlyRevenue = (revenueRes.data ?? []).reduce((sum: number, o: { total_amount: string }) => sum + Number(o.total_amount), 0)
        setStats({
          monthlyRevenue,
          monthlyOrders: monthlyOrdersRes.count ?? 0,
          pendingOrders: pendingOrders.count ?? 0,
          lowStock: lowStock.count ?? 0,
        })

        const orders = (ordersData.data ?? []) as RecentOrderRow[]
        setRecentOrders(
          orders.map((order: RecentOrderRow) => ({
            id: order.id,
            customer: order.full_name,
            total: new Intl.NumberFormat("es-ES", {
              style: "currency",
              currency: "COP",
            }).format(Number(order.total_amount)),
            status: order.status,
            statusRaw: order.status,
            date: new Date(order.created_at).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
          }))
        )
      } catch (err) {
        console.error("Error loading dashboard:", err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadDashboard()
    return () => { cancelled = true }
  }, [])
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
        {(() => {
          const safeStats = stats ?? {
            monthlyRevenue: 0,
            monthlyOrders: 0,
            pendingOrders: 0,
            lowStock: 0,
          }

          return [
            { icon: DollarSign, value: new Intl.NumberFormat("es-ES", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(safeStats.monthlyRevenue), label: "Ingresos del Mes", change: "Últimos 30 días" },
            { icon: ShoppingCart, value: safeStats.monthlyOrders, label: "Pedidos del Mes", change: "Volumen de ventas" },
            { icon: Clock, value: safeStats.pendingOrders, label: "Pendientes por Enviar", change: safeStats.pendingOrders > 0 ? "Requiere atención" : "Sin pendientes" },
            { icon: Package, value: safeStats.lowStock, label: "Stock Bajo", change: safeStats.lowStock > 0 ? "Reabastecer" : "Sin novedad" },
          ]
        })().map((stat) => (
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
                          order.statusRaw === "Entregado" && "bg-green-100 text-green-700",
                          order.statusRaw === "Procesando" && "bg-blue-100 text-blue-700",
                          order.statusRaw === "Enviado"    && "bg-purple-100 text-purple-700",
                          order.statusRaw === "Pendiente"  && "bg-yellow-100 text-yellow-700",
                          order.statusRaw === "Pagado" && "bg-teal-100 text-teal-700"
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
