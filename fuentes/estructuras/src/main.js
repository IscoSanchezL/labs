import './estilos.css';
import * as THREE from 'three';
import gsap from 'gsap';
import * as I18N from './i18n.js';
import './textos.js';
import { crearEscena, Z_PLANO } from './escena.js';
import { Puente } from './estructura.js';
import { NIVELES, bloqueado, aMundo, aModelo } from './niveles.js';
import { MATERIALES, analizar, largo, longitudTotal, masaTotal, barrido, primerHueco } from './motor.js';

const T = I18N.t;
const $ = (id) => document.getElementById(id);
const escena = crearEscena($('vista'));
const puente = new Puente(escena);
const cvEl = escena.renderer.domElement;

const S = { niv: 0, piezas: [], mat: 'madera', herr: 'construir', inicio: null, undo: [], prueba: null, vista: 'frontal', res: null, camion: 3, hover: -1, tiempo: 0, ultimo: 0 };
let AV; try { AV = JSON.parse(localStorage.getItem('labs-puentes') || '{}'); } catch (e) { AV = {}; }
AV.estrellas = AV.estrellas || {}; AV.cuaderno = AV.cuaderno || {};
const guardar = () => { try { localStorage.setItem('labs-puentes', JSON.stringify(AV)); } catch (e) {} };
const nv = () => NIVELES[S.niv];
const key = (x, y) => x + ',' + y;

/* ---------- geometría y validación ---------- */
function cruza(a, b) {
  const o = (p, q, r) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
  const d1 = o(a.p, a.q, b.p), d2 = o(a.p, a.q, b.q), d3 = o(b.p, b.q, a.p), d4 = o(b.p, b.q, a.q);
  return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
}
function sobre(p, a, b) {
  const cr = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
  if (Math.abs(cr) > 1e-9) return false;
  const dot = (p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y), L2 = (b.x - a.x) ** 2 + (b.y - a.y) ** 2;
  return dot > 1e-9 && dot < L2 - 1e-9;
}
function nodosActuales() {
  const m = {};
  nv().apoyos.concat(nv().cargas || []).forEach((n) => { m[key(n.x, n.y)] = { x: n.x, y: n.y }; });
  S.piezas.forEach((p) => { m[key(p.x1, p.y1)] = { x: p.x1, y: p.y1 }; m[key(p.x2, p.y2)] = { x: p.x2, y: p.y2 }; });
  return Object.values(m);
}
function validar(x1, y1, x2, y2, mat) {
  if (x1 === x2 && y1 === y2) return T('p.err.mismo');
  if (bloqueado(nv(), x1, y1) || bloqueado(nv(), x2, y2)) return T('p.err.bloq');
  const L = Math.hypot(x2 - x1, y2 - y1), mx = MATERIALES[mat].maxL;
  if (L > mx + 1e-9) return T('p.err.max', { m: mx });
  if (S.piezas.some((p) => (p.x1 === x1 && p.y1 === y1 && p.x2 === x2 && p.y2 === y2) || (p.x1 === x2 && p.y1 === y2 && p.x2 === x1 && p.y2 === y1))) return T('p.err.dup');
  const A = { x: x1, y: y1 }, B = { x: x2, y: y2 };
  if (nodosActuales().some((q) => sobre(q, A, B))) return T('p.err.nodo');
  for (const p of S.piezas) {
    const P = { x: p.x1, y: p.y1 }, Q = { x: p.x2, y: p.y2 };
    if (cruza({ p: A, q: B }, { p: P, q: Q })) return T('p.err.cruce');
    if (sobre(A, P, Q) || sobre(B, P, Q)) return T('p.err.sobre');
  }
  return null;
}

/* ---------- modelo para el cálculo ---------- */
function modelo() {
  const nodos = [], idx = {};
  nv().apoyos.forEach((a) => { idx[key(a.x, a.y)] = nodos.length; nodos.push({ x: a.x, y: a.y, apoyo: a.t }); });
  (nv().cargas || []).forEach((c) => { const k = key(c.x, c.y); if (idx[k] === undefined) { idx[k] = nodos.length; nodos.push({ x: c.x, y: c.y, fx: c.fx || 0, fy: c.fy || 0 }); } });
  S.piezas.forEach((p) => [[p.x1, p.y1], [p.x2, p.y2]].forEach(([x, y]) => { const k = key(x, y); if (idx[k] === undefined) { idx[k] = nodos.length; nodos.push({ x, y }); } }));
  const piezas = S.piezas.map((p) => ({ a: idx[key(p.x1, p.y1)], b: idx[key(p.x2, p.y2)], mat: p.mat }));
  return { nodos, piezas, idx };
}
const xs = () => { const a = nv().apoyos.map((p) => p.x); return [Math.min(...a), Math.max(...a)]; };
const pesoCamion = () => (nv().libre ? S.camion : nv().camion);

