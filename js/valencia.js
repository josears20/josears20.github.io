// Ciudad de las Artes y las Ciencias en líneas: todo generado por código, sin modelos 3D externos.
// Vista panorámica que gira con el scroll; solo se redibuja cuando algo cambia.
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
    const N = 18, M = 10;
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
    for (let lat = 1; lat <= 3; lat++) {
      const phi = (lat / 4) * (Math.PI / 2);
      const ring = [];
      for (let s = 0; s < 28; s++) {
        const t = (s / 28) * TAU;
        ring.push([R * Math.cos(phi) * Math.cos(t), R * Math.sin(phi), R * Math.cos(phi) * Math.sin(t)]);
      }
      b.line(ring, true);
    }
    for (let m = 0; m < 10; m++) {
      const t = (m / 10) * TAU;
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
    const half = 21, N = 22, w = 2.8, h = 6.4;
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
    for (let k = 1; k <= 5; k++) {
      const r = (R * k) / 5, ring = [];
      for (let s = 0; s < 80; s++) {
        const a = (s / 80) * TAU;
        ring.push([r * Math.cos(a), height(r, a), r * Math.sin(a)]);
      }
      b.line(ring, true);
    }
    for (let m = 0; m < 32; m++) {
      const a = (m / 32) * TAU, ray = [];
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
      for (let z = z0 + 2; z < z1; z += 2) b.seg([x0 + 0.6, 0, z], [x1 - 0.6, 0, z]);
    });
    return b.v;
  }
  function ground() {
    const b = new Builder();
    for (let x = -96; x <= 96; x += 16) b.seg([x, -0.02, -32], [x, -0.02, 32]);
    for (let z = -32; z <= 32; z += 16) b.seg([-100, -0.02, z], [90, -0.02, z]);
    return b.v;
  }


  const BUILDINGS = [
    { id: 'palau', name: 'Palau de les Arts', make: palau, at: [-62, 0, 0], label: [-60, 21, 0] },
    { id: 'hemisferic', name: "L'Hemisfèric", make: hemisferic, at: [-36, 0, 0], label: [-36, 8, 0] },
    { id: 'museu', name: 'Museu de les Ciències', make: museu, at: [-2, 0, -2], label: [-2, 12.5, -2] },
    { id: 'umbracle', name: "L'Umbracle", make: umbracle, at: [-2, 0, 13], label: [12, 7.5, 13], minor: true },
    { id: 'pont', name: "Pont de l'Assut de l'Or", make: pont, at: [30, 0, 0], label: [30, 23.5, -17] },
    { id: 'agora', name: "L'Àgora", make: agora, at: [46, 0, 0], label: [46, 12.5, 0] },
    { id: 'oceanografic', name: "L'Oceanogràfic", make: oceanografic, at: [70, 0, 0], label: [70, 9, 0] },
  ];

  class ValenciaScene {
    constructor(canvas, stage, opts = {}) {
      this.canvas = canvas;
      this.stage = stage;
      this.reduced = !!opts.reducedMotion;
      this.labelsEl = opts.labels || null;
      this.built = this.reduced ? 1 : 0;
      this.visible = false;
      this.running = false;
      this.dirty = true;

      const r = this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
      r.setPixelRatio(Math.min(global.devicePixelRatio || 1, 1.5));
      r.setClearColor(0x000000, 0);

      const scene = this.scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x06070b, 90, 290);
      this.camera = new THREE.PerspectiveCamera(36, 1, 1, 600);

      const mat = (hex, opacity) => new THREE.LineBasicMaterial({
        color: hex, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, fog: true,
      });
      const geo = (arr) => {
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
        return g;
      };

      scene.add(new THREE.LineSegments(geo(ground()), mat(0x3a86a8, 0.12)));
      scene.add(new THREE.LineSegments(geo(water()), mat(0x5ab8e0, 0.28)));

      const lineMat = mat(0x9fe3ff, 0.85);
      this.items = BUILDINGS.map((def) => {
        const g = geo(def.make());
        const obj = new THREE.LineSegments(g, lineMat);
        obj.position.set(...def.at);
        scene.add(obj);
        const item = { def, g, count: g.attributes.position.count };
        if (def.id === 'hemisferic') {
          // párpado abierto, fijo
          const lg = geo(hemisfericLid());
          const lid = new THREE.LineSegments(lg, lineMat);
          lid.position.set(def.at[0], 0, def.at[2] + 5.2);
          lid.rotation.x = -Math.PI / 2 + 0.75;
          scene.add(lid);
          item.lidGeo = lg;
        }
        return item;
      });

      // etiquetas HTML ancladas a cada edificio
      this.labels = [];
      if (this.labelsEl) {
        this.labelsEl.innerHTML = '';
        BUILDINGS.forEach((def) => {
          const el = document.createElement('span');
          el.className = 'vlc__label' + (def.minor ? ' vlc__label--minor' : '');
          el.textContent = def.name;
          this.labelsEl.appendChild(el);
          this.labels.push({ el, pos: new THREE.Vector3(...def.label) });
        });
      }

      this.angle = 0.4;
      this.angleTarget = 0.4;
      this.mouse = 0;
      this.mouseTarget = 0;
      this.clock = new THREE.Clock();
      this._v = new THREE.Vector3();
      this._loop = this._loop.bind(this);
      this._resize = this._resize.bind(this);
      this._scroll = this._scroll.bind(this);
      this._move = (e) => {
        if (!this.visible || this.reduced) return;
        this.mouseTarget = (e.clientX / global.innerWidth) * 2 - 1;
        this._play();
      };
      this._applyBuild();
    }

    start() {
      this._resize();
      this._scroll();
      this.angle = this.angleTarget;
      global.addEventListener('resize', this._resize);
      global.addEventListener('scroll', this._scroll, { passive: true });
      global.addEventListener('pointermove', this._move, { passive: true });
      this._io = new IntersectionObserver(([e]) => {
        this.visible = e.isIntersecting;
        if (this.visible) { this.dirty = true; this._play(); }
      }, { rootMargin: '80px' });
      this._io.observe(this.stage);
    }

    _scroll() {
      const rect = this.stage.getBoundingClientRect();
      const vh = global.innerHeight;
      // 0 cuando el bloque asoma por abajo, 1 cuando sale por arriba
      const p = clamp((vh - rect.top) / (vh + rect.height), 0, 1);
      this.angleTarget = lerp(0.42, -0.42, p);
      if (this.visible) this._play();
    }

    _resize() {
      const w = this.stage.clientWidth || 1, h = this.stage.clientHeight || 1;
      this.w = w; this.h = h;
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      // distancia para que quepa todo el complejo a lo ancho
      const hfov = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) * this.camera.aspect);
      const halfWidth = this.camera.aspect < 1.2 ? 60 : 80;
      this.dist = clamp(halfWidth / Math.tan(hfov / 2), 95, 260);
      this.dirty = true;
      if (this.visible) this._play();
    }

    _applyBuild() {
      this.items.forEach((it, i) => {
        const local = clamp(this.built * 1.6 - i * 0.1, 0, 1);
        it.g.setDrawRange(0, Math.floor((it.count / 2) * ease(local)) * 2);
        if (it.lidGeo) it.lidGeo.setDrawRange(0, local >= 1 ? Infinity : 0);
      });
    }

    _play() {
      if (this.running) return;
      this.running = true;
      this.clock.getDelta();
      requestAnimationFrame(this._loop);
    }

    _loop() {
      const raw = this.clock.getDelta();
      const dt = Math.min(raw, 0.05);
      let moving = false;
      if (this.built < 1) {
        this.built = Math.min(1, this.built + Math.min(raw, 0.2) * 0.8);
        this._applyBuild();
        moving = true;
      }
      const k = this.reduced ? 1 : 1 - Math.exp(-6 * dt);
      const da = this.angleTarget - this.angle, dm = this.mouseTarget - this.mouse;
      if (Math.abs(da) > 1e-4 || Math.abs(dm) > 1e-4) {
        this.angle += da * k;
        this.mouse += dm * k;
        moving = true;
      }
      if (moving || this.dirty) {
        this._render();
        this.dirty = false;
      }
      // se para cuando ya no cambia nada; el scroll o el ratón lo despiertan
      if (this.visible && moving) requestAnimationFrame(this._loop);
      else this.running = false;
    }

    _render() {
      const th = this.angle + this.mouse * 0.06;
      const r = this.dist, cam = this.camera;
      cam.position.set(Math.sin(th) * r, r * 0.3, Math.cos(th) * r);
      cam.lookAt(0, 11, 0);
      this.renderer.render(this.scene, cam);

      const v = this._v;
      this.labels.forEach((l) => {
        v.copy(l.pos).project(cam);
        const x = (v.x * 0.5 + 0.5) * this.w, y = (-v.y * 0.5 + 0.5) * this.h;
        const show = v.z < 1 && x > 20 && x < this.w - 20 && this.built >= 1;
        // que la etiqueta no se salga por la derecha
        const lw = l.w || (l.w = l.el.offsetWidth);
        const lx = Math.min(x, this.w - lw - 10);
        l.el.style.transform = `translate(${lx.toFixed(1)}px, ${y.toFixed(1)}px)`;
        l.el.classList.toggle('is-on', show);
      });
    }
  }

  global.ValenciaScene = ValenciaScene;
})(window);
