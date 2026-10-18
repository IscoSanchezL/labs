/* Empujar y halar (2°, solo español, sin voz): fuerzas que mueven objetos, empujar o halar, fuerza y masa. */
var CAJ = [['📦', 1, 'Caja liviana'], ['🧰', 2, 'Caja mediana'], ['🪨', 3, 'Caja pesada']];
var LAB = LabKit({
  hook: '__emp',
  pasos: [
    { n: 'Empujar y halar', t: '1. Las fuerzas mueven las cosas', x: 'Una <b>fuerza</b> es un empujón o un jalón. <b>Empujar</b> aleja la caja de ti y <b>halar</b> la acerca. Empuja la caja hasta la bandera 🚩 y luego hálala de vuelta a la casa 🏠.', m: 'Lleva la caja a la bandera y devuélvela a la casa.', d: 'Para abrir una puerta a veces se empuja y a veces se hala.' },
    { n: '¿Empujo o halo?', t: '2. ¿Empujar o halar?', x: 'Decide si en cada situación se <b>empuja</b> o se <b>hala</b>.', m: 'Acierta 4 de 5.', d: 'Un columpio se empuja; una carretilla también; un cajón se hala para abrirlo.' },
    { n: 'Fuerza y peso', t: '3. Más pesado, más fuerza', x: 'Una caja pesada necesita <b>más fuerza</b> para moverse igual de lejos. Elige la fuerza para que cada caja llegue a la <b>zona verde</b> sin pasarse.', m: 'Lleva las 3 cajas a la zona verde.', d: 'Los camiones llevan motores grandes porque cargan cosas muy pesadas.' }
  ],
  enter: function (L, n) { var S = L.S; S.x = 140; S.v = 0; S.F = 3; S.fl = 0; S.dir = 1; S.c = 0; S.ok = {}; S.msg = ''; S.suelta = false; if (n === 1) preg(L); },
  reintentar: function (L) { if (L.paso === 1) preg(L); else { L.S.x = 140; L.S.ok = {}; L.S.c = 0; L.ctl(); } },
  ctl: function (L) {
    var S = L.S;
    if (L.paso === 0) { L.btn('👉 Empujar', function () { dar(L, 1); }, 'btn grande'); L.btn('🤏 Halar', function () { dar(L, -1); }, 'btn grande'); }
    if (L.paso === 1) L.quizBtns(S.ops || ['A', 'B']);
    if (L.paso === 2) { CAJ.forEach(function (c, i) { L.btn(c[0] + ' ' + c[2], function () { if (Math.abs(S.v) < 1) { S.c = i; S.x = 140; S.msg = ''; } }, 'btn sec'); }); L.rango('💪 Fuerza', 1, 10, 1, S.F, function (v) { S.F = v; }); L.btn('👉 Empujar', function () { dar(L, 1); }, 'btn grande'); }
  },
  sim: function (L, dt) {
    var S = L.S; if (Math.abs(S.v) > 1) { S.x += S.v * dt; var d = 120 * dt; S.v = S.v > 0 ? Math.max(0, S.v - d) : Math.min(0, S.v + d); if (S.x < 60) { S.x = 60; S.v = 0; } if (S.x > 860) { S.x = 860; S.v = 0; } if (Math.abs(S.v) < 1) { S.v = 0; parar(L); } }
  },
  draw: function (L, g) {
    var S = L.S, W = L.W, H = L.H, bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#6ac4ff'); bg.addColorStop(1, '#bfe9ff'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    if (L.paso === 1) { g.fillStyle = 'rgba(10,26,46,.82)'; g.fillRect(0, 0, W, H); L.dibQuiz(null, '#fff'); return; }
    g.fillStyle = '#7bc96b'; g.fillRect(0, 330, W, 130); g.fillStyle = '#8b6b3e'; g.fillRect(0, 330, W, 12);
    if (L.paso === 2) { g.fillStyle = 'rgba(80,220,120,.5)'; g.fillRect(480, 330, 320, 12); L.txt('Zona verde', 640, 320, '#0a3a1a', 'center', 20); }
    if (L.paso === 0) { L.emoji('🏠', 110, 300, 70); L.emoji('🚩', 800, 300, 70); }
    var c = L.paso === 2 ? CAJ[S.c] : CAJ[0]; L.emoji(c[0], S.x, 300, 64 + (c[1] - 1) * 14);
    var mv = Math.abs(S.v) > 1; L.emoji('🧒', S.dir > 0 ? S.x - 70 : S.x + 70, 300, 56);
    if (mv || S.suelta) L.txt(S.dir > 0 ? '→ empuja' : '← hala', S.x, 230, '#a00', 'center', 20);
    L.txt(S.msg || (L.paso === 0 ? (S.fl ? 'Ahora hala la caja hasta la casa 🏠' : 'Empuja la caja hasta la bandera 🚩') : 'Elige la fuerza y empuja'), 480, 420, S.msg.indexOf('✔') > -1 ? '#0a5a2a' : '#0a2a4a', 'center', 22);
    if (L.paso === 2) L.txt('Cajas listas: ' + Object.keys(S.ok).length + ' / 3 · ' + c[2], 480, 40, '#0a2a4a', 'center', 22);
  },
  hooks: function (L) { return { dar: function (d, F) { if (F) L.S.F = F; dar(L, d); }, caja: function (i) { L.S.c = i; L.S.x = 140; }, quieto: function () { return Math.abs(L.S.v) < 1; }, correcta: function () { return L.q && !L.q.fin ? L.q.items[L.q.i].a : -1; }, resp: function (k) { L.quizResp(k); }, x: function () { return L.S.x; } }; }
});
function dar(L, d) {
  var S = L.S; if (Math.abs(S.v) > 1) return; S.dir = d; S.suelta = false; var m = L.paso === 2 ? CAJ[S.c][1] : 1; S.v = d * 100 * (L.paso === 2 ? S.F : 3) / m; L.tono(300, 0.1, 0.12);
}
function parar(L) {
  var S = L.S; if (L.paso === 0) { if (S.x >= 760) S.fl = 1; if (S.fl && S.x <= 160) L.cumplir(0); }
  if (L.paso === 2) { if (S.x >= 480 && S.x <= 800) { S.ok[S.c] = 1; S.msg = '✔ ¡En la zona verde!'; L.tono(700, 0.12, 0.15); if (Object.keys(S.ok).length >= 3) L.cumplir(2); } else { S.msg = S.x < 480 ? '✖ Falta fuerza' : '✖ Te pasaste'; L.mal(); } }
}
function preg(L) {
  var it = [
    ['🚪 Para abrir un cajón de la cómoda, ¿qué haces?', ['A) Empujar', 'B) Halar'], 1, 'Se hala'],
    ['🛒 Para mover un carrito de mercado hacia adelante…', ['A) Empujo', 'B) Halo'], 0, 'Se empuja'],
    ['🛝 Para mover un columpio hacia adelante…', ['A) Empujo', 'B) Halo'], 0, 'Se empuja'],
    ['🧵 Para sacar un cordón de una cuerda…', ['A) Empujo', 'B) Halo'], 1, 'Se hala'],
    ['🚪 Una puerta dice PUSH. ¿Qué haces?', ['A) Empujar', 'B) Halar'], 0, 'PUSH significa empujar'],
    ['🐕 Un niño sujeta a su perro con una correa y camina. ¿Qué hace el perro?', ['A) Empujar', 'B) Halar'], 1, 'Hala la correa']
  ];
  L.nuevoQuiz(it.map(function (x) { return { q: x[0] + '   ' + x[1].join('   '), e: '', a: x[2], fb: x[3] }; }), 5, 4); L.S.ops = ['A', 'B']; L.ctl(); }
