
document.addEventListener('DOMContentLoaded',()=>{
 const page=document.querySelector('.rb-page');if(!page)return;
 const dialog=document.querySelector('#rb-lightbox'),full=dialog?.querySelector('img'),caption=dialog?.querySelector('figcaption');
 document.querySelectorAll('.rb-zoom').forEach(b=>b.addEventListener('click',()=>{
   if(!dialog||!dialog.showModal){window.open(b.dataset.full,'_blank','noopener');return}
   full.src=b.dataset.full;full.alt=b.querySelector('img')?.alt||'Research figure';caption.textContent=b.dataset.caption||'';dialog.showModal();
 }));
 dialog?.querySelector('.rb-lightbox-close')?.addEventListener('click',()=>dialog.close());
 dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
 dialog?.addEventListener('close',()=>{if(full)full.removeAttribute('src')});
 if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver' in window){
   const sections=[...document.querySelectorAll('.rb-section')];
   const ob=new IntersectionObserver(es=>{for(const e of es){if(e.isIntersecting){e.target.classList.add('rb-inview');ob.unobserve(e.target)}}},{threshold:.06,rootMargin:'0px 0px 50px 0px'});
   sections.forEach(s=>{if(s.getBoundingClientRect().top<window.innerHeight*.95)s.classList.add('rb-inview');ob.observe(s)});
   page.classList.add('rb-motion');
 }
});
