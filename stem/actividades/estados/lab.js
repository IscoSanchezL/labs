/* Sólido, líquido o gas (1°, solo español, con voz de Beto): el agua cambia de estado y clasificar objetos. */
var EST = [['🧊', 'Sólido'], ['💧', 'Líquido'], ['💨', 'Gas']];
var COS = [['🪨', 'la piedra', 0], ['🧊', 'el hielo', 0], ['🧸', 'el oso de peluche', 0], ['⚽', 'la pelota', 0], ['🥛', 'la leche', 1], ['🧃', 'el jugo', 1], ['💧', 'el agua', 1], ['🍯', 'la miel', 1], ['🎈', 'el aire del globo', 2], ['☁️', 'el vapor de la olla', 2], ['🌬️', 'el viento', 2]];
function estado(T) { return T <= 0 ? 0 : T < 100 ? 1 : 2; }
var LAB = LabKit({
  hook: '__est', voz: true,
  pasos: [
    { n: 'El agua cambia', t: 'El agua cambia', x: 'El agua puede ser sólida, líquida o gas. Con mucho frío es hielo, que es sólido. Con calor es agua, que es líquida. Con muchísimo calor es vapor, que es gas. Calienta y enfría para verlo.', m: 'Mira los tres estados del agua.', d: 'Un sólido tiene forma propia; un líquido toma la forma del vaso; un gas llena todo el espacio.' },
    { n: '¿Qué estado es?', t: '¿Qué estado es?', x: 'Mira el objeto y toca si es sólido, líquido o gas.', m: 'Acierta cuatro veces.', d: 'Las piedras y los juguetes son sólidos: no se escurren.' },
    { n: 'Otra vez', t: 'Otra vez, con más cosas', x: 'Ahora hay objetos nuevos. Toca si cada uno es sólido, líquido o gas.', m: 'Acierta cuatro veces.', d: 'El aire que respiras es una mezcla de gases.' }
  ],
  enter: function (L, n) { var S = L.S; S.T = -10; S.tg = -10; S.vis = {}; S.vis[0] = 1; if (n > 0) preg(L); },
  reintentar: function (L) { preg(L); },
  ctl: function (L) {
    var S = L.S;
    if (L.paso === 0) { L.op('🔥', 'Calentar', function () { S.tg = 130; }); L.op('❄️', 'Enfriar', function () { S.tg = -10; }); }
    else L.quizBtns(EST, true);
  },
  sim: function (L, dt) { var S = L.S; if (L.paso !== 0) return; var d = S.tg - S.T; S.T += Math.sign(d) * Math.min(Math.abs(d), 22 * dt); S.vis[estado(S.T)] = 1; if (Object.keys(S.vis).length >= 3) L.cumplir(0); },
  draw: function (L, g) {
    var S = L.S, W = L.W, H = L.H, bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#1d4f7a'); bg.addColorStop(1, '#0a1a2e'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    if (L.paso > 0) { L.dibQuiz(null, '#fff'); return; }
    var e = estado(S.T), cx = 300;
    g.fillStyle = 'rgba(255,255,255,.15)'; g.fillRect(180, 200, 240, 180); g.strokeStyle = '#fff'; g.lineWidth = 4; g.strokeRect(180, 200, 240, 180);
    if (e === 0) { L.emoji('🧊', cx, 320, 110); } else if (e === 1) { g.fillStyle = 'rgba(70,160,255,.75)'; g.fillRect(184, 270, 232, 106); for (var i = 0; i < 3; i++) L.emoji('💧', 230 + i * 70, 300 + Math.sin(L.t * 3 + i) * 5, 40); } else { g.fillStyle = 'rgba(70,160,255,.25)'; g.fillRect(184, 270, 232, 106); for (var j = 0; j < 6; j++) L.emoji('💨', 220 + (j % 3) * 70, 240 - ((L.t * 60 + j * 40) % 160) + 100, 46); }
    if (S.tg > S.T + 1) L.emoji('🔥', cx, 405, 54);
    L.txt(EST[e][0] + ' ' + EST[e][1], 700, 160, '#ffe08a', 'center', 40); L.txt(Math.round(S.T) + ' °C', 700, 230, '#fff', 'center', 34);
    EST.forEach(function (x, i) { g.globalAlpha = S.vis[i] ? 1 : 0.25; L.emoji(x[0], 620 + i * 80, 330, 54); g.globalAlpha = 1; }); L.txt('Estados vistos: ' + Object.keys(S.vis).length + ' de 3', 700, 410, '#8be8ae', 'center', 20);
  },
  hooks: function (L) { return { meta: function (t) { L.S.tg = t; }, T: function () { return L.S.T; }, correcta: function () { return L.q && !L.q.fin ? L.q.items[L.q.i].a : -1; }, resp: function (k) { L.quizResp(k); } }; }
});
function preg(L) {
  var pool = L.paso === 1 ? COS.slice(0, 8) : COS.slice(4);
  L.nuevoQuiz(pool.map(function (c) { return { q: '¿' + c[1].charAt(0).toUpperCase() + c[1].slice(1) + ' es sólido, líquido o gas?', e: c[0], a: c[2], fb: 'Es ' + EST[c[2]][1].toLowerCase() }; }), 5, 4); L.ctl(); }
