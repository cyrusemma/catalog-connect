import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProductForm, emptyProduct, type ProductFormValue } from "@/components/admin/product-form";
import { useProducts } from "@/hooks/use-products";

export const Route = createFileRoute("/admin/products/edit/$id")({
  component: EditProductPage,
});

function EditProductPage() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const { getProduct, updateProduct } = useProducts();
  const [value, setValue] = useState<ProductFormValue>(emptyProduct);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const product = getProduct(id);
    if (!product) {
      toast.error("Product not found");
      nav({ to: "/admin/products" });
      return;
    }

    setValue({
      slug: product.slug,
      title: product.title,
      brand: product.brand ?? "",
      category: product.category ?? "",
      description: product.description ?? "",
      source_url: product.source_url ?? "",
      source_price: product.source_price,
      selling_price: Number(product.selling_price),
      stock: product.stock,
      images: (product.images as string[]) ?? [],
      specifications: (product.specifications as Record<string, string>) ?? {},
      is_published: product.is_published,
      is_featured: product.is_featured,
    });
    setLoading(false);
  }, [id, nav, getProduct]);

  const save = async () => {
    setBusy(true);
    try {
      updateProduct(id, {
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
        updated_at: new Date().toISOString(),
      });
      toast.success("Saved");
      nav({ to: "/admin/products" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Save failed";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit product</h1>
      <ProductForm
        value={value}
        onChange={setValue}
        onSubmit={save}
        submitLabel="Save changes"
        busy={busy}
      />
    </div>
  );
}
