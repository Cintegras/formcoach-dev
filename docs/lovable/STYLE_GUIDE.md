# FormCoach - Style Guide

## 🎨 Color Palette

### Primary Colors
- **Background (Dark)**: `#020D0C` - Main app background
- **Primary Accent**: `#00C4B4` - Main brand color for buttons, highlights, icons
- **Text Primary**: `#D7E4E3` - Main text color
- **Text Secondary**: `#A4B1B7` - Labels and less important text
- **Subtext**: `#9CA3AF` - Tertiary information
- **Card Background**: `#1C1C1E` - Container backgrounds
- **Coming Soon**: `#2D2D2F` - Disabled or upcoming features

### Status Colors
- **Success**: `text-green-400` - Positive indicators
- **Warning**: `text-yellow-400` - Cautionary indicators
- **Alert**: `text-orange-400` - Attention indicators
- **Error**: `text-red-400` - Error indicators

### Transparent Overlays
- **Card Overlay**: `rgba(176,232,227,0.08)` - Subtle highlight for cards
- **Background Overlay**: `rgba(176,232,227,0.12)` - For modal backgrounds

## 📝 Typography

### Font Families
- **Primary**: 'Inter', sans-serif
- **Secondary**: 'Poppins', sans-serif

### Font Sizes
- **Page Title**: `text-2xl font-bold`
- **Section Heading**: `text-xl font-semibold`
- **Card Title**: `text-lg font-medium`
- **Body Text**: `text-base`
- **Labels**: `text-sm`
- **Captions**: `text-xs`

## 🧩 Components

### Buttons
- **Primary Button**: Teal background (`#00C4B4`), white text
- **Secondary Button**: Translucent overlay on dark background
- **Text Button**: No background, teal text
- **Disabled State**: 50% opacity

```jsx
<button className="bg-[#00C4B4] text-white px-4 py-2 rounded-md">
  Primary Button
</button>
Cards

Standard Card: Dark background (#1C1C1E), rounded corners (0.5rem)
Highlighted Card: Subtle teal overlay (rgba(176,232,227,0.08))
Padding: p-4 (1rem)

<div className="bg-[#1C1C1E] p-4 rounded-lg">
  Card Content
</div>
Form Elements

Input Fields: Dark background, light text, teal focus state
Labels: Positioned above inputs, light gray color
Validation: Red text for errors, green for success

<div className="space-y-2">
  <label className="text-[#A4B1B7] text-sm">Label</label>
  <input className="bg-[#1C1C1E] text-white border-0 rounded-md p-2 w-full focus:ring-1 focus:ring-[#00C4B4]" />
</div>
Icons

Icon Size: 20px standard (smaller for inline: 16px)
Icon Color: Teal (#00C4B4) for primary, light gray for secondary
Icon Library: Lucide React

<User size={20} className="text-[#00C4B4] mr-3" />
🎭 UI Patterns

Information Display

Use icon + label + value pattern for consistency
For example:

<div className="flex items-center">
  <Scale size={20} className="text-[#00C4B4] mr-3" />
  <span className="text-[#A4B1B7]">Weight:</span>
  <span className="ml-2 text-white">180 lbs</span>
</div>
Navigation

Bottom tabs for mobile-first navigation
Back buttons in top left for nested screens
Progress indicators for multi-step flows
Animations

Fade In: animate-fade-in - Smooth entrance animations
Accordion: animate-accordion-down - For expanding content
Confetti: Various speeds for celebrations (confetti-slow, confetti-medium, confetti-fast)
Transitions: 0.2s-0.5s ease-out for most UI transitions
💪 Workout-Specific Elements

Exercise Cards

Include exercise name, sets/reps, and form quality indicator
Use consistent muscle group color coding
Progress Indicators

Use clear visual indicators for progression
Green for improvement, yellow for maintenance, red for decline
Timer Elements

High contrast for visibility during workouts
Use the countdown animation for visual feedback
📱 Responsive Design

Breakpoints

Mobile: < 640px (default design target)
Tablet: 640px - 1024px
Desktop: > 1024px
Layout Principles

Mobile-first design approach
Stack elements vertically on mobile
Use grid layouts for larger screens
🎬 Interaction States

Buttons

Default: Standard styling
Hover: Slightly lighter background
Active: Slightly darker background
Focus: Ring outline in teal
Disabled: 50% opacity
Inputs

Default: Standard styling
Focus: Teal highlight ring
Error: Red outline or text
Disabled: Gray text, no interaction
🚀 Best Practices

Consistency: Use the defined color palette and typography consistently
Accessibility: Maintain sufficient contrast for text readability
Feedback: Provide visual feedback for all user interactions
Whitespace: Use generous spacing (space-y-6 for sections, space-y-2 for form fields)
Iconography: Always pair icons with text for clarity
Animation: Use animations purposefully to guide attention
Clarity: Prioritize readability and usability over decoration
Last updated: May 2, 2025


This style guide captures the visual language of your FormCoach application based on the code I've analyzed. It includes:

1. Your color system with both the shadcn/ui theme variables and the FormCoach-specific colors
2. Typography patterns used throughout the app
3. Component styling for common UI elements
4. Design patterns for consistent layouts
5. Animation guidelines from your tailwind configuration
6. Responsive design principles
7. Interaction states for interactive elements
8. Best practices for maintaining design consistency

You can save this as `STYLE_GUIDE.md` in your `docs` folder to maintain it alongside your other documentation files like `FIGMA.md` and `VISUAL_ASSETS.md`. Feel free to modify or expand any sections to better match your vision for the project!
Based on my review of your codebase, here's a comprehensive style guide in markdown format that you can add to your project:


# FormCoach - Style Guide

## 🎨 Color Palette

### Primary Colors
- **Background (Dark)**: `#020D0C` - Main app background
- **Primary Accent**: `#00C4B4` - Main brand color for buttons, highlights, icons
- **Text Primary**: `#D7E4E3` - Main text color
- **Text Secondary**: `#A4B1B7` - Labels and less important text
- **Subtext**: `#9CA3AF` - Tertiary information
- **Card Background**: `#1C1C1E` - Container backgrounds
- **Coming Soon**: `#2D2D2F` - Disabled or upcoming features

