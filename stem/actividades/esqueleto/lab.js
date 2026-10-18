/* Huesos y músculos (3°, solo español, sin voz): huesos del esqueleto, par bíceps-tríceps y función de los huesos. */
var HUESOS = [
  { k: 'Cráneo', x: 270, y: 70, t: 'Protege el cerebro.' }, { k: 'Columna vertebral', x: 270, y: 190, t: 'Sostiene el cuerpo y protege la médula.' }, { k: 'Costillas', x: 270, y: 150, t: 'Forman una jaula que protege corazón y pulmones.' },
  { k: 'Húmero', x: 205, y: 160, t: 'Hueso del brazo.' }, { k: 'Pelvis', x: 270, y: 245, t: 'Sostiene la columna y une las piernas.' }, { k: 'Fémur', x: 245, y: 305, t: 'El hueso más largo y fuerte del cuerpo.' }, { k: 'Tibia', x: 245, y: 385, t: 'Hueso de la pierna, debajo de la rodilla.' }
];
var LAB = LabKit({
  hook: '__esq',
  pasos: [
    { n: 'Los huesos', t: '1. El esqueleto', x: 'Tu cuerpo tiene <b>206 huesos</b> de adulto. Dan forma al cuerpo, lo <b>sostienen</b> y <b>protegen</b> los órganos. Toca los huesos del esqueleto para conocerlos.', m: 'Toca 5 huesos distintos.', d: 'Los bebés nacen con unos 300 huesos; con el tiempo algunos se unen.' },
    { n: 'Los músculos', t: '2. Músculos que trabajan en pareja', x: 'Los músculos <b>tiran</b> de los huesos, pero no pueden empujar. Por eso trabajan en <b>pareja</b>: el <b>bíceps</b> se contrae para doblar el brazo y el <b>tríceps</b> para estirarlo.', m: 'Dobla y estira el brazo 3 veces.', d: 'Tienes más de 600 músculos; el más fuerte para su tamaño es el de la mandíbula.' },
    { n: '¿Para qué sirve?', t: '3. Cada hueso tiene su trabajo', x: 'Cada hueso tiene una función: proteger, sostener o dar movimiento. Responde las preguntas.', m: 'Acierta 4 de 5 preguntas.', d: 'Los huesos se renuevan toda la vida y necesitan calcio para estar fuertes.' }
  ],
  enter: function (L, n) { var S = L.S; S.vis = {}; S.sel = null; S.ang = 20; S.dest = 20; S.cnt = 0; S.last = 'ext'; if (n === 2) preg(L); },
  reintentar: function (L) { preg(L); },
  ctl: function (L) {
    var S = L.S;
    if (L.paso === 1) { L.btn('💪 Doblar (bíceps)', function () { mover(L, 'flex'); }, 'btn'); L.btn('🖐️ Estirar (tríceps)', function () { mover(L, 'ext'); }, 'btn'); }
    if (L.paso === 2) L.quizBtns(S.ops || ['A', 'B', 'C']);
  },
  sim: function (L, dt) { var S = L.S; S.ang += (S.dest - S.ang) * Math.min(1, dt * 5); },
  draw: function (L, g) {
    var S = L.S, W = L.W, H = L.H, bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#13243b'); bg.addColorStop(1, '#070d18'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    if (L.paso === 2) { L.emoji('🦴', 880, 60, 50); L.dibQuiz(null, '#cfe6ff'); return; }
    if (L.paso === 0) {
      g.strokeStyle = '#f2ead3'; g.fillStyle = '#f2ead3'; g.lineWidth = 12; g.lineCap = 'round';
      g.beginPath(); g.arc(270, 72, 38, 0, 7); g.fill(); g.fillStyle = '#13243b'; g.fillRect(250, 78, 40, 10); g.fillStyle = '#f2ead3';
      g.beginPath(); g.moveTo(270, 115); g.lineTo(270, 235); g.stroke();
      g.lineWidth = 6; for (var i = 0; i < 4; i++) { g.beginPath(); g.ellipse(270, 140 + i * 18, 40 - i * 4, 14, 0, 0, 7); g.stroke(); }
      g.lineWidth = 12; g.beginPath(); g.moveTo(235, 125); g.lineTo(190, 195); g.lineTo(170, 270); g.moveTo(305, 125); g.lineTo(350, 195); g.lineTo(370, 270); g.stroke();
      g.beginPath(); g.moveTo(240, 240); g.lineTo(300, 240); g.stroke(); g.beginPath(); g.moveTo(250, 245); g.lineTo(240, 320); g.lineTo(235, 410); g.moveTo(290, 245); g.lineTo(300, 320); g.lineTo(305, 410); g.stroke();
      HUESOS.forEach(function (h) { var on = S.sel === h.k, ok = S.vis[h.k]; g.fillStyle = on ? '#ffe08a' : ok ? '#8be8ae' : 'rgba(127,240,228,.9)'; g.beginPath(); g.arc(h.x, h.y, on ? 13 : 9 + Math.sin(L.t * 3) * (ok ? 0 : 2), 0, 7); g.fill(); });
      g.fillStyle = 'rgba(5,11,20,.85)'; g.fillRect(520, 100, 380, 230); L.txt(S.sel || 'Toca un punto 🔵', 710, 150, '#ffe08a', 'center', 26); if (S.sel) L.wrap(HUESOS.filter(function (h) { return h.k === S.sel; })[0].t, 710, 200, 330, 22, '#cfe6ff'); L.txt('Huesos vistos: ' + Object.keys(S.vis).length + ' / 5', 710, 400, '#8be8ae', 'center', 17);
    }
    if (L.paso === 1) {
      var a = S.ang * Math.PI / 180, sx = 330, sy = 180, ex = sx + 140, ey = sy + 40, fx = ex + Math.cos(-a * 0.9 + 0.2) * 150, fy = ey + Math.sin(-a * 0.9 + 0.2) * 150, flex = (S.dest > 90);
      g.lineCap = 'round'; g.strokeStyle = '#f2ead3'; g.lineWidth = 16; g.beginPath(); g.moveTo(sx, sy); g.lineTo(ex, ey); g.lineTo(fx, fy); g.stroke(); L.emoji('✋', fx, fy, 34);
      var bw = flex ? 26 : 10, tw = flex ? 10 : 26; g.strokeStyle = flex ? '#ff6b6b' : '#7a3d3d'; g.lineWidth = bw; g.beginPath(); g.moveTo(sx + 12, sy - 14); g.lineTo(ex - 10, ey - 24); g.stroke(); L.txt('Bíceps' + (flex ? ' (contraído)' : ''), (sx + ex) / 2, sy - 40, '#ff9f9f', 'center', 17);
      g.strokeStyle = !flex ? '#ff6b6b' : '#7a3d3d'; g.lineWidth = tw; g.beginPath(); g.moveTo(sx + 12, sy + 20); g.lineTo(ex + 6, ey + 18); g.stroke(); L.txt('Tríceps' + (!flex ? ' (contraído)' : ''), (sx + ex) / 2, sy + 80, '#ff9f9f', 'center', 17);
      L.txt('Repeticiones: ' + S.cnt + ' / 3', 480, 440, '#8be8ae', 'center', 18);
    }
  },
  hooks: function (L) { return { hueso: function (k) { tocar(L, k); }, mover: function (m) { mover(L, m); }, correcta: function () { return L.q && !L.q.fin ? L.q.items[L.q.i].a : -1; }, resp: function (k) { L.quizResp(k); } }; }
});
document.getElementById('cv').addEventListener('click', function (e) {
  var L = LAB; if (L.paso !== 0) return; var p = L.xy(e), b = null, bd = 30;
  HUESOS.forEach(function (h) { var d = Math.hypot(h.x - p[0], h.y - p[1]); if (d < bd) { bd = d; b = h.k; } }); if (b) tocar(L, b);
});
function tocar(L, k) { var S = L.S; S.sel = k; S.vis[k] = 1; L.tono(400 + Object.keys(S.vis).length * 80, 0.1, 0.12); if (Object.keys(S.vis).length >= 5) L.cumplir(0); }
function mover(L, m) { var S = L.S; S.dest = m === 'flex' ? 140 : 20; L.tono(m === 'flex' ? 500 : 380, 0.12, 0.12); if (m === 'ext' && S.last === 'flex') { S.cnt++; if (S.cnt >= 3) L.cumplir(1); } S.last = m; }
function preg(L) {
  var it = [
    ['🧠 ¿Qué hueso protege el cerebro?', ['A) El cráneo', 'B) El fémur', 'C) La pelvis'], 0, 'El cráneo'],
    ['❤️ ¿Qué protegen las costillas?', ['A) El estómago', 'B) El corazón y los pulmones', 'C) El cerebro'], 1, 'Corazón y pulmones'],
    ['💪 ¿Qué músculo dobla el brazo?', ['A) El tríceps', 'B) El bíceps', 'C) El cráneo'], 1, 'El bíceps'],
    ['🦵 ¿Cuál es el hueso más largo del cuerpo?', ['A) El fémur', 'B) El húmero', 'C) La costilla'], 0, 'El fémur'],
    ['🦴 ¿Qué mineral fortalece los huesos?', ['A) Hierro', 'B) Calcio', 'C) Sal'], 1, 'El calcio (leche, queso...)'],
    ['🔗 Los músculos mueven los huesos al…', ['A) Empujar', 'B) Tirar (contraerse)', 'C) Congelarse'], 1, 'Se contraen y tiran']
  ];
  L.nuevoQuiz(it.map(function (x) { return { q: x[0] + '   ' + x[1].join('   '), e: '', a: x[2], fb: x[3] }; }), 5, 4); L.S.ops = ['A', 'B', 'C']; L.ctl(); }
