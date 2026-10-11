(() => {
"use strict";
const D=window.ATLAS_DATA;
if(!D){document.body.insertAdjacentHTML("afterbegin",'<p role="alert">The architecture atlas could not load its research dataset.</p>');return;}
const $=q=>document.querySelector(q);
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const escape=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const canvas=$("#network"),wrap=$("#field-wrap"),ctx=canvas.getContext("2d",{alpha:false});
if(!ctx)return;
const nodes=D.nodes,edges=D.edges;
const byId=new Map(nodes.map(n=>[n.id,n]));
const sources=new Map(D.sources.map(s=>[s.id,s]));
const types=Object.keys(D.categories), edgeTypes=[...new Set(edges.map(e=>e.semantic||e.type))];
const typeNames={person:"PEOPLE / 人物",practice:"PRACTICES / 事務所",institution:"SCHOOLS & INSTITUTIONS / 學校與機構",work:"BUILDINGS & PROJECTS / 作品",publication:"PUBLICATIONS / 出版",event:"EXHIBITIONS & AWARDS / 展覽與獎項"};
const colors={person:"#141a17",practice:"#bb5843",institution:"#466778",work:"#989c97",publication:"#789064",event:"#9a7758"};
const grammar=D.relationshipGrammar||{};
const spotColors={person:"#e7ece9",practice:"#f3a38b",institution:"#85b7e3",work:"#a3aaa3",publication:"#a9c6a1",event:"#e0b782"};
const relColors={design:"#c2a5d4",affiliation:"#b4cda7",education:"#83afd8",engineering:"#ccada9",client:"#a1a9b1"};
function semantic(e){return grammar[e.semantic]||{en:e.type.toUpperCase(),zh:D.relations[e.type]||e.type,color:relColors[e.type]||"#a6adb0",dash:[],order:100};}
function lineStyle(e,highlight=false){
 const meta=semantic(e);
 ctx.strokeStyle=meta.color;
 ctx.lineWidth=highlight?2:1;
 ctx.setLineDash(meta.dash||[]);
}
function edgeCaption(e,at){
 const n=byId.get(e.a===state.selected?e.b:e.a);
 if(!n)return;
 const p=screen(n);
 const meta=semantic(e);
 const when=Number.isFinite(e.year)?(" · "+(e.yearKind||"RECORD")+" "+e.year):"";
 const label=meta.zh+when;
 const tx=p.x+10, ty=p.y+20+at*13;
 if(tx>W-30||ty<75||ty>H-45||tx<4)return;
 ctx.save();ctx.globalAlpha=1;ctx.textAlign="left";ctx.textBaseline="middle";
 ctx.font="9px 'DM Mono','Noto Sans TC',monospace";
 const width=ctx.measureText(label).width;
 ctx.fillStyle=backgroundColor();ctx.fillRect(tx-2,ty-6,width+6,13);
 ctx.fillStyle=meta.color;ctx.fillText(label,tx,ty);
 ctx.restore();
}

const themes={
 postwar:{label:"Postwar modernism",subtitle:"東海大學、現代主義、戰後專業化",ids:["pei","chen","zhangzk","feng","wang","tunghai","tunghaiarch","luce","sunhall","han"]},
 yilan:{label:"Sheng-Yuan Huang / Career sequence",subtitle:"東海 → 耶魯 → Moss → 黃聲遠 → 田中央 → 作品",ids:(D.stories?.huang||[]).map(s=>(byId.get(s.node)||nodes.find(n=>n.name===s.node))?.id).filter(Boolean)},
 practice:{label:"Recent Taiwan architecture",subtitle:"歷屆臺灣建築獎與事務所網絡",ids:[]},
 global:{label:"Taiwan × Global",subtitle:"國際合作與臺灣建築文化",ids:["ito","itoassoc","ntt","oma","tpac","koolhaas","gianotten","mecanoo","weiwuying","houben","pei"]},
 journals:{label:"Architectural discourse",subtitle:"專業刊物與戰後建築史研究",ids:nodes.filter(n=>n.type==="publication").map(n=>n.id)}
};
const state={year:2026,types:new Set(types),rels:new Set(edgeTypes),selected:null,hover:null,activeThread:null,compare:false,compared:[],dark:true,moving:false};
let dpr=1,W=0,H=0,frame=0;
const scene={w:3700,h:1550};
const camera={scale:1,x:0,y:0,minimum:.2,maximum:3.5};
let pointer=null;
let hitPoints=[];
const keyHash=str=>{let h=2166136261>>>0;for(const ch of str){h^=ch.codePointAt(0);h=Math.imul(h,16777619)>>>0;}return h;};
const pseudo=(id,offset=0)=>((keyHash(id+"|"+offset)%100000)/100000);
const degree=new Map(nodes.map(n=>[n.id,0]));
edges.forEach(e=>{degree.set(e.a,(degree.get(e.a)||0)+1);degree.set(e.b,(degree.get(e.b)||0)+1);});
const adjacency=new Map(nodes.map(n=>[n.id,[]]));
edges.forEach(e=>{adjacency.get(e.a)?.push({n:e.b,e});adjacency.get(e.b)?.push({n:e.a,e});});
/* Chronology is separate from biography and award history.
 * Diagram anchors with "relationship-context" are visual estimates ONLY;
 * factual events are always sourced in n.chronology / edges.
 */
const yearOf=n=>{
 if(!n)return null;
 if(Number.isFinite(n._diagramYear))return Math.min(2026,Math.max(1945,n._diagramYear));
 const src=Number.isFinite(n.chronology?.year)?n.chronology.year:n.year;
 return Number.isFinite(src)?Math.min(2026,Math.max(1945,src)):null;
};
const factualYear=n=>Number.isFinite(n?.chronology?.year)?n.chronology.year:(Number.isFinite(n?.year)?n.year:null);
const eventYears=(n,allowedTypes=null)=>{
 const out=[];
 for(const item of adjacency.get(n.id)||[]){
   if(allowedTypes&&!allowedTypes.includes(item.e.type))continue;
   if(Number.isFinite(item.e.year))out.push(item.e.year);
 }
 return out.sort((a,b)=>a-b);
};
const clampYear=y=>Math.max(1945,Math.min(2026,y));
function layout(){
 const refY=n=>125+pseudo(n.id,4)*1300;
 const yPos=new Map();
 // Different nodes have different meanings: institutions are antecedents,
 // people join after documented study, firms precede their buildings.
 // This is a visual ordering, not a claim about founding without evidence.
 nodes.forEach(n=>{
   const explicit=Number.isFinite(n.chronology?.year)?n.chronology.year:null;
   const events=eventYears(n);
   const education=eventYears(n,["education"]);
   const design=eventYears(n,["design","engineering","client"]);
   const workDates=(adjacency.get(n.id)||[])
      .map(a=>byId.get(a.n))
      .filter(x=>x&&x.type==="work")
      .map(w=>Number.isFinite(w.chronology?.year)?w.chronology.year:w.year)
      .filter(Number.isFinite)
      .sort((a,b)=>a-b);
   let estimate=explicit;
   let rule=explicit!==null?n.chronology.basis:"contextual";
   if(estimate===null){
     if(n.type==="institution"){
       // A school without sourced founding year precedes its documented
       // graduates/teachers, rather than being sent to the far-right.
       estimate=education.length?education[0]-7:
         events.length?events[0]-7:(Number.isFinite(n.year)?n.year-6:null);
     }else if(n.type==="practice"){
       const projectTime=design.length?design[0]:(workDates[0]??null);
       const joinDates=eventYears(n,["affiliation"]);
       estimate=projectTime!==null?projectTime-2:
         joinDates.length?joinDates[0]-1:(Number.isFinite(n.year)?n.year-2:null);
     }else if(n.type==="person"){
       const professional=events.filter((y)=>true);
       const study=education.length?education[education.length-1]:null;
       const earliestCareer=eventYears(n,["affiliation","design","engineering"]);
       if(study!==null && earliestCareer.length){
         estimate=Math.min(study+1,earliestCareer[0]-1);
       }else if(study!==null)estimate=study+1;
       else if(earliestCareer.length)estimate=earliestCareer[0]-3;
       else if(professional.length)estimate=professional[0]-2;
       else if(Number.isFinite(n.year))estimate=n.year-4;
     }else{
       estimate=Number.isFinite(n.year)?n.year:(events[0]??null);
       rule=Number.isFinite(n.year)?"documented-event":"contextual";
     }
     if(estimate===null){
       // Unspecified chronology: use a dated neighbour as *display context*
       // when available, NOT as a verified founding / graduation date.
       const neighbours=(adjacency.get(n.id)||[]).map(o=>byId.get(o.n))
         .map(other=>Number.isFinite(other?.chronology?.year)?other.chronology.year:other?.year)
         .filter(Number.isFinite);
       if(neighbours.length)estimate=Math.min(...neighbours)-5;
     }
   }
   n._diagramYear=estimate===null?null:clampYear(estimate);
   n._placementBasis=explicit!==null?rule:(estimate===null?"undated":"relationship-context");
 });
 // Enforce antecedent phases only on positions with no sourced chronology.
 for(let pass=0;pass<4;pass++){
   for(const e of edges){
     const a=byId.get(e.a),b=byId.get(e.b);if(!a||!b)continue;
     let predecessor=null,successor=null;
     if(e.type==="design"){
       if(a.type==="work"&&b.type==="practice"){predecessor=b;successor=a;}
       else if(b.type==="work"&&a.type==="practice"){predecessor=a;successor=b;}
       else if(a.type==="work"&&b.type==="person"){predecessor=b;successor=a;}
       else if(b.type==="work"&&a.type==="person"){predecessor=a;successor=b;}
     }else if(e.type==="education"){
       if(a.type==="institution"&&b.type==="person"){predecessor=a;successor=b;}
       else if(b.type==="institution"&&a.type==="person"){predecessor=b;successor=a;}
     }else if(e.type==="affiliation"){
       if(a.type==="person"&&b.type==="practice"){predecessor=a;successor=b;}
       else if(b.type==="person"&&a.type==="practice"){predecessor=b;successor=a;}
       // NOTE: A pre-existing employer, such as Eric Owen Moss,
       // is explicitly anchored before the person by an actual career date.
     }
     if(!predecessor||!successor)continue;
     // If a person has no dated graduation record, keep their position to the
     // right of a known school rather than placing them in a far-left void.
     if(predecessor._diagramYear!==null&&successor._diagramYear===null&&!Number.isFinite(successor.chronology?.year)){
       successor._diagramYear=clampYear(predecessor._diagramYear+3);
       successor._placementBasis="relationship-context";
     }else if(predecessor._diagramYear===null&&successor._diagramYear!==null&&!Number.isFinite(predecessor.chronology?.year)){
       predecessor._diagramYear=clampYear(successor._diagramYear-3);
       predecessor._placementBasis="relationship-context";
     }
     if(predecessor._diagramYear===null||successor._diagramYear===null)continue;
     if(predecessor._diagramYear>=successor._diagramYear){
       // Recorded facts always win over a diagram-layout constraint.
       const fixedA=Number.isFinite(predecessor.chronology?.year);
       const fixedB=Number.isFinite(successor.chronology?.year);
       if(!fixedA)predecessor._diagramYear=clampYear(successor._diagramYear-1.5);
       else if(!fixedB)successor._diagramYear=clampYear(predecessor._diagramYear+1.5);
     }
   }
 }
 nodes.filter(n=>n.type==="practice").forEach(n=>yPos.set(n.id,refY(n)));
 nodes.filter(n=>n.type==="institution").forEach(n=>yPos.set(n.id,refY(n)));
 nodes.filter(n=>n.type==="publication"||n.type==="event").forEach(n=>yPos.set(n.id,refY(n)));
 nodes.filter(n=>n.type==="person").forEach(n=>{
   const ties=(adjacency.get(n.id)||[]).map(o=>byId.get(o.n)).filter(a=>a&&(a.type==="practice"||a.type==="institution"));
   const known=ties.map(t=>yPos.get(t.id)).filter(Number.isFinite);
   const anchor=known.length?known.reduce((a,b)=>a+b,0)/known.length:refY(n);
   yPos.set(n.id,Math.max(70,Math.min(1480,anchor+(pseudo(n.id,2)-.5)*230)));
 });
 nodes.filter(n=>n.type==="work").forEach(n=>{
   const ties=(adjacency.get(n.id)||[]).map(o=>byId.get(o.n)).filter(a=>a&&a.type==="practice");
   const known=ties.map(t=>yPos.get(t.id)).filter(Number.isFinite);
   const anchor=known.length?known.reduce((a,b)=>a+b,0)/known.length:refY(n);
   yPos.set(n.id,Math.max(70,Math.min(1480,anchor+(pseudo(n.id,7)-.5)*350)));
 });
 const priority={institution:0,person:1,practice:2,publication:2,event:2,work:3};
 // Keep the documented Huang career corridor visually coherent while
 // preserving each node's independent evidence-bearing chronological position.
 const huangY={
   "東海大學建築學系":480,
   "耶魯大學建築學院":570,
   "Eric Owen Moss Architects":710,
   "北卡羅萊納州立大學":830,
   "黃聲遠":635,
   "田中央":765,
   "羅東文化工場":700,
   "雲門劇場":825
 };
 nodes.forEach(n=>{if(Object.prototype.hasOwnProperty.call(huangY,n.name))yPos.set(n.id,huangY[n.name]);});
 nodes.forEach(n=>{
   const date=n._diagramYear;
   const time=date===null?null:(date-1945)/81;
   n._x=date===null?55+pseudo(n.id,3)*60:116+time*3280+(priority[n.type]||0)*5+(pseudo(n.id,3)-.5)*16;
   n._y=yPos.get(n.id)??refY(n);
   n._radius=n.type==="person"?4.7:n.type==="practice"?4.3:n.type==="institution"?3.9:n.type==="publication"?3.5:2.8;
 });
}
function visible(n){return !!n&&state.types.has(n.type)&&((yearOf(n)===null)||yearOf(n)<=state.year);}
function edgeVisible(e){return visible(byId.get(e.a))&&visible(byId.get(e.b))&&state.rels.has(e.semantic||e.type)&&(!e.year||e.year<=state.year);}
function currentEdges(){return edges.filter(edgeVisible);}
function currentNodes(){return nodes.filter(visible);}
function threadSet(){
 if(!state.activeThread||!themes[state.activeThread])return null;
 const ids=new Set(themes[state.activeThread].ids);
 if(state.activeThread==="practice"){nodes.forEach(n=>{if(n.year>=2013)ids.add(n.id);});}
 const related=new Set(ids);
 edges.forEach(e=>{if(ids.has(e.a))related.add(e.b);if(ids.has(e.b))related.add(e.a);});
 return related;
}
function routePath(a,b){
 if(!a||!b||a===b)return a?[a]:[];
 const prev=new Map([[a,null]]),q=[a];
 let index=0;
 while(index<q.length){
   const here=q[index++];
   if(here===b)break;
   for(const next of adjacency.get(here)||[]){
     if(prev.has(next.n)||!edgeVisible(next.e))continue;
     prev.set(next.n,here);q.push(next.n);
   }
 }
 if(!prev.has(b))return [];
 const path=[];for(let t=b;t!==null;t=prev.get(t))path.push(t);
 return path.reverse();
}
function activeSet(){
 const focus=threadSet()||new Set();
 if(state.selected){
   focus.add(state.selected);
   for(const o of adjacency.get(state.selected)||[]){if(edgeVisible(o.e))focus.add(o.n);}
 }
 let path=[];
 if(state.compare&&state.compared.length===2){
   path=routePath(state.compared[0],state.compared[1]);path.forEach(n=>focus.add(n));
 }
 return {focus:focus.size?focus:null,path};
}
function fit(){
 const padding=42;
 camera.scale=Math.min((W-padding*2)/scene.w,(H-padding*2)/scene.h);
 camera.minimum=Math.max(.12,camera.scale*.72);
 camera.maximum=Math.max(3.2,camera.scale*6);
 camera.x=(W-scene.w*camera.scale)/2;
 camera.y=(H-scene.h*camera.scale)/2;
 scheduleDraw();
}
function screen(n){return {x:n._x*camera.scale+camera.x,y:n._y*camera.scale+camera.y};}
function resize(){
 const r=canvas.getBoundingClientRect();W=Math.max(300,r.width);H=Math.max(300,r.height);
 dpr=Math.min(2,window.devicePixelRatio||1);
 canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);
 ctx.setTransform(dpr,0,0,dpr,0,0);
 if(!resize.initialized){fit();resize.initialized=true;}else scheduleDraw();
}
function textColor(){return state.dark?"#eaede7":"#262b28";}
function backgroundColor(){return state.dark?"#151717":"#f8f8f6";}
function scheduleDraw(){if(!frame)frame=requestAnimationFrame(draw);}
function curve(e){
 const a=byId.get(e.a),b=byId.get(e.b),p=screen(a),q=screen(b);
 const dx=q.x-p.x,dy=q.y-p.y;
 const lift=Math.min(260,Math.max(18,Math.abs(dx)*.12));
 const midx=(p.x+q.x)/2,midy=(p.y+q.y)/2;
 const sign=keyHash(e.a+"-"+e.b)%2?1:-1;
 ctx.moveTo(p.x,p.y);
 ctx.quadraticCurveTo(midx+(Math.abs(dx)<60?lift*sign:0),midy+(Math.abs(dx)<60?0:-lift),q.x,q.y);
}
function draw(){
 frame=0;if(!W||!H)return;
 ctx.setTransform(dpr,0,0,dpr,0,0);
 ctx.fillStyle=backgroundColor();ctx.fillRect(0,0,W,H);
 ctx.save();ctx.beginPath();ctx.rect(0,0,W,H);ctx.clip();
 const ink=textColor(),focusInfo=activeSet(),focus=focusInfo.focus,path=focusInfo.path;
 const pathEdges=new Set();
 for(let k=1;k<path.length;k++)pathEdges.add([path[k-1],path[k]].sort().join("|"));
 // Archival time ticks
 ctx.save();
 ctx.textAlign="center";ctx.textBaseline="top";ctx.font="9px 'DM Mono',monospace";
 for(let yr=1950;yr<=2020;yr+=10){
   const x=(116+(yr-1945)/81*3340)*camera.scale+camera.x;
   if(x<0||x>W)continue;
   ctx.strokeStyle=state.dark?"rgba(210,218,214,.06)":"rgba(40,47,42,.065)";ctx.lineWidth=1;
   ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();
   ctx.fillStyle=state.dark?"#8a928c":"#a0a6a0";
   ctx.fillText(String(yr),x,54);
 }
 const undatedX=72*camera.scale+camera.x;
 if(undatedX>20&&undatedX<W-10){ctx.fillStyle=state.dark?"#87948a":"#9ba19a";ctx.fillText("DATE UNKNOWN",undatedX,54);}
 ctx.restore();
 // Dim default network edges and highlight the selected constellation.
 const visibleEdges=currentEdges();
 const normal=[],important=[];
 for(const e of visibleEdges){
   const strong = (state.selected&&(e.a===state.selected||e.b===state.selected))||
      (state.compare&&pathEdges.has([e.a,e.b].sort().join("|")))||
      (focus&&!state.selected&&(focus.has(e.a)&&focus.has(e.b)));
   (strong?important:normal).push(e);
 }
 ctx.lineCap="round";
 normal.forEach(e=>{
   ctx.beginPath();curve(e);lineStyle(e,false);
   ctx.globalAlpha=focus?.055:(state.dark?.27:.22);
   ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;
 });
 important.forEach(e=>{
   ctx.beginPath();curve(e);lineStyle(e,true);
   const inPath=pathEdges.has([e.a,e.b].sort().join("|"));
   if(inPath)ctx.lineWidth=3;
   ctx.globalAlpha=state.dark?1:.96;
   ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;
 });
 // Node spots followed by labels. Render labels at screen-fixed size for readable dense map.
 const drawn=currentNodes().sort((a,b)=>(degree.get(a.id)||0)-(degree.get(b.id)||0));
 hitPoints=[];
 drawn.forEach(n=>{
   const p=screen(n);
   if(p.x< -70||p.x>W+70||p.y< -70||p.y>H+70)return;
   const muted=!!focus&&!focus.has(n.id);
   const focused=state.selected===n.id||state.hover===n.id||state.compared.includes(n.id);
   const r=Math.max(1.6,Math.min(8,n._radius*(.67+camera.scale*.70)));
   ctx.beginPath();ctx.arc(p.x,p.y,r+(focused?3.3:0),0,Math.PI*2);
   if(focused){ctx.fillStyle=backgroundColor();ctx.fill();ctx.strokeStyle=state.dark?"#eee":"#111";ctx.lineWidth=1;ctx.stroke();}
   ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);
   ctx.globalAlpha=muted?.10:1;
   ctx.fillStyle=state.dark?(spotColors[n.type]||ink):(colors[n.type]||ink);ctx.fill();
   ctx.globalAlpha=1;
   hitPoints.push({n,x:p.x,y:p.y});
 });
 const labels=drawn.filter(n=>n.type!=="work"||(degree.get(n.id)>=3)||camera.scale>.61||n.id===state.hover||n.id===state.selected);
 labels.sort((a,b)=>{
   const aPri=(a.id===state.hover?100:0)+(a.id===state.selected?100:0)+(a.type==="person"?25:a.type==="practice"?20:a.type==="institution"?10:0)+(degree.get(a.id)||0);
   const bPri=(b.id===state.hover?100:0)+(b.id===state.selected?100:0)+(b.type==="person"?25:b.type==="practice"?20:b.type==="institution"?10:0)+(degree.get(b.id)||0);
   return bPri-aPri;
 });
 const boxes=[];
 ctx.textAlign="left";ctx.textBaseline="middle";
 for(const n of labels){
   const p=screen(n);if(p.x< -10||p.x>W+6||p.y<30||p.y>H-20)continue;
   const prominent=state.selected===n.id||state.hover===n.id||state.compared.includes(n.id);
   const alpha=focus&&!focus.has(n.id)?.11:1;
   const size=prominent?12.5:n.type==="person"?11.2:n.type==="practice"?10.4:n.type==="institution"?10.0:9.4;
   ctx.font=(prominent||n.type==="person"?"600 ":"400 ")+size+"px 'Noto Sans TC','Inter',sans-serif";
   const tx=p.x+9,ty=p.y+(keyHash(n.id)%2? -9:12);
   const width=ctx.measureText(n.name).width;
   const box={x:tx-2,y:ty-size*.5-2,w:width+4,h:size+4};
   if(!prominent){
      let collision=false;
      for(const prev of boxes){if(box.x<prev.x+prev.w&&box.x+box.w>prev.x&&box.y<prev.y+prev.h&&box.y+box.h>prev.y){collision=true;break;}}
      if(collision&&camera.scale<.82)continue;
   }
   boxes.push(box);
   ctx.globalAlpha=alpha;
   if(prominent){
     ctx.fillStyle=backgroundColor();ctx.fillRect(box.x,box.y,box.w,box.h);
   }
   ctx.fillStyle=prominent?(state.dark?"#fbf6ee":"#9f432e"):ink;
   ctx.fillText(n.name,tx,ty);
   ctx.globalAlpha=1;
 }
 // Link annotation labels echo Kyle's local semantic sublabels: color and
 // typed, dated relationship — rendered only for the currently focused node.
 if(state.selected){
   const local=important.filter(e=>e.a===state.selected||e.b===state.selected).slice(0,22);
   const stagger=new Map();
   local.forEach(e=>{
     const id=e.a===state.selected?e.b:e.a;
     const level=stagger.get(id)||0;stagger.set(id,level+1);
     edgeCaption(e,level);
   });
 }
 ctx.restore();
 $("#visibility-stats").textContent=currentNodes().length+" NODES · "+currentEdges().length+" CONNECTIONS";
 $("#count-entities").textContent=nodes.length;
 $("#count-links").textContent=edges.length;
 $("#count-sources").textContent=D.sources.length;
 const mode=state.compare?"COMPARISON MODE":state.activeThread?themes[state.activeThread].label.toUpperCase():state.selected?"SELECTED NETWORK":"COMPLETE NETWORK";
 $("#active-mode").textContent=mode;
}
function zoom(factor,cx=W/2,cy=H/2){
 const from=camera.scale,to=Math.min(camera.maximum,Math.max(camera.minimum,from*factor));
 const wx=(cx-camera.x)/from,wy=(cy-camera.y)/from;
 camera.scale=to;camera.x=cx-wx*to;camera.y=cy-wy*to;scheduleDraw();
}
function nearest(x,y){
 let best=null,dist=230;
 for(const hit of hitPoints){
   const dx=x-hit.x,dy=y-hit.y,dd=dx*dx+dy*dy;
   if(dd<dist){dist=dd;best=hit.n;}
 }
 return best;
}
function focusNode(n){
 if(!n)return;
 const targetScale=Math.max(camera.scale,.62);
 const s=targetScale/camera.scale;
 const p=screen(n);
 zoom(s,p.x,p.y);
 camera.x=W*.46-n._x*camera.scale;
 camera.y=H*.45-n._y*camera.scale;
 scheduleDraw();
}
function select(id,center=false){
 const n=byId.get(id);if(!n)return;
 if(yearOf(n)!==null&&yearOf(n)>state.year){state.year=Math.ceil(yearOf(n));$("#year").value=state.year;$("#year-label").textContent=state.year;}
 state.types.add(n.type);
 if(state.compare){
   if(state.compared.length===2)state.compared=[state.compared[1]];
   if(!state.compared.includes(id))state.compared.push(id);
 }else{state.compared=[];}
 state.selected=id;
 state.activeThread=null;
 if(center)focusNode(n);
 refreshFilters();
 renderSelection();
 scheduleDraw();
 try{history.replaceState(null,"","#entity="+encodeURIComponent(id));}catch(_){}
}
function details(id){
 const n=byId.get(id),list=(adjacency.get(id)||[]).filter(x=>byId.has(x.n));
 const connected=[...new Set(list.flatMap(x=>x.e.src||[]))];
 const cited=[...new Set([...(n?.sources||[]),...connected])].map(i=>sources.get(i)).filter(Boolean);
 return {n,list,cited};
}

