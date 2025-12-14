// Firebase configuration
// Get these from your Firebase Console

const admin = require('firebase-admin');

// Check if Firebase is already initialized
if (!admin.apps.length) {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
        : {
            // Fallback for local development - replace with your actual credentials
            type: "service_account",
            project_id: process.env.FIREBASE_PROJECT_ID,
            private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
            private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
            client_id: process.env.FIREBASE_CLIENT_ID,
            auth_uri: "https://accounts.google.com/o/oauth2/auth",
            token_uri: "https://oauth2.googleapis.com/token",
            auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
            client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
        };

    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccountKey),
            databaseURL: process.env.FIREBASE_DATABASE_URL || "https://your-project.firebaseio.com"
        });
        console.log('Firebase initialized successfully');
    } catch (err) {
        console.error('Firebase initialization error:', err.message);
    }
}

module.exports = admin;
