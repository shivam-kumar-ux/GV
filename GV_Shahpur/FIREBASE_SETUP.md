# Firebase Admin Panel — Setup Guide  
**Gyanoday Vidyalaya, Shahpur (GV_Shahpur)**

This guide explains how to connect the admin panel to Firebase so updates appear live on the school website.

---

## What was created

| Path | Purpose |
|------|---------|
| `admin/index.html` | Admin login page |
| `admin/dashboard.html` | Manage all website sections |
| `js/firebase-config.js` | Your Firebase API keys (edit this) |
| `js/gv-firebase.js` | Load/save content from Firestore |
| `js/gv-render.js` | Show content on public pages |
| `js/gv-default-content.js` | Default/fallback data |
| `firebase/firestore.rules` | Database security rules |
| `firebase/storage.rules` | File upload security rules |

**Admin URL (after hosting):**  
`https://your-domain.com/admin/`  
Example: `https://gyanodayvidyalaya.com/admin/`

---

## Step 1 — Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** → name it e.g. `gyanoday-vidyalaya-shahpur`.
3. Disable Google Analytics if you do not need it (optional).
4. Open the project.

---

## Step 2 — Enable Authentication

1. In Firebase Console → **Build** → **Authentication** → **Get started**.
2. **Sign-in method** → enable **Email/Password**.
3. **Users** tab → **Add user** → enter admin email and a strong password.  
   This is the account you use at `admin/index.html`.

---

## Step 3 — Create Firestore database

1. **Build** → **Firestore Database** → **Create database**.
2. Choose **Start in production mode** (we deploy rules next).
3. Pick a region close to India (e.g. `asia-south1` Mumbai).

---

## Step 4 — Enable Storage (for photos & PDFs)

1. **Build** → **Storage** → **Get started**.
2. Use production mode with default bucket.

**Where files are stored:**

```
Firebase Storage bucket/
  gv-shahpur/
    achievers/     ← student photos (home & results)
    alumni/        ← alumni photos
    results/       ← year-wise result photos
    gallery/       ← event photos
    routine/       ← class routine PDFs
    syllabus/      ← syllabus PDFs
    hostel/        ← hostel menu PDF
    disclosure/    ← mandatory disclosure PDFs
    notices/       ← notice PDFs
```

**Text and links** (names, titles, exam data, etc.) are stored in **Firestore**, not in HTML files.

---

## Step 4b — Deploy security rules

Install [Firebase CLI](https://firebase.google.com/docs/cli) if needed:

```bash
npm install -g firebase-tools
firebase login
cd GV_Shahpur
firebase init
```

When prompted:

- Select **Firestore** and **Storage**
- Use existing project
- Rules files: `firebase/firestore.rules` and `firebase/storage.rules`

Deploy rules:

```bash
firebase deploy --only firestore:rules,storage
```

**Rules summary:**

- Anyone can **read** website content (public site).
- Only **logged-in admin** can write/upload.

Optional: In `js/firebase-config.js`, set `GV_ADMIN_EMAILS` to restrict which emails can use the admin panel:

```javascript
window.GV_ADMIN_EMAILS = ["principal@gyanodayvidyalaya.com", "admin@school.com"];
```

---

## Step 5 — Register the web app & copy config

1. Firebase Console → **Project settings** (gear icon) → **Your apps**.
2. Click **Web** `</>` → register app name `GV Website`.
3. Copy the `firebaseConfig` object.
4. Paste values into `GV_Shahpur/js/firebase-config.js`:

```javascript
window.GV_FIREBASE_CONFIG = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

Use the **same file** for both the public site and admin (admin loads `../js/firebase-config.js`).

---

## Step 6 — First-time data import

1. Open `admin/index.html` in the browser (or deploy and open `/admin/`).
2. Sign in with the admin email/password from Step 2.
3. On **Overview**, click **Import Current Website Data to Firebase**.
4. This copies all current achievers, alumni, programs, results, gallery, notices, etc. into Firestore.

After that, use the sidebar to edit each section and click **Save All Changes**.

---

## What each admin section controls

| Admin section | Public page | What you can update |
|---------------|-------------|---------------------|
| Achievers | `index.html`, `result.html` | 10 students: photo, name, class, exam, rank, details |
| Alumni | `index.html` | Photo, name, achievement |
| Programs | `academics.html` | Class categories, routine PDF, syllabus PDF |
| Year Results | `result.html` | Years, exams, student photos, ranks, stats |
| Videos | `gallery.html` | 3 YouTube IDs, title, date |
| Instagram | `gallery.html` | 4 post URLs |
| Events | `gallery.html` | Years, events, multiple photos per event |
| Hostel Menu | `hostel.html` | Menu PDF |
| Disclosure | `disclosure.html` | All mandatory PDF documents |
| Notices | `notices.html` | Scrolling ticker + notice list + PDFs |

---

## How the website loads updates

1. Visitor opens a page (e.g. `index.html`).
2. Scripts load content from Firestore document: **`siteContent` / `shahpur`**.
3. `gv-render.js` fills the page (achievers slider, alumni carousel, etc.).
4. If Firebase is offline or not configured, the site uses `gv-default-content.js` as fallback.

**After you save in admin:** ask visitors to refresh the page (or hard refresh `Ctrl+F5`). Changes are immediate; no need to edit HTML.

---

## Hosting the website + admin

Upload the entire `GV_Shahpur` folder to your host (GitHub Pages, Netlify, Firebase Hosting, school server, etc.).

**Firebase Hosting (recommended):**

```bash
cd GV_Shahpur
firebase init hosting
# Public directory: . (current folder)
# Single-page app: No
firebase deploy
```

Your site: `https://your-project.web.app`  
Admin: `https://your-project.web.app/admin/`

**Important:** Add `admin/` to the same deployment as the main site so paths like `../img/H_logo.png` and `../js/firebase-config.js` work.

---

## Local testing

Use a local server (Firebase Auth often blocks `file://` URLs):

```bash
cd GV_Shahpur
npx serve .
# or: python -m http.server 8080
```

Open `http://localhost:3000/admin/`

In Firebase Console → **Authentication** → **Settings** → **Authorized domains**, add `localhost` if required.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Login fails | Check Email/Password auth is enabled; verify user exists |
| Save fails | Deploy Firestore rules; confirm admin is signed in |
| Upload fails | Deploy Storage rules; file must be image or PDF under 15 MB |
| Website shows old content | Hard refresh; confirm `firebase-config.js` is correct on live host |
| Admin says "Firebase not configured" | Replace `YOUR_API_KEY` placeholders in `firebase-config.js` |

---

## Security recommendations

1. Use a **strong admin password**; do not share it publicly.
2. Set `GV_ADMIN_EMAILS` to allowed staff emails only.
3. Do not commit real API keys to public GitHub — use `firebase-config.example.js` as template and keep real config private, or use environment-specific deploy.
4. Review Firebase **Usage & billing** alerts in the console.

---

## Quick checklist

- [ ] Firebase project created  
- [ ] Email/Password auth + admin user  
- [ ] Firestore + Storage enabled  
- [ ] Rules deployed  
- [ ] `js/firebase-config.js` filled in  
- [ ] Admin login works  
- [ ] "Import Website Data" run once  
- [ ] Test edit + save + refresh public page  
- [ ] Site and `admin/` folder deployed to production host  

For help, refer to [Firebase documentation](https://firebase.google.com/docs) or contact your website developer.
