const fs = require('fs');
let content = fs.readFileSync('cui_test/generate-html-v3.cjs', 'utf8');

// Find the start and end of the old smart monitor cases
const startMarker = "  // ========== 智能监控 > 智能发电 ==========\n  case 'smartPower': {";
const endMarker = "\n  default:\n    h += '<div class=\"empty-state\">";

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker);

if (startIdx < 0 || endIdx < 0) {
  console.log('Markers not found! startIdx:', startIdx, 'endIdx:', endIdx);
  process.exit(1);
}

console.log('Start at:', startIdx, 'End at:', endIdx);

const newCases = `  // ============================================================
  // ========== 智能监控 > 水电站自动化 ==========
  // ============================================================

  // --- 水电站自动化 > 主页 ---
  case 'hydroMain': {
    const SM = window.SMART_MONITOR_DATA || {};
    const analyse = SM.companyAnalyse_JME || [];
    const stationCount = SM.stationCount_JJY || {};
    const fdlCompare = SM.stationFdlCompare_JJY || {};

    let totalGen = 0, totalCap = 0, totalStations = 0;
    analyse.forEach(s => {
      totalGen += parseFloat(s.jrfdl) || 0;
      totalCap += parseFloat(s.zyggl) || 0;
      totalStations += parseFloat(s.normalNum) || 0;
    });

    h += '<div class="page-title">水电站自动化 · 运行监视</div>';
    h += '<div class="page-sub">数据时间：2026-05-14 &nbsp;|&nbsp; 江河集控中心 &nbsp;|&nbsp; 安全一区+四区</div>';

    h += '<div class="kpi-row">';
    h += '<div class="kpi good"><div class="kl">在线电站</div><div class="kv">'+totalStations.toFixed(0)+'</div><div class="ks">/ '+analyse.length+' 运维中心</div></div>';
    h += '<div class="kpi"><div class="kl">今日发电量 (万kWh)</div><div class="kv">'+totalGen.toFixed(2)+'</div><div class="ks">实时累计</div></div>';
    h += '<div class="kpi"><div class="kl">总装机容量 (kW)</div><div class="kv">'+totalCap.toLocaleString()+'</div><div class="ks">接入规模</div></div>';
    h += '<div class="kpi"><div class="kl">测点数</div><div class="kv">12k</div><div class="ks">最大1.2万测点</div></div>';
    h += '<div class="kpi"><div class="kl">通信状态</div><div class="kv" style="color:var(--green)">正常</div><div class="ks">一区Redis在线</div></div>';
    h += '<div class="kpi"><div class="kl">安全分区</div><div class="kv">Ⅰ-Ⅳ</div><div class="ks">横向隔离纵向认证</div></div>';
    h += '</div>';

    h += '<div class="mgrid">';
    // Left: Station running status table
    h += '<div class="card"><div class="card-header"><span class="ct">电站运行状态</span><span class="cn">'+analyse.length+' 个运维中心</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>运维中心</th><th>装机(kW)</th><th>正常台数</th><th>今日发电</th><th>昨日发电</th><th>月累计</th></tr></thead><tbody>';
    analyse.slice(0, 10).forEach(s => {
      h += '<tr><td>'+esc(s.stationName||'-')+'</td><td style="font-family:var(--fd)">'+esc(s.zyggl||'-')+'</td><td style="font-family:var(--fd)">'+esc(s.normalNum||'-')+'</td><td style="font-family:var(--fd);color:var(--accent2)">'+esc(s.jrfdl||'-')+'</td><td style="font-family:var(--fd)">'+esc(s.zrfdl||'-')+'</td><td style="font-family:var(--fd)">'+esc(s.dzyfdl||'-')+'</td></tr>';
    });
    h += '</tbody></table></div></div>';

    // Right: Main wiring diagram placeholder
    h += '<div class="card"><div class="card-header"><span class="ct">主接线示意</span><span class="cn">SL/T 870 安全一区</span></div>';
    h += '<div class="card-body" style="min-height:300px;display:flex;flex-direction:column;align-items:center;justify-content:center">';
    h += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;width:100%;max-width:500px;text-align:center">';
    h += '<div style="padding:14px;background:var(--zone1);border-radius:8px"><div style="font-size:13px;color:var(--t3)">发电机</div><div style="font-size:28px">⚡</div><div style="font-size:14px;color:var(--green)">在线</div></div>';
    h += '<div style="padding:14px;background:var(--zone2);border-radius:8px"><div style="font-size:13px;color:var(--t3)">主变压器</div><div style="font-size:28px">🔌</div><div style="font-size:14px;color:var(--green)">正常</div></div>';
    h += '<div style="padding:14px;background:var(--zone3);border-radius:8px"><div style="font-size:13px;color:var(--t3)">母线</div><div style="font-size:28px">〰</div><div style="font-size:14px;color:var(--green)">带电</div></div>';
    h += '<div style="padding:14px;background:var(--zone4);border-radius:8px"><div style="font-size:13px;color:var(--t3)">出线</div><div style="font-size:28px">🔗</div><div style="font-size:14px;color:var(--green)">并网</div></div>';
    h += '</div>';
    h += '<div style="margin-top:14px;font-size:13px;color:var(--t3)">主接线图详细版在 v2 详细设计阶段完善</div>';
    h += '</div></div>';
    h += '</div>';
    break;
  }

  // --- 水电站自动化 > 梯级调度 ---
  case 'cascadeDispatch': {
    const SM = window.SMART_MONITOR_DATA || {};
    const fdlCompare = SM.stationFdlCompare_JJY || {};
    const fdlData = (fdlCompare.body && fdlCompare.body.records) ? fdlCompare.body.records : (Array.isArray(fdlCompare) ? fdlCompare : []);
    const analyse = SM.companyAnalyse_JME || [];

    h += '<div class="page-title">梯级调度 · 水文分析与发电优化</div>';
    h += '<div class="page-sub">数据来源：三区经济运行引擎 &nbsp;|&nbsp; AGC/AVC 本期仅做下发接口</div>';

    // KPI row
    let totalCap = 0, totalGen = 0;
    analyse.forEach(s => { totalCap += parseFloat(s.zyggl)||0; totalGen += parseFloat(s.jrfdl)||0; });
    h += '<div class="kpi-row">';
    h += '<div class="kpi good"><div class="kl">流域电站数</div><div class="kv">'+analyse.length+'</div><div class="ks">梯级关联</div></div>';
    h += '<div class="kpi"><div class="kl">总装机 (kW)</div><div class="kv">'+totalCap.toLocaleString()+'</div><div class="ks">可调度容量</div></div>';
    h += '<div class="kpi"><div class="kl">今日总发电 (万kWh)</div><div class="kv">'+totalGen.toFixed(2)+'</div><div class="ks">梯级出力</div></div>';
    h += '<div class="kpi"><div class="kl">调度模式</div><div class="kv">集控</div><div class="ks">现地>电站>集控</div></div>';
    h += '</div>';

    // Generation comparison table
    h += '<div class="card"><div class="card-header"><span class="ct">电站发电量对比</span><span class="cn">梯级调度概览</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>电站名称</th><th>装机(kW)</th><th>今日发电</th><th>昨日发电</th><th>月累计</th><th>年累计</th><th>计划完成率</th></tr></thead><tbody>';
    analyse.slice(0, 12).forEach(s => {
      const rate = s.powerPlan ? (parseFloat(s.dznfdl||0)/parseFloat(s.powerPlan)*100).toFixed(1) : '-';
      h += '<tr><td>'+esc(s.stationName||'-')+'</td><td style="font-family:var(--fd)">'+esc(s.zyggl||'-')+'</td><td style="font-family:var(--fd);color:var(--accent2)">'+esc(s.jrfdl||'-')+'</td><td style="font-family:var(--fd)">'+esc(s.zrfdl||'-')+'</td><td style="font-family:var(--fd)">'+esc(s.dzyfdl||'-')+'</td><td style="font-family:var(--fd)">'+esc(s.dznfdl||'-')+'</td><td style="font-family:var(--fd)">'+(rate!='-1'?rate+'%':'-')+'</td></tr>';
    });
    h += '</tbody></table></div></div>';

    // AGC/AVC placeholder
    h += '<div class="card" style="margin-top:14px"><div class="card-header"><span class="ct">AGC/AVC 控制接口</span><span class="cn">本期仅做下发，不实现算法（决策16）</span></div>';
    h += '<div class="card-body"><div style="padding:20px;text-align:center;color:var(--t3)">';
    h += '<div style="font-size:28px;margin-bottom:10px">⚙</div>';
    h += '<div>有功/无功自动控制（AGC/AVC）接口预留</div>';
    h += '<div style="font-size:13px;margin-top:6px">详细算法与策略在 v2 详细设计中展开</div>';
    h += '</div></div></div>';
    break;
  }

  // --- 水电站自动化 > 视频监控 ---
  case 'hydroVideo': {
    const SM = window.SMART_MONITOR_DATA || {};
    const qwCamerasRaw = SM.qwCameraList || {};
    const cameras = qwCamerasRaw.body && qwCamerasRaw.body.records ? qwCamerasRaw.body.records : (Array.isArray(qwCamerasRaw) ? qwCamerasRaw : []);
    const companyTree = SM.companyTree || [];

    const stations = [];
    function walkCamTree(nodes, parent) {
      (nodes||[]).forEach(n => {
        if (n.stationId && n.stationId > 0) stations.push({...n, parentName: parent});
        if (n.children) walkCamTree(n.children, n.companyName);
      });
    }
    walkCamTree(companyTree, '');
    const stMap = {};
    stations.forEach(s => { stMap[s.companyCode] = s; });

    const grouped = {};
    cameras.forEach(c => {
      const code = c.stationCode || c.companyCode || '其他';
      if (!grouped[code]) grouped[code] = [];
      grouped[code].push(c);
    });
    const groups = Object.entries(grouped);

    h += '<div class="page-title">水电站自动化 · 视频监视</div>';
    h += '<div class="page-sub">共 '+cameras.length+' 路摄像头 &nbsp;|&nbsp; '+groups.length+' 个站点 &nbsp;|&nbsp; 萤石云接入（决策10）</div>';

    h += '<div class="mgrid">';
    groups.forEach(([code, cams]) => {
      const st = stMap[code] || {};
      h += '<div class="card"><div class="card-header"><span class="ct">'+esc(st.companyName||st.parentName||code)+'</span><span class="cn">'+cams.length+' 路</span></div>';
      h += '<div class="card-body"><table class="tbl"><thead><tr><th>摄像头名称</th><th>编码</th><th>类型</th><th>状态</th></tr></thead><tbody>';
      cams.slice(0, 6).forEach(c => {
        const name = c.cameraName || c.name || c.indexCode || '-';
        const idx = c.indexCode || c.cameraIndexCode || '-';
        const type = c.cameraTypeName || c.cameraType || '-';
        const online = c.online !== undefined ? (c.online===1||c.online===true?'在线':'离线') : '-';
        h += '<tr><td>'+esc(name)+'</td><td style="font-family:var(--fd);font-size:13px">'+esc(String(idx).substring(0,16))+'...</td><td>'+esc(type)+'</td><td>'+statusBadge(online==='在线'?'end':'progress')+'</td></tr>';
      });
      h += '</tbody></table></div></div>';
    });
    h += '</div>';
    break;
  }

  // --- 水电站自动化 > 消息 ---
  case 'hydroMessages': {
    const SM = window.SMART_MONITOR_DATA || {};
    const am = SM.alarmMessages_JJY || {};
    const messages = am.records || [];

    h += '<div class="page-title">水电站自动化 · 消息中心</div>';
    h += '<div class="page-sub">全部消息共 '+((am.total||0).toLocaleString())+' 条 &nbsp;|&nbsp; 消息中心统一 type 字段区分（决策8）</div>';

    h += '<div class="kpi-row">';
    h += '<div class="kpi good"><div class="kl">消息总数</div><div class="kv">'+((am.total||0).toLocaleString())+'</div><div class="ks">告警/SOE/指令/私信/通知</div></div>';
    h += '<div class="kpi"><div class="kl">当前展示</div><div class="kv">'+messages.length+'</div><div class="ks">最近记录</div></div>';
    h += '<div class="kpi"><div class="kl">消息类型</div><div class="kv">5</div><div class="ks">统一消息模型</div></div>';
    h += '<div class="kpi"><div class="kl">推送通道</div><div class="kv">3</div><div class="ks">Web/短信/App</div></div>';
    h += '</div>';

    h += '<div class="card"><div class="card-header"><span class="ct">消息列表 · 最近记录</span><span class="cn">共 '+((am.total||0).toLocaleString())+' 条</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>消息内容</th><th>电站</th><th>等级</th><th>时间</th><th>类型</th><th>状态</th></tr></thead><tbody>';
    messages.forEach(m => {
      const at = m.alarmTime ? new Date(parseInt(m.alarmTime)*1000).toISOString().slice(0,16).replace('T',' ') : '-';
      const rt = m.resetTime ? new Date(parseInt(m.resetTime)*1000).toISOString().slice(0,16).replace('T',' ') : '-';
      const status = m.resetTime ? 'end' : 'open';
      h += '<tr><td>'+esc(m.content||'-')+'</td><td>'+esc(m.companyName||'-')+'</td><td>'+levelBadge(m.level)+'</td><td class="date-col">'+at+'</td><td>告警消息</td><td>'+statusBadge(status)+'</td></tr>';
    });
    h += '</tbody></table></div></div>';
    break;
  }

  // --- 水电站自动化 > 故障告警 ---
  case 'hydroAlarm': {
    const SM = window.SMART_MONITOR_DATA || {};
    const am = SM.alarmMessages_JJY || {};
    const ae = SM.alarmEvents_JJY || {};
    const messages = am.records || [];
    const events = ae.records || [];

    h += '<div class="page-title">水电站自动化 · 故障告警</div>';
    h += '<div class="page-sub">告警消息共 '+((am.total||0).toLocaleString())+' 条 &nbsp;|&nbsp; 告警事件共 '+((ae.total||0).toLocaleString())+' 条 &nbsp;|&nbsp; 告警引擎 一区主备（决策18）</div>';

    h += '<div class="kpi-row">';
    h += '<div class="kpi good"><div class="kl">告警消息总数</div><div class="kv">'+((am.total||0).toLocaleString())+'</div><div class="ks">全部历史消息</div></div>';
    h += '<div class="kpi"><div class="kl">告警事件总数</div><div class="kv">'+((ae.total||0).toLocaleString())+'</div><div class="ks">全部历史事件</div></div>';
    h += '<div class="kpi"><div class="kl">当前展示消息</div><div class="kv">'+messages.length+'</div><div class="ks">最近记录</div></div>';
    h += '<div class="kpi"><div class="kl">当前展示事件</div><div class="kv">'+events.length+'</div><div class="ks">最近记录</div></div>';
    h += '</div>';

    h += '<div class="mgrid">';
    h += '<div class="card"><div class="card-header"><span class="ct">告警消息 · 最近记录</span><span class="cn">共 '+((am.total||0).toLocaleString())+' 条</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>告警内容</th><th>电站</th><th>等级</th><th>告警时间</th><th>恢复时间</th><th>状态</th></tr></thead><tbody>';
    messages.forEach(m => {
      const at = m.alarmTime ? new Date(parseInt(m.alarmTime)*1000).toISOString().slice(0,16).replace('T',' ') : '-';
      const rt = m.resetTime ? new Date(parseInt(m.resetTime)*1000).toISOString().slice(0,16).replace('T',' ') : '-';
      const status = m.resetTime ? 'end' : 'open';
      h += '<tr><td>'+esc(m.content||'-')+'</td><td>'+esc(m.companyName||'-')+'</td><td>'+levelBadge(m.level)+'</td><td class="date-col">'+at+'</td><td class="date-col">'+rt+'</td><td>'+statusBadge(status)+'</td></tr>';
    });
    h += '</tbody></table></div></div>';

    h += '<div class="card"><div class="card-header"><span class="ct">告警事件 · 最近记录</span><span class="cn">共 '+((ae.total||0).toLocaleString())+' 条</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>事件内容</th><th>电站</th><th>事件类型</th><th>等级</th><th>事件时间</th></tr></thead><tbody>';
    events.forEach(e => {
      const et = e.eventTime ? new Date(parseInt(e.eventTime)*1000).toISOString().slice(0,16).replace('T',' ') : '-';
      h += '<tr><td>'+esc(e.content||'-')+'</td><td>'+esc(e.companyName||'-')+'</td><td>'+esc(e.eventTypeDesc||e.eventType||'-')+'</td><td>'+levelBadge(e.level)+'</td><td class="date-col">'+et+'</td></tr>';
    });
    h += '</tbody></table></div></div>';
    h += '</div>';
    break;
  }

  // --- 水电站自动化 > 智能预警 ---
  case 'hydroWarning': {
    const SM = window.SMART_MONITOR_DATA || {};
    const am = SM.alarmMessages_JJY || {};
    const messages = am.records || [];
    const deviceDetail = SM.deviceDetail_JJY || {};

    h += '<div class="page-title">水电站自动化 · 智能预警</div>';
    h += '<div class="page-sub">预警类型：开机预警 / 泄洪预警 / 超温预警 / 消防预警 &nbsp;|&nbsp; 三区智能预警引擎</div>';

    h += '<div class="kpi-row">';
    h += '<div class="kpi good"><div class="kl">预警规则</div><div class="kv">4</div><div class="ks">大类预警</div></div>';
    h += '<div class="kpi"><div class="kl">关联告警</div><div class="kv">'+((am.total||0).toLocaleString())+'</div><div class="ks">历史消息</div></div>';
    h += '<div class="kpi"><div class="kl">当前活跃</div><div class="kv">'+messages.filter(function(m){return !m.resetTime;}).length+'</div><div class="ks">未恢复告警</div></div>';
    h += '<div class="kpi"><div class="kl">预警引擎</div><div class="kv" style="color:var(--green)">运行中</div><div class="ks">三区</div></div>';
    h += '</div>';

    // Warning type cards
    h += '<div class="mgrid">';
    const warningTypes = [
      {name:'开机预警',desc:'机组启动过程中的异常工况检测',icon:'🔔',color:'var(--accent2)'},
      {name:'泄洪预警',desc:'水位超限与闸门操作安全预警',icon:'🌊',color:'var(--accent)'},
      {name:'超温预警',desc:'轴承瓦温/油温/线圈温度异常',icon:'🌡',color:'var(--orange)'},
      {name:'消防预警',desc:'烟雾/火警/消防系统故障检测',icon:'🔥',color:'var(--red)'},
    ];
    warningTypes.forEach(function(w) {
      h += '<div class="card"><div class="card-header"><span class="ct">'+w.icon+' '+w.name+'</span><span class="cn">三区引擎</span></div>';
      h += '<div class="card-body" style="min-height:120px">';
      h += '<div style="font-size:14px;color:var(--t2);margin-bottom:8px">'+w.desc+'</div>';
      h += '<div style="font-size:13px;color:var(--t3)">预警阈值与滞回带在 v2 详细设计中定义</div>';
      h += '<div style="margin-top:8px;padding:8px 12px;background:rgba(30,144,255,0.08);border-left:3px solid '+w.color+';font-size:13px;color:var(--t2)">状态：监控中</div>';
      h += '</div></div>';
    });
    h += '</div>';
    break;
  }

  // --- 水电站自动化 > 安全感知 ---
  case 'hydroSafety': {
    const SM = window.SMART_MONITOR_DATA || {};
    const analyse = SM.companyAnalyse_JME || [];
    const deviceDetail = SM.deviceDetail_JJY || {};

    h += '<div class="page-title">水电站自动化 · 安全感知</div>';
    h += '<div class="page-sub">实时感知电站安全状态 &nbsp;|&nbsp; 数据来源：一区 Redis 当前值 + 四区业务库</div>';

    // Safety perception KPIs
    h += '<div class="kpi-row">';
    h += '<div class="kpi good"><div class="kl">安全运行天数</div><div class="kv">--</div><div class="ks">集控中心</div></div>';
    h += '<div class="kpi"><div class="kl">在线电站</div><div class="kv">'+analyse.filter(function(s){return parseFloat(s.normalNum)>0;}).length+'</div><div class="ks">/ '+analyse.length+' 中心</div></div>';
    h += '<div class="kpi"><div class="kl">安全事件</div><div class="kv">0</div><div class="ks">今日</div></div>';
    h += '<div class="kpi"><div class="kl">闭锁条件</div><div class="kv" style="color:var(--green)">正常</div><div class="ks">配置同步（决策27）</div></div>';
    h += '</div>';

    // Device safety grid
    h += '<div class="mgrid">';
    h += '<div class="card"><div class="card-header"><span class="ct">设备安全状态</span><span class="cn">来自一区设备实时数据</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>电站</th><th>正常台数</th><th>停机台数</th><th>安全状态</th></tr></thead><tbody>';
    analyse.slice(0, 10).forEach(function(s) {
      const normal = parseFloat(s.normalNum)||0;
      const qs = parseFloat(s.qsNum)||0;
      const status = normal > 0 ? 'end' : 'progress';
      h += '<tr><td>'+esc(s.stationName||'-')+'</td><td style="font-family:var(--fd);color:var(--green)">'+normal+'</td><td style="font-family:var(--fd)">'+qs+'</td><td>'+statusBadge(status)+'</td></tr>';
    });
    h += '</tbody></table></div></div>';

    // Safety control panel placeholder
    h += '<div class="card"><div class="card-header"><span class="ct">三方式控制权限</span><span class="cn">现地 > 电站 > 集控（决策6）</span></div>';
    h += '<div class="card-body" style="min-height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center">';
    h += '<div style="display:flex;gap:30px;align-items:center">';
    h += '<div style="text-align:center;padding:16px;background:var(--zone1);border-radius:8px;min-width:80px"><div style="font-size:24px">🏭</div><div style="font-size:14px">现地</div><div style="font-size:12px;color:var(--green)">最高优先</div></div>';
    h += '<div style="font-size:24px;color:var(--t3)">></div>';
    h += '<div style="text-align:center;padding:16px;background:var(--zone2);border-radius:8px;min-width:80px"><div style="font-size:24px">🏗</div><div style="font-size:14px">电站</div><div style="font-size:12px;color:var(--t2)">中优先</div></div>';
    h += '<div style="font-size:24px;color:var(--t3)">></div>';
    h += '<div style="text-align:center;padding:16px;background:var(--zone3);border-radius:8px;min-width:80px"><div style="font-size:24px">🖥</div><div style="font-size:14px">集控</div><div style="font-size:12px;color:var(--t3)">低优先</div></div>';
    h += '</div>';
    h += '<div style="margin-top:14px;font-size:13px;color:var(--t3)">无扰动切换、唯一性校验（决策6）</div>';
    h += '</div></div>';
    h += '</div>';
    break;
  }

  // ============================================================
  // ========== 智能监控 > 闸门 ==========
  // ============================================================

  // --- 闸门 > 主页 ---
  case 'gateMain': {
    const SM = window.SMART_MONITOR_DATA || {};
    const analyse = SM.companyAnalyse_JME || [];

    h += '<div class="page-title">闸门监控 · 运行监视</div>';
    h += '<div class="page-sub">闸门/清污机/生态下泄流量 &nbsp;|&nbsp; 复用自动化框架 &nbsp;|&nbsp; 点模型归 v2 详细设计</div>';

    h += '<div class="kpi-row">';
    h += '<div class="kpi good"><div class="kl">闸门总数</div><div class="kv">--</div><div class="ks">待v2点模型</div></div>';
    h += '<div class="kpi"><div class="kl">在线数</div><div class="kv">--</div><div class="ks">监控中</div></div>';
    h += '<div class="kpi"><div class="kl">操作次数</div><div class="kv">0</div><div class="ks">今日</div></div>';
    h += '<div class="kpi"><div class="kl">安全状态</div><div class="kv" style="color:var(--green)">正常</div><div class="ks">无异常</div></div>';
    h += '</div>';

    // Gate overview cards
    h += '<div class="mgrid">';
    h += '<div class="card"><div class="card-header"><span class="ct">闸门状态总览</span><span class="cn">点模型在 v2 详细设计</span></div>';
    h += '<div class="card-body" style="min-height:250px;display:flex;flex-direction:column;align-items:center;justify-content:center">';
    h += '<div style="font-size:48px;margin-bottom:10px">🚪</div>';
    h += '<div style="font-size:16px;color:var(--t2)">闸门监控数据接入中</div>';
    h += '<div style="font-size:13px;color:var(--t3);margin-top:6px">闸门点表模板、控制模型在 v2 详细设计阶段完善</div>';
    h += '<div style="margin-top:14px;padding:8px 16px;background:rgba(30,144,255,0.08);border-left:3px solid var(--accent);font-size:13px;color:var(--t2)">架构已预留：四区 Web 复用自动化框架（§9.1）</div>';
    h += '</div></div>';

    h += '<div class="card"><div class="card-header"><span class="ct">关联电站</span><span class="cn">'+analyse.length+' 个运维中心</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>运维中心</th><th>装机(kW)</th><th>正常台数</th><th>状态</th></tr></thead><tbody>';
    analyse.slice(0, 8).forEach(function(s) {
      const normal = parseFloat(s.normalNum)||0;
      const status = normal > 0 ? 'end' : 'progress';
      h += '<tr><td>'+esc(s.stationName||'-')+'</td><td style="font-family:var(--fd)">'+esc(s.zyggl||'-')+'</td><td style="font-family:var(--fd)">'+esc(s.normalNum||'-')+'</td><td>'+statusBadge(status)+'</td></tr>';
    });
    h += '</tbody></table></div></div>';
    h += '</div>';
    break;
  }

  // --- 闸门 > 视频监控 ---
  case 'gateVideo': {
    const SM = window.SMART_MONITOR_DATA || {};
    const qwCamerasRaw = SM.qwCameraList || {};
    const cameras = qwCamerasRaw.body && qwCamerasRaw.body.records ? qwCamerasRaw.body.records : (Array.isArray(qwCamerasRaw) ? qwCamerasRaw : []);

    h += '<div class="page-title">闸门 · 视频监视</div>';
    h += '<div class="page-sub">共 '+cameras.length+' 路摄像头 &nbsp;|&nbsp; 萤石云接入 &nbsp;|&nbsp; 闸门区域视频</div>';

    h += '<div class="card"><div class="card-header"><span class="ct">摄像头列表</span><span class="cn">'+cameras.length+' 路</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>摄像头名称</th><th>所属电站</th><th>编码</th><th>状态</th></tr></thead><tbody>';
    cameras.slice(0, 12).forEach(function(c) {
      const name = c.cameraName || c.name || c.indexCode || '-';
      const idx = c.indexCode || c.cameraIndexCode || '-';
      const online = c.online !== undefined ? (c.online===1||c.online===true?'在线':'离线') : '-';
      h += '<tr><td>'+esc(name)+'</td><td>'+esc(c.companyName||'-')+'</td><td style="font-family:var(--fd);font-size:13px">'+esc(String(idx).substring(0,16))+'...</td><td>'+statusBadge(online==='在线'?'end':'progress')+'</td></tr>';
    });
    h += '</tbody></table></div></div>';
    break;
  }

  // --- 闸门 > 故障告警 ---
  case 'gateAlarm': {
    const SM = window.SMART_MONITOR_DATA || {};
    const am = SM.alarmMessages_JJY || {};
    const messages = am.records || [];

    h += '<div class="page-title">闸门 · 故障告警</div>';
    h += '<div class="page-sub">告警消息共 '+((am.total||0).toLocaleString())+' 条 &nbsp;|&nbsp; 一区告警引擎 主备</div>';

    h += '<div class="kpi-row">';
    h += '<div class="kpi good"><div class="kl">告警总数</div><div class="kv">'+((am.total||0).toLocaleString())+'</div><div class="ks">全部类型</div></div>';
    h += '<div class="kpi"><div class="kl">当前展示</div><div class="kv">'+messages.length+'</div><div class="ks">最近记录</div></div>';
    h += '<div class="kpi"><div class="kl">闸门相关</div><div class="kv">--</div><div class="ks">待分类</div></div>';
    h += '<div class="kpi"><div class="kl">告警引擎</div><div class="kv" style="color:var(--green)">运行中</div><div class="ks">一区主备</div></div>';
    h += '</div>';

    h += '<div class="card"><div class="card-header"><span class="ct">告警消息列表</span><span class="cn">共 '+((am.total||0).toLocaleString())+' 条</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>告警内容</th><th>电站</th><th>等级</th><th>告警时间</th><th>状态</th></tr></thead><tbody>';
    messages.forEach(function(m) {
      const at = m.alarmTime ? new Date(parseInt(m.alarmTime)*1000).toISOString().slice(0,16).replace('T',' ') : '-';
      const status = m.resetTime ? 'end' : 'open';
      h += '<tr><td>'+esc(m.content||'-')+'</td><td>'+esc(m.companyName||'-')+'</td><td>'+levelBadge(m.level)+'</td><td class="date-col">'+at+'</td><td>'+statusBadge(status)+'</td></tr>';
    });
    h += '</tbody></table></div></div>';
    break;
  }

  // --- 闸门 > 智能预警 ---
  case 'gateWarning': {
    h += '<div class="page-title">闸门 · 智能预警</div>';
    h += '<div class="page-sub">闸门操作安全预警 &nbsp;|&nbsp; 三区智能预警引擎 &nbsp;|&nbsp; 泄洪预警</div>';

    h += '<div class="kpi-row">';
    h += '<div class="kpi good"><div class="kl">预警规则</div><div class="kv">2</div><div class="ks">泄洪/超水位</div></div>';
    h += '<div class="kpi"><div class="kl">当前活跃</div><div class="kv">0</div><div class="ks">无预警</div></div>';
    h += '<div class="kpi"><div class="kl">预警引擎</div><div class="kv" style="color:var(--green)">运行中</div><div class="ks">三区</div></div>';
    h += '<div class="kpi"><div class="kl">安全状态</div><div class="kv" style="color:var(--green)">正常</div><div class="ks">所有闸门</div></div>';
    h += '</div>';

    h += '<div class="card"><div class="card-header"><span class="ct">预警类型</span><span class="cn">闸门专项</span></div>';
    h += '<div class="card-body" style="min-height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center">';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;width:100%;max-width:500px">';
    h += '<div style="padding:16px;background:rgba(255,145,0,0.08);border:1px solid rgba(255,145,0,0.2);border-radius:8px"><div style="font-size:20px">🌊</div><div style="font-size:15px;font-weight:600;margin:6px 0">泄洪预警</div><div style="font-size:13px;color:var(--t3)">水位超限自动检测</div><div style="font-size:12px;color:var(--green);margin-top:4px">状态：监控中</div></div>';
    h += '<div style="padding:16px;background:rgba(30,144,255,0.08);border:1px solid rgba(30,144,255,0.2);border-radius:8px"><div style="font-size:20px">⚠</div><div style="font-size:15px;font-weight:600;margin:6px 0">操作安全预警</div><div style="font-size:13px;color:var(--t3)">闸门异常操作检测</div><div style="font-size:12px;color:var(--green);margin-top:4px">状态：监控中</div></div>';
    h += '</div>';
    h += '<div style="margin-top:16px;font-size:13px;color:var(--t3)">详细预警阈值与策略在 v2 详细设计中定义</div>';
    h += '</div></div>';
    break;
  }

  // --- 闸门 > 安全感知 ---
  case 'gateSafety': {
    h += '<div class="page-title">闸门 · 安全感知</div>';
    h += '<div class="page-sub">闸门运行安全状态实时感知 &nbsp;|&nbsp; 闭锁条件 &nbsp;|&nbsp; 三方式控制</div>';

    h += '<div class="kpi-row">';
    h += '<div class="kpi good"><div class="kl">安全运行天数</div><div class="kv">--</div><div class="ks">无事故运行</div></div>';
    h += '<div class="kpi"><div class="kl">闭锁条件</div><div class="kv" style="color:var(--green)">正常</div><div class="ks">配置同步（决策27）</div></div>';
    h += '<div class="kpi"><div class="kl">控制权限</div><div class="kv">集控</div><div class="ks">现地>电站>集控</div></div>';
    h += '<div class="kpi"><div class="kl">操作记录</div><div class="kv">0</div><div class="ks">今日</div></div>';
    h += '</div>';

    // Control state machine
    h += '<div class="card"><div class="card-header"><span class="ct">控制状态机</span><span class="cn">三方式控制权限（决策6）</span></div>';
    h += '<div class="card-body" style="min-height:150px;padding:24px;text-align:center">';
    h += '<div style="display:flex;gap:20px;align-items:center;justify-content:center;flex-wrap:wrap">';
    h += '<div class="sm-state sm-active">现地优先</div>';
    h += '<div class="sm-arrow">→</div>';
    h += '<div class="sm-state">电站控制</div>';
    h += '<div class="sm-arrow">→</div>';
    h += '<div class="sm-state sm-inactive">集控控制</div>';
    h += '</div>';
    h += '<div style="margin-top:14px;font-size:13px;color:var(--t3)">闸门控制遵循统一的三方式控制权限模型</div>';
    h += '</div></div>';
    break;
  }

  // ============================================================
  // ========== 智能监控 > 清污机 ==========
  // ============================================================

  // --- 清污机 > 主页 ---
  case 'trashMain': {
    h += '<div class="page-title">清污机 · 运行监视</div>';
    h += '<div class="page-sub">清污机/生态下泄流量 &nbsp;|&nbsp; 复用自动化框架 &nbsp;|&nbsp; 点模型归 v2 详细设计</div>';

    h += '<div class="kpi-row">';
    h += '<div class="kpi good"><div class="kl">清污机总数</div><div class="kv">--</div><div class="ks">待v2点模型</div></div>';
    h += '<div class="kpi"><div class="kl">运行中</div><div class="kv">--</div><div class="ks">当前</div></div>';
    h += '<div class="kpi"><div class="kl">清污次数</div><div class="kv">0</div><div class="ks">今日</div></div>';
    h += '<div class="kpi"><div class="kl">设备状态</div><div class="kv" style="color:var(--green)">正常</div><div class="ks">无故障</div></div>';
    h += '</div>';

    h += '<div class="mgrid">';
    h += '<div class="card"><div class="card-header"><span class="ct">清污机状态总览</span><span class="cn">点模型在 v2 详细设计</span></div>';
    h += '<div class="card-body" style="min-height:250px;display:flex;flex-direction:column;align-items:center;justify-content:center">';
    h += '<div style="font-size:48px;margin-bottom:10px">🗑</div>';
    h += '<div style="font-size:16px;color:var(--t2)">清污机监控数据接入中</div>';
    h += '<div style="font-size:13px;color:var(--t3);margin-top:6px">清污机点表模板、控制模型在 v2 详细设计阶段完善</div>';
    h += '<div style="margin-top:14px;padding:8px 16px;background:rgba(30,144,255,0.08);border-left:3px solid var(--accent);font-size:13px;color:var(--t2)">架构已预留：四区 Web 复用自动化框架（§9.1）</div>';
    h += '</div></div>';

    // Eco flow data since it's related
    h += '<div class="card"><div class="card-header"><span class="ct">关联：生态下泄流量</span><span class="cn">同自动化模式</span></div>';
    h += '<div class="card-body" style="min-height:250px;display:flex;flex-direction:column;align-items:center;justify-content:center">';
    h += '<div style="font-size:32px">💧</div>';
    h += '<div style="font-size:14px;color:var(--t2);margin-top:8px">生态下泄流量监测数据已就绪</div>';
    h += '<div style="font-size:13px;color:var(--t3);margin-top:4px">与清污机关联的下泄流量监控在 v2 中整合</div>';
    h += '</div></div>';
    h += '</div>';
    break;
  }

  // --- 清污机 > 视频监控 ---
  case 'trashVideo': {
    const SM = window.SMART_MONITOR_DATA || {};
    const qwCamerasRaw = SM.qwCameraList || {};
    const cameras = qwCamerasRaw.body && qwCamerasRaw.body.records ? qwCamerasRaw.body.records : (Array.isArray(qwCamerasRaw) ? qwCamerasRaw : []);

    h += '<div class="page-title">清污机 · 视频监视</div>';
    h += '<div class="page-sub">共 '+cameras.length+' 路摄像头 &nbsp;|&nbsp; 萤石云接入 &nbsp;|&nbsp; 清污机区域视频</div>';

    h += '<div class="card"><div class="card-header"><span class="ct">摄像头列表</span><span class="cn">'+cameras.length+' 路</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>摄像头名称</th><th>所属电站</th><th>编码</th><th>状态</th></tr></thead><tbody>';
    cameras.slice(0, 12).forEach(function(c) {
      const name = c.cameraName || c.name || c.indexCode || '-';
      const idx = c.indexCode || c.cameraIndexCode || '-';
      const online = c.online !== undefined ? (c.online===1||c.online===true?'在线':'离线') : '-';
      h += '<tr><td>'+esc(name)+'</td><td>'+esc(c.companyName||'-')+'</td><td style="font-family:var(--fd);font-size:13px">'+esc(String(idx).substring(0,16))+'...</td><td>'+statusBadge(online==='在线'?'end':'progress')+'</td></tr>';
    });
    h += '</tbody></table></div></div>';
    break;
  }

  // --- 清污机 > 故障告警 ---
  case 'trashAlarm': {
    const SM = window.SMART_MONITOR_DATA || {};
    const am = SM.alarmMessages_JJY || {};
    const messages = am.records || [];

    h += '<div class="page-title">清污机 · 故障告警</div>';
    h += '<div class="page-sub">告警消息共 '+((am.total||0).toLocaleString())+' 条 &nbsp;|&nbsp; 一区告警引擎 主备</div>';

    h += '<div class="kpi-row">';
    h += '<div class="kpi good"><div class="kl">告警总数</div><div class="kv">'+((am.total||0).toLocaleString())+'</div><div class="ks">全部类型</div></div>';
    h += '<div class="kpi"><div class="kl">当前展示</div><div class="kv">'+messages.length+'</div><div class="ks">最近记录</div></div>';
    h += '<div class="kpi"><div class="kl">清污机相关</div><div class="kv">--</div><div class="ks">待分类</div></div>';
    h += '<div class="kpi"><div class="kl">告警引擎</div><div class="kv" style="color:var(--green)">运行中</div><div class="ks">一区主备</div></div>';
    h += '</div>';

    h += '<div class="card"><div class="card-header"><span class="ct">告警消息列表</span><span class="cn">共 '+((am.total||0).toLocaleString())+' 条</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>告警内容</th><th>电站</th><th>等级</th><th>告警时间</th><th>状态</th></tr></thead><tbody>';
    messages.forEach(function(m) {
      const at = m.alarmTime ? new Date(parseInt(m.alarmTime)*1000).toISOString().slice(0,16).replace('T',' ') : '-';
      const status = m.resetTime ? 'end' : 'open';
      h += '<tr><td>'+esc(m.content||'-')+'</td><td>'+esc(m.companyName||'-')+'</td><td>'+levelBadge(m.level)+'</td><td class="date-col">'+at+'</td><td>'+statusBadge(status)+'</td></tr>';
    });
    h += '</tbody></table></div></div>';
    break;
  }

  // --- 清污机 > 智能预警 ---
  case 'trashWarning': {
    h += '<div class="page-title">清污机 · 智能预警</div>';
    h += '<div class="page-sub">清污机运行异常预警 &nbsp;|&nbsp; 三区智能预警引擎 &nbsp;|&nbsp; 堵塞/过载预警</div>';

    h += '<div class="kpi-row">';
    h += '<div class="kpi good"><div class="kl">预警规则</div><div class="kv">2</div><div class="ks">堵塞/过载</div></div>';
    h += '<div class="kpi"><div class="kl">当前活跃</div><div class="kv">0</div><div class="ks">无预警</div></div>';
    h += '<div class="kpi"><div class="kl">预警引擎</div><div class="kv" style="color:var(--green)">运行中</div><div class="ks">三区</div></div>';
    h += '<div class="kpi"><div class="kl">设备状态</div><div class="kv" style="color:var(--green)">正常</div><div class="ks">所有清污机</div></div>';
    h += '</div>';

    h += '<div class="card"><div class="card-header"><span class="ct">预警类型</span><span class="cn">清污机专项</span></div>';
    h += '<div class="card-body" style="min-height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center">';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;width:100%;max-width:500px">';
    h += '<div style="padding:16px;background:rgba(255,23,68,0.08);border:1px solid rgba(255,23,68,0.2);border-radius:8px"><div style="font-size:20px">🔄</div><div style="font-size:15px;font-weight:600;margin:6px 0">堵塞预警</div><div style="font-size:13px;color:var(--t3)">清污机栅前栅后水位差</div><div style="font-size:12px;color:var(--green);margin-top:4px">状态：监控中</div></div>';
    h += '<div style="padding:16px;background:rgba(255,145,0,0.08);border:1px solid rgba(255,145,0,0.2);border-radius:8px"><div style="font-size:20px">⚡</div><div style="font-size:15px;font-weight:600;margin:6px 0">过载预警</div><div style="font-size:13px;color:var(--t3)">电机电流/扭矩异常检测</div><div style="font-size:12px;color:var(--green);margin-top:4px">状态：监控中</div></div>';
    h += '</div>';
    h += '<div style="margin-top:16px;font-size:13px;color:var(--t3)">详细预警阈值与策略在 v2 详细设计中定义</div>';
    h += '</div></div>';
    break;
  }

  // --- 清污机 > 安全感知 ---
  case 'trashSafety': {
    h += '<div class="page-title">清污机 · 安全感知</div>';
    h += '<div class="page-sub">清污机运行安全状态实时感知 &nbsp;|&nbsp; 设备健康 &nbsp;|&nbsp; 操作安全</div>';

    h += '<div class="kpi-row">';
    h += '<div class="kpi good"><div class="kl">安全运行天数</div><div class="kv">--</div><div class="ks">无事故运行</div></div>';
    h += '<div class="kpi"><div class="kl">设备健康度</div><div class="kv" style="color:var(--green)">优秀</div><div class="ks">所有设备</div></div>';
    h += '<div class="kpi"><div class="kl">维护提醒</div><div class="kv">0</div><div class="ks">待处理</div></div>';
    h += '<div class="kpi"><div class="kl">操作记录</div><div class="kv">0</div><div class="ks">今日</div></div>';
    h += '</div>';

    // Safety control panel placeholder
    h += '<div class="card"><div class="card-header"><span class="ct">安全控制面板</span><span class="cn">设备安全状态监视</span></div>';
    h += '<div class="card-body" style="min-height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center">';
    h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;width:100%;max-width:450px">';
    h += '<div style="text-align:center;padding:14px;background:var(--zone2);border-radius:8px"><div style="font-size:24px">✅</div><div style="font-size:14px;margin-top:6px">机械安全</div><div style="font-size:12px;color:var(--green)">正常</div></div>';
    h += '<div style="text-align:center;padding:14px;background:var(--zone2);border-radius:8px"><div style="font-size:24px">✅</div><div style="font-size:14px;margin-top:6px">电气安全</div><div style="font-size:12px;color:var(--green)">正常</div></div>';
    h += '<div style="text-align:center;padding:14px;background:var(--zone2);border-radius:8px"><div style="font-size:24px">✅</div><div style="font-size:14px;margin-top:6px">操作安全</div><div style="font-size:12px;color:var(--green)">正常</div></div>';
    h += '</div>';
    h += '<div style="margin-top:14px;font-size:13px;color:var(--t3)">安全感知模型在 v2 详细设计中完善</div>';
    h += '</div></div>';
    break;
  }

  default:
    h += '<div class="empty-state"><div class="eicon">📄</div><div>页面开发中...</div><div style="font-size:14px;color:var(--t3);margin-top:4px">基于湖南小水电集控概要设计 v1.17</div></div>';`;

const before = content.substring(0, startIdx);
const after = content.substring(endIdx);
content = before + newCases + '\n' + after;

fs.writeFileSync('cui_test/generate-html-v3.cjs', content);
console.log('Replacement done. New length:', content.length);
