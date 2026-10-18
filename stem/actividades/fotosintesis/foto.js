/* Fotosíntesis (6°, solo español, sin voz): ingredientes y productos, factor limitante y experimento con una planta acuática. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var cv = $('cv'), g = cv.getContext('2d'), W = cv.width, H = cv.height;
  var PASOS = [
    { n: 'Ingredientes y productos', t: '1. La receta de la fotosíntesis', x: 'Las plantas fabrican su alimento con la <b>fotosíntesis</b>: usan la <b>luz</b> del sol, <b>agua</b> y <b>dióxido de carbono</b> (CO₂) para producir <b>glucosa</b> (azúcar) y liberar <b>oxígeno</b>. Ocurre en los cloroplastos, gracias a la clorofila.', m: 'Clasifica 5 elementos: ¿son un ingrediente o un producto?', d: 'Casi todo el oxígeno que respiras fue liberado por plantas, algas y bacterias fotosintéticas.' },
    { n: 'Factor limitante', t: '2. ¿Qué frena la fotosíntesis?', x: 'La rapidez de la fotosíntesis la marca el ingrediente que <b>más escasea</b>: el <b>factor limitante</b>. Aunque haya muchísima luz, si falta agua o CO₂ no se acelera.', m: 'Haz que cada uno de los tres (luz, CO₂ y agua) sea el factor limitante.', d: 'Por eso en invernaderos se controla la luz, el agua y hasta el CO₂.' },
    { n: 'Experimento', t: '3. La planta acuática (Elodea)', x: 'En una planta acuática puedes <b>contar las burbujas</b> de oxígeno. Acerca o aleja la lámpara, mide las burbujas en 30 segundos y arma tu gráfica: ¿qué relación hay entre la luz y la fotosíntesis?', m: 'Mide las burbujas con 4 distancias distintas (al menos 15 cm de diferencia).', d: 'Cuanto más lejos está la lámpara, menos luz le llega a la planta y menos oxígeno produce.' }
  ];
  var paso = 0, hecho = [false, false, false], tiempo = 0;
  var ITEMS = [['☀️ Luz del sol', 0], ['💨 Dióxido de carbono (CO₂)', 0], ['💧 Agua', 0], ['🍬 Glucosa (azúcar)', 1], ['🫧 Oxígeno (O₂)', 1]], orden = [], ronda = 0, aciertos = 0, msj1 = '';
  var luz = 70, co2 = 60, agua = 60, lim = {}, tasa = 0, parts = [], acum = 0, gluc = 0;
  var dist = 40, medidas = [], midiendo = null, burb = [];
  var ac = null;
  function tono(f, v, d) { try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume(); var o = ac.createOscillator(), gn = ac.createGain(); o.type = 'sine'; o.frequency.value = f; gn.gain.setValueAtTime(v, ac.currentTime); gn.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d); o.connect(gn); gn.connect(ac.destination); o.start(); o.stop(ac.currentTime + d); } catch (e) {} }
  function ex() { tono(660, 0.2, 0.2); setTimeout(function () { tono(880, 0.2, 0.3); }, 130); }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; ex(); pintar(); }
  function mezclar(a) { return a.slice().sort(function () { return Math.random() - 0.5; }); }
  function limitante() { var m = Math.min(luz, co2, agua); return m === luz ? 'luz' : m === co2 ? 'co2' : 'agua'; }
  function tasaBurb(d) { return 26 * Math.exp(-(d - 10) / 30); }
  function sim(dt) {
    tiempo += dt;
    if (paso === 1) { tasa = Math.min(luz, co2, agua) / 100; var l = limitante(); if (Math.abs(luz - co2) > 15 || Math.abs(co2 - agua) > 15 || Math.abs(luz - agua) > 15) lim[l] = 1; else if (luz !== co2 || co2 !== agua) lim[l] = 1; if (lim.luz && lim.co2 && lim.agua) cumplir(1); }
    else if (paso === 2) { tasa = tasaBurb(dist) / 26; }
    else tasa = 0.6;
    if (paso !== 0) { acum += dt * (tasa * 22 + 0.5); while (acum >= 1) { acum -= 1; burb.push({ x: 560 + Math.random() * 90, y: 280, vy: -(40 + Math.random() * 60), r: 3 + Math.random() * 4 }); if (paso === 2 && midiendo) midiendo.n++; } }
    burb = burb.filter(function (b) { b.y += b.vy * dt; b.x += Math.sin(tiempo * 3 + b.y) * 0.4; return b.y > 40; });
    if (midiendo) { midiendo.t += dt; if (midiendo.t >= 3) { var r = Math.round(tasaBurb(midiendo.d)); r = Math.max(0, r + Math.round((Math.random() - 0.5) * 2)); medidas.push([midiendo.d, r]); midiendo = null; var ds = medidas.map(function (m) { return m[0]; }).sort(function (a, b) { return a - b; }), ok = ds.length >= 4; for (var i = 1; i < ds.length; i++) if (ds[i] - ds[i - 1] < 15) ok = false; if (medidas.length >= 4 && ds.every(function (d, i) { return i === 0 || d - ds[i - 1] >= 15; })) cumplir(2); } }
  }
  function leaf() {
    var gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#07281c'); gr.addColorStop(1, '#04100a'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  }
  function dibCelula(cx, cy, w, h) {
    g.fillStyle = '#0f4a2f'; g.strokeStyle = '#6fe38a'; g.lineWidth = 4; g.beginPath(); g.roundRect ? g.roundRect(cx - w / 2, cy - h / 2, w, h, 40) : g.rect(cx - w / 2, cy - h / 2, w, h); g.fill(); g.stroke();
    var n = 7; for (var i = 0; i < n; i++) { var x = cx - w / 2 + 50 + (i % 4) * (w - 100) / 3, y = cy - 30 + Math.floor(i / 4) * 70 + (i % 2) * 8; g.save(); g.translate(x, y); g.rotate(i * 0.4); g.fillStyle = '#2fa150'; g.shadowColor = '#9bf0a8'; g.shadowBlur = 8 + tasa * 22; g.beginPath(); g.ellipse(0, 0, 26, 14, 0, 0, 7); g.fill(); g.shadowBlur = 0; g.fillStyle = 'rgba(10,80,30,.7)'; for (var k = -2; k <= 2; k++) g.fillRect(k * 8 - 2, -7, 4, 14); g.restore(); }
  }
  function dibFab() {
    leaf();
    // sol
    var sh = g.createRadialGradient(110, 80, 5, 110, 80, 40 + luz); sh.addColorStop(0, 'rgba(255,230,120,' + (0.4 + luz / 160) + ')'); sh.addColorStop(1, 'rgba(255,230,120,0)'); g.fillStyle = sh; g.fillRect(0, 0, 360, 300); g.fillStyle = '#ffd95e'; g.beginPath(); g.arc(110, 80, 30, 0, 7); g.fill();
    g.strokeStyle = 'rgba(255,224,130,' + (0.2 + luz / 150) + ')'; g.lineWidth = 3; for (var r = 0; r < 5; r++) { g.beginPath(); g.moveTo(150 + r * 8, 100 + r * 22); g.lineTo(330 + r * 6, 200 + r * 18); g.stroke(); }
    dibCelula(560, 230, 420, 150);
    // CO2 entrando (arriba) y agua (abajo)
    var nco = Math.round(co2 / 10); for (var i = 0; i < nco; i++) { var t = ((tiempo * 0.35 + i / nco) % 1), x = 700 - t * 120 + (i % 3) * 24, y = 60 + t * 100; g.fillStyle = '#9aa7bd'; g.beginPath(); g.arc(x, y, 7, 0, 7); g.arc(x + 9, y + 3, 5, 0, 7); g.fill(); }
    var nag = Math.round(agua / 10); for (var j = 0; j < nag; j++) { var t2 = ((tiempo * 0.3 + j / nag) % 1), x2 = 560 + (j % 5) * 30 - 60, y2 = 420 - t2 * 130; g.fillStyle = '#58b8ff'; g.beginPath(); g.arc(x2, y2, 6, 0, 7); g.fill(); }
    burb.forEach(function (b) { g.strokeStyle = 'rgba(180,240,255,.8)'; g.fillStyle = 'rgba(180,240,255,.2)'; g.lineWidth = 1.5; g.beginPath(); g.arc(b.x, b.y, b.r, 0, 7); g.fill(); g.stroke(); });
    g.fillStyle = '#cfe6ff'; g.font = '700 15px "JetBrains Mono",monospace'; g.textAlign = 'center'; g.fillText('CO₂ ↓', 640, 50); g.fillText('💧 agua ↑ (raíz)', 540, 440); g.fillText('O₂ ↑', 610, 36);
    g.fillStyle = '#ffe08a'; g.fillText('🍬 glucosa: ' + Math.floor(gluc), 560, 238);
  }
  function dib1() {
    leaf();
    g.textAlign = 'center'; g.fillStyle = '#6fe38a'; g.font = '700 22px "Space Grotesk",system-ui,sans-serif'; g.fillText('6CO₂ + 6H₂O + luz  →  C₆H₁₂O₆ + 6O₂', W / 2, 56);
    g.fillStyle = '#9db8ff'; g.font = '600 16px "Space Grotesk",system-ui,sans-serif'; g.fillText('ingredientes (entran)  →  productos (se obtienen)', W / 2, 86);
    if (ronda < 5) { var it = ITEMS[orden[ronda]]; g.fillStyle = '#fff'; g.font = '700 38px "Space Grotesk",system-ui,sans-serif'; g.fillText(it[0], W / 2, 220); g.fillStyle = '#cfe6ff'; g.font = '600 20px "Space Grotesk",system-ui,sans-serif'; g.fillText('¿Es un ingrediente o un producto?', W / 2, 290); }
    else { g.fillStyle = '#8be8ae'; g.font = '700 34px "Space Grotesk",system-ui,sans-serif'; g.fillText(aciertos >= 5 ? '¡Todos correctos!' : 'Aciertos: ' + aciertos + ' de 5', W / 2, 230); }
    g.fillStyle = msj1.indexOf('✔') > -1 ? '#8be8ae' : '#ff9f9f'; g.font = '700 20px "Space Grotesk",system-ui,sans-serif'; g.fillText(msj1, W / 2, 400);
    g.fillStyle = '#cfe6ff'; g.font = '600 15px "JetBrains Mono",monospace'; g.fillText('Ronda ' + Math.min(5, ronda + 1) + ' de 5', W / 2, 440);
  }
  function dib2() {
    dibFab(); var l = limitante(), nom = { luz: '☀️ LUZ', co2: '💨 CO₂', agua: '💧 AGUA' }[l];
    g.fillStyle = 'rgba(4,16,10,.85)'; g.fillRect(14, 300, 300, 120); g.fillStyle = '#ffe08a'; g.font = '700 17px "JetBrains Mono",monospace'; g.textAlign = 'left'; g.fillText('Rapidez: ' + Math.round(tasa * 100) + '%', 26, 328); g.fillStyle = '#ff9f9f'; g.fillText('Factor limitante: ' + nom, 26, 356);
    [['luz', '☀️'], ['co2', '💨'], ['agua', '💧']].forEach(function (k, i) { g.fillStyle = lim[k[0]] ? '#8be8ae' : '#8aa0b8'; g.fillText((lim[k[0]] ? '✔ ' : '○ ') + k[1] + ' visto como limitante', 26, 384 + i * 0 + (i - 1) * 0), void 0; });
  }
  function dib3() {
    leaf();
    // acuario
    g.fillStyle = 'rgba(70,140,220,.28)'; g.fillRect(380, 150, 260, 270); g.strokeStyle = '#9db8ff'; g.lineWidth = 4; g.strokeRect(380, 150, 260, 270);
    g.strokeStyle = '#3fbf6a'; g.lineWidth = 6; for (var k = 0; k < 4; k++) { g.beginPath(); g.moveTo(480 + k * 16, 420); g.quadraticCurveTo(470 + k * 18 + Math.sin(tiempo * 2 + k) * 6, 350, 485 + k * 14, 290); g.stroke(); }
    // lámpara
    var lx = 380 - dist * 2.6; lx = Math.max(60, lx); var hh = g.createRadialGradient(lx, 280, 5, lx, 280, 210); hh.addColorStop(0, 'rgba(255,240,170,' + Math.min(0.9, 6 / Math.pow(dist / 20, 2) * 0.1 + 0.15) + ')'); hh.addColorStop(1, 'rgba(255,240,170,0)'); g.fillStyle = hh; g.fillRect(0, 100, 700, 340);
    g.font = '58px system-ui'; g.textAlign = 'center'; g.fillStyle = '#000'; g.fillText('💡', lx, 296);
    g.strokeStyle = 'rgba(255,255,255,.4)'; g.setLineDash([6, 6]); g.lineWidth = 2; g.beginPath(); g.moveTo(lx + 28, 330); g.lineTo(380, 330); g.stroke(); g.setLineDash([]); g.fillStyle = '#ffe08a'; g.font = '700 17px "JetBrains Mono",monospace'; g.fillText(dist + ' cm', (lx + 380) / 2 + 14, 352);
    burb.forEach(function (b) { g.strokeStyle = 'rgba(200,245,255,.9)'; g.fillStyle = 'rgba(200,245,255,.25)'; g.lineWidth = 1.5; g.beginPath(); g.arc(b.x - 60, b.y + 30, b.r, 0, 7); g.fill(); g.stroke(); });
    if (midiendo) { g.fillStyle = '#ffe08a'; g.font = '700 20px "Space Grotesk",system-ui,sans-serif'; g.fillText('Contando… ' + midiendo.n + ' burbujas (' + Math.max(0, 3 - midiendo.t).toFixed(1) + ' s)', 510, 130); }
    // gráfica
    var gx = 700, gy = 90, gw = 230, gh = 220; g.fillStyle = 'rgba(4,16,10,.85)'; g.fillRect(gx - 40, gy - 40, gw + 60, gh + 90); g.strokeStyle = '#6fe38a'; g.lineWidth = 2; g.beginPath(); g.moveTo(gx, gy); g.lineTo(gx, gy + gh); g.lineTo(gx + gw, gy + gh); g.stroke();
    g.fillStyle = '#cfe6ff'; g.font = '600 12px "JetBrains Mono",monospace'; g.textAlign = 'center'; g.fillText('distancia de la lámpara (cm)', gx + gw / 2, gy + gh + 30); g.save(); g.translate(gx - 28, gy + gh / 2); g.rotate(-Math.PI / 2); g.fillText('burbujas / 30 s', 0, 0); g.restore();
    medidas.forEach(function (m) { var X = gx + (m[0] - 10) / 90 * gw, Y = gy + gh - Math.min(1, m[1] / 28) * gh; g.fillStyle = '#ffe08a'; g.beginPath(); g.arc(X, Y, 6, 0, 7); g.fill(); g.fillStyle = '#fff'; g.fillText(String(m[1]), X, Y - 10); });
    if (medidas.length > 1) { var s = medidas.slice().sort(function (a, b) { return a[0] - b[0]; }); g.strokeStyle = 'rgba(255,224,138,.6)'; g.lineWidth = 2; g.beginPath(); s.forEach(function (m, i) { var X = gx + (m[0] - 10) / 90 * gw, Y = gy + gh - Math.min(1, m[1] / 28) * gh; if (i) g.lineTo(X, Y); else g.moveTo(X, Y); }); g.stroke(); }
    g.fillStyle = '#8aa0b8'; g.font = '600 12px "JetBrains Mono",monospace'; g.fillText('10', gx, gy + gh + 14); g.fillText('100', gx + gw, gy + gh + 14);
    g.fillStyle = '#cfe6ff'; g.font = '700 18px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'center'; g.fillText('Medidas: ' + medidas.length + ' de 4', 200, 440);
  }
  var last = 0;
  function frame(ms) { var dt = Math.min(0.05, (ms - (last || ms)) / 1000); last = ms; sim(dt); if (paso === 0) dib1(); else if (paso === 1) dib2(); else dib3(); requestAnimationFrame(frame); }
  function ctl() {
    var c = $('ctl'); c.textContent = '';
    function rango(etq, min, max, step, val, fn) { var l = document.createElement('label'); l.className = 'rango'; l.innerHTML = etq + ' <input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" aria-label="' + etq + '">'; l.querySelector('input').oninput = function (e) { fn(Number(e.target.value)); }; c.appendChild(l); }
    function btn(txt, fn, cls) { var b = document.createElement('button'); b.type = 'button'; b.className = cls || 'btn sec'; b.textContent = txt; b.onclick = fn; c.appendChild(b); }
    if (paso === 0) { btn('🌱 Ingrediente', function () { resp(0); }, 'btn grande'); btn('🍬 Producto', function () { resp(1); }, 'btn grande'); if (ronda >= 5 && aciertos < 5) btn('🔄 Reintentar', function () { reiniciar1(); ctl(); }, 'btn'); }
    if (paso === 1) { rango('☀️ Luz', 5, 100, 5, luz, function (v) { luz = v; }); rango('💨 CO₂', 5, 100, 5, co2, function (v) { co2 = v; }); rango('💧 Agua', 5, 100, 5, agua, function (v) { agua = v; }); }
    if (paso === 2) { rango('💡 Distancia', 10, 100, 5, dist, function (v) { dist = v; }); btn('⏱ Medir 30 s', function () { if (!midiendo) { midiendo = { t: 0, n: 0, d: dist }; tono(500, 0.1, 0.15); } }, 'btn grande'); btn('🗑 Borrar medidas', function () { medidas = []; }, 'btn sec'); }
  }
  function resp(v) { if (ronda >= 5) return; var it = ITEMS[orden[ronda]]; if (it[1] === v) { aciertos++; msj1 = '✔ ¡Correcto!'; tono(740, 0.12, 0.15); } else { msj1 = '✖ Era ' + (it[1] ? 'un producto' : 'un ingrediente'); tono(200, 0.12, 0.2); } ronda++; if (ronda >= 5) { if (aciertos >= 5) cumplir(0); ctl(); } }
  function reiniciar1() { orden = mezclar([0, 1, 2, 3, 4]); ronda = 0; aciertos = 0; msj1 = ''; }
  function pintar() {
    var p = $('pasos'); p.textContent = '';
    PASOS.forEach(function (Q, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === paso)); b.innerHTML = '<b>' + (hecho[i] ? '✓' : i + 1) + '</b>' + Q.n; b.onclick = function () { ir(i); }; p.appendChild(b); });
    var Q = PASOS[paso]; $('tit').textContent = Q.t; $('txt').innerHTML = Q.x; $('misTxt').textContent = hecho[paso] ? '¡Muy bien! Misión cumplida ✔' : Q.m; $('dato').textContent = '💡 ' + Q.d;
    $('mis').className = 'mision' + (hecho[paso] ? ' ok' : ''); $('bAnt').disabled = paso === 0; $('bSig').disabled = paso === 2; $('fin').className = 'fin' + (hecho.every(Boolean) ? ' v' : '');
  }
  function ir(n) { paso = n; burb = []; midiendo = null; if (n === 0) reiniciar1(); ctl(); pintar(); }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); }; $('bSig').onclick = function () { if (paso < 2) ir(paso + 1); };
  window.__foto = { ir: ir, resp: resp, correcta: function () { return ronda < 5 ? ITEMS[orden[ronda]][1] : -1; }, setLuz: function (v) { luz = v; }, setCo2: function (v) { co2 = v; }, setAgua: function (v) { agua = v; }, setDist: function (v) { dist = v; },
    medir: function () { midiendo = { t: 0, n: 0, d: dist }; }, avanzar: function (s) { for (var i = 0; i < s * 40; i++) sim(0.025); }, estado: function () { return { hecho: hecho.slice(), lim: Object.keys(lim), medidas: medidas.length }; } };
  reiniciar1(); ctl(); pintar(); requestAnimationFrame(frame);
})();
