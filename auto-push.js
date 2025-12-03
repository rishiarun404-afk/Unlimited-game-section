#!/usr/bin/env node
/**
 * Automated GitHub push with credentials
 */

const fs = require('fs');
const path = require('path');

(async () => {
    try {
        const git = require('isomorphic-git');
        const http = require('isomorphic-git/http/node');

        // Your credentials (replace with your actual values)
        const username = 'rishiarun404-afk';
        const token = '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';
        const repoName = 'Unlimited-game-section';

        const dir = process.cwd();
        const remoteUrl = `https://github.com/${username}/${repoName}.git`;

        console.log('🚀 Starting automated GitHub push...\n');
        console.log(`📦 Repository: ${username}/${repoName}`);
        console.log(`📁 Directory: ${dir}\n`);

        // Step 1: Remove old remote if exists
        console.log('⏳ Step 1: Cleaning up old remote...');
        try {
            const remotes = await git.listRemotes({ dir, fs });
            if (remotes.find(r => r.remote === 'origin')) {
                await git.removeRemote({ dir, fs, remote: 'origin' });
                console.log('✓ Old remote removed\n');
            }
        } catch (e) {
            console.log('✓ No old remote found\n');
        }

        // Step 2: Add new remote
        console.log('⏳ Step 2: Adding GitHub remote...');
        try {
            await git.addRemote({ dir, fs, remote: 'origin', url: remoteUrl });
            console.log('✓ Remote added:', remoteUrl + '\n');
        } catch (e) {
            console.log('✓ Remote already configured\n');
        }

        // Step 3: Push to GitHub
        console.log('⏳ Step 3: Pushing code to GitHub...');
        console.log('This may take a minute...\n');

        try {
            const result = await git.push({
                dir,
                fs,
                http,
                remote: 'origin',
                branch: 'main',
                onAuth: () => ({ username, password: token }),
                onAuthFailure: (url) => {
                    throw new Error(`Authentication failed. Check token and username.`);
                }
            });

            console.log('✓ Push successful!\n');
            console.log('✅ All done!\n');
            console.log('📱 Your repository:\n   https://github.com/' + username + '/' + repoName);
            console.log('\n🚀 Next step: Deploy on Vercel');
            console.log('   1. Go to https://vercel.com');
            console.log('   2. Click "New Project"');
            console.log('   3. Import your GitHub repository');
            console.log('   4. Set Root Directory to: .');
            console.log('   5. Click "Deploy"\n');

        } catch (pushError) {
            console.error('❌ Push error:', pushError.message);

            if (pushError.message.includes('404')) {
                console.error('\n⚠️  Repository not found on GitHub!');
                console.error('Please create it manually at: https://github.com/new');
                console.error('Name: ' + repoName);
                process.exit(1);
            }

            throw pushError;
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('\nDebug info:');
        console.error('- Check your token is valid: https://github.com/settings/tokens');
        console.error('- Make sure repository exists: https://github.com/new');
        console.error('- Verify username and repo name are correct');
        process.exit(1);
    }
})();
