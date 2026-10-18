/* Vista 3D para los laboratorios STEM (Three.js r128): lienzo transparente encima del #cv, con giro automático y arrastre.
   Uso: var V = Vista3D({ z: 9, fov: 40 }); V.grupo.add(...); V.anim(function (dt, t) {}); V.mostrar(true|false);  Devuelve null si el navegador no soporta WebGL. */
(function () {
  'use strict';
  window.Vista3D = function (o) {
    o = o || {}; var T = window.THREE, cv = document.getElementById(o.cv || 'cv'); if (!T || !cv) return null;
    var c3 = document.createElement('canvas'); c3.className = 'cv3'; cv.parentNode.style.position = 'relative'; cv.parentNode.appendChild(c3);
    var r; try { r = new T.WebGLRenderer({ canvas: c3, alpha: true, antialias: true }); } catch (e) { c3.remove(); return null; }
    r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); r.setClearColor(0x000000, 0);
    var sc = new T.Scene(), cam = new T.PerspectiveCamera(o.fov || 40, 2, 0.1, 100); cam.position.set(0, 0, o.z || 9);
    sc.add(new T.AmbientLight(0xffffff, 0.55)); var l1 = new T.PointLight(0xffffff, 1.1, 60); l1.position.set(6, 8, 10); sc.add(l1); var l2 = new T.PointLight(0x7fe6ff, 0.7, 60); l2.position.set(-8, -4, 6); sc.add(l2);
    var grupo = new T.Group(); sc.add(grupo);
    var V = { scene: sc, camera: cam, grupo: grupo, renderer: r, canvas: c3, auto: o.auto === undefined ? 0.35 : o.auto, vx: 0, vy: 0, vis: true, fns: [] }, drag = false, px = 0, py = 0, t = 0, last = 0;
    function ajustar() { var b = cv.getBoundingClientRect(); c3.style.width = b.width + 'px'; c3.style.height = b.height + 'px'; c3.style.left = (cv.offsetLeft) + 'px'; c3.style.top = (cv.offsetTop) + 'px'; r.setSize(b.width, b.height, false); cam.aspect = b.width / Math.max(1, b.height); cam.updateProjectionMatrix(); }
    ajustar(); if (window.ResizeObserver) new ResizeObserver(ajustar).observe(cv); window.addEventListener('resize', ajustar);
    c3.addEventListener('pointerdown', function (e) { drag = true; px = e.clientX; py = e.clientY; try { c3.setPointerCapture(e.pointerId); } catch (x) {} });
    c3.addEventListener('pointermove', function (e) { if (!drag) return; V.vy += (e.clientX - px) * 0.01; V.vx += (e.clientY - py) * 0.01; px = e.clientX; py = e.clientY; });
    c3.addEventListener('pointerup', function () { drag = false; }); c3.addEventListener('pointercancel', function () { drag = false; });
    V.mostrar = function (v) { V.vis = !!v; c3.style.display = v ? 'block' : 'none'; };
    V.anim = function (fn) { V.fns.push(fn); };
    V.cil = function (a, b, rad, mat) { var d = new T.Vector3().subVectors(b, a), m = new T.Mesh(new T.CylinderGeometry(rad, rad, d.length(), 10), mat); m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.clone().normalize()); return m; };
    V.mat = function (col, em) { return new T.MeshStandardMaterial({ color: col, emissive: em === undefined ? col : em, emissiveIntensity: 0.25, roughness: 0.35, metalness: 0.2 }); };
    function loop(ms) { var dt = Math.min(0.05, (ms - (last || ms)) / 1000); last = ms; t += dt; if (V.vis) { if (o.eje === 'x') { if (!drag) grupo.rotation.x += V.auto * dt; grupo.rotation.x += V.vy; grupo.rotation.y = Math.max(-0.9, Math.min(0.9, grupo.rotation.y + V.vx)); } else { if (!drag) grupo.rotation.y += V.auto * dt; grupo.rotation.y += V.vy; grupo.rotation.x = Math.max(-1.1, Math.min(1.1, grupo.rotation.x + V.vx)); } V.vx = V.vy = 0; V.fns.forEach(function (f) { f(dt, t); }); r.render(sc, cam); } requestAnimationFrame(loop); }
    requestAnimationFrame(loop); return V;
  };
})();
