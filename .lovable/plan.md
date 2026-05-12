# Plan: Apply Cyrus Store Design System to Catalog

Re-skin the existing Catalog app to the warm-amber + neumorphism + glassmorphism design language described in your guide. Frontend/presentation only — no schema, auth, or business logic changes.

## 1. Design tokens (`src/styles.css`)

Replace current OKLCH palette with HSL tokens from the guide for both light and dark modes:

- Light: `--background 40 30% 97%`, `--foreground 30 15% 12%`, `--primary 38 92% 50%`, plus `--card`, `--secondary`, `--muted`, `--muted-foreground`, `--border`, `--accent`, `--destructive` per guide.
- Dark: deep warm dark variant with same amber primary.
- Add neumorphism support tokens: `--neu-light`, `--neu-dark` (per mode).
- Keep `--radius: 0.75rem` so `rounded-xl`/`rounded-2xl` map correctly.
- Add utility classes: `.neu-raised`, `.neu-button`, `.neu-pressed`, `.glass`, `.glass-card`, `.input-base`.
- Add keyframes + utilities: `float`, `shimmer`, `pulse-amber` (existing fade/scale stay).

## 2. Typography

- Add Google Fonts link for **Inter** and **Playfair Display** in `src/routes/__root.tsx` `head()`.
- Define `--font-inter`, `--font-playfair` and a `.font-playfair` utility in `styles.css`.
- Set body to `font-inter antialiased` on `<body>` in root.
- Update headings across hero/section titles to use `font-playfair`.

## 3. Storefront components

- **`store-navbar.tsx`**: sticky, transparent → frosted glass on scroll (scroll listener + `glass` class), brand in Playfair, theme toggle, cart badge, admin shortcut when `isAdmin`. Mobile hamburger with slide-in panel.
- **`store-footer.tsx`**: minimal — brand, nav, copyright, low-opacity Admin link.
- **`product-card.tsx`**: `neu-raised`, hover scale, fixed aspect image, amber discount pill top-left, compact WhatsApp button.
- **`install-prompt.tsx`**: restyle as `glass-card` toast.

## 4. Storefront routes

- **`index.tsx`**: hero with `min-h-[85vh]`, floating amber blobs (`animate-float`), Playfair headline with brand word in `text-primary`, "New Arrivals" amber pill badge, neumorphic Shop Now CTA. Featured + Latest grids with framer-motion stagger and skeleton shimmer.
- **`shop.tsx`**: responsive grid `1/2/3/4`, filter chips as `secondary` pills, empty state with icon.
- **`product.$slug.tsx`**: gallery + glass info card, amber primary "Order via WhatsApp" button, share row, keep existing OG meta logic.
- **`cart.tsx`**: neumorphic line items, sticky glass summary card.

## 5. Admin panel

- New **`admin-sidebar.tsx`** (240px desktop, mobile drawer) using shadcn Sidebar — nav items with active state styled as `neu-pressed + bg-primary`, View Store + Logout pinned bottom.
- **`admin.tsx`** layout: replace current top-nav with sidebar layout (`SidebarProvider` + `SidebarTrigger` in mobile header).
- **`admin.index.tsx`** dashboard:
  - 3 Quick Action cards (Import Product, View Orders, Settings) as `neu-raised`.
  - 4 stat cards (Total Products, Published, Orders, Revenue) — derive from existing queries.
  - Recent Products list with thumbnails + Live/Draft badges.
- **`product-form.tsx`**: reorganize into sections — URL Importer at top, Pricing Calculator side-by-side with margin display + quick markup buttons (×1.2 / ×1.5 / ×2), Image Manager grid, Published/Featured switches, full-width amber Save button.
- **`admin/login.tsx`**, `admin.products.tsx`, `admin.orders.tsx`, `admin.settings.tsx`: restyle to glass/neumorphic cards, keep logic identical.

## 6. Motion

- Add `framer-motion` wrappers (`motion.div`) for section entrances (`whileInView`, `opacity/y`) and stagger on grids.
- All primary buttons: `whileHover scale 1.02`, `whileTap scale 0.97` via a small `<MotionButton>` helper or inline.

## 7. Out of scope

- No DB, RLS, server function, or routing changes.
- Service worker, image upload to storage, and category seed remain deferred (separate follow-ups).

## Technical notes

- shadcn components stay; restyling happens via tokens + utility classes, not component rewrites.
- `framer-motion` is already installed (used in existing build).
- Theme toggle continues to work via existing `theme-provider.tsx` (light/dark/system).
- Neumorphism shadows use `--neu-light`/`--neu-dark` tokens that flip per theme so raised/pressed states render correctly in dark mode.

## File touch list

```
src/styles.css                                 (tokens + utilities)
src/routes/__root.tsx                          (font links, body class)
src/components/storefront/store-navbar.tsx
src/components/storefront/store-footer.tsx
src/components/storefront/product-card.tsx
src/components/storefront/install-prompt.tsx
src/components/admin/admin-sidebar.tsx         (new)
src/components/admin/product-form.tsx
src/routes/index.tsx
src/routes/shop.tsx
src/routes/product.$slug.tsx
src/routes/cart.tsx
src/routes/admin.tsx
src/routes/admin.index.tsx
src/routes/admin.products.tsx
src/routes/admin.orders.tsx
src/routes/admin.settings.tsx
src/routes/admin/login.tsx
```
