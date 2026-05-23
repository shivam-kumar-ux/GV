/**
 * Build js/firebase-config.js from environment variables (GitHub Actions secrets).
 * Do not commit the generated file — it is created only at deploy time.
 */
const fs = require("fs");
const path = require("path");

const required = [
  "FIREBASE_API_KEY",
  "FIREBASE_AUTH_DOMAIN",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_STORAGE_BUCKET",
  "FIREBASE_MESSAGING_SENDER_ID",
  "FIREBASE_APP_ID"
];

const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error("Missing required secrets:", missing.join(", "));
  process.exit(1);
}

const superAdmins = (process.env.GV_SUPER_ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

const lines = [
  "window.GV_FIREBASE_CONFIG = {",
  `  apiKey: ${JSON.stringify(process.env.FIREBASE_API_KEY)},`,
  `  authDomain: ${JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN)},`,
  `  projectId: ${JSON.stringify(process.env.FIREBASE_PROJECT_ID)},`,
  `  storageBucket: ${JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET)},`,
  `  messagingSenderId: ${JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID)},`,
  `  appId: ${JSON.stringify(process.env.FIREBASE_APP_ID)}`
];

if (process.env.FIREBASE_MEASUREMENT_ID) {
  lines.push(`  ,measurementId: ${JSON.stringify(process.env.FIREBASE_MEASUREMENT_ID)}`);
}

lines.push("};", "", `window.GV_SUPER_ADMIN_EMAILS = ${JSON.stringify(superAdmins)};`, "", "window.GV_SITES = {");
lines.push('  shahpur: { label: "Gyanoday Vidyalaya — Shahpur", contentDoc: "shahpur", storagePrefix: "gv-shahpur", publicPath: "../GV_Shahpur/", active: true },');
lines.push('  t_dam: { label: "Gyanoday Vidyalaya — T. Dam", contentDoc: "t_dam", storagePrefix: "gv-t-dam", publicPath: "../GV_T_Dam/", active: false },');
lines.push('  pyq: { label: "PYQ Hub", contentDoc: "pyq", storagePrefix: "gv-pyq", publicPath: "../pyq/", active: true }');
lines.push("};", "");

const outPath = path.join(__dirname, "..", "js", "firebase-config.js");
fs.writeFileSync(outPath, lines.join("\n"), "utf8");
console.log("Wrote", outPath);
