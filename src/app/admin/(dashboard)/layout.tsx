import Link from "next/link";
import { logout } from "../actions";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/admin" className="font-semibold">
            Portfolio Admin
          </Link>
          <form action={logout}>
            <button type="submit" className="text-sm text-neutral-600 hover:underline dark:text-neutral-400">
              Log out
            </button>
          </form>
        </div>
      </header>
      {/* Pages read the session and the DB, so each streams in behind its loading.tsx */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
