import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { WhySynctech } from "@/components/sections/WhySynctech";
import { TechnologySection } from "@/components/sections/TechnologySection";
import { SecuritySection } from "@/components/sections/SecuritySection";
import { Process } from "@/components/sections/Process";
import { CTA } from "@/components/sections/CTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      {/* Renders nothing until a project is published. */}
      <Work />
      <WhySynctech />
      <TechnologySection />
      <SecuritySection />
      <Process />
      <CTA />
    </>
  );
}
