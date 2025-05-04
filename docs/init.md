# FormCoach Initialization Guide

## 📌 Overview

FormCoach is a fitness tracking and workout planning application that helps users track their exercise progress, create
workout plans, and log their workout sessions. This initialization guide provides essential information for developers
and AI assistants to work confidently with the FormCoach codebase.

This document covers environment setup, Supabase integration, codebase organization, seed script usage, and common
pitfalls to avoid when working with the FormCoach project.

## 🌍 Environments

FormCoach uses three distinct environments, each with its own configuration:

| Environment | Color Code | PyCharm Project   | Value in `.env` | Supabase Project | Environment Column | Purpose                               |
|-------------|------------|-------------------|-----------------|------------------|--------------------|---------------------------------------|
| Development | 🟢         | `formcoach-dev`   | `dev`           | `formcoach-dev`  | `dev`              | Local development and testing         |
| Staging     | 🟡         | `formcoach-stage` | `stage`         | `formcoach-dev`  | `stage`            | Pre-production testing and validation |
| Production  | 🔴         | `formcoach`       | `prod`          | `formcoach`      | `prod`             | Live production environment           |

### Environment Selection Logic

The current environment is determined by the `VITE_FORMCOACH_ENV` environment variable, which is read by the
`getEnvironment()` function in `src/lib/environment.ts`:

```typescript
export const getEnvironment = (): string => {
    return import.meta.env.VITE_FORMCOACH_ENV || 'dev';
};
```

If the environment variable is not set, it defaults to `'dev'`.

### PyCharm Project Structure

FormCoach uses three separate PyCharm projects, one for each environment:

- 🟢 **formcoach-dev**: Used for development environment
- 🟡 **formcoach-stage**: Used for staging environment
- 🔴 **formcoach**: Used for production environment

Each PyCharm project has its own `.env` file that configures the environment and Supabase connection.

### Environment Configuration

#### 🟢 Development Environment Setup

1. Open the `formcoach-dev` PyCharm project
2. Copy `.env.example` to `.env` in the project root
3. Set `VITE_FORMCOACH_ENV=dev` in the `.env` file
4. Configure the Supabase URLs and keys for both development and production

Example `.env` file for development:

```
VITE_FORMCOACH_ENV=dev

VITE_SUPABASE_URL_DEV=https://gfaqeouktaxibmyzfnwr.supabase.co
VITE_SUPABASE_KEY_DEV=your_supabase_anon_key_for_dev

VITE_SUPABASE_URL_PROD=https://hqmavplgoosxhzahdfzn.supabase.co
VITE_SUPABASE_KEY_PROD=your_supabase_anon_key_for_prod
```

#### 🟡 Staging Environment Setup

1. Open the `formcoach-stage` PyCharm project
2. Copy `.env.example` to `.env` in the project root
3. Set `VITE_FORMCOACH_ENV=stage` in the `.env` file
4. Configure the Supabase URLs and keys for both development and production

Example `.env` file for staging:

```
VITE_FORMCOACH_ENV=stage

VITE_SUPABASE_URL_DEV=https://gfaqeouktaxibmyzfnwr.supabase.co
VITE_SUPABASE_KEY_DEV=your_supabase_anon_key_for_dev

VITE_SUPABASE_URL_PROD=https://hqmavplgoosxhzahdfzn.supabase.co
VITE_SUPABASE_KEY_PROD=your_supabase_anon_key_for_prod
```

#### 🔴 Production Environment Setup

1. Open the `formcoach` PyCharm project
2. Copy `.env.example` to `.env` in the project root
3. Set `VITE_FORMCOACH_ENV=prod` in the `.env` file
4. Configure the Supabase URLs and keys for both development and production

Example `.env` file for production:

```
VITE_FORMCOACH_ENV=prod

VITE_SUPABASE_URL_DEV=https://gfaqeouktaxibmyzfnwr.supabase.co
VITE_SUPABASE_KEY_DEV=your_supabase_anon_key_for_dev

VITE_SUPABASE_URL_PROD=https://hqmavplgoosxhzahdfzn.supabase.co
VITE_SUPABASE_KEY_PROD=your_supabase_anon_key_for_prod
```

## 🔐 Supabase Scoping

### Project Organization

FormCoach uses two Supabase projects:

- 🟢🟡 `formcoach-dev`: Hosts both development and staging environments
- 🔴 `formcoach`: Hosts the production environment

### Environment Filtering and Cross-Contamination Prevention

