"use client"

import { useState, useEffect, useCallback } from "react"
import { Bell, ShoppingBag } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { createClient } from "@/supabase/types/client"
import { cn, formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface OrderNotification {
  id: string
  order_number: string
  full_name: string
  total_amount: number
  created_at: string
  isNew: boolean
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "Ahora"
  if (minutes < 60) return `Hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Hace ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `Hace ${days}d`
  return new Date(dateStr).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })
}

export function NotificationCenter({ onNavigateToOrders }: { onNavigateToOrders?: () => void }) {
  const [notifications, setNotifications] = useState<OrderNotification[]>([])
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel("orders")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          const o = payload.new as Record<string, unknown>
          setNotifications((prev) => [
            {
              id: o.id as string,
              order_number: o.order_number as string,
              full_name: o.full_name as string,
              total_amount: Number(o.total_amount),
              created_at: o.created_at as string,
              isNew: true,
            },
            ...prev,
          ])
        }
      )
      .subscribe()

    supabase
      .from("orders")
      .select("id, order_number, full_name, total_amount, created_at")
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) {
          setNotifications(
            data.map((o) => ({
              id: o.id,
              order_number: o.order_number,
              full_name: o.full_name,
              total_amount: Number(o.total_amount),
              created_at: o.created_at,
              isNew: false,
            }))
          )
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const unreadCount = notifications.filter(n => n.isNew).length

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isNew: false })))
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative cursor-pointer transition-transform active:scale-90">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-red-600 text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-pulse border-2 border-background">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[320px] sm:w-95 p-0 rounded-2xl shadow-2xl border-border animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50">
          <DropdownMenuLabel className="p-0 font-serif text-lg font-bold text-foreground">Notificaciones</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                markAllAsRead()
              }}
              className="h-8 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5 rounded-lg px-3"
            >
              Marcar como leído
            </Button>
          )}
        </div>

        <div className="max-h-100 overflow-y-auto py-2">
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground italic text-xs">
              No hay nuevas notificaciones.
            </div>
          ) : (
            notifications.map((n) => (
              <DropdownMenuItem
                key={n.id}
                className="px-6 py-4 focus:bg-primary/3 cursor-pointer group transition-colors border-b border-border/40 last:border-0"
                onClick={() => onNavigateToOrders?.()}
              >
                <div className="flex gap-4 w-full">
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105",
                    n.isNew ? "bg-primary/10 text-primary border border-primary/20" : "bg-muted text-muted-foreground border border-border"
                  )}>
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-foreground truncate">{n.full_name}</p>
                      {n.isNew && (
                        <span className="h-2 w-2 rounded-full bg-primary animate-pulse shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                       <p className="text-xs font-bold text-muted-foreground tracking-tight">Pedido #{n.order_number}</p>
                       <p className="text-xs font-bold text-foreground">{formatPrice(n.total_amount)}</p>
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60 flex items-center gap-1.5">
                       {timeAgo(n.created_at)}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>

        <DropdownMenuSeparator className="m-0" />

        <div className="p-3 bg-card/50">
           <Button
             variant="ghost"
             className="w-full h-11 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all rounded-xl"
             onClick={() => onNavigateToOrders?.()}
           >
             Ver todos los pedidos
           </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
