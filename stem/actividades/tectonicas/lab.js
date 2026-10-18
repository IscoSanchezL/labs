/* Placas tectónicas (4°, solo español, sin voz): tipos de borde, clasificación y acumulación de tensión de un terremoto. */
var TIPOS = [['➡️⬅️ Convergente', 'conv', 'Las placas chocan: se levantan montañas y hay volcanes y terremotos.'], ['⬅️➡️ Divergente', 'div', 'Las placas se separan: sube magma y nace nueva corteza.'], ['⬆️⬇️ Transformante', 'trans', 'Las placas se deslizan de lado: se acumula tensión y ocurren terremotos.']];
var V3 = null, T3 = null;
var LAB = LabKit({
  reto: true, hook: '__tec',
  pasos: [
    { n: 'Tipos de borde', t: '1. La corteza se mueve', x: 'La superficie de la Tierra está partida en enormes <b>placas tectónicas</b> que flotan sobre el manto caliente y se mueven unos centímetros al año. Donde se encuentran hay tres tipos de borde: <b>convergente</b>, <b>divergente</b> y <b>transformante</b>.', m: 'Mira los tres tipos de movimiento de placas.', d: 'Las placas se mueven aproximadamente a la velocidad a la que crecen tus uñas.' },
    { n: '¿Qué forma cada borde?', t: '2. Montañas, océanos y fallas', x: 'En el borde <b>convergente</b> se forman montañas y volcanes. En el <b>divergente</b> nacen dorsales y valles de rift. En el <b>transformante</b> hay fallas con muchos terremotos.', m: 'Acierta 4 de 5 preguntas sobre los bordes.', juego: 1, d: 'La Cordillera de los Andes se formó donde la placa de Nazca se hunde bajo Sudamérica.' },
    { n: 'Terremoto', t: '3. Acumula tensión', x: 'Las placas no se deslizan suavemente: se <b>atascan</b>, la tensión se acumula como en un resorte y, cuando se rompe, se libera de golpe: un <b>terremoto</b>. Se mide con la <b>magnitud</b>.', m: 'Espera a que la tensión suba y libera un terremoto de magnitud 6 o más.', d: 'Cada punto de magnitud libera unas 32 veces más energía.' }
  ],
  enter: function (L, n) { var S = L.S; S.tipo = 'conv'; S.vistos = {}; S.tens = 0; S.vel = 1; S.mag = null; S.shake = 0; S.reg = []; if (n === 1) L.nuevoQuiz([{ q: '¿En qué tipo de borde se forman las montañas más altas?', e: '🏔️', a: 0, fb: 'En el convergente: las placas chocan' }, { q: '¿Dónde nace nueva corteza en el fondo del océano?', e: '🌊', a: 1, fb: 'En el divergente: se separan' }, { q: '¿Qué borde es famoso por fallas como la de San Andrés?', e: '🏠', a: 2, fb: 'En el transformante' }, { q: '¿Qué pasa cuando dos placas se acercan y chocan?', e: '🌋', a: 0, fb: 'Convergente: volcanes y montañas' }, { q: '¿Qué pasa cuando dos placas se alejan?', e: '↔️', a: 1, fb: 'Divergente: sube magma' }, { q: '¿Qué borde mueve las placas de lado, rozándose?', e: '↕️', a: 2, fb: 'Transformante' }], 5, 4); },
  reintentar: function (L) { window.__tec.ir(1); },
  ctl: function (L) {
    var S = L.S;
    if (L.paso === 0) TIPOS.forEach(function (t) { L.btn(t[0], function () { S.tipo = t[1]; S.vistos[t[1]] = 1; L.tono(400, 0.1, 0.2); if (Object.keys(S.vistos).length >= 3) L.cumplir(0); L.ctl(); }, 'tab', S.tipo === t[1]); });
    if (L.paso === 1) L.quizBtns(['⛰️ Convergente', '🌊 Divergente', '🏠 Transformante']);
    if (L.paso === 2) { L.rango('⚙️ Velocidad de las placas', 1, 5, 1, S.vel, function (v) { S.vel = v; }); L.btn('💥 Liberar energía', function () { liberar(L); }, 'btn grande'); }
  },
  sim: function (L, dt) { var S = L.S; S.p = ((S.p || 0) + dt / 6) % 1; if (L.paso === 2) { S.tens = Math.min(1, S.tens + dt * 0.04 * S.vel); } S.shake = Math.max(0, (S.shake || 0) - dt * 1.2); },
  draw: function (L, g) {
    var S = L.S, W = L.W, H = L.H, p = S.p || 0;
    if (L.paso === 1) { L.dibQuiz('#0a1424', '#cfe6ff'); return; }
    L.fondo('tierra'); if (V3) V3.mostrar(L.paso !== 1);
    if (!V3) {
    var dx = S.shake ? (Math.random() - 0.5) * 14 * S.shake : 0, dy = S.shake ? (Math.random() - 0.5) * 10 * S.shake : 0; g.save(); g.translate(dx, dy);
    // manto
    var mg = g.createLinearGradient(0, 300, 0, H); mg.addColorStop(0, '#c4400f'); mg.addColorStop(1, '#ff9a2a'); g.fillStyle = mg; g.fillRect(-20, 310, W + 40, H);
    L.txt('manto caliente', 90, 440, '#ffe08a', 'center', 14);
    var t = L.paso === 2 ? 'trans' : S.tipo, e = Math.sin(p * Math.PI * 2) * 0.5 + 0.5;
    if (t === 'conv') { var gap = 60 * (1 - e); g.fillStyle = '#3a6a8a'; g.fillRect(0, 270, 460 - gap * 0.4, 50); g.fillStyle = '#7a5a3a'; g.fillRect(480 - gap * 0.4 + 20, 250, 480, 70);
      g.fillStyle = '#3a6a8a'; g.beginPath(); g.moveTo(460 - gap * 0.4, 270); g.lineTo(560, 330 + 20 * e); g.lineTo(560, 380 + 20 * e); g.lineTo(460 - gap * 0.4, 320); g.fill();
      g.fillStyle = '#9a7a52'; g.beginPath(); g.moveTo(520, 250); g.lineTo(640, 250 - 90 * e); g.lineTo(760, 250); g.fill(); g.fillStyle = '#e8f0ff'; g.beginPath(); g.moveTo(618, 250 - 76 * e); g.lineTo(640, 250 - 90 * e); g.lineTo(662, 250 - 76 * e); g.fill();
      if (e > 0.6) { g.fillStyle = '#ff7a2a'; g.beginPath(); g.moveTo(790, 250); g.lineTo(830, 190); g.lineTo(870, 250); g.fill(); L.emoji('🌋', 830, 180, 40); }
      g.strokeStyle = '#fff'; g.lineWidth = 5; [[380, 220], [610, 360]].forEach(function (a, k) { g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(a[0] + (k ? -50 : 50) * 1, a[1] + (k ? -20 : 20)); g.stroke(); }); }
    if (t === 'div') { var gp = 20 + 90 * e; g.fillStyle = '#3a6a8a'; g.fillRect(0, 262, 480 - gp, 58); g.fillRect(480 + gp, 262, 480, 58); var mg2 = g.createLinearGradient(0, 262, 0, 340); mg2.addColorStop(0, '#ffb02a'); mg2.addColorStop(1, '#c4400f'); g.fillStyle = mg2; g.fillRect(480 - gp, 262 + (1 - e) * 20, 2 * gp, 80); g.fillStyle = '#5a3a2a'; g.fillRect(480 - gp, 262, 12 + e * 10, 20); g.fillRect(480 + gp - 12 - e * 10, 262, 12 + e * 10, 20); g.strokeStyle = '#fff'; g.lineWidth = 5; [[280, 230, -1], [680, 230, 1]].forEach(function (a) { g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(a[0] + a[2] * 60, a[1]); g.stroke(); }); L.txt('🌊 nueva corteza', 480, 230, '#ffe08a', 'center', 16); }
    if (t === 'trans') { var off = (L.paso === 2 ? S.tens * 26 : e * 26); g.fillStyle = '#7a5a3a'; g.fillRect(0, 240, 470, 80); g.fillRect(490, 240 + off * (Math.sin(p * 6.28) > 0 ? 1 : -1) * 0 + 0, 470, 80); g.fillStyle = '#4a6a3a'; g.fillRect(0, 236, 470, 8); g.fillRect(490, 236, 470, 8); g.strokeStyle = '#ff7a5a'; g.lineWidth = 4; g.setLineDash([6, 6]); g.beginPath(); g.moveTo(480, 200); g.lineTo(480, 320); g.stroke(); g.setLineDash([]); var o2 = L.paso === 2 ? S.tens * 40 : e * 40;
      g.fillStyle = '#fff'; g.font = '34px system-ui'; g.textAlign = 'center'; L.emoji('🏠', 440 - 6 * 0, 220, 36); L.emoji('🏠', 520, 220, 36); g.strokeStyle = '#fff'; g.lineWidth = 5; g.beginPath(); g.moveTo(300, 210 - 0); g.lineTo(300, 210 + 0); g.stroke(); g.fillStyle = '#fff'; g.font = '700 30px system-ui'; g.fillText('⬆', 250, 290 - o2 / 2); g.fillText('⬇', 710, 290 + o2 / 2); }
    g.restore();
    }
    if (L.paso === 0) { var inf = TIPOS.filter(function (x) { return x[1] === S.tipo; })[0]; L.wrap(inf[2], W / 2, 50, W - 80, 26, '#cfe6ff', 20); L.txt('Bordes vistos: ' + Object.keys(S.vistos).length + ' de 3', W / 2, 120, '#9db8ff', 'center', 15); }
    if (L.paso === 2) { L.txt('Tensión acumulada', 160, 60, '#cfe6ff', 'center', 16); g.fillStyle = 'rgba(255,255,255,.15)'; g.fillRect(60, 72, 200, 18); g.fillStyle = S.tens > 0.75 ? '#ff6b6b' : S.tens > 0.4 ? '#ffb02a' : '#8be8ae'; g.fillRect(60, 72, 200 * S.tens, 18);
      if (S.mag !== null) L.txt('Magnitud ' + S.mag.toFixed(1) + (S.mag >= 6 ? ' · ¡FUERTE!' : ' · leve'), W / 2, 60, S.mag >= 6 ? '#ff9f9f' : '#ffe08a', 'center', 26);
      g.strokeStyle = '#ff9f7a'; g.lineWidth = 2; g.beginPath(); S.reg.forEach(function (m, i) { var x = 600 + i * 12, y = 70; g.moveTo(x, y - m * 6); g.lineTo(x, y + m * 6); }); g.stroke(); L.txt('sismógrafo', 700, 100, '#9db8ff', 'center', 13); }
  },
  hooks: function (L) { return { tipo: function (t) { L.S.tipo = t; L.S.vistos[t] = 1; if (Object.keys(L.S.vistos).length >= 3) L.cumplir(0); }, correcta: function () { return L.q && !L.q.fin ? L.q.items[L.q.i].a : -1; }, resp: function (k) { L.quizResp(k); }, tensar: function (v) { L.S.tens = v; }, liberar: function () { liberar(L); } }; }
});
function liberar(L) { var S = L.S; S.mag = 3 + 4 * Math.pow(S.tens, 1.2); S.shake = 1; S.reg = []; for (var i = 0; i < 40; i++) S.reg.push(S.mag * Math.random() * Math.exp(-i / 14) * (i % 2 ? 1 : -1)); L.tono(70, 0.35, 1, 'sawtooth'); if (S.mag >= 6) L.cumplir(2); S.tens = 0; }

