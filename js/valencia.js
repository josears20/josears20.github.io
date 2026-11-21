// Ciudad de las Artes y las Ciencias en líneas: todo generado por código, sin modelos 3D externos.
// La cámara recorre el complejo de oeste a este según el scroll de la sección.
(function (global) {
  'use strict';

  const THREE = global.THREE;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => t * t * (3 - 2 * t);
  const damp = (a, b, k, dt) => a + (b - a) * (1 - Math.exp(-k * dt));
  const TAU = Math.PI * 2;

  // ---------- utilidades para generar segmentos ----------
  function Builder() { this.v = []; }
  Builder.prototype.seg = function (a, b) { this.v.push(a[0], a[1], a[2], b[0], b[1], b[2]); };
  Builder.prototype.line = function (pts, closed) {
    for (let i = 0; i < pts.length - 1; i++) this.seg(pts[i], pts[i + 1]);
    if (closed && pts.length > 2) this.seg(pts[pts.length - 1], pts[0]);
  };
  Builder.prototype.grid = function (rows, closedRows) {
    // rows: array de polilíneas con el mismo número de puntos -> líneas en ambos sentidos
    rows.forEach((r) => this.line(r, closedRows));
    for (let j = 0; j < rows[0].length; j++) this.line(rows.map((r) => r[j]));
  };

  // ---------- edificios ----------
  // L'Hemisfèric: el ojo. Párpado de costillas, cúpula-pupila y el párpado móvil aparte.
  function hemisferic() {
    const b = new Builder();
    const L = 11, W = 5.2, H = 4.6;
    const N = 25, M = 14;
    const rows = [];
    for (let i = 0; i <= N; i++) {
      const x = -L + (2 * L * i) / N;
      const k = Math.sqrt(Math.max(0, 1 - (x / L) ** 2));
      const row = [];
      for (let j = 0; j <= M; j++) {
        const a = (Math.PI * j) / M;
        row.push([x, H * k * Math.sin(a), -W * k * Math.cos(a)]);
      }
      rows.push(row);
    }
    rows.forEach((r) => b.line(r));
    for (let j = 0; j <= M; j += 2) b.line(rows.map((r) => r[j]));
    // pupila
    const R = 3.1;
    for (let lat = 1; lat <= 5; lat++) {
      const phi = (lat / 6) * (Math.PI / 2);
      const ring = [];
      for (let s = 0; s < 40; s++) {
        const t = (s / 40) * TAU;
        ring.push([R * Math.cos(phi) * Math.cos(t), R * Math.sin(phi), R * Math.cos(phi) * Math.sin(t)]);
      }
      b.line(ring, true);
    }
    for (let m = 0; m < 16; m++) {
      const t = (m / 16) * TAU;
      const mer = [];
      for (let s = 0; s <= 10; s++) {
        const phi = (s / 10) * (Math.PI / 2);
        mer.push([R * Math.cos(phi) * Math.cos(t), R * Math.sin(phi), R * Math.cos(phi) * Math.sin(t)]);
      }
      b.line(mer);
    }
    return b.v;
  }
  function hemisfericLid() {
    const b = new Builder();
    const L = 9, h = 4.2, N = 22;
    const edge = [];
    for (let i = 0; i <= N; i++) {
      const x = -L + (2 * L * i) / N;
      const k = Math.sqrt(Math.max(0, 1 - (x / L) ** 2));
      const p = [x, 0, h * k];
      edge.push(p);
      b.seg([x, 0, 0], p);
    }
    b.line(edge);
    b.seg([-L, 0, 0], [L, 0, 0]);
    return b.v;
  }

  // Museu de les Ciències: esqueleto de costillas repetidas y columnas en árbol.
  function museu() {
    const b = new Builder();
    const prof = [[-5, 0], [-5, 7], [-4.2, 8.6], [-2.6, 9.4], [-0.8, 9.7], [1.2, 9.3], [2.8, 8.3], [3.9, 6.6], [4.6, 4], [5, 0]];
    const N = 20, half = 20;
    const rows = [];
    for (let i = 0; i <= N; i++) {
      const x = -half + (2 * half * i) / N;
      rows.push(prof.map(([z, y]) => [x, y, -z]));
    }
    rows.forEach((r) => b.line(r));
    for (let j = 1; j < prof.length - 1; j++) b.line(rows.map((r) => r[j]));
    // peine trasero
    for (let i = 0; i <= N; i++) {
      const x = -half + (2 * half * i) / N;
      b.seg([x, 6.6, -3.9], [x, 9, -5.8]);
      b.seg([x, 9, -5.8], [x, 8.3, -2.8]);
    }
    // columnas en árbol de la fachada sur (hacia L'Umbracle)
    for (let i = 0; i < N; i++) {
      const x = -half + (2 * half * (i + 0.5)) / N;
      const base = [x, 0, 6.2], knee = [x, 3.2, 6];
      b.seg(base, knee);
      b.seg(knee, [x - 1, 7, 5]);
      b.seg(knee, [x + 1, 7, 5]);
    }
    // cierre triangular del extremo este
    b.seg([half, 9.7, 0.8], [half + 3, 0, 0]);
    b.seg([half + 3, 0, 0], [half, 0, -5]);
    b.seg([half + 3, 0, 0], [half, 0, 5]);
    return b.v;
  }

  // L'Umbracle: paseo de arcos paralelo al museo.
  function umbracle() {
    const b = new Builder();
    const half = 21, N = 34, w = 2.8, h = 6.4;
    const rows = [];
    for (let i = 0; i <= N; i++) {
      const x = -half + (2 * half * i) / N;
      const arch = [];
      for (let s = 0; s <= 12; s++) {
        const z = -w + (2 * w * s) / 12;
        arch.push([x, h * (1 - (z / w) ** 4), z]);
      }
      rows.push(arch);
    }
    rows.forEach((r) => b.line(r));
    [0, 3, 6, 9, 12].forEach((j) => b.line(rows.map((r) => r[j])));
    // pasarela
    b.seg([-half - 2, 0.6, 0], [half + 2, 0.6, 0]);
    return b.v;
  }

  // Palau de les Arts: casco de dos conchas, cuerpo ovoide y la pluma voladiza.
  function palau() {
    const b = new Builder();
    // cuerpo
    const rows = [];
    for (let i = 0; i <= 14; i++) {
      const u = i / 14, x = -11 + 22 * u;
      const k = Math.pow(Math.sin(Math.PI * u), 0.7);
      const row = [];
      for (let j = 0; j <= 16; j++) {
        const a = (Math.PI * j) / 16;
        row.push([x, 8.5 * k * Math.sin(a), -5.5 * k * Math.cos(a)]);
      }
      rows.push(row);
    }
    rows.forEach((r) => b.line(r));
    for (let j = 0; j <= 16; j += 2) b.line(rows.map((r) => r[j]));
    // conchas laterales
    [-1, 1].forEach((s) => {
      const shell = [];
      for (let vi = 0; vi <= 7; vi++) {
        const v = vi / 7, row = [];
        for (let ui = 0; ui <= 18; ui++) {
          const u = ui / 18;
          const sin = Math.sin(Math.PI * u);
          const x = -13 + 25 * u;
          row.push([x, 12 * v * Math.pow(sin, 0.6), s * (7.6 * Math.pow(sin, 0.55) * (1 - 0.55 * v * v))]);
        }
        shell.push(row);
      }
      b.grid(shell);
    });
    // pluma
    const L = [], R = [], C = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24, x = -12 + 29 * t;
      const y = 10.5 + 9 * t - 4.5 * t * t;
      const w = 1.4 - 1.0 * t;
      L.push([x, y, -w]); R.push([x, y, w]); C.push([x, y + 0.35, 0]);
      b.seg([x, y, -w], [x, y + 0.35, 0]);
      b.seg([x, y + 0.35, 0], [x, y, w]);
    }
    b.line(L); b.line(R); b.line(C);
    return b.v;
  }

  // Pont de l'Assut de l'Or: pilono curvo de 125 m y abanico de tirantes.
  function pont() {
    const b = new Builder();
    const len = 17;
    [-1.1, 1.1].forEach((x) => b.seg([x, 1.4, -len], [x, 1.4, len]));
    for (let z = -len; z <= len; z += 2) b.seg([-1.1, 1.4, z], [1.1, 1.4, z]);
    const py = (t) => [0, 22 * t, -11 - 6 * Math.pow(t, 1.6)];
    const legs = [[], []];
    for (let i = 0; i <= 16; i++) {
      const t = i / 16, p = py(t), w = 0.7 * (1 - t) + 0.12;
      legs[0].push([-w, p[1], p[2]]); legs[1].push([w, p[1], p[2]]);
      if (i % 2 === 0) b.seg([-w, p[1], p[2]], [w, p[1], p[2]]);
    }
    b.line(legs[0]); b.line(legs[1]);
    for (let i = 0; i < 15; i++) {
      const t = 0.38 + (0.62 * i) / 14, p = py(t);
      b.seg(p, [0, 1.4, -8 + (22 * i) / 14]);
    }
    for (let i = 0; i < 4; i++) {
      const p = py(0.7 + i * 0.1);
      b.seg(p, [0, 0, -len - 3 - i]);
    }
    return b.v;
  }

  // L'Àgora: ojiva elíptica con las lamas móviles en la cumbrera.
  function agora() {
    const b = new Builder();
    const rows = [];
    for (let i = 0; i <= 10; i++) {
      const z = -4.5 + 0.9 * i;
      const k = Math.sqrt(1 - (z / 5.2) ** 2);
      const row = [];
      for (let s = 0; s <= 16; s++) {
        const t = s / 16, side = t < 0.5 ? -1 : 1;
        const u = side < 0 ? t * 2 : (1 - t) * 2; // 0 en el suelo, 1 en la cumbre
        const x = side * 8.2 * k * (1 - Math.sin((u * Math.PI) / 2) ** 1.4);
        const y = 10.5 * k * Math.sin((u * Math.PI) / 2);
        row.push([x, y, z]);
      }
      rows.push(row);
    }
    b.grid(rows);
    for (let i = 0; i < 9; i++) {
      const z = -4 + i, y = 10.5 * Math.sqrt(1 - (z / 5.2) ** 2);
      b.seg([-0.4, y + 0.2, z - 0.4], [0.4, y + 1.6, z + 0.4]);
    }
    return b.v;
  }

  // L'Oceanogràfic: la flor de paraboloides hiperbólicos de Félix Candela.
  function oceanografic() {
    const b = new Builder();
    const R = 8.5, lobes = 8;
    const height = (r, a) => 0.4 + (r / R) ** 2 * (3.6 + 3.6 * Math.cos(lobes * a));
    for (let k = 1; k <= 7; k++) {
      const r = (R * k) / 7, ring = [];
      for (let s = 0; s < 128; s++) {
        const a = (s / 128) * TAU;
        ring.push([r * Math.cos(a), height(r, a), r * Math.sin(a)]);
      }
      b.line(ring, true);
    }
    for (let m = 0; m < 48; m++) {
      const a = (m / 48) * TAU, ray = [];
      for (let s = 0; s <= 8; s++) { const r = (R * s) / 8; ray.push([r * Math.cos(a), height(r, a), r * Math.sin(a)]); }
      b.line(ray);
    }
    return b.v;
  }

  // agua y cauce del antiguo Turia
  function water() {
    const b = new Builder();
    const pools = [[-75, -49, -10, 10], [-48, -24, -8.5, 8.5], [-22, 22, -11.5, -6.5]];
    pools.forEach(([x0, x1, z0, z1]) => {
      b.line([[x0, 0, z0], [x1, 0, z0], [x1, 0, z1], [x0, 0, z1]], true);
      for (let z = z0 + 1.2; z < z1; z += 1.2) b.seg([x0 + 0.6, 0, z], [x1 - 0.6, 0, z]);
    });
    return b.v;
  }
  function ground() {
    const b = new Builder();
    for (let x = -100; x <= 90; x += 8) b.seg([x, -0.02, -32], [x, -0.02, 32]);
    for (let z = -32; z <= 32; z += 8) b.seg([-100, -0.02, z], [90, -0.02, z]);
    return b.v;
  }

  const BUILDINGS = [
    { id: 'palau', make: palau, at: [-62, 0, 0] },
    { id: 'hemisferic', make: hemisferic, at: [-36, 0, 0] },
    { id: 'museu', make: museu, at: [-2, 0, -2] },
    { id: 'umbracle', make: umbracle, at: [-2, 0, 13] },
    { id: 'pont', make: pont, at: [30, 0, 0], rotY: 0 },
    { id: 'agora', make: agora, at: [46, 0, 0] },
    { id: 'oceanografic', make: oceanografic, at: [70, 0, 0] },
  ];

  // paradas de cámara (p = progreso del scroll en la sección)
  const KEYS = [
    { p: 0.0, tx: 4, th: 0.45, r: 112, h: 46, focus: -1 },
    { p: 0.12, tx: -60, th: 0.95, r: 66, h: 24, focus: 0 },
    { p: 0.25, tx: -36, th: 0.4, r: 54, h: 20, focus: 1 },
    { p: 0.39, tx: -2, th: -0.35, r: 84, h: 34, focus: 2 },
    { p: 0.52, tx: -2, th: 0.75, r: 74, h: 22, focus: 3 },
    { p: 0.65, tx: 30, th: 1.25, r: 66, h: 22, focus: 4 },
    { p: 0.77, tx: 46, th: 0.55, r: 54, h: 18, focus: 5 },
    { p: 0.89, tx: 70, th: -0.35, r: 54, h: 26, focus: 6 },
    { p: 1.0, tx: 4, th: -0.95, r: 118, h: 64, focus: -1 },
  ];

  function camAt(p) {
    let i = 0;
    while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++;
    const a = KEYS[i], c = KEYS[i + 1];
    const t = ease(clamp((p - a.p) / (c.p - a.p), 0, 1));
    return { tx: lerp(a.tx, c.tx, t), th: lerp(a.th, c.th, t), r: lerp(a.r, c.r, t), h: lerp(a.h, c.h, t) };
  }
  function focusAt(p) {
    let best = -1, dist = 0.06;
    KEYS.forEach((k) => { if (k.focus >= 0 && Math.abs(k.p - p) < dist) { dist = Math.abs(k.p - p); best = k.focus; } });
    return best;
  }

  class ValenciaScene {
    constructor(canvas, section, opts = {}) {
      this.canvas = canvas;
      this.section = section;
      this.reduced = !!opts.reducedMotion;
      this.onFocus = opts.onFocus || (() => {});
      this.focus = -2;
      this.built = this.reduced ? 1 : 0;
      this.running = false;
      this.visible = false;

      const r = this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
      r.setPixelRatio(Math.min(global.devicePixelRatio || 1, 2));
      r.setClearColor(0x000000, 0);

      const scene = this.scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x06070b, 60, 300);
      this.camera = new THREE.PerspectiveCamera(42, 1, 0.5, 600);

      const COLOR = new THREE.Color(0x8fdcff);
      const HOT = new THREE.Color(0xd8f6ff);
      this.COLOR = COLOR; this.HOT = HOT;

      const mat = (opacity, color = COLOR) => new THREE.LineBasicMaterial({
        color: color.clone(), transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, fog: true,
      });
      const geo = (arr) => {
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
        return g;
      };

      const city = this.city = new THREE.Group();
      const mirror = new THREE.Group();
      mirror.scale.y = -1;
      scene.add(city, mirror);

      const groundLines = new THREE.LineSegments(geo(ground()), mat(0.09, new THREE.Color(0x3a86a8)));
      const waterLines = new THREE.LineSegments(geo(water()), mat(0.22, new THREE.Color(0x5ab8e0)));
      scene.add(groundLines, waterLines);
      this.waterMat = waterLines.material;

      this.items = BUILDINGS.map((def, idx) => {
        const g = geo(def.make());
        const count = g.attributes.position.count;
        const m = mat(0.55), mm = mat(0.12);
        const top = new THREE.LineSegments(g, m);
        const low = new THREE.LineSegments(g, mm);
        [top, low].forEach((o) => { o.position.set(...def.at); if (def.rotY) o.rotation.y = def.rotY; });
        city.add(top); mirror.add(low);
        const item = { def, g, count, m, mm, glow: 0, idx };
        if (def.id === 'hemisferic') {
          const lg = geo(hemisfericLid());
          item.lid = [new THREE.LineSegments(lg, m), new THREE.LineSegments(lg, mm)];
          item.lid.forEach((o, k) => {
            o.position.set(def.at[0], 0, def.at[2] + 5.2);
            (k ? mirror : city).add(o);
          });
          item.lidGeo = lg;
        }
        return item;
      });

      this.cam = camAt(0);
      this.target = camAt(0);
      this.mouse = { x: 0, y: 0, tx: 0, ty: 0 };
      this.clock = new THREE.Clock();
      this._loop = this._loop.bind(this);
      this._resize = this._resize.bind(this);
      this._scroll = this._scroll.bind(this);
      this._move = (e) => {
        this.mouse.tx = (e.clientX / global.innerWidth) * 2 - 1;
        this.mouse.ty = (e.clientY / global.innerHeight) * 2 - 1;
      };
      this._applyBuild();
    }

    start() {
      this._resize();
      this._scroll();
      global.addEventListener('resize', this._resize);
      global.addEventListener('scroll', this._scroll, { passive: true });
      global.addEventListener('pointermove', this._move, { passive: true });
      this._io = new IntersectionObserver(([e]) => {
        this.visible = e.isIntersecting;
        if (this.visible) this._play(); else this.running = false;
      }, { rootMargin: '120px' });
      this._io.observe(this.canvas);
      this.cam = { ...this.target };
      this._render(0);
    }

    _play() {
      if (this.running) return;
      this.running = true;
      this.clock.getDelta();
      requestAnimationFrame(this._loop);
    }

    _scroll() {
      const rect = this.section.getBoundingClientRect();
      const span = rect.height - global.innerHeight;
      this.progress = span > 0 ? clamp(-rect.top / span, 0, 1) : 0.5;
      this.target = camAt(this.progress);
    }

    _resize() {
      const w = this.canvas.clientWidth || 1, h = this.canvas.clientHeight || 1;
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      // en vertical se aleja un poco para que quepa el complejo
      this.zoom = w / h < 0.8 ? 1.6 : w / h < 1.2 ? 1.2 : 1;
      // en escritorio el edificio queda a la derecha y deja sitio al texto
      if (w / h > 1.2) this.camera.setViewOffset(w, h, -w * 0.12, -h * 0.08, w, h);
      else if (this.camera.view) this.camera.clearViewOffset();
      this.camera.updateProjectionMatrix();
    }

    _applyBuild() {
      this.items.forEach((it, i) => {
        const local = clamp(this.built * 1.6 - i * 0.1, 0, 1);
        const n = Math.floor((it.count / 2) * ease(local)) * 2;
        it.g.setDrawRange(0, n);
        if (it.lidGeo) it.lidGeo.setDrawRange(0, local >= 1 ? Infinity : 0);
      });
    }

    _loop() {
      if (!this.running) return;
      const dt = Math.min(this.clock.getDelta(), 0.05);
      this._render(dt);
      requestAnimationFrame(this._loop);
    }

    _render(dt) {
      const t = this.clock.elapsedTime;
      if (this.built < 1) {
        this.built = Math.min(1, this.built + dt * 0.4);
        this._applyBuild();
      }
      const k = this.reduced ? 60 : 4.5;
      ['tx', 'th', 'r', 'h'].forEach((key) => { this.cam[key] = damp(this.cam[key], this.target[key], k, dt || 1); });
      this.mouse.x = damp(this.mouse.x, this.reduced ? 0 : this.mouse.tx, 3, dt || 1);
      this.mouse.y = damp(this.mouse.y, this.reduced ? 0 : this.mouse.ty, 3, dt || 1);

      const c = this.cam, zoom = this.zoom || 1;
      const th = c.th + this.mouse.x * 0.08 + (this.reduced ? 0 : Math.sin(t * 0.15) * 0.03);
      const r = c.r * zoom;
      this.camera.position.set(c.tx + Math.sin(th) * r, c.h * zoom + this.mouse.y * -2, Math.cos(th) * r);
      this.camera.lookAt(c.tx, 3, 0);

      const f = focusAt(this.progress ?? 0);
      if (f !== this.focus) { this.focus = f; this.onFocus(f); }
      this.items.forEach((it) => {
        it.glow = damp(it.glow, it.idx === f ? 1 : 0, 5, dt || 1);
        const base = f === -1 ? 0.75 : 0.42;
        it.m.opacity = base + it.glow * 0.62;
        it.m.color.copy(this.COLOR).lerp(this.HOT, it.glow * 0.8);
        it.mm.opacity = (base + it.glow * 0.5) * 0.22;
      });
      // el párpado del Hemisfèric se abre y se cierra despacio
      const hemi = this.items[1];
      if (hemi.lid) {
        const open = this.reduced ? 0.6 : 0.55 + Math.sin(t * 0.6) * 0.45;
        hemi.lid.forEach((o) => { o.rotation.x = -Math.PI / 2 + open * 1.1; });
      }
      this.waterMat.opacity = 0.18 + Math.sin(t * 1.3) * 0.05;
      this.renderer.render(this.scene, this.camera);
    }
  }

  global.ValenciaScene = ValenciaScene;
})(window);
