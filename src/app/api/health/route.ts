import { sql } from "drizzle-orm";
import { db } from "@/db";

// Quick check that the app can reach Neon: open /api/health
export async function GET() {
  try {
    const result = await db.execute(sql`select now() as time`);
    return Response.json({ ok: true, db: "connected", time: result.rows[0]?.time });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
