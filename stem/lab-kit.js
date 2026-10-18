/* Kit de los laboratorios STEM: pasos, misiones, controles, tonos, cuestionarios y bucle de dibujo.
   Uso: LabKit({ hook, pasos:[{n,t,x,m,d}], voz, enter(L,n), ctl(L), sim(L,dt), draw(L,g,dt), hooks(L) }) */
(function () {
  'use strict';
  window.LabKit = function (cfg) {
    var $ = function (id) { return document.getElementById(id); };
    var cv = $('cv'), g = cv ? cv.getContext('2d') : null;
    var L = { g: g, W: cv ? cv.width : 0, H: cv ? cv.height : 0, paso: 0, hecho: cfg.pasos.map(function () { return false; }), t: 0, msj: '', S: {}, q: null };
    var ac = null;
    var dpr = Math.min(2, window.devicePixelRatio || 1), reducir = false; try { reducir = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    if (cv && dpr > 1) { cv.width = L.W * dpr; cv.height = L.H * dpr; }
    L.P = []; L.shake = 0; L.xpGanado = 0; L.racha = 0; L.mejorRacha = 0;
    var XPK = 'stem-xp', NIV = ['Aprendiz', 'Explorador', 'Investigador', 'Científico', 'Inventor', 'Maestro STEM'];
    function xpTotal() { try { return Number(localStorage.getItem(XPK)) || 0; } catch (e) { return 0; } }
    function xpGuardar(v) { try { localStorage.setItem(XPK, String(v)); } catch (e) {} }
    var hud = null;
    function hudPintar() { if (!hud) return; var x = xpTotal(), n = Math.min(NIV.length - 1, Math.floor(x / 300)), f = (x % 300) / 300; hud.innerHTML = '<span class="hud-n">🏅 ' + NIV[n] + '</span><span class="hud-barra"><i style="width:' + (n === NIV.length - 1 ? 100 : Math.round(f * 100)) + '%"></i></span><span class="hud-xp">⭐ ' + x + ' XP</span>' + (L.racha >= 2 ? '<span class="hud-r">🔥 racha ×' + L.racha + '</span>' : ''); }
    L.xp = function (n, x, y) { xpGuardar(xpTotal() + n); L.xpGanado += n; hudPintar(); if (x !== undefined) L.flot('+' + n + ' XP', x, y, '#ffe08a'); };
    L.flot = function (t, x, y, col) { L.P.push({ k: 't', t: t, x: x, y: y, vx: 0, vy: -46, v: 1.3, c: col || '#fff' }); };
    L.chispas = function (x, y, col, n) { if (reducir) return; for (var i = 0; i < (n || 16); i++) { var a = Math.random() * 6.283, v = 60 + Math.random() * 180; L.P.push({ k: 'c', x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40, v: 0.6 + Math.random() * 0.5, r: 2 + Math.random() * 3, c: col || '#ffe08a' }); } };
    L.confeti = function () { if (reducir) return; var cols = ['#ff6b8a', '#ffd05c', '#5cc8ff', '#7be39a', '#b9a8ff', '#ff9f43']; for (var i = 0; i < 90; i++) L.P.push({ k: 'f', x: Math.random() * L.W, y: -10 - Math.random() * 60, vx: (Math.random() - 0.5) * 120, vy: 80 + Math.random() * 200, v: 2.4 + Math.random(), w: 6 + Math.random() * 6, rot: Math.random() * 6, c: cols[i % cols.length] }); };
    L.sacudir = function (n) { if (!reducir) L.shake = n || 8; };
    function fxMover(dt) { for (var i = L.P.length - 1; i >= 0; i--) { var p = L.P[i]; p.v -= dt; if (p.v <= 0) { L.P.splice(i, 1); continue; } p.x += p.vx * dt; p.y += p.vy * dt; if (p.k === 'c') p.vy += 420 * dt; if (p.k === 'f') { p.rot += dt * 6; p.vx += Math.sin(p.rot) * 40 * dt; } } if (L.shake > 0) L.shake = Math.max(0, L.shake - dt * 30); }
    function fxDibujar(g) { L.P.forEach(function (p) { g.save(); g.globalAlpha = Math.max(0, Math.min(1, p.v * 1.4)); if (p.k === 't') { g.font = '700 22px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'center'; g.shadowColor = p.c; g.shadowBlur = 12; g.fillStyle = p.c; g.fillText(p.t, p.x, p.y); } else if (p.k === 'c') { g.shadowColor = p.c; g.shadowBlur = 10; g.fillStyle = p.c; g.beginPath(); g.arc(p.x, p.y, p.r, 0, 7); g.fill(); } else { g.translate(p.x, p.y); g.rotate(p.rot); g.fillStyle = p.c; g.fillRect(-p.w / 2, -p.w / 4, p.w, p.w / 2); } g.restore(); }); }
    L.tono = function (f, v, d, tp) { try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume(); var o = ac.createOscillator(), gn = ac.createGain(); o.type = tp || 'sine'; o.frequency.value = f; gn.gain.setValueAtTime(v, ac.currentTime); gn.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d); o.connect(gn); gn.connect(ac.destination); o.start(); o.stop(ac.currentTime + d); } catch (e) {} };
    L.bien = function () { L.tono(660, 0.2, 0.2); setTimeout(function () { L.tono(880, 0.2, 0.3); }, 130); };
    L.mal = function () { L.tono(200, 0.15, 0.25); };
    L.cumplir = function (n) { if (L.hecho[n]) return; L.hecho[n] = true; L.bien(); L.confeti(); L.xp(100, L.W / 2, 90); L.flot('¡Misión cumplida!', L.W / 2, 60, '#8be8ae'); pintar(); if (cfg.voz && window.Narrar) Narrar.decir('ok', '¡Muy bien! Misión cumplida.'); };
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
    L.quizResp = function (k) { var q = L.q; if (!q || q.i >= q.n) return; var it = q.items[q.i], ok = it.a === k; (q.res = q.res || [])[q.i] = ok ? 1 : 0; if (ok) { q.ok++; L.racha++; L.mejorRacha = Math.max(L.mejorRacha, L.racha); q.msj = '✔ ¡Correcto!'; L.tono(740, 0.12, 0.15); L.chispas(L.W / 2, 160, '#8be8ae', 22); L.xp(10 + Math.min(L.racha - 1, 4) * 5, L.W / 2, 140); } else { L.racha = 0; q.msj = '✖ ' + (it.fb || 'Intenta recordarlo'); L.mal(); L.sacudir(7); hudPintar(); } q.i++; if (q.i >= q.n) { q.fin = true; if (q.ok >= q.need) L.cumplir(L.paso); } L.ctl(); };
    L.dibQuiz = function (fondo, col) {
      var q = L.q, g2 = g, W = L.W, H = L.H; if (fondo) { g2.fillStyle = fondo; g2.fillRect(0, 0, W, H); } col = col || '#cfe6ff'; if (!q) return;
      var cx = W / 2, c = g2.createLinearGradient(0, 60, 0, 330); c.addColorStop(0, 'rgba(255,255,255,.14)'); c.addColorStop(1, 'rgba(255,255,255,.04)');
      g2.save(); g2.fillStyle = c; g2.strokeStyle = 'rgba(127,240,228,.45)'; g2.lineWidth = 2; g2.shadowColor = 'rgba(79,209,197,.35)'; g2.shadowBlur = 24; g2.beginPath(); if (g2.roundRect) g2.roundRect(60, 50, W - 120, 290, 26); else g2.rect(60, 50, W - 120, 290); g2.fill(); g2.stroke(); g2.restore();
      for (var d = 0; d < q.n; d++) { var dx = cx + (d - (q.n - 1) / 2) * 26; g2.beginPath(); g2.arc(dx, 36, d === q.i && !q.fin ? 8 : 6, 0, 7); g2.fillStyle = d < q.i || q.fin ? (q.res && q.res[d] === 0 ? '#ff7b8a' : '#8be8ae') : d === q.i ? '#ffe08a' : 'rgba(255,255,255,.25)'; g2.fill(); }
      if (!q.fin) { var it = q.items[q.i]; if (it.e) L.emoji(it.e, cx, 135 + Math.sin(L.t * 2.2) * 5, 92); L.wrap(it.q, cx, it.e ? 250 : 175, W - 170, 32, col, 26); }
      else { var bien = q.ok >= q.need; L.emoji(bien ? '🏆' : '💪', cx, 130 + Math.sin(L.t * 3) * 6, 88); L.txt(bien ? '¡Muy bien! ' + q.ok + ' de ' + q.n : 'Aciertos: ' + q.ok + ' de ' + q.n + '. ¡Inténtalo otra vez!', cx, 240, bien ? '#8be8ae' : '#ffb3b3', 'center', 32); var est = Math.max(1, Math.round(q.ok / q.n * 3)); L.txt(bien ? '⭐'.repeat(est) + '☆'.repeat(3 - est) : '', cx, 285, '#ffd36b', 'center', 30); }
      L.txt(q.msj, cx, 316, q.msj.indexOf('✔') > -1 ? '#8be8ae' : '#ff9f9f', 'center', 22); L.txt('Pregunta ' + Math.min(q.n, q.i + 1) + ' de ' + q.n + (L.racha >= 2 ? '   🔥 racha ×' + L.racha : ''), cx, H - 16, '#9db8ff', 'center', 15);
    };
    L.quizBtns = function (opts, emojiMode) { opts.forEach(function (o, k) { if (emojiMode) L.op(o[0], o[1], function () { L.quizResp(k); }); else L.btn(o, function () { L.quizResp(k); }, 'btn'); }); if (L.q && L.q.fin && L.q.ok < L.q.need) L.btn('🔄 Reintentar', function () { cfg.reintentar(L); L.ctl(); }, 'btn'); };
    /* fondo animado: tipo 'espacio' | 'lab' | 'agua' | 'tierra' | 'cielo' | 'noche' */
    var TEMAS = { espacio: ['#0a0a24', '#02020a', '#7a5cff'], lab: ['#0c2238', '#050b14', '#4fd1c5'], agua: ['#0e4a7a', '#06192e', '#5cc8ff'], tierra: ['#2a1f14', '#0c0804', '#ffb36b'], cielo: ['#3a8fd9', '#bfe9ff', '#ffffff'], noche: ['#0a1030', '#1b1b4a', '#ffe08a'] };
    L.fondo = function (tipo, vel) {
      var T = TEMAS[tipo] || TEMAS.lab, W = L.W, H = L.H, t = L.t * (vel || 1), bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, T[0]); bg.addColorStop(1, T[1]); g.fillStyle = bg; g.fillRect(0, 0, W, H);
      var n = g.createRadialGradient(W * (0.3 + 0.2 * Math.sin(t * 0.15)), H * 0.35, 10, W * 0.5, H * 0.5, W * 0.7); n.addColorStop(0, T[2] + '33'); n.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = n; g.fillRect(0, 0, W, H);
      if (tipo === 'cielo') { for (var c = 0; c < 4; c++) { g.fillStyle = 'rgba(255,255,255,.55)'; var cx = ((t * 14 + c * 260) % (W + 240)) - 120; g.beginPath(); g.ellipse(cx, 70 + c * 38, 70, 20, 0, 0, 7); g.ellipse(cx + 40, 62 + c * 38, 46, 18, 0, 0, 7); g.fill(); } return; }
      if (tipo === 'agua') { for (var b = 0; b < 26; b++) { var bx = (b * 83) % W + Math.sin(t + b) * 10, by = H - ((t * (20 + b % 5 * 8) + b * 61) % (H + 20)); g.strokeStyle = 'rgba(160,220,255,.35)'; g.lineWidth = 1.5; g.beginPath(); g.arc(bx, by, 3 + b % 4, 0, 7); g.stroke(); } return; }
      for (var i = 0; i < 70; i++) { var tw = 0.25 + 0.6 * Math.abs(Math.sin(t * (0.6 + i % 5 * 0.2) + i)); g.fillStyle = 'rgba(255,255,255,' + tw + ')'; g.fillRect((i * 151.3) % W, (i * 67.7 + t * (3 + i % 4)) % H, i % 9 === 0 ? 3 : 2, i % 9 === 0 ? 3 : 2); }
      if (tipo === 'lab') { g.strokeStyle = 'rgba(79,209,197,.07)'; g.lineWidth = 1; for (var x = 0; x < W; x += 48) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (var y = 0; y < H; y += 48) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); } }
    };
    L.tarjeta = function (x, y, w, h, col) { g.save(); var c = g.createLinearGradient(x, y, x, y + h); c.addColorStop(0, 'rgba(255,255,255,.13)'); c.addColorStop(1, 'rgba(255,255,255,.04)'); g.fillStyle = c; g.strokeStyle = col || 'rgba(127,240,228,.4)'; g.lineWidth = 1.5; g.shadowColor = 'rgba(0,0,0,.4)'; g.shadowBlur = 16; g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, h, 18); else g.rect(x, y, w, h); g.fill(); g.shadowBlur = 0; g.stroke(); g.restore(); };
    L.barra = function (x, y, w, v, col, etq) { g.save(); g.fillStyle = 'rgba(255,255,255,.12)'; g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, 12, 6); else g.rect(x, y, w, 12); g.fill(); g.fillStyle = col || '#4fd1c5'; g.shadowColor = col || '#4fd1c5'; g.shadowBlur = 8; g.beginPath(); if (g.roundRect) g.roundRect(x, y, Math.max(8, w * Math.max(0, Math.min(1, v))), 12, 6); else g.rect(x, y, w * v, 12); g.fill(); g.restore(); if (etq) L.txt(etq, x, y - 6, '#cfe6ff', 'left', 13); };
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
    var pasosEl = $('pasos'); if (pasosEl && pasosEl.parentNode) { hud = document.createElement('div'); hud.className = 'hud'; pasosEl.parentNode.insertBefore(hud, pasosEl.nextSibling); hudPintar(); }
    var last = 0;
    function frame(ms) { var dt = Math.min(0.05, (ms - (last || ms)) / 1000); last = ms; L.t += dt; if (cfg.sim) cfg.sim(L, dt); fxMover(dt); if (g && cfg.draw) { g.setTransform(dpr, 0, 0, dpr, 0, 0); g.save(); if (L.shake > 0) g.translate((Math.random() - 0.5) * L.shake, (Math.random() - 0.5) * L.shake); cfg.draw(L, g, dt); g.restore(); fxDibujar(g); } requestAnimationFrame(frame); }
    window[cfg.hook] = Object.assign({ ir: ir, L: L, estado: function () { return { hecho: L.hecho.slice(), paso: L.paso }; }, avanzar: function (s) { for (var i = 0; i < s * 40; i++) { L.t += 0.025; if (cfg.sim) cfg.sim(L, 0.025); } } }, cfg.hooks ? cfg.hooks(L) : {});
    if (cfg.init) cfg.init(L);
    if (cfg.enter) cfg.enter(L, 0); L.ctl(); pintar(); if (!cfg.voz) { } requestAnimationFrame(frame);
    return L;
  };
})();
