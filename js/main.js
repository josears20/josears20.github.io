/* ==========================================================================
   main.js — Punto de entrada
   --------------------------------------------------------------------------
   Orden de carga (todos con `defer`, se ejecutan en este orden):
     three.min.js → data.js → robot.js → ui.js → main.js

   1. Pinta el contenido dinámico (proyectos, stack) desde PORTFOLIO_DATA.
   2. Activa los módulos de interfaz (nav, reveal, spotlight…).
   3. Arranca el robot 3D si hay WebGL; si no, deja el fallback estático.
   ========================================================================== */

(function () {
  'use strict';

  const data = window.PORTFOLIO_DATA;
  const UI = window.PortfolioUI;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1 · Contenido dinámico (antes del reveal, para que también se anime) */
  UI.renderProjects(data);
  UI.renderLogos(data);
  UI.renderPress(data);
  UI.renderStack(data);
  UI.applyProfile(data);

  /* 2 · Interfaz */
  UI.initNav();
  UI.initReveal();
  UI.initSpotlight();
  UI.initCopyEmail();

  /* 3 · Robot 3D */
  const canvas = document.getElementById('robot-canvas');
  const stage = canvas && canvas.parentElement;
  if (!canvas) return;

  const fallback = (reason) => {
    stage.classList.add('is-fallback');
    if (reason) console.warn('[robot] usando fallback estático:', reason);
  };

  if (!window.THREE || !window.RobotScene) {
    fallback('Three.js no se ha podido cargar');
    return;
  }

  let robot;
  try {
    robot = new window.RobotScene(canvas, {
      reducedMotion,
      // La pista "mueve el cursor" desaparece en cuanto el usuario interactúa
      onEngage: () => stage.classList.add('is-engaged'),
    });
    robot.start();
  } catch (err) {
    fallback(err);
    return;
  }

  // El robot se pone "contento" al pasar por las llamadas a la acción
  document.querySelectorAll('[data-robot-mood]').forEach((el) => {
    const mood = el.dataset.robotMood;
    el.addEventListener('pointerenter', () => robot.setMood(mood));
    el.addEventListener('pointerleave', () => robot.setMood('neutral'));
    el.addEventListener('focus', () => robot.setMood(mood));
    el.addEventListener('blur', () => robot.setMood('neutral'));
  });

  // Si se pierde el contexto WebGL (GPU reseteada, etc.), mostramos el fallback
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    robot.stop();
    fallback('contexto WebGL perdido');
  });
})();
