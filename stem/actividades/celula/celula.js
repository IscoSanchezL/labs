/* La célula (4°, solo español, sin voz): explorar orgánulos, funciones y diferencias entre célula animal y vegetal. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var cv = $('cv'), g = cv.getContext('2d'), W = cv.width, H = cv.height;
  var INFO = {
    nucleo: { n: 'Núcleo', f: 'Es el centro de control: guarda el ADN con las instrucciones de la célula.', c: '#c9a8ff' },
    mito: { n: 'Mitocondria', f: 'Produce la energía que la célula necesita para vivir. Es su «central eléctrica».', c: '#ff9f7a' },
    ribo: { n: 'Ribosomas', f: 'Fabrican las proteínas siguiendo las instrucciones del ADN.', c: '#ffe08a' },
    golgi: { n: 'Aparato de Golgi', f: 'Empaqueta y envía las sustancias que la célula fabrica. Es como una oficina de correos.', c: '#7ff0e4' },
    liso: { n: 'Lisosoma', f: 'Digiere lo que sobra o está dañado. Es el «sistema de limpieza» de la célula.', c: '#ff7aa8' },
    memb: { n: 'Membrana celular', f: 'Rodea la célula y decide qué entra y qué sale.', c: '#9db8ff' },
    pared: { n: 'Pared celular', f: 'Cubierta rígida de las células vegetales: da forma y protege. Las células animales no la tienen.', c: '#8be8ae' },
    cloro: { n: 'Cloroplasto', f: 'Hace la fotosíntesis: usa la luz del sol para fabricar alimento. Solo está en células vegetales.', c: '#6fe38a' },
    vacu: { n: 'Vacuola central', f: 'Gran bolsa de agua de las células vegetales: almacena y mantiene la célula firme.', c: '#8cc5ff' }
  };
  var PASOS = [
    { n: 'Explorar', t: '1. Viaje al interior de la célula', x: 'La <b>célula</b> es la unidad más pequeña de un ser vivo. Dentro tiene partes llamadas <b>orgánulos</b>, y cada una cumple una función. Toca cada parte para descubrirla.', m: 'Toca 6 partes distintas de la célula animal.', d: 'Tu cuerpo tiene unos 30 billones de células.' },
    { n: 'Reto de funciones', t: '2. ¿Quién hace qué?', x: 'Ahora te toca a ti: leerás una función y tendrás que <b>tocar el orgánulo</b> que la realiza en la célula.', m: 'Acierta 5 funciones.', d: 'Si fallas, el juego te dice cuál era y puedes seguir.' },
    { n: 'Animal y vegetal', t: '3. ¿En qué se diferencian?', x: 'La célula <b>vegetal</b> tiene tres cosas que la animal no: <b>pared celular</b>, <b>cloroplastos</b> y una gran <b>vacuola</b>. Cambia de célula y encuéntralas.', m: 'En la célula vegetal, toca la pared celular, un cloroplasto y la vacuola central.', d: 'Los cloroplastos son verdes por la clorofila, el pigmento que atrapa la luz.' }
  ];
  var paso = 0, hecho = [false, false, false], tipo = 'animal';
  var tocados = {}, quiz = { orden: [], i: 0, ok: 0, msj: '' }, tocados3 = {}, sel = null, tiempo = 0, hover = null;
  var ac = null;
  function tono(f, v, d) { try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume(); var o = ac.createOscillator(), gn = ac.createGain(); o.type = 'sine'; o.frequency.value = f; gn.gain.setValueAtTime(v, ac.currentTime); gn.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d); o.connect(gn); gn.connect(ac.destination); o.start(); o.stop(ac.currentTime + d); } catch (e) {} }
  function ex() { tono(660, 0.2, 0.2); setTimeout(function () { tono(880, 0.2, 0.3); }, 130); }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; ex(); pintar(); }
  var ESC = 0.84, TX = 480 * (1 - 0.84), TY = 4;
  var rs = []; for (var i = 0; i < 26; i++) rs.push([Math.cos(i * 2.4) * (70 + (i % 5) * 9), Math.sin(i * 2.4) * (62 + (i % 4) * 8)]);
  function piezas() {
    if (tipo === 'animal') return [
      { k: 'nucleo', x: 480, y: 232, rx: 74, ry: 66 }, { k: 'mito', x: 320, y: 170, rx: 50, ry: 26, r: -0.4 }, { k: 'mito', x: 660, y: 310, rx: 50, ry: 26, r: 0.5 }, { k: 'golgi', x: 650, y: 165, rx: 48, ry: 34 },
      { k: 'liso', x: 330, y: 318, rx: 20, ry: 20 }, { k: 'liso', x: 570, y: 356, rx: 17, ry: 17 }, { k: 'ribo', x: 480, y: 232, rx: 128, ry: 112, anillo: true }
    ];
    return [
      { k: 'vacu', x: 520, y: 238, rx: 190, ry: 112 }, { k: 'nucleo', x: 255, y: 160, rx: 50, ry: 44 }, { k: 'cloro', x: 270, y: 300, rx: 46, ry: 24, r: 0.3 }, { k: 'cloro', x: 520, y: 105, rx: 46, ry: 24 }, { k: 'cloro', x: 760, y: 300, rx: 46, ry: 24, r: -0.3 },
      { k: 'mito', x: 780, y: 160, rx: 38, ry: 20, r: 0.5 }, { k: 'mito', x: 520, y: 382, rx: 38, ry: 20 }, { k: 'pared', x: 480, y: 232, rx: 380, ry: 190, borde: true }
    ];
  }
  function blob(cx, cy, rx, ry, w) { g.beginPath(); for (var a = 0; a <= 6.30; a += 0.1) { var f = 1 + 0.03 * Math.sin(a * 5 + w); var x = cx + Math.cos(a) * rx * f, y = cy + Math.sin(a) * ry * f; if (a === 0) g.moveTo(x, y); else g.lineTo(x, y); } g.closePath(); }
  function elip(p, fill, stroke, glow) { g.save(); g.translate(p.x, p.y); g.rotate(p.r || 0); g.beginPath(); g.ellipse(0, 0, p.rx, p.ry, 0, 0, 7); if (glow) { g.shadowColor = glow; g.shadowBlur = 24; } g.fillStyle = fill; g.fill(); if (stroke) { g.lineWidth = 3; g.strokeStyle = stroke; g.stroke(); } g.restore(); }
  function resalte(p) { return sel === p || hover === p; }
  function dibujarPieza(p) {
    var inf = INFO[p.k], res = resalte(p), gl = res ? inf.c : null, fl = p.y + Math.sin(tiempo + p.x) * 2.5;
    var q = { x: p.x, y: fl, rx: p.rx, ry: p.ry, r: p.r };
    if (p.k === 'nucleo') { var gr = g.createRadialGradient(p.x - 20, fl - 20, 6, p.x, fl, p.rx); gr.addColorStop(0, '#d9c4ff'); gr.addColorStop(1, '#7b5bd6'); elip(q, gr, '#e9ddff', gl); g.fillStyle = '#4b2fa0'; g.beginPath(); g.arc(p.x + 6, fl + 4, p.rx * 0.32, 0, 7); g.fill(); }
    else if (p.k === 'mito') { var gm = g.createLinearGradient(-p.rx, 0, p.rx, 0); gm.addColorStop(0, '#ff8a5c'); gm.addColorStop(1, '#ffb894'); elip(q, gm, '#ffd9c4', gl); g.save(); g.translate(p.x, fl); g.rotate(p.r || 0); g.strokeStyle = 'rgba(160,50,20,.8)'; g.lineWidth = 3; g.beginPath(); for (var i = -3; i <= 3; i++) { g.moveTo(i * 12, -p.ry + 7); g.quadraticCurveTo(i * 12 + 6, 0, i * 12, p.ry - 7); } g.stroke(); g.restore(); }
    else if (p.k === 'cloro') { var gc = g.createLinearGradient(0, -p.ry, 0, p.ry); gc.addColorStop(0, '#9bf0a8'); gc.addColorStop(1, '#2fa150'); elip(q, gc, '#d8ffe0', gl); g.save(); g.translate(p.x, fl); g.rotate(p.r || 0); g.fillStyle = 'rgba(10,80,30,.55)'; for (var j = -2; j <= 2; j++) g.fillRect(j * 14 - 4, -9, 8, 18); g.restore(); }
    else if (p.k === 'golgi') { g.save(); g.translate(p.x, fl); g.lineCap = 'round'; for (var s = 0; s < 5; s++) { g.strokeStyle = res ? '#fff' : 'rgba(127,240,228,' + (0.95 - s * 0.12) + ')'; if (res) { g.shadowColor = inf.c; g.shadowBlur = 20; } g.lineWidth = 8; g.beginPath(); g.arc(0, 0, 14 + s * 9, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); } g.restore(); }
    else if (p.k === 'liso') { var gl2 = g.createRadialGradient(p.x - 5, fl - 5, 2, p.x, fl, p.rx); gl2.addColorStop(0, '#ffb0c8'); gl2.addColorStop(1, '#d63a73'); elip(q, gl2, '#ffd0de', gl); g.fillStyle = 'rgba(255,255,255,.7)'; for (var d = 0; d < 4; d++) { g.beginPath(); g.arc(p.x + Math.cos(d * 1.6) * 7, fl + Math.sin(d * 1.6) * 7, 2, 0, 7); g.fill(); } }
    else if (p.k === 'vacu') { var gv = g.createRadialGradient(p.x - 40, fl - 30, 10, p.x, fl, p.rx); gv.addColorStop(0, 'rgba(190,225,255,.55)'); gv.addColorStop(1, 'rgba(70,130,210,.45)'); elip(q, gv, 'rgba(210,235,255,.9)', gl); }
    else if (p.k === 'ribo') { g.fillStyle = res ? '#fff' : '#ffe08a'; if (res) { g.shadowColor = inf.c; g.shadowBlur = 14; } rs.forEach(function (r) { g.beginPath(); g.arc(p.x + r[0] * 1.5, p.y + r[1] * 1.3 + Math.sin(tiempo * 1.5 + r[0]) * 2, 3.4, 0, 7); g.fill(); }); g.shadowBlur = 0; }
  }
  function dibujarFondo() {
    var bg = g.createRadialGradient(480, 230, 40, 480, 230, 560); bg.addColorStop(0, '#13263f'); bg.addColorStop(1, '#050b14'); g.fillStyle = bg; g.fillRect(-200, -100, W + 400, H + 200);
    for (var i = 0; i < 40; i++) { var x = (i * 173 + tiempo * 8 * ((i % 3) + 1)) % W, y = (i * 97 + Math.sin(tiempo + i) * 14) % H; g.fillStyle = 'rgba(160,210,255,.12)'; g.beginPath(); g.arc(x, y, 2 + (i % 4), 0, 7); g.fill(); }
    if (tipo === 'animal') { var gr = g.createRadialGradient(480, 230, 20, 480, 230, 320); gr.addColorStop(0, 'rgba(120,190,255,.28)'); gr.addColorStop(1, 'rgba(90,150,230,.16)'); blob(480, 232, 330, 200, tiempo); g.fillStyle = gr; g.fill(); g.lineWidth = hover && hover.k === 'memb' || sel && sel.k === 'memb' ? 8 : 5; g.strokeStyle = '#9db8ff'; g.shadowColor = '#9db8ff'; g.shadowBlur = sel && sel.k === 'memb' ? 24 : 10; g.stroke(); g.shadowBlur = 0; }
    else { g.fillStyle = 'rgba(80,170,110,.18)'; g.beginPath(); g.roundRect ? g.roundRect(100, 42, 760, 380, 36) : g.rect(100, 42, 760, 380); g.fill(); var res = resalte({ k: 'pared' }) || (sel && sel.k === 'pared') || (hover && hover.k === 'pared'); g.lineWidth = res ? 16 : 12; g.strokeStyle = '#8be8ae'; if (res) { g.shadowColor = '#8be8ae'; g.shadowBlur = 24; } g.stroke(); g.shadowBlur = 0; g.lineWidth = 3; g.strokeStyle = '#9db8ff'; g.beginPath(); g.roundRect ? g.roundRect(114, 56, 732, 352, 28) : g.rect(114, 56, 732, 352); g.stroke(); }
  }
  function etiqueta(p) { var inf = INFO[p.k]; g.font = '700 17px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'center'; var w = g.measureText(inf.n).width + 22; var y = p.k === 'pared' ? 30 : p.k === 'ribo' ? p.y + p.ry + 12 : p.y - p.ry - 14; g.fillStyle = 'rgba(5,11,20,.85)'; g.fillRect(p.x - w / 2, y - 20, w, 28); g.fillStyle = inf.c; g.fillText(inf.n, p.x, y); }
  function dibujar(ms) {
    var dt = (ms - (dibujar.l || ms)) / 1000; dibujar.l = ms; tiempo += Math.min(dt, 0.05);
    g.fillStyle = '#050b14'; g.fillRect(0, 0, W, H); g.save(); g.translate(TX, TY); g.scale(ESC, ESC); dibujarFondo(); var P = piezas(); P.filter(function (p) { return p.k !== 'pared'; }).forEach(dibujarPieza);
    if (paso === 0 || paso === 2) { var show = sel || hover; if (show) etiqueta(show); }
    g.restore();
    // cuadro inferior
    g.fillStyle = 'rgba(5,11,20,.78)'; g.fillRect(0, H - 74, W, 74); g.textAlign = 'center';
    var tx = '', col = '#cfe6ff';
    if (paso === 1) { var q = quiz; if (q.i < 5) { tx = '¿Quién? «' + INFO[q.orden[q.i]].f + '»'; col = '#ffe08a'; } else tx = '¡Reto terminado! Aciertos: ' + q.ok + '/5'; if (q.msj) { g.font = '700 18px "Space Grotesk",system-ui,sans-serif'; g.fillStyle = q.msj.indexOf('✔') > -1 ? '#8be8ae' : '#ff9f9f'; g.fillText(q.msj, W / 2, H - 52); } }
    else if (sel) { tx = INFO[sel.k].f; col = '#cfe6ff'; } else tx = paso === 0 ? 'Toca una parte de la célula (' + Object.keys(tocados).length + '/6)' : 'Célula ' + (tipo === 'animal' ? 'ANIMAL' : 'VEGETAL') + ': toca sus partes';
    wrap(tx, W / 2, H - 28, W - 60, col);
    requestAnimationFrame(dibujar);
  }
  function wrap(t, x, y, max, col) { g.font = '600 18px "Space Grotesk",system-ui,sans-serif'; g.fillStyle = col; g.textAlign = 'center'; var ws = t.split(' '), l = '', ls = []; ws.forEach(function (w) { var tt = l ? l + ' ' + w : w; if (g.measureText(tt).width > max) { ls.push(l); l = w; } else l = tt; }); ls.push(l); ls.forEach(function (s, i) { g.fillText(s, x, y - (ls.length - 1) * 11 + i * 22); }); }
  function hit(mx, my) {
    var P = piezas(), res = null;
    P.slice().reverse().forEach(function (p) {
      if (res || p.borde) return;
      var dx = mx - p.x, dy = my - p.y, c = Math.cos(-(p.r || 0)), s = Math.sin(-(p.r || 0)), x = dx * c - dy * s, y = dx * s + dy * c;
      var v = (x * x) / (p.rx * p.rx) + (y * y) / (p.ry * p.ry);
      if (p.anillo) { if (v < 1.1 && v > 0.45 && !(Math.pow(mx - 480, 2) / (74 * 74) + Math.pow(my - 232, 2) / (66 * 66) < 1.1)) res = p; } else if (v <= 1.1) res = p;
    });
    if (!res) {
      if (tipo === 'animal') { var d = Math.pow((mx - 480) / 330, 2) + Math.pow((my - 232) / 200, 2); if (d > 0.82 && d < 1.2) res = { k: 'memb', x: 480, y: 232 + 200, rx: 0, ry: 0 }; }
      else { var inX = mx > 114 && mx < 846, inY = my > 56 && my < 408; if (mx > 96 && mx < 864 && my > 38 && my < 426 && !(inX && inY)) res = { k: 'pared', x: 480, y: 30, rx: 0, ry: 0 }; }
    }
    return res;
  }
  function clic(mx, my) {
    var p = hit(mx, my); if (!p) { sel = null; return; }
    if (paso === 1) { if (quiz.i >= 5) return; var ok = p.k === quiz.orden[quiz.i]; quiz.msj = ok ? '✔ ¡Correcto! Es ' + INFO[p.k].n : '✖ Era ' + INFO[quiz.orden[quiz.i]].n + ' (tocaste ' + INFO[p.k].n + ')'; if (ok) { quiz.ok++; tono(740, 0.12, 0.15); } else tono(200, 0.12, 0.2); quiz.i++; if (quiz.ok >= 5) cumplir(1); if (quiz.i >= 5 && quiz.ok < 5) { quiz.msj += ' · Pulsa «Reintentar»'; ctl(); } return; }
    sel = p; tono(520 + Object.keys(INFO).indexOf(p.k) * 40, 0.1, 0.15);
    if (paso === 0 && tipo === 'animal') { tocados[p.k] = 1; if (Object.keys(tocados).length >= 6) cumplir(0); }
    if (paso === 2 && tipo === 'vegetal') { tocados3[p.k] = 1; if (tocados3.pared && tocados3.cloro && tocados3.vacu) cumplir(2); }
  }
  function xy(e) { var r = cv.getBoundingClientRect(); return [((e.clientX - r.left) * W / r.width - TX) / ESC, ((e.clientY - r.top) * H / r.height - TY) / ESC]; }
  cv.addEventListener('click', function (e) { var q = xy(e); clic(q[0], q[1]); });
  cv.addEventListener('mousemove', function (e) { var q = xy(e); hover = hit(q[0], q[1]); cv.style.cursor = hover ? 'pointer' : 'default'; });
  function nuevoQuiz() { var ks = ['nucleo', 'mito', 'ribo', 'golgi', 'liso', 'memb']; for (var i = ks.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = ks[i]; ks[i] = ks[j]; ks[j] = t; } quiz = { orden: ks.slice(0, 5), i: 0, ok: 0, msj: '' }; }
  function ctl() {
    var c = $('ctl'); c.textContent = '';
    function btn(txt, fn, cls, pr) { var b = document.createElement('button'); b.type = 'button'; b.className = cls || 'btn sec'; b.textContent = txt; b.onclick = fn; if (pr !== undefined) b.setAttribute('aria-pressed', String(pr)); c.appendChild(b); }
    if (paso === 2) { btn('🐾 Célula animal', function () { tipo = 'animal'; sel = null; ctl(); }, 'tab', tipo === 'animal'); btn('🌿 Célula vegetal', function () { tipo = 'vegetal'; sel = null; ctl(); }, 'tab', tipo === 'vegetal'); }
    if (paso === 1) btn('🔄 Reintentar', function () { nuevoQuiz(); }, 'btn');
    if (paso === 0) btn('🌿 Ver célula vegetal', function () { tipo = tipo === 'animal' ? 'vegetal' : 'animal'; sel = null; ctl(); }, 'btn sec');
    if (paso === 0) c.lastChild.textContent = tipo === 'animal' ? '🌿 Ver célula vegetal' : '🐾 Ver célula animal';
  }
  function pintar() {
    var p = $('pasos'); p.textContent = '';
    PASOS.forEach(function (P, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === paso)); b.innerHTML = '<b>' + (hecho[i] ? '✓' : i + 1) + '</b>' + P.n; b.onclick = function () { ir(i); }; p.appendChild(b); });
    var P = PASOS[paso]; $('tit').textContent = P.t; $('txt').innerHTML = P.x; $('misTxt').textContent = hecho[paso] ? '¡Muy bien! Misión cumplida ✔' : P.m; $('dato').textContent = '💡 ' + P.d;
    $('mis').className = 'mision' + (hecho[paso] ? ' ok' : ''); $('bAnt').disabled = paso === 0; $('bSig').disabled = paso === 2; $('fin').className = 'fin' + (hecho.every(Boolean) ? ' v' : '');
  }
  function ir(n) { paso = n; sel = null; tipo = n === 2 ? 'vegetal' : 'animal'; if (n === 1) nuevoQuiz(); ctl(); pintar(); }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); }; $('bSig').onclick = function () { if (paso < 2) ir(paso + 1); };
  window.__celula = { ir: ir, clic: clic, piezas: piezas, respuesta: function () { return quiz.orden[quiz.i]; }, estado: function () { return { hecho: hecho.slice() }; } };
  ctl(); pintar(); requestAnimationFrame(dibujar);
})();
