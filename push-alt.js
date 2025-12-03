#!/usr/bin/env node
/**
 * Push using git smart HTTP protocol via Node.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

(async () => {
    try {
        const username = 'rishiarun404-afk';
        const token = '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';
        const repoName = 'Unlimited-game-section';
        const dir = process.cwd();

        console.log('🚀 Pushing to GitHub...\n');
        console.log(`📦 Repository: ${username}/${repoName}`);
        console.log(`📁 Directory: ${dir}\n`);

        const git = require('isomorphic-git');

        // Get the current commit SHA
        console.log('⏳ Getting commit information...');
        const commits = await git.log({ dir, fs, depth: 1 });
        if (!commits || commits.length === 0) {
            throw new Error('No commits found in repository');
        }

        const latestCommit = commits[0];
        console.log(`✓ Latest commit: ${latestCommit.oid.substring(0, 7)}`);
        console.log(`  Message: ${latestCommit.commit.message}\n`);

        // Try alternative: use git.push with different configuration
        console.log('⏳ Attempting push with alternate method...');

        const http = require('isomorphic-git/http/node');

        const pushResult = await git.push({
            dir,
            fs,
            http,
            remote: 'origin',
            branch: 'main',
            onAuth: () => ({ username, password: token }),
            force: false
        }).catch(async (err) => {
            // If push fails, try creating the branch first
            console.log('⚠️  Initial push failed, trying alternate approach...\n');

            // Get all refs
            const refs = await git.listRefs({ dir, fs });
            console.log('Local refs:', refs);

            throw err;
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

    } catch (error) {
        console.error('\n❌ Error:', error.message);

        console.error('\n🔧 Troubleshooting:');
        console.error('The isomorphic-git library is having trouble pushing via HTTP.');
        console.error('\n✅ Alternative: Use GitHub Desktop or VS Code');
        console.error('   1. Install GitHub Desktop: https://desktop.github.com');
        console.error('   2. Open the project folder in GitHub Desktop');
        console.error('   3. Commit and push (GitHub Desktop will handle authentication)\n');

        console.error('📱 Your repository is ready at:');
        console.error('   https://github.com/rishiarun404-afk/Unlimited-game-section\n');

        process.exit(1);
    }
})();
