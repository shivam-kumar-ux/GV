/**
 * Firebase init + load site content from Firestore.
 * Document: siteContent / shahpur
 */
(function (global) {
  var DOC_PATH = ["siteContent", "shahpur"];
  var configured = false;
  var db = null;
  var storage = null;
  var auth = null;

  function isConfigured() {
    var c = global.GV_FIREBASE_CONFIG;
    return c && c.apiKey && c.apiKey !== "YOUR_API_KEY" && c.projectId && c.projectId !== "YOUR_PROJECT_ID";
  }

  function initFirebase() {
    if (!isConfigured()) return false;
    if (!global.firebase || !global.firebase.apps.length) {
      global.firebase.initializeApp(global.GV_FIREBASE_CONFIG);
    }
    db = global.firebase.firestore();
    storage = global.firebase.storage();
    auth = global.firebase.auth();
    configured = true;
    return true;
  }

  function mergeDefaults(data) {
    var base = JSON.parse(JSON.stringify(global.GV_DEFAULT_CONTENT || {}));
    if (!data) return base;
    return Object.assign(base, data);
  }

  function loadSiteContent() {
    global.GV_CONTENT_READY = new Promise(function (resolve) {
      if (!initFirebase()) {
        global.GV_CONTENT = mergeDefaults(null);
        global.GV_CONTENT_SOURCE = "default";
        resolve(global.GV_CONTENT);
        return;
      }
      db.collection(DOC_PATH[0]).doc(DOC_PATH[1]).get()
        .then(function (snap) {
          if (snap.exists) {
            global.GV_CONTENT = mergeDefaults(snap.data());
            global.GV_CONTENT_SOURCE = "firebase";
          } else {
            global.GV_CONTENT = mergeDefaults(null);
            global.GV_CONTENT_SOURCE = "default";
          }
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

  function saveSiteContent(content) {
    if (!initFirebase()) return Promise.reject(new Error("Firebase not configured"));
    content.updatedAt = global.firebase.firestore.FieldValue.serverTimestamp();
    return db.collection(DOC_PATH[0]).doc(DOC_PATH[1]).set(content, { merge: false });
  }

  function uploadFile(file, folder) {
    if (!initFirebase()) return Promise.reject(new Error("Firebase not configured"));
    var safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    var path = "gv-shahpur/" + folder + "/" + Date.now() + "_" + safeName;
    var ref = storage.ref(path);
    return ref.put(file).then(function () {
      return ref.getDownloadURL();
    });
  }

  function signIn(email, password) {
    if (!initFirebase()) return Promise.reject(new Error("Firebase not configured"));
    return auth.signInWithEmailAndPassword(email, password);
  }

  function signOut() {
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

  function isAdminUser(user) {
    if (!user) return false;
    var list = global.GV_ADMIN_EMAILS || [];
    if (!list.length) return true;
    return list.indexOf(user.email) >= 0;
  }

  global.GVFirebase = {
    isConfigured: isConfigured,
    init: initFirebase,
    loadSiteContent: loadSiteContent,
    saveSiteContent: saveSiteContent,
    uploadFile: uploadFile,
    signIn: signIn,
    signOut: signOut,
    onAuthChanged: onAuthChanged,
    isAdminUser: isAdminUser,
    getDb: function () { return db; }
  };

  loadSiteContent();
})(window);
