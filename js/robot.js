/* ==========================================================================
   robot.js — Robot 3D interactivo (Three.js r149, build UMD global `THREE`)
   --------------------------------------------------------------------------
   ARQUITECTURA
   RobotScene es una clase autocontenida que recibe un <canvas>:

     constructor ─┬─ _initRenderer()     WebGLRenderer, DPR limitado, tone mapping
                  ├─ _initScene()        cámara y luces
                  ├─ _buildEnvironment() mapa de entorno de "estudio" (reflejos PBR)
                  ├─ _buildRobot()       geometría 100 % procedural (sin modelos)
                  ├─ _buildAtmosphere()  partículas + sombra de contacto
                  └─ _bindEvents()       puntero, clic, resize, visibilidad

     _tick() → _update(dt, t) → renderer.render()

   ACABADO
   Por defecto se usa el acabado "pro": un entorno de estudio generado con
   PMREMGenerator (paneles emisivos: softbox cenital, tiras cian y violeta)
   para que la cerámica, el cromo y el visor tengan reflejos reales.
   Añadiendo ?robot=clasico a la URL se vuelve al acabado anterior.

   SEGUIMIENTO DEL CURSOR
   1. El puntero se convierte a NDC relativas al canvas (se permiten valores
      fuera de [-1, 1] para que mire también hacia el texto de al lado).
   2. Un rayo desde la cámara interseca un plano frontal: ese punto es lo
      que el robot mira.
   3. Yaw/pitch se limitan a un rango "anatómico" y se suavizan con
      amortiguación exponencial independiente de los FPS. Ojos, cabeza y
      torso usan constantes distintas (los ojos llegan antes).

   SALUDO
   Un clic sobre el canvas lanza una animación de ~2 s: el brazo sube,
   el antebrazo se mueve de lado a lado, la cabeza se inclina y los ojos
   sonríen.

   RENDIMIENTO
   DPR máximo 1.5, sin postprocesado (el "bloom" son sprites aditivos) y
   el bucle se pausa fuera de pantalla o con la pestaña oculta.
   ========================================================================== */

