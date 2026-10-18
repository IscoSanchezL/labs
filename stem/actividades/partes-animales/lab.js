/* Partes de los animales (2°, solo español, sin voz): partes y funciones, adivinar el animal. */
var ANI = [
  { e: '🐦', n: 'Pájaro', fondo: '#7fd0ff', p: [['🪽 Alas', 'Con las alas el pájaro vuela.'], ['👄 Pico', 'Con el pico come semillas y frutos.'], ['🦶 Patas', 'Con las patas se posa en las ramas.']] },
  { e: '🐟', n: 'Pez', fondo: '#2a7fd9', p: [['🌊 Aletas', 'Con las aletas el pez nada y se dirige.'], ['🫧 Branquias', 'Con las branquias respira bajo el agua.'], ['✨ Escamas', 'Las escamas protegen su cuerpo.']] },
  { e: '🐕', n: 'Perro', fondo: '#bfe08a', p: [['🐾 Patas', 'Con las cuatro patas corre y salta.'], ['👃 Nariz', 'Con su nariz huele muy bien.'], ['🦴 Dientes', 'Con los dientes muerde y mastica.']] },
  { e: '🐢', n: 'Tortuga', fondo: '#7fd9a8', p: [['🛡️ Caparazón', 'El caparazón la protege como una casa.'], ['🦶 Patas', 'Con las patas camina muy despacio.'], ['🙂 Cabeza', 'Esconde la cabeza para protegerse.']] }
];
var LAB = LabKit({
  hook: '__ani',
  pasos: [
    { n: 'Las partes', t: '1. ¿Para qué sirve cada parte?', x: 'Cada animal tiene partes en su cuerpo que le sirven para <b>moverse</b>, <b>comer</b>, <b>respirar</b> y <b>protegerse</b>. Elige un animal y toca sus partes.', m: 'Descubre 6 partes de animales.', d: 'Las aves, los peces y los perros usan partes distintas para moverse.' },
    { n: '¿Con qué?', t: '2. ¿Con qué lo hace?', x: 'Responde con qué parte del cuerpo hace cada animal cada cosa.', m: 'Acierta 4 de 5.', d: 'Los murciélagos son mamíferos que vuelan con alas de piel.' },
    { n: '¿Qué animal es?', t: '3. Adivina el animal', x: 'Lee las pistas y adivina de qué animal se trata.', m: 'Acierta 4 de 5.', d: 'Hay animales con alas, aletas, patas, caparazón… ¡y todos son distintos!' }
  ],
  enter: function (L, n) { var S = L.S; S.a = 0; S.sel = -1; S.vis = {}; if (n === 1) pregA(L); if (n === 2) pregB(L); },
  reintentar: function (L) { if (L.paso === 1) pregA(L); else pregB(L); },
  ctl: function (L) {
    var S = L.S;
    if (L.paso === 0) { ANI.forEach(function (a, i) { L.btn(a.e + ' ' + a.n, function () { S.a = i; S.sel = -1; L.ctl(); }, 'btn sec'); }); ANI[S.a].p.forEach(function (pp, j) { L.btn(pp[0], function () { ver(L, j); }, 'btn'); }); }
    if (L.paso > 0) L.quizBtns(S.ops || ['A', 'B', 'C']);
  },
  draw: function (L, g) {
    var S = L.S, W = L.W, H = L.H, a = ANI[S.a], bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, L.paso ? '#12304f' : a.fondo); bg.addColorStop(1, L.paso ? '#08121f' : '#ffffff'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    if (L.paso > 0) { L.dibQuiz(null, '#fff'); return; }
    L.emoji(a.e, 270, 230 + Math.sin(L.t * 2) * 6, 200); L.txt(a.n, 270, 400, '#0a2a4a', 'center', 32);
    g.fillStyle = 'rgba(255,255,255,.85)'; g.fillRect(520, 100, 380, 220); var pp = S.sel >= 0 ? a.p[S.sel] : null; L.txt(pp ? pp[0] : 'Toca una parte 👇', 710, 150, '#0a2a4a', 'center', 28); if (pp) L.wrap(pp[1], 710, 210, 330, 24, '#2a4a6a');
    L.txt('Partes descubiertas: ' + Object.keys(S.vis).length + ' / 6', 710, 400, '#0a5a2a', 'center', 20);
  },
  hooks: function (L) { return { animal: function (i) { L.S.a = i; }, parte: function (j) { ver(L, j); }, correcta: function () { return L.q && !L.q.fin ? L.q.items[L.q.i].a : -1; }, resp: function (k) { L.quizResp(k); } }; }
});
function ver(L, j) { var S = L.S; S.sel = j; S.vis[S.a + '-' + j] = 1; L.tono(400 + j * 100, 0.1, 0.12); if (Object.keys(S.vis).length >= 6) L.cumplir(0); }
function mk(L, it, ops) { L.nuevoQuiz(it.map(function (x) { return { q: x[0], e: x[1], a: x[2], fb: x[3] }; }), 5, 4); L.S.ops = ops; L.ctl(); }
function pregA(L) { mk(L, [
  ['¿Con qué vuela el pájaro?   A) Con las alas   B) Con las aletas   C) Con la cola', '🐦', 0, 'Con las alas'],
  ['¿Con qué nada el pez?   A) Con alas   B) Con aletas   C) Con patas', '🐟', 1, 'Con las aletas'],
  ['¿Con qué huele el perro?   A) Con la nariz   B) Con la cola   C) Con las patas', '🐕', 0, 'Con la nariz'],
  ['¿Qué protege a la tortuga?   A) Las alas   B) Las escamas   C) El caparazón', '🐢', 2, 'El caparazón'],
  ['¿Con qué respira el pez bajo el agua?   A) Con branquias   B) Con pulmones de perro   C) Con alas', '🫧', 0, 'Con branquias'],
  ['¿Con qué come semillas el pájaro?   A) Con el pico   B) Con las patas   C) Con las alas', '🌾', 0, 'Con el pico']], ['A', 'B', 'C']); }
function pregB(L) { mk(L, [
  ['Tiene alas y pico, y puede volar.   A) Pez   B) Pájaro   C) Tortuga', '🪽', 1, 'Es un pájaro'],
  ['Tiene aletas y escamas, y vive en el agua.   A) Pez   B) Perro   C) Pájaro', '🌊', 0, 'Es un pez'],
  ['Tiene caparazón y camina despacio.   A) Perro   B) Pez   C) Tortuga', '🛡️', 2, 'Es una tortuga'],
  ['Tiene cuatro patas, cola y huele muy bien.   A) Perro   B) Pájaro   C) Pez', '🐾', 0, 'Es un perro'],
  ['Pone huevos y tiene plumas.   A) Perro   B) Pájaro   C) Pez', '🥚', 1, 'Es un pájaro'],
  ['Respira con branquias.   A) Pájaro   B) Tortuga   C) Pez', '🫧', 2, 'Es un pez']], ['A', 'B', 'C']); }