function documentedTimeline(n){
 if(!n)return[];
 const story=D.stories?.[n.id];
 if(story){
   return story.map((s,i)=>{
     const other=byId.get(s.node)||nodes.find(n=>n.name===s.node);
     return other?{id:other.id,year:s.year,display:s.year===null?"BEFORE 1993":String(s.year),name:other.name,kind:s.role,label:s.label,src:[s.src],order:i}:null;
   }).filter(Boolean);
 }
 const events=[];
 const push=(other,e,kind)=>{
   if(!other||!e)return;
   const year=Number.isFinite(e.year)?e.year:factualYear(other);
   if(!Number.isFinite(year))return; // Unverified events have no dated timeline step.
   events.push({id:other.id,year,display:String(year),name:other.name,kind,label:e.label||"",src:e.src||[]});
 };
 if(n.type==="person"){
   const careers=(adjacency.get(n.id)||[]).filter(t=>byId.has(t.n));
   const associatedPractices=careers.filter(t=>byId.get(t.n).type==="practice");
   for(const t of careers){
     const other=byId.get(t.n);
     if(t.e.type==="education"&&other.type==="institution")push(other,t.e,"education");
     if(t.e.type==="affiliation"&&other.type==="practice")push(other,t.e,"affiliation");
   }
   if(Number.isFinite(n.chronology?.year)){
     events.push({id:n.id,year:n.chronology.year,display:String(n.chronology.year),name:n.name,kind:"career",label:n.chronology.label,src:[n.chronology.source].filter(Boolean)});
   }
   for(const t of careers){if(byId.get(t.n).type==="work"&&t.e.type==="design")push(byId.get(t.n),t.e,"completed");}
   const practiceIds=new Set(associatedPractices.map(t=>t.n));
   edges.filter(e=>practiceIds.has(e.a)||practiceIds.has(e.b)).forEach(e=>{
     if(e.type!=="design")return;
     const w=byId.get(practiceIds.has(e.a)?e.b:e.a);
     if(w?.type==="work")push(w,e,"completed");
   });
 }else if(n.type==="practice"){
   if(Number.isFinite(n.chronology?.year))events.push({id:n.id,year:n.chronology.year,display:String(n.chronology.year),name:n.name,kind:"foundation",label:n.chronology.label,src:[n.chronology.source].filter(Boolean)});
   for(const a of adjacency.get(n.id)||[]){
     const other=byId.get(a.n);
     if(other?.type==="work"&&a.e.type==="design")push(other,a.e,"completed");
   }
 }else if(n.type==="institution"){
   if(n.chronology?.basis==="founded")events.push({id:n.id,year:n.chronology.year,display:String(n.chronology.year),name:n.name,kind:"foundation",label:n.chronology.label,src:[n.chronology.source].filter(Boolean)});
   for(const a of adjacency.get(n.id)||[]){
     const other=byId.get(a.n);
     if(other?.type==="person"&&a.e.type==="education")push(other,a.e,"education");
   }
 }else if(n.type==="work"){
   if(Number.isFinite(n.chronology?.year))events.push({id:n.id,year:n.chronology.year,display:String(n.chronology.year),name:n.name,kind:n.chronology.basis,label:n.chronology.label,src:[n.chronology.source].filter(Boolean)});
 }
 const weight={education:0,affiliation:1,career:2,foundation:3,completed:4};
 events.sort((a,b)=>a.year-b.year+(weight[a.kind]||0)*.00001-(weight[b.kind]||0)*.00001);
 const unique=new Set();
 return events.filter(v=>{const key=v.id+"|"+v.year+"|"+v.kind;if(unique.has(key))return false;unique.add(key);return true;}).slice(0,20);
}
function timelineHTML(n){
 const milestones=documentedTimeline(n);
 if(milestones.length<2)return"";
 const items=milestones.map((e,i)=>
   '<button type="button" class="timeline-step" data-node="'+escape(e.id)+'">'+
   '<span class="timeline-time">'+escape(e.display)+'</span>'+
   '<span class="timeline-detail"><b>'+escape(e.name)+'</b><small>'+escape(e.label)+' · '+escape(e.src.join(" / "))+'</small></span>'+
   '<span class="timeline-arrow">↗</span></button>'
 ).join("");
 return '<div class="selection-subhead">CHRONOLOGICAL RELATIONSHIPS <span>'+milestones.length+'</span></div>'+
   '<div class="timeline-intro">依教育、任職、成立及作品事件排序。相鄰節點不代表彼此直接有關係；請以各條關係來源為準。</div>'+
   '<div class="timeline-steps">'+items+'</div>';
}

