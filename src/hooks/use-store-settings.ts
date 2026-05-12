import { useCallback, useEffect, useState } from "react";
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

const STORAGE_KEY = "storeSettings";

export function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings(parsed);
      } else {
        setSettings(DEFAULTS);
      }
    } catch (err) {
      console.error("Failed to load store settings:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setSettings(DEFAULTS);
    }
    setLoading(false);
  }, []);

  // Function to save settings
  const saveSettings = useCallback((newSettings: StoreSettings) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
      setError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      console.error("Failed to save store settings:", err);
    }
  }, []);

  return { settings, loading, error, saveSettings };
}