(function (global) {
  'use strict';

  const THREE = global.THREE;
  const PRO = !/[?&]robot=clasico/.test(global.location.search);

  /* ------------------------------------------------------------------------
     Constantes de comportamiento (ajustables)
     ------------------------------------------------------------------------ */
  const CONFIG = {
    accent: 0x5ce1ff,
    accentHappy: 0xffc58a,
    rimViolet: 0x8b7bff,
    maxDpr: 1.5,
    lookPlaneZ: 3.2,       // plano imaginario donde se proyecta el cursor
    yawLimit: 1.0,         // ±rad que puede girar la cabeza
    pitchLimit: 0.55,
    dampEyes: 34,          // cuanto más alto, más rápido reacciona
    dampHead: 13,
    dampBody: 6,
    bodyFollow: 0.3,       // fracción del giro de cabeza que acompaña el torso
    idleAfter: 3.5,        // s sin puntero → el robot "curiosea" solo
    waveDuration: 2.2,     // s que dura el saludo
  };

  /* ------------------------------------------------------------------------
     Utilidades
     ------------------------------------------------------------------------ */
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const damp = (a, b, lambda, dt) => a + (b - a) * (1 - Math.exp(-lambda * dt));
  const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

  /**
   * Caja con aristas redondeadas a partir de un BoxGeometry subdividido.
   * Cada vértice se proyecta sobre una esfera de radio `r` centrada en el
   * punto más cercano de la caja interior; la normal es esa misma dirección,
   * así que no hay costuras de sombreado entre caras.
   */
  function roundedBox(w, h, d, r, seg = 10) {
    const geo = new THREE.BoxGeometry(w, h, d, seg, seg, seg);
    const pos = geo.attributes.position;
    const nor = geo.attributes.normal;
    const ix = w / 2 - r, iy = h / 2 - r, iz = d / 2 - r;
    const v = new THREE.Vector3();
    const inner = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      inner.set(clamp(v.x, -ix, ix), clamp(v.y, -iy, iy), clamp(v.z, -iz, iz));
      v.sub(inner).normalize();
      nor.setXYZ(i, v.x, v.y, v.z);
      v.multiplyScalar(r).add(inner);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    pos.needsUpdate = true;
    nor.needsUpdate = true;
    return geo;
  }

  /** Textura radial (blanco → transparente) para glows y sombras falsas */
  function radialTexture(inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)') {
    const size = 128;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, inner);
    g.addColorStop(0.35, inner.replace(/[\d.]+\)$/, '0.35)'));
    g.addColorStop(1, outer);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  /* ========================================================================
     RobotScene
     ======================================================================== */
  class RobotScene {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {{ reducedMotion?: boolean, onEngage?: Function }} [options]
     */
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.container = canvas.parentElement;
      this.reducedMotion = !!options.reducedMotion;
      this.onEngage = options.onEngage || (() => {});

      // Estado de interacción
      this.pointerNdc = new THREE.Vector2(0, 0.15);
      this.lastPointerAt = -Infinity;
      this.pointerSpeed = 0;
      this.engaged = false;
      this.mood = 'neutral';   // 'neutral' | 'happy'
      this.waveT = -1;         // segundos desde que empezó el saludo (-1 = no saluda)

      // Estado animado (valores suavizados)
      this.state = {
        headYaw: 0, headPitch: 0, headRoll: 0,
        bodyYaw: 0,
        eyeX: 0, eyeY: 0,
        blink: 1, nextBlink: 2,
        squint: 1,
        intro: 0,
      };

      this._raycaster = new THREE.Raycaster();
      this._lookPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -CONFIG.lookPlaneZ);
      this._rawTarget = new THREE.Vector3(0, 2.6, CONFIG.lookPlaneZ);
      this._smoothTarget = this._rawTarget.clone();
      this._headWorld = new THREE.Vector3();
      this._tmpColor = new THREE.Color();
      this._happyColor = new THREE.Color(CONFIG.accentHappy);

      this._running = false;
      this._visible = true;
      this._clock = new THREE.Clock(false);
      this._elapsed = 0;
      this._tick = this._tick.bind(this);

      this._initRenderer();
      this._initScene();
      if (PRO) this._buildEnvironment();
      this._buildRobot();
      this._buildAtmosphere();
      this._bindEvents();
      this._resize();
    }

    /* ----------------------------------------------------------------------
       Renderer
       ---------------------------------------------------------------------- */
    _initRenderer() {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true,                 // fondo transparente: se ve el CSS de detrás
        powerPreference: 'high-performance',
      });
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.outputEncoding = THREE.sRGBEncoding;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = PRO ? 1.0 : 1.05;
    }

    /* ----------------------------------------------------------------------
       Cámara y luces
       ---------------------------------------------------------------------- */
    _initScene() {
      this.scene = new THREE.Scene();

      this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
      this.cameraBase = new THREE.Vector3(0, 1.9, 8);
      this.camera.position.copy(this.cameraBase);
      this.cameraLookAt = new THREE.Vector3(0, 1.62, 0);

      // Con mapa de entorno, las luces directas pueden ser más suaves
      this.scene.add(new THREE.HemisphereLight(0xc8dcff, 0x0a0c14, PRO ? 0.25 : 0.55));

      const key = new THREE.DirectionalLight(0xffffff, PRO ? 1.1 : 1.35);
      key.position.set(3, 5, 5);
      this.scene.add(key);

      // Contraluces de color: dibujan la silueta sobre el fondo oscuro
      const rimCyan = new THREE.DirectionalLight(CONFIG.accent, PRO ? 1.8 : 2.2);
      rimCyan.position.set(-5, 2.5, -4);
      this.scene.add(rimCyan);

      const rimViolet = new THREE.DirectionalLight(CONFIG.rimViolet, PRO ? 1.6 : 2.0);
      rimViolet.position.set(5, 1, -4);
      this.scene.add(rimViolet);

      // Luz de acento: viaja con el punto al que mira el robot
      this.accentLight = new THREE.PointLight(CONFIG.accent, 0.9, 9, 1.6);
      this.scene.add(this.accentLight);
    }

    /* ----------------------------------------------------------------------
       Entorno de estudio para reflejos (se calcula una sola vez)
       Una habitación oscura con paneles emisivos; PMREMGenerator la convierte
       en un mapa de entorno prefiltrado que usan los materiales PBR.
       ---------------------------------------------------------------------- */
    _buildEnvironment() {
      const env = new THREE.Scene();
      env.add(new THREE.Mesh(
        new THREE.BoxGeometry(24, 14, 24),
        new THREE.MeshBasicMaterial({ color: 0x0a0d15, side: THREE.BackSide })
      ));
      const panel = (w, h, hex, power, pos, rot) => {
        const m = new THREE.Mesh(
          new THREE.PlaneGeometry(w, h),
          new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(power), side: THREE.DoubleSide })
        );
        m.position.set(pos[0], pos[1], pos[2]);
        m.rotation.set(rot[0], rot[1], rot[2]);
        env.add(m);
      };
      panel(9, 3.5, 0xffffff, 3.2, [0, 6.5, 1.5], [Math.PI / 2, 0, 0]);      // softbox cenital
      panel(4, 6, 0xffffff, 1.8, [7, 1.5, 5], [0, -Math.PI / 3, 0]);         // ventana lateral
      panel(1.2, 8, CONFIG.accent, 3.0, [-8, 1, -2], [0, Math.PI / 2, 0]);   // tira cian
      panel(1.2, 8, CONFIG.rimViolet, 2.6, [8, 1, -3], [0, -Math.PI / 2, 0]); // tira violeta
      panel(12, 1.4, 0xffffff, 0.5, [0, -3, 7], [0, 0, 0]);                  // rebote de suelo

      const pmrem = new THREE.PMREMGenerator(this.renderer);
      this.envTarget = pmrem.fromScene(env, 0.035);
      this.scene.environment = this.envTarget.texture;
      pmrem.dispose();
      env.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
    }

    /* ----------------------------------------------------------------------
       Materiales
       ---------------------------------------------------------------------- */
    _materials() {
      if (!PRO) {
        return {
          shell: new THREE.MeshPhysicalMaterial({ color: 0xe9edf5, roughness: 0.32, metalness: 0.05, clearcoat: 0.9, clearcoatRoughness: 0.22 }),
          satin: new THREE.MeshPhysicalMaterial({ color: 0xe9edf5, roughness: 0.32, metalness: 0.05, clearcoat: 0.9, clearcoatRoughness: 0.22 }),
          dark: new THREE.MeshStandardMaterial({ color: 0x181c27, roughness: 0.42, metalness: 0.6 }),
          chrome: new THREE.MeshStandardMaterial({ color: 0x181c27, roughness: 0.42, metalness: 0.6 }),
          visor: new THREE.MeshPhysicalMaterial({ color: 0x04060b, roughness: 0.12, metalness: 0.35, clearcoat: 1, clearcoatRoughness: 0.04 }),
          glow: new THREE.MeshBasicMaterial({ color: CONFIG.accent, toneMapped: false }),
        };
      }
      return {
        // Cerámica blanca con barniz: base algo satinada + capa de clearcoat brillante
        shell: new THREE.MeshPhysicalMaterial({ color: 0xf4f6fa, roughness: 0.24, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.06 }),
        // Paneles secundarios algo más mates para que se lean las piezas
        satin: new THREE.MeshPhysicalMaterial({ color: 0xdfe4ec, roughness: 0.45, metalness: 0, clearcoat: 0.5, clearcoatRoughness: 0.3 }),
        // Grafito metálico (articulaciones, cuello, carcasas)
        dark: new THREE.MeshStandardMaterial({ color: 0x262a33, roughness: 0.3, metalness: 0.85 }),
        // Cromo pulido para anillos y detalles
        chrome: new THREE.MeshStandardMaterial({ color: 0xdfe3ea, roughness: 0.12, metalness: 1 }),
        // Visor de cristal negro con reflejos fuertes
        visor: new THREE.MeshPhysicalMaterial({ color: 0x010204, roughness: 0.05, metalness: 0.5, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 1.5 }),
        glow: new THREE.MeshBasicMaterial({ color: CONFIG.accent, toneMapped: false }),
      };
    }

    /* ----------------------------------------------------------------------
       Robot procedural
       Jerarquía:
         robot (flota)
         ├─ torso (gira un poco) → pecho, núcleo, mochila, propulsor, brazos
         │    └─ brazo: hombro → brazo → codo → antebrazo → mano
         ├─ neck (segmentado)
         └─ head (yaw/pitch)     → visor → ojos, orejas, antena
       ---------------------------------------------------------------------- */
    _buildRobot() {
      const mat = this._materials();
      this.materials = mat;

      const glowTex = radialTexture();
      this.glowTexture = glowTex;
      this.glowSprites = [];
      const makeGlow = (scale, opacity = 0.9) => {
        const s = new THREE.Sprite(new THREE.SpriteMaterial({
          map: glowTex, color: CONFIG.accent, transparent: true, opacity,
          blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
        }));
        s.scale.setScalar(scale);
        this.glowSprites.push(s);
        return s;
      };
      const mesh = (geo, m, x = 0, y = 0, z = 0) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); return o; };

      const robot = new THREE.Group();
      this.robot = robot;
      this.scene.add(robot);

      /* --- Torso --- */
      const torso = new THREE.Group();
      this.torso = torso;
      robot.add(torso);

      const body = mesh(new THREE.CapsuleGeometry(0.62, 0.55, 12, 40), mat.shell, 0, 1.05, 0);
      body.scale.set(1, 0.9, 0.82);
      torso.add(body);

      // Junta de cintura: anillo de grafito que separa pecho y abdomen
      const waist = mesh(new THREE.TorusGeometry(0.6, 0.022, 10, 64), mat.dark, 0, 0.86, 0);
      waist.rotation.x = Math.PI / 2;
      waist.scale.set(1.02, 0.84, 1);
      torso.add(waist);

      // Placa del pecho con pantalla de cristal y núcleo luminoso
      torso.add(mesh(roundedBox(0.62, 0.42, 0.12, 0.06, 6), mat.dark, 0, 1.24, 0.46));
      torso.add(mesh(roundedBox(0.5, 0.3, 0.05, 0.04, 4), mat.visor, 0, 1.24, 0.52));
      const core = mesh(new THREE.TorusGeometry(0.075, 0.018, 12, 40), mat.glow, 0, 1.24, 0.555);
      torso.add(core);
      const coreGlow = makeGlow(0.55, 0.7);
      coreGlow.position.copy(core.position);
      torso.add(coreGlow);
      this.coreGlow = coreGlow;
      // Barras de "estado" junto al núcleo
      [-0.17, 0.17].forEach((x) => torso.add(mesh(roundedBox(0.05, 0.14, 0.02, 0.01, 2), mat.glow, x, 1.24, 0.548)));

      // Mochila trasera con rejillas
      torso.add(mesh(roundedBox(0.66, 0.5, 0.16, 0.07, 6), mat.satin, 0, 1.18, -0.5));
      for (let i = 0; i < 3; i++) torso.add(mesh(roundedBox(0.4, 0.03, 0.02, 0.012, 2), mat.dark, 0, 1.08 + i * 0.09, -0.585));

      // Propulsor bajo el cuerpo
      const thruster = mesh(new THREE.CylinderGeometry(0.2, 0.3, 0.16, 40), mat.dark, 0, 0.2, 0);
      torso.add(thruster);
      const thrusterRim = mesh(new THREE.TorusGeometry(0.21, 0.014, 8, 48), mat.chrome, 0, 0.13, 0);
      thrusterRim.rotation.x = Math.PI / 2;
      torso.add(thrusterRim);
      const ring = mesh(new THREE.TorusGeometry(0.42, 0.016, 12, 80), mat.glow, 0, 0.06, 0);
      ring.rotation.x = Math.PI / 2;
      torso.add(ring);
      this.ring = ring;
      const ringGlow = makeGlow(1.5, 0.35);
      ringGlow.position.y = 0.02;
      torso.add(ringGlow);

      // Brazos: hombro → brazo → codo → antebrazo → mano
      this.arms = [-1, 1].map((side) => {
        const shoulder = new THREE.Group();
        shoulder.position.set(side * 0.74, 1.58, 0);
        shoulder.add(mesh(new THREE.SphereGeometry(0.15, 32, 20), mat.dark));
        const cap = mesh(new THREE.TorusGeometry(0.15, 0.018, 10, 40), mat.chrome);
        cap.rotation.y = Math.PI / 2;
        shoulder.add(cap);
        shoulder.add(mesh(new THREE.CapsuleGeometry(0.11, 0.2, 8, 24), mat.shell, 0, -0.22, 0));

        const elbow = new THREE.Group();
        elbow.position.y = -0.42;
        elbow.add(mesh(new THREE.SphereGeometry(0.1, 24, 16), mat.dark));
        elbow.add(mesh(new THREE.CapsuleGeometry(0.1, 0.18, 8, 24), mat.shell, 0, -0.2, 0));
        const hand = new THREE.Group();
        hand.position.y = -0.4;
        const palm = mesh(new THREE.SphereGeometry(0.11, 24, 16), mat.dark);
        palm.scale.set(1, 1.1, 0.8);
        hand.add(palm);
        const thumb = mesh(new THREE.CapsuleGeometry(0.03, 0.06, 4, 10), mat.dark, -side * 0.08, 0.02, 0.05);
        thumb.rotation.z = side * 0.8;
        hand.add(thumb);
        elbow.add(hand);
        shoulder.add(elbow);

        shoulder.rotation.z = side * 0.14;
        shoulder.userData = { side, elbow };
        torso.add(shoulder);
        return shoulder;
      });

      /* --- Cuello segmentado --- */
      const neck = new THREE.Group();
      neck.add(mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.3, 24), mat.chrome, 0, 1.94, 0));
      [1.84, 1.93, 2.02].forEach((y, i) => neck.add(mesh(new THREE.CylinderGeometry(0.17 - i * 0.015, 0.19 - i * 0.015, 0.05, 32), mat.dark, 0, y, 0)));
      robot.add(neck);

      /* --- Cabeza --- */
      const head = new THREE.Group();
      head.position.y = 2.04;          // el pivote está en el cuello
      head.rotation.order = 'YXZ';     // primero yaw, luego pitch
      this.head = head;
      robot.add(head);

      head.add(mesh(roundedBox(1.5, 1.08, 1.2, 0.34, 16), mat.shell, 0, 0.56, 0));
      // Marco del visor en grafito + cristal
      head.add(mesh(roundedBox(1.32, 0.72, 0.14, 0.15, 10), mat.dark, 0, 0.56, 0.54));
      head.add(mesh(roundedBox(1.22, 0.62, 0.14, 0.12, 10), mat.visor, 0, 0.56, 0.57));
      // Rejillas superiores
      for (let i = -1; i <= 1; i++) head.add(mesh(roundedBox(0.26, 0.02, 0.06, 0.01, 2), mat.dark, i * 0.32, 1.1, -0.15));

      // Ojos: grupo que se desplaza dentro del visor
      const eyes = new THREE.Group();
      eyes.position.set(0, 0.57, 0.65);
      head.add(eyes);
      this.eyes = eyes;
      const eyeGeo = roundedBox(0.2, 0.25, 0.03, 0.012, 4);
      this.eyeMeshes = [-1, 1].map((side) => {
        const eye = new THREE.Group();
        eye.position.x = side * 0.27;
        eye.add(new THREE.Mesh(eyeGeo, mat.glow));
        const g = makeGlow(0.62, 0.8);
        g.position.z = 0.02;
        eye.add(g);
        eyes.add(eye);
        return eye;
      });

      // "Orejas": carcasa de grafito, anillo cromado y halo luminoso
      [-1, 1].forEach((side) => {
        const pod = mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.14, 40), mat.dark, side * 0.79, 0.56, 0);
        pod.rotation.z = Math.PI / 2;
        head.add(pod);
        const rim = mesh(new THREE.TorusGeometry(0.2, 0.018, 10, 48), mat.chrome, side * 0.86, 0.56, 0);
        rim.rotation.y = Math.PI / 2;
        head.add(rim);
        const halo = mesh(new THREE.TorusGeometry(0.11, 0.014, 10, 40), mat.glow, side * 0.865, 0.56, 0);
        halo.rotation.y = Math.PI / 2;
        head.add(halo);
      });

      // Antena
      head.add(mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.06, 20), mat.dark, 0.34, 1.11, -0.05));
      const antenna = mesh(new THREE.CylinderGeometry(0.014, 0.018, 0.4, 12), mat.chrome, 0.35, 1.3, -0.05);
      antenna.rotation.z = -0.12;
      head.add(antenna);
      const tip = mesh(new THREE.SphereGeometry(0.05, 20, 14), mat.glow, 0.375, 1.5, -0.05);
      head.add(tip);
      const tipGlow = makeGlow(0.5, 0.9);
      tipGlow.position.copy(tip.position);
      head.add(tipGlow);
      this.antennaGlow = tipGlow;
    }

    /* ----------------------------------------------------------------------
       Atmósfera: polvo luminoso + sombra de contacto falsa
       ---------------------------------------------------------------------- */
    _buildAtmosphere() {
      const COUNT = 260;
      const positions = new Float32Array(COUNT * 3);
      for (let i = 0; i < COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 14;
        positions[i * 3 + 1] = Math.random() * 7 - 1.5;
        positions[i * 3 + 2] = -Math.random() * 6 - 1;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      this.dust = new THREE.Points(geo, new THREE.PointsMaterial({
        size: 0.04, color: CONFIG.accent, transparent: true, opacity: 0.5,
        map: this.glowTexture, blending: THREE.AdditiveBlending, depthWrite: false,
      }));
      this.scene.add(this.dust);

      const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(2.4, 2.4),
        new THREE.MeshBasicMaterial({
          map: radialTexture('rgba(0,0,0,0.85)', 'rgba(0,0,0,0)'),
          transparent: true, depthWrite: false,
        })
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = -0.38;
      this.shadow = shadow;
      this.scene.add(shadow);
    }

    /* ----------------------------------------------------------------------
       Eventos
       ---------------------------------------------------------------------- */
    _bindEvents() {
      this._onPointerMove = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        if (!rect.width) return;
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        const dx = x - this.pointerNdc.x, dy = y - this.pointerNdc.y;
        this.pointerSpeed = Math.min(1, this.pointerSpeed + Math.hypot(dx, dy) * 2);
        this.pointerNdc.set(clamp(x, -3, 3), clamp(y, -2.5, 2.5));
        this.lastPointerAt = this._elapsed;
        if (!this.engaged && Math.abs(x) <= 1 && Math.abs(y) <= 1) {
          this.engaged = true;
          this.onEngage();
        }
      };
      global.addEventListener('pointermove', this._onPointerMove, { passive: true });
      global.addEventListener('pointerdown', this._onPointerMove, { passive: true });

      // Cualquier clic/toque sobre el escenario hace que salude
      this._onClick = () => this.wave();
      this.canvas.addEventListener('click', this._onClick);

      this._resizeObserver = new ResizeObserver(() => this._resize());
      this._resizeObserver.observe(this.canvas);

      this._io = new IntersectionObserver(([entry]) => {
        this._visible = entry.isIntersecting;
        this._syncRunning();
      }, { threshold: 0 });
      this._io.observe(this.canvas);

      this._onVisibility = () => this._syncRunning();
      document.addEventListener('visibilitychange', this._onVisibility);
    }

    _resize() {
      // Se mide el propio canvas: el escenario tiene además la barra de ventana
      const w = this.canvas.clientWidth;
      const h = this.canvas.clientHeight;
      if (!w || !h) return;
      this.renderer.setPixelRatio(Math.min(global.devicePixelRatio || 1, CONFIG.maxDpr));
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      // En formatos estrechos alejamos la cámara para que el robot quepa a lo ancho
      const fit = clamp(0.85 / this.camera.aspect, 1, 1.6);
      this.camera.position.z = this.cameraBase.z * fit;
      this.camera.updateProjectionMatrix();
      if (!this._running) this._render();
    }

    /* ----------------------------------------------------------------------
       API pública
       ---------------------------------------------------------------------- */
    start() { this._wantsRun = true; this._syncRunning(); }
    stop() { this._wantsRun = false; this._syncRunning(); }

    /** 'neutral' | 'happy' — por ejemplo al pasar por un botón */
    setMood(mood) { this.mood = mood; }

    /** Saluda con la mano (ignora clics mientras ya está saludando) */
    wave() {
      if (this.waveT >= 0 && this.waveT < CONFIG.waveDuration * 0.7) return;
      this.waveT = 0;
      this.state.nextBlink = 0;
    }

    dispose() {
      this.stop();
      global.removeEventListener('pointermove', this._onPointerMove);
      global.removeEventListener('pointerdown', this._onPointerMove);
      this.canvas.removeEventListener('click', this._onClick);
      document.removeEventListener('visibilitychange', this._onVisibility);
      this._resizeObserver.disconnect();
      this._io.disconnect();
      this.scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) o.material.dispose();
      });
      if (this.envTarget) this.envTarget.dispose();
      this.renderer.dispose();
    }

    /* ----------------------------------------------------------------------
       Bucle
       ---------------------------------------------------------------------- */
    _syncRunning() {
      const shouldRun = this._wantsRun && this._visible && !document.hidden;
      if (shouldRun && !this._running) {
        this._running = true;
        this._clock.start();
        requestAnimationFrame(this._tick);
      } else if (!shouldRun && this._running) {
        this._running = false;
        this._clock.stop();
      }
    }

    _tick() {
      if (!this._running) return;
      const dt = Math.min(this._clock.getDelta(), 1 / 20); // sin saltos tras una pausa
      this._elapsed += dt;
      this._update(dt, this._elapsed);
      this._render();
      requestAnimationFrame(this._tick);
    }

    _render() {
      this.camera.lookAt(this.cameraLookAt);
      this.renderer.render(this.scene, this.camera);
    }

    /* ----------------------------------------------------------------------
       Lógica por frame
       ---------------------------------------------------------------------- */
    _update(dt, t) {
      const s = this.state;
      const motion = this.reducedMotion ? 0 : 1;

      /* 1 · Intro: el robot "se enciende" durante el primer segundo y medio */
      s.intro = Math.min(1, s.intro + dt / 1.5);
      const intro = 1 - Math.pow(1 - s.intro, 3);

      /* 2 · Saludo: envolvente 0 → 1 → 0 durante waveDuration */
      let waveEnv = 0;
      if (this.waveT >= 0) {
        this.waveT += dt;
        const p = this.waveT / CONFIG.waveDuration;
        waveEnv = smooth(0, 0.16, p) * (1 - smooth(0.82, 1, p));
        if (p >= 1) this.waveT = -1;
      }

      /* 3 · Objetivo de la mirada */
      const idle = t - this.lastPointerAt > CONFIG.idleAfter;
      if (waveEnv > 0.05) {
        // Mientras saluda, mira al frente (al visitante)
        this._rawTarget.set(0, 2.5, CONFIG.lookPlaneZ);
      } else if (idle) {
        this._rawTarget.set(Math.sin(t * 0.45) * 1.8, 2.5 + Math.sin(t * 0.73) * 0.6, CONFIG.lookPlaneZ);
      } else {
        this._raycaster.setFromCamera(this.pointerNdc, this.camera);
        this._raycaster.ray.intersectPlane(this._lookPlane, this._rawTarget);
      }
      const targetLambda = idle ? 1.5 : 40;
      this._smoothTarget.x = damp(this._smoothTarget.x, this._rawTarget.x, targetLambda, dt);
      this._smoothTarget.y = damp(this._smoothTarget.y, this._rawTarget.y, targetLambda, dt);
      this._smoothTarget.z = this._rawTarget.z;

      /* 4 · Ángulos deseados desde la cabeza hasta el objetivo */
      this.head.getWorldPosition(this._headWorld);
      this._headWorld.y += 0.56;
      const dx = this._smoothTarget.x - this._headWorld.x;
      const dy = this._smoothTarget.y - this._headWorld.y;
      const dz = this._smoothTarget.z - this._headWorld.z;
      const yaw = clamp(Math.atan2(dx, dz), -CONFIG.yawLimit, CONFIG.yawLimit);
      const pitch = clamp(Math.atan2(dy, Math.hypot(dx, dz)), -CONFIG.pitchLimit, CONFIG.pitchLimit);

      /* 5 · Cuerpo → cabeza → ojos, cada uno a su velocidad */
      const prevYaw = s.headYaw;
      s.bodyYaw = damp(s.bodyYaw, yaw * CONFIG.bodyFollow, CONFIG.dampBody, dt);
      s.headYaw = damp(s.headYaw, yaw, CONFIG.dampHead, dt);
      s.headPitch = damp(s.headPitch, pitch, CONFIG.dampHead, dt);
      const yawVel = (s.headYaw - prevYaw) / Math.max(dt, 1e-4);
      // Inclinación lateral por la velocidad de giro + ladeo simpático al saludar
      // (hacia el lado contrario al brazo que saluda, para dejarle sitio)
      s.headRoll = damp(s.headRoll, clamp(-yawVel * 0.06, -0.18, 0.18) + waveEnv * 0.14, 6, dt);

      const leadX = (yaw - s.headYaw) * 0.35 + yaw * 0.05;
      const leadY = (pitch - s.headPitch) * 0.3 + pitch * 0.05;
      s.eyeX = damp(s.eyeX, clamp(leadX, -0.14, 0.14), CONFIG.dampEyes, dt);
      s.eyeY = damp(s.eyeY, clamp(leadY, -0.07, 0.07), CONFIG.dampEyes, dt);

      this.torso.rotation.y = s.bodyYaw;
      this.head.rotation.set(-s.headPitch, s.headYaw, s.headRoll);
      this.eyes.position.x = s.eyeX;
      this.eyes.position.y = 0.57 + s.eyeY;

      /* 6 · Parpadeo + ojos sonrientes (humor o saludo) */
      s.nextBlink -= dt;
      if (s.nextBlink <= 0) { s.blink = 0; s.nextBlink = 2.2 + Math.random() * 3.8; }
      s.blink = Math.min(1, s.blink + dt / 0.16);
      const blinkScale = 1 - Math.sin(s.blink * Math.PI) * 0.92;
      const happy = this.mood === 'happy' || waveEnv > 0.2;
      s.squint = damp(s.squint, happy ? 0.45 : 1, 10, dt);
      const eyeScaleY = Math.max(0.06, blinkScale * s.squint) * intro;
      this.eyeMeshes.forEach((eye) => eye.scale.set(1, eyeScaleY, 1));

      this._tmpColor.setHex(CONFIG.accent).lerp(this._happyColor, ((1 - s.squint) / 0.55) * 0.8);
      this.materials.glow.color.copy(this._tmpColor);
      this.glowSprites.forEach((g) => g.material.color.copy(this._tmpColor));
      this.accentLight.color.copy(this._tmpColor);

      /* 7 · Flotación + saltito al empezar a saludar */
      const bob = Math.sin(t * 1.6) * 0.06 * motion;
      const hop = this.waveT >= 0 ? Math.sin(clamp(this.waveT / 0.45, 0, 1) * Math.PI) * 0.12 : 0;
      this.robot.position.y = bob + hop - (1 - intro) * 0.6;
      this.robot.scale.setScalar(0.85 + intro * 0.15);

      /* 8 · Brazos: balanceo en reposo; el derecho (del visitante) saluda */
      this.arms.forEach((arm) => {
        const { side, elbow } = arm.userData;
        const sway = Math.sin(t * 1.6 + side) * 0.05 * motion;
        const waving = side > 0 ? waveEnv : 0;
        // El brazo sube hacia fuera y el antebrazo oscila entre "hacia fuera" y
        // "vertical", sin pasar nunca hacia la cabeza
        arm.rotation.z = side * (0.14 + sway) + waving * 2.1;
        arm.rotation.x = -s.bodyYaw * side * 0.3 - waving * 0.35;
        elbow.rotation.z = side * 0.08 + waving * (0.42 + Math.sin(this.waveT * 11) * 0.32);
      });

      /* 9 · Pulsos luminosos */
      const pulse = 0.75 + Math.sin(t * 2.4) * 0.25;
      this.coreGlow.material.opacity = 0.45 + pulse * 0.35 + waveEnv * 0.4;
      this.antennaGlow.material.opacity = 0.5 + Math.sin(t * 3.1) * 0.3 + waveEnv * 0.5;
      this.ring.scale.setScalar(1 + Math.sin(t * 2) * 0.04);

      const lift = this.robot.position.y;
      this.shadow.scale.setScalar(1 - lift * 0.6);
      this.shadow.material.opacity = clamp(0.8 - lift * 1.2, 0.2, 0.9) * intro;

      /* 10 · Luz de acento: sigue al objetivo, más intensa con movimiento rápido */
      this.pointerSpeed = damp(this.pointerSpeed, 0, 3, dt);
      this.accentLight.position.set(this._smoothTarget.x, this._smoothTarget.y, 1.6);
      this.accentLight.intensity = (0.6 + this.pointerSpeed * 1.6 + waveEnv * 1.2) * intro;

      /* 11 · Parallax sutil de cámara y deriva del polvo */
      const px = clamp(this.pointerNdc.x, -1, 1);
      const py = clamp(this.pointerNdc.y, -1, 1);
      this.camera.position.x = damp(this.camera.position.x, px * 0.35 * motion, 2, dt);
      this.camera.position.y = damp(this.camera.position.y, this.cameraBase.y + py * 0.2 * motion, 2, dt);
      this.dust.rotation.y += dt * 0.012 * motion;
      this.dust.position.y = Math.sin(t * 0.2) * 0.15 * motion;
    }
  }

  global.RobotScene = RobotScene;
})(window);
