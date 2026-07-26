# OpenOutreach HyperFrames Explainer Video: Audio & Timing Blueprint

## 1. Executive Audio & Timing Overview

- **Total Video Duration**: 60.0 Seconds (60,000 ms)
- **Target Frame Rate**: 30 FPS (Total 1,800 Frames)
- **Resolution**: 1920x1080 (16:9 Full HD)
- **Scene Breakdown**: 6 Scenes @ 10.0 seconds (300 frames) each
- **Visual Aesthetic**: Dark Glassmorphism SaaS UI (`#0f172a` slate background, backdrop-blur acrylic cards, glowing neon accents: `#38bdf8` email blue, `#0a66c2` linkedin blue, `#10b981` emerald green security)
- **Target Audience**: Business leaders, sales teams, non-technical founders, and marketing professionals.

---

## 2. Master Audio & Speech Timing Matrix

| Scene # | Time Window | Duration | Line ID | Narration Text | Word Count | Target WPM | Key Acronym & Layman Analogy | Key Feature Highlighted |
|---|---|---|---|---|---|---|---|---|
| **Scene 1** | 00:00 - 00:10 | 10.0s (300f) | `line_01` | "Reaching out to clients shouldn't mean sacrificing security. Meet OpenOutreach—a desktop-smooth web application that runs instantly in your browser." | 21 words | 126 WPM | **SPA** (Single Page Application): *A desktop-like web app that feels smooth without full page reloads.* | **GitHub Pages Web SaaS** |
| **Scene 2** | 00:10 - 00:20 | 10.0s (300f) | `line_02` | "Our Email Engine makes bulk outreach personal. Mail Merge automatically tailors every message with dynamic tags, using standard email postmen to deliver straight to inboxes." | 25 words | 150 WPM | **SMTP** (Simple Mail Transfer Protocol): *A digital postman delivering your electronic mail reliably.* | **Email Mail Merge & Spam Audit** |
| **Scene 3** | 00:20 - 00:30 | 10.0s (300f) | `line_03` | "Worried about password leaks? OpenOutreach features Zero-Persistence Security. Your credentials live only in temporary workspace memory, completely clearing the moment you close your tab." | 25 words | 150 WPM | **RAM** (Random Access Memory): *Your computer's temporary workspace desk that wipes clean when closed.* | **Zero-Persistence Security** |
| **Scene 4** | 00:30 - 00:40 | 10.0s (300f) | `line_04` | "Scale your LinkedIn networking effortlessly. With direct REST API integration, OpenOutreach acts like a digital waiter—fetching responses and delivering invitations directly." | 23 words | 138 WPM | **REST API** (Representational State Transfer API): *A digital waiter taking your order to the server and bringing back answers.* | **Direct LinkedIn REST API** |
| **Scene 5** | 00:40 - 00:50 | 10.0s (300f) | `line_05` | "Connect safely using OAuth two point zero—a digital badge for password-free access. Plus, our Note Guard keeps every invite under LinkedIn's strict three hundred character limit." | 26 words | 156 WPM | **OAuth 2.0** (Open Authorization): *A secure digital VIP badge that lets you enter without sharing passwords.* | **300-Char Note Guard** |
| **Scene 6** | 00:50 - 01:00 | 10.0s (300f) | `line_06` | "Zero installation, zero database risks, one hundred percent open source. OpenOutreach is live on GitHub Pages today. Launch your campaign with total confidence!" | 23 words | 138 WPM | Summary of zero-risk architecture | **Live Web SaaS & Call-to-Action** |

**Total Words**: 143 words across 60 seconds (Average Speaking Rate: ~143 WPM — ideal for clear, natural explainer audio).

---

## 3. Audio Asset & Generation Strategy

### A. TTS Voiceover Strategy
- **Engine Runner**: `scripts/audio.mjs` via standard HyperFrames audio pipeline.
- **Provider Priority**:
  1. **HeyGen Starfish REST API** (`heygen-tts.mjs`): First choice when `$HEYGEN_API_KEY` is present. Delivers native word-level timestamps (`words.json`) for pinpoint kinetic typography karaoke synchronization.
  2. **ElevenLabs API**: Secondary fallback (e.g. `Adam` or `Rachel` voice). Requires automatic Whisper transcription step for word timestamps.
  3. **Kokoro-82M (Local Offline)**: No-credential fallback using `am_michael` or `af_bella` at `speed: 1.0`. Auto-chains local Whisper transcription (`npx hyperframes transcribe`) to generate word timing array.
