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

### 1. Clone the Repo

```bash
git clone https://github.com/Cintegras/formcoach.git
cd formcoach
```

### 2. Start the App

```bash
./run.sh
```

Stop all processes:

```bash
./stop.sh
```

> 💡 Requires: Python 3.9+, Node.js, `uvicorn`, and `npm`.

---

## 📁 Folder Structure

```
formcoach/
├── backend/           # FastAPI (main.py, venv, API logic)
├── frontend/          # Vite + React + Tailwind UI
├── docs/              # Dev environment guides
├── run.sh             # Launch backend + frontend
├── stop.sh            # Stop all running processes
└── README.md          # You're here
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

- ⚙️ FastAPI (backend)
- ⚛️ React + Vite (frontend)
- 🎨 Tailwind CSS + shadcn/ui
- 🧪 pytest, ESLint, Prettier
- 🧱 MongoDB planned for future DB work
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
