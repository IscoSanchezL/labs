/* Tabla periódica (6°, solo español, sin voz): explorar los 36 primeros elementos, familias y búsqueda por número atómico. */
var CAT = { alc: ['Metal alcalino', '#ff8a5c'], alt: ['Alcalinotérreo', '#ffc15c'], tra: ['Metal de transición', '#7fb8ff'], otm: ['Otro metal', '#9ad1c0'], mtl: ['Metaloide', '#b9a8ff'], nom: ['No metal', '#7fe39a'], hal: ['Halógeno', '#ffe08a'], nob: ['Gas noble', '#ff9ec0'] };
var EL = [
  ['H', 'Hidrógeno', 'nom', 'El más abundante del universo; combustible de las estrellas.'], ['He', 'Helio', 'nob', 'Gas liviano que hace flotar los globos.'],
  ['Li', 'Litio', 'alc', 'Se usa en las baterías de celulares.'], ['Be', 'Berilio', 'alt', 'Metal ligero y muy rígido.'], ['B', 'Boro', 'mtl', 'Se usa en vidrio resistente.'], ['C', 'Carbono', 'nom', 'Base de la vida; forma diamantes y grafito.'], ['N', 'Nitrógeno', 'nom', 'Es el 78 % del aire.'], ['O', 'Oxígeno', 'nom', 'Lo respiramos para vivir.'], ['F', 'Flúor', 'hal', 'Protege el esmalte de los dientes.'], ['Ne', 'Neón', 'nob', 'Brilla en los letreros luminosos.'],
  ['Na', 'Sodio', 'alc', 'Con el cloro forma la sal de mesa.'], ['Mg', 'Magnesio', 'alt', 'Arde con una luz blanca muy brillante.'], ['Al', 'Aluminio', 'otm', 'Ligero; se usa en latas y aviones.'], ['Si', 'Silicio', 'mtl', 'Base de los chips de computador.'], ['P', 'Fósforo', 'nom', 'Está en los huesos y el ADN.'], ['S', 'Azufre', 'nom', 'Amarillo; huele a huevo podrido en algunos compuestos.'], ['Cl', 'Cloro', 'hal', 'Desinfecta el agua de las piscinas.'], ['Ar', 'Argón', 'nob', 'Gas inerte dentro de bombillas.'],
  ['K', 'Potasio', 'alc', 'Abunda en el banano.'], ['Ca', 'Calcio', 'alt', 'Forma huesos y dientes fuertes.'],
  ['Sc', 'Escandio', 'tra', 'Se usa en equipos deportivos livianos.'], ['Ti', 'Titanio', 'tra', 'Fuerte y liviano: prótesis y aviones.'], ['V', 'Vanadio', 'tra', 'Hace más duro el acero.'], ['Cr', 'Cromo', 'tra', 'Da brillo a las llantas y grifos.'], ['Mn', 'Manganeso', 'tra', 'Refuerza el acero.'], ['Fe', 'Hierro', 'tra', 'Con él se hace el acero; está en tu sangre.'], ['Co', 'Cobalto', 'tra', 'Da color azul al vidrio.'], ['Ni', 'Níquel', 'tra', 'Se usa en monedas.'], ['Cu', 'Cobre', 'tra', 'Conduce muy bien la electricidad: cables.'], ['Zn', 'Zinc', 'tra', 'Protege el hierro de la oxidación.'],
  ['Ga', 'Galio', 'otm', 'Se derrite en tu mano.'], ['Ge', 'Germanio', 'mtl', 'Se usó en los primeros transistores.'], ['As', 'Arsénico', 'mtl', 'Es un veneno muy conocido.'], ['Se', 'Selenio', 'nom', 'Necesario en pequeñas cantidades para el cuerpo.'], ['Br', 'Bromo', 'hal', 'Es uno de los dos elementos líquidos a temperatura ambiente.'], ['Kr', 'Kriptón', 'nob', 'Gas noble usado en iluminación.']
];
function pos(z) { var i = z - 1; if (z === 1) return [0, 0]; if (z === 2) return [17, 0]; if (z <= 4) return [z - 3, 1]; if (z <= 10) return [z - 5 + 12, 1]; if (z <= 12) return [z - 11, 2]; if (z <= 18) return [z - 13 + 12, 2]; if (z <= 20) return [z - 19, 3]; if (z <= 30) return [z - 21 + 2, 3]; return [z - 31 + 12, 3]; }
var CW = 46, CH = 66, X0 = 70, Y0 = 130;
var V3 = null, B3 = null, zActual = 0;
var LAB = LabKit({
  reto: true, hook: '__tab',
  pasos: [
    { n: 'Explora', t: '1. El mapa de los elementos', x: 'Todo lo que existe está hecho de unos 118 <b>elementos químicos</b>. La <b>tabla periódica</b> los ordena por su <b>número atómico</b> (Z, la cantidad de protones) y los agrupa en <b>familias</b> con propiedades parecidas. Aquí verás los primeros 36.', m: 'Toca 8 elementos distintos y lee qué hacen.', d: 'La tabla la ordenó Dmitri Mendeléyev en 1869, ¡y hasta predijo elementos que aún no se habían descubierto!' },
    { n: 'Familias', t: '2. Metales, no metales y gases nobles', x: 'Los <b>metales</b> conducen la electricidad y brillan; los <b>no metales</b> no; los <b>metaloides</b> están en el medio; y los <b>gases nobles</b> casi no reaccionan con nada. Los colores de la tabla muestran las familias.', m: 'Clasifica 6 elementos: acierta al menos 5.', d: 'Los gases nobles están en la última columna de la derecha.' },
    { n: 'Búsqueda', t: '3. ¡Encuéntralo!', x: 'La tabla es como un mapa: el número atómico sube de izquierda a derecha y de arriba abajo. Busca el elemento que te piden tocándolo en la tabla.', m: 'Encuentra 4 de 5 elementos que te pidan.', d: 'Los elementos de una misma columna tienen propiedades parecidas.' }
  ],
  enter: function (L, n) { var S = L.S; S.sel = null; S.vis = {}; S.busq = null; S.rb = 0; S.okb = 0; S.mb = ''; if (n === 1) preg(L); if (n === 2) nuevaBusq(L); },
  reintentar: function (L) { if (L.paso === 1) preg(L); else { nuevaBusq(L); } },
  ctl: function (L) { if (L.paso === 1) L.quizBtns(['🧲 Metal', '💨 No metal', '💎 Metaloide', '🎈 Gas noble']); if (L.paso === 2 && L.S.rb >= 5 && L.S.okb < 4) L.btn('🔄 Reintentar', function () { nuevaBusq(L); L.ctl(); }, 'btn'); },
  draw: function (L, g) {
    var S = L.S, W = L.W, H = L.H; L.fondo('lab');
    if (V3) { V3.mostrar(L.paso === 0 && !!S.sel); if (L.paso === 0 && S.sel && S.sel !== zActual) bohr(S.sel); }
    if (L.paso === 1) { L.dibQuiz(null, '#fff'); var q = L.q; if (q && !q.fin) { var z = q.items[q.i].z; } return; }
    EL.forEach(function (e, i) { var z = i + 1, p = pos(z), x = X0 + p[0] * CW, y = Y0 + p[1] * CH, c = CAT[e[2]][1], sel = S.sel === z; g.fillStyle = c; g.globalAlpha = sel ? 1 : 0.8; if (sel) { g.shadowColor = '#fff'; g.shadowBlur = 20; } g.fillRect(x, y, CW - 3, CH - 3); g.shadowBlur = 0; g.globalAlpha = 1; g.fillStyle = '#0a1a2e'; g.font = '700 22px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'center'; g.fillText(e[0], x + CW / 2 - 1, y + 38); g.font = '600 11px "JetBrains Mono",monospace'; g.fillText(String(z), x + CW / 2 - 1, y + 16); if (S.vis[z]) { g.fillStyle = '#0a1a2e'; g.fillText('✔', x + CW - 12, y + 60); } });
    if (L.paso === 0 && S.sel) { var cp = capas(S.sel); L.txt('Modelo de Bohr · electrones por capa: ' + cp.join(' · '), 390, 150, '#cfe6ff', 'center', 13); }
    // leyenda
    var lx = 70; Object.keys(CAT).forEach(function (k, i) { var x = 70 + (i % 4) * 215, y = 20 + Math.floor(i / 4) * 24; g.fillStyle = CAT[k][1]; g.fillRect(x, y, 16, 16); L.txt(CAT[k][0], x + 22, y + 13, '#cfe6ff', 'left', 14); });
    if (L.paso === 0) { if (S.sel) { var e = EL[S.sel - 1]; g.fillStyle = 'rgba(5,11,20,.85)'; g.fillRect(70, 400, 820, 50); L.txt(e[0] + ' · ' + e[1] + ' · Z = ' + S.sel + ' · ' + CAT[e[2]][0], 90, 422, CAT[e[2]][1], 'left', 17); L.txt(e[3], 90, 443, '#cfe6ff', 'left', 14); } else L.txt('Toca un elemento (' + Object.keys(S.vis).length + '/8)', W / 2, 430, '#9db8ff', 'center', 18); }
    if (L.paso === 2 && S.busq) { g.fillStyle = 'rgba(5,11,20,.85)'; g.fillRect(70, 400, 820, 50); L.txt(S.rb < 5 ? 'Encuentra: ' + S.busq.t : (S.okb >= 4 ? '¡Muy bien! ' + S.okb + ' de 5' : 'Aciertos: ' + S.okb + ' de 5'), 90, 432, '#ffe08a', 'left', 20); L.txt(S.mb, 880, 432, S.mb.indexOf('✔') > -1 ? '#8be8ae' : '#ff9f9f', 'right', 16); }
  },
  hooks: function (L) { return { tocar: function (z) { clicZ(L, z); }, correcta: function () { return L.q && !L.q.fin ? L.q.items[L.q.i].a : -1; }, resp: function (k) { L.quizResp(k); }, busca: function () { return L.S.busq ? L.S.busq.z : -1; } }; }
});
function cuadro(z) { var c = EL[z - 1][2]; return c === 'nob' ? 3 : c === 'mtl' ? 2 : (c === 'nom' || c === 'hal') ? 1 : 0; }
function preg(L) { var zs = [11, 26, 8, 10, 14, 29, 17, 36, 6, 13]; L.nuevoQuiz(zs.map(function (z) { return { q: EL[z - 1][1] + ' (' + EL[z - 1][0] + '): ¿qué tipo de elemento es?', e: '', a: cuadro(z), fb: EL[z - 1][1] + ' es ' + CAT[EL[z - 1][2]][0].toLowerCase() }; }), 6, 5); }
function nuevaBusq(L) { var S = L.S; S.rb = 0; S.okb = 0; S.mb = ''; S.lista = L.mezclar([[26, 'el hierro (Fe), Z = 26'], [8, 'el oxígeno (O)'], [11, 'el sodio (Na)'], [29, 'el cobre (Cu)'], [17, 'el cloro (Cl)'], [20, 'el calcio (Ca)'], [14, 'el silicio (Si)'], [2, 'el helio (He), Z = 2']]).slice(0, 5); S.busq = { z: S.lista[0][0], t: S.lista[0][1] }; }
function clicZ(L, z) {
  var S = L.S; if (L.paso === 0) { S.sel = z; S.vis[z] = 1; L.tono(400 + z * 10, 0.1, 0.12); if (Object.keys(S.vis).length >= 8) L.cumplir(0); }
  else if (L.paso === 2 && S.rb < 5) { if (z === S.busq.z) { S.okb++; S.mb = '✔ ¡Ahí está!'; L.tono(740, 0.12, 0.15); } else { S.mb = '✖ Ese es ' + EL[z - 1][1]; L.mal(); } S.rb++; if (S.rb >= 5) { if (S.okb >= 4) L.cumplir(2); L.ctl(); } else S.busq = { z: S.lista[S.rb][0], t: S.lista[S.rb][1] }; }
}
document.getElementById('cv').addEventListener('click', function (e) { var L = LAB; if (L.paso === 1) return; var q = L.xy(e); for (var z = 1; z <= 36; z++) { var p = pos(z), x = X0 + p[0] * CW, y = Y0 + p[1] * CH; if (q[0] >= x && q[0] < x + CW && q[1] >= y && q[1] < y + CH) { clicZ(L, z); return; } } });

/* ---------- modelo de Bohr en 3D ---------- */
function capas(z) { var c = [Math.min(2, z)], r = z - c[0]; if (r > 0) { c.push(Math.min(8, r)); r -= c[1]; } if (r > 0) { if (z <= 20) { c.push(Math.min(8, r)); r -= c[2]; } else { var k = Math.min(18, z - 12 > 18 ? 18 : z - 12); c.push(k); r -= k; } } if (r > 0) c.push(r); return c; }
function iniciar3d() {
  var V = window.Vista3D ? Vista3D({ z: 9, fov: 40, auto: 0.25, fijo: true }) : null; if (!V) return; V3 = V; B3 = { g: new THREE.Group(), el: [] }; B3.g.position.set(-1.28, -0.1, 0); V.grupo.add(B3.g); V.mostrar(false);
  V.anim(function (dt, t) { B3.el.forEach(function (e) { e.a += dt * e.v; e.m.position.set(Math.cos(e.a) * e.r, Math.sin(e.a) * e.r * Math.cos(e.tilt), Math.sin(e.a) * e.r * Math.sin(e.tilt)); }); if (B3.nuc) B3.nuc.rotation.y += dt * 0.8; });
}
function bohr(z) {
  zActual = z; var V = V3, T = THREE, G = B3.g; while (G.children.length) G.remove(G.children[0]); B3.el = [];
  var n = Math.round(z * 1.1 + 0.5), nuc = new T.Group(), rN = 0.12 + Math.cbrt(z + n) * 0.07;
  for (var i = 0; i < z + n; i++) { var p = i < z, u = Math.random(), v = Math.random(), th = 2 * Math.PI * u, ph = Math.acos(2 * v - 1), rr = rN * Math.cbrt(Math.random()); var m = new T.Mesh(new T.SphereGeometry(0.07, 10, 8), V.mat(p ? 0xff5a5a : 0xaab4c8)); m.position.set(rr * Math.sin(ph) * Math.cos(th), rr * Math.sin(ph) * Math.sin(th), rr * Math.cos(ph)); nuc.add(m); }
  G.add(nuc); B3.nuc = nuc; var cp = capas(z);
  cp.forEach(function (k, s) { var R = 0.55 + s * 0.28 + Math.min(0, 0), tilt = s * 0.55; var anillo = new T.Mesh(new T.RingGeometry(R - 0.006, R + 0.006, 80), new T.MeshBasicMaterial({ color: 0x7fb8ff, transparent: true, opacity: 0.35, side: T.DoubleSide })); anillo.rotation.x = Math.PI / 2 - Math.PI / 2; anillo.rotation.y = Math.atan(Math.tan(tilt)) * 0; G.add(anillo);
    for (var j = 0; j < k; j++) { var e = new T.Mesh(new T.SphereGeometry(0.075, 12, 10), V.mat(0x6fe0ff, 0x2fb8ff)); G.add(e); B3.el.push({ m: e, a: j / k * Math.PI * 2, r: R, v: 1.8 / (1 + s * 0.8), tilt: 0 }); } });
}
iniciar3d();
