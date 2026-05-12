# Admin Test Mode Guide

## Quick Start: Test Admin Features Without Authentication

### Enable Test Mode

1. **Go to admin login with test mode enabled:**

   ```
   http://localhost:5173/admin/login?testmode=true
   ```

2. **Click "Enter Test Mode" button**
   - This grants full access to the admin dashboard
   - Test mode is stored in browser localStorage
   - You stay logged in even after refresh (until manually disabled)

### What You Can Test

Once in test mode, you have full access to:

- ✅ **Admin Dashboard** (`/admin`)
  - View KPI cards (revenue, orders, products)
  - See recent activity
  - Test dashboard functionality

- ✅ **Products Page** (`/admin/products`)
  - View all products
  - Create new products
  - Edit existing products
  - Delete products
  - **Test Product Importer** (the main feature!)

- ✅ **Product Importer** (`/admin/products` top section)
  - Paste Jumia or other ecommerce product URLs
  - System scrapes product details (title, price, images, etc.)
  - Edit scraped data before saving
  - Set custom pricing and margins
  - Upload images

- ✅ **Orders Page** (`/admin/orders`)
  - View all orders
  - Update order status
  - See order details

- ✅ **Settings Page** (`/admin/settings`)
  - Change store name
  - Set WhatsApp number
  - Upload custom logo
  - Update hero text
  - Change currency

---

## How to Test Product Import

### Step 1: Enter Test Mode

```
http://localhost:5173/admin/login?testmode=true
```

### Step 2: Click "Enter Test Mode"

You'll be redirected to `/admin` dashboard with full access.

### Step 3: Go to Products Page

Click **"Products"** in the left sidebar or navigate to `/admin/products`

### Step 4: Scroll to Product Importer Section

At the top of the products page, you'll see:

- **URL Input Field**: "Paste product URL (e.g., Jumia link)"
- **Import Button**: Click to scrape product data

### Step 5: Paste a Product URL

Examples you can test:

- Jumia product link (e.g., `https://jumia.com.ng/some-product`)
- Amazon product link
- Any other ecommerce product URL

### Step 6: Review Scraped Data

The system will:

1. Fetch product title, description, images, price
2. Display preview in editable form
3. Show all extracted details

### Step 7: Customize Before Saving

You can:

- Change product title/description
- Edit product images (add, remove, reorder)
- Set your own selling price (margin calculator)
- Choose featured/published status
- Select product category/brand

### Step 8: Save Product

Click **"Save Product"** to add to catalog

---

## Disabling Test Mode

### Option 1: Manual Disable (Browser Storage)

1. Stay in admin dashboard
2. Open browser DevTools (F12)
3. Go to **Console** tab
4. Type:
   ```javascript
   localStorage.removeItem("adminTestMode");
   window.location.href = "/admin/login";
   ```
5. Press Enter - you'll be logged out

### Option 2: Use Login Page

1. Navigate to `/admin/login`
2. If test mode is enabled, click **"Use regular login instead"** button
3. You'll be returned to normal login flow

### Option 3: Clear All Browser Data

1. Open Browser Settings
2. Clear cache and cookies for localhost
3. Test mode will be disabled

---

## Test Mode Features

### ✅ What Works in Test Mode

- All admin features functional
- Product import/scraping
- Product CRUD operations (Create, Read, Update, Delete)
- Orders management
- Store settings
- Dashboard metrics

### ⚠️ Limitations

- **No Real Authentication**: Test mode bypasses Supabase auth
- **Database Changes Persist**: Any products/orders you create will be saved to database
- **No User Email**: Test mode doesn't track a specific user
- **Not For Production**: This is development-only testing feature
- **Test Data**: Keep test data separate from real data

---

## Product Importer Testing Scenarios

### Scenario 1: Basic Product Import

1. Copy a simple Jumia product URL
2. Paste into importer
3. Verify data appears correctly
4. Save to database
5. Check product appears in products list

### Scenario 2: Edit Before Saving

1. Import a product
2. Change the title
3. Modify the price/margin
4. Upload different images
5. Save and verify changes

### Scenario 3: Multiple Products

1. Import several products
2. Create products without importing
3. Verify products list shows all items
4. Test sorting/filtering

### Scenario 4: Image Handling

1. Import product with multiple images
2. Reorder images in editor
3. Remove some images
4. Add new images
5. Save and verify gallery

---

## Troubleshooting Test Mode

### Test Mode Not Triggering

**Problem**: `/admin/login?testmode=true` doesn't show test mode button

**Solution**:

1. Clear browser cache (Ctrl+Shift+Delete)
2. Try incognito/private window
3. Check URL is exactly: `/admin/login?testmode=true`
4. Hard refresh page (Ctrl+F5)

### Can't Access Admin After Enabling Test Mode

**Problem**: Redirected back to login page

**Solution**:

1. Check localStorage has the flag
2. Open DevTools Console and run:
   ```javascript
   console.log(localStorage.getItem("adminTestMode"));
   ```
   Should return: `"true"`
3. Try refreshing page
4. Clear localStorage and try again

### Product Import Not Working

**Problem**: Import button doesn't scrape URL

**Solution**:

1. Verify URL is valid ecommerce product link
2. Check browser console for errors (F12 → Console)
3. Try a different product URL
4. Verify server function is working
5. Check network requests in DevTools

### Changes Not Saving

**Problem**: Product created but disappears on refresh

**Solution**:

1. Verify database connection is working
2. Check for errors in console
3. Ensure Supabase credentials are correct
4. Try creating a simple product without import

---

## Database Considerations

### ⚠️ Important for Testing

- **Test data is real**: All products you create stay in database
- **Clean up after testing**: Delete test products before deployment
- **Database state matters**: Your test database state reflects actual data
- **No rollback**: Changes are permanent (unless you manually delete)

### Cleaning Up Test Data

```sql
-- To remove test products (run in Supabase console)
DELETE FROM products WHERE title LIKE '%test%' OR category = 'test';
DELETE FROM orders WHERE status = 'test';
```

---

## Next Steps After Testing

### If Everything Works ✅

1. **Create Real Products**: Start adding actual inventory
2. **Test Checkout Flow**: Create orders and test WhatsApp checkout
3. **Try Settings**: Update store name, logo, WhatsApp
4. **Test Storefront**: Verify products appear correctly
5. **Deploy**: Ready to launch to production

### If Issues Found ❌

1. **Check Logs**: Review browser console and server logs
2. **Verify Supabase**: Ensure database is connected
3. **Test API Endpoint**: Check product import endpoint
4. **Database Queries**: Verify RLS policies allow operations
5. **Report Issues**: Document specific errors for debugging

---

## Related Documentation

- [UI_UX_GUIDE.md](UI_UX_GUIDE.md) - Complete design and feature guide
- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Database setup instructions
- [SECURITY_AUDIT.md](SECURITY_AUDIT.md) - Security considerations
- [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) - Pre-launch verification

---

## Quick Reference

| Task                       | URL/Command                                       |
| -------------------------- | ------------------------------------------------- |
| **Enable Test Mode**       | `http://localhost:5173/admin/login?testmode=true` |
| **Access Admin Dashboard** | `http://localhost:5173/admin`                     |
| **Products Page**          | `http://localhost:5173/admin/products`            |
| **Settings Page**          | `http://localhost:5173/admin/settings`            |
| **Check Test Mode Status** | `localStorage.getItem("adminTestMode")`           |
| **Disable Test Mode**      | `localStorage.removeItem("adminTestMode")`        |

---

**Last Updated**: May 2026  
**Status**: Ready for testing  
**Note**: This is a development-only feature. Remove or disable before production deployment.
