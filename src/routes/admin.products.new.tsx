import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductForm, emptyProduct, type ProductFormValue } from "@/components/admin/product-form";
import { importProduct } from "@/lib/import.functions";
import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/slug";

export const Route = createFileRoute("/admin/products/new")({
  component: NewProductPage,
});

function NewProductPage() {
  const nav = useNavigate();
  const importFn = useServerFn(importProduct);
  const [url, setUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [value, setValue] = useState<ProductFormValue>(emptyProduct);

  const runImport = async () => {
    if (!url) return;
    setImporting(true);
    try {
      const res = await importFn({ data: { url } });
      if (res.ok && res.data) {
        const d = res.data;
        setValue({
          ...emptyProduct,
          title: d.title,
          slug: slugify(d.title),
          brand: d.brand,
          category: d.category,
          description: d.description,
          source_url: d.sourceUrl,
          source_price: d.sourcePrice,
          selling_price: d.sourcePrice ? Math.round(d.sourcePrice * 1.2) : 0,
          images: d.images,
          specifications: d.specifications,
        });
        toast.success("Product imported. Review and save.");
      } else {
        toast.message(res.error || "Couldn't import — fill manually", { description: "Form is ready below." });
        setValue({ ...emptyProduct, source_url: url });
      }
    } catch (e) {
      toast.error("Import failed. Fill manually.");
      setValue({ ...emptyProduct, source_url: url });
    } finally {
      setImporting(false);
    }
  };

  const save = async () => {
    setBusy(true);
    try {
      const { error } = await supabase.from("products").insert({
        slug: value.slug || slugify(value.title),
        title: value.title,
        brand: value.brand || null,
        category: value.category || null,
        description: value.description || null,
        source_url: value.source_url || null,
        source_price: value.source_price,
        selling_price: value.selling_price,
        stock: value.stock,
        images: value.images,
        specifications: value.specifications,
        is_published: value.is_published,
        is_featured: value.is_featured,
      });
      if (error) throw error;
      toast.success("Product created");
      nav({ to: "/admin/products" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Save failed";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add product</h1>
        <p className="text-sm text-muted-foreground">Import from Jumia Ghana or fill the form manually.</p>
      </div>

      <div className="rounded-2xl bg-card p-4 raised">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Import from URL</h2>
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Input placeholder="https://www.jumia.com.gh/..." value={url} onChange={(e) => setUrl(e.target.value)} />
          <Button onClick={runImport} disabled={importing || !url} className="rounded-full">
            {importing ? <Loader2 className="size-4 animate-spin" /> : "Import"}
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Supported: Jumia Ghana. Other sites coming soon — fill manually for now.</p>
      </div>

      <ProductForm value={value} onChange={setValue} onSubmit={save} submitLabel="Create product" busy={busy} />
    </div>
  );
}
