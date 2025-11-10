# ------------ 1️⃣ Build stage ------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Add flag to skip DB fetch during build
ENV SKIP_BUILD_STATIC_GENERATION=true

# Build the Next.js app (includes Tailwind CSS build)
RUN npm run build


# ------------ 2️⃣ Production runner stage ------------
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV SKIP_BUILD_STATIC_GENERATION=false

# Copy only what's needed from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./next.config.js

# ✅ FIX: copy correct PostCSS config (Next.js uses .mjs by default)
COPY --from=builder /app/postcss.config.mjs ./postcss.config.mjs

# Expose Next.js default port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]