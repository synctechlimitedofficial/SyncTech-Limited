import Link from "next/link";
import { ServiceIcon } from "@/components/icons";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { AutomationFlow } from "@/components/visuals/AutomationFlow";
import type { Service } from "@/lib/services";

function CapabilityPills({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-lg border border-white/7 bg-white/[0.025] px-2.5 py-1 text-[0.75rem] text-mist transition-colors duration-300 group-hover:border-white/12 group-hover:text-chalk"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function IconTile({ service }: { service: Service }) {
  return (
    <div
      className="relative grid h-13 w-13 shrink-0 place-items-center rounded-2xl border border-white/9 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
      style={{
        background: `linear-gradient(140deg, ${service.accent.from}22, ${service.accent.to}0d)`,
      }}
    >
      <ServiceIcon
        id={service.id}
        className="h-6 w-6 transition-transform duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)] group-hover:rotate-[-6deg] group-hover:scale-110"
        style={{ color: service.accent.from }}
      />
    </div>
  );
}

function CardArrow() {
  return (
    <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-mist transition-colors duration-300 group-hover:text-chalk">
      Discuss this service
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-4 w-4 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </span>
  );
}

export function ServiceCard({ service }: { service: Service }) {
  return (
    <SpotlightCard accent={service.accent.from} className="h-full">
      <Link
        href={`/contact?service=${encodeURIComponent(service.label)}`}
        className="flex h-full flex-col p-7 sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <IconTile service={service} />
          <span className="font-mono text-[2rem] leading-none font-semibold text-white/8">
            {service.number}
          </span>
        </div>

        <h3 className="mt-6 text-xl font-semibold text-chalk">{service.title}</h3>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-mist">
          {service.summary}
        </p>

        <CapabilityPills items={service.capabilities} />

        <div className="mt-auto">
          <CardArrow />
        </div>
      </Link>
    </SpotlightCard>
  );
}

/** Wide, illustrated treatment used for the AI & Automation card. */
export function FeaturedServiceCard({ service }: { service: Service }) {
  return (
    <SpotlightCard accent={service.accent.from} className="h-full">
      <Link
        href={`/contact?service=${encodeURIComponent(service.label)}`}
        className="grid h-full gap-10 p-7 sm:p-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-center lg:gap-12"
      >
        <div>
          <div className="flex items-start justify-between gap-4">
            <IconTile service={service} />
            <span className="font-mono text-[2rem] leading-none font-semibold text-white/8">
              {service.number}
            </span>
          </div>

          <h3 className="mt-6 text-2xl font-semibold text-chalk sm:text-3xl">
            {service.title}
          </h3>
          <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-mist sm:text-base">
            {service.detail}
          </p>

          <CapabilityPills items={service.capabilities} />
          <CardArrow />
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute inset-6 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.22),transparent_70%)] blur-2xl"
          />
          <AutomationFlow className="relative" />
        </div>
      </Link>
    </SpotlightCard>
  );
}