- **Voice Tone**: Professional, warm, engaging corporate tech narrator with moderate cadence.

### B. Background Music (BGM) Strategy
- **Mood**: Modern corporate tech, subtle synthwave / futuristic SaaS promo vibe.
- **Retrieval Query**: `"modern upbeat tech corporate sfx background music synth pad gentle pulse"`
- **Audio Mix Level**: Volume set to `0.15` (-18 dB relative to voiceover) with automatic sidechain ducking during TTS speech lines.
- **Fallback**: Lyria / MusicGen offline generation if HeyGen API is uncredentialed.

### C. Sound Effects (SFX) Integration Plan
- **Audio Level**: `0.35` (-9 dB relative balance).
- **SFX Cue Mapping**:
  - `scene_1_intro`: `whoosh_subtle.mp3` (at t=0.5s), `tech_click_1.mp3` (at t=3.0s when SPA badge reveals)
  - `scene_2_email`: `paper_swoosh.mp3` (at t=10.5s), `keyboard_type_short.mp3` (at t=13.0s), `chime_success.mp3` (at t=17.5s)
  - `scene_3_security`: `vault_lock.mp3` (at t=20.5s), `shield_hum.mp3` (at t=23.0s), `bubble_pop.mp3` (at t=28.0s)
  - `scene_4_linkedin`: `slide_whish.mp3` (at t=30.5s), `bell_ding_waiter.mp3` (at t=33.5s), `data_pulse.mp3` (at t=37.0s)
  - `scene_5_oauth`: `digital_unlock.mp3` (at t=40.5s), `meter_tick_fast.mp3` (at t=44.0s), `check_ding.mp3` (at t=47.5s)
  - `scene_6_cta`: `synth_glissando_up.mp3` (at t=50.5s), `cta_click_heavy.mp3` (at t=55.0s), `sparkle_shimmer.mp3` (at t=58.5s)

---

## 4. Scene-by-Scene Detailed Audio & Animation Blueprint

### Scene 1: Introduction & Pure Web SaaS (00:00 - 00:10)
- **Title**: *The Modern Outreach Challenge*
- **Narration Line (`line_01`)**: "Reaching out to clients shouldn't mean sacrificing security. Meet OpenOutreach—a desktop-smooth web application that runs instantly in your browser."
- **Acronym**: **SPA** (Single Page Application)
  - *Layman Analogy*: A desktop-like web application that feels smooth and fast without waiting for full page reloads.
- **Feature**: **GitHub Pages Web SaaS** (Instant browser access, zero downloads required).
- **Visual Micro-Interactions**:
  - `00:00 - 00:03`: Dark glassmorphism background fades in; hero headline "OpenOutreach" illuminates with sky-blue gradient.
  - `00:03 - 00:07`: Dual channel badges ("Email Engine" + "LinkedIn Engine") slide in from left and right.
  - `00:07 - 00:10`: SPA indicator badge pops in with a smooth desktop window graphic; subtitle explains "Desktop performance inside your browser".

### Scene 2: Enterprise Email Outreach & SMTP Mail Merge (00:10 - 00:20)
- **Title**: *Personalization at Scale*
- **Narration Line (`line_02`)**: "Our Email Engine makes bulk outreach personal. Mail Merge automatically tailors every message with dynamic tags, using standard email postmen to deliver straight to inboxes."
- **Acronym**: **SMTP** (Simple Mail Transfer Protocol)
  - *Layman Analogy*: A digital postman delivering your electronic mail reliably across the internet.
- **Feature**: **Email Mail Merge & Dynamic Personalization**
- **Visual Micro-Interactions**:
  - `00:10 - 00:13`: Scene morphs into Email Suite view with glassmorphism card floating center.
  - `00:13 - 00:17`: Mustache tags (`{{Company}}`, `{{ContactPerson}}`) animate and replace dynamically with live contact data ("Acme Corp", "Sarah Jenkins").
  - `00:17 - 00:20`: Digital Postman mascot graphic glides across, depositing stamped envelopes into inbox container. Spam score gauge shows "100% Safe".

