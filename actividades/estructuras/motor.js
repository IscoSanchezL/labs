/* Motor de cálculo de cerchas planas (barras articuladas) para "Ingeniero de estructuras".
   Método de rigidez: resuelve los desplazamientos de los nodos y la fuerza axial de cada pieza. */
(function (root) {
  'use strict';

  var MATERIALES = {
    madera: { id: 'madera', nombre: 'Madera', precio: 8,  tension: 4,  compresion: 4,  pandeo: 22 },
    acero:  { id: 'acero',  nombre: 'Acero',  precio: 20, tension: 10, compresion: 10, pandeo: 70 }
  };

  /* Capacidad de compresión: las piezas largas se pandean (se doblan) antes de aplastarse. */
  function capCompresion(mat, L) { return Math.min(mat.compresion, mat.pandeo / (L * L)); }
  function capTension(mat) { return mat.tension; }

  function largo(a, b) { return Math.hypot(b.x - a.x, b.y - a.y); }

  /* Resuelve A x = b con eliminación gaussiana y pivoteo parcial. */
  function resolver(A, b) {
    var n = b.length, i, j, k;
    for (i = 0; i < n; i++) {
      var p = i, max = Math.abs(A[i][i]);
      for (j = i + 1; j < n; j++) if (Math.abs(A[j][i]) > max) { max = Math.abs(A[j][i]); p = j; }
      if (max < 1e-14) return null;
      if (p !== i) { var t = A[i]; A[i] = A[p]; A[p] = t; var tb = b[i]; b[i] = b[p]; b[p] = tb; }
      for (j = i + 1; j < n; j++) {
        var f = A[j][i] / A[i][i];
        if (f === 0) continue;
        for (k = i; k < n; k++) A[j][k] -= f * A[i][k];
        b[j] -= f * b[i];
      }
    }
    var x = new Array(n);
    for (i = n - 1; i >= 0; i--) {
      var s = b[i];
      for (j = i + 1; j < n; j++) s -= A[i][j] * x[j];
      x[i] = s / A[i][i];
    }
    return x;
  }

  /* nodos:   [{x,y, apoyo:'fijo'|'rodillo'|null, fx, fy}]   (fy positivo = hacia abajo)
     piezas:  [{a,b, mat}]  (a, b = índices de nodos; mat = clave de MATERIALES)
     Devuelve {estable, mecanismo, desp:[{ux,uy}], piezas:[{N, cap, razon, falla, tipo}], falla}  */
  function analizar(nodos, piezas) {
    var EA = 1000, n = nodos.length, ndof = 2 * n, i, j;
    var K = []; for (i = 0; i < ndof; i++) { K.push(new Array(ndof).fill(0)); }
    var F = new Array(ndof).fill(0);

    piezas.forEach(function (p) {
      var a = nodos[p.a], b = nodos[p.b], L = largo(a, b);
      var c = (b.x - a.x) / L, s = (b.y - a.y) / L, k = EA / L;
      var m = [[c*c, c*s, -c*c, -c*s], [c*s, s*s, -c*s, -s*s], [-c*c, -c*s, c*c, c*s], [-c*s, -s*s, c*s, s*s]];
      var d = [2*p.a, 2*p.a+1, 2*p.b, 2*p.b+1];
      for (i = 0; i < 4; i++) for (j = 0; j < 4; j++) K[d[i]][d[j]] += k * m[i][j];
    });
    nodos.forEach(function (nd, idx) { F[2*idx] += nd.fx || 0; F[2*idx+1] += nd.fy || 0; });

    // Restricciones de los apoyos (los nodos sin piezas se anclan: no estorban)
    var tienePieza = new Array(n).fill(false);
    piezas.forEach(function (p) { tienePieza[p.a] = true; tienePieza[p.b] = true; });
    var libres = [];
    for (i = 0; i < n; i++) {
      var nd = nodos[i];
      var fijoX = nd.apoyo === 'fijo' || !tienePieza[i];
      var fijoY = nd.apoyo === 'fijo' || nd.apoyo === 'rodillo' || !tienePieza[i];
      if (!fijoX) libres.push(2*i);
      if (!fijoY) libres.push(2*i+1);
    }
    var A = [], bb = [];
    libres.forEach(function (r) {
      var fila = []; libres.forEach(function (c2) { fila.push(K[r][c2]); });
      fila[libres.indexOf(r)] += 1e-7;           // regularización: partes flojas no rompen el cálculo
      A.push(fila); bb.push(F[r]);
    });
    var u = new Array(ndof).fill(0);
    var sol = libres.length ? resolver(A, bb) : [];
    var mecanismo = !sol;
    if (sol) libres.forEach(function (r, idx) { u[r] = sol[idx]; });

    // Una carga sobre un nodo sin piezas, o desplazamientos enormes, indican un mecanismo
    nodos.forEach(function (nd, idx) {
      if ((nd.fx || nd.fy) && !tienePieza[idx]) mecanismo = true;
    });
    for (i = 0; i < ndof; i++) if (!isFinite(u[i]) || Math.abs(u[i]) > 5) mecanismo = true;

    var resultado = { mecanismo: mecanismo, desp: [], piezas: [], falla: false, sinConexion: false };
    nodos.forEach(function (nd, idx) { resultado.desp.push({ ux: u[2*idx], uy: u[2*idx+1] }); });

    piezas.forEach(function (p) {
      var a = nodos[p.a], b = nodos[p.b], L = largo(a, b), mat = MATERIALES[p.mat];
      var c = (b.x - a.x) / L, s = (b.y - a.y) / L;
      var dl = (u[2*p.b] - u[2*p.a]) * c + (u[2*p.b+1] - u[2*p.a+1]) * s;
      var N = mecanismo ? 0 : (EA / L) * dl;       // + tracción, − compresión
      var tipo = N >= 0 ? 'tension' : 'compresion';
      var cap = N >= 0 ? capTension(mat) : capCompresion(mat, L);
      var razon = Math.abs(N) / cap;
      var falla = razon > 1.0001;
      if (falla) resultado.falla = true;
      resultado.piezas.push({ N: N, cap: cap, razon: razon, falla: falla, tipo: tipo, largo: L,
                              pandeo: falla && tipo === 'compresion' && capCompresion(mat, L) < mat.compresion });
    });
    resultado.estable = !mecanismo && !resultado.falla;
    return resultado;
  }

  function costo(nodos, piezas) {
    return piezas.reduce(function (s, p) { return s + largo(nodos[p.a], nodos[p.b]) * MATERIALES[p.mat].precio; }, 0);
  }

  var api = { MATERIALES: MATERIALES, analizar: analizar, costo: costo, largo: largo,
              capCompresion: capCompresion, capTension: capTension };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Motor = api;
})(typeof window !== 'undefined' ? window : this);
