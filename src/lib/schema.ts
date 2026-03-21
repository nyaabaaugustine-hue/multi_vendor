/**
 * Drizzle ORM Schema — VaultCommerce / Ecommerce GH
 * Database: Neon (PostgreSQL serverless)
 *
 * Maps 1:1 to the TypeScript interfaces in mock-data.ts.
 * Run migrations with: npx drizzle-kit push
 */

import {
  pgTable,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  pgEnum,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ─── ENUMS ────────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum('user_role', [
  'HIGH_ADMIN', 'VENDOR_ADMIN', 'VENDOR_STAFF', 'CUSTOMER',
]);

export const sellerTypeEnum = pgEnum('seller_type', [
  'Individual', 'Verified Dealer', 'Business Vendor',
]);

export const listingCategoryEnum = pgEnum('listing_category', [
  'Vehicles', 'Property', 'Electronics', 'Home & Furniture',
  'Jobs', 'Services', 'Fashion', 'Agriculture', 'Sports', 'Other',
]);

export const listingStatusEnum = pgEnum('listing_status', [
  'Active', 'Sold', 'Under Review', 'Draft', 'Pending Approval', 'Expired',
]);

export const listingConditionEnum = pgEnum('listing_condition', [
  'New', 'Like New', 'Excellent', 'Good', 'Fair',
]);

export const boostTierEnum = pgEnum('boost_tier', [
  'Standard', 'Premium', 'Elite',
]);

export const orderStatusEnum = pgEnum('order_status', [
  'Pending Payment', 'Escrow Funded', 'In Transit',
  'Inspection', 'Completed', 'Disputed', 'Refunded',
]);

export const transactionTypeEnum = pgEnum('transaction_type', [
  'payment_in', 'payout', 'refund', 'fee', 'escrow_hold', 'escrow_release',
]);

export const transactionStatusEnum = pgEnum('transaction_status', [
  'completed', 'pending', 'failed',
]);

export const disputeStatusEnum = pgEnum('dispute_status', [
  'Open', 'Under Review', 'Resolved', 'Escalated',
]);

export const offerStatusEnum = pgEnum('offer_status', [
  'pending', 'accepted', 'declined', 'countered',
]);

export const notificationTypeEnum = pgEnum('notification_type', [
  'order', 'payment', 'dispute', 'system', 'offer', 'listing',
]);

export const deliveryMethodEnum = pgEnum('delivery_method', [
  'pickup', 'delivery',
]);

export const disputeRaisedByEnum = pgEnum('dispute_raised_by', [
  'buyer', 'seller',
]);

// ─── USERS ────────────────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  role: userRoleEnum('role').notNull().default('CUSTOMER'),
  avatar: text('avatar'),
  fidelityScore: integer('fidelity_score').notNull().default(70),
  phone: text('phone'),
  joinDate: timestamp('join_date').defaultNow(),
  totalOrders: integer('total_orders').notNull().default(0),
  totalSpent: numeric('total_spent', { precision: 15, scale: 2 }).notNull().default('0'),
  isVerified: boolean('is_verified').notNull().default(false),
  responseRate: integer('response_rate').default(0),
  savedListings: text('saved_listings').array(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
  emailIdx: uniqueIndex('users_email_idx').on(t.email),
}));

// ─── VENDORS ──────────────────────────────────────────────────────────────────