To prevent cross-environment data contamination, FormCoach uses an environment column approach:

1. All tables include an `environment` column (`dev`, `stage`, or `prod`)
2. All queries must include environment filtering
3. Row Level Security (RLS) policies include environment filtering

This approach is critical because:

- 🟢 **Development** and 🟡 **Staging** environments share the same Supabase project (`formcoach-dev`)
- Without proper environment filtering, data from one environment could leak into another
- Scripts and queries that don't respect the environment value can cause cross-environment contamination
- The seed script includes checks to ensure it's running in the correct environment

#### Cross-Contamination Prevention Checklist

When working with FormCoach, always:

- ✅ Use the correct PyCharm project for your target environment
- ✅ Verify the `VITE_FORMCOACH_ENV` value in your `.env` file
- ✅ Use the `withEnvironmentFilter()` utility for all database queries
- ✅ Include the `environment` column in all database inserts
- ✅ Check that RLS policies include environment filtering
- ✅ Run verification scripts to confirm data integrity

### Environment Filtering Utility

The `withEnvironmentFilter` utility function in `src/lib/supabase-utils.ts` ensures consistent environment filtering:

```typescript
export const withEnvironmentFilter = <T>(
    query: PostgrestFilterBuilder<any, any, T[]>
): PostgrestFilterBuilder<any, any, T[]> => {
    const ENV = getEnvironment();
    return query.eq('environment', ENV);
};
```

Usage example:

```typescript
import {withEnvironmentFilter} from '@/lib/supabase-utils';

const {data} = await withEnvironmentFilter(
    supabase.from('profiles').select('*')
);
```

### Supabase Client Configuration

The Supabase client in `src/integrations/supabase/client.ts` selects the appropriate URL and key based on the current
environment:

```typescript
const ENV = getEnvironment();

const SUPABASE_URL = ENV === 'prod'
    ? import.meta.env.VITE_SUPABASE_URL_PROD
    : import.meta.env.VITE_SUPABASE_URL_DEV;

const SUPABASE_KEY = ENV === 'prod'
    ? import.meta.env.VITE_SUPABASE_KEY_PROD
    : import.meta.env.VITE_SUPABASE_KEY_DEV;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);
```

Note that both `dev` and `stage` environments use the development Supabase URL and key.

## 📁 Directory Layout

The FormCoach project is organized into three separate PyCharm projects, each with a similar structure:

### 🟢 formcoach-dev (Development)

```
formcoach-dev/
├── docs/                      # Documentation
│   ├── PyCharm/               # PyCharm-specific documentation
│   ├── supabase/              # Supabase-specific documentation
│   │   ├── sql/               # SQL migration files
│   │   └── ...                # Verification scripts and documentation
│   └── ...                    # Other documentation
├── scripts/                   # Utility scripts
│   ├── seed-dev.ts            # Development environment seed script
│   └── ...                    # Other utility scripts
├── src/                       # Source code
│   ├── integrations/          # External integrations
│   │   ├── supabase/          # Supabase integration
│   │   │   ├── client.ts      # Supabase client configuration
│   │   │   └── types.ts       # TypeScript types for Supabase
│   │   └── ...                # Other integrations
│   ├── lib/                   # Utility libraries
│   │   ├── environment.ts     # Environment configuration
│   │   ├── supabase-utils.ts  # Supabase utility functions
│   │   └── ...                # Other utility functions
│   └── ...                    # Application code
├── supabase/                  # Supabase configuration
│   ├── config.toml            # Supabase configuration
│   └── ...                    # Other Supabase configuration files
├── .env                       # Environment variables (not in version control)
├── .env.example               # Example environment variables
└── ...                        # Other project files
```

### 🟡 formcoach-stage (Staging)

```
formcoach-stage/
├── docs/                      # Documentation
│   ├── PyCharm/               # PyCharm-specific documentation
│   ├── supabase/              # Supabase-specific documentation
│   │   ├── sql/               # SQL migration files
│   │   └── ...                # Verification scripts and documentation
│   └── ...                    # Other documentation
├── scripts/                   # Utility scripts
│   ├── seed-stage.ts          # Staging environment seed script (planned, not yet implemented)
│   └── ...                    # Other utility scripts
├── src/                       # Source code
│   ├── integrations/          # External integrations
│   │   ├── supabase/          # Supabase integration
│   │   │   ├── client.ts      # Supabase client configuration
│   │   │   └── types.ts       # TypeScript types for Supabase
│   │   └── ...                # Other integrations
│   ├── lib/                   # Utility libraries
│   │   ├── environment.ts     # Environment configuration
│   │   ├── supabase-utils.ts  # Supabase utility functions
│   │   └── ...                # Other utility functions
│   └── ...                    # Application code
├── supabase/                  # Supabase configuration
│   ├── config.toml            # Supabase configuration
│   └── ...                    # Other Supabase configuration files
├── .env                       # Environment variables (not in version control)
├── .env.example               # Example environment variables
└── ...                        # Other project files
```

