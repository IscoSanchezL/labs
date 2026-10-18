/* Rampas y fricción (2°, solo español, sin voz): la superficie, la inclinación y el peso al deslizar una caja. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var cv = $('cv'), g = cv.getContext('2d'), W = cv.width, H = cv.height;
  var PASOS = [
    { n: 'Superficies', t: '1. ¿Qué superficie resbala más?', x: 'Cuando algo se desliza, la superficie lo frena. Ese freno se llama <b>fricción</b>. En el <b>hielo</b> casi no hay fricción; en la <b>lija</b> hay muchísima.', m: 'Suelta la caja en las 4 superficies: hielo, madera, alfombra y lija.', d: 'Los zapatos tienen suela rugosa para tener más fricción y no resbalar.' },
    { n: 'Inclinación', t: '2. ¿Y si la rampa está más inclinada?', x: 'Mientras más <b>inclinada</b> está la rampa, más fuerte tira la gravedad de la caja hacia abajo y llega más rápido y más lejos.', m: 'Prueba 3 inclinaciones distintas y mira hasta dónde llega la caja.', d: 'Por eso los toboganes empinados son más veloces que los suaves.' },
    { n: 'Liviana o pesada', t: '3. ¿Una caja pesada resbala más?', x: 'Parece que la pesada ganaría, ¿verdad? Haz la carrera: suelta una caja <b>liviana</b> y una <b>pesada</b> al mismo tiempo y mira quién llega primero.', m: 'Suelta las dos cajas juntas y observa qué pasa.', d: 'La gravedad acelera igual a todos los objetos; el peso no cambia la carrera.' }
  ];
  var paso = 0, hecho = [false, false, false];
  var ac = null;
  function tono(f, v, d) { try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume(); var o = ac.createOscillator(), gn = ac.createGain(); o.type = 'triangle'; o.frequency.value = f; gn.gain.setValueAtTime(v, ac.currentTime); gn.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d); o.connect(gn); gn.connect(ac.destination); o.start(); o.stop(ac.currentTime + d); } catch (e) {} }
  function ex() { tono(660, 0.2, 0.2); setTimeout(function () { tono(880, 0.2, 0.3); }, 130); }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; ex(); pintar(); }

  var SUP = { hielo: { n: 'Hielo', e: '❄️', mu: 0.08, c: '#bfe9ff' }, madera: { n: 'Madera', e: '🪵', mu: 0.25, c: '#d9a066' }, alfombra: { n: 'Alfombra', e: '🧶', mu: 0.45, c: '#e0698f' }, lija: { n: 'Lija', e: '🧱', mu: 0.8, c: '#b9a58a' } };
  var G = 500, L = 300, PISO = 340, BX = 330, PL = 570;
  var sup = 'madera', ang = 35, probadas = {}, angulos = [], cajas = [], msg = '', tiempo = 0;
  function rad() { return ang * Math.PI / 180; }
  function soltar() {
    var mu = SUP[sup].mu, a = G * (Math.sin(rad()) - mu * Math.cos(rad()));
    cajas = [{ s: 0, v: 0, x: 0, fase: 'rampa', carril: 0, e: paso === 2 ? '🧸' : '📦', n: 'liviana' }];
    if (paso === 2) cajas.push({ s: 0, v: 0, x: 0, fase: 'rampa', carril: 1, e: '🧱', n: 'pesada' });
    cajas.forEach(function (c) { c.pega = a <= 0; });
    msg = a <= 0 ? '¡Se quedó pegada! Hay tanta fricción que la caja no se mueve.' : ''; tono(420, 0.12, 0.15);
    if (paso === 0) { probadas[sup] = true; if (Object.keys(probadas).length === 4) cumplir(0); }
    if (paso === 1 && a > 0) { if (angulos.every(function (x) { return Math.abs(x - ang) >= 8; })) angulos.push(ang); if (angulos.length >= 3) cumplir(1); }
    if (paso === 2) cajas.soltadas = true;
    cajas.fin = false;
  }
  function simular(dt) {
    tiempo += dt;
    var mu = SUP[sup].mu, a = G * (Math.sin(rad()) - mu * Math.cos(rad()));
    var todas = true;
    cajas.forEach(function (c) {
      if (c.pega) { return; }
      if (c.fase === 'rampa') { c.v += a * dt; c.s += c.v * dt; todas = false; if (c.s >= L) { c.s = L; c.fase = 'piso'; c.v *= Math.cos(rad()); } }
      else if (c.fase === 'piso') { c.v -= mu * G * dt; c.x += Math.max(0, c.v) * dt; if (c.v <= 0) { c.v = 0; c.fase = 'quieta'; } else todas = false; if (c.x >= PL - 30) { c.x = PL - 30; c.fase = 'quieta'; c.final = true; } }
    });
    if (cajas.length && !cajas.fin && todas) {
      cajas.fin = true;
      var c0 = cajas[0];
      if (!c0.pega) {
        if (paso === 2) { msg = '¡Empate! Las dos llegaron igual de lejos.'; cumplir(2); }
        else msg = c0.final ? '¡Llegó hasta el final! Casi no hay fricción.' : 'Llegó a ' + (c0.x / 100).toFixed(1) + ' metros.';
      } else if (paso === 2) { msg = 'Con esta superficie no se mueven. Prueba hielo o madera.'; }
    }
  }
  function dibCaja(c) {
    var px, py, ra = 0;
    if (c.fase === 'rampa') { var tx = BX - L * Math.cos(rad()), ty = PISO - L * Math.sin(rad()); px = tx + c.s * Math.cos(rad()); py = ty + c.s * Math.sin(rad()); ra = rad(); }
    else { px = BX + c.x; py = PISO; }
    var off = c.carril ? 56 : 0, nx = -Math.sin(ra), ny = -Math.cos(ra);
    var ox = px, oy = py + (c.carril ? 46 : 0);
    g.save(); g.translate(ox, oy - (c.fase === 'rampa' ? 0 : 0)); g.rotate(c.fase === 'rampa' ? ra : 0);
    var yy = -34 - (c.carril ? 0 : 0);
    g.fillStyle = c.carril ? '#8a5a3c' : '#ffcf5a'; g.strokeStyle = '#2a1b4a'; g.lineWidth = 4; roundR(-30, yy - 28 + (c.carril ? 0 : 0), 60, 60, 12); g.fill(); g.stroke();
    g.font = '36px system-ui'; g.textAlign = 'center'; g.fillStyle = '#000'; g.fillText(c.e, 0, yy + 14);
    g.restore();
  }
  function roundR(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  function dibujar() {
    var gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#6fc6ff'); gr.addColorStop(1, '#c9ecff'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.fillStyle = '#fff'; [[120, 70, 1], [620, 54, 0.8], [830, 96, 1.1]].forEach(function (n) { g.beginPath(); g.arc(n[0], n[1], 26 * n[2], 0, 7); g.arc(n[0] + 30 * n[2], n[1] + 6, 20 * n[2], 0, 7); g.arc(n[0] - 28 * n[2], n[1] + 8, 18 * n[2], 0, 7); g.fill(); });
    g.fillStyle = '#7ed56f'; g.fillRect(0, PISO, W, H - PISO);
    // piso (superficie elegida)
    g.fillStyle = SUP[sup].c; var ph = paso === 2 ? 72 : 26; g.fillRect(BX, PISO, PL, ph); g.strokeStyle = '#2a1b4a'; g.lineWidth = 4; g.strokeRect(BX, PISO, PL, ph);
    // rampa
    var tx = BX - L * Math.cos(rad()), ty = PISO - L * Math.sin(rad());
    g.fillStyle = '#9a7bd8'; g.beginPath(); g.moveTo(tx, ty); g.lineTo(BX, PISO); g.lineTo(tx, PISO); g.closePath(); g.fill(); g.stroke();
    g.strokeStyle = SUP[sup].c; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(tx, ty); g.lineTo(BX, PISO); g.stroke(); g.strokeStyle = '#2a1b4a'; g.lineWidth = 3; g.beginPath(); g.moveTo(tx - 4, ty - 8); g.lineTo(BX, PISO - 8); g.stroke();
    // metros
    g.fillStyle = '#2a1b4a'; g.font = '700 16px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'center';
    for (var m = 0; m <= 5; m++) { var yb = PISO + (paso === 2 ? 72 : 26); g.fillRect(BX + m * 100 - 1, yb, 3, 10); g.fillText(m + ' m', BX + m * 100, yb + 30); }
    // meta
    g.font = '30px system-ui'; g.fillText('🏁', BX + PL - 10, PISO - 4);
    cajas.forEach(dibCaja);
    if (paso === 1) { g.fillStyle = '#2a1b4a'; g.font = '700 22px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'left'; g.fillText('Inclinación: ' + ang + '°', 24, 40); }
    g.fillStyle = '#2a1b4a'; g.font = '700 24px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'center'; g.fillText(msg, W / 2, 436);
  }
  var last = 0;
  function frame(ms) { var dt = Math.min(0.05, (ms - last) / 1000); last = ms; simular(dt); dibujar(); requestAnimationFrame(frame); }
  function ctl() {
    var c = $('ctl'); c.textContent = '';
    function btn(txt, fn, cls, pr) { var b = document.createElement('button'); b.type = 'button'; b.className = cls || 'btn sec'; b.textContent = txt; b.onclick = fn; if (pr !== undefined) b.setAttribute('aria-pressed', String(pr)); c.appendChild(b); return b; }
    Object.keys(SUP).forEach(function (k) { btn(SUP[k].e + ' ' + SUP[k].n + (paso === 0 && probadas[k] ? ' ✓' : ''), function () { sup = k; cajas = []; msg = ''; ctl(); }, 'tab', sup === k); });
    if (paso === 1) { var l = document.createElement('label'); l.className = 'rango'; l.innerHTML = '📐 Inclinación <input type="range" min="15" max="50" value="' + ang + '" aria-label="Inclinación de la rampa">'; l.querySelector('input').oninput = function (e) { ang = Number(e.target.value); cajas = []; msg = ''; }; c.appendChild(l); }
    btn('🚀 ¡Soltar!', soltar, 'btn grande');
  }
  function pintar() {
    var p = $('pasos'); p.textContent = '';
    PASOS.forEach(function (P, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === paso)); b.innerHTML = '<b>' + (hecho[i] ? '✓' : i + 1) + '</b>' + P.n; b.onclick = function () { ir(i); }; p.appendChild(b); });
    var P = PASOS[paso]; $('tit').textContent = P.t; $('txt').innerHTML = P.x; $('misTxt').textContent = hecho[paso] ? '¡Muy bien! Misión cumplida ✔' : P.m; $('dato').textContent = '💡 ' + P.d;
    $('mis').className = 'mision' + (hecho[paso] ? ' ok' : ''); $('bAnt').disabled = paso === 0; $('bSig').disabled = paso === 2; $('fin').className = 'fin' + (hecho.every(Boolean) ? ' v' : '');
  }
  function ir(n) { paso = n; cajas = []; msg = ''; if (n === 2 && sup === 'lija') sup = 'madera'; ctl(); pintar(); }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); }; $('bSig').onclick = function () { if (paso < 2) ir(paso + 1); };
  window.__rampas = { ir: ir, soltar: soltar, setSup: function (k) { sup = k; }, setAng: function (a) { ang = a; cajas = []; }, avanzar: function (s) { for (var i = 0; i < s * 40; i++) simular(0.025); }, estado: function () { return { hecho: hecho.slice(), msg: msg, x: cajas.map(function (c) { return Math.round(c.x); }) }; } };
  ctl(); pintar(); requestAnimationFrame(frame);
})();
