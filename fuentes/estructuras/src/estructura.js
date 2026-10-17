/* Dibuja la estructura en 3D: vigas de madera, perfiles de acero, cables, nodos, tablero y camión. */
import * as THREE from 'three';
import { aMundo } from './niveles.js';
import { Z_PLANO, texMadera } from './escena.js';

const ZP = Z_PLANO;
const COL_TENSION = new THREE.Color(0x19e6cf), COL_COMP = new THREE.Color(0xa78bff), COL_FALLA = new THREE.Color(0xff4d5e);

function geoViga() { // perfil en I extruido a lo largo de X (longitud 1)
  const w = 0.2, h = 0.2, f = 0.045, a = 0.04, s = new THREE.Shape();
  s.moveTo(-w / 2, -h / 2); s.lineTo(w / 2, -h / 2); s.lineTo(w / 2, -h / 2 + f); s.lineTo(a / 2, -h / 2 + f); s.lineTo(a / 2, h / 2 - f); s.lineTo(w / 2, h / 2 - f);
  s.lineTo(w / 2, h / 2); s.lineTo(-w / 2, h / 2); s.lineTo(-w / 2, h / 2 - f); s.lineTo(-a / 2, h / 2 - f); s.lineTo(-a / 2, -h / 2 + f); s.lineTo(-w / 2, -h / 2 + f); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: 1, bevelEnabled: false });
  g.rotateY(Math.PI / 2); g.translate(-0.5, 0, 0); return g;
}

