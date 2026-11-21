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
    const section = document.getElementById('valencia');
    const canvas = document.getElementById('vlc-canvas');
    if (!section || !canvas) return;
    const STOPS = [
      { name: 'Palau de les Arts Reina Sofía', es: 'Ópera · 2005 · el casco y la pluma, a unos 75 m de altura', en: 'Opera house · 2005 · the helmet and the feather, about 75 m high' },
      { name: "L'Hemisfèric", es: 'Cine IMAX y planetario · 1998 · un ojo que se abre sobre el agua', en: 'IMAX cinema and planetarium · 1998 · an eye opening over the water' },
      { name: 'Museu de les Ciències', es: 'Museo de la ciencia · 2000 · un esqueleto de unos 220 m de largo', en: 'Science museum · 2000 · a skeleton about 220 m long' },
      { name: "L'Umbracle", es: 'Jardín y mirador · 2001 · 320 m de arcos sobre un paseo', en: 'Garden and lookout · 2001 · 320 m of arches over a walkway' },
      { name: "Pont de l'Assut de l'Or", es: 'Puente atirantado · 2008 · pilono de 125 m, el punto más alto de Valencia', en: 'Cable-stayed bridge · 2008 · 125 m pylon, the highest point in Valencia' },
      { name: "L'Àgora", es: 'Espacio multifuncional · 2009 · hoy CaixaForum València', en: 'Multipurpose venue · 2009 · now CaixaForum València' },
      { name: "L'Oceanogràfic", es: 'El mayor acuario de Europa · cubiertas de Félix Candela', en: "Europe's largest aquarium · roofs by Félix Candela" },
    ];
    const INTRO = { name: 'Ciutat de les Arts i les Ciències', es: 'Santiago Calatrava y Félix Candela · 1998–2009', en: 'Santiago Calatrava and Félix Candela · 1998–2009' };
    const num = document.getElementById('vlc-num');
    const nameEl = document.getElementById('vlc-name');
    const fact = document.getElementById('vlc-fact');
    const caption = nameEl.parentElement;
    const dots = Array.from(document.querySelectorAll('#vlc-rail li'));
    let current = -1, swapT = 0;
    const paint = () => {
      const s = current >= 0 ? STOPS[current] : INTRO;
      const lang = (window.I18N && window.I18N.lang) || 'es';
      num.textContent = current >= 0 ? String(current + 1).padStart(2, '0') : '00';
      nameEl.textContent = s.name;
      fact.textContent = s[lang] || s.es;
      dots.forEach((d, i) => d.classList.toggle('is-on', i === current));
    };
    const onFocus = (i) => {
      current = i;
      if (reducedMotion) { paint(); return; }
      caption.classList.add('is-swapping');
      clearTimeout(swapT);
      swapT = setTimeout(() => { paint(); caption.classList.remove('is-swapping'); }, 220);
    };
    paint();
    window.addEventListener('langchange', paint);
    window.addEventListener('scroll', () => {
      const top = section.getBoundingClientRect().top;
      section.classList.toggle('is-scrolled', top < -80);
      const span = section.offsetHeight - window.innerHeight;
      const p = span > 0 ? -top / span : 0;
      section.classList.toggle('is-touring', p > 0.07 && p < 0.95);
    }, { passive: true });
    if (!window.THREE || !window.ValenciaScene) { section.classList.add('is-fallback'); return; }
    try {
      const scene = new window.ValenciaScene(canvas, section, { reducedMotion, onFocus });
      scene.start();
      canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); scene.running = false; section.classList.add('is-fallback'); });
    } catch (err) {
      section.classList.add('is-fallback');
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
