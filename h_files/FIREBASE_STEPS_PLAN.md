# Gyanoday Vidyalaya — Complete Firebase Integration & Security Roadmap

Welcome to the ultimate deployment and security blueprint for the **Gyanoday Vidyalaya** school portal. This document outlines the exact steps to transition your school website to run dynamically via **GitHub Pages** with an **Admin Panel** powered by **Firebase**, while keeping your Firebase keys and APIs completely hidden from general visitors.

---

## 🏗️ Architectural Decisions: How to Keep Firebase Hidden

In standard client-side architectures, Firebase credentials live in a configuration file (`firebase-config.js`) downloaded by the visitor's browser. While the configuration itself is technically an identifier (not a secret), any visitor opening DevTools can see it.

To solve this, you have **two options** to deploy the school portal. **Option B (JAMstack with GitHub Actions)** is the recommended approach to keep the Firebase API key 100% hidden from general users.

```mermaid
graph TD
    subgraph Option A: Client-Side Runtime
        Client[General User Browser] -->|Requests siteContent| Firestore[(Firestore DB)]
        Client -->|Downloads Config| ConfigJS[firebase-config.js]
        Rules[Firestore Security Rules] -.->|Protects DB| Firestore
        style Client fill:#d4edda,stroke:#28a745,stroke-width:2px
        style Firestore fill:#f8d7da,stroke:#dc3545,stroke-width:2px
    end

    subgraph Option B: JAMstack Build-Time (Recommended)
        Visitor[General User Browser] -->|Reads Static File Only| GitPages[GitHub Pages CDN]
        GitPages -.->|No Firebase JS SDK| GitPages
        Admin[Approved Admin Browser] -->|Saves Changes| FirestoreB[(Firestore DB)]
        GHAction[GitHub Action Runner] -->|Pulls Data via REST/Admin SDK| FirestoreB
        GHAction -->|Writes static JSON content| GitRepo[GitHub Repository]
        GitRepo -->|Triggers Static Deploy| GitPages
        style Visitor fill:#d1ecf1,stroke:#17a2b8,stroke-width:2px
        style GitPages fill:#e2e3e5,stroke:#383d41,stroke-width:2px
        style GHAction fill:#fff3cd,stroke:#ffc107,stroke-width:2px
    end
```

### Option Comparison

| Metric | Option A: Client-Side Realtime | Option B: Secure JAMstack (Recommended) |
| :--- | :--- | :--- |
| **API Exposure** | Config is downloaded by public visitors. | Firebase credentials are **never** loaded by public visitors. |
| **Security** | Protected solely via Firestore Security Rules. | Cryptographically locked via GitHub repository secrets. |
| **Page Speed** | Slower; waits for Firebase API handshakes on load. | Instant; pages load static HTML & native content immediately. |
| **Reliability** | Breaks if Firestore limits or quotas are exceeded. | 100% uptime; powered directly by GitHub Pages CDN. |

---

## 🚀 Step-by-Step Implementation Roadmap

---

### Step 1: Firebase Project Initialization

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and name it `gyanoday-vidyalaya` (or your preferred name).
3. Toggle Google Analytics **On** or **Off** based on preference and click **Create Project**.
4. Register a new **Web App**:
   - In the Project Overview page, click the **Web icon (`</>`)**.
   - Register the app with nickname: `GV Portal`.
   - **Do not** check "Also set up Firebase Hosting" (we are deploying the public site on GitHub Pages).
   - Copy the configuration object `firebaseConfig`.

---

### Step 2: Establish the Directory Configurations

In your local workspace `d:\Coding_SK\Project -GV\GV`:

1. Create a copy of `js/firebase-config.example.js` and name it `js/firebase-config.js`.
2. Open `js/firebase-config.js` and paste your web app configuration:

```javascript
window.GV_FIREBASE_CONFIG = {
  apiKey: "AIzaSyA1...", // Paste your Firebase API Key
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234:web:abcd"
};
```

> [!WARNING]
> Keep `firebase-config.js` out of your public GitHub history if you want zero public credential leakage. Check `.gitignore` to ensure it is ignored or utilize the automated build setup in Step 6.

---

### Step 3: Deploy Security Rules

To ensure that only approved staff members can write to your Firebase database and file storage, you must deploy the security rules provided in your `firebase` folder.

#### 1. Install Firebase CLI:
Open your terminal (PowerShell) and run:
```powershell
npm install -g firebase-tools
```

#### 2. Log In to Firebase:
```powershell
firebase login
```

#### 3. Initialize Firebase inside the GV folder:
```powershell
cd "d:\Coding_SK\Project -GV\GV"
firebase init
```
*   Select **Firestore** and **Storage**.
*   Choose **Use an existing project** and select your created Firebase project.
*   Keep the default filenames: `firestore.rules`, `storage.rules`, `firestore.indexes.json`.

