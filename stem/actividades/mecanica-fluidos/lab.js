/* Presión y fluidos (6°, solo español, sin voz): P = F/A, prensa hidráulica (Pascal), presión según la profundidad. */
var LAB = LabKit({
  reto: true, hook: '__flu',
  pasos: [
    { n: 'Presión', t: '1. Presión = fuerza / área', x: 'La <b>presión</b> es cuánta fuerza actúa sobre cada unidad de área: <b>P = F / A</b>. Con la misma fuerza, una punta pequeña presiona mucho más que una superficie grande. Cambia la fuerza y el área.', m: 'Logra una presión mayor a 500 kPa y una menor a 20 kPa.', d: 'Por eso un cuchillo afilado corta: toda la fuerza se concentra en un área minúscula.' },
    { n: 'Prensa hidráulica', t: '2. El principio de Pascal', x: 'En un líquido encerrado, la presión se transmite igual en todas direcciones (<b>Pascal</b>). En una <b>prensa hidráulica</b>, un émbolo pequeño empuja y otro más grande levanta mucho más peso: <b>F₂ = F₁ · A₂ / A₁</b>.', m: 'Levanta el carro de 800 N usando una fuerza menor a 100 N.', d: 'Los frenos de los carros y los gatos hidráulicos usan este principio.' },
    { n: 'Profundidad', t: '3. Más profundo, más presión', x: 'La presión de un líquido aumenta con la <b>profundidad</b>: <b>P = ρ · g · h</b>. Cada 10 metros bajo el agua suman casi una atmósfera (100 kPa). Responde y baja el buzo.', m: 'Acierta 4 de 5 preguntas.', d: 'Los submarinos y los peces de aguas profundas están hechos para soportar presiones enormes.' }
  ],
  enter: function (L, n) { var S = L.S; S.F = 100; S.A = 0.1; S.f1 = 20; S.a2 = 4; S.hi = 0; S.lo = 0; if (n === 2) preg(L); if (L.paso === 0) { S.F = 100; S.A = 0.1; } },
  reintentar: function (L) { preg(L); },
  ctl: function (L) {
    var S = L.S;
    if (L.paso === 0) { L.rango('💪 Fuerza (N)', 10, 1000, 10, S.F, function (v) { S.F = v; ch(L); }); L.rango('⬛ Área (cm²)', 1, 500, 1, S.A * 1000, function (v) { S.A = v / 1000; ch(L); }); }
    if (L.paso === 1) { L.rango('👇 Fuerza que aplicas (N)', 5, 200, 5, S.f1, function (v) { S.f1 = v; ch2(L); }); L.rango('🔁 Émbolo grande (× más área)', 2, 20, 1, S.a2, function (v) { S.a2 = v; ch2(L); }); }
    if (L.paso === 2) L.quizBtns(S.ops || ['A', 'B', 'C']);
  },
  draw: function (L, g) {
    var S = L.S, W = L.W, H = L.H; L.fondo('agua');
    if (L.paso === 2) { var q = L.q; if (q && !q.fin) { for (var i = 0; i < 5; i++) { g.fillStyle = 'rgba(80,160,255,' + (0.08 + i * 0.04) + ')'; g.fillRect(0, 300 + i * 32, W, 32); } L.txt('🤿', 880, 300 + Math.min(4, q.ok || 0) * 36 + 20, '#fff', 'center', 40); } L.dibQuiz(null, '#cfe6ff'); return; }
    if (L.paso === 0) {
      var P = S.F / S.A / 1000, w = 30 + S.A * 800, cx = 300, y = 360; g.fillStyle = '#ffb347'; g.fillRect(cx - w / 2, y - 14, w, 14); g.fillStyle = '#c28a4a'; g.fillRect(cx - w / 2 - 20, y, w + 40, 60);
      g.fillStyle = '#7ff0e4'; var fl = 20 + S.F / 12; g.fillRect(cx - 4, y - 14 - fl, 8, fl); g.beginPath(); g.moveTo(cx - 14, y - 14 - fl + 10); g.lineTo(cx, y - 14 - fl - 8); g.lineTo(cx + 14, y - 14 - fl + 10); g.fill();
      L.txt('F = ' + S.F + ' N', cx + 60, 200, '#7ff0e4', 'left', 20); L.txt('A = ' + (S.A * 1000).toFixed(0) + ' cm²', cx + 60, 230, '#ffb347', 'left', 20);
      g.fillStyle = 'rgba(5,11,20,.8)'; g.fillRect(560, 90, 340, 270); L.txt('Presión', 730, 130, '#9db8ff', 'center', 16); L.txt(P.toFixed(P < 10 ? 1 : 0) + ' kPa', 730, 210, P > 500 ? '#ff9f9f' : P < 20 ? '#8be8ae' : '#ffe08a', 'center', 52); L.txt('P = F / A', 730, 260, '#9db8ff', 'center', 20); L.txt(P > 500 ? '🔪 ¡Muy alta!' : P < 20 ? '🛏️ Muy suave' : '', 730, 320, '#fff', 'center', 24);
    }
    if (L.paso === 1) {
      var f2 = S.f1 * S.a2, lift = Math.min(1, f2 / 800), ok = f2 >= 800;
      g.fillStyle = '#2b6cb0'; g.fillRect(180, 330, 600, 60); g.fillRect(180, 250, 40, 100); g.fillRect(660, 190 + 0, 120, 160);
      var p1 = 40 + (1 - lift) * 0, y1 = 250 + 20 * lift; g.fillStyle = '#9ad1ff'; g.fillRect(185, y1, 30, 10); L.emoji('👇', 200, y1 - 28, 34); L.txt(S.f1 + ' N', 200, y1 - 62, '#7ff0e4', 'center', 18);
      var y2 = 190 - lift * 55; g.fillStyle = '#9ad1ff'; g.fillRect(665, y2 + 40, 110, 10); L.emoji('🚗', 720, y2 + 15, 56); L.txt(f2.toFixed(0) + ' N de empuje', 720, 140, ok ? '#8be8ae' : '#ffe08a', 'center', 18);
      L.txt(ok ? '✔ ¡El carro sube! (800 N)' : 'Falta fuerza: el carro pesa 800 N', 480, 440, ok ? '#8be8ae' : '#9db8ff', 'center', 20);
    }
  },
  hooks: function (L) { return { pres: function (F, A) { L.S.F = F; L.S.A = A; ch(L); }, prensa: function (f, a) { L.S.f1 = f; L.S.a2 = a; ch2(L); }, correcta: function () { return L.q && !L.q.fin ? L.q.items[L.q.i].a : -1; }, resp: function (k) { L.quizResp(k); } }; }
});
function ch(L) { var S = L.S, P = S.F / S.A / 1000; if (P > 500) S.hi = 1; if (P < 20) S.lo = 1; if (S.hi && S.lo) L.cumplir(0); }
function ch2(L) { var S = L.S; if (S.f1 * S.a2 >= 800 && S.f1 < 100) L.cumplir(1); }
function preg(L) {
  var it = [
    ['🔪 ¿Por qué corta mejor un cuchillo afilado?', ['A) Tiene menos área: más presión', 'B) Pesa más', 'C) Es más caliente'], 0, 'Menos área, misma fuerza, más presión'],
    ['🚗 En una prensa hidráulica, ¿qué émbolo recibe la fuerza pequeña?', ['A) El de mayor área', 'B) El de menor área', 'C) Ninguno'], 1, 'Se empuja el pequeño y el grande levanta'],
    ['🤿 ¿Qué pasa con la presión al bajar en el mar?', ['A) Disminuye', 'B) Aumenta', 'C) Se mantiene'], 1, 'Aumenta con la profundidad'],
    ['📐 ¿Cuál es la fórmula de la presión?', ['A) P = F · A', 'B) P = F / A', 'C) P = A / F'], 1, 'P = F / A'],
    ['🌊 Cada 10 m bajo el agua, la presión sube cerca de…', ['A) 1 atmósfera', 'B) 10 atmósferas', 'C) 0'], 0, 'Casi 1 atmósfera (100 kPa)'],
    ['🛑 ¿Qué principio usan los frenos hidráulicos?', ['A) Principio de Pascal', 'B) Ley de Ohm', 'C) Ley de la gravedad'], 0, 'Principio de Pascal']
  ];
  L.nuevoQuiz(it.map(function (x) { return { q: x[0] + '   ' + x[1].join('   '), e: '', a: x[2], fb: x[3] }; }), 5, 4); L.S.ops = ['A', 'B', 'C']; L.ctl(); }
