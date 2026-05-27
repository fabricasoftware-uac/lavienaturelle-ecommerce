"use client"

import { useState, useEffect, useMemo } from "react"
import {
  DollarSign,
  ShoppingCart,
  Package,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
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
        const monthlyRevenue = (revenueRes.data ?? []).reduce((sum, order) => sum + Number(order.total_amount), 0)
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
              className="bg-card rounded-2xl p-6 border border-border shadow-sm group hover:border-primary/20 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center shadow-inner transition-transform group-hover:scale-110">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <span
                  className={cn(
                    "inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-lg",
                    stat.change === "Últimos 30 días" || stat.change === "Volumen de ventas" ? "text-blue-600 bg-blue-50" :
                    stat.change === "Requiere atención" ? "text-amber-600 bg-amber-50" :
                    stat.change === "Reabastecer" ? "text-red-600 bg-red-50" :
                    "text-green-600 bg-green-50"
                  )}
                >
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground tabular-nums leading-none tracking-tight">{loading ? "..." : stat.value}</p>
                <p className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-tighter opacity-80">{stat.label}</p>
              </div>
            </div>
          ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="text-lg font-bold text-foreground">Pedidos Recientes</h2>
            <p className="text-xs font-medium text-muted-foreground">Últimos 5 pedidos registrados.</p>
          </div>
          <Link href="/admin/pedidos">
            <Button variant="ghost" size="sm" className="text-primary font-bold">
              Ver todos
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">
                <th className="px-6 py-3">Pedido</th>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
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
                  <tr key={order.id} className="hover:bg-muted/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-foreground">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-muted-foreground">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-foreground">
                      {order.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.statusRaw} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-muted-foreground">
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
