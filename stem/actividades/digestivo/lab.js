/* Sistema digestivo (5°, solo español, sin voz): órganos, orden del recorrido y un viaje animado de la comida. */
var ORG = [
  { k: 'boca', n: 'Boca', e: '👄', x: 480, y: 70, r: 44, f: 'Los dientes trituran la comida y la saliva empieza a digerir el almidón.', t: 'Masticar y mezclar con saliva' },
  { k: 'esofago', n: 'Esófago', e: '〰️', x: 480, y: 140, r: 28, f: 'Un tubo que lleva la comida al estómago con movimientos de olas llamados peristaltismo.', t: 'Empujar el bolo hacia abajo' },
  { k: 'estomago', n: 'Estómago', e: '🫃', x: 520, y: 205, r: 52, f: 'Mezcla la comida con jugos ácidos que la convierten en una papilla.', t: 'Mezclar con ácido (pH 2)' },
  { k: 'delgado', n: 'Intestino delgado', e: '🌀', x: 480, y: 305, r: 70, f: 'Aquí se absorben casi todos los nutrientes y pasan a la sangre.', t: 'Absorber los nutrientes' },
  { k: 'grueso', n: 'Intestino grueso', e: '🔲', x: 480, y: 305, r: 100, f: 'Absorbe el agua y forma las heces que se eliminan por el ano.', t: 'Absorber agua' }
];
var RUTA = [[480, 70], [480, 110], [480, 160], [520, 200], [530, 245], [470, 275], [540, 290], [450, 305], [540, 320], [470, 340], [430, 300], [440, 260], [520, 235], [560, 300], [540, 360], [480, 395], [480, 425]];
var V3 = null, D3 = null;
var LAB = LabKit({
  reto: true, hook: '__dig',
  pasos: [
    { n: 'Los órganos', t: '1. El tubo de la digestión', x: 'La <b>digestión</b> transforma la comida en nutrientes pequeños que tu sangre puede llevar a todo el cuerpo. Ocurre en un largo tubo con varios órganos. Toca cada uno para descubrir qué hace.', m: 'Toca los 5 órganos del sistema digestivo.', d: 'El intestino delgado mide unos 6 metros: ¡más largo que una cama!' },
    { n: 'El orden', t: '2. ¿Por dónde pasa primero?', x: 'La comida sigue siempre el mismo camino: <b>boca → esófago → estómago → intestino delgado → intestino grueso</b>.', m: 'Responde 4 de 5 preguntas sobre el recorrido.', d: 'Todo el viaje dura entre 24 y 72 horas.' },
    { n: 'El viaje', t: '3. Sigue el bocado', x: 'Ahora mira el viaje de un bocado de comida. En cada órgano se ve qué le pasa y cuántos <b>nutrientes</b> pasan a tu sangre.', m: 'Haz el viaje completo hasta el final.', d: 'Los nutrientes absorbidos viajan por la sangre hasta cada célula de tu cuerpo.' }
  ],
  enter: function (L, n) { var S = L.S; S.sel = null; S.vis = {}; S.viaje = null; S.nutr = 0; if (n === 1) preg(L); },
  reintentar: function (L) { preg(L); },
  ctl: function (L) { var S = L.S; if (L.paso === 1) L.quizBtns(['👄 Boca', '〰️ Esófago', '🫃 Estómago', '🌀 I. delgado', '🔲 I. grueso']); if (L.paso === 2) L.btn('🍎 ¡Comer!', function () { S.viaje = { s: 0, fin: false }; S.nutr = 0; L.tono(300, 0.12, 0.2); }, 'btn grande'); },
  sim: function (L, dt) { var S = L.S; if (S.viaje && !S.viaje.fin) { S.viaje.s += dt * 0.9; if (S.viaje.s >= RUTA.length - 1) { S.viaje.s = RUTA.length - 1; S.viaje.fin = true; L.cumplir(2); } var i = Math.floor(S.viaje.s); if (i >= 5 && i <= 13) S.nutr = Math.min(100, S.nutr + dt * 12); } },
  draw: function (L, g) {
    var S = L.S, W = L.W, H = L.H; L.fondo('tierra');
    if (L.paso === 1) { L.dibQuiz(null, '#ffd9d9'); return; }
    // silueta
    g.fillStyle = 'rgba(255,200,180,.08)'; g.beginPath(); g.ellipse(480, 230, 190, 235, 0, 0, 7); g.fill(); g.strokeStyle = 'rgba(255,200,180,.25)'; g.lineWidth = 3; g.stroke();
    if (V3) V3.mostrar(L.paso !== 1);
    if (!V3) {
    // intestino grueso (marco)
    g.strokeStyle = (S.sel === 'grueso' || (S.viaje && Math.floor(S.viaje.s) >= 11)) ? '#ffb347' : '#c97a5a'; g.lineWidth = 26; g.lineJoin = 'round'; g.beginPath(); g.moveTo(420, 380); g.lineTo(420, 255); g.lineTo(540, 255); g.lineTo(560, 380); g.stroke();
    // intestino delgado (zigzag)
    g.strokeStyle = S.sel === 'delgado' || (S.viaje && Math.floor(S.viaje.s) >= 5 && Math.floor(S.viaje.s) < 11) ? '#ff9ec0' : '#d4708f'; g.lineWidth = 16; g.beginPath(); for (var i = 0; i < 9; i++) { var yy = 275 + i * 10, xx = i % 2 ? 450 : 510; if (i) g.lineTo(xx, yy); else g.moveTo(xx, yy); } g.stroke();
    // esófago y estómago
    g.strokeStyle = S.sel === 'esofago' ? '#ffb3b3' : '#c26a6a'; g.lineWidth = 18; g.beginPath(); g.moveTo(480, 95); g.lineTo(480, 170); g.stroke();
    var st = g.createRadialGradient(515, 195, 6, 520, 205, 60); st.addColorStop(0, S.sel === 'estomago' ? '#ffd0a8' : '#e89a6a'); st.addColorStop(1, '#a8482a'); g.fillStyle = st; g.beginPath(); g.ellipse(520, 205, 52, 38, 0.5, 0, 7); g.fill();
    L.emoji('👄', 480, 70, 60);
    }
    // etiquetas
    ORG.forEach(function (o, i) { if (L.paso === 0) { g.strokeStyle = S.sel === o.k ? '#7ff0e4' : 'rgba(127,240,228,.35)'; g.lineWidth = S.sel === o.k ? 4 : 2; g.setLineDash([5, 6]); g.beginPath(); g.arc(o.x, o.y, o.r, 0, 7); g.stroke(); g.setLineDash([]); if (S.vis[o.k]) L.txt('✔', o.x + o.r - 6, o.y - o.r + 8, '#8be8ae', 'center', 18); } });
    // comida
    if (S.viaje) { var s = S.viaje.s, i0 = Math.min(RUTA.length - 2, Math.floor(s)), f = s - i0, px = RUTA[i0][0] + (RUTA[i0 + 1][0] - RUTA[i0][0]) * f, py = RUTA[i0][1] + (RUTA[i0 + 1][1] - RUTA[i0][1]) * f; if (!V3) { g.save(); g.shadowColor = '#ffe08a'; g.shadowBlur = 20; L.emoji(s < 4 ? '🍎' : '🟤', px, py, s < 4 ? 30 : 22); g.restore(); }
      var etapa = s < 2 ? ORG[0] : s < 3.5 ? ORG[1] : s < 5 ? ORG[2] : s < 11 ? ORG[3] : s < 15 ? ORG[4] : { n: 'Salida', t: 'Eliminar los desechos' }; L.txt(etapa.n + ': ' + etapa.t, 700, 160, '#ffe08a', 'center', 20); g.fillStyle = 'rgba(255,255,255,.15)'; g.fillRect(600, 190, 200, 16); g.fillStyle = '#8be8ae'; g.fillRect(600, 190, 200 * S.nutr / 100, 16); L.txt('Nutrientes a la sangre ' + Math.round(S.nutr) + ' %', 700, 232, '#cfe6ff', 'center', 15); if (S.viaje.fin) L.txt('✔ ¡Viaje completo!', 700, 290, '#8be8ae', 'center', 24); }
    else if (L.paso === 0) { if (S.sel) { var o = ORG.filter(function (x) { return x.k === S.sel; })[0]; L.txt(o.n, 760, 130, '#ffe08a', 'center', 26); L.wrap(o.f, 760, 190, 330, 26, '#ffe9e9', 18); } else L.txt('Toca un órgano (' + Object.keys(S.vis).length + '/5)', 760, 130, '#ffd9d9', 'center', 22); }
    else L.txt('Pulsa «¡Comer!» para ver el viaje', 740, 160, '#ffd9d9', 'center', 20);
  },
  hooks: function (L) { return { tocar: function (k) { L.S.sel = k; L.S.vis[k] = 1; if (Object.keys(L.S.vis).length >= 5) L.cumplir(0); }, correcta: function () { return L.q && !L.q.fin ? L.q.items[L.q.i].a : -1; }, resp: function (k) { L.quizResp(k); }, comer: function () { L.S.viaje = { s: 0, fin: false }; L.S.nutr = 0; } }; }
});
function preg(L) { L.nuevoQuiz([{ q: '¿Qué órgano recibe primero la comida?', e: '🍽️', a: 0, fb: 'La boca' }, { q: '¿Por dónde pasa la comida justo después de la boca?', e: '👄', a: 1, fb: 'Por el esófago' }, { q: '¿Qué órgano mezcla la comida con ácido?', e: '🫃', a: 2, fb: 'El estómago' }, { q: '¿Dónde se absorben casi todos los nutrientes?', e: '🥦', a: 3, fb: 'En el intestino delgado' }, { q: '¿Qué órgano absorbe el agua y forma las heces?', e: '💧', a: 4, fb: 'El intestino grueso' }, { q: '¿Qué viene justo después del estómago?', e: '➡️', a: 3, fb: 'El intestino delgado' }], 5, 4); }
document.getElementById('cv').addEventListener('click', function (e) { var L = LAB; if (L.paso !== 0) return; var q = L.xy(e), best = null, bd = 1e9; ORG.forEach(function (o) { var d = Math.hypot(q[0] - o.x, q[1] - o.y); var lim = o.r; if (d < lim && o.r < bd) { best = o; bd = o.r; } }); if (best) { L.S.sel = best.k; L.S.vis[best.k] = 1; L.tono(420 + ORG.indexOf(best) * 60, 0.1, 0.15); if (Object.keys(L.S.vis).length >= 5) L.cumplir(0); } });

