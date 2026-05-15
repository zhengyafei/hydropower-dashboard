const fs = require('fs');
let content = fs.readFileSync('cui_test/generate-html-v3.cjs', 'utf8');

// Find the line with "default:" followed by empty-state
const lines = content.split('\n');
let defaultLine = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim() === 'default:' && lines[i+1] && lines[i+1].includes('empty-state')) {
    defaultLine = i;
    break;
  }
}
console.log('Default line:', defaultLine + 1);

// Find the closing brace and the document.getElementById line
let endLine = defaultLine + 2; // skip closing brace line
for (let i = defaultLine + 2; i < lines.length; i++) {
  if (lines[i].includes("document.getElementById('contentRoot')")) {
    endLine = i - 1; // the line before (closing brace)
    break;
  }
}
console.log('End line:', endLine + 1, ':', lines[endLine]);

// Build the new cases
const newCode = `  // ========== 智能监控 > 智能发电 ==========
  case 'smartPower': {
    const SM = window.SMART_MONITOR_DATA || {};
    const fdl1 = (SM.subCompanyDetail_JT || [])[0] || [];
    const fdl2 = (SM.subCompanyDetail_JT || [])[1] || [];
    const analyse = SM.companyAnalyse_JME || [];
    const planRate = SM.planCompleteRate_JT || [];
    const useHours = SM.useHours_JT || [];

    let totalGen = 0, totalCap = 0, totalStations = 0;
    analyse.forEach(s => {
      totalGen += parseFloat(s.jrfdl) || 0;
      totalCap += parseFloat(s.zyggl) || 0;
      totalStations += parseFloat(s.normalNum) || 0;
    });

    h += '<div class="page-title">智能发电 · 实时监控</div>';
    h += '<div class="page-sub">数据时间：2026-05-14 &nbsp;|&nbsp; 江河集控中心</div>';

    h += '<div class="kpi-row">';
    h += '<div class="kpi good"><div class="kl">今日发电量 (万kWh)</div><div class="kv">'+totalGen.toFixed(2)+'</div><div class="ks">覆盖 '+totalStations.toFixed(0)+' 个电站</div></div>';
    h += '<div class="kpi"><div class="kl">总装机容量 (kW)</div><div class="kv">'+totalCap.toLocaleString()+'</div><div class="ks">'+analyse.length+' 个运维中心</div></div>';
    h += '<div class="kpi"><div class="kl">月累计发电量 (万kWh)</div><div class="kv">'+(analyse.reduce((s,a)=>s+(parseFloat(a.dzyfdl)||0),0)).toFixed(0)+'</div><div class="ks">年累计 '+analyse.reduce((s,a)=>s+(parseFloat(a.dznfdl)||0),0).toFixed(0)+' 万kWh</div></div>';
    h += '<div class="kpi"><div class="kl">计划完成率</div><div class="kv">'+(fdl2.length>0?fdl2[0][2]:0)+'%</div><div class="ks">年度累计</div></div>';
    h += '<div class="kpi"><div class="kl">在线电站</div><div class="kv">'+totalStations.toFixed(0)+'</div><div class="ks">/ '+analyse.length+' 中心</div></div>';
    h += '<div class="kpi"><div class="kl">利用小时数</div><div class="kv">'+(useHours.length>0?(useHours[0].y||[]).reduce((s,v)=>s+v,0):0)+'</div><div class="ks">2026年累计</div></div>';
    h += '</div>';

    h += '<div class="mgrid">';
    h += '<div class="card"><div class="card-header"><span class="ct">运维中心发电量排名</span><span class="cn">月累计 · 万kWh</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>排名</th><th>运维中心</th><th>月发电量</th><th>装机容量</th><th>完成率</th></tr></thead><tbody>';
    if (fdl1.length > 0) {
      fdl1.forEach((item, i) => {
        const cap = fdl2.length > i ? fdl2[i][1] : '-';
        const rate = fdl2.length > i ? fdl2[i][2] : '-';
        h += '<tr><td>'+(i+1)+'</td><td>'+esc(item[0])+'</td><td style="font-family:var(--fd);color:var(--accent2);font-weight:600">'+(item[1]!=null?Number(item[1]).toFixed(2):'-')+'</td><td style="font-family:var(--fd)">'+(cap!=null?Number(cap).toLocaleString():'-')+'</td><td>'+rate+'%</td></tr>';
      });
    }
    h += '</tbody></table></div></div>';

    h += '<div class="card"><div class="card-header"><span class="ct">电站运行明细</span><span class="cn">'+analyse.length+' 个电站</span></div>';
    h += '<div class="card-body"><table class="tbl"><thead><tr><th>电站名称</th><th>装机(kW)</th><th>今日发电</th><th>昨日发电</th><th>月累计</th><th>年累计</th></tr></thead><tbody>';
    analyse.slice(0, 20).forEach(s => {
      h += '<tr><td>'+esc(s.stationName||'-')+'</td><td style="font-family:var(--fd)">'+esc(s.zyggl||'-')+'</td><td style="font-family:var(--fd);color:var(--accent2)">'+esc(s.jrfdl||'-')+'</td><td style="font-family:var(--fd)">'+esc(s.zrfdl||'-')+'</td><td style="font-family:var(--fd)">'+esc(s.dzyfdl||'-')+'</td><td style="font-family:var(--fd)">'+esc(s.dznfdl||'-')+'</td></tr>';
    });
    h += '</tbody></table></div></div>';
    h += '</div>';

    h += '<div class="mgrid">';
    h += '<div class="card"><div class="card-header"><span class="ct">计划完成率趋势</span><span class="cn">月度累计 %</span></div>';
    h += '<div class="card-body" style="max-height:220px;overflow:auto"><table class="tbl"><thead><tr><th>年份</th><th>1月</th><th>2月</th><th>3月</th><th>4月</th><th>5月</th><th>6月</th><th>7月</th><th>8月</th><th>9月</th><th>10月</th><th>11月</th><th>12月</th></tr></thead><tbody>';
    planRate.forEach(p => {
      h += '<tr><td style="font-weight:600">'+esc(p.name)+'</td>';
      (p.y||[]).forEach(v => { h += '<td style="font-family:var(--fd)">'+(v!=null?v:'-')+'</td>'; });
      h += '</tr>';
    });
    h += '</tbody></table></div></div>';

    h += '<div class="card"><div class="card-header"><span class="ct">利用小时数 & 利用率</span><span class="cn">月度统计</span></div>';
    h += '<div class="card-body" style="max-height:220px;overflow:auto"><table class="tbl"><thead><tr><th>指标</th><th>1月</th><th>2月</th><th>3月</th><th>4月</th><th>5月</th><th>6月</th><th>7月</th><th>8月</th><th>9月</th><th>10月</th><th>11月</th><th>12月</th></tr></thead><tbody>';
    useHours.forEach(u => {
      h += '<tr><td style="font-weight:600">'+esc(u.name)+'</td>';
      (u.y||[]).forEach(v => { h += '<td style="font-family:var(--fd)">'+(v||0)+'</td>'; });
      h += '</tr>';
    });
    h += '</tbody></table></div></div>';
    h += '</div>';
    break;
  }

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

  default:
    h += '<div class="empty-state"><div class="eicon">📄</div><div>页面开发中...</div><div style="font-size:14px;color:var(--t3);margin-top:4px">基于湖南小水电集控概要设计 v1.17</div></div>';
  }`;

// Replace lines defaultLine through endLine with newCode
const before = lines.slice(0, defaultLine).join('\n');
const after = lines.slice(endLine + 1).join('\n');
content = before + '\n' + newCode + '\n' + after;

fs.writeFileSync('cui_test/generate-html-v3.cjs', content);
console.log('Replacement done. New file length:', content.length);
