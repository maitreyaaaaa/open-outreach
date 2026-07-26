const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'empirical_results.json'), 'utf8'));

console.log("=== TIMELINE REGISTRATION ===");
console.log(data.timelineCheck);

console.log("\n=== CONSOLE LOGS & ERRORS ===");
console.log("Logs:", data.consoleLogs);
console.log("Console Errors:", data.consoleErrors);
console.log("Page Errors:", data.pageErrors);
console.log("Failed Requests:", data.failedRequests);

console.log("\n=== CONTRAST ANALYSIS ===");
console.log(data.contrastAnalysis);

console.log("\n=== NON-LINEAR RESEEK MATCH ===");
console.log(data.linearReseekMatch5s);

console.log("\n=== BOUNDARY / EXTREMA CHECKS ===");
console.log(data.boundaryCheck);

console.log("\n=== OVERFLOW CHECK ===");
console.log(data.overflowCheck);

console.log("\n=== SCENE VISIBILITY TIMELINE SUMMARY ===");
const timelineSummary = data.scrubResults.map(r => {
  const visibleScenes = [];
  Object.keys(r.scenes).forEach(sceneId => {
    const sc = r.scenes[sceneId];
    // Check if any child in scene has opacity > 0.05
    const visibleChildren = sc.children ? sc.children.filter(c => c.opacity > 0.05) : [];
    if (visibleChildren.length > 0) {
      visibleScenes.push(`${sceneId} (${visibleChildren.map(c => `${c.id}:${c.opacity}`).join(', ')})`);
    }
  });

  return {
    time: `${r.time}s`,
    visibleScenes,
    extraMetrics: r.extraMetrics
  };
});

console.log(JSON.stringify(timelineSummary, null, 2));
