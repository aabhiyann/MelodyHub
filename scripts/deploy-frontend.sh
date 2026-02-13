#!/bin/bash

# Deploy Frontend to Vercel
# Usage: ./scripts/deploy-frontend.sh

echo "🚀 Deploying Frontend to Vercel..."

cd frontend

if [ -z "$VERCEL_TOKEN" ]; then
    echo "⚠️  VERCEL_TOKEN is not set. Assuming local login."
    npx vercel --prod
else
    echo "🔑 VERCEL_TOKEN found. Deploying via token."
    npx vercel --prod --token $VERCEL_TOKEN
fi

echo "✅ Frontend Deployment Triggered."
