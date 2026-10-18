/* Lanzamiento de cohetes (5°, solo español, sin voz): empuje, etapas y velocidad orbital. */
var G = 9.8;
function simularCohete(twr, etapas) {
  var masas = { 1: [100], 2: [70, 30], 3: [55, 30, 15] }[etapas], h = 0, v = 0, t = 0, dt = 0.5, pts = [[0, 0]], quemado = false;
  for (var k = 0; k < etapas; k++) {
    var m = masas.slice(k).reduce(function (a, b) { return a + b; }, 0), fuel = masas[k] * 0.75, dry = masas[k] * 0.25, empuje = twr * G * m, tasa = fuel / 40, tb = 0;
    while (tb < 40) { var a = empuje / m - G; v += a * dt; h += v * dt; m -= tasa * dt; tb += dt; t += dt; pts.push([t, h / 1000]); }
    m -= dry; // se suelta la etapa vacía
  }
  var ap = h + (v > 0 ? v * v / (2 * G) : 0); return { apogeo: ap / 1000, vmax: v, pts: pts, t: t };
}
var V3 = null, K3 = null, RK = { y: 400, p: null, apo: 0 };
var LAB = LabKit({
  reto: true, hook: '__coh',
  pasos: [
    { n: 'Acción y reacción', t: '1. Un cohete empuja gases', x: 'Un cohete se mueve porque <b>expulsa gases hacia abajo</b> y, por acción y reacción, esos gases lo empujan hacia arriba. Para despegar, el empuje debe ser <b>mayor que el peso</b>: eso se mide con la relación empuje/peso (TWR).', m: 'Lanza un cohete de una etapa que alcance más de 20 km de altura.', d: 'Los cohetes funcionan en el vacío del espacio: no necesitan aire para empujarse.' },
    { n: 'Etapas', t: '2. Etapas: soltar peso', x: 'Un cohete de una sola etapa carga su tanque vacío hasta el final. Con <b>varias etapas</b> se van soltando los tanques vacíos y el cohete se vuelve más liviano, así llega mucho más alto.', m: 'Alcanza más de 250 km de altura (con una sola etapa no se logra: prueba 2 o 3).', d: 'El cohete Saturno V, que llevó al ser humano a la Luna, tenía 3 etapas.' },
    { n: 'Órbita', t: '3. La velocidad que no deja caer', x: 'Un satélite no flota: <b>cae constantemente</b> alrededor de la Tierra, pero va tan rápido de lado que siempre la «falla». Para orbitar a baja altura necesita unos <b>7,9 km/s</b>.', m: 'Ajusta la velocidad lateral del satélite para dejarlo en órbita circular (entre 7,6 y 8,2 km/s).', d: 'La Estación Espacial Internacional da una vuelta a la Tierra cada 90 minutos, a 28 000 km/h.' }
  ],
  enter: function (L, n) { var S = L.S; S.twr = 1.8; S.et = 1; S.res = null; S.v = 6; S.o = null; S.tl = 0; S.vuelo = null; },
  ctl: function (L) {
    var S = L.S;
    if (L.paso === 0) { L.rango('🔥 Empuje/peso (TWR)', 0.8, 3, 0.1, S.twr, function (v) { S.twr = v; }); L.btn('🚀 ¡Lanzar!', function () { lanzar(L, 1); }, 'btn grande'); }
    if (L.paso === 1) { L.rango('🔥 Empuje/peso (TWR)', 1, 3, 0.1, S.twr, function (v) { S.twr = v; }); [1, 2, 3].forEach(function (n) { L.btn(n + (n === 1 ? ' etapa' : ' etapas'), function () { S.et = n; L.ctl(); }, 'tab', S.et === n); }); L.btn('🚀 ¡Lanzar!', function () { lanzar(L, S.et); }, 'btn grande'); }
    if (L.paso === 2) { L.rango('🛰️ Velocidad lateral (km/s)', 3, 12, 0.1, S.v, function (v) { S.v = v; S.o = null; }); L.btn('🛰️ Soltar satélite', function () { orbitar(L); }, 'btn grande'); }
  },
  sim: function (L, dt) { var S = L.S; if (S.vuelo) { S.vuelo.t += dt * 8; if (S.vuelo.t >= S.res.t * 1.0 + 40) S.vuelo.fin = true; } if (S.o) S.tl += dt; },
  draw: function (L, g) {
    var S = L.S, W = L.W, H = L.H; L.fondo('espacio');
    if (L.paso < 2) {
      if (!V3) { g.fillStyle = '#3a6a3a'; g.fillRect(0, 410, W, 50); } var altKm = 0, apo = S.res ? S.res.apogeo : 0, p = S.vuelo ? S.vuelo : null;
      if (p && S.res) { var idx = Math.min(S.res.pts.length - 1, Math.floor(p.t / 0.5)); altKm = idx >= S.res.pts.length - 1 ? Math.max(0, apo * Math.min(1, (p.t - S.res.t) / 40 + 0.0)) : S.res.pts[idx][1]; if (p.t > S.res.t) altKm = apo; }
      var escala = Math.max(40, apo * 1.1, 60), y = 400 - Math.min(360, altKm / escala * 360); RK = { y: y, p: p, apo: apo, alt: altKm }; if (!V3) { L.emoji('🚀', 480, y, 56); if (p && !p.fin && altKm < apo - 0.5) { g.fillStyle = '#ffb347'; g.beginPath(); g.moveTo(468, y + 34); g.lineTo(480, y + 34 + 40 + Math.random() * 20); g.lineTo(492, y + 34); g.fill(); } }
      g.strokeStyle = 'rgba(255,255,255,.25)'; g.setLineDash([6, 6]); g.lineWidth = 2; [[20, '20 km'], [100, '100 km (espacio)'], [250, '250 km']].forEach(function (m) { var yy = 400 - m[0] / escala * 360; if (yy > 30) { g.beginPath(); g.moveTo(80, yy); g.lineTo(880, yy); g.stroke(); L.txt(m[1], 120, yy - 6, '#9db8ff', 'center', 14); } }); g.setLineDash([]);
      L.txt(S.res ? 'Altura máxima: ' + S.res.apogeo.toFixed(0) + ' km' : 'Ajusta y lanza el cohete', W / 2, 40, '#ffe08a', 'center', 24); if (S.res && p && p.fin) L.txt(S.res.apogeo > (L.paso === 0 ? 20 : 250) ? '✔ ¡Meta lograda!' : '✖ No alcanzó la meta: cambia el empuje' + (L.paso === 1 ? ' o las etapas' : ''), W / 2, 80, S.res.apogeo > (L.paso === 0 ? 20 : 250) ? '#8be8ae' : '#ff9f9f', 'center', 20); if (S.res && S.res.apogeo < 0.5 && p) L.txt('No despega: el empuje es menor que el peso', W / 2, 80, '#ff9f9f', 'center', 20);
    } else {
      var cx = 480, cy = 250, Rt = 70; if (!V3) { var gt = g.createRadialGradient(cx - 14, cy - 14, 6, cx, cy, Rt); gt.addColorStop(0, '#6fb8ff'); gt.addColorStop(1, '#1d4f9a'); g.fillStyle = gt; g.beginPath(); g.arc(cx, cy, Rt, 0, 7); g.fill(); g.fillStyle = '#3fbf6a'; g.beginPath(); g.ellipse(cx - 20, cy - 12, 22, 14, 0.4, 0, 7); g.fill(); }
      var v = S.v, r0 = 96; g.strokeStyle = 'rgba(157,184,255,.3)'; g.setLineDash([5, 7]); g.beginPath(); g.arc(cx, cy, r0, 0, 7); g.stroke(); g.setLineDash([]);
      // trayectoria por integración simple (unidades: Tierra radio = 1, v circular = 7.9)
      var mu = 62.4 * 1.0, x = r0 / Rt * 1, y = 0, vx = 0, vy = -v / 7.9 * Math.sqrt(1 / (r0 / Rt)) * 1.0; var pts = [], dt = 0.02, choca = false, sx = r0 / Rt, sy = 0; var px = sx, py = 0, pvx = 0, pvy = -v / 7.9 * Math.sqrt(1 / sx);
      for (var k = 0; k < 4000; k++) { var rr = Math.sqrt(px * px + py * py), a3 = 1 / (rr * rr * rr); pvx += -px * a3 * dt; pvy += -py * a3 * dt; px += pvx * dt; py += pvy * dt; pts.push([cx + px * Rt, cy + py * Rt]); if (Math.sqrt(px * px + py * py) < 1) { choca = true; break; } if (Math.abs(px) > 6 || Math.abs(py) > 6) break; }
      g.save(); g.strokeStyle = choca ? '#ff9f9f' : (v >= 7.6 && v <= 8.2 ? '#8be8ae' : '#ffe08a'); g.lineWidth = 3; g.shadowColor = g.strokeStyle; g.shadowBlur = 10; g.beginPath(); pts.forEach(function (p, i) { if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); }); g.stroke(); g.restore(); L.emoji('🛰️', cx + r0, cy, 30);
      var est = choca ? '💥 Cae a la Tierra (muy lento)' : v >= 11.2 ? '🚀 Escapa de la Tierra' : v >= 7.6 && v <= 8.2 ? '✔ Órbita casi circular' : v > 8.2 ? '⭕ Órbita alargada (elíptica)' : '↘ Órbita baja';
      L.txt('Velocidad lateral: ' + v.toFixed(1) + ' km/s', W / 2, 40, '#ffe08a', 'center', 22); L.txt(est, W / 2, 76, choca ? '#ff9f9f' : '#8be8ae', 'center', 20); L.txt('Velocidad circular ≈ 7,9 km/s · de escape ≈ 11,2 km/s', W / 2, 438, '#9db8ff', 'center', 15);
    }
  },
  hooks: function (L) { return { lanzar: function (e) { lanzar(L, e); }, twr: function (v) { L.S.twr = v; }, orbitar: function (v) { L.S.v = v; orbitar(L); }, sim: function (twr, e) { return simularCohete(twr, e).apogeo; } }; }
});
function lanzar(L, et) { var S = L.S; S.res = simularCohete(S.twr, et); S.vuelo = { t: 0, fin: false }; L.tono(90, 0.3, 1.2, 'sawtooth'); if (S.res.apogeo > (L.paso === 0 ? 20 : 250)) setTimeout(function () { L.cumplir(L.paso); }, 700); }
function orbitar(L) { var S = L.S; S.o = true; if (S.v >= 7.6 && S.v <= 8.2) L.cumplir(2); }

