#!/bin/bash

# Seed database with sample data
echo "Seeding database with sample products..."

# Insert sample categories
psql $DATABASE_URL <<EOF
INSERT INTO categories (name, slug, description, icon_url) VALUES
  ('Bags', 'bags', 'Handbags and backpacks', '👜'),
  ('Feature Phones', 'phones', 'Feature phones', '📱'),
  ('Electronics', 'electronics', 'Electronic gadgets', '⚡'),
  ('Fashion', 'fashion', 'Clothing and accessories', '👗'),
  ('Lifestyle', 'lifestyle', 'Lifestyle products', '🎯'),
  ('Footwear', 'footwear', 'Shoes and boots', '👞')
ON CONFLICT DO NOTHING;
EOF

echo "Seed complete!"
