# Supabase Production Setup Guide

## Quick Start: Create New Supabase Project

### Step 1: Create Project on Supabase

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Fill in:
   - **Organization**: Your organization
   - **Project Name**: `catalog-connect-production`
   - **Database Password**: Use a strong password (save securely)
   - **Region**: Select closest to your users (e.g., Europe, US East)
4. Click **Create project** and wait for initialization

### Step 2: Copy Connection Credentials

Once your project is created:

1. Go to **Settings** → **API**
2. Copy the following:
   - **Project URL**: `https://xxx.supabase.co`
   - **Anon Key** (public): Used for client-side auth
   - **Service Role Key** (secret): Used only in server functions
3. Keep these secure!

### Step 3: Update `.env` File

Replace the values in `.env`:

```bash
# Public keys (safe to commit to git with VITE_ prefix)
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGc..."  # Anon key

# Same values needed for server
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_PUBLISHABLE_KEY="eyJhbGc..."  # Anon key
SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..."  # Service role key (KEEP SECRET)

# Project ID (from URL)
VITE_SUPABASE_PROJECT_ID="your-project-id"
```

### Step 4: Create Database Schema

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Paste the entire content of `supabase/migrations/20260511025523_0be18a2a-38d6-4041-9c0c-66aab39dc1f2.sql`
4. Click **Run**

This creates:

- `user_roles` table with RLS policies
- `products` table with publishing controls
- `orders` table for WhatsApp orders
- `store_settings` singleton configuration
- `product-images` storage bucket

### Step 5: Enable Email Authentication

In Supabase Dashboard:

1. Go to **Authentication** → **Providers**
2. Ensure **Email** is enabled
3. Go to **Email Templates**
4. Customize the email confirmation template if desired

### Step 6: Create Initial Store Settings

1. Go to **SQL Editor** → **New Query**
2. Run:

```sql
INSERT INTO public.store_settings (
  store_name,
  whatsapp_number,
  hero_title,
  hero_subtitle,
  currency
) VALUES (
  'Your Store Name',
  '233XXXXXXXXX',  -- Ghana WhatsApp number with country code
  'Welcome to your store',
  'Quality products delivered fast',
  'GHS'
);
```

### Step 7: Test the Connection

Run locally:

```bash
npm run dev
```

- Visit `http://localhost:5173/admin/login`
- Click **Create admin** to set up first admin account
- You should receive a confirmation email

---

## Security Checklist ✅

### Before Launch:

- [ ] `.env` is in `.gitignore` (verified)
- [ ] Service role key is **never** committed to git
- [ ] RLS policies are active on all tables
- [ ] Email authentication is configured
- [ ] Admin setup is locked after first user (verify RLS on `user_roles`)
- [ ] WhatsApp number is set correctly
- [ ] Storage bucket `product-images` is public (read-only)

### Environment Variables:

- [ ] `VITE_*` keys are public (can be exposed)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is **secret only**
- [ ] `.env` file is git-ignored
- [ ] All env vars match your Supabase project

### Production Deployment (Cloudflare Workers):

1. Set env vars in wrangler.toml or Cloudflare dashboard:

   ```bash
   wrangler secret put SUPABASE_URL
   wrangler secret put SUPABASE_PUBLISHABLE_KEY
   wrangler secret put SUPABASE_SERVICE_ROLE_KEY
   ```

2. Deploy:
   ```bash
   npm run build
   wrangler deploy
   ```

---

## Troubleshooting

### "Missing Supabase environment variable"

**Solution**: Check `.env` file has all 5 variables and you're running `npm run dev` from the project root.

### "Admin exists function not found"

**Solution**: Re-run the SQL migration. The `admin_exists()` RPC must be created first.

### "Role required" on admin login

**Solution**: Insert admin role after signup:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('user-uuid-here', 'admin');
```

### Product images not loading

**Solution**: Ensure `product-images` bucket exists and is public:

- Go to **Storage** → **Buckets**
- Verify `product-images` bucket exists
- Check public access is enabled

---

## Backup & Recovery

### Backup Database:

```bash
# Via Supabase Dashboard:
# Settings → Backups → Download latest backup

# Or use pg_dump:
pg_dump -U postgres "postgresql://postgres:password@db.project.supabase.co:5432/postgres" > backup.sql
```

### Restore from Backup:

Contact Supabase support or restore via dashboard.

---

## Performance Optimization

### Database Indexes (Already Configured):

- `idx_products_published` — For storefront queries
- `idx_products_featured` — For featured section
- `idx_products_category` — For category filtering

### RLS Policy Performance:

- Policies use indexed columns (`user_id`, `role`)
- Admin operations bypass RLS via `service_role` key
- Public reads only check boolean flags

### Vector Search (Future):

To enable product search:

```sql
CREATE EXTENSION vector;
ALTER TABLE public.products ADD COLUMN embedding vector(1536);
CREATE INDEX ON public.products USING ivfflat (embedding vector_cosine_ops);
```

---

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Discord Community**: https://discord.supabase.com
- **Status Page**: https://status.supabase.com
