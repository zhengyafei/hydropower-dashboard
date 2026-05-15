// Add videoMonitor, alarmMgmt, ecoFlow cases before the default case
const fs = require('fs');
let src = fs.readFileSync('d:/code/hydropower-web/cui_test/generate-html-v3.cjs', 'utf8');

const newCases = `
  // ========== 智能监控 > 视频监控 ==========
  case 'videoMonitor': {
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

    h += '<div class="page-title">视频监控</div>';
    h += '<div class="page-sub">共 '+cameras.length+' 路摄像头 &nbsp;|&nbsp; '+groups.length+' 个站点</div>';

    h += '<div class="mgrid">';
    groups.forEach(([code, cams]) => {
      const st = stMap[code] || {};
      h += '<div class="card"><div class="card-header"><span class="ct">'+esc(st.companyName||st.parentName||code)+'</span><span class="cn">'+cams.length+' 路</span></div>';
      h += '<div class="card-body"><table class="tbl"><thead><tr><th>摄像头名称</th><th>编码</th><th>类型</th><th>状态</th></tr></thead><tbody>';
      cams.slice(0, 12).forEach(c => {
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

  // ========== 智能监控 > 告警管理 ==========
  case 'alarmMgmt': {
    const SM = window.SMART_MONITOR_DATA || {};
    const am = SM.alarmMessages_JJY || {};
    const ae = SM.alarmEvents_JJY || {};
    const messages = am.records || [];
    const events = ae.records || [];

    h += '<div class="page-title">告警管理</div>';
    h += '<div class="page-sub">告警消息共 '+((am.total||0).toLocaleString())+' 条 &nbsp;|&nbsp; 告警事件共 '+((ae.total||0).toLocaleString())+' 条</div>';

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

  // ========== 智能监控 > 生态流量 ==========
  case 'ecoFlow': {
    const SM = window.SMART_MONITOR_DATA || {};
    const efRaw = SM.ecoFlowList || {};
    const efRecords = (efRaw.body && efRaw.body.records) ? efRaw.body.records : (efRaw.records || []);
    const ef24h = SM.ecoFlow24h_JJY || {};

    h += '<div class="page-title">生态下泄流量</div>';
    h += '<div class="page-sub">共 '+efRecords.length+' 个监测站点 &nbsp;|&nbsp; 数据来源：生态流量监测系统</div>';

    let totalFlow = 0, onlineCount = 0;
    efRecords.forEach(r => {
      totalFlow += parseFloat(r.ecologicalFlowSum) || parseFloat(r.ecologicalFlow1) || 0;
      if (r.passStat == 1 || r.deviceStatStr == '在线') onlineCount++;
    });
    h += '<div class="kpi-row">';
    h += '<div class="kpi good"><div class="kl">监测站点数</div><div class="kv">'+efRecords.length+'</div><div class="ks">在线 '+onlineCount+' 个</div></div>';
    h += '<div class="kpi"><div class="kl">总下泄流量</div><div class="kv">'+totalFlow.toFixed(2)+'</div><div class="ks">m\\u00b3/s</div></div>';
    h += '<div class="kpi"><div class="kl">24h流量数据点</div><div class="kv">'+(ef24h.x||[]).length+'</div><div class="ks">小时级采样</div></div>';
    h += '</div>';

    h += '<div class="card"><div class="card-header"><span class="ct">生态流量监测明细</span><span class="cn">'+efRecords.length+' 个站点</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>电站名称</th><th>生态流量1</th><th>生态流量2</th><th>合计流量</th><th>设备状态</th><th>通讯状态</th><th>设备数</th></tr></thead><tbody>';
    efRecords.forEach(r => {
      const ef1 = r.ecologicalFlow1 != null ? parseFloat(r.ecologicalFlow1).toFixed(3) : '-';
      const ef2 = r.ecologicalFlow2 != null ? parseFloat(r.ecologicalFlow2).toFixed(3) : '-';
      const efs = r.ecologicalFlowSum != null ? parseFloat(r.ecologicalFlowSum).toFixed(3) : '-';
      const status = r.passStat == 1 ? 'end' : 'progress';
      h += '<tr><td>'+esc(r.companyName||'-')+'</td><td style="font-family:var(--fd)">'+ef1+'</td><td style="font-family:var(--fd)">'+ef2+'</td><td style="font-family:var(--fd);color:var(--accent2);font-weight:600">'+efs+'</td><td>'+statusBadge(status)+'</td><td>'+esc(r.tcpStatStr||r.deviceStatStr||'-')+'</td><td>'+esc(r.deviceNum||'-')+'</td></tr>';
    });
    h += '</tbody></table></div></div>';

    if (ef24h.x && ef24h.x.length > 0) {
      h += '<div class="card" style="margin-top:14px"><div class="card-header"><span class="ct">24小时下泄流量曲线</span><span class="cn">'+ef24h.x.length+' 个数据点</span></div>';
      h += '<div class="card-body" style="max-height:200px;overflow:auto"><table class="tbl"><thead><tr><th>时间</th>';
      ef24h.x.slice(0, 24).forEach(t => { h += '<th>'+esc(String(t))+'</th>'; });
      h += '</tr></thead><tbody><tr><td style="font-weight:600">流量(m\\u00b3/s)</td>';
      (ef24h.y||[]).slice(0, 24).forEach(v => { h += '<td style="font-family:var(--fd)">'+(v!=null?parseFloat(v).toFixed(2):'-')+'</td>'; });
      h += '</tr></tbody></table></div></div>';
    }
    break;
  }

  default:`;

// Find the marker before default case
const oldDefault = `  default:
    h += '<div class="empty-state">`;

if (src.includes(oldDefault)) {
  src = src.replace(oldDefault, newCases.trimStart());
  fs.writeFileSync('d:/code/hydropower-web/cui_test/generate-html-v3.cjs', src, 'utf8');
  console.log('New cases (videoMonitor, alarmMgmt, ecoFlow) added. New length:', src.length);
} else {
  console.log('ERROR: default marker NOT FOUND');
  // Print lines around default
  const lines = src.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === 'default:') {
      console.log('Found default at line', i+1);
      console.log('Prev:', JSON.stringify(lines[i-1]));
      console.log('Curr:', JSON.stringify(lines[i]));
      console.log('Next:', JSON.stringify(lines[i+1]));
      break;
    }
  }
}
