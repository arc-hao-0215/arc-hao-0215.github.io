(() => {
  "use strict";
  const data = window.ATLAS_DATA;
  if (!data) { document.body.insertAdjacentHTML("afterbegin", '<p role="alert">資料檔載入失敗，請重新整理頁面。</p>'); return; }
  const NS = "http://www.w3.org/2000/svg";
  const $ = (q) => document.querySelector(q);
  const nodeMap = new Map(data.nodes.map(n => [n.id, n]));
  const sourceMap = new Map(data.sources.map(s => [s.id, s]));
  const graph = $("#graph"), frame = $("#graph-frame");
  const linksLayer = $("#links-layer"), nodesLayer = $("#nodes-layer"), axisLayer = $("#axis-layer");
  const tooltip = $("#graph-tooltip"), search = $("#search"), results = $("#search-results");
  const categories = new Set(Object.keys(data.categories));
  const viewBox = {x:0, y:0, w:1500, h:850};
  let limitYear = 2026, selected = null, activeView = "network", pointerStart = null;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const relColor = {design:"#ba9477", affiliation:"#8299a0", education:"#94a68c", engineering:"#b09cb3", client:"#a69b85"};
  const escape = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const dom = (tag, attrs = {}, text = undefined) => {
    const el = document.createElementNS(NS, tag);
    for (const key in attrs) el.setAttribute(key, attrs[key]);
    if (text !== undefined) el.textContent = text;
    return el;
  };
  const typeName = (type) => data.categories[type] ? data.categories[type].zh : type;
  const visibleNode = n => categories.has(n.type) && n.year <= limitYear;
  const neighbor = (id) => {
    const adjacent = new Set([id]);
    data.edges.forEach(e => {if(e.a===id) adjacent.add(e.b); if(e.b===id) adjacent.add(e.a);});
    return adjacent;
  };

  function layout() {
    const bands = {person:155, practice:326, institution:497, work:661};
    const rowHeights = {person:40, practice:41, institution:57, work:39};
    data.nodes.forEach(n => {
      n.x = 105 + (n.year - 1950) * (1270 / 76);
      n.y = bands[n.type] + n.lane * rowHeights[n.type] + (n.offset || 0)*6;
    });
  }
  function renderAxis() {
    axisLayer.replaceChildren();
    const sectors = [
      {label:"01 / PEOPLE",y:132},{label:"02 / PRACTICES",y:305},
      {label:"03 / INSTITUTIONS",y:475},{label:"04 / WORKS",y:631}
    ];
    sectors.forEach(s => {
      axisLayer.append(dom("text",{x:29,y:s.y,class:"axis-label"},s.label));
      axisLayer.append(dom("line",{x1:28,y1:s.y+16,x2:1460,y2:s.y+16,class:"axis-line"}));
    });
    [1950,1960,1970,1980,1990,2000,2010,2020,2026].forEach(year => {
      const x = 105 + (year - 1950) * (1270/76);
      axisLayer.append(dom("line",{x1:x,y1:74,x2:x,y2:796,class:"axis-line"}));
      axisLayer.append(dom("text",{x:x,y:811,"text-anchor":"middle",class:"axis-label"},year));
    });
    axisLayer.append(dom("text",{x:29,y:43,class:"axis-label"},"A SELECTIVE HISTORY OF DOCUMENTED ARCHITECTURAL RELATIONS"));
    axisLayer.append(dom("text",{x:1450,y:43,"text-anchor":"end",class:"axis-label"},"TIME ANCHORS ≠ BIRTH YEARS"));
  }
  function pathFor(a,b,index) {
    const ax=a.x, ay=a.y, bx=b.x, by=b.y;
    const mx=(ax+bx)/2, my=(ay+by)/2;
    const skew = (index % 3 - 1) * 19;
    return "M"+ax+" "+ay+" Q"+(mx+skew)+" "+(my+(Math.abs(ax-bx)<130 ? -34 : 15))+" "+bx+" "+by;
  }
  function renderGraph() {
    linksLayer.replaceChildren(); nodesLayer.replaceChildren();
    const active = selected && visibleNode(nodeMap.get(selected)) ? neighbor(selected) : null;
    data.edges.forEach((edge,i) => {
      const a=nodeMap.get(edge.a),b=nodeMap.get(edge.b);
      if(!visibleNode(a)||!visibleNode(b)|| (edge.year && edge.year>limitYear)) return;
      const isActive=selected && (edge.a===selected||edge.b===selected);
      const e=dom("path",{
        d:pathFor(a,b,i),
        stroke:relColor[edge.type] || "#a7ac9e",
        class:"graph-link"+(selected?(isActive?" active":" dim"):""),
        "stroke-dasharray":edge.type==="engineering"?"5 4":"none",
        "aria-label":edge.label
      });
      if(isActive) linksLayer.append(e); else linksLayer.prepend(e);
    });
    data.nodes.forEach(n => {
      if (!visibleNode(n)) return;
      const isSelected=n.id===selected;
      const nearby=!active||active.has(n.id);
      const group=dom("g",{
        class:"graph-node"+(isSelected?" selected":"")+(nearby?"":" dim"),
        transform:"translate("+n.x+" "+n.y+")",
        tabindex:"0",role:"button",
        "aria-label":n.name+"，"+typeName(n.type)+"。按 Enter 查看相關資訊。",
        "data-id":n.id
      });
      const radius = n.type==="work"?8:n.type==="institution"?7.2:6.7;
      const color=data.categories[n.type].color;
      group.append(dom("circle",{r:radius+8,class:"halo"}));
      group.append(dom("circle",{r:radius,fill:color,class:"dot"}));
      const labelAbove=n.type==="work" || n.lane===3;
      const labelY=labelAbove?-16:23;
      const text=dom("text",{x:0,y:labelY,"text-anchor":"middle",class:"node-label"},n.name);
      group.append(text);
      if(n.type==="practice"||n.type==="institution"){
        group.append(dom("text",{x:0,y:labelAbove?-28:35,"text-anchor":"middle",class:"node-en"},n.en.length>25 ? n.en.slice(0,23)+"…" : n.en));
      }
      group.addEventListener("click", e => {e.stopPropagation(); selectNode(n.id);});
      group.addEventListener("keydown", e => {if(e.key==="Enter"||e.key===" "){e.preventDefault(); selectNode(n.id);}});
      group.addEventListener("pointerenter",e=>showTooltip(e,n));
      group.addEventListener("pointermove",e=>showTooltip(e,n));
      group.addEventListener("pointerleave",()=>{tooltip.hidden=true;});
      nodesLayer.append(group);
    });
    $("#node-stat").textContent=data.nodes.filter(visibleNode).length;
    $("#edge-stat").textContent=data.edges.filter(e => visibleNode(nodeMap.get(e.a))&&visibleNode(nodeMap.get(e.b))&&(!e.year||e.year<=limitYear)).length;
  }
  function showTooltip(event,node){
    tooltip.innerHTML="<strong>"+escape(node.name)+"</strong><small>"+escape(node.en)+" · "+typeName(node.type)+"</small>";
    tooltip.hidden=false;
    const rect=frame.getBoundingClientRect();
    const x=event.clientX-rect.left+13;
    const y=event.clientY-rect.top-55;
    tooltip.style.left=Math.min(Math.max(8,x),rect.width-210)+"px";
    tooltip.style.top=Math.max(12,y)+"px";
  }
  function updateViewBox(){
    graph.setAttribute("viewBox",[viewBox.x,viewBox.y,viewBox.w,viewBox.h].join(" "));
  }
  function changeZoom(factor,clientX,clientY){
    const rect=graph.getBoundingClientRect();
    const fx=(clientX===undefined? .5 : (clientX-rect.left)/rect.width);
    const fy=(clientY===undefined? .5 : (clientY-rect.top)/rect.height);
    const oldW=viewBox.w,oldH=viewBox.h;
    const nextW=Math.max(315,Math.min(3000,oldW*factor));
    const f=nextW/oldW;
    viewBox.x+=(oldW-nextW)*fx;
    viewBox.y+=(oldH-oldH*f)*fy;
    viewBox.w=nextW;
    viewBox.h=oldH*f;
    updateViewBox();
  }
  function resetView(){
    Object.assign(viewBox,{x:0,y:0,w:1500,h:850});
    updateViewBox();
  }
  function centerOn(n){
    if(!n) return;
    const targetW=840;
    viewBox.x=n.x-targetW*.5;
    viewBox.w=targetW;
    viewBox.h=850*targetW/1500;
    viewBox.y=n.y-viewBox.h*.5;
    updateViewBox();
  }
  function selectNode(id,zoom=false){
    const n=nodeMap.get(id); if(!n) return;
    if(n.year>limitYear){limitYear=n.year;$("#year").value=limitYear;$("#year-label").textContent=limitYear;}
    if(!categories.has(n.type)){
      categories.add(n.type);
      const box=$('#filters input[value="'+n.type+'"]');
      if(box) box.checked=true;
    }
    selected=id;
    tooltip.hidden=true;
    renderGraph(); renderDetail();
    if(zoom)centerOn(n);
    try{history.replaceState(null,"","#entity="+encodeURIComponent(id));}catch(_){}
    $("#detail-panel").classList.add("open");
    $("#sidebar").classList.remove("open");
    $("#mobile-toggle").setAttribute("aria-expanded","false");
  }
  function relatedEdges(id) {
    return data.edges.filter(e=>e.a===id||e.b===id).map(e=>({...e,other:nodeMap.get(e.a===id?e.b:e.a)}));
  }
  function renderDetail(){
    const body=$("#detail-body"); const n=nodeMap.get(selected);
    if(!n){body.innerHTML='<div class="empty-detail"><span class="crosshair">＋</span><span class="eyebrow">SELECT AN ENTITY</span><h2>Every connection<br>has a story.</h2><p>從網絡圖或索引選取節點，查看關聯、年份與原始資料。</p><div class="empty-line"></div><small>ATTRIBUTION BEFORE INTERPRETATION</small></div>';return;}
    const links=relatedEdges(n.id);
    const srcIds=[...new Set([...n.sources, ...links.flatMap(e=>e.src)])];
    body.innerHTML =
      '<div class="detail-meta"><span class="swatch '+escape(n.type)+'"></span> &nbsp;'+typeName(n.type).toUpperCase()+' / ENTITY '+String(data.nodes.indexOf(n)+1).padStart(2,"0")+'</div>'+
      '<h2 class="detail-title">'+escape(n.name)+'</h2>'+
      '<div class="detail-en">'+escape(n.en)+'</div>'+
      '<div class="detail-year"><span>REFERENCE YEAR</span><strong>'+n.year+'</strong></div>'+
      '<p class="detail-summary">'+escape(n.desc)+'</p>'+
      '<hr class="detail-divider"><div class="detail-subtitle">DOCUMENTED RELATIONS / '+links.length+'</div>'+
      links.map(e=>'<button class="connection-card" data-open="'+escape(e.other.id)+'"><span class="swatch '+escape(e.other.type)+'"></span><span><strong>'+escape(e.other.name)+'</strong><small>'+escape(e.label)+(e.year?' · '+e.year:'')+' · '+(e.src||[]).map(s=>escape(s)).join(", ")+'</small></span><span class="card-arrow">↗</span></button>').join("")+
      '<hr class="detail-divider"><div class="detail-subtitle">REFERENCES / '+srcIds.length+'</div>'+
      srcIds.map(id=>sourceMap.get(id)).filter(Boolean).map(s=>
        '<a class="source-card" href="'+escape(s.url)+'" target="_blank" rel="noopener noreferrer"><b>↗ '+escape(s.title)+'</b><small>'+escape(s.publisher)+' · '+escape(s.id)+'</small></a>').join("")+
      '<button class="detail-share" id="copy-link">COPY ENTITY LINK ↗</button>';
    body.querySelectorAll("[data-open]").forEach(b=>b.addEventListener("click",()=>{selectNode(b.dataset.open,true);}));
    $("#copy-link").addEventListener("click",async e=>{
      const el=e.currentTarget;
      const link=location.origin+location.pathname+"#entity="+encodeURIComponent(n.id);
      try{await navigator.clipboard.writeText(link);el.textContent="LINK COPIED ✓";}catch(_){el.textContent="COPY UNAVAILABLE — USE ADDRESS BAR";}
    });
  }
  function switchView(name){
    activeView=name;
    document.querySelectorAll(".view").forEach(el=>el.classList.toggle("active",el.id===name+"-view"));
    document.querySelectorAll(".topnav-link").forEach(el=>el.classList.toggle("active",el.dataset.view===name));
    if(name!=="network") $("#detail-panel").classList.remove("open");
    $("#sidebar").classList.remove("open");
    $("#mobile-toggle").setAttribute("aria-expanded","false");
    if(name==="index") renderIndex();
  }
  function renderIndex(){
    const term=$("#index-search").value.trim().toLocaleLowerCase();
    const list=$("#index-list"); list.replaceChildren();
    for(const type of ["person","practice","institution","work"]){
      const nodes=data.nodes.filter(n=>n.type===type && (n.name+" "+n.en).toLocaleLowerCase().includes(term)).sort((a,b)=>a.name.localeCompare(b.name,"zh-Hant"));
      if(!nodes.length)continue;
      const heading=document.createElement("div");heading.className="index-group-title";heading.textContent=typeName(type)+" / "+data.categories[type].en.toUpperCase()+" — "+nodes.length;
      list.append(heading);
      nodes.forEach(n=>{
        const button=document.createElement("button");button.className="index-item";
        button.innerHTML='<span><strong>'+escape(n.name)+'</strong><small>'+escape(n.en)+'</small></span><span class="year">'+n.year+'</span><span>↗</span>';
        button.addEventListener("click",()=>{switchView("network");selectNode(n.id,true);});
        list.append(button);
      });
    }
    if(!list.children.length){list.textContent="沒有符合的資料。請更換關鍵字。";}
  }
  function renderSources(){
    $("#sources-list").innerHTML=data.sources.map(s=>'<a href="'+escape(s.url)+'" target="_blank" rel="noopener noreferrer"><span>↗ '+escape(s.title)+'</span><small>'+escape(s.publisher)+' · '+escape(s.id)+'</small></a>').join("");
    for(const key of Object.keys(data.categories)) $("#count-"+key).textContent=data.nodes.filter(n=>n.type===key).length;
  }
  function showSearchResults(){
    const term=search.value.trim().toLocaleLowerCase();
    results.replaceChildren();
    if(!term){results.hidden=true;return;}
    const matches=data.nodes.filter(n=>(n.name+" "+n.en).toLocaleLowerCase().includes(term)).slice(0,10);
    for(const n of matches){
      const button=document.createElement("button");button.type="button";button.setAttribute("role","option");
      button.innerHTML='<strong>'+escape(n.name)+'</strong><small>'+escape(n.en)+" / "+typeName(n.type)+'</small>';
      button.addEventListener("click",()=>{search.value=n.name;results.hidden=true;switchView("network");selectNode(n.id,true);});
      results.append(button);
    }
    if(!matches.length){results.innerHTML='<button disabled>沒有符合的節點</button>';}
    results.hidden=false;
  }
  function exportCSV(){
    const header=["from_id","from","to_id","to","relationship","description","year","source_ids","source_urls"];
    const csvValue=v=>'"'+String(v??"").replace(/^([=+@-])/,"'$1").replace(/"/g,'""')+'"';
    const rows=data.edges.map(e=>{
      const ids=e.src||[];
      return [e.a,nodeMap.get(e.a).name,e.b,nodeMap.get(e.b).name,e.type,e.label,e.year||"",ids.join(";"),ids.map(id=>sourceMap.get(id)?.url||"").join(";")];
    });
    const content="\ufeff"+[header,...rows].map(row=>row.map(csvValue).join(",")).join("\r\n");
    const url=URL.createObjectURL(new Blob([content],{type:"text/csv;charset=utf-8;"}));
    const link=document.createElement("a");link.href=url;link.download="taiwan-architecture-atlas-connections.csv";
    document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  layout(); renderAxis(); renderSources(); renderGraph(); renderIndex();
  document.querySelectorAll(".topnav-link").forEach(b=>b.addEventListener("click",()=>switchView(b.dataset.view)));
  document.querySelectorAll('#filters input[type="checkbox"]').forEach(b=>b.addEventListener("change",()=>{
    if(b.checked)categories.add(b.value);else categories.delete(b.value);
    if(selected&&!visibleNode(nodeMap.get(selected))){selected=null;renderDetail();$("#detail-panel").classList.remove("open");}
    renderGraph();
  }));
  $("#year").addEventListener("input",e=>{
    limitYear=Number(e.target.value);$("#year-label").textContent=limitYear;
    if(selected&&!visibleNode(nodeMap.get(selected))){selected=null;renderDetail();$("#detail-panel").classList.remove("open");}
    renderGraph();
  });
  $("#year-all").addEventListener("click",()=>{limitYear=2026;$("#year").value=2026;$("#year-label").textContent=2026;renderGraph();});
  search.addEventListener("input",showSearchResults);
  search.addEventListener("keydown",e=>{
    if(e.key==="Escape")results.hidden=true;
    if(e.key==="Enter"){
      const term=search.value.toLowerCase().trim();
      const match=data.nodes.find(n=>(n.name+" "+n.en).toLowerCase().includes(term));
      if(match && term){results.hidden=true;selectNode(match.id,true);}
    }
  });
  document.addEventListener("click",e=>{if(!e.target.closest(".search-field")&&!e.target.closest(".search-results"))results.hidden=true;});
  document.addEventListener("keydown",e=>{if(e.key==="/"&&!["INPUT","TEXTAREA"].includes(document.activeElement.tagName)){e.preventDefault();search.focus();}});
  $("#index-search").addEventListener("input",renderIndex);
  $("#random-node").addEventListener("click",()=>{
    const pool=data.nodes.filter(visibleNode);
    if(pool.length){switchView("network");selectNode(pool[Math.floor(Math.random()*pool.length)].id,true);}
  });
  $("#reset-view").addEventListener("click",resetView);
  $("#zoom-in").addEventListener("click",()=>changeZoom(.8));
  $("#zoom-out").addEventListener("click",()=>changeZoom(1.25));
  $("#zoom-home").addEventListener("click",resetView);
  $("#export-csv").addEventListener("click",exportCSV);
  $("#detail-close").addEventListener("click",()=>{
    selected=null;renderGraph();renderDetail();$("#detail-panel").classList.remove("open");
    try{history.replaceState(null,"",location.pathname+location.search);}catch(_){}
  });
  $("#mobile-toggle").addEventListener("click",()=>{
    const open=!$("#sidebar").classList.contains("open");
    $("#sidebar").classList.toggle("open",open);
    $("#mobile-toggle").setAttribute("aria-expanded",String(open));
    $("#detail-panel").classList.remove("open");
  });
  frame.addEventListener("wheel",e=>{e.preventDefault();changeZoom(e.deltaY>0?1.12:.89,e.clientX,e.clientY);},{passive:false});
  frame.addEventListener("pointerdown",e=>{
    if(e.button!==0||e.target.closest(".graph-node")||e.target.closest("button"))return;
    pointerStart={x:e.clientX,y:e.clientY,box:{...viewBox}};
    frame.classList.add("panning");frame.setPointerCapture(e.pointerId);
  });
  frame.addEventListener("pointermove",e=>{
    if(!pointerStart)return;
    const rect=graph.getBoundingClientRect();
    viewBox.x=pointerStart.box.x-(e.clientX-pointerStart.x)/rect.width*pointerStart.box.w;
    viewBox.y=pointerStart.box.y-(e.clientY-pointerStart.y)/rect.height*pointerStart.box.h;
    updateViewBox();
  });
  const stopPan=()=>{pointerStart=null;frame.classList.remove("panning");};
  frame.addEventListener("pointerup",stopPan);
  frame.addEventListener("pointercancel",stopPan);
  frame.addEventListener("lostpointercapture",stopPan);
  frame.addEventListener("dblclick",e=>{if(!e.target.closest(".graph-node"))resetView();});
  frame.addEventListener("keydown",e=>{
    if(document.activeElement!==frame)return;
    const amount=65*(viewBox.w/1500);
    if(e.key==="ArrowLeft")viewBox.x-=amount;else if(e.key==="ArrowRight")viewBox.x+=amount;
    else if(e.key==="ArrowUp")viewBox.y-=amount;else if(e.key==="ArrowDown")viewBox.y+=amount;
    else if(e.key==="+"||e.key==="="){changeZoom(.8);e.preventDefault();return;}
    else if(e.key==="-"){changeZoom(1.25);e.preventDefault();return;}
    else return;
    e.preventDefault();updateViewBox();
  });
  window.addEventListener("hashchange",()=>{
    const id=decodeURIComponent((location.hash.match(/^#entity=(.*)$/)||[])[1]||"");
    if(nodeMap.has(id)){switchView("network");selectNode(id,true);}
  });
  const incoming=decodeURIComponent((location.hash.match(/^#entity=(.*)$/)||[])[1]||"");
  if(nodeMap.has(incoming)){selectNode(incoming,true);}
})();