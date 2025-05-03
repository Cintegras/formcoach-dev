# Supabase Configuration

This directory contains the configuration and setup files for our Supabase integration.

## Directory Structure

- `/sql`: Contains SQL migration files for database setup
    - `001_init_schema.sql`: Initial schema setup with core tables
    - `002_profiles_table.sql`: Creates and configures the profiles table
    - `003_rls_profiles.sql`: Sets up Row Level Security policies for the profiles table

- `/docs`: Documentation related to Supabase
    - `RLS_POLICY_GUIDE.md`: Comprehensive guide on Row Level Security policies
  - `ENVIRONMENT_SETUP.md`: Guide for managing development, staging, and production environments

## Getting Started

1. Install the Supabase CLI: https://supabase.com/docs/guides/cli
2. Initialize Supabase in your project: `supabase init`
3. Start the local Supabase instance: `supabase start`
4. Apply migrations: `supabase db push`

## Local Development

When developing locally:

```bash
# Start Supabase services
supabase start

# Stop Supabase services
supabase stop

# Reset the database to a clean state
supabase db reset

# Generate types based on your database schema
supabase gen types typescript --local > src/types/supabase.ts
```

## Environment Management

We use an environment column approach to manage multiple environments (dev, stage, prod) within our Supabase projects:

- Development and Staging environments share the `formcoach-dev` Supabase project
- Production uses the separate `formcoach` Supabase project
- All tables include an `environment` column to isolate data between environments
- All queries and RLS policies include environment filtering

For detailed implementation instructions for formcoach-dev and formcoach-stage, see
the [Environment Setup Guide](docs/ENVIRONMENT_SETUP.md).

## Migrations

To create a new migration:

```bash
# Create a new migration file
supabase migration new my_migration_name

# Apply all pending migrations
supabase db push
```

## Authentication

This project uses Supabase Auth for user authentication. The profiles table is linked to the auth.users table via RLS
policies.

See the [Supabase Auth documentation](https://supabase.com/docs/guides/auth) for more details.

## Row Level Security

We use Row Level Security (RLS) to control access to data in our tables. For more information, see
the [RLS Policy Guide](docs/RLS_POLICY_GUIDE.md).

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase GitHub](https://github.com/supabase/supabase)
- [Supabase Discord](https://discord.supabase.com)
