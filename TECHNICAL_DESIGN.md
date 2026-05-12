# Catalog-Connect: Complete Technical Design

**Project:** Catalog-Connect PWA  
**Version:** 1.0.0  
**Last Updated:** May 2026  
**Status:** Production Ready (Demo Mode)

---

## 1. System Architecture Overview

### 1.1 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER / CLIENT                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────┐  │
│  │   React 19 UI    │  │  TanStack Query  │  │ TanStack    │  │
│  │                  │  │  (Disabled)      │  │ Router      │  │
│  └────────┬─────────┘  └──────────────────┘  └─────────────┘  │
│           │                                         │            │
│  ┌────────┴──────────────────────────────────────────┴─────┐    │
│  │          Application State Layer                        │    │
│  ├──────────────────────────────────────────────────────────┤    │
│  │ • useLocalAuth (Auth Context)                          │    │
│  │ • useStoreSettings (Settings Context)                  │    │
│  │ • useProducts (Product CRUD)                           │    │
│  │ • useCart (Zustand Store)                              │    │
│  └────────┬──────────────────────────────────────────────┬─┘    │
│           │                                              │        │
│  ┌────────┴──────────────────────────────────────────────┴──┐   │
│  │              Browser localStorage                        │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │ • adminAuth (Auth session)                              │   │
│  │ • storeSettings (Store config)                          │   │
│  │ • products (Product array)                              │   │
│  │ • cart (Cart items)                                     │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │         UI Components & Pages                           │    │
│  ├──────────────────────────────────────────────────────────┤    │
│  │ Admin: Login, Products (CRUD), Settings, Dashboard     │    │
│  │ Storefront: Shop, Product Details, Cart, Checkout     │    │
│  │ Common: Navigation, Theme, Logo, Footer               │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Deployment Architecture

```
Local Development (npm run dev)
         ↓
    Vite Dev Server (localhost:5173)
         ↓
┌────────────────────────────────────┐
│   TanStack Start SSR/SSG           │
│   • Client-side rendering          │
│   • Server functions disabled      │
│   • Static build optimization      │
└────────────────────────────────────┘
         ↓
    npm run build
         ↓
┌────────────────────────────────────┐
│   Cloudflare Workers               │
│   (via Wrangler 4.84.1)            │
│   • Edge deployment                │
│   • Zero cold start                │
│   • Global CDN                     │
└────────────────────────────────────┘
```

---

## 2. Tech Stack

### 2.1 Core Framework

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Meta Framework** | TanStack Start | 1.168.25 | Full-stack React framework with SSR/SSG |
| **UI Library** | React | 19.0.0+ | Component-based UI with concurrent features |
| **Routing** | TanStack Router | v1 | File-based routing from `/src/routes/` |
| **Styling** | Tailwind CSS | 4.2.1 | Utility-first CSS framework |
| **UI Components** | shadcn/ui | Latest | Pre-built accessible components |

### 2.2 State Management

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Global UI State** | Context API + Hooks | Theme, user preferences |
| **Server State** | TanStack Query | Disabled (using localStorage) |
| **Client State** | Zustand | Cart persistence (localStorage-backed) |
| **Persistence** | Browser localStorage | All data persistence |

### 2.3 Authentication & Security

| Feature | Implementation |
|---------|-----------------|
| **Demo Auth** | localStorage-based with hardcoded credentials |
| **Sessions** | Client-side localStorage (no JWT) |
| **Admin Guard** | beforeLoad hook checking localStorage |
| **Future Backend** | Migration path to Supabase or custom API |

### 2.4 UI/UX Components

- **30+ shadcn/ui Components**: Button, Input, Form, Dialog, Sheet, Table, Card, etc.
- **Icons**: Lucide React (customizable, tree-shakeable)
- **Animations**: Framer Motion (for product gallery transitions)
- **Toast Notifications**: Sonner (lightweight, headless)
- **Date Picker**: Calendar + custom date handling

### 2.5 Build & Deployment

| Tool | Purpose | Version |
|------|---------|---------|
| **Vite** | Fast build tool & dev server | 7.3.3 |
| **TypeScript** | Type safety | Latest |
| **ESLint** | Code quality | Latest |
| **Prettier** | Code formatting | Latest |
| **Wrangler** | Cloudflare deployment | 4.84.1 |

---

## 3. Project Structure

### 3.1 Directory Organization

