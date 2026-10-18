/* Efectos y puntos (XP) para los laboratorios STEM que no usan LabKit: confeti al cumplir una misión y barra de nivel.
   Uso: <script src="../../fx-lite.js"></script> y llamar STEMFX.exito() cuando se cumple una misión. */
(function () {
  'use strict';
  var XPK = 'stem-xp', NIV = ['Aprendiz', 'Explorador', 'Investigador', 'Científico', 'Inventor', 'Maestro STEM'], cv = null, g = null, P = [], hud = null, corre = false, last = 0;
  var reducir = false; try { reducir = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  function xp() { try { return Number(localStorage.getItem(XPK)) || 0; } catch (e) { return 0; } }
  function pintar() { if (!hud) { var p = document.getElementById('pasos'); if (!p || !p.parentNode) return; hud = document.createElement('div'); hud.className = 'hud'; p.parentNode.insertBefore(hud, p.nextSibling); } var x = xp(), n = Math.min(NIV.length - 1, Math.floor(x / 300)); hud.innerHTML = '<span class="hud-n">🏅 ' + NIV[n] + '</span><span class="hud-barra"><i style="width:' + (n === NIV.length - 1 ? 100 : Math.round((x % 300) / 3)) + '%"></i></span><span class="hud-xp">⭐ ' + x + ' XP</span>'; }
  function iniciar() { if (cv) return; cv = document.createElement('canvas'); cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:50'; document.body.appendChild(cv); g = cv.getContext('2d'); ajustar(); window.addEventListener('resize', ajustar); }
  function ajustar() { cv.width = innerWidth; cv.height = innerHeight; }
  function bucle(ms) { var dt = Math.min(0.05, (ms - (last || ms)) / 1000); last = ms; g.clearRect(0, 0, cv.width, cv.height); for (var i = P.length - 1; i >= 0; i--) { var p = P[i]; p.v -= dt; if (p.v <= 0 || p.y > cv.height + 20) { P.splice(i, 1); continue; } p.x += p.vx * dt; p.y += p.vy * dt; p.rot += dt * 6; p.vx += Math.sin(p.rot) * 40 * dt; g.save(); g.globalAlpha = Math.min(1, p.v * 1.5); g.translate(p.x, p.y); g.rotate(p.rot); g.fillStyle = p.c; g.fillRect(-p.w / 2, -p.w / 4, p.w, p.w / 2); g.restore(); } if (P.length) requestAnimationFrame(bucle); else { corre = false; last = 0; } }
  window.STEMFX = {
    exito: function () {
      try { localStorage.setItem(XPK, String(xp() + 100)); } catch (e) {} pintar(); if (reducir) return; iniciar(); var cols = ['#ff6b8a', '#ffd05c', '#5cc8ff', '#7be39a', '#b9a8ff', '#ff9f43'];
      for (var i = 0; i < 110; i++) P.push({ x: Math.random() * cv.width, y: -10 - Math.random() * 80, vx: (Math.random() - 0.5) * 140, vy: 120 + Math.random() * 260, v: 2.6 + Math.random(), w: 7 + Math.random() * 7, rot: Math.random() * 6, c: cols[i % cols.length] });
      if (!corre) { corre = true; requestAnimationFrame(bucle); }
    },
    xp: xp, pintar: pintar
  };
  if (document.readyState !== 'loading') setTimeout(pintar, 0); else document.addEventListener('DOMContentLoaded', function () { setTimeout(pintar, 0); });
})();