### Scene 3: Zero-Persistence Security (00:20 - 00:30)
- **Title**: *Ephemeral Privacy Guard*
- **Narration Line (`line_03`)**: "Worried about password leaks? OpenOutreach features Zero-Persistence Security. Your credentials live only in temporary workspace memory, completely clearing the moment you close your tab."
- **Acronym**: **RAM** (Random Access Memory)
  - *Layman Analogy*: Your computer's temporary workspace desk that clears completely when you close the application.
- **Feature**: **Zero-Persistence Security**
- **Visual Micro-Interactions**:
  - `00:20 - 00:23`: Glowing emerald shield icon scales up in 3D perspective with glass background.
  - `00:23 - 00:27`: "RAM Workspace" container shows password tokens glowing inside floating bubbles.
  - `00:27 - 00:30`: Tab close animation triggers; bubbles pop and dissolve into light particles, displaying "Disk Storage: 0 Bytes • Memory Cleared".

### Scene 4: LinkedIn Connection Outreach & Direct REST API (00:30 - 00:40)
- **Title**: *Direct Networking Automation*
- **Narration Line (`line_04`)**: "Scale your LinkedIn networking effortlessly. With direct REST API integration, OpenOutreach acts like a digital waiter—fetching responses and delivering invitations directly."
- **Acronym**: **REST API** (Representational State Transfer API)
  - *Layman Analogy*: A digital waiter taking your order to the server and bringing back answers instantly.
- **Feature**: **Direct LinkedIn REST API Integration**
- **Visual Micro-Interactions**:
  - `00:30 - 00:33`: LinkedIn deep blue theme accents ignite; profile connection card emerges.
  - `00:33 - 00:37`: Animated "Digital Waiter" icon carrying a tray transfers data packets between browser dashboard and LinkedIn server icon without headless browser bloat.
  - `00:37 - 00:40`: Connection request status updates to "Sent Directly via REST • 0 Server Overhead".

### Scene 5: OAuth 2.0 VIP Access & 300-Char Note Guard (00:40 - 00:50)
- **Title**: *Safe Access & Smart Constraints*
- **Narration Line (`line_05`)**: "Connect safely using OAuth two point zero—a digital badge for password-free access. Plus, our Note Guard keeps every invite under LinkedIn's strict three hundred character limit."
- **Acronym**: **OAuth 2.0** (Open Authorization)
  - *Layman Analogy*: A secure digital VIP badge that lets you enter without giving out your master password.
- **Feature**: **300-Char Note Guard**
- **Visual Micro-Interactions**:
  - `00:40 - 00:43`: Gold glowing "VIP Badge" clips onto the LinkedIn session container, granting instant authorized access.
  - `00:43 - 00:47`: Interactive 300-Character Note Gauge fills dynamically as text types (`284 / 300 Characters`).
  - `00:47 - 00:50`: Gauge flashes emerald green with a checkmark badge: "Character Limit Enforced • Account Protected".

### Scene 6: Instant GitHub Pages SaaS & Call to Action (00:50 - 01:00)
- **Title**: *Launch Your Campaign Today*
- **Narration Line (`line_06`)**: "Zero installation, zero database risks, one hundred percent open source. OpenOutreach is live on GitHub Pages today. Launch your campaign with total confidence!"
- **Feature**: **GitHub Pages Web SaaS Launch & Open Source Suite**
- **Visual Micro-Interactions**:
  - `00:50 - 00:54`: All feature cards (Email Merge, Zero-Pass Security, REST LinkedIn, Note Guard) converge into a unified dashboard view.
  - `00:54 - 00:57`: Glowing URL pill highlights: `maitreyaaaaa.github.io/open-outreach`.
  - `00:57 - 01:00`: Pulsing primary Call-To-Action button ("Launch Free Web SaaS") shines with animated glass shimmer as video concludes.

---

## 5. Specification for `videos/open-outreach-promo/STORYBOARD.md`

When Milestone 1 creates `videos/open-outreach-promo/STORYBOARD.md`, it will follow this exact document structure:

