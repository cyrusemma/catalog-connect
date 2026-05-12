import type { Category, Order, Product, Settings } from '@catalog/types';
import { slugify } from '@catalog/utils';

export const storeSettings: Settings = {
  id: 'settings-web',
  store_name: 'Catalog by Cyrus',
  store_logo_url: '',
  store_tagline: 'Curated drops, clear pricing, fast preorder support.',
  currency: 'GHS',
  whatsapp_number: '+233574090147',
  instagram_url: 'https://instagram.com',
  telegram_url: 'https://t.me',
  tiktok_url: 'https://tiktok.com',
  hero_title: 'Discover Amazing Products Brought to you',
  hero_subtitle:
    'Shop curated bags, electronics, fashion, and essentials with a clean preorder flow and instant WhatsApp support.',
  hero_bg_url: '',
  primary_color: '#f59e0b',
  secondary_color: '#fbbf24',
  features_cart: true,
  features_notifications: true,
  features_reviews: true,
  features_accounts: true,
  updated_at: new Date().toISOString(),
  updated_by: 'system',
};

export const categories: Category[] = [
  {
    id: 'bags',
    name: 'Bags',
    slug: 'bags',
    description: 'Travel, tote, and everyday carry pieces.',
    icon_url: '👜',
    created_at: new Date().toISOString(),
  },
  {
    id: 'electronics',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Phones, accessories, and practical gadgets.',
    icon_url: '⚡',
    created_at: new Date().toISOString(),
  },
  {
    id: 'fashion',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Wardrobe staples with a polished look.',
    icon_url: '👗',
    created_at: new Date().toISOString(),
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    slug: 'lifestyle',
    description: 'Home, beauty, and daily use essentials.',
    icon_url: '✨',
    created_at: new Date().toISOString(),
  },
];

export const products: Product[] = [
  {
    id: 'p1',
    title: 'Classic Leather Weekender',
    slug: slugify('Classic Leather Weekender'),
    description:
      'Structured travel bag with a roomy interior, premium handles, and a polished finish for short trips or daily carry.',
    short_description: 'Structured leather travel bag with premium finish.',
    category_id: 'bags',
    brand: 'Cyrus Select',
    source_price: 180,
    selling_price: 240,
    discount_price: 280,
    markup_percentage: 33,
    shipping_cost: 20,
    expected_profit: 40,
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
    created_by: 'system',
  },
  {
    id: 'p2',
    title: 'Pocket Smart Feature Phone',
    slug: slugify('Pocket Smart Feature Phone'),
    description:
      'Battery-efficient feature phone with loud speaker, dual SIM support, and a compact form factor for everyday use.',
    short_description: 'Compact dual-SIM phone with strong battery life.',
    category_id: 'electronics',
    brand: 'Nova Mobile',
    source_price: 95,
    selling_price: 130,
    discount_price: 150,
    markup_percentage: 37,
    shipping_cost: 15,
    expected_profit: 20,
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
    created_by: 'system',
  },
  {
    id: 'p3',
    title: 'Minimal Canvas Shoulder Bag',
    slug: slugify('Minimal Canvas Shoulder Bag'),
    description:
      'Lightweight everyday shoulder bag with strong stitching and a clean silhouette for work or school.',
    short_description: 'Lightweight everyday shoulder bag.',
    category_id: 'bags',
    brand: 'North Yard',
    source_price: 72,
    selling_price: 110,
    discount_price: 125,
    markup_percentage: 53,
    shipping_cost: 12,
    expected_profit: 26,
    stock_status: 'available',
    stock_quantity: 24,
    featured: true,
    published: true,
    publish_date: new Date().toISOString(),
    rating: 4.7,
    rating_count: 61,
    main_image_url:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 'system',
  },
  {
    id: 'p4',
    title: 'Everyday Power Bank 20000mAh',
    slug: slugify('Everyday Power Bank 20000mAh'),
    description:
      'Fast-charging power bank with dual output, LED status display, and enough capacity for all-day backup.',
    short_description: 'High-capacity charging backup with dual output.',
    category_id: 'electronics',
    brand: 'VoltHouse',
    source_price: 88,
    selling_price: 125,
    discount_price: 140,
    markup_percentage: 42,
    shipping_cost: 12,
    expected_profit: 25,
    stock_status: 'available',
    stock_quantity: 32,
    featured: false,
    published: true,
    publish_date: new Date().toISOString(),
    rating: 4.6,
    rating_count: 52,
    main_image_url:
      'https://images.unsplash.com/photo-1609592806596-4d97f0c5a5cb?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 'system',
  },
  {
    id: 'p5',
    title: 'Heritage Cotton Set',
    slug: slugify('Heritage Cotton Set'),
    description:
      'Soft cotton set with a premium drape and a polished look that transitions from home to casual outings.',
    short_description: 'Premium casual set with clean drape.',
    category_id: 'fashion',
    brand: 'Avenue Line',
    source_price: 140,
    selling_price: 190,
    discount_price: 220,
    markup_percentage: 36,
    shipping_cost: 15,
    expected_profit: 35,
    stock_status: 'available',
    stock_quantity: 12,
    featured: false,
    published: true,
    publish_date: new Date().toISOString(),
    rating: 4.3,
    rating_count: 29,
    main_image_url:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 'system',
  },
  {
    id: 'p6',
    title: 'Daily Glow Vanity Mirror',
    slug: slugify('Daily Glow Vanity Mirror'),
    description:
      'LED vanity mirror with three brightness levels and a compact frame that fits on any dresser or counter.',
    short_description: 'Compact LED mirror with three brightness levels.',
    category_id: 'lifestyle',
    brand: 'Glowline',
    source_price: 60,
    selling_price: 95,
    discount_price: 110,
    markup_percentage: 58,
    shipping_cost: 10,
    expected_profit: 25,
    stock_status: 'limited',
    stock_quantity: 9,
    featured: false,
    published: true,
    publish_date: new Date().toISOString(),
    rating: 4.2,
    rating_count: 22,
    main_image_url:
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 'system',
  },
];

