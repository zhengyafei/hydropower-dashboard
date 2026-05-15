const fs = require('fs');
const dataJs = fs.readFileSync('cui_test/har_embed_data.js', 'utf8');

const CSS = fs.readFileSync('cui_test/generate-html.cjs', 'utf8').match(/const CSS = `([\s\S]*?)`;/)[1];

// Build the JS render code
const renderJS = `

// ===== HELPERS =====
function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function fmtTs(ts) {
  if (!ts || ts==='0') return '-';
  const d = new Date(parseInt(ts)*1000);
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function fmtDt(s) {
  if (!s) return '-';
  if (/^\\d{10,13}$/.test(s)) return fmtTs(s);
  return esc(s).split(' ')[0] || '-';
}
function badge(s, cls) { return '<span class="badge '+cls+'">'+esc(s)+'</span>'; }
function statusBadge(s) {
  if (s==='end'||s==='已结束') return badge('已结束','be');
  if (s==='progress'||s==='p0020'||s==='pw003'||s==='an004') return badge('进行中','bp');
  if (s==='open') return badge('未处理','bo');
  return badge(esc(s||'-'),'');
}
function levelBadge(l) {
  const cls = l==1?'lv1':l==2?'lv2':'lv3';
  return badge((l||'?')+'级', cls);
}
function shiftBadge(n) { return '<span class="shift-tag s'+n+'">班'+n+'</span>'; }
function taskStatText(s) {
  const map = {0:'待执行',1:'已签到',2:'已开始',3:'已提交',4:'已审核',5:'已完成',11:'已结束',10:'超时'};
  return map[s] || ('状态'+s);
}

// ===== PAGE RENDERER =====
function renderPage(pageId) {
  const D = HAR_DATA;
  let h = '';
  const R = (arr) => arr || [];

  switch(pageId) {

  // ========== HOME ==========
  case 'home': {
    h += '<div class="kpi-row">';
    h += '<div class="kpi good"><div class="kl">延时工单</div><div class="kv">0</div><div class="ks">2026年1-12月均为零</div></div>';
    h += '<div class="kpi"><div class="kl">两票总数</div><div class="kv">257</div><div class="ks">工作票累计</div></div>';
    h += '<div class="kpi"><div class="kl">缺陷总数</div><div class="kv">1,630</div><div class="ks">含已处理和待处理</div></div>';
    h += '<div class="kpi"><div class="kl">巡检任务</div><div class="kv">438k</div><div class="ks">累计 438,345 条</div></div>';
    h += '<div class="kpi"><div class="kl">记事记录</div><div class="kv">13.8k</div><div class="ks">累计 13,846 条</div></div>';
    h += '<div class="kpi"><div class="kl">电站数量</div><div class="kv">55</div><div class="ks">覆盖7个运维中心</div></div>';
    h += '</div>';

    h += '<div class="mgrid sched-layout">';
    // Scheduling table
    h += '<div class="card sched-row"><div class="card-header"><span class="ct">长沙智能监控中心 · 2026年5月排班表</span><span class="cn">'+(D.scheduling||[]).length+'天</span></div><div class="card-body"><table class="tbl"><thead><tr><th>日期</th><th>班次</th><th>值班人员</th></tr></thead><tbody>';
    const today = '2026-05-13';
    (D.scheduling||[]).forEach(day => {
      const isToday = day.date === today;
      day.shifts.forEach((s,si) => {
        h += '<tr'+(isToday?' style="background:rgba(0,180,216,.06)"':'')+'>';
        if(si===0) {
          const d = new Date(day.date);
          h += '<td class="date-col" rowspan="'+day.shifts.length+'">'+day.date.slice(5)+' <span style="font-size:10px;color:var(--t2)">周'+['日','一','二','三','四','五','六'][d.getDay()]+(isToday?' <span style="color:var(--accent)">●</span>':'')+'</span></td>';
        }
        h += '<td>'+shiftBadge(s.num)+'</td><td>'+esc(s.users)+'</td></tr>';
      });
    });
    h += '</tbody></table></div></div>';

    // Right side
    h += '<div style="display:flex;flex-direction:column;gap:14px">';
    h += '<div class="card" style="flex:1"><div class="card-header"><span class="ct">两票管理 · 最近工作票</span><span class="cn">共257条</span></div><div class="card-body"><table class="tbl"><thead><tr><th>业务名称</th><th>单位</th><th>类型</th><th>状态</th></tr></thead><tbody>';
    R(D.workBills).slice(0,6).forEach(w => {
      h += '<tr><td>'+esc(w.title)+'</td><td>'+esc(w.station)+'</td><td>工作票</td><td>'+statusBadge(w.status)+'</td></tr>';
    });
    h += '</tbody></table></div></div>';
    h += '<div class="card" style="flex:1"><div class="card-header"><span class="ct">缺陷管理 · 最近缺陷</span><span class="cn">共1,630条</span></div><div class="card-body"><table class="tbl"><thead><tr><th>缺陷名称</th><th>单位</th><th>等级</th><th>状态</th></tr></thead><tbody>';
    R(D.issues).slice(0,5).forEach(is => {
      h += '<tr><td>'+esc(is.title)+'</td><td>'+esc(is.station)+'</td><td>'+levelBadge(is.level)+'</td><td>'+statusBadge(is.status)+'</td></tr>';
    });
    h += '</tbody></table></div></div></div></div>';

    // Bottom
    h += '<div class="mgrid"><div class="card" style="max-height:200px"><div class="card-header"><span class="ct">调度记事</span><span class="cn">共13,846条</span></div><div class="card-body"><ul class="dlist">';
    R(D.notes).slice(0,5).forEach(n => {
      h += '<li class="ditem"><div class="im"><div class="it" style="font-weight:400">\\u201c'+esc(n.content)+'\\u201d</div><div class="im2">'+esc(n.station)+' · '+esc(n.user)+' · '+esc(n.time)+'</div></div></li>';
    });
    h += '</ul></div></div>';
    h += '<div class="card" style="max-height:200px"><div class="card-header"><span class="ct">运维中心电站分布</span><span class="cn">55座电站</span></div><div class="card-body" style="padding:10px 14px"><div class="tags">';
    const centers = [['小水电智能监控中心',18],['广东英德运维中心',2],['湖南浏阳运维中心',15],['湖南郴州运维中心',4],['湖南道县运维中心',2],['湖南溆浦运维中心',4],['湖南炎陵运维中心',18]];
    centers.forEach(([n,c]) => { h += '<span class="tag">'+n+'<em>'+c+'</em></span>'; });
    h += '</div><div style="font-size:10px;color:var(--t3);margin-top:6px">共覆盖 55 座水电站，分布于广东、湖南两省</div></div></div></div>';
    break;
  }

  // ========== 排班设置 ==========
  case 'scheduling': {
    h += '<div class="page-title">排班设置 · 长沙智能监控中心</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">2026年5月排班表</span><span class="cn">'+(D.scheduling||[]).length+'天</span></div><div class="card-body"><table class="tbl"><thead><tr><th>日期</th><th>班次</th><th>值班人员</th></tr></thead><tbody>';
    (D.scheduling||[]).forEach(day => {
      day.shifts.forEach((s,si) => {
        const wd = new Date(day.date).getDay();
        if(si===0) h += '<tr><td class="date-col" rowspan="'+day.shifts.length+'">'+day.date.slice(5)+' <span style="font-size:10px;color:var(--t2)">周'+['日','一','二','三','四','五','六'][wd]+'</span></td>';
        else h += '<tr>';
        h += '<td>'+shiftBadge(s.num)+'</td><td>'+esc(s.users)+'</td></tr>';
      });
    });
    h += '</tbody></table></div></div>';
    break;
  }

  // ========== 接班记事 ==========
  case 'handover': {
    h += '<div class="page-title">接班记事</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">最新调度记事</span><span class="cn">共'+(D.schedulingRecordList?.total||13846)+'条</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th style="width:45%">记事内容</th><th>电站</th><th>记录人</th><th>发生时间</th><th>类型</th></tr></thead><tbody>';
    R(D.schedulingRecordList?.records||D.notes).slice(0,15).forEach(r => {
      const content = r.content || '';
      const rt = r.recordType === '1' ? '接班记事' : r.recordType === '2' ? '交班记事' : (r.recordType||'记事');
      h += '<tr><td style="color:var(--t)">'+esc(content)+'</td><td>'+esc(r.companyName||r.station||'-')+'</td><td>'+esc(r.userName||r.user||'-')+'</td><td>'+fmtTs(r.happenTime||r.createTime)+'</td><td>'+esc(rt)+'</td></tr>';
    });
    h += '</tbody></table></div></div>';
    break;
  }

  // ========== 记事查询 ==========
  case 'records': {
    h += '<div class="page-title">记事查询</div><div class="page-sub">调度记事记录，共'+ (D.schedulingRecordList?.total||13846) +'条</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">记事列表</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th style="width:40%">记事内容</th><th>电站</th><th>记录人</th><th>发生时间</th><th>记录类型</th><th>附件</th></tr></thead><tbody>';
    R(D.schedulingRecordList?.records||D.notes).slice(0,20).forEach(r => {
      const rt = r.recordType === '1' ? '接班记事' : r.recordType === '2' ? '交班记事' : (r.recordType||'记事');
      h += '<tr><td>'+esc(r.content||'')+'</td><td>'+esc(r.companyName||r.station||'-')+'</td><td>'+esc(r.userName||r.user||'-')+'</td><td>'+fmtTs(r.happenTime||r.createTime)+'</td><td>'+esc(rt)+'</td><td>'+esc(r.fileCount||0)+'个</td></tr>';
    });
    h += '</tbody></table></div></div>';
    break;
  }

  // ========== 缺陷管理 ==========
  case 'issues': {
    h += '<div class="page-title">缺陷管理</div><div class="page-sub">共 '+ (D.issueList?.total||1630) +' 条缺陷记录</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">缺陷列表</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>缺陷名称</th><th>单位</th><th>设备</th><th>等级</th><th>发现时间</th><th>发现人</th><th>填报人</th><th>状态</th><th>处理人</th></tr></thead><tbody>';
    const allIssues = (D.issueList?.records || []).concat(D.issueList?.records || []);
    allIssues.slice(0,15).forEach(is => {
      h += '<tr><td>'+esc(is.title)+'</td><td>'+esc(is.companyName)+'</td><td>'+esc(is.deviceName||'-')+'</td><td>'+levelBadge(is.level)+'</td><td>'+fmtTs(is.discoverTime)+'</td><td>'+esc(is.discoverUser||'-')+'</td><td>'+esc(is.userName||'-')+'</td><td>'+statusBadge(is.status)+'</td><td>'+esc(is.assigneeName||'-')+'</td></tr>';
    });
    h += '</tbody></table></div></div>';
    break;
  }

  // ========== 定期工作(巡检) ==========
  case 'inspects': {
    h += '<div class="page-title">定期工作（巡检）</div><div class="page-sub">累计 '+ (D.inspectTask?.total||438345).toLocaleString() +' 条巡检任务</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">巡检任务列表</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th style="width:30%">任务描述</th><th>电站</th><th>任务开始</th><th>任务结束</th><th>负责人</th><th>完成人</th><th>周期(天)</th><th>状态</th></tr></thead><tbody>';
    R(D.inspectTasks||D.inspectTask?.records).slice(0,15).forEach(t => {
      const taskDesc = t.taskDesc || t.title || '';
      h += '<tr><td>'+esc(taskDesc)+'</td><td>'+esc(t.companyName||t.station||'-')+'</td><td>'+fmtTs(t.taskBeginTime)+'</td><td>'+fmtTs(t.taskEndTime)+'</td><td>'+esc(t.taskUserName||'-')+'</td><td>'+esc(t.finishName||'-')+'</td><td>'+esc(t.timeCycle||'-')+'</td><td>'+badge(taskStatText(t.taskStat), t.taskStat>=5||t.taskStat===11?'be':'bp')+'</td></tr>';
    });
    h += '</tbody></table></div></div>';
    break;
  }

  // ========== 两票管理 ==========
  case 'workbills': {
    h += '<div class="page-title">两票管理</div><div class="page-sub">共 '+ (D.workBillList?.total||257) +' 条工作票</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">工作票列表</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>业务名称</th><th>两票类型</th><th>单位</th><th>设备</th><th>计划开始</th><th>计划结束</th><th>工作负责人</th><th>填票人</th><th>当前状态</th><th>关联缺陷</th></tr></thead><tbody>';
    R(D.workBills||D.workBillList?.records).slice(0,15).forEach(w => {
      const billTypeMap = {workTicket1:'工作票',workTicket2:'操作票',opTicket1:'操作票'};
      const bt = billTypeMap[w.billType] || w.billType || '工作票';
      h += '<tr><td>'+esc(w.title)+'</td><td>'+esc(bt)+'</td><td>'+esc(w.station||w.companyName)+'</td><td>'+esc(w.deviceName||'-')+'</td><td>'+fmtTs(w.beginTime)+'</td><td>'+fmtTs(w.endTime)+'</td><td>'+esc(w.otherFinishUser||w.finishUser||'-')+'</td><td>'+esc(w.user||w.userName||'-')+'</td><td>'+statusBadge(w.status)+'</td><td>'+esc(w.issueId||'无')+'</td></tr>';
    });
    if (!R(D.workBills||D.workBillList?.records).length) {
      h += '<tr><td colspan="10"><div class="empty-state"><div class="eicon">📋</div>暂无工作票数据</div></td></tr>';
    }
    h += '</tbody></table></div></div>';
    break;
  }

  // ========== 计划工作 ==========
  case 'planworks': {
    h += '<div class="page-title">计划工作</div><div class="page-sub">共 '+ (D.planWorkList?.total||13) +' 条</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">计划工作列表</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>工作名称</th><th>单位</th><th>设备</th><th>计划开始</th><th>计划结束</th><th>负责人</th><th>填票人</th><th>状态</th><th>处理人</th></tr></thead><tbody>';
    R(D.planWorkList?.records||D.planWorks).slice(0,15).forEach(p => {
      h += '<tr><td>'+esc(p.title)+'</td><td>'+esc(p.companyName||p.station||'-')+'</td><td>'+esc(p.deviceName||'-')+'</td><td>'+fmtTs(p.beginTime)+'</td><td>'+fmtTs(p.endTime)+'</td><td>'+esc(p.finishUser||'-')+'</td><td>'+esc(p.userName||p.user||'-')+'</td><td>'+statusBadge(p.status)+'</td><td>'+esc(p.assigneeName||'-')+'</td></tr>';
    });
    if (!R(D.planWorkList?.records||D.planWorks).length) {
      h += '<tr><td colspan="9"><div class="empty-state"><div class="eicon">📌</div>暂无计划工作数据</div></td></tr>';
    }
    h += '</tbody></table></div></div>';
    break;
  }

  // ========== 电站统计分析 ==========
  case 'stationstats': {
    h += '<div class="page-title">电站统计分析</div><div class="page-sub">接入电站 '+(D.stationCodeList?.total||D.stationCodes?.length||149)+' 座</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">电站发电量列表</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>电站编码</th><th>电站名称</th><th>发电日期</th><th>发电量(kWh)</th><th>降雨量</th><th>数据类型</th></tr></thead><tbody>';
    R(D.stationCodeList?.records||D.stationCodes).slice(0,25).forEach(s => {
      h += '<tr><td style="font-family:var(--fd)">'+esc(s.stationCode||s.code)+'</td><td>'+esc(s.stationName||s.name)+'</td><td>'+esc(s.fdlDate||'-')+'</td><td style="font-family:var(--fd)">'+(s.fdlVal!=null ? Number(s.fdlVal).toLocaleString() : '-')+'</td><td>'+(s.pcpnVal!=null ? Number(s.pcpnVal).toLocaleString() : '-')+'</td><td>'+esc(s.fdlType==='d'?'日':'月')+'</td></tr>';
    });
    h += '</tbody></table></div></div>';
    break;
  }

  // ========== 电站考察 ==========
  case 'stationExamine': {
    h += '<div class="page-title">电站考察</div><div class="page-sub">共 '+ (D.stationExamine?.total||40) +' 条考察记录</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">考察列表</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>电站名称</th><th>考察日期</th><th>考察人</th><th>得分</th><th>满分</th><th>电站类型</th><th>录入人</th></tr></thead><tbody>';
    R(D.stationExamine?.records||D.stationExamines).slice(0,15).forEach(e => {
      h += '<tr><td>'+esc(e.stationName||e.title||'-')+'</td><td>'+esc(e.examineDate||'-')+'</td><td>'+esc(e.examineUserName||'-')+'</td><td style="font-family:var(--fd)">'+esc(e.finishVal||'-')+'</td><td style="font-family:var(--fd)">'+esc(e.sumVal||'-')+'</td><td>'+esc(e.stationType==='l'?'引水式':'坝后式')+'</td><td>'+esc(e.userName||'-')+'</td></tr>';
    });
    if (!R(D.stationExamine?.records||D.stationExamines).length) {
      h += '<tr><td colspan="7"><div class="empty-state"><div class="eicon">🏭</div>暂无考察数据</div></td></tr>';
    }
    h += '</tbody></table></div></div>';
    break;
  }

  // ========== 验收管理 ==========
  case 'finishCheck': {
    h += '<div class="page-title">验收管理</div><div class="page-sub">共 '+ (D.finishCheck?.total||6) +' 条验收任务</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">验收列表</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>验收任务</th><th>电站</th><th>设备</th><th>创建时间</th><th>创建人</th><th>更新人</th><th>更新时间</th></tr></thead><tbody>';
    R(D.finishCheck?.records||D.finishChecks).slice(0,15).forEach(f => {
      h += '<tr><td>'+esc(f.taskTitle||f.title)+'</td><td>'+esc(f.companyName||f.station)+'</td><td>'+esc(f.deviceTitle||'-')+'</td><td>'+esc(f.ctime||'-')+'</td><td>'+esc(f.cuser||'-')+'</td><td>'+esc(f.uuser||'-')+'</td><td>'+esc(f.utime||'-')+'</td></tr>';
    });
    if (!R(D.finishCheck?.records||D.finishChecks).length) {
      h += '<tr><td colspan="7"><div class="empty-state"><div class="eicon">✔</div>暂无验收数据</div></td></tr>';
    }
    h += '</tbody></table></div></div>';
    break;
  }

  // ========== 设备综合信息 ==========
  case 'equipments': {
    h += '<div class="page-title">设备综合信息</div>';
    const eqData = (D.equipmentBaseInfo?.data?.records || D.equipmentBaseInfo?.body?.records || D.equipments || []);
    h += '<div class="card"><div class="card-header"><span class="ct">设备列表</span><span class="cn">共'+(eqData.length||4)+'条</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>设备名称</th><th>设备编码</th><th>所属电站</th><th>规格型号</th><th>层级</th><th>是否主要</th><th>备件关联</th></tr></thead><tbody>';
    eqData.slice(0,15).forEach(eq => {
      h += '<tr><td>'+esc(eq.name||eq.equipmentName)+'</td><td style="font-family:var(--fd)">'+esc(eq.equipmentCode||'-')+'</td><td>'+esc(eq.companyName||eq.station||'-')+'</td><td>'+esc(eq.model||'-')+'</td><td>'+esc(eq.equipmentLayer||eq.equipmentTier||'-')+'</td><td>'+esc(eq.mainEqp==='1'?'是':'否')+'</td><td>'+esc(eq.spareRerelGuid||'无')+'</td></tr>';
    });
    if (!eqData.length) {
      h += '<tr><td colspan="7"><div class="empty-state"><div class="eicon">📡</div>暂无设备数据</div></td></tr>';
    }
    h += '</tbody></table></div></div>';
    break;
  }

  // ========== 设备参数 ==========
  case 'equipParams': {
    h += '<div class="page-title">设备参数</div>';
    const epData = D.equipmentParamList?.data?.records || D.equipmentParams || [];
    h += '<div class="card"><div class="card-header"><span class="ct">参数列表</span><span class="cn">共'+(D.equipmentParamList?.data?.total||epData.length)+'条</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>参数名称</th><th>参数编码</th><th>单位</th><th>类型</th><th>所属分类</th><th>备注</th></tr></thead><tbody>';
    epData.slice(0,15).forEach(p => {
      h += '<tr><td>'+esc(p.name||p.paramName||'-')+'</td><td style="font-family:var(--fd)">'+esc(p.code||'-')+'</td><td>'+esc(p.unit||'-')+'</td><td>'+esc(p.istype===1?'分类':'参数')+'</td><td>'+esc(p.parentGuid||'-')+'</td><td>'+esc(p.remark||'-')+'</td></tr>';
    });
    if (!epData.length) {
      h += '<tr><td colspan="6"><div class="empty-state"><div class="eicon">⚡</div>暂无参数数据</div></td></tr>';
    }
    h += '</tbody></table></div></div>';
    break;
  }

  // ========== 设备模型 ==========
  case 'equipModels': {
    h += '<div class="page-title">设备模型</div>';
    const emData = D.equipmentModelList?.data?.records || D.equipmentModels || [];
    h += '<div class="card"><div class="card-header"><span class="ct">模型列表</span><span class="cn">共'+(D.equipmentModelList?.data?.total||emData.length)+'条</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>模型名称</th><th>编码</th><th>专业</th><th>能源类型</th><th>分类</th><th>是否主要设备</th><th>子设备数</th></tr></thead><tbody>';
    emData.slice(0,15).forEach(m => {
      const egyMap = {01:'水能',02:'风能',03:'太阳能',04:'其他'};
      h += '<tr><td>'+esc(m.name||m.modelName||'-')+'</td><td style="font-family:var(--fd)">'+esc(m.equipmentCode||'-')+'</td><td>'+esc(m.specialties||'-')+'</td><td>'+esc(egyMap[m.egyType]||m.egyType||'-')+'</td><td>'+esc(m.classify||'-')+'</td><td>'+esc(m.mainEqp==='1'?'是':'否')+'</td><td style="font-family:var(--fd)">'+esc(m.childrenNum||'0')+'</td></tr>';
    });
    if (!emData.length) {
      h += '<tr><td colspan="7"><div class="empty-state"><div class="eicon">🔧</div>暂无模型数据</div></td></tr>';
    }
    h += '</tbody></table></div></div>';
    break;
  }

  // ========== 设备备品备件 ==========
  case 'equipSpares': {
    h += '<div class="page-title">设备备品备件</div>';
    const esData = D.equipmentSpareList?.data?.records || D.equipmentSpares || [];
    h += '<div class="card"><div class="card-header"><span class="ct">备件列表</span><span class="cn">共'+(D.equipmentSpareList?.data?.total||esData.length)+'条</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>备件名称</th><th>规格型号</th><th>单位</th><th>最大库存</th><th>最小库存</th><th>定额数</th><th>所属电站</th><th>是否备件</th></tr></thead><tbody>';
    esData.slice(0,15).forEach(s => {
      h += '<tr><td>'+esc(s.name||s.spareName||'-')+'</td><td>'+esc(s.code||s.model||'-')+'</td><td>'+esc(s.unit||'-')+'</td><td style="font-family:var(--fd)">'+esc(s.maxstkQty||'-')+'</td><td style="font-family:var(--fd)">'+esc(s.minstkQty||'-')+'</td><td style="font-family:var(--fd)">'+esc(s.rationQty||'-')+'</td><td>'+esc(s.companyName||'-')+'</td><td>'+esc(s.isspare==='1'?'是':'否')+'</td></tr>';
    });
    if (!esData.length) {
      h += '<tr><td colspan="8"><div class="empty-state"><div class="eicon">🧩</div>暂无备件数据</div></td></tr>';
    }
    h += '</tbody></table></div></div>';
    break;
  }

  // ========== 设备评级 ==========
  case 'equipLevels': {
    h += '<div class="page-title">设备评级</div><div class="page-sub">共 '+ (D.equipmentLevel?.total||13) +' 条</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">评级列表</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>评级编号</th><th>电站</th><th>评级年度</th><th>负责人</th><th>参与人员</th><th>评级日期</th><th>状态</th></tr></thead><tbody>';
    R(D.equipmentLevel?.records||D.equipmentLevels).slice(0,15).forEach(el => {
      h += '<tr><td style="font-family:var(--fd)">'+esc(el.levelInfoCode||el.levelInfoGuid||'-')+'</td><td>'+esc(el.companyName||el.station||'-')+'</td><td>'+esc(el.offerYear||'-')+'</td><td>'+esc(el.leaderName||el.leader||'-')+'</td><td>'+esc(el.joinUsersName||el.joinUsers||'-')+'</td><td>'+esc(el.buildTime||'-')+'</td><td>'+esc(el.status||'进行中')+'</td></tr>';
    });
    if (!R(D.equipmentLevel?.records||D.equipmentLevels).length) {
      h += '<tr><td colspan="7"><div class="empty-state"><div class="eicon">⭐</div>暂无评级数据</div></td></tr>';
    }
    h += '</tbody></table></div></div>';
    break;
  }

  // ========== 检修履历 ==========
  case 'equipRepairs': {
    h += '<div class="page-title">检修履历</div><div class="page-sub">共 '+ (D.equipmentRepairList?.total||50) +' 条</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">检修记录</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>设备名称</th><th>电站</th><th>检修类型</th><th>费用类型</th><th>开始日期</th><th>结束日期</th><th>天数</th><th>检修人员</th><th>工作内容</th><th>运行标记</th></tr></thead><tbody>';
    const repairTypeMap = {01:'大修',02:'小修',03:'临修',04:'预防性检修',05:'C级检修',06:'D级检修'};
    const payTypeMap = {01:'自费',02:'外包'};
    R(D.equipmentRepairList?.records||D.equipmentRepairs).slice(0,15).forEach(r => {
      h += '<tr><td>'+esc(r.deviceName||r.equipmentName||'-')+'</td><td>'+esc(r.stationName||r.companyName||'-')+'</td><td>'+esc(repairTypeMap[r.repairType]||r.repairType||'-')+'</td><td>'+esc(payTypeMap[r.payType]||r.payType||'-')+'</td><td>'+esc(r.startDate||'-')+'</td><td>'+esc(r.endDate||'-')+'</td><td style="font-family:var(--fd)">'+esc(r.repairDay||'-')+'</td><td>'+esc(r.repairUser||'-')+'</td><td>'+esc(r.workContent||'-')+'</td><td>'+esc(r.runMark||'-')+'</td></tr>';
    });
    if (!R(D.equipmentRepairList?.records||D.equipmentRepairs).length) {
      h += '<tr><td colspan="10"><div class="empty-state"><div class="eicon">🔨</div>暂无检修数据</div></td></tr>';
    }
    h += '</tbody></table></div></div>';
    break;
  }

  // ========== 安全管理列表 ==========
  case 'safetyList': {
    h += '<div class="page-title">安全管理列表</div><div class="page-sub">共 '+ (D.securityList?.total||19) +' 条</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">安全项目</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>标题</th><th>电站</th><th>安全类型</th><th>安全分类</th><th>创建时间</th><th>创建人</th><th>备注</th><th>附件</th></tr></thead><tbody>';
    R(D.securityList?.records||D.securityItems).slice(0,15).forEach(s => {
      h += '<tr><td>'+esc(s.title||'-')+'</td><td>'+esc(s.companyName||'-')+'</td><td>'+esc(s.securityType||'-')+'</td><td>'+esc(s.securitySort||'-')+'</td><td>'+fmtTs(s.createTime)+'</td><td>'+esc(s.userName||'-')+'</td><td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(s.remark||'-')+'</td><td>'+esc(s.fileCount||0)+'个</td></tr>';
    });
    if (!R(D.securityList?.records||D.securityItems).length) {
      h += '<tr><td colspan="8"><div class="empty-state"><div class="eicon">🛡</div>暂无数据</div></td></tr>';
    }
    h += '</tbody></table></div></div>';
    break;
  }

  // ========== 安全隐患 ==========
  case 'safetyHidden': {
    h += '<div class="page-title">安全隐患</div><div class="page-sub">共 '+ (D.securityHidden?.total||4) +' 条</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">隐患列表</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>隐患标题</th><th>电站</th><th>隐患类型</th><th>描述</th><th>发现时间</th><th>发现人</th><th>责任人</th><th>整改措施</th><th>状态</th></tr></thead><tbody>';
    R(D.securityHidden?.records||D.securityHiddens).slice(0,15).forEach(s => {
      h += '<tr><td>'+esc(s.title||'-')+'</td><td>'+esc(s.companyName||'-')+'</td><td>'+esc(s.dangerType==='1'?'重大隐患':'一般隐患')+'</td><td style="max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(s.describe||'-')+'</td><td>'+esc(s.discoveryTime||'-')+'</td><td>'+esc(s.discoveryName||'-')+'</td><td>'+esc(s.personLiableName||'-')+'</td><td>'+esc(s.rectificationMeasures||'-')+'</td><td>'+statusBadge(s.status)+'</td></tr>';
    });
    if (!R(D.securityHidden?.records||D.securityHiddens).length) {
      h += '<tr><td colspan="9"><div class="empty-state"><div class="eicon">🔍</div>暂无隐患数据</div></td></tr>';
    }
    h += '</tbody></table></div></div>';
    break;
  }

  // ========== 安全文件 ==========
  case 'safetyFile': {
    h += '<div class="page-title">安全文件</div><div class="page-sub">共 '+ (D.securityFile?.total||3) +' 条</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">文件列表</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>文件标题</th><th>电站</th><th>信息类型</th><th>创建人</th><th>创建时间</th><th>备注</th><th>附件数</th></tr></thead><tbody>';
    R(D.securityFile?.records||D.securityFiles).slice(0,15).forEach(f => {
      h += '<tr><td>'+esc(f.title||f.fileName||'-')+'</td><td>'+esc(f.companyName||'-')+'</td><td>'+esc(f.informationType==='2'?'制度文件':'其他文件')+'</td><td>'+esc(f.userName||'-')+'</td><td>'+fmtTs(f.createTime)+'</td><td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(f.remark||'-')+'</td><td style="font-family:var(--fd)">'+esc(f.fileCount||0)+'</td></tr>';
    });
    if (!R(D.securityFile?.records||D.securityFiles).length) {
      h += '<tr><td colspan="7"><div class="empty-state"><div class="eicon">📁</div>暂无文件数据</div></td></tr>';
    }
    h += '</tbody></table></div></div>';
    break;
  }

  // ========== 事件快报 ==========
  case 'eventReport': {
    h += '<div class="page-title">事件快报</div><div class="page-sub">共 '+ (D.eventFirstReport?.total||1) +' 条</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">快报列表</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>事件名称</th><th>电站</th><th>发生地点</th><th>发生时间</th><th>事件描述</th><th>处理方式</th><th>后续措施</th><th>填报人</th><th>状态</th></tr></thead><tbody>';
    R(D.eventFirstReport?.records||D.eventReports).slice(0,15).forEach(er => {
      h += '<tr><td>'+esc(er.eventName||er.title||'-')+'</td><td>'+esc(er.companyName||'-')+'</td><td>'+esc(er.eventAddress||'-')+'</td><td>'+fmtTs(er.eventTime)+'</td><td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(er.eventDesc||'-')+'</td><td>'+esc(er.optWay||'-')+'</td><td>'+esc(er.optWayNext||'-')+'</td><td>'+esc(er.eventUserName||er.userName||'-')+'</td><td>'+statusBadge(er.status)+'</td></tr>';
    });
    if (!R(D.eventFirstReport?.records||D.eventReports).length) {
      h += '<tr><td colspan="9"><div class="empty-state"><div class="eicon">🚨</div>暂无快报数据</div></td></tr>';
    }
    h += '</tbody></table></div></div>';
    break;
  }

  // ========== 在线调度 ==========
  case 'dispatch': {
    h += '<div class="page-title">在线调度</div><div class="page-sub">共 '+ (D.locationDutyDetail?.total||91303) +' 条定位记录</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">调度值班定位详情</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>用户</th><th>所属公司</th><th>位置类型</th><th>上报时间</th><th>联系电话</th></tr></thead><tbody>';
    R(D.locationDutyDetail?.records||D.dutyDetails).slice(0,20).forEach(d => {
      const locTypeMap = {0:'未知',1:'签到',2:'签退',3:'巡检',4:'异常'};
      h += '<tr><td>'+esc(d.userName||'-')+'</td><td>'+esc(d.companyName||'-')+'</td><td>'+esc(locTypeMap[d.locType]||d.locType)+'</td><td>'+fmtTs(d.happenTime)+'</td><td>'+esc(d.mobile||'-')+'</td></tr>';
    });
    if (!R(D.locationDutyDetail?.records||D.dutyDetails).length) {
      h += '<tr><td colspan="5"><div class="empty-state"><div class="eicon">◎</div>暂无调度数据</div></td></tr>';
    }
    h += '</tbody></table></div></div>';
    break;
  }

  // ========== 消息管理 ==========
  case 'messages': {
    h += '<div class="page-title">消息管理</div>';
    h += '<div class="card"><div class="card-body"><div class="empty-state"><div class="eicon">✉</div>当前无未读消息</div></div></div>';
    break;
  }

  // ========== 位置地图 ==========
  case 'location': {
    h += '<div class="page-title">位置地图 · 电站分布</div><div class="page-sub">共 '+ (D.locationCompany?.length||D.locations?.length||55) +' 座电站</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">电站位置列表</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>电站名称</th><th>电站编码</th><th>坐标(经度,纬度)</th><th>值守人员</th><th>联系电话</th><th>位置类型</th></tr></thead><tbody>';
    R(D.locationCompany||D.locations).slice(0,30).forEach(l => {
      const user = (l.locationUserList||[])[0] || {};
      const locTypeMap = {0:'未知',1:'在岗',2:'离岗'};
      h += '<tr><td>'+esc(l.companyName||l.name)+'</td><td style="font-family:var(--fd)">'+esc(l.companyCode||'-')+'</td><td style="font-family:var(--fd);font-size:10px">'+esc(l.location||'-')+'</td><td>'+esc(user.userName||'-')+'</td><td>'+esc(user.mobile||'-')+'</td><td>'+esc(locTypeMap[l.locType]||l.locType||'-')+'</td></tr>';
    });
    h += '</tbody></table></div></div>';
    break;
  }

  default:
    h += '<div class="empty-state"><div class="eicon">📄</div>页面加载中...</div>';
  }

  document.getElementById('contentRoot').innerHTML = h;
}
`;

