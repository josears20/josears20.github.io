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
    'about.title': 'I code, design <em>and edit video.</em>',
    'about.photo': 'Portrait of Jose Antonio Cuerda Aparicio wearing a dark blazer and white shirt',
    'about.hello': 'Hi, I\'m Jose.',
    'about.p1': 'I\'m a <strong>Multimedia Engineer</strong> from the Universitat de València and I hold a <strong>Master\'s in Web Technologies, Cloud Computing and Mobile Apps (TWCAM)</strong>. I work at research institutes of the UV building websites, 3D applications and tools to collect and analyse data.',
    'about.p2': 'I have <strong>frontend</strong> and <strong>backend</strong> experience in <strong>European projects</strong>. At DS4M Mediterráneo I worked with the team on the website, both the interface and the server, and at MIRACLE I wrote part of the software and organised how its applications connected to each other.',
    'focus.label': 'What I do',
    'focus.web': '<strong>Full websites</strong><span>What you see and what\'s behind it: Node.js, React, Angular, PHP and databases.</span>',
    'focus.3d': '<strong>Interactive 3D</strong><span>Applications and simulations with Unity and C#, Three.js and Blender.</span>',
    'focus.mobile': '<strong>Mobile apps</strong><span>Android with Kotlin, Ionic and React Native.</span>',
    'focus.design': '<strong>Design and video</strong><span>Vector logos in Figma, posters, campaigns, animation and video editing.</span>',
    'loc.label': 'Based in',
    'loc.map': 'Map of the Iberian Peninsula with Valencia marked on the Mediterranean coast',
    'loc.city': 'Valencia, Spain',
    'langs.label': 'Languages',
    'langs.es': 'Spanish',
    'langs.va': 'Valencian',
    'langs.en': 'English',
    'langs.native': 'Native',
    'langs.b2': 'B2 certified',
    'langs.b1': 'B1 (not certified)',
    'method.label': 'How I work',
    'method.chips': '<li class="chip">In a team</li><li class="chip">In sprints (Scrum)</li><li class="chip">With AI as a helper</li><li class="chip">Finding solutions</li><li class="chip">Caring about details</li><li class="chip">Social media</li>',

    'xp.cmd': '<span class="cmd-path">~/experience</span> <span class="cmd-sign">$</span> git log',
    'xp.title': 'Where I\'ve worked <em>so far.</em>',
    'xp.chips': 'Technologies and areas',
    'xp1.img': 'Illustration of the work at IRTIC with the DS4M Mediterráneo data corridor, the Datæ Valor campaign poster, the MIRACLE robotic arm and branding and video pieces',
    'xp1.date': '<time datetime="2025-11">Nov 2025</time> – <time datetime="2026-08">Aug 2026</time>',
    'xp1.list': '<li>At <strong>MIRACLE</strong>, a project that uses AI to assist in operations with surgical robots, I wrote part of the software and organised how its applications connected. I also used AI to automate tasks.</li><li>Web development for the European project <strong>DS4M Mediterráneo</strong>, working in sprints with the team (Scrum).</li><li>I took part in designing the visual identity, the merchandising and the <strong>Datæ Valor</strong> campaign, which ran on bus shelters and in stations all over Spain and was covered by the press.</li><li>Databases, deploying the websites and improvements so they loaded faster.</li><li>Video editing, social media and maintenance of the <a class="inline-link" href="https://ds4mmed.uv.es/index.php/es/" target="_blank" rel="noopener">official website</a>.</li>',
    'xp1.chips': '<li class="chip">AI</li><li class="chip">Full Stack</li><li class="chip">Scrum</li><li class="chip">Databases</li><li class="chip">Branding</li>',
    'xp2.img': 'Illustration of the work at INTRAS with the DS4M Mediterráneo web portal, the ESCOLA measurement platform and the editing of the 30th anniversary video',
    'xp2.tag': 'Extracurricular internship',
    'xp2.list': '<li>Parts of the website and tools for the team of the European project <strong>DS4M Mediterráneo</strong>.</li><li>A platform for the <strong>ESCOLA</strong> project that records and analyses how children react to dangerous situations.</li><li>Design, development and deployment of websites with WordPress, HTML, CSS, JavaScript and PHP.</li><li>Videos for the institute and the logo animation for the <strong>INTRAS 30th anniversary</strong>.</li>',
    'xp2.note': 'During this period I also built my <strong>bachelor\'s thesis</strong>, <a class="inline-link" href="https://youtu.be/04wgOXJavtA" target="_blank" rel="noopener">VialGo</a>, an interactive 3D app for learning to drive.',
    'xp3.img': 'Illustration of the Unity editor with the 3D scene of a school from the ESCOLA project and a C# script',
    'xp3.tag': 'Curricular internship',
    'xp3.list': '<li>Interactive applications for the <a class="inline-link" href="https://www.uv.es/uvweb/instituto-universitario-investigacion-transito-seguridad-vial-INTRAS/es/grupos-investigacion/dats/experiencia-investigacion/escola-entornos-seguros-colegios-libres-accidentes-1285893039971/ProjecteInves.html?id=1286330274153" target="_blank" rel="noopener"><strong>ESCOLA</strong></a> project (Safe Environments, Accident-Free Schools).</li><li>Programming in <strong>C#</strong> with <strong>Unity</strong>.</li><li>3D scenes and testing so everything ran smoothly.</li>',
    'xp3.chips': '<li class="chip">Unity</li><li class="chip">C#</li><li class="chip">3D</li><li class="chip">Testing</li>',

    'projects.cmd': '<span class="cmd-path">~/projects</span> <span class="cmd-sign">$</span> ls',
    'projects.title': 'Some things <em>I\'ve made.</em>',
    'projects.filter': 'Filter projects',
    'logos.title': 'Logos I\'ve designed, <em>all in vector.</em>',
    'logos.lead': 'I drew them in Figma as vectors, so they look just as sharp on a business card as on a banner several metres wide. Each one has a version for light and dark backgrounds.',
    'press.cmd': '<span class="cmd-path">~/press</span> <span class="cmd-sign">$</span> grep "Datæ Valor"',
    'press.title': 'The campaign <em>in the media.</em>',
    'press.lead': 'The DS4M Mediterráneo Datæ Valor campaign, which I helped design, ran on bus shelters and in stations all over Spain, its ads aired on TV, Netflix, Prime Video and Spotify, and several media outlets covered it.',
    'stack.cmd': '<span class="cmd-path">~/stack</span> <span class="cmd-sign">$</span> cat tools.txt',
    'stack.title': 'What I <em>work with.</em>',
    'edu.cmd': '<span class="cmd-path">~/education</span> <span class="cmd-sign">$</span> cat studies.md',
    'edu.title': 'What I <em>have studied.</em>',
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
        summary: 'A website to log and rate everything you watch, play, listen to and read: films, series, video games, music, books and anime in one profile.',
        description: [
          'Orbitaly brings together everything you watch, play, listen to and read in one place, instead of spreading it across several apps. You can rate it, write reviews, make lists and see what your friends are watching or playing.',
          'The hardest part was combining information from very different sources. The data comes from seven services (TMDB, IGDB, Spotify, Apple Music, Google Books, Open Library and AniList) and I had to make everything look and work the same way.',
        ],
        highlights: [
          'Information from seven different services in a single website',
          'Ratings from 1 to 10, reviews and lists (to do, in progress, finished)',
          'Feed with what your friends are doing, private messages and public or private profiles',
          'Recommendations based on what you have rated',
          'An AI assistant that recommends titles and adds them to your library',
          'Year in review and stats on what you have watched',
          'Browser extension that imports what you already had on IMDb, Letterboxd, Steam, Goodreads and others',
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
        summary: 'The official website of the European project DS4M Mediterráneo, which I worked on for two years.',
        description: [
          'DS4M Mediterráneo is a European project that wants companies and institutions along the Mediterranean Corridor to share data to improve transport and mobility.',
          'First at INTRAS and then at IRTIC, I was part of the team behind its official website: I took part in its design, development and maintenance. I also helped with other web tools for the team, the databases and deploying changes.',
        ],
        highlights: [
          'Involved in the design, development and maintenance of the website',
          'Web tools for the project team',
          'Working in sprints with the rest of the team (Scrum)',
          'Databases, deploying changes and keeping the site fast',
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
        summary: 'Unity applications and a platform to study how children react to dangerous traffic situations.',
        description: [
          'ESCOLA is an INTRAS research project, funded by the Generalitat Valenciana, that studies why traffic accidents happen near schools and how they can be prevented.',
          'I started by building interactive 3D applications with Unity and C#. Later I built a platform to record and analyse how children\'s brains react when they face a dangerous situation.',
        ],
        highlights: [
          'Interactive 3D applications with Unity and C#',
          'Platform to record and analyse children\'s reactions',
          'Testing so everything ran smoothly',
        ],
        stack: ['Unity', 'C#', '3D', 'Data analysis'],
        links: [{ label: 'Project page' }],
      },
      'datae-valor': {
        title: 'Datæ Valor campaign',
        context: 'INTRAS · DS4M Mediterráneo · Branding and advertising',
        alt: 'Datæ Valor campaign piece with the slogan “Join the data economy” and the Mediterranean Corridor drawn in light',
        summary: 'The “Join the data economy” campaign, which ran on bus shelters and station screens all over Spain and was covered by the press.',
        description: [
          'Datæ Valor was INTRAS\'s first campaign to explain what the data economy is and to encourage companies and institutions to join DS4M Mediterráneo.',
          'I took part in designing the campaign\'s look and its pieces, which appeared on posters, bus shelters and station screens all over Spain, and it was covered by outlets such as Cadena SER, Europa Press and El Publicista.',
        ],
        highlights: [
          'Involved in the campaign\'s look and style',
          'Posters, digital screens and social media pieces',
          'Photocall for events',
          'Covered by national and regional press',
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
        summary: 'The Datæ Valor campaign ads, which aired on TV, Netflix, Prime Video and Spotify.',
        description: [
          'The Datæ Valor campaign didn\'t stop at posters: it also had ads that aired on TV and on platforms such as Netflix, Prime Video and Spotify.',
          'I took part in editing the spot, following the same style as the rest of the campaign. Here are both ads.',
        ],
        highlights: [
          'Aired on TV',
          'Also on Netflix, Prime Video and Spotify',
          'Same style as the campaign posters and screens',
        ],
        stack: ['Video editing', 'Post-production', 'CapCut'],
        videos: [{ title: 'Ad 1' }, { title: 'Ad 2' }],
        links: [{ label: 'Ad 1 on YouTube' }, { label: 'Ad 2 on YouTube' }],
      },
      'drink-shot': {
        context: 'Android app · Google Play',
        alt: 'Three screens of the Drink Shot app with a neon look, the central button, the game modes menu and a “Never have I ever” card',
        summary: 'Party game for Android published on Google Play, with a neon look, four game modes and sound effects.',
        description: [
          'Drink Shot is a mobile party game, published on Google Play, made to liven up any get-together with friends.',
          'It has the modes Never have I ever, Truth or dare, Who\'s most likely to…? and Spin the bottle, plus a central button that picks a random challenge. I put a lot of care into the neon look, the animations and the sounds.',
        ],
        highlights: [
          'Published on Google Play',
          'Four game modes and random challenges',
          'Neon look with animations and sound',
        ],
        links: [{ label: 'See on Google Play' }],
      },
      vialgo: {
        title: 'VialGo · 3D Driving Education',
        context: 'Bachelor\'s thesis · Multimedia Engineering',
        alt: 'Screenshot of VialGo with the logo, a red car on a mountain road and the level 1 completed screen with three stars',
        summary: 'A 3D application to learn to drive by practising, with levels, traffic and real road situations.',
        description: [
          'It is my bachelor\'s thesis: “Road Safety Education in the Digital Age. Interactive 3D Application for Learning to Drive”.',
          'The idea is to learn the rules by driving instead of memorising them. VialGo has levels with traffic and situations you find on the road, a free mode to practise and a theory section.',
        ],
        highlights: [
          '3D driving organised in levels',
          'You learn the rules by practising',
          'I did everything myself: design, programming and 3D scenes',
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
        summary: 'I took part in more than 30 designs for the project: T-shirts, photocall, leaflets and the Hackathon Data Spaces poster.',
        description: [
          'Besides the campaign, I helped design material for the DS4M Mediterráneo project for its events and to raise awareness.',
          'In total there are more than 30 designs, including the team T-shirts, the photocall, the information leaflet and the poster for the Hackathon Data Spaces, held at Las Naves (Valencia) on 27 and 28 June 2026.',
        ],
        highlights: [
          'More than 30 designs for all kinds of media',
          'Project T-shirts and merchandising',
          'Photocall for events',
          'Tri-fold leaflet, outside and inside',
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
        summary: 'A website that recommends video games based on your taste, with a Node.js server and two versions of the frontend, in Angular and in React.',
        description: [
          'PlayVerseX is my master\'s thesis: a website that recommends video games based on what you like. The server side is built with Node.js and MongoDB, and it is what calculates the recommendations.',
          'On top of that same server I built two versions of the website, one in Angular and one in React. They have a game catalogue, a page for each game, reviews from other users, a profile with your progress and filters by genre and platform.',
        ],
        highlights: [
          'Server with Node.js and MongoDB',
          'Two versions of the website, in Angular and in React, on the same server',
          'Recommendations based on your taste',
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
        summary: 'Personal edit of the Hackathon Data Spaces video at Las Naves (Valencia). It was not published on any official channel.',
        description: [
          'On 27 and 28 June 2026, DS4M Mediterráneo organised a hackathon at Las Naves (Valencia): two days in which several teams looked for ideas to improve mobility using data.',
          'This video was never published officially. I edited it on my own, with footage from the event, to sum up how those two days went.',
        ],
        highlights: [
          'Video editing and assembly',
          'Pacing, music and colour',
          'Personal edit, not officially published',
        ],
        stack: ['Video editing', 'Post-production', 'CapCut'],
        links: [{ label: 'Watch on YouTube' }],
      },
      miracle: {
        alt: 'MIRACLE project poster with its pillars of data governance, digital autonomy and innovation',
        summary: 'A research project that uses artificial intelligence to assist in operations with surgical robots.',
        description: [
          'MIRACLE is an IRTIC project, funded by the European Union, that researches how artificial intelligence can help surgeons in robot-assisted laparoscopic operations.',
          'My job was to write part of the software and decide how its applications were organised and connected to each other. I also used AI tools to automate tasks and work faster.',
        ],
        highlights: [
          'Wrote part of the software',
          'Organised how the applications fit together',
          'Used AI to automate everyday tasks',
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
        summary: 'The INTRAS 30th anniversary logo animation and videos for its social media.',
        description: [
          'I designed and animated the logo for the 30th anniversary of INTRAS, the Universitat de València institute that researches traffic and road safety.',
          'I also edited videos for the institute\'s social media.',
        ],
        highlights: ['Logo animation', 'Video editing', 'Social media content'],
        stack: ['2D animation', 'CapCut', 'Post-production'],
      },
      portfolio: {
        title: 'This portfolio',
        context: 'Personal project',
        alt: 'Illustration of the minimal 3D robot with a visor and cyan eyes that follows the cursor',
        summary: 'The website you are looking at, built from scratch, with a 3D robot that follows you with its eyes.',
        description: [
          'I built this website from scratch with HTML, CSS and JavaScript, without templates. The robot on the home page is made with Three.js, entirely in code, without downloading any 3D model.',
          'It moves its head and eyes following your mouse and, if you click it, it waves at you.',
        ],
        highlights: [
          '3D robot made only with code',
          'Follows the mouse with its head and eyes',
          'Loads fast and stops animating when you are not looking at it',
          'Keyboard accessible and respects reduced-motion preferences',
        ],
        links: [{ label: 'Back to the robot' }],
      },
    },
    logos: {
      'logo-ds4m': {
        context: 'European project logo',
        description: 'I took part in its design. It has a data network at its centre, connected to every way of getting around (walking, cycling, train, ship, plane, car, bus and lorry) and the Mediterranean coast drawn in a single line.',
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
        description: 'The institute\'s logo alongside the Universitat de València one, in vector and in several versions to use on any medium.',
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
        description: 'A child with a backpack walks out of the zero along a green path, between the same brackets used in the INTRAS logo. I also animated it for the anniversary videos.',
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
