/* Mis cinco sentidos (1°, solo español, con voz de Beto): una actividad por sentido y un juego final. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var PASOS = [
    { n: 'La vista', org: '👀', t: 'La vista: los ojos', x: 'Con los <b>ojos</b> vemos los colores, las formas y la luz. Sin luz no podemos ver.', m: 'Toca la manzana roja.', q: 'Toca la manzana roja', ops: [['🍎', 1], ['🍏', 0], ['🍌', 0]], d: 'Los ojos necesitan luz para poder ver.' },
    { n: 'El oído', org: '👂', t: 'El oído: las orejas', x: 'Con los <b>oídos</b> escuchamos. Los sonidos son vibraciones que llegan hasta tu oído.', m: 'Escucha el sonido y toca lo que suena.', q: 'Escucha y toca lo que suena', ops: [['🥁', 0], ['🔔', 0], ['🎵', 0]], snd: 1, d: 'Los oídos también te ayudan a mantener el equilibrio.' },
    { n: 'El tacto', org: '✋', t: 'El tacto: la piel', x: 'Con la <b>piel</b>, sobre todo con las manos, sentimos si algo es suave, áspero, frío o caliente.', m: 'Toca lo que está frío.', q: 'Toca lo que está frío', ops: [['🔥', 0], ['🧊', 1], ['☀️', 0]], d: 'La piel es el órgano más grande de tu cuerpo.' },
    { n: 'El olfato', org: '👃', t: 'El olfato: la nariz', x: 'Con la <b>nariz</b> olemos. Los olores nos avisan de lo rico y también de lo peligroso.', m: 'Toca lo que huele a flor.', q: 'Toca lo que huele a flor', ops: [['🧦', 0], ['🌹', 1], ['🗑️', 0]], d: 'Si hueles a humo, avisa enseguida a un adulto.' },
    { n: 'El gusto', org: '👅', t: 'El gusto: la lengua', x: 'Con la <b>lengua</b> probamos los sabores: dulce, salado, ácido y amargo.', m: 'Toca lo que sabe ácido.', q: 'Toca lo que sabe ácido', ops: [['🍭', 0], ['🍋', 1], ['🥨', 0]], d: 'La lengua tiene miles de botoncitos para sentir los sabores.' },
    { n: '¿Qué sentido uso?', org: '🧠', t: '¿Qué sentido uso?', x: 'Ahora une cada acción con el sentido que usas. ¡Tu cerebro recibe lo que sienten tus cinco sentidos!', m: 'Acierta cuatro veces.', juego: 1, d: 'Muchas veces usamos varios sentidos a la vez.' }
  ];
  var RONDAS = [['🌈', 'Mirar un arcoíris', 0], ['🔔', 'Escuchar una campana', 1], ['🧊', 'Tocar un hielo', 2], ['🌹', 'Oler una rosa', 3], ['🍋', 'Probar un limón', 4]];
  var SENT = [['👀', 'vista'], ['👂', 'oído'], ['✋', 'tacto'], ['👃', 'olfato'], ['👅', 'gusto']];
  var paso = 0, hecho = PASOS.map(function () { return false; }), secreto = 0, ronda = 0, aciertos = 0, orden = [];
  var ac = null;
  function tono(tipo, f, v, d) {
    try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume();
      var o = ac.createOscillator(), G = ac.createGain(), n = ac.currentTime; o.type = tipo; o.frequency.value = f; G.gain.setValueAtTime(0.0001, n); G.gain.exponentialRampToValueAtTime(v, n + 0.01); G.gain.exponentialRampToValueAtTime(0.0001, n + d); o.connect(G); G.connect(ac.destination); o.start(); o.stop(n + d + 0.05); } catch (e) {} }
  function suena(i) { if (i === 0) { tono('sine', 150, 0.5, 0.35); tono('sine', 80, 0.5, 0.45); } else if (i === 1) { [660, 1820, 3560].forEach(function (f, k) { tono('sine', f, 0.25 / (k + 1), 1.6); }); } else { [523, 659, 784].forEach(function (f, k) { setTimeout(function () { tono('triangle', f, 0.3, 0.3); }, k * 220); }); } }
  function bien() { tono('sine', 660, 0.2, 0.2); setTimeout(function () { tono('sine', 880, 0.2, 0.3); }, 130); }
  function mal() { tono('sine', 200, 0.18, 0.25); }
  function mezclar(a) { return a.slice().sort(function () { return Math.random() - 0.5; }); }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; bien(); pintar(); Narrar.decir('ok', '¡Muy bien! Misión cumplida.'); }

  function sala() {
    var P = PASOS[paso], s = $('sala'); s.textContent = '';
    function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; s.appendChild(e); return e; }
    el('div', 'organo', P.org);
    if (P.juego) {
      var r = RONDAS[orden[ronda % 5]];
      el('div', 'pregunta', r[0] + ' ' + r[1] + ': ¿con qué sentido?');
      var msj = el('div', 'msj'); msj.id = 'msj'; var ops = el('div', 'ops');
      SENT.forEach(function (st, i) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'op'; b.innerHTML = st[0] + '<small>' + st[1] + '</small>';
        b.onclick = function () {
          if (i === r[2]) { b.classList.add('bien'); aciertos++; msj.textContent = '¡Muy bien!'; bien(); setTimeout(function () { ronda++; if (aciertos >= 4) { cumplir(paso); } sala(); }, 900); }
          else { b.classList.add('mal'); msj.textContent = 'Inténtalo otra vez'; mal(); setTimeout(function () { b.classList.remove('mal'); }, 400); }
        }; ops.appendChild(b);
      });
      el('div', 'msj', 'Aciertos: ' + aciertos + ' de 4');
      return;
    }
    el('div', 'pregunta', P.q);
    if (P.snd) { var bs = el('button', 'btn grande escuchar', '🔊 Escuchar el sonido'); bs.type = 'button'; bs.onclick = function () { suena(secreto); }; }
    var m2 = el('div', 'msj'); var ops2 = el('div', 'ops');
    mezclar(P.ops.map(function (o, i) { return [o[0], P.snd ? (i === secreto ? 1 : 0) : o[1]]; })).forEach(function (o) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'op'; b.textContent = o[0];
      b.onclick = function () { if (o[1]) { b.classList.add('bien'); m2.textContent = '¡Muy bien!'; cumplir(paso); } else { b.classList.add('mal'); m2.textContent = 'Inténtalo otra vez'; mal(); setTimeout(function () { b.classList.remove('mal'); }, 400); } };
      ops2.appendChild(b);
    });
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
  function ir(n) { paso = n; Narrar.parar(); secreto = Math.floor(Math.random() * 3); if (PASOS[n].juego) { orden = mezclar([0, 1, 2, 3, 4]); ronda = 0; aciertos = 0; } sala(); pintar(); narrar(false); }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); };
  $('bSig').onclick = function () { if (paso < PASOS.length - 1) ir(paso + 1); };
  $('bVoz').onclick = function () { narrar(true); };
  $('bAuto').setAttribute('aria-pressed', String(Narrar.activa())); $('bAuto').onclick = function () { $('bAuto').setAttribute('aria-pressed', String(Narrar.alternar())); };
  window.__sentidos = { ir: ir, estado: function () { return { hecho: hecho.slice(), paso: paso }; }, correcta: function () { return PASOS[paso].juego ? RONDAS[orden[ronda % 5]][2] : -1; } };
  secreto = Math.floor(Math.random() * 3); sala(); pintar();
})();
