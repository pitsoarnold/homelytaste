import { createServerFn } from "@tanstack/react-start";

export const getProducts = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];

  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY");
  }

  const endpoint =
    `${url}/rest/v1/products` +
    `?select=id,name,description,image_url,price,currency,category,is_bestseller,sort_order,size_options` +
    `&order=sort_order.asc`;

  const res = await fetch(endpoint, {
    cache: "no-store",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Supabase fetch failed: ${res.status} ${await res.text()}`);
  }

  return (await res.json()) as any[];
});
