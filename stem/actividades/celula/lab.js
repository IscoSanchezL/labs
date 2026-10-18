/* La célula (4°, solo español, sin voz): célula 3D que se puede girar y tocar; reto «¿quién hace qué?», animal y vegetal, preguntas. */
var INFO = {
  nucleo: { n: 'Núcleo', f: 'Es el centro de control: guarda el ADN con las instrucciones de la célula.', c: '#c9a8ff' },
  mito: { n: 'Mitocondria', f: 'Produce la energía que la célula necesita para vivir. Es su «central eléctrica».', c: '#ff9f7a' },
  ribo: { n: 'Ribosomas', f: 'Fabrican las proteínas siguiendo las instrucciones del ADN.', c: '#ffe08a' },
  golgi: { n: 'Aparato de Golgi', f: 'Empaqueta y envía las sustancias que la célula fabrica. Es como una oficina de correos.', c: '#7ff0e4' },
  liso: { n: 'Lisosoma', f: 'Digiere lo que sobra o está dañado. Es el «sistema de limpieza» de la célula.', c: '#ff7aa8' },
  memb: { n: 'Membrana celular', f: 'Rodea la célula y decide qué entra y qué sale.', c: '#9db8ff' },
  pared: { n: 'Pared celular', f: 'Cubierta rígida de las células vegetales: da forma y protege. Las células animales no la tienen.', c: '#8be8ae' },
  cloro: { n: 'Cloroplasto', f: 'Hace la fotosíntesis: usa la luz del sol para fabricar alimento. Solo está en células vegetales.', c: '#6fe38a' },
  vacu: { n: 'Vacuola central', f: 'Gran bolsa de agua de las células vegetales: almacena y mantiene la célula firme.', c: '#8cc5ff' }
};
var V3 = null, C3 = null;
var LAB = LabKit({
  reto: true, hook: '__celula',
  pasos: [
    { n: 'Explorar', t: '1. Viaje al interior de la célula', x: 'La <b>célula</b> es la unidad más pequeña de un ser vivo. Dentro tiene partes llamadas <b>orgánulos</b>, y cada una cumple una función. <b>Arrastra</b> para girar la célula en 3D y <b>toca</b> cada parte.', m: 'Toca 6 partes distintas de la célula animal.', d: 'Tu cuerpo tiene unos 37 billones de células.' },
    { n: '¿Quién hace qué?', t: '2. Encuentra el orgánulo', x: 'Te diré una función y tendrás que <b>tocar el orgánulo</b> que la realiza. Gira la célula para verlos todos.', m: 'Acierta 5 funciones seguidas (puedes fallar y seguir intentando).', d: 'Las mitocondrias tienen su propio ADN, distinto del del núcleo.' },
    { n: 'Animal y vegetal', t: '3. ¿En qué se diferencian?', x: 'La célula <b>vegetal</b> tiene tres cosas que la animal no: <b>pared celular</b>, <b>cloroplastos</b> y una gran <b>vacuola</b>. Cambia a la célula vegetal y tócalas.', m: 'En la célula vegetal toca la pared, un cloroplasto y la vacuola.', d: 'Los cloroplastos le dan el color verde a las hojas.' },
    { n: 'Preguntas', t: '4. Piensa y responde', x: 'Pon a prueba lo que aprendiste sobre la célula.', m: 'Acierta 4 de 5 preguntas.', d: 'Robert Hooke llamó «células» a las celdillas del corcho en 1665.' }
  ],
  enter: function (L, n) { var S = L.S; S.tipo = n === 2 ? 'vegetal' : 'animal'; S.sel = null; S.tocados = {}; S.t3 = {}; S.ok = 0; S.pd = null; S.msg = ''; if (n === 3) preg(L); if (n === 1) nuevaPregunta(L, true); armar(S.tipo); },
  reintentar: function (L) { if (L.paso === 1) { L.S.ok = 0; nuevaPregunta(L, true); } else preg(L); },
  ctl: function (L) {
    var S = L.S;
    if (L.paso === 0) L.btn(S.tipo === 'animal' ? '🌿 Ver célula vegetal' : '🐾 Ver célula animal', function () { S.tipo = S.tipo === 'animal' ? 'vegetal' : 'animal'; S.sel = null; armar(S.tipo); L.ctl(); }, 'btn sec');
    if (L.paso === 2) { L.btn('🐾 Célula animal', function () { S.tipo = 'animal'; S.sel = null; armar('animal'); L.ctl(); }, 'tab', S.tipo === 'animal'); L.btn('🌿 Célula vegetal', function () { S.tipo = 'vegetal'; S.sel = null; armar('vegetal'); L.ctl(); }, 'tab', S.tipo === 'vegetal'); }
    if (L.paso === 3) L.quizBtns(S.ops || ['A', 'B', 'C']);
  },
  draw: function (L, g) {
    var S = L.S, W = L.W, H = L.H; L.fondo('agua', 0.6); if (V3) V3.mostrar(L.paso !== 3);
    if (L.paso === 3) { L.dibQuiz(null, '#cfe6ff'); return; }
    var hv = V3 && V3.hover && V3.hover !== S.sel ? V3.hover : null, mostrar = S.sel || hv;
    g.fillStyle = 'rgba(5,11,20,.82)'; g.fillRect(0, H - 74, W, 74); var tx = '', col = '#cfe6ff';
    if (L.paso === 1) { if (S.ok < 5 && S.pd) { tx = '¿Quién? «' + INFO[S.pd].f + '»'; col = '#ffe08a'; } if (S.msg) L.txt(S.msg, W / 2, 34, S.msg.indexOf('✔') > -1 ? '#8be8ae' : '#ff9f9f', 'center', 20); L.txt('Aciertos: ' + S.ok + ' / 5', 80, 34, '#9db8ff', 'center', 16); }
    else if (S.sel) tx = INFO[S.sel].f; else tx = L.paso === 0 ? 'Toca una parte de la célula (' + Object.keys(S.tocados).length + '/6) · arrastra para girar' : 'Célula ' + (S.tipo === 'animal' ? 'ANIMAL' : 'VEGETAL') + ': toca sus partes';
    L.wrap(tx, W / 2, H - 38, W - 60, 24, col, 18);
    if (mostrar && L.paso !== 1) { var inf = INFO[mostrar], w = 24 + inf.n.length * 11; g.fillStyle = 'rgba(5,11,20,.85)'; g.fillRect(W / 2 - w / 2, 16, w, 34); L.txt(inf.n, W / 2, 40, inf.c, 'center', 20); }
  },
  hooks: function (L) { return { tocar: function (k) { tocar(L, k); }, esperada: function () { return L.S.pd; }, correcta: function () { return L.q && !L.q.fin ? L.q.items[L.q.i].a : -1; }, resp: function (k) { L.quizResp(k); }, tipo: function (t) { L.S.tipo = t; armar(t); }, ok3d: function () { return !!V3; } }; }
});
function tocar(L, k) {
  var S = L.S; if (!k) { S.sel = null; return; }
  if (L.paso === 1) { if (S.ok >= 5) return; if (k === S.pd) { S.ok++; S.msg = '✔ ¡Correcto! Es ' + INFO[k].n; L.tono(740, 0.12, 0.15); L.chispas(L.W / 2, 150, '#8be8ae', 18); if (S.ok >= 5) L.cumplir(1); else nuevaPregunta(L, false); } else { S.msg = '✖ Ese es ' + INFO[k].n + '. Sigue buscando'; L.mal(); L.sacudir(5); } return; }
  S.sel = k; L.tono(520 + Object.keys(INFO).indexOf(k) * 40, 0.1, 0.15);
  if (L.paso === 0 && S.tipo === 'animal') { S.tocados[k] = 1; if (Object.keys(S.tocados).length >= 6) L.cumplir(0); }
  if (L.paso === 2 && S.tipo === 'vegetal') { S.t3[k] = 1; if (S.t3.pared && S.t3.cloro && S.t3.vacu) L.cumplir(2); }
}
function nuevaPregunta(L, primera) { var S = L.S, ks = ['nucleo', 'mito', 'ribo', 'golgi', 'liso', 'memb'].filter(function (k) { return k !== S.pd; }); S.pd = L.mezclar(ks)[0]; if (primera) S.msg = ''; }
function preg(L) {
  var it = [
    ['🧬 ¿Dónde está guardado el ADN?', ['A) En el núcleo', 'B) En la membrana', 'C) En el lisosoma'], 0, 'En el núcleo'],
    ['⚡ ¿Qué orgánulo produce la energía?', ['A) El ribosoma', 'B) La mitocondria', 'C) La vacuola'], 1, 'La mitocondria'],
    ['🌿 ¿Qué orgánulo hace la fotosíntesis?', ['A) El cloroplasto', 'B) El núcleo', 'C) El Golgi'], 0, 'El cloroplasto'],
    ['🧱 ¿Qué tienen las células vegetales y las animales NO?', ['A) Núcleo', 'B) Membrana', 'C) Pared celular'], 2, 'La pared celular'],
    ['🧹 ¿Qué orgánulo digiere los desechos?', ['A) El lisosoma', 'B) El ribosoma', 'C) El núcleo'], 0, 'El lisosoma'],
    ['🔬 La unidad más pequeña de un ser vivo es…', ['A) El átomo', 'B) La célula', 'C) El órgano'], 1, 'La célula']
  ];
  L.nuevoQuiz(it.map(function (x) { return { q: x[0] + '   ' + x[1].join('   '), e: '', a: x[2], fb: x[3] }; }), 5, 4); L.S.ops = ['A', 'B', 'C']; L.ctl(); }

