const fs = require('fs');
const html = fs.readFileSync('d:/code/hydropower-web/cui_test/hydropower-dashboard.html', 'utf8');

const checks = [
  '_SP_SCENE_DATA',
  'smartPower',
  'mainWire',
  'unit1StartStop',
  'unit2StartStop',
  'renderSCADA',
  'switchSPTab',
  'canvasUnitControl',
  'canvasMainWire',
  'canvasUnit1SS',
  'canvasUnit2SS',
  'videoMonitor',
  'alarmMgmt',
  'ecoFlow',
  'buildOrgCascaderList',
  'toggleTreeChildren',
  'selectOrgItem',
  'selectTreeGroup',
  'selectOpsCenter',
];

checks.forEach(function(s) {
  const escaped = s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const count = (html.match(new RegExp(escaped, 'g')) || []).length;
  console.log((count > 0 ? 'OK' : 'MISSING') + ': ' + s + ' (' + count + ')');
});
