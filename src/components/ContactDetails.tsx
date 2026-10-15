import { CALL_NUMBER, CONTACT_EMAIL, WHATSAPP_NUMBER } from "@/lib/site";

export function ContactDetails() {
  return (
    <div className="space-y-6 text-sm">
      <section className="space-y-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-[2px] text-secondary-foreground/50">
          Contact
        </h2>
        <p>
          <a href={`tel:+${WHATSAPP_NUMBER}`} className="hover:text-primary">
            +266 53378522
          </a>{" "}
          — Calls &amp; WhatsApp · WhatsApp:{" "}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
            aria-label="Message Homely Taste on WhatsApp at +266 53378522"
          >
            +266 53378522
          </a>
        </p>
        <p>
          <a href={`tel:+${CALL_NUMBER}`} className="hover:text-primary">
            +266 62119056
          </a>{" "}
          — Calls only
        </p>
        <p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-primary">
            {CONTACT_EMAIL}
          </a>
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-[2px] text-secondary-foreground/50">
          Order &amp; Payment
        </h2>
        <p>50% deposit guarantees an order placement</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-[2px] text-secondary-foreground/50">
          Banking (EFT)
        </h2>
        <div className="font-mono text-sm leading-relaxed">
          <p>First National Bank</p>
          <p>Branch Code: 280061</p>
          <p>Acc #: 63220526941</p>
          <p>Acc Name: Homely Taste</p>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-[2px] text-secondary-foreground/50">
          Mpesa
        </h2>
        <p className="font-mono">Merchant: 68666 — Homely Taste</p>
      </section>
    </div>
  );
}
