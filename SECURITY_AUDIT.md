# 🔍 SECURITY & CODE QUALITY AUDIT

## Catalog Connect - Complete Findings Report

**Date**: May 12, 2026 | **Total Issues**: 32 (3 Critical, 7 High, 11 Medium, 11 Low)

---

## 🔴 CRITICAL ISSUES (3)

### 1. EXPOSED API KEYS IN `.env` FILE

**Severity**: CRITICAL | **Type**: Secrets Exposure  
**File**: [.env](.env)  
**Issue**: Supabase publishable key is hardcoded in version control

```
SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Impact**:

- Keys are publicly visible in git history
- Anyone with repository access can see Supabase URLs
- If service role key is ever committed, full database admin access exposed
- Attackers can use the project ID to target your Supabase instance

**Fix Required**:

- Remove .env from git: `git rm --cached .env && echo ".env" >> .gitignore`
- Use environment-based configuration in Cloudflare/deployment system
- Rotate all exposed keys in Supabase dashboard
- Implement pre-commit hook to prevent secret commits

---

### 2. MISSING AUTHENTICATION ON PRODUCT IMPORT SERVER FUNCTION

**Severity**: CRITICAL | **Type**: Broken Access Control  
**File**: [src/lib/import.functions.ts](src/lib/import.functions.ts#L28-L40)  
**Issue**: `importProduct` server function is publicly callable without authentication

```typescript
export const importProduct = createServerFn({ method: "POST" })
  .inputValidator((d: { url: string }) => z.object({ url: z.string().url() }).parse(d))
  .handler(async ({ data }): Promise<ImportResult> => {
    // ❌ NO AUTHENTICATION CHECK - ANY USER CAN CALL THIS
    // SSRF vulnerability: can fetch any URL from server
```

**Impact**:

- Anonymous users can trigger server-side URL fetching (SSRF)
- Can scrape private/internal URLs from your server's network
- Resource exhaustion: attackers can trigger expensive scraping operations
- Reputation damage if your server is used to scrape copyrighted content

**Fix Required**:

- Add authentication middleware check
- Implement rate limiting per user
- Add URL whitelist validation (currently only `jumia.com.gh`)
- Log all import attempts for audit trail

```typescript
// Add this at handler start:
const user = await requireAuth();
if (!user || !user.isAdmin) throw new Error("Admin only");
```

---

### 3. RACE CONDITION IN ORDER CHECKOUT FLOW

**Severity**: CRITICAL | **Type**: Business Logic Vulnerability  
**File**: [src/routes/cart.tsx](src/routes/cart.tsx#L40-L60)  
**Issue**: Cart is cleared BEFORE WhatsApp confirmation, and no stock reservation

```typescript
// Current unsafe flow:
const { error: insertError } = await supabase.from("orders").insert({...});
if (insertError) {
  toast.error("Failed to record order...");
  return;
}
clear();  // ❌ Cart cleared BEFORE user confirms on WhatsApp
window.open(url, "_blank", "noopener");
toast.success("Order recorded. Opening WhatsApp…");
```

**Impact**:

- If user closes WhatsApp tab without confirming, order is recorded but user loses cart
- Multiple customers can buy same product beyond stock (no reservation)
- Potential for inventory desync: cart shows item available, but stock exhausted
- Customers can game the system by opening then closing checkout

**Fix Required**:

- Move `clear()` to AFTER user confirms payment on WhatsApp
- Implement optimistic locking on products table for stock
- Add order status "abandoned" if user doesn't confirm
- Add stock reservation during checkout, release if abandoned after 5 mins

---

## 🟠 HIGH ISSUES (7)

### 4. UNSAFE REDIRECT IN LOGIN FORM

**Severity**: HIGH | **Type**: Open Redirect  
**File**: [src/routes/admin/login.tsx](src/routes/admin/login.tsx#L40)  
**Issue**: Auth redirect uses `window.location.origin` without validation

```typescript
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: { emailRedirectTo: `${window.location.origin}/admin` }, // ❌ Unsafe
});
```

**Impact**:

- While origin is same-site, email redirect could be spoofed in dev
- If attacker controls DNS, could redirect to phishing site
- Low risk in production but not best practice

**Fix**: Use explicit URL:

```typescript
options: {
  emailRedirectTo: "https://yourdomain.com/admin";
}
```

---

### 5. ARBITRARY ORDER STATUS VALUES ALLOWED

**Severity**: HIGH | **Type**: Input Validation / State Tampering  
**File**: [src/routes/admin.orders.tsx](src/routes/admin.orders.tsx#L20-L37)  
**Issue**: Order status can be set to ANY string value, not validated

```typescript
const STATUSES = ["pending", "contacted", "completed", "cancelled"];
// ... but this doesn't prevent arbitrary status:
const setStatus = async (id: string, status: string) => {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  // ❌ NO VALIDATION - can set status to "hacked", "fraud", etc.
};
```

**Impact**:

- Order status can be corrupted with invalid values
- Reports and analytics become unreliable
- Potential for data exfiltration through status field

**Fix**:

```typescript
const setStatus = async (id: string, status: string) => {
  const validStatuses = ["pending", "contacted", "completed", "cancelled"];
  if (!validStatuses.includes(status)) throw new Error("Invalid status");
  // ... rest
};
```

---

### 6. UNVALIDATED PRODUCT IMAGE URLS (SSRF VECTOR)

**Severity**: HIGH | **Type**: Server-Side Request Forgery  
**File**: [src/lib/import.functions.ts](src/lib/import.functions.ts#L125-L137)  
**Issue**: Scraped image URLs from Jumia are stored without validation

```typescript
const imageSet = new Set<string>();
$("img").each((_, el) => {
  const src = $(el).attr("data-src") || $(el).attr("src");
  if (src && /^https?:/.test(src) && /\.(jpe?g|png|webp)/i.test(src)) imageSet.add(src); // ❌ Only checks scheme and extension
});
```

**Impact**:

- If Jumia is compromised, malicious URLs could be injected
- Stored URLs could point to internal network resources
- Clients loading images could be attacked via pixel-tracking

**Fix**:

```typescript
// Validate image URLs are from trusted CDN:
if (!src.includes("jumiacdn.com") && !src.includes("jumia.com.gh")) continue;
// Also validate MIME type on fetch:
const res = await fetch(src, { signal: AbortSignal.timeout(5000) });
const contentType = res.headers.get("content-type");
if (!["image/jpeg", "image/png", "image/webp"].includes(contentType)) continue;
```

---

### 7. INSECURE SIDEBAR COOKIE (NO HTTPONLY/SECURE FLAGS)

**Severity**: HIGH | **Type**: Cookie Security  
**File**: [src/components/ui/sidebar.tsx](src/components/ui/sidebar.tsx#L86)  
**Issue**: Sidebar state cookie is vulnerable to XSS attacks

```typescript
document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
// ❌ Missing: HttpOnly, Secure flags
```

**Impact**:

- XSS attack can steal this cookie via `document.cookie`
- While sidebar state isn't sensitive, it shows security pattern gap
- If real auth tokens use same pattern, they're exposed

**Fix**:

- This cookie should be managed server-side (SSR)
- Set with `HttpOnly; Secure; SameSite=Strict` flags
- Use localStorage instead since it's non-auth data

---

### 8. MISSING RATE LIMITING ON ORDERS ENDPOINT

**Severity**: HIGH | **Type**: DoS / Abuse Prevention  
**File**: [src/routes/cart.tsx](src/routes/cart.tsx#L45-L60)  
**Issue**: No rate limiting on order creation - anyone can spam orders

```typescript
const { error: insertError } = await supabase.from("orders").insert({
  // ❌ NO RATE LIMITING - attacker can create 1000 orders/min
  customer_name: name,
  customer_phone: phone,
  // ...
});
```

**Impact**:

- Attackers can spam your orders table with garbage data
- Database quota exhaustion possible
- Admin dashboard becomes unusable from spam
- Supabase costs spike from massive table growth

**Fix**:

- Implement client-side rate limiting: 1 order per 30 seconds per IP
- Server-side: Validate phone number format, implement IP-based throttling
- Add CAPTCHA for order checkout

---

### 9. RLS POLICIES NOT TESTED FOR GAPS

**Severity**: HIGH | **Type**: Authorization / Data Leakage  
**File**: [supabase/migrations/20260511025523\_...sql](supabase/migrations/20260511025523_0be18a2a-38d6-4041-9c0c-66aab39dc1f2.sql)  
**Issue**: RLS policies defined but not tested for edge cases

```sql
-- RLS allows public to insert orders without checks:
CREATE POLICY "anyone can create order" ON public.orders FOR INSERT WITH CHECK (true);
-- ❌ What prevents spam? What about data validation at SQL level?
```

**Impact**:

- Customer name/phone not validated at database level
- Orders table can grow unbounded with junk data
- No constraints on order total or items structure
- Could leak customer data if RLS bypass exists

**Fix**:

```sql
-- Add column constraints:
ALTER TABLE orders ADD CONSTRAINT customer_name_not_empty CHECK (customer_name != '');
ALTER TABLE orders ADD CONSTRAINT customer_phone_not_empty CHECK (customer_phone != '');
ALTER TABLE orders ADD CONSTRAINT total_positive CHECK (total > 0);

