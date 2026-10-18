/* Imanes (2°, solo español, sin voz): qué atrae un imán, los polos y la distancia. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var cv = $('cv'), g = cv.getContext('2d'), W = cv.width, H = cv.height;
  var PASOS = [
    { n: 'Qué atrae un imán', t: '1. Un imán atrae algunos metales', x: 'Un imán atrae objetos de <b>hierro</b>, como clips, tornillos y llaves. No atrae la madera, el papel, el plástico ni las frutas.', m: 'Arrastra el imán y pega 4 cosas.', d: 'Los imanes más fuertes del mundo están dentro de los aparatos de resonancia de los hospitales.' },
    { n: 'Los polos', t: '2. Los polos se atraen o se rechazan', x: 'Todo imán tiene dos polos: <b>norte</b> (rojo) y <b>sur</b> (azul). Polos <b>distintos</b> se atraen y polos <b>iguales</b> se rechazan.', m: 'Acerca los imanes y gira uno hasta ver que se atraen y que se rechazan.', d: 'La Tierra es como un imán gigante: por eso la brújula siempre señala el norte.' },
    { n: 'La distancia', t: '3. La fuerza es mayor de cerca', x: 'El imán tiene fuerza alrededor de él. Cerca atrae fuerte y lejos casi nada. Además, <b>atraviesa</b> el papel, la madera y el vidrio.', m: 'Pon un material en medio y atrae el clip con cada uno.', d: 'Por eso los imanes del refrigerador sujetan una hoja de papel contra la puerta.' }
  ];
  var paso = 0, hecho = [false, false, false];
  /* audio */
  var ac = null;
  function tono(f, v, d, tipo) { try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume(); var o = ac.createOscillator(), G = ac.createGain(), n = ac.currentTime; o.type = tipo || 'sine'; o.frequency.value = f; G.gain.setValueAtTime(0.0001, n); G.gain.exponentialRampToValueAtTime(v, n + 0.01); G.gain.exponentialRampToValueAtTime(0.0001, n + d); o.connect(G); G.connect(ac.destination); o.start(); o.stop(n + d + 0.05); } catch (e) {} }
  function clic() { tono(900, 0.18, 0.08, 'square'); }
  function ex() { tono(660, 0.2, 0.2); setTimeout(function () { tono(880, 0.2, 0.3); }, 130); }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; ex(); if (window.STEMFX) STEMFX.exito(); pintar(); }
  var dibT = function (s, x, y, tam, col, al) { g.font = '700 ' + tam + 'px "Space Grotesk",system-ui,sans-serif'; g.fillStyle = col || '#eaf2fb'; g.textAlign = al || 'center'; g.fillText(s, x, y); };
  function fondo() { var gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#0e2038'); gr.addColorStop(1, '#09111f'); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
  function mesa() { g.fillStyle = '#16263d'; g.fillRect(0, H - 80, W, 80); }

  /* ---------- paso 1: qué atrae ---------- */
  var OBJ = [['📎', 1], ['✏️', 0], ['🔩', 1], ['🍎', 0], ['🔑', 1], ['📄', 0], ['🧷', 1], ['🥤', 0], ['🪵', 0]];
  var objs = [], im = { x: 480, y: 200 }, arr1 = false, pegados = 0;
  function reordenar() { objs = OBJ.map(function (o, i) { return { e: o[0], mag: o[1], x: 90 + (i % 5) * 190 + (i > 4 ? 95 : 0), y: i > 4 ? 380 : 330 - (i % 2) * 70, pegado: false, ox: 0, oy: 0, no: 0 }; }); pegados = 0; }
  function dib1() {
    mesa(); g.font = '56px serif'; g.textAlign = 'center';
    objs.forEach(function (o) {
      var d = Math.hypot(o.x - im.x, o.y - im.y);
      if (o.mag && !o.pegado && d < 135) { o.x += (im.x - o.x) * 0.14; o.y += (im.y - o.y) * 0.14; if (Math.hypot(o.x - im.x, o.y - im.y) < 52) { o.pegado = true; o.ox = o.x - im.x; o.oy = o.y - im.y; clic(); pegados++; if (pegados >= 4) cumplir(0); } }
      else if (o.pegado) { o.x = im.x + o.ox; o.y = im.y + o.oy; }
      else if (!o.mag && d < 105) o.no = 14;
      var sh = o.no > 0 ? Math.sin(o.no * 2) * 4 : 0; if (o.no > 0) o.no--;
      g.fillStyle = '#fff'; g.fillText(o.e, o.x + sh, o.y + 18);
      if (!o.mag && !o.pegado && d < 105) dibT('✗', o.x, o.y - 40, 30, '#ff6b7d');
    });
    g.font = '110px serif'; g.fillText('🧲', im.x, im.y + 38);
    if (!arr1) dibT('👆 arrástrame', im.x, im.y - 70, 22, '#9db8ff');
    dibT('Pegados: ' + pegados + ' de 4', W / 2, 36, 24, '#8be8ae');
  }

  /* ---------- paso 2: polos ---------- */
  var A = { x: 250 }, B = { x: 640, vx: 0, volteado: false, arr: false }, vioAtrae = false, vioRechaza = false, estado2 = '';
  function polos(x, flip) { return flip ? ['S', 'N'] : ['N', 'S']; }
  function barra(x, flip) {
    var p = polos(x, flip), y = 230, w = 170, h = 64;
    g.fillStyle = p[0] === 'N' ? '#ff5a6b' : '#5a9bff'; g.fillRect(x - w / 2, y - h / 2, w / 2, h);
    g.fillStyle = p[1] === 'N' ? '#ff5a6b' : '#5a9bff'; g.fillRect(x, y - h / 2, w / 2, h);
    g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 3; g.strokeRect(x - w / 2, y - h / 2, w, h);
    dibT(p[0], x - w / 4, y + 12, 34, '#fff'); dibT(p[1], x + w / 4, y + 12, 34, '#fff');
  }
  function dib2() {
    mesa(); var pa = polos(0, false), pb = polos(0, B.volteado);
    var d = B.x - A.x - 170; /* separación entre los extremos enfrentados */
    var atrae = pa[1] !== pb[0];
    if (!B.arrastrando) {
      if (d < 220 && d > 0) { var f = Math.min(10, 40000 / (d * d + 1200)); B.vx += (atrae ? -f : f); }
      B.vx *= 0.88; B.x += B.vx; if (B.x < A.x + 170) { B.x = A.x + 170; B.vx = 0; } if (B.x > 840) { B.x = 840; B.vx = 0; }
    }
    d = B.x - A.x - 170;
    if (d < 120) { estado2 = atrae ? 'se atraen' : 'se rechazan'; if (atrae && d < 30) { vioAtrae = true; } if (!atrae && d < 110) { vioRechaza = true; } } else estado2 = '';
    if (vioAtrae && vioRechaza) cumplir(1);
    barra(A.x, false); barra(B.x, B.volteado);
    if (estado2) { dibT(estado2, W / 2, 110, 36, atrae ? '#8be8ae' : '#ff9f9f'); dibT(atrae ? '→ ←' : '← →', W / 2, 160, 40, atrae ? '#8be8ae' : '#ff9f9f'); }
    if (!B.arr) dibT('👆 mueve este imán', B.x, 150, 20, '#9db8ff');
    dibT('Atracción: ' + (vioAtrae ? '✔' : '·') + '   Rechazo: ' + (vioRechaza ? '✔' : '·'), W / 2, 36, 22, '#eaf2fb');
  }

  /* ---------- paso 3: distancia ---------- */
  var MATS = { nada: ['Nada', 'rgba(0,0,0,0)'], papel: ['Papel', 'rgba(255,245,210,.85)'], madera: ['Madera', '#9a6b3d'], vidrio: ['Vidrio', 'rgba(160,220,255,.45)'] };
  var mat = 'nada', dist3 = 0.3, clip = { x: 0, pegado: false, t: -9 }, pasaron = {};
  var IMX = 160, ymid = 230;
  function xclip() { return IMX + 110 + dist3 * 560; }
  function dib3() {
    mesa(); var cx = clip.pegado ? IMX + 78 : xclip(); var fuerza = Math.max(0, 1 - (xclip() - IMX) / 520);
    for (var k = 1; k <= 5; k++) { g.strokeStyle = 'rgba(255,224,138,' + (0.5 * fuerza / k * 1.6) + ')'; g.lineWidth = 3; g.beginPath(); g.ellipse(IMX + 40, ymid, 90 + k * 110 * fuerza, 30 + k * 34 * fuerza, 0, -1.3, 1.3); g.stroke(); }
    g.font = '110px serif'; g.textAlign = 'center'; g.fillStyle = '#fff'; g.fillText('🧲', IMX, ymid + 38);
    if (mat !== 'nada') { g.fillStyle = MATS[mat][1]; g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 2; g.fillRect(IMX + 100, ymid - 90, 16, 180); g.strokeRect(IMX + 100, ymid - 90, 16, 180); }
    var t = ahora() - clip.t, tr = clip.t > 0 && t < 0.4 ? Math.sin(t * 40) * 6 * (1 - t / 0.4) : 0;
    g.font = '56px serif'; g.fillText('📎', cx + (clip.pegado ? 0 : tr), ymid + 20);
    dibT('Distancia: ' + (dist3 < 0.35 ? 'cerca' : dist3 < 0.7 ? 'media' : 'lejos'), W / 2, 36, 22, '#eaf2fb');
    if (clip.msg) dibT(clip.msg, W / 2, H - 110, 28, clip.ok ? '#8be8ae' : '#ff9f9f');
  }
  var tiempo = 0; function ahora() { return tiempo; }
  function soltar() {
    var fuerza = (xclip() - IMX) < 330;
    clip.t = ahora();
    if (fuerza) { clip.pegado = true; clip.ok = true; clip.msg = '¡Lo atrae' + (mat === 'nada' ? '!' : ' a través de ' + MATS[mat][0].toLowerCase() + '!'); clic(); pasaron[mat] = true; if (pasaron.papel && pasaron.madera && pasaron.vidrio) cumplir(2); }
    else { clip.ok = false; clip.msg = 'Muy lejos: casi no hay fuerza'; tono(220, 0.18, 0.25); }
    setTimeout(function () { clip.pegado = false; clip.msg = ''; }, 1600);
  }

  function frame(ms) { tiempo = ms / 1000; fondo(); if (paso === 0) dib1(); else if (paso === 1) dib2(); else dib3(); requestAnimationFrame(frame); }

  /* ---------- entrada ---------- */
  var arr = null;
  function pos(e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height }; }
  cv.addEventListener('pointerdown', function (e) { var p = pos(e); cv.setPointerCapture && cv.setPointerCapture(e.pointerId);
    if (paso === 0 && Math.hypot(p.x - im.x, p.y - im.y) < 90) arr = 'im';
    else if (paso === 1 && Math.abs(p.x - B.x) < 100 && Math.abs(p.y - 230) < 60) { arr = 'B'; B.arrastrando = true; B.arr = true; B.vx = 0; } });
  cv.addEventListener('pointermove', function (e) { if (!arr) return; var p = pos(e);
    if (arr === 'im') { arr1 = true; im.x = Math.max(60, Math.min(W - 60, p.x)); im.y = Math.max(80, Math.min(H - 110, p.y)); }
    else { B.x = Math.max(A.x + 170, Math.min(840, p.x)); } });
  function suelta() { if (arr === 'B') B.arrastrando = false; arr = null; }
  cv.addEventListener('pointerup', suelta); cv.addEventListener('pointercancel', suelta);

  function ctl() {
    var c = $('ctl'); c.textContent = '';
    function btn(txt, fn, cls) { var b = document.createElement('button'); b.type = 'button'; b.className = 'btn ' + (cls || 'sec'); b.textContent = txt; b.onclick = fn; c.appendChild(b); return b; }
    if (paso === 0) btn('↺ Ordenar de nuevo', function () { reordenar(); });
    if (paso === 1) btn('🔄 Girar el imán', function () { B.volteado = !B.volteado; clic(); });
    if (paso === 2) {
      Object.keys(MATS).forEach(function (k) { var b = btn(MATS[k][0], function () { mat = k; ctl(); }, 'tab'); b.className = 'tab'; b.setAttribute('aria-pressed', String(mat === k)); });
      var l = document.createElement('label'); l.className = 'rango'; l.innerHTML = '<span>cerca</span><input type="range" min="0" max="100" value="' + Math.round(dist3 * 100) + '" aria-label="Distancia"><span>lejos</span>'; l.querySelector('input').oninput = function () { dist3 = this.value / 100; }; c.appendChild(l);
      btn('📎 Soltar el clip', soltar, 'grande');
    }
  }
  function pintar() {
    var p = $('pasos'); p.textContent = '';
    PASOS.forEach(function (P, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === paso)); b.innerHTML = '<b>' + (hecho[i] ? '✓' : i + 1) + '</b>' + P.n; b.onclick = function () { ir(i); }; p.appendChild(b); });
    var P = PASOS[paso]; $('tit').textContent = P.t; $('txt').innerHTML = P.x; $('misTxt').textContent = hecho[paso] ? '¡Muy bien! Misión cumplida ✔' : P.m; $('dato').textContent = '💡 ' + P.d;
    $('mis').className = 'mision' + (hecho[paso] ? ' ok' : ''); $('bAnt').disabled = paso === 0; $('bSig').disabled = paso === 2; $('fin').className = 'fin' + (hecho.every(Boolean) ? ' v' : '');
  }
  function ir(n) { paso = n; ctl(); pintar(); }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); }; $('bSig').onclick = function () { if (paso < 2) ir(paso + 1); };
  window.__imanes = { ir: ir, estado: function () { return { hecho: hecho.slice(), pegados: pegados }; },
    mover: function (x, y) { im.x = x; im.y = y; }, objs: function () { return objs.map(function (o) { return [o.e, Math.round(o.x), Math.round(o.y), o.mag]; }); },
    b: function (x, flip) { B.arrastrando = false; B.x = x; if (flip !== undefined) B.volteado = flip; B.vx = 0; }, estado2: function () { return estado2; },
    d3: function (m, d) { mat = m; dist3 = d; soltar(); } };
  reordenar(); ctl(); pintar(); requestAnimationFrame(frame);
})();
