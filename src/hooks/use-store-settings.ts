import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { StoreSettings } from "@/lib/types";

const DEFAULTS: StoreSettings = {
  id: 1,
  store_name: "Catalog",
  whatsapp_number: "233000000000",
  hero_title: "Discover products you love",
  hero_subtitle: "Curated finds, delivered with care.",
  currency: "GHS",
  logo_url: null,
};

export function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase
      .from("store_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        if (mounted && data) setSettings(data as StoreSettings);
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { settings, loading };
}
