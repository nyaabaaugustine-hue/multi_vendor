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

let db: ReturnType<typeof drizzle> | any;

if (typeof window === 'undefined') {
  if (!DB_ENABLED) {
    console.warn(
      'DATABASE_URL is not set. Database features will be disabled. ' +
      'Copy it from your Neon project dashboard and add it to .env.local'
    );
  }
  // Create the Neon HTTP client
  const sql = neon(connectionString);
  db = drizzle(sql, { schema });
} else {
  // Client-side fallback to prevent crash if imported
  db = {};
}

export { db };

// Re-export schema for convenience
export * from './schema';
