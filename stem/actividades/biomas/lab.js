/* Biomas y adaptaciones (4°, solo español, sin voz). */
var BIOMAS = [
  { k: 'desierto', n: 'Desierto', e: '🏜️', c1: '#ffcf7a', c2: '#e8a64a', f: 'Muy seco y con temperaturas extremas. Poca lluvia.', fauna: ['🌵', '🐪', '🦎', '🦂'], suelo: '#e0b060' },
  { k: 'selva', n: 'Selva', e: '🌴', c1: '#5fd27a', c2: '#1f7a3a', f: 'Cálida y muy lluviosa. Tiene la mayor variedad de seres vivos.', fauna: ['🌴', '🦜', '🐒', '🐍'], suelo: '#2f6a2a' },
  { k: 'polar', n: 'Polo', e: '🧊', c1: '#dff4ff', c2: '#9ccdf0', f: 'Muy frío, con hielo y nieve casi todo el año.', fauna: ['🧊', '🐧', '🐻‍❄️', '🦭'], suelo: '#f4fbff' },
  { k: 'oceano', n: 'Océano', e: '🌊', c1: '#3aa0f0', c2: '#0b3a7a', f: 'Agua salada que cubre más de 70 % de la Tierra.', fauna: ['🪸', '🐠', '🐙', '🦈'], suelo: '#d9c28a' }
];
var ADAPT = [['🐪 Camello: guarda grasa en la joroba y soporta la sed', 0], ['🐧 Pingüino: tiene plumas gruesas y grasa para el frío', 2], ['🦜 Guacamaya: pico fuerte para abrir frutos de la selva', 1], ['🐠 Pez: respira con branquias bajo el agua', 3], ['🌵 Cactus: almacena agua en su tallo', 0], ['🐒 Mono: cola y brazos para trepar árboles', 1], ['🐻‍❄️ Oso polar: pelaje blanco para camuflarse en el hielo', 2], ['🐙 Pulpo: cambia de color y vive en el mar', 3]];
var V3 = null, B3 = null;
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
    if (V3) V3.mostrar(L.paso !== 1);
    if (L.paso === 1) { L.dibQuiz('#0a1a2e', '#cfe6ff'); return; }
    var b = BIOMAS[S.b], gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, b.c1); gr.addColorStop(1, b.c2); g.fillStyle = gr; g.fillRect(0, 0, W, H); if (!V3) { g.fillStyle = b.suelo; g.fillRect(0, 340, W, 120); }
    if (b.k === 'oceano') { g.fillStyle = 'rgba(255,255,255,.12)'; for (var i = 0; i < 6; i++) { g.beginPath(); g.ellipse(100 + i * 160, 80 + (i % 3) * 40, 70, 12, 0, 0, 7); g.fill(); } }
    if (!V3) b.fauna.forEach(function (e, i) { var x = 150 + i * 220, y = b.k === 'oceano' ? 150 + Math.sin(L.t * 2 + i) * 40 + i * 30 : 330 + Math.sin(L.t * 2 + i) * 4; L.emoji(e, x, y, 70 + (i === 0 ? 20 : 0)); });
    L.txt(b.e + ' ' + b.n, W / 2, 56, b.k === 'polar' ? '#16304f' : '#fff', 'center', 34); L.wrap(b.f, W / 2, 96, W - 120, 24, b.k === 'polar' ? '#16304f' : '#fff', 18);
    if (L.paso === 2) { g.fillStyle = 'rgba(5,11,20,.75)'; g.fillRect(180, 380, 600, 68); L.txt('En tu ecosistema: ' + (S.sel.join(' ') || '— elige 3 seres —'), W / 2, 408, '#fff', 'center', 22); L.txt(S.msj3 || 'Elige 1 planta y 2 animales que vivan en este bioma', W / 2, 436, S.msj3.indexOf('✔') > -1 ? '#8be8ae' : '#ffe08a', 'center', 15); }
  },
  hooks: function (L) { return { bioma: function (i) { L.S.b = i; L.S.vis[i] = 1; if (Object.keys(L.S.vis).length >= 4) L.cumplir(0); }, correcta: function () { return L.q && !L.q.fin ? L.q.items[L.q.i].a : -1; }, resp: function (k) { L.quizResp(k); }, armar: function () { var S = L.S; S.sel = BIOMAS[S.b].fauna.slice(0, 3); comprobar(L); S.b = (S.b + 1) % 4; }, cambiar: function () { L.S.b = (L.S.b + 1) % 4; L.S.sel = []; } }; }
});
function quiz(L) { L.nuevoQuiz(ADAPT.map(function (a) { return { q: a[0], e: '', a: a[1], fb: 'Vive en: ' + BIOMAS[a[1]].n }; }), 5, 4); }
function comprobar(L) { var S = L.S, b = BIOMAS[S.b]; if (S.sel.length !== 3) { S.msj3 = 'Elige exactamente 3 seres'; L.mal(); return; } var ok = S.sel.every(function (e) { return b.fauna.indexOf(e) >= 0; }); if (ok) { S.arm++; S.msj3 = '✔ ¡Ecosistema equilibrado!'; L.tono(780, 0.15, 0.3); if (S.arm >= 2) L.cumplir(2); } else { S.msj3 = '✖ Alguien no vive en este bioma'; L.mal(); } }