/* ---------- acciones de edición ---------- */
function snapshot() { S.undo.push(JSON.stringify(S.piezas)); if (S.undo.length > 100) S.undo.shift(); }
function toast(t) { const e = $('toast'); e.textContent = t; e.classList.add('v'); clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove('v'), 2800); }
function reconstruir() { puente.reconstruir(S.piezas); puente.limpiarEstados(); }
function agregar(x1, y1, x2, y2, mat) {
  mat = mat || S.mat;
  const err = validar(x1, y1, x2, y2, mat);
  if (err) { toast(err); return false; }
  snapshot(); S.piezas.push({ x1, y1, x2, y2, mat }); limpiarPrueba(); reconstruir(); actualizarUI(); return true;
}
function limpiarPrueba() {
  S.prueba = null; S.res = null; puente.ocultarCamion(); puente.limpiarEstados(); puente._sinPrueba = true;
  $('resultado').hidden = true; $('medidorVivo').hidden = true; $('hudPrueba').hidden = true;
}

/* ---------- pruebas ---------- */
function posBase(k) { const [x, y] = k.split(',').map(Number); return aMundo(x, y); }
function iniciarPrueba(tipo) {
  if (S.vista === '3d') cambiarVista('frontal');
  if (S.prueba && !S.prueba.fin) return;
  if (!S.piezas.length) { toast(T('p.err.vacio')); return; }
  limpiarPrueba(); puente._sinPrueba = false;
  const mod = modelo(), niv = nv(), P = { tipo, t0: performance.now() / 1000, mod, fin: false, col: null, disp: new Map(), camY: 0, camVy: 0, cae: false };
  if (niv.tipo === 'puente') {
    const [xi, xd] = xs(), hueco = primerHueco(mod.nodos, mod.piezas, xi, xd, niv.yTab);
    P.xi = xi; P.xd = xd; P.hueco = hueco;
    const hasta = hueco === null ? xd : Math.max(xi, hueco - 1e-6);
    P.ba = barrido(mod.nodos, mod.piezas, { xi, xd: hasta, peso: pesoCamion(), yTab: niv.yTab, paso: 0.25 });
    P.peor = P.ba.peor; P.fs = 1 / Math.max(P.peor.res.maxRazon, 1e-9); if (P.peor.res.mecanismo) P.fs = 0;
    if (hueco !== null) { P.fs = 0; }
    P.x = 0; P.vel = 2.1;
    if (tipo === 'resist') { P.mMax = Math.min(8, Math.max(1.05, P.fs * 1.03)); P.dur = 5 + Math.min(4, P.mMax * 0.5); P.x = P.peor.x; }
  } else {
    const r = analizar(mod.nodos, mod.piezas); P.res = r; P.fs = r.mecanismo ? 0 : 1 / Math.max(r.maxRazon, 1e-9);
    if (tipo === 'resist') { P.mMax = Math.min(8, Math.max(1.05, P.fs * 1.03)); P.dur = 5 + Math.min(4, P.mMax * 0.5); }
  }
  S.prueba = P; $('hudPrueba').hidden = false; $('medidorVivo').hidden = false;
}

function nodosConCarga(P, factor, xCamion) {
  const nodos = P.mod.nodos.map((n) => ({ ...n }));
  if (nv().tipo === 'puente') {
    const [xi, xd] = xs();
    if (xCamion >= xi - 1e-9 && xCamion <= xd + 1e-9) {
      const cand = P.mod.piezas.filter((p) => nodos[p.a].y === nv().yTab && nodos[p.b].y === nv().yTab);
      for (const p of cand) {
        const a = nodos[p.a], b = nodos[p.b], x0 = Math.min(a.x, b.x), x1 = Math.max(a.x, b.x);
        if (xCamion >= x0 - 1e-9 && xCamion <= x1 + 1e-9 && x1 > x0) {
          const t = (xCamion - x0) / (x1 - x0), iz = a.x <= b.x ? p.a : p.b, de = a.x <= b.x ? p.b : p.a, w = pesoCamion() * factor;
          nodos[iz].fy = (nodos[iz].fy || 0) + w * (1 - t); nodos[de].fy = (nodos[de].fy || 0) + w * t; break;
        }
      }
    }
  } else nodos.forEach((n) => { if (n.fx !== undefined || n.fy !== undefined) { n.fx = (n.fx || 0) * factor; n.fy = (n.fy || 0) * factor; } });
  return nodos;
}

