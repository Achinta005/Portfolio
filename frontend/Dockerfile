# ========== FRONTEND - BUILD STAGE ==========
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build Next.js App
RUN npm run build

# ========== FRONTEND - PRODUCTION STAGE ==========
FROM node:18-alpine
WORKDIR /app

ENV NODE_ENV=production

# Copy only necessary build artifacts
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose Next.js port
EXPOSE 3000
CMD ["npm", "start"]