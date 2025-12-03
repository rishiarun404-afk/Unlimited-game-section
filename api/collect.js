module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, publicIP, localIP, timestamp } = req.body;

        if (!email || !publicIP) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create data entry
        const entry = `email = ${email} | local_ip = ${localIP || 'N/A'} | public_ip = ${publicIP} | timestamp = ${timestamp}\n`;

        // Log to console (Vercel logs)
        console.log('Data collected:', entry);

        // Vercel doesn't have persistent file storage, so just log it
        // For production, use a database like MongoDB, Supabase, or Vercel KV

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
};
