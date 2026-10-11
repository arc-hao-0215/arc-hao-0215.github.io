/* One consistent, accessible figure viewer for every research essay.
   Retains original captions/links and each page's editorial image layouts. */
(() => {
  'use strict';
  const article = document.querySelector('.research-article');
  if (!article) return;
  const candidates = [...article.querySelectorAll('.essay-body figure')].filter(f => f.querySelector('figcaption') && !f.closest('dialog'));
  if (!candidates.length) return;
  const items = [];
  const indexSelectors = '.nl-photo-index,.italy-photo-index,.water-photo-index,.ground-photo-index,.rr-figure-num,.rb-number,.civic-image-index,.sh-photo-index,.hk-photo-index,.ga-photo-index';
  candidates.forEach((figure, number) => {
    const caption = figure.querySelector('figcaption');
    if (!caption || caption.classList.contains('rs-normalized')) return;
    caption.classList.add('rs-normalized');
    const numberString = String(number + 1).padStart(2, '0');
    const oldNumber = caption.querySelector(indexSelectors);
    let oldLabel = oldNumber && oldNumber.textContent.trim() || '';
    if (!oldLabel) {
      const first = caption.firstElementChild;
      if (first && first.children.length === 0 && /^(?:(?:FIELD|ARCHIVE|VISUAL|ATLAS|STUDY|MAP|FIG)\s*[./ ]\s*)?\d{1,3}$/i.test(first.textContent.trim())) {
        oldLabel = first.textContent.trim();
        first.remove();
      }
    } else oldNumber.remove();
    const copy = document.createElement('div');
    copy.className = 'rs-caption-copy';
    while (caption.firstChild) copy.appendChild(caption.firstChild);
    const meta = document.createElement('div');
    meta.className = 'rs-caption-meta';
    const index = document.createElement('span');
    index.className = 'rs-figure-index';
    index.textContent = 'FIG. ' + numberString;
    meta.appendChild(index);
    const parsed = oldLabel.match(/^(FIELD|ARCHIVE|ATLAS|STUDY|MAP)\s*\/\s*(\d+)/i);
    let evidence = '';
    if (parsed) evidence = parsed[1].toUpperCase() === 'FIELD' ? 'Field record ' + parsed[2] : parsed[1].toUpperCase();
    if (evidence) {
      const type = document.createElement('span');
      type.className = 'rs-figure-type';
      type.textContent = evidence;
      meta.appendChild(type);
    }
    caption.append(meta, copy);
    figure.classList.add('rs-figure');
    figure.dataset.rsFigure = numberString;
    const image = figure.querySelector('img');
    if (!image) return;
    const trigger = image.closest('a,button');
    if (!trigger || !figure.contains(trigger) || caption.contains(trigger)) return;
    const full = trigger.getAttribute('data-full') || trigger.getAttribute('data-ga-zoom') || (trigger.getAttribute('href') !== '#' ? trigger.getAttribute('href') : '') || image.getAttribute('src');
    if (!full) return;
    trigger.setAttribute('data-rs-view','');
    trigger.setAttribute('aria-label','Enlarge figure ' + numberString + ': ' + (image.alt || 'Research image'));
    if (trigger.tagName.toLowerCase() === 'a') trigger.removeAttribute('target');
    const rec = {figure, caption:copy, image, trigger, full, number:numberString};
    items.push(rec);
    image.addEventListener('error',() => figure.classList.add('rs-missing-image'));
    if (image.complete && !image.naturalWidth) figure.classList.add('rs-missing-image');
  });
  if (!items.length || typeof HTMLDialogElement === 'undefined') return;
  const dlg = document.createElement('dialog');
  dlg.className = 'rs-viewer';
  dlg.setAttribute('aria-label', 'Research figure viewer');
  dlg.innerHTML = '<div class="rs-viewer-toolbar"><span class="rs-viewer-label"></span><div class="rs-viewer-actions"><button type="button" data-rs-act="previous" aria-label="Previous image">← Previous</button><button type="button" data-rs-act="next" aria-label="Next image">Next →</button><button type="button" data-rs-act="minus" aria-label="Zoom out">−</button><button type="button" data-rs-act="plus" aria-label="Zoom in">+</button><button type="button" data-rs-act="fit" aria-label="Fit image to screen">Fit</button><a class="rs-viewer-file" href="#" target="_blank" rel="noopener" aria-label="Open original image file">Image file ↗</a><button type="button" data-rs-act="close" aria-label="Close image viewer">Close ×</button></div></div><div class="rs-viewer-viewport" tabindex="0"><div class="rs-viewer-stage"><img alt=""></div></div><div class="rs-viewer-footer"><p></p><p class="rs-viewer-help">Click an image to inspect it. Use + / − to zoom, arrow keys to browse, Esc to close; the original figure caption remains on the page.</p></div>';
  document.body.appendChild(dlg);
  const fullImage = dlg.querySelector('.rs-viewer-stage img');
  const viewport = dlg.querySelector('.rs-viewer-viewport');
  const fileLink = dlg.querySelector('.rs-viewer-file');
  const label = dlg.querySelector('.rs-viewer-label');
  const footer = dlg.querySelector('.rs-viewer-footer p');
  let active = 0, zoom = 1, returnFocus = null;
  function fitImage() {
    if (!fullImage.naturalWidth || !dlg.open) return;
    const w = Math.max(1, viewport.clientWidth - 36);
    const h = Math.max(1, viewport.clientHeight - 36);
    const fit = Math.min(w / fullImage.naturalWidth, h / fullImage.naturalHeight, 1);
    fullImage.style.width = Math.round(fullImage.naturalWidth * fit * zoom) + 'px';
    fullImage.style.height = Math.round(fullImage.naturalHeight * fit * zoom) + 'px';
  }
  function display(next) {
    active = (next + items.length) % items.length;
    const item = items[active];
    zoom = 1;
    label.textContent = 'FIG. ' + item.number + ' · ' + (active + 1) + ' / ' + items.length;
    footer.textContent = item.caption.textContent.replace(/\s+/g,' ').trim();
    fullImage.alt = item.image.alt || 'Research figure ' + item.number;
    fullImage.removeAttribute('src');
    fullImage.src = new URL(item.full, document.baseURI).href;
    fullImage.style.width = 'auto';
    fullImage.style.height = 'auto';
    fileLink.href = fullImage.src;
    viewport.scrollLeft = 0;
    viewport.scrollTop = 0;
    fitImage();
  }
  fullImage.addEventListener('load', fitImage);
  fullImage.addEventListener('error',()=>{footer.textContent = 'The full-size image could not be loaded. Please check the source image file.';});
  function changeZoom(multiplier) {
    zoom = Math.max(1, Math.min(6, Math.round(zoom * multiplier * 100) / 100));
    fitImage();
  }
  document.addEventListener('click', event => {
    const target = event.target.closest?.('[data-rs-view]');
    if (!target || !article.contains(target)) return;
    const idx = items.findIndex(i=>i.trigger === target);
    if (idx < 0) return;
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!dlg.showModal) return;
    returnFocus = target;
    if (!dlg.open) dlg.showModal();
    display(idx);
    dlg.querySelector('[data-rs-act="close"]').focus();
  }, true);
  dlg.addEventListener('click', event => {
    const button = event.target.closest?.('[data-rs-act]');
    if (button) {
      const action = button.dataset.rsAct;
      if (action === 'close') dlg.close();
      else if (action === 'previous') display(active - 1);
      else if (action === 'next') display(active + 1);
      else if (action === 'plus') changeZoom(1.5);
      else if (action === 'minus') changeZoom(1 / 1.5);
      else if (action === 'fit') {zoom=1;fitImage();viewport.scrollLeft=0;viewport.scrollTop=0;}
    } else if (event.target === dlg) dlg.close();
  });
  dlg.addEventListener('keydown',event=>{
    if (event.key === 'ArrowRight' && event.target !== viewport) {event.preventDefault();display(active+1);}
    if (event.key === 'ArrowLeft' && event.target !== viewport) {event.preventDefault();display(active-1);}
  });
  dlg.addEventListener('close',()=>{fullImage.removeAttribute('src');returnFocus?.focus();});
  window.addEventListener('resize',fitImage,{passive:true});
})();