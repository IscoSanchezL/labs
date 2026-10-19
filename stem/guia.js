/* Guía Makerspace del docente: ventana con la guía (editable en la cuenta de cada docente) y ventana de cuenta/aprobación.
   Requiere datos.js, makerspace.js y docentes.js. API: STEMGUIA.abrir(experimento). En cada laboratorio añade el botón «🛠️ Guía Makerspace». */
(function () {
'use strict';
var $ = function (id) { return document.getElementById(id); };

function esc(t) { return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
var DOC = function () { return window.DOCENTES; };
var CUSTOM = {};
/* ---------- guía Makerspace: vista ---------- */
async function guia(e) {
  var d = $('guia'), id = e.id, base = MAKER[id], propia = null;
  try { propia = await DOC().leerGuia(id); } catch (x) { console.error(x); }
  CUSTOM[id] = propia; vista(e, propia || base, !!propia); if (d.showModal) { if (!d.open) d.showModal(); } else d.setAttribute('open', '');
}
function vista(e, m, esPropia) {
  var d = $('guia'), li = function (a) { return '<ul>' + a.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'; };
  var h = '<div class="gh"><b>' + e.icono + ' ' + esc(e.es.n) + ' · Guía Makerspace (' + e.grado + '°)' + (esPropia ? ' <small class="mia">mi versión</small>' : '') + '</b><span><button class="btn sec" type="button" id="gEd">✏️ Editar</button> ' + (esPropia ? '<button class="btn sec" type="button" id="gRes">↩️ Restaurar original</button> ' : '') + '<button class="btn sec" type="button" onclick="window.print()">🖨️ Imprimir</button> <button class="btn" type="button" onclick="document.getElementById(\'guia\').close()">Cerrar</button></span></div><div class="gc">';
  h += '<div class="meta"><span>⏱ ' + esc(m.dur) + '</span><span>👥 ' + esc(m.equipo) + '</span><span>📍 ' + esc(m.espacio) + '</span></div>';
  h += '<h3>Objetivo de aprendizaje</h3><div class="ob">' + esc(m.obj) + '</div><h3>Conexión con el laboratorio digital</h3><p style="margin:0;color:var(--muted);line-height:1.55">' + esc(m.lab) + '</p>';
  h += '<h3>Materiales</h3><table><tr><th>Material</th><th>Cantidad</th><th>Nota</th></tr>' + m.mat.map(function (r) { return '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>'; }).join('') + '</table>';
  if (m.herr && m.herr.length) h += '<h3>Herramientas</h3>' + li(m.herr);
  h += '<h3>Preparación del docente</h3><ol>' + m.prep.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol><h3>Seguridad</h3>' + li(m.seg);
  h += '<h3>Paso a paso (modelo 5E)</h3>' + m.pasos.map(function (p, i) { return '<div class="paso"><h4>' + (i + 1) + '. ' + esc(p.f) + ': ' + esc(p.t) + '<small>' + esc(p.min) + ' min</small></h4><ul>' + p.x.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>'; }).join('');
  h += '<h3>Preguntas para guiar la conversación</h3>' + li(m.preg);
  h += '<h3>Rúbrica (3 niveles)</h3><table><tr><th>Criterio</th><th>Inicia</th><th>Avanza</th><th>Logra</th></tr>' + m.rub.map(function (r) { return '<tr><td><b>' + esc(r[0]) + '</b></td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td><td>' + esc(r[3]) + '</td></tr>'; }).join('') + '</table>';
  h += '<h3>Errores comunes</h3>' + li(m.err) + '<h3>Para ir más lejos</h3>' + li(m.ext) + '</div>';
  d.innerHTML = h; $('gEd').onclick = function () { editor(e, JSON.parse(JSON.stringify(m)), esPropia); };
  if (esPropia) $('gRes').onclick = async function () { if (!confirm('¿Volver a la guía original? Se borran tus cambios de esta actividad.')) return; await DOC().borrarGuia(e.id); CUSTOM[e.id] = null; vista(e, MAKER[e.id], false); };
}
/* ---------- guía Makerspace: editor ---------- */
function editor(e, m, esPropia) {
  var d = $('guia'), L = function (a) { return (a || []).join('\n'); };
  var inp = function (k, v, cls) { return '<input data-k="' + k + '" class="' + (cls || '') + '" value="' + esc(v) + '">'; };
  var ta = function (k, v, rows) { return '<textarea data-k="' + k + '" rows="' + (rows || 3) + '">' + esc(v) + '</textarea>'; };
  var fila = function (cls, vals) { return '<tr class="' + cls + '">' + vals.map(function (v) { return '<td><textarea rows="2">' + esc(v) + '</textarea></td>'; }).join('') + '<td class="x"><button type="button" class="quitar" title="Quitar">✕</button></td></tr>'; };
  var h = '<div class="gh"><b>✏️ Editando · ' + e.icono + ' ' + esc(e.es.n) + '</b><span><button class="btn sec" type="button" id="gCan">Cancelar</button> <button class="btn" type="button" id="gSave">💾 Guardar mi versión</button></span></div><div class="gc ed">';
  h += '<p class="nota">Tus cambios se guardan <b>solo en tu cuenta</b>; la guía original no se modifica y puedes volver a ella cuando quieras. En las listas escribe <b>un elemento por línea</b>.</p>';
  h += '<h3>Datos generales</h3><label>Duración ' + inp('dur', m.dur) + '</label><label>Equipos ' + inp('equipo', m.equipo) + '</label><label>Lugar ' + inp('espacio', m.espacio) + '</label>';
  h += '<h3>Objetivo de aprendizaje</h3>' + ta('obj', m.obj, 3) + '<h3>Conexión con el laboratorio digital</h3>' + ta('lab', m.lab, 3);
  h += '<h3>Materiales</h3><table class="tmat"><tr><th>Material</th><th>Cantidad</th><th>Nota</th><th></th></tr>' + m.mat.map(function (r) { return fila('rmat', r); }).join('') + '</table><button type="button" class="btn sec mas" data-add="mat">+ Agregar material</button>';
  h += '<h3>Herramientas</h3>' + ta('herr', L(m.herr), 3) + '<h3>Preparación del docente</h3>' + ta('prep', L(m.prep), 5) + '<h3>Seguridad</h3>' + ta('seg', L(m.seg), 3);
  h += '<h3>Paso a paso</h3><div id="ePasos">' + m.pasos.map(paso).join('') + '</div><button type="button" class="btn sec mas" data-add="paso">+ Agregar paso</button>';
  h += '<h3>Preguntas para guiar</h3>' + ta('preg', L(m.preg), 4);
  h += '<h3>Rúbrica</h3><table class="trub"><tr><th>Criterio</th><th>Inicia</th><th>Avanza</th><th>Logra</th><th></th></tr>' + m.rub.map(function (r) { return fila('rrub', r); }).join('') + '</table><button type="button" class="btn sec mas" data-add="rub">+ Agregar criterio</button>';
  h += '<h3>Errores comunes</h3>' + ta('err', L(m.err), 3) + '<h3>Para ir más lejos</h3>' + ta('ext', L(m.ext), 3) + '</div>';
  function paso(p) { return '<div class="paso epaso"><div class="fl"><label>Momento ' + '<input class="pf" value="' + esc(p.f) + '"></label><label>Minutos <input class="pm" type="number" min="1" value="' + esc(p.min) + '"></label><button type="button" class="quitar" title="Quitar paso">✕</button></div><label>Título <input class="pt" value="' + esc(p.t) + '"></label><label>Qué hacer (una acción por línea)<textarea class="px" rows="4">' + esc((p.x || []).join('\n')) + '</textarea></label></div>'; }
  d.innerHTML = h;
  d.onclick = function (ev) {
    if (ev.target === d) return d.close();
    var q = ev.target.closest('.quitar'); if (q) { var el = q.closest('tr') || q.closest('.epaso'); if (el) el.remove(); return; }
    var ad = ev.target.getAttribute && ev.target.getAttribute('data-add'); if (!ad) return;
    if (ad === 'mat') d.querySelector('.tmat').insertAdjacentHTML('beforeend', fila('rmat', ['', '', '']));
    if (ad === 'rub') d.querySelector('.trub').insertAdjacentHTML('beforeend', fila('rrub', ['', '', '', '']));
    if (ad === 'paso') $('ePasos').insertAdjacentHTML('beforeend', paso({ f: '', min: 5, t: '', x: [] }));
  };
  $('gCan').onclick = function () { vista(e, CUSTOM[e.id] || MAKER[e.id], !!CUSTOM[e.id]); };
  $('gSave').onclick = async function () {
    var g = function (k) { return d.querySelector('[data-k="' + k + '"]').value; }, ls = function (k) { return g(k).split('\n').map(function (x) { return x.trim(); }).filter(Boolean); };
    var filas = function (sel) { return Array.prototype.map.call(d.querySelectorAll(sel), function (tr) { return Array.prototype.map.call(tr.querySelectorAll('textarea'), function (t) { return t.value.trim(); }); }).filter(function (r) { return r.some(Boolean); }); };
    var n = { dur: g('dur').trim(), equipo: g('equipo').trim(), espacio: g('espacio').trim(), obj: g('obj').trim(), lab: g('lab').trim(), mat: filas('tr.rmat'), herr: ls('herr'), prep: ls('prep'), seg: ls('seg'), preg: ls('preg'), rub: filas('tr.rrub'), err: ls('err'), ext: ls('ext'),
      pasos: Array.prototype.map.call(d.querySelectorAll('.epaso'), function (p) { return { f: p.querySelector('.pf').value.trim(), min: Number(p.querySelector('.pm').value) || 5, t: p.querySelector('.pt').value.trim(), x: p.querySelector('.px').value.split('\n').map(function (x) { return x.trim(); }).filter(Boolean) }; }) };
    n.mat = n.mat.map(function (r) { return [r[0] || '', r[1] || '', r[2] || '']; }); n.rub = n.rub.map(function (r) { return [r[0] || '', r[1] || '', r[2] || '', r[3] || '']; });
    this.disabled = true; this.textContent = 'Guardando…';
    try { await DOC().guardarGuia(e.id, n); CUSTOM[e.id] = n; vista(e, n, true); } catch (x) { console.error(x); alert('No se pudo guardar (' + (x.code || x.message) + '). Intenta de nuevo.'); this.disabled = false; this.textContent = '💾 Guardar mi versión'; }
  };
}
/* ---------- cuenta de docente ---------- */
function pintarDoc() {
  var D2 = DOC(), b = $('bDoc'), dlg = $('docentes'); if (!D2 || !dlg) return; if (!b) { if (dlg.open) cuerpoDoc(D2.estado()); return; } var st = D2.estado();
  b.textContent = st.estado === 'aprobado' ? '👩‍🏫 ' + (st.nombre ? st.nombre.split(' ')[0] : 'Docente') : st.estado === 'pendiente' ? '⏳ Docente (pendiente)' : '👩‍🏫 Docentes';
  if (!dlg.open) return; cuerpoDoc(st);
}
function cuerpoDoc(st) {
  var dlg = $('docentes'), h = '<div class="gh"><b>👩‍🏫 Cuenta de docente</b><button class="btn" type="button" onclick="document.getElementById(\'docentes\').close()">Cerrar</button></div><div class="gc">';
  if (st.estado === 'cargando') h += '<p class="nota">Cargando…</p>';
  else if (st.estado === 'error') h += '<p class="nota mal">No se pudo conectar (' + esc(st.error) + '). Revisa tu conexión e inténtalo de nuevo.</p><button class="btn" type="button" id="dEnt">Entrar con Google</button>';
  else if (st.estado === 'sin-sesion') h += '<p class="nota">Con una cuenta de docente puedes ver, <b>editar</b> e imprimir las guías del <b>Makerspace</b> de cada actividad.</p><p class="nota">Entra con tu cuenta de Google. El administrador debe aprobar tu acceso la primera vez.</p><button class="btn grande" type="button" id="dEnt">Entrar con Google</button>' + (st.error ? '<p class="nota mal">No se pudo iniciar sesión (' + esc(st.error) + ').</p>' : '');
  else if (st.estado === 'pendiente') h += '<p class="nota ok">✅ Recibimos tu solicitud, <b>' + esc(st.email) + '</b>.</p><p class="nota">El administrador debe aprobarla. Cuando lo haga, vuelve a entrar y verás las guías.</p><button class="btn sec" type="button" id="dSal">Cerrar sesión</button>';
  else if (st.estado === 'bloqueado') h += '<p class="nota mal">Esta cuenta (' + esc(st.email) + ') no tiene acceso a las guías. Si crees que es un error, escribe al administrador.</p><button class="btn sec" type="button" id="dSal">Cerrar sesión</button>';
  else { h += '<p class="nota ok">Hola, <b>' + esc(st.nombre || st.email) + '</b>' + (st.admin ? ' · superadministrador' : '') + '. En cada tarjeta verás el botón <b>🛠️ Guía Makerspace</b>.</p><button class="btn sec" type="button" id="dSal">Cerrar sesión</button>'; if (st.admin) h += '<h3>Solicitudes y docentes</h3><div id="dAdm" class="nota">Cargando…</div>'; }
  dlg.innerHTML = h + '</div>';
  var e1 = $('dEnt'); if (e1) e1.onclick = function () { DOC().entrar(); }; var e2 = $('dSal'); if (e2) e2.onclick = function () { DOC().salir(); };
  if (st.estado === 'aprobado' && st.admin) panelAdmin();
}
async function panelAdmin() {
  var cont = $('dAdm'); if (!cont) return; var D2 = DOC(), lista;
  try { lista = await D2.listar(); } catch (x) { cont.textContent = 'No se pudo leer la lista (' + (x.code || x.message) + ').'; return; }
  var grupos = [['pendiente', '⏳ Pendientes'], ['aprobado', '✅ Aprobados'], ['bloqueado', '🚫 Bloqueados']], h = '';
  grupos.forEach(function (g) {
    var xs = lista.filter(function (p) { return (p.estado || 'pendiente') === g[0] && p.email !== D2.MAKER_ADMIN; });
    h += '<h4 class="gt">' + g[1] + ' (' + xs.length + ')</h4>' + (xs.length ? xs.map(function (p) { return '<div class="doc" data-e="' + esc(p.email) + '"><span><b>' + esc(p.nombre || p.email) + '</b><br><small>' + esc(p.email) + '</small></span><span class="ac">' + (g[0] !== 'aprobado' ? '<button class="btn" data-a="aprobado">Aprobar</button>' : '') + (g[0] !== 'bloqueado' ? '<button class="btn sec" data-a="bloqueado">Bloquear</button>' : '') + '<button class="btn sec" data-a="quitar" title="Quitar de la lista">🗑</button></span></div>'; }).join('') : '<p class="vacio2">Nadie por aquí.</p>');
  });
  h += '<h4 class="gt">➕ Agregar docente por correo</h4><div class="doc"><input id="dMail" type="email" placeholder="correo@gmail.com" style="flex:1"><button class="btn" id="dAdd" type="button">Agregar y aprobar</button></div>';
  cont.innerHTML = h;
  cont.onclick = async function (ev) { var bt = ev.target.closest('button[data-a]'); if (!bt) return; var em = bt.closest('.doc').getAttribute('data-e'), a = bt.getAttribute('data-a'); bt.disabled = true; try { if (a === 'quitar') { if (!confirm('¿Quitar a ' + em + ' de la lista?')) { bt.disabled = false; return; } await D2.quitar(em); } else await D2.cambiar(em, a); } catch (x) { alert('No se pudo (' + (x.code || x.message) + ')'); } panelAdmin(); };
  $('dAdd').onclick = async function () { try { await D2.agregar($('dMail').value); panelAdmin(); } catch (x) { alert(x.message || 'No se pudo agregar'); } };
}
function abrirDoc() { var dlg = $('docentes'); cuerpoDoc(DOC() ? DOC().estado() : { estado: 'cargando' }); if (dlg.showModal) { if (!dlg.open) dlg.showModal(); } else dlg.setAttribute('open', ''); }
function iniciar() {
  ['guia', 'docentes'].forEach(function (id) { if (!$(id)) { var d = document.createElement('dialog'); d.id = id; d.setAttribute('aria-label', id === 'guia' ? 'Guía para el docente' : 'Cuenta de docente'); document.body.appendChild(d); } });
  if (!$('guia')._ok) { $('guia')._ok = 1; }
  if ($('bDoc')) $('bDoc').onclick = abrirDoc; $('docentes').addEventListener('click', function (ev) { if (ev.target === this) this.close(); });
  var go = function () { if (!DOC()) return setTimeout(go, 100); DOC().onCambio(function () { if (window.pintar) window.pintar(); pintarDoc(); botonLab(); }); }; go();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();

/* ---------- botón dentro de cada laboratorio ---------- */
function actual() { var D = window.STEM; if (!D) return null; var p = location.pathname.replace(/index\.html$/, ''); var r = null; D.experimentos.forEach(function (e) { if (e.url && p.indexOf(e.url.replace(/^(\.\.\/)+/, '').replace(/\/$/, '') + '/') > -1 || (e.url && p.slice(-(e.url.length)) === e.url)) r = r || e; }); return r; }
function botonLab() {
  if ($('bDoc')) return; var e = actual(); if (!e || !window.MAKER || !MAKER[e.id]) return; var ya = $('bGuiaLab'), ok = DOC() && DOC().esDocente();
  if (!ok) { if (ya) ya.remove(); return; } if (ya) return;
  var b = document.createElement('button'); b.id = 'bGuiaLab'; b.type = 'button'; b.className = 'btn-guia'; b.textContent = '🛠️ Guía Makerspace (docente)'; b.onclick = function () { guia(e); };
  var der = document.querySelector('.top .der') || document.querySelector('.top .wrap'); if (der) der.insertBefore(b, der.firstChild);
}
window.STEMGUIA = { abrir: guia };
})();
