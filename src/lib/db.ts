/**
 * Neon Database Connection — VaultCommerce
 *
 * Uses @neondatabase/serverless HTTP driver — required for
 * Vercel serverless functions (no persistent TCP connections).
 *
 * Local dev: same DATABASE_URL points to your Neon project.
 * Production: Vercel injects DATABASE_URL automatically via
 * the Neon integration in the Vercel marketplace.
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

export const DB_ENABLED = !!process.env.DATABASE_URL;

// Initialize with a dummy if disabled to prevent module evaluation crashes
const connectionString = process.env.DATABASE_URL || 'postgresql://user:pass@localhost:5432/db';

if (!DB_ENABLED && typeof window === 'undefined') {
  console.warn(
    'DATABASE_URL is not set. Database features will be disabled. ' +
    'Copy it from your Neon project dashboard and add it to .env.local'
  );
}

// Create the Neon HTTP client
const sql = neon(connectionString);

// Create the Drizzle ORM instance
export const db = drizzle(sql, { schema });

// Re-export schema for convenience
export * from './schema';
