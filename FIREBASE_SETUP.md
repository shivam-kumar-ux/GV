# Gyanoday Vidyalaya — Central Admin & Firebase Setup

The admin panel and Firebase configuration live at the **GV** folder root (parent of `GV_Shahpur`, `GV_T_Dam`, and `pyq`).

## Folder layout

```
GV/
  admin/              ← Login, signup, dashboard (all campuses)
  firebase/           ← Firestore & Storage security rules
  js/
    firebase-config.js
    gv-firebase.js
    sites/
      shahpur-default.js
  GV_Shahpur/         ← Public Shahpur website (uses ../js/)
  GV_T_Dam/           ← Coming soon in admin
  pyq/                ← Coming soon in admin
```

**Admin URL:** `https://your-domain.com/admin/`  
(Deploy the whole `GV` folder so `admin/` and `GV_Shahpur/` are siblings.)

---

## Staff accounts (signup + approval)

1. **Signup** (`admin/signup.html`) — name, email, **Staff ID**, phone, designation, department, campus, password.
2. Account is created with status **`pending`**.
3. An **admin** approves the user under **Staff Approvals** in the dashboard.
4. Only **approved** staff can open the dashboard and edit content.

**Login** (`admin/login.html`): Staff ID **or** email + password.

### First administrator

Add your email to `js/firebase-config.js`:

```javascript
window.GV_SUPER_ADMIN_EMAILS = ["your-email@school.com"];
```

Sign up once with that email — you are auto-approved as **admin**.

---

## Firebase setup (summary)

1. Create a Firebase project.
2. Enable **Email/Password** authentication.
3. Create **Firestore** and **Storage**.
4. Register a **web app** and paste config into `GV/js/firebase-config.js`.
5. Deploy rules:

```bash
cd GV
firebase deploy --only firestore:rules,storage
```

(Rules files: `GV/firebase/firestore.rules`, `GV/firebase/storage.rules`.)

---

## Data storage

| Data | Location |
|------|----------|
| Shahpur page content | Firestore `siteContent/shahpur` |
| T. Dam (later) | Firestore `siteContent/t_dam` |
| PYQ (later) | Firestore `siteContent/pyq` |
| Staff profiles | Firestore `staffUsers/{uid}` |
| Staff ID login map | Firestore `staffLoginIndex/{staffId}` |
| Shahpur files | Storage `gv-shahpur/...` |

---

## Shahpur website connection

These pages load Firebase from the parent folder:

- `GV_Shahpur/index.html`, `result.html`, `academics.html`, `gallery.html`, `hostel.html`, `disclosure.html`, `notices.html`

Scripts:

```html
<script>window.GV_SITE_ID = "shahpur";</script>
<script src="../js/firebase-config.js"></script>
<script src="../js/sites/shahpur-default.js"></script>
<script src="../js/gv-firebase.js"></script>
<script src="js/gv-render.js"></script>
```

After Firebase is configured, open **admin → Import Shahpur Data** once, then edit and **Save Changes**.

---

## Roles

| Role | Can do |
|------|--------|
| **admin** | Approve/reject staff, change roles, edit Shahpur (all sections) |
| **staff** | Edit Shahpur content after approval (no staff management) |

T. Dam and PYQ sections appear in the site selector as **coming soon** until you enable them in `GV_SITES` in `firebase-config.js`.

---

## Local testing

```bash
cd GV
npx serve .
```

Open `http://localhost:3000/admin/`

Add `localhost` under Firebase Authentication → Authorized domains if needed.

---

## Old Shahpur-only admin

`GV_Shahpur/admin/` redirects to `GV/admin/`. Use only the central admin from now on.
