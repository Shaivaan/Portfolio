"use client";

import Link from "next/link";
import { useTransition } from "react";

type Props = {
  editHref: string;
  label: string;
  isVisible: boolean;
  onToggleVisible: () => Promise<void>;
  onDelete: () => Promise<void>;
};

/** Edit / Show-Hide / Delete controls for one row of an admin list */
export function RowActions({ editHref, label, isVisible, onToggleVisible, onDelete }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-3 text-sm">
      <Link href={editHref} className="hover:underline">
        Edit
      </Link>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(onToggleVisible)}
        className="text-neutral-600 hover:underline disabled:opacity-50 dark:text-neutral-400"
      >
        {isVisible ? "Hide" : "Show"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (confirm(`Delete "${label}"? This can't be undone.`)) startTransition(onDelete);
        }}
        className="text-red-600 hover:underline disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
