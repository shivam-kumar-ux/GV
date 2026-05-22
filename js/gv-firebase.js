/**
 * Gyanoday Vidyalaya — shared Firebase (multi-site + staff auth)
 */
(function (global) {
  var db = null;
  var storage = null;
  var auth = null;
  var activeSiteId = "shahpur";
  var staffCache = null;

  function isConfigured() {
    var c = global.GV_FIREBASE_CONFIG;
    return c && c.apiKey && c.apiKey !== "YOUR_API_KEY" && c.projectId && c.projectId !== "YOUR_PROJECT_ID";
  }

  function initFirebase() {
    if (!isConfigured()) return false;
    if (!global.firebase.apps.length) {
      global.firebase.initializeApp(global.GV_FIREBASE_CONFIG);
    }
    db = global.firebase.firestore();
    auth = global.firebase.auth();
    storage = typeof global.firebase.storage === "function" ? global.firebase.storage() : null;
    return true;
  }

  function getSiteConfig(siteId) {
    var sites = global.GV_SITES || {};
    return sites[siteId] || sites.shahpur;
  }

  function setActiveSite(siteId) {
    if (getSiteConfig(siteId)) activeSiteId = siteId;
    global.GV_ACTIVE_SITE = activeSiteId;
  }

  function contentDocId() {
    return getSiteConfig(activeSiteId).contentDoc || activeSiteId;
  }

  function storagePrefix() {
    return getSiteConfig(activeSiteId).storagePrefix || ("gv-" + activeSiteId);
  }

  function mergeDefaults(data) {
    var base = JSON.parse(JSON.stringify(global.GV_DEFAULT_CONTENT || {}));
    if (!data) return base;
    return Object.assign(base, data);
  }

  function loadSiteContent(siteId) {
    if (siteId) setActiveSite(siteId);
    global.GV_CONTENT_READY = new Promise(function (resolve) {
      if (!initFirebase()) {
        global.GV_CONTENT = mergeDefaults(null);
        global.GV_CONTENT_SOURCE = "default";
        resolve(global.GV_CONTENT);
        return;
      }
      db.collection("siteContent").doc(contentDocId()).get()
        .then(function (snap) {
          global.GV_CONTENT = snap.exists ? mergeDefaults(snap.data()) : mergeDefaults(null);
          global.GV_CONTENT_SOURCE = snap.exists ? "firebase" : "default";
          resolve(global.GV_CONTENT);
        })
        .catch(function () {
          global.GV_CONTENT = mergeDefaults(null);
          global.GV_CONTENT_SOURCE = "default";
          resolve(global.GV_CONTENT);
        });
    });
    return global.GV_CONTENT_READY;
  }

  function saveSiteContent(content, siteId) {
    if (!initFirebase()) return Promise.reject(new Error("Firebase not configured"));
    if (siteId) setActiveSite(siteId);
    content.updatedAt = global.firebase.firestore.FieldValue.serverTimestamp();
    return db.collection("siteContent").doc(contentDocId()).set(content, { merge: false });
  }

  function uploadFile(file, folder, siteId) {
    if (!initFirebase()) return Promise.reject(new Error("Firebase not configured"));
    if (!storage) return Promise.reject(new Error("Firebase Storage is not loaded on this page."));
    if (siteId) setActiveSite(siteId);
    var safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    var path = storagePrefix() + "/" + folder + "/" + Date.now() + "_" + safeName;
    return storage.ref(path).put(file).then(function () {
      return storage.ref(path).getDownloadURL();
    });
  }

  function normalizeStaffId(id) {
    return String(id || "").trim().toUpperCase().replace(/\s+/g, "-");
  }

  function resolveEmailFromLoginId(loginId) {
    var raw = String(loginId || "").trim();
    if (raw.indexOf("@") >= 0) return Promise.resolve(raw.toLowerCase());
    if (!initFirebase()) return Promise.reject(new Error("Firebase not configured"));
    var sid = normalizeStaffId(raw);
    return db.collection("staffLoginIndex").doc(sid).get().then(function (snap) {
      if (!snap.exists || !snap.data().email) {
        throw new Error("Staff ID not found. Use your registered email or contact admin.");
      }
      return snap.data().email.toLowerCase();
    });
  }

  function signIn(loginId, password) {
    return resolveEmailFromLoginId(loginId).then(function (email) {
      return auth.signInWithEmailAndPassword(email, password);
    });
  }

  function signOut() {
    staffCache = null;
    if (auth) return auth.signOut();
    return Promise.resolve();
  }

  function onAuthChanged(cb) {
    if (!initFirebase()) {
      cb(null);
      return function () {};
    }
    return auth.onAuthStateChanged(cb);
  }

  function getStaffProfile(uid) {
    if (!initFirebase()) return Promise.resolve(null);
    var id = uid || (auth.currentUser && auth.currentUser.uid);
    if (!id) return Promise.resolve(null);
    if (staffCache && staffCache.uid === id) return Promise.resolve(staffCache);
    return db.collection("staffUsers").doc(id).get().then(function (snap) {
      if (!snap.exists) return null;
      staffCache = Object.assign({ uid: id }, snap.data());
      return staffCache;
    });
  }

  function isSuperAdminEmail(email) {
    var normalized = String(email || "").trim().toLowerCase();
    var list = (global.GV_SUPER_ADMIN_EMAILS || []).map(function (e) {
      return String(e || "").trim().toLowerCase();
    });
    return list.indexOf(normalized) >= 0;
  }

  function signUpStaff(data) {
    if (!initFirebase()) return Promise.reject(new Error("Firebase not configured"));
    var email = String(data.email || "").trim().toLowerCase();
    var staffId = normalizeStaffId(data.staffId);
    if (!staffId || staffId.length < 3) return Promise.reject(new Error("Staff ID must be at least 3 characters."));
    if (!email) return Promise.reject(new Error("Email is required."));

    return db.collection("staffLoginIndex").doc(staffId).get().then(function (existing) {
      if (existing.exists) throw new Error("This Staff ID is already registered.");
      return auth.createUserWithEmailAndPassword(email, data.password);
    }).then(function (cred) {
      var user = cred.user;
      var isBootstrapAdmin = isSuperAdminEmail(email);
      var profile = {
        name: data.name || "",
        email: email,
        staffId: staffId,
        phone: data.phone || "",
        designation: data.designation || "",
        department: data.department || "",
        campus: data.campus || "shahpur",
        role: isBootstrapAdmin ? "admin" : "staff",
        status: isBootstrapAdmin ? "approved" : "pending",
        createdAt: global.firebase.firestore.FieldValue.serverTimestamp(),
        approvedAt: isBootstrapAdmin ? global.firebase.firestore.FieldValue.serverTimestamp() : null,
        approvedBy: isBootstrapAdmin ? user.uid : null
      };
      var batch = db.batch();
      batch.set(db.collection("staffUsers").doc(user.uid), profile);
      batch.set(db.collection("staffLoginIndex").doc(staffId), { email: email, uid: user.uid });
      return batch.commit().then(function () {
        return { user: user, profile: profile };
      });
    });
  }

  function canAccessPanel(profile) {
    if (!profile) return false;
    return profile.status === "approved";
  }

  function isAdminRole(profile) {
    return profile && profile.status === "approved" && profile.role === "admin";
  }

  function requireApprovedUser() {
    return auth.currentUser
      ? getStaffProfile().then(function (p) {
          if (!p) throw new Error("Staff profile missing. Contact administrator.");
          if (p.status === "pending") throw new Error("pending");
          if (p.status === "rejected") throw new Error("Your account was not approved.");
          if (p.status !== "approved") throw new Error("Account not active.");
          return { user: auth.currentUser, profile: p };
        })
      : Promise.reject(new Error("Not signed in"));
  }

  function listStaffByStatus(status) {
    if (!initFirebase()) return Promise.reject(new Error("Firebase not configured"));
    return db.collection("staffUsers").where("status", "==", status).get().then(function (snap) {
      var list = [];
      snap.forEach(function (doc) {
        list.push(Object.assign({ uid: doc.id }, doc.data()));
      });
      return list;
    });
  }

  function updateStaffStatus(uid, status, approverUid) {
    if (!initFirebase()) return Promise.reject(new Error("Firebase not configured"));
    var patch = {
      status: status,
      approvedAt: status === "approved" ? global.firebase.firestore.FieldValue.serverTimestamp() : null,
      approvedBy: status === "approved" ? approverUid : null
    };
    if (status === "rejected") patch.rejectedAt = global.firebase.firestore.FieldValue.serverTimestamp();
    return db.collection("staffUsers").doc(uid).update(patch);
  }

  function setStaffRole(uid, role) {
    return db.collection("staffUsers").doc(uid).update({ role: role });
  }

  global.GVFirebase = {
    isConfigured: isConfigured,
    init: initFirebase,
    setActiveSite: setActiveSite,
    getActiveSite: function () { return activeSiteId; },
    getSiteConfig: getSiteConfig,
    loadSiteContent: loadSiteContent,
    saveSiteContent: saveSiteContent,
    uploadFile: uploadFile,
    signIn: signIn,
    signUpStaff: signUpStaff,
    signOut: signOut,
    onAuthChanged: onAuthChanged,
    getStaffProfile: getStaffProfile,
    canAccessPanel: canAccessPanel,
    isAdminRole: isAdminRole,
    requireApprovedUser: requireApprovedUser,
    listStaffByStatus: listStaffByStatus,
    updateStaffStatus: updateStaffStatus,
    setStaffRole: setStaffRole,
    getDb: function () { return db; }
  };

  setActiveSite(global.GV_SITE_ID || "shahpur");

  if (!/\/admin\//i.test(global.location.pathname)) {
    loadSiteContent(global.GV_SITE_ID || "shahpur");
  }
})(window);
