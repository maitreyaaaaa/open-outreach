const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'empirical_results.json'), 'utf8'));
console.log("=== CONTRAST RATIOS ===");
console.log(data.contrastAnalysis);
