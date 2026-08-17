import { Section, Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { differentiators } from "@/lib/services";

/**
 * Deliberately quieter than the services bento: a sticky statement on the left,
 * hairline-separated rows on the right that light up individually on hover.
 */
export function WhySynctec() {
  return (
    <Section id="why" className="border-t border-white/6">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <Eyebrow>Why Synctec</Eyebrow>
          </Reveal>
          <Reveal delay={70}>
            <h2 className="mt-6 text-[clamp(1.9rem,5vw,3.25rem)] leading-[1.08] font-semibold text-chalk">
              Built by people who{" "}
              <span className="text-gradient-accent">stay after launch.</span>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-mist">
              Anyone can ship a first version. The difference shows up in month
              eight — when traffic grows, dependencies age, and someone has to
              answer for the system still running.
            </p>
          </Reveal>
        </div>

        <ul className="border-b border-white/8 lg:pt-2">
          {differentiators.map((item, i) => (
            <Reveal as="li" key={item.title} delay={i * 70}>
              <div className="group relative border-t border-white/8 py-7 transition-colors duration-500 hover:border-white/16 sm:py-8">
                {/* Accent rail that grows in on hover */}
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-0 h-px w-0 bg-gradient-to-r from-cyan-glow to-transparent transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full"
                />
                <div className="flex gap-5 sm:gap-7">
                  <span className="mt-1 font-mono text-sm text-slate-dim transition-colors duration-400 group-hover:text-cyan-glow">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-chalk sm:text-xl">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 max-w-xl text-[0.9375rem] leading-relaxed text-mist">
                      {item.body}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
