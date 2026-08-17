import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { process } from "@/lib/services";

/**
 * Timeline that flips orientation: vertical rail on mobile, horizontal rail
 * across five columns from `lg` up. One set of markup, two rail positions.
 */
export function Process() {
  return (
    <Section id="process" className="border-t border-white/6">
      <SectionHeading
        eyebrow="How we work"
        title={
          <>
            A process that removes{" "}
            <span className="text-gradient-accent">surprises.</span>
          </>
        }
        lead="You always know what stage the work is in, what it costs, and what happens next."
      />

      <ol className="relative mt-16 grid gap-9 lg:mt-24 lg:grid-cols-5 lg:gap-7">
        {/* Rail */}
        <span
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-[7px] w-px bg-gradient-to-b from-cyan-glow/60 via-brand/45 to-iris/45 lg:top-[7px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-full lg:bg-gradient-to-r lg:from-cyan-glow/60 lg:via-brand/45 lg:to-iris/45"
        />

        {process.map((item, i) => (
          <Reveal
            as="li"
            key={item.step}
            delay={i * 90}
            className="relative pl-10 lg:pt-11 lg:pl-0"
          >
            {/* Node */}
            <span className="absolute top-1 left-0 grid h-3.5 w-3.5 place-items-center lg:top-0 lg:left-0">
              <span className="absolute h-3.5 w-3.5 rounded-full bg-cyan-glow/25" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-cyan-glow shadow-[0_0_10px_2px_rgba(34,211,238,0.5)]" />
            </span>

            <div className="group">
              <span className="font-mono text-xs tracking-[0.16em] text-slate-dim">
                {item.step}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-chalk transition-colors duration-300 group-hover:text-cyan-glow lg:text-xl">
                {item.title}
              </h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-mist">
                {item.body}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
