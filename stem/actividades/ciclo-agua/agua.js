/* El ciclo del agua (3°, solo español, sin voz): evaporación, condensación (nubes) y precipitación con regreso al mar. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var cv = $('cv'), g = cv.getContext('2d'), W = cv.width, H = cv.height;
  var PASOS = [
    { n: 'Evaporación', t: '1. El sol calienta el agua', x: 'El <b>sol</b> calienta el agua del mar. Cuando el agua se calienta mucho se convierte en <b>vapor</b>, un gas invisible que sube por el aire. A esto se le llama <b>evaporación</b>.', m: 'Sube el sol con el control y deja que suba al menos 40 gotitas de vapor.', d: 'La mayor parte del agua que se evapora viene de los océanos.' },
    { n: 'Nubes', t: '2. El vapor forma nubes', x: 'Arriba el aire es <b>más frío</b>. El vapor se enfría y se vuelve otra vez agua en gotitas diminutas que se juntan: así nace una <b>nube</b>. A esto se le llama <b>condensación</b>.', m: 'Con el sol alto, haz crecer la nube hasta que quede cargada (llena y gris).', d: 'Una nube no es vapor: está hecha de millones de gotitas minúsculas de agua.' },
    { n: 'Lluvia', t: '3. La nube suelta el agua', x: 'Cuando la nube tiene demasiada agua, esta cae como <b>lluvia</b>. Si hace mucho frío cae como <b>nieve</b>. El agua baja por la montaña, forma un <b>río</b> y regresa al mar: ¡el ciclo vuelve a empezar!', m: 'Deja llover y consigue que 20 gotas regresen al mar por el río.', d: 'El agua no se acaba: se recicla una y otra vez desde hace millones de años.' }
  ];
  var paso = 0, hecho = [false, false, false];
  var ac = null;
  function tono(f, v, d) { try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume(); var o = ac.createOscillator(), gn = ac.createGain(); o.type = 'sine'; o.frequency.value = f; gn.gain.setValueAtTime(v, ac.currentTime); gn.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d); o.connect(gn); gn.connect(ac.destination); o.start(); o.stop(ac.currentTime + d); } catch (e) {} }
  function ex() { tono(660, 0.2, 0.2); setTimeout(function () { tono(880, 0.2, 0.3); }, 130); }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; ex(); pintar(); }

  /* ---------- geometría del paisaje ---------- */
  var MAR_Y = 345, FRIA = 150, PICO = { x: 700, y: 165 }, BASE_I = 470;
  function suelo(x) { return x <= PICO.x ? 372 - (x - BASE_I) * ((372 - PICO.y) / (PICO.x - BASE_I)) : PICO.y + (x - PICO.x) * 0.62; }

  /* ---------- simulación ---------- */
  var sol = 0.5, vapor = [], gotas = [], rio = [], nieve = [];
  var evap = 0, nube = 0, regreso = 0, llueve = false, frio = false, acum = 0, tiempo = 0;
  function emitir(dt) {
    if (sol < 0.05) return;
    acum += dt * sol * 22;
    while (acum >= 1) { acum -= 1; vapor.push({ x: 40 + Math.random() * 400, y: MAR_Y - 4, vy: -(35 + Math.random() * 25) * (0.6 + sol), vx: 10 + Math.random() * 14, ph: Math.random() * 6 }); }
  }
  function simular(dt) {
    tiempo += dt;
    emitir(dt);
    vapor = vapor.filter(function (p) {
      p.y += p.vy * dt; p.x += p.vx * dt + Math.sin(tiempo * 2 + p.ph) * 0.25;
      if (p.y <= FRIA) { if (paso === 0) { evap++; if (evap >= 40) cumplir(0); } else { evap++; nube = Math.min(90, nube + 1); if (nube >= 60) cumplir(1); } return false; }
      return true;
    });
    if (llueve && paso === 2) {
      if (nube <= 0) llueve = false;
      else { var n = Math.min(nube, Math.max(1, Math.round(dt * 40))); for (var i = 0; i < n; i++) { nube--; gotas.push({ x: 470 + Math.random() * 190, y: 150 + Math.random() * 20, vy: 220 + Math.random() * 80, nieve: frio }); } }
    }
    gotas = gotas.filter(function (p) {
      p.y += p.vy * dt * (p.nieve ? 0.35 : 1); if (p.nieve) p.x += Math.sin(tiempo * 3 + p.y) * 0.4;
      if (p.x < BASE_I && p.y >= MAR_Y) return false;
      if (p.x >= BASE_I && p.y >= suelo(p.x)) { if (p.nieve) nieve.push({ x: p.x, y: suelo(p.x), t: 2.5 + Math.random() * 1.5 }); else rio.push({ x: p.x, v: 70 + Math.random() * 30 }); return false; }
      return true;
    });
    nieve = nieve.filter(function (s) { s.t -= dt; if (s.t <= 0) { rio.push({ x: s.x, v: 60 + Math.random() * 30 }); return false; } return true; });
    rio = rio.filter(function (r) { r.x -= r.v * dt; if (r.x <= BASE_I) { regreso++; if (regreso >= 20) cumplir(2); return false; } return true; });
  }

  /* ---------- dibujo ---------- */
  function cielo() {
    var gr = g.createLinearGradient(0, 0, 0, MAR_Y); gr.addColorStop(0, '#0b2a55'); gr.addColorStop(0.6, '#2d6fb0'); gr.addColorStop(1, '#8fc9ee'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    // sol
    var sx = 850, sy = 78, r = 30 + sol * 8;
    var h = g.createRadialGradient(sx, sy, 5, sx, sy, 140 + sol * 120); h.addColorStop(0, 'rgba(255,230,140,' + (0.3 + sol * 0.5) + ')'); h.addColorStop(1, 'rgba(255,230,140,0)'); g.fillStyle = h; g.fillRect(sx - 280, sy - 280, 560, 560);
    g.save(); g.translate(sx, sy); g.rotate(tiempo * 0.2); g.strokeStyle = 'rgba(255,225,120,' + (0.35 + sol * 0.5) + ')'; g.lineWidth = 4; g.lineCap = 'round';
    for (var i = 0; i < 12; i++) { g.rotate(Math.PI / 6); g.beginPath(); g.moveTo(r + 8, 0); g.lineTo(r + 14 + sol * 16, 0); g.stroke(); } g.restore();
    g.fillStyle = '#ffd95e'; g.beginPath(); g.arc(sx, sy, r, 0, 7); g.fill();
  }
  function montana() {
    var gr = g.createLinearGradient(0, PICO.y, 0, 380); gr.addColorStop(0, '#6f7f8f'); gr.addColorStop(0.45, '#4d6a55'); gr.addColorStop(1, '#2f4a3b');
    g.fillStyle = gr; g.beginPath(); g.moveTo(BASE_I - 60, 380); g.lineTo(BASE_I - 60, 376); g.lineTo(BASE_I, 372); g.lineTo(PICO.x, PICO.y); g.lineTo(W, suelo(W)); g.lineTo(W, H); g.lineTo(BASE_I - 60, H); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,255,255,.9)'; g.beginPath(); g.moveTo(PICO.x, PICO.y); g.lineTo(PICO.x - 38, suelo(PICO.x - 38)); g.lineTo(PICO.x - 18, suelo(PICO.x - 18) - 8); g.lineTo(PICO.x, suelo(PICO.x) + 10); g.lineTo(PICO.x + 20, suelo(PICO.x + 20) - 6); g.lineTo(PICO.x + 40, suelo(PICO.x + 40)); g.closePath(); g.fill();
    // pinos
    for (var i = 0; i < 9; i++) { var x = 530 + i * 38 + (i % 2) * 10, y = suelo(x); if (y > 200 && x < 700 || x > 760) { g.fillStyle = '#1f3a2c'; g.beginPath(); g.moveTo(x, y - 30); g.lineTo(x - 9, y); g.lineTo(x + 9, y); g.fill(); } }
  }
  function mar() {
    var gr = g.createLinearGradient(0, MAR_Y, 0, H); gr.addColorStop(0, '#1f7fc0'); gr.addColorStop(1, '#0a2f5c'); g.fillStyle = gr; g.fillRect(0, MAR_Y, BASE_I + 20, H - MAR_Y);
    g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2;
    for (var k = 0; k < 4; k++) { g.beginPath(); for (var x = 0; x <= BASE_I; x += 8) { var y = MAR_Y + 12 + k * 22 + Math.sin(x / 26 + tiempo * 1.6 + k) * 3; if (x === 0) g.moveTo(x, y); else g.lineTo(x, y); } g.stroke(); }
    g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(0, MAR_Y, BASE_I + 20, 3);
  }
  function nubeDib() {
    if (nube <= 2) return;
    var s = Math.min(1, nube / 60), cargada = Math.max(0, Math.min(1, (nube - 40) / 40));
    var c = Math.round(255 - cargada * 110); g.fillStyle = 'rgb(' + c + ',' + c + ',' + Math.min(255, c + 8) + ')';
    var cx = 565, cy = 112, bl = [[-80, 8, 34], [-40, -8, 44], [8, -14, 50], [56, -2, 42], [92, 10, 32], [-10, 12, 44], [40, 14, 38]];
    bl.forEach(function (b) { g.beginPath(); g.arc(cx + b[0] * s, cy + b[1] * s, b[2] * s, 0, 7); g.fill(); });
  }
  function dibujar() {
    cielo(); montana(); mar();
    // línea de aire frío
    g.setLineDash([10, 8]); g.strokeStyle = 'rgba(160,215,255,.55)'; g.lineWidth = 2; g.beginPath(); g.moveTo(20, FRIA); g.lineTo(W - 190, FRIA); g.stroke(); g.setLineDash([]);
    g.fillStyle = 'rgba(190,230,255,.9)'; g.font = '600 15px "JetBrains Mono",monospace'; g.textAlign = 'left'; g.fillText('❄ aire frío', 262, FRIA - 8);
    // vapor
    vapor.forEach(function (p) { g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.arc(p.x, p.y, 3.2, 0, 7); g.fill(); g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(p.x - 6, p.y + 10); g.quadraticCurveTo(p.x, p.y + 4, p.x + 6, p.y - 2); g.stroke(); });
    if (paso >= 1) nubeDib();
    gotas.forEach(function (p) { if (p.nieve) { g.fillStyle = '#fff'; g.beginPath(); g.arc(p.x, p.y, 3.2, 0, 7); g.fill(); } else { g.strokeStyle = '#8fd2ff'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(p.x, p.y - 9); g.lineTo(p.x - 1.5, p.y); g.stroke(); } });
    nieve.forEach(function (s) { g.fillStyle = '#fff'; g.beginPath(); g.arc(s.x, s.y - 2, 4, 0, 7); g.fill(); });
    rio.forEach(function (r) { g.fillStyle = 'rgba(120,205,255,.95)'; g.beginPath(); g.arc(r.x, suelo(r.x) - 2, 3.4, 0, 7); g.fill(); });
    // marcadores
    var f = [['☀️ Sol', Math.round(sol * 100) + '%'], ['💨 Vapor subido', String(evap)], ['☁️ Nube', paso >= 1 ? Math.round(nube) + '/60' : '—'], ['🌊 Regresó al mar', paso === 2 ? regreso + '/20' : '—']];
    g.fillStyle = 'rgba(8,20,40,.55)'; roundR(14, 14, 230, 124, 14); g.fill();
    f.forEach(function (r, i) { g.fillStyle = '#cfe6ff'; g.font = '600 16px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'left'; g.fillText(r[0], 28, 44 + i * 28); g.fillStyle = '#ffe08a'; g.textAlign = 'right'; g.fillText(r[1], 230, 44 + i * 28); });
  }
  function roundR(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

  /* ---------- controles y panel ---------- */
  var last = 0;
  function frame(ms) { var dt = Math.min(0.1, (ms - last) / 1000); last = ms; simular(dt); dibujar(); requestAnimationFrame(frame); }
  function ctl() {
    var c = $('ctl'); c.textContent = '';
    var l = document.createElement('label'); l.className = 'rango'; l.innerHTML = '☀️ Sol <input type="range" min="0" max="100" value="' + Math.round(sol * 100) + '" aria-label="Fuerza del sol">'; l.querySelector('input').oninput = function (e) { sol = e.target.value / 100; }; c.appendChild(l);
    if (paso === 2) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'btn grande'; b.textContent = '🌧️ Dejar llover'; b.onclick = function () { if (nube < 10) { b.textContent = 'Primero carga la nube ☁️'; setTimeout(function () { b.textContent = '🌧️ Dejar llover'; }, 1600); return; } llueve = true; tono(300, 0.12, 0.2); }; c.appendChild(b);
      var t = document.createElement('button'); t.type = 'button'; t.className = 'tab'; t.textContent = '❄️ Montaña muy fría'; t.setAttribute('aria-pressed', String(frio)); t.onclick = function () { frio = !frio; ctl(); }; c.appendChild(t);
    }
  }
  function pintar() {
    var p = $('pasos'); p.textContent = '';
    PASOS.forEach(function (P, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === paso)); b.innerHTML = '<b>' + (hecho[i] ? '✓' : i + 1) + '</b>' + P.n; b.onclick = function () { ir(i); }; p.appendChild(b); });
    var P = PASOS[paso]; $('tit').textContent = P.t; $('txt').innerHTML = P.x; $('misTxt').textContent = hecho[paso] ? '¡Muy bien! Misión cumplida ✔' : P.m; $('dato').textContent = '💡 ' + P.d;
    $('mis').className = 'mision' + (hecho[paso] ? ' ok' : ''); $('bAnt').disabled = paso === 0; $('bSig').disabled = paso === 2; $('fin').className = 'fin' + (hecho.every(Boolean) ? ' v' : '');
  }
  function ir(n) { paso = n; llueve = false; ctl(); pintar(); }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); }; $('bSig').onclick = function () { if (paso < 2) ir(paso + 1); };
  window.__agua = { ir: ir, setSol: function (v) { sol = v; }, llover: function () { llueve = true; }, frio: function (v) { frio = v; }, avanzar: function (s) { for (var i = 0; i < s * 20; i++) simular(0.05); }, estado: function () { return { hecho: hecho.slice(), evap: evap, nube: nube, regreso: regreso }; } };
  ctl(); pintar(); requestAnimationFrame(frame);
})();
