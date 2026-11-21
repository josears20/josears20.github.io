// Ciudad de las Artes y las Ciencias en líneas: todo generado por código, sin modelos 3D externos.
// Proporciones aproximadas a las reales (1 unidad ≈ 7 m). Volúmenes oscuros que ocultan las líneas
// de detrás, reflejo en los estanques y render solo cuando algo cambia.
(function (global) {
  'use strict';

  const THREE = global.THREE;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => t * t * (3 - 2 * t);
  const TAU = Math.PI * 2;
  const PI = Math.PI;

  // ---------- geometría: líneas principales (L), secundarias (l) y triángulos (T) ----------
  function Geo() { this.L = []; this.l = []; this.T = []; }
  Geo.prototype.seg = function (a, b, minor) { (minor ? this.l : this.L).push(a[0], a[1], a[2], b[0], b[1], b[2]); };
  Geo.prototype.line = function (pts, closed, minor) {
    for (let i = 0; i < pts.length - 1; i++) this.seg(pts[i], pts[i + 1], minor);
    if (closed && pts.length > 2) this.seg(pts[pts.length - 1], pts[0], minor);
  };
  Geo.prototype.tri = function (a, b, c) { this.T.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]); };
  Geo.prototype.surf = function (rows) {
    for (let i = 0; i < rows.length - 1; i++) {
      for (let j = 0; j < rows[i].length - 1; j++) {
        const a = rows[i][j], b = rows[i + 1][j], c = rows[i + 1][j + 1], d = rows[i][j + 1];
        this.tri(a, b, c); this.tri(a, c, d);
      }
    }
  };
  // filas o columnas de una rejilla como líneas; every = cada cuántas, minor = secundarias
  Geo.prototype.rows = function (rows, every = 1, minor = false) {
    for (let i = 0; i < rows.length; i += every) this.line(rows[i], false, minor);
  };
  Geo.prototype.cols = function (rows, every = 1, minor = false) {
    for (let j = 0; j < rows[0].length; j += every) this.line(rows.map((r) => r[j]), false, minor);
  };
  Geo.prototype.box = function (x0, x1, z0, z1, y0, y1, minor) {
    const c = [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];
    const t = c.map(([x, z]) => [x, y1, z]);
    this.line(t, true, minor);
    c.forEach(([x, z]) => this.seg([x, y0, z], [x, y1, z], true));
    this.tri(t[0], t[1], t[2]); this.tri(t[0], t[2], t[3]);
    for (let k = 0; k < 4; k++) {
      const p = c[k], q = c[(k + 1) % 4];
      this.tri([p[0], y0, p[1]], [q[0], y0, q[1]], [q[0], y1, q[1]]);
      this.tri([p[0], y0, p[1]], [q[0], y1, q[1]], [p[0], y1, p[1]]);
    }
  };

  // ---------- Palau de les Arts: cuerpo, dos conchas y la pluma ----------
  function palau() {
    const g = new Geo();
    g.box(-17.5, 17.5, -8.5, 8.5, 0, 0.8, true);
    const body = [];
    for (let i = 0; i <= 16; i++) {
      const u = i / 16, x = -12.5 + 25 * u;
      const k = Math.pow(Math.sin(PI * u), 0.6);
      const row = [];
      for (let j = 0; j <= 12; j++) {
        const a = (PI * j) / 12;
        row.push([x, 0.8 + 9.6 * k * Math.sin(a), -4.2 * k * Math.cos(a)]);
      }
      body.push(row);
    }
    g.surf(body);
    g.rows(body, 2, true);
    g.cols(body, 3, true);
    // conchas laterales: nacen en los extremos y envuelven el cuerpo
    [-1, 1].forEach((s) => {
      const shell = [];
      for (let i = 0; i <= 28; i++) {
        const u = i / 28, x = -17 + 34 * u, su = Math.sin(PI * u);
        const top = 0.8 + 9 * Math.pow(su, 0.5) * (0.5 + 0.65 * u);
        const W = 4.8 + 3.2 * Math.pow(su, 0.7);
        const row = [];
        for (let j = 0; j <= 9; j++) {
          const v = j / 9;
          row.push([x, 0.8 + (top - 0.8) * v, s * W * Math.cos(v * 0.95)]);
        }
        shell.push(row);
      }
      g.surf(shell);
      g.line(shell.map((r) => r[9]));
      g.line(shell.map((r) => r[0]));
      g.cols(shell.map((r) => r.slice(1, 9)), 2, true);
      g.rows(shell, 4, true);
    });
    // la pluma: voladizo largo que nace detrás y sobrevuela la entrada
    const L = [], C = [], R = [];
    for (let i = 0; i <= 30; i++) {
      const t = i / 30, x = -15.5 + 35 * t;
      const y = 9.4 + 3.4 * t - 1.1 * t * t;
      const w = 2.1 * (1 - t) + 0.35;
      L.push([x, y, -w]); C.push([x, y + 0.35 * (1 - t) + 0.08, 0]); R.push([x, y, w]);
      if (i % 3 === 0) { g.seg([x, y, -w], C[i], true); g.seg(C[i], [x, y, w], true); }
    }
    g.surf([L, C, R]);
    g.line(L); g.line(R); g.line(C, false, true);
    return g;
  }

  // ---------- L'Hemisfèric: el ojo con su párpado de lamas y la cúpula-pupila ----------
  function hemisferic() {
    const g = new Geo();
    const L = 8, W = 3.9, H = 3.7, OPEN = 0.6 * PI;
    const w = (x) => W * (1 - (x / L) ** 2);
    const h = (x) => H * Math.pow(Math.max(0, 1 - (x / L) ** 2), 0.75);
    const shell = [];
    for (let i = 0; i <= 26; i++) {
      const x = -L + (2 * L * i) / 26, row = [];
      for (let j = 0; j <= 10; j++) {
        const a = (OPEN * j) / 10;
        row.push([x, 0.15 + h(x) * Math.sin(a), -w(x) * Math.cos(a)]);
      }
      shell.push(row);
    }
    g.surf(shell);
    g.rows(shell, 1, true); // costillas
    g.line(shell.map((r) => r[10])); // borde del párpado
    g.line(shell.map((r) => r[0]));
    g.line(shell.map((r) => r[5]), false, true);
    // contorno del ojo a ras de agua
    const outline = [];
    for (let i = 0; i <= 40; i++) { const x = -L + (2 * L * i) / 40; outline.push([x, 0.15, w(x)]); }
    g.line(outline);
    // párpado de lamas, abierto hacia fuera
    const hinge = shell.map((r) => r[10]);
    const lid = [];
    for (let k = 0; k <= 4; k++) {
      const v = k / 4;
      lid.push(hinge.map(([x, y, z]) => {
        const len = h(x) * 0.95 * v;
        return [x, y + len * 0.02, z + len * 0.92];
      }));
    }
    g.surf(lid);
    g.rows(lid.slice(1), 1, true);
    g.line(lid[4]);
    g.cols(lid, 3, true);
    // pupila: cúpula del planetario
    const R = 2.3, dome = [];
    for (let a = 0; a <= 6; a++) {
      const p = (a / 6) * (PI / 2), row = [];
      for (let s = 0; s <= 24; s++) {
        const t = (s / 24) * TAU;
        row.push([R * Math.cos(p) * Math.cos(t), 0.15 + R * Math.sin(p), 0.6 + R * Math.cos(p) * Math.sin(t)]);
      }
      dome.push(row);
    }
    g.surf(dome);
    g.rows(dome.slice(0, 6), 2);
    g.cols(dome, 3, true);
    return g;
  }

  // ---------- Museu de les Ciències: costillas, árboles de hormigón y peines ----------
  function museu() {
    const g = new Geo();
    const P = [[-5.6, 0], [-5.35, 3], [-5.2, 6], [-2, 6.9], [1.5, 6.4], [3.6, 5.2], [5.6, 0]];
    const M = 16, half = 15.5;
    const ribs = [];
    for (let i = 0; i <= M; i++) {
      const x = -half + (2 * half * i) / M;
      ribs.push(P.map(([z, y]) => [x, y, z]));
    }
    g.surf(ribs);
    g.rows(ribs);
    [2, 3, 5].forEach((j) => g.line(ribs.map((r) => r[j])));
    [1, 4].forEach((j) => g.line(ribs.map((r) => r[j]), false, true));
    for (let i = 0; i < M; i++) {
      const x0 = ribs[i][0][0], x1 = ribs[i + 1][0][0], xm = (x0 + x1) / 2;
      // árboles de hormigón de la fachada norte
      const knee = [x0, 2.7, -5.75];
      g.seg([x0, 0, -5.9], knee);
      g.seg(knee, [x0 - 0.85, 6, -5.2]);
      g.seg(knee, [x0 + 0.85, 6, -5.2]);
      // cresta dentada de la cubierta
      g.seg([x0, 6.9, -2], [xm, 7.6, -3.4]);
      g.seg([xm, 7.6, -3.4], [x1, 6.9, -2]);
      g.seg([xm, 7.6, -3.4], [xm, 6, -5.2], true);
      g.tri([x0, 6.9, -2], [xm, 7.6, -3.4], [x1, 6.9, -2]);
      // peines de la fachada sur
      g.seg([xm, 5.2, 3.6], [xm, 0.6, 6.5], true);
    }
    // proa triangular del extremo este
    const last = ribs[M];
    const apex = [half + 3.6, 3.2, -0.6], tip = [half + 4.4, 0, 0];
    [last[2], last[3], last[4], last[5]].forEach((p) => g.seg(p, apex));
    g.seg(apex, tip); g.seg(last[0], tip); g.seg(last[6], tip);
    for (let j = 0; j < last.length - 1; j++) g.tri(last[j], last[j + 1], apex);
    g.tri(last[0], apex, tip); g.tri(last[6], apex, tip);
    return g;
  }

  // ---------- L'Umbracle: paseo elevado bajo arcos ----------
  function umbracle() {
    const g = new Geo();
    const half = 23, N = 46, sp = 3.3;
    g.box(-half, half, -4.3, 4.3, 0, 1, true);
    const peaks = [[], [], []];
    for (let i = 0; i <= N; i++) {
      const x = -half + (2 * half * i) / N, arch = [];
      for (let s = 0; s <= 12; s++) {
        const z = -sp + (2 * sp * s) / 12;
        arch.push([x, 1 + 2.9 * (1 - Math.pow(Math.abs(z) / sp, 2.2)), z]);
      }
      g.line(arch);
      peaks[0].push(arch[6]); peaks[1].push(arch[3]); peaks[2].push(arch[9]);
    }
    g.line(peaks[0]);
    g.line(peaks[1], false, true); g.line(peaks[2], false, true);
    return g;
  }

  // ---------- Pont de l'Assut de l'Or: mástil curvo de 125 m ----------
  function pont() {
    const g = new Geo();
    const len = 13, y = 1.6;
    const L = [], R = [];
    for (let z = -len; z <= len; z += 2) { L.push([-1.2, y, z]); R.push([1.2, y, z]); g.seg([-1.2, y, z], [1.2, y, z], true); }
    g.line(L); g.line(R);
    g.surf([L, R]);
    [-6, 0, 6].forEach((z) => { g.seg([0, 0, z], [0, y, z], true); });
    const P = (t) => [0, y + 16.8 * t, -11 - 4.4 * Math.pow(t, 1.5)];
    const A = [], B = [];
    for (let i = 0; i <= 18; i++) {
      const t = i / 18, p = P(t), w = 0.6 * (1 - t) + 0.07;
      A.push([-w, p[1], p[2]]); B.push([w, p[1], p[2]]);
    }
    g.line(A); g.line(B);
    g.surf([A, B]);
    for (let k = 0; k < 26; k++) {
      const t = 0.3 + (0.7 * k) / 25;
      g.seg(P(t), [0, y, -7 + (19.5 * k) / 25], true);
    }
    for (let k = 0; k < 5; k++) g.seg(P(0.78 + k * 0.05), [0, 0, -16.5 - k * 0.7], true);
    return g;
  }

  // ---------- L'Àgora: carpa ojival elíptica con lamas en la cumbrera ----------
  function agora() {
    const g = new Geo();
    const a = 7.2, b = 5.2, H = 9.6, r = 1.6;
    const bez = (p0, p1, p2, p3, t) => {
      const m = 1 - t;
      return p0.map((_, k) => m * m * m * p0[k] + 3 * m * m * t * p1[k] + 3 * m * t * t * p2[k] + t * t * t * p3[k]);
    };
    const mer = [];
    for (let i = 0; i <= 40; i++) {
      const f = (i / 40) * TAU;
      const p0 = [a * Math.cos(f), 0, b * Math.sin(f)];
      const top = [clamp(p0[0] * 0.25, -r, r), H, 0];
      const c1 = [p0[0] * 1.06, H * 0.35, p0[2] * 1.06];
      const c2 = [p0[0] * 0.45, H * 0.9, p0[2] * 0.35];
      const row = [];
      for (let s = 0; s <= 10; s++) row.push(bez(p0, c1, c2, top, s / 10));
      mer.push(row);
    }
    g.surf(mer);
    g.rows(mer, 2, true);
    g.rows(mer.filter((_, i) => i % 5 === 0));
    g.cols(mer, 2, true);
    g.line(mer.map((r0) => r0[0]));
    for (let k = 0; k <= 8; k++) {
      const x = -r + (2 * r * k) / 8;
      g.seg([x - 0.3, H - 0.1, -0.5], [x + 0.3, H + 1.1, 0.5]);
    }
    return g;
  }

  // ---------- L'Oceanogràfic: los paraboloides de Félix Candela ----------
  function lotus(g, cx, cz, R, lobes, H) {
    const rows = [];
    const y = (r, t) => 0.2 + (r / R) ** 2 * (H * 0.5) * (1 + Math.cos(lobes * t));
    for (let k = 0; k <= 6; k++) {
      const r = (R * k) / 6, row = [];
      for (let s = 0; s <= 72; s++) { const t = (s / 72) * TAU; row.push([cx + r * Math.cos(t), y(r, t), cz + r * Math.sin(t)]); }
      rows.push(row);
    }
    g.surf(rows);
    g.line(rows[6]);
    g.rows(rows.slice(2, 6), 2, true);
    g.cols(rows, 3, true);
  }
  function oceanografic() {
    const g = new Geo();
    lotus(g, 0, 0, 5, 8, 3.4);
    lotus(g, -9, 5, 2.8, 4, 2.2);
    // aviario
    const R = 2.7, dome = [];
    for (let a = 0; a <= 5; a++) {
      const p = (a / 5) * (PI / 2), row = [];
      for (let s = 0; s <= 20; s++) { const t = (s / 20) * TAU; row.push([7 + R * Math.cos(p) * Math.cos(t), R * Math.sin(p), -4 + R * Math.cos(p) * Math.sin(t)]); }
      dome.push(row);
    }
    g.surf(dome);
    g.rows(dome, 1, true);
    g.cols(dome, 2, true);
    return g;
  }

  // ---------- palmeras ----------
  function palms(spots) {
    const g = new Geo();
    spots.forEach(([x, z], n) => {
      const hgt = 2.2 + ((n * 37) % 7) * 0.08, lean = ((n * 13) % 5 - 2) * 0.06;
      const top = [x + lean, hgt, z];
      g.seg([x, 0, z], [x + lean * 0.4, hgt * 0.5, z], true);
      g.seg([x + lean * 0.4, hgt * 0.5, z], top, true);
      for (let f = 0; f < 7; f++) {
        const a = (f / 7) * TAU + n;
        const d = [Math.cos(a), Math.sin(a)];
        const p1 = [top[0] + d[0] * 0.5, hgt + 0.25, top[2] + d[1] * 0.5];
        const p2 = [top[0] + d[0] * 1.0, hgt - 0.15, top[2] + d[1] * 1.0];
        g.seg(top, p1, true); g.seg(p1, p2, true);
      }
    });
    return g;
  }

  // estanques: [x0, x1, z0, z1]
  const POOLS = [[-21, 24, -14, -9.5], [25, 48, -8.5, 8.5], [49, 84, -14, -7.5], [100, 112, -9, -6.5], [125, 145, -10, -7]];

  const BUILDINGS = [
    { id: 'palau', name: 'Palau de les Arts', make: palau, at: [0, 0, 0], label: [3, 12.9, 0] },
    { id: 'hemisferic', name: "L'Hemisfèric", make: hemisferic, at: [36, 0, 0], label: [36, 4.4, 0] },
    { id: 'museu', name: 'Museu de les Ciències', make: museu, at: [64.5, 0, 0], label: [64.5, 7.9, -1] },
    { id: 'umbracle', name: "L'Umbracle", make: umbracle, at: [64.5, 0, 13], label: [80, 4, 13], minor: true },
    { id: 'pont', name: "Pont de l'Assut de l'Or", make: pont, at: [92, 0, 0], label: [92, 18.9, -15.7] },
    { id: 'agora', name: "L'Àgora", make: agora, at: [106, 0, 0], label: [106, 10.6, 0] },
    { id: 'oceanografic', name: "L'Oceanogràfic", make: oceanografic, at: [135, 0, 0], label: [135, 3, 0] },
  ];

  const PALMS = [];
  for (let x = -14; x <= 150; x += 7.5) { PALMS.push([x, -17]); if (x < 40 || x > 90) PALMS.push([x + 3.5, 21]); }

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

      const BG = 0x0b0d14;
      const scene = this.scene = new THREE.Scene();
      scene.fog = new THREE.Fog(BG, 120, 400);
      this.camera = new THREE.PerspectiveCamera(30, 1, 1, 900);

      const lineMat = (hex, opacity) => new THREE.LineBasicMaterial({ color: hex, transparent: true, opacity, fog: true });
      const major = lineMat(0xaee8ff, 0.95);
      const minor = lineMat(0x5cb4dc, 0.5);
      const majorR = lineMat(0xaee8ff, 0.32);
      const minorR = lineMat(0x5cb4dc, 0.16);
      const solid = new THREE.MeshBasicMaterial({
        vertexColors: true, side: THREE.DoubleSide, fog: true,
        polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 2,
      });

      // sombreado falso por cara: más claro cuanto más mira a la luz y cuanto más alto
      const LIGHT = new THREE.Vector3(-0.35, 0.8, -0.5).normalize();
      const C0 = new THREE.Color(0x070b12), C1 = new THREE.Color(0x15324a);
      const lineGeo = (arr) => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
        return geo;
      };
      const meshGeo = (arr) => {
        const geo = lineGeo(arr);
        const col = new Float32Array(arr.length);
        const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
        const e1 = new THREE.Vector3(), e2 = new THREE.Vector3(), tmp = new THREE.Color();
        for (let i = 0; i < arr.length; i += 9) {
          a.fromArray(arr, i); b.fromArray(arr, i + 3); c.fromArray(arr, i + 6);
          e1.subVectors(b, a); e2.subVectors(c, a);
          const n = e1.cross(e2).normalize();
          const s = Math.abs(n.dot(LIGHT)) || 0;
          const hgt = clamp((a.y + b.y + c.y) / 30, 0, 0.35);
          tmp.copy(C0).lerp(C1, clamp(s * 0.85 + hgt, 0, 1));
          for (let k = 0; k < 3; k++) { col[i + k * 3] = tmp.r; col[i + k * 3 + 1] = tmp.g; col[i + k * 3 + 2] = tmp.b; }
        }
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
        return geo;
      };

      // suelo opaco con huecos en los estanques: el reflejo solo se ve a través del agua
      const shape = new THREE.Shape();
      shape.moveTo(-500, -500); shape.lineTo(600, -500); shape.lineTo(600, 500); shape.lineTo(-500, 500); shape.closePath();
      POOLS.forEach(([x0, x1, z0, z1]) => {
        const hole = new THREE.Path();
        hole.moveTo(x0, -z0); hole.lineTo(x0, -z1); hole.lineTo(x1, -z1); hole.lineTo(x1, -z0); hole.closePath();
        shape.holes.push(hole);
      });
      const floor = new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshBasicMaterial({ color: 0x0a0e15, fog: true }));
      floor.rotation.x = -PI / 2;
      scene.add(floor);
      POOLS.forEach(([x0, x1, z0, z1]) => {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0),
          new THREE.MeshBasicMaterial({ color: 0x1a5a7a, transparent: true, opacity: 0.22, depthWrite: false, fog: true }));
        m.rotation.x = -PI / 2;
        m.position.set((x0 + x1) / 2, 0.01, (z0 + z1) / 2);
        m.renderOrder = 2;
        scene.add(m);
      });

      // trazado del cauce: bordes de los estanques y paseos
      const ground = new Geo();
      POOLS.forEach(([x0, x1, z0, z1]) => ground.line([[x0, 0.02, z0], [x1, 0.02, z0], [x1, 0.02, z1], [x0, 0.02, z1]], true));
      [-30, 30].forEach((z) => ground.seg([-50, 0.02, z], [180, 0.02, z], true));
      [-19.5, 19.5].forEach((z) => ground.seg([-30, 0.02, z], [160, 0.02, z], true));
      scene.add(new THREE.LineSegments(lineGeo(ground.L), lineMat(0x4aa3cc, 0.45)));
      scene.add(new THREE.LineSegments(lineGeo(ground.l), lineMat(0x2a6a8a, 0.3)));

      const city = new THREE.Group();
      const mirror = new THREE.Group();
      mirror.scale.y = -1;
      scene.add(city, mirror);

      city.add(new THREE.LineSegments(lineGeo(palms(PALMS).l), minor));

      this.items = BUILDINGS.map((def) => {
        const geo = def.make();
        const gL = lineGeo(geo.L), gl = lineGeo(geo.l), gT = meshGeo(geo.T);
        const add = (group, mL, ml) => {
          const o = new THREE.Group();
          o.add(new THREE.Mesh(gT, solid), new THREE.LineSegments(gL, mL), new THREE.LineSegments(gl, ml));
          o.position.set(...def.at);
          group.add(o);
        };
        add(city, major, minor);
        add(mirror, majorR, minorR);
        return { def, gL, gl, nL: gL.attributes.position.count, nl: gl.attributes.position.count };
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

      // encuadre: centro, ángulos al entrar y salir, altura y distancia relativas
      this.view = { cx: 54, a0: -0.75, a1: -0.2, hk: 0.42, dk: 0.95, oy: 0.13 };
      this.angle = 0;
      this.angleTarget = 0;
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
      this.angleTarget = lerp(this.view.a0, this.view.a1, p);
      if (this.visible) this._play();
    }

    _resize() {
      const w = this.stage.clientWidth || 1, h = this.stage.clientHeight || 1;
      this.w = w; this.h = h;
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      // baja la imagen para no dejar suelo vacío abajo
      this.camera.setViewOffset(w, h, 0, -h * this.view.oy, w, h);
      this.camera.updateProjectionMatrix();
      // distancia para que quepa todo el complejo a lo ancho
      const hfov = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) * this.camera.aspect);
      const halfWidth = this.camera.aspect < 1.2 ? 66 : 84;
      this.dist = clamp(halfWidth / Math.tan(hfov / 2), 120, 420);
      this.scene.fog.near = this.dist * 0.75;
      this.scene.fog.far = this.dist * 2.1;
      this.labels.forEach((l) => { l.w = 0; });
      this.dirty = true;
      if (this.visible) this._play();
    }

    _applyBuild() {
      this.items.forEach((it, i) => {
        const t = ease(clamp(this.built * 1.6 - i * 0.1, 0, 1));
        it.gL.setDrawRange(0, Math.floor((it.nL / 2) * t) * 2);
        it.gl.setDrawRange(0, Math.floor((it.nl / 2) * t) * 2);
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
      // vista desde la orilla norte, como en las postales
      const V = this.view;
      const th = this.angle + this.mouse * 0.05;
      const r = this.dist * V.dk, cam = this.camera, cx = V.cx;
      cam.position.set(cx + Math.sin(th) * r, r * V.hk, -Math.cos(th) * r);
      cam.lookAt(cx, 2, 0);
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
