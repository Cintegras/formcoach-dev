
# 🛠️ DEBUGGING_PROMPTS.md
Prompts for resolving bugs, layout issues, and warnings.

## Bug Fix Prompts

Use these prompts to resolve specific bugs in FormCoach:

```
Fix the following bug in FormCoach:
- Symptom: [what's happening incorrectly]
- Expected behavior: [what should happen]
- Steps to reproduce: [how to trigger the bug]
- Affected components: [where the issue is occurring]

Additional context:
- Console errors: [any error messages]
- Environment: [where it occurs: desktop/mobile/specific browser]
- User impact: [how this affects users]
```

## Performance Optimization Prompts

Use these prompts to improve app performance:

```
Optimize performance for [specific feature/page] with these issues:
- Current behavior: [slow loading/janky animations/etc.]
- Performance metrics: [load time/FPS/memory usage]
- Suspected causes: [large assets/inefficient code/etc.]
- Priority areas: [most important aspects to optimize]

Consider optimizing:
1. Component rendering efficiency
2. Asset loading and caching
3. State management approach
4. Network request patterns
```

## Layout Debugging Prompts

Use these prompts to fix layout and responsive design issues:

```
Fix these layout issues in [component/page]:
- Issue description: [overflow/misalignment/spacing/etc.]
- Affected screen sizes: [mobile/tablet/desktop/all]
- Expected layout: [how it should look]
- Current CSS approach: [how it's currently styled]

The solution should:
1. Work across all required screen sizes
2. Maintain the FormCoach aesthetic
3. Follow Tailwind best practices
4. Not introduce new issues elsewhere
```

## Type Error Resolution Prompts

Use these prompts to fix TypeScript and type-related issues:

```
Resolve these TypeScript errors in [file/component]:
- Error messages: [exact TS error messages]
- Affected types: [what types are involved]
- Component props: [relevant prop definitions]
- Data structure: [relevant data structures]

The solution should:
1. Fix all type errors without using "any"
2. Maintain type safety throughout
3. Create or update type definitions as needed
4. Follow TypeScript best practices
```

## Implementation Example

When implementing debugging solutions based on these prompts:

```tsx
// Example of fixing a performance issue in a list component
import React, { useMemo } from 'react';

// Before: Inefficient implementation
const WorkoutListBefore = ({ workouts }) => {
  // Recalculated on every render
  const sortedWorkouts = workouts.sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  return (
    <div className="workout-list">
      {sortedWorkouts.map(workout => (
        <WorkoutItem 
          key={workout.id}
          workout={workout}
          // Inline function created on every render
          onSelect={() => handleSelectWorkout(workout.id)}
        />
      ))}
    </div>
  );
};

// After: Optimized implementation
const WorkoutListAfter = ({ workouts }) => {
  // Memoized sorting operation
  const sortedWorkouts = useMemo(() => 
    [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [workouts]
  );
  
  // Memoized handler factory
  const handleSelect = useCallback((id) => {
    return () => handleSelectWorkout(id);
  }, []);
  
  return (
    <div className="workout-list">
      {sortedWorkouts.map(workout => (
        <WorkoutItem 
          key={workout.id}
          workout={workout}
          onSelect={handleSelect(workout.id)}
        />
      ))}
    </div>
  );
};
```
