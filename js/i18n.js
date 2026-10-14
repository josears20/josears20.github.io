// idiomas de la web: el español está escrito en index.html y data.js, aquí solo va el inglés
(function (global) {
  'use strict';

  const SUPPORTED = ['es', 'en'];
  const KEY = 'lang';

  // textos fijos de index.html (data-i18n, data-i18n-label, data-i18n-alt, data-i18n-ph)
  const PAGE_EN = {
    skip: 'Skip to content',
    'nav.home': 'Go to the top',
    'nav.main': 'Main',
    'nav.about': 'About',
    'nav.xp': 'Experience',
    'nav.projects': 'Projects',
    'nav.logos': 'Logos',
    'nav.press': 'Press',
    'nav.edu': 'Education',
    'nav.contact': 'Contact',
    'lang.label': 'Language',

    'hero.eyebrow': 'Open to new projects · Valencia',
    'hero.role': 'Multimedia Engineer <span aria-hidden="true">/</span> Full Stack Developer',
    'hero.lead': 'I turn ideas into functional websites, explorable 3D worlds and designs with their own identity. I am involved in European research projects at <strong>IRTIC</strong> and <strong>INTRAS</strong> (Universitat de València).',
    'hero.projects': 'See projects',
    'hero.cv': 'Download CV',
    'stats.years': 'Years of experience',
    'stats.research': 'Research projects',
    'stats.tech': 'Technologies',
    'hero.robot': 'Minimal 3D robot that turns its head to follow the cursor',
    'hero.hint': 'Move the cursor · click the robot',
    'hero.hintTouch': 'Tap the robot',
    'hero.scroll': 'Scroll down to the About section',

    'about.cmd': '<span class="cmd-path">~/about</span> <span class="cmd-sign">$</span> cat profile.md',
    'about.title': 'Development, design <em>and video editing.</em>',
    'about.photo': 'Portrait of Jose Antonio Cuerda Aparicio wearing a dark blazer and white shirt',
    'about.hello': '<span class="cmd-sign" aria-hidden="true">&gt;</span> Hello world<span class="term-caret" aria-hidden="true"></span>',
    'about.p1': 'I\'m a <strong>Multimedia Engineer</strong> from the Universitat de València and I have completed the <strong>Master\'s in Web Technologies, Cloud Computing and Mobile Applications (TWCAM)</strong>. Since 2024 I have been working at UV research institutes, developing web platforms, interactive 3D applications and <strong>data analytics</strong> solutions.',
    'about.p2': 'In the European project <strong>DS4M Mediterráneo</strong> I collaborated with the research team on the design, <strong>full stack</strong> development, deployment and maintenance of the institutional website. In <strong>MIRACLE</strong>, a project applying AI to robotic surgery, I took part in software development and in the integration architecture between its applications.',
    'focus.label': 'Specialities',
    'focus.web': '<strong>Full stack development</strong><span>Frontend and backend with Node.js, React, Angular, PHP and databases.</span>',
    'focus.3d': '<strong>Interactive 3D</strong><span>Real-time applications and simulations with Unity and C#, Three.js and Blender.</span>',
    'focus.mobile': '<strong>Mobile apps</strong><span>Native Android development with Kotlin and cross-platform with Ionic and React Native.</span>',
    'focus.design': '<strong>Design and video</strong><span>Visual identity in Figma, posters, campaigns, motion graphics and video editing.</span>',
    'loc.label': 'Based in',
    'loc.map': 'Map of the Iberian Peninsula with Valencia marked on the Mediterranean coast',
    'loc.city': 'Valencia, Spain',
    'langs.label': 'Languages',
    'langs.es': 'Spanish',
    'langs.va': 'Valencian',
    'langs.en': 'English',
    'langs.native': 'Native',
    'langs.b1': 'B1 level',
    'method.chips': '<li class="chip">Teamwork</li><li class="chip">Communication</li><li class="chip">Problem solving</li><li class="chip">Critical thinking</li><li class="chip">Adaptability</li><li class="chip">Proactivity</li><li class="chip">Creativity</li><li class="chip">Attention to detail</li>',

    'xp.cmd': '<span class="cmd-path">~/experience</span> <span class="cmd-sign">$</span> git log',
    'xp.title': 'Professional <em>experience.</em>',
    'xp.chips': 'Technologies and areas',
    'xp1.img': 'Illustration of the work at IRTIC with the DS4M Mediterráneo data corridor, the Datæ Valor campaign poster, the MIRACLE robotic arm and branding and video pieces',
    'xp1.date': '<time datetime="2025-11">Nov 2025</time> – <time datetime="2026-08">Aug 2026</time>',
    'xp1.list': '<li>Software development for <strong>MIRACLE</strong>, a project applying AI to robotic laparoscopic surgery: contributions to the codebase and to the integration architecture between applications, plus task automation with AI.</li><li>Full stack web development for the European project <strong>DS4M Mediterráneo</strong> using an agile methodology (Scrum).</li><li>Contribution to the visual identity, merchandising and the <strong>Datæ Valor</strong> campaign, rolled out on bus shelters, stations and airports such as Joaquín Sorolla (Valencia) and Barcelona airport, among others, with press coverage.</li><li>Database modelling and management, production deployment and web performance optimisation.</li><li>Video editing, social media management and maintenance of the <a class="inline-link" href="https://ds4mmed.uv.es/index.php/es/" target="_blank" rel="noopener">official DS4M Mediterráneo website</a>.</li>',
    'xp1.chips': '<li class="chip">AI</li><li class="chip">Full Stack</li><li class="chip">Scrum</li><li class="chip">Databases</li><li class="chip">Branding</li>',
    'xp2.img': 'Illustration of the work at INTRAS with the DS4M Mediterráneo web portal, the ESCOLA measurement platform and the editing of the 30th anniversary video',
    'xp2.tag': 'Extracurricular internship',
    'xp2.list': '<li>Design, development and maintenance of the website for the European project <strong>DS4M Mediterráneo</strong>.</li><li>Interactive 3D application for the <strong>ESCOLA</strong> project, which records and analyses how children react to road danger situations.</li><li>SEO optimisation of the corporate website: structure, metadata and performance to improve its search ranking.</li><li>Content creation and social media management, including the logo animation for the <strong>INTRAS 30th anniversary</strong>.</li>',
    'xp2.note': 'In parallel, development of the <strong>bachelor\'s thesis</strong> <a class="inline-link" href="https://youtu.be/04wgOXJavtA" target="_blank" rel="noopener">VialGo</a>, an interactive 3D application for learning to drive.',
    'xp3.img': 'Illustration of the Unity editor with the 3D scene of a school from the ESCOLA project and a C# script',
    'xp3.tag': 'Curricular internship',
    'xp3.list': '<li>Interactive applications for the <a class="inline-link" href="https://www.uv.es/uvweb/instituto-universitario-investigacion-transito-seguridad-vial-INTRAS/es/grupos-investigacion/dats/experiencia-investigacion/escola-entornos-seguros-colegios-libres-accidentes-1285893039971/ProjecteInves.html?id=1286330274153" target="_blank" rel="noopener"><strong>ESCOLA</strong></a> project (Safe Environments, Accident-Free Schools).</li><li>Programming in <strong>C#</strong> with <strong>Unity</strong>.</li><li>3D scene design, testing and performance optimisation.</li>',
    'xp3.chips': '<li class="chip">Unity</li><li class="chip">C#</li><li class="chip">3D</li><li class="chip">Testing</li>',

    'projects.cmd': '<span class="cmd-path">~/projects</span> <span class="cmd-sign">$</span> ls',
    'projects.title': 'Featured <em>projects.</em>',
    'projects.filter': 'Filter projects',
    'logos.title': 'Institutional <em>logo design.</em>',
    'logos.lead': 'Designed in Figma as vector graphics, they scale without any loss of quality from a business card to a large-format banner. Each logo includes versions for light and dark backgrounds.',
    'press.cmd': '<span class="cmd-path">~/press</span> <span class="cmd-sign">$</span> grep "Datæ Valor"',
    'press.title': 'The campaign <em>in the media.</em>',
    'press.lead': 'The DS4M Mediterráneo Datæ Valor campaign, with my involvement in its design, was rolled out on bus shelters, stations and airports such as Joaquín Sorolla (Valencia) and Barcelona airport, among others. Its spots aired on TV, Netflix, Prime Video and Spotify, and it was covered by several media outlets.',
    'stack.cmd': '<span class="cmd-path">~/stack</span> <span class="cmd-sign">$</span> cat tools.txt',
    'stack.title': 'Tech <em>stack.</em>',
    'edu.cmd': '<span class="cmd-path">~/education</span> <span class="cmd-sign">$</span> cat studies.md',
    'edu.title': 'Academic <em>background.</em>',
    'edu.master': 'Master\'s Degree in Web Technologies, Cloud Computing and Mobile Applications',
    'edu.tfm': 'Master\'s thesis',
    'edu.tfmText': 'PlayVerseX, a website that recommends video games based on your taste, with a Node.js and MongoDB server and two versions of the frontend, in Angular and in React.',
    'edu.degree': 'Bachelor\'s Degree in Multimedia Engineering',
    'edu.tfg': 'Bachelor\'s thesis',
    'edu.tfgText': 'VialGo. Road Safety Education in the Digital Age, an interactive 3D application for learning to drive. <a class="inline-link" href="https://youtu.be/04wgOXJavtA" target="_blank" rel="noopener">Watch video</a>',
    'edu.school': 'Science Baccalaureate',
    'contact.cmd': '<span class="cmd-path">~/contact</span> <span class="cmd-sign">$</span> mail jose',
    'contact.title': 'Shall we talk? <span class="text-gradient">Write to me.</span>',
    'contact.lead': 'I\'m looking for new projects and jobs, especially in web development, 3D and design. If you think I could be a good fit, send me an email and let\'s talk.',
    'contact.copy': 'Copy',
    'contact.gmail': 'Write from Gmail ↗',
    'contact.cv': 'CV in PDF (Spanish) ↓',
    'footer.made': 'Built by me with HTML, CSS, JavaScript and Three.js',
    'footer.top': 'Back to top ↑',
    'modal.close': 'Close',
    'chat.fab': 'Ask me',
    'chat.panel': 'Assistant about Jose Antonio',
    'chat.name': 'Jose\'s assistant',
    'chat.status': 'I only answer about Jose and his work',
    'chat.close': 'Close chat',
    'chat.suggest': 'Suggested questions',
    'chat.inputLabel': 'Type your question',
    'chat.placeholder': 'Ask something about Jose…',
    'chat.send': 'Send question',
  };

  // textos que generan los scripts
  const UI = {
    es: {
      menuOpen: 'Abrir menú', menuClose: 'Cerrar menú',
      video: 'Vídeo', tech: 'Tecnologías', seeProject: 'Ver proyecto',
      playVideoOf: 'Reproducir vídeo de {0}', play: 'Reproducir {0}', moreVideos: 'Más vídeos',
      inMedia: 'En los medios', highlights: 'Puntos clave', photos: 'Fotos', zoom: 'Ver en grande: {0}',
      category: 'Categoría', all: 'Todos',
      viewer: 'Foto ampliada', viewerClose: 'Cerrar foto', viewerPrev: 'Foto anterior', viewerNext: 'Foto siguiente',
      projectVideo: 'Vídeo del proyecto', logoVersions: 'Versiones del logo', tools: 'Herramientas',
      readArticle: 'Leer artículo ↗', copied: 'Email copiado al portapapeles', copiedShort: 'Email copiado',
      title: 'Jose Antonio Cuerda · Ingeniero Multimedia & Full Stack Developer',
      description: 'Portfolio de Jose Antonio Cuerda Aparicio, Ingeniero Multimedia y Full Stack Developer en Valencia. Plataformas web, aplicaciones 3D interactivas con Unity y Three.js, e I+D en IRTIC e INTRAS (Universitat de València).',
    },
    en: {
      menuOpen: 'Open menu', menuClose: 'Close menu',
      video: 'Video', tech: 'Technologies', seeProject: 'See project',
      playVideoOf: 'Play video of {0}', play: 'Play {0}', moreVideos: 'More videos',
      inMedia: 'In the media', highlights: 'Highlights', photos: 'Photos', zoom: 'View larger: {0}',
      category: 'Category', all: 'All',
      viewer: 'Enlarged photo', viewerClose: 'Close photo', viewerPrev: 'Previous photo', viewerNext: 'Next photo',
      projectVideo: 'Project video', logoVersions: 'Logo versions', tools: 'Tools',
      readArticle: 'Read article (in Spanish) ↗', copied: 'Email copied to clipboard', copiedShort: 'Email copied',
      title: 'Jose Antonio Cuerda · Multimedia Engineer & Full Stack Developer',
      description: 'Portfolio of Jose Antonio Cuerda Aparicio, Multimedia Engineer and Full Stack Developer in Valencia. Web platforms, interactive 3D apps with Unity and Three.js, and R&D at IRTIC and INTRAS (Universitat de València).',
    },
  };

  // contenido de data.js en inglés; lo que no aparece aquí se queda como en español
  const DATA_EN = {
    categories: { web: 'Web & Full Stack', '3d': '3D & Unity', mobile: 'Mobile', design: 'Design', video: 'Video' },
    projects: {
      orbitaly: {
        context: 'Personal project',
        alt: 'Orbitaly home page with the headline “Everything you watch, play and listen to in one profile” and links to films, series, video games, music, books and anime',
        summary: 'Social platform to log and rate films, series, video games, music, books and anime from a single profile.',
        description: [
          'Orbitaly brings all of a user\'s cultural consumption (films, series, video games, music, books and anime) into a single profile instead of spreading it across several apps. Users can rate titles, write reviews, build lists and follow other users\' activity.',
          'The main technical challenge was integrating seven external APIs with very different data models (TMDB, IGDB, Spotify, Apple Music, Google Books, Open Library and AniList) and normalising them into a consistent experience.',
        ],
        highlights: [
          'Integration and normalisation of seven external APIs',
          'Ratings from 1 to 10, reviews and lists by status (to do, in progress, finished)',
          'Social feed, private messaging and public or private profiles',
          'Recommendation system based on ratings',
          'AI assistant that suggests titles and adds them to the library',
          'Year in review and statistics dashboard',
          'Browser extension to import data from IMDb, Letterboxd, Steam, Goodreads and other platforms',
        ],
        stack: ['External APIs', 'AI', 'TMDB', 'IGDB', 'Spotify', 'AniList', 'Browser extension'],
        gallery: [
          { alt: 'Orbitaly film catalogue with posters and filters' },
          { alt: 'User profile with their top 5 titles' },
          { alt: 'Library stats dashboard with charts by section and by rating' },
          { alt: 'Orbitaly AI assistant for asking for recommendations' },
          { alt: 'Personalised year in review “My 2026 on Orbitaly”' },
          { alt: 'Private direct messages between users' },
        ],
        links: [{ label: 'Visit Orbitaly' }],
      },
      'ds4m-web': {
        title: 'DS4M Mediterráneo portal',
        context: 'INTRAS and IRTIC · European project',
        alt: 'Home page of the DS4M Mediterráneo web portal, Data Space for Mobility, with an aerial view of Cádiz cathedral',
        summary: 'Official website of the European project DS4M Mediterráneo, with two years of involvement in its development.',
        description: [
          'DS4M Mediterráneo is a European project building a data space so that companies and institutions along the Mediterranean Corridor can share information and improve transport and mobility.',
          'A project developed in collaboration with INTRAS and IRTIC. Part of the team responsible for the official website: design, full stack development and maintenance, as well as internal web tools, databases and deployments.',
        ],
        highlights: [
          'Involvement in the design, development and maintenance of the website',
          'Internal web tools for the project team',
          'Agile methodology in sprints (Scrum)',
          'Database management, deployments and performance optimisation',
        ],
        stack: ['WordPress', 'PHP', 'JavaScript', 'HTML/CSS', 'Databases', 'Scrum'],
        gallery: [
          { alt: 'Portal section with the benefits of joining the project' },
          { alt: 'Datæ Valor campaign page inside the portal' },
          { alt: 'Mass Media page with the project\'s media appearances' },
          { alt: 'Step-by-step wizard to join the data space' },
        ],
        links: [{ label: 'Visit the website' }],
      },
      escola: {
        context: 'INTRAS · Safe Environments, Accident-Free Schools',
        alt: 'ESCOLA project logo, an adult and a child walking on a pair of hands inside an orange circle',
        summary: 'Interactive 3D applications in Unity to analyse how children react to road danger situations.',
        description: [
          'ESCOLA is an INTRAS research project, funded by the Generalitat Valenciana, that studies the causes of traffic accidents around schools and how to prevent them.',
          'The work started with interactive 3D applications in Unity and C#, and continued with an application that records and analyses children\'s brain response to dangerous situations.',
        ],
        highlights: [
          'Interactive 3D applications with Unity and C#',
          'Recording and analysis of children\'s reactions',
          'Testing and performance optimisation',
        ],
        stack: ['Unity', 'C#', '3D', 'Data analysis'],
        links: [{ label: 'Project page' }],
      },
      'datae-valor': {
        title: 'Datæ Valor campaign',
        context: 'INTRAS · DS4M Mediterráneo · Branding and advertising',
        alt: 'Datæ Valor campaign piece with the slogan “Join the data economy” and the Mediterranean Corridor drawn in light',
        summary: 'The “Join the data economy” campaign, rolled out on bus shelters, stations and airports across Spain, with press coverage.',
        description: [
          'Datæ Valor was INTRAS\'s first campaign to raise awareness of the data economy and encourage companies and institutions to join DS4M Mediterráneo.',
          'Contribution to the design of the campaign identity and its pieces, featured on posters, bus shelters and screens in stations and airports such as Joaquín Sorolla (Valencia) and Barcelona airport, among others. The campaign was covered by outlets such as Cadena SER, Europa Press and El Publicista.',
        ],
        highlights: [
          'Contribution to the visual identity and creative direction',
          'Posters, digital screens and social media pieces',
          'Photocall for events',
          'National and regional press coverage',
        ],
        stack: ['Branding', 'Graphic design', 'Outdoor advertising'],
        gallery: [
          { alt: 'Digital screen in a station showing the Datæ Valor campaign with a QR code' },
          { alt: 'Datæ Valor campaign screens at a station entrance' },
          { alt: 'Vertical Datæ Valor poster in a station' },
          { alt: 'Datæ Valor photocall set up at an event' },
        ],
      },
      'spot-datae-valor': {
        title: 'Datæ Valor ads',
        context: 'DS4M Mediterráneo · TV and streaming',
        alt: 'Illustration of a TV showing the Datæ Valor ad next to the TV, Spotify, Netflix and Prime Video platforms',
        summary: 'Datæ Valor campaign spots aired on TV, Netflix, Prime Video and Spotify.',
        description: [
          'The Datæ Valor campaign expanded into audiovisual formats with spots aired on TV and on platforms such as Netflix, Prime Video and Spotify.',
          'Contribution to editing the spot, keeping it visually consistent with the rest of the campaign. Both ads can be watched here.',
        ],
        highlights: [
          'Aired on TV',
          'Distributed on Netflix, Prime Video and Spotify',
          'Visual consistency with the campaign posters and screens',
        ],
        stack: ['Video editing', 'Post-production', 'CapCut'],
        videos: [{ title: 'Ad 1' }, { title: 'Ad 2' }],
        links: [{ label: 'Ad 1 on YouTube' }, { label: 'Ad 2 on YouTube' }],
      },
      'drink-shot': {
        context: 'Android app · Google Play',
        alt: 'Three screens of the Drink Shot app with a neon look, the central button, the game modes menu and a “Never have I ever” card',
        summary: 'Social party game for Android published on Google Play, with a neon look, four game modes and sound effects.',
        description: [
          'Drink Shot is a mobile party game, published on Google Play and designed to liven up get-togethers with friends.',
          'It includes the modes Never have I ever, Truth or dare, Who\'s most likely to…? and Spin the bottle, plus a central button that generates random challenges. The interface goes for a neon look with animations and sound effects.',
        ],
        highlights: [
          'Published on Google Play',
          'Four game modes and random challenges',
          'Neon interface with animations and sound',
        ],
        links: [{ label: 'See on Google Play' }],
      },
      vialgo: {
        title: 'VialGo · 3D Driving Education',
        context: 'Bachelor\'s thesis · Multimedia Engineering',
        alt: 'Screenshot of VialGo with the logo, a red car on a mountain road and the level 1 completed screen with three stars',
        summary: 'Interactive 3D application for learning to drive through practice, with levels, traffic and real road situations.',
        description: [
          'Bachelor\'s thesis: “Road Safety Education in the Digital Age. Interactive 3D Application for Learning to Drive”.',
          'It approaches learning the rules of the road through driving rather than memorisation. It includes levels with traffic and real situations, a free practice mode and a theory section.',
        ],
        highlights: [
          '3D driving structured in levels',
          'Learning the rules through practice',
          'End-to-end development: design, programming and 3D scenes',
        ],
        stack: ['Unity', 'C#', 'Interactive 3D'],
        gallery: [
          { alt: 'Driving view from inside the car' },
          { alt: '3D circuit among snowy mountains' },
          { alt: 'Character at the wheel with a hint on how to hold the steering wheel' },
          { alt: 'VialGo menu with level selection, free mode and theory' },
        ],
        links: [{ label: 'Watch video on YouTube' }],
      },
      'ds4m-branding': {
        title: 'DS4M Mediterráneo branding',
        context: 'INTRAS and IRTIC · Identity and merchandising',
        alt: 'Mockup of the DS4M Mediterráneo T-shirts, front and back, with the slogan Data Space for Mobility',
        summary: 'Contribution to more than 30 designs for the project: T-shirts, photocall, leaflets and the Hackathon Data Spaces poster.',
        description: [
          'Beyond the campaign, contribution to the graphic material of DS4M Mediterráneo for events and outreach.',
          'More than 30 pieces, including the team T-shirts, the photocall, the information leaflet and the poster for the Hackathon Data Spaces, held at Las Naves (Valencia) on 27 and 28 June 2026.',
        ],
        highlights: [
          'More than 30 designs for different media',
          'Project T-shirts and merchandising',
          'Photocall for events',
          'Tri-fold leaflet (outside and inside)',
          'Hackathon Data Spaces poster',
        ],
        stack: ['Branding', 'Merchandising', 'Editorial', 'Posters'],
        gallery: [
          { alt: 'Attendees at a presentation wearing DS4M T-shirts' },
          { alt: 'Hackathon Data Spaces poster at Las Naves, Valencia, on 27 and 28 June' },
          { alt: 'DS4M Mediterráneo photocall design' },
          { alt: 'DS4M Mediterráneo leaflet, outside' },
          { alt: 'DS4M Mediterráneo leaflet, inside' },
        ],
      },
      playversex: {
        context: 'Master\'s thesis · TWCAM',
        alt: 'PlayVerseX “Global top” catalogue with video game covers and their ratings',
        summary: 'Video game recommendation platform with a Node.js and MongoDB backend and two frontends, in Angular and in React.',
        description: [
          'Master\'s thesis: a website that recommends video games based on the user\'s taste. The backend, built with Node.js and MongoDB, centralises the data and computes the recommendations.',
          'Two frontends were built on top of that same backend, one in Angular and one in React, with a catalogue, a page for each game, community reviews, a profile with progress tracking and filters by genre and platform.',
        ],
        highlights: [
          'Backend with Node.js and MongoDB',
          'Two frontends, in Angular and in React, on the same backend',
          'Personalised recommendations based on the user\'s taste',
        ],
        gallery: [
          { alt: 'Grand Theft Auto V page with a tracking panel by platform' },
          { alt: 'PlayVerseX community with the average rating and reviews' },
          { alt: 'User profile with completion progress and library' },
          { alt: 'Filters by genre and platform' },
        ],
      },
      'hackathon-video': {
        title: 'Hackathon Data Spaces video',
        context: 'DS4M Mediterráneo · Personal edit',
        alt: 'Group photo of the Hackathon Data Spaces participants in front of the event screen at Las Naves',
        summary: 'Personal edit of the recap video of the Hackathon Data Spaces at Las Naves (Valencia), not published on official channels.',
        description: [
          'On 27 and 28 June 2026, DS4M Mediterráneo organised a hackathon at Las Naves (Valencia), where several teams developed data-driven proposals to improve mobility.',
          'This video is a personal edit, not published on official channels, that sums up both days using footage recorded at the event.',
        ],
        highlights: [
          'Assembly and editing',
          'Pacing, music and colour grading',
          'Personal edit, not officially published',
        ],
        stack: ['Video editing', 'Post-production', 'CapCut'],
        links: [{ label: 'Watch on YouTube' }],
      },
      miracle: {
        alt: 'MIRACLE project poster with its pillars of data governance, digital autonomy and innovation',
        summary: 'Research project applying artificial intelligence to assist in robotic surgery.',
        description: [
          'MIRACLE is an IRTIC project, funded by the European Union, that researches how artificial intelligence can assist surgeons in robot-assisted laparoscopic procedures.',
          'Contribution to the software development and to defining the integration architecture between its applications, plus the use of AI tools to automate tasks and speed up development.',
        ],
        highlights: [
          'Development of part of the software',
          'Integration architecture between applications',
          'Task automation with AI',
        ],
        stack: ['AI', 'Software', 'Robotics'],
        gallery: [
          { alt: 'Project demo to a group wearing 3D glasses in front of an immersive screen' },
          { alt: 'Presentation of the MIRACLE project in an auditorium' },
          { alt: 'Robotic arm of the MIRACLE project' },
        ],
      },
      'intras-30': {
        title: 'INTRAS 30th anniversary',
        context: 'INTRAS · Motion and video',
        alt: 'INTRAS 30th anniversary logo, 1995–2025, with a figure walking along a green path inside the zero',
        summary: 'Logo animation for the INTRAS 30th anniversary and audiovisual content for social media.',
        description: [
          'Design and animation of the logo for the 30th anniversary of INTRAS, the Universitat de València institute specialising in traffic and road safety.',
          'It also includes editing the institute\'s videos for its social media.',
        ],
        highlights: ['Logo motion graphics', 'Video editing', 'Social media content'],
        stack: ['2D animation', 'CapCut', 'Post-production'],
      },
      portfolio: {
        title: 'This portfolio',
        context: 'Personal project',
        alt: 'Illustration of the minimal 3D robot with a visor and cyan eyes that follows the cursor',
        summary: 'This website, built from scratch, with a 3D robot that follows the cursor.',
        description: [
          'Built from scratch with HTML, CSS and JavaScript, without templates or frameworks. The robot on the home page is generated entirely in code with Three.js, with no external 3D models.',
          'It follows the cursor with its head and eyes and waves when clicked. The site is bilingual and includes an assistant that answers questions about the profile.',
        ],
        highlights: [
          '3D robot generated in code with Three.js',
          'Cursor tracking with head and eyes',
          'Lazy loading of assets and 3D rendering paused when off screen',
          'Keyboard navigable and respects the reduced-motion preference',
        ],
        links: [{ label: 'Back to the robot' }],
      },
    },
    logos: {
      'logo-ds4m': {
        context: 'European project logo',
        description: 'Contribution to its design. A central data network connects every mode of transport (walking, cycling, train, ship, plane, car, bus and lorry) alongside the Mediterranean coast drawn in a single line.',
        tools: ['Figma', 'Vector'],
        variants: [
          { label: 'Full', alt: 'Full DS4M Mediterráneo logo in white on navy, with the transport icons around the data network and the Mediterranean coast' },
          { label: 'Full light', alt: 'Full DS4M Mediterráneo logo in navy on a white background' },
          { label: 'Simplified', alt: 'Simplified version of the DS4M Mediterráneo logo: the data network in a white circle, the coast and the name' },
          { label: 'Simplified light', alt: 'Simplified version of the DS4M Mediterráneo logo in navy on white' },
        ],
      },
      'logo-intras': {
        context: 'Traffic and Road Safety Institute · UV',
        description: 'The institute\'s logo alongside the Universitat de València one, in vector format and with several versions adapted to any medium.',
        tools: ['Figma', 'Vector'],
        variants: [
          { label: 'Blue', alt: 'Universitat de València and INTRAS logo in blue on white' },
          { label: 'White', alt: 'Universitat de València and INTRAS logo in white on blue' },
          { label: 'Short', alt: 'Short version of the logo with the Universitat de València and the word INTRAS in white' },
        ],
      },
      'logo-intras-30': {
        title: 'INTRAS 30th anniversary',
        context: '1995 – 2025 · Commemorative logo',
        description: 'A child with a backpack walks out of the zero along a green path, between the same brackets used in the INTRAS logo. It includes an animated version for the anniversary videos.',
        tools: ['Figma', 'Vector', 'Animation'],
        variants: [
          { label: 'Original', alt: 'INTRAS 30th anniversary logo, 1995–2025, with a figure walking along a green path inside the zero' },
        ],
      },
    },
    press: [
      { date: '14 Jul 2026', title: 'INTRAS promotes joining the DS4M Mediterráneo Data Space' },
      { date: '14 Jul 2026', title: 'INTRAS encourages institutions and companies to join the DS4M Mediterráneo Data Space' },
      { date: '16 Jul 2026', title: 'INTRAS launches its first campaign bringing the Data Economy closer to society' },
      { title: '“Datæ Valor” kicks off, the INTRAS campaign to bring the Data Economy closer to the Mediterranean Corridor' },
      { title: 'DS4M Mediterráneo aims to respond to the mobility challenges of the Mediterranean Corridor' },
      { date: 'Interview', title: 'DS4M Mediterráneo helps organisations profit from their own data through exchanges and synergies' },
    ],
    stack: [
      { group: 'Languages and web' },
      { group: 'Cloud and databases' },
      { group: 'Version control and DevOps' },
      { group: 'Mobile' },
      { group: 'Design, 3D and multimedia' },
      { group: 'Microsoft 365' },
    ],
  };

  const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

  // mezcla el inglés encima del español: los arrays de objetos se mezclan posición a posición,
  // los de texto se sustituyen y las listas con id (proyectos, logos) se buscan por su id
  function merge(base, over) {
    if (over === undefined) return base;
    if (Array.isArray(base)) {
      if (isObj(over)) return base.map((item) => (item && item.id && over[item.id] ? merge(item, over[item.id]) : item));
      if (Array.isArray(over) && over.some(isObj)) return base.map((item, i) => merge(item, over[i]));
      return over;
    }
    if (isObj(base) && isObj(over)) {
      const out = { ...base };
      Object.keys(over).forEach((k) => { out[k] = merge(base[k], over[k]); });
      return out;
    }
    return over;
  }

  function initial() {
    const q = new URLSearchParams(global.location.search).get('lang');
    if (SUPPORTED.includes(q)) return q;
    try {
      const saved = global.localStorage.getItem(KEY);
      if (SUPPORTED.includes(saved)) return saved;
    } catch { /* sin almacenamiento: español */ }
    return 'es';
  }

  let lang = initial();
  const base = global.PORTFOLIO_DATA;
  const cache = { es: base };
  const original = new Map();

  function t(key, ...args) {
    const str = (UI[lang] && UI[lang][key]) || UI.es[key] || key;
    return str.replace(/\{(\d)\}/g, (_, i) => args[i]);
  }

  function data() {
    if (!cache[lang]) cache[lang] = merge(base, DATA_EN);
    return cache[lang];
  }

  const ATTRS = [['data-i18n-label', 'aria-label'], ['data-i18n-alt', 'alt'], ['data-i18n-ph', 'placeholder']];

  function applyPage() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      if (!original.has(el)) original.set(el, {});
      const o = original.get(el);
      if (o.html === undefined) o.html = el.innerHTML;
      el.innerHTML = lang === 'es' ? o.html : (PAGE_EN[el.dataset.i18n] ?? o.html);
    });
    ATTRS.forEach(([dataAttr, attr]) => {
      document.querySelectorAll(`[${dataAttr}]`).forEach((el) => {
        if (!original.has(el)) original.set(el, {});
        const o = original.get(el);
        if (o[attr] === undefined) o[attr] = el.getAttribute(attr);
        el.setAttribute(attr, lang === 'es' ? o[attr] : (PAGE_EN[el.getAttribute(dataAttr)] ?? o[attr]));
      });
    });
    document.documentElement.lang = lang;
    document.title = t('title');
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', t('description'));
    document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  }

  function set(next) {
    if (!SUPPORTED.includes(next) || next === lang) return;
    lang = next;
    try { global.localStorage.setItem(KEY, lang); } catch { /* da igual */ }
    const url = new URL(global.location.href);
    if (url.searchParams.has('lang')) {
      url.searchParams.set('lang', lang);
      global.history.replaceState(null, '', url);
    }
    applyPage();
    global.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('[data-lang]');
    if (btn) set(btn.dataset.lang);
  });

  if (lang !== 'es') applyPage();
  else document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === 'es')));
  document.documentElement.classList.remove('i18n-pending');

  global.I18N = {
    get lang() { return lang; },
    t, data, set,
  };
})(window);
