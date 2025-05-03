-- Profiles table migration
-- This file creates and configures the profiles table

-- Create profiles table that extends the users table
CREATE TABLE IF NOT EXISTS profiles
(
    id
    UUID
    PRIMARY
    KEY
    REFERENCES
    users
(
    id
) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    website TEXT,
    updated_at TIMESTAMP
  WITH TIME ZONE DEFAULT NOW()
    );

-- Create a trigger to update the updated_at column
CREATE
OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at
= NOW();
RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE
    ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();