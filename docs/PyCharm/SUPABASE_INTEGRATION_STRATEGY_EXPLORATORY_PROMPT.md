# Supabase Integration Strategy (Exploratory Prompt for Junie)

Project: FormCoach
Context: FormCoach is an AI-assisted fitness tracking app with a React frontend, a FastAPI or Node.js backend, and plans
to use Supabase for backend services including database, authentication, and possibly edge functions.

The app supports personalized workout plans, machine-based exercise tracking, user-uploaded videos for form critique,
and progression over time. Future features may include muscle group overlays, soreness/fatigue logging, and AI-based
workout recommendations.

---
**Question for you, Junie:**

What would be the best Supabase implementation plan for this project?

Please outline:

1. ✅ Which Supabase services should be used and why (e.g., Auth, DB, Storage, Edge Functions).
2. ✅ What the core schema might look like — include any recommended entities, relationships, and data types.
3. ✅ How user authentication and role-based data access (e.g., row-level security) should be set up.
4. ✅ What design decisions should be made now vs. deferred until post-MVP.
5. ✅ Any caveats or gotchas when using Supabase for fitness tracking at scale.
6. ✅ How Supabase can support AI feedback workflows (e.g., storing video form clips, linking analysis data).
7. ✅ Any recommendations for local development or DevOps strategy when integrating Supabase.

Please return your response in Markdown with clearly labeled sections. If relevant, include a Mermaid ERD or SQL snippet
to illustrate relationships.

## 🔁 Strategy Refinement Requests for Junie

This section outlines enhancements to the existing Supabase Integration Strategy. These refinements are based on
ChatGPT, Grok, and project-specific architectural needs. Please update the strategy accordingly.

---

### 🧩 1. Environment Strategy: Dev / Stage / Prod

**🟢 Goal:** Add full support for separate development, staging, and production Supabase environments.

**📝 Request for Junie:**
> "Add a plan for managing dev, stage, and prod Supabase projects.  
> Include .env configuration patterns for both Lovable (Vite) and PyCharm (Python), and CLI commands for schema
> migration using Supabase CLI."

**💡 Output Example:**

- `.env.development`, `.env.staging`, `.env.production`
- Use `os.getenv(f'SUPABASE_URL_{env.upper()}')` in Python
- CLI: `supabase db dump`, `supabase db push`

---

### 🏋️‍♀️ 2. Set-Level Tracking Table

**🟢 Goal:** Normalize sets into a separate table for better tracking and AI feedback per set.

**📝 Request for Junie:**
> "Replace weights_used and reps_completed arrays with a `sets` table.  
> Include SQL schema and update logic for frontend (Lovable) and backend (PyCharm)."

**💡 Output Example:**

```sql
CREATE TABLE sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exercise_log_id UUID REFERENCES exercise_logs(id) ON DELETE CASCADE,
  set_number INTEGER,
  reps INTEGER,
  weight NUMERIC,
  video_url TEXT,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


## 🧠 Prompt for Junie – Implement Post-MVP Enhancements (Database Only)

Junie, please implement the following Post-MVP database features in Supabase, with SQL definitions, appropriate RLS policies, and relevant backend logic. These features are not required for the MVP UI, but we want to scaffold them now and validate integration across environments.

---

### 🛡️ 1. Rate Limiting / API Usage Logging
- Create a table `api_usage` to log Edge Function and endpoint activity:
  - Fields: `id`, `user_id`, `endpoint`, `request_time`, `request_details`
  - Use this for future abuse detection or quota management

---

### 🧾 2. Audit Logs for Sensitive Activity
- Create an `audit_logs` table to track updates/deletes on key tables (e.g., `profiles`, `workout_plans`)
  - Fields: `id`, `user_id`, `action_type`, `table_name`, `record_id`, `change_summary`, `created_at`
- Optional: Include triggers or Edge Function template to log changes on relevant tables

---

### 🧪 3. Schema Version Tracker
- Create a `schema_versions` table to document applied patches or manual schema changes
  - Fields: `id`, `description`, `applied_at`, `environment`

---

### 🧑‍🏫 4. Coach Notes System
- Create a `coach_notes` table for trainers to leave feedback on `exercise_logs`
  - Fields: `id`, `coach_id`, `user_id`, `exercise_log_id`, `note`, `created_at`
- Implement RLS:
  - Only `coach_id` or `user_id` can view/insert notes tied to them
  - Assume a `user_roles` or `profiles.subscription_tier` is available for basic role filtering

---

### 🧼 5. Storage Quota Support
- Alter `video_uploads` table:
  - Add `keep_forever BOOLEAN DEFAULT false`
- Create an Edge Function stub:
  - Deletes videos older than 30 days if `keep_forever = false`
  - Use Supabase Scheduler or external CRON to trigger

---

### ✅ Deliverables
- SQL table definitions for all 5 features
- Sample RLS policies
- Test insert examples (Ginger & Jack)
- Triggers or function stubs where applicable
- Environment-agnostic (works in dev, stage, prod)