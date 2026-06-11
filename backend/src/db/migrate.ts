import path from 'node:path';
import { fileURLToPath } from 'node:url';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { env } from '../config/env.js';

// Safely derive the absolute path to the migrations folder, regardless of execution directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsFolder = path.resolve(__dirname, 'migrations');

// Enforce a strict single-connection limit for migration safety
const client = postgres(env.DATABASE_URL, { max: 1 });
const db = drizzle(client);

async function runMigrations() {
  try {
    console.log('⏳ Running migrations...');

    await migrate(db, { migrationsFolder });

    console.log('✅ Migrations complete.');
  } catch (error) {
    console.error('❌ Migration failed to execute:', error);
    process.exit(1);
  } finally {
    // Safely closes database connection even if compilation or processing errors occur
    await client.end();
  }
}

await runMigrations();