export const vendors = pgTable('vendors', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  description: text('description'),
  logoUrl: text('logo_url'),
  bgUrl: text('bg_url'),
  rating: numeric('rating', { precision: 3, scale: 2 }).notNull().default('0'),
  itemsCount: integer('items_count').notNull().default(0),
  fidelityScore: integer('fidelity_score').notNull().default(70),
  joinedYear: text('joined_year'),
  commissionRate: numeric('commission_rate', { precision: 5, scale: 2 }).notNull().default('2.5'),
  monthlyRevenue: numeric('monthly_revenue', { precision: 15, scale: 2 }).notNull().default('0'),
  totalOrders: integer('total_orders').notNull().default(0),
  disputeRate: numeric('dispute_rate', { precision: 5, scale: 2 }).notNull().default('0'),
  ownerId: text('owner_id').references(() => users.id),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ─── LISTINGS ─────────────────────────────────────────────────────────────────

export const listings = pgTable('listings', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  price: numeric('price', { precision: 15, scale: 2 }).notNull(),
  oldPrice: numeric('old_price', { precision: 15, scale: 2 }),
  isNegotiable: boolean('is_negotiable').notNull().default(false),
  category: listingCategoryEnum('category').notNull(),
  subcategory: text('subcategory'),
  location: text('location').notNull(),
  postedAt: text('posted_at').notNull().default('Just Now'),
  postedTimestamp: numeric('posted_timestamp', { precision: 20, scale: 0 }),
  expiresAt: numeric('expires_at', { precision: 20, scale: 0 }),
  imageUrl: text('image_url').notNull(),
  imageHint: text('image_hint'),
  images: text('images').array(),
  vendorId: text('vendor_id').references(() => vendors.id),
  sellerId: text('seller_id').references(() => users.id),
  sellerName: text('seller_name').notNull(),
  sellerType: sellerTypeEnum('seller_type').notNull().default('Individual'),
  sellerRating: numeric('seller_rating', { precision: 3, scale: 2 }),
  sellerIsVerified: boolean('seller_is_verified').notNull().default(false),
  sellerPhone: text('seller_phone'),
  sellerWhatsapp: text('seller_whatsapp'),
  description: text('description').notNull(),
  status: listingStatusEnum('status').notNull().default('Active'),
  condition: listingConditionEnum('condition'),
  specs: text('specs').array(),
  isEscrowProtected: boolean('is_escrow_protected').notNull().default(true),
  isEasyDelivery: boolean('is_easy_delivery').notNull().default(false),
  isFreeShipping: boolean('is_free_shipping').notNull().default(false),
  requiresMultisig: boolean('requires_multisig').notNull().default(false),
  isEmphasis: boolean('is_emphasis').notNull().default(false),
  isBoosted: boolean('is_boosted').notNull().default(false),
  boostTier: boostTierEnum('boost_tier'),
  viewCount: integer('view_count').notNull().default(0),
  saveCount: integer('save_count').notNull().default(0),
  inquiryCount: integer('inquiry_count').notNull().default(0),
  stock: integer('stock'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
  categoryIdx: index('listings_category_idx').on(t.category),
  vendorIdx: index('listings_vendor_idx').on(t.vendorId),
  statusIdx: index('listings_status_idx').on(t.status),
  locationIdx: index('listings_location_idx').on(t.location),
}));

// ─── ORDERS ───────────────────────────────────────────────────────────────────

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  listingId: text('listing_id').references(() => listings.id),
  listingTitle: text('listing_title').notNull(),
  listingImage: text('listing_image'),
  buyerId: text('buyer_id').references(() => users.id),
  sellerId: text('seller_id'),
  sellerName: text('seller_name').notNull(),
  vendorId: text('vendor_id').references(() => vendors.id),
  amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
  platformFee: numeric('platform_fee', { precision: 15, scale: 2 }).notNull(),
  netPayout: numeric('net_payout', { precision: 15, scale: 2 }).notNull(),
  status: orderStatusEnum('status').notNull().default('Pending Payment'),
  escrowProgress: integer('escrow_progress').notNull().default(0),
  deliveryDeadline: timestamp('delivery_deadline'),
  slaTimer: text('sla_timer'),
  slaExpired: boolean('sla_expired').notNull().default(false),
  trackingCode: text('tracking_code'),
  deliveryMethod: deliveryMethodEnum('delivery_method'),
  deliveryAddress: text('delivery_address'),
  notes: text('notes'),
  paystackReference: text('paystack_reference'),
  paystackStatus: text('paystack_status'),
  disputeId: text('dispute_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
  buyerIdx: index('orders_buyer_idx').on(t.buyerId),
  vendorIdx: index('orders_vendor_idx').on(t.vendorId),
  statusIdx: index('orders_status_idx').on(t.status),
}));

// ─── TRANSACTIONS ─────────────────────────────────────────────────────────────

export const transactions = pgTable('transactions', {
  id: text('id').primaryKey(),
  orderId: text('order_id').references(() => orders.id),
  type: transactionTypeEnum('type').notNull(),
  amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
  description: text('description').notNull(),
  status: transactionStatusEnum('status').notNull().default('pending'),
  reference: text('reference'),
  paystackId: text('paystack_id'),
  date: timestamp('date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
  orderIdx: index('transactions_order_idx').on(t.orderId),
  referenceIdx: index('transactions_reference_idx').on(t.reference),
}));

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  type: notificationTypeEnum('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').notNull().default(false),
  actionUrl: text('action_url'),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
  userIdx: index('notifications_user_idx').on(t.userId),
  readIdx: index('notifications_read_idx').on(t.isRead),
}));

