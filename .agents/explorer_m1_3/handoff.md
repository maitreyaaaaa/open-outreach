# Handoff Report — Explorer 3 (Milestone 1)

## 1. Observation
- **Skill Documentation**:
  - `hyperframes-media/SKILL.md`: Audio engine `scripts/audio.mjs` handles TTS (HeyGen -> ElevenLabs -> Kokoro fallback), BGM (HeyGen retrieval -> Lyria/MusicGen fallback), and SFX (HeyGen retrieval -> bundled 21-file fallback). Requires word-level timestamps (`words.json`) for kinetic typography caption synchronization.
  - `hyperframes-cli/SKILL.md`: Standard workflow execution via `npx hyperframes check`, `npx hyperframes preview`, and `npx hyperframes render`.
- **Project Structure**:
  - Repository: `C:\Users\Admin\.gemini\antigravity\scratch\unified-outreach-dashboard`
  - Target video output path: `videos/open-outreach-promo/index.html`
  - Planned deliverable files for M1: `videos/open-outreach-promo/STORYBOARD.md` & `videos/open-outreach-promo/SCRIPT.md`
  - Target MP4 output: `C:\Users\Admin\Downloads\open-outreach-promo.mp4`
- **Product Features Analyzed**:
  1. Email Mail Merge & Dynamic Tag Replacement
  2. Zero-Persistence Ephemeral Security
  3. Direct LinkedIn REST API Integration
  4. 300-Character Note Guard Meter
  5. Pure Web SaaS on GitHub Pages
- **Technical Acronyms & Layman Analogies**:
  1. **SMTP**: Simple Mail Transfer Protocol → *A digital postman delivering your electronic mail reliably.*
  2. **RAM**: Random Access Memory → *Your computer's temporary workspace desk that clears when closed.*
  3. **OAuth 2.0**: Open Authorization → *A secure digital VIP badge that lets you enter without sharing passwords.*
  4. **REST API**: Representational State Transfer API → *A digital waiter taking your order to the server and bringing back answers.*
  5. **SPA**: Single Page Application → *A desktop-like web app that feels smooth without full page reloads.*

---

## 2. Logic Chain
1. **Pacing and Timing Allocation**: A total video length of 60.0 seconds (1,800 frames at 30 FPS) divided into 6 equal 10.0-second scenes (300 frames per scene) allows sufficient time to introduce the product, cover all 5 key features, explain all 5 technical acronyms with analogies, and present a strong call-to-action without overwhelming the viewer.
2. **Word Count & Speech Rate**: A total narration script of 143 words across 60 seconds yields an average speaking rate of ~143 Words Per Minute (WPM). This pacing falls squarely within the optimal 140–150 WPM range for professional explainer videos, ensuring clarity for non-technical viewers.
3. **Audio Tier Fallback & Synchronization**: Using HyperFrames' `scripts/audio.mjs` request schema (`audio_request.json`) guarantees that if HeyGen credentials are available, native word timestamps (`words.json`) will drive kinetic text animations. If running offline, Kokoro-82M (`am_michael`) combined with Whisper transcription ensures deterministic timing without hardcoded dependencies.
4. **Visual & SFX Mapping**: Mapping precise SFX cues (e.g. `vault_lock.mp3` during RAM wiping, `bell_ding_waiter.mp3` during REST API transfer) reinforces the layman analogies visually and audibly, elevating production value.

---

## 3. Caveats
- **Credential Dependency**: Audio generation capability degrades gracefully depending on whether `$HEYGEN_API_KEY` is present. If absent, local Kokoro TTS and local BGM generation/bundled SFX will be utilized.
- **Narration Duration Variance**: Minor variations in TTS audio generation length across different providers (HeyGen vs Kokoro vs ElevenLabs) may adjust speech duration by ±0.5s per scene. GSAP timelines (`window.__timelines`) must reference `data-duration` attributes dynamically.

---

## 4. Conclusion
The comprehensive Audio, Speech, and Timing Plan for OpenOutreach's HyperFrames explainer video has been fully formulated and saved to `audio_timing_plan.md`. The design specifies exact timing (6 scenes x 10s = 60s total), narration scripts, WPM rates, layman analogies for all 5 technical acronyms, feature highlights for all 5 capabilities, BGM mood (0.15 volume), SFX cues (0.35 volume), and the complete file blueprints for `STORYBOARD.md` and `SCRIPT.md`.

---

## 5. Verification Method
- **File Blueprint Inspection**: Inspect `C:\Users\Admin\.gemini\antigravity\scratch\unified-outreach-dashboard\.agents\explorer_m1_3\audio_timing_plan.md` to confirm scene breakdowns, narration text, WPM calculations, and `audio_request.json` schema.
- **Acronym & Feature Coverage Check**:
  - Verify 5 acronyms present: SPA (Scene 1), SMTP (Scene 2), RAM (Scene 3), REST API (Scene 4), OAuth 2.0 (Scene 5).
  - Verify 5 features present: GitHub Pages SaaS (Scene 1 & 6), Mail Merge (Scene 2), Zero-Persistence Security (Scene 3), Direct LinkedIn REST API (Scene 4), 300-Char Note Guard (Scene 5).
- **Duration Verification**: Confirm sum of scene durations equals exactly 60.0s (1,800 frames).
