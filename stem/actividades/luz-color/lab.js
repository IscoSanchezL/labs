/* Colores del arco iris (1°, solo español, con voz de Beto): sol + lluvia = arco iris, mezclar colores primarios y preguntas. */
var ARC = ['#ff3b3b', '#ff9f2a', '#ffe23a', '#3ccf5a', '#3aa0ff', '#4a4adf', '#9b4adf'];
var PRIM = [['🔴', 'Rojo', '#ff3b3b'], ['🟡', 'Amarillo', '#ffe23a'], ['🔵', 'Azul', '#3aa0ff']];
var MEZ = { '0,1': ['🟠', 'Naranja', '#ff9f2a'], '1,2': ['🟢', 'Verde', '#3ccf5a'], '0,2': ['🟣', 'Morado', '#9b4adf'] };
var LAB = LabKit({
  hook: '__arc', voz: true,
  pasos: [
    { n: 'El arco iris', t: 'El arco iris', x: 'El arco iris aparece cuando hay sol y lluvia al mismo tiempo. La luz del sol se separa en muchos colores. Enciende el sol y la lluvia.', m: 'Haz aparecer el arco iris.', d: 'El arco iris tiene siete colores: rojo, naranja, amarillo, verde, azul, añil y violeta.' },
    { n: 'Mezclar', t: 'Mezclar colores', x: 'Con tres colores se pueden hacer otros. Elige dos colores y mira qué color nuevo sale.', m: 'Haz tres mezclas distintas.', d: 'El rojo, el amarillo y el azul se llaman colores primarios.' },
    { n: '¿Qué sale?', t: '¿Qué color sale?', x: 'Mira los dos colores y toca el color que sale al mezclarlos.', m: 'Acierta cuatro veces.', d: 'Los pintores mezclan colores para tener todos los tonos.' }
  ],
  enter: function (L, n) { var S = L.S; S.sol = false; S.llu = false; S.a = null; S.b = null; S.mz = {}; if (n === 2) preg(L); },
  reintentar: function (L) { preg(L); },
  ctl: function (L) {
    var S = L.S;
    if (L.paso === 0) { L.op('☀️', 'Sol', function () { S.sol = !S.sol; chk(L); }); L.op('🌧️', 'Lluvia', function () { S.llu = !S.llu; chk(L); }); }
    if (L.paso === 1) PRIM.forEach(function (c, i) { L.op(c[0], c[1], function () { elegir(L, i); }); });
    if (L.paso === 2) L.quizBtns([['🟠', 'Naranja'], ['🟢', 'Verde'], ['🟣', 'Morado']], true);
  },
  draw: function (L, g) {
    var S = L.S, W = L.W, H = L.H;
    if (L.paso === 0) {
      var bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, S.llu && !S.sol ? '#4a5a6a' : '#6ac4ff'); bg.addColorStop(1, S.llu ? '#7a8a9a' : '#bfe9ff'); g.fillStyle = bg; g.fillRect(0, 0, W, H); g.fillStyle = '#7bc96b'; g.fillRect(0, 380, W, 80);
      if (S.sol) L.emoji('☀️', 120, 90, 110); if (S.llu) { for (var i = 0; i < 40; i++) { g.fillStyle = 'rgba(70,110,200,.7)'; g.fillRect((i * 97) % W, ((L.t * 300 + i * 53) % 380), 3, 14); } L.emoji('☁️', 560, 70, 120); L.emoji('☁️', 700, 90, 100); }
      if (S.sol && S.llu) { g.lineWidth = 14; ARC.forEach(function (c, i) { g.strokeStyle = c; g.beginPath(); g.arc(480, 400, 300 - i * 14, Math.PI, 2 * Math.PI); g.stroke(); }); L.txt('🌈 ¡Arco iris!', 480, 440, '#fff', 'center', 30); } else L.txt('Necesitas sol ☀️ y lluvia 🌧️', 480, 440, '#fff', 'center', 24);
      return;
    }
    var bg2 = g.createLinearGradient(0, 0, 0, H); bg2.addColorStop(0, '#2a1c4a'); bg2.addColorStop(1, '#0a0618'); g.fillStyle = bg2; g.fillRect(0, 0, W, H);
    if (L.paso === 1) {
      var ca = S.a !== null ? PRIM[S.a][2] : '#333', cb = S.b !== null ? PRIM[S.b][2] : '#333', k = S.a !== null && S.b !== null && S.a !== S.b ? MEZ[[S.a, S.b].sort().join(',')] : null;
      g.fillStyle = ca; g.beginPath(); g.arc(250, 220, 90, 0, 7); g.fill(); g.fillStyle = cb; g.beginPath(); g.arc(380, 220, 90, 0, 7); g.fill(); L.txt('+', 315, 235, '#fff', 'center', 50);
      g.fillStyle = k ? k[2] : '#222'; g.beginPath(); g.arc(700, 220, 110, 0, 7); g.fill(); L.txt('=', 560, 235, '#fff', 'center', 50); L.txt(k ? k[0] + ' ' + k[1] : '¿?', 700, 380, '#ffe08a', 'center', 34); L.txt('Mezclas: ' + Object.keys(S.mz).length + ' de 3', 480, 440, '#8be8ae', 'center', 20);
    }
    if (L.paso === 2) { var q = L.q; if (q && !q.fin) { var it = q.items[q.i]; g.fillStyle = it.c1; g.beginPath(); g.arc(380, 100, 40, 0, 7); g.fill(); g.fillStyle = it.c2; g.beginPath(); g.arc(560, 100, 40, 0, 7); g.fill(); L.txt('+', 470, 112, '#fff', 'center', 40); } L.dibQuiz(null, '#fff'); }
  },
  hooks: function (L) { return { sol: function (v) { L.S.sol = v; chk(L); }, lluvia: function (v) { L.S.llu = v; chk(L); }, elegir: function (i) { elegir(L, i); }, correcta: function () { return L.q && !L.q.fin ? L.q.items[L.q.i].a : -1; }, resp: function (k) { L.quizResp(k); } }; }
});
function chk(L) { L.tono(500, 0.1, 0.1); if (L.S.sol && L.S.llu) L.cumplir(0); }
function elegir(L, i) { var S = L.S; if (S.a === null || (S.a !== null && S.b !== null)) { S.a = i; S.b = null; } else { S.b = i; if (S.a !== S.b) { S.mz[[S.a, S.b].sort().join(',')] = 1; L.tono(600, 0.12, 0.15); if (Object.keys(S.mz).length >= 3) L.cumplir(1); } } }
function preg(L) {
  var it = [[0, 1, 0, 'Rojo y amarillo hacen naranja'], [1, 2, 1, 'Amarillo y azul hacen verde'], [0, 2, 2, 'Rojo y azul hacen morado']], q = [];
  for (var i = 0; i < 6; i++) { var x = it[i % 3]; q.push({ q: PRIM[x[0]][1] + ' y ' + PRIM[x[1]][1].toLowerCase() + ': ¿qué color sale?', e: '', c1: PRIM[x[0]][2], c2: PRIM[x[1]][2], a: x[2], fb: x[3] }); }
  L.nuevoQuiz(q, 5, 4); L.ctl(); }
