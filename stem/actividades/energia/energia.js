/* Energías renovables (5°, solo español, sin voz): solar, eólica y baterías para alimentar una ciudad durante 24 h. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var cv = $('cv'), g = cv.getContext('2d'), W = cv.width, H = cv.height;
  var PASOS = [
    { n: 'Energía solar', t: '1. Paneles solares', x: 'Un <b>panel solar</b> convierte la luz del sol en electricidad. Produce más cuando el sol está <b>alto</b> y no hay nubes; de <b>noche no produce nada</b>.', m: 'Con el sol de mediodía y 8 o más paneles, cubre la demanda de la ciudad. Luego pon la hora de noche y observa.', d: 'Una ciudad entera puede funcionar con luz solar, pero necesita guardar energía para la noche.' },
    { n: 'Energía eólica', t: '2. Turbinas de viento', x: 'El viento hace girar las <b>aspas</b> de una turbina y un generador produce electricidad. Si el viento se duplica, la energía se multiplica por <b>ocho</b>: ¡importa mucho que haya viento fuerte!', m: 'Con viento fuerte (más de 70%) y 4 o más turbinas cubre la demanda. Luego prueba con poco viento.', d: 'Las turbinas se frenan solas cuando el viento es demasiado fuerte para protegerse.' },
    { n: 'Ciudad 24 horas', t: '3. Mantén las luces 24 horas', x: 'El sol y el viento cambian durante el día. Las <b>baterías</b> guardan la energía que sobra para usarla cuando falta. Combina paneles, turbinas y baterías para que la ciudad <b>nunca se quede a oscuras</b>.', m: 'Diseña tu central y pulsa «Simular 24 h»: consigue 0 apagones.', d: 'Muchos países ya producen más de la mitad de su electricidad con energías renovables.' }
  ];
  var paso = 0, hecho = [false, false, false], vistos = {};
  var P = 6, T = 3, B = 4, HORA = 12, NUBES = 0.1, VIENTO = 0.5;
  var sim = null, tiempo = 0, giro = 0;
  var ac = null;
  function tono(f, v, d) { try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume(); var o = ac.createOscillator(), gn = ac.createGain(); o.type = 'sine'; o.frequency.value = f; gn.gain.setValueAtTime(v, ac.currentTime); gn.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d); o.connect(gn); gn.connect(ac.destination); o.start(); o.stop(ac.currentTime + d); } catch (e) {} }
  function ex() { tono(660, 0.2, 0.2); setTimeout(function () { tono(880, 0.2, 0.3); }, 130); }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; ex(); pintar(); }
  /* modelo (kW) */
  function solar(h, nub, p) { var s = Math.max(0, Math.sin(Math.PI * (h - 6) / 12)); return p * 12 * s * (1 - 0.75 * nub); }
  function eolica(w, t) { var v = Math.min(1, w); var f = v < 0.12 ? 0 : v > 0.95 ? 0.85 : Math.pow(v, 3); return t * 28 * f * 1.6; }
  function viento24(h) { return Math.max(0, Math.min(1, 0.5 + 0.28 * Math.sin(h / 24 * 6.2832 * 2 + 1) + 0.15 * Math.sin(h * 0.9))); }
  function nubes24(h) { return 0.15 + 0.1 * Math.sin(h * 0.5); }
  function demanda(h) { return 62 + 26 * Math.exp(-Math.pow((h - 19.5) / 2.2, 2)) + 14 * Math.exp(-Math.pow((h - 8) / 1.6, 2)) - 16 * Math.exp(-Math.pow((h - 3.5) / 2.5, 2)); }
  function valores() {
    if (paso === 2) { var h = sim ? sim.h : HORA; return { h: h, s: solar(h, nubes24(h), P), w: eolica(viento24(h), T), d: demanda(h), vi: viento24(h), nu: nubes24(h) }; }
    return { h: HORA, s: solar(HORA, NUBES, P), w: eolica(VIENTO, T), d: demanda(HORA), vi: VIENTO, nu: NUBES };
  }
  function revisar() {
    var v = valores();
    if (paso === 0) { if (HORA >= 10 && HORA <= 14 && NUBES < 0.35 && P >= 8 && v.s >= v.d) vistos.dia = 1; if (HORA <= 5 || HORA >= 21) vistos.noche = 1; if (vistos.dia && vistos.noche) cumplir(0); }
    if (paso === 1) { if (VIENTO > 0.7 && T >= 4 && v.w >= v.d) vistos.fuerte = 1; if (VIENTO < 0.2) vistos.calma = 1; if (vistos.fuerte && vistos.calma) cumplir(1); }
  }
  function simular() { sim = { h: 0, bat: B * 0.5 * 40, cap: B * 40, apagones: 0, hist: [], fin: false, apag: false }; tono(300, 0.1, 0.15); }
  function paso24(dt) {
    var s = sim; if (!s || s.fin) return; var h = s.h, sol = solar(h, nubes24(h), P), eo = eolica(viento24(h), T), d = demanda(h), gen = sol + eo, dif = (gen - d) * dt;
    if (dif >= 0) { s.bat = Math.min(s.cap, s.bat + dif); s.apag = false; } else { if (s.bat + dif >= 0) { s.bat += dif; s.apag = false; } else { s.bat = 0; if (!s.apag) { s.apagones++; tono(150, 0.18, 0.3); } s.apag = true; } }
    s.hist.push([h, sol, eo, d]); s.h += dt; if (s.h >= 24) { s.h = 24; s.fin = true; if (s.apagones === 0) cumplir(2); }
  }
  function txt(s, x, y, col, al, tam) { g.font = '600 ' + (tam || 15) + 'px "JetBrains Mono",monospace'; g.fillStyle = col || '#cfe6ff'; g.textAlign = al || 'left'; g.fillText(s, x, y); }
  function dibujar(ms) {
    var dt = Math.min(0.05, (ms - (dibujar.l || ms)) / 1000); dibujar.l = ms; tiempo += dt;
    if (paso === 2 && sim && !sim.fin) paso24(dt * 1.2);
    var v = valores(), h = v.h, dia = Math.max(0, Math.sin(Math.PI * (h - 6) / 12)), cob = Math.min(1.2, (v.s + v.w) / v.d);
    giro += dt * (0.5 + v.vi * 7);
    // cielo
    var gr = g.createLinearGradient(0, 0, 0, 300), c0 = [Math.round(8 + 80 * dia), Math.round(14 + 140 * dia), Math.round(40 + 190 * dia)], c1 = [Math.round(20 + 130 * dia), Math.round(30 + 160 * dia), Math.round(70 + 150 * dia)];
    gr.addColorStop(0, 'rgb(' + c0 + ')'); gr.addColorStop(1, 'rgb(' + c1 + ')'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    if (dia < 0.4) { g.fillStyle = 'rgba(255,255,255,' + (0.8 - dia * 2) + ')'; for (var i = 0; i < 50; i++) g.fillRect((i * 137) % W, (i * 53) % 220, 1.8, 1.8); }
    var ang = Math.PI * (h - 6) / 12, sx = 480 - Math.cos(ang) * 420, sy = 300 - Math.sin(ang) * 230;
    if (h >= 5.5 && h <= 18.5) { var hl = g.createRadialGradient(sx, sy, 5, sx, sy, 110); hl.addColorStop(0, 'rgba(255,230,140,.7)'); hl.addColorStop(1, 'rgba(255,230,140,0)'); g.fillStyle = hl; g.fillRect(sx - 120, sy - 120, 240, 240); g.fillStyle = '#ffd95e'; g.beginPath(); g.arc(sx, sy, 24, 0, 7); g.fill(); }
    else { var mx = 480 - Math.cos(ang + Math.PI) * 420, my = 300 - Math.sin(ang + Math.PI) * 230; g.fillStyle = '#e9efff'; g.beginPath(); g.arc(mx, my, 16, 0, 7); g.fill(); }
    // nubes
    var nc = v.nu; g.fillStyle = 'rgba(' + Math.round(240 - nc * 90) + ',' + Math.round(244 - nc * 90) + ',255,' + (0.25 + nc * 0.65) * (0.35 + dia * 0.65) + ')'; for (var k = 0; k < 5; k++) { var cx = ((k * 220 + tiempo * 10 * (0.5 + v.vi)) % (W + 200)) - 100, cy = 70 + (k % 3) * 40; g.beginPath(); g.arc(cx, cy, 30 + nc * 20, 0, 7); g.arc(cx + 34, cy + 6, 24 + nc * 14, 0, 7); g.arc(cx - 30, cy + 8, 20 + nc * 12, 0, 7); g.fill(); }
    // suelo
    g.fillStyle = 'rgb(' + Math.round(30 + 30 * dia) + ',' + Math.round(60 + 50 * dia) + ',' + Math.round(48 + 20 * dia) + ')'; g.fillRect(0, 300, W, H - 300);
    g.fillStyle = 'rgba(0,0,0,.18)'; g.beginPath(); g.moveTo(0, 300); for (var q = 0; q <= W; q += 40) g.lineTo(q, 290 - 18 * Math.abs(Math.sin(q * 0.013))); g.lineTo(W, 300); g.fill();
    // paneles
    for (var p = 0; p < 12; p++) { var px = 40 + (p % 4) * 70, py = 330 + Math.floor(p / 4) * 38, on = p < P; g.globalAlpha = on ? 1 : 0.18; var gp = g.createLinearGradient(px, py, px + 56, py + 28); gp.addColorStop(0, '#2a4f9a'); gp.addColorStop(1, dia > 0.3 ? '#7fb0ff' : '#1a2f5c'); g.fillStyle = gp; g.beginPath(); g.moveTo(px + 8, py); g.lineTo(px + 62, py); g.lineTo(px + 54, py + 28); g.lineTo(px, py + 28); g.closePath(); g.fill(); g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 1; g.beginPath(); g.moveTo(px + 28, py); g.lineTo(px + 22, py + 28); g.stroke(); }
    g.globalAlpha = 1;
    // turbinas
    for (var t = 0; t < 6; t++) { var tx = 350 + t * 52, ty = 300 - (t % 2) * 8, on2 = t < T; g.globalAlpha = on2 ? 1 : 0.18; g.strokeStyle = '#dfe9f7'; g.lineWidth = 4; g.beginPath(); g.moveTo(tx, ty); g.lineTo(tx, ty - 78); g.stroke(); g.save(); g.translate(tx, ty - 78); g.rotate(on2 && v.vi > 0.12 ? giro + t : 0.4 * t); g.strokeStyle = '#f4f8ff'; g.lineWidth = 5; g.lineCap = 'round'; for (var b = 0; b < 3; b++) { g.rotate(Math.PI * 2 / 3); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -40); g.stroke(); } g.restore(); }
    g.globalAlpha = 1;
    // ciudad
    var enc = Math.min(1, cob), hs = [[690, 60, 90], [750, 50, 120], [805, 56, 76], [860, 48, 104], [905, 44, 66]];
    hs.forEach(function (c, i) { g.fillStyle = '#1a2640'; g.fillRect(c[0], 300 - c[2] + 40, c[1], c[2] - 40 + 60 * 0); for (var wy = 0; wy < c[2] / 22 - 1; wy++) for (var wx = 0; wx < 2; wx++) { var lit = ((i * 7 + wy * 3 + wx * 5) % 10) / 10 < enc; g.fillStyle = lit ? 'rgba(255,224,130,.95)' : 'rgba(40,52,80,.9)'; g.fillRect(c[0] + 8 + wx * (c[1] / 2 - 4), 300 - c[2] + 52 + wy * 22, 12, 12); } });
    // tarjetas de energía
    g.fillStyle = 'rgba(5,11,20,.72)'; g.fillRect(10, 10, 276, 100); txt('☀️ Solar     ' + v.s.toFixed(0) + ' kW', 22, 36, '#ffe08a'); txt('💨 Eólica    ' + v.w.toFixed(0) + ' kW', 22, 60, '#7ff0e4'); txt('🏙️ Demanda   ' + v.d.toFixed(0) + ' kW', 22, 84, '#ffb3c6');
    txt('Hora ' + String(Math.floor(h)).padStart(2, '0') + ':' + String(Math.floor((h % 1) * 60)).padStart(2, '0'), 22, 104, '#cfe6ff', 'left', 13);
    var okb = cob >= 1; g.fillStyle = okb ? 'rgba(60,160,100,.85)' : 'rgba(180,60,70,.85)'; g.fillRect(W - 250, 10, 240, 40); txt(okb ? '✔ Ciudad alimentada' : '✖ Falta energía (' + Math.round(cob * 100) + '%)', W - 130, 36, '#fff', 'center', 16);
    if (paso === 2) {
      var cap = B * 40; g.fillStyle = 'rgba(5,11,20,.72)'; g.fillRect(W - 250, 56, 240, 140); txt('🔋 Batería', W - 238, 80, '#cfe6ff'); g.strokeStyle = '#cfe6ff'; g.lineWidth = 2; g.strokeRect(W - 238, 88, 216, 18); var f = sim && cap ? sim.bat / cap : (cap ? 0.5 : 0); g.fillStyle = f > 0.25 ? '#8be8ae' : '#ff7a7a'; g.fillRect(W - 236, 90, 212 * f, 14);
      txt('Apagones: ' + (sim ? sim.apagones : 0), W - 238, 134, sim && sim.apagones ? '#ff9f9f' : '#8be8ae');
      if (sim && sim.hist.length > 1) { var gx = W - 238, gy = 144, gw = 216, gh = 44; g.strokeStyle = 'rgba(255,255,255,.2)'; g.strokeRect(gx, gy, gw, gh); [[1, '#ffe08a'], [2, '#7ff0e4']].forEach(function (c) { g.strokeStyle = c[1]; g.lineWidth = 1.5; g.beginPath(); sim.hist.forEach(function (r, i) { var X = gx + gw * r[0] / 24, Y = gy + gh - Math.min(1, r[c[0]] / 140) * gh; if (i) g.lineTo(X, Y); else g.moveTo(X, Y); }); g.stroke(); }); g.strokeStyle = '#ffb3c6'; g.lineWidth = 2; g.beginPath(); for (var hh = 0; hh <= 24; hh += 0.5) { var X2 = gx + gw * hh / 24, Y2 = gy + gh - Math.min(1, demanda(hh) / 140) * gh; if (hh) g.lineTo(X2, Y2); else g.moveTo(X2, Y2); } g.stroke(); }
      if (sim && sim.fin) { g.fillStyle = 'rgba(5,11,20,.82)'; g.fillRect(230, 150, 400, 56); txt(sim.apagones === 0 ? '🎉 ¡24 horas sin apagones!' : 'Hubo ' + sim.apagones + ' apagón(es): más baterías o más generación', 430, 186, sim.apagones === 0 ? '#8be8ae' : '#ffb3b3', 'center', 18); }
    }
    revisar(); requestAnimationFrame(dibujar);
  }
  function ctl() {
    var c = $('ctl'); c.textContent = '';
    function rango(etq, min, max, step, val, fn) { var l = document.createElement('label'); l.className = 'rango'; l.innerHTML = etq + ' <input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" aria-label="' + etq + '">'; l.querySelector('input').oninput = function (e) { fn(Number(e.target.value)); }; c.appendChild(l); }
    if (paso === 0) { rango('🕐 Hora', 0, 24, 0.5, HORA, function (v) { HORA = v; }); rango('☁️ Nubes', 0, 1, 0.05, NUBES, function (v) { NUBES = v; }); rango('🔲 Paneles', 0, 12, 1, P, function (v) { P = v; }); }
    if (paso === 1) { rango('💨 Viento', 0, 1, 0.05, VIENTO, function (v) { VIENTO = v; }); rango('🌀 Turbinas', 0, 6, 1, T, function (v) { T = v; }); }
    if (paso === 2) { rango('🔲 Paneles', 0, 12, 1, P, function (v) { P = v; }); rango('🌀 Turbinas', 0, 6, 1, T, function (v) { T = v; }); rango('🔋 Baterías', 0, 10, 1, B, function (v) { B = v; }); var b = document.createElement('button'); b.type = 'button'; b.className = 'btn grande'; b.textContent = '▶ Simular 24 h'; b.onclick = simular; c.appendChild(b); }
  }
  function pintar() {
    var p = $('pasos'); p.textContent = '';
    PASOS.forEach(function (Q, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === paso)); b.innerHTML = '<b>' + (hecho[i] ? '✓' : i + 1) + '</b>' + Q.n; b.onclick = function () { ir(i); }; p.appendChild(b); });
    var Q = PASOS[paso]; $('tit').textContent = Q.t; $('txt').innerHTML = Q.x; $('misTxt').textContent = hecho[paso] ? '¡Muy bien! Misión cumplida ✔' : Q.m; $('dato').textContent = '💡 ' + Q.d;
    $('mis').className = 'mision' + (hecho[paso] ? ' ok' : ''); $('bAnt').disabled = paso === 0; $('bSig').disabled = paso === 2; $('fin').className = 'fin' + (hecho.every(Boolean) ? ' v' : '');
  }
  function ir(n) { paso = n; sim = null; ctl(); pintar(); }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); }; $('bSig').onclick = function () { if (paso < 2) ir(paso + 1); };
  window.__ener = { ir: ir, setH: function (v) { HORA = v; }, setN: function (v) { NUBES = v; }, setP: function (v) { P = v; }, setT: function (v) { T = v; }, setB: function (v) { B = v; }, setW: function (v) { VIENTO = v; }, simular: simular, correr: function () { sim && !sim.fin && (function () { while (!sim.fin) paso24(0.25); })(); }, estado: function () { return { hecho: hecho.slice(), apagones: sim && sim.apagones, fin: sim && sim.fin }; } };
  ctl(); pintar(); requestAnimationFrame(dibujar);
})();
