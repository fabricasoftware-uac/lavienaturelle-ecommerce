import { cn } from "@/lib/utils"

const statusConfig: Record<string, { label: string; className: string }> = {
  pending:    { label: "Pendiente",   className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  paid:       { label: "Pagado",      className: "bg-blue-50 text-blue-700 border-blue-200" },
  processing: { label: "Procesando",  className: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  shipped:    { label: "Enviado",     className: "bg-purple-50 text-purple-700 border-purple-200" },
  delivered:  { label: "Entregado",   className: "bg-green-50 text-green-700 border-green-200" },
  cancelled:  { label: "Cancelado",   className: "bg-red-50 text-red-700 border-red-200" },
  refunded:   { label: "Reembolsado", className: "bg-gray-50 text-gray-700 border-gray-200" },
}

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status.toLowerCase()] || {
    label: status,
    className: "bg-stone-50 text-stone-700 border-stone-200",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full border border-none",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
