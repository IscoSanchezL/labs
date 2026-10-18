/* Ácidos y bases (4°, solo español, sin voz): escala de pH, clasificación y neutralización. */
var SUST = [['🍋', 'Limón', 2.2], ['🥛', 'Leche', 6.7], ['💧', 'Agua', 7], ['🧼', 'Jabón', 9.5], ['🍅', 'Tomate', 4.3], ['🧴', 'Cloro', 12.5], ['☕', 'Café', 5], ['🧪', 'Vinagre', 2.9], ['🥚', 'Clara de huevo', 8]];
function colPH(v) { var s = [[0, '#ff2a2a'], [2, '#ff6a2a'], [4, '#ffb02a'], [6, '#f2e84a'], [7, '#4fd16a'], [8, '#2fb8c4'], [10, '#3a6bff'], [12, '#7a3aff'], [14, '#5a1a9a']], i = 0; while (i < s.length - 2 && v > s[i + 1][0]) i++; var a = s[i], b = s[i + 1], t = Math.max(0, Math.min(1, (v - a[0]) / (b[0] - a[0]))); function h(x) { return [parseInt(x.substr(1, 2), 16), parseInt(x.substr(3, 2), 16), parseInt(x.substr(5, 2), 16)]; } var A = h(a[1]), B = h(b[1]); return 'rgb(' + A.map(function (c, k) { return Math.round(c + (B[k] - c) * t); }).join(',') + ')'; }
function tipo(v) { return v < 6.5 ? 0 : v > 7.5 ? 2 : 1; }
LabKit({
  reto: true, hook: '__ph',
  pasos: [
    { n: 'Mide el pH', t: '1. La escala del pH', x: 'El <b>pH</b> dice qué tan <b>ácida</b> o <b>básica</b> es una sustancia, de 0 a 14. Menos de 7 es <b>ácida</b>, 7 es <b>neutra</b> (el agua pura) y más de 7 es <b>básica</b>. El jugo de repollo morado cambia de color según el pH.', m: 'Mide el pH de 6 sustancias distintas.', d: 'El jugo de repollo morado es un indicador natural: rojo en ácidos, verde-azul en bases.' },
    { n: 'Ácido, neutro o base', t: '2. Clasifica las sustancias', x: 'Los <b>ácidos</b> (limón, vinagre) tienen sabor agrio. Las <b>bases</b> (jabón, cloro) son resbalosas y amargas. Nunca pruebes ni mezcles productos de limpieza.', m: 'Clasifica 6 sustancias: acierta al menos 5.', d: 'Tu estómago tiene ácido para digerir la comida: ¡un pH de 1,5 a 3,5!' },
    { n: 'Neutraliza', t: '3. Neutralizar un ácido', x: 'Cuando mezclas un <b>ácido</b> con una <b>base</b> pueden neutralizarse y acercarse a pH 7. Por eso un antiácido calma la acidez del estómago.', m: 'Con el limón (ácido), agrega base hasta dejar el pH entre 6,8 y 7,2.', d: 'Pista: ¡cerca de la neutralidad el pH cambia muy rápido, ve despacio! Los agricultores echan cal al suelo ácido para neutralizarlo y que crezcan mejor las plantas.' }
  ],
  enter: function (L, n) { var S = L.S; S.sel = null; S.medidos = {}; S.base = 0; if (n === 1) L.nuevoQuiz(SUST.map(function (s) { return { q: s[1] + ': ¿ácido, neutro o base?', e: s[0], a: tipo(s[2]), fb: s[1] + ' tiene pH ' + s[2] }; }), 6, 5); },
  reintentar: function (L) { L.nuevoQuiz(SUST.map(function (s) { return { q: s[1] + ': ¿ácido, neutro o base?', e: s[0], a: tipo(s[2]), fb: s[1] + ' tiene pH ' + s[2] }; }), 6, 5); },
  ctl: function (L) {
    var S = L.S;
    if (L.paso === 0) SUST.forEach(function (s, i) { L.op(s[0], s[1], function () { S.sel = i; S.medidos[i] = 1; L.tono(400 + i * 40, 0.1, 0.15); if (Object.keys(S.medidos).length >= 6) L.cumplir(0); }); });
    if (L.paso === 1) L.quizBtns(['🍋 Ácido', '💧 Neutro', '🧼 Base']);
    if (L.paso === 2) L.rango('🧼 Base agregada (gotas)', 0, 40, 1, S.base, function (v) { S.base = v; var ph = phMezcla(S.base); if (ph >= 6.8 && ph <= 7.2) L.cumplir(2); });
  },
  draw: function (L, g) {
    var S = L.S, W = L.W, H = L.H, bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0a1a2e'); bg.addColorStop(1, '#050b14'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    // escala pH
    var sx = 90, sw = 780, sy = 60; for (var i = 0; i < 14; i++) { g.fillStyle = colPH(i + 0.5); g.fillRect(sx + i * sw / 14, sy, sw / 14, 26); L.txt(String(i), sx + (i + 0.5) * sw / 14, sy + 46, '#cfe6ff', 'center', 14); }
    L.txt('ÁCIDO', sx + 90, sy - 12, '#ff9f9f', 'center', 14); L.txt('NEUTRO', sx + sw / 2, sy - 12, '#8be8ae', 'center', 14); L.txt('BASE', sx + sw - 90, sy - 12, '#9db8ff', 'center', 14);
    var v = null, nombre = '', em = '';
    if (L.paso === 0 && S.sel !== null) { v = SUST[S.sel][2]; nombre = SUST[S.sel][1]; em = SUST[S.sel][0]; }
    if (L.paso === 2) { v = phMezcla(S.base); nombre = 'Limón + ' + S.base + ' gotas de base'; em = '🍋'; }
    if (L.paso === 1) { L.dibQuiz(null, '#cfe6ff'); return; }
    if (v !== null) { var mx = sx + v / 14 * sw; g.fillStyle = '#fff'; g.beginPath(); g.moveTo(mx, sy + 30); g.lineTo(mx - 9, sy + 52); g.lineTo(mx + 9, sy + 52); g.fill(); }
    // vaso
    var vx = 480, vy = 290, col = v === null ? '#6a3a9a' : colPH(v); g.fillStyle = 'rgba(255,255,255,.1)'; g.beginPath(); g.moveTo(vx - 90, vy - 130); g.lineTo(vx - 70, vy + 70); g.lineTo(vx + 70, vy + 70); g.lineTo(vx + 90, vy - 130); g.closePath(); g.fill();
    g.fillStyle = col; g.shadowColor = col; g.shadowBlur = 24; g.beginPath(); g.moveTo(vx - 84, vy - 60); g.lineTo(vx - 68, vy + 66); g.lineTo(vx + 68, vy + 66); g.lineTo(vx + 84, vy - 60); g.closePath(); g.fill(); g.shadowBlur = 0; g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 4; g.beginPath(); g.moveTo(vx - 90, vy - 130); g.lineTo(vx - 70, vy + 70); g.lineTo(vx + 70, vy + 70); g.lineTo(vx + 90, vy - 130); g.stroke();
    if (v !== null) { L.emoji(em, vx, vy - 170 + Math.sin(L.t * 3) * 4, 54); L.txt(nombre, vx, vy + 112, '#fff', 'center', 22); L.txt('pH ' + v.toFixed(1) + ' · ' + ['ÁCIDO', 'NEUTRO', 'BASE'][tipo(v)], vx, vy + 142, colPH(v), 'center', 26); } else L.txt('Elige una sustancia para medir su pH', vx, vy + 112, '#9db8ff', 'center', 20);
    if (L.paso === 0) L.txt('Medidas: ' + Math.min(6, Object.keys(S.medidos).length) + ' de 6', 150, 430, '#9db8ff', 'center', 16);
  },
  hooks: function (L) { return { medir: function (i) { L.S.sel = i; L.S.medidos[i] = 1; if (Object.keys(L.S.medidos).length >= 6) L.cumplir(0); }, base: function (v) { L.S.base = v; var ph = phMezcla(v); if (ph >= 6.8 && ph <= 7.2) L.cumplir(2); }, correcta: function () { return L.q && !L.q.fin ? L.q.items[L.q.i].a : -1; }, resp: function (k) { L.quizResp(k); }, ph: function (v) { return phMezcla(v); } }; }
});
function phMezcla(b) { return Math.min(13, b <= 36 ? 2.2 + b * 0.12 : 6.52 + 0.5 * (b - 36)); }
