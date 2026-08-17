import Link from "next/link";
import { Logo } from "@/components/Logo";
import { services } from "@/lib/services";
import { contactChannels, nav, site } from "@/lib/site";

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="relative border-t border-white/7 bg-abyss/60 px-5 pt-16 pb-10 sm:px-8 sm:pt-20">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent"
      />

      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-block rounded-lg">
              <Logo markId="footer" />
            </Link>
            <p className="mt-5 max-w-xs text-[0.9375rem] leading-relaxed text-mist">
              {site.tagline}
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-dim">
              We build software, automate operations, secure infrastructure, and
              help businesses scale.
            </p>
          </div>

          {/* Company */}
          <nav aria-labelledby="footer-company" className="md:col-span-2">
            <h2
              id="footer-company"
              className="font-mono text-[0.6875rem] tracking-[0.18em] text-slate-dim uppercase"
            >
              Company
            </h2>
            <ul className="mt-5 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-labelledby="footer-services" className="md:col-span-3">
            <h2
              id="footer-services"
              className="font-mono text-[0.6875rem] tracking-[0.18em] text-slate-dim uppercase"
            >
              Services
            </h2>
            <ul className="mt-5 space-y-3">
              {services.map((service) => (
                <li key={service.id}>
                  <FooterLink href={`/services#${service.id}`}>
                    {service.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="md:col-span-3">
            <h2 className="font-mono text-[0.6875rem] tracking-[0.18em] text-slate-dim uppercase">
              Contact
            </h2>
            <ul className="mt-5 space-y-4">
              {contactChannels.map((channel) => (
                <li key={channel.label}>
                  <p className="text-[0.8125rem] text-slate-dim">
                    {channel.label}
                  </p>
                  <p className="mt-0.5 text-[0.9375rem] text-mist">
                    {channel.value}
                  </p>
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className="mt-6 inline-flex text-[0.9375rem] text-cyan-glow transition-opacity duration-300 hover:opacity-75"
            >
              Send a project request →
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/7 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.8125rem] text-slate-dim">
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-slate-dim uppercase">
            Build · Automate · Secure · Scale
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 text-[0.9375rem] text-mist transition-colors duration-300 hover:text-chalk"
    >
      <span className="h-px w-0 bg-cyan-glow transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-3" />
      {children}
    </Link>
  );
}