export const testimonials = [
  {
    name: 'Ama D.',
    quote: 'The checkout flow feels clear and the WhatsApp handoff is exactly what I needed.',
    rating: 5,
  },
  {
    name: 'Kwame T.',
    quote: 'The product pages are clean, fast, and easy to browse on mobile.',
    rating: 5,
  },
  {
    name: 'Nana S.',
    quote: 'I could find what I wanted quickly and place my preorder in a few taps.',
    rating: 4,
  },
];

export const faqs = [
  {
    question: 'How does preorder work?',
    answer:
      'Add items to your cart, review the order, then send it through WhatsApp for confirmation and payment details.',
  },
  {
    question: 'Can I shop without creating an account?',
    answer: 'Yes. Guest checkout is enabled, and account pages are optional for repeat customers.',
  },
  {
    question: 'How long does delivery take?',
    answer:
      'Delivery depends on the region and item type. Local orders are usually processed quickly after payment confirmation.',
  },
  {
    question: 'Can I request a different color or variant?',
    answer: 'Yes. Variant selectors are available on supported products and can be included in the preorder notes.',
  },
];

export const deliveryNotes = [
  'Accra, Tema, and nearby routes get the fastest turnaround.',
  'Regional deliveries are confirmed with the customer before dispatch.',
  'Delivery fees are reviewed during checkout and may vary by region.',
];

export const refundNotes = [
  'Orders can be cancelled before dispatch.',
  'Items with manufacturing defects are reviewed case by case.',
  'Variant and preorder products are confirmed before payment is finalized.',
];

export const preorderNotes = [
  'Preorders are confirmed manually after the WhatsApp handoff.',
  'The app calculates totals from the selected products and delivery details.',
  'Payment instructions are shared after order review.',
];

export const staticPageCopy: Record<string, { title: string; description: string; bullets: string[] }> = {
  faq: {
    title: 'Frequently Asked Questions',
    description: 'Answers to the most common questions about browsing, preorder, payment, and delivery.',
    bullets: faqs.map((item) => `${item.question} - ${item.answer}`),
  },
  delivery: {
    title: 'Delivery Policy',
    description: 'Clear delivery expectations for local and regional orders.',
    bullets: deliveryNotes,
  },
  refund: {
    title: 'Refund Policy',
    description: 'Simple rules for cancellations and issue resolution.',
    bullets: refundNotes,
  },
  preorder: {
    title: 'Preorder Explained',
    description: 'How our preorder workflow works from cart to WhatsApp confirmation.',
    bullets: preorderNotes,
  },
};

export const sampleOrders: Order[] = [
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

export const getProductBySlug = (slug: string) => products.find((product) => product.slug === slug);

export const getCategoryById = (categoryId: string) => categories.find((category) => category.id === categoryId);

export const getRelatedProducts = (product: Product) =>
  products.filter((item) => item.id !== product.id && item.category_id === product.category_id).slice(0, 3);
