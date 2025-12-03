#!/usr/bin/env node
/**
 * Direct push with master branch
 */

const git = require('isomorphic-git');
const fs = require('fs');
const http = require('isomorphic-git/http/node');

(async () => {
    try {
        const dir = process.cwd();
        const username = 'rishiarun404-afk';
        const token = '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';
        const repoName = 'Unlimited-game-section';

        console.log('🚀 Pushing master branch to GitHub...\n');

        // Push master branch (GitHub will automatically set as default or we update later)
        console.log('⏳ Pushing master to GitHub...');
        const result = await git.push({
            dir,
            fs,
            http,
            remote: 'origin',
            branch: 'master',
            force: true,
            onAuth: () => ({ username, password: token })
        });

        console.log('✓ Push successful!\n');
        console.log('✅ Code is now on GitHub!\n');
        console.log('📱 Your repository:\n   https://github.com/' + username + '/' + repoName);
        console.log('\n⚠️  Note: Branch is named "master". To use "main" instead:');
        console.log('   Go to Settings > Branches and set default branch to "main" (if it exists)\n');
        console.log('🚀 Next: Deploy on Vercel');
        console.log('   1. Go to https://vercel.com');
        console.log('   2. Click "New Project"');
        console.log('   3. Import your GitHub repository');
        console.log('   4. Set Root Directory to: .');
        console.log('   5. Click "Deploy"\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
})();
