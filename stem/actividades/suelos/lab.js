/* Los suelos (3°, solo español, sin voz): permeabilidad de arena, tierra negra y arcilla; plantas según el suelo; capas del suelo. */
var SU = [['Arena', '#e8c77a', 0.9, 'Deja pasar el agua muy rápido.'], ['Tierra negra', '#4a3322', 0.5, 'Retiene algo de agua y tiene nutrientes.'], ['Arcilla', '#b3623d', 0.12, 'Casi no deja pasar el agua: se encharca.']];
var CAPAS = [['Hojarasca y humus', '#3a2a18'], ['Suelo superior', '#6b4426'], ['Subsuelo', '#8d6a45'], ['Roca madre', '#6c6c78']];
var LAB = LabKit({
  hook: '__sue',
  pasos: [
    { n: 'El experimento', t: '1. ¿Cuánta agua pasa?', x: 'Los suelos no son todos iguales. Algunos dejan pasar el agua (<b>permeables</b>) y otros la retienen. Elige un suelo, vierte agua y mide cuánta se recoge abajo.', m: 'Prueba los 3 suelos con el agua.', d: 'La arcilla se usa para hacer ladrillos y vasijas justamente porque no deja pasar el agua.' },
    { n: 'Plantas', t: '2. Cada planta, su suelo', x: 'Cada planta crece mejor en un suelo distinto. Los cactus prefieren suelos <b>arenosos</b> y secos; las hortalizas, suelos oscuros y <b>ricos en humus</b>; el arroz, suelos de <b>arcilla</b> que retienen agua.', m: 'Acierta 4 de 5 preguntas.', d: 'En 1 cm de suelo fértil pueden pasar 100 años en formarse.' },
    { n: 'Capas', t: '3. Las capas del suelo', x: 'Si cavas muy hondo verás <b>capas</b> (horizontes). Arriba está la materia viva y oscura; abajo, la roca. Ordena las capas desde la superficie hacia abajo.', m: 'Ordena las 4 capas del suelo.', d: 'Las lombrices mezclan las capas y abren caminos para el aire y el agua.' }
  ],
  enter: function (L, n) { var S = L.S; S.s = 0; S.run = null; S.test = {}; S.k = 0; S.msg = ''; S.mez = null; if (n === 1) preg(L); if (n === 2) { S.mez = L.mezclar(CAPAS.slice()); } },
  reintentar: function (L) { if (L.paso === 1) preg(L); else { L.S.k = 0; L.S.mez = L.mezclar(CAPAS.slice()); L.S.msg = ''; L.ctl(); } },
  ctl: function (L) {
    var S = L.S;
    if (L.paso === 0) { SU.forEach(function (u, i) { L.btn(['🏖️ ', '🌱 ', '🧱 '][i] + u[0], function () { if (!S.run) { S.s = i; } }, 'btn sec'); }); L.btn('💧 Verter agua', function () { if (!S.run) S.run = { t: 0 }; }, 'btn grande'); }
    if (L.paso === 1) L.quizBtns(S.ops || ['A', 'B', 'C']);
    if (L.paso === 2 && S.mez) S.mez.forEach(function (c) { L.btn(c[0], function () { elegir(L, c[0]); }, 'btn'); });
  },
  sim: function (L, dt) { var S = L.S; if (S.run) { S.run.t += dt; if (S.run.t >= 4) { S.test[S.s] = 1; S.run = null; if (Object.keys(S.test).length >= 3) L.cumplir(0); } } },
  draw: function (L, g) {
    var S = L.S, W = L.W, H = L.H, bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#2a4a6b'); bg.addColorStop(1, '#0a1624'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    if (L.paso === 1) { L.emoji('🌵', 60, 60, 40); L.emoji('🌾', 900, 60, 40); L.dibQuiz(null, '#fff'); return; }
    if (L.paso === 0) {
      var u = SU[S.s], p = S.run ? S.run.t / 4 : 0, drena = u[2] * p;
      g.fillStyle = 'rgba(255,255,255,.1)'; g.fillRect(150, 90, 200, 230); g.fillStyle = u[1]; g.fillRect(155, 140, 190, 175);
      for (var i = 0; i < 30; i++) { g.fillStyle = 'rgba(0,0,0,.15)'; g.fillRect(160 + (i * 37) % 180, 145 + (i * 53) % 165, 4, 4); }
      if (S.run) { g.fillStyle = 'rgba(90,170,255,.8)'; var top = 140 - 24 * (1 - Math.min(1, p * 2)); g.fillRect(155, top, 190, 140 - top + 8 * p); L.emoji('🚿', 250, 60, 50); for (var j = 0; j < 5; j++) { g.fillStyle = '#7fc8ff'; g.fillRect(190 + j * 28, 85 + ((L.t * 120 + j * 30) % 40), 4, 12); } }
      g.fillStyle = 'rgba(255,255,255,.1)'; g.fillRect(150, 330, 200, 100); var h = Math.min(90, 220 * drena * 0.35 + (S.test[S.s] && !S.run ? u[2] * 0.35 * 220 : 0)); g.fillStyle = 'rgba(90,170,255,.85)'; g.fillRect(152, 428 - h, 196, h); if (S.run && u[2] > 0.3) { g.fillStyle = '#7fc8ff'; g.fillRect(248, 320, 4, 10); }
      L.txt('Vaso recolector', 250, 450, '#9db8ff', 'center', 14);
      g.fillStyle = 'rgba(5,11,20,.85)'; g.fillRect(480, 100, 420, 240); L.txt(u[0], 690, 150, u[1], 'center', 30); L.wrap(u[3], 690, 200, 360, 22, '#cfe6ff'); L.txt((S.test[S.s]) ? 'Agua recogida: ' + Math.round(u[2] * 100) + ' %' : 'Vierte agua para medir', 690, 300, '#7fc8ff', 'center', 20); L.txt('Suelos probados: ' + Object.keys(S.test).length + ' / 3', 690, 400, '#8be8ae', 'center', 17);
    }
    if (L.paso === 2) {
      CAPAS.forEach(function (c, i) { var y = 50 + i * 80, ok = i < S.k; g.globalAlpha = ok ? 1 : 0.2; g.fillStyle = c[1]; g.fillRect(200, y, 560, 74); g.globalAlpha = 1; L.txt(ok ? c[0] : (i + 1) + '. ?', 480, y + 44, '#fff', 'center', 22); });
      L.txt(S.msg || 'Toca primero la capa de más arriba', 480, 440, S.msg.indexOf('✔') > -1 ? '#8be8ae' : S.msg ? '#ff9f9f' : '#9db8ff', 'center', 18);
    }
  },
  hooks: function (L) { return { suelo: function (i) { L.S.s = i; L.S.run = { t: 0 }; }, fin: function () { return !L.S.run; }, correcta: function () { return L.q && !L.q.fin ? L.q.items[L.q.i].a : -1; }, resp: function (k) { L.quizResp(k); }, elegir: function (n) { elegir(L, n); }, sig: function () { return CAPAS[L.S.k] ? CAPAS[L.S.k][0] : ''; } }; }
});
function elegir(L, n) { var S = L.S; if (S.k >= 4) return; if (n === CAPAS[S.k][0]) { S.k++; S.msg = '✔ ¡Correcto!'; L.tono(500 + S.k * 70, 0.12, 0.15); S.mez = S.mez.filter(function (c) { return c[0] !== n; }); if (S.k >= 4) L.cumplir(2); L.ctl(); } else { S.msg = '✖ Esa va más abajo'; L.mal(); } }
function preg(L) {
  var it = [
    ['🏖️ ¿Qué suelo deja pasar el agua más rápido?', ['A) Arcilla', 'B) Arena', 'C) Roca'], 1, 'La arena'],
    ['🧱 ¿Qué suelo se encharca porque casi no deja pasar el agua?', ['A) Arcilla', 'B) Arena', 'C) Grava'], 0, 'La arcilla'],
    ['🌵 ¿En qué suelo vive mejor un cactus?', ['A) Arenoso y seco', 'B) Encharcado', 'C) Lleno de agua'], 0, 'En suelo arenoso y seco'],
    ['🥕 ¿Qué suelo es mejor para una huerta?', ['A) Tierra negra con humus', 'B) Solo arena', 'C) Solo roca'], 0, 'La tierra negra rica en humus'],
    ['🪱 ¿Qué animal ayuda a airear el suelo?', ['A) La lombriz', 'B) El delfín', 'C) El águila'], 0, 'La lombriz'],
    ['🪨 ¿Cuál es la capa más profunda?', ['A) Humus', 'B) Roca madre', 'C) Hojarasca'], 1, 'La roca madre']
  ];
  L.nuevoQuiz(it.map(function (x) { return { q: x[0] + '   ' + x[1].join('   '), e: '', a: x[2], fb: x[3] }; }), 5, 4); L.S.ops = ['A', 'B', 'C']; L.ctl(); }
