const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runVerification() {
  console.log("Starting Empirical Verification of OpenOutreach HyperFrames Promo...");

  const htmlPath = path.resolve(__dirname, '../../videos/open-outreach-promo/index.html');
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
  console.log(`Target URL: ${fileUrl}`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  const consoleLogs = [];
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];

  page.on('console', msg => {
    const logStr = `[${msg.type()}] ${msg.text()}`;
    consoleLogs.push(logStr);
    if (msg.type() === 'error') {
      consoleErrors.push(logStr);
    }
  });

  page.on('pageerror', err => {
    console.log("Page error caught:", err.message);
    pageErrors.push(err.message);
  });

  page.on('requestfailed', req => {
    failedRequests.push({
      url: req.url(),
      failure: req.failure() ? req.failure().errorText : 'Unknown request failure'
    });
  });

  console.log("Navigating to composition page...");
  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  // 1. Check window.__timelines registration
  const timelineCheck = await page.evaluate(() => {
    const timelines = window.__timelines;
    if (!timelines) return { exists: false, error: 'window.__timelines is undefined' };
    const promoTl = timelines['open-outreach-promo'];
    if (!promoTl) return { exists: false, error: 'window.__timelines["open-outreach-promo"] is undefined' };

    return {
      exists: true,
      duration: promoTl.duration(),
      paused: promoTl.paused(),
      progress: promoTl.progress(),
      isActive: promoTl.isActive(),
      totalChildren: promoTl.getChildren().length
    };
  });

  console.log("Timeline check result:", JSON.stringify(timelineCheck, null, 2));

  // 2. Linear Scrubbing Test (0s to 60s at 1s intervals)
  const scrubResults = [];
  for (let t = 0; t <= 60; t += 1) {
    const frameState = await page.evaluate((seekTime) => {
      const tl = window.__timelines['open-outreach-promo'];
      tl.seek(seekTime);

      const sceneIds = ['scene-1', 'scene-2', 'scene-3', 'scene-4', 'scene-5', 'scene-6'];
      const sceneStates = {};

      sceneIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) {
          sceneStates[id] = { exists: false };
          return;
        }

        const rect = el.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(el);

        // Check key animated children inside this scene
        const children = Array.from(el.querySelectorAll('[id]')).map(child => {
          const childStyle = window.getComputedStyle(child);
          const childRect = child.getBoundingClientRect();
          return {
            id: child.id,
            opacity: parseFloat(childStyle.opacity),
            transform: childStyle.transform,
            display: childStyle.display,
            visibility: childStyle.visibility,
            color: childStyle.color,
            backgroundColor: childStyle.backgroundColor,
            rect: {
              left: Math.round(childRect.left),
              top: Math.round(childRect.top),
              width: Math.round(childRect.width),
              height: Math.round(childRect.height)
            }
          };
        });

        sceneStates[id] = {
          exists: true,
          display: computedStyle.display,
          opacity: parseFloat(computedStyle.opacity),
          visibility: computedStyle.visibility,
          rect: {
            left: Math.round(rect.left),
            top: Math.round(rect.top),
            width: Math.round(rect.width),
            height: Math.round(rect.height)
          },
          childrenCount: children.length,
          children: children
        };
      });

      // Special inspect elements for specific scenes
      const extraMetrics = {};

      // Scene 2 progress bar fill width & tag colors
      const s2Fill = document.getElementById('s2-progress-fill');
      if (s2Fill) {
        extraMetrics.s2ProgressWidth = s2Fill.style.width || window.getComputedStyle(s2Fill).width;
      }
      const s2TagName = document.getElementById('s2-tag-name');
      if (s2TagName) {
        extraMetrics.s2TagNameColor = window.getComputedStyle(s2TagName).color;
      }

      // Scene 3 memory box blur/opacity & wipe badge
      const s3MemBox = document.getElementById('s3-memory-box');
      if (s3MemBox) {
        const cs = window.getComputedStyle(s3MemBox);
        extraMetrics.s3MemoryBoxOpacity = cs.opacity;
        extraMetrics.s3MemoryBoxFilter = cs.filter;
      }
      const s3WipeBadge = document.getElementById('s3-wipe-badge');
      if (s3WipeBadge) {
        const cs = window.getComputedStyle(s3WipeBadge);
        extraMetrics.s3WipeBadgeBg = cs.backgroundColor;
        extraMetrics.s3WipeBadgeColor = cs.color;
      }

      // Scene 5 char count & progress fill class
      const s5Fill = document.getElementById('s5-progress-fill');
      if (s5Fill) {
        extraMetrics.s5ProgressClasses = s5Fill.className;
        extraMetrics.s5ProgressWidth = s5Fill.style.width || window.getComputedStyle(s5Fill).width;
      }
      const s5CharCount = document.getElementById('s5-char-count');
      if (s5CharCount) {
        extraMetrics.s5CharCountColor = window.getComputedStyle(s5CharCount).color;
      }

      return {
        time: seekTime,
        scenes: sceneStates,
        extraMetrics
      };
    }, t);

    scrubResults.push(frameState);
  }

  // 3. Non-Linear / Random Seek Determinism Test
  const seekOrder = [55, 5, 45, 15, 0, 60, 25, 35, 5];
  const seekOrderResults = [];

  for (const timePoint of seekOrder) {
    const res = await page.evaluate((t) => {
      const tl = window.__timelines['open-outreach-promo'];
      tl.seek(t);

      // Snapshot Scene 1 pill 1 opacity and transform
      const pill1 = document.getElementById('s1-pill-1');
      const pill1Style = pill1 ? window.getComputedStyle(pill1) : null;

      // Snapshot Scene 3 vault card transform
      const s3Vault = document.getElementById('s3-vault-card');
      const s3VaultStyle = s3Vault ? window.getComputedStyle(s3Vault) : null;

      // Snapshot Scene 5 fill class
      const s5Fill = document.getElementById('s5-progress-fill');

      return {
        soughtTime: t,
        s1Pill1Opacity: pill1Style ? pill1Style.opacity : null,
        s1Pill1Transform: pill1Style ? pill1Style.transform : null,
        s3VaultOpacity: s3VaultStyle ? s3VaultStyle.opacity : null,
        s3VaultTransform: s3VaultStyle ? s3VaultStyle.transform : null,
        s5FillClassName: s5Fill ? s5Fill.className : null
      };
    }, timePoint);

    seekOrderResults.push(res);
  }

  // Compare 1st seek to 5s vs 2nd seek to 5s after non-linear jumps
  const linear5s = scrubResults.find(r => r.time === 5);
  const reseek5s = seekOrderResults[seekOrderResults.length - 1];

  // 4. Extrema Boundary Seek Checks
  const boundaryCheck = await page.evaluate(() => {
    const tl = window.__timelines['open-outreach-promo'];
    const results = {};

    try {
      tl.seek(-5);
      results.minus5s = { time: tl.time(), progress: tl.progress() };
    } catch(e) { results.minus5sError = e.message; }

    try {
      tl.seek(0);
      results.zeroS = { time: tl.time(), progress: tl.progress() };
    } catch(e) { results.zeroSError = e.message; }

    try {
      tl.seek(60);
      results.sixtyS = { time: tl.time(), progress: tl.progress() };
    } catch(e) { results.sixtySError = e.message; }

    try {
      tl.seek(70);
      results.seventyS = { time: tl.time(), progress: tl.progress() };
    } catch(e) { results.seventySError = e.message; }

    return results;
  });

  // 5. Layout Boundary & Overflow Analysis
  const overflowCheck = await page.evaluate(() => {
    const root = document.querySelector('.composition-root');
    const rootRect = root.getBoundingClientRect();

    const allElements = Array.from(root.querySelectorAll('*'));
    const overflowingElements = [];

    allElements.forEach(el => {
      if (el.children.length > 0 && !el.id) return; // focus on leaf or named elements
      const rect = el.getBoundingClientRect();
      // Check if element extends significantly outside 1920x1080 when visible
      const opacity = parseFloat(window.getComputedStyle(el).opacity);
      if (opacity > 0.1) {
        if (rect.right > rootRect.right + 50 || rect.left < rootRect.left - 50 ||
            rect.bottom > rootRect.bottom + 50 || rect.top < rootRect.top - 50) {
          overflowingElements.push({
            tag: el.tagName,
            id: el.id || el.className,
            opacity: opacity,
            rect: { left: Math.round(rect.left), top: Math.round(rect.top), right: Math.round(rect.right), bottom: Math.round(rect.bottom) }
          });
        }
      }
    });

    return overflowingElements;
  });

  // 6. Contrast Analysis Helper
  const contrastAnalysis = await page.evaluate(() => {
    // Helper to calculate luminance from rgb
    function getLuminance(r, g, b) {
      const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    function parseRgb(colorStr) {
      const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!match) return null;
      return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }

    function getContrast(rgb1, rgb2) {
      const l1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
      const l2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    }

    // Sample key text elements across scenes
    const samples = [
      { scene: 1, textId: 's1-title', seekTime: 3 },
      { scene: 1, textId: 's1-subtitle', seekTime: 3 },
      { scene: 2, textId: 's2-template-box', seekTime: 14 },
      { scene: 3, textId: 's3-title', seekTime: 23 },
      { scene: 4, textId: 's4-card-left', seekTime: 34 },
      { scene: 5, textId: 's5-char-count', seekTime: 44 },
      { scene: 6, textId: 's6-title', seekTime: 54 }
    ];

    const tl = window.__timelines['open-outreach-promo'];
    const results = [];

    const bgRgb = [3, 7, 18]; // #030712

    samples.forEach(s => {
      tl.seek(s.seekTime);
      const el = document.getElementById(s.textId);
      if (!el) return;

      const style = window.getComputedStyle(el);
      const textColorStr = style.color;
      const textRgb = parseRgb(textColorStr);

      let ratio = null;
      if (textRgb) {
        ratio = getContrast(textRgb, bgRgb);
      }

      results.push({
        scene: s.scene,
        textId: s.textId,
        seekTime: s.seekTime,
        textColor: textColorStr,
        contrastRatio: ratio ? ratio.toFixed(2) : 'N/A'
      });
    });

    return results;
  });

  const fullReport = {
    timelineCheck,
    consoleLogs,
    consoleErrors,
    pageErrors,
    failedRequests,
    boundaryCheck,
    overflowCheck,
    contrastAnalysis,
    seekOrderResults,
    linearReseekMatch5s: JSON.stringify(linearReseekMatch(scrubResults, seekOrderResults)),
    scrubResults
  };

  function linearReseekMatch(scrub, seekOrderRes) {
    const s5Linear = scrub.find(r => r.time === 5);
    const s5Reseek = seekOrderRes[seekOrderRes.length - 1];

    const s1CardLinear = s5Linear.scenes['scene-1'].children.find(c => c.id === 's1-card-shell');
    return {
      linearOpacity: s1CardLinear ? s1CardLinear.opacity : null,
      linearPill1Opacity: s5Linear.scenes['scene-1'].children.find(c => c.id === 's1-pill-1')?.opacity,
      reseekPill1Opacity: s5Reseek.s1Pill1Opacity,
      matched: s5Linear.scenes['scene-1'].children.find(c => c.id === 's1-pill-1')?.opacity === s5Reseek.s1Pill1Opacity
    };
  }

  const reportJsonPath = path.resolve(__dirname, 'empirical_results.json');
  fs.writeFileSync(reportJsonPath, JSON.stringify(fullReport, null, 2), 'utf8');
  console.log(`Verification complete. Results saved to ${reportJsonPath}`);

  await browser.close();
}

runVerification().catch(err => {
  console.error("Verification script failed:", err);
  process.exit(1);
});
