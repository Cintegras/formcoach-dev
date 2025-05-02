#!/bin/bash

echo "🛑 Stopping FormCoach processes..."

# Kill uvicorn (FastAPI backend)
UVICORN_PID=$(pgrep -f "uvicorn main:app")
if [ -n "$UVICORN_PID" ]; then
  echo "🧼 Killing FastAPI backend (PID $UVICORN_PID)..."
  kill $UVICORN_PID
else
  echo "⚠️ No FastAPI (uvicorn) process found."
fi

# Kill React dev server (Vite or CRA)
REACT_PID=$(pgrep -f "npm run dev")
if [ -n "$REACT_PID" ]; then
  echo "🧼 Killing React frontend (PID $REACT_PID)..."
  kill $REACT_PID
else
  echo "⚠️ No React (npm run dev) process found."
fi

echo "✅ Done. All matching processes terminated."