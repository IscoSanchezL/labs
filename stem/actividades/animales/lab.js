/* ¿Dónde vive cada animal? (1°, solo español, con voz de Beto): hábitats, dónde vive y qué animal vive aquí. */
var HAB = [
  { n: 'El mar', e: '🌊', f: ['#1f7fd9', '#0a2a5a'], an: ['🐟', '🐙', '🐳', '🦀'], nom: ['pez', 'pulpo', 'ballena', 'cangrejo'] },
  { n: 'La granja', e: '🏡', f: ['#a9dd78', '#5a9a3a'], an: ['🐄', '🐖', '🐔', '🐑'], nom: ['vaca', 'cerdo', 'gallina', 'oveja'] },
  { n: 'La selva', e: '🌴', f: ['#4ab05a', '#1a5a2a'], an: ['🐒', '🦜', '🐆', '🐍'], nom: ['mono', 'loro', 'jaguar', 'serpiente'] },
  { n: 'El polo', e: '🧊', f: ['#d7f0ff', '#8ec5e8'], an: ['🐧', '🐻‍❄️', '🦭'], nom: ['pingüino', 'oso polar', 'foca'] }
];
var LAB = LabKit({
  hook: '__anx', voz: true,
  pasos: [
    { n: 'Las casas', t: 'Las casas de los animales', x: 'Cada animal vive en un lugar que se llama hábitat. Algunos viven en el mar, otros en la granja, en la selva o en el polo. Toca cada lugar y mira quién vive ahí.', m: 'Visita los cuatro lugares.', d: 'El pingüino vive en el polo, donde hace mucho frío.' },
    { n: '¿Dónde vive?', t: '¿Dónde vive?', x: 'Mira el animal y toca el lugar donde vive.', m: 'Acierta cuatro veces.', d: 'Los peces viven en el agua porque pueden respirar allí.' },
    { n: '¿Quién vive aquí?', t: '¿Quién vive aquí?', x: 'Mira el lugar y toca al animal que vive allí.', m: 'Acierta cuatro veces.', d: 'Hay animales en todos los lugares del mundo.' }
  ],
  enter: function (L, n) { var S = L.S; S.h = 0; S.vis = {}; S.vis[0] = 1; if (n === 1) pregA(L); if (n === 2) pregB(L); },
  reintentar: function (L) { if (L.paso === 1) pregA(L); else pregB(L); },
  ctl: function (L) {
    var S = L.S;
    if (L.paso === 0) HAB.forEach(function (h, i) { L.op(h.e, h.n, function () { S.h = i; S.vis[i] = 1; L.tono(300 + i * 100, 0.12, 0.12); if (Object.keys(S.vis).length >= 4) L.cumplir(0); }); });
    if (L.paso === 1) L.quizBtns(HAB.map(function (h) { return [h.e, h.n]; }), true);
    if (L.paso === 2) { var q = L.q, it = q && !q.fin ? q.items[q.i] : null; L.quizBtns(it ? it.ops.map(function (o) { return [o, '']; }) : [], true); }
  },
  draw: function (L, g) {
    var S = L.S, W = L.W, H = L.H, h = L.paso === 2 && L.q && !L.q.fin ? HAB[L.q.items[L.q.i].h] : HAB[S.h], bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, h.f[0]); bg.addColorStop(1, h.f[1]); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    if (L.paso === 0) { L.emoji(h.e, 140, 120, 90); L.txt(h.n, 140, 200, '#fff', 'center', 34); h.an.forEach(function (a, i) { var x = 340 + i * 150 + Math.sin(L.t * 2 + i) * 14, y = 250 + Math.cos(L.t * 2.4 + i) * 18; L.emoji(a, x, y, 90); L.txt(h.nom[i], x, y + 70, '#fff', 'center', 20); }); L.txt('Lugares vistos: ' + Object.keys(S.vis).length + ' de 4', 480, 440, '#fff', 'center', 20); return; }
    if (L.paso === 2) { L.emoji(h.e, 480, 90, 100); } else { g.fillStyle = 'rgba(10,26,46,.5)'; g.fillRect(0, 0, W, H); }
    L.dibQuiz(null, '#fff');
  },
  hooks: function (L) { return { lugar: function (i) { L.S.h = i; L.S.vis[i] = 1; if (Object.keys(L.S.vis).length >= 4) L.cumplir(0); }, correcta: function () { return L.q && !L.q.fin ? L.q.items[L.q.i].a : -1; }, resp: function (k) { L.quizResp(k); } }; }
});
function pregA(L) {
  var it = []; HAB.forEach(function (h, i) { h.an.forEach(function (a, j) { it.push({ q: '¿Dónde vive el ' + h.nom[j] + '?', e: a, a: i, fb: 'Vive en ' + h.n.toLowerCase() }); }); });
  L.nuevoQuiz(it, 5, 4); L.ctl(); }
function pregB(L) {
  var it = []; HAB.forEach(function (h, i) { h.an.forEach(function (a, j) { it.push({ h: i, q: '¿Quién vive en ' + h.n.toLowerCase() + '?', e: '', a: j, fb: 'Vive el ' + h.nom[j], ops: null, an: h }); }); });
  var chosen = L.mezclar(it).slice(0, 5); chosen.forEach(function (c) { var otros = []; HAB.forEach(function (h2, i2) { if (i2 !== c.h) h2.an.forEach(function (a) { otros.push(a); }); }); var correct = HAB[c.h].an[c.a], dis = L.mezclar(otros).slice(0, 2), ops = L.mezclar([correct].concat(dis)); c.ops = ops; c.a = ops.indexOf(correct); c.fb = 'Aquí vive ' + HAB[c.h].nom[HAB[c.h].an.indexOf(correct)]; });
  L.q = { items: chosen, i: 0, ok: 0, need: 4, n: 5, fin: false, msj: '' }; L.msj = ''; L.ctl(); }
