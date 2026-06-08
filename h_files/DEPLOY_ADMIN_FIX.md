# Fix live admin: Firebase not configured (404 on firebase-config.js)

## Why it fails

- `js/firebase-config.js` is in `.gitignore` (correct — not on GitHub `main`).
- GitHub Pages deploys from **`main`** without that file → **404** on live site.
- The old workflow used **GitHub Actions Pages** API, which fails if secrets are missing or Pages source is still "Deploy from branch".

## Fix (follow in order)

### 1. Add GitHub Secrets (most common failure)

Repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret name | Value (from Firebase Console → Project settings → Your apps) |
|-------------|----------------------------------------------------------------|
| `FIREBASE_API_KEY` | apiKey |
| `FIREBASE_AUTH_DOMAIN` | authDomain |
| `FIREBASE_PROJECT_ID` | projectId |
| `FIREBASE_STORAGE_BUCKET` | storageBucket |
| `FIREBASE_MESSAGING_SENDER_ID` | messagingSenderId |
| `FIREBASE_APP_ID` | appId |
| `FIREBASE_MEASUREMENT_ID` | measurementId (optional) |
| `GV_SUPER_ADMIN_EMAILS` | your admin email, for example `your-email@example.com` |

Do not commit `js/firebase-config.js`. It is ignored locally and generated during GitHub Pages deployment from these GitHub Actions secrets.

Names must match **exactly** (case-sensitive).

### 2. Merge workflow to `main`

```powershell
git add .github/workflows/deploy-pages.yml scripts/generate-firebase-config.js DEPLOY_ADMIN_FIX.md
git commit -m "Fix Pages deploy: build firebase-config from secrets to gh-pages"
git push origin dev
```

Open PR **dev → main**, merge on GitHub.

### 3. Point GitHub Pages to `gh-pages`

**Settings** → **Pages**:

| Setting | Value |
|---------|--------|
| Source | **Deploy from a branch** |
| Branch | **gh-pages** |
| Folder | **/ (root)** |

Save. (Custom domain `gyanodayvidyalaya.com` stays the same.)

### 4. Run deploy workflow

**Actions** → **Deploy to GitHub Pages** → **Run workflow** → branch **main** → Run.

Wait until **green** (not red). Open the failed run log if red — look for `Missing GitHub Actions secrets`.

### 5. Verify

- `https://gyanodayvidyalaya.com/js/firebase-config.js` — must show JavaScript, not 404
- `https://gyanodayvidyalaya.com/admin/login.html` — no config error
- Firebase → Authentication → Authorized domains → `gyanodayvidyalaya.com`

## If workflow still red

| Log message | Fix |
|-------------|-----|
| `Missing GitHub Actions secrets: FIREBASE_...` | Add the listed secrets |
| `ENOENT: scripts/generate-firebase-config.js` | Merge latest code to `main` |
| Permission denied | Repo → Settings → Actions → General → Workflow permissions → **Read and write** |

## Quick manual fix (today only)

If you need admin working before Actions is green:

1. Do **not** commit `firebase-config.js` to GitHub `main`.
2. Use Firebase Hosting or FTP only if you have another host.
3. Or temporarily upload via GitHub web editor on **`gh-pages`** branch only (after first workflow creates that branch).

Preferred: complete steps 1–5 above.
