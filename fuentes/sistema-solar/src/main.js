import './estilos.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import gsap from 'gsap';
import { PLANETAS, SOL, PREGUNTAS } from './datos.js';
import * as TX from './texturas.js';

const $ = (id) => document.getElementById(id);
const cont = $('vista'), visor = $('visor');
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
cont.appendChild(renderer.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x01030a);
const camera = new THREE.PerspectiveCamera(42, 16 / 9, 0.1, 3000);
const VISTA_GENERAL = { pos: new THREE.Vector3(0, 70, 150), tgt: new THREE.Vector3(0, 0, 0) };
camera.position.copy(VISTA_GENERAL.pos);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = 0.06; controls.minDistance = 3; controls.maxDistance = 420; controls.target.copy(VISTA_GENERAL.tgt);
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.7, 0.8, 0.82); composer.addPass(bloom); composer.addPass(new OutputPass());

/* estrellas */
{
  const n = 2600, pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const r = 900 + Math.random() * 900, th = Math.random() * 6.283, ph = Math.acos(2 * Math.random() - 1); pos.set([r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th)], i * 3); const c = new THREE.Color().setHSL(0.55 + Math.random() * 0.15, 0.4, 0.7 + Math.random() * 0.3); col.set([c.r, c.g, c.b], i * 3); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({ size: 2.2, sizeAttenuation: false, vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false })));
}
scene.add(new THREE.AmbientLight(0x8aa0c8, 0.9));
const luzCamara = new THREE.DirectionalLight(0xdfe9ff, 1.1); scene.add(luzCamara); scene.add(luzCamara.target);

/* Sol */
const sol = new THREE.Group(); scene.add(sol);
const solMesh = new THREE.Mesh(new THREE.SphereGeometry(SOL.r, 64, 48), new THREE.MeshBasicMaterial({ map: TX.texSol() })); sol.add(solMesh);
const brillo = new THREE.Sprite(new THREE.SpriteMaterial({ map: TX.texBrillo(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); brillo.scale.setScalar(SOL.r * 4.6); sol.add(brillo);
const luzSol = new THREE.PointLight(0xfff0d0, 3.2, 0, 0); luzSol.decay = 0; sol.add(luzSol);
solMesh.userData.cuerpo = SOL;

/* planetas */
function atmosfera(r, color, fuerza = 1) {
  return new THREE.Mesh(new THREE.SphereGeometry(r * 1.06, 48, 32), new THREE.ShaderMaterial({
    uniforms: { c: { value: new THREE.Color(color) }, k: { value: fuerza } }, transparent: true, blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false,
    vertexShader: 'varying vec3 n; varying vec3 v; void main(){ n = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.); v = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }',
    fragmentShader: 'uniform vec3 c; uniform float k; varying vec3 n; varying vec3 v; void main(){ float f = pow(1.0 - abs(dot(n,v)), 2.6); gl_FragColor = vec4(c, f*k); }'
  }));
}
function textura(p) {
  switch (p.id) {
    case 'mercurio': return TX.texRocoso('#8d8780', '#5a5650', '#bdb6ad', 1, 90);
    case 'venus': return TX.texVenus();
    case 'tierra': return TX.texTierra();
    case 'marte': return TX.texRocoso('#b9603c', '#7d3a22', '#e2956a', 7, 40);
    case 'jupiter': return TX.texBandas(['#e9d9bf', '#c4986b', '#efe2cd', '#b57d55', '#e4cfae', '#a86a45', '#d9c19a'], 3, 0.045, true);
    case 'saturno': return TX.texBandas(['#f0e2bd', '#d9c08a', '#efe0b6', '#cfb57c', '#ead9ad'], 5, 0.03);
    case 'urano': return TX.texBandas(['#a9ecee', '#92dde2', '#a9ecee', '#86d3da'], 7, 0.015);
    default: return TX.texBandas(['#4d6dff', '#3a55e0', '#5c7cff', '#2d44c4', '#4d6dff'], 9, 0.03);
  }
}
const cuerpos = [], ray = [];
PLANETAS.forEach((p, i) => {
  const grupo = new THREE.Group(), mat = new THREE.MeshStandardMaterial({ map: textura(p), roughness: 0.92, metalness: 0 });
  const malla = new THREE.Mesh(new THREE.SphereGeometry(p.r, 64, 48), mat); malla.userData.cuerpo = p; grupo.add(malla);
  if (p.id === 'tierra') { const nubes = new THREE.Mesh(new THREE.SphereGeometry(p.r * 1.012, 48, 32), new THREE.MeshStandardMaterial({ map: TX.texNubes(), transparent: true, opacity: 0.85, roughness: 1, depthWrite: false })); grupo.add(nubes); p._nubes = nubes; grupo.add(atmosfera(p.r, 0x5fa8ff, 1.3)); }
  if (p.id === 'venus') grupo.add(atmosfera(p.r, 0xffe3a0, 0.9));
  if (p.id === 'marte') grupo.add(atmosfera(p.r, 0xff9a6a, 0.35));
  if (p.id === 'urano') grupo.add(atmosfera(p.r, 0x9ff2ff, 0.8));
  if (p.id === 'neptuno') grupo.add(atmosfera(p.r, 0x5f86ff, 0.9));
  if (p.id === 'saturno') { const anillo = new THREE.Mesh(new THREE.RingGeometry(p.r * 1.25, p.r * 2.35, 128), new THREE.MeshBasicMaterial({ map: TX.texAnillo(), transparent: true, side: THREE.DoubleSide, depthWrite: false })); const uv = anillo.geometry.attributes.uv, pos = anillo.geometry.attributes.position; for (let k = 0; k < uv.count; k++) { const rr = Math.hypot(pos.getX(k), pos.getY(k)); uv.setXY(k, (rr - p.r * 1.25) / (p.r * 1.1), 0.5); } anillo.rotation.x = -Math.PI / 2.3; grupo.add(anillo); p._anillo = anillo; grupo.rotation.z = 0.2; }
  if (p.id === 'urano') grupo.rotation.z = 1.7;
  if (p.id === 'tierra') { const luna = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 16), new THREE.MeshStandardMaterial({ map: TX.texRocoso('#9a9a9a', '#6b6b6b', '#c9c9c9', 3, 40), roughness: 1 })); scene.add(luna); p._luna = luna; }
  scene.add(grupo);
  const pts = []; for (let k = 0; k <= 256; k++) pts.push(new THREE.Vector3(Math.cos(k / 256 * 6.2832) * p.a, 0, Math.sin(k / 256 * 6.2832) * p.a)); const orb = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x7ff0e4, transparent: true, opacity: 0.22 })); scene.add(orb);
  p._g = grupo; p._m = malla; p._orb = orb; p._ang = (i * 1.7) % 6.283; p._visto = false;
  grupo.position.set(Math.cos(p._ang) * p.a, 0, Math.sin(p._ang) * p.a);
  cuerpos.push(p); ray.push(malla);
});
ray.push(solMesh);

