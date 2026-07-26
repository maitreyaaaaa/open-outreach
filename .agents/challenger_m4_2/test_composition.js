import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runEmpiricalTest() {
  console.log("=== EMPIRICAL ADVERSARIAL TEST FOR HYPERFRAMES COMPOSITION ===");
  
  const htmlPath = path.resolve(__dirname, '../../videos/open-outreach-promo/index.html');
  const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;
  console.log(`Loading composition from: ${fileUrl}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.error(`[Browser Console Error]: ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    pageErrors.push(err.message);
    console.error(`[Browser Page Error]: ${err.message}`);
  });

  await page.goto(fileUrl, { waitUntil: 'load' });

  // 1. Verify DOM Attributes & Root Composition
  const rootComp = await page.$('.composition-root');
  if (!rootComp) {
    throw new Error("FAIL: .composition-root element not found!");
  }

  const compAttrs = await page.evaluate(() => {
    const root = document.querySelector('.composition-root');
    return {
      id: root.getAttribute('data-composition-id'),
      duration: root.getAttribute('data-duration'),
      start: root.getAttribute('data-start'),
      width: root.getAttribute('data-width'),
      height: root.getAttribute('data-height')
    };
  });

  console.log("Composition Attributes:", JSON.stringify(compAttrs, null, 2));

  let testPassed = true;
  const auditLog = [];

  if (compAttrs.id !== 'open-outreach-promo') {
    auditLog.push(`FAIL: data-composition-id expected 'open-outreach-promo', got '${compAttrs.id}'`);
    testPassed = false;
  }
  if (compAttrs.duration !== '60s') {
    auditLog.push(`FAIL: data-duration expected '60s', got '${compAttrs.duration}'`);
    testPassed = false;
  }

  // 2. Verify all 6 Scene Clips exist and have accurate data-attributes
  const scenes = await page.evaluate(() => {
    const sceneElements = document.querySelectorAll('.clip');
    return Array.from(sceneElements).map(el => ({
      id: el.id,
      start: el.getAttribute('data-start'),
      duration: el.getAttribute('data-duration'),
      trackIndex: el.getAttribute('data-track-index')
    }));
  });

  console.log(`Found ${scenes.length} scene clips:`, JSON.stringify(scenes, null, 2));

  if (scenes.length !== 6) {
    auditLog.push(`FAIL: Expected 6 scene clips, found ${scenes.length}`);
    testPassed = false;
  }

  const expectedScenes = [
    { id: 'scene-1', start: '0s', duration: '10s' },
    { id: 'scene-2', start: '10s', duration: '10s' },
    { id: 'scene-3', start: '20s', duration: '10s' },
    { id: 'scene-4', start: '30s', duration: '10s' },
    { id: 'scene-5', start: '40s', duration: '10s' },
    { id: 'scene-6', start: '50s', duration: '10s' },
  ];

  expectedScenes.forEach((exp, idx) => {
    const actual = scenes[idx];
    if (!actual) {
      auditLog.push(`FAIL: Scene ${idx + 1} (${exp.id}) missing`);
      testPassed = false;
    } else {
      if (actual.id !== exp.id || actual.start !== exp.start || actual.duration !== exp.duration) {
        auditLog.push(`FAIL: Scene ${exp.id} mismatch: expected start ${exp.start}, duration ${exp.duration}; got start ${actual.start}, duration ${actual.duration}`);
        testPassed = false;
      }
    }
  });

  // 3. Check GSAP Master Timeline in window.__timelines
  const timelineInfo = await page.evaluate(() => {
    if (!window.__timelines || !window.__timelines['open-outreach-promo']) {
      return { exists: false };
    }
    const tl = window.__timelines['open-outreach-promo'];
    return {
      exists: true,
      duration: tl.duration(),
      paused: tl.paused(),
      progress: tl.progress(),
      childrenCount: tl.getChildren().length
    };
  });

  console.log("Global Timeline Check:", JSON.stringify(timelineInfo, null, 2));

  if (!timelineInfo.exists) {
    auditLog.push("FAIL: window.__timelines['open-outreach-promo'] is not registered!");
    testPassed = false;
  } else {
    if (Math.abs(timelineInfo.duration - 60) > 0.01) {
      auditLog.push(`FAIL: Master timeline duration is ${timelineInfo.duration}s, expected 60.0s`);
      testPassed = false;
    }
    if (timelineInfo.childrenCount !== 6) {
      auditLog.push(`FAIL: Expected 6 sub-timelines in master timeline, found ${timelineInfo.childrenCount}`);
      testPassed = false;
    }
  }

  // 4. Detailed Frame-by-Frame Timeline Scrubbing Test (0s to 60s @ 30fps = 1800 frames)
  console.log("\n--- SCRUBBING TIMELINE 0..1800 FRAMES (30 FPS) ---");

  const totalFrames = 1800; // 60s * 30fps
  const fps = 30;

  // We sample key frames across each scene, boundaries, and scrubbing directions
  const sampleFrames = [];
  // Sample every 30 frames (1s interval)
  for (let f = 0; f <= totalFrames; f += 30) {
    sampleFrames.push(f);
  }
  // Add exact transition boundary frames
  const boundaryFrames = [0, 299, 300, 599, 600, 899, 900, 1199, 1200, 1499, 1500, 1800];
  boundaryFrames.forEach(f => {
    if (!sampleFrames.includes(f)) sampleFrames.push(f);
  });
  sampleFrames.sort((a, b) => a - b);

  let frameErrors = 0;

  for (const frame of sampleFrames) {
    const timeInSeconds = frame / fps;

    const frameState = await page.evaluate((t) => {
      const tl = window.__timelines['open-outreach-promo'];
      tl.seek(t);

      // Inspect elements across scenes
      const getOpacity = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        return parseFloat(window.getComputedStyle(el).opacity);
      };

      const getWidth = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        return el.style.width || window.getComputedStyle(el).width;
      };

      return {
        time: t,
        s1CardOpacity: getOpacity('#s1-card-shell'),
        s2LeftOpacity: getOpacity('#s2-card-left'),
        s2RightOpacity: getOpacity('#s2-card-right'),
        s2ProgressWidth: getWidth('#s2-progress-fill'),
        s3VaultOpacity: getOpacity('#s3-vault-card'),
        s3MemoryBoxOpacity: getOpacity('#s3-memory-box'),
        s4LeftOpacity: getOpacity('#s4-card-left'),
        s4RightOpacity: getOpacity('#s4-card-right'),
        s5LeftOpacity: getOpacity('#s5-card-left'),
        s5RightOpacity: getOpacity('#s5-card-right'),
        s5ProgressWidth: getWidth('#s5-progress-fill'),
        s6MasterOpacity: getOpacity('#s6-master-card'),
      };
    }, timeInSeconds);

    // Verify Scene specific expectations
    // Scene 1: 0s-10s (Frame 0-300)
    if (timeInSeconds >= 1.5 && timeInSeconds <= 8.5) {
      if (frameState.s1CardOpacity < 0.9) {
        auditLog.push(`FAIL @ frame ${frame} (${timeInSeconds}s): Scene 1 card opacity is ${frameState.s1CardOpacity}, expected >= 0.9`);
        frameErrors++;
      }
    }

    // Scene 2: 10s-20s (Frame 300-600)
    if (timeInSeconds >= 11.5 && timeInSeconds <= 17.5) {
      if (frameState.s2LeftOpacity < 0.9 || frameState.s2RightOpacity < 0.9) {
        auditLog.push(`FAIL @ frame ${frame} (${timeInSeconds}s): Scene 2 cards opacity (L:${frameState.s2LeftOpacity}, R:${frameState.s2RightOpacity}), expected >= 0.9`);
        frameErrors++;
      }
    }

    // Scene 3: 20s-30s (Frame 600-900)
    if (timeInSeconds >= 21.5 && timeInSeconds <= 27.5) {
      if (frameState.s3VaultOpacity < 0.9) {
        auditLog.push(`FAIL @ frame ${frame} (${timeInSeconds}s): Scene 3 vault card opacity is ${frameState.s3VaultOpacity}, expected >= 0.9`);
        frameErrors++;
      }
    }

    // Scene 4: 30s-40s (Frame 900-1200)
    if (timeInSeconds >= 31.5 && timeInSeconds <= 38.0) {
      if (frameState.s4LeftOpacity < 0.9 || frameState.s4RightOpacity < 0.9) {
        auditLog.push(`FAIL @ frame ${frame} (${timeInSeconds}s): Scene 4 cards opacity (L:${frameState.s4LeftOpacity}, R:${frameState.s4RightOpacity}), expected >= 0.9`);
        frameErrors++;
      }
    }

    // Scene 5: 40s-50s (Frame 1200-1500)
    if (timeInSeconds >= 41.5 && timeInSeconds <= 47.0) {
      if (frameState.s5LeftOpacity < 0.9 || frameState.s5RightOpacity < 0.9) {
        auditLog.push(`FAIL @ frame ${frame} (${timeInSeconds}s): Scene 5 cards opacity (L:${frameState.s5LeftOpacity}, R:${frameState.s5RightOpacity}), expected >= 0.9`);
        frameErrors++;
      }
    }

    // Scene 6: 50s-60s (Frame 1500-1800)
    if (timeInSeconds >= 51.5 && timeInSeconds <= 60.0) {
      if (frameState.s6MasterOpacity < 0.9) {
        auditLog.push(`FAIL @ frame ${frame} (${timeInSeconds}s): Scene 6 master card opacity is ${frameState.s6MasterOpacity}, expected >= 0.9`);
        frameErrors++;
      }
    }
  }

  console.log(`Frame scrubbing complete. Frame errors detected: ${frameErrors}`);

  // 5. Stress Test: Rapid Backward/Forward Scrubbing (Idempotency Test)
  console.log("\n--- STRESS TEST: BIDIRECTIONAL SCRUBBING & IDEMPOTENCY ---");
  const jumps = [55, 5, 45, 15, 35, 25, 50, 0, 60, 28, 12, 42, 58];
  for (const t of jumps) {
    const res = await page.evaluate((targetTime) => {
      const tl = window.__timelines['open-outreach-promo'];
      tl.seek(targetTime);
      return tl.time();
    }, t);

    if (Math.abs(res - t) > 0.001) {
      auditLog.push(`FAIL: Seek to ${t}s resulted in timeline time ${res}s`);
      testPassed = false;
    }
  }

  // 6. Console / Page Errors Audit
  if (consoleErrors.length > 0) {
    auditLog.push(`FAIL: ${consoleErrors.length} browser console errors detected: ${consoleErrors.join('; ')}`);
    testPassed = false;
  }
  if (pageErrors.length > 0) {
    auditLog.push(`FAIL: ${pageErrors.length} browser page errors detected: ${pageErrors.join('; ')}`);
    testPassed = false;
  }

  await browser.close();

  console.log("\n==================================================");
  console.log("EMPIRICAL ADVERSARIAL TEST RESULTS:");
  console.log(`Overall Pass Status: ${testPassed && auditLog.length === 0 ? "PASSED" : "FAILED"}`);
  if (auditLog.length > 0) {
    console.log("Audit Log Failures:");
    auditLog.forEach(log => console.error(`  - ${log}`));
  } else {
    console.log("All timeline checks, keyframe triggers, scrubbing tests, and DOM metadata tests passed cleanly!");
  }
  console.log("==================================================\n");

  return { testPassed: testPassed && auditLog.length === 0, auditLog, compAttrs, scenes, timelineInfo };
}

runEmpiricalTest().catch(err => {
  console.error("FATAL TEST ERROR:", err);
  process.exit(1);
});
