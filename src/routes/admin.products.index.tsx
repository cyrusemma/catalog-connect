import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Copy, Edit, Eye, EyeOff, MessageCircle, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useStoreSettings } from "@/hooks/use-store-settings";
import { formatMoney } from "@/lib/format";
import { buildWhatsAppShareUrl } from "@/lib/whatsapp";
import type { Product } from "@/lib/types";

export const Route = createFileRoute("/admin/products/")({
  component: AdminProductsPage,
});

function AdminProductsPage() {
  const { settings } = useStoreSettings();
  const products = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      return (data ?? []) as Product[];
    },
  });

  const togglePublish = async (p: Product) => {
    const { error } = await supabase.from("products").update({ is_published: !p.is_published }).eq("id", p.id);
    if (error) toast.error(error.message);
    else { toast.success(!p.is_published ? "Published" : "Unpublished"); products.refetch(); }
  };
  const toggleFeature = async (p: Product) => {
    const { error } = await supabase.from("products").update({ is_featured: !p.is_featured }).eq("id", p.id);
    if (error) toast.error(error.message);
    else products.refetch();
  };
  const remove = async (p: Product) => {
    if (!confirm(`Delete ${p.title}?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); products.refetch(); }
  };

  return (
    <div className="space-y-4 pb-20 md:pb-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link to="/admin/products/new"><Button className="rounded-full raised">Add product</Button></Link>
      </div>

      {products.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : products.data?.length ? (
        <div className="overflow-hidden rounded-2xl bg-card raised">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="hidden p-3 text-left sm:table-cell">Price</th>
                <th className="hidden p-3 text-left md:table-cell">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.data.map((p) => {
                const url = typeof window !== "undefined" ? `${window.location.origin}/product/${p.slug}` : "";
                return (
                  <tr key={p.id} className="border-t border-border">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="size-10 overflow-hidden rounded-lg bg-muted">
                          {p.images?.[0] && <img src={p.images[0]} alt="" className="h-full w-full object-cover" />}
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-1 font-medium">{p.title}</p>
                          {p.brand && <p className="text-xs text-muted-foreground">{p.brand}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="hidden p-3 sm:table-cell">{formatMoney(p.selling_price, settings.currency)}</td>
                    <td className="hidden p-3 md:table-cell">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${p.is_published ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"}`}>
                        {p.is_published ? "Published" : "Draft"}
                      </span>
                      {p.is_featured && <span className="ml-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">Featured</span>}
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex flex-wrap items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" title={p.is_published ? "Unpublish" : "Publish"} onClick={() => togglePublish(p)}>
                          {p.is_published ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" title="Feature" onClick={() => toggleFeature(p)}>
                          <Star className={`size-4 ${p.is_featured ? "fill-primary text-primary" : ""}`} />
                        </Button>
                        <Button variant="ghost" size="icon" title="Copy link" onClick={() => { navigator.clipboard.writeText(url); toast.success("Link copied"); }}>
                          <Copy className="size-4" />
                        </Button>
                        <a href={buildWhatsAppShareUrl(`${p.title} — ${formatMoney(p.selling_price, settings.currency)}\n${url}`)} target="_blank" rel="noopener noreferrer" title="Share">
                          <Button variant="ghost" size="icon"><MessageCircle className="size-4" /></Button>
                        </a>
                        <Link to="/admin/products/edit/$id" params={{ id: p.id }}><Button variant="ghost" size="icon"><Edit className="size-4" /></Button></Link>
                        <Button variant="ghost" size="icon" onClick={() => remove(p)}><Trash2 className="size-4 text-destructive" /></Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl bg-card p-10 text-center text-muted-foreground raised">
          No products yet. <Link to="/admin/products/new" className="text-primary underline">Add your first product</Link>.
        </div>
      )}
    </div>
  );
}
