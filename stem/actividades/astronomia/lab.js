/* Galaxias y estrellas (6°, solo español, sin voz): masa y destino de una estrella, color y temperatura, ciclo de vida en orden. */
var SEC = [['Nebulosa', '☁️'], ['Protoestrella', '🔥'], ['Secuencia principal', '☀️'], ['Gigante roja', '🔴'], ['Nebulosa planetaria', '🌀'], ['Enana blanca', '⚪']];
var MAS = [['Nebulosa', '☁️'], ['Protoestrella', '🔥'], ['Supergigante', '🔴'], ['Supernova', '💥'], ['Agujero negro', '⚫']];
var ROND = [SEC, MAS];
function destino(m) { return m < 8 ? ['Enana blanca', '#e8f4ff', 'Estrella pequeña: se hincha como gigante roja y termina como enana blanca.'] : m < 20 ? ['Estrella de neutrones', '#7fb8ff', 'Explota como supernova y deja un núcleo diminuto y densísimo.'] : ['Agujero negro', '#b9a8ff', 'Explota como supernova y su núcleo colapsa en un agujero negro.']; }
function color(m) { return m < 1 ? '#ff8a5c' : m < 2 ? '#ffd27a' : m < 8 ? '#fff3c4' : m < 20 ? '#cfe6ff' : '#9db8ff'; }
var V3 = null, E3 = null;
var LAB = LabKit({
  reto: true, hook: '__astro',
  pasos: [
    { n: 'Masa y destino', t: '1. La masa decide todo', x: 'Una estrella nace en una <b>nebulosa</b> de gas y polvo. Según su <b>masa</b> (medida en masas solares) termina como <b>enana blanca</b>, <b>estrella de neutrones</b> o <b>agujero negro</b>. Mueve el deslizador y observa.', m: 'Descubre los 3 destinos posibles cambiando la masa.', d: 'Las estrellas más grandes viven poco: ¡algunas duran solo unos millones de años, mientras el Sol vivirá 10 000 millones!' },
    { n: 'Color y temperatura', t: '2. Preguntas de estrellas', x: 'El <b>color</b> de una estrella revela su temperatura: las <b>rojas</b> son las más frías y las <b>azules</b> las más calientes. Nuestra galaxia, la <b>Vía Láctea</b>, tiene unos 200 000 millones de estrellas.', m: 'Acierta 4 de 5 preguntas.', d: 'El Sol es una estrella amarilla de tamaño mediano, a solo 8 minutos luz de nosotros.' },
    { n: 'Ciclo de vida', t: '3. Ordena la vida de la estrella', x: 'Toca las etapas <b>en el orden correcto</b>, desde que la estrella nace hasta que muere. Hay dos casos: una estrella como el Sol y una estrella gigante.', m: 'Ordena el ciclo de vida de las 2 estrellas.', d: 'Los átomos de tu cuerpo se formaron dentro de estrellas que explotaron hace miles de millones de años.' }
  ],
  enter: function (L, n) { var S = L.S; S.m = 1; S.vis = {}; S.r = 0; S.k = 0; S.msg = ''; S.mez = null; if (n === 1) preg(L); if (n === 2) ronda(L); },
  reintentar: function (L) { if (L.paso === 1) preg(L); else { L.S.r = 0; ronda(L); } },
  ctl: function (L) {
    var S = L.S;
    if (L.paso === 0) L.rango('⚖️ Masa (× Sol)', 0.5, 30, 0.5, S.m, function (v) { S.m = v; S.vis[destino(v)[0]] = 1; if (Object.keys(S.vis).length >= 3) L.cumplir(0); });
    if (L.paso === 1) L.quizBtns(S.ops || ['A', 'B', 'C']);
    if (L.paso === 2 && S.mez) S.mez.forEach(function (e) { L.btn(e[1] + ' ' + e[0], function () { elegir(L, e[0]); }, 'btn'); });
  },
  draw: function (L, g) {
    var S = L.S, W = L.W, H = L.H; L.fondo('espacio');
    for (var i = 0; i < 70; i++) { var sx = (i * 137.5) % W, sy = (i * 71.3) % H; g.fillStyle = 'rgba(255,255,255,' + (0.3 + 0.5 * Math.abs(Math.sin(L.t + i))) + ')'; g.fillRect(sx, sy, 2, 2); }
    if (V3) { V3.mostrar(L.paso === 0); sync3d(S.m); }
    if (L.paso === 1) { L.dibQuiz(null, '#cfe6ff'); return; }
    if (L.paso === 0) {
      var d = destino(S.m), r = 25 + S.m * 3, cx = 300, cy = 230, c = color(S.m), gl = g.createRadialGradient(cx, cy, r * 0.3, cx, cy, r * 2.2 + 6 * Math.sin(L.t * 3)); gl.addColorStop(0, c); gl.addColorStop(1, 'rgba(0,0,0,0)'); if (!V3) { g.fillStyle = gl; g.beginPath(); g.arc(cx, cy, r * 2.2, 0, 7); g.fill(); g.fillStyle = c; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fill(); }
      L.txt('Masa: ' + S.m.toFixed(1) + ' × Sol', cx, 60, '#ffe08a', 'center', 22);
      g.fillStyle = 'rgba(5,11,20,.8)'; g.fillRect(520, 110, 400, 250); L.txt('Su destino', 720, 150, '#9db8ff', 'center', 16); if (!V3) L.emoji(S.m < 8 ? '⚪' : S.m < 20 ? '💫' : '⚫', 720, 215, 60); L.txt(d[0], 720, 275, d[1], 'center', 26); L.wrap(d[2], 720, 310, 360, 20, '#cfe6ff');
      L.txt(['', '', ''].length ? 'Destinos vistos: ' + Object.keys(S.vis).length + ' de 3' : '', 480, 430, '#8be8ae', 'center', 17);
    }
    if (L.paso === 2) {
      var sq = ROND[S.r]; L.txt('Estrella ' + (S.r === 0 ? 'como el Sol ☀️' : 'gigante ⭐') + ' · ronda ' + (S.r + 1) + ' de 2', 480, 40, '#ffe08a', 'center', 20);
      sq.forEach(function (e, i) { var x = 480 + (i - (sq.length - 1) / 2) * 150, y = 190, ok = i < S.k; g.globalAlpha = ok ? 1 : 0.25; L.emoji(e[1], x, y, 54); L.txt(ok ? e[0] : '?', x, y + 60, ok ? '#8be8ae' : '#9db8ff', 'center', 14); g.globalAlpha = 1; if (i < sq.length - 1) L.txt('→', x + 75, y + 8, '#556', 'center', 22); });
      L.txt(S.msg || 'Toca la primera etapa de la vida de la estrella', 480, 400, S.msg.indexOf('✔') > -1 ? '#8be8ae' : S.msg ? '#ff9f9f' : '#9db8ff', 'center', 18);
    }
  },
  hooks: function (L) { return { masa: function (v) { L.S.m = v; L.S.vis[destino(v)[0]] = 1; if (Object.keys(L.S.vis).length >= 3) L.cumplir(0); }, correcta: function () { return L.q && !L.q.fin ? L.q.items[L.q.i].a : -1; }, resp: function (k) { L.quizResp(k); }, elegir: function (n) { elegir(L, n); }, siguiente: function () { var S = L.S; return S.r < 2 ? ROND[S.r][S.k][0] : ''; } }; }
});
function ronda(L) { var S = L.S; S.k = 0; S.msg = ''; S.mez = L.mezclar(ROND[S.r].slice()); L.ctl(); }
function elegir(L, n) {
  var S = L.S, sq = ROND[S.r]; if (n === sq[S.k][0]) { S.k++; S.msg = '✔ ¡Correcto!'; L.tono(600 + S.k * 60, 0.12, 0.15); S.mez = S.mez.filter(function (e) { return e[0] !== n; }); if (S.k >= sq.length) { if (S.r === 0) { S.r = 1; setTimeout(function () { ronda(L); }, 900); } else { S.mez = []; L.cumplir(2); } } L.ctl(); }
  else { S.msg = '✖ Esa no es la que sigue'; L.mal(); }
}
function preg(L) {
  var it = [
    ['🌡️ ¿Qué color tienen las estrellas más calientes?', ['A) Rojas', 'B) Azules', 'C) Verdes'], 1, 'Las azules son las más calientes'],
    ['☀️ ¿Qué tipo de estrella es el Sol?', ['A) Una estrella de tamaño mediano', 'B) Un planeta', 'C) Un agujero negro'], 0, 'El Sol es una estrella mediana'],
    ['🌌 ¿Cómo se llama nuestra galaxia?', ['A) Andrómeda', 'B) Vía Láctea', 'C) Orión'], 1, 'Vivimos en la Vía Láctea'],
    ['💥 ¿Cómo muere una estrella muy masiva?', ['A) Se apaga lentamente', 'B) Explota como supernova', 'C) Se congela'], 1, 'Explota como supernova'],
    ['🕳️ ¿Qué es un año luz?', ['A) Un año de brillo', 'B) La distancia que recorre la luz en un año', 'C) El tiempo que tarda un cohete'], 1, 'Es una distancia, no un tiempo'],
    ['⭐ ¿Dónde nacen las estrellas?', ['A) En nebulosas de gas y polvo', 'B) En los planetas', 'C) En los cometas'], 0, 'En nebulosas de gas y polvo']
  ];
  L.nuevoQuiz(it.map(function (x) { return { q: x[0] + '   ' + x[1].join('   '), e: '', a: x[2], fb: x[3] }; }), 5, 4); L.S.ops = ['A', 'B', 'C']; L.ctl(); }

