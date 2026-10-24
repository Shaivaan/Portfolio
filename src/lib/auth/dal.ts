import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { SESSION_COOKIE, verifySessionToken } from "./session";

// Call at the top of every admin page and every admin Server Action.
// The proxy only redirects early; this is the check that actually protects data.
export const requireAdmin = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    redirect("/admin/login");
  }
});
