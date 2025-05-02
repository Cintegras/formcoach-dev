# 🧠 FormCoach App Prompt for AI

> 💾 **Backup Prompt (Emergency Use)**  
> If the FormCoach project is ever lost or needs to be rebuilt from scratch, paste this prompt into Lovable to regenerate the core UI, functionality, and structure.

---

## 🧭 Overview

Create a modern fitness tracking application called **FormCoach** with a sleek, dark-themed interface.  
The app should help users track workouts, set fitness goals, and monitor their progress over time.

---

## 🎨 Core UI/Design Requirements

### 🎨 Color Palette
- **Primary:** `#00C4B4` (teal)
- **Background:** `#020D0C` (nearly black)
- **Text:** `#A4B1B7`, `#B0E8E3` (light blue/gray variants)
- **Cards:** `rgba(176, 232, 227, 0.08)` (semi-transparent teal)

### 🖋️ Typography
- **Font Family:** `Inter`
- Clean, minimalist hierarchy:
  - `32px` → main headings
  - `20px` → section headers
  - `16px` → body text

### 🧱 Design System
- **Theme:** Dark mode only
- **Corners:** `8px` radius
- **Feel:** Sleek, spacious, minimal
- **Hover States:** Subtle but responsive
- **Transitions:** Smooth animations

---

## 🔧 Core Functionality

### 🔐 User Authentication
- Signup, login, and password recovery
- Multi-step profile setup (wheel selectors)

### 👤 Profile Management
- Name, height, weight, age input
- BMI calculation with visual status
- Cache clearing (for dev/testing)

### 🏋️ Workout System
- Category and cardio selection
- Timer (play/pause/stop)
- Workout progress and review flow

### 📈 Progress Tracking
- Trend page: weight + workouts
- Charts and visual summaries
- Calendar-based workout schedule

---

## 🧩 Key Components

### 🔽 Bottom Navigation
- Tabs: Home, Workout, Trends, Profile
- Teal highlight for active state

### 🔘 Buttons
- Primary: Teal with black text
- Secondary: Transparent with border

### 🧾 Form Elements
- Custom wheel selectors
- Input fields with icons
- Toggle/radio via button groups

### 🔄 Special Components
- Workout timer bars
- Step indicators
- Toast notifications

---

## 📄 Pages to Create

### 🚀 Onboarding
- Splash, welcome, and profile steps
- Medical disclaimer

### 🏠 Main Screens
- Home: greeting + suggestions
- Workout setup
- Cardio timer
- Trends page
- Profile/settings

### 💪 Workout Flow
- Category → Exercise → Timer → Summary

---

## ⚙️ Tech Stack

- **React** (18.x)
- **React Router**
- **Tailwind CSS**
- **LocalStorage** for persistence
- **Responsive** (mobile-first)
- **Animations** via library

---

## ✨ Special Features

- BMI indicator
- Wheel-based input
- Pausable workout timer
- Trend visualization
- Personalized content