-- Test RLS: Verify anon user can't read orders
-- Test RLS: Verify admin can read all orders
-- Test RLS: Verify anon can't update other orders
```

---

### 10. PRODUCT SLUG COLLISION NOT HANDLED

**Severity**: HIGH | **Type**: Data Integrity  
**File**: [src/routes/admin.products.new.tsx](src/routes/admin.products.new.tsx#L57-L58)  
**Issue**: Duplicate slugs can be created if concurrent requests happen

```typescript
slug: value.slug || slugify(value.title),
// ❌ UNIQUE constraint exists, but no retry logic for duplicates
```

**Impact**:

- If two admins create "iPhone 15" simultaneously, second fails silently
- User gets error message but product half-created in memory
- Can't create new product with same title afterwards

**Fix**:

```typescript
// Add retry with suffix:
async function createUniqueSlug(baseSlug: string) {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const { data } = await supabase.from("products").select("id").eq("slug", slug).maybeSingle();
    if (!data) return slug;
    slug = `${baseSlug}-${counter++}`;
  }
}
```

---

## 🟡 MEDIUM ISSUES (11)

### 11. MISSING INPUT VALIDATION ON PRODUCT FORM

**Severity**: MEDIUM | **Type**: Input Validation  
**File**: [src/components/admin/product-form.tsx](src/components/admin/product-form.tsx#L89-L180)  
**Issue**: Product fields not validated for length/content
**Impact**:

- XSS if description stored and displayed unsanitized (low risk with React)
- Very long titles break UI layout
- Price manipulation via negative numbers

**Fix**: Add zod schema:

```typescript
const ProductSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(5000),
  selling_price: z.number().min(0.01),
  stock: z.number().int().min(0).max(999999),
});
```

---

### 12. INSUFFICIENT PRODUCT IMPORT URL VALIDATION

**Severity**: MEDIUM | **Type**: SSRF / Input Validation  
**File**: [src/lib/import.functions.ts](src/lib/import.functions.ts#L10-15)  
**Issue**: Only Jumia whitelist implemented, but no timeout/size limits on fetch

```typescript
const res = await fetch(cleanUrl, {
  headers: { "User-Agent": "..." },
  // ❌ Missing: timeout, size limits
});
html = await res.text(); // Could be 100MB
```

**Impact**:

- Slow Loris attack: fetch hangs server
- Memory exhaustion: large page content
- Timeout makes API unresponsive

**Fix**:

```typescript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout
const res = await fetch(cleanUrl, {
  signal: controller.signal,
  headers: {...},
});
clearTimeout(timeout);
// Check content length:
const contentLength = res.headers.get("content-length");
if (contentLength && parseInt(contentLength) > 5_000_000) throw new Error("Page too large");
```

---

### 13. CLIENT-SIDE SEARCH NO REGEX PROTECTION (ReDoS RISK)

**Severity**: MEDIUM | **Type**: Regular Expression DoS  
**File**: [src/routes/shop.tsx](src/routes/shop.tsx#L52-67)  
**Issue**: Client-side search uses `includes()` but pattern not validated

```typescript
const filtered = useMemo(() => {
  const q = query.trim().toLowerCase();
  if (!q) return products.data ?? [];
  return (products.data ?? []).filter(
    (p) =>
      [p.title, p.brand, p.description, p.category]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q), // ❌ Could be regex injection if input validation missing
  );
}, [products.data, query]);
```

**Impact**: Low risk with `.includes()` but setting bad pattern

**Fix**: Validate query length:

```typescript
if (q.length > 100) return products.data; // Prevent abuse
```

---

### 14. MISSING ADMIN ACTION AUDIT LOGGING

**Severity**: MEDIUM | **Type**: Compliance / Forensics  
**File**: [src/routes/admin.products.tsx](src/routes/admin.products.tsx#L25-60)  
**Issue**: No logging of admin product changes (create/edit/delete)
**Impact**:

- Can't investigate who deleted products
- Compliance violations (data change tracking required)
- Unauthorized access undetectable

**Fix**:

```typescript
// After product update:
await supabaseAdmin.from("audit_logs").insert({
  action: "product_update",
  admin_id: userId,
  product_id: p.id,
  changes: { old: oldData, new: newData },
  timestamp: new Date().toISOString(),
});
```

---

### 15. NO PAGINATION ON QUERY RESULTS

**Severity**: MEDIUM | **Type**: Performance / Data Integrity  
**File**: [src/routes/shop.tsx](src/routes/shop.tsx#L40)  
**Issue**: Hard-coded `.limit(200)` on product queries

```typescript
let q = supabase.from("products").select("*").eq("is_published", true);
// ...
const { data } = await q.limit(200); // ❌ What if you have 500 products?
```

**Impact**:

- Performs poorly with large datasets
- Memory issues on client
- Products beyond 200 not searchable

**Fix**: Implement pagination:

```typescript
const page = sp.page ?? 1;
const pageSize = 20;
const offset = (page - 1) * pageSize;
const { data, count } = await q.range(offset, offset + pageSize - 1);
```

---

### 16. ERROR MESSAGES LEAK SENSITIVE INFO

**Severity**: MEDIUM | **Type**: Information Disclosure  
**File**: [src/routes/admin/login.tsx](src/routes/admin/login.tsx#L62-70)  
**Issue**: Error messages expose implementation details

```typescript
const { error } = await supabase.auth.signUp({...});
if (error) throw error; // ❌ Reveals "user already exists" vs "password too weak"
toast.error(msg); // Shows Supabase error directly to UI
```

**Impact**:

- Attackers can enumerate valid admin emails
- Information for targeted attacks

**Fix**:

```typescript
if (error?.message.includes("already registered")) {
  toast.error("This email is already registered. Please sign in instead.");
} else {
  toast.error("Signup failed. Please try again.");
  console.error("Signup error:", error); // Log for debugging
}
```

---

### 17. MISSING EMPTY IMAGE ALT ATTRIBUTES

**Severity**: MEDIUM | **Type**: Accessibility  
**File**: [src/routes/admin.index.tsx](src/routes/admin.index.tsx#L144)  
**Issue**: Decorative images have empty `alt=""` attributes (correct) but semantic images do not
**Locations**: Multiple product thumbnail images
**Impact**: Screen reader users can't understand product images

**Fix**:

```typescript
// ❌ Currently:
<img src={p.images[0]} alt="" className="..." />

