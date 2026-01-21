# MelodyHub API - Quick Reference

## 🚀 Getting Started

### Start Server
```bash
cd backend
npm install
npm run dev
```

Server: `http://localhost:5001`  
API Docs: `http://localhost:5001/api-docs`

---

## 📚 API Endpoints

### **Discovery**
```
GET /api/songs/featured          - Curated featured tracks (1h cache)
GET /api/songs/trending           - Trending songs (15min cache)
   ?period=24h|7d|30d             - Trending period
GET /api/songs/made-for-you       - AI personalized (6h cache)
GET /api/songs/new-releases       - Latest uploads (30min cache)
GET /api/songs/genres/:genre      - Genre-specific (30min cache)
```

### **Analytics**
```
POST /api/analytics/track-play    - Track song plays
POST /api/analytics/like-song     - Like/unlike songs
GET  /api/analytics/user-preferences - Get user stats
```

### **Health & Monitoring**
```
GET /api/health                   - Server health status
GET /api/health/cache             - Redis statistics
GET /api/health/database          - MongoDB statistics
```

---

## 🎯 Response Format

**Success:**
```json
{
  "success": true,
  "data": [...],
  "count": 20,
  "algorithm": "hybrid",
  "confidence": 0.85,
  "cached": false
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error"
}
```

---

## 🤖 AI Algorithms

**Collaborative Filtering**
- Finds similar users via Jaccard similarity
- Recommends songs liked by similar users
- Confidence: 0.65

**Content-Based Filtering**
- Matches audio features (tempo, energy, danceability, valence)
- Uses Cosine similarity
- Confidence: 0.7

**Hybrid (Best)**
- 60% collaborative + 40% content-based
- Adaptive based on user data
- Confidence: 0.85

**Cold Start**
- Popular songs for new users
- Confidence: 0.4

---

## ⚡ Caching Strategy

| Endpoint | TTL | Type |
|----------|-----|------|
| Featured | 1 hour | Global |
| Trending | 15 minutes | Period-based |
| Made-for-you | 6 hours | User-specific |
| New releases | 30 minutes | Global |
| Genre songs | 30 minutes | Genre-based |

**Cache Headers:**
```json
{
  "_meta": {
    "cached": true,
    "key": "cache:songs:featured",
    "ttl": 3456
  }
}
```

---

## 🧪 Testing

### Run Tests
```bash
npm test                    # All tests
npm run test:unit           # Unit tests only
npm run test:integration    # Integration tests
npm run test:load           # Load testing
```

### Load Testing
```bash
cd backend/src/__tests__
ts-node load.test.ts
```

**Metrics:**
- 1000+ requests
- 50 concurrent users
- Performance assessment
- Success rate tracking

---

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:5001/api/health
```

**Response:**
- MongoDB status + response time
- Redis status + key count
- Memory usage
- Uptime
- Service health (healthy/degraded/unhealthy)

### Cache Stats
```bash
curl http://localhost:5001/api/health/cache
```

**Response:**
- Connected status
- Key count
- Memory usage

### Database Stats
```bash
curl http://localhost:5001/api/health/database
```

**Response:**
- Song count
- User preference count
- Recommendation count

---

## 🔐 Authentication

Most endpoints require Clerk authentication:

```javascript
fetch('/api/songs/made-for-you', {
  headers: {
    'Authorization': 'Bearer YOUR_CLERK_TOKEN'
  }
})
```

---

## 🎨 Example Usage

### Get Personalized Recommendations
```javascript
const response = await fetch('/api/songs/made-for-you?limit=20');
const data = await response.json();

console.log(data.algorithm);    // "hybrid"
console.log(data.confidence);   // 0.85
console.log(data.cached);       // false
console.log(data.data);         //array of songs
```

### Track a Play
```javascript
await fetch('/api/analytics/track-play', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer TOKEN'
  },
  body: JSON.stringify({
    songId: '507f1f77bcf86cd799439011',
    completionRate: 0.95,
    skipped: false
  })
});
```

### Like a Song
```javascript
await fetch('/api/analytics/like-song', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer TOKEN'
  },
  body: JSON.stringify({
    songId: '507f1f77bcf86cd799439011',
    liked: true
  })
});
```

---

## 🚀 Production Deployment

See [PRODUCTION.md](./PRODUCTION.md) for complete deployment guide.

**Quick Start:**
```bash
npm run build
npm start
```

**With PM2:**
```bash
pm2 start npm --name "melodyhub-api" -- start
```

---

## 📚 Full Documentation

**Swagger UI:** `http://localhost:5001/api-docs`  
**Production Guide:** `./PRODUCTION.md`  
**Architecture:** See walkthrough artifact

---

**MelodyHub API - World-Class Music Streaming** 🎵
