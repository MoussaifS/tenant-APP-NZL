#!/bin/bash

echo "🔍 Testing Frontend-Backend Connection"
echo "======================================"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    echo "Please create .env.local from env.example"
    exit 1
fi

echo "✅ .env.local file found"

# Check environment variables
echo ""
echo "📋 Environment Configuration:"
echo "-----------------------------"
source .env.local
echo "Backend URL: $NEXT_PUBLIC_STRAPI_URL"
echo "API Base Path: $NEXT_PUBLIC_API_BASE_PATH"
echo "Debug Mode: $NEXT_PUBLIC_DEBUG_MODE"
echo "API Timeout: $NEXT_PUBLIC_API_TIMEOUT"

# Test backend connection
echo ""
echo "🔗 Testing Backend Connection..."
echo "-------------------------------"

BACKEND_URL="$NEXT_PUBLIC_STRAPI_URL$NEXT_PUBLIC_API_BASE_PATH/units?pagination%5BpageSize%5D=1"

if curl -s --max-time 10 "$BACKEND_URL" > /dev/null; then
    echo "✅ Backend is reachable at: $NEXT_PUBLIC_STRAPI_URL"
    echo "✅ API endpoint responding: $BACKEND_URL"
else
    echo "❌ Backend connection failed!"
    echo "❌ Make sure the Strapi backend is running on port 1337"
    echo "❌ Check if CORS is properly configured"
fi

echo ""
echo "🚀 Next Steps:"
echo "1. Start the backend: cd ../BE-Tenant-app && npm run develop"
echo "2. Start the frontend: npm run dev"
echo "3. Open http://localhost:3000 in your browser"
