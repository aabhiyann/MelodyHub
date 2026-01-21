# MelodyHub Backend - Production Configuration

## Environment Variables

Create `.env.production` with:

```env
# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/melodyhub

# Server
PORT=5001
NODE_ENV=production

# Redis (optional but recommended)
REDIS_URL=redis://redis-server:6379

# Clerk
CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
ADMIN_EMAIL=admin@melodyhub.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Gemini AI
GEMINI_API_KEY=your_key

# Monitoring (optional)
SENTRY_DSN=https://your-sentry-dsn
```

## Deployment

### Option 1: Railway/Render

```bash
# Build
npm run build

# Start
npm run start
```

### Option 2: Docker

```bash
# Build image
docker build -t melodyhub-api .

# Run container
docker run -p 5001:5001 --env-file .env.production melodyhub-api
```

### Option 3: PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start npm --name "melodyhub-api" -- start

# Save process list
pm2 save

# Setup startup script
pm2 startup
```

## Performance Checklist

- ✅ Redis caching enabled (sub-100ms responses)
- ✅ MongoDB indexes created (11 indexes)
- ✅ Rate limiting enabled (100 req/15min)
- ✅ Compression enabled (Gzip/Brotli)
- ✅ CORS configured (whitelisted origins)
- ✅ Helmet security headers
- ✅ Error handling and logging

## Monitoring

### Health Check
```bash
curl https://api.melodyhub.com/api/health
```

### Cache Stats
```bash
curl https://api.melodyhub.com/api/health/cache
```

### Database Stats
```bash
curl https://api.melodyhub.com/api/health/database
```

## Scaling

### Horizontal Scaling
- Deploy multiple instances behind load balancer
- Shared Redis for distributed caching
- MongoDB replica set for high availability

### Vertical Scaling
- Increase server memory/CPU
- Optimize MongoDB connection pool
- Tune Redis memory limits

## Security

### Rate Limiting
```typescript
// Per IP: 100 requests per 15 minutes
// Per user: 1000 requests per hour
```

### CORS
```typescript
// Whitelist specific origins
allowedOrigins: [
  'https://melodyhub.com',
  'https://www.melodyhub.com',
]
```

### Input Validation
- All request bodies validated
- SQL injection prevention (using MongoDB)
- XSS protection (Helmet)

## Backup Strategy

### MongoDB
```bash
# Daily automated backups
mongodump --uri=$MONGODB_URI --out=/backups/$(date +%Y-%m-%d)
```

### Redis
```bash
# Periodic snapshots (RDB)
# Append-only file (AOF) for durability
```

## Monitoring Alerts

### Critical
- API response time > 1s
- Error rate > 1%
- Database connection issues
- Redis connection issues

### Warning
- API response time > 500ms
- Cache hit rate < 60%
- Memory usage > 80%

## Troubleshooting

### Slow Queries
```bash
# Check MongoDB logs
tail -f /var/log/mongodb/mongodb.log | grep slow

# Enable profiling
db.setProfilingLevel(1, { slowms: 100 })
```

### High Memory Usage
```bash
# Check Redis memory
redis-cli info memory

# Clear cache if needed
redis-cli FLUSHALL
```

### Connection Issues
```bash
# Test MongoDB
mongosh $MONGODB_URI --eval "db.adminCommand('ping')"

# Test Redis
redis-cli ping
```

## Production Ready! ✅
