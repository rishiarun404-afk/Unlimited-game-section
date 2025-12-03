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
        const data = req.body;
        console.log('Received data:', JSON.stringify(data));

        return res.status(200).json({
            success: true,
            message: 'Data received',
            received: data
        });
    } catch (err) {
        console.error('Error:', err.toString());
        return res.status(500).json({ error: err.toString() });
    }
};
