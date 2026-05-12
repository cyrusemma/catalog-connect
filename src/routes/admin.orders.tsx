import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStoreSettings } from "@/hooks/use-store-settings";
import { formatMoney } from "@/lib/format";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Order } from "@/lib/types";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrdersPage,
});

const STATUSES = ["pending", "contacted", "completed", "cancelled"];

function AdminOrdersPage() {
  const { settings } = useStoreSettings();
  const orders = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      return (data ?? []) as Order[];
    },
  });

  const setStatus = async (id: string, status: string) => {
    // SECURITY: Validate status against allowed values
    if (!STATUSES.includes(status)) {
      toast.error("Invalid status value");
      return;
    }
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Updated");
      orders.refetch();
    }
  };

  return (
    <div className="space-y-4 pb-20 md:pb-0">
      <h1 className="text-2xl font-bold">Orders</h1>
      {orders.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : orders.data?.length ? (
        <ul className="space-y-3">
          {orders.data.map((o) => (
            <li key={o.id} className="rounded-2xl bg-card p-4 raised">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{o.customer_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.customer_phone} · {new Date(o.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-primary">
                    {formatMoney(o.total, settings.currency)}
                  </p>
                  <Select value={o.status} onValueChange={(v) => setStatus(o.id, v)}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <ul className="mt-2 text-sm text-muted-foreground">
                {(o.items ?? []).map((it, i) => (
                  <li key={i}>
                    • {it.title} x{it.quantity} —{" "}
                    {formatMoney(it.price * it.quantity, settings.currency)}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl bg-card p-10 text-center text-muted-foreground raised">
          No orders yet.
        </div>
      )}
    </div>
  );
}
