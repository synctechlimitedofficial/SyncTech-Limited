# Synctech Limited — Website Manual

Everything you need to run, edit, deploy and get leads out of this website.

- [1. Quick start](#1-quick-start)
- [2. How a customer enquiry reaches you](#2-how-a-customer-enquiry-reaches-you)
- [3. Setting up notifications](#3-setting-up-notifications)
- [4. Reading and exporting enquiries](#4-reading-and-exporting-enquiries)
- [5. Spam protection](#5-spam-protection)
- [6. What to edit, and where](#6-what-to-edit-and-where)
- [7. Project structure](#7-project-structure)
- [8. Deploying](#8-deploying)
- [9. Before you go live — checklist](#9-before-you-go-live--checklist)
- [10. Portfolio / adding your work](#10-portfolio--adding-your-work)
- [11. n8n & automation](#11-n8n--automation)
- [12. Troubleshooting](#12-troubleshooting)

---

## 1. Quick start

```bash
cd ~/Desktop/SyncTech_Limited
npm install          # first time only
npm run dev          # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server, hot reload |
| `npm run build` | Production build |
| `npm start` | Serve the production build (run `build` first) |
| `npm run lint` | ESLint |
| **`npm run check-notify`** | **Report which notification channels are working** |
| `npm run check-notify -- --send` | Push a real test enquiry through every channel |
| `npm run enquiries` | Print the customer enquiries you've received |

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
nodemailer (SMTP only). No UI kit and no animation library — every visual is
hand-written SVG/CSS, which is why the pages are small and fast.

---

## 2. How a customer enquiry reaches you

This is the part that matters commercially, so read it carefully.

### What the customer does

1. They click **Start Your Project** / **Start a Project** — in the navbar, the
   hero, every service card, and the final CTA.
2. They land on `/contact`. If they clicked a *specific* service card, the
   **Service Required** dropdown arrives already filled in — clicking the
   Cybersecurity card sends them to `/contact?service=Cybersecurity`.
3. They fill in the form:

   | Field | Required? |
   | --- | --- |
   | Full Name | Yes |
   | Company Name | No |
   | Email | Yes, must be a valid address |
   | Phone | Only if they pick "Phone" as preferred contact |
   | Service Required | Yes |
   | Project Type | No |
   | Budget Range | No |
   | Project Description | Yes, min 20 characters |
   | Preferred Contact Method | Yes (Email / Phone / Either) |

4. They press **Submit Project Request** and see a confirmation panel:
   *"Request Received"* plus a **reference code** like `SYN-260812-76KC`.
5. If email is configured, they also get an **acknowledgement email** with that
   reference and a short "what happens next".

### What happens on your side

The form POSTs to `/api/project-request`, which rate-limits, screens for bots,
re-validates everything server-side, then **fans the enquiry out to every
channel you've configured, in parallel**:

| Channel | When it's used | Configure with |
| --- | --- | --- |
| **Email** | If SMTP or Resend is set up | `ENQUIRY_FROM`, `ENQUIRY_INBOX` + one transport |
| **Telegram** | If a bot token is set | `ENQUIRY_TELEGRAM_BOT_TOKEN`, `ENQUIRY_TELEGRAM_CHAT_ID` |
| **Webhook** (Slack/Zapier/CRM) | If a URL is set | `ENQUIRY_WEBHOOK_URL` |
| **Local file log** | **Always** | `ENQUIRY_LOG_DIR` (defaults to `.data/`) |

Four things worth knowing:

- **With zero configuration, enquiries are still saved.** They go to
  `.data/project-requests.jsonl`. Nothing is lost while you get email set up —
  read them with `npm run enquiries`.
- **The customer is only told "Received" if at least one channel succeeded.** If
  every channel fails they get an honest error asking them to try again or
  contact you directly, and the server logs
  `[project-request] every delivery channel failed`. You will never think a lead
  arrived when it didn't.
- **Partial failure is still a success.** If email is down but Telegram or the
  file log worked, the enquiry is safe and the customer sees the confirmation.
  The failed channel is named in the server logs with its reason.
- **Reply-to is the customer's address.** Hit Reply on the notification email and
  you're writing to the client. That is how your quote goes out.

### There is no quotation *calculator*

Worth being explicit, because "quotation" can mean two things. The site collects
a **project enquiry** — including the customer's own budget range — and delivers
it to you. It does **not** compute a price. That's deliberate: pricing this kind
of work off a web form produces numbers you'd have to walk back, which is exactly
what the About page promises you won't do.

---

## 3. Setting up notifications

### Step 1 — create your config file

```bash
cp .env.example .env.local
```

`.env.local` is gitignored. Never commit real keys or passwords.

### Step 2 — set the two email basics

Both transports need these:

```env
ENQUIRY_FROM=website@yourdomain.com     # the "from" address
ENQUIRY_INBOX=you@yourdomain.com        # where notifications land
```

`ENQUIRY_INBOX` accepts a comma-separated list for several people.

### Step 3 — pick one transport

**Option A — SMTP (use a mailbox you already own).** No third-party signup.

```env
SMTP_HOST=smtp.zoho.com
SMTP_PORT=465
SMTP_USER=website@yourdomain.com
SMTP_PASS=your-password-or-app-password
```

| Provider | Host | Port |
| --- | --- | --- |
| Google Workspace | `smtp.gmail.com` | 587 — needs an **App Password**, not your login password |
| Zoho Mail | `smtp.zoho.com` | 465 |
| Microsoft 365 | `smtp.office365.com` | 587 |
| cPanel / Namecheap | `mail.yourdomain.com` | 465 |

Port 465 is implicit TLS, 587 upgrades via STARTTLS — the code infers which from
the port, so you normally leave `SMTP_SECURE` blank.

**Option B — Resend (no mail server).** Sign up at [resend.com](https://resend.com),
verify your sending domain via the DNS records they give you, create an API key:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```

`ENQUIRY_FROM` must be on the domain you verified, or Resend rejects the send.

> If both are filled in, SMTP wins. Switching later is a config change only —
> no code change.

### Step 4 — verify it actually works

```bash
npm run check-notify
```

```
Synctech — notification check

Channels
  ✓ email        smtp · from website@synctech.com · to hello@synctech.com
                 connected to smtp.zoho.com:465
  – telegram     not configured — set ENQUIRY_TELEGRAM_BOT_TOKEN + ENQUIRY_TELEGRAM_CHAT_ID
  – webhook      not configured — set ENQUIRY_WEBHOOK_URL
  ✓ file log     /var/lib/synctech/enquiries/project-requests.jsonl (writable)

Auto-reply to customer
  ✓ autoreply    on — customers get a confirmation email

2 channel(s) live. Enquiries will reach you.
```

This connects to your SMTP server and reports the real error if credentials are
wrong. When it looks right, send a genuine test through every channel:

```bash
npm run check-notify -- --send
```

That delivers a test enquiry to your inbox, Telegram, webhook and log file, and
prints exactly which succeeded. It tells you how to delete the test record
afterwards. **Do this once before launch** — it's the difference between assuming
notifications work and knowing.

### Optional — instant phone notification via Telegram

The fastest way to know a lead landed without watching an inbox.

1. Message **@BotFather** on Telegram, send `/newbot`, follow the prompts, copy
   the token.
2. Send your new bot any message (it can't message you first).
3. Open `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates` and copy
   `result[0].message.chat.id`.

```env
ENQUIRY_TELEGRAM_BOT_TOKEN=1234567890:AA...
ENQUIRY_TELEGRAM_CHAT_ID=987654321
```

You'll get:

```
🔔 New project request — SYN-260812-76KC
Jane Okafor · Acme Ltd
Cloud & Server Engineering
Budget: $15,000 – $50,000
Prefers Email · jane@acme.com · +234 800 111 2222
```

### Optional — webhook

Set `ENQUIRY_WEBHOOK_URL` to anything that accepts a JSON `POST`:

- **Slack** — an Incoming Webhook. The payload includes a `text` field, so it
  renders as a readable message in the channel.
- **Zapier / Make / n8n** — a Catch Hook, to push into a CRM, Google Sheet,
  Trello, Notion.
- **Your own CRM** — the payload is the raw enquiry plus `reference`,
  `receivedAt` and `warning`.

Email, Telegram and webhook all fire together; you don't have to choose.

### The customer auto-reply

On by default as soon as email works. The customer gets a branded confirmation
with their reference number and the three-step "what happens next", and its
reply-to is your inbox — so if they reply, it reaches a human. To turn it off:

```env
ENQUIRY_AUTOREPLY=off
```

### Optional — analytics

Cookie-free page analytics, off by default. Nothing is loaded unless you set the
source, so out of the box the site makes **no third-party requests** and needs no
cookie banner.

```env
NEXT_PUBLIC_ANALYTICS_SRC=https://plausible.io/js/script.js
NEXT_PUBLIC_ANALYTICS_DOMAIN=synctech.com
```

Works with Plausible or Umami, cloud or self-hosted.

---

## 4. Reading and exporting enquiries

```bash
npm run enquiries              # newest 20, formatted for reading
npm run enquiries -- --all     # every enquiry
npm run enquiries -- --csv     # spreadsheet / Excel
npm run enquiries -- --json    # raw, pipe into jq
```

Export a full CSV:

```bash
npm run enquiries -- --all --csv > enquiries.csv
```

The underlying file is `.data/project-requests.jsonl` — one JSON object per
line, append-only. Easy to grep, easy to import, hard to corrupt.

> **This file contains customer personal data.** It's gitignored. On a server,
> point `ENQUIRY_LOG_DIR` at a backed-up volume and keep the permissions tight.

---

## 5. Spam protection

A public form with no defences fills up with bot submissions that bury real
leads. Three layers run automatically, all invisible to real customers.

| Layer | What it does | On trigger |
| --- | --- | --- |
| **Honeypot** | A field positioned off-screen, hidden from screen readers and out of the tab order. A human cannot fill it; naive bots do. | Returns a normal-looking success so the bot doesn't retry, but **delivers nothing**. Logged as `dropped as bot`. |
| **Timing** | Measures how long the form took to fill in. | Under 2.5s is a *soft* signal: the enquiry is **still delivered**, with `⚠ form completed in 0.4s — unusually fast` on the notification so you can judge. |
| **Rate limit** | Max 5 submissions per IP per 10 minutes. | `429` with a `Retry-After` header and a clear message. |

The guiding rule throughout: **never silently lose a real lead.** Only the
honeypot — which a human physically cannot trip — drops a submission. Everything
else gets through, annotated.

Two limitations worth knowing:

- The rate limit is **in-process**. That's right for a single-instance deploy,
  which is how this site is meant to run. Behind a load balancer or on
  serverless, each instance counts separately — move the limit to Redis or your
  edge/WAF if you need a shared one.
- Rate limiting depends on `x-forwarded-for`, which is only trustworthy behind a
  proxy you control. Configure your reverse proxy to set it. Without one, all
  visitors share a bucket, which fails *closed* (stricter), not open.

---

## 6. What to edit, and where

You can change almost all the wording without touching a component.

### Company details and contact info — `src/lib/site.ts`

Contact details are currently **placeholders on purpose** (`"Add company
email"`), because no real ones were provided. Replace the `value` *and* the
`href` together:

```ts
{
  label: "Email",
  value: "hello@synctech.com",
  href: "mailto:hello@synctech.com",   // was null
  hint: "Project enquiries and general questions",
}
```

Setting `href` makes it a clickable link automatically, in the footer and on the
contact page. Leave `href: null` and it renders as plain text.

### Services — `src/lib/services.ts`

One array drives **everything**: the homepage cards, the services page, the
footer links, the form's dropdown, the hero diagram nodes, the contact sidebar.
Edit a service's `title`, `summary`, `detail` or `capabilities` and all of those
update together.

The same file holds the **form dropdown options** (`projectTypes`,
`budgetRanges`, `contactMethods`), the **process steps**, and the **Why Synctech**
points. Change your budget bands here and the form follows.

### Section copy

Headlines specific to one section live in that section's component under
`src/components/sections/` — `Hero.tsx`, `Services.tsx`, `WhySynctech.tsx`,
`TechnologySection.tsx`, `SecuritySection.tsx`, `Process.tsx`, `CTA.tsx`.

### Email wording

Both templates are in `src/lib/notify.ts`: `formatText`/`formatHtml` for your
notification, `acknowledgementText`/`acknowledgementHtml` for the customer's copy.

### Colours and design tokens — `src/app/globals.css`

The `@theme` block at the top defines every colour, with the reusable
`.panel` / `.btn` / `.eyebrow` classes below it:

```css
--color-cyan-glow: #22d3ee;   /* primary accent */
--color-brand:     #4b7cff;   /* secondary */
--color-iris:      #8b5cf6;   /* tertiary */
```

### SEO — `src/app/layout.tsx` and each `page.tsx`

Site-wide title template, description, Open Graph and the Organization
structured data are in `layout.tsx`. Each page exports its own `metadata`. The
social share image is generated from code in `src/app/opengraph-image.tsx` — no
image file to maintain.

---

## 7. Project structure

```
src/
├─ app/
│  ├─ layout.tsx              Shell, fonts, SEO defaults, JSON-LD
│  ├─ page.tsx                Homepage (composes the sections)
│  ├─ services/page.tsx       All six services in detail, #anchors per service
│  ├─ about/page.tsx          Narrative, principles, "won't tell you"
│  ├─ contact/page.tsx        Start Your Project — the form
│  ├─ api/project-request/    The enquiry endpoint
│  ├─ opengraph-image.tsx     Generated social share card
│  ├─ sitemap.ts, robots.ts   SEO plumbing
│  ├─ not-found.tsx           404
│  └─ globals.css             Design tokens, components, keyframes
├─ components/
│  ├─ layout/                 Navbar (sticky + mobile sheet), Footer
│  ├─ sections/               One file per homepage section
│  ├─ visuals/                HeroVisual, AutomationFlow, SecurityVisual
│  ├─ forms/                  ProjectForm, Field primitives
│  ├─ ui/                     Reveal, Section, Button, SpotlightCard, PageHeader
│  ├─ ServiceCard.tsx         Standard + featured (AI) card
│  ├─ Analytics.tsx           Opt-in, renders nothing unless configured
│  └─ Logo.tsx, icons.tsx     Brand mark, hand-drawn icon set
└─ lib/
   ├─ site.ts                 Company details, nav, contact channels
   ├─ services.ts             Services + all form dropdown options
   ├─ project-request.ts      Enquiry type + validation (shared client/server)
   ├─ mail.ts                 SMTP / Resend behind one interface
   ├─ notify.ts               Channel fan-out + email templates
   └─ antispam.ts             Honeypot, timing, rate limit
scripts/
├─ check-notify.mts           `npm run check-notify`
└─ enquiries.mjs              `npm run enquiries`
```

**Why validation lives in `lib/`:** the same `validateProjectRequest` runs in the
browser for instant feedback *and* on the server for real enforcement. They can
never drift apart, and the API is safe even if someone posts to it directly.

**Why `notify.ts` imports with `.ts` extensions:** so `check-notify.mts` can
import the exact same modules the website uses under Node's native TypeScript
support. A pass in the diagnostics therefore means the site will work — there is
no second code path that could disagree.

---

## 8. Deploying

### Option A — your own server (recommended here)

You run infrastructure for clients, so run your own site on it. This also keeps
the file-based enquiry log working.

```bash
npm ci
npm run build
npm start          # listens on 3000
```

Put it behind nginx/Caddy with TLS, keep it alive with `pm2` or a systemd unit,
and make sure the proxy sets `X-Forwarded-For` so rate limiting works per-visitor.

Point `ENQUIRY_LOG_DIR` at a **persistent, backed-up** path outside the deploy
directory, so releases don't wipe it:

```env
ENQUIRY_LOG_DIR=/var/lib/synctech/enquiries
```

After the first deploy, run `npm run check-notify` **on the server** — a config
that works locally can still fail there (firewalled SMTP port, unwritable path).

### Option B — Vercel / Netlify

Push to Git, import the repo, add the environment variables in the dashboard.

⚠️ **Serverless filesystems are read-only and ephemeral.** The file log will fail
there, so on serverless you **must** configure email (or Telegram/webhook) —
otherwise every submission returns the 502 error and you lose leads. The code
fails loudly rather than silently for exactly this reason.

### Environment variables for production

```env
NEXT_PUBLIC_SITE_URL=https://synctech.com     # real domain, no trailing slash
ENQUIRY_FROM=website@synctech.com
ENQUIRY_INBOX=hello@synctech.com
SMTP_HOST=...                                # or RESEND_API_KEY
SMTP_PORT=465
SMTP_USER=...
SMTP_PASS=...
ENQUIRY_LOG_DIR=/var/lib/synctech/enquiries
ENQUIRY_TELEGRAM_BOT_TOKEN=                  # optional
ENQUIRY_TELEGRAM_CHAT_ID=                    # optional
ENQUIRY_WEBHOOK_URL=                         # optional
```

---

## 9. Before you go live — checklist

- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain — canonical URLs, the
      sitemap and social previews all depend on it.
- [ ] Replace the contact placeholders in `src/lib/site.ts` with real email,
      phone and address, and set their `href`s.
- [ ] Configure email, then run **`npm run check-notify -- --send`** and confirm
      the test lands in your inbox.
- [ ] Confirm the **customer** copy also arrived (the test sends to your inbox
      address, so you'll see both), and that Reply on the notification addresses
      the customer.
- [ ] Delete the test enquiry from the log — `check-notify` prints the command.
- [ ] Check the budget bands in `src/lib/services.ts` match how you actually price.
- [ ] Point `ENQUIRY_LOG_DIR` at a backed-up location and re-run
      `check-notify` on the server to confirm it's writable there.
- [ ] Make sure your reverse proxy sets `X-Forwarded-For`.
- [ ] Add social links to the footer if you want them — none are invented, so
      there are currently none.
- [ ] Submit `/sitemap.xml` in Google Search Console.
- [ ] Run `npm run build` one final time and confirm no warnings.

### Deliberately empty, not forgotten

There are no client logos, testimonials, awards, certifications, statistics,
case studies or "years of experience" anywhere on this site, because none were
provided and inventing them would be a liability. When you have real ones, good
places to add them are below the hero, and between the Why Synctech and Technology
sections.

---

## 10. Portfolio / adding your work

Everything lives in one file: **`src/lib/projects.ts`**.

**Currently live: 12 projects** — 3 web, 3 mobile, 3 AI & automation, 3
cybersecurity. `/work` shows all of them with a filter by discipline; the
homepage shows the first three plus a "See all work" button.

### Still to fill in

Three fields were deliberately left blank rather than guessed. Each one simply
doesn't render while empty, so the pages look complete without them — but they're
worth adding:

| Field | Why it matters |
| --- | --- |
| `href` | The live URL. Every project already has an empty `href: ""` slot — paste a URL in and a **"Visit the live site ↗"** button appears on that card. Leave it empty and no button renders. |
| `stack` | The technologies used on each project. Prospects with technical staff will ask, and it's the detail that separates a portfolio from a brochure. Renders as monospace chips. |
| `year` | When each was delivered. Appears next to the client name. |
| `outcome` | Only where you have a result you can defend. Leave the rest off — a card with no outcome looks entirely normal. |

Adding a live URL is literally one edit:

```ts
href: "https://greenleaforganics.com",   // was: href: ""
```

The button opens in a new tab with `rel="noreferrer noopener"`, so the client's
site can't touch your page's `window` object. **Only add a URL for a site you
actually built** — the card sits directly under a "What we built" heading, so the
link is a claim of authorship.

### The safety rule

Only entries with `status: "published"` are ever rendered, so work in progress
can't leak onto the live site. If you ever set them all back to `"draft"`:

- the homepage **Work** section doesn't render,
- **Work** is absent from the navigation and footer,
- `/work` returns a **404** rather than an empty page,
- `/work` is excluded from the sitemap.

Publish one project and all four reverse automatically. This is verified — see
the note at the end of this section.

### Adding a project

Replace a draft block and set `status: "published"`:

```ts
{
  slug: "fleet-dispatch-portal",        // becomes the #anchor on /work
  status: "published",
  title: "Fleet dispatch portal",
  client: "Northbridge Logistics",      // or a sector, if under NDA
  year: "2025",
  services: ["web", "cloud"],           // ids from src/lib/services.ts
  problem: "Dispatchers coordinated every job by phone, with no shared view of which vehicles were free.",
  build: "A dispatch portal with live vehicle status, drag-to-assign jobs and a full audit trail.",
  stack: ["Next.js", "PostgreSQL", "Docker", "Nginx"],
  outcome: "Dispatch moved from phone calls to a single shared board.",  // OPTIONAL
  href: "https://client-site.com",                                       // OPTIONAL
},
```

### What to write in each field

| Field | Guidance |
| --- | --- |
| `client` | The real name if you're allowed to use it. Otherwise a sector — *"A distributor in FMCG"*. Get written permission before naming anyone. |
| `problem` | What was wrong **before** you arrived. The manual process, the system that couldn't scale, the thing nobody could see. This is the part prospects recognise themselves in. |
| `build` | What you actually delivered. Concrete beats impressive: *"drag-to-assign jobs and an audit trail"* lands harder than *"a bespoke enterprise solution"*. |
| `stack` | Technologies genuinely used. Prospects with technical staff will ask. |
| `outcome` | **Optional, and only if it's true and defensible.** Omit it rather than estimating — the field simply doesn't render when absent, and a card with no outcome looks completely normal. A qualitative line you can stand behind beats an invented percentage. |
| `services` | Which of your six services it maps to. Drives the icon, the accent colour and the illustration style. |

`services[0]` picks the illustration: `web`/`maintenance` → dashboard,
`mobile` → phone, `ai` → pipeline, `cloud` → infrastructure racks,
`security` → shield. These are **abstract artifacts, not fake screenshots** —
deliberately, since a mocked-up screenshot would misrepresent the real thing.

### Ordering, filtering and volume

Projects render in array order — **put the strongest first**, because the
homepage shows the first three. The current order deliberately alternates
disciplines (AI → mobile → web → security …) so the first impression shows range
rather than three of the same thing.

`/work` filters by discipline. Every project stays in the HTML and filtering only
hides the non-matching ones, so search engines always see the full set and the
scroll animations keep working across filter changes. Card numbers are fixed to
position in the full list, so a project keeps the same number under any filter.

The homepage grid adapts to one, two or three published projects, so it never
looks half-empty.

### A note on naming clients

Every project currently names its client. Make sure you have **written**
permission for each one — it's the kind of thing that's awkward to walk back once
Google has indexed it. If a client withdraws permission, replace `client` with
the sector (`"A boutique real estate agency"`); nothing else needs to change.

### Verified behaviour

Tested end to end against the production build: all 12 clients render on `/work`,
the homepage shows 3, `/work` is in the sitemap, no placeholder text appears
anywhere, and no years or outcomes were invented for the blank fields. Filtering
by each discipline returns exactly 3, and every card is still revealed after
filtering and un-filtering. No horizontal overflow at 375px or 1440px.

The draft path was tested too: with everything set back to `"draft"`, zero
placeholder strings reached any page, `/work` returned 404, no link to `/work`
existed anywhere, and it was absent from the sitemap.

---

## 11. n8n & automation

### Read this first: what you already have

**The client already gets an instant "we've received your request" email.** The
website sends it directly the moment the form is submitted, with their reference
number and the three-step "what happens next". It needs no n8n and no automation
platform — just working email (section 3).

So do **not** rebuild that in n8n. You'd send the client two near-identical
emails. n8n is for everything *on top*: scoring, routing, CRM sync, spreadsheets,
AI summarising, and **delayed** follow-ups.

### What the website sends

Set `ENQUIRY_WEBHOOK_URL` to your n8n webhook and every enquiry arrives as JSON:

```json
{
  "reference": "SYN-260813-VPVK",
  "receivedAt": "2026-08-13T09:20:38.000Z",
  "warning": null,
  "text": "New project request — SYN-260813-VPVK\nName: Jane Okafor\n…",
  "fullName": "Jane Okafor",
  "companyName": "Acme Ltd",
  "email": "jane@acme.com",
  "phone": "+234 800 111 2222",
  "service": "Cloud & Server Engineering",
  "projectType": "Migration or infrastructure move",
  "budget": "$15,000 – $50,000",
  "description": "Move our order system off one ageing VPS…",
  "contactMethod": "Email"
}
```

`warning` is non-null when the spam heuristics flagged something (section 5) —
useful as a routing condition. Only these known fields are ever sent; anything
else a caller posts is stripped before delivery.

The webhook **retries** on network errors and 5xx (3 attempts, backing off
400ms then 1.6s), so a brief n8n restart doesn't lose the lead. It does *not*
retry 4xx, because a bad URL or rejected signature fails identically every time.

### Signing — do this, it matters

Without a signature, anyone who discovers your n8n webhook URL can POST fake
leads straight into your CRM. Generate a secret:

```bash
openssl rand -hex 32
```

Put it in the website's `.env.local` as `ENQUIRY_WEBHOOK_SECRET`, and the same
value in n8n as the `SYNCTECH_WEBHOOK_SECRET` environment variable.

The website then sends two extra headers:

| Header | Value |
| --- | --- |
| `X-Synctech-Timestamp` | Unix seconds when the request was signed |
| `X-Synctech-Signature` | `sha256=` + HMAC-SHA256 of `` `${timestamp}.${rawBody}` `` |

The timestamp is *inside* the signed string, so a captured request can't be
replayed forever — the included verifier rejects anything older than 5 minutes.

> Leave `ENQUIRY_WEBHOOK_SECRET` unset and no headers are sent, so existing
> Slack/Zapier setups keep working unchanged.

### Importing the workflow

A ready-made workflow is at
`integrations/n8n/synctech-enquiry-workflow.json`.

1. In n8n: **Workflows → Import from File** → pick that file.
2. Open the **Website Enquiry** node, copy the **Production URL**.
3. Set it as `ENQUIRY_WEBHOOK_URL` on the website.
4. Set `SYNCTECH_WEBHOOK_SECRET` in n8n to the same value as
   `ENQUIRY_WEBHOOK_SECRET` on the website.
5. Activate the workflow.
6. From the website, run `npm run check-notify -- --send` and watch it execute.

What's in it:

| Node | What it does |
| --- | --- |
| **Website Enquiry** | Webhook trigger |
| **Verify Signature** | Rejects anything not signed with your secret, and anything older than 5 minutes |
| **Score Lead** | Deterministic 0–100 score from budget, named company, description length, spam flag → `high` / `normal` / `low` |
| **Route by Priority** | Splits high-priority from the rest |
| **AI Summary (replace me)** | A passthrough placeholder — swap for an AI node |
| **Follow-up to Client** | A *later* touch, not a duplicate of the instant acknowledgement |
| **Standard Queue** | Attach your CRM / Sheets / Notion node here |

Scoring is deliberately plain JavaScript, not AI: it's free, instant, and you can
explain to yourself why any lead was routed the way it was. Tune the weights in
the **Score Lead** node to match how you actually qualify work.

> The `HIGH_VALUE` budget list in that node must match `budgetRanges` in
> `src/lib/services.ts`. If you edit your budget bands, update both.

### Adding AI

Replace the **AI Summary (replace me)** node with an OpenAI / Anthropic /
Ollama node. It's a plain passthrough by default so the workflow imports and
runs with no AI credentials at all.

A prompt that earns its keep:

```
You are triaging an inbound enquiry for a software engineering company.

Enquiry:
{{ $json.description }}

Service requested: {{ $json.service }}
Budget: {{ $json.budget }}

Return JSON with:
- summary: one sentence, plain English, what they actually need
- technical_scope: bullet list of the systems likely involved
- unknowns: the 3 questions that most affect the estimate
- fit: "good" | "unclear" | "poor" for a team doing web, mobile, AI,
  cloud and security work — and one line of justification
```

Feed `unknowns` into your reply draft and you've automated the slowest part of
responding: working out what to ask.

**Keep AI out of the delivery path.** Everything that matters — your notification,
the client's acknowledgement, the saved record — already happened before n8n is
called. If a model is slow, rate-limited or down, you still have the lead. Don't
restructure that so an AI call sits between a customer and their confirmation.

### Other things worth automating here

- Append every enquiry to a Google Sheet as a lightweight CRM.
- Create a task in Notion/Trello/Linear for high-priority leads only.
- A **Wait** node → 3 days → "just checking you got our reply" if you haven't
  logged a response.
- Weekly digest: enquiries grouped by service, to see what people actually ask for.
- Push high-value leads to a separate Telegram channel from the routine ones.

### A caveat on the workflow file

The workflow JSON is validated structurally — valid JSON, every connection
points at a real node, no orphans, both Code nodes parse, and the Switch's
branches match its rules. It has **not** been imported into a live n8n instance,
because there wasn't one available here. Treat it as a working starting point; if
your n8n version disagrees about a node's `typeVersion`, it'll tell you on import
and you can bump it in the UI.

---

## 12. Troubleshooting

**Start here for anything notification-related:**

```bash
npm run check-notify
```

It reports the actual error from your mail server rather than making you guess.

**"I submitted the form but got no email."**
Run `check-notify`. Common causes: `ENQUIRY_FROM` or `ENQUIRY_INBOX` missing
(both required, or email is skipped entirely); using a Google account password
instead of an **App Password**; `ENQUIRY_FROM` not on a Resend-verified domain;
outbound SMTP blocked by the host's firewall. Whatever the cause, the lead is
almost certainly still saved — check `npm run enquiries`.

**Customers see "We couldn't record your request just now."**
Every channel failed. The server log line `every delivery channel failed` names
each channel and its reason. Most common cause: serverless hosting where the file
log can't be written and no email is configured.

**A customer says they submitted but you have nothing.**
Check the server log for `dropped as bot` with their email — a false positive on
the honeypot is the only way a submission vanishes. It shouldn't be possible from
a real browser, but the log is there so you can prove it either way.

**Notifications show `⚠ form completed in 0.4s — unusually fast`.**
The timing heuristic fired. The enquiry was still delivered — treat it as "look
at this one more carefully", not as spam. Password-manager autofill can
occasionally cause it.

**Legitimate visitors hitting the 429 rate limit.**
Your proxy probably isn't setting `X-Forwarded-For`, so everyone shares one
bucket. Fix the proxy, or raise `MAX_PER_WINDOW` in `src/lib/antispam.ts`.

**The form shows a loading skeleton and never loads.**
The form is a client component behind `Suspense` because it reads the `?service=`
query parameter. If it's stuck, check the browser console for a JavaScript error.

**Animations don't play.**
Intentional if the visitor has "reduce motion" enabled in their OS — all content
still shows, just without movement. Reveal-on-scroll is JS-driven; with
JavaScript off, a `<noscript>` rule makes everything visible immediately.

**Build fails after I edited a service.**
`src/lib/services.ts` is typed. Every service needs all its fields, and `id` must
stay one of the six known values, because the icon set and the hero diagram are
keyed off it. The TypeScript error will name the missing field.
