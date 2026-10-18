/* Cadenas alimentarias (3°, solo español, sin voz): ordenar cadenas, roles en el ecosistema y qué pasa si falta una especie. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var cv = $('cv'), g = cv.getContext('2d'), W = cv.width, H = cv.height;
  var PASOS = [
    { n: 'Ordena la cadena', t: '1. ¿Quién se come a quién?', x: 'En una <b>cadena alimentaria</b> la energía pasa de un ser vivo a otro. Empieza con una <b>planta</b> (que fabrica su alimento con el sol) y sigue con animales que se comen unos a otros.', m: 'Ordena 2 cadenas, de la planta hasta el cazador final.', d: 'Las flechas van hacia quien come, porque muestran hacia dónde viaja la energía.' },
    { n: 'Productores y consumidores', t: '2. Cada uno tiene su oficio', x: 'Los <b>productores</b> (plantas) fabrican su alimento. Los <b>consumidores</b> (animales) se alimentan de otros seres vivos. Los <b>descomponedores</b> (hongos, lombrices) transforman lo que muere en abono.', m: 'Clasifica 5 seres vivos: acierta al menos 4.', d: 'Sin descomponedores, el suelo se llenaría de hojas y animales muertos.' },
    { n: 'Equilibrio', t: '3. Si falta uno, todos lo notan', x: 'En un ecosistema todo está conectado. Si quitas una especie, las demás cambian: algunas se multiplican y otras se quedan sin alimento. Quita una especie y mira la gráfica.', m: 'Quita el pasto, los conejos y los zorros (uno a la vez, reiniciando entre pruebas) y observa qué pasa.', d: 'Cuando desaparecieron los lobos de Yellowstone, los ciervos aumentaron y cambió hasta el curso de los ríos.' }
  ];
  var CADENAS = [[['🌱', 'Pasto'], ['🦗', 'Saltamontes'], ['🐸', 'Rana'], ['🐍', 'Serpiente']], [['🌿', 'Alga'], ['🦐', 'Camarón'], ['🐟', 'Pez'], ['🦈', 'Tiburón']]];
  var ROLES = [['🌳 Árbol', 0], ['🐄 Vaca', 1], ['🦁 León', 1], ['🍄 Hongo', 2], ['🌻 Girasol', 0], ['🪱 Lombriz', 2], ['🐇 Conejo', 1], ['🌾 Trigo', 0]];
  var paso = 0, hecho = [false, false, false], tiempo = 0, msj = '';
  var cadena = 0, hechas = 0, orden = [], col = 0, sacudir = -1, sacT = 0;
  var rondas = [], ronda = 0, aciertos = 0, msj2 = '';
  var pop = { p: 120, c: 40, f: 8 }, hist = [], quitados = {}, quitadoAhora = null, tsim = 0, nota = '';
  var ac = null;
  function tono(f, v, d) { try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume(); var o = ac.createOscillator(), gn = ac.createGain(); o.type = 'sine'; o.frequency.value = f; gn.gain.setValueAtTime(v, ac.currentTime); gn.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d); o.connect(gn); gn.connect(ac.destination); o.start(); o.stop(ac.currentTime + d); } catch (e) {} }
  function ex() { tono(660, 0.2, 0.2); setTimeout(function () { tono(880, 0.2, 0.3); }, 130); }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; ex(); if (window.STEMFX) STEMFX.exito(); pintar(); }
  function mezclar(a) { return a.slice().sort(function () { return Math.random() - 0.5; }); }
  function emoji(e, x, y, s) { g.font = s + 'px system-ui'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#000'; g.fillText(e, x, y); }
  function fondo() { var gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#0e2f2a'); gr.addColorStop(1, '#071714'); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
  function nuevaCadena() { orden = mezclar([0, 1, 2, 3]); col = 0; msj = ''; }
  var POS = [[140, 300], [360, 300], [600, 300], [820, 300]];
  function dib1() {
    fondo(); var C = CADENAS[cadena % 2];
    for (var s = 0; s < 4; s++) { g.strokeStyle = 'rgba(111,227,138,.5)'; g.setLineDash([8, 8]); g.lineWidth = 3; g.strokeRect(70 + s * 220, 70, 140, 140); g.setLineDash([]); g.fillStyle = 'rgba(207,230,255,.7)'; g.font = '700 28px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; if (s >= col) g.fillText(String(s + 1), 140 + s * 220, 150); else { emoji(C[s][0], 140 + s * 220, 128, 74); g.fillStyle = '#fff'; g.font = '700 16px "Space Grotesk",system-ui,sans-serif'; g.textBaseline = 'alphabetic'; g.fillText(C[s][1], 140 + s * 220, 196); } if (s < 3) { g.fillStyle = '#ffe08a'; g.font = '700 36px "Space Grotesk",system-ui,sans-serif'; g.textBaseline = 'alphabetic'; g.fillText('➜', 250 + s * 220, 150); } }
    orden.forEach(function (c, i) { if (c < 0) return; var x = POS[i][0], y = POS[i][1] + 30 + (sacudir === i ? Math.sin(sacT * 40) * 8 : 0); g.fillStyle = '#fff'; g.strokeStyle = '#1b3a30'; g.lineWidth = 4; g.beginPath(); g.roundRect ? g.roundRect(x - 80, y - 80, 160, 160, 20) : g.rect(x - 80, y - 80, 160, 160); g.fill(); g.stroke(); emoji(C[c][0], x, y - 12, 80); g.fillStyle = '#1b3a30'; g.font = '700 20px "Space Grotesk",system-ui,sans-serif'; g.textBaseline = 'alphabetic'; g.fillText(C[c][1], x, y + 62); });
    g.fillStyle = '#cfe6ff'; g.font = '600 18px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.fillText('Cadena ' + Math.min(2, hechas + 1) + ' de 2 · toca en orden: el que produce su alimento va primero', W / 2, 38); if (msj) { g.fillStyle = msj.indexOf('Muy') > -1 ? '#8be8ae' : '#ffb3b3'; g.font = '700 22px "Space Grotesk",system-ui,sans-serif'; g.fillText(msj, W / 2, 448); }
  }
  function dib2() {
    fondo(); g.textAlign = 'center';
    if (ronda < 5) { var it = rondas[ronda]; g.fillStyle = '#fff'; g.font = '700 44px "Space Grotesk",system-ui,sans-serif'; g.fillText(it[0], W / 2, 190); g.fillStyle = '#cfe6ff'; g.font = '600 22px "Space Grotesk",system-ui,sans-serif'; g.fillText('¿Qué papel tiene en el ecosistema?', W / 2, 250); }
    else { g.fillStyle = aciertos >= 4 ? '#8be8ae' : '#ffb3b3'; g.font = '700 36px "Space Grotesk",system-ui,sans-serif'; g.fillText(aciertos >= 4 ? '¡Muy bien! ' + aciertos + ' de 5' : 'Aciertos: ' + aciertos + ' de 5. ¡Inténtalo otra vez!', W / 2, 220); }
    g.fillStyle = msj2.indexOf('✔') > -1 ? '#8be8ae' : '#ff9f9f'; g.font = '700 22px "Space Grotesk",system-ui,sans-serif'; g.fillText(msj2, W / 2, 330); g.fillStyle = '#9db8ff'; g.font = '600 16px "JetBrains Mono",monospace'; g.fillText('Ronda ' + Math.min(5, ronda + 1) + ' de 5', W / 2, 440);
  }
  function stepSim(dt) {
    var P = pop.p, C = pop.c, F = pop.f, r = 0.9, K = 220, a = 0.006, b = 0.45, m = 0.30, c = 0.02, e = 0.5, d = 0.55;
    var dP = r * P * (1 - P / K) - a * P * C, dC = b * a * P * C - m * C - c * C * F, dF = e * c * C * F - d * F;
    pop.p = quitados.p ? 0 : Math.max(0.5, P + dP * dt); pop.c = quitados.c ? 0 : Math.max(0.5, C + dC * dt); pop.f = quitados.f ? 0 : Math.max(0.5, F + dF * dt);
    if (quitados.p) pop.c = Math.max(0, pop.c - dt * 14); if (quitados.c) pop.f = Math.max(0, pop.f - dt * 6); if (quitados.p || quitados.c) { if (!quitados.c && pop.c < 0.6) pop.c = 0.5; }
    pop.p = Math.min(pop.p, 400); pop.c = Math.min(pop.c, 400); pop.f = Math.min(pop.f, 100);
  }
  function dib3() {
    fondo();
    var gx = 330, gy = 70, gw = 590, gh = 300; g.fillStyle = 'rgba(7,23,20,.8)'; g.fillRect(gx - 20, gy - 20, gw + 40, gh + 60); g.strokeStyle = 'rgba(207,230,255,.4)'; g.lineWidth = 2; g.strokeRect(gx, gy, gw, gh);
    [['p', '#6fe38a', 400], ['c', '#ffe08a', 400], ['f', '#ff8a8a', 100]].forEach(function (S) { g.strokeStyle = S[1]; g.lineWidth = 3; g.beginPath(); hist.forEach(function (h, i) { var X = gx + gw * (i / 300), Y = gy + gh - Math.min(1, h[S[0]] / (S[0] === 'f' ? 40 : 260)) * gh; if (i) g.lineTo(X, Y); else g.moveTo(X, Y); }); g.stroke(); });
    g.fillStyle = '#cfe6ff'; g.font = '600 13px "JetBrains Mono",monospace'; g.textAlign = 'left'; g.fillText('población en el tiempo', gx, gy - 6);
    // leyenda y escena
    var items = [['p', '🌱', 'Pasto', '#6fe38a'], ['c', '🐇', 'Conejos', '#ffe08a'], ['f', '🦊', 'Zorros', '#ff8a8a']];
    items.forEach(function (it, i) { var n = Math.round(pop[it[0]]); g.fillStyle = it[3]; g.font = '700 18px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'left'; g.fillText(it[2] + ': ' + n + (quitados[it[0]] ? ' (quitado)' : ''), 70, 120 + i * 110); var cnt = Math.min(7, Math.ceil(pop[it[0]] / (it[0] === 'p' ? 30 : it[0] === 'c' ? 12 : 3))); for (var k = 0; k < cnt; k++) emoji(it[1], 84 + k * 30, 158 + i * 110 + Math.sin(tiempo * 2 + k) * 2, 26); });
    g.fillStyle = '#ffe08a'; g.font = '700 18px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'center'; wrap(nota || 'Elige una especie para quitar y mira cómo cambian las demás.', 625, 420, 560);
  }
  function wrap(t, x, y, max) { var ws = t.split(' '), l = '', ls = []; ws.forEach(function (w) { var tt = l ? l + ' ' + w : w; if (g.measureText(tt).width > max) { ls.push(l); l = w; } else l = tt; }); ls.push(l); ls.forEach(function (s, i) { g.fillText(s, x, y - (ls.length - 1) * 11 + i * 22); }); }
  var last = 0;
  function frame(ms) { var dt = Math.min(0.05, (ms - (last || ms)) / 1000); last = ms; tiempo += dt; sacT += dt; if (sacudir >= 0 && sacT > 0.35) sacudir = -1; if (paso === 2) { tsim += dt; if (tsim > 0.1) { for (var q = 0; q < 2; q++) stepSim(0.5); tsim = 0; hist.push({ p: pop.p, c: pop.c, f: pop.f }); if (hist.length > 300) hist.shift(); } } if (paso === 0) dib1(); else if (paso === 1) dib2(); else dib3(); requestAnimationFrame(frame); }
  function xy(e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; }
  function clic(x, y) {
    if (paso !== 0) return; var C = CADENAS[cadena % 2];
    for (var i = 0; i < 4; i++) { var c = orden[i]; if (c < 0) continue; if (Math.abs(x - POS[i][0]) < 80 && Math.abs(y - (POS[i][1] + 30)) < 80) { if (c === col) { orden[i] = -1; col++; tono(560 + col * 80, 0.12, 0.15); msj = ''; if (col === 4) { hechas++; msj = '¡Muy bien! ' + C[0][1] + ' → ' + C[1][1] + ' → ' + C[2][1] + ' → ' + C[3][1]; if (hechas >= 2) cumplir(0); else setTimeout(function () { cadena++; nuevaCadena(); }, 1500); } } else { sacudir = i; sacT = 0; tono(200, 0.15, 0.25); msj = 'Todavía no: ¿quién produce su alimento?'; } return; } }
  }
  cv.addEventListener('click', function (e) { var q = xy(e); clic(q[0], q[1]); });
  function resp(v) { if (ronda >= 5) return; var it = rondas[ronda]; if (it[1] === v) { aciertos++; msj2 = '✔ ¡Correcto!'; tono(740, 0.12, 0.15); } else { msj2 = '✖ Era ' + ['productor', 'consumidor', 'descomponedor'][it[1]]; tono(200, 0.12, 0.2); } ronda++; if (ronda >= 5 && aciertos >= 4) cumplir(1); ctl(); }
  function nuevoQuiz() { rondas = mezclar(ROLES).slice(0, 5); ronda = 0; aciertos = 0; msj2 = ''; }
  function quitar(k) {
    if (quitados[k] || Object.keys(quitados).length >= 1) return; quitados[k] = 1; quitadoAhora = k; tono(300, 0.15, 0.3);
    nota = { p: 'Sin pasto, los conejos se quedan sin comida y desaparecen; luego los zorros también.', c: 'Sin conejos, el pasto crece sin control y los zorros se quedan sin comida.', f: 'Sin zorros, los conejos se multiplican, se comen el pasto y después faltará comida para ellos.' }[k];
    seen[k] = 1; if (seen.p && seen.c && seen.f) cumplir(2); ctl();
  }
  var seen = {};
  function reiniciarPop() { pop = { p: 120, c: 40, f: 8 }; hist = []; quitados = {}; quitadoAhora = null; nota = ''; }
  function ctl() {
    var c = $('ctl'); c.textContent = '';
    function btn(txt, fn, cls, dis) { var b = document.createElement('button'); b.type = 'button'; b.className = cls || 'btn sec'; b.textContent = txt; b.onclick = fn; if (dis) b.disabled = true; c.appendChild(b); }
    if (paso === 1) { btn('🌱 Productor', function () { resp(0); }, 'btn grande'); btn('🐾 Consumidor', function () { resp(1); }, 'btn grande'); btn('🍄 Descomponedor', function () { resp(2); }, 'btn grande'); if (ronda >= 5 && aciertos < 4) btn('🔄 Reintentar', function () { nuevoQuiz(); ctl(); }, 'btn'); }
    if (paso === 2) { var hay = Object.keys(quitados).length > 0; btn((seen.p ? '✓ ' : '') + '🚫 Quitar el pasto', function () { quitar('p'); }, 'btn sec', hay); btn((seen.c ? '✓ ' : '') + '🚫 Quitar los conejos', function () { quitar('c'); }, 'btn sec', hay); btn((seen.f ? '✓ ' : '') + '🚫 Quitar los zorros', function () { quitar('f'); }, 'btn sec', hay); btn('🔄 Reiniciar ecosistema', function () { reiniciarPop(); ctl(); }, 'btn'); }
  }
  function pintar() {
    var p = $('pasos'); p.textContent = '';
    PASOS.forEach(function (Q, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === paso)); b.innerHTML = '<b>' + (hecho[i] ? '✓' : i + 1) + '</b>' + Q.n; b.onclick = function () { ir(i); }; p.appendChild(b); });
    var Q = PASOS[paso]; $('tit').textContent = Q.t; $('txt').innerHTML = Q.x; $('misTxt').textContent = hecho[paso] ? '¡Muy bien! Misión cumplida ✔' : Q.m; $('dato').textContent = '💡 ' + Q.d;
    $('mis').className = 'mision' + (hecho[paso] ? ' ok' : ''); $('bAnt').disabled = paso === 0; $('bSig').disabled = paso === 2; $('fin').className = 'fin' + (hecho.every(Boolean) ? ' v' : '');
  }
  function ir(n) { paso = n; if (n === 0) { cadena = 0; hechas = 0; nuevaCadena(); } if (n === 1) nuevoQuiz(); if (n === 2) reiniciarPop(); ctl(); pintar(); }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); }; $('bSig').onclick = function () { if (paso < 2) ir(paso + 1); };
  window.__cad = { ir: ir, clic: clic, siguiente: function () { var i = orden.indexOf(col); return i < 0 ? null : [POS[i][0], POS[i][1] + 30]; }, resp: resp, correcta: function () { return ronda < 5 ? rondas[ronda][1] : -1; }, quitar: quitar, reiniciar: function () { reiniciarPop(); ctl(); }, avanzar: function (s) { for (var i = 0; i < s * 4; i++) { stepSim(0.5); hist.push({ p: pop.p, c: pop.c, f: pop.f }); } if (hist.length > 300) hist = hist.slice(-300); }, pop: function () { return { p: Math.round(pop.p), c: Math.round(pop.c), f: Math.round(pop.f) }; }, estado: function () { return { hecho: hecho.slice() }; } };
  nuevaCadena(); ctl(); pintar(); requestAnimationFrame(frame);
})();
