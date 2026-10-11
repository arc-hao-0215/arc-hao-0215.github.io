(()=>{'use strict';
const D=window.TAIWAN_ATLAS_DATA;
if(!D){document.body.textContent='Atlas data not found.';return;}
const $=id=>document.getElementById(id);
const byId=new Map(D.nodes.map(n=>[n.id,n]));
const T=D.types, R=D.regions, K=D.relations;
const colors={person:'#4d7e98',office:'#a98252',building:'#c84c38',school:'#627d65',institution:'#627d65',publication:'#867c9b',collective:'#867c9b'};
const edgeColors={design:'#c84c38',contribute:'#a98252',campus:'#4d7e98',located:'#627d65',found:'#a98252',led:'#627d65',education:'#4d7e98',subject:'#867c9b'};
const st={types:new Set(Object.keys(T)),regions:new Set(R.map(x=>x.id)),relations:new Set(Object.keys(K)),year:2026,query:'',selected:null,hideUndated:false,history:[],view:{x:0,y:0,w:2300,h:1100},pointer:null,dragged:false,story:null,storyIndex:0};
const svg=$('graph'), area=$('graphContainer'), tip=$('hoverTip'), container=$('app');
const NS='http://www.w3.org/2000/svg', X0=255, X1=1640, y0=170, YSTEP=188, VIEW_W=2310;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const linkSafe=u=>typeof u==='string'&&/^https:\/\//i.test(u)?u:'#';
const text=(tag,txt,attrs={})=>{const a=document.createElementNS(NS,tag);a.textContent=txt;Object.entries(attrs).forEach(([k,v])=>a.setAttribute(k,v));return a};
const elem=(tag,attrs={})=>text(tag,'',attrs);
const regionIndex=id=>R.findIndex(x=>x.id===id);
const regionName=id=>R.find(x=>x.id===id)?.name||id;
const xYear=y=>X0+((y-1900)/130)*(X1-X0);
const timeLabel=n=>n.year==null?'年份待考':String(n.year);
const visible=n=>st.types.has(n.type)&&st.regions.has(n.region)&&(n.year==null?!st.hideUndated:n.year<=st.year);
let positions=new Map();
function computePositions(){
 positions=new Map();
 for(const rg of R){
  const list=D.nodes.filter(n=>n.region===rg.id).sort((a,b)=>(a.year??9999)-(b.year??9999)||a.name.localeCompare(b.name,'zh-Hant'));
  const end=new Array(9).fill(-9999);let missing=0;
  for(const n of list){
   const x=n.year==null?1890+(missing%2)*104:xYear(n.year);
   let slot=0, score=Infinity;const width=Math.min(195,42+n.name.length*14);
   for(let i=0;i<9;i++){const bad=Math.max(0,end[i]+14-x);if(bad<score){score=bad;slot=i}}
   if(n.year==null){slot=missing%9;missing++}
   const offsets=[0,-25,25,-50,50,-75,75,-98,98];
   const y=y0+regionIndex(rg.id)*YSTEP+offsets[slot];
   end[slot]=Math.max(end[slot],x+width);
   positions.set(n.id,{x,y});
  }
 }
}
function setView(){svg.setAttribute('viewBox',[st.view.x,st.view.y,st.view.w,st.view.h].join(' '))}
function fit(){
 const r=area.getBoundingClientRect(),ratio=Math.max(.30,r.height/Math.max(r.width,1));
 st.view={x:0,w:VIEW_W,h:VIEW_W*ratio,y:540-(VIEW_W*ratio)/2};setView();
}
function SVGappend(parent,tag,attrs={},string){let e=elem(tag,attrs);if(string!=null)e.textContent=string;parent.appendChild(e);return e;}
function drawBackground(){
 const g=SVGappend(svg,'g',{'aria-hidden':'true'});
 SVGappend(g,'rect',{x:0,y:0,width:2320,height:1110,fill:'transparent'});
 for(const yr of [1900,1920,1940,1960,1980,2000,2020]){
  const x=xYear(yr);SVGappend(g,'line',{x1:x,y1:45,x2:x,y2:1090,class:'year-line'});
  SVGappend(g,'text',{x,y:46,class:'axis-year'},String(yr));
 }
 SVGappend(g,'rect',{x:1835,y:57,width:350,height:1025,class:'undated-zone',rx:5});
 SVGappend(g,'text',{x:1860,y:48,class:'axis-label'},'YEAR UNKNOWN / 年份待考');
 R.forEach((rg,i)=>{
  const cy=y0+i*YSTEP; SVGappend(g,'rect',{x:0,y:cy-89,width:2290,height:178,class:'lane-band'});
  SVGappend(g,'line',{x1:38,y1:cy+94,x2:2220,y2:cy+94,class:'lane-line'});
  SVGappend(g,'text',{x:35,y:cy-20,class:'axis-label'},rg.name);
  SVGappend(g,'text',{x:35,y:cy-1,class:'axis-sub'},rg.en.toUpperCase());
 });
 SVGappend(g,'text',{x:X0,y:19,class:'axis-sub'},'PERSON · BIRTH YEAR / OTHERS · DOCUMENTED EVENT YEAR');
 SVGappend(g,'text',{x:1860,y:70,class:'axis-sub'},'NO DATE IN THE CITED SOURCES');
}
const neighbours=id=>new Set(D.edges.filter(e=>st.relations.has(e.type)&&(e.from===id||e.to===id)).map(e=>e.from===id?e.to:e.from));
function activeEdges(){
 return D.edges.filter(e=>st.relations.has(e.type)&&visible(byId.get(e.from))&&visible(byId.get(e.to)));
}
function draw(){
 svg.replaceChildren();drawBackground();
 const all=D.nodes.filter(visible),shown=new Set(all.map(n=>n.id));
 const adjacent=st.selected?neighbours(st.selected):null;
 const edges=SVGappend(svg,'g',{id:'edge-layer'});
 for(const e of D.edges){
  if(!st.relations.has(e.type)||!shown.has(e.from)||!shown.has(e.to))continue;
  const a=positions.get(e.from),b=positions.get(e.to);
  if(!a||!b)continue;
  const direct=st.selected&&(e.from===st.selected||e.to===st.selected);
  const mid=(a.x+b.x)/2;
  const path=SVGappend(edges,'path',{d:'M '+a.x+' '+a.y+' C '+mid+' '+a.y+' '+mid+' '+b.y+' '+b.x+' '+b.y,class:'edge'+(direct?' is-active':''),stroke:edgeColors[e.type]||'#aaa'});
  if(st.selected&&!direct)path.style.opacity='.035';
 }
 const group=SVGappend(svg,'g',{id:'node-layer'});
 for(const n of all){
  const p=positions.get(n.id),selected=n.id===st.selected,near=adjacent?.has(n.id);
  let cls='node'+(selected?' is-selected':'')+(near?' is-highlight':'')+(st.selected&&!selected&&!near?' is-dim':'');
  if(st.query&&!st.selected){const q=st.query.toLocaleLowerCase();if(!(n.name+' '+n.english+' '+n.summary).toLocaleLowerCase().includes(q))cls+=' is-dim'}
  const g=SVGappend(group,'g',{class:cls,'data-id':n.id,transform:'translate('+p.x+' '+p.y+')',role:'button',tabindex:'0','aria-label':n.name+'，'+T[n.type]});
  SVGappend(g,'circle',{class:'halo',cx:0,cy:0,r:14,fill:'none',stroke:colors[n.type], 'stroke-width':2});
  const fill=selected?colors[n.type]:'var(--bg)',stroke=colors[n.type];
  if(n.type==='person')SVGappend(g,'circle',{class:'glyph',cx:0,cy:0,r:selected?6:5,fill,stroke});
  else if(n.type==='building')SVGappend(g,'rect',{class:'glyph',x:-5,y:-5,width:10,height:10,fill,stroke});
  else if(n.type==='office')SVGappend(g,'rect',{class:'glyph',x:-6,y:-4,width:12,height:8,rx:2,fill,stroke});
  else SVGappend(g,'path',{class:'glyph',d:'M0 -6 L6 0 L0 6 L-6 0Z',fill,stroke});
  const unknown=n.year==null, align=unknown?'end':'start', lx=unknown?-11:11;
  SVGappend(g,'text',{x:lx,y:-5,'text-anchor':align},n.name);
  SVGappend(g,'text',{class:'node-year',x:lx,y:11,'text-anchor':align},(n.year??'—')+' · '+T[n.type]);
 }
 $('statNodes').textContent=all.length;
 $('statEdges').textContent=activeEdges().length;
 $('statSources').textContent=new Set(all.flatMap(n=>n.sources).concat(activeEdges().map(e=>e.source))).size;
 $('focusLabel').textContent=st.story?'閱讀路徑 / '+(st.storyIndex+1)+' / '+st.story.ids.length+' · '+st.story.name:(st.selected?'選取 / '+byId.get(st.selected).name:'全域視圖 / ALL RELATIONSHIPS');
 $('clearFocus').disabled=!st.selected;
}
function showNode(id,fromHistory=false){
 if(!byId.has(id))return;
 if(st.selected&&!fromHistory&&st.selected!==id)st.history.push(st.selected);
 st.selected=id;location.hash=encodeURIComponent(id);
 $('detailPanel').classList.remove('hidden');$('app').querySelector('.layout').classList.add('has-detail');
 detail(id);draw();hideTooltip();
}
function clearSelection(){
 st.selected=null;st.story=null;$('detailPanel').classList.add('hidden');
 $('app').querySelector('.layout').classList.remove('has-detail');
 if(location.hash)history.replaceState(null,'',location.pathname+location.search);
 const sn=$('storyNav');if(sn)sn.remove();draw();
}
function detail(id){
 const n=byId.get(id);$('detailIndex').textContent=String(D.nodes.indexOf(n)+1).padStart(2,'0');
 $('detailType').textContent=T[n.type].toUpperCase()+' / '+regionName(n.region);
 $('detailTitle').textContent=n.name;$('detailEnglish').textContent=n.english;
 $('detailMeta').innerHTML='<span>時間 <strong>'+esc(timeLabel(n))+'</strong></span><span>地域 <strong>'+esc(regionName(n.region))+'</strong></span>';
 $('detailSummary').textContent=n.summary;
 const related=D.edges.filter(e=>st.relations.has(e.type)&&(e.from===id||e.to===id)).sort((a,b)=>(a.year??9999)-(b.year??9999));
 $('connectionCount').textContent=related.length;
 $('detailConnections').innerHTML=related.length?related.map(e=>{
 const other=byId.get(e.from===id?e.to:e.from);
 return '<button type="button" class="relation-card" data-jump="'+esc(other.id)+'"><span class="relation-icon">↗</span><span><strong>'+esc(other.name)+'</strong><small>'+esc(e.label===e.type?K[e.type]:e.label)+' · '+esc(other.year??'年代未確認')+'</small></span></button>';
 }).join(''):'<p class="detail-en">此節點目前沒有已記錄的關係。</p>';
 const urls=[...new Set(n.sources.concat(related.map(e=>e.source)))];
 $('detailSources').innerHTML=urls.map((url,i)=>'<a href="'+esc(linkSafe(url))+'" target="_blank" rel="noopener noreferrer">['+String(i+1).padStart(2,'0')+'] '+esc((()=>{try{return new URL(url).hostname}catch{return '資料來源'}})())+' ↗</a>').join('');
 $('backDetail').disabled=st.history.length===0;
}
function searchResults(){
 const wrap=$('searchResults');wrap.replaceChildren();
 const q=st.query.trim().toLocaleLowerCase();if(!q)return;
 const matches=D.nodes.filter(n=>(n.name+' '+n.english+' '+n.summary).toLocaleLowerCase().includes(q)).slice(0,8);
 for(const n of matches){
  const b=document.createElement('button');b.type='button';b.className='search-hit';
  b.innerHTML='<span>'+esc(n.name)+'</span><small>'+esc(T[n.type])+'</small>';b.onclick=()=>showNode(n.id);wrap.appendChild(b);
 }
 if(!matches.length)wrap.textContent='找不到符合的節點。';
}
function buildFilters(){
 const wrap=$('typeFilters');
 for(const [type,label] of Object.entries(T)){
  const l=document.createElement('label');l.className='filter-item';
  const input=document.createElement('input');input.type='checkbox';input.checked=true;input.value=type;
  input.addEventListener('change',()=>{input.checked?st.types.add(type):st.types.delete(type);draw()});
  l.append(input);
  const symbol=document.createElement('i');symbol.className='filter-symbol '+type;l.append(symbol);
  const name=document.createElement('span');name.textContent=label;name.style.flex='1';l.append(name);
  const count=document.createElement('span');count.className='count';count.textContent=D.nodes.filter(n=>n.type===type).length;l.append(count);wrap.append(l);
 }
 const region=$('regionFilters');
 for(const rg of R){const b=document.createElement('button');b.type='button';b.className='region-chip active';b.textContent=rg.name;b.dataset.region=rg.id;
  b.onclick=()=>{st.regions.has(rg.id)?st.regions.delete(rg.id):st.regions.add(rg.id);b.classList.toggle('active',st.regions.has(rg.id));draw()};
  region.append(b);
 }
 const relations=$('connectionsPanel');
 for(const [type,label] of Object.entries(K)){
  const l=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.checked=true;
  input.onchange=()=>{input.checked?st.relations.add(type):st.relations.delete(type);draw();if(st.selected)detail(st.selected)};
  l.append(input,document.createTextNode(label));relations.append(l);
 }
}
function showTooltip(id,e){
 const n=byId.get(id);if(!n)return;
 tip.innerHTML='<strong>'+esc(n.name)+'</strong><small>'+esc(T[n.type])+' · '+esc(timeLabel(n))+' · '+esc(regionName(n.region))+'</small>';tip.style.display='block';
 positionTooltip(e);
}
function positionTooltip(e){
 if(tip.style.display!=='block')return;
 const r=area.getBoundingClientRect();
 tip.style.left=Math.min(e.clientX-r.left+16,r.width-210)+'px';tip.style.top=Math.max(8,Math.min(e.clientY-r.top-45,r.height-65))+'px';
}
function hideTooltip(){tip.style.display='none'}
function zoom(factor,clientX,clientY){
 const r=svg.getBoundingClientRect(),px=clientX==null?.5:(clientX-r.left)/r.width,py=clientY==null?.5:(clientY-r.top)/r.height;
 const w=Math.min(3300,Math.max(350,st.view.w*factor)),ratio=r.height/Math.max(r.width,1),h=w*ratio;
 st.view.x+=(st.view.w-w)*px;st.view.y+=(st.view.h-h)*py;st.view.w=w;st.view.h=h;setView();
}
const stories=[
 {name:'戰後現代主義',desc:'由王大閎的自宅與紀念館，走向東海校園及路思義教堂。',ids:['wang','house','sun','pei','chen','chang','luce','thu']},
 {name:'教育與博物館',desc:'追索漢寶德的建築教育、博物館治理與跨世代關係。',ids:['han','nmns','tnnua','yao','hanmuseum']},
 {name:'環境與公共建築',desc:'透過九典聯合觀察市場、住宅與國家公園設施。',ids:['kuo','qing','baf','taijiang','housing','nanmen']},
 {name:'宜蘭的地方實踐',desc:'從黃聲遠到田中央與宜蘭公共地景。',ids:['huang','field','cherry','fieldbook']},
 {name:'女性建築師的實踐',desc:'由修澤蘭與王秋華，連結作品、機構及當代專業實踐。',ids:['xiu','zhongshan','chiu','library','women','qing']}
];
function makeStoryNav(){
 let nav=$('storyNav');if(nav)nav.remove();if(!st.story)return;
 nav=document.createElement('div');nav.id='storyNav';nav.className='story-nav';
 nav.innerHTML='<button type="button" id="storyPrev">←</button><span>'+esc(st.story.name)+' · '+(st.storyIndex+1)+'/'+st.story.ids.length+'</span><button type="button" id="storyNext">→</button><button type="button" id="storyExit">×</button>';
 area.append(nav);
 $('storyPrev').disabled=st.storyIndex===0;$('storyNext').disabled=st.storyIndex===st.story.ids.length-1;
 $('storyPrev').onclick=()=>storyStep(-1);$('storyNext').onclick=()=>storyStep(1);$('storyExit').onclick=()=>{st.story=null;nav.remove();draw()};
}
function storyStep(dir){if(!st.story)return;st.storyIndex=Math.max(0,Math.min(st.story.ids.length-1,st.storyIndex+dir));showNode(st.story.ids[st.storyIndex]);makeStoryNav()}
function modal(kind){
 $('modalBackdrop').classList.remove('hidden');
 if(kind==='guide'){
  $('modalTitle').textContent='如何閱讀這張圖？';
  $('modalContent').innerHTML='<h3>01 / 時間 × 地域</h3><p>橫向是時間：人物使用出生年；作品使用可靠資料中的完成年；出版及事務所則使用有文獻的事件年。縱向是與節點最直接相關的台灣工作／所在地區；跨國參與者放在跨地域區。地域不是出生地，沒有查證的年代一律留在右方待考區。</p><h3>02 / 節點 × 關係</h3><p>藍色圓點是人物；金色矩形是事務所；紅色方形是建築；菱形代表機構、教育或出版。點選任何節點，查看已記錄的關係及原始資料連結。沒有線，不代表歷史上絕對沒有關係。</p><h3>03 / 搜尋 × 縮放</h3><p>使用左側類型、地域及時間篩選，右上方控制關係類型。拖曳圖面以平移、滾輪縮放，按 / 聚焦搜尋，Esc 清除選取。資料為選樣初版，不包含所有台灣建築師。</p><p><a href="methodology.html">閱讀完整方法及資料政策 ↗</a></p>';
 }else{
  $('modalTitle').textContent='以一條關係開始探索';
  $('modalContent').innerHTML='<p>從一個人物開始，沿著人物、機構、作品或出版形成的鏈條逐步閱讀。</p>'+stories.map((s,i)=>'<button type="button" class="step" data-story="'+i+'"><span>PATH '+String(i+1).padStart(2,'0')+' / '+s.ids.length+' STOPS</span><strong>'+esc(s.name)+'</strong><small>'+esc(s.desc)+'</small></button>').join('');
 }
}
function closeModal(){$('modalBackdrop').classList.add('hidden')}
function events(){
 $('searchInput').addEventListener('input',e=>{st.query=e.target.value;searchResults();draw()});
 $('searchClear').onclick=()=>{st.query='';$('searchInput').value='';searchResults();draw()};
 $('allTypes').onclick=()=>{st.types=new Set(Object.keys(T));$('typeFilters').querySelectorAll('input').forEach(x=>x.checked=true);draw()};
 $('allRegions').onclick=()=>{st.regions=new Set(R.map(x=>x.id));$('regionFilters').querySelectorAll('button').forEach(x=>x.classList.add('active'));draw()};
 $('yearRange').oninput=e=>{st.year=+e.target.value;$('yearVal').textContent=st.year;draw()};
 $('hideUndated').onchange=e=>{st.hideUndated=e.target.checked;draw()};
 $('connectionsBtn').onclick=()=>{const p=$('connectionsPanel');p.classList.toggle('hidden');$('connectionsBtn').setAttribute('aria-expanded',String(!p.classList.contains('hidden')))};
 $('clearFocus').onclick=clearSelection;$('closeDetail').onclick=clearSelection;
 $('zoomIn').onclick=()=>zoom(.8);$('zoomOut').onclick=()=>zoom(1.25);$('fitView').onclick=fit;
 $('backDetail').onclick=()=>{const prev=st.history.pop();if(prev)showNode(prev,true)};
 $('shareDetail').onclick=()=>{const url=location.href;const b=$('shareDetail');if(navigator.clipboard?.writeText)navigator.clipboard.writeText(url).then(()=>{b.textContent='連結已複製 ✓';setTimeout(()=>b.textContent='複製節點連結 ↗',1800)});else window.prompt('複製此網址',url)};
 $('detailConnections').addEventListener('click',e=>{const b=e.target.closest('[data-jump]');if(b)showNode(b.dataset.jump)});
 $('guideBtn').onclick=()=>modal('guide');$('storiesBtn').onclick=()=>modal('stories');$('modalClose').onclick=closeModal;
 $('modalBackdrop').onclick=e=>{if(e.target===$('modalBackdrop'))closeModal()};
 $('modalContent').addEventListener('click',e=>{const b=e.target.closest('[data-story]');if(!b)return;st.story=stories[+b.dataset.story];st.storyIndex=0;closeModal();showNode(st.story.ids[0]);makeStoryNav()});
 $('themeBtn').onclick=()=>{document.documentElement.classList.toggle('dark');$('themeBtn').setAttribute('aria-label',document.documentElement.classList.contains('dark')?'切換淺色模式':'切換深色模式')};
 svg.addEventListener('click',e=>{if(st.dragged){st.dragged=false;return}const node=e.target.closest('[data-id]');if(node)showNode(node.dataset.id);else if(st.selected)clearSelection()});
 svg.addEventListener('keydown',e=>{const node=e.target.closest('[data-id]');if(node&&(e.key==='Enter'||e.key===' ')){e.preventDefault();showNode(node.dataset.id)}});
 svg.addEventListener('pointerover',e=>{const node=e.target.closest('[data-id]');if(node)showTooltip(node.dataset.id,e)});
 svg.addEventListener('pointerout',e=>{if(e.target.closest('[data-id]'))hideTooltip()});
 svg.addEventListener('pointermove',e=>{
  if(st.pointer){
   const dx=e.clientX-st.pointer.x,dy=e.clientY-st.pointer.y;
   if(Math.abs(dx)+Math.abs(dy)>3)st.dragged=true;
   st.view.x-=dx/svg.clientWidth*st.view.w;st.view.y-=dy/svg.clientHeight*st.view.h;
   st.pointer={x:e.clientX,y:e.clientY};setView();
  }else positionTooltip(e);
 });
 svg.addEventListener('pointerdown',e=>{if(e.button!==0)return;st.pointer={x:e.clientX,y:e.clientY};st.dragged=false;svg.classList.add('panning');svg.setPointerCapture(e.pointerId);hideTooltip()});
 const end=()=>{st.pointer=null;svg.classList.remove('panning')};svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);
 svg.addEventListener('wheel',e=>{e.preventDefault();zoom(Math.exp(e.deltaY*.001),e.clientX,e.clientY)},{passive:false});
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeModal();$('connectionsPanel').classList.add('hidden');if(st.selected)clearSelection()}
  if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();$('searchInput').focus()}
  if(st.story&&e.key==='ArrowRight')storyStep(1);
  if(st.story&&e.key==='ArrowLeft')storyStep(-1);
 });
 let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{const old=st.view.w;fit();if(old<VIEW_W)zoom(old/VIEW_W)},100)});
 window.addEventListener('hashchange',()=>{const id=decodeURIComponent(location.hash.slice(1));if(id&&byId.has(id)&&id!==st.selected)showNode(id,true)});
}
const style=document.createElement('style');style.textContent='.story-nav{position:absolute;top:16px;left:16px;z-index:7;display:flex;gap:9px;align-items:center;background:var(--paper);border:1px solid var(--rule);padding:7px 10px;border-radius:4px;box-shadow:0 4px 16px #0001}.story-nav span{font-size:11px}.story-nav button{border:0;background:var(--soft);border-radius:3px;padding:6px 10px}';document.head.append(style);
computePositions();buildFilters();events();fit();draw();
try{const id=decodeURIComponent(location.hash.slice(1));if(byId.has(id))showNode(id,true)}catch(e){}
})();
