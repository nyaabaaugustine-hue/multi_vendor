'use server';

import { db, listings, DB_ENABLED } from './db';
import { desc, eq } from 'drizzle-orm';

export async function getListingsAction() {
  if (!DB_ENABLED) {
    return { success: true, data: [] }; // Return empty, UI will fallback to mock
  }
  try {
    const data = await db.select().from(listings).orderBy(desc(listings.id));
    return { success: true, data };
  } catch (error) {
    console.error('Failed to fetch listings:', error);
    return { success: false, error: 'Failed to fetch listings.' };
  }
}

export async function getListingByIdAction(id: string) {
  if (!DB_ENABLED) {
    return { success: false, error: 'Database disabled.' };
  }
  try {
    const data = await db.select().from(listings).where(eq(listings.id, id)).limit(1);
    return { success: true, data: data[0] || null };
  } catch (error) {
    console.error('Failed to fetch listing:', error);
    return { success: false, error: 'Failed to fetch listing.' };
  }
}

export async function createListingAction(data: {
  title: string;
  category: any;
  price: string;
  description: string;
  location: string;
  condition: any;
}) {
  if (!DB_ENABLED) {
    return { success: false, error: 'Database is not connected. Please check your DATABASE_URL.' };
  }
  try {
    const id = crypto.randomUUID();
    await db.insert(listings).values({
      id,
      title: data.title,
      price: data.price,
      category: data.category,
      location: data.location,
      description: data.description,
      condition: data.condition,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop', // Placeholder image
      sellerName: 'Demo User', // Placeholder for now
      sellerIsVerified: true,
      isEscrowProtected: true,
      postedAt: 'Just Now',
      status: 'Active',
    });
    return { success: true, id };
  } catch (error) {
    console.error('Failed to create listing:', error);
    return { success: false, error: 'Failed to create listing in database.' };
  }
}
