/* El clima de hoy (1°, solo español, con voz de Beto): tipos de clima, qué me pongo y adivina el clima. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var PASOS = [
    { n: 'El clima', org: '⛅', t: 'El clima', x: 'El <b>clima</b> nos dice cómo está el cielo hoy. Puede estar <b>soleado</b>, <b>nublado</b>, con <b>lluvia</b> o con <b>viento</b>. Toca cada botón y mira cómo cambia el cielo.', m: 'Prueba los cuatro tipos de clima.', d: 'Los meteorólogos son las personas que estudian el clima.' },
    { n: 'Qué me pongo', org: '🧥', t: 'Qué me pongo', x: 'Según el clima, nos vestimos distinto. Con <b>sol</b> usamos gorra. Con <b>lluvia</b> usamos paraguas. Con <b>viento</b> usamos chaqueta.', m: 'Escoge lo que necesitas en cada clima. Acierta cuatro veces.', juego: 1, d: 'Los pájaros también saben cuándo va a llover: vuelan más bajito.' },
    { n: 'Adivina el clima', org: '🔎', t: 'Adivina el clima', x: 'Te voy a dar una <b>pista</b> y tú adivinas qué clima es. Fíjate bien en el cielo.', m: 'Adivina el clima cuatro veces.', juego: 2, d: 'Cuando hay arcoíris es porque brilló el sol mientras llovía.' }
  ];
  var CLI = [['☀️', 'Soleado'], ['☁️', 'Nublado'], ['🌧️', 'Lluvia'], ['💨', 'Viento']];
  var Q2 = [['☀️', 'Hace mucho sol', '🧢', 'Gorra'], ['🌧️', 'Está lloviendo', '☂️', 'Paraguas'], ['💨', 'Hace mucho viento', '🧥', 'Chaqueta'], ['☀️', 'Hace calor', '🩳', 'Pantaloneta'], ['🌧️', 'Hay charcos', '🥾', 'Botas'], ['💨', 'Hay viento fuerte', '🪁', 'Cometa']];
  var Q3 = [['Veo el sol brillante y no hay nubes', 0], ['El cielo está todo gris y tapado', 1], ['Caen gotas de agua del cielo', 2], ['Las hojas vuelan y los árboles se mueven', 3], ['Hace calor y todo está muy claro', 0], ['Escucho truenos y cae agua', 2]];
  var paso = 0, hecho = PASOS.map(function () { return false; }), clima = 0, vistos = {}, ronda = 0, aciertos = 0, orden = [], raf = 0, cv = null, g = null, tiempo = 0, gotas = [], hojas = [];
  var ac = null;
  function tono(tipo, f, v, d) {
    try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume();
      var o = ac.createOscillator(), G = ac.createGain(), n = ac.currentTime; o.type = tipo; o.frequency.value = f; G.gain.setValueAtTime(0.0001, n); G.gain.exponentialRampToValueAtTime(v, n + 0.01); G.gain.exponentialRampToValueAtTime(0.0001, n + d); o.connect(G); G.connect(ac.destination); o.start(n); o.stop(n + d + 0.05); } catch (e) {}
  }
  function bien() { tono('sine', 660, 0.2, 0.2); setTimeout(function () { tono('sine', 880, 0.2, 0.3); }, 130); }
  function mal() { tono('sine', 200, 0.18, 0.25); }
  function mezclar(a) { return a.slice().sort(function () { return Math.random() - 0.5; }); }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; bien(); pintar(); Narrar.decir('ok', '¡Muy bien! Misión cumplida.'); }
  function sala() {
    var P = PASOS[paso], s = $('sala'); cancelAnimationFrame(raf); s.textContent = '';
    function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; s.appendChild(e); return e; }
    if (P.juego) {
      var ops = null, msj, opciones;
      if (P.juego === 1) { var q = Q2[orden[ronda % Q2.length]], dis = mezclar(Q2.filter(function (r) { return r[2] !== q[2]; })).slice(0, 2); opciones = mezclar([[q[2], q[3], 1]].concat(dis.map(function (r) { return [r[2], r[3], 0]; }))); el('div', 'organo', q[0]); el('div', 'pregunta', q[1] + '. ¿Qué me pongo o uso?'); }
      else { var q3 = Q3[orden[ronda % Q3.length]]; opciones = CLI.slice(0, 4).map(function (c, i) { return [c[0], c[1], i === q3[1] ? 1 : 0]; }); el('div', 'organo', '🔎'); el('div', 'pregunta', q3[0]); }
      ops = el('div', 'ops'); msj = el('div', 'msj'); msj.setAttribute('aria-live', 'polite');
      opciones.forEach(function (o) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'op'; b.innerHTML = o[0] + '<small>' + o[1] + '</small>';
        b.onclick = function () { if (b.classList.contains('bien')) return; if (o[2]) { b.classList.add('bien'); bien(); msj.textContent = '¡Muy bien!'; aciertos++; if (aciertos >= 4) cumplir(paso); setTimeout(function () { ronda++; sala(); }, 900); } else { b.classList.add('mal'); mal(); msj.textContent = 'Piénsalo otra vez'; setTimeout(function () { b.classList.remove('mal'); }, 400); } };
        ops.appendChild(b);
      });
      el('div', 'msj', 'Aciertos: ' + aciertos + ' de 4'); return;
    }
    cv = document.createElement('canvas'); cv.width = 640; cv.height = 340; s.appendChild(cv); g = cv.getContext('2d');
    var ctl = el('div', 'ops');
    CLI.forEach(function (c, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'op'; b.style.minWidth = '96px'; b.innerHTML = c[0] + '<small>' + c[1] + '</small>'; b.onclick = function () { clima = i; vistos[i] = 1; tono('sine', 400 + i * 100, 0.12, 0.2); if (Object.keys(vistos).length >= 4) cumplir(0); }; ctl.appendChild(b); });
    vistos[clima] = 1; loop();
  }
  function loop(ms) { raf = requestAnimationFrame(loop); tiempo = (ms || 0) / 1000; dib(); }
  function dib() {
    var W = 640, H = 340, gris = clima === 1 || clima === 2;
    var gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, gris ? '#6a7a92' : '#5bb7ff'); gr.addColorStop(1, gris ? '#a9b6c8' : '#cdeeff'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    if (clima === 0) { var h = g.createRadialGradient(520, 70, 5, 520, 70, 120); h.addColorStop(0, 'rgba(255,230,120,.9)'); h.addColorStop(1, 'rgba(255,230,120,0)'); g.fillStyle = h; g.fillRect(380, 0, 260, 200); g.fillStyle = '#ffd95e'; g.beginPath(); g.arc(520, 70, 40, 0, 7); g.fill(); g.strokeStyle = 'rgba(255,225,120,.8)'; g.lineWidth = 5; g.lineCap = 'round'; g.save(); g.translate(520, 70); g.rotate(tiempo * 0.3); for (var i = 0; i < 12; i++) { g.rotate(Math.PI / 6); g.beginPath(); g.moveTo(52, 0); g.lineTo(70, 0); g.stroke(); } g.restore(); }
    if (clima !== 0) { var op = clima === 1 ? 0.95 : 0.9; g.fillStyle = clima === 2 ? 'rgba(90,100,120,' + op + ')' : 'rgba(255,255,255,' + op + ')'; for (var k = 0; k < 4; k++) { var cx = ((k * 190 + tiempo * (clima === 3 ? 90 : 14)) % 760) - 60, cy = 60 + (k % 2) * 36; g.beginPath(); g.arc(cx, cy, 36, 0, 7); g.arc(cx + 40, cy + 8, 28, 0, 7); g.arc(cx - 36, cy + 10, 24, 0, 7); g.fill(); } }
    if (clima === 2) { if (gotas.length < 90) for (var d = 0; d < 3; d++) gotas.push({ x: Math.random() * W, y: -10, v: 380 + Math.random() * 120 }); g.strokeStyle = '#bfe6ff'; g.lineWidth = 2.5; gotas = gotas.filter(function (p) { p.y += p.v / 60; g.beginPath(); g.moveTo(p.x, p.y - 12); g.lineTo(p.x - 2, p.y); g.stroke(); return p.y < H - 40; }); } else gotas = [];
    g.fillStyle = '#6fcf7a'; g.fillRect(0, H - 60, W, 60); g.fillStyle = '#58b765'; g.beginPath(); g.moveTo(0, H - 60); for (var x = 0; x <= W; x += 30) g.lineTo(x, H - 66 - 6 * Math.sin(x * 0.05)); g.lineTo(W, H - 60); g.fill();
    // árbol y casa
    var sway = clima === 3 ? Math.sin(tiempo * 5) * 0.12 : 0; g.fillStyle = '#000'; g.font = '56px system-ui'; g.textAlign = 'center'; g.fillText('🏠', 110, H - 62);
    g.save(); g.translate(500, H - 50); g.rotate(sway); g.font = '84px system-ui'; g.fillText('🌳', 0, 0); g.restore();
    if (clima === 3) { g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 3; g.lineCap = 'round'; for (var w = 0; w < 7; w++) { var wx = ((w * 130 + tiempo * 420) % 760) - 60, wy = 110 + w * 22; g.beginPath(); g.moveTo(wx, wy); g.bezierCurveTo(wx + 30, wy - 12, wx + 60, wy + 12, wx + 90, wy); g.stroke(); } hojas.length < 10 && hojas.push({ x: -20, y: 120 + Math.random() * 150, v: 220 + Math.random() * 120 }); hojas = hojas.filter(function (l) { l.x += l.v / 60; l.y += Math.sin(tiempo * 4 + l.x * 0.03) * 1.2; g.font = '26px system-ui'; g.fillText('🍃', l.x, l.y); return l.x < W + 20; }); } else hojas = [];
    g.fillStyle = '#16304f'; g.font = '700 28px "Space Grotesk",system-ui,sans-serif'; g.fillText(CLI[clima][0] + ' ' + CLI[clima][1], W / 2, 36);
  }
  function pintar() {
    var p = $('pasos'); p.textContent = '';
    PASOS.forEach(function (P, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === paso)); b.innerHTML = '<b>' + (hecho[i] ? '✓' : i + 1) + '</b>' + P.n; b.onclick = function () { ir(i); }; p.appendChild(b); });
    var P = PASOS[paso]; $('tit').textContent = (paso + 1) + '. ' + P.t; $('txt').innerHTML = P.x; $('misTxt').textContent = hecho[paso] ? '¡Muy bien! Misión cumplida ✔' : P.m; $('dato').textContent = '💡 ' + P.d;
    $('mis').className = 'mision' + (hecho[paso] ? ' ok' : ''); $('bAnt').disabled = paso === 0; $('bSig').disabled = paso === PASOS.length - 1; $('fin').className = 'fin' + (hecho.every(Boolean) ? ' v' : '');
  }
  function narrar(forzar) { var P = PASOS[paso]; Narrar.decir('p' + (paso + 1), P.t + '. ' + P.x.replace(/<[^>]+>/g, ''), forzar, ['m' + (paso + 1), 'Tu misión. ' + P.m]); }
  function ir(n) { paso = n; Narrar.parar(); if (PASOS[n].juego) { orden = mezclar(PASOS[n].juego === 1 ? [0, 1, 2, 3, 4, 5] : [0, 1, 2, 3, 4, 5]); ronda = 0; aciertos = 0; } sala(); pintar(); narrar(false); }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); };
  $('bSig').onclick = function () { if (paso < PASOS.length - 1) ir(paso + 1); };
  $('bVoz').onclick = function () { narrar(true); };
  $('bAuto').setAttribute('aria-pressed', String(Narrar.activa())); $('bAuto').onclick = function () { $('bAuto').setAttribute('aria-pressed', String(Narrar.alternar())); };
  window.__clima = { ir: ir, set: function (i) { clima = i; vistos[i] = 1; if (Object.keys(vistos).length >= 4) cumplir(0); }, correcta: function () { var b = document.querySelectorAll('.op'); return Array.prototype.map.call(b, function (x) { return x.textContent; }); }, estado: function () { return { hecho: hecho.slice(), paso: paso }; } };
  sala(); pintar();
})();
