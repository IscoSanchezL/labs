/* Idiomas compartidos de labs: español e inglés.
   Uso: I18N.add({es:{clave:'texto'}, en:{clave:'text'}}); I18N.t('clave', {n:3});
   En el HTML: data-i18n="clave" (innerHTML) y data-i18n-attr="placeholder:clave;aria-label:otraClave". */
(function (root) {
  'use strict';
  var D = { es: {}, en: {} }, L = 'es', cbs = [];
  function leer() { try { return localStorage.getItem('labs-lang'); } catch (e) { return null; } }
  function detectar() {
    var s = leer();
    if (s === 'es' || s === 'en') return s;
    var n = (navigator.language || 'es').toLowerCase();
    return n.indexOf('en') === 0 ? 'en' : 'es';
  }
  L = detectar();
  function t(k, v) {
    var s = D[L] && D[L][k];
    if (s === undefined) s = D.es[k] !== undefined ? D.es[k] : k;
    if (v) for (var x in v) s = s.split('{' + x + '}').join(v[x]);
    return s;
  }
  function add(es, en) {
    var k;
    for (k in es) D.es[k] = es[k];
    for (k in en) D.en[k] = en[k];
  }
  function aplicar() {
    document.documentElement.lang = L;
    var i, els = document.querySelectorAll('[data-i18n]');
    for (i = 0; i < els.length; i++) els[i].innerHTML = t(els[i].getAttribute('data-i18n'));
    els = document.querySelectorAll('[data-i18n-attr]');
    for (i = 0; i < els.length; i++) {
      els[i].getAttribute('data-i18n-attr').split(';').forEach(function (par) {
        var p = par.split(':'); if (p.length === 2) els[i].setAttribute(p[0].trim(), t(p[1].trim()));
      });
    }
    if (D.es.titulo !== undefined) document.title = t('titulo');
    var meta = document.querySelector('meta[name="description"]');
    if (meta && D.es.descripcion !== undefined) meta.setAttribute('content', t('descripcion'));
    var bs = document.querySelectorAll('.lang button');
    for (i = 0; i < bs.length; i++) bs[i].setAttribute('aria-pressed', String(bs[i].getAttribute('data-l') === L));
    cbs.forEach(function (f) { try { f(L); } catch (e) { console.error(e); } });
  }
  function set(l) {
    if (l !== 'es' && l !== 'en') return;
    L = l;
    try { localStorage.setItem('labs-lang', l); } catch (e) {}
    aplicar();
  }
  function montar() {
    var cont = document.getElementById('lang');
    if (cont && !cont.firstChild) {
      cont.className = 'lang'; cont.setAttribute('role', 'group'); cont.setAttribute('aria-label', 'Idioma / Language');
      [['es', 'ES'], ['en', 'EN']].forEach(function (p) {
        var b = document.createElement('button'); b.type = 'button'; b.setAttribute('data-l', p[0]); b.textContent = p[1];
        b.addEventListener('click', function () { set(p[0]); }); cont.appendChild(b);
      });
    }
    aplicar();
  }
  function onChange(f) { cbs.push(f); }
  root.I18N = { t: t, add: add, set: set, get: function () { return L; }, onChange: onChange, montar: montar, aplicar: aplicar };
})(window);
