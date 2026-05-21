/**
 * Copy this file to firebase-config.js and fill in your Firebase project values.
 * Get them from: Firebase Console → Project settings → Your apps → Web app
 */
window.GV_FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Optional: restrict admin panel to these emails (comma-separated in Firestore rules is better)
window.GV_ADMIN_EMAILS = ["admin@gyanodayvidyalaya.com"];
