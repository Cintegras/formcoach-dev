# Environment-Based Row Level Security (RLS) Guide

This guide explains how the environment-based Row Level Security (RLS) works in the FormCoach application.

## Overview

FormCoach uses environment-based RLS to ensure that data from different environments (dev, stage, prod) is properly
isolated. This is implemented using PostgreSQL's Row Level Security feature and custom session variables.

## How It Works

1. At the start of each database session, the `app.environment` variable is automatically set based on the database
   name:
    - In the dev database: `app.environment = 'dev'` (default)
    - In the stage database: `app.environment = 'stage'`
    - In the prod database: `app.environment = 'prod'`

2. RLS policies are applied to all tables with an `environment` column, restricting access to rows where
   `environment = current_setting('app.environment', true)`.

3. Multiple mechanisms ensure the environment variable is set correctly:
    - A function that can be called at the start of each session
    - Triggers on tables that set the environment variable if it's not already set
    - (Optional) Database-level settings that can be applied by an administrator

## Usage

### In Development

For dev workflows:

```sql
SET
app.environment = 'dev';
-- Now you can only see dev data
SELECT *
FROM public.exercises;
```

For stage workflows in the dev database:

```sql
SET
app.environment = 'stage';
-- Now you can only see stage data
SELECT *
FROM public.exercises;
```

### In Production

In the production database:

```sql
SET
app.environment = 'prod';
-- Now you can only see prod data
SELECT *
FROM public.exercises;
```

### Automatic Environment Setting

The environment is automatically set at the start of each session through multiple mechanisms:

1. **Client-side initialization**: The Supabase client automatically sets the environment variable when it connects:

```typescript
// This happens automatically when the client is imported
const initializeEnvironment = async () => {
    try {
        // Call the initialize_session function
        await supabase.rpc('initialize_session');

        // Alternative approach as fallback
        await supabase.query(`SET app.environment = '${envValue}'`);
    } catch (error) {
        // Fallback handling
    }
};
```

2. **Database function**: You can call the initialization function directly:

```sql
SELECT initialize_session();
```

3. **Manual setting**: You can set it directly:

```sql
SET
app.environment = 'dev'; -- or 'stage' or 'prod'
```

4. **Table triggers**: Triggers on tables will set the environment if it's not already set when you access the table.

## Implementation Details

The implementation consists of:

1. A function to set the environment variable based on the database name:

```sql
CREATE
OR REPLACE FUNCTION set_app_environment()
RETURNS VOID AS $$
DECLARE
db_name TEXT;
BEGIN
SELECT current_database()
INTO db_name;

IF
db_name LIKE '%prod%' THEN
        EXECUTE 'SET app.environment = ''prod''';
    ELSIF
db_name LIKE '%stage%' THEN
        EXECUTE 'SET app.environment = ''stage''';
ELSE
        EXECUTE 'SET app.environment = ''dev''';
END IF;
END;
$$
LANGUAGE plpgsql;
```

2. A user-callable initialization function:

```sql
CREATE
OR REPLACE FUNCTION initialize_session()
RETURNS VOID AS $$
BEGIN
    PERFORM
set_app_environment();
END;
$$
LANGUAGE plpgsql;
```

3. Triggers on tables to ensure the environment is set:

```sql
CREATE TRIGGER set_environment_profiles
    BEFORE INSERT OR
UPDATE OR
DELETE OR
SELECT
ON public.profiles
    FOR EACH STATEMENT EXECUTE FUNCTION ensure_environment_set();
```

4. RLS policies on tables:

```sql
CREATE
POLICY "Allow access for active environment"
ON public.profiles
FOR ALL
USING (environment = current_setting('app.environment', true))
WITH CHECK (environment = current_setting('app.environment', true));
```

## Persistence

The environment-based RLS configuration persists across database restarts because:

1. The functions and triggers are stored in the database
2. The RLS policies are stored in the database
3. The environment variable is set at the start of each session

For additional persistence, a database administrator can set:

```sql
ALTER
DATABASE current_database() SET session_preload_libraries = 'auto_explain';
```

## Troubleshooting

If you're not seeing any data, check:

1. The current environment setting:

```sql
SHOW
app.environment;
```

2. Reset to the default environment:

```sql
SELECT initialize_session();
```

3. Explicitly set the environment:

```sql
SET
app.environment = 'dev';
```
