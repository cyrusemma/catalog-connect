import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { StoreNavbar } from "@/components/storefront/store-navbar";
import { StoreFooter } from "@/components/storefront/store-footer";
import { ProductCard } from "@/components/storefront/product-card";
import { InstallPrompt } from "@/components/storefront/install-prompt";
import { useStoreSettings } from "@/hooks/use-store-settings";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { settings } = useStoreSettings();

  const featured = useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_published", true)
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(8);
      return (data ?? []) as Product[];
    },
  });

  const latest = useQuery({
    queryKey: ["products", "latest"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(12);
      return (data ?? []) as Product[];
    },
  });

  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("category")
        .eq("is_published", true)
        .not("category", "is", null);
      const set = new Set((data ?? []).map((d: { category: string | null }) => d.category).filter(Boolean) as string[]);
      return Array.from(set).slice(0, 8);
    },
  });

  return (
    <div className="min-h-screen">
      <StoreNavbar />
      <main className="px-4 sm:px-6">
        {/* Hero */}
        <section className="mx-auto mt-6 max-w-6xl overflow-hidden rounded-3xl gradient-hero raised">
          <div className="grid gap-6 px-6 py-10 sm:px-10 sm:py-14 md:grid-cols-2 md:py-20">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-1.5 rounded-full bg-card/70 px-3 py-1 text-xs font-medium soft-shadow"
              >
                <Sparkles className="size-3 text-primary" />
                Fresh drops weekly
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
              >
                {settings.hero_title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-3 max-w-md text-base text-muted-foreground sm:text-lg"
              >
                {settings.hero_subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-6 flex flex-wrap gap-3"
              >
                <Button asChild size="lg" className="rounded-full raised">
                  <Link to="/shop">
                    Shop now <ArrowRight className="ml-1 size-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
            <div className="hidden md:block" />
          </div>
        </section>

        {/* Featured */}
        {(featured.data?.length ?? 0) > 0 && (
          <section className="mx-auto mt-12 max-w-6xl">
            <div className="mb-4 flex items-end justify-between">
              <h2 className="text-xl font-semibold sm:text-2xl">Featured</h2>
              <Link to="/shop" className="text-sm text-muted-foreground hover:text-primary">View all</Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {featured.data!.map((p) => (
                <ProductCard key={p.id} product={p} currency={settings.currency} />
              ))}
            </div>
          </section>
        )}

        {/* Categories */}
        {(categories.data?.length ?? 0) > 0 && (
          <section className="mx-auto mt-12 max-w-6xl">
            <h2 className="mb-4 text-xl font-semibold sm:text-2xl">Browse categories</h2>
            <div className="flex flex-wrap gap-2">
              {categories.data!.map((c) => (
                <Link
                  key={c}
                  to="/shop"
                  search={{ category: c }}
                  className="rounded-full bg-card px-4 py-2 text-sm raised hover:bg-accent"
                >
                  {c}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Latest */}
        <section className="mx-auto mt-12 max-w-6xl">
          <h2 className="mb-4 text-xl font-semibold sm:text-2xl">Latest products</h2>
          {latest.isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          ) : latest.data?.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {latest.data.map((p) => (
                <ProductCard key={p.id} product={p} currency={settings.currency} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-card p-10 text-center text-muted-foreground raised">
              No products yet. Check back soon!
            </div>
          )}
        </section>
      </main>
      <StoreFooter />
      <InstallPrompt />
    </div>
  );
}
