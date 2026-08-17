#!/usr/bin/env node
/**
 * Notification diagnostics.
 *
 *   npm run check-notify           # report what's configured, send nothing
 *   npm run check-notify -- --send # also push a real test enquiry through every channel
 *
 * Run this after editing .env.local. It imports the same modules the website
 * uses, so a pass here means the site will work — there is no separate code
 * path that could disagree.
 */
import { access, constants, mkdir } from "node:fs/promises";
import path from "node:path";
import { getMailConfig, verifyMailConnection } from "../src/lib/mail.ts";
import {
  configuredChannels,
  deliverProjectRequest,
  enquiryLogPath,
  sendAcknowledgement,
} from "../src/lib/notify.ts";
import { buildReference } from "../src/lib/project-request.ts";
import type { ProjectRequest } from "../src/lib/project-request.ts";

const send = process.argv.includes("--send");

const tick = (ok: boolean) => (ok ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m");
const skip = "\x1b[33m–\x1b[0m";
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;

function line(mark: string, name: string, detail: string) {
  console.log(`  ${mark} ${name.padEnd(12)} ${detail}`);
}

console.log("\n\x1b[1mSynctech — notification check\x1b[0m\n");

/* -- Configuration --------------------------------------------------------- */

const channels = configuredChannels();
const mail = getMailConfig();

console.log("Channels");

if (channels.email) {
  const probe = await verifyMailConnection();
  line(
    tick(probe.ok),
    "email",
    `${mail.transport} · from ${mail.from} · to ${mail.inbox.join(", ")}` +
      (probe.detail ? dim(`\n                 ${probe.detail}`) : ""),
  );
} else {
  line(
    skip,
    "email",
    `not configured — missing ${mail.missing.join(", ")}`,
  );
}

line(
  channels.telegram ? tick(true) : skip,
  "telegram",
  channels.telegram
    ? `chat ${process.env.ENQUIRY_TELEGRAM_CHAT_ID}`
    : "not configured — set ENQUIRY_TELEGRAM_BOT_TOKEN + ENQUIRY_TELEGRAM_CHAT_ID",
);

line(
  channels.webhook ? tick(true) : skip,
  "webhook",
  channels.webhook
    ? String(process.env.ENQUIRY_WEBHOOK_URL)
    : "not configured — set ENQUIRY_WEBHOOK_URL",
);

// The file log is the always-on fallback, so prove it's actually writable.
const logPath = enquiryLogPath();
let fileOk = false;
let fileError = "";
try {
  await mkdir(path.dirname(logPath), { recursive: true });
  await access(path.dirname(logPath), constants.W_OK);
  fileOk = true;
} catch (error) {
  fileError = error instanceof Error ? error.message : String(error);
}
line(
  tick(fileOk),
  "file log",
  fileOk ? `${logPath} ${dim("(writable)")}` : `${logPath} — NOT writable: ${fileError}`,
);

/* -- Verdict --------------------------------------------------------------- */

const liveChannels = [
  channels.email,
  channels.telegram,
  channels.webhook,
  fileOk,
].filter(Boolean).length;

console.log("\nAuto-reply to customer");
line(
  // Not a failure when email is unset — it's a consequence, so show it skipped.
  process.env.ENQUIRY_AUTOREPLY === "off" || !channels.email
    ? skip
    : tick(true),
  "autoreply",
  process.env.ENQUIRY_AUTOREPLY === "off"
    ? "disabled via ENQUIRY_AUTOREPLY=off"
    : channels.email
      ? "on — customers get a confirmation email"
      : "needs email configured; customers only see the on-screen confirmation",
);

console.log("");
if (liveChannels === 0) {
  console.log(
    "\x1b[31mNo channel is working. Enquiries would be REJECTED with a 502.\x1b[0m",
  );
  process.exitCode = 1;
} else if (!channels.email) {
  console.log(
    `\x1b[33m${liveChannels} channel(s) live, but no email.\x1b[0m You'd have to run \`npm run enquiries\` to see leads.`,
  );
} else {
  console.log(`\x1b[32m${liveChannels} channel(s) live. Enquiries will reach you.\x1b[0m`);
}

/* -- Optional live test ---------------------------------------------------- */

if (!send) {
  console.log(dim("\nRe-run with `-- --send` to push a real test enquiry through.\n"));
  process.exit(process.exitCode ?? 0);
}

console.log("\n\x1b[1mSending a test enquiry…\x1b[0m\n");

const reference = buildReference();
const sample: ProjectRequest = {
  fullName: "Test Submission",
  companyName: "Synctech internal check",
  email: mail.inbox[0] || "test@example.com",
  phone: "",
  service: "Cloud & Server Engineering",
  projectType: "Audit or assessment",
  budget: "Prefer to discuss",
  description:
    "This is an automated test from `npm run check-notify`. If you are reading it in your inbox, notifications are working. Safe to delete.",
  contactMethod: "Email",
};

const results = await deliverProjectRequest(sample, reference, "test submission");
for (const r of results) {
  line(tick(r.ok), r.channel, r.ok ? "delivered" : `FAILED — ${r.detail}`);
}

const ack = await sendAcknowledgement(sample, reference);
line(
  ack ? tick(ack.ok) : skip,
  "autoreply",
  ack
    ? ack.ok
      ? `sent to ${sample.email}`
      : `FAILED — ${ack.detail}`
    : "skipped",
);

const anyOk = results.some((r) => r.ok);
console.log(
  anyOk
    ? `\n\x1b[32mTest enquiry ${reference} delivered.\x1b[0m Check your inbox, then remove it with:\n  ${dim(`grep -v ${reference} ${logPath} > tmp && mv tmp ${logPath}`)}\n`
    : `\n\x1b[31mTest enquiry failed on every channel.\x1b[0m\n`,
);

process.exit(anyOk ? 0 : 1);
