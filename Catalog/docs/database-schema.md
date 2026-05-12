# Database Schema

## Tables Overview

### users
User accounts for customers and admin.

```sql
id (UUID PK)
email (unique)
phone
full_name
avatar_url
is_admin (boolean)
created_at
updated_at
last_login
```

### products
Product catalog.

```sql
id (UUID PK)
title
slug (unique)
description
short_description
category_id (FK)
brand
source_price
selling_price
discount_price
markup_percentage
shipping_cost
expected_profit
stock_status
stock_quantity
featured (boolean)
published (boolean)
publish_date
rating
rating_count
main_image_url
created_at
updated_at
created_by (FK to users)
```

### product_images
Multiple images per product.

```sql
id (UUID PK)
product_id (FK)
image_url
alt_text
order_idx
created_at
```

### product_variants
Size, color, storage variants.

```sql
id (UUID PK)
product_id (FK)
variant_type (color/size/storage/model)
variant_value
variant_price
created_at
```

### categories
Product categories.

```sql
id (UUID PK)
name (unique)
slug (unique)
description
icon_url
created_at
```

### orders
Customer orders.

```sql
id (UUID PK)
order_number (unique)
user_id (FK, nullable for guest)
customer_name
customer_phone
customer_email
delivery_region
delivery_city
delivery_address
delivery_landmark
special_notes
order_status
payment_status
payment_method
total_amount
shipping_cost
subtotal
notes
created_at
updated_at
```

### order_items
Items in each order.

```sql
id (UUID PK)
order_id (FK)
product_id (FK)
product_title
variant_info (JSONB)
quantity
unit_price
subtotal
created_at
```

### carts
Shopping carts (temporary).

```sql
id (UUID PK)
user_id (FK, nullable)
session_id (nullable)
product_id (FK)
quantity
variant_info (JSONB)
created_at
updated_at
```

### wishlist
Saved products.

```sql
id (UUID PK)
user_id (FK, nullable)
session_id (nullable)
product_id (FK)
created_at
unique(user_id, product_id)
unique(session_id, product_id)
```

### reviews
Product ratings.

```sql
id (UUID PK)
product_id (FK)
user_id (FK, nullable)
rating (1-5)
created_at
```

### analytics_events
User activity tracking.

```sql
id (UUID PK)
event_type
product_id (FK, nullable)
user_id (FK, nullable)
session_id
metadata (JSONB)
created_at
```

### notifications
User notifications.

```sql
id (UUID PK)
user_id (FK)
order_id (FK, nullable)
title
message
type
read (boolean)
created_at
```

### settings
Store configuration.

```sql
id (UUID PK)
store_name
store_logo_url
store_tagline
currency
whatsapp_number
instagram_url
telegram_url
tiktok_url
hero_title
hero_subtitle
hero_bg_url
primary_color
secondary_color
features_cart
features_notifications
features_reviews
features_accounts
updated_at
updated_by (FK)
```

## Indexes

- `products(slug)` - For product lookup
- `products(category_id)` - For filtering
- `products(published)` - For listing
- `orders(user_id)` - For user's orders
- `orders(order_status)` - For filtering
- `orders(created_at)` - For sorting
- `order_items(order_id)` - For order details
- `carts(user_id)` - For user's cart
- `wishlist(user_id)` - For user's wishlist
- `analytics_events(event_type)` - For analytics
- `analytics_events(user_id)` - For user tracking

## Row-Level Security (RLS)

### products table
- Public read: published = true
- Admin: can read all
- Admin: can create/update/delete

### orders table
- Users see their own orders
- Admin sees all orders
- Users can create orders (preorders)

### carts table
- Users see their own cart
- Users can CRUD their cart
- Guest sessions anonymous

### wishlist table
- Users see their own wishlist
- Users can CRUD their wishlist
- Guest sessions anonymous

### users table
- Users see their own profile
- Admin can see all profiles

## Relationships

```
users (1) ──→ (many) products (created_by)
users (1) ──→ (many) orders (user_id)
users (1) ──→ (many) carts (user_id)
users (1) ──→ (many) wishlist (user_id)
users (1) ──→ (many) reviews (user_id)
users (1) ──→ (many) notifications (user_id)

categories (1) ──→ (many) products (category_id)

products (1) ──→ (many) product_images
products (1) ──→ (many) product_variants
products (1) ──→ (many) reviews
products (1) ──→ (many) carts (product_id)
products (1) ──→ (many) wishlist (product_id)

orders (1) ──→ (many) order_items (order_id)
products (1) ──→ (many) order_items (product_id)
```

## Migrations

All migrations are in `/supabase/migrations/`:
- `001_initial_schema.sql` - Initial schema setup

To apply migrations:
```bash
supabase db push
```
