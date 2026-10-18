/* Alimentos saludables (2°, solo español, sin voz): plato equilibrado, grupos de alimentos, todos los días o a veces. */
var ALI = [
  ['🍎', 'Manzana', 'f'], ['🥕', 'Zanahoria', 'f'], ['🍌', 'Banano', 'f'], ['🥦', 'Brócoli', 'f'],
  ['🍞', 'Pan', 'c'], ['🍚', 'Arroz', 'c'], ['🥔', 'Papa', 'c'], ['🌽', 'Maíz', 'c'],
  ['🥚', 'Huevo', 'p'], ['🐟', 'Pescado', 'p'], ['🫘', 'Fríjoles', 'p'], ['🥛', 'Leche', 'p'],
  ['🍬', 'Dulces', 's'], ['🍟', 'Papas fritas', 's'], ['🍩', 'Dona', 's'], ['🥤', 'Gaseosa', 's']
];
var GR = { f: 'Frutas y verduras', c: 'Cereales y tubérculos', p: 'Proteínas y lácteos', s: 'Dulces y fritos' };
var LAB = LabKit({
  hook: '__ali',
  pasos: [
    { n: 'Mi plato', t: '1. Arma tu plato', x: 'Un plato saludable lleva <b>frutas o verduras</b> 🥕, <b>cereales</b> 🍞 que dan energía y <b>proteínas</b> 🥚 que nos hacen crecer. Los dulces y fritos 🍬 se comen poco. Toca los alimentos para ponerlos en el plato.', m: 'Arma un plato con frutas o verduras, cereal y proteína, sin dulces.', d: 'Beber agua es mejor que beber gaseosa.' },
    { n: 'Todos los días', t: '2. ¿Todos los días o a veces?', x: 'Algunos alimentos se pueden comer <b>todos los días</b> y otros solo <b>de vez en cuando</b>. Decide en cada caso.', m: 'Acierta 4 de 5.', d: 'Comer variado y con colores nos da más vitaminas.' },
    { n: 'Grupos', t: '3. ¿A qué grupo pertenece?', x: 'Los alimentos se organizan en grupos según lo que le dan a tu cuerpo.', m: 'Acierta 4 de 5.', d: 'Los lácteos y el huevo nos ayudan a tener huesos y músculos fuertes.' }
  ],
  enter: function (L, n) { var S = L.S; S.pl = []; S.msg = ''; if (n === 1) pregA(L); if (n === 2) pregB(L); },
  reintentar: function (L) { if (L.paso === 1) pregA(L); else pregB(L); },
  ctl: function (L) {
    var S = L.S;
    if (L.paso === 0) L.btn('🗑️ Vaciar plato', function () { S.pl = []; S.msg = ''; }, 'btn sec');
    if (L.paso === 1) L.quizBtns(['☀️ Todos los días', '🎉 De vez en cuando']);
    if (L.paso === 2) L.quizBtns(['🥕 Frutas y verduras', '🍞 Cereales', '🥚 Proteínas y lácteos', '🍬 Dulces y fritos']);
  },
  draw: function (L, g) {
    var S = L.S, W = L.W, H = L.H, bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#ffe9b8'); bg.addColorStop(1, '#ffc78a'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    if (L.paso > 0) { g.fillStyle = 'rgba(10,26,46,.86)'; g.fillRect(0, 0, W, H); L.dibQuiz(null, '#fff'); return; }
    g.fillStyle = '#fff'; g.beginPath(); g.arc(230, 240, 170, 0, 7); g.fill(); g.strokeStyle = '#d9b27a'; g.lineWidth = 8; g.stroke(); g.fillStyle = '#f6efe4'; g.beginPath(); g.arc(230, 240, 125, 0, 7); g.fill();
    S.pl.forEach(function (i, k) { var a = k / 5 * Math.PI * 2 - 1.2, x = 230 + Math.cos(a) * 70, y = 240 + Math.sin(a) * 70; if (S.pl.length === 1) { x = 230; y = 240; } L.emoji(ALI[i][0], x, y, 60); });
    ALI.forEach(function (a, i) { var x = 520 + (i % 4) * 100, y = 90 + Math.floor(i / 4) * 85; g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(x - 40, y - 36, 80, 72); L.emoji(a[0], x, y - 4, 46); L.txt(a[1], x, y + 30, '#5a3a10', 'center', 12); });
    var c = cnt(S); L.txt(S.msg || 'Toca los alimentos (' + S.pl.length + ' / 5)', 230, 440, S.msg.indexOf('✔') > -1 ? '#0a5a2a' : '#5a3a10', 'center', 19);
    L.txt('🥕' + c.f + '  🍞' + c.c + '  🥚' + c.p + '  🍬' + c.s, 720, 440, '#5a3a10', 'center', 20);
  },
  hooks: function (L) { return { poner: function (i) { poner(L, i); }, correcta: function () { return L.q && !L.q.fin ? L.q.items[L.q.i].a : -1; }, resp: function (k) { L.quizResp(k); }, plato: function () { return L.S.pl.slice(); } }; }
});
document.getElementById('cv').addEventListener('click', function (e) { var L = LAB; if (L.paso !== 0) return; var q = L.xy(e); for (var i = 0; i < 16; i++) { var x = 520 + (i % 4) * 100, y = 90 + Math.floor(i / 4) * 85; if (Math.abs(q[0] - x) < 40 && Math.abs(q[1] - y) < 36) { poner(L, i); return; } } });
function cnt(S) { var c = { f: 0, c: 0, p: 0, s: 0 }; S.pl.forEach(function (i) { c[ALI[i][2]]++; }); return c; }
function poner(L, i) {
  var S = L.S; if (S.pl.length >= 5) { S.msg = 'El plato está lleno. Vacíalo para cambiar.'; return; } S.pl.push(i); L.tono(400 + S.pl.length * 80, 0.1, 0.12);
  var c = cnt(S); if (S.pl.length >= 3 && c.s === 0 && c.f && c.c && c.p) { S.msg = '✔ ¡Plato equilibrado!'; L.cumplir(0); } else if (c.s) S.msg = '🙂 Mucho dulce: se come poco'; else S.msg = 'Aún falta un grupo (🥕 🍞 🥚)';
}
function pregA(L) {
  var it = [['🍎', 'Manzana', 0], ['🥦', 'Brócoli', 0], ['🍬', 'Dulces', 1], ['🍟', 'Papas fritas', 1], ['🥛', 'Leche', 0], ['🍩', 'Dona', 1], ['🍚', 'Arroz', 0], ['🥤', 'Gaseosa', 1]];
  L.nuevoQuiz(it.map(function (x) { return { q: x[1] + ': ¿se come todos los días o de vez en cuando?', e: x[0], a: x[2], fb: x[2] ? 'De vez en cuando' : 'Todos los días' }; }), 5, 4); L.ctl(); }
function pregB(L) {
  var it = [['🍌', 'Banano', 0], ['🍞', 'Pan', 1], ['🥚', 'Huevo', 2], ['🍬', 'Dulces', 3], ['🥕', 'Zanahoria', 0], ['🍚', 'Arroz', 1], ['🐟', 'Pescado', 2], ['🍟', 'Papas fritas', 3]];
  L.nuevoQuiz(it.map(function (x) { return { q: x[1] + ': ¿a qué grupo pertenece?', e: x[0], a: x[2], fb: ['Frutas y verduras', 'Cereales', 'Proteínas y lácteos', 'Dulces y fritos'][x[2]] }; }), 5, 4); L.ctl(); }