```
catalog-connect/
├── src/
│   ├── routes/                    # File-based routing
│   │   ├── __root.tsx            # Root layout wrapper
│   │   ├── index.tsx             # Home page
│   │   ├── shop.tsx              # Product listing
│   │   ├── product.$slug.tsx     # Product detail
│   │   ├── cart.tsx              # Shopping cart
│   │   ├── admin.tsx             # Admin layout
│   │   ├── admin/
│   │   │   └── login.tsx         # Admin login
│   │   ├── admin.index.tsx       # Dashboard
│   │   ├── admin.products.tsx    # Product list
│   │   ├── admin.products.new.tsx       # Create product
│   │   ├── admin.products.edit.$id.tsx  # Edit product
│   │   ├── admin.settings.tsx    # Store settings
│   │   └── admin.orders.tsx      # Orders (placeholder)
│   │
│   ├── components/               # React components
│   │   ├── admin/
│   │   │   └── product-form.tsx  # Reusable product form
│   │   ├── storefront/
│   │   │   ├── store-navbar.tsx
│   │   │   ├── store-footer.tsx
│   │   │   ├── product-card.tsx
│   │   │   └── install-prompt.tsx
│   │   ├── ui/                   # shadcn/ui components (30+)
│   │   ├── theme-provider.tsx    # Theme context
│   │   ├── theme-toggle.tsx      # Dark/light mode toggle
│   │   └── logo.tsx              # Custom logo component
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-local-auth.ts     # Auth management
│   │   ├── use-products.ts       # Product CRUD
│   │   ├── use-store-settings.ts # Store config
│   │   ├── use-cart.ts           # (via Zustand in lib/)
│   │   └── use-mobile.tsx        # Mobile detection
│   │
│   ├── lib/                      # Utilities & helpers
│   │   ├── cart-store.ts         # Zustand cart store
│   │   ├── types.ts              # TypeScript interfaces
│   │   ├── format.ts             # Format functions (money, etc.)
│   │   ├── slug.ts               # URL slug generation
│   │   ├── whatsapp.ts           # WhatsApp integration
│   │   ├── utils.ts              # General utilities
│   │   ├── error-capture.ts      # Error logging
│   │   └── error-page.ts         # Error UI
│   │
│   ├── integrations/
│   │   └── supabase/             # (Unused, kept for reference)
│   │       ├── client.ts
│   │       ├── client.server.ts
│   │       ├── auth-middleware.ts
│   │       └── types.ts
│   │
│   ├── styles/
│   │   └── styles.css            # Global Tailwind + custom tokens
│   │
│   ├── router.tsx                # TanStack Router config
│   ├── routeTree.gen.ts          # Auto-generated route types
│   ├── server.ts                 # Server entry point
│   └── start.ts                  # Client entry point
│
├── public/
│   └── manifest.webmanifest      # PWA manifest
│
├── supabase/                     # Supabase config (unused)
│   ├── config.toml
│   └── migrations/
│
├── dist/                         # Build output
│   ├── client/                   # Client bundles
│   ├── server/                   # Server bundles
│   └── .dev.vars                 # Env variables
│
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── vite.config.ts                # Vite configuration
├── wrangler.jsonc                # Cloudflare Workers config
├── eslint.config.js              # ESLint rules
├── components.json               # shadcn/ui config
└── .prettierrc                   # Prettier config
```

### 3.2 Routing Structure

```
TanStack Router File Convention:
- __root.tsx           → / (root layout)
- index.tsx            → /
- shop.tsx             → /shop
- product.$slug.tsx    → /product/:slug
- cart.tsx             → /cart
- admin.tsx            → /admin (auth guard)
- admin/login.tsx      → /admin/login
- admin.index.tsx      → /admin
- admin.products.tsx   → /admin/products
- admin.products.new.tsx            → /admin/products/new
- admin.products.edit.$id.tsx       → /admin/products/edit/:id
- admin.settings.tsx   → /admin/settings
- admin.orders.tsx     → /admin/orders
```

---

## 4. Data Models & localStorage

### 4.1 TypeScript Interfaces

#### Product Model
```typescript
interface Product {
  id: string;                    // "product-" + Date.now()
  slug: string;                  // URL-friendly identifier
  title: string;                 // Product name
  brand: string | null;          // Brand/manufacturer
  category: string | null;       // Product category
  description: string | null;    // Full description
  source_url: string | null;     // Original product link
  source_price: number;          // Original price (for discount calc)
  selling_price: number;         // Sale price
  stock: number;                 // Inventory count
  images: string[];              // Array of image URLs
  specifications: Record<string, string> | null;  // Key-value specs
  is_published: boolean;         // Visible on storefront
  is_featured: boolean;          // Show in featured section
  created_at: string;            // ISO timestamp
  updated_at: string;            // ISO timestamp
}
```

