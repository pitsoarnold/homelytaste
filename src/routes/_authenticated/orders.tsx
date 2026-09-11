import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { listOrders, setOrderStatus, type Order } from "@/lib/orders";

export const Route = createFileRoute("/_authenticated/orders")({
  head: () => ({
    meta: [
      { title: "Order History — Homely Taste Bakery" },
      {
        name: "description",
        content:
          "Private order history for Homely Taste: every website order with date, items, quantities and confirmation status.",
      },
      { property: "og:title", content: "Order History — Homely Taste Bakery" },
      { property: "og:description", content: "Website orders with items, quantities and status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: orders, isLoading, error } = useQuery({ queryKey: ["orders"], queryFn: listOrders });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "pending" | "confirmed" }) =>
      setOrderStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Bakery</p>
          <h1 className="mt-2 font-display text-4xl font-semibold">Order History</h1>
        </div>
        <button
          onClick={signOut}
          className="rounded-full border border-border px-5 py-2 text-sm font-medium hover:bg-muted"
        >
          Sign out
        </button>
      </div>

      {isLoading && <p className="mt-10 text-muted-foreground">Loading orders…</p>}
      {error && (
        <p className="mt-10 text-destructive">
          {error instanceof Error ? error.message : "Could not load orders"}
        </p>
      )}
      {orders && orders.length === 0 && (
        <p className="mt-10 text-muted-foreground">No orders yet.</p>
      )}

      <div className="mt-10 space-y-6">
        {orders?.map((order: Order) => (
          <article key={order.id} className="rounded-3xl bg-card p-6 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">
                  {order.customer_name}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    · {order.reference}
                  </span>
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {order.phone}
                  {order.occasion ? ` · ${order.occasion}` : ""}
                </p>
                <p className="mt-1 text-sm">
                  Needed:{" "}
                  <strong>{format(new Date(order.needed_date), "EEEE, d MMMM yyyy")}</strong>
                  <span className="text-muted-foreground">
                    {" "}
                    · placed {format(new Date(order.created_at), "d MMM yyyy, HH:mm")}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    order.status === "confirmed"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {order.status === "confirmed" ? "Confirmed" : "Pending"}
                </span>
                <p className="mt-2 text-lg font-semibold text-primary">
                  {order.currency} {Number(order.total).toFixed(2)}
                </p>
              </div>
            </div>

            <table className="mt-4 w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="py-2">Item</th>
                  <th className="py-2">Category</th>
                  <th className="py-2">Size</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i} className="border-t border-border/60">
                    <td className="py-2 font-medium">{item.name}</td>
                    <td className="py-2 text-muted-foreground">{item.category}</td>
                    <td className="py-2 text-muted-foreground">{item.size}</td>
                    <td className="py-2 text-center">{item.qty}</td>
                    <td className="py-2 text-right">
                      {order.currency} {Number(item.line_total).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {order.notes && (
              <p className="mt-3 rounded-2xl bg-muted p-3 text-sm">Notes: {order.notes}</p>
            )}

            <button
              onClick={() =>
                mutation.mutate({
                  id: order.id,
                  status: order.status === "confirmed" ? "pending" : "confirmed",
                })
              }
              disabled={mutation.isPending}
              className="mt-4 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {order.status === "confirmed" ? "Mark as pending" : "Mark as confirmed"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