/* etiquetas y lista */
const etiquetas = $('etiquetas'), lista = $('lista');
const todos = [SOL, ...PLANETAS];
todos.forEach((c) => {
  const e = document.createElement('div'); e.className = 'etq'; e.textContent = c.n; etiquetas.appendChild(e); c._etq = e;
  const b = document.createElement('button'); b.type = 'button'; b.innerHTML = `<i style="background:${c.color};color:${c.color}"></i>${c.n}<span class="v">✓</span>`; b.onclick = () => seleccionar(c); lista.appendChild(b); c._btn = b;
});

/* estado */
let sel = null, velocidad = 1, comparando = false, ultimaPos = new THREE.Vector3(), t = 0;
const M = { visitar: 4, comparado: false, reto: false };
function misiones() {
  const vis = cuerpos.filter((p) => p._visto).length;
  const m = $('misiones'); m.textContent = '';
  [[`Visita 4 planetas (${Math.min(vis, 4)}/4)`, vis >= 4], ['Compara los tamaños reales', M.comparado], ['Supera el reto final', M.reto]].forEach(([txt, ok]) => { const d = document.createElement('div'); d.className = 'chip2' + (ok ? ' ok' : ''); d.textContent = (ok ? '✔ ' : '· ') + txt; m.appendChild(d); });
}
function posCuerpo(c) { return c === SOL ? new THREE.Vector3() : c._g.position.clone(); }
function radioVisual(c) { return c === SOL ? SOL.r : c.r * c._g.scale.x; }
function seleccionar(c) {
  sel = c; todos.forEach((x) => { x._btn.setAttribute('aria-pressed', String(x === c)); x._etq.classList.toggle('sel', x === c); });
  if (c !== SOL && !c._visto) { c._visto = true; c._btn.classList.add('vis'); misiones(); }
  ficha(c);
  const p = posCuerpo(c), r = radioVisual(c), dir = comparando ? new THREE.Vector3(0, 0.25, 1).normalize() : (c === SOL ? new THREE.Vector3(0.3, 0.35, 1) : p.clone().setY(0).normalize().add(new THREE.Vector3(0, 0.3, 0)).normalize());
  const dest = p.clone().add(dir.multiplyScalar(r * (c === SOL ? 3.2 : 4.2) + 2));
  gsap.to(camera.position, { x: dest.x, y: dest.y, z: dest.z, duration: 1.6, ease: 'power3.inOut' });
  gsap.to(controls.target, { x: p.x, y: p.y, z: p.z, duration: 1.6, ease: 'power3.inOut', onComplete: () => { if (sel) ultimaPos.copy(posCuerpo(sel)); } });
  ultimaPos.copy(p);
}
function ficha(c) {
  const f = $('ficha'); f.hidden = false;
  const rel = c === SOL ? 109 : c.rReal;
  f.innerHTML = `<div class="tipo">${c.tipo}</div><h2>${c.n}</h2><dl>
    <dt>Diámetro</dt><dd>${c.diam}</dd><dt>Distancia al Sol</dt><dd>${c.dist}</dd><dt>Duración del día</dt><dd>${c.dia}</dd><dt>Duración del año</dt><dd>${c.anio}</dd><dt>Lunas</dt><dd>${c.lunas}</dd><dt>Temperatura</dt><dd>${c.temp}</dd></dl>
    <div style="font-size:12.5px;color:var(--dim)">Tamaño comparado con la Tierra: <b style="color:var(--text)">${rel === 1 ? '1×' : (rel < 1 ? rel.toLocaleString('es') + '×' : rel.toLocaleString('es') + '×')}</b></div>
    <div class="comp"><i style="width:${Math.min(100, Math.max(3, rel / 11.2 * 100))}%"></i></div><p class="dato">${c.dato}</p>`;
}
function vistaGeneral() {
  sel = null; todos.forEach((x) => { x._btn.setAttribute('aria-pressed', 'false'); x._etq.classList.remove('sel'); }); $('ficha').hidden = true;
  const v = comparando ? { pos: new THREE.Vector3(50, 26, 108), tgt: new THREE.Vector3(50, 0, 0) } : VISTA_GENERAL;
  gsap.to(camera.position, { x: v.pos.x, y: v.pos.y, z: v.pos.z, duration: 1.8, ease: 'power3.inOut' }); gsap.to(controls.target, { x: v.tgt.x, y: v.tgt.y, z: v.tgt.z, duration: 1.8, ease: 'power3.inOut' });
}
/* comparar tamaños reales */
function comparar(on) {
  comparando = on; $('bComparar').setAttribute('aria-pressed', String(on)); $('bComparar').textContent = on ? '↩ Volver a las órbitas' : '📏 Comparar tamaños reales';
  const duracion = 1.8; let x = 0;
  cuerpos.forEach((p) => {
    p._orb.visible = !on; if (p._luna) p._luna.visible = !on;
    const e = on ? p.rReal / p.r : 1;
    let dest;
    if (on) { const ancho = p.id === 'saturno' ? p.rReal * 2.4 : p.rReal; x += ancho; dest = new THREE.Vector3(x, 0, 0); x += ancho + 1.8; } else dest = new THREE.Vector3(Math.cos(p._ang) * p.a, 0, Math.sin(p._ang) * p.a);
    gsap.to(p._g.scale, { x: e, y: e, z: e, duration: duracion, ease: 'power3.inOut' });
    gsap.to(p._g.position, { x: dest.x, y: dest.y, z: dest.z, duration: duracion, ease: 'power3.inOut' });
  });
  gsap.to(sol.scale, { x: on ? 0.0001 : 1, y: on ? 0.0001 : 1, z: on ? 0.0001 : 1, duration: duracion });
  if (on) { M.comparado = true; misiones(); sel = null; $('ficha').hidden = true; vistaGeneralComp(); } else vistaGeneral();
}
function vistaGeneralComp() { gsap.to(camera.position, { x: 50, y: 26, z: 108, duration: 1.8, ease: 'power3.inOut' }); gsap.to(controls.target, { x: 50, y: 0, z: 0, duration: 1.8, ease: 'power3.inOut' }); }
$('bComparar').onclick = () => comparar(!comparando);
$('bGeneral').onclick = () => { if (comparando) comparar(false); else vistaGeneral(); };
document.querySelectorAll('.barra [data-v]').forEach((b) => { b.onclick = () => { velocidad = +b.dataset.v; document.querySelectorAll('.barra [data-v]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); }; });

/* clic en un planeta */
const rc = new THREE.Raycaster(), pt = new THREE.Vector2(); let desde = null;
renderer.domElement.addEventListener('pointerdown', (e) => { desde = [e.clientX, e.clientY]; });
renderer.domElement.addEventListener('pointerup', (e) => {
  if (!desde || Math.hypot(e.clientX - desde[0], e.clientY - desde[1]) > 5) return;
  const r = renderer.domElement.getBoundingClientRect(); pt.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); rc.setFromCamera(pt, camera);
  const h = rc.intersectObjects(ray, false)[0]; if (h && !(comparando && h.object === solMesh)) seleccionar(h.object.userData.cuerpo);
});

/* reto final */
const retoEl = $('reto'); let qi = 0, aciertos = 0;
function pregunta() {
  const Q = PREGUNTAS[qi]; retoEl.innerHTML = `<div class="caja"><h3>RETO FINAL · ${qi + 1} DE ${PREGUNTAS.length}</h3><p>${Q.p}</p><div id="ops"></div><div class="pie"><span>Aciertos: ${aciertos}</span><button class="btn sec" id="cerrarReto" type="button">Cerrar</button></div></div>`;
  Q.o.forEach((o, i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'op'; b.textContent = o; b.onclick = () => { if (b.classList.contains('bien') || b.classList.contains('mal')) return; if (i === Q.ok) { b.classList.add('bien'); aciertos++; setTimeout(() => { qi++; if (qi < PREGUNTAS.length) pregunta(); else fin(); }, 700); } else b.classList.add('mal'); }; $('ops').appendChild(b); });
  $('cerrarReto').onclick = () => { retoEl.hidden = true; };
}
function fin() { const ok = aciertos === PREGUNTAS.length; if (ok) { M.reto = true; misiones(); } retoEl.innerHTML = `<div class="caja"><h3>RETO FINAL</h3><p>${ok ? '¡Excelente, explorador espacial! Respondiste todo bien. 🚀' : 'Respondiste ' + aciertos + ' de ' + PREGUNTAS.length + '. ¡Vuelve a visitar los planetas e inténtalo otra vez!'}</p><div class="pie"><button class="btn" id="otra" type="button">${ok ? 'Seguir explorando' : 'Intentar de nuevo'}</button></div></div>`; $('otra').onclick = () => { if (ok) retoEl.hidden = true; else { qi = 0; aciertos = 0; pregunta(); } }; }
$('bReto').onclick = () => { qi = 0; aciertos = 0; retoEl.hidden = false; pregunta(); };

/* bucle */
function ajustar() { const w = cont.clientWidth, h = cont.clientHeight; renderer.setSize(w, h, false); composer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); bloom.setSize(w, h); }
window.addEventListener('resize', ajustar); ajustar();
const v3 = new THREE.Vector3(); let previo = performance.now();
function tick(ahora) {
  const dt = Math.min(0.05, (ahora - previo) / 1000); previo = ahora; t += dt;
  solMesh.rotation.y += dt * 0.05;
  cuerpos.forEach((p) => {
    p._m.rotation.y += dt * p.rot * (velocidad ? 0.6 + velocidad * 0.12 : 0);
    if (p._nubes) p._nubes.rotation.y += dt * 0.08 * velocidad;
    if (!comparando) { p._ang += dt * p.vel * velocidad * 0.09; p._g.position.set(Math.cos(p._ang) * p.a, 0, Math.sin(p._ang) * p.a); }
    if (p._luna && !comparando) { const a = t * 0.9 * (velocidad ? velocidad : 0) * 0.5 + (p._la = (p._la || 0) + dt * velocidad * 0.9); p._luna.position.set(p._g.position.x + Math.cos(p._la) * 3.4, 0.3, p._g.position.z + Math.sin(p._la) * 3.4); }
  });
  if (sel && sel !== SOL) { const np = posCuerpo(sel); v3.copy(np).sub(ultimaPos); camera.position.add(v3); controls.target.add(v3); ultimaPos.copy(np); }
  luzCamara.position.copy(camera.position); luzCamara.target.position.copy(controls.target);
  controls.update(); composer.render();
  const r = renderer.domElement.getBoundingClientRect(), vw = visor.clientWidth, vh = visor.clientHeight;
  todos.forEach((c) => { const p = c === SOL ? new THREE.Vector3(0, SOL.r * 1.05, 0) : posCuerpo(c).add(new THREE.Vector3(0, radioVisual(c) * 1.1, 0)); v3.copy(p).project(camera); const vis = v3.z < 1 && Math.abs(v3.x) < 1.05 && Math.abs(v3.y) < 1.05 && !(comparando && c === SOL); c._etq.style.opacity = vis ? (c === sel ? 1 : 0.9) : 0; c._etq.style.left = ((v3.x * 0.5 + 0.5) * vw) + 'px'; const esc = comparando && c !== SOL && c.rReal < 1.5 ? (cuerpos.indexOf(c) % 4) * 17 : 0; c._etq.style.top = ((-v3.y * 0.5 + 0.5) * vh - esc) + 'px'; });
  requestAnimationFrame(tick);
}
misiones(); requestAnimationFrame(tick);
window.__solar = { seleccionar: (id) => seleccionar(todos.find((c) => c.id === id)), comparar, vistaGeneral, estado: () => ({ visitados: cuerpos.filter((p) => p._visto).length, comparado: M.comparado, reto: M.reto, comparando }), reto: () => { $('bReto').click(); }, camara: () => camera.position.toArray().map((n) => +n.toFixed(1)) };
