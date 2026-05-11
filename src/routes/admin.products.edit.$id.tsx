import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProductForm, emptyProduct, type ProductFormValue } from "@/components/admin/product-form";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/products/edit/$id")({
  component: EditProductPage,
});

function EditProductPage() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const [value, setValue] = useState<ProductFormValue>(emptyProduct);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("products").select("*").eq("id", id).maybeSingle().then(({ data, error }) => {
      if (error || !data) { toast.error(error?.message || "Not found"); nav({ to: "/admin/products" }); return; }
      setValue({
        slug: data.slug,
        title: data.title,
        brand: data.brand ?? "",
        category: data.category ?? "",
        description: data.description ?? "",
        source_url: data.source_url ?? "",
        source_price: data.source_price,
        selling_price: Number(data.selling_price),
        stock: data.stock,
        images: (data.images as string[]) ?? [],
        specifications: (data.specifications as Record<string, string>) ?? {},
        is_published: data.is_published,
        is_featured: data.is_featured,
      });
      setLoading(false);
    });
  }, [id, nav]);

  const save = async () => {
    setBusy(true);
    const { error } = await supabase.from("products").update({
      slug: value.slug,
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
    }).eq("id", id);
    setBusy(false);
    if (error) toast.error(error.message);
    else { toast.success("Saved"); nav({ to: "/admin/products" }); }
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit product</h1>
      <ProductForm value={value} onChange={setValue} onSubmit={save} submitLabel="Save changes" busy={busy} />
    </div>
  );
}
