# OpenOutreach HyperFrames Explainer Video: Visual Design Spec & Scene Choreography Proposal

## 1. Executive Visual Design System & Glassmorphism Tokens

### 1.1 Aesthetic Vibe Archetype
The visual aesthetic is strictly built upon the **Ethereal Glass / OLED Vantablack Luxury** design system (Awwwards-tier $150k agency standard). It delivers haptic visual depth, cinematic spatial rhythm, soft ambient lighting, and high-tech elegance tailored for OpenOutreach — an enterprise-grade, privacy-first cold outreach platform.

- **Primary Background**: Deep OLED dark space (`#030712` / `#050505`) with pointer-events-none radial mesh gradient background elements.
- **Primary Accent & Glow**: Cyan / Electric Emerald (`#06B6D4` / `#10B981` / `#34D399`) representing zero-persistence security, real-time speed, and high deliverability.
- **Secondary Accent & Aura**: Radiant Violet / Indigo (`#8B5CF6` / `#6366F1`) representing AI intelligence and seamless automation.
- **Glass Fills**: Translucent dark cards (`rgba(255, 255, 255, 0.03)` to `rgba(255, 255, 255, 0.06)`).
- **Glass Blur**: `backdrop-blur-2xl` (32px backdrop filter) applied exclusively to fixed/card containers to prevent scrolling GPU performance penalties.
- **Translucent Borders**: Ultra-fine hair-line borders (`border border-white/10` or `rgba(255, 255, 255, 0.12)`).
- **Soft Ambient Glow**: Diffused soft drop-shadows (`drop-shadow(0 20px 40px rgba(6, 182, 212, 0.15))`) and glowing perimeter rings.

### 1.2 "Doppelrand" (Double-Bezel) Card Architecture
Following the high-end visual design contract, all major cards, feature callouts, and code/demo containers use nested machine-like enclosures:
- **Outer Shell**: Wrapper element with `bg-white/[0.02] border border-white/10 p-2 rounded-[28px] backdrop-blur-2xl shadow-2xl`.
- **Inner Core**: Active content container with `bg-black/40 border border-white/5 p-6 rounded-[20px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]`.

```html
<!-- Example Doppelrand Card Markup Structure -->
<div class="glass-outer-shell bg-white/[0.02] border border-white/10 p-2 rounded-[28px] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
  <div class="glass-inner-core bg-[#0b0f19]/80 border border-white/5 p-6 rounded-[20px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] relative overflow-hidden">
    <div class="card-content">...</div>
  </div>
</div>
```

### 1.3 Button-in-Button CTA Architecture
Primary call-to-action elements use nested circular trailing icon containers:
- **Outer Pill**: `rounded-full px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-400/30 text-white font-medium flex items-center gap-3`.
- **Inner Icon Circle**: `w-8 h-8 rounded-full bg-cyan-400/20 border border-cyan-300/40 flex items-center justify-center text-cyan-300 shadow-inner group-hover:scale-105 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform`.

### 1.4 Typography & Kinetic Typography Engine
- **Font Selection**: Premium geometric sans-serif (`Plus Jakarta Sans` or `Clash Display` loaded via Google Fonts / local webfonts).
- **Headings**: Heavy weight (700-800), negative tracking (`-0.03em`), line-height `1.05`.
- **Acronym Eyebrow Badges**: Micro-pill shape (`rounded-full px-3.5 py-1 text-[11px] uppercase tracking-[0.25em] font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-500/30`).
- **Kinetic Typo Animations**:
  1. *Staggered Word Reveal*: Words fade in, translate up, and unblur (`gsap.fromTo(words, { opacity: 0, y: 25, rotateX: -15, filter: 'blur(8px)' }, { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.05, ease: 'power3.out' })`).
  2. *Acronym Decrypt Effect*: Technical acronyms (SMTP, RAM, OAuth 2.0, REST API, SPA) rapidly cycle random characters before locking into place, accompanied by a glowing subtitle expansion explaining the concept in plain English.
  3. *Placeholder Morphing*: In the Mail Merge demo, placeholder tokens like `{{first_name}}` morph into real names ("Sarah") with a subtle text glow and color shift.

