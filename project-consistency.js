/*
 * Shared enhancement for the ten portfolio projects.
 * Adds consistent chapter indexing/current state and styles existing carousel
 * buttons without replacing or double-binding their page-specific controllers.
 */
(()=>{
 const body=document.body;
 if(!body?.classList.contains('portfolio-project'))return;
 const NAV='.lf-onpage,.ftb-inpage,.rt-onpage,.tc-onpage,.soc-onpage,.ed-onpage,.sa-jump,.bab-onpage,.gh-nav,.wp-onpage';
 const nav=document.querySelector(NAV);
 if(nav && !body.classList.contains('lf-page')){
  nav.setAttribute('aria-label','Explore this project');
  const links=[...nav.querySelectorAll(':scope > a[href^="#"]')];
  links.forEach((a,i)=>{
   const targetId=a.getAttribute('href').slice(1);
   if(!document.getElementById(targetId))return;
   const label=a.textContent.replace(/^\s*\d{1,2}\s*(?:\/\s*)?/,'').trim();
   a.textContent=String(i+1).padStart(2,'0')+' / '+label;
  });
  const targets=links.map(a=>({a,s:document.getElementById(a.getAttribute('href').slice(1))})).filter(item=>item.s);
  let frame=0;
  const refresh=()=>{
   frame=0;if(!targets.length)return;
   const line=Math.min(window.innerHeight*.36,250);
   let active=-1;
   targets.forEach((item,i)=>{if(item.s.getBoundingClientRect().top<=line)active=i});
   if(active===-1 && nav.getBoundingClientRect().bottom<line)active=0;
   targets.forEach((item,i)=>{
    const yes=i===active;
    item.a.classList.toggle('is-project-active',yes);
    if(yes)item.a.setAttribute('aria-current','location');
    else item.a.removeAttribute('aria-current');
   });
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(refresh)};
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  addEventListener('hashchange',schedule,{passive:true});
  refresh();
 }
 const controls=[
  ['.ftb-carousel [data-dir="-1"],.tc-carousel [data-tc-direction="-1"],#sa-interior-prev,.wp-carousel [data-carousel-prev],[data-gh-plan-prev]','ps-prev'],
  ['.ftb-carousel [data-dir="1"],.tc-carousel [data-tc-direction="1"],#sa-interior-next,.wp-carousel [data-carousel-next],[data-gh-plan-next]','ps-next'],
  ['.ftb-carousel .ftb-toggle,.tc-carousel [data-tc-autoplay-toggle],.ed-drawing-switch .ed-autoplay-toggle,#sa-interior-pause,.wp-carousel [data-carousel-toggle],[data-gh-plan-pause]','ps-play-toggle']
 ];
 controls.forEach(([selector,cls])=>document.querySelectorAll(selector).forEach(b=>b.classList.add(cls)));
 /* Give the older carousel implementations the same arrow-key interaction.
  * Delegate to existing buttons so original slide notes, counters and timers stay synced.
  */
 [
  ['.ftb-carousel','[data-dir="-1"]','[data-dir="1"]'],
  ['.wp-carousel','[data-carousel-prev]','[data-carousel-next]'],
  ['.gh-plan-controls','[data-gh-plan-prev]','[data-gh-plan-next]'],
  ['.ed-drawing-switch','[data-view="basement"]','[data-view="ground"]']
 ].forEach(([rootSelector,prevSelector,nextSelector])=>{
  document.querySelectorAll(rootSelector).forEach(root=>{
   if(!root.hasAttribute('tabindex'))root.setAttribute('tabindex','0');
   root.addEventListener('keydown',event=>{
    if(event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;
    if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
    event.preventDefault();
    root.querySelector(event.key==='ArrowLeft'?prevSelector:nextSelector)?.click();
   });
  });
 });
 /* Harmonize the small zoom hint while leaving captions and original credits intact. */
 document.querySelectorAll('figure figcaption').forEach(caption=>{
  const last=caption.lastElementChild;
  if(!last)return;
  const raw=last.textContent;
  if(/Enlarge\s*↗/i.test(raw) && !last.querySelector('a,button')){
   last.textContent=raw.replace(/Enlarge\s*↗/gi,'VIEW ↗');
  }
 });
 /* Content remains visible if scripting is unavailable or motion is reduced. */
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches &&
   'IntersectionObserver' in window){
  const headings=[...document.querySelectorAll(
   '.ftb-chapter,.rt-chapter-head,.tc-chapter-head,.soc-chapter-head,.ed-chapter-head,.sa-section-heading,.bab-chapter-head,.gh-chapter-head,.wp-chapter'
  )];
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{if(entry.isIntersecting){
    entry.target.classList.add('ps-visible');observer.unobserve(entry.target);
   }});
  },{rootMargin:'0px 0px -6% 0px',threshold:0});
  headings.forEach(h=>{h.classList.add('ps-reveal');observer.observe(h)});
  requestAnimationFrame(()=>body.classList.add('ps-motion-ready'));
 }
})();
