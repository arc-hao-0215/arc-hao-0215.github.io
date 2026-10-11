(() => {
"use strict";
const D=window.ATLAS_DATA;
if(!D){document.body.insertAdjacentHTML("afterbegin",'<p role="alert">Research records failed to load.</p>');return;}
const $=q=>document.querySelector(q), $$=q=>Array.from(document.querySelectorAll(q));
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const canvas=$("#network"),ctx=canvas.getContext("2d",{alpha:false});
if(!ctx){$("#stage-caption").textContent="A canvas-capable browser is required.";return;}
const nodes=D.nodes,edges=D.edges;
const byId=new Map(nodes.map(n=>[n.id,n])),sources=new Map(D.sources.map(s=>[s.id,s]));
const edgeAdj=new Map(nodes.map(n=>[n.id,[]]));
edges.forEach((e,i)=>{e._i=i;edgeAdj.get(e.a)?.push(e);edgeAdj.get(e.b)?.push(e);});
const rules=D.relationshipGrammar||{};
const semantic=e=>e.semantic||"associated";
const config=key=>rules[key]||{en:key.toUpperCase(),zh:key,color:"#b0b8ba",dash:[],order:99};
const allCats=[...new Set(nodes.map(n=>n.type))],allRels=[...new Set(edges.map(semantic))];
const categories={person:"Architects & people",practice:"Offices / 事務所",institution:"Institutions",work:"Works / 建築作品",publication:"Books & discourse",event:"Events & exhibitions"};
const regions=[
 {name:"Europe",label:"EUROPE",cy:185},
 {name:"United States / Global",label:"UNITED STATES / GLOBAL",cy:390},
 {name:"Japan / East Asia",label:"JAPAN / EAST ASIA",cy:585},
 {name:"Taiwan — North",label:"TAIWAN / NORTH",cy:795},
 {name:"Taiwan — North & Yilan",label:"TAIWAN / YILAN",cy:980},
 {name:"Taiwan — Central",label:"TAIWAN / CENTRAL",cy:1185},
 {name:"Taiwan — Across Regions",label:"TAIWAN / CROSS-REGIONAL",cy:1375},
 {name:"Region to verify",label:"REGION TO VERIFY",cy:1615}
];
const WORLD={width:4300,height:2110,yearStart:1880,yearEnd:1995};
const coordinate=yr=>155+(yr-WORLD.yearStart)*22.1;
const hash=s=>{let h=2166136261>>>0;for(const c of String(s)){h=Math.imul(h^c.codePointAt(0),16777619)>>>0;}return h;};
const jitter=(s,salt=0)=>((hash(s+"|"+salt)%10000)/10000)-.5;
const degrees=new Map(nodes.map(n=>[n.id,edgeAdj.get(n.id)?.length||0]));
const state={dark:true,selected:null,mode:"map",region:null,types:new Set(allCats),relations:new Set(allRels),through:2026,featured:null,history:[],historyIndex:-1};
const camera={scale:.42,x:0,y:0,min:.16,max:3.5};
let W=0,H=0,dpr=1,raf=0,pointers=new Map(),dragged=false,originCamera=null,hover=null,canvasHits=[];
let nearestItems=[];
const nodeColor={person:"#e6e7e2",practice:"#b7cea8",institution:"#a7c6dc",work:"#b6a1c5",publication:"#e2b78d",event:"#d3b38b"};
const relatedTo=id=>edgeAdj.get(id)||[];
const other=(e,id)=>byId.get(e.a===id?e.b:e.a);
const verifiedBirth=n=>n.type==="person"&&Number.isFinite(n.birthYear);
const isVisible=n=>{
 if(!state.types.has(n.type))return false;
 if(n.type==="person"&&verifiedBirth(n)&&n.birthYear>state.through)return false;
 return true;
};
const isEdgeVisible=e=>state.relations.has(semantic(e))&&isVisible(byId.get(e.a))&&isVisible(byId.get(e.b))&&(!Number.isFinite(e.year)||e.year<=state.through);
function decorate(){
 const withBirth=nodes.filter(verifiedBirth);
 const withoutBirth=nodes.filter(n=>n.type==="person"&&!verifiedBirth(n));
 // Documented birth coordinates ONLY. Repeated birth years are separated vertically,
 // never silently shifted to another year.
 const withinBand=new Map();
 withBirth.sort((a,b)=>a.birthYear-b.birthYear||a.name.localeCompare(b.name,"zh-Hant")).forEach(n=>{
   const reg=regions.find(r=>r.name===n.workRegion)||regions[7];
   const key=reg.name+"|"+n.birthYear;
   const tally=withinBand.get(key)||0;withinBand.set(key,tally+1);
   n._x=coordinate(n.birthYear);n._y=reg.cy+jitter(n.id,5)*130+tally*43;
   n._coordinateMeaning="verified-birth";n._radius=5.2;
 });
 // Undocumented births have their own separate, explicitly unlabeled temporal
 // inventory. Their x values are not interpretable as years.
 const remaining=withoutBirth.sort((a,b)=>a.name.localeCompare(b.name,"zh-Hant"));
 remaining.forEach((n,i)=>{
   const col=i%4,row=Math.floor(i/4);
   n._x=3000+col*315+jitter(n.id,9)*18;
   n._y=150+row*76;
   n._coordinateMeaning="birth-unverified";n._radius=4.2;
 });
 const placeOf=new Map();
 // Offices attach visually to associated individuals, or to an office index
 // if no documented person association exists.
 let unassigned=0;
 const offices=nodes.filter(n=>n.type==="practice").sort((a,b)=>(degrees.get(b.id)||0)-(degrees.get(a.id)||0));
 offices.forEach(n=>{
   const people=relatedTo(n.id).map(e=>other(e,n.id)).filter(x=>x?.type==="person");
   const preferred=people.find(verifiedBirth)||people[0];
   if(preferred){
     const slot=placeOf.get(preferred.id)||0;placeOf.set(preferred.id,slot+1);
     n._x=preferred._x+90+Math.floor(slot/6)*45;
     n._y=preferred._y+38+(slot%6)*20;
   }else{
     const col=unassigned%3,row=Math.floor(unassigned/3);unassigned++;
     n._x=3170+col*280;
     n._y=165+row*82;
   }
   n._coordinateMeaning="attached-to-person-or-office-index";n._radius=3.5;
 });
 // Works orbit their practice. An award-year will NEVER determine where an
 // architect or a practice appears in the birth-year axis.
 const usage=new Map();
 nodes.filter(n=>n.type==="work").forEach(n=>{
   const firms=relatedTo(n.id).filter(e=>["designed","collaborated","consulted"].includes(semantic(e)))
     .map(e=>other(e,n.id)).filter(x=>x?.type==="practice");
   const persons=relatedTo(n.id).map(e=>other(e,n.id)).filter(x=>x?.type==="person");
   const anchor=firms[0]||persons[0];
   if(anchor){
     const count=usage.get(anchor.id)||0;usage.set(anchor.id,count+1);
     n._x=anchor._x+58+(count%4)*26;
     n._y=anchor._y+(Math.floor(count/4)-1)*18+(count%4)*10;
   }else{
     const i=usage.get("unassigned")||0;usage.set("unassigned",i+1);
     n._x=3480+(i%3)*165;
     n._y=170+Math.floor(i/3)*53;
   }
   n._coordinateMeaning="attached-work";n._radius=2.35;
 });
 // Institutions/publications anchored near an actual connected person.
 const otherUse=new Map();
 nodes.filter(n=>["institution","publication","event"].includes(n.type)).forEach(n=>{
   const relations=relatedTo(n.id).map(e=>other(e,n.id)).filter(x=>x?.type==="person");
   const a=relations.find(verifiedBirth)||relations[0];
   if(a){
     const i=otherUse.get(a.id)||0;otherUse.set(a.id,i+1);
     n._x=a._x+(n.type==="institution"?-78:105);
     n._y=a._y-30-i*25;
   }else {
     const idx=otherUse.get("other")||0;otherUse.set("other",idx+1);
     n._x=2950+(idx%4)*220;
     n._y=180+Math.floor(idx/4)*75;
   }
   n._coordinateMeaning="person-related-annotation";n._radius=2.9;
 });
}
function getTheme(){return state.dark?{
 bg:"#111416",ink:"#dbe0dd",muted:"#82919a",grid:"#343b3f",faint:"#3a4245",dim:"#646c6e"
}:{bg:"#f5f5f2",ink:"#172123",muted:"#637070",grid:"#cbd1cc",faint:"#ced2cf",dim:"#9fa6a2"};}
function resetFit(){
 const plotWidth=2900;
 camera.scale=Math.min((W-105)/plotWidth,(H-110)/1720);
 camera.scale=Math.max(camera.min,camera.scale);
 camera.x=(W-plotWidth*camera.scale)/2-90*camera.scale;
 camera.y=(H-1720*camera.scale)/2+20;
 schedule();
}
function toScreen(n){return{x:n._x*camera.scale+camera.x,y:n._y*camera.scale+camera.y};}
function focusAt(x,y,targetScale){
 const maxWidth=W-($("#drawer").hidden?0:Math.min(W*.4,380));
 camera.scale=Math.max(camera.min,Math.min(camera.max,targetScale||Math.max(.68,camera.scale)));
 camera.x=maxWidth*.48-x*camera.scale;camera.y=H*.48-y*camera.scale;
 schedule();
}
function focusNode(n){if(n)focusAt(n._x,n._y,.9);}
function resize(){
 const rect=canvas.getBoundingClientRect();W=Math.max(320,rect.width);H=Math.max(260,rect.height);
 dpr=Math.min(2,devicePixelRatio||1);
 canvas.width=Math.floor(W*dpr);canvas.height=Math.floor(H*dpr);
 ctx.setTransform(dpr,0,0,dpr,0,0);
 if(!resize.didFit){resetFit();resize.didFit=true;}else schedule();
}
function schedule(){if(!raf)raf=requestAnimationFrame(draw);}
function drawGrid(t){
 ctx.strokeStyle=t.grid;ctx.lineWidth=.7;ctx.globalAlpha=.33;
 for(const yr of [1880,1900,1920,1940,1960,1980]){
   const x=coordinate(yr)*camera.scale+camera.x;
   if(x<0||x>W)continue;
   ctx.beginPath();ctx.moveTo(x,60);ctx.lineTo(x,H-36);ctx.stroke();
 }
 // Region band divisions: visual Y tracks are not countries of citizenship.
 for(const reg of regions){
   const y=reg.cy*camera.scale+camera.y;
   if(y<0||y>H)continue;
   ctx.beginPath();ctx.moveTo(0,y+72*camera.scale);ctx.lineTo(W,y+72*camera.scale);ctx.stroke();
 }
 ctx.globalAlpha=1;
 const sx=3000*camera.scale+camera.x;
 if(sx>0&&sx<W){
   ctx.fillStyle=t.muted;ctx.font="10px 'DM Mono',monospace";ctx.fillText("BIRTH YEAR NOT VERIFIED  →",sx,80);
 }
}
function drawCurve(a,b){
 const x=a.x,y=a.y,tx=b.x,ty=b.y;
 const offset=Math.min(110,Math.abs(tx-x)*.12+7);
 ctx.moveTo(x,y);ctx.bezierCurveTo(x+offset,y,tx-offset,ty,tx,ty);
}
function neighborsForFocus(id){
 const found=new Set([id]);
 for(const e of relatedTo(id))if(isEdgeVisible(e))found.add(other(e,id).id);
 // Add office's works as a second stage for a person focused on a practice.
 const main=byId.get(id);
 if(main?.type==="person")for(const e of relatedTo(id)){
   const o=other(e,id);
   if(o?.type==="practice"&&isEdgeVisible(e)){
     for(const pe of relatedTo(o.id)){
       const work=other(pe,o.id);
       if(work?.type==="work"&&isEdgeVisible(pe))found.add(work.id);
     }
   }
 }
 return found;
}
function drawLinks(t,selection,seen){
 const important=[];
 ctx.lineCap="round";
 for(const e of edges){
   if(!isEdgeVisible(e))continue;
   const a=byId.get(e.a),b=byId.get(e.b),focus=selection&&(e.a===selection||e.b===selection);
   const adjacent=selection&&seen?.has(e.a)&&seen?.has(e.b);
   const priority=focus?2:adjacent?1:0;
   if(priority){important.push({e,priority});continue;}
   if(state.featured&&!state.featured.has(e.a)&&!state.featured.has(e.b))continue;
   if(!state.selected&&!["person","practice"].includes(a.type)&&!["person","practice"].includes(b.type))continue;
   const p=toScreen(a),q=toScreen(b);
   if((p.x<0&&q.x<0)||(p.x>W&&q.x>W)||(p.y<0&&q.y<0)||(p.y>H&&q.y>H))continue;
   const spec=config(semantic(e));
   ctx.beginPath();drawCurve(p,q);ctx.strokeStyle=spec.color;
   ctx.setLineDash(spec.dash||[]);ctx.lineWidth=.8;ctx.globalAlpha=.12;ctx.stroke();ctx.globalAlpha=1;ctx.setLineDash([]);
 }
 important.sort((a,b)=>a.priority-b.priority).forEach(({e,priority})=>{
   const a=byId.get(e.a),b=byId.get(e.b);
   const p=toScreen(a),q=toScreen(b);const spec=config(semantic(e));
   ctx.beginPath();drawCurve(p,q);
   ctx.strokeStyle=spec.color;ctx.setLineDash(spec.dash||[]);
   ctx.lineWidth=priority===2?2.1:1.05;ctx.globalAlpha=priority===2?1:.35;
   ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;
 });
}
function drawNodes(t,seen){
 const active=state.selected,paint=nodes.filter(isVisible).sort((a,b)=>(a.type==="person"?3:0)-(b.type==="person"?3:0));
 canvasHits=[];nearestItems=[];
 const labels=[];
 for(const n of paint){
   const p=toScreen(n);if(p.x< -50||p.x>W+50||p.y<75||p.y>H-35)continue;
   const focused=active===n.id||hover===n.id;
   const related=!active||seen.has(n.id);
   const important=n.type==="person"&&verifiedBirth(n);
   const base=n.type==="person"?4.4:n.type==="practice"?3.1:n.type==="work"?2:2.5;
   const r=Math.max(1.3,Math.min(7,base*(.5+camera.scale*.95)));
   ctx.globalAlpha=related?1:.09;
   ctx.beginPath();ctx.arc(p.x,p.y,r+(focused?2.7:0),0,Math.PI*2);
   if(focused){ctx.fillStyle=t.bg;ctx.fill();ctx.strokeStyle=t.ink;ctx.lineWidth=1;ctx.stroke();}
   ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);
   const color=n.type==="person"?(important?t.ink:"#86939a"):nodeColor[n.type]||t.ink;
   ctx.fillStyle=color;ctx.fill();
   ctx.globalAlpha=1;
   canvasHits.push({id:n.id,x:p.x,y:p.y,r:Math.max(7,r+4)});
   const count=degrees.get(n.id)||0;
   const labelOk=focused||n.type==="person"||(!active?(n.type==="practice"&&count>2&&camera.scale>.36):related);
   if(labelOk)labels.push({n,p,focused,related,important,count});
 }
 labels.sort((a,b)=>(b.focused?100:0)+(b.important?40:0)+b.count-(a.focused?100:0)-(a.important?40:0)-a.count);
 const taken=[];
 ctx.textBaseline="middle";ctx.textAlign="left";
 for(const item of labels){
   const {n,p,focused,related,important}=item;
   if(!related&&active)continue;
   const label=n.type==="person"?(verifiedBirth(n)?"'"+String(n.birthYear).slice(-2)+"  "+n.name:"?  "+n.name):n.name;
   const fontsize=focused?13:important?11:n.type==="person"?10:9;
   ctx.font=(focused||important?"600 ":"400 ")+fontsize+"px 'Noto Sans TC','Inter',sans-serif";
   const tx=p.x+9,ty=p.y+(hash(n.id)%2===0? -9:11),wid=ctx.measureText(label).width;
   const box={x:tx-2,y:ty-fontsize/2-2,w:wid+5,h:fontsize+5};
   if(!focused&&taken.some(v=>v.x<box.x+box.w&&v.x+v.w>box.x&&v.y<box.y+box.h&&v.y+v.h>box.y)&&camera.scale<.82)continue;
   taken.push(box);
   ctx.globalAlpha=related?1:.22;
   if(focused){ctx.fillStyle=t.bg;ctx.fillRect(box.x,box.y,box.w,box.h);}
   ctx.fillStyle=focused?state.dark?"#fff6ee":"#8f473a":important?t.ink:n.type==="person"?t.muted:nodeColor[n.type]||t.muted;
   ctx.fillText(label,tx,ty);ctx.globalAlpha=1;
 }
 if(active){
   const local=relatedTo(active).filter(isEdgeVisible).slice(0,32);
   const a=byId.get(active),pos=toScreen(a);
   const counters=new Map();
   ctx.font="9px 'DM Mono','Noto Sans TC',monospace";
   local.forEach(e=>{
     const otherNode=other(e,active),p=toScreen(otherNode);if(p.x<0||p.x>W-20||p.y<85||p.y>H-60)return;
     const s=config(semantic(e)),idx=counters.get(otherNode.id)||0;
     counters.set(otherNode.id,idx+1);
     const label=s.en+(Number.isFinite(e.year)?" · "+(e.yearKind||"YEAR")+" "+e.year:"");
     const x=p.x+10,y=p.y+26+idx*13,width=ctx.measureText(label).width;
     if(x+width>W-6||y>H-60)return;
     ctx.fillStyle=t.bg;ctx.fillRect(x-3,y-7,width+7,13);
     ctx.fillStyle=s.color;ctx.fillText(label,x,y);
   });
 }
}
function draw(){
 raf=0;ctx.setTransform(dpr,0,0,dpr,0,0);
 const t=getTheme();ctx.fillStyle=t.bg;ctx.fillRect(0,0,W,H);
 ctx.save();ctx.beginPath();ctx.rect(0,0,W,H-36);ctx.clip();
 drawGrid(t);
 const seen=state.selected?neighborsForFocus(state.selected):null;
 drawLinks(t,state.selected,seen);drawNodes(t,seen||new Set());
 ctx.restore();
 drawRuler();
 const count=nodes.filter(n=>n.type==="person"&&verifiedBirth(n)&&isVisible(n)).length;
 $("#visible-count").textContent=count;
 $("#links-count").textContent=edges.filter(isEdgeVisible).length;
 $("#stage-caption").textContent=state.selected?"SELECTED: "+byId.get(state.selected).name+" / RELATIONSHIP TYPES SHOWN IN COLOR":"BIRTH-YEAR ANCHORS · OFFICE / WORK SATELLITES · UNVERIFIED BIRTHS IN SEPARATE REGISTER";
}
function drawRuler(){
 const ruler=$("#axis-ruler");ruler.replaceChildren();
 for(const yr of [1880,1900,1920,1940,1960,1980,1995]){
   const x=coordinate(yr)*camera.scale+camera.x;
   if(x<0||x>W)continue;
   const b=document.createElement("button");b.type="button";b.className="ruler-tick";
   b.style.left=x+"px";b.textContent=String(yr);
   b.addEventListener("click",()=>focusAt(coordinate(yr),850,.68));
   ruler.append(b);
 }
}
function renderRegions(){
 const rail=$("#region-rail");rail.replaceChildren();
 regions.forEach(r=>{
   const b=document.createElement("button");b.type="button";b.textContent=r.label;
   b.addEventListener("click",()=>{state.region=r.name;focusAt(coordinate(1945),r.cy,.72);});
   rail.append(b);
 });
 const unknown=document.createElement("button");unknown.type="button";unknown.textContent="? / BIRTH YEAR UNKNOWN";
 unknown.addEventListener("click",()=>focusAt(3370,1000,.65));rail.append(unknown);
}
function zoom(factor,px=W/2,py=H/2){
 const next=Math.max(camera.min,Math.min(camera.max,camera.scale*factor));
 const wx=(px-camera.x)/camera.scale,wy=(py-camera.y)/camera.scale;
 camera.scale=next;camera.x=px-wx*next;camera.y=py-wy*next;schedule();
}
function nearest(x,y){
 let best=null,dist=190;
 for(const hit of canvasHits){
   const dx=x-hit.x,dy=y-hit.y,r=dx*dx+dy*dy;
   if(r<dist){best=byId.get(hit.id);dist=r;}
 }
 return best;
}
function select(id,center=true,record=true){
 const n=byId.get(id);if(!n)return;
 state.selected=id;
 if(record){
   if(state.history[state.historyIndex]!==id){
     state.history=state.history.slice(0,state.historyIndex+1);
     state.history.push(id);state.historyIndex=state.history.length-1;
   }
 }
 if(center)focusNode(n);
 $("#drawer").hidden=false;renderDrawer();closeFloating();renderHistory();
 try{history.replaceState(null,"","#entity="+encodeURIComponent(id));}catch(_){}
 schedule();
}
function renderHistory(){
 $("#history-prev").disabled=state.historyIndex<=0;
 $("#history-next").disabled=state.historyIndex>=state.history.length-1;
 $("#history-counter").textContent=state.history.length?(state.historyIndex+1)+" / "+state.history.length:"RECORD";
}
function historyMove(delta){
 const i=state.historyIndex+delta;
 if(i<0||i>=state.history.length)return;
 state.historyIndex=i;select(state.history[i],true,false);
}
function clear(){
 state.selected=null;$("#drawer").hidden=true;$("#search").value="";
 try{history.replaceState(null,"",location.pathname+location.search);}catch(_){}
 schedule();
}
function sourceAnchors(ids){
 return [...new Set(ids||[])].filter(id=>sources.has(id))
   .map(id=>'<a href="'+esc(sources.get(id).url)+'" target="_blank" rel="noopener noreferrer" title="'+esc(sources.get(id).title)+'">'+esc(id)+' ↗</a>').join(" ");
}
function relationHeading(entity,key){
 const grammar={
  studied:"STUDIED AT",taught:"TAUGHT AT",led:"LED / HEADED",founded:"FOUNDED",
  worked:"WORKED AT",associated:"PROFESSIONAL ASSOCIATIONS",collaborated:"COLLABORATED WITH",
  designed:entity.type==="work"?"DESIGNED BY":"DESIGNED",consulted:"TECHNICAL CONTRIBUTIONS",
  recognized:"AWARDS & RECOGNITION",curated:"RESEARCH / CURATORIAL WORK",
  authored:"WROTE",belonged:"INSTITUTION / VENUE",contextual:"SITE CONTEXT"
 };
 return grammar[key]||config(key).en;
}
function projectRecords(n){
 let officeIds=[];
 if(n.type==="practice")officeIds=[n.id];
 else if(n.type==="person")officeIds=relatedTo(n.id).map(e=>other(e,n.id))
   .filter(o=>o?.type==="practice"&&["founded","worked","associated"].includes(semantic(relatedTo(n.id).find(e=>other(e,n.id)?.id===o.id)||{}))).map(o=>o.id);
 else return [];
 const pairs=[];
 const seen=new Set();
 for(const id of officeIds){
   for(const e of relatedTo(id)){
     const w=other(e,id);
     if(w?.type!=="work"||!["designed","consulted","collaborated"].includes(semantic(e)))continue;
     if(seen.has(w.id))continue;seen.add(w.id);
     const when=Number.isFinite(w.chronology?.year)?w.chronology.year:(Number.isFinite(e.year)?e.year:null);
     const timeType=Number.isFinite(w.chronology?.year)?w.chronology.basis:((e.yearKind==="AWARD YEAR")?"AWARD YEAR":"YEAR NOT VERIFIED");
     pairs.push({work:w,year:when,timeType,e,studio:byId.get(id)});
   }
 }
 return pairs.sort((a,b)=>(a.year??9999)-(b.year??9999)||a.work.name.localeCompare(b.work.name,"zh-Hant"));
}
function renderDrawer(){
 const n=byId.get(state.selected);if(!n)return;
 const groups=new Map();
 for(const e of relatedTo(n.id)){
   if(!isEdgeVisible(e))continue;
   const key=semantic(e);
   if(!groups.has(key))groups.set(key,[]);
   groups.get(key).push(e);
 }
 const birth=verifiedBirth(n)?"BORN "+n.birthYear+(n.deathYear?"—"+n.deathYear:""):n.type==="person"?"BIRTH YEAR NOT VERIFIED":"";
 const sourcesAll=new Set(n.sources||[]);
 for(const e of relatedTo(n.id))for(const s of e.src||[])sourcesAll.add(s);
 const badges=n.type==="person"?"Architectural practitioner / person":n.type==="practice"?"Architectural practice / office":(categories[n.type]||n.type);
 let html='<div class="record-type">'+esc(badges.toUpperCase())+'</div>'+
   '<h1 class="record-name">'+esc(n.name)+'</h1><div class="record-en">'+esc(n.en)+'</div>'+
   (birth?'<div class="record-life">'+esc(birth)+'</div>':"")+
   (n.type==="person"?'<div class="record-field">PRIMARY WORK REGION <b>'+esc(n.workRegion||"To verify")+'</b></div>':"")+
   (n.birthStatus==="conflicting-sources"?'<div class="record-dispute">出生年份有相互矛盾的來源：'+esc((n.birthCandidates||[]).join(" / "))+'。在核實前不將人物放到確定出生年的時間軸上。'+sourceAnchors(n.birthSourceIds)+'</div>':"")+
   (n.type==="person"&&n.birthYear===null&&n.birthStatus!=="conflicting-sources"?'<div class="record-dispute">出生年份尚未以足夠可靠的文獻核實。此人物位於獨立待考區，不按職涯事件推算出生年。</div>':"")+
   '<p class="record-desc">'+esc(n.desc||"No explanatory essay has been supplied for this record.")+'</p>';
 if(n.type==="practice"){
   const p=projectRecords(n);
   html+='<div class="works-head"><strong>OFFICE PROJECTS / 建築作品</strong><b>'+p.length+'</b></div>';
   html+=p.length?p.map(item=>'<button class="work-item" type="button" data-node="'+esc(item.work.id)+'"><span><b>'+esc(item.work.name)+'</b><small>'+esc(item.timeType)+' · '+esc(item.studio.name)+'</small></span><em>'+esc(item.year??"—")+' ↗</em></button>').join(""):'<p class="record-desc">目前尚無已核實並連結的作品紀錄。</p>';
 }
 if(n.type==="person"){
   const directWork=relatedTo(n.id).filter(e=>other(e,n.id)?.type==="work").length;
   const viaOffice=projectRecords(n);
   if(viaOffice.length){
      html+='<div class="works-head"><strong>PROJECTS THROUGH PRACTICES</strong><b>'+viaOffice.length+'</b></div>'+
      viaOffice.slice(0,18).map(item=>'<button class="work-item" type="button" data-node="'+esc(item.work.id)+'"><span><b>'+esc(item.work.name)+'</b><small>'+esc(item.studio.name)+' · '+esc(item.timeType)+'</small></span><em>'+esc(item.year??"—")+'</em></button>').join("")+
      (viaOffice.length>18?'<p class="record-field">其餘作品請進入相關事務所節點查看完整清單。</p>':"");
   }
 }
 const keys=[...groups.keys()].sort((a,b)=>(config(a).order||999)-(config(b).order||999));
 for(const key of keys){
   const egroup=groups.get(key).sort((a,b)=>(a.year??9999)-(b.year??9999));
   const spec=config(key);
   html+='<section class="relation-group" style="--tone:'+esc(spec.color)+'"><h2 class="relation-heading"><i class="relation-line" style="border-top-style:'+(spec.dash?.length?"dashed":"solid")+'"></i><strong>'+esc(relationHeading(n,key))+'</strong><b>'+egroup.length+'</b></h2>';
   for(const e of egroup){
     const o=other(e,n.id);
     const year=Number.isFinite(e.year)?(e.yearKind||"EVENT")+" "+e.year:"DATE NOT RECORDED";
     html+='<div class="relation-entry"><button type="button" class="relation-main" data-node="'+esc(o.id)+'">'+esc(o.name)+' <span>↗</span></button>'+
       '<p class="relation-comment">'+esc(e.label)+'</p><div class="relation-facts"><time>'+esc(year)+'</time>'+sourceAnchors(e.src)+'</div></div>';
   }
   html+='</section>';
 }
 html+='<div class="source-header">SOURCES / REFERENCES <span>'+sourcesAll.size+'</span></div>'+
  [...sourcesAll].map(id=>sources.get(id)).filter(Boolean)
    .map(s=>'<a class="source-entry" href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">↗ '+esc(s.title)+' <small>'+esc(s.id)+'</small></a>').join("")+
   '<button class="share-record" type="button" id="copy-record">COPY RECORD URL ↗</button>';
 const root=$("#drawer-content");root.innerHTML=html;
 root.querySelectorAll("[data-node]").forEach(b=>b.addEventListener("click",()=>select(b.dataset.node)));
 $("#copy-record").addEventListener("click",async e=>{
   try{await navigator.clipboard.writeText(location.href);e.target.textContent="COPIED ✓";}catch(_){e.target.textContent="USE THE ADDRESS BAR TO COPY";}
 });
}
function showSuggestions(){
 const val=$("#search").value.trim().toLocaleLowerCase(),root=$("#suggestions");root.replaceChildren();
 if(!val){root.hidden=true;return;}
 const found=nodes.filter(n=>(n.name+" "+n.en).toLocaleLowerCase().includes(val))
  .sort((a,b)=>(degrees.get(b.id)||0)-(degrees.get(a.id)||0)).slice(0,12);
 for(const n of found){
  const b=document.createElement("button");b.type="button";
  b.innerHTML='<b>'+esc(n.name)+'</b><small>'+esc(categories[n.type]||n.type)+'</small>';
  b.addEventListener("click",()=>{$("#suggestions").hidden=true;$("#search").value=n.name;select(n.id);});
  root.append(b);
 }
 if(!found.length)root.innerHTML='<p style="padding:12px">No matches in this edition</p>';
 root.hidden=false;
}
function floating(type){
 const root=$("#floating");
 if(root.dataset.type===type&&!root.hidden){root.hidden=true;return;}
 root.dataset.type=type;root.hidden=false;
 const close='<button type="button" data-close aria-label="close">×</button>';
 const intro='<div class="floating-title"><b>'+esc(type.toUpperCase())+'</b>'+close+'</div>';
 let html=intro;
 if(type==="connections"){
   html+='<p>同一種顏色與線型代表同一種關係；單獨切換線型，不改變人物出生年座標。</p>';
   for(const key of [...allRels].sort((a,b)=>(config(a).order||999)-(config(b).order||999))){
     const g=config(key);
     html+='<label class="filter-toggle"><input type="checkbox" data-rel="'+esc(key)+'" '+(state.relations.has(key)?"checked":"")+'><span class="dash" style="border-color:'+esc(g.color)+';border-top-style:'+(g.dash?.length?"dashed":"solid")+'"></span><span>'+esc(g.en)+' <small>'+esc(g.zh)+'</small></span></label>';
   }
   html+='<hr><button class="panel-btn" id="all-connections">RESTORE ALL CONNECTIONS ↗</button>';
 }else if(type==="highlights"){
   html+='<p>精選的探索切面只改變高亮對象；不會新增沒有來源的關係。</p>';
   const list=[
    {name:"POSTWAR MODERNISM",desc:"陳其寬、貝聿銘、張肇康、東海與路思義教堂",ids:["chen","pei","zhangzk","luce","tunghaiarch"]},
    {name:"HUANG SHENG-YUAN / YILAN",desc:"學歷、Moss、田中央與文化空間實踐",ids:["huang","fieldoffice","luodong"]},
    {name:"INTERNATIONAL PRACTICE",desc:"伊東豊雄、OMA、Mecanoo 與台灣文化設施",ids:["ito","koolhaas","houben","ntt","tpac","weiwuying"]},
    {name:"EARLY MODERN TAIWAN",desc:"王大閎、高而潘、漢寶德、李祖原",ids:["wang","han","lee"]}
   ];
   for(const item of list)html+='<button type="button" class="panel-btn" data-spot="'+esc(item.ids[0])+'"><b>'+esc(item.name)+'</b><small>'+esc(item.desc)+'</small></button>';
   html+='<button type="button" class="panel-btn" id="clear-highlight">CLEAR HIGHLIGHTS</button>';
 }else if(type==="offices"){
   const count=nodes.filter(n=>n.type==="practice").length;
   html+='<p>事務所按照已有證據的設計關係建立作品清單。作品標示落成／啟用或得獎年，不混用。</p>';
   html+='<input id="office-search" class="index-search" placeholder="搜尋事務所 / Search practices" type="search"><div class="panel-kicker">'+count+' PRACTICES</div><div class="office-index" id="office-index"></div>';
 }else if(type==="people"){
   html+='<p>人物 X 軸是查證過的出生年份。其他節點依人物附屬關係顯示。未有出生年份者會放在獨立待考區。</p>';
   for(const cat of allCats){html+='<label class="filter-toggle"><input type="checkbox" data-cat="'+esc(cat)+'" '+(state.types.has(cat)?"checked":"")+'><span>'+esc(categories[cat]||cat)+'</span><small>'+nodes.filter(n=>n.type===cat).length+'</small></label>';}
   html+='<hr><label class="panel-kicker" for="through">SHOW EVENTS THROUGH YEAR</label><input id="through" type="range" min="1880" max="2026" value="'+state.through+'" style="width:100%"><div class="panel-kicker" id="through-label">'+state.through+'</div>';
 }
 root.innerHTML=html;root.querySelector("[data-close]")?.addEventListener("click",()=>root.hidden=true);
 root.querySelectorAll("[data-rel]").forEach(b=>b.addEventListener("change",e=>{
   e.target.checked?state.relations.add(b.dataset.rel):state.relations.delete(b.dataset.rel);
   renderDrawer();schedule();
 }));
 root.querySelectorAll("[data-cat]").forEach(b=>b.addEventListener("change",e=>{
   e.target.checked?state.types.add(b.dataset.cat):state.types.delete(b.dataset.cat);
   if(state.selected&&!isVisible(byId.get(state.selected)))clear();
   schedule();
 }));
 root.querySelectorAll("[data-spot]").forEach(b=>b.addEventListener("click",()=>{
   const n=byId.get(b.dataset.spot);if(!n)return;
   state.featured=new Set([n.id,...relatedTo(n.id).map(e=>other(e,n.id).id)]);
   root.hidden=true;select(n.id);
 }));
 root.querySelector("#clear-highlight")?.addEventListener("click",()=>{state.featured=null;root.hidden=true;clear();resetFit();});
 root.querySelector("#all-connections")?.addEventListener("click",()=>{state.relations=new Set(allRels);floating("connections");schedule();});
 root.querySelector("#through")?.addEventListener("input",e=>{state.through=Number(e.target.value);$("#through-label").textContent=state.through;schedule();});
 if(type==="offices"){
   function list(){
     const val=($("#office-search").value||"").trim().toLocaleLowerCase();
     const sorted=nodes.filter(n=>n.type==="practice"&&(n.name+" "+n.en).toLocaleLowerCase().includes(val))
       .sort((a,b)=>projectRecords(b).length-projectRecords(a).length);
     const holder=$("#office-index");holder.replaceChildren();
     sorted.forEach(n=>{
       const b=document.createElement("button");b.type="button";
       b.innerHTML='<b>'+esc(n.name)+'</b><small>'+projectRecords(n).length+' WORKS ↗</small>';
       b.addEventListener("click",()=>select(n.id));holder.append(b);
     });
   }
   $("#office-search").addEventListener("input",list);list();
 }
}
function showGuide(){
 const body=$("#modal-body");
 body.innerHTML='<span class="eyebrow">A RESEARCH MAP / READING GUIDE</span><h1>Architecture in Taiwan,<br>all at once.</h1>'+
  '<p>依 Kyle Miller 的建築文化關係地圖邏輯，人物是座標骨架：左到右為<strong>已查證出生年份</strong>，由上而下為<strong>主要工作地域</strong>。學校、事務所、建築作品與文獻是附屬節點；它們在圖中的橫向位置<strong>不代表出生年份或落成年份</strong>。</p>'+
  '<div class="two-col"><div><span class="eyebrow">01 / PEOPLE</span><h2>Birth-year anchors</h2><p>只有出生年份有足夠證據者才放進正式年代尺。未知或互相矛盾者移至獨立待考區，不以職涯或獎項時間替代。</p></div>'+
  '<div><span class="eyebrow">02 / RELATIONS</span><h2>Different kinds of lines</h2><p>就讀、任教、創辦、任職、合作、設計、獲獎等各有獨立顏色／線型、年份及文獻。使用 CONNECTIONS 開關各種類型。</p></div>'+
  '<div><span class="eyebrow">03 / OFFICES & WORKS</span><h2>Our additional layer</h2><p>點選事務所可以檢查它在已收錄資料內的全部作品，依有來源的落成或得獎年份排序。台灣建築獎得獎年不等於建成年。</p></div>'+
  '<div><span class="eyebrow">04 / RESEARCH ETHICS</span><h2>A link is a claim</h2><p>原始資料中只明示同校、同事務所或得獎，不能自動推出師承、思想影響或共同作者。右側每條關係保留其文字來源。</p></div></div>'+
  '<p>操作：搜尋或點選節點 → 右側按類型閱讀關係／來源 → 透過 ‹ › 回到先前開啟紀錄。上方的 OFFICES 可以找事務所，左側工作地域與上方時間尺可以快速移動畫面。</p>'+
  '<p>此為獨立實作，參考 <a target="_blank" rel="noopener noreferrer" href="https://architectureallatonce.com/">Architecture All At Once, Right Now</a> 的公開互動概念，未複製對方原始碼、資料或設計素材。</p>';
 $("#overlay").hidden=false;$("#modal").hidden=false;$("#modal-close").focus();
}
function hideModal(){$("#overlay").hidden=true;$("#modal").hidden=true;}
function exportCSV(){
 const cols=["subject","subject_name","relation","target","target_name","date_type","reference_year","source_ids","source_urls"];
 const val=x=>'"'+String(x??"").replace(/^([=+@-])/,"'$1").replace(/"/g,'""')+'"';
 const rows=edges.map(e=>[e.a,byId.get(e.a)?.name,semantic(e),e.b,byId.get(e.b)?.name,e.yearKind||"",e.year??"",(e.src||[]).join(";"),(e.src||[]).map(id=>sources.get(id)?.url||"").join(";")]);
 const text="\ufeff"+[cols,...rows].map(a=>a.map(val).join(",")).join("\r\n");
 const u=URL.createObjectURL(new Blob([text],{type:"text/csv;charset=utf-8;"}));
 const a=document.createElement("a");a.href=u;a.download="taiwan-architecture-relationships.csv";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1500);
}
function connectUI(){
 $("#people-btn").addEventListener("click",()=>floating("people"));
 $("#offices-btn").addEventListener("click",()=>floating("offices"));
 $("#connections-btn").addEventListener("click",()=>floating("connections"));
 $("#highlights-btn").addEventListener("click",()=>floating("highlights"));
 $("#guide-btn").addEventListener("click",showGuide);
 $("#modal-close").addEventListener("click",hideModal);$("#overlay").addEventListener("click",hideModal);
 $("#theme-btn").addEventListener("click",()=>{
   state.dark=!state.dark;document.body.classList.toggle("dark",state.dark);document.body.classList.toggle("light",!state.dark);
   $("#theme-btn").setAttribute("aria-pressed",String(state.dark));$("#theme-btn").textContent=state.dark?"NIGHT ◐":"DAY ◐";schedule();
 });
 $("#search").addEventListener("input",showSuggestions);
 $("#search").addEventListener("keydown",e=>{
   if(e.key==="Escape"){$("#suggestions").hidden=true;return;}
   if(e.key==="Enter"){
     const q=e.target.value.toLocaleLowerCase().trim();
     const n=nodes.find(n=>(n.name+" "+n.en).toLocaleLowerCase().includes(q));
     if(n&&q){$("#suggestions").hidden=true;select(n.id);}
   }
 });
 $("#drawer-close").addEventListener("click",clear);
 $("#history-prev").addEventListener("click",()=>historyMove(-1));
 $("#history-next").addEventListener("click",()=>historyMove(1));
 $("#zoom-in").addEventListener("click",()=>zoom(1.28));
 $("#zoom-out").addEventListener("click",()=>zoom(1/1.28));
 $("#fit").addEventListener("click",resetFit);
 $("#export-btn").addEventListener("click",exportCSV);
 document.addEventListener("keydown",e=>{
   if(e.key==="Escape"){$("#suggestions").hidden=true;$("#floating").hidden=true;hideModal();clear();return;}
   if(e.key==="/"&&!["INPUT","TEXTAREA"].includes(document.activeElement.tagName)){e.preventDefault();$("#search").focus();}
 });
 document.addEventListener("click",e=>{if(!e.target.closest(".searchbox"))$("#suggestions").hidden=true;});
 canvas.addEventListener("wheel",e=>{
   e.preventDefault();const r=canvas.getBoundingClientRect();
   zoom(e.deltaY<0?1.15:1/1.15,e.clientX-r.left,e.clientY-r.top);
 },{passive:false});
 canvas.addEventListener("pointerdown",e=>{
   pointers.set(e.pointerId,{x:e.clientX,y:e.clientY,downX:e.clientX,downY:e.clientY});
   canvas.setPointerCapture(e.pointerId);dragged=false;
   originCamera={x:camera.x,y:camera.y,scale:camera.scale};
 });
 canvas.addEventListener("pointermove",e=>{
   const rect=canvas.getBoundingClientRect();
   if(pointers.has(e.pointerId)){
     const cur=pointers.get(e.pointerId);
     if(Math.abs(cur.downX-e.clientX)+Math.abs(cur.downY-e.clientY)>3)dragged=true;
     cur.x=e.clientX;cur.y=e.clientY;
     if(pointers.size===1&&dragged){camera.x=originCamera.x+e.clientX-cur.downX;camera.y=originCamera.y+e.clientY-cur.downY;canvas.classList.add("grabbing");schedule();}
     if(pointers.size===2){
       const p=[...pointers.values()],dist=Math.hypot(p[1].x-p[0].x,p[1].y-p[0].y);
       if(!originCamera.distance){originCamera.distance=dist;originCamera.scale=camera.scale;}
       else{const factor=dist/originCamera.distance;const cx=(p[0].x+p[1].x)/2-rect.left,cy=(p[0].y+p[1].y)/2-rect.top;zoom(Math.max(.5,Math.min(2,factor*originCamera.scale/camera.scale)),cx,cy);}
     }
     return;
   }
   const n=nearest(e.clientX-rect.left,e.clientY-rect.top);
   if(n?.id!==hover?.id){hover=n;schedule();}
   canvas.style.cursor=n?"pointer":"grab";
   const tip=$("#tooltip");
   if(n){tip.hidden=false;tip.innerHTML='<b>'+esc(n.name)+'</b><small>'+(n.type==="person"?(verifiedBirth(n)?"BORN "+n.birthYear:"BIRTH YEAR UNVERIFIED"):(categories[n.type]||n.type))+'</small>';tip.style.left=Math.min(W-240,e.clientX-rect.left+16)+"px";tip.style.top=Math.max(78,e.clientY-rect.top-45)+"px";}else tip.hidden=true;
 });
 canvas.addEventListener("pointerup",e=>{
   const cur=pointers.get(e.pointerId);
   if(!cur)return;
   const moved=dragged;pointers.delete(e.pointerId);
   canvas.classList.remove("grabbing");
   if(!moved&&pointers.size===0){
     const rect=canvas.getBoundingClientRect(),n=nearest(e.clientX-rect.left,e.clientY-rect.top);
     if(n)select(n.id,false);
   }
   if(pointers.size===0)originCamera=null;
 });
 canvas.addEventListener("pointercancel",e=>{pointers.delete(e.pointerId);originCamera=null;canvas.classList.remove("grabbing");});
 canvas.addEventListener("pointerleave",()=>{$("#tooltip").hidden=true;hover=null;schedule();});
 canvas.addEventListener("keydown",e=>{
   if(e.key==="+"||e.key==="="){zoom(1.25);e.preventDefault();}
   else if(e.key==="-"){zoom(.8);e.preventDefault();}
   else if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)){
     if(e.key==="ArrowLeft")camera.x+=55;if(e.key==="ArrowRight")camera.x-=55;
     if(e.key==="ArrowUp")camera.y+=55;if(e.key==="ArrowDown")camera.y-=55;
     schedule();e.preventDefault();
   }
 });
}
decorate();connectUI();renderRegions();
$("#total-people").textContent=nodes.filter(n=>n.type==="person").length;
$("#total-offices").textContent=nodes.filter(n=>n.type==="practice").length;
$("#total-works").textContent=nodes.filter(n=>n.type==="work").length;
$("#total-sources").textContent=D.sources.length;
if(typeof ResizeObserver!=="undefined")new ResizeObserver(resize).observe(canvas);else window.addEventListener("resize",resize);
resize();
const initial=decodeURIComponent((location.hash.match(/^#entity=(.*)$/)||[])[1]||"");
if(byId.has(initial))select(initial);
window.addEventListener("hashchange",()=>{
 const val=decodeURIComponent((location.hash.match(/^#entity=(.*)$/)||[])[1]||"");
 if(byId.has(val))select(val);
});
})();