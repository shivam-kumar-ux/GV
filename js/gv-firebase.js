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
    auth = typeof global.firebase.auth === "function" ? global.firebase.auth() : null;
    storage = getStorageInstance();
    return true;
  }

  function getStorageInstance() {
    if (!isConfigured() || typeof global.firebase.storage !== "function") return null;
    try {
      // Explicitly use the legacy .appspot.com bucket which has reliable
      // security rule enforcement on all Firebase plans. The newer
      // .firebasestorage.app bucket requires Blaze plan for rules to work
      // correctly with browser resumable uploads.
      var cfg = global.GV_FIREBASE_CONFIG;
      var legacyBucket = cfg.projectId + ".appspot.com";
      return global.firebase.app().storage("gs://" + legacyBucket);
    } catch (e) {
      console.warn("GV: Could not get legacy storage bucket, falling back to default:", e.message);
      try {
        return global.firebase.storage();
      } catch (e2) {
        console.error("GV: Could not create Storage instance:", e2);
        return null;
      }
    }
  }

  function resolveContentType(file) {
    if (file.type && file.type !== "application/octet-stream") return file.type;
    var name = String(file.name || "").toLowerCase();
    if (name.endsWith(".pdf")) return "application/pdf";
    if (name.endsWith(".png")) return "image/png";
    if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
    if (name.endsWith(".webp")) return "image/webp";
    if (name.endsWith(".gif")) return "image/gif";
    return "";
  }

  function formatStorageError(err) {
    var code = (err && err.code) || "";
    var rawMsg = (err && err.message) || "";
    console.error("GV Storage error — code:", code, "message:", rawMsg, "raw:", err);
    var map = {
      "storage/unauthorized": "Upload denied — your session may have expired. Log out and log in again, then retry. (" + code + ")",
      "storage/canceled": "Upload was canceled.",
      "storage/unknown": "Storage error. Check the browser console and ensure Firebase Storage is enabled. (" + rawMsg + ")",
      "storage/retry-limit-exceeded": "Network error during upload. Check your connection and try again.",
      "storage/invalid-checksum": "Upload failed verification. Try again.",
      "storage/quota-exceeded": "Storage quota exceeded. Contact the administrator."
    };
    if (map[code]) return new Error(map[code]);
    return err || new Error("Upload failed (" + (code || "unknown") + ")");
  }

  function ensureAuthForUpload() {
    if (!initFirebase()) return Promise.reject(new Error("Firebase not configured"));
    if (!auth) return Promise.reject(new Error("Firebase Auth is not loaded on this page."));

    // Wait for Firebase Auth to finish its internal initialization before reading
    // currentUser — avoids a race where currentUser is null briefly on page load.
    return new Promise(function (resolve, reject) {
      // onAuthStateChanged fires once immediately with the current user (or null),
      // which is exactly what we need here.
      var unsubscribe = auth.onAuthStateChanged(function (user) {
        unsubscribe(); // call once only
        if (!user) {
          reject(new Error("Your session has expired. Please log out and log in again before uploading."));
          return;
        }
        // Force-refresh the ID token so Firebase Storage receives a valid JWT.
        // This is the critical step that fixes storage/unauthorized on long sessions.
        user.getIdToken(/* forceRefresh= */ true)
          .then(function () { resolve(user); })
          .catch(function (err) {
            reject(new Error(
              "Could not refresh your session token. Please log out and log in again. (" +
              (err && err.code || String(err)) + ")"
            ));
          });
      }, reject);
    });
  }

  function getSiteConfig(siteId) {
    var sites = global.GV_SITES || {};
    return sites[siteId] || sites.shahpur;
  }

  function setActiveSite(siteId) {
    if (getSiteConfig(siteId)) activeSiteId = siteId;
    global.GV_ACTIVE_SITE = activeSiteId;
  }

  // Proactively refresh the Firebase Auth ID token every 50 minutes so
  // admin sessions that stay open longer than 1 hour do not hit
  // storage/unauthorized on the next upload.
  var _tokenRefreshInterval = null;
  function startTokenAutoRefresh() {
    if (_tokenRefreshInterval) return; // already running
    _tokenRefreshInterval = setInterval(function () {
      if (auth && auth.currentUser) {
        auth.currentUser.getIdToken(/* forceRefresh= */ true).catch(function (err) {
          console.warn("GV: background token refresh failed:", err && err.code);
        });
      }
    }, 50 * 60 * 1000); // every 50 minutes
  }

  function contentDocId() {
    return getSiteConfig(activeSiteId).contentDoc || activeSiteId;
  }

  function storagePrefix() {
    return getSiteConfig(activeSiteId).storagePrefix || ("gv-" + activeSiteId);
  }

  function deepMerge(target, source) {
    if (!source || typeof source !== "object") return target;
    Object.keys(source).forEach(function (key) {
      var sv = source[key];
      var tv = target[key];
      if (
        sv &&
        typeof sv === "object" &&
        !Array.isArray(sv) &&
        tv &&
        typeof tv === "object" &&
        !Array.isArray(tv)
      ) {
        deepMerge(tv, sv);
      } else {
        target[key] = sv;
      }
    });
    return target;
  }

  function mergeDefaults(data) {
    var base;
    if (activeSiteId === "pyq" || contentDocId() === "pyq") {
      base = JSON.parse(JSON.stringify(global.GV_PYQ_DEFAULT_CONTENT || { papers: [], examDetails: {}, exams: [] }));
    } else {
      base = JSON.parse(JSON.stringify(global.GV_DEFAULT_CONTENT || {}));
    }
    if (!data) return base;
    return deepMerge(base, data);
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

  function logSiteUpdate(editorName, editorStaffId, section, detail, siteId) {
    if (!initFirebase()) return Promise.resolve();
    var site = siteId || activeSiteId;
    var entry = {
      editorName: editorName || "Admin",
      editorStaffId: editorStaffId || "",
      section: section || "Content",
      detail: detail || "Content updated",
      site: site,
      timestamp: global.firebase.firestore.FieldValue.serverTimestamp()
    };
    return db.collection("updateLogs").add(entry).catch(function (e) {
      // Non-fatal — log to console but don't block the save workflow.
      console.warn("GV: Could not write update log:", e && e.message);
    });
  }

  function getUpdateLogs(siteId, limit) {
    if (!initFirebase()) return Promise.resolve([]);
    var site = siteId || activeSiteId;
    return db.collection("updateLogs")
      .where("site", "==", site)
      .orderBy("timestamp", "desc")
      .limit(limit || 30)
      .get()
      .then(function (snap) {
        var logs = [];
        snap.forEach(function (doc) {
          logs.push(Object.assign({ id: doc.id }, doc.data()));
        });
        return logs;
      })
      .catch(function () { return []; });
  }



  function uploadFile(file, folder, siteId, onProgress) {
    if (typeof siteId === "function") {
      onProgress = siteId;
      siteId = null;
    }
    if (siteId) setActiveSite(siteId);

    var contentType = resolveContentType(file);
    if (!contentType) {
      return Promise.reject(new Error("Only PDF and image files (JPG, PNG, WEBP, GIF) are allowed."));
    }
    if (file.size > 15 * 1024 * 1024) {
      return Promise.reject(new Error("File is too large. Maximum size is 15 MB."));
    }

    return ensureAuthForUpload().then(function (user) {
      // Always get a fresh storage instance after token refresh
      var st = getStorageInstance();
      if (!st) return Promise.reject(new Error("Firebase Storage is not loaded on this page."));

      var safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      var path = storagePrefix() + "/" + folder + "/" + Date.now() + "_" + safeName;
      var ref = st.ref(path);
      var metadata = { contentType: contentType };

      return new Promise(function (resolve, reject) {
        var uploadTask = ref.put(file, metadata);

        uploadTask.on(
          "state_changed",
          function (snapshot) {
            if (typeof onProgress !== "function") return;
            var pct = 0;
            if (snapshot.totalBytes > 0) {
              pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            } else if (file.size > 0) {
              pct = Math.min(95, (snapshot.bytesTransferred / file.size) * 100);
            }
            // Only report > 0 so the UI shows real progress
            if (pct > 0) onProgress(Math.min(99, pct));
          },
          function (err) {
            // Upload failed
            reject(formatStorageError(err));
          },
          function () {
            // Upload complete — get download URL
            ref.getDownloadURL().then(function (url) {
              if (typeof onProgress === "function") onProgress(100);
              resolve(url);
            }).catch(reject);
          }
        );
      });
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
    if (!initFirebase()) return Promise.reject(new Error("Firebase not configured"));
    if (!auth) return Promise.reject(new Error("Firebase Auth is not loaded on this page."));
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
      return function () { };
    }
    if (!auth) {
      cb(null);
      return function () { };
    }
    return auth.onAuthStateChanged(function (user) {
      if (user) {
        // Start proactive token refresh to keep the session alive for uploads.
        startTokenAutoRefresh();
      }
      cb(user);
    });
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
    if (!initFirebase()) return Promise.reject(new Error("Firebase not configured"));
    if (!auth) return Promise.reject(new Error("Firebase Auth is not loaded on this page."));
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
    logSiteUpdate: logSiteUpdate,
    getUpdateLogs: getUpdateLogs,
    uploadFile: uploadFile,
    signIn: signIn,
    signUpStaff: signUpStaff,
    signOut: signOut,
    onAuthChanged: onAuthChanged,
    getStaffProfile: getStaffProfile,
    isSuperAdminEmail: isSuperAdminEmail,
    canAccessPanel: canAccessPanel,
    isAdminRole: isAdminRole,
    requireApprovedUser: requireApprovedUser,
    listStaffByStatus: listStaffByStatus,
    updateStaffStatus: updateStaffStatus,
    setStaffRole: setStaffRole,
    startTokenAutoRefresh: startTokenAutoRefresh,
    getDb: function () { return db; }
  };

  setActiveSite(global.GV_SITE_ID || "shahpur");

  if (!/\/admin\//i.test(global.location.pathname)) {
    loadSiteContent(global.GV_SITE_ID || "shahpur");
  }
})(window);
