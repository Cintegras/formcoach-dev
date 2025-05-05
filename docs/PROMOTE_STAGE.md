# 🟡 PROMOTE_STAGE.md

## 🧭 Purpose

This checklist guides the safe promotion of the FormCoach application from **Development** (🔵) to **Staging** (🟡). It
provides a structured approach to ensure data integrity, proper environment configuration, and successful deployment.

---

## ✅ Pre-Promotion Checks

### 🔐 Data Integrity

- [ ] **Run development verification script**
  ```bash
  # Ensure you're in the formcoach-dev PyCharm project
  cd formcoach-dev/

  # Confirm environment
  echo $VITE_FORMCOACH_ENV  # Should output: dev

  # Run the verification script
  node docs/supabase/run_verification_dev.js
  ```
    - Script validates:
        - All data uses `environment = 'dev'`
        - Referential integrity across all relational tables
    - If any checks fail, review the detailed error messages and fix issues before proceeding

### 🧪 Code Quality Checks

- [ ] **Ensure all tests pass**
  ```bash
  # Run tests
  npm test
  ```

- [ ] **Check for linting issues**
  ```bash
  # Run linter
  npm run lint
  ```

- [ ] **Verify build succeeds**
  ```bash
  # Build the application
  npm run build
  ```

---

## 🚫 Data Integrity Safeguards

- [ ] **Confirm environment variables are correctly set**
    - Check `.env` file in development:
      ```env
      VITE_FORMCOACH_ENV=dev
      VITE_SUPABASE_URL_DEV=https://<dev>.supabase.co
      VITE_SUPABASE_KEY_DEV=your_development_anon_key
      ```
    - Check `.env` file in staging:
      ```env
      VITE_FORMCOACH_ENV=stage
      VITE_SUPABASE_URL_STAGE=https://<stage>.supabase.co
      VITE_SUPABASE_KEY_STAGE=your_staging_anon_key
      ```

---

## 📜 Logging and Documentation

- [ ] **Update `CHANGELOG_STAGE.md`**  
  Include:
    - Promotion date
    - Summary of features or fixes
    - Development verification result

---

## 💾 Backup & Recovery

- [ ] **Create a database snapshot before promotion**:
  ```bash
  # Ensure you're in the formcoach-stage PyCharm project
  cd formcoach-stage/

  # Create a timestamped backup directory
  mkdir -p backups/$(date +%Y%m%d)

  # Export the database schema and data
  supabase db dump -f backups/$(date +%Y%m%d)/stage_backup_$(date +%Y%m%d_%H%M%S).sql

  # Verify the backup file was created
  ls -la backups/$(date +%Y%m%d)/
  ```

- [ ] **Document the backup location and timestamp in `CHANGELOG_STAGE.md`**

---

## ✅ Final Promotion Checklist

- [ ] **Environment Verification**
    - [ ] Using the correct PyCharm project: `formcoach-dev` for source
    - [ ] `.env` file contains `VITE_FORMCOACH_ENV=dev` in development
    - [ ] Supabase URL and keys are correctly configured for development

- [ ] **Data Integrity**
    - [ ] Development verification passed: `run_verification_dev.js`
    - [ ] All referential integrity checks passed

- [ ] **Code Quality**
    - [ ] All tests pass
    - [ ] No linting issues
    - [ ] Build succeeds

- [ ] **Backup & Recovery**
    - [ ] Stage database snapshot created and verified
    - [ ] Backup location and timestamp documented

- [ ] **Documentation**
    - [ ] `CHANGELOG_STAGE.md` updated with promotion details
    - [ ] All promotion steps documented

---

## 🚀 Promotion Process

### Manual Promotion

```bash
# Ensure you're in the formcoach-dev PyCharm project
cd formcoach-dev/

# Run the promotion script
node scripts/promote_dev_to_stage.js
```

### Automated Promotion (GitHub Actions)

1. Go to the GitHub repository
2. Navigate to Actions > "Promote Dev to Stage"
3. Click "Run workflow"
4. Type "yes" in the confirmation field
5. Click "Run workflow"

### Post-Promotion Verification

```bash
# Ensure you're in the formcoach-stage PyCharm project
cd formcoach-stage/

# Confirm environment
echo $VITE_FORMCOACH_ENV  # Should output: stage

# Run the verification script
node docs/supabase/run_verification_stage.js
```

### Rollback Procedure (if needed)

If issues are detected after promotion:

```bash
# Restore from backup
supabase db restore backups/$(date +%Y%m%d)/stage_backup_*.sql

# Revert to previous version (if applicable)
cd formcoach-stage/
git checkout <previous-commit>
npm install
npm run build
```