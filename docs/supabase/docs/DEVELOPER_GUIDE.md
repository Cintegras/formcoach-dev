# Supabase Environment Setup: Developer Guide

This guide provides instructions for developers on how to set up and use the Supabase environment configuration in the
FormCoach project.

## Environment Setup

FormCoach uses 2 Supabase projects to support 3 environments:

| Environment | Supabase Project | Purpose                       |
|-------------|------------------|-------------------------------|
| Development | formcoach-dev    | Local development and testing |
| Staging     | formcoach-dev    | Pre-production testing        |
| Production  | formcoach        | Live application              |

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/formcoach-dev.git
   cd formcoach-dev
   ```

2. **Set up environment variables**:
    - Copy `.env.example` to `.env`:
      ```bash
      cp .env.example .env
      ```
    - Update the values in `.env` with your actual Supabase URLs and keys:
      ```
      VITE_FORMCOACH_ENV=dev
      VITE_SUPABASE_URL_DEV=https://your-dev-project.supabase.co
      VITE_SUPABASE_KEY_DEV=your_supabase_anon_key_for_dev
      VITE_SUPABASE_URL_PROD=https://your-prod-project.supabase.co
      VITE_SUPABASE_KEY_PROD=your_supabase_anon_key_for_prod
      ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

## Using the Environment Filtering Utility

All database queries should use the environment filtering utility to ensure that data is properly isolated between
environments.

### Basic Usage

```typescript
import { withEnvironmentFilter } from '@/lib/supabase-utils';
import { supabase } from '@/integrations/supabase/client';

// Example: Fetch profiles with environment filtering
const { data, error } = await withEnvironmentFilter(
  supabase.from('profiles').select('*')
);

// Example: Fetch profiles with additional filters
const { data, error } = await withEnvironmentFilter(
  supabase.from('profiles').select('*').eq('user_id', userId)
);
```

### Testing the Environment Setup

A test script is provided to verify that the environment setup works correctly:

```bash
npx ts-node scripts/test-environment-setup.ts
```

This script demonstrates how to:

1. Get the current environment
2. Apply environment filtering to queries
3. Use the Supabase client with environment-specific configuration

## Switching Environments

To switch between environments, update the `VITE_FORMCOACH_ENV` variable in your `.env` file:

```
# For development
VITE_FORMCOACH_ENV=dev

# For staging
VITE_FORMCOACH_ENV=stage

# For production
VITE_FORMCOACH_ENV=prod
```

## Common Issues and Troubleshooting

1. **Data not appearing in queries**:
    - Check that you're using the environment filtering utility: `withEnvironmentFilter`
    - Verify that your `.env` file has the correct environment set in `VITE_FORMCOACH_ENV`
    - Ensure that the RLS policies include the correct environment condition

2. **Permission errors**:
    - Ensure RLS policies are properly configured with environment filtering
    - Check that you're using the correct Supabase API keys for the environment

3. **Environment variable issues**:
    - If environment variables aren't being recognized, try restarting the development server
    - Ensure that your `.env` file is in the project root directory
    - Check that variable names match exactly (they are case-sensitive)

## Best Practices

1. **Always use the environment filtering utility**:
   ```typescript
   // Good
   const { data } = await withEnvironmentFilter(
     supabase.from('table').select('*')
   );
   
   // Bad - missing environment filter
   const { data } = await supabase.from('table').select('*');
   ```

2. **Include environment column in all tables**:
   All tables should include an `environment` column with a default value matching the current environment.

3. **Include environment filtering in RLS policies**:
   All RLS policies should include environment filtering to ensure proper data isolation.

4. **Test in multiple environments**:
   Test your code in both development and staging environments to ensure proper environment isolation.

## Additional Resources

- [Environment Setup Guide](ENVIRONMENT_SETUP.md): Detailed information about the environment setup
- [Supabase Documentation](https://supabase.com/docs): Official Supabase documentation