# Multi-stage build for production
FROM node:18-alpine AS builder

# Build frontend
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Build backend
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN npm run build

# Production image
FROM node:18-alpine AS production

WORKDIR /app

# Copy backend build and dependencies
COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/server/package*.json ./
RUN npm ci --only=production

# Copy credentials file (must be provided at build time)
COPY client_secret.json ./

# Copy frontend build
COPY --from=builder /app/client/dist ./public

# Serve frontend files
RUN npm install express-static

EXPOSE 3001

CMD ["node", "dist/index.js"]