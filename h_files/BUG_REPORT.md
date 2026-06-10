# Gyanoday Vidyalaya Admin Panel — Bug Report & Fixes

**Date:** 10 June 2026  
**Project:** GV / GV_Shahpur  
**Reported by:** Shivam Kumar  
**Investigated and fixed by:** Kiro (AI Dev Environment)

---

## Summary

Two critical bugs were identified and fixed:

1. `storage/unauthorized` error — uploads reach 100% then fail
2. Admin changes saved to Firestore but not reflected on the public website

A third minor issue (race condition in `activeSite`) was also patched.

---

## Bug 1 — `storage/unauthorized`: Upload reaches 100% then fails

### Symptom
When uploading a photo or PDF in the admin panel (e.g. Achievers, Programs, Disclosure), the progress bar reaches 100% and then the red error appears:

```
Upload denied — your session may have expired. Log out and log in again, then retry. (storage/unauthorized)
```

### Root Cause
**File:** `js/gv-firebase.js` → `ensureAuthForUpload()`

The original code read `auth.currentUser` directly:

```js
// BEFORE (broken)
var user = auth.currentUser;
if (!user) return Promise.reject(...);
return user.getIdToken(true).then(...);
```

**Two problems with this approach:**

1. **Stale `currentUser` reference:** Firebase Auth initialises asynchronously. Reading `auth.currentUser` synchronously can return `null` or a stale object if the internal state hasn't settled yet — especially after the admin tab has been open for a long time.

2. **No auto-refresh on long sessions:** Firebase ID tokens expire after 1 hour. The admin dashboard has no mechanism to refresh the token in the background. After an hour of being logged in without refreshing the page, the next upload would fail with `storage/unauthorized` even though the user appears to still be logged in.

### Fix Applied

**`js/gv-firebase.js`** — `ensureAuthForUpload()` rewritten to:

- Use `auth.onAuthStateChanged()` (fires once, immediately) to reliably get the current user instead of reading `auth.currentUser` directly.
- Force-refresh the ID token with `getIdToken(true)` before every upload, ensuring a fresh JWT is sent to Firebase Storage.

```js
// AFTER (fixed)
function ensureAuthForUpload() {
  return new Promise(function (resolve, reject) {
    var unsubscribe = auth.onAuthStateChanged(function (user) {
      unsubscribe();
      if (!user) {
        reject(new Error("Your session has expired. Please log out and log in again."));
        return;
      }
      user.getIdToken(/* forceRefresh= */ true)
        .then(function () { resolve(user); })
        .catch(function (err) { reject(...); });
    }, reject);
  });
}
```

**`js/gv-firebase.js`** — `startTokenAutoRefresh()` added:

A background `setInterval` that force-refreshes the ID token every **50 minutes** (before the 1-hour expiry). This is started automatically when `onAuthChanged` detects a signed-in user, so the admin can stay logged in all day without token expiry breaking uploads.

```js
function startTokenAutoRefresh() {
  _tokenRefreshInterval = setInterval(function () {
    if (auth && auth.currentUser) {
      auth.currentUser.getIdToken(true); // silent background refresh
    }
  }, 50 * 60 * 1000); // every 50 minutes
}
```

### Files Changed
- `js/gv-firebase.js`

---

## Bug 2 — Changes saved to Firestore but not showing on public website

### Symptom
After saving in the admin panel, the Achievers slider on `result.html` and `index.html` still shows the old hardcoded students. New students added via admin do not appear, and updated photos do not show.

### Root Cause
**File:** `GV_Shahpur/js/gv-render.js` → `renderAchievers()`

The original render function had a guard:

```js
// BEFORE (broken guard)
if (!track || !global.GV_CONTENT || !global.GV_CONTENT.achievers) return;
```

**Two problems:**

1. **Static HTML never cleared before Firestore loads:** Both `result.html` and `index.html` have the achiever slider written out as static hardcoded HTML directly in the page. When the page loads, the visitor sees the old hardcoded students immediately. The `gv-render.js` script loads asynchronously and calls `renderAchievers()` only after `GV_CONTENT_READY` resolves from Firestore — but if the function exits early (e.g. before Firestore returns), the static HTML persists.

2. **Loading placeholder not shown:** While waiting for Firestore, there was no visual indication that content was loading, so users/admins couldn't tell whether the old content was coming from Firestore or the hardcoded HTML.