function relationGroupTitle(key,entity){
 const rules={
   studied:entity.type==="institution"?"STUDIED HERE":"STUDIED AT",
   taught:entity.type==="institution"?"FACULTY / TAUGHT HERE":"TAUGHT AT",
   led:entity.type==="institution"?"LED THIS INSTITUTION":"LED",
   founded:entity.type==="practice"?"FOUNDED BY":"FOUNDED",
   worked:entity.type==="practice"?"WORKED HERE":"WORKED AT",
   associated:"PROFESSIONAL AFFILIATION",
   collaborated:"COLLABORATED WITH",
   designed:entity.type==="work"?"DESIGNED BY":"DESIGNED",
   consulted:"CONTRIBUTED TO",
   authored:entity.type==="publication"?"WRITTEN BY":"WROTE",
   recognized:"RECOGNIZED BY",
   curated:"CURATED / RESEARCHED",
   belonged:"PART OF / HOSTED BY",
   contextual:"RELATED SITE CONTEXT"
 };
 return rules[key]||semantic({semantic:key}).en;
}
function groupedRelationHTML(entity,records){
 const groups=new Map();
 for(const item of records){
   const key=item.e.semantic||"associated";
   if(!groups.has(key))groups.set(key,[]);
   groups.get(key).push(item);
 }
 return [...groups.entries()]
   .sort((a,b)=>(grammar[a[0]]?.order??999)-(grammar[b[0]]?.order??999))
   .map(([key,items])=>{
     const spec=grammar[key]||semantic(items[0].e);
     const label=relationGroupTitle(key,entity);
     const dash=(spec.dash||[]).length?"dashed":"solid";
     const rows=items.sort((a,b)=>(a.e.year??factualYear(byId.get(a.n))??9999)-(b.e.year??factualYear(byId.get(b.n))??9999))
       .map(item=>{
          const other=byId.get(item.n),e=item.e;
          const origin=(e.src||[]).map(id=>{
            const s=sources.get(id);
            return s?'<a href="'+escape(s.url)+'" target="_blank" rel="noopener noreferrer" class="edge-evidence" title="'+escape(s.title)+'">'+escape(id)+' ↗</a>':'<span>'+escape(id)+'</span>';
          }).join(" ");
          const year=Number.isFinite(e.year)?'<time class="edge-year">'+escape((e.yearKind||"RECORD")+" "+e.year)+'</time>':'<span class="edge-year unsure">YEAR NOT LISTED</span>';
          return '<article class="relation-entry"><button type="button" class="relation-entity-link" data-node="'+escape(other.id)+'"><span>'+escape(other.name)+'</span><span class="relation-link-arrow">↗</span></button>'+
             '<div class="relation-note">'+escape(e.label||"Documented association")+'</div>'+
             '<div class="relation-facts">'+year+'<span class="relation-sources">'+origin+'</span></div></article>';
       }).join("");
     return '<section class="relation-group" style="--link-color:'+escape(spec.color)+'">'+
       '<h3 class="relation-group-head"><span class="relation-sample '+dash+'"></span><span>'+escape(label)+'</span><small>'+escape(spec.zh)+'</small><b>'+items.length+'</b></h3>'+
       rows+'</section>';
   }).join("");
}

