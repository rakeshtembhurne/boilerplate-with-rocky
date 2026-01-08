#!/bin/bash

# Build optimized container with proper cleanup
set -e

echo "🚀 Building optimized container image..."

# Build with the optimized Containerfile
podman build \
    --build-arg NEXT_PUBLIC_APP_URL=http://localhost:3000 \
    --build-arg DATABASE_URL=postgres://postgres:postgres@db:5432/ai_starter_db \
    --build-arg BETTER_AUTH_SECRET=eOAB8lAqjk8gNB75naxaizQem9brsVN2PavlrPyuW/w= \
    --build-arg BETTER_AUTH_URL=http://localhost:3000 \
    --build-arg GOOGLE_CLIENT_ID=your_google_client_id_here \
    --build-arg GOOGLE_CLIENT_SECRET=your_google_client_secret_here \
    --build-arg RESEND_API_KEY=dummy \
    -f podman/Containerfile.optimized.v2 \
    -t ai-starter:optimized \
    .

echo "✅ Build completed successfully!"

# Show image sizes
echo "📦 Image sizes:"
podman images | grep ai-starter
