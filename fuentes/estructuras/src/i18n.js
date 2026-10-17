/* Idiomas compartidos de labs (español / inglés). Misma clave de almacenamiento que el resto: labs-lang. */
const D = { es: {}, en: {} };
let L = 'es';
const cbs = [];
const leer = () => { try { return localStorage.getItem('labs-lang'); } catch (e) { return null; } };
function detectar() {
  const s = leer();
  if (s === 'es' || s === 'en') return s;
  return (navigator.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es';
}
L = detectar();
export function t(k, v) {
  let s = D[L] && D[L][k];
  if (s === undefined) s = D.es[k] !== undefined ? D.es[k] : k;
  if (v) for (const x in v) s = s.split('{' + x + '}').join(v[x]);
  return s;
}
export const idioma = () => L;
export function agregar(es, en) { Object.assign(D.es, es); Object.assign(D.en, en); }
export function alCambiar(f) { cbs.push(f); }
function aplicar() {
  document.documentElement.lang = L;
  document.querySelectorAll('[data-i18n]').forEach((e) => { e.innerHTML = t(e.getAttribute('data-i18n')); });
  document.querySelectorAll('[data-i18n-attr]').forEach((e) => {
    e.getAttribute('data-i18n-attr').split(';').forEach((par) => { const p = par.split(':'); if (p.length === 2) e.setAttribute(p[0].trim(), t(p[1].trim())); });
  });
  if (D.es.titulo !== undefined) document.title = t('titulo');
  const meta = document.querySelector('meta[name="description"]');
  if (meta && D.es.descripcion !== undefined) meta.setAttribute('content', t('descripcion'));
  document.querySelectorAll('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.getAttribute('data-l') === L)));
  cbs.forEach((f) => { try { f(L); } catch (e) { console.error(e); } });
}
export function poner(l) {
  if (l !== 'es' && l !== 'en') return;
  L = l;
  try { localStorage.setItem('labs-lang', l); } catch (e) {}
  aplicar();
}
export function montar() {
  const cont = document.getElementById('lang');
  if (cont && !cont.firstChild) {
    cont.className = 'lang'; cont.setAttribute('role', 'group'); cont.setAttribute('aria-label', 'Idioma / Language');
    [['es', 'ES'], ['en', 'EN']].forEach(([k, txt]) => {
      const b = document.createElement('button'); b.type = 'button'; b.setAttribute('data-l', k); b.textContent = txt;
      b.addEventListener('click', () => poner(k)); cont.appendChild(b);
    });
  }
  aplicar();
}