/* ---------- célula 3D ---------- */
function iniciar3d() {
  var V = window.Vista3D ? Vista3D({ z: 8.2, fov: 40, auto: 0.18 }) : null; if (!V) return; V3 = V; V.grupo.rotation.x = 0.25;
  V.onPick = function (k) { tocar(LAB, k); }; C3 = { animal: new THREE.Group(), vegetal: new THREE.Group(), obj: {} }; construir(V, C3); V.grupo.add(C3.animal, C3.vegetal); armar('animal');
  V.anim(function (dt, t) { var S = LAB.S; Object.keys(C3.obj).forEach(function (id) { C3.obj[id].forEach(function (m) { var on = S.sel === m.userData.k || V.hover === m.userData.k || (LAB.paso === 1 && false); var mt = m.material; if (mt && mt.emissiveIntensity !== undefined) { mt.emissiveIntensity += ((on ? 0.95 : m.userData.e0) - mt.emissiveIntensity) * Math.min(1, dt * 10); } m.scale.copy(m.userData.b).multiplyScalar(on ? 1.07 + 0.03 * Math.sin(t * 8) : 1); }); }); C3.animal.children.forEach(function (c) { if (c.userData.flota) c.position.y = c.userData.y0 + Math.sin(t * 1.3 + c.userData.ph) * 0.05; }); });
}
function armar(tipo) { if (!C3) return; C3.animal.visible = tipo === 'animal'; C3.vegetal.visible = tipo === 'vegetal'; }
function construir(V, C) {
  var T = THREE, M = V.mat;
  function reg(grupo, tipo, k, mesh, e0, pickeable) { mesh.userData = { k: k, e0: e0 === undefined ? 0.25 : e0, b: mesh.scale.clone(), pick: pickeable !== false, flota: tipo === 'animal' && k !== 'memb' && k !== 'ribo' && k !== 'nucleo', y0: mesh.position.y, ph: Math.random() * 6 }; grupo.add(mesh); (C.obj[tipo] = C.obj[tipo] || []).push(mesh); return mesh; }
  function elipsoide(r, sx, sy, sz, mat) { var m = new T.Mesh(new T.SphereGeometry(r, 28, 20), mat); m.scale.set(sx, sy, sz); return m; }
  function transp(col, op) { return new T.MeshPhysicalMaterial({ color: col, transparent: true, opacity: op, roughness: 0.2, metalness: 0, emissive: col, emissiveIntensity: 0.18, depthWrite: false }); }
  // --- animal
  var A = C.animal;
  var memb = reg(A, 'animal', 'memb', new T.Mesh(new T.SphereGeometry(2.4, 40, 30), transp(0x6aa8ff, 0.16)), 0.18); memb.renderOrder = 5;
  var nuc = reg(A, 'animal', 'nucleo', new T.Mesh(new T.SphereGeometry(0.85, 32, 24), M(0x9b78e8, 0x4a2aa0)), 0.3); nuc.position.set(0.1, 0, 0); var nuc2 = new T.Mesh(new T.SphereGeometry(0.28, 20, 16), M(0x4b2fa0, 0x2a1070)); nuc2.position.set(0.25, 0.1, 0.55); nuc.add(nuc2);
  [[-1.4, 0.8, 0.5, 0.5], [1.4, -0.9, 0.6, -0.6], [0.3, 1.5, -0.8, 0.9]].forEach(function (p) { var m = elipsoide(0.42, 1.8, 0.8, 0.8, M(0xff8a5c, 0x7a2a10)); m.position.set(p[0], p[1], p[2]); m.rotation.z = p[3]; reg(A, 'animal', 'mito', m, 0.25); });
  for (var i = 0; i < 5; i++) { var gl = elipsoide(0.45, 1.5 - i * 0.08, 0.1, 0.7, M(0x7ff0e4, 0x1a8a80)); gl.position.set(1.4, 0.8 + i * 0.12 - 0.3, -0.9); gl.rotation.z = 0.5; reg(A, 'animal', 'golgi', gl, 0.25); }
  [[-1.0, -1.2, 0.8], [0.9, -1.4, -0.6], [-0.4, 1.3, 1.2]].forEach(function (p) { var l = new T.Mesh(new T.SphereGeometry(0.26, 18, 14), M(0xff6a9a, 0x8a1a44)); l.position.set(p[0], p[1], p[2]); reg(A, 'animal', 'liso', l, 0.25); });
  for (var r = 0; r < 70; r++) { var u = Math.random() * 6.283, v = Math.acos(2 * Math.random() - 1), rr = 1.25 + Math.random() * 0.8, b = new T.Mesh(new T.SphereGeometry(0.06, 8, 6), M(0xffd24a, 0x886a10)); b.position.set(rr * Math.sin(v) * Math.cos(u), rr * Math.sin(v) * Math.sin(u), rr * Math.cos(v)); reg(A, 'animal', 'ribo', b, 0.25); }
  // --- vegetal
  var B = C.vegetal;
  var pared = reg(B, 'vegetal', 'pared', new T.Mesh(new T.BoxGeometry(5.2, 3.3, 3.3), transp(0x4fd080, 0.14)), 0.2); pared.renderOrder = 5; var aristas = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(5.2, 3.3, 3.3)), new T.LineBasicMaterial({ color: 0x8be8ae })); pared.add(aristas);
  var vac = reg(B, 'vegetal', 'vacu', elipsoide(1, 2.0, 1.15, 1.2, transp(0x7ab8ff, 0.5)), 0.2); vac.position.set(0.4, 0, 0); vac.renderOrder = 4;
  var n2 = reg(B, 'vegetal', 'nucleo', new T.Mesh(new T.SphereGeometry(0.5, 24, 18), M(0x9b78e8, 0x4a2aa0)), 0.3); n2.position.set(-2.0, 0.9, 0.5);
  [[-1.8, -1.0, 0.8, 0.3], [0.6, 1.2, -0.9, 0], [2.0, -0.7, 0.4, -0.3], [-0.4, -1.2, -0.8, 0.2]].forEach(function (p) { var c = elipsoide(0.4, 1.4, 0.6, 0.8, M(0x4ccf6a, 0x1a6a2a)); c.position.set(p[0], p[1], p[2]); c.rotation.z = p[3]; reg(B, 'vegetal', 'cloro', c, 0.25); });
  [[2.0, 0.9, -0.6], [-0.9, 0.1, 1.2]].forEach(function (p) { var m = elipsoide(0.3, 1.8, 0.8, 0.8, M(0xff8a5c, 0x7a2a10)); m.position.set(p[0], p[1], p[2]); reg(B, 'vegetal', 'mito', m, 0.25); });
}
iniciar3d();
