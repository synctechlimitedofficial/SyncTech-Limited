import { hasPublishedWork } from "./projects";

export const site = {
  name: "Synctech Limited",
  shortName: "SYNCTECH",
  tagline: "Build. Automate. Secure. Scale.",
  description:
    "Synctech Limited builds modern software, AI automation, cloud infrastructure, cybersecurity solutions, and provides ongoing technology maintenance for businesses.",
  // Set NEXT_PUBLIC_SITE_URL in .env.local once the real domain is live —
  // canonical links, the sitemap and OG tags all read from here.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://synctech.example",
  locale: "en_US",
} as const;

/**
 * Primary navigation. "Work" only appears once at least one project is
 * published (see lib/projects.ts) — no dead link to an empty portfolio.
 */
export const nav: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  ...(hasPublishedWork ? [{ label: "Work", href: "/work" }] : []),
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/**
 * Contact details are intentionally left as placeholders.
 * Replace the `value` fields once real details are provided —
 * `href` should be updated at the same time.
 */
export const contactChannels = [
  {
    label: "Email",
    value: "contact@synctechlimited.site",
    href: null,
    hint: "Project enquiries and general questions",
  },
  {
    label: "Phone",
    value: "+92-3264521524",
    href: null,
    hint: "Available during business hours",
  },
  // {
  //   label: "Office",
  //   value: "Add company address",
  //   href: null,
  //   hint: "Meetings by appointment",
  // },
] as const;
