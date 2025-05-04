# Supabase Configuration

This directory contains the configuration and setup files for our Supabase integration.

## Directory Structure

- `/sql`: Contains SQL migration files for database setup
  - `dev_001_init_schema.sql`: Initial schema setup for development environment
  - `stage_001_init_schema.sql`: Initial schema setup for staging environment

- `/docs`: Documentation related to Supabase
    - `RLS_POLICY_GUIDE.md`: Comprehensive guide on Row Level Security policies
  - `ENVIRONMENT_SETUP.md`: Guide for managing development, staging, and production environments

- Verification Files:
  - `SEED_VERIFICATION_LESSONS.md`: Documentation of key failures found in seed scripts
  - `data_verification_report.sql`: SQL queries for data verification
  - `data_verification_summary.md`: Summary of data verification findings
  - `exercise_reference_check.sql`: SQL queries for checking exercise references
  - `exercise_reference_findings.md`: Findings from exercise reference checks
  - `verification_script.sql`: Main verification script for data integrity
  - `verification_results.md`: Results from verification script runs
  - `run_verification.js`: Script to run verification SQL and check data integrity
  - `workout_history.sql`: SQL queries for workout history
  - `WORKOUT_HISTORY_VERIFICATION.md`: Verification of workout history data

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

# Reset the database to a clean state (recommended approach for local development)
supabase db reset

# Generate types based on your database schema
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

### Using `supabase db reset` vs `supabase db push`

For local development, we recommend using `supabase db reset` instead of `supabase db push`:

- `supabase db reset` provides a clean slate for testing
- It ensures consistent schema across all developer environments
- It's faster than incremental migrations during rapid development
- Using it with the environment-specific schema files (e.g., `dev_001_init_schema.sql`) ensures proper environment
  defaults

**Note:** Only use this approach in local development. For staging and production environments, use proper migrations
with `supabase db push`.

## Environment Management

We use an environment column approach to manage multiple environments (dev, stage, prod) within our Supabase projects:

- Development and Staging environments share the `formcoach-dev` Supabase project
- Production uses the separate `formcoach` Supabase project
- All tables include an `environment` column to isolate data between environments
- All queries and RLS policies include environment filtering

### Environment Variables

We use `.env` files for local development to store environment-specific configuration. A `.env.example` template is
provided in the repository root.

### Environment Filtering Utility

To ensure consistent environment filtering in all queries, use the provided utility function:

```typescript
import { withEnvironmentFilter } from '@/lib/supabase-utils';

const { data } = await withEnvironmentFilter(
  supabase.from('profiles').select('*')
);
```

For detailed implementation instructions for formcoach-dev and formcoach-stage, see
the [Environment Setup Guide](ENVIRONMENT_SETUP.md).

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
the [RLS Policy Guide](RLS_POLICY_GUIDE.md).

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase GitHub](https://github.com/supabase/supabase)
- [Supabase Discord](https://discord.supabase.com)
