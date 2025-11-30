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
  integer,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

/**
 * Product Approval Status Enum
 */
export const productApprovalStatusEnum = pgEnum('product_approval_status', [
  'pending',
  'approved',
  'rejected',
  'archived',
])

/**
 * Products Table
 * Master product records
 */
export const products = pgTable(
  'products',
  {
    id: serial('id').primaryKey(),
    vendorId: serial('vendor_id').notNull(),
    categoryId: serial('category_id').notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    sku: varchar('sku', { length: 100 }).unique(),
    price: decimal('price', { precision: 12, scale: 2 }).notNull(),
    originalPrice: decimal('original_price', { precision: 12, scale: 2 }),
    costPrice: decimal('cost_price', { precision: 12, scale: 2 }), // For vendor cost tracking
    discount: decimal('discount', { precision: 5, scale: 2 }).default('0'), // Percentage
    isLocal: boolean('is_local').default(true), // Local (0% commission) vs Global (10% commission)
    isGlobal: boolean('is_global').default(false),
    weight: decimal('weight', { precision: 8, scale: 2 }), // in kg
    dimensions: text('dimensions'), // JSON: {length, width, height}
    color: varchar('color', { length: 50 }),
    size: varchar('size', { length: 50 }),
    material: varchar('material', { length: 100 }),
    brand: varchar('brand', { length: 100 }),
    manufacturer: varchar('manufacturer', { length: 255 }),
    countryOfOrigin: varchar('country_of_origin', { length: 100 }),
    warrantyMonths: integer('warranty_months'),
    isActive: boolean('is_active').default(true),
    approvalStatus: productApprovalStatusEnum('approval_status').default('pending'),
    approvedAt: timestamp('approved_at'),
    approvedBy: serial('approved_by'), // staff_user_id
    rejectionReason: text('rejection_reason'),
    viewCount: integer('view_count').default(0),
    purchaseCount: integer('purchase_count').default(0),
    averageRating: decimal('average_rating', { precision: 3, scale: 2 }).default('0'),
    totalReviews: integer('total_reviews').default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    vendorIdIdx: index('products_vendor_id_idx').on(table.vendorId),
    categoryIdIdx: index('products_category_id_idx').on(table.categoryId),
    skuIdx: uniqueIndex('products_sku_idx').on(table.sku),
    approvalIdx: index('products_approval_status_idx').on(table.approvalStatus),
  })
)

/**
 * Product Images Table
 * Stores image URLs for products (min 1, max 10 per product)
 */
export const productImages = pgTable(
  'product_images',
  {
    id: serial('id').primaryKey(),
    productId: serial('product_id').notNull(),
    imageUrl: text('image_url').notNull(), // S3 URL
    altText: varchar('alt_text', { length: 255 }),
    displayOrder: integer('display_order').default(0),
    isPrimary: boolean('is_primary').default(false),
    fileSize: integer('file_size'), // in bytes
    mimeType: varchar('mime_type', { length: 50 }),
    width: integer('width'),
    height: integer('height'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    productIdIdx: index('product_images_product_id_idx').on(table.productId),
  })
)

/**
 * Product Categories Table
 * Hierarchical category structure
 */
export const productCategories = pgTable(
  'product_categories',
  {
    id: serial('id').primaryKey(),
    parentCategoryId: serial('parent_category_id'),
    name: varchar('name', { length: 255 }).notNull().unique(),
    slug: varchar('slug', { length: 255 }).unique(),
    description: text('description'),
    icon: text('icon'), // URL or SVG
    displayOrder: integer('display_order').default(0),
    isActive: boolean('is_active').default(true),
    productCount: integer('product_count').default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    parentIdIdx: index('product_categories_parent_id_idx').on(table.parentCategoryId),
    slugIdx: uniqueIndex('product_categories_slug_idx').on(table.slug),
  })
)

/**
 * Inventory Table
 * Tracks stock levels per product
 */
export const inventory = pgTable(
  'inventory',
  {
    id: serial('id').primaryKey(),
    productId: serial('product_id').notNull().unique(),
    quantity: integer('quantity').default(0).notNull(),
    reserved: integer('reserved').default(0), // Items in pending orders
    available: integer('available').default(0), // quantity - reserved
    reorderLevel: integer('reorder_level').default(10),
    reorderQuantity: integer('reorder_quantity').default(50),
    lastRestockDate: timestamp('last_restock_date'),
    lastSoldDate: timestamp('last_sold_date'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    productIdIdx: uniqueIndex('inventory_product_id_idx').on(table.productId),
  })
)

