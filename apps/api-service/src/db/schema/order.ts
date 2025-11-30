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
  integer,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

/**
 * Order Status Enum
 */
export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
])

/**
 * Payment Status Enum
 */
export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'completed',
  'failed',
  'refunded',
  'cancelled',
])

/**
 * Shipping Status Enum
 */
export const shippingStatusEnum = pgEnum('shipping_status', [
  'pending',
  'picked_up',
  'in_transit',
  'delivered',
  'failed',
  'returned',
])

/**
 * Dispute Status Enum
 */
export const disputeStatusEnum = pgEnum('dispute_status', [
  'open',
  'under_review',
  'resolved',
  'closed',
])

/**
 * Orders Table
 * Master order record
 */
export const orders = pgTable(
  'orders',
  {
    id: serial('id').primaryKey(),
    orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
    userId: serial('user_id').notNull(),
    vendorId: serial('vendor_id').notNull(),
    isLocal: boolean('is_local').default(true),
    isGlobal: boolean('is_global').default(false),
    status: orderStatusEnum('status').default('pending').notNull(),
    subtotal: decimal('subtotal', { precision: 15, scale: 2 }).notNull(),
    shippingCost: decimal('shipping_cost', { precision: 10, scale: 2 }).default('0'),
    taxAmount: decimal('tax_amount', { precision: 10, scale: 2 }).default('0'),
    discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).default('0'),
    totalAmount: decimal('total_amount', { precision: 15, scale: 2 }).notNull(),
    shippingAddress: text('shipping_address'), // JSON
    billingAddress: text('billing_address'), // JSON
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('orders_user_id_idx').on(table.userId),
    vendorIdIdx: index('orders_vendor_id_idx').on(table.vendorId),
    statusIdx: index('orders_status_idx').on(table.status),
    orderNumberIdx: index('orders_order_number_idx').on(table.orderNumber),
  })
)

/**
 * Order Items Table
 * Line items per order
 */
export const orderItems = pgTable(
  'order_items',
  {
    id: serial('id').primaryKey(),
    orderId: serial('order_id').notNull(),
    productId: serial('product_id').notNull(),
    quantity: integer('quantity').notNull(),
    unitPrice: decimal('unit_price', { precision: 12, scale: 2 }).notNull(),
    totalPrice: decimal('total_price', { precision: 15, scale: 2 }).notNull(),
    discount: decimal('discount', { precision: 5, scale: 2 }).default('0'),
    sku: varchar('sku', { length: 100 }),
    productName: varchar('product_name', { length: 255 }),
    productImage: text('product_image'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    orderIdIdx: index('order_items_order_id_idx').on(table.orderId),
    productIdIdx: index('order_items_product_id_idx').on(table.productId),
  })
)

/**
 * Order Payments Table
 * Payment records for orders
 */
export const orderPayments = pgTable(
  'order_payments',
  {
    id: serial('id').primaryKey(),
    orderId: serial('order_id').notNull(),
    paymentMethod: varchar('payment_method', { length: 50 }).notNull(), // 'stripe', 'pesapal', 'mpesa', 'paypal'
    transactionId: varchar('transaction_id', { length: 255 }).unique(),
    amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
    currency: varchar('currency', { length: 3 }).default('KES'),
    status: paymentStatusEnum('status').default('pending').notNull(),
    paymentGatewayResponse: text('payment_gateway_response'), // JSON
    paidAt: timestamp('paid_at'),
    failureReason: text('failure_reason'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    orderIdIdx: index('order_payments_order_id_idx').on(table.orderId),
    statusIdx: index('order_payments_status_idx').on(table.status),
    transactionIdIdx: index('order_payments_transaction_id_idx').on(table.transactionId),
  })
)

/**
 * Order Shipping Table
 * Shipping information and tracking
 */
export const orderShipping = pgTable(
  'order_shipping',
  {
    id: serial('id').primaryKey(),
    orderId: serial('order_id').notNull().unique(),
    courier: varchar('courier', { length: 100 }), // 'dhl', 'fedex', 'ups', 'local'
    trackingNumber: varchar('tracking_number', { length: 100 }),
    trackingUrl: text('tracking_url'),
    status: shippingStatusEnum('status').default('pending').notNull(),
    estimatedDeliveryDate: timestamp('estimated_delivery_date'),
    shippedAt: timestamp('shipped_at'),
    deliveredAt: timestamp('delivered_at'),
    failureReason: text('failure_reason'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    orderIdIdx: index('order_shipping_order_id_idx').on(table.orderId),
    statusIdx: index('order_shipping_status_idx').on(table.status),
    trackingIdx: index('order_shipping_tracking_idx').on(table.trackingNumber),
  })
)

