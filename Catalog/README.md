# 🛍️ Catalog by Cyrus

**Modern PWA social-commerce storefront** for curated product selling, preorder management, and WhatsApp-assisted order fulfillment.

![Status](https://img.shields.io/badge/status-beta-yellow) ![License](https://img.shields.io/badge/license-proprietary-blue)

---

## 📋 Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8.6+
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/catalog-by-cyrus.git
cd catalog-by-cyrus

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local

# Start development
pnpm dev
```

---

## 🏗️ Project Structure

```
catalog-by-cyrus/
├── apps/
│   ├── web/              # Customer storefront (React + Vite)
│   ├── admin/            # Admin dashboard (React + Vite)
│   └── scraper/          # Product importer (Node + Puppeteer)
│
├── packages/
│   ├── ui/               # Shared UI components
│   ├── hooks/            # React hooks
│   ├── utils/            # Utilities & helpers
│   ├── types/            # TypeScript types
│   ├── config/           # App configuration
│   └── api-client/       # Supabase + Query client
│
├── supabase/
│   ├── migrations/       # Database schema
│   └── functions/        # Edge functions
│
├── docs/                 # Documentation
├── scripts/              # Utility scripts
└── .github/workflows/    # CI/CD pipelines
```

---

## 🚀 Available Scripts

```bash
pnpm dev          # Start all apps in development
pnpm build        # Build all apps
pnpm start        # Start production apps
pnpm test         # Run all tests
pnpm lint         # Lint code
pnpm type-check   # TypeScript check
pnpm format       # Format code with Prettier
pnpm clean        # Clean all build outputs
```

---

## 🎯 Features

### 🏪 Storefront
- Product discovery & search
- Advanced filtering (category, price, discount)
- Product variants support
- Shopping cart with persistence
- Wishlist management
- Preorder checkout flow
- WhatsApp integration
- User accounts (optional)
- Order tracking
- Dark/Light mode

### 📊 Admin Dashboard
- Product management (CRUD)
- Jumia/Amazon product importer
- Order management & tracking
- Customer management
- Revenue analytics
- Store settings
- Payment method management

### 🤖 Automation
- Jumia product scraper
- Bulk import from URLs
- Profit calculator
- Auto-slug generation

### 📱 PWA
- Installable app
- Offline support
- Push notifications
- Fast load times

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **TanStack Query** - Data fetching
- **shadcn/ui** - Component library

### Backend
- **Supabase** - PostgreSQL + Auth + Storage
- **Node.js** - Scraper service
- **Puppeteer** - Web scraping

### Deployment
- **Vercel** - Frontend hosting
- **Render/Railway** - Backend hosting
- **Supabase Cloud** - Database & auth

---

## 📦 Packages

### `@catalog/ui`
Shared UI components: Button, Card, Modal, Input, ProductCard, etc.

### `@catalog/hooks`
React hooks: useCart, useWishlist, useAuth, useTheme, etc.

### `@catalog/utils`
Utilities: formatCurrency, calculateProfit, slugify, validatePhone, etc.

### `@catalog/types`
TypeScript types: User, Product, Order, Cart, etc.

### `@catalog/config`
Configuration: theme, colors, constants, API endpoints.

### `@catalog/api-client`
Supabase client wrapper with TanStack Query integration.

---

## 🗄️ Database

PostgreSQL database via Supabase with the following tables:
- `users` - Customer accounts
- `products` - Product catalog
- `product_images` - Product images
- `product_variants` - Color, size, storage variants
- `categories` - Product categories
- `orders` - Customer orders
- `order_items` - Order line items
- `carts` - Shopping carts
- `wishlist` - Saved products
- `reviews` - Product ratings
- `analytics_events` - User events
- `settings` - Store configuration
- `notifications` - User notifications

See [database-schema.md](docs/database-schema.md) for detailed schema.

---

## 🔐 Security

- Row-Level Security (RLS) on all tables
- Supabase Auth for admin & customers
- HTTPS only
- CORS configured
- Rate limiting
- Input validation & sanitization

---

## 📚 Documentation

- [Architecture Guide](docs/architecture.md)
- [API Design](docs/api-design.md)
- [Database Schema](docs/database-schema.md)
- [Deployment Guide](docs/deployment.md)
- [Roadmap](docs/roadmap.md)

---

## 🤝 Contributing

Currently closed to external contributions.

---

## 📝 License

Proprietary. All rights reserved.

---

## 📧 Support

For support: support@catalogbycyrus.com
WhatsApp: +233 574 090 147

---

**Built with ❤️ for Ghana**
