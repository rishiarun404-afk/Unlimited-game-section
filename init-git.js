#!/usr/bin/env node
/**
 * Simple Git initialization using isomorphic-git
 * This provides an alternative to the native git CLI
 */

const fs = require('fs');
const path = require('path');

// Try to initialize git with isomorphic-git
(async () => {
    try {
        const git = require('isomorphic-git');

        const dir = process.cwd();

        console.log(`Initializing git repository in: ${dir}`);

        // Initialize repo
        await git.init({ dir, fs });
        console.log('✓ Git repository initialized');

        // Configure user
        await git.setConfig({
            dir,
            fs,
            path: 'user.name',
            value: 'GitHub User'
        });

        await git.setConfig({
            dir,
            fs,
            path: 'user.email',
            value: 'user@example.com'
        });
        console.log('✓ User configured');

        // Add all files
        const files = getAllFiles(dir);
        const filesToAdd = files.filter(f => !f.includes('.git') && !f.includes('node_modules'));

        for (const file of filesToAdd) {
            const relativePath = path.relative(dir, file);
            await git.add({ dir, fs, filepath: relativePath });
        }
        console.log(`✓ Added ${filesToAdd.length} files`);

        // Create commit
        const sha = await git.commit({
            dir,
            fs,
            message: 'Initial commit: Unlimited Game Section with email and IP collection'
        });
        console.log(`✓ Created commit: ${sha}`);

        console.log('\nNext steps:');
        console.log('1. Create a repository on GitHub');
        console.log('2. Go to https://github.com/new and create "Unlimited-game-section"');
        console.log('3. Add remote: git remote add origin https://github.com/YOUR_USERNAME/Unlimited-game-section.git');
        console.log('4. Push: npx isomorphic-git@latest push --dir . --remote origin --branch main --http');

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
})();

function getAllFiles(dir) {
    const files = [];

    function walk(currentPath) {
        const items = fs.readdirSync(currentPath);

        for (const item of items) {
            if (['node_modules', '.git', '.DS_Store', 'ips'].includes(item)) continue;

            const fullPath = path.join(currentPath, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                walk(fullPath);
            } else {
                files.push(fullPath);
            }
        }
    }

    walk(dir);
    return files;
}
