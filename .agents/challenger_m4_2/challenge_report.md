# CHALLENGE REPORT — Milestone 4 (Challenger 2)

**Project Target**: `videos/open-outreach-promo`  
**Composition ID**: `open-outreach-promo`  
**Evaluator**: Challenger 2 (Empirical Challenger)  
**Date**: 2026-07-26  

---

## Challenge Summary

**Overall risk assessment**: **MEDIUM**

While `npx hyperframes check videos/open-outreach-promo` passed runtime, layout, motion, and contrast validation with **0 errors**, the CLI reported **2 warnings and 1 info message**. Furthermore, empirical frame-by-frame scrubbing across 1,800 frames (0–60s @ 30fps) revealed two key timeline defects:
1. **GSAP Master Timeline Duration Mismatch**: The master timeline duration is **56.8 seconds**, which is **3.2 seconds short** of the declared `data-duration="60s"`.
2. **Premature Scene Fade-Outs & Inter-Scene Blank Gaps**: Scenes 1, 4, and 5 fade out completely before their allotted 10-second scene container slots end, leaving a combined **7.2 seconds of dead black screen** across the video composition.
3. **CLI Lint Warnings**: 2 structural lint warnings (`composition_file_too_large` and `timeline_track_too_dense`) and 1 font alias info (`system_font_will_alias`).

---

## Challenges

### [Medium] Challenge 1: GSAP Master Timeline Duration Mismatch (56.8s vs 60.0s)

- **Assumption challenged**: The master GSAP timeline duration (`window.__timelines["open-outreach-promo"].duration()`) spans the full 60.0s declared in `data-duration="60s"`.
- **Attack scenario / Empirical Observation**:
  - The composition root declares `data-duration="60s"`.
  - Scene 6 (`#scene-6`) is placed at `data-start="50s"` with `data-duration="10s"`.
  - In `index.html`, Scene 6's sub-timeline `s6` is added at offset `50.0s` in `masterTl`.
  - Summing the duration of all tweens in `s6`:
    - `s6.to("#s6-master-card", { duration: 1.5 })` -> 0.0s to 1.5s
    - `s6.to("#s6-orbit-badges", { duration: 1.0 }, "-=0.5")` -> 1.0s to 2.0s
    - `s6.to("#s6-cta", { duration: 1.5 }, "-=0.2")` -> 1.8s to 3.3s
    - `s6.to("#s6-master-card", { duration: 3.5 })` -> 3.3s to 6.8s
  - Total duration of `s6` is **6.8 seconds**.
  - `masterTl.duration()` equals `50.0 + 6.8 = 56.8 seconds`.
  - Seeking to frame 1704 through frame 1800 (56.8s to 60.0s) leaves the timeline in a completed static state for 3.2 seconds.
- **Blast radius**: When rendered or previewed, the video halts animation early at 56.8s while the player wait loop continues until 60.0s, creating an unintended static freeze frame at the end.
- **Mitigation**: Extend `s6` sub-timeline tweens or add a dummy hold tween (`s6.to({}, { duration: 6.7 }, "+=0")`) so `s6` reaches exactly 10.0 seconds (making `masterTl.duration()` = 60.0s).

---

### [Medium] Challenge 2: Premature Element Fade-Outs Creating 7.2s Total Black Screen Gaps

