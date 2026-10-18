/* Sonidos que vibran: cuatro pasos para explicar cómo se forma el sonido (vibración → aire → oído → fuerte/suave, agudo/grave).
   Todo suena con Web Audio (sin archivos de audio). */
(function () {
  'use strict';
  var T = I18N.t, $ = function (id) { return document.getElementById(id); };
  var cv = $('cv'), g = cv.getContext('2d'), W = cv.width, H = cv.height;
  var paso = 0, hecho = [false, false, false, false];
  var cont = { cuerda: 0, tambor: 0, cerca: false, lejos: false, grave: false, agudo: false, fuerte: false, suave: false };
  var dist = 0.35, vol4 = 1, notaVis = { f: 261.6, a: 0 };
  var t0 = { cuerda: -99, tambor: -99, campana: -99, barra: [-99, -99, -99, -99, -99, -99, -99, -99] };
  var NOTAS = [['Do', 261.6, '#ff6b7d'], ['Re', 293.7, '#ff9f5a'], ['Mi', 329.6, '#ffd36b'], ['Fa', 349.2, '#8be8ae'], ['Sol', 392, '#5fd9c8'], ['La', 440, '#6fb4ff'], ['Si', 493.9, '#a78bff'], ['Do', 523.3, '#f59ad6']];

  /* ---------- sonido ---------- */
  var ac = null;
  function audio() {
    if (!ac) { var C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ac = new C(); }
    if (ac.state === 'suspended') ac.resume();
    return ac;
  }
  function env(c, nodo, vol, dur, ataque) {
    var G = c.createGain(), n = c.currentTime;
    G.gain.setValueAtTime(0.0001, n);
    G.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), n + (ataque || 0.01));
    G.gain.exponentialRampToValueAtTime(0.0001, n + dur);
    nodo.connect(G); G.connect(c.destination); return G;
  }
  function tono(c, tipo, f, vol, dur, ataque) {
    var o = c.createOscillator(); o.type = tipo; o.frequency.value = f;
    env(c, o, vol, dur, ataque); o.start(); o.stop(c.currentTime + dur + 0.05); return o;
  }
  function cuerdaSnd(f, v) { var c = audio(); if (!c) return; tono(c, 'triangle', f, 0.35 * v, 1.6); tono(c, 'sine', f * 2, 0.12 * v, 0.9); tono(c, 'sine', f * 3, 0.05 * v, 0.5); }
  function tamborSnd(v) {
    var c = audio(); if (!c) return;
    var o = c.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(170, c.currentTime); o.frequency.exponentialRampToValueAtTime(55, c.currentTime + 0.25);
    env(c, o, 0.7 * v, 0.5, 0.004); o.start(); o.stop(c.currentTime + 0.6);
    var n = c.createBuffer(1, c.sampleRate * 0.12, c.sampleRate), d = n.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    var s = c.createBufferSource(); s.buffer = n; var bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; s.connect(bp); env(c, bp, 0.25 * v, 0.12, 0.002); s.start();
  }
  function campanaSnd(v) { var c = audio(); if (!c) return; [[1, 1], [2.76, 0.5], [5.4, 0.3], [8.9, 0.15]].forEach(function (p) { tono(c, 'sine', 660 * p[0], 0.3 * v * p[1], 2.2); }); }
  function barraSnd(f, v) { var c = audio(); if (!c) return; tono(c, 'sine', f, 0.5 * v, 1.3, 0.004); tono(c, 'sine', f * 4, 0.12 * v, 0.5, 0.004); }

  /* ---------- dibujo ---------- */
  var tiempo = 0;
  function ahora() { return tiempo; }
  function fondoSuave() { var gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#0e2038'); gr.addColorStop(1, '#09111f'); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
  function texto(s, x, y, tam, col, al) { g.font = '700 ' + tam + 'px "Space Grotesk",system-ui,sans-serif'; g.fillStyle = col || '#eaf2fb'; g.textAlign = al || 'center'; g.fillText(s, x, y); }

  function dibCuerda() {
    var x0 = 130, x1 = 830, y = 240, t = ahora() - t0.cuerda, A = t > 0 ? 46 * Math.exp(-t * 1.5) : 0;
    g.fillStyle = '#3a4a64'; g.fillRect(x0 - 26, y - 70, 26, 140); g.fillRect(x1, y - 70, 26, 140);
    var ph = Math.cos(2 * Math.PI * 5 * Math.max(t, 0));
    for (var k = 3; k >= 0; k--) {
      var a = A * (k === 0 ? ph : Math.cos(2 * Math.PI * 5 * (t - k * 0.018)));
      g.strokeStyle = k === 0 ? '#ffe08a' : 'rgba(255,224,138,' + (0.16 - k * 0.04) + ')'; g.lineWidth = k === 0 ? 5 : 4; g.beginPath();
      for (var x = x0; x <= x1; x += 8) { var yy = y + a * Math.sin(Math.PI * (x - x0) / (x1 - x0)); if (x === x0) g.moveTo(x, yy); else g.lineTo(x, yy); } g.stroke();
    }
    if (A > 4) { texto('〰 ' + T('vibra'), W / 2, y - 100, 34, '#ffe08a'); } else { texto('👆', W / 2, y - 70, 40); }
  }
  var PART = []; (function () { for (var i = 0; i < 24; i++) for (var j = 0; j < 9; j++) PART.push({ x: 250 + i * 28, y: 70 + j * 40 }); })();
  function dibAire() {
    var t = ahora() - t0.tambor, frente = t > 0 ? t * 260 : -999, x0 = 230;
    var vib = t > 0 && t < 0.6 ? Math.sin(t * 90) * 10 * (1 - t / 0.6) : 0;
    g.fillStyle = '#6b4a2f'; g.beginPath(); g.ellipse(120, H / 2, 70, 100, 0, 0, 7); g.fill();
    g.fillStyle = '#e8c58a'; g.beginPath(); g.ellipse(120 + vib, H / 2, 58, 88, 0, 0, 7); g.fill();
    g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 3; g.stroke();
    PART.forEach(function (p) {
      var d = (p.x - x0) - frente, dx = frente > 0 ? 22 * Math.exp(-(d * d) / 2600) * Math.exp(-(p.x - x0) / 700) : 0;
      var m = Math.min(1, dx / 20);
      g.fillStyle = 'rgba(' + Math.round(127 + 128 * m) + ',' + Math.round(200 + 20 * m) + ',' + Math.round(240 - 100 * m) + ',' + (0.55 + 0.45 * m) + ')';
      g.beginPath(); g.arc(p.x + dx, p.y, 5.5 + 2.5 * m, 0, 7); g.fill();
    });
    texto(T('aire'), 620, H - 24, 22, '#9db8ff');
    if (t < 0) texto('👆', 120, H / 2 + 20, 40);
  }
  function dibOido() {
    var ex = 330 + dist * 530, sx = 120, y = H / 2, t = ahora() - t0.campana;
    var vol = Math.max(0.12, 1 - dist * 0.88);
    g.font = '90px serif'; g.textAlign = 'center'; g.fillText('🔔', sx, y + 28);
    for (var k = 0; k < 6; k++) {
      var r = t * 300 - k * 60; if (t < 0 || r < 6) continue; var a = Math.max(0, 0.7 - r / 800) * (r > ex - sx ? 0 : 1);
      g.strokeStyle = 'rgba(255,211,107,' + a + ')'; g.lineWidth = 5; g.beginPath(); g.arc(sx + 40, y, r, -0.9, 0.9); g.stroke();
    }
    var llega = t > 0 && t * 300 >= ex - sx - 40 && t < 1.8;
    if (llega) { g.fillStyle = 'rgba(139,232,174,' + (0.25 * vol) + ')'; g.beginPath(); g.arc(ex, y, 70 + 30 * Math.sin(t * 40) * vol, 0, 7); g.fill(); }
    g.font = (96 + (llega ? 10 * Math.sin(t * 40) * vol : 0)) + 'px serif'; g.fillStyle = '#fff'; g.fillText('👂', ex, y + 30);
    texto(T('oido'), ex, y + 100, 20, '#8be8ae');
    g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(W / 2 - 150, H - 48, 300, 14); g.fillStyle = '#8be8ae'; g.fillRect(W / 2 - 150, H - 48, 300 * vol, 14);
    texto('🔊', W / 2 - 176, H - 34, 22);
  }
  function dibBarras() {
    for (var i = 0; i < 8; i++) {
      var h = 250 - i * 17, x = 70 + i * 106, y = 60, t = ahora() - t0.barra[i], A = t > 0 ? 9 * vol4 * Math.exp(-t * 2.2) : 0;
      var f = NOTAS[i][1], sh = A * Math.sin(2 * Math.PI * f / 40 * Math.max(t, 0));
      g.fillStyle = '#3a4a64'; g.fillRect(x + 10, y + 12, 6, h - 24);
      g.fillStyle = NOTAS[i][2]; g.beginPath(); g.roundRect(x + sh * 0.4, y + sh, 90, h * 0.78, 14); g.fill();
      g.fillStyle = 'rgba(0,0,0,.35)'; texto(NOTAS[i][0], x + 45 + sh * 0.4, y + sh + 44, 26, '#102036');
    }
    texto('🔈 ' + T('grave'), 120, 372, 20, '#b3c4d6'); texto(T('agudo') + ' 🔊', W - 130, 372, 20, '#b3c4d6');
    g.strokeStyle = '#7ff0e4'; g.lineWidth = 3; g.beginPath();
    var amp = 34 * notaVis.a * 1, fr = notaVis.f / 130;
    for (var x2 = 70; x2 <= W - 70; x2 += 4) { var yy = 420 + amp * Math.sin((x2 - 70) / 60 * fr * 0.9 + ahora() * 6); if (x2 === 70) g.moveTo(x2, yy); else g.lineTo(x2, yy); }
    g.stroke();
  }
  function frame(ms) {
    tiempo = ms / 1000; fondoSuave();
    if (paso === 0) dibCuerda(); else if (paso === 1) dibAire(); else if (paso === 2) dibOido(); else dibBarras();
    notaVis.a *= 0.985;
    requestAnimationFrame(frame);
  }

  /* ---------- acciones ---------- */
  function tocarCuerda() { t0.cuerda = ahora(); cuerdaSnd(196, 1); cont.cuerda++; if (cont.cuerda >= 3) cumplir(0); }
  function golpearTambor() { t0.tambor = ahora(); tamborSnd(1); cont.tambor++; if (cont.tambor >= 3) cumplir(1); }
  function sonarCampana() {
    t0.campana = ahora(); campanaSnd(Math.max(0.12, 1 - dist * 0.88));
    if (dist < 0.3) cont.cerca = true; if (dist > 0.7) cont.lejos = true; if (cont.cerca && cont.lejos) cumplir(2);
  }
  function tocarBarra(i) {
    t0.barra[i] = ahora(); barraSnd(NOTAS[i][1], vol4); notaVis.f = NOTAS[i][1]; notaVis.a = vol4;
    if (i <= 1) cont.grave = true; if (i >= 6) cont.agudo = true; if (vol4 > 0.5) cont.fuerte = true; else cont.suave = true;
    if (cont.grave && cont.agudo && cont.fuerte && cont.suave) cumplir(3);
  }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; pintar(); }

  /* ---------- interfaz ---------- */
  function ctl() {
    var c = $('ctl'); c.textContent = '';
    function btn(txt, fn, cls) { var b = document.createElement('button'); b.type = 'button'; b.className = 'btn ' + (cls || 'grande'); b.textContent = txt; b.onclick = fn; c.appendChild(b); return b; }
    if (paso === 0) btn('🎸 ' + T('b_cuerda'), tocarCuerda);
    if (paso === 1) btn('🥁 ' + T('b_tambor'), golpearTambor);
    if (paso === 2) {
      btn('🔔 ' + T('b_campana'), sonarCampana);
      var l = document.createElement('label'); l.className = 'rango'; l.innerHTML = '<span>' + T('r_dist') + ': ' + T('r_cerca') + '</span><input type="range" min="0" max="100" value="' + Math.round(dist * 100) + '" aria-label="' + T('r_dist') + '"><span>' + T('r_lejos') + '</span>';
      l.querySelector('input').oninput = function () { dist = this.value / 100; }; c.appendChild(l);
    }
    if (paso === 3) {
      var a = btn('🔊 ' + T('b_fuerte'), function () { vol4 = 1; a.setAttribute('aria-pressed', 'true'); b2.setAttribute('aria-pressed', 'false'); }, 'tab');
      var b2 = btn('🔈 ' + T('b_suave'), function () { vol4 = 0.22; b2.setAttribute('aria-pressed', 'true'); a.setAttribute('aria-pressed', 'false'); }, 'tab');
      a.className = b2.className = 'tab'; a.setAttribute('aria-pressed', String(vol4 > 0.5)); b2.setAttribute('aria-pressed', String(vol4 <= 0.5));
    }
  }
  function pintar() {
    var p = $('pasos'); p.textContent = '';
    for (var i = 0; i < 4; i++) (function (i) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === paso));
      b.innerHTML = '<b>' + (hecho[i] ? '✓' : i + 1) + '</b>' + T('paso' + (i + 1)); b.onclick = function () { ir(i); }; p.appendChild(b);
    })(i);
    var n = paso + 1;
    $('tit').textContent = T('t' + n); $('txt').innerHTML = T('x' + n); $('misTxt').textContent = T('m' + n); $('dato').textContent = '💡 ' + T('d' + n);
    var m = $('mis'); m.className = 'mision' + (hecho[paso] ? ' ok' : ''); if (hecho[paso]) $('misTxt').textContent = T('ok');
    $('bAnt').disabled = paso === 0; $('bSig').disabled = paso === 3;
    $('fin').className = 'fin' + (hecho.every(Boolean) ? ' v' : '');
  }
  function ir(n) { paso = n; try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) {} ctl(); pintar(); }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); };
  $('bSig').onclick = function () { if (paso < 3) ir(paso + 1); };
  $('bVoz').onclick = function () {
    if (!window.speechSynthesis) return; speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance($('tit').textContent.replace(/^\d\.\s*/, '') + '. ' + $('txt').textContent); u.lang = I18N.get() === 'en' ? 'en-US' : 'es-MX'; u.rate = 0.9; speechSynthesis.speak(u);
  };
  function pos(e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height }; }
  cv.addEventListener('pointerdown', function (e) {
    var p = pos(e);
    if (paso === 0 && p.x > 100 && p.x < 860 && Math.abs(p.y - 240) < 90) tocarCuerda();
    else if (paso === 1 && p.x < 220) golpearTambor();
    else if (paso === 2 && p.x < 230) sonarCampana();
    else if (paso === 3) { for (var i = 0; i < 8; i++) { var x = 70 + i * 106; if (p.x >= x && p.x <= x + 90 && p.y >= 60 && p.y <= 60 + (250 - i * 17) * 0.78 + 20) { tocarBarra(i); break; } } }
  });
  I18N.onChange(function () { ctl(); pintar(); });
  window.__sonidos = { ir: ir, tocarCuerda: tocarCuerda, golpearTambor: golpearTambor, sonarCampana: sonarCampana, tocarBarra: tocarBarra, estado: function () { return { hecho: hecho.slice(), ctx: ac && ac.state, cont: cont }; }, setDist: function (d) { dist = d; }, setVol: function (v) { vol4 = v; } };
  ctl(); pintar(); I18N.montar(); requestAnimationFrame(frame);
})();
