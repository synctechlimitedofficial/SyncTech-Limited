import { createHmac } from "node:crypto";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
// Explicit .ts extensions so `scripts/check-notify.mts` can import this module
// directly under Node's native TypeScript support, which requires them.
// Next/Turbopack resolves them fine.
import { getMailConfig, sendMail } from "./mail.ts";
import type { ProjectRequest } from "./project-request.ts";

export type Channel = "email" | "telegram" | "webhook" | "file";

export type DeliveryResult = {
  channel: Channel;
  ok: boolean;
  detail?: string;
};

const LOG_FILE = "project-requests.jsonl";

function logDir() {
  const dir = process.env.ENQUIRY_LOG_DIR || ".data";
  // turbopackIgnore: this is a runtime data path, not a module to bundle.
  return path.resolve(/* turbopackIgnore: true */ process.cwd(), dir);
}

function field(label: string, value: string) {
  return `${label}: ${value || "—"}`;
}

/** Plain-text body — the version that survives every mail client. */
export function formatText(
  data: ProjectRequest,
  reference: string,
  warning?: string | null,
) {
  return [
    `New project request — ${reference}`,
    warning ? `\n⚠ ${warning}\n` : "",
    field("Name", data.fullName),
    field("Company", data.companyName),
    field("Email", data.email),
    field("Phone", data.phone),
    field("Preferred contact", data.contactMethod),
    "",
    field("Service required", data.service),
    field("Project type", data.projectType),
    field("Budget range", data.budget),
    "",
    "Project description:",
    data.description,
    "",
    `Received: ${new Date().toISOString()}`,
  ]
    .filter((line) => line !== "")
    .join("\n");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatHtml(
  data: ProjectRequest,
  reference: string,
  warning?: string | null,
) {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 14px 6px 0;color:#6b7793;font:14px system-ui;white-space:nowrap">${label}</td>` +
    `<td style="padding:6px 0;color:#111827;font:14px system-ui">${escapeHtml(value) || "—"}</td></tr>`;

  const banner = warning
    ? `<p style="margin:0 0 16px;padding:10px 14px;background:#fff7ed;border:1px solid #fdba74;border-radius:8px;color:#9a3412;font:13px system-ui">⚠ ${escapeHtml(warning)}</p>`
    : "";

  return `<div style="font:14px system-ui;color:#111827;max-width:640px">
    <h2 style="margin:0 0 4px">New project request</h2>
    <p style="margin:0 0 18px;color:#6b7793">Reference ${escapeHtml(reference)}</p>
    ${banner}
    <table style="border-collapse:collapse">
      ${row("Name", data.fullName)}
      ${row("Company", data.companyName)}
      ${row("Email", data.email)}
      ${row("Phone", data.phone)}
      ${row("Preferred contact", data.contactMethod)}
      ${row("Service required", data.service)}
      ${row("Project type", data.projectType)}
      ${row("Budget range", data.budget)}
    </table>
    <h3 style="margin:22px 0 6px">Project description</h3>
    <p style="margin:0;white-space:pre-wrap;line-height:1.6">${escapeHtml(data.description)}</p>
    <p style="margin:24px 0 0;color:#6b7793;font-size:13px">
      Reply to this email to answer ${escapeHtml(data.fullName)} directly.
    </p>
  </div>`;
}

/* -------------------------------------------------------------------------- */
/* Channels                                                                   */
/* -------------------------------------------------------------------------- */

async function notifyByEmail(
  data: ProjectRequest,
  reference: string,
  warning?: string | null,
): Promise<DeliveryResult | null> {
  const config = getMailConfig();
  if (config.transport === "none" || !config.from || config.inbox.length === 0) {
    return null;
  }

  const result = await sendMail({
    to: config.inbox,
    // Replying to the notification reaches the client directly.
    replyTo: data.email,
    subject: `[${reference}] ${data.service} — ${data.fullName}${
      data.companyName ? ` (${data.companyName})` : ""
    }`,
    text: formatText(data, reference, warning),
    html: formatHtml(data, reference, warning),
  });

  return { channel: "email", ok: result.ok, detail: result.detail };
}

/** Instant push to a phone. Uses Telegram's bot API — token + chat id, no SDK. */
async function notifyByTelegram(
  data: ProjectRequest,
  reference: string,
  warning?: string | null,
): Promise<DeliveryResult | null> {
  const token = process.env.ENQUIRY_TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.ENQUIRY_TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) return null;

  const lines = [
    `🔔 *New project request* — \`${reference}\``,
    warning ? `⚠️ ${warning}` : "",
    "",
    `*${data.fullName}*${data.companyName ? ` · ${data.companyName}` : ""}`,
    `${data.service}`,
    data.budget ? `Budget: ${data.budget}` : "",
    data.projectType ? `Type: ${data.projectType}` : "",
    "",
    `Prefers ${data.contactMethod} · ${data.email}${data.phone ? ` · ${data.phone}` : ""}`,
    "",
    data.description.length > 500
      ? `${data.description.slice(0, 500)}…`
      : data.description,
  ].filter((line) => line !== "");

  // Overridable for self-hosted Telegram Bot API servers (and for testing).
  const apiBase =
    process.env.ENQUIRY_TELEGRAM_API_BASE?.trim().replace(/\/$/, "") ||
    "https://api.telegram.org";

  try {
    const response = await fetch(
      `${apiBase}/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: lines.join("\n"),
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        }),
      },
    );

    if (!response.ok) {
      const body = await response.text();
      return {
        channel: "telegram",
        ok: false,
        detail: `HTTP ${response.status}: ${body.slice(0, 200)}`,
      };
    }
    return { channel: "telegram", ok: true };
  } catch (error) {
    return {
      channel: "telegram",
      ok: false,
      detail: error instanceof Error ? error.message : "unknown error",
    };
  }
}

/** Attempts, and the pause before each retry. */
const WEBHOOK_RETRY_DELAYS_MS = [400, 1600];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generic JSON webhook. Points at n8n, Slack, Zapier, Make, a CRM endpoint —
 * anything that accepts a POST.
 *
 * Signed with HMAC-SHA256 when `ENQUIRY_WEBHOOK_SECRET` is set, so the receiver
 * can prove the request came from this site. Without that, anyone who discovers
 * the URL can inject fake leads into your CRM.
 *
 * Retries network errors and 5xx (the receiver is down or restarting) but not
 * 4xx, which means the request itself is wrong and will fail identically again.
 */
async function notifyByWebhook(
  data: ProjectRequest,
  reference: string,
  warning?: string | null,
): Promise<DeliveryResult | null> {
  const url = process.env.ENQUIRY_WEBHOOK_URL?.trim();
  if (!url) return null;

  const body = JSON.stringify({
    reference,
    receivedAt: new Date().toISOString(),
    warning: warning ?? null,
    // `text` included so Slack-style endpoints render something useful.
    text: formatText(data, reference, warning),
    ...data,
  });

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const secret = process.env.ENQUIRY_WEBHOOK_SECRET?.trim();

  if (secret) {
    // Timestamp is inside the signed string so a captured request can't be
    // replayed indefinitely — the receiver rejects old ones.
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = createHmac("sha256", secret)
      .update(`${timestamp}.${body}`)
      .digest("hex");
    headers["X-Synctech-Timestamp"] = timestamp;
    headers["X-Synctech-Signature"] = `sha256=${signature}`;
  }

  const attempts = WEBHOOK_RETRY_DELAYS_MS.length + 1;
  let lastDetail = "unknown error";

  for (let attempt = 0; attempt < attempts; attempt++) {
    if (attempt > 0) await sleep(WEBHOOK_RETRY_DELAYS_MS[attempt - 1]);

    try {
      const response = await fetch(url, { method: "POST", headers, body });

      if (response.ok) {
        return {
          channel: "webhook",
          ok: true,
          detail: attempt > 0 ? `succeeded on attempt ${attempt + 1}` : undefined,
        };
      }

      lastDetail = `HTTP ${response.status}`;
      // 4xx won't change on retry — a bad URL or a rejected signature.
      if (response.status < 500) break;
    } catch (error) {
      lastDetail = error instanceof Error ? error.message : "unknown error";
    }
  }

  return { channel: "webhook", ok: false, detail: lastDetail };
}

/**
 * Append-only local record. This is the safety net: as long as the filesystem
 * is writable, an enquiry is never lost because a provider was down.
 * On read-only/serverless hosting this fails — configure email there.
 */
async function writeToFile(
  data: ProjectRequest,
  reference: string,
  warning?: string | null,
): Promise<DeliveryResult> {
  try {
    const dir = logDir();
    await mkdir(dir, { recursive: true });
    await appendFile(
      path.join(dir, LOG_FILE),
      JSON.stringify({
        reference,
        receivedAt: new Date().toISOString(),
        warning: warning ?? null,
        ...data,
      }) + "\n",
      "utf8",
    );
    return { channel: "file", ok: true };
  } catch (error) {
    return {
      channel: "file",
      ok: false,
      detail: error instanceof Error ? error.message : "unknown error",
    };
  }
}

/* -------------------------------------------------------------------------- */
/* Customer acknowledgement                                                   */
/* -------------------------------------------------------------------------- */

function acknowledgementText(data: ProjectRequest, reference: string) {
  return [
    `Hi ${data.fullName.split(" ")[0]},`,
    "",
    "Thanks for reaching out to Synctech Limited. We've received your",
    `${data.service} enquiry and will review your requirements.`,
    "",
    `Your reference is ${reference} — quote it if you need to follow up.`,
    "",
    "What happens next:",
    "  1. An engineer reads the details you sent.",
    "  2. We come back with the questions that decide scope.",
    "  3. You get a clear proposal: approach, timeline and cost.",
    "",
    "If you need to add anything, just reply to this email.",
    "",
    "— Synctech Limited",
    "Build. Automate. Secure. Scale.",
  ].join("\n");
}

function acknowledgementHtml(data: ProjectRequest, reference: string) {
  const step = (n: number, title: string, body: string) =>
    `<tr>
      <td style="padding:0 12px 14px 0;vertical-align:top">
        <div style="width:24px;height:24px;border-radius:6px;background:#0d1322;color:#22d3ee;font:600 12px/24px system-ui;text-align:center">${n}</div>
      </td>
      <td style="padding:0 0 14px;vertical-align:top">
        <div style="font:600 14px system-ui;color:#111827">${title}</div>
        <div style="font:14px/1.5 system-ui;color:#6b7793;margin-top:2px">${body}</div>
      </td>
    </tr>`;

  return `<div style="font:14px system-ui;color:#111827;max-width:560px">
    <p style="margin:0 0 14px;font-size:15px">Hi ${escapeHtml(data.fullName.split(" ")[0])},</p>
    <p style="margin:0 0 14px;line-height:1.6">
      Thanks for reaching out to Synctech Limited. We&rsquo;ve received your
      <strong>${escapeHtml(data.service)}</strong> enquiry and will review your requirements.
    </p>
    <p style="margin:0 0 22px;padding:10px 14px;background:#f3f6fc;border-radius:8px;font:13px system-ui;color:#374151">
      Your reference is <strong style="font-family:ui-monospace,monospace">${escapeHtml(reference)}</strong> &mdash; quote it if you need to follow up.
    </p>
    <h3 style="margin:0 0 12px;font-size:15px">What happens next</h3>
    <table style="border-collapse:collapse">
      ${step(1, "We read the details", "An engineer reads what you sent, not a sales queue.")}
      ${step(2, "We come back with questions", "Usually the ones that decide scope.")}
      ${step(3, "You get a clear proposal", "Approach, timeline and cost, in writing.")}
    </table>
    <p style="margin:18px 0 0;line-height:1.6;color:#6b7793">
      If you need to add anything, just reply to this email.
    </p>
    <p style="margin:24px 0 0;font-size:13px;color:#6b7793">
      &mdash; Synctech Limited<br>Build. Automate. Secure. Scale.
    </p>
  </div>`;
}

/**
 * Confirmation to the customer. Deliberately separate from the staff
 * notification: if this fails the enquiry is still safely delivered, so its
 * result never affects what the customer sees on screen.
 */
export async function sendAcknowledgement(
  data: ProjectRequest,
  reference: string,
): Promise<MailAck | null> {
  if (process.env.ENQUIRY_AUTOREPLY === "off") return null;

  const config = getMailConfig();
  if (config.transport === "none" || !config.from) return null;

  const result = await sendMail({
    to: [data.email],
    // A reply from the customer should reach a human, not the no-reply sender.
    replyTo: config.inbox[0] ?? config.from,
    subject: `We've received your request — ${reference}`,
    text: acknowledgementText(data, reference),
    html: acknowledgementHtml(data, reference),
  });

  return { ok: result.ok, detail: result.detail };
}

