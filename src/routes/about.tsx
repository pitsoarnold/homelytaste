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
          "Homely Taste is a home bakery baking biscuits, rusks, muffins, scones and tartlets by hand in small batches, fresh for every order.",
      },
      { property: "og:title", content: "Our Story — Homely Taste Home Bakery" },
      {
        property: "og:description",
        content: "Baked at home, made with heart — small batches, real ingredients, real care.",
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
              Baked at Home, Made with Heart
            </h1>
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

      <section className="bg-secondary py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-semibold text-secondary-foreground md:text-4xl">
              What We Bake
            </h2>
            <ul className="mt-6 space-y-3 text-lg text-secondary-foreground/80">
              <li>✦ Biscuits and cookies, from melting moments to Biscoff</li>
              <li>✦ Buttermilk, condensed milk, seed and fruit rusk bites</li>
              <li>✦ Mini cakes, boat cakes and tiramisu ice-box cakes</li>
              <li>✦ Muffins and scones by the box</li>
              <li>✦ Tartlets — milk tart, lemon meringue, brownie and more</li>
            </ul>
            <p className="mt-6 text-secondary-foreground/70">{NOTICE}</p>
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
