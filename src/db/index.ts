import "server-only";
import { attachDatabasePool } from "@vercel/functions";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Run `npx neon@latest env pull` to fill .env.local");
}

// Neon's URLs use sslmode=require, which pg warns will mean weaker checks in pg v9.
// Ask for full certificate verification explicitly (what pg already does today).
const connectionString = process.env.DATABASE_URL.replace("sslmode=require", "sslmode=verify-full");

// Pooled connection for app queries. On Vercel (Fluid compute), attachDatabasePool
// closes idle connections before a function instance is suspended.
const pool = new Pool({
  connectionString,
  // Locally the DB is far away (opening a connection takes seconds), so keep idle
  // connections for 5 min instead of pg's default 10 s while developing
  idleTimeoutMillis: process.env.NODE_ENV === "development" ? 5 * 60_000 : undefined,
});
attachDatabasePool(pool);

export const db = drizzle({ client: pool, schema, casing: "snake_case" });
