/* Fases de la Luna y eclipses (4°, solo español, sin voz). */
LabKit({
  reto: true, hook: '__luna',
  pasos: [
    { n: 'Las fases', t: '1. La Luna cambia de forma', x: 'La Luna no tiene luz propia: la ilumina el <b>Sol</b>. Siempre está alumbrada la mitad que mira al Sol, pero desde la Tierra vemos más o menos de esa mitad según dónde esté en su órbita. Eso son las <b>fases</b>.', m: 'Mueve la Luna por su órbita y encuentra Luna nueva, cuarto creciente, llena y cuarto menguante.', d: 'La Luna tarda unos 29,5 días en completar todas sus fases.' },
    { n: 'Reconoce la fase', t: '2. ¿Qué fase es?', x: 'Observa cómo se ve la Luna desde la Tierra: si crece hacia la derecha es <b>creciente</b>; si se achica por la derecha es <b>menguante</b>. Cuando no se ve es <b>nueva</b> y cuando se ve entera, <b>llena</b>.', m: 'Acierta 4 de 5 fases.', d: 'En el hemisferio norte la Luna creciente se ve como una «D» y la menguante como una «C».' },
    { n: 'Eclipses', t: '3. Eclipses de Sol y de Luna', x: 'Un <b>eclipse solar</b> pasa cuando la Luna se pone entre el Sol y la Tierra y tapa el Sol. Un <b>eclipse lunar</b> pasa cuando la Tierra queda entre el Sol y la Luna y su sombra la oscurece. No ocurren cada mes porque la órbita de la Luna está <b>inclinada</b>.', m: 'Provoca un eclipse solar y uno lunar (activa «Alinear la órbita»).', d: 'Mirar un eclipse solar sin gafas especiales puede dañar los ojos.' }
  ],
  enter: function (L, n) { var S = L.S; S.th = S.th === undefined ? 45 : S.th; S.vistos = S.vistos || {}; S.alin = false; S.ecl = {}; if (n === 1) L.nuevoQuiz([0, 90, 180, 270, 45, 135, 225, 315].filter(function (a) { return [0, 90, 180, 270].indexOf(a) >= 0; }).map(function (a) { return { a: a, k: [0, 1, 2, 3][[0, 90, 180, 270].indexOf(a)] }; }).concat([{ a: 0, k: 0 }]).map(function (o) { return { q: '', th: o.a, a: o.k, fb: ['Era Luna nueva', 'Era cuarto creciente', 'Era Luna llena', 'Era cuarto menguante'][o.k] }; }), 5, 4); },
  reintentar: function (L) { L.nuevoQuiz([0, 90, 180, 270, 0].map(function (a, i) { return { q: '', th: a, a: [0, 1, 2, 3][[0, 90, 180, 270].indexOf(a)], fb: 'Mira la forma de la Luna' }; }), 5, 4); },
  ctl: function (L) {
    var S = L.S;
    if (L.paso === 0) L.rango('🌙 Posición de la Luna (grados)', 0, 359, 1, S.th, function (v) { S.th = v; var k = [[0, 'nueva'], [90, 'creciente'], [180, 'llena'], [270, 'menguante']]; k.forEach(function (x) { if (Math.abs(((v - x[0] + 540) % 360) - 180) < 8) S.vistos[x[1]] = 1; }); if (Object.keys(S.vistos).length >= 4) L.cumplir(0); });
    if (L.paso === 1) L.quizBtns(['🌑 Luna nueva', '🌓 Cuarto creciente', '🌕 Luna llena', '🌗 Cuarto menguante']);
    if (L.paso === 2) { L.rango('🌙 Posición de la Luna (grados)', 0, 359, 1, S.th, function (v) { S.th = v; }); L.btn(S.alin ? '✔ Órbita alineada' : '↔ Alinear la órbita', function () { S.alin = !S.alin; L.ctl(); }, 'tab', S.alin); }
  },
  draw: function (L, g) {
    var S = L.S, W = L.W, H = L.H, bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#02040a'); bg.addColorStop(1, '#0a1226'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    for (var i = 0; i < 70; i++) { g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect((i * 151) % W, (i * 47) % H, 1.6, 1.6); }
    function fase(cx, cy, R, th, rojo, sombra) {
      g.save(); g.beginPath(); g.arc(cx, cy, R, 0, 7); g.clip(); g.fillStyle = rojo ? '#3a1410' : '#1a2033'; g.fillRect(cx - R, cy - R, 2 * R, 2 * R);
      var a = th * Math.PI / 180, wax = th < 180; g.fillStyle = rojo ? '#b8431c' : '#f3efe0';
      for (var y = -R; y <= R; y += 1) { var w = Math.sqrt(Math.max(0, R * R - y * y)), xt = w * Math.cos(wax ? a : (Math.PI * 2 - a)), x0 = wax ? xt : -w, x1 = wax ? w : -xt; if (x1 > x0) g.fillRect(cx + x0, cy + y, x1 - x0, 1.2); }
      g.fillStyle = 'rgba(120,120,110,.35)'; [[-.3, -.2, .18], [.25, .1, .22], [-.1, .35, .14]].forEach(function (c) { g.beginPath(); g.arc(cx + c[0] * R, cy + c[1] * R, c[2] * R, 0, 7); g.fill(); }); g.restore(); g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, R, 0, 7); g.stroke();
    }
    var sx = 100, sy = 250, ex = 470, ey = 250, R = 130, th = S.th, a = th * Math.PI / 180;
    // sol
    var hh = g.createRadialGradient(sx, sy, 5, sx, sy, 200); hh.addColorStop(0, 'rgba(255,230,120,.95)'); hh.addColorStop(1, 'rgba(255,230,120,0)'); g.fillStyle = hh; g.fillRect(0, 0, 360, H); g.fillStyle = '#ffd95e'; g.beginPath(); g.arc(sx, sy, 48, 0, 7); g.fill();
    g.strokeStyle = 'rgba(255,224,130,.25)'; g.lineWidth = 3; [-80, -40, 0, 40, 80].forEach(function (d) { g.beginPath(); g.moveTo(170, sy + d * 0.6); g.lineTo(ex - 40, sy + d); g.stroke(); });
    // órbita
    g.strokeStyle = 'rgba(157,184,255,.35)'; g.setLineDash([6, 8]); g.lineWidth = 2; g.beginPath(); if (L.paso === 2) g.ellipse(ex, ey, R, R, 0, 0, 7); else g.arc(ex, ey, R, 0, 7); g.stroke(); g.setLineDash([]);
    // Tierra
    var tg = g.createRadialGradient(ex - 10, ey - 10, 4, ex, ey, 34); tg.addColorStop(0, '#6fb8ff'); tg.addColorStop(1, '#1d4f9a'); g.fillStyle = tg; g.beginPath(); g.arc(ex, ey, 30, 0, 7); g.fill(); g.fillStyle = '#3fbf6a'; g.beginPath(); g.ellipse(ex - 6, ey - 6, 10, 7, 0.5, 0, 7); g.fill();
    // Luna (mitad iluminada hacia el Sol)
    var lunar = false, solar = false, mcx = ex - R * Math.cos(a), mcy = ey - R * Math.sin(a);
    if (L.paso === 2) { var alto = S.alin ? 0 : 52; mcy = ey - R * Math.sin(a) * 0.0 - (Math.cos(a) > 0.9 || Math.cos(a) < -0.9 ? alto : 0); mcx = ex - R * Math.cos(a); mcy = ey - R * Math.sin(a) * 0.45 - (Math.abs(Math.cos(a)) > 0.8 ? alto * (Math.abs(Math.cos(a)) - 0.7) / 0.3 : 0);
      if (S.alin) { if (Math.abs(((th + 180) % 360) - 180) < 7) solar = true; if (Math.abs(th - 180) < 7) lunar = true; } if (solar) S.ecl.solar = 1; if (lunar) S.ecl.lunar = 1; if (S.ecl.solar && S.ecl.lunar) L.cumplir(2); }
    var lg = g.createRadialGradient(mcx, mcy, 2, mcx, mcy, 18); g.save(); g.beginPath(); g.arc(mcx, mcy, 18, 0, 7); g.clip(); g.fillStyle = '#1a2033'; g.fillRect(mcx - 18, mcy - 18, 36, 36); g.fillStyle = lunar ? '#b8431c' : '#f3efe0'; g.fillRect(mcx - 18, mcy - 18, 18, 36); g.restore();
    if (solar) { g.fillStyle = 'rgba(0,0,0,.55)'; g.beginPath(); g.moveTo(mcx, mcy - 18); g.lineTo(ex + 18, ey - 24); g.lineTo(ex + 18, ey + 24); g.lineTo(mcx, mcy + 18); g.fill(); }
    if (L.paso === 2 && !lunar && S.alin) { }
    // inset: cómo se ve desde la Tierra
    var vx = 830, vy = 140; g.fillStyle = 'rgba(2,4,10,.75)'; g.fillRect(vx - 105, vy - 100, 210, 235); L.txt('Visto desde la Tierra', vx, vy - 76, '#9db8ff', 'center', 15);
    if (L.paso === 1 && L.q) { var it = L.q.items[Math.min(L.q.i, L.q.n - 1)]; if (L.q.fin) it = null; if (it) fase(vx, vy + 2, 70, it.th, false); else fase(vx, vy + 2, 70, 90, false); }
    else if (L.paso === 2) { fase(vx, vy + 2, 70, th, lunar); if (solar) { L.txt('☀️ Eclipse solar', vx, vy + 118, '#ffe08a', 'center', 18); g.fillStyle = 'rgba(0,0,0,.9)'; g.beginPath(); g.arc(vx, vy + 2, 70, 0, 7); g.fill(); g.strokeStyle = '#ffe08a'; g.lineWidth = 3; g.beginPath(); g.arc(vx, vy + 2, 72, 0, 7); g.stroke(); } else if (lunar) L.txt('🌑 Eclipse lunar', vx, vy + 118, '#ff9f7a', 'center', 18); else L.txt(S.alin ? 'Sin eclipse' : 'La sombra pasa de largo', vx, vy + 118, '#cfe6ff', 'center', 16); }
    else { fase(vx, vy + 2, 70, th, false); var nombres = ['Luna nueva', 'Creciente', 'Cuarto creciente', 'Gibosa creciente', 'Luna llena', 'Gibosa menguante', 'Cuarto menguante', 'Menguante']; L.txt(nombres[Math.round(th / 45) % 8], vx, vy + 118, '#cfe6ff', 'center', 18); }
    if (L.paso === 1) { L.dibQuiz(null, '#cfe6ff'); } else { L.txt('☀️ Sol', sx, sy + 78, '#ffe08a', 'center', 15); L.txt('Tierra', ex, ey + 54, '#9db8ff', 'center', 15); L.txt('Luna', mcx, mcy + 34, '#f3efe0', 'center', 14); }
  },
  hooks: function (L) { return { th: function (v) { L.S.th = v; var k = [[0, 'nueva'], [90, 'creciente'], [180, 'llena'], [270, 'menguante']]; k.forEach(function (x) { if (Math.abs(((v - x[0] + 540) % 360) - 180) < 8) L.S.vistos[x[1]] = 1; }); if (Object.keys(L.S.vistos).length >= 4) L.cumplir(0); }, alin: function (v) { L.S.alin = v; }, correcta: function () { return L.q && !L.q.fin ? L.q.items[L.q.i].a : -1; }, resp: function (k) { L.quizResp(k); } }; }
});
