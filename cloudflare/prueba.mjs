// Prueba local: node cloudflare/prueba.mjs
import w from './worker.js';
import assert from 'node:assert/strict';
const env = { PASSWORD: 'clave-de-prueba', COOKIE_SECRET: 'x'.repeat(40) };
globalThis.fetch = async () => new Response('SITIO PRIVADO', { status: 200 });
const pedir = (ruta, init = {}) => w.fetch(new Request('https://labs.iscosanchez.com' + ruta, init), env);
const login = (pass, next = '/stem/') => pedir('/__login', { method: 'POST', body: new URLSearchParams({ password: pass, next }) });

let r = await pedir('/'); assert.equal(r.status, 401); assert.ok(!(await r.text()).includes('SITIO PRIVADO'));
for (const ruta of ['/stem/', '/stem', '/stem/actividades/adn/index.html', '/assets/lab.css', '/actividades/escape-halloween/', '/actividades/escape-halloween', '/actividades/escape-halloween/scare3d.js', '/actividades/escape-halloween/vendor/three.min.js']) { r = await pedir(ruta); assert.equal(r.status, 200, ruta + ' debe ser pública'); }
for (const ruta of ['/index.html', '/stemx/', '/stem/../proyectos.json', '/actividades/circuitos/', '/', '/actividades/escape-halloween-x/', '/actividades/escape-halloween/../typing/', '/actividades/']) { r = await pedir(ruta); assert.equal(r.status, 401, ruta + ' debe pedir contraseña'); }
r = await pedir('/proyectos.json'); assert.equal(r.status, 401);
r = await login('mala'); assert.equal(r.status, 401);
r = await login('clave-de-prueba'); assert.equal(r.status, 303); assert.equal(r.headers.get('Location'), '/stem/');
const cookie = r.headers.get('Set-Cookie').split(';')[0];
r = await pedir('/stem/', { headers: { Cookie: cookie } }); assert.equal(r.status, 200); assert.equal(await r.text(), 'SITIO PRIVADO');
r = await pedir('/', { headers: { Cookie: cookie.slice(0, -1) + '0' } }); assert.equal(r.status, 401, 'cookie alterada');
r = await pedir('/', { headers: { Cookie: 'labs_sesion=9999999999.' + '0'.repeat(64) } }); assert.equal(r.status, 401, 'cookie inventada');
r = await pedir('/', { headers: { Cookie: 'labs_sesion=1.' + cookie.split('.')[1] } }); assert.equal(r.status, 401, 'cookie vencida');
r = await login('clave-de-prueba', '//evil.com'); assert.equal(r.headers.get('Location'), '/', 'redirección externa bloqueada');
console.log('Todas las pruebas pasaron');

// Con binding ASSETS: sirve desde ahí y nunca llama al origen
globalThis.fetch = async () => { throw new Error('no debe llamar al origen'); };
const envA = { ...env, ASSETS: { fetch: async (r) => new Response('DESDE ASSETS ' + new URL(r.url).pathname) } };
const pedirA = (ruta, init = {}) => w.fetch(new Request('https://labs.iscosanchez.com' + ruta, init), envA);
r = await pedirA('/stem/'); assert.equal(await r.text(), 'DESDE ASSETS /stem/');
r = await pedirA('/actividades/typing/'); assert.equal(r.status, 401);
r = await w.fetch(new Request('https://labs.iscosanchez.com/__login', { method: 'POST', body: new URLSearchParams({ password: 'clave-de-prueba', next: '/' }) }), envA);
const ck = r.headers.get('Set-Cookie').split(';')[0];
r = await pedirA('/actividades/typing/', { headers: { Cookie: ck } }); assert.equal(await r.text(), 'DESDE ASSETS /actividades/typing/');
console.log('Pruebas con ASSETS: bien');

r = await pedirA('/stem/'); assert.equal(r.headers.get('X-Content-Type-Options'), 'nosniff'); assert.ok(r.headers.get('Strict-Transport-Security'));
r = await pedirA('/'); assert.equal(r.headers.get('Referrer-Policy'), 'strict-origin-when-cross-origin');
console.log('Cabeceras de seguridad: bien');

// Límite de intentos: tras 3 intentos con el mismo IP, el 4.º recibe 429 (limitador simulado)
let usados = 0;
const envL = { ...envA, LOGIN_LIMITER: { limit: async () => ({ success: ++usados <= 3 }) } };
const intento = () => w.fetch(new Request('https://labs.iscosanchez.com/__login', { method: 'POST', headers: { 'CF-Connecting-IP': '1.2.3.4' }, body: new URLSearchParams({ password: 'mala', next: '/' }) }), envL);
for (let i = 0; i < 3; i++) assert.equal((await intento()).status, 401);
r = await intento(); assert.equal(r.status, 429); assert.ok((await r.text()).includes('Demasiados intentos'));
console.log('Límite de intentos: bien');
