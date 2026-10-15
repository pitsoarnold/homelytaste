import { createServerFn } from "@tanstack/react-start";

export type SiteSettings = {
  id: string;
  contact_email: string | null;
  whatsapp_number: string | null;
  calls_number: string | null;
  deposit_notice: string | null;
  bank_name: string | null;
  bank_branch_code: string | null;
  bank_account_number: string | null;
  bank_account_name: string | null;
  mpesa_merchant_code: string | null;
  mpesa_merchant_name: string | null;
  updated_at: string;
};

export const getSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];

  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY");
  }

  const fields = [
    "id",
    "contact_email",
    "whatsapp_number",
    "calls_number",
    "deposit_notice",
    "bank_name",
    "bank_branch_code",
    "bank_account_number",
    "bank_account_name",
    "mpesa_merchant_code",
    "mpesa_merchant_name",
    "updated_at",
  ].join(",");
  const endpoint = `${url}/rest/v1/site_settings?select=${fields}&limit=1`;
  const res = await fetch(endpoint, {
    cache: "no-store",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Supabase settings fetch failed: ${res.status} ${await res.text()}`);
  }

  const rows = (await res.json()) as SiteSettings[];
  if (!rows[0]) {
    throw new Error("No site settings row found in Supabase");
  }

  return rows[0];
});
