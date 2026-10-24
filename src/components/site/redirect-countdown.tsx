"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/** Counts down once a second, then sends the visitor to the home page */
export function RedirectCountdown({ seconds }: { seconds: number }) {
  const router = useRouter();
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    if (left <= 0) {
      router.replace("/");
      return;
    }
    const timer = setTimeout(() => setLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [left, router]);

  return (
    <p className="text-sm text-muted" aria-live="polite">
      Sending you back where you should be in{" "}
      <span className="inline-block min-w-[1ch] font-mono font-semibold text-foreground tabular-nums">{left}</span>{" "}
      seconds.{" "}
      <Link href="/" className="text-accent hover:text-accent-hover">
        Go now
      </Link>
    </p>
  );
}
