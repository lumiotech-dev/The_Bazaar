/**
 * Convert string to URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Validate email address
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number (basic)
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/
  return phoneRegex.test(phone)
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Calculate commission amount
 */
export function calculateCommission(amount: number, rate: number): number {
  return (amount * rate) / 100
}

/**
 * Calculate discount amount
 */
export function calculateDiscount(price: number, discount: number): number {
  return (price * discount) / 100
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, length: number = 50): string {
  if (text.length <= length) return text
  return `${text.substring(0, length)}...`
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

/**
 * Merge classnames
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
