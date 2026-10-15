import { useState, type FormEvent } from "react";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { siteSettingsQuery, type SiteSettings } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Site Settings — Homely Taste Bakery" },
      {
        name: "description",
        content: "Edit the contact and payment details shown on Homely Taste.",
      },
    ],
  }),
  component: SiteSettingsPage,
});

type SettingsForm = {
  contact_email: string;
  whatsapp_number: string;
  calls_number: string;
  deposit_notice: string;
  bank_name: string;
  bank_branch_code: string;
  bank_account_number: string;
  bank_account_name: string;
  mpesa_merchant_code: string;
  mpesa_merchant_name: string;
};

const fields: { name: keyof SettingsForm; label: string; type?: string; multiline?: boolean }[] = [
  { name: "contact_email", label: "Contact email", type: "email" },
  { name: "whatsapp_number", label: "WhatsApp number" },
  { name: "calls_number", label: "Calls number" },
  { name: "deposit_notice", label: "Deposit notice", multiline: true },
  { name: "bank_name", label: "Bank name" },
  { name: "bank_branch_code", label: "Bank branch code" },
  { name: "bank_account_number", label: "Bank account number" },
  { name: "bank_account_name", label: "Bank account name" },
  { name: "mpesa_merchant_code", label: "Mpesa merchant code" },
  { name: "mpesa_merchant_name", label: "Mpesa merchant name" },
];

function formValues(settings: SiteSettings): SettingsForm {
  return {
    contact_email: settings.contact_email ?? "",
    whatsapp_number: settings.whatsapp_number ?? "",
    calls_number: settings.calls_number ?? "",
    deposit_notice: settings.deposit_notice ?? "",
    bank_name: settings.bank_name ?? "",
    bank_branch_code: settings.bank_branch_code ?? "",
    bank_account_number: settings.bank_account_number ?? "",
    bank_account_name: settings.bank_account_name ?? "",
    mpesa_merchant_code: settings.mpesa_merchant_code ?? "",
    mpesa_merchant_name: settings.mpesa_merchant_name ?? "",
  };
}

function nullable(value: string) {
  return value.trim() || null;
}

function SiteSettingsPage() {
  const { data: settings } = useSuspenseQuery(siteSettingsQuery);
  const queryClient = useQueryClient();
  const [values, setValues] = useState(() => formValues(settings));
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    setSaved(false);
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({
          contact_email: nullable(values.contact_email),
          whatsapp_number: nullable(values.whatsapp_number),
          calls_number: nullable(values.calls_number),
          deposit_notice: nullable(values.deposit_notice),
          bank_name: nullable(values.bank_name),
          bank_branch_code: nullable(values.bank_branch_code),
          bank_account_number: nullable(values.bank_account_number),
          bank_account_name: nullable(values.bank_account_name),
          mpesa_merchant_code: nullable(values.mpesa_merchant_code),
          mpesa_merchant_name: nullable(values.mpesa_merchant_name),
        })
        .eq("id", settings.id)
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      await queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      setSaved(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not save site settings");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary";

  return (
    <section className="mx-auto max-w-3xl px-4 py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Bakery</p>
          <h1 className="mt-2 font-display text-4xl font-semibold">Site Settings</h1>
        </div>
        <Link
          to="/orders"
          className="rounded-full border border-border px-5 py-2 text-sm font-medium hover:bg-muted"
        >
          Back to orders
        </Link>
      </div>

      <form onSubmit={save} className="mt-8 space-y-5 rounded-3xl bg-card p-6 shadow-card sm:p-8">
        {fields.map(({ name, label, type = "text", multiline }) => (
          <label key={name} className="block text-sm font-medium">
            {label}
            {multiline ? (
              <textarea
                className={`${inputClass} min-h-24 resize-y`}
                value={values[name]}
                onChange={(event) =>
                  setValues((current) => ({ ...current, [name]: event.target.value }))
                }
              />
            ) : (
              <input
                type={type}
                className={inputClass}
                value={values[name]}
                onChange={(event) =>
                  setValues((current) => ({ ...current, [name]: event.target.value }))
                }
              />
            )}
          </label>
        ))}

        {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
        {saved && <p className="text-sm text-primary">Site settings saved.</p>}
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save settings"}
        </button>
      </form>
    </section>
  );
}
