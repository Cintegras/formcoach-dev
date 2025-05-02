
# 🎨 UI_PROMPTS.md
Prompts for layout, visual design, color schemes, and animations.

## Color Scheme Prompts

Use these prompts to update or modify the FormCoach color palette:

```
Update the FormCoach color scheme while maintaining the teal brand identity:
- Primary: [current #00C4B4] → [suggested new primary]
- Background: [current #020D0C] → [suggested new background]
- Text: [current #A4B1B7, #B0E8E3] → [suggested new text colors]
- Accent: [any additional color needs]

The colors should convey:
- Calm, professional fitness guidance
- Modern, clean aesthetic
- Good accessibility and readability
- Consistency across app sections
```

## Layout Prompts

Use these prompts to create or improve page layouts:

```
Design a [page type] layout for FormCoach with these requirements:
- Primary content: [main elements needed]
- Secondary elements: [supporting elements]
- User interactions: [key actions users will take]
- Navigation: [how users move to/from this page]

The layout should:
- Follow FormCoach's minimalist aesthetic
- Prioritize the workout experience
- Be fully responsive (mobile-first)
- Use consistent spacing and alignment
```

## Animation Prompts

Use these prompts to add purposeful animations:

```
Create subtle animations for [specific element] with these characteristics:
- Purpose: [functional feedback/visual interest/etc.]
- Timing: [speed/duration]
- Trigger: [user interaction/page load/etc.]
- Style: [fade/slide/scale/etc.]

Animations should:
- Enhance rather than distract from the experience
- Provide meaningful feedback to users
- Maintain the calm, focused FormCoach aesthetic
- Perform well on mobile devices
```

## Component Style Prompts

Use these prompts to style specific components:

```
Design a [component type] for FormCoach with these requirements:
- Purpose: [what the component does]
- States: [different states needed - active/hover/disabled/etc.]
- Variants: [any variations needed]
- Content: [what will be displayed in the component]

The component should:
- Use the FormCoach color palette
- Be accessible (sufficient contrast, clear interactions)
- Scale appropriately across device sizes
- Fit with existing FormCoach components
```

## Implementation Example

When implementing design changes based on these prompts:

```tsx
// Example of a styled component based on UI prompt
const WorkoutCard = ({ workout, isActive, onSelect }) => {
  return (
    <div 
      className={`
        p-4 rounded-lg transition-all duration-300
        ${isActive 
          ? 'bg-[rgba(176,232,227,0.2)] border border-[#00C4B4]' 
          : 'bg-[rgba(176,232,227,0.08)] hover:bg-[rgba(176,232,227,0.12)]'
        }
      `}
      onClick={onSelect}
    >
      <h3 className="text-[#B0E8E3] text-lg font-medium mb-2">
        {workout.title}
      </h3>
      <div className="flex items-center text-[#A4B1B7] text-sm">
        <Clock size={16} className="mr-1" />
        <span>{workout.duration} min</span>
        <Dumbbell size={16} className="ml-3 mr-1" />
        <span>{workout.exercises.length} exercises</span>
      </div>
    </div>
  );
};
```
