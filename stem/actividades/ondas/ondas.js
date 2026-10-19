/* Ondas (4°, solo español, sin voz): amplitud, frecuencia e interferencia en un osciloscopio con sonido. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var cv = $('cv'), g = cv.getContext('2d'), W = cv.width, H = cv.height;
  var PASOS = [
    { n: 'Amplitud', t: '1. Amplitud: qué tan alta es la onda', x: 'La <b>amplitud</b> es la altura de la onda desde el centro. En el sonido, mientras mayor es la amplitud, más <b>fuerte</b> se oye; en la luz, más <b>brillante</b> se ve.', m: 'Pon la amplitud muy baja (menos de 20%) y muy alta (más de 80%).', d: 'Un sonido muy fuerte tiene tanta energía que puede dañar el oído: por eso se mide en decibeles.' },
    { n: 'Frecuencia', t: '2. Frecuencia: cuántas ondas por segundo', x: 'La <b>frecuencia</b> cuenta cuántas ondas pasan en un segundo y se mide en <b>hertz (Hz)</b>. Más frecuencia significa ondas más apretadas y un sonido más <b>agudo</b>; menos, un sonido más <b>grave</b>.', m: 'Prueba una frecuencia baja (menos de 2) y una muy alta (más de 8).', d: 'Los humanos oímos aproximadamente entre 20 Hz y 20 000 Hz.' },
    { n: 'Interferencia', t: '3. Dos ondas que se encuentran', x: 'Cuando dos ondas se juntan, se <b>suman</b>. Si suben y bajan a la vez, se refuerzan. Si una sube cuando la otra baja (desfase de 180°), se <b>anulan</b>. Así funcionan los audífonos con cancelación de ruido.', m: 'Mueve el desfase hasta que la onda blanca (la suma) quede casi plana.', d: 'Los audífonos con cancelación de ruido crean una onda opuesta al ruido para anularlo.' }
  ];
  var paso = 0, hecho = [false, false, false], vistos = {};
  var A = 0.6, F = 3, FASE = 0, t0 = 0, sonando = false, ac = null, osc = null, gn = null;
  function ctxA() { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume(); return ac; }
  function hz() { return 130 * Math.pow(8, (F - 1) / 9); }
  function sonido(on) {
    try {
      if (on && !osc) { var c = ctxA(); osc = c.createOscillator(); gn = c.createGain(); osc.type = 'sine'; osc.connect(gn); gn.connect(c.destination); gn.gain.value = 0; osc.start(); }
      sonando = on; if (osc) { var c2 = ac; osc.frequency.setTargetAtTime(hz(), c2.currentTime, 0.02); gn.gain.setTargetAtTime(on && paso < 2 ? 0.02 + A * 0.2 : 0, c2.currentTime, 0.03); }
    } catch (e) {}
  }
  function ex() { try { var c = ctxA(), o = c.createOscillator(), q = c.createGain(); o.frequency.value = 880; q.gain.setValueAtTime(0.15, c.currentTime); q.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3); o.connect(q); q.connect(c.destination); o.start(); o.stop(c.currentTime + 0.3); } catch (e) {} }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; ex(); if (window.STEMFX) STEMFX.exito(); pintar(); }
  function revisar() {
    if (paso === 0) { if (A < 0.2) vistos.aBaja = 1; if (A > 0.8) vistos.aAlta = 1; if (vistos.aBaja && vistos.aAlta) cumplir(0); }
    if (paso === 1) { if (F < 2) vistos.fBaja = 1; if (F > 8) vistos.fAlta = 1; if (vistos.fBaja && vistos.fAlta) cumplir(1); }
    if (paso === 2) { var d = Math.abs(((FASE % 360) + 360) % 360 - 180); if (d < 8) cumplir(2); }
  }
  var CY = 168, AMP = 100, V3 = null, S3 = null;
  function y(x, a, f, ph, t) { return CY - a * AMP * Math.sin(2 * Math.PI * f * x / W - 2.6 * t + ph); }
  function traza(a, f, ph, t, col, ancho, glow) {
    g.save(); g.strokeStyle = col; g.lineWidth = ancho; g.lineJoin = 'round'; if (glow) { g.shadowColor = col; g.shadowBlur = glow; }
    g.beginPath(); for (var x = 0; x <= W; x += 3) { var v = y(x, a, f, ph, t); if (x === 0) g.moveTo(x, v); else g.lineTo(x, v); } g.stroke(); g.restore();
  }
  function suma(t) {
    g.save(); g.strokeStyle = '#ffffff'; g.lineWidth = 4; g.shadowColor = '#ffffff'; g.shadowBlur = 16; g.beginPath();
    for (var x = 0; x <= W; x += 3) { var v = CY - ((CY - y(x, 0.6, F, 0, t)) + (CY - y(x, 0.6, F, FASE * Math.PI / 180, t))) * 0.8 / 1; if (x === 0) g.moveTo(x, v); else g.lineTo(x, v); } g.stroke(); g.restore();
  }
  function txt(s, x, yy, col, al, tam) { g.font = '600 ' + (tam || 17) + 'px "JetBrains Mono",monospace'; g.fillStyle = col; g.textAlign = al || 'left'; g.fillText(s, x, yy); }
  function dibujar(ms) {
    var t = ms / 1000;
    var bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#07131f'); bg.addColorStop(1, '#030911'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.strokeStyle = 'rgba(127,240,228,.09)'; g.lineWidth = 1; for (var x = 0; x <= W; x += 60) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (var yy = 0; yy <= H; yy += 46) { g.beginPath(); g.moveTo(0, yy); g.lineTo(W, yy); g.stroke(); }
    g.strokeStyle = 'rgba(127,240,228,.28)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(0, CY); g.lineTo(W, CY); g.stroke();
    if (paso < 2) {
      traza(A, F, 0, t, '#7ff0e4', 4, 22);
      // marca de amplitud
      g.strokeStyle = 'rgba(255,224,138,.8)'; g.setLineDash([6, 6]); g.lineWidth = 2; g.beginPath(); g.moveTo(40, CY); g.lineTo(40, CY - A * AMP); g.stroke(); g.setLineDash([]);
      txt('amplitud', 52, CY - A * AMP / 2, '#ffe08a');
      if (paso === 1) { g.strokeStyle = 'rgba(201,168,255,.9)'; g.lineWidth = 2; var lw = W / F; g.beginPath(); g.moveTo(W * 0.25, CY + AMP + 18); g.lineTo(W * 0.25 + lw, CY + AMP + 18); g.stroke(); txt('1 ciclo', W * 0.25 + lw / 2, CY + AMP + 40, '#c9a8ff', 'center'); }
    } else {
      traza(0.6, F, 0, t, 'rgba(127,240,228,.75)', 3, 12); traza(0.6, F, FASE * Math.PI / 180, t, 'rgba(201,168,255,.75)', 3, 12); suma(t);
      var amp = Math.abs(2 * Math.cos(FASE * Math.PI / 360)), est = amp > 1.6 ? 'REFUERZO (constructiva)' : amp < 0.2 ? 'SE ANULAN (destructiva)' : 'SUMA PARCIAL';
      txt(est, W / 2, 292, amp < 0.2 ? '#8be8ae' : '#ffe08a', 'center', 20);
      txt('— onda 1', 24, 34, '#7ff0e4'); txt('— onda 2', 24, 58, '#c9a8ff'); txt('— suma', 24, 82, '#ffffff');
    }
    if (paso < 2) { txt('AMPLITUD ' + Math.round(A * 100) + '%', W - 24, 34, '#7ff0e4', 'right'); txt('FRECUENCIA ' + F.toFixed(1) + ' ciclos · ' + Math.round(hz()) + ' Hz', W - 24, 60, '#c9a8ff', 'right'); txt(sonando ? (A > 0.7 ? '🔊 fuerte' : A < 0.25 ? '🔈 suave' : '🔉 medio') + ' · ' + (F > 6.5 ? 'agudo' : F < 3 ? 'grave' : 'medio') : 'sonido apagado', W - 24, 86, '#cfe6ff', 'right'); }
    revisar();
    requestAnimationFrame(dibujar);
  }
  function ctl() {
    var c = $('ctl'); c.textContent = '';
    function rango(etq, min, max, step, val, fn) { var l = document.createElement('label'); l.className = 'rango'; l.innerHTML = etq + ' <input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" aria-label="' + etq + '">'; l.querySelector('input').oninput = function (e) { fn(Number(e.target.value)); }; c.appendChild(l); }
    if (paso === 0) rango('📏 Amplitud', 0.05, 1, 0.01, A, function (v) { A = v; sonido(sonando); });
    if (paso === 1) rango('〰️ Frecuencia', 1, 10, 0.1, F, function (v) { F = v; sonido(sonando); });
    if (paso === 2) rango('↔️ Desfase de la onda 2 (°)', 0, 360, 1, FASE, function (v) { FASE = v; });
    if (paso < 2) { var b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.textContent = sonando ? '🔇 Silenciar' : '🔊 Escuchar'; b.onclick = function () { sonido(!sonando); ctl(); }; c.appendChild(b); }
  }
  function pintar() {
    var p = $('pasos'); p.textContent = '';
    PASOS.forEach(function (P, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === paso)); b.innerHTML = '<b>' + (hecho[i] ? '✓' : i + 1) + '</b>' + P.n; b.onclick = function () { ir(i); }; p.appendChild(b); });
    var P = PASOS[paso]; $('tit').textContent = P.t; $('txt').innerHTML = P.x; $('misTxt').textContent = hecho[paso] ? '¡Muy bien! Misión cumplida ✔' : P.m; $('dato').textContent = '💡 ' + P.d;
    $('mis').className = 'mision' + (hecho[paso] ? ' ok' : ''); $('bAnt').disabled = paso === 0; $('bSig').disabled = paso === 2; $('fin').className = 'fin' + (hecho.every(Boolean) ? ' v' : '');
  }
  function ir(n) { paso = n; if (n === 2) sonido(false); ctl(); pintar(); }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); }; $('bSig').onclick = function () { if (paso < 2) ir(paso + 1); };
  /* ---------- superficie del agua en 3D (misma amplitud, frecuencia y desfase) ---------- */
  if (window.Vista3D) {
    V3 = Vista3D({ z: 9, fov: 40, auto: 0, fijo: true }); var T = THREE, NX = 150, NZ = 36, W3 = 13.4, D3 = 3.4;
    var geo = new T.PlaneGeometry(W3, D3, NX, NZ); geo.rotateX(-Math.PI / 2);
    var mat = new T.MeshStandardMaterial({ color: 0x1f7fd0, emissive: 0x06305a, emissiveIntensity: 0.35, roughness: 0.25, metalness: 0.1, transparent: true, opacity: 0.92, flatShading: false });
    var agua = new T.Mesh(geo, mat), rej = new T.Mesh(geo, new T.MeshBasicMaterial({ color: 0x7ff0e4, wireframe: true, transparent: true, opacity: 0.12 }));
    agua.position.set(0, -2.5, 0); rej.position.copy(agua.position); V3.grupo.add(agua, rej); V3.camera.position.set(0, 1.6, 9.2); V3.camera.lookAt(0, -1.9, 0); V3.scene.add(new T.PointLight(0xaee8ff, 1.3, 40)); V3.scene.children[V3.scene.children.length - 1].position.set(2, 5, 6);
    var pos = geo.attributes.position, base = []; for (var i = 0; i < pos.count; i++) base.push([pos.getX(i), pos.getZ(i)]);
    S3 = { pos: pos, base: base, geo: geo };
    V3.anim(function (dt, tt) {
      var k = 2 * Math.PI * F * 0.32, a = A * 0.2, fase = FASE * Math.PI / 180, I = paso === 2;
      for (var j = 0; j < pos.count; j++) { var x = base[j][0], z = base[j][1], y;
        if (!I) y = a * Math.sin(k * (x / W3 * 4) - tt * 4);
        else { var r1 = Math.hypot(x + 3.4, z), r2 = Math.hypot(x + 3.4, z - 0); y = 0.12 * Math.sin(k * (x / W3 * 4) - tt * 4) + 0.12 * Math.sin(k * (x / W3 * 4) - tt * 4 + fase); }
        pos.setY(j, y + (I ? 0 : 0) ); }
      pos.needsUpdate = true; geo.computeVertexNormals();
    });
  }
  window.__ondas = { ir: ir, setA: function (v) { A = v; }, setF: function (v) { F = v; }, setFase: function (v) { FASE = v; }, estado: function () { return { hecho: hecho.slice() }; } };
  ctl(); pintar(); requestAnimationFrame(dibujar);
})();