---

## 2. Technical HyperFrames Contract Compliance

1. **Standalone Root Sizing**:
   - `index.html` standalone root element `<div data-composition-id="open-outreach-promo" data-duration="60s">` sized explicitly to `width: 1920px; height: 1080px; position: relative; overflow: hidden;`.
   - Explicit sizing ensures zero flexbox collapse or top-left stack bugs during headless rendering.

2. **Full-Bleed Background Child Rule**:
   - Background is attached to a full-bleed absolute child `<div class="absolute inset-0 bg-[#030712] overflow-hidden">` rather than the composition root itself, guaranteeing video frames never render as black screens during CLI compositing.

3. **GSAP Timeline Registration (`window.__timelines`)**:
   - Single paused timeline constructed synchronously at page load:
     ```js
     window.__timelines = window.__timelines || {};
     const tl = gsap.timeline({ paused: true });
     window.__timelines["open-outreach-promo"] = tl;
     ```
   - Total render duration exactly matches `data-duration="60s"`.

4. **Seek-Safety & Determinism Rules**:
   - **Allowed Tweens**: Only transform properties (`x`, `y`, `scale`, `rotation`, `skewX`, `skewY`) and non-layout properties (`opacity`, `color`, `backgroundColor`, `borderColor`, `borderRadius`).
   - **Visibility Rules**: `.clip` visibility managed strictly by HyperFrames framework via `data-start` and `data-duration`. Inner element visibility transitions use `autoAlpha` or opacity. No page-load `gsap.set` on later-scene clips.
   - **Pre-computed Constants**: All spatial targets and pixel distances pre-calculated at script initialization — zero `getBoundingClientRect()` calls inside animation loops or GSAP callbacks.
   - **Determinism Guarantee**: No `Math.random()`, no `Date.now()`, no `repeat: -1`. All loops finite and deterministic.

5. **Track & Clip Layout Architecture**:
   - Main scenes reside on `data-track-index="0"`.
   - Overlay transitions (cross-dissolves, light leaks, glass wipes) occupy `data-track-index="1"`.

---

## 3. 6-Scene Detailed Choreography & Narrative Structure (60.0s Total)

The video is structured across 6 dynamic, 10-second scenes detailing OpenOutreach's 5 core features and 5 key technical acronyms explained in accessible, non-technical terms.

```
+---------------------------------------------------------------------------------------------------+
| Timeline Breakdown (60.0s)                                                                        |
+-------------------+--------------------+--------------------+--------------------+----------------+
| Scene 1 (0s-10s)  | Scene 2 (10s-20s)  | Scene 3 (20s-30s)  | Scene 4 (30s-40s)  | Scene 5/6 (40s-60s)
| Hero & SPA        | Mail Merge & SMTP  | Security & RAM     | LinkedIn & OAuth   | Note Guard/Pages
+-------------------+--------------------+--------------------+--------------------+----------------+
```

### Scene 1: Hero & Concept Introduction — "Reclaiming Cold Outreach"
- **Timing**: `data-start="0s"` `data-duration="10s"` (Track 0)
- **Primary Narrative Focus**: Introduce OpenOutreach as the modern, privacy-first alternative to clunky, expensive cold outreach tools. Introduce **SPA** (Single Page Application).
- **Layman Explanation**:
  - *Acronym*: **SPA (Single Page Application)**
  - *Non-Technical Analogy*: "A desktop-like web app that feels ultra-smooth without frustrating full page reloads."
- **Visual Elements**:
  - Grand Doppelrand glass card in center frame (`1000px` x `520px`).
  - Radial mesh background glowing in subtle emerald & violet pulses.
  - Floating badge pill: `SPA: SINGLE PAGE APPLICATION`.
- **Kinetic Typo**:
  - Headline: "Cold Outreach. Reimagined for Speed & Privacy."
  - Staggered word entrance with 3D tilt (`rotateX: -15deg`).
  - Badge scramble decrypt: "SPA" -> "Single Page Application (Desktop-Smooth Web Experience)".
