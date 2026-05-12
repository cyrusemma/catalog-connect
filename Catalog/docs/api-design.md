# API Design

## REST Endpoints

### Products
```
GET /api/products                    # List all published products
GET /api/products?category=bags     # Filter by category
GET /api/products/:slug             # Get single product
POST /api/products                  # Create product (admin)
PUT /api/products/:id              # Update product (admin)
DELETE /api/products/:id           # Delete product (admin)
```

### Categories
```
GET /api/categories                # List all categories
GET /api/categories/:id            # Get single category
POST /api/categories               # Create (admin)
PUT /api/categories/:id            # Update (admin)
DELETE /api/categories/:id         # Delete (admin)
```

### Orders
```
GET /api/orders                    # List orders (user sees own, admin sees all)
GET /api/orders/:id               # Get order details
POST /api/orders                  # Create preorder
PUT /api/orders/:id              # Update order status (admin)
```

### Cart
```
GET /api/carts                    # Get current cart
POST /api/carts                   # Add item to cart
PUT /api/carts/:itemId           # Update quantity
DELETE /api/carts/:itemId        # Remove from cart
DELETE /api/carts                # Clear cart
```

### Wishlist
```
GET /api/wishlist                # Get wishlist
POST /api/wishlist               # Add to wishlist
DELETE /api/wishlist/:productId # Remove from wishlist
```

### Settings
```
GET /api/settings               # Get store settings
PUT /api/settings              # Update settings (admin)
```

### Scraper
```
POST /api/scraper/import       # Trigger product import
GET /api/scraper/import/:id   # Get import status
GET /api/scraper/logs         # Get import logs (admin)
```

## Request/Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* resource data */ },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product not found",
    "statusCode": 404
  }
}
```

## Pagination
- Default limit: 20 items
- Max limit: 100 items
- Use `page` and `limit` query parameters

## Filtering
- `category` - Filter by category slug
- `min_price` - Minimum price
- `max_price` - Maximum price
- `stock_status` - Filter by availability
- `search` - Search by title/description

## Sorting
- `sort=newest` - Newest first
- `sort=cheapest` - Price low to high
- `sort=most_popular` - Most viewed
- `sort=discounted` - Highest discount

## Authentication
- Use Supabase Auth tokens
- Include `Authorization: Bearer {token}` header
- Tokens expire after 1 hour
- Refresh tokens for long sessions

## Rate Limiting
- 100 requests per minute for authenticated users
- 10 requests per minute for anonymous users
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## CORS
- Allowed origins: localhost:3000, localhost:3001, production domain
- Allowed methods: GET, POST, PUT, DELETE
- Allowed headers: Content-Type, Authorization
