module.exports = function handler(req, res) {
    try {
        const username = process.env.USER || process.env.USERNAME || 'user';

        return res.status(200).json({
            email: `${username}@gmail.com`,
            username: username,
            message: 'System info retrieved'
        });
    } catch (error) {
        console.error('Error getting system info:', error.message);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
