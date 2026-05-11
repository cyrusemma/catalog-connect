import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, MessageCircle, Minus, Plus, Share2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { StoreNavbar } from "@/components/storefront/store-navbar";
import { StoreFooter } from "@/components/storefront/store-footer";
import { ProductCard } from "@/components/storefront/product-card";
import { Button } from "@/components/ui/button";
import { useStoreSettings } from "@/hooks/use-store-settings";
import { useCart } from "@/lib/cart-store";
import { discountPercent, formatMoney } from "@/lib/format";
import { buildWhatsAppOrderUrl, buildWhatsAppShareUrl } from "@/lib/whatsapp";
import type { Product } from "@/lib/types";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", params.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw notFound();
    return { product: data as Product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) return { meta: [{ title: "Product" }] };
    const desc = (p.description ?? "").slice(0, 160) || `${p.title} on Catalog`;
    const img = p.images?.[0];
    return {
      meta: [
        { title: `${p.title} — Catalog` },
        { name: "description", content: desc },
        { property: "og:title", content: p.title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        ...(img ? [{ property: "og:image", content: img }] : []),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: p.title },
        { name: "twitter:description", content: desc },
        ...(img ? [{ name: "twitter:image", content: img }] : []),
      ],
    };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center text-center">
      <div>
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <Link to="/shop" className="mt-3 inline-block text-primary underline">Back to shop</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => <div className="grid min-h-screen place-items-center">{error.message}</div>,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { settings } = useStoreSettings();
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const off = discountPercent(product.source_price ?? undefined, product.selling_price);

  const related = useQuery({
    queryKey: ["related", product.id, product.category],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_published", true)
        .neq("id", product.id)
        .eq("category", product.category ?? "__none__")
        .limit(4);
      return (data ?? []) as Product[];
    },
    enabled: !!product.category,
  });

  const url = typeof window !== "undefined" ? window.location.href : "";
  const wa = buildWhatsAppOrderUrl({
    number: settings.whatsapp_number,
    items: [{ title: product.title, price: Number(product.selling_price), quantity: qty }],
    currency: settings.currency,
  });
  const shareWa = buildWhatsAppShareUrl(`Check out: ${product.title}\n${formatMoney(product.selling_price, settings.currency)}\n${url}`);

  return (
    <div className="min-h-screen">
      <StoreNavbar />
      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        <nav className="mt-4 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link> / <Link to="/shop" className="hover:text-foreground">Shop</Link> / <span className="text-foreground">{product.title}</span>
        </nav>

        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          {/* Gallery */}
          <div>
            <div className="aspect-square overflow-hidden rounded-2xl bg-muted raised">
              {product.images?.[activeImg] ? (
                <motion.img
                  key={activeImg}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={product.images[activeImg]}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-muted-foreground">No image</div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {product.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`size-16 shrink-0 overflow-hidden rounded-xl border ${i === activeImg ? "ring-2 ring-primary" : ""}`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.brand && (
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{product.brand}</p>
            )}
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{product.title}</h1>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-primary">{formatMoney(product.selling_price, settings.currency)}</span>
              {off > 0 && product.source_price && (
                <>
                  <span className="text-base text-muted-foreground line-through">{formatMoney(product.source_price, settings.currency)}</span>
                  <span className="rounded-full bg-destructive px-2 py-0.5 text-xs font-semibold text-destructive-foreground">-{off}%</span>
                </>
              )}
            </div>

            {product.description && (
              <p className="mt-4 whitespace-pre-line text-sm text-muted-foreground">{product.description}</p>
            )}

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-full bg-card raised">
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus className="size-4" /></Button>
                <span className="w-8 text-center text-sm font-medium">{qty}</span>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setQty((q) => q + 1)}><Plus className="size-4" /></Button>
              </div>
              <Button
                size="lg"
                className="flex-1 rounded-full raised"
                onClick={() => {
                  add(
                    {
                      id: product.id,
                      slug: product.slug,
                      title: product.title,
                      price: Number(product.selling_price),
                      image: product.images?.[0],
                    },
                    qty,
                  );
                  toast.success("Added to cart");
                }}
              >
                <ShoppingBag className="mr-1 size-4" /> Add to cart
              </Button>
            </div>

            <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-3 block">
              <Button size="lg" className="w-full rounded-full bg-whatsapp text-whatsapp-foreground hover:opacity-90 raised">
                <MessageCircle className="mr-1 size-4" /> Order via WhatsApp
              </Button>
            </a>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => {
                  navigator.clipboard.writeText(url);
                  toast.success("Link copied");
                }}
              >
                <Copy className="mr-1 size-3.5" /> Copy link
              </Button>
              <a href={shareWa} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="rounded-full">
                  <Share2 className="mr-1 size-3.5" /> Share to WhatsApp
                </Button>
              </a>
            </div>

            {/* Specifications */}
            {Object.keys(product.specifications ?? {}).length > 0 && (
              <div className="mt-8 rounded-2xl bg-card p-4 raised">
                <h3 className="mb-2 text-sm font-semibold">Specifications</h3>
                <dl className="grid grid-cols-1 gap-1.5 text-sm sm:grid-cols-2">
                  {Object.entries(product.specifications).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3 border-b border-border/50 py-1.5">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="text-right font-medium">{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {(related.data?.length ?? 0) > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-semibold">You may also like</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {related.data!.map((p) => (
                <ProductCard key={p.id} product={p} currency={settings.currency} />
              ))}
            </div>
          </section>
        )}
      </main>
      <StoreFooter />
    </div>
  );
}
