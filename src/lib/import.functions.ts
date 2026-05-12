import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const ALLOWED_HOSTS = ["www.jumia.com.gh", "jumia.com.gh"];

function normalize(u: string) {
  const url = new URL(u);
  url.search = "";
  url.hash = "";
  return url.toString();
}

type ImportResult = {
  ok: boolean;
  fallbackToManual?: boolean;
  error?: string;
  data?: {
    title: string;
    brand: string;
    description: string;
    sourcePrice: number | null;
    images: string[];
    specifications: Record<string, string>;
    availability: string;
    rating: string;
    category: string;
    sourceUrl: string;
  };
};

export const importProduct = createServerFn({ method: "POST" })
  .inputValidator((d: { url: string }) => z.object({ url: z.string().url() }).parse(d))
  .handler(async ({ data }): Promise<ImportResult> => {
    // SECURITY: Verify admin authorization before allowing product import
    // Extract JWT from Authorization header and verify user is admin
    try {
      const request = getRequest();
      const authHeader = request?.headers?.get("authorization");

      if (!authHeader?.startsWith("Bearer ")) {
        return { ok: false, error: "Unauthorized: Admin authentication required" };
      }

      const token = authHeader.replace("Bearer ", "");
      const SUPABASE_URL = process.env.SUPABASE_URL;
      const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

      if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
        return { ok: false, error: "Server misconfiguration" };
      }

      const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
        global: { headers: { Authorization: `Bearer ${token}` } },
        auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
      });

      // Verify user session and admin role
      const { data: userData, error: authErr } = await supabase.auth.getUser();
      if (authErr || !userData.user) {
        return { ok: false, error: "Unauthorized: Invalid session" };
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        return { ok: false, error: "Unauthorized: Admin role required" };
      }
    } catch {
      return { ok: false, error: "Unauthorized: Admin authentication required" };
    }

    let urlObj: URL;
    try {
      urlObj = new URL(data.url);
    } catch {
      return { ok: false, error: "Invalid URL" };
    }
    if (!ALLOWED_HOSTS.includes(urlObj.host)) {
      return {
        ok: false,
        fallbackToManual: true,
        error: `Host ${urlObj.host} not supported yet. Fill the form manually.`,
      };
    }
    const cleanUrl = normalize(data.url);

    let html = "";
    try {
      const res = await fetch(cleanUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });
      if (!res.ok) {
        return {
          ok: false,
          fallbackToManual: true,
          error: `Source returned ${res.status}. Fill manually.`,
        };
      }
      html = await res.text();
    } catch (e) {
      return { ok: false, fallbackToManual: true, error: "Could not reach source. Fill manually." };
    }

    const $ = cheerio.load(html);

    // 1) JSON-LD
    let jsonProduct: Record<string, unknown> | null = null;
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const txt = $(el).contents().text();
        const parsed = JSON.parse(txt);
        const arr = Array.isArray(parsed) ? parsed : [parsed];
        for (const item of arr) {
          if (
            item &&
            (item["@type"] === "Product" ||
              (Array.isArray(item["@type"]) && item["@type"].includes("Product")))
          ) {
            jsonProduct = item;
            return false;
          }
        }
      } catch (e) {
        /* JSON parse error, ignore */
      }
    });

    const og = (k: string) =>
      $(`meta[property="og:${k}"]`).attr("content") ||
      $(`meta[name="og:${k}"]`).attr("content") ||
      "";

    const j = jsonProduct as Record<string, unknown> | null;
    const title = (j?.name as string) || og("title") || $("h1").first().text().trim() || "";
    const brand = (typeof j?.brand === "object" ? j?.brand?.name : j?.brand) || "";
    const description =
      (j?.description as string) ||
      og("description") ||
      $('meta[name="description"]').attr("content") ||
      "";
    const offers = j?.offers ? (Array.isArray(j.offers) ? j.offers[0] : j.offers) : null;
    const priceRaw =
      offers?.price ||
      offers?.lowPrice ||
      $('[data-price],[itemprop="price"]').first().attr("content") ||
      "";
    const sourcePrice = priceRaw ? parseFloat(String(priceRaw).replace(/[^\d.]/g, "")) : null;
    const ratingRaw = j?.aggregateRating?.ratingValue;
    const availability = offers?.availability
      ? (String(offers.availability).split("/").pop() ?? "")
      : "";

    const imageSet = new Set<string>();
    const pushImg = (v: unknown) => {
      if (!v) return;
      if (Array.isArray(v)) v.forEach(pushImg);
      else if (typeof v === "string") imageSet.add(v);
      else if (typeof v === "object" && v && "url" in v) imageSet.add((v as { url: string }).url);
    };
    pushImg(j?.image);
    const ogImg = og("image");
    if (ogImg) imageSet.add(ogImg);
    $("img").each((_, el) => {
      const src = $(el).attr("data-src") || $(el).attr("src");
      if (src && /^https?:/.test(src) && /\.(jpe?g|png|webp)/i.test(src)) imageSet.add(src);
    });

    // Specs heuristic
    const specs: Record<string, string> = {};
    $("table tr").each((_, el) => {
      const k = $(el).find("th,td").eq(0).text().trim();
      const v = $(el).find("th,td").eq(1).text().trim();
      if (k && v && k.length < 60 && v.length < 200) specs[k] = v;
    });

    if (!title) {
      return {
        ok: false,
        fallbackToManual: true,
        error: "Could not parse product. Fill manually.",
      };
    }

    return {
      ok: true,
      data: {
        title: title.trim(),
        brand: String(brand || "").trim(),
        description: description.trim(),
        sourcePrice: isFinite(sourcePrice as number) ? (sourcePrice as number) : null,
        images: Array.from(imageSet).slice(0, 8),
        specifications: specs,
        availability,
        rating: ratingRaw ? String(ratingRaw) : "",
        category: "",
        sourceUrl: cleanUrl,
      },
    };
  });
