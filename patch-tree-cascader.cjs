// Patch generate-html-v3.cjs: Replace flat cascader with tree-structured cascader
const fs = require('fs');
const srcPath = 'd:/code/hydropower-web/cui_test/generate-html-v3.cjs';
let src = fs.readFileSync(srcPath, 'utf8');

// ===== 1. Replace buildOrgCascaderList =====
const oldBuildFn = `function buildOrgCascaderList(filter) {
  var d = window._MONITOR_DATA || {};
  var centers = d.opsCenters || [];
  var rootName = d.rootName || '小水电集控中心';
  var list = document.getElementById('orgCascaderList');
  if (!list) return;
  var kw = (filter||'').toLowerCase().trim();

  var html = '';
  // L0: Group/Company
  var rootMatch = !kw || rootName.toLowerCase().indexOf(kw) >= 0;
  var anyChildMatch = false;

  // Check if any center or station matches
  centers.forEach(function(c) {
    var cm = esc(c.companyName||'').toLowerCase();
    if (!kw || cm.indexOf(kw) >= 0) anyChildMatch = true;
    (c.children||[]).forEach(function(s) {
      var sm = esc(s.companyName||'').toLowerCase();
      if (!kw || sm.indexOf(kw) >= 0) anyChildMatch = true;
    });
  });

  if (rootMatch || anyChildMatch) {
    html += '<div class="cascader-item lv0' + (!_treeActiveCenter&&!_treeSelectedStation?' active':'') + '" data-level="0" data-id="_group" onclick="selectOrgItem(\\\\'_group\\\\',0,\\\\''+esc(rootName)+'\\\\')"><span>'+highlightMatch(esc(rootName),kw)+'</span><span class="cd-badge">'+centers.length+' 中心</span></div>';
  }

  centers.forEach(function(c) {
    var cname = esc(c.companyName||'');
    var stations = c.children||[];
    var cm = cname.toLowerCase();
    var cMatch = !kw || cm.indexOf(kw) >= 0;

    // Check station matches
    var matchStations = [];
    stations.forEach(function(s) {
      var sm = esc(s.companyName||'').toLowerCase();
      if (!kw || sm.indexOf(kw) >= 0) matchStations.push(s);
    });

    if (cMatch || matchStations.length > 0) {
      html += '<div class="cascader-item lv1' + (_treeActiveCenter===c.id&&!_treeSelectedStation?' active':'') + '" data-level="1" data-id="'+c.id+'" onclick="selectOrgItem(\\\\''+c.id+'\\\\',1,\\\\''+cname+'\\\\')"><span>'+highlightMatch(cname,kw)+'</span><span class="cd-badge">'+stations.length+' 站</span></div>';

      var showStations = kw ? matchStations : stations;
      showStations.forEach(function(s) {
        var sname = esc(s.companyName||'');
        html += '<div class="cascader-item lv2' + (_treeSelectedStation===s.id?' active':'') + '" data-level="2" data-id="'+s.id+'" data-cid="'+c.id+'" onclick="event.stopPropagation();selectOrgItem(\\\\''+s.id+'\\\\',2,\\\\''+sname+'\\\\',\\\\''+c.id+'\\\\')"><span class="cd-dot"></span><span>'+highlightMatch(sname,kw)+'</span></div>';
      });
    }
  });

  if (!html) {
    html = '<div class="cascader-empty">未找到匹配的组织</div>';
  }
  list.innerHTML = html;
}`;

