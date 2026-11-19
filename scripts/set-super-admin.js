/**
 * Local script to set a user's custom claim to { role: 'super_admin' }.
 * Usage: node scripts/set-super-admin.js user@example.com
 * Assumes serviceAccountKey.json exists in root or FIREBASE_SERVICE_ACCOUNT is in env.
 */
const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

const email = process.argv[2];
if (!email) {
  console.error("Please specify user email: node scripts/set-super-admin.js <email>");
  process.exit(1);
}

// Load service account
let serviceAccount;
const keyPath = path.join(__dirname, "..", "serviceAccountKey.json");

if (fs.existsSync(keyPath)) {
  serviceAccount = require(keyPath);
} else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  console.error("Missing serviceAccountKey.json or FIREBASE_SERVICE_ACCOUNT in environment.");
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

async function run() {
  try {
    const user = await admin.auth().getUserByEmail(email);
    console.log(`Found user: ${user.displayName || "No Name"} (${user.uid})`);
    
    // Set custom claim
    await admin.auth().setCustomUserClaims(user.uid, { role: "super_admin" });
    console.log(`Successfully set role: 'super_admin' claims for ${email}`);
    
    // Fetch and print updated claims to confirm
    const updatedUser = await admin.auth().getUserByEmail(email);
    console.log("Updated Custom Claims:", updatedUser.customClaims);
    
    process.exit(0);
  } catch (error) {
    console.error("Error setting super admin claim:", error);
    process.exit(1);
  }
}

run();
