/* Ley de Ohm (6°, solo español, sin voz): V = I·R con medidores, analogía del agua y reto de calcular la resistencia de un LED. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var cv = $('cv'), g = cv.getContext('2d'), W = cv.width, H = cv.height;
  var PASOS = [
    { n: 'Voltaje', t: '1. Más voltaje, más corriente', x: 'El <b>voltaje</b> (V, en voltios) es el «empuje» de la pila; la <b>corriente</b> (I, en amperios) es la cantidad de carga que circula. Con la misma resistencia, si duplicas el voltaje se duplica la corriente.', m: 'Con la resistencia fija, prueba 3 voltajes distintos (diferencia de al menos 3 V).', d: 'La corriente se mide en amperios (A) en honor a André-Marie Ampère.' },
    { n: 'Resistencia', t: '2. Más resistencia, menos corriente', x: 'La <b>resistencia</b> (R, en ohmios Ω) frena la corriente. Con el mismo voltaje, si duplicas la resistencia, la corriente se reduce a la mitad. La ley de Ohm lo resume: <b>V = I · R</b>.', m: 'Con el voltaje fijo, prueba 3 resistencias distintas (diferencia de al menos 200 Ω).', d: 'Una resistencia de 0 Ω sería un cortocircuito: la corriente se dispararía.' },
    { n: 'Reto del LED', t: '3. Protege el LED', x: 'Un LED se quema si recibe demasiada corriente. Con la ley de Ohm puedes calcular la resistencia que necesita: <b>R = V / I</b>. Elige la resistencia para que circule justo la corriente que pide el LED.', m: 'Acierta 3 retos: deja la corriente dentro de ±10 % de la que pide el LED.', d: 'Por eso los LED siempre llevan una resistencia en serie.' }
  ];
  var paso = 0, hecho = [false, false, false], V = 6, R = 300, tiempo = 0, vistosV = [], vistosR = [], reto = null, aciertos = 0, msj = '', quemado = 0;
  var RETOS = [[9, 20], [5, 10], [12, 30], [6, 15], [9, 30], [12, 20]];
  var ac = null;
  function tono(f, v, d) { try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume(); var o = ac.createOscillator(), gn = ac.createGain(); o.type = 'sine'; o.frequency.value = f; gn.gain.setValueAtTime(v, ac.currentTime); gn.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d); o.connect(gn); gn.connect(ac.destination); o.start(); o.stop(ac.currentTime + d); } catch (e) {} }
  function ex() { tono(660, 0.2, 0.2); setTimeout(function () { tono(880, 0.2, 0.3); }, 130); }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; ex(); if (window.STEMFX) STEMFX.exito(); pintar(); }
  function corriente() { return paso === 2 && reto ? reto.v / R : V / R; }
  function voltaje() { return paso === 2 && reto ? reto.v : V; }
  function nuevoReto() { var q = RETOS[Math.floor(Math.random() * RETOS.length)]; reto = { v: q[0], i: q[1] / 1000 }; msj = ''; quemado = 0; }
  function revisar() {
    if (paso === 0) { if (vistosV.every(function (x) { return Math.abs(x - V) >= 3; })) vistosV.push(V); if (vistosV.length >= 3) cumplir(0); }
    if (paso === 1) { if (vistosR.every(function (x) { return Math.abs(x - R) >= 200; })) vistosR.push(R); if (vistosR.length >= 3) cumplir(1); }
  }
  function probar() {
    if (paso !== 2 || !reto) return; var i = corriente(), ok = Math.abs(i - reto.i) / reto.i <= 0.1;
    if (ok) { aciertos++; msj = '¡Perfecto! R = ' + R + ' Ω deja pasar ' + (i * 1000).toFixed(1) + ' mA'; tono(780, 0.15, 0.25); if (aciertos >= 3) cumplir(2); setTimeout(function () { nuevoReto(); }, 1600); }
    else if (i > reto.i) { msj = 'Demasiada corriente (' + (i * 1000).toFixed(1) + ' mA): ¡el LED se quema!'; quemado = 1.5; tono(150, 0.2, 0.4); }
    else msj = 'Muy poca corriente (' + (i * 1000).toFixed(1) + ' mA): el LED casi no brilla.';
  }
  var PTS = [[110, 110], [850, 110], [850, 370], [110, 370]];
  function punto(s) { var tot = 2 * (740 + 260), q = ((s % tot) + tot) % tot; var L = [740, 260, 740, 260], P = [[110, 110], [850, 110], [850, 370], [110, 370], [110, 110]]; for (var i = 0; i < 4; i++) { if (q <= L[i]) { var f = q / L[i]; return [P[i][0] + (P[i + 1][0] - P[i][0]) * f, P[i][1] + (P[i + 1][1] - P[i][1]) * f]; } q -= L[i]; } return P[0]; }
  var desp = 0;
  function txt(s, x, y, col, al, tam) { g.font = '600 ' + (tam || 16) + 'px "JetBrains Mono",monospace'; g.fillStyle = col || '#cfe6ff'; g.textAlign = al || 'left'; g.fillText(s, x, y); }
  var V3 = null, O3 = { R: 470, U: 6 };
  function dibujar(ms) {
    var dt = Math.min(0.05, (ms - (dibujar.l || ms)) / 1000); dibujar.l = ms; tiempo += dt; quemado = Math.max(0, quemado - dt);
    var I = corriente(), U = voltaje(), vel = Math.min(520, I * 3000 + 10); desp += dt * vel; O3.R = Math.round(R); O3.U = U;
    var bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0a1a2e'); bg.addColorStop(1, '#050b16'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.strokeStyle = 'rgba(127,240,228,.06)'; for (var x = 0; x < W; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (var y = 0; y < H; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    g.strokeStyle = '#1b2c47'; g.lineWidth = 12; g.lineJoin = 'round'; g.strokeRect(110, 110, 740, 260); g.strokeStyle = 'rgba(127,240,228,.65)'; g.lineWidth = 5; g.strokeRect(110, 110, 740, 260);
    var n = 52, tot = 2 * (740 + 260); g.fillStyle = '#ffe08a'; for (var i = 0; i < n; i++) { var p = punto(i * tot / n + desp); g.shadowColor = '#ffd95e'; g.shadowBlur = 8; g.beginPath(); g.arc(p[0], p[1], 4.2, 0, 7); g.fill(); } g.shadowBlur = 0;
    // pila (izquierda)
    if (!V3) { g.fillStyle = '#0b1830'; g.fillRect(80, 190, 60, 100); var gr = g.createLinearGradient(86, 0, 134, 0); gr.addColorStop(0, '#4fd1c5'); gr.addColorStop(1, '#9db8ff'); g.fillStyle = gr; g.fillRect(88, 198, 44, 84); g.fillStyle = '#06121f'; g.font = '800 22px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'center'; g.fillText('+', 110, 226); g.fillText('−', 110, 268); }
    txt(U.toFixed(0) + ' V', 110, 316, '#9db8ff', 'center', 20);
    // resistencia (arriba)
    if (!V3) { var rw = 60 + R / 1000 * 120; g.fillStyle = '#0b1830'; g.fillRect(480 - rw / 2 - 6, 90, rw + 12, 40); g.fillStyle = '#d9a066'; g.beginPath(); g.roundRect ? g.roundRect(480 - rw / 2, 96, rw, 28, 12) : g.rect(480 - rw / 2, 96, rw, 28); g.fill(); var cols = ['#d33', '#222', '#f90', '#fd0']; for (var b = 0; b < 4; b++) { g.fillStyle = cols[b]; g.fillRect(480 - rw / 2 + 14 + b * (rw - 40) / 3, 96, 6, 28); } }
    txt(Math.round(R) + ' Ω', 480, 62, '#ffb3c6', 'center', 20);
    // LED (derecha en reto)
    if (paso === 2) { var lx = 850, ly = 240, ok = reto ? I / reto.i : 0, br = quemado > 0 ? 0 : Math.min(1, ok); g.fillStyle = '#0b1830'; g.fillRect(lx - 28, ly - 36, 56, 72); if (br > 0) { var hl = g.createRadialGradient(lx, ly, 4, lx, ly, 70); hl.addColorStop(0, 'rgba(120,255,150,' + br * 0.7 + ')'); hl.addColorStop(1, 'rgba(120,255,150,0)'); g.fillStyle = hl; g.fillRect(lx - 90, ly - 90, 180, 180); } g.fillStyle = quemado > 0 ? '#2a2a2a' : 'rgb(' + Math.round(40 + 90 * br) + ',' + Math.round(70 + 185 * br) + ',' + Math.round(70 + 80 * br) + ')'; g.strokeStyle = '#cfe6ff'; g.lineWidth = 3; g.beginPath(); g.arc(lx, ly - 8, 22, Math.PI, 0); g.lineTo(lx + 22, ly + 14); g.lineTo(lx - 22, ly + 14); g.closePath(); g.fill(); g.stroke(); txt('LED', lx, ly + 54, '#8be8ae', 'center', 16); if (quemado > 0) { txt('💥', lx, ly - 36, '#fff', 'center', 30); } }
    // medidores
    g.fillStyle = 'rgba(5,11,20,.82)'; g.fillRect(300, 170, 360, 150); txt('VOLTÍMETRO   ' + U.toFixed(1) + ' V', 320, 200, '#9db8ff', 'left', 18); txt('RESISTENCIA   ' + Math.round(R) + ' Ω', 320, 230, '#ffb3c6', 'left', 18); txt('AMPERÍMETRO  ' + (I * 1000).toFixed(1) + ' mA', 320, 260, '#ffe08a', 'left', 18); txt('I = V / R = ' + U.toFixed(1) + ' / ' + Math.round(R) + ' = ' + I.toFixed(3) + ' A', 320, 296, '#8be8ae', 'left', 15);
    // analogía del agua
    var tx = 880, tw = 60; g.fillStyle = 'rgba(70,140,220,.35)'; g.fillRect(tx, 380 - U * 7 - 10, tw, U * 7 + 10); g.strokeStyle = '#9db8ff'; g.lineWidth = 2; g.strokeRect(tx, 290, tw, 100); txt('💧 analogía', tx + 30, 280, '#9db8ff', 'center', 12);
    if (paso === 2 && reto) { g.fillStyle = 'rgba(5,11,20,.85)'; g.fillRect(250, 2, 460, 50); txt('El LED pide ' + (reto.i * 1000).toFixed(0) + ' mA con una pila de ' + reto.v + ' V · Aciertos ' + aciertos + '/3', 480, 44, '#ffe08a', 'center', 15); txt('R = V / I = ' + reto.v + ' / ' + reto.i.toFixed(3) + ' = ¿?', 480, 43, '#cfe6ff', 'center', 14); }
    if (msj) { txt(msj, W / 2, 430, msj.indexOf('Perfecto') > -1 ? '#8be8ae' : '#ff9f9f', 'center', 18); }
    requestAnimationFrame(dibujar);
  }
  function ctl() {
    var c = $('ctl'); c.textContent = '';
    function rango(etq, min, max, step, val, fn) { var l = document.createElement('label'); l.className = 'rango'; l.innerHTML = etq + ' <input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" aria-label="' + etq + '">'; l.querySelector('input').oninput = function (e) { fn(Number(e.target.value)); }; c.appendChild(l); }
    if (paso === 0) rango('🔋 Voltaje (V)', 1, 12, 1, V, function (v) { V = v; revisar(); });
    if (paso === 1) rango('🟫 Resistencia (Ω)', 50, 1000, 10, R, function (v) { R = v; revisar(); });
    if (paso === 2) { rango('🟫 Resistencia (Ω)', 50, 1000, 10, R, function (v) { R = v; }); var b = document.createElement('button'); b.type = 'button'; b.className = 'btn grande'; b.textContent = '✔ Probar'; b.onclick = probar; c.appendChild(b); }
  }
  function pintar() {
    var p = $('pasos'); p.textContent = '';
    PASOS.forEach(function (Q, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === paso)); b.innerHTML = '<b>' + (hecho[i] ? '✓' : i + 1) + '</b>' + Q.n; b.onclick = function () { ir(i); }; p.appendChild(b); });
    var Q = PASOS[paso]; $('tit').textContent = Q.t; $('txt').innerHTML = Q.x; $('misTxt').textContent = hecho[paso] ? '¡Muy bien! Misión cumplida ✔' : Q.m; $('dato').textContent = '💡 ' + Q.d;
    $('mis').className = 'mision' + (hecho[paso] ? ' ok' : ''); $('bAnt').disabled = paso === 0; $('bSig').disabled = paso === 2; $('fin').className = 'fin' + (hecho.every(Boolean) ? ' v' : '');
  }
  function ir(n) { paso = n; msj = ''; if (n === 0) { R = 300; vistosV = [V]; } if (n === 1) { V = 6; vistosR = [R]; } if (n === 2) nuevoReto(); ctl(); pintar(); }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); }; $('bSig').onclick = function () { if (paso < 2) ir(paso + 1); };
  window.__ohm = { ir: ir, setV: function (v) { V = v; revisar(); }, setR: function (v) { R = v; revisar(); }, probar: probar, reto: function () { return reto; }, resolver: function () { R = Math.round(reto.v / reto.i / 10) * 10; }, estado: function () { return { hecho: hecho.slice(), aciertos: aciertos }; } };
  /* ---------- pila y resistencia en 3D (colores del código de la resistencia) ---------- */
  if (window.Vista3D) {
    V3 = Vista3D({ z: 9, fov: 40, auto: 0, fijo: true }); var T = THREE, K = 0.01424, WX = function (x) { return (x - 480) * K; }, WY = function (y) { return (230 - y) * K; };
    var COL = [0x111111, 0x7a4a1a, 0xe03a3a, 0xff8a2a, 0xffe03a, 0x2fbf4a, 0x2a6aff, 0x9a4aff, 0x888888, 0xffffff];
    var pila = new T.Group(), cuerpo = new T.Mesh(new T.CylinderGeometry(0.42, 0.42, 1.35, 28), V3.mat(0x4fd1c5, 0x0a4a44)), tapa = new T.Mesh(new T.CylinderGeometry(0.2, 0.2, 0.14, 20), V3.mat(0xdddddd, 0x222222)), franja = new T.Mesh(new T.CylinderGeometry(0.43, 0.43, 0.4, 28), V3.mat(0x9db8ff, 0x22336a)); tapa.position.y = 0.74; franja.position.y = 0.1; pila.add(cuerpo, tapa, franja); pila.position.set(WX(110), WY(240), 0); V3.grupo.add(pila);
    var res = new T.Group(), cer = new T.Mesh(new T.CylinderGeometry(0.2, 0.2, 1, 24), V3.mat(0xd9a066, 0x4a2a0a)); cer.rotation.z = Math.PI / 2; res.add(cer); var ext = new T.Mesh(new T.SphereGeometry(0.2, 16, 12), V3.mat(0xd9a066, 0x4a2a0a)), ext2 = ext.clone(); res.add(ext, ext2);
    var bandas = []; for (var b = 0; b < 4; b++) { var bd = new T.Mesh(new T.CylinderGeometry(0.205, 0.205, 0.07, 24), V3.mat(0x111111, 0x000000)); bd.rotation.z = Math.PI / 2; res.add(bd); bandas.push(bd); } res.position.set(WX(480), WY(110), 0); V3.grupo.add(res);
    var ultR = -1;
    V3.anim(function (dt, t) {
      var Rv = O3.R; if (Rv !== ultR) { ultR = Rv; var e = Math.max(0, Math.floor(Math.log(Math.max(1, Rv)) / Math.LN10) - 1), m = Math.round(Rv / Math.pow(10, e)), d1 = Math.floor(m / 10) % 10, d2 = m % 10; var cs = [d1, d2, Math.min(9, e), 10]; bandas.forEach(function (bd, i) { var c = i === 3 ? 0xd4af37 : COL[cs[i]]; bd.material.color.setHex(c); bd.material.emissive.setHex(c); bd.material.emissiveIntensity = 0.15; }); }
      var w = (60 + Rv / 1000 * 120) * K; cer.scale.set(1, w, 1); ext.position.x = -w / 2; ext2.position.x = w / 2; bandas.forEach(function (bd, i) { bd.position.x = -w * 0.32 + i * w * 0.22; });
      pila.rotation.y = 0.5 * Math.sin(t * 0.7); res.rotation.x = 0.25 * Math.sin(t * 0.9);
    });
  }
  vistosV = [V]; ctl(); pintar(); requestAnimationFrame(dibujar);
})();