#### Store Settings Model
```typescript
interface StoreSettings {
  store_name: string;            // e.g., "Catalog"
  currency: string;              // e.g., "GHS", "USD"
  whatsapp_number: string;       // For order notifications
  hero_title: string;            // Homepage banner title
  hero_subtitle?: string;        // Homepage banner subtitle
  logo_url: string | null;       // Store logo image URL
}
```

#### Cart Item Model
```typescript
interface CartItem {
  id: string;                    // Product ID
  slug: string;                  // For linking
  title: string;                 // Display name
  price: number;                 // Price at time of add
  image?: string;                // Product thumbnail
  quantity: number;              // How many
}

interface Cart {
  items: CartItem[];
  add: (item: CartItem, qty: number) => void;
  remove: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  total: () => number;
}
```

#### User Auth Model
```typescript
interface AdminUser {
  id: string;                    // User ID
  email: string;                 // Login email
  // Future: password_hash, roles, permissions
}

interface AuthSession {
  user: AdminUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}
```

### 4.2 localStorage Keys & Structure

| Key | Type | Structure | Capacity |
|-----|------|-----------|----------|
| `adminAuth` | JSON | `{ id, email }` | 1 KB |
| `storeSettings` | JSON | Store config object | 2 KB |
| `products` | JSON | Product[] array | ~5 MB (scalable) |
| `cart` | JSON | CartItem[] array | 100 KB |
| `theme` | String | "light" \| "dark" | 10 B |

**Total typical: ~50 KB of 5-10 MB available**

### 4.3 Data Persistence Flow

```
User Action (e.g., add product)
         ↓
Hook Function (e.g., addProduct())
         ↓
Validate Data
         ↓
Read current array from localStorage
         ↓
Mutate array (add/update/delete)
         ↓
Write back to localStorage
         ↓
Trigger component re-render via hook state
         ↓
UI Updates
```

---

## 5. Authentication & Authorization Flow

### 5.1 Demo Authentication System

```
┌──────────────────────────────────┐
│   User Opens /admin/login        │
└─────────────┬──────────────────┘
              ↓
        ┌─────────────┐
        │ Demo Creds  │
        │ Visible on  │
        │ Form UI     │
        └─────────────┘
              ↓
    ┌─────────────────────┐
    │ Email: admin@example.com
    │ Password: password123
    └─────────────────────┘
              ↓
        useLocalAuth.signIn()
              ↓
    ┌──────────────────────────┐
    │ Validate (hardcoded)     │
    │ email === DEMO_EMAIL &&  │
    │ password === DEMO_PASSWORD
    └──────────────────────────┘
              ↓
        Save to localStorage
        localStorage.adminAuth = {
          id: "demo-user",
          email: "admin@example.com"
        }
              ↓
    ┌──────────────────────────┐
    │ Redirect to /admin       │
    └──────────────────────────┘
              ↓
    beforeLoad Hook Checks:
    localStorage.adminAuth exists?
              ↓
         ✓ Allow Access
         ✗ Redirect to /admin/login
```

### 5.2 Admin Route Protection

```typescript
// src/routes/admin.tsx
export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login") return; // Allow login page
    
    const auth = localStorage.getItem("adminAuth");
    if (!auth) throw redirect({ to: "/admin/login" });
    
    // Optional: validate user object structure
    const user = JSON.parse(auth);
    if (!user.email) throw redirect({ to: "/admin/login" });
  },
  component: AdminLayout,
});
```

### 5.3 Future Backend Migration Path

```
Current State (Demo):
- localStorage only
- No server validation
- Hardcoded credentials

Migration to Supabase:
1. Replace useLocalAuth with Supabase auth
2. Add JWT token to requests
3. Enable RLS on database tables
4. Replace hook CRUD with API calls
5. Add refresh token handling

Migration to Custom API:
1. Create Express/Node backend
2. Implement JWT auth
3. Add password hashing (bcrypt)
4. Implement role-based access
5. Add API rate limiting
```

---

## 6. Core Features & Specifications

### 6.1 Admin Dashboard (`/admin`)

