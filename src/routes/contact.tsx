import { createFileRoute } from "@tanstack/react-router";
import {
  CALL_NUMBER,
  EMAIL,
  NOTICE,
  WHATSAPP_DISPLAY,
  WhatsAppIcon,
  whatsappLink,
} from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Orders — Homely Taste" },
      {
        name: "description",
        content:
          "Call (+266) 62119056, WhatsApp (+266) 53378522 or email homelytaste.25@gmail.com to order from Homely Taste. Two days' notice, please.",
      },
      { property: "og:title", content: "Contact & Orders — Homely Taste" },
      {
        property: "og:description",
        content: "Reach Homely Taste by call, WhatsApp or email to place your bakery order.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <section className="bg-accent py-20">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
          Get In Touch
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-accent-foreground md:text-5xl">
          Ready to Order?
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-accent-foreground/70">{NOTICE}</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <a
            href="tel:+26662119056"
            className="rounded-3xl bg-secondary p-6 transition-transform hover:-translate-y-1"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Calls Only
            </p>
            <p className="mt-2 text-lg font-medium text-secondary-foreground">{CALL_NUMBER}</p>
          </a>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-3xl bg-secondary p-6 transition-transform hover:-translate-y-1"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">WhatsApp</p>
            <p className="mt-2 text-lg font-medium text-secondary-foreground">
              {WHATSAPP_DISPLAY}
            </p>
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="rounded-3xl bg-secondary p-6 transition-transform hover:-translate-y-1"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Email</p>
            <p className="mt-2 text-lg font-medium break-all text-secondary-foreground">{EMAIL}</p>
          </a>
        </div>

        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-10 py-4 text-lg font-semibold text-white transition-transform hover:scale-[1.03]"
        >
          <WhatsAppIcon className="h-6 w-6" />
          Order via WhatsApp
        </a>
      </div>
    </section>
  );
}
