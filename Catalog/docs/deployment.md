# Deployment Guide

## Prerequisites
- Vercel account (for frontend)
- Supabase project (database)
- Render/Railway account (for scraper)
- GitHub repository

## Frontend Deployment (Vercel)

### Setup
1. Connect GitHub repo to Vercel
2. Configure build settings:
   ```
   Build Command: pnpm build
   Output Directory: apps/web/dist
   ```

3. Set environment variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Deploy
```bash
# Push to main branch
git push origin main

# Vercel automatically deploys
```

## Admin Deployment (Vercel)

1. Create separate Vercel project
2. Same setup as frontend
3. Output directory: `apps/admin/dist`

## Backend Deployment (Supabase)

1. Create Supabase project at supabase.com
2. Create database from provided SQL:
   ```bash
   supabase db push
   ```

3. Setup authentication:
   - Enable Email/Password
   - Configure email templates
   - Set up redirects

4. Configure RLS policies (automatic with migrations)

5. Setup Storage bucket:
   - Create `products` bucket
   - Set public access
   - Configure CORS

## Scraper Deployment (Render)

### Setup
1. Create new Web Service on Render
2. Connect GitHub repo
3. Configure:
   ```
   Build Command: pnpm install && pnpm build
   Start Command: cd apps/scraper && pnpm start
   ```

4. Environment variables:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NODE_ENV=production
   PORT=10000
   ```

5. Deploy

## Database Backups

```bash
# Automatic daily backups in Supabase
# Manual backup:
supabase db pull
git commit -m "backup: $(date)"
```

## Monitoring

### Vercel
- Error tracking with Sentry
- Performance monitoring
- Analytics dashboard

### Supabase
- Database logs
- Query performance
- Real-time metrics

### Render
- Application logs
- Resource usage
- Uptime monitoring

## SSL/TLS
- Vercel: Automatic
- Supabase: Automatic
- Custom domain: Update DNS records

## Domain Setup

### Main Domain
1. Point DNS to Vercel IP
2. Add to Vercel project

### Admin Subdomain
```
admin.yourdomain.com → Vercel project
```

### API Domain
```
api.yourdomain.com → Scraper service
```

## CI/CD Pipeline

GitHub Actions workflow:
1. Run tests
2. Lint code
3. Build applications
4. Deploy to Vercel
5. Run smoke tests

## Rollback

```bash
# Revert to previous deployment
git revert <commit-hash>
git push origin main

# Vercel automatically redeploys
```

## Production Checklist

- [ ] Environment variables configured
- [ ] Database backed up
- [ ] SSL certificate installed
- [ ] Monitoring enabled
- [ ] Error tracking setup
- [ ] Analytics configured
- [ ] Email templates verified
- [ ] Payment methods tested
- [ ] WhatsApp integration verified
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Legal pages added
