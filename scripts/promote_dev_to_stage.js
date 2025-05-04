#!/usr/bin/env node

/**
 * promote_dev_to_stage.js
 *
 * This script safely copies appropriate files from formcoach-dev to formcoach-stage.
 * It uses fs-extra for file operations and logs the promotion process.
 */

// Check if fs-extra is installed
try {
    require('fs-extra');
} catch (err) {
    console.error('\x1b[31mError: fs-extra package is required but not installed.\x1b[0m');
    console.log('Please install it using: npm install fs-extra --save-dev');
    process.exit(1);
}

const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Get the current directory (assuming the script is run from the project root)
const currentDir = process.cwd();
const sourceDir = currentDir; // formcoach-dev directory
const destinationDir = path.resolve(path.dirname(currentDir), 'formcoach-stage'); // formcoach-stage directory

// Define included and excluded patterns
const includedItems = [
    'src',
    'docs',
    'supabase',
    'package.json',
    'pnpm-lock.yaml',
    'vite.config.ts',
    'tsconfig.json'
];

const excludedItems = [
    '.env',
    '.git',
    'node_modules',
    'dist',
    '.DS_Store',
    '.idea'
];

// Function to check if a file should be included
function shouldInclude(filePath) {
    const relativePath = path.relative(sourceDir, filePath);
    const fileName = path.basename(filePath);

    // Prevent script from copying itself
    const scriptFileName = path.basename(__filename);
    if (fileName === scriptFileName) return false;

    // Check if it's a markdown file (should be included)
    if (fileName.endsWith('.md')) {
        return true;
    }

    // Check if it's in the included list
    for (const item of includedItems) {
        if (relativePath === item || relativePath.startsWith(item + path.sep)) {
            // Now check if it's not in the excluded list
            for (const excludedItem of excludedItems) {
                if (relativePath === excludedItem || relativePath.startsWith(excludedItem + path.sep)) {
                    return false;
                }
            }
            return true;
        }
    }

    return false;
}

// Function to log promotion details
const promotedFiles = [];
const skippedFiles = [];
const errorFiles = [];

// Function to format date for the log
function formatDate() {
    const now = new Date();
    return now.toISOString().split('T')[0]; // YYYY-MM-DD format
}

// Function to save promotion summary
async function savePromotionSummary() {
    const logDir = path.join(destinationDir, 'docs', 'promotions');
    const logFile = path.join(logDir, 'PROMOTION_LOG_STAGE.md');

    // Create the directory if it doesn't exist
    await fs.ensureDir(logDir);

    // Create the log entry
    const timestamp = formatDate();
    const logEntry = `\n## 📦 Promotion on ${timestamp}\n` +
        `- Promoted files from formcoach-dev → formcoach-stage\n` +
        `- Skipped .env and node_modules\n` +
        `- Includes updates to src/, docs/, supabase/, and config files\n\n`;

    // Append to the log file or create it if it doesn't exist
    try {
        if (await fs.pathExists(logFile)) {
            await fs.appendFile(logFile, logEntry);
        } else {
            await fs.writeFile(logFile, `# Promotion Log - Stage Environment\n${logEntry}`);
        }
        console.log(`\n✅ Promotion summary saved to ${logFile}`);
    } catch (err) {
        console.error(`\n❌ Error saving promotion summary: ${err.message}`);
    }
}

