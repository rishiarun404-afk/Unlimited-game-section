#!/usr/bin/env node
const git = require('isomorphic-git');
const fs = require('fs');
const http = require('isomorphic-git/http/node');
const path = require('path');
require('dotenv').config();

(async () => {
    try {
        const token = process.env.GITHUB_TOKEN;
        if (!token) {
            console.error('❌ Error: GITHUB_TOKEN not found in .env file');
            process.exit(1);
        }
        console.log('Pushing main branch...\n');
        const result = await git.push({
            dir: '.',
            fs,
            http,
            remote: 'origin',
            branch: 'main',
            force: true,
            onAuth: () => ({
                username: 'rishiarun404-afk',
                password: token
            })
        }); console.log('✅ Push successful!\n');
        console.log('📱 Your repository: https://github.com/rishiarun404-afk/Unlimited-game-section\n');
        console.log('🚀 Next: Deploy on Vercel');
        console.log('   1. Go to https://vercel.com');
        console.log('   2. Click "New Project"');
        console.log('   3. Import your GitHub repository');
        console.log('   4. Set Root Directory to: .');
        console.log('   5. Click "Deploy"\n');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
})();
