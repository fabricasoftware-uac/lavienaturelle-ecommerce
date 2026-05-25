"use client"

import { useState, useEffect, useMemo } from "react"
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  MapPin,
  ChevronDown,
  Info,
  type LucideIcon,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn, formatPrice } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#94a3b8"]

interface KPI {
  name: string
  value: string
  change: string
  trend: "up" | "down"
  icon: LucideIcon
  color: string
}

interface ChartDataPoint {
  day: string
  current: number
  previous: number
}

interface TopProduct {
  name: string
  sales: number
  margin: string
  image: string
}

interface LowStockItem {
  id: string
  name: string
  current: number
  min: number
}

interface GeoData {
  name: string
  value: number
}

interface OrderSummary {
  total_amount: number
  created_at: string
}

interface ProductStock {
  id: string
  name: string
  stock_quantity: number
}

interface OrderGeo {
  shipping_city: string | null
  total_amount: number
}

interface OrderItemSummary {
  product_name_snapshot: string | null
  quantity: number
  total_price: number
  created_at: string
}

export function AnalyticsPanel() {
  const supabase = useMemo(() => createClient(), [])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState("Últimos 30 días")
  const [kpis, setKpis] = useState<KPI[]>([])
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [lowStock, setLowStock] = useState<LowStockItem[]>([])
  const [geoData, setGeoData] = useState<GeoData[]>([])

  useEffect(() => {
    let cancelled = false
    async function loadData() {
      try {
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000)
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 86400000)
      const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const endLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

      const [
        ordersThisMonth,
        ordersLastMonth,
        productsRes,
        ordersGeoRes,
        ordersItemsRes,
      ] = await Promise.all([
        supabase
          .from("orders")
          .select("total_amount, created_at")
          .gte("created_at", startThisMonth.toISOString())
          .not("status", "eq", "cancelled") as unknown as { data: OrderSummary[] },
        supabase
          .from("orders")
          .select("total_amount, created_at")
          .gte("created_at", startLastMonth.toISOString())
          .lte("created_at", endLastMonth.toISOString())
          .not("status", "eq", "cancelled") as unknown as { data: OrderSummary[] },
        supabase
          .from("products")
          .select("id, name, stock_quantity")
          .is("deleted_at", null)
          .order("stock_quantity", { ascending: true })
          .limit(10) as unknown as { data: ProductStock[] },
        supabase
          .from("orders")
          .select("shipping_city, total_amount")
          .not("status", "eq", "cancelled") as unknown as { data: OrderGeo[] },
        supabase
          .from("order_items")
          .select("product_name_snapshot, quantity, total_price, created_at")
          .gte("created_at", thirtyDaysAgo.toISOString())
          .order("total_price", { ascending: false })
          .limit(100) as unknown as { data: OrderItemSummary[] },
      ])

      // KPIs
      const thisMonthOrders = ordersThisMonth.data ?? []
      const lastMonthOrders = ordersLastMonth.data ?? []
      const thisRevenue = thisMonthOrders.reduce((s, o) => s + Number(o.total_amount), 0)
      const lastRevenue = lastMonthOrders.reduce((s, o) => s + Number(o.total_amount), 0)
      const revenueChange = lastRevenue > 0 ? ((thisRevenue - lastRevenue) / lastRevenue) * 100 : 0

      const totalOrders = await supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .not("status", "eq", "cancelled")
      const totalProfiles = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })

      const aov = totalOrders.count && totalOrders.count > 0
        ? (thisRevenue + lastRevenue) / totalOrders.count
        : 0

      if (cancelled) return
      setKpis([
        {
          name: "Ingresos Totales (30d)",
          value: formatPrice(thisRevenue + lastRevenue),
          change: `${revenueChange >= 0 ? "+" : ""}${revenueChange.toFixed(1)}%`,
          trend: revenueChange >= 0 ? "up" : "down",
          icon: DollarSign,
          color: "primary",
        },
        {
          name: "Pedidos (30d)",
          value: String(thisMonthOrders.length + lastMonthOrders.length),
          change: `${thisMonthOrders.length > lastMonthOrders.length ? "+" : ""}${thisMonthOrders.length - lastMonthOrders.length}`,
          trend: thisMonthOrders.length >= lastMonthOrders.length ? "up" : "down",
          icon: ShoppingBag,
          color: "blue",
        },
        {
          name: "Ticket Promedio (AOV)",
          value: formatPrice(aov),
          change: lastRevenue > 0 ? `${((aov - (lastRevenue / (lastMonthOrders.length || 1))) / (lastRevenue / (lastMonthOrders.length || 1)) * 100).toFixed(1)}%` : "0%",
          trend: aov >= (lastRevenue / (lastMonthOrders.length || 1)) ? "up" : "down",
          icon: TrendingUp,
          color: "purple",
        },
        {
          name: "Clientes Registrados",
          value: String(totalProfiles.count ?? 0),
          change: "Total acumulado",
          trend: "up",
          icon: Users,
          color: "green",
        },
      ])

      // Chart data: daily last 30 days
      const chartMap: Record<string, { current: number; previous: number }> = {}
      for (let i = 0; i < 30; i++) {
        const d = new Date(now.getTime() - (29 - i) * 86400000)
        const key = String(d.getDate())
        chartMap[key] = { current: 0, previous: 0 }
      }

      thisMonthOrders.forEach((o) => {
        const d = new Date(o.created_at)
        const key = String(d.getDate())
        if (chartMap[key]) chartMap[key].current += Number(o.total_amount)
      })
      lastMonthOrders.forEach((o) => {
        const d = new Date(o.created_at)
        const key = String(d.getDate())
        if (chartMap[key]) chartMap[key].previous += Number(o.total_amount)
      })

      setChartData(
        Object.entries(chartMap).map(([day, vals]) => ({
          day,
          current: Math.round(vals.current * 100) / 100,
          previous: Math.round(vals.previous * 100) / 100,
        }))
      )

      // Top products
      const productMap: Record<string, { sales: number; totalPrice: number }> = {}
      ordersItemsRes.data?.forEach((item: any) => {
        const name = item.product_name_snapshot || "Producto"
        if (!productMap[name]) productMap[name] = { sales: 0, totalPrice: 0 }
        productMap[name].sales += item.quantity || 0
        productMap[name].totalPrice += Number(item.total_price) || 0
      })

      setTopProducts(
        Object.entries(productMap)
          .sort(([, a], [, b]) => b.sales - a.sales)
          .slice(0, 5)
          .map(([name, data]) => ({
            name,
            sales: data.sales,
            margin: "—",
            image: "",
          }))
      )

      // Low stock
      setLowStock(
        (productsRes.data ?? [])
          .filter((p: any) => p.stock_quantity <= 10)
          .slice(0, 5)
          .map((p: any) => ({
            id: p.id,
            name: p.name,
            current: p.stock_quantity,
            min: 10,
          }))
      )

      // Geo distribution
      const cityMap: Record<string, number> = {}
      ordersGeoRes.data?.forEach((o: any) => {
        const city = o.shipping_city || "Otras"
        cityMap[city] = (cityMap[city] || 0) + Number(o.total_amount)
      })
      const totalGeo = Object.values(cityMap).reduce((s, v) => s + v, 0)
      setGeoData(
        Object.entries(cityMap)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([name, value]) => ({
            name,
            value: totalGeo > 0 ? Math.round((value / totalGeo) * 100) : 0,
          }))
      )

      if (cancelled) return
    } catch (err) {
      console.error("Error loading analytics:", err)
    } finally {
      if (!cancelled) setLoading(false)
    }
    }

    loadData()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground tracking-tight">Análisis y Rendimiento</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Visualiza el crecimiento y la salud de tu negocio.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Button variant="outline" className="bg-card h-10 px-4 rounded-xl font-bold text-xs border-border flex items-center gap-2 cursor-not-allowed shadow-sm opacity-60">
              <Calendar className="h-4 w-4 text-primary" />
              {dateRange}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </div>
          <Button className="bg-primary text-white h-10 px-6 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/10 transition-all hover:bg-primary/90">
            Exportar Informe
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 border border-border shadow-sm animate-pulse">
                <div className="h-12 w-12 rounded-2xl bg-secondary/50 mb-4" />
                <div className="h-6 w-24 bg-secondary/50 rounded mb-2" />
                <div className="h-3 w-32 bg-secondary/30 rounded" />
              </div>
            ))
          : kpis.map((stat) => (
              <div key={stat.name} className="bg-card rounded-2xl p-6 border border-border shadow-sm group hover:border-primary/20 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center border shadow-inner transition-transform group-hover:scale-110",
                    stat.color === "primary" ? "bg-primary/5 text-primary border-primary/10" :
                    stat.color === "blue" ? "bg-blue-50 text-blue-600 border-blue-100" :
                    stat.color === "purple" ? "bg-purple-50 text-purple-600 border-purple-100" :
                    "bg-green-50 text-green-600 border-green-100"
                  )}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg",
                    stat.trend === "up" ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                  )}>
                    {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground tabular-nums leading-none tracking-tight">{stat.value}</p>
                  <p className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-tighter opacity-80">{stat.name}</p>
                </div>
              </div>
            ))}
      </div>

      {/* Main Chart Section */}
      <div className="bg-card rounded-3xl border border-border shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-bold text-foreground">Rendimiento de Ventas</h2>
            <p className="text-xs font-medium text-muted-foreground">Comparativa de ingresos diarios frente al mes anterior.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary" /> Mes Actual
             </div>
             <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-slate-300" /> Mes Anterior
             </div>
          </div>
        </div>
        <div className="h-87.5 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold', fontSize: '12px' }}
                  cursor={{ stroke: '#10b981', strokeWidth: 2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="current" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorCurrent)" 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="previous" 
                  stroke="#94a3b8" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  fill="transparent" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
              {loading ? "Cargando datos..." : "No hay datos de ventas para el período seleccionado."}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden h-fit flex flex-col">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
               <h3 className="text-md font-bold text-foreground">Top Productos</h3>
               <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-0.5">Vendidos (últimos 30 días)</p>
            </div>
          </div>
          <div className="p-2 grow">
            {topProducts.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">
                     <th className="px-4 py-3">Producto</th>
                     <th className="px-4 py-3 text-center">Vendidos</th>
                     <th className="px-4 py-3 text-right">Margen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {topProducts.map((p, i) => (
                    <tr key={i} className="hover:bg-muted/50 transition-colors group">
                      <td className="px-4 py-4">
                         <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-secondary/50 flex items-center justify-center text-xs font-bold text-muted-foreground border border-border">
                              {p.name.charAt(0)}
                            </div>
                            <span className="text-xs font-bold text-foreground truncate max-w-37.5">{p.name}</span>
                         </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                         <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] font-bold px-2">{p.sales}</Badge>
                      </td>
                      <td className="px-4 py-4 text-right">
                         <span className="text-xs font-bold text-foreground">{p.margin}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-sm text-muted-foreground">
                {loading ? "Cargando..." : "No hay ventas en los últimos 30 días."}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
           {/* Stock Warning */}
           <div className="bg-card rounded-3xl border-2 border-red-100 shadow-sm p-6 group hover:border-red-200 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 animate-pulse">
                      <AlertTriangle className="h-5 w-5" />
                   </div>
                   <div>
                      <h3 className="text-sm font-bold text-foreground leading-none">Alertas de Stock</h3>
                      <p className="text-[10px] font-bold text-red-600/80 uppercase tracking-widest mt-1">{lowStock.length} Productos por agotar</p>
                   </div>
                </div>
                <Link href="/admin/productos">
  <Button className="h-8 text-[10px] font-bold px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all shadow-md shadow-red-200">Abastecer</Button>
</Link>
              </div>
              {lowStock.length > 0 ? (
                <div className="space-y-4">
                   {lowStock.map((p) => (
                     <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-red-50/50 border border-red-100/50">
                        <div className="flex items-center gap-3">
                           <div className="h-8 w-8 rounded-lg bg-white border border-red-100 flex items-center justify-center font-bold text-[9px] text-red-600">{p.current}</div>
                           <span className="text-xs font-bold text-foreground truncate max-w-50">{p.name}</span>
                        </div>
                        <Badge variant="outline" className="border-red-200 text-red-600 text-[9px] font-bold uppercase">Mín {p.min}</Badge>
                     </div>
                   ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground bg-green-50 rounded-2xl border border-green-100">
                  <span className="text-green-700 font-bold">✓ Todo en orden — stock suficiente</span>
                </div>
              )}
           </div>

           {/* Geographic breakdown */}
           <div className="bg-card rounded-3xl border border-border shadow-sm p-6 sm:p-2 flex flex-col justify-center">
              <div className="flex items-center gap-2 ml-4 mt-4">
                 <MapPin className="h-4 w-4 text-primary" />
                 <h3 className="text-[10px] font-bold text-foreground uppercase tracking-widest leading-none">Ventas por Ciudad</h3>
              </div>
              {geoData.length > 0 ? (
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="h-50 w-full sm:w-1/2">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie
                              data={geoData}
                              innerRadius={60}
                              outerRadius={85}
                              paddingAngle={6}
                              dataKey="value"
                              cornerRadius={6}
                           >
                              {geoData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                           </Pie>
                           <Tooltip 
                              contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px', fontWeight: 'bold' }}
                           />
                        </PieChart>
                     </ResponsiveContainer>
                  </div>
                  <div className="w-full sm:w-1/2 space-y-4">
                     {geoData.map((item, id) => (
                       <div key={id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[id] }} />
                             <span className="text-sm font-bold text-muted-foreground">{item.name}</span>
                          </div>
                          <span className="text-sm font-bold text-foreground">{item.value}%</span>
                       </div>
                     ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  {loading ? "Cargando..." : "No hay datos de ubicación disponibles."}
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-secondary/40 rounded-2xl p-4 flex items-start gap-4 border border-border/60">
        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-border text-primary shadow-sm">
           <Info className="h-4 w-4" />
        </div>
        <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
          Los datos mostrados reflejan las transacciones procesadas y confirmadas. Es posible que exista un desfase de hasta 15 minutos en los informes de conversión en tiempo real. 
          <span className="text-primary hover:underline cursor-pointer ml-1 font-bold">Aprende más sobre cómo se calculan estas métricas.</span>
        </p>
      </div>
    </div>
  )
}
