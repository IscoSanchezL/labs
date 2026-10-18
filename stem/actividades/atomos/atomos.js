/* Átomos y moléculas (5°, solo español, sin voz): arrastra átomos, forman enlaces según su valencia y se reconoce la molécula. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var cv = $('cv'), g = cv.getContext('2d'), W = cv.width, H = cv.height;
  var EL = {
    H: { n: 'Hidrógeno', v: 1, r: 22, c: '#f4f8ff', c2: '#aab8d4', f: 'Es el átomo más pequeño y liviano. Forma 1 enlace.' },
    C: { n: 'Carbono', v: 4, r: 32, c: '#8a93a6', c2: '#2a3040', f: 'Base de la vida. Puede formar 4 enlaces.' },
    N: { n: 'Nitrógeno', v: 3, r: 30, c: '#6d8dff', c2: '#1d2f8a', f: 'Es el 78 % del aire. Forma 3 enlaces.' },
    O: { n: 'Oxígeno', v: 2, r: 29, c: '#ff6b6b', c2: '#8a1a1a', f: 'Lo respiramos. Forma 2 enlaces.' }
  };
  var MOL = { H2O: 'Agua', CO2: 'Dióxido de carbono', CH4: 'Metano', NH3: 'Amoníaco', O2: 'Oxígeno (gas)', N2: 'Nitrógeno (gas)', H2: 'Hidrógeno (gas)', C2H6: 'Etano', HCN: 'Cianuro de hidrógeno' };
  var SUB = { 2: '₂', 3: '₃', 4: '₄', 6: '₆' };
  var PASOS = [
    { n: 'Los átomos', t: '1. Los ladrillos de la materia', x: 'Todo está hecho de <b>átomos</b>. Cada tipo tiene un número de <b>enlaces</b> que puede formar (su valencia). Toca cada átomo de la mesa para conocerlo.', m: 'Pon un átomo de cada tipo (H, C, N, O) y tócalo para ver sus datos.', d: 'Un solo gramo de agua tiene unos 33 000 trillones de moléculas.' },
    { n: 'Arma moléculas', t: '2. Une átomos y forma moléculas', x: 'Cuando los átomos se juntan y completan todos sus enlaces forman una <b>molécula</b>. Arrastra los átomos para acercarlos: se enlazan solos. Si falta o sobra un enlace, la molécula no está completa.', m: 'Arma agua (H₂O), dióxido de carbono (CO₂) y metano (CH₄).', d: 'El agua es H₂O: dos átomos de hidrógeno y uno de oxígeno.' },
    { n: 'Gases y fertilizante', t: '3. Enlaces dobles y triples', x: 'A veces dos átomos comparten <b>más de un enlace</b>. El oxígeno del aire (O₂) tiene un enlace doble y el nitrógeno (N₂) uno triple, muy fuerte.', m: 'Arma oxígeno (O₂), nitrógeno (N₂) y amoníaco (NH₃).', d: 'El amoníaco (NH₃) se usa para fabricar fertilizantes que ayudan a cultivar alimentos.' }
  ];
  var OBJ = [null, ['H2O', 'CO2', 'CH4'], ['O2', 'N2', 'NH3']];
  var paso = 0, hecho = [false, false, false], atomos = [], enl = [], sel = null, drag = null, tocadosEl = {}, hechas = {}, msj = '', tiempo = 0, ult = [];
  var ac = null, ID = 1, V3 = window.Vista3D ? Vista3D({ z: 9, fov: 40, auto: 0, fijo: true }) : null;
  function tono(f, v, d) { try { var C = window.AudioContext || window.webkitAudioContext; if (!ac) ac = new C(); if (ac.state === 'suspended') ac.resume(); var o = ac.createOscillator(), gn = ac.createGain(); o.type = 'sine'; o.frequency.value = f; gn.gain.setValueAtTime(v, ac.currentTime); gn.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d); o.connect(gn); gn.connect(ac.destination); o.start(); o.stop(ac.currentTime + d); } catch (e) {} }
  function ex() { tono(660, 0.2, 0.2); setTimeout(function () { tono(880, 0.2, 0.3); }, 130); }
  function cumplir(n) { if (hecho[n]) return; hecho[n] = true; ex(); if (window.STEMFX) STEMFX.exito(); pintar(); }
  function agregar(s, x, y) { var a = { id: ID++, s: s, x: x, y: y, vx: 0, vy: 0 }; atomos.push(a); return a; }
  function libre(a) { var u = 0; enl.forEach(function (b) { if (b.a === a || b.b === a) u += b.o; }); return EL[a.s].v - u; }
  function recomputar() {
    enl = []; var pares = [];
    for (var i = 0; i < atomos.length; i++) for (var j = i + 1; j < atomos.length; j++) { var A = atomos[i], B = atomos[j], d = Math.hypot(A.x - B.x, A.y - B.y), lim = EL[A.s].r + EL[B.s].r + 44; if (d < lim) pares.push([d, A, B]); }
    pares.sort(function (p, q) { return p[0] - q[0]; });
    pares.forEach(function (p) { var o = Math.min(libre(p[1]), libre(p[2])); if (o > 0) enl.push({ a: p[1], b: p[2], o: o }); });
    evaluar();
  }
  function componentes() {
    var vis = {}, res = [];
    atomos.forEach(function (a) { if (vis[a.id]) return; var comp = [], pila = [a]; vis[a.id] = 1; while (pila.length) { var u = pila.pop(); comp.push(u); enl.forEach(function (b) { var o = b.a === u ? b.b : b.b === u ? b.a : null; if (o && !vis[o.id]) { vis[o.id] = 1; pila.push(o); } }); } res.push(comp); });
    return res;
  }
  function formula(comp) { var c = {}; comp.forEach(function (a) { c[a.s] = (c[a.s] || 0) + 1; }); var orden = c.C ? ['C', 'H', 'N', 'O'] : ['N', 'H', 'O']; return orden.filter(function (k) { return c[k]; }).map(function (k) { return k + (c[k] > 1 ? c[k] : ''); }).join(''); }
  function evaluar() {
    ult = []; componentes().forEach(function (comp) {
      if (comp.length < 2) return; var comp0 = comp.every(function (a) { return libre(a) === 0; }); var f = formula(comp);
      var key = f === 'HCN' ? 'HCN' : f; var nombre = MOL[key];
      if (comp0 && nombre) { ult.push({ f: key, n: nombre, comp: comp }); if (!hechas[key]) { hechas[key] = 1; tono(740, 0.14, 0.2); } }
    });
    var obj = OBJ[paso]; if (obj && obj.every(function (k) { return hechas[k]; })) cumplir(paso);
  }
  function bonito(f) { return f.replace(/(\d)/g, function (d) { return SUB[d] || d; }); }
  function xy(e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; }
  function pick(x, y) { for (var i = atomos.length - 1; i >= 0; i--) { var a = atomos[i]; if (Math.hypot(x - a.x, y - a.y) < EL[a.s].r + 4) return a; } return null; }
  cv.addEventListener('pointerdown', function (e) { var q = xy(e), a = pick(q[0], q[1]); if (a) { drag = { a: a, dx: q[0] - a.x, dy: q[1] - a.y, mov: false }; sel = a; cv.setPointerCapture(e.pointerId); if (paso === 0) { tocadosEl[a.s] = 1; if (Object.keys(tocadosEl).length >= 4) cumplir(0); } tono(420, 0.08, 0.1); } else sel = null; });
  cv.addEventListener('pointermove', function (e) { if (!drag) return; var q = xy(e); drag.a.x = Math.max(30, Math.min(W - 30, q[0] - drag.dx)); drag.a.y = Math.max(30, Math.min(H - 30, q[1] - drag.dy)); drag.mov = true; });
  function soltar() { if (!drag) return; drag = null; separar(); recomputar(); }
  cv.addEventListener('pointerup', soltar); cv.addEventListener('pointercancel', soltar);
  function separar() { for (var it = 0; it < 8; it++) for (var i = 0; i < atomos.length; i++) for (var j = i + 1; j < atomos.length; j++) { var A = atomos[i], B = atomos[j], dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy) || 1, m = EL[A.s].r + EL[B.s].r + 20; if (d < m) { var k = (m - d) / 2; A.x -= dx / d * k; A.y -= dy / d * k; B.x += dx / d * k; B.y += dy / d * k; } } }
  function esfera(a, sc) {
    var el = EL[a.s], r = el.r * (sc || 1), gr = g.createRadialGradient(a.x - r * 0.35, a.y - r * 0.4, r * 0.1, a.x, a.y, r); gr.addColorStop(0, '#fff'); gr.addColorStop(0.25, el.c); gr.addColorStop(1, el.c2);
    g.save(); if (sel === a) { g.shadowColor = '#7ff0e4'; g.shadowBlur = 26; } g.fillStyle = gr; g.beginPath(); g.arc(a.x, a.y, r, 0, 7); g.fill(); g.restore();
    g.fillStyle = a.s === 'H' ? '#26304a' : '#fff'; g.font = '700 ' + Math.round(r * 0.9) + 'px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(a.s, a.x, a.y + 1);
    var lib = libre(a); for (var k = 0; k < lib; k++) { var an = -Math.PI / 2 + (k - (lib - 1) / 2) * 0.7 + tiempo * 0.4; g.fillStyle = '#ffe08a'; g.beginPath(); g.arc(a.x + Math.cos(an) * (r + 9), a.y + Math.sin(an) * (r + 9), 4, 0, 7); g.fill(); }
  }
  function dibujar(ms) {
    tiempo = ms / 1000;
    var bg = g.createRadialGradient(480, 230, 40, 480, 230, 520); bg.addColorStop(0, '#0f2038'); bg.addColorStop(1, '#040913'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.strokeStyle = 'rgba(127,240,228,.07)'; for (var x = 0; x < W; x += 48) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (var y = 0; y < H; y += 48) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    // molécula completa: halo
    ult.forEach(function (m) { var cx = 0, cy = 0; m.comp.forEach(function (a) { cx += a.x; cy += a.y; }); cx /= m.comp.length; cy /= m.comp.length; var rr = 0; m.comp.forEach(function (a) { rr = Math.max(rr, Math.hypot(a.x - cx, a.y - cy) + EL[a.s].r + 14); }); var hg = g.createRadialGradient(cx, cy, 10, cx, cy, rr + 20); hg.addColorStop(0, 'rgba(139,232,174,.22)'); hg.addColorStop(1, 'rgba(139,232,174,0)'); g.fillStyle = hg; g.beginPath(); g.arc(cx, cy, rr + 20, 0, 7); g.fill(); });
    if (!V3) enl.forEach(function (b) { var dx = b.b.x - b.a.x, dy = b.b.y - b.a.y, d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d; for (var k = 0; k < b.o; k++) { var off = (k - (b.o - 1) / 2) * 9; g.strokeStyle = '#cfe6ff'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(b.a.x + nx * off, b.a.y + ny * off); g.lineTo(b.b.x + nx * off, b.b.y + ny * off); g.stroke(); } });
    if (!V3) atomos.forEach(function (a) { esfera(a); });
    ult.forEach(function (m) { var cx = 0, cy = 0; m.comp.forEach(function (a) { cx += a.x; cy += a.y; }); cx /= m.comp.length; var top = 1e9; m.comp.forEach(function (a) { top = Math.min(top, a.y - EL[a.s].r); }); g.fillStyle = 'rgba(4,9,19,.85)'; var tx = bonito(m.f) + ' · ' + m.n; g.font = '700 18px "Space Grotesk",system-ui,sans-serif'; var w = g.measureText(tx).width + 20; g.fillRect(cx - w / 2, top - 44, w, 28); g.fillStyle = '#8be8ae'; g.textAlign = 'center'; g.fillText(tx, cx, top - 25); });
    // panel de datos
    g.textAlign = 'left'; if (sel && atomos.indexOf(sel) >= 0) { var el = EL[sel.s]; g.fillStyle = 'rgba(4,9,19,.8)'; g.fillRect(14, 14, 330, 70); g.fillStyle = '#7ff0e4'; g.font = '700 18px "Space Grotesk",system-ui,sans-serif'; g.fillText(el.n + ' (' + sel.s + ') · ' + el.v + (el.v === 1 ? ' enlace' : ' enlaces'), 26, 40); g.fillStyle = '#cfe6ff'; g.font = '500 14px "Space Grotesk",system-ui,sans-serif'; g.fillText(el.f, 26, 66); }
    if (paso > 0 && OBJ[paso]) { var obj = OBJ[paso]; g.fillStyle = 'rgba(4,9,19,.8)'; g.fillRect(W - 250, 14, 236, 30 + obj.length * 28); g.fillStyle = '#ffe08a'; g.font = '700 15px "JetBrains Mono",monospace'; g.textAlign = 'left'; g.fillText('RETOS', W - 238, 36); obj.forEach(function (k, i) { g.fillStyle = hechas[k] ? '#8be8ae' : '#cfe6ff'; g.fillText((hechas[k] ? '✔ ' : '○ ') + bonito(k) + ' ' + MOL[k], W - 238, 62 + i * 28); }); }
    if (!atomos.length) { g.fillStyle = '#7fa6c8'; g.font = '600 20px "Space Grotesk",system-ui,sans-serif'; g.textAlign = 'center'; g.fillText('Agrega átomos con los botones de abajo y arrástralos', W / 2, H / 2); }
    requestAnimationFrame(dibujar);
  }
  function ctl() {
    var c = $('ctl'); c.textContent = '';
    function btn(txt, fn, cls) { var b = document.createElement('button'); b.type = 'button'; b.className = cls || 'btn sec'; b.textContent = txt; b.onclick = fn; c.appendChild(b); }
    ['H', 'C', 'N', 'O'].forEach(function (s) { btn('+ ' + s + ' ' + EL[s].n, function () { agregar(s, 150 + Math.random() * 660, 150 + Math.random() * 230); separar(); recomputar(); tono(520, 0.1, 0.12); }, 'btn'); });
    btn('🗑 Limpiar', function () { atomos = []; enl = []; ult = []; sel = null; }, 'btn sec');
  }
  function pintar() {
    var p = $('pasos'); p.textContent = '';
    PASOS.forEach(function (Q, i) { var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (hecho[i] ? ' hecho' : ''); b.setAttribute('aria-pressed', String(i === paso)); b.innerHTML = '<b>' + (hecho[i] ? '✓' : i + 1) + '</b>' + Q.n; b.onclick = function () { ir(i); }; p.appendChild(b); });
    var Q = PASOS[paso]; $('tit').textContent = Q.t; $('txt').innerHTML = Q.x; $('misTxt').textContent = hecho[paso] ? '¡Muy bien! Misión cumplida ✔' : Q.m; $('dato').textContent = '💡 ' + Q.d;
    $('mis').className = 'mision' + (hecho[paso] ? ' ok' : ''); $('bAnt').disabled = paso === 0; $('bSig').disabled = paso === 2; $('fin').className = 'fin' + (hecho.every(Boolean) ? ' v' : '');
  }
  function ir(n) { paso = n; atomos = []; enl = []; ult = []; sel = null; ctl(); pintar(); }
  $('bAnt').onclick = function () { if (paso > 0) ir(paso - 1); }; $('bSig').onclick = function () { if (paso < 2) ir(paso + 1); };
  window.__atomos = { ir: ir, add: function (s, x, y) { var a = agregar(s, x, y); return a.id; }, tocar: function (id) { var a = atomos.filter(function (q) { return q.id === id; })[0]; if (a) { sel = a; tocadosEl[a.s] = 1; if (Object.keys(tocadosEl).length >= 4) cumplir(0); } }, resolver: function () { separar(); recomputar(); }, limpiar: function () { atomos = []; enl = []; ult = []; }, formulas: function () { return ult.map(function (m) { return m.f; }); }, estado: function () { return { hecho: hecho.slice(), hechas: Object.keys(hechas) }; } };
  /* ---------- átomos y enlaces en 3D (sincronizados con el modelo 2D) ---------- */
  if (V3) {
    var T = THREE, K = 0.01424, mallas = {}, tex = {}, bonos = [], pool = new T.Group(), geoB = new T.CylinderGeometry(1, 1, 1, 12), geoS = new T.SphereGeometry(1, 32, 24), geoV = new T.SphereGeometry(1, 10, 8);
    V3.grupo.add(pool);
    var letra = function (s) { if (!tex[s]) tex[s] = V3.textura(64, 64, function (c) { c.fillStyle = s === 'H' ? '#26304a' : '#ffffff'; c.font = '700 46px "Space Grotesk",system-ui,sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(s, 32, 36); }); return tex[s]; };
    var X = function (x) { return (x - 480) * K; }, Y = function (y) { return (230 - y) * K; };
    V3.anim(function (dt, t) {
      var vivos = {}; atomos.forEach(function (a) {
        vivos[a.id] = 1; var m = mallas[a.id], el = EL[a.s], r = el.r * K;
        if (!m) { m = mallas[a.id] = { g: new T.Group(), s: new T.Mesh(geoS, new T.MeshStandardMaterial({ color: el.c, emissive: el.c2, emissiveIntensity: 0.3, roughness: 0.25, metalness: 0.15 })), l: new T.Sprite(new T.SpriteMaterial({ map: letra(a.s), transparent: true, depthTest: false })), v: [] }; m.l.renderOrder = 5; m.g.add(m.s, m.l); for (var i = 0; i < 4; i++) { var p = new T.Mesh(geoV, new T.MeshBasicMaterial({ color: 0xffe08a })); p.scale.setScalar(0.05); m.g.add(p); m.v.push(p); } pool.add(m.g); }
        m.g.position.set(X(a.x), Y(a.y), 0); m.s.scale.setScalar(r); m.l.scale.set(r * 1.6, r * 1.6, 1); m.l.position.set(0, 0, r * 1.05); var on = sel === a; m.s.material.emissiveIntensity += ((on ? 1.1 : 0.3) - m.s.material.emissiveIntensity) * Math.min(1, dt * 12);
        var lib = Math.max(0, libre(a)); m.v.forEach(function (p, k) { p.visible = k < lib; if (k < lib) { var an = -Math.PI / 2 + (k - (lib - 1) / 2) * 0.7 + t * 0.4; p.position.set(Math.cos(an) * (r + 0.25), Math.sin(an) * (r + 0.25), 0.1); } });
      });
      Object.keys(mallas).forEach(function (id) { if (!vivos[id]) { pool.remove(mallas[id].g); delete mallas[id]; } });
      var n = 0; enl.forEach(function (b) { var ax = X(b.a.x), ay = Y(b.a.y), bx = X(b.b.x), by = Y(b.b.y), d = Math.hypot(bx - ax, by - ay) || 1, nx = -(by - ay) / d, ny = (bx - ax) / d;
        for (var k = 0; k < b.o; k++) { var off = (k - (b.o - 1) / 2) * 0.17, c = bonos[n]; if (!c) { c = bonos[n] = new T.Mesh(geoB, new T.MeshStandardMaterial({ color: 0xcfe6ff, emissive: 0x6a8aaa, emissiveIntensity: 0.4, roughness: 0.3 })); pool.add(c); } c.visible = true; n++;
          var p1 = new T.Vector3(ax + nx * off, ay + ny * off, 0), p2 = new T.Vector3(bx + nx * off, by + ny * off, 0), dv = new T.Vector3().subVectors(p2, p1); c.position.copy(p1).addScaledVector(dv, 0.5); c.scale.set(0.05, dv.length(), 0.05); c.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dv.normalize()); } });
      for (var j = n; j < bonos.length; j++) bonos[j].visible = false;
    });
  }
  ctl(); pintar(); requestAnimationFrame(dibujar);
})();