- **Assumption challenged**: Each scene smoothly occupies its full 10-second window (Scene 1: 0-10s, Scene 2: 10-20s, Scene 3: 20-30s, Scene 4: 30-40s, Scene 5: 40-50s, Scene 6: 50-60s) with seamless visual transitions.
- **Attack scenario / Empirical Observation**:
  - Empirical frame-by-frame scrubbing using Playwright identified 3 scenes where elements fade out to `opacity: 0` several seconds before the scene clip boundary:
    1. **Scene 1 (Hero & SPA)**:
       - `s1.to("#s1-card-shell", { opacity: 0, scale: 1.06, duration: 1.0 })` completes at **8.0s** (frame 240).
       - **Dead Gap**: 8.0s to 10.0s (2.0s / 60 frames of blank dark screen).
    2. **Scene 4 (Direct REST API & OAuth 2.0)**:
       - `s4.to("#s4-card-left", { opacity: 0, duration: 1.0 }, "+=5.5")` completes at **37.9s** (frame 1137).
       - **Dead Gap**: 37.9s to 40.0s (2.1s / 63 frames of blank dark screen).
    3. **Scene 5 (300-Char Note Guard & GitHub Pages)**:
       - `s5.to("#s5-card-left", { opacity: 0, duration: 1.0 }, "+=2.0")` completes at **46.9s** (frame 1407).
       - **Dead Gap**: 46.9s to 50.0s (3.1s / 93 frames of blank dark screen).
- **Blast radius**: The viewer experiences 7.2 seconds of complete black/empty screen across 3 separate transitions during a 60-second video, interrupting visual engagement and pacing.
- **Mitigation**: Retime the fade-out tweens in `s1`, `s4`, and `s5` to start near the end of their respective 10-second windows (e.g. at 9.0s, 39.0s, and 49.0s).

---

### [Low] Challenge 3: HyperFrames CLI Lint Warnings & System Font Aliasing

- **Assumption challenged**: Composition file structure adheres fully to HyperFrames modular composition guidelines without CLI warnings.
- **Attack scenario / Empirical Observation**:
  - `npx hyperframes check` reported 2 warnings and 1 info message:
    1. `⚠ composition_file_too_large`: `index.html` has 415 lines (exceeds recommended single-file size).
    2. `⚠ timeline_track_too_dense`: Track 0 contains 6 timed elements in a single file.
    3. `ℹ system_font_will_alias`: CSS font family `'segoe ui'` will be substituted at render time to `Roboto`.
- **Blast radius**: Low impact on render output, but increases file maintainability complexity and risks minor font rendering variance between local preview and render engine.
- **Mitigation**: Replace `'segoe ui'` with explicit `Roboto` font declaration, and optionally split scene blocks into `compositions/` sub-files if required by code architecture guidelines.

---

## Stress Test Results

| Test Scenario | Expected Behavior | Actual Empirical Result | Pass/Fail |
|---|---|---|---|
| `npx hyperframes check videos/open-outreach-promo` | 0 errors | 0 errors, 2 warnings, 1 info | **PASS with Warnings** |
| Root DOM Metadata Check | `data-duration="60s"`, 1920x1080, `open-outreach-promo` | Matched declared attributes exactly. | **PASS** |
| Scene Clips Count & Alignment | 6 contiguous clips of 10s duration (0-60s) | 6 clips found with correct `data-start` and `data-duration`. | **PASS** |
| GSAP Global Timeline Registration | Registered at `window.__timelines["open-outreach-promo"]` | Timeline exists, paused, 43 child tweens. | **PASS** |
| GSAP Timeline Duration | Duration equals 60.0 seconds | `window.__timelines["open-outreach-promo"].duration()` = **56.8s** | **FAIL** |
| Frame Scrubbing 0–1800 (30fps) | Continuous element visibility during scene windows | 5 frame sampling failures due to premature fade-out gaps | **FAIL** |
| Bidirectional Scrubbing Idempotency | Seeking to target time `T` lands on `T` without drift | Deterministic time resolution for all jump sequences. | **PASS** |
| Contrast & Layout Audits | WCAG AA compliance | 55/55 text checks pass WCAG AA; 0 layout issues. | **PASS** |

---

## Unchallenged Areas

- **Audio Track Synchronization**: Out of scope for this check (no audio track declared in `index.html` DOM).
- **External Image / Video Assets**: Out of scope (composition uses 100% pure CSS/SVG/HTML vector rendering with zero external media files).
