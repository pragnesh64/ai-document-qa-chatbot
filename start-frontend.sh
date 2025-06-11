#!/bin/bash

echo "🎨 Starting Document Q&A Frontend..."

# Navigate to frontend directory
cd frontend

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the frontend
echo "🔥 Starting frontend on http://localhost:3000"
npm run dev 