# Local Authentication Setup Guide

## Overview

Your admin section now uses **local browser-based authentication** with **localStorage** instead of Supabase. This allows you to test all admin features immediately without any backend setup.

---

## Quick Start

### 1. Go to Admin Login
```
http://localhost:5173/admin/login
```

### 2. Enter Demo Credentials
The login page shows the demo credentials:
- **Email**: `admin@example.com`
- **Password**: `password123`

### 3. Click "Sign in"
You'll be logged in and redirected to the admin dashboard with full access!

---

## What You Get Access To

✅ **Admin Dashboard** (`/admin`)
- View all admin pages
- See store statistics

✅ **Products Page** (`/admin/products`)
- View, create, edit, delete products
- **Test product import** (paste URLs, scrape data)
- Manage product images and prices

✅ **Add New Product** (`/admin/products/new`)
- Create products from scratch
- Upload images
- Set pricing

✅ **Orders Page** (`/admin/orders`)
- View all orders
- Update order status

✅ **Settings Page** (`/admin/settings`)
- Change store name
- Set WhatsApp number
- Upload custom logo
- Update hero text
- Change currency

---

## How It Works

### Authentication Flow

1. **Login**: Enter demo credentials and click "Sign in"
2. **Storage**: User info stored in browser localStorage as `adminAuth`
3. **Protection**: Admin routes check localStorage for auth token
4. **Logout**: Click "Sign out" or clear localStorage manually

### Data Storage

All data (products, orders, settings) is stored in **browser localStorage**:
- `storeSettings` - Store configuration
- `products` - Product inventory (if you implement storage)
- Other admin data

**Note**: Data persists only in your browser and device. Clear browser data will erase everything.

---

## Demo Credentials

```
Email:    admin@example.com
Password: password123
```

These are hardcoded in the app for testing. You can change them by editing:
- `src/hooks/use-local-auth.ts` - Lines 12-13

---

## File Structure

### New Files Created
- `src/hooks/use-local-auth.ts` - Local authentication hook

### Updated Files
- `src/routes/admin/login.tsx` - Simple login form with demo credentials
- `src/routes/admin.tsx` - Updated to check localStorage instead of Supabase
- `src/routes/admin.settings.tsx` - Uses localStorage for settings
- `src/hooks/use-store-settings.ts` - Replaced with localStorage-based version

### Removed/Disabled
- Supabase imports from auth-related files
- Database queries for authentication
- JWT/session verification

---

## Testing Product Importer

### Step-by-Step

1. **Login** with demo credentials
2. **Go to Products** (`/admin/products`)
3. **Paste Product URL** - Enter a Jumia or ecommerce product link
4. **Click Import** - System scrapes product data
5. **Edit Details** - Adjust price, images, description
6. **Save** - Add product to your catalog

### Example URLs to Test
- Jumia: `https://jumia.com.ng/some-product`
- Amazon: `https://amazon.com/some-product`
- Any ecommerce product page

---

## Important Notes

### ⚠️ Limitations

- **Local Storage Only**: Data doesn't persist if browser is cleared
- **Single Device**: Each device has separate data
- **No Real Backend**: Can't sync across devices
- **No Database**: Limited to localStorage capacity (~5-10MB)
- **Test Only**: Not suitable for production

### ✅ Perfect For

- Testing admin functionality
- Testing product import workflow
- Testing UI/UX of admin dashboard
- Local development and iteration
- Demonstrating features

---

## Making Changes to Credentials

### Change Demo Password

1. Open `src/hooks/use-local-auth.ts`
2. Find lines 12-13:
   ```typescript
   const DEMO_EMAIL = "admin@example.com";
   const DEMO_PASSWORD = "password123";
   ```
3. Change the values
4. Save and rebuild: `npm run build`

### Increase Security (Optional)

To add more validation or change the auth flow:
1. Edit `src/hooks/use-local-auth.ts`
2. Modify the `signIn` function
3. Update login validation logic

---

## Debugging

### Check if Logged In

Open browser DevTools Console (F12):
```javascript
localStorage.getItem("adminAuth")
```

Should return user object if logged in, `null` if not.

### Clear Auth

```javascript
localStorage.removeItem("adminAuth");
window.location.href = "/admin/login";
```

### View All LocalStorage Data

```javascript
localStorage
```

Shows all stored data including settings, products, etc.

---

## Next Steps

1. ✅ **Login** with demo credentials
2. ✅ **Test Admin Dashboard** - Explore all pages
3. ✅ **Create Sample Products** - Add test products
4. ✅ **Test Product Importer** - Paste a real product URL
5. ✅ **Update Settings** - Change store name, add logo, etc.
6. ✅ **Test Storefront** - View products on the shop page

---

## Transitioning to Real Backend (Future)

When you're ready to deploy:

1. Set up a real authentication system (Supabase, Firebase, etc.)
2. Replace localStorage with real database
3. Add user session management
4. Implement proper security and validation
5. Deploy to production

---

## Support & Troubleshooting

### Login Not Working
- Check credentials are exact: `admin@example.com` / `password123`
- Clear browser cache and try again
- Check browser console for errors (F12)

### Data Not Persisting
- Check localStorage is enabled in browser
- Clear cache → restart browser
- Check localStorage is not full
- Try incognito/private window

### Products Not Saving
- Open DevTools Console (F12)
- Check for JavaScript errors
- Verify localStorage has space
- Try refreshing the page

### Can't Access Admin Pages
- Make sure you're logged in (check localStorage)
- Try logging out and logging back in
- Clear browser data and login again

---

## Quick Reference

| Action | Method |
|--------|--------|
| **Login** | Navigate to `/admin/login` and enter demo credentials |
| **Logout** | Click "Sign out" in admin footer |
| **Access Admin** | Must be logged in, otherwise redirected to login |
| **Check Auth** | `localStorage.getItem("adminAuth")` |
| **Clear Auth** | `localStorage.removeItem("adminAuth")` |
| **Settings** | Stored in `localStorage` under `storeSettings` |
| **Products** | Stored in `localStorage` (if you add storage) |

---

**Status**: ✅ Ready for testing  
**Last Updated**: May 2026  
**Note**: This is a development-only setup. Replace with real authentication before production.
