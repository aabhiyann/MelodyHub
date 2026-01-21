## MelodyHub - Deployment Checklist

### Prerequisites
- [ ] All tests passing locally
- [ ] Docker images build successfully
- [ ] Environment variables documented
- [ ] API keys secured

### Vercel (Frontend)
- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Environment variables set:
  - `VITE_CLERK_PUBLISHABLE_KEY`
  - `VITE_API_URL` (production backend URL)
  - `VITE_ENABLE_AI_FEATURES=true`
  - `VITE_ENABLE_CHAT=true`
- [ ] Build settings verified (npm run build)
- [ ] Deploy and test

### Render (Backend)
- [ ] Render account created
- [ ] Web service created
- [ ] Environment variables set:
  - `MONGODB_URI`
  - `CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
  - `GEMINI_API_KEY`
  - `ADMIN_EMAIL`
  - `NODE_ENV=production`
- [ ] Deploy and test

### Post-Deployment
- [ ] Frontend connects to backend
- [ ] Authentication works
- [ ] File uploads work (Cloudinary)
- [ ] AI features work (Gemini)
- [ ] Chat/WebSocket works
- [ ] Health check endpoints responding
- [ ] Monitor logs for errors

### GitHub Actions
- [ ] Secrets configured:
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`
  - `RENDER_PRODUCTION_DEPLOY_HOOK`
- [ ] CI/CD pipeline running
- [ ] Auto-deployment on push to main

### Documentation
- [ ] README updated with live URLs
- [ ] API documentation accessible
- [ ] Environment setup guide complete
