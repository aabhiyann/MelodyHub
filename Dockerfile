# Build Stage for Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Build Stage for Backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
# Assuming backend has a build script, if not we just run ts-node or similar. 
# But for production we should compile TS.
# Let's check package.json first, but standard practice is tsc.
# Just in case, I'll install typescript globally or ensure it's in devDeps.
RUN npm run build 

# Production Stage
FROM node:20-alpine
WORKDIR /app

# Copy Backend Build
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/package*.json ./backend/
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules

# Copy Frontend Build (Served by Backend or Nginx? usually MERN serves static files from backend in simple setups)
# In index.ts we saw: app.use(express.static(path.join(__dirname, "../frontend/dist")));
# So we need to put frontend/dist relative to backend/dist correctly.
# Structure in container:
# /app/backend/dist/index.js
# /app/frontend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

WORKDIR /app/backend
ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "dist/index.js"]
