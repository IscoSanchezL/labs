/* Cómo crece una planta (2°, solo español, sin voz): necesidades, partes y comparación de tres macetas. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var cv = $('cv'), g = cv.getContext('2d'), W = cv.width, H = cv.height;
  var PASOS = [
    { n: 'Qué necesita', t: '1. Una planta necesita agua y luz', x: 'Para crecer, una planta necesita <b>agua</b>, <b>luz</b> del Sol, <b>aire</b> y <b>tierra</b>. Con ellas fabrica su propio alimento.', m: 'Riega la semilla y dale luz hasta que crezca.', d: 'Las plantas fabrican su alimento con la luz del Sol: eso se llama fotosíntesis.' },
    { n: 'Sus partes', t: '2. Las partes de una planta', x: 'Cada parte hace un trabajo: la <b>raíz</b> toma agua, el <b>tallo</b> la sube, las <b>hojas</b> fabrican alimento y la <b>flor</b> hace las semillas.', m: 'Toca las 4 partes de la planta.', d: 'Algunas raíces, como la zanahoria, ¡nos las comemos!' },
    { n: 'Compara', t: '3. ¿Y si le falta algo?', x: 'Mira tres macetas durante varios días. La que tiene agua y luz crece <b>sana</b>. Sin agua se <b>marchita</b>. Sin luz se pone <b>pálida y débil</b>.', m: 'Pasa los días hasta llegar al día 12.', d: 'Por eso las plantas de interior se ponen cerca de una ventana.' }
  ];
  var paso = 0, hecho = [false, false, false];
  var ac = null;
  function tono(f, v, d) { try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume(); var o = ac.createOscillator(), G = ac.createGain(), n = ac.currentTime; o.type = 'sine'; o.frequency.value = f; G.gain.setValueAtTime(0.0001, n); G.gain.exponentialRampToValueAtTime(v, n + 0.01); G.gain.exponentialRampToValueAtTime(0.0001, n + d); o.connect(G); G.connect(ac.destination); o.start(); o.stop(n + d + 0.05); } catch (e) {} }
  function gota() { tono(520, 0.16, 0.12); setTimeout(function () { tono(380, 0.12, 0.15); }, 90); }
  function ex() { tono(660, 0.2, 0.2); setTimeout(function () { tono(880, 0.2, 0.3); }, 130); }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; ex(); if (window.STEMFX) STEMFX.exito(); pintar(); }
  function mezcla(a, b, t) { return Math.round(a + (b - a) * t); }
  function verde(sano, palido) { return 'rgb(' + mezcla(mezcla(150, 60, sano), 215, palido * 0.9) + ',' + mezcla(mezcla(130, 200, sano), 215, palido * 0.8) + ',' + mezcla(mezcla(60, 90, sano), 120, palido * 0.9) + ')'; }
  function dibT(s, x, y, tam, col, al) { g.font = '700 ' + tam + 'px "Space Grotesk",system-ui,sans-serif'; g.fillStyle = col || '#eaf2fb'; g.textAlign = al || 'center'; g.fillText(s, x, y); }
  function fondo(dia) { var gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, dia ? '#1b3b66' : '#0e2038'); gr.addColorStop(1, '#09111f'); g.fillStyle = gr; g.fillRect(0, 0, W, H); }

  /* maceta y planta */
  function maceta(x, y) {
    g.fillStyle = '#7a4a2e'; g.beginPath(); g.moveTo(x - 62, y); g.lineTo(x + 62, y); g.lineTo(x + 48, y + 86); g.lineTo(x - 48, y + 86); g.closePath(); g.fill();
    g.fillStyle = '#93593a'; g.fillRect(x - 70, y - 8, 140, 16);
    g.fillStyle = '#4a2f1d'; g.fillRect(x - 62, y - 8, 124, 8);
  }
  function planta(x, y0, gr, sano, palido) {
    var col = verde(sano, palido), caida = (1 - sano) * 46, alto = 6 + gr * 170;
    if (gr < 0.04) { g.fillStyle = '#8a5a2b'; g.beginPath(); g.ellipse(x, y0 - 2, 9, 6, 0, 0, 7); g.fill(); return; }
    g.strokeStyle = col; g.lineWidth = 4 + gr * 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, y0); g.quadraticCurveTo(x, y0 - alto * 0.6, x + caida, y0 - alto); g.stroke();
    var n = Math.min(7, Math.floor(gr * 8));
    for (var i = 0; i < n; i++) {
      var f = (i + 1) / (n + 1), lado = i % 2 ? 1 : -1, hx = x + caida * f * f, hy = y0 - alto * f, tam = 12 + gr * 22;
      g.save(); g.translate(hx, hy); g.rotate(lado * (0.6 + (1 - sano) * 0.9)); g.fillStyle = col; g.beginPath(); g.ellipse(lado * tam * 0.9, 0, tam, tam * 0.45, 0, 0, 7); g.fill(); g.restore();
    }
    if (gr > 0.93 && sano > 0.6) { var fx = x + caida, fy = y0 - alto - 8; for (var k = 0; k < 6; k++) { g.fillStyle = '#ff9ccf'; g.beginPath(); g.ellipse(fx + Math.cos(k * 1.047) * 14, fy + Math.sin(k * 1.047) * 14, 10, 10, 0, 0, 7); g.fill(); } g.fillStyle = '#ffd36b'; g.beginPath(); g.arc(fx, fy, 8, 0, 7); g.fill(); }
  }

  /* paso 1 */
  var P1 = { agua: 0.15, luz: true, gr: 0, sano: 1, t: 0 };
  function dib1(dt) {
    P1.agua = Math.max(0, P1.agua - dt * 0.025);
    var ok = P1.luz && P1.agua > 0.15;
    if (ok) P1.gr = Math.min(1, P1.gr + dt * 0.05);
    var objetivo = (P1.agua > 0.15 ? 1 : P1.agua / 0.15) * (P1.luz ? 1 : 0.55);
    P1.sano += (objetivo - P1.sano) * Math.min(1, dt * 1.5);
    if (P1.gr >= 0.6) cumplir(0);
    fondo(P1.luz);
    if (P1.luz) { g.font = '84px serif'; g.textAlign = 'center'; g.fillText('☀️', 120, 100); for (var r = 0; r < 5; r++) { g.strokeStyle = 'rgba(255,224,138,.25)'; g.lineWidth = 3; g.beginPath(); g.moveTo(150 + r * 6, 110 + r * 22); g.lineTo(420, 250 + r * 14); g.stroke(); } }
    g.fillStyle = '#16263d'; g.fillRect(0, H - 60, W, 60);
    maceta(480, 330); planta(480, 322, P1.gr, P1.sano, P1.luz ? 0 : 0.7);
    g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(720, 60, 190, 16); g.fillStyle = '#5fb8ff'; g.fillRect(720, 60, 190 * P1.agua, 16); dibT('💧 Agua', 815, 50, 18, '#9db8ff');
    g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(720, 120, 190, 16); g.fillStyle = '#8be8ae'; g.fillRect(720, 120, 190 * Math.min(1, P1.gr / 0.6), 16); dibT('🌱 Crecimiento', 815, 110, 18, '#8be8ae');
    if (P1.agua < 0.15) dibT('¡Tiene sed!', 480, 140, 28, '#ff9f9f');
    else if (!P1.luz) dibT('Necesita luz', 480, 140, 28, '#ffd36b');
  }

  /* paso 2 */
  var PARTES = [['flor', 'La flor', 'Hace las semillas para que nazcan nuevas plantas.', 480, 92], ['hoja', 'Las hojas', 'Fabrican el alimento usando la luz del Sol.', 372, 160], ['tallo', 'El tallo', 'Sostiene la planta y sube el agua hasta las hojas.', 480, 220], ['raiz', 'La raíz', 'Toma el agua de la tierra y sujeta la planta.', 480, 390]];
  var tocadas = {}, sel = null;
  function dib2() {
    fondo(true); g.fillStyle = '#16263d'; g.fillRect(0, 300, W, 160); g.fillStyle = '#4a2f1d'; g.fillRect(0, 300, W, 160);
    g.strokeStyle = '#e8d6b0'; g.lineWidth = 5; g.lineCap = 'round';
    [[0, 0], [-60, 50], [60, 60], [-30, 90], [30, 100]].forEach(function (r) { g.beginPath(); g.moveTo(480, 300); g.quadraticCurveTo(480 + r[0] * 0.3, 300 + r[1], 480 + r[0], 300 + r[1] + 40); g.stroke(); });
    planta(480, 300, 1, 1, 0);
    g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(0, 296, W, 6);
    PARTES.forEach(function (p) { var done = tocadas[p[0]]; g.fillStyle = done ? 'rgba(139,232,174,.35)' : 'rgba(255,255,255,.18)'; g.strokeStyle = done ? '#8be8ae' : 'rgba(255,255,255,.7)'; g.lineWidth = 3; g.beginPath(); g.arc(p[3], p[4], 24, 0, 7); g.fill(); g.stroke(); dibT(done ? '✓' : '?', p[3], p[4] + 8, 22, '#fff'); });
    if (sel) { g.fillStyle = 'rgba(7,15,28,.88)'; g.strokeStyle = 'rgba(127,240,228,.6)'; g.lineWidth = 2; g.beginPath(); g.roundRect(600, 90, 320, 100, 16); g.fill(); g.stroke(); dibT(sel[1], 760, 125, 24, '#7ff0e4'); wrap(sel[2], 760, 152, 290, 18); }
    dibT('Tocados: ' + Object.keys(tocadas).length + ' de 4', 130, 40, 22, '#8be8ae');
  }
  function wrap(txt, x, y, ancho, tam) { g.font = '500 ' + tam + 'px "Space Grotesk",system-ui,sans-serif'; g.fillStyle = '#eaf2fb'; g.textAlign = 'center'; var pal = txt.split(' '), ln = ''; pal.forEach(function (w) { if (g.measureText(ln + w).width > ancho) { g.fillText(ln, x, y); y += tam + 4; ln = ''; } ln += w + ' '; }); g.fillText(ln, x, y); }

  /* paso 3 */
  var dia = 0, auto = false;
  function estado(i, d) { if (i === 0) return [Math.min(1, d / 10), 1, 0]; if (i === 1) return [Math.min(0.3, d / 12), d < 3 ? 1 : Math.max(0, 1 - (d - 3) / 5), 0]; return [Math.min(0.35, d / 9), Math.max(0.15, 1 - d / 10), Math.min(1, d / 6)]; }
  function dib3(dt) {
    if (auto) { dia = Math.min(14, dia + dt * 1.6); var sl = $('dia'); if (sl) sl.value = dia; if (dia >= 14) auto = false; }
    if (dia >= 12) cumplir(2);
    fondo(true); g.fillStyle = '#16263d'; g.fillRect(0, H - 60, W, 60);
    var nom = ['Con agua y luz', 'Sin agua', 'Sin luz'];
    for (var i = 0; i < 3; i++) { var x = 200 + i * 280, e = estado(i, dia); maceta(x, 320); planta(x, 312, e[0], e[1], e[2]); dibT(nom[i], x, 438, 22, '#eaf2fb'); if (i === 1 && dia > 6) dibT('💧 ✗', x, 90, 28, '#ff9f9f'); if (i === 2) dibT('☀️ ✗', x, 90, 28, '#ffd36b'); if (i === 0) dibT('💧 ☀️ ✓', x, 90, 28, '#8be8ae'); }
    dibT('Día ' + Math.round(dia), W / 2, 40, 28, '#eaf2fb');
  }

  var last = 0;
  function frame(ms) { var dt = Math.min(0.1, (ms - last) / 1000); last = ms; if (paso === 0) dib1(dt); else if (paso === 1) dib2(); else dib3(dt); requestAnimationFrame(frame); }
  cv.addEventListener('pointerdown', function (e) {
    if (paso !== 1) return; var r = cv.getBoundingClientRect(), x = (e.clientX - r.left) * W / r.width, y = (e.clientY - r.top) * H / r.height;
    PARTES.forEach(function (p) { if (Math.hypot(x - p[3], y - p[4]) < 34) { sel = p; tocadas[p[0]] = true; tono(600, 0.15, 0.12); if (Object.keys(tocadas).length === 4) cumplir(1); } });
  });
  function ctl() {
    var c = $('ctl'); c.textContent = '';
    function btn(txt, fn, cls) { var b = document.createElement('button'); b.type = 'button'; b.className = 'btn ' + (cls || 'sec'); b.textContent = txt; b.onclick = fn; c.appendChild(b); return b; }
    if (paso === 0) { btn('💧 Regar', function () { P1.agua = Math.min(1, P1.agua + 0.45); gota(); }, 'grande'); var l = btn('', function () { P1.luz = !P1.luz; l.textContent = P1.luz ? '☀️ Luz: sí' : '🌑 Luz: no'; tono(P1.luz ? 700 : 300, 0.12, 0.12); }, 'sec'); l.textContent = P1.luz ? '☀️ Luz: sí' : '🌑 Luz: no'; btn('↺ Empezar de nuevo', function () { P1.agua = 0.15; P1.luz = true; P1.gr = 0; P1.sano = 1; ctl(); }, 'sec'); }
    if (paso === 2) { btn('▶ Pasar los días', function () { if (dia >= 14) dia = 0; auto = true; }, 'grande'); var lab = document.createElement('label'); lab.className = 'rango'; lab.innerHTML = '<span>Día 0</span><input id="dia" type="range" min="0" max="14" step="0.1" value="' + dia + '" aria-label="Día"><span>Día 14</span>'; lab.querySelector('input').oninput = function () { auto = false; dia = +this.value; }; c.appendChild(lab); }
  }
  function pintar() {
    var p = $('pasos'); p.textContent = '';
    PASOS.forEach(function (P, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === paso)); b.innerHTML = '<b>' + (hecho[i] ? '✓' : i + 1) + '</b>' + P.n; b.onclick = function () { ir(i); }; p.appendChild(b); });
    var P = PASOS[paso]; $('tit').textContent = P.t; $('txt').innerHTML = P.x; $('misTxt').textContent = hecho[paso] ? '¡Muy bien! Misión cumplida ✔' : P.m; $('dato').textContent = '💡 ' + P.d;
    $('mis').className = 'mision' + (hecho[paso] ? ' ok' : ''); $('bAnt').disabled = paso === 0; $('bSig').disabled = paso === 2; $('fin').className = 'fin' + (hecho.every(Boolean) ? ' v' : '');
  }
  function ir(n) { paso = n; auto = false; ctl(); pintar(); }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); }; $('bSig').onclick = function () { if (paso < 2) ir(paso + 1); };
  window.__plantas = { ir: ir, estado: function () { return { hecho: hecho.slice(), gr: P1.gr, dia: dia }; }, regar: function () { P1.agua = Math.min(1, P1.agua + 0.45); }, acelerar: function () { P1.gr = Math.max(P1.gr, 0.61); }, tocar: function () { PARTES.forEach(function (p) { tocadas[p[0]] = true; }); sel = PARTES[0]; cumplir(1); }, setDia: function (d) { dia = d; } };
  ctl(); pintar(); requestAnimationFrame(frame);
})();
