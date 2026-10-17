import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
const aqui = fileURLToPath(new URL('.', import.meta.url));
export default defineConfig({
  root: aqui,
  base: './',
  build: { outDir: fileURLToPath(new URL('../../actividades/estructuras', import.meta.url)), emptyOutDir: true, chunkSizeWarningLimit: 900, target: 'es2020' },
  server: { fs: { allow: [fileURLToPath(new URL('../..', import.meta.url))] } }
});
