const fs = require('fs');
const src = fs.readFileSync('cui_test/smart_monitor_embed.js', 'utf8');
const jsonStart = src.indexOf('{');
const D = JSON.parse(src.substring(jsonStart));

console.log('=== alarmMessages_JJY ===');
const am = D.alarmMessages_JJY || {};
console.log('total:', am.total);
if (am.records) {
  console.log('records:', am.records.length);
  if (am.records[0]) console.log('first:', JSON.stringify(am.records[0], null, 2).substring(0, 600));
}

console.log('\n=== alarmEvents_JJY ===');
const ae = D.alarmEvents_JJY || {};
console.log('total:', ae.total);
if (ae.records) {
  console.log('records:', ae.records.length);
  if (ae.records[0]) console.log('first:', JSON.stringify(ae.records[0], null, 2).substring(0, 600));
}

console.log('\n=== ecoFlowList ===');
const ef = D.ecoFlowList || {};
console.log('keys:', Object.keys(ef));
if (ef.records) console.log('records:', ef.records.length);
const efRecords = (ef.body && ef.body.records) ? ef.body.records : (ef.records || []);
console.log('effective records:', efRecords.length);
if (efRecords[0]) console.log('first:', JSON.stringify(efRecords[0], null, 2).substring(0, 600));

console.log('\n=== ecoFlowDetail_JJY ===');
console.log(JSON.stringify(D.ecoFlowDetail_JJY, null, 2).substring(0, 600));

console.log('\n=== ecoFlow24h_JJY ===');
console.log(JSON.stringify(D.ecoFlow24h_JJY, null, 2).substring(0, 800));

console.log('\n=== stationFdlCompare_JJY ===');
console.log(JSON.stringify(D.stationFdlCompare_JJY, null, 2).substring(0, 800));

console.log('\n=== stationCount_JJY ===');
console.log(JSON.stringify(D.stationCount_JJY, null, 2).substring(0, 800));

console.log('\n=== losEleList.records[0] ===');
const le = D.losEleList || {};
if (le.records && le.records[0]) console.log(JSON.stringify(le.records[0], null, 2).substring(0, 600));
console.log('total:', le.total);

console.log('\n=== alarm Rule List ===');
const ar = D.alarmMessages_JJY || {};
// Check if we got alarm rules
const arKeys = Object.keys(D).filter(k => k.toLowerCase().includes('alarm') || k.toLowerCase().includes('rule') || k.toLowerCase().includes('notify'));
console.log('Alarm-related keys:', arKeys);
