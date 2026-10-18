/* Biomas y adaptaciones (4°, solo español, sin voz). */
var BIOMAS = [
  { k: 'desierto', n: 'Desierto', e: '🏜️', c1: '#ffcf7a', c2: '#e8a64a', f: 'Muy seco y con temperaturas extremas. Poca lluvia.', fauna: ['🌵', '🐪', '🦎', '🦂'], suelo: '#e0b060' },
  { k: 'selva', n: 'Selva', e: '🌴', c1: '#5fd27a', c2: '#1f7a3a', f: 'Cálida y muy lluviosa. Tiene la mayor variedad de seres vivos.', fauna: ['🌴', '🦜', '🐒', '🐍'], suelo: '#2f6a2a' },
  { k: 'polar', n: 'Polo', e: '🧊', c1: '#dff4ff', c2: '#9ccdf0', f: 'Muy frío, con hielo y nieve casi todo el año.', fauna: ['🧊', '🐧', '🐻‍❄️', '🦭'], suelo: '#f4fbff' },
  { k: 'oceano', n: 'Océano', e: '🌊', c1: '#3aa0f0', c2: '#0b3a7a', f: 'Agua salada que cubre más de 70 % de la Tierra.', fauna: ['🪸', '🐠', '🐙', '🦈'], suelo: '#d9c28a' }
];
var ADAPT = [['🐪 Camello: guarda grasa en la joroba y soporta la sed', 0], ['🐧 Pingüino: tiene plumas gruesas y grasa para el frío', 2], ['🦜 Guacamaya: pico fuerte para abrir frutos de la selva', 1], ['🐠 Pez: respira con branquias bajo el agua', 3], ['🌵 Cactus: almacena agua en su tallo', 0], ['🐒 Mono: cola y brazos para trepar árboles', 1], ['🐻‍❄️ Oso polar: pelaje blanco para camuflarse en el hielo', 2], ['🐙 Pulpo: cambia de color y vive en el mar', 3]];
var LAB = LabKit({
  reto: true, hook: '__bio',
  pasos: [
    { n: 'Conoce los biomas', t: '1. Cuatro casas distintas', x: 'Un <b>bioma</b> es una gran región con un clima parecido y seres vivos adaptados a él. Hay desiertos, selvas, polos y océanos, entre otros. Toca cada bioma para conocerlo.', m: 'Visita los 4 biomas.', d: 'Colombia tiene selva, páramos, desiertos, costas y más: ¡es uno de los países más biodiversos!' },
    { n: 'Adaptaciones', t: '2. Cada uno en su lugar', x: 'Una <b>adaptación</b> es una característica que ayuda a un ser vivo a sobrevivir en su ambiente: un pelaje grueso para el frío, branquias para respirar en el agua, joroba para guardar energía.', m: 'Une 5 seres vivos con su bioma: acierta al menos 4.', d: 'El camuflaje es una adaptación que ayuda a esconderse o a cazar.' },
    { n: 'Arma un ecosistema', t: '3. Elige quién vive aquí', x: 'En un ecosistema equilibrado hay <b>productores</b> (plantas o algas), <b>consumidores</b> (animales) y todos viven en el ambiente que les corresponde. Elige un productor y dos animales para cada bioma.', m: 'Arma correctamente 2 ecosistemas.', d: 'Si un animal está en el bioma equivocado puede no encontrar comida ni refugio.' }
  ],
  enter: function (L, n) { var S = L.S; S.b = 0; S.vis = {}; S.sel = []; S.arm = 0; S.msj3 = ''; if (n === 1) quiz(L); if (n === 2) { S.b = 0; } },
  reintentar: function (L) { quiz(L); },
  ctl: function (L) {
    var S = L.S;
    if (L.paso === 0) BIOMAS.forEach(function (b, i) { L.op(b.e, b.n, function () { S.b = i; S.vis[i] = 1; L.tono(400 + i * 80, 0.1, 0.2); if (Object.keys(S.vis).length >= 4) L.cumplir(0); L.ctl(); }); });
    if (L.paso === 1) L.quizBtns(BIOMAS.map(function (b) { return [b.e, b.n]; }), true);
    if (L.paso === 2) { BIOMAS[S.b].fauna.concat(['🐧', '🐪', '🐟']).filter(function (x, i, a) { return a.indexOf(x) === i; }).sort().forEach(function (e) { L.op(e, S.sel.indexOf(e) >= 0 ? '✔' : ' ', function () { var k = S.sel.indexOf(e); if (k >= 0) S.sel.splice(k, 1); else if (S.sel.length < 3) S.sel.push(e); L.ctl(); }); }); L.btn('✔ Comprobar', function () { comprobar(L); }, 'btn grande'); L.btn('🌍 Cambiar bioma', function () { S.b = (S.b + 1) % 4; S.sel = []; S.msj3 = ''; L.ctl(); }, 'btn sec'); }
  },
  draw: function (L, g) {
    var S = L.S, W = L.W, H = L.H;
    if (L.paso === 1) { L.dibQuiz('#0a1a2e', '#cfe6ff'); return; }
    var b = BIOMAS[S.b], gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, b.c1); gr.addColorStop(1, b.c2); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.fillStyle = b.suelo; g.fillRect(0, 340, W, 120);
    if (b.k === 'oceano') { g.fillStyle = 'rgba(255,255,255,.12)'; for (var i = 0; i < 6; i++) { g.beginPath(); g.ellipse(100 + i * 160, 80 + (i % 3) * 40, 70, 12, 0, 0, 7); g.fill(); } }
    b.fauna.forEach(function (e, i) { var x = 150 + i * 220, y = b.k === 'oceano' ? 150 + Math.sin(L.t * 2 + i) * 40 + i * 30 : 330 + Math.sin(L.t * 2 + i) * 4; L.emoji(e, x, y, 70 + (i === 0 ? 20 : 0)); });
    L.txt(b.e + ' ' + b.n, W / 2, 56, b.k === 'polar' ? '#16304f' : '#fff', 'center', 34); L.wrap(b.f, W / 2, 96, W - 120, 24, b.k === 'polar' ? '#16304f' : '#fff', 18);
    if (L.paso === 2) { g.fillStyle = 'rgba(5,11,20,.75)'; g.fillRect(180, 380, 600, 68); L.txt('En tu ecosistema: ' + (S.sel.join(' ') || '— elige 3 seres —'), W / 2, 408, '#fff', 'center', 22); L.txt(S.msj3 || 'Elige 1 planta y 2 animales que vivan en este bioma', W / 2, 436, S.msj3.indexOf('✔') > -1 ? '#8be8ae' : '#ffe08a', 'center', 15); }
  },
  hooks: function (L) { return { bioma: function (i) { L.S.b = i; L.S.vis[i] = 1; if (Object.keys(L.S.vis).length >= 4) L.cumplir(0); }, correcta: function () { return L.q && !L.q.fin ? L.q.items[L.q.i].a : -1; }, resp: function (k) { L.quizResp(k); }, armar: function () { var S = L.S; S.sel = BIOMAS[S.b].fauna.slice(0, 3); comprobar(L); S.b = (S.b + 1) % 4; }, cambiar: function () { L.S.b = (L.S.b + 1) % 4; L.S.sel = []; } }; }
});
function quiz(L) { L.nuevoQuiz(ADAPT.map(function (a) { return { q: a[0], e: '', a: a[1], fb: 'Vive en: ' + BIOMAS[a[1]].n }; }), 5, 4); }
function comprobar(L) { var S = L.S, b = BIOMAS[S.b]; if (S.sel.length !== 3) { S.msj3 = 'Elige exactamente 3 seres'; L.mal(); return; } var ok = S.sel.every(function (e) { return b.fauna.indexOf(e) >= 0; }); if (ok) { S.arm++; S.msj3 = '✔ ¡Ecosistema equilibrado!'; L.tono(780, 0.15, 0.3); if (S.arm >= 2) L.cumplir(2); } else { S.msj3 = '✖ Alguien no vive en este bioma'; L.mal(); } }
