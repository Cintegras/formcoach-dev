# 🧠 AI_ASSISTANTS.md

## 🤖 AI Copilot Strategy for FormCoach

FormCoach uses a multi-AI strategy to assist with UI generation, code scaffolding, backend logic, and contextual refactoring. This doc outlines how each assistant contributes to the development workflow, and when to use which tool.

---

## 🧠 ChatGPT (GPT-4 / GPT-4o)

### Role:
- Strategic planning
- Document generation
- Markdown formatting
- Prompt refinement and debugging
- Conversational QA

### Use cases:
- Drafting `README.md` files, `.md` docs, and onboarding flows
- Writing and iterating on prompts for Junie or Lovable
- High-context system mapping and structured guidance

### When to use:
- Long-form or structured writing
- Planning project folders or epics
- Clarifying logic, dependencies, or test flows

---

## 🤖 Junie (Codegen + UI / Next.js + Supabase)

### Role:
- AI code generation and frontend scaffolding
- Tailwind/React UI layout with reusable components
- Next.js and Supabase integration
- Environment-aware assistant with automatic INIT.md parsing

### Use cases:
- Creating full UI screens based on prompt input
- Translating Notion or figma screen requirements into actual code
- Scaffolding backend endpoints with Typescript handlers
- Providing environment-aware assistance based on INIT.md

### When to use:
- You need real deployable code from prompts
- Working inside the Junie CLI or Supabase context
- Bridging database logic with user-facing screens
- When you need environment-aware assistance

### INIT Protocol:

Junie automatically loads and parses `docs/INIT.md` at the start of every session to understand:

- The current environment (dev, stage, or prod)
- The correct Supabase project, URL, and key setup
- The active PyCharm project (formcoach-dev, formcoach-stage, or formcoach)

When initialized, Junie displays a confirmation message:

```
✅ INIT.md loaded and parsed. Environment: [dev/stage/prod]. Project: [formcoach-dev/formcoach-stage/formcoach].
```

This ensures that Junie always has the correct context for the current environment and can provide appropriate
assistance.

---

## 🦾 Grok (X / formerly Twitter AI)

### Role:
- Quick answers and low-latency feedback on code or logic
- Follow-up research via X (Twitter) context
- Less structured, more reactive

### Use cases:
- Rapid clarification of coding syntax or terms
- Lightweight debugging
- Startup/VC trend monitoring or Elon-adjacent dev tools

### When to use:
- As a second opinion during a coding session
- When Grok offers stronger integration with platforms you're exploring (e.g. xCloud or Twitter API)

---

## 🎯 How They Work Together

| Task                          | ChatGPT | Junie | Grok  |
|------------------------------|---------|-------|-------|
| Writing docs or prompts      | ✅      | ❌    | ⚠️    |
| React/Tailwind scaffolding   | ⚠️      | ✅    | ❌    |
| Debugging AI prompt output   | ✅      | ✅    | ✅    |
| Backend logic (FastAPI/Nest) | ✅      | ✅    | ⚠️    |
| Multi-step planning          | ✅✅     | ❌    | ❌    |
| UI layout generation         | ⚠️      | ✅✅   | ❌    |

---

## 🧪 Prompt Styles (Best Practices)

**ChatGPT:**
- Clear role + task framing
- Ask for structure (e.g. “Give me a one-block markdown doc”)
- Add context like filenames or system constraints

**Junie:**
- Begin with: `"Generate a [UI/feature] screen with the following structure:"`
- Include examples of component names or layout expectations
- Favor declarative, component-based language

**Grok:**
- Keep short: one question per message
- Useful for syntax checks or side questions, not structured builds

---

## 🧱 Future Plans

- [ ] Fine-tune prompt workflows for faster Junie handoffs
- [ ] Build prompt library and version tracking
- [ ] Compare Microsoft Copilot vs GitHub Copilot vs ChatGPT for React/FastAPI parity

---

_Last updated: May 3, 2025_