/**
 * Order Escrow Table
 * Escrow system for global orders (14-day hold)
 */
export const orderEscrow = pgTable(
  'order_escrow',
  {
    id: serial('id').primaryKey(),
    orderId: serial('order_id').notNull().unique(),
    vendorId: serial('vendor_id').notNull(),
    escrowAmount: decimal('escrow_amount', { precision: 15, scale: 2 }).notNull(),
    holdPeriodDays: integer('hold_period_days').default(14),
    heldAt: timestamp('held_at').defaultNow(),
    releaseDate: timestamp('release_date').notNull(),
    releasedAt: timestamp('released_at'),
    status: varchar('status', { length: 50 }).default('held'), // 'held', 'released', 'refunded'
    releaseReason: varchar('release_reason', { length: 100 }),
    payoutId: serial('payout_id'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    orderIdIdx: index('order_escrow_order_id_idx').on(table.orderId),
    vendorIdIdx: index('order_escrow_vendor_id_idx').on(table.vendorId),
    statusIdx: index('order_escrow_status_idx').on(table.status),
  })
)

/**
 * Order Disputes Table
 * Dispute tracking for refunds, returns, and escalations
 */
export const orderDisputes = pgTable(
  'order_disputes',
  {
    id: serial('id').primaryKey(),
    orderId: serial('order_id').notNull(),
    userId: serial('user_id').notNull(),
    vendorId: serial('vendor_id').notNull(),
    disputeType: varchar('dispute_type', { length: 50 }).notNull(), // 'refund', 'return', 'quality_issue', 'non_delivery'
    reason: text('reason').notNull(),
    description: text('description'),
    status: disputeStatusEnum('status').default('open').notNull(),
    resolution: text('resolution'),
    refundAmount: decimal('refund_amount', { precision: 15, scale: 2 }),
    refundedAt: timestamp('refunded_at'),
    resolvedAt: timestamp('resolved_at'),
    resolvedBy: serial('resolved_by'), // staff_user_id
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    orderIdIdx: index('order_disputes_order_id_idx').on(table.orderId),
    userIdIdx: index('order_disputes_user_id_idx').on(table.userId),
    vendorIdIdx: index('order_disputes_vendor_id_idx').on(table.vendorId),
    statusIdx: index('order_disputes_status_idx').on(table.status),
  })
)

/**
 * Order Notifications Table
 * Status update tracking for notifications
 */
export const orderNotifications = pgTable(
  'order_notifications',
  {
    id: serial('id').primaryKey(),
    orderId: serial('order_id').notNull(),
    notificationType: varchar('notification_type', { length: 100 }).notNull(), // 'order_confirmed', 'shipped', 'delivered'
    recipientType: varchar('recipient_type', { length: 50 }).notNull(), // 'user', 'vendor', 'admin'
    recipientId: serial('recipient_id').notNull(),
    message: text('message'),
    isRead: boolean('is_read').default(false),
    readAt: timestamp('read_at'),
    sentAt: timestamp('sent_at').defaultNow(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    orderIdIdx: index('order_notifications_order_id_idx').on(table.orderId),
    recipientIdx: index('order_notifications_recipient_idx').on(table.recipientId),
    typeIdx: index('order_notifications_type_idx').on(table.notificationType),
  })
)

/**
 * Relations for Order tables
 */
export const ordersRelations = relations(orders, ({ one, many }) => ({
  items: many(orderItems),
  payments: many(orderPayments),
  shipping: one(orderShipping, {
    fields: [orders.id],
    references: [orderShipping.orderId],
  }),
  escrow: one(orderEscrow, {
    fields: [orders.id],
    references: [orderEscrow.orderId],
  }),
  disputes: many(orderDisputes),
  notifications: many(orderNotifications),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}))

export const orderPaymentsRelations = relations(orderPayments, ({ one }) => ({
  order: one(orders, {
    fields: [orderPayments.orderId],
    references: [orders.id],
  }),
}))

export const orderShippingRelations = relations(orderShipping, ({ one }) => ({
  order: one(orders, {
    fields: [orderShipping.orderId],
    references: [orders.id],
  }),
}))

export const orderEscrowRelations = relations(orderEscrow, ({ one }) => ({
  order: one(orders, {
    fields: [orderEscrow.orderId],
    references: [orders.id],
  }),
}))

export const orderDisputesRelations = relations(orderDisputes, ({ one }) => ({
  order: one(orders, {
    fields: [orderDisputes.orderId],
    references: [orders.id],
  }),
}))

export const orderNotificationsRelations = relations(orderNotifications, ({ one }) => ({
  order: one(orders, {
    fields: [orderNotifications.orderId],
    references: [orders.id],
  }),
}))
