/* Calor y temperatura (3°, solo español, sin voz): termómetro, conductores y aislantes, preguntas. */
var CUC = [['Metal', '#c0c8d4', 1.0, '🥄', 'El metal conduce muy bien el calor: es un conductor.'], ['Plástico', '#e8704a', 0.25, '🥄', 'El plástico conduce poco el calor: es aislante.'], ['Madera', '#a8743a', 0.12, '🥢', 'La madera casi no conduce el calor: es muy buen aislante.']];
var LAB = LabKit({
  hook: '__cal',
  pasos: [
    { n: 'El termómetro', t: '1. Calienta y enfría', x: 'La <b>temperatura</b> mide qué tan caliente o frío está algo (en grados °C). El <b>calor</b> es energía que pasa de lo caliente a lo frío. Calienta el agua con la llama y enfríala con hielo.', m: 'Llega a más de 80 °C y luego baja de 10 °C.', d: 'El agua hierve a 100 °C y se congela a 0 °C (a nivel del mar).' },
    { n: 'Conductores', t: '2. Cucharas en agua caliente', x: 'El calor viaja por algunos materiales más rápido que por otros. Los <b>conductores</b> (como los metales) lo transmiten bien; los <b>aislantes</b> (madera, plástico) casi no. Prueba cada cuchara.', m: 'Prueba las 3 cucharas.', d: 'Por eso las ollas son de metal y sus mangos de plástico o madera.' },
    { n: 'Preguntas', t: '3. Preguntas de calor', x: 'Responde sobre temperatura, calor y materiales.', m: 'Acierta 4 de 5 preguntas.', d: 'El calor siempre viaja de lo más caliente a lo más frío, nunca al revés.' }
  ],
  enter: function (L, n) { var S = L.S; S.T = 20; S.tg = 20; S.hot = 0; S.cold = 0; S.sp = 0; S.run = null; S.test = {}; S.tc = 20; if (n === 2) preg(L); },
  reintentar: function (L) { preg(L); },
  ctl: function (L) {
    var S = L.S;
    if (L.paso === 0) { L.btn('🔥 Calentar', function () { S.tg = 100; }, 'btn'); L.btn('❄️ Enfriar', function () { S.tg = 0; }, 'btn'); L.btn('⏸️ Parar', function () { S.tg = S.T; }, 'btn sec'); }
    if (L.paso === 1) { CUC.forEach(function (c, i) { L.btn(c[3] + ' ' + c[0], function () { if (!S.run) S.sp = i; }, 'btn sec'); }); L.btn('♨️ Meter en agua caliente', function () { if (!S.run) S.run = { t: 0 }; }, 'btn grande'); }
    if (L.paso === 2) L.quizBtns(S.ops || ['A', 'B', 'C']);
  },
  sim: function (L, dt) {
    var S = L.S;
    if (L.paso === 0) { var d = S.tg - S.T; S.T += Math.sign(d) * Math.min(Math.abs(d), 12 * dt); if (S.T > 80) S.hot = 1; if (S.T < 10) S.cold = 1; if (S.hot && S.cold) L.cumplir(0); }
    if (L.paso === 1 && S.run) { S.run.t += dt; S.tc = 20 + 60 * (1 - Math.exp(-S.run.t * CUC[S.sp][2] * 0.5)); if (S.run.t >= 5) { S.test[S.sp] = 1; S.last = CUC[S.sp][4]; S.run = null; if (Object.keys(S.test).length >= 3) L.cumplir(1); } }
  },
  draw: function (L, g) {
    var S = L.S, W = L.W, H = L.H, bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#2a1a2e'); bg.addColorStop(1, '#0c0814'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    if (L.paso === 2) { L.emoji('🌡️', 880, 60, 44); L.dibQuiz(null, '#fff'); return; }
    if (L.paso === 0) {
      var f = Math.max(0, Math.min(1, S.T / 100)), col = 'hsl(' + (220 - f * 220) + ',85%,55%)';
      g.fillStyle = col; g.globalAlpha = 0.35; g.fillRect(100, 200, 280, 170); g.globalAlpha = 1; g.strokeStyle = '#fff'; g.lineWidth = 3; g.strokeRect(100, 200, 280, 170); L.txt('Agua', 240, 300, '#fff', 'center', 24);
      if (S.tg > S.T + 0.5) { for (var i = 0; i < 3; i++) L.emoji('🔥', 150 + i * 90, 398 + Math.sin(L.t * 8 + i) * 4, 44); } else if (S.tg < S.T - 0.5) { L.emoji('🧊', 170, 170 + Math.sin(L.t * 3) * 4, 44); L.emoji('🧊', 300, 175, 44); }
      g.fillStyle = '#fff'; g.fillRect(520, 50, 36, 330); g.fillStyle = col; g.fillRect(526, 380 - f * 320, 24, f * 320 + 0); g.beginPath(); g.arc(538, 392, 28, 0, 7); g.fillStyle = col; g.fill();
      for (var t = 0; t <= 100; t += 20) { L.txt(t + '°', 590, 384 - t * 3.2 + 6, '#cfe6ff', 'left', 14); }
      L.txt(S.T.toFixed(0) + ' °C', 760, 200, '#ffe08a', 'center', 52); L.txt('Más de 80: ' + (S.hot ? '✔' : '—') + '   Menos de 10: ' + (S.cold ? '✔' : '—'), 760, 270, '#8be8ae', 'center', 18);
    }
    if (L.paso === 1) {
      g.fillStyle = 'rgba(255,120,60,.45)'; g.fillRect(100, 250, 260, 160); g.strokeStyle = '#fff'; g.lineWidth = 3; g.strokeRect(100, 250, 260, 160); L.txt('Agua a 80 °C', 230, 395, '#fff', 'center', 16);
      var c = CUC[S.sp], tc = S.run ? S.tc : (S.test[S.sp] ? 20 + 60 * (1 - Math.exp(-5 * c[2] * 0.5)) : 20), q = (tc - 20) / 60; g.save(); g.translate(300, 180); g.rotate(-0.35); g.fillStyle = c[1]; g.fillRect(-12, -90, 24, 260); g.fillStyle = 'hsl(' + (200 - q * 200) + ',90%,55%)'; g.fillRect(-12, -90, 24, 60); g.restore(); L.emoji('✋', 240, 100, 34);
      g.fillStyle = 'rgba(5,11,20,.85)'; g.fillRect(500, 90, 400, 260); L.txt(c[3] + ' ' + c[0], 700, 135, c[1], 'center', 28); L.txt('Mango: ' + tc.toFixed(0) + ' °C', 700, 195, q > 0.5 ? '#ff9f9f' : '#8be8ae', 'center', 32); L.wrap(S.test[S.sp] ? c[4] : 'Meter en agua caliente y espera 5 s.', 700, 250, 340, 22, '#cfe6ff'); L.txt('Cucharas probadas: ' + Object.keys(S.test).length + ' / 3', 700, 410, '#8be8ae', 'center', 17);
    }
  },
  hooks: function (L) { return { meta: function (t) { L.S.tg = t; }, T: function () { return L.S.T; }, cuchara: function (i) { L.S.sp = i; L.S.run = { t: 0 }; }, fin: function () { return !L.S.run; }, correcta: function () { return L.q && !L.q.fin ? L.q.items[L.q.i].a : -1; }, resp: function (k) { L.quizResp(k); } }; }
});
function preg(L) {
  var it = [
    ['🌡️ ¿Con qué instrumento se mide la temperatura?', ['A) Termómetro', 'B) Regla', 'C) Balanza'], 0, 'Con un termómetro'],
    ['♨️ ¿A cuántos °C hierve el agua?', ['A) 0', 'B) 50', 'C) 100'], 2, 'A 100 °C'],
    ['🥄 ¿Qué material es buen conductor del calor?', ['A) Metal', 'B) Madera', 'C) Plástico'], 0, 'El metal'],
    ['🧤 ¿Por qué los mangos de las ollas son de plástico o madera?', ['A) Son aislantes y no queman', 'B) Son más baratos', 'C) Brillan más'], 0, 'Porque son aislantes'],
    ['🔥 El calor siempre va de…', ['A) Lo caliente a lo frío', 'B) Lo frío a lo caliente', 'C) Ninguno'], 0, 'De lo caliente a lo frío'],
    ['🧊 ¿A cuántos °C se congela el agua?', ['A) 0', 'B) 20', 'C) 100'], 0, 'A 0 °C']
  ];
  L.nuevoQuiz(it.map(function (x) { return { q: x[0] + '   ' + x[1].join('   '), e: '', a: x[2], fb: x[3] }; }), 5, 4); L.S.ops = ['A', 'B', 'C']; L.ctl(); }