### Status Colors
- **Success**: `text-green-400` - Positive indicators
- **Warning**: `text-yellow-400` - Cautionary indicators
- **Alert**: `text-orange-400` - Attention indicators
- **Error**: `text-red-400` - Error indicators

### Transparent Overlays
- **Card Overlay**: `rgba(176,232,227,0.08)` - Subtle highlight for cards
- **Background Overlay**: `rgba(176,232,227,0.12)` - For modal backgrounds

## 📝 Typography

### Font Families
- **Primary**: 'Inter', sans-serif
- **Secondary**: 'Poppins', sans-serif

### Font Sizes
- **Page Title**: `text-2xl font-bold`
- **Section Heading**: `text-xl font-semibold`
- **Card Title**: `text-lg font-medium`
- **Body Text**: `text-base`
- **Labels**: `text-sm`
- **Captions**: `text-xs`

## 🧩 Components

### Buttons
- **Primary Button**: Teal background (`#00C4B4`), white text
- **Secondary Button**: Translucent overlay on dark background
- **Text Button**: No background, teal text
- **Disabled State**: 50% opacity

```jsx
<button className="bg-[#00C4B4] text-white px-4 py-2 rounded-md">
  Primary Button
</button>
Cards

Standard Card: Dark background (#1C1C1E), rounded corners (0.5rem)
Highlighted Card: Subtle teal overlay (rgba(176,232,227,0.08))
Padding: p-4 (1rem)

<div className="bg-[#1C1C1E] p-4 rounded-lg">
  Card Content
</div>
Form Elements

Input Fields: Dark background, light text, teal focus state
Labels: Positioned above inputs, light gray color
Validation: Red text for errors, green for success

<div className="space-y-2">
  <label className="text-[#A4B1B7] text-sm">Label</label>
  <input className="bg-[#1C1C1E] text-white border-0 rounded-md p-2 w-full focus:ring-1 focus:ring-[#00C4B4]" />
</div>
Icons

Icon Size: 20px standard (smaller for inline: 16px)
Icon Color: Teal (#00C4B4) for primary, light gray for secondary
Icon Library: Lucide React

<User size={20} className="text-[#00C4B4] mr-3" />
🎭 UI Patterns

Information Display

Use icon + label + value pattern for consistency
For example:

<div className="flex items-center">
  <Scale size={20} className="text-[#00C4B4] mr-3" />
  <span className="text-[#A4B1B7]">Weight:</span>
  <span className="ml-2 text-white">180 lbs</span>
</div>
Navigation

Bottom tabs for mobile-first navigation
Back buttons in top left for nested screens
Progress indicators for multi-step flows
Animations

Fade In: animate-fade-in - Smooth entrance animations
Accordion: animate-accordion-down - For expanding content
Confetti: Various speeds for celebrations (confetti-slow, confetti-medium, confetti-fast)
Transitions: 0.2s-0.5s ease-out for most UI transitions
💪 Workout-Specific Elements

Exercise Cards

Include exercise name, sets/reps, and form quality indicator
Use consistent muscle group color coding
Progress Indicators

Use clear visual indicators for progression
Green for improvement, yellow for maintenance, red for decline
Timer Elements

High contrast for visibility during workouts
Use the countdown animation for visual feedback
📱 Responsive Design

Breakpoints

Mobile: < 640px (default design target)
Tablet: 640px - 1024px
Desktop: > 1024px
Layout Principles

Mobile-first design approach
Stack elements vertically on mobile
Use grid layouts for larger screens
🎬 Interaction States

Buttons

Default: Standard styling
Hover: Slightly lighter background
Active: Slightly darker background
Focus: Ring outline in teal
Disabled: 50% opacity
Inputs

Default: Standard styling
Focus: Teal highlight ring
Error: Red outline or text
Disabled: Gray text, no interaction
🚀 Best Practices

Consistency: Use the defined color palette and typography consistently
Accessibility: Maintain sufficient contrast for text readability
Feedback: Provide visual feedback for all user interactions
Whitespace: Use generous spacing (space-y-6 for sections, space-y-2 for form fields)
Iconography: Always pair icons with text for clarity
Animation: Use animations purposefully to guide attention
Clarity: Prioritize readability and usability over decoration
Last updated: May 2, 2025


This style guide captures the visual language of your FormCoach application based on the code I've analyzed. It includes:

1. Your color system with both the shadcn/ui theme variables and the FormCoach-specific colors
2. Typography patterns used throughout the app
3. Component styling for common UI elements
4. Design patterns for consistent layouts
5. Animation guidelines from your tailwind configuration
6. Responsive design principles
7. Interaction states for interactive elements
8. Best practices for maintaining design consistency

You can save this as `STYLE_GUIDE.md` in your `docs` folder to maintain it alongside your other documentation files like `FIGMA.md` and `VISUAL_ASSETS.md`. Feel free to modify or expand any sections to better match your vision for the project!