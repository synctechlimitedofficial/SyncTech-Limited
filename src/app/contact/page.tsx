import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectForm } from "@/components/forms/ProjectForm";
import { ServiceIcon } from "@/components/icons";
import { services } from "@/lib/services";
import { contactChannels } from "@/lib/site";

export const metadata: Metadata = {
  title: "Start Your Project — Tell us what you need",
  description:
    "Send Synctech Limited your project details — service required, project type, budget range and description — and we'll review your requirements.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Start Your Project | Synctech Limited",
    description:
      "Tell us what you're trying to build. We'll come back with a clear view of scope, approach and cost.",
    url: "/contact",
  },
};

const nextSteps = [
  {
    title: "We read the details",
    body: "Every request is reviewed by an engineer, not a sales queue.",
  },
  {
    title: "We come back with questions",
    body: "Usually the ones that decide scope — users, integrations, data, constraints.",
  },
  {
    title: "You get a clear proposal",
    body: "Approach, architecture, timeline and cost, written so you can compare it against anything else.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Start a project"
        title={
          <>
            Tell us what you&apos;re{" "}
            <span className="text-gradient-accent">trying to build.</span>
          </>
        }
        lead="Fill in what you know. Gaps are fine — if you're not sure about budget, timeline or the right technology, that's part of what we're here to work out."
      />

      <Section className="pt-4!">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,0.85fr)] lg:gap-12">
          {/* Form */}
          <Reveal>
            <Suspense fallback={<FormSkeleton />}>
              <ProjectForm />
            </Suspense>
          </Reveal>

          {/* Sidebar */}
          <div className="flex flex-col gap-5">
            <Reveal delay={80}>
              <div className="panel p-6 sm:p-7">
                <h2 className="font-mono text-[0.6875rem] tracking-[0.18em] text-slate-dim uppercase">
                  What happens next
                </h2>
                <ol className="mt-6 space-y-6">
                  {nextSteps.map((step, i) => (
                    <li key={step.title} className="flex gap-4">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] font-mono text-xs text-cyan-glow">
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="text-[0.9375rem] font-medium text-chalk">
                          {step.title}
                        </h3>
                        <p className="mt-1.5 text-[0.875rem] leading-relaxed text-mist">
                          {step.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="panel p-6 sm:p-7">
                <h2 className="font-mono text-[0.6875rem] tracking-[0.18em] text-slate-dim uppercase">
                  Other ways to reach us
                </h2>
                <ul className="mt-6 space-y-5">
                  {contactChannels.map((channel) => (
                    <li key={channel.label}>
                      <p className="text-[0.75rem] tracking-wide text-slate-dim uppercase">
                        {channel.label}
                      </p>
                      {channel.href ? (
                        <a
                          href={channel.href}
                          className="mt-1 block text-[0.9375rem] text-chalk transition-opacity duration-300 hover:opacity-75"
                        >
                          {channel.value}
                        </a>
                      ) : (
                        <p className="mt-1 text-[0.9375rem] text-mist">
                          {channel.value}
                        </p>
                      )}
                      <p className="mt-1 text-[0.8125rem] text-slate-dim">
                        {channel.hint}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <div className="panel p-6 sm:p-7">
                <h2 className="font-mono text-[0.6875rem] tracking-[0.18em] text-slate-dim uppercase">
                  Services
                </h2>
                <ul className="mt-5 grid gap-2.5">
                  {services.map((service) => (
                    <li
                      key={service.id}
                      className="flex items-center gap-2.5 text-[0.9375rem] text-mist"
                    >
                      <ServiceIcon
                        id={service.id}
                        className="h-4 w-4 shrink-0"
                        style={{ color: service.accent.from }}
                      />
                      {service.label}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  );
}

function FormSkeleton() {
  return (
    <div className="panel p-6 sm:p-9" aria-hidden="true">
      <div className="grid gap-5 sm:grid-cols-2">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-24 rounded bg-white/6" />
            <div className="h-12 rounded-xl bg-white/4" />
          </div>
        ))}
        <div className="space-y-2 sm:col-span-2">
          <div className="h-3 w-32 rounded bg-white/6" />
          <div className="h-40 rounded-xl bg-white/4" />
        </div>
      </div>
    </div>
  );
}
