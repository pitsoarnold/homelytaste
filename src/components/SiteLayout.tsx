import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ContactDetails } from "@/components/ContactDetails";
import { NOTICE, WhatsAppIcon, whatsappLink } from "@/lib/site";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function NoticeBanner() {
  return (
    <div className="bg-primary px-4 py-2.5 text-center">
      <p className="text-sm font-medium tracking-wide text-primary-foreground">
        <span aria-hidden="true">✦ </span>
        {NOTICE}
        <span aria-hidden="true"> ✦</span>
      </p>
    </div>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <NoticeBanner />

      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 leading-none">
          <Link to="/" className="flex items-center gap-3 leading-none">
            <img
              src="/logo.jpg"
              alt="Homely Taste logo"
              className="block h-12 w-auto object-contain"
            />
            <span className="font-display text-2xl leading-none font-semibold tracking-wide">
              Homely Taste
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium tracking-wide md:flex">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeProps={{ className: "text-primary font-semibold" }}
                activeOptions={{ exact: l.to === "/" }}
                className="transition-colors hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.03]"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Order via WhatsApp</span>
            <span className="sm:hidden">Order</span>
          </a>
        </div>
        <nav className="flex items-center justify-center gap-6 border-t border-border/50 px-4 py-2 text-sm font-medium md:hidden">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "text-primary font-semibold" }}
              activeOptions={{ exact: l.to === "/" }}
              className="transition-colors hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </header>

      <main>{children}</main>

      <footer className="bg-secondary py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center">
          <img
            src="/logo.jpg"
            alt="Homely Taste logo"
            className="block h-16 w-auto object-contain"
          />
          <p className="font-display text-xl text-secondary-foreground">
            Handcrafted Delights for Every Occasion
          </p>
          <nav className="flex flex-wrap justify-center gap-5 text-sm text-secondary-foreground/80">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className="hover:text-primary">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="text-secondary-foreground/80">
            <ContactDetails />
          </div>
          <p className="text-xs text-secondary-foreground/40">
            © {new Date().getFullYear()} Homely Taste. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