/* ---------- estrella y destino en 3D ---------- */
function iniciar3d(L) {
  var V = window.Vista3D ? Vista3D({ z: 9.5, fov: 40, auto: 0, luces: false, fijo: true }) : null; if (!V) return; V3 = V; var T = THREE;
  V.scene.add(new T.AmbientLight(0x667799, 0.8)); var pl = new T.PointLight(0xffffff, 1.4, 60); pl.position.set(2, 3, 8); V.scene.add(pl);
  var brillo = V.textura(128, 128, function (c, w, h) { var g2 = c.createRadialGradient(64, 64, 4, 64, 64, 64); g2.addColorStop(0, 'rgba(255,255,255,1)'); g2.addColorStop(0.25, 'rgba(255,255,255,.55)'); g2.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g2; c.fillRect(0, 0, w, h); });
  function glow(col, sz) { var m = new T.Sprite(new T.SpriteMaterial({ map: brillo, color: col, transparent: true, blending: T.AdditiveBlending, depthWrite: false })); m.scale.set(sz, sz, 1); return m; }
  var estrella = new T.Group(), cuerpo = new T.Mesh(new T.SphereGeometry(1, 40, 30), new T.MeshBasicMaterial({ color: 0xffd27a })), halo = glow(0xffc060, 5); estrella.add(cuerpo, halo); estrella.position.set(-2.9, 0.15, 0); V.scene.add(estrella);
  var manchas = new T.Mesh(new T.SphereGeometry(1.01, 24, 18), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.05, wireframe: true })); estrella.add(manchas);
  var enana = new T.Group(); enana.add(new T.Mesh(new T.SphereGeometry(0.34, 28, 20), new T.MeshBasicMaterial({ color: 0xffffff })), glow(0xcfe8ff, 2.2));
  var nebu = new T.Mesh(new T.SphereGeometry(1.1, 28, 20), new T.MeshBasicMaterial({ color: 0xff8ab0, transparent: true, opacity: 0.18, wireframe: true })); enana.add(nebu);
  var neutro = new T.Group(); neutro.add(new T.Mesh(new T.SphereGeometry(0.2, 24, 18), new T.MeshBasicMaterial({ color: 0xbfe0ff })), glow(0x7fb8ff, 2.4));
  var haz = new T.Mesh(new T.CylinderGeometry(0.03, 0.22, 2.6, 16, 1, true), new T.MeshBasicMaterial({ color: 0x9fd0ff, transparent: true, opacity: 0.35, side: T.DoubleSide, blending: T.AdditiveBlending, depthWrite: false })), haz2 = haz.clone(); haz.position.y = 1.3; haz2.position.y = -1.3; haz2.rotation.z = Math.PI; var ejeN = new T.Group(); ejeN.add(haz, haz2); neutro.add(ejeN); ejeN.rotation.z = 0.5;
  var negro = new T.Group(); negro.add(new T.Mesh(new T.SphereGeometry(0.46, 32, 24), new T.MeshBasicMaterial({ color: 0x000000 })));
  var disco = new T.Mesh(new T.RingGeometry(0.62, 1.5, 64, 4), new T.MeshBasicMaterial({ map: V.textura(256, 8, function (c, w, h) { var g3 = c.createLinearGradient(0, 0, w, 0); g3.addColorStop(0, '#fff2c0'); g3.addColorStop(0.4, '#ff9f2a'); g3.addColorStop(1, 'rgba(120,20,0,0)'); c.fillStyle = g3; c.fillRect(0, 0, w, h); }), transparent: true, side: T.DoubleSide, blending: T.AdditiveBlending, depthWrite: false }));
  var uv = disco.geometry.attributes.uv, pos = disco.geometry.attributes.position; for (var k = 0; k < pos.count; k++) { var rr = Math.hypot(pos.getX(k), pos.getY(k)); uv.setXY(k, (rr - 0.62) / 0.88, 0.5); }
  disco.rotation.x = 1.15; negro.add(disco); negro.add(glow(0xff8a3a, 3));
  [enana, neutro, negro].forEach(function (o) { o.position.set(2.95, 0.6, 0); o.scale.setScalar(0.72); V.scene.add(o); o.visible = false; });
  E3 = { estrella: estrella, cuerpo: cuerpo, halo: halo, enana: enana, neutro: neutro, negro: negro, nebu: nebu, ejeN: ejeN, disco: disco, m: 1 };
  V.anim(function (dt, t) { estrella.rotation.y += dt * 0.3; halo.scale.setScalar(E3.hs * (1 + 0.04 * Math.sin(t * 3))); nebu.scale.setScalar(1 + 0.15 * Math.sin(t * 1.2)); ejeN.rotation.y += dt * 4; disco.rotation.z += dt * 0.8; neutro.scale.setScalar(0.72 * (1 + 0.08 * Math.sin(t * 20))); });
  E3.hs = 5; V.mostrar(L.paso === 0); sync3d(L.S.m);
}
function sync3d(m) {
  if (!E3) return; var r = Math.min(1.35, 0.5 + m * 0.025 + Math.sqrt(m) * 0.07); E3.estrella.scale.setScalar(r); E3.cuerpo.material.color.set(color(m)); E3.halo.material.color.set(color(m)); E3.hs = 3 + r * 2;
  E3.enana.visible = m < 8; E3.neutro.visible = m >= 8 && m < 20; E3.negro.visible = m >= 20;
}
setTimeout(function () { iniciar3d(window.__astro.L); }, 0);
