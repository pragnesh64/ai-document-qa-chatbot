#!/bin/bash

echo "🚀 Starting Document Q&A Backend..."

# Check if port 5001 is in use
if lsof -ti:5001 > /dev/null; then
    echo "⚠️  Port 5001 is in use. Killing existing process..."
    kill -9 $(lsof -ti:5001)
    sleep 2
fi

# Navigate to backend directory
cd backend

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from env.example..."
    cp env.example .env
    echo "📝 Please edit backend/.env and add your OpenAI API key!"
    echo "OPENAI_API_KEY=sk-your-openai-api-key-here"
    exit 1
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the backend
echo "🔥 Starting backend on http://localhost:5001"
npm run dev 