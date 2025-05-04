# 🔴 PROMOTE_PROD.md

## 🧭 Purpose

This checklist guides the safe promotion of the FormCoach application from **Staging** (🟡) to **Production** (🔴). It is
based on the `PROMOTE_STAGE.md` structure and adjusted for production-specific risks, including stricter data
protections, RLS enforcement, and irreversible actions.

---

## ✅ Pre-Promotion Checks

### 🔐 Row Level Security (RLS)

- [ ] **Confirm all tables enforce RLS**
    - RLS must include: `environment = 'prod'`
    - Supabase > SQL Editor > `RLS_POLICY_GUIDE.md` should match production behavior

- [ ] **Run production verification script**
  ```bash
  # Ensure you're in the formcoach PyCharm project
  cd formcoach/

  # Confirm environment
  echo $VITE_FORMCOACH_ENV  # Should output: prod

  # Run the verification script
  node docs/supabase/run_verification_prod.js
  ```
    - Script validates:
        - All data uses `environment = 'prod'`
        - No mock/test records present
        - Referential integrity across all relational tables
        - RLS policies include environment filtering
        - No sensitive data exposure
    - If any checks fail, review the detailed error messages and fix issues before proceeding

### 🧪 Final Staging Verification

- [ ] Run staging verification script:
  ```bash
  # Ensure you're in the formcoach-stage PyCharm project
  cd formcoach-stage/

  # Confirm environment
  echo $VITE_FORMCOACH_ENV  # Should output: stage

  # Run the verification script
  node docs/supabase/run_verification_stage.js
  ```
    - ✅ All tests must pass before promoting
    - If any checks fail, address the issues before proceeding

---

## 🚫 Data Integrity Safeguards

- [ ] Add production blockers in all seed/migration scripts
    - Hardcoded check to prevent execution in `prod` unless explicitly confirmed
    - Example:
      ```ts
      if (ENV === 'prod') {
        throw new Error("❌ Seed scripts are not allowed in production.");
      }
      ```

- [ ] Confirm `.env` for production includes:
    ```env
    VITE_FORMCOACH_ENV=prod
    VITE_SUPABASE_URL_PROD=https://<prod>.supabase.co
    VITE_SUPABASE_KEY_PROD=your_production_anon_key
    ```

---

## 📜 Logging and Documentation

- [ ] Update `CHANGELOG_PROD.md`  
  Include:
    - Promotion date
    - Summary of features or fixes
    - Staging verification result
    - Manual QA notes (if applicable)

- [ ] Create a version tag or commit label if applicable (e.g., `v1.0.0-prod`)

---

## 💾 Backup & Recovery

- [ ] Create a database snapshot before deployment:
  ```bash
  # Ensure you're in the formcoach PyCharm project
  cd formcoach/

  # Create a timestamped backup directory
  mkdir -p backups/$(date +%Y%m%d)

  # Export the database schema and data
  supabase db dump -f backups/$(date +%Y%m%d)/prod_backup_$(date +%Y%m%d_%H%M%S).sql

  # Verify the backup file was created
  ls -la backups/$(date +%Y%m%d)/
  ```

- [ ] Document the backup location and timestamp in `CHANGELOG_PROD.md`

- [ ] Verify backup restoration process (optional but recommended):
  ```bash
  # Test restore to a temporary database (if available)
  supabase db restore backups/$(date +%Y%m%d)/prod_backup_$(date +%Y%m%d_%H%M%S).sql -d temp_restore_test
  ```

---

## ✅ Final Promotion Checklist

- [ ] **Environment Verification**
    - [ ] Using the correct PyCharm project: `formcoach`
    - [ ] `.env` file contains `VITE_FORMCOACH_ENV=prod`
    - [ ] Supabase URL and keys are correctly configured for production

- [ ] **Data Integrity**
    - [ ] Staging verification passed: `run_verification_stage.js`
    - [ ] Production verification passed: `run_verification_prod.js`
    - [ ] No test/mocked data present in production
    - [ ] All referential integrity checks passed

- [ ] **Security**
    - [ ] All tables have RLS policies with `environment = 'prod'` filtering
    - [ ] No sensitive data exposure detected
    - [ ] Production blockers added to all seed/migration scripts

- [ ] **Backup & Recovery**
    - [ ] Database snapshot created and verified
    - [ ] Backup location and timestamp documented

- [ ] **Documentation**
    - [ ] `CHANGELOG_PROD.md` updated with promotion details
    - [ ] Version tag or commit label created (if applicable)
    - [ ] All promotion steps documented

---

## 🚀 Promotion Process

### Pre-Deployment Final Check

```bash
# Ensure you're in the formcoach production PyCharm project
cd formcoach/

# Confirm environment
echo $VITE_FORMCOACH_ENV  # Should output: prod

# Run a final verification
node docs/supabase/run_verification_prod.js
```

### Deployment Options

#### Option 1: Manual Deployment

```bash
# Build the application
npm run build

# Deploy to hosting service (example)
npm run deploy:prod
```

#### Option 2: CI/CD Pipeline

```bash
# Trigger the production deployment pipeline
git tag v1.0.0-prod
git push origin v1.0.0-prod
```

### Post-Deployment Verification

```bash
# Verify the deployment
curl -I https://formcoach.com  # Should return HTTP 200

# Run smoke tests (if available)
npm run test:smoke:prod
```

### Rollback Procedure (if needed)

If issues are detected after deployment:

```bash
# Restore from backup
supabase db restore backups/$(date +%Y%m%d)/prod_backup_*.sql

# Deploy previous version (if applicable)
git checkout <previous-tag>
npm run build
npm run deploy:prod
```
