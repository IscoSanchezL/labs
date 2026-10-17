/* Motor de cálculo de cerchas planas (barras articuladas) para el Laboratorio de puentes.
   Método de rigidez. Coordenadas del modelo: x hacia la derecha, y hacia ABAJO, fy positivo = hacia abajo.
   Los cables trabajan solo a tracción: si quedarían comprimidos se aflojan (y se recalcula). */

export const MATERIALES = {
  madera: { id: 'madera', tension: 4,  compresion: 4,  pandeo: 22, densidad: 12, maxL: 5 },
  acero:  { id: 'acero',  tension: 10, compresion: 10, pandeo: 70, densidad: 38, maxL: 5 },
  cable:  { id: 'cable',  tension: 12, compresion: 0,  pandeo: 0,  densidad: 5,  maxL: 9, soloTension: true }
};

export const largo = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
export const capCompresion = (mat, L) => (mat.soloTension ? 0 : Math.min(mat.compresion, mat.pandeo / (L * L)));
export const capTension = (mat) => mat.tension;

function resolver(A, b) {
  const n = b.length;
  for (let i = 0; i < n; i++) {
    let p = i, max = Math.abs(A[i][i]);
    for (let j = i + 1; j < n; j++) if (Math.abs(A[j][i]) > max) { max = Math.abs(A[j][i]); p = j; }
    if (max < 1e-14) return null;
    if (p !== i) { [A[i], A[p]] = [A[p], A[i]]; [b[i], b[p]] = [b[p], b[i]]; }
    for (let j = i + 1; j < n; j++) {
      const f = A[j][i] / A[i][i];
      if (!f) continue;
      for (let k = i; k < n; k++) A[j][k] -= f * A[i][k];
      b[j] -= f * b[i];
    }
  }
  const x = new Array(n);
  for (let i = n - 1; i >= 0; i--) {
    let s = b[i];
    for (let j = i + 1; j < n; j++) s -= A[i][j] * x[j];
    x[i] = s / A[i][i];
  }
  return x;
}

/* nodos:  [{x,y, apoyo:'fijo'|'rodillo'|null, fx, fy}]
   piezas: [{a,b, mat}]
   Devuelve { mecanismo, desp:[{ux,uy}], piezas:[{N, cap, razon, falla, tipo, largo, pandeo, flojo}], falla, estable, maxRazon } */
export function analizar(nodos, piezas) {
  const EA = 1000, n = nodos.length, ndof = 2 * n;
  const activa = piezas.map(() => true);
  const tienePieza = new Array(n).fill(false);
  piezas.forEach((p) => { tienePieza[p.a] = true; tienePieza[p.b] = true; });
  let u = new Array(ndof).fill(0), mecanismo = false;

  for (let ronda = 0; ronda < 30; ronda++) {
    const K = Array.from({ length: ndof }, () => new Array(ndof).fill(0));
    const F = new Array(ndof).fill(0);
    piezas.forEach((p, idx) => {
      if (!activa[idx]) return;
      const a = nodos[p.a], b = nodos[p.b], L = largo(a, b);
      const c = (b.x - a.x) / L, s = (b.y - a.y) / L, k = EA / L;
      const m = [[c*c, c*s, -c*c, -c*s], [c*s, s*s, -c*s, -s*s], [-c*c, -c*s, c*c, c*s], [-c*s, -s*s, c*s, s*s]];
      const d = [2*p.a, 2*p.a+1, 2*p.b, 2*p.b+1];
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) K[d[i]][d[j]] += k * m[i][j];
    });
    nodos.forEach((nd, i) => { F[2*i] += nd.fx || 0; F[2*i+1] += nd.fy || 0; });
    const libres = [];
    for (let i = 0; i < n; i++) {
      const nd = nodos[i];
      const fijoX = nd.apoyo === 'fijo' || !tienePieza[i];
      const fijoY = nd.apoyo === 'fijo' || nd.apoyo === 'rodillo' || !tienePieza[i];
      if (!fijoX) libres.push(2*i);
      if (!fijoY) libres.push(2*i+1);
    }
    const A = libres.map((r, ri) => { const fila = libres.map((c2) => K[r][c2]); fila[ri] += 1e-7; return fila; });
    const bb = libres.map((r) => F[r]);
    u = new Array(ndof).fill(0);
    const sol = libres.length ? resolver(A, bb) : [];
    mecanismo = !sol;
    if (sol) libres.forEach((r, i) => { u[r] = sol[i]; });
    for (let i = 0; i < ndof; i++) if (!isFinite(u[i]) || Math.abs(u[i]) > 5) mecanismo = true;
    // los cables solo aguantan estirados: si quedan comprimidos, se aflojan
    let cambio = false;
    if (!mecanismo) {
      piezas.forEach((p, idx) => {
        if (!activa[idx] || !MATERIALES[p.mat].soloTension) return;
        const a = nodos[p.a], b = nodos[p.b], L = largo(a, b), c = (b.x - a.x) / L, s = (b.y - a.y) / L;
        const dl = (u[2*p.b] - u[2*p.a]) * c + (u[2*p.b+1] - u[2*p.a+1]) * s;
        if ((EA / L) * dl < -1e-9) { activa[idx] = false; cambio = true; }
      });
    }
    if (!cambio) break;
  }

  nodos.forEach((nd, i) => { if ((nd.fx || nd.fy) && !tienePieza[i]) mecanismo = true; });
  const res = { mecanismo, desp: [], piezas: [], falla: false, maxRazon: 0 };
  for (let i = 0; i < n; i++) res.desp.push({ ux: u[2*i], uy: u[2*i+1] });
  piezas.forEach((p, idx) => {
    const a = nodos[p.a], b = nodos[p.b], L = largo(a, b), mat = MATERIALES[p.mat];
    const c = (b.x - a.x) / L, s = (b.y - a.y) / L;
    const dl = (u[2*p.b] - u[2*p.a]) * c + (u[2*p.b+1] - u[2*p.a+1]) * s;
    const N = (mecanismo || !activa[idx]) ? 0 : (EA / L) * dl;
    const tipo = N >= 0 ? 'tension' : 'compresion';
    const cap = N >= 0 ? capTension(mat) : capCompresion(mat, L);
    const razon = N === 0 ? 0 : Math.abs(N) / Math.max(cap, 1e-9);
    const falla = razon > 1.0001;
    if (falla) res.falla = true;
    if (razon > res.maxRazon) res.maxRazon = razon;
    res.piezas.push({ N, cap, razon, falla, tipo, largo: L, flojo: !activa[idx],
      pandeo: falla && tipo === 'compresion' && !mat.soloTension && capCompresion(mat, L) < mat.compresion });
  });
  res.estable = !mecanismo && !res.falla;
  return res;
}

