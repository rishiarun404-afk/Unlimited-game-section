#!/usr/bin/env node
/**
 * Fix remote URL and push
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

        console.log('🚀 Fixing remote URL and pushing...\n');

        // Remove old remote with space
        console.log('⏳ Removing broken remote...');
        try {
            await git.removeRemote({ dir, fs, remote: 'origin' });
            console.log('✓ Broken remote removed\n');
        } catch (e) {
            console.log('✓ No broken remote found\n');
        }

        // Add correct remote (without token embedded - will use onAuth)
        console.log('⏳ Adding correct remote...');
        const remoteUrl = `https://github.com/${username}/${repoName}.git`;
        try {
            await git.addRemote({ dir, fs, remote: 'origin', url: remoteUrl, force: true });
        } catch (e) {
            // Try removing and re-adding
            try {
                await git.removeRemote({ dir, fs, remote: 'origin' });
            } catch (e2) { }
            await git.addRemote({ dir, fs, remote: 'origin', url: remoteUrl });
        }
        console.log(`✓ Remote added: ${remoteUrl}\n`);        // Verify remote
        const remotes = await git.listRemotes({ dir, fs });
        console.log('Verified remotes:');
        remotes.forEach(r => console.log(`  ${r.remote}: ${r.url}`));
        console.log();

        // Push
        console.log('⏳ Pushing to GitHub...');
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
        process.exit(1);
    }
})();
