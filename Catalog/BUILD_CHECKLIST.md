# Catalog by Cyrus — Build Checklist

**Status Date:** May 12, 2026  
**Overall Progress:** 0% (Starting Phase)

---

## 📋 PHASE 1: PROJECT SETUP & INFRASTRUCTURE

### Monorepo Structure
- [ ] Initialize pnpm workspace (`pnpm-workspace.yaml`)
- [ ] Setup root `package.json` with workspace scripts
- [ ] Configure Turbo for monorepo orchestration (`turbo.json`)
- [ ] Create `.gitignore` for monorepo
- [ ] Setup `.env.example` template

### Directory Structure
- [ ] Create `/apps/web` directory
- [ ] Create `/apps/admin` directory
- [ ] Create `/apps/scraper` directory
- [ ] Create `/packages/ui` directory
- [ ] Create `/packages/hooks` directory
- [ ] Create `/packages/utils` directory
- [ ] Create `/packages/types` directory
- [ ] Create `/packages/config` directory
- [ ] Create `/packages/api-client` directory
- [ ] Create `/supabase/migrations` directory
- [ ] Create `/supabase/functions` directory
- [ ] Create `/docs` directory
- [ ] Create `/scripts` directory

### Git & CI/CD
- [ ] Initialize git repo
- [ ] Create `.github/workflows` for CI/CD
- [ ] Setup pre-commit hooks
- [ ] Configure branch protection rules

---

## 🎨 PHASE 2: DESIGN SYSTEM & SHARED PACKAGES

### Typography & Fonts
- [ ] Add Playfair Display font (display)
- [ ] Add Inter / Plus Jakarta Sans (UI text)
- [ ] Configure Tailwind typography plugin

