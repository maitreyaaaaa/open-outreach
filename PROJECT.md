# Project: OpenOutreach HyperFrames Explainer Video

## Architecture & Overview
Creating an enterprise-grade, non-technical animated product explainer video for OpenOutreach.
Target HTML composition: `videos/open-outreach-promo/index.html`
Target Rendered MP4: `C:\Users\Admin\Downloads\open-outreach-promo.mp4`

## Code Layout
```
unified-outreach-dashboard/
├── videos/
│   └── open-outreach-promo/
│       ├── index.html           # Main HyperFrames composition HTML with GSAP & Glassmorphism
│       ├── STORYBOARD.md        # Scene-by-scene script & non-technical explanations
│       ├── style.css            # Glassmorphism visual tokens & responsive typography
│       └── assets/
│           ├── audio/           # Narration voiceover & background music
│           └── images/          # Graphic assets, icons, badges
```

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Storyboard & Script Blueprint | Research codebase & author non-technical script explaining 5 features & 5 acronyms | None | DONE |
| 2 | Audio & Media Generation | Generate TTS voiceover & background music assets | M1 | DONE |
| 3 | HyperFrames Composition Build | Construct index.html, CSS tokens, GSAP timelines (window.__timelines) | M1, M2 | DONE |
| 4 | Quality Review & Audit | Run hyperframes lint/check, visual review & forensic integrity audit | M3 | DONE |
| 5 | Video Render & Delivery | Render MP4 to C:\Users\Admin\Downloads\open-outreach-promo.mp4 and verify output | M4 | DONE |

## Interface Contracts
- **GSAP Timelines**: Must register scene timelines under `window.__timelines` object for HyperFrames deterministic rendering.
- **Timing Attributes**: All root clips and scene wrappers must specify explicit `data-duration` attributes.
- **Render Output**: Final MP4 output path must be `C:\Users\Admin\Downloads\open-outreach-promo.mp4`.
