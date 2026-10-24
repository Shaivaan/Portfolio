import { sql } from "drizzle-orm";
import { db } from "@/db";
import { files } from "@/lib/storage";

// Quick check that the app can reach Neon Postgres and Object Storage: open /api/health
export async function GET() {
  try {
    const result = await db.execute(sql`select now() as time`);
    // Read-only call that fails if the storage endpoint or credentials are wrong
    await files.exists("health-check");
    return Response.json({
      ok: true,
      db: "connected",
      storage: "connected",
      time: result.rows[0]?.time,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