function renderSelection(){
 const panel=$("#selection-panel"),inner=$("#selection-inner");
 const {n,list,cited}=details(state.selected);
 if(!n){panel.hidden=true;return;}
 panel.hidden=false;
 const compareText=state.compare?'<div class="compare-selection"><span>COMPARE MODE</span><br>'+(state.compared.length===1?'Select a second entity to discover shared connections and pathways.':"Two selected entities are connected below.")+'</div>':"";
 const stage=x=>{
   const other=byId.get(x.n);
   if(x.e.type==="education"&&other?.type==="institution")return 0;
   if(x.e.type==="affiliation"&&other?.type==="practice")return 1;
   if(other?.type==="person")return 2;
   if(other?.type==="work")return 4;
   return 3;
 };
 const row=list.filter(x=>edgeVisible(x.e)).sort((a,b)=>{
   const sa=stage(a),sb=stage(b);
   return sa-sb||((factualYear(byId.get(a.n))??a.e.year??9999)-(factualYear(byId.get(b.n))??b.e.year??9999))||
     (byId.get(a.n).name.localeCompare(byId.get(b.n).name,"zh-Hant"));
 });
 const tag=D.categories[n.type]?.en||n.type;
 const path=state.compare&&state.compared.length===2?routePath(state.compared[0],state.compared[1]):[];
 const common=state.compare&&state.compared.length===2?
  [...new Set((adjacency.get(state.compared[0])||[]).map(e=>e.n))].filter(id=>(adjacency.get(state.compared[1])||[]).some(e=>e.n===id)):[];
 let cmp="";
 if(state.compare&&state.compared.length===2){
   cmp='<div class="selection-subhead">PATH BETWEEN SELECTED <span>↔</span></div>'+
      '<p class="selection-desc">'+(path.length?path.map(id=>escape(byId.get(id).name)).join(' → '):"No documented path within the current filters.")+'</p>'+
      '<p class="selection-desc">Shared direct neighbours: '+(common.length?common.map(id=>escape(byId.get(id).name)).join(" / "):"None documented")+'</p>';
 }
 inner.innerHTML='<div class="selection-content"><span class="selection-label">'+escape(tag.toUpperCase())+' / ENTITY '+String(nodes.indexOf(n)+1).padStart(3,"0")+'</span>'+
  '<h2>'+escape(n.name)+'</h2><div class="selection-en">'+escape(n.en)+'</div>'+
  '<div class="selection-meta"><span>TIME RECORD <b>'+(n.chronology?escape(n.chronology.basis.toUpperCase()+" "+n.chronology.year):n.type==="work"&&Number.isFinite(n.year)?escape("AWARD "+n.year):n._placementBasis==="relationship-context"?"RELATIVE":Number.isFinite(n.year)?n.year:"UNDATED")+'</b></span><span>LINKS <b>'+list.length+'</b></span></div>'+
  '<p class="selection-desc">'+escape(n.desc)+'</p>'+
  '<p class="chronology-meta">'+escape(n.chronology?.label|| (n._placementBasis==='relationship-context'?'DIAGRAM ORDER ONLY / This position is not a documented historical date.':'Chronology referenced to linked evidence.'))+'</p>'+compareText+cmp+
  '<div class="selection-subhead">RELATIONSHIP TYPES <span>'+row.length+'</span></div>'+
  groupedRelationHTML(n,row)+timelineHTML(n)+
  '<div class="selection-subhead">SOURCES & REFERENCES <span>'+cited.length+'</span></div>'+
  cited.map(s=>'<a class="source-link" href="'+escape(s.url)+'" target="_blank" rel="noopener noreferrer"><b>↗ '+escape(s.title)+'</b><small>'+escape(s.publisher)+' / '+escape(s.id)+'</small></a>').join("")+
  '<button type="button" class="panel-link" id="copy-node">COPY DIRECT LINK ↗</button></div>';
 inner.querySelectorAll("[data-node]").forEach(b=>b.addEventListener("click",()=>select(b.dataset.node,true)));
 $("#copy-node")?.addEventListener("click",async()=>{
   const url=location.origin+location.pathname+"#entity="+encodeURIComponent(n.id);
   try{await navigator.clipboard.writeText(url);$("#copy-node").textContent="COPIED ✓";}catch(_){$("#copy-node").textContent="COPY FAILED — USE ADDRESS BAR";}
 });
}
function renderRelationLegend(){
 const host=$("#relation-key");
 if(!host)return;
 const keys=["studied","worked","founded","collaborated","designed","led"];
 host.replaceChildren();
 keys.forEach(key=>{
   const spec=grammar[key];if(!spec)return;
   const button=el("button","legend-item");
   const has=state.rels.has(key);
   button.type="button";
   button.setAttribute("aria-pressed",String(has));
   button.classList.toggle("disabled",!has);
   button.innerHTML='<i class="legend-line" style="border-top-color:'+escape(spec.color)+';border-top-style:'+(spec.dash?.length?"dashed":"solid")+'"></i><span>'+escape(spec.en)+'</span>';
   button.addEventListener("click",()=>{
     has?state.rels.delete(key):state.rels.add(key);
     renderRelationLegend();categoriesPanel();renderSelection();scheduleDraw();
   });
   host.append(button);
 });
 const more=el("button","legend-more","ALL TYPES ↗");
 more.addEventListener("click",()=>openFloating("filter-panel"));host.append(more);
}

