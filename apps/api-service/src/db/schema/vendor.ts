import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  pgEnum,
  decimal,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

/**
 * Vendor Status Enum
 * Defines the lifecycle status of a vendor
 */
export const vendorStatusEnum = pgEnum('vendor_status', [
  'pending_approval',
  'kyc_pending',
  'kyc_approved',
  'active',
  'suspended',
  'deactivated',
])

/**
 * Subscription Status Enum
 */
export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active',
  'expired',
  'cancelled',
  'suspended',
])

/**
 * KYC Document Status Enum
 */
export const kycDocumentStatusEnum = pgEnum('kyc_document_status', [
  'pending',
  'approved',
  'rejected',
  'expired',
])

/**
 * Vendors Table
 * Master record for all vendors on the platform
 */
export const vendors = pgTable(
  'vendors',
  {
    id: serial('id').primaryKey(),
    userId: serial('user_id').notNull(),
    businessName: varchar('business_name', { length: 255 }).notNull(),
    businessRegistration: varchar('business_registration', { length: 100 }),
    taxId: varchar('tax_id', { length: 100 }),
    businessType: varchar('business_type', { length: 100 }), // 'individual', 'company', 'partnership'
    status: vendorStatusEnum('status').default('pending_approval').notNull(),
    kycStatus: varchar('kyc_status', { length: 50 }).default('pending'),
    bankAccountName: varchar('bank_account_name', { length: 255 }), // Encrypted
    bankAccountNumber: varchar('bank_account_number', { length: 100 }), // Encrypted
    bankCode: varchar('bank_code', { length: 50 }),
    bankName: varchar('bank_name', { length: 255 }),
    paypalEmail: varchar('paypal_email', { length: 255 }), // Encrypted
    stripeConnectId: varchar('stripe_connect_id', { length: 255 }), // Encrypted
    commissionRate: decimal('commission_rate', { precision: 5, scale: 2 }).default('10.00'), // 10% for global
    totalSalesAmount: decimal('total_sales_amount', { precision: 15, scale: 2 }).default('0'),
    totalEarnings: decimal('total_earnings', { precision: 15, scale: 2 }).default('0'),
    totalPayouts: decimal('total_payouts', { precision: 15, scale: 2 }).default('0'),
    isVerified: boolean('is_verified').default(false),
    verifiedAt: timestamp('verified_at'),
    approvedAt: timestamp('approved_at'),
    approvedBy: serial('approved_by'), // staff_user_id
    rejectionReason: text('rejection_reason'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: uniqueIndex('vendors_user_id_idx').on(table.userId),
    statusIdx: index('vendors_status_idx').on(table.status),
  })
)

/**
 * Vendor Profiles Table
 * Extended profile information for vendor stores
 */
export const vendorProfiles = pgTable(
  'vendor_profiles',
  {
    id: serial('id').primaryKey(),
    vendorId: serial('vendor_id').notNull(),
    storeName: varchar('store_name', { length: 255 }).notNull(),
    storeDescription: text('store_description'),
    storeLogo: text('store_logo'), // URL to S3
    storeBanner: text('store_banner'), // URL to S3
    storeSlug: varchar('store_slug', { length: 255 }).unique(),
    contactEmail: varchar('contact_email', { length: 255 }),
    contactPhone: varchar('contact_phone', { length: 20 }),
    contactAddress: text('contact_address'),
    city: varchar('city', { length: 100 }),
    state: varchar('state', { length: 100 }),
    country: varchar('country', { length: 100 }),
    postalCode: varchar('postal_code', { length: 20 }),
    shippingZones: text('shipping_zones'), // JSON array of zones
    returnPolicy: text('return_policy'),
    warrantyPolicy: text('warranty_policy'),
    averageRating: decimal('average_rating', { precision: 3, scale: 2 }).default('0'),
    totalReviews: serial('total_reviews').default(0),
    totalProducts: serial('total_products').default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    vendorIdIdx: uniqueIndex('vendor_profiles_vendor_id_idx').on(table.vendorId),
    slugIdx: uniqueIndex('vendor_profiles_slug_idx').on(table.storeSlug),
  })
)

/**
 * Vendor Subscription Plans Table
 * Tracks vendor subscription packages and renewal
 */
export const vendorSubscriptionPlans = pgTable(
  'vendor_subscription_plans',
  {
    id: serial('id').primaryKey(),
    vendorId: serial('vendor_id').notNull(),
    planName: varchar('plan_name', { length: 100 }).notNull(), // 'basic', 'pro', 'enterprise'
    planType: varchar('plan_type', { length: 50 }).notNull(),
    monthlyFee: decimal('monthly_fee', { precision: 10, scale: 2 }).notNull(),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date').notNull(),
    autoRenew: boolean('auto_renew').default(true),
    status: subscriptionStatusEnum('status').default('active').notNull(),
    features: text('features'), // JSON array of features
    maxProducts: serial('max_products'),
    maxCategories: serial('max_categories'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    vendorIdIdx: index('vendor_subscription_plans_vendor_id_idx').on(table.vendorId),
    statusIdx: index('vendor_subscription_plans_status_idx').on(table.status),
  })
)

