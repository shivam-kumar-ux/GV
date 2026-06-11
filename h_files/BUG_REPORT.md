# GV Admin Panel & User Website — Bug Fix Report

**Date:** June 12, 2026  
**Files Modified:** 5

---

## Bug 1 — Upload Stuck at 1% ✅ FIXED

**File:** `js/gv-firebase.js`

**Root Cause:**  
Firebase Cloud Storage resumable uploads sometimes report `totalBytes = 0` on the first `state_changed` callback (before the server confirms the upload size). The old code had a guard `if (pct > 0)` that prevented the progress bar from ever moving. Since `bytesTransferred / 0 = NaN`, pct stayed 0 and was blocked.

**Fix:**  
Removed the `if (pct > 0)` guard and replaced it with `Math.max(1, pct)` so the bar always moves on the first event, then climbs naturally as bytes transfer.

Also changed the admin upload bar initial state from `"0%"` / `"Uploading…"` to `"2%"` / `"Starting…"` so the user sees immediate feedback on click.

---

## Bug 2 — Dark Mode Switch Button ✅ ADDED TO SIDEBAR

**Files:** `admin/dashboard.html`, `admin/css/admin.css`

**Issue:**  
The dark/light mode button existed in the topbar but was not in the sidebar below the Vidyalaya logo as requested.

**Fix:**  
- Added `<button class="admin-sidebar-theme-btn" id="adminSidebarThemeBtn">` inside the `.brand` div in the sidebar, directly below the GV Admin Portal `<h6>`.
- Added CSS for `.admin-sidebar-theme-btn` — a full-width pill button with icon + label text, styled to match the dark sidebar and adapt in dark mode.
- Updated the inline theme toggle script to wire both the topbar button AND the new sidebar button to the same `applyTheme()` function. Both stay in sync.

---

## Bug 3 — Test Results Section: Super Admin Only ✅ FIXED

**Files:** `admin/dashboard.html`, `admin/js/admin-app.js`

**Issue:**  
The "Year Results" section was visible and accessible to all approved staff (admin and staff roles), not just super admin.

**Fix:**  
- Added `superadmin-only-nav` class to the "Year Results" nav link in the sidebar.
- Added `superadmin-only-sec` class to the `#sec-results` section.
- In `updateSiteUI()` (called on every site switch and login), all `.superadmin-only-nav` and `.superadmin-only-sec` elements are shown only when `isSuperAdmin && isShahpur`.
- In `initNav()`, added a guard so clicking the results nav item also shows an "Access denied. Super admin only." toast for non-super-admin.

---

## Bug 4 — Mobile Navbar Appears Below Hero Video ✅ FIXED

**File:** `GV_Shahpur/index.html`

**Issue:**  
On mobile phones, after the hero video, the navbar appeared **below/behind** the video instead of becoming sticky at the top once the video scrolled past.

**Root Cause (two issues):**  
1. **Z-index:** The mobile CSS override for `.gv-home-navbar-wrap` did not set a z-index higher than the hero video's stacking context. The fixed navbar could render behind the video layer.
2. **Reveal threshold too small:** The desktop `revealAt = 50px` was also used on mobile, causing the navbar to appear while the hero was still mostly visible, creating a confusing overlap.

**Fix:**  
1. Added `z-index: 1060` to the mobile override for `.gv-home-navbar-wrap` so the navbar always renders above the video hero on mobile.
2. Changed the scroll reveal logic to be **responsive**: on mobile (`window.innerWidth <= 767`) the reveal fires when `scrollTop > heroHeight - 30px` (i.e., once the video has nearly scrolled past the top), while on desktop it stays at `50px` for quick access.

---

## Summary of Files Changed

| File | Change |
|------|--------|
| `js/gv-firebase.js` | Upload progress always advances; removed `if (pct > 0)` guard |
| `admin/js/admin-app.js` | Results hidden for non-super-admin; results nav guard in initNav |
| `admin/css/admin.css` | Added `.admin-sidebar-theme-btn` styles |
| `admin/dashboard.html` | Sidebar dark mode button added; results nav/section class tags added; theme script updated |
| `GV_Shahpur/index.html` | Mobile navbar z-index fix; responsive scroll reveal threshold |

---

## Role Access Matrix (Post-Fix)

| Feature | Staff | Admin | Super Admin |
|---------|-------|-------|-------------|
| Dashboard access | ✅ | ✅ | ✅ |
| Edit content (achievers, programs, etc.) | ✅ | ✅ | ✅ |
| Year Results (test result data) | ❌ | ❌ | ✅ |
| Staff Approvals | ❌ | ❌ | ✅ |
| Storage diagnostics panel | ❌ | ❌ | ✅ |
| Dark/light mode toggle | ✅ | ✅ | ✅ |
