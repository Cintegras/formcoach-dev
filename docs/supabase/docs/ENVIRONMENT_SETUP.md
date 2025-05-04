# Supabase Environment Setup

## Environment Configuration

FormCoach uses 2 Supabase projects to support 3 environments:

| Environment | Supabase Project | Purpose                       |
|-------------|------------------|-------------------------------|
| Development | formcoach-dev    | Local development and testing |
| Staging     | formcoach-dev    | Pre-production testing        |
| Production  | formcoach        | Live application              |

## Shared Project Implementation

To effectively distinguish between development and staging environments within the shared `formcoach-dev` Supabase
project, we implement the Environment Column Approach:

### Environment Column Approach

- We add an `environment` column to all tables that store environment-specific data
- Values are either 'dev' or 'stage' (with appropriate defaults set in table definitions)
- All queries include `WHERE environment = 'dev'` or `WHERE environment = 'stage'` conditions
- All RLS policies include environment filtering to ensure proper data isolation
- Example query: `SELECT * FROM users WHERE environment = 'stage'`

This approach provides several benefits:

- Simple implementation that doesn't require schema changes
- Clear data separation within the same tables
- Easy to understand and maintain
- Works well with Supabase's RLS policies

### Implementation Details

1. **Table Structure**: Every table includes an `environment` column with a default value:
   ```sql
   CREATE TABLE profiles (
       id UUID REFERENCES auth.users PRIMARY KEY,
       /* other columns */
       environment TEXT NOT NULL DEFAULT 'dev',
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

2. **RLS Policies**: All policies include environment filtering:
   ```sql
   CREATE POLICY "Users can view their own profile"
     ON profiles FOR SELECT
     USING (auth.uid() = id AND environment = 'dev');
   ```

3. **Application Queries**: All application code includes environment filtering:
   ```sql
   const { data, error } = await supabase
     .from('profiles')
     .select('*')
     .eq('environment', 'dev');
   ```

## Configuration Example

### Environment Variables

We use `.env` files for local development to store environment-specific configuration:

```
# .env file
VITE_FORMCOACH_ENV=dev
VITE_SUPABASE_URL_DEV=https://your-dev-project.supabase.co
VITE_SUPABASE_KEY_DEV=your_supabase_anon_key_for_dev
VITE_SUPABASE_URL_PROD=https://your-prod-project.supabase.co
VITE_SUPABASE_KEY_PROD=your_supabase_anon_key_for_prod
```

A `.env.example` template is provided in the repository root. Copy this file to `.env` and update with your actual
values.

### Environment Filtering Utility

We provide a utility function to automatically apply environment filtering to all Supabase queries:

```typescript
// Import the utility
import {withEnvironmentFilter} from '@/lib/supabase-utils';
import {supabase} from '@/integrations/supabase/client';

// Basic usage
const {data} = await withEnvironmentFilter(
    supabase.from('profiles').select('*')
);

// With additional filters
const {data} = await withEnvironmentFilter(
    supabase.from('profiles').select('*').eq('user_id', userId)
);
```

This ensures that all queries automatically include the appropriate environment filter based on the current
`VITE_FORMCOACH_ENV` value.

### Legacy Configuration Example

```python
# Python configuration example
import os

# Get environment name (dev, stage, prod)
env_name = os.getenv('FORMCOACH_ENV', 'dev')
# Both dev and stage use the same Supabase project
if env_name in ['dev', 'stage']:
    supabase_url = os.getenv('SUPABASE_URL_DEV')
    supabase_key = os.getenv('SUPABASE_KEY_DEV')
    # Distinguish environments within the shared project
    environment_filter = f"environment = '{env_name}'"
else:  # prod
    supabase_url = os.getenv('SUPABASE_URL_PROD')
    supabase_key = os.getenv('SUPABASE_KEY_PROD')
    environment_filter = "environment = 'prod'"
# Use in queries
# Example: f"SELECT * FROM users WHERE {environment_filter}"
```

## Implementation Plan for formcoach-dev and formcoach-stage

### Initial Setup

1. **Copy Supabase Folder**:
    - The entire `/docs/supabase` folder should be copied to both formcoach-dev and formcoach-stage projects
    - This ensures consistent schema, functions, and policies across environments

2. **Schema Initialization**:
    - For formcoach-dev: Use `dev_001_init_schema.sql` which sets `DEFAULT 'dev'` for all environment columns
    - For formcoach-stage: Modify `dev_001_init_schema.sql` to use `DEFAULT 'stage'` for all environment columns
    - Note: There is no separate `stage_001_init_schema.sql` file; developers should modify the dev schema file

### Development Environment Instructions

When developing for the **dev** environment:

1. **Database Schema**:
    - All tables should include `environment TEXT NOT NULL DEFAULT 'dev'`
    - All RLS policies should include `AND environment = 'dev'` in their conditions

2. **Application Code**:
    - Always include environment filtering in queries: `.eq('environment', 'dev')`
    - Set environment variable `FORMCOACH_ENV=dev` in your local development setup
    - Use the configuration pattern shown in the Configuration Example section

3. **Testing**:
    - Verify that all data created in the dev environment has `environment = 'dev'`
    - Ensure that RLS policies properly isolate dev data from stage data

### Staging Environment Instructions

When developing for the **stage** environment:

1. **Database Schema**:
    - All tables should include `environment TEXT NOT NULL DEFAULT 'stage'`
    - All RLS policies should include `AND environment = 'stage'` in their conditions

2. **Application Code**:
    - Always include environment filtering in queries: `.eq('environment', 'stage')`
    - Set environment variable `FORMCOACH_ENV=stage` in your staging deployment
    - Use the configuration pattern shown in the Configuration Example section

3. **Testing**:
    - Verify that all data created in the stage environment has `environment = 'stage'`
    - Ensure that RLS policies properly isolate stage data from dev data

### Data Migration Considerations

When migrating data between environments:

1. **Dev to Stage**:
    - Update the environment column: `UPDATE table_name SET environment = 'stage' WHERE environment = 'dev'`
    - Only migrate specific data that needs testing in staging

2. **Stage to Production**:
    - Data should be migrated to the separate production Supabase project
    - Ensure environment column is set to 'prod' in the production database

### Troubleshooting

Common issues and solutions:

1. **Data not appearing in queries**:
    - Check that you're using the correct environment filter in your queries
    - Verify that the RLS policies include the correct environment condition

2. **Permission errors**:
    - Ensure RLS policies are properly configured with environment filtering
    - Check that you're using the correct Supabase API keys for the environment
