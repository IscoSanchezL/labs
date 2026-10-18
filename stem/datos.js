/* Catálogo de STEM Labs.
   VOZ: solo los laboratorios de 1° llevan narración con la voz de Beto (narracion.json + narrar.js). De 2° a 6° van SIN voz. Para agregar un experimento: añade una línea en EXPERIMENTOS.
   estado: 'listo' (tiene página) o 'pronto'. url: ruta relativa a esta carpeta. */
window.STEM = {
  categorias: {
    fisica:   { icono: '🔊', color: '#7ff0e4', es: 'Física y sonido',        en: 'Physics and sound' },
    luz:      { icono: '💡', color: '#ffc27a', es: 'Luz y electricidad',     en: 'Light and electricity' },
    materia:  { icono: '🧪', color: '#c3a6ff', es: 'Materia y química',      en: 'Matter and chemistry' },
    vida:     { icono: '🌱', color: '#8be8ae', es: 'Seres vivos',            en: 'Living things' },
    tierra:   { icono: '🌍', color: '#8cc5ff', es: 'Tierra y espacio',       en: 'Earth and space' },
    ingenieria:{ icono: '🏗️', color: '#ff9f9f', es: 'Ingeniería',            en: 'Engineering' },
    tecno:    { icono: '💻', color: '#f5d97a', es: 'Tecnología y datos',     en: 'Technology and data' }
  },
  grados: [1, 2, 3, 4, 5, 6],
  experimentos: [
    { id: 'sonidos', grado: 1, cat: 'fisica', estado: 'listo', url: 'actividades/sonidos/', icono: '🎵',
      es: { n: 'Sonidos que vibran', d: 'Toca un xilófono, un tambor y una cuerda. Descubre por qué suena fuerte, suave, agudo o grave.', a: 'El sonido es una vibración.' },
      en: { n: 'Sounds that vibrate', d: 'Play a xylophone, a drum and a string. Find out why a sound is loud, soft, high or low.', a: 'Sound is a vibration.' } },
    { id: 'sombras', grado: 1, cat: 'luz', estado: 'listo', url: 'actividades/sombras/', icono: '🔦',
      es: { n: 'Luz y sombras', d: 'Mueve una linterna y mira cómo cambia tu sombra.', a: 'La luz no pasa por los objetos.' },
      en: { n: 'Light and shadows', d: 'Move a flashlight and see how your shadow changes.', a: 'Light does not go through objects.' } },
    { id: 'sentidos', grado: 1, cat: 'vida', estado: 'listo', url: 'actividades/sentidos/', icono: '👀',
      es: { n: 'Mis cinco sentidos', d: 'Adivina objetos con la vista, el oído, el tacto, el olfato y el gusto.', a: 'Usamos los sentidos para conocer el mundo.' },
      en: { n: 'My five senses', d: 'Guess objects using sight, hearing, touch, smell and taste.', a: 'We use our senses to know the world.' } },
    { id: 'imanes', grado: 2, cat: 'fisica', estado: 'pronto', icono: '🧲',
      es: { n: 'Imanes', d: '¿Qué atrae un imán y qué no? Prueba objetos de todos los materiales.', a: 'Algunos materiales son atraídos por imanes.' },
      en: { n: 'Magnets', d: 'What does a magnet attract and what not? Test objects made of different materials.', a: 'Some materials are attracted by magnets.' } },
    { id: 'plantas', grado: 2, cat: 'vida', estado: 'pronto', icono: '🌻',
      es: { n: 'Cómo crece una planta', d: 'Riega, da luz y mira crecer una semilla.', a: 'Las plantas necesitan agua y luz.' },
      en: { n: 'How a plant grows', d: 'Water it, give it light and watch a seed grow.', a: 'Plants need water and light.' } },
    { id: 'mezclas', grado: 3, cat: 'materia', estado: 'pronto', icono: '🥤',
      es: { n: 'Mezclas y disoluciones', d: '¿Qué se disuelve en agua? Prueba sal, azúcar, arena y aceite.', a: 'Algunas mezclas se separan y otras no.' },
      en: { n: 'Mixtures and solutions', d: 'What dissolves in water? Try salt, sugar, sand and oil.', a: 'Some mixtures separate and others do not.' } },
    { id: 'ciclo-agua', grado: 3, cat: 'tierra', estado: 'pronto', icono: '🌧️',
      es: { n: 'El ciclo del agua', d: 'Sigue una gota: evaporación, nubes, lluvia y ríos.', a: 'El agua cambia de estado y vuelve a empezar.' },
      en: { n: 'The water cycle', d: 'Follow a drop: evaporation, clouds, rain and rivers.', a: 'Water changes state and starts again.' } },
    { id: 'planetas', grado: 4, cat: 'tierra', estado: 'pronto', icono: '🪐',
      es: { n: 'Sistema solar', d: 'Viaja por los planetas y compara tamaños y distancias.', a: 'Los planetas giran alrededor del Sol.' },
      en: { n: 'The solar system', d: 'Travel through the planets and compare sizes and distances.', a: 'Planets orbit the Sun.' } },
    { id: 'estructuras', grado: 5, cat: 'ingenieria', estado: 'listo', url: '../actividades/estructuras/', icono: '🌉',
      es: { n: 'Laboratorio de puentes', d: 'Diseña puentes, torres y voladizos en 3D y mide su factor de seguridad.', a: 'Los triángulos hacen fuertes las estructuras.' },
      en: { n: 'Bridge Lab', d: 'Design bridges, towers and cantilevers in 3D and measure their safety factor.', a: 'Triangles make structures strong.' } },
    { id: 'circuitos', grado: 6, cat: 'luz', estado: 'listo', url: '../actividades/circuitos/', icono: '🔌',
      es: { n: 'Laboratorio de circuitos', d: 'Arma circuitos con pila, resistencias, LED e interruptores hasta construir un semáforo.', a: 'La corriente necesita un camino cerrado.' },
      en: { n: 'Circuit Lab', d: 'Build circuits with a battery, resistors, LEDs and switches until you make a traffic light.', a: 'Current needs a closed path.' } }
  ]
};
