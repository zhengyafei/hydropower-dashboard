const fs = require('fs');

// Load HAR
const har = JSON.parse(fs.readFileSync('cui_test/yun.hnjme.com_Archive [26-05-13 20-33-46].har', 'utf8'));
const entries = har.log.entries;

// Helper: get body from response
function getBody(entry) {
  try {
    const json = JSON.parse(entry.response.content.text);
    if (json.body !== undefined) return json.body;
    return json;
  } catch(e) { return null; }
}

// Helper: find first matching entry by path pattern
function find(pathPattern) {
  for (const e of entries) {
    if (e.request.method === 'OPTIONS' || !e.response.content.text) continue;
    if (e.request.url.includes(pathPattern)) return getBody(e);
  }
  return null;
}

// Extract all data
const D = {};

// --- Core ---
D.user = find('/oauth/userInfo/user');
D.companyTree = find('/oauth/userInfo/companyTree/');
D.menuList = find('/oauth/userInfo/opsUserMenuList/');
D.rolePerms = find('/oauth/userInfo/getOpsRolePermission/');
D.managerRole = find('/oauth/userInfo/getOpsManagerRole/');

// --- Dictionary data ---
D.dicBillType = find('dicCode=billType');
D.dicWorkBill = find('dicCode=workBill');
D.dicIssueWorkflow = find('dicCode=issueWorkflow');
D.dicJslx = find('dicCode=jslx');
D.dicPlanWork = find('dicCode=Plan_work');
D.dicEquipmentTier = find('dicCode=BUSIMGR_EQUIPMENT_TIER');
D.dicIsTrue = find('dicCode=BUSIMGR_IS_TRUE');
D.dicEquipStatus = find('dicCode=BUSIMGR_EQUIPMENT_STATUS');
D.dicProType = find('dicCode=BUSIMGR_PROFESSIONAL_TYPE');
D.dicEquipUnit = find('dicCode=BUSIMGR_EQUIPMENT_UNIT');
D.dicEgyType = find('dicCode=EGY_TYPE');
D.dicPayType = find('dicCode=pay_type');
D.dicRepairType = find('dicCode=repair_type');
D.dicSecurityType = find('dicCode=SAFETING_SECURITY_TYPE');
D.dicSecurityHidden = find('dicCode=default_securityHidden');
D.dicEventFirstReport = find('dicCode=default_eventFirstReport');

// --- Index / Dashboard ---
D.workflowDelay = find('/ops/index/workflowDelay/');
D.schedulingNumDelay = find('/ops/index/schedulingNumDelay/');
D.needProcess = find('/ops/index/needProcessWorkFlow/');
D.processFinish = find('/ops/index/processFinishWorkFlow/');

// --- Scheduling ---
D.scheduling = find('/ops/scheduling/getScheduling/1/');
D.schedulingList = find('/ops/scheduling/list?');
D.schedulingGroupList = find('/ops/schedulingGroup/list?');
D.schedulingGroupUser = find('/ops/schedulingGroup/getUserGroup/');
D.schedulingCompanyList = find('/ops/scheduling/companyList?');
D.schedulingRecordList = find('/ops/schedulingRecord/list/pageQuery?');
D.opsRecord = find('/ops/opsRecord/getLatestRecord/');

// --- Work bill ---
D.workBillList = find('/ops/workBill/queryWorkBillList/');

// --- Issue ---
D.issueList = find('/ops/issue/queryIssueList/');

// --- Inspect ---
D.inspectTask = find('/ops/inspect/listInspectTask/');
D.inspectPlan = find('/ops/inspect/listInspectPlan/');

// --- Plan work ---
D.planWorkList = find('/ops/planWork/queryPlanWorkList/');

// --- Station FDL (发电量/统计分析) ---
D.stationCodeList = find('/ops/otherStationFdl/stationCodeList?');
D.fdlSearchTemplate = find('/ops/otherStationFdl/getSearchTemplate?');

// --- Station examine ---
D.stationExamine = find('/ops/stationExamine/listExamine?');

// --- Finish check (验收) ---
D.finishCheck = find('/ops/finishCheckTask/pageQueryData?');

// --- Equipment ---
D.equipmentBaseInfo = find('/ops/equipmentInfo/equipmentBaseInfo/pageQuery?');
D.equipmentLevel = find('/ops/equipmentInfo/equipmentLevel/listEquipmentLevel/');
D.equipmentModelCategory = find('/ops/equipmentModel/procategoryType?');
D.equipmentModelList = find('/ops/equipmentModel/pageQuery?');
D.equipmentParamType = find('/ops/equipmentParamConf/paramType?');
D.equipmentParamList = find('/ops/equipmentParamConf/pageQuery?');
D.equipmentSpareList = find('/ops/equipmentSpare/pageQuery?');
D.equipmentRepairList = find('/ops/equipmentRepair/listEquipmentRepair?');

// --- Security ---
D.securityList = find('/ops/securityManagement/list/');
D.securityHidden = find('/ops/securityHidden/querySecurityHiddenList/');
D.securityTwoAction = find('/ops/securityTwoActionStatic/list/');
D.securityFile = find('/ops/securityFile/list/');
D.eventFirstReport = find('/ops/eventFirstReport/queryEventFirstReportList/');

// --- Location ---
D.locationDutyDetail = find('/ops/location/list/queryDutyDetail/');
D.locationCompany = find('/ops/location/getCompanyLocation/');

// --- Message ---
D.messageList = find('/ops/messageNotify/listUserMessage/');

// --- Station Examine (from first HAR - original) ---
// Already covered above

// Clean: remove null/undefined
Object.keys(D).forEach(k => { if (D[k] === null || D[k] === undefined) delete D[k]; });

// Write data file
fs.writeFileSync('cui_test/dashboard-data.json', JSON.stringify(D, null, 2));
console.log('Extracted ' + Object.keys(D).length + ' data objects');

// Print summary
Object.keys(D).sort().forEach(k => {
  const v = D[k];
  if (Array.isArray(v)) console.log(k + ': array[' + v.length + ']');
  else if (v && v.records) console.log(k + ': page{total:' + (v.total||'?') + ', records:' + v.records.length + '}');
  else if (v && typeof v === 'object') console.log(k + ': object');
  else console.log(k + ': ' + typeof v);
});