export class Puente {
  constructor(escena) {
    this.escena = escena; this.raiz = escena.puenteGrupo;
    this.gMadera = new THREE.BoxGeometry(1, 0.23, 0.23);
    this.gAcero = geoViga();
    this.gCable = new THREE.CylinderGeometry(0.035, 0.035, 1, 8); this.gCable.rotateZ(Math.PI / 2);
    this.gEsfera = new THREE.SphereGeometry(1, 16, 12);
    this.texMad = texMadera();
    this.mAceroBase = new THREE.MeshStandardMaterial({ color: 0xaebbd0, metalness: 0.9, roughness: 0.32 });
    this.mNodo = new THREE.MeshStandardMaterial({ color: 0xcfd8e6, metalness: 0.9, roughness: 0.28 });
    this.mNodoEsp = new THREE.MeshStandardMaterial({ color: 0xffc247, metalness: 0.7, roughness: 0.35, emissive: 0x6b4a00, emissiveIntensity: 0.5 });
    this.mTab = new THREE.MeshStandardMaterial({ color: 0x2b303b, roughness: 0.85 });
    this.mRaya = new THREE.MeshBasicMaterial({ color: 0xe9eefc });
    this.miembros = []; this.nodos = new Map(); this.cruces = []; this.piezas = []; this.nivel = null;
    this.ghost = new THREE.Mesh(new THREE.BoxGeometry(1, 0.16, 0.16), new THREE.MeshBasicMaterial({ color: 0x2cf0a0, transparent: true, opacity: 0.7 }));
    this.ghost.visible = false; this.ghost.renderOrder = 5; this.raiz.add(this.ghost);
    this.anillo = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.035, 8, 28), new THREE.MeshBasicMaterial({ color: 0x4fd1c5 }));
    this.anillo.visible = false; this.raiz.add(this.anillo);
    this.camion = this._crearCamion(); this.camion.visible = false; this.raiz.add(this.camion);
    this.carga = null;
  }

  setNivel(niv) { this.nivel = niv; this.vaciar(); this._crearCarga(); }
  vaciar() {
    for (const m of this.miembros) { this.raiz.remove(m.g); m.g.traverse((o) => { if (o.material && o.material.userData.propio) { if (o.material.map && o.material.map !== this.texMad) o.material.map.dispose(); o.material.dispose(); } }); }
    this.miembros = [];
    for (const n of this.nodos.values()) this.raiz.remove(n.g); this.nodos.clear();
    for (const c of this.cruces) this.raiz.remove(c); this.cruces = [];
  }

  /* carga fija (torre / voladizo): una caja con peso y, si hay viento, ráfagas */
  _crearCarga() {
    if (this.carga) { this.raiz.remove(this.carga); this.carga = null; }
    const n = this.nivel; if (!n || !n.cargas) return;
    const g = new THREE.Group();
    n.cargas.forEach((c) => {
      const w = aMundo(c.x, c.y), s = new THREE.Group(); s.position.set(w.x, w.y, 0);
      if (n.id === 'torre') {
        const bloque = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 1.4), new THREE.MeshStandardMaterial({ color: 0xc9d1dd, roughness: 0.7, metalness: 0.2 }));
        bloque.position.y = 0.55; bloque.castShadow = true; s.add(bloque);
        const mastil = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 2.0, 8), this.mAceroBase); mastil.position.y = 1.9; mastil.castShadow = true; s.add(mastil);
        const plato = new THREE.Mesh(new THREE.SphereGeometry(0.4, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xf3f6fb, metalness: 0.5, roughness: 0.4, side: THREE.DoubleSide }));
        plato.position.set(0.25, 2.35, 0); plato.rotation.z = -Math.PI / 2.6; s.add(plato);
        const baliza = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), new THREE.MeshBasicMaterial({ color: 0xff4d5e })); baliza.position.y = 2.95; s.add(baliza); s.userData.baliza = baliza;
        const l = new THREE.PointLight(0xff4d5e, 8, 6); l.position.y = 2.95; s.add(l); s.userData.luz = l;
      } else {
        const peso = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.9), new THREE.MeshStandardMaterial({ color: 0xffb347, roughness: 0.55, metalness: 0.2 }));
        peso.position.y = -0.7; peso.castShadow = true; s.add(peso);
        const cuerda = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 6), this.mAceroBase); cuerda.position.y = -0.2; s.add(cuerda);
      }
      s.userData.c = c; g.add(s);
    });
    this.carga = g; this.raiz.add(g);
  }
  animarCarga(t, posFn) {
    if (!this.carga) return;
    this.carga.children.forEach((s) => {
      const c = s.userData.c, p = posFn(c.x + ',' + c.y);
      if (p) s.position.set(p.x, p.y, 0);
      if (s.userData.baliza) { const on = Math.sin(t * 4) > 0; s.userData.baliza.material.color.set(on ? 0xff4d5e : 0x5a2a30); s.userData.luz.intensity = on ? 8 : 0.4; }
    });
  }

  reconstruir(piezas) {
    this.piezas = piezas;
    this.vaciar();
    const n = this.nivel, claves = new Set();
    n.apoyos.forEach((a) => claves.add(a.x + ',' + a.y));
    (n.cargas || []).forEach((c) => claves.add(c.x + ',' + c.y));
    piezas.forEach((p, i) => {
      claves.add(p.x1 + ',' + p.y1); claves.add(p.x2 + ',' + p.y2);
      const g = new THREE.Group(), L = Math.hypot(p.x2 - p.x1, p.y2 - p.y1);
      const mk = (z) => this._viga(p.mat, L, i, z);
      const f = mk(ZP), b = mk(-ZP); g.add(f, b);
      // mitades para cuando se rompe
      const mitades = [];
      for (const z of [ZP, -ZP]) for (const lado of [-1, 1]) {
        const piv = new THREE.Group(); piv.position.set(lado * L / 2, 0, z); piv.visible = false;
        const m = this._viga(p.mat, L, i, 0);
        piv.add(m); g.add(piv); mitades.push({ piv, m, lado });
      }
      let slab = null;
      if (n.tipo === 'puente' && p.y1 === n.yTab && p.y2 === n.yTab) {
        slab = new THREE.Mesh(new THREE.BoxGeometry(1, 0.13, 2.0), this.mTab); slab.castShadow = true; slab.receiveShadow = true; g.add(slab);
        const raya = new THREE.Mesh(new THREE.BoxGeometry(1, 0.012, 0.07), this.mRaya); g.add(raya); slab.userData.raya = raya;
      }
      this.raiz.add(g);
      this.miembros.push({ g, f, b, mitades, slab, L, mat: p.mat, i, estado: { razon: 0, tipo: 'tension', falla: false, flojo: false, roto: false, sep: 0, giro: 0, alfa: 1 } });
    });
    claves.forEach((k) => {
      const [x, y] = k.split(',').map(Number), w = aMundo(x, y), g = new THREE.Group();
      const esp = n.apoyos.some((a) => a.x === x && a.y === y) || (n.cargas || []).some((c) => c.x === x && c.y === y);
      const carga = (n.cargas || []).some((c) => c.x === x && c.y === y);
      const r = esp ? 0.21 : 0.15;
      for (const z of [ZP, -ZP]) { const e = new THREE.Mesh(this.gEsfera, carga ? this.mNodoEsp : this.mNodo); e.scale.setScalar(r); e.position.z = z; e.castShadow = true; g.add(e); }
      const lazo = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, ZP * 2, 8), this.mAceroBase); lazo.rotation.x = Math.PI / 2; lazo.castShadow = true; g.add(lazo);
      g.position.set(w.x, w.y, 0); this.raiz.add(g); this.nodos.set(k, { g, x, y });
    });
  }

  _viga(mat, L, i, z) {
    let m;
    if (mat === 'madera') {
      const map = this.texMad.clone(); map.repeat.set(Math.max(1, L / 1.6), 1); map.needsUpdate = true;
      const mt = new THREE.MeshStandardMaterial({ map, roughness: 0.78, metalness: 0.02 }); mt.userData.propio = true; mt.userData.base = new THREE.Color(0xffffff);
      m = new THREE.Mesh(this.gMadera, mt);
    } else if (mat === 'acero') {
      const mt = this.mAceroBase.clone(); mt.userData.propio = true; mt.userData.base = mt.color.clone();
      m = new THREE.Mesh(this.gAcero, mt);
    } else {
      const mt = new THREE.MeshStandardMaterial({ color: 0x77879e, metalness: 0.85, roughness: 0.42 }); mt.userData.propio = true; mt.userData.base = mt.color.clone();
      m = new THREE.Mesh(this.gCable, mt);
    }
    m.castShadow = true; m.receiveShadow = true; m.position.z = z; m.scale.x = L; m.userData.i = i; return m;
  }

  /* posFn(clave) -> {x,y} en el mundo (ya con desplazamientos o caída) */
  actualizar(posFn, t) {
    this.miembros.forEach((mi, idx) => {
      const p = this.piezas[idx], a = posFn(p.x1 + ',' + p.y1), b = posFn(p.x2 + ',' + p.y2);
      if (!a || !b) return;
      const L = Math.hypot(b.x - a.x, b.y - a.y) || 0.001, ang = Math.atan2(b.y - a.y, b.x - a.x), e = mi.estado;
      mi.g.position.set((a.x + b.x) / 2, (a.y + b.y) / 2, 0); mi.g.rotation.z = ang;
      mi.f.visible = mi.b.visible = !e.roto;
      mi.f.scale.x = mi.b.scale.x = L;
      if (mi.mat === 'cable' && e.flojo) { mi.f.scale.y = mi.b.scale.y = mi.f.scale.z = mi.b.scale.z = 0.5; mi.f.position.y = mi.b.position.y = -0.12 * Math.sin(Math.min(1, t * 0.5 + idx)); }
      else { mi.f.scale.y = mi.b.scale.y = mi.f.scale.z = mi.b.scale.z = 1; mi.f.position.y = mi.b.position.y = 0; }
      if (mi.slab) { mi.slab.scale.x = L; mi.slab.position.y = 0.075; mi.slab.userData.raya.scale.x = L * 0.96; mi.slab.userData.raya.position.y = 0.147; }
      if (e.roto) {
        const h = Math.max(0.05, 0.5 - Math.min(0.18, e.sep) - 0.0);
        mi.mitades.forEach((q) => {
          q.piv.visible = true;
          const lado = q.lado; // -1: extremo izquierdo, 1: derecho
          q.piv.position.x = lado * (L / 2); q.piv.rotation.z = lado * e.giro;
          q.m.scale.x = L * h; q.m.position.x = -lado * (L * h) / 2;
        });
      } else mi.mitades.forEach((q) => { q.piv.visible = false; });
      mi.g.visible = e.alfa > 0.02;
      // color por esfuerzo
      [mi.f, mi.b, ...mi.mitades.map((q) => q.m)].forEach((m) => {
        const mt = m.material, base = mt.userData.base; if (!base) return;
        if (e.razon > 0.001 || e.falla) {
          const tint = e.falla ? COL_FALLA : (e.tipo === 'tension' ? COL_TENSION : COL_COMP), k = Math.min(1, 0.4 + 0.6 * Math.min(1, e.razon));
          mt.color.copy(base).lerp(tint, k * 0.8); mt.emissive.copy(tint); mt.emissiveIntensity = (e.falla ? 1.4 : 0.35 + 0.55 * Math.min(1, e.razon));
        } else { mt.color.copy(base); mt.emissive.setRGB(0, 0, 0); mt.emissiveIntensity = 0; }
        mt.transparent = e.alfa < 1; mt.opacity = e.alfa;
      });
    });
    this.nodos.forEach((nd, k) => { const p = posFn(k); if (p) nd.g.position.set(p.x, p.y, 0); nd.g.visible = !this.nodoOculto || !this.nodoOculto(k); });
  }

  limpiarEstados() { this.miembros.forEach((m) => { Object.assign(m.estado, { razon: 0, tipo: 'tension', falla: false, flojo: false, roto: false, sep: 0, giro: 0, alfa: 1 }); }); }
  resaltar(i) { this.miembros.forEach((m, k) => { [m.f, m.b].forEach((x) => { const mt = x.material; if (k === i) { mt.emissive.setRGB(1, 0.3, 0.35); mt.emissiveIntensity = 0.9; } else if (this._sinPrueba) { mt.emissive.setRGB(0, 0, 0); mt.emissiveIntensity = 0; } }); }); }

  /* ---------- vista previa al dibujar ---------- */
  mostrarGhost(x1, y1, x2, y2, ok) {
    const a = aMundo(x1, y1), b = aMundo(x2, y2), L = Math.hypot(b.x - a.x, b.y - a.y) || 0.01;
    this.ghost.visible = true; this.ghost.position.set((a.x + b.x) / 2, (a.y + b.y) / 2, ZP); this.ghost.rotation.z = Math.atan2(b.y - a.y, b.x - a.x); this.ghost.scale.x = L;
    this.ghost.material.color.set(ok ? 0x2cf0a0 : 0xff4d5e);
  }
  ocultarGhost() { this.ghost.visible = false; }
  verAnillo(x, y, v, color) { this.anillo.visible = v; if (v) { const w = aMundo(x, y); this.anillo.position.set(w.x, w.y, ZP + 0.2); if (color) this.anillo.material.color.set(color); } }
  piezaBajo(raycaster) {
    const hit = raycaster.intersectObjects(this.miembros.filter((m) => !m.estado.roto).map((m) => m.f), false)[0];
    return hit ? hit.object.userData.i : -1;
  }

  /* ---------- el camión ---------- */
  _crearCamion() {
    const g = new THREE.Group(), naranja = new THREE.MeshStandardMaterial({ color: 0xffa93a, roughness: 0.45, metalness: 0.25 });
    const cab = new THREE.MeshStandardMaterial({ color: 0xff7a3d, roughness: 0.45, metalness: 0.25 });
    const oscuro = new THREE.MeshStandardMaterial({ color: 0x1b2029, roughness: 0.6 });
    const caja = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.62, 0.88), naranja); caja.position.set(-0.3, 0.46, 0); caja.castShadow = true; g.add(caja);
    const chasis = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.12, 0.7), oscuro); chasis.position.set(0, 0.12, 0); g.add(chasis);
    const cabina = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.86), cab); cabina.position.set(0.62, 0.4, 0); cabina.castShadow = true; g.add(cabina);
    const vidrio = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.26, 0.74), new THREE.MeshStandardMaterial({ color: 0xbfe9ff, emissive: 0x7ac4f0, emissiveIntensity: 0.55, roughness: 0.1 })); vidrio.position.set(0.88, 0.5, 0); g.add(vidrio);
    for (const z of [-0.3, 0.3]) { const f = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), new THREE.MeshBasicMaterial({ color: 0xfff1b0 })); f.position.set(0.9, 0.22, z); g.add(f); const r = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff3b4a })); r.position.set(-0.97, 0.2, z); g.add(r); }
    const luz = new THREE.SpotLight(0xfff0c0, 25, 9, 0.5, 0.6, 1.4); luz.position.set(0.92, 0.22, 0); luz.target.position.set(4, 0, 0); g.add(luz, luz.target);
    const ruedas = [];
    for (const x of [-0.65, -0.1, 0.65]) for (const z of [-0.42, 0.42]) {
      const r = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.14, 18), oscuro); r.rotation.x = Math.PI / 2; r.position.set(x, 0.17, z); r.castShadow = true;
      const tapa = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.15, 10), this.mNodo); tapa.rotation.x = Math.PI / 2; r.add(tapa); g.add(r); ruedas.push(r);
    }
    g.userData.ruedas = ruedas; g.scale.setScalar(1.05); return g;
  }
  /* y = altura de la superficie del tablero */
  ponerCamion(x, y, ang, rueda) {
    this.camion.visible = true; this.camion.position.set(x, y, 0); this.camion.rotation.z = ang || 0;
    this.camion.userData.ruedas.forEach((r) => { r.rotation.y = rueda || 0; });
  }
  ocultarCamion() { this.camion.visible = false; }
}
