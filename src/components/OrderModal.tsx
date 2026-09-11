import { useState } from "react";
import { format, addDays, startOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import logoAsset from "@/assets/logo.asset.json";
import { saveOrder, type OrderItem } from "@/lib/orders";

export type SizeOption = { label: string; price: number };

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
  size_options?: SizeOption[] | null;
};

export function sizesOf(p: Product): SizeOption[] {
  const s = p.size_options;
  return Array.isArray(s) && s.length > 0 ? s : [{ label: "Standard", price: Number(p.price) }];
}

const WHATSAPP_NUMBER = "26653378522";
const NOTICE = "Please place your order at least 2 days before the day you need your baked goods.";
const CATEGORY_ORDER = ["Biscuits", "Rusks", "Mini Cakes", "Muffins & Scones", "Tartlets"];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

type Line = { product: Product; qty: number; size: SizeOption };

function orderReference() {
  return `HT-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

async function loadLogo(): Promise<string | null> {
  try {
    const res = await fetch(logoAsset.url);
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
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

  const [lines, setLines] = useState<Line[]>([{ product, qty: 1, size: sizesOf(product)[0]! }]);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [showCalendar, setShowCalendar] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [occasion, setOccasion] = useState("");
  const [notes, setNotes] = useState("");
  const [reference] = useState(orderReference);
  const [touched, setTouched] = useState(false);
  const [saved, setSaved] = useState(false);

  const currency = product.currency;
  const total = lines.reduce((sum, l) => sum + Number(l.size.price) * l.qty, 0);
  const valid = name.trim().length > 1 && phone.trim().length >= 6 && !!date && lines.length > 0;

  const query = search.trim().toLowerCase();
  const visible = products.filter(
    (p) =>
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      lines.some((l) => l.product.id === p.id),
  );
  const grouped = [...visible.reduce<Map<string, Product[]>>((acc, p) => {
    acc.set(p.category, [...(acc.get(p.category) ?? []), p]);
    return acc;
  }, new Map())].sort(
    (a, b) => (CATEGORY_ORDER.indexOf(a[0]) + 1 || 99) - (CATEGORY_ORDER.indexOf(b[0]) + 1 || 99),
  );

  function toggleProduct(p: Product) {
    setLines((prev) =>
      prev.some((l) => l.product.id === p.id)
        ? prev.filter((l) => l.product.id !== p.id)
        : [...prev, { product: p, qty: 1, size: sizesOf(p)[0]! }],
    );
  }

  function setQty(id: string, qty: number) {
    setLines((prev) => prev.map((l) => (l.product.id === id ? { ...l, qty: Math.max(1, qty) } : l)));
  }

  function setSize(id: string, label: string) {
    setLines((prev) =>
      prev.map((l) =>
        l.product.id === id
          ? { ...l, size: sizesOf(l.product).find((s) => s.label === label) ?? l.size }
          : l,
      ),
    );
  }

  function orderItems(): OrderItem[] {
    return lines.map((l) => ({
      name: l.product.name,
      category: l.product.category,
      size: l.size.label,
      qty: l.qty,
      unit_price: Number(l.size.price),
      line_total: Number(l.size.price) * l.qty,
    }));
  }

  function summaryLines() {
    return lines.map(
      (l) =>
        `• ${l.product.name} — ${l.size.label} x${l.qty} — ${l.product.currency} ${(Number(l.size.price) * l.qty).toFixed(2)}`,
    );
  }

  async function persist() {
    if (saved || !date) return;
    try {
      await saveOrder({
        reference,
        customer_name: name.trim(),
        phone: phone.trim(),
        occasion: occasion.trim() || null,
        needed_date: format(date, "yyyy-MM-dd"),
        notes: notes.trim() || null,
        items: orderItems(),
        total,
        currency,
      });
      setSaved(true);
    } catch (err) {
      console.error("Could not save order", err);
    }
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

  async function sendWhatsApp() {
    if (!valid) {
      setTouched(true);
      return;
    }
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`;
    window.open(url, "_blank", "noopener,noreferrer");
    await persist();
  }

  async function downloadPdf() {
    if (!valid) {
      setTouched(true);
      return;
    }
    const [{ jsPDF }, logo] = await Promise.all([import("jspdf"), loadLogo()]);
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const brown: [number, number, number] = [43, 26, 18];
    const gold: [number, number, number] = [212, 175, 55];
    const cream: [number, number, number] = [245, 241, 232];

    // Header band
    doc.setFillColor(...brown);
    doc.rect(0, 0, pageW, 120, "F");
    if (logo) {
      try {
        doc.addImage(logo, "PNG", 40, 22, 76, 76);
      } catch {
        /* ignore unsupported image */
      }
    }
    doc.setTextColor(...gold);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.text("Homely Taste", logo ? 132 : 40, 58);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(245, 241, 232);
    doc.setFontSize(11);
    doc.text("Handcrafted Delights for Every Occasion", logo ? 132 : 40, 78);
    doc.setFontSize(10);
    doc.text(`Order form · ${reference}`, logo ? 132 : 40, 96);

    // Gold rule
    doc.setFillColor(...gold);
    doc.rect(0, 120, pageW, 5, "F");

    // Customer details card
    let y = 155;
    doc.setFillColor(...cream);
    doc.roundedRect(40, y, pageW - 80, 96, 10, 10, "F");
    doc.setTextColor(...brown);
    doc.setFontSize(11);
    const details: [string, string][] = [
      ["Name", name.trim()],
      ["Contact", phone.trim()],
      ["Needed on", date ? format(date, "EEEE, d MMMM yyyy") : "-"],
      ["Occasion", occasion.trim() || "—"],
    ];
    let dy = y + 24;
    details.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, 58, dy);
      doc.setFont("helvetica", "normal");
      doc.text(value, 140, dy);
      dy += 19;
    });
    y += 126;

    // Items table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Your Order", 40, y);
    y += 14;

    const cols = [46, 220, 330, 400, 470];
    doc.setFillColor(...brown);
    doc.rect(40, y, pageW - 80, 24, "F");
    doc.setTextColor(...gold);
    doc.setFontSize(10);
    doc.text("Item", cols[0]!, y + 16);
    doc.text("Category", cols[1]!, y + 16);
    doc.text("Size", cols[2]!, y + 16);
    doc.text("Qty", cols[3]!, y + 16);
    doc.text("Amount", cols[4]!, y + 16);
    y += 24;

    doc.setFont("helvetica", "normal");
    orderItems().forEach((item, i) => {
      if (y > 720) {
        doc.addPage();
        y = 60;
      }
      if (i % 2 === 0) {
        doc.setFillColor(250, 247, 240);
        doc.rect(40, y, pageW - 80, 22, "F");
      }
      doc.setTextColor(...brown);
      doc.setFontSize(10);
      doc.text(doc.splitTextToSize(item.name, 165)[0] ?? item.name, cols[0]!, y + 15);
      doc.text(item.category, cols[1]!, y + 15);
      doc.text(doc.splitTextToSize(item.size, 62)[0] ?? item.size, cols[2]!, y + 15);
      doc.text(String(item.qty), cols[3]!, y + 15);
      doc.text(`${currency} ${item.line_total.toFixed(2)}`, cols[4]!, y + 15);
      y += 22;
    });

    // Total bar
    y += 10;
    doc.setFillColor(...gold);
    doc.roundedRect(pageW - 260, y, 220, 34, 8, 8, "F");
    doc.setTextColor(...brown);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("TOTAL", pageW - 244, y + 22);
    doc.text(`${currency} ${total.toFixed(2)}`, pageW - 60, y + 22, { align: "right" });
    y += 60;

    if (notes.trim()) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Special requests", 40, y);
      y += 16;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const wrapped = doc.splitTextToSize(notes.trim(), pageW - 100);
      doc.text(wrapped, 40, y);
      y += wrapped.length * 14 + 10;
    }

    // Notice + footer
    doc.setFillColor(...cream);
    doc.roundedRect(40, y, pageW - 80, 40, 8, 8, "F");
    doc.setTextColor(...brown);
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize(NOTICE, pageW - 120), 56, y + 24);

    const footerY = doc.internal.pageSize.getHeight() - 54;
    doc.setFillColor(...brown);
    doc.rect(0, footerY, pageW, 54, "F");
    doc.setTextColor(245, 241, 232);
    doc.setFontSize(9);
    doc.text("Calls: (+266) 62119056   ·   WhatsApp: (+266) 53378522", 40, footerY + 22);
    doc.text("homelytaste.25@gmail.com", 40, footerY + 38);
    doc.setTextColor(...gold);
    doc.text(`Ordered on ${format(new Date(), "d MMMM yyyy")}`, pageW - 40, footerY + 22, {
      align: "right",
    });

    doc.save(`Homely-Taste-Order-${reference}.pdf`);
    await persist();
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
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Choose items
            </p>
            <span className="text-xs text-muted-foreground">{lines.length} selected</span>
          </div>
          <input
            className={inputClass}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items or categories…"
          />

          <div className="mt-3 max-h-80 space-y-4 overflow-y-auto pr-1">
            {grouped.map(([category, items]) => (
              <div key={category}>
                <p className="sticky top-0 bg-card py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {category}
                </p>
                <div className="space-y-2">
                  {items.map((p) => {
                    const line = lines.find((l) => l.product.id === p.id);
                    const sizes = sizesOf(p);
                    return (
                      <div
                        key={p.id}
                        className={cn(
                          "rounded-2xl border p-2.5 transition-colors",
                          line ? "border-primary bg-primary/5" : "border-border",
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => toggleProduct(p)}
                          className="flex w-full items-center gap-3 text-left"
                        >
                          <img
                            src={p.image_url}
                            alt=""
                            className="h-11 w-11 rounded-xl object-cover"
                          />
                          <span className="flex-1">
                            <span className="block text-sm font-semibold">{p.name}</span>
                            <span className="block text-xs text-muted-foreground">
                              from {p.currency}{" "}
                              {Math.min(...sizes.map((s) => Number(s.price))).toFixed(2)}
                            </span>
                          </span>
                          <span
                            className={cn(
                              "rounded-full px-3 py-1 text-xs font-semibold",
                              line
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground",
                            )}
                          >
                            {line ? "Added" : "Add"}
                          </span>
                        </button>

                        {line && (
                          <div className="mt-3 flex flex-wrap items-center gap-3">
                            <label className="flex-1 text-xs font-medium text-muted-foreground">
                              Size / quantity per pack
                              <select
                                value={line.size.label}
                                onChange={(e) => setSize(p.id, e.target.value)}
                                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                              >
                                {sizes.map((s) => (
                                  <option key={s.label} value={s.label}>
                                    {s.label} — {p.currency} {Number(s.price).toFixed(2)}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <div className="text-xs font-medium text-muted-foreground">
                              How many
                              <div className="mt-1 flex items-center gap-1">
                                <button
                                  type="button"
                                  aria-label={`Decrease ${p.name}`}
                                  onClick={() => setQty(p.id, line.qty - 1)}
                                  className="h-8 w-8 rounded-full bg-muted text-sm font-bold"
                                >
                                  −
                                </button>
                                <span className="w-7 text-center text-sm font-semibold text-foreground">
                                  {line.qty}
                                </span>
                                <button
                                  type="button"
                                  aria-label={`Increase ${p.name}`}
                                  onClick={() => setQty(p.id, line.qty + 1)}
                                  className="h-8 w-8 rounded-full bg-muted text-sm font-bold"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <p className="text-sm font-semibold text-primary">
                              {p.currency} {(Number(line.size.price) * line.qty).toFixed(2)}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {grouped.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">No items match.</p>
            )}
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
          Download order form (PDF) — best for large orders
        </button>
        {saved && (
          <p className="mt-3 text-center text-xs font-medium text-primary">
            Your order has been recorded with the bakery.
          </p>
        )}
        <p className="mt-2 text-center text-xs text-muted-foreground">
          WhatsApp cannot attach files automatically — download the PDF, then attach it in the chat
          if you'd like a printed copy of your order.
        </p>
      </div>
    </div>
  );
}
