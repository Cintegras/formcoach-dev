# Testing Strategy

This document outlines the testing strategy for the FormCoach application, focusing on the recently implemented
features:

1. Workout Plans
2. Progress Tracking
3. History View
4. Shared Components

## 1. Unit Tests

Unit tests focus on testing individual components in isolation to ensure they function correctly.

### Components to Test

#### Workout Plans

- `WorkoutPlansPage.tsx`: Test rendering of plans list, empty state, loading state, and error state
- `WorkoutPlanEditor.tsx`: Test form validation, exercise addition/removal, and plan saving

#### Progress Tracking

- `TrendsPage.tsx`: Test rendering of charts, filtering by metrics, and date range selection

#### History View

- `WorkoutHistoryPage.tsx`: Test filtering functionality, date grouping, and workout details display

#### Shared Components

- `ErrorBoundary.tsx`: Test error catching and fallback UI rendering
- `LoadingIndicator.tsx`: Test different sizes and full-screen mode
- `BottomNav.tsx`: Test navigation and authentication state handling

### Implementation Approach

For each component, we should test:

1. Initial rendering
2. State changes
3. User interactions
4. Conditional rendering (loading, error, empty states)

Example test for `LoadingIndicator.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import LoadingIndicator from '../components/LoadingIndicator';

describe('LoadingIndicator', () => {
  it('renders with default props', () => {
    render(<LoadingIndicator />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<LoadingIndicator text="Please wait" />);
    expect(screen.getByText('Please wait')).toBeInTheDocument();
  });

  it('renders different sizes correctly', () => {
    const { rerender } = render(<LoadingIndicator size="small" />);
    // Test small size

    rerender(<LoadingIndicator size="large" />);
    // Test large size
  });
});
```

## 2. Integration Tests

Integration tests verify that multiple components work together correctly.

### Flows to Test

1. **Workout Plan Creation Flow**
    - Navigate to workout plans page
    - Create a new plan
    - Add exercises
    - Save the plan
    - Verify the plan appears in the list

2. **Progress Tracking Flow**
    - Navigate to trends page
    - Select different metrics
    - Change time range
    - Verify charts update correctly

3. **Workout History Flow**
    - Navigate to history page
    - Apply filters
    - Verify filtered results
    - View workout details

### Implementation Approach

Use React Testing Library with a router wrapper to test navigation between components:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import WorkoutPlansPage from '../pages/WorkoutPlansPage';
import WorkoutPlanEditor from '../pages/WorkoutPlanEditor';

describe('Workout Plan Flow', () => {
  it('navigates from plans list to editor', async () => {
    render(
      <MemoryRouter initialEntries={['/workout-plans']}>
        <Routes>
          <Route path="/workout-plans" element={<WorkoutPlansPage />} />
          <Route path="/workout-plan-editor" element={<WorkoutPlanEditor />} />
        </Routes>
      </MemoryRouter>
    );

    // Click create plan button
    fireEvent.click(screen.getByText('Create New Plan'));
    
    // Verify navigation to editor
    expect(await screen.findByText('Create Workout Plan')).toBeInTheDocument();
  });
});
```

## 3. End-to-End Tests

End-to-end tests verify that the application works correctly from the user's perspective, testing complete user
journeys.

### Critical Paths to Test

1. **User Authentication and Workout Flow**
    - Log in
    - Create a workout plan
    - Start a workout
    - Complete the workout
    - View workout in history

2. **Progress Tracking Journey**
    - Log in
    - Record body measurements
    - View progress over time
    - Filter by different metrics

### Implementation Approach

Use Cypress or Playwright to automate browser testing:

```js
// Example Cypress test
describe('Workout Flow', () => {
  beforeEach(() => {
    cy.login('testuser@example.com', 'password');
  });

  it('creates and executes a workout plan', () => {
    // Navigate to workout plans
    cy.visit('/workout-plans');
    
    // Create a new plan
    cy.contains('Create New Plan').click();
    cy.get('input[placeholder="Enter plan name"]').type('Test Plan');
    cy.contains('Create Plan').click();
    
    // Add exercises
    cy.contains('Add Exercise').click();
    cy.get('input[placeholder="e.g., Bench Press"]').type('Push-ups');
    cy.contains('Add Exercise').click();
    
    // Start workout
    cy.visit('/');
    cy.contains('Start Workout').click();
    
    // Complete workout
    cy.contains('Complete Workout').click();
    
    // Verify in history
    cy.visit('/workout-history');
    cy.contains('Test Plan').should('be.visible');
  });
});
```

## 4. Test Coverage Goals

- **Unit Tests**: 80% coverage of component code
- **Integration Tests**: Cover all main user flows
- **E2E Tests**: Cover critical paths that affect user experience

## 5. Testing Tools

To implement this testing strategy, we recommend adding the following dependencies:

1. **Unit and Integration Testing**:
    - Jest or Vitest as the test runner
    - React Testing Library for component testing
    - MSW (Mock Service Worker) for API mocking

2. **End-to-End Testing**:
    - Cypress or Playwright for browser automation

## 6. CI/CD Integration

Tests should be integrated into the CI/CD pipeline:

1. Run unit and integration tests on every pull request
2. Run E2E tests on staging before deployment to production
3. Generate and publish test coverage reports

## 7. Next Steps

1. Set up the testing framework (Jest/Vitest + React Testing Library)
2. Create test files alongside components
3. Implement unit tests for shared components first
4. Add integration tests for main flows
5. Set up E2E testing framework
6. Implement E2E tests for critical paths