#!/bin/bash

mkdir -p docs/lovable

# 1. OVERVIEW.md
cat << 'EOF' > docs/lovable/OVERVIEW.md
# 🧠 OVERVIEW.md

Lovable is an AI UI builder used to scaffold the initial frontend for FormCoach.

🔗 [Lovable Project Link](https://lovable.dev/projects/42f59d51-67bf-443d-9192-c1f0e4342039)
EOF

# 2. BUILT_FEATURES.md
cat << 'EOF' > docs/lovable/BUILT_FEATURES.md
# 🏗️ BUILT_FEATURES.md

## What Was Built in Lovable

- Workout dashboard layout  
- Swappable exercise block UI  
- Component scaffolds with shadcn-ui  
- Tailwind styling structure  
- Base file export to \`src/\`
EOF

# 3. EDITING_GUIDE.md
cat << 'EOF' > docs/lovable/EDITING_GUIDE.md
# 💻 EDITING_GUIDE.md

## Editing the UI

### Option 1: Edit in Lovable

- Go to [Lovable Project](https://lovable.dev/projects/42f59d51-67bf-443d-9192-c1f0e4342039)
- Make changes via prompts
- Changes are auto-committed to GitHub

---

### Option 2: Edit in Your IDE

\`\`\`bash
git clone https://github.com/Cintegras/formcoach.git
cd formcoach
cd frontend
npm install
npm run dev
\`\`\`

---

## Style Prompt Suggestions

_Paste your original style prompt here or link to it_
EOF

# 4. SUPABASE_SETUP.md
cat << 'EOF' > docs/lovable/SUPABASE_SETUP.md
# 🛠️ SUPABASE_SETUP.md

## What Is Supabase?

Supabase is an open-source Firebase alternative providing:

- PostgreSQL database  
- Authentication  
- Real-time subscriptions  
- File storage  
- Edge Functions  

---

## Setup with FormCoach

1. Click the green Supabase button in Lovable  
2. Set up Auth + RLS  
3. Migrate from localStorage to Supabase tables  

---

## Recommended Environment Setup

- Dev: Local dev and test  
- Staging: QA review  
- Production: Live app  

### Config Example

\`\`\`ts
const config = {
  url: process.env.SUPABASE_DEV_URL,
  anonKey: process.env.SUPABASE_DEV_ANON_KEY
}
\`\`\`

---

## 💸 Pricing Summary

- Free: 500MB DB, 1GB file storage  
- Pro: $25/month (8GB DB, backups, unlimited auth)

---

## 🧠 Backend Strategy

- Lovable helps you define tables and RLS  
- You guide schema structure  
- Together, you build a real-time fitness tracker
EOF

# 5. README.md
cat << 'EOF' > docs/lovable/README.md
# 💠 Lovable Docs Index

Documentation for how Lovable is used in the FormCoach project.

- [Overview](./OVERVIEW.md)  
- [What Was Built](./BUILT_FEATURES.md)  
- [Editing Guide (Lovable + IDE)](./EDITING_GUIDE.md)  
- [Supabase Setup](./SUPABASE_SETUP.md)
EOF

echo "✅ Lovable docs split into 4 files under docs/lovable/"