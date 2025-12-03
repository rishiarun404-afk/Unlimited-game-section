#!/usr/bin/env node
/**
 * Rename master to main and push
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

        console.log('🚀 Renaming branch and pushing...\n');

        // Get current branch
        console.log('⏳ Checking branches...');
        const branches = await git.listBranches({ dir, fs });
        console.log(`✓ Current branches: ${branches.join(', ')}\n`);

        // If master exists, rename to main
        if (branches.includes('master')) {
            console.log('⏳ Renaming master → main...');

            // Create main branch pointing to master
            const masterSha = await git.resolveRef({ dir, fs, ref: 'master' });
            await git.writeRef({ dir, fs, ref: 'refs/heads/main', value: masterSha });
            console.log('✓ Branch renamed\n');
        }

        // Push main branch
        console.log('⏳ Pushing main branch to GitHub...');
        const result = await git.push({
            dir,
            fs,
            http,
            remote: 'origin',
            branch: 'main',
            onAuth: () => ({ username, password: token })
        });

        console.log('✓ Push successful!\n');
        console.log('✅ All done!\n');
        console.log('📱 Your repository:\n   https://github.com/' + username + '/' + repoName);
        console.log('\n🚀 Next: Deploy on Vercel');
        console.log('   1. Go to https://vercel.com');
        console.log('   2. Click "New Project"');
        console.log('   3. Import your GitHub repository');
        console.log('   4. Set Root Directory to: .');
        console.log('   5. Click "Deploy"\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('\nTrying alternative approach...');
        process.exit(1);
    }
})();