**Features:**
- Quick stats (Total products, Published, Featured, Orders)
- Recent products list
- Store health indicators
- Quick access to settings

**Files:**
- Route: `src/routes/admin.index.tsx`
- Layout: `src/routes/admin.tsx`
- Data: `useProducts()`, `useStoreSettings()`

---

### 6.2 Product Management

#### Create Product (`/admin/products/new`)
- Form fields: title, brand, category, description, price (source & selling), stock, images, specifications
- Image handling: URL-based (no upload backend)
- Validation: Title required, prices validated
- Submit: Generates ID with `"product-" + Date.now()`, creates timestamps, calls `addProduct()`
- Files: `src/routes/admin.products.new.tsx`, `src/components/admin/product-form.tsx`

#### Read Products (`/admin/products`)
- Table view with thumbnails, prices, status badges
- Sort: Newest first (by created_at)
- Actions per row:
  - **Publish/Unpublish**: Toggle `is_published`
  - **Feature/Unfeature**: Toggle `is_featured`
  - **Copy Link**: Product URL to clipboard
  - **Share WhatsApp**: Pre-filled WhatsApp message
  - **Edit**: Navigate to edit page
  - **Delete**: With confirmation prompt
- Pagination: Optional (currently shows all)
- Files: `src/routes/admin.products.tsx`

#### Update Product (`/admin/products/edit/:id`)
- Loads product from `getProduct(id)`
- Same form as create
- Saves changes via `updateProduct(id, updates)`
- Updates `updated_at` timestamp
- Files: `src/routes/admin.products.edit.$id.tsx`

#### Delete Product
- Inline delete with confirmation
- Calls `deleteProduct(id)`
- Removes from localStorage immediately
- Toast notification: "Deleted"

---

### 6.3 Store Settings (`/admin/settings`)

**Editable Fields:**
- `store_name`: Display name (e.g., "Catalog", "My Shop")
- `currency_code`: Currency (e.g., "GHS", "USD")
- `whatsapp_number`: Business WhatsApp number
- `hero_title`: Homepage banner headline
- `hero_subtitle`: Homepage banner subheading
- `logo_url`: Store logo image URL

**Implementation:**
- Form with validation
- Save button: Calls `saveSettings()` from `useStoreSettings()`
- Persists to localStorage immediately
- Updates reflected across all pages using the hook

**Files:** `src/routes/admin.settings.tsx`

---

### 6.4 Storefront - Shop Page (`/shop`)

**Features:**
- Grid layout (2 cols mobile, 3 cols tablet, 4 cols desktop)
- Search bar (real-time filter by title, brand, description)
- Category filter (dropdown from published products)
- Sort options: Latest, Price (Low→High), Price (High→Low)
- Responsive product cards with images, prices, ratings

**URL Parameters:**
```
/shop
/shop?q=search+term
/shop?category=electronics
/shop?sort=price_asc
/shop?q=phone&category=electronics&sort=price_desc  (multiple)
```

**Data Flow:**
1. Fetch all products via `useProducts()`
2. Filter: `is_published === true`
3. Apply search filter (client-side)
4. Apply category filter
5. Apply sort logic
6. Display in grid

**Files:** `src/routes/shop.tsx`

---

### 6.5 Product Detail Page (`/product/:slug`)

**Features:**
- Full-width image gallery with thumbnails
- Quantity selector (min 1)
- Add to Cart button
- Order via WhatsApp button (pre-filled with product info)
- Share to WhatsApp
- Copy product link
- Product specifications table
- Related products section (same category, up to 4)

**URL Example:**
- `/product/iphone-15-pro-max`

**Related Products Logic:**
- Fetch all published products
- Filter by same category
- Exclude current product
- Sort by newest first
- Limit to 4

**Files:** `src/routes/product.$slug.tsx`

---

### 6.6 Shopping Cart (`/cart`)

**Features:**
- List of cart items with quantity controls
- Item details: image, name, price, subtotal
- Update quantity (min 1)
- Remove item
- Cart subtotal, tax (if applicable), total
- Checkout via WhatsApp (order summary)
- Continue Shopping link

**WhatsApp Integration:**
- Pre-fills order message with:
  - Item names & quantities
  - Individual prices
  - Total amount
  - Sends to WhatsApp number in settings

**State Management:**
- Zustand store (`useCart`)
- Backed by localStorage
- Persists across sessions

**Files:** `src/routes/cart.tsx`

---

### 6.7 Admin Login (`/admin/login`)

