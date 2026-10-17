/* Escena 3D nocturna: cielo, estrellas, dos lunas en movimiento, montañas, río, orillas y apoyos. */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import gsap from 'gsap';
import { aMundo } from './niveles.js';

export const Z_PLANO = 0.6;   // plano de la cercha delantera (donde se edita)

function rnd(n) { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function lienzo(w, h, f) { const c = document.createElement('canvas'); c.width = w; c.height = h; f(c.getContext('2d'), w, h); return c; }
function textura(c, rep) { const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; if (rep) t.repeat.set(rep[0], rep[1]); return t; }

export function texMadera() {
  return textura(lienzo(512, 128, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#d9a468'); gr.addColorStop(.5, '#c48a4f'); gr.addColorStop(1, '#a8703b');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 34; i++) { const y = rnd(i) * h; g.strokeStyle = `rgba(80,42,14,${.12 + rnd(i * 3) * .25})`; g.lineWidth = .6 + rnd(i * 5) * 1.6;
      g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(w * .3, y + (rnd(i + 9) - .5) * 10, w * .65, y + (rnd(i + 4) - .5) * 10, w, y); g.stroke(); }
    for (let k = 0; k < 3; k++) { const x = rnd(k * 7 + 2) * w, y = h * (.2 + rnd(k * 5) * .6); g.strokeStyle = 'rgba(60,28,8,.5)'; for (let r = 1; r <= 3; r++) { g.lineWidth = 1.2; g.beginPath(); g.ellipse(x, y, 5 * r, 3 * r, 0, 0, 6.283); g.stroke(); } }
  }));
}
function texRoca(rep) {
  return textura(lienzo(256, 256, (g, w, h) => {
    g.fillStyle = '#4b535c'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(${rnd(i) > .5 ? '255,255,255' : '0,0,0'},${.03 + rnd(i * 2) * .08})`; g.beginPath(); g.ellipse(rnd(i * 3) * w, rnd(i * 5) * h, 6 + rnd(i * 7) * 26, 3 + rnd(i * 11) * 10, 0, 0, 6.283); g.fill(); }
    for (let k = 0; k < 9; k++) { g.fillStyle = `rgba(${k % 2 ? '255,255,255' : '0,0,0'},.07)`; g.fillRect(0, k * 28 + rnd(k) * 10, w, 5 + rnd(k * 3) * 9); }
  }), rep);
}
function texConcreto(rep) {
  return textura(lienzo(256, 256, (g, w, h) => {
    g.fillStyle = '#8a929c'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(0,0,0,${rnd(i) * .07})`; g.fillRect(rnd(i * 2) * w, rnd(i * 3) * h, 2 + rnd(i) * 5, 2 + rnd(i * 5) * 5); }
    g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 2; g.strokeRect(2, 2, w - 4, h - 4);
  }), rep);
}
function texLuna() {
  return textura(lienzo(256, 256, (g, w, h) => {
    const gr = g.createRadialGradient(w * .4, h * .4, 10, w / 2, h / 2, w * .6); gr.addColorStop(0, '#f6f8ff'); gr.addColorStop(1, '#bcc7e0');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 26; i++) { const x = rnd(i * 3) * w, y = rnd(i * 5) * h, r = 5 + rnd(i * 7) * 22; g.fillStyle = `rgba(110,125,160,${.18 + rnd(i) * .2})`; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill(); g.fillStyle = 'rgba(255,255,255,.25)'; g.beginPath(); g.arc(x - r * .25, y - r * .25, r * .6, 0, 6.283); g.fill(); }
  }));
}
function texGlow(color) {
  return textura(lienzo(128, 128, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); gr.addColorStop(0, color); gr.addColorStop(.35, color.replace('1)', '.35)')); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }));
}

