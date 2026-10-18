/* Reciclar (2°, solo español, sin voz): clasificar residuos, juego de canecas contrarreloj y las 3 erres. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var cv = $('cv'), g = cv.getContext('2d'), W = cv.width, H = cv.height;
  var PASOS = [
    { n: 'Separa la basura', t: '1. Cada cosa en su caneca', x: 'Cuando separamos la basura, muchos materiales pueden <b>reciclarse</b> y volver a usarse. El <b>papel</b> va en la azul, el <b>plástico</b> en la amarilla, el <b>vidrio</b> en la verde y lo <b>orgánico</b> (restos de comida) en la café.', m: 'Lleva 6 objetos a su caneca: acierta al menos 5.', d: 'Una botella de plástico puede convertirse en una camiseta o en un juguete.' },
    { n: '¡Rápido!', t: '2. Atrapa los residuos', x: 'Ahora los objetos caen del cielo. Toca la caneca correcta <b>antes de que lleguen al suelo</b>.', m: 'Clasifica 10 objetos que caen: acierta al menos 7.', d: 'Si reciclas una lata de aluminio, ahorras la energía para ver televisión durante 3 horas.' },
    { n: 'Las 3 erres', t: '3. Reducir, reutilizar y reciclar', x: '<b>Reducir</b> es usar menos cosas. <b>Reutilizar</b> es volver a usar algo con otro fin. <b>Reciclar</b> es llevar los materiales a la caneca para que se transformen en objetos nuevos.', m: 'Acierta 4 acciones de las 3 erres.', d: 'La mejor basura es la que no se produce: por eso la primera erre es reducir.' }
  ];
  var BINS = [['📰', 'Papel', '#4da3ff'], ['🥤', 'Plástico', '#ffd24a'], ['🍾', 'Vidrio', '#4ccf7a'], ['🍎', 'Orgánico', '#b9825a']];
  var ITEMS = [['📰', 'Periódico', 0], ['📦', 'Caja de cartón', 0], ['🥤', 'Vaso de plástico', 1], ['🧴', 'Botella de champú', 1], ['🍾', 'Botella de vidrio', 2], ['🫙', 'Frasco de vidrio', 2], ['🍎', 'Manzana mordida', 3], ['🍌', 'Cáscara de banano', 3], ['📄', 'Hoja de cuaderno', 0], ['🥛', 'Envase de leche (plástico)', 1]];
  var ACC = [['Llevar tu botella rellenable', 0], ['Hacer una maceta con una botella vieja', 1], ['Poner el cartón en la caneca azul', 2], ['Usar las dos caras de la hoja', 0], ['Convertir una caja en un juguete', 1], ['Llevar las latas al centro de reciclaje', 2]];
  var paso = 0, hecho = [false, false, false], tiempo = 0, msj = '';
  var cola = [], idx = 0, aciertos = 0, caida = null, fin = false, quiz = [], qi = 0, qok = 0, ultimaCol = -1, rebote = 0;
  var ac = null;
  function tono(f, v, d) { try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume(); var o = ac.createOscillator(), gn = ac.createGain(); o.type = 'triangle'; o.frequency.value = f; gn.gain.setValueAtTime(v, ac.currentTime); gn.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d); o.connect(gn); gn.connect(ac.destination); o.start(); o.stop(ac.currentTime + d); } catch (e) {} }
  function ex() { tono(660, 0.2, 0.2); setTimeout(function () { tono(880, 0.2, 0.3); }, 130); }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; ex(); pintar(); }
  function mezclar(a) { return a.slice().sort(function () { return Math.random() - 0.5; }); }
  function emoji(e, x, y, s) { g.font = s + 'px system-ui'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#000'; g.fillText(e, x, y); }
  var BX = [150, 360, 570, 780];
  function fondo() { var gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#9ee0ff'); gr.addColorStop(1, '#e2f8d4'); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.fillStyle = '#7ed56f'; g.fillRect(0, H - 40, W, 40); g.font = '50px system-ui'; g.textAlign = 'center'; g.fillStyle = '#000'; g.fillText('☀️', 900, 56); g.fillText('🌳', 40, H - 60); g.fillText('🌳', 920, H - 60); }
  function caneca(i) {
    var x = BX[i], y = H - 150, c = BINS[i][2], bump = rebote > 0 && ultimaCol === i ? Math.sin(rebote * 20) * 6 : 0;
    g.save(); g.translate(x, y - bump); g.fillStyle = c; g.strokeStyle = '#2a1b4a'; g.lineWidth = 4; g.beginPath(); g.moveTo(-60, 0); g.lineTo(60, 0); g.lineTo(50, 112); g.lineTo(-50, 112); g.closePath(); g.fill(); g.stroke(); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(-66, -12, 132, 14); g.strokeRect(-66, -12, 132, 14);
    g.font = '40px system-ui'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#000'; g.fillText('♻️', 0, 40); g.fillStyle = '#2a1b4a'; g.font = '700 18px "Space Grotesk",system-ui,sans-serif'; g.fillStyle = '#fff'; g.fillText(BINS[i][1], 0, 88); g.restore();
  }
  function dib() {
    fondo(); if (paso < 2) BINS.forEach(function (b, i) { caneca(i); });
    if (paso === 0 && !fin) { var it = cola[idx]; emoji(it[0], W / 2, 120, 110); g.fillStyle = '#2a1b4a'; g.font = '700 26px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'center'; g.fillText(it[1], W / 2, 200); g.font = '600 18px "Space Grotesk",system-ui,sans-serif'; g.fillText('Toca la caneca correcta · ' + (idx + 1) + ' de 6', W / 2, 40); }
    if (paso === 0 && fin) { g.fillStyle = aciertos >= 5 ? '#1c7a3a' : '#a02a2a'; g.font = '700 34px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'center'; g.fillText(aciertos >= 5 ? '¡Muy bien! ' + aciertos + ' de 6' : 'Aciertos: ' + aciertos + ' de 6. ¡Otra vez!', W / 2, 130); }
    if (paso === 1) { if (caida && !fin) { emoji(caida.it[0], caida.x, caida.y, 84); } g.fillStyle = '#2a1b4a'; g.font = '700 20px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'center'; g.fillText(fin ? (aciertos >= 7 ? '¡Excelente! ' : 'Hiciste ') + aciertos + ' aciertos de 10' + (aciertos >= 7 ? '' : ' · ¡Intenta otra vez!') : 'Objeto ' + Math.min(10, idx + 1) + ' de 10 · aciertos ' + aciertos, W / 2, 34); }
    if (paso === 2) { g.fillStyle = '#2a1b4a'; g.textAlign = 'center'; if (qi < 5) { g.font = '700 30px "Space Grotesk",system-ui,sans-serif'; wrapT(quiz[qi][0], W / 2, 170, 700); g.font = '600 20px "Space Grotesk",system-ui,sans-serif'; g.fillText('¿Cuál de las 3 erres es?', W / 2, 270); } else { g.font = '700 34px "Space Grotesk",system-ui,sans-serif'; g.fillStyle = qok >= 4 ? '#1c7a3a' : '#a02a2a'; g.fillText(qok >= 4 ? '¡Muy bien! ' + qok + ' de 5' : 'Aciertos: ' + qok + ' de 5. ¡Otra vez!', W / 2, 190); } g.fillStyle = '#2a1b4a'; g.font = '700 22px "Space Grotesk",system-ui,sans-serif'; g.fillText(msj, W / 2, 360); }
    if (paso < 2 && msj) { g.fillStyle = msj.indexOf('✔') > -1 ? '#1c7a3a' : '#a02a2a'; g.font = '700 24px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'center'; g.fillText(msj, W / 2, 250); }
  }
  function wrapT(t, x, y, max) { var ws = t.split(' '), l = '', ls = []; ws.forEach(function (w) { var tt = l ? l + ' ' + w : w; if (g.measureText(tt).width > max) { ls.push(l); l = w; } else l = tt; }); ls.push(l); ls.forEach(function (s, i) { g.fillText(s, x, y - (ls.length - 1) * 18 + i * 36); }); }
  var last = 0;
  function frame(ms) { var dt = Math.min(0.05, (ms - (last || ms)) / 1000); last = ms; tiempo += dt; rebote = Math.max(0, rebote - dt); sim(dt); dib(); requestAnimationFrame(frame); }
  function sim(dt) {
    if (paso === 1 && !fin && caida) { caida.y += dt * (90 + idx * 14); if (caida.y > H - 150) { msj = '✖ Se cayó: era ' + BINS[caida.it[2]][1]; tono(200, 0.15, 0.25); siguiente1(); } }
  }
  function nuevo1() { cola = mezclar(ITEMS).slice(0, 10); idx = 0; aciertos = 0; fin = false; msj = ''; caida = { it: cola[0], x: 150 + Math.random() * 660, y: 40 }; }
  function siguiente1() { idx++; if (idx >= 10) { fin = true; caida = null; if (aciertos >= 7) cumplir(1); ctl(); } else caida = { it: cola[idx], x: 150 + Math.random() * 660, y: 40 }; }
  function nuevo0() { cola = mezclar(ITEMS).slice(0, 6); idx = 0; aciertos = 0; fin = false; msj = ''; }
  function elegir(i) {
    ultimaCol = i; rebote = 0.4;
    if (paso === 0) { if (fin) return; var it = cola[idx], ok = it[2] === i; if (ok) { aciertos++; msj = '✔ ¡Bien!'; tono(740, 0.12, 0.15); } else { msj = '✖ Iba en ' + BINS[it[2]][1]; tono(200, 0.12, 0.2); } idx++; if (idx >= 6) { fin = true; if (aciertos >= 5) cumplir(0); ctl(); } }
    else if (paso === 1) { if (fin || !caida) return; var ok1 = caida.it[2] === i; if (ok1) { aciertos++; msj = '✔ ¡Bien!'; tono(740, 0.12, 0.15); } else { msj = '✖ Iba en ' + BINS[caida.it[2]][1]; tono(200, 0.12, 0.2); } siguiente1(); }
  }
  function resp2(v) { if (qi >= 5) return; if (quiz[qi][1] === v) { qok++; msj = '✔ ¡Correcto!'; tono(740, 0.12, 0.15); } else { msj = '✖ Era ' + ['Reducir', 'Reutilizar', 'Reciclar'][quiz[qi][1]]; tono(200, 0.12, 0.2); } qi++; if (qi >= 5) { if (qok >= 4) cumplir(2); ctl(); } }
  function nuevo2() { quiz = mezclar(ACC).slice(0, 5); qi = 0; qok = 0; msj = ''; }
  function xy(e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; }
  cv.addEventListener('click', function (e) { var q = xy(e); if (paso > 1) return; if (q[1] > H - 170) for (var i = 0; i < 4; i++) if (Math.abs(q[0] - BX[i]) < 75) { elegir(i); return; } });
  function ctl() {
    var c = $('ctl'); c.textContent = '';
    function btn(txt, fn, cls) { var b = document.createElement('button'); b.type = 'button'; b.className = cls || 'btn sec'; b.textContent = txt; b.onclick = fn; c.appendChild(b); }
    if (paso < 2) BINS.forEach(function (b, i) { btn(b[0] + ' ' + b[1], function () { elegir(i); }, 'btn'); });
    if (paso === 2) { btn('➖ Reducir', function () { resp2(0); }, 'btn grande'); btn('🔁 Reutilizar', function () { resp2(1); }, 'btn grande'); btn('♻️ Reciclar', function () { resp2(2); }, 'btn grande'); }
    if (fin && ((paso === 0 && aciertos < 5) || (paso === 1 && aciertos < 7))) btn('🔄 Reintentar', function () { if (paso === 0) nuevo0(); else nuevo1(); ctl(); }, 'btn');
    if (paso === 2 && qi >= 5 && qok < 4) btn('🔄 Reintentar', function () { nuevo2(); ctl(); }, 'btn');
  }
  function pintar() {
    var p = $('pasos'); p.textContent = '';
    PASOS.forEach(function (Q, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === paso)); b.innerHTML = '<b>' + (hecho[i] ? '✓' : i + 1) + '</b>' + Q.n; b.onclick = function () { ir(i); }; p.appendChild(b); });
    var Q = PASOS[paso]; $('tit').textContent = Q.t; $('txt').innerHTML = Q.x; $('misTxt').textContent = hecho[paso] ? '¡Muy bien! Misión cumplida ✔' : Q.m; $('dato').textContent = '💡 ' + Q.d;
    $('mis').className = 'mision' + (hecho[paso] ? ' ok' : ''); $('bAnt').disabled = paso === 0; $('bSig').disabled = paso === 2; $('fin').className = 'fin' + (hecho.every(Boolean) ? ' v' : '');
  }
  function ir(n) { paso = n; msj = ''; if (n === 0) nuevo0(); if (n === 1) nuevo1(); if (n === 2) nuevo2(); ctl(); pintar(); }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); }; $('bSig').onclick = function () { if (paso < 2) ir(paso + 1); };
  window.__rec = { ir: ir, elegir: elegir, resp: resp2, actual: function () { return paso === 0 ? (cola[idx] || [0, 0, -1])[2] : paso === 1 ? (caida ? caida.it[2] : -1) : (qi < 5 ? quiz[qi][1] : -1); }, estado: function () { return { hecho: hecho.slice(), aciertos: aciertos }; } };
  nuevo0(); ctl(); pintar(); requestAnimationFrame(frame);
})();
