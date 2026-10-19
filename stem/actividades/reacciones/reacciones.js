/* Reacciones químicas (6°, solo español, sin voz): balancear ecuaciones y ver cómo se conservan los átomos. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var cv = $('cv'), g = cv.getContext('2d'), W = cv.width, H = cv.height;
  var COL = { H: ['#f4f8ff', '#aab8d4'], O: ['#ff6b6b', '#8a1a1a'], N: ['#6d8dff', '#1d2f8a'], C: ['#8a93a6', '#2a3040'], Fe: ['#ffb066', '#8a4a10'], Na: ['#c9a8ff', '#5a3aa0'], Cl: ['#6fe38a', '#1a6a3a'] };
  var EQ = {
    agua: { n: 'Formación del agua', r: [{ f: 'H₂', a: { H: 2 } }, { f: 'O₂', a: { O: 2 } }], p: [{ f: 'H₂O', a: { H: 2, O: 1 } }], sol: [2, 1, 2] },
    amoniaco: { n: 'Síntesis del amoníaco', r: [{ f: 'N₂', a: { N: 2 } }, { f: 'H₂', a: { H: 2 } }], p: [{ f: 'NH₃', a: { N: 1, H: 3 } }], sol: [1, 3, 2] },
    sal: { n: 'Formación de la sal', r: [{ f: 'Na', a: { Na: 1 } }, { f: 'Cl₂', a: { Cl: 2 } }], p: [{ f: 'NaCl', a: { Na: 1, Cl: 1 } }], sol: [2, 1, 2] },
    metano: { n: 'Combustión del metano', r: [{ f: 'CH₄', a: { C: 1, H: 4 } }, { f: 'O₂', a: { O: 2 } }], p: [{ f: 'CO₂', a: { C: 1, O: 2 } }, { f: 'H₂O', a: { H: 2, O: 1 } }], sol: [1, 2, 1, 2] },
    oxido: { n: 'Oxidación del hierro', r: [{ f: 'Fe', a: { Fe: 1 } }, { f: 'O₂', a: { O: 2 } }], p: [{ f: 'Fe₂O₃', a: { Fe: 2, O: 3 } }], sol: [4, 3, 2] }
  };
  var PASOS = [
    { n: 'Átomos que se conservan', t: '1. La materia no desaparece', x: 'En una <b>reacción química</b> las sustancias se transforman, pero los <b>átomos</b> no se crean ni se destruyen: solo se reorganizan. Por eso a ambos lados de la flecha debe haber los <b>mismos átomos</b>.', m: 'Balancea la formación del agua: 2 H₂ + O₂ → 2 H₂O.', d: 'Esta idea se llama ley de conservación de la masa y la propuso Lavoisier hacia 1789.', ecs: ['agua'] },
    { n: 'Balancea', t: '2. Pon los coeficientes', x: 'Para balancear usamos <b>coeficientes</b>: números grandes delante de cada sustancia que dicen cuántas moléculas hay. Nunca cambies los números pequeños de la fórmula (los subíndices).', m: 'Balancea dos reacciones: amoníaco y sal.', d: 'El amoníaco se usa para fabricar fertilizantes y la sal es el cloruro de sodio.', ecs: ['amoniaco', 'sal'] },
    { n: 'Retos', t: '3. Combustión y oxidación', x: 'Ahora los retos más grandes: la <b>combustión del metano</b> (el gas de las estufas) y la <b>oxidación del hierro</b> (la herrumbre). Cuenta los átomos de cada elemento en ambos lados.', m: 'Balancea la combustión del metano y la oxidación del hierro.', d: 'En la combustión del metano se libera calor: por eso sirve para cocinar.', ecs: ['metano', 'oxido'] }
  ];
  var paso = 0, hecho = [false, false, false], tiempo = 0, idx = 0, co = [], hechasEq = {}, rx = null, msj = '';
  var ac = null;
  function tono(f, v, d) { try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume(); var o = ac.createOscillator(), gn = ac.createGain(); o.type = 'sine'; o.frequency.value = f; gn.gain.setValueAtTime(v, ac.currentTime); gn.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d); o.connect(gn); gn.connect(ac.destination); o.start(); o.stop(ac.currentTime + d); } catch (e) {} }
  function ex() { tono(660, 0.2, 0.2); setTimeout(function () { tono(880, 0.2, 0.3); }, 130); }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; ex(); if (window.STEMFX) STEMFX.exito(); pintar(); }
  function eqActual() { return EQ[PASOS[paso].ecs[idx]]; }
  function especies(e) { return e.r.concat(e.p); }
  function conteo(e, lado) { var c = {}; (lado === 'r' ? e.r : e.p).forEach(function (s, i) { var k = (lado === 'r' ? i : e.r.length + i); Object.keys(s.a).forEach(function (el) { c[el] = (c[el] || 0) + s.a[el] * co[k]; }); }); return c; }
  function balanceada(e) { var L = conteo(e, 'r'), R = conteo(e, 'p'), els = Object.keys(L).concat(Object.keys(R)); return els.every(function (el) { return (L[el] || 0) === (R[el] || 0); }) && co.every(function (x) { return x > 0; }); }
  function txt(s, x, y, col, al, tam) { g.font = '700 ' + (tam || 18) + 'px "Space Grotesk",system-ui,sans-serif'; g.fillStyle = col || '#cfe6ff'; g.textAlign = al || 'center'; g.textBaseline = 'alphabetic'; g.fillText(s, x, y); }
  function atom(x, y, el, r) { var c = COL[el] || ['#ccc', '#555'], gr = g.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.1, x, y, r); gr.addColorStop(0, '#fff'); gr.addColorStop(0.3, c[0]); gr.addColorStop(1, c[1]); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.fillStyle = el === 'H' || el === 'Na' ? '#26304a' : '#fff'; g.font = '700 ' + Math.round(r * 0.9) + 'px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(el, x, y + 1); g.textBaseline = 'alphabetic'; }
  function molecula(sp, x, y, sc) {
    var lista = []; Object.keys(sp.a).forEach(function (el) { for (var i = 0; i < sp.a[el]; i++) lista.push(el); });
    var n = lista.length, rr = 15 * sc; lista.forEach(function (el, i) { var ang = n === 1 ? 0 : (i / n) * Math.PI * 2 + 0.6, rad = n === 1 ? 0 : (n === 2 ? 11 : 17) * sc; atom(x + Math.cos(ang) * rad, y + Math.sin(ang) * rad, el, el === 'H' || el === 'Na' ? rr * 0.78 : rr); });
  }
  var POS = [];
  var V3 = null, MOLS = [];
  function dibujar(ms) {
    var dt = Math.min(0.05, (ms - (dibujar.l || ms)) / 1000); dibujar.l = ms; tiempo += dt;
    var e = eqActual(), bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0a1a2e'); bg.addColorStop(1, '#050b14'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    var sp = especies(e), nr = e.r.length, tot = sp.length, ok = balanceada(e); MOLS = [];
    txt(e.n, W / 2, 34, '#9db8ff', 'center', 20);
    // especies y flecha
    var colw = (W - 160) / (tot + 0.4), xs = []; for (var i = 0; i < tot; i++) { var extra = i >= nr ? 0.4 * colw : 0; xs.push(80 + colw * (i + 0.5) + extra); }
    POS = xs;
    sp.forEach(function (s, i) { var cnt = Math.min(co[i], 6), cx = xs[i]; for (var k = 0; k < cnt; k++) { var col = k % 3, row = Math.floor(k / 3); var mx = cx - 70 + col * 70 + (rx ? Math.sin(tiempo * 3 + k) * 3 : 0), my = 104 + row * 70; if (V3) MOLS.push({ f: s.f, a: s.a, x: mx, y: my }); else molecula(s, mx, my, 1.1); } txt(String(co[i]) + ' ' + s.f, cx, 250, '#fff', 'center', 28); if (i < nr - 1) txt('+', (xs[i] + xs[i + 1]) / 2, 252, '#9db8ff', 'center', 34); if (i >= nr && i < tot - 1) txt('+', (xs[i] + xs[i + 1]) / 2, 252, '#9db8ff', 'center', 34); });
    var fx = (xs[nr - 1] + xs[nr]) / 2; g.strokeStyle = ok ? '#8be8ae' : '#9db8ff'; g.lineWidth = 6; g.beginPath(); g.moveTo(fx - 30, 150); g.lineTo(fx + 20, 150); g.stroke(); g.fillStyle = ok ? '#8be8ae' : '#9db8ff'; g.beginPath(); g.moveTo(fx + 36, 150); g.lineTo(fx + 16, 136); g.lineTo(fx + 16, 164); g.fill();
    // libro de átomos
    var L = conteo(e, 'r'), R = conteo(e, 'p'), els = []; Object.keys(L).concat(Object.keys(R)).forEach(function (x) { if (els.indexOf(x) < 0) els.push(x); });
    var bx = 140, by = 290; g.fillStyle = 'rgba(5,11,20,.7)'; g.fillRect(bx - 20, by - 26, 700 + 20, 30 + els.length * 40 + 8); txt('Átomos', bx + 60, by - 5, '#cfe6ff', 'left', 16); txt('Antes', bx + 280, by - 5, '#cfe6ff', 'center', 16); txt('Después', bx + 460, by - 5, '#cfe6ff', 'center', 16);
    els.forEach(function (el, i) { var l = L[el] || 0, r = R[el] || 0, y = by + 30 + i * 40, igual = l === r; atom(bx + 20, y - 6, el, 14); txt(el, bx + 60, y, '#fff', 'left', 20); txt(String(l), bx + 280, y, igual ? '#8be8ae' : '#ffb3b3', 'center', 22); txt(String(r), bx + 460, y, igual ? '#8be8ae' : '#ffb3b3', 'center', 22); txt(igual ? '✔' : '✖', bx + 620, y, igual ? '#8be8ae' : '#ffb3b3', 'center', 22); });
    if (rx) { rx.t += dt; var pr = Math.min(1, rx.t / 1.6); for (var q = 0; q < 14; q++) { var sx = 200 + (q % 7) * 80, p0 = pr; g.fillStyle = 'rgba(139,232,174,' + (0.8 * (1 - Math.abs(pr * 2 - 1))) + ')'; g.beginPath(); g.arc(sx + (fx - sx) * p0 + Math.sin(q) * 20, 150 + Math.cos(q * 2) * 40 * (1 - p0), 6, 0, 7); g.fill(); } if (rx.t > 1.8) rx = null; }
    txt(msj || (ok ? '✔ ¡Balanceada! Pulsa «Reaccionar»' : 'Ajusta los coeficientes hasta que «Antes» y «Después» sean iguales'), W / 2, H - 14, ok ? '#8be8ae' : '#ffe08a', 'center', 18);
    requestAnimationFrame(dibujar);
  }
  function reaccionar() { var e = eqActual(); if (!balanceada(e)) { msj = 'Todavía no está balanceada'; tono(200, 0.15, 0.25); setTimeout(function () { msj = ''; }, 1500); return; } rx = { t: 0 }; tono(300, 0.15, 0.5); var key = PASOS[paso].ecs[idx]; hechasEq[key] = 1; msj = '¡Reacción completada!'; setTimeout(function () { msj = ''; var ecs = PASOS[paso].ecs; if (ecs.every(function (k) { return hechasEq[k]; })) cumplir(paso); else if (idx < ecs.length - 1) { idx++; reiniciar(); ctl(); } }, 1900); }
  function reiniciar() { co = especies(eqActual()).map(function () { return 1; }); }
  function ctl() {
    var c = $('ctl'); c.textContent = '';
    function btn(txt, fn, cls) { var b = document.createElement('button'); b.type = 'button'; b.className = cls || 'btn sec'; b.textContent = txt; b.onclick = fn; c.appendChild(b); }
    var e = eqActual(); especies(e).forEach(function (s, i) { btn('− ' + s.f, function () { co[i] = Math.max(1, co[i] - 1); }, 'btn sec'); btn('+ ' + s.f, function () { co[i] = Math.min(9, co[i] + 1); }, 'btn'); });
    btn('⚗️ Reaccionar', reaccionar, 'btn grande'); btn('🔄 Reiniciar', function () { reiniciar(); }, 'btn sec');
  }
  function pintar() {
    var p = $('pasos'); p.textContent = '';
    PASOS.forEach(function (Q, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === paso)); b.innerHTML = '<b>' + (hecho[i] ? '✓' : i + 1) + '</b>' + Q.n; b.onclick = function () { ir(i); }; p.appendChild(b); });
    var Q = PASOS[paso]; $('tit').textContent = Q.t; $('txt').innerHTML = Q.x; $('misTxt').textContent = hecho[paso] ? '¡Muy bien! Misión cumplida ✔' : Q.m; $('dato').textContent = '💡 ' + Q.d;
    $('mis').className = 'mision' + (hecho[paso] ? ' ok' : ''); $('bAnt').disabled = paso === 0; $('bSig').disabled = paso === 2; $('fin').className = 'fin' + (hecho.every(Boolean) ? ' v' : '');
  }
  function ir(n) { paso = n; idx = 0; msj = ''; rx = null; reiniciar(); ctl(); pintar(); }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); }; $('bSig').onclick = function () { if (paso < 2) ir(paso + 1); };
  /* ---------- moléculas 3D (bolas y varillas) en las posiciones del modelo 2D ---------- */
  if (window.Vista3D) {
    V3 = Vista3D({ z: 9, fov: 40, auto: 0, fijo: true }); var T = THREE, K = 0.01424, WX = function (x) { return (x - 480) * K; }, WY = function (y) { return (230 - y) * K; };
    var CE = { H: [0xf4f8ff, 0.15], O: [0xff5a5a, 0.24], N: [0x5a7aff, 0.25], C: [0x8a93a6, 0.26], Na: [0xb07aff, 0.3], Cl: [0x4fd16a, 0.28], Fe: [0xd08a3a, 0.3] }, pool = [];
    function armar(m) {
      var g3 = new T.Group(), at = []; Object.keys(m.a).forEach(function (el) { for (var i = 0; i < m.a[el]; i++) at.push(el); });
      var ci = 0; if (at.length > 2) { var mc = 99; at.forEach(function (el, i) { var c = at.filter(function (x) { return x === el; }).length; if (el !== 'H' && c < mc) { mc = c; ci = i; } }); }
      var pos = []; if (at.length === 1) pos.push([0, 0, 0]); else if (at.length === 2) pos = [[-0.26, 0, 0], [0.26, 0, 0]]; else { var otros = at.length - 1, k = 0; at.forEach(function (el, i) { if (i === ci) pos[i] = [0, 0, 0]; else { var a = k / otros * Math.PI * 2 + 0.6; pos[i] = [Math.cos(a) * 0.48, Math.sin(a) * 0.48, (k % 2 ? 0.2 : -0.2)]; k++; } }); }
      at.forEach(function (el, i) { var c = CE[el] || [0xaaaaaa, 0.25], b = new T.Mesh(new T.SphereGeometry(c[1], 20, 14), V3.mat(c[0], 0x111111)); b.position.set(pos[i][0], pos[i][1], pos[i][2]); g3.add(b); if (at.length > 2 && i !== ci) g3.add(V3.cil(new T.Vector3(0, 0, 0), new T.Vector3(pos[i][0], pos[i][1], pos[i][2]), 0.04, V3.mat(0xcfe6ff, 0x445566))); });
      if (at.length === 2) g3.add(V3.cil(new T.Vector3(pos[0][0], 0, 0), new T.Vector3(pos[1][0], 0, 0), 0.045, V3.mat(0xcfe6ff, 0x445566)));
      return g3;
    }
    V3.anim(function (dt, t) {
      for (var i = 0; i < Math.max(pool.length, MOLS.length); i++) {
        var m = MOLS[i], p = pool[i]; if (!m) { if (p) p.g.visible = false; continue; }
        if (!p || p.f !== m.f) { if (p) V3.grupo.remove(p.g); p = pool[i] = { f: m.f, g: armar(m) }; V3.grupo.add(p.g); }
        p.g.visible = true; p.g.position.set(WX(m.x), WY(m.y), 0); p.g.rotation.y = t * 0.8 + i; p.g.rotation.x = 0.4 * Math.sin(t * 0.9 + i);
      }
    });
  }
  window.__rea = { ir: ir, resolver: function () { co = eqActual().sol.slice(); }, set: function (a) { co = a; }, reaccionar: reaccionar, bal: function () { return balanceada(eqActual()); }, estado: function () { return { hecho: hecho.slice(), idx: idx, hechasEq: Object.keys(hechasEq) }; } };
  reiniciar(); ctl(); pintar(); requestAnimationFrame(dibujar);
})();
