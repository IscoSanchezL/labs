/* Luz y sombras: la luz viaja recto, los objetos hacen sombra, materiales transparente/translúcido/opaco. */
(function () {
  'use strict';
  var T = I18N.t, $ = function (id) { return document.getElementById(id); };
  var cv = $('cv'), g = cv.getContext('2d'), W = cv.width, H = cv.height;
  var paso = 0, hecho = [false, false, false];
  var LX = 110, ly = 230, WALL = 800, ox = 420, OY = 230, OH = 130, mat = 'madera', probados = {};
  var movioLuz = 0, cerca = false, lejos = false, ultLy = ly, arrastre = null;
  var MAT = { vidrio: { a: 0.05, n: 'n_trans', c: 'rgba(160,220,255,.35)' }, papel: { a: 0.45, n: 'n_transl', c: 'rgba(255,245,210,.55)' }, madera: { a: 0.92, n: 'n_opaco', c: '#9a6b3d' } };
  var ac = null;
  function pop(f, v) {
    try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume();
      var o = ac.createOscillator(), G = ac.createGain(), n = ac.currentTime; o.type = 'sine'; o.frequency.value = f; G.gain.setValueAtTime(0.0001, n); G.gain.exponentialRampToValueAtTime(v || 0.15, n + 0.01); G.gain.exponentialRampToValueAtTime(0.0001, n + 0.25); o.connect(G); G.connect(ac.destination); o.start(); o.stop(n + 0.3); } catch (e) {}
  }
  function proy(y) { return ly + (y - ly) * (WALL - LX) / (ox - LX); }
  function dibujar() {
    var gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#0e2038'); gr.addColorStop(1, '#070d18'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    var haz = paso > 0, a = haz ? MAT[mat].a : 0, objetoVisible = paso > 0, yt = OY - OH / 2, yb = OY + OH / 2;
    // pared
    g.fillStyle = '#1b2a44'; g.fillRect(WALL, 0, W - WALL, H);
    // zona iluminada de la pared
    var lg = g.createRadialGradient(WALL, ly, 20, WALL, ly, 300); lg.addColorStop(0, 'rgba(255,230,140,.55)'); lg.addColorStop(1, 'rgba(255,230,140,.05)');
    g.fillStyle = lg; g.fillRect(WALL, 0, W - WALL, H);
    // rayos
    var N = 15;
    for (var i = 0; i < N; i++) {
      var yw = ly + (i - (N - 1) / 2) * 34, tope = WALL;
      var pasaPorObj = objetoVisible && (function () { var yo = ly + (yw - ly) * (ox - LX) / (WALL - LX); return yo >= yt && yo <= yb; })();
      g.lineWidth = 3;
      if (pasaPorObj) {
        g.strokeStyle = 'rgba(255,230,140,.7)'; g.beginPath(); g.moveTo(LX, ly); g.lineTo(ox, ly + (yw - ly) * (ox - LX) / (WALL - LX)); g.stroke();
        if (a < 0.9) { g.strokeStyle = 'rgba(255,230,140,' + (0.7 * (1 - a)) + ')'; g.beginPath(); g.moveTo(ox, ly + (yw - ly) * (ox - LX) / (WALL - LX)); g.lineTo(WALL, yw); g.stroke(); }
      } else { g.strokeStyle = 'rgba(255,230,140,.7)'; g.beginPath(); g.moveTo(LX, ly); g.lineTo(WALL, yw); g.stroke(); }
    }
    // sombra en la pared
    if (objetoVisible) { var s1 = proy(yt), s2 = proy(yb); g.fillStyle = 'rgba(3,8,18,' + a + ')'; g.fillRect(WALL, Math.min(s1, s2), W - WALL, Math.abs(s2 - s1)); }
    // objeto
    if (objetoVisible) {
      g.fillStyle = MAT[mat].c; g.strokeStyle = mat === 'vidrio' ? 'rgba(200,240,255,.9)' : 'rgba(0,0,0,.35)'; g.lineWidth = 3;
      g.beginPath(); g.roundRect(ox - 14, yt, 28, OH, 8); g.fill(); g.stroke();
      if (mat === 'vidrio') { g.strokeStyle = 'rgba(255,255,255,.7)'; g.beginPath(); g.moveTo(ox - 6, yt + 12); g.lineTo(ox - 6, yt + 50); g.stroke(); }
    }
    // linterna
    g.font = '70px serif'; g.textAlign = 'center'; g.fillText('🔦', LX - 30, ly + 24);
    g.fillStyle = 'rgba(255,255,255,.75)'; g.font = '700 18px "Space Grotesk",system-ui,sans-serif'; g.fillText(T('linterna'), LX - 30, ly + 66);
    g.fillText(T('pared'), WALL + (W - WALL) / 2, 30);
    if (paso === 0) { g.font = '36px serif'; g.fillText('↕', LX - 30, ly - 52); }
    if (paso === 1) { g.font = '36px serif'; g.fillText('↔', ox, yt - 14); }
    if (paso === 2) { g.fillStyle = '#fff'; g.font = '700 26px "Space Grotesk",system-ui,sans-serif'; g.fillText(T(MAT[mat].n), ox, yb + 44); }
    requestAnimationFrame(dibujar);
  }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; pop(660, 0.2); setTimeout(function () { pop(880, 0.2); }, 130); pintar(); Narrar.decir('ok', T('ok')); }
  function revisar() {
    if (movioLuz > 140) cumplir(0);
    var d = ox - LX; if (paso === 1) { if (d < 230) cerca = true; if (d > 480) lejos = true; if (cerca && lejos) cumplir(1); }
    if (paso === 2 && Object.keys(probados).length === 3) cumplir(2);
  }
  function pos(e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height }; }
  cv.addEventListener('pointerdown', function (e) {
    var p = pos(e); cv.setPointerCapture && cv.setPointerCapture(e.pointerId);
    if (p.x < 260 && Math.abs(p.y - ly) < 110) arrastre = 'luz';
    else if (paso > 0 && Math.abs(p.x - ox) < 60 && Math.abs(p.y - OY) < 100) arrastre = 'obj';
  });
  cv.addEventListener('pointermove', function (e) {
    if (!arrastre) return; var p = pos(e);
    if (arrastre === 'luz') { var ny = Math.max(90, Math.min(H - 90, p.y)); movioLuz += Math.abs(ny - ly); ly = ny; }
    else if (paso === 1 || paso === 2) { var nx = Math.max(230, Math.min(710, p.x)); ox = nx; }
    revisar();
  });
  cv.addEventListener('pointerup', function () { if (arrastre) pop(520, 0.1); arrastre = null; });
  function ctl() {
    var c = $('ctl'); c.textContent = '';
    if (paso !== 2) return;
    ['vidrio', 'papel', 'madera'].forEach(function (k) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'tab'; b.textContent = T('mat_' + k); b.setAttribute('aria-pressed', String(mat === k));
      b.onclick = function () { mat = k; probados[k] = true; pop(k === 'madera' ? 300 : k === 'papel' ? 420 : 600, 0.15); ctl(); revisar(); }; c.appendChild(b);
    });
  }
  function pintar() {
    var p = $('pasos'); p.textContent = '';
    for (var i = 0; i < 3; i++) (function (i) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === paso));
      b.innerHTML = '<b>' + (hecho[i] ? '✓' : i + 1) + '</b>' + T('paso' + (i + 1)); b.onclick = function () { ir(i); }; p.appendChild(b);
    })(i);
    var n = paso + 1; $('tit').textContent = T('t' + n); $('txt').innerHTML = T('x' + n); $('misTxt').textContent = T('m' + n); $('dato').textContent = '💡 ' + T('d' + n);
    $('mis').className = 'mision' + (hecho[paso] ? ' ok' : ''); if (hecho[paso]) $('misTxt').textContent = T('ok');
    $('bAnt').disabled = paso === 0; $('bSig').disabled = paso === 2; $('fin').className = 'fin' + (hecho.every(Boolean) ? ' v' : '');
  }
  function ir(n) {
    paso = n; Narrar.parar(); if (n === 2) { mat = 'madera'; probados = { madera: true }; } cerca = lejos = false; ctl(); pintar();
    Narrar.decir('p' + (n + 1), $('tit').textContent.replace(/^\d\.\s*/, '') + '. ' + $('txt').textContent, false, ['m' + (n + 1), T('m' + (n + 1))]);
  }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); };
  $('bSig').onclick = function () { if (paso < 2) ir(paso + 1); };
  $('bVoz').onclick = function () { Narrar.decir('p' + (paso + 1), $('tit').textContent.replace(/^\d\.\s*/, '') + '. ' + $('txt').textContent, true, ['m' + (paso + 1), T('m' + (paso + 1))]); };
  $('bAuto').setAttribute('aria-pressed', String(Narrar.activa())); $('bAuto').onclick = function () { $('bAuto').setAttribute('aria-pressed', String(Narrar.alternar())); };
  I18N.onChange(function () { ctl(); pintar(); });
  window.__sombras = { ir: ir, estado: function () { return { hecho: hecho.slice() }; }, mover: function (nly, nox) { if (nly) { movioLuz += Math.abs(nly - ly); ly = nly; } if (nox) ox = nox; revisar(); }, setMat: function (k) { mat = k; probados[k] = true; revisar(); } };
  ctl(); pintar(); I18N.montar(); requestAnimationFrame(dibujar);
})();
