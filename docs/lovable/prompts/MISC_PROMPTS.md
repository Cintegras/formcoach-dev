
# 🧩 MISC_PROMPTS.md
Everything that doesn't cleanly fit into another prompt category.

## Onboarding Flow Prompts

Use these prompts to modify or improve the user onboarding experience:

```
Design an onboarding flow for FormCoach with these requirements:
- User information to collect: [name/age/height/weight/goals/etc.]
- Number of steps: [how many screens/steps]
- Educational elements: [what users need to learn]
- Conversion goal: [what action completes onboarding]

The flow should:
- Feel welcoming and encouraging
- Explain the value of FormCoach
- Collect only essential information
- Allow users to skip non-critical steps
```

## Copy and Messaging Prompts

Use these prompts to generate appropriate app copy:

```
Create [motivational/instructional/informational] copy for the [specific section]:
- Voice: [supportive coach/friendly guide/expert advisor]
- Length: [short phrases/single sentences/paragraphs]
- Purpose: [motivate/inform/guide/warn]
- Key information to convey: [specific details needed]

The copy should:
- Match FormCoach's supportive but professional tone
- Use clear, concise language
- Avoid fitness jargon unless necessary
- Be encouraging without being pushy
```

## Error Handling Prompts

Use these prompts to create user-friendly error states:

```
Design error handling for [specific feature] with these requirements:
- Potential errors: [list of possible error conditions]
- User remediation: [can the user fix it? how?]
- Visual treatment: [how should errors be displayed]
- Follow-up actions: [what happens after the error]

The error handling should:
- Be clear about what went wrong
- Offer constructive next steps when possible
- Maintain the calm FormCoach aesthetic
- Avoid technical jargon
```

## Settings & Preferences Prompts

Use these prompts to design user preference interfaces:

```
Design a settings interface for [specific feature] with these options:
- User preferences: [list of configurable options]
- Default values: [starting configurations]
- Persistence: [how settings should be saved]
- Accessibility: [any specific accessibility considerations]

The settings interface should:
- Use familiar UI patterns (toggles, radio buttons, etc.)
- Group related settings logically
- Provide clear labels and helper text
- Allow easy restoration of defaults
```

## Implementation Example

When implementing features based on these prompts:

```tsx
// Example of onboarding step implementation
const WeightHeightStep = ({ userData, updateUserData, nextStep }) => {
  const [height, setHeight] = useState(userData.height || 170);
  const [weight, setWeight] = useState(userData.weight || 70);
  
  const handleNext = () => {
    updateUserData({ height, weight });
    nextStep();
  };
  
  return (
    <div className="onboarding-step">
      <h2 className="text-[#B0E8E3] text-2xl mb-6">About You</h2>
      
      <p className="text-[#A4B1B7] mb-6">
        This helps us personalize your workout experience. 
        Your information is kept private.
      </p>
      
      {/* Height selector */}
      <div className="mb-6">
        <label className="text-[#B0E8E3] mb-2 block">Height (cm)</label>
        <WheelSelector 
          value={height}
          onChange={setHeight}
          min={120}
          max={220}
        />
      </div>
      
      {/* Weight selector */}
      <div className="mb-8">
        <label className="text-[#B0E8E3] mb-2 block">Weight (kg)</label>
        <WheelSelector 
          value={weight}
          onChange={setWeight}
          min={40}
          max={180}
        />
      </div>
      
      <PrimaryButton onClick={handleNext} className="w-full">
        Continue
      </PrimaryButton>
      
      <button 
        className="mt-4 text-[#A4B1B7] text-sm w-full"
        onClick={nextStep}
      >
        Skip this step
      </button>
    </div>
  );
};
```