// ✅ Should be:
<img src={p.images[0]} alt={p.title} className="..." />
```

---

### 18. CORS HEADERS NOT CONFIGURED

**Severity**: MEDIUM | **Type**: Security Headers  
**File**: [wrangler.jsonc](wrangler.jsonc)  
**Issue**: No CORS configuration, could leak data to third-party sites
**Impact**:

- Frontend can be embedded in malicious sites
- Data potentially accessible to cross-origin requests

**Fix**: Add to Cloudflare Worker:

```javascript
export default {
  async fetch(request, env, ctx) {
    // ... existing code ...
    const response = await handler.fetch(request, env, ctx);
    const headers = new Headers(response.headers);
    headers.set("Access-Control-Allow-Origin", "https://yourdomain.com");
    headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    return new Response(response.body, { ...response, headers });
  },
};
```

---

### 19. CHECKOUT DOESN'T VALIDATE CUSTOMER INPUT FORMAT

**Severity**: MEDIUM | **Type**: Input Validation  
**File**: [src/routes/cart.tsx](src/routes/cart.tsx#L44-48)  
**Issue**: Customer name/phone only checked for emptiness, no format validation

```typescript
if (!name.trim() || !phone.trim()) {
  toast.error("Please add your name and phone");
  return;
}
// ❌ No further validation - could accept emojis, symbols, etc.
```

**Impact**:

- Invalid phone numbers lead to failed WhatsApp messages
- Poor user experience
- Malformed data in database

**Fix**:

```typescript
if (!/^[a-zA-Z\s'-]{3,100}$/.test(name)) throw new Error("Invalid name");
if (!/^\d{10,15}$/.test(phone.replace(/\D/g, ""))) throw new Error("Invalid phone");
```

---

### 20. NO MONITORING/OBSERVABILITY FOR PRODUCTION

**Severity**: MEDIUM | **Type**: Operational Readiness  
**File**: All  
**Issue**: No error tracking, analytics, or performance monitoring configured
**Impact**:

- Won't know when site is down until customers complain
- Can't track user conversion flows
- No visibility into database performance

**Fix**: Integrate error tracking:

```bash
npm install @sentry/react @sentry/tracing
```

---

### 21. INSECURE DEFAULT ADMIN PASSWORD LENGTH

**Severity**: MEDIUM | **Type**: Weak Authentication  
**File**: [src/routes/admin/login.tsx](src/routes/admin/login.tsx#L134)  
**Issue**: Password minimum length is only 8 characters

```typescript
<Input
  id="password"
  type="password"
  required
  minLength={8} // ❌ Should be 12+
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="mt-1.5 rounded-xl"
/>
```

**Impact**:

- First admin account vulnerable to brute force
- No password strength meter

**Fix**:

```typescript
minLength={12}
// Add password strength indicator:
const passwordStrength = {
  length: password.length >= 12,
  uppercase: /[A-Z]/.test(password),
  lowercase: /[a-z]/.test(password),
  number: /\d/.test(password),
  special: /[!@#$%^&*]/.test(password),
};
```

---

## 🟢 LOW ISSUES (11)

### 22. MISSING CONTENT SECURITY POLICY HEADERS

**File**: [wrangler.jsonc](wrangler.jsonc)  
**Issue**: No CSP headers to prevent XSS
**Fix**: Add CSP header to Cloudflare Worker

---

### 23. HARDCODED SERVICE ROLE KEY CREATION IN PROXY

**File**: [src/integrations/supabase/client.server.ts](src/integrations/supabase/client.server.ts#L28-38)  
**Issue**: Service role key created every time in proxy (inefficient)
**Fix**: Cache the client instance

---

### 24. NO SSL CERTIFICATE PINNING FOR SUPABASE

**File**: All  
**Issue**: Could be vulnerable to MITM attacks
**Fix**: Implement certificate pinning in client

---

### 25. PRODUCTS CAN BE DELETED WITHOUT SOFT DELETE

**File**: [src/routes/admin.products.tsx](src/routes/admin.products.tsx#L45-55)  
**Issue**: Hard delete allows data loss
**Fix**: Implement soft delete with status column

---

### 26. NO BACKUP STRATEGY DOCUMENTED

**File**: N/A  
**Issue**: No backup/disaster recovery plan for Supabase data

---

### 27. NO LOADING STATES FOR SLOW CONNECTIONS

**File**: Multiple routes  
**Issue**: Some queries don't show loading states, UI appears frozen

---

### 28. MISSING DOCUMENTATION FOR DEPLOYMENT

**File**: [README] (doesn't exist)  
**Issue**: No setup guide for production deployment

---

### 29. UNUSED VARIABLES IN TYPE DEFINITIONS

**File**: [src/integrations/supabase/types.ts](src/integrations/supabase/types.ts)  
**Issue**: Large auto-generated types include unused Relationships

---

### 30. TYPESCRIPT STRICT MODE COULD BE STRICTER

**File**: [tsconfig.json](tsconfig.json)  
**Issue**: `noUnusedLocals` and `noUnusedParameters` disabled

---

### 31. NO ROBOTS.TXT FOR STOREFRONT

**File**: Missing  
**Issue**: Search engines may crawl checkout pages

---

### 32. PRODUCT DESCRIPTIONS NOT SANITIZED FOR DISPLAY

**File**: [src/components/storefront/product-card.tsx](src/components/storefront/product-card.tsx)  
**Issue**: While React escapes by default, explicit sanitization better
**Fix**: Use `sanitize-html` package for XSS protection

---

## 📊 SUMMARY & REMEDIATION PRIORITIES

### MUST FIX (Before Launch):

1. ✋ Remove exposed keys from git + rotate
2. 🔐 Add authentication to import endpoint
3. 🔄 Fix race condition in checkout flow
4. ✔️ Implement order status validation
5. 🚫 Add rate limiting to orders

### SHOULD FIX (Before Launch):

6. 🖼️ Validate product image URLs
7. 📋 Fix sidebar cookie security
8. 📊 Test RLS policies thoroughly
9. 🏷️ Handle slug collisions
10. 📝 Add input validation to forms

### NICE TO HAVE (After Launch):

11. 📉 Implement pagination
12. 🎯 Add error tracking/monitoring
13. 🔍 Add product search improvements
14. 👤 Improve password requirements
15. 📋 Add audit logging

---

## 🛠️ DEPLOYMENT CHECKLIST

- [ ] Remove `.env` from git history: `git filter-branch --tree-filter 'rm -f .env' HEAD`
- [ ] Rotate all Supabase keys in dashboard
- [ ] Add `.env.example` with placeholder values
- [ ] Set up environment variables in Cloudflare/production
- [ ] Run Supabase RLS policy tests
- [ ] Add rate limiting middleware
- [ ] Configure error tracking (Sentry)
- [ ] Set up database backups
- [ ] Enable Cloudflare WAF/DDoS protection
- [ ] Configure CORS properly
- [ ] Add CSP headers
- [ ] Set up monitoring/alerts
- [ ] Create incident response runbook
- [ ] Document deployment process in README

---

**Audit conducted by**: Copilot Security Analyzer  
**Date**: May 12, 2026  
**Status**: Ready for remediation
