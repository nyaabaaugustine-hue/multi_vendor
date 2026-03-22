import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export default defineConfig({
  // Point to your schema file
  schema: './src/lib/schema.ts',

  // Where drizzle-kit writes generated SQL migration files
  out: './drizzle',

  // Neon uses PostgreSQL
  dialect: 'postgresql',

  dbCredentials: {
    // Reads from .env.local automatically during drizzle-kit commands
    url: process.env.DATABASE_URL!,
  },

  // Log every SQL statement drizzle-kit generates — helpful during dev
  verbose: true,

  // Strict mode: drizzle-kit will error if schema changes would cause data loss
  strict: true,
});