**Features:**
- Clean login form with email & password
- Demo credentials pre-filled and displayed
- Error handling with toast notifications
- Remember me option (via localStorage)
- Redirect to dashboard on success
- Redirect from protected routes

**Demo Credentials (Hardcoded):**
```
Email: admin@example.com
Password: password123
```

**Files:** `src/routes/admin/login.tsx`

---

## 7. UI/Design System

### 7.1 Color Palette

```
Primary (Warm Amber):
  - #F59E0B (main)
  - #FCD34D (light)
  - #92400E (dark)

Semantic:
  - Success: #10B981 (green)
  - Destructive: #EF4444 (red)
  - Warning: #F97316 (orange)
  - Info: #3B82F6 (blue)

Neutral:
  - Background: #FFFFFF (light) / #0F172A (dark)
  - Surface: #F9FAFB (light) / #1E293B (dark)
  - Border: #E5E7EB (light) / #334155 (dark)
  - Text: #111827 (light) / #F1F5F9 (dark)
```

### 7.2 Typography

```
Font Stack:
  - Primary: Inter (sans-serif)
  - Display: Playfair Display (serif, headings)

Sizes:
  - xs: 12px
  - sm: 14px
  - base: 16px
  - lg: 18px
  - xl: 20px
  - 2xl: 24px
  - 3xl: 30px
  - 4xl: 36px

Weights:
  - Regular: 400
  - Medium: 500
  - Semibold: 600
  - Bold: 700
```

### 7.3 Component Library (shadcn/ui)

**Implemented Components:**
- Button (primary, secondary, outline, ghost, destructive)
- Input (text, email, number)
- Form (with Zod validation)
- Dialog (modal)
- Sheet (side drawer)
- Card (container)
- Table (data display)
- Select (dropdown)
- Checkbox, Radio, Toggle
- Badge (labels)
- Toast (notifications via Sonner)
- Avatar (user images)
- Skeleton (loading states)
- Breadcrumb (navigation)
- Pagination
- Accordion
- Tabs
- Carousel (images)
- Sidebar (admin nav)
- Navigation Menu
- And 15+ more...

### 7.4 Custom Design Tokens (Tailwind)

**Utilities:**
```css
.glass               /* Glassmorphism effect */
.neu-raised          /* Neumorphism raised */
.neu-button          /* Neumorphic button */
.gradient-warm       /* Warm gradient */
.smooth-transition   /* All property transitions */
```

### 7.5 Responsive Breakpoints

```
Mobile-first approach:
- base (0px)
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

Grid columns:
- Mobile: 1 (full width)
- Small: 2 columns
- Medium: 3 columns
- Large: 4 columns
```

---

## 8. API & Hooks Reference

### 8.1 useLocalAuth Hook

```typescript
// Login with demo credentials
const { user, loading, isAuthenticated, signIn, signOut } = useLocalAuth();

await signIn("admin@example.com", "password123");
// → Saves to localStorage.adminAuth
// → Returns { id, email }

signOut();
// → Clears localStorage.adminAuth
// → User redirected to /admin/login
```

**Storage:**
```
Key: "adminAuth"
Value: { id: string, email: string }
```

---

### 8.2 useProducts Hook

```typescript
const {
  products,           // Product[] - all products
  loading,           // boolean
  error,             // string | null
  addProduct,        // (product: Product) => void
  updateProduct,     // (id: string, updates: Partial<Product>) => void
  deleteProduct,     // (id: string) => void
  getProduct,        // (id: string) => Product | undefined
  getProductBySlug,  // (slug: string) => Product | undefined
} = useProducts();

// Add new product
addProduct({
  id: "product-" + Date.now(),
  slug: "my-product",
  title: "My Product",
  selling_price: 100,
  // ...rest of fields
});

// Update product
updateProduct("product-123", { stock: 50, is_published: true });

// Delete product
deleteProduct("product-123");

// Get by ID
const product = getProduct("product-123");

// Get by URL slug
const product = getProductBySlug("my-product");
```

**Storage:**
```
Key: "products"
Value: Product[] (JSON array)
```

---

### 8.3 useStoreSettings Hook

```typescript
const {
  settings,         // StoreSettings
  loading,         // boolean
  error,           // string | null
  saveSettings,    // (updates: Partial<StoreSettings>) => void
} = useStoreSettings();

// Read
console.log(settings.store_name);      // "Catalog"
console.log(settings.currency);        // "GHS"

// Write
saveSettings({
  store_name: "My Store",
  currency: "USD",
  whatsapp_number: "1234567890",
});
```

