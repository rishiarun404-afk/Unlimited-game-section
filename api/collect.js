const fs = require('fs');
const path = require('path');

// Try to use Firebase, fallback to local if not available
let admin;
try {
    admin = require('./firebase-config');
} catch (err) {
    console.log('Firebase not configured, using local storage only');
}

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

        // Add timestamp
        const collectionRecord = {
            ...data,
            collectedAt: new Date().toISOString(),
            id: Date.now()
        };

        // Log to console (visible in Vercel logs)
        console.log('========== EMAIL COLLECTED ==========');
        console.log('Email:', data.email);
        console.log('Public IP:', data.publicIP);
        console.log('Local IP:', data.localIP);
        console.log('Timestamp:', collectionRecord.collectedAt);
        console.log('User Agent:', data.userAgent);
        console.log('=====================================');

        // Store in memory (persists for this function instance)
        // collectedData.push(collectionRecord);
        // console.log(`Total collected in this session: ${collectedData.length}`);

        // Save to Firebase
        if (admin && admin.database) {
            try {
                const database = admin.database();
                await database.ref('collections').push(collectionRecord);
                console.log('Data saved to Firebase successfully');
            } catch (firebaseErr) {
                console.log('Firebase save error:', firebaseErr.message);
            }
        }

        // Also try to save locally if running on localhost
        if (process.env.NODE_ENV !== 'production') {
            try {
                const projectRoot = path.join(__dirname, '..');
                const dataDir = path.join(projectRoot, 'ips');
                const filePath = path.join(dataDir, 'Collections.txt');

                if (!fs.existsSync(dataDir)) {
                    fs.mkdirSync(dataDir, { recursive: true });
                }

                const line = `${collectionRecord.collectedAt} | Email: ${data.email} | Public IP: ${data.publicIP} | Local IP: ${data.localIP}\n`;
                fs.appendFileSync(filePath, line);
                console.log('Data saved to local file:', filePath);
            } catch (fileErr) {
                console.log('Could not save to local file:', fileErr.message);
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Data collected successfully',
            received: collectionRecord
        });
    } catch (err) {
        console.error('Error processing request:', err);
        return res.status(500).json({
            error: 'Failed to process request',
            details: err.message
        });
    }
};