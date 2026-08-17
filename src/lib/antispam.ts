/**
 * Cheap, invisible bot defences for the public enquiry form.
 *
 * Design rule throughout: **never silently lose a real lead.** A signal strong
 * enough to be certain (honeypot) drops the submission; a soft signal (suspiciously
 * fast) only annotates it, so a human who trips it still gets through and you can
 * judge for yourself.
 */

/** Field name a human never sees and browser autofill won't recognise. */
export const HONEYPOT_FIELD = "sy_ref_code";

/** Timestamp the form records on mount, so we can measure fill duration. */
export const TIMING_FIELD = "sy_started_at";

/** Below this, a human almost certainly didn't type the description. */
const MIN_FILL_MS = 2500;

export type SpamVerdict = {
  /** Certain bot — accept the HTTP request but don't deliver anything. */
  drop: boolean;
  /** Soft signal worth surfacing on the notification. */
  warning: string | null;
};

export function screenSubmission(payload: Record<string, unknown>): SpamVerdict {
  const honeypot = String(payload[HONEYPOT_FIELD] ?? "").trim();
  if (honeypot.length > 0) {
    return { drop: true, warning: "honeypot filled" };
  }

  const startedAt = Number(payload[TIMING_FIELD] ?? 0);
  if (Number.isFinite(startedAt) && startedAt > 0) {
    const elapsed = Date.now() - startedAt;
    // Negative elapsed means a tampered or clock-skewed timestamp — note it, don't drop.
    if (elapsed < 0) {
      return { drop: false, warning: "submission timestamp is in the future" };
    }
    if (elapsed < MIN_FILL_MS) {
      return {
        drop: false,
        warning: `form completed in ${(elapsed / 1000).toFixed(1)}s — unusually fast`,
      };
    }
  }

  return { drop: false, warning: null };
}

/* -------------------------------------------------------------------------- */
/* Rate limiting                                                              */
/* -------------------------------------------------------------------------- */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

/**
 * In-process sliding window. Good enough for a single-instance deploy, which is
 * how this site is meant to run. Behind a load balancer or on serverless each
 * instance counts separately — move to Redis or your edge/WAF if you need a
 * shared limit.
 */
const hits = new Map<string, number[]>();

/** Stops the map growing without bound on a long-lived server. */
function prune(now: number) {
  if (hits.size < 500) return;
  for (const [key, times] of hits) {
    const kept = times.filter((t) => now - t < WINDOW_MS);
    if (kept.length === 0) hits.delete(key);
    else hits.set(key, kept);
  }
}

export type RateVerdict = {
  allowed: boolean;
  /** Seconds until the caller may retry — for the Retry-After header. */
  retryAfter: number;
};

export function checkRateLimit(key: string): RateVerdict {
  const now = Date.now();
  prune(now);

  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    const oldest = Math.min(...recent);
    hits.set(key, recent);
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((WINDOW_MS - (now - oldest)) / 1000)),
    };
  }

  recent.push(now);
  hits.set(key, recent);
  return { allowed: true, retryAfter: 0 };
}

/**
 * Best-effort client identity. `x-forwarded-for` is only trustworthy behind a
 * proxy you control — set one up in production, or this degrades to a shared
 * bucket, which fails closed (stricter) rather than open.
 */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
