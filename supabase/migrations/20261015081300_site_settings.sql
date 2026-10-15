CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_email text,
  whatsapp_number text,
  calls_number text,
  deposit_notice text,
  bank_name text,
  bank_branch_code text,
  bank_account_number text,
  bank_account_name text,
  mpesa_merchant_code text,
  mpesa_merchant_name text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view site settings" ON public.site_settings;
CREATE POLICY "Anyone can view site settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Owner can update site settings" ON public.site_settings;
CREATE POLICY "Owner can update site settings"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = 'homelytaste.25@gmail.com')
  WITH CHECK (lower(auth.jwt() ->> 'email') = 'homelytaste.25@gmail.com');

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_settings (
  id,
  contact_email,
  whatsapp_number,
  calls_number,
  deposit_notice,
  bank_name,
  bank_branch_code,
  bank_account_number,
  bank_account_name,
  mpesa_merchant_code,
  mpesa_merchant_name
) VALUES (
  '6a5ddf65-1da6-4419-9d32-c94c77c6965e',
  NULL,
  '26653378522',
  '26662119056',
  '50% deposit gaurantees an order placement',
  'First National Bank',
  '280061',
  '63220526941',
  'Homely Taste',
  '68666',
  'Homely Taste'
)
ON CONFLICT (id) DO NOTHING;