/**
 * Inventory Adjustments Table
 * Tracks manual and automatic stock updates for auditing
 */
export const inventoryAdjustments = pgTable(
  'inventory_adjustments',
  {
    id: serial('id').primaryKey(),
    productId: serial('product_id').notNull(),
    adjustmentType: varchar('adjustment_type', { length: 50 }).notNull(), // 'restock', 'damage', 'return', 'correction'
    quantityChanged: integer('quantity_changed').notNull(),
    reason: text('reason'),
    referenceId: serial('reference_id'), // order_id, return_id, etc.
    adjustedBy: serial('adjusted_by'), // user_id or staff_user_id
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    productIdIdx: index('inventory_adjustments_product_id_idx').on(table.productId),
    typeIdx: index('inventory_adjustments_type_idx').on(table.adjustmentType),
  })
)

/**
 * Product Reviews Table
 * User reviews and ratings for products
 */
export const productReviews = pgTable(
  'product_reviews',
  {
    id: serial('id').primaryKey(),
    productId: serial('product_id').notNull(),
    userId: serial('user_id').notNull(),
    orderId: serial('order_id'), // Must have purchased to review
    rating: integer('rating').notNull(), // 1-5 stars
    title: varchar('title', { length: 255 }),
    reviewText: text('review_text'),
    isVerifiedPurchase: boolean('is_verified_purchase').default(false),
    helpfulCount: integer('helpful_count').default(0),
    unhelpfulCount: integer('unhelpful_count').default(0),
    status: varchar('status', { length: 50 }).default('pending'), // 'pending', 'approved', 'rejected'
    approvedAt: timestamp('approved_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    productIdIdx: index('product_reviews_product_id_idx').on(table.productId),
    userIdIdx: index('product_reviews_user_id_idx').on(table.userId),
    ratingIdx: index('product_reviews_rating_idx').on(table.rating),
  })
)

/**
 * Product Approvals Table
 * Tracks admin approval for global products
 */
export const productApprovals = pgTable(
  'product_approvals',
  {
    id: serial('id').primaryKey(),
    productId: serial('product_id').notNull(),
    vendorId: serial('vendor_id').notNull(),
    requestedAt: timestamp('requested_at').defaultNow(),
    status: productApprovalStatusEnum('status').default('pending').notNull(),
    approvedAt: timestamp('approved_at'),
    approvedBy: serial('approved_by'), // staff_user_id
    rejectedAt: timestamp('rejected_at'),
    rejectionReason: text('rejection_reason'),
    reviewNotes: text('review_notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    productIdIdx: index('product_approvals_product_id_idx').on(table.productId),
    vendorIdIdx: index('product_approvals_vendor_id_idx').on(table.vendorId),
    statusIdx: index('product_approvals_status_idx').on(table.status),
  })
)

/**
 * Relations for Product tables
 */
export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(productCategories, {
    fields: [products.categoryId],
    references: [productCategories.id],
  }),
  images: many(productImages),
  inventory: one(inventory, {
    fields: [products.id],
    references: [inventory.productId],
  }),
  adjustments: many(inventoryAdjustments),
  reviews: many(productReviews),
  approvals: many(productApprovals),
}))

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}))

export const productCategoriesRelations = relations(productCategories, ({ one, many }) => ({
  parent: one(productCategories, {
    fields: [productCategories.parentCategoryId],
    references: [productCategories.id],
  }),
  children: many(productCategories),
  products: many(products),
}))

export const inventoryRelations = relations(inventory, ({ one, many }) => ({
  product: one(products, {
    fields: [inventory.productId],
    references: [products.id],
  }),
  adjustments: many(inventoryAdjustments),
}))

export const inventoryAdjustmentsRelations = relations(inventoryAdjustments, ({ one }) => ({
  product: one(products, {
    fields: [inventoryAdjustments.productId],
    references: [products.id],
  }),
  inventory: one(inventory, {
    fields: [inventoryAdjustments.productId],
    references: [inventory.productId],
  }),
}))

export const productReviewsRelations = relations(productReviews, ({ one }) => ({
  product: one(products, {
    fields: [productReviews.productId],
    references: [products.id],
  }),
}))

export const productApprovalsRelations = relations(productApprovals, ({ one }) => ({
  product: one(products, {
    fields: [productApprovals.productId],
    references: [products.id],
  }),
}))
