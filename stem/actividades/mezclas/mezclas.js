/* Mezclas y disoluciones (3°, solo español, sin voz): qué se disuelve, cómo se separan las mezclas y la saturación. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var cv = $('cv'), g = cv.getContext('2d'), W = cv.width, H = cv.height;
  var PASOS = [
    { n: 'Qué se disuelve', t: '1. Algunas cosas se disuelven en agua', x: 'Si una sustancia se <b>disuelve</b>, se mezcla tan bien con el agua que ya no la ves: es una <b>disolución</b>. Si no se disuelve, forma una <b>mezcla</b> y se ve separada.', m: 'Prueba las 4 sustancias en el agua.', d: 'El agua del mar es una disolución: tiene sal disuelta.' },
    { n: 'Separar mezclas', t: '2. Cómo se separa una mezcla', x: 'Cada mezcla se separa con un método distinto: <b>filtrar</b> deja pasar el agua y atrapa lo sólido; <b>decantar</b> separa líquidos que no se mezclan; <b>evaporar</b> saca el agua y deja la sal.', m: 'Separa las 3 mezclas con el método correcto.', d: 'Así se saca la sal del mar en las salinas: el Sol evapora el agua.' },
    { n: 'Disolución saturada', t: '3. ¿Cuánto se puede disolver?', x: 'El agua solo puede disolver una cantidad. Cuando ya no puede más, la disolución está <b>saturada</b> y lo que sobra se queda en el fondo. Con agua <b>caliente</b> se disuelve más.', m: 'Satura el agua fría y el agua caliente.', d: 'Por eso el té caliente aguanta más azúcar que el té frío.' }
  ];
  var paso = 0, hecho = [false, false, false];
  var ac = null;
  function tono(f, v, d) { try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume(); var o = ac.createOscillator(), G = ac.createGain(), n = ac.currentTime; o.type = 'sine'; o.frequency.value = f; G.gain.setValueAtTime(0.0001, n); G.gain.exponentialRampToValueAtTime(v, n + 0.01); G.gain.exponentialRampToValueAtTime(0.0001, n + d); o.connect(G); G.connect(ac.destination); o.start(); o.stop(n + d + 0.05); } catch (e) {} }
  function plop() { tono(300 + Math.random() * 120, 0.14, 0.12); }
  function ex() { tono(660, 0.2, 0.2); setTimeout(function () { tono(880, 0.2, 0.3); }, 130); }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; ex(); if (window.STEMFX) STEMFX.exito(); pintar(); }
  function dibT(s, x, y, tam, col, al) { g.font = '700 ' + tam + 'px "Space Grotesk",system-ui,sans-serif'; g.fillStyle = col || '#eaf2fb'; g.textAlign = al || 'center'; g.fillText(s, x, y); }
  function fondo() { var gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#0e2038'); gr.addColorStop(1, '#09111f'); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.fillStyle = '#16263d'; g.fillRect(0, H - 50, W, 50); }
  /* vaso: x centro, base y, ancho, alto, nivel de agua 0..1 */
  function vaso(x, yb, w, h, nivel, tinte) {
    var ya = yb - h * nivel; g.fillStyle = tinte || 'rgba(120,190,255,.35)'; g.fillRect(x - w / 2 + 4, ya, w - 8, yb - ya - 4);
    g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 4; g.beginPath(); g.moveTo(x - w / 2, yb - h); g.lineTo(x - w / 2 + 8, yb); g.lineTo(x + w / 2 - 8, yb); g.lineTo(x + w / 2, yb - h); g.stroke();
    return ya;
  }

  /* ---------- paso 1: qué se disuelve ---------- */
  var SUS = { sal: { n: 'Sal', e: '🧂', disuelve: 1, c: '#f4f4f4' }, azucar: { n: 'Azúcar', e: '🍬', disuelve: 1, c: '#fff0c8' }, arena: { n: 'Arena', e: '🏖️', disuelve: 0, c: '#d9b574' }, aceite: { n: 'Aceite', e: '🫒', disuelve: 0, c: '#ffd34a' } };
  var part = [], probadas = {}, agita = 0, msj1 = '';
  var GX = 480, GY = 400, GW = 230, GH = 250, NIV = 0.7;
  function echar(k) {
    plop(); probadas[k] = true; var s = SUS[k], n = k === 'aceite' ? 14 : 34;
    for (var i = 0; i < n; i++) part.push({ k: k, x: GX + (Math.random() - 0.5) * 70, y: GY - GH - 40 - Math.random() * 60, vy: 1 + Math.random() * 2, edad: 0, quieta: false, r: k === 'aceite' ? 9 : 3 + Math.random() * 2 });
    msj1 = s.n + (s.disuelve ? ': ¡se disuelve! Es una disolución.' : (k === 'aceite' ? ': no se disuelve, flota. Es una mezcla.' : ': no se disuelve, se hunde. Es una mezcla.'));
    if (Object.keys(probadas).length === 4) cumplir(0);
  }
  function dib1(dt) {
    fondo(); var ya = vaso(GX, GY, GW, GH, NIV); var fondoY = GY - 12;
    part = part.filter(function (p) { return !(p.alpha !== undefined && p.alpha <= 0); });
    part.forEach(function (p) {
      var s = SUS[p.k], liq = ya + (p.k === 'aceite' ? 8 : 0);
      if (!p.quieta) { p.y += p.vy; p.vy = Math.min(p.vy + 0.15, p.k === 'aceite' ? 1.4 : 4); if (p.k === 'aceite') { if (p.y >= ya + 6) { p.y = ya + 6; p.quieta = true; } } else if (p.y >= fondoY - Math.random() * 6 && !s.disuelve) { p.y = fondoY - Math.random() * 10; p.quieta = true; } else if (s.disuelve && p.y >= fondoY - 10) { p.y = fondoY - 10; p.quieta = true; } }
      if (p.quieta && s.disuelve) { p.edad += dt * (1 + agita * 3); if (p.edad > 1.2) { p.alpha = (p.alpha === undefined ? 1 : p.alpha) - dt * (0.8 + agita * 2.5); } }
      var a = p.alpha === undefined ? 1 : Math.max(0, p.alpha); g.globalAlpha = a; g.fillStyle = s.c; g.beginPath(); if (p.k === 'aceite') g.ellipse(p.x, p.y, p.r * 1.6, p.r * 0.7, 0, 0, 7); else g.arc(p.x, p.y, p.r, 0, 7); g.fill(); g.globalAlpha = 1;
    });
    agita = Math.max(0, agita - dt * 1.2);
    if (agita > 0) { g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 5; g.beginPath(); g.moveTo(GX + Math.sin(tiempo * 14) * 24, GY - GH - 20); g.lineTo(GX + Math.sin(tiempo * 14) * 24 + 8, GY - 40); g.stroke(); }
    var i = 0; Object.keys(SUS).forEach(function (k) { var x = 90 + i * 0, y = 70 + i * 40; i++; g.fillStyle = probadas[k] ? 'rgba(139,232,174,.2)' : 'rgba(255,255,255,.08)'; g.beginPath(); g.roundRect(660, y - 22, 250, 32, 12); g.fill(); dibT(SUS[k].e + ' ' + SUS[k].n + ': ' + (probadas[k] ? (SUS[k].disuelve ? 'se disuelve ✓' : 'no se disuelve ✗') : '?'), 785, y, 18, probadas[k] ? '#eaf2fb' : '#7f97ae'); });
    if (msj1) dibT(msj1, W / 2, 36, 22, '#ffe08a');
  }

  /* ---------- paso 2: separar ---------- */
  var MEZ = { arena: { n: 'Arena + agua', ok: 'filtrar' }, aceite: { n: 'Aceite + agua', ok: 'decantar' }, sal: { n: 'Sal + agua', ok: 'evaporar' } };
  var sep = { mez: 'arena', met: null, p: 0, res: '' }, resueltas = {};
  function elegirMez(k) { sep.mez = k; sep.met = null; sep.p = 0; sep.res = ''; ctl(); }
  function metodo(m) {
    sep.met = m; sep.p = 0.001; var ok = MEZ[sep.mez].ok === m; plop();
    sep.res = ok ? '¡Funciona! ' + (m === 'filtrar' ? 'La arena queda en el filtro y pasa agua limpia.' : m === 'decantar' ? 'El aceite flota arriba y se retira con cuidado.' : 'El agua se evapora y la sal queda en el fondo.') : '✗ No funciona: ' + (m === 'filtrar' ? 'la sal y el aceite pasan por el filtro.' : m === 'decantar' ? 'solo sirve para líquidos que no se mezclan, como el aceite.' : 'se perdería el agua y la arena o el aceite se quedan igual.');
    sep.ok = ok; if (ok) { resueltas[sep.mez] = true; if (Object.keys(resueltas).length === 3) cumplir(1); ctl(); }
  }
  function dib2(dt) {
    fondo(); if (sep.p > 0 && sep.p < 1) sep.p = Math.min(1, sep.p + dt * 0.35); var p = sep.p, m = sep.mez, met = sep.met;
    var res = met && sep.ok;
    // vaso con la mezcla
    var nivel = (met === 'evaporar' && res) ? 0.7 * (1 - p) : 0.7; var ya = vaso(300, 380, 200, 230, nivel);
    if (m === 'arena') { g.fillStyle = '#d9b574'; for (var i = 0; i < 40; i++) { g.beginPath(); g.arc(215 + (i * 37) % 170, res && met === 'filtrar' ? 360 - ((i * 13) % 12) : 352 - ((i * 53 * (1 - 0) ) % 100) * (res && met === 'filtrar' ? 0 : 1) , 3, 0, 7); g.fill(); } }
    if (m === 'aceite') { g.fillStyle = '#ffd34a'; g.fillRect(210, ya, 180, res && met === 'decantar' ? 26 * (1 - p) + 2 : 26); }
    if (m === 'sal') { g.fillStyle = 'rgba(255,255,255,.85)'; if (res && met === 'evaporar') { for (var j = 0; j < 30; j++) { g.fillRect(222 + (j * 29) % 160, 366 - (j * 7) % 8, 5, 5); } dibT('☀️', 300, 130, 60); } }
    if (res && met === 'filtrar' && m === 'arena') { dibT('🧻', 300, 110, 54); g.fillStyle = 'rgba(120,190,255,.5)'; g.fillRect(560, 390 - 80 * p, 100, 80 * p); g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 4; g.strokeRect(555, 300, 110, 90); dibT('agua limpia', 610, 290, 18, '#9db8ff'); }
    if (res && met === 'decantar' && m === 'aceite') { g.fillStyle = '#ffd34a'; g.fillRect(560, 390 - 26 * p, 100, 26 * p); g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 4; g.strokeRect(555, 300, 110, 90); dibT('aceite aparte', 610, 290, 18, '#ffd34a'); }
    dibT(MEZ[m].n, 300, 70, 26, '#eaf2fb');
    if (sep.res) wrapT(sep.res, 700, 150, 300, 20, sep.ok ? '#8be8ae' : '#ff9f9f');
    var k = 0; Object.keys(MEZ).forEach(function (q) { dibT((resueltas[q] ? '✓ ' : '· ') + MEZ[q].n, 790, 330 + k * 30, 18, resueltas[q] ? '#8be8ae' : '#7f97ae'); k++; });
  }
  function wrapT(txt, x, y, ancho, tam, col) { g.font = '500 ' + tam + 'px "Space Grotesk",system-ui,sans-serif'; g.fillStyle = col; g.textAlign = 'center'; var pal = txt.split(' '), ln = ''; pal.forEach(function (w) { if (g.measureText(ln + w).width > ancho) { g.fillText(ln, x, y); y += tam + 6; ln = ''; } ln += w + ' '; }); g.fillText(ln, x, y); }

  /* ---------- paso 3: saturación ---------- */
  var sat = { caliente: false, cucharadas: 0, sobrantes: 0, vistoFrio: false, vistoCaliente: false };
  function cap() { return sat.caliente ? 9 : 5; }
  function cucharada() {
    plop();
    if (sat.cucharadas < cap()) sat.cucharadas++; else sat.sobrantes++;
    if (sat.sobrantes >= 1) { if (sat.caliente) sat.vistoCaliente = true; else sat.vistoFrio = true; if (sat.vistoFrio && sat.vistoCaliente) cumplir(2); }
  }
  function dib3() {
    fondo(); var tinte = sat.caliente ? 'rgba(255,170,120,.35)' : 'rgba(120,190,255,.35)'; var ya = vaso(480, 400, 250, 270, 0.72, tinte);
    var dulce = Math.min(1, sat.cucharadas / 9); g.fillStyle = 'rgba(255,240,200,' + (0.28 * dulce) + ')'; g.fillRect(480 - 121, ya, 242, 400 - ya - 4);
    g.fillStyle = '#fff0c8'; for (var i = 0; i < sat.sobrantes * 14; i++) { g.beginPath(); g.arc(380 + (i * 41) % 200, 392 - Math.floor(i / 12) * 5 - (i % 3), 4, 0, 7); g.fill(); }
    if (sat.caliente) { dibT('♨️', 480, 110, 54); }
    dibT('Cucharadas disueltas: ' + sat.cucharadas + (sat.cucharadas >= cap() ? ' · ¡SATURADA!' : ''), 480, 40, 24, sat.cucharadas >= cap() ? '#ffe08a' : '#eaf2fb');
    dibT((sat.vistoFrio ? '✓' : '·') + ' agua fría saturada     ' + (sat.vistoCaliente ? '✓' : '·') + ' agua caliente saturada', 480, 76, 18, '#9db8ff');
    if (sat.sobrantes) dibT('Lo que sobra se queda en el fondo', 480, 440, 18, '#ffe08a');
  }

  var tiempo = 0, last = 0;
  function frame(ms) { tiempo = ms / 1000; var dt = Math.min(0.1, (ms - last) / 1000); last = ms; if (paso === 0) dib1(dt); else if (paso === 1) dib2(dt); else dib3(); requestAnimationFrame(frame); }
  function ctl() {
    var c = $('ctl'); c.textContent = '';
    function btn(txt, fn, cls, pr) { var b = document.createElement('button'); b.type = 'button'; b.className = (cls || 'btn sec'); b.textContent = txt; b.onclick = fn; if (pr !== undefined) b.setAttribute('aria-pressed', String(pr)); c.appendChild(b); return b; }
    if (paso === 0) { Object.keys(SUS).forEach(function (k) { btn(SUS[k].e + ' ' + SUS[k].n, function () { echar(k); }, 'btn'); }); btn('🥄 Revolver', function () { agita = 1.5; plop(); }, 'btn sec'); btn('↺ Vaso limpio', function () { part = []; msj1 = ''; }, 'btn sec'); }
    if (paso === 1) { Object.keys(MEZ).forEach(function (k) { btn((resueltas[k] ? '✓ ' : '') + MEZ[k].n, function () { elegirMez(k); }, 'tab', sep.mez === k); }); [['filtrar', '🧻 Filtrar'], ['decantar', '🫗 Decantar'], ['evaporar', '☀️ Evaporar']].forEach(function (m) { btn(m[1], function () { metodo(m[0]); }, 'btn'); }); }
    if (paso === 2) { btn('🥄 Echar una cucharada de azúcar', cucharada, 'btn grande'); btn('🧊 Agua fría', function () { sat.caliente = false; sat.cucharadas = 0; sat.sobrantes = 0; ctl(); }, 'tab', !sat.caliente); btn('♨️ Agua caliente', function () { sat.caliente = true; sat.cucharadas = 0; sat.sobrantes = 0; ctl(); }, 'tab', sat.caliente); }
    Array.prototype.forEach.call(c.querySelectorAll('.tab'), function (b) { b.className = 'tab'; });
  }
  function pintar() {
    var p = $('pasos'); p.textContent = '';
    PASOS.forEach(function (P, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === paso)); b.innerHTML = '<b>' + (hecho[i] ? '✓' : i + 1) + '</b>' + P.n; b.onclick = function () { ir(i); }; p.appendChild(b); });
    var P = PASOS[paso]; $('tit').textContent = P.t; $('txt').innerHTML = P.x; $('misTxt').textContent = hecho[paso] ? '¡Muy bien! Misión cumplida ✔' : P.m; $('dato').textContent = '💡 ' + P.d;
    $('mis').className = 'mision' + (hecho[paso] ? ' ok' : ''); $('bAnt').disabled = paso === 0; $('bSig').disabled = paso === 2; $('fin').className = 'fin' + (hecho.every(Boolean) ? ' v' : '');
  }
  function ir(n) { paso = n; ctl(); pintar(); }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); }; $('bSig').onclick = function () { if (paso < 2) ir(paso + 1); };
  window.__mezclas = { ir: ir, echar: echar, elegirMez: elegirMez, metodo: metodo, cucharada: cucharada, setCal: function (v) { sat.caliente = v; sat.cucharadas = 0; sat.sobrantes = 0; }, estado: function () { return { hecho: hecho.slice(), res: sep.res }; } };
  ctl(); pintar(); requestAnimationFrame(frame);
})();