const newBuildFn = `function buildOrgCascaderList(filter) {
  var d = window._MONITOR_DATA || {};
  var centers = d.opsCenters || [];
  var rootName = d.rootName || '小水电集控中心';
  var list = document.getElementById('orgCascaderList');
  if (!list) return;
  var kw = (filter||'').toLowerCase().trim();

  // Compute match state per node
  var rootMatch = !kw || rootName.toLowerCase().indexOf(kw) >= 0;
  var centerStates = [];
  var anyChildMatch = false;
  centers.forEach(function(c) {
    var cname = esc(c.companyName||'');
    var cMatch = !kw || cname.toLowerCase().indexOf(kw) >= 0;
    var stMatches = [];
    (c.children||[]).forEach(function(s) {
      var sm = esc(s.companyName||'').toLowerCase().indexOf(kw) >= 0;
      if (sm) anyChildMatch = true;
      stMatches.push({s:s, match:!kw || sm});
    });
    if (cMatch) anyChildMatch = true;
    centerStates.push({c:c, match:cMatch, stations:stMatches});
  });

  function csAny(s){return s.some(function(x){return x.match;});}
  var html = '';
  if (!kw || rootMatch || anyChildMatch) {
    var rActive = !_treeActiveCenter && !_treeSelectedStation;
    var rOpen = !kw || rActive || rootMatch || anyChildMatch;
    html += '<div class="cascader-item lv0'+(rActive?' active':'')+'" data-level="0" data-id="_group">'
      +'<span class="cd-arrow'+(rOpen?' open':'')+'" onclick="toggleTreeChildren(this)">&#9654;</span>'
      +'<span class="cd-label" onclick="selectOrgItem(\\\\'_group\\\\',0,\\\\''+esc(rootName)+'\\\\')">'+highlightMatch(esc(rootName),kw)+'</span>'
      +'<span class="cd-badge">'+centers.length+' 中心</span>'
      +'</div>';
    html += '<div class="cd-children'+(rOpen?' open':'')+'">';

    centerStates.forEach(function(cs) {
      var hasSm = csAny(cs.stations);
      if (kw && !cs.match && !hasSm) return;
      var cn = esc(cs.c.companyName||'');
      var cActive = _treeActiveCenter===cs.c.id && !_treeSelectedStation;
      var cOpen = !kw || cActive || cs.match || hasSm;
      html += '<div class="cascader-item lv1'+(cActive?' active':'')+'" data-level="1" data-id="'+cs.c.id+'">'
        +'<span class="cd-arrow'+(cOpen?' open':'')+'" onclick="toggleTreeChildren(this)">&#9654;</span>'
        +'<span class="cd-label" onclick="selectOrgItem(\\\\''+cs.c.id+'\\\\',1,\\\\''+cn+'\\\\')">'+highlightMatch(cn,kw)+'</span>'
        +'<span class="cd-badge">'+cs.stations.length+' 站</span>'
        +'</div>';
      html += '<div class="cd-children'+(cOpen?' open':'')+'">';

      cs.stations.forEach(function(st) {
        if (kw && !st.match) return;
        var sn = esc(st.s.companyName||'');
        var sActive = _treeSelectedStation===st.s.id;
        html += '<div class="cascader-item lv2'+(sActive?' active':'')+'" data-level="2" data-id="'+st.s.id+'" data-cid="'+cs.c.id+'">'
          +'<span class="cd-arrow leaf">&#9654;</span>'
          +'<span class="cd-label" onclick="selectOrgItem(\\\\''+st.s.id+'\\\\',2,\\\\''+sn+'\\\\',\\\\''+cs.c.id+'\\\\')">'+highlightMatch(sn,kw)+'</span>'
          +'</div>';
      });

      html += '</div>';
    });

    html += '</div>';
  }
  if (!html) html = '<div class="cascader-empty">未找到匹配的组织</div>';
  list.innerHTML = html;
}`;

if (src.includes(oldBuildFn)) {
  src = src.replace(oldBuildFn, newBuildFn);
  console.log('[1/4] buildOrgCascaderList replaced');
} else {
  console.error('ERROR: old buildOrgCascaderList NOT FOUND. Checking with partial match...');
  // Try to find what differs
  const idx = src.indexOf('function buildOrgCascaderList(filter)');
  if (idx >= 0) {
    console.log('  Found function at offset ' + idx);
    console.log('  Surrounding context:', JSON.stringify(src.substring(idx, idx + 80)));
  }
  process.exit(1);
}