/**
 * Vendor Documents Table
 * Stores references to KYC and other vendor documents
 */
export const vendorDocuments = pgTable(
  'vendor_documents',
  {
    id: serial('id').primaryKey(),
    vendorId: serial('vendor_id').notNull(),
    documentType: varchar('document_type', { length: 100 }).notNull(), // 'id_proof', 'business_license', 'tax_certificate', 'bank_statement'
    documentUrl: text('document_url').notNull(), // Encrypted S3 URL
    documentName: varchar('document_name', { length: 255 }).notNull(),
    fileSize: serial('file_size'), // in bytes
    mimeType: varchar('mime_type', { length: 50 }),
    status: kycDocumentStatusEnum('status').default('pending').notNull(),
    rejectionReason: text('rejection_reason'),
    verifiedAt: timestamp('verified_at'),
    verifiedBy: serial('verified_by'), // staff_user_id
    expiryDate: timestamp('expiry_date'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    vendorIdIdx: index('vendor_documents_vendor_id_idx').on(table.vendorId),
    statusIdx: index('vendor_documents_status_idx').on(table.status),
  })
)

/**
 * Vendor Commissions Table
 * Tracks commission records for each vendor sale
 */
export const vendorCommissions = pgTable(
  'vendor_commissions',
  {
    id: serial('id').primaryKey(),
    vendorId: serial('vendor_id').notNull(),
    orderId: serial('order_id'),
    transactionId: serial('transaction_id'),
    saleAmount: decimal('sale_amount', { precision: 15, scale: 2 }).notNull(),
    commissionRate: decimal('commission_rate', { precision: 5, scale: 2 }).notNull(),
    commissionAmount: decimal('commission_amount', { precision: 15, scale: 2 }).notNull(),
    saleType: varchar('sale_type', { length: 20 }).notNull(), // 'local', 'global'
    escrowId: serial('escrow_id'), // For global orders
    status: varchar('status', { length: 50 }).notNull(), // 'pending', 'held', 'released', 'paid'
    releasedAt: timestamp('released_at'),
    paidAt: timestamp('paid_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    vendorIdIdx: index('vendor_commissions_vendor_id_idx').on(table.vendorId),
    statusIdx: index('vendor_commissions_status_idx').on(table.status),
  })
)

/**
 * Vendor Activity Logs Table
 * Tracks vendor actions in the portal
 */
export const vendorActivityLogs = pgTable(
  'vendor_activity_logs',
  {
    id: serial('id').primaryKey(),
    vendorId: serial('vendor_id').notNull(),
    action: varchar('action', { length: 100 }).notNull(), // 'product_upload', 'stock_update', 'order_accepted'
    description: text('description'),
    entityType: varchar('entity_type', { length: 50 }), // 'product', 'order', 'payout'
    entityId: serial('entity_id'),
    metadata: text('metadata'), // JSON
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    vendorIdIdx: index('vendor_activity_logs_vendor_id_idx').on(table.vendorId),
    actionIdx: index('vendor_activity_logs_action_idx').on(table.action),
  })
)

/**
 * Relations for Vendor tables
 */
export const vendorsRelations = relations(vendors, ({ one, many }) => ({
  profile: one(vendorProfiles, {
    fields: [vendors.id],
    references: [vendorProfiles.vendorId],
  }),
  subscriptions: many(vendorSubscriptionPlans),
  documents: many(vendorDocuments),
  commissions: many(vendorCommissions),
  activityLogs: many(vendorActivityLogs),
}))

export const vendorProfilesRelations = relations(vendorProfiles, ({ one }) => ({
  vendor: one(vendors, {
    fields: [vendorProfiles.vendorId],
    references: [vendors.id],
  }),
}))

export const vendorSubscriptionPlansRelations = relations(vendorSubscriptionPlans, ({ one }) => ({
  vendor: one(vendors, {
    fields: [vendorSubscriptionPlans.vendorId],
    references: [vendors.id],
  }),
}))

export const vendorDocumentsRelations = relations(vendorDocuments, ({ one }) => ({
  vendor: one(vendors, {
    fields: [vendorDocuments.vendorId],
    references: [vendors.id],
  }),
}))

export const vendorCommissionsRelations = relations(vendorCommissions, ({ one }) => ({
  vendor: one(vendors, {
    fields: [vendorCommissions.vendorId],
    references: [vendors.id],
  }),
}))

export const vendorActivityLogsRelations = relations(vendorActivityLogs, ({ one }) => ({
  vendor: one(vendors, {
    fields: [vendorActivityLogs.vendorId],
    references: [vendors.id],
  }),
}))
