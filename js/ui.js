(function (global) {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const finePointer = global.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const t = (...args) => global.I18N.t(...args);

  const esc = (str) => String(str).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  let toastTimer;
  function toast(message) {
    const el = $('.toast');
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 2200);
  }

  function initNav() {
    const nav = $('[data-nav]');
    if (!nav) return;
    const toggle = $('.nav__toggle', nav);
    const links = $$('[data-spy]', nav);

    const onScroll = () => nav.classList.toggle('is-scrolled', global.scrollY > 24);
    onScroll();
    global.addEventListener('scroll', onScroll, { passive: true });

    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? t('menuClose') : t('menuOpen'));
    };
    setOpen(false);
    global.addEventListener('langchange', () => setOpen(nav.classList.contains('is-open')));
    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    $$('a', nav).forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

    const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.remove('is-active'));
        const link = byId.get(entry.target.id);
        if (link) link.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main > section[id]').forEach((s) => spy.observe(s));
  }

  function initReveal(root = document) {
    const els = $$('[data-reveal]:not(.is-visible)', root);
    if (!('IntersectionObserver' in global)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach((el) => io.observe(el));
  }

  function initSpotlight() {
    if (!finePointer) return;
    let pending = null;
    const apply = () => {
      const { card, x, y } = pending;
      pending = null;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${x - r.left}px`);
      card.style.setProperty('--my', `${y - r.top}px`);
    };
    document.addEventListener('pointermove', (e) => {
      const card = e.target.closest && e.target.closest('.card');
      if (!card) return;
      if (!pending) requestAnimationFrame(apply);
      pending = { card, x: e.clientX, y: e.clientY };
    }, { passive: true });
  }

  const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>';

  const TONES = { web: '#5ce1ff', '3d': '#8b7bff', mobile: '#ffad7a', design: '#ff7ab8', video: '#4ade80' };

  function projectCard(p, i, categories) {
    const main = p.categories[0];
    const meta = [p.context, p.year].filter(Boolean).join(' · ');
    return `
      <article class="pcard${p.featured ? ' pcard--wide' : ''}" style="--tone:${TONES[main] || TONES.web}"
               data-id="${esc(p.id)}" data-categories="${esc(p.categories.join(' '))}">
        <div class="pcard__media${p.imageFit === 'contain' ? ' pcard__media--contain' : ''}">
          <img src="${esc(p.image)}" alt="${esc(p.alt)}" width="1200" height="750" loading="lazy" decoding="async">
        </div>
        <div class="pcard__shade" aria-hidden="true"></div>
        <div class="pcard__top">
          <span class="pcard__tag"><i aria-hidden="true"></i>${esc(categories[main] || '')}</span>
          ${videosOf(p).length && main !== 'video' ?`<span class="pcard__tag pcard__tag--video">${PLAY}${esc(t('video'))}</span>` : ''}
          <span class="pcard__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        </div>
        <div class="pcard__body">
          <p class="pcard__meta">${esc(meta)}</p>
          <h3 class="pcard__title">
            <button type="button" class="project__open" aria-haspopup="dialog">${esc(p.title)}</button>
          </h3>
          <div class="pcard__more"><div>
            <p class="pcard__summary">${esc(p.summary)}</p>
            <ul class="chips chips--sm" aria-label="${esc(t('tech'))}">
              ${p.stack.slice(0, 4).map((s) => `<li class="chip">${esc(s)}</li>`).join('')}
            </ul>
          </div></div>
          <span class="pcard__cta" aria-hidden="true">${esc(t('seeProject'))} ${ARROW}</span>
        </div>
      </article>`;
  }

  const videosOf = (p) => (p.videos || (p.video ? [p.video] : [])).filter((v) => v && v.youtube);

  function videoFacade(v, img, alt, label) {
    return `
      <button type="button" class="video-facade" data-youtube="${esc(v.youtube)}" aria-label="${esc(label)}">
        <img src="${esc(img)}" alt="${esc(alt)}">
        <span class="video-facade__play">${PLAY}</span>
      </button>`;
  }

  function modalMedia(p) {
    const src = p.detailImage || p.image;
    const fit = p.imageFit === 'contain' ? ' modal__media--contain' : '';
    const [first] = videosOf(p);
    if (first) {
      return `<div class="modal__media">${videoFacade(first, src, p.alt, t('playVideoOf', p.title))}</div>`;
    }
    return `<figure class="modal__media${fit}"><img src="${esc(src)}" alt="${esc(p.alt)}"></figure>`;
  }

  function moreVideos(p) {
    const rest = videosOf(p).slice(1);
    if (!rest.length) return '';
    return `
      <div class="modal__videos">
        <h3>${esc(t('moreVideos'))}</h3>
        <div class="modal__videos-grid">${rest.map((v) => `
          <figure>
            <div class="modal__video">${videoFacade(v, `https://i.ytimg.com/vi/${encodeURIComponent(v.youtube)}/hqdefault.jpg`, v.title || t('video'), t('play', v.title || t('video').toLowerCase()))}</div>
            ${v.title ? `<figcaption>${esc(v.title)}</figcaption>` : ''}
          </figure>`).join('')}
        </div>
      </div>`;
  }

  function pressList(press) {
    return `
      <div class="modal__press">
        <h3>${esc(t('inMedia'))}</h3>
        <ul>${press.map((a) => `
          <li><a href="${esc(a.url)}" target="_blank" rel="noopener"><strong>${esc(a.outlet)}</strong><span>${esc(a.title)}</span></a></li>`).join('')}
        </ul>
      </div>`;
  }

  function modalContent(p, categories, press) {
    const cats = p.categories.map((c) => categories[c]).filter(Boolean).join(' · ');
    const highlights = p.highlights.length
      ? `<div><h3>${esc(t('highlights'))}</h3><ul class="modal__highlights">${p.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul></div>`
      : '';
    const links = p.links.map((l) => {
      const external = /^https?:/.test(l.url);
      return `<a class="btn btn--primary" href="${esc(l.url)}"${external ? ' target="_blank" rel="noopener"' : ' data-close'}>${esc(l.label)} ${ARROW}</a>`;
    }).join('');

    const gallery = (p.gallery || []).length
      ? `<div class="modal__gallery-wrap"><h3>${esc(t('photos'))}</h3><div class="modal__gallery">${p.gallery.map((g, i) => `
          <button type="button" class="modal__shot" data-shot="${i}" aria-label="${esc(t('zoom', g.alt))}">
            <img src="${esc(g.src)}" alt="${esc(g.alt)}" decoding="async">
          </button>`).join('')}</div></div>`
      : '';

    return `
      ${modalMedia(p)}
      <div class="modal__body">
        <p class="modal__meta">${esc([p.context, p.year].filter(Boolean).join(' · '))}</p>
        <h2 class="modal__title" id="modal-title">${esc(p.title)}</h2>
        <div class="modal__text">${p.description.map((d) => `<p>${esc(d)}</p>`).join('')}</div>
        <div class="modal__grid">
          ${highlights}
          <div>
            <h3>Stack</h3>
            <ul class="chips">${p.stack.map((s) => `<li class="chip">${esc(s)}</li>`).join('')}</ul>
            ${cats ? `<h3 style="margin-top:22px">${esc(t('category'))}</h3><p style="color:var(--text-2)">${esc(cats)}</p>` : ''}
          </div>
        </div>
        ${moreVideos(p)}
        ${gallery}
        ${p.press && press ? pressList(press) : ''}
        ${links ? `<div class="modal__actions">${links}</div>` : ''}
      </div>`;
  }

  // la primera llamada monta los eventos; las siguientes (al cambiar de idioma) solo repintan
  let projects = null;

  function renderProjects(data) {
    if (projects) { projects.paint(data); return; }
    const grid = $('#projects-grid');
    const modal = $('#project-modal');
    const modalBody = $('#modal-content');
    if (!grid || !data) return;

    const reduced = global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const bar = $('[data-filters]');
    let lastTrigger = null;
    let current = null;
    let filter = 'all';

    const cards = () => $$('.pcard', grid);
    const count = (cat) => (cat === 'all' ? data.projects.length : data.projects.filter((p) => p.categories.includes(cat)).length);

    const movePill = () => {
      const pill = $('.filters__pill', bar);
      const active = $('[aria-pressed="true"]', bar);
      if (!active || !pill) return;
      pill.style.width = `${active.offsetWidth}px`;
      pill.style.height = `${active.offsetHeight}px`;
      pill.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
    };

    const viewer = document.createElement('div');
    viewer.className = 'viewer';
    viewer.hidden = true;
    viewer.setAttribute('role', 'dialog');
    viewer.innerHTML = `
      <button type="button" class="viewer__btn viewer__close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      <button type="button" class="viewer__btn viewer__prev"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
      <figure class="viewer__figure"><img alt=""><figcaption></figcaption></figure>
      <button type="button" class="viewer__btn viewer__next"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>`;
    modal.appendChild(viewer);
    const viewerImg = $('img', viewer);
    const viewerCap = $('figcaption', viewer);
    let shots = [], shotIndex = 0, shotTrigger = null;

    const showShot = (i) => {
      shotIndex = (i + shots.length) % shots.length;
      const g = shots[shotIndex];
      viewerImg.src = g.src;
      viewerImg.alt = g.alt;
      viewerCap.textContent = `${g.alt} · ${shotIndex + 1}/${shots.length}`;
      viewer.classList.toggle('viewer--single', shots.length < 2);
    };

    const paint = (next) => {
      data = next;
      grid.innerHTML = data.projects.map((p, i) => projectCard(p, i, data.categories)).join('');
      cards().forEach((c) => { c.hidden = !(filter === 'all' || c.dataset.categories.split(' ').includes(filter)); });

      bar.innerHTML = '<span class="filters__pill" aria-hidden="true"></span>' +
        [['all', t('all')], ...Object.entries(data.categories)].map(([key, label]) => `
          <button class="filter" type="button" data-filter="${esc(key)}" aria-pressed="${key === filter}" style="--tone:${TONES[key] || '#eef1f7'}">
            ${esc(label)}<span class="filter__count">${count(key)}</span>
          </button>`).join('');
      movePill();

      viewer.setAttribute('aria-label', t('viewer'));
      $('.viewer__close', viewer).setAttribute('aria-label', t('viewerClose'));
      $('.viewer__prev', viewer).setAttribute('aria-label', t('viewerPrev'));
      $('.viewer__next', viewer).setAttribute('aria-label', t('viewerNext'));

      // si hay un proyecto abierto, se traduce también
      if (current && modal.open) {
        current = data.projects.find((p) => p.id === current.id) || current;
        modalBody.innerHTML = modalContent(current, data.categories, data.press);
        if (!viewer.hidden) { shots = current.gallery || shots; showShot(shotIndex); }
      }
    };

    paint(data);
    new ResizeObserver(movePill).observe(bar);

    const applyFilter = () => {
      const all = cards();
      const before = new Map(all.filter((c) => !c.hidden).map((c) => [c, c.getBoundingClientRect()]));
      all.forEach((c) => { c.hidden = !(filter === 'all' || c.dataset.categories.split(' ').includes(filter)); });
      if (reduced) return;
      let entering = 0;
      all.forEach((c) => {
        if (c.hidden) return;
        const a = before.get(c);
        const b = c.getBoundingClientRect();
        if (a) {
          const dx = a.left - b.left, dy = a.top - b.top;
          if (dx || dy) c.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 600, easing: 'cubic-bezier(.16,1,.3,1)' });
        } else {
          c.animate([{ opacity: 0, transform: 'translateY(24px) scale(.96)' }, { opacity: 1, transform: 'none' }],
            { duration: 500, delay: 40 * entering++, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
        }
      });
    };

    bar.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-filter]');
      if (!btn || btn.getAttribute('aria-pressed') === 'true') return;
      $$('[data-filter]', bar).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      filter = btn.dataset.filter;
      movePill();
      applyFilter();
    });

    if (finePointer && !reduced) {
      let target = null, pos = null;
      const tilt = () => {
        const r = target.getBoundingClientRect();
        const x = (pos.x - r.left) / r.width - 0.5, y = (pos.y - r.top) / r.height - 0.5;
        target.style.setProperty('--ry', `${(x * 6).toFixed(2)}deg`);
        target.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`);
        pos = null;
      };
      grid.addEventListener('pointermove', (e) => {
        const card = e.target.closest('.pcard');
        if (!card) return;
        target = card;
        if (!pos) requestAnimationFrame(tilt);
        pos = { x: e.clientX, y: e.clientY };
      });
      grid.addEventListener('pointerout', (e) => {
        const card = e.target.closest('.pcard');
        if (card && !card.contains(e.relatedTarget)) { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); }
      });
    }

    const openViewer = (list, i, trigger) => {
      shots = list; shotTrigger = trigger;
      showShot(i);
      viewer.hidden = false;
      $('.viewer__close', viewer).focus();
    };
    const closeViewer = () => {
      if (viewer.hidden) return;
      viewer.hidden = true;
      if (shotTrigger) shotTrigger.focus({ preventScroll: true });
    };
    viewer.addEventListener('click', (e) => {
      e.stopPropagation();
      if (e.target.closest('.viewer__prev')) showShot(shotIndex - 1);
      else if (e.target.closest('.viewer__next')) showShot(shotIndex + 1);
      else if (e.target.closest('.viewer__close') || e.target === viewer) closeViewer();
    });
    modal.addEventListener('keydown', (e) => {
      if (viewer.hidden) return;
      if (e.key === 'ArrowLeft') showShot(shotIndex - 1);
      if (e.key === 'ArrowRight') showShot(shotIndex + 1);
    });
    modal.addEventListener('cancel', (e) => {
      if (!viewer.hidden) { e.preventDefault(); closeViewer(); }
    });

    const openProject = (id, trigger) => {
      const project = data.projects.find((p) => p.id === id);
      if (!project) return;
      current = project;
      lastTrigger = trigger || null;
      viewer.hidden = true;
      modalBody.innerHTML = modalContent(project, data.categories, data.press);
      if (!modal.open) modal.showModal();
      modal.querySelector('.modal__panel').scrollTop = 0;
    };
    global.PortfolioUI.openProject = openProject;

    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.pcard');
      if (card) openProject(card.dataset.id, $('.project__open', card));
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('[data-close]')) { modal.close(); return; }
      const shot = e.target.closest('[data-shot]');
      if (shot && current) { openViewer(current.gallery, +shot.dataset.shot, shot); return; }
      // YouTube solo se carga al darle al play; si no, la web tarda mucho más en abrir
      const facade = e.target.closest('[data-youtube]');
      if (facade) {
        const id = encodeURIComponent(facade.dataset.youtube);
        facade.parentElement.innerHTML =
          `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="${esc(t('projectVideo'))}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen"></iframe>`;
      }
    });
    modal.addEventListener('close', () => {
      if (!modal.open) modalBody.innerHTML = '';
      viewer.hidden = true;
      current = null;
      if (lastTrigger) lastTrigger.focus({ preventScroll: true });
    });

    projects = { paint };
  }

  let logosData = null;

  function renderLogos(data) {
    const grid = $('#logos-grid');
    if (!grid || !data || !data.logos) return;
    const first = !logosData;
    logosData = data;
    grid.innerHTML = data.logos.map((l, i) => `
      <article class="card logo${first ? '' : ' is-visible'}" data-reveal style="--i:${i}" data-logo="${esc(l.id)}">
        <div class="logo__stage" data-bg="${esc(l.variants[0].bg)}">
          <span class="term-dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="logo__file" aria-hidden="true">${esc(l.id.replace(/^logo-/, ''))}.svg</span>
          <img src="${esc(l.variants[0].src)}" alt="${esc(l.variants[0].alt)}" loading="lazy" decoding="async">
        </div>
        <div class="logo__body">
          ${l.variants.length > 1 ? `<div class="logo__tabs" role="group" aria-label="${esc(t('logoVersions'))}">${l.variants.map((v, j) => `
            <button type="button" class="logo__tab" data-v="${j}" aria-pressed="${j === 0}">${esc(v.label)}</button>`).join('')}
          </div>` : ''}
          <p class="logo__meta">${esc(l.context)}</p>
          <h3 class="logo__title">${esc(l.title)}</h3>
          <p class="logo__text">${esc(l.description)}</p>
          <ul class="chips chips--sm" aria-label="${esc(t('tools'))}">${l.tools.map((tool) => `<li class="chip">${esc(tool)}</li>`).join('')}</ul>
        </div>
      </article>`).join('');

    if (!first) return;
    grid.addEventListener('click', (e) => {
      const tab = e.target.closest('[data-v]');
      if (!tab) return;
      const card = tab.closest('[data-logo]');
      const logo = logosData.logos.find((l) => l.id === card.dataset.logo);
      const v = logo.variants[+tab.dataset.v];
      const stage = $('.logo__stage', card);
      const img = $('img', stage);
      $$('[data-v]', card).forEach((b) => b.setAttribute('aria-pressed', String(b === tab)));
      stage.dataset.bg = v.bg;
      img.src = v.src;
      img.alt = v.alt;
    });
  }

  function renderPress(data) {
    const grid = $('#press-grid');
    if (!grid || !data || !data.press) return;
    const shown = grid.childElementCount ? ' is-visible' : '';
    const campaign = data.projects.find((p) => p.press);
    const feature = campaign ? `
      <div class="press__feature${shown}" data-reveal>
        <figure><img src="${esc(campaign.image)}" alt="${esc(campaign.alt)}" width="1200" height="750" loading="lazy" decoding="async"></figure>
        ${(campaign.gallery || []).slice(0, 1).map((g) => `
          <figure><img src="${esc(g.src)}" alt="${esc(g.alt)}" width="1200" height="750" loading="lazy" decoding="async"></figure>`).join('')}
      </div>` : '';

    grid.innerHTML = feature + data.press.map((a, i) => `
      <a class="card press__item${shown}" href="${esc(a.url)}" target="_blank" rel="noopener" data-reveal style="--i:${i % 3}">
        <span class="press__meta"><span class="press__outlet">${esc(a.outlet)}</span><span class="press__date">${esc(a.date)}</span></span>
        <span class="press__title">${esc(a.title)}</span>
        <span class="press__more">${esc(t('readArticle'))}</span>
      </a>`).join('');
  }

  function renderStack(data) {
    const grid = $('#stack-grid');
    if (!grid || !data) return;
    const shown = grid.childElementCount ? ' is-visible' : '';
    grid.innerHTML = data.stack.map((g, i) => `
      <article class="card stack__group${shown}" data-reveal style="--i:${i};--dot:${esc(g.color)}">
        <header class="stack__head">
          <h3>${esc(g.group)}</h3>
          <span class="stack__count">${String(g.items.length).padStart(2, '0')}</span>
        </header>
        <ul class="chips">${g.items.map((it) => `<li class="chip">${esc(it)}</li>`).join('')}</ul>
      </article>`).join('');

    const total = data.stack.reduce((n, g) => n + g.items.length, 0);
    $$('[data-tech-count]').forEach((el) => { el.textContent = total; });
  }

  function initCopyEmail() {
    $$('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const value = btn.dataset.copy;
        const status = $('#copy-status');
        try {
          await navigator.clipboard.writeText(value);
          toast(t('copied'));
          if (status) status.textContent = t('copiedShort');
        } catch {
          global.location.href = `mailto:${value}`;
        }
      });
    });
  }

  function applyProfile(data) {
    const gh = $('[data-github]');
    if (gh && data && data.profile.github) {
      $('a', gh).href = data.profile.github;
      gh.hidden = false;
    }
    $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
  }

  global.PortfolioUI = {
    initNav, initReveal, initSpotlight,
    renderProjects, renderLogos, renderPress, renderStack, initCopyEmail, applyProfile, toast,
  };
})(window);
