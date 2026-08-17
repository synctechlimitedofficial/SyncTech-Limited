import type { ServiceId } from "./services";

/**
 * Portfolio / selected work.
 *
 * SAFETY RULE: only entries with `status: "published"` are ever rendered. If
 * nothing is published the homepage Work section is omitted, "Work" disappears
 * from the navigation, and /work returns a 404 rather than an empty page.
 */

export type Project = {
  /** URL-safe id, used for the #anchor. */
  slug: string;
  status: "draft" | "published";
  /** What the project is, e.g. "Fleet dispatch portal". */
  title: string;
  /**
   * Who it was for. A named client where you have permission, otherwise a
   * sector — "A distributor in FMCG". Never invent either.
   */
  client: string;
  /** e.g. "2025". Leave blank rather than guessing — it simply won't render. */
  year: string;
  /** Ties the project to your services; drives the icon, accent and illustration. */
  services: ServiceId[];
  /** The situation before you got involved. */
  problem: string;
  /** What you actually delivered. Concrete beats impressive. */
  build: string;
  /**
   * OPTIONAL. Technologies genuinely used. Omit rather than guess — the chips
   * are simply not rendered when this is absent.
   */
  stack?: string[];
  /**
   * OPTIONAL and only if it is true and you can back it up. A vague honest line
   * beats an invented number. Omit entirely rather than estimating.
   */
  outcome?: string;
  /** Public URL, if the work is publicly visible and the client is happy. */
  href?: string;
};

/**
 * ─────────────────────────────────────────────────────────────────────────
 * STILL TO FILL IN
 *
 * `stack`   — the real technologies used on each project. Prospects with
 *             technical staff will ask, and it's the detail that separates a
 *             portfolio from a brochure.
 * `year`    — when each was delivered.
 * `outcome` — only where you have a result you can defend. Leave the rest off.
 * `href`    — for any that are publicly visible and the client is happy to link.
 *
 * Order matters: the homepage shows the first three, /work shows all of them.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const projects: Project[] = [
  {
    slug: "quickserve-order-assistant",
    status: "published",
    title: "AI order-taking assistant",
    client: "QuickServe Restaurants",
    year: "",
    services: ["ai"],
    problem:
      "A multi-location restaurant business overwhelmed by the volume of phone orders coming into each site.",
    build:
      "A chatbot and voice assistant that takes orders end to end, answers questions about the menu, and syncs straight into the existing POS system.",
    href: "",
  },
  {
    slug: "urbaneats-delivery-apps",
    status: "published",
    title: "Food delivery apps",
    client: "UrbanEats",
    year: "",
    services: ["mobile"],
    problem:
      "A regional food delivery startup competing against national players with far larger product teams.",
    build:
      "A customer app and a separate driver app, with live GPS tracking, order status updates and in-app payments.",
    href: "",
  },
  {
    slug: "horizon-realty-listings",
    status: "published",
    title: "Property listings platform",
    client: "Horizon Realty",
    year: "",
    services: ["web"],
    problem:
      "A boutique real estate agency needing a modern site to present its listings properly.",
    build:
      "Property search with filters and a map view, a lead capture form, and a dashboard for agents to manage their own listings.",
    href: "",
  },
  {
    slug: "payflow-pentest-compliance",
    status: "published",
    title: "Penetration test & compliance prep",
    client: "PayFlow Fintech",
    year: "",
    services: ["security"],
    problem:
      "A fintech startup working towards SOC 2 and PCI-DSS readiness, without a clear picture of where it stood.",
    build:
      "A penetration test with documented vulnerability findings, plus a compliance gap analysis mapped against both standards.",
    href: "",
  },
  {
    slug: "brightpath-resume-screening",
    status: "published",
    title: "Resume screening automation",
    client: "BrightPath Recruiting",
    year: "",
    services: ["ai"],
    problem:
      "A recruiting agency drowning in applications, with screening time crowding out actual recruiting.",
    build:
      "A tool that parses résumés, scores candidates against the criteria for each role, and automatically emails the strongest matches.",
    href: "",
  },
  {
    slug: "pulsefit-training-app",
    status: "published",
    title: "Personal training app",
    client: "PulseFit",
    year: "",
    services: ["mobile"],
    problem:
      "An independent personal trainer wanting to scale beyond what one-to-one sessions allow.",
    build:
      "Workout plans, progress tracking, video demonstrations, and push notification reminders to keep clients on schedule.",
    href: "",
  },
  {
    slug: "greenleaf-organics-store",
    status: "published",
    title: "Grocery ordering & delivery platform",
    client: "GreenLeaf Organics",
    year: "",
    services: ["web"],
    problem:
      "A small organic grocery store with no way to take orders online or let customers schedule a delivery.",
    build:
      "A product catalogue with cart and checkout, a delivery slot picker, and an admin panel for managing inventory.",
    href: "",
  },
  {
    slug: "meridian-security-audit",
    status: "published",
    title: "Security audit & hardening",
    client: "Meridian Law Firm",
    year: "",
    services: ["security"],
    problem:
      "A law firm holding sensitive client data, concerned about its exposure to a breach.",
    build:
      "A full audit across network, endpoints and email security, a prioritised remediation plan, and a before-and-after risk score.",
    href: "",
  },
  {
    slug: "nimbus-automated-reporting",
    status: "published",
    title: "Automated client reporting",
    client: "Nimbus Marketing Agency",
    year: "",
    services: ["ai"],
    problem:
      "A digital marketing agency losing hours every month assembling client reports by hand.",
    build:
      "An automation that pulls data from the Google Ads, Meta and Analytics APIs and generates branded PDF reports without anyone touching them.",
    href: "",
  },
  {
    slug: "campusconnect-student-app",
    status: "published",
    title: "University event & club app",
    client: "CampusConnect",
    year: "",
    services: ["mobile"],
    problem:
      "A university student affairs office with events and club information scattered across too many places.",
    build:
      "An event calendar, a club directory, an RSVP system, and push notifications for announcements.",
    href: "",
  },
  {
    slug: "fitcore-membership-booking",
    status: "published",
    title: "Membership & class booking site",
    client: "FitCore Gym",
    year: "",
    services: ["web"],
    problem:
      "A local gym chain needing members to sign up and book classes without going through the front desk.",
    build:
      "A class schedule, online membership signup, trainer profiles, and integrated payments.",
    href: "",
  },
  {
    slug: "coastal-phishing-simulation",
    status: "published",
    title: "Employee phishing simulation",
    client: "Coastal Retail Co.",
    year: "",
    services: ["security"],
    problem:
      "A retail chain concerned about attacks aimed at its employees rather than its systems.",
    build:
      "A simulated phishing campaign, a training programme built from the results, and an awareness metrics dashboard.",
    href: "",
  },
];

/** The only list any component should render. */
export const publishedProjects = projects.filter(
  (project) => project.status === "published",
);

export const hasPublishedWork = publishedProjects.length > 0;
