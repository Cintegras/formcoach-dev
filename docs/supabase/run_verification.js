/**
 * Script to run the verification SQL and check if all data was entered correctly
 */

import {execSync} from 'child_process';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import dotenv from 'dotenv';

// Get the database connection string from .env file
// This assumes you have a DATABASE_URL in your .env file
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to run the verification script
function runVerification() {
    console.log('Running verification script to check data integrity...');

    try {
        // Read the verification SQL
        const verificationSql = fs.readFileSync(path.join(__dirname, 'verification_script.sql'), 'utf8');

        // Execute the SQL using psql (assumes PostgreSQL)
        // Replace this with the appropriate database connection method for your setup
        const result = execSync(`psql "${process.env.DATABASE_URL}" -f ${path.join(__dirname, 'verification_script.sql')}`, {encoding: 'utf8'});

        console.log('Verification Results:');
        console.log(result);

        // Check if the verification was successful
        if (result.includes('ALL CHECKS PASSED')) {
            console.log('\n✅ SUCCESS: All data was entered correctly!');
        } else {
            console.log('\n❌ WARNING: Some checks failed. Please review the results above.');
        }
    } catch (error) {
        console.error('Error running verification script:', error.message);
        if (error.stdout) {
            console.log('Output:', error.stdout);
        }
        if (error.stderr) {
            console.error('Error output:', error.stderr);
        }
    }
}

// Run the verification
runVerification();