**Storage:**
```
Key: "storeSettings"
Value: {
  store_name: "Catalog",
  currency: "GHS",
  whatsapp_number: "233000000000",
  hero_title: "Discover products you love",
  hero_subtitle: "",
  logo_url: null
}
```

---

### 8.4 useCart Hook (Zustand)

```typescript
import { useCart } from "@/lib/cart-store";

const { items, add, remove, updateQty, clear, total } = useCart();

// Add item (with quantity)
add({
  id: "product-123",
  slug: "my-product",
  title: "My Product",
  price: 100,
  image: "https://example.com/image.jpg"
}, 2);  // quantity = 2

// Remove item
remove("product-123");

// Update quantity
updateQty("product-123", 5);

// Get total price
const cartTotal = total();  // number

// Clear cart
clear();

// Items array
items.forEach(item => {
  console.log(item.title, item.quantity, item.price);
});
```

**Storage:**
```
Key: "cart"
Value: { items: CartItem[] }
```

---

## 9. Setup & Installation Guide

### 9.1 Prerequisites

```
- Node.js 18+ (check: node --version)
- npm 9+ (check: npm --version)
- Git
- VS Code (recommended)
```

### 9.2 Project Initialization

#### Option A: From Scratch (Using This Design)

```bash
# 1. Create new TanStack Start project
npm create @tanstack/start@latest my-catalog

# 2. Navigate to project
cd my-catalog

# 3. Install dependencies
npm install

# 4. Add shadcn/ui
npx shadcn-ui@latest init

# 5. Install additional packages
npm install zustand sonner framer-motion @hookform/resolvers zod

# 6. Create directory structure (see Section 3.1)
# - Create folders: src/components/admin, src/components/storefront, src/hooks, src/lib/
# - Create route files in src/routes/

# 7. Copy component files from this documentation
# - Add all shadcn/ui components
# - Add custom components (ProductForm, Logo, etc.)
# - Add hooks (useLocalAuth, useProducts, useStoreSettings)

# 8. Add styling
# - Copy styles.css with design tokens
# - Add Tailwind configuration

# 9. Configure TypeScript
# - Copy tsconfig.json

# 10. Start development server
npm run dev
```

#### Option B: Clone Existing Repository

```bash
# Clone the repo
git clone https://github.com/yourusername/catalog-connect.git

# Navigate to project
cd catalog-connect

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# http://localhost:5173
```

### 9.3 Environment Configuration

**Create `.env.local`:**
```
# Development
VITE_API_URL=http://localhost:5173
VITE_WHATSAPP_BUSINESS_ID=your_business_id_here

# Optional: Supabase (for future migration)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

**Create `wrangler.jsonc` (Cloudflare):**
```jsonc
{
  "name": "catalog-connect",
  "compatibility_date": "2025-05-01",
  "env": {
    "production": {
      "routes": [
        {
          "pattern": "catalog-connect.pages.dev/*",
          "zone_name": "pages.dev"
        }
      ]
    }
  }
}
```

### 9.4 Development Server

```bash
# Start development server
npm run dev

# Output:
# ➜  Local:   http://127.0.0.1:5173/
# ➜  press h to show help

# Access app:
# http://localhost:5173 (storefront)
# http://localhost:5173/admin/login (admin login)
```

**Demo Credentials:**
```
Email: admin@example.com
Password: password123
```

### 9.5 Build Process

```bash
# Production build
npm run build

# Output:
# dist/client/      (client bundles)
# dist/server/      (server bundles)
# dist/server/index.js (entry point)

# Preview build locally
npm run preview

# Build & serve with Wrangler
npm run deploy
```

### 9.6 Deployment to Cloudflare

```bash
# 1. Install Wrangler globally
npm install -g @cloudflare/wrangler

# 2. Authenticate with Cloudflare
wrangler login

# 3. Deploy
npm run deploy

# Output:
# ✨ Build succeeded!
# 🚀 Published to https://catalog-connect.pages.dev

# 4. Custom domain setup
# - Go to Cloudflare dashboard
# - Add your domain to catalog-connect Pages project
# - Configure DNS records
```

---

## 10. Development Workflow

### 10.1 Local Development

```bash
# 1. Start dev server
npm run dev

# 2. Open editor
code .

# 3. Edit files in src/
# - Components hot reload automatically
# - TypeScript errors show in terminal & editor

