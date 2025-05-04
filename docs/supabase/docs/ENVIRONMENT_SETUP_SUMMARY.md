# Supabase Environment Setup: Implementation Summary

This document summarizes the changes made to implement the Supabase environment setup for the FormCoach project.

## Changes Made

1. **Updated `.env` file**:
    - Added environment-specific variables for both dev and prod environments
    - Set the default environment to 'dev'
   ```
   VITE_FORMCOACH_ENV=dev
   VITE_SUPABASE_URL_DEV=https://your-dev-project.supabase.co
   VITE_SUPABASE_KEY_DEV=your_supabase_anon_key_for_dev
   VITE_SUPABASE_URL_PROD=https://your-prod-project.supabase.co
   VITE_SUPABASE_KEY_PROD=your_supabase_anon_key_for_prod
   ```

2. **Created `.env.example` file**:
    - Added a template for developers with placeholder values
    - Included comments explaining each variable
    - Added instructions for developers to copy and update with their actual values

3. **Environment Filtering Utility**:
    - Implemented in `src/lib/supabase-utils.ts`
    - Provides functions for getting the current environment and applying environment filtering to queries
    - Example usage:
      ```typescript
      const { data } = await withEnvironmentFilter(
        supabase.from('profiles').select('*')
      );
      ```

4. **Updated Supabase Client**:
    - Modified `src/integrations/supabase/client.ts` to use environment-specific variables
    - Client now selects the appropriate Supabase URL and key based on the current environment

5. **Test Script**:
    - Created `scripts/test-environment-setup.ts` to verify the environment setup
    - Demonstrates how to use the environment filtering utility with Supabase queries
    - Run with: `npx ts-node scripts/test-environment-setup.ts`

6. **Developer Documentation**:
    - Created `docs/supabase/docs/DEVELOPER_GUIDE.md` with instructions for developers
    - Includes setup instructions, usage examples, troubleshooting tips, and best practices

7. **CI/CD Pipeline**:
    - Created `.github/workflows/supabase-migrations.yml` for automating migrations to staging
    - Triggered when changes are pushed to SQL files in the `docs/supabase/sql/` directory
    - Includes steps for applying and verifying migrations

## How to Use the Environment Setup

### For Developers

1. **Set up environment variables**:
    - Copy `.env.example` to `.env`
    - Update with your actual Supabase URLs and keys

2. **Use the environment filtering utility**:
   ```typescript
   import { withEnvironmentFilter } from '@/lib/supabase-utils';
   import { supabase } from '@/integrations/supabase/client';

   // Example: Fetch profiles with environment filtering
   const { data, error } = await withEnvironmentFilter(
     supabase.from('profiles').select('*')
   );
   ```

3. **Switch environments**:
    - Update `VITE_FORMCOACH_ENV` in your `.env` file:
      ```
      # For development
      VITE_FORMCOACH_ENV=dev
 
      # For staging
      VITE_FORMCOACH_ENV=stage
 
      # For production
      VITE_FORMCOACH_ENV=prod
      ```

### For Database Schema

1. **Include environment column in all tables**:
   ```sql
   CREATE TABLE table_name (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       /* other columns */
       environment TEXT NOT NULL DEFAULT 'dev',
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

2. **Include environment filtering in RLS policies**:
   ```sql
   CREATE POLICY "Policy name"
     ON table_name FOR SELECT
     USING (auth.uid() = user_id AND environment = 'dev');
   ```

## Testing the Implementation

1. **Run the test script**:
   ```bash
   npx ts-node scripts/test-environment-setup.ts
   ```

2. **Verify environment filtering**:
    - Create data in different environments
    - Switch between environments and verify that only data for the current environment is visible

## Next Steps

1. **Update existing queries**:
    - Review all existing Supabase queries in the codebase
    - Update them to use the environment filtering utility

2. **Set up CI/CD secrets**:
    - Add the required secrets to your GitHub repository for the CI/CD pipeline:
        - `SUPABASE_ACCESS_TOKEN`
        - `SUPABASE_DB_PASSWORD`
        - `SUPABASE_PROJECT_ID`

3. **Consider additional environments**:
    - If needed, add support for additional environments by updating the environment filtering logic

## Resources

- [Developer Guide](DEVELOPER_GUIDE.md): Detailed instructions for developers
- [Environment Setup Guide](ENVIRONMENT_SETUP.md): Comprehensive guide on environment setup
- [Supabase Documentation](https://supabase.com/docs): Official Supabase documentation