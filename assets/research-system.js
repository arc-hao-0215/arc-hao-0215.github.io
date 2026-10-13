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
    // A linked source page (e.g. Wikimedia Commons HTML) is not an image.
    // Prefer the high-resolution image URL only when it really is image media.
    const href = trigger.getAttribute('href') || '';
    const isImageFile = /\.(?:avif|gif|jpe?g|png|svg|webp)(?:[?#]|$)/i.test(href);
    const full = trigger.getAttribute('data-full') ||
      trigger.getAttribute('data-ga-zoom') ||
      (isImageFile ? href : '') || image.currentSrc || image.getAttribute('src');
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
  dlg.innerHTML =
    '<div class="rs-viewer-toolbar">' +
      '<span class="rs-viewer-label" aria-live="polite"></span>' +
      '<div class="rs-viewer-actions">' +
        '<button type="button" data-rs-act="previous" aria-label="Previous image">← Previous</button>' +
        '<button type="button" data-rs-act="next" aria-label="Next image">Next →</button>' +
        '<button type="button" data-rs-act="minus" aria-label="Zoom out">−</button>' +
        '<span class="rs-viewer-zoom" aria-live="off">100%</span>' +
        '<button type="button" data-rs-act="plus" aria-label="Zoom in">+</button>' +
        '<button type="button" data-rs-act="fit" aria-label="Fit image to screen">Fit</button>' +
        '<button type="button" data-rs-act="close" aria-label="Close image viewer">Close ×</button>' +
      '</div>' +
    '</div>' +
    '<div class="rs-viewer-viewport" tabindex="0">' +
      '<div class="rs-viewer-stage"><img alt="" draggable="false"></div>' +
      '<p class="rs-viewer-status" role="status" hidden></p>' +
    '</div>' +
    '<div class="rs-viewer-footer"><p class="rs-viewer-caption"></p>' +
      '<p class="rs-viewer-help">Use + / − to inspect details, ← / → to browse, Esc to close. Captions and source credits remain on the research page.</p></div>';
  document.body.appendChild(dlg);
  const fullImage = dlg.querySelector('.rs-viewer-stage img');
  const viewport = dlg.querySelector('.rs-viewer-viewport');
  const label = dlg.querySelector('.rs-viewer-label');
  const footer = dlg.querySelector('.rs-viewer-caption');
  const status = dlg.querySelector('.rs-viewer-status');
  const indicator = dlg.querySelector('.rs-viewer-zoom');
  let active = 0, zoom = 1, returnFocus = null, displayToken = 0, usingFallback = false;
  let fittedWidth = 0;
  const currentItem = () => items[active];

  function fitImage() {
    if (!dlg.open || !fullImage.naturalWidth || !fullImage.naturalHeight) return;
    const w = Math.max(160, viewport.clientWidth - 40);
    const h = Math.max(120, viewport.clientHeight - 40);
    const base = Math.min(1, w / fullImage.naturalWidth, h / fullImage.naturalHeight);
    fittedWidth = Math.max(1, Math.round(fullImage.naturalWidth * base));
    applyZoom();
  }
  function applyZoom() {
    indicator.textContent = Math.round(zoom * 100) + '%';
    if (!fittedWidth) return;
    fullImage.style.width = Math.round(fittedWidth * zoom) + 'px';
    fullImage.style.height = 'auto';
    dlg.querySelector('[data-rs-act="minus"]').disabled = zoom <= 1;
    dlg.querySelector('[data-rs-act="plus"]').disabled = zoom >= 5;
  }
  function showImage(src, fallback = false) {
    usingFallback = fallback;
    fullImage.removeAttribute('src');
    fullImage.style.width = '';
    fullImage.style.height = '';
    fittedWidth = 0;
    status.hidden = false;
    status.textContent = 'Loading image…';
    fullImage.src = new URL(src, document.baseURI).href;
    if (fullImage.complete && fullImage.naturalWidth) requestAnimationFrame(fitImage);
  }
  function display(next) {
    active = (next + items.length) % items.length;
    const item = currentItem();
    displayToken++;
    zoom = 1;
    indicator.textContent = '100%';
    label.textContent = 'FIG. ' + item.number + '  ·  ' + (active + 1) + ' / ' + items.length;
    footer.textContent = item.caption.textContent.replace(/\s+/g, ' ').trim();
    fullImage.alt = item.image.alt || 'Research figure ' + item.number;
    viewport.scrollLeft = viewport.scrollTop = 0;
    showImage(item.full);
  }
  fullImage.addEventListener('load', () => {
    status.hidden = true;
    requestAnimationFrame(fitImage);
  });
  fullImage.addEventListener('error', () => {
    const item = currentItem();
    const thumb = item.image.currentSrc || item.image.src;
    if (!usingFallback && thumb && new URL(thumb, document.baseURI).href !== fullImage.src) {
      showImage(thumb, true);
      return;
    }
    status.hidden = false;
    status.textContent = 'This image could not be loaded. Its caption and original source remain available on the research page.';
  });
  function changeZoom(factor) {
    zoom = Math.max(1, Math.min(5, Math.round(zoom * factor * 100) / 100));
    applyZoom();
  }
  function openViewer(event) {
    const target = event.target.closest?.('[data-rs-view]');
    if (!target || !article.contains(target)) return;
    const idx = items.findIndex(item => item.trigger === target);
    if (idx < 0) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    returnFocus = target;
    if (!dlg.open) dlg.showModal();
    display(idx);
    dlg.querySelector('[data-rs-act="close"]').focus();
  }
  // Capture before older, page-specific gallery handlers; only image controls
  // are intercepted. Bibliography and source-credit links remain untouched.
  document.addEventListener('click', openViewer, true);
  document.addEventListener('auxclick', event => {
    const trigger = event.target.closest?.('[data-rs-view]');
    if (trigger && article.contains(trigger)) event.preventDefault();
  }, true);
  dlg.addEventListener('click', event => {
    const button = event.target.closest?.('[data-rs-act]');
    if (!button) {
      if (event.target === dlg) dlg.close();
      return;
    }
    const action = button.dataset.rsAct;
    if (action === 'close') dlg.close();
    else if (action === 'previous') display(active - 1);
    else if (action === 'next') display(active + 1);
    else if (action === 'plus') changeZoom(1.25);
    else if (action === 'minus') changeZoom(1 / 1.25);
    else if (action === 'fit') {
      zoom = 1; fitImage();
      viewport.scrollLeft = viewport.scrollTop = 0;
    }
  });
  dlg.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); display(active + 1); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); display(active - 1); }
    else if (event.key === '+' || event.key === '=') { event.preventDefault(); changeZoom(1.25); }
    else if (event.key === '-') { event.preventDefault(); changeZoom(1 / 1.25); }
    else if (event.key === '0') { event.preventDefault(); zoom = 1; fitImage(); }
  });
  dlg.addEventListener('close', () => {
    displayToken++;
    fullImage.removeAttribute('src');
    status.hidden = true;
    fittedWidth = 0;
    returnFocus?.focus({preventScroll:true});
  });
  window.addEventListener('resize', fitImage, {passive:true});
})();
