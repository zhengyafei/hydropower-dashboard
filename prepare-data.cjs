const fs = require('fs');
const D = JSON.parse(fs.readFileSync('cui_test/dashboard-data.json', 'utf8'));

// Helper: truncate text
function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

// Build JS data blocks
const embed = {
  menu: D.menuList,
  scheduling: (D.scheduling || []).map(d => ({
    date: d.date,
    shifts: (d.numVoListMap?.schedulingType1 || []).map(s => ({
      num: s.sdlNum,
      users: (s.userVoList || []).map(u => u.userName).join('+')
    }))
  })),
  workBills: (D.workBillList?.records || []).map(r => ({
    title: r.title, station: r.companyName, user: r.userName || r.finishUser,
    date: r.createTime ? new Date(parseInt(r.createTime)*1000).toISOString().slice(0,10) : '',
    status: r.status === 'end' ? 'end' : r.status === 'p0020' ? 'open' : 'progress',
    billCode: r.billCode, billType: r.billType
  })),
  issues: (D.issueList?.records || []).map(r => ({
    title: r.title, station: r.companyName, user: r.userName || r.discoverUser,
    date: r.createTime ? new Date(parseInt(r.createTime)*1000).toISOString().slice(0,10) : '',
    level: r.level || 3, status: r.status === 'end' ? 'end' : r.status === 'p0020' ? 'open' : 'progress'
  })),
  notes: (D.schedulingRecordList?.records || []).map(r => ({
    content: r.content, station: r.companyName, user: r.userName,
    time: r.createTime ? new Date(parseInt(r.createTime)*1000).toISOString().slice(0,16).replace('T',' ') : ''
  })),
  planWorks: (D.planWorkList?.records || []).map(r => ({
    title: r.title || r.planName, station: r.companyName,
    beginTime: r.beginTime ? new Date(parseInt(r.beginTime)*1000).toISOString().slice(0,10) : '',
    endTime: r.endTime ? new Date(parseInt(r.endTime)*1000).toISOString().slice(0,10) : '',
    status: r.status === 'end' ? 'end' : 'progress'
  })),
  planWorkListRaw: D.planWorkList || { total: 0, records: [] },
  issueListRaw: D.issueList || { total: 0, records: [] },
  dicIssueWorkflow: D.dicIssueWorkflow?.records || [],
  inspectTaskRaw: D.inspectTask || { total: 0, records: [] },
  inspectPlanRaw: D.inspectPlan || { total: 0, records: [] },
  dicPlanWork: D.dicPlanWork?.records || [],
  inspectTasks: (D.inspectTask?.records || []).map(r => ({
    title: r.taskTitle || r.title || '', station: r.companyName,
    taskStat: r.taskStat, timeCycle: r.timeCycle
  })),
  stationExamines: (D.stationExamine?.records || []).map(r => ({
    title: r.examineName || r.title || '', station: r.companyName,
    examineDate: r.examineDate || '', status: r.status
  })),
  finishChecks: (D.finishCheck?.records || []).map(r => ({
    title: r.taskTitle || '', station: r.companyName, status: r.taskStat
  })),
  equipments: (D.equipmentBaseInfo?.body?.records || D.equipmentBaseInfo?.records || []).map(r => ({
    name: r.equipmentName || r.name || '', station: r.companyName,
    model: r.equipmentModel || r.model || '', tier: r.equipmentTier
  })),
  equipmentLevels: (D.equipmentLevel?.records || []),
  equipmentModels: (D.equipmentModelList?.body?.records || D.equipmentModelList?.records || []),
  equipmentParams: (D.equipmentParamList?.body?.records || D.equipmentParamList?.records || []),
  equipmentSpares: (D.equipmentSpareList?.body?.records || D.equipmentSpareList?.records || []),
  equipmentRepairs: (D.equipmentRepairList?.records || []),
  securityItems: (D.securityList?.records || []),
  securityHiddens: (D.securityHidden?.records || []),
  securityFiles: (D.securityFile?.records || []),
  eventReports: (D.eventFirstReport?.records || []),
  stations: (D.schedulingCompanyList?.records || []),
  stationCodes: (D.stationCodeList?.records || []),
  locations: D.locationCompany || [],
  dutyDetails: (D.locationDutyDetail?.records || []).slice(0, 20)
};

// Write data JS
let dataJs = 'const HAR_DATA = ' + JSON.stringify(embed, null, 0) + ';';
fs.writeFileSync('cui_test/har_embed_data.js', dataJs);
console.log('Embed data written: ' + (dataJs.length/1024).toFixed(1) + 'KB');