/* ---------- bloque de corteza en 3D ---------- */
function iniciar3d() {
  var V = window.Vista3D ? Vista3D({ z: 10.5, fov: 40, auto: 0 }) : null; if (!V) return; V3 = V; var T = THREE;
  V.grupo.rotation.x = 0.42; V.grupo.rotation.y = -0.35; V.grupo.position.y = -0.4;
  var manto = new T.Mesh(new T.BoxGeometry(9.4, 1.8, 3.2), V.mat(0xff7a1a, 0xff5a0a)); manto.position.y = -1.15; manto.material.emissiveIntensity = 0.55; V.grupo.add(manto);
  var piedra = V.mat(0x8a6a48, 0x1a1008), oceano = V.mat(0x3a7aa8, 0x0a2030);
  function losa(col) { var g = new T.Group(), m = new T.Mesh(new T.BoxGeometry(4.2, 0.55, 3.2), col), tope = new T.Mesh(new T.BoxGeometry(4.2, 0.08, 3.2), V.mat(0x4a8a4a, 0x0a2008)); tope.position.y = 0.3; g.add(m, tope); return g; }
  var A = losa(oceano), B = losa(piedra); V.grupo.add(A, B);
  var monte = new T.Mesh(new T.ConeGeometry(1, 1, 5), V.mat(0x9a7a52, 0x1a1208)), nieve = new T.Mesh(new T.ConeGeometry(0.34, 0.36, 5), V.mat(0xf2f6ff, 0x445566)); V.grupo.add(monte, nieve);
  var volc = new T.Mesh(new T.ConeGeometry(0.42, 0.7, 12), V.mat(0x5a3a2a, 0x1a0a05)), crater = new T.Mesh(new T.SphereGeometry(0.16, 12, 10), V.mat(0xff6a1a, 0xff4a0a)); V.grupo.add(volc, crater);
  var magma = new T.Mesh(new T.BoxGeometry(1, 0.7, 3.2), V.mat(0xffa02a, 0xff7a0a)); magma.material.emissiveIntensity = 0.7; V.grupo.add(magma);
  var chispas = []; for (var i = 0; i < 24; i++) { var c = new T.Mesh(new T.SphereGeometry(0.06, 8, 6), new T.MeshBasicMaterial({ color: 0xff9a2a })); c.visible = false; V.grupo.add(c); chispas.push({ m: c, v: 0, vx: 0, vy: 0 }); }
  var casas = []; for (var k = 0; k < 6; k++) { var h = new T.Mesh(new T.BoxGeometry(0.34, 0.3, 0.34), V.mat(k % 2 ? 0xffd05c : 0xff8a6a, 0x201005)); casas.push(h); V.grupo.add(h); }
  var falla = new T.Mesh(new T.BoxGeometry(0.04, 0.6, 3.4), new T.MeshBasicMaterial({ color: 0xff5a3a })); V.grupo.add(falla);
  T3 = { A: A, B: B, monte: monte, nieve: nieve, volc: volc, crater: crater, magma: magma, chispas: chispas, casas: casas, falla: falla, hi: 0 };
  V.anim(function (dt, t) {
    var L = LAB, S = L.S, p = S.p || 0, e = Math.sin(p * Math.PI * 2) * 0.5 + 0.5, tipo = L.paso === 2 ? 'trans' : S.tipo, o = L.paso === 2 ? S.tens : e;
    [monte, nieve, volc, crater, magma, falla].forEach(function (m) { m.visible = false; }); casas.forEach(function (m) { m.visible = false; });
    A.rotation.set(0, 0, 0); A.position.set(-2.1, 0, 0); B.position.set(2.1, 0, 0); B.rotation.set(0, 0, 0);
    if (tipo === 'conv') { var d = 0.5 * e; A.position.set(-2.1 + d, -0.02 * e, 0); A.rotation.z = -0.28 * e; A.position.y = -0.1 * e; monte.visible = nieve.visible = true; var sy = 0.2 + 1.1 * e; monte.scale.set(1.2, sy, 1.2); monte.position.set(2.3, 0.34 + 0.5 * sy, 0); nieve.visible = e > 0.5; nieve.scale.set(1, 0.9, 1); nieve.position.set(2.3, 0.34 + sy - 0.15, 0);
      volc.visible = true; volc.position.set(3.7, 0.65, 0); volc.scale.setScalar(1); crater.visible = e > 0.55; crater.position.set(3.7, 1.02, 0);
      if (e > 0.55 && Math.random() < dt * 14) { var c = chispas[T3.hi++ % chispas.length]; c.v = 1.1; c.vx = (Math.random() - 0.5) * 1.2; c.vy = 2 + Math.random() * 1.2; c.m.position.set(3.7, 1.05, 0); } }
    if (tipo === 'div') { var gap = 0.2 + 1.5 * e; A.position.set(-2.1 - gap, 0, 0); B.position.set(2.1 + gap, 0, 0); magma.visible = true; magma.scale.set(gap * 2 + 0.05, 1, 1); magma.position.set(0, -0.12 + 0.12 * e, 0); }
    if (tipo === 'trans') { var off = o * 1.1 * (L.paso === 2 ? 1 : 1); A.position.set(-2.1, 0, off); B.position.set(2.1, 0, -off); falla.visible = true; falla.position.set(0, 0.05, 0); casas.forEach(function (h, i) { h.visible = true; var side = i < 3 ? -1 : 1; h.position.set(side * (0.3 + (i % 3) * 0.1) , 0.48, ((i % 3) - 1) * 0.9 + (side < 0 ? off : -off)); }); }
    chispas.forEach(function (c) { if (c.v > 0) { c.v -= dt; c.m.visible = true; c.vy -= 3.2 * dt; c.m.position.x += c.vx * dt; c.m.position.y += c.vy * dt; } else c.m.visible = false; });
    V.grupo.position.x = S.shake ? (Math.random() - 0.5) * 0.25 * S.shake : 0; V.grupo.position.y = -0.4 + (S.shake ? (Math.random() - 0.5) * 0.15 * S.shake : 0);
  });
  V.mostrar(LAB.paso !== 1);
}
iniciar3d();
