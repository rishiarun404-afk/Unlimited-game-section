#!/usr/bin/env node
/**
 * Alternative push using native git via exec
 */

const { execSync } = require('child_process');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise(resolve => {
        rl.question(prompt, resolve);
    });
}

(async () => {
    try {
        console.log('=== Push to GitHub (Alternative Method) ===\n');

        const username = await question('GitHub username: ');
        const token = await question('GitHub personal access token: ');
        const repoName = await question('Repository name (e.g., Unlimited-game-section): ');

        const dir = process.cwd();
        const remoteUrl = `https://${username}:${token}@github.com/${username}/${repoName}.git`;

        console.log('\n⏳ Configuring git...');

        // Set git config
        try {
            execSync(`git config --global user.name "GitHub User"`, { stdio: 'pipe' });
            execSync(`git config --global user.email "user@github.com"`, { stdio: 'pipe' });
            console.log('✓ Git configured');
        } catch (e) {
            // Might not have git installed, but that's ok for this approach
        }

        console.log('⏳ Setting up remote...');

        // Remove existing remote if it exists
        try {
            execSync(`cd "${dir}" && git remote remove origin`, { stdio: 'pipe' });
        } catch (e) {
            // Remote might not exist
        }

        // Add remote
        execSync(`cd "${dir}" && git remote add origin "${remoteUrl}"`, { stdio: 'pipe' });
        console.log('✓ Remote added');

        console.log('⏳ Pushing to GitHub...');

        // Push to GitHub
        try {
            execSync(`cd "${dir}" && git push -u origin main`, { stdio: 'inherit' });
            console.log('\n✓ Push successful!');
            console.log('\n📱 Your repository is at:');
            console.log(`   https://github.com/${username}/${repoName}`);
        } catch (error) {
            // Check if git exists
            if (error.message.includes('not recognized')) {
                console.error('\n❌ Error: Git is not installed or not in PATH');
                console.error('\nAlternative: Use GitHub Desktop or VS Code to push');
                console.error('Or install Git for Windows from: https://git-scm.com/download/win');
            } else {
                throw error;
            }
        }

        console.log('\n✅ Done!');
        rl.close();

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        rl.close();
        process.exit(1);
    }
})();
