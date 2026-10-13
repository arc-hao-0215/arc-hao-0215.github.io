/*
 Research Editorial Motion / 2026-10-11
 Progressive enhancement, modelled on Lightly in the Forest's one-time editorial
 reveals. Does not manipulate media content, diagrams, captions, sources or
 the existing Lightbox / interactive Field Atlas controllers.
*/
(() => {
  'use strict';
  const article = document.querySelector('article.research-article');
  if (!article) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const body = article.querySelector('.essay-body');
  const nav = article.querySelector('.essay-layout aside nav[aria-label="Essay contents"]');
  if (!body) return;

  // Desktop reading-position tracking for the nested 00–04 Research sidebar.
  // Order by actual document position (not sidebar order), so page-specific
  // rearrangements cannot cause a highlighted link to jump backwards.
  if (nav) {
    const aside = nav.closest('aside');
    const desktop = window.matchMedia('(min-width: 761px)');
    const tracked = [...nav.querySelectorAll('a[href^="#"]')].map(link => {
      let id;
      try { id = decodeURIComponent(link.getAttribute('href').slice(1)); }
      catch (_) { return null; }
      const target = id ? document.getElementById(id) : null;
      return target ? { link, target } : null;
    }).filter(Boolean).sort((a, b) => {
      if (a.target === b.target) return 0;
      return a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });
    const groups = [...nav.querySelectorAll('.research-toc-group')];
    let frame = 0;
    let current = null;
    let lastAsideInput = 0;
    aside?.addEventListener('wheel', () => { lastAsideInput = Date.now(); }, { passive:true });
    aside?.addEventListener('pointerdown', () => { lastAsideInput = Date.now(); }, { passive:true });

    const keepVisible = link => {
      if (!aside || Date.now() - lastAsideInput < 1200) return;
      if (aside.scrollHeight <= aside.clientHeight + 2) return;
      const item = link.getBoundingClientRect();
      const area = aside.getBoundingClientRect();
      const inset = 24;
      if (item.top < area.top + inset) aside.scrollTop += item.top - area.top - inset;
      else if (item.bottom > area.bottom - inset) aside.scrollTop += item.bottom - area.bottom + inset;
    };

    const refresh = () => {
      frame = 0;
      if (!tracked.length) return;
      const line = Math.min(240, Math.max(115, window.innerHeight * .27));
      let next = null;
      if (desktop.matches) {
        for (const item of tracked) {
          if (item.target.getBoundingClientRect().top <= line) next = item;
          else break;
        }
        // Once the article has entered the reading line, begin at Introduction.
        if (!next && article.getBoundingClientRect().top <= line) next = tracked[0];
      }
      if (next === current) return;
      current = next;
      tracked.forEach(({link}) => {
        const active = !!next && link === next.link;
        link.classList.toggle('rm-current', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      const activeGroup = next?.link.closest('.research-toc-group') || null;
      groups.forEach(group => group.classList.toggle('rm-section-current', group === activeGroup));
      if (next) keepVisible(next.link);
    };

    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(refresh); };
    window.addEventListener('scroll', schedule, { passive:true });
    window.addEventListener('resize', schedule, { passive:true });
    window.addEventListener('hashchange', schedule);
    window.addEventListener('pageshow', schedule);
    window.addEventListener('load', schedule, { once:true });
    desktop.addEventListener?.('change', schedule);
    refresh();
  }

  // Bibliography anchors get one restrained focus cue, not a persistent overlay.
  const flashReference = id => {
    if (!id || !id.startsWith('ref-') || reduced.matches) return;
    const node = document.getElementById(id);
    if (!node || !node.closest('.essay-source')) return;
    node.classList.remove('rm-ref-flash');
    // Allow the same reference to animate again on a second citation click.
    void node.offsetWidth;
    node.classList.add('rm-ref-flash');
  };
  body.querySelectorAll('a[href^="#ref-"]').forEach(link => {
    link.addEventListener('click', () => {
      const id = decodeURIComponent(link.hash.slice(1));
      window.requestAnimationFrame(() => flashReference(id));
    });
  });
  window.addEventListener('hashchange', () => {
    const id = decodeURIComponent(location.hash.slice(1));
    flashReference(id);
  });
  article.addEventListener('animationend', event => {
    if (event.animationName === 'rm-reference-focus') event.target.classList.remove('rm-ref-flash');
  });
  if (location.hash) window.requestAnimationFrame(() => flashReference(decodeURIComponent(location.hash.slice(1))));

  // No reveal classes if the user requests reduced motion or the browser
  // cannot observe intersections; all content stays visible in either case.
  if (reduced.matches || !('IntersectionObserver' in window)) return;

  const items = [];
  const skip = '.essay-source,.research-authorship-block,.research-bibliography,.netherlands-atlas-frame,.rs-viewer,.research-table';
  body.querySelectorAll('h2,h3').forEach(heading => {
    if (heading.closest(skip) || heading.closest('figure')) return;
    heading.classList.add('rm-heading');
    if (heading.tagName === 'H3') heading.classList.add('rm-subheading');
    items.push(heading);
  });
  const figures = [...body.querySelectorAll('figure')].filter(figure => figure.querySelector('img') && figure.querySelector('figcaption') && !figure.closest('.rs-viewer'));
  figures.forEach((figure, i) => {
    figure.classList.add('rm-figure');
    if (i === 0) figure.classList.add('rm-first');
    const siblings = [...figure.parentElement.children].filter(item => item.tagName === 'FIGURE');
    const position = siblings.indexOf(figure);
    const delay = siblings.length > 1 ? Math.min(Math.max(position,0),3) * 95 : 0;
    figure.style.setProperty('--rm-delay', delay + 'ms');
    items.push(figure);
  });
  if (!items.length) return;

  // Already-passed content never flashes invisible, including when restoring a
  // previously scrolled page from browser history.
  const visibleLine = window.innerHeight * .92;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('rm-visible');
      observer.unobserve(entry.target);
    });
  }, {rootMargin:'0px 0px -7% 0px', threshold:0.015});
  for (const node of items) {
    const top = node.getBoundingClientRect().top;
    if (top < visibleLine) node.classList.add('rm-visible');
    else observer.observe(node);
  }
  window.requestAnimationFrame(() => article.classList.add('rm-ready'));
})();