// Now build full HTML
const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>小水电集控 · 小水电智能监控中心</title>
<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
<style>${CSS}</style>
</head>
<body>

<aside class="sidebar">
  <div class="side-logo">
    <h2><span>小水电</span>集控</h2>
    <div class="sub">HYDROPOWER OPS CENTER</div>
  </div>
  <nav class="side-nav" id="sideNav"></nav>
</aside>

<div class="main">
  <header class="hdr">
    <span class="ldot"></span>
    <span class="sys">小水电智能监控中心</span>
    <span class="sep"></span>
    <span class="bc" id="breadcrumb">运维首页</span>
    <span class="sp"></span>
    <span class="clk" id="clock">--</span>
    <span class="sep"></span>
    <div class="ub">
      <div class="ua">司</div>
      <span>司马佳</span>
      <span style="color:var(--t3);font-size:10px">运行管理</span>
    </div>
  </header>
  <div class="content" id="contentRoot"></div>
</div>

<script>
${dataJs}
</script>
<script>
// ===== MENU DEFINITION =====
const MENU = [
  {id:'home',name:'运维首页',icon:'⌂',page:'home',kids:[]},
  {id:'yxzb',name:'运行值班',icon:'⚡',kids:[
    {id:'sched',name:'排班设置',page:'scheduling'},
    {id:'handover',name:'接班记事',page:'handover'},
    {id:'recordq',name:'记事查询',page:'records'}
  ]},
  {id:'yxgl',name:'运行管理',icon:'▣',kids:[
    {id:'issue',name:'缺陷管理',page:'issues'},
    {id:'inspect',name:'定期工作',page:'inspects'},
    {id:'ticket',name:'两票管理',page:'workbills'},
    {id:'planwork',name:'计划工作',page:'planworks'},
    {id:'stat',name:'电站统计分析',page:'stationstats'}
  ]},
  {id:'inspectMgr',name:'考察验收',icon:'◉',kids:[
    {id:'stExam',name:'电站考察',page:'stationExamine'},
    {id:'accept',name:'验收管理',page:'finishCheck'}
  ]},
  {id:'equip',name:'设备管理',icon:'⚙',kids:[
    {id:'equipInfo',name:'设备综合信息',page:'equipments'},
    {id:'equipParam',name:'设备参数',page:'equipParams'},
    {id:'equipModel',name:'设备模型',page:'equipModels'},
    {id:'equipSpare',name:'设备备品备件',page:'equipSpares'},
    {id:'equipLevel',name:'设备评级',page:'equipLevels'},
    {id:'equipRepair',name:'检修履历',page:'equipRepairs'}
  ]},
  {id:'safety',name:'安全管理',icon:'◈',kids:[
    {id:'safetyList',name:'安全管理列表',page:'safetyList'},
    {id:'safetyHidden',name:'安全隐患',page:'safetyHidden'},
    {id:'safetyFile',name:'安全文件',page:'safetyFile'},
    {id:'eventReport',name:'事件快报',page:'eventReport'}
  ]},
  {id:'dispatch',name:'在线调度',icon:'◎',page:'dispatch',kids:[]},
  {id:'msg',name:'消息管理',icon:'✉',page:'messages',kids:[]},
  {id:'loc',name:'位置地图',icon:'📍',page:'location',kids:[]}
];

