import { createFileRoute } from "@tanstack/react-router";
import { ContactDetails } from "@/components/ContactDetails";
import { WhatsAppIcon, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Orders — Homely Taste" },
      {
        name: "description",
        content: "Contact Homely Taste to place an order or ask about our baked goods.",
      },
      { property: "og:title", content: "Contact & Orders — Homely Taste" },
      {
        property: "og:description",
        content: "Reach Homely Taste to place your bakery order.",
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
        <div className="mt-10 rounded-3xl bg-secondary p-6 text-secondary-foreground shadow-card sm:p-8">
          <ContactDetails />
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
