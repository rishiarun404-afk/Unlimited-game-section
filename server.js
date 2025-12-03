const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('src'));

// Path to collections file - Using public IP collector folder
const collectionsPath = path.join('C:\\Users\\MI\\OneDrive\\Desktop\\ip collector\\ips', 'Collections.txt');

// Ensure the ips directory exists
const ipsDir = path.dirname(collectionsPath);
if (!fs.existsSync(ipsDir)) {
    fs.mkdirSync(ipsDir, { recursive: true });
}

// Ensure Collections.txt exists
if (!fs.existsSync(collectionsPath)) {
    fs.writeFileSync(collectionsPath, '');
}

// Get system user email
function getSystemUserEmail() {
    try {
        // Try to get from Windows environment
        if (process.platform === 'win32') {
            // Method 1: Check if git is configured with real email
            try {
                const gitEmail = execSync('git config --global user.email', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
                if (gitEmail && gitEmail !== '' && gitEmail.includes('@')) {
                    return gitEmail;
                }
            } catch (e) {
                // Git not configured
            }

            // Fallback: Use username@gmail.com format
            const username = process.env.USERNAME || 'user';
            return `${username}@gmail.com`;
        }

        // Fallback for other systems
        const username = process.env.USER || process.env.USERNAME || 'user';
        return `${username}@gmail.com`;
    } catch (error) {
        console.error('Error getting system email:', error);
        return 'user@gmail.com';
    }
}

// Get real IP address
function getSystemIP() {
    try {
        const interfaces = os.networkInterfaces();
        for (const name of Object.keys(interfaces)) {
            for (const iface of interfaces[name]) {
                // Skip internal and non-IPv4 addresses
                if (iface.family === 'IPv4' && !iface.internal) {
                    return iface.address;
                }
            }
        }
        return 'Unknown';
    } catch (error) {
        console.error('Error getting system IP:', error);
        return 'Unknown';
    }
}

// Route to get system info
app.get('/get-system-info', (req, res) => {
    try {
        const systemEmail = getSystemUserEmail();
        const systemIP = getSystemIP();

        res.json({
            email: systemEmail,
            ip: systemIP,
            hostname: os.hostname(),
            platform: process.platform
        });
    } catch (error) {
        console.error('Error getting system info:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to get local IP
app.get('/get-local-ip', (req, res) => {
    try {
        const localIP = getSystemIP();
        res.json({ ip: localIP });
    } catch (error) {
        console.error('Error getting local IP:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to collect data
app.post('/collect', (req, res) => {
    try {
        const { email, publicIP, localIP, userAgent, timestamp } = req.body;

        // Use the email sent from frontend (user's Gmail)
        const finalEmail = email || 'unknown@gmail.com';

        const username = process.env.USERNAME || 'Unknown';
        const hostname = os.hostname();

        // Create simple data entry format
        const entry = `email = ${finalEmail} | local_ip = ${localIP} | public_ip = ${publicIP} | username = ${username} | hostname = ${hostname} | timestamp = ${timestamp}\n`;

        // Append to file
        fs.appendFileSync(collectionsPath, entry, 'utf8');

        console.log('Data collected:', entry);
        res.json({
            success: true,
            message: 'Data collected successfully',
            savedUsername: username,
            savedHostname: hostname,
            savedEmail: finalEmail,
            savedIPs: { publicIP, localIP }
        });
    } catch (error) {
        console.error('Error collecting data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Data will be saved to: ${collectionsPath}`);
    console.log(`System Email: ${getSystemUserEmail()}`);
    console.log(`System IP: ${getSystemIP()}`);
});
