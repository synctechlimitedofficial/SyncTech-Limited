import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowGlyph } from "@/components/ui/Button";
import { ServiceIcon, CheckIcon } from "@/components/icons";
import { Process } from "@/components/sections/Process";
import { CTA } from "@/components/sections/CTA";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services — Software, Mobile, AI, Cloud, Security & Maintenance",
  description:
    "Web and mobile development, AI and automation, cloud and server engineering, cybersecurity, and ongoing maintenance from Synctech Limited.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services | Synctech Limited",
    description:
      "Web and mobile development, AI and automation, cloud and server engineering, cybersecurity, and ongoing maintenance.",
    url: "/services",
  },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={
          <>
            Everything your technology needs,{" "}
            <span className="text-gradient-accent">under one team.</span>
          </>
        }
        lead="Six capabilities that fit together. Start with one, or hand us the whole system — the engineering standard is the same either way."
      >
        {/* Jump links double as an at-a-glance summary */}
        <ul className="mt-9 flex flex-wrap gap-2">
          {services.map((service) => (
            <li key={service.id}>
              <Link
                href={`#${service.id}`}
                className="group inline-flex items-center gap-2 rounded-xl border border-white/9 bg-white/[0.03] px-3.5 py-2 text-[0.8125rem] text-mist transition-all duration-300 hover:border-white/20 hover:text-chalk"
              >
                <span className="font-mono text-[0.6875rem] text-slate-dim">
                  {service.number}
                </span>
                {service.label}
              </Link>
            </li>
          ))}
        </ul>
      </PageHeader>

      <Section className="pt-4!">
        <div className="flex flex-col gap-5">
          {services.map((service) => (
            <Reveal key={service.id} id={service.id} className="scroll-mt-28">
              <article className="panel group relative overflow-hidden p-7 sm:p-10">
                {/* Accent wash keyed to the service */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-32 -right-24 h-72 w-72 rounded-full opacity-25 blur-3xl transition-opacity duration-700 group-hover:opacity-45"
                  style={{
                    background: `radial-gradient(circle, ${service.accent.from}, transparent 70%)`,
                  }}
                />

                <div className="relative grid gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-14">
                  <div>
                    <div className="flex items-center gap-4">
                      <span
                        className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10"
                        style={{
                          background: `linear-gradient(140deg, ${service.accent.from}26, ${service.accent.to}0d)`,
                        }}
                      >
                        <ServiceIcon
                          id={service.id}
                          className="h-6 w-6"
                          style={{ color: service.accent.from }}
                        />
                      </span>
                      <span className="font-mono text-sm tracking-[0.16em] text-slate-dim">
                        {service.number}
                      </span>
                    </div>

                    <h2 className="mt-6 text-2xl font-semibold text-chalk sm:text-[2rem]">
                      {service.title}
                    </h2>
                    <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-mist">
                      {service.summary}
                    </p>
                    <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-slate-dim">
                      {service.detail}
                    </p>

                    <Link
                      href={`/contact?service=${encodeURIComponent(service.label)}`}
                      className="btn btn-ghost group/cta mt-8"
                    >
                      Start a {service.label.toLowerCase()} project
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </Link>
                  </div>

                  <div className="rounded-2xl border border-white/7 bg-white/[0.02] p-6">
                    <h3 className="font-mono text-[0.6875rem] tracking-[0.18em] text-slate-dim uppercase">
                      What&apos;s included
                    </h3>
                    <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                      {service.capabilities.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2.5 text-[0.9375rem] text-mist"
                        >
                          <CheckIcon
                            className="h-3.5 w-3.5 shrink-0"
                            style={{ color: service.accent.from }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={100}>
          <p className="mt-10 text-center text-[0.9375rem] text-slate-dim">
            Need something that isn&apos;t listed?{" "}
            <Link
              href="/contact?service=Other"
              className="group inline-flex items-center gap-1.5 text-cyan-glow transition-opacity duration-300 hover:opacity-75"
            >
              Tell us what you need
              <ArrowGlyph />
            </Link>
          </p>
        </Reveal>
      </Section>

      <Process />
      <CTA />
    </>
  );
}