// ===== 2. Replace selectOrgItem =====
const oldSelectItem = `function selectOrgItem(id, level, name, centerId) {
  // Update UI
  var txt = document.getElementById('orgCascaderText');
  if (txt) { txt.textContent = name; txt.classList.remove('placeholder'); }
  // Close dropdown
  var panel = document.getElementById('orgCascaderPanel');
  var trigger = document.getElementById('orgCascaderTrigger');
  if (panel) panel.style.display = 'none';
  if (trigger) trigger.classList.remove('open');

  // Rebuild list to update active states
  buildOrgCascaderList();

  if (level === 0) {
    selectTreeGroup();
  } else if (level === 1) {
    selectOpsCenter(id);
  } else if (level === 2) {
    selectStation(id);
    // Also select the parent ops center
    if (centerId) selectOpsCenter(centerId);
  }
}`;

const newSelectItem = `function selectOrgItem(id, level, name, centerId) {
  var d = window._MONITOR_DATA || {};
  var rootName = d.rootName || '小水电集控中心';
  var centers = d.opsCenters || [];

  // Build full hierarchical path
  var path = rootName;
  if (level === 1) {
    path += ' / ' + esc(name);
  } else if (level === 2 && centerId) {
    var cn = name;
    for (var i=0; i<centers.length; i++) {
      if (centers[i].id === centerId) { cn = esc(centers[i].companyName) + ' / ' + esc(name); break; }
    }
    path += ' / ' + cn;
  }

  var txt = document.getElementById('orgCascaderText');
  if (txt) { txt.textContent = path; txt.classList.remove('placeholder'); }

  var panel = document.getElementById('orgCascaderPanel');
  var trigger = document.getElementById('orgCascaderTrigger');
  if (panel) panel.style.display = 'none';
  if (trigger) trigger.classList.remove('open');

  buildOrgCascaderList();

  if (level === 0) {
    selectTreeGroup();
  } else if (level === 1) {
    selectOpsCenter(id);
  } else if (level === 2) {
    selectStation(id);
    if (centerId) selectOpsCenter(centerId);
  }
}`;

if (src.includes(oldSelectItem)) {
  src = src.replace(oldSelectItem, newSelectItem);
  console.log('[2/4] selectOrgItem replaced');
} else {
  console.error('ERROR: old selectOrgItem NOT FOUND');
  process.exit(1);
}

// ===== 3. Replace selectStation =====
const oldSelectStation = `function selectStation(stationId) {
  _treeSelectedStation = stationId;
  // Update cascader list to reflect selection
  buildOrgCascaderList();
}`;

const newSelectStation = `function selectStation(stationId) {
  _treeSelectedStation = stationId;
  buildOrgCascaderList();
}`;

if (src.includes(oldSelectStation)) {
  src = src.replace(oldSelectStation, newSelectStation);
  console.log('[3/4] selectStation updated (comment removed)');
} else {
  console.error('ERROR: old selectStation NOT FOUND');
  process.exit(1);
}

// ===== 4. Add toggleTreeChildren after highlightMatch function =====
const hlMatchEnd = `  return before + '<span class="cascader-highlight">' + match + '</span>' + after;
}`;

const hlMatchWithToggle = `  return before + '<span class="cascader-highlight">' + match + '</span>' + after;
}

function toggleTreeChildren(arrowEl) {
  arrowEl.classList.toggle('open');
  var children = arrowEl.parentElement.nextElementSibling;
  if (children && children.classList.contains('cd-children')) {
    children.classList.toggle('open');
  }
}`;

if (src.includes(hlMatchEnd) && !src.includes('function toggleTreeChildren')) {
  src = src.replace(hlMatchEnd, hlMatchWithToggle);
  console.log('[4/4] toggleTreeChildren added');
} else if (src.includes('function toggleTreeChildren')) {
  console.log('[4/4] toggleTreeChildren already exists');
} else {
  console.error('ERROR: highlightMatch end marker NOT FOUND');
  process.exit(1);
}

fs.writeFileSync(srcPath, src, 'utf8');
console.log('Done. All patches applied successfully.');
