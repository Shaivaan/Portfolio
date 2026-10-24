import "server-only";

// Failed-login limiter, kept in memory. On Vercel each function instance has its own
// memory, so this slows down guessing rather than giving a hard global limit.

const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;

const failures = new Map<string, { count: number; resetAt: number }>();

export function isLocked(ip: string) {
  const entry = failures.get(ip);
  if (!entry) return false;
  if (Date.now() > entry.resetAt) {
    failures.delete(ip);
    return false;
  }
  return entry.count >= MAX_FAILURES;
}

export function recordFailure(ip: string) {
  const now = Date.now();
  const entry = failures.get(ip);
  if (!entry || now > entry.resetAt) {
    failures.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

export function clearFailures(ip: string) {
  failures.delete(ip);
}
