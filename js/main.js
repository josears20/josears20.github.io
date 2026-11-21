(function () {
  'use strict';

  const UI = window.PortfolioUI;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const render = () => {
    const data = window.I18N.data();
    UI.renderProjects(data);
    UI.renderLogos(data);
    UI.renderPress(data);
    UI.renderStack(data);
  };
  render();
  window.addEventListener('langchange', render);
  UI.applyProfile(window.PORTFOLIO_DATA);

  UI.initNav();
  UI.initReveal();
  UI.initSpotlight();
  UI.initCopyEmail();

  // Ciudad de las Artes y las Ciencias en 3D
  (function initValencia() {
    const stage = document.getElementById('vlc-stage');
    const canvas = document.getElementById('vlc-canvas');
    if (!stage || !canvas) return;
    if (!window.THREE || !window.ValenciaScene) { stage.classList.add('is-fallback'); return; }
    try {
      const scene = new window.ValenciaScene(canvas, stage, { reducedMotion, labels: document.getElementById('vlc-labels') });
      scene.start();
      canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); stage.classList.add('is-fallback'); });
    } catch (err) {
      stage.classList.add('is-fallback');
      console.warn('[valencia] sin 3D:', err);
    }
  })();

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
      onEngage: () => stage.classList.add('is-engaged'),
    });
    robot.start();
  } catch (err) {
    fallback(err);
    return;
  }

  document.querySelectorAll('[data-robot-mood]').forEach((el) => {
    const mood = el.dataset.robotMood;
    el.addEventListener('pointerenter', () => robot.setMood(mood));
    el.addEventListener('pointerleave', () => robot.setMood('neutral'));
    el.addEventListener('focus', () => robot.setMood(mood));
    el.addEventListener('blur', () => robot.setMood('neutral'));
  });

  // si la gráfica falla, se enseña la imagen fija en lugar del robot
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    robot.stop();
    fallback('contexto WebGL perdido');
  });
})();
