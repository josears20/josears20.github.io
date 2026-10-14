/* ==========================================================================
   cursor.js — Cursor personalizado
   --------------------------------------------------------------------------
   Un único círculo que va pegado al ratón (sin retardo ni elementos que se
   separan). Sobre enlaces y botones crece un poco; sobre campos de texto se
   oculta y se usa el cursor de texto normal.
   Solo se activa con ratón (pointer: fine). En táctil o con reduced motion
   se mantiene el cursor del sistema.
   ========================================================================== */

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

  // Qué estado toca según el elemento bajo el puntero
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

  // Al hacer scroll sin mover el ratón, el elemento bajo el cursor cambia
  let scrollRaf = 0;
  global.addEventListener('scroll', () => {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => { scrollRaf = 0; setState(document.elementFromPoint(x, y)); });
  }, { passive: true });

  // Un <dialog> abierto vive en la "top layer", por encima de todo: mientras el
  // modal está abierto, el cursor se muda dentro de él para seguir visible
  document.querySelectorAll('dialog').forEach((dlg) => {
    new MutationObserver(() => {
      (dlg.open ? dlg : document.body).append(dot);
    }).observe(dlg, { attributes: true, attributeFilter: ['open'] });
  });

  document.addEventListener('pointerdown', () => dot.classList.add('is-down'));
  document.addEventListener('pointerup', () => dot.classList.remove('is-down'));
  document.documentElement.addEventListener('pointerleave', () => document.documentElement.classList.remove('cursor-visible'));
})(window);
