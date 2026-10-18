/* Formas de energía (4°, solo español, sin voz): reconocer formas, transformaciones y construir cadenas de energía. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var cv = $('cv'), g = cv.getContext('2d'), W = cv.width, H = cv.height;
  var F = { luz: { n: 'Luz', e: '☀️', c: '#ffe08a' }, calor: { n: 'Calor', e: '🔥', c: '#ff8a5c' }, mov: { n: 'Movimiento', e: '🌀', c: '#7ff0e4' }, sonido: { n: 'Sonido', e: '🔊', c: '#c9a8ff' }, quim: { n: 'Química', e: '🍫', c: '#8be8ae' }, elec: { n: 'Eléctrica', e: '⚡', c: '#9db8ff' } };
  var PASOS = [
    { n: 'Formas de energía', t: '1. Energía en todas partes', x: 'La <b>energía</b> es lo que permite que las cosas se muevan, se calienten o brillen. Existe en muchas formas: <b>luz</b>, <b>calor</b>, <b>movimiento</b>, <b>sonido</b>, <b>química</b> (la de los alimentos y las pilas) y <b>eléctrica</b>.', m: 'Di qué forma de energía destaca en 6 casos: acierta al menos 5.', d: 'Tu cuerpo transforma la energía química de la comida en movimiento y calor.' },
    { n: 'Transformaciones', t: '2. La energía se transforma', x: 'La energía <b>no se crea ni se destruye</b>: solo cambia de una forma a otra. Un <b>panel solar</b> transforma luz en electricidad; una <b>bombilla</b>, electricidad en luz.', m: 'Completa 5 transformaciones: acierta al menos 4.', d: 'Siempre se pierde algo de energía en forma de calor: por eso las bombillas se calientan.' },
    { n: 'Construye la cadena', t: '3. Cadenas de energía', x: 'Puedes unir varios aparatos para transformar la energía paso a paso. Cada aparato recibe una forma y entrega otra. Elige los aparatos en orden para llegar de la energía inicial a la meta.', m: 'Resuelve 3 cadenas de energía.', d: 'En una hidroeléctrica: el agua que cae (movimiento) gira una turbina y se produce electricidad.' }
  ];
  var CASOS = [['🍫 Un chocolate', 'quim'], ['☀️ El Sol al mediodía', 'luz'], ['🔥 Una fogata', 'calor'], ['🚴 Una bicicleta en marcha', 'mov'], ['📻 Una radio sonando', 'sonido'], ['🔌 Una lámpara encendida con cable', 'elec'], ['🔋 Una pila nueva', 'quim'], ['🌬️ El viento moviendo un molino', 'mov']];
  var DEV = [{ k: 'panel', n: 'Panel solar', e: '🔆', i: 'luz', o: 'elec' }, { k: 'pila', n: 'Pila', e: '🔋', i: 'quim', o: 'elec' }, { k: 'bombillo', n: 'Bombillo', e: '💡', i: 'elec', o: 'luz' }, { k: 'tostadora', n: 'Tostadora', e: '🍞', i: 'elec', o: 'calor' }, { k: 'motor', n: 'Ventilador', e: '🌀', i: 'elec', o: 'mov' }, { k: 'altavoz', n: 'Altavoz', e: '🔊', i: 'elec', o: 'sonido' }, { k: 'dinamo', n: 'Dínamo', e: '🚲', i: 'mov', o: 'elec' }, { k: 'fogata', n: 'Estufa de gas', e: '🍳', i: 'quim', o: 'calor' }];
  var CADENAS = [['luz', 'mov'], ['quim', 'luz'], ['mov', 'luz'], ['luz', 'sonido'], ['quim', 'calor'], ['mov', 'sonido'], ['luz', 'calor'], ['quim', 'mov']];
  var paso = 0, hecho = [false, false, false], tiempo = 0, msj = '';
  var cola = [], ronda = 0, aciertos = 0, tr = [], cad = null, camino = [], resueltas = 0, orbes = [];
  var ac = null;
  function tono(f, v, d) { try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume(); var o = ac.createOscillator(), gn = ac.createGain(); o.type = 'sine'; o.frequency.value = f; gn.gain.setValueAtTime(v, ac.currentTime); gn.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d); o.connect(gn); gn.connect(ac.destination); o.start(); o.stop(ac.currentTime + d); } catch (e) {} }
  function ex() { tono(660, 0.2, 0.2); setTimeout(function () { tono(880, 0.2, 0.3); }, 130); }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; ex(); pintar(); }
  function mezclar(a) { return a.slice().sort(function () { return Math.random() - 0.5; }); }
  function txt(s, x, y, col, al, tam) { g.font = '700 ' + (tam || 18) + 'px "Space Grotesk",system-ui,sans-serif'; g.fillStyle = col || '#cfe6ff'; g.textAlign = al || 'center'; g.textBaseline = 'alphabetic'; g.fillText(s, x, y); }
  function emoji(e, x, y, s) { g.font = s + 'px system-ui'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#000'; g.fillText(e, x, y); g.textBaseline = 'alphabetic'; }
  function fondo() { var bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0a1a2e'); bg.addColorStop(1, '#050b14'); g.fillStyle = bg; g.fillRect(0, 0, W, H); g.strokeStyle = 'rgba(127,240,228,.06)'; for (var x = 0; x < W; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } }
  function nodo(x, y, e, col, lbl, glow) { g.save(); if (glow) { g.shadowColor = col; g.shadowBlur = 26; } g.fillStyle = 'rgba(8,20,40,.9)'; g.strokeStyle = col; g.lineWidth = 4; g.beginPath(); g.arc(x, y, 52, 0, 7); g.fill(); g.stroke(); g.restore(); emoji(e, x, y - 4, 54); txt(lbl, x, y + 78, col, 'center', 16); }
  function flecha(x1, x2, y, col) { g.strokeStyle = col; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(x1, y); g.lineTo(x2, y); g.stroke(); g.fillStyle = col; g.beginPath(); g.moveTo(x2 + 10, y); g.lineTo(x2 - 8, y - 11); g.lineTo(x2 - 8, y + 11); g.fill(); }
  function dib1() {
    fondo(); if (ronda < 6) { var c = cola[ronda]; txt(c[0], W / 2, 190, '#fff', 'center', 44); txt('¿Qué forma de energía destaca aquí?', W / 2, 260, '#cfe6ff', 'center', 22); } else txt(aciertos >= 5 ? '¡Muy bien! ' + aciertos + ' de 6' : 'Aciertos: ' + aciertos + ' de 6. ¡Otra vez!', W / 2, 220, aciertos >= 5 ? '#8be8ae' : '#ffb3b3', 'center', 36);
    txt(msj, W / 2, 340, msj.indexOf('✔') > -1 ? '#8be8ae' : '#ff9f9f', 'center', 22); txt('Ronda ' + Math.min(6, ronda + 1) + ' de 6', W / 2, 440, '#9db8ff', 'center', 16);
  }
  function dib2() {
    fondo(); if (ronda < 5) { var t = tr[ronda], d = t.d; nodo(180, 200, F[d.i].e, F[d.i].c, F[d.i].n, true); flecha(250, 330, 200, '#cfe6ff'); nodo(480, 200, d.e, '#fff', d.n, false); flecha(550, 630, 200, '#cfe6ff'); nodo(780, 200, '❓', '#ffe08a', '¿Qué sale?', true); txt('El ' + d.n.toLowerCase() + ' transforma ' + F[d.i].n.toLowerCase() + ' en…', W / 2, 70, '#cfe6ff', 'center', 22); }
    else txt(aciertos >= 4 ? '¡Muy bien! ' + aciertos + ' de 5' : 'Aciertos: ' + aciertos + ' de 5. ¡Otra vez!', W / 2, 220, aciertos >= 4 ? '#8be8ae' : '#ffb3b3', 'center', 36);
    txt(msj, W / 2, 400, msj.indexOf('✔') > -1 ? '#8be8ae' : '#ff9f9f', 'center', 22);
  }
  function dib3() {
    fondo(); if (!cad) return; var ini = F[cad[0]], fin = F[cad[1]], n = camino.length, xs = [120]; for (var i = 0; i < n; i++) xs.push(120 + (i + 1) * 190); var xf = 120 + (n + 1) * 190; if (xf > 860) xf = 860;
    nodo(120, 200, ini.e, ini.c, 'Energía: ' + ini.n, true); var prev = 120, col = ini.c;
    camino.forEach(function (d, i) { var x = 120 + (i + 1) * 190; flecha(prev + 62, x - 62, 200, col); nodo(x, 200, d.e, '#fff', d.n, false); col = F[d.o].c; prev = x; });
    var ult = camino.length ? F[camino[camino.length - 1].o] : ini; var okk = camino.length && camino[camino.length - 1].o === cad[1]; var xm = Math.max(120 + (camino.length + 1) * 190, 640); xm = Math.min(xm, 840);
    flecha(prev + 62, xm - 62, 200, col); nodo(xm, 200, fin.e, fin.c, 'Meta: ' + fin.n, !!okk);
    orbes.forEach(function (o) { g.fillStyle = o.c; g.shadowColor = o.c; g.shadowBlur = 14; g.beginPath(); g.arc(o.x, 200, 8, 0, 7); g.fill(); }); g.shadowBlur = 0;
    txt('Convierte ' + ini.n.toLowerCase() + ' en ' + fin.n.toLowerCase(), W / 2, 60, '#cfe6ff', 'center', 24); txt(msj, W / 2, 400, msj.indexOf('✔') > -1 ? '#8be8ae' : '#ffb3b3', 'center', 22); txt('Cadenas resueltas: ' + resueltas + ' de 3', W / 2, 440, '#9db8ff', 'center', 16);
  }
  var last = 0;
  function frame(ms) { var dt = Math.min(0.05, (ms - (last || ms)) / 1000); last = ms; tiempo += dt; if (paso === 2) { orbes = orbes.filter(function (o) { o.x += dt * 260; return o.x < 880; }); if (camino.length && Math.random() < dt * 3) { orbes.push({ x: 150, c: F[cad[0]].c }); } } if (paso === 0) dib1(); else if (paso === 1) dib2(); else dib3(); requestAnimationFrame(frame); }
  function resp1(k) { if (ronda >= 6) return; var ok = cola[ronda][1] === k; if (ok) { aciertos++; msj = '✔ ¡Correcto!'; tono(740, 0.12, 0.15); } else { msj = '✖ Era ' + F[cola[ronda][1]].n.toLowerCase(); tono(200, 0.12, 0.2); } ronda++; if (ronda >= 6 && aciertos >= 5) cumplir(0); ctl(); }
  function resp2(k) { if (ronda >= 5) return; var d = tr[ronda].d; if (d.o === k) { aciertos++; msj = '✔ ¡Correcto!'; tono(740, 0.12, 0.15); } else { msj = '✖ Era ' + F[d.o].n.toLowerCase(); tono(200, 0.12, 0.2); } ronda++; if (ronda >= 5 && aciertos >= 4) cumplir(1); ctl(); }
  function add(d) { if (!cad) return; if (camino.length >= 3) return; camino.push(d); tono(500 + camino.length * 80, 0.1, 0.12); evaluar(); ctl(); }
  function evaluar() {
    var ok = camino.length > 0, cur = cad[0]; camino.forEach(function (d) { if (d.i !== cur) ok = false; cur = d.o; }); if (!ok) { msj = '✖ Esa cadena no encaja: cada aparato debe recibir lo que sale del anterior'; return; }
    if (cur === cad[1]) { msj = '✔ ¡Lo lograste!'; resueltas++; tono(780, 0.15, 0.25); if (resueltas >= 3) cumplir(2); setTimeout(function () { nuevaCadena(); ctl(); }, 1500); } else msj = 'Sigue: ahora tienes ' + F[cur].n.toLowerCase() + '…';
  }
  function nuevaCadena() { var c = mezclar(CADENAS).filter(function (x) { return !cad || x[0] !== cad[0] || x[1] !== cad[1]; })[0]; cad = c; camino = []; msj = ''; }
  function nuevo1() { cola = mezclar(CASOS).slice(0, 6); ronda = 0; aciertos = 0; msj = ''; }
  function nuevo2() { tr = mezclar(DEV).slice(0, 5).map(function (d) { return { d: d }; }); ronda = 0; aciertos = 0; msj = ''; }
  function ctl() {
    var c = $('ctl'); c.textContent = '';
    function btn(txt, fn, cls, dis) { var b = document.createElement('button'); b.type = 'button'; b.className = cls || 'btn sec'; b.textContent = txt; b.onclick = fn; if (dis) b.disabled = true; c.appendChild(b); }
    if (paso <= 1) Object.keys(F).forEach(function (k) { btn(F[k].e + ' ' + F[k].n, function () { (paso === 0 ? resp1 : resp2)(k); }, 'btn'); });
    if (paso === 0 && ronda >= 6 && aciertos < 5) btn('🔄 Reintentar', function () { nuevo1(); ctl(); }, 'btn');
    if (paso === 1 && ronda >= 5 && aciertos < 4) btn('🔄 Reintentar', function () { nuevo2(); ctl(); }, 'btn');
    if (paso === 2) { DEV.forEach(function (d) { btn(d.e + ' ' + d.n, function () { add(d); }, 'tab'); }); btn('↩ Quitar último', function () { camino.pop(); msj = ''; ctl(); }, 'btn sec'); btn('🔄 Otra cadena', function () { nuevaCadena(); ctl(); }, 'btn sec'); }
  }
  function pintar() {
    var p = $('pasos'); p.textContent = '';
    PASOS.forEach(function (Q, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === paso)); b.innerHTML = '<b>' + (hecho[i] ? '✓' : i + 1) + '</b>' + Q.n; b.onclick = function () { ir(i); }; p.appendChild(b); });
    var Q = PASOS[paso]; $('tit').textContent = Q.t; $('txt').innerHTML = Q.x; $('misTxt').textContent = hecho[paso] ? '¡Muy bien! Misión cumplida ✔' : Q.m; $('dato').textContent = '💡 ' + Q.d;
    $('mis').className = 'mision' + (hecho[paso] ? ' ok' : ''); $('bAnt').disabled = paso === 0; $('bSig').disabled = paso === 2; $('fin').className = 'fin' + (hecho.every(Boolean) ? ' v' : '');
  }
  function ir(n) { paso = n; msj = ''; if (n === 0) nuevo1(); if (n === 1) nuevo2(); if (n === 2) { resueltas = 0; cad = null; nuevaCadena(); } ctl(); pintar(); }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); }; $('bSig').onclick = function () { if (paso < 2) ir(paso + 1); };
  window.__ener2 = { ir: ir, r1: resp1, r2: resp2, c1: function () { return ronda < 6 ? cola[ronda][1] : null; }, c2: function () { return ronda < 5 ? tr[ronda].d.o : null; },
    resolver: function () { var res = null; (function bus(cur, ruta) { if (res) return; if (cur === cad[1] && ruta.length) { res = ruta.slice(); return; } if (ruta.length >= 3) return; DEV.forEach(function (d) { if (d.i === cur) { ruta.push(d); bus(d.o, ruta); ruta.pop(); } }); })(cad[0], []); camino = []; res.forEach(function (d) { add(d); }); }, estado: function () { return { hecho: hecho.slice(), resueltas: resueltas }; } };
  nuevo1(); ctl(); pintar(); requestAnimationFrame(frame);
})();