type MailAck = { ok: boolean; detail?: string };

/* -------------------------------------------------------------------------- */

/** What is currently wired up — used by the diagnostics command. */
export function configuredChannels(): Record<Channel, boolean> {
  const mail = getMailConfig();
  return {
    email: mail.transport !== "none" && Boolean(mail.from) && mail.inbox.length > 0,
    telegram: Boolean(
      process.env.ENQUIRY_TELEGRAM_BOT_TOKEN?.trim() &&
        process.env.ENQUIRY_TELEGRAM_CHAT_ID?.trim(),
    ),
    webhook: Boolean(process.env.ENQUIRY_WEBHOOK_URL?.trim()),
    file: true,
  };
}

export function enquiryLogPath() {
  return path.join(logDir(), LOG_FILE);
}

/**
 * Fans the enquiry out to every configured channel in parallel. Unconfigured
 * channels are skipped, not failed — so a fresh install still works with just
 * the file log.
 */
export async function deliverProjectRequest(
  data: ProjectRequest,
  reference: string,
  warning?: string | null,
): Promise<DeliveryResult[]> {
  const attempts = await Promise.all([
    notifyByEmail(data, reference, warning),
    notifyByTelegram(data, reference, warning),
    notifyByWebhook(data, reference, warning),
    writeToFile(data, reference, warning),
  ]);

  return attempts.filter((result): result is DeliveryResult => result !== null);
}
