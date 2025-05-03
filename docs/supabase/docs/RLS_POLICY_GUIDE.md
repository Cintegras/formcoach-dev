# Row Level Security (RLS) Policy Guide

## Overview

Row Level Security (RLS) is a PostgreSQL feature that allows you to restrict which rows users can access in a table.
Supabase leverages RLS to provide fine-grained access control to your data.

## Key Concepts

### Enabling RLS

By default, tables have no row security policies, meaning no rows are visible or can be modified. To enable RLS on a
table:

```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

### Policy Types

Policies can be created for different operations:

- `FOR SELECT` - Controls which rows can be retrieved
- `FOR INSERT` - Controls which rows can be inserted
- `FOR UPDATE` - Controls which rows can be updated
- `FOR DELETE` - Controls which rows can be deleted
- `FOR ALL` - Applies to all operations

### Policy Components

A policy consists of:

1. A unique name
2. The table it applies to
3. The operation(s) it applies to
4. A USING expression (for SELECT, UPDATE, DELETE)
5. A WITH CHECK expression (for INSERT, UPDATE)

## Best Practices

### 1. Default to Restrictive Policies

Start with denying all access and then explicitly grant permissions:

```sql
-- First enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Then create specific policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);
```

### 2. Use auth.uid() for User Context

Supabase provides `auth.uid()` to get the current user's ID:

```sql
CREATE POLICY "Users can update own data" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);
```

### 3. Public vs. Private Data

For public data that everyone should see:

```sql
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (is_public = true);
```

### 4. Role-Based Policies

For admin-only operations:

```sql
CREATE POLICY "Admins can do anything" ON profiles
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
```

## Common Patterns

### Owner-Based Access

```sql
CREATE POLICY "Users can CRUD own data" ON data
  USING (auth.uid() = owner_id);
```

### Team-Based Access

```sql
CREATE POLICY "Team members can access data" ON team_data
  USING (
    auth.uid() IN (
      SELECT user_id FROM team_members
      WHERE team_id = team_data.team_id
    )
  );
```

### Public/Private Toggle

```sql
CREATE POLICY "Anyone can view public items" ON items
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own private items" ON items
  FOR SELECT USING (auth.uid() = owner_id AND is_public = false);
```

## Troubleshooting

If your policies aren't working as expected:

1. Check that RLS is enabled on the table
2. Verify the policy expressions are correct
3. Test with specific user contexts
4. Use `auth.uid()` in your queries to debug

## Further Reading

- [Supabase RLS Documentation](https://supabase.io/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)