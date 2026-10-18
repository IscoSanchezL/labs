/* Kit de los laboratorios STEM: pasos, misiones, controles, tonos, cuestionarios y bucle de dibujo.
   Uso: LabKit({ hook, pasos:[{n,t,x,m,d}], voz, enter(L,n), ctl(L), sim(L,dt), draw(L,g,dt), hooks(L) }) */
(function () {
  'use strict';
  window.LabKit = function (cfg) {
    var $ = function (id) { return document.getElementById(id); };
    var cv = $('cv'), g = cv ? cv.getContext('2d') : null;
    var L = { g: g, W: cv ? cv.width : 0, H: cv ? cv.height : 0, paso: 0, hecho: cfg.pasos.map(function () { return false; }), t: 0, msj: '', S: {}, q: null };
    var ac = null;
    L.tono = function (f, v, d, tp) { try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume(); var o = ac.createOscillator(), gn = ac.createGain(); o.type = tp || 'sine'; o.frequency.value = f; gn.gain.setValueAtTime(v, ac.currentTime); gn.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d); o.connect(gn); gn.connect(ac.destination); o.start(); o.stop(ac.currentTime + d); } catch (e) {} };
    L.bien = function () { L.tono(660, 0.2, 0.2); setTimeout(function () { L.tono(880, 0.2, 0.3); }, 130); };
    L.mal = function () { L.tono(200, 0.15, 0.25); };
    L.cumplir = function (n) { if (L.hecho[n]) return; L.hecho[n] = true; L.bien(); pintar(); if (cfg.voz && window.Narrar) Narrar.decir('ok', '¡Muy bien! Misión cumplida.'); };
    L.mezclar = function (a) { return a.slice().sort(function () { return Math.random() - 0.5; }); };
    L.txt = function (s, x, y, col, al, tam, fam) { if (!g) return; g.font = '700 ' + (tam || 18) + 'px ' + (fam || '"Space Grotesk",system-ui,sans-serif'); g.fillStyle = col || '#cfe6ff'; g.textAlign = al || 'center'; g.textBaseline = 'alphabetic'; g.fillText(s, x, y); };
    L.mono = function (s, x, y, col, al, tam) { L.txt(s, x, y, col, al, tam || 14, '"JetBrains Mono",monospace'); };
    L.emoji = function (e, x, y, s, rot) { g.save(); g.translate(x, y); if (rot) g.rotate(rot); g.font = s + 'px system-ui'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#000'; g.fillText(e, 0, 0); g.restore(); };
    L.wrap = function (t, x, y, max, lh, col, tam) { g.font = '700 ' + (tam || 18) + 'px "Space Grotesk",system-ui,sans-serif'; g.fillStyle = col || '#cfe6ff'; g.textAlign = 'center'; var ws = t.split(' '), l = '', ls = []; ws.forEach(function (w) { var tt = l ? l + ' ' + w : w; if (g.measureText(tt).width > max) { ls.push(l); l = w; } else l = tt; }); ls.push(l); lh = lh || 24; ls.forEach(function (s, i) { g.fillText(s, x, y - (ls.length - 1) * lh / 2 + i * lh); }); };
    L.glow = function (col, b) { g.shadowColor = col; g.shadowBlur = b; };
    L.nada = function () { g.shadowBlur = 0; };
    L.xy = function (e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * L.W / r.width, (e.clientY - r.top) * L.H / r.height]; };
    var ctlEl = $('ctl');
    L.btn = function (txt, fn, cls, pr, dis) { var b = document.createElement('button'); b.type = 'button'; b.className = cls || 'btn sec'; b.textContent = txt; b.onclick = fn; if (pr !== undefined) b.setAttribute('aria-pressed', String(pr)); if (dis) b.disabled = true; ctlEl.appendChild(b); return b; };
    L.op = function (e, l, fn) { var b = document.createElement('button'); b.type = 'button'; b.className = 'op'; b.style.minWidth = '92px'; b.style.fontSize = '46px'; b.innerHTML = e + '<small>' + l + '</small>'; b.onclick = fn; ctlEl.appendChild(b); return b; };
    L.rango = function (etq, min, max, step, val, fn) { var l = document.createElement('label'); l.className = 'rango'; l.innerHTML = etq + ' <input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" aria-label="' + etq + '">'; l.querySelector('input').oninput = function (e) { fn(Number(e.target.value)); }; ctlEl.appendChild(l); return l; };
    /* cuestionario: items [{q, e, a}] (a = índice de la opción correcta) */
    L.nuevoQuiz = function (items, n, need) { L.q = { items: L.mezclar(items).slice(0, n), i: 0, ok: 0, need: need, n: n, fin: false, msj: '' }; L.msj = ''; };
    L.quizResp = function (k) { var q = L.q; if (!q || q.i >= q.n) return; var it = q.items[q.i], ok = it.a === k; if (ok) { q.ok++; q.msj = '✔ ¡Correcto!'; L.tono(740, 0.12, 0.15); } else { q.msj = '✖ ' + (it.fb || 'Intenta recordarlo'); L.mal(); } q.i++; if (q.i >= q.n) { q.fin = true; if (q.ok >= q.need) L.cumplir(L.paso); } L.ctl(); };
    L.dibQuiz = function (fondo, col) { var q = L.q, g2 = g; if (fondo) { g2.fillStyle = fondo; g2.fillRect(0, 0, L.W, L.H); } col = col || '#cfe6ff'; if (!q) return; if (!q.fin) { var it = q.items[q.i]; if (it.e) L.emoji(it.e, L.W / 2, 150, 96); L.wrap(it.q, L.W / 2, 250, L.W - 120, 32, col, 26); } else L.txt(q.ok >= q.need ? '¡Muy bien! ' + q.ok + ' de ' + q.n : 'Aciertos: ' + q.ok + ' de ' + q.n + '. ¡Inténtalo otra vez!', L.W / 2, 220, q.ok >= q.need ? '#8be8ae' : '#ffb3b3', 'center', 34); L.txt(q.msj, L.W / 2, 350, q.msj.indexOf('✔') > -1 ? '#8be8ae' : '#ff9f9f', 'center', 22); L.txt('Pregunta ' + Math.min(q.n, q.i + 1) + ' de ' + q.n, L.W / 2, L.H - 16, '#9db8ff', 'center', 15); };
    L.quizBtns = function (opts, emojiMode) { opts.forEach(function (o, k) { if (emojiMode) L.op(o[0], o[1], function () { L.quizResp(k); }); else L.btn(o, function () { L.quizResp(k); }, 'btn'); }); if (L.q && L.q.fin && L.q.ok < L.q.need) L.btn('🔄 Reintentar', function () { cfg.reintentar(L); L.ctl(); }, 'btn'); };
    L.ctl = function () { ctlEl.textContent = ''; if (cfg.ctl) cfg.ctl(L); };
    function pintar() {
      var p = $('pasos'); p.textContent = '';
      cfg.pasos.forEach(function (Q, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (L.hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === L.paso)); b.innerHTML = '<b>' + (L.hecho[i] ? '✓' : i + 1) + '</b>' + Q.n; b.onclick = function () { ir(i); }; p.appendChild(b); });
      var Q = cfg.pasos[L.paso]; $('tit').textContent = Q.t; $('txt').innerHTML = Q.x; $('misTxt').textContent = L.hecho[L.paso] ? '¡Muy bien! Misión cumplida ✔' : Q.m; $('dato').textContent = '💡 ' + Q.d;
      $('mis').className = 'mision' + (L.hecho[L.paso] ? ' ok' : ''); $('bAnt').disabled = L.paso === 0; $('bSig').disabled = L.paso === cfg.pasos.length - 1; $('fin').className = 'fin' + (L.hecho.every(Boolean) ? ' v' : '');
    }
    function narrar(f) { if (!cfg.voz || !window.Narrar) return; var Q = cfg.pasos[L.paso]; Narrar.decir('p' + (L.paso + 1), Q.t + '. ' + Q.x.replace(/<[^>]+>/g, ''), f, ['m' + (L.paso + 1), 'Tu misión. ' + Q.m]); }
    function ir(n) { L.paso = n; L.msj = ''; if (cfg.voz && window.Narrar) Narrar.parar(); if (cfg.enter) cfg.enter(L, n); L.ctl(); pintar(); narrar(false); }
    L.ir = ir; L.pintar = pintar;
    $('bAnt').onclick = function () { if (L.paso > 0) ir(L.paso - 1); }; $('bSig').onclick = function () { if (L.paso < cfg.pasos.length - 1) ir(L.paso + 1); };
    if (cfg.voz && window.Narrar && $('bVoz')) { $('bVoz').onclick = function () { narrar(true); }; $('bAuto').setAttribute('aria-pressed', String(Narrar.activa())); $('bAuto').onclick = function () { $('bAuto').setAttribute('aria-pressed', String(Narrar.alternar())); }; }
    var last = 0;
    function frame(ms) { var dt = Math.min(0.05, (ms - (last || ms)) / 1000); last = ms; L.t += dt; if (cfg.sim) cfg.sim(L, dt); if (g && cfg.draw) cfg.draw(L, g, dt); requestAnimationFrame(frame); }
    window[cfg.hook] = Object.assign({ ir: ir, L: L, estado: function () { return { hecho: L.hecho.slice(), paso: L.paso }; }, avanzar: function (s) { for (var i = 0; i < s * 40; i++) { L.t += 0.025; if (cfg.sim) cfg.sim(L, 0.025); } } }, cfg.hooks ? cfg.hooks(L) : {});
    if (cfg.init) cfg.init(L);
    if (cfg.enter) cfg.enter(L, 0); L.ctl(); pintar(); if (!cfg.voz) { } requestAnimationFrame(frame);
    return L;
  };
})();