#### 4. Replace & Deploy Rules:
Make sure your `firestore.rules` and `storage.rules` in your project root match the ones in `GV/firebase/`. Then run:
```powershell
firebase deploy --only firestore:rules,storage
```

> [!IMPORTANT]
> Verify that `firestore.rules` restricts writing privileges only to approved staff (`status == 'approved'`) and Super Admins.

---

### Step 4: Bootstrapping the First Super Administrator

To log in and approve other staff members, you must configure a Super Administrator:

1. Open `d:\Coding_SK\Project -GV\GV\js\firebase-config.js`.
2. Update the super admin array with your primary admin email:
   ```javascript
   window.GV_SUPER_ADMIN_EMAILS = ["principal@gyanodayvidyalaya.com", "your-email@gmail.com"];
   ```
3. Open your browser, launch `admin/signup.html` locally, and register with that exact email address.
4. Your account is **automatically approved** as an Admin with full read/write/staff-management permissions!

---

### Step 5: Seeding Initial Website Content

The system includes a seeding engine to easily migrate your existing default static site content into your Firestore Database.

1. Log into your Admin Dashboard (`admin/login.html`).
2. Go to the **Overview** page.
3. Click the **Import Shahpur Data** button.
4. The dashboard will automatically read all hardcoded data from `js/sites/shahpur-default.js` and save it directly into the Firestore collection `siteContent/shahpur`.
5. Now, any change made inside the Admin Panel and saved with **Save Changes** will immediately write to Firestore!

---

### Step 6: Setting up the Automated Jamstack Pipeline (Option B)

To keep your API hidden, let's configure a automated pipeline using **GitHub Actions**.

#### 1. Setup GitHub Secrets
Go to your GitHub repository -> **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**.
Add a secret named `FIREBASE_SERVICE_ACCOUNT` containing your Firebase Service Account JSON.
> **To get a Service Account JSON**: Firebase Console -> Project Settings -> Service Accounts -> Generate new private key.

#### 2. Create the Build Script
Create a node utility file at `scripts/build-static-data.js`:

```javascript
const admin = require('firebase-admin');
const fs = require('fs');

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error("Missing FIREBASE_SERVICE_ACCOUNT secret!");
  process.exit(1);
}

// Initialize Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
});

const db = admin.firestore();

async function run() {
  console.log("Fetching site content from Firestore...");
  const doc = await db.collection('siteContent').doc('shahpur').get();
  
  if (!doc.exists) {
    console.error("No Firestore document found for shahpur!");
    process.exit(1);
  }
  
  const content = `window.GV_DEFAULT_CONTENT = ${JSON.stringify(doc.data(), null, 2)};\n`;
  fs.writeFileSync('js/sites/shahpur-default.js', content);
  console.log("Successfully compiled Firestore database to static assets.");
}

run().catch(err => {
  console.error("Build failed:", err);
  process.exit(1);
});
```

#### 3. Add GitHub Workflow File
Create a new file at `.github/workflows/deploy.yml`:

```yaml
name: Deploy School Website (Jamstack)

on:
  repository_dispatch:
    types: [site-update]
  workflow_dispatch: # Allows manual trigger from GitHub UI

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-size: '18'

      - name: Install dependencies
        run: npm install firebase-admin

      - name: Fetch and Write Static Content
        env:
          FIREBASE_SERVICE_ACCOUNT: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
        run: node scripts/build-static-data.js

      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: .
          branch: gh-pages
```

#### 4. Trigger Deployment from Admin Dashboard
We can configure the **Save Changes** button in the admin dashboard to trigger this GitHub Action automatically!
Update `admin/js/admin-app.js` under the `saveChanges` logic to make a POST request to GitHub's Repository Dispatch API:

```javascript
// Add inside save site content logic
function triggerGitHubRebuild() {
  const GITHUB_OWNER = "your-github-username";
  const GITHUB_REPO = "your-repo-name";
  const GITHUB_PAT = "YOUR_PERSONAL_ACCESS_TOKEN"; // or trigger via a secure proxy cloud function to hide PAT

  fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/dispatches`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GITHUB_PAT}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ event_type: 'site-update' })
  }).then(() => {
    console.log("GitHub rebuild triggered successfully!");
  });
}
```

> [!TIP]
> Under this Jamstack setup, you can completely remove the Firebase script tags (`firebase-app-compat.js` and `firebase-firestore-compat.js`) and `<script src="../js/firebase-config.js"></script>` from the public pages (`index.html`, etc.), since they will load all data directly from the statically built `js/sites/shahpur-default.js`.

---

## 🛠️ Verification Checklist

- [ ] Firebase project created successfully.
- [ ] Firestore and Storage security rules deployed via Firebase CLI.
- [ ] `firebase-config.js` populated with correct keys.
- [ ] Super Admin email registered and auto-approved.
- [ ] Seeding button clicked once and Firestore seeded with initial data.
- [ ] (Option B) GitHub Action secret added and workflow verified.
