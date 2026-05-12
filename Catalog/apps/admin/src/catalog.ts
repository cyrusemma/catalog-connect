import type { Order, Product, Settings } from '@catalog/types';
import { calculateProfit, formatCurrency, formatDate, slugify } from '@catalog/utils';

export const adminSettings: Settings = {
  id: 'settings-admin',
  store_name: 'Catalog by Cyrus',
  store_logo_url: '',
  store_tagline: 'Admin control center for products, orders, and settings.',
  currency: 'GHS',
  whatsapp_number: '+233574090147',
  instagram_url: 'https://instagram.com',
  telegram_url: 'https://t.me',
  tiktok_url: 'https://tiktok.com',
  hero_title: 'Catalog by Cyrus Admin',
  hero_subtitle: 'Manage products, orders, and store configuration from one place.',
  hero_bg_url: '',
  primary_color: '#f59e0b',
  secondary_color: '#fbbf24',
  features_cart: true,
  features_notifications: true,
  features_reviews: true,
  features_accounts: true,
  updated_at: new Date().toISOString(),
  updated_by: 'admin',
};

export const adminProducts: Product[] = [
  {
    id: 'p1',
    title: 'Classic Leather Weekender',
    slug: slugify('Classic Leather Weekender'),
    description: 'Structured travel bag with a roomy interior, premium handles, and a polished finish.',
    short_description: 'Structured leather travel bag.',
    category_id: 'bags',
    brand: 'Cyrus Select',
    source_price: 180,
    selling_price: 240,
    discount_price: 280,
    markup_percentage: 33,
    shipping_cost: 20,
    expected_profit: calculateProfit(180, 240, 20),
    stock_status: 'available',
    stock_quantity: 18,
    featured: true,
    published: true,
    publish_date: new Date().toISOString(),
    rating: 4.8,
    rating_count: 87,
    main_image_url:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 'admin',
  },
  {
    id: 'p2',
    title: 'Pocket Smart Feature Phone',
    slug: slugify('Pocket Smart Feature Phone'),
    description: 'Battery-efficient feature phone with loud speaker and dual SIM support.',
    short_description: 'Compact dual-SIM phone.',
    category_id: 'electronics',
    brand: 'Nova Mobile',
    source_price: 95,
    selling_price: 130,
    discount_price: 150,
    markup_percentage: 37,
    shipping_cost: 15,
    expected_profit: calculateProfit(95, 130, 15),
    stock_status: 'limited',
    stock_quantity: 7,
    featured: true,
    published: true,
    publish_date: new Date().toISOString(),
    rating: 4.5,
    rating_count: 44,
    main_image_url:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 'admin',
  },
];

export const adminOrders: Order[] = [
  {
    id: 'order-1001',
    order_number: 'CAT-1001',
    user_id: 'guest',
    customer_name: 'Demo Customer',
    customer_phone: '+233574090147',
    customer_email: 'demo@example.com',
    delivery_region: 'Accra',
    delivery_city: 'Osu',
    delivery_address: '12 Commerce Street',
    delivery_landmark: 'Near the roundabout',
    special_notes: 'Call on arrival',
    order_status: 'processing',
    payment_status: 'confirmed',
    payment_method: 'MTN MoMo',
    total_amount: 370,
    shipping_cost: 20,
    subtotal: 350,
    notes: 'Leave with receptionist if unavailable.',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'order-1002',
    order_number: 'CAT-1002',
    user_id: 'guest',
    customer_name: 'Amina B.',
    customer_phone: '+233244111222',
    customer_email: 'amina@example.com',
    delivery_region: 'Tema',
    delivery_city: 'Community 1',
    delivery_address: 'Flat 4, Palm Court',
    delivery_landmark: 'Opposite the clinic',
    special_notes: '',
    order_status: 'pending_payment',
    payment_status: 'pending',
    payment_method: 'AirtelTigo Cash',
    total_amount: 125,
    shipping_cost: 15,
    subtotal: 110,
    notes: '',
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
];

export const orderStatusOptions = [
  { value: 'pending_payment', label: 'Pending Payment' },
  { value: 'payment_confirmed', label: 'Payment Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'dispatched', label: 'Dispatched' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
] as const;

export const paymentStatusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'rejected', label: 'Rejected' },
] as const;

export const getOrderTotal = (order: Order) => formatCurrency(order.total_amount, 'GHS');

export const orderSummary = {
  totalProducts: adminProducts.length,
  publishedProducts: adminProducts.filter((product) => product.published).length,
  totalOrders: adminOrders.length,
  confirmedOrders: adminOrders.filter((order) => order.payment_status === 'confirmed').length,
};

export const recentActivity = [
  {
    label: 'Product updated',
    detail: 'Classic Leather Weekender price changed to GHS 240',
    time: formatDate(adminProducts[0].updated_at),
  },
  {
    label: 'Order received',
    detail: 'CAT-1002 added to pending queue',
    time: formatDate(adminOrders[1].created_at),
  },
];

export const analyticsSeries = [
  { name: 'Mon', orders: 4, revenue: 420 },
  { name: 'Tue', orders: 6, revenue: 590 },
  { name: 'Wed', orders: 3, revenue: 240 },
  { name: 'Thu', orders: 8, revenue: 790 },
  { name: 'Fri', orders: 7, revenue: 680 },
  { name: 'Sat', orders: 5, revenue: 510 },
  { name: 'Sun', orders: 9, revenue: 920 },
];
