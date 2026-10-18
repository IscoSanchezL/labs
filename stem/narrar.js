/* Narración de los laboratorios STEM: MP3 con la voz de Beto (es-MX-JorgeNeural) en <página>/audio/<id>.mp3.
   Si no hay MP3 (o el idioma no es español) habla el navegador. */
(function () {
  'use strict';
  var on = true; try { if (localStorage.getItem('stem-voz') === '0') on = false; } catch (e) {}
  var el = null;
  function parar() { if (el) { try { el.pause(); } catch (e) {} el = null; } try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) {} }
  function hablar(t) {
    if (!t || !window.speechSynthesis) return;
    var u = new SpeechSynthesisUtterance(t); u.lang = I18N.get() === 'en' ? 'en-US' : 'es-MX'; u.rate = 0.92; speechSynthesis.speak(u);
  }
  function decir(id, texto, forzar, sig) {
    if (!on && !forzar) return; parar();
    if (I18N.get() !== 'es') return hablar(texto);
    var a = new Audio('audio/' + id + '.mp3'); el = a;
    a.onerror = function () { hablar(texto); };
    if (sig) a.onended = function () { if (el === a) decir(sig[0], sig[1], true); };
    var p = a.play(); if (p && p.catch) p.catch(function () {});
  }
  window.Narrar = {
    decir: decir, parar: parar,
    activa: function () { return on; },
    alternar: function () { on = !on; try { localStorage.setItem('stem-voz', on ? '1' : '0'); } catch (e) {} if (!on) parar(); return on; }
  };
})();
