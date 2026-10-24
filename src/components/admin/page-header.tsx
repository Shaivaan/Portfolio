import Link from "next/link";

export function PageHeader({
  title,
  description,
  newHref,
  backHref,
}: {
  title: string;
  description?: string;
  newHref?: string;
  backHref?: string;
}) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        {backHref && (
          <Link href={backHref} className="mb-1 inline-block text-sm text-neutral-500 hover:underline">
            ← Back
          </Link>
        )}
        <h1 className="text-2xl font-semibold">{title}</h1>
        {description && <p className="mt-1 text-sm text-neutral-500">{description}</p>}
      </div>
      {newHref && (
        <Link
          href={newHref}
          className="shrink-0 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
        >
          + Add new
        </Link>
      )}
    </div>
  );
}

/** Table shell shared by the admin list pages */
export function ListTable({
  columns,
  empty,
  children,
}: {
  columns: string[];
  empty: boolean;
  children: React.ReactNode;
}) {
  if (empty) {
    return (
      <p className="rounded-lg border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500 dark:border-neutral-700">
        Nothing here yet. Use “Add new” to create the first one.
      </p>
    );
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-neutral-200 text-neutral-500 dark:border-neutral-800">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-2 font-medium">
                {column}
              </th>
            ))}
            <th className="px-4 py-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">{children}</tbody>
      </table>
    </div>
  );
}

export function HiddenBadge({ visible }: { visible: boolean }) {
  if (visible) return null;
  return (
    <span className="ml-2 rounded bg-neutral-200 px-1.5 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
      hidden
    </span>
  );
}