- **GSAP Timeline Steps (0.0s - 10.0s)**:
  - `0.0s - 1.5s`: Radial background aura expands. Hero Doppelrand card slides up from `y: 40px` with `opacity: 0 -> 1` and `blur: 10px -> 0px`.
  - `1.5s - 3.5s`: Kinetic headline reveal word-by-word (`stagger: 0.06s`). SPA badge decrypt animation plays.
  - `3.5s - 8.0s`: Three floating glass feature pills ("100% Client-Side", "Zero Server Storage", "Lightning Fast") float into orbit with gentle sine-wave floating motion (`y: +=8px`, `ease: sine.inOut`).
  - `8.0s - 10.0s`: Camera scale push-in (`scale: 1 -> 1.05`), scene opacity fades out to prepare for Scene 2.

---

### Scene 2: Feature 1 & Acronym 1 — Personalized Mail Merge via SMTP
- **Timing**: `data-start="10s"` `data-duration="10s"` (Track 0)
- **Primary Narrative Focus**: Feature 1: **Email Mail Merge** & Acronym 1: **SMTP**.
- **Layman Explanation**:
  - *Acronym*: **SMTP (Simple Mail Transfer Protocol)**
  - *Non-Technical Analogy*: "Your digital postman delivering personalized emails reliably to inbox recipients at scale."
- **Visual Elements**:
  - Animated glass envelope/mail card with glowing teal border.
  - Interactive CSV data table preview sliding in from the right (`name`, `company`, `role`).
  - Digital Postman badge icon sending glowing data packets along connector lines.
- **Kinetic Typo**:
  - Eyebrow Badge: `SMTP: SIMPLE MAIL TRANSFER PROTOCOL`.
  - Live morphing text: `Hello {{first_name}} at {{company}}` morphs in real-time into `Hello Sarah at Acme Corp` with a golden text shimmer.
- **GSAP Timeline Steps (10.0s - 20.0s)**:
  - `10.0s - 11.5s`: Scene 2 clip activates. Glass mail card wipes in from left (`x: -60px -> 0px`, `autoAlpha: 0 -> 1`). SMTP eyebrow decrypts.
  - `11.5s - 15.0s`: CSV data rows cascade into place (`stagger: 0.1s`). Template variables morph smoothly into personalized values with text glow.
  - `15.0s - 18.0s`: Animated glowing pulse fires from envelope down the SMTP connector line to a target inbox graphic. Counter ticks: "1,000 Emails Sent | 99.8% Inbox Rate".
  - `18.0s - 20.0s`: Mail card scales down (`scale: 1 -> 0.95`), vertical glass slide wipe transitions to Scene 3.

---

### Scene 3: Feature 2 & Acronym 2 — Zero-Persistence Security & RAM
- **Timing**: `data-start="20s"` `data-duration="10s"` (Track 0)
- **Primary Narrative Focus**: Feature 2: **Zero-Persistence Security** & Acronym 2: **RAM**.
- **Layman Explanation**:
  - *Acronym*: **RAM (Random Access Memory)**
  - *Non-Technical Analogy*: "Temporary workspace memory that completely clears the moment you close the tab — leaving no trace behind."
- **Visual Elements**:
  - Glass Vault Shield in center with glowing emerald perimeter ring.
  - RAM memory chip schematic graphic with active data nodes.
  - Simulated browser tab closing action -> instant data dissolve into digital stardust.
- **Kinetic Typo**:
  - Headline: "Zero Data Stored on External Cloud Servers."
  - Eyebrow Badge: `RAM: RANDOM ACCESS MEMORY`.
  - Subtitle: "Your campaign data lives strictly in your browser's RAM and vanishes when closed."
- **GSAP Timeline Steps (20.0s - 30.0s)**:
  - `20.0s - 21.5s`: Glass Vault Shield locks into center frame with spring bounce (`scale: 0.8 -> 1`, `ease: back.out(1.7)`).
  - `21.5s - 25.0s`: RAM chip schematic nodes light up green. Campaign credentials float inside the vault shield.
  - `25.0s - 28.0s`: Simulated "Tab Close" event trigger — RAM chip memory wipe effect (`opacity: 1 -> 0`, `filter: blur(12px)`), vault shield emits a vivid green pulse with text badge: "100% PRIVATE & WIPED".
  - `28.0s - 30.0s`: Vault shield rotates on Y-axis (`rotateY: 0deg -> 90deg`) to execute 3D flip exit into Scene 4.

