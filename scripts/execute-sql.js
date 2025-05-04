#!/usr/bin/env node

import {execSync} from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to SQL files
const sqlDir = path.join(__dirname, '..', 'docs', 'supabase', 'sql');

// Get all SQL files
const sqlFiles = fs.readdirSync(sqlDir)
    .filter(file => file.endsWith('.sql'))
    .sort(); // Sort to ensure they're executed in order

console.log('Starting SQL execution...');

// Execute each SQL file
for (const file of sqlFiles) {
    const filePath = path.join(sqlDir, file);
    console.log(`Executing ${file}...`);

    try {
        // Read the SQL file
        const sql = fs.readFileSync(filePath, 'utf8');

        // Execute the SQL using supabase CLI
        // Note: This assumes supabase CLI is installed and configured
        const tempSqlFile = path.join(__dirname, 'temp.sql');
        fs.writeFileSync(tempSqlFile, sql);

        execSync(`supabase db execute --file ${tempSqlFile}`, {stdio: 'inherit'});

        // Clean up temp file
        fs.unlinkSync(tempSqlFile);

        console.log(`✅ Successfully executed ${file}`);
    } catch (error) {
        console.error(`❌ Error executing ${file}:`, error.message);
    }
}

console.log('SQL execution completed.');
