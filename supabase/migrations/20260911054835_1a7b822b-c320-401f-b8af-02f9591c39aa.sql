CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL,
  customer_name text NOT NULL,
  phone text NOT NULL,
  occasion text,
  needed_date date NOT NULL,
  notes text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'LSL',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.orders TO anon;
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_bakery_owner()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coalesce(lower(auth.jwt() ->> 'email') = 'homelytaste.25@gmail.com', false)
$$;

CREATE POLICY "Anyone can submit an order"
  ON public.orders FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Owner can view orders"
  ON public.orders FOR SELECT TO authenticated
  USING (public.is_bakery_owner());

CREATE POLICY "Owner can update orders"
  ON public.orders FOR UPDATE TO authenticated
  USING (public.is_bakery_owner())
  WITH CHECK (public.is_bakery_owner());

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();