// ===== SIDEBAR =====
let currentPage = 'home';
function renderSidebar() {
  const nav = document.getElementById('sideNav');
  let html = '';
  MENU.forEach((group, gi) => {
    const hasKids = group.kids && group.kids.length > 0;
    const isOpen = gi === 0 || gi === 2;
    html += '<div class="ng' + (isOpen ? ' open' : '') + '">';
    if (hasKids) {
      html += '<div class="ngh" data-action="toggle"><span class="ic">'+group.icon+'</span><span>'+group.name+'</span><span class="ar">▶</span></div>';
      html += '<div class="nc">';
      group.kids.forEach(kid => {
        html += '<div class="nci'+(currentPage===kid.page?' active':'')+'" data-page="'+kid.page+'"><span class="dot"></span><span>'+kid.name+'</span></div>';
      });
      html += '</div>';
    } else {
      html += '<div class="ngh'+(currentPage===group.page?' active':'')+'" data-page="'+group.page+'"><span class="ic">'+group.icon+'</span><span>'+group.name+'</span></div>';
    }
    html += '</div>';
  });
  nav.innerHTML = html;
  nav.querySelectorAll('.ngh[data-action="toggle"]').forEach(el => {
    el.addEventListener('click', function(e) { e.stopPropagation(); this.parentElement.classList.toggle('open'); });
  });
  nav.querySelectorAll('.ngh[data-page]').forEach(el => {
    el.addEventListener('click', function() { navigateTo(this.dataset.page); });
  });
  nav.querySelectorAll('.nci[data-page]').forEach(el => {
    el.addEventListener('click', function() { navigateTo(this.dataset.page); });
  });
}
function navigateTo(pageId) {
  currentPage = pageId;
  let label = pageId;
  MENU.forEach(g => {
    if (g.page === pageId) label = g.name;
    if (g.kids) g.kids.forEach(k => { if (k.page === pageId) label = g.name + ' / ' + k.name; });
  });
  document.getElementById('breadcrumb').textContent = label;
  renderSidebar();
  renderPage(pageId);
}
function updateClock() {
  const n = new Date();
  document.getElementById('clock').textContent = n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0')+'-'+String(n.getDate()).padStart(2,'0')+' '+String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0')+':'+String(n.getSeconds()).padStart(2,'0');
}

${renderJS}

// ===== INIT =====
renderSidebar();
renderPage('home');
updateClock();
setInterval(updateClock, 1000);
</script>
</body>
</html>`;

fs.writeFileSync('cui_test/hydropower-dashboard.html', fullHtml, 'utf8');
console.log('Dashboard v2 written: ' + (fullHtml.length/1024).toFixed(1) + 'KB');