/* ---------- diorama 3D de cada bioma ---------- */
function iniciar3d() {
  var V = window.Vista3D ? Vista3D({ z: 9.6, fov: 40, auto: 0.12 }) : null; if (!V) return; V3 = V; var T = THREE, M = V.mat; V.grupo.rotation.x = 0.42; V.grupo.position.y = -0.05; V.grupo.scale.setScalar(0.86);
  var G = {}, R = function (a, b) { return a + Math.random() * (b - a); }, seed = 7, rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  function emojiSprite(e, s) { var m = new T.Sprite(new T.SpriteMaterial({ map: V.textura(128, 128, function (c) { c.font = '100px system-ui'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(e, 64, 70); }), transparent: true, depthWrite: false })); m.scale.set(s, s, 1); return m; }
  function disco(col) { var d = new T.Mesh(new T.CylinderGeometry(4.2, 4.4, 0.5, 64), M(col, 0x000000)); d.position.y = -1.3; return d; }
  BIOMAS.forEach(function (b, bi) {
    var g = new T.Group(); g.add(disco(new T.Color(b.suelo).getHex())); G[bi] = { g: g, an: [] }; seed = 7 + bi * 31;
    if (b.k === 'desierto') { for (var i = 0; i < 4; i++) { var d = new T.Mesh(new T.SphereGeometry(1, 24, 16), M(0xe8bf72, 0x3a2a10)); d.scale.set(1.6 + rnd(), 0.4 + rnd() * 0.3, 1.1 + rnd() * 0.5); d.position.set(-2.8 + i * 1.9 + rnd(), -1.1, -2.2 + rnd() * 3); g.add(d); }
      [[-2, 0.6], [1.4, -0.5], [3, 1.2]].forEach(function (p) { var c = new T.Group(), tr = new T.Mesh(new T.CylinderGeometry(0.16, 0.2, 1.3, 14), M(0x3f9a4a, 0x0a2a10)); tr.position.y = 0.0; c.add(tr); [[-0.35, 0.2], [0.35, 0.45]].forEach(function (a) { var br = new T.Mesh(new T.CylinderGeometry(0.1, 0.12, 0.6, 10), M(0x3f9a4a, 0x0a2a10)); br.position.set(a[0], a[1], 0); c.add(br); }); c.position.set(p[0], -0.6, p[1]); g.add(c); }); }
    if (b.k === 'selva') { for (var t = 0; t < 14; t++) { var a = rnd() * 6.283, r = 1 + rnd() * 3, tr2 = new T.Group(), tk = new T.Mesh(new T.CylinderGeometry(0.12, 0.2, 1.6 + rnd(), 10), M(0x6a4a2a, 0x1a1008)); tk.position.y = 0.4; tr2.add(tk); for (var k = 0; k < 2; k++) { var cn = new T.Mesh(new T.SphereGeometry(0.7 + rnd() * 0.4, 14, 10), M(k ? 0x2f9a3a : 0x1f7a2a, 0x06220a)); cn.position.set((rnd() - 0.5) * 0.4, 1.3 + k * 0.5, (rnd() - 0.5) * 0.4); tr2.add(cn); } tr2.position.set(Math.cos(a) * r, -1.05, Math.sin(a) * r); g.add(tr2); } }
    if (b.k === 'polar') { for (var m = 0; m < 6; m++) { var ic = new T.Mesh(new T.BoxGeometry(0.8 + rnd(), 0.7 + rnd() * 1.4, 0.8 + rnd()), new T.MeshStandardMaterial({ color: 0xbfe6ff, emissive: 0x4a8ab8, emissiveIntensity: 0.3, transparent: true, opacity: 0.85, roughness: 0.1 })); var an2 = rnd() * 6.283, rr = 1.2 + rnd() * 2.6; ic.position.set(Math.cos(an2) * rr, -0.8, Math.sin(an2) * rr); ic.rotation.set(rnd(), rnd() * 3, rnd() * 0.4); g.add(ic); }
      for (var n = 0; n < 5; n++) { var sn = new T.Mesh(new T.SphereGeometry(0.7, 16, 12), M(0xffffff, 0x445566)); sn.scale.set(1.4, 0.5, 1.1); sn.position.set(-3 + n * 1.5, -1.1, rnd() * 3 - 1.5); g.add(sn); } }
    if (b.k === 'oceano') { var ag = new T.Mesh(new T.CylinderGeometry(4.2, 4.2, 3.2, 64, 1, true), new T.MeshStandardMaterial({ color: 0x2a8ae0, transparent: true, opacity: 0.28, side: T.DoubleSide, depthWrite: false })); ag.position.y = 0.3; g.add(ag); var top = new T.Mesh(new T.CircleGeometry(4.2, 64), new T.MeshBasicMaterial({ color: 0x7fc8ff, transparent: true, opacity: 0.25, side: T.DoubleSide })); top.rotation.x = -Math.PI / 2; top.position.y = 1.9; g.add(top);
      for (var c = 0; c < 10; c++) { var co = new T.Mesh(new T.ConeGeometry(0.25 + rnd() * 0.25, 0.8 + rnd(), 8), M([0xff6a8a, 0xff9a4a, 0xc86aff][c % 3], 0x401020)); var ac = rnd() * 6.283, rc = 1 + rnd() * 3; co.position.set(Math.cos(ac) * rc, -0.8, Math.sin(ac) * rc); g.add(co); }
      for (var s2 = 0; s2 < 14; s2++) { var al = new T.Mesh(new T.CylinderGeometry(0.03, 0.05, 1.2 + rnd(), 6), M(0x2faa5a, 0x0a3a1a)); var as = rnd() * 6.283, rs = 0.8 + rnd() * 3.2; al.position.set(Math.cos(as) * rs, -0.6, Math.sin(as) * rs); al.userData.sway = rnd() * 6; G[bi].an.push(al); g.add(al); }
      for (var bu = 0; bu < 24; bu++) { var bb = new T.Mesh(new T.SphereGeometry(0.05 + rnd() * 0.06, 8, 6), new T.MeshBasicMaterial({ color: 0xcfeaff, transparent: true, opacity: 0.7 })); bb.position.set((rnd() - 0.5) * 6, -1 + rnd() * 3, (rnd() - 0.5) * 6); bb.userData.bub = 1; G[bi].an.push(bb); g.add(bb); } }
    // animales (sprites) alrededor del centro
    b.fauna.forEach(function (e, i) { var sp = emojiSprite(e, i === 0 ? 1.7 : 1.4), ang = i / b.fauna.length * 6.283 + 0.6, rad = 1.2 + (i % 2) * 1.3; sp.position.set(Math.cos(ang) * rad, b.k === 'oceano' ? -0.2 + i * 0.4 : -0.2, Math.sin(ang) * rad); sp.userData.base = sp.position.y; sp.userData.ph = i; G[bi].an.push(sp); g.add(sp); });
    V.grupo.add(g);
  });
  B3 = G; V.anim(function (dt, t) { var S = LAB.S; Object.keys(G).forEach(function (k) { G[k].g.visible = Number(k) === S.b; }); G[S.b].an.forEach(function (o) { if (o.userData.sway !== undefined) o.rotation.z = 0.15 * Math.sin(t * 1.5 + o.userData.sway); else if (o.userData.bub) { o.position.y += dt * 0.5; if (o.position.y > 1.9) o.position.y = -1; } else if (o.userData.base !== undefined) o.position.y = o.userData.base + 0.12 * Math.sin(t * 2 + o.userData.ph); }); });
  V.mostrar(LAB.paso !== 1);
}
iniciar3d();