# 4. Test in browser
# http://localhost:5173 (storefront)
# http://localhost:5173/admin/login (admin)

# 5. Open DevTools
# F12 → Application → LocalStorage
# → View/edit stored data directly

# 6. Test on mobile
# Get local IP: ipconfig getall
# Visit: http://[IP]:5173 from phone
```

### 10.2 File-Based Routing Development

**To create new page:**

```bash
# 1. Create file in src/routes/
# src/routes/my-page.tsx

# 2. Export TanStack Start route:
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/my-page")({
  component: MyPageComponent,
});

function MyPageComponent() {
  return <div>My Page</div>;
}

# 3. Save file
# 4. routeTree.gen.ts auto-updates
# 5. Navigate to /my-page in browser
```

### 10.3 Adding New Components

```bash
# 1. Create component file
# src/components/my-component.tsx

# 2. Export React component
export function MyComponent({ prop }: Props) {
  return <div>{prop}</div>;
}

# 3. Import in route or other component
import { MyComponent } from "@/components/my-component";

# 4. Use in JSX
<MyComponent prop="value" />
```

### 10.4 Testing Locally

**Test Admin Features:**
```
1. Open http://localhost:5173/admin/login
2. Login with admin@example.com / password123
3. Navigate to /admin/products
4. Click "Add product"
5. Fill form and save
6. Product appears in list
7. Edit/delete/publish as needed
8. Check localStorage (F12 → Application → LocalStorage)
```

**Test Storefront:**
```
1. Open http://localhost:5173/
2. Click "Shop" or go to /shop
3. Test search, filters, sorting
4. Click product → view details
5. Add to cart → view /cart
6. Test quantity updates
```

**Test Responsiveness:**
```
F12 → Toggle device toolbar (Ctrl+Shift+M)
Test on:
- Mobile (375px)
- Tablet (768px)
- Desktop (1024px+)
```

### 10.5 Code Quality

```bash
# Lint check
npm run lint

# Format code
npm run format

# Fix auto-fixable issues
npm run lint -- --fix

# Build check
npm run build
```

---

## 11. Advanced Topics

### 11.1 Future Backend Migration

**Current State (Demo):**
- localStorage only
- No server validation
- Hardcoded demo credentials

**Phase 1: Supabase Integration (Already set up)**
```typescript
// 1. Enable Supabase auth
import { supabase } from "@/integrations/supabase/client";

// 2. Update useLocalAuth to use Supabase
// 3. Add RLS policies for products table
// 4. Replace hook CRUD with server functions
```

**Phase 2: Custom Backend**
```typescript
// 1. Create Node.js/Express API
// 2. Setup PostgreSQL database
// 3. Implement JWT authentication
// 4. Replace Supabase calls with API requests
```

### 11.2 PWA Configuration

**Manifest (`public/manifest.webmanifest`):**
```json
{
  "name": "Catalog-Connect",
  "short_name": "Catalog",
  "description": "E-commerce PWA for product catalogs",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#F59E0B",
  "icons": [
    {
      "src": "/logo-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/logo-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Features:**
- Install on home screen (iOS Safari, Chrome)
- Offline support (with service worker)
- Full-screen experience
- Custom theme color

### 11.3 Performance Optimization

```typescript
// 1. Code splitting (automatic with Vite)
// Routes load only when needed

// 2. Image optimization
// Use next-gen formats: WebP
const imageUrl = "/images/product.webp";

// 3. Lazy loading
import { lazy } from "react";
const LargeComponent = lazy(() => import("./LargeComponent"));

// 4. Memoization (avoid unnecessary re-renders)
import { useMemo } from "react";
const filtered = useMemo(() => filterProducts(), [products]);

// 5. Bundle analysis
npm run build -- --analyze

// 6. Monitor performance
console.log("Page load time:", performance.now());
```

### 11.4 Security Considerations

**Current Vulnerabilities (Demo):**
- ⚠️ Hardcoded credentials (acceptable for demo only)
- ⚠️ No server-side validation
- ⚠️ Client-side auth only

**Production Recommendations:**
```typescript
// 1. Remove hardcoded credentials
// 2. Implement server-side password hashing
// 3. Add rate limiting on login
// 4. Implement JWT with refresh tokens
// 5. Enable HTTPS only
// 6. Add CORS restrictions
// 7. Sanitize user inputs
// 8. Implement CSP headers
// 9. Regular security audits
// 10. Keep dependencies updated
```

---

## 12. Troubleshooting & FAQ

### 12.1 Common Issues

**Issue: "Cannot find module '@/components/...'**
```
Solution: Check tsconfig.json paths:
"@/*": ["./src/*"]

Restart TypeScript server in VS Code
```

**Issue: localStorage not persisting**
```
Solution: Check browser settings
- Privacy mode? (localStorage is cleared)
- Storage quota exceeded? (unlikely with 50KB data)
- Clear browser cache and reload

To debug:
const data = localStorage.getItem("products");
console.log(JSON.parse(data));
```

**Issue: Routes not working**
```
Solution: Check routeTree.gen.ts is auto-generated
- Restart dev server
- Ensure file is in src/routes/
- Use correct naming convention
```

**Issue: Components not hot-reloading**
```
Solution: Restart dev server
npm run dev
```

### 12.2 FAQ

**Q: Can I use this with a real database?**
A: Yes! This is designed for easy migration to Supabase or custom API. See Section 11.1.

**Q: How do I add new products via API?**
A: Currently, use admin UI. For API integration, add REST endpoints to hook functions.

**Q: Can I customize colors/branding?**
A: Yes! Edit Tailwind config and CSS variables in src/styles/styles.css.

**Q: How do I add payment processing?**
A: Integrate Stripe/PayPal into cart checkout. Currently uses WhatsApp for orders.

**Q: Is this production-ready?**
A: Yes, for MVP. For scale, implement backend database & authentication (Phase 1).

**Q: How do I backup product data?**
A: Export localStorage: `JSON.stringify(JSON.parse(localStorage.getItem("products")))`

---

## 13. Technology Decision Rationale

| Technology | Why Chosen | Alternatives Considered |
|-----------|-----------|------------------------|
| **TanStack Start** | Modern full-stack React, file-based routing, SSR/SSG | Next.js, Remix |
| **Tailwind CSS** | Fast development, small bundle, great for PWAs | Bootstrap, Material-UI |
| **shadcn/ui** | Composable, accessible, Tailwind-based | Headless UI, Radix |
| **Zustand** | Lightweight state management, easy to learn | Redux, Jotai, Recoil |
| **localStorage** | No backend required for MVP, instant persistence | IndexedDB, cookies |
| **Cloudflare Workers** | Global distribution, zero cold start, great DX | Vercel, Netlify, AWS |

---

## 14. Version History & Roadmap

### 14.1 Current Version: 1.0.0

**Features:**
- ✅ Admin authentication (demo)
- ✅ Product CRUD
- ✅ Store settings
- ✅ Shopping cart
- ✅ Product listing & search
- ✅ WhatsApp integration
- ✅ PWA support
- ✅ Responsive design
- ✅ Dark mode

### 14.2 Roadmap

**v1.1 (Q3 2026):**
- Real Supabase integration
- Product images upload
- Order management system
- Admin analytics dashboard

**v1.2 (Q4 2026):**
- Payment integration (Stripe)
- Inventory notifications
- Customer accounts
- Order history

**v2.0 (2027):**
- Multi-language support
- AI-powered search
- Recommendation engine
- Advanced analytics
- Mobile app (React Native)

---

## 15. Support & Documentation

### 15.1 Internal Documentation Files

- `GETTING_STARTED.md` - Quick start guide
- `MARKET_READINESS.md` - Production checklist
- `SECURITY_AUDIT.md` - Security considerations
- `LOCAL_AUTH_GUIDE.md` - Auth system details
- `UI_UX_GUIDE.md` - Design system & components

### 15.2 External Resources

- TanStack Start: https://tanstack.com/start/latest
- TanStack Router: https://tanstack.com/router/latest
- Tailwind CSS: https://tailwindcss.com
- shadcn/ui: https://ui.shadcn.com
- React 19: https://react.dev

### 15.3 Getting Help

```
1. Check error message in browser console (F12)
2. Search troubleshooting section (12.1)
3. Check related documentation file
4. Create GitHub issue with:
   - Error message
   - Steps to reproduce
   - Browser/OS info
   - Screenshot/video
```

---

## 16. License & Legal

**Project:** Catalog-Connect  
**License:** MIT  
**Copyright:** 2026

Feel free to use, modify, and distribute this codebase for personal and commercial projects.

---

**End of Technical Design Document**

Generated: May 2026  
Last Updated: May 12, 2026  
Status: Production Ready
