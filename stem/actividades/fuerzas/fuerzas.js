/* Fuerzas y movimiento (5°, solo español, sin voz): F = m·a, la masa y la fricción con un carro de laboratorio. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var cv = $('cv'), g = cv.getContext('2d'), W = cv.width, H = cv.height;
  var PASOS = [
    { n: 'Fuerza', t: '1. Más fuerza, más aceleración', x: 'Una <b>fuerza</b> que empuja cambia la velocidad de un objeto: lo <b>acelera</b>. Con el mismo carro, si empujas con el doble de fuerza, la aceleración se duplica. Así lo explica la segunda ley de Newton: <b>a = F / m</b>.', m: 'Empuja el carro con 3 fuerzas distintas (diferencia de al menos 4 N) y compara la aceleración.', d: 'La fuerza se mide en newtons (N), en honor a Isaac Newton.' },
    { n: 'Masa', t: '2. Más masa, menos aceleración', x: 'Con la misma fuerza, un carro más <b>pesado</b> (más masa) acelera menos. La masa mide cuánto se <b>resiste</b> un objeto a cambiar su movimiento. Esa resistencia se llama <b>inercia</b>.', m: 'Empuja con la misma fuerza carros de 3 masas distintas (diferencia de al menos 2 kg).', d: 'Es más fácil empujar un carrito de supermercado vacío que uno lleno.' },
    { n: 'Inercia y fricción', t: '3. ¿Qué pasa cuando dejas de empujar?', x: 'Sin fricción, el carro sigue moviéndose a la <b>misma velocidad</b> para siempre: es la primera ley de Newton (inercia). Con fricción, esta lo va frenando hasta que se detiene.', m: 'Haz una prueba sin fricción (carro que no se detiene) y otra con fricción alta (el carro se frena).', d: 'En el espacio casi no hay fricción: una nave no necesita motor encendido para seguir avanzando.' }
  ];
  var paso = 0, hecho = [false, false, false], vistos = {};
  var F = 10, M = 4, MU = 0, G = 9.8, T_EMPUJE = 2;
  var run = null, runs1 = [], runs2 = [];
  var ac = null;
  function tono(f, v, d) { try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume(); var o = ac.createOscillator(), gn = ac.createGain(); o.type = 'sine'; o.frequency.value = f; gn.gain.setValueAtTime(v, ac.currentTime); gn.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d); o.connect(gn); gn.connect(ac.destination); o.start(); o.stop(ac.currentTime + d); } catch (e) {} }
  function ex() { tono(660, 0.2, 0.2); setTimeout(function () { tono(880, 0.2, 0.3); }, 130); }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; ex(); pintar(); }
  function empujar() {
    run = { t: 0, x: 0, v: 0, a: 0, F: F, M: M, MU: paso === 2 ? MU : 0, pts: [], fin: false, vmaxPush: 0 };
    tono(240, 0.12, 0.2);
    if (paso === 0) { if (runs1.every(function (f) { return Math.abs(f - F) >= 4; })) runs1.push(F); if (runs1.length >= 3) cumplir(0); }
    if (paso === 1) { if (runs2.every(function (m) { return Math.abs(m - M) >= 2; })) runs2.push(M); if (runs2.length >= 3) cumplir(1); }
  }
  function simular(dt) {
    if (!run || run.fin) return;
    var r = run, fa = r.t < T_EMPUJE ? r.F : 0, fr = 0;
    if (r.v > 0.001) fr = r.MU * r.M * G;
    else if (fa <= r.MU * r.M * G) fr = fa; // no se mueve
    var neta = fa - fr; r.a = neta / r.M; r.v = Math.max(0, r.v + r.a * dt); r.x += r.v * dt; r.t += dt;
    if (r.t < T_EMPUJE) r.vmaxPush = r.v;
    if (r.pts.length === 0 || r.t - r.pts[r.pts.length - 1][0] > 0.05) r.pts.push([r.t, r.v]);
    if (paso === 2 && r.t > T_EMPUJE + 0.8) {
      if (r.MU === 0 && r.t > T_EMPUJE + 2.5 && Math.abs(r.v - r.vmaxPush) < 0.3) { vistos.sin = 1; }
      if (r.MU >= 0.25 && r.v < r.vmaxPush * 0.6) { vistos.con = 1; }
      if (vistos.sin && vistos.con) cumplir(2);
    }
    if (r.t > 9 || (r.t > T_EMPUJE && r.v <= 0.001)) { r.fin = true; r.a = 0; }
  }
  function txt(s, x, y, col, al, tam) { g.font = '600 ' + (tam || 16) + 'px "JetBrains Mono",monospace'; g.fillStyle = col || '#cfe6ff'; g.textAlign = al || 'left'; g.fillText(s, x, y); }
  function dibujar() {
    var bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#07131f'); bg.addColorStop(1, '#040a14'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    var x0 = run ? run.x : 0, PX = 70, camx = 260;
    // pista con marcas que se desplazan
    var py = 210; g.fillStyle = '#0d2236'; g.fillRect(0, py, W, 70); g.fillStyle = 'rgba(127,240,228,.35)'; g.fillRect(0, py, W, 3);
    g.strokeStyle = 'rgba(127,240,228,.35)'; g.lineWidth = 2; g.fillStyle = '#7fa6c8'; g.font = '600 13px "JetBrains Mono",monospace'; g.textAlign = 'center';
    for (var m = Math.floor(x0 - camx / PX) - 1; m < x0 + (W - camx) / PX + 1; m++) { var sx = camx + (m - x0) * PX; g.beginPath(); g.moveTo(sx, py + 3); g.lineTo(sx, py + 16); g.stroke(); if (m % 2 === 0 && m >= 0) g.fillText(m + ' m', sx, py + 36); }
    // líneas de velocidad
    if (run && run.v > 0.5) { g.strokeStyle = 'rgba(127,240,228,' + Math.min(.5, run.v / 14) + ')'; g.lineWidth = 2; for (var q = 0; q < 14; q++) { var lx = ((q * 97 - run.x * PX * 1.6) % W + W) % W, ly = 100 + (q * 53 % 100), ll = 20 + run.v * 6; g.beginPath(); g.moveTo(lx, ly); g.lineTo(lx + ll, ly); g.stroke(); } }
    // carro
    var mw = 70 + (run ? run.M : M) * 6; var cx = camx, cy = py - 10;
    g.fillStyle = '#7ff0e4'; var gr = g.createLinearGradient(0, cy - 44, 0, cy); gr.addColorStop(0, '#9db8ff'); gr.addColorStop(1, '#4fd1c5'); g.fillStyle = gr; g.beginPath(); g.roundRect ? g.roundRect(cx - mw / 2, cy - 46, mw, 40, 8) : g.rect(cx - mw / 2, cy - 46, mw, 40); g.fill();
    g.fillStyle = '#06121f'; g.beginPath(); g.arc(cx - mw / 2 + 16, cy - 2, 11, 0, 7); g.arc(cx + mw / 2 - 16, cy - 2, 11, 0, 7); g.fill(); g.strokeStyle = '#7ff0e4'; g.lineWidth = 2; g.stroke();
    txt((run ? run.M : M) + ' kg', cx, cy - 20, '#06121f', 'center', 17);
    // flecha de fuerza
    var empuja = run && !run.fin && run.t < T_EMPUJE, fv = run ? run.F : F;
    var alen = 18 + (empuja ? fv : fv * 0.6) * 6; g.globalAlpha = empuja ? 1 : 0.35; g.strokeStyle = '#ffe08a'; g.fillStyle = '#ffe08a'; g.lineWidth = 6; g.beginPath(); g.moveTo(cx - mw / 2 - alen - 6, cy - 26); g.lineTo(cx - mw / 2 - 6, cy - 26); g.stroke(); g.beginPath(); g.moveTo(cx - mw / 2 - 2, cy - 26); g.lineTo(cx - mw / 2 - 18, cy - 38); g.lineTo(cx - mw / 2 - 18, cy - 14); g.fill(); g.globalAlpha = 1;
    txt('F = ' + fv.toFixed(0) + ' N', cx - mw / 2 - alen / 2 - 10, cy - 52, '#ffe08a', 'center');
    if (run && run.MU > 0 && run.v > 0.01) { g.strokeStyle = '#ff9f9f'; g.lineWidth = 5; g.beginPath(); g.moveTo(cx + mw / 2 + 6, cy + 4); g.lineTo(cx + mw / 2 + 6 + 14 + run.MU * 80, cy + 4); g.stroke(); txt('fricción', cx + mw / 2 + 20, cy + 26, '#ff9f9f'); }
    // lecturas
    var a = run ? run.a : 0, v = run ? run.v : 0;
    txt('ACELERACIÓN  ' + a.toFixed(2) + ' m/s²', 24, 34, '#7ff0e4'); txt('VELOCIDAD     ' + v.toFixed(2) + ' m/s', 24, 58, '#c9a8ff'); txt('DISTANCIA     ' + (run ? run.x : 0).toFixed(1) + ' m', 24, 82, '#cfe6ff');
    if (paso < 2) txt('a = F / m = ' + fv.toFixed(0) + ' / ' + (run ? run.M : M) + ' = ' + (fv / (run ? run.M : M)).toFixed(2) + ' m/s²', W - 24, 34, '#ffe08a', 'right', 18);
    // gráfica v(t)
    var gx = 70, gy = 330, gw = W - 140, gh = 100;
    g.strokeStyle = 'rgba(127,240,228,.25)'; g.lineWidth = 1.5; g.strokeRect(gx, gy, gw, gh); txt('velocidad (m/s)', gx, gy - 8, '#7fa6c8', 'left', 13); txt('tiempo (s) →', gx + gw, gy + gh + 18, '#7fa6c8', 'right', 13);
    g.strokeStyle = 'rgba(255,224,138,.5)'; g.setLineDash([5, 5]); g.beginPath(); g.moveTo(gx + gw * T_EMPUJE / 9, gy); g.lineTo(gx + gw * T_EMPUJE / 9, gy + gh); g.stroke(); g.setLineDash([]); txt('suelta', gx + gw * T_EMPUJE / 9 + 4, gy + 14, '#ffe08a', 'left', 12);
    if (run && run.pts.length > 1) { var vm = 12; g.save(); g.strokeStyle = '#c9a8ff'; g.lineWidth = 3; g.shadowColor = '#c9a8ff'; g.shadowBlur = 10; g.beginPath(); run.pts.forEach(function (p, i) { var px = gx + gw * p[0] / 9, py2 = gy + gh - gh * Math.min(1, p[1] / vm); if (i) g.lineTo(px, py2); else g.moveTo(px, py2); }); g.stroke(); g.restore(); }
    if (!run) txt('Pulsa «Empujar» para lanzar el carro', W / 2, 160, '#7fa6c8', 'center', 18);
  }
  var last = 0;
  function frame(ms) { var dt = Math.min(0.05, (ms - last) / 1000); last = ms; simular(dt); dibujar(); requestAnimationFrame(frame); }
  function ctl() {
    var c = $('ctl'); c.textContent = '';
    function rango(etq, min, max, step, val, fn) { var l = document.createElement('label'); l.className = 'rango'; l.innerHTML = etq + ' <input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" aria-label="' + etq + '">'; l.querySelector('input').oninput = function (e) { fn(Number(e.target.value)); }; c.appendChild(l); }
    rango('➡️ Fuerza (N)', 2, 20, 1, F, function (v) { F = v; });
    rango('⚖️ Masa (kg)', 1, 10, 1, M, function (v) { M = v; });
    if (paso === 2) rango('🧱 Fricción', 0, 0.5, 0.05, MU, function (v) { MU = v; });
    var b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.textContent = '🚀 Empujar'; b.onclick = empujar; c.appendChild(b);
  }
  function pintar() {
    var p = $('pasos'); p.textContent = '';
    PASOS.forEach(function (P, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === paso)); b.innerHTML = '<b>' + (hecho[i] ? '✓' : i + 1) + '</b>' + P.n; b.onclick = function () { ir(i); }; p.appendChild(b); });
    var P = PASOS[paso]; $('tit').textContent = P.t; $('txt').innerHTML = P.x; $('misTxt').textContent = hecho[paso] ? '¡Muy bien! Misión cumplida ✔' : P.m; $('dato').textContent = '💡 ' + P.d;
    $('mis').className = 'mision' + (hecho[paso] ? ' ok' : ''); $('bAnt').disabled = paso === 0; $('bSig').disabled = paso === 2; $('fin').className = 'fin' + (hecho.every(Boolean) ? ' v' : '');
  }
  function ir(n) { paso = n; run = null; ctl(); pintar(); }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); }; $('bSig').onclick = function () { if (paso < 2) ir(paso + 1); };
  window.__fuerzas = { ir: ir, setF: function (v) { F = v; }, setM: function (v) { M = v; }, setMu: function (v) { MU = v; }, empujar: empujar, avanzar: function (s) { for (var i = 0; i < s * 40; i++) simular(0.025); }, estado: function () { return { hecho: hecho.slice(), a: run && run.a, v: run && run.v, vistos: vistos, vm: run && run.vmaxPush, mu: run && run.MU }; } };
  ctl(); pintar(); requestAnimationFrame(frame);
})();
