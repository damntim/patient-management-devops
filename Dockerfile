# Stage 1: Build stage
FROM node:18-alpine AS builder

# Install build tools for native modules
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies (build sqlite3 correctly)
RUN npm install --production

# Copy app code
COPY backend/ ./backend/

# Stage 2: Production stage
FROM node:18-alpine

# Install PHP for frontend
RUN apk add --no-cache php83 php83-session

# Set working directory
WORKDIR /app

# Copy node_modules and backend code from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend ./backend

# Rebuild sqlite3 native module for production environment
RUN cd /app/backend && npm rebuild sqlite3

# Copy frontend and env
COPY frontend/ ./frontend/
COPY .env.example ./.env

# Create directory for database
RUN mkdir -p /app/backend/data

# Expose ports
EXPOSE 3000 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); })"

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'cd /app/backend && node server.js &' >> /app/start.sh && \
    echo 'cd /app/frontend && php -S 0.0.0.0:8000' >> /app/start.sh && \
    chmod +x /app/start.sh

# Start both servers
CMD ["/app/start.sh"]
