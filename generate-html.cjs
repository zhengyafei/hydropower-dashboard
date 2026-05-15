const fs = require('fs');

// Read prepared data
const dataJs = fs.readFileSync('cui_test/har_embed_data.js', 'utf8');

// We'll write a massive HTML file. Let me compose it piece by piece.

const CSS = `:root {
  --bg-deep: #060d17; --bg-sidebar: #0a1525; --bg-card: #0e1a2e; --bg-card2: #111d33;
  --b: rgba(0,190,255,0.1); --b2: rgba(0,190,255,0.25); --accent: #00b4d8; --accent2: #0096c7;
  --t: #dde4ed; --t2: #7b8ca3; --t3: #4a5568;
  --g: #00e676; --gb: rgba(0,230,118,0.1);
  --o: #ff9100; --ob: rgba(255,145,0,0.1);
  --r: #ff3d3d; --rb: rgba(255,61,61,0.1);
  --y: #ffd600; --yb: rgba(255,214,0,0.1);
  --purp: #b49cff; --purpb: rgba(180,100,255,0.12);
  --fd: 'Rajdhani',sans-serif; --fb: 'Noto Sans SC',sans-serif;
  --sw: 230px; --hh: 54px; --rds: 6px;
}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:var(--fb);background:var(--bg-deep);color:var(--t);height:100vh;overflow:hidden;display:flex}
::selection{background:var(--accent2);color:#fff}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-thumb{background:var(--t3);border-radius:3px}

.sidebar{width:var(--sw);height:100vh;background:var(--bg-sidebar);border-right:1px solid var(--b);display:flex;flex-direction:column;flex-shrink:0;overflow-y:auto;z-index:100}
.side-logo{padding:18px 20px 14px;border-bottom:1px solid var(--b)}
.side-logo h2{font-family:var(--fd);font-size:20px;font-weight:700;letter-spacing:.05em;color:#fff}
.side-logo h2 span{color:var(--accent)}
.side-logo .sub{font-size:10px;color:var(--t2);margin-top:2px;letter-spacing:.06em}

.side-nav{padding:6px 0;flex:1}
.ng{margin-bottom:1px}
.ngh{display:flex;align-items:center;gap:9px;padding:9px 18px;cursor:pointer;font-size:13px;font-weight:500;color:var(--t2);transition:all .18s;user-select:none;border-left:2px solid transparent}
.ngh:hover{color:#fff;background:rgba(255,255,255,.03);border-left-color:var(--accent2)}
.ngh .ic{width:16px;opacity:.45;font-size:13px}
.ngh .ar{margin-left:auto;transition:transform .25s;font-size:9px;opacity:.35}
.ng.open .ngh .ar{transform:rotate(90deg);opacity:.7}
.ng.open .ngh{color:#e8edf5;border-left-color:var(--accent)}
.nc{overflow:hidden;max-height:0;transition:max-height .35s ease}
.ng.open .nc{max-height:800px}
.nci{display:flex;align-items:center;gap:8px;padding:7px 18px 7px 44px;font-size:12px;color:var(--t2);cursor:pointer;transition:all .15s;border-left:2px solid transparent}
.nci:hover{color:#fff;background:rgba(255,255,255,.03)}
.nci.active{color:var(--accent);background:rgba(0,180,216,.08);border-left-color:var(--accent);font-weight:500}
.nci .dot{width:4px;height:4px;border-radius:50%;background:var(--t3);flex-shrink:0}
.nci.active .dot{background:var(--accent);box-shadow:0 0 8px var(--accent)}

.main{flex:1;display:flex;flex-direction:column;height:100vh;overflow:hidden}
.hdr{height:var(--hh);background:var(--bg-sidebar);border-bottom:1px solid var(--b);display:flex;align-items:center;padding:0 20px;gap:14px;flex-shrink:0}
.hdr .sys{font-family:var(--fd);font-size:15px;font-weight:600;letter-spacing:.03em;color:#fff}
.hdr .sep{width:1px;height:18px;background:var(--b)}
.hdr .bc{font-size:11.5px;color:var(--t2)}
.hdr .sp{flex:1}
.hdr .clk{font-family:var(--fd);font-size:19px;font-weight:600;color:var(--accent);letter-spacing:.04em;min-width:130px;text-align:right}
.hdr .ub{display:flex;align-items:center;gap:7px;font-size:12.5px;color:var(--t)}
.hdr .ua{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,var(--accent2),var(--accent));display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:#fff}

.content{flex:1;overflow-y:auto;padding:16px 20px}
.panel{display:none}
.panel.active{display:block}

.kpi-row{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:14px}
.kpi{background:var(--bg-card);border:1px solid var(--b);border-radius:var(--rds);padding:14px 16px;transition:all .2s;cursor:default;position:relative;overflow:hidden}
.kpi::before{content:'';position:absolute;top:0;left:0;width:3px;height:100%;background:var(--accent);opacity:0;transition:opacity .2s}
.kpi:hover{border-color:var(--b2);background:var(--bg-card2);transform:translateY(-1px);box-shadow:0 6px 24px rgba(0,0,0,.5)}
.kpi:hover::before{opacity:1}
.kpi .kl{font-size:10.5px;color:var(--t2);text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px}
.kpi .kv{font-family:var(--fd);font-size:30px;font-weight:700;color:#fff;line-height:1}
.kpi .ks{font-size:10px;color:var(--t3);margin-top:3px}
.kpi.good .kv{color:var(--g)}
.kpi.warn .kv{color:var(--o)}

.mgrid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
.mgrid.asym{grid-template-columns:1fr 1fr}
.mgrid.sched-layout{grid-template-columns:1.2fr 0.8fr}

.card{background:var(--bg-card);border:1px solid var(--b);border-radius:var(--rds);display:flex;flex-direction:column;overflow:hidden}
.card.sched-row{grid-row:span 2}
.card-header{padding:10px 14px;border-bottom:1px solid var(--b);display:flex;align-items:center;gap:8px;flex-shrink:0}
.card-header .ct{font-size:12.5px;font-weight:600;color:#fff}
.card-header .cn{font-family:var(--fd);font-size:10.5px;color:var(--t2);background:rgba(255,255,255,.05);padding:2px 8px;border-radius:10px}
.card-body{flex:1;overflow-y:auto;padding:2px 0}

.tbl{width:100%;border-collapse:collapse;font-size:11.5px}
.tbl th{position:sticky;top:0;background:var(--bg-card);padding:7px 8px;font-weight:500;color:var(--t2);font-size:10px;letter-spacing:.04em;border-bottom:2px solid var(--b2);text-align:left;z-index:1}
.tbl td{padding:6px 8px;border-bottom:1px solid rgba(255,255,255,.025);color:var(--t)}
.tbl tbody tr{transition:background .15s}
.tbl tbody tr:hover{background:rgba(0,180,216,.04)}

.date-col{font-family:var(--fd);font-weight:600;color:var(--accent);font-size:12px;white-space:nowrap}
.shift-tag{display:inline-block;padding:1px 7px;border-radius:3px;font-size:10px;font-weight:500}
.s1{background:rgba(0,180,216,.15);color:#5cdbff}.s2{background:var(--ob);color:#ffa940}.s3{background:var(--purpb);color:var(--purp)}

.dlist{list-style:none}
.ditem{display:flex;align-items:center;gap:8px;padding:8px 14px;border-bottom:1px solid rgba(255,255,255,.02);transition:background .15s;font-size:11.5px}
.ditem:hover{background:rgba(255,255,255,.02)}
.ditem .im{flex:1;min-width:0}
.ditem .it{font-weight:500;color:var(--t);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ditem .im2{font-size:10px;color:var(--t2);margin-top:1px}

.badge{display:inline-block;padding:2px 7px;border-radius:3px;font-size:10px;font-weight:500;white-space:nowrap;flex-shrink:0}
.be{background:var(--gb);color:var(--g)}.bp{background:var(--ob);color:var(--o)}.bo{background:var(--rb);color:var(--r)}
.lv1{background:var(--rb);color:var(--r);font-weight:600}.lv2{background:var(--ob);color:var(--o);font-weight:600}.lv3{background:var(--yb);color:var(--y);font-weight:600}

.ldot{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--g);animation:pulse 2s infinite;margin-right:5px}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(0,230,118,.5)}50%{box-shadow:0 0 0 5px rgba(0,230,118,0)}}

.tags{display:flex;flex-wrap:wrap;gap:5px;padding:4px 0}
.tag{font-size:10px;padding:3px 8px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:3px;color:var(--t2);cursor:default}
.tag:hover{border-color:var(--b2);color:var(--t)}
.tag em{font-family:var(--fd);font-style:normal;font-weight:600;color:var(--accent);margin-left:3px}

.empty-state{text-align:center;padding:30px;color:var(--t3)}
.empty-state .eicon{font-size:36px;margin-bottom:8px}
.page-title{font-family:var(--fd);font-size:18px;font-weight:600;letter-spacing:.03em;margin-bottom:12px;color:#fff}
.page-sub{font-size:11px;color:var(--t2);margin-bottom:16px}

@media(max-width:1400px){.kpi-row{grid-template-columns:repeat(3,1fr)}.mgrid{grid-template-columns:1fr}}
`;

