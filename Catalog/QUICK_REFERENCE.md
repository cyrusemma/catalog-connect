# 🎯 Developer Quick Reference

## Setup (5 minutes)

```bash
# 1. Navigate to project
cd c:\Users\USER\catalog-connect\Catalog

# 2. Install dependencies
pnpm install

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Start development
pnpm dev
```

## URLs

- **Web App:** http://localhost:3000
- **Admin App:** http://localhost:3001
- **Scraper:** http://localhost:3002

## Common Commands

```bash
pnpm dev              # Start all apps
pnpm dev --filter=web # Start just web app
pnpm build            # Build all apps
pnpm test             # Run tests
pnpm lint             # Check code style
pnpm type-check       # TypeScript check
pnpm format           # Auto-format code
pnpm clean            # Clean builds
```

## Project Structure

```
apps/
  ├── web/            # Customer storefront
  ├── admin/          # Admin dashboard
  └── scraper/        # Product importer

packages/
  ├── types/          # TypeScript types
  ├── config/         # Configuration
  ├── utils/          # Utilities
  ├── hooks/          # React hooks
  ├── ui/             # UI components
  └── api-client/     # Supabase wrapper

docs/
  ├── architecture.md # System design
  ├── api-design.md   # API spec
  ├── database-schema.md # DB structure
  └── deployment.md   # Deploy guide
```

## Key Technologies

- **React 18** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Supabase** - Database & auth
- **TanStack Query** - Data fetching
- **Framer Motion** - Animations

## Development Tips

### Add New Component
1. Create in `packages/ui/src/components/`
2. Export from `packages/ui/src/index.ts`
3. Import in apps: `import { ComponentName } from '@catalog/ui'`

### Add New Hook
1. Create in `packages/hooks/src/`
2. Export from `packages/hooks/src/index.ts`
3. Import in apps: `import { useHookName } from '@catalog/hooks'`

### Add New Utility
1. Create in `packages/utils/src/`
2. Export from `packages/utils/src/index.ts`
3. Import in apps: `import { utilFunction } from '@catalog/utils'`

## Database Connection

```typescript
// In your component
import { useProducts } from '@catalog/api-client'

export function MyComponent() {
  const { data: products } = useProducts()
  return <div>{/* ... */}</div>
}
```

## Environment Variables

Required in `.env.local`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_WHATSAPP_NUMBER=+233574090147
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feat/my-feature

# Make changes
# ... edit files ...

# Check code quality
pnpm lint
pnpm type-check

# Format code
pnpm format

# Commit
git add .
git commit -m "feat: description of changes"

# Push and create PR
git push origin feat/my-feature
```

## Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

## Debugging

### VS Code Launch
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/apps/web"
    }
  ]
}
```

## Performance Tips

1. Use React.memo for expensive components
2. Lazy load routes with React.lazy
3. Use useMemo for expensive calculations
4. Optimize images (WebP format)
5. Enable Tailwind CSS purging

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port in use | Kill with `lsof -ti:3000 \| xargs kill -9` |
| Module not found | Clear cache: `pnpm clean && pnpm install` |
| TypeScript errors | Run `pnpm type-check` |
| Build fails | Check `pnpm build` output |

## Useful Links

- [Documentation](./docs/)
- [Getting Started](./GETTING_STARTED.md)
- [Build Checklist](./BUILD_CHECKLIST.md)
- [Architecture](./docs/architecture.md)
- [Roadmap](./docs/roadmap.md)

## Support

- Check documentation first
- Search GitHub issues
- Create new issue with details
- Ask in team chat

## Code Style

```typescript
// Always use TypeScript
// Always import types explicitly
import type { Product } from '@catalog/types'

// Use functional components
export const MyComponent = () => {
  return <div>Hello</div>
}

// Use hooks for state
const [state, setState] = useState('')

// Use const for functions
const handleClick = () => {}

// Add props typing
interface MyComponentProps {
  title: string
  onClick?: () => void
}
```

---

**Happy coding! 🚀**