// Main function to perform the promotion
async function promoteDevToStage() {
    console.log('\n🚀 Starting promotion from formcoach-dev to formcoach-stage...\n');

    // Exit if source and destination directories are the same
    if (sourceDir === destinationDir) {
        console.error('❌ Source and destination directories are the same.');
        process.exit(1);
    }

    // Warn if not promoting to stage
    if (!destinationDir.includes('formcoach-stage')) {
        console.warn('⚠️ Destination does not appear to be the stage folder.');
    }

    // Check if destination directory exists
    if (!await fs.pathExists(destinationDir)) {
        console.error(`\x1b[31mError: Destination directory '${destinationDir}' does not exist.\x1b[0m`);
        console.log('Please create the formcoach-stage directory first.');
        process.exit(1);
    }

    // Confirm with the user
    rl.question(`This will copy files from:\n  ${sourceDir}\nto:\n  ${destinationDir}\n\nAre you sure you want to continue? (y/n): `, async (answer) => {
        if (answer.toLowerCase() !== 'y') {
            console.log('Promotion cancelled.');
            rl.close();
            return;
        }

        try {
            // Process each included item
            for (const item of includedItems) {
                const sourcePath = path.join(sourceDir, item);
                const destPath = path.join(destinationDir, item);

                if (await fs.pathExists(sourcePath)) {
                    // Check if it's a directory or file
                    const stats = await fs.stat(sourcePath);

                    if (stats.isDirectory()) {
                        // For directories, we need to copy files individually to respect exclusions
                        await fs.ensureDir(destPath);

                        // Get all files in the directory recursively
                        const files = await getAllFiles(sourcePath);

                        for (const file of files) {
                            if (shouldInclude(file)) {
                                const relativePath = path.relative(sourceDir, file);
                                const fileDestPath = path.join(destinationDir, relativePath);

                                try {
                                    await fs.ensureDir(path.dirname(fileDestPath));
                                    await fs.copy(file, fileDestPath, {overwrite: true});
                                    promotedFiles.push(relativePath);
                                    console.log(`✅ Copied: ${relativePath}`);
                                } catch (err) {
                                    errorFiles.push({path: relativePath, error: err.message});
                                    console.error(`❌ Error copying ${relativePath}: ${err.message}`);
                                }
                            } else {
                                const relativePath = path.relative(sourceDir, file);
                                skippedFiles.push(relativePath);
                            }
                        }
                    } else {
                        // For individual files
                        try {
                            await fs.copy(sourcePath, destPath, {overwrite: true});
                            promotedFiles.push(item);
                            console.log(`✅ Copied: ${item}`);
                        } catch (err) {
                            errorFiles.push({path: item, error: err.message});
                            console.error(`❌ Error copying ${item}: ${err.message}`);
                        }
                    }
                } else {
                    console.warn(`⚠️ Source item not found: ${item}`);
                }
            }

            // Copy all markdown files at the root level
            const rootFiles = await fs.readdir(sourceDir);
            for (const file of rootFiles) {
                if (file.endsWith('.md')) {
                    const sourcePath = path.join(sourceDir, file);
                    const destPath = path.join(destinationDir, file);

                    try {
                        const stats = await fs.stat(sourcePath);
                        if (stats.isFile()) {
                            await fs.copy(sourcePath, destPath, {overwrite: true});
                            promotedFiles.push(file);
                            console.log(`✅ Copied: ${file}`);
                        }
                    } catch (err) {
                        errorFiles.push({path: file, error: err.message});
                        console.error(`❌ Error copying ${file}: ${err.message}`);
                    }
                }
            }

            // Print summary
            console.log('\n📋 Promotion Summary:');
            console.log(`- Files promoted: ${promotedFiles.length}`);
            console.log(`- Files skipped: ${skippedFiles.length}`);
            console.log(`- Errors encountered: ${errorFiles.length}`);

            // Log the promoted file count
            console.log(`\n📦 Total files copied to stage: ${promotedFiles.length}`);

            // Save promotion summary
            await savePromotionSummary();

            console.log('\n✨ Promotion completed!');
        } catch (err) {
            console.error(`\n❌ Promotion failed: ${err.message}`);
        } finally {
            rl.close();
        }
    });
}

// Helper function to get all files in a directory recursively
async function getAllFiles(dir) {
    const files = [];

    const items = await fs.readdir(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stats = await fs.stat(fullPath);

        if (stats.isDirectory()) {
            const subFiles = await getAllFiles(fullPath);
            files.push(...subFiles);
        } else {
            files.push(fullPath);
        }
    }

    return files;
}

// Run the promotion
promoteDevToStage();

// Export key helpers for testability
module.exports = {shouldInclude, getAllFiles};