function resActual(P, now) {
  const t = now - P.t0, niv = nv();
  if (P.tipo === 'cruce') {
    if (niv.tipo === 'puente') {
      P.x = Math.min(16, P.vel * t);
      if (P.x >= P.xi && P.x <= P.xd && !P.cae) { const i = Math.max(0, Math.min(P.ba.pasos.length - 1, Math.round((P.x - P.xi) / 0.25))); return P.ba.pasos[i].res; }
      return null;
    }
    const f = Math.min(1, t / 1.4); return analizar(nodosConCarga(P, f, 0), P.mod.piezas);
  }
  // resistencia: la carga crece hasta romper
  const u = Math.min(1, t / P.dur), m = 1 + (P.mMax - 1) * (u * u * (3 - 2 * u));
  P.m = m;
  return analizar(nodosConCarga(P, m, nv().tipo === 'puente' ? P.x : 0), P.mod.piezas);
}

function disparar(P, res, ahora) {
  if (P.col) return;
  const rotas = new Set(); res.piezas.forEach((q, i) => { if (q.falla) rotas.add(i); });
  const nodos = new Map(); const pos = {};
  P.mod.nodos.forEach((n, i) => { const k = key(n.x, n.y); const b = aMundo(n.x, n.y), d = P.disp.get(k) || { x: 0, y: 0 }; if (!nv().apoyos.some((a) => a.x === n.x && a.y === n.y)) nodos.set(k, { x: b.x + d.x, y: b.y + d.y, vx: (Math.random() - 0.5) * 1.2, vy: Math.random() * 0.6, t: 0 }); });
  P.col = { t0: ahora, nodos, rotas };
}

function finalizar(P) {
  P.fin = true;
  const mod = P.mod, longi = longitudTotal(mod.nodos, mod.piezas), masa = masaTotal(mod.nodos, mod.piezas);
  const res = P.tipo === 'cruce' && nv().tipo === 'puente' ? P.peor.res : (P.res || analizar(nodosConCarga(P, 1, 0), mod.piezas));
  const fs = P.fs, ok = P.tipo === 'cruce' ? fs >= 1 && !P.hueco : true;
  const sinTablero = nv().tipo === 'puente' && P.hueco !== null;
  const orden = res.piezas.map((q, i) => ({ i, r: q.razon })).sort((a, b) => b.r - a.r).slice(0, 3);
  let estrellas = 0;
  if (ok && !nv().libre) estrellas = (fs >= 2 && longi <= nv().refLargo * 1.5) ? 3 : (fs >= 1.5 ? 2 : 1);
  S.res = { ok, fs, longi, masa, estrellas, tipo: P.tipo, sinTablero, mec: !!res.mecanismo, orden, res, mMax: P.mMax || null, rotas: res.piezas.filter((q) => q.falla).length, pandeo: res.piezas.filter((q) => q.pandeo).length };
  if (P.tipo === 'cruce' && estrellas > (AV.estrellas[nv().id] || 0)) { AV.estrellas[nv().id] = estrellas; guardar(); }
  mostrarResultado();
}

