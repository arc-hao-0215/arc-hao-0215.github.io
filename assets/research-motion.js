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

  // Reading-position indicator: only touch existing links to real page anchors.
  if (nav) {
    const tracked = [...nav.querySelectorAll('a[href^="#"]')].map(link => {
      const id = decodeURIComponent(link.getAttribute('href').slice(1));
      const target = id ? document.getElementById(id) : null;
      return target ? {link, target} : null;
    }).filter(Boolean);
    let frame = 0;
    let current = -1;
    const refresh = () => {
      frame = 0;
      if (!tracked.length) return;
      const readingLine = Math.min(window.innerHeight * .36, 260);
      let next = -1;
      tracked.forEach(({target}, i) => {
        if (target.getBoundingClientRect().top <= readingLine) next = i;
      });
      if (next < 0 && nav.getBoundingClientRect().bottom < readingLine) next = 0;
      if (next === current) return;
      current = next;
      tracked.forEach(({link}, i) => {
        const active = i === current;
        link.classList.toggle('rm-current', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(refresh);
    };
    window.addEventListener('scroll', schedule, {passive:true});
    window.addEventListener('resize', schedule, {passive:true});
    window.addEventListener('hashchange', schedule);
    window.addEventListener('pageshow', schedule);
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
