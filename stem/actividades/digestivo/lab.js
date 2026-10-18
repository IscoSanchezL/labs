/* Sistema digestivo (5°, solo español, sin voz): órganos, orden del recorrido y un viaje animado de la comida. */
var ORG = [
  { k: 'boca', n: 'Boca', e: '👄', x: 480, y: 70, r: 44, f: 'Los dientes trituran la comida y la saliva empieza a digerir el almidón.', t: 'Masticar y mezclar con saliva' },
  { k: 'esofago', n: 'Esófago', e: '〰️', x: 480, y: 140, r: 28, f: 'Un tubo que lleva la comida al estómago con movimientos de olas llamados peristaltismo.', t: 'Empujar el bolo hacia abajo' },
  { k: 'estomago', n: 'Estómago', e: '🫃', x: 520, y: 205, r: 52, f: 'Mezcla la comida con jugos ácidos que la convierten en una papilla.', t: 'Mezclar con ácido (pH 2)' },
  { k: 'delgado', n: 'Intestino delgado', e: '🌀', x: 480, y: 305, r: 70, f: 'Aquí se absorben casi todos los nutrientes y pasan a la sangre.', t: 'Absorber los nutrientes' },
  { k: 'grueso', n: 'Intestino grueso', e: '🔲', x: 480, y: 305, r: 100, f: 'Absorbe el agua y forma las heces que se eliminan por el ano.', t: 'Absorber agua' }
];
var RUTA = [[480, 70], [480, 110], [480, 160], [520, 200], [530, 245], [470, 275], [540, 290], [450, 305], [540, 320], [470, 340], [430, 300], [440, 260], [520, 235], [560, 300], [540, 360], [480, 395], [480, 425]];
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
    var S = L.S, W = L.W, H = L.H, bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#2a0f14'); bg.addColorStop(1, '#0a0507'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    if (L.paso === 1) { L.dibQuiz(null, '#ffd9d9'); return; }
    // silueta
    g.fillStyle = 'rgba(255,200,180,.08)'; g.beginPath(); g.ellipse(480, 230, 190, 235, 0, 0, 7); g.fill(); g.strokeStyle = 'rgba(255,200,180,.25)'; g.lineWidth = 3; g.stroke();
    // intestino grueso (marco)
    g.strokeStyle = (S.sel === 'grueso' || (S.viaje && Math.floor(S.viaje.s) >= 11)) ? '#ffb347' : '#c97a5a'; g.lineWidth = 26; g.lineJoin = 'round'; g.beginPath(); g.moveTo(420, 380); g.lineTo(420, 255); g.lineTo(540, 255); g.lineTo(560, 380); g.stroke();
    // intestino delgado (zigzag)
    g.strokeStyle = S.sel === 'delgado' || (S.viaje && Math.floor(S.viaje.s) >= 5 && Math.floor(S.viaje.s) < 11) ? '#ff9ec0' : '#d4708f'; g.lineWidth = 16; g.beginPath(); for (var i = 0; i < 9; i++) { var yy = 275 + i * 10, xx = i % 2 ? 450 : 510; if (i) g.lineTo(xx, yy); else g.moveTo(xx, yy); } g.stroke();
    // esófago y estómago
    g.strokeStyle = S.sel === 'esofago' ? '#ffb3b3' : '#c26a6a'; g.lineWidth = 18; g.beginPath(); g.moveTo(480, 95); g.lineTo(480, 170); g.stroke();
    var st = g.createRadialGradient(515, 195, 6, 520, 205, 60); st.addColorStop(0, S.sel === 'estomago' ? '#ffd0a8' : '#e89a6a'); st.addColorStop(1, '#a8482a'); g.fillStyle = st; g.beginPath(); g.ellipse(520, 205, 52, 38, 0.5, 0, 7); g.fill();
    L.emoji('👄', 480, 70, 60);
    // etiquetas
    ORG.forEach(function (o, i) { if (L.paso === 0) { g.strokeStyle = S.sel === o.k ? '#7ff0e4' : 'rgba(127,240,228,.35)'; g.lineWidth = S.sel === o.k ? 4 : 2; g.setLineDash([5, 6]); g.beginPath(); g.arc(o.x, o.y, o.r, 0, 7); g.stroke(); g.setLineDash([]); if (S.vis[o.k]) L.txt('✔', o.x + o.r - 6, o.y - o.r + 8, '#8be8ae', 'center', 18); } });
    // comida
    if (S.viaje) { var s = S.viaje.s, i0 = Math.min(RUTA.length - 2, Math.floor(s)), f = s - i0, px = RUTA[i0][0] + (RUTA[i0 + 1][0] - RUTA[i0][0]) * f, py = RUTA[i0][1] + (RUTA[i0 + 1][1] - RUTA[i0][1]) * f; g.save(); g.shadowColor = '#ffe08a'; g.shadowBlur = 20; L.emoji(s < 4 ? '🍎' : '🟤', px, py, s < 4 ? 30 : 22); g.restore();
      var etapa = s < 2 ? ORG[0] : s < 3.5 ? ORG[1] : s < 5 ? ORG[2] : s < 11 ? ORG[3] : s < 15 ? ORG[4] : { n: 'Salida', t: 'Eliminar los desechos' }; L.txt(etapa.n + ': ' + etapa.t, 700, 160, '#ffe08a', 'center', 20); g.fillStyle = 'rgba(255,255,255,.15)'; g.fillRect(600, 190, 200, 16); g.fillStyle = '#8be8ae'; g.fillRect(600, 190, 200 * S.nutr / 100, 16); L.txt('Nutrientes a la sangre ' + Math.round(S.nutr) + ' %', 700, 232, '#cfe6ff', 'center', 15); if (S.viaje.fin) L.txt('✔ ¡Viaje completo!', 700, 290, '#8be8ae', 'center', 24); }
    else if (L.paso === 0) { if (S.sel) { var o = ORG.filter(function (x) { return x.k === S.sel; })[0]; L.txt(o.n, 760, 130, '#ffe08a', 'center', 26); L.wrap(o.f, 760, 190, 330, 26, '#ffe9e9', 18); } else L.txt('Toca un órgano (' + Object.keys(S.vis).length + '/5)', 760, 130, '#ffd9d9', 'center', 22); }
    else L.txt('Pulsa «¡Comer!» para ver el viaje', 740, 160, '#ffd9d9', 'center', 20);
  },
  hooks: function (L) { return { tocar: function (k) { L.S.sel = k; L.S.vis[k] = 1; if (Object.keys(L.S.vis).length >= 5) L.cumplir(0); }, correcta: function () { return L.q && !L.q.fin ? L.q.items[L.q.i].a : -1; }, resp: function (k) { L.quizResp(k); }, comer: function () { L.S.viaje = { s: 0, fin: false }; L.S.nutr = 0; } }; }
});
function preg(L) { L.nuevoQuiz([{ q: '¿Qué órgano recibe primero la comida?', e: '🍽️', a: 0, fb: 'La boca' }, { q: '¿Por dónde pasa la comida justo después de la boca?', e: '👄', a: 1, fb: 'Por el esófago' }, { q: '¿Qué órgano mezcla la comida con ácido?', e: '🫃', a: 2, fb: 'El estómago' }, { q: '¿Dónde se absorben casi todos los nutrientes?', e: '🥦', a: 3, fb: 'En el intestino delgado' }, { q: '¿Qué órgano absorbe el agua y forma las heces?', e: '💧', a: 4, fb: 'El intestino grueso' }, { q: '¿Qué viene justo después del estómago?', e: '➡️', a: 3, fb: 'El intestino delgado' }], 5, 4); }
document.getElementById('cv').addEventListener('click', function (e) { var L = LAB; if (L.paso !== 0) return; var q = L.xy(e), best = null, bd = 1e9; ORG.forEach(function (o) { var d = Math.hypot(q[0] - o.x, q[1] - o.y); var lim = o.r; if (d < lim && o.r < bd) { best = o; bd = o.r; } }); if (best) { L.S.sel = best.k; L.S.vis[best.k] = 1; L.tono(420 + ORG.indexOf(best) * 60, 0.1, 0.15); if (Object.keys(L.S.vis).length >= 5) L.cumplir(0); } });
