# 🧠 PYCHARM.md

## ⚙️ Backend Development in PyCharm (FastAPI)

FormCoach uses [PyCharm](https://www.jetbrains.com/pycharm/) to manage and run the backend, built with **FastAPI**, Python 3, and Pydantic. PyCharm provides full IDE support, interactive debugging, Python linting, and test discovery.

---

## ✅ Setup Instructions

### 1. Open the Project in PyCharm

- Open only the backend folder:
  ```
  /Users/jackhemmert/Developer/Windsurf/formcoach/backend
  ```

- Or open the whole repo and right-click `/backend`, then select:
  ```
  Mark Directory as > Sources Root
  ```

---

### 2. Set Up Python Interpreter

- Go to: `Preferences > Project > Python Interpreter`
- Choose an existing interpreter, or create a new one:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

Then install dependencies:

```bash
pip install -r requirements.txt
```

---

## ▶ Running the App

### Option A: Run from Terminal

```bash
uvicorn main:app --reload
```

Runs on: `http://127.0.0.1:8000`

---

### Option B: Create a PyCharm Run Configuration

1. Go to: `Run > Edit Configurations`
2. Click `+` → **Python**
3. Set:
   - **Name**: `FastAPI Dev`
   - **Script path**: `uvicorn`
   - **Parameters**: `main:app --reload`
   - **Working directory**: `backend`
   - **Interpreter**: point to `venv/bin/python`

✅ Hit ▶️ to start the server.

---

## 🧪 Running Tests

Use:

```bash
pytest
```

Or right-click any test file/function and choose **Run with pytest**.

To make pytest the default runner:

```
Preferences > Tools > Python Integrated Tools > Default Test Runner
```

---

## 🔌 Recommended Plugins for PyCharm

- ✅ FastAPI plugin
- ✅ Pydantic plugin
- ✅ `.env` support
- ✅ Black (formatter)
- ✅ isort (import sorter)

---

## 🧠 GitHub Integration

Use PyCharm’s Git tools, or via terminal:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

> Tip: Windsurf also supports Git, but PyCharm offers GUI diffs and staging.

---

## 🧼 PyCharm vs Windsurf

| Feature                         | PyCharm ✅ | Windsurf ✅ |
|----------------------------------|-----------|-------------|
| Backend Debugging               | ✅        | ❌          |
| FastAPI Route Execution         | ✅        | ✅ (terminal only) |
| AI Assistance (Cascade)         | ❌        | ✅          |
| GitHub Integration              | ✅        | ✅          |
| Terminal Access                 | ✅        | ✅          |
| React Frontend Editing          | ❌        | ✅          |

---

## 📁 Folder Structure (Relevant to PyCharm)

```
formcoach/
├── backend/
│   ├── main.py
│   ├── venv/
│   ├── requirements.txt
├── frontend/
├── run.sh
├── stop.sh
└── docs/
    └── PYCHARM.md
```

---

_Last updated: May 1, 2025_