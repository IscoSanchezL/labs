/* Escena 3D de terror (Three.js + GSAP). Si algo falla, el juego usa la escena 2D. */
(function () {
  'use strict';
  var T = window.THREE, G = window.gsap;
  if (!T || !G) return;

  function rnd(a, b) { return a + Math.random() * (b - a); }

  /* ---------- Texturas hechas con canvas (sin imágenes externas) ---------- */
  function tex(w, h, draw, rx, ry) {
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    var t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = 4;
    if (rx) t.repeat.set(rx, ry || 1);
    return t;
  }
  function speckle(g, w, h, n, col, a) {
    for (var i = 0; i < n; i++) { g.fillStyle = 'rgba(' + col + ',' + (Math.random() * a).toFixed(3) + ')'; g.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1 + Math.random() * 2); }
  }
  function floorTex() {
    return tex(512, 512, function (g, w, h) {
      var n = 8, bw = w / n;
      for (var i = 0; i < n; i++) {
        var l = 14 + Math.random() * 10; g.fillStyle = 'hsl(24,' + (35 + Math.random() * 15) + '%,' + l + '%)'; g.fillRect(i * bw, 0, bw, h);
        for (var k = 0; k < 14; k++) { g.strokeStyle = 'rgba(0,0,0,' + (Math.random() * 0.25) + ')'; g.beginPath(); var x = i * bw + Math.random() * bw; g.moveTo(x, 0); g.lineTo(x + (Math.random() - 0.5) * 10, h); g.stroke(); }
        g.fillStyle = '#050204'; g.fillRect(i * bw, 0, 3, h);
      }
      for (var j = 0; j < 4; j++) { g.fillStyle = '#050204'; g.fillRect(0, Math.random() * h, w, 2); }
      speckle(g, w, h, 900, '0,0,0', 0.5);
      for (var s = 0; s < 3; s++) { var gr = g.createRadialGradient(Math.random() * w, Math.random() * h, 2, Math.random() * w, Math.random() * h, 60); gr.addColorStop(0, 'rgba(110,0,10,.55)'); gr.addColorStop(1, 'rgba(110,0,10,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }
    }, 1, 8);
  }
  function wallTex() {
    return tex(512, 512, function (g, w, h) {
      g.fillStyle = '#2b1824'; g.fillRect(0, 0, w, h);
      for (var x = 0; x < w; x += 64) { g.fillStyle = 'rgba(255,255,255,.035)'; g.fillRect(x, 0, 32, h); }
      for (var y = 32; y < h; y += 64) for (var xx = 32; xx < w; xx += 64) { g.fillStyle = 'rgba(0,0,0,.22)'; g.beginPath(); g.ellipse(xx, y, 9, 15, 0, 0, 7); g.fill(); }
      for (var i = 0; i < 7; i++) { var sx = Math.random() * w, gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(90,0,8,.0)'); gr.addColorStop(0.15, 'rgba(90,0,8,.7)'); gr.addColorStop(1, 'rgba(90,0,8,0)'); g.fillStyle = gr; g.fillRect(sx, 0, 2 + Math.random() * 5, h * (0.4 + Math.random() * 0.6)); }
      for (var m = 0; m < 5; m++) { var rg = g.createRadialGradient(Math.random() * w, Math.random() * h, 5, Math.random() * w, Math.random() * h, 90); rg.addColorStop(0, 'rgba(0,0,0,.55)'); rg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = rg; g.fillRect(0, 0, w, h); }
      speckle(g, w, h, 1200, '0,0,0', 0.45);
    }, 12, 1);
  }
  function ceilTex() { return tex(256, 256, function (g, w, h) { g.fillStyle = '#120a0e'; g.fillRect(0, 0, w, h); speckle(g, w, h, 900, '60,40,40', 0.3); for (var i = 0; i < 4; i++) { g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(0, i * 64, w, 3); } }, 2, 12); }
  function doorTex() {
    return tex(256, 512, function (g, w, h) {
      g.fillStyle = '#3a2010'; g.fillRect(0, 0, w, h);
      for (var i = 0; i < 6; i++) { g.fillStyle = 'hsl(24,45%,' + (14 + Math.random() * 8) + '%)'; g.fillRect(i * 42.6, 0, 40, h); g.fillStyle = '#0a0503'; g.fillRect(i * 42.6 + 40, 0, 3, h); }
      g.fillStyle = '#17110f'; g.fillRect(0, 90, w, 22); g.fillRect(0, h - 120, w, 22);
      for (var k = 0; k < 160; k++) { g.strokeStyle = 'rgba(0,0,0,' + Math.random() * 0.3 + ')'; g.beginPath(); var x = Math.random() * w; g.moveTo(x, Math.random() * h); g.lineTo(x + 3, Math.random() * h); g.stroke(); }
      g.fillStyle = 'rgba(120,0,10,.35)'; for (var d = 0; d < 6; d++) g.fillRect(Math.random() * w, 120, 3 + Math.random() * 4, 40 + Math.random() * 160);
    });
  }
  function portraitTex() {
    return tex(256, 320, function (g, w, h) {
      g.fillStyle = '#4a3418'; g.fillRect(0, 0, w, h); g.fillStyle = '#1a1410'; g.fillRect(14, 14, w - 28, h - 28);
      var bg = g.createRadialGradient(w / 2, h * 0.45, 10, w / 2, h * 0.45, 150); bg.addColorStop(0, '#3a2c26'); bg.addColorStop(1, '#0c0807'); g.fillStyle = bg; g.fillRect(14, 14, w - 28, h - 28);
      g.fillStyle = '#c8bfa8'; g.beginPath(); g.ellipse(w / 2, h * 0.42, 52, 70, 0, 0, 7); g.fill();
      g.fillStyle = '#0a0606'; g.beginPath(); g.ellipse(w / 2 - 20, h * 0.38, 9, 13, 0, 0, 7); g.ellipse(w / 2 + 20, h * 0.38, 9, 13, 0, 0, 7); g.fill();
      g.beginPath(); g.ellipse(w / 2, h * 0.54, 10, 18, 0, 0, 7); g.fill();
      g.fillStyle = '#0c0807'; g.fillRect(40, h * 0.7, w - 80, 120);
      speckle(g, w, h, 600, '0,0,0', 0.5);
    });
  }
  function glowTex(r, gg, b) {
    return tex(128, 128, function (g, w, h) { var gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.18, 'rgba(' + r + ',' + gg + ',' + b + ',.95)'); gr.addColorStop(1, 'rgba(' + r + ',' + gg + ',' + b + ',0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  }

  /* ---------- El fantasma ---------- */
  function makeGhost() {
    var grp = new T.Group();
    var prof = new T.SplineCurve([[1.05, 0], [1.05, 0.4], [1.0, 1.0], [0.93, 1.6], [0.93, 2.1], [0.92, 2.5], [0.8, 2.95], [0.55, 3.25], [0.25, 3.42], [0.001, 3.48]].map(function (p) { return new T.Vector2(p[0], p[1]); })).getPoints(70)
      .map(function (p) { return new T.Vector2(Math.max(0.001, p.x), p.y); });
    var geo = new T.LatheGeometry(prof, 56);
    var base = geo.attributes.position.array.slice();
    var mat = new T.MeshPhongMaterial({ color: 0xd8e6d2, emissive: 0x0d2414, specular: 0x7fa07f, shininess: 18, transparent: true, opacity: 0.94, side: T.DoubleSide });
    var body = new T.Mesh(geo, mat); grp.add(body);

    var black = new T.MeshBasicMaterial({ color: 0x030105 }), red = new T.MeshBasicMaterial({ color: 0xff2020 }), bone = new T.MeshPhongMaterial({ color: 0xf4f0dc, shininess: 40 });
    function sph(sx, sy, sz, m, x, y, z, rz) { var s = new T.Mesh(new T.SphereGeometry(1, 20, 16), m); s.scale.set(sx, sy, sz); s.position.set(x, y, z); if (rz) s.rotation.z = rz; grp.add(s); return s; }
    sph(0.25, 0.37, 0.14, black, -0.34, 2.55, 0.8, 0.25); sph(0.25, 0.37, 0.14, black, 0.34, 2.55, 0.8, -0.25);
    var pupils = [sph(0.075, 0.075, 0.05, red, -0.34, 2.52, 0.91), sph(0.075, 0.075, 0.05, red, 0.34, 2.52, 0.91)];
    var mouth = sph(0.4, 0.55, 0.15, black, 0, 1.78, 0.84);
    var teethTop = new T.Group(), teethBot = new T.Group(); grp.add(teethTop); grp.add(teethBot);
    for (var i = 0; i < 6; i++) {
      var x = -0.3 + i * 0.12, t1 = new T.Mesh(new T.ConeGeometry(0.05, 0.22 + Math.random() * 0.08, 6), bone); t1.rotation.x = Math.PI; t1.position.set(x, 2.14, 0.93 - Math.abs(x) * 0.25); teethTop.add(t1);
      var t2 = new T.Mesh(new T.ConeGeometry(0.05, 0.2 + Math.random() * 0.08, 6), bone); t2.position.set(x * 0.9, 1.42, 0.93 - Math.abs(x) * 0.25); teethBot.add(t2);
    }
    var tongue = sph(0.12, 0.05, 0.14, new T.MeshBasicMaterial({ color: 0x6a0010 }), 0, 1.5, 0.9);
    var glow = [], gt = glowTex(255, 30, 30);
    [-0.34, 0.34].forEach(function (x) { var s = new T.Sprite(new T.SpriteMaterial({ map: gt, blending: T.AdditiveBlending, transparent: true, depthWrite: false, fog: false, opacity: 0 })); s.scale.set(1.1, 1.1, 1); s.position.set(x, 2.52, 1.0); grp.add(s); glow.push(s); });

    var arms = [];
    [-1, 1].forEach(function (side) {
      var arm = new T.Group(); arm.position.set(side * 0.9, 2.0, 0.05);
      var up = new T.Mesh(new T.CylinderGeometry(0.07, 0.05, 1.7, 8), mat); up.position.y = -0.85; arm.add(up);
      var hand = new T.Mesh(new T.SphereGeometry(0.11, 10, 8), mat); hand.position.y = -1.72; arm.add(hand);
      for (var f = 0; f < 4; f++) { var fg = new T.Mesh(new T.ConeGeometry(0.028, 0.5, 6), mat); fg.rotation.x = Math.PI; fg.rotation.z = (f - 1.5) * 0.28; fg.position.set((f - 1.5) * 0.06, -2.0, 0); arm.add(fg); }
      arm.rotation.z = side * 0.12; grp.add(arm); arms.push({ g: arm, side: side });
    });
    var light = new T.PointLight(0xa8ffb8, 0, 7, 2); light.position.set(0, 2.4, 1.6); grp.add(light);
    return { grp: grp, geo: geo, base: base, mat: mat, mouth: mouth, teethBot: teethBot, tongue: tongue, glow: glow, arms: arms, light: light, pupils: pupils };
  }

  /* ---------- Murciélagos en 3D ---------- */
  var wingShape = (function () {
    var s = new T.Shape(), p = [[0, 0.05], [0.25, 0.3], [0.6, 0.45], [0.98, 0.34], [0.86, 0.1], [0.72, 0.2], [0.58, -0.02], [0.42, 0.08], [0.26, -0.2], [0, -0.1]];
    s.moveTo(p[0][0], p[0][1]); for (var i = 1; i < p.length; i++) s.lineTo(p[i][0], p[i][1]); s.closePath(); return new T.ShapeGeometry(s);
  })();
  function makeBat(m) {
    var g = new T.Group();
    var body = new T.Mesh(new T.SphereGeometry(0.11, 10, 8), m.dark); body.scale.set(0.9, 0.9, 1.5); g.add(body);
    var head = new T.Mesh(new T.SphereGeometry(0.075, 10, 8), m.dark); head.position.z = 0.19; g.add(head);
    [-1, 1].forEach(function (s) {
      var ear = new T.Mesh(new T.ConeGeometry(0.03, 0.1, 5), m.dark); ear.position.set(s * 0.045, 0.09, 0.2); g.add(ear);
      var eye = new T.Mesh(new T.SphereGeometry(0.014, 6, 6), m.red); eye.position.set(s * 0.035, 0.02, 0.25); g.add(eye);
    });
    var wings = [];
    [1, -1].forEach(function (s) { var w = new T.Group(); w.scale.x = s; w.position.set(s * 0.04, 0.02, 0.02); var mesh = new T.Mesh(wingShape, m.wing); mesh.rotation.y = 0; w.add(mesh); g.add(w); wings.push(w); });
    g.userData = { wings: wings, phase: Math.random() * 6, freq: rnd(14, 22), u: 0, a: null, b: null, c: null, roll: rnd(-0.6, 0.6), k: rnd(0.9, 2.2) };
    g.visible = false;
    return g;
  }
  function bez(o, a, b, c, u) { var i = 1 - u; o.set(i * i * a.x + 2 * i * u * b.x + u * u * c.x, i * i * a.y + 2 * i * u * b.y + u * u * c.y, i * i * a.z + 2 * i * u * b.z + u * u * c.z); return o; }

  /* ---------- Escena ---------- */
  function play(sc, opts) {
    opts = opts || {};
    var host = document.createElement('div'); host.className = 'sc3d';
    var w = sc.clientWidth || window.innerWidth, h = sc.clientHeight || window.innerHeight;
    var renderer;
    try {
      renderer = new T.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      if (!renderer.getContext()) throw new Error('sin WebGL');
    } catch (e) { return null; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6)); renderer.setSize(w, h); renderer.setClearColor(0x030108);
    host.appendChild(renderer.domElement);
    var grain = document.createElement('canvas'); grain.width = 480; grain.height = 270; grain.className = 'sc3-grain';
    var fade = document.createElement('div'); fade.className = 'sc3-fade';
    host.appendChild(grain); host.appendChild(fade);
    sc.insertBefore(host, sc.firstChild);

    var scene = new T.Scene(); scene.fog = new T.FogExp2(0x030108, 0.09);
    var cam = new T.PerspectiveCamera(62, w / h, 0.05, 60); cam.position.set(0, 1.6, 0); scene.add(cam);

    /* Pasillo */
    var wallM = new T.MeshPhongMaterial({ map: wallTex(), shininess: 4 });
    var floor = new T.Mesh(new T.PlaneGeometry(4.8, 40), new T.MeshPhongMaterial({ map: floorTex(), shininess: 40, specular: 0x331a1a })); floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, -18); scene.add(floor);
    var ceil = new T.Mesh(new T.PlaneGeometry(4.8, 40), new T.MeshPhongMaterial({ map: ceilTex(), shininess: 2 })); ceil.rotation.x = Math.PI / 2; ceil.position.set(0, 3.4, -18); scene.add(ceil);
    var wl = new T.Mesh(new T.PlaneGeometry(40, 3.4), wallM); wl.rotation.y = Math.PI / 2; wl.position.set(-2.4, 1.7, -18); scene.add(wl);
    var wr = new T.Mesh(new T.PlaneGeometry(40, 3.4), wallM); wr.rotation.y = -Math.PI / 2; wr.position.set(2.4, 1.7, -18); scene.add(wr);
    var endZ = -17.5;
    [[-1.6, 1.7, 1.6, 3.4], [1.6, 1.7, 1.6, 3.4], [0, 3.0, 1.6, 0.8]].forEach(function (b) {
      var m = new T.Mesh(new T.BoxGeometry(b[2] + 0.02, b[3], 0.3), new T.MeshPhongMaterial({ map: wallTex(), shininess: 2 })); m.position.set(b[0], b[1], endZ); scene.add(m);
    });
    var leafPivot = new T.Group(); leafPivot.position.set(-0.8, 0, endZ + 0.05); scene.add(leafPivot);
    var leaf = new T.Mesh(new T.BoxGeometry(1.6, 2.6, 0.08), new T.MeshPhongMaterial({ map: doorTex(), shininess: 6 })); leaf.position.set(0.8, 1.3, 0); leafPivot.add(leaf);
    var knob = new T.Mesh(new T.SphereGeometry(0.05, 10, 8), new T.MeshPhongMaterial({ color: 0xffd36b, shininess: 80 })); knob.position.set(1.4, 1.2, 0.07); leafPivot.add(knob);
    var back = new T.Mesh(new T.PlaneGeometry(8, 5), new T.MeshBasicMaterial({ color: 0x160208, fog: false })); back.position.set(0, 2, -22); scene.add(back);
    var doorGlow = new T.Sprite(new T.SpriteMaterial({ map: glowTex(255, 40, 30), blending: T.AdditiveBlending, transparent: true, depthWrite: false, fog: false, opacity: 0 })); doorGlow.scale.set(5, 5, 1); doorGlow.position.set(0, 1.4, -19); scene.add(doorGlow);
    var doorLight = new T.PointLight(0xff2a1a, 0, 18, 1.6); doorLight.position.set(0, 1.5, -18.5); scene.add(doorLight);

    // retratos
    var pt = portraitTex(), frames = [];
    [[-2.38, -4, 1], [-2.38, -8.5, -1], [-2.38, -13, 1], [2.38, -6.2, -1], [2.38, -11, 1]].forEach(function (p) {
      var m = new T.Mesh(new T.PlaneGeometry(0.9, 1.15), new T.MeshPhongMaterial({ map: pt, shininess: 30, emissive: 0x000000 }));
      m.position.set(p[0], 1.85, p[1]); m.rotation.y = p[0] < 0 ? Math.PI / 2 : -Math.PI / 2; m.rotation.z = p[2] * rnd(0.04, 0.14); scene.add(m); frames.push(m);
    });

    // luces
    scene.add(new T.AmbientLight(0x45304d, 0.5));
    var torch = new T.SpotLight(0xffe0b0, 1.5, 28, Math.PI / 5, 0.65, 1.1); torch.position.set(0, 0, 0); cam.add(torch); torch.target.position.set(0, 0, -10); cam.add(torch.target);

    var ghost = makeGhost(); ghost.grp.position.set(0, 0, -19); ghost.grp.scale.setScalar(0.8); scene.add(ghost.grp);

    // murciélagos
    var batMat = { dark: new T.MeshBasicMaterial({ color: 0x0a090c }), red: new T.MeshBasicMaterial({ color: 0xff3030, fog: false }), wing: new T.MeshBasicMaterial({ color: 0x120f14, side: T.DoubleSide }) };
    var bats = [], tmp = new T.Vector3(), tmp2 = new T.Vector3();
    for (var i = 0; i < 38; i++) {
      var b = makeBat(batMat), d = b.userData;
      d.a = new T.Vector3(rnd(-0.6, 0.6), rnd(0.8, 2.1), -17.4);
      d.b = new T.Vector3(rnd(-2, 2), rnd(0.5, 3), rnd(-11, -4));
      d.c = new T.Vector3(rnd(-2.2, 2.2), rnd(0.3, 3.2), rnd(-1.5, 3));
      b.scale.setScalar(rnd(0.9, 1.7)); scene.add(b); bats.push(b);
    }

    /* ---------- Estado animado por GSAP ---------- */
    var S = { shake: 0, torch: 1.5, jaw: 0, time: 0, fov: 62, flicker: 0, camZ: 0, lunged: false };
    var vig = sc.querySelector('.sc-vig'), flash = sc.querySelector('.sc-flash'), blood = sc.querySelector('.sc-blood'), boo = sc.querySelector('.sc-boo');
    G.set([vig, flash, boo], { opacity: 0 }); G.set(blood, { yPercent: -100 }); G.set(fade, { opacity: 1 });
    G.set(boo, { scale: 0.5 });

    var gctx = grain.getContext('2d'), gimg = gctx.createImageData(480, 270), gframe = 0;
    function update() {
      var dt = Math.min(G.ticker.deltaRatio() / 60, 0.05); S.time += dt || 0.016;
      var t = S.time;
      // fantasma: dobladillo ondulante y flotar
      var pos = ghost.geo.attributes.position, arr = pos.array, base = ghost.base;
      for (var i = 0; i < arr.length; i += 3) {
        var y = base[i + 1];
        if (y < 0.8) { var wgt = (0.8 - y) / 0.8, a = Math.atan2(base[i + 2], base[i]); arr[i + 1] = y + Math.sin(a * 6 + t * 3.2) * 0.14 * wgt + Math.sin(a * 3 - t * 2) * 0.06 * wgt; }
      }
      pos.needsUpdate = true;
      var j = S.jaw; ghost.mouth.scale.y = 0.3 + 0.35 * j + (j > 0.5 ? Math.sin(t * 60) * 0.05 : 0); ghost.teethBot.position.y = -0.22 * j; ghost.tongue.position.y = 1.5 - 0.22 * j;
      ghost.grp.rotation.z = Math.sin(t * 2.3) * 0.03; ghost.grp.rotation.y = (S.lunged ? Math.sin(t * 40) * 0.04 : Math.sin(t * 1.1) * 0.08);
      // murciélagos
      for (var k = 0; k < bats.length; k++) {
        var bt = bats[k], d = bt.userData;
        if (d.u > 0 && d.u < 1) {
          bt.visible = true; bez(bt.position, d.a, d.b, d.c, d.u);
          bez(tmp, d.a, d.b, d.c, Math.min(1, d.u + 0.02)); tmp2.copy(tmp).sub(bt.position);
          if (tmp2.lengthSq() > 1e-8) { bt.lookAt(tmp.copy(bt.position).add(tmp2)); }
          bt.rotateZ(d.roll + Math.sin(t * 3 + d.phase) * 0.3);
          var fl = Math.sin(t * d.freq + d.phase) * 0.95; d.wings[0].rotation.z = fl; d.wings[1].rotation.z = fl;
        } else bt.visible = false;
      }
      // cámara: balanceo suave + temblor
      var sh = S.shake;
      cam.position.set(Math.sin(t * 1.3) * 0.015 + (Math.random() - 0.5) * sh * 0.25, 1.6 + Math.sin(t * 2.1) * 0.012 + (Math.random() - 0.5) * sh * 0.25, S.camZ || 0);
      cam.rotation.z = (Math.random() - 0.5) * sh * 0.12; cam.rotation.x = (Math.random() - 0.5) * sh * 0.1; cam.rotation.y = (Math.random() - 0.5) * sh * 0.1;
      if (Math.abs(cam.fov - S.fov) > 0.01) { cam.fov = S.fov; cam.updateProjectionMatrix(); }
      // linterna con parpadeo
      torch.intensity = S.torch * (S.flicker > 0 ? (Math.random() > 0.45 ? 1 : 0.05) : 1);
      renderer.render(scene, cam);
      // grano de película
      if ((gframe++ & 1) === 0) { var dd = gimg.data; for (var q = 0; q < dd.length; q += 4) { var v = Math.random() * 255; dd[q] = dd[q + 1] = dd[q + 2] = v; dd[q + 3] = 255; } gctx.putImageData(gimg, 0, 0); }
    }
    G.ticker.add(update);

    /* ---------- Línea de tiempo ---------- */
    var tl = G.timeline();
    function knock(at) {
      tl.fromTo(S, { shake: 0.9 }, { shake: 0, duration: 0.3, ease: 'power2.out' }, at);
      tl.fromTo(leafPivot.rotation, { y: 0 }, { y: 0.05, duration: 0.07, yoyo: true, repeat: 1 }, at);
    }
    function flick(at, dur) { tl.set(S, { flicker: 1 }, at); tl.set(S, { flicker: 0 }, at + dur); }
    tl.to(fade, { opacity: 0, duration: 0.8, ease: 'power1.out' }, 0.05);
    knock(0.2); knock(0.6); knock(1.0);
    for (var hb = 0; hb < 5; hb++) { tl.to(S, { fov: 60.5, duration: 0.09, yoyo: true, repeat: 1 }, hb * 0.75); tl.fromTo(vig, { opacity: 0.2 }, { opacity: 0.55, duration: 0.12, yoyo: true, repeat: 1 }, hb * 0.75); }
    flick(0.75, 0.25); flick(1.85, 0.3); flick(2.9, 0.18);
    // la puerta se abre
    tl.to(leafPivot.rotation, { y: -1.95, duration: 1.9, ease: 'power2.inOut' }, 1.3);
    tl.to(doorLight, { intensity: 2.4, duration: 1.6, ease: 'power1.in' }, 1.4);
    tl.to(doorGlow.material, { opacity: 0.85, duration: 1.6 }, 1.4);
    tl.to(S, { camZ: -2.3, duration: 2.4, ease: 'sine.inOut' }, 1.3);
    // aparecen los ojos
    tl.to(ghost.glow.map(function (g) { return g.material; }), { opacity: 1, duration: 0.5 }, 2.3);
    tl.to(ghost.grp.position, { z: -12, duration: 1.35, ease: 'none' }, 2.35);
    tl.to(ghost.glow.map(function (g) { return g.material; }), { opacity: 0.1, duration: 0.06, yoyo: true, repeat: 1 }, 2.9);
    tl.to(S, { shake: 0.08, duration: 1.2 }, 2.4);
    // ATAQUE
    tl.set(S, { lunged: true }, 3.7);
    tl.to(ghost.grp.position, { z: -4.9, y: -0.55, duration: 0.26, ease: 'power4.in' }, 3.7);
    tl.to(ghost.grp.scale, { x: 1.05, y: 1.05, z: 1.05, duration: 0.26, ease: 'power4.in' }, 3.7);
    tl.to(ghost.light, { intensity: 1.1, duration: 0.15 }, 3.75);
    tl.to(ghost.grp.position, { z: -4.4, duration: 1.3, ease: 'power1.in' }, 4.0);
    tl.to(S, { fov: 90, duration: 0.26, ease: 'power4.in' }, 3.7);
    tl.to(S, { fov: 68, duration: 0.9, ease: 'power2.out' }, 3.96);
    tl.set(S, { shake: 1.6 }, 3.96); tl.to(S, { shake: 0.25, duration: 1.2, ease: 'power2.out' }, 3.96);
    tl.set(flash, { opacity: 0.95 }, 3.94); tl.to(flash, { opacity: 0, duration: 0.5, ease: 'power2.out' }, 3.98);
    tl.to(ghost.glow.map(function (g) { return g.material; }), { opacity: 0.6, duration: 0.2 }, 3.9);
    ghost.arms.forEach(function (a) { tl.to(a.g.rotation, { x: -1.45, z: a.side * 0.45, duration: 0.25, ease: 'back.out(2)' }, 3.78); tl.to(a.g.rotation, { x: -1.3, duration: 0.12, yoyo: true, repeat: 6 }, 4.1); });
    tl.to(S, { jaw: 1, duration: 0.15, ease: 'power3.out' }, 3.86);
    tl.to(vig, { opacity: 1, duration: 0.2 }, 3.95);
    tl.fromTo(blood, { yPercent: -100 }, { yPercent: 0, duration: 2.8, ease: 'power2.in' }, 4.0);
    tl.to(boo, { opacity: 1, scale: 1.15, duration: 0.14, ease: 'power3.out' }, 4.0); tl.to(boo, { scale: 1, duration: 1.0 }, 4.14); tl.to(boo, { opacity: 0, duration: 0.5 }, 5.1);
    // murciélagos
    bats.forEach(function (b, i) { tl.to(b.userData, { u: 1, duration: rnd(1.3, 2.5), ease: 'power1.in' }, 3.9 + (i / bats.length) * 1.6); });
    // el fantasma se va por encima
    tl.to(ghost.grp.position, { y: 3.4, z: -1.6, duration: 0.9, ease: 'power2.in' }, 5.3);
    tl.to(ghost.light, { intensity: 0, duration: 0.6 }, 5.6);
    tl.to(doorLight, { intensity: 0.8, duration: 1 }, 5.3);
    tl.to(fade, { opacity: 1, duration: 0.8, ease: 'power1.in' }, 6.75);
    tl.call(function () { stop(); if (opts.onDone) opts.onDone(); }, null, 7.6);

    function onResize() { var ww = sc.clientWidth || window.innerWidth, hh = sc.clientHeight || window.innerHeight; renderer.setSize(ww, hh); cam.aspect = ww / hh; cam.updateProjectionMatrix(); }
    window.addEventListener('resize', onResize);
    var stopped = false;
    function stop() {
      if (stopped) return; stopped = true;
      tl.kill(); G.ticker.remove(update); G.killTweensOf([S, fade, vig, flash, blood, boo]); window.removeEventListener('resize', onResize);
      try { renderer.dispose(); if (renderer.forceContextLoss) renderer.forceContextLoss(); } catch (e) { /* nada */ }
      host.remove(); G.set([vig, flash, boo, blood], { clearProps: 'all' });
    }
    if (opts.onStart) opts.onStart();
    var inst = { stop: stop, seek: function (s) { tl.pause(); tl.time(s, false); } };
    window.ScareScene.last = inst;
    return inst;
  }

  window.ScareScene = { play: play };
})();
