(function (global) {
  'use strict';

  const base = global.PORTFOLIO_DATA;
  const root = document.querySelector('[data-chat]');
  if (!root || !base) return;

  const panel = root.querySelector('.chat__panel');
  const log = root.querySelector('.chat__log');
  const suggest = root.querySelector('.chat__suggest');
  const form = root.querySelector('.chat__form');
  const input = root.querySelector('.chat__input');
  const fab = root.querySelector('.chat__fab');

  // los textos van en los dos idiomas: L('español', 'english')
  const isEn = () => global.I18N && global.I18N.lang === 'en';
  const L = (es, en) => (isEn() ? en : es);
  const data = () => (global.I18N ? global.I18N.data() : base);

  const GMAIL = `https://mail.google.com/mail/?view=cm&fs=1&to=${base.profile.email}`;
  const norm = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9#+.\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const list = (items) => items.length > 1 ? `${items.slice(0, -1).join(', ')} ${L('y', 'and')} ${items[items.length - 1]}` : items.join('');
  const quote = (s) => L(`«${s}»`, `“${s}”`);
  const project = (id) => data().projects.find((p) => p.id === id);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const lower = (s) => s.charAt(0).toLowerCase() + s.slice(1);

  const NAMES = new Set([
    'jose', 'antonio', 'cuerda', 'aparicio', 'jose antonio',
    'el', 'la', 'los', 'las', 'de', 'del', 'que', 'y', 'a', 'en', 'un', 'una', 'su', 'sus', 'es', 'me', 'te', 'le', 'lo', 'por', 'para', 'con', 'al', 'o', 'tu', 'mi',
    'the', 'is', 'an', 'of', 'to', 'he', 'his', 'him', 'does', 'do', 'did', 'you', 'your', 'i', 'my', 'and', 'or', 'for', 'with', 'on', 'at', 'has', 'have', 'be', 'are', 'was',
  ]);

  const LANGS = () => L(
    'Es nativo en <strong>castellano</strong> y <strong>valenciano</strong>, y tiene un nivel <strong>B1 de inglés</strong>.',
    'He is a native speaker of <strong>Spanish</strong> and <strong>Valencian</strong>, and has a <strong>B1 level of English</strong>.',
  );

  // cosas que la gente pregunta mucho aunque no las uso
  const NOT_IN_STACK = {
    vue: ['Vue no es una de sus herramientas habituales, pero trabaja con React y Angular, que se parecen bastante.', 'Vue isn\'t one of his usual tools, but he works with React and Angular, which are quite similar.'],
    svelte: ['Svelte no lo ha usado en proyectos, pero se mueve bien con React y Angular.', 'He hasn\'t used Svelte in projects, but he is comfortable with React and Angular.'],
    typescript: ['No lo tiene como lenguaje aparte, pero lo usa al trabajar con Angular, que funciona con TypeScript.', 'He doesn\'t list it separately, but he uses it when working with Angular, which runs on TypeScript.'],
    laravel: ['Laravel no lo ha usado en proyectos, aunque sí programa en PHP, sobre todo con WordPress.', 'He hasn\'t used Laravel in projects, although he does write PHP, mostly with WordPress.'],
    django: ['Django no aparece en su stack, aunque sí conoce Python.', 'Django isn\'t in his stack, although he does know Python.'],
    flutter: ['Flutter no lo ha usado. Para móvil trabaja con Android y Kotlin, Ionic y React Native.', 'He hasn\'t used Flutter. For mobile he works with Android and Kotlin, Ionic and React Native.'],
    swift: ['No ha hecho apps para iPhone con Swift. Para móvil usa Android y Kotlin, Ionic y React Native.', 'He hasn\'t built iPhone apps with Swift. For mobile he uses Android and Kotlin, Ionic and React Native.'],
    aws: ['No tiene experiencia destacada con AWS, pero el máster que ha hecho incluía computación en la nube y usa Docker y Kubernetes.', 'He doesn\'t have significant AWS experience, but his master\'s included cloud computing and he uses Docker and Kubernetes.'],
    azure: ['Azure no aparece en su stack, aunque en el máster trabajó la computación en la nube y usa Docker y Kubernetes.', 'Azure isn\'t in his stack, although he studied cloud computing in his master\'s and uses Docker and Kubernetes.'],
    unreal: ['Unreal no lo ha usado. Para 3D trabaja con Unity, Three.js y Blender.', 'He hasn\'t used Unreal. For 3D he works with Unity, Three.js and Blender.'],
    photoshop: ['Para diseño usa sobre todo Figma y Canva, y para vídeo CapCut.', 'For design he mostly uses Figma and Canva, and CapCut for video.'],
    illustrator: ['Para diseño usa sobre todo Figma y Canva.', 'For design he mostly uses Figma and Canva.'],
    premiere: ['Para editar vídeo usa CapCut.', 'He edits video with CapCut.'],
  };

  const PROJECT_ALIASES = [
    ['orbitaly', ['orbitaly', 'biblioteca social', 'social library']],
    ['ds4m-web', ['portal', 'web oficial', 'ds4m web', 'web de ds4m', 'pagina de ds4m', 'official website', 'ds4m website']],
    ['escola', ['escola', 'colegio', 'colegios', 'ninos', 'children', 'kids']],
    ['spot-datae-valor', ['anuncio', 'anuncios', 'spot', 'netflix', 'prime', 'spotify', 'ad', 'ads', 'commercial', 'commercials']],
    ['datae-valor', ['datae', 'dataevalor', 'campana', 'marquesina', 'marquesinas', 'cartel', 'carteles', 'campaign', 'billboard', 'billboards', 'poster', 'posters']],
    ['drink-shot', ['drink', 'shot', 'drinkshot', 'juego de fiesta', 'google play', 'party game']],
    ['vialgo', ['vialgo', 'tfg', 'conducir', 'conduccion', 'educacion vial', 'fin de grado', 'driving', 'road safety', 'bachelor thesis', 'bachelors thesis']],
    ['ds4m-branding', ['branding', 'camiseta', 'camisetas', 'photocall', 'triptico', 'merchandising', 'tshirt', 't shirt', 't shirts', 'leaflet']],
    ['playversex', ['playversex', 'tfm', 'recomendador', 'fin de master', 'recommender', 'master thesis', 'masters thesis']],
    ['hackathon-video', ['hackathon', 'hackaton', 'las naves']],
    ['miracle', ['miracle', 'cirugia', 'laparoscopia', 'laparoscopica', 'quirurgico', 'quirurgicos', 'medico', 'surgery', 'surgical', 'laparoscopic', 'medical']],
    ['intras-30', ['aniversario', '30 anos', 'anniversary', '30 years']],
    ['portfolio', ['portfolio', 'esta web', 'esta pagina', 'this website', 'this site', 'this page']],
  ];

  const INTENTS = [
    {
      id: 'saludo', weight: 0.4,
      stems: ['hola', 'buenas', 'hey', 'saludo', 'buenos dias', 'buenas tardes', 'que tal', 'hi', 'hello', 'good morning', 'good afternoon', 'howdy'],
      answers: [
        () => ({ text: L('¡Hola! ¿Qué te gustaría saber de Jose? Puedo hablarte de dónde ha trabajado, de sus proyectos o de cómo contactar con él.', 'Hi! What would you like to know about Jose? I can tell you where he has worked, about his projects or how to get in touch with him.') }),
        () => ({ text: L('¡Hola de nuevo! Pregúntame lo que quieras sobre Jose.', 'Hi again! Ask me anything about Jose.') }),
      ],
    },
    {
      id: 'quien',
      stems: ['quien', 'presenta', 'sobre el', 'perfil', 'resumen', 'cuentame de', 'hablame de', 'conocer', 'who', 'introduce', 'about him', 'profile', 'summary', 'tell me about', 'background'],
      answers: [
        () => ({
          text: L(
            'Jose es <strong>Ingeniero Multimedia</strong> por la Universitat de València y ha realizado el Máster en Tecnologías Web (TWCAM). Desde 2024 trabaja en dos institutos de investigación de la UV, el IRTIC y el INTRAS, desarrollando plataformas web, aplicaciones 3D interactivas y soluciones de data analytics, además de diseño. Vive en Valencia.',
            'Jose is a <strong>Multimedia Engineer</strong> from the Universitat de València and has completed the Master\'s in Web Technologies (TWCAM). Since 2024 he has worked at two UV research institutes, IRTIC and INTRAS, developing web platforms, interactive 3D applications and data analytics solutions, as well as design work. He lives in Valencia.',
          ),
          actions: [{ label: L('Ver experiencia', 'See experience'), href: '#experiencia' }, { label: L('Ver proyectos', 'See projects'), href: '#proyectos' }],
        }),
        () => ({
          text: L(
            'Lo que hace a Jose un poco diferente es que no se queda solo en el código: también diseña y edita vídeo. Por ejemplo, en DS4M Mediterráneo trabajó en la web y además participó en el diseño de la campaña que acabó en marquesinas de toda España y en anuncios de Netflix y Prime Video.',
            'What makes Jose a bit different is that he doesn\'t stop at code: he also designs and edits video. For example, at DS4M Mediterráneo he worked on the website and also helped design the campaign that ended up on bus shelters all over Spain and in ads on Netflix and Prime Video.',
          ),
          actions: [{ label: L('Ver la campaña', 'See the campaign'), project: 'datae-valor' }],
        }),
      ],
    },
    {
      id: 'experiencia',
      stems: ['experiencia', 'trabajad', 'trabaja', 'empresa', 'puesto', 'laboral', 'practica', 'empleo', 'donde ha', 'curro', 'currado', 'cargo', 'anos lleva', 'cuanto tiempo',
        'experience', 'worked', 'work', 'job', 'jobs', 'company', 'internship', 'position', 'career', 'employ', 'how long', 'years of'],
      answers: [
        () => ({
          text: L(
            'Lleva más de dos años trabajando en la Universitat de València:<br>· <strong>IRTIC</strong> (nov 2025 – ago 2026): desarrollador en MIRACLE y DS4M Mediterráneo.<br>· <strong>INTRAS</strong> (sep 2024 – sep 2025): prácticas extracurriculares haciendo webs.<br>· <strong>INTRAS</strong> (mar – jul 2024): prácticas curriculares con Unity para ESCOLA.',
            'He has been working at the Universitat de València for over two years:<br>· <strong>IRTIC</strong> (Nov 2025 – Aug 2026): developer on MIRACLE and DS4M Mediterráneo.<br>· <strong>INTRAS</strong> (Sep 2024 – Sep 2025): extracurricular internship building websites.<br>· <strong>INTRAS</strong> (Mar – Jul 2024): curricular internship with Unity for ESCOLA.',
          ),
          actions: [{ label: L('Ir a Experiencia', 'Go to Experience'), href: '#experiencia' }],
        }),
        () => ({
          text: L(
            'En todos sus trabajos ha mezclado programación y diseño. En el IRTIC, por ejemplo, programaba el software de MIRACLE y, a la vez, participaba en el diseño de la campaña Datæ Valor. Si quieres, pregúntame por el IRTIC o por el INTRAS y te cuento más de cada uno.',
            'In every job he has mixed programming and design. At IRTIC, for example, he was writing software for MIRACLE while also helping design the Datæ Valor campaign. If you like, ask me about IRTIC or INTRAS and I\'ll tell you more about each.',
          ),
        }),
      ],
    },
    {
      id: 'irtic', stems: ['irtic'],
      answers: [
        () => ({
          text: L(
            'En el <strong>IRTIC</strong> (nov 2025 – ago 2026) trabajó como desarrollador. Programó parte del software de <strong>MIRACLE</strong>, un proyecto de IA para operaciones con robots quirúrgicos, hizo desarrollo web para <strong>DS4M Mediterráneo</strong> y participó en el diseño de la campaña <strong>Datæ Valor</strong>.',
            'At <strong>IRTIC</strong> (Nov 2025 – Aug 2026) he worked as a developer. He wrote part of the software for <strong>MIRACLE</strong>, an AI project for operations with surgical robots, did web development for <strong>DS4M Mediterráneo</strong> and helped design the <strong>Datæ Valor</strong> campaign.',
          ),
          actions: [{ label: L('Ver MIRACLE', 'See MIRACLE'), project: 'miracle' }, { label: L('Ver Datæ Valor', 'See Datæ Valor'), project: 'datae-valor' }],
        }),
      ],
    },
    {
      id: 'intras', stems: ['intras'],
      answers: [
        () => ({
          text: L(
            'En el <strong>INTRAS</strong> estuvo de 2024 a 2025. Primero hizo prácticas con Unity y C# para <strong>ESCOLA</strong>, un proyecto sobre seguridad vial cerca de los colegios. Después siguió con webs para <strong>DS4M Mediterráneo</strong>, una plataforma para ESCOLA y la animación del logo del 30 aniversario del instituto.',
            'He was at <strong>INTRAS</strong> from 2024 to 2025. First he did an internship with Unity and C# for <strong>ESCOLA</strong>, a project about road safety near schools. Then he moved on to websites for <strong>DS4M Mediterráneo</strong>, a platform for ESCOLA and the logo animation for the institute\'s 30th anniversary.',
          ),
          actions: [{ label: L('Ver ESCOLA', 'See ESCOLA'), project: 'escola' }, { label: L('Ver 30 aniversario', 'See 30th anniversary'), project: 'intras-30' }],
        }),
      ],
    },
    {
      id: 'formacion',
      stems: ['estudi', 'formacion', 'carrera', 'grado', 'master', 'universidad', 'titul', 'twcam', 'bachiller', 'uni',
        'study', 'studied', 'education', 'degree', 'university', 'college', 'school', 'thesis', 'qualification'],
      answers: [
        () => ({
          text: L(
            'Estudió el <strong>Grado en Ingeniería Multimedia</strong> (2020–2025) y el <strong>Máster en Tecnologías Web, Computación en la Nube y Aplicaciones Móviles</strong> (2025–2026), los dos en la Universitat de València.',
            'He studied a <strong>Bachelor\'s in Multimedia Engineering</strong> (2020–2025) and a <strong>Master\'s in Web Technologies, Cloud Computing and Mobile Applications</strong> (2025–2026), both at the Universitat de València.',
          ),
          actions: [{ label: L('Ir a Formación', 'Go to Education'), href: '#formacion' }],
        }),
        () => ({
          text: L(
            'Su TFG fue <strong>VialGo</strong>, una app en 3D para aprender a conducir, y su TFM fue <strong>PlayVerseX</strong>, una web que recomienda videojuegos. Antes de la universidad hizo el Bachillerato Científico en las Salesianas de Valencia.',
            'His bachelor\'s thesis was <strong>VialGo</strong>, a 3D app for learning to drive, and his master\'s thesis was <strong>PlayVerseX</strong>, a website that recommends video games. Before university he did the Science Baccalaureate at the Salesianas school in Valencia.',
          ),
          actions: [{ label: L('Ver VialGo', 'See VialGo'), project: 'vialgo' }, { label: L('Ver PlayVerseX', 'See PlayVerseX'), project: 'playversex' }],
        }),
      ],
    },
    {
      id: 'stack',
      stems: ['tecnolog', 'lenguaje', 'stack', 'programa en', 'herramienta', 'domina', 'conocimiento', 'habilidad', 'skill', 'sabe hacer', 'que sabe', 'frameworks',
        'technolog', 'programming language', 'coding', 'tools', 'know', 'knows', 'framework'],
      answers: [
        () => ({
          text: L(
            'Lo que más usa es <strong>JavaScript</strong> (con React, Angular y Node.js), <strong>PHP</strong> con WordPress y <strong>C#</strong> con Unity. Para bases de datos, MongoDB, MySQL y PostgreSQL. ¿Te interesa alguna en concreto? Pregúntame por ella.',
            'What he uses most is <strong>JavaScript</strong> (with React, Angular and Node.js), <strong>PHP</strong> with WordPress and <strong>C#</strong> with Unity. For databases, MongoDB, MySQL and PostgreSQL. Interested in a specific one? Ask me about it.',
          ),
          actions: [{ label: L('Ver stack completo', 'See full stack'), href: '#stack' }],
        }),
        () => {
          const stack = data().stack;
          const total = stack.reduce((n, g) => n + g.items.length, 0);
          const groups = list(stack.slice(1).map((g) => `${/^Microsoft/.test(g.group) ? g.group : lower(g.group)} (${g.items.slice(0, 3).join(', ')})`));
          return {
            text: L(`En total trabaja con ${total} herramientas. Aparte de la web: ${groups}.`, `In total he works with ${total} tools. Besides web: ${groups}.`),
            actions: [{ label: L('Ver stack completo', 'See full stack'), href: '#stack' }],
          };
        },
      ],
    },
    {
      id: 'proyectos',
      stems: ['proyecto', 'hecho', 'trabajos', 'destaca', 'mejor', 'portfolio', 'ensena', 'ejemplo', 'project', 'made', 'built', 'best', 'show', 'example', 'highlight'],
      answers: [
        () => ({
          text: L(
            `Tiene ${base.projects.length} proyectos en la web. Si tuviera que elegir tres: <strong>Orbitaly</strong>, una web para guardar todo lo que ves, juegas y lees; la <strong>campaña Datæ Valor</strong>, que acabó en marquesinas y en Netflix; y <strong>VialGo</strong>, su app 3D para aprender a conducir.`,
            `He has ${base.projects.length} projects on the site. If I had to pick three: <strong>Orbitaly</strong>, a website to log everything you watch, play and read; the <strong>Datæ Valor campaign</strong>, which ended up on bus shelters and on Netflix; and <strong>VialGo</strong>, his 3D app for learning to drive.`,
          ),
          actions: [{ label: 'Orbitaly', project: 'orbitaly' }, { label: 'Datæ Valor', project: 'datae-valor' }, { label: 'VialGo', project: 'vialgo' }],
        }),
        () => ({
          text: L(
            'Otros que merecen la pena: <strong>PlayVerseX</strong> (su TFM, un recomendador de videojuegos), <strong>Drink Shot</strong> (un juego de fiesta publicado en Google Play) y <strong>MIRACLE</strong> (IA para cirugía con robots).',
            'Others worth a look: <strong>PlayVerseX</strong> (his master\'s thesis, a video game recommender), <strong>Drink Shot</strong> (a party game published on Google Play) and <strong>MIRACLE</strong> (AI for robotic surgery).',
          ),
          actions: [{ label: 'PlayVerseX', project: 'playversex' }, { label: 'Drink Shot', project: 'drink-shot' }, { label: L('Ver todos', 'See all'), href: '#proyectos' }],
        }),
      ],
    },
    {
      id: 'contacto',
      stems: ['contact', 'email', 'correo', 'mail', 'linkedin', 'hablar con', 'escribir', 'telefono', 'llamar', 'localizar', 'reach', 'phone', 'call', 'get in touch', 'talk to', 'write to'],
      answers: [
        () => ({
          text: L(
            `Lo más rápido es escribirle a <strong>${base.profile.email}</strong>. También puedes hablarle por LinkedIn.`,
            `The quickest way is to email him at <strong>${base.profile.email}</strong>. You can also message him on LinkedIn.`,
          ),
          actions: [{ label: L('Escribir desde Gmail', 'Write from Gmail'), url: GMAIL }, { label: 'LinkedIn', url: base.profile.linkedin }],
        }),
      ],
    },
    {
      id: 'disponible',
      stems: ['disponib', 'contratar', 'contrato', 'freelance', 'busca', 'incorpor', 'oferta', 'vacante', 'libre', 'empezar',
        'available', 'availability', 'hire', 'hiring', 'looking for', 'open to', 'job offer', 'vacancy', 'start'],
      answers: [
        () => ({
          text: L(
            'Sí, ahora mismo está <strong>buscando trabajo y nuevos proyectos</strong>, sobre todo en desarrollo web, 3D o diseño. Lo mejor es escribirle y contarle qué tienes en mente.',
            'Yes, right now he is <strong>looking for a job and new projects</strong>, especially in web development, 3D or design. The best thing is to write to him and tell him what you have in mind.',
          ),
          actions: [{ label: L('Escribirle', 'Write to him'), url: GMAIL }, { label: L('Descargar CV', 'Download CV'), url: base.profile.cv }],
        }),
      ],
    },
    {
      id: 'remoto', weight: 1.5,
      stems: ['remoto', 'teletrabajo', 'presencial', 'hibrido', 'mudarse', 'mudaria', 'fuera de valencia', 'extranjero', 'viajar', 'remote', 'on site', 'onsite', 'hybrid', 'relocate', 'move to', 'abroad', 'travel'],
      answers: [
        () => ({
          text: L(
            'Vive en Valencia. Sobre si prefiere remoto, presencial o híbrido, o si se movería a otra ciudad, mejor que te lo cuente él directamente.',
            'He lives in Valencia. As for whether he prefers remote, on-site or hybrid, or would move to another city, it\'s best to ask him directly.',
          ),
          actions: [{ label: L('Preguntarle', 'Ask him'), url: GMAIL }],
        }),
      ],
    },
    {
      id: 'idiomas',
      stems: ['idioma', 'ingles', 'valenciano', 'catalan', 'castellano', 'espanol', 'english', 'habla', 'language', 'speak', 'spanish', 'valencian'],
      answers: [() => ({ text: LANGS() })],
    },
    {
      id: 'ubicacion',
      stems: ['donde vive', 'ubicacion', 'ciudad', 'vive', 'valencia', 'pais', 'de donde', 'localizacion', 'where does he live', 'where is he', 'location', 'city', 'live', 'lives', 'based', 'country'],
      answers: [() => ({ text: L('Vive en <strong>Valencia</strong>, en España.', 'He lives in <strong>Valencia</strong>, Spain.') })],
    },
    {
      id: 'prensa',
      stems: ['prensa', 'medios', 'noticia', 'periodico', 'articulo', 'famoso', 'salido en', 'salio en', 'aparecido', 'television', 'tele', 'tv',
        'press', 'media', 'news', 'newspaper', 'article', 'famous', 'featured'],
      answers: [
        () => ({
          text: L(
            `Sí. La campaña <strong>Datæ Valor</strong>, en cuyo diseño participó, salió en ${list(base.press.slice(0, 3).map((a) => a.outlet))}, entre otros medios. Además, sus anuncios se emitieron en televisión, Netflix, Prime Video y Spotify.`,
            `Yes. The <strong>Datæ Valor</strong> campaign, which he helped design, was covered by ${list(base.press.slice(0, 3).map((a) => a.outlet))}, among other outlets. Its ads also aired on TV, Netflix, Prime Video and Spotify.`,
          ),
          actions: [{ label: L('Ir a Prensa', 'Go to Press'), href: '#prensa' }, { label: L('Ver los anuncios', 'See the ads'), project: 'spot-datae-valor' }],
        }),
      ],
    },
    {
      id: 'logos', weight: 1.5, stems: ['logo', 'logotipo', 'vector', 'identidad', 'figma', 'identity'],
      answers: [
        () => ({
          text: L(
            'Sí, diseña logos en <strong>Figma</strong>, siempre en vectorial. Participó en el logo de <strong>DS4M Mediterráneo</strong> y ha hecho el del <strong>INTRAS</strong> y el del <strong>30 aniversario del INTRAS</strong>, cada uno con versiones para fondo claro y oscuro.',
            'Yes, he designs logos in <strong>Figma</strong>, always in vector. He took part in the <strong>DS4M Mediterráneo</strong> logo and made the <strong>INTRAS</strong> one and the <strong>INTRAS 30th anniversary</strong> one, each with versions for light and dark backgrounds.',
          ),
          actions: [{ label: L('Ver los logos', 'See the logos'), href: '#logos' }],
        }),
      ],
    },
    {
      id: 'diseno', stems: ['diseno', 'disena', 'grafico', 'creativ', 'artistic', 'visual', 'design', 'graphic'],
      answers: [
        () => ({
          text: L(
            'Sí, diseña bastante. Lo más conocido es la campaña <strong>Datæ Valor</strong>, en la que participó en el diseño, pero también ha trabajado en los logos de DS4M Mediterráneo y del INTRAS, en más de 30 diseños para DS4M (camisetas, photocall, trípticos, carteles) y el logo animado del 30 aniversario del INTRAS.',
            'Yes, he designs quite a lot. The best known is the <strong>Datæ Valor</strong> campaign, which he helped design, but he has also worked on the DS4M Mediterráneo and INTRAS logos, more than 30 designs for DS4M (T-shirts, photocall, leaflets, posters) and the animated logo for the INTRAS 30th anniversary.',
          ),
          actions: [{ label: L('Ver Datæ Valor', 'See Datæ Valor'), project: 'datae-valor' }, { label: L('Ver los logos', 'See the logos'), href: '#logos' }],
        }),
      ],
    },
    {
      id: 'video', stems: ['video', 'edicion', 'edita', 'editar', 'montaje', 'capcut', 'youtube', 'editing', 'edit', 'edits'],
      answers: [
        () => ({
          text: L(
            'Edita vídeo con CapCut. Participó en la edición del anuncio de Datæ Valor, que salió en televisión y plataformas, y por su cuenta montó un vídeo del Hackathon Data Spaces que no llegó a publicarse en ningún canal oficial.',
            'He edits video with CapCut. He took part in editing the Datæ Valor ad, which aired on TV and streaming platforms, and on his own he cut a video of the Hackathon Data Spaces that was never published on any official channel.',
          ),
          actions: [{ label: L('Ver anuncios', 'See the ads'), project: 'spot-datae-valor' }, { label: L('Vídeo del hackathon', 'Hackathon video'), project: 'hackathon-video' }],
        }),
      ],
    },
    {
      id: 'tresd', stems: ['3d', 'unity', 'videojuego', 'juego', 'simulacion', 'blender', 'three', 'videogame', 'game', 'games', 'simulation'],
      answers: [
        () => ({
          text: L(
            'Sí. Ha hecho <strong>VialGo</strong>, una app en Unity para aprender a conducir, aplicaciones en 3D para el proyecto <strong>ESCOLA</strong> y el robot que ves al principio de esta web, con Three.js.',
            'Yes. He made <strong>VialGo</strong>, a Unity app for learning to drive, 3D applications for the <strong>ESCOLA</strong> project and the robot you see at the top of this website, with Three.js.',
          ),
          actions: [{ label: L('Ver VialGo', 'See VialGo'), project: 'vialgo' }, { label: L('Ver ESCOLA', 'See ESCOLA'), project: 'escola' }],
        }),
      ],
    },
    {
      id: 'movil', stems: ['movil', 'android', 'app', 'apps', 'aplicacion movil', 'kotlin', 'ios', 'iphone', 'mobile'],
      answers: [
        () => ({
          text: L(
            'Sí, hace apps móviles. Tiene <strong>Drink Shot</strong> publicada en Google Play y trabaja con Android y Kotlin, Ionic y React Native.',
            'Yes, he builds mobile apps. He has <strong>Drink Shot</strong> published on Google Play and works with Android and Kotlin, Ionic and React Native.',
          ),
          actions: [{ label: L('Ver Drink Shot', 'See Drink Shot'), project: 'drink-shot' }],
        }),
      ],
    },
    {
      id: 'ia', stems: ['ia', 'inteligencia artificial', 'chatgpt', 'gpt', 'claude', 'prompt', 'machine learning', 'ai', 'artificial intelligence'],
      answers: [
        () => ({
          text: L(
            'Usa la IA a diario como herramienta de trabajo. En <strong>MIRACLE</strong> la usó para automatizar tareas y en <strong>Orbitaly</strong> hizo un asistente con IA que te recomienda películas, juegos o libros y los añade a tu biblioteca.',
            'He uses AI every day as a work tool. At <strong>MIRACLE</strong> he used it to automate tasks, and in <strong>Orbitaly</strong> he built an AI assistant that recommends films, games or books and adds them to your library.',
          ),
          actions: [{ label: L('Ver MIRACLE', 'See MIRACLE'), project: 'miracle' }, { label: L('Ver Orbitaly', 'See Orbitaly'), project: 'orbitaly' }],
        }),
      ],
    },
    {
      id: 'fuerte',
      stems: ['por que', 'contratarle', 'fuerte', 'virtud', 'diferencia', 'aporta', 'cualidad', 'valor', 'bueno en', 'destaca en',
        'why', 'hire him', 'strength', 'strong', 'different', 'bring', 'quality', 'good at', 'stand out'],
      answers: [
        () => ({
          text: L(
            'Su punto fuerte es que sabe hacer cosas muy distintas: programa la web, la diseña y, si hace falta, edita el vídeo. Así entiende bien lo que necesita cada parte del equipo.',
            'His strength is that he can do very different things: he codes the website, designs it and, if needed, edits the video. That way he understands what each part of the team needs.',
          ),
          actions: [{ label: L('Ver proyectos', 'See projects'), href: '#proyectos' }],
        }),
        () => ({
          text: L(
            'También tiene experiencia real trabajando en equipo por sprints (Scrum) en proyectos de investigación europeos, y ha trabajado en cosas que han llegado a mucha gente, como una app en Google Play o una campaña que se vio en toda España.',
            'He also has real experience working in a team in sprints (Scrum) on European research projects, and he has worked on things that reached a lot of people, like an app on Google Play or a campaign seen all over Spain.',
          ),
        }),
      ],
    },
    {
      id: 'equipo',
      stems: ['equipo', 'scrum', 'metodolog', 'agil', 'como trabaja', 'forma de trabajar', 'git', 'team', 'method', 'agile', 'how does he work', 'way of working', 'workflow'],
      answers: [
        () => ({
          text: L(
            'Está acostumbrado a trabajar en equipo por sprints con <strong>Scrum</strong>, como hizo en DS4M Mediterráneo, y usa Git, GitHub y GitLab para el código. También usa la IA como ayuda en el día a día.',
            'He is used to working in a team in sprints with <strong>Scrum</strong>, as he did at DS4M Mediterráneo, and uses Git, GitHub and GitLab for code. He also uses AI as a day-to-day helper.',
          ),
        }),
      ],
    },
    {
      id: 'cv', stems: ['cv', 'curriculum', 'curriculo', 'resume', 'descargar', 'pdf', 'download'],
      answers: [() => ({
        text: L('Aquí tienes su CV en PDF.', 'Here is his CV in PDF (in Spanish).'),
        actions: [{ label: L('Descargar CV', 'Download CV'), url: base.profile.cv }],
      })],
    },
    {
      id: 'github', stems: ['github', 'codigo fuente', 'repositorio', 'repo', 'source code', 'repository'],
      answers: [
        () => ({
          text: base.profile.github
            ? L('Aquí tienes su GitHub.', 'Here is his GitHub.')
            : L('Su GitHub todavía no está enlazado en la web. Si quieres ver código, escríbele y te lo enseña.', 'His GitHub isn\'t linked on the site yet. If you want to see code, write to him and he\'ll show you.'),
          actions: base.profile.github
            ? [{ label: L('Abrir GitHub', 'Open GitHub'), url: base.profile.github }]
            : [{ label: L('Escribirle', 'Write to him'), url: GMAIL }],
        }),
      ],
    },
    {
      id: 'robot',
      stems: ['robot', 'como hiciste', 'como esta hecha', 'como se hizo', 'esta web', 'esta pagina', 'how was this', 'this website', 'this page', 'made this', 'built this'],
      answers: [
        () => ({
          text: L(
            'Esta web la ha hecho Jose desde cero con HTML, CSS y JavaScript. El robot está hecho con Three.js, todo con código. Haz clic en él y te saluda.',
            'Jose built this website from scratch with HTML, CSS and JavaScript. The robot is made with Three.js, entirely in code. Click it and it waves at you.',
          ),
          actions: [{ label: L('Ir al robot', 'Go to the robot'), href: '#inicio' }],
        }),
      ],
    },
    {
      id: 'personal',
      stems: ['edad', 'anos tiene', 'cuantos anos', 'hobby', 'hobbies', 'aficion', 'tiempo libre', 'gusta hacer', 'novia', 'pareja', 'sueldo', 'salario', 'cobra', 'dinero',
        'age', 'how old', 'free time', 'girlfriend', 'partner', 'salary', 'money', 'paid'],
      answers: [
        () => ({
          text: L(
            'Eso no lo sé, solo sé lo que aparece en su portfolio. Si te interesa, pregúntaselo directamente a él.',
            'I don\'t know that, I only know what\'s in his portfolio. If you\'re interested, ask him directly.',
          ),
          actions: [{ label: L('Escribirle', 'Write to him'), url: GMAIL }],
        }),
      ],
    },
    {
      id: 'gracias', weight: 0.4,
      stems: ['gracias', 'genial', 'perfecto', 'vale', 'ok', 'guay', 'top', 'buenisimo', 'thanks', 'thank you', 'great', 'perfect', 'okay', 'cool', 'nice', 'awesome'],
      answers: [
        () => ({ text: L('¡De nada! Si quieres saber algo más, aquí estoy.', 'You\'re welcome! If you want to know anything else, I\'m here.') }),
        () => ({ text: L('¡A ti! ¿Algo más que quieras saber?', 'Thank you! Anything else you\'d like to know?') }),
      ],
    },
    {
      id: 'adios', weight: 0.4, stems: ['adios', 'chao', 'hasta luego', 'nos vemos', 'bye', 'goodbye', 'see you'],
      answers: [() => ({
        text: L(
          `¡Hasta luego! Si al final te animas a escribirle, su correo es ${base.profile.email}.`,
          `Bye! If you decide to write to him, his email is ${base.profile.email}.`,
        ),
      })],
    },
  ];

  const SUGGESTIONS = [
    [['¿Quién es Jose?', 'Who is Jose?'], 'quien'],
    [['¿Dónde ha trabajado?', 'Where has he worked?'], 'experiencia'],
    [['¿Qué proyectos destacarías?', 'Which projects stand out?'], 'proyectos'],
    [['¿Qué tecnologías usa?', 'What technologies does he use?'], 'stack'],
    [['¿Ha salido en televisión?', 'Has his work been on TV?'], 'prensa'],
    [['¿Qué ha estudiado?', 'What did he study?'], 'formacion'],
    [['¿Diseña y edita vídeo?', 'Does he design and edit video?'], 'diseno'],
    [['¿Qué idiomas habla?', 'Which languages does he speak?'], 'idiomas'],
    [['¿Está buscando trabajo?', 'Is he looking for a job?'], 'disponible'],
    [['¿Cómo le contacto?', 'How can I contact him?'], 'contacto'],
  ];
  const label = ([es, en]) => L(es, en);
  const SHOWN = 4;
  const usedIntents = new Set();

  const asked = new Map();
  let lastProject = null;

  let lastIntent = null;

  const pending = () => SUGGESTIONS.filter(([, id]) => !usedIntents.has(id));
  const leftHint = () => pending().slice(0, 2).map(([l]) => quote(label(l)));

  function nextAnswer(intent) {
    lastIntent = intent;
    const n = asked.get(intent.id) || 0;
    asked.set(intent.id, n + 1);
    if (n < intent.answers.length) return intent.answers[n]();
    const { actions } = intent.answers[0]();
    const left = leftHint();
    return {
      text: pick(L(
        ['Sobre eso ya te he contado lo que sé.', 'Eso ya te lo he contado más arriba.', 'De eso no sé mucho más de lo que te he dicho.'],
        ['I\'ve already told you what I know about that.', 'I told you about that further up.', 'I don\'t know much more about that than what I\'ve said.'],
      )) + (left.length ? L(` Si quieres, pregúntame ${list(left)}.`, ` If you like, ask me ${list(left)}.`) : ''),
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
    const stack = data().stack;
    for (const g of stack) {
      for (const item of g.items) {
        if (techVariants(item).some((k) => hasWord(q, k))) return { item, group: g.group };
      }
    }
    for (const [alias, item] of Object.entries(TECH_ALIASES)) {
      if (hasWord(q, alias)) {
        const g = stack.find((x) => x.items.includes(item));
        if (g) return { item, group: g.group };
      }
    }
    for (const k of Object.keys(NOT_IN_STACK)) if (hasWord(q, k)) return { missing: k };
    return null;
  }

  function techAnswer(tech) {
    const stackLink = { label: L('Ver su stack', 'See his stack'), href: '#stack' };
    if (tech.missing) return { text: L(...NOT_IN_STACK[tech.missing]), actions: [stackLink] };
    const variants = techVariants(tech.item);
    const used = data().projects.filter((p) => p.stack.some((s) => variants.some((k) => hasWord(norm(s), k))));
    const names = list(used.slice(0, 3).map((p) => `<strong>${esc(p.title)}</strong>`));
    const where = used.length
      ? L(` Lo ha usado en ${names}.`, ` He has used it in ${names}.`)
      : L(` Forma parte de lo que usa en ${lower(tech.group)}.`, ` It's part of what he uses for ${lower(tech.group)}.`);
    return {
      text: L(`Sí, trabaja con <strong>${esc(tech.item)}</strong>.`, `Yes, he works with <strong>${esc(tech.item)}</strong>.`) + where,
      actions: used.slice(0, 2).map((p) => ({ label: p.title, project: p.id })).concat([{ label: L('Ver stack', 'See stack'), href: '#stack' }]),
    };
  }

  function projectAnswer(p, focus) {
    lastProject = p;
    const key = `p:${p.id}`;
    const n = asked.get(key) || 0;
    asked.set(key, n + 1);
    const open = { label: L('Abrir proyecto', 'Open project'), project: p.id };
    const ext = p.links.filter((l) => /^https?:/.test(l.url)).slice(0, 1).map((l) => ({ label: l.label, url: l.url }));
    const title = `<strong>${esc(p.title)}</strong>`;

    if (focus === 'stack') {
      return { text: L(`En ${title} usó ${list(p.stack.map(esc))}.`, `For ${title} he used ${list(p.stack.map(esc))}.`), actions: [open] };
    }
    const steps = [
      () => ({ text: `${title}. ${esc(p.summary)}`, actions: [open, ...ext] }),
      () => ({
        text: `${pick(L(['En detalle', 'Un poco más a fondo', 'Más en concreto'], ['In more detail', 'Going a bit deeper', 'More specifically']))}: ${esc(p.description[p.description.length > 1 ? 1 : 0])}`,
        actions: [open],
      }),
      () => ({
        text: L(
          `Más cosas de ${title}: ${list(p.highlights.slice(1, 4).map((h) => esc(lower(h))))}. Para hacerlo usó ${list(p.stack.slice(0, 4).map(esc))}.`,
          `More about ${title}: ${list(p.highlights.slice(1, 4).map((h) => esc(lower(h))))}. He built it with ${list(p.stack.slice(0, 4).map(esc))}.`,
        ),
        actions: [open, ...ext],
      }),
      () => ({
        text: L(
          `Eso es todo lo que te puedo contar de ${title}. Si lo abres verás fotos${(p.videos || p.video) ? ' y vídeos' : ''} y más detalles.`,
          `That's all I can tell you about ${title}. If you open it you'll see photos${(p.videos || p.video) ? ', videos' : ''} and more details.`,
        ),
        actions: [open],
      }),
    ];
    return steps[Math.min(n, steps.length - 1)]();
  }

  const FOLLOW_UP = ['mas', 'eso', 'ese', 'esa', 'ahi', 'alli', 'detalles', 'sigue', 'continua', 'y que', 'que mas', 'como lo', 'more', 'details', 'continue', 'go on', 'what else', 'tell me more'];

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
      if (lastProject) return projectAnswer(project(lastProject.id) || lastProject);
      if (lastIntent) return nextAnswer(lastIntent);
    }
    if (lastProject && intent && intent.id === 'stack' && /\b(uso|usaste|utilizo|hizo|hecho|use|used|built|made)\b/.test(q)) {
      return projectAnswer(project(lastProject.id) || lastProject, 'stack');
    }
    if (intent && score > 0) {
      usedIntents.add(intent.id);
      return nextAnswer(intent);
    }
    const left = leftHint();
    return {
      text: pick(L(
        [
          'No estoy seguro de haberte entendido. Solo sé cosas sobre Jose y su trabajo.',
          'Uy, eso no lo sé. Puedo contarte cosas sobre la experiencia, los proyectos o los estudios de Jose.',
          'Ahí no te puedo ayudar, solo respondo sobre Jose.',
        ],
        [
          'I\'m not sure I understood you. I only know about Jose and his work.',
          'Oops, I don\'t know that. I can tell you about Jose\'s experience, projects or studies.',
          'I can\'t help you there, I only answer questions about Jose.',
        ],
      )) + (left.length ? L(` Prueba con ${list(left)}.`, ` Try ${list(left)}.`) : ''),
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
    suggest.innerHTML = pending().slice(0, SHOWN).map(([l, id]) => `<button type="button" class="chat__chip" data-s="${id}">${esc(label(l))}</button>`).join('');
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
  const greet = () => addMessage('bot', L(
    '¡Hola! 👋 Soy el asistente de la web de <strong>Jose</strong>. Pregúntame lo que quieras sobre él: dónde ha trabajado, qué proyectos ha hecho, qué sabe hacer o cómo contactarle.',
    'Hi! 👋 I\'m the assistant on <strong>Jose</strong>\'s website. Ask me anything about him: where he has worked, what projects he has made, what he can do or how to contact him.',
  ));

  function setOpen(open) {
    panel.hidden = !open;
    root.classList.toggle('is-open', open);
    fab.setAttribute('aria-expanded', String(open));
    if (open && !greeted) {
      greeted = true;
      greet();
    }
    if (open) setTimeout(() => input.focus(), 50);
  }
  root.querySelectorAll('[data-chat-toggle]').forEach((b) => b.addEventListener('click', () => setOpen(panel.hidden)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { setOpen(false); fab.focus(); } });

  // al cambiar de idioma la conversación empieza de nuevo
  global.addEventListener('langchange', () => {
    log.innerHTML = '';
    asked.clear();
    usedIntents.clear();
    lastProject = null;
    lastIntent = null;
    greeted = !panel.hidden;
    if (greeted) greet();
    renderSuggestions();
  });

  // para probarlo desde la consola: PortfolioChat.reply('¿sabe React?')
  global.PortfolioChat = { reply };
})(window);
