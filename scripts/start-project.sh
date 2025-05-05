#!/bin/bash

echo "🔁 Starting FormCoach..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Start local Supabase (optional)
echo "🔄 Do you want to start a local Supabase instance? (y/n)"
read -r use_local_supabase

if [ "$use_local_supabase" = "y" ] || [ "$use_local_supabase" = "Y" ]; then
    echo "▶ Starting local Supabase..."
    supabase start
    
    # Execute SQL scripts to set up the database
    echo "▶ Setting up the database..."
    node scripts/execute-sql.js
    
    echo "✅ Local Supabase is running!"
else
    echo "ℹ️ Using remote Supabase instance as configured in .env"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the Vite development server
echo "▶ Starting Vite development server..."
npm run dev

# Note: The script will hang here until the dev server is stopped with Ctrl+C