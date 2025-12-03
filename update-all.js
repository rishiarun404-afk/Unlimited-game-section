const https = require('https');
const fs = require('fs');

const token = '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';

async function updateFile(filename, filepath) {
    const content = fs.readFileSync(filepath, 'utf8');
    const base64 = Buffer.from(content).toString('base64');
    const body = JSON.stringify({
        message: 'Fix: Configure Vercel to use serverless API and serve static files',
        content: base64
    });

    const options = {
        hostname: 'api.github.com',
        path: `/repos/rishiarun404-afk/Unlimited-game-section/contents/${filename}`,
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Node.js',
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode === 200 || res.statusCode === 201) {
                    resolve(filename);
                } else {
                    reject(new Error(`${filename}: ${res.statusCode}`));
                }
            });
        }); req.on('error', reject);
        req.write(body);
        req.end();
    });
}

(async () => {
    try {
        console.log('Updating files on GitHub...\n');

        await updateFile('vercel.json', './vercel.json');
        console.log('✓ vercel.json updated');

        await updateFile('api/collect.js', './api/collect.js');
        console.log('✓ api/collect.js updated');

        await updateFile('api/system-info.js', './api/system-info.js');
        console.log('✓ api/system-info.js updated');

        console.log('\n✅ All files updated on GitHub!');
        console.log('Vercel will automatically redeploy in ~30 seconds.');
        console.log('\nTry your site again:');
        console.log('  https://unlimited-game-section.vercel.app');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
})();
