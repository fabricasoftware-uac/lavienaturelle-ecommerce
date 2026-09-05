import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

export function formatPrice(price: number | string) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(price))
}

/**
 * Returns the wholesale price for a product.
 * If not explicitly configured, defaults to 20% discount rounded to nearest hundred.
 */
export function getWholesalePrice(price: number, wholesalePrice?: number | null): number {
  if (wholesalePrice && wholesalePrice > 0) {
    return Number(wholesalePrice)
  }
  return Math.round((price * 0.8) / 100) * 100
}

/**
 * Returns the effective unit price for a given quantity.
 * Wholesale price applies for 12 or more units.
 */
export function getItemUnitPrice(
  item: { price: number; wholesalePrice?: number | null },
  quantity: number
): number {
  if (quantity >= 12) {
    return getWholesalePrice(item.price, item.wholesalePrice)
  }
  return item.price
}

