# HyperFrames CLI Skill Reference

Run commands as `npx hyperframes ...` unless project instructions provide a wrapper. The CLI requires Node.js 22 or newer and FFmpeg.

## Core Render Commands

```bash
npx hyperframes render videos/open-outreach-promo --output C:\Users\Admin\Downloads\open-outreach-promo.mp4
```

Alternatively, if local browser frame capture via Puppeteer + FFmpeg is needed, write and execute a Node.js / Puppeteer script to render all 1800 frames of index.html at 1920x1080 @ 30fps.
