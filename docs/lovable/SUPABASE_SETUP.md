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
