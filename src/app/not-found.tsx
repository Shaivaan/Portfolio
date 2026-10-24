import type { Metadata } from "next";
import { RedirectCountdown } from "@/components/site/redirect-countdown";

export const metadata: Metadata = {
  title: "Page not found",
};

// Shown for any URL that doesn't exist (and for notFound() calls)
export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="fade-in flex max-w-lg flex-col gap-5 text-center">
        <p className="font-mono text-sm text-accent">404</p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          It&apos;s great that you are exploring, but don&apos;t be another QA. I already have a few.
        </h1>
        <p className="text-muted">
          Connect with me on Discord: my username is{" "}
          <code className="rounded-md border border-border bg-chip px-1.5 py-0.5 font-mono text-sm text-foreground">
            ss_ag
          </code>
        </p>
        <RedirectCountdown seconds={12} />
      </div>
    </main>
  );
}