/* ---------- bucle de animación ---------- */
function tick(ms) {
  const t = ms / 1000, dt = Math.min(0.05, t - S.ultimo || 0.016); S.ultimo = t;
  const P = S.prueba, niv = nv();
  const ahora = t;
  let res = null;
  if (P && !P.fin) {
    res = resActual(P, ahora);
    // ¿pasa algo grave?
    if (res && (res.mecanismo || res.falla) && !P.col) disparar(P, res, ahora);
    if (niv.tipo === 'puente' && P.hueco !== null && P.x >= P.hueco && !P.cae) { P.cae = true; P.camVy = 0; }
    const dur = P.tipo === 'cruce' ? (niv.tipo === 'puente' ? 16 / P.vel + 0.4 : 1.9) : P.dur + 0.4;
    if (P.col && ahora - P.col.t0 > 3.2) finalizar(P);
    else if (!P.col && !P.cae && ahora - P.t0 > dur) finalizar(P);
    else if (P.cae && ahora - P.t0 > P.hueco / P.vel + 2.6) finalizar(P);
  }
  // desplazamientos suaves
  const objetivo = new Map();
  if (res && !res.mecanismo && P && P.mod) P.mod.nodos.forEach((n, i) => { const d = res.desp[i]; objetivo.set(key(n.x, n.y), { x: Math.max(-0.8, Math.min(0.8, d.ux * 40)), y: Math.max(-0.8, Math.min(0.8, -d.uy * 40)) }); });
  if (P && !P.fin) {
    const k = 1 - Math.exp(-14 * dt);
    P.mod.nodos.forEach((n) => { const kk = key(n.x, n.y), o = objetivo.get(kk) || { x: 0, y: 0 }, a = P.disp.get(kk) || { x: 0, y: 0 }; P.disp.set(kk, { x: a.x + (o.x - a.x) * k, y: a.y + (o.y - a.y) * k }); });
  }
  // colapso
  if (P && P.col) {
    const c = P.col, tt = ahora - c.t0;
    c.nodos.forEach((n) => { n.vy -= 16 * dt; n.x += n.vx * dt; n.y += n.vy * dt; });
  }
  // estados de las piezas
  if (P && res && !P.fin || (P && P.col)) {
    const r = res || (P.res) || { piezas: [] };
    puente.miembros.forEach((mi, i) => {
      const q = r.piezas && r.piezas[i], e = mi.estado;
      if (q) { e.razon = q.razon; e.tipo = q.tipo; e.falla = q.falla; e.flojo = q.flojo; }
      if (P.col) { const tt = ahora - P.col.t0; if (P.col.rotas.has(i)) { e.roto = true; e.sep = Math.min(0.18, tt * 0.25); e.giro = Math.min(0.9, tt * 0.9); } e.alfa = Math.max(0, 1 - Math.max(0, tt - 1.6) * 0.8); }
    });
  }
  const posFn = (k) => {
    const b = posBase(k);
    if (P && P.col && P.col.nodos.has(k)) { const n = P.col.nodos.get(k); return { x: n.x, y: n.y }; }
    if (P && P.disp && P.disp.has(k)) { const d = P.disp.get(k); return { x: b.x + d.x, y: b.y + d.y }; }
    return b;
  };
  puente.actualizar(posFn, t);
  puente.animarCarga(t, posFn);
  // camión
  if (P && !P.fin && niv.tipo === 'puente') dibujarCamion(P, posFn, ahora, dt);
  else if (!P || P.fin) { if (!(P && P.fin && niv.tipo === 'puente')) puente.ocultarCamion(); }
  hudVivo(P, res, ahora);
  escena.render(ms);
  requestAnimationFrame(tick);
}

function alturaTablero(x, posFn) {
  // altura de la superficie del tablero en x (modelo), siguiendo las vigas del tablero ya deformadas
  const niv = nv(), mod = S.prueba && S.prueba.mod, base = 7 - niv.yTab + 0.14;
  if (!mod) return { y: base, ang: 0 };
  for (const p of mod.piezas) {
    const a = mod.nodos[p.a], b = mod.nodos[p.b];
    if (a.y !== niv.yTab || b.y !== niv.yTab) continue;
    const x0 = Math.min(a.x, b.x), x1 = Math.max(a.x, b.x);
    if (x >= x0 - 1e-9 && x <= x1 + 1e-9 && x1 > x0) {
      const pa = posFn(key(a.x, a.y)), pb = posFn(key(b.x, b.y)), t = (x - x0) / (x1 - x0), izq = a.x <= b.x ? pa : pb, der = a.x <= b.x ? pb : pa;
      return { y: izq.y + (der.y - izq.y) * t + 0.14, ang: Math.atan2(der.y - izq.y, der.x - izq.x) };
    }
  }
  return { y: base, ang: 0 };
}
function dibujarCamion(P, posFn, ahora, dt) {
  const x = P.x, w = x - 8, niv = nv(); let h = alturaTablero(x, posFn), y = h.y, ang = h.ang;
  const enVano = x >= P.xi && x <= P.xd;
  if (P.cae || (P.col && enVano)) { P.camVy -= 14 * dt; P.camY = (P.camY || 0) + P.camVy * dt; y = h.y + P.camY; ang = Math.min(1.2, ang - (ahora - (P.col ? P.col.t0 : P.t0)) * 0.8); }
  if (P.tipo === 'resist') { P.x = P.peor ? P.peor.x : P.x; }
  puente.ponerCamion(P.tipo === 'resist' ? (P.peor.x - 8) : w, y, ang, P.x * 3);
}

