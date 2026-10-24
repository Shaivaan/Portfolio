import Link from "next/link";
import { logout } from "../actions";
import { adminSections } from "./admin-sections";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/admin" className="font-semibold">
            Portfolio Admin
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" target="_blank" className="text-neutral-600 hover:underline dark:text-neutral-400">
              View site ↗
            </Link>
            <form action={logout}>
              <button type="submit" className="text-neutral-600 hover:underline dark:text-neutral-400">
                Log out
              </button>
            </form>
          </div>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-4 overflow-x-auto px-4 pb-2 text-sm">
          {adminSections.map((section) => (
            <Link key={section.href} href={section.href} className="shrink-0 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
              {section.label}
            </Link>
          ))}
        </nav>
      </header>
      {/* Pages read the session and the DB, so each streams in behind a loading.tsx */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
