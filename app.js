const $=(s)=>document.querySelector(s),$$=(s)=>[...document.querySelectorAll(s)];
function setPressed(buttons,active){buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===active)))}
$$('[data-mode]').forEach(b=>b.addEventListener('click',()=>{setPressed($$('[data-mode]'),b);$('#visual-view').hidden=b.dataset.mode!=='visual';$('#index-view').hidden=b.dataset.mode!=='index';const u=new URL(location);if(b.dataset.mode==='index')u.searchParams.set('view','index');else u.searchParams.delete('view');history.replaceState(null,'',u)}));
if(new URL(location).searchParams.get('view')==='index')$('[data-mode=index]')?.click();