/* ---------- interfaz en vivo ---------- */
function hudVivo(P, res, ahora) {
  if (!P || P.fin) return;
  const pct = res ? Math.min(100, Math.round(res.maxRazon * 100)) : 0;
  $('barraVivo').style.width = pct + '%'; $('barraVivo').className = pct >= 100 ? 'mal' : (pct > 75 ? 'aj' : '');
  $('txtVivo').textContent = T('p.vivo.pct', { n: pct });
  if (P.tipo === 'resist') $('hudPrueba').textContent = T('p.hud.resist', { m: (P.m || 1).toFixed(1), t: (pesoCamion() * (P.m || 1)).toFixed(1) });
  else $('hudPrueba').textContent = nv().tipo === 'puente' ? T('p.hud.cruce', { t: pesoCamion() }) : T('p.hud.estatico');
}

function mostrarResultado() {
  const R = S.res, caja = $('resultado'); caja.hidden = false;
  caja.className = 'glass panel resultado ' + (R.ok ? 'ok' : 'mal');
  let titulo, texto;
  if (R.sinTablero) { titulo = T('p.r.tHueco'); texto = T('p.r.hueco'); }
  else if (R.mec) { titulo = T('p.r.tCayo'); texto = T('p.r.mec'); }
  else if (!R.ok) { titulo = T('p.r.tRomp'); texto = T('p.r.romp', { n: R.rotas }) + (R.pandeo ? ' ' + T('p.r.pandeo', { n: R.pandeo }) : ' ' + T('p.r.tracc')); }
  else { titulo = R.tipo === 'resist' ? T('p.r.tResist') : T('p.r.tOk'); texto = R.tipo === 'resist' ? (R.fs >= 8 ? T('p.r.resist8') : T('p.r.resist', { m: R.fs.toFixed(1) })) : T('p.r.ok', { fs: R.fs.toFixed(2) }); }
  $('rTitulo').textContent = titulo; $('rTexto').textContent = texto;
  $('rFS').textContent = R.fs > 0 ? R.fs.toFixed(2) + '×' : '—';
  $('rBarra').style.width = Math.min(100, (R.fs / 3) * 100) + '%'; $('rBarra').className = R.fs >= 2 ? 'ok' : (R.fs >= 1 ? 'aj' : 'mal');
  $('rLong').textContent = R.longi.toFixed(1) + ' m'; $('rMasa').textContent = Math.round(R.masa) + ' kg';
  const est = $('rEst'); est.innerHTML = nv().libre ? '' : [1, 2, 3].map((i) => (i <= R.estrellas ? '★' : '<span class="off">★</span>')).join('');
  const crit = R.orden.filter((o) => o.r > 0).map((o) => { const p = S.piezas[o.i]; return T('p.r.pieza', { n: o.i + 1, m: T('p.mat.' + p.mat), r: Math.round(o.r * 100) }); });
  $('rCrit').innerHTML = crit.length ? '<b>' + T('p.r.criticas') + '</b><br>' + crit.join('<br>') : '';
  $('bSig').hidden = !(R.ok && R.tipo === 'cruce' && S.niv < NIVELES.length - 1 && !nv().libre);
  actualizarUI(); caja.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ---------- panel de datos ---------- */
function actualizarUI() {
  const niv = nv();
  $('nTit').textContent = T('p.nivelN', { n: S.niv + 1, nombre: T('p.n.' + niv.id + '.nombre') });
  $('reto').innerHTML = T('p.n.' + niv.id + '.reto'); $('retoTit').textContent = T('p.n.' + niv.id + '.nombre');
  $('estrellasNivel').innerHTML = niv.libre ? '' : [1, 2, 3].map((i) => (i <= (AV.estrellas[niv.id] || 0) ? '★' : '<span class="off">★</span>')).join('');
  const mod = modelo(), L = longitudTotal(mod.nodos, mod.piezas), M = masaTotal(mod.nodos, mod.piezas);
  $('dPiezas').textContent = S.piezas.length; $('dLong').textContent = L.toFixed(1) + ' m'; $('dMasa').textContent = Math.round(M) + ' kg';
  const c = { viga: 0, columna: 0, trav: 0, cable: 0 };
  S.piezas.forEach((p) => { if (p.mat === 'cable') c.cable++; else if (p.y1 === p.y2) c.viga++; else if (p.x1 === p.x2) c.columna++; else c.trav++; });
  $('conteo').innerHTML = [['viga', 'p.c.viga'], ['columna', 'p.c.columna'], ['trav', 'p.c.trav'], ['cable', 'p.c.cable']].map(([k, tk]) => `<span class="chip"><b>${c[k]}</b> ${T(tk)}</span>`).join('');
  document.querySelectorAll('#tabsNivel button').forEach((b, i) => { b.textContent = (i + 1) + '. ' + T('p.n.' + NIVELES[i].id + '.corto'); b.setAttribute('aria-pressed', String(i === S.niv)); });
  document.querySelectorAll('#mats button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.m === S.mat)));
  $('tCons').setAttribute('aria-pressed', String(S.herr === 'construir')); $('tBorr').setAttribute('aria-pressed', String(S.herr === 'borrar'));
  $('bDeshacer').disabled = !S.undo.length; $('bEjemplo').hidden = !niv.ejemplo;
  $('camionBox').hidden = !(niv.libre); $('camionVal').textContent = S.camion + ' t';
  $('bEditar').setAttribute('aria-pressed', String(S.vista === 'frontal')); $('bVer3D').setAttribute('aria-pressed', String(S.vista === '3d'));
  const cu = AV.cuaderno[niv.id] || {}; ['h', 'o', 'm'].forEach((k) => { if (document.activeElement !== $('cu_' + k)) $('cu_' + k).value = cu[k] || ''; });
  $('infoCarga').innerHTML = niv.tipo === 'puente' ? T('p.info.puente', { t: pesoCamion(), a: Math.abs(niv.apoyos[1].x - niv.apoyos[0].x) }) : T('p.info.' + niv.id);
  cvEl.style.cursor = S.vista === '3d' ? 'grab' : (S.herr === 'borrar' ? 'not-allowed' : 'crosshair');
}
function armarUI() {
  const tabs = $('tabsNivel'); tabs.textContent = '';
  NIVELES.forEach((n, i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'tab'; b.addEventListener('click', () => cargarNivel(i)); tabs.appendChild(b); });
  const mats = $('mats'); mats.textContent = '';
  ['madera', 'acero', 'cable'].forEach((k) => {
    const d = MATERIALES[k], b = document.createElement('button'); b.type = 'button'; b.dataset.m = k;
    b.innerHTML = `<span class="sw ${k}"></span><b>${T('p.mat.' + k)}</b><small>${T('p.mat.info.' + k, { t: d.tension, c: d.compresion, l: d.maxL })}</small>`;
    b.addEventListener('click', () => { S.mat = k; S.herr = 'construir'; actualizarUI(); }); mats.appendChild(b);
  });
}

/* ---------- niveles y vistas ---------- */
function cargarNivel(i) {
  S.niv = i; S.piezas = []; S.undo = []; S.inicio = null; S.camion = 3;
  escena.construirNivel(nv()); puente.setNivel(nv()); reconstruir(); limpiarPrueba(); cambiarVista('frontal', true); armarUI(); actualizarUI();
}
function cambiarVista(v, inmediato) {
  S.vista = v;
  if (v === 'frontal') escena.vistaFrontal(!inmediato); else { S.inicio = null; puente.ocultarGhost(); puente.verAnillo(0, 0, false); escena.vista3D(); }
  actualizarUI();
}

/* ---------- puntero ---------- */
const ray = new THREE.Raycaster(), plano = new THREE.Plane(new THREE.Vector3(0, 0, 1), -Z_PLANO), ptos = new THREE.Vector3();
function rayo(e) {
  const r = cvEl.getBoundingClientRect(), v = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(v, escena.camera); return ray;
}
function puntoRejilla(e) { const rr = rayo(e); if (!rr.ray.intersectPlane(plano, ptos)) return null; const m = aModelo(ptos.x, ptos.y); return { x: Math.max(0, Math.min(16, m.x)), y: Math.max(0, Math.min(10, m.y)), wx: ptos.x, wy: ptos.y }; }
let abajo = false;
cvEl.addEventListener('pointerdown', (e) => {
  if (S.vista === '3d' || (S.prueba && !S.prueba.fin)) return;
  const p = puntoRejilla(e); if (!p) return;
  if (S.herr === 'borrar') { const i = puente.piezaBajo(rayo(e)); if (i >= 0) { snapshot(); S.piezas.splice(i, 1); limpiarPrueba(); reconstruir(); actualizarUI(); } return; }
  if (S.prueba) limpiarPrueba();
  if (S.inicio) { const a = S.inicio; S.inicio = null; abajo = false; puente.ocultarGhost(); agregar(a.x, a.y, p.x, p.y); return; }
  if (bloqueado(nv(), p.x, p.y)) { toast(T('p.err.bloq')); return; }
  S.inicio = { x: p.x, y: p.y }; abajo = true; try { cvEl.setPointerCapture(e.pointerId); } catch (_) {}
});
cvEl.addEventListener('pointermove', (e) => {
  if (S.vista === '3d') return;
  const p = puntoRejilla(e);
  if (S.herr === 'construir' && !(S.prueba && !S.prueba.fin)) {
    if (p && !bloqueado(nv(), p.x, p.y)) { puente.verAnillo(p.x, p.y, true, S.inicio ? 0x1f9bd1 : 0x4fd1c5); } else puente.verAnillo(0, 0, false);
    if (S.inicio && p) { const err = validar(S.inicio.x, S.inicio.y, p.x, p.y, S.mat); puente.mostrarGhost(S.inicio.x, S.inicio.y, p.x, p.y, !err); } else puente.ocultarGhost();
  }
  const i = (S.prueba && !S.prueba.fin) ? -1 : puente.piezaBajo(rayo(e));
  const tip = $('tip');
  if (i >= 0) {
    const q = S.piezas[i], Lq = Math.hypot(q.x2 - q.x1, q.y2 - q.y1), est = puente.miembros[i] && puente.miembros[i].estado;
    let extra = ''; if (S.res && est && est.razon > 0 && !S.res.mec) extra = ' · ' + T(est.tipo === 'tension' ? 'p.tip.tension' : 'p.tip.comp') + ' ' + Math.round(est.razon * 100) + '%';
    tip.textContent = `${T('p.mat.' + q.mat)} · ${Lq.toFixed(1)} m${extra}`; tip.hidden = false;
    const r = cvEl.getBoundingClientRect(); tip.style.left = (e.clientX - r.left + 14) + 'px'; tip.style.top = (e.clientY - r.top - 8) + 'px';
    if (S.herr === 'borrar') puente.resaltar(i);
  } else { tip.hidden = true; if (S.herr === 'borrar' && !S.res) puente.limpiarEstados(); }
});
cvEl.addEventListener('pointerup', (e) => {
  if (S.vista === '3d') return;
  const p = puntoRejilla(e);
  if (abajo && S.inicio && p && (p.x !== S.inicio.x || p.y !== S.inicio.y)) { const a = S.inicio; S.inicio = null; puente.ocultarGhost(); agregar(a.x, a.y, p.x, p.y); }
  abajo = false;
});
cvEl.addEventListener('pointerleave', () => { $('tip').hidden = true; puente.verAnillo(0, 0, false); });
window.addEventListener('keydown', (e) => { if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return; if (e.key === 'Escape') { S.inicio = null; puente.ocultarGhost(); } });

/* ---------- botones ---------- */
$('tCons').addEventListener('click', () => { S.herr = 'construir'; S.inicio = null; actualizarUI(); });
$('tBorr').addEventListener('click', () => { S.herr = 'borrar'; S.inicio = null; puente.ocultarGhost(); actualizarUI(); });
$('bDeshacer').addEventListener('click', () => { if (S.undo.length) { S.piezas = JSON.parse(S.undo.pop()); limpiarPrueba(); reconstruir(); actualizarUI(); } });
$('bLimpiar').addEventListener('click', () => { if (S.piezas.length && confirm(T('p.conf'))) { snapshot(); S.piezas = []; limpiarPrueba(); reconstruir(); actualizarUI(); } });
$('bEjemplo').addEventListener('click', () => {
  if (S.piezas.length && !confirm(T('p.confEj'))) return;
  snapshot(); limpiarPrueba(); S.piezas = nv().ejemplo.map(([x1, y1, x2, y2, mat]) => ({ x1, y1, x2, y2, mat })); reconstruir(); actualizarUI(); toast(T('p.ejCargado'));
});
$('bProbar').addEventListener('click', () => iniciarPrueba('cruce'));
$('bResist').addEventListener('click', () => iniciarPrueba('resist'));
$('bEditar').addEventListener('click', () => cambiarVista('frontal'));
$('bVer3D').addEventListener('click', () => cambiarVista('3d'));
$('bReint').addEventListener('click', () => limpiarPrueba() || actualizarUI());
$('bSig').addEventListener('click', () => cargarNivel(Math.min(NIVELES.length - 1, S.niv + 1)));
$('camionMas').addEventListener('click', () => { S.camion = Math.min(8, S.camion + 0.5); limpiarPrueba(); actualizarUI(); });
$('camionMenos').addEventListener('click', () => { S.camion = Math.max(1, S.camion - 0.5); limpiarPrueba(); actualizarUI(); });
['h', 'o', 'm'].forEach((k) => $('cu_' + k).addEventListener('input', () => { const id = nv().id; AV.cuaderno[id] = AV.cuaderno[id] || {}; AV.cuaderno[id][k] = $('cu_' + k).value; guardar(); }));
$('cuDatos').addEventListener('click', () => {
  const R = S.res; if (!R) { toast(T('p.cu.sinPrueba')); return; }
  const txt = T('p.cu.datos', { fs: R.fs.toFixed(2), l: R.longi.toFixed(1), m: Math.round(R.masa), n: S.piezas.length });
  const id = nv().id; AV.cuaderno[id] = AV.cuaderno[id] || {}; AV.cuaderno[id].o = (AV.cuaderno[id].o ? AV.cuaderno[id].o + '\n' : '') + txt; guardar(); actualizarUI();
});
$('nombre').value = AV.nombre || ''; $('nombre').addEventListener('input', () => { AV.nombre = $('nombre').value; guardar(); });
$('bInforme').addEventListener('click', guardarInforme);

/* ---------- informe en PNG ---------- */
function guardarInforme() {
  const img = new Image();
  img.onload = () => {
    const W = img.width, H = img.height, cu = AV.cuaderno[nv().id] || {}, R = S.res, nombre = ($('nombre').value || '').trim() || T('p.img.sin');
    const c = document.createElement('canvas'), pad = Math.round(W * 0.025), f = Math.round(W / 56);
    const lineas = []; const x = c.getContext('2d');
    function envolver(txt, ancho, fuente) { x.font = fuente; const out = []; (txt || '').split('\n').forEach((par) => { let cur = ''; par.split(' ').forEach((w) => { const t = cur ? cur + ' ' + w : w; if (x.measureText(t).width > ancho && cur) { out.push(cur); cur = w; } else cur = t; }); out.push(cur); }); return out; }
    const fN = `400 ${f}px "Space Grotesk",system-ui,sans-serif`, fT = `700 ${Math.round(f * 1.25)}px "Space Grotesk",system-ui,sans-serif`;
    x.font = fN; const ancho = W - pad * 2;
    const bloques = [[T('p.cu.h'), cu.h], [T('p.cu.o'), cu.o], [T('p.cu.m'), cu.m]].filter(([, v]) => v && v.trim());
    let alto = pad + Math.round(f * 3.4);
    bloques.forEach(([t, v]) => { alto += Math.round(f * 1.6); alto += envolver(v, ancho, fN).length * Math.round(f * 1.35) + Math.round(f * 0.5); });
    alto += pad;
    c.width = W; c.height = H + Math.max(alto, Math.round(f * 6)); const g = c.getContext('2d');
    g.fillStyle = '#070f1c'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0);
    g.fillStyle = '#4fd1c5'; g.fillRect(0, H, W, 4);
    let y = H + pad + f; g.fillStyle = '#eaf2fb'; g.font = fT; g.textAlign = 'left';
    g.fillText(T('p.img.tit', { n: S.niv + 1, nombre: T('p.n.' + nv().id + '.nombre') }), pad, y);
    g.font = fN; g.fillStyle = '#b3c4d6'; y += Math.round(f * 1.5);
    const datos = R ? T('p.img.datos', { fs: R.fs.toFixed(2), l: R.longi.toFixed(1), m: Math.round(R.masa) }) : T('p.img.sinPrueba');
    g.fillText(`${nombre}  ·  ${datos}  ·  Gi School`, pad, y);
    if (R && !nv().libre) { g.textAlign = 'right'; g.fillStyle = '#ffd36b'; g.font = fT; g.fillText('★'.repeat(R.estrellas) + '☆'.repeat(3 - R.estrellas), W - pad, H + pad + f); g.textAlign = 'left'; }
    y += Math.round(f * 1.3);
    bloques.forEach(([t, v]) => {
      g.fillStyle = '#4fd1c5'; g.font = fT; g.fillText(t, pad, y); y += Math.round(f * 1.45);
      g.fillStyle = '#eaf2fb'; g.font = fN; envolver(v, ancho, fN).forEach((ln) => { g.fillText(ln, pad, y); y += Math.round(f * 1.35); }); y += Math.round(f * 0.3);
    });
    c.toBlob((b) => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'puente-reto-' + (S.niv + 1) + '.png'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); });
  };
  img.src = escena.captura();
}

/* ---------- arranque ---------- */
function ajustar() { escena.resize(); if (S.vista === 'frontal') escena.vistaFrontal(false); }
window.addEventListener('resize', ajustar);
I18N.alCambiar(() => { armarUI(); actualizarUI(); if (S.res) mostrarResultado(); });
cargarNivel(0); ajustar();
I18N.montar();
requestAnimationFrame(tick);
window.__puentes = { S, puente, escena, agregar, iniciarPrueba, cargarNivel, cambiarVista, NIVELES, T, estado: () => ({ res: S.res, prueba: !!(S.prueba && !S.prueba.fin) }) };