/* ---------- cohete y Tierra en 3D ---------- */
function iniciar3d() {
  var V = window.Vista3D ? Vista3D({ z: 9, fov: 40, auto: 0, fijo: true }) : null; if (!V) return; V3 = V; var T = THREE;
  V.camera.position.set(0, 0, 9); V.mostrar(true);
  var brillo = V.textura(64, 64, function (c, w, h) { var g2 = c.createRadialGradient(32, 32, 2, 32, 32, 32); g2.addColorStop(0, 'rgba(255,255,255,1)'); g2.addColorStop(0.4, 'rgba(255,255,255,.5)'); g2.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g2; c.fillRect(0, 0, w, h); });
  function sp(col, sz) { var m = new T.Sprite(new T.SpriteMaterial({ map: brillo, color: col, transparent: true, blending: T.AdditiveBlending, depthWrite: false })); m.scale.set(sz, sz, 1); return m; }
  var tex = V.textura(512, 256, function (c, w, h) { c.fillStyle = '#1d5fb8'; c.fillRect(0, 0, w, h); c.fillStyle = '#3fbf6a'; for (var i = 0; i < 18; i++) { c.beginPath(); c.ellipse(Math.random() * w, 30 + Math.random() * (h - 60), 14 + Math.random() * 40, 8 + Math.random() * 22, Math.random() * 3, 0, 7); c.fill(); } c.fillStyle = 'rgba(255,255,255,.35)'; for (var j = 0; j < 40; j++) { c.beginPath(); c.ellipse(Math.random() * w, Math.random() * h, 10 + Math.random() * 30, 3 + Math.random() * 6, 0, 0, 7); c.fill(); } });
  var tierra = new T.Mesh(new T.SphereGeometry(1, 64, 48), new T.MeshLambertMaterial({ map: tex })), aire = new T.Mesh(new T.SphereGeometry(1.06, 48, 36), new T.MeshBasicMaterial({ color: 0x6fb8ff, transparent: true, opacity: 0.16, side: T.BackSide })); V.scene.add(tierra, aire);
  var cohete = new T.Group(), cuerpos = [], metal = V.mat(0xf2f4f8, 0x222a38), rojo = V.mat(0xff5a4a, 0x551510);
  for (var e = 0; e < 3; e++) { var seg = new T.Group(), cy = new T.Mesh(new T.CylinderGeometry(0.2 - e * 0.025, 0.22 - e * 0.025, 0.75, 20), metal); seg.add(cy); for (var a = 0; a < 3; a++) { var aleta = new T.Mesh(new T.BoxGeometry(0.02, 0.32, 0.2), rojo); aleta.position.set(Math.cos(a * 2.094) * 0.27, -0.22, Math.sin(a * 2.094) * 0.27); aleta.rotation.y = -a * 2.094; seg.add(aleta); } seg.position.y = -e * 0.78; cohete.add(seg); cuerpos.push(seg); }
  var nariz = new T.Mesh(new T.ConeGeometry(0.2, 0.5, 20), rojo); nariz.position.y = 0.62; cohete.add(nariz);
  var llama = new T.Group(), c1 = new T.Mesh(new T.ConeGeometry(0.17, 1, 16, 1, true), new T.MeshBasicMaterial({ color: 0xffb347, transparent: true, opacity: 0.85, blending: T.AdditiveBlending, depthWrite: false })); c1.rotation.x = Math.PI; c1.position.y = -0.5; llama.add(c1, sp(0xffd9a0, 1.2)); cohete.add(llama); V.scene.add(cohete);
  var humo = []; for (var h = 0; h < 40; h++) { var m = new T.Sprite(new T.SpriteMaterial({ map: brillo, color: 0xb8c0cc, transparent: true, opacity: 0, depthWrite: false })); m.scale.set(0.5, 0.5, 1); V.scene.add(m); humo.push({ m: m, v: 0 }); }
  var caida = [];
  K3 = { tierra: tierra, aire: aire, cohete: cohete, cuerpos: cuerpos, llama: llama, c1: c1, humo: humo, caida: caida, hi: 0, ult: -1 };
  var k = 0.01424;
  V.anim(function (dt, t) {
    var L = LAB, S = L.S; tierra.rotation.y += dt * 0.15;
    if (L.paso === 2) { tierra.visible = aire.visible = true; tierra.position.set(0, -0.28, 0); aire.position.copy(tierra.position); tierra.scale.setScalar(0.997); aire.scale.setScalar(0.997); cohete.visible = false; humo.forEach(function (h) { h.m.material.opacity = 0; }); return; }
    tierra.visible = aire.visible = true; var R = 60; tierra.scale.setScalar(R); aire.scale.setScalar(R * 0.995); tierra.position.set(0, -2.5 - R, 0); aire.position.copy(tierra.position);
    var p = RK.p, wy = (230 - RK.y) * k; cohete.visible = true; cohete.position.set(0, wy, 0);
    var et = S.res ? (L.paso === 0 ? 1 : S.et) : (L.paso === 0 ? 1 : S.et), tq = p ? Math.floor(p.t / 40) : 0, enVuelo = p && !p.fin && RK.alt < RK.apo - 0.5;
    cuerpos.forEach(function (c, i) { c.visible = i < et && i >= Math.min(tq, et - 1) && true; });
    cuerpos.forEach(function (c, i) { c.position.y = -(i - Math.min(tq, et - 1)) * 0.78; });
    if (K3.ult !== tq && p && tq > 0 && tq < et) { var fall = cuerpos[tq - 1].clone(); fall.position.set(0, wy - 0.78, 0); fall.visible = true; V.scene.add(fall); caida.push({ m: fall, v: 0 }); }
    K3.ult = p ? tq : -1; if (!p) { caida.forEach(function (c) { V.scene.remove(c.m); }); caida.length = 0; }
    caida.forEach(function (c) { c.v += dt * 3; c.m.position.y -= c.v * dt; c.m.rotation.z += dt; });
    llama.visible = !!enVuelo; llama.position.y = -0.38 - 0.78 * (et - 1 - Math.min(tq, et - 1)); c1.scale.set(1, 0.8 + 0.5 * Math.random(), 1);
    if (enVuelo) { var h = humo[K3.hi++ % humo.length]; h.v = 1; h.m.position.set((Math.random() - 0.5) * 0.15, wy + llama.position.y - 0.6, 0); h.m.scale.set(0.35, 0.35, 1); }
    humo.forEach(function (h) { if (h.v > 0) { h.v -= dt * 0.6; h.m.material.opacity = Math.max(0, h.v) * 0.45; h.m.scale.multiplyScalar(1 + dt * 0.9); } else h.m.material.opacity = 0; });
    cohete.rotation.z = enVuelo ? 0.01 * Math.sin(t * 30) : 0;
  });
}
iniciar3d();
