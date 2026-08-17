import nodemailer from "nodemailer";

/**
 * One mail interface, two transports.
 *
 * Which one runs is decided purely by which environment variables are present,
 * so switching from SMTP to Resend (or back) is a config change, never a code
 * change. SMTP wins if both are configured, on the assumption that an explicitly
 * configured mailbox is the more deliberate choice.
 */

export type MailMessage = {
  to: string[];
  subject: string;
  text: string;
  html: string;
  /** Where a reply should go — usually the customer. */
  replyTo?: string;
};

export type MailResult = {
  ok: boolean;
  transport: "smtp" | "resend" | "none";
  detail?: string;
};

export type MailConfig = {
  transport: "smtp" | "resend" | "none";
  from: string | null;
  inbox: string[];
  /** Human-readable list of what is missing, for the diagnostics command. */
  missing: string[];
};

function envList(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

/**
 * Inspects the environment and reports what is usable. Kept separate from
 * sending so `npm run check-notify` can explain the setup without sending.
 */
export function getMailConfig(): MailConfig {
  const from = process.env.ENQUIRY_FROM?.trim() || null;
  const inbox = envList(process.env.ENQUIRY_INBOX);
  const missing: string[] = [];

  if (!from) missing.push("ENQUIRY_FROM");
  if (inbox.length === 0) missing.push("ENQUIRY_INBOX");

  const hasSmtp = Boolean(process.env.SMTP_HOST?.trim());
  const hasResend = Boolean(process.env.RESEND_API_KEY?.trim());

  if (hasSmtp) {
    if (!process.env.SMTP_USER?.trim()) missing.push("SMTP_USER");
    if (!process.env.SMTP_PASS) missing.push("SMTP_PASS");
    return { transport: "smtp", from, inbox, missing };
  }

  if (hasResend) {
    return { transport: "resend", from, inbox, missing };
  }

  return {
    transport: "none",
    from,
    inbox,
    missing: [...missing, "SMTP_HOST or RESEND_API_KEY"],
  };
}

async function sendViaSmtp(
  message: MailMessage,
  from: string,
): Promise<MailResult> {
  const port = Number(process.env.SMTP_PORT ?? 587);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    // 465 is implicit TLS; 587 and 25 start plaintext and upgrade via STARTTLS.
    secure: process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === "true"
      : port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from,
      to: message.to,
      replyTo: message.replyTo,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
    return { ok: true, transport: "smtp" };
  } catch (error) {
    return {
      ok: false,
      transport: "smtp",
      detail: error instanceof Error ? error.message : "unknown SMTP error",
    };
  } finally {
    transporter.close();
  }
}

async function sendViaResend(
  message: MailMessage,
  from: string,
): Promise<MailResult> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: message.to,
        reply_to: message.replyTo,
        subject: message.subject,
        text: message.text,
        html: message.html,
      }),
    });

    if (!response.ok) {
      // Resend puts the actionable reason in the body, not the status.
      const body = await response.text();
      return {
        ok: false,
        transport: "resend",
        detail: `HTTP ${response.status}: ${body.slice(0, 200)}`,
      };
    }
    return { ok: true, transport: "resend" };
  } catch (error) {
    return {
      ok: false,
      transport: "resend",
      detail: error instanceof Error ? error.message : "unknown Resend error",
    };
  }
}

export async function sendMail(message: MailMessage): Promise<MailResult> {
  const config = getMailConfig();

  if (config.transport === "none" || !config.from) {
    return {
      ok: false,
      transport: "none",
      detail: `mail not configured (missing: ${config.missing.join(", ")})`,
    };
  }

  if (message.to.length === 0) {
    return { ok: false, transport: config.transport, detail: "no recipients" };
  }

  return config.transport === "smtp"
    ? sendViaSmtp(message, config.from)
    : sendViaResend(message, config.from);
}

/** Verifies credentials without sending anything. SMTP only — Resend has no probe. */
export async function verifyMailConnection(): Promise<MailResult> {
  const config = getMailConfig();

  if (config.transport !== "smtp") {
    return {
      ok: config.transport === "resend",
      transport: config.transport,
      detail:
        config.transport === "resend"
          ? "Resend has no connection probe; send a test to confirm"
          : `not configured (missing: ${config.missing.join(", ")})`,
    };
  }

  const port = Number(process.env.SMTP_PORT ?? 587);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === "true"
      : port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  try {
    await transporter.verify();
    return { ok: true, transport: "smtp", detail: `connected to ${process.env.SMTP_HOST}:${port}` };
  } catch (error) {
    return {
      ok: false,
      transport: "smtp",
      detail: error instanceof Error ? error.message : "unknown SMTP error",
    };
  } finally {
    transporter.close();
  }
}
