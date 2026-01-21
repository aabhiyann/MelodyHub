FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# Remove test files to avoid build errors
RUN find src -name '*.test.ts' -delete && \
    find src -name '*.test.tsx' -delete && \
    rm -rf src/tests src/__tests__
    # Build - use production config with simplified build (type checking done in CI/CD)
    RUN npx vite build --config vite.config.prod.ts

# Production stage
FROM nginx:alpine

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
