const $=(s)=>document.querySelector(s),$$=(s)=>[...document.querySelectorAll(s)];
function setPressed(buttons,active){buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===active)))}
$$('[data-mode]').forEach(b=>b.addEventListener('click',()=>{setPressed($$('[data-mode]'),b);$('#visual-view').hidden=b.dataset.mode!=='visual';$('#index-view').hidden=b.dataset.mode!=='index';const u=new URL(location);if(b.dataset.mode==='index')u.searchParams.set('view','index');else u.searchParams.delete('view');history.replaceState(null,'',u)}));
if(new URL(location).searchParams.get('view')==='index')$('[data-mode=index]')?.click();
$$('[data-research]').forEach(b=>b.addEventListener('click',()=>{setPressed($$('[data-research]'),b);$('#research-map').hidden=b.dataset.research!=='map';$('#research-index').hidden=b.dataset.research!=='index'}));
// Self-contained world atlas; no tile service, API key, or external scripts.
const atlas=$('#world-map');
if(atlas){
 let box={x:0,y:0,w:1000,h:500},pointers=new Map(),dragged=false;
 const markers=$$('[data-map-marker]');
 function render(){box.w=Math.max(125,Math.min(1000,box.w));box.h=box.w/2;box.x=Math.max(0,Math.min(1000-box.w,box.x));box.y=Math.max(0,Math.min(500-box.h,box.y));atlas.setAttribute('viewBox',`${box.x} ${box.y} ${box.w} ${box.h}`);const z=box.w/1000;markers.forEach(m=>{const base=m.dataset.origin||(m.dataset.origin=m.getAttribute('transform'));m.setAttribute('transform',`${base} scale(${z})`)});$('#map-scale').textContent=(1000/box.w).toFixed(1)+'×';}
 function local(clientX,clientY){const p=new DOMPoint(clientX,clientY);return p.matrixTransform(atlas.getScreenCTM().inverse())}
 function zoom(factor,cx=box.x+box.w/2,cy=box.y+box.h/2){const w=Math.max(125,Math.min(1000,box.w*factor)),f=w/box.w;box={x:cx-(cx-box.x)*f,y:cy-(cy-box.y)*f,w,h:w/2};render()}
 function reset(){box={x:0,y:0,w:1000,h:500};render()}
 $$('[data-map-action]').forEach(b=>b.addEventListener('click',()=>{switch(b.dataset.mapAction){case'in':zoom(.7);break;case'out':zoom(1/.7);break;case'world':reset();break;case'sites':box={x:440,y:75,w:440,h:220};render();break}}));
 atlas.addEventListener('wheel',e=>{if(!e.ctrlKey&&!e.metaKey)return;e.preventDefault();const p=local(e.clientX,e.clientY);zoom(Math.exp(e.deltaY*.002),p.x,p.y)},{passive:false});
 atlas.addEventListener('keydown',e=>{if(e.target!==atlas)return;const step=box.w*.08;if(['+','=','-','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))e.preventDefault();switch(e.key){case'+':case'=':zoom(.7);break;case'-':zoom(1/.7);break;case'ArrowLeft':box.x-=step;render();break;case'ArrowRight':box.x+=step;render();break;case'ArrowUp':box.y-=step;render();break;case'ArrowDown':box.y+=step;render();break;case'Home':reset();break}});
 atlas.addEventListener('pointerdown',e=>{if(e.button!==0)return;dragged=false;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(!e.target.closest('a'))atlas.setPointerCapture(e.pointerId)});
 atlas.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;const old=pointers.get(e.pointerId),now={x:e.clientX,y:e.clientY};if(Math.hypot(now.x-old.x,now.y-old.y)>2)dragged=true;
 if(pointers.size===2){const other=[...pointers.entries()].find(([id])=>id!==e.pointerId)[1];const d1=Math.hypot(old.x-other.x,old.y-other.y),d2=Math.hypot(now.x-other.x,now.y-other.y);if(d1>0&&d2>0){const p=local((now.x+other.x)/2,(now.y+other.y)/2);zoom(d1/d2,p.x,p.y)}}else{const p1=local(old.x,old.y),p2=local(now.x,now.y);box.x-=p2.x-p1.x;box.y-=p2.y-p1.y;render()}pointers.set(e.pointerId,now)});
 ['pointerup','pointercancel','lostpointercapture'].forEach(type=>atlas.addEventListener(type,e=>pointers.delete(e.pointerId)));
 
 atlas.addEventListener('click',e=>{
   if(dragged){
     e.preventDefault();
     dragged=false;
   }
 },true);
 render();
}

// Load research catalogue on all research pages.
if (/^research(?:-[a-z0-9-]+)?\.html$/i.test(
  window.location.pathname.split("/").pop() || ""
)) {
  const researchScript = document.createElement("script");
  researchScript.src = "research-updates.js?v=20261008";
  document.head.appendChild(researchScript);
}

/* Homepage image carousel: sequential, pauseable and motion-aware. */
{
  const slides = [...document.querySelectorAll('.hero-carousel .hero-slide')];
  const dots = [...document.querySelectorAll('.hero-carousel [data-slide]')];
  const pause = document.querySelector('#hero-pause');
  const caption = document.querySelector('#hero-caption');
  const title = document.querySelector('#hero-title');
  const place = document.querySelector('#hero-place');
  if (slides.length && dots.length && caption && title && place) {
    let active = 0;
    let paused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let timer = null;
    const show = (index) => {
      active = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === active);
        slide.setAttribute('aria-hidden', String(i !== active));
      });
      dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === active)));
      const slide = slides[active];
      title.textContent = slide.dataset.title || '';
      place.textContent = slide.dataset.place || '';
      caption.href = slide.dataset.href || 'index.html';
    };
    const stop = () => { if (timer !== null) { clearInterval(timer); timer = null; } };
    const start = () => {
      stop();
      if (!paused && !document.hidden) timer = setInterval(() => show(active + 1), 6000);
    };
    dots.forEach((dot) => dot.addEventListener('click', () => {
      show(Number(dot.dataset.slide || 0));
      start();
    }));
    if (pause) {
      pause.textContent = paused ? 'Play' : 'Pause';
      pause.setAttribute('aria-pressed', String(paused));
      pause.addEventListener('click', () => {
        paused = !paused;
        pause.textContent = paused ? 'Play' : 'Pause';
        pause.setAttribute('aria-label', paused ? 'Play image carousel' : 'Pause image carousel');
        pause.setAttribute('aria-pressed', String(paused));
        start();
      });
    }
    document.addEventListener('visibilitychange', start);
    show(0);
    // Let the first slide render at natural scale before starting its slow zoom.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.querySelector('.hero-carousel')?.classList.add('is-zoom-ready');
      });
    });
    start();
  }
}
