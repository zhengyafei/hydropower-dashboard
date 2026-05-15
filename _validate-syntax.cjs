const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('d:/code/hydropower-web/cui_test/hydropower-dashboard.html', 'utf8');

// Extract all script blocks (excluding external scripts)
const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let allScripts = '';
let blockNum = 0;

while ((match = scriptRegex.exec(html)) !== null) {
  const content = match[1].trim();
  if (content && !content.startsWith('src=')) {
    blockNum++;
    allScripts += '\n// --- block ' + blockNum + ' ---\n' + content;
  }
}

try {
  new vm.Script(allScripts);
  console.log('Syntax OK — no errors in any script block (' + blockNum + ' blocks, ' + allScripts.length + ' chars)');
} catch (e) {
  console.error('SYNTAX ERROR: ' + e.message);
  // Show context around the error
  if (e.line) {
    const lines = allScripts.split('\n');
    const start = Math.max(0, e.line - 5);
    const end = Math.min(lines.length, e.line + 3);
    for (let i = start; i < end; i++) {
      console.log((i === e.line ? '>>> ' : '    ') + (i+1) + ': ' + lines[i]);
    }
  }
}
