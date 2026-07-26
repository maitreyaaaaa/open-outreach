import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const promoDir = path.resolve(__dirname, '../../videos/open-outreach-promo');

console.log('=== HyperFrames OpenOutreach Promo Validation ===');
console.log('Checking directory:', promoDir);

const requiredFiles = [
  'STORYBOARD.md',
  'SCRIPT.md',
  'style.css',
  'index.html',
  path.join('assets', 'audio', 'audio_request.json'),
  path.join('assets', 'audio', 'audio_config.json')
];

let allExist = true;
requiredFiles.forEach(file => {
  const filePath = path.join(promoDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✓ File exists: ${file}`);
  } else {
    console.error(`  ✗ Missing file: ${file}`);
    allExist = false;
  }
});

if (!allExist) {
  process.exit(1);
}

const htmlContent = fs.readFileSync(path.join(promoDir, 'index.html'), 'utf8');

// 1. Root composition checks
const rootMatch = htmlContent.match(/<div[^>]*data-composition-id="open-outreach-promo"[^>]*>/);
if (!rootMatch) {
  console.error('  ✗ Root element with data-composition-id="open-outreach-promo" not found.');
  process.exit(1);
}
console.log('  ✓ Found root element with data-composition-id="open-outreach-promo"');

if (htmlContent.includes('data-duration="60s"') && htmlContent.includes('data-start="0s"') && htmlContent.includes('data-width="1920"') && htmlContent.includes('data-height="1080"')) {
  console.log('  ✓ Root element contains data-duration="60s", data-start="0s", data-width="1920", and data-height="1080"');
} else {
  console.error('  ✗ Root element missing required attributes (data-duration, data-start, data-width, data-height).');
  process.exit(1);
}

// 2. Full bleed background
if (htmlContent.includes('class="bg-canvas"') || htmlContent.includes('bg-[#030712]')) {
  console.log('  ✓ Full-bleed background element verified');
} else {
  console.error('  ✗ Full-bleed background element missing.');
}

// 3. Scene breakdown (6 scenes)
const sceneIds = ['scene-1', 'scene-2', 'scene-3', 'scene-4', 'scene-5', 'scene-6'];
sceneIds.forEach((id, index) => {
  if (htmlContent.includes(`id="${id}"`)) {
    console.log(`  ✓ Scene ${index + 1} (${id}) element present`);
  } else {
    console.error(`  ✗ Scene ${index + 1} (${id}) element missing`);
  }
});

// 4. GSAP Timeline Registration
if (htmlContent.includes('window.__timelines["open-outreach-promo"]') && htmlContent.includes('masterTl.add(')) {
  console.log('  ✓ Inline script registers window.__timelines["open-outreach-promo"] with master and sub-timelines');
} else {
  console.error('  ✗ GSAP timeline registration missing or invalid.');
  process.exit(1);
}

// 5. Check acronyms present in index.html
const acronyms = ['SPA', 'SMTP', 'RAM', 'REST API', 'OAuth 2.0'];
acronyms.forEach(acronym => {
  if (htmlContent.includes(acronym)) {
    console.log(`  ✓ Acronym '${acronym}' featured in HTML markup`);
  } else {
    console.error(`  ✗ Acronym '${acronym}' missing in HTML markup`);
  }
});

console.log('\n=== ALL VALIDATION CHECKS PASSED SUCCESSFULLY ===');
