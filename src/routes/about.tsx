import { createFileRoute, Link } from "@tanstack/react-router";
import aboutAsset from "@/assets/rusks-tray.asset.json";
import cookiesAsset from "@/assets/cookies.asset.json";
import { NOTICE } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Homely Taste Home Bakery" },
      {
        name: "description",
        content:
          "Meet Homely Taste, an artisanal micro-confectionery creating small-batch sweet and savoury treats, custom orders and event catering.",
      },
      { property: "og:title", content: "Our Story — Homely Taste Home Bakery" },
      {
        property: "og:description",
        content:
          "Premium small-batch treats, curated platters and custom catering for gatherings, celebrations and corporate occasions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="overflow-hidden rounded-[2.5rem] shadow-luxe">
            <img
              src={aboutAsset.url}
              alt="Freshly baked seeded rusks cooling on a rack at Homely Taste"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              Our Story
            </p>
            <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
              Familiar Flavours, Thoughtfully Reimagined
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Homely Taste is an artisanal micro-confectionery crafting premium sweet and savoury
              treats for everyday indulgence, personal milestones and memorable gatherings.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              We pair the comfort of nostalgic flavours with modern, sophisticated combinations.
              Every collection is made in small batches with careful technique, quality ingredients
              and a distinctly homemade touch.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-semibold text-secondary-foreground md:text-4xl">
              Sweet Treats & Savoury Tables
            </h2>
            <ul className="mt-6 space-y-3 text-lg text-secondary-foreground/80">
              <li>✦ Artisan biscuits, cookies, rusks and traditional biscotti</li>
              <li>✦ Scones, muffins, cupcakes, brownies and cinnamon rolls</li>
              <li>✦ Sweet tartlets, dessert cups and seasonal pastry boxes</li>
              <li>✦ Meaty, vegetarian, cold meat, cheese and breakfast platters</li>
              <li>✦ Sandwiches, pickles, crudités and handcrafted signature dips</li>
            </ul>
            <p className="mt-6 text-secondary-foreground/70">
              Our pre-order approach keeps every batch fresh and considered, whether you are
              arranging a collection, a scheduled delivery or tailored catering for an event.{" "}
              {NOTICE}
            </p>
            <Link
              to="/menu"
              className="mt-8 inline-block rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-accent-foreground transition-transform hover:scale-[1.03]"
            >
              See the full menu
            </Link>
          </div>
          <div className="order-1 overflow-hidden rounded-[2.5rem] shadow-luxe md:order-2">
            <img
              src={cookiesAsset.url}
              alt="Assorted giant cookies baked by Homely Taste"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
}
