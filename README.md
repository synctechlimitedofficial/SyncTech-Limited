# Synctech Limited — Website

Marketing and lead-generation site for Synctech Limited.
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4.

```bash
npm install
npm run dev        # http://localhost:3000
```

## 📖 Read the manual

**[MANUAL.md](./MANUAL.md)** covers everything: how customer enquiries reach you,
how to set up email notifications, what to edit and where, deployment, and the
pre-launch checklist.

Most common question first: **how do I get customer enquiries?**

```bash
cp .env.example .env.local   # add SMTP or Resend credentials
npm run check-notify         # confirm they work
```

Every submission is saved to `.data/project-requests.jsonl` even with no
configuration at all, readable via `npm run enquiries` — so nothing is lost while
you set email up. See
[section 3 of the manual](./MANUAL.md#3-setting-up-notifications).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run check-notify` | Report which notification channels work (`-- --send` to test for real) |
| `npm run enquiries` | Read received project enquiries (`-- --csv`, `-- --json`, `-- --all`) |

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Homepage — hero, services, why, technology, security, process, CTA |
| `/services` | All six services in detail, with `#web`…`#maintenance` anchors |
| `/about` | How the company works and what it won't claim |
| `/contact` | Start Your Project form |
| `/api/project-request` | Enquiry endpoint (validate → deliver) |

## Editing content

Almost all copy is data, not markup:

- `src/lib/site.ts` — company details, navigation, **contact info (currently placeholders)**
- `src/lib/services.ts` — the six services, plus every form dropdown option
- `src/app/globals.css` — colours and design tokens

## Notes

- Enquiries fan out to email (SMTP or Resend), Telegram, a webhook, and an
  append-only local log — whichever you configure. Customers get an auto-reply
  with their reference. Honeypot, timing and rate-limit defences run by default.
- No client logos, testimonials, statistics or certifications appear anywhere —
  none were supplied, and none were invented. See the end of
  [section 9](./MANUAL.md#9-before-you-go-live--checklist).
- Contact details in the footer and on `/contact` are placeholder text until real
  ones are added to `src/lib/site.ts`.
