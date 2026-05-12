-- Create UUID extension
create extension if not exists "uuid-ossp";

-- Users table
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  phone text,
  full_name text not null,
  avatar_url text,
  is_admin boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  last_login timestamp with time zone
);

-- Categories table
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  slug text unique not null,
  description text,
  icon_url text,
  created_at timestamp with time zone default now()
);

-- Products table
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  description text,
  short_description text,
  category_id uuid references categories(id) on delete set null,
  brand text,
  source_price decimal not null,
  selling_price decimal not null,
  discount_price decimal,
  markup_percentage decimal,
  shipping_cost decimal,
  expected_profit decimal,
  stock_status text default 'available' check(stock_status in ('available', 'limited', 'sold_out')),
  stock_quantity integer default 0,
  featured boolean default false,
  published boolean default false,
  publish_date timestamp with time zone,
  rating decimal,
  rating_count integer default 0,
  main_image_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  created_by uuid references users(id) on delete set null
);

-- Product images table
create table if not exists product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  order_idx integer,
  created_at timestamp with time zone default now()
);

-- Product variants table
create table if not exists product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  variant_type text check(variant_type in ('color', 'size', 'storage', 'model')),
  variant_value text not null,
  variant_price decimal,
  created_at timestamp with time zone default now()
);

-- Orders table
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text unique not null,
  user_id uuid references users(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  delivery_region text not null,
  delivery_city text not null,
  delivery_address text not null,
  delivery_landmark text,
  special_notes text,
  order_status text default 'pending_payment' check(order_status in ('pending_payment', 'payment_confirmed', 'processing', 'dispatched', 'delivered', 'cancelled')),
  payment_status text default 'pending' check(payment_status in ('pending', 'confirmed', 'rejected')),
  payment_method text,
  total_amount decimal not null,
  shipping_cost decimal,
  subtotal decimal not null,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Order items table
create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id) on delete set null,
  product_title text not null,
  variant_info jsonb,
  quantity integer not null,
  unit_price decimal not null,
  subtotal decimal not null,
  created_at timestamp with time zone default now()
);

-- Carts table
create table if not exists carts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  session_id text,
  product_id uuid not null references products(id) on delete cascade,
  quantity integer not null default 1,
  variant_info jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Wishlist table
create table if not exists wishlist (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  session_id text,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(user_id, product_id),
  unique(session_id, product_id)
);

-- Reviews table
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  user_id uuid references users(id) on delete set null,
  rating integer not null check(rating >= 1 and rating <= 5),
  created_at timestamp with time zone default now()
);

-- Analytics events table
create table if not exists analytics_events (
  id uuid primary key default uuid_generate_v4(),
  event_type text not null,
  product_id uuid references products(id) on delete set null,
  user_id uuid references users(id) on delete set null,
  session_id text,
  metadata jsonb,
  created_at timestamp with time zone default now()
);

-- Notifications table
create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  order_id uuid references orders(id) on delete cascade,
  title text not null,
  message text not null,
  type text check(type in ('order_confirmed', 'dispatched', 'delivered', 'discount', 'new_arrival')),
  read boolean default false,
  created_at timestamp with time zone default now()
);

-- Settings table
create table if not exists settings (
  id uuid primary key default uuid_generate_v4(),
  store_name text default 'Catalog',
  store_logo_url text,
  store_tagline text,
  currency text default 'GHS',
  whatsapp_number text,
  instagram_url text,
  telegram_url text,
  tiktok_url text,
  hero_title text,
  hero_subtitle text,
  hero_bg_url text,
  primary_color text default '#f59e0b',
  secondary_color text default '#fbbf24',
  features_cart boolean default true,
  features_notifications boolean default true,
  features_reviews boolean default true,
  features_accounts boolean default true,
  updated_at timestamp with time zone default now(),
  updated_by uuid references users(id) on delete set null
);

-- Create indexes
create index idx_products_slug on products(slug);
create index idx_products_category on products(category_id);
create index idx_products_published on products(published);
create index idx_orders_user on orders(user_id);
create index idx_orders_status on orders(order_status);
create index idx_orders_created on orders(created_at);
create index idx_order_items_order on order_items(order_id);
create index idx_carts_user on carts(user_id);
create index idx_wishlist_user on wishlist(user_id);
create index idx_analytics_event_type on analytics_events(event_type);
create index idx_analytics_user on analytics_events(user_id);

-- Enable RLS
alter table users enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table carts enable row level security;
alter table wishlist enable row level security;
alter table reviews enable row level security;
alter table notifications enable row level security;

-- RLS Policies: Users can only view their own profile
create policy "Users can view own profile" on users
  for select using (auth.uid()::text = id::text or is_admin);

-- RLS Policies: Products are publicly readable if published
create policy "Public can view published products" on products
  for select using (published = true);

-- RLS Policies: Admin can view all products
create policy "Admin can view all products" on products
  for select using (
    auth.jwt() ->> 'email' in (
      select email from users where is_admin = true
    )
  );

-- RLS Policies: Users can only view their own orders
create policy "Users can view own orders" on orders
  for select using (auth.uid()::text = user_id::text or user_id is null);

-- RLS Policies: Users can only view their own cart
create policy "Users can view own cart" on carts
  for select using (auth.uid()::text = user_id::text or user_id is null);

-- RLS Policies: Users can only view their own wishlist
create policy "Users can view own wishlist" on wishlist
  for select using (auth.uid()::text = user_id::text or user_id is null);

-- Insert default settings
insert into settings (id, store_name, store_tagline, whatsapp_number, hero_title, hero_subtitle)
values (
  '00000000-0000-0000-0000-000000000000',
  'Catalog',
  'Shop the finest selection, curated just for you',
  '+233574090147',
  'Discover Amazing Products Brought to you',
  'Shop the finest selection, curated just for you. Fast delivery, great prices.'
) on conflict do nothing;