export function longitudTotal(nodos, piezas) { return piezas.reduce((s, p) => s + largo(nodos[p.a], nodos[p.b]), 0); }
export function masaTotal(nodos, piezas) { return piezas.reduce((s, p) => s + largo(nodos[p.a], nodos[p.b]) * MATERIALES[p.mat].densidad, 0); }

/* ---------- el camión sobre el tablero ---------- */
/* Devuelve las cargas de nodo para un camión de `peso` toneladas en la posición x, o null si no hay tablero debajo.
   El tablero son las piezas horizontales a la altura yTab. La carga se reparte entre los dos extremos de la pieza. */
export function cargasCamion(nodos, piezas, x, peso, yTab) {
  const cand = piezas.filter((p) => nodos[p.a].y === yTab && nodos[p.b].y === yTab);
  for (const p of cand) {
    const a = nodos[p.a], b = nodos[p.b], x0 = Math.min(a.x, b.x), x1 = Math.max(a.x, b.x);
    if (x >= x0 - 1e-9 && x <= x1 + 1e-9 && x1 > x0) {
      const t = (x - x0) / (x1 - x0), izq = a.x <= b.x ? p.a : p.b, der = a.x <= b.x ? p.b : p.a;
      return [{ nodo: izq, fy: peso * (1 - t) }, { nodo: der, fy: peso * t }];
    }
  }
  return null;
}
/* Primer punto del tramo [xi, xd] que no tiene tablero (o null si el tablero es continuo). */
export function primerHueco(nodos, piezas, xi, xd, yTab) {
  const ints = piezas.filter((p) => nodos[p.a].y === yTab && nodos[p.b].y === yTab)
    .map((p) => [Math.min(nodos[p.a].x, nodos[p.b].x), Math.max(nodos[p.a].x, nodos[p.b].x)]).sort((a, b) => a[0] - b[0]);
  let cubierto = xi;
  for (const [a, b] of ints) { if (a > cubierto + 1e-9) break; if (b > cubierto) cubierto = b; }
  return cubierto >= xd - 1e-9 ? null : cubierto;
}

/* Recorre el puente con el camión y devuelve el peor caso. */
export function barrido(nodosBase, piezas, { xi, xd, peso, yTab, paso = 0.25 }) {
  const out = []; let peor = null;
  for (let x = xi; x <= xd + 1e-9; x += paso) {
    const nodos = nodosBase.map((n) => ({ ...n }));
    const cg = cargasCamion(nodos, piezas, x, peso, yTab);
    if (cg) cg.forEach((c) => { nodos[c.nodo].fy = (nodos[c.nodo].fy || 0) + c.fy; });
    const r = analizar(nodos, piezas);
    out.push({ x, res: r });
    if (!peor || r.maxRazon > peor.res.maxRazon || r.mecanismo) peor = { x, res: r };
  }
  return { pasos: out, peor };
}
