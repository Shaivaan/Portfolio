import { count } from "drizzle-orm";
import { db } from "@/db";
import { education, experiences, projects, skills, socialLinks } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/dal";

const sections = [
  { label: "Projects", table: projects },
  { label: "Experience", table: experiences },
  { label: "Skills", table: skills },
  { label: "Education", table: education },
  { label: "Social links", table: socialLinks },
] as const;

export default async function AdminHomePage() {
  await requireAdmin();

  const counts = await Promise.all(
    sections.map(async ({ label, table }) => {
      const [row] = await db.select({ value: count() }).from(table);
      return { label, value: row?.value ?? 0 };
    }),
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Dashboard</h1>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {counts.map(({ label, value }) => (
          <li key={label} className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
            <p className="text-sm text-neutral-500">{label}</p>
            <p className="text-2xl font-semibold">{value}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
