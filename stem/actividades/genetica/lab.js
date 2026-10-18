/* Herencia genética (5°, solo español, sin voz): cuadro de Punnett con la flor de arveja de Mendel. */
var GEN = ['PP', 'Pp', 'pp'];
function fenotipo(g) { return g.indexOf('P') >= 0 ? 0 : 1; } // 0 = morada (dominante), 1 = blanca
function punnett(a, b) { var r = []; for (var i = 0; i < 2; i++) for (var j = 0; j < 2; j++) { var x = [a[i], b[j]].sort().join(''); r.push(x === 'pP' ? 'Pp' : x); } return r; }
function pctMorada(a, b) { var c = punnett(a, b); return c.filter(function (x) { return fenotipo(x) === 0; }).length * 25; }
var LAB = LabKit({
  hook: '__gen',
  pasos: [
    { n: 'Alelos', t: '1. Dos copias de cada gen', x: 'Cada ser vivo hereda <b>dos copias</b> de cada gen, una de cada padre. Las versiones del gen se llaman <b>alelos</b>. El alelo <b>dominante</b> (P, flor morada) se nota aunque haya uno solo; el <b>recesivo</b> (p, flor blanca) solo se nota si hay dos.', m: 'Haz 3 cruces distintos y mira el cuadro de Punnett.', d: 'Gregor Mendel descubrió estas reglas hace más de 150 años cruzando miles de plantas de arveja.' },
    { n: 'Predice', t: '2. ¿Qué porcentaje saldrá morado?', x: 'El <b>cuadro de Punnett</b> reparte los alelos de los padres en 4 casillas posibles. Contando las casillas con al menos una P sabes qué porcentaje de hijos tendrá flor morada.', m: 'Predice bien 4 de 5 cruces.', d: 'Pp × Pp da 75 % moradas y 25 % blancas: ¡la proporción 3:1 de Mendel!' },
    { n: 'Siembra y comprueba', t: '3. Lo que sale en el jardín', x: 'La herencia es cuestión de <b>probabilidad</b>. Siembra 20 semillas de un cruce y compara con lo que predijo el cuadro de Punnett. ¡Dos plantas moradas pueden tener hijas blancas!', m: 'Cruza dos plantas moradas Pp × Pp y consigue al menos una flor blanca.', d: 'Cuantas más semillas siembres, más se acercan los resultados a lo que predice la teoría.' }
  ],
  enter: function (L, n) { var S = L.S; S.a = 1; S.b = 1; S.vistos = {}; S.sem = null; if (n === 1) preg(L); },
  reintentar: function (L) { preg(L); },
  ctl: function (L) {
    var S = L.S;
    if (L.paso !== 1) { GEN.forEach(function (x, i) { L.btn('Planta A: ' + x, function () { S.a = i; marcar(L); L.ctl(); }, 'tab', S.a === i); }); GEN.forEach(function (x, i) { L.btn('Planta B: ' + x, function () { S.b = i; marcar(L); L.ctl(); }, 'tab', S.b === i); }); }
    if (L.paso === 2) L.btn('🌱 Sembrar 20 semillas', function () { sembrar(L); }, 'btn grande');
    if (L.paso === 1) L.quizBtns(['0 %', '25 %', '50 %', '75 %', '100 %']);
  },
  draw: function (L, g) {
    var S = L.S, W = L.W, H = L.H, bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#102a2a'); bg.addColorStop(1, '#07120f'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    var A = GEN[S.a], B = GEN[S.b];
    if (L.paso === 1) { var q = L.q; if (q && !q.fin) { var it = q.items[q.i]; A = it.A; B = it.B; } else { L.dibQuiz(null, '#cfe6ff'); return; } L.txt('¿Qué porcentaje de hijos tendrá flor morada?', W / 2, 40, '#cfe6ff', 'center', 22); }
    function flor(x, y, f, s) { L.emoji(fenotipo(f) === 0 ? '🪻' : '🌼', x, y, s); }
    flor(150, 70, A, 56); L.txt('Planta A · ' + A, 150, 124, '#fff', 'center', 20); flor(810, 70, B, 56); L.txt('Planta B · ' + B, 810, 124, '#fff', 'center', 20); L.txt('✕', 480, 90, '#ffe08a', 'center', 44);
    var gx = 260, gy = 150, c = 84; var ga = A.split(''), gb = B.split(''); g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(gx, gy, c * 3, c * 3); g.strokeStyle = '#7ff0e4'; g.lineWidth = 3; g.strokeRect(gx, gy, c * 3, c * 3); for (var i = 1; i < 3; i++) { g.beginPath(); g.moveTo(gx + i * c, gy); g.lineTo(gx + i * c, gy + 3 * c); g.moveTo(gx, gy + i * c); g.lineTo(gx + 3 * c, gy + i * c); g.stroke(); }
    ga.forEach(function (x, i) { L.txt(x, gx + (i + 1.5) * c, gy + 56, '#ffe08a', 'center', 34); }); gb.forEach(function (x, i) { L.txt(x, gx + 45, gy + (i + 1) * c + 56, '#ffb3c6', 'center', 34); });
    var P = punnett(A, B); P.forEach(function (x, k) { var cx = gx + (k % 2 + 1) * c + c / 2, cy = gy + (Math.floor(k / 2) + 1) * c; L.txt(x, cx, cy + 40, fenotipo(x) === 0 ? '#c9a8ff' : '#fff', 'center', 28); L.emoji(fenotipo(x) === 0 ? '🪻' : '🌼', cx, cy + 66, 20); });
    if (L.paso !== 1) { L.txt(pctMorada(A, B) + ' % moradas · ' + (100 - pctMorada(A, B)) + ' % blancas', 720, 190, '#cfe6ff', 'center', 22); }
    if (L.paso === 2 && S.sem) { S.sem.forEach(function (f, i) { L.emoji(f === 0 ? '🪻' : '🌼', 590 + (i % 10) * 28, 250 + Math.floor(i / 10) * 34, 24); }); var m = S.sem.filter(function (x) { return x === 0; }).length; L.txt('Salieron ' + m + ' moradas y ' + (20 - m) + ' blancas', 730, 340, '#8be8ae', 'center', 18); }
  },
  hooks: function (L) { return { cruce: function (a, b) { L.S.a = a; L.S.b = b; marcar(L); }, correcta: function () { return L.q && !L.q.fin ? L.q.items[L.q.i].a : -1; }, resp: function (k) { L.quizResp(k); }, sembrar: function () { sembrar(L); }, sem: function () { return L.S.sem; } }; }
});
function marcar(L) { var S = L.S; if (L.paso === 0) { S.vistos[GEN[S.a] + GEN[S.b]] = 1; if (Object.keys(S.vistos).length >= 3) L.cumplir(0); } }
function preg(L) { var items = []; for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) { var pc = pctMorada(GEN[i], GEN[j]); items.push({ q: '', A: GEN[i], B: GEN[j], a: [0, 25, 50, 75, 100].indexOf(pc), fb: 'Eran ' + pc + ' % moradas' }); } L.nuevoQuiz(items, 5, 4); }
function sembrar(L) { var S = L.S, P = punnett(GEN[S.a], GEN[S.b]); S.sem = []; for (var i = 0; i < 20; i++) S.sem.push(fenotipo(P[Math.floor(Math.random() * 4)])); L.tono(500, 0.12, 0.3); if (S.a === 1 && S.b === 1) { if (S.sem.indexOf(1) >= 0) L.cumplir(2); else L.msj = 'Esta vez todas salieron moradas: ¡vuelve a sembrar!'; } }
