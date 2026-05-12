#!/bin/bash

# Generate URL-friendly slugs for products
echo "Generating slugs..."

psql $DATABASE_URL <<EOF
UPDATE products 
SET slug = LOWER(
  TRIM(
    REGEXP_REPLACE(
      REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    )
  )
)
WHERE slug IS NULL OR slug = '';
EOF

echo "Slugs generated!"
