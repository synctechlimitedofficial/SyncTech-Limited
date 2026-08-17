import Link from "next/link";
import { ArrowGlyph } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { HeroVisual } from "@/components/visuals/HeroVisual";
import { ServiceIcon } from "@/components/icons";
import { services } from "@/lib/services";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pt-28 pb-20 sm:px-8 sm:pt-36 lg:pt-44 lg:pb-28">
      {/* Technical grid backdrop */}
      <div aria-hidden="true" className="grid-fade absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-void to-transparent"
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-10">
        {/* Copy */}
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>Software · AI · Cloud · Security</Eyebrow>
          </Reveal>

          <Reveal delay={90}>
            <h1 className="mt-7 text-[clamp(2.6rem,8vw,4.75rem)] leading-[1.02] font-semibold">
              <span className="block text-chalk">Build. Automate.</span>
              <span className="text-gradient block">Secure. Scale.</span>
            </h1>
          </Reveal>

          <Reveal delay={170}>
            <p className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-mist sm:text-lg">
              Synctech Limited builds modern digital products, AI-powered
              solutions, cloud infrastructure, and secure systems that help
              businesses grow.
            </p>
          </Reveal>

          <Reveal delay={250}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/contact" className="btn btn-primary group px-6 py-3.5 text-base">
                Start Your Project
                <ArrowGlyph />
              </Link>
              <Link href="/services" className="btn btn-ghost px-6 py-3.5 text-base">
                Explore Services
              </Link>
            </div>
          </Reveal>

          {/* Capability strip */}
          <Reveal delay={330}>
            <div className="mt-14 border-t border-white/6 pt-7">
              <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-slate-dim uppercase">
                What we do
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
                {services.map((service) => (
                  <li key={service.id}>
                    <Link
                      href={`/services#${service.id}`}
                      className="group inline-flex items-center gap-2 text-[0.8125rem] text-mist transition-colors duration-300 hover:text-chalk"
                    >
                      <ServiceIcon
                        id={service.id}
                        className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
                        style={{ color: service.accent.from }}
                      />
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Visual */}
        <Reveal delay={200} className="lg:pl-4">
          <HeroVisual />
        </Reveal>
      </div>
    </section>
  );
}
