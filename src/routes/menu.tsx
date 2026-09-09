import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { OrderModal, sizesOf, type Product } from "@/components/OrderModal";
import { groupByCategory, productsQuery } from "@/lib/site";

export const Route = createFileRoute("/menu")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  head: () => ({
    meta: [
      { title: "Menu & Price List — Homely Taste Bakery" },
      {
        name: "description",
        content:
          "Browse the full Homely Taste menu: biscuits, rusks, mini cakes, muffins, scones and tartlets with sizes and LSL prices. Order via WhatsApp.",
      },
      { property: "og:title", content: "Menu & Price List — Homely Taste Bakery" },
      {
        property: "og:description",
        content: "Biscuits, rusks, mini cakes, muffins, scones and tartlets — sizes and prices.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MenuPage,
});

function fromPrice(p: Product) {
  const min = Math.min(...sizesOf(p).map((s) => Number(s.price)));
  return `from ${p.currency} ${min.toFixed(2)}`;
}

function MenuPage() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const [ordering, setOrdering] = useState<Product | null>(null);
  const groups = groupByCategory(products);

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Our Menu</p>
        <h1 className="mt-3 text-4xl font-semibold md:text-5xl">Sweet Treats Price List</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Everything is baked to order in small batches. Choose a size in the order form — prices
          shown are the starting size.
        </p>
        <nav className="mt-8 flex flex-wrap justify-center gap-3">
          {groups.map(([category]) => (
            <a
              key={category}
              href={`#${category.replace(/\W+/g, "-").toLowerCase()}`}
              className="rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {category}
            </a>
          ))}
        </nav>
      </section>

      {groups.map(([category, items], i) => (
        <section
          key={category}
          id={category.replace(/\W+/g, "-").toLowerCase()}
          className={i % 2 === 1 ? "bg-secondary py-16" : "py-16"}
        >
          <div className="mx-auto max-w-6xl px-4">
            <h2
              className={`text-3xl font-semibold md:text-4xl ${i % 2 === 1 ? "text-secondary-foreground" : ""}`}
            >
              {category}
            </h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((product) => (
                <article
                  key={product.id}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-card shadow-card transition-transform hover:-translate-y-1"
                >
                  <div className="overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <p className="mt-1 text-sm font-semibold text-primary">{fromPrice(product)}</p>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {product.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {sizesOf(product).map((s) => (
                        <span
                          key={s.label}
                          className="rounded-full bg-muted px-3 py-1 text-xs font-medium"
                        >
                          {s.label} · {Number(s.price).toFixed(2)}
                        </span>
                      ))}
                    </div>
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
      ))}

      {ordering && (
        <OrderModal product={ordering} products={products} onClose={() => setOrdering(null)} />
      )}
    </>
  );
}