---

### Scene 4: Feature 3 & Acronym 3 — Direct LinkedIn REST API & OAuth 2.0
- **Timing**: `data-start="30s"` `data-duration="10s"` (Track 0)
- **Primary Narrative Focus**: Feature 3: **Direct LinkedIn REST API** & Acronym 3: **OAuth 2.0**.
- **Layman Explanation**:
  - *Acronym*: **REST API (Representational State Transfer Application Programming Interface)**
  - *Non-Technical Analogy*: "A digital waiter taking your request directly to LinkedIn and bringing back instant results."
  - *Acronym*: **OAuth 2.0 (Open Authorization)**
  - *Non-Technical Analogy*: "A secure digital access badge that lets OpenOutreach work without ever storing your password."
- **Visual Elements**:
  - Dual glass card setup: Left card = LinkedIn Connection Node + Digital Waiter REST API icon; Right card = OAuth 2.0 Security Access Badge.
  - High-speed glowing data beam bridging the two cards.
- **Kinetic Typo**:
  - Headline: "Direct Integration. No Flaky Browser Extensions."
  - Dual Eyebrows: `REST API: DIGITAL WAITER SERVICE` & `OAUTH 2.0: SECURE DIGITAL BADGE`.
- **GSAP Timeline Steps (30.0s - 40.0s)**:
  - `30.0s - 31.5s`: Dual glass cards slide in from opposite sides (`x: -80px` & `x: 80px -> 0px`).
  - `31.5s - 35.0s`: OAuth 2.0 badge animation — glowing key icon inserts into access slot, emitting a verification ring ("Authentication Successful — No Password Required").
  - `35.0s - 38.0s`: REST API connection line pulses with rapid data payloads from LinkedIn endpoint to OpenOutreach dashboard.
  - `38.0s - 40.0s`: Both cards translate horizontally leftward (`x: 0px -> -1920px`) in a sleek bezel sweep.

---

### Scene 5: Feature 4 & Feature 5 — 300-Char Note Guard & GitHub Pages Web SaaS
- **Timing**: `data-start="40s"` `data-duration="10s"` (Track 0)
- **Primary Narrative Focus**: Feature 4: **300-Char Note Guard** & Feature 5: **GitHub Pages Web SaaS**.
- **Layman Explanation**:
  - *Concept*: **300-Char Note Guard**
  - *Non-Technical Analogy*: "Automatic character shield preventing truncated invitation notes on LinkedIn."
  - *Concept*: **GitHub Pages Web SaaS**
  - *Non-Technical Analogy*: "100% free serverless web app hosted directly on GitHub — zero subscription fees."
- **Visual Elements**:
  - Left side: Live note editor card with character progress ring (`285/300` green -> `305/300` red alert shield).
  - Right side: GitHub octocat cloud node with zero-cost `$0/mo` floating badge.
- **Kinetic Typo**:
  - Headline: "Built-in Guardrails & Zero Subscription Fees."
  - Counter ring: "Character Safety Guard: 300 Max".
  - Cloud badge: "Host Free on GitHub Pages".
- **GSAP Timeline Steps (40.0s - 50.0s)**:
  - `40.0s - 41.5s`: Note editor card and GitHub cloud node float into place (`y: 50px -> 0px`).
  - `41.5s - 45.0s`: Character counter ring fills dynamically: text reaches 295 chars (glowing green ring), attempts to exceed 300 (soft red guard shield pulses, preventing truncated notes).
  - `45.0s - 48.0s`: Note editor flips to reveal GitHub Pages deployment card: "Click Once to Deploy — Free Forever on GitHub Pages".
  - `48.0s - 50.0s`: Radial glow contracts into center in preparation for Grand Finale.

---

