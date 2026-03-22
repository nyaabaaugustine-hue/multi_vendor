/**
 * Database Seed Script — VaultCommerce
 *
 * Migrates all mock data from mock-data.ts into your Neon database.
 * Run once after your first `npx drizzle-kit push`:
 *
 *   npx tsx src/lib/seed.ts
 *
 * Safe to re-run — uses onConflictDoNothing() so existing rows are skipped.
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import {
  MOCK_USERS,
  VENDORS,
  LISTINGS,
  MOCK_ORDERS,
  MOCK_TRANSACTIONS,
  MOCK_NOTIFICATIONS,
  MOCK_OFFERS,
  MOCK_DISPUTES,
} from './mock-data';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log('🌱 Seeding VaultCommerce database...\n');

  // ── Users ──────────────────────────────────────────────────────────────────
  console.log('👤 Seeding users...');
  await db.insert(schema.users).values(
    MOCK_USERS.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      avatar: u.avatar,
      fidelityScore: u.fidelityScore,
      phone: u.phone,
      totalOrders: u.totalOrders ?? 0,
      totalSpent: String(u.totalSpent ?? 0),
      isVerified: u.isVerified ?? false,
      responseRate: u.responseRate ?? 0,
      savedListings: u.savedListings ?? [],
    }))
  ).onConflictDoNothing();
  console.log(`  ✓ ${MOCK_USERS.length} users`);

  // ── Vendors ────────────────────────────────────────────────────────────────
  console.log('🏪 Seeding vendors...');
  await db.insert(schema.vendors).values(
    VENDORS.map(v => ({
      id: v.id,
      name: v.name,
      category: v.category,
      description: v.description,
      logoUrl: v.logoUrl,
      bgUrl: v.bgUrl,
      rating: String(v.rating),
      itemsCount: v.itemsCount,
      fidelityScore: v.fidelityScore,
      joinedYear: v.joinedYear,
      commissionRate: String(v.commissionRate),
      monthlyRevenue: String(v.monthlyRevenue),
      totalOrders: v.totalOrders,
      disputeRate: String(v.disputeRate),
      isActive: true,
    }))
  ).onConflictDoNothing();
  console.log(`  ✓ ${VENDORS.length} vendors`);

  // ── Listings ───────────────────────────────────────────────────────────────
  console.log('📋 Seeding listings...');
  await db.insert(schema.listings).values(
    LISTINGS.map(l => ({
      id: l.id,
      title: l.title,
      price: String(l.price),
      oldPrice: l.oldPrice ? String(l.oldPrice) : null,
      isNegotiable: l.isNegotiable,
      category: l.category,
      subcategory: l.subcategory,
      location: l.location,
      postedAt: l.postedAt,
      postedTimestamp: String(l.postedTimestamp),
      imageUrl: l.imageUrl,
      imageHint: l.imageHint,
      images: l.images ?? [],
      vendorId: l.vendorId,
      sellerName: l.seller.name,
      sellerType: l.seller.type,
      sellerRating: String(l.seller.rating),
      sellerIsVerified: l.seller.isVerified,
      sellerPhone: l.seller.phone,
      sellerWhatsapp: l.seller.whatsapp,
      description: l.description,
      status: l.status,
      condition: l.condition as any,
      specs: l.specs ?? [],
      isEscrowProtected: l.isEscrowProtected,
      isEasyDelivery: l.isEasyDelivery ?? false,
      isFreeShipping: l.isFreeShipping ?? false,
      requiresMultisig: l.requiresMultisig ?? false,
      isEmphasis: l.isEmphasis ?? false,
      isBoosted: l.isBoosted ?? false,
      boostTier: l.boostTier as any,
      viewCount: l.viewCount ?? 0,
      saveCount: l.saveCount ?? 0,
      inquiryCount: l.inquiryCount ?? 0,
      stock: l.stock,
    }))
  ).onConflictDoNothing();
  console.log(`  ✓ ${LISTINGS.length} listings`);

  // ── Orders ─────────────────────────────────────────────────────────────────
  console.log('📦 Seeding orders...');
  await db.insert(schema.orders).values(
    MOCK_ORDERS.map(o => ({
      id: o.id,
      listingId: o.listingId,
      listingTitle: o.listingTitle,
      listingImage: o.listingImage,
      buyerId: o.buyerId,
      sellerId: o.sellerId,
      sellerName: o.sellerName,
      vendorId: o.vendorId,
      amount: String(o.amount),
      platformFee: String(o.platformFee),
      netPayout: String(o.netPayout),
      status: o.status,
      escrowProgress: o.escrowProgress,
      slaTimer: o.slaTimer,
      slaExpired: o.slaExpired ?? false,
      trackingCode: o.trackingCode,
      deliveryMethod: o.deliveryMethod as any,
      deliveryAddress: o.deliveryAddress,
      notes: o.notes,
    }))
  ).onConflictDoNothing();
  console.log(`  ✓ ${MOCK_ORDERS.length} orders`);

  // ── Transactions ───────────────────────────────────────────────────────────
  console.log('💸 Seeding transactions...');
  await db.insert(schema.transactions).values(
    MOCK_TRANSACTIONS.map(t => ({
      id: t.id,
      orderId: t.orderId,
      type: t.type,
      amount: String(t.amount),
      description: t.description,
      status: t.status,
      reference: t.reference,
    }))
  ).onConflictDoNothing();
  console.log(`  ✓ ${MOCK_TRANSACTIONS.length} transactions`);

  // ── Notifications ──────────────────────────────────────────────────────────
  console.log('🔔 Seeding notifications...');
  // Attach all notifications to the customer user (u4)
  await db.insert(schema.notifications).values(
    MOCK_NOTIFICATIONS.map(n => ({
      id: n.id,
      userId: 'u4',
      type: n.type,
      title: n.title,
      message: n.message,
      isRead: n.isRead,
      actionUrl: n.actionUrl,
    }))
  ).onConflictDoNothing();
  console.log(`  ✓ ${MOCK_NOTIFICATIONS.length} notifications`);

  // ── Offers ─────────────────────────────────────────────────────────────────
  console.log('🏷️  Seeding offers...');
  await db.insert(schema.offers).values(
    MOCK_OFFERS.map(o => ({
      id: o.id,
      listingId: o.listingId,
      listingTitle: o.listingTitle,
      buyerId: 'u4',
      buyerName: o.buyerName,
      offerAmount: String(o.offerAmount),
      originalPrice: String(o.originalPrice),
      message: o.message,
      status: o.status,
      counterAmount: o.counterAmount ? String(o.counterAmount) : null,
      expiresAt: new Date(o.expiresAt),
    }))
  ).onConflictDoNothing();
  console.log(`  ✓ ${MOCK_OFFERS.length} offers`);

  // ── Disputes ───────────────────────────────────────────────────────────────
  console.log('⚠️  Seeding disputes...');
  await db.insert(schema.disputes).values(
    MOCK_DISPUTES.map(d => ({
      id: d.id,
      orderId: d.orderId,
      raisedBy: d.raisedBy,
      raisedById: 'u4',
      reason: d.reason,
      description: d.description,
      status: d.status,
      evidence: d.evidence ?? [],
      resolution: d.resolution,
    }))
  ).onConflictDoNothing();
  console.log(`  ✓ ${MOCK_DISPUTES.length} disputes`);

  console.log('\n✅ Seed complete. All mock data is now in the database.\n');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
