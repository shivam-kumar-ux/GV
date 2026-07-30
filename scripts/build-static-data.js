/**
 * Export Firestore siteContent to static JS files (Phase 6).
 * Env: FIREBASE_SERVICE_ACCOUNT (required), GV_SITE_DOC (optional: shahpur | pyq | all)
 */
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const siteArg = (process.env.GV_SITE_DOC || "all").toLowerCase();
const sites =
  siteArg === "all"
    ? [
        { id: "shahpur", varName: "GV_DEFAULT_CONTENT", file: "shahpur-default.js" },
        { id: "pyq", varName: "GV_PYQ_DEFAULT_CONTENT", file: "pyq-default.js" }
      ]
    : siteArg === "pyq"
      ? [{ id: "pyq", varName: "GV_PYQ_DEFAULT_CONTENT", file: "pyq-default.js" }]
      : [{ id: "shahpur", varName: "GV_DEFAULT_CONTENT", file: "shahpur-default.js" }];

function loadServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    console.error("Missing FIREBASE_SERVICE_ACCOUNT");
    process.exit(1);
  }
  return JSON.parse(raw);
}

function cleanContent(data) {
  const copy = JSON.parse(JSON.stringify(data, replacer));
  delete copy.updatedAt;
  return copy;
}

function replacer(key, value) {
  if (value && typeof value === "object" && typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }
  if (value && value._seconds !== undefined && value._nanoseconds !== undefined) {
    return new Date(value._seconds * 1000).toISOString();
  }
  return value;
}

async function writeSite(db, site) {
  const snap = await db.collection("siteContent").doc(site.id).get();
  if (!snap.exists) {
    console.error("Missing siteContent/" + site.id + " — import data in admin first.");
    process.exit(1);
  }
  const body =
    "/**\n * Generated from Firestore siteContent/" +
    site.id +
    "\n */\nwindow." +
    site.varName +
    " = " +
    JSON.stringify(cleanContent(snap.data()), null, 2) +
    ";\n";
  const out = path.join(__dirname, "..", "js", "sites", site.file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, body, "utf8");
  console.log("Wrote", out);
}

async function run() {
  const serviceAccount = loadServiceAccount();
  if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  }
  const db = admin.firestore();
  for (const site of sites) {
    await writeSite(db, site);
  }
}

run().catch(function (err) {
  console.error(err.message || err);
  process.exit(1);
});
