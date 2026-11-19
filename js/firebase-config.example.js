/**
 * Copy to firebase-config.js and fill in your Firebase project values.
 */
window.GV_FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

/** Emails that become admin automatically on signup (optional bootstrap) */
window.GV_SUPER_ADMIN_EMAILS = ["principal@gyanodayvidyalaya.com"];

/** Campus websites managed by this admin panel */
window.GV_SITES = {
  shahpur: {
    label: "Gyanoday Vidyalaya — Shahpur",
    contentDoc: "shahpur",
    storagePrefix: "gv-shahpur",
    publicPath: "../GV_Shahpur/",
    active: true
  },
  t_dam: {
    label: "Gyanoday Vidyalaya — T. Dam",
    contentDoc: "t_dam",
    storagePrefix: "gv-t-dam",
    publicPath: "../GV_T_Dam/",
    active: false
  },
  pyq: {
    label: "PYQ Hub",
    contentDoc: "pyq",
    storagePrefix: "gv-pyq",
    publicPath: "../pyq/",
    active: true
  }
};
