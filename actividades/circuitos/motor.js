/* Motor eléctrico de "Laboratorio de circuitos".
   Corriente continua con análisis nodal. Componentes: pila, resistencia, LED, interruptor, empalme.
   Los LED se resuelven con un modelo por tramos (encendido si la tensión supera su Vf). */
(function (root) {
  'use strict';

  var V_PILA = 5, R_PILA = 0.5;
  var LED_RS = 10;
  var LED_VF = { rojo: 2.0, amarillo: 2.1, verde: 2.2 };
  var I_LED_MAX = 0.03;          // por encima se quema
  var I_LED_ENCENDIDO = 0.0015;  // por debajo casi no se ve
  var I_LED_BUENO = 0.005;       // brillo cómodo
  var I_CORTO = 0.4;
  var RESISTENCIAS = [100, 220, 330, 470, 1000];

  var TERMINALES = { pila: ['a', 'b'], resistencia: ['a', 'b'], led: ['a', 'b'], interruptor: ['a', 'b'], empalme: ['j'] };
  function tid(id, t) { return id + ':' + t; }

  function Union(n) { this.p = []; for (var i = 0; i < n; i++) this.p.push(i); }
  Union.prototype.f = function (x) { while (this.p[x] !== x) { this.p[x] = this.p[this.p[x]]; x = this.p[x]; } return x; };
  Union.prototype.u = function (a, b) { this.p[this.f(a)] = this.f(b); };

  function resolver(A, b) {
    var n = b.length, i, j, k;
    for (i = 0; i < n; i++) {
      var p = i, mx = Math.abs(A[i][i]);
      for (j = i + 1; j < n; j++) if (Math.abs(A[j][i]) > mx) { mx = Math.abs(A[j][i]); p = j; }
      if (mx < 1e-30) return null;
      if (p !== i) { var t = A[i]; A[i] = A[p]; A[p] = t; var tb = b[i]; b[i] = b[p]; b[p] = tb; }
      for (j = i + 1; j < n; j++) {
        var f = A[j][i] / A[i][i]; if (!f) continue;
        for (k = i; k < n; k++) A[j][k] -= f * A[i][k];
        b[j] -= f * b[i];
      }
    }
    var x = new Array(n);
    for (i = n - 1; i >= 0; i--) { var s = b[i]; for (j = i + 1; j < n; j++) s -= A[i][j] * x[j]; x[i] = s / A[i][i]; }
    return x;
  }

  /* circ = { comps:[{id,tipo,valor,color,abierto,quemado}], cables:[[idTerminal,idTerminal]] } */
  function simular(circ, opciones) {
    opciones = opciones || {};
    var comps = circ.comps, cables = circ.cables;
    // índice de terminales
    var idx = {}, lista = [];
    comps.forEach(function (c) { TERMINALES[c.tipo].forEach(function (t) { idx[tid(c.id, t)] = lista.length; lista.push(tid(c.id, t)); }); });
    var uf = new Union(lista.length);
    var validos = cables.filter(function (w) { return idx[w[0]] !== undefined && idx[w[1]] !== undefined; });
    validos.forEach(function (w) { uf.u(idx[w[0]], idx[w[1]]); });
    // nodos
    var nodoDe = {}, nNodos = 0, raiz = {};
    lista.forEach(function (t, i) { var r = uf.f(i); if (raiz[r] === undefined) raiz[r] = nNodos++; nodoDe[t] = raiz[r]; });
    var pila = comps.filter(function (c) { return c.tipo === 'pila'; })[0];
    var res = { comps: {}, cables: [], corto: false, quemados: [], hayPila: !!pila, nodoDe: nodoDe };
    comps.forEach(function (c) { res.comps[c.id] = { I: 0, Vab: 0, lit: false, brillo: 0, quemado: !!c.quemado }; });
    validos.forEach(function () { res.cables.push(0); });
    if (!pila) return res;
    var tierra = nodoDe[tid(pila.id, 'b')];

    function resolverUna(apagarPila, ledOn, extraQuemados) {
      // incógnitas: todos los nodos salvo tierra
      var map = {}, k = 0, i;
      for (i = 0; i < nNodos; i++) if (i !== tierra) map[i] = k++;
      var n = k, G = [], B = new Array(n).fill(0);
      for (i = 0; i < n; i++) G.push(new Array(n).fill(0));
      function g(na, nb, val) {
        if (na !== tierra) G[map[na]][map[na]] += val;
        if (nb !== tierra) G[map[nb]][map[nb]] += val;
        if (na !== tierra && nb !== tierra) { G[map[na]][map[nb]] -= val; G[map[nb]][map[na]] -= val; }
      }
      function inyecta(nn, val) { if (nn !== tierra) B[map[nn]] += val; }
      for (i = 0; i < nNodos; i++) if (i !== tierra) G[map[i]][map[i]] += 1e-9;
      comps.forEach(function (c) {
        var na = nodoDe[tid(c.id, 'a')], nb = nodoDe[tid(c.id, 'b')];
        if (c.tipo === 'pila') {
          var V = apagarPila ? 0 : V_PILA; g(na, nb, 1 / R_PILA); inyecta(na, V / R_PILA); inyecta(nb, -V / R_PILA);
        } else if (c.tipo === 'resistencia') {
          g(na, nb, 1 / c.valor);
        } else if (c.tipo === 'interruptor') {
          g(na, nb, c.abierto ? 1e-9 : 1e3);
        } else if (c.tipo === 'led') {
          var apagado = c.quemado || extraQuemados[c.id];
          if (apagado || !ledOn[c.id]) g(na, nb, 1e-9);
          else { var vf = LED_VF[c.color] || 2; g(na, nb, 1 / LED_RS); inyecta(na, vf / LED_RS); inyecta(nb, -vf / LED_RS); }
        }
      });
      var sol = n ? resolver(G, B) : [];
      if (!sol) sol = new Array(n).fill(0);
      var V = []; for (i = 0; i < nNodos; i++) V.push(i === tierra ? 0 : sol[map[i]]);
      return V;
    }

    var quemadosExtra = {}, apagarPila = false, V, ledOn = {}, iter, i2;
    for (var ronda = 0; ronda < 6; ronda++) {
      comps.forEach(function (c) { if (c.tipo === 'led') ledOn[c.id] = false; });
      for (iter = 0; iter < 40; iter++) {
        V = resolverUna(apagarPila, ledOn, quemadosExtra);
        var cambio = false;
        comps.forEach(function (c) {
          if (c.tipo !== 'led') return;
          var vab = V[nodoDe[tid(c.id, 'a')]] - V[nodoDe[tid(c.id, 'b')]];
          var on = vab > (LED_VF[c.color] || 2) + 1e-9;
          if (on !== ledOn[c.id]) { ledOn[c.id] = on; cambio = true; }
        });
        if (!cambio) break;
      }
      // protección y quemado
      var nuevo = false;
      var ib = (function () { var vab = V[nodoDe[tid(pila.id, 'a')]] - V[nodoDe[tid(pila.id, 'b')]]; return ((apagarPila ? 0 : V_PILA) - vab) / R_PILA; })();
      if (!apagarPila && ib > I_CORTO) {
        // ¿el exceso es por LED sin resistencia (se queman) o es un corto franco (cable directo)?
        var quemo = false;
        comps.forEach(function (c) {
          if (c.tipo !== 'led' || c.quemado || quemadosExtra[c.id] || !ledOn[c.id]) return;
          var vab = V[nodoDe[tid(c.id, 'a')]] - V[nodoDe[tid(c.id, 'b')]], I = (vab - (LED_VF[c.color] || 2)) / LED_RS;
          if (I > I_LED_MAX) { quemadosExtra[c.id] = true; quemo = true; res.quemados.push(c.id); }
        });
        if (!quemo) { apagarPila = true; res.corto = true; }
        nuevo = true;
      } else {
        comps.forEach(function (c) {
          if (c.tipo !== 'led' || c.quemado || quemadosExtra[c.id] || !ledOn[c.id]) return;
          var vab = V[nodoDe[tid(c.id, 'a')]] - V[nodoDe[tid(c.id, 'b')]], I = (vab - (LED_VF[c.color] || 2)) / LED_RS;
          if (I > I_LED_MAX) { quemadosExtra[c.id] = true; res.quemados.push(c.id); nuevo = true; }
        });
      }
      if (!nuevo) break;
    }

    // corrientes finales
    var inyeccion = {};
    comps.forEach(function (c) {
      var na = nodoDe[tid(c.id, 'a')], nb = nodoDe[tid(c.id, 'b')], vab = (V[na] || 0) - (V[nb] || 0), r = res.comps[c.id], I = 0;
      if (c.tipo === 'pila') { I = -(((apagarPila ? 0 : V_PILA) - vab) / R_PILA); }
      else if (c.tipo === 'resistencia') I = vab / c.valor;
      else if (c.tipo === 'interruptor') I = c.abierto ? 0 : vab * 1e3;
      else if (c.tipo === 'led') {
        var apagado = c.quemado || quemadosExtra[c.id];
        I = (!apagado && ledOn[c.id]) ? (vab - (LED_VF[c.color] || 2)) / LED_RS : 0;
        r.quemado = !!(c.quemado || quemadosExtra[c.id]);
        r.lit = !r.quemado && I >= I_LED_ENCENDIDO;
        r.brillo = r.quemado ? 0 : Math.max(0, Math.min(1, I / 0.02));
      }
      r.I = I; r.Vab = vab;
      if (c.tipo !== 'empalme') { inyeccion[tid(c.id, 'a')] = -I; inyeccion[tid(c.id, 'b')] = I; }
    });
    // corriente por cada cable (árbol de expansión por red)
    var adj = {}; lista.forEach(function (t) { adj[t] = []; });
    validos.forEach(function (w, k) { adj[w[0]].push([w[1], k, 1]); adj[w[1]].push([w[0], k, -1]); });
    var visto = {};
    lista.forEach(function (raizT) {
      if (visto[raizT]) return;
      var orden = [], padre = {}, pila2 = [raizT];
      visto[raizT] = true; padre[raizT] = null;
      while (pila2.length) {
        var u = pila2.pop(); orden.push(u);
        adj[u].forEach(function (e) { if (!visto[e[0]]) { visto[e[0]] = true; padre[e[0]] = [u, e[1], e[2]]; pila2.push(e[0]); } });
      }
      var suma = {}; orden.forEach(function (t) { suma[t] = inyeccion[t] || 0; });
      for (var q = orden.length - 1; q > 0; q--) {
        var t = orden[q], pd = padre[t]; if (!pd) continue;
        // corriente que sale del subárbol de t hacia su padre; el cable se guarda de [0]→[1]
        var w = validos[pd[1]], fluye = suma[t];                  // de t hacia el padre
        res.cables[pd[1]] = (w[0] === t) ? fluye : -fluye;
        suma[pd[0]] += suma[t];
      }
    });
    res.cablesValidos = validos;
    return res;
  }

  function clonar(circ, cambios) {
    var c = JSON.parse(JSON.stringify(circ));
    (cambios || []).forEach(function (f) { f(c); });
    return c;
  }
  function conLed(res, circ) { return circ.comps.filter(function (c) { return c.tipo === 'led'; }); }
  function bueno(r) { return r && !r.quemado && r.I >= I_LED_BUENO && r.I <= I_LED_MAX; }

  /* ---------- misiones ---------- */
  function combinaciones(n) { var out = []; for (var m = 0; m < (1 << n); m++) { var a = []; for (var i = 0; i < n; i++) a.push(!!(m & (1 << i))); out.push(a); } return out; }

  var MISIONES = [
    { id: 1, nombre: 'Enciende tu primer LED',
      texto: 'Conecta la <b>pila</b>, una <b>resistencia</b> y un <b>LED</b> para que el LED brille <b>sin quemarse</b>. Primero prueba sin la resistencia, ¡y mira qué pasa!',
      pista: 'Haz un camino cerrado: pila + → resistencia → LED (por el lado del triángulo, el ánodo) → pila −. La resistencia limita la corriente.',
      pregunta: '¿Para qué sirve la resistencia en este circuito?',
      opciones: ['Para que el LED brille más fuerte', 'Para limitar la corriente y que el LED no se queme', 'Para guardar la energía de la pila'], correcta: 1,
      explica: 'Sin resistencia, la corriente es demasiado grande y el LED se quema. La resistencia la limita a un valor seguro.',
      validar: function (circ) {
        var r = simular(circ), leds = conLed(r, circ), ok = leds.some(function (l) { return bueno(r.comps[l.id]); });
        return { ok: ok, estado: r };
      } },
    { id: 2, nombre: 'Controla con un interruptor',
      texto: 'Añade un <b>interruptor</b> para encender y apagar el LED. Debe brillar con el interruptor <b>cerrado</b> y apagarse al <b>abrirlo</b>.',
      pista: 'Pon el interruptor en el mismo camino que la resistencia y el LED. Haz clic sobre él para abrirlo o cerrarlo.',
      pregunta: '¿Qué pasa con la corriente cuando el interruptor está abierto?',
      opciones: ['Sigue pasando, pero más despacio', 'No pasa: el camino está cortado', 'Pasa en sentido contrario'], correcta: 1,
      explica: 'Abierto significa que el camino se interrumpe. Sin camino cerrado no hay corriente y el LED se apaga.',
      validar: function (circ) {
        var sws = circ.comps.filter(function (c) { return c.tipo === 'interruptor'; });
        if (!sws.length) return { ok: false, estado: simular(circ) };
        var cerrado = clonar(circ, [function (c) { c.comps.forEach(function (k) { if (k.tipo === 'interruptor') k.abierto = false; }); }]);
        var abierto = clonar(circ, [function (c) { c.comps.forEach(function (k) { if (k.tipo === 'interruptor') k.abierto = true; }); }]);
        var rc = simular(cerrado), ra = simular(abierto), leds = conLed(rc, circ);
        var enciende = leds.some(function (l) { return bueno(rc.comps[l.id]); });
        var apaga = leds.every(function (l) { return !ra.comps[l.id].lit; });
        return { ok: enciende && apaga, estado: simular(circ) };
      } },
    { id: 3, nombre: 'Dos LED en serie',
      texto: 'Enciende <b>dos LED uno detrás del otro</b> (en <b>serie</b>) con una sola resistencia. Si uno falla, ¿qué pasará con el otro?',
      pista: 'Un solo camino: pila + → resistencia → LED 1 → LED 2 → pila −. Con 5 V no alcanza para tres LED en serie, ¡pruébalo!',
      pregunta: 'Si se quema uno de los LED en serie, ¿qué pasa con el otro?',
      opciones: ['Se apaga también, porque el camino se corta', 'Brilla más fuerte', 'No le pasa nada'], correcta: 0,
      explica: 'En serie hay un solo camino. Si se corta en un punto, se apaga todo, como las luces de un árbol de Navidad viejo.',
      validar: function (circ) {
        var r = simular(circ), leds = conLed(r, circ).filter(function (l) { return r.comps[l.id].lit && !r.comps[l.id].quemado; });
        if (leds.length < 2) return { ok: false, estado: r };
        var enSerie = leds.every(function (l) {
          var c2 = clonar(circ, [function (c) { c.comps.forEach(function (k) { if (k.id === l.id) k.quemado = true; }); }]);
          var r2 = simular(c2);
          return leds.filter(function (o) { return o.id !== l.id; }).every(function (o) { return !r2.comps[o.id].lit; });
        });
        var mismaI = Math.abs(r.comps[leds[0].id].I - r.comps[leds[1].id].I) < 1e-5;
        return { ok: enSerie && mismaI, estado: r };
      } },
    { id: 4, nombre: 'Dos LED en paralelo',
      texto: 'Enciende <b>dos LED en paralelo</b>, cada uno con su propia resistencia. Si uno falla, el otro debe <b>seguir brillando</b>.',
      pista: 'Dos caminos a la vez: de la pila salen dos ramas, cada una con resistencia + LED, y se juntan de nuevo en la pila −. Usa los empalmes para repartir.',
      pregunta: 'Si se quema uno de los LED en paralelo, ¿qué pasa con el otro?',
      opciones: ['Se apaga también', 'Sigue brillando, porque tiene su propio camino', 'Se quema también'], correcta: 1,
      explica: 'En paralelo cada rama es un camino independiente. Por eso las luces de tu casa están en paralelo: si una falla, las demás siguen.',
      validar: function (circ) {
        var r = simular(circ), leds = conLed(r, circ).filter(function (l) { return bueno(r.comps[l.id]); });
        if (leds.length < 2) return { ok: false, estado: r };
        var indep = leds.every(function (l) {
          var c2 = clonar(circ, [function (c) { c.comps.forEach(function (k) { if (k.id === l.id) k.quemado = true; }); }]);
          var r2 = simular(c2);
          return leds.filter(function (o) { return o.id !== l.id; }).some(function (o) { return bueno(r2.comps[o.id]); });
        });
        return { ok: indep, estado: r };
      } },
    { id: 5, nombre: 'El semáforo',
      texto: 'Arma un <b>semáforo</b>: un LED <b>rojo</b>, uno <b>amarillo</b> y uno <b>verde</b>, cada uno con su resistencia y su interruptor. Debes poder encender <b>cada color solo</b>.',
      pista: 'Tres ramas en paralelo. Cada rama: interruptor → resistencia → LED. Así controlas cada luz por separado, como harás con el Arduino en TinkerCAD.',
      pregunta: 'En el semáforo, ¿por qué cada LED lleva su propia resistencia?',
      opciones: ['Para que cada LED reciba una corriente segura', 'Para que se vean de colores distintos', 'Porque una sola resistencia no cabe'], correcta: 0,
      explica: 'Cada rama necesita limitar su corriente. Es exactamente lo que harás con el Arduino: un pin, una resistencia y un LED por cada luz.',
      validar: function (circ) {
        var sws = circ.comps.filter(function (c) { return c.tipo === 'interruptor'; });
        var leds = circ.comps.filter(function (c) { return c.tipo === 'led'; });
        var colores = ['rojo', 'amarillo', 'verde'];
        var base = simular(circ);
        if (sws.length < 3 || colores.some(function (col) { return !leds.some(function (l) { return l.color === col; }); })) return { ok: false, estado: base, combos: null };
        if (sws.length > 6) return { ok: false, estado: base, combos: null };
        var combos = {};
        combinaciones(sws.length).forEach(function (cmb) {
          var c2 = clonar(circ, [function (c) { var i = 0; c.comps.forEach(function (k) { if (k.tipo === 'interruptor') { k.abierto = !cmb[i]; i++; } }); }]);
          var r2 = simular(c2);
          if (r2.corto || r2.quemados.length) return;
          var encendidos = leds.filter(function (l) { return r2.comps[l.id].lit; });
          if (encendidos.length === 1 && bueno(r2.comps[encendidos[0].id]) && !combos[encendidos[0].color]) combos[encendidos[0].color] = cmb;
        });
        var ok = colores.every(function (col) { return !!combos[col]; });
        return { ok: ok, estado: base, combos: ok ? combos : null, switches: sws.map(function (s) { return s.id; }) };
      } }
  ];

  var api = { simular: simular, MISIONES: MISIONES, TERMINALES: TERMINALES, LED_VF: LED_VF, RESISTENCIAS: RESISTENCIAS, V_PILA: V_PILA,
              I_LED_MAX: I_LED_MAX, I_LED_BUENO: I_LED_BUENO, tid: tid, clonar: clonar };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.MotorCircuitos = api;
})(typeof window !== 'undefined' ? window : this);
