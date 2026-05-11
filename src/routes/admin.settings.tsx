import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import type { StoreSettings } from "@/lib/types";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const [s, setS] = useState<StoreSettings | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.from("store_settings").select("*").eq("id", 1).maybeSingle().then(({ data }) => {
      if (data) setS(data as StoreSettings);
    });
  }, []);

  if (!s) return <p className="text-sm text-muted-foreground">Loading…</p>;
  const set = <K extends keyof StoreSettings>(k: K, v: StoreSettings[K]) => setS({ ...s, [k]: v });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("store_settings").update({
      store_name: s.store_name,
      whatsapp_number: s.whatsapp_number.replace(/\D/g, ""),
      hero_title: s.hero_title,
      hero_subtitle: s.hero_subtitle,
      currency: s.currency,
      logo_url: s.logo_url,
    }).eq("id", 1);
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Settings saved");
  };

  return (
    <form onSubmit={save} className="max-w-2xl space-y-4 pb-20 md:pb-0">
      <h1 className="text-2xl font-bold">Store settings</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label>Store name</Label><Input value={s.store_name} onChange={(e) => set("store_name", e.target.value)} /></div>
        <div><Label>Currency code</Label><Input value={s.currency} onChange={(e) => set("currency", e.target.value.toUpperCase())} /></div>
        <div className="sm:col-span-2"><Label>WhatsApp number (with country code, digits only)</Label><Input value={s.whatsapp_number} onChange={(e) => set("whatsapp_number", e.target.value)} placeholder="233244112233" /></div>
        <div className="sm:col-span-2"><Label>Logo URL</Label><Input value={s.logo_url ?? ""} onChange={(e) => set("logo_url", e.target.value || null)} /></div>
        <div className="sm:col-span-2"><Label>Hero title</Label><Input value={s.hero_title} onChange={(e) => set("hero_title", e.target.value)} /></div>
        <div className="sm:col-span-2"><Label>Hero subtitle</Label><Textarea value={s.hero_subtitle} onChange={(e) => set("hero_subtitle", e.target.value)} rows={2} /></div>
      </div>
      <Button type="submit" disabled={busy} size="lg" className="rounded-full raised">{busy ? "Saving…" : "Save settings"}</Button>
    </form>
  );
}
