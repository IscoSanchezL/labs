// Prepara la carpeta dist/ con SOLO lo que se publica. El Worker de Cloudflare sirve dist/ (ver wrangler.toml);
// así el código fuente (fuentes/, tools/, docs/, cloudflare/, .github/) nunca se entrega.
// Uso: node scripts/construir.mjs
import { cpSync, rmSync, mkdirSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PUBLICO = ['index.html', 'proyectos.json', 'favicon.png', 'logo.png', 'hero.jpg', 'assets', 'actividades', 'stem'];

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist');
for (const p of PUBLICO) {
  if (!existsSync(p)) throw new Error('Falta lo que debe publicarse: ' + p);
  cpSync(p, 'dist/' + p, { recursive: true });
}
console.log('dist/ lista: ' + PUBLICO.join(', '));

/* Botón de modo día / noche: se inserta assets/tema.js en cada HTML de dist/ (ver ese archivo).
   - SISTEMA: páginas con estilos propios para [data-theme]; sin elección siguen el modo del sistema.
   - PROPIO: ya tienen su botón; se dejan igual.
   - Páginas con assets/lab.css: tema claro nativo en lab.css; sin elección se ven oscuras como siempre.
   - El resto se invierte (los colores se invierten y se protegen imágenes y canvas); BASE_CLARA dice cuáles se ven claras sin tocar. */
const SISTEMA = ['hardware-software', 'partes-del-computador', 'puzzles', 'correos-4to'];
const PROPIO = ['typing', 'goldberg-machine'];
const BASE_CLARA = ['beto-algoritmos', 'detectives-de-carpetas', 'proyecto-paint-2do'];
function etiqueta(ruta, html) {
  const partes = ruta.split('/');
  if (partes.some((p) => PROPIO.includes(p))) return null;
  if (partes.some((p) => SISTEMA.includes(p))) return ['sistema', 'nativo'];
  if (/assets\/lab\.css/.test(html)) return ['oscuro', 'nativo'];
  if (partes[0] === 'stem') return ['oscuro', 'invertir'];
  return [BASE_CLARA.includes(partes[1]) ? 'claro' : 'oscuro', 'invertir'];
}
let insertados = 0;
(function recorrer(dir, rel) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (e.name !== 'vendor' && e.name !== 'node_modules') recorrer(join(dir, e.name), rel ? rel + '/' + e.name : e.name); continue; }
    if (!e.name.endsWith('.html')) continue;
    const ruta = rel ? rel + '/' + e.name : e.name, arch = join(dir, e.name);
    let html = readFileSync(arch, 'utf8');
    if (html.includes('assets/tema.js')) continue;
    const et = etiqueta(rel ? rel + '/' + e.name : e.name, html);
    if (!et) continue;
    const tag = `<script src="/assets/tema.js" data-base="${et[0]}" data-soporte="${et[1]}"></script>`;
    html = /<\/head>/i.test(html) ? html.replace(/<\/head>/i, tag + '\n</head>') : /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, (m) => m + '\n' + tag) : tag + '\n' + html;
    writeFileSync(arch, html);
    insertados++;
  }
})('dist', '');
console.log('Botón día/noche insertado en ' + insertados + ' páginas');
