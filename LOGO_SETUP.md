# Custom Logo Implementation Guide

## 🎨 Your Logo has been Integrated!

Your orange shopping bag logo is now set up to display across your entire application. Here's what was changed:

---

## Where Your Logo Appears

### 1. **Storefront Navbar** (Top of store)

- Displays your logo next to the store name
- Updates automatically when you change `logo_url` in store settings
- Falls back to shopping bag icon if no logo is set

### 2. **Admin Sidebar** (Left navigation)

- Shows your logo at the top of the admin dashboard
- Consistent branding across admin section
- Responsive on mobile

### 3. **Admin Login Page**

- Your logo appears in the login/signup form
- Creates professional first impression for admin access
- Uses the same icon as other areas for consistency

---

## How to Use Your Logo

### Option 1: Use the Default SVG Logo (Recommended for Now)

The orange shopping bag SVG is already in `/public/logo.svg`

**To use it:**

1. Go to **Admin** → **Settings**
2. In **Logo URL** field, enter: `/logo.svg`
3. Click **Save settings**
4. Refresh the page to see your logo appear everywhere

### Option 2: Use a Remote Logo URL

You can use any image URL (PNG, JPG, WebP, SVG):

**To use a remote logo:**

1. Go to **Admin** → **Settings**
2. In **Logo URL** field, paste the full URL (e.g., `https://example.com/my-logo.png`)
3. Click **Save settings**
4. Refresh the page to see your logo appear

### Option 3: Upload Your Logo to Supabase Storage (Best Practice)

For production, store images in Supabase:

1. In Supabase dashboard, go to **Storage** → **product-images** bucket
2. Click **Upload file** and select your logo image
3. Once uploaded, click the image and copy its **public URL**
4. Go to **Admin** → **Settings** in your app
5. Paste the URL in **Logo URL** field
6. Click **Save settings**

---

## Customizing the Logo

### Replace the SVG Logo

If you want a different logo file:

1. **Option A**: Replace `/public/logo.svg` with your image
   - Keep the same filename
   - Automatically used if `/logo.svg` is set in settings

2. **Option B**: Add a new file to `/public/` folder
   - Example: `/public/my-custom-logo.png`
   - Set URL in settings: `/my-custom-logo.png`

3. **Option C**: Use any external logo URL
   - CDN, AWS S3, or Supabase Storage
   - Just paste the full URL in settings

---

## Logo Best Practices

### Image Size & Format

- **Recommended size**: 200×200 px (square works best)
- **Aspect ratio**: Any (will be sized with `object-contain`)
- **Format**: PNG (transparent), SVG (scalable), or JPG
- **File size**: < 50 KB for fast loading

### Display Locations

| Location          | Size     | Format |
| ----------------- | -------- | ------ |
| Storefront Navbar | 36×36 px | Any    |
| Admin Sidebar     | 36×36 px | Any    |
| Admin Login       | 44×44 px | Any    |

### Color Considerations

- Your orange (#FF8C42) logo will look great on the warm amber background
- Works in both light and dark modes
- Ensure good contrast on your selected colors

---

## Logo Component Code

The logo uses a reusable `<Logo>` component that:

1. **Checks for custom logo URL** in store settings
2. **Displays the logo image** if a URL exists
3. **Falls back to shopping bag icon** if no URL set

### How It Works

```typescript
// In store settings:
logo_url: "https://example.com/logo.png"; // Custom logo

// OR
logo_url: null; // Falls back to icon
```

### Component Usage

```tsx
import { Logo } from "@/components/logo";

<Logo logoUrl={settings.logo_url} storeName={settings.store_name} className="size-9" />;
```

---

## Files Changed

### New Files Created:

- ✅ `/public/logo.svg` — Your orange shopping bag logo
- ✅ `/src/components/logo.tsx` — Reusable Logo component

### Updated Files:

- ✅ `src/components/storefront/store-navbar.tsx` — Uses Logo component
- ✅ `src/routes/admin.tsx` — Admin sidebar uses Logo component
- ✅ `src/routes/admin/login.tsx` — Login page uses Logo component

---

## Next Steps

### Immediate

1. Go to Admin → Settings
2. Enter `/logo.svg` in the **Logo URL** field
3. Click **Save settings**
4. Refresh and see your logo appear! 🎉

### For Production

1. Replace or upload a better version of your logo
2. Store in Supabase Storage for reliability
3. Update the URL in store settings

### Optional Enhancements (Future)

- Add logo to browser favicon
- Create different logo versions (square, horizontal)
- Add logo to email notifications
- Display logo on order receipts

---

## Troubleshooting

### Logo Not Showing

**Issue**: Logo URL is set but not displaying

- Check the URL is correct and accessible
- Try opening the URL directly in browser
- Verify file format is supported (PNG, JPG, SVG)
- Clear browser cache and refresh

### Logo Looks Blurry

**Issue**: Logo appears pixelated

- Use a larger/higher resolution image
- SVG format is recommended for sharpness
- Ensure image size is at least 200×200 px

### Logo Alignment Issues

**Issue**: Logo doesn't fit properly in navbar

- Check the `object-contain` CSS is applied
- Ensure image has appropriate aspect ratio
- Try a square format (1:1 ratio) for best results

---

## Technical Details

### Responsive Design

- Logo scales responsively across all screen sizes
- Mobile navbar: 36×36 px
- Desktop navbar: 36×36 px (same responsive sizing)
- Maintains aspect ratio using `object-contain`

### Performance

- Logo loads asynchronously (non-blocking)
- Falls back to icon instantly if image fails
- Uses browser image caching for repeat loads
- No impact on initial page load

### Accessibility

- Logo has `alt` attribute with store name
- Fallback icon is semantic and meaningful
- No impact on keyboard navigation or screen readers

---

## Quick Reference

| Task                    | Location           | Steps                                    |
| ----------------------- | ------------------ | ---------------------------------------- |
| **Change Logo URL**     | Admin → Settings   | Update **Logo URL** field, click Save    |
| **Use Default Logo**    | Admin → Settings   | Enter `/logo.svg`, click Save            |
| **Upload to Storage**   | Supabase → Storage | Upload, copy URL, paste in Settings      |
| **See Logo Everywhere** | Refresh page       | All navbar/login areas updated instantly |

---

## Support

For questions or issues:

1. Check file is accessible at the URL
2. Verify file format is supported
3. Clear browser cache and reload
4. Try with different logo URL to test
5. Check browser console for errors (F12)

**Your orange shopping bag logo is now part of your brand! 🧡**