### Colors & Theming
- [ ] Create Tailwind config with dark mode colors
  - [ ] Background: deep warm black (#0f0e0c or similar)
  - [ ] Surface: dark chocolate brown (#1a1714)
  - [ ] Primary: amber/orange (#f59e0b)
  - [ ] Accent: gold (#fbbf24)
  - [ ] Text: warm white
- [ ] Create light mode colors
- [ ] Setup CSS variables for theming
- [ ] Create theme switcher component

### Shared UI Components (`/packages/ui`)
- [ ] Button component
- [ ] Card component
- [ ] Input component
- [ ] Select/Dropdown component
- [ ] Modal/Dialog component
- [ ] Toast/Notification component
- [ ] Navigation component
- [ ] Footer component
- [ ] Product card component
- [ ] Image gallery component
- [ ] Rating/Stars component
- [ ] Badge component
- [ ] Skeleton loaders
- [ ] Search bar component
- [ ] Filter sidebar component
- [ ] Pagination component

### Shared Types (`/packages/types`)
- [ ] User type
- [ ] Product type
- [ ] ProductVariant type
- [ ] Order type
- [ ] OrderItem type
- [ ] Cart type
- [ ] Wishlist type
- [ ] Category type
- [ ] Review type
- [ ] AnalyticsEvent type
- [ ] Notification type

### Shared Hooks (`/packages/hooks`)
- [ ] `useCart()` - manage cart state
- [ ] `useWishlist()` - manage wishlist
- [ ] `useAuth()` - auth context hook
- [ ] `useTheme()` - theme toggling
- [ ] `usePrevious()` - track previous value
- [ ] `useMediaQuery()` - responsive hooks
- [ ] `useInfiniteScroll()` - lazy loading
- [ ] `usePagination()` - pagination logic

### Shared Utils (`/packages/utils`)
- [ ] `formatCurrency()` - GHS formatting
- [ ] `calculateProfit()` - profit calculator
- [ ] `calculateDiscount()` - discount percentage
- [ ] `slugify()` - URL-safe slugs
- [ ] `validateEmail()` - email validation
- [ ] `validatePhone()` - Ghana phone validation
- [ ] `formatDate()` - date formatting
- [ ] `getCartSummary()` - cart calculations

### Config (`/packages/config`)
- [ ] App constants
- [ ] API endpoints
- [ ] Feature flags
- [ ] Theme config
- [ ] Payment methods config
- [ ] Delivery regions config

### API Client (`/packages/api-client`)
- [ ] Supabase client initialization
- [ ] Authentication service
- [ ] Product queries/mutations
- [ ] Order queries/mutations
- [ ] Cart service
- [ ] Wishlist service
- [ ] TanStack Query setup & hooks
- [ ] Error handling interceptors

---

## 📱 PHASE 3: STOREFRONT (Web App)

### Pages Structure
- [ ] `/` (Home)
- [ ] `/shop` (Products listing)
- [ ] `/product/:slug` (Product details)
- [ ] `/cart` (Shopping cart)
- [ ] `/wishlist` (Saved items)
- [ ] `/checkout` (Preorder form)
- [ ] `/auth/signup` (Customer signup)
- [ ] `/auth/login` (Customer login)
- [ ] `/account/profile` (User profile)
- [ ] `/account/orders` (Order history)
- [ ] `/account/wishlist` (Synced wishlist)
- [ ] `/order/:id` (Order tracking)
- [ ] `/faq` (FAQ page)
- [ ] `/delivery` (Delivery policy)
- [ ] `/refund` (Refund policy)
- [ ] `/preorder-info` (Preorder explanation)
- [ ] `/contact` (Contact page)
- [ ] `/404` (Not found)

### Home Page
- [ ] Hero section with background image
  - [ ] Title: "Discover Amazing Products Brought to you"
  - [ ] Subtitle with description
  - [ ] CTA buttons: Shop Now, Explore Categories
  - [ ] Background video or gradient
- [ ] Featured Products section
  - [ ] Display 3-6 featured products
  - [ ] "View All" link
  - [ ] Product grid with proper spacing
- [ ] Categories section
  - [ ] Category cards/buttons
  - [ ] Icons per category
- [ ] Flash Discounts section
  - [ ] Time-limited offers display
  - [ ] Countdown timer
- [ ] Why Shop With Us section
  - [ ] Trust badges
  - [ ] Value propositions
- [ ] Reviews/Testimonials section
  - [ ] Customer reviews carousel
  - [ ] Star ratings
- [ ] Newsletter signup
- [ ] Footer with social links
- [ ] Floating WhatsApp button

### Shop Page
- [ ] Search bar with autocomplete
- [ ] Filter sidebar:
  - [ ] Category filter (multi-select)
  - [ ] Price range slider
  - [ ] Discount filter
  - [ ] Availability filter
  - [ ] Reset filters button
- [ ] Sort options:
  - [ ] Newest
  - [ ] Cheapest
  - [ ] Most popular
  - [ ] Discounted
  - [ ] Best rated
- [ ] Product grid (responsive: 1/2/3/4 columns)
- [ ] Product cards:
  - [ ] Product image
  - [ ] Product title
  - [ ] Star rating & review count
  - [ ] Price (original + selling)
  - [ ] Discount badge
  - [ ] Stock status badge
  - [ ] Wishlist button
  - [ ] Add to cart button
  - [ ] Quick preview modal
- [ ] Pagination / Infinite scroll
- [ ] Empty state when no results
- [ ] Loading skeletons

### Product Details Page
- [ ] Image gallery
  - [ ] Main image display
  - [ ] Thumbnail carousel
  - [ ] Zoom functionality
  - [ ] Image counter
- [ ] Product info column:
  - [ ] Product title
  - [ ] Star rating with count
  - [ ] Stock status indicator
  - [ ] Original price (strikethrough)
  - [ ] Selling price (highlighted)
  - [ ] Discount percentage badge
  - [ ] Short description
  - [ ] Add to cart CTA
  - [ ] Buy Now CTA
  - [ ] Wishlist button
- [ ] Variants section (if applicable)
  - [ ] Color selector
  - [ ] Size selector
  - [ ] Storage selector
  - [ ] Price updates per variant
- [ ] Description & specifications tabs
  - [ ] Full description
  - [ ] Specifications list
  - [ ] Features list
- [ ] Trust section:
  - [ ] Preorder info badge
  - [ ] Nationwide delivery badge
  - [ ] Payment first notice
  - [ ] WhatsApp support link
- [ ] Related products section
  - [ ] Show 4-6 related items
- [ ] Reviews section (stars only)

### Cart Page
- [ ] Cart items list:
  - [ ] Product image thumbnail
  - [ ] Product name & variant
  - [ ] Price per item
  - [ ] Quantity controls (+ / -)
  - [ ] Remove button
  - [ ] Item subtotal
- [ ] Cart summary:
  - [ ] Subtotal
  - [ ] Shipping (if applicable)
  - [ ] Total
- [ ] Checkout button
- [ ] Continue shopping link
- [ ] Empty cart state
- [ ] Save for later button (wishlist)
- [ ] Coupon input (if applicable)
- [ ] Cart persistence (localStorage + Supabase sync)

### Wishlist Page
- [ ] Saved items grid
  - [ ] Product cards similar to shop
  - [ ] Remove from wishlist button
  - [ ] Move to cart button
- [ ] Empty state
- [ ] Sort/filter options
- [ ] Wishlist count badge in header

### Checkout / Preorder Flow
- [ ] Step 1: Cart Review
  - [ ] Show items being ordered
  - [ ] Edit quantities (link back to cart)
  - [ ] Total display
- [ ] Step 2: Customer Info Form
  - [ ] Full name input
  - [ ] Phone number input (with Ghana validation)
  - [ ] Region/State dropdown
  - [ ] City input
  - [ ] Address/Street input
  - [ ] Landmark input (optional)
  - [ ] Delivery notes (optional)
  - [ ] Form validation
  - [ ] Save for future orders (checkbox)
- [ ] Step 3: Review & Submit
  - [ ] Order summary
  - [ ] Delivery address review
  - [ ] Submit preorder button
  - [ ] Privacy notice
- [ ] Step 4: Success Screen
  - [ ] Order confirmation number
  - [ ] Order summary
  - [ ] WhatsApp redirect button (prefilled message)
  - [ ] Continue shopping link

### WhatsApp Integration
- [ ] Generate prefilled WhatsApp message with:
  - [ ] Product names & quantities
  - [ ] Total price
  - [ ] Delivery address
  - [ ] Special instructions
- [ ] WhatsApp link generation
- [ ] Floating WhatsApp chat button (home/shop pages)
- [ ] WhatsApp contact in footer
- [ ] WhatsApp support badge on product page

### Authentication (Optional for MVP)
- [ ] Signup page
  - [ ] Email input
  - [ ] Password input
  - [ ] Confirm password
  - [ ] Phone number (optional)
  - [ ] Form validation
  - [ ] Submit button
- [ ] Login page
  - [ ] Email input
  - [ ] Password input
  - [ ] Remember me checkbox
  - [ ] Forgot password link
  - [ ] Submit button
- [ ] Password reset flow
- [ ] Email verification
- [ ] Auth state management (Supabase Auth)
- [ ] Protected routes wrapper

### User Account Pages
- [ ] Profile page:
  - [ ] Edit name
  - [ ] Edit phone
  - [ ] Edit email
  - [ ] Saved addresses
  - [ ] Save settings button
- [ ] Order history:
  - [ ] List all orders
  - [ ] Order status badges
  - [ ] Order date
  - [ ] Order total
  - [ ] View details link
  - [ ] Reorder button
- [ ] Order tracking:
  - [ ] Order number
  - [ ] Status timeline
  - [ ] Current status highlighted
  - [ ] Estimated delivery
  - [ ] WhatsApp support link

### Static Pages
- [ ] FAQ page with collapsible sections
- [ ] Delivery policy page
- [ ] Refund policy page
- [ ] Preorder explanation page
- [ ] Contact page with form
- [ ] 404 error page

### Header/Navigation
- [ ] Logo with home link
- [ ] Search bar (with icon)
- [ ] Nav links: Home, Shop
- [ ] Account icon/dropdown (if logged in) or Login link
- [ ] Wishlist icon with count badge
- [ ] Cart icon with count badge
- [ ] Settings icon (theme toggle)
- [ ] Mobile hamburger menu
- [ ] Responsive mobile nav drawer

### Footer
- [ ] Footer links:
  - [ ] FAQ
  - [ ] Delivery Policy
  - [ ] Refund Policy
  - [ ] Contact
  - [ ] Preorder Info
- [ ] Social links:
  - [ ] WhatsApp
  - [ ] Instagram
  - [ ] Telegram
  - [ ] TikTok
- [ ] Newsletter signup
- [ ] Copyright info
- [ ] Payment methods display
- [ ] Trust badges

### Responsive Design
- [ ] Mobile: 320px+
- [ ] Tablet: 768px+
- [ ] Desktop: 1024px+
- [ ] Touch-friendly buttons (48px min)
- [ ] Mobile-first approach
- [ ] Test on various devices

### Performance
- [ ] Image optimization (webp, lazy loading)
- [ ] Code splitting per route
- [ ] Bundle size optimization
- [ ] Core Web Vitals optimized
- [ ] PWA capabilities (installable)

### PWA Setup
- [ ] Service worker registration
- [ ] Web app manifest
- [ ] Install prompts
- [ ] Offline support (basic)
- [ ] App icon (192x192, 512x512)
- [ ] Splash screens

---

## ⚙️ PHASE 4: ADMIN DASHBOARD

### Authentication
- [ ] Admin login page
- [ ] Supabase Auth integration
- [ ] Protected admin routes
- [ ] Session management
- [ ] Logout functionality
- [ ] Single admin account (email-based)

### Admin Navigation
- [ ] Sidebar with menu items:
  - [ ] Dashboard
  - [ ] Products
  - [ ] Orders
  - [ ] Customers (optional for MVP)
  - [ ] Settings
  - [ ] Analytics (optional)
- [ ] User profile dropdown
- [ ] Logout button
- [ ] "View Store" button (link to storefront)

### Dashboard Analytics Page
- [ ] Summary cards (neumorphic design):
  - [ ] Total Products (count & trend)
  - [ ] Published Products (count)
  - [ ] Orders (count & status breakdown)
  - [ ] Revenue (total & this month)
  - [ ] Pending Payment Orders
  - [ ] Confirmed Orders
  - [ ] Delivered Orders
  - [ ] Wishlist Count
- [ ] Charts:
  - [ ] Revenue over time (line chart)
  - [ ] Orders status breakdown (pie chart)
  - [ ] Best selling products (bar chart)
- [ ] Recent orders table
- [ ] Recent activities log

### Products Management
- [ ] Products list page:
  - [ ] Table view with columns:
    - [ ] Product image (thumbnail)
    - [ ] Product name
    - [ ] Category
    - [ ] Price (selling)
    - [ ] Stock status
    - [ ] Published status (badge)
    - [ ] Featured badge (if applicable)
    - [ ] Actions (edit, view, delete)
  - [ ] Search products by name
  - [ ] Filter by category
  - [ ] Filter by status (published/draft)
  - [ ] Filter by stock (available/low/out)
  - [ ] Sort options
  - [ ] Pagination
  - [ ] Bulk actions (delete, publish, feature)
  - [ ] Add Product button
  - [ ] Import Product button

- [ ] Add Product page:
  - [ ] Import from URL section:
    - [ ] URL input (Jumia, Amazon, AliExpress, eBay)
    - [ ] Import button
    - [ ] Loading state with scrape progress
    - [ ] Preview before save
  - [ ] Product details section:
    - [ ] Product title input (required)
    - [ ] Product slug (auto-generate + editable)
    - [ ] Brand input
    - [ ] Category dropdown (required)
    - [ ] Description textarea
    - [ ] Short description
  - [ ] Pricing section:
    - [ ] Source/Original price input
    - [ ] Your selling price input (required)
    - [ ] Discount price input (optional)
    - [ ] Markup percentage calculator
    - [ ] Profit calculator
    - [ ] Shipping cost input
    - [ ] Profit margin indicator (green/yellow/red)
  - [ ] Stock section:
    - [ ] Stock status dropdown (Available/Limited/Sold Out)
    - [ ] Available quantity input
  - [ ] Product images section:
    - [ ] Main image upload (drag & drop)
    - [ ] Additional images (gallery)
    - [ ] Image URL input option
    - [ ] Image preview
    - [ ] Reorder images
    - [ ] Remove image button
  - [ ] Variants section (optional):
    - [ ] Add variant button
    - [ ] Variant type selector (Color/Size/Storage/Model)
    - [ ] Variant value input
    - [ ] Variant price input
    - [ ] Remove variant button
  - [ ] Publication settings:
    - [ ] Published checkbox
    - [ ] Featured checkbox
    - [ ] Publish date (optional)
  - [ ] Save button
  - [ ] Save & Add Another button
  - [ ] Cancel button
  - [ ] Auto-save draft feature

- [ ] Edit Product page (same as Add, but pre-filled)
- [ ] Delete Product confirmation modal
- [ ] Product view page (preview for testing)

### Orders Management
- [ ] Orders list page:
  - [ ] Table view with columns:
    - [ ] Order ID (clickable)
    - [ ] Customer name
    - [ ] Order date
    - [ ] Total amount
    - [ ] Status badge (pending/confirmed/processing/dispatched/delivered/cancelled)
    - [ ] Payment status
    - [ ] Actions (view, edit status, delete)
  - [ ] Filter by status
  - [ ] Filter by payment status
  - [ ] Filter by date range
  - [ ] Search by order ID or customer name
  - [ ] Sort options
  - [ ] Pagination

- [ ] Order details page:
  - [ ] Order header:
    - [ ] Order ID
    - [ ] Order date
    - [ ] Order status (with timeline)
  - [ ] Order items section:
    - [ ] Product image
    - [ ] Product name & variant
    - [ ] Quantity
    - [ ] Price per unit
    - [ ] Subtotal
  - [ ] Customer info:
    - [ ] Customer name
    - [ ] Phone number
    - [ ] Email (if available)
    - [ ] Delivery address
    - [ ] Landmark (if provided)
    - [ ] Special notes
  - [ ] Order summary:
    - [ ] Subtotal
    - [ ] Shipping
    - [ ] Total
  - [ ] Status update section:
    - [ ] Current status display
    - [ ] Status change dropdown
    - [ ] Update button
    - [ ] Timestamp of last update
  - [ ] Payment info:
    - [ ] Payment status badge
    - [ ] Payment method info
    - [ ] Manual payment notes field
    - [ ] Mark as paid button
  - [ ] Action buttons:
    - [ ] Send WhatsApp message
    - [ ] Print order
    - [ ] Cancel order (if allowed)
    - [ ] Export as PDF
  - [ ] Activity log (status changes, notes)

- [ ] Quick action buttons:
  - [ ] Mark payment confirmed
  - [ ] Send dispatch notification
  - [ ] Generate delivery label (optional)

### Settings Page
- [ ] Store Info section:
  - [ ] Store name input
  - [ ] Store logo upload
  - [ ] Store tagline
  - [ ] Currency selector (default: GHS)
  - [ ] Base shipping cost
  - [ ] Delivery regions (list of deliverable areas)
  - [ ] Save button

- [ ] Contact Info section:
  - [ ] WhatsApp number (with country code)
  - [ ] Email address
  - [ ] Phone number
  - [ ] Support hours
  - [ ] Save button

- [ ] Social Media section:
  - [ ] Instagram URL
  - [ ] Telegram URL
  - [ ] TikTok URL
  - [ ] Facebook URL (optional)
  - [ ] Save button

- [ ] Hero Section Customization:
  - [ ] Hero title input
  - [ ] Hero subtitle input
  - [ ] Hero background image upload
  - [ ] Hero CTA text
  - [ ] Save button

- [ ] Features Toggle section:
  - [ ] Show shopping cart toggle
  - [ ] Enable push notifications toggle
  - [ ] Enable reviews toggle
  - [ ] Enable customer accounts toggle
  - [ ] Save button

- [ ] Notification Settings (optional):
  - [ ] Email notifications toggle
  - [ ] Push notifications toggle
  - [ ] WhatsApp notifications toggle
  - [ ] Save button

- [ ] Appearance:
  - [ ] Primary color picker
  - [ ] Secondary color picker
  - [ ] Accent color picker
  - [ ] Font choice
  - [ ] Save button

- [ ] Payment Methods (reference):
  - [ ] MTN MoMo info display
  - [ ] Telecel Cash info display
  - [ ] AirtelTigo Cash info display
  - [ ] Edit button for each

- [ ] API Keys & Integration:
  - [ ] Supabase config display (read-only)
  - [ ] Reset/regenerate options

---

## 🗄️ PHASE 5: DATABASE & BACKEND

### Supabase Setup
- [ ] Create Supabase project
- [ ] Configure authentication
- [ ] Create database schema
- [ ] Enable Row Level Security (RLS)
- [ ] Setup realtime subscriptions

### Database Tables & Migrations

#### `users` table
```sql
- id (UUID, PK)
- email (string, unique)
- phone (string, optional)
- full_name (string)
- avatar_url (string, optional)
- is_admin (boolean)
- created_at (timestamp)
- updated_at (timestamp)
- last_login (timestamp, optional)
```

#### `products` table
```sql
- id (UUID, PK)
- title (string)
- slug (string, unique)
- description (text)
- short_description (string, optional)
- category_id (UUID, FK)
- brand (string, optional)
- source_price (decimal)
- selling_price (decimal)
- discount_price (decimal, optional)
- markup_percentage (decimal)
- shipping_cost (decimal, optional)
- expected_profit (decimal)
- stock_status (enum: available/limited/sold_out)
- stock_quantity (integer)
- featured (boolean)
- published (boolean)
- publish_date (timestamp, optional)
- rating (decimal, optional)
- rating_count (integer, default: 0)
- main_image_url (string)
- created_at (timestamp)
- updated_at (timestamp)
- created_by (UUID, FK to users)
```

#### `product_images` table
```sql
- id (UUID, PK)
- product_id (UUID, FK)
- image_url (string)
- alt_text (string, optional)
- order (integer)
- created_at (timestamp)
```

#### `product_variants` table
```sql
- id (UUID, PK)
- product_id (UUID, FK)
- variant_type (enum: color/size/storage/model)
- variant_value (string)
- variant_price (decimal, optional)
- created_at (timestamp)
```

#### `categories` table
```sql
- id (UUID, PK)
- name (string, unique)
- slug (string, unique)
- description (string, optional)
- icon_url (string, optional)
- created_at (timestamp)
```

#### `orders` table
```sql
- id (UUID, PK)
- order_number (string, unique)
- user_id (UUID, FK, nullable for guest)
- customer_name (string)
- customer_phone (string)
- customer_email (string, optional)
- delivery_region (string)
- delivery_city (string)
- delivery_address (string)
- delivery_landmark (string, optional)
- special_notes (text, optional)
- order_status (enum: pending_payment/payment_confirmed/processing/dispatched/delivered/cancelled)
- payment_status (enum: pending/confirmed/rejected)
- payment_method (string, optional)
- total_amount (decimal)
- shipping_cost (decimal)
- subtotal (decimal)
- notes (text, optional)
- created_at (timestamp)
- updated_at (timestamp)
```

#### `order_items` table
```sql
- id (UUID, PK)
- order_id (UUID, FK)
- product_id (UUID, FK)
- product_title (string)
- variant_info (JSON, optional)
- quantity (integer)
- unit_price (decimal)
- subtotal (decimal)
- created_at (timestamp)
```

#### `carts` table
```sql
- id (UUID, PK)
- user_id (UUID, FK, nullable for guest)
- session_id (string, nullable)
- product_id (UUID, FK)
- quantity (integer)
- variant_info (JSON, optional)
- created_at (timestamp)
- updated_at (timestamp)
```

#### `wishlist` table
```sql
- id (UUID, PK)
- user_id (UUID, FK, nullable for guest)
- session_id (string, nullable)
- product_id (UUID, FK)
- created_at (timestamp)
```

#### `reviews` table
```sql
- id (UUID, PK)
- product_id (UUID, FK)
- user_id (UUID, FK, nullable for anonymous)
- rating (integer, 1-5)
- created_at (timestamp)
```

#### `analytics_events` table
```sql
- id (UUID, PK)
- event_type (string)
- product_id (UUID, optional)
- user_id (UUID, optional)
- session_id (string)
- metadata (JSON)
- created_at (timestamp)
```

#### `settings` table
```sql
- id (UUID, PK)
- store_name (string)
- store_logo_url (string, optional)
- store_tagline (string, optional)
- currency (string, default: GHS)
- whatsapp_number (string)
- instagram_url (string, optional)
- telegram_url (string, optional)
- tiktok_url (string, optional)
- hero_title (string)
- hero_subtitle (string)
- hero_bg_url (string, optional)
- primary_color (string)
- secondary_color (string)
- features_cart (boolean)
- features_notifications (boolean)
- features_reviews (boolean)
- features_accounts (boolean)
- updated_at (timestamp)
- updated_by (UUID, FK)
```

#### `notifications` table
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- order_id (UUID, FK, optional)
- title (string)
- message (text)
- type (enum: order_confirmed/dispatched/delivered/discount/new_arrival)
- read (boolean)
- created_at (timestamp)
```

### Row Level Security (RLS)
- [ ] Users can only view their own profile
- [ ] Users can only view/edit their own cart
- [ ] Users can only view/edit their own wishlist
- [ ] Users can only view their own orders
- [ ] Admin-only policies on products/orders tables
- [ ] Public read access on published products
- [ ] Public read access on categories

### Indexes & Performance
- [ ] Index on `products.slug`
- [ ] Index on `products.category_id`
- [ ] Index on `products.published`
- [ ] Index on `orders.user_id`
- [ ] Index on `orders.order_status`
- [ ] Index on `orders.created_at`
- [ ] Index on `order_items.order_id`
- [ ] Index on `carts.user_id`
- [ ] Index on `wishlist.user_id`

---

## 🤖 PHASE 6: SCRAPER & IMPORTER (`/apps/scraper`)

### Setup
- [ ] Initialize Node.js project
- [ ] Install Puppeteer
- [ ] Install Express
- [ ] Setup environment variables

### Scraper Logic
- [ ] Jumia product scraper
  - [ ] Parse product title
  - [ ] Parse product images
  - [ ] Parse description
  - [ ] Parse specifications
  - [ ] Parse original price
  - [ ] Parse selling price
  - [ ] Parse brand
  - [ ] Parse category
  - [ ] Parse rating/reviews
- [ ] Amazon scraper (optional)
- [ ] AliExpress scraper (optional)
- [ ] eBay scraper (optional)

### API Endpoints
- [ ] `POST /api/import` - trigger import
- [ ] `POST /api/scrape` - scrape product from URL
- [ ] `GET /api/import/:id` - check import status
- [ ] `GET /api/categories` - detect available categories

### Error Handling
- [ ] Try-catch blocks
- [ ] Retry logic for failed scrapes
- [ ] Timeout handling
- [ ] Invalid URL handling
- [ ] Rate limiting

### Data Processing
- [ ] Clean product title (remove extra spaces, special chars)
- [ ] Generate slug from title
- [ ] Extract price as numbers
- [ ] Validate category exists (create if not)
- [ ] Optimize images (download & reupload to Supabase Storage)
- [ ] Handle variants detection

### Logging
- [ ] Log all import attempts
- [ ] Log success/failures
- [ ] Store logs in database
- [ ] API endpoint for viewing logs

---

## 📦 PHASE 7: DEPLOYMENT & DEVOPS

### Frontend Deployment (Vercel)
- [ ] Connect GitHub repo
- [ ] Configure build command
- [ ] Configure preview deployments
- [ ] Setup environment variables
- [ ] Configure custom domain
- [ ] Setup SSL certificate
- [ ] Configure CDN caching

### Backend Deployment (Render/Railway)
- [ ] Deploy Supabase (already hosted)
- [ ] Deploy scraper service
- [ ] Configure environment variables
- [ ] Setup health checks
- [ ] Configure scaling

### Storage (Supabase)
- [ ] Create storage bucket for product images
- [ ] Configure public access policies
- [ ] Setup image optimization (if using Supabase Edge Functions)
- [ ] Configure CORS for image requests

### Domain & DNS
- [ ] Register domain
- [ ] Configure DNS records
- [ ] Setup email domain records (if needed)

### Monitoring & Analytics
- [ ] Setup error tracking (Sentry or similar)
- [ ] Setup performance monitoring
- [ ] Setup uptime monitoring
- [ ] Setup analytics (Google Analytics 4)
- [ ] Configure alerts

---

## 🔒 PHASE 8: SECURITY & TESTING

### Security Audit
- [ ] Review authentication flow
- [ ] Check RLS policies
- [ ] Validate input sanitization
- [ ] Check for SQL injection vulnerabilities
- [ ] Verify CORS configuration
- [ ] Check rate limiting
- [ ] Verify API key management
- [ ] Test payment flow security
- [ ] Test file upload security
- [ ] Check for XSS vulnerabilities

### Testing
- [ ] Unit tests for utils
- [ ] Component tests for UI components
- [ ] Integration tests for API flows
- [ ] E2E tests for critical user paths
- [ ] Performance tests
- [ ] Accessibility tests (a11y)
- [ ] Mobile responsiveness tests

### Documentation
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Database schema documentation
- [ ] Component library documentation (Storybook)
- [ ] Deployment documentation
- [ ] Setup guide for developers
- [ ] Troubleshooting guide

---

## 📱 PHASE 9: LAUNCH & POST-LAUNCH

### Pre-Launch
- [ ] Content audit (products, descriptions, images)
- [ ] SEO optimization (meta tags, structured data)
- [ ] Performance testing
- [ ] Security testing
- [ ] Cross-browser testing
- [ ] Mobile testing
- [ ] Create launch checklist

### Launch
- [ ] Go-live deployment
- [ ] Monitor for errors
- [ ] Customer support ready
- [ ] Social media announcement
- [ ] Email announcement (if list exists)

### Post-Launch
- [ ] Monitor analytics
- [ ] Fix critical bugs
- [ ] Gather user feedback
- [ ] Plan Phase 2 features
- [ ] Optimize based on usage

---

## 📊 SUMMARY BY PHASE

| Phase | Component | Items | Status |
|-------|-----------|-------|--------|
| 1 | Setup & Infrastructure | 15 | ⬜ Not Started |
| 2 | Design System & Packages | 40 | ⬜ Not Started |
| 3 | Storefront (Web) | 80+ | ⬜ Not Started |
| 4 | Admin Dashboard | 50+ | ⬜ Not Started |
| 5 | Database & Backend | 15+ | ⬜ Not Started |
| 6 | Scraper & Importer | 15 | ⬜ Not Started |
| 7 | Deployment & DevOps | 12 | ⬜ Not Started |
| 8 | Security & Testing | 12 | ⬜ Not Started |
| 9 | Launch & Post-Launch | 12 | ⬜ Not Started |

**Total Items: ~250+**

---

## 🚀 RECOMMENDED BUILD ORDER

1. **Start with Phase 1** - Setup project structure
2. **Build Phase 2** - Design system (use everywhere)
3. **Parallel Phase 3 & 4** - Frontend & Admin
4. **Execute Phase 5** - Database (needed by Phase 3 & 4)
5. **Complete Phase 6** - Scraper (convenient feature)
6. **Do Phase 7** - Deployment prep
7. **Run Phase 8** - Security & Testing
8. **Execute Phase 9** - Launch

---

## 💡 QUICK START GUIDE

**Next Steps:**
1. Initialize monorepo structure (Phase 1)
2. Setup Supabase project & database schema (Phase 5)
3. Create design system & shared packages (Phase 2)
4. Build storefront pages (Phase 3)
5. Build admin dashboard (Phase 4)
6. Deploy & test

Would you like me to start building any of these phases?
