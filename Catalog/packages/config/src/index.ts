// Theme colors
export const COLORS = {
  dark: {
    background: '#0f0e0c',
    surface: '#1a1714',
    primary: '#f59e0b',
    accent: '#fbbf24',
    text: '#f5f5dc',
    muted: '#9ca3af',
  },
  light: {
    background: '#fef3e2',
    surface: '#ffffff',
    primary: '#f59e0b',
    accent: '#fbbf24',
    text: '#3f2c1f',
    muted: '#9ca3af',
  },
};

// API endpoints
export const API_ENDPOINTS = {
  auth: '/auth',
  products: '/api/products',
  orders: '/api/orders',
  carts: '/api/carts',
  wishlist: '/api/wishlist',
  categories: '/api/categories',
  settings: '/api/settings',
  scraper: '/api/scraper',
};

// Payment methods
export const PAYMENT_METHODS = [
  { id: 'mtn', name: 'MTN MoMo', icon: '📱' },
  { id: 'telecel', name: 'Telecel Cash', icon: '📱' },
  { id: 'airteltigo', name: 'AirtelTigo Cash', icon: '📱' },
];

// Delivery regions in Ghana
export const DELIVERY_REGIONS = [
  'Accra',
  'Kumasi',
  'Takoradi',
  'Sekondi',
  'Tema',
  'Cocoase',
  'Obuasi',
  'Ashanti',
  'Eastern',
  'Volta',
  'Central',
  'Northern',
  'Upper East',
  'Upper West',
];

// Categories
export const PRODUCT_CATEGORIES = [
  { id: 'bags', name: 'Bags', icon: '👜' },
  { id: 'phones', name: 'Feature Phones', icon: '📱' },
  { id: 'electronics', name: 'Electronics', icon: '⚡' },
  { id: 'fashion', name: 'Fashion', icon: '👗' },
  { id: 'lifestyle', name: 'Lifestyle', icon: '🎯' },
  { id: 'footwear', name: 'Footwear', icon: '👞' },
];

// Store default settings
export const DEFAULT_SETTINGS = {
  store_name: 'Catalog',
  currency: 'GHS',
  whatsapp_number: '+233574090147',
  hero_title: 'Discover Amazing Products Brought to you',
  hero_subtitle: 'Shop the finest selection, curated just for you. Fast delivery, great prices.',
  primary_color: '#f59e0b',
  secondary_color: '#fbbf24',
  features_cart: true,
  features_notifications: true,
  features_reviews: true,
  features_accounts: true,
};

// Feature flags
export const FEATURES = {
  WISHLIST_ENABLED: true,
  REVIEWS_ENABLED: true,
  VARIANTS_ENABLED: true,
  GUEST_CHECKOUT: true,
  ACCOUNTS_OPTIONAL: true,
  PUSH_NOTIFICATIONS: true,
};

// Order statuses
export const ORDER_STATUSES = {
  PENDING_PAYMENT: 'pending_payment',
  PAYMENT_CONFIRMED: 'payment_confirmed',
  PROCESSING: 'processing',
  DISPATCHED: 'dispatched',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Payment statuses
export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  REJECTED: 'rejected',
};

// Product availability
export const STOCK_STATUSES = {
  AVAILABLE: 'available',
  LIMITED: 'limited',
  SOLD_OUT: 'sold_out',
};
