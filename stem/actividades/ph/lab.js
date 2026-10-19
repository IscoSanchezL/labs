/* Ácidos y bases (4°, solo español, sin voz): escala de pH, clasificación y neutralización. */
var SUST = [['🍋', 'Limón', 2.2], ['🥛', 'Leche', 6.7], ['💧', 'Agua', 7], ['🧼', 'Jabón', 9.5], ['🍅', 'Tomate', 4.3], ['🧴', 'Cloro', 12.5], ['☕', 'Café', 5], ['🧪', 'Vinagre', 2.9], ['🥚', 'Clara de huevo', 8]];
function colPH(v) { var s = [[0, '#ff2a2a'], [2, '#ff6a2a'], [4, '#ffb02a'], [6, '#f2e84a'], [7, '#4fd16a'], [8, '#2fb8c4'], [10, '#3a6bff'], [12, '#7a3aff'], [14, '#5a1a9a']], i = 0; while (i < s.length - 2 && v > s[i + 1][0]) i++; var a = s[i], b = s[i + 1], t = Math.max(0, Math.min(1, (v - a[0]) / (b[0] - a[0]))); function h(x) { return [parseInt(x.substr(1, 2), 16), parseInt(x.substr(3, 2), 16), parseInt(x.substr(5, 2), 16)]; } var A = h(a[1]), B = h(b[1]); return 'rgb(' + A.map(function (c, k) { return Math.round(c + (B[k] - c) * t); }).join(',') + ')'; }
function tipo(v) { return v < 6.5 ? 0 : v > 7.5 ? 2 : 1; }
var V3 = null, P3 = { v: null, col: '#6a3a9a', p: 0 };
var LAB = LabKit({
  reto: true, hook: '__ph',
  pasos: [
    { n: 'Mide el pH', t: '1. La escala del pH', x: 'El <b>pH</b> dice qué tan <b>ácida</b> o <b>básica</b> es una sustancia, de 0 a 14. Menos de 7 es <b>ácida</b>, 7 es <b>neutra</b> (el agua pura) y más de 7 es <b>básica</b>. El jugo de repollo morado cambia de color según el pH.', m: 'Mide el pH de 6 sustancias distintas.', d: 'El jugo de repollo morado es un indicador natural: rojo en ácidos, verde-azul en bases.' },
    { n: 'Ácido, neutro o base', t: '2. Clasifica las sustancias', x: 'Los <b>ácidos</b> (limón, vinagre) tienen sabor agrio. Las <b>bases</b> (jabón, cloro) son resbalosas y amargas. Nunca pruebes ni mezcles productos de limpieza.', m: 'Clasifica 6 sustancias: acierta al menos 5.', d: 'Tu estómago tiene ácido para digerir la comida: ¡un pH de 1,5 a 3,5!' },
    { n: 'Neutraliza', t: '3. Neutralizar un ácido', x: 'Cuando mezclas un <b>ácido</b> con una <b>base</b> pueden neutralizarse y acercarse a pH 7. Por eso un antiácido calma la acidez del estómago.', m: 'Con el limón (ácido), agrega base hasta dejar el pH entre 6,8 y 7,2.', d: 'Pista: ¡cerca de la neutralidad el pH cambia muy rápido, ve despacio! Los agricultores echan cal al suelo ácido para neutralizarlo y que crezcan mejor las plantas.' }
  ],
  enter: function (L, n) { var S = L.S; S.sel = null; S.medidos = {}; S.base = 0; if (n === 1) L.nuevoQuiz(SUST.map(function (s) { return { q: s[1] + ': ¿ácido, neutro o base?', e: s[0], a: tipo(s[2]), fb: s[1] + ' tiene pH ' + s[2] }; }), 6, 5); },
  reintentar: function (L) { L.nuevoQuiz(SUST.map(function (s) { return { q: s[1] + ': ¿ácido, neutro o base?', e: s[0], a: tipo(s[2]), fb: s[1] + ' tiene pH ' + s[2] }; }), 6, 5); },
  ctl: function (L) {
    var S = L.S;
    if (L.paso === 0) SUST.forEach(function (s, i) { L.op(s[0], s[1], function () { S.sel = i; S.medidos[i] = 1; L.tono(400 + i * 40, 0.1, 0.15); if (Object.keys(S.medidos).length >= 6) L.cumplir(0); }); });
    if (L.paso === 1) L.quizBtns(['🍋 Ácido', '💧 Neutro', '🧼 Base']);
    if (L.paso === 2) L.rango('🧼 Base agregada (gotas)', 0, 40, 1, S.base, function (v) { S.base = v; var ph = phMezcla(S.base); if (ph >= 6.8 && ph <= 7.2) L.cumplir(2); });
  },
  draw: function (L, g) {
    var S = L.S, W = L.W, H = L.H; L.fondo('lab');
    // escala pH
    var sx = 90, sw = 780, sy = 60; for (var i = 0; i < 14; i++) { g.fillStyle = colPH(i + 0.5); g.fillRect(sx + i * sw / 14, sy, sw / 14, 26); L.txt(String(i), sx + (i + 0.5) * sw / 14, sy + 46, '#cfe6ff', 'center', 14); }
    L.txt('ÁCIDO', sx + 90, sy - 12, '#ff9f9f', 'center', 14); L.txt('NEUTRO', sx + sw / 2, sy - 12, '#8be8ae', 'center', 14); L.txt('BASE', sx + sw - 90, sy - 12, '#9db8ff', 'center', 14);
    var v = null, nombre = '', em = '';
    if (L.paso === 0 && S.sel !== null) { v = SUST[S.sel][2]; nombre = SUST[S.sel][1]; em = SUST[S.sel][0]; }
    if (L.paso === 2) { v = phMezcla(S.base); nombre = 'Limón + ' + S.base + ' gotas de base'; em = '🍋'; }
    if (L.paso === 1) { L.dibQuiz(null, '#cfe6ff'); return; }
    if (v !== null) { var mx = sx + v / 14 * sw; g.fillStyle = '#fff'; g.beginPath(); g.moveTo(mx, sy + 30); g.lineTo(mx - 9, sy + 52); g.lineTo(mx + 9, sy + 52); g.fill(); }
    // vaso
    var vx = 480, vy = 290, col = v === null ? '#6a3a9a' : colPH(v); if (V3) { V3.mostrar(L.paso !== 1); P3.v = v; P3.col = col; P3.p = L.paso; } else {
    g.fillStyle = 'rgba(255,255,255,.1)'; g.beginPath(); g.moveTo(vx - 90, vy - 130); g.lineTo(vx - 70, vy + 70); g.lineTo(vx + 70, vy + 70); g.lineTo(vx + 90, vy - 130); g.closePath(); g.fill();
    g.fillStyle = col; g.shadowColor = col; g.shadowBlur = 24; g.beginPath(); g.moveTo(vx - 84, vy - 60); g.lineTo(vx - 68, vy + 66); g.lineTo(vx + 68, vy + 66); g.lineTo(vx + 84, vy - 60); g.closePath(); g.fill(); g.shadowBlur = 0; g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 4; g.beginPath(); g.moveTo(vx - 90, vy - 130); g.lineTo(vx - 70, vy + 70); g.lineTo(vx + 70, vy + 70); g.lineTo(vx + 90, vy - 130); g.stroke();
    }
    if (v !== null) { L.emoji(em, vx, vy - 170 + Math.sin(L.t * 3) * 4, 54); L.txt(nombre, vx, vy + 112, '#fff', 'center', 22); L.txt('pH ' + v.toFixed(1) + ' · ' + ['ÁCIDO', 'NEUTRO', 'BASE'][tipo(v)], vx, vy + 142, colPH(v), 'center', 26); } else L.txt('Elige una sustancia para medir su pH', vx, vy + 112, '#9db8ff', 'center', 20);
    if (L.paso === 0) L.txt('Medidas: ' + Math.min(6, Object.keys(S.medidos).length) + ' de 6', 150, 430, '#9db8ff', 'center', 16);
  },
  hooks: function (L) { return { medir: function (i) { L.S.sel = i; L.S.medidos[i] = 1; if (Object.keys(L.S.medidos).length >= 6) L.cumplir(0); }, base: function (v) { L.S.base = v; var ph = phMezcla(v); if (ph >= 6.8 && ph <= 7.2) L.cumplir(2); }, correcta: function () { return L.q && !L.q.fin ? L.q.items[L.q.i].a : -1; }, resp: function (k) { L.quizResp(k); }, ph: function (v) { return phMezcla(v); } }; }
});
function phMezcla(b) { return Math.min(13, b <= 36 ? 2.2 + b * 0.12 : 6.52 + 0.5 * (b - 36)); }

