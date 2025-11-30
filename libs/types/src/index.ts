// User Types
export type UserRole = 'user' | 'vendor' | 'vendor_staff' | 'admin' | 'super_admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

// Product Types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  compareAtPrice?: number
  currency: 'KES' | 'USD'
  images: string[]
  vendorId: string
  categoryId: string
  stock: number
  rating: number
  reviewCount: number
  createdAt: Date
  updatedAt: Date
}

export interface ProductVariant {
  id: string
  productId: string
  name: string
  sku: string
  price: number
  stock: number
}

// Order Types
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'

export interface Order {
  id: string
  userId: string
  vendorId: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  shippingAddress: Address
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
}

// Vendor Types
export type VendorStatus = 'pending' | 'approved' | 'suspended' | 'rejected'
export type KYCStatus = 'pending' | 'approved' | 'rejected'

export interface Vendor {
  id: string
  userId: string
  businessName: string
  businessType: 'individual' | 'business'
  status: VendorStatus
  kycStatus: KYCStatus
  subscriptionPlanId?: string
  createdAt: Date
  updatedAt: Date
}

// Payment Types
export interface Payment {
  id: string
  orderId: string
  amount: number
  currency: 'KES' | 'USD'
  method: 'card' | 'mpesa' | 'pesapal'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  transactionId: string
  createdAt: Date
}

// Address Types
export interface Address {
  id: string
  userId: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Category Types
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  createdAt: Date
  updatedAt: Date
}

// Review Types
export interface Review {
  id: string
  productId: string
  userId: string
  rating: number
  title: string
  comment: string
  createdAt: Date
  updatedAt: Date
}

// Wishlist Types
export interface WishlistItem {
  id: string
  userId: string
  productId: string
  createdAt: Date
}

// Cart Types
export interface CartItem {
  productId: string
  quantity: number
  price: number
}

// Subscription Types
export interface SubscriptionPlan {
  id: string
  name: string
  monthlyPrice: number
  skuLimit: number
  features: string[]
  createdAt: Date
  updatedAt: Date
}

// KYC Document Types
export interface KYCDocument {
  id: string
  vendorId: string
  type: 'id' | 'business_license' | 'tax_certificate' | 'bank_statement'
  url: string
  status: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
  createdAt: Date
  updatedAt: Date
}

// Commission Types
export interface Commission {
  id: string
  vendorId: string
  orderId: string
  amount: number
  rate: number
  status: 'pending' | 'paid'
  createdAt: Date
  paidAt?: Date
}

// Payout Types
export interface Payout {
  id: string
  vendorId: string
  amount: number
  currency: 'KES' | 'USD'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  bankAccount: BankAccount
  createdAt: Date
  processedAt?: Date
}

export interface BankAccount {
  accountNumber: string
  bankName: string
  accountHolderName: string
  swiftCode?: string
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  type: 'order' | 'payment' | 'vendor' | 'system'
  title: string
  message: string
  read: boolean
  createdAt: Date
}

// Audit Log Types
export interface AuditLog {
  id: string
  userId: string
  action: string
  resource: string
  resourceId: string
  changes: Record<string, unknown>
  createdAt: Date
}
