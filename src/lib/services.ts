export type ServiceId =
  | "web"
  | "mobile"
  | "ai"
  | "cloud"
  | "security"
  | "maintenance";

export type Service = {
  id: ServiceId;
  number: string;
  title: string;
  /** Short line used in nav, footer and dropdowns. */
  label: string;
  summary: string;
  /** Longer positioning copy shown on the services page. */
  detail: string;
  capabilities: string[];
  accent: {
    /** Tailwind-free raw values so SVG + CSS can share them. */
    from: string;
    to: string;
  };
};

export const services: Service[] = [
  {
    id: "web",
    number: "01",
    title: "Web Development",
    label: "Web Development",
    summary:
      "Build modern websites, web applications, dashboards, portals, e-commerce platforms, and scalable SaaS products.",
    detail:
      "We design and engineer web products around how your business actually operates — from a marketing site that converts, to an internal dashboard your team lives in every day. Clean architecture, typed codebases, and interfaces that stay fast as the data grows.",
    capabilities: [
      "Business Websites",
      "E-commerce",
      "Web Applications",
      "Dashboards",
      "Portals",
      "SaaS Platforms",
    ],
    accent: { from: "#4b7cff", to: "#22d3ee" },
  },
  {
    id: "mobile",
    number: "02",
    title: "Mobile Development",
    label: "Mobile Development",
    summary:
      "Create modern mobile experiences for Android, iOS, and cross-platform environments.",
    detail:
      "Mobile is where most of your customers already are. We build apps that feel native on both platforms, work on unreliable connections, and share a codebase where that saves you time without costing you quality.",
    capabilities: [
      "Android",
      "iOS",
      "Cross-platform Apps",
      "Mobile Dashboards",
    ],
    accent: { from: "#22d3ee", to: "#34d399" },
  },
  {
    id: "ai",
    number: "03",
    title: "AI & Automation",
    label: "AI & Automation",
    summary:
      "Help businesses use AI and automation to reduce repetitive work and improve their operations.",
    detail:
      "We start from the work itself — the forms being retyped, the messages being answered twice, the reports assembled by hand — and remove it. AI is applied where it measurably helps, wired into the systems your team already uses.",
    capabilities: [
      "AI Chatbots",
      "Business Automation",
      "AI Customer Support",
      "Document Processing",
      "AI Integrations",
      "Workflow Automation",
    ],
    accent: { from: "#8b5cf6", to: "#22d3ee" },
  },
  {
    id: "cloud",
    number: "04",
    title: "Cloud & Server Engineering",
    label: "Cloud & Server Engineering",
    summary: "Build reliable infrastructure behind modern applications.",
    detail:
      "The part users never see, and the part that decides whether they stay. We architect, deploy and automate the infrastructure your product runs on — with backups that are tested, monitoring that alerts, and deployments that are repeatable.",
    capabilities: [
      "Server Architecture",
      "Cloud Deployment",
      "Domain / DNS",
      "Database Deployment",
      "Backup Systems",
      "Monitoring",
      "Scaling",
      "CI/CD",
    ],
    accent: { from: "#4b7cff", to: "#8b5cf6" },
  },
  {
    id: "security",
    number: "05",
    title: "Cybersecurity",
    label: "Cybersecurity",
    summary:
      "Help businesses identify weaknesses and strengthen their digital infrastructure.",
    detail:
      "Security is a practice, not a product — and no one can promise you an unbreakable system. What we can do is reduce your exposure: review how your applications and infrastructure are configured, find the weaknesses, and close them in priority order.",
    capabilities: [
      "Website Security",
      "Secure Configuration",
      "Vulnerability Assessment",
      "Authentication / Security Reviews",
      "Security Hardening",
      "Security Monitoring",
    ],
    accent: { from: "#34d399", to: "#4b7cff" },
  },
  {
    id: "maintenance",
    number: "06",
    title: "Maintenance & Support",
    label: "Maintenance",
    summary:
      "Your technology doesn't stop needing attention after launch. We keep your systems updated, monitored, secure, and performing.",
    detail:
      "Most systems don't fail on launch day — they drift. Dependencies age, certificates expire, databases slow down, backups quietly stop running. An ongoing partnership means someone is watching all of it, and fixing it before you notice.",
    capabilities: [
      "Website Updates",
      "Security Updates",
      "Server Monitoring",
      "Backups",
      "Bug Fixes",
      "Performance Monitoring",
      "Database Maintenance",
    ],
    accent: { from: "#f0abfc", to: "#4b7cff" },
  },
];

export const serviceOptions = [
  ...services.map((s) => s.label),
  "Other",
] as const;

export const projectTypes = [
  "New build from scratch",
  "Rebuild / redesign of an existing system",
  "Adding features to an existing product",
  "Migration or infrastructure move",
  "Audit or assessment",
  "Ongoing maintenance & support",
  "Not sure yet",
] as const;

export const budgetRanges = [
  "Under $250",
  "$250 – $500",
  "$500 – $1000",
  "$1000+",
  "Ongoing monthly retainer",
  "Prefer to discuss",
] as const;

export const contactMethods = ["Email", "Phone", "Either"] as const;

export const process = [
  {
    step: "01",
    title: "Discover",
    body: "Understand the business, requirements, and goals. We ask about the work before we talk about the technology.",
  },
  {
    step: "02",
    title: "Plan",
    body: "Define the architecture, technology, scope, and strategy — so cost and timeline are understood before a line of code is written.",
  },
  {
    step: "03",
    title: "Build",
    body: "Develop the solution with clean and scalable engineering, in visible increments you can review as they land.",
  },
  {
    step: "04",
    title: "Deploy",
    body: "Launch the system and configure the required infrastructure: environments, domains, databases, backups and pipelines.",
  },
  {
    step: "05",
    title: "Maintain",
    body: "Monitor, secure, optimise, and continuously improve. The relationship doesn't end at handover.",
  },
] as const;

export const differentiators = [
  {
    title: "End-to-End Engineering",
    body: "From idea and development to deployment and maintenance — one team accountable for the whole system, not just one layer of it.",
  },
  {
    title: "Security-Minded",
    body: "Security is considered throughout development and infrastructure, not bolted on after launch when it is most expensive to fix.",
  },
  {
    title: "Scalable by Design",
    body: "We build systems capable of growing alongside the business, so early decisions don't become the ceiling two years later.",
  },
  {
    title: "Modern Technology",
    body: "We use modern development, cloud, automation, and AI technologies — chosen for fit, not for novelty.",
  },
  {
    title: "Long-Term Support",
    body: "We continue supporting clients after their project launches, with monitoring, updates and a direct line to the people who built it.",
  },
] as const;
