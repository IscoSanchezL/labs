/* Volcanes (4°, solo español, sin voz): volcán 3D en corte, presión y erupción, lava fluida o espesa, preguntas. */
var INFO = {
  camara: ['Cámara magmática', 'Es la gran bolsa donde se acumula el magma, a muchos kilómetros bajo el volcán.', '#ff9f7a'],
  chimenea: ['Chimenea', 'Es el conducto por donde sube el magma desde la cámara hasta la superficie.', '#ffd05c'],
  crater: ['Cráter', 'Es la boca del volcán: por aquí salen la lava, los gases y la ceniza.', '#ff7a3a'],
  cono: ['Cono volcánico', 'Es la montaña que se forma con la lava y la ceniza que se acumulan capa sobre capa.', '#b99a72']
};
var V3 = null, W3 = null;
var LAB = LabKit({
  reto: true, hook: '__vol',
  pasos: [
    { n: 'Por dentro', t: '1. ¿Cómo es un volcán por dentro?', x: 'Un volcán es una grieta de la Tierra por donde sale el <b>magma</b> de su interior. Gira el corte en 3D y <b>toca</b> cada parte para descubrir qué hace.', m: 'Toca las 4 partes: la cámara magmática, la chimenea, el cráter y el cono.', d: 'En la Tierra hay unos 1 500 volcanes que pueden entrar en erupción.' },
    { n: 'La presión', t: '2. ¿Por qué erupciona?', x: 'Dentro de la cámara el magma se calienta y los <b>gases</b> se acumulan. La <b>presión</b> sube hasta que el magma rompe la salida y se produce la <b>erupción</b>.', m: 'Sube la presión con el control (o con el botón de calor) hasta que el volcán erupcione.', d: 'La olla a presión funciona parecido: si no tiene válvula, la presión busca por dónde salir.' },
    { n: 'Tipos de erupción', t: '3. Suaves o explosivas', x: 'Si el magma es <b>fluido</b> (poco viscoso), la lava corre por las laderas con calma. Si es <b>espeso</b> (muy viscoso), los gases quedan atrapados y la erupción es una <b>explosión</b> con una gran columna de ceniza.', m: 'Provoca una erupción con magma muy fluido y otra con magma muy espeso.', d: 'El Kilauea, en Hawái, tiene lava fluida; el Vesubio, en Italia, tiene erupciones explosivas.' },
    { n: 'Preguntas', t: '4. Piensa y responde', x: 'Pon a prueba lo que sabes de volcanes.', m: 'Acierta 4 de 5 preguntas.', d: 'La palabra «volcán» viene de Vulcano, el dios romano del fuego.' }
  ],
  enter: function (L, n) { var S = L.S; S.P = 0.2; S.Vi = 0.5; S.sel = null; S.tocados = {}; S.vistos = {}; S.er = null; if (n === 3) preg(L); },
  reintentar: function (L) { preg(L); },
  ctl: function (L) {
    var S = L.S;
    if (L.paso === 1) { L.rango('📈 Presión de la cámara', 0, 100, 1, Math.round(S.P * 100), function (v) { S.P = v / 100; }); L.btn('🔥 Calentar', function () { S.P = Math.min(1, S.P + 0.15); L.ctl(); }, 'btn'); }
    if (L.paso === 2) { L.rango('🧪 Viscosidad del magma (fluido → espeso)', 0, 100, 5, Math.round(S.Vi * 100), function (v) { S.Vi = v / 100; }); L.btn('🌋 Provocar erupción', function () { erupcion(L); }, 'btn grande'); }
    if (L.paso === 3) L.quizBtns(S.ops || ['A', 'B', 'C']);
  },
  sim: function (L, dt) {
    var S = L.S; if (L.paso === 1 && !S.er) { S.P = Math.min(1, S.P + dt * 0.02); if (S.P >= 1) erupcion(L); }
    if (S.er) { S.er.t += dt; if (S.er.t > 7) { S.er = null; S.P = 0.15; if (L.paso === 1) L.ctl(); } }
  },
  draw: function (L, g) {
    var S = L.S, W = L.W, H = L.H; L.fondo('tierra', 0.5); if (V3) V3.mostrar(L.paso !== 3);
    if (L.paso === 3) { L.dibQuiz(null, '#cfe6ff'); return; }
    g.fillStyle = 'rgba(5,11,20,.8)'; g.fillRect(0, H - 60, W, 60); var tx = '';
    if (L.paso === 0) tx = S.sel ? INFO[S.sel][1] : 'Toca una parte del volcán (' + Object.keys(S.tocados).length + '/4) · arrastra para girarlo';
    if (L.paso === 1) tx = S.er ? '🌋 ¡Erupción!' : 'Presión: ' + Math.round(S.P * 100) + ' % — ' + (S.P > 0.75 ? '¡a punto de estallar!' : S.P > 0.4 ? 'sube la presión…' : 'tranquilo por ahora');
    if (L.paso === 2) tx = (S.er ? (S.er.v < 0.4 ? '🌊 Erupción efusiva: la lava fluye por las laderas' : S.er.v > 0.6 ? '💥 Erupción explosiva: columna de ceniza' : '🌋 Erupción mixta') : 'Magma ' + (S.Vi < 0.35 ? 'muy fluido' : S.Vi > 0.65 ? 'muy espeso' : 'intermedio')) + ' · fluida: ' + (S.vistos.f ? '✔' : '—') + '  espesa: ' + (S.vistos.e ? '✔' : '—');
    L.wrap(tx, W / 2, H - 30, W - 60, 24, S.sel && L.paso === 0 ? INFO[S.sel][2] : '#cfe6ff', 19);
    if (L.paso === 0 && (S.sel || (V3 && V3.hover))) { var k = S.sel || V3.hover; L.txt(INFO[k][0], W / 2, 38, INFO[k][2], 'center', 24); }
    if (L.paso === 1 || L.paso === 2) L.barra(30, 30, 200, S.P, S.P > 0.75 ? '#ff6b6b' : '#ffb02a', 'Presión');
  },
  hooks: function (L) { return { tocar: function (k) { tocar(L, k); }, presion: function (v) { L.S.P = v; }, erupcion: function (v) { if (v !== undefined) L.S.Vi = v; erupcion(L); }, correcta: function () { return L.q && !L.q.fin ? L.q.items[L.q.i].a : -1; }, resp: function (k) { L.quizResp(k); }, eruptando: function () { return !!L.S.er; } }; }
});
function tocar(L, k) { var S = L.S; if (L.paso !== 0 || !k) return; S.sel = k; S.tocados[k] = 1; L.tono(420 + Object.keys(S.tocados).length * 80, 0.12, 0.15); if (Object.keys(S.tocados).length >= 4) L.cumplir(0); }
function erupcion(L) {
  var S = L.S; if (S.er) return; var v = L.paso === 2 ? S.Vi : 0.5; S.er = { t: 0, v: v }; S.P = 1; L.tono(60, 0.4, 1.4, 'sawtooth'); L.sacudir(10);
  if (L.paso === 1) L.cumplir(1); if (L.paso === 2) { if (v <= 0.3) S.vistos.f = 1; if (v >= 0.7) S.vistos.e = 1; if (S.vistos.f && S.vistos.e) L.cumplir(2); }
}
function preg(L) {
  var it = [
    ['🌋 ¿Cómo se llama la roca derretida bajo la superficie?', ['A) Magma', 'B) Ceniza', 'C) Granito'], 0, 'Magma; al salir se llama lava'],
    ['🔥 ¿Cómo se llama el magma cuando sale a la superficie?', ['A) Vapor', 'B) Lava', 'C) Arena'], 1, 'Lava'],
    ['🧪 Un magma muy espeso produce una erupción…', ['A) Explosiva', 'B) Tranquila', 'C) Sin gases'], 0, 'Explosiva: los gases quedan atrapados'],
    ['🌊 La lava fluida corre por las laderas formando…', ['A) Ríos de lava', 'B) Nubes', 'C) Hielo'], 0, 'Ríos de lava'],
    ['⛰️ ¿Cómo se llama la boca del volcán?', ['A) Cono', 'B) Cráter', 'C) Cámara'], 1, 'El cráter'],
    ['📈 ¿Qué hace subir el magma?', ['A) La presión de los gases', 'B) La lluvia', 'C) El viento'], 0, 'La presión de los gases']
  ];
  L.nuevoQuiz(it.map(function (x) { return { q: x[0] + '   ' + x[1].join('   '), e: '', a: x[2], fb: x[3] }; }), 5, 4); L.S.ops = ['A', 'B', 'C']; L.ctl(); }