3. **Early return on empty array:** If Firestore returned an empty `achievers` array (e.g. all were deleted and re-added but the save hadn't propagated), the function returned early and kept the static HTML visible.

### Fix Applied

**`GV_Shahpur/js/gv-render.js`** — `renderAchievers()` updated to:

- Immediately show a loading spinner when called before Firestore data is ready (replacing the static HTML).
- Only fall back to keeping static HTML when Firestore returns a genuinely empty array (preserving the visual fallback for unconfigured sites).

**`GV_Shahpur/js/gv-render.js`** — `init()` updated to:

- Immediately replace the `#studentSlider` content with a loading spinner as soon as the script runs, **before** the Firestore `Promise` resolves. This ensures the stale static HTML is cleared instantly and Firestore data always wins.

```js
// AFTER (fixed init)
function init() {
  // Clear static HTML immediately with a spinner
  var track = document.getElementById("studentSlider");
  if (track) {
    track.innerHTML = '<div class="student-slide" ...>Loading achievers…</div>';
  }
  var ready = global.GV_CONTENT_READY || global.GVFirebase.loadSiteContent();
  ready.then(function () {
    runPageRenders();
    document.dispatchEvent(new CustomEvent("gvContentReady"));
  });
}
```

### Files Changed
- `GV_Shahpur/js/gv-render.js`

---

## Bug 3 — Race condition: `activeSite` briefly set to `"pyq"` during boot

### Symptom
Intermittently, a "Save Changes" right after the dashboard loads would save content to the wrong Firestore document (`pyq` instead of `shahpur`).

### Root Cause
**File:** `admin/js/admin-app.js` → `boot()` and `publishAfterUpload()`

In `boot()`, after loading Shahpur content, the code immediately loads PYQ content:

```js
GVFirebase.loadSiteContent("shahpur").then(function (c) {
  ...
  return GVFirebase.loadSiteContent("pyq"); // ← switches activeSite to "pyq"
}).then(function (pyqC) {
  GVPyqAdmin.setContent(...);
  GVFirebase.setActiveSite(activeSite); // ← restores it... but too late if upload started
});
```

If an upload started between these two `.then()` callbacks (very rare, but possible on a slow network), `publishAfterUpload()` would snapshot `activeSite === "pyq"` and save to the wrong document.

### Fix Applied

**`admin/js/admin-app.js`** — `publishAfterUpload()` now snapshots `activeSite` at the start of the call so any async operations during `boot()` cannot change the target mid-flight.

```js
// AFTER (fixed)
function publishAfterUpload() {
  var siteAtPublish = activeSite; // snapshot — immune to async changes
  if (siteAtPublish === "pyq") { ... }
  return GVFirebase.saveSiteContent(content, siteAtPublish);
}
```

### Files Changed
- `admin/js/admin-app.js`

---

## Files Modified (Summary)

| File | Change |
|------|--------|
| `js/gv-firebase.js` | Fixed `ensureAuthForUpload()` to use `onAuthStateChanged` + force token refresh. Added `startTokenAutoRefresh()` (50-min background refresh). Wired auto-refresh into `onAuthChanged`. |
| `GV_Shahpur/js/gv-render.js` | Fixed `renderAchievers()` to clear static HTML with a loading spinner. Fixed `init()` to show spinner immediately before Firestore resolves. |
| `admin/js/admin-app.js` | Fixed `publishAfterUpload()` to snapshot `activeSite` at call time. |

---

## How to Verify the Fixes

1. **Bug 1 — Auth/Upload fix:**
   - Log into the admin panel
   - Wait on the dashboard for **more than 1 hour** without refreshing (or force-test by revoking the session in Firebase Console → Authentication → Users → Revoke sessions)
   - Try uploading a photo in Achievers
   - **Expected:** Upload succeeds without `storage/unauthorized` error

2. **Bug 2 — Public site update fix:**
   - Add a new achiever in the admin panel with a name and photo URL, then click "Upload" and "Save Changes"
   - Open `https://gyanodayvidyalaya.com/result.html` or the home page in a **new incognito tab**
   - **Expected:** The new achiever appears in the slider. The loading spinner shows briefly, then Firestore data replaces it.

3. **Bug 3 — Race condition fix:**
   - Immediately after page load (within ~2 seconds), trigger an upload or Save Changes
   - Verify in Firebase Console → Firestore → `siteContent/shahpur` that the document was updated, not `siteContent/pyq`

---

## Deployment Steps

After verifying locally, deploy the updated files:

```bash
firebase deploy --only hosting
```

Or push to the GitHub repo if GitHub Actions handles deployment automatically.

---

*End of Bug Report*
