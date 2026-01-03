#!/bin/sh
set -e

echo "Starting application..."

# Run Prisma migrations (safe to run multiple times)
echo "Running database migrations..."
if [ -f ./node_modules/.bin/prisma ]; then
  ./node_modules/.bin/prisma migrate deploy || echo "Migration failed or already applied"
  ./node_modules/.bin/prisma generate
else
  echo "Prisma not found, skipping migrations"
fi

# Start the application
echo "Starting Next.js..."
exec npm run dev
