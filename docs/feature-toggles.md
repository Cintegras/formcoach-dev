# Feature Toggles

This document tracks functionality that is gated behind feature toggles in the FormCoach application.

## Overview

Feature toggles allow us to control access to specific features based on certain conditions. This can be useful for:

- Gradually rolling out new features
- A/B testing
- Limiting access to premium features
- Creating progression-based features that unlock as users engage with the app

## Implementation

Feature toggles are implemented using the `feature_toggles` table in the database, which has the following structure:

```sql
CREATE TABLE feature_toggles (
  user_id UUID REFERENCES profiles(id),
  feature_name TEXT,
  is_enabled BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  PRIMARY KEY (user_id, feature_name)
);
```

The application uses the `useFeatureToggles` hook to check if features are enabled for the current user.

## Current Feature Toggles

### 1. Form Coach Access (Trends Page)

**Feature Name:** `form_coach_access`

**Description:** Access to the Trends page, which shows visualizations of workout data, weight tracking, and body
measurements.

**Activation Condition:** User has completed at least 3 workouts.

**Implementation Details:**

- The feature is automatically enabled when a user completes their 3rd workout
- The Trends icon in the bottom navigation is disabled until the feature is unlocked
- Attempting to access the Trends page directly will redirect to the home page with a message
- Metadata stored includes the reason for activation and the session count at time of activation

**Code Locations:**

- Feature toggle definition: `src/types/supabase.ts`
- Service implementation: `src/services/supabase/feature-toggles.ts`
- React hook: `src/hooks/useFeatureToggles.ts`
- Route guard: `src/features/auth/components/RequireFormCoachAccess.tsx`
- UI implementation: `src/components/BottomNav.tsx`

## Adding New Feature Toggles

To add a new feature toggle:

1. Add the feature toggle to this documentation
2. Implement the toggle check in the appropriate service and hook
3. Add a route guard if the feature is a page or section
4. Update UI components to respect the feature toggle state

## Querying Feature Toggles

To query feature toggles for debugging or analysis:

```sql
-- Get all users with a specific feature enabled
SELECT user_id, is_enabled, created_at, updated_at, metadata
FROM feature_toggles
WHERE feature_name = 'form_coach_access'
AND is_enabled = true;

-- Get feature toggles with specific metadata
SELECT user_id, is_enabled, created_at, updated_at, metadata
FROM feature_toggles
WHERE feature_name = 'form_coach_access'
AND metadata->>'reason' = '3 workouts';
```