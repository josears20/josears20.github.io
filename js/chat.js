(function (global) {
  'use strict';

  const data = global.PORTFOLIO_DATA;
  const root = document.querySelector('[data-chat]');
  if (!root || !data) return;

  const panel = root.querySelector('.chat__panel');
  const log = root.querySelector('.chat__log');
  const suggest = root.querySelector('.chat__suggest');
  const form = root.querySelector('.chat__form');
  const input = root.querySelector('.chat__input');
  const fab = root.querySelector('.chat__fab');

  const GMAIL = `https://mail.google.com/mail/?view=cm&fs=1&to=${data.profile.email}`;
  const norm = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9#+.\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const list = (items) => items.length > 1 ? `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}` : items.join('');
  const project = (id) => data.projects.find((p) => p.id === id);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const lower = (s) => s.charAt(0).toLowerCase() + s.slice(1);

  const NAMES = new Set(['jose', 'antonio', 'cuerda', 'aparicio', 'jose antonio', 'el', 'la', 'los', 'las', 'de', 'del', 'que', 'y', 'a', 'en', 'un', 'una', 'su', 'sus', 'es', 'me', 'te', 'le', 'lo', 'por', 'para', 'con', 'al', 'o', 'tu', 'mi']);

  const LANGS = 'Su lengua materna es el <strong>castellano</strong>, tiene el <strong>B2 de valenciano</strong> certificado y un nivel <strong>B1 de inglés</strong>, aunque este último no lo tiene certificado.';

  // cosas que la gente pregunta mucho aunque no las uso
  const NOT_IN_STACK = {
    vue: 'Vue no es una de sus herramientas habituales, pero trabaja con React y Angular, que se parecen bastante.',
    svelte: 'Svelte no lo ha usado en proyectos, pero se mueve bien con React y Angular.',
    typescript: 'No lo tiene como lenguaje aparte, pero lo usa al trabajar con Angular, que funciona con TypeScript.',
    laravel: 'Laravel no lo ha usado en proyectos, aunque sí programa en PHP, sobre todo con WordPress.',
    django: 'Django no aparece en su stack, aunque sí conoce Python.',
    flutter: 'Flutter no lo ha usado. Para móvil trabaja con Android y Kotlin, Ionic y React Native.',
    swift: 'No ha hecho apps para iPhone con Swift. Para móvil usa Android y Kotlin, Ionic y React Native.',
    aws: 'No tiene experiencia destacada con AWS, pero el máster que ha hecho incluía computación en la nube y usa Docker y Kubernetes.',
    azure: 'Azure no aparece en su stack, aunque en el máster trabajó la computación en la nube y usa Docker y Kubernetes.',
    unreal: 'Unreal no lo ha usado. Para 3D trabaja con Unity, Three.js y Blender.',
    photoshop: 'Para diseño usa sobre todo Figma y Canva, y para vídeo CapCut.',
    illustrator: 'Para diseño usa sobre todo Figma y Canva.',
    premiere: 'Para editar vídeo usa CapCut.',
  };

  const PROJECT_ALIASES = [
    ['orbitaly', ['orbitaly', 'biblioteca social']],
    ['ds4m-web', ['portal', 'web oficial', 'ds4m web', 'web de ds4m', 'pagina de ds4m']],
    ['escola', ['escola', 'colegio', 'colegios', 'ninos']],
    ['spot-datae-valor', ['anuncio', 'anuncios', 'spot', 'netflix', 'prime', 'spotify']],
    ['datae-valor', ['datae', 'dataevalor', 'campana', 'marquesina', 'marquesinas', 'cartel', 'carteles']],
    ['drink-shot', ['drink', 'shot', 'drinkshot', 'juego de fiesta', 'google play']],
    ['vialgo', ['vialgo', 'tfg', 'conducir', 'conduccion', 'educacion vial', 'fin de grado']],
    ['ds4m-branding', ['branding', 'camiseta', 'camisetas', 'photocall', 'triptico', 'merchandising']],
    ['playversex', ['playversex', 'tfm', 'recomendador', 'fin de master']],
    ['hackathon-video', ['hackathon', 'hackaton', 'las naves']],
    ['miracle', ['miracle', 'cirugia', 'laparoscopia', 'laparoscopica', 'quirurgico', 'quirurgicos', 'medico']],
    ['intras-30', ['aniversario', '30 anos']],
    ['portfolio', ['portfolio', 'esta web', 'esta pagina']],
  ];

  const INTENTS = [
    {
      id: 'saludo', stems: ['hola', 'buenas', 'hey', 'saludo', 'buenos dias', 'buenas tardes', 'que tal'], weight: 0.4,
      answers: [
        () => ({ text: '¡Hola! ¿Qué te gustaría saber de Jose? Puedo hablarte de dónde ha trabajado, de sus proyectos o de cómo contactar con él.' }),
        () => ({ text: '¡Hola de nuevo! Pregúntame lo que quieras sobre Jose.' }),
      ],
    },
    {
      id: 'quien', stems: ['quien', 'presenta', 'sobre el', 'perfil', 'resumen', 'cuentame de', 'hablame de', 'conocer'],
      answers: [
        () => ({
          text: 'Jose es <strong>Ingeniero Multimedia</strong> por la Universitat de València y ha hecho el Máster en Tecnologías Web (TWCAM). Desde 2024 trabaja en dos institutos de investigación de la UV, el IRTIC y el INTRAS, haciendo webs, aplicaciones en 3D y diseño. Vive en Valencia.',
          actions: [{ label: 'Ver experiencia', href: '#experiencia' }, { label: 'Ver proyectos', href: '#proyectos' }],
        }),
        () => ({
          text: 'Lo que hace a Jose un poco diferente es que no se queda solo en el código: también diseña y edita vídeo. Por ejemplo, en DS4M Mediterráneo trabajó en la web y además participó en el diseño de la campaña que acabó en marquesinas de toda España y en anuncios de Netflix y Prime Video.',
          actions: [{ label: 'Ver la campaña', project: 'datae-valor' }],
        }),
      ],
    },
    {
      id: 'experiencia', stems: ['experiencia', 'trabajad', 'trabaja', 'empresa', 'puesto', 'laboral', 'practica', 'empleo', 'donde ha', 'curro', 'currado', 'cargo', 'anos lleva', 'cuanto tiempo'],
      answers: [
        () => ({
          text: 'Lleva más de dos años trabajando en la Universitat de València:<br>· <strong>IRTIC</strong> (nov 2025 – ago 2026): desarrollador en MIRACLE y DS4M Mediterráneo.<br>· <strong>INTRAS</strong> (sep 2024 – sep 2025): prácticas extracurriculares haciendo webs.<br>· <strong>INTRAS</strong> (mar – jul 2024): prácticas curriculares con Unity para ESCOLA.',
          actions: [{ label: 'Ir a Experiencia', href: '#experiencia' }],
        }),
        () => ({
          text: 'En todos sus trabajos ha mezclado programación y diseño. En el IRTIC, por ejemplo, programaba el software de MIRACLE y, a la vez, participaba en el diseño de la campaña Datæ Valor. Si quieres, pregúntame por el IRTIC o por el INTRAS y te cuento más de cada uno.',
        }),
      ],
    },
    {
      id: 'irtic', stems: ['irtic'],
      answers: [
        () => ({
          text: 'En el <strong>IRTIC</strong> (nov 2025 – ago 2026) trabajó como desarrollador. Programó parte del software de <strong>MIRACLE</strong>, un proyecto de IA para operaciones con robots quirúrgicos, hizo desarrollo web para <strong>DS4M Mediterráneo</strong> y participó en el diseño de la campaña <strong>Datæ Valor</strong>.',
          actions: [{ label: 'Ver MIRACLE', project: 'miracle' }, { label: 'Ver Datæ Valor', project: 'datae-valor' }],
        }),
      ],
    },
    {
      id: 'intras', stems: ['intras'],
      answers: [
        () => ({
          text: 'En el <strong>INTRAS</strong> estuvo de 2024 a 2025. Primero hizo prácticas con Unity y C# para <strong>ESCOLA</strong>, un proyecto sobre seguridad vial cerca de los colegios. Después siguió con webs para <strong>DS4M Mediterráneo</strong>, una plataforma para ESCOLA y la animación del logo del 30 aniversario del instituto.',
          actions: [{ label: 'Ver ESCOLA', project: 'escola' }, { label: 'Ver 30 aniversario', project: 'intras-30' }],
        }),
      ],
    },
    {
      id: 'formacion', stems: ['estudi', 'formacion', 'carrera', 'grado', 'master', 'universidad', 'titul', 'twcam', 'bachiller', 'uni'],
      answers: [
        () => ({
          text: 'Estudió el <strong>Grado en Ingeniería Multimedia</strong> (2020–2025) y el <strong>Máster en Tecnologías Web, Computación en la Nube y Aplicaciones Móviles</strong> (2025–2026), los dos en la Universitat de València.',
          actions: [{ label: 'Ir a Formación', href: '#formacion' }],
        }),
        () => ({
          text: 'Su TFG fue <strong>VialGo</strong>, una app en 3D para aprender a conducir, y su TFM fue <strong>PlayVerseX</strong>, una web que recomienda videojuegos. Antes de la universidad hizo el Bachillerato Científico en las Salesianas de Valencia.',
          actions: [{ label: 'Ver VialGo', project: 'vialgo' }, { label: 'Ver PlayVerseX', project: 'playversex' }],
        }),
      ],
    },
    {
      id: 'stack', stems: ['tecnolog', 'lenguaje', 'stack', 'programa en', 'herramienta', 'domina', 'conocimiento', 'habilidad', 'skill', 'sabe hacer', 'que sabe', 'frameworks'],
      answers: [
        () => ({
          text: 'Lo que más usa es <strong>JavaScript</strong> (con React, Angular y Node.js), <strong>PHP</strong> con WordPress y <strong>C#</strong> con Unity. Para bases de datos, MongoDB, MySQL y PostgreSQL. ¿Te interesa alguna en concreto? Pregúntame por ella.',
          actions: [{ label: 'Ver stack completo', href: '#stack' }],
        }),
        () => ({
          text: `En total trabaja con ${data.stack.reduce((n, g) => n + g.items.length, 0)} herramientas. Aparte de la web: ${list(data.stack.slice(1).map((g) => `${/^Microsoft/.test(g.group) ? g.group : lower(g.group)} (${g.items.slice(0, 3).join(', ')})`))}.`,
          actions: [{ label: 'Ver stack completo', href: '#stack' }],
        }),
      ],
    },
    {
      id: 'proyectos', stems: ['proyecto', 'hecho', 'trabajos', 'destaca', 'mejor', 'portfolio', 'ensena', 'ejemplo'],
      answers: [
        () => ({
          text: `Tiene ${data.projects.length} proyectos en la web. Si tuviera que elegir tres: <strong>Orbitaly</strong>, una web para guardar todo lo que ves, juegas y lees; la <strong>campaña Datæ Valor</strong>, que acabó en marquesinas y en Netflix; y <strong>VialGo</strong>, su app 3D para aprender a conducir.`,
          actions: [{ label: 'Orbitaly', project: 'orbitaly' }, { label: 'Datæ Valor', project: 'datae-valor' }, { label: 'VialGo', project: 'vialgo' }],
        }),
        () => ({
          text: 'Otros que merecen la pena: <strong>PlayVerseX</strong> (su TFM, un recomendador de videojuegos), <strong>Drink Shot</strong> (un juego de fiesta publicado en Google Play) y <strong>MIRACLE</strong> (IA para cirugía con robots).',
          actions: [{ label: 'PlayVerseX', project: 'playversex' }, { label: 'Drink Shot', project: 'drink-shot' }, { label: 'Ver todos', href: '#proyectos' }],
        }),
      ],
    },
    {
      id: 'contacto', stems: ['contact', 'email', 'correo', 'mail', 'linkedin', 'hablar con', 'escribir', 'telefono', 'llamar', 'localizar'],
      answers: [
        () => ({
          text: `Lo más rápido es escribirle a <strong>${data.profile.email}</strong>. También puedes hablarle por LinkedIn.`,
          actions: [{ label: 'Escribir desde Gmail', url: GMAIL }, { label: 'LinkedIn', url: data.profile.linkedin }],
        }),
      ],
    },
    {
      id: 'disponible', stems: ['disponib', 'contratar', 'contrato', 'freelance', 'busca', 'incorpor', 'oferta', 'vacante', 'libre', 'empezar'],
      answers: [
        () => ({
          text: 'Sí, ahora mismo está <strong>buscando trabajo y nuevos proyectos</strong>, sobre todo en desarrollo web, 3D o diseño. Lo mejor es escribirle y contarle qué tienes en mente.',
          actions: [{ label: 'Escribirle', url: GMAIL }, { label: 'Descargar CV', url: data.profile.cv }],
        }),
      ],
    },
    {
      id: 'remoto', weight: 1.5, stems: ['remoto', 'teletrabajo', 'presencial', 'hibrido', 'mudarse', 'mudaria', 'fuera de valencia', 'extranjero', 'viajar'],
      answers: [
        () => ({
          text: 'Vive en Valencia. Sobre si prefiere remoto, presencial o híbrido, o si se movería a otra ciudad, mejor que te lo cuente él directamente.',
          actions: [{ label: 'Preguntarle', url: GMAIL }],
        }),
      ],
    },
    {
      id: 'idiomas', stems: ['idioma', 'ingles', 'valenciano', 'catalan', 'castellano', 'espanol', 'english', 'habla'],
      answers: [() => ({ text: LANGS })],
    },
    {
      id: 'ubicacion', stems: ['donde vive', 'ubicacion', 'ciudad', 'vive', 'valencia', 'pais', 'de donde', 'localizacion'],
      answers: [() => ({ text: 'Vive en <strong>Valencia</strong>, en España.' })],
    },
    {
      id: 'prensa', stems: ['prensa', 'medios', 'noticia', 'periodico', 'articulo', 'famoso', 'salido en', 'salio en', 'aparecido', 'television', 'tele', 'tv'],
      answers: [
        () => ({
          text: `Sí. La campaña <strong>Datæ Valor</strong>, en cuyo diseño participó, salió en ${list(data.press.slice(0, 3).map((a) => a.outlet))}, entre otros medios. Además, sus anuncios se emitieron en televisión, Netflix, Prime Video y Spotify.`,
          actions: [{ label: 'Ir a Prensa', href: '#prensa' }, { label: 'Ver los anuncios', project: 'spot-datae-valor' }],
        }),
      ],
    },
    {
      id: 'logos', stems: ['logo', 'logotipo', 'vector', 'identidad', 'figma'], weight: 1.5,
      answers: [
        () => ({
          text: 'Sí, diseña logos en <strong>Figma</strong>, siempre en vectorial. Participó en el logo de <strong>DS4M Mediterráneo</strong> y ha hecho el del <strong>INTRAS</strong> y el del <strong>30 aniversario del INTRAS</strong>, cada uno con versiones para fondo claro y oscuro.',
          actions: [{ label: 'Ver los logos', href: '#logos' }],
        }),
      ],
    },
    {
      id: 'diseno', stems: ['diseno', 'disena', 'grafico', 'creativ', 'artistic', 'visual'],
      answers: [
        () => ({
          text: 'Sí, diseña bastante. Lo más conocido es la campaña <strong>Datæ Valor</strong>, en la que participó en el diseño, pero también ha trabajado en los logos de DS4M Mediterráneo y del INTRAS, en más de 30 diseños para DS4M (camisetas, photocall, trípticos, carteles) y el logo animado del 30 aniversario del INTRAS.',
          actions: [{ label: 'Ver Datæ Valor', project: 'datae-valor' }, { label: 'Ver los logos', href: '#logos' }],
        }),
      ],
    },
    {
      id: 'video', stems: ['video', 'edicion', 'edita', 'editar', 'montaje', 'capcut', 'youtube'],
      answers: [
        () => ({
          text: 'Edita vídeo con CapCut. Participó en la edición del anuncio de Datæ Valor, que salió en televisión y plataformas, y por su cuenta montó un vídeo del Hackathon Data Spaces que no llegó a publicarse en ningún canal oficial.',
          actions: [{ label: 'Ver anuncios', project: 'spot-datae-valor' }, { label: 'Vídeo del hackathon', project: 'hackathon-video' }],
        }),
      ],
    },
    {
      id: 'tresd', stems: ['3d', 'unity', 'videojuego', 'juego', 'simulacion', 'blender', 'three'],
      answers: [
        () => ({
          text: 'Sí. Ha hecho <strong>VialGo</strong>, una app en Unity para aprender a conducir, aplicaciones en 3D para el proyecto <strong>ESCOLA</strong> y el robot que ves al principio de esta web, con Three.js.',
          actions: [{ label: 'Ver VialGo', project: 'vialgo' }, { label: 'Ver ESCOLA', project: 'escola' }],
        }),
      ],
    },
    {
      id: 'movil', stems: ['movil', 'android', 'app', 'apps', 'aplicacion movil', 'kotlin', 'ios', 'iphone'],
      answers: [
        () => ({
          text: 'Sí, hace apps móviles. Tiene <strong>Drink Shot</strong> publicada en Google Play y trabaja con Android y Kotlin, Ionic y React Native.',
          actions: [{ label: 'Ver Drink Shot', project: 'drink-shot' }],
        }),
      ],
    },
    {
      id: 'ia', stems: ['ia', 'inteligencia artificial', 'chatgpt', 'gpt', 'claude', 'prompt', 'machine learning'],
      answers: [
        () => ({
          text: 'Usa la IA a diario como herramienta de trabajo. En <strong>MIRACLE</strong> la usó para automatizar tareas y en <strong>Orbitaly</strong> hizo un asistente con IA que te recomienda películas, juegos o libros y los añade a tu biblioteca.',
          actions: [{ label: 'Ver MIRACLE', project: 'miracle' }, { label: 'Ver Orbitaly', project: 'orbitaly' }],
        }),
      ],
    },
    {
      id: 'fuerte', stems: ['por que', 'contratarle', 'fuerte', 'virtud', 'diferencia', 'aporta', 'cualidad', 'valor', 'bueno en', 'destaca en'],
      answers: [
        () => ({
          text: 'Su punto fuerte es que sabe hacer cosas muy distintas: programa la web, la diseña y, si hace falta, edita el vídeo. Así entiende bien lo que necesita cada parte del equipo.',
          actions: [{ label: 'Ver proyectos', href: '#proyectos' }],
        }),
        () => ({
          text: 'También tiene experiencia real trabajando en equipo por sprints (Scrum) en proyectos de investigación europeos, y ha trabajado en cosas que han llegado a mucha gente, como una app en Google Play o una campaña que se vio en toda España.',
        }),
      ],
    },
    {
      id: 'equipo', stems: ['equipo', 'scrum', 'metodolog', 'agil', 'como trabaja', 'forma de trabajar', 'git'],
      answers: [
        () => ({ text: 'Está acostumbrado a trabajar en equipo por sprints con <strong>Scrum</strong>, como hizo en DS4M Mediterráneo, y usa Git, GitHub y GitLab para el código. También usa la IA como ayuda en el día a día.' }),
      ],
    },
    {
      id: 'cv', stems: ['cv', 'curriculum', 'curriculo', 'resume', 'descargar', 'pdf'],
      answers: [() => ({ text: 'Aquí tienes su CV en PDF.', actions: [{ label: 'Descargar CV', url: data.profile.cv }] })],
    },
    {
      id: 'github', stems: ['github', 'codigo fuente', 'repositorio', 'repo'],
      answers: [
        () => ({
          text: data.profile.github
            ? 'Aquí tienes su GitHub.'
            : 'Su GitHub todavía no está enlazado en la web. Si quieres ver código, escríbele y te lo enseña.',
          actions: data.profile.github ? [{ label: 'Abrir GitHub', url: data.profile.github }] : [{ label: 'Escribirle', url: GMAIL }],
        }),
      ],
    },
    {
      id: 'robot', stems: ['robot', 'como hiciste', 'como esta hecha', 'como se hizo', 'esta web', 'esta pagina'],
      answers: [
        () => ({
          text: 'Esta web la ha hecho Jose desde cero con HTML, CSS y JavaScript. El robot está hecho con Three.js, todo con código. Haz clic en él y te saluda.',
          actions: [{ label: 'Ir al robot', href: '#inicio' }],
        }),
      ],
    },
    {
      id: 'personal', stems: ['edad', 'anos tiene', 'cuantos anos', 'hobby', 'hobbies', 'aficion', 'tiempo libre', 'gusta hacer', 'novia', 'pareja', 'sueldo', 'salario', 'cobra', 'dinero'],
      answers: [
        () => ({
          text: 'Eso no lo sé, solo sé lo que aparece en su portfolio. Si te interesa, pregúntaselo directamente a él.',
          actions: [{ label: 'Escribirle', url: GMAIL }],
        }),
      ],
    },
    {
      id: 'gracias', stems: ['gracias', 'genial', 'perfecto', 'vale', 'ok', 'guay', 'top', 'buenisimo'], weight: 0.4,
      answers: [
        () => ({ text: '¡De nada! Si quieres saber algo más, aquí estoy.' }),
        () => ({ text: '¡A ti! ¿Algo más que quieras saber?' }),
      ],
    },
    {
      id: 'adios', stems: ['adios', 'chao', 'hasta luego', 'nos vemos', 'bye'], weight: 0.4,
      answers: [() => ({ text: '¡Hasta luego! Si al final te animas a escribirle, su correo es ' + data.profile.email + '.' })],
    },
  ];

  const SUGGESTIONS = [
    ['¿Quién es Jose?', 'quien'],
    ['¿Dónde ha trabajado?', 'experiencia'],
    ['¿Qué proyectos destacarías?', 'proyectos'],
    ['¿Qué tecnologías usa?', 'stack'],
    ['¿Ha salido en televisión?', 'prensa'],
    ['¿Qué ha estudiado?', 'formacion'],
    ['¿Diseña y edita vídeo?', 'diseno'],
    ['¿Qué idiomas habla?', 'idiomas'],
    ['¿Está buscando trabajo?', 'disponible'],
    ['¿Cómo le contacto?', 'contacto'],
  ];
  const SHOWN = 4;
  const usedIntents = new Set();

  const asked = new Map();
  let lastProject = null;

  let lastIntent = null;

  function nextAnswer(intent) {
    lastIntent = intent;
    const n = asked.get(intent.id) || 0;
    asked.set(intent.id, n + 1);
    if (n < intent.answers.length) return intent.answers[n]();
    const { actions } = intent.answers[0]();
    const left = SUGGESTIONS.filter(([, id]) => !usedIntents.has(id)).slice(0, 2).map(([l]) => `«${l}»`);
    return {
      text: pick(['Sobre eso ya te he contado lo que sé.', 'Eso ya te lo he contado más arriba.', 'De eso no sé mucho más de lo que te he dicho.']) +
        (left.length ? ` Si quieres, pregúntame ${list(left)}.` : ''),
      actions,
    };
  }

  function tokens(q) {
    return q.split(' ').filter((w) => w && !NAMES.has(w));
  }

  function hits(q, words, stem) {
    if (stem.includes(' ')) return q.includes(stem);
    if (stem.length <= 3) return words.includes(stem);
    return words.some((w) => w.startsWith(stem));
  }

  function bestIntent(q, words) {
    let best = null, score = 0;
    for (const intent of INTENTS) {
      let s = 0;
      for (const stem of intent.stems) if (hits(q, words, stem)) s += stem.split(' ').length;
      s *= intent.weight || 1;
      if (s > score) { score = s; best = intent; }
    }
    return { intent: best, score };
  }

  function findProject(q, words) {
    for (const [id, aliases] of PROJECT_ALIASES) {
      if (aliases.some((a) => (a.includes(' ') ? q.includes(a) : words.includes(a)))) return project(id);
    }
    return null;
  }

  const TECH_ALIASES = { node: 'Node.js', nodejs: 'Node.js', js: 'JavaScript', html: 'HTML5/CSS3', css: 'HTML5/CSS3', postgres: 'PostgreSQL', sql: 'MySQL', mongo: 'MongoDB', wordpress: 'WordPress', wp: 'WordPress', k8s: 'Kubernetes', csharp: 'C#' };

  const techVariants = (item) => {
    const n = norm(item);
    return [n, ...n.split('/'), n.split(' ')[0], n.replace(/\./g, '')].map((v) => v.trim()).filter((v) => v.length > 1);
  };
  const hasWord = (text, w) => ` ${text} `.includes(` ${w} `);

  function findTech(q) {
    for (const g of data.stack) {
      for (const item of g.items) {
        if (techVariants(item).some((k) => hasWord(q, k))) return { item, group: g.group };
      }
    }
    for (const [alias, item] of Object.entries(TECH_ALIASES)) {
      if (hasWord(q, alias)) {
        const g = data.stack.find((x) => x.items.includes(item));
        if (g) return { item, group: g.group };
      }
    }
    for (const k of Object.keys(NOT_IN_STACK)) if (hasWord(q, k)) return { missing: k };
    return null;
  }

  function techAnswer(t) {
    if (t.missing) return { text: NOT_IN_STACK[t.missing], actions: [{ label: 'Ver su stack', href: '#stack' }] };
    const variants = techVariants(t.item);
    const used = data.projects.filter((p) => p.stack.some((s) => variants.some((k) => hasWord(norm(s), k))));
    const where = used.length
      ? ` Lo ha usado en ${list(used.slice(0, 3).map((p) => `<strong>${esc(p.title)}</strong>`))}.`
      : ` Forma parte de lo que usa en ${lower(t.group)}.`;
    return {
      text: `Sí, trabaja con <strong>${esc(t.item)}</strong>.${where}`,
      actions: used.slice(0, 2).map((p) => ({ label: p.title, project: p.id })).concat([{ label: 'Ver stack', href: '#stack' }]),
    };
  }

  function projectAnswer(p, focus) {
    lastProject = p;
    const key = `p:${p.id}`;
    const n = asked.get(key) || 0;
    asked.set(key, n + 1);
    const open = { label: 'Abrir proyecto', project: p.id };
    const ext = p.links.filter((l) => /^https?:/.test(l.url)).slice(0, 1).map((l) => ({ label: l.label, url: l.url }));

    if (focus === 'stack') {
      return { text: `En <strong>${esc(p.title)}</strong> usó ${list(p.stack.map(esc))}.`, actions: [open] };
    }
    const steps = [
      () => ({ text: `<strong>${esc(p.title)}</strong>. ${esc(p.summary)}`, actions: [open, ...ext] }),
      () => ({ text: `${pick(['Jose lo cuenta así', 'En sus palabras', 'Te lo cuenta él'])}: «${esc(p.description[p.description.length > 1 ? 1 : 0])}»`, actions: [open] }),
      () => ({ text: `Más cosas de <strong>${esc(p.title)}</strong>: ${list(p.highlights.slice(1, 4).map((h) => esc(lower(h))))}. Para hacerlo usó ${list(p.stack.slice(0, 4).map(esc))}.`, actions: [open, ...ext] }),
      () => ({ text: `Eso es todo lo que te puedo contar de <strong>${esc(p.title)}</strong>. Si lo abres verás fotos${(p.videos || p.video) ? ' y vídeos' : ''} y más detalles.`, actions: [open] }),
    ];
    return steps[Math.min(n, steps.length - 1)]();
  }

  const FOLLOW_UP = ['mas', 'eso', 'ese', 'esa', 'ahi', 'alli', 'detalles', 'sigue', 'continua', 'y que', 'que mas', 'como lo'];

  function reply(raw) {
    const q = norm(raw);
    const words = tokens(q);
    const { intent, score } = bestIntent(q, words);
    const proj = findProject(q, words);
    const tech = findTech(q);

    if (proj && !(intent && ['contacto', 'cv', 'disponible'].includes(intent.id) && score >= 1)) {
      return projectAnswer(proj, intent && intent.id === 'stack' ? 'stack' : null);
    }
    if (tech && (!intent || ['stack', 'proyectos', 'tresd', 'movil', 'equipo', 'experiencia', 'saludo', 'diseno', 'video'].includes(intent.id))) {
      return techAnswer(tech);
    }
    const followUp = FOLLOW_UP.some((f) => (f.includes(' ') ? q.includes(f) : words.includes(f)));
    if (followUp && (!intent || score < 1)) {
      if (lastProject) return projectAnswer(lastProject);
      if (lastIntent) return nextAnswer(lastIntent);
    }
    if (lastProject && intent && intent.id === 'stack' && /\b(uso|usaste|utilizo|hizo|hecho)\b/.test(q)) {
      return projectAnswer(lastProject, 'stack');
    }
    if (intent && score > 0) {
      usedIntents.add(intent.id);
      return nextAnswer(intent);
    }
    const left = SUGGESTIONS.filter(([, id]) => !usedIntents.has(id)).slice(0, 2).map(([l]) => `«${l}»`);
    return {
      text: pick([
        'No estoy seguro de haberte entendido. Solo sé cosas sobre Jose y su trabajo.',
        'Uy, eso no lo sé. Puedo contarte cosas sobre la experiencia, los proyectos o los estudios de Jose.',
        'Ahí no te puedo ayudar, solo respondo sobre Jose.',
      ]) + (left.length ? ` Prueba con ${list(left)}.` : ''),
    };
  }

  function addMessage(who, html, actions = []) {
    const msg = document.createElement('div');
    msg.className = `chat__msg chat__msg--${who}`;
    msg.innerHTML = `<p>${html}</p>` + (actions.length ? `<div class="chat__actions">${actions.map((a, i) =>
      `<button type="button" class="chat__action" data-i="${i}">${esc(a.label)}${a.url ? ' ↗' : ''}</button>`).join('')}</div>` : '');
    msg.querySelectorAll('.chat__action').forEach((b) => b.addEventListener('click', () => runAction(actions[+b.dataset.i])));
    log.appendChild(msg);
    log.scrollTop = log.scrollHeight;
  }

  function runAction(a) {
    if (a.project && global.PortfolioUI.openProject) { setOpen(false); global.PortfolioUI.openProject(a.project); }
    else if (a.href) { setOpen(false); document.querySelector(a.href).scrollIntoView({ behavior: 'smooth' }); }
    else if (a.url) global.open(a.url, '_blank', 'noopener');
  }

  function renderSuggestions() {
    const pending = SUGGESTIONS.filter(([, id]) => !usedIntents.has(id)).slice(0, SHOWN);
    suggest.innerHTML = pending.map(([label, id]) => `<button type="button" class="chat__chip" data-s="${id}">${esc(label)}</button>`).join('');
  }

  function ask(text, intentId) {
    addMessage('user', esc(text));
    const typing = document.createElement('div');
    typing.className = 'chat__msg chat__msg--bot chat__typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    log.appendChild(typing); log.scrollTop = log.scrollHeight;
    let r;
    if (intentId) {
      usedIntents.add(intentId);
      r = nextAnswer(INTENTS.find((i) => i.id === intentId));
    } else {
      r = reply(text);
    }
    renderSuggestions();
    setTimeout(() => { typing.remove(); addMessage('bot', r.text, r.actions); }, 450 + Math.random() * 300);
  }

  renderSuggestions();
  suggest.addEventListener('click', (e) => {
    const b = e.target.closest('[data-s]');
    if (b) ask(b.textContent, b.dataset.s);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    ask(text);
  });

  let greeted = false;
  function setOpen(open) {
    panel.hidden = !open;
    root.classList.toggle('is-open', open);
    fab.setAttribute('aria-expanded', String(open));
    if (open && !greeted) {
      greeted = true;
      addMessage('bot', '¡Hola! 👋 Soy el asistente de la web de <strong>Jose</strong>. Pregúntame lo que quieras sobre él: dónde ha trabajado, qué proyectos ha hecho, qué sabe hacer o cómo contactarle.');
    }
    if (open) setTimeout(() => input.focus(), 50);
  }
  root.querySelectorAll('[data-chat-toggle]').forEach((b) => b.addEventListener('click', () => setOpen(panel.hidden)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { setOpen(false); fab.focus(); } });

  // para probarlo desde la consola: PortfolioChat.reply('¿sabe React?')
  global.PortfolioChat = { reply };
})(window);