/* ---------- vaso de precipitados 3D ---------- */
function iniciar3d() {
  var V = window.Vista3D ? Vista3D({ z: 9, fov: 40, auto: 0.25 }) : null; if (!V) return; V3 = V; var T = THREE, K = 0.01424; V.grupo.position.y = -0.9; V.grupo.rotation.x = 0.12;
  var vidrio = new T.Mesh(new T.CylinderGeometry(1.35, 1.12, 2.5, 48, 1, true), new T.MeshPhysicalMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.22, roughness: 0.05, metalness: 0, side: T.DoubleSide, depthWrite: false })); vidrio.position.y = 0.2; vidrio.renderOrder = 4;
  var fondo = new T.Mesh(new T.CylinderGeometry(1.12, 1.12, 0.08, 48), new T.MeshStandardMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.5, roughness: 0.1 })); fondo.position.y = -1.05;
  var liq = new T.Mesh(new T.CylinderGeometry(1.28, 1.08, 1.7, 48), new T.MeshStandardMaterial({ color: 0x6a3a9a, emissive: 0x6a3a9a, emissiveIntensity: 0.35, roughness: 0.2, transparent: true, opacity: 0.92 })); liq.position.y = -0.2;
  var sup = new T.Mesh(new T.CircleGeometry(1.28, 48), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 })); sup.rotation.x = -Math.PI / 2; sup.position.y = 0.65;
  var mesa = new T.Mesh(new T.CylinderGeometry(1.9, 1.9, 0.04, 48), new T.MeshBasicMaterial({ color: 0x06101c, transparent: true, opacity: 0.35 })); mesa.position.y = -1.12;
  var luz = new T.PointLight(0xffffff, 1.2, 8); luz.position.set(0, 0, 0);
  var brazo = new T.Mesh(new T.CylinderGeometry(0.05, 0.05, 2.2, 8), new T.MeshStandardMaterial({ color: 0xdddddd })); brazo.position.set(0.1, 0.4, 0); var gotero = new T.Mesh(new T.CylinderGeometry(0.1, 0.03, 0.6, 12), new T.MeshStandardMaterial({ color: 0xffd05c, emissive: 0x553a00 })); gotero.position.set(0, 2.0, 0);
  var gota = new T.Mesh(new T.SphereGeometry(0.07, 10, 8), new T.MeshBasicMaterial({ color: 0xcfe6ff })); gota.position.set(0, 1.7, 0); gota.visible = false;
  V.grupo.add(mesa, fondo, liq, sup, vidrio, luz, gotero, gota);
  var burb = []; for (var i = 0; i < 40; i++) { var b = new T.Mesh(new T.SphereGeometry(0.06, 8, 6), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 })); b.visible = false; V.grupo.add(b); burb.push({ m: b, v: 0, x: 0, z: 0 }); }
  var hi = 0, ult = 0, gv = 0; V.mostrar(false);
  V.anim(function (dt, t) {
    var S = LAB.S; if (LAB.paso === 1) return; var c = new T.Color(P3.col); liq.material.color.lerp(c, Math.min(1, dt * 6)); liq.material.emissive.lerp(c, Math.min(1, dt * 6)); luz.color.copy(liq.material.color);
    gotero.visible = LAB.paso === 2; if (LAB.paso === 2) { if (S.base !== ult) { gv = 0.7; ult = S.base; } gota.visible = gv > 0; if (gv > 0) { gv -= dt; gota.position.y = 1.7 - (0.7 - gv) * 3.2; } }
    var act = LAB.paso === 2 ? Math.min(1, (S.base || 0) / 36) : (P3.v === null ? 0 : 0.15); if (Math.random() < act * dt * 40) { var o = burb[hi++ % burb.length]; o.v = 1.2; o.x = (Math.random() - 0.5) * 1.6; o.z = (Math.random() - 0.5) * 1.6; o.m.position.set(o.x, -0.9, o.z); }
    burb.forEach(function (o) { if (o.v > 0) { o.v -= dt; o.m.visible = true; o.m.position.y += dt * 1.1; o.m.material.opacity = Math.min(0.7, o.v); } else o.m.visible = false; });
  });
  V.mostrar(LAB.paso !== 1);
}
iniciar3d();
