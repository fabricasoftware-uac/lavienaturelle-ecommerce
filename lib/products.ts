import { Droplets, Pill, Coffee, type LucideIcon } from "lucide-react"

export interface CategoryConfig {
  id: string
  name: string
  namePlural: string
  description: string
  icon: LucideIcon
  href: string
}

// Scalable categories configuration - add new categories here
export const categories: CategoryConfig[] = [
  { 
    id: "aceites", 
    name: "Aceite Esencial", 
    namePlural: "Aceites Esenciales",
    description: "Aceites puros de grado terapeutico", 
    icon: Droplets,
    href: "/categoria/aceites"
  },
  { 
    id: "suplementos", 
    name: "Suplemento", 
    namePlural: "Suplementos",
    description: "Potenciadores naturales de salud", 
    icon: Pill,
    href: "/categoria/suplementos"
  },
  { 
    id: "tes", 
    name: "Te Herbal", 
    namePlural: "Tes Herbales",
    description: "Mezclas organicas de te", 
    icon: Coffee,
    href: "/categoria/tes"
  },
]

// Helper function to get category by id
export function getCategoryById(id: string): CategoryConfig | undefined {
  return categories.find(cat => cat.id === id)
}

// Helper function to get category icon
export function getCategoryIcon(categoryId: string): LucideIcon {
  const category = getCategoryById(categoryId)
  return category?.icon || Droplets
}
