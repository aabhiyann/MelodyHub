#!/bin/bash
set -e

echo "🧪 Running local test suite..."

# Backend tests
echo "Testing backend..."
cd backend
npm test
cd ..

# Frontend tests
echo "Testing frontend..."
cd frontend
npm test -- --run
cd ..

echo "✅ All tests passed!"
