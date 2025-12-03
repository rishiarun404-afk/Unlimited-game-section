module.exports = async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const body = req.body || {};
        const email = String(body.email || '').trim();
        const publicIP = String(body.publicIP || '').trim();
        const localIP = String(body.localIP || 'N/A').trim();
        const timestamp = String(body.timestamp || new Date().toISOString()).trim();

        // Validation
        if (!email || email.length === 0) {
            return res.status(400).json({ error: 'Email is required' });
        }

        if (!publicIP || publicIP.length === 0) {
            return res.status(400).json({ error: 'Public IP is required' });
        }

        // Log the data
        const logEntry = `[${timestamp}] Email: ${email} | Local IP: ${localIP} | Public IP: ${publicIP}`;
        console.log('Data received:', logEntry);

        // Return success
        return res.status(200).json({
            success: true,
            message: 'Data collected successfully',
            email: email,
            publicIP: publicIP,
            localIP: localIP,
            timestamp: timestamp
        });

    } catch (error) {
        console.error('Error in collect handler:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message || 'Unknown error'
        });
    }
};
