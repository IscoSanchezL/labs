/* Fases de la Luna (2°, solo español, sin voz): noches, siguiente fase y orden del ciclo. */
var FAS = [['Luna nueva', '🌑'], ['Luna creciente', '🌒'], ['Cuarto creciente', '🌓'], ['Gibosa creciente', '🌔'], ['Luna llena', '🌕'], ['Gibosa menguante', '🌖'], ['Cuarto menguante', '🌗'], ['Luna menguante', '🌘']];
function luna(g, x, y, r, p) {
  var a = p / 8 * Math.PI * 2, rx = Math.max(0.01, r * Math.abs(Math.cos(a)));
  g.save(); g.beginPath(); g.arc(x, y, r, 0, 7); g.clip(); g.fillStyle = '#1b2438'; g.fillRect(x - r, y - r, 2 * r, 2 * r);
  g.fillStyle = '#f4efd6'; if (p <= 4) g.fillRect(x, y - r, r, 2 * r); else g.fillRect(x - r, y - r, r, 2 * r);
  var oscura = (p === 0 || p === 1 || p === 7), clara = (p === 3 || p === 4 || p === 5);
  if (oscura) { g.fillStyle = '#1b2438'; g.beginPath(); g.ellipse(x, y, rx, r, 0, 0, 7); g.fill(); } else if (clara) { g.fillStyle = '#f4efd6'; g.beginPath(); g.ellipse(x, y, rx, r, 0, 0, 7); g.fill(); }
  g.restore(); g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 2; g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke();
}
var LAB = LabKit({
  hook: '__lun',
  pasos: [
    { n: 'Cada noche', t: '1. La Luna cambia', x: 'La Luna no cambia de forma: lo que cambia es <b>cuánta parte iluminada vemos</b>. Cada noche la vemos un poquito distinta. Pulsa «Pasar la noche» y mira.', m: 'Mira las 8 fases de la Luna.', d: 'La Luna tarda casi un mes en volver a verse igual.' },
    { n: 'Preguntas', t: '2. ¿Cómo es la Luna?', x: 'Responde sobre la Luna 🌙.', m: 'Acierta 4 de 5 preguntas.', d: 'La Luna no tiene luz propia: refleja la luz del Sol.' },
    { n: 'En orden', t: '3. Ordena las fases', x: 'Toca las fases <b>en orden</b>, empezando por la <b>Luna nueva</b>. Son 4 fases principales.', m: 'Ordena las 4 fases principales.', d: 'Con la Luna llena hay mucha luz de noche.' }
  ],
  enter: function (L, n) { var S = L.S; S.p = 0; S.vis = { 0: 1 }; S.k = 0; S.msg = ''; S.mez = null; if (n === 1) preg(L); if (n === 2) { S.mez = L.mezclar([FAS[0], FAS[2], FAS[4], FAS[6]]); } },
  reintentar: function (L) { if (L.paso === 1) preg(L); else { L.S.k = 0; L.S.msg = ''; L.S.mez = L.mezclar([FAS[0], FAS[2], FAS[4], FAS[6]]); L.ctl(); } },
  ctl: function (L) {
    var S = L.S;
    if (L.paso === 0) L.btn('🌙 Pasar la noche', function () { S.p = (S.p + 1) % 8; S.vis[S.p] = 1; L.tono(300 + S.p * 60, 0.15, 0.12); if (Object.keys(S.vis).length >= 8) L.cumplir(0); }, 'btn grande');
    if (L.paso === 1) L.quizBtns(S.ops || ['A', 'B', 'C']);
    if (L.paso === 2 && S.mez) S.mez.forEach(function (f) { L.btn(f[1] + ' ' + f[0], function () { elegir(L, f[0]); }, 'btn'); });
  },
  draw: function (L, g) {
    var S = L.S, W = L.W, H = L.H, bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0a1030'); bg.addColorStop(1, '#1b1b4a'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    for (var i = 0; i < 50; i++) { g.fillStyle = 'rgba(255,255,255,' + (0.3 + 0.5 * Math.abs(Math.sin(L.t + i))) + ')'; g.fillRect((i * 151) % W, (i * 67) % 300, 3, 3); }
    if (L.paso === 1) { L.emoji('🌙', 880, 60, 56); L.dibQuiz(null, '#fff'); return; }
    if (L.paso === 0) {
      luna(g, 300, 220, 120, S.p); L.txt(FAS[S.p][0], 300, 390, '#ffe08a', 'center', 30);
      for (var k = 0; k < 8; k++) { var x = 560 + (k % 4) * 90, y = 150 + Math.floor(k / 4) * 110; g.globalAlpha = S.vis[k] ? 1 : 0.2; luna(g, x, y, 32, k); g.globalAlpha = 1; if (k === S.p) { g.strokeStyle = '#ffe08a'; g.lineWidth = 3; g.beginPath(); g.arc(x, y, 38, 0, 7); g.stroke(); } }
      L.txt('Fases vistas: ' + Object.keys(S.vis).length + ' de 8', 700, 340, '#8be8ae', 'center', 20);
    }
    if (L.paso === 2) {
      var sq = [0, 2, 4, 6]; sq.forEach(function (f, i) { var x = 180 + i * 200, ok = i < S.k; g.globalAlpha = ok ? 1 : 0.2; luna(g, x, 200, 60, f); g.globalAlpha = 1; L.txt(ok ? FAS[f][0] : (i + 1) + '. ?', x, 300, ok ? '#8be8ae' : '#9db8ff', 'center', 19); });
      L.txt(S.msg || 'Toca primero la Luna nueva 🌑', 480, 420, S.msg.indexOf('✔') > -1 ? '#8be8ae' : S.msg ? '#ff9f9f' : '#9db8ff', 'center', 20);
    }
  },
  hooks: function (L) { return { noche: function () { var S = L.S; S.p = (S.p + 1) % 8; S.vis[S.p] = 1; if (Object.keys(S.vis).length >= 8) L.cumplir(0); }, correcta: function () { return L.q && !L.q.fin ? L.q.items[L.q.i].a : -1; }, resp: function (k) { L.quizResp(k); }, elegir: function (n) { elegir(L, n); }, sig: function () { return FAS[[0, 2, 4, 6][L.S.k]][0]; } }; }
});
function elegir(L, n) { var S = L.S; if (S.k >= 4) return; if (n === FAS[[0, 2, 4, 6][S.k]][0]) { S.k++; S.msg = '✔ ¡Muy bien!'; L.tono(500 + S.k * 80, 0.12, 0.15); S.mez = S.mez.filter(function (f) { return f[0] !== n; }); if (S.k >= 4) L.cumplir(2); L.ctl(); } else { S.msg = '✖ Esa no es la que sigue'; L.mal(); } }
function preg(L) {
  var it = [
    ['🌙 ¿La Luna tiene luz propia?', ['A) Sí', 'B) No, refleja la luz del Sol', 'C) A veces'], 1, 'Refleja la luz del Sol'],
    ['🌕 ¿Cómo se llama cuando vemos toda la Luna iluminada?', ['A) Luna llena', 'B) Luna nueva', 'C) Eclipse'], 0, 'Luna llena'],
    ['🌑 ¿Cómo se llama cuando casi no la vemos?', ['A) Luna llena', 'B) Luna nueva', 'C) Sol'], 1, 'Luna nueva'],
    ['🌍 ¿Alrededor de qué gira la Luna?', ['A) De la Tierra', 'B) De Marte', 'C) De una estrella'], 0, 'Gira alrededor de la Tierra'],
    ['🗓️ ¿Cada cuánto se repiten las fases?', ['A) Cada día', 'B) Más o menos cada mes', 'C) Cada año'], 1, 'Casi cada mes'],
    ['⭐ ¿Cuándo vemos mejor la Luna?', ['A) De noche', 'B) Solo al mediodía', 'C) Nunca'], 0, 'Sobre todo de noche']
  ];
  L.nuevoQuiz(it.map(function (x) { return { q: x[0] + '   ' + x[1].join('   '), e: '', a: x[2], fb: x[3] }; }), 5, 4); L.S.ops = ['A', 'B', 'C']; L.ctl(); }
