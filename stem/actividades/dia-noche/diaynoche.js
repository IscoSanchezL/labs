/* Día y noche (1°, solo español, con voz de Beto): la Tierra gira, qué hacemos de día y de noche, el Sol y la Luna. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var PASOS = [
    { n: 'La Tierra gira', org: '🌍', t: 'La Tierra gira', x: 'La <b>Tierra</b> da vueltas como una pelota. Cuando tu lado mira al <b>Sol</b>, es de <b>día</b>. Cuando tu lado queda lejos del Sol, es de <b>noche</b>.', m: 'Toca el botón para girar la Tierra y mira cuándo es de día y cuándo es de noche.', d: 'La Tierra tarda 24 horas en dar una vuelta completa: ¡un día entero!' },
    { n: 'Día o noche', org: '🧒', t: 'Qué hacemos de día y de noche', x: 'De <b>día</b> hay luz del Sol: jugamos, comemos y vamos al colegio. De <b>noche</b> está oscuro y <b>descansamos</b>.', m: 'Di si cada actividad es de día o de noche. Acierta cuatro veces.', juego: 1, d: 'Algunos animales, como los búhos y los murciélagos, están despiertos de noche.' },
    { n: 'Sol y Luna', org: '🌙', t: 'El Sol y la Luna', x: 'De día vemos el <b>Sol</b> en el cielo. De noche vemos la <b>Luna</b> y las <b>estrellas</b>. Mueve la hora para verlo.', m: 'Pon el Sol bien arriba en el cielo. Después busca la Luna en la noche.', d: 'La Luna no tiene luz propia: brilla porque refleja la luz del Sol.' }
  ];
  var RONDAS = [['🍳', 'Desayunar', 0], ['😴', 'Dormir en la cama', 1], ['⚽', 'Jugar en el parque', 0], ['🌟', 'Mirar las estrellas', 1], ['🏫', 'Ir al colegio', 0], ['🦉', 'Ver un búho despierto', 1]];
  var paso = 0, hecho = PASOS.map(function () { return false; }), ronda = 0, aciertos = 0, orden = [], ang = 0, objetivo = 0, vistos = {}, hora = 9;
  var ac = null, cv = null, g = null, raf = 0, tiempo = 0;
  function tono(tipo, f, v, d) {
    try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume();
      var o = ac.createOscillator(), G = ac.createGain(), n = ac.currentTime; o.type = tipo; o.frequency.value = f; G.gain.setValueAtTime(0.0001, n); G.gain.exponentialRampToValueAtTime(v, n + 0.01); G.gain.exponentialRampToValueAtTime(0.0001, n + d); o.connect(G); G.connect(ac.destination); o.start(n); o.stop(n + d + 0.05); } catch (e) {}
  }
  function bien() { tono('sine', 660, 0.2, 0.2); setTimeout(function () { tono('sine', 880, 0.2, 0.3); }, 130); }
  function mal() { tono('sine', 200, 0.18, 0.25); }
  function mezclar(a) { return a.slice().sort(function () { return Math.random() - 0.5; }); }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; bien(); pintar(); Narrar.decir('ok', '¡Muy bien! Misión cumplida.'); }
  function esDia() { return Math.cos(ang) > 0.05; }

  function sala() {
    var P = PASOS[paso], s = $('sala'); cancelAnimationFrame(raf); s.textContent = '';
    function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; s.appendChild(e); return e; }
    if (P.juego) {
      var r = RONDAS[orden[ronda % RONDAS.length]];
      el('div', 'organo', r[0]); el('div', 'pregunta', '¿' + r[1] + ' es de día o de noche?');
      var ops = el('div', 'ops'), msj = el('div', 'msj'); msj.setAttribute('aria-live', 'polite');
      [['☀️', 'Día', 0], ['🌙', 'Noche', 1]].forEach(function (o) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'op'; b.innerHTML = o[0] + '<small>' + o[1] + '</small>';
        b.onclick = function () {
          if (b.classList.contains('bien')) return;
          if (o[2] === r[2]) { b.classList.add('bien'); bien(); msj.textContent = '¡Muy bien!'; aciertos++; if (aciertos >= 4) { cumplir(paso); } setTimeout(function () { ronda++; sala(); }, 900); }
          else { b.classList.add('mal'); mal(); msj.textContent = 'Piénsalo otra vez'; setTimeout(function () { b.classList.remove('mal'); }, 400); }
        };
        ops.appendChild(b);
      });
      el('div', 'msj', 'Aciertos: ' + aciertos + ' de 4');
      return;
    }
    cv = document.createElement('canvas'); cv.width = 640; cv.height = 340; s.appendChild(cv); g = cv.getContext('2d');
    var ctl = el('div', 'ops');
    if (paso === 0) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'btn escuchar'; b.textContent = '🔄 Girar la Tierra'; b.onclick = function () { objetivo += Math.PI / 2; tono('sine', 330, 0.12, 0.2); }; ctl.appendChild(b);
    } else {
      var l = document.createElement('label'); l.className = 'rango'; l.innerHTML = '🕐 Hora <input type="range" min="0" max="24" step="0.5" value="' + hora + '" aria-label="Hora del día">'; l.querySelector('input').oninput = function (e) { hora = Number(e.target.value); revisar3(); }; ctl.appendChild(l);
    }
    loop();
  }
  function revisar3() { if (paso !== 2) return; if (hora >= 11 && hora <= 13) vistos.sol = 1; if (hora >= 21 || hora <= 3) vistos.luna = 1; if (vistos.sol && vistos.luna) cumplir(2); }
  function loop(ms) { raf = requestAnimationFrame(loop); var t = (ms || 0) / 1000, dt = Math.min(0.1, t - tiempo); tiempo = t; if (paso === 0) { ang += (objetivo - ang) * (1 - Math.exp(-5 * dt)); dib1(); if (esDia()) vistos.dia = 1; else vistos.noche = 1; if (vistos.dia && vistos.noche && Math.abs(objetivo - ang) < 0.05) cumplir(0); } else if (paso === 2) dib3(); }
  function dib1() {
    var W = 640, H = 340; g.fillStyle = '#050b1c'; g.fillRect(0, 0, W, H);
    for (var i = 0; i < 40; i++) { g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect((i * 97) % W, (i * 53) % H, 2, 2); }
    // sol
    var h = g.createRadialGradient(70, 170, 10, 70, 170, 190); h.addColorStop(0, 'rgba(255,220,100,.9)'); h.addColorStop(1, 'rgba(255,220,100,0)'); g.fillStyle = h; g.fillRect(0, 0, 330, H);
    g.fillStyle = '#ffd95e'; g.beginPath(); g.arc(70, 170, 44, 0, 7); g.fill(); g.font = '40px system-ui'; g.textAlign = 'center'; g.fillText('☀️', 70, 184);
    g.strokeStyle = 'rgba(255,224,130,.35)'; g.lineWidth = 4; for (var r = 0; r < 5; r++) { g.beginPath(); g.moveTo(130, 170 + (r - 2) * 20); g.lineTo(250, 170 + (r - 2) * 30); g.stroke(); }
    // tierra (mitad iluminada a la izquierda)
    var cx = 410, cy = 170, R = 110;
    g.save(); g.beginPath(); g.arc(cx, cy, R, 0, 7); g.clip();
    var gt = g.createLinearGradient(cx - R, 0, cx + R, 0); gt.addColorStop(0, '#2e86e0'); gt.addColorStop(1, '#0c2a5e'); g.fillStyle = gt; g.fillRect(cx - R, cy - R, 2 * R, 2 * R);
    g.fillStyle = '#3fbf6a'; [[0, -40, 34], [1.7, 25, 40], [3.4, -5, 30], [5.1, 50, 26]].forEach(function (c) { var lx = Math.sin(c[0] + ang * 0.6) * R * 0.8; g.beginPath(); g.ellipse(cx + lx, cy + c[1], c[2], c[2] * 0.7, 0, 0, 7); g.fill(); });
    var sh = g.createLinearGradient(cx - R, 0, cx + R, 0); sh.addColorStop(0, 'rgba(0,0,20,0)'); sh.addColorStop(0.45, 'rgba(0,0,20,.1)'); sh.addColorStop(0.62, 'rgba(0,0,20,.8)'); sh.addColorStop(1, 'rgba(0,0,20,.95)'); g.fillStyle = sh; g.fillRect(cx - R, cy - R, 2 * R, 2 * R);
    g.restore(); g.strokeStyle = 'rgba(160,210,255,.5)'; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, R, 0, 7); g.stroke();
    // posición del niño sobre el contorno: ángulo phi medido desde el punto más cercano al sol
    var phi = ang, kx2 = cx - R * Math.cos(phi), ky2 = cy - R * Math.sin(phi);
    g.font = '40px system-ui'; g.textAlign = 'center'; g.fillText('🧒', kx2, ky2 + 12);
    var dia = esDia();
    g.fillStyle = dia ? 'rgba(255,224,120,.95)' : 'rgba(150,170,255,.95)'; g.font = '700 28px "Space Grotesk",system-ui,sans-serif'; g.fillText(dia ? '☀️ ¡Es de día!' : '🌙 ¡Es de noche!', 320, 36);
  }
  function dib3() {
    var W = 640, H = 340, dia = Math.max(0, Math.sin(Math.PI * (hora - 6) / 12));
    var gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, 'rgb(' + [Math.round(8 + 100 * dia), Math.round(14 + 150 * dia), Math.round(40 + 190 * dia)] + ')'); gr.addColorStop(1, 'rgb(' + [Math.round(25 + 160 * dia), Math.round(30 + 170 * dia), Math.round(70 + 150 * dia)] + ')'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    if (dia < 0.5) { g.fillStyle = 'rgba(255,255,255,' + (0.9 - dia * 1.6) + ')'; for (var i = 0; i < 40; i++) { g.beginPath(); g.arc((i * 97) % W, (i * 53) % 220, 1 + (i % 3) * 0.7, 0, 7); g.fill(); } }
    var a = Math.PI * (hora - 6) / 12; g.font = '70px system-ui'; g.textAlign = 'center';
    if (hora > 5.5 && hora < 18.5) { var h = g.createRadialGradient(320 - Math.cos(a) * 270, 260 - Math.sin(a) * 200, 5, 320 - Math.cos(a) * 270, 260 - Math.sin(a) * 200, 90); h.addColorStop(0, 'rgba(255,230,140,.7)'); h.addColorStop(1, 'rgba(255,230,140,0)'); g.fillStyle = h; g.fillRect(0, 0, W, H); g.fillStyle = '#000'; g.fillText('☀️', 320 - Math.cos(a) * 270, 276 - Math.sin(a) * 200); }
    else { var b = a + Math.PI; g.fillText('🌙', 320 - Math.cos(b) * 270, 276 - Math.sin(b) * 200); }
    g.fillStyle = 'rgb(' + [Math.round(30 + 40 * dia), Math.round(70 + 70 * dia), Math.round(50 + 30 * dia)] + ')'; g.fillRect(0, 290, W, 50); g.font = '44px system-ui'; g.fillStyle = '#000'; g.fillText('🏠', 90, 300); g.fillText('🌳', 520, 300);
    g.fillStyle = dia > 0.3 ? '#fff' : '#ffe08a'; g.font = '700 26px "Space Grotesk",system-ui,sans-serif'; g.fillText((Math.floor(hora) < 10 ? '0' : '') + Math.floor(hora) + ':' + (hora % 1 ? '30' : '00') + (dia > 0.3 ? ' · ¡Es de día!' : ' · ¡Es de noche!'), 320, 326);
  }
  function pintar() {
    var p = $('pasos'); p.textContent = '';
    PASOS.forEach(function (P, i) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === paso));
      b.innerHTML = '<b>' + (hecho[i] ? '✓' : i + 1) + '</b>' + P.n; b.onclick = function () { ir(i); }; p.appendChild(b);
    });
    var P = PASOS[paso]; $('tit').textContent = (paso + 1) + '. ' + P.t; $('txt').innerHTML = P.x; $('misTxt').textContent = hecho[paso] ? '¡Muy bien! Misión cumplida ✔' : P.m; $('dato').textContent = '💡 ' + P.d;
    $('mis').className = 'mision' + (hecho[paso] ? ' ok' : ''); $('bAnt').disabled = paso === 0; $('bSig').disabled = paso === PASOS.length - 1; $('fin').className = 'fin' + (hecho.every(Boolean) ? ' v' : '');
  }
  function narrar(forzar) { var P = PASOS[paso]; Narrar.decir('p' + (paso + 1), P.t + '. ' + P.x.replace(/<[^>]+>/g, ''), forzar, ['m' + (paso + 1), 'Tu misión. ' + P.m]); }
  function ir(n) { paso = n; Narrar.parar(); if (PASOS[n].juego) { orden = mezclar([0, 1, 2, 3, 4, 5]); ronda = 0; aciertos = 0; } sala(); pintar(); narrar(false); }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); };
  $('bSig').onclick = function () { if (paso < PASOS.length - 1) ir(paso + 1); };
  $('bVoz').onclick = function () { narrar(true); };
  $('bAuto').setAttribute('aria-pressed', String(Narrar.activa())); $('bAuto').onclick = function () { $('bAuto').setAttribute('aria-pressed', String(Narrar.alternar())); };
  window.__dian = { ir: ir, girar: function () { objetivo += Math.PI / 2; }, hora: function (h) { hora = h; revisar3(); }, estado: function () { return { hecho: hecho.slice(), paso: paso, dia: esDia() }; }, correcta: function () { return paso === 1 ? RONDAS[orden[ronda % RONDAS.length]][2] : -1; }, ang: function () { return [ang, objetivo]; } };
  sala(); pintar();
})();
