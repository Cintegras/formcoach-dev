# 🎨 FIGMA.md

## 🧩 Design System in Figma

FormCoach uses [Figma](https://www.figma.com) for layout ideation, visual design, component planning, and collaboration with AI-driven tools like **Magician** or screenshot-to-component workflows.

---

## ✅ Use Cases

- 🔘 Wireframe screen flows
- 🏋️‍♂️ Design muscle overlays for exercises
- 🧠 Visualize AI-generated components before export
- 📦 Export SVGs or image assets for frontend use

---

## 🎛 AI Tools in Figma

### 🪄 Magician (by Diagram)
Used to:
- Auto-generate components with Tailwind styles
- Draft UI ideas from text prompts
- Generate form layouts or workout card skeletons

> Prompt example:
> ```
> Create a workout tracking card with 3 sets, weight + reps, and form rating badge.
> ```

---

### 📸 Screenshot-to-Component Workflow

When copying design ideas from apps like Fitbod or Whoop:
1. Take a screenshot
2. Paste into Figma frame
3. Use Magician or GPT-4 to recreate layout
4. Copy structure into Lovable or code directly in React

---

## 🧱 Component Naming Tips

Use consistent naming:
[Screen] / [Section] / [Component]

Examples:
Workout / Card / Set Tracker
Settings / Modal / ConfirmDelete

This supports future design-token export or handoff.

---

## 🧼 Figma Cleanup Checklist

- ✅ Organize frames left to right (e.g. Home → Workout → Progress)
- ✅ Use autolayout for all major sections
- ✅ Rename layers + frames clearly
- ✅ Export icons and overlays as SVGs
- ✅ Group interactive states (hover, active, disabled)

---

## 📁 Asset Export for Code

- Icons: `.svg`  
- Muscle diagrams: `.png` or `.webp`  
- Backgrounds/UI: `.svg` preferred  
- Store in: `/frontend/public/assets/` or `/frontend/src/assets/`

---

### 🔗 External References

See [VISUAL_ASSETS.md](./VISUAL_ASSETS.md) for design inspiration sources like Mobbin, Adobe Stock, Envato, and more.

---

_Last updated: May 1, 2025_