function categoriesPanel(){
 const target=$("#filter-items");target.replaceChildren();
 for(const type of types){
   const label=el("label","filter-label");
   label.innerHTML='<input type="checkbox" data-type="'+escape(type)+'" '+(state.types.has(type)?"checked":"")+'><span class="color-key" style="background:'+colors[type]+'"></span><span>'+escape(typeNames[type]||type)+'</span><small>'+nodes.filter(n=>n.type===type).length+'</small>';
   label.querySelector("input").addEventListener("change",e=>{
     e.target.checked?state.types.add(type):state.types.delete(type);
     if(state.selected&&!visible(byId.get(state.selected))){state.selected=null;renderSelection();}
     scheduleDraw();
   });target.append(label);
 }
 const rel=$("#relation-items");rel.replaceChildren();
 edgeTypes.forEach(t=>{
   const label=el("label","relation-check");
   const spec=grammar[t]||{color:"#a3abb1",en:t,zh:t,dash:[]};
   label.innerHTML='<input type="checkbox" data-rel="'+escape(t)+'" '+(state.rels.has(t)?"checked":"")+'><i class="relation-filter-sample" style="border-color:'+escape(spec.color)+';border-top-style:'+((spec.dash||[]).length?'dashed':'solid')+'"></i><span>'+escape(spec.en)+' <small>'+escape(spec.zh)+'</small></span>';
   label.querySelector("input").addEventListener("change",e=>{
     e.target.checked?state.rels.add(t):state.rels.delete(t);renderRelationLegend();renderSelection();scheduleDraw();
   });rel.append(label);
 });
}
function refreshFilters(){categoriesPanel();}
function openFloating(id){
 for(const name of ["filter-panel","highlight-panel"]){
   const p=$("#"+name);
   p.hidden=name!==id?true:!p.hidden;
 }
 $("#filter-btn").classList.toggle("on",!$("#filter-panel").hidden);
 $("#highlight-btn").classList.toggle("on",!$("#highlight-panel").hidden);
 $("#filter-btn").setAttribute("aria-expanded",String(!$("#filter-panel").hidden));
 $("#highlight-btn").setAttribute("aria-expanded",String(!$("#highlight-panel").hidden));
}
function closeFloating(){
 ["filter-panel","highlight-panel"].forEach(name=>$("#"+name).hidden=true);
 for(const n of ["filter-btn","highlight-btn"]){$("#"+n).classList.remove("on");$("#"+n).setAttribute("aria-expanded","false");}
}
function renderHighlights(){
 const target=$("#highlight-items");
 Object.entries(themes).forEach(([id,t])=>{
   const b=el("button","highlight-item");
   b.innerHTML='<span><b>'+escape(t.label)+'</b><small>'+escape(t.subtitle)+'</small></span><span>↗</span>';
   b.addEventListener("click",()=>{
     state.activeThread=id;state.selected=null;state.compared=[];state.compare=false;
     $("#compare-btn").classList.remove("on");$("#compare-btn").setAttribute("aria-pressed","false");
     renderSelection();closeFloating();fit();scheduleDraw();
   });target.append(b);
 });
}
function searchMatches(){
 const input=$("#search").value.trim().toLocaleLowerCase(),pane=$("#search-matches");
 pane.replaceChildren();
 if(!input){pane.hidden=true;return;}
 const results=nodes.filter(n=>(n.name+" "+n.en).toLocaleLowerCase().includes(input))
   .sort((a,b)=>(degree.get(b.id)||0)-(degree.get(a.id)||0)).slice(0,12);
 if(!results.length){const empty=el("div","", "No matching entity in this research edition.");empty.style.padding="14px";pane.append(empty);}
 results.forEach(n=>{
  const b=el("button");b.type="button";
  b.innerHTML='<b>'+escape(n.name)+'</b><span>'+escape(n.en)+' / '+escape(D.categories[n.type]?.en)+'</span>';
  b.addEventListener("click",()=>{pane.hidden=true;$("#search").value=n.name;select(n.id,true);closeFloating();});pane.append(b);
 });
 pane.hidden=false;
}
function showModal(kind){
 closeFloating();
 const guide=kind==="guide",modal=$("#info-modal");
 $("#modal-eyebrow").textContent=guide?"READING THE MAP / QUICK GUIDE":"RESEARCH ATLAS / RELATION GRAMMAR";
 $("#modal-title").innerHTML=guide?'How to read<br><em>the network.</em>':'Architecture in Taiwan,<br><em>all at once.</em>';
 if(guide){
   $("#modal-body").innerHTML='<p>每個圓點代表一個人物、設計事務所、學校／機構、作品或建築刊物。淡色曲線表示有來源記載的關係；點選後會顯示相關節點、具體關係類型與參考文獻。</p>'+
   '<div class="dual"><div><span class="eyebrow">01 / NAVIGATION</span><h2>Pan, zoom, select.</h2><p>拖曳平移、滾輪縮放。按 / 搜尋，點選節點沿著關係繼續探索；FIT VIEW 回到全圖。</p></div>'+
   '<div><span class="eyebrow">02 / EXPLORE</span><h2>Search, trace, compare.</h2><p>FILTER 可限定資料類型與時間；HIGHLIGHTS 提供研究切面；COMPARE 選取兩點後搜尋已記錄的最短關係路徑。</p></div>'+
   '<div><span class="eyebrow">03 / TIME</span><h2>Chronology is provisional.</h2><p>水平位置區分學校成立或教育關聯、人物職涯、事務所創立及建築落成／試營運；若只有得獎資料則使用得獎年份。尚未核實的資料僅按關係相對定位，不能當成已查證日期。</p></div>'+
   '<div><span class="eyebrow">04 / CAUTION</span><h2>Source ≠ influence.</h2><p>共同列名於得獎名錄不代表師徒或思想傳承。收錄資料並不完整，網絡中心性不代表建築成就的高低。</p></div></div>';
 }else{
  $("#modal-body").innerHTML='<p>這是一個持續擴充的臺灣建築文化關係研究計畫。第一批以戰後建築史、教育譜系，以及《建築師》雜誌歷屆臺灣建築獎的得獎設計團隊與作品為基礎。目的是讓專業關係可以被探索、檢查和引用，而不是將知名度等同於建築價值。</p>'+
   '<div class="dual"><div><span class="eyebrow">SCOPE</span><h2>A living archive.</h2><p>包括人物、事務所、文化及教育機構、建築作品與專業刊物。年代座標依據不同類型的文獻事件，已在資料欄位逐項註明。</p></div>'+
   '<div><span class="eyebrow">METHODOLOGY</span><h2>Every line is a claim.</h2><p>每一條連線都有關係敘述及來源 ID。資料可能仍有歸屬與史料完整性問題；歡迎提出可查證的修訂，不會從風格相似直接推斷影響。</p></div></div>'+
   '<h2>Primary research and source references</h2><p>本階段收錄《建築師》雜誌得獎名錄、臺灣現代建築譜系論文、博物館與事務所紀錄。以超連結指向原始來源，不重製尚未授權的建築攝影。</p>'+
   '<div class="source-pool">'+D.sources.map(s=>'<a href="'+escape(s.url)+'" target="_blank" rel="noopener noreferrer">'+escape(s.id)+' / '+escape(s.title)+'</a>').join("")+'</div>'+
   '<a class="modal-link" href="https://github.com/arc-hao-0215/arc-hao-0215.github.io/issues/new" target="_blank" rel="noopener noreferrer">SUBMIT CORRECTION OR EVIDENCE ↗</a>';
 }
 $("#modal-backdrop").hidden=false;modal.hidden=false;$("#modal-close").focus();
}
function closeModal(){$("#modal-backdrop").hidden=true;$("#info-modal").hidden=true;}
function exportData(){
 const cols=["source_id","source","target_id","target","relationship","description","reference_year","source_ids","source_urls"];
 const csvVal=x=>'"'+String(x??"").replace(/^([=+@-])/,"'$1").replace(/"/g,'""')+'"';
 const rows=edges.map(e=>[e.a,byId.get(e.a)?.name,e.b,byId.get(e.b)?.name,e.type,e.label,e.year||"",e.src?.join(";"),e.src?.map(id=>sources.get(id)?.url).join(";")]);
 const text="\ufeff"+[cols,...rows].map(row=>row.map(csvVal).join(",")).join("\r\n");
 const u=URL.createObjectURL(new Blob([text],{type:"text/csv;charset=utf-8;"}));
 const a=document.createElement("a");a.href=u;a.download="architecture-in-taiwan-atlas-v2.csv";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1500);
}
layout();categoriesPanel();renderRelationLegend();renderHighlights();
$("#filter-btn").addEventListener("click",()=>openFloating("filter-panel"));
$("#highlight-btn").addEventListener("click",()=>openFloating("highlight-panel"));
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",closeFloating));
$("#guide-btn").addEventListener("click",()=>showModal("guide"));
$("#about-btn").addEventListener("click",()=>showModal("about"));
$("#modal-close").addEventListener("click",closeModal);
$("#modal-backdrop").addEventListener("click",closeModal);
$("#night-btn").addEventListener("click",()=>{
 state.dark=!state.dark;document.body.classList.toggle("night",state.dark);
 $("#night-btn").classList.toggle("on",state.dark);$("#night-btn").setAttribute("aria-pressed",String(state.dark));scheduleDraw();
});
$("#compare-btn").addEventListener("click",()=>{
 state.compare=!state.compare;state.compared=state.selected?[state.selected]:[];
 state.activeThread=null;$("#compare-btn").classList.toggle("on",state.compare);
 $("#compare-btn").setAttribute("aria-pressed",String(state.compare));
 renderSelection();scheduleDraw();
});
$("#close-selection").addEventListener("click",()=>{
 state.selected=null;state.compared=[];state.compare=false;
 $("#compare-btn").classList.remove("on");$("#compare-btn").setAttribute("aria-pressed","false");
 renderSelection();scheduleDraw();
 try{history.replaceState(null,"",location.pathname+location.search);}catch(_){}
});
$("#year").addEventListener("input",e=>{
 state.year=Number(e.target.value);$("#year-label").textContent=state.year;
 if(state.selected&&!visible(byId.get(state.selected)))state.selected=null;
 renderSelection();scheduleDraw();
});
$("#year-reset").addEventListener("click",()=>{
 state.year=2026;$("#year").value=2026;$("#year-label").textContent=2026;scheduleDraw();
});
$("#all-filter-reset").addEventListener("click",()=>{
 state.types=new Set(types);state.rels=new Set(edgeTypes);state.year=2026;
 $("#year").value=2026;$("#year-label").textContent=2026;categoriesPanel();renderRelationLegend();renderSelection();scheduleDraw();
});
$("#search").addEventListener("input",searchMatches);
$("#search").addEventListener("keydown",e=>{
 if(e.key==="Escape"){$("#search-matches").hidden=true;return;}
 if(e.key==="Enter"){
   const input=e.target.value.trim().toLocaleLowerCase();
   const n=nodes.find(n=>(n.name+" "+n.en).toLocaleLowerCase().includes(input));
   if(input&&n){select(n.id,true);$("#search-matches").hidden=true;}
 }
});
document.addEventListener("keydown",e=>{
 if(e.key==="Escape"){closeFloating();closeModal();$("#search-matches").hidden=true;return;}
 if(e.key==="/"&&!["INPUT","TEXTAREA"].includes(document.activeElement.tagName)){e.preventDefault();$("#search").focus();}
});
document.addEventListener("click",e=>{if(!e.target.closest(".search-shell"))$("#search-matches").hidden=true;});
$("#fit-btn").addEventListener("click",fit);$("#zoom-reset").addEventListener("click",fit);
$("#zoom-plus").addEventListener("click",()=>zoom(1.3));$("#zoom-minus").addEventListener("click",()=>zoom(1/1.3));
$("#export-csv").addEventListener("click",exportData);
$("#share-btn").addEventListener("click",async()=>{
 const a=$("#share-btn");try{await navigator.clipboard.writeText(location.href);a.textContent="COPIED ✓";setTimeout(()=>a.textContent="SHARE VIEW ↗",1500);}catch(_){a.textContent="COPY UNAVAILABLE";}
});
canvas.addEventListener("wheel",e=>{
 e.preventDefault();const r=canvas.getBoundingClientRect();
 zoom(e.deltaY<0?1.125:.89,e.clientX-r.left,e.clientY-r.top);
},{passive:false});
canvas.addEventListener("pointerdown",e=>{
 if(e.button!==0)return;
 pointer={id:e.pointerId,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,camX:camera.x,camY:camera.y,moved:false};
 canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener("pointermove",e=>{
 const rect=canvas.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;
 if(pointer&&pointer.id===e.pointerId){
   if(Math.abs(e.clientX-pointer.startX)+Math.abs(e.clientY-pointer.startY)>4)pointer.moved=true;
   if(pointer.moved){camera.x=pointer.camX+e.clientX-pointer.x;camera.y=pointer.camY+e.clientY-pointer.y;canvas.classList.add("dragging");scheduleDraw();}
   return;
 }
 const n=nearest(x,y);
 if(n?.id!==state.hover){state.hover=n?.id||null;scheduleDraw();}
 canvas.style.cursor=n?"pointer":"grab";
 const tip=$("#hover-label");
 if(n){tip.hidden=false;tip.innerHTML='<b>'+escape(n.name)+'</b><small>'+escape(n.en)+' / <span class="hover-type">'+escape(D.categories[n.type]?.en)+'</span></small>';tip.style.left=Math.min(W-240,x+17)+"px";tip.style.top=Math.max(24,y-46)+"px";}else tip.hidden=true;
});
canvas.addEventListener("pointerup",e=>{
 if(!pointer)return;
 const wasDragged=pointer.moved;pointer=null;canvas.classList.remove("dragging");
 if(!wasDragged){
   const rect=canvas.getBoundingClientRect(),n=nearest(e.clientX-rect.left,e.clientY-rect.top);
   if(n){select(n.id);closeFloating();}
 }
});
canvas.addEventListener("pointercancel",()=>{pointer=null;canvas.classList.remove("dragging");});
canvas.addEventListener("pointerleave",()=>{$("#hover-label").hidden=true;state.hover=null;scheduleDraw();});
canvas.addEventListener("dblclick",e=>{if(!state.hover)fit();});
canvas.addEventListener("keydown",e=>{
 if(e.key==="+"||e.key==="="){zoom(1.25);e.preventDefault();}
 else if(e.key==="-"){zoom(.8);e.preventDefault();}
 else if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)){
   if(e.key==="ArrowLeft")camera.x+=45;if(e.key==="ArrowRight")camera.x-=45;
   if(e.key==="ArrowUp")camera.y+=45;if(e.key==="ArrowDown")camera.y-=45;
   scheduleDraw();e.preventDefault();
 }
});
if(typeof ResizeObserver!=="undefined")new ResizeObserver(resize).observe(canvas);
else window.addEventListener("resize",resize);
resize();
const deepLink=decodeURIComponent((location.hash.match(/^#entity=(.*)$/)||[])[1]||"");
if(byId.has(deepLink))select(deepLink,true);
window.addEventListener("hashchange",()=>{
 const id=decodeURIComponent((location.hash.match(/^#entity=(.*)$/)||[])[1]||"");
 if(byId.has(id))select(id,true);
});
})();
