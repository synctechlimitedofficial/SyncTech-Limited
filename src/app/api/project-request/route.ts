import { NextResponse } from "next/server";
import {
  buildReference,
  hasErrors,
  validateProjectRequest,
} from "@/lib/project-request";
import { deliverProjectRequest, sendAcknowledgement } from "@/lib/notify";
import { checkRateLimit, clientKey, screenSubmission } from "@/lib/antispam";

// Needs the Node runtime for SMTP and the filesystem fallback.
export const runtime = "nodejs";

/**
 * Project enquiry endpoint.
 *
 * Order matters: rate limit (cheapest rejection) → parse → bot screen →
 * validate → deliver → acknowledge. The response only reports success if at
 * least one channel actually accepted the enquiry, so a prospective client is
 * never told "received" when nothing was stored or sent.
 */
export async function POST(request: Request) {
  const rate = checkRateLimit(clientKey(request));
  if (!rate.allowed) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Too many requests from this connection. Please wait a few minutes and try again.",
      },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } },
    );
  }

  let payload: Record<string, unknown>;

  try {
    payload = ((await request.json()) ?? {}) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  const spam = screenSubmission(payload);

  if (spam.drop) {
    // Return a normal-looking success so bots don't learn what tripped them,
    // but deliver nothing. Logged so a false positive is still discoverable.
    const reference = buildReference();
    console.warn("[project-request] dropped as bot", {
      reference,
      reason: spam.warning,
      email: String(payload.email ?? "").slice(0, 80),
    });
    return NextResponse.json({ ok: true, reference });
  }

  const { errors, data } = validateProjectRequest(
    payload as Record<string, string>,
  );

  if (hasErrors(errors)) {
    return NextResponse.json(
      { ok: false, message: "Some fields need attention.", errors },
      { status: 422 },
    );
  }

  const reference = buildReference();
  const results = await deliverProjectRequest(data, reference, spam.warning);
  const delivered = results.filter((result) => result.ok);

  if (delivered.length === 0) {
    // Log loudly: this is the one failure mode that silently costs leads.
    console.error("[project-request] every delivery channel failed", {
      reference,
      email: data.email,
      results,
    });
    return NextResponse.json(
      {
        ok: false,
        message:
          "We couldn't record your request just now. Please try again, or contact us directly.",
      },
      { status: 502 },
    );
  }

  // The customer's copy. A failure here must not change what they see —
  // their enquiry is already safely delivered.
  const ack = await sendAcknowledgement(data, reference).catch(() => ({
    ok: false,
    detail: "threw",
  }));

  console.info("[project-request] delivered", {
    reference,
    // Include the detail on successes too — that's where "succeeded on attempt 3"
    // shows up, which is the only sign a receiver is flaky.
    via: delivered.map((r) => (r.detail ? `${r.channel} (${r.detail})` : r.channel)),
    failed: results.filter((r) => !r.ok).map((r) => `${r.channel}: ${r.detail}`),
    acknowledged: ack ? ack.ok : "skipped",
    warning: spam.warning,
  });

  return NextResponse.json({ ok: true, reference });
}
