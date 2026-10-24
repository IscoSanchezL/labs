# Candado de contraseña y hosting de labs.iscosanchez.com

El Worker `labs-candado` (Cloudflare) hace dos cosas: **pide la contraseña** y **sirve el sitio él mismo** desde `dist/`.
Así GitHub Pages deja de ser necesario y los repos pueden ser **privados**.

- `wrangler.toml` (raíz): nombre, ruta `labs.iscosanchez.com/*`, comando de build y carpeta de archivos.
- `scripts/construir.mjs`: arma `dist/` con SOLO lo público (portada, `actividades/`, `stem/`, `assets/`). Nunca `fuentes/`, `tools/`, `docs/`, `cloudflare/`.
- `cloudflare/worker.js`: la lógica de la contraseña. Abierto sin contraseña: `/stem/…` y `/assets/…` (ver `esPublica`).
- Secretos `PASSWORD` y `COOKIE_SECRET`: viven en Cloudflare (Configuración → Variables y secretos). No están en el repo.

## Conectar el repo a Cloudflare (una vez)
Workers y Pages → `labs-candado` → **Configuración** → **Compilaciones** (*Builds*) → **Conectar** → GitHub → repo `labs`, rama `main`.
- Comando de compilación: `node scripts/construir.mjs`
- Comando de implementación: `npx wrangler deploy`
- Directorio raíz: `/`

Desde ahí, cada `git push` a `main` publica solo. El código pegado a mano en el panel se reemplaza por el del repo.

## Cambiar la contraseña / cerrar sesiones
- Cambiar `PASSWORD` no cierra las sesiones abiertas (duran 7 días). Para expulsarlas a todas, cambia también `COOKIE_SECRET`.
- Cerrar sesión en un navegador: `/__salir`.

## Pruebas
- `node cloudflare/prueba.mjs` (lógica del Worker).
- `npx wrangler dev --local --var PASSWORD:x COOKIE_SECRET:y` (Worker + sitio reales, en local).

## Recomendado
- Cloudflare → Security → WAF → **Rate limiting** sobre `POST /__login` (p. ej. 10 por minuto por IP).
