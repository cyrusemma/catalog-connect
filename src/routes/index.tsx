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
        <section className="relative mx-auto mt-4 max-w-7xl overflow-hidden rounded-3xl gradient-hero neu-raised">
          {/* Floating amber blobs */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="animate-float absolute -top-20 -right-16 size-72 rounded-full bg-primary/20 blur-3xl" />
            <div className="animate-float absolute bottom-[-4rem] left-[-3rem] size-80 rounded-full bg-primary-glow/25 blur-3xl" style={{ animationDelay: "1.5s" }} />
            <div className="animate-float absolute top-1/3 left-1/2 size-40 rounded-full bg-accent/20 blur-2xl" style={{ animationDelay: "2.5s" }} />
          </div>

          <div className="relative grid min-h-[85vh] gap-6 px-6 py-14 sm:px-10 md:grid-cols-2 md:py-20">
            <div className="flex flex-col justify-center">
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary"
              >
                <Sparkles className="size-3" />
                New arrivals available
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="font-playfair mt-5 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
              >
                {settings.hero_title?.split(" ").slice(0, -1).join(" ") || settings.hero_title}{" "}
                <span className="text-primary">{settings.hero_title?.split(" ").slice(-1)[0]}</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg"
              >
                {settings.hero_subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-7 flex flex-wrap gap-3"
              >
                <Button asChild size="lg" className="rounded-2xl neu-button bg-primary text-primary-foreground hover:bg-primary">
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
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="mx-auto mt-16 max-w-7xl"
          >
            <div className="mb-5 flex items-end justify-between">
              <h2 className="font-playfair text-3xl font-bold tracking-tight">Featured</h2>
              <Link to="/shop" className="text-sm text-muted-foreground hover:text-primary">View all →</Link>
            </div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
              {featured.data!.map((p) => (
                <motion.div key={p.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                  <ProductCard product={p} currency={settings.currency} />
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}

        {/* Categories */}
        {(categories.data?.length ?? 0) > 0 && (
          <section className="mx-auto mt-16 max-w-7xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Browse</p>
            <h2 className="font-playfair mb-5 text-3xl font-bold tracking-tight">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {categories.data!.map((c) => (
                <Link
                  key={c}
                  to="/shop"
                  search={{ category: c }}
                  className="rounded-2xl bg-card px-4 py-2 text-sm font-medium neu-button hover:text-primary"
                >
                  {c}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Latest */}
        <section className="mx-auto mt-16 max-w-7xl pb-8">
          <h2 className="font-playfair mb-5 text-3xl font-bold tracking-tight">Latest products</h2>
          {latest.isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square animate-shimmer rounded-2xl" />
              ))}
            </div>
          ) : latest.data?.length ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
              {latest.data.map((p) => (
                <motion.div key={p.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                  <ProductCard product={p} currency={settings.currency} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="rounded-2xl bg-card p-10 text-center text-muted-foreground neu-raised">
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
