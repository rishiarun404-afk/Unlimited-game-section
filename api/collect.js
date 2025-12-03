import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, publicIP, localIP, timestamp, userAgent } = req.body;

        if (!email || !publicIP) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create data entry
        const entry = `email = ${email} | local_ip = ${localIP} | public_ip = ${publicIP} | timestamp = ${timestamp}\n`;

        // Log to console (Vercel logs)
        console.log('Data collected:', entry);

        // For local testing, you can write to a file
        // For production, consider using a database instead
        try {
            const logFile = path.join(process.cwd(), 'collections.txt');
            fs.appendFileSync(logFile, entry, 'utf8');
        } catch (fileError) {
            console.warn('Could not write to file:', fileError.message);
        }

        return res.status(200).json({
            success: true,
            message: 'Data collected successfully',
            savedEmail: email,
            savedIPs: { publicIP, localIP }
        });
    } catch (error) {
        console.error('Error collecting data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
