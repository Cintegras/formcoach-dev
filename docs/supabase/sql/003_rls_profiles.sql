-- Row Level Security (RLS) for profiles table
-- This file sets up RLS policies for the profiles table

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to view their own profile
CREATE
POLICY "Users can view own profile"
  ON profiles
  FOR
SELECT
    USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE
POLICY "Users can update own profile"
  ON profiles
  FOR
UPDATE
    USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE
POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow public read access to specific profile fields
CREATE
POLICY "Public profiles are viewable by everyone"
  ON profiles
  FOR
SELECT
    USING (true);

-- Note: Adjust these policies based on your application's security requirements
-- See RLS_POLICY_GUIDE.md for more information on RLS best practices