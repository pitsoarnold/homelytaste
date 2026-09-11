DROP POLICY "Owner can view orders" ON public.orders;
DROP POLICY "Owner can update orders" ON public.orders;

CREATE POLICY "Owner can view orders"
  ON public.orders FOR SELECT TO authenticated
  USING (lower(auth.jwt() ->> 'email') = 'homelytaste.25@gmail.com');

CREATE POLICY "Owner can update orders"
  ON public.orders FOR UPDATE TO authenticated
  USING (lower(auth.jwt() ->> 'email') = 'homelytaste.25@gmail.com')
  WITH CHECK (lower(auth.jwt() ->> 'email') = 'homelytaste.25@gmail.com');

DROP FUNCTION IF EXISTS public.is_bakery_owner();