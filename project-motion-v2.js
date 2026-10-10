/*
 * Editorial Motion System / 2026-10-10
 * Progressive enhancement only: the original carousels, zoom/lightboxes,
 * site plans, graphic files and dynamic drawing switches stay untouched.
 */
(()=>{
 const page=document.body;
 if(!page?.classList.contains('pm-v2'))return;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const NAV='.ftb-inpage,.rt-onpage,.tc-onpage,.soc-onpage,.ed-onpage,.sa-jump,.bab-onpage,.gh-nav,.wp-onpage';
 const HEADING='.ftb-chapter,.rt-chapter-head,.tc-chapter-head,.soc-chapter-head,.ed-chapter-head,.sa-section-heading,.bab-chapter-head,.gh-chapter-head,.wp-chapter';
 const SUBHEAD='.tc-subhead,.ed-scene-head,.bab-subsection-head,.sa-feature-copy .sa-display-title,.gh-modes-intro';
 const SECTIONS='section.ftb-section,section.rt-section,section.tc-section,section.soc-section,section.ed-chapter,section.sa-section,section.bab-section,section.gh-section,section.wp-section';
 const nav=document.querySelector(NAV);
 nav?.classList.add('pm-chapter-nav');

 // A small progress rule is independent of the chapter index's own scroll logic.
 const bar=document.createElement('div');
 bar.className='pm-reading-progress';
 bar.setAttribute('aria-hidden','true');
 page.appendChild(bar);
 let raf=0;
 const tick=()=>{
  raf=0;
  const length=Math.max(1,document.documentElement.scrollHeight-innerHeight);
  const ratio=Math.max(0,Math.min(1,scrollY/length));
  bar.style.transform='scaleX('+ratio+')';
 };
 const schedule=()=>{if(!raf)raf=requestAnimationFrame(tick)};
 addEventListener('scroll',schedule,{passive:true});
 addEventListener('resize',schedule,{passive:true});
 addEventListener('pageshow',schedule);
 tick();

 const hero=document.querySelector('figure.ftb-hero,figure.rt-hero,figure.tc-figure--hero,figure.soc-figure--hero,figure.ed-hero,figure.sa-hero,figure.bab-figure--hero,figure.gh-hero,figure.wp-hero');
 hero?.classList.add('pm-hero');
 document.querySelector('.ftb-head,.rt-project-head,.tc-head,.soc-project-head,.ed-project-head,.sa-head,.bab-project-head,.gh-head,.wp-head')?.classList.add('pm-headline');
 if(page.matches('.ftb-page,.soc-page,.wp-page'))page.classList.add('pm-drawing-hero');

 const sections=[...document.querySelectorAll(SECTIONS)];
 sections.forEach(section=>section.classList.add('pm-section'));

 const ioSupported='IntersectionObserver' in window;
 // Section dividers animate once as each chapter is encountered.
 if(ioSupported && !reduced.matches){
  const chapterObserver=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{
    if(entry.isIntersecting){
     entry.target.classList.add('pm-section-in');
     chapterObserver.unobserve(entry.target);
    }
   });
  },{rootMargin:'0px 0px -10% 0px',threshold:0});
  sections.forEach(section=>chapterObserver.observe(section));
 }else sections.forEach(section=>section.classList.add('pm-section-in'));

 // Never apply the reveal to a slide that is initially hidden or toggled
 // by a page-owned carousel: animate its intact container once instead.
 const figures=[...document.querySelectorAll('figure')].filter(fig=>{
  if(fig===hero || !fig.querySelector('img'))return false;
  if(fig.closest('.ftb-carousel,.tc-carousel,.sa-interior-carousel,.gh-plan-slides,.wp-carousel'))return false;
  if(fig.classList.contains('ftb-slide') || fig.classList.contains('tc-slide') ||
     fig.classList.contains('sa-carousel-slide') || fig.classList.contains('gh-plan-slide'))return false;
  if(fig.closest('[hidden]') || fig.hidden)return false;
  return !!fig.querySelector('figcaption');
 });
 const carouselBlocks=[...document.querySelectorAll('.ftb-carousel,.tc-carousel,.sa-interior-carousel,.wp-carousel')];
 const headings=[...document.querySelectorAll(HEADING+','+SUBHEAD)].filter(element=>{
  // First Teaching Building already animates its .ftb-reveal sections.
  // Leave that controller in charge of those headings.
  return !element.classList.contains('ftb-reveal') &&
         !element.closest('.ftb-reveal') &&
         !element.closest('[hidden]');
 });
 const staggerGroups=[
  '.rt-principles > article',
  '.tc-swot-item',
  '.soc-points > .soc-point',
  '.ed-principles > article',
  '.sa-route-index > a',
  '.bab-operations-copy > article',
  '.bab-movement-steps > p',
  '.gh-element-list > li',
  '.wp-facts > p'
 ];
 const cardSelector=staggerGroups.join(',');
 const cards=[...document.querySelectorAll(cardSelector)];
 const seen=new Set();
 const items=[];
 function add(element,kind,delay=0){
  if(!element || seen.has(element))return;
  seen.add(element);
  items.push({element,kind,delay});
 }
 headings.forEach(el=>add(el,'heading'));
 figures.forEach(fig=>{
  let delay=0;
  const row=fig.parentElement;
  if(row?.matches('.sa-two,.lf-pair,.soc-gallery,.bab-models,.gh-visual-pair,.ftb-image-pair')){
   delay=Math.min(2,[...row.children].indexOf(fig))*105;
  }
  add(fig,'figure',delay);
 });
 carouselBlocks.forEach(carousel=>add(carousel,'carousel'));
 cards.forEach(card=>{
  const group=card.parentElement;
  const n=[...group.children].indexOf(card);
  add(card,'analysis',Math.min(n,4)*110);
 });

 if(ioSupported && !reduced.matches){
  const revealObserver=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(!entry.isIntersecting)continue;
    entry.target.classList.add('pm-in');
    revealObserver.unobserve(entry.target);
   }
  },{rootMargin:'0px 0px -7% 0px',threshold:0.015});
  items.forEach(({element,kind,delay})=>{
   element.classList.add('pm-reveal');
   if(kind==='figure')element.classList.add('pm-figure');
   if(kind==='analysis')element.classList.add('pm-analysis');
   element.style.setProperty('--pm-delay',delay+'ms');
   const r=element.getBoundingClientRect();
   // Anything currently within the initial viewport stays immediately visible.
   if(r.top<innerHeight*.88 && r.bottom>0)element.classList.add('pm-in');
   else revealObserver.observe(element);
  });
  requestAnimationFrame(()=>page.classList.add('pm-motion-ready'));
 }else items.forEach(({element})=>element.classList.add('pm-in'));

 if(!reduced.matches)page.classList.add('pm-ready');

 // Lightweight reading accent for genuine enumerated analysis, never
 // fabricated hotspots over the user's original plans / drawings.
 const readingSelectors=['.bab-movement-steps','.gh-element-list','.wp-facts'];
 const readingLists=readingSelectors.map(x=>document.querySelector(x)).filter(Boolean);
 let readingFrame=0;
 const updateReading=()=>{
  readingFrame=0;
  const desktop=innerWidth>1000;
  readingLists.forEach(list=>{
   const children=[...list.children].filter(x=>x.matches('p,li'));
   if(!desktop || !children.length){
    list.classList.remove('pm-reading-active');
    children.forEach(item=>item.classList.remove('pm-reading-current'));
    return;
   }
   const rect=list.getBoundingClientRect();
   const visible=rect.top<innerHeight*.70 && rect.bottom>innerHeight*.20;
   list.classList.toggle('pm-reading-active',visible);
   const line=innerHeight*.48;
   let active=0;
   for(let i=0;i<children.length;i++){
    if(children[i].getBoundingClientRect().top<line)active=i;
   }
   children.forEach((item,index)=>item.classList.toggle('pm-reading-current',visible && index===active));
  });
 };
 readingLists.forEach(list=>{
  list.classList.add('pm-reading-list');
  [...list.children].filter(x=>x.matches('p,li')).forEach(x=>x.classList.add('pm-reading-item'));
 });
 const readingSchedule=()=>{if(!readingFrame)readingFrame=requestAnimationFrame(updateReading)};
 if(readingLists.length){
  addEventListener('scroll',readingSchedule,{passive:true});
  addEventListener('resize',readingSchedule,{passive:true});
  updateReading();
 }
})();
