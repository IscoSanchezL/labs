/* Núcleo puro (sin DOM): niveles y simulador. Funciona en navegador y en Node (pruebas). */
(function (root) {
  'use strict';

  // Direcciones: 0 arriba, 1 derecha, 2 abajo, 3 izquierda.
  const DX = [0, 1, 0, -1];
  const DY = [-1, 0, 1, 0];

  /* ---------- Mundo 1: ordenar pasos (sin tablero) ---------- */
  const ORDEN = [
    { id: 'o1', titulo: 'Lavarse los dientes', voz: 'Pon los pasos en orden para lavarte los dientes. ¡Toca el primero!',
      pasos: [['🪥', 'Tomar el cepillo'], ['🧴', 'Poner la pasta'], ['😁', 'Cepillar los dientes'], ['💦', 'Enjuagar la boca']] },
    { id: 'o2', titulo: 'Plantar una semilla', voz: 'Ayuda a la semilla a crecer. ¿Qué se hace primero?',
      pasos: [['🕳️', 'Hacer un hoyito'], ['🌰', 'Poner la semilla'], ['💧', 'Echar agua'], ['🌻', '¡Crece la flor!']] },
    { id: 'o3', titulo: 'Hacer un sándwich', voz: '¡Qué hambre! Ordena los pasos del sándwich.',
      pasos: [['🍞', 'Poner el pan'], ['🧀', 'Poner el queso'], ['🍞', 'Tapar con otro pan'], ['😋', '¡A comer!']] }
  ];

  /* ---------- Mundos 2-4: robot Beto en el tablero ----------
     c: F avanzar, L girar izquierda, R girar derecha. n: repeticiones.
     sol: una solución de referencia (la usan las pruebas y las estrellas). */
  const F = (n) => ({ c: 'F', n: n || 1 });
  const L = () => ({ c: 'L', n: 1 });
  const R = () => ({ c: 'R', n: 1 });

  const TABLERO = [
    { id: 't1', mundo: 2, titulo: 'Primer paso', w: 4, h: 2, start: { x: 0, y: 0, d: 1 }, goal: { x: 2, y: 0 }, stars: [], walls: [], allowed: ['F'], rep: false,
      voz: 'Beto quiere llegar a la bandera. Toca la flecha para que avance. ¡Necesita dos pasos!', pista: 'Toca avanzar dos veces y luego el botón verde.', sol: [F(), F()] },
    { id: 't2', mundo: 2, titulo: 'Camino largo', w: 5, h: 2, start: { x: 0, y: 0, d: 1 }, goal: { x: 4, y: 0 }, stars: [], walls: [], allowed: ['F'], rep: false,
      voz: '¡Ahora la bandera está más lejos! Cuenta los cuadros.', pista: 'Cuenta cuántos cuadros hay hasta la bandera.', sol: [F(), F(), F(), F()] },
    { id: 't3', mundo: 2, titulo: 'Recoge la estrella', w: 5, h: 2, start: { x: 0, y: 0, d: 1 }, goal: { x: 4, y: 0 }, stars: [{ x: 2, y: 0 }], walls: [], allowed: ['F'], rep: false,
      voz: 'Beto pasa por la estrella y la recoge. ¡Luego va a la bandera!', pista: 'Si avanzas hasta la bandera, pasas por la estrella.', sol: [F(), F(), F(), F()] },
    { id: 't4', mundo: 3, titulo: '¡A girar!', w: 3, h: 3, start: { x: 0, y: 0, d: 1 }, goal: { x: 2, y: 2 }, stars: [], walls: [], allowed: ['F', 'L', 'R'], rep: false,
      voz: 'Ahora Beto sabe girar. El botón de la flecha curva a la derecha lo hace girar hacia su derecha.', pista: 'Avanza dos veces, gira a la derecha y avanza otras dos.', sol: [F(), F(), R(), F(), F()] },
    { id: 't5', mundo: 3, titulo: 'Hacia arriba', w: 3, h: 3, start: { x: 0, y: 2, d: 1 }, goal: { x: 2, y: 0 }, stars: [], walls: [], allowed: ['F', 'L', 'R'], rep: false,
      voz: 'Ahora hay que subir. Gira a la izquierda.', pista: 'Avanza dos veces, gira a la izquierda y avanza dos veces.', sol: [F(), F(), L(), F(), F()] },
    { id: 't6', mundo: 3, titulo: 'Estrella en la esquina', w: 4, h: 3, start: { x: 0, y: 0, d: 1 }, goal: { x: 3, y: 2 }, stars: [{ x: 3, y: 0 }], walls: [], allowed: ['F', 'L', 'R'], rep: false,
      voz: 'Recoge la estrella de la esquina y luego baja hasta la bandera.', pista: 'Primero a la derecha hasta el final, luego gira para bajar.', sol: [F(), F(), F(), R(), F(), F()] },
    { id: 't7', mundo: 3, titulo: '¡Cuidado con la roca!', w: 4, h: 3, start: { x: 0, y: 1, d: 1 }, goal: { x: 3, y: 1 }, stars: [], walls: [{ x: 1, y: 1 }], allowed: ['F', 'L', 'R'], rep: false,
      voz: 'Hay una roca en el camino. Beto no puede pasar por encima. ¡Rodéala!', pista: 'Sube, avanza, y baja después de pasar la roca.', sol: [L(), F(), R(), F(), F(), F(), R(), F()] },
    { id: 't8', mundo: 4, titulo: 'El botón repetir', w: 7, h: 2, start: { x: 0, y: 0, d: 1 }, goal: { x: 6, y: 0 }, stars: [], walls: [], allowed: ['F', 'L', 'R'], rep: true, maxBlocks: 2,
      voz: 'Qué camino tan largo. ¡Usa el botón repetir! Toca repetir tres, y luego avanzar.', pista: 'Repetir seis veces y avanzar. ¡Solo un bloque!', sol: [F(6)] },
    { id: 't9', mundo: 4, titulo: 'Repite y gira', w: 7, h: 3, start: { x: 0, y: 0, d: 1 }, goal: { x: 6, y: 2 }, stars: [{ x: 3, y: 0 }], walls: [], allowed: ['F', 'L', 'R'], rep: true,
      voz: 'Usa repetir para avanzar mucho, luego gira y baja.', pista: 'Repite seis, gira a la derecha, repite dos.', sol: [F(6), R(), F(2)] },
    { id: 't10', mundo: 4, titulo: 'El gran cuadrado', w: 5, h: 5, start: { x: 0, y: 0, d: 1 }, goal: { x: 4, y: 4 }, stars: [{ x: 4, y: 0 }, { x: 4, y: 2 }], walls: [{ x: 2, y: 2 }], allowed: ['F', 'L', 'R'], rep: true,
      voz: 'Un tablero grande con dos estrellas. ¡Tú puedes!', pista: 'Repite cuatro, gira a la derecha, repite cuatro.', sol: [F(4), R(), F(4)] },
    { id: 't11', mundo: 4, titulo: 'La escalera', w: 4, h: 4, start: { x: 0, y: 0, d: 1 }, goal: { x: 3, y: 3 }, stars: [{ x: 2, y: 1 }, { x: 3, y: 2 }], walls: [], allowed: ['F', 'L', 'R'], rep: true,
      voz: 'Sube y baja como en una escalera. Avanza, gira, avanza, gira.', pista: 'Avanzar, derecha, avanzar, izquierda… ¡se repite el patrón!', sol: [F(), R(), F(), L(), F(), R(), F(), L(), F(), R(), F()] },
    { id: 't12', mundo: 4, titulo: 'El gran desafío', w: 6, h: 4, start: { x: 0, y: 0, d: 1 }, goal: { x: 5, y: 0 }, stars: [{ x: 2, y: 2 }, { x: 5, y: 2 }], walls: [{ x: 3, y: 0 }, { x: 3, y: 1 }], allowed: ['F', 'L', 'R'], rep: true,
      voz: 'El último desafío. Hay un muro. Busca el camino por abajo. ¡Tú eres un gran programador!', pista: 'Baja, pasa por debajo del muro y vuelve a subir.', sol: [F(2), R(), F(2), L(), F(3), L(), F(2)] }
  ];

  const MUNDOS = [
    { n: 1, nombre: 'Pasos y orden', emoji: '🪥', color: '#ff8fab' },
    { n: 2, nombre: 'Beto camina', emoji: '🤖', color: '#4cc9f0' },
    { n: 3, nombre: 'Beto gira', emoji: '🔄', color: '#ffbe0b' },
    { n: 4, nombre: 'Repite y gana', emoji: '🔁', color: '#80ed99' }
  ];

  const DIAPOS = [
    { titulo: '¡Hola, {n}!', grande: '👋', partes: [{ t: '¡Hola, {n}! Yo soy Beto, el robot. Hoy te voy a enseñar un secreto de los robots y de las computadoras.' }] },
    { titulo: '¿Qué es un algoritmo?', pasos: [['🥣', 'Mezclar'], ['🔥', 'Hornear'], ['🎂', '¡Pastel!']],
      partes: [{ t: 'Un algoritmo es una lista de pasos, uno después de otro, para hacer algo.' }, { t: 'Es como una receta de cocina. Primero mezclamos.', ver: 0 }, { t: 'Después horneamos.', ver: 1 }, { t: '¡Y al final tenemos un pastel!', ver: 2 }] },
    { titulo: 'Lavarse los dientes', pasos: [['🪥', 'Tomar el cepillo'], ['🧴', 'Poner la pasta'], ['😁', 'Cepillar'], ['💦', 'Enjuagar']],
      partes: [{ t: 'Tú ya usas algoritmos todos los días. Mira, para lavarte los dientes:' }, { t: 'Primero, tomas el cepillo.', ver: 0 }, { t: 'Luego, pones la pasta.', ver: 1 }, { t: 'Después, cepillas los dientes.', ver: 2 }, { t: 'Y al final, enjuagas tu boca.', ver: 3 }] },
    { titulo: '¡El orden importa!', pasos: [['👟', 'Zapatos'], ['🧦', 'Medias']], loco: true, extra: [['🧦', 'Medias'], ['👟', 'Zapatos']],
      partes: [{ t: '¿Y si primero te pones los zapatos y luego las medias?' }, { t: '¡Qué risa! Eso no funciona.', ver: [0, 1] }, { t: 'Primero las medias, y después los zapatos. Los pasos deben ir en el orden correcto.', ver: [2, 3] }] },
    { titulo: 'Los robots obedecen', iconos: ['F', 'R', 'L'],
      partes: [{ t: 'Los robots hacen exactamente lo que les dices, paso por paso.' }, { t: 'Yo puedo avanzar, girar a la derecha y girar a la izquierda.', ver: [0, 1, 2] }, { t: 'Tú serás el programador, y yo te haré caso. ¡Vamos a jugar!' }] }
  ];

  let idioma = 'es';
  // Cierre hablado de cada rutina (se construye con los pasos de la misma rutina).
  const CIERRE = { es: ['¡Muy bien! ', 'Primero, ', 'Luego, ', 'Al final, '], en: ['Very good! ', 'First, ', 'Then, ', 'Finally, '] };
  function cierres() {
    const K = CIERRE[idioma];
    ORDEN.forEach((o) => {
      o.cierre = K[0] + o.pasos.map((s, q) => (q === 0 ? K[1] : q === o.pasos.length - 1 ? K[3] : K[2]) + s[1].toLowerCase().replace(/[¡!]/g, '')).join('. ');
    });
  }
  cierres();

  /* ---------- Mensajes hablados ----------
     {n} = nombre del niño. Con voz grabada se dice la frase SIN nombre (ver generica). */
  const MSG = {
    mapaNuevo: '¡Hola, {n}! Soy Beto. Toca el camino que brilla para empezar.',
    mapaVuelta: '¡Qué bueno verte otra vez, {n}! Seguimos donde te quedaste.',
    mapaFin: '¡Completaste todo, {n}! Eres un gran programador. Puedes repetir los niveles.',
    mapaElige: 'Elige el camino que brilla, {n}.',
    alabanzas: ['¡Lo lograste, {n}!', '¡Genial, {n}!', '¡Eres un gran programador, {n}!', '¡Wow, qué bien, {n}!', '¡Excelente trabajo, {n}!', '¡Fantástico, {n}!'],
    tres: '¡Tres estrellas!',
    ordenBien: ['¡Eso!', '¡Muy bien!', '¡Sí!'],
    ordenMal1: 'Mmm, ese no va primero. ¿Qué se hace al empezar?',
    ordenMal2: 'Ese todavía no. ¿Qué sigue después?',
    sinPasos: 'Primero dale instrucciones a Beto. Toca las flechas.',
    repetir: { 2: 'Repetir 2 veces. Ahora elige qué repetir.', 3: 'Repetir 3 veces. Ahora elige qué repetir.', 4: 'Repetir 4 veces. Ahora elige qué repetir.', 5: 'Repetir 5 veces. Ahora elige qué repetir.', 6: 'Repetir 6 veces. Ahora elige qué repetir.' },
    usaRepetir: '¡Usa el botón repetir para hacerlo con menos bloques!',
    muchos: 'Ya son muchos pasos. Quita alguno.',
    choco: '¡Ups! Beto chocó. Revisa los pasos e inténtalo otra vez.',
    faltaEstrella: 'Llegaste, pero te faltó recoger una estrella. ¡Inténtalo otra vez!',
    noLlego: 'Beto todavía no llegó a la bandera. ¡Casi! Agrega más pasos.'
  };

  /* ---------- Frases grabables ---------- */
  const generica = (t) => t.replace(/,?\s*\{n\}/g, '').replace(/\s+/g, ' ').trim();
  function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36).padStart(6, '0'); }
  function slug(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 36).replace(/-$/, ''); }
  const idFrase = (t) => slug(t) + '-' + hash(t);

  const SEC = {
    es: ['1. Lección: ¿Qué es un algoritmo?', '2. Ordenar pasos · ', '3. Mensajes de Ordenar', '4. Beto · ', '5. Mensajes de Beto', '6. Mapa y felicitaciones'],
    en: ['1. Lesson: What is an algorithm?', '2. Ordering steps · ', '3. Ordering messages', '4. Beto · ', '5. Beto messages', '6. Map and praise']
  };
  function todasLasFrases() {
    const S = SEC[idioma];
    const out = [], visto = new Set();
    const add = (sec, t) => { const g = generica(t); const id = idFrase(g); if (!visto.has(id)) { visto.add(id); out.push({ sec, texto: g, id }); } };
    DIAPOS.forEach((d) => d.partes.forEach((p) => add(S[0], p.t)));
    ORDEN.forEach((o) => { add(S[1] + o.titulo, o.voz); add(S[1] + o.titulo, o.cierre); });
    add(S[2], MSG.ordenBien[0]); MSG.ordenBien.slice(1).forEach((t) => add(S[2], t));
    add(S[2], MSG.ordenMal1); add(S[2], MSG.ordenMal2);
    TABLERO.forEach((t) => { add(S[3] + t.titulo, t.voz); add(S[3] + t.titulo, t.pista); });
    ['sinPasos', 'usaRepetir', 'muchos', 'choco', 'faltaEstrella', 'noLlego'].forEach((k) => add(S[4], MSG[k]));
    Object.keys(MSG.repetir).forEach((k) => add(S[4], MSG.repetir[k]));
    ['mapaNuevo', 'mapaVuelta', 'mapaFin', 'mapaElige'].forEach((k) => add(S[5], MSG[k]));
    MSG.alabanzas.forEach((t) => add(S[5], t)); add(S[5], MSG.tres);
    return out;
  }

  // Orden completo del camino: la lección es el nivel 0.
  const NIVELES = [].concat(
    [{ id: 'leccion', tipo: 'leccion', mundo: 1, titulo: '¿Qué es un algoritmo?' }],
    ORDEN.map((o) => Object.assign({ tipo: 'orden', mundo: 1 }, o)),
    TABLERO.map((t) => Object.assign({ tipo: 'tablero' }, t))
  );

  /* ---------- Simulador ----------
     Devuelve la lista de eventos paso a paso para animar, y el resultado final. */
  function simular(nivel, programa) {
    let { x, y, d } = nivel.start;
    const pendientes = new Set(nivel.stars.map((s) => s.x + ',' + s.y));
    const recogidas = [];
    const eventos = [];
    const pared = new Set(nivel.walls.map((p) => p.x + ',' + p.y));
    let choco = false;

    const orden = [];
    programa.forEach((b, idx) => {
      const veces = Math.max(1, b.n || 1);
      for (let i = 0; i < veces; i++) orden.push({ c: b.c, idx });
    });

    for (const paso of orden) {
      if (choco) break;
      if (paso.c === 'L' || paso.c === 'R') {
        d = (d + (paso.c === 'R' ? 1 : 3)) % 4;
        eventos.push({ t: 'giro', idx: paso.idx, x, y, d, dir: paso.c });
      } else {
        const nx = x + DX[d], ny = y + DY[d];
        const fuera = nx < 0 || ny < 0 || nx >= nivel.w || ny >= nivel.h;
        if (fuera || pared.has(nx + ',' + ny)) {
          choco = true;
          eventos.push({ t: 'choque', idx: paso.idx, x, y, d, hx: nx, hy: ny });
        } else {
          x = nx; y = ny;
          const k = x + ',' + y;
          const estrella = pendientes.delete(k);
          if (estrella) recogidas.push(k);
          eventos.push({ t: 'avanza', idx: paso.idx, x, y, d, estrella });
        }
      }
    }

    const llego = x === nivel.goal.x && y === nivel.goal.y;
    const faltan = pendientes.size;
    return { eventos, choco, llego, faltan, ok: !choco && llego && faltan === 0, x, y, d };
  }

  function estrellasGanadas(nivel, programa) {
    const optimo = nivel.sol.length;
    const usados = programa.length;
    if (usados <= optimo) return 3;
    if (usados <= optimo + 2) return 2;
    return 1;
  }


  /* ---------- Idiomas (es / en) ----------
     Los textos en español de arriba son la base. TXT.en trae la misma estructura traducida;
     setIdioma() reescribe los textos en los mismos objetos (los ids y los datos del juego no cambian). */
  const instantanea = () => ({
    leccion: NIVELES_TITULO_LECCION,
    orden: ORDEN.map((o) => ({ titulo: o.titulo, voz: o.voz, pasos: o.pasos.map((p) => p[1]) })),
    tablero: TABLERO.map((t) => ({ titulo: t.titulo, voz: t.voz, pista: t.pista })),
    mundos: MUNDOS.map((m) => m.nombre),
    diapos: DIAPOS.map((d) => ({ titulo: d.titulo, pasos: d.pasos && d.pasos.map((p) => p[1]), extra: d.extra && d.extra.map((p) => p[1]), partes: d.partes.map((p) => p.t) })),
    msg: JSON.parse(JSON.stringify(MSG))
  });
  const NIVELES_TITULO_LECCION = '¿Qué es un algoritmo?';
  const TXT = { es: instantanea(), en: {
    leccion: 'What is an algorithm?',
    orden: [
      { titulo: 'Brushing teeth', voz: 'Put the steps in order to brush your teeth. Tap the first one!', pasos: ['Take the toothbrush', 'Put on the toothpaste', 'Brush your teeth', 'Rinse your mouth'] },
      { titulo: 'Planting a seed', voz: 'Help the seed grow. What do you do first?', pasos: ['Dig a little hole', 'Put in the seed', 'Add water', 'The flower grows!'] },
      { titulo: 'Making a sandwich', voz: "I'm hungry! Put the steps of the sandwich in order.", pasos: ['Put on the bread', 'Add the cheese', 'Cover with another bread', 'Time to eat!'] }
    ],
    tablero: [
      { titulo: 'First step', voz: 'Beto wants to reach the flag. Tap the arrow to make him move forward. He needs two steps!', pista: 'Tap forward twice and then the green button.' },
      { titulo: 'Long way', voz: 'Now the flag is farther away! Count the squares.', pista: 'Count how many squares there are to the flag.' },
      { titulo: 'Collect the star', voz: 'Beto passes by the star and picks it up. Then he goes to the flag!', pista: 'If you move forward to the flag, you pass by the star.' },
      { titulo: 'Time to turn!', voz: 'Now Beto knows how to turn. The curved arrow button makes him turn to his right.', pista: 'Move forward twice, turn right and move forward two more times.' },
      { titulo: 'Going up', voz: 'Now we have to go up. Turn left.', pista: 'Move forward twice, turn left and move forward twice.' },
      { titulo: 'Star in the corner', voz: 'Pick up the star in the corner and then go down to the flag.', pista: 'First go right all the way to the end, then turn to go down.' },
      { titulo: 'Watch out for the rock!', voz: 'There is a rock in the way. Beto cannot go over it. Go around it!', pista: 'Go up, move forward, and go down after passing the rock.' },
      { titulo: 'The repeat button', voz: 'What a long way. Use the repeat button! Tap repeat three, and then forward.', pista: 'Repeat six times and move forward. Just one block!' },
      { titulo: 'Repeat and turn', voz: 'Use repeat to move forward a lot, then turn and go down.', pista: 'Repeat six, turn right, repeat two.' },
      { titulo: 'The big square', voz: 'A big board with two stars. You can do it!', pista: 'Repeat four, turn right, repeat four.' },
      { titulo: 'The staircase', voz: 'Go up and down like on a staircase. Move forward, turn, move forward, turn.', pista: 'Forward, right, forward, left... the pattern repeats!' },
      { titulo: 'The big challenge', voz: 'The last challenge. There is a wall. Find the way underneath. You are a great programmer!', pista: 'Go down, pass under the wall and go back up.' }
    ],
    mundos: ['Steps and order', 'Beto walks', 'Beto turns', 'Repeat and win'],
    diapos: [
      { titulo: 'Hello, {n}!', partes: ["Hello, {n}! I'm Beto, the robot. Today I'm going to teach you a secret of robots and computers."] },
      { titulo: 'What is an algorithm?', pasos: ['Mix', 'Bake', 'Cake!'], partes: ['An algorithm is a list of steps, one after another, to do something.', "It's like a cooking recipe. First we mix.", 'Then we bake.', 'And in the end we have a cake!'] },
      { titulo: 'Brushing teeth', pasos: ['Take the toothbrush', 'Put on the toothpaste', 'Brush', 'Rinse'], partes: ['You already use algorithms every day. Look, to brush your teeth:', 'First, you take the toothbrush.', 'Then, you put on the toothpaste.', 'After that, you brush your teeth.', 'And at the end, you rinse your mouth.'] },
      { titulo: 'Order matters!', pasos: ['Shoes', 'Socks'], extra: ['Socks', 'Shoes'], partes: ['What if you put on your shoes first and then your socks?', "How funny! That doesn't work.", 'Socks first, and then shoes. The steps must go in the right order.'] },
      { titulo: 'Robots obey', partes: ['Robots do exactly what you tell them, step by step.', 'I can move forward, turn right and turn left.', "You will be the programmer, and I will follow your commands. Let's play!"] }
    ],
    msg: {
      mapaNuevo: "Hello, {n}! I'm Beto. Tap the glowing path to start.",
      mapaVuelta: "Great to see you again, {n}! Let's continue where you left off.",
      mapaFin: 'You completed everything, {n}! You are a great programmer. You can replay the levels.',
      mapaElige: 'Choose the glowing path, {n}.',
      alabanzas: ['You did it, {n}!', 'Awesome, {n}!', 'You are a great programmer, {n}!', 'Wow, well done, {n}!', 'Excellent work, {n}!', 'Fantastic, {n}!'],
      tres: 'Three stars!',
      ordenBien: ["That's it!", 'Very good!', 'Yes!'],
      ordenMal1: "Hmm, that one doesn't go first. What do you do at the start?",
      ordenMal2: 'Not that one yet. What comes next?',
      sinPasos: 'First give Beto some instructions. Tap the arrows.',
      repetir: { 2: 'Repeat 2 times. Now choose what to repeat.', 3: 'Repeat 3 times. Now choose what to repeat.', 4: 'Repeat 4 times. Now choose what to repeat.', 5: 'Repeat 5 times. Now choose what to repeat.', 6: 'Repeat 6 times. Now choose what to repeat.' },
      usaRepetir: 'Use the repeat button to do it with fewer blocks!',
      muchos: "That's a lot of steps. Remove some.",
      choco: 'Oops! Beto bumped into something. Check the steps and try again.',
      faltaEstrella: 'You made it, but you missed collecting a star. Try again!',
      noLlego: "Beto hasn't reached the flag yet. Almost! Add more steps."
    }
  } };

  function setIdioma(l) {
    const T = TXT[l]; if (!T) return;
    idioma = l;
    NIVELES[0].titulo = T.leccion;
    ORDEN.forEach((o, i) => { o.titulo = T.orden[i].titulo; o.voz = T.orden[i].voz; o.pasos.forEach((p, j) => { p[1] = T.orden[i].pasos[j]; }); });
    TABLERO.forEach((t, i) => { t.titulo = T.tablero[i].titulo; t.voz = T.tablero[i].voz; t.pista = T.tablero[i].pista; });
    MUNDOS.forEach((m, i) => { m.nombre = T.mundos[i]; });
    DIAPOS.forEach((d, i) => {
      const x = T.diapos[i]; d.titulo = x.titulo;
      if (d.pasos) d.pasos.forEach((p, j) => { p[1] = x.pasos[j]; });
      if (d.extra) d.extra.forEach((p, j) => { p[1] = x.extra[j]; });
      d.partes.forEach((p, j) => { p.t = x.partes[j]; });
    });
    Object.assign(MSG, JSON.parse(JSON.stringify(T.msg)));
    cierres();
    // NIVELES guarda copias de los textos de ORDEN y TABLERO: se sincronizan por id.
    NIVELES.forEach((n) => {
      const f = ORDEN.find((o) => o.id === n.id) || TABLERO.find((t) => t.id === n.id);
      if (f) { n.titulo = f.titulo; n.voz = f.voz; if (f.pista !== undefined) n.pista = f.pista; if (f.cierre !== undefined) n.cierre = f.cierre; }
    });
  }
  const getIdioma = () => idioma;

  const api = { setIdioma, getIdioma, DX, DY, ORDEN, TABLERO, MUNDOS, NIVELES, DIAPOS, MSG, simular, estrellasGanadas, generica, idFrase, todasLasFrases };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.AlgoCore = api;
})(typeof window !== 'undefined' ? window : globalThis);
