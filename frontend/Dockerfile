FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy all files
COPY . .

# Accept build arguments from Railway
ARG NEXT_PUBLIC_API_URL
# Add any other NEXT_PUBLIC_* variables you need

# Set them as environment variables for the build
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Debug - this will show in Railway build logs
RUN echo "🔨 Building with NEXT_PUBLIC_API_URL: $NEXT_PUBLIC_API_URL"

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]