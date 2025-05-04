# Scripts Documentation

This directory contains various utility scripts for the FormCoach project.

## Promotion Scripts

### promote_dev_to_stage.js

A Node.js script that safely copies appropriate files from the formcoach-dev directory to the formcoach-stage directory.

#### Features

- Copies only the appropriate files and folders:
    - Includes: src/, docs/, supabase/, all .md files, package.json, pnpm-lock.yaml, vite.config.ts, tsconfig.json
    - Excludes: .env, .git, node_modules, dist/, .DS_Store, .idea/
- Uses fs-extra to perform the copy with overwrite confirmation
- Logs which files were promoted
- Saves a promotion summary with timestamp to docs/promotions/PROMOTION_LOG_STAGE.md
- Requires user confirmation before proceeding

### promote_dev_to_stage_ci.js

A CI/CD version of the promotion script that doesn't require user input. It's designed to be used in GitHub Actions
workflows for automated promotion from dev to stage.

#### Features

- Same file inclusion/exclusion rules as the interactive version
- No user input required, making it suitable for CI/CD environments
- Returns proper exit codes (0 for success, 1 for failure)
- Exports helper functions for testability
- Used by the GitHub Actions workflow

### Prerequisites

The script requires the fs-extra package. If not already installed, you can install it with:

```bash
npm install fs-extra --save-dev
```

### Usage

#### Local Usage

Run the script from the project root directory:

```bash
./scripts/promote_dev_to_stage.js
```

Or using Node.js:

```bash
node scripts/promote_dev_to_stage.js
```

The script will:

1. Ask for confirmation before proceeding
2. Copy the files from formcoach-dev to formcoach-stage
3. Log the promotion process
4. Save a promotion summary to docs/promotions/PROMOTION_LOG_STAGE.md

#### GitHub Actions Workflow

You can also use the GitHub Actions workflow to automate the promotion process:

1. Go to the "Actions" tab in the GitHub repository
2. Select the "Promote Dev to Stage" workflow
3. Click "Run workflow"
4. Type "yes" in the confirmation input to confirm the promotion
5. Click "Run workflow" to start the process

The workflow will:

1. Check out both the dev and stage repositories
2. Run a modified version of the promotion script
3. Commit and push the changes to the stage repository
4. Provide success/failure notifications

**Note:** The workflow requires a `REPO_ACCESS_TOKEN` secret to be set up in the GitHub repository with permissions to
push to the formcoach-stage repository.

### Output

The script provides detailed output during execution:

- ✅ Successfully copied files
- ⚠️ Warnings for files that couldn't be found
- ❌ Errors encountered during copying

At the end, a summary is displayed showing:

- Number of files promoted
- Number of files skipped
- Number of errors encountered

A promotion log entry is also added to docs/promotions/PROMOTION_LOG_STAGE.md with the following format:

```markdown
## 📦 Promotion on YYYY-MM-DD
- Promoted files from formcoach-dev → formcoach-stage
- Skipped .env and node_modules
- Includes updates to src/, docs/, supabase/, and config files
```
