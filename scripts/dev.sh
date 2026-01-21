#!/bin/bash
set -e

echo "🚀 Starting MelodyHub development environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker."
    exit 1
fi

# Build and start services
docker-compose up --build -d

echo "✅ Services started!"
echo ""
echo "📊 Frontend: http://localhost:80"
echo "🔧 Backend:  http://localhost:5000"
echo ""
echo "📝 View logs: docker-compose logs -f"
echo "🛑 Stop:     docker-compose down"
