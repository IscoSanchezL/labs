// Prepara la carpeta dist/ con SOLO lo que se publica. El Worker de Cloudflare sirve dist/ (ver wrangler.toml);
// así el código fuente (fuentes/, tools/, docs/, cloudflare/, .github/) nunca se entrega.
// Uso: node scripts/construir.mjs
import { cpSync, rmSync, mkdirSync, existsSync } from 'node:fs';

const PUBLICO = ['index.html', 'proyectos.json', 'favicon.png', 'logo.png', 'hero.jpg', 'assets', 'actividades', 'stem'];

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist');
for (const p of PUBLICO) {
  if (!existsSync(p)) throw new Error('Falta lo que debe publicarse: ' + p);
  cpSync(p, 'dist/' + p, { recursive: true });
}
console.log('dist/ lista: ' + PUBLICO.join(', '));
