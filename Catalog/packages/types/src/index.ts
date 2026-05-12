// User type
export interface User {
  id: string;
  email: string;
  phone?: string;
  full_name: string;
  avatar_url?: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

// Product type
export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  category_id: string;
  brand?: string;
  source_price: number;
  selling_price: number;
  discount_price?: number;
  markup_percentage: number;
  shipping_cost?: number;
  expected_profit: number;
  stock_status: 'available' | 'limited' | 'sold_out';
  stock_quantity: number;
  featured: boolean;
  published: boolean;
  publish_date?: string;
  rating?: number;
  rating_count: number;
  main_image_url: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

// Product variant
export interface ProductVariant {
  id: string;
  product_id: string;
  variant_type: 'color' | 'size' | 'storage' | 'model';
  variant_value: string;
  variant_price?: number;
  created_at: string;
}

// Product image
export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  order: number;
  created_at: string;
}

// Category
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon_url?: string;
  created_at: string;
}

// Order
export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_region: string;
  delivery_city: string;
  delivery_address: string;
  delivery_landmark?: string;
  special_notes?: string;
  order_status: 'pending_payment' | 'payment_confirmed' | 'processing' | 'dispatched' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'confirmed' | 'rejected';
  payment_method?: string;
  total_amount: number;
  shipping_cost: number;
  subtotal: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Order item
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_title: string;
  variant_info?: Record<string, string>;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
}

// Cart item
export interface CartItem {
  id: string;
  user_id?: string;
  session_id?: string;
  product_id: string;
  quantity: number;
  variant_info?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

// Wishlist item
export interface WishlistItem {
  id: string;
  user_id?: string;
  session_id?: string;
  product_id: string;
  created_at: string;
}

// Review
export interface Review {
  id: string;
  product_id: string;
  user_id?: string;
  rating: number;
  created_at: string;
}

// Analytics event
export interface AnalyticsEvent {
  id: string;
  event_type: string;
  product_id?: string;
  user_id?: string;
  session_id: string;
  metadata?: Record<string, any>;
  created_at: string;
}

// Settings
export interface Settings {
  id: string;
  store_name: string;
  store_logo_url?: string;
  store_tagline?: string;
  currency: string;
  whatsapp_number: string;
  instagram_url?: string;
  telegram_url?: string;
  tiktok_url?: string;
  hero_title: string;
  hero_subtitle: string;
  hero_bg_url?: string;
  primary_color: string;
  secondary_color: string;
  features_cart: boolean;
  features_notifications: boolean;
  features_reviews: boolean;
  features_accounts: boolean;
  updated_at: string;
  updated_by: string;
}

// Notification
export interface Notification {
  id: string;
  user_id: string;
  order_id?: string;
  title: string;
  message: string;
  type: 'order_confirmed' | 'dispatched' | 'delivered' | 'discount' | 'new_arrival';
  read: boolean;
  created_at: string;
}
