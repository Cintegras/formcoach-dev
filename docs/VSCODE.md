# 💻 VSCODE.md

## 🧠 Visual Studio Code – Copilot Testing & FormCoach Candidate

This environment is used to:

- 🧪 Test **Microsoft Copilot** as an AI coding assistant
- ⚙️ Evaluate VS Code as a **primary development tool** for FormCoach
- 🧼 Compare it to Lovable, Windsurf (Cascade), and PyCharm environments

---

## ✅ Setup (macOS)

### 1. Install VS Code

- Download from: [https://code.visualstudio.com](https://code.visualstudio.com)
- Move to: `/Applications/Developer Tools/Visual Studio Code.app`

### 2. CLI Access

Enable `code .` from terminal:
```
Cmd + Shift + P → Shell Command: Install 'code' command in PATH
```

---

## 🚀 Project Launch (FormCoach)

### Backend (FastAPI)
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

### Frontend (Vite + React)
```bash
cd frontend
npm install
npm run dev
```

---

## 🔌 Recommended Extensions

| Extension                     | Purpose                            |
|-------------------------------|------------------------------------|
| Microsoft Copilot Chat        | Test AI codegen                    |
| Python (Microsoft)            | Linting/debugging for FastAPI      |
| Pylance                       | Type checking                      |
| ESLint + Prettier             | Code quality                       |
| Tailwind CSS IntelliSense     | Frontend autocomplete              |
| GitLens                       | GitHub history + PR diffing        |

---

## 🧪 Copilot Test Prompts

Try in the Copilot Chat panel:

```
Create a FastAPI endpoint to log a workout with sets, reps, and weight
Generate a React form for tracking leg press performance
Refactor this backend to handle database errors more cleanly
```

Compare output to:
- ChatGPT (structured responses)
- Junie (actual deployable code)
- Cascade in Windsurf (component-scaffolded AI)

---

## 📊 Evaluation Criteria

| Feature                      | Copilot | ChatGPT | Junie | Windsurf |
|------------------------------|---------|---------|--------|----------|
| UI scaffolding               | ✅      | ⚠️      | ✅✅    | ✅✅       |
| TypeScript + Tailwind help   | ✅✅    | ⚠️      | ✅      | ✅        |
| Backend logic support        | ✅      | ✅      | ✅      | ✅        |
| FormCoach project ready?     | TBD     | ✅      | ✅      | ✅✅       |

---

## 🧭 Verdict (In Progress)

VS Code will be used alongside other tools to:
- Test Microsoft Copilot in real-world coding scenarios
- Compare AI prompt strategies
- Possibly promote it to a full-time development environment for FormCoach

---

🔌 Recommended Extensions

🧠 AI & GitHub
	•	GitHub Copilot
In-editor AI code suggestions to boost productivity across frontend and backend.
	•	GitHub Copilot Chat
Chat with Copilot inside VS Code to explain code, generate snippets, or fix bugs.
	•	GitHub Repositories
Browse and edit GitHub repos directly from VS Code without cloning them locally.
	•	Remote Repositories
Alternative for accessing and previewing GitHub projects without full checkout.

⸻

⚙️ Python & Backend
	•	Python
Core Python support including linting, IntelliSense, and environment management.
	•	Pylance
Fast, intelligent type-checking and code analysis for Python (especially FastAPI).
	•	Python Debugger
Breakpoints, step-through debugging, and variable inspection for Python projects.

⸻

🎨 Frontend (React, Tailwind, Vite)
	•	ESLint
Catches errors and enforces clean, consistent JavaScript/TypeScript code.
	•	Prettier - Code Formatter
Automatically formats code on save for consistency across teams.
	•	Tailwind CSS IntelliSense
Autocompletes Tailwind classes and shows real-time styling hints.
	•	Path Intellisense
Autocompletes file paths in your import statements.

⸻

📝 Documentation & UI Polish
	•	Markdown All in One
Enhances Markdown editing with preview, shortcuts, and auto-generated TOC.
	•	Error Lens
Visually highlights errors and warnings inline for immediate feedback.
	•	CodeSnap
Take beautiful screenshots of code blocks for documentation or sharing.

_Last updated: May 1, 2025_