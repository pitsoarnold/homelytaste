import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
export const getProducts = createServerFn({ method: "GET" }).handler(async () => {
  const supabasePublic = createClient(
    process.env["SUPABASE_URL"]!,
    process.env["SUPABASE_PUBLISHABLE_KEY"]!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
  const { data, error } = await supabasePublic
    .from("products")
    .select("id, name, description, image_url, price, currency, category, is_bestseller, sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});
