#!/usr/bin/env node
/**
 * Create GitHub repository via GitHub API
 */

const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise(resolve => {
        rl.question(prompt, resolve);
    });
}

function makeRequest(options, data) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode === 201) {
                    resolve(JSON.parse(body));
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${body}`));
                }
            });
        });

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

(async () => {
    try {
        console.log('=== Create GitHub Repository ===\n');

        const username = await question('GitHub username: ');
        const token = await question('GitHub personal access token: ');
        const repoName = await question('Repository name (e.g., Unlimited-game-section): ');

        console.log('\n⏳ Creating repository on GitHub...');

        const options = {
            hostname: 'api.github.com',
            path: '/user/repos',
            method: 'POST',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Node.js',
                'Content-Type': 'application/json'
            }
        };

        const repoData = {
            name: repoName,
            description: 'Unlimited Game Section - Email and IP data collection',
            private: false,
            auto_init: false
        };

        const result = await makeRequest(options, repoData);

        console.log('✓ Repository created successfully!');
        console.log('\n📱 Repository URL:');
        console.log(`   ${result.html_url}`);

        console.log('\n✅ Done! Now you can push your code:');
        console.log('\n   node push-to-github.js');

        rl.close();

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.message.includes('422')) {
            console.error('\n⚠️  Repository might already exist. Try pushing with:');
            console.error('    node push-to-github.js');
        }
        rl.close();
        process.exit(1);
    }
})();
