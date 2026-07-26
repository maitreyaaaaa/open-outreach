# 🚀 OpenOutreach (`open-outreach`)

<div align="center">

[![Live Web SaaS](https://img.shields.io/badge/Live_Web_App-GitHub_Pages-brightgreen?style=for-the-badge&logo=github)](https://maitreyaaaaa.github.io/open-outreach/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Express](https://img.shields.io/badge/Backend-Express_Node.js-000000?style=for-the-badge&logo=express)](https://expressjs.com/)

**The Open-Source Enterprise Dual-Channel Outreach Suite**  
*Unified High-Deliverability Email Campaigns & Direct REST LinkedIn Connection Outreach.*

[**🌐 Open Live Web SaaS Application**](https://maitreyaaaaa.github.io/open-outreach/) • [**Report Bug**](https://github.com/maitreyaaaaa/open-outreach/issues) • [**Request Feature**](https://github.com/maitreyaaaaa/open-outreach/issues)

</div>

---

## 🎬 30-Second Product Explainer Video

https://github.com/user-attachments/assets/open-outreach-explainer.mp4

<div align="center">
  <video src="assets/open-outreach-explainer.mp4" width="100%" controls autoplay loop muted poster="https://raw.githubusercontent.com/maitreyaaaaa/open-outreach/main/assets/poster.png">
    Your browser does not support the video tag. <a href="assets/open-outreach-explainer.mp4">Click here to watch the explainer video</a>.
  </video>
</div>

---

## ℹ️ About OpenOutreach

### What is OpenOutreach?
**OpenOutreach** is a 100% free, open-source, dual-channel cold outreach platform designed to unify **personalized email campaigns** and **LinkedIn networking** into a single, high-privacy dashboard. 

### Who is it for?
- **Founders & Startup Builders**: Launch outreach campaigns instantly with zero subscription fees.
- **SDRs & B2B Sales Teams**: Run multi-channel outreach (Email + LinkedIn) with built-in deliverability checks and account safety guardrails.
- **Recruiters & Agencies**: Manage prospect lists and personalized templates without risking credential leaks.
- **Privacy-Conscious Teams**: Eliminate third-party database risks with zero-persistence credential storage.

### How it was built
Built using a modern web stack designed for speed, privacy, and zero infrastructure overhead:
* **Frontend**: React 18, Vite, Tailwind CSS, GSAP 3.12, and Anime.js for fluid micro-interactions.
* **Architecture**: Single Page Application (SPA) hosted statically on **GitHub Pages Global CDN** ($0 hosting).
* **Email Engine**: Custom CSV Mail Merge, mustache variable substitution (`{{Company}}`, `{{FirstName}}`), and real-time spam keyword risk auditing over SMTP.
* **LinkedIn Engine**: Direct REST API integration with 1-click OAuth 2.0 authorization — avoiding slow, heavy headless browser tools.
* **Security Layer**: **Zero-Persistence Session Architecture** — SMTP passwords and API tokens live strictly in browser RAM and vanish on tab close.

---

## ⚡ Live Web SaaS Version

You can use the full **OpenOutreach** suite directly in your browser without installing anything!

👉 **[Launch OpenOutreach Web SaaS](https://maitreyaaaaa.github.io/open-outreach/)**

---

## 🌟 Core Channels & Feature Suite

### 📩 Enterprise Email Outreach Engine
* **Dynamic Personalization**: Mustache tags (`{{Company}}`, `{{ContactPerson}}`, `{{CustomNote}}`) with real-time variable mapping.
* **Deliverability & Spam Trigger Audit**: Automated keyword analysis scanning subject lines and message body for high-risk spam triggers.
* **1-by-1 Desktop & Mobile Inspector**: Preview rendered emails side-by-side across Desktop and Mobile (`375px`) viewports before sending.
* **Zero-Password Persistence Security**: SMTP App Passwords live exclusively in ephemeral React memory (`useState`) for your active session and are **never stored on disk, cookies, or databases**.
* **Anti-Spam Throttling & Jitter**: Configurable dispatch delays (1s–10s) with randomized timing jitter to protect domain sender score.

### 💼 LinkedIn Connection Outreach Engine
* **Direct REST Account Integration**: Connect your LinkedIn account directly via **1-Click OAuth 2.0 Login** or **Direct Session Token (`li_at`) paste**. Zero Playwright server overhead required!
* **Strict 300-Character Note Meter**: Visual counter gauge enforcing LinkedIn's strict 300-character limit on connection request notes.
* **LinkedIn Invitation Modal Inspector**: Interactive live preview showing how your custom note renders inside LinkedIn's actual connection request modal.
* **Account Protection Controls**: Configurable randomized delays (3s–8s) and daily invitation cap limits (e.g. max 25 invites/day) to keep activity well within safe thresholds.

---

## 🏗️ Architecture Blueprint

```text
+-----------------------------------------------------------------------+
|                      OPENOUTREACH PURE SAAS DASHBOARD                 |
|   - Hosted Live on GitHub Pages: https://maitreyaaaaa.github.io/      |
|   - Glassmorphism Dark UI & Anime.js v4 Fluid Micro-Interactions      |
+-----------------------------------+-----------------------------------+
                                    |
            +-----------------------+-----------------------+
            |                                               |
            v                                               v
+-----------------------+                       +-----------------------+
|  EMAIL OUTREACH ENGINE|                       | LINKEDIN OUTREACH     |
|  - SMTP & Mail Merge  |                       |  - Direct OAuth 2.0   |
|  - Spam Keyword Audit |                       |  - Direct REST API    |
|  - Zero-Pass Storage  |                       |  - 300-Char Note Meter|
+-----------------------+                       +-----------------------+
```

---

## 🛠️ Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### 2. Clone & Install
```bash
git clone https://github.com/maitreyaaaaa/open-outreach.git
cd open-outreach
npm install
```

### 3. Start Local Development Server
```bash
npm run dev
```
- **Local Dashboard:** [http://localhost:3000](http://localhost:3000)
- **Local API Server:** `http://localhost:3010`

---

## 📦 Production Deployment Options

### A. Static Web SaaS (GitHub Pages)
Build and deploy the web bundle directly to GitHub Pages:
```bash
npm run deploy
```

### B. Docker Cloud Container Deployment
The repository includes a production-ready [Dockerfile](Dockerfile) pre-configured with `mcr.microsoft.com/playwright:v1.44.0-jammy` for 1-click cloud deployments on Render, Railway, or AWS.

```bash
docker build -t open-outreach .
docker run -p 3010:3010 open-outreach
```

---

## 🛡️ Security & Privacy Architecture

1. **Zero Password Persistence**: SMTP passwords exist only in active memory while sending and are wiped when the tab is closed or refreshed.
2. **Local Session Privacy**: User session cookies stay strictly in your local browser storage.
3. **Open Source & Transparent**: 100% auditable open-source code with zero tracking or telemetry.

---

## 📄 License
Distributed under the **MIT License**. See `LICENSE` for more information.
