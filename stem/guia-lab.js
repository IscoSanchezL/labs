/* Cargador de la guía Makerspace para las páginas de cada laboratorio (solo se activa para docentes aprobados).
   Uso: <script src="../../guia-lab.js"></script> al final del <body> de stem/actividades/<lab>/index.html */
(function () {
  var base = document.currentScript.src.replace(/guia-lab\.js.*$/, '');
  var css = document.createElement('link'); css.rel = 'stylesheet'; css.href = base + 'guia.css'; document.head.appendChild(css);
  function js(src, mod) { return new Promise(function (ok) { var s = document.createElement('script'); s.src = base + src; if (mod) s.type = 'module'; s.onload = s.onerror = ok; document.body.appendChild(s); }); }
  js('firebase-config.js').then(function () { return js('datos.js'); }).then(function () { return js('makerspace.js'); }).then(function () { var p = location.pathname, e = (window.STEM ? window.STEM.experimentos : []).filter(function (x) { return x.url && p.indexOf(x.url.replace(/^(\.\.\/)+/, '')) > -1; })[0]; return e ? js('makerspace-g' + e.grado + '.js') : null; }).then(function () { return js('guia.js'); }).then(function () { return js('docentes.js', true); });
})();
