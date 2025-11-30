/**
 * Format price to currency string
 */
export function formatPrice(price: number, currency: string = 'KES'): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
  }).format(price)
}
