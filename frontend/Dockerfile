# ===================== FRONTEND - BUILD STAGE =====================
FROM node:18-alpine AS builder
WORKDIR /app

# Accept backend API URL during build
ARG NEXT_PUBLIC_PYTHON_API_URL
ENV NEXT_PUBLIC_PYTHON_API_URL=$NEXT_PUBLIC_PYTHON_API_URL

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .
COPY .env.production ./

# Build Next.js App
RUN npm run build


# ===================== FRONTEND - PRODUCTION STAGE =====================
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# Accept backend URL for runtime
ARG NEXT_PUBLIC_PYTHON_API_URL
ENV NEXT_PUBLIC_PYTHON_API_URL=$NEXT_PUBLIC_PYTHON_API_URL

# Install only production deps
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

# Copy build output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
