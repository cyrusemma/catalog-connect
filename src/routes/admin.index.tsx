import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Package, PlusSquare, ShoppingCart, Settings, ArrowRight, TrendingUp } from "lucide-react";
import { useStoreSettings } from "@/hooks/use-store-settings";
import { formatMoney } from "@/lib/format";
import type { Product, Order } from "@/lib/types";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { settings } = useStoreSettings();
  const stats = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [products, orders, recentProducts] = await Promise.all([
        supabase.from("products").select("id, is_published"),
        supabase.from("orders").select("id, total, status, created_at, customer_name").order("created_at", { ascending: false }).limit(5),
        supabase.from("products").select("*").order("created_at", { ascending: false }).limit(5),
      ]);
      const all = products.data ?? [];
      const ordersData = (orders.data ?? []) as Pick<Order, "id" | "total" | "status" | "created_at" | "customer_name">[];
      const revenue = ordersData
        .filter((o) => o.status === "completed")
        .reduce((s, o) => s + Number(o.total ?? 0), 0);
      return {
        totalProducts: all.length,
        published: all.filter((p) => p.is_published).length,
        recentOrders: ordersData,
        ordersCount: ordersData.length,
        revenue,
        recentProducts: (recentProducts.data ?? []) as Product[],
      };
    },
  });

  const actions = [
    { to: "/admin/products/new", label: "Import product", icon: PlusSquare, hint: "Paste a Jumia link or fill manually" },
    { to: "/admin/orders", label: "View orders", icon: ShoppingCart, hint: "Customer requests via WhatsApp" },
    { to: "/admin/settings", label: "Store settings", icon: Settings, hint: "Branding & WhatsApp number" },
  ];

  const statCards = [
    { label: "Total products", value: stats.data?.totalProducts ?? "—" },
    { label: "Published", value: stats.data?.published ?? "—" },
    { label: "Orders", value: stats.data?.ordersCount ?? "—" },
    { label: "Revenue", value: stats.data ? formatMoney(stats.data.revenue, settings.currency) : "—" },
  ];

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Welcome back</p>
        <h1 className="font-playfair text-4xl font-bold tracking-tight">Dashboard</h1>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        {actions.map((a, i) => (
          <motion.div key={a.to} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link to={a.to} className="group flex items-center justify-between gap-3 rounded-2xl bg-card p-5 neu-raised transition hover:translate-y-[-2px]">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl gradient-warm neu-button">
                  <a.icon className="size-5 text-primary-foreground" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.hint}</p>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-2xl bg-card p-5 neu-raised">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</p>
            <p className="mt-2 text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent products */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-playfair text-2xl font-bold">Recent products</h2>
          <Link to="/admin/products" className="text-sm text-muted-foreground hover:text-primary">View all →</Link>
        </div>
        <div className="rounded-2xl bg-card neu-raised">
          {(stats.data?.recentProducts.length ?? 0) === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No products yet.</p>
          ) : (
            <ul className="divide-y divide-border/60">
              {stats.data!.recentProducts.map((p) => (
                <li key={p.id} className="flex items-center gap-3 p-3">
                  <div className="size-12 overflow-hidden rounded-xl bg-muted">
                    {p.images?.[0] && <img src={p.images[0]} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{formatMoney(p.selling_price, settings.currency)}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${p.is_published ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                    {p.is_published ? "Live" : "Draft"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Recent orders */}
      <section>
        <h2 className="font-playfair mb-3 text-2xl font-bold">Recent orders</h2>
        <div className="rounded-2xl bg-card neu-raised">
          {(stats.data?.recentOrders.length ?? 0) === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-border/60">
              {stats.data!.recentOrders.map((o) => (
                <li key={o.id} className="flex items-center justify-between p-3 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                      <TrendingUp className="size-4" />
                    </span>
                    <div>
                      <p className="font-medium">{o.customer_name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-primary">{formatMoney(o.total, settings.currency)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
