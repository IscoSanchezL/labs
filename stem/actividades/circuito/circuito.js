/* Circuito eléctrico (3°, solo español, sin voz): circuito cerrado, conductores y aislantes, bombillos en serie. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var cv = $('cv'), g = cv.getContext('2d'), W = cv.width, H = cv.height;
  var PASOS = [
    { n: 'Circuito cerrado', t: '1. La electricidad necesita un camino cerrado', x: 'La <b>pila</b> empuja la corriente por los cables. Para que el <b>bombillo</b> se encienda, el camino debe estar <b>cerrado</b>: sin huecos. El <b>interruptor</b> abre o cierra ese camino.', m: 'Cierra el interruptor para encender el bombillo, y ábrelo para apagarlo.', d: 'Cuando prendes la luz de tu casa estás cerrando un circuito.' },
    { n: 'Conductores y aislantes', t: '2. ¿Quién deja pasar la electricidad?', x: 'Los materiales <b>conductores</b> (como los metales) dejan pasar la electricidad. Los <b>aislantes</b> (como el plástico, la madera o la goma) la frenan. Pon un objeto en el hueco del circuito y mira si el bombillo enciende.', m: 'Prueba 6 objetos distintos: al menos 3 conductores y 3 aislantes.', d: 'Los cables son de metal por dentro y de plástico por fuera, para que no te dé corriente.' },
    { n: 'Más bombillos', t: '3. ¿Qué pasa con más bombillos?', x: 'Si pones varios bombillos <b>uno detrás de otro</b> (en serie), la energía de la pila se reparte entre todos y cada uno brilla <b>menos</b>. Si uno se quema o se quita, los demás también se apagan.', m: 'Prueba con 1, 2 y 3 bombillos y compara su brillo.', d: 'Las luces antiguas de Navidad eran en serie: si se fundía una, se apagaban todas.' }
  ];
  var OBJ = [
    { k: 'clip', n: 'Clip', e: '📎', c: 1 }, { k: 'moneda', n: 'Moneda', e: '🪙', c: 1 }, { k: 'cuchara', n: 'Cuchara', e: '🥄', c: 1 }, { k: 'llave', n: 'Llave', e: '🔑', c: 1 },
    { k: 'goma', n: 'Goma', e: '🧽', c: 0 }, { k: 'madera', n: 'Madera', e: '🪵', c: 0 }, { k: 'vaso', n: 'Vaso plástico', e: '🥤', c: 0 }, { k: 'tela', n: 'Tela', e: '🧦', c: 0 }
  ];
  var paso = 0, hecho = [false, false, false];
  var cerrado = false, objeto = null, probados = {}, nBomb = 1, vistosN = {}, tiempo = 0, msj = '';
  var ac = null;
  function tono(f, v, d, tp) { try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume(); var o = ac.createOscillator(), gn = ac.createGain(); o.type = tp || 'sine'; o.frequency.value = f; gn.gain.setValueAtTime(v, ac.currentTime); gn.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d); o.connect(gn); gn.connect(ac.destination); o.start(); o.stop(ac.currentTime + d); } catch (e) {} }
  function ex() { tono(660, 0.2, 0.2); setTimeout(function () { tono(880, 0.2, 0.3); }, 130); }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; ex(); if (window.STEMFX) STEMFX.exito(); pintar(); }
  var X1 = 150, X2 = 810, Y1 = 100, Y2 = 350;
  function pasa() { return paso === 1 ? !!(objeto && objeto.c) : cerrado; }
  function revisar() {
    if (paso === 0) { if (cerrado) vistosN.on = 1; else if (vistosN.on) vistosN.off = 1; if (vistosN.on && vistosN.off) cumplir(0); }
    if (paso === 1) { var cs = 0, as = 0; Object.keys(probados).forEach(function (k) { if (probados[k]) cs++; else as++; }); if (cs + as >= 6 && cs >= 3 && as >= 3) cumplir(1); }
    if (paso === 2 && cerrado) { vistosN[nBomb] = 1; if (vistosN[1] && vistosN[2] && vistosN[3]) cumplir(2); }
  }
  function ponerObjeto(o) { objeto = o; probados[o.k] = o.c; tono(o.c ? 740 : 200, 0.12, 0.2); msj = o.n + (o.c ? ': ¡CONDUCTOR! El bombillo enciende.' : ': AISLANTE. No pasa la electricidad.'); revisar(); ctl(); }
  /* camino del circuito: perímetro del rectángulo (sentido horario desde la pila) */
  function punto(s) {
    var P = [[X1, Y2], [X1, Y1], [X2, Y1], [X2, Y2], [X1, Y2]], L = [Y2 - Y1, X2 - X1, Y2 - Y1, X2 - X1], tot = 2 * (L[0] + L[1]), q = ((s % tot) + tot) % tot;
    for (var i = 0; i < 4; i++) { if (q <= L[i]) { var f = q / L[i]; return [P[i][0] + (P[i + 1][0] - P[i][0]) * f, P[i][1] + (P[i + 1][1] - P[i][1]) * f]; } q -= L[i]; }
    return P[0];
  }
  function cable(col, an, glow) { g.save(); g.strokeStyle = col; g.lineWidth = an; g.lineJoin = 'round'; if (glow) { g.shadowColor = col; g.shadowBlur = glow; } g.beginPath(); g.rect(X1, Y1, X2 - X1, Y2 - Y1); g.stroke(); g.restore(); }
  function bombillo(cx, cy, br) {
    if (br > 0) { var h = g.createRadialGradient(cx, cy, 6, cx, cy, 40 + br * 120); h.addColorStop(0, 'rgba(255,230,120,' + (0.25 + br * 0.55) + ')'); h.addColorStop(1, 'rgba(255,230,120,0)'); g.fillStyle = h; g.fillRect(cx - 200, cy - 200, 400, 400); }
    g.fillStyle = '#0b1830'; g.fillRect(cx - 54, cy - 18, 108, 36);
    g.fillStyle = br > 0 ? 'rgb(' + Math.round(90 + 165 * br) + ',' + Math.round(80 + 140 * br) + ',' + Math.round(90 + 30 * br) + ')' : '#35435e'; g.strokeStyle = '#cfe6ff'; g.lineWidth = 3;
    g.beginPath(); g.arc(cx, cy - 6, 26, 0, 7); g.fill(); g.stroke();
    g.strokeStyle = br > 0 ? '#fff' : '#7f90b0'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(cx - 9, cy + 18); g.lineTo(cx - 7, cy - 4); g.lineTo(cx, cy - 12); g.lineTo(cx + 7, cy - 4); g.lineTo(cx + 9, cy + 18); g.stroke();
  }
  function pila() { var cx = X1, cy = (Y1 + Y2) / 2; g.fillStyle = '#0b1830'; g.fillRect(cx - 30, cy - 52, 60, 104); var gr = g.createLinearGradient(cx - 24, 0, cx + 24, 0); gr.addColorStop(0, '#4fd1c5'); gr.addColorStop(1, '#9db8ff'); g.fillStyle = gr; g.fillRect(cx - 24, cy - 44, 48, 88); g.fillStyle = '#06121f'; g.font = '800 26px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'center'; g.fillText('+', cx, cy - 18); g.fillText('−', cx, cy + 34); }
  function dibujar(ms) {
    var dt = Math.min(0.05, (ms - (dibujar.l || ms)) / 1000); dibujar.l = ms; tiempo += dt;
    var bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0a1a2e'); bg.addColorStop(1, '#050b16'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.strokeStyle = 'rgba(127,240,228,.07)'; for (var x = 0; x < W; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (var y = 0; y < H; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    var on = pasa(), br = on ? (paso === 2 ? 1 / Math.pow(nBomb, 1.15) : 1) : 0;
    cable('#1b2c47', 12, 0); cable(on ? 'rgba(127,240,228,.7)' : '#3a4d70', 6, on ? 14 : 0);
    // electrones
    if (on) { var tot = 2 * ((Y2 - Y1) + (X2 - X1)); g.fillStyle = '#ffe08a'; for (var i = 0; i < 46; i++) { var p = punto(i * tot / 46 + tiempo * 110); g.globalAlpha = 0.95; g.shadowColor = '#ffd95e'; g.shadowBlur = 8; g.beginPath(); g.arc(p[0], p[1], 4.2, 0, 7); g.fill(); } g.shadowBlur = 0; g.globalAlpha = 1; }
    pila();
    // bombillos arriba
    var nb = paso === 2 ? nBomb : 1; for (var b = 0; b < nb; b++) bombillo(X1 + (X2 - X1) * (b + 1) / (nb + 1), Y1, br);
    // hueco abajo
    var cx = (X1 + X2) / 2, cy = Y2;
    g.fillStyle = '#050b16'; g.fillRect(cx - 80, cy - 14, 160, 28);
    if (paso === 1) {
      g.strokeStyle = '#ffe08a'; g.lineWidth = 3; g.setLineDash([6, 6]); g.strokeRect(cx - 74, cy - 28, 148, 56); g.setLineDash([]);
      g.fillStyle = '#cfe6ff'; g.beginPath(); g.arc(cx - 74, cy, 7, 0, 7); g.arc(cx + 74, cy, 7, 0, 7); g.fill();
      if (objeto) { g.font = '54px system-ui'; g.textAlign = 'center'; g.fillText(objeto.e, cx, cy + 18); }
      else { g.font = '600 15px "JetBrains Mono",monospace'; g.fillStyle = '#7fa6c8'; g.textAlign = 'center'; g.fillText('hueco: pon un objeto', cx, cy + 5); }
    } else {
      g.fillStyle = '#cfe6ff'; g.beginPath(); g.arc(cx - 60, cy, 8, 0, 7); g.arc(cx + 60, cy, 8, 0, 7); g.fill();
      g.strokeStyle = '#9db8ff'; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx - 60, cy); if (cerrado) g.lineTo(cx + 60, cy); else g.lineTo(cx + 40, cy - 46); g.stroke();
    }
    g.fillStyle = on ? '#8be8ae' : '#ff9f9f'; g.font = '700 22px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'center';
    g.fillText(paso === 1 ? (msj || 'Elige un objeto de abajo') : (on ? (paso === 2 ? 'Brillo: ' + Math.round(br * 100) + '%' : 'Circuito CERRADO ✔ pasa la corriente') : 'Circuito ABIERTO ✖ no pasa la corriente'), W / 2, 44);
    requestAnimationFrame(dibujar);
  }
  function ctl() {
    var c = $('ctl'); c.textContent = '';
    function btn(txt, fn, cls, pr) { var b = document.createElement('button'); b.type = 'button'; b.className = cls || 'btn sec'; b.textContent = txt; b.onclick = fn; if (pr !== undefined) b.setAttribute('aria-pressed', String(pr)); c.appendChild(b); }
    if (paso !== 1) btn(cerrado ? '🔓 Abrir interruptor' : '🔒 Cerrar interruptor', function () { cerrado = !cerrado; tono(cerrado ? 600 : 300, 0.12, 0.12, 'square'); revisar(); ctl(); }, 'btn grande');
    if (paso === 1) OBJ.forEach(function (o) { btn(o.e + ' ' + o.n + (probados[o.k] !== undefined ? ' ✓' : ''), function () { ponerObjeto(o); }, 'tab', objeto === o); });
    if (paso === 2) [1, 2, 3].forEach(function (n) { btn('💡 ' + n + (n === 1 ? ' bombillo' : ' bombillos') + (vistosN[n] ? ' ✓' : ''), function () { nBomb = n; revisar(); ctl(); }, 'tab', nBomb === n); });
  }
  function pintar() {
    var p = $('pasos'); p.textContent = '';
    PASOS.forEach(function (P, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === paso)); b.innerHTML = '<b>' + (hecho[i] ? '✓' : i + 1) + '</b>' + P.n; b.onclick = function () { ir(i); }; p.appendChild(b); });
    var P = PASOS[paso]; $('tit').textContent = P.t; $('txt').innerHTML = P.x; $('misTxt').textContent = hecho[paso] ? '¡Muy bien! Misión cumplida ✔' : P.m; $('dato').textContent = '💡 ' + P.d;
    $('mis').className = 'mision' + (hecho[paso] ? ' ok' : ''); $('bAnt').disabled = paso === 0; $('bSig').disabled = paso === 2; $('fin').className = 'fin' + (hecho.every(Boolean) ? ' v' : '');
  }
  function ir(n) { paso = n; objeto = null; msj = ''; if (n === 2) cerrado = true; ctl(); pintar(); revisar(); }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); }; $('bSig').onclick = function () { if (paso < 2) ir(paso + 1); };
  window.__circ = { ir: ir, interruptor: function (v) { cerrado = v; revisar(); }, objeto: function (k) { ponerObjeto(OBJ.filter(function (o) { return o.k === k; })[0]); }, bomb: function (n) { nBomb = n; revisar(); }, estado: function () { return { hecho: hecho.slice() }; } };
  ctl(); pintar(); requestAnimationFrame(dibujar);
})();