// ─── OFFERS ───────────────────────────────────────────────────────────────────

export const offers = pgTable('offers', {
  id: text('id').primaryKey(),
  listingId: text('listing_id').references(() => listings.id).notNull(),
  listingTitle: text('listing_title').notNull(),
  buyerId: text('buyer_id').references(() => users.id).notNull(),
  buyerName: text('buyer_name').notNull(),
  offerAmount: numeric('offer_amount', { precision: 15, scale: 2 }).notNull(),
  originalPrice: numeric('original_price', { precision: 15, scale: 2 }).notNull(),
  message: text('message'),
  status: offerStatusEnum('status').notNull().default('pending'),
  counterAmount: numeric('counter_amount', { precision: 15, scale: 2 }),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
  listingIdx: index('offers_listing_idx').on(t.listingId),
  buyerIdx: index('offers_buyer_idx').on(t.buyerId),
}));

// ─── DISPUTES ─────────────────────────────────────────────────────────────────

export const disputes = pgTable('disputes', {
  id: text('id').primaryKey(),
  orderId: text('order_id').references(() => orders.id).notNull(),
  raisedBy: disputeRaisedByEnum('raised_by').notNull(),
  raisedById: text('raised_by_id').references(() => users.id),
  reason: text('reason').notNull(),
  description: text('description').notNull(),
  status: disputeStatusEnum('status').notNull().default('Open'),
  evidence: text('evidence').array(),
  resolution: text('resolution'),
  resolvedAt: timestamp('resolved_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
  orderIdx: index('disputes_order_idx').on(t.orderId),
  statusIdx: index('disputes_status_idx').on(t.status),
}));

// ─── RELATIONS ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ one, many }) => ({
  vendor: one(vendors, { fields: [users.id], references: [vendors.ownerId] }),
  orders: many(orders),
  notifications: many(notifications),
  offers: many(offers),
}));

export const vendorsRelations = relations(vendors, ({ one, many }) => ({
  owner: one(users, { fields: [vendors.ownerId], references: [users.id] }),
  listings: many(listings),
  orders: many(orders),
}));

export const listingsRelations = relations(listings, ({ one, many }) => ({
  vendor: one(vendors, { fields: [listings.vendorId], references: [vendors.id] }),
  orders: many(orders),
  offers: many(offers),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  listing: one(listings, { fields: [orders.listingId], references: [listings.id] }),
  buyer: one(users, { fields: [orders.buyerId], references: [users.id] }),
  vendor: one(vendors, { fields: [orders.vendorId], references: [vendors.id] }),
  transactions: many(transactions),
  dispute: one(disputes, { fields: [orders.disputeId], references: [disputes.id] }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  order: one(orders, { fields: [transactions.orderId], references: [orders.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const offersRelations = relations(offers, ({ one }) => ({
  listing: one(listings, { fields: [offers.listingId], references: [listings.id] }),
  buyer: one(users, { fields: [offers.buyerId], references: [users.id] }),
}));

export const disputesRelations = relations(disputes, ({ one }) => ({
  order: one(orders, { fields: [disputes.orderId], references: [orders.id] }),
  raisedByUser: one(users, { fields: [disputes.raisedById], references: [users.id] }),
}));

// ─── INFERRED TYPES ───────────────────────────────────────────────────────────

export type DbUser = typeof users.$inferSelect;
export type NewDbUser = typeof users.$inferInsert;
export type DbVendor = typeof vendors.$inferSelect;
export type NewDbVendor = typeof vendors.$inferInsert;
export type DbListing = typeof listings.$inferSelect;
export type NewDbListing = typeof listings.$inferInsert;
export type DbOrder = typeof orders.$inferSelect;
export type NewDbOrder = typeof orders.$inferInsert;
export type DbTransaction = typeof transactions.$inferSelect;
export type NewDbTransaction = typeof transactions.$inferInsert;
export type DbNotification = typeof notifications.$inferSelect;
export type NewDbNotification = typeof notifications.$inferInsert;
export type DbOffer = typeof offers.$inferSelect;
export type NewDbOffer = typeof offers.$inferInsert;
export type DbDispute = typeof disputes.$inferSelect;
export type NewDbDispute = typeof disputes.$inferInsert;
