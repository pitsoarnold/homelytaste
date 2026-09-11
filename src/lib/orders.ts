import { supabase } from "@/integrations/supabase/client";

export type OrderItem = {
  name: string;
  category: string;
  size: string;
  qty: number;
  unit_price: number;
  line_total: number;
};

export type Order = {
  id: string;
  reference: string;
  customer_name: string;
  phone: string;
  occasion: string | null;
  needed_date: string;
  notes: string | null;
  items: OrderItem[];
  total: number;
  currency: string;
  status: string;
  created_at: string;
};

export type NewOrder = {
  reference: string;
  customer_name: string;
  phone: string;
  occasion: string | null;
  needed_date: string;
  notes: string | null;
  items: OrderItem[];
  total: number;
  currency: string;
};

export async function saveOrder(order: NewOrder) {
  const { error } = await supabase.from("orders").insert(order);
  if (error) throw new Error(error.message);
}

export async function listOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Order[];
}

export async function setOrderStatus(id: string, status: "pending" | "confirmed") {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}
