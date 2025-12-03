const fs = require('fs');
const path = require('path');

module.exports = async function handler(req, res) {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        let data = req.body;

        // Parse body if it's a string
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }

        console.log('Received data:', JSON.stringify(data));

        // Try to save to file (if writable directory exists)
        try {
            const tmpDir = '/tmp';
            const filePath = path.join(tmpDir, 'collected_emails.json');

            // Read existing data
            let existingData = [];
            if (fs.existsSync(filePath)) {
                try {
                    const fileContent = fs.readFileSync(filePath, 'utf8');
                    existingData = JSON.parse(fileContent);
                } catch (e) {
                    console.log('Could not parse existing file');
                }
            }

            // Add new data
            existingData.push({
                ...data,
                receivedAt: new Date().toISOString()
            });

            // Write back
            fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
            console.log('Data saved to:', filePath);
        } catch (fileErr) {
            console.log('Could not save to file (normal on Vercel):', fileErr.message);
        }

        return res.status(200).json({
            success: true,
            message: 'Data received successfully',
            received: data
        });
    } catch (err) {
        console.error('Error processing request:', err);
        return res.status(500).json({
            error: 'Failed to process request',
            details: err.message
        });
    }
};
