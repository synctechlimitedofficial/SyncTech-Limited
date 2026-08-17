import Link from "next/link";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowGlyph } from "@/components/ui/Button";
import { CheckIcon } from "@/components/icons";
import { SecurityVisual } from "@/components/visuals/SecurityVisual";

const practices = [
  {
    title: "Vulnerability Assessment",
    body: "Review applications and infrastructure for known weaknesses, then rank what to fix by real exposure rather than severity score alone.",
  },
  {
    title: "Secure Configuration",
    body: "Servers, databases, storage and third-party services set up the way they should have been from the start.",
  },
  {
    title: "Authentication Reviews",
    body: "How accounts are created, verified, recovered and revoked — usually where the practical risk sits.",
  },
  {
    title: "Hardening & Monitoring",
    body: "Reduce the attack surface, then watch what remains, so unusual activity is noticed rather than discovered later.",
  },
];

export function SecuritySection() {
  return (
    <Section id="security" className="border-t border-white/6">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
        <Reveal className="order-2 lg:order-1">
          <SecurityVisual />
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <Eyebrow>Cybersecurity</Eyebrow>
          </Reveal>
          <Reveal delay={70}>
            <h2 className="mt-6 text-[clamp(1.9rem,5vw,3.25rem)] leading-[1.08] font-semibold text-chalk">
              Security is a practice,{" "}
              <span className="text-gradient-accent">not a promise.</span>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-mist">
              No one can honestly tell you a system is unbreakable. What we can
              do is narrow your exposure: understand how your applications and
              infrastructure are configured, find the weaknesses that matter,
              and close them in priority order.
            </p>
          </Reveal>

          <ul className="mt-9 space-y-5">
            {practices.map((item, i) => (
              <Reveal as="li" key={item.title} delay={200 + i * 70}>
                <div className="flex gap-4">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border border-mint/25 bg-mint/10 text-mint">
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <h3 className="text-[0.9375rem] font-semibold text-chalk">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-mist">
                      {item.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={500}>
            <Link
              href="/contact?service=Cybersecurity"
              className="btn btn-ghost group mt-9"
            >
              Request a security review
              <ArrowGlyph />
            </Link>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
