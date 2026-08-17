import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { TechnologySection } from "@/components/sections/TechnologySection";
import { Process } from "@/components/sections/Process";
import { CTA } from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "About — How Synctech builds and supports technology",
  description:
    "Synctech Limited is a technology company building software, AI automation, cloud infrastructure and secure systems — and supporting them long after launch.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About | Synctech Limited",
    description:
      "How Synctech Limited builds software, automates operations, secures infrastructure and supports systems after launch.",
    url: "/about",
  },
};

const principles = [
  {
    title: "Understand the business first",
    body: "Requirements are an output, not an input. We ask how the work happens today before proposing what should replace it.",
  },
  {
    title: "Proven where it counts",
    body: "New technology on the edges, dependable technology on the critical path. Your payment flow is not the place to experiment.",
  },
  {
    title: "Own the whole stack",
    body: "Interface, API, database, server, pipeline. When one team is responsible for all of it, problems stop being someone else's.",
  },
  {
    title: "Write it down",
    body: "Architecture decisions, environment setup and runbooks are part of delivery. You should never be locked in by missing documentation.",
  },
  {
    title: "Secure by default",
    body: "Access control, secrets handling and dependency hygiene are build-time decisions, not a phase that gets cut when time runs short.",
  },
  {
    title: "Stay after launch",
    body: "Launch is the start of the system's life. Monitoring, updates and improvements are how it stays worth what you paid for it.",
  },
];

const honesty = [
  {
    claim: "We won't promise an unbreakable system.",
    reality:
      "No one can. We reduce exposure, document what remains, and tell you where the real risk sits.",
  },
  {
    claim: "We won't quote before we understand the scope.",
    reality:
      "A number given too early is a number that changes later. We define the work first, then price it.",
  },
  {
    claim: "We won't hand you a system you can't leave.",
    reality:
      "Code, infrastructure and documentation are yours. Standard tooling, no artificial lock-in.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={
          <>
            We build technology that helps businesses{" "}
            <span className="text-gradient-accent">
              grow, automate, secure and scale.
            </span>
          </>
        }
        lead="Synctech Limited is a technology company working across software, AI, cloud and security. We take on the parts of a business that depend on systems working — and stay responsible for them."
      />

      {/* Narrative */}
      <Section className="pt-4!">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="panel p-7 sm:p-10">
              <h2 className="text-xl font-semibold text-chalk sm:text-2xl">
                What we actually do
              </h2>
              <div className="mt-5 space-y-4 text-[0.9375rem] leading-relaxed text-mist">
                <p>
                  We design and build digital products — websites, web
                  applications, dashboards, portals, e-commerce platforms and
                  mobile apps — and the infrastructure they run on.
                </p>
                <p>
                  Alongside that, we automate the repetitive work businesses do
                  by hand, apply AI where it measurably helps, review how systems
                  are secured, and keep everything monitored and updated once
                  it&apos;s live.
                </p>
                <p>
                  Some clients come to us for one project. Others hand over their
                  whole technology function. Both work.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="panel p-7 sm:p-10">
              <h2 className="text-xl font-semibold text-chalk sm:text-2xl">
                Who we work with
              </h2>
              <div className="mt-5 space-y-4 text-[0.9375rem] leading-relaxed text-mist">
                <p>
                  Businesses that have outgrown their current systems, teams
                  spending too many hours on work software should be doing, and
                  companies that need someone accountable for infrastructure they
                  can&apos;t staff internally.
                </p>
                <p>
                  You do not need a technical brief to talk to us. If you can
                  describe the problem, we can turn it into scope, architecture
                  and a plan.
                </p>
                <p>
                  If a project isn&apos;t a good fit for us, we&apos;ll say so
                  early rather than take it on.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Principles */}
      <Section className="border-t border-white/6">
        <SectionHeading
          eyebrow="How we think"
          title={
            <>
              Principles we don&apos;t{" "}
              <span className="text-gradient-accent">trade away.</span>
            </>
          }
          lead="These are the decisions that get made repeatedly on every project. Writing them down keeps them consistent."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {principles.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 90}>
              <div className="panel panel-interactive h-full p-7">
                <span className="font-mono text-xs tracking-[0.16em] text-slate-dim">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-chalk">
                  {item.title}
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-mist">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Straight talk */}
      <Section className="border-t border-white/6">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <Reveal>
            <h2 className="text-[clamp(1.9rem,5vw,3rem)] leading-[1.08] font-semibold text-chalk">
              Three things we{" "}
              <span className="text-gradient-accent">won&apos;t tell you.</span>
            </h2>
          </Reveal>

          <ul className="space-y-5">
            {honesty.map((item, i) => (
              <Reveal as="li" key={item.claim} delay={i * 90}>
                <div className="panel p-6 sm:p-7">
                  <p className="text-lg font-medium text-chalk">{item.claim}</p>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-mist">
                    {item.reality}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      <TechnologySection />
      <Process />
      <CTA />
    </>
  );
}
