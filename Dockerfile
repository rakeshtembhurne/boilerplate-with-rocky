# =============================================================================
# Stage 1: Base image with dependencies
# =============================================================================
FROM node:22-alpine AS base

# Install dependencies for Prisma and native modules
RUN apk add --no-cache openssl && \
    apk add --no-cache -t build-dependencies python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json bun.lock ./

# =============================================================================
# Stage 2: Dependencies installation
# =============================================================================
FROM base AS deps

# Install dependencies
RUN npm ci

# =============================================================================
# Stage 3: Builder
# =============================================================================
FROM base AS builder

# Copy all source files
COPY . .

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Set environment for build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Generate Prisma Client (required before build)
RUN npx prisma generate

# Build Next.js application
# This will also run contentlayer to generate content
RUN npm run build

# =============================================================================
# Stage 4: Runner (Production)
# =============================================================================
FROM base AS runner

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy Prisma files
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Generate Prisma client in production
RUN npx prisma generate

# Change ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
