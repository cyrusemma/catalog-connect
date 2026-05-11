export type Product = {
  id: string;
  slug: string;
  title: string;
  brand: string | null;
  description: string | null;
  source_url: string | null;
  source_price: number | null;
  selling_price: number;
  images: string[];
  specifications: Record<string, string>;
  stock: number;
  category: string | null;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type StoreSettings = {
  id: number;
  store_name: string;
  whatsapp_number: string;
  hero_title: string;
  hero_subtitle: string;
  currency: string;
  logo_url: string | null;
};

export type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  items: Array<{ id: string; title: string; quantity: number; price: number }>;
  total: number;
  status: string;
  created_at: string;
};
