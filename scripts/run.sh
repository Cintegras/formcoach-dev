#!/bin/bash

echo "🔁 Starting FormCoach..."

# --- BACKEND ---
echo "▶ Starting FastAPI backend..."
cd backend

# Use virtualenv if it exists
if [ -d "venv" ]; then
  source venv/bin/activate
else
  echo "⚠️ No virtual environment found. You may need to run: python3 -m venv venv && source venv/bin/activate"
fi

uvicorn main:app --reload &
BACK_PID=$!

# --- FRONTEND ---
echo "▶ Starting React frontend..."
cd ../frontend

if [ ! -d "node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  npm install
fi

npm run dev &

# Wait for background processes (optional)
wait $BACK_PID