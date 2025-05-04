/**
 * Script to run the verification SQL and check if all data was entered correctly
 */

const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');

// Get the database connection string from .env file
// This assumes you have a DATABASE_URL in your .env file
require('dotenv').config();

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
