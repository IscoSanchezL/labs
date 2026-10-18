/* Mi cuerpo (1°, solo español, con voz de Beto): órganos, el corazón late más al correr y preguntas. */
var ORG = [['❤️', 'Corazón', 'El corazón late y manda la sangre por todo el cuerpo.'], ['🫁', 'Pulmones', 'Los pulmones se llenan de aire cuando respiras.'], ['🧠', 'Cerebro', 'El cerebro piensa y manda órdenes al cuerpo.'], ['🦴', 'Huesos', 'Los huesos sostienen el cuerpo y lo protegen.']];
var LAB = LabKit({
  hook: '__cue', voz: true,
  pasos: [
    { n: 'Por dentro', t: 'Mi cuerpo por dentro', x: 'Dentro de tu cuerpo hay partes muy importantes. El corazón, los pulmones, el cerebro y los huesos. Toca cada una para saber qué hace.', m: 'Conoce las cuatro partes.', d: 'Tu corazón late más de cien mil veces al día.' },
    { n: 'Mi corazón', t: 'Mi corazón late', x: 'Cuando corres, tu corazón late más rápido. Cuando descansas, late más despacio. Prueba correr y descansar.', m: 'Haz que tu corazón lata rápido y luego despacio.', d: 'Hacer ejercicio fortalece el corazón.' },
    { n: '¿Para qué sirve?', t: '¿Para qué sirve?', x: 'Toca la parte del cuerpo que contesta cada pregunta.', m: 'Acierta cuatro veces.', d: 'Cuidar el cuerpo es comer bien, dormir y jugar.' }
  ],
  enter: function (L, n) { var S = L.S; S.o = 0; S.vis = {}; S.bpm = 70; S.tg = 70; S.rap = 0; S.len = 0; if (n === 2) preg(L); },
  reintentar: function (L) { preg(L); },
  ctl: function (L) {
    var S = L.S;
    if (L.paso === 0) ORG.forEach(function (o, i) { L.op(o[0], o[1], function () { S.o = i; S.vis[i] = 1; L.tono(300 + i * 90, 0.12, 0.12); if (Object.keys(S.vis).length >= 4) L.cumplir(0); }); });
    if (L.paso === 1) { L.op('🏃', 'Correr', function () { S.tg = 150; }); L.op('😴', 'Descansar', function () { S.tg = 60; }); }
    if (L.paso === 2) L.quizBtns(ORG.map(function (o) { return [o[0], o[1]]; }), true);
  },
  sim: function (L, dt) { var S = L.S; S.bpm += (S.tg - S.bpm) * Math.min(1, dt * 1.2); S.ph = (S.ph || 0) + dt * S.bpm / 60 * Math.PI * 2; if (L.paso === 1) { if (S.bpm > 130) S.rap = 1; if (S.bpm < 75 && S.rap) L.cumplir(1); } },
  draw: function (L, g) {
    var S = L.S, W = L.W, H = L.H, bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#3a1c4a'); bg.addColorStop(1, '#14081f'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    if (L.paso === 2) { g.fillStyle = 'rgba(10,26,46,.5)'; g.fillRect(0, 0, W, H); L.dibQuiz(null, '#fff'); return; }
    var beat = 1 + 0.18 * Math.max(0, Math.sin(S.ph || 0));
    if (L.paso === 0) { var o = ORG[S.o], sz = 150 * (S.o === 0 ? beat : S.o === 1 ? 1 + 0.12 * Math.sin(L.t * 2) : 1); L.emoji(o[0], 270, 220, sz); L.txt(o[1], 270, 360, '#ffe08a', 'center', 34); g.fillStyle = 'rgba(5,11,20,.8)'; g.fillRect(520, 110, 380, 200); L.wrap(o[2], 710, 180, 330, 28, '#fff', 26); L.txt('Partes vistas: ' + Object.keys(S.vis).length + ' de 4', 710, 400, '#8be8ae', 'center', 20); }
    if (L.paso === 1) { L.emoji('❤️', 280, 210, 170 * beat); L.emoji(S.tg > 100 ? '🏃' : '😴', 280, 360, 70); g.fillStyle = 'rgba(5,11,20,.8)'; g.fillRect(520, 110, 380, 200); L.txt(Math.round(S.bpm) + '', 710, 210, S.bpm > 110 ? '#ff9f9f' : '#8be8ae', 'center', 70); L.txt('latidos por minuto', 710, 260, '#cfe6ff', 'center', 20); L.txt('Rápido: ' + (S.rap ? '✔' : '—') + '   Despacio: ' + (S.rap && S.bpm < 75 ? '✔' : '—'), 710, 400, '#8be8ae', 'center', 18); }
  },
  hooks: function (L) { return { parte: function (i) { L.S.o = i; L.S.vis[i] = 1; if (Object.keys(L.S.vis).length >= 4) L.cumplir(0); }, meta: function (t) { L.S.tg = t; }, bpm: function () { return L.S.bpm; }, correcta: function () { return L.q && !L.q.fin ? L.q.items[L.q.i].a : -1; }, resp: function (k) { L.quizResp(k); } }; }
});
function preg(L) {
  var it = [['¿Qué parte late y manda la sangre?', '🩸', 0, 'El corazón'], ['¿Con qué parte respiras el aire?', '🌬️', 1, 'Con los pulmones'], ['¿Qué parte piensa y manda órdenes?', '💭', 2, 'El cerebro'], ['¿Qué parte sostiene tu cuerpo?', '🧍', 3, 'Los huesos'], ['¿Qué parte se llena de aire al respirar?', '🫧', 1, 'Los pulmones'], ['¿Qué parte late más rápido cuando corres?', '🏃', 0, 'El corazón']];
  L.nuevoQuiz(it.map(function (x) { return { q: x[0], e: x[1], a: x[2], fb: x[3] }; }), 5, 4); L.ctl(); }
