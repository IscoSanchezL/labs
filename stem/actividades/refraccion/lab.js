/* Lentes y refracción (5°, solo español, sin voz): ley de Snell, índices de refracción y enfoque con una lente convergente. */
var MEDIOS = [['💨 Aire', 1.0, '#9db8ff'], ['💧 Agua', 1.33, '#3aa0f0'], ['🪟 Vidrio', 1.5, '#7ff0e4'], ['💎 Diamante', 2.42, '#c9a8ff']];
LabKit({
  hook: '__ref',
  pasos: [
    { n: 'La luz se dobla', t: '1. Refracción', x: 'Cuando la luz pasa de un medio a otro (del aire al agua, por ejemplo) <b>cambia de velocidad</b> y su camino se <b>dobla</b>. A esto se le llama <b>refracción</b>. Por eso un lápiz en un vaso de agua parece quebrado.', m: 'Cambia el ángulo del rayo hasta 3 valores distintos (al menos 15° de diferencia) y mira cómo se dobla.', d: 'Los pescadores ven los peces en un lugar distinto al real: la refracción los engaña.' },
    { n: 'Índice de refracción', t: '2. Cada medio dobla distinto', x: 'Cada material tiene un <b>índice de refracción (n)</b>: mide cuánto frena la luz. Mientras mayor es n, más se dobla el rayo. Se calcula con la ley de Snell: <b>n₁ · sen θ₁ = n₂ · sen θ₂</b>.', m: 'Prueba el rayo en los 4 materiales: aire, agua, vidrio y diamante.', d: 'El diamante brilla tanto porque su índice (2,42) dobla y refleja muchísimo la luz.' },
    { n: 'Lentes', t: '3. Una lente que enfoca', x: 'Una <b>lente convergente</b> dobla los rayos paralelos para que se junten en un punto: el <b>foco</b>. Más curvada es la lente, más cerca queda el foco. Así funcionan las lupas, las cámaras y tus ojos.', m: 'Coloca la pantalla en el foco con 2 curvaturas distintas.', d: 'Las gafas para la miopía usan lentes divergentes y las de hipermetropía, convergentes.' }
  ],
  enter: function (L, n) { var S = L.S; S.ang = 40; S.m = 1; S.angs = [40]; S.med = {}; S.curv = 5; S.pant = 300; S.enfocados = {}; S.msj3 = ''; },
  ctl: function (L) {
    var S = L.S;
    if (L.paso === 0) L.rango('🔦 Ángulo del rayo (°)', 10, 80, 1, S.ang, function (v) { S.ang = v; if (S.angs.every(function (a) { return Math.abs(a - v) >= 15; })) { S.angs.push(v); if (S.angs.length >= 3) L.cumplir(0); } });
    if (L.paso === 1) { MEDIOS.forEach(function (m, i) { L.btn(m[0] + ' (n=' + m[1] + ')', function () { S.m = i; S.med[i] = 1; if (Object.keys(S.med).length >= 4) L.cumplir(1); L.ctl(); }, 'tab', S.m === i); }); L.rango('🔦 Ángulo del rayo (°)', 10, 80, 1, S.ang, function (v) { S.ang = v; }); }
    if (L.paso === 2) { L.rango('🔍 Curvatura de la lente', 2, 10, 1, S.curv, function (v) { S.curv = v; S.msj3 = ''; }); L.rango('🖥️ Posición de la pantalla', 120, 460, 2, S.pant, function (v) { S.pant = v; chequear(L); }); }
  },
  draw: function (L, g) {
    var S = L.S, W = L.W, H = L.H, bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0a1a2e'); bg.addColorStop(1, '#050b14'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    if (L.paso < 2) {
      var n2 = MEDIOS[L.paso === 0 ? 1 : S.m][1], col = MEDIOS[L.paso === 0 ? 1 : S.m][2], cx = 480, cy = 250; g.fillStyle = 'rgba(100,150,255,.12)'; g.fillRect(0, 0, W, cy); g.fillStyle = col; g.globalAlpha = 0.32; g.fillRect(0, cy, W, H - cy); g.globalAlpha = 1; g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, cy); g.lineTo(W, cy); g.stroke();
      var t1 = S.ang * Math.PI / 180, s2 = Math.sin(t1) / n2, t2 = Math.asin(Math.min(1, s2)), len = 230;
      g.setLineDash([6, 6]); g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 2; g.beginPath(); g.moveTo(cx, cy - 200); g.lineTo(cx, cy + 200); g.stroke(); g.setLineDash([]);
      g.save(); g.strokeStyle = '#ffe08a'; g.lineWidth = 5; g.shadowColor = '#ffd95e'; g.shadowBlur = 16; g.beginPath(); g.moveTo(cx - Math.sin(t1) * len, cy - Math.cos(t1) * len); g.lineTo(cx, cy); g.lineTo(cx + Math.sin(t2) * len, cy + Math.cos(t2) * len); g.stroke(); g.restore();
      g.strokeStyle = '#ff9f9f'; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, 70, -Math.PI / 2 - t1, -Math.PI / 2); g.stroke(); g.strokeStyle = '#8be8ae'; g.beginPath(); g.arc(cx, cy, 90, Math.PI / 2 - t2, Math.PI / 2); g.stroke();
      L.txt('θ₁ = ' + S.ang + '°  (aire, n = 1,00)', 160, 60, '#ff9f9f', 'center', 20); L.txt('θ₂ = ' + (t2 * 180 / Math.PI).toFixed(1) + '°  (n = ' + n2 + ')', 700, 420, '#8be8ae', 'center', 20);
      L.txt(L.paso === 0 ? 'El rayo se acerca a la normal al entrar al agua' : 'Mayor n → el rayo se dobla más', W / 2, 36, '#cfe6ff', 'center', 18);
      g.font = '40px system-ui'; g.fillStyle = '#000'; g.textAlign = 'center'; g.fillText('🔦', cx - Math.sin(t1) * len - 10, cy - Math.cos(t1) * len - 10);
      return;
    }
    var lx = 300, ly = 230, f = 560 / (S.curv + 1) * 1.0; f = Math.max(80, Math.min(460, f)); var fx = lx + f;
    g.fillStyle = 'rgba(127,240,228,.35)'; g.strokeStyle = '#7ff0e4'; g.lineWidth = 3; g.beginPath(); g.ellipse(lx, ly, 14 + S.curv * 1.6, 120, 0, 0, 7); g.fill(); g.stroke();
    [-90, -60, -30, 0, 30, 60, 90].forEach(function (y) { g.save(); g.strokeStyle = '#ffe08a'; g.lineWidth = 3; g.shadowColor = '#ffd95e'; g.shadowBlur = 10; g.beginPath(); g.moveTo(20, ly + y); g.lineTo(lx, ly + y); var tx = lx + (S.pant - lx), k = (fx - lx), py = ly + y * (1 - (S.pant - lx) / k); g.lineTo(Math.max(S.pant, lx + 1), Math.abs(py - ly) < 400 ? py : ly); if (S.pant < fx + 100) { g.lineTo(Math.min(W - 20, fx + 160), ly + y * (1 - (Math.min(W - 20, fx + 160) - lx) / k)); } g.stroke(); g.restore(); });
    g.fillStyle = '#ffb347'; g.fillRect(fx - 3, ly - 150, 6, 20); L.txt('foco', fx, ly - 156, '#ffb347', 'center', 14);
    var nitidez = Math.max(0, 1 - Math.abs(S.pant - fx) / 80), alto = 140 * (1 - nitidez) + 6; g.fillStyle = '#e6ecf5'; g.fillRect(S.pant - 5, ly - 150, 10, 300); g.fillStyle = 'rgba(255,230,120,' + (0.35 + 0.65 * nitidez) + ')'; g.beginPath(); g.ellipse(S.pant, ly, 5 + nitidez * 6, alto, 0, 0, 7); g.fill(); g.shadowBlur = 0;
    L.txt(nitidez > 0.9 ? '🔍 ¡Enfocado!' : 'Mueve la pantalla hasta el foco', W / 2, 38, nitidez > 0.9 ? '#8be8ae' : '#cfe6ff', 'center', 22); L.txt('Distancia focal: ' + Math.round(f) + ' · enfocados ' + Object.keys(S.enfocados).length + ' de 2', W / 2, 428, '#9db8ff', 'center', 16);
  },
  hooks: function (L) { return { ang: function (v) { L.S.ang = v; if (L.S.angs.every(function (a) { return Math.abs(a - v) >= 15; })) { L.S.angs.push(v); if (L.S.angs.length >= 3) L.cumplir(0); } }, medio: function (i) { L.S.m = i; L.S.med[i] = 1; if (Object.keys(L.S.med).length >= 4) L.cumplir(1); }, curv: function (v) { L.S.curv = v; }, enfocar: function () { var S = L.S; var f = Math.max(80, Math.min(460, 560 / (S.curv + 1))); S.pant = Math.round(300 + f); chequear(L); } }; }
});
function chequear(L) { var S = L.S, f = Math.max(80, Math.min(460, 560 / (S.curv + 1))), fx = 300 + f; if (Math.abs(S.pant - fx) <= 8) { S.enfocados[S.curv] = 1; L.tono(780, 0.12, 0.2); if (Object.keys(S.enfocados).length >= 2) L.cumplir(2); } }
