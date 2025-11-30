import type { Vendor, VendorStatus, KYCStatus } from '@bazaar/types'

export class VendorDomain {
  /**
   * Validate vendor data
   */
  static validate(vendor: Partial<Vendor>): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!vendor.businessName || vendor.businessName.trim().length === 0) {
      errors.push('Business name is required')
    }

    if (!vendor.businessType) {
      errors.push('Business type is required')
    }

    if (!vendor.userId) {
      errors.push('User ID is required')
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  /**
   * Check if vendor is active
   */
  static isActive(vendor: Vendor): boolean {
    return vendor.status === 'approved' && vendor.kycStatus === 'approved'
  }

  /**
   * Check if vendor can sell
   */
  static canSell(vendor: Vendor): boolean {
    return this.isActive(vendor)
  }

  /**
   * Get vendor status display
   */
  static getStatusDisplay(status: VendorStatus): string {
    const statusMap: Record<VendorStatus, string> = {
      pending: 'Pending Approval',
      approved: 'Approved',
      suspended: 'Suspended',
      rejected: 'Rejected',
    }
    return statusMap[status]
  }

  /**
   * Get KYC status display
   */
  static getKYCStatusDisplay(status: KYCStatus): string {
    const statusMap: Record<KYCStatus, string> = {
      pending: 'Pending Review',
      approved: 'Verified',
      rejected: 'Rejected',
    }
    return statusMap[status]
  }
}

export { VendorDomain as default }
