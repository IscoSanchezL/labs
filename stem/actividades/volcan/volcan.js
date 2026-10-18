/* Volcanes (4°, solo español, sin voz): partes de un volcán, presión del magma y tipos de erupción según la viscosidad. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var cv = $('cv'), g = cv.getContext('2d'), W = cv.width, H = cv.height;
  var PARTES = {
    camara: { n: 'Cámara magmática', f: 'Es el gran depósito subterráneo donde se acumula el magma, roca derretida a más de 700 °C.', x: 480, y: 395, r: 80 },
    chimenea: { n: 'Chimenea', f: 'Es el conducto por donde sube el magma hacia la superficie.', x: 480, y: 270, r: 38 },
    crater: { n: 'Cráter', f: 'Es la abertura de la cima por donde salen la lava, los gases y la ceniza.', x: 480, y: 140, r: 56 },
    cono: { n: 'Cono volcánico', f: 'Es la montaña que se forma con las capas de lava y ceniza de muchas erupciones.', x: 330, y: 250, r: 62 },
    lava: { n: 'Lava', f: 'Es el magma cuando sale a la superficie. Al enfriarse se convierte en roca.', x: 480, y: 120, r: 0 }
  };
  var PASOS = [
    { n: 'Por dentro', t: '1. ¿Cómo es un volcán por dentro?', x: 'Un volcán es una grieta de la Tierra por donde sale el <b>magma</b> de su interior. Toca cada parte del dibujo para descubrir qué hace.', m: 'Toca 4 partes del volcán: la cámara magmática, la chimenea, el cráter y el cono.', d: 'En la Tierra hay unos 1 500 volcanes que pueden entrar en erupción.' },
    { n: 'La presión', t: '2. ¿Por qué erupciona?', x: 'Dentro de la cámara el magma se calienta y los <b>gases</b> se acumulan. La <b>presión</b> sube hasta que el magma rompe la salida y se produce la <b>erupción</b>.', m: 'Sube la presión con el control (o con el botón de calor) hasta que el volcán erupcione.', d: 'La olla a presión funciona parecido: si no tiene válvula, la presión busca por dónde salir.' },
    { n: 'Tipos de erupción', t: '3. Suaves o explosivas', x: 'Si el magma es <b>fluido</b> (poco viscoso), la lava corre por las laderas con calma. Si es <b>espeso</b> (muy viscoso), los gases quedan atrapados y la erupción es una <b>explosión</b> con una gran columna de ceniza.', m: 'Provoca una erupción con magma muy fluido y otra con magma muy espeso.', d: 'El Kilauea, en Hawái, tiene lava fluida; el Vesubio, en Italia, tiene erupciones explosivas.' }
  ];
  var paso = 0, hecho = [false, false, false], tocados = {}, sel = null, vistos = {};
  var P = 0.35, V = 0.5, er = null, part = [], ceniza = [], flujo = [], tiempo = 0, shake = 0, msj = '';
  var ac = null;
  function tono(f, v, d, tp) { try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume(); var o = ac.createOscillator(), gn = ac.createGain(); o.type = tp || 'sine'; o.frequency.value = f; gn.gain.setValueAtTime(v, ac.currentTime); gn.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d); o.connect(gn); gn.connect(ac.destination); o.start(); o.stop(ac.currentTime + d); } catch (e) {} }
  function ex() { tono(660, 0.2, 0.2); setTimeout(function () { tono(880, 0.2, 0.3); }, 130); }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; ex(); pintar(); }
  function ladera(x) { return x < 480 ? 140 + (480 - x) * 0.62 : 140 + (x - 480) * 0.62; }
  function erupcionar() {
    if (er) return; er = { t: 0, v: V, dur: 7 }; shake = 1; tono(70, 0.35, 1.2, 'sawtooth'); flujo = []; msj = V > 0.6 ? '¡EXPLOSIÓN! Magma espeso: los gases salen de golpe.' : V < 0.4 ? 'Erupción suave: la lava fluida corre por la ladera.' : 'Erupción mixta.';
    if (paso === 1) cumplir(1);
    if (paso === 2) { if (V < 0.25) vistos.fluida = 1; if (V > 0.75) vistos.espesa = 1; if (vistos.fluida && vistos.espesa) cumplir(2); }
  }
  function sim(dt) {
    tiempo += dt; shake = Math.max(0, shake - dt * 0.6);
    if (!er) { if (P >= 1) erupcionar(); }
    else {
      er.t += dt; var expl = er.v, tasa = 38 + expl * 120;
      for (var i = 0; i < tasa * dt; i++) { var a = -Math.PI / 2 + (Math.random() - 0.5) * (0.5 + (1 - expl) * 0.6); var sp = (180 + Math.random() * 220) * (0.7 + expl * 0.9); part.push({ x: 480 + (Math.random() - 0.5) * 30, y: 130, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, v: 1 }); }
      if (expl > 0.55) for (var j = 0; j < 5 * dt * 60 * 0.4; j++) ceniza.push({ x: 480 + (Math.random() - 0.5) * 40, y: 120, vx: (Math.random() - 0.5) * 40, vy: -(60 + Math.random() * 90 * expl), r: 14 + Math.random() * 24, a: 0.55 });
      if (expl < 0.6 && er.t < 5.5) { if (Math.random() < 0.5) flujo.push({ side: Math.random() < 0.5 ? -1 : 1, x: 480, s: 0, w: 1 + (1 - expl) * 2 }); }
      P = Math.max(0.35, 1 - er.t / er.dur * 0.65);
      if (er.t >= er.dur) { er = null; P = 0.35; }
    }
    part = part.filter(function (p) { p.vy += 380 * dt; p.x += p.vx * dt; p.y += p.vy * dt; return p.y < 410 && p.x > 0 && p.x < W; });
    ceniza = ceniza.filter(function (c) { c.x += c.vx * dt + Math.sin(tiempo + c.y) * 0.3; c.y += c.vy * dt; c.r += dt * 8; c.a -= dt * 0.1; return c.a > 0 && c.y > -60; });
    flujo.forEach(function (f) { f.s += dt * (60 + (1 - (er ? er.v : 0.5)) * 90); f.x = 480 + f.side * Math.min(f.s, 300); });
    flujo = flujo.filter(function (f) { return f.s < 340; });
  }
  function dib() {
    var dx = shake ? (Math.random() - 0.5) * 8 * shake : 0, dy = shake ? (Math.random() - 0.5) * 8 * shake : 0;
    var gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, er && er.v > 0.55 ? '#2b1215' : '#1a1030'); gr.addColorStop(1, '#0b0610'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    for (var i = 0; i < 50; i++) { g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect((i * 151) % W, (i * 47) % 150, 1.6, 1.6); }
    g.save(); g.translate(dx, dy);
    ceniza.forEach(function (c) { var cg = g.createRadialGradient(c.x, c.y, 2, c.x, c.y, c.r); cg.addColorStop(0, 'rgba(90,80,90,' + c.a + ')'); cg.addColorStop(1, 'rgba(60,55,65,0)'); g.fillStyle = cg; g.beginPath(); g.arc(c.x, c.y, c.r, 0, 7); g.fill(); });
    // montaña
    var mg = g.createLinearGradient(0, 130, 0, H); mg.addColorStop(0, '#4b3a45'); mg.addColorStop(1, '#1f1218'); g.fillStyle = mg; g.beginPath(); g.moveTo(0, H); g.lineTo(0, 400); g.lineTo(140, 340); g.lineTo(424, 150); g.lineTo(456, 150); g.lineTo(470, 160); g.lineTo(490, 160); g.lineTo(504, 150); g.lineTo(536, 150); g.lineTo(820, 340); g.lineTo(W, 400); g.lineTo(W, H); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 2; for (var k = 0; k < 6; k++) { g.beginPath(); g.moveTo(180 + k * 120, 380 - k * 10); g.lineTo(440 + k * 14, 165 + k * 8); g.stroke(); }
    // cámara y chimenea (magma)
    var nivel = er ? 1 : Math.min(1, P * 0.9 + 0.05), mc = g.createRadialGradient(480, 395, 10, 480, 395, 100); mc.addColorStop(0, '#fff2a0'); mc.addColorStop(0.5, '#ff7a1a'); mc.addColorStop(1, '#8a1a05'); g.fillStyle = mc; g.beginPath(); g.ellipse(480, 395, 100 + Math.sin(tiempo * 2) * 3, 62, 0, 0, 7); g.fill();
    var top = 395 - 40 - (395 - 150 - 40) * nivel; var cg2 = g.createLinearGradient(0, top, 0, 395); cg2.addColorStop(0, '#ff9a2a'); cg2.addColorStop(1, '#c4300a'); g.fillStyle = cg2; g.fillRect(468, top, 24, 395 - 40 - top + 6);
    // burbujas de gas
    g.fillStyle = 'rgba(255,240,200,.8)'; for (var b = 0; b < Math.round(P * 14); b++) { var bx = 470 + ((b * 37) % 20), by = 380 - ((tiempo * 60 + b * 41) % (330 * nivel)); g.beginPath(); g.arc(bx, by, 2 + (b % 3), 0, 7); g.fill(); }
    // flujos de lava
    flujo.forEach(function (f) { var y = ladera(f.x); g.fillStyle = 'rgba(255,' + Math.round(120 + 60 * Math.sin(tiempo * 5 + f.s)) + ',30,.95)'; g.beginPath(); g.arc(f.x, y - 2, 3 + f.w, 0, 7); g.fill(); });
    part.forEach(function (p) { g.fillStyle = 'rgba(255,' + Math.round(140 + 90 * Math.random()) + ',40,' + 0.95 + ')'; g.shadowColor = '#ff8a2a'; g.shadowBlur = 10; g.beginPath(); g.arc(p.x, p.y, 3.2, 0, 7); g.fill(); }); g.shadowBlur = 0;
    g.restore();
    // etiquetas
    if (paso === 0) { Object.keys(PARTES).forEach(function (k) { var p = PARTES[k]; if (k === 'lava') return; g.strokeStyle = sel === k ? '#7ff0e4' : 'rgba(127,240,228,.4)'; g.lineWidth = sel === k ? 4 : 2; g.setLineDash([6, 6]); g.beginPath(); g.arc(p.x, p.y, p.r, 0, 7); g.stroke(); g.setLineDash([]); if (tocados[k]) { g.fillStyle = '#8be8ae'; g.font = '700 22px system-ui'; g.fillText('✔', p.x - 8, p.y + 8); } }); }
    g.fillStyle = 'rgba(7,3,8,.78)'; g.fillRect(0, H - 56, W, 56); g.textAlign = 'center'; g.font = '700 19px "Space Grotesk",system-ui,sans-serif'; g.fillStyle = '#ffe08a';
    var tx = paso === 0 ? (sel ? PARTES[sel].n + ': ' + PARTES[sel].f : 'Toca una parte del volcán (' + Object.keys(tocados).length + '/4)') : (msj || 'Presión: ' + Math.round(P * 100) + '% · Viscosidad del magma: ' + (V > 0.6 ? 'ESPESO' : V < 0.4 ? 'FLUIDO' : 'MEDIA'));
    wrap(tx, W / 2, H - 30, W - 60);
    if (paso >= 1) { g.fillStyle = 'rgba(7,3,8,.7)'; g.fillRect(16, 16, 190, 34); g.fillStyle = '#2a1b2a'; g.fillRect(24, 28, 120, 10); g.fillStyle = P > 0.85 ? '#ff4a2a' : '#ffb347'; g.fillRect(24, 28, 120 * Math.min(1, P), 10); g.fillStyle = '#cfe6ff'; g.font = '600 13px "JetBrains Mono",monospace'; g.textAlign = 'left'; g.fillText(Math.round(P * 100) + '% presión', 150, 38); }
  }
  function wrap(t, x, y, max) { g.font = '700 18px "Space Grotesk",system-ui,sans-serif'; var ws = t.split(' '), l = '', ls = []; ws.forEach(function (w) { var tt = l ? l + ' ' + w : w; if (g.measureText(tt).width > max) { ls.push(l); l = w; } else l = tt; }); ls.push(l); ls.forEach(function (s, i) { g.fillText(s, x, y - (ls.length - 1) * 11 + i * 22); }); }
  function xy(e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; }
  function clic(x, y) {
    if (paso !== 0) return; var best = null, bd = 1e9;
    Object.keys(PARTES).forEach(function (k) { var p = PARTES[k]; if (!p.r) return; var d = Math.hypot(x - p.x, y - p.y); if (d < p.r && d < bd) { best = k; bd = d; } });
    if (best) { sel = best; tocados[best] = 1; tono(500 + Object.keys(tocados).length * 90, 0.12, 0.15); if (Object.keys(tocados).length >= 4) cumplir(0); } else sel = null;
  }
  cv.addEventListener('click', function (e) { var q = xy(e); clic(q[0], q[1]); });
  var last = 0;
  function frame(ms) { var dt = Math.min(0.05, (ms - (last || ms)) / 1000); last = ms; sim(dt); dib(); requestAnimationFrame(frame); }
  function ctl() {
    var c = $('ctl'); c.textContent = '';
    function rango(etq, min, max, step, val, fn) { var l = document.createElement('label'); l.className = 'rango'; l.innerHTML = etq + ' <input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" aria-label="' + etq + '">'; l.querySelector('input').oninput = function (e) { fn(Number(e.target.value)); }; c.appendChild(l); }
    if (paso >= 1) { rango('🌡️ Presión', 0.3, 1, 0.01, P, function (v) { if (!er) P = v; }); var b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.textContent = '🔥 Más calor'; b.onclick = function () { if (!er) { P = Math.min(1, P + 0.18); tono(200 + P * 300, 0.1, 0.15); ctl(); } }; c.appendChild(b); }
    if (paso === 2) rango('🍯 Viscosidad', 0, 1, 0.05, V, function (v) { V = v; });
  }
  function pintar() {
    var p = $('pasos'); p.textContent = '';
    PASOS.forEach(function (Q, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === paso)); b.innerHTML = '<b>' + (hecho[i] ? '✓' : i + 1) + '</b>' + Q.n; b.onclick = function () { ir(i); }; p.appendChild(b); });
    var Q = PASOS[paso]; $('tit').textContent = Q.t; $('txt').innerHTML = Q.x; $('misTxt').textContent = hecho[paso] ? '¡Muy bien! Misión cumplida ✔' : Q.m; $('dato').textContent = '💡 ' + Q.d;
    $('mis').className = 'mision' + (hecho[paso] ? ' ok' : ''); $('bAnt').disabled = paso === 0; $('bSig').disabled = paso === 2; $('fin').className = 'fin' + (hecho.every(Boolean) ? ' v' : '');
  }
  function ir(n) { paso = n; sel = null; msj = ''; er = null; part = []; ceniza = []; flujo = []; P = 0.35; ctl(); pintar(); }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); }; $('bSig').onclick = function () { if (paso < 2) ir(paso + 1); };
  window.__volcan = { ir: ir, clic: clic, setP: function (v) { P = v; }, setV: function (v) { V = v; }, avanzar: function (s) { for (var i = 0; i < s * 40; i++) sim(0.025); }, erup: function () { return !!er; }, estado: function () { return { hecho: hecho.slice() }; } };
  ctl(); pintar(); requestAnimationFrame(frame);
})();
