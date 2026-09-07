import { useState } from "react";
import { format, addDays, startOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export type Product = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price: number;
  currency: string;
  category: string;
  is_bestseller: boolean;
  sort_order: number;
};

const WHATSAPP_NUMBER = "26662119056";
const NOTICE = "Please place your order at least 2 days before the day you need your baked goods.";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

type Line = { product: Product; qty: number };

function orderReference() {
  return `HT-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

export function OrderModal({
  product,
  products,
  onClose,
}: {
  product: Product;
  products: Product[];
  onClose: () => void;
}) {
  const minDate = startOfDay(addDays(new Date(), 2));

  const [lines, setLines] = useState<Line[]>([{ product, qty: 1 }]);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [showCalendar, setShowCalendar] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [occasion, setOccasion] = useState("");
  const [notes, setNotes] = useState("");
  const [reference] = useState(orderReference);
  const [touched, setTouched] = useState(false);

  const currency = product.currency;
  const total = lines.reduce((sum, l) => sum + Number(l.product.price) * l.qty, 0);
  const valid = name.trim().length > 1 && phone.trim().length >= 6 && !!date && lines.length > 0;

  function toggleProduct(p: Product) {
    setLines((prev) =>
      prev.some((l) => l.product.id === p.id)
        ? prev.filter((l) => l.product.id !== p.id)
        : [...prev, { product: p, qty: 1 }],
    );
  }

  function setQty(id: string, qty: number) {
    setLines((prev) => prev.map((l) => (l.product.id === id ? { ...l, qty: Math.max(1, qty) } : l)));
  }

  function summaryLines() {
    return lines.map(
      (l) =>
        `• ${l.product.name} x${l.qty} — ${l.product.currency} ${(Number(l.product.price) * l.qty).toFixed(2)}`,
    );
  }

  function buildMessage() {
    return [
      `Hello Homely Taste! I would like to place an order.`,
      ``,
      `Order ref: ${reference}`,
      `Name: ${name.trim()}`,
      `Contact: ${phone.trim()}`,
      `Collection / delivery date: ${date ? format(date, "EEEE, d MMMM yyyy") : "-"}`,
      occasion.trim() ? `Occasion: ${occasion.trim()}` : "",
      ``,
      `Items:`,
      ...summaryLines(),
      `Total: ${currency} ${total.toFixed(2)}`,
      notes.trim() ? `\nNotes: ${notes.trim()}` : "",
      ``,
      `Please confirm availability. Thank you!`,
    ]
      .filter((l) => l !== "")
      .join("\n");
  }

  function sendWhatsApp() {
    if (!valid) {
      setTouched(true);
      return;
    }
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  async function downloadPdf() {
    if (!valid) {
      setTouched(true);
      return;
    }
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    let y = 60;
    doc.setFontSize(22);
    doc.text("Homely Taste", 48, y);
    doc.setFontSize(11);
    y += 18;
    doc.text("Handcrafted Delights for Every Occasion", 48, y);
    y += 30;
    doc.setFontSize(14);
    doc.text(`Order form — ${reference}`, 48, y);
    doc.setFontSize(11);
    y += 26;
    const rows = [
      `Name: ${name.trim()}`,
      `Contact: ${phone.trim()}`,
      `Collection / delivery date: ${date ? format(date, "EEEE, d MMMM yyyy") : "-"}`,
      occasion.trim() ? `Occasion: ${occasion.trim()}` : "",
      `Ordered on: ${format(new Date(), "d MMMM yyyy")}`,
    ].filter(Boolean);
    rows.forEach((r) => {
      doc.text(r, 48, y);
      y += 18;
    });
    y += 12;
    doc.setFontSize(13);
    doc.text("Items", 48, y);
    doc.setFontSize(11);
    y += 20;
    summaryLines().forEach((l) => {
      doc.text(l.replace("• ", "- "), 48, y);
      y += 18;
    });
    y += 6;
    doc.setFontSize(13);
    doc.text(`Total: ${currency} ${total.toFixed(2)}`, 48, y);
    doc.setFontSize(11);
    if (notes.trim()) {
      y += 26;
      doc.text(doc.splitTextToSize(`Notes: ${notes.trim()}`, 500), 48, y);
      y += 18 * doc.splitTextToSize(`Notes: ${notes.trim()}`, 500).length;
    }
    y += 30;
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize(NOTICE, 500), 48, y);
    y += 28;
    doc.text("Calls: (+266) 53378522  ·  WhatsApp: (+266) 62119056", 48, y);
    y += 14;
    doc.text("homelytaste.25@gmail.com", 48, y);
    doc.save(`Homely-Taste-Order-${reference}.pdf`);
  }

  const inputClass =
    "mt-1 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-accent/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Order form"
    >
      <div
        className="my-8 w-full max-w-lg rounded-3xl bg-card p-7 shadow-luxe"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-3xl font-semibold">Your Order</h3>
            <p className="mt-1 text-sm text-muted-foreground">Reference {reference}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full px-3 py-1 text-lg text-muted-foreground hover:bg-muted"
          >
            ×
          </button>
        </div>

        <div className="mt-5 rounded-2xl bg-muted p-4">
          <p className="text-sm font-medium">
            <span aria-hidden="true">✦ </span>
            {NOTICE}
          </p>
        </div>

        {/* Items */}
        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Choose items</p>
          <div className="mt-3 space-y-2">
            {products.map((p) => {
              const line = lines.find((l) => l.product.id === p.id);
              return (
                <div
                  key={p.id}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border p-2.5 transition-colors",
                    line ? "border-primary bg-primary/5" : "border-border",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleProduct(p)}
                    className="flex flex-1 items-center gap-3 text-left"
                  >
                    <img src={p.image_url} alt="" className="h-11 w-11 rounded-xl object-cover" />
                    <span className="flex-1">
                      <span className="block text-sm font-semibold">{p.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {p.currency} {Number(p.price).toFixed(2)}
                      </span>
                    </span>
                  </button>
                  {line && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label={`Decrease ${p.name}`}
                        onClick={() => setQty(p.id, line.qty - 1)}
                        className="h-7 w-7 rounded-full bg-muted text-sm font-bold"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{line.qty}</span>
                      <button
                        type="button"
                        aria-label={`Increase ${p.name}`}
                        onClick={() => setQty(p.id, line.qty + 1)}
                        className="h-7 w-7 rounded-full bg-muted text-sm font-bold"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Details */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium sm:col-span-1">
            Your name
            <input
              className={inputClass}
              value={name}
              maxLength={80}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Palesa Mokoena"
            />
          </label>
          <label className="block text-sm font-medium sm:col-span-1">
            Phone number
            <input
              className={inputClass}
              value={phone}
              maxLength={30}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 6211 9056"
            />
          </label>
          <label className="block text-sm font-medium sm:col-span-2">
            Occasion (optional)
            <input
              className={inputClass}
              value={occasion}
              maxLength={80}
              onChange={(e) => setOccasion(e.target.value)}
              placeholder="Birthday, wedding, office treat…"
            />
          </label>
        </div>

        {/* Date */}
        <div className="mt-4">
          <p className="text-sm font-medium">When do you need it?</p>
          <button
            type="button"
            onClick={() => setShowCalendar((s) => !s)}
            className={cn(inputClass, "text-left", !date && "text-muted-foreground")}
          >
            {date ? format(date, "EEEE, d MMMM yyyy") : "Pick a date (2+ days from today)"}
          </button>
          {showCalendar && (
            <div className="mt-2 rounded-2xl border border-border bg-background p-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  setDate(d);
                  if (d) setShowCalendar(false);
                }}
                disabled={{ before: minDate }}
                startMonth={minDate}
                defaultMonth={minDate}
                className="pointer-events-auto p-3"
              />
            </div>
          )}
        </div>

        <label className="mt-4 block text-sm font-medium">
          Special requests (optional)
          <textarea
            className={cn(inputClass, "min-h-24 resize-y")}
            value={notes}
            maxLength={500}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Message on the cake, flavours, allergies, delivery area…"
          />
        </label>

        <div className="mt-5 flex items-center justify-between rounded-2xl bg-muted px-4 py-3">
          <span className="text-sm font-medium">Estimated total</span>
          <span className="text-lg font-semibold text-primary">
            {currency} {total.toFixed(2)}
          </span>
        </div>

        {touched && !valid && (
          <p className="mt-3 text-sm text-destructive">
            Please add your name, phone number and a date at least 2 days from today.
          </p>
        )}

        <button
          onClick={sendWhatsApp}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-base font-semibold text-white transition-transform hover:scale-[1.02]"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Send Order on WhatsApp
        </button>
        <button
          onClick={downloadPdf}
          className="mt-3 w-full rounded-full border-2 border-accent px-6 py-3 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Download order form (PDF) to attach
        </button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          WhatsApp cannot attach files automatically — download the PDF, then attach it in the chat
          if you'd like a printed copy of your order.
        </p>
      </div>
    </div>
  );
}
