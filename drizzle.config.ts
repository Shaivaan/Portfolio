import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    // Migrations need a direct (non-pooled) connection; verify-full: see src/db/index.ts
    url: process.env.DATABASE_URL_UNPOOLED!.replace("sslmode=require", "sslmode=verify-full"),
  },
});
