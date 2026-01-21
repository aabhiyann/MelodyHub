# MelodyHub - Production Deployment Guide

## 🚀 Pre-Deployment Checklist

### 1. Code Review
- [x] All TypeScript errors resolved
- [x] Lint warnings acceptable
- [x] No console.log statements in production code
- [x] All imports used
- [x] Accessibility compliance verified

### 2. Testing
```bash
# Run tests
npm test

# Type check
npm run typecheck

# Build for production
npm run build

# Preview production build
npm run preview
```

### 3. Performance Audit
```bash
# Lighthouse audit
lighthouse http://localhost:5173 --output html --output-path ./lighthouse-report.html

# Bundle analysis
npm run build:analyze
# Open dist/stats.html
```

### 4. Accessibility Audit
```bash
# Automated accessibility testing
npm test -- a11y.test.tsx

# Manual keyboard navigation test
# Tab through all interactive elements
# Ensure focus indicators visible
# Test screen reader (NVDA/JAWS/VoiceOver)
```

---

## 📦 Build & Deploy

### Production Build
```bash
# Clean previous builds
rm -rf dist

# Build with optimizations
npm run build

# Check bundle sizes
ls -lh dist/assets/
```

**Expected Output:**
- Main bundle: <200KB (gzipped)
- Vendor chunks: 7 separate files
- Total: <1MB

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy to Netlify
```bash
# Build command: npm run build
# Publish directory: dist
netlify deploy --prod
```

---

## 🔧 Environment Variables

Create `.env.production`:
```env
VITE_API_URL=https://api.melodyhub.com
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
```

---

## ✅ Post-Deployment Verification

### 1. Functionality Test
- [ ] Landing page loads
- [ ] Sidebar navigation works
- [ ] Player controls functional
- [ ] PWA installs correctly
- [ ] Mobile responsive
- [ ] Mascot appears contextually

### 2. Performance Metrics
- [ ] Lighthouse score >95
- [ ] LCP <2.5s
- [ ] FID <100ms
- [ ] CLS <0.1

### 3. PWA Test
- [ ] Manifest loads
- [ ] Service worker registers
- [ ] Offline mode works
- [ ] Install prompt shows
- [ ] Icons display correctly

---

## 🐛 Rollback Plan

If issues arise:
```bash
# Revert to previous commit
git revert HEAD

# Or reset to specific commit
git reset --hard <commit-sha>

# Redeploy
vercel --prod
```

---

## 📊 Monitoring

### Web Vitals
Track metrics at `/api/vitals` endpoint:
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)
- FCP (First Contentful Paint)
- TTFB (Time to First Byte)

### Error Tracking
Consider adding:
- Sentry for error monitoring
- PostHog for analytics
- LogRocket for session replay

---

## 🎉 Success Criteria

**Deployment is successful when:**
- ✅ Lighthouse score >95
- ✅ No console errors
- ✅ All features functional
- ✅ PWA installs correctly
- ✅ Mobile responsive
- ✅ Accessibility score 100

**Ready for production!** 🚀
