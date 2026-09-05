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
 * Returns the wholesale price for a product if manually configured.
 * Returns null if no wholesale price has been set.
 */
export function getWholesalePrice(wholesalePrice?: number | null): number | null {
  if (wholesalePrice && Number(wholesalePrice) > 0) {
    return Number(wholesalePrice)
  }
  return null
}

/**
 * Returns the minimum quantity required to activate wholesale price.
 * Defaults to 12 if not specified.
 */
export function getWholesaleMinQuantity(wholesaleMinQuantity?: number | null): number {
  if (wholesaleMinQuantity && Number(wholesaleMinQuantity) > 0) {
    return Math.floor(Number(wholesaleMinQuantity))
  }
  return 12
}

/**
 * Returns the effective unit price for a given quantity.
 * Wholesale price applies only when the purchase quantity meets or exceeds
 * the product's configured wholesaleMinQuantity (default 12) AND
 * a wholesale price has been manually configured for the product.
 */
export function getItemUnitPrice(
  item: { price: number; wholesalePrice?: number | null; wholesaleMinQuantity?: number | null },
  quantity: number
): number {
  const minQty = getWholesaleMinQuantity(item.wholesaleMinQuantity)
  if (quantity >= minQty && item.wholesalePrice && Number(item.wholesalePrice) > 0) {
    return Number(item.wholesalePrice)
  }
  return item.price
}

