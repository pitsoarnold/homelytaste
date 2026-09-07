CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  price numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'LSL',
  category text NOT NULL DEFAULT 'Bakery',
  is_bestseller boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (true);

INSERT INTO public.products (name, description, image_url, price, currency, category, is_bestseller, sort_order) VALUES
('Vanilla Rose Cupcakes', 'Soft vanilla cupcakes crowned with silky buttercream rosettes and a whisper of rose-gold shimmer. Baked in small batches, just like home.', '/__l5e/assets-v1/bb8d2857-7f2a-4c57-86b3-20d6cf407525/cupcakes.jpeg', 150.00, 'LSL', 'Cupcakes', true, 1),
('Buttermilk Rusks', 'Golden, crunchy buttermilk rusks loaded with sunflower, flax and pumpkin seeds. Perfect for dunking in your morning coffee.', '/__l5e/assets-v1/37346ff1-edd9-4b7f-85c3-7f28f46e98e2/rusks-closeup.jpeg', 120.00, 'LSL', 'Rusks', true, 2),
('Assorted Giant Cookies', 'A baker''s dozen of red velvet white-choc, classic chocolate chip and double chocolate cookies — thick, soft-centred and generous.', '/__l5e/assets-v1/608da2c2-7c62-4446-bcef-5a412a2d56f0/cookies.jpeg', 180.00, 'LSL', 'Cookies', true, 3),
('Seeded Breakfast Rusks', 'Our signature rusks fresh from the oven — hearty, wholesome and packed with seeds. Sold by the tray for the week ahead.', '/__l5e/assets-v1/0d68f7ef-158a-45eb-b72a-5d9fd50e7d31/rusks-tray.jpeg', 110.00, 'LSL', 'Rusks', false, 4);