```markdown
# OpenOutreach Promo Explainer Video Storyboard

## Overview
- **Project**: OpenOutreach Enterprise Dual-Channel Outreach Suite
- **Duration**: 60 Seconds (1,800 Frames @ 30 FPS)
- **Format**: HyperFrames HTML + GSAP Timelines (`window.__timelines`)
- **Theme**: Dark Glassmorphism, Neon Blue & Emerald Accents

---

## Scene 1: Introduction & SPA Web SaaS (00:00 - 00:10)
- **Visual**: Glassmorphism Hero Title, Dual Channel Badges (Email & LinkedIn), SPA Badge.
- **Voiceover**: "Reaching out to clients shouldn't mean sacrificing security. Meet OpenOutreach—a desktop-smooth web application that runs instantly in your browser."
- **Acronym Introduced**: **SPA** (Single Page Application)
  - *Layman Explanation*: Like a desktop app that runs inside your web browser smoothly without reloading pages.
- **Feature**: GitHub Pages Web SaaS (Instant access, no installation).

## Scene 2: Enterprise Email & SMTP Mail Merge (00:10 - 00:20)
- **Visual**: Dynamic mustache tags replacement (`{{Company}}`), Digital Postman delivery animation.
- **Voiceover**: "Our Email Engine makes bulk outreach personal. Mail Merge automatically tailors every message with dynamic tags, using standard email postmen to deliver straight to inboxes."
- **Acronym Introduced**: **SMTP** (Simple Mail Transfer Protocol)
  - *Layman Explanation*: The digital postman that safely delivers your emails across the internet.
- **Feature**: Email Mail Merge & Deliverability Audit.

## Scene 3: Zero-Persistence Security & Ephemeral RAM (00:20 - 00:30)
- **Visual**: Emerald Security Shield, RAM Memory Bubble wiping animation, 0-Byte Disk indicator.
- **Voiceover**: "Worried about password leaks? OpenOutreach features Zero-Persistence Security. Your credentials live only in temporary workspace memory, completely clearing the moment you close your tab."
- **Acronym Introduced**: **RAM** (Random Access Memory)
  - *Layman Explanation*: Your computer's temporary workspace desk that clears when you close the tab.
- **Feature**: Zero-Persistence Password Security.

## Scene 4: LinkedIn Outreach & Direct REST API (00:30 - 00:40)
- **Visual**: LinkedIn blue theme, Digital Waiter tray icon delivering API payloads directly.
- **Voiceover**: "Scale your LinkedIn networking effortlessly. With direct REST API integration, OpenOutreach acts like a digital waiter—fetching responses and delivering invitations directly."
- **Acronym Introduced**: **REST API** (Representational State Transfer API)
  - *Layman Explanation*: A digital waiter taking your request to the server and bringing back results instantly.
- **Feature**: Direct LinkedIn REST API Integration.

## Scene 5: OAuth 2.0 VIP Badge & 300-Char Note Guard (00:40 - 00:50)
- **Visual**: VIP Pass unlock graphic, 300-Char Note Gauge meter filling up and turning emerald green.
- **Voiceover**: "Connect safely using OAuth two point zero—a digital badge for password-free access. Plus, our Note Guard keeps every invite under LinkedIn's strict three hundred character limit."
- **Acronym Introduced**: **OAuth 2.0** (Open Authorization)
  - *Layman Explanation*: A secure digital VIP badge that lets you enter without sharing passwords.
- **Feature**: 300-Character Note Guard & Invitation Inspector.

## Scene 6: Live Web SaaS & Call to Action (00:50 - 01:00)
- **Visual**: Dashboard convergence, Glowing Live URL badge, Pulsing CTA Button ("Launch Free Web SaaS").
- **Voiceover**: "Zero installation, zero database risks, one hundred percent open source. OpenOutreach is live on GitHub Pages today. Launch your campaign with total confidence!"
- **Feature**: Live Web SaaS URL & Call to Action.
```

---

## 6. Specification for `videos/open-outreach-promo/SCRIPT.md`

When Milestone 1 creates `videos/open-outreach-promo/SCRIPT.md`, it will follow this exact voiceover narration transcript structure:

