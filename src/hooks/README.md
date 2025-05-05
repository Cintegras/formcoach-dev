# React Hooks for Supabase Data Access

This directory contains React hooks that provide easy access to the Supabase data services. These hooks handle data
fetching, state management, real-time updates, and error handling.

## Available Hooks

### `useProfile`

Manages the current user's profile data.

```typescript
const { 
  profile,  // The current user's profile data
  loading,  // Boolean indicating if a request is in progress
  error,    // Error object if a request failed
  update,   // Function to update the profile
  create    // Function to create a new profile
} = useProfile();
```

### `useWorkoutSessions`

Manages workout sessions with real-time updates.

```typescript
const { 
  sessions,       // Array of workout sessions
  activeSession,  // The current active session (no end_time)
  loading,        // Boolean indicating if a request is in progress
  error,          // Error object if a request failed
  startSession,   // Function to start a new workout session
  endSession,     // Function to end the active session
  createSession,  // Function to create a custom session
  updateSession,  // Function to update a session
  deleteSession,  // Function to delete a session
  refresh         // Function to refresh the data
} = useWorkoutSessions(limit = 20, enableRealtime = true);
```

### `useExerciseLogs`

Manages exercise logs for a specific workout session with real-time updates.

```typescript
const { 
  logs,                 // Array of exercise logs
  loading,              // Boolean indicating if a request is in progress
  error,                // Error object if a request failed
  logCompletedExercise, // Function to log a completed exercise
  addFeedback,          // Function to add form feedback
  createLog,            // Function to create a custom log
  updateLog,            // Function to update a log
  deleteLog,            // Function to delete a log
  refresh               // Function to refresh the data
} = useExerciseLogs(sessionId, enableRealtime = true);
```

### `useWorkoutPlans`

Manages workout plans for the current user.

```typescript
const { 
  plans,       // Array of workout plans
  loading,     // Boolean indicating if a request is in progress
  error,       // Error object if a request failed
  createPlan,  // Function to create a new plan
  updatePlan,  // Function to update a plan
  deletePlan,  // Function to delete a plan
  refresh      // Function to refresh the data
} = useWorkoutPlans(enableRealtime = true);
```

### `useWorkoutPlan`

Manages a specific workout plan and its exercises with real-time updates.

```typescript
const { 
  plan,              // The workout plan data
  exercises,         // Array of exercises in the plan
  loading,           // Boolean indicating if a request is in progress
  error,             // Error object if a request failed
  updatePlan,        // Function to update the plan
  addExercise,       // Function to add an exercise to the plan
  updateExercise,    // Function to update an exercise
  removeExercise,    // Function to remove an exercise
  reorderExercises,  // Function to reorder exercises
  refresh            // Function to refresh the data
} = useWorkoutPlan(planId, enableRealtime = true);
```

### `useProgressMetrics`

Manages progress metrics with optional filtering by metric type.

```typescript
const { 
  metrics,           // Array of progress metrics
  loading,           // Boolean indicating if a request is in progress
  error,             // Error object if a request failed
  trackMeasurement,  // Function to track a new body measurement
  createMetric,      // Function to create a custom metric
  updateMetric,      // Function to update a metric
  deleteMetric,      // Function to delete a metric
  getHistory,        // Function to get history for a specific metric type
  getLatest,         // Function to get the latest value for a metric type
  refresh            // Function to refresh the data
} = useProgressMetrics(metricType, limit = 50, enableRealtime = true);
```

## Real-time Updates

All hooks support real-time updates through Supabase's subscription API. When data changes in the database, the hooks
automatically update their state to reflect the changes.

You can disable real-time updates by setting the `enableRealtime` parameter to `false`. In this case, the hooks will
only update their state when you call their methods or the `refresh` function.

## Error Handling

All hooks include error handling and provide an `error` object that you can use to display error messages to the user.
The error object is set to `null` when there is no error.

## Loading State

All hooks include a `loading` state that indicates whether a request is in progress. You can use this to display loading
indicators to the user.

## Refresh Function

All hooks include a `refresh` function that you can call to manually refresh the data. This is useful when you want to
ensure that the data is up-to-date, for example after navigating back to a page.