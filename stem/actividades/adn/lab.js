/* ADN (6°, solo español, sin voz): emparejar bases A-T / C-G, copiar una hebra y traducir codones a aminoácidos. */
var BASE = { A: ['#ff6b8a', 'T'], T: ['#ffd05c', 'A'], C: ['#5cc8ff', 'G'], G: ['#7be39a', 'C'] };
var COD = { 'AUG': 'Inicio', 'GCU': 'Alanina', 'UUU': 'Fenilalanina', 'GGC': 'Glicina', 'AAA': 'Lisina', 'UAA': 'Parada' };
var CODS = Object.keys(COD);
var LAB = LabKit({
  hook: '__adn',
  pasos: [
    { n: 'Doble hélice', t: '1. Empareja las bases', x: 'El <b>ADN</b> es una doble hélice. Sus peldaños son <b>bases</b> que siempre se juntan igual: <b>A con T</b> y <b>C con G</b>. Completa la hebra complementaria tocando la base correcta.', m: 'Completa 8 pares de bases correctamente.', d: 'Si estiraras el ADN de una sola célula tuyo, medirías cerca de 2 metros.' },
    { n: 'Copiar', t: '2. Preguntas de ADN', x: 'Antes de dividirse, la célula <b>copia</b> su ADN: la hélice se abre y cada hebra sirve de molde para una nueva. Así cada célula hija recibe la misma información.', m: 'Acierta 4 de 5 preguntas.', d: 'El ADN está en el núcleo de casi todas tus células y es casi igual al de cualquier otra persona.' },
    { n: 'Código', t: '3. Del código a la proteína', x: 'El ADN se copia a ARN (con <b>U</b> en vez de T) y se lee de <b>tres en tres</b> bases (<b>codones</b>) y cada codón corresponde a un <b>aminoácido</b>. Una cadena de aminoácidos forma una <b>proteína</b>. Descifra los codones.', m: 'Traduce correctamente 4 de 5 codones.', d: 'Hay 64 codones posibles y solo 20 aminoácidos: por eso varios codones dan el mismo aminoácido.' }
  ],
  enter: function (L, n) { var S = L.S; S.k = 0; S.ok = 0; S.msg = ''; S.seq = []; if (n === 0) nuevaSeq(L); if (n === 1) preg(L); if (n === 2) nuevoCod(L); },
  reintentar: function (L) { if (L.paso === 1) preg(L); else if (L.paso === 2) nuevoCod(L); else nuevaSeq(L); },
  ctl: function (L) {
    var S = L.S;
    if (L.paso === 0) ['A', 'T', 'C', 'G'].forEach(function (b) { L.btn(b, function () { baseElegida(L, b); }, 'btn'); });
    if (L.paso === 1) L.quizBtns(S.ops || ['A', 'B', 'C']);
    if (L.paso === 2 && S.opc) S.opc.forEach(function (o) { L.btn(o, function () { respCod(L, o); }, 'btn'); });
  },
  draw: function (L, g) {
    var S = L.S, W = L.W, H = L.H, bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#12082a'); bg.addColorStop(1, '#050310'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    if (L.paso === 1) { L.dibQuiz(null, '#cfe6ff'); return; }
    if (L.paso === 0) {
      for (var i = 0; i < 12; i++) { var x = 60 + i * 72, ph = L.t * 1.5 + i * 0.5, dy = Math.sin(ph) * 26, y1 = 150 + dy, y2 = 330 - dy; g.strokeStyle = 'rgba(255,255,255,.15)'; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y1); g.lineTo(x, y2); g.stroke(); g.fillStyle = '#9db8ff'; g.beginPath(); g.arc(x, y1, 6, 0, 7); g.fill(); g.beginPath(); g.arc(x, y2, 6, 0, 7); g.fill();
        if (i < S.seq.length) { var b = S.seq[i]; g.fillStyle = BASE[b][0]; g.fillRect(x - 15, y1 - 38, 30, 30); L.txt(b, x, y1 - 16, '#0a0a1a', 'center', 20); if (i < S.k) { var c = BASE[b][1]; g.fillStyle = BASE[c][0]; g.fillRect(x - 15, y2 + 8, 30, 30); L.txt(c, x, y2 + 30, '#0a0a1a', 'center', 20); } else if (i === S.k) { g.strokeStyle = '#fff'; g.setLineDash([4, 4]); g.strokeRect(x - 15, y2 + 8, 30, 30); g.setLineDash([]); L.txt('?', x, y2 + 30, '#fff', 'center', 20); } } }
      L.txt('A–T · C–G', 480, 40, '#ffe08a', 'center', 22); L.txt(S.msg || 'Toca la base que se empareja con la señalada', 480, 440, S.msg.indexOf('✔') > -1 ? '#8be8ae' : S.msg ? '#ff9f9f' : '#9db8ff', 'center', 18);
    }
    if (L.paso === 2 && S.cod) {
      L.txt('Codón ' + Math.min(S.k + 1, 5) + ' de 5', 480, 50, '#9db8ff', 'center', 18); S.cod.split('').forEach(function (ch, i) { var x = 360 + i * 120; g.fillStyle = ({ A: '#ff6b8a', U: '#c9a8ff', C: '#5cc8ff', G: '#7be39a' })[ch]; g.fillRect(x - 40, 120, 80, 80); L.txt(ch, x, 178, '#0a0a1a', 'center', 52); });
      L.txt('¿Qué aminoácido codifica?', 480, 270, '#ffe08a', 'center', 24); L.txt(S.msg || '', 480, 340, S.msg.indexOf('✔') > -1 ? '#8be8ae' : '#ff9f9f', 'center', 20); L.txt('Aciertos: ' + S.ok, 480, 420, '#9db8ff', 'center', 17);
    }
  },
  hooks: function (L) { return { base: function (b) { baseElegida(L, b); }, actual: function () { return L.S.seq[L.S.k] ? BASE[L.S.seq[L.S.k]][1] : ''; }, correcta: function () { return L.q && !L.q.fin ? L.q.items[L.q.i].a : -1; }, resp: function (k) { L.quizResp(k); }, cod: function () { return L.S.cod ? COD[L.S.cod] : ''; }, elegirCod: function (o) { respCod(L, o); }, fin: function () { return L.S.k; } }; }
});
function nuevaSeq(L) { var S = L.S; S.k = 0; S.seq = []; for (var i = 0; i < 12; i++) S.seq.push('ATCG'[Math.floor(Math.random() * 4)]); S.msg = ''; S.ok = 0; }
function baseElegida(L, b) {
  var S = L.S; if (L.paso !== 0 || S.k >= S.seq.length) return;
  if (b === BASE[S.seq[S.k]][1]) { S.k++; S.ok++; S.msg = '✔ ¡Par correcto!'; L.tono(500 + S.k * 40, 0.1, 0.12); if (S.ok >= 8) L.cumplir(0); if (S.k >= S.seq.length) { S.k = 0; nuevaSeq(L); } }
  else { S.msg = '✖ A con T, C con G'; L.mal(); }
}
function nuevoCod(L) { var S = L.S; S.k = 0; S.ok = 0; S.fallos = 0; S.cods = L.mezclar(CODS.slice()).slice(0, 5); sigCod(L); }
function sigCod(L) { var S = L.S; S.cod = S.cods[S.k]; S.opc = L.mezclar(Object.keys(COD).map(function (k) { return COD[k]; })).slice(0, 4); if (S.opc.indexOf(COD[S.cod]) < 0) S.opc[0] = COD[S.cod]; S.opc = L.mezclar(S.opc); S.msg = ''; L.ctl(); }
function respCod(L, o) {
  var S = L.S; if (L.paso !== 2 || S.k >= 5) return;
  if (o === COD[S.cod]) { S.ok++; L.tono(700, 0.12, 0.15); S.msg = '✔ ¡Correcto!'; } else { S.msg = '✖ Era ' + COD[S.cod]; L.mal(); }
  S.k++; if (S.k >= 5) { if (S.ok >= 4) L.cumplir(2); else { S.opc = []; L.ctl(); S.msg = 'Aciertos ' + S.ok + ' de 5. ¡Inténtalo otra vez!'; setTimeout(function () { nuevoCod(L); }, 1800); } L.ctl(); } else setTimeout(function () { sigCod(L); }, 700);
}
function preg(L) {
  var it = [
    ['🧬 ¿Con qué base se empareja la A (adenina)?', ['A) G', 'B) T', 'C) C'], 1, 'A se une con T'],
    ['🧪 ¿Con qué base se empareja la C (citosina)?', ['A) G', 'B) A', 'C) T'], 0, 'C se une con G'],
    ['📜 ¿Cómo es la forma del ADN?', ['A) Una línea recta', 'B) Una doble hélice', 'C) Un cuadrado'], 1, 'Una doble hélice'],
    ['🔬 ¿Dónde está el ADN en una célula animal?', ['A) En el núcleo', 'B) En la membrana', 'C) Fuera de la célula'], 0, 'En el núcleo'],
    ['👯 ¿Para qué se copia el ADN?', ['A) Para que cada célula hija tenga la misma información', 'B) Para hacer ruido', 'C) Para crecer en altura'], 0, 'Para que las células hijas reciban la misma información'],
    ['🥼 Un conjunto de tres bases que codifica un aminoácido se llama…', ['A) Codón', 'B) Proteína', 'C) Cromosoma'], 0, 'Codón']
  ];
  L.nuevoQuiz(it.map(function (x) { return { q: x[0] + '   ' + x[1].join('   '), e: '', a: x[2], fb: x[3] }; }), 5, 4); L.S.ops = ['A', 'B', 'C']; L.ctl(); }
