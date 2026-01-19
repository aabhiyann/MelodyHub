# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built artifacts from the builder stage
COPY --from=builder /app/dist ./dist
# Copy other necessary files (if any, like .env.example or data)
COPY --from=builder /app/src/DataInjection ./src/DataInjection

EXPOSE 5000

CMD ["node", "dist/index.js"]
