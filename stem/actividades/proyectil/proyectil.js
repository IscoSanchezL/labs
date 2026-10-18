/* Tiro parabólico (6°, solo español, sin voz): ángulo, velocidad y gravedad de distintos mundos. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var cv = $('cv'), g = cv.getContext('2d'), W = cv.width, H = cv.height;
  var PASOS = [
    { n: 'Apunta', t: '1. Ángulo y velocidad', x: 'Un proyectil lanzado sigue una curva llamada <b>parábola</b>: avanza a velocidad constante en horizontal mientras la gravedad lo frena y lo baja en vertical. Tú controlas el <b>ángulo</b> y la <b>velocidad</b> de salida.', m: 'Acierta el objetivo 2 veces. Usa la guía de trayectoria si la necesitas.', d: 'Los ingenieros usan estas mismas ecuaciones para balones, fuentes de agua y satélites.' },
    { n: 'El mejor ángulo', t: '2. ¿Con qué ángulo llega más lejos?', x: 'Con la misma velocidad, el alcance depende del ángulo: R = v² · sen(2θ) / g. Es máximo en <b>45°</b>, y ángulos que suman 90° (como 30° y 60°) llegan <b>igual de lejos</b>.', m: 'Con la misma velocidad, dispara con 3 ángulos que se diferencien al menos 12° y compara los alcances.', d: 'Un lanzador de jabalina intenta soltar la jabalina cerca de 35°–40°, porque suelta desde cierta altura y con resistencia del aire.' },
    { n: 'Otros mundos', t: '3. La gravedad cambia la parábola', x: 'En la <b>Luna</b> la gravedad es 6 veces menor y el proyectil vuela muchísimo más lejos; en <b>Júpiter</b> es 2,5 veces mayor y cae enseguida. La velocidad y el ángulo no bastan: hay que contar con la gravedad.', m: 'Acierta el objetivo en la Luna, en Marte y en Júpiter.', d: 'En 1971 el astronauta Alan Shepard golpeó pelotas de golf en la Luna y volaron cientos de metros.' }
  ];
  var MUNDOS = { tierra: { n: 'Tierra', g: 9.8, c1: '#0b2a55', c2: '#7fc0ee', suelo: '#2f5d3a', e: '🌍' }, luna: { n: 'Luna', g: 1.62, c1: '#02040a', c2: '#1a2033', suelo: '#6c7380', e: '🌕' }, marte: { n: 'Marte', g: 3.71, c1: '#2a0f0a', c2: '#b4663f', suelo: '#8a4a2c', e: '🔴' }, jupiter: { n: 'Júpiter', g: 24.8, c1: '#2b1a0b', c2: '#d9a066', suelo: '#7a5a3a', e: '🟠' } };
  var paso = 0, hecho = [false, false, false];
  var ang = 45, vel = 30, mundo = 'tierra', guia = true;
  var S = 4.4, X0 = 44, GY = 400, TW = 5;
  var obj = 100, disparo = null, parts = [], msj = '', aciertos = 0, mundosOk = {}, tiros2 = [], vel2 = null, tiempo = 0;
  var ac = null;
  function tono(f, v, d, tipo) { try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume(); var o = ac.createOscillator(), gn = ac.createGain(); o.type = tipo || 'sine'; o.frequency.value = f; gn.gain.setValueAtTime(v, ac.currentTime); gn.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d); o.connect(gn); gn.connect(ac.destination); o.start(); o.stop(ac.currentTime + d); } catch (e) {} }
  function ex() { tono(660, 0.2, 0.2); setTimeout(function () { tono(880, 0.2, 0.3); }, 130); }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; ex(); pintar(); }
  function gg() { return MUNDOS[mundo].g; }
  function nuevoObjetivo() { var hi = Math.min(180, Math.floor(0.85 * 1600 / gg())), lo = Math.min(45, Math.floor(hi * 0.5)); obj = lo + Math.round(Math.random() * (hi - lo)); }
  function disparar() {
    var r = ang * Math.PI / 180, vx = vel * Math.cos(r), vy = vel * Math.sin(r), gr = gg();
    disparo = { t: 0, vx: vx, vy: vy, g: gr, ang: ang, vel: vel, pts: [], fin: false, x: 0, y: 0, alcance: vx * 2 * vy / gr, hmax: vy * vy / (2 * gr) };
    msj = ''; tono(120, 0.25, 0.25, 'sawtooth');
  }
  function fin(d) {
    d.fin = true; var dist = d.alcance, ok = Math.abs(dist - obj) <= TW;
    for (var i = 0; i < 30; i++) parts.push({ x: X0 + dist * S, y: GY, vx: (Math.random() - 0.5) * 220, vy: -Math.random() * 260, a: 1, c: ok ? '#8be8ae' : '#ffb366' });
    if (paso === 1) {
      var base = vel2; if (base === null || Math.abs(base - d.vel) > 2) { tiros2 = []; vel2 = d.vel; }
      if (tiros2.every(function (a) { return Math.abs(a - d.ang) >= 12; })) tiros2.push(d.ang);
      msj = 'Alcance: ' + dist.toFixed(0) + ' m' + (tiros2.length < 3 ? ' · ángulos probados: ' + tiros2.length + '/3' : '');
      if (tiros2.length >= 3) cumplir(1);
    } else if (ok) {
      msj = '¡DIANA! Alcance ' + dist.toFixed(0) + ' m'; tono(880, 0.2, 0.3); 
      if (paso === 0) { aciertos++; if (aciertos >= 2) cumplir(0); }
      if (paso === 2) { mundosOk[mundo] = true; if (mundosOk.luna && mundosOk.marte && mundosOk.jupiter) cumplir(2); }
      nuevoObjetivo();
    } else msj = (dist < obj ? 'Corto' : 'Largo') + ': alcance ' + dist.toFixed(0) + ' m, objetivo a ' + obj + ' m';
  }
  function sim(dt) {
    tiempo += dt;
    if (disparo && !disparo.fin) {
      var d = disparo; d.t += dt; d.x = d.vx * d.t; d.y = d.vy * d.t - 0.5 * d.g * d.t * d.t;
      d.pts.push([d.x, d.y, tiempo]); if (d.pts.length > 400) d.pts.shift();
      if (d.y <= 0 && d.t > 0.05) { d.y = 0; fin(d); }
    }
    parts = parts.filter(function (p) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 500 * dt; p.a -= dt * 0.9; return p.a > 0; });
  }
  function sx(m) { return X0 + m * S; }
  function sy(m) { return GY - m * S; }
  function fondo() {
    var M = MUNDOS[mundo], gr = g.createLinearGradient(0, 0, 0, GY); gr.addColorStop(0, M.c1); gr.addColorStop(1, M.c2); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    if (mundo !== 'tierra') { g.fillStyle = 'rgba(255,255,255,.8)'; for (var i = 0; i < 70; i++) { var x = (i * 137.5) % W, y = (i * 61.3) % (GY - 30); g.globalAlpha = 0.3 + 0.5 * ((i * 7) % 3) / 2; g.fillRect(x, y, 1.6, 1.6); } g.globalAlpha = 1; }
    if (mundo === 'luna') { var tg = g.createRadialGradient(780, 90, 6, 780, 90, 60); tg.addColorStop(0, '#9fd0ff'); tg.addColorStop(1, '#1b4a8a'); g.fillStyle = tg; g.beginPath(); g.arc(780, 90, 46, 0, 7); g.fill(); }
    if (mundo === 'jupiter') { for (var b = 0; b < 4; b++) { g.fillStyle = 'rgba(120,70,30,' + (0.12 + b * 0.05) + ')'; g.fillRect(0, 60 + b * 60, W, 22); } }
    if (mundo === 'tierra') { g.fillStyle = 'rgba(255,255,255,.55)'; [[200, 80], [560, 60], [820, 110]].forEach(function (n) { g.beginPath(); g.arc(n[0], n[1], 24, 0, 7); g.arc(n[0] + 28, n[1] + 6, 18, 0, 7); g.arc(n[0] - 26, n[1] + 8, 16, 0, 7); g.fill(); }); }
    // montañas lejanas
    g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.moveTo(0, GY); for (var k = 0; k <= 12; k++) g.lineTo(k * 80, GY - 36 - 26 * Math.abs(Math.sin(k * 1.7))); g.lineTo(W, GY); g.fill();
    g.fillStyle = M.suelo; g.fillRect(0, GY, W, H - GY);
    g.strokeStyle = 'rgba(255,255,255,.14)'; g.lineWidth = 1; g.fillStyle = 'rgba(255,255,255,.7)'; g.font = '600 13px "JetBrains Mono",monospace'; g.textAlign = 'center';
    for (var m = 0; m <= 200; m += 25) { g.beginPath(); g.moveTo(sx(m), GY); g.lineTo(sx(m), H); g.stroke(); g.fillText(m + ' m', sx(m), GY + 22); }
  }
  function cañon() {
    g.save(); g.translate(X0, GY - 12); g.fillStyle = '#2a3550'; g.beginPath(); g.arc(0, 0, 20, Math.PI, 0); g.fill(); g.rotate(-ang * Math.PI / 180); g.fillStyle = '#9db8ff'; g.fillRect(0, -9, 52, 18); g.fillStyle = '#7ff0e4'; g.fillRect(48, -11, 8, 22); g.restore();
  }
  function objetivo() {
    var x = sx(obj); g.fillStyle = '#fff'; g.fillRect(x - TW * S, GY - 4, TW * 2 * S, 4);
    for (var r = 3; r >= 1; r--) { g.fillStyle = r % 2 ? '#ff6b6b' : '#fff'; g.beginPath(); g.ellipse(x, GY - 2, r * TW * S / 3, r * 9, 0, Math.PI, 0); g.fill(); }
    g.fillStyle = '#ffe08a'; g.font = '700 14px "JetBrains Mono",monospace'; g.textAlign = 'center'; g.fillText('🎯 ' + obj + ' m', x, GY - 40);
  }
  function guiaTray() {
    var r = ang * Math.PI / 180, vx = vel * Math.cos(r), vy = vel * Math.sin(r), gr = gg(), T = 2 * vy / gr;
    g.setLineDash([5, 7]); g.strokeStyle = 'rgba(127,240,228,.55)'; g.lineWidth = 2; g.beginPath();
    for (var i = 0; i <= 60; i++) { var t = T * i / 60, x = sx(vx * t), y = sy(vy * t - 0.5 * gr * t * t); if (i) g.lineTo(x, y); else g.moveTo(x, y); } g.stroke(); g.setLineDash([]);
  }
  function dibujar(ms) {
    var dt = Math.min(0.05, (ms - (dibujar.l || ms)) / 1000); dibujar.l = ms; sim(dt);
    fondo(); objetivo(); if (guia && paso !== 1 && !(disparo && !disparo.fin)) guiaTray(); cañon();
    if (disparo) {
      var d = disparo; g.save(); g.lineCap = 'round';
      for (var i = 1; i < d.pts.length; i++) { var a = Math.max(0, 1 - (tiempo - d.pts[i][2]) / 3.5); g.strokeStyle = 'rgba(255,224,138,' + a + ')'; g.lineWidth = 3 + a * 3; g.shadowColor = '#ffd95e'; g.shadowBlur = 14; g.beginPath(); g.moveTo(sx(d.pts[i - 1][0]), sy(d.pts[i - 1][1])); g.lineTo(sx(d.pts[i][0]), sy(d.pts[i][1])); g.stroke(); }
      g.restore();
      if (!d.fin) { g.fillStyle = '#fff'; g.shadowColor = '#ffd95e'; g.shadowBlur = 20; g.beginPath(); g.arc(sx(d.x), sy(d.y), 8, 0, 7); g.fill(); g.shadowBlur = 0; }
    }
    parts.forEach(function (p) { g.globalAlpha = Math.max(0, p.a); g.fillStyle = p.c; g.beginPath(); g.arc(p.x, p.y, 3, 0, 7); g.fill(); }); g.globalAlpha = 1;
    // lecturas
    var r2 = ang * Math.PI / 180, gr = gg(), R = vel * vel * Math.sin(2 * r2) / gr, Hm = Math.pow(vel * Math.sin(r2), 2) / (2 * gr), T2 = 2 * vel * Math.sin(r2) / gr;
    g.fillStyle = 'rgba(3,8,16,.62)'; g.beginPath(); g.roundRect ? g.roundRect(14, 14, 252, 112, 12) : g.rect(14, 14, 252, 112); g.fill();
    g.font = '600 15px "JetBrains Mono",monospace'; g.textAlign = 'left'; g.fillStyle = '#7ff0e4'; g.fillText(MUNDOS[mundo].e + ' ' + MUNDOS[mundo].n + '  g = ' + gr + ' m/s²', 26, 38);
    g.fillStyle = '#cfe6ff'; g.fillText('Ángulo  ' + ang + '°   Vel ' + vel + ' m/s', 26, 62); g.fillStyle = '#c9a8ff'; g.fillText('Alcance      ' + R.toFixed(0) + ' m', 26, 86); g.fillStyle = '#ffe08a'; g.fillText('Altura máx.  ' + Hm.toFixed(0) + ' m · ' + T2.toFixed(1) + ' s', 26, 110);
    if (msj) { g.font = '700 22px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'center'; g.fillStyle = msj.indexOf('DIANA') > -1 ? '#8be8ae' : '#ffe08a'; g.fillText(msj, W / 2 + 80, 40); }
    if (paso === 1 && tiros2.length) { g.font = '600 14px "JetBrains Mono",monospace'; g.textAlign = 'right'; g.fillStyle = '#cfe6ff'; g.fillText('Mismos v = ' + vel2 + ' m/s: ' + tiros2.join('°, ') + '°', W - 20, 440); }
    requestAnimationFrame(dibujar);
  }
  function ctl() {
    var c = $('ctl'); c.textContent = '';
    function rango(etq, min, max, step, val, fn) { var l = document.createElement('label'); l.className = 'rango'; l.innerHTML = etq + ' <input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" aria-label="' + etq + '">'; l.querySelector('input').oninput = function (e) { fn(Number(e.target.value)); }; c.appendChild(l); }
    function btn(txt, fn, cls, pr) { var b = document.createElement('button'); b.type = 'button'; b.className = cls || 'btn sec'; b.textContent = txt; b.onclick = fn; if (pr !== undefined) b.setAttribute('aria-pressed', String(pr)); c.appendChild(b); }
    rango('📐 Ángulo', 5, 85, 1, ang, function (v) { ang = v; }); rango('💨 Velocidad', 5, 40, 1, vel, function (v) { vel = v; });
    if (paso === 2) ['luna', 'marte', 'tierra', 'jupiter'].forEach(function (k) { btn(MUNDOS[k].e + ' ' + MUNDOS[k].n + (mundosOk[k] ? ' ✓' : ''), function () { mundo = k; disparo = null; msj = ''; nuevoObjetivo(); ctl(); }, 'tab', mundo === k); });
    if (paso !== 1) btn('👁 Guía', function () { guia = !guia; ctl(); }, 'tab', guia);
    btn('💥 ¡Disparar!', disparar, 'btn grande');
  }
  function pintar() {
    var p = $('pasos'); p.textContent = '';
    PASOS.forEach(function (P, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === paso)); b.innerHTML = '<b>' + (hecho[i] ? '✓' : i + 1) + '</b>' + P.n; b.onclick = function () { ir(i); }; p.appendChild(b); });
    var P = PASOS[paso]; $('tit').textContent = P.t; $('txt').innerHTML = P.x; $('misTxt').textContent = hecho[paso] ? '¡Muy bien! Misión cumplida ✔' : P.m; $('dato').textContent = '💡 ' + P.d;
    $('mis').className = 'mision' + (hecho[paso] ? ' ok' : ''); $('bAnt').disabled = paso === 0; $('bSig').disabled = paso === 2; $('fin').className = 'fin' + (hecho.every(Boolean) ? ' v' : '');
  }
  function ir(n) { paso = n; disparo = null; msj = ''; if (n < 2) mundo = 'tierra'; if (n === 2) mundo = 'luna'; nuevoObjetivo(); ctl(); pintar(); }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); }; $('bSig').onclick = function () { if (paso < 2) ir(paso + 1); };
  window.__tiro = { ir: ir, setAng: function (v) { ang = v; }, setV: function (v) { vel = v; }, setMundo: function (k) { mundo = k; nuevoObjetivo(); }, disparar: disparar, avanzar: function (s) { for (var i = 0; i < s * 40; i++) sim(0.025); }, obj: function () { return obj; }, g: gg,
    apuntar: function () { var s2 = obj * gg() / (vel * vel); if (s2 > 1) return false; ang = Math.round(Math.asin(s2) * 90 / Math.PI); var R = vel * vel * Math.sin(2 * ang * Math.PI / 180) / gg(); return Math.abs(R - obj) <= TW; }, estado: function () { return { hecho: hecho.slice(), msj: msj }; } };
  ctl(); pintar(); nuevoObjetivo(); requestAnimationFrame(dibujar);
})();
