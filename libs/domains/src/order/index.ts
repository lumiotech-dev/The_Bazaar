import type { Order, OrderStatus } from '@bazaar/types'

export class OrderDomain {
  /**
   * Validate order data
   */
  static validate(order: Partial<Order>): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!order.userId) {
      errors.push('User ID is required')
    }

    if (!order.items || order.items.length === 0) {
      errors.push('Order must contain at least one item')
    }

    if (!order.total || order.total <= 0) {
      errors.push('Order total must be greater than 0')
    }

    if (!order.shippingAddress) {
      errors.push('Shipping address is required')
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  /**
   * Get next valid order status
   */
  static getNextStatus(currentStatus: OrderStatus): OrderStatus | null {
    const statusFlow: Record<OrderStatus, OrderStatus | null> = {
      pending: 'processing',
      processing: 'shipped',
      shipped: 'delivered',
      delivered: null,
      cancelled: null,
      refunded: null,
    }

    return statusFlow[currentStatus] || null
  }

  /**
   * Check if order can be cancelled
   */
  static canCancel(status: OrderStatus): boolean {
    return ['pending', 'processing'].includes(status)
  }

  /**
   * Check if order can be refunded
   */
  static canRefund(status: OrderStatus): boolean {
    return ['delivered', 'cancelled'].includes(status)
  }

  /**
   * Calculate order total with tax
   */
  static calculateTotal(subtotal: number, taxRate: number = 0.16): number {
    return subtotal * (1 + taxRate)
  }
}

export { OrderDomain as default }
