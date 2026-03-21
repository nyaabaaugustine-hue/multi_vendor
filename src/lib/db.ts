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

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is not set. ' +
    'Copy it from your Neon project dashboard and add it to .env.local'
  );
}

// Create the Neon HTTP client — stateless, no connection pooling needed
const sql = neon(process.env.DATABASE_URL);

// Create the Drizzle ORM instance with full schema awareness
export const db = drizzle(sql, { schema });

// Re-export schema for convenience so callers don't need two imports
export * from './schema';
