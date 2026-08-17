import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceCard, FeaturedServiceCard } from "@/components/ServiceCard";
import { services } from "@/lib/services";

const byId = (id: string) => services.find((s) => s.id === id)!;

/**
 * Bento layout: two lead cards, AI given the full width, then the three
 * supporting capabilities. Order still reads 01 → 06 top to bottom.
 */
export function Services() {
  return (
    <Section id="services">
      <SectionHeading
        eyebrow="Services"
        title={
          <>
            Six capabilities.{" "}
            <span className="text-gradient-accent">One engineering team.</span>
          </>
        }
        lead="Most agencies hand you off between specialists. We cover the whole stack — product, infrastructure, security and the years after launch — so nothing falls between the gaps."
      />

      <div className="mt-14 grid gap-5 lg:mt-20 lg:grid-cols-6">
        <Reveal className="lg:col-span-3">
          <ServiceCard service={byId("web")} />
        </Reveal>
        <Reveal delay={90} className="lg:col-span-3">
          <ServiceCard service={byId("mobile")} />
        </Reveal>

        <Reveal delay={60} className="lg:col-span-6">
          <FeaturedServiceCard service={byId("ai")} />
        </Reveal>

        <Reveal className="lg:col-span-2">
          <ServiceCard service={byId("cloud")} />
        </Reveal>
        <Reveal delay={90} className="lg:col-span-2">
          <ServiceCard service={byId("security")} />
        </Reveal>
        <Reveal delay={180} className="lg:col-span-2">
          <ServiceCard service={byId("maintenance")} />
        </Reveal>
      </div>
    </Section>
  );
}
