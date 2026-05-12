import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { z } from "zod";
import { StoreNavbar } from "@/components/storefront/store-navbar";
import { StoreFooter } from "@/components/storefront/store-footer";
import { ProductCard } from "@/components/storefront/product-card";
import { useStoreSettings } from "@/hooks/use-store-settings";
import { useProducts } from "@/hooks/use-products";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const { products, loading } = useProducts();
  const [query, setQuery] = useState(sp.q ?? "");

  // Filter published products
  const filteredAndSorted = useMemo(() => {
    let result = products.filter((p) => p.is_published);

    // Filter by category
    if (sp.category) {
      result = result.filter((p) => p.category === sp.category);
    }

    // Search filter
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sp.sort === "price_asc") {
      result.sort((a, b) => a.selling_price - b.selling_price);
    } else if (sp.sort === "price_desc") {
      result.sort((a, b) => b.selling_price - a.selling_price);
    } else {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [products, sp.category, sp.sort, query]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        products
          .filter((p) => p.is_published)
          .map((p) => p.category)
          .filter(Boolean) as string[],
      ),
    );
  }, [products]);

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
                  navigate({
                    search: (prev: z.infer<typeof search>) => ({
                      ...prev,
                      q: e.target.value || undefined,
                    }),
                  });
                }}
                placeholder="Search…"
                className="w-full pl-8 sm:w-56"
              />
            </div>
            <Select
              value={sp.category ?? "all"}
              onValueChange={(v) =>
                navigate({
                  search: (prev: z.infer<typeof search>) => ({
                    ...prev,
                    category: v === "all" ? undefined : v,
                  }),
                })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={sp.sort ?? "latest"}
              onValueChange={(v) =>
                navigate({
                  search: (prev: z.infer<typeof search>) => ({
                    ...prev,
                    sort: v === "latest" ? undefined : (v as "price_asc" | "price_desc"),
                  }),
                })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          ) : filteredAndSorted.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {filteredAndSorted.map((p) => (
                <ProductCard key={p.id} product={p} currency={settings.currency} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-card p-10 text-center text-muted-foreground raised">
              No products match your filters.
            </div>
          )}
        </div>
      </main>
      <StoreFooter />
    </div>
  );
}
