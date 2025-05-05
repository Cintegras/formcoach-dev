[![Promote to Stage](https://github.com/${{ github.repository }}/actions/workflows/promote-to-stage.yml/badge.svg)](https://github.com/${{
github.repository }}/actions/workflows/promote-to-stage.yml)

# 🏋️‍♂️ FormCoach

FormCoach is an AI-assisted fitness planner focused on helping users build better form, track workouts safely, and adapt routines in real-time. It integrates form video analysis, soreness-aware adjustments, and equipment-aware routines for gym and home users.

🧠 This project is part of the **Adaptive Wellness System**, a broader initiative that includes nutrition tracking, symptom modeling, wearable sync, and real-life activity planning.

---

## 🔧 Key Features

- 🏋️ Machine-based, personalized workout planner
- 🧠 AI form critique via user-uploaded videos
- 🔁 Smart set adjustment based on fatigue & performance
- 💬 Conversational interface (via ChatGPT, Copilot, Cascade)
- 📊 Trends, soreness tracking, and gym/home adaptability

---

## 🚀 Getting Started

For detailed setup instructions, please see the [START_HERE.md](START_HERE.md) guide.

### Quick Start

```bash
# Start the application with guided setup
./scripts/start-project.sh
```

Or manually:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

> 💡 Requires: Node.js 16+, npm, and optionally Supabase CLI for local development.

---

## 📁 Folder Structure

```
formcoach-dev/
├── src/                       # Source code
│   ├── components/            # React components
│   ├── features/              # Feature modules (auth, etc.)
│   ├── hooks/                 # React hooks for data access
│   ├── integrations/          # External integrations
│   │   └── supabase/          # Supabase client and types
│   ├── lib/                   # Utility functions
│   └── services/              # Service layer for data access
│       └── supabase/          # Supabase service implementations
├── supabase/                  # Supabase configuration
├── docs/                      # Documentation and SQL scripts
├── scripts/                   # Utility scripts
│   └── start-project.sh       # Script to start the project
├── START_HERE.md              # Getting started guide
└── README.md                  # You're here
```

---

## 🧭 Dev Environments & Docs

FormCoach is developed across multiple tools. Each has its own setup guide:

| Environment           | Purpose                                     | Doc                                |
|-----------------------|---------------------------------------------|-------------------------------------|
| 🌀 Windsurf           | AI-in-editor via Cascade + Git workflows    | [WINDSURF.md](docs/WINDSURF.md)     |
| 🎨 Lovable            | Prompt-based UI generation (React/Tailwind) | [LOVABLE.md](docs/LOVABLE.md)       |
| 💻 VS Code            | Microsoft Copilot testing + hybrid editing  | [VSCODE.md](docs/VSCODE.md)         |
| 🧠 PyCharm            | Python + FastAPI backend development        | [PYCHARM.md](docs/PYCHARM.md)       |
| 🖼 Figma              | UI/UX asset layout and component planning   | [FIGMA.md](docs/FIGMA.md)           |
| 📦 Visual Assets     | Mobbin, Envato, Adobe Stock, Unsplash       | [VISUAL_ASSETS.md](docs/VISUAL_ASSETS.md) |
| 🤖 AI Assistants     | ChatGPT, Junie, Grok usage strategy         | [AI_ASSISTANTS.md](docs/AI_ASSISTANTS.md) |

---

## 🧠 AI + Prompt Strategy

FormCoach uses a multi-AI approach for development:

| Tool         | Role                                 |
|--------------|--------------------------------------|
| **ChatGPT**  | Docs, prompt writing, refactoring    |
| **Junie**    | React + Next.js + Supabase scaffolds |
| **Cascade**  | Component generation inside Windsurf |
| **Copilot**  | Local AI coding testbed in VS Code   |
| **Grok**     | Quick answers, syntax checks         |

Prompts are structured and stored in `prompt_library/` (WIP).

---

## 🛠 Tools Used

- ⚛️ React + Vite (frontend)
- 🔥 Supabase (backend, authentication, database)
- 🎨 Tailwind CSS + shadcn/ui
- 🧪 TypeScript, ESLint
- 🔄 Real-time subscriptions for live updates
- 🔒 Row Level Security (RLS) for data protection
- 🔗 Integrated with GitHub, Windsurf, and Microsoft Copilot Chat

---

## 🌱 Roadmap

- [x] Build machine-based 4-day workout planner
- [x] Add AI-generated form critique cards
- [ ] Sync with wearables (Apple Watch, Whoop, Oura)
- [ ] Auto-adjust sets based on fatigue metrics
- [ ] Weekly muscle group planner
- [ ] Nutrition + symptom crossover (via Adaptive Wellness)
- [ ] Mobile-first design refinement

---

## 📜 License

© 2025 Cintegras LLC. All rights reserved. This is part of the Adaptive Wellness development system and is not yet open source.

---

_Last updated: May 1, 2025_
