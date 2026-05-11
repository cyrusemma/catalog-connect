import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, PlusSquare, ShoppingCart, Settings, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const stats = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [products, orders] = await Promise.all([
        supabase.from("products").select("id, is_published", { count: "exact", head: false }),
        supabase.from("orders").select("id, total, status, created_at, customer_name").order("created_at", { ascending: false }).limit(5),
      ]);
      const all = products.data ?? [];
      return {
        totalProducts: all.length,
        published: all.filter((p) => p.is_published).length,
        recentOrders: orders.data ?? [],
      };
    },
  });

  const actions = [
    { to: "/admin/products/new", label: "Import / Add product", icon: PlusSquare, hint: "Paste a Jumia link or fill manually" },
    { to: "/admin/products", label: "Manage products", icon: Package, hint: "Edit, publish, share" },
    { to: "/admin/orders", label: "View orders", icon: ShoppingCart, hint: "Customer requests via WhatsApp" },
    { to: "/admin/settings", label: "Store settings", icon: Settings, hint: "Branding, WhatsApp number" },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Quick overview and actions.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Products" value={stats.data?.totalProducts ?? "—"} />
        <Stat label="Published" value={stats.data?.published ?? "—"} />
        <Stat label="Recent orders" value={stats.data?.recentOrders.length ?? "—"} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map((a) => (
          <Link key={a.to} to={a.to} className="group flex items-center justify-between rounded-2xl bg-card p-4 raised transition hover:bg-accent/50">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl gradient-warm"><a.icon className="size-4 text-primary-foreground" /></span>
              <div>
                <p className="text-sm font-semibold">{a.label}</p>
                <p className="text-xs text-muted-foreground">{a.hint}</p>
              </div>
            </div>
            <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>

      <section>
        <h2 className="mb-2 text-sm font-semibold">Recent orders</h2>
        <div className="rounded-2xl bg-card raised">
          {(stats.data?.recentOrders.length ?? 0) === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {stats.data!.recentOrders.map((o) => (
                <li key={o.id} className="flex justify-between p-3 text-sm">
                  <span>{o.customer_name}</span>
                  <span className="text-muted-foreground">{new Date(o.created_at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl bg-card p-4 raised">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