/* ---------- órganos 3D (sobre el mismo plano que el modelo 2D) ---------- */
function iniciar3d() {
  var V = window.Vista3D ? Vista3D({ z: 9, fov: 40, auto: 0, fijo: true }) : null; if (!V) return; V3 = V; var T = THREE, K = 0.01424;
  var X = function (x) { return (x - 480) * K; }, Y = function (y) { return (230 - y) * K; }, P = function (x, y, z) { return new T.Vector3(X(x), Y(y), z || 0); };
  function tubo(pts, r, col, cerrado) { var c = new T.CatmullRomCurve3(pts, cerrado); var m = new T.Mesh(new T.TubeGeometry(c, 120, r, 14, false), new T.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.25, roughness: 0.45 })); return m; }
  var org = {}; org.esofago = tubo([P(480, 95), P(480, 135), P(480, 175)], 0.12, 0xc26a6a);
  org.estomago = new T.Mesh(new T.SphereGeometry(1, 32, 24), new T.MeshStandardMaterial({ color: 0xe89a6a, emissive: 0xe89a6a, emissiveIntensity: 0.25, roughness: 0.4 })); org.estomago.scale.set(0.75, 0.5, 0.45); org.estomago.position.copy(P(520, 205)); org.estomago.rotation.z = -0.5;
  var zz = []; for (var i = 0; i < 9; i++) zz.push(P(i % 2 ? 450 : 510, 275 + i * 10, (i % 3) * 0.05)); org.delgado = tubo(zz, 0.1, 0xd4708f);
  org.grueso = tubo([P(420, 380), P(420, 255), P(540, 255), P(560, 380)], 0.17, 0xc97a5a);
  org.boca = new T.Mesh(new T.TorusGeometry(0.3, 0.12, 12, 24), new T.MeshStandardMaterial({ color: 0xff6a7a, emissive: 0xff3a4a, emissiveIntensity: 0.35, roughness: 0.4 })); org.boca.position.copy(P(480, 70)); org.boca.scale.set(1, 0.7, 1);
  var cuerpo = new T.Mesh(new T.SphereGeometry(1, 32, 24), new T.MeshBasicMaterial({ color: 0xffc8b4, transparent: true, opacity: 0.07, depthWrite: false })); cuerpo.scale.set(190 * K, 235 * K, 1.2); cuerpo.position.copy(P(480, 230)); V.grupo.add(cuerpo);
  Object.keys(org).forEach(function (k) { V.grupo.add(org[k]); });
  var bolo = new T.Mesh(new T.SphereGeometry(0.13, 18, 14), new T.MeshStandardMaterial({ color: 0xff5a4a, emissive: 0xffa04a, emissiveIntensity: 0.9 })); bolo.visible = false; V.grupo.add(bolo);
  var halo = new T.PointLight(0xffb060, 1.2, 3); bolo.add(halo);
  D3 = { org: org, bolo: bolo };
  V.anim(function (dt, t) {
    var L = LAB, S = L.S, viaje = S.viaje, s = viaje ? viaje.s : -1;
    var act = { boca: 'boca', esofago: 'esofago', estomago: 'estomago', delgado: 'delgado', grueso: 'grueso' };
    var viajeOrg = s < 0 ? null : s < 2 ? 'boca' : s < 3.5 ? 'esofago' : s < 5 ? 'estomago' : s < 11 ? 'delgado' : s < 15 ? 'grueso' : null;
    Object.keys(org).forEach(function (k) { var on = S.sel === k || viajeOrg === k, m = org[k].material; m.emissiveIntensity += ((on ? 1 : 0.25) - m.emissiveIntensity) * Math.min(1, dt * 10); });
    org.estomago.scale.set(0.75 * (1 + (viajeOrg === 'estomago' ? 0.06 * Math.sin(t * 8) : 0)), 0.5, 0.45); org.boca.rotation.y = 0.25 * Math.sin(t * 2);
    if (viaje) { var i0 = Math.min(RUTA.length - 2, Math.floor(s)), f = s - i0, px = RUTA[i0][0] + (RUTA[i0 + 1][0] - RUTA[i0][0]) * f, py = RUTA[i0][1] + (RUTA[i0 + 1][1] - RUTA[i0][1]) * f; bolo.visible = true; bolo.position.set(X(px), Y(py), 0.18); bolo.material.color.setHex(s < 4 ? 0xff5a4a : 0x8a5a3a); } else bolo.visible = false;
  });
  V.mostrar(LAB.paso !== 1);
}
iniciar3d();
