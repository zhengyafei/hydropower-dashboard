// Add explicit height to ECharts container divs
const fs = require('fs');
const genPath = 'd:/code/hydropower-web/cui_test/generate-html-v3.cjs';
let src = fs.readFileSync(genPath, 'utf8');

// Replace chart containers to add height
const replacements = [
  {
    old: '<div id="chartHBar" style="width:100%">',
    new: '<div id="chartHBar" style="width:100%;min-height:280px">'
  },
  {
    old: '<div id="chartLine" style="width:100%">',
    new: '<div id="chartLine" style="width:100%;min-height:260px">'
  },
  {
    old: '<div id="chartStacked" style="width:100%">',
    new: '<div id="chartStacked" style="width:100%;min-height:280px">'
  },
  {
    old: '<div id="chartDual" style="width:100%">',
    new: '<div id="chartDual" style="width:100%;min-height:260px">'
  },
];

let count = 0;
replacements.forEach(r => {
  while (src.includes(r.old)) {
    src = src.replace(r.old, r.new);
    count++;
  }
});

console.log(`Replaced ${count} chart container(s) with height`);

// Also fix the L1 chart initialization in drawMonitorChartsL1 - it disposes _ecHBar from L0
// but the stacked chart (#chartStacked) is hidden at L1 level, not disposed.
// Actually let me also check: does drawMonitorChartsL0 dispose old instances?
// Let me add disposal at the start of drawMonitorChartsL0 to prevent duplicate instances

const l0start = 'function drawMonitorChartsL0() {\n  var d = window._MONITOR_DATA || {};';
if (src.includes(l0start)) {
  const l0startNew = `function drawMonitorChartsL0() {
  // Dispose old ECharts instances before re-initializing
  ['_ecHBar','_ecLine','_ecStacked','_ecDual'].forEach(function(k){ if(window[k]){ window[k].dispose(); window[k]=null; } });
  var d = window._MONITOR_DATA || {};`;
  src = src.replace(l0start, l0startNew);
  console.log('Added disposal to drawMonitorChartsL0');
}

fs.writeFileSync(genPath, src, 'utf8');
console.log('Done.');
