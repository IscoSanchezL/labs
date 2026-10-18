/* Gravedad (3°, solo español, sin voz): caída con y sin aire, preguntas y peso en distintos mundos. */
var MUND = [['🌍 Tierra', 1, '#4a90d9'], ['🌙 Luna', 0.17, '#9aa3b5'], ['♂️ Marte', 0.38, '#c1593a'], ['🪐 Júpiter', 2.5, '#d9a066']];
var LAB = LabKit({
  hook: '__gra',
  pasos: [
    { n: 'La caída', t: '1. ¿Cae igual una pluma?', x: 'La <b>gravedad</b> atrae todo hacia el suelo. En el aire, la pluma cae despacio por la <b>resistencia del aire</b>, no porque pese menos. Suelta la bola y la pluma con aire y también en el <b>vacío</b>.', m: 'Haz la caída con aire y sin aire (vacío).', d: 'En 1971 un astronauta soltó un martillo y una pluma en la Luna: ¡cayeron a la vez!' },
    { n: 'Preguntas', t: '2. Preguntas de gravedad', x: 'La gravedad nos mantiene en el suelo, hace que los objetos caigan y mantiene la Luna girando alrededor de la Tierra. Responde las preguntas.', m: 'Acierta 4 de 5 preguntas.', d: 'Isaac Newton entendió la gravedad al pensar por qué cae una manzana.' },
    { n: 'Peso en otros mundos', t: '3. ¿Cuánto pesarías?', x: 'La gravedad cambia en cada mundo. Tu <b>masa</b> es la misma, pero tu <b>peso</b> depende de la gravedad. Una niña de 30 kg pesa unos 300 N en la Tierra. Visita los mundos.', m: 'Visita los 4 mundos.', d: 'En Júpiter la gravedad es tan fuerte que pesarías 2,5 veces más.' }
  ],
  enter: function (L, n) { var S = L.S; S.vac = false; S.ob = null; S.vis = {}; S.m = 0; S.visto = {}; if (n === 1) preg(L); if (n === 2) { S.m = 0; S.vis = {}; S.vis[0] = 1; } },
  reintentar: function (L) { preg(L); },
  ctl: function (L) {
    var S = L.S;
    if (L.paso === 0) { L.btn(S.vac ? '🌬️ Poner aire' : '🫙 Hacer vacío', function () { if (!S.ob) { S.vac = !S.vac; L.ctl(); } }, 'btn sec'); L.btn('⬇️ Soltar', function () { soltar(L); }, 'btn grande'); }
    if (L.paso === 1) L.quizBtns(S.ops || ['A', 'B', 'C']);
    if (L.paso === 2) MUND.forEach(function (m, i) { L.btn(m[0], function () { S.m = i; S.vis[i] = 1; L.tono(300 + i * 100, 0.1, 0.12); if (Object.keys(S.vis).length >= 4) L.cumplir(2); }, 'btn'); });
  },
  sim: function (L, dt) {
    var S = L.S, o = S.ob; if (!o) return; o.t += dt; var tt = o.t * 1.4;
    o.b = 9.8 * tt * tt / 2 / 9.8 * 5; o.f = S.vac ? o.b : Math.min(o.b, 40 * tt * 0.9 + 0) * (1);
    if (!S.vac) o.f = 30 * tt; o.b = Math.min(o.b, 300); o.f = Math.min(o.f, 300);
    if (o.b >= 300 && o.f >= 300 || o.t > 12) { S.fin[S.vac ? 'vac' : 'aire'] = 1; S.ob = null; L.ctl(); if (S.fin.vac && S.fin.aire) L.cumplir(0); }
  },
  draw: function (L, g) {
    var S = L.S, W = L.W, H = L.H, bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, S.vac ? '#06060f' : '#1d4f7a'); bg.addColorStop(1, S.vac ? '#10102a' : '#8ec5e8'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    if (L.paso === 1) { L.emoji('🍎', 880, 60, 44); L.dibQuiz(null, '#fff'); return; }
    if (L.paso === 0) {
      S.fin = S.fin || {}; var o = S.ob; g.fillStyle = '#5a7a3a'; g.fillRect(0, 430, W, 30); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(380, 40, 200, 390);
      L.emoji('⚽', 430, 70 + (o ? o.b : 0), 46); L.emoji('🪶', 530, 70 + (o ? o.f : 0), 46); L.txt('Bola', 430, 450, '#fff', 'center', 15); L.txt('Pluma', 530, 450, '#fff', 'center', 15);
      L.txt(S.vac ? '🫙 Vacío: sin aire' : '🌬️ Con aire', 150, 100, '#ffe08a', 'center', 22); L.txt('Con aire: ' + (S.fin.aire ? '✔' : '—') + '   Vacío: ' + (S.fin.vac ? '✔' : '—'), 750, 100, '#8be8ae', 'center', 19);
      if (S.fin.vac && !S.ob && S.vac) L.txt('¡Cayeron a la vez!', 750, 180, '#ffe08a', 'center', 22);
    }
    if (L.paso === 2) {
      var m = MUND[S.m]; var cx = 300, cy = 240, r = 70 + m[1] * 16; g.fillStyle = m[2]; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fill(); L.emoji('🧒', cx, cy - r - 25, 50);
      g.fillStyle = 'rgba(5,11,20,.8)'; g.fillRect(520, 100, 380, 250); L.txt(m[0], 710, 150, '#fff', 'center', 28); L.txt('Gravedad: ' + (9.8 * m[1]).toFixed(1) + ' m/s²', 710, 200, '#9db8ff', 'center', 20); L.txt('Masa: 30 kg (igual)', 710, 245, '#cfe6ff', 'center', 20); L.txt('Peso: ' + Math.round(300 * m[1]) + ' N', 710, 300, '#ffe08a', 'center', 32); L.txt('Mundos visitados: ' + Object.keys(S.vis).length + ' / 4', 710, 410, '#8be8ae', 'center', 17);
    }
  },
  hooks: function (L) { return { vacio: function (v) { L.S.vac = v; }, soltar: function () { soltar(L); }, ocupado: function () { return !!L.S.ob; }, correcta: function () { return L.q && !L.q.fin ? L.q.items[L.q.i].a : -1; }, resp: function (k) { L.quizResp(k); }, mundo: function (i) { L.S.m = i; L.S.vis[i] = 1; if (Object.keys(L.S.vis).length >= 4) L.cumplir(2); } }; }
});
function soltar(L) { var S = L.S; if (S.ob) return; S.fin = S.fin || {}; S.ob = { t: 0, b: 0, f: 0 }; L.tono(260, 0.1, 0.1); L.ctl(); }
function preg(L) {
  var it = [
    ['🍎 ¿Qué hace que una manzana caiga al suelo?', ['A) La gravedad', 'B) El viento', 'C) La luz'], 0, 'La gravedad'],
    ['🪶 ¿Por qué cae lenta una pluma en el aire?', ['A) Por la resistencia del aire', 'B) Porque no tiene masa', 'C) Porque no hay gravedad'], 0, 'Por la resistencia del aire'],
    ['🌙 ¿Qué mantiene a la Luna girando alrededor de la Tierra?', ['A) La gravedad', 'B) Un cable', 'C) El Sol solo'], 0, 'La gravedad de la Tierra'],
    ['⚖️ En la Luna, tu masa…', ['A) Es la misma', 'B) Es cero', 'C) Es mayor'], 0, 'La masa no cambia; el peso sí'],
    ['🪐 ¿Dónde pesarías más?', ['A) En Júpiter', 'B) En la Luna', 'C) En Marte'], 0, 'En Júpiter, por su gran gravedad'],
    ['🔨 Sin aire, un martillo y una pluma caen…', ['A) A la vez', 'B) El martillo primero', 'C) La pluma primero'], 0, 'A la vez']
  ];
  L.nuevoQuiz(it.map(function (x) { return { q: x[0] + '   ' + x[1].join('   '), e: '', a: x[2], fb: x[3] }; }), 5, 4); L.S.ops = ['A', 'B', 'C']; L.ctl(); }
