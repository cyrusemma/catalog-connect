import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { X, Plus } from "lucide-react";
import { slugify } from "@/lib/slug";

export type ProductFormValue = {
  slug: string;
  title: string;
  brand: string;
  category: string;
  description: string;
  source_url: string;
  source_price: number | null;
  selling_price: number;
  stock: number;
  images: string[];
  specifications: Record<string, string>;
  is_published: boolean;
  is_featured: boolean;
};

export const emptyProduct: ProductFormValue = {
  slug: "",
  title: "",
  brand: "",
  category: "",
  description: "",
  source_url: "",
  source_price: null,
  selling_price: 0,
  stock: 0,
  images: [],
  specifications: {},
  is_published: false,
  is_featured: false,
};

export function ProductForm({ value, onChange, onSubmit, submitLabel = "Save", busy }: {
  value: ProductFormValue;
  onChange: (v: ProductFormValue) => void;
  onSubmit: () => void;
  submitLabel?: string;
  busy?: boolean;
}) {
  const [imgUrl, setImgUrl] = useState("");
  const [specKey, setSpecKey] = useState("");
  const [specVal, setSpecVal] = useState("");
  const set = <K extends keyof ProductFormValue>(k: K, v: ProductFormValue[K]) => onChange({ ...value, [k]: v });

  useEffect(() => {
    if (!value.slug && value.title) set("slug", slugify(value.title));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.title]);

  const markup = useMemo(() => {
    const sp = value.source_price ?? 0;
    const sell = value.selling_price ?? 0;
    if (!sp) return { profit: sell, pct: 0 };
    return { profit: sell - sp, pct: ((sell - sp) / sp) * 100 };
  }, [value.source_price, value.selling_price]);

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-5 pb-20 md:pb-0">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Title</Label>
          <Input value={value.title} onChange={(e) => set("title", e.target.value)} required />
        </div>
        <div>
          <Label>Slug</Label>
          <Input value={value.slug} onChange={(e) => set("slug", slugify(e.target.value))} required />
        </div>
        <div>
          <Label>Brand</Label>
          <Input value={value.brand} onChange={(e) => set("brand", e.target.value)} />
        </div>
        <div>
          <Label>Category</Label>
          <Input value={value.category} onChange={(e) => set("category", e.target.value)} />
        </div>
      </div>

      <div>
        <Label>Description</Label>
        <Textarea rows={5} value={value.description} onChange={(e) => set("description", e.target.value)} />
      </div>

      <div>
        <Label>Source URL</Label>
        <Input value={value.source_url} onChange={(e) => set("source_url", e.target.value)} />
      </div>

      <div className="rounded-2xl border border-border p-4">
        <h3 className="mb-3 text-sm font-semibold">Pricing</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <Label>Source price</Label>
            <Input type="number" step="0.01" value={value.source_price ?? ""} onChange={(e) => set("source_price", e.target.value ? parseFloat(e.target.value) : null)} />
          </div>
          <div>
            <Label>Selling price</Label>
            <Input type="number" step="0.01" value={value.selling_price} onChange={(e) => set("selling_price", parseFloat(e.target.value) || 0)} required />
          </div>
          <div>
            <Label>Stock</Label>
            <Input type="number" value={value.stock} onChange={(e) => set("stock", parseInt(e.target.value) || 0)} />
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Profit: <span className="font-semibold text-foreground">{markup.profit.toFixed(2)}</span> · Markup: <span className="font-semibold text-foreground">{markup.pct.toFixed(1)}%</span>
        </p>
      </div>

      <div className="rounded-2xl border border-border p-4">
        <h3 className="mb-3 text-sm font-semibold">Images</h3>
        <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {value.images.map((img, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <img src={img} alt="" className="h-full w-full object-cover" />
              <button type="button" onClick={() => set("images", value.images.filter((_, idx) => idx !== i))} className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-background/80">
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input placeholder="Image URL" value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} />
          <Button type="button" variant="outline" onClick={() => { if (imgUrl) { set("images", [...value.images, imgUrl]); setImgUrl(""); } }}>
            <Plus className="size-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border p-4">
        <h3 className="mb-3 text-sm font-semibold">Specifications</h3>
        <ul className="mb-3 space-y-1 text-sm">
          {Object.entries(value.specifications).map(([k, v]) => (
            <li key={k} className="flex items-center justify-between rounded bg-muted/40 px-2 py-1">
              <span><span className="text-muted-foreground">{k}:</span> {v}</span>
              <button type="button" onClick={() => { const c = { ...value.specifications }; delete c[k]; set("specifications", c); }}><X className="size-3" /></button>
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
          <Input placeholder="Key" value={specKey} onChange={(e) => setSpecKey(e.target.value)} />
          <Input placeholder="Value" value={specVal} onChange={(e) => setSpecVal(e.target.value)} />
          <Button type="button" variant="outline" onClick={() => { if (specKey && specVal) { set("specifications", { ...value.specifications, [specKey]: specVal }); setSpecKey(""); setSpecVal(""); } }}><Plus className="size-4" /></Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={value.is_published} onCheckedChange={(v) => set("is_published", v)} /> Published
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={value.is_featured} onCheckedChange={(v) => set("is_featured", v)} /> Featured
        </label>
      </div>

      <Button type="submit" disabled={busy} size="lg" className="rounded-full raised">{busy ? "Saving…" : submitLabel}</Button>
    </form>
  );
}
