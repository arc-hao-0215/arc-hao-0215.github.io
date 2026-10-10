/*
  LIGHTLY IN THE FOREST — Motion Study v2
  Existing chapter tracking / lightbox remain in their original controllers.
  This adds imagery, sequential analysis, and masterplan reading highlights.
*/
(()=>{
  const page=document.body;
  if(!page?.classList.contains('lf-page'))return;

  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const nav=document.querySelector('.lf-onpage');
  /* The page-local reader owns this index; it is not re-bound here. */
  nav?.querySelectorAll(':scope > a[href^="#"]').forEach((link,i)=>{
    const title=link.textContent.replace(/^\s*\d{1,2}\s*(?:\/\s*)?/,'').trim();
    link.textContent=String(i+1).padStart(2,'0')+' / '+title;
  });

  if(!reduced.matches && 'IntersectionObserver' in window){
    const items=[
      ...[...document.querySelectorAll('.lf-section .lf-figure')].map(figure=>({
        node:figure,type:'lf-r2-figure',
        delay:figure.closest('.lf-pair') ?
          [...figure.parentElement.children].indexOf(figure)*110:0
      })),
      ...[...document.querySelectorAll('.lf-conditions .lf-condition, .lf-strategy-principles article')].map(item=>({
        node:item,type:'lf-r2-card',
        delay:[...item.parentElement.children].indexOf(item)*110
      })),
      ...[...document.querySelectorAll('.lf-spatial-part .lf-subsection-head')].map(node=>({
        node,type:'lf-r2-subhead',delay:0
      }))
    ];

    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(!entry.isIntersecting)continue;
        entry.target.classList.add('lf-r2-in');
        observer.unobserve(entry.target);
      }
    },{rootMargin:'0px 0px -7% 0px',threshold:0.015});

    for(const {node,type,delay} of items){
      node.classList.add(type);
      node.style.setProperty('--lf-r2-delay',delay+'ms');
      const rect=node.getBoundingClientRect();
      /* Above-the-fold content never flashes invisible. */
      if(rect.top<innerHeight*.89 && rect.bottom>0){
        node.classList.add('lf-r2-in');
      }else{
        observer.observe(node);
      }
    }
    requestAnimationFrame(()=>page.classList.add('lf-r2-ready'));
  }

  /* Site plan: activate its original three annotations as the drawing is read.
     No crop, pan, overlay, fake map marker, or rewrite of the drawing itself. */
  const layout=document.querySelector('.lf-plan-layout');
  const drawing=layout?.querySelector('.lf-figure--plan');
  const steps=layout?[...layout.querySelectorAll('.lf-plan-list li')]:[];
  if(!layout || !drawing || steps.length!==3)return;

  let frame=0;
  let lastActive=-1;
  const update=()=>{
    frame=0;
    if(innerWidth<=1000){
      layout.classList.remove('lf-r2-plan-reading');
      steps.forEach(li=>{li.classList.remove('lf-r2-step-current');li.removeAttribute('aria-current')});
      lastActive=-1;return;
    }
    const wrap=layout.getBoundingClientRect();
    const reading=wrap.top<innerHeight*.60 && wrap.bottom>innerHeight*.23;
    layout.classList.toggle('lf-r2-plan-reading',reading);
    if(!reading){
      if(lastActive!==-1){
        steps.forEach(li=>{li.classList.remove('lf-r2-step-current');li.removeAttribute('aria-current')});
        lastActive=-1;
      }
      return;
    }
    const box=drawing.getBoundingClientRect();
    const sight=innerHeight*.47;
    const progress=Math.max(0,Math.min(.999,(sight-box.top)/Math.max(1,box.height)));
    const active=Math.min(2,Math.floor(progress*3));
    if(active===lastActive)return;
    lastActive=active;
    steps.forEach((li,index)=>{
      const yes=index===active;
      li.classList.toggle('lf-r2-step-current',yes);
      if(yes)li.setAttribute('aria-current','step');
      else li.removeAttribute('aria-current');
    });
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  addEventListener('pageshow',schedule);
  update();
})();
