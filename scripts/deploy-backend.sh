#!/bin/bash

# Deploy Backend to Render
# Usage: ./scripts/deploy-backend.sh

echo "🚀 Deploying Backend to Render..."

if [ -z "$RENDER_SERVICE_ID" ] || [ -z "$RENDER_API_KEY" ]; then
    if [ -z "$RENDER_DEPLOY_HOOK" ]; then
        echo "❌ Error: RENDER_SERVICE_ID and RENDER_API_KEY are not set."
        echo "   Alternatively, set RENDER_DEPLOY_HOOK."
        exit 1
    else
        echo "🪝 Using Deploy Hook..."
        curl -X POST "$RENDER_DEPLOY_HOOK"
    fi
else
    echo "🔑 Using Render API..."
    curl "https://api.render.com/v1/services/$RENDER_SERVICE_ID/deploys" \
    --header "Authorization: Bearer $RENDER_API_KEY" \
    --header "Content-Type: application/json" \
    --data '{"clearCache": "do_not_clear"}'
fi

echo -e "\n✅ Backend Deployment Triggered."
