/* Flota o se hunde (1°, solo español, con voz de Beto): probar objetos, adivinar y la plastilina que flota si tiene forma de barco. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var PASOS = [
    { n: 'Prueba objetos', org: '🧪', t: 'Flota o se hunde', x: 'Cuando dejamos caer un objeto al agua, algunos se quedan arriba: ¡<b>flotan</b>! Otros se van al fondo: ¡se <b>hunden</b>! Toca cada objeto y míralo.', m: 'Prueba seis objetos distintos en el agua.', d: 'Los barcos enormes de acero flotan porque tienen mucho aire adentro.' },
    { n: 'Adivina', org: '🤔', t: 'Adivina antes de probar', x: 'Mira el objeto. Piensa si es <b>liviano</b> o <b>pesado</b>, y adivina si va a <b>flotar</b> o a <b>hundirse</b>.', m: 'Adivina cuatro veces si flota o se hunde.', juego: 1, d: 'Las cosas con mucho aire adentro, como una pelota, suelen flotar.' },
    { n: 'La plastilina', org: '🚢', t: 'La bolita de plastilina', x: 'Una bolita de plastilina se <b>hunde</b>. Pero si le das forma de <b>barquito</b>, ¡flota! La forma ayuda a que el agua la sostenga.', m: 'Mira la bolita y el barquito de plastilina en el agua.', d: 'Por eso los barcos tienen el casco ancho y hueco.' }
  ];
  var OBJ = [['🪵', 'Madera', 1], ['🧱', 'Ladrillo', 0], ['🍎', 'Manzana', 1], ['🪙', 'Moneda', 0], ['🏀', 'Pelota', 1], ['🪨', 'Piedra', 0], ['🍃', 'Hoja', 1], ['🔑', 'Llave', 0]];
  var paso = 0, hecho = PASOS.map(function () { return false; }), probados = {}, ronda = 0, aciertos = 0, orden = [], raf = 0, cv = null, g = null, tiempo = 0, items = [], forma = 0, vistos3 = {}, msjc = '', burb = [];
  var ac = null;
  function tono(tipo, f, v, d) {
    try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume();
      var o = ac.createOscillator(), G = ac.createGain(), n = ac.currentTime; o.type = tipo; o.frequency.value = f; G.gain.setValueAtTime(0.0001, n); G.gain.exponentialRampToValueAtTime(v, n + 0.01); G.gain.exponentialRampToValueAtTime(0.0001, n + d); o.connect(G); G.connect(ac.destination); o.start(n); o.stop(n + d + 0.05); } catch (e) {}
  }
  function bien() { tono('sine', 660, 0.2, 0.2); setTimeout(function () { tono('sine', 880, 0.2, 0.3); }, 130); }
  function mal() { tono('sine', 200, 0.18, 0.25); }
  function plop() { tono('sine', 300, 0.15, 0.12); tono('sine', 180, 0.12, 0.2); }
  function mezclar(a) { return a.slice().sort(function () { return Math.random() - 0.5; }); }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; bien(); pintar(); Narrar.decir('ok', '¡Muy bien! Misión cumplida.'); }
  var W = 640, H = 340, AGUA = 130, FONDO = 300;
  function soltar(o, forzado) { items.push({ e: o[0], f: o[2], x: 200 + Math.random() * 240, y: 20, vy: 0, vx: 0, ph: Math.random() * 6, quieto: false }); plop(); probados[o[0]] = 1; if (Object.keys(probados).length >= 6) cumplir(0); }
  function sala() {
    var P = PASOS[paso], s = $('sala'); cancelAnimationFrame(raf); s.textContent = ''; items = []; burb = [];
    function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; s.appendChild(e); return e; }
    if (P.juego) {
      var o = OBJ[orden[ronda % OBJ.length]]; el('div', 'organo', o[0]); el('div', 'pregunta', '¿' + o[1] + ': flota o se hunde?');
      var ops = el('div', 'ops'), msj = el('div', 'msj'); msj.setAttribute('aria-live', 'polite');
      [['🛟', 'Flota', 1], ['⚓', 'Se hunde', 0]].forEach(function (op) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'op'; b.innerHTML = op[0] + '<small>' + op[1] + '</small>';
        b.onclick = function () { if (b.classList.contains('bien')) return; if (op[2] === o[2]) { b.classList.add('bien'); bien(); msj.textContent = '¡Muy bien!'; aciertos++; if (aciertos >= 4) cumplir(paso); setTimeout(function () { ronda++; sala(); }, 900); } else { b.classList.add('mal'); mal(); msj.textContent = 'Piénsalo otra vez'; setTimeout(function () { b.classList.remove('mal'); }, 400); } };
        ops.appendChild(b);
      });
      el('div', 'msj', 'Aciertos: ' + aciertos + ' de 4'); return;
    }
    cv = document.createElement('canvas'); cv.width = W; cv.height = H; s.appendChild(cv); g = cv.getContext('2d');
    var ctl = el('div', 'ops');
    if (paso === 0) OBJ.forEach(function (o) { var b = document.createElement('button'); b.type = 'button'; b.className = 'op'; b.style.minWidth = '84px'; b.style.fontSize = '44px'; b.innerHTML = o[0] + '<small>' + o[1] + '</small>'; b.onclick = function () { soltar(o); }; ctl.appendChild(b); });
    else {
      var b1 = document.createElement('button'); b1.type = 'button'; b1.className = 'op'; b1.innerHTML = '⚫<small>Bolita</small>'; b1.onclick = function () { forma = 0; vistos3[0] = 1; items = []; items.push({ e: 'bola', f: 0, x: 320, y: 20, vy: 0, vx: 0, ph: 0 }); plop(); if (vistos3[0] && vistos3[1]) cumplir(2); }; ctl.appendChild(b1);
      var b2 = document.createElement('button'); b2.type = 'button'; b2.className = 'op'; b2.innerHTML = '⛵<small>Barquito</small>'; b2.onclick = function () { forma = 1; vistos3[1] = 1; items = []; items.push({ e: 'barco', f: 1, x: 320, y: 20, vy: 0, vx: 0, ph: 0 }); plop(); if (vistos3[0] && vistos3[1]) cumplir(2); }; ctl.appendChild(b2);
    }
    loop();
  }
  function loop(ms) { raf = requestAnimationFrame(loop); var t = (ms || 0) / 1000, dt = Math.min(0.05, t - tiempo); tiempo = t; sim(dt); dib(); }
  function sim(dt) {
    items.forEach(function (it) {
      var y = it.y, enAgua = y > AGUA - 6;
      if (!enAgua) { it.vy += 600 * dt; it.y += it.vy * dt; if (it.y > AGUA - 6 && !it.salpico) { it.salpico = 1; for (var k = 0; k < 8; k++) burb.push({ x: it.x + (Math.random() - 0.5) * 30, y: AGUA, vy: -(60 + Math.random() * 80), vx: (Math.random() - 0.5) * 80, v: 0.8 }); } }
      else if (it.f) { var meta = AGUA + 4 + Math.sin(tiempo * 2 + it.ph) * 3; it.vy += (meta - it.y) * 30 * dt; it.vy *= 0.92; it.y += it.vy * dt; }
      else { it.vy += 200 * dt; it.vy = Math.min(it.vy, 140); it.y += it.vy * dt; if (it.y >= FONDO) { it.y = FONDO; it.vy = 0; it.quieto = true; } else if (Math.random() < dt * 8) burb.push({ x: it.x + (Math.random() - 0.5) * 20, y: it.y, vy: -50, vx: 0, v: 1 }); }
    });
    burb = burb.filter(function (b) { b.y += b.vy * dt; b.x += b.vx * dt; b.vy += (b.y > AGUA ? -20 : 400) * dt; b.v -= dt * 0.6; return b.v > 0 && b.y < H; });
  }
  function dib() {
    var gr = g.createLinearGradient(0, 0, 0, AGUA); gr.addColorStop(0, '#b9e6ff'); gr.addColorStop(1, '#e4f6ff'); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.fillStyle = '#d8c7a0'; g.fillRect(0, H - 20, W, 20);
    var wg = g.createLinearGradient(0, AGUA, 0, H); wg.addColorStop(0, '#4aa8f0'); wg.addColorStop(1, '#1a5fb0'); g.fillStyle = wg; g.fillRect(80, AGUA, W - 160, H - AGUA - 20);
    g.strokeStyle = '#2a4a7a'; g.lineWidth = 6; g.beginPath(); g.moveTo(80, 40); g.lineTo(80, H - 20); g.lineTo(W - 80, H - 20); g.lineTo(W - 80, 40); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 3; g.beginPath(); for (var x = 80; x <= W - 80; x += 8) { var yy = AGUA + Math.sin(x * 0.07 + tiempo * 3) * 2; if (x === 80) g.moveTo(x, yy); else g.lineTo(x, yy); } g.stroke();
    g.fillStyle = '#e6c88a'; g.fillRect(86, FONDO + 28, W - 172, 8);
    items.forEach(function (it) { g.font = '56px system-ui'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#000';
      if (it.e === 'bola') { var gb = g.createRadialGradient(it.x - 6, it.y - 6, 3, it.x, it.y, 28); gb.addColorStop(0, '#ff9a9a'); gb.addColorStop(1, '#c43a3a'); g.fillStyle = gb; g.beginPath(); g.arc(it.x, it.y, 26, 0, 7); g.fill(); }
      else if (it.e === 'barco') { g.fillStyle = '#ff7a7a'; g.beginPath(); g.moveTo(it.x - 56, it.y - 14); g.lineTo(it.x + 56, it.y - 14); g.lineTo(it.x + 38, it.y + 14); g.lineTo(it.x - 38, it.y + 14); g.closePath(); g.fill(); g.strokeStyle = '#8a1a1a'; g.lineWidth = 3; g.stroke(); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(it.x, it.y - 56); g.lineTo(it.x + 34, it.y - 18); g.lineTo(it.x, it.y - 18); g.closePath(); g.fill(); g.strokeStyle = '#8a5a2a'; g.beginPath(); g.moveTo(it.x, it.y - 60); g.lineTo(it.x, it.y - 14); g.stroke(); }
      else g.fillText(it.e, it.x, it.y); g.textBaseline = 'alphabetic'; });
    burb.forEach(function (b) { g.strokeStyle = 'rgba(255,255,255,' + Math.min(1, b.v) + ')'; g.lineWidth = 2; g.beginPath(); g.arc(b.x, b.y, 3.5, 0, 7); g.stroke(); });
    g.fillStyle = '#16304f'; g.font = '700 22px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'center'; var u = items[items.length - 1]; var t = paso === 0 ? (u ? (u.f ? '🛟 ¡Flota!' : '⚓ ¡Se hunde!') : 'Toca un objeto de abajo') + ' · probados ' + Math.min(6, Object.keys(probados).length) + ' de 6' : (u ? (u.f ? '⛵ El barquito flota' : '⚫ La bolita se hunde') : 'Toca la bolita y el barquito');
    if (u && (u.y > AGUA + 4 || u.f)) g.fillText(t, W / 2, 34); else g.fillText(paso === 0 ? 'Toca un objeto de abajo · probados ' + Math.min(6, Object.keys(probados).length) + ' de 6' : 'Toca la bolita y el barquito', W / 2, 34);
  }
  function pintar() {
    var p = $('pasos'); p.textContent = '';
    PASOS.forEach(function (P, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === paso)); b.innerHTML = '<b>' + (hecho[i] ? '✓' : i + 1) + '</b>' + P.n; b.onclick = function () { ir(i); }; p.appendChild(b); });
    var P = PASOS[paso]; $('tit').textContent = (paso + 1) + '. ' + P.t; $('txt').innerHTML = P.x; $('misTxt').textContent = hecho[paso] ? '¡Muy bien! Misión cumplida ✔' : P.m; $('dato').textContent = '💡 ' + P.d;
    $('mis').className = 'mision' + (hecho[paso] ? ' ok' : ''); $('bAnt').disabled = paso === 0; $('bSig').disabled = paso === PASOS.length - 1; $('fin').className = 'fin' + (hecho.every(Boolean) ? ' v' : '');
  }
  function narrar(forzar) { var P = PASOS[paso]; Narrar.decir('p' + (paso + 1), P.t + '. ' + P.x.replace(/<[^>]+>/g, ''), forzar, ['m' + (paso + 1), 'Tu misión. ' + P.m]); }
  function ir(n) { paso = n; Narrar.parar(); if (PASOS[n].juego) { orden = mezclar([0, 1, 2, 3, 4, 5, 6, 7]); ronda = 0; aciertos = 0; } sala(); pintar(); narrar(false); }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); };
  $('bSig').onclick = function () { if (paso < PASOS.length - 1) ir(paso + 1); };
  $('bVoz').onclick = function () { narrar(true); };
  $('bAuto').setAttribute('aria-pressed', String(Narrar.activa())); $('bAuto').onclick = function () { $('bAuto').setAttribute('aria-pressed', String(Narrar.alternar())); };
  window.__flot = { ir: ir, soltar: function (i) { soltar(OBJ[i]); }, sim: function (s) { for (var i = 0; i < s * 30; i++) sim(1 / 30); }, correcta: function () { return PASOS[paso].juego ? OBJ[orden[ronda % OBJ.length]][2] : -1; }, estado: function () { return { hecho: hecho.slice(), paso: paso }; } };
  orden = mezclar([0, 1, 2, 3, 4, 5, 6, 7]); sala(); pintar();
})();
