import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { OrderModal, type Product } from "@/components/OrderModal";
import { NOTICE, WhatsAppIcon, productsQuery, whatsappLink } from "@/lib/site";
import heroAsset from "@/assets/cupcakes.asset.json";
import aboutAsset from "@/assets/rusks-tray.asset.json";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  head: () => ({
    meta: [
      { title: "Homely Taste — Handcrafted Delights for Every Occasion" },
      {
        name: "description",
        content:
          "Homely Taste is a home bakery crafting biscuits, rusks, muffins, scones and tartlets to order. Order via WhatsApp at least 2 days in advance.",
      },
      { property: "og:title", content: "Homely Taste — Handcrafted Delights for Every Occasion" },
      {
        property: "og:description",
        content:
          "Handcrafted baked goods made to order with love. Biscuits, rusks, muffins, scones and tartlets.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const [ordering, setOrdering] = useState<Product | null>(null);

  const bestsellers = products.filter((p) => p.is_bestseller);
  const showcase = (bestsellers.length > 0 ? bestsellers : products).slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-20 md:pt-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              Home Bakery · Made to Order
            </p>
            <h1 className="mt-4 text-5xl leading-[1.05] font-semibold md:text-6xl">
              Handcrafted Delights for <span className="italic text-primary">Every Occasion</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
              From our home kitchen to your table — biscuits, rusks, muffins, scones and tartlets
              baked fresh with love, just the way you remember.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/menu"
                className="rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-accent-foreground transition-transform hover:scale-[1.03]"
              >
                Explore Menu
              </Link>
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
      <section className="bg-secondary py-20">
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

          <div className="mt-12 text-center">
            <Link
              to="/menu"
              className="inline-block rounded-full border-2 border-primary px-8 py-3.5 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              View the full price list
            </Link>
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="mx-auto max-w-6xl px-4 py-20">
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
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              Our Story
            </p>
            <h2 className="mt-3 text-4xl font-semibold md:text-5xl">
              Baked at Home, Made with Heart
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Small batches, real ingredients and real care — every order is baked fresh for you.
              {" "}
              {NOTICE}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/about"
                className="rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-accent-foreground transition-transform hover:scale-[1.03]"
              >
                Read our story
              </Link>
              <Link
                to="/contact"
                className="rounded-full border-2 border-accent px-8 py-3.5 text-base font-semibold transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {ordering && (
        <OrderModal product={ordering} products={products} onClose={() => setOrdering(null)} />
      )}
    </>
  );
}
