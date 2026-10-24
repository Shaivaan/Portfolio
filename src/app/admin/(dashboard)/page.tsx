import { count } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { education, experiences, profile, projects, skills, socialLinks } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/dal";
import { adminSections } from "./admin-sections";

const tables = {
  "/admin/profile": profile,
  "/admin/projects": projects,
  "/admin/experience": experiences,
  "/admin/skills": skills,
  "/admin/education": education,
  "/admin/social-links": socialLinks,
} as const;

export default async function AdminHomePage() {
  await requireAdmin();

  const cards = await Promise.all(
    adminSections.map(async (section) => {
      const [row] = await db.select({ value: count() }).from(tables[section.href]);
      return { ...section, count: row?.value ?? 0 };
    }),
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Dashboard</h1>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <li key={card.href}>
            <Link
              href={card.href}
              className="block rounded-lg border border-neutral-200 p-4 transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
            >
              <p className="text-sm text-neutral-500">{card.label}</p>
              <p className="text-2xl font-semibold">
                {card.href === "/admin/profile" ? (card.count > 0 ? "✓" : "Not set") : card.count}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
