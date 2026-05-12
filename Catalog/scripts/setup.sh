#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
pnpm install

# Setup environment file
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "Created .env.local - please update with your Supabase credentials"
fi

echo "Setup complete! Run 'pnpm dev' to start"