```markdown
# OpenOutreach Promo Voiceover Script & Audio Manifest

## Audio Config & TTS Setup
- **Total Duration**: 60 Seconds
- **Recommended Provider**: HeyGen REST (`heygen-tts.mjs`) / Kokoro (`am_michael`)
- **Speech Speed**: 1.0 (Approx. 143 Words Per Minute)
- **Background Music**: Modern Upbeat Tech Corporate Ambient Synth (Volume: 0.15)

---

## Voiceover Lines & Cues

### Scene 1 [00:00 - 00:10]
- **Line ID**: `line_01`
- **Text**: "Reaching out to clients shouldn't mean sacrificing security. Meet OpenOutreach—a desktop-smooth web application that runs instantly in your browser."
- **SFX**: `whoosh_subtle.mp3` [t=0.5s], `tech_click_1.mp3` [t=3.0s]

### Scene 2 [00:10 - 00:20]
- **Line ID**: `line_02`
- **Text**: "Our Email Engine makes bulk outreach personal. Mail Merge automatically tailors every message with dynamic tags, using standard email postmen to deliver straight to inboxes."
- **SFX**: `paper_swoosh.mp3` [t=10.5s], `chime_success.mp3` [t=17.5s]

### Scene 3 [00:20 - 00:30]
- **Line ID**: `line_03`
- **Text**: "Worried about password leaks? OpenOutreach features Zero-Persistence Security. Your credentials live only in temporary workspace memory, completely clearing the moment you close your tab."
- **SFX**: `vault_lock.mp3` [t=20.5s], `bubble_pop.mp3` [t=28.0s]

### Scene 4 [00:30 - 00:40]
- **Line ID**: `line_04`
- **Text**: "Scale your LinkedIn networking effortlessly. With direct REST API integration, OpenOutreach acts like a digital waiter—fetching responses and delivering invitations directly."
- **SFX**: `slide_whish.mp3` [t=30.5s], `bell_ding_waiter.mp3` [t=33.5s]

### Scene 5 [00:40 - 00:50]
- **Line ID**: `line_05`
- **Text**: "Connect safely using OAuth two point zero—a digital badge for password-free access. Plus, our Note Guard keeps every invite under LinkedIn's strict three hundred character limit."
- **SFX**: `digital_unlock.mp3` [t=40.5s], `check_ding.mp3` [t=47.5s]

### Scene 6 [00:50 - 01:00]
- **Line ID**: `line_06`
- **Text**: "Zero installation, zero database risks, one hundred percent open source. OpenOutreach is live on GitHub Pages today. Launch your campaign with total confidence!"
- **SFX**: `synth_glissando_up.mp3` [t=50.5s], `cta_click_heavy.mp3` [t=55.0s]
```

---

## 7. Audio Engine Request Schema (`audio_request.json`)

```json
{
  "provider": "heygen",
  "speed": 1.0,
  "bgm": {
    "mode": "retrieve",
    "query": "modern upbeat tech corporate sfx background music synth pad gentle pulse"
  },
  "lines": [
    {
      "id": "line_01",
      "text": "Reaching out to clients shouldn't mean sacrificing security. Meet OpenOutreach—a desktop-smooth web application that runs instantly in your browser.",
      "sfx": ["whoosh_subtle", "tech_click_1"]
    },
    {
      "id": "line_02",
      "text": "Our Email Engine makes bulk outreach personal. Mail Merge automatically tailors every message with dynamic tags, using standard email postmen to deliver straight to inboxes.",
      "sfx": ["paper_swoosh", "chime_success"]
    },
    {
      "id": "line_03",
      "text": "Worried about password leaks? OpenOutreach features Zero-Persistence Security. Your credentials live only in temporary workspace memory, completely clearing the moment you close your tab.",
      "sfx": ["vault_lock", "bubble_pop"]
    },
    {
      "id": "line_04",
      "text": "Scale your LinkedIn networking effortlessly. With direct REST API integration, OpenOutreach acts like a digital waiter—fetching responses and delivering invitations directly.",
      "sfx": ["slide_whish", "bell_ding_waiter"]
    },
    {
      "id": "line_05",
      "text": "Connect safely using OAuth two point zero—a digital badge for password-free access. Plus, our Note Guard keeps every invite under LinkedIn's strict three hundred character limit.",
      "sfx": ["digital_unlock", "check_ding"]
    },
    {
      "id": "line_06",
      "text": "Zero installation, zero database risks, one hundred percent open source. OpenOutreach is live on GitHub Pages today. Launch your campaign with total confidence!",
      "sfx": ["synth_glissando_up", "cta_click_heavy"]
    }
  ]
}
```
