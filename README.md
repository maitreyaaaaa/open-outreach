# 🚀 OpenOutreach (`open-outreach`)

> **Open-Source Enterprise Dual-Channel Outreach Suite** (Email + LinkedIn)
> Personalize company email campaigns & automate LinkedIn connection requests with 300-char notes safely.

---

## 🌟 Key Features

### 📩 198 Company Email Outreach Engine
* **Dynamic Mail Merge Personalization**: Dynamic Mustache tags (`{{Company}}`, `{{ContactPerson}}`, `{{CustomNote}}`).
* **Deliverability & Spam Audit**: Scans subject lines and body text against high-risk spam trigger words.
* **1-by-1 Desktop & Mobile Inspector**: Preview each rendered email across Desktop and Mobile (`375px`) viewports.
* **Zero-Password Persistence Security**: SMTP App Passwords live exclusively in ephemeral React memory (`useState`) for your session and are **never saved to disk, cookies, or database**.
* **Anti-Spam Throttling & Jitter**: Configurable dispatch delays (1s–10s) with randomized timing jitter to protect domain reputation.

### 💼 LinkedIn Connection Request Engine
* **Strict 300-Character Note Meter**: Visual counter gauge enforcing LinkedIn's hard 300-character limit on connection notes.
* **LinkedIn Invitation Modal Inspector**: Interactive preview showing how your custom note renders inside LinkedIn's actual connection request modal.
* **Playwright Browser Automation Engine**: Background Playwright runner that visits profiles, clicks *Connect* &rarr; *Add a note*, types custom notes at human typing speeds, and submits invitations.
* **1-Click Session Login Browser**: Opens a headed browser window so you can log in once. Session cookies are saved locally so plain passwords are never stored.
* **Anti-Bot Safety Controls**: Configurable 30s–90s randomized human delay throttling and daily request cap limit (e.g. max 20–25 invites/day).

### 📊 Unified Macro Overview Hub
* Combined analytics hub displaying real-time metrics, queue progress, and data health scores across both Email and LinkedIn channels.

### 🎨 Enterprise Glassmorphism UI & Motion
* Built with a dark grey (`#080a0f`) and white (`#ffffff`) palette, generous macro-whitespace, high backdrop blurs (`backdrop-filter: blur(20px)`), and **Anime.js v4** fluid staggered transitions.

---

## 🛠️ Quick Start

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### 2. Clone & Install
```bash
git clone https://github.com/maitreyaaaaa/open-outreach.git
cd open-outreach
npm install
```

### 3. Install Playwright Chromium Browser Binaries
```bash
npx playwright install chromium
```

### 4. Run Development Server
```bash
npm run dev
```
- **Frontend Dashboard:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** `http://localhost:3010`

---

## 🏗️ Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend UI** | React 18, Vite 5, Lucide Icons, Anime.js v4, CSS Tokens |
| **Backend API** | Node.js, Express, Nodemailer (Email), Playwright (LinkedIn Automation) |
| **Data Importers** | PapaParse (CSV), XLSX (Excel) |

---

## 🛡️ Security & Privacy Architecture

1. **Zero Password Persistence**: SMTP passwords exist only in active memory during execution and are wiped when the browser is closed or refreshed.
2. **Encrypted Session Cookies**: User browser session cookies stay local to your machine.
3. **Open Source**: 100% transparent codebase with zero tracking or third-party telemetry.

---

## 📄 License
MIT License © 2026 OpenOutreach
