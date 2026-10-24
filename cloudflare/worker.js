/* Candado de contraseña para labs.iscosanchez.com (Cloudflare Worker).
   Se ejecuta en el borde de Cloudflare, antes de GitHub Pages: sin sesión válida no se entrega ningún archivo del sitio.
   Secretos (wrangler secret put): PASSWORD (la contraseña compartida) y COOKIE_SECRET (cadena aleatoria larga). */
const COOKIE = 'labs_sesion';
const DURACION = 60 * 60 * 24 * 7; // 7 días
const enc = new TextEncoder();

async function firmar(secreto, texto) {
  const k = await crypto.subtle.importKey('raw', enc.encode(secreto), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const f = new Uint8Array(await crypto.subtle.sign('HMAC', k, enc.encode(texto)));
  return Array.from(f, (b) => b.toString(16).padStart(2, '0')).join('');
}
// Compara dos textos en tiempo constante (se comparan sus firmas, que tienen siempre la misma longitud)
async function iguales(secreto, a, b) {
  const [x, y] = await Promise.all([firmar(secreto, 'cmp:' + a), firmar(secreto, 'cmp:' + b)]);
  let d = 0;
  for (let i = 0; i < x.length; i++) d |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return d === 0;
}
async function sesionValida(request, env) {
  const m = (request.headers.get('Cookie') || '').match(new RegExp('(?:^|;\\s*)' + COOKIE + '=(\\d+)\\.([0-9a-f]{64})'));
  if (!m || Number(m[1]) < Date.now() / 1000) return false;
  return iguales(env.COOKIE_SECRET, m[2], await firmar(env.COOKIE_SECRET, 'sesion:' + m[1]));
}
// Rutas abiertas sin contraseña: la sección STEM (por enlace) y los estilos compartidos que ella necesita
const esPublica = (ruta) => /^\/(stem|assets)(\/|$)/.test(ruta);
// Solo rutas internas del sitio: evita redirigir a otro dominio tras entrar
const destinoSeguro = (d) => (typeof d === 'string' && /^\/(?!\/|\\)/.test(d) ? d : '/');
const esc = (t) => t.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function pagina(destino, error, estado = 401) {
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Acceso · Labs Isco Sanchez</title>
<style>
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0b1220;color:#e8eef6;font:16px/1.4 system-ui,sans-serif;padding:16px}
form{width:100%;max-width:340px;background:#121c30;border:1px solid #243049;border-radius:14px;padding:28px}
h1{margin:0 0 4px;font-size:20px}p{margin:0 0 18px;color:#9aa9b8;font-size:14px}
label{display:block;font-size:13px;margin-bottom:6px}
input{width:100%;padding:11px 12px;border-radius:8px;border:1px solid #324261;background:#0b1220;color:inherit;font:inherit}
button{width:100%;margin-top:14px;padding:11px;border:0;border-radius:8px;background:#7ff0e4;color:#06201d;font:inherit;font-weight:600;cursor:pointer}
.err{min-height:20px;margin-top:10px;color:#ffb4b4;font-size:13px}
</style></head><body>
<form method="POST" action="/__login">
<h1>Labs Isco Sanchez</h1><p>Escribe la contraseña para entrar.</p>
<input type="hidden" name="next" value="${esc(destino)}">
<label for="p">Contraseña</label><input id="p" name="password" type="password" autocomplete="current-password" required autofocus maxlength="200">
<div class="err" role="alert">${error ? esc(error) : ''}</div>
<button type="submit">Entrar</button>
</form></body></html>`;
  return new Response(html, { status: estado, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });
}

export default {
  async fetch(request, env) {
    if (!env.PASSWORD || !env.COOKIE_SECRET) return new Response('Falta configurar PASSWORD y COOKIE_SECRET', { status: 500 });
    const url = new URL(request.url);

    if (esPublica(url.pathname) && !url.pathname.startsWith('/__')) return fetch(request);

    if (url.pathname === '/__login' && request.method === 'POST') {
      const datos = await request.formData();
      const destino = destinoSeguro(datos.get('next'));
      if (!(await iguales(env.COOKIE_SECRET, String(datos.get('password') || ''), env.PASSWORD))) {
        await new Promise((r) => setTimeout(r, 800)); // frena los intentos automáticos
        return pagina(destino, 'Contraseña incorrecta.');
      }
      const exp = String(Math.floor(Date.now() / 1000) + DURACION);
      const valor = exp + '.' + (await firmar(env.COOKIE_SECRET, 'sesion:' + exp));
      return new Response(null, { status: 303, headers: {
        Location: destino, 'Cache-Control': 'no-store',
        'Set-Cookie': `${COOKIE}=${valor}; Max-Age=${DURACION}; Path=/; Secure; HttpOnly; SameSite=Lax`
      } });
    }
    if (url.pathname === '/__salir') {
      return new Response(null, { status: 303, headers: { Location: '/', 'Set-Cookie': `${COOKIE}=; Max-Age=0; Path=/; Secure; HttpOnly; SameSite=Lax` } });
    }
    if (await sesionValida(request, env)) {
      const r = await fetch(request); // sin cambios: pasa a GitHub Pages
      const sal = new Response(r.body, r);
      sal.headers.set('Cache-Control', 'private, no-store'); // que ninguna caché compartida guarde páginas protegidas
      sal.headers.set('X-Robots-Tag', 'noindex');
      return sal;
    }
    return pagina(url.pathname + url.search, '');
  }
};
