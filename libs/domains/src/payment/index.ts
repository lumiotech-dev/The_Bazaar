import type { Payment } from '@bazaar/types'
import { calculateCommission } from '@bazaar/utils'

export class PaymentDomain {
  /**
   * Validate payment data
   */
  static validate(payment: Partial<Payment>): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!payment.orderId) {
      errors.push('Order ID is required')
    }

    if (!payment.amount || payment.amount <= 0) {
      errors.push('Payment amount must be greater than 0')
    }

    if (!payment.method) {
      errors.push('Payment method is required')
    }

    if (!payment.currency) {
      errors.push('Currency is required')
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  /**
   * Calculate platform commission
   */
  static calculatePlatformCommission(amount: number, commissionRate: number = 5): number {
    return calculateCommission(amount, commissionRate)
  }

  /**
   * Calculate vendor payout
   */
  static calculateVendorPayout(amount: number, commissionRate: number = 5): number {
    const commission = this.calculatePlatformCommission(amount, commissionRate)
    return amount - commission
  }

  /**
   * Get payment method display
   */
  static getMethodDisplay(method: string): string {
    const methodMap: Record<string, string> = {
      card: 'Credit/Debit Card',
      mpesa: 'M-Pesa',
      pesapal: 'PesaPal',
    }
    return methodMap[method] || method
  }

  /**
   * Check if payment can be refunded
   */
  static canRefund(status: string): boolean {
    return ['completed', 'pending'].includes(status)
  }
}

export { PaymentDomain as default }
