/* Robótica y sensores (6°, solo español, sin voz): sensor ultrasónico, lógica «si… entonces» y programación por bloques en una cuadrícula. */
var NIV = [
  { walls: [], start: [0, 5, 0], goal: [5, 0], max: 14 },
  { walls: [[1, 5], [1, 4], [1, 3], [3, 0], [3, 1], [3, 2], [3, 3]], start: [0, 5, 0], goal: [5, 0], max: 22 }
];
var DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // 0 arriba (N), 1 derecha, 2 abajo, 3 izquierda
function bfs(nv) { var s = nv.start, key = function (x, y, d) { return x + ',' + y + ',' + d; }, seen = {}, q = [[s[0], s[1], s[2], []]]; seen[key(s[0], s[1], s[2])] = 1; while (q.length) { var c = q.shift(); if (c[0] === nv.goal[0] && c[1] === nv.goal[1]) return c[3]; [['F'], ['L'], ['R']].forEach(function (m) { var x = c[0], y = c[1], d = c[2]; if (m[0] === 'F') { x += DIRS[d][0]; y += DIRS[d][1]; if (x < 0 || y < 0 || x > 5 || y > 5 || nv.walls.some(function (w) { return w[0] === x && w[1] === y; })) return; } else d = (d + (m[0] === 'R' ? 1 : 3)) % 4; var k = key(x, y, d); if (!seen[k]) { seen[k] = 1; q.push([x, y, d, c[3].concat(m)]); } }); } return null; }
var LAB = LabKit({
  reto: true, hook: '__rob',
  pasos: [
    { n: 'Sensor ultrasónico', t: '1. Medir con sonido', x: 'Un robot «ve» con sensores. El <b>sensor ultrasónico</b> emite un sonido que no oímos, espera el <b>eco</b> y calcula la distancia: <b>d = v · t / 2</b> (el sonido va y vuelve, por eso se divide entre 2). La velocidad del sonido es 343 m/s.', m: 'Mueve el obstáculo a 3 distancias distintas y mira el tiempo del eco.', d: 'Los murciélagos y los delfines usan el mismo principio: se llama ecolocalización.' },
    { n: 'Si… entonces', t: '2. Decisiones del robot', x: 'Los robots toman decisiones con reglas <b>«si… entonces…»</b>. Por ejemplo: <b>si</b> el sensor detecta un obstáculo cerca, <b>entonces</b> el robot frena. Elige la regla correcta para cada situación.', m: 'Acierta 4 de 5 situaciones.', d: 'Un aspirador robot usa decenas de reglas así para no chocar ni caerse por las escaleras.' },
    { n: 'Programa el robot', t: '3. Sigue la secuencia', x: 'Un <b>programa</b> es una lista de instrucciones en orden. Arma la secuencia de bloques para llevar al robot 🤖 hasta la meta 🏁 sin chocar con las paredes.', m: 'Lleva el robot a la meta en los 2 niveles.', d: 'Primero se piensa el camino y luego se escribe el programa: ¡eso es pensamiento computacional!' }
  ],
  enter: function (L, n) { var S = L.S; S.dist = 1.2; S.vis = []; S.lv = 0; S.prog = []; S.run = null; S.res = ''; if (n === 1) preg(L); if (n === 2) { S.lv = 0; S.prog = []; reset(L); } },
  reintentar: function (L) { preg(L); },
  ctl: function (L) {
    var S = L.S;
    if (L.paso === 0) L.rango('📏 Distancia al obstáculo (m)', 0.2, 3, 0.1, S.dist, function (v) { S.dist = v; if (S.vis.every(function (x) { return Math.abs(x - v) >= 0.5; })) { S.vis.push(v); if (S.vis.length >= 3) L.cumplir(0); } });
    if (L.paso === 1) L.quizBtns(S.ops || ['A', 'B', 'C']);
    if (L.paso === 2) { L.btn('⬆️ Avanzar', function () { add(L, 'F'); }, 'btn'); L.btn('↺ Girar izq.', function () { add(L, 'L'); }, 'btn'); L.btn('↻ Girar der.', function () { add(L, 'R'); }, 'btn'); L.btn('⌫ Borrar último', function () { S.prog.pop(); }, 'btn sec'); L.btn('🗑 Vaciar', function () { S.prog = []; reset(L); }, 'btn sec'); L.btn('▶ Ejecutar', function () { ejecutar(L); }, 'btn grande'); }
  },
  sim: function (L, dt) { var S = L.S; if (S.run) { S.run.t += dt; if (S.run.t >= 0.45) { S.run.t = 0; paso(L); } } },
  draw: function (L, g) {
    var S = L.S, W = L.W, H = L.H, bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0a1a2e'); bg.addColorStop(1, '#050b14'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    if (L.paso === 1) { L.dibQuiz(null, '#cfe6ff'); return; }
    if (L.paso === 0) { var rx = 150, ry = 240, ox = rx + 60 + S.dist * 230; g.font = '70px system-ui'; L.emoji('🤖', rx, ry, 80); L.emoji('🧱', ox, ry, 70); var t = 2 * S.dist / 343 * 1000; for (var k = 0; k < 4; k++) { var ph = ((L.t * 0.8 + k * 0.25) % 1), x = rx + 50 + ph * (ox - rx - 100); g.strokeStyle = 'rgba(127,240,228,' + (0.7 - ph * 0.5) + ')'; g.lineWidth = 3; g.beginPath(); g.arc(x, ry, 14 + ph * 20, -0.8, 0.8); g.stroke(); } g.strokeStyle = '#ffe08a'; g.lineWidth = 2; g.beginPath(); g.moveTo(rx + 50, ry + 70); g.lineTo(ox - 40, ry + 70); g.stroke(); L.txt('d = ' + S.dist.toFixed(1) + ' m', (rx + ox) / 2, ry + 100, '#ffe08a', 'center', 24); g.fillStyle = 'rgba(5,11,20,.8)'; g.fillRect(500, 50, 380, 100); L.mono('Eco: ' + t.toFixed(1) + ' milisegundos', 520, 86, '#7ff0e4', 'left', 18); L.mono('d = 343 × ' + (t / 1000).toFixed(4) + ' / 2', 520, 116, '#cfe6ff', 'left', 16); L.mono('d = ' + S.dist.toFixed(2) + ' m', 520, 140, '#8be8ae', 'left', 16); L.txt('Distancias probadas: ' + S.vis.length + ' de 3', 480, 430, '#9db8ff', 'center', 16); return; }
    var nv = NIV[S.lv], cs = 64, gx = 60, gy = 40; for (var i = 0; i < 6; i++) for (var j = 0; j < 6; j++) { g.fillStyle = (i + j) % 2 ? 'rgba(127,240,228,.06)' : 'rgba(127,240,228,.12)'; g.fillRect(gx + i * cs, gy + j * cs, cs - 2, cs - 2); } nv.walls.forEach(function (w) { g.fillStyle = '#8a5a3a'; g.fillRect(gx + w[0] * cs, gy + w[1] * cs, cs - 2, cs - 2); L.emoji('🧱', gx + w[0] * cs + cs / 2, gy + w[1] * cs + cs / 2, 38); }); L.emoji('🏁', gx + nv.goal[0] * cs + cs / 2, gy + nv.goal[1] * cs + cs / 2, 44);
    var r = S.robot || { x: nv.start[0], y: nv.start[1], d: nv.start[2] }; g.save(); g.translate(gx + r.x * cs + cs / 2, gy + r.y * cs + cs / 2); g.rotate(r.d * Math.PI / 2); g.fillStyle = S.choque ? '#ff6b6b' : '#7ff0e4'; g.beginPath(); g.moveTo(0, -24); g.lineTo(18, 18); g.lineTo(-18, 18); g.closePath(); g.fill(); g.restore();
    // programa
    g.fillStyle = 'rgba(5,11,20,.8)'; g.fillRect(470, 40, 430, 330); L.txt('Programa (' + S.prog.length + ' / ' + nv.max + ' bloques)', 685, 68, '#ffe08a', 'center', 18); S.prog.forEach(function (b, i) { var x = 490 + (i % 8) * 50, y = 90 + Math.floor(i / 8) * 54; g.fillStyle = S.run && S.run.i === i ? '#ffe08a' : ({ F: '#7ff0e4', L: '#c9a8ff', R: '#ffb347' })[b]; g.fillRect(x, y, 44, 44); g.fillStyle = '#0a1a2e'; g.font = '700 24px system-ui'; g.textAlign = 'center'; g.fillText(({ F: '⬆', L: '↺', R: '↻' })[b], x + 22, y + 30); });
    L.txt('Nivel ' + (S.lv + 1) + ' de 2 · ' + (S.res || 'Arma el programa y pulsa Ejecutar'), 480, 440, S.res.indexOf('✔') > -1 ? '#8be8ae' : S.res ? '#ff9f9f' : '#9db8ff', 'center', 17);
  },
  hooks: function (L) { return { dist: function (v) { L.S.dist = v; if (L.S.vis.every(function (x) { return Math.abs(x - v) >= 0.5; })) { L.S.vis.push(v); if (L.S.vis.length >= 3) L.cumplir(0); } }, correcta: function () { return L.q && !L.q.fin ? L.q.items[L.q.i].a : -1; }, resp: function (k) { L.quizResp(k); }, resolver: function () { var s = bfs(NIV[L.S.lv]); L.S.prog = s; reset(L); }, ejecutar: function () { ejecutar(L); }, nivel: function () { return L.S.lv; } }; }
});
function add(L, b) { var S = L.S; if (S.run) return; if (S.prog.length >= NIV[S.lv].max) { S.res = 'Máximo de bloques'; return; } S.prog.push(b); L.tono(500, 0.08, 0.1); reset(L); }
function reset(L) { var S = L.S, nv = NIV[S.lv]; S.robot = { x: nv.start[0], y: nv.start[1], d: nv.start[2] }; S.run = null; S.choque = false; S.res = ''; }
function ejecutar(L) { var S = L.S; reset(L); if (!S.prog.length) return; S.run = { i: -1, t: 0.4 }; }
function paso(L) { var S = L.S, nv = NIV[S.lv], r = S.robot; S.run.i++; if (S.run.i >= S.prog.length) { S.run = null; if (r.x === nv.goal[0] && r.y === nv.goal[1]) { S.res = '✔ ¡Llegó a la meta!'; L.tono(780, 0.15, 0.3); if (S.lv === 0) setTimeout(function () { S.lv = 1; S.prog = []; reset(L); }, 1400); else L.cumplir(2); } else { S.res = '✖ No llegó a la meta'; L.mal(); } return; } var b = S.prog[S.run.i]; if (b === 'F') { var x = r.x + DIRS[r.d][0], y = r.y + DIRS[r.d][1]; if (x < 0 || y < 0 || x > 5 || y > 5 || nv.walls.some(function (w) { return w[0] === x && w[1] === y; })) { S.choque = true; S.run = null; S.res = '✖ ¡Chocó con una pared!'; L.mal(); return; } r.x = x; r.y = y; } else r.d = (r.d + (b === 'R' ? 1 : 3)) % 4; L.tono(420, 0.06, 0.08); }
function preg(L) {
  var it = [
    ['🚧 Hay un obstáculo muy cerca adelante. ¿Qué debe hacer el robot?', ['A) Frenar o girar', 'B) Acelerar', 'C) Apagarse'], 0, 'Debe frenar o girar para no chocar'],
    ['💡 Hay poca luz en la habitación. ¿Qué regla enciende la lámpara automática?', ['A) Si hay mucha luz, enciende', 'B) Si hay poca luz, enciende', 'C) Si hay ruido, apaga'], 1, 'Si la luz es poca, entonces enciende'],
    ['🪜 El sensor detecta un borde (escalera). ¿Qué hace un aspirador robot?', ['A) Sigue de frente', 'B) Acelera', 'C) Retrocede y cambia de dirección'], 2, 'Retrocede y cambia de dirección'],
    ['🌡️ ¿Qué regla enciende el ventilador cuando hace calor?', ['A) Si temperatura < 10, enciende', 'B) Si temperatura > 30, enciende', 'C) Si temperatura = 0, enciende'], 1, 'Si temperatura > 30 entonces ventilador'],
    ['🔋 La batería está casi vacía. ¿Qué debería hacer el robot?', ['A) Seguir trabajando', 'B) Girar en círculos', 'C) Volver a su base a cargarse'], 2, 'Volver a su base a cargarse'],
    ['🛣️ No hay nada cerca. ¿Qué hace el robot?', ['A) Retrocede', 'B) Sigue avanzando', 'C) Se apaga'], 1, 'Sigue avanzando']
  ];
  L.nuevoQuiz(it.map(function (x) { return { q: x[0] + '   ' + x[1].join('   '), e: '', a: x[2], fb: x[3] }; }), 5, 4); L.S.ops = ['A', 'B', 'C']; L.ctl(); }
