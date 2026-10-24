// Prueba local: node cloudflare/prueba.mjs
import w from './worker.js';
import assert from 'node:assert/strict';
const env = { PASSWORD: 'clave-de-prueba', COOKIE_SECRET: 'x'.repeat(40) };
globalThis.fetch = async () => new Response('SITIO PRIVADO', { status: 200 });
const pedir = (ruta, init = {}) => w.fetch(new Request('https://labs.iscosanchez.com' + ruta, init), env);
const login = (pass, next = '/stem/') => pedir('/__login', { method: 'POST', body: new URLSearchParams({ password: pass, next }) });

let r = await pedir('/'); assert.equal(r.status, 401); assert.ok(!(await r.text()).includes('SITIO PRIVADO'));
for (const ruta of ['/stem/', '/stem', '/stem/actividades/adn/index.html', '/assets/lab.css']) { r = await pedir(ruta); assert.equal(r.status, 200, ruta + ' debe ser pública'); }
for (const ruta of ['/index.html', '/stemx/', '/stem/../proyectos.json', '/actividades/circuitos/', '/']) { r = await pedir(ruta); assert.equal(r.status, 401, ruta + ' debe pedir contraseña'); }
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
