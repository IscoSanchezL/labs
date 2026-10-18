/* La mariposa (2°, solo español, sin voz): ordenar el ciclo de vida, alimentar a la oruga y ayudar a la mariposa a volar. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var cv = $('cv'), g = cv.getContext('2d'), W = cv.width, H = cv.height;
  var PASOS = [
    { n: 'Ordena la historia', t: '1. ¿Cómo nace una mariposa?', x: 'Una mariposa no nace mariposa. Primero es un <b>huevo</b>, luego una <b>oruga</b>, después una <b>crisálida</b> y al final una <b>mariposa</b>. A este cambio se le llama <b>metamorfosis</b>.', m: 'Toca las tarjetas en el orden correcto: huevo, oruga, crisálida y mariposa.', d: 'La mariposa pone sus huevos sobre una hoja para que la oruga tenga comida al nacer.' },
    { n: 'Alimenta la oruga', t: '2. La oruga come y crece', x: 'La <b>oruga</b> come muchísimas hojas y crece mucho. Cuando ya es grande, se cuelga de una rama y se convierte en <b>crisálida</b>.', m: 'Toca 5 hojas para que la oruga las coma.', d: 'Una oruga puede crecer más de 100 veces su tamaño en pocas semanas.' },
    { n: 'La mariposa vuela', t: '3. ¡Nace la mariposa!', x: 'Dentro de la crisálida el cuerpo cambia. Cuando está lista, la crisálida se abre y sale la <b>mariposa</b>. Ella toma el <b>néctar</b> de las flores con su trompa.', m: 'Haz que la crisálida se abra y lleva la mariposa a 3 flores.', d: 'Las mariposas ayudan a las plantas: al visitar flores llevan el polen de una a otra.' }
  ];
  var CARTAS = [['🥚', 'Huevo'], ['🐛', 'Oruga'], ['crisalida', 'Crisálida'], ['🦋', 'Mariposa']];
  var paso = 0, hecho = [false, false, false], tiempo = 0, msj = '';
  var orden = [2, 0, 3, 1], colocadas = 0, sacudir = -1, sacT = 0;                // paso 1
  var hojas = [], comidas = 0, tam = 1, fase2 = 'come', t2 = 0;                    // paso 2
  var fase3 = 'cris', prog = 0, mar = { x: 480, y: 220, tx: 480, ty: 220 }, flores = [], nectar = 0, ala = 0;
  var ac = null;
  function tono(f, v, d, tp) { try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume(); var o = ac.createOscillator(), gn = ac.createGain(); o.type = tp || 'sine'; o.frequency.value = f; gn.gain.setValueAtTime(v, ac.currentTime); gn.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d); o.connect(gn); gn.connect(ac.destination); o.start(); o.stop(ac.currentTime + d); } catch (e) {} }
  function ex() { tono(660, 0.2, 0.2); setTimeout(function () { tono(880, 0.2, 0.3); }, 130); }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; ex(); pintar(); }
  function emoji(e, x, y, s, rot) { g.save(); g.translate(x, y); if (rot) g.rotate(rot); g.font = s + 'px system-ui'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(e, 0, 0); g.restore(); }
  function crisalida(x, y, s, glow) {
    g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = '#6b4f2a'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, -80); g.lineTo(0, -42); g.stroke();
    if (glow) { g.shadowColor = '#ffe08a'; g.shadowBlur = 30 * glow; }
    var gr = g.createLinearGradient(-26, 0, 26, 0); gr.addColorStop(0, '#5dbb63'); gr.addColorStop(1, '#2f8a4a'); g.fillStyle = gr; g.beginPath(); g.moveTo(0, -44); g.bezierCurveTo(34, -34, 30, 30, 0, 52); g.bezierCurveTo(-30, 30, -34, -34, 0, -44); g.fill();
    g.shadowBlur = 0; g.fillStyle = '#ffd95e'; [[-10, -22], [10, -14], [-8, 4], [8, 16], [0, 32]].forEach(function (p) { g.beginPath(); g.arc(p[0], p[1], 3.5, 0, 7); g.fill(); }); g.restore();
  }
  function fondo(verde) { var gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, verde ? '#9ee0ff' : '#b9e9ff'); gr.addColorStop(1, verde ? '#d6f5c4' : '#e8f9d6'); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.fillStyle = '#6fcf7a'; g.fillRect(0, H - 70, W, 70); g.fillStyle = '#58b765'; g.beginPath(); g.moveTo(0, H - 70); for (var x = 0; x <= W; x += 30) g.lineTo(x, H - 78 - 8 * Math.sin(x * 0.05 + tiempo)); g.lineTo(W, H - 70); g.fill(); g.font = '56px system-ui'; g.textAlign = 'center'; g.fillText('☀️', 880, 70); }
  function carta(i, x, y, colocada, sac) {
    g.save(); g.translate(x + (sac ? Math.sin(sacT * 40) * 8 : 0), y); g.fillStyle = colocada ? '#fff6c8' : '#ffffff'; g.strokeStyle = '#2a1b4a'; g.lineWidth = 4; g.beginPath(); g.roundRect ? g.roundRect(-82, -88, 164, 176, 22) : g.rect(-82, -88, 164, 176); g.fill(); g.stroke();
    if (CARTAS[i][0] === 'crisalida') crisalida(0, -2, 1.05, 0); else emoji(CARTAS[i][0], 0, -14, 84);
    g.fillStyle = '#2a1b4a'; g.font = '700 22px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'center'; g.fillText(CARTAS[i][1], 0, 70); g.restore();
  }
  var POS1 = [[170, 310], [400, 310], [630, 310], [860, 310]], SLOT = [[170, 110], [400, 110], [630, 110], [860, 110]];
  function dib1() {
    fondo(true);
    for (var s = 0; s < 4; s++) { g.strokeStyle = 'rgba(42,27,74,.5)'; g.setLineDash([8, 8]); g.lineWidth = 3; g.strokeRect(SLOT[s][0] - 70, SLOT[s][1] - 70, 140, 140); g.setLineDash([]); g.fillStyle = 'rgba(42,27,74,.6)'; g.font = '700 30px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'center'; g.fillText(String(s + 1), SLOT[s][0], SLOT[s][1] + 10); if (s < 3) { g.fillText('➜', (SLOT[s][0] + SLOT[s + 1][0]) / 2, SLOT[s][1] + 10); } }
    for (var k = 0; k < 4; k++) { if (k < colocadas) { g.save(); g.translate(SLOT[k][0], SLOT[k][1]); g.scale(0.72, 0.72); g.translate(-SLOT[k][0], -SLOT[k][1]); carta(k, SLOT[k][0], SLOT[k][1], true, false); g.restore(); } }
    orden.forEach(function (c, i) { if (c < 0) return; carta(c, POS1[i][0], POS1[i][1] + 30, false, sacudir === i); });
    if (msj) { g.fillStyle = '#2a1b4a'; g.font = '700 24px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'center'; g.fillText(msj, W / 2, 440); }
  }
  function dib2() {
    fondo(true);
    // rama
    g.strokeStyle = '#7a5a30'; g.lineWidth = 16; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, 150); g.quadraticCurveTo(480, 110, 960, 160); g.stroke();
    hojas.forEach(function (h) { if (!h.c) { var b = Math.sin(tiempo * 2 + h.x) * 4; emoji('🍃', h.x, h.y + b, 64, Math.sin(tiempo + h.x) * 0.2); } });
    if (fase2 === 'come') { var s = 56 + tam * 13; emoji('🐛', 480, 350 - (s - 56) * 0.1, s, Math.sin(tiempo * 4) * 0.06); }
    else if (fase2 === 'sube') { var q = Math.min(1, t2 / 1.8); emoji('🐛', 480, 350 - 200 * q, 120 - 20 * q); crisalida(480, 120, 0, 0); if (q >= 1) { fase2 = 'cris'; t2 = 0; } }
    else { var sc = Math.min(1, t2 / 0.8); crisalida(480, 160, 0.8 + sc * 0.5, Math.abs(Math.sin(tiempo * 3))); if (!hecho[1]) cumplir(1); }
    g.fillStyle = '#2a1b4a'; g.font = '700 24px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'center'; g.fillText(fase2 === 'come' ? 'Hojas comidas: ' + comidas + ' de 5' : '¡Ahora es una crisálida!', W / 2, 440);
  }
  function dib3() {
    fondo(true); g.strokeStyle = '#7a5a30'; g.lineWidth = 16; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, 90); g.quadraticCurveTo(300, 70, 640, 100); g.stroke();
    flores.forEach(function (f) { emoji(f.e, f.x, f.y + Math.sin(tiempo * 2 + f.x) * 3, 70 + (f.v ? 0 : 0)); if (f.v) { g.fillStyle = '#ff7aa8'; g.font = '30px system-ui'; g.fillText('💗', f.x, f.y - 50); } });
    if (fase3 === 'cris') { crisalida(480, 120, 1 + prog * 0.15, prog); if (prog > 0) { g.fillStyle = 'rgba(42,27,74,.2)'; g.fillRect(380, 235, 200, 16); g.fillStyle = '#ffb347'; g.fillRect(380, 235, 200 * prog, 16); } g.fillStyle = '#2a1b4a'; g.font = '700 24px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'center'; g.fillText('Toca la crisálida para ayudarla a abrirse (mantén el ritmo)', W / 2, 440); }
    else { mar.x += (mar.tx - mar.x) * 0.05; mar.y += (mar.ty - mar.y) * 0.05; ala = Math.sin(tiempo * 14); var gs = fase3 === 'sale' ? Math.min(1, prog) : 1; g.save(); g.translate(mar.x, mar.y + Math.sin(tiempo * 3) * 6); g.scale(gs * (0.8 + 0.2 * (0.6 + 0.4 * ala)), gs); g.font = '96px system-ui'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('🦋', 0, 0); g.restore(); g.fillStyle = '#2a1b4a'; g.font = '700 24px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'center'; g.fillText('Néctar: ' + nectar + ' de 3 · toca una flor', W / 2, 440); }
  }
  function sim(dt) {
    sacT += dt; if (sacudir >= 0 && sacT > 0.35) sacudir = -1;
    if (paso === 1 && (fase2 === 'sube' || fase2 === 'cris')) t2 += dt;
    if (paso === 2 && fase3 === 'sale') { prog += dt; if (prog >= 1) { fase3 = 'vuela'; msj = ''; } }
  }
  function xy(e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; }
  function clic(x, y) {
    if (paso === 0) {
      for (var i = 0; i < 4; i++) { var c = orden[i]; if (c < 0) continue; if (Math.abs(x - POS1[i][0]) < 82 && Math.abs(y - (POS1[i][1] + 30)) < 88) { if (c === colocadas) { orden[i] = -1; colocadas++; tono(600 + colocadas * 80, 0.12, 0.15); msj = ''; if (colocadas === 4) { msj = '¡Esa es la metamorfosis!'; cumplir(0); } } else { sacudir = i; sacT = 0; tono(200, 0.15, 0.25); msj = 'Todavía no: piensa qué viene primero'; } return; } }
    } else if (paso === 1 && fase2 === 'come') {
      hojas.forEach(function (h) { if (!h.c && Math.hypot(x - h.x, y - h.y) < 44) { h.c = 1; comidas++; tam = Math.min(5, comidas); tono(500 + comidas * 70, 0.12, 0.12); if (comidas >= 5) { fase2 = 'sube'; t2 = 0; } } });
    } else if (paso === 2) {
      if (fase3 === 'cris' && Math.hypot(x - 480, y - 130) < 80) { prog = Math.min(1, prog + 0.34); tono(400 + prog * 400, 0.1, 0.1); if (prog >= 0.99) { fase3 = 'sale'; prog = 0; tono(880, 0.15, 0.3); } }
      else if (fase3 === 'vuela') flores.forEach(function (f) { if (Math.hypot(x - f.x, y - f.y) < 52) { mar.tx = f.x; mar.ty = f.y - 60; if (!f.v) { f.v = 1; nectar++; tono(700 + nectar * 100, 0.15, 0.2); if (nectar >= 3) cumplir(2); } } });
    }
  }
  cv.addEventListener('click', function (e) { var q = xy(e); clic(q[0], q[1]); });
  function reset(n) {
    msj = '';
    if (n === 0) { orden = [2, 0, 3, 1]; colocadas = 0; }
    if (n === 1) { hojas = []; comidas = 0; tam = 1; fase2 = 'come'; t2 = 0; var xs = [120, 260, 400, 560, 700, 840], ys = [250, 330, 400, 280, 380, 240]; for (var i = 0; i < 6; i++) hojas.push({ x: xs[i], y: ys[i] + (i % 2) * 5, c: 0 }); }
    if (n === 2) { fase3 = 'cris'; prog = 0; nectar = 0; mar = { x: 480, y: 150, tx: 480, ty: 150 }; flores = [{ e: '🌸', x: 170, y: 360, v: 0 }, { e: '🌼', x: 410, y: 380, v: 0 }, { e: '🌷', x: 650, y: 355, v: 0 }, { e: '🌻', x: 860, y: 370, v: 0 }]; }
  }
  var last = 0;
  function frame(ms) { var dt = Math.min(0.05, (ms - (last || ms)) / 1000); last = ms; tiempo += dt; sim(dt); if (paso === 0) dib1(); else if (paso === 1) dib2(); else dib3(); requestAnimationFrame(frame); }
  function ctl() { $('ctl').textContent = ''; }
  function pintar() {
    var p = $('pasos'); p.textContent = '';
    PASOS.forEach(function (Q, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === paso)); b.innerHTML = '<b>' + (hecho[i] ? '✓' : i + 1) + '</b>' + Q.n; b.onclick = function () { ir(i); }; p.appendChild(b); });
    var Q = PASOS[paso]; $('tit').textContent = Q.t; $('txt').innerHTML = Q.x; $('misTxt').textContent = hecho[paso] ? '¡Muy bien! Misión cumplida ✔' : Q.m; $('dato').textContent = '💡 ' + Q.d;
    $('mis').className = 'mision' + (hecho[paso] ? ' ok' : ''); $('bAnt').disabled = paso === 0; $('bSig').disabled = paso === 2; $('fin').className = 'fin' + (hecho.every(Boolean) ? ' v' : '');
  }
  function ir(n) { paso = n; reset(n); ctl(); pintar(); }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); }; $('bSig').onclick = function () { if (paso < 2) ir(paso + 1); };
  window.__maripo = { ir: ir, clic: clic, estado: function () { return { hecho: hecho.slice(), colocadas: colocadas, comidas: comidas, fase2: fase2, fase3: fase3, nectar: nectar }; },
    siguiente: function () { var i = orden.indexOf(colocadas); return POS1[i] ? [POS1[i][0], POS1[i][1] + 30] : null; }, hojas: function () { return hojas.filter(function (h) { return !h.c; }).map(function (h) { return [h.x, h.y]; }); }, flores: function () { return flores.map(function (f) { return [f.x, f.y]; }); } };
  reset(0); ctl(); pintar(); requestAnimationFrame(frame);
})();
