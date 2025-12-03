#!/usr/bin/env node
/**
 * Create GitHub Repository automatically
 */

const https = require('https');

function makeRequest(options, data) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    if (res.statusCode === 201) {
                        resolve(parsed);
                    } else if (res.statusCode === 422 && parsed.errors && parsed.errors[0].message.includes('exists')) {
                        resolve({ html_url: `https://github.com/rishiarun404-afk/Unlimited-game-section`, exists: true });
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}: ${parsed.message || body}`));
                    }
                } catch (e) {
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
        const username = 'rishiarun404-afk';
        const token = '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';
        const repoName = 'Unlimited-game-section';

        console.log('🚀 Creating GitHub Repository...\n');
        console.log(`📦 Repository: ${username}/${repoName}\n`);

        console.log('⏳ Sending request to GitHub API...');

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

        if (result.exists) {
            console.log('✓ Repository already exists!\n');
        } else {
            console.log('✓ Repository created successfully!\n');
        }

        console.log('📱 Repository URL:');
        console.log(`   ${result.html_url}\n`);

        console.log('✅ Done! Now run:');
        console.log('   node auto-push.js\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('\nPlease check:');
        console.error('- Your token is valid: https://github.com/settings/tokens');
        console.error('- Token has "repo" permission');
        console.error('- Username is correct: rishiarun404-afk');
        process.exit(1);
    }
})();