### Scene 6: Finale & Call to Action — "Your Outreach, Your Terms"
- **Timing**: `data-start="50s"` `data-duration="10s"` (Track 0)
- **Primary Narrative Focus**: Summary of OpenOutreach benefits + Call to Action to star, fork, and deploy on GitHub.
- **Visual Elements**:
  - Master Doppelrand Showcase Card in center frame (`1100px` x `560px`).
  - 5 floating orbiting pills representing all 5 features (Mail Merge, Zero Persistence, LinkedIn API, Note Guard, GitHub Pages).
  - Button-in-button CTA button: `GET STARTED FREE ↗`.
- **Kinetic Typo**:
  - Main Title: "OpenOutreach"
  - Subtitle: "Take Full Control of Your Cold Outreach Today."
  - CTA Button: "Launch Dashboard ↗" with internal arrow pulse.
- **GSAP Timeline Steps (50.0s - 60.0s)**:
  - `50.0s - 52.0s`: Master Doppelrand card scales up smoothly from center (`scale: 0.85 -> 1`, `opacity: 0 -> 1`, `ease: power3.out`).
  - `52.0s - 56.0s`: 5 feature badges float into orbital positions around central card with staggered spring entrance (`stagger: 0.08s`).
  - `56.0s - 58.5s`: Simulated hover physics on CTA button (scale `1.04`, trailing arrow translates `x: 3px`, `y: -3px`, inner glow intensifies).
  - `58.5s - 60.0s`: Soft cinematic vignette darkens edges while OpenOutreach glowing logo lingers clean until full 60.00s mark.

---

## 4. Scene Transitions Strategy & Track Allocation

To ensure fluidity and zero layout thrashing, transitions use double-buffered clip staging and GSAP cross-fades across tracks when necessary:

| Transition Pair | Time Window | Style / Technique | Track Setup | GSAP Easing |
|---|---|---|---|---|
| **Scene 1 -> Scene 2** | `8.5s - 10.0s` | Cross-Dissolve + Depth Zoom | Track 0 (Scene 1 scale `1 -> 1.05`, `opacity -> 0`) / Track 0 (Scene 2 scale `0.95 -> 1`, `opacity -> 1`) | `power2.inOut` |
| **Scene 2 -> Scene 3** | `18.5s - 20.0s` | Vertical Glass Slide Wipe | Track 0 (Scene 2 `y: 0 -> -100%`) / Track 1 (Scene 3 `y: 100% -> 0`) | `cubic-bezier(0.32, 0.72, 0, 1)` |
| **Scene 3 -> Scene 4** | `28.5s - 30.0s` | 3D Y-Axis Card Flip | Track 0 (Scene 3 `rotateY: 0deg -> 90deg`) / Track 0 (Scene 4 `rotateY: -90deg -> 0deg`) | `power3.inOut` |
| **Scene 4 -> Scene 5** | `38.5s - 40.0s` | Horizontal Bezel Sweep | Track 0 (Scene 4 `x: 0 -> -1920px`) / Track 0 (Scene 5 `x: 1920px -> 0`) | `cubic-bezier(0.32, 0.72, 0, 1)` |
| **Scene 5 -> Scene 6** | `48.5s - 50.0s` | Radial Iris Expansion | Track 0 (Scene 5 fade out) / Track 1 (Radial Glow Iris expands from center -> contracts into CTA card) | `power3.inOut` |

---

## 5. Performance & Verification Matrix

- **GPU Safety**: Only `transform` (`x`, `y`, `scale`, `rotateX`, `rotateY`) and `opacity`/`filter` are animated. `top`, `left`, `width`, `height` remain static.
- **Backdrop Blur Discipline**: Applied only to fixed card containers (`.glass-outer-shell`), never to scrolling containers.
- **Determinism Check**: Zero non-deterministic functions (`Math.random`, `Date.now`, `performance.now`).
- **Target Resolution**: `1920x1080` (16:9 Full HD).
- **Target Duration**: 60.00 seconds.
- **CLI Lint Standard**: Fully compatible with `npx hyperframes check` & `npx hyperframes render`.
