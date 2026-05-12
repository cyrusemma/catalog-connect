import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useStoreSettings } from "@/hooks/use-store-settings";
import type { StoreSettings } from "@/lib/types";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const { settings: s, loading, error: loadError, saveSettings } = useStoreSettings();
  const [localS, setLocalS] = useState<StoreSettings | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (s) setLocalS(s);
  }, [s]);

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  if (loadError) {
    return (
      <div className="max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold">Store settings</h1>
        <Alert variant="destructive">
          <AlertDescription>{loadError}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!localS) return <p className="text-sm text-muted-foreground">No settings found</p>;

  const set = <K extends keyof StoreSettings>(k: K, v: StoreSettings[K]) =>
    setLocalS({ ...localS, [k]: v });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const updatedSettings: StoreSettings = {
        ...localS,
        whatsapp_number: localS.whatsapp_number.replace(/\D/g, ""),
      };
      saveSettings(updatedSettings);
      toast.success("Settings saved");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save} className="max-w-2xl space-y-4 pb-20 md:pb-0">
      <h1 className="text-2xl font-bold">Store settings</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Store name</Label>
          <Input value={localS.store_name} onChange={(e) => set("store_name", e.target.value)} />
        </div>
        <div>
          <Label>Currency code</Label>
          <Input
            value={localS.currency}
            onChange={(e) => set("currency", e.target.value.toUpperCase())}
          />
        </div>
        <div className="sm:col-span-2">
          <Label>WhatsApp number (with country code, digits only)</Label>
          <Input
            value={localS.whatsapp_number}
            onChange={(e) => set("whatsapp_number", e.target.value)}
            placeholder="233244112233"
          />
        </div>
        <div className="sm:col-span-2">
          <Label>Logo URL</Label>
          <Input
            value={localS.logo_url ?? ""}
            onChange={(e) => set("logo_url", e.target.value || null)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label>Hero title</Label>
          <Input value={localS.hero_title} onChange={(e) => set("hero_title", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Label>Hero subtitle</Label>
          <Textarea
            value={localS.hero_subtitle}
            onChange={(e) => set("hero_subtitle", e.target.value)}
            rows={2}
          />
        </div>
      </div>
      <Button type="submit" disabled={busy} size="lg" className="rounded-full raised">
        {busy ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
