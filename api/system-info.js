import os from 'os';

export default function handler(req, res) {
    try {
        const hostname = os.hostname();
        const username = process.env.USER || process.env.USERNAME || 'user';

        return res.status(200).json({
            email: `${username}@gmail.com`,
            hostname: hostname,
            platform: process.platform
        });
    } catch (error) {
        console.error('Error getting system info:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
