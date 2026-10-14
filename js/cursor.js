(function (global) {
  'use strict';

  const fine = global.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced = global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduced) return;

  const dot = document.createElement('div');
  dot.className = 'cursor';
  dot.setAttribute('aria-hidden', 'true');
  document.body.append(dot);
  document.documentElement.classList.add('has-cursor');

  let x = -100, y = -100;

  const STATES = [
    ['input, textarea', 'text'],
    ['a, button, [role="button"], label, .pcard, #robot-canvas', 'link'],
  ];
  let current = '';
  const setState = (el) => {
    let state = '';
    for (const [sel, s] of STATES) if (el && el.closest && el.closest(sel)) { state = s; break; }
    if (state === current) return;
    current = state;
    dot.dataset.state = state;
  };

  document.addEventListener('pointermove', (e) => {
    x = e.clientX; y = e.clientY;
    dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    document.documentElement.classList.add('cursor-visible');
    setState(e.target);
  }, { passive: true });

  let scrollRaf = 0;
  global.addEventListener('scroll', () => {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => { scrollRaf = 0; setState(document.elementFromPoint(x, y)); });
  }, { passive: true });

  // con un modal abierto el cursor tiene que ir dentro del dialog, si no se queda debajo
  document.querySelectorAll('dialog').forEach((dlg) => {
    new MutationObserver(() => {
      (dlg.open ? dlg : document.body).append(dot);
    }).observe(dlg, { attributes: true, attributeFilter: ['open'] });
  });

  document.addEventListener('pointerdown', () => dot.classList.add('is-down'));
  document.addEventListener('pointerup', () => dot.classList.remove('is-down'));
  document.documentElement.addEventListener('pointerleave', () => document.documentElement.classList.remove('cursor-visible'));
})(window);
