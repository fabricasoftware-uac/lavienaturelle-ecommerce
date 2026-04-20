"use client"

import { useState } from "react"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Percent,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  MapPin,
  CreditCard,
  Package,
  ChevronDown,
  Info,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Mock Data
const SUMMARY_STATS = [
  {
    name: "Ingresos Totales",
    value: "$12,450.00",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "primary",
  },
  {
    name: "Pedidos Realizados",
    value: "156",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingBag,
    color: "blue",
  },
  {
    name: "Ticket Promedio (AOV)",
    value: "$79.80",
    change: "-2.4%",
    trend: "down",
    icon: TrendingUp,
    color: "purple",
  },
  {
    name: "Tasa de Conversión",
    value: "3.42%",
    change: "+0.5%",
    trend: "up",
    icon: Percent,
    color: "green",
  },
]

const PERFORMANCE_DATA = [
  { day: "01", current: 400, previous: 340 },
  { day: "05", current: 520, previous: 410 },
  { day: "10", current: 480, previous: 500 },
  { day: "15", current: 610, previous: 480 },
  { day: "20", current: 750, previous: 520 },
  { day: "25", current: 680, previous: 590 },
  { day: "30", current: 820, previous: 630 },
]

const TOP_PRODUCTS = [
  { name: "Aceite de Lavanda", sales: 85, margin: "45%", image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=100" },
  { name: "Jabón de Romero", sales: 64, margin: "38%", image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=100" },
  { name: "Serum Facial Vit-C", sales: 52, margin: "52%", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100" },
  { name: "Vela de Sándalo", sales: 48, margin: "30%", image: "https://images.unsplash.com/photo-1602873145311-48c06af3275b?w=100" },
  { name: "Té Matcha Orgánico", sales: 41, margin: "42%", image: "https://images.unsplash.com/photo-1582733315328-d46d3e7dd485?w=100" },
]

const LOW_STOCK_DATA = [
  { id: "PROD-102", name: "Jabon Artersanal Menta", current: 4, min: 10 },
  { id: "PROD-205", name: "Aceite Esencial Limon", current: 2, min: 15 },
  { id: "PROD-088", name: "Tónico de Rosas 100ml", current: 1, min: 20 },
]

const GEO_DATA = [
  { name: "Bogotá", value: 45 },
  { name: "Medellín", value: 25 },
  { name: "Cali", value: 15 },
  { name: "Barranquilla", value: 10 },
  { name: "Otras", value: 5 },
]

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#94a3b8"]

export function AnalyticsPanel() {
  const [dateRange, setDateRange] = useState("Últimos 30 días")

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
            <Button variant="outline" className="bg-card h-10 px-4 rounded-xl font-bold text-xs border-border flex items-center gap-2 cursor-pointer shadow-sm">
              <Calendar className="h-4 w-4 text-primary" />
              {dateRange}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </div>
          <Button className="bg-primary text-white h-10 px-6 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/10 transition-all hover:bg-primary/90">
            <Download className="h-4 w-4 mr-2" />
            Exportar Informe
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SUMMARY_STATS.map((stat) => (
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
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden h-fit flex flex-col">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
               <h3 className="text-md font-bold text-foreground">Top 5 Productos</h3>
               <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-0.5">Vendidos vs Margen</p>
            </div>
          </div>
          <div className="p-2 grow">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">
                   <th className="px-4 py-3">Producto</th>
                   <th className="px-4 py-3 text-center">Ventas</th>
                   <th className="px-4 py-3 text-right">Margen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {TOP_PRODUCTS.map((p, i) => (
                  <tr key={i} className="hover:bg-muted/50 transition-colors group">
                    <td className="px-4 py-4">
                       <div className="flex items-center gap-3">
                          <img src={p.image} className="h-10 w-10 rounded-xl object-cover border border-border group-hover:scale-105 transition-transform" alt="" />
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
                      <p className="text-[10px] font-bold text-red-600/80 uppercase tracking-widest mt-1">{LOW_STOCK_DATA.length} Productos por agotar</p>
                   </div>
                </div>
                <Button className="h-8 text-[10px] font-bold px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all shadow-md shadow-red-200">Abastecer</Button>
              </div>
              <div className="space-y-4">
                 {LOW_STOCK_DATA.map((p) => (
                   <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-red-50/50 border border-red-100/50">
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-lg bg-white border border-red-100 flex items-center justify-center font-bold text-[9px] text-red-600">{p.current}</div>
                         <span className="text-xs font-bold text-foreground truncate max-w-50">{p.name}</span>
                      </div>
                      <Badge variant="outline" className="border-red-200 text-red-600 text-[9px] font-bold uppercase">Mín {p.min}</Badge>
                   </div>
                 ))}
              </div>
           </div>

           {/* Geographic breakdown only */}
           <div className="bg-card rounded-3xl border border-border shadow-sm p-6 sm:p-2 flex flex-col justify-center">
              <div className="flex items-center gap-2 ml-4 mt-4">
                 <MapPin className="h-4 w-4 text-primary" />
                 <h3 className="text-[10px] font-bold text-foreground uppercase tracking-widest leading-none">Ventas por Ciudad</h3>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="h-50 w-full sm:w-1/2">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie
                            data={GEO_DATA}
                            innerRadius={60}
                            outerRadius={85}
                            paddingAngle={6}
                            dataKey="value"
                            cornerRadius={6}
                         >
                            {GEO_DATA.map((entry, index) => (
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
                   {GEO_DATA.map((item, id) => (
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
