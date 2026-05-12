# 🚨 QUICK REFERENCE - CRITICAL & HIGH ISSUES

## CRITICAL ISSUES - FIX IMMEDIATELY

| #   | Issue                       | File                             | Fix                                                           |
| --- | --------------------------- | -------------------------------- | ------------------------------------------------------------- |
| 1   | **Exposed API Keys**        | `.env`                           | Remove from git, add to `.gitignore`, rotate keys in Supabase |
| 2   | **Missing Auth on Import**  | `src/lib/import.functions.ts:28` | Add `requireAuth()` check to handler                          |
| 3   | **Checkout Race Condition** | `src/routes/cart.tsx:45-60`      | Move `clear()` after WhatsApp confirmation                    |

---

## HIGH SEVERITY ISSUES - FIX BEFORE LAUNCH

| #   | Issue                         | File                                   | Impact            | Quick Fix                                      |
| --- | ----------------------------- | -------------------------------------- | ----------------- | ---------------------------------------------- |
| 4   | Unsafe Redirect               | `src/routes/admin/login.tsx:40`        | Auth bypass risk  | Use hardcoded URL instead of origin            |
| 5   | Arbitrary Order Status        | `src/routes/admin.orders.tsx:20`       | Data corruption   | Whitelist allowed statuses in update           |
| 6   | Unvalidated Image URLs (SSRF) | `src/lib/import.functions.ts:125`      | Server compromise | Validate URLs against CDN whitelist            |
| 7   | Insecure Sidebar Cookie       | `src/components/ui/sidebar.tsx:86`     | XSS vector        | Add HttpOnly; Secure flags or use localStorage |
| 8   | No Rate Limiting              | `src/routes/cart.tsx:45`               | DoS/Spam          | Add 1 order per 30s per IP throttle            |
| 9   | Untested RLS Policies         | `supabase/migrations/*.sql`            | Data leakage      | Add constraints: NOT NULL, CHECK, unique       |
| 10  | Slug Collisions               | `src/routes/admin.products.new.tsx:57` | Data integrity    | Add slug uniqueness retry logic                |

---

## MEDIUM SEVERITY - IMPORTANT FOR QUALITY

| Issue                    | Count | Examples                                               |
| ------------------------ | ----- | ------------------------------------------------------ |
| Input Validation Missing | 3     | Product form, customer checkout, phone validation      |
| Performance Issues       | 2     | N+1 queries in dashboard, no pagination (200 limit)    |
| Accessibility            | 2     | Missing alt attributes on decorative images            |
| Error Handling           | 2     | Leaking sensitive error messages, unhandled edge cases |
| Configuration            | 2     | No CSP headers, no CORS setup                          |
| Logging/Auditing         | 1     | No admin action audit trail                            |

---

## ACTION ITEMS BY PRIORITY

### BLOCKER (Do First - 2-4 hours)

```bash
# 1. Git security
git filter-branch --tree-filter 'rm -f .env' HEAD
echo ".env" >> .gitignore
git add .gitignore && git commit -m "Add .env to gitignore"

# 2. In Supabase dashboard
# - Go to Settings > API
# - Rotate all keys (generate new ones)
# - Copy to secure environment variables

# 3. In code - add auth check to import.functions.ts
# Add line 2: const user = await requireAuth();
```

### HIGH PRIORITY (4-8 hours)

```typescript
// 1. Fix cart.tsx - move clear() after WhatsApp
// 2. Add status validation in admin.orders.tsx
// 3. Add input validation to forms with Zod
// 4. Add rate limiter middleware
// 5. Add image URL validation in import.functions.ts
```

### MEDIUM PRIORITY (1-2 days)

```bash
npm install @sentry/react zod zustand
# - Setup Sentry for error tracking
# - Add validation schemas for all forms
# - Implement pagination
# - Add audit logging for admin actions
```

---

## TESTING CHECKLIST

Before deploying to production, verify:

- [ ] `.env` file is NOT in git (check git log)
- [ ] Supabase keys have been rotated
- [ ] Can't import products without authentication
- [ ] Orders can't be created faster than 1 per 30 seconds
- [ ] Order status only accepts: pending, contacted, completed, cancelled
- [ ] Product slugs are unique (test duplicate creation)
- [ ] RLS policies deny anon access to products for write
- [ ] RLS policies deny anon access to other users' profiles
- [ ] Admin can see all orders
- [ ] Customer can only see orders if authenticated (though currently anyone can read)
- [ ] Images only load from trusted CDNs

---

## FILES AFFECTED BY CRITICAL ISSUES

**Must edit:**

- `.env` (remove from git)
- `.gitignore` (add .env)
- `src/lib/import.functions.ts` (add auth)
- `src/routes/cart.tsx` (fix race condition)
- `src/routes/admin.orders.tsx` (validate status)

**Should review:**

- `supabase/migrations/20260511025523_...sql` (add constraints)
- `src/routes/admin.products.new.tsx` (handle slug collision)
- `src/components/ui/sidebar.tsx` (cookie security)

---

## ESTIMATED REMEDIATION TIME

| Priority  | Time           | Issues                             |
| --------- | -------------- | ---------------------------------- |
| CRITICAL  | 2-4 hours      | 3 (keys, auth, race condition)     |
| HIGH      | 4-8 hours      | 7 (validation, rate limiting, etc) |
| MEDIUM    | 1-2 days       | 11 (refactoring, logging, etc)     |
| LOW       | 2-3 days       | 11 (nice-to-haves)                 |
| **TOTAL** | **~1-2 weeks** | **32 issues**                      |

---

## QUESTIONS TO ASK

1. When do you plan to launch to production? (affects urgency)
2. Do you have SLA requirements? (affects monitoring)
3. What's your backup strategy for Supabase? (affects disaster recovery)
4. Will you have payment processing? (affects PCI compliance)
5. Do you need GDPR compliance? (affects data retention)
6. Will orders have payment attached? (affects payment security)

---

## NEXT STEPS

1. ✅ Review this audit with team
2. 📋 Create Jira/GitHub issues for each critical item
3. 👥 Assign owners and set deadlines
4. 🧪 Create tests to verify fixes
5. 📊 Schedule re-audit after fixes
6. 🚀 Only deploy after all CRITICAL items fixed