/* ---------- volcán 3D ---------- */
function iniciar3d() {
  var V = window.Vista3D ? Vista3D({ z: 9.2, fov: 40, auto: 0.12 }) : null; if (!V) return; V3 = V; var T = THREE; V.grupo.position.y = -1.3; V.grupo.rotation.x = 0.28; V.grupo.rotation.y = 0.55;
  V.onPick = function (k) { tocar(LAB, k); };
  var perfil = [[3.4, 0], [2.7, 0.3], [1.9, 0.95], [1.25, 1.75], [0.8, 2.45], [0.55, 2.75], [0.42, 2.55], [0.34, 2.25]].map(function (p) { return new T.Vector2(p[0], p[1]); });
  var rocaMat = new T.MeshStandardMaterial({ color: 0x7a5a3e, roughness: 1, side: T.DoubleSide, emissive: 0x1a0e06, emissiveIntensity: 0.4 });
  var cono = new T.Mesh(new T.LatheGeometry(perfil, 48, 0, Math.PI * 1.5), rocaMat); cono.userData = { k: 'cono' }; V.grupo.add(cono);
  var lavaTex = V.textura(4, 128, function (c, w, h) { var gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,230,120,1)'); gr.addColorStop(0.5, 'rgba(255,110,20,.9)'); gr.addColorStop(1, 'rgba(255,60,0,0)'); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
  var perfil2 = perfil.map(function (p) { return new T.Vector2(p.x * 1.012, p.y * 1.012 + 0.01); });
  var capa = new T.Mesh(new T.LatheGeometry(perfil2, 48, 0, Math.PI * 1.5), new T.MeshBasicMaterial({ map: lavaTex, transparent: true, opacity: 0, side: T.DoubleSide, depthWrite: false, blending: T.AdditiveBlending })); V.grupo.add(capa);
  var suelo = new T.Mesh(new T.CylinderGeometry(5, 5, 0.3, 48), new T.MeshStandardMaterial({ color: 0x2a3a22, roughness: 1 })); suelo.position.y = -0.15; suelo.userData = { k: 'x', pick: false }; V.grupo.add(suelo);
  var estrato = new T.Mesh(new T.CylinderGeometry(3.4, 3.4, 0.9, 48, 1, false, 0, Math.PI * 1.5), new T.MeshStandardMaterial({ color: 0x5a3a2a, side: T.DoubleSide })); estrato.position.y = -0.6; V.grupo.add(estrato);
  var camara = new T.Mesh(new T.SphereGeometry(1, 32, 24), new T.MeshStandardMaterial({ color: 0xff3a10, emissive: 0xff5a10, emissiveIntensity: 0.5, roughness: 0.4 })); camara.scale.set(1.4, 0.65, 1.4); camara.position.set(0, -0.15, 0); camara.userData = { k: 'camara' }; V.grupo.add(camara);
  var chim = new T.Mesh(new T.CylinderGeometry(0.2, 0.28, 2.7, 16), new T.MeshStandardMaterial({ color: 0xff8a2a, emissive: 0xff6a10, emissiveIntensity: 0.5 })); chim.position.set(0, 1.2, 0); chim.userData = { k: 'chimenea' }; V.grupo.add(chim);
  var cra = new T.Mesh(new T.TorusGeometry(0.5, 0.1, 10, 28), new T.MeshStandardMaterial({ color: 0xff7a3a, emissive: 0xff4a10, emissiveIntensity: 0.5 })); cra.rotation.x = Math.PI / 2; cra.position.set(0, 2.62, 0); cra.userData = { k: 'crater' }; V.grupo.add(cra);
  V.scene.add(new T.PointLight(0xff7a30, 1.2, 12)); V.scene.children[V.scene.children.length - 1].position.set(0, 3, 1);
  var brillo = V.textura(64, 64, function (c, w, h) { var g2 = c.createRadialGradient(32, 32, 2, 32, 32, 32); g2.addColorStop(0, 'rgba(255,255,255,1)'); g2.addColorStop(0.4, 'rgba(255,255,255,.5)'); g2.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g2; c.fillRect(0, 0, w, h); });
  var pool = [], ash = [], i;
  for (i = 0; i < 140; i++) { var m = new T.Sprite(new T.SpriteMaterial({ map: brillo, color: 0xff8a2a, transparent: true, blending: T.AdditiveBlending, depthWrite: false, opacity: 0 })); m.scale.set(0.28, 0.28, 1); V.grupo.add(m); pool.push({ m: m, v: 0, vx: 0, vy: 0, vz: 0 }); }
  for (i = 0; i < 70; i++) { var a = new T.Sprite(new T.SpriteMaterial({ map: brillo, color: 0x6a6a72, transparent: true, depthWrite: false, opacity: 0 })); a.scale.set(0.8, 0.8, 1); V.grupo.add(a); ash.push({ m: a, v: 0, vx: 0, vy: 0, vz: 0 }); }
  W3 = { camara: camara, chim: chim, cra: cra, capa: capa, hi: 0, ai: 0, cono: cono };
  V.anim(function (dt, t) {
    var L = LAB, S = L.S, P = S.P === undefined ? 0 : S.P, er = S.er, inten = er ? Math.max(0, 1 - er.t / 7) : 0, vis = er ? er.v : 0.5;
    var cut = L.paso === 0; cono.material.opacity = 1; var on = function (k) { return S.sel === k || V.hover === k; };
    camara.material.emissiveIntensity = (on('camara') ? 1 : 0.3) + P * 0.8 + 0.1 * Math.sin(t * (2 + P * 8)); chim.material.emissiveIntensity = on('chimenea') ? 1 : 0.35 + P * 0.5; cra.material.emissiveIntensity = on('crater') ? 1 : 0.4 + P * 0.5; cono.material.emissiveIntensity = on('cono') ? 1.4 : 0.4;
    camara.scale.set(1.4 + 0.1 * P * Math.sin(t * 10), 0.65 + 0.06 * P, 1.4 + 0.1 * P * Math.sin(t * 10));
    V.grupo.position.x = (P > 0.7 || inten > 0.3) ? (Math.random() - 0.5) * 0.12 * Math.max(P - 0.6, inten) : 0;
    W3.capa.material.opacity += ((er && vis < 0.55 ? Math.min(1, er.t * 0.6) * inten + 0.1 : 0) - W3.capa.material.opacity) * Math.min(1, dt * 2);
    if (er) { var tasa = (er.v < 0.5 ? 40 : 70) * inten; for (var n = 0; n < tasa * dt + Math.random(); n++) { var p = pool[W3.hi++ % pool.length], ang = Math.random() * 6.283, sp = vis < 0.5 ? 0.7 + Math.random() * 1.2 : 1.5 + Math.random() * 2.6; p.v = 1.4 + Math.random(); p.m.position.set(Math.cos(ang) * 0.25, 2.7, Math.sin(ang) * 0.25); p.vx = Math.cos(ang) * sp * 0.5; p.vz = Math.sin(ang) * sp * 0.5; p.vy = (vis < 0.5 ? 3 : 5.5) + Math.random() * 2.5; }
      if (vis >= 0.45) for (var q = 0; q < 55 * inten * dt + Math.random() * inten; q++) { var a = ash[W3.ai++ % ash.length]; a.v = 3.2; a.m.position.set((Math.random() - 0.5) * 0.4, 2.8, (Math.random() - 0.5) * 0.4); a.m.scale.set(0.5, 0.5, 1); a.vx = (Math.random() - 0.5) * 0.8; a.vz = (Math.random() - 0.5) * 0.8; a.vy = 2.2 + vis * 2; } }
    pool.forEach(function (p) { if (p.v > 0) { p.v -= dt; p.vy -= 7 * dt; p.m.position.x += p.vx * dt; p.m.position.y += p.vy * dt; p.m.position.z += p.vz * dt; if (p.m.position.y < 0.5) p.v = 0; p.m.material.opacity = Math.min(1, p.v * 1.5); } else p.m.material.opacity = 0; });
    ash.forEach(function (a) { if (a.v > 0) { a.v -= dt; a.m.position.x += a.vx * dt; a.m.position.y += a.vy * dt; a.m.position.z += a.vz * dt; a.m.scale.multiplyScalar(1 + dt * 0.8); a.m.material.opacity = Math.min(0.7, a.v * 0.3); } else a.m.material.opacity = 0; });
  });
  V.mostrar(LAB.paso !== 3);
}
iniciar3d();
