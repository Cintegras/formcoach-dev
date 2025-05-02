
# 🤖 AI_PROMPTS.md
Prompts for AI assistance, form analysis, and workout recommendations.

## Form Analysis Prompts

Use these prompts to have AI analyze workout form and provide feedback:

```
Analyze the following exercise form and provide feedback:
- Exercise: [squat/deadlift/bench press/etc.]
- User description: [user's description of their form or issues]
- Pain points: [any discomfort or pain experienced]

Provide specific recommendations for:
1. Form corrections
2. Common mistakes to avoid
3. Suggested modifications if needed
```

## Workout Recommendation Prompts

Use these prompts to generate personalized workout plans:

```
Generate a personalized workout plan with these parameters:
- Fitness level: [beginner/intermediate/advanced]
- Goals: [strength/endurance/weight loss/etc.]
- Available equipment: [home/gym/minimal]
- Time available: [minutes per session]
- Frequency: [days per week]
- Health considerations: [injuries/limitations]

Include:
1. Warm-up routine
2. Main exercises with sets/reps
3. Cool-down stretches
4. Progression plan
```

## Progress Analysis Prompts

Use these prompts to analyze user progress and provide insights:

```
Analyze my workout progress with the following data:
- Starting stats: [weight/measurements/max lifts]
- Current stats: [weight/measurements/max lifts]
- Workout consistency: [workouts per week]
- Duration: [weeks/months of training]
- Goal: [specific fitness goal]

Provide:
1. Analysis of progress rate
2. Recommendations for improvement
3. Realistic timeline for reaching goal
```

## Nutrition Recommendation Prompts

Use these prompts to get nutrition advice alongside workout plans:

```
Recommend a nutrition plan to complement my workouts:
- Training type: [strength/cardio/hybrid]
- Current diet: [brief description]
- Dietary restrictions: [any allergies/preferences]
- Goal: [muscle gain/fat loss/maintenance]

Include:
1. Macronutrient breakdown
2. Meal timing recommendations
3. Sample meal ideas
4. Supplement suggestions (if applicable)
```

## Implementation Example

When implementing AI recommendations in FormCoach:

```tsx
const handleAIFormAnalysis = async (formData) => {
  // Construct the prompt
  const prompt = `
    Analyze the following exercise form and provide feedback:
    - Exercise: ${formData.exercise}
    - User description: ${formData.description}
    - Pain points: ${formData.painPoints}
    
    Provide specific recommendations for:
    1. Form corrections
    2. Common mistakes to avoid
    3. Suggested modifications if needed
  `;
  
  // Send to AI service
  const response = await aiService.getFormAnalysis(prompt);
  
  // Display the results to the user
  setAnalysisResults(response.analysis);
};
```
