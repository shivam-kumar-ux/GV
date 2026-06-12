# GV — Bug Fix Report v2

**Date:** June 12, 2026
**Files Modified:** 4 code files + 1 report

---

## Bug 1 — Mobile Navbar Below Hero Video ✅ FIXED (Root Cause Found)

### Root Cause
Two conflicting overrides were fighting each other:

1. **`gv-layout.css`** had a rule `body[data-gv-page="home"] .gv-navbar { position: sticky; top: auto; }` that was resetting the navbar to `position: sticky` on the home page — this cancelled the `position: fixed` set in `index.html` inline CSS for some browsers because both rules had **identical CSS specificity** (one attribute selector + one class = 0,2,0).

2. **Duplicate mobile blocks** inside `index.html`'s `<style>` tag had conflicting `z-index` values (1040 vs 1060 vs 1055) and duplicate `gv-nav-revealed` state rules — causing unpredictable cascade behavior.

3. **JS threshold too large** — previous attempt used `hero.offsetHeight - 30` as the reveal point (nearly the full video height), so on mobile the navbar only appeared after the user had scrolled almost the entire hero away.

### Fixes Applied

**`GV_Shahpur/css/gv-layout.css`:**
- Changed `body[data-gv-page="home"] .gv-topbar` and `.gv-navbar` overrides to use `:not()` selectors so they only target elements that are NOT the home-page-specific classes (`gv-home-topbar`, `gv-home-navbar-wrap`). This prevents `gv-layout.css` from fighting the home page's own CSS.

**`GV_Shahpur/index.html` (inline CSS):**
- Cleaned up the duplicate/conflicting mobile `@media (max-width: 767.98px)` blocks — consolidated into one clean block.
- Set a single consistent `z-index: 1055` for `.gv-home-navbar-wrap` (below `z-index: 1060` topbar).
- Base rule: `position: fixed; top: var(--gv-topbar-h)` applies on all screen sizes.
- Mobile CSS: topbar is `position: fixed; z-index: 1060`, hero gets `margin-top: var(--gv-topbar-h)`.
- Added `body[data-gv-page="home"].gv-nav-revealed #gvHomeMain { padding-top: calc(topbar + navbar) }` so content doesn't jump under the revealed navbar.

**`GV_Shahpur/index.html` (scroll JS):**
- Changed reveal threshold to `isMobile ? 5 : 50` — on mobile the navbar appears after just **5px** of scroll (feels instant). Removed the unreliable CSS-variable reading approach.

### Behaviour After Fix
| Screen | Topbar | Navbar |
|--------|--------|--------|
| Mobile | Fixed at top (always visible) | Slides in from top after 5px scroll, stays fixed |
| Desktop | Fixed at top (always visible) | Slides in after 50px scroll, stays fixed |

---

## Bug 2 — Dark Mode Invisible Text in Admin Panel ✅ FIXED

### Root Cause
Bootstrap classes like `.bg-light`, `.card`, `.rounded.bg-white` and inline `style="background:#e8f0ff"` / `style="background:#fff3cd"` boxes in the dashboard were not covered by the dark mode CSS. These stayed white/light blue with light-coloured text on top — invisible.

### Fixes Applied (`admin/css/admin.css`)
Added explicit dark mode overrides for:
- `.bg-light`, `.card`, `.card-body.bg-light`, `.p-3.bg-light`, `.p-4.bg-light`, `.rounded.bg-white` → dark background `#21262d`
- Inline `style` attribute selectors: `[style*="background:#e8f0ff"]`, `[style*="background:#fff3cd"]`, `[style*="background:#fff"]`, `[style*="background:#f8f9fa"]` → `#21262d` background, `#c9d1d9` text
- `strong`, `b`, `span` inside `.admin-section` → `#e6edf3` (light)
- `code`, `pre` → `#21262d` background, `#79c0ff` text (GitHub dark style)
- `a` links inside sections → `#5b9bf8`
- `.text-primary` → `#5b9bf8`; `.text-danger` → `#ff7b72`
- `.badge-secondary` → dark badge
- Update history inline-style divs (border colors, text colors)
- `ol li`, `ul li` inside help cards

