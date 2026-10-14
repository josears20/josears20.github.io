/* ==========================================================================
   data.js — Contenido del portfolio
   --------------------------------------------------------------------------
   Toda la información editable vive aquí. ui.js lee este objeto para pintar
   proyectos, modal, prensa y stack, así que añadir un proyecto nuevo es
   añadir un objeto al array `projects`.

   Campos opcionales de un proyecto
     links    botones del modal  [{ label, url }]
     video    { youtube: 'ID' }  → reproductor en el modal (se carga al pulsar)
     videos   [{ youtube, title }] → varios vídeos (el primero arriba, el resto debajo)
     gallery  imágenes extra     [{ src, alt }]
     press    true → el modal muestra la lista `press` de abajo
     detailImage  imagen que se ve al abrir el proyecto (si no, se usa `image`)
     imageFit     'contain' para logos que no deben recortarse

   IMÁGENES
   Formato .webp a 1200×750. Las .svg son ilustraciones para los proyectos
   que aún no tienen captura real; basta con cambiar la ruta en `image`.
   ========================================================================== */

window.PORTFOLIO_DATA = {
  profile: {
    name: 'Jose Antonio Cuerda Aparicio',
    email: 'joseacuerda@gmail.com',
    linkedin: 'https://www.linkedin.com/in/jose-antonio-cuerda-aparicio-800428185/',
    github: '', // TODO añade tu URL de GitHub y aparecerá en Contacto
    cv: 'CV_JoseAntonioCuerda.pdf',
  },

  /* Categorías que usan los filtros (data-filter en index.html) */
  categories: {
    web: 'Web y Full Stack',
    '3d': '3D y Unity',
    mobile: 'Mobile',
    design: 'Diseño',
    video: 'Vídeo',
  },

  /* ------------------------------------------------------------------------
     Proyectos (featured: true → ocupa dos columnas en escritorio)
     ------------------------------------------------------------------------ */
  projects: [
    {
      id: 'orbitaly',
      title: 'Orbitaly',
      context: 'Proyecto personal',
      year: '',
      categories: ['web'],
      featured: true,
      image: 'assets/img/projects/orbitaly.webp',
      alt: 'Página de inicio de Orbitaly con el titular «Todo lo que ves, juegas y escuchas en un solo perfil» y accesos a películas, series, videojuegos, música, libros y anime',
      summary: 'Una web para guardar y puntuar todo lo que ves, juegas, escuchas y lees: películas, series, videojuegos, música, libros y anime en un mismo perfil.',
      description: [
        'Orbitaly junta en un mismo sitio todo lo que ves, juegas, escuchas y lees, en lugar de tenerlo repartido en varias apps. Puedes puntuarlo, escribir reseñas, hacer listas y ver qué están viendo o jugando tus amigos.',
        'Lo más difícil fue juntar información que viene de sitios muy distintos. Los datos salen de siete servicios (TMDB, IGDB, Spotify, Apple Music, Google Books, Open Library y AniList) y tuve que conseguir que todo se viera y funcionara igual.',
      ],
      highlights: [
        'Información de siete servicios distintos en una sola web',
        'Notas del 1 al 10, reseñas y listas (pendiente, en curso, terminado)',
        'Feed con lo que hacen tus amigos, mensajes privados y perfiles públicos o privados',
        'Recomendaciones según lo que has puntuado',
        'Un asistente con IA que te recomienda títulos y los añade a tu biblioteca',
        'Resumen de tu año y estadísticas de lo que has visto',
        'Extensión para el navegador que importa lo que ya tenías en IMDb, Letterboxd, Steam, Goodreads y otras',
      ],
      stack: ['APIs externas', 'IA', 'TMDB', 'IGDB', 'Spotify', 'AniList', 'Extensión de navegador'],
      gallery: [
        { src: 'assets/img/projects/orbitaly/01.webp', alt: 'Catálogo de películas de Orbitaly con carteles y filtros' },
        { src: 'assets/img/projects/orbitaly/02.webp', alt: 'Perfil de usuario con su top 5 de títulos' },
        { src: 'assets/img/projects/orbitaly/03.webp', alt: 'Panel de estadísticas de la biblioteca con gráficos por sección y por nota' },
        { src: 'assets/img/projects/orbitaly/04.webp', alt: 'Asistente de Orbitaly entrenado con IA para pedir recomendaciones' },
        { src: 'assets/img/projects/orbitaly/05.webp', alt: 'Resumen anual personalizado «Mi 2026 en Orbitaly»' },
        { src: 'assets/img/projects/orbitaly/06.webp', alt: 'Mensajes directos privados entre usuarios' },
      ],
      links: [{ label: 'Visitar Orbitaly', url: 'https://orbitaly.lovable.app/' }],
    },
    {
      id: 'ds4m-web',
      title: 'Portal DS4M Mediterráneo',
      context: 'INTRAS e IRTIC · Proyecto europeo',
      year: '2024–2026',
      categories: ['web'],
      featured: false,
      image: 'assets/img/projects/ds4m-web.webp',
      alt: 'Portada del portal web DS4M Mediterráneo, Data Space for Mobility, con una vista aérea de la catedral de Cádiz',
      summary: 'La web oficial del proyecto europeo DS4M Mediterráneo: diseño, programación y mantenimiento durante dos años.',
      description: [
        'DS4M Mediterráneo es un proyecto europeo que quiere que empresas e instituciones del Corredor Mediterráneo compartan datos para mejorar el transporte y la movilidad.',
        'Primero en el INTRAS y después en el IRTIC, me encargué de su web oficial: la diseñé, la programé y la he ido manteniendo. También hice otras herramientas web para el equipo y me ocupé de las bases de datos y de publicar los cambios.',
      ],
      highlights: [
        'Diseño, programación y mantenimiento de la web oficial',
        'Herramientas web para el equipo del proyecto',
        'Trabajo por sprints con el resto del equipo (Scrum)',
        'Bases de datos, publicación de cambios y que la web cargue rápido',
      ],
      stack: ['WordPress', 'PHP', 'JavaScript', 'HTML/CSS', 'Bases de datos', 'Scrum'],
      gallery: [
        { src: 'assets/img/projects/ds4m-web/01.webp', alt: 'Sección del portal con los beneficios de participar en el proyecto' },
        { src: 'assets/img/projects/ds4m-web/02.webp', alt: 'Página de la campaña Datæ Valor dentro del portal' },
        { src: 'assets/img/projects/ds4m-web/03.webp', alt: 'Página Mass Media con las apariciones del proyecto en medios' },
        { src: 'assets/img/projects/ds4m-web/04.webp', alt: 'Asistente paso a paso para participar en el espacio de datos' },
      ],
      links: [{ label: 'Visitar la web', url: 'https://ds4mmed.uv.es/index.php/es/' }],
    },
    {
      id: 'escola',
      title: 'ESCOLA',
      context: 'INTRAS · Entornos Seguros COlegios Libres de Accidentes',
      year: '2024–2025',
      categories: ['3d', 'web'],
      featured: false,
      image: 'assets/img/projects/escola.webp',
      imageFit: 'contain',
      alt: 'Logotipo del proyecto ESCOLA, un adulto y un niño caminando sobre unas manos dentro de un círculo naranja',
      summary: 'Aplicaciones en Unity y una plataforma para estudiar cómo reaccionan los niños ante situaciones de peligro en el tráfico.',
      description: [
        'ESCOLA es un proyecto de investigación del INTRAS, financiado por la Generalitat Valenciana, que estudia por qué hay accidentes de tráfico cerca de los colegios y cómo se pueden evitar.',
        'Empecé haciendo aplicaciones interactivas en 3D con Unity y C#. Más adelante hice una plataforma para registrar y analizar cómo reacciona el cerebro de los niños cuando se encuentran con una situación de peligro.',
      ],
      highlights: [
        'Aplicaciones interactivas en 3D con Unity y C#',
        'Plataforma para registrar y analizar las reacciones de los niños',
        'Pruebas para que todo funcionara fluido',
      ],
      stack: ['Unity', 'C#', '3D', 'Análisis de datos'],
      links: [{ label: 'Ficha del proyecto', url: 'https://www.uv.es/uvweb/instituto-universitario-investigacion-transito-seguridad-vial-INTRAS/es/grupos-investigacion/dats/experiencia-investigacion/escola-entornos-seguros-colegios-libres-accidentes-1285893039971/ProjecteInves.html?id=1286330274153' }],
    },
    {
      id: 'datae-valor',
      title: 'Campaña Datæ Valor',
      context: 'INTRAS · DS4M Mediterráneo · Branding y publicidad',
      year: '2026',
      categories: ['design'],
      featured: true,
      image: 'assets/img/projects/ds4m-campaign.webp',
      alt: 'Pieza de la campaña Datæ Valor con el lema «Introdúcete en la economía del dato» y el Corredor Mediterráneo dibujado con luz',
      summary: 'La campaña «Introdúcete en la economía del dato», que se vio en marquesinas y pantallas de estaciones de toda España y salió en prensa.',
      description: [
        'Datæ Valor fue la primera campaña del INTRAS para explicar qué es la economía del dato y animar a empresas e instituciones a unirse a DS4M Mediterráneo.',
        'Hice la imagen de la campaña y todas sus piezas. Se vieron en carteles, marquesinas de autobús y pantallas de estaciones de toda España, y salió en medios como Cadena SER, Europa Press y El Publicista.',
      ],
      highlights: [
        'Imagen y estilo de toda la campaña',
        'Carteles, pantallas digitales y piezas para redes sociales',
        'Photocall para eventos',
        'Salió en prensa nacional y regional',
      ],
      stack: ['Branding', 'Diseño gráfico', 'Publicidad exterior'],
      gallery: [
        { src: 'assets/img/projects/ds4m-campaign-screen.webp', alt: 'Pantalla digital en una estación mostrando la campaña Datæ Valor con un código QR' },
        { src: 'assets/img/projects/datae-valor/01.webp', alt: 'Pantallas de la campaña Datæ Valor en el acceso a una estación' },
        { src: 'assets/img/projects/datae-valor/02.webp', alt: 'Cartel vertical de la campaña Datæ Valor en una estación' },
        { src: 'assets/img/projects/datae-valor/03.webp', alt: 'Photocall de Datæ Valor montado en un evento' },
      ],
      press: true,
      links: [],
    },
    {
      id: 'spot-datae-valor',
      title: 'Anuncios de Datæ Valor',
      context: 'DS4M Mediterráneo · Televisión y streaming',
      year: '2026',
      categories: ['video', 'design'],
      featured: true,
      image: 'assets/img/projects/spot-tv.svg',
      alt: 'Ilustración de un televisor emitiendo el anuncio de Datæ Valor junto a las plataformas Televisión, Spotify, Netflix y Prime Video',
      summary: 'Los anuncios de la campaña Datæ Valor, que se emitieron en televisión, Netflix, Prime Video y Spotify.',
      description: [
        'La campaña Datæ Valor no se quedó en los carteles: también tuvo anuncios que se emitieron en televisión y en plataformas como Netflix, Prime Video y Spotify.',
        'Edité el spot siguiendo el mismo estilo que el resto de la campaña. Aquí tienes los dos anuncios.',
      ],
      highlights: [
        'Emitidos en televisión',
        'También en Netflix, Prime Video y Spotify',
        'Mismo estilo que los carteles y las pantallas de la campaña',
      ],
      stack: ['Edición de vídeo', 'Postproducción', 'CapCut'],
      videos: [
        { youtube: '-WKdLYzoCZ0', title: 'Anuncio 1' },
        { youtube: 'kUIeW0deqAY', title: 'Anuncio 2' },
      ],
      links: [
        { label: 'Anuncio 1 en YouTube', url: 'https://youtu.be/-WKdLYzoCZ0' },
        { label: 'Anuncio 2 en YouTube', url: 'https://youtu.be/kUIeW0deqAY' },
      ],
    },
    {
      id: 'drink-shot',
      title: 'Drink Shot',
      context: 'App Android · Google Play',
      year: '',
      categories: ['mobile'],
      featured: false,
      image: 'assets/img/projects/drink-shot.webp',
      alt: 'Tres pantallas de la app Drink Shot con estética neón, el botón central, el menú de modos de juego y una carta de «Yo nunca»',
      summary: 'Juego de fiesta para Android publicado en Google Play, con estética neón, cuatro modos de juego y efectos de sonido.',
      description: [
        'Drink Shot es un juego de fiesta para móvil, publicado en Google Play, pensado para animar cualquier reunión entre amigos.',
        'Tiene los modos Yo nunca, Verdad o reto, ¿Quién es más…? y El juego de la botella, y un botón central que elige un reto al azar. Le dediqué mucho cariño al aspecto neón, a las animaciones y a los sonidos.',
      ],
      highlights: [
        'Publicada en Google Play',
        'Cuatro modos de juego y retos al azar',
        'Estética neón con animaciones y sonido',
      ],
      stack: ['Android', 'Mobile', 'UI/UX', 'Google Play'],
      links: [{ label: 'Ver en Google Play', url: 'https://play.google.com/store/apps/details?id=com.drink.shot&hl=es_419' }],
    },
    {
      id: 'vialgo',
      title: 'VialGo · Educación Vial 3D',
      context: 'Trabajo Fin de Grado · Ingeniería Multimedia',
      year: '2025',
      categories: ['3d'],
      featured: true,
      image: 'assets/img/projects/vialgo-cover.svg',
      detailImage: 'assets/img/projects/educacion-vial.webp',
      alt: 'Captura de VialGo con el logotipo, un coche rojo en una carretera de montaña y la pantalla de nivel 1 completado con tres estrellas',
      summary: 'Una aplicación en 3D para aprender a conducir practicando, con niveles, tráfico y situaciones reales de la carretera.',
      description: [
        'Es mi Trabajo Fin de Grado: «Educación Vial en la Era Digital. Aplicación en 3D Interactiva para el Aprendizaje de la Conducción».',
        'La idea es aprender las normas conduciendo en lugar de memorizarlas. VialGo tiene niveles con tráfico y situaciones que te encuentras en la carretera, un modo libre para practicar y un apartado de teoría.',
      ],
      highlights: [
        'Conducción en 3D organizada por niveles',
        'Se aprenden las normas practicando',
        'Lo hice todo yo: diseño, programación y escenarios 3D',
      ],
      stack: ['Unity', 'C#', '3D interactivo'],
      video: { youtube: '04wgOXJavtA' },
      gallery: [
        { src: 'assets/img/projects/vialgo/01.webp', alt: 'Vista de conducción desde el interior del coche' },
        { src: 'assets/img/projects/vialgo/02.webp', alt: 'Circuito 3D entre montañas nevadas' },
        { src: 'assets/img/projects/vialgo/03.webp', alt: 'Personaje al volante con la indicación de cómo coger el volante' },
        { src: 'assets/img/projects/vialgo/04.webp', alt: 'Menú de VialGo con selección de niveles, modo libre y teoría' },
      ],
      links: [{ label: 'Ver vídeo en YouTube', url: 'https://youtu.be/04wgOXJavtA' }],
    },
    {
      id: 'ds4m-branding',
      title: 'Branding DS4M Mediterráneo',
      context: 'INTRAS e IRTIC · Identidad y merchandising',
      year: '2025–2026',
      categories: ['design'],
      featured: false,
      image: 'assets/img/projects/ds4m-branding.webp',
      alt: 'Mockup de las camisetas de DS4M Mediterráneo por delante y por detrás con el lema Data Space for Mobility',
      summary: 'Más de 30 diseños para el proyecto: camisetas, photocall, trípticos y el cartel del Hackathon Data Spaces.',
      description: [
        'Además de la campaña, diseñé el material del proyecto DS4M Mediterráneo para sus eventos y para darlo a conocer.',
        'En total son más de 30 diseños, entre ellos las camisetas del equipo, el photocall, el tríptico informativo y el cartel del Hackathon Data Spaces, que se celebró en Las Naves (Valencia) el 27 y 28 de junio de 2026.',
      ],
      highlights: [
        'Más de 30 diseños para todo tipo de soportes',
        'Camisetas y merchandising del proyecto',
        'Photocall para eventos',
        'Tríptico informativo con exterior e interior',
        'Cartel del Hackathon Data Spaces',
      ],
      stack: ['Branding', 'Merchandising', 'Editorial', 'Cartelería'],
      gallery: [
        { src: 'assets/img/projects/ds4m-branding/01.webp', alt: 'Asistentes a una presentación vistiendo las camisetas de DS4M' },
        { src: 'assets/img/projects/ds4m-branding/02.webp', alt: 'Cartel del Hackathon Data Spaces en Las Naves, Valencia, el 27 y 28 de junio' },
        { src: 'assets/img/projects/ds4m-branding/03.webp', alt: 'Diseño del photocall de DS4M Mediterráneo' },
        { src: 'assets/img/projects/ds4m-branding/04.webp', alt: 'Tríptico de DS4M Mediterráneo, cara exterior' },
        { src: 'assets/img/projects/ds4m-branding/05.webp', alt: 'Tríptico de DS4M Mediterráneo, cara interior' },
      ],
      links: [],
    },
    {
      id: 'playversex',
      title: 'PlayVerseX',
      context: 'Trabajo Fin de Máster · TWCAM',
      year: '2026',
      categories: ['web'],
      featured: true,
      image: 'assets/img/projects/playversex.webp',
      alt: 'Catálogo «Top globales» de PlayVerseX con carátulas de videojuegos y sus valoraciones',
      summary: 'Una web que te recomienda videojuegos según tus gustos, con el servidor en Node.js y dos versiones de la web, en Angular y en React.',
      description: [
        'PlayVerseX es mi Trabajo Fin de Máster: una web que te recomienda videojuegos según lo que te gusta. La parte del servidor está hecha con Node.js y MongoDB, y es la que calcula las recomendaciones.',
        'Encima de ese mismo servidor hice dos versiones de la web, una en Angular y otra en React. Tienen catálogo de juegos, ficha de cada juego, reseñas de otros usuarios, un perfil con tu progreso y filtros por género y plataforma.',
      ],
      highlights: [
        'Servidor con Node.js y MongoDB',
        'Dos versiones de la web, en Angular y en React, sobre el mismo servidor',
        'Recomendaciones según tus gustos',
      ],
      stack: ['Node.js', 'MongoDB', 'Angular', 'React'],
      gallery: [
        { src: 'assets/img/projects/playversex/01.webp', alt: 'Ficha de Grand Theft Auto V con panel de seguimiento por plataforma' },
        { src: 'assets/img/projects/playversex/02.webp', alt: 'Comunidad PlayVerseX con la valoración media y las reseñas' },
        { src: 'assets/img/projects/playversex/03.webp', alt: 'Perfil de usuario con progreso de completado y biblioteca' },
        { src: 'assets/img/projects/playversex/04.webp', alt: 'Filtros por género y plataforma' },
      ],
      links: [],
    },
    {
      id: 'hackathon-video',
      title: 'Vídeo del Hackathon Data Spaces',
      context: 'DS4M Mediterráneo · Edición personal',
      year: '2026',
      categories: ['video'],
      featured: false,
      image: 'assets/img/projects/hackathon-video.webp',
      alt: 'Foto de grupo de los participantes del Hackathon Data Spaces frente a la pantalla del evento en Las Naves',
      summary: 'Edición personal del vídeo del Hackathon Data Spaces de Las Naves (Valencia). No se publicó en ningún canal oficial.',
      description: [
        'El 27 y 28 de junio de 2026, DS4M Mediterráneo organizó un hackathon en Las Naves (Valencia): dos días en los que varios equipos buscaron ideas para mejorar la movilidad usando datos.',
        'Este vídeo no salió en ningún sitio oficial. Lo edité por mi cuenta, con imágenes del evento, para resumir cómo fueron esos dos días.',
      ],
      highlights: [
        'Montaje y edición del vídeo',
        'Ritmo, música y color',
        'Edición personal, no publicada oficialmente',
      ],
      stack: ['Edición de vídeo', 'Postproducción', 'CapCut'],
      video: { youtube: 'Pimaux6KZI0' },
      links: [{ label: 'Ver en YouTube', url: 'https://youtu.be/Pimaux6KZI0' }],
    },
    {
      id: 'miracle',
      title: 'MIRACLE',
      context: 'IRTIC · Universitat de València',
      year: '2025–2026',
      categories: ['web'],
      featured: false,
      image: 'assets/img/projects/miracle.webp',
      alt: 'Cartel del proyecto MIRACLE con sus ejes de gobernanza del dato, autonomía digital e impulso a la innovación',
      summary: 'Un proyecto de investigación que usa inteligencia artificial para ayudar en operaciones con robots quirúrgicos.',
      description: [
        'MIRACLE es un proyecto del IRTIC, financiado por la Unión Europea, que investiga cómo la inteligencia artificial puede ayudar a los cirujanos en operaciones de laparoscopia hechas con robots.',
        'Mi trabajo fue programar parte del software y decidir cómo se organizaban y se conectaban entre sí sus aplicaciones. También usé herramientas de IA para automatizar tareas y trabajar más rápido.',
      ],
      highlights: [
        'Programación de parte del software',
        'Organización de cómo encajan las aplicaciones',
        'Uso de IA para automatizar tareas del día a día',
      ],
      stack: ['IA', 'Software', 'Robótica'],
      gallery: [
        { src: 'assets/img/projects/miracle/01.webp', alt: 'Demostración del proyecto ante un grupo con gafas 3D frente a una pantalla inmersiva' },
        { src: 'assets/img/projects/miracle/02.webp', alt: 'Presentación del proyecto MIRACLE en un auditorio' },
        { src: 'assets/img/projects/miracle/03.webp', alt: 'Brazo robótico del proyecto MIRACLE' },
      ],
      links: [],
    },
    {
      id: 'intras-30',
      title: '30º aniversario INTRAS',
      context: 'INTRAS · Motion y vídeo',
      year: '2025',
      categories: ['design', 'video'],
      featured: false,
      image: 'assets/img/projects/intras-30.webp',
      imageFit: 'contain',
      alt: 'Logotipo del 30 aniversario del INTRAS, 1995–2025, con una figura caminando sobre un camino verde dentro del cero',
      summary: 'La animación del logo del 30 aniversario del INTRAS y vídeos para sus redes sociales.',
      description: [
        'Diseñé y animé el logo del 30 aniversario del INTRAS, el instituto de la Universitat de València que investiga sobre tráfico y seguridad vial.',
        'También edité vídeos del instituto para sus redes sociales.',
      ],
      highlights: [
        'Animación del logo',
        'Edición de vídeo',
        'Contenido para redes sociales',
      ],
      stack: ['Animación 2D', 'CapCut', 'Postproducción'],
      links: [],
    },
    {
      id: 'portfolio',
      title: 'Este portfolio',
      context: 'Proyecto personal',
      year: '2026',
      categories: ['web', '3d'],
      featured: false,
      image: 'assets/img/projects/portfolio.svg',
      alt: 'Ilustración del robot 3D minimalista con visor y ojos cian que sigue el cursor',
      summary: 'La web que estás viendo, hecha desde cero, con un robot en 3D que te sigue con la mirada.',
      description: [
        'Hice esta web desde cero con HTML, CSS y JavaScript, sin plantillas. El robot de la portada está hecho con Three.js, todo con código, sin descargar ningún modelo 3D.',
        'Mueve la cabeza y los ojos siguiendo tu ratón y, si haces clic en él, te saluda.',
      ],
      highlights: [
        'Robot 3D hecho solo con código',
        'Sigue el ratón con la cabeza y los ojos',
        'Carga rápido y deja de animarse cuando no lo estás viendo',
        'Se puede usar con teclado y respeta si prefieres menos animaciones',
      ],
      stack: ['Three.js', 'WebGL', 'JavaScript', 'CSS'],
      links: [{ label: 'Volver al robot', url: '#inicio' }],
    },
  ],

  /* ------------------------------------------------------------------------
     Logos (sección «Logos»). Cada variante se ve sobre su fondo:
     bg: 'navy' | 'light' | 'dark' | 'white'
     ------------------------------------------------------------------------ */
  logos: [
    {
      id: 'logo-ds4m',
      title: 'DS4M Mediterráneo',
      context: 'Logo del proyecto europeo',
      description: 'Una red de datos en el centro, conectada con todas las formas de moverse (andando, en bici, tren, barco, avión, coche, autobús y camión) y la costa del Mediterráneo dibujada de una sola línea.',
      tools: ['Figma', 'Vectorial'],
      variants: [
        { label: 'Completo', src: 'assets/img/logos/ds4m-completo-oscuro.webp', bg: 'navy', alt: 'Logo completo de DS4M Mediterráneo en blanco sobre azul marino, con los iconos de transporte alrededor de la red de datos y la costa mediterránea' },
        { label: 'Completo claro', src: 'assets/img/logos/ds4m-completo-claro.webp', bg: 'white', alt: 'Logo completo de DS4M Mediterráneo en azul marino sobre fondo blanco' },
        { label: 'Simplificado', src: 'assets/img/logos/ds4m-simple-oscuro.webp', bg: 'navy', alt: 'Versión simplificada del logo de DS4M Mediterráneo: la red de datos en un círculo blanco, la costa y el nombre' },
        { label: 'Simplificado claro', src: 'assets/img/logos/ds4m-simple-claro.webp', bg: 'white', alt: 'Versión simplificada del logo de DS4M Mediterráneo en azul marino sobre blanco' },
      ],
    },
    {
      id: 'logo-intras',
      title: 'INTRAS',
      context: 'Instituto de Tráfico y Seguridad Vial · UV',
      description: 'El logo del instituto junto al de la Universitat de València, en vectorial y en varias versiones para usarlo en cualquier soporte.',
      tools: ['Figma', 'Vectorial'],
      variants: [
        { label: 'Azul', src: 'assets/img/logos/intras-azul.webp', bg: 'white', alt: 'Logo de la Universitat de València y del INTRAS en azul sobre blanco' },
        { label: 'Blanco', src: 'assets/img/logos/intras-blanco.webp', bg: 'navy', alt: 'Logo de la Universitat de València y del INTRAS en blanco sobre azul' },
        { label: 'Corto', src: 'assets/img/logos/intras-corto-blanco.webp', bg: 'dark', alt: 'Versión corta del logo con la Universitat de València y la palabra INTRAS en blanco' },
      ],
    },
    {
      id: 'logo-intras-30',
      title: '30 aniversario INTRAS',
      context: '1995 – 2025 · Logo conmemorativo',
      description: 'Un niño con mochila sale del cero por un camino verde, entre los mismos corchetes que usa el logo del INTRAS. También lo animé para los vídeos del aniversario.',
      tools: ['Figma', 'Vectorial', 'Animación'],
      variants: [
        { label: 'Original', src: 'assets/img/projects/intras-30.webp', bg: 'white', alt: 'Logo del 30 aniversario del INTRAS, 1995–2025, con una figura caminando sobre un camino verde dentro del cero' },
      ],
    },
  ],

  /* ------------------------------------------------------------------------
     Prensa (campaña Datæ Valor y DS4M Mediterráneo)
     ------------------------------------------------------------------------ */
  press: [
    {
      outlet: 'Cadena SER',
      date: '14 jul 2026',
      title: 'El INTRAS impulsa la adhesión al Espacio de Datos DS4M Mediterráneo',
      url: 'https://cadenaser.com/comunitat-valenciana/2026/07/14/el-intras-lanza-una-campana-de-comunicacion-para-incrementar-la-adhesion-de-instituciones-y-empresas-al-espacio-de-datos-ds4m-mediterraneo-radio-valencia/',
    },
    {
      outlet: 'Europa Press',
      date: '14 jul 2026',
      title: 'El INTRAS impulsa la adhesión de instituciones y empresas al Espacio de Datos DS4M Mediterráneo',
      url: 'https://www.europapress.es/comunitat-valenciana/noticia-intras-impulsa-adhesion-instituciones-empresas-espacio-datos-ds4m-mediterraneo-20260714133245.html',
    },
    {
      outlet: 'El Publicista',
      date: '16 jul 2026',
      title: 'INTRAS lanza su primera campaña que acerca la Economía del Dato a la sociedad',
      url: 'https://www.elpublicista.es/anunciantes/intras-lanza-primera-campana-acerca-economia-dato-sociedad',
    },
    {
      outlet: 'Universitat de València',
      date: '2026',
      title: 'Arranca «Datæ Valor», la campaña del INTRAS para acercar la Economía del Dato al Corredor Mediterráneo',
      url: 'https://www.uv.es/uvweb/instituto-universitario-investigacion-transito-seguridad-vial-INTRAS/es/instituto-universitario-investigacion-transito-seguridad-vial/arranca-dat-valor-campana-del-intras-acercar-economia-del-dato-al-corredor-mediterraneo-1285892783720/Novetat.html?id=1286499334146',
    },
    {
      outlet: 'Diario del Puerto',
      date: '2026',
      title: 'DS4M Mediterráneo apuesta por responder a los desafíos de la movilidad en el Corredor Mediterráneo',
      url: 'https://www.diariodelpuerto.com/logistica/ds4m-mediterraneo-apuesta-por-responder-a-los-desafios-de-la-movilidad-en-el-corredor-mediterraneo-LB26411291',
    },
    {
      outlet: 'El Referente',
      date: 'Entrevista',
      title: 'DS4M Mediterráneo ofrece a las entidades sacar rentabilidad de sus propios datos a través de intercambios y sinergias',
      url: 'https://elreferente.es/entrevistas/ds4m-mediterraneo-ofrece-a-las-entidades-sacar-rentabilidad-de-sus-propios-datos-a-traves-de-intercambios-y-sinergias-con-otras-entidades/',
    },
  ],

  /* ------------------------------------------------------------------------
     Stack técnico
     ------------------------------------------------------------------------ */
  stack: [
    {
      group: 'Lenguajes y web',
      color: '#5ce1ff',
      items: ['JavaScript', 'C#', 'Java', 'Python', 'PHP', 'React', 'Angular', 'Node.js', 'WordPress', 'HTML5/CSS3', 'C++'],
    },
    {
      group: 'Cloud y bases de datos',
      color: '#8b7bff',
      items: ['MongoDB', 'MySQL', 'PostgreSQL', 'Firebase'],
    },
    {
      group: 'Control de versiones y DevOps',
      color: '#4ade80',
      items: ['Git', 'GitHub', 'GitLab', 'Docker', 'Kubernetes'],
    },
    {
      group: 'Mobile',
      color: '#ffad7a',
      items: ['Android Studio', 'Kotlin', 'Ionic', 'React Native'],
    },
    {
      group: 'Diseño, 3D y multimedia',
      color: '#ff7ab8',
      items: ['Unity 3D', 'Three.js', 'Blender', 'Figma', 'Canva', 'CapCut'],
    },
    {
      group: 'Microsoft 365',
      color: '#7ab8ff',
      items: ['Word', 'Excel', 'PowerPoint', 'Project', 'Outlook', 'Teams', 'OneDrive', 'SharePoint'],
    },
  ],
};
