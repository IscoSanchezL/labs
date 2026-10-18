/* Espejos y reflexión (3°, solo español, sin voz): ley de la reflexión y puzles de rayos con uno y dos espejos. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var cv = $('cv'), g = cv.getContext('2d'), W = cv.width, H = cv.height;
  var PASOS = [
    { n: 'La luz rebota', t: '1. La luz rebota en un espejo', x: 'Cuando un rayo de luz llega a un espejo, <b>rebota</b>. La línea punteada se llama <b>normal</b>: el rayo sale con el <b>mismo ángulo</b> con el que llegó. Esa es la <b>ley de la reflexión</b>.', m: 'Gira el rayo hasta 3 ángulos distintos (al menos 15° de diferencia) y compara los ángulos.', d: 'Los espejos de los carros te permiten ver lo que hay detrás gracias a la reflexión.' },
    { n: 'Un espejo', t: '2. Apunta con un espejo', x: 'Si giras el espejo, el rayo reflejado cambia de dirección. Gira el espejo para que el rayo <b>llegue al blanco</b> 🎯.', m: 'Haz llegar el rayo al blanco 3 veces.', d: 'Los periscopios de los submarinos usan espejos para ver por encima del agua.' },
    { n: 'Dos espejos', t: '3. Rebota dos veces', x: 'Con <b>dos espejos</b> puedes llevar la luz a lugares escondidos. Gira los dos para que el rayo rebote y llegue al blanco.', m: 'Resuelve 2 retos con dos espejos.', d: 'La fibra óptica lleva internet usando luz que rebota millones de veces dentro de un hilo de vidrio.' }
  ];
  var paso = 0, hecho = [false, false, false], tiempo = 0, msj = '';
  var angRayo = 40, angulos1 = [], ang1 = 0, nivel = 0, aciertos2 = 0, aciertos3 = 0, T = null, M = [], sel = 0, golpeo = false, cooldown = 0;
  var ac = null;
  function tono(f, v, d) { try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume(); var o = ac.createOscillator(), gn = ac.createGain(); o.type = 'sine'; o.frequency.value = f; gn.gain.setValueAtTime(v, ac.currentTime); gn.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d); o.connect(gn); gn.connect(ac.destination); o.start(); o.stop(ac.currentTime + d); } catch (e) {} }
  function ex() { tono(660, 0.2, 0.2); setTimeout(function () { tono(880, 0.2, 0.3); }, 130); }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; ex(); if (window.STEMFX) STEMFX.exito(); pintar(); }
  var SRC = { x: 90, y: 380 };
  function seg(m) { var a = m.a * Math.PI / 180, dx = Math.cos(a) * m.len / 2, dy = Math.sin(a) * m.len / 2; return [m.x - dx, m.y - dy, m.x + dx, m.y + dy]; }
  function rayo(o, d, mirrors) {
    var pts = [[o[0], o[1]]], pos = [o[0], o[1]], dir = [d[0], d[1]];
    for (var b = 0; b < 6; b++) {
      var best = null, bi = -1;
      mirrors.forEach(function (m, i) { var s = seg(m), x1 = s[0], y1 = s[1], x2 = s[2], y2 = s[3], sx = x2 - x1, sy = y2 - y1, den = dir[0] * sy - dir[1] * sx; if (Math.abs(den) < 1e-9) return; var t = ((x1 - pos[0]) * sy - (y1 - pos[1]) * sx) / den, u = ((x1 - pos[0]) * dir[1] - (y1 - pos[1]) * dir[0]) / den; if (t > 0.5 && u >= 0 && u <= 1 && (!best || t < best)) { best = t; bi = i; } });
      // pared
      var tw = 1e9; if (dir[0] > 0) tw = Math.min(tw, (W - pos[0]) / dir[0]); if (dir[0] < 0) tw = Math.min(tw, (0 - pos[0]) / dir[0]); if (dir[1] > 0) tw = Math.min(tw, (H - pos[1]) / dir[1]); if (dir[1] < 0) tw = Math.min(tw, (0 - pos[1]) / dir[1]);
      if (best === null || best > tw) { pts.push([pos[0] + dir[0] * tw, pos[1] + dir[1] * tw]); break; }
      var hit = [pos[0] + dir[0] * best, pos[1] + dir[1] * best]; pts.push(hit);
      var s2 = seg(mirrors[bi]), tx = s2[2] - s2[0], ty = s2[3] - s2[1], tl = Math.hypot(tx, ty), nx = -ty / tl, ny = tx / tl, dn = dir[0] * nx + dir[1] * ny;
      dir = [dir[0] - 2 * dn * nx, dir[1] - 2 * dn * ny]; pos = hit;
    }
    return pts;
  }
  function distSeg(p, a, b) { var vx = b[0] - a[0], vy = b[1] - a[1], t = Math.max(0, Math.min(1, ((p[0] - a[0]) * vx + (p[1] - a[1]) * vy) / (vx * vx + vy * vy || 1))); return Math.hypot(p[0] - (a[0] + vx * t), p[1] - (a[1] + vy * t)); }
  function nuevoNivel() {
    msj = '';
    if (paso === 1) { var mx = 480, my = 380, ty = 70 + Math.random() * 230, tx = 560 + Math.random() * 330; T = [tx, ty]; M = [{ x: mx, y: my, a: 0, len: 110 }]; }
    if (paso === 2) { var cfg = [[[330, 380], [760, 110], [800, 380]], [[420, 380], [640, 160], [180, 120]], [[300, 380], [820, 250], [380, 90]]][nivel % 3]; M = [{ x: cfg[0][0], y: cfg[0][1], a: 10, len: 100 }, { x: cfg[1][0], y: cfg[1][1], a: -20, len: 100 }]; T = cfg[2]; sel = 0; }
  }
  function direcc() { var a = (paso === 0 ? -angRayo : 0) * Math.PI / 180; return [Math.cos(a), Math.sin(a)]; }
  function simular() {
    var o = paso === 0 ? [150, 100] : [SRC.x, SRC.y], d, mir;
    if (paso === 0) { var ar = angRayo * Math.PI / 180; d = [Math.cos(ar), Math.sin(ar)]; mir = [{ x: 480, y: 380, a: 0, len: 520 }]; o = [480 - Math.cos(ar) * 340, 380 - Math.sin(ar) * 340]; }
    else { d = [1, 0]; mir = M; }
    return { pts: rayo(o, d, mir), mir: mir };
  }
  function dibujar(ms) {
    var dt = Math.min(0.05, (ms - (dibujar.l || ms)) / 1000); dibujar.l = ms; tiempo += dt; cooldown = Math.max(0, cooldown - dt);
    var bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0a1424'); bg.addColorStop(1, '#03060d'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.strokeStyle = 'rgba(127,240,228,.05)'; for (var x = 0; x < W; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (var y = 0; y < H; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    var r = simular(), pts = r.pts;
    // rayo
    g.save(); g.strokeStyle = '#ffe08a'; g.lineWidth = 4; g.lineJoin = 'round'; g.shadowColor = '#ffd95e'; g.shadowBlur = 16; g.beginPath(); pts.forEach(function (p, i) { if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); }); g.stroke(); g.restore();
    // espejos
    r.mir.forEach(function (m, i) { var s = seg(m); g.strokeStyle = '#7ff0e4'; g.lineWidth = 10; g.lineCap = 'round'; g.shadowColor = sel === i && paso === 2 ? '#fff' : '#7ff0e4'; g.shadowBlur = sel === i && paso === 2 ? 22 : 10; g.beginPath(); g.moveTo(s[0], s[1]); g.lineTo(s[2], s[3]); g.stroke(); g.shadowBlur = 0; g.strokeStyle = 'rgba(15,32,56,.8)'; g.lineWidth = 3; g.beginPath(); g.moveTo(s[0], s[1]); g.lineTo(s[2], s[3]); g.stroke(); });
    if (paso === 0) {
      var ar = angRayo * Math.PI / 180, hx = 480, hy = 380; g.setLineDash([6, 6]); g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 2; g.beginPath(); g.moveTo(hx, hy); g.lineTo(hx, hy - 260); g.stroke(); g.setLineDash([]);
      var arc = function (a0, a1, col, lbl) { g.strokeStyle = col; g.lineWidth = 3; g.beginPath(); g.arc(hx, hy, 80, a0, a1); g.stroke(); };
      var ang90 = Math.PI / 2; var ai = ang90 - ar; // ángulo con la normal
      g.strokeStyle = '#ff9f9f'; g.lineWidth = 3; g.beginPath(); g.arc(hx, hy, 90, -ang90 - ai, -ang90); g.stroke(); g.strokeStyle = '#8be8ae'; g.beginPath(); g.arc(hx, hy, 70, -ang90, -ang90 + ai); g.stroke();
      g.fillStyle = '#ff9f9f'; g.font = '700 18px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'center'; g.fillText('i = ' + Math.round(ai * 180 / Math.PI) + '°', hx - 90, hy - 110); g.fillStyle = '#8be8ae'; g.fillText('r = ' + Math.round(ai * 180 / Math.PI) + '°', hx + 90, hy - 110); g.fillStyle = '#cfe6ff'; g.fillText('normal', hx + 38, hy - 250);
      g.font = '40px system-ui'; g.fillStyle = '#000'; g.fillText('🔦', pts[0][0], pts[0][1]); g.fillStyle = '#cfe6ff'; g.font = '700 18px "Space Grotesk",system-ui,sans-serif'; g.fillText('Ángulo de llegada = ángulo de salida', W / 2, 36);
    } else {
      g.font = '40px system-ui'; g.fillStyle = '#000'; g.textAlign = 'center'; g.fillText('🔦', SRC.x - 20, SRC.y + 12);
      var hitT = false; for (var i = 1; i < pts.length; i++) if (distSeg(T, pts[i - 1], pts[i]) < 24) { hitT = true; if (i === 1 && r.mir.length) { } }
      // el rayo debe llegar al blanco DESPUÉS de rebotar (no directamente)
      var dir0 = distSeg(T, pts[0], pts[1]) < 24 && pts.length > 2 ? false : hitT;
      golpeo = dir0;
      var pulso = 24 + Math.sin(tiempo * 5) * 3; g.strokeStyle = dir0 ? '#8be8ae' : '#ff6b6b'; g.lineWidth = 5; g.beginPath(); g.arc(T[0], T[1], pulso, 0, 7); g.stroke(); g.beginPath(); g.arc(T[0], T[1], pulso * 0.5, 0, 7); g.stroke(); g.fillStyle = dir0 ? '#8be8ae' : '#ff6b6b'; g.beginPath(); g.arc(T[0], T[1], 6, 0, 7); g.fill();
      if (dir0 && cooldown === 0) { cooldown = 1.4; tono(780, 0.15, 0.3); if (paso === 1) { aciertos2++; msj = '¡Blanco! (' + aciertos2 + ' de 3)'; if (aciertos2 >= 3) cumplir(1); else setTimeout(function () { nuevoNivel(); }, 1100); } else { aciertos3++; msj = '¡Blanco! (' + aciertos3 + ' de 2)'; nivel++; if (aciertos3 >= 2) cumplir(2); else setTimeout(function () { nuevoNivel(); }, 1100); } }
      g.fillStyle = '#cfe6ff'; g.font = '700 20px "Space Grotesk",system-ui,sans-serif'; g.fillText(msj || (paso === 1 ? 'Gira el espejo para llegar al blanco 🎯' : 'Gira los dos espejos (elige cuál con los botones)'), W / 2, 36);
    }
    requestAnimationFrame(dibujar);
  }
  function ctl() {
    var c = $('ctl'); c.textContent = '';
    function rango(etq, min, max, step, val, fn) { var l = document.createElement('label'); l.className = 'rango'; l.innerHTML = etq + ' <input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" aria-label="' + etq + '">'; l.querySelector('input').oninput = function (e) { fn(Number(e.target.value)); }; c.appendChild(l); }
    function btn(txt, fn, cls, pr) { var b = document.createElement('button'); b.type = 'button'; b.className = cls || 'btn sec'; b.textContent = txt; b.onclick = fn; if (pr !== undefined) b.setAttribute('aria-pressed', String(pr)); c.appendChild(b); }
    if (paso === 0) rango('🔦 Ángulo del rayo', 15, 75, 1, angRayo, function (v) { angRayo = v; if (angulos1.every(function (a) { return Math.abs(a - v) >= 15; })) { angulos1.push(v); if (angulos1.length >= 3) cumplir(0); } });
    if (paso === 1) rango('🪞 Gira el espejo', -80, 80, 1, M[0] ? M[0].a : 0, function (v) { M[0].a = v; });
    if (paso === 2) { btn('🪞 Espejo 1', function () { sel = 0; ctl(); }, 'tab', sel === 0); btn('🪞 Espejo 2', function () { sel = 1; ctl(); }, 'tab', sel === 1); rango('↻ Gira el espejo elegido', -80, 80, 1, M[sel] ? M[sel].a : 0, function (v) { M[sel].a = v; }); btn('🔄 Otro reto', function () { nivel++; nuevoNivel(); ctl(); }, 'btn sec'); }
  }
  function pintar() {
    var p = $('pasos'); p.textContent = '';
    PASOS.forEach(function (Q, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === paso)); b.innerHTML = '<b>' + (hecho[i] ? '✓' : i + 1) + '</b>' + Q.n; b.onclick = function () { ir(i); }; p.appendChild(b); });
    var Q = PASOS[paso]; $('tit').textContent = Q.t; $('txt').innerHTML = Q.x; $('misTxt').textContent = hecho[paso] ? '¡Muy bien! Misión cumplida ✔' : Q.m; $('dato').textContent = '💡 ' + Q.d;
    $('mis').className = 'mision' + (hecho[paso] ? ' ok' : ''); $('bAnt').disabled = paso === 0; $('bSig').disabled = paso === 2; $('fin').className = 'fin' + (hecho.every(Boolean) ? ' v' : '');
  }
  function ir(n) { paso = n; msj = ''; cooldown = 0; if (n === 0) angulos1 = [angRayo]; if (n === 1) aciertos2 = 0; if (n === 2) { aciertos3 = 0; nivel = 0; } nuevoNivel(); ctl(); pintar(); }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); }; $('bSig').onclick = function () { if (paso < 2) ir(paso + 1); };
  /* ayuda de pruebas: ángulo(s) de espejo que resuelven el reto actual */
  function resolver() {
    function ang(n) { var a = Math.atan2(n[1], n[0]) * 180 / Math.PI + 90; while (a > 90) a -= 180; while (a <= -90) a += 180; return a; }
    if (paso === 1) { var m = M[0], u = [T[0] - m.x, T[1] - m.y], l = Math.hypot(u[0], u[1]); u = [u[0] / l, u[1] / l]; m.a = ang([u[0] - 1, u[1] - 0]); }
    if (paso === 2) { var m1 = M[0], m2 = M[1]; var u1 = [m2.x - m1.x, m2.y - m1.y], l1 = Math.hypot(u1[0], u1[1]); u1 = [u1[0] / l1, u1[1] / l1]; m1.a = ang([u1[0] - 1, u1[1]]); var u2 = [T[0] - m2.x, T[1] - m2.y], l2 = Math.hypot(u2[0], u2[1]); u2 = [u2[0] / l2, u2[1] / l2]; m2.a = ang([u2[0] - u1[0], u2[1] - u1[1]]); }
  }
  window.__esp = { ir: ir, ray: function (v) { angRayo = v; if (angulos1.every(function (a) { return Math.abs(a - v) >= 15; })) { angulos1.push(v); if (angulos1.length >= 3) cumplir(0); } }, resolver: resolver, estado: function () { return { hecho: hecho.slice(), a2: aciertos2, a3: aciertos3 }; } };
  angulos1 = [angRayo]; nuevoNivel(); ctl(); pintar(); requestAnimationFrame(dibujar);
})();
