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
