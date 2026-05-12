# Getting Started

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/catalog-by-cyrus.git
cd catalog-by-cyrus
pnpm install
```

### 2. Setup Environment
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### 3. Start Development
```bash
pnpm dev
```

This starts all apps in development mode:
- **Web**: http://localhost:3000
- **Admin**: http://localhost:3001
- **Scraper**: http://localhost:3002

## Project Structure

```
catalog-by-cyrus/
├── apps/
│   ├── web/          # Customer storefront
│   ├── admin/        # Admin dashboard
│   └── scraper/      # Product importer
├── packages/         # Shared code
├── supabase/         # Database
├── docs/             # Documentation
└── scripts/          # Helper scripts
```

## Available Commands

```bash
pnpm dev              # Start all apps
pnpm build            # Build all apps
pnpm test             # Run tests
pnpm lint             # Lint code
pnpm type-check       # TypeScript check
pnpm format           # Format with Prettier
pnpm clean            # Clean build outputs
```

## Setup Supabase

### 1. Create Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Wait for database to be ready

### 2. Get Credentials
- Go to Settings → API
- Copy `Project URL` and `Anon Key`
- Add to `.env.local`:
  ```
  VITE_SUPABASE_URL=your_url
  VITE_SUPABASE_ANON_KEY=your_key
  ```

### 3. Setup Database
```bash
supabase db push
```

### 4. Create Admin Account
```sql
-- In Supabase SQL editor
INSERT INTO users (email, full_name, is_admin) 
VALUES ('admin@example.com', 'Admin', true);
```

## Development Workflow

### Adding a Feature

1. **Create branch**
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make changes**
   - Edit components/pages
   - Add types in `/packages/types`
   - Add utils in `/packages/utils`

3. **Test locally**
   ```bash
   pnpm dev
   # Test at http://localhost:3000
   ```

4. **Commit & push**
   ```bash
   pnpm format  # Format code
   git add .
   git commit -m "feat: your feature description"
   git push origin feat/your-feature-name
   ```

5. **Create PR**
   - Go to GitHub
   - Create Pull Request
   - Wait for checks to pass
   - Get review
   - Merge

## Common Tasks

### Add New Product
1. Go to Admin: http://localhost:3001
2. Click "Add Product"
3. Fill in details
4. Click "Save"

### Import from Jumia
1. Go to Admin → Products
2. Click "Import Product"
3. Paste Jumia URL
4. Click "Import"
5. Review & Save

### Test Checkout
1. Go to Shop: http://localhost:3000/shop
2. Add products to cart
3. Go to Checkout
4. Fill in delivery info
5. Submit preorder

### View Orders
1. Go to Admin → Orders
2. See all submitted preorders
3. Click to view details
4. Update status

## Troubleshooting

### Port Already in Use
```bash
# Change port in app's vite.config.ts
# Or kill existing process
lsof -ti:3000 | xargs kill -9
```

### Supabase Connection Error
- Check `.env.local` has correct credentials
- Verify internet connection
- Check Supabase project is running

### Build Errors
```bash
pnpm clean
pnpm install
pnpm build
```

### TypeScript Errors
```bash
pnpm type-check
# Fix errors and save
```

## Next Steps

1. **Customize Design**
   - Edit Tailwind colors in `tailwind.config.js`
   - Update fonts in `packages/config/src/index.ts`

2. **Add Content**
   - Import products manually
   - Or use Jumia importer

3. **Setup WhatsApp**
   - Update number in Admin Settings
   - Test WhatsApp integration

4. **Deploy**
   - Push to GitHub
   - Connect to Vercel
   - Automatic deployment

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Vite Docs](https://vitejs.dev)
- [Our Docs](./docs/)

## Support

For issues or questions:
1. Check [docs](./docs/)
2. Search GitHub issues
3. Create new issue with details

## License

Proprietary - All rights reserved
