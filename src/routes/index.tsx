import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useState } from "react";
import { getProducts } from "@/lib/products.functions";
import { OrderModal, type Product } from "@/components/OrderModal";
import logoAsset from "@/assets/logo.asset.json";
import heroAsset from "@/assets/cupcakes.asset.json";
import aboutAsset from "@/assets/rusks-tray.asset.json";

const WHATSAPP_NUMBER = "26662119056";
const NOTICE = "Please place your order at least 2 days before the day you need your baked goods.";


const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => getProducts() as Promise<Product[]>,
});

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  head: () => ({
    meta: [
      { title: "Homely Taste — Handcrafted Delights for Every Occasion" },
      {
        name: "description",
        content:
          "Homely Taste is a home bakery crafting cupcakes, rusks, cookies and cakes to order. Order via WhatsApp at least 2 days in advance.",
      },
      { property: "og:title", content: "Homely Taste — Handcrafted Delights for Every Occasion" },
      {
        property: "og:description",
        content: "Handcrafted baked goods made to order with love. Cupcakes, rusks, cookies and more.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function whatsappLink(productName?: string) {
  const message = productName
    ? `Hello Homely Taste! I would like to order ${productName}. Please confirm availability.`
    : "Hello Homely Taste! I would like to place an order.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function NoticeBanner() {
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


function Home() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const [ordering, setOrdering] = useState<Product | null>(null);

  const bestsellers = products.filter((p) => p.is_bestseller);
  const showcase = bestsellers.length > 0 ? bestsellers : products.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <NoticeBanner />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#home" className="flex items-center gap-3">
            <img src={logoAsset.url} alt="Homely Taste logo" className="h-12 w-auto rounded-full" />
            <span className="font-display text-2xl font-semibold tracking-wide">Homely Taste</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium tracking-wide md:flex">
            <a href="#home" className="transition-colors hover:text-primary">Home</a>
            <a href="#menu" className="transition-colors hover:text-primary">Menu</a>
            <a href="#about" className="transition-colors hover:text-primary">About</a>
            <a href="#contact" className="transition-colors hover:text-primary">Contact</a>
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
      </header>

      {/* Hero */}
      <section id="home" className="mx-auto max-w-6xl px-4 pt-14 pb-20 md:pt-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              Home Bakery · Made to Order
            </p>
            <h1 className="mt-4 text-5xl leading-[1.05] font-semibold md:text-6xl">
              Handcrafted Delights for{" "}
              <span className="italic text-primary">Every Occasion</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
              From our home kitchen to your table — cupcakes, rusks, cookies and cakes baked fresh
              with love, just the way you remember.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#menu"
                className="rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-accent-foreground transition-transform hover:scale-[1.03]"
              >
                Explore Menu
              </a>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border-2 border-accent px-8 py-3.5 text-base font-semibold transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-[2.5rem] shadow-luxe">
              <img
                src={heroAsset.url}
                alt="Vanilla cupcakes with buttercream rosettes, freshly baked by Homely Taste"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 rounded-3xl bg-accent px-6 py-4 shadow-luxe md:-left-8">
              <p className="font-display text-xl font-semibold text-primary">Baked Fresh</p>
              <p className="text-sm text-accent-foreground/80">Every batch, every time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section id="menu" className="bg-secondary py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              Our Bestsellers
            </p>
            <h2 className="mt-3 text-4xl font-semibold text-secondary-foreground md:text-5xl">
              Loved by Our Customers
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-secondary-foreground/70">
              The treats our customers come back for again and again. Everything is baked to order —
              reserve yours early.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {showcase.map((product) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-3xl bg-card shadow-card transition-transform hover:-translate-y-1"
              >
                <div className="overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-2xl font-semibold">{product.name}</h3>
                    <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold whitespace-nowrap">
                      {product.currency} {Number(product.price).toFixed(2)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>
                  <button
                    onClick={() => setOrdering(product)}
                    className="mt-5 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
                  >
                    Order
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Full menu (non-bestsellers, if any) */}
      {products.length > showcase.length && (
        <section className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-center text-4xl font-semibold">More From Our Oven</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products
              .filter((p) => !showcase.some((s) => s.id === p.id))
              .map((product) => (
                <article key={product.id} className="overflow-hidden rounded-3xl bg-card shadow-card">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                  <div className="p-5">
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <p className="mt-1 text-sm font-semibold text-primary">
                      {product.currency} {Number(product.price).toFixed(2)}
                    </p>
                    <button
                      onClick={() => setOrdering(product)}
                      className="mt-4 w-full rounded-full border-2 border-accent px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      Order
                    </button>
                  </div>
                </article>
              ))}
          </div>
        </section>
      )}

      {/* About */}
      <section id="about" className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="overflow-hidden rounded-[2.5rem] shadow-luxe">
            <img
              src={aboutAsset.url}
              alt="Freshly baked seeded rusks cooling on a rack at Homely Taste"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Our Story</p>
            <h2 className="mt-3 text-4xl font-semibold md:text-5xl">Baked at Home, Made with Heart</h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Homely Taste began in a family kitchen with a simple belief: the best treats are the
              ones made by hand, in small batches, with real ingredients and real care.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Every order is baked fresh for you — which is why we ask for at least 2 days' notice.
              Good things take a little time.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-accent py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Get In Touch</p>
          <h2 className="mt-3 text-4xl font-semibold text-accent-foreground md:text-5xl">
            Ready to Order?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-accent-foreground/70">{NOTICE}</p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <a
              href="tel:+26653378522"
              className="rounded-3xl bg-secondary p-6 transition-transform hover:-translate-y-1"
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">Calls Only</p>
              <p className="mt-2 text-lg font-medium text-secondary-foreground">(+266) 53378522</p>
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-3xl bg-secondary p-6 transition-transform hover:-translate-y-1"
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">WhatsApp</p>
              <p className="mt-2 text-lg font-medium text-secondary-foreground">(+266) 62119056</p>
            </a>
            <a
              href="mailto:homelytaste.25@gmail.com"
              className="rounded-3xl bg-secondary p-6 transition-transform hover:-translate-y-1"
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">Email</p>
              <p className="mt-2 text-lg font-medium break-all text-secondary-foreground">
                homelytaste.25@gmail.com
              </p>
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

      {/* Footer */}
      <footer className="bg-secondary py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center">
          <img src={logoAsset.url} alt="Homely Taste logo" className="h-16 w-auto rounded-full" />
          <p className="font-display text-xl text-secondary-foreground">
            Handcrafted Delights for Every Occasion
          </p>
          <p className="text-sm text-secondary-foreground/60">
            Calls: (+266) 53378522 · WhatsApp: (+266) 62119056 · homelytaste.25@gmail.com
          </p>
          <p className="text-xs text-secondary-foreground/40">
            © {new Date().getFullYear()} Homely Taste. All rights reserved.
          </p>
        </div>
      </footer>

      {ordering && <OrderModal product={ordering} onClose={() => setOrdering(null)} />}
    </div>
  );
}
