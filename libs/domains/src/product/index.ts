import type { Product } from '@bazaar/types'
import { slugify } from '@bazaar/utils'

export class ProductDomain {
  /**
   * Validate product data
   */
  static validate(product: Partial<Product>): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!product.name || product.name.trim().length === 0) {
      errors.push('Product name is required')
    }

    if (!product.price || product.price < 0) {
      errors.push('Product price must be greater than 0')
    }

    if (!product.vendorId) {
      errors.push('Vendor ID is required')
    }

    if (!product.categoryId) {
      errors.push('Category ID is required')
    }

    if (!product.stock || product.stock < 0) {
      errors.push('Product stock must be greater than or equal to 0')
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  /**
   * Generate product slug
   */
  static generateSlug(name: string): string {
    return slugify(name)
  }

  /**
   * Calculate product discount
   */
  static calculateDiscount(price: number, compareAtPrice?: number): number {
    if (!compareAtPrice || compareAtPrice <= price) return 0
    return Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
  }

  /**
   * Check if product is in stock
   */
  static isInStock(stock: number): boolean {
    return stock > 0
  }

  /**
   * Check if product is low stock
   */
  static isLowStock(stock: number, threshold: number = 10): boolean {
    return stock > 0 && stock <= threshold
  }
}

export { ProductDomain as default }
