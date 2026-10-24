"use client";

import Link from "next/link";
import { createContext, startTransition, use, useActionState, useEffect, useRef } from "react";
import type { FormState } from "@/lib/admin/form";

const FormStateContext = createContext<FormState>({});

/** Field-level error message for `name` from the last submit, if any */
export function useFieldError(name: string) {
  return use(FormStateContext).fieldErrors?.[name];
}

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  cancelHref?: string;
  submitLabel?: string;
  pendingLabel?: string;
  /** Clear every field after a successful submit (for "add another" style forms) */
  resetOnSuccess?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function ActionForm({
  action,
  cancelHref,
  submitLabel = "Save",
  pendingLabel = "Saving…",
  resetOnSuccess = false,
  className = "max-w-2xl",
  children,
}: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const formRef = useRef<HTMLFormElement>(null);

  // After a successful save that stays on the page, clear chosen files and "Remove" ticks
  // so saving again doesn't upload or delete the same file twice
  useEffect(() => {
    if (!state.message || !formRef.current) return;
    if (resetOnSuccess) {
      formRef.current.reset();
      return;
    }
    for (const input of formRef.current.querySelectorAll<HTMLInputElement>('input[type="file"]')) {
      input.value = "";
    }
    for (const input of formRef.current.querySelectorAll<HTMLInputElement>('input[name$="Remove"]')) {
      input.checked = false;
    }
  }, [state, resetOnSuccess]);

  // Submitting through startTransition (instead of <form action>) keeps what was typed
  // when the server returns validation errors; React would otherwise reset the form.
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  return (
    <FormStateContext value={state}>
      <form ref={formRef} onSubmit={handleSubmit} className={`flex flex-col gap-5 ${className}`}>
        {children}

        {state.error && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {state.error}
          </p>
        )}
        {state.message && !pending && (
          <p role="status" className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
            {state.message}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900"
          >
            {pending ? pendingLabel : submitLabel}
          </button>
          {cancelHref && (
            <Link href={cancelHref} className="text-sm text-neutral-600 hover:underline dark:text-neutral-400">
              Cancel
            </Link>
          )}
        </div>
      </form>
    </FormStateContext>
  );
}
