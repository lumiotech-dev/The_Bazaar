/**
 * Format date to readable string
 */
export function formatDate(date: Date | string, locale: string = 'en-KE'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