// Now build the full HTML
const htmlParts = [];

htmlParts.push(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>小水电集控 · 小水电智能监控中心</title>
<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
<style>${CSS}</style>
</head>
<body>

<!-- SIDEBAR -->
<aside class="sidebar">
  <div class="side-logo">
    <h2><span>小水电</span>集控</h2>
    <div class="sub">HYDROPOWER OPS CENTER</div>
  </div>
  <nav class="side-nav" id="sideNav"></nav>
</aside>

<!-- MAIN -->
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

<script>`);

// Embed data
htmlParts.push(dataJs);

// Now the JS application code
htmlParts.push(`

// ===== MENU DEFINITION =====
const MENU = [
  {id:'home',name:'运维首页',icon:'⌂',page:'home',kids:[]},
  {id:'yxzb',name:'运行值班',icon:'⚡',kids:[
    {id:'sched',name:'排班设置',page:'scheduling',icon:'📅'},
    {id:'handover',name:'接班记事',page:'handover',icon:'📝'},
    {id:'recordq',name:'记事查询',page:'records',icon:'🔍'}
  ]},
  {id:'yxgl',name:'运行管理',icon:'▣',kids:[
    {id:'issue',name:'缺陷管理',page:'issues',icon:'⚠'},
    {id:'inspect',name:'定期工作',page:'inspects',icon:'✅'},
    {id:'ticket',name:'两票管理',page:'workbills',icon:'📋'},
    {id:'planwork',name:'计划工作',page:'planworks',icon:'📌'},
    {id:'stat',name:'电站统计分析',page:'stationstats',icon:'📊'}
  ]},
  {id:'inspectMgr',name:'考察验收',icon:'◉',kids:[
    {id:'stExam',name:'电站考察',page:'stationExamine',icon:'🏭'},
    {id:'accept',name:'验收管理',page:'finishCheck',icon:'✔'}
  ]},
  {id:'equip',name:'设备管理',icon:'⚙',kids:[
    {id:'equipInfo',name:'设备综合信息',page:'equipments',icon:'📡'},
    {id:'equipParam',name:'设备参数',page:'equipParams',icon:'⚡'},
    {id:'equipModel',name:'设备模型',page:'equipModels',icon:'🔧'},
    {id:'equipSpare',name:'设备备品备件',page:'equipSpares',icon:'🧩'},
    {id:'equipLevel',name:'设备评级',page:'equipLevels',icon:'⭐'},
    {id:'equipRepair',name:'检修履历',page:'equipRepairs',icon:'🔨'}
  ]},
  {id:'safety',name:'安全管理',icon:'◈',kids:[
    {id:'safetyList',name:'安全管理列表',page:'safetyList',icon:'🛡'},
    {id:'safetyHidden',name:'安全隐患',page:'safetyHidden',icon:'🔍'},
    {id:'safetyFile',name:'安全文件',page:'safetyFile',icon:'📁'},
    {id:'eventReport',name:'事件快报',page:'eventReport',icon:'🚨'}
  ]},
  {id:'dispatch',name:'在线调度',icon:'◎',page:'dispatch',kids:[]},
  {id:'msg',name:'消息管理',icon:'✉',page:'messages',kids:[]},
  {id:'loc',name:'位置地图',icon:'📍',page:'location',kids:[]}
];

// ===== HELPER FUNCTIONS =====
function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function fmtTs(ts) {
  if (!ts || ts === '0') return '-';
  const d = new Date(parseInt(ts) * 1000);
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function statusBadge(s) {
  if (s==='end'||s==='已结束') return '<span class="badge be">已结束</span>';
  if (s==='progress'||s==='进行中'||s==='p0020') return '<span class="badge bp">进行中</span>';
  return '<span class="badge bo">未处理</span>';
}
function levelBadge(l) {
  const cls = l==1?'lv1':l==2?'lv2':'lv3';
  return '<span class="badge '+cls+'">'+l+'级</span>';
}
function shiftBadge(n) { return '<span class="shift-tag s'+n+'">班'+n+'</span>'; }

// ===== RENDER PAGES =====
function renderPage(pageId) {
  const root = document.getElementById('contentRoot');
  const D = HAR_DATA;
  let h = '';

  switch(pageId) {

  case 'home': {
    h += '<div class="kpi-row">';
    h += '<div class="kpi good"><div class="kl">延时工单</div><div class="kv">0</div><div class="ks">2026年1-12月均为零</div></div>';
    h += '<div class="kpi"><div class="kl">两票总数</div><div class="kv">'+(D.workBills?.length||257)+'</div><div class="ks">工作票累计</div></div>';
    h += '<div class="kpi"><div class="kl">缺陷总数</div><div class="kv">1,630</div><div class="ks">含已处理和待处理</div></div>';
    h += '<div class="kpi"><div class="kl">巡检任务</div><div class="kv">438k</div><div class="ks">累计 438,345 条</div></div>';
    h += '<div class="kpi"><div class="kl">记事记录</div><div class="kv">13.8k</div><div class="ks">累计 13,846 条</div></div>';
    h += '<div class="kpi"><div class="kl">电站数量</div><div class="kv">55</div><div class="ks">覆盖7个运维中心</div></div>';
    h += '</div>';

    h += '<div class="mgrid sched-layout">';
    // Scheduling table
    h += '<div class="card sched-row"><div class="card-header"><span class="ct">长沙智能监控中心 · 2026年5月排班表</span><span class="cn">'+(D.scheduling?.length||35)+'天</span></div><div class="card-body"><table class="tbl"><thead><tr><th>日期</th><th>班次</th><th>值班人员</th></tr></thead><tbody>';
    const today = '2026-05-13';
    (D.scheduling||[]).forEach(day => {
      const isToday = day.date === today;
      day.shifts.forEach((s,si) => {
        h += '<tr'+(isToday?' style="background:rgba(0,180,216,.06)"':'')+'>';
        if(si===0) {
          const d = new Date(day.date);
          h += '<td class="date-col" rowspan="'+day.shifts.length+'">'+day.date.slice(5)+' <span style="font-size:10px;color:var(--t2)">周'+['日','一','二','三','四','五','六'][d.getDay()]+(isToday?' <span style="color:var(--accent)">●</span>':'')+'</span></td>';
        }
        h += '<td>'+shiftBadge(s.num)+'</td><td>'+esc(s.users)+'</td>';
        h += '</tr>';
      });
    });
    h += '</tbody></table></div></div>';

    // Right column
    h += '<div style="display:flex;flex-direction:column;gap:14px">';
    // Work bills
    h += '<div class="card" style="flex:1"><div class="card-header"><span class="ct">两票管理 · 最近工作票</span><span class="cn">共257条</span></div><div class="card-body"><ul class="dlist">';
    (D.workBills||[]).slice(0,6).forEach(w => {
      h += '<li class="ditem"><div class="im"><div class="it">'+esc(w.title)+'</div><div class="im2">'+esc(w.station)+' · '+esc(w.user)+' · '+esc(w.date)+'</div></div>'+statusBadge(w.status)+'</li>';
    });
    h += '</ul></div></div>';

    // Issues + Notes
    h += '<div class="card" style="flex:1"><div class="card-header"><span class="ct">缺陷管理 · 最近缺陷</span><span class="cn">共1,630条</span></div><div class="card-body"><ul class="dlist">';
    (D.issues||[]).slice(0,5).forEach(is => {
      h += '<li class="ditem"><div class="im"><div class="it">'+esc(is.title)+'</div><div class="im2">'+esc(is.station)+' · '+esc(is.user)+' · '+esc(is.date)+'</div></div>'+levelBadge(is.level)+statusBadge(is.status)+'</li>';
    });
    h += '</ul></div></div>';
    h += '</div></div>';

    // Bottom: notes + stations
    h += '<div class="mgrid"><div class="card" style="max-height:200px"><div class="card-header"><span class="ct">调度记事</span><span class="cn">共13,846条</span></div><div class="card-body"><ul class="dlist">';
    (D.notes||[]).slice(0,5).forEach(n => {
      h += '<li class="ditem"><div class="im"><div class="it" style="font-weight:400;color:var(--t)">"'+esc(n.content)+'"</div><div class="im2">'+esc(n.station)+' · '+esc(n.user)+' · '+esc(n.time)+'</div></div></li>';
    });
    h += '</ul></div></div>';
    h += '<div class="card" style="max-height:200px"><div class="card-header"><span class="ct">运维中心电站分布</span><span class="cn">55座电站</span></div><div class="card-body" style="padding:10px 14px">';
    const centers = [['小水电智能监控中心',18],['广东英德运维中心',2],['湖南浏阳运维中心',15],['湖南郴州运维中心',4],['湖南道县运维中心',2],['湖南溆浦运维中心',4],['湖南炎陵运维中心',18]];
    h += '<div class="tags">';
    centers.forEach(([n,c]) => { h += '<span class="tag">'+n+'<em>'+c+'</em></span>'; });
    h += '</div><div style="font-size:10px;color:var(--t3);margin-top:6px">共覆盖 55 座水电站，分布于广东、湖南两省</div>';
    h += '</div></div></div>';
    break;
  }

  case 'scheduling': {
    h += '<div class="page-title">排班设置 · 长沙智能监控中心</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">2026年5月排班表</span><span class="cn">35天</span></div><div class="card-body"><table class="tbl"><thead><tr><th>日期</th><th>班次</th><th>值班人员</th></tr></thead><tbody>';
    (D.scheduling||[]).forEach(day => {
      day.shifts.forEach((s,si) => {
        h += '<tr><td class="date-col" rowspan="'+day.shifts.length+'">'+day.date.slice(5)+' <span style="font-size:10px;color:var(--t2)">周'+['日','一','二','三','四','五','六'][new Date(day.date).getDay()]+'</span></td>';
        h += '<td>'+shiftBadge(s.num)+'</td><td>'+esc(s.users)+'</td></tr>';
      });
    });
    h += '</tbody></table></div></div>';
    break;
  }

  case 'handover': {
    h += '<div class="page-title">接班记事</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">最新调度记事</span><span class="cn">共'+(D.schedulingRecordList?.total||13846)+'条</span></div><div class="card-body"><ul class="dlist">';
    (D.notes||[]).forEach(n => {
      h += '<li class="ditem"><div class="im"><div class="it" style="font-weight:400">"'+esc(n.content)+'"</div><div class="im2">'+esc(n.station)+' · '+esc(n.user)+' · '+esc(n.time)+'</div></div></li>';
    });
    h += '</ul></div></div>';
    break;
  }

  case 'records': {
    h += '<div class="page-title">记事查询</div>';
    h += '<div class="page-sub">调度记事记录，共'+ (D.schedulingRecordList?.total||13846) +'条</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">记事列表</span></div><div class="card-body"><ul class="dlist">';
    ((D.schedulingRecordList?.records||D.notes)||[]).slice(0,10).forEach(r => {
      const content = r.content || '';
      h += '<li class="ditem"><div class="im"><div class="it" style="font-weight:400">"'+esc(content)+'"</div><div class="im2">'+esc(r.companyName||r.station)+' · '+esc(r.userName||r.user)+' · '+(r.createTime?fmtTs(r.createTime):esc(r.time||'-'))+'</div></div></li>';
    });
    h += '</ul></div></div>';
    break;
  }

  case 'issues': {
    h += '<div class="page-title">缺陷管理</div><div class="page-sub">共 '+ (HAR_DATA.issueList?.total||1630) +' 条缺陷记录</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">缺陷列表</span></div><div class="card-body"><ul class="dlist">';
    (D.issues||[]).concat(D.issues||[]).slice(0,15).forEach(is => {
      h += '<li class="ditem"><div class="im"><div class="it">'+esc(is.title)+'</div><div class="im2">'+esc(is.station)+' · '+esc(is.user)+' · '+esc(is.date)+'</div></div>'+levelBadge(is.level)+statusBadge(is.status)+'</li>';
    });
    h += '</ul></div></div>';
    break;
  }

  case 'inspects': {
    h += '<div class="page-title">定期工作（巡检）</div><div class="page-sub">累计 '+ (D.inspectTask?.total||438345).toLocaleString() +' 条巡检任务</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">巡检任务列表</span></div><div class="card-body"><ul class="dlist">';
    (D.inspectTasks||[]).slice(0,10).forEach(t => {
      h += '<li class="ditem"><div class="im"><div class="it">'+esc(t.title||t.station)+'</div><div class="im2">'+esc(t.station)+' · 周期:'+esc(t.timeCycle||'-')+'</div></div></li>';
    });
    h += '</ul></div></div>';
    break;
  }

  case 'workbills': {
    h += '<div class="page-title">两票管理</div><div class="page-sub">共 '+ (D.workBillList?.total||257) +' 条工作票</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">工作票列表</span></div><div class="card-body"><ul class="dlist">';
    (D.workBills||[]).forEach(w => {
      h += '<li class="ditem"><div class="im"><div class="it">'+esc(w.title)+' ['+esc(w.billCode||'')+']</div><div class="im2">'+esc(w.station)+' · '+esc(w.user)+' · '+esc(w.date)+'</div></div>'+statusBadge(w.status)+'</li>';
    });
    h += '</ul></div></div>';
    break;
  }

  case 'planworks': {
    h += '<div class="page-title">计划工作</div><div class="page-sub">共 '+ (D.planWorkList?.total||13) +' 条</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">计划工作列表</span></div><div class="card-body"><ul class="dlist">';
    (D.planWorks||[]).slice(0,10).forEach(p => {
      h += '<li class="ditem"><div class="im"><div class="it">'+esc(p.title)+'</div><div class="im2">'+esc(p.station)+' · '+p.beginTime+' ~ '+p.endTime+'</div></div>'+statusBadge(p.status)+'</li>';
    });
    h += '</ul></div></div>';
    break;
  }

  case 'stationstats': {
    h += '<div class="page-title">电站统计分析</div><div class="page-sub">接入电站 '+(D.stationCodes?.length||149)+' 座</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">电站列表</span></div><div class="card-body"><table class="tbl"><thead><tr><th>电站编码</th><th>电站名称</th><th>所属公司</th></tr></thead><tbody>';
    (D.stationCodes||[]).slice(0,20).forEach(s => {
      h += '<tr><td style="font-family:var(--fd)">'+esc(s.stationCode||s.code)+'</td><td>'+esc(s.stationName||s.name)+'</td><td>'+esc(s.companyName)+'</td></tr>';
    });
    h += '</tbody></table></div></div>';
    break;
  }

  case 'stationExamine': {
    h += '<div class="page-title">电站考察</div><div class="page-sub">共 '+ (D.stationExamine?.total||40) +' 条考察记录</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">考察列表</span></div><div class="card-body"><ul class="dlist">';
    (D.stationExamines||[]).slice(0,10).forEach(e => {
      h += '<li class="ditem"><div class="im"><div class="it">'+esc(e.title)+'</div><div class="im2">'+esc(e.station)+' · '+esc(e.examineDate)+'</div></div>'+statusBadge(e.status)+'</li>';
    });
    h += '</ul></div></div>';
    break;
  }

  case 'finishCheck': {
    h += '<div class="page-title">验收管理</div><div class="page-sub">共 '+ (D.finishCheck?.total||6) +' 条验收任务</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">验收列表</span></div><div class="card-body"><ul class="dlist">';
    (D.finishChecks||[]).slice(0,10).forEach(f => {
      h += '<li class="ditem"><div class="im"><div class="it">'+esc(f.title)+'</div><div class="im2">'+esc(f.station)+'</div></div>'+statusBadge(f.status)+'</li>';
    });
    h += '</ul></div></div>';
    break;
  }

  case 'equipments': {
    h += '<div class="page-title">设备综合信息</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">设备列表</span></div><div class="card-body"><table class="tbl"><thead><tr><th>设备名称</th><th>所属电站</th><th>规格型号</th><th>层级</th></tr></thead><tbody>';
    (D.equipments||[]).slice(0,10).forEach(eq => {
      h += '<tr><td>'+esc(eq.name)+'</td><td>'+esc(eq.station)+'</td><td>'+esc(eq.model)+'</td><td>'+esc(eq.tier||'-')+'</td></tr>';
    });
    if (!(D.equipments||[]).length) {
      h += '<tr><td colspan="4"><div class="empty-state"><div class="eicon">📡</div>暂无设备数据</div></td></tr>';
    }
    h += '</tbody></table></div></div>';
    break;
  }

  case 'equipParams': {
    h += '<div class="page-title">设备参数</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">参数列表</span></div><div class="card-body"><table class="tbl"><thead><tr><th>参数名称</th><th>参数类型</th><th>所属分类</th></tr></thead><tbody>';
    const eps = D.equipmentParams || [];
    if (Array.isArray(eps) && eps.length) {
      eps.slice(0,10).forEach(p => {
        h += '<tr><td>'+esc(p.paramName||p.name||'-')+'</td><td>'+esc(p.paramType||p.type||'-')+'</td><td>'+esc(p.category||'-')+'</td></tr>';
      });
    } else {
      h += '<tr><td colspan="3"><div class="empty-state"><div class="eicon">⚡</div>暂无参数数据</div></td></tr>';
    }
    h += '</tbody></table></div></div>';
    break;
  }

  case 'equipModels': {
    h += '<div class="page-title">设备模型</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">模型列表</span></div><div class="card-body"><table class="tbl"><thead><tr><th>模型名称</th><th>类别</th><th>能源类型</th></tr></thead><tbody>';
    const ems = D.equipmentModels || [];
    if (Array.isArray(ems) && ems.length) {
      ems.slice(0,10).forEach(m => {
        h += '<tr><td>'+esc(m.modelName||m.name||'-')+'</td><td>'+esc(m.category||m.proCategoryName||'-')+'</td><td>'+esc(m.egyType||'-')+'</td></tr>';
      });
    } else {
      h += '<tr><td colspan="3"><div class="empty-state"><div class="eicon">🔧</div>暂无模型数据</div></td></tr>';
    }
    h += '</tbody></table></div></div>';
    break;
  }

  case 'equipSpares': {
    h += '<div class="page-title">设备备品备件</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">备件列表</span></div><div class="card-body"><table class="tbl"><thead><tr><th>备件名称</th><th>规格型号</th><th>数量</th></tr></thead><tbody>';
    const esps = D.equipmentSpares || [];
    if (Array.isArray(esps) && esps.length) {
      esps.slice(0,10).forEach(s => {
        h += '<tr><td>'+esc(s.spareName||s.name||'-')+'</td><td>'+esc(s.spareModel||s.model||'-')+'</td><td>'+esc(s.quantity||s.count||'-')+'</td></tr>';
      });
    } else {
      h += '<tr><td colspan="3"><div class="empty-state"><div class="eicon">🧩</div>暂无备件数据</div></td></tr>';
    }
    h += '</tbody></table></div></div>';
    break;
  }

  case 'equipLevels': {
    h += '<div class="page-title">设备评级</div><div class="page-sub">共 '+ (D.equipmentLevel?.total||13) +' 条</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">评级列表</span></div><div class="card-body"><ul class="dlist">';
    (D.equipmentLevels||[]).slice(0,10).forEach(el => {
      h += '<li class="ditem"><div class="im"><div class="it">'+esc(el.equipmentName||el.name||'-')+'</div><div class="im2">'+esc(el.companyName||el.station||'')+' · 评级:'+esc(el.level||el.equipmentLevel||'-')+'</div></div></li>';
    });
    if (!(D.equipmentLevels||[]).length) {
      h += '<li class="ditem"><div class="empty-state"><div class="eicon">⭐</div>暂无评级数据</div></li>';
    }
    h += '</ul></div></div>';
    break;
  }

  case 'equipRepairs': {
    h += '<div class="page-title">检修履历</div><div class="page-sub">共 '+ (D.equipmentRepairList?.total||50) +' 条</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">检修记录</span></div><div class="card-body"><ul class="dlist">';
    (D.equipmentRepairs||[]).slice(0,10).forEach(r => {
      const name = r.equipmentName || r.deviceName || r.title || '-';
      h += '<li class="ditem"><div class="im"><div class="it">'+esc(name)+'</div><div class="im2">'+esc(r.companyName||'-')+' · '+esc(r.repairType||r.type||'')+' · '+esc(r.repairDate||'')+'</div></div></li>';
    });
    if (!(D.equipmentRepairs||[]).length) {
      h += '<li class="ditem"><div class="empty-state"><div class="eicon">🔨</div>暂无检修数据</div></li>';
    }
    h += '</ul></div></div>';
    break;
  }

  case 'safetyList': {
    h += '<div class="page-title">安全管理列表</div><div class="page-sub">共 '+ (D.securityList?.total||19) +' 条</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">安全项目</span></div><div class="card-body"><ul class="dlist">';
    (D.securityItems||[]).slice(0,10).forEach(s => {
      h += '<li class="ditem"><div class="im"><div class="it">'+esc(s.securityTitle||s.title||'-')+'</div><div class="im2">'+esc(s.companyName||'')+' · '+esc(s.securityType||s.type||'')+' · '+esc(s.createTime?fmtTs(s.createTime):'')+'</div></div></li>';
    });
    if (!(D.securityItems||[]).length) {
      h += '<li class="ditem"><div class="empty-state"><div class="eicon">🛡</div>暂无数据</div></li>';
    }
    h += '</ul></div></div>';
    break;
  }

  case 'safetyHidden': {
    h += '<div class="page-title">安全隐患</div><div class="page-sub">共 '+ (D.securityHidden?.total||4) +' 条</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">隐患列表</span></div><div class="card-body"><ul class="dlist">';
    (D.securityHiddens||[]).slice(0,10).forEach(s => {
      h += '<li class="ditem"><div class="im"><div class="it">'+esc(s.dangerTitle||s.title||'-')+'</div><div class="im2">'+esc(s.companyName||'')+' · 类型:'+esc(s.dangerType||'')+'</div></div></li>';
    });
    if (!(D.securityHiddens||[]).length) {
      h += '<li class="ditem"><div class="empty-state"><div class="eicon">🔍</div>暂无隐患数据</div></li>';
    }
    h += '</ul></div></div>';
    break;
  }

  case 'safetyFile': {
    h += '<div class="page-title">安全文件</div><div class="page-sub">共 '+ (D.securityFile?.total||3) +' 条</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">文件列表</span></div><div class="card-body"><ul class="dlist">';
    (D.securityFiles||[]).slice(0,10).forEach(f => {
      h += '<li class="ditem"><div class="im"><div class="it">'+esc(f.fileName||f.title||'-')+'</div><div class="im2">'+esc(f.companyName||'')+' · '+esc(f.informationType||'')+'</div></div></li>';
    });
    if (!(D.securityFiles||[]).length) {
      h += '<li class="ditem"><div class="empty-state"><div class="eicon">📁</div>暂无文件数据</div></li>';
    }
    h += '</ul></div></div>';
    break;
  }

  case 'eventReport': {
    h += '<div class="page-title">事件快报</div><div class="page-sub">共 '+ (D.eventFirstReport?.total||1) +' 条</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">快报列表</span></div><div class="card-body"><ul class="dlist">';
    (D.eventReports||[]).slice(0,10).forEach(er => {
      h += '<li class="ditem"><div class="im"><div class="it">'+esc(er.eventTitle||er.title||'-')+'</div><div class="im2">'+esc(er.companyName||'')+' · '+esc(er.eventTime?fmtTs(er.eventTime):'')+'</div></div>'+statusBadge(er.status)+'</li>';
    });
    if (!(D.eventReports||[]).length) {
      h += '<li class="ditem"><div class="empty-state"><div class="eicon">🚨</div>暂无快报数据</div></li>';
    }
    h += '</ul></div></div>';
    break;
  }

  case 'dispatch': {
    h += '<div class="page-title">在线调度</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">调度值班详情</span><span class="cn">共'+(D.dutyDetails?.length||0)+'条</span></div><div class="card-body"><table class="tbl"><thead><tr><th>用户</th><th>位置类型</th><th>上报时间</th><th>地址</th></tr></thead><tbody>';
    (D.dutyDetails||[]).slice(0,15).forEach(d => {
      h += '<tr><td>'+esc(d.userName||d.userId)+'</td><td>'+esc(d.locType||'-')+'</td><td>'+esc(d.reportTime?fmtTs(d.reportTime):'-')+'</td><td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(d.address||'-')+'</td></tr>';
    });
    if (!(D.dutyDetails||[]).length) {
      h += '<tr><td colspan="4"><div class="empty-state"><div class="eicon">◎</div>暂无实时调度数据</div></td></tr>';
    }
    h += '</tbody></table></div></div>';
    break;
  }

  case 'messages': {
    h += '<div class="page-title">消息管理</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">消息列表</span></div><div class="card-body"><div class="empty-state"><div class="eicon">✉</div>当前无未读消息</div></div></div>';
    break;
  }

  case 'location': {
    h += '<div class="page-title">位置地图 · 电站分布</div><div class="page-sub">共 '+ (D.locations?.length||55) +' 座电站</div>';
    h += '<div class="card"><div class="card-header"><span class="ct">电站位置列表</span></div><div class="card-body"><table class="tbl"><thead><tr><th>电站名称</th><th>所属公司</th><th>城市</th><th>坐标</th></tr></thead><tbody>';
    (D.locations||[]).slice(0,30).forEach(l => {
      h += '<tr><td>'+esc(l.companyName||l.name)+'</td><td>'+esc(l.companyCode||'')+'</td><td>'+esc(l.cityName||'')+'</td><td style="font-family:var(--fd);font-size:10px">'+esc(l.location||'-')+'</td></tr>';
    });
    h += '</tbody></table></div></div>';
    break;
  }

  default:
    h += '<div class="empty-state"><div class="eicon">📄</div>页面内容加载中...</div>';
  }

  root.innerHTML = h;
}

// ===== SIDEBAR RENDERING =====
let currentPage = 'home';

function renderSidebar() {
  const nav = document.getElementById('sideNav');
  let html = '';
  MENU.forEach((group, gi) => {
    const hasKids = group.kids && group.kids.length > 0;
    const isOpen = gi === 0 || gi === 2; // 运维首页 and 运行管理 open by default
    html += '<div class="ng' + (isOpen ? ' open' : '') + '">';

    if (hasKids) {
      html += '<div class="ngh" data-action="toggle"><span class="ic">'+group.icon+'</span><span>'+group.name+'</span><span class="ar">▶</span></div>';
      html += '<div class="nc">';
      group.kids.forEach(kid => {
        const isActive = currentPage === kid.page;
        html += '<div class="nci'+(isActive?' active':'')+'" data-page="'+kid.page+'"><span class="dot"></span><span>'+kid.name+'</span></div>';
      });
      html += '</div>';
    } else {
      const isActive = currentPage === group.page;
      html += '<div class="ngh'+(isActive?' active':'')+'" data-page="'+group.page+'"><span class="ic">'+group.icon+'</span><span>'+group.name+'</span></div>';
    }
    html += '</div>';
  });
  nav.innerHTML = html;

  // Bind events
  nav.querySelectorAll('.ngh[data-action="toggle"]').forEach(el => {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      this.parentElement.classList.toggle('open');
    });
  });
  nav.querySelectorAll('.ngh[data-page]').forEach(el => {
    el.addEventListener('click', function() {
      navigateTo(this.dataset.page);
    });
  });
  nav.querySelectorAll('.nci[data-page]').forEach(el => {
    el.addEventListener('click', function() {
      navigateTo(this.dataset.page);
    });
  });
}

function navigateTo(pageId) {
  currentPage = pageId;
  // Update breadcrumb
  let label = pageId;
  MENU.forEach(g => {
    if (g.page === pageId) label = g.name;
    if (g.kids) g.kids.forEach(k => { if (k.page === pageId) label = g.name + ' / ' + k.name; });
  });
  document.getElementById('breadcrumb').textContent = label;
  // Re-render sidebar to update active states
  renderSidebar();
  // Render page
  renderPage(pageId);
}

// ===== CLOCK =====
function updateClock() {
  const n = new Date();
  document.getElementById('clock').textContent = n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0')+'-'+String(n.getDate()).padStart(2,'0')+' '+String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0')+':'+String(n.getSeconds()).padStart(2,'0');
}

// ===== INIT =====
renderSidebar();
renderPage('home');
updateClock();
setInterval(updateClock, 1000);

`);
htmlParts.push(`</script>
</body>
</html>`);

// Write the full HTML
const fullHtml = htmlParts.join('\n');
fs.writeFileSync('cui_test/hydropower-dashboard.html', fullHtml, 'utf8');
console.log('Dashboard written: ' + (fullHtml.length/1024).toFixed(1) + 'KB');
