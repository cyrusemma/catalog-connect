# Catalog — Reseller Storefront + Admin

A full-stack ecommerce app: admins import/manage products, customers browse and order via WhatsApp or cart checkout. Built on TanStack Start + Lovable Cloud.

## Stack

- TanStack Start (existing template), Tailwind v4, shadcn/ui, Framer Motion
- Lovable Cloud (Postgres + Auth + Storage)
- Server functions for scraping (Cheerio + JSON-LD), no third-party scraper
- PWA via manifest + light service worker (install + offline shell only; push deferred)

## Design System

Warm Amber + Cream coffee theme with light/dark/system toggle. Glassmorphism navbar, soft raised cards, rounded-2xl, framer-motion on hover/press/page transitions. All colors live as oklch tokens in `src/styles.css` — no hard-coded hex in components.

- Primary: amber (~#F59E0B), cream bg light, dark warm-brown bg
- WhatsApp green button as semantic token

## Routes

Public storefront:

- `/` — hero, featured grid, categories, latest products, install prompt
- `/shop` — grid + search + category filter + sort
- `/product/$slug` — gallery, price, discount badge, description, specs, add-to-cart, WhatsApp order, related products, full OG/Twitter meta tags
- `/cart` — items, qty, totals, WhatsApp checkout (prefilled message)

Admin (under `_authenticated/admin` layout, role=admin gate):

- `/admin/login` — sign in (also handles first-run admin setup if no admin exists)
- `/admin` — dashboard with quick actions + recent orders
- `/admin/products` — table with publish/feature toggles, share, edit, delete
- `/admin/products/new` — URL importer + manual form
- `/admin/products/edit/$id` — full edit form
- `/admin/orders` — order list + status updates
- `/admin/settings` — store name, WhatsApp number, hero copy, currency, logo

## Database (Lovable Cloud)

- `profiles` (id → auth.users, display_name)
- `user_roles` (user_id, role enum: admin|customer) + `has_role()` security definer + RLS
- `products` (id, slug unique, title, brand, description, source_url, source_price, selling_price, images jsonb[], specifications jsonb, stock, category, is_published, is_featured, created_at)
- `orders` (id, customer_name, customer_phone, items jsonb, total, status, created_at)
- `store_settings` (singleton row: store_name, whatsapp_number, hero_title, hero_subtitle, currency, logo_url)
- Storage bucket `product-images` (public read)

RLS: products/settings public-read when published; all writes require `has_role(auth.uid(),'admin')`. Orders insertable by anyone, readable only by admin.

## Auth

- Email/password via Lovable Cloud
- First-run: `/admin/login` checks if any admin exists via server fn; if none, shows "Create admin" form that signs up + inserts admin role. Locked after.
- No public admin signup. Customers don't need accounts to browse/order.
- `_authenticated/admin` layout uses `beforeLoad` redirect + role check via server fn.

## Product Importer

`importProduct` server function (`src/lib/import.functions.ts`):

1. Validate URL, restrict to allowed hosts (jumia.com.gh initially; easy to extend)
2. Normalize: strip query/utm/hash
3. `fetch` with desktop User-Agent
4. Parse with cheerio
5. Extract priority: JSON-LD `Product` schema → OG/meta → DOM selectors
6. Return `{title, brand, description, sourcePrice, images[], specifications, availability, rating, category}` or `{error, fallbackToManual: true}` on block/parse failure
7. UI shows clear "couldn't import — fill manually" state and pre-fills source URL

Admin form features: image manager (preview/remove/add by URL/upload to storage), pricing calculator (markup % ↔ profit ↔ selling price live-sync), publish + featured toggles, slug auto-from-title.

## Cart & WhatsApp Checkout

- Cart in `localStorage` + Zustand store
- Cart page builds prefilled WhatsApp URL using store's whatsapp_number:
`https://wa.me/<num>?text=<encoded message>`
- Per-product "Order via WhatsApp" button uses same flow with single item

## Sharing

- Each product page sets `head()` with og:title, og:description, og:image (first product image), og:url, twitter:card=summary_large_image
- Share buttons: Copy link, Share to WhatsApp (`wa.me/?text=...`), native `navigator.share` when available
- Admin product table has Copy Link + Share to WhatsApp actions

## PWA

- `public/manifest.webmanifest` with name=Catalog, standalone, theme amber, icons
- Minimal service worker for install + offline app-shell cache only (no push). Registration guarded against iframes/preview hosts so the editor preview keeps working.
- Install prompt component on homepage (uses `beforeinstallprompt`)

## Out of scope (explicitly deferred)

- Web push notifications (skipped per your choice)
- Short links `/p/<code>`
- Multi-source scrapers (Amazon/AliExpress/etc.) — architecture supports adding adapters later

## File layout (high level)

```
src/
  routes/
    __root.tsx, index.tsx, shop.tsx, cart.tsx
    product.$slug.tsx
    admin/login.tsx
    _authenticated/admin/(index|products|products.new|products.edit.$id|orders|settings).tsx
  components/
    storefront/ (Navbar, ProductCard, Hero, FeaturedGrid, InstallPrompt, ThemeToggle)
    admin/ (ProductForm, ImageManager, PricingCalculator, ImporterPanel, AdminShell)
    ui/ (existing shadcn)
  lib/
    import.functions.ts, products.functions.ts, orders.functions.ts,
    settings.functions.ts, auth.functions.ts
    cart-store.ts, whatsapp.ts, slug.ts
  integrations/supabase/ (generated)
  styles.css (amber/cream tokens + dark)
public/
  manifest.webmanifest, sw.js, icons/
```

## Build sequence

1. Enable Lovable Cloud, migrations (tables, roles, RLS, storage bucket, settings seed)
2. Design tokens + theme provider + navbar/layout
3. Storefront pages with mock → real data
4. Admin auth + role gate + first-run setup
5. Admin CRUD + image storage + pricing calculator
6. Importer server fn (Jumia) + UI with manual fallback
7. Cart + WhatsApp checkout + orders capture
8. Product sharing + OG meta
9. PWA manifest + safe SW + install prompt
10. QA pass on mobile viewport