import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  pgEnum,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

/**
 * User Roles Enum
 * Defines the different user roles in the system
 */
export const userRoleEnum = pgEnum('user_role', [
  'customer',
  'vendor',
  'staff',
  'admin',
  'super_admin',
])

/**
 * Users Table
 * Stores all registered users across all portals
 */
export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    phone: varchar('phone', { length: 20 }),
    passwordHash: text('password_hash').notNull(),
    firstName: varchar('first_name', { length: 100 }),
    lastName: varchar('last_name', { length: 100 }),
    role: userRoleEnum('role').default('customer').notNull(),
    isEmailVerified: boolean('is_email_verified').default(false),
    isPhoneVerified: boolean('is_phone_verified').default(false),
    isMfaEnabled: boolean('is_mfa_enabled').default(false),
    mfaMethod: varchar('mfa_method', { length: 50 }), // 'email', 'sms', 'authenticator'
    lastLoginAt: timestamp('last_login_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex('users_email_idx').on(table.email),
    phoneIdx: index('users_phone_idx').on(table.phone),
    roleIdx: index('users_role_idx').on(table.role),
  })
)

/**
 * User Profiles Table
 * Stores extended profile information for users
 */
export const userProfiles = pgTable(
  'user_profiles',
  {
    id: serial('id').primaryKey(),
    userId: serial('user_id').notNull(),
    profilePictureUrl: text('profile_picture_url'),
    bio: text('bio'),
    dateOfBirth: timestamp('date_of_birth'),
    gender: varchar('gender', { length: 20 }),
    nationality: varchar('nationality', { length: 100 }),
    preferredLanguage: varchar('preferred_language', { length: 10 }).default('en'),
    timezone: varchar('timezone', { length: 50 }).default('UTC'),
    notificationPreferences: text('notification_preferences'), // JSON
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('user_profiles_user_id_idx').on(table.userId),
  })
)

/**
 * User Addresses Table
 * Stores multiple shipping and billing addresses per user
 */
export const userAddresses = pgTable(
  'user_addresses',
  {
    id: serial('id').primaryKey(),
    userId: serial('user_id').notNull(),
    type: varchar('type', { length: 20 }).notNull(), // 'shipping', 'billing', 'both'
    fullName: varchar('full_name', { length: 255 }).notNull(),
    phoneNumber: varchar('phone_number', { length: 20 }).notNull(),
    streetAddress: text('street_address').notNull(),
    city: varchar('city', { length: 100 }).notNull(),
    state: varchar('state', { length: 100 }),
    postalCode: varchar('postal_code', { length: 20 }).notNull(),
    country: varchar('country', { length: 100 }).notNull(),
    isDefault: boolean('is_default').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('user_addresses_user_id_idx').on(table.userId),
  })
)

/**
 * User Sessions Table
 * Tracks active login sessions with device and token information
 */
export const userSessions = pgTable(
  'user_sessions',
  {
    id: serial('id').primaryKey(),
    userId: serial('user_id').notNull(),
    sessionToken: varchar('session_token', { length: 255 }).notNull().unique(),
    refreshToken: varchar('refresh_token', { length: 255 }),
    deviceInfo: text('device_info'), // JSON: browser, OS, device type
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: text('user_agent'),
    expiresAt: timestamp('expires_at').notNull(),
    lastActivityAt: timestamp('last_activity_at').defaultNow(),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('user_sessions_user_id_idx').on(table.userId),
    tokenIdx: uniqueIndex('user_sessions_token_idx').on(table.sessionToken),
  })
)

/**
 * User Password Resets Table
 * Tracks password reset tokens and their status
 */
export const userPasswordResets = pgTable(
  'user_password_resets',
  {
    id: serial('id').primaryKey(),
    userId: serial('user_id').notNull(),
    resetToken: varchar('reset_token', { length: 255 }).notNull().unique(),
    expiresAt: timestamp('expires_at').notNull(),
    usedAt: timestamp('used_at'),
    isUsed: boolean('is_used').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('user_password_resets_user_id_idx').on(table.userId),
    tokenIdx: uniqueIndex('user_password_resets_token_idx').on(table.resetToken),
  })
)

/**
 * MFA Tokens Table
 * Stores OTP codes and recovery codes for multi-factor authentication
 */
export const mfaTokens = pgTable(
  'mfa_tokens',
  {
    id: serial('id').primaryKey(),
    userId: serial('user_id').notNull(),
    type: varchar('type', { length: 50 }).notNull(), // 'otp', 'recovery', 'authenticator'
    token: varchar('token', { length: 255 }).notNull(),
    secret: text('secret'), // For authenticator apps (encrypted)
    isUsed: boolean('is_used').default(false),
    usedAt: timestamp('used_at'),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('mfa_tokens_user_id_idx').on(table.userId),
    tokenIdx: index('mfa_tokens_token_idx').on(table.token),
  })
)

/**
 * User Activity Logs Table
 * Tracks user actions for auditing and fraud detection
 */
export const userActivityLogs = pgTable(
  'user_activity_logs',
  {
    id: serial('id').primaryKey(),
    userId: serial('user_id').notNull(),
    action: varchar('action', { length: 100 }).notNull(), // 'login', 'logout', 'purchase', 'profile_update'
    description: text('description'),
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: text('user_agent'),
    metadata: text('metadata'), // JSON: additional context
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('user_activity_logs_user_id_idx').on(table.userId),
    actionIdx: index('user_activity_logs_action_idx').on(table.action),
  })
)

/**
 * Relations for Users
 */
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  addresses: many(userAddresses),
  sessions: many(userSessions),
  passwordResets: many(userPasswordResets),
  mfaTokens: many(mfaTokens),
  activityLogs: many(userActivityLogs),
}))

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}))

export const userAddressesRelations = relations(userAddresses, ({ one }) => ({
  user: one(users, {
    fields: [userAddresses.userId],
    references: [users.id],
  }),
}))

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id],
  }),
}))

export const userPasswordResetsRelations = relations(userPasswordResets, ({ one }) => ({
  user: one(users, {
    fields: [userPasswordResets.userId],
    references: [users.id],
  }),
}))

export const mfaTokensRelations = relations(mfaTokens, ({ one }) => ({
  user: one(users, {
    fields: [mfaTokens.userId],
    references: [users.id],
  }),
}))

export const userActivityLogsRelations = relations(userActivityLogs, ({ one }) => ({
  user: one(users, {
    fields: [userActivityLogs.userId],
    references: [users.id],
  }),
}))
