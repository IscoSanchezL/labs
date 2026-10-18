/* Engranajes (4°, solo español, sin voz): sentido de giro, relación de dientes y retos de velocidad. */
function engrane(g, x, y, r, n, ang, col, glow) {
  g.save(); g.translate(x, y); g.rotate(ang); if (glow) { g.shadowColor = '#7ff0e4'; g.shadowBlur = 22; } g.fillStyle = col; g.beginPath(); var d = r * 0.18;
  for (var i = 0; i < n; i++) { var a0 = i / n * 6.2832, a1 = (i + 0.5) / n * 6.2832; g.lineTo(Math.cos(a0 - 0.06) * r, Math.sin(a0 - 0.06) * r); g.lineTo(Math.cos(a0 + 0.02) * (r + d), Math.sin(a0 + 0.02) * (r + d)); g.lineTo(Math.cos(a1 - 0.08) * (r + d), Math.sin(a1 - 0.08) * (r + d)); g.lineTo(Math.cos(a1 + 0.02) * r, Math.sin(a1 + 0.02) * r); }
  g.closePath(); g.fill(); g.shadowBlur = 0; g.fillStyle = '#0a1424'; g.beginPath(); g.arc(0, 0, r * 0.28, 0, 7); g.fill(); g.strokeStyle = '#0a1424'; g.lineWidth = 6; for (var k = 0; k < 3; k++) { g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(k * 2.094) * r * 0.8, Math.sin(k * 2.094) * r * 0.8); g.stroke(); } g.restore();
}
var RETOS = [[2, 'el doble de rápido'], [0.5, 'a la mitad de velocidad'], [3, 'el triple de rápido'], [1, 'a la misma velocidad']];
var LAB = LabKit({
  reto: true, hook: '__eng',
  pasos: [
    { n: 'Giro contrario', t: '1. Los engranajes se empujan', x: 'Un <b>engranaje</b> es una rueda con dientes. Cuando sus dientes encajan con otro, lo hacen girar en <b>sentido contrario</b>. En una cadena de engranajes, cada uno gira al revés que su vecino.', m: 'Toca los 3 engranajes de la cadena para ver su sentido de giro.', d: 'Los relojes mecánicos tienen decenas de engranajes diminutos.' },
    { n: 'Velocidad y fuerza', t: '2. Pequeño y grande', x: 'Si un engranaje <b>pequeño</b> mueve a uno <b>grande</b>, el grande gira <b>más despacio</b> pero con <b>más fuerza</b>. Si uno grande mueve a uno pequeño, este gira <b>más rápido</b>. La relación es: dientes del motor ÷ dientes del movido.', m: 'Logra que el engranaje movido gire más rápido que el motor, y luego más lento.', d: 'Las bicicletas usan esto: el plato grande y el piñón pequeño dan velocidad; al revés, fuerza para subir.' },
    { n: 'Retos', t: '3. Elige los dientes', x: 'Ahora elige cuántos <b>dientes</b> ponerle al engranaje movido para lograr la velocidad que te piden.', m: 'Cumple 3 retos de velocidad (tolerancia del 5 %).', d: 'En un auto, la caja de cambios usa engranajes de distinto tamaño para cada velocidad.' }
  ],
  enter: function (L, n) { var S = L.S; S.rpm = 30; S.n1 = 20; S.n2 = 20; S.tocados = {}; S.vis = {}; S.reto = null; S.aciertos = 0; S.ang = 0; if (n === 2) { S.n1 = 20; S.n2 = 20; nuevo(L); } },
  ctl: function (L) {
    var S = L.S;
    if (L.paso === 0) L.rango('⚙️ Velocidad del motor (rpm)', 10, 60, 5, S.rpm, function (v) { S.rpm = v; });
    if (L.paso === 1) { L.rango('⚙️ Dientes del motor', 10, 40, 2, S.n1, function (v) { S.n1 = v; chequear(L); }); L.rango('⚙️ Dientes del movido', 10, 40, 2, S.n2, function (v) { S.n2 = v; chequear(L); }); }
    if (L.paso === 2) { L.rango('⚙️ Dientes del movido', 10, 40, 2, S.n2, function (v) { S.n2 = v; }); L.btn('✔ Probar', function () { probar(L); }, 'btn grande'); }
  },
  sim: function (L, dt) { var S = L.S; S.ang = (S.ang || 0) + (S.rpm || 30) / 60 * 6.2832 * dt * 0.5; },
  draw: function (L, g) {
    var S = L.S, W = L.W, H = L.H, bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0a1a2e'); bg.addColorStop(1, '#050b14'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    if (L.paso === 0) { var X = [230, 480, 730], N = [16, 16, 16], R = 80; X.forEach(function (x, i) { var dir = i % 2 ? -1 : 1; engrane(g, x, 230, R, 16, S.ang * dir + (i % 2 ? 0.2 : 0), S.tocados[i] ? (dir > 0 ? '#7ff0e4' : '#ffb347') : '#9db8ff', S.tocados[i]); if (S.tocados[i]) L.txt(dir > 0 ? '↻ horario' : '↺ antihorario', x, 360, dir > 0 ? '#7ff0e4' : '#ffb347', 'center', 20); }); L.txt('Toca cada engranaje · vistos ' + Object.keys(S.tocados).length + ' de 3', W / 2, 60, '#cfe6ff', 'center', 20); return; }
    var r1 = 5 * S.n1 * 0.55 + 10, r2 = 5 * S.n2 * 0.55 + 10, x1 = 280, x2 = x1 + r1 + r2 + 8, y = 230, w1 = S.ang, w2 = -S.ang * S.n1 / S.n2;
    // dientes encajados: rotación de fase
    engrane(g, x1, y, r1, S.n1, w1, '#7ff0e4', false); engrane(g, x2, y, r2, S.n2, w2 + Math.PI / S.n2, '#ffb347', false);
    L.txt('Motor: ' + S.n1 + ' dientes', x1, y + r1 + 50, '#7ff0e4', 'center', 18); L.txt('Movido: ' + S.n2 + ' dientes', x2, y + r2 + 50, '#ffb347', 'center', 18);
    var rpm2 = S.rpm * S.n1 / S.n2; g.fillStyle = 'rgba(5,11,20,.8)'; g.fillRect(560, 30, 360, 100); L.mono('Motor        ' + S.rpm + ' rpm', 580, 62, '#7ff0e4', 'left', 17); L.mono('Movido       ' + rpm2.toFixed(0) + ' rpm', 580, 90, '#ffb347', 'left', 17); L.mono('Relación     ' + (S.n1 / S.n2).toFixed(2) + ' : 1', 580, 118, '#cfe6ff', 'left', 17);
    L.txt(rpm2 > S.rpm * 1.05 ? '⚡ Más veloz, menos fuerza' : rpm2 < S.rpm * 0.95 ? '💪 Más lento, más fuerza' : 'Igual velocidad', 280, 60, '#ffe08a', 'center', 20);
    if (L.paso === 2 && S.reto) { L.txt('RETO: que el movido gire ' + S.reto[1], W / 2, H - 44, '#ffe08a', 'center', 22); L.txt(S.msj || ('Aciertos: ' + S.aciertos + ' de 3'), W / 2, H - 16, S.msj ? (S.msj.indexOf('✔') > -1 ? '#8be8ae' : '#ff9f9f') : '#9db8ff', 'center', 18); }
  },
  hooks: function (L) { return { tocar: function (i) { L.S.tocados[i] = 1; if (Object.keys(L.S.tocados).length >= 3) L.cumplir(0); }, n1: function (v) { L.S.n1 = v; chequear(L); }, n2: function (v) { L.S.n2 = v; chequear(L); }, reto: function () { return L.S.reto; }, probar: function () { probar(L); }, resolverReto: function () { L.S.n2 = Math.round(L.S.n1 / L.S.reto[0] / 2) * 2; } }; }
});
function chequear(L) { var S = L.S; if (L.paso !== 1) return; var f = S.n1 / S.n2; if (f > 1.15) S.vis.rapido = 1; if (f < 0.87) S.vis.lento = 1; if (S.vis.rapido && S.vis.lento) L.cumplir(1); }
function nuevo(L) { var S = L.S; var c = L.mezclar(RETOS).filter(function (r) { return !S.reto || r !== S.reto; })[0]; S.reto = c; S.msj = ''; S.n1 = 20; }
function probar(L) { var S = L.S, f = S.n1 / S.n2; if (Math.abs(f - S.reto[0]) / S.reto[0] <= 0.05) { S.aciertos++; S.msj = '✔ ¡Perfecto!'; L.tono(780, 0.15, 0.3); if (S.aciertos >= 3) L.cumplir(2); else setTimeout(function () { nuevo(L); }, 1300); } else { S.msj = '✖ Relación ' + f.toFixed(2) + ': piensa dientes del motor ÷ dientes del movido'; L.mal(); } }
document.getElementById('cv').addEventListener('click', function (e) { var L = LAB; if (L.paso !== 0) return; var q = L.xy(e); [230, 480, 730].forEach(function (x, i) { if (Math.hypot(q[0] - x, q[1] - 230) < 100) { L.S.tocados[i] = 1; L.tono(400 + i * 100, 0.1, 0.15); if (Object.keys(L.S.tocados).length >= 3) L.cumplir(0); } }); });
