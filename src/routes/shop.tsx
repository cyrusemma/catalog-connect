import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { StoreNavbar } from "@/components/storefront/store-navbar";
import { StoreFooter } from "@/components/storefront/store-footer";
import { ProductCard } from "@/components/storefront/product-card";
import { useStoreSettings } from "@/hooks/use-store-settings";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Product } from "@/lib/types";

const search = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
  sort: z.enum(["latest", "price_asc", "price_desc"]).optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: (s) => search.parse(s),
  component: ShopPage,
});

function ShopPage() {
  const navigate = Route.useNavigate();
  const sp = Route.useSearch();
  const { settings } = useStoreSettings();
  const [query, setQuery] = useState(sp.q ?? "");

  const products = useQuery({
    queryKey: ["products", "all", sp.category ?? null, sp.sort ?? "latest"],
    queryFn: async () => {
      let q = supabase.from("products").select("*").eq("is_published", true);
      if (sp.category) q = q.eq("category", sp.category);
      if (sp.sort === "price_asc") q = q.order("selling_price", { ascending: true });
      else if (sp.sort === "price_desc") q = q.order("selling_price", { ascending: false });
      else q = q.order("created_at", { ascending: false });
      const { data } = await q.limit(200);
      return (data ?? []) as Product[];
    },
  });

  const categories = useQuery({
    queryKey: ["categories", "shop"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("category")
        .eq("is_published", true)
        .not("category", "is", null);
      return Array.from(new Set((data ?? []).map((d: { category: string | null }) => d.category).filter(Boolean) as string[]));
    },
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products.data ?? [];
    return (products.data ?? []).filter((p) =>
      [p.title, p.brand, p.description, p.category].filter(Boolean).join(" ").toLowerCase().includes(q),
    );
  }, [products.data, query]);

  return (
    <div className="min-h-screen">
      <StoreNavbar />
      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Shop</h1>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  navigate({ search: (prev) => ({ ...prev, q: e.target.value || undefined }) });
                }}
                placeholder="Search…"
                className="w-full pl-8 sm:w-56"
              />
            </div>
            <Select
              value={sp.category ?? "all"}
              onValueChange={(v) => navigate({ search: (prev) => ({ ...prev, category: v === "all" ? undefined : v }) })}
            >
              <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {(categories.data ?? []).map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={sp.sort ?? "latest"}
              onValueChange={(v) => navigate({ search: (prev) => ({ ...prev, sort: v === "latest" ? undefined : (v as "price_asc" | "price_desc") }) })}
            >
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6">
          {products.isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          ) : filtered.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} currency={settings.currency} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-card p-10 text-center text-muted-foreground raised">No products match your filters.</div>
          )}
        </div>
      </main>
      <StoreFooter />
    </div>
  );
}
