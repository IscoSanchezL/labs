/* Palancas (3°, solo español, sin voz): equilibrio, punto de apoyo y retos de torque con pesas. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var cv = $('cv'), g = cv.getContext('2d'), W = cv.width, H = cv.height;
  var PASOS = [
    { n: 'El balancín', t: '1. Equilibrar un balancín', x: 'Una <b>palanca</b> es una barra que gira sobre un punto de apoyo. Si pones el mismo peso a la misma distancia de cada lado, el balancín queda en <b>equilibrio</b>.', m: 'Equilibra el balancín 2 veces con pesos distintos (el peso de la derecha debe igualar al de la izquierda).', d: 'Un balancín del parque es una palanca: ¡dos niños de igual peso lo equilibran!' },
    { n: 'El punto de apoyo', t: '2. Mueve el punto de apoyo', x: 'Si acercas el <b>punto de apoyo</b> a la carga pesada, un peso pequeño puede levantarla: la palanca multiplica tu fuerza. ¡Es el truco de las carretillas y las palancas de las puertas!', m: 'Levanta una carga de 40 kg con solo 10 kg, y luego una de 60 kg con 10 kg.', d: 'Arquímedes decía: «Dadme un punto de apoyo y moveré el mundo».' },
    { n: 'Retos de equilibrio', t: '3. Peso por distancia', x: 'El equilibrio depende de <b>peso × distancia</b> al apoyo. Un peso pequeño lejos puede equilibrar uno grande cerca. Calcula: <b>peso × distancia (izquierda) = peso × distancia (derecha)</b>.', m: 'Resuelve 3 retos de equilibrio.', d: 'Por eso las tijeras cortan mejor cerca del tornillo: la carga queda cerca del apoyo.' }
  ];
  var paso = 0, hecho = [false, false, false], tiempo = 0, msj = '', ang = 0, objAng = 0;
  var izq = 3, der = 1, dI = 3, dD = 3; // paso 0/2
  var f = 5, carga = 40, esf = 10, levantadas = {}, resueltos = 0, ret = null, eq = 0, vistos0 = {};
  var ac = null;
  function tono(fr, v, d) { try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume(); var o = ac.createOscillator(), gn = ac.createGain(); o.type = 'sine'; o.frequency.value = fr; gn.gain.setValueAtTime(v, ac.currentTime); gn.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d); o.connect(gn); gn.connect(ac.destination); o.start(); o.stop(ac.currentTime + d); } catch (e) {} }
  function ex() { tono(660, 0.2, 0.2); setTimeout(function () { tono(880, 0.2, 0.3); }, 130); }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; ex(); if (window.STEMFX) STEMFX.exito(); pintar(); }
  function txt(s, x, y, col, al, tam) { g.font = '700 ' + (tam || 18) + 'px "Space Grotesk",system-ui,sans-serif'; g.fillStyle = col || '#cfe6ff'; g.textAlign = al || 'center'; g.textBaseline = 'alphabetic'; g.fillText(s, x, y); }
  function nuevoReto() { var wl = 2 + Math.floor(Math.random() * 5), dl = 1 + Math.floor(Math.random() * 5), tl = wl * dl, opts = []; for (var w = 1; w <= 8; w++) for (var d = 1; d <= 5; d++) if (w * d === tl) opts.push([w, d]); if (!opts.length) { wl = 4; dl = 3; tl = 12; opts = [[4, 3], [3, 4], [2, 6]]; } ret = { wl: wl, dl: dl }; izq = wl; dI = dl; der = 1; dD = 1; msj = ''; }
  function torques() {
    if (paso === 1) return { l: carga * (f - 0.5), r: esf * (9.5 - f) };
    return { l: izq * dI, r: der * dD };
  }
  function revisar() {
    var t = torques();
    if (paso === 0) { if (t.l === t.r && t.l > 0) { if (!vistos0[izq]) { vistos0[izq] = 1; tono(780, 0.14, 0.25); } if (Object.keys(vistos0).length >= 2) cumplir(0); } }
    if (paso === 1) { if (t.r > t.l * 1.05) { levantadas[carga] = 1; if (levantadas[40] && levantadas[60]) cumplir(1); } }
    if (paso === 2 && ret && t.l === t.r && eq !== izq * 100 + dI) { eq = izq * 100 + dI; resueltos++; msj = '✔ ¡Equilibrio! ' + izq + ' × ' + dI + ' = ' + der + ' × ' + dD + ' = ' + t.l; tono(780, 0.15, 0.3); if (resueltos >= 3) cumplir(2); else setTimeout(function () { nuevoReto(); ctl(); }, 1700); }
  }
  function dibujar(ms) {
    var dt = Math.min(0.05, (ms - (dibujar.l || ms)) / 1000); dibujar.l = ms; tiempo += dt;
    var t = torques(), dif = t.r - t.l, tot = Math.max(1, t.l + t.r); objAng = Math.max(-0.38, Math.min(0.38, -dif / tot * 1.2)); if (paso === 1 && dif > 0) objAng = -0.3; ang += (objAng - ang) * Math.min(1, dt * 5);
    var bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0f2038'); bg.addColorStop(1, '#070d1a'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.fillStyle = '#16304f'; g.fillRect(0, 400, W, 60);
    var cx = paso === 1 ? 100 + f * 76 : W / 2, cy = 360, L = paso === 1 ? 760 : 700;
    // apoyo
    g.fillStyle = '#ffb347'; g.beginPath(); g.moveTo(cx, cy - 6); g.lineTo(cx - 34, 400); g.lineTo(cx + 34, 400); g.closePath(); g.fill(); g.strokeStyle = '#2a1b3a'; g.lineWidth = 3; g.stroke();
    // viga
    g.save(); g.translate(cx, cy - 12); g.rotate(ang); var bx = paso === 1 ? -(f * 76) : -L / 2;
    g.fillStyle = '#9db8ff'; g.strokeStyle = '#0f2038'; g.lineWidth = 3; g.beginPath(); g.roundRect ? g.roundRect(bx, -10, L, 20, 8) : g.rect(bx, -10, L, 20); g.fill(); g.stroke();
    if (paso === 1) { for (var u = 0; u <= 10; u++) { g.fillStyle = 'rgba(15,32,56,.7)'; g.fillRect(bx + u * 76 - 1, 0, 2, 10); }
      // carga izquierda y esfuerzo derecha
      bloque(bx + 38, carga, '#ff7a7a', Math.sqrt(carga) * 7 + 26); bloque(bx + 9.5 * 76, esf, '#7ff0e4', Math.sqrt(esf) * 7 + 26); }
    else { for (var k = 1; k <= 5; k++) { g.fillStyle = 'rgba(15,32,56,.8)'; g.fillRect(-k * 66 - 1, 0, 2, 10); g.fillRect(k * 66 - 1, 0, 2, 10); g.fillStyle = '#0f2038'; g.font = '600 12px "JetBrains Mono",monospace'; g.textAlign = 'center'; g.fillText(String(k), -k * 66, 24); g.fillText(String(k), k * 66, 24); }
      bloque(-dI * 66, izq, '#ff7a7a', Math.sqrt(izq) * 12 + 22); bloque(dD * 66, der, '#7ff0e4', Math.sqrt(der) * 12 + 22); }
    g.restore();
    txt(paso === 1 ? 'Carga ' + carga + ' kg (izq) · Esfuerzo ' + esf + ' kg (der) · apoyo a ' + (f - 0.5).toFixed(1) + ' del extremo izq.' : 'Izquierda: ' + izq + ' kg × ' + dI + ' = ' + (izq * dI) + '   ·   Derecha: ' + der + ' kg × ' + dD + ' = ' + (der * dD), W / 2, 40, '#cfe6ff', 'center', 18);
    var eqn = Math.abs(t.l - t.r) < 0.01; txt(paso === 1 ? (dif > t.l * 0.05 ? '⬆ ¡La carga se levanta!' : '⬇ La carga sigue abajo') : (eqn ? '⚖️ ¡EQUILIBRIO!' : (dif > 0 ? '← se inclina a la derecha' : '← se inclina a la izquierda').replace('← se inclina a la derecha', 'Pesa más la derecha ➜').replace('← se inclina a la izquierda', '⬅ Pesa más la izquierda')), W / 2, 80, eqn ? '#8be8ae' : '#ffe08a', 'center', 24);
    if (paso === 2 && ret) txt('Reto ' + Math.min(3, resueltos + 1) + ' de 3 · ' + (msj || 'Elige peso y distancia a la derecha para igualar'), W / 2, 436, msj ? '#8be8ae' : '#9db8ff', 'center', 16);
    revisar(); requestAnimationFrame(dibujar);
  }
  function bloque(x, kg, col, w) { var h = Math.min(90, 24 + Math.sqrt(kg) * 6); g.fillStyle = col; g.strokeStyle = '#0f2038'; g.lineWidth = 3; g.fillRect(x - w / 2, -10 - h, w, h); g.strokeRect(x - w / 2, -10 - h, w, h); g.fillStyle = '#0f2038'; g.font = '700 14px "JetBrains Mono",monospace'; g.textAlign = 'center'; g.fillText(kg + ' kg', x, -10 - h / 2 + 5); }
  function ctl() {
    var c = $('ctl'); c.textContent = '';
    function rango(etq, min, max, step, val, fn) { var l = document.createElement('label'); l.className = 'rango'; l.innerHTML = etq + ' <input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" aria-label="' + etq + '">'; l.querySelector('input').oninput = function (e) { fn(Number(e.target.value)); }; c.appendChild(l); }
    function btn(txt, fn, cls) { var b = document.createElement('button'); b.type = 'button'; b.className = cls || 'btn sec'; b.textContent = txt; b.onclick = fn; c.appendChild(b); }
    if (paso === 0) { btn('🎲 Otro peso a la izquierda', function () { izq = 1 + Math.floor(Math.random() * 6); der = 1; ctl(); }, 'btn sec'); rango('⚖️ Peso derecho (kg)', 1, 8, 1, der, function (v) { der = v; }); }
    if (paso === 1) { rango('🔺 Punto de apoyo', 1, 9, 0.1, f, function (v) { f = v; }); btn('Carga 20 kg', function () { carga = 20; ctl(); }, 'tab'); btn('Carga 40 kg', function () { carga = 40; ctl(); }, 'tab'); btn('Carga 60 kg', function () { carga = 60; ctl(); }, 'tab'); c.querySelectorAll('.tab').forEach(function (b, i) { b.setAttribute('aria-pressed', String(carga === [20, 40, 60][i])); }); }
    if (paso === 2) { rango('⚖️ Peso derecho (kg)', 1, 8, 1, der, function (v) { der = v; }); rango('📏 Distancia derecha', 1, 5, 1, dD, function (v) { dD = v; }); btn('🔄 Otro reto', function () { nuevoReto(); ctl(); }, 'btn sec'); }
  }
  function pintar() {
    var p = $('pasos'); p.textContent = '';
    PASOS.forEach(function (Q, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === paso)); b.innerHTML = '<b>' + (hecho[i] ? '✓' : i + 1) + '</b>' + Q.n; b.onclick = function () { ir(i); }; p.appendChild(b); });
    var Q = PASOS[paso]; $('tit').textContent = Q.t; $('txt').innerHTML = Q.x; $('misTxt').textContent = hecho[paso] ? '¡Muy bien! Misión cumplida ✔' : Q.m; $('dato').textContent = '💡 ' + Q.d;
    $('mis').className = 'mision' + (hecho[paso] ? ' ok' : ''); $('bAnt').disabled = paso === 0; $('bSig').disabled = paso === 2; $('fin').className = 'fin' + (hecho.every(Boolean) ? ' v' : '');
  }
  function ir(n) { paso = n; msj = ''; ang = 0; if (n === 0) { izq = 3; der = 1; dI = 3; dD = 3; vistos0 = {}; } if (n === 1) { f = 5; carga = 40; } if (n === 2) { resueltos = 0; eq = 0; nuevoReto(); } ctl(); pintar(); }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); }; $('bSig').onclick = function () { if (paso < 2) ir(paso + 1); };
  window.__pal = { ir: ir, setDer: function (v) { der = v; }, setDD: function (v) { dD = v; }, setIzq: function (v) { izq = v; }, setF: function (v) { f = v; }, setCarga: function (v) { carga = v; }, reto: function () { return ret; }, estado: function () { return { hecho: hecho.slice(), resueltos: resueltos }; } };
  ctl(); pintar(); requestAnimationFrame(dibujar);
})();
