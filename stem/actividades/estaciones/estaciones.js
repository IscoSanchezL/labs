/* Las estaciones (2°, solo español, sin voz): el árbol cambia, qué hacemos en cada estación y el orden del año. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var cv = $('cv'), g = cv.getContext('2d'), W = cv.width, H = cv.height;
  var EST = [{ n: 'Primavera', e: '🌸' }, { n: 'Verano', e: '☀️' }, { n: 'Otoño', e: '🍂' }, { n: 'Invierno', e: '❄️' }];
  var PASOS = [
    { n: 'El árbol cambia', t: '1. Un año, cuatro estaciones', x: 'En muchos países el año se divide en cuatro <b>estaciones</b>: <b>primavera</b>, <b>verano</b>, <b>otoño</b> e <b>invierno</b>. El clima cambia y los árboles también. Toca cada estación y mira el árbol.', m: 'Mira el árbol en las cuatro estaciones.', d: 'Cerca del ecuador, como en Colombia, hay casi siempre el mismo clima: lluvioso o seco.' },
    { n: '¿Qué pasa en cada una?', t: '2. ¿De qué estación es?', x: 'En <b>primavera</b> florecen las plantas. En <b>verano</b> hace calor. En <b>otoño</b> caen las hojas. En <b>invierno</b> hace frío y puede nevar.', m: 'Acierta cuatro veces a qué estación pertenece cada cosa.', juego: 1, d: 'Los osos duermen casi todo el invierno: se llama hibernar.' },
    { n: 'Ordena el año', t: '3. El ciclo del año', x: 'Las estaciones siguen siempre el mismo orden y se repiten cada año: primavera, verano, otoño, invierno… y otra vez primavera.', m: 'Toca las estaciones en el orden correcto, empezando por la primavera.', d: 'Las estaciones existen porque la Tierra está inclinada mientras da la vuelta al Sol.' }
  ];
  var CASOS = [['🌷 Salen las flores', 0], ['🏖️ Vamos a la playa con mucho calor', 1], ['🍁 Las hojas caen al suelo', 2], ['⛄ Hacemos un muñeco de nieve', 3], ['🐝 Las abejas visitan las flores nuevas', 0], ['🍉 Comemos sandía bajo el sol', 1], ['🧣 Nos ponemos bufanda y guantes', 3], ['🍄 Recogemos hojas secas y hongos', 2]];
  var paso = 0, hecho = [false, false, false], est = 0, vistos = {}, tiempo = 0, cola = [], ronda = 0, aciertos = 0, msj = '', orden = 0, parts = [];
  var ac = null;
  function tono(f, v, d) { try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume(); var o = ac.createOscillator(), gn = ac.createGain(); o.type = 'triangle'; o.frequency.value = f; gn.gain.setValueAtTime(v, ac.currentTime); gn.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d); o.connect(gn); gn.connect(ac.destination); o.start(); o.stop(ac.currentTime + d); } catch (e) {} }
  function ex() { tono(660, 0.2, 0.2); setTimeout(function () { tono(880, 0.2, 0.3); }, 130); }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; ex(); if (window.STEMFX) STEMFX.exito(); pintar(); }
  function mezclar(a) { return a.slice().sort(function () { return Math.random() - 0.5; }); }
  function txt(s, x, y, col, al, tam) { g.font = '700 ' + (tam || 20) + 'px "Space Grotesk",system-ui,sans-serif'; g.fillStyle = col || '#2a1b4a'; g.textAlign = al || 'center'; g.textBaseline = 'alphabetic'; g.fillText(s, x, y); }
  function arbol(e) {
    var cielos = [['#9ee0ff', '#e8f9d6'], ['#4fb4ff', '#d6f5ff'], ['#ffb27a', '#ffe7c4'], ['#a9b8d4', '#e8eef8']], suelo = ['#7ed56f', '#58b765', '#c58a3a', '#f4f8ff'];
    var gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, cielos[e][0]); gr.addColorStop(1, cielos[e][1]); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.fillStyle = suelo[e]; g.fillRect(0, 360, W, 100);
    if (e === 1) { g.font = '84px system-ui'; g.textAlign = 'center'; g.fillStyle = '#000'; g.fillText('☀️', 820, 100); }
    if (e === 3) { g.font = '60px system-ui'; g.fillStyle = '#000'; g.textAlign = 'center'; g.fillText('☁️', 760, 70); g.fillText('☁️', 160, 90); }
    g.save(); g.translate(0, 34);
    g.fillStyle = '#7a5a30'; g.fillRect(450, 200, 60, 170); g.beginPath(); g.moveTo(480, 230); g.lineTo(380, 170); g.lineTo(386, 160); g.lineTo(486, 214); g.fill(); g.beginPath(); g.moveTo(480, 240); g.lineTo(580, 180); g.lineTo(574, 168); g.lineTo(474, 222); g.fill();
    var cols = ['#7fd66b', '#3fa84a', '#e8892a', null][e]; if (cols) { [[480, 130, 100], [400, 170, 70], [560, 170, 70], [440, 100, 60], [520, 100, 60]].forEach(function (c) { g.fillStyle = cols; g.beginPath(); g.arc(c[0], c[1], c[2], 0, 7); g.fill(); }); }
    else { g.strokeStyle = '#7a5a30'; g.lineWidth = 8; g.beginPath(); g.moveTo(480, 200); g.lineTo(420, 120); g.moveTo(480, 200); g.lineTo(540, 120); g.stroke(); g.fillStyle = '#fff'; [[380, 168], [586, 172], [420, 116], [542, 116]].forEach(function (c) { g.beginPath(); g.arc(c[0], c[1], 14, 0, 7); g.fill(); }); g.fillRect(445, 192, 70, 10); }
    if (e === 0) { g.font = '28px system-ui'; g.fillStyle = '#000'; [[430, 110], [500, 80], [540, 150], [410, 160], [470, 140]].forEach(function (c) { g.fillText('🌸', c[0], c[1]); }); g.fillText('🌷', 250, 400); g.fillText('🌼', 700, 410); g.fillText('🐝', 650 + Math.sin(tiempo * 3) * 30, 220 + Math.cos(tiempo * 2) * 20); }
    if (e === 1) { g.font = '28px system-ui'; g.fillStyle = '#000'; [[440, 120], [520, 150], [400, 180], [560, 110]].forEach(function (c) { g.fillText('🍎', c[0], c[1]); }); g.fillText('🍉', 700, 420); g.fillText('🌻', 260, 410); }
    if (e === 2) { g.font = '28px system-ui'; g.fillStyle = '#000'; g.fillText('🍄', 300, 410); g.fillText('🍂', 640, 410); g.fillText('🎃', 720, 420); }
    if (e === 3) { g.font = '60px system-ui'; g.fillStyle = '#000'; g.fillText('⛄', 700, 400); }
    g.restore();
    // partículas
    if (parts.length < 40) parts.push({ x: Math.random() * W, y: -10, v: 40 + Math.random() * 60, ph: Math.random() * 6 });
    parts = parts.filter(function (p) { p.y += p.v / 60; p.x += Math.sin(tiempo * 2 + p.ph) * 0.8; if (e === 0 || e === 1) return false; g.font = '22px system-ui'; g.fillStyle = '#000'; g.textAlign = 'center'; g.fillText(e === 2 ? '🍂' : '❄️', p.x, p.y); return p.y < 380; });
    txt(EST[e].e + ' ' + EST[e].n, W / 2, 44, '#2a1b4a', 'center', 34);
  }
  function dib() {
    if (paso === 0) { arbol(est); txt('Estaciones vistas: ' + Object.keys(vistos).length + ' de 4', W / 2, 84, '#2a1b4a', 'center', 18); }
    else if (paso === 1) { var gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#cfe9ff'); gr.addColorStop(1, '#f1e5ff'); g.fillStyle = gr; g.fillRect(0, 0, W, H); if (ronda < 5) { txt(cola[ronda][0], W / 2, 190, '#2a1b4a', 'center', 40); txt('¿De qué estación es?', W / 2, 270, '#2a1b4a', 'center', 24); } else txt(aciertos >= 4 ? '¡Muy bien! ' + aciertos + ' de 5' : 'Aciertos: ' + aciertos + ' de 5. ¡Otra vez!', W / 2, 220, aciertos >= 4 ? '#1c7a3a' : '#a02a2a', 'center', 36); txt(msj, W / 2, 350, msj.indexOf('✔') > -1 ? '#1c7a3a' : '#a02a2a', 'center', 22); txt('Ronda ' + Math.min(5, ronda + 1) + ' de 5', W / 2, 440, '#5a4a8a', 'center', 16); }
    else { var gr3 = g.createLinearGradient(0, 0, 0, H); gr3.addColorStop(0, '#cfe9ff'); gr3.addColorStop(1, '#f1e5ff'); g.fillStyle = gr3; g.fillRect(0, 0, W, H); for (var i = 0; i < 4; i++) { var x = 150 + i * 220, hecha = i < orden; g.fillStyle = hecha ? '#fff6c8' : 'rgba(255,255,255,.6)'; g.strokeStyle = '#2a1b4a'; g.lineWidth = 4; g.setLineDash(hecha ? [] : [8, 8]); g.beginPath(); g.roundRect ? g.roundRect(x - 80, 130, 160, 180, 22) : g.rect(x - 80, 130, 160, 180); g.fill(); g.stroke(); g.setLineDash([]); if (hecha) { g.font = '70px system-ui'; g.fillStyle = '#000'; g.textAlign = 'center'; g.fillText(EST[i].e, x, 214); txt(EST[i].n, x, 280, '#2a1b4a', 'center', 22); } else txt(String(i + 1), x, 238, 'rgba(42,27,74,.5)', 'center', 44); if (i < 3) txt('➜', x + 110, 230, '#2a1b4a', 'center', 36); } txt(orden >= 4 ? '¡Y vuelve a empezar: otra vez primavera! 🔄' : 'Toca la estación que sigue', W / 2, 400, '#2a1b4a', 'center', 24); txt(msj, W / 2, 440, '#a02a2a', 'center', 20); }
  }
  var last = 0;
  function frame(ms) { var dt = Math.min(0.05, (ms - (last || ms)) / 1000); last = ms; tiempo += dt; dib(); requestAnimationFrame(frame); }
  function resp(i) { if (ronda >= 5) return; var ok = cola[ronda][1] === i; if (ok) { aciertos++; msj = '✔ ¡Correcto!'; tono(740, 0.12, 0.15); } else { msj = '✖ Era ' + EST[cola[ronda][1]].n.toLowerCase(); tono(200, 0.12, 0.2); } ronda++; if (ronda >= 5 && aciertos >= 4) cumplir(1); ctl(); }
  function orde(i) { if (orden >= 4) return; if (i === orden) { orden++; msj = ''; tono(560 + orden * 80, 0.12, 0.15); if (orden >= 4) cumplir(2); } else { msj = '✖ Todavía no: ¿cuál sigue?'; tono(200, 0.12, 0.2); } }
  function ctl() {
    var c = $('ctl'); c.textContent = '';
    function btn(txt, fn, cls, pr) { var b = document.createElement('button'); b.type = 'button'; b.className = cls || 'btn sec'; b.textContent = txt; b.onclick = fn; if (pr !== undefined) b.setAttribute('aria-pressed', String(pr)); c.appendChild(b); }
    if (paso === 0) EST.forEach(function (e, i) { btn(e.e + ' ' + e.n, function () { est = i; vistos[i] = 1; parts = []; tono(400 + i * 100, 0.1, 0.2); if (Object.keys(vistos).length >= 4) cumplir(0); ctl(); }, 'tab', est === i); });
    if (paso === 1) { EST.slice().forEach(function (e, i) { btn(e.e + ' ' + e.n, function () { resp(i); }, 'btn'); }); if (ronda >= 5 && aciertos < 4) btn('🔄 Reintentar', function () { nuevo(); ctl(); }, 'btn'); }
    if (paso === 2) { mezclar([0, 1, 2, 3]).forEach(function (i) { btn(EST[i].e + ' ' + EST[i].n, function () { orde(i); }, 'btn'); }); btn('🔄 Empezar de nuevo', function () { orden = 0; msj = ''; }, 'btn sec'); }
  }
  function nuevo() { cola = mezclar(CASOS).slice(0, 5); ronda = 0; aciertos = 0; msj = ''; }
  function pintar() {
    var p = $('pasos'); p.textContent = '';
    PASOS.forEach(function (Q, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === paso)); b.innerHTML = '<b>' + (hecho[i] ? '✓' : i + 1) + '</b>' + Q.n; b.onclick = function () { ir(i); }; p.appendChild(b); });
    var Q = PASOS[paso]; $('tit').textContent = Q.t; $('txt').innerHTML = Q.x; $('misTxt').textContent = hecho[paso] ? '¡Muy bien! Misión cumplida ✔' : Q.m; $('dato').textContent = '💡 ' + Q.d;
    $('mis').className = 'mision' + (hecho[paso] ? ' ok' : ''); $('bAnt').disabled = paso === 0; $('bSig').disabled = paso === 2; $('fin').className = 'fin' + (hecho.every(Boolean) ? ' v' : '');
  }
  function ir(n) { paso = n; msj = ''; if (n === 1) nuevo(); if (n === 2) { orden = 0; } ctl(); pintar(); }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); }; $('bSig').onclick = function () { if (paso < 2) ir(paso + 1); };
  window.__est = { ir: ir, set: function (i) { est = i; vistos[i] = 1; if (Object.keys(vistos).length >= 4) cumplir(0); }, c: function () { return ronda < 5 ? cola[ronda][1] : -1; }, resp: resp, orde: orde, estado: function () { return { hecho: hecho.slice() }; } };
  nuevo(); ctl(); pintar(); requestAnimationFrame(frame);
})();
