/* Cambio climático (5°, solo español, sin voz): efecto invernadero, acciones que suben o bajan el CO₂ y simulación hasta 2100. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var cv = $('cv'), g = cv.getContext('2d'), W = cv.width, H = cv.height;
  var PASOS = [
    { n: 'Efecto invernadero', t: '1. La manta de la Tierra', x: 'El Sol calienta la Tierra y esta devuelve parte del calor al espacio. Los <b>gases de efecto invernadero</b> (como el CO₂) atrapan una parte, como una manta. Sin ellos la Tierra sería helada, pero con <b>demasiados</b> se calienta de más.', m: 'Prueba tres niveles de gases: antes de la industria (280), actual (420) y alto (600).', d: 'Sin efecto invernadero natural, la temperatura media de la Tierra sería de unos −18 °C.' },
    { n: 'Causas y soluciones', t: '2. ¿Sube o baja el CO₂?', x: 'Quemar <b>carbón, petróleo y gasolina</b> y talar bosques <b>aumentan</b> el CO₂. Plantar árboles, usar energías limpias y caminar o ir en bici lo <b>reducen</b>.', m: 'Clasifica 6 acciones: acierta al menos 5.', d: 'Un árbol adulto puede absorber unos 20 kg de CO₂ al año.' },
    { n: 'Tu plan hasta 2100', t: '3. Diseña el futuro', x: 'Hoy el mundo ya se calentó unos <b>1,2 °C</b>. Los científicos dicen que hay que quedarse por debajo de <b>2 °C</b>. Decide cuánto reducir las emisiones para 2050 y cuántos bosques proteger, y mira la gráfica de temperatura hasta 2100.', m: 'Consigue que en 2100 el calentamiento sea menor de 2 °C.', d: 'Cada décima de grado cuenta: con 1,5 °C se evitan muchos daños frente a 2 °C.' }
  ];
  var ACC = [['🌳 Plantar árboles', 0], ['🏭 Quemar carbón en fábricas', 1], ['🚲 Ir en bicicleta al colegio', 0], ['🪓 Talar bosques', 1], ['☀️ Usar paneles solares', 0], ['🚗 Más carros de gasolina', 1], ['♻️ Reciclar y reutilizar', 0], ['🛢️ Quemar más petróleo', 1]];
  var paso = 0, hecho = [false, false, false], tiempo = 0, msj = '';
  var gas = 420, vistos = {}, cola = [], ronda = 0, aciertos = 0, red = 50, bos = 50, sim = null, resultado = null;
  var ac = null;
  function tono(f, v, d) { try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume(); var o = ac.createOscillator(), gn = ac.createGain(); o.type = 'sine'; o.frequency.value = f; gn.gain.setValueAtTime(v, ac.currentTime); gn.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d); o.connect(gn); gn.connect(ac.destination); o.start(); o.stop(ac.currentTime + d); } catch (e) {} }
  function ex() { tono(660, 0.2, 0.2); setTimeout(function () { tono(880, 0.2, 0.3); }, 130); }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; ex(); if (window.STEMFX) STEMFX.exito(); pintar(); }
  function mezclar(a) { return a.slice().sort(function () { return Math.random() - 0.5; }); }
  function txt(s, x, y, col, al, tam) { g.font = '700 ' + (tam || 18) + 'px "Space Grotesk",system-ui,sans-serif'; g.fillStyle = col || '#cfe6ff'; g.textAlign = al || 'center'; g.textBaseline = 'alphabetic'; g.fillText(s, x, y); }
  function tempMedia(c) { return 15 + 1.2 * 0 + 3.5 * Math.log(c / 280) / Math.LN2 * 0.43; }
  /* modelo de 2024 a 2100: C(ppm) y calentamiento */
  function proyectar(r, b) {
    var c = 420, serie = [], emis = 2.4;
    for (var y = 2024; y <= 2100; y++) { var f = y < 2050 ? 1 - (1 - (1 - r / 100)) * 0 - (r / 100) * (y - 2024) / 26 : 1 - r / 100; c += emis * Math.max(0, f) - 0.5 * (b / 100); c = Math.max(380, c); serie.push([y, c, 1.2 + 3.5 * Math.log(c / 420) / Math.LN2]); }
    return serie;
  }
  function dibTierra() {
    var bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#02050c'); bg.addColorStop(1, '#0a1730'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    for (var i = 0; i < 50; i++) { g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect((i * 151) % W, (i * 47) % H, 1.6, 1.6); }
    // sol
    var sh = g.createRadialGradient(80, 230, 5, 80, 230, 140); sh.addColorStop(0, 'rgba(255,230,120,.95)'); sh.addColorStop(1, 'rgba(255,230,120,0)'); g.fillStyle = sh; g.fillRect(0, 90, 220, 280); g.fillStyle = '#ffd95e'; g.beginPath(); g.arc(80, 230, 36, 0, 7); g.fill();
    // atmósfera (capa de gases) y tierra
    var dens = Math.max(0, Math.min(1, (gas - 200) / 500)); g.strokeStyle = 'rgba(255,150,90,' + (0.15 + dens * 0.5) + ')'; g.lineWidth = 14 + dens * 40; g.beginPath(); g.arc(700, 230, 205 + dens * 20, 0, 7); g.stroke();
    var tg = g.createRadialGradient(620, 210, 20, 700, 230, 190); tg.addColorStop(0, '#4da3ff'); tg.addColorStop(0.6, '#2b78d0'); tg.addColorStop(1, '#10305e'); g.fillStyle = tg; g.beginPath(); g.arc(700, 230, 190, 0, 7); g.fill();
    g.fillStyle = '#3fbf6a'; [[640, 170, 40], [740, 280, 50], [690, 330, 28]].forEach(function (c) { g.beginPath(); g.ellipse(c[0], c[1], c[2], c[2] * 0.7, 0.4, 0, 7); g.fill(); });
    // rayos del Sol (amarillos) y calor reflejado (rojos): más gases → más rebotan hacia abajo
    for (var r = 0; r < 6; r++) { var y0 = 150 + r * 30, ph = (tiempo * 0.5 + r * 0.17) % 1; g.strokeStyle = 'rgba(255,224,130,.8)'; g.lineWidth = 3; g.beginPath(); g.moveTo(120, 230 + (y0 - 230) * 0.3); g.lineTo(120 + ph * 500, 230 + (y0 - 230) * 0.3 + ph * (y0 - 215) * 0.2 * 0); g.stroke(); var px = 140 + ph * 480; g.fillStyle = '#ffe08a'; g.beginPath(); g.arc(px, 230 + (y0 - 230) * 0.3, 5, 0, 7); g.fill(); }
    for (var q = 0; q < 6; q++) { var tt = (tiempo * 0.45 + q / 6) % 1, rx = 780 + Math.cos(q * 1.1) * 40, ry = 120 + q * 20, vuelve = (q / 6) < dens * 1.1; var yy = vuelve ? ry + Math.min(tt, 0.5) * 60 - Math.max(0, tt - 0.5) * 60 : ry - tt * 120; g.fillStyle = vuelve ? '#ff7a5c' : '#ffb49a'; g.globalAlpha = 0.9 - (vuelve ? 0 : tt * 0.7); g.beginPath(); g.arc(rx + (vuelve ? Math.sin(tt * 6) * 8 : 0), yy, 5, 0, 7); g.fill(); g.globalAlpha = 1; }
    var T = 15 + 3.5 * Math.log(Math.max(180, gas) / 280) / Math.LN2 * 0.43 * 2;
    txt('Gases: ' + gas + ' ppm de CO₂', 300, 60, '#ffb49a', 'center', 22); txt('Temperatura media: ' + T.toFixed(1) + ' °C', 300, 92, T > 16.2 ? '#ff9f9f' : '#8be8ae', 'center', 22);
    txt('calor atrapado ↩', 700, 36, '#ff7a5c', 'center', 16);
  }
  function dib2() {
    var bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0a1a2e'); bg.addColorStop(1, '#050b14'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    if (ronda < 6) { var a = cola[ronda]; txt(a[0], W / 2, 190, '#fff', 'center', 40); txt('¿Esta acción hace subir o bajar el CO₂?', W / 2, 260, '#cfe6ff', 'center', 22); }
    else txt(aciertos >= 5 ? '¡Muy bien! ' + aciertos + ' de 6' : 'Aciertos: ' + aciertos + ' de 6. ¡Otra vez!', W / 2, 220, aciertos >= 5 ? '#8be8ae' : '#ffb3b3', 'center', 36);
    txt(msj, W / 2, 350, msj.indexOf('✔') > -1 ? '#8be8ae' : '#ff9f9f', 'center', 22); txt('Ronda ' + Math.min(6, ronda + 1) + ' de 6', W / 2, 440, '#9db8ff', 'center', 16);
  }
  function dib3() {
    var bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0a1a2e'); bg.addColorStop(1, '#050b14'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    var gx = 90, gy = 70, gw = 800, gh = 300; g.strokeStyle = 'rgba(207,230,255,.4)'; g.lineWidth = 2; g.strokeRect(gx, gy, gw, gh);
    var ymax = 4, yline = function (T) { return gy + gh - (T / ymax) * gh; };
    [1.5, 2, 3].forEach(function (T) { g.strokeStyle = T === 2 ? 'rgba(255,120,120,.8)' : 'rgba(255,255,255,.15)'; g.setLineDash([6, 6]); g.beginPath(); g.moveTo(gx, yline(T)); g.lineTo(gx + gw, yline(T)); g.stroke(); g.setLineDash([]); txt(T.toFixed(1) + ' °C', gx - 12, yline(T) + 5, T === 2 ? '#ff9f9f' : '#9db8ff', 'right', 14); });
    var s = sim || proyectar(red, bos), n = sim ? sim.length : s.length;
    var arr = sim ? sim : s; var col = arr[arr.length - 1][2] < 2 ? '#8be8ae' : '#ff9f9f';
    g.strokeStyle = col; g.lineWidth = 4; g.shadowColor = col; g.shadowBlur = 12; g.beginPath(); arr.forEach(function (p, i) { var X = gx + gw * (p[0] - 2024) / 76, Y = yline(p[2]); if (i) g.lineTo(X, Y); else g.moveTo(X, Y); }); g.stroke(); g.shadowBlur = 0;
    txt('2024', gx, gy + gh + 22, '#9db8ff', 'center', 14); txt('2050', gx + gw * 26 / 76, gy + gh + 22, '#9db8ff', 'center', 14); txt('2100', gx + gw, gy + gh + 22, '#9db8ff', 'center', 14);
    var fin = arr[arr.length - 1]; txt('Año ' + fin[0] + ' · CO₂ ' + Math.round(fin[1]) + ' ppm · calentamiento ' + fin[2].toFixed(2) + ' °C', W / 2, 40, col, 'center', 22);
    if (sim && sim.length >= 77) { txt(fin[2] < 2 ? '🌍 ¡Futuro seguro! Menos de 2 °C' : 'Más de 2 °C: ¡hay que reducir más!', W / 2, 430, fin[2] < 2 ? '#8be8ae' : '#ffb3b3', 'center', 24); } else txt('Ajusta los controles y pulsa «Simular hasta 2100»', W / 2, 430, '#9db8ff', 'center', 18);
  }
  var last = 0, acc = 0;
  function frame(ms) { var dt = Math.min(0.05, (ms - (last || ms)) / 1000); last = ms; tiempo += dt; if (paso === 2 && sim && sim.length < 77) { acc += dt; var s = proyectar(red, bos); while (acc > 0.03 && sim.length < 77) { acc -= 0.03; sim.push(s[sim.length]); if (sim.length >= 77) { var T = s[76][2]; resultado = T; if (T < 2) cumplir(2); tono(T < 2 ? 780 : 200, 0.15, 0.3); } } } if (paso === 0) { dibTierra(); } else if (paso === 1) dib2(); else dib3(); requestAnimationFrame(frame); }
  function resp(v) { if (ronda >= 6) return; var a = cola[ronda]; if (a[1] === v) { aciertos++; msj = '✔ ¡Correcto!'; tono(740, 0.12, 0.15); } else { msj = '✖ Era: ' + (a[1] ? 'sube el CO₂' : 'baja el CO₂'); tono(200, 0.12, 0.2); } ronda++; if (ronda >= 6 && aciertos >= 5) cumplir(1); ctl(); }
  function nuevo() { cola = mezclar(ACC).slice(0, 6); ronda = 0; aciertos = 0; msj = ''; }
  function ctl() {
    var c = $('ctl'); c.textContent = '';
    function rango(etq, min, max, step, val, fn) { var l = document.createElement('label'); l.className = 'rango'; l.innerHTML = etq + ' <input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" aria-label="' + etq + '">'; l.querySelector('input').oninput = function (e) { fn(Number(e.target.value)); }; c.appendChild(l); }
    function btn(txt, fn, cls) { var b = document.createElement('button'); b.type = 'button'; b.className = cls || 'btn sec'; b.textContent = txt; b.onclick = fn; c.appendChild(b); }
    if (paso === 0) rango('🌫️ Gases (ppm)', 200, 700, 10, gas, function (v) { gas = v; if (v <= 300) vistos.bajo = 1; if (v >= 400 && v <= 440) vistos.actual = 1; if (v >= 580) vistos.alto = 1; if (vistos.bajo && vistos.actual && vistos.alto) cumplir(0); });
    if (paso === 1) { btn('⬆ Sube el CO₂', function () { resp(1); }, 'btn grande'); btn('⬇ Baja el CO₂', function () { resp(0); }, 'btn grande'); if (ronda >= 6 && aciertos < 5) btn('🔄 Reintentar', function () { nuevo(); ctl(); }, 'btn'); }
    if (paso === 2) { rango('🏭 Reducir emisiones para 2050 (%)', 0, 100, 5, red, function (v) { red = v; sim = null; }); rango('🌳 Proteger bosques (%)', 0, 100, 5, bos, function (v) { bos = v; sim = null; }); btn('▶ Simular hasta 2100', function () { sim = [proyectar(red, bos)[0]]; resultado = null; }, 'btn grande'); }
  }
  function pintar() {
    var p = $('pasos'); p.textContent = '';
    PASOS.forEach(function (Q, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === paso)); b.innerHTML = '<b>' + (hecho[i] ? '✓' : i + 1) + '</b>' + Q.n; b.onclick = function () { ir(i); }; p.appendChild(b); });
    var Q = PASOS[paso]; $('tit').textContent = Q.t; $('txt').innerHTML = Q.x; $('misTxt').textContent = hecho[paso] ? '¡Muy bien! Misión cumplida ✔' : Q.m; $('dato').textContent = '💡 ' + Q.d;
    $('mis').className = 'mision' + (hecho[paso] ? ' ok' : ''); $('bAnt').disabled = paso === 0; $('bSig').disabled = paso === 2; $('fin').className = 'fin' + (hecho.every(Boolean) ? ' v' : '');
  }
  function ir(n) { paso = n; msj = ''; sim = null; if (n === 1) nuevo(); ctl(); pintar(); }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); }; $('bSig').onclick = function () { if (paso < 2) ir(paso + 1); };
  window.__cg = { ir: ir, setGas: function (v) { gas = v; if (v <= 300) vistos.bajo = 1; if (v >= 400 && v <= 440) vistos.actual = 1; if (v >= 580) vistos.alto = 1; if (vistos.bajo && vistos.actual && vistos.alto) cumplir(0); }, c1: function () { return ronda < 6 ? cola[ronda][1] : null; }, resp: resp, setRed: function (v) { red = v; sim = null; }, setBos: function (v) { bos = v; sim = null; }, simular: function () { sim = [proyectar(red, bos)[0]]; resultado = null; }, final: function (r, b) { var s = proyectar(r, b); return s[76][2]; }, estado: function () { return { hecho: hecho.slice(), resultado: resultado }; } };
  ctl(); pintar(); requestAnimationFrame(frame);
})();