export function crearEscena(cont) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  cont.appendChild(renderer.domElement);
  renderer.domElement.style.display = 'block'; renderer.domElement.style.width = '100%'; renderer.domElement.style.height = '100%';

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0c1a38, 0.0075);
  const camera = new THREE.PerspectiveCamera(38, 1.6, 0.1, 400);
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.22;

  // controles: solo se activan en la vista 3D
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enabled = false; controls.enableDamping = true; controls.maxPolarAngle = Math.PI * 0.52; controls.minDistance = 6; controls.maxDistance = 34; controls.target.set(0, 3, 0);

  /* ---------- cielo ---------- */
  const cielo = new THREE.Mesh(new THREE.SphereGeometry(180, 32, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color(0x03060f) }, mid: { value: new THREE.Color(0x0a1a3a) }, hor: { value: new THREE.Color(0x27487d) }, glow: { value: new THREE.Color(0x4a2f7a) } },
    vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 mid; uniform vec3 hor; uniform vec3 glow; varying vec3 vP; void main(){ float h = clamp(normalize(vP).y,0.0,1.0); vec3 c = mix(hor,mid,smoothstep(0.0,0.32,h)); c = mix(c,top,smoothstep(0.25,0.95,h)); float gl = exp(-pow((normalize(vP).x-0.15)*1.6,2.0))*exp(-h*5.0); c += glow*gl*0.55; gl_FragColor = vec4(c,1.0); }'
  }));
  scene.add(cielo);
  const N = 2200, pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const u = rnd(i * 2 + 1) * 6.283, v = 0.02 + Math.pow(rnd(i * 3 + 7), 0.8) * 0.98, r = 150, s = Math.sqrt(1 - v * v);
    pos.set([Math.cos(u) * s * r, v * r, Math.sin(u) * s * r - 40], i * 3);
    const c = new THREE.Color().setHSL(0.58 + rnd(i) * 0.12, 0.4, 0.75 + rnd(i * 5) * 0.25); col.set([c.r, c.g, c.b], i * 3);
  }
  const gEst = new THREE.BufferGeometry(); gEst.setAttribute('position', new THREE.BufferAttribute(pos, 3)); gEst.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const estrellas = new THREE.Points(gEst, new THREE.PointsMaterial({ size: 1.5, vertexColors: true, transparent: true, opacity: 0.95, depthWrite: false, fog: false, sizeAttenuation: false }));
  scene.add(estrellas);

  /* ---------- lunas ---------- */
  function luna(radio, color, emi, glowColor, tamGlow) {
    const g = new THREE.Group();
    const m = new THREE.Mesh(new THREE.SphereGeometry(radio, 40, 24), new THREE.MeshStandardMaterial({ map: texLuna(), color, emissive: emi, emissiveMap: null, emissiveIntensity: 0.85, roughness: 1, fog: false }));
    g.add(m);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: texGlow(glowColor), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false }));
    sp.scale.setScalar(tamGlow); g.add(sp);
    scene.add(g); return g;
  }
  const luna1 = luna(3.4, 0xf2f5ff, 0x9fb2e8, 'rgba(180,200,255,1)', 26);
  const luna2 = luna(1.5, 0xd9ccff, 0x8f78d6, 'rgba(190,160,255,1)', 14);
  const lz1 = new THREE.DirectionalLight(0xc9d8ff, 1.5); lz1.castShadow = true;
  lz1.shadow.mapSize.set(2048, 2048); const sc = lz1.shadow.camera; sc.left = -16; sc.right = 16; sc.top = 14; sc.bottom = -12; sc.near = 1; sc.far = 120; lz1.shadow.bias = -0.0004;
  scene.add(lz1, lz1.target);
  const lz2 = new THREE.DirectionalLight(0xa98bff, 0.55); scene.add(lz2);
  scene.add(new THREE.HemisphereLight(0x6f8fd6, 0x0b1424, 0.5));

  /* ---------- montañas lejanas ---------- */
  const montanas = new THREE.Group();
  [[0x0a1730, -85, 22, 9], [0x0c1d3b, -105, 30, 7], [0x102448, -125, 36, 6]].forEach(([c, z, h, n], capa) => {
    for (let i = 0; i < 12; i++) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(14 + rnd(i + capa * 9) * 16, h * (.55 + rnd(i * 3 + capa) * .6), 5 + (i % 3), 1), new THREE.MeshStandardMaterial({ color: c, flatShading: true, roughness: 1 }));
      cone.position.set(-120 + i * 22 + rnd(i * 7 + capa) * 14, h * 0.2, z); cone.rotation.y = rnd(i) * 3; montanas.add(cone);
    }
  });
  scene.add(montanas);

  /* ---------- nubes bajas ---------- */
  const nubes = new THREE.Group();
  for (let i = 0; i < 7; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: texGlow('rgba(120,150,210,1)'), transparent: true, opacity: 0.16, depthWrite: false, fog: false }));
    s.scale.set(34 + rnd(i) * 22, 8 + rnd(i * 3) * 6, 1); s.position.set(-70 + i * 24, 16 + rnd(i * 5) * 12, -55 - rnd(i) * 20); nubes.add(s);
  }
  scene.add(nubes);

  /* ---------- nivel (terreno, río, apoyos, farolas) ---------- */
  const nivel = new THREE.Group(); scene.add(nivel);
  const puenteGrupo = new THREE.Group(); scene.add(puenteGrupo);
  let agua = null, aguaBase = null, luces = [];
  const mRoca = (rep) => new THREE.MeshStandardMaterial({ map: texRoca(rep), roughness: 0.95, color: 0xb8c0cc });
  const mPasto = new THREE.MeshStandardMaterial({ color: 0x1f4f3c, roughness: 1 });
  const mAsfalto = new THREE.MeshStandardMaterial({ color: 0x2b303b, roughness: 0.85 });
  const mConcreto = (rep) => new THREE.MeshStandardMaterial({ map: texConcreto(rep), roughness: 0.9, color: 0xc4cad3 });
  const mAcero = new THREE.MeshStandardMaterial({ color: 0x9db0cc, metalness: 0.85, roughness: 0.35 });
  function caja(w, h, d, mat, x, y, z, sombra = true) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.castShadow = sombra; m.receiveShadow = true; nivel.add(m); return m; }
  function limpiarNivel() { while (nivel.children.length) { const o = nivel.children.pop(); o.traverse((x) => { if (x.geometry) x.geometry.dispose(); if (x.material) { (Array.isArray(x.material) ? x.material : [x.material]).forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); }); } }); } luces.forEach((l) => scene.remove(l)); luces = []; agua = null; }
  function farola(x, y, z) {
    caja(0.12, 2.4, 0.12, mAcero, x, y + 1.2, z); caja(0.7, 0.1, 0.1, mAcero, x + 0.3, y + 2.4, z, false);
    const bulbo = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffe3b0 })); bulbo.position.set(x + 0.6, y + 2.3, z); nivel.add(bulbo);
    const l = new THREE.PointLight(0xffd9a0, 18, 11, 1.6); l.position.set(x + 0.6, y + 2.2, z); scene.add(l); luces.push(l);
  }
  function baranda(x0, x1, y, z) {
    caja(x1 - x0, 0.07, 0.07, mAcero, (x0 + x1) / 2, y + 0.85, z, false);
    for (let x = x0 + 0.3; x < x1; x += 1.3) caja(0.07, 0.8, 0.07, mAcero, x, y + 0.45, z, false);
  }
  function pedestal(a) {
    const w = aMundo(a.x, a.y);
    if (a.pared) return;
    caja(1.5, 0.7, 2.1, mConcreto([1, 1]), w.x, w.y - 0.55, 0);
    caja(1.0, 0.16, 1.9, mAcero, w.x, w.y - 0.12, 0);
    if (a.t === 'rodillo') for (const dx of [-0.32, 0, 0.32]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.7, 16), mAcero); c.rotation.x = Math.PI / 2; c.position.set(w.x + dx, w.y - 0.2, 0); c.castShadow = true; nivel.add(c); }
  }
  function construirNivel(niv) {
    limpiarNivel();
    const esPuente = niv.tipo === 'puente';
    if (esPuente) {
      const xi = Math.min(niv.apoyos[0].x, niv.apoyos[1].x) - 8, xd = Math.max(niv.apoyos[0].x, niv.apoyos[1].x) - 8, yTab = 7 - niv.yTab, prof = 60;
      for (const [x0, x1] of [[-60, xi], [xd, 60]]) {
        const ancho = x1 - x0, cx = (x0 + x1) / 2;
        const r = mRoca([ancho / 4, 5]); caja(ancho, 26, prof, r, cx, yTab - 13, 0);
        caja(ancho, 0.3, prof, mPasto, cx, yTab - 0.15, 0, false);
        caja(ancho, 0.14, 2.3, mAsfalto, cx, yTab + 0.07, 0, false);
        for (let x = x0 + 0.4; x < x1 - 0.3; x += 1.2) caja(0.5, 0.012, 0.07, new THREE.MeshBasicMaterial({ color: 0xe9eefc }), x, yTab + 0.145, 0, false);
        baranda(x0, x1, yTab, 1.2); baranda(x0, x1, yTab, -1.2);
      }
      farola(xi - 1.2, yTab, 1.6); farola(xd + 1.2, yTab, -1.6);
      // río
      const geo = new THREE.PlaneGeometry(xd - xi, prof, Math.max(8, Math.round((xd - xi) * 5)), 24); geo.rotateX(-Math.PI / 2);
      agua = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x0b3a6e, roughness: 0.16, metalness: 0.35, transparent: true, opacity: 0.93, emissive: 0x06223f, emissiveIntensity: 0.6 }));
      agua.position.set((xi + xd) / 2, yTab - 2, 0); agua.receiveShadow = true; nivel.add(agua);
      aguaBase = geo.attributes.position.array.slice();
      caja(xd - xi, 1, prof, new THREE.MeshStandardMaterial({ color: 0x071a30 }), (xi + xd) / 2, yTab - 6, 0, false);
    } else {
      caja(140, 24, 60, mRoca([30, 5]), 0, -12, 0); caja(140, 0.3, 60, mPasto, 0, -0.15, 0, false);
      for (let i = 0; i < 16; i++) { const x = -34 + i * 4.6 + rnd(i) * 2; if (Math.abs(x) < 3.8) continue; const t = new THREE.Mesh(new THREE.ConeGeometry(.9 + rnd(i * 3), 3.2 + rnd(i * 5) * 2, 7), new THREE.MeshStandardMaterial({ color: 0x0f3b32, roughness: 1, flatShading: true })); t.position.set(x, 1.6 + rnd(i * 5), -7 - rnd(i * 7) * 8); t.castShadow = true; nivel.add(t); }
      if (niv.pared) { const wx = 1 - 8; caja(40, 8.5, 8, mConcreto([8, 2]), wx - 20 - 0.0, 3.6, 0); }
    }
    niv.apoyos.forEach((a) => pedestal({ ...a, pared: niv.pared }));
    if (niv.pared) niv.apoyos.forEach((a) => { const w = aMundo(a.x, a.y); caja(0.35, 1.1, 1.9, mAcero, w.x - 0.3, w.y, 0); for (const dz of [-0.6, 0.6]) for (const dy of [-0.3, 0.3]) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), mAcero); b.position.set(w.x - 0.1, w.y + dy, dz); nivel.add(b); } });
    // el nivel libre y el cañón: un poco de niebla
    scene.fog.density = niv.id === 'canon' ? 0.0095 : 0.0075;
  }

  /* ---------- cámara ---------- */
  function distanciaFrontal() { const t = Math.tan((camera.fov * Math.PI) / 360); return Math.max(17.5, 9.8 / (t * camera.aspect)); }
  function vistaFrontal(animar = true) {
    const d = distanciaFrontal(), p = { x: 0, y: 3.4, z: d };
    controls.enabled = false;
    if (!animar) { camera.position.set(p.x, p.y, p.z); controls.target.set(0, 3.2, 0); camera.lookAt(0, 3.2, 0); return; }
    gsap.to(camera.position, { ...p, duration: 1.1, ease: 'power3.inOut', onUpdate: () => camera.lookAt(controls.target) });
    gsap.to(controls.target, { x: 0, y: 3.2, z: 0, duration: 1.1, ease: 'power3.inOut' });
  }
  function vista3D() {
    const d = distanciaFrontal();
    gsap.to(camera.position, { x: d * 0.55, y: 6.5, z: d * 0.72, duration: 1.3, ease: 'power3.inOut', onUpdate: () => camera.lookAt(controls.target), onComplete: () => { controls.enabled = true; } });
    gsap.to(controls.target, { x: 0, y: 2.4, z: 0, duration: 1.3, ease: 'power3.inOut' });
  }

  /* ---------- post-procesado ---------- */
  let composer = null;
  try {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(800, 500), 0.5, 0.7, 0.86));
    composer.addPass(new OutputPass());
  } catch (e) { composer = null; }

  function resize() {
    const w = Math.max(320, cont.clientWidth), h = Math.max(200, cont.clientHeight);
    renderer.setSize(w, h, false); if (composer) composer.setSize(w, h);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }

  const relojT = { v: 0 };
  function render(tiempo) {
    const t = tiempo / 1000; relojT.v = t;
    // las lunas se desplazan despacio por el cielo
    luna1.position.set(16 + 15 * Math.sin(t * 0.045), 27 + 3.5 * Math.sin(t * 0.045 + 1), -72);
    luna2.position.set(-24 + 10 * Math.sin(t * 0.075 + 2), 31 + 2.5 * Math.cos(t * 0.075), -82);
    luna1.children[0].rotation.y = t * 0.02; luna2.children[0].rotation.y = -t * 0.035;
    lz1.position.copy(luna1.position).multiplyScalar(0.55).add(new THREE.Vector3(0, 8, 28)); lz1.target.position.set(0, 1, 0);
    lz2.position.copy(luna2.position).multiplyScalar(0.5);
    estrellas.rotation.y = t * 0.0015; estrellas.material.opacity = 0.82 + 0.13 * Math.sin(t * 1.7);
    nubes.children.forEach((s, i) => { s.position.x += 0.004 * (1 + i * 0.2); if (s.position.x > 100) s.position.x = -100; });
    if (agua) {
      const a = agua.geometry.attributes.position;
      for (let i = 0; i < a.count; i++) { const x = aguaBase[i * 3], z = aguaBase[i * 3 + 2]; a.setY(i, Math.sin(x * 0.9 + t * 1.5) * 0.06 + Math.sin(z * 0.7 + t * 1.1) * 0.05); }
      a.needsUpdate = true; agua.geometry.computeVertexNormals();
    }
    controls.update();
    if (composer) composer.render(); else renderer.render(scene, camera);
  }

  return { renderer, scene, camera, controls, puenteGrupo, construirNivel, resize, render, vistaFrontal, vista3D, captura: () => { if (composer) composer.render(); else renderer.render(scene, camera); return renderer.domElement.toDataURL('image/png'); } };
}