### 🔴 formcoach (Production)

```
formcoach/
├── docs/                      # Documentation
│   ├── PyCharm/               # PyCharm-specific documentation
│   ├── supabase/              # Supabase-specific documentation
│   │   ├── sql/               # SQL migration files
│   │   └── ...                # Verification scripts and documentation
│   └── ...                    # Other documentation
├── scripts/                   # Utility scripts
│   └── ...                    # Utility scripts
├── src/                       # Source code
│   ├── integrations/          # External integrations
│   │   ├── supabase/          # Supabase integration
│   │   │   ├── client.ts      # Supabase client configuration
│   │   │   └── types.ts       # TypeScript types for Supabase
│   │   └── ...                # Other integrations
│   ├── lib/                   # Utility libraries
│   │   ├── environment.ts     # Environment configuration
│   │   ├── supabase-utils.ts  # Supabase utility functions
│   │   └── ...                # Other utility functions
│   └── ...                    # Application code
├── supabase/                  # Supabase configuration
│   ├── config.toml            # Supabase configuration
│   └── ...                    # Other Supabase configuration files
├── .env                       # Environment variables (not in version control)
├── .env.example               # Example environment variables
└── ...                        # Other project files
```

## 🧪 Seed Script Usage

FormCoach includes a seed script for populating the development environment with test data.

### Running the Seed Script

To run the seed script for the development environment:

```bash
npx ts-node scripts/seed-dev.ts
```

This script:

1. Creates a mock user profile
2. Creates sample exercises
3. Creates a workout plan with the exercises
4. Creates a workout session with exercise logs

### Verifying Seed Success

The seed script includes verification steps to ensure that data was created successfully:

1. After creating exercises, it verifies that all exercises were created
2. After adding exercises to a workout plan, it verifies that all exercises were added
3. After creating exercise logs, it verifies that all logs were created

You can also run verification SQL scripts to check data integrity:

```bash
# Navigate to the Supabase documentation directory
cd docs/supabase

# Run the verification script
node run_verification.js
```

Alternatively, you can run the SQL verification scripts directly in the Supabase SQL editor:

- `docs/supabase/data_verification_report.sql`: Comprehensive data verification
- `docs/supabase/exercise_reference_check.sql`: Checks for exercise references

## ⚠️ Gotchas

### PyCharm Project Mismatches

- **Issue**: Using the wrong PyCharm project for your target environment can lead to configuration errors.
- **Solution**: Always use 🟢 `formcoach-dev` for development, 🟡 `formcoach-stage` for staging, and 🔴 `formcoach` for
  production.

### Environment Mismatches

- **Issue**: Running queries without environment filtering can lead to cross-environment data contamination.
- **Solution**: Always use the `withEnvironmentFilter` utility function for database queries.

### Supabase Project Selection

- **Issue**: Both 🟢 `dev` and 🟡 `stage` environments use the same Supabase project (`formcoach-dev`).
- **Solution**: Be careful when working with the staging environment, as it shares the same database as development.

### Environment Variable Configuration

- **Issue**: Incorrect environment variable settings in `.env` files can cause data to be written to the wrong
  environment.
- **Solution**: Double-check that `VITE_FORMCOACH_ENV` is set correctly for each PyCharm project.

### Seed Script Environment Check

- **Issue**: Running the seed script in non-development environments can lead to unexpected data.
- **Solution**: The seed script includes a check to ensure it's running in the `dev` environment. If not, it will prompt
  for confirmation before proceeding.

### Missing Environment Column

- **Issue**: Forgetting to include the `environment` field when inserting data can lead to data being inaccessible.
- **Solution**: Always include the `environment` field set to the current environment value when inserting data.

### Cross-Environment Data Leakage

- **Issue**: Queries without proper environment filtering can return data from multiple environments.
- **Solution**: Always use the `withEnvironmentFilter` utility function and verify that RLS policies include environment
  filtering.

### Async Operations in Seed Scripts

