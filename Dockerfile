# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source files
COPY . .

# Build argument para variables de entorno
ARG PUBLIC_BACKEND_URL
ARG PUBLIC_OPPWA_URL

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port
EXPOSE 4321

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4321', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Start the server
CMD ["node", "./dist/server/entry.mjs"]