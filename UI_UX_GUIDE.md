# Complete UI/UX & Product Guide — Catalog Connect

---

## Table of Contents

1. [Design System](#1-design-system)
2. [Visual Effects & Mockup Style](#2-visual-effects--mockup-style)
3. [Admin Authentication — How It Works](#3-admin-authentication--how-it-works)
4. [Page-by-Page Content Details](#4-page-by-page-content-details)
5. [Admin Panel Deep Dive](#5-admin-panel-deep-dive)
6. [Product Importer — Logic & UI](#6-product-importer--logic--ui)
7. [Admin Products Page](#7-admin-products-page)
8. [Unique Design Details & Micro-Interactions](#8-unique-design-details--micro-interactions)
9. [Testing & Development Workflow](#9-testing--development-workflow)

---

## 1. Design System

### Color Tokens (Light Mode)

| Token                  | HSL Value    | Usage                                   |
| ---------------------- | ------------ | --------------------------------------- |
| `--background`         | `40 30% 97%` | Warm off-white page background          |
| `--foreground`         | `30 15% 12%` | Dark warm-brown primary text            |
| `--primary`            | `38 92% 50%` | **Amber** — buttons, highlights, badges |
| `--primary-foreground` | `30 15% 8%`  | Text on amber surfaces                  |
| `--card`               | `40 25% 99%` | Card/panel backgrounds                  |
| `--secondary`          | `35 20% 92%` | Subtle chip/badge backgrounds           |
| `--muted-foreground`   | `30 10% 50%` | Subdued/secondary text                  |
| `--border`             | `35 20% 88%` | Input borders, dividers                 |
| `--destructive`        | `0 84% 60%`  | Red for errors and delete actions       |

### Dark Mode

Dark mode mirrors these tokens with a deep warm-dark palette (`25 15% 8%` background).

### Typography

- **Font Family**: Rounded sans-serif (Plus Jakarta Sans, Inter) for friendly, modern feel
- **Display Font**: Playfair Display for headings and branding
- **Scale**: Responsive sizing from mobile to desktop

### Accent Colors

- **Primary**: Amber #F59E0B (warm, energetic, commerce-friendly)
- **Neutrals**: Warm grays and beiges for depth
- **Dark Mode**: Deep warm backgrounds with light text

---

## 2. Visual Effects & Mockup Style

### Glassmorphism

- Frosted glass navbar with semi-transparent backdrop
- Blurred overlay effects on modals and overlays
- Frosted glass cards for layered depth

### Neumorphism

- Raised tactile buttons with soft shadows
- Hover state lifts elements for interactive feedback
- Card surfaces with subtle depth and shadows

### Motion & Animations

- **Framer Motion** transitions for smooth page changes
- Hover lifts on interactive elements
- Cart badge bounce animation when items added
- Smooth scroll behaviors and fade-ins

### Theme Modes

- Light mode (warm, inviting)
- Dark mode (deep, sophisticated)
- System theme toggle in navbar

---

## 3. Admin Authentication — How It Works

### Auth Provider

We use **Supabase** for authentication:

- Supports email/password login out of the box
- Optional: Implement passwordless login (email magic links) for seamless access
- Secure session management with JWT tokens
- Role-based access control (admin vs customer)

### Admin Login Flow

1. User navigates to `/admin` or clicks admin link
2. Redirected to login page if not authenticated
3. Sign-in via Supabase with email/password
4. After successful authentication, redirected to `/admin` dashboard
5. Admin area remains protected requiring valid auth token
6. Logout clears session and returns to storefront

### Security Features

- Protected `/admin` routes with `beforeLoad` guards
- JWT verification on server functions
- User roles tracked in `user_roles` table (admin/customer)
- Row-Level Security (RLS) policies enforce access control

---

## 4. Page-by-Page Content Details

### Storefront Pages

- **Home (`/`)**: Hero section, featured products, CTA buttons
- **Shop (`/shop`)**: Full product grid with filters and sorting
- **Product Detail (`/product/:slug`)**: Full product info, images, price, add to cart
- **Cart (`/cart`)**: Cart items list, quantity adjustment, WhatsApp checkout button
- **PWA Features**: Install prompt, offline caching, push notification support

### Admin Pages

- **Dashboard (`/admin`)**: KPI cards (revenue, orders, products), recent activity
- **Products (`/admin/products`)**: Product table, import feature, edit/delete options
- **Add Product (`/admin/products/new`)**: Form to create new products
- **Edit Product (`/admin/products/edit/:id`)**: Update product details and images
- **Orders (`/admin/orders`)**: Order list with status tracking and WhatsApp integration
- **Settings (`/admin/settings`)**: Store name, WhatsApp, logo, hero text, currency

---

## 5. Admin Panel Deep Dive

### Dashboard Overview

Quick-action dashboard with:

- **KPI Cards**: Total revenue, order count, product count, published products
- **Recent Orders**: Last 5 orders with status and customer info
- **Recent Products**: Latest added products with publish status
- **Quick Action Buttons**: Import Product, View Orders, Store Settings

### Sidebar Navigation

- Dashboard link
- Products section (Products, Add Product)
- Orders link
- Settings link
- Logout button

### Admin Branding

- Store logo displayed in sidebar header
- Store name next to logo
- Consistent with storefront branding

---

## 6. Product Importer — Logic & UI

### Product Import Workflow

1. **URL Input**: Admin pastes product URL (e.g., from Jumia, other ecommerce platforms)
2. **Scraping**: System fetches product details:
   - Product title
   - Description/specifications
   - Product images
   - Original price
   - Brand/category information
3. **Data Preview**: Scraped data displayed in editable form
4. **Customization**: Admin can adjust:
   - Images (preview, remove, reorder)
   - Selling price (set your own margin)
   - Product description
   - Brand and category
   - Featured/Published toggles

### Product Importer UI

- Form with URL input field and "Import" button
- Loading state with progress indicator
- Error handling with helpful messages
- Preview section showing fetched data
- Edit section with image manager and price calculator
- Save/Cancel buttons

### Authentication

- Product import endpoint requires admin authentication
- JWT verification ensures only authorized admins can import
- Server-side validation prevents unauthorized access

---

## 7. Admin Products Page

### Products Table View

- **Columns**: Product image, title, brand, category, price, status (featured/published)
- **Row Actions**: Edit button, Delete button, Preview button
- **Bulk Actions**: Select multiple products (optional)
- **Search & Filter**: Search by title/brand, filter by category/status

### Product Management

- **Edit**: Click row to open edit form
  - Update title, description, images, price
  - Toggle featured/published status
  - Save or discard changes
- **Delete**: Confirm deletion, remove from store
- **Preview**: Open product detail page in new tab
- **Import**: At top of page, quick access to product importer

### Pagination & Performance

- Load products in batches
- Infinite scroll or pagination controls
- Real-time status updates
- Search results update instantly

---

## 8. Unique Design Details & Micro-Interactions

### Visual Feedback

- **Profit Color Coding**: Margin colors change based on profitability
  - Green: Healthy margin (>30%)
  - Yellow: Normal margin (15-30%)
  - Red: Low margin (<15%)

- **Blob Animations**: Playful blob shapes with animated offsets for visual interest
- **Gradient Backgrounds**: Warm amber gradients on prominent elements

### Form Interactions

- **Enter-Key Shortcuts**: Submit forms with Enter key
- **Tab Navigation**: Smooth focus management between inputs
- **Validation Feedback**: Real-time error messages and success states
- **Placeholder Hints**: Helpful placeholder text with examples

### Interactive Elements

- **Cart Badge**: Animated bounce when items added to cart
- **WhatsApp Button**: Styled CTA with icon and hover effects
- **Hover States**: Lift on hover, shadow depth increases
- **Loading States**: Spinner or skeleton screens during data fetch

### Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast meets WCAG standards
- Focus indicators visible on all interactive elements

### Responsive Design

- Mobile-first approach
- Breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- Touch-friendly buttons (min 44px height)
- Responsive typography that scales smoothly
- Sidebar collapses to hamburger menu on mobile

---

## Design Implementation Notes

### Custom CSS Utilities

- `.glass`: Glassmorphic frosted effect
- `.neu-raised`: Neumorphic raised button style
- `.neu-button`: Neumorphic interactive button
- `.gradient-warm`: Warm amber gradient background
- Various animation utilities for smooth transitions

### Component Library

Using shadcn/ui components as base:

- Button, Input, Select, Dialog, Sheet, Sidebar
- Form components with validation
- Table for data display
- Toast notifications (Sonner)
- Tooltips and popovers

### Performance Optimization

- Image lazy loading on product grids
- Code splitting for admin and storefront routes
- Efficient data fetching with TanStack Query
- Optimistic updates on mutations
- Service Worker for offline caching

---

## 9. Testing & Development Workflow

### Test Mode for Admin Section

For development and testing, a **Test Mode** is available to bypass authentication:

#### Enabling Test Mode

1. Navigate to: `http://localhost:5173/admin/login?testmode=true`
2. Click **"Enter Test Mode"** button
3. Gain full access to admin dashboard without authentication
4. Test mode persists in localStorage until manually disabled

#### What You Can Test

- ✅ Product Importer (paste URL → scrape → edit → save)
- ✅ Product CRUD (Create, Read, Update, Delete)
- ✅ Admin Dashboard (KPIs, recent activity)
- ✅ Orders Management (view, update status)
- ✅ Store Settings (name, logo, WhatsApp, hero text)
- ✅ Image upload and management

#### Why Test Mode?

- **Quick iteration**: Test features without setting up authentication
- **Product Import verification**: Confirm scraping works correctly
- **UI/UX validation**: Test all admin features end-to-end
- **Database connection**: Verify Supabase integration
- **Development workflow**: Faster feedback loop

#### Disabling Test Mode

```javascript
// Open browser DevTools (F12) and run:
localStorage.removeItem("adminTestMode");
```

Or use the "Use regular login instead" button on `/admin/login`

### Development Checklist

#### Before Testing Product Importer

- [ ] Supabase project created and configured
- [ ] Environment variables (.env) set with correct URLs
- [ ] Database schema deployed (migrations applied)
- [ ] Build succeeds: `npm run build`
- [ ] Dev server running: `npm run dev`

#### Testing Product Import

- [ ] Enable test mode
- [ ] Navigate to `/admin/products`
- [ ] Paste valid product URL (Jumia, Amazon, etc.)
- [ ] Verify scraped data appears correctly
- [ ] Edit product details (optional)
- [ ] Save product to database
- [ ] Verify product appears in products list
- [ ] Check product visible on storefront

#### Testing Product CRUD

- [ ] Create new product manually (no import)
- [ ] Edit product details and images
- [ ] Update product pricing
- [ ] Toggle featured/published status
- [ ] Delete product and verify removal

#### Testing Admin Features

- [ ] Dashboard shows correct metrics
- [ ] Orders list displays all orders
- [ ] Can update order status
- [ ] Settings save correctly
- [ ] Logo changes reflect immediately
- [ ] Store name updates appear everywhere

#### Testing Responsive Design

- [ ] Admin works on mobile (sidebar collapses)
- [ ] Admin works on tablet
- [ ] Admin works on desktop
- [ ] All buttons/inputs touch-friendly
- [ ] No horizontal scroll

### Production Readiness

#### Security Pre-Launch

- [ ] Test mode disabled or removed
- [ ] Real authentication configured (Supabase email/password)
- [ ] Admin RLS policies verified
- [ ] JWT validation on endpoints
- [ ] No test data in production database

#### Performance Checks

- [ ] Admin dashboard loads < 2 seconds
- [ ] Product list pagination works smoothly
- [ ] Image uploads complete quickly
- [ ] No console errors
- [ ] Network requests optimized

#### Data Integrity

- [ ] All product data validates correctly
- [ ] Images display without issues
- [ ] Orders track accurately
- [ ] Settings persist after refresh
- [ ] Cart operations work smoothly

---

## Next Steps

1. **Enable Test Mode**: Navigate to `http://localhost:5173/admin/login?testmode=true`
2. **Test Product Importer**: Paste a product URL and verify scraping works
3. **Test Admin Features**: Create/edit/delete products and orders
4. **Verify Responsiveness**: Test on mobile, tablet, and desktop
5. **Review [TEST_MODE_GUIDE.md](TEST_MODE_GUIDE.md)**: Detailed testing procedures
6. **Check Design System**: Review `src/styles.css` for tokens
7. **Validate Accessibility**: Test keyboard navigation and screen readers
8. **Performance Audit**: Measure load times and bundle sizes

---

## Related Documentation

- [TEST_MODE_GUIDE.md](TEST_MODE_GUIDE.md) - Detailed testing procedures
- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Database setup instructions
- [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) - Pre-launch verification
- [SECURITY_AUDIT.md](SECURITY_AUDIT.md) - Security considerations
- [LOGO_SETUP.md](LOGO_SETUP.md) - Custom logo configuration

---

**Last Updated**: May 2026  
**Status**: Production-ready design system with test mode for development