---

## Bug 3 — File Upload Failing (Storage Unauthorized / Retry Limit) ✅ CODE FIXED — ACTION REQUIRED

### Diagnostic Reading
From your Storage Diagnostics panel:
```
✅ Auth: shivamkumar174440@gmail.com  
✅ Token: refreshed (len 953)  
❌ appspot: storage/retry-limit-exceeded  
❌ firebasestorage.app: storage/unauthorized  
⚠️ Both buckets blocked. Open Firebase Console → Storage → Rules
```

### Root Cause
**Firebase Storage Rules have NOT been deployed.** The rules file at `firebase/storage.rules` is correct (allows authenticated writes), but it has never been pushed to Firebase. The Firebase Console currently has no rules or restrictive default rules — blocking all writes.

Additionally the code was always trying the `appspot.com` bucket hardcoded. The `storageBucket` value in your `firebase-config.js` likely points to `firebasestorage.app` (newer projects). Fixed `js/gv-firebase.js` to use `cfg.storageBucket` first (whatever is set in your config), then fall back to `appspot.com`.

### Code Fix Applied (`js/gv-firebase.js`)
`getStorageInstance()` now reads `cfg.storageBucket` from your Firebase config first — this is always the correct bucket for your project.

---

## ⚠️ ACTION REQUIRED — You Must Do This in Firebase Console

### Step 1 — Deploy Storage Rules (fixes the upload)

Open a terminal in `d:\Coding_SK\Project -GV\GV\` and run:

```bash
firebase deploy --only storage
```

If Firebase CLI is not installed:
```bash
npm install -g firebase-tools
firebase login
firebase deploy --only storage
```

**OR** do it manually in Firebase Console:
1. Go to → [Firebase Console](https://console.firebase.google.com/)
2. Select project **gyanoday-vidyalaya**
3. Left sidebar → **Storage** → **Rules** tab
4. Replace the existing rules with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    allow read: if true;
    allow write: if request.auth != null;
  }
}
```
5. Click **Publish**

### Step 2 — Verify your firebase-config.js storageBucket

Open `js/firebase-config.js` and confirm `storageBucket` is set:

```js
var GV_FIREBASE_CONFIG = {
  apiKey: "...",
  projectId: "gyanoday-vidyalaya",
  storageBucket: "gyanoday-vidyalaya.firebasestorage.app",  // ← must be present
  ...
};
```

If `storageBucket` is missing or wrong, add/correct it from Firebase Console → Project Settings → Your apps → SDK setup.

### Step 3 — Deploy Firestore Rules (if not done already)

```bash
firebase deploy --only firestore:rules
```

---

## Summary of Code Files Changed

| File | Change |
|------|--------|
| `GV_Shahpur/index.html` | Mobile navbar CSS: fixed positioning, z-index, no duplicates; JS: reveal at 5px on mobile |
| `GV_Shahpur/css/gv-layout.css` | Fixed home-page topbar/navbar override using `:not()` selectors to stop fighting index.html CSS |
| `admin/css/admin.css` | Dark mode: 30+ new rules for bg-light boxes, inline-style boxes, strong/code/a/badge |
| `js/gv-firebase.js` | Storage bucket: use `cfg.storageBucket` from config first |
| `firebase/storage.rules` | Refreshed with clear comments (must be deployed — see Action Required) |

---

## What Works After These Changes (no action needed from you)

- ✅ Navbar appears on mobile after 5px scroll, stays fixed at top
- ✅ Admin dark mode: all text, cards, info boxes, code blocks visible
- ✅ Storage code uses correct bucket from your Firebase config

## What Still Needs Your Action

- ⚠️ **Deploy Storage Rules** — upload will fail until you do this (see Step 1 above)
- ⚠️ **Verify `storageBucket`** in `firebase-config.js` (see Step 2 above)