- **Issue**: Seed scripts use async/await patterns extensively, and improper handling can lead to race conditions.
- **Solution**: Ensure proper async/await usage and consider using sequential operations for dependent data.

## ✨ Extras

### Local Supabase Development

For local development with Supabase:

1. Install the Supabase CLI: `npm install -g supabase`
2. Start the local Supabase instance: `supabase start`
3. Reset the database to a clean state: `supabase db reset`
4. Generate TypeScript types: `supabase gen types typescript --local > src/integrations/supabase/types.ts`

### Database Schema Verification

To verify the database schema:

1. Check the SQL migration files in `docs/supabase/sql/`
2. Run the verification scripts in `docs/supabase/`
3. Use the Supabase dashboard to inspect the database schema

### Row Level Security (RLS)

FormCoach uses Row Level Security (RLS) to control access to data:

1. All tables have RLS policies that include environment filtering
2. The profiles table is linked to the auth.users table via RLS policies
3. See `docs/supabase/RLS_POLICY_GUIDE.md` for more details

### TypeScript Integration

FormCoach uses TypeScript for type safety:

1. Supabase types are generated from the database schema
2. The `Database` type in `src/integrations/supabase/types.ts` provides type safety for Supabase queries
3. Use the generated types for better IDE support and type checking

## ⚠️ Risks & Warnings

### Environment Contamination Risks

The FormCoach project structure with shared Supabase projects presents several risks:

| Risk                                        | Description                                                                      | Mitigation                                                                       |
|---------------------------------------------|----------------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| 🟢🟡 **Cross-Environment Data Leakage**     | Data from development environment could appear in staging queries and vice versa | Always use `withEnvironmentFilter()` and verify environment column in all tables |
| 🟢🟡 **Shared Database Resources**          | Development and staging share database connections, rate limits, and storage     | Monitor resource usage and implement rate limiting in development environment    |
| 🟡🔴 **Inconsistent Schema**                | Schema differences between environments can cause unexpected behavior            | Use migration scripts to keep schemas in sync across all environments            |
| 🟢🟡🔴 **Environment Configuration Errors** | Using the wrong PyCharm project or incorrect `.env` settings                     | Double-check PyCharm project and environment variables before running scripts    |
| 🟢🟡 **RLS Policy Conflicts**               | RLS policies might not properly isolate environments                             | Ensure all RLS policies include environment filtering                            |

### Critical Warnings

1. ⛔ **NEVER** run seed scripts in the production environment
2. ⛔ **NEVER** manually modify the environment column in the database
3. ⛔ **NEVER** use direct SQL queries without environment filtering
4. ⛔ **NEVER** copy `.env` files between PyCharm projects without updating the environment value
5. ⛔ **NEVER** deploy code that doesn't use the `withEnvironmentFilter()` utility

### Best Practices

1. ✅ Always use the correct PyCharm project for your target environment
2. ✅ Verify environment settings before running scripts or deploying code
3. ✅ Run verification scripts regularly to check for data integrity
4. ✅ Use the environment-specific seed scripts for each environment
5. ✅ Include environment filtering in all database operations
6. ✅ Test queries in development before running them in staging or production

## 📝 Documentation Standards

When working with the FormCoach codebase, follow these documentation standards to ensure clarity and consistency:

### Command and Script Documentation

For any new command or script:

1. **Purpose**: Clearly document what the command or script does
2. **Environment Relevance**: Specify which environments the command or script is intended for
3. **Location**: Document where the command or script is located in the codebase
4. **Usage**: Provide examples of how to use the command or script
5. **Expected Output**: Describe what the command or script should output when successful
6. **Troubleshooting**: Include common issues and their solutions

Example:

```
## Running the Seed Script

The seed script populates the database with test data for development purposes.

**Environment**: 🟢 Development only
**Location**: `scripts/seed-dev.ts`
**Usage**: `npx ts-node scripts/seed-dev.ts`
**Expected Output**: Console logs indicating successful creation of test data
**Troubleshooting**: If you encounter "duplicate key" errors, the data may already exist
```

### When to Update Documentation

Update this INIT file when:

1. Adding new scripts or commands that other developers or AI assistants would need to understand
2. Changing environment configuration or selection logic
3. Modifying the Supabase client setup or environment filtering
4. Adding new tables that require environment column filtering
5. Discovering new gotchas or best practices

Keep documentation concise and focused on what's important for clarity, setup, or safety. Not every detail needs to be
logged—just what's essential for understanding the codebase and working with it effectively.
