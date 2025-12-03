#!/usr/bin/env node
/**
 * Push to GitHub using isomorphic-git
 */

const readline = require('readline');
const fs = require('fs');
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
        const git = require('isomorphic-git');
        const http = require('isomorphic-git/http/node');

        const dir = process.cwd();

        console.log('=== Push to GitHub ===\n');

        // Get GitHub credentials
        const username = await question('GitHub username: ');
        const token = await question('GitHub personal access token (generate at https://github.com/settings/tokens): ');
        const repoName = await question('Repository name (e.g., Unlimited-game-section): ');

        const remoteUrl = `https://github.com/${username}/${repoName}.git`;

        console.log('\n⏳ Setting up remote...');

        // Check if remote exists and remove it to reconfigure
        try {
            const remotes = await git.listRemotes({ dir, fs });
            if (remotes.find(r => r.remote === 'origin')) {
                await git.removeRemote({ dir, fs, remote: 'origin' });
                console.log('✓ Old remote removed');
            }
        } catch (e) {
            // Remote might not exist
        }

        // Add remote
        await git.addRemote({ dir, fs, remote: 'origin', url: remoteUrl });
        console.log('✓ Remote added:', remoteUrl);

        console.log('⏳ Pushing to GitHub...');

        // Push to GitHub with authentication
        const result = await git.push({
            dir,
            fs,
            http,
            remote: 'origin',
            branch: 'main',
            onAuth: () => ({ username, password: token }),
            onAuthFailure: (url) => {
                throw new Error(`Authentication failed for ${url}. Check your token and username.`);
            }
        });

        console.log('✓ Push successful!');
        console.log('\n📱 Your repository is now at:');
        console.log(`   https://github.com/${username}/${repoName}`);

        console.log('\n✅ Done!');
        console.log('\nNext: Deploy on Vercel');
        console.log('1. Go to https://vercel.com');
        console.log('2. Click "New Project"');
        console.log('3. Import Git Repository and select your GitHub repo');
        console.log('4. Set Root Directory to "."');
        console.log('5. Click Deploy');

        rl.close();

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.message.includes('404') || error.message.includes('not found')) {
            console.error('\n⚠️  Repository might not exist. Make sure it\'s created on GitHub first.');
            console.error('Go to: https://github.com/new');
        }
        rl.close();
        process.exit(1);
    }
})();
