# Architecture & Design

## Project Structure

```
catalog-by-cyrus/
├── apps/
│   ├── web/              # Customer storefront
│   ├── admin/            # Admin dashboard
│   └── scraper/          # Product importer service
├── packages/             # Shared code
│   ├── ui/               # UI components
│   ├── hooks/            # React hooks
│   ├── utils/            # Utilities
│   ├── types/            # TypeScript types
│   ├── config/           # Configuration
│   └── api-client/       # API wrapper
├── supabase/             # Database & backend
├── docs/                 # Documentation
└── scripts/              # Helper scripts
```

## Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool (fast development)
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **TanStack Query** - Server state management
- **shadcn/ui** - Component library

### Backend
- **Supabase** - PostgreSQL + Auth + Storage
- **Node.js / Express** - Scraper service
- **Puppeteer** - Web scraping

### Package Manager
- **pnpm** - Fast, disk-efficient package manager
- **Turbo** - Monorepo orchestration

## Data Flow

### Product Flow
```
Import URL
    ↓
Puppeteer Scrape
    ↓
Data Processing
    ↓
Supabase Insert
    ↓
Admin Dashboard
    ↓
Frontend Display
```

### Order Flow
```
Customer browsing
    ↓
Add to cart
    ↓
Checkout
    ↓
Enter delivery info
    ↓
Create order (Supabase)
    ↓
Generate WhatsApp message
    ↓
Redirect to WhatsApp
    ↓
Payment validation
    ↓
Order status update
```

## Authentication Flow

### Customer (Optional)
- Email/Password via Supabase Auth
- Session stored in browser
- Cart synced with account

### Admin
- Single admin email account
- Supabase Auth + RLS policies
- Protected `/admin` routes

## Database Design

### Key Tables
- `users` - Customer accounts
- `products` - Product catalog
- `orders` - Customer orders
- `carts` - Shopping carts (temp)
- `wishlist` - Saved products
- `settings` - Store config
- `analytics_events` - User tracking

### Security
- Row-Level Security (RLS) enabled
- Admin-only policies on sensitive tables
- Public read on published products
- User-scoped cart/wishlist access

## Component Architecture

### Shared UI Components (`@catalog/ui`)
Reusable components used across web and admin:
- Button, Card, Input, Modal
- ProductCard, ImageGallery
- Navigation, Footer

### Hooks (`@catalog/hooks`)
- `useCart()` - Cart management
- `useWishlist()` - Wishlist management
- `useTheme()` - Dark/light mode
- `useAuth()` - Authentication

### Utils (`@catalog/utils`)
- Currency formatting
- Profit calculations
- Phone validation
- WhatsApp message generation

## Deployment Architecture

### Frontend (Vercel)
- Automatic deployments from GitHub
- Edge functions for API routes
- CDN for static assets

### Backend (Supabase Hosted)
- PostgreSQL database
- Built-in authentication
- File storage for images

### Scraper (Render/Railway)
- Separate microservice
- Triggered by admin
- Stores results in Supabase

## Performance Considerations

1. **Image Optimization**
   - WebP format with fallbacks
   - Lazy loading on scroll
   - CDN caching with long TTL

2. **Code Splitting**
   - Route-based code splitting
   - Tree-shaking unused code
   - Minification in production

3. **Database**
   - Proper indexing on frequently queried columns
   - Connection pooling for efficiency
   - Query optimization

4. **Caching**
   - TanStack Query for client-side caching
   - LocalStorage for cart/wishlist
   - Supabase realtime subscriptions

## Security Measures

1. **API Security**
   - HTTPS only
   - CORS properly configured
   - Rate limiting on endpoints

2. **Database**
   - RLS policies on all tables
   - Service role key for admin operations
   - Anon key for public queries

3. **Authentication**
   - Passwords hashed by Supabase
   - Session tokens in secure cookies
   - Multi-factor auth (optional)

4. **Input Validation**
   - Client-side validation
   - Server-side validation
   - Sanitization before DB insert

## Scalability

1. **Monorepo Benefits**
   - Shared code reduces duplication
   - Consistent dependencies
   - Easier refactoring

2. **API Design**
   - Stateless services
   - Horizontal scaling
   - Load balancing ready

3. **Database**
   - Supabase auto-scaling
   - Connection pooling
   - Read replicas available

## Development Workflow

1. **Local Development**
   ```bash
   pnpm install
   cp .env.example .env.local
   pnpm dev  # Starts all apps
   ```

2. **Making Changes**
   - Create feature branch
   - Make changes
   - Test locally
   - Submit PR

3. **Deployment**
   - Merge to main
   - GitHub Actions run tests
   - Automatic deployment to Vercel

## Future Improvements

- Multi-admin support
- Advanced analytics dashboard
- Automated payment gateway integration
- Mobile app (React Native)
- Real-time notifications
- Email marketing integration
- Inventory management
- Supplier management
