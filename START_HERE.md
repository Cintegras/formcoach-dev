# FormCoach - Getting Started Guide

This guide will help you set up and run the FormCoach application on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (optional, for local development)

## Environment Setup

The project includes a `.env` file with the necessary environment variables:

- `VITE_FORMCOACH_ENV`: The current environment (dev, stage, or prod)
- `VITE_SUPABASE_URL_DEV`: The URL of your development Supabase instance
- `VITE_SUPABASE_KEY_DEV`: The anon key for your development Supabase instance
- `VITE_SUPABASE_URL_PROD`: The URL of your production Supabase instance
- `VITE_SUPABASE_KEY_PROD`: The anon key for your production Supabase instance

These variables are already set up in the `.env` file, so you don't need to modify them unless you want to use your own
Supabase instance.

## Starting the Application

### Option 1: Using the Start Script (Recommended)

We've created a start script that handles everything for you:

1. Open a terminal in the project root directory
2. Run the start script:
   ```bash
   ./scripts/start-project.sh
   ```
3. Follow the prompts to choose whether to use a local Supabase instance or the remote one
4. The script will:
    - Start Supabase locally (if you chose to)
    - Install dependencies (if needed)
    - Start the Vite development server

### Option 2: Manual Setup

If you prefer to set things up manually:

1. Install dependencies:
   ```bash
   npm install
   ```

2. (Optional) Start a local Supabase instance:
   ```bash
   supabase start
   node scripts/execute-sql.js
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Accessing the Application

Once the development server is running, you can access the application at:

- **URL**: [http://localhost:5173](http://localhost:5173)

## Development Workflow

- The application uses Vite for fast development and hot module replacement
- Changes to your code will be reflected immediately in the browser
- The project is connected to Supabase for backend functionality
- React hooks in the `src/hooks` directory provide easy access to Supabase data

## Stopping the Application

To stop the application:

1. Press `Ctrl+C` in the terminal where the development server is running
2. If you started a local Supabase instance, stop it with:
   ```bash
   supabase stop
   ```

## Troubleshooting

If you encounter any issues:

1. Make sure all environment variables are correctly set in the `.env` file
2. Check that you have the correct versions of Node.js and npm installed
3. If using a local Supabase instance, ensure the Supabase CLI is installed and working
4. Check the terminal output for any error messages

## Next Steps

Now that you have the application running, you can:

1. Explore the codebase to understand how it works
2. Make changes to the code and see them reflected in real-time
3. Use the React hooks in `src/hooks` to interact with the Supabase database
4. Build new features or fix bugs as needed

Happy coding!