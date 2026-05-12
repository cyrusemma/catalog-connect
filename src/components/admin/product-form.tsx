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

  const setSell = (n: number) => set("selling_price", Number(n.toFixed(2)));
  const sourcePrice = value.source_price ?? 0;

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6 pb-20 md:pb-0">
      {/* Basic info */}
      <section className="rounded-2xl bg-card p-5 neu-raised">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Product details</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Title</Label>
            <Input className="mt-1.5 rounded-xl" value={value.title} onChange={(e) => set("title", e.target.value)} required />
          </div>
          <div>
            <Label>Slug</Label>
            <Input className="mt-1.5 rounded-xl" value={value.slug} onChange={(e) => set("slug", slugify(e.target.value))} required />
          </div>
          <div>
            <Label>Brand</Label>
            <Input className="mt-1.5 rounded-xl" value={value.brand} onChange={(e) => set("brand", e.target.value)} />
          </div>
          <div>
            <Label>Category</Label>
            <Input className="mt-1.5 rounded-xl" value={value.category} onChange={(e) => set("category", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label>Description</Label>
            <Textarea className="mt-1.5 rounded-xl" rows={5} value={value.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label>Source URL</Label>
            <Input className="mt-1.5 rounded-xl" value={value.source_url} onChange={(e) => set("source_url", e.target.value)} placeholder="https://www.jumia.com.gh/..." />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="rounded-2xl bg-card p-5 neu-raised">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pricing calculator</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Source price</Label>
            <Input className="mt-1.5 rounded-xl" type="number" step="0.01" value={value.source_price ?? ""} onChange={(e) => set("source_price", e.target.value ? parseFloat(e.target.value) : null)} />
          </div>
          <div>
            <Label>Selling price</Label>
            <Input className="mt-1.5 rounded-xl" type="number" step="0.01" value={value.selling_price} onChange={(e) => set("selling_price", parseFloat(e.target.value) || 0)} required />
          </div>
        </div>
        {sourcePrice > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Quick markup:</span>
            {[1.2, 1.5, 1.8, 2].map((m) => (
              <button key={m} type="button" onClick={() => setSell(sourcePrice * m)} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium neu-button hover:text-primary">
                ×{m}
              </button>
            ))}
          </div>
        )}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-background p-3 neu-pressed">
            <p className="text-[10px] font-semibold uppercase text-muted-foreground">Profit</p>
            <p className="mt-1 text-lg font-bold text-primary">{markup.profit.toFixed(2)}</p>
          </div>
          <div className="rounded-xl bg-background p-3 neu-pressed">
            <p className="text-[10px] font-semibold uppercase text-muted-foreground">Margin</p>
            <p className="mt-1 text-lg font-bold">{markup.pct.toFixed(1)}%</p>
          </div>
          <div className="rounded-xl bg-background p-3 neu-pressed">
            <p className="text-[10px] font-semibold uppercase text-muted-foreground">Stock</p>
            <Input className="mt-0.5 h-7 rounded-lg border-0 bg-transparent p-0 text-lg font-bold focus-visible:ring-0" type="number" value={value.stock} onChange={(e) => set("stock", parseInt(e.target.value) || 0)} />
          </div>
        </div>
      </section>

      {/* Images */}
      <section className="rounded-2xl bg-card p-5 neu-raised">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Image manager</h3>
        <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {value.images.map((img, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-muted neu-button">
              <img src={img} alt="" className="h-full w-full object-cover" />
              <button type="button" onClick={() => set("images", value.images.filter((_, idx) => idx !== i))} className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-background/90 hover:bg-destructive hover:text-destructive-foreground">
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input className="rounded-xl" placeholder="Paste image URL" value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} />
          <Button type="button" variant="outline" className="rounded-xl" onClick={() => { if (imgUrl) { set("images", [...value.images, imgUrl]); setImgUrl(""); } }}>
            <Plus className="size-4" />
          </Button>
        </div>
      </section>

      {/* Specs */}
      <section className="rounded-2xl bg-card p-5 neu-raised">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Specifications</h3>
        <ul className="mb-3 space-y-1.5 text-sm">
          {Object.entries(value.specifications).map(([k, v]) => (
            <li key={k} className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-1.5">
              <span><span className="text-muted-foreground">{k}:</span> {v}</span>
              <button type="button" onClick={() => { const c = { ...value.specifications }; delete c[k]; set("specifications", c); }}><X className="size-3" /></button>
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
          <Input className="rounded-xl" placeholder="Key" value={specKey} onChange={(e) => setSpecKey(e.target.value)} />
          <Input className="rounded-xl" placeholder="Value" value={specVal} onChange={(e) => setSpecVal(e.target.value)} />
          <Button type="button" variant="outline" className="rounded-xl" onClick={() => { if (specKey && specVal) { set("specifications", { ...value.specifications, [specKey]: specVal }); setSpecKey(""); setSpecVal(""); } }}><Plus className="size-4" /></Button>
        </div>
      </section>

      {/* Toggles */}
      <section className="rounded-2xl bg-card p-5 neu-raised">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Visibility</h3>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Switch checked={value.is_published} onCheckedChange={(v) => set("is_published", v)} /> Published
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <Switch checked={value.is_featured} onCheckedChange={(v) => set("is_featured", v)} /> Featured
          </label>
        </div>
      </section>

      <Button type="submit" disabled={busy} size="lg" className="w-full rounded-2xl neu-button bg-primary py-6 text-base font-semibold text-primary-foreground hover:bg-primary">
        {busy ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
