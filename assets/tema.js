/* Botón de modo día / noche para todas las páginas de labs.iscosanchez.com.
   Lo inserta scripts/construir.mjs en cada HTML de dist/; no hace falta tocar las páginas.
   La elección se guarda en localStorage ('labs-theme') y vale para todo el sitio (mismo origen).

   Atributos del <script> (los pone el build):
     data-base="sistema|oscuro|claro"  cómo se ve la página sin elección guardada
     data-soporte="nativo|invertir"    nativo: la página ya tiene estilos para [data-theme];
                                       invertir: se invierten los colores y se protegen imágenes y canvas */
(function () {
  'use strict';
  var KEY = 'labs-theme';
  var root = document.documentElement;
  var me = document.currentScript;
  var base = (me && me.getAttribute('data-base')) || 'sistema';
  var soporte = (me && me.getAttribute('data-soporte')) || 'nativo';
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function guardado() { try { var v = localStorage.getItem(KEY); return v === 'light' || v === 'dark' ? v : null; } catch (e) { return null; } }
  function sistema() { return mq && mq.matches ? 'dark' : 'light'; }
  function aspectoBase() { return base === 'oscuro' ? 'dark' : base === 'claro' ? 'light' : sistema(); }
  function efectivo() { return guardado() || aspectoBase(); }

  function aplicar() {
    var t = efectivo();
    root.setAttribute('data-theme', t);
    root.style.colorScheme = t;
    if (soporte === 'invertir') {
      if (t !== aspectoBase()) root.setAttribute('data-inv', ''); else root.removeAttribute('data-inv');
    }
    pintarBoton();
  }

  var css = document.createElement('style');
  css.textContent =
    'html[data-inv]{filter:invert(1) hue-rotate(180deg);background:#fff}' +
    'html[data-inv] img,html[data-inv] video,html[data-inv] canvas,html[data-inv] picture,html[data-inv] iframe,html[data-inv] svg image{filter:invert(1) hue-rotate(180deg)}' +
    '#labs-tema{position:fixed;right:max(10px,env(safe-area-inset-right,0px));bottom:max(10px,env(safe-area-inset-bottom,0px));z-index:2147483000;' +
    'width:42px;height:42px;padding:0;border-radius:50%;border:1px solid rgba(255,255,255,.4);background:rgba(18,28,38,.82);color:#fff;font-size:20px;line-height:1;' +
    'display:grid;place-items:center;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.32);opacity:.92;-webkit-tap-highlight-color:transparent;' +
    '-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);transition:transform .15s,opacity .15s}' +
    '#labs-tema:hover{opacity:1;transform:scale(1.08)}#labs-tema:active{transform:scale(.96)}' +
    '#labs-tema:focus-visible{outline:3px solid #58DDD3;outline-offset:3px}' +
    'html[data-inv] #labs-tema{filter:invert(1) hue-rotate(180deg)}' +
    '@media print{#labs-tema{display:none}}';
  (document.head || root).appendChild(css);

  var boton = null;
  function textos(t) {
    var en = String(root.lang || document.documentElement.getAttribute('lang') || 'es').toLowerCase().indexOf('en') === 0;
    return t === 'dark' ? (en ? 'Switch to day mode' : 'Cambiar a modo día') : (en ? 'Switch to night mode' : 'Cambiar a modo noche');
  }
  function pintarBoton() {
    if (!boton) return;
    var t = efectivo();
    boton.textContent = t === 'dark' ? '☀️' : '🌙';
    boton.setAttribute('aria-label', textos(t));
    boton.setAttribute('title', textos(t));
    boton.setAttribute('aria-pressed', String(t === 'dark'));
  }
  function crearBoton() {
    if (boton || document.getElementById('labs-tema')) return;
    boton = document.createElement('button');
    boton.id = 'labs-tema'; boton.type = 'button';
    boton.addEventListener('click', function () {
      var siguiente = efectivo() === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(KEY, siguiente); } catch (e) { /* sin almacenamiento: vale solo en esta página */ root.setAttribute('data-theme', siguiente); }
      aplicar();
    });
    (document.body || root).appendChild(boton);
    pintarBoton();
  }

  aplicar();
  if (mq && mq.addEventListener) mq.addEventListener('change', function () { if (!guardado()) aplicar(); });
  window.addEventListener('storage', function (e) { if (e.key === KEY) aplicar(); });
  // el atributo lang puede cambiar cuando la página cambia de idioma
  new MutationObserver(pintarBoton).observe(root, { attributes: true, attributeFilter: ['lang'] });
  if (document.body) crearBoton(); else document.addEventListener('DOMContentLoaded', crearBoton);
  window.labsTema = { obtener: efectivo, poner: function (t) { try { localStorage.setItem(KEY, t); } catch (e) {} aplicar(); } };
})();
