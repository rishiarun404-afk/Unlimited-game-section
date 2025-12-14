// Firebase configuration
// Get these from your Firebase Console

const admin = require('firebase-admin');

let firebaseInitialized = false;

// Check if Firebase is already initialized
if (!admin.apps.length) {
    try {
        // Get private key from environment and normalize newlines
        let privateKey = process.env.FIREBASE_PRIVATE_KEY;

        if (!privateKey) {
            throw new Error('FIREBASE_PRIVATE_KEY environment variable is missing');
        }

        // Check if it's base64 encoded (doesn't contain the BEGIN PRIVATE KEY marker)
        if (!privateKey.includes('BEGIN PRIVATE KEY') && !privateKey.includes('BEGIN RSA PRIVATE KEY')) {
            try {
                // Try to decode from base64
                privateKey = Buffer.from(privateKey, 'base64').toString('utf-8');
                console.log('📦 Private key decoded from base64');
            } catch (e) {
                // Not base64, assume it's already in plain text
                console.log('📝 Private key is plain text');
            }
        }

        // Handle escaped newlines from environment variables
        if (typeof privateKey === 'string') {
            privateKey = privateKey.replace(/\\n/g, '\n');
        }

        // Verify it has the proper markers
        if (!privateKey.includes('BEGIN PRIVATE KEY')) {
            throw new Error('Private key does not contain BEGIN PRIVATE KEY marker after processing');
        }

        const serviceAccountKey = {
            type: "service_account",
            project_id: process.env.FIREBASE_PROJECT_ID,
            private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
            private_key: privateKey,
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
            client_id: process.env.FIREBASE_CLIENT_ID,
            auth_uri: "https://accounts.google.com/o/oauth2/auth",
            token_uri: "https://oauth2.googleapis.com/token",
            auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
            client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
        };

        console.log('🔍 Firebase initialization check:');
        console.log('  - Project ID:', serviceAccountKey.project_id ? 'SET ✓' : 'MISSING ✗');
        console.log('  - Private Key ID:', serviceAccountKey.private_key_id ? 'SET ✓' : 'MISSING ✗');
        console.log('  - Client Email:', serviceAccountKey.client_email ? 'SET ✓' : 'MISSING ✗');
        console.log('  - Database URL:', process.env.FIREBASE_DATABASE_URL ? 'SET ✓' : 'MISSING ✗');

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccountKey),
            databaseURL: process.env.FIREBASE_DATABASE_URL
        });
        firebaseInitialized = true;
        console.log('✅ Firebase initialized successfully');
    } catch (err) {
        firebaseInitialized = false;
        console.error('❌ Firebase initialization failed:', err.message);
        console.error('Stack trace:', err.stack);
    }
} else {
    firebaseInitialized = true;
    console.log('✅ Firebase already initialized');
}

module.exports = firebaseInitialized ? admin : null;
