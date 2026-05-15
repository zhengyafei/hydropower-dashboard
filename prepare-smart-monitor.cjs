const fs = require('fs');
const har = JSON.parse(fs.readFileSync('cui_test/智能监控.har', 'utf8'));
const entries = har.log.entries;

const apis = {};
entries.forEach(e => {
  const url = e.request.url;
  if (!url.includes(':9443')) return;
  const u = new URL(url);
  const path = u.pathname;
  if (!apis[path] && e.response.content.text) {
    try { apis[path] = JSON.parse(e.response.content.text); } catch(ex) {}
  }
});

// Extract key data
const embed = {
  // Company tree
  companyTree: (apis['/oauth/userInfo/companyTree/562431673891819542'] || {}).body || [],
  // Menu structure
  menuList: (apis['/oauth/userInfo/companyUserMenuList/19091711321706'] || {}).body || [],
  // User info
  userInfo: (apis['/oauth/userInfo/user'] || {}).body || {},

  // Station indicators (JME = 江河集控)
  stationFDL_JT: (apis['/indicator/areaCompanyIndex/stationFDL/HN_ZZ_YLFGS/JME'] || {}).body || [],
  topDetail_JT: (apis['/indicator/areaCompanyIndex/topDetail/JME'] || {}).body || [],
  fdDetail_JT: (apis['/indicator/areaCompanyIndex/fdDetail/JME'] || {}).body || [],
  subCompanyDetail_JT: (apis['/indicator/areaCompanyIndex/subCompanyDetail/562431673891819542/JME'] || {}).body || [],

  // Station indicators (QY = 区域)
  stationFDL_QY: (apis['/indicator/areaCompanyIndex/stationFDL/HN_ZZ_JJY/HN_ZZ_YLFGS'] || {}).body || [],
  topDetail_QY: (apis['/indicator/areaCompanyIndex/topDetail/HN_ZZ_YLFGS'] || {}).body || [],
  fdDetail_QY: (apis['/indicator/areaCompanyIndex/fdDetail/HN_ZZ_YLFGS'] || {}).body || [],
  subCompanyDetail_QY: (apis['/indicator/areaCompanyIndex/subCompanyDetail/562431673891819542/HN_ZZ_YLFGS'] || {}).body || [],

  // App station indices
  planCompleteRate_JT: (apis['/indicator/appStationIndex/companyPlanCompleteRate/JME'] || {}).body || [],
  planCompleteRate_QY: (apis['/indicator/appStationIndex/companyPlanCompleteRate/HN_ZZ_YLFGS'] || {}).body || [],
  useHours_JT: (apis['/indicator/appStationIndex/useHours/JT/JME'] || {}).body || [],
  useHours_QY: (apis['/indicator/appStationIndex/useHours/QY/HN_ZZ_YLFGS'] || {}).body || [],

  // Company analysis
  companyAnalyse_JME: (apis['/indicator/areaCompanyAnalyse/companyAnalyse/JME'] || {}).body || [],
  companyAnalyse_QY: (apis['/indicator/areaCompanyAnalyse/stationAnalyse/HN_ZZ_YLFGS'] || {}).body || [],

  // Weather
  weatherNow_YL: (apis['/common/weather/now/CN101250306'] || {}).body || {},
  weatherNow_LY: (apis['/common/weather/now/CN101250103'] || {}).body || {},
  weatherForecast_YL: (apis['/common/weather/WeatherForecast/CN101250306/undefined'] || {}).body || {},

  // Station devices
  deviceDetail_JJY: (apis['/indicator/stationIndex/deviceDetail/HN_ZZ_JJY'] || {}).body || {},
  deviceView: (apis['/indicator/stationIndex/deviceView/HN_ZZ_JJY/HN_ZZ_YLFGS'] || {}).body || {},
  deviceRTFD_JJY: (apis['/indicator/stationIndex/deviceRTFD/HN_ZZ_JJY'] || {}).body || {},

  // Ecological flow
  ecoFlowList: (apis['/common/ecologicalFlow/baseInfoList/HN_ZZ_YLFGS'] || {}).body || {},
  ecoFlowDetail_JJY: (apis['/common/ecologicalFlow/baseInfo/HN_ZZ_JJY'] || {}).body || {},
  ecoFlow24h_JJY: (apis['/common/ecologicalFlow//realData/24Hour/HN_ZZ_JJY'] || {}).body || {},

  // Device efficiency
  deviceEfficiency_Year: (apis['/calculate/deviceEfficiency/getYearCount/217'] || {}).body || {},
  deviceEfficiency_Latest: (apis['/calculate/deviceEfficiency/getLatest/217'] || {}).body || {},

  // Station month reports
  stationCount_JJY: (apis['/common/stationMonthReport/getStationCount/HN_ZZ_JJY'] || {}).body || {},

  // Alarms
  alarmMessages_JJY: (apis['/ialarm/message/list'] || {}).body || {},
  alarmEvents_JJY: (apis['/ialarm/event/list'] || {}).body || {},

  // Cameras
  cameraList_JME: (apis['/camera/cameraConf'] || {}).body || {},
  cameraList_QY: (apis['/camera/cameraConf'] || {}).body || {},
  qwCameraList: (apis['/camera/cameraConf/qwCameraList/562431673891819542'] || {}).body || {},

  // Station FDL compare
  stationFdlCompare_JJY: (apis['/common/stationFdlReport/getStationFdlCompare/HN_ZZ_JJY'] || {}).body || {},

  // LosEle (loss electricity)
  losEleList: (apis['/ops/stationLosEle/list/562431673891819542'] || {}).body || {},

  // Devices
  tagPointCompanies: (apis['/remote/tagPoint/getCompanyList/562431673891819542'] || {}).body || [],
  stationTagPoint: (apis['/remote/tagPoint/getStationTagPoint/562431673891819542'] || {}).body || {},

  // Report config
  reportConfig: (apis['/common/reportConfig/list'] || {}).body || {},

  // Dic
  dicUnitState: (apis['/admin/dic/getDicDataList'] || {}).body || [],
  dicYhlb: (apis['/admin/dic/getDicDataList'] || {}).body || [],

  // Station config
  stationConfig_JJY: (apis['/remote/tagPoint/getStationConfig/HN_ZZ_JJY'] || {}).body || {},

  // Phone call
  phoneCallList: (apis['/ops/phoneCall/getCallList/562431673891819542'] || {}).body || [],

  // Monthly report count
  jtCount2026: (apis['/common/stationMonthReport/getJTCount/JME/562431673891819542'] || {}).body || {},
  areaCount_202605: (apis['/common/stationMonthReport/getAreaCompanyCount/HN_ZZ_YLFGS/562431673891819542'] || {}).body || {},
};

// Write embed
let js = 'const SMART_MONITOR_DATA = ' + JSON.stringify(embed, null, 0) + ';';
fs.writeFileSync('cui_test/smart_monitor_embed.js', js);
console.log('Smart monitor embed written: ' + (js.length/1024).toFixed(1) + 'KB');

// Summary
console.log('\nKey data summary:');
console.log('  Company tree levels:', JSON.stringify(embed.companyTree).length, 'bytes');
console.log('  Menu items:', embed.menuList.length);
console.log('  SubCompanyDetail (JT):', (embed.subCompanyDetail_JT || []).length, 'groups');
console.log('  SubCompanyDetail (QY):', (embed.subCompanyDetail_QY || []).length, 'groups');
console.log('  Company Analyse (JME):', embed.companyAnalyse_JME.length, 'stations');
console.log('  Company Analyse (QY):', embed.companyAnalyse_QY.length, 'stations');
console.log('  Device Detail:', JSON.stringify(embed.deviceDetail_JJY).length, 'bytes');
console.log('  Alarm messages:', (embed.alarmMessages_JJY || {}).total || 0);
console.log('  Alarm events:', (embed.alarmEvents_JJY || {}).total || 0);
