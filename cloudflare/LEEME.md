# Candado de contraseña y hosting de labs.iscosanchez.com

El Worker `labs-candado` (Cloudflare) hace dos cosas: **pide la contraseña** y **sirve el sitio él mismo** desde `dist/`.
Así GitHub Pages deja de ser necesario y los repos pueden ser **privados**.

- `wrangler.toml` (raíz): nombre, ruta `labs.iscosanchez.com/*`, comando de build y carpeta de archivos.
- `scripts/construir.mjs`: arma `dist/` con SOLO lo público (portada, `actividades/`, `stem/`, `assets/`). Nunca `fuentes/`, `tools/`, `docs/`, `cloudflare/`.
- `cloudflare/worker.js`: la lógica de la contraseña. Abierto sin contraseña: `/stem/…`, `/assets/…` y `/actividades/escape-halloween/…` (ver `esPublica`).
- Secretos `PASSWORD` y `COOKIE_SECRET`: viven en Cloudflare (Configuración → Variables y secretos). No están en el repo.

## Conectar el repo a Cloudflare (una vez)
Workers y Pages → `labs-candado` → **Configuración** → **Compilaciones** (*Builds*) → **Conectar** → GitHub → repo `labs`, rama `main`.
- Comando de compilación: `node scripts/construir.mjs`
- Comando de implementación: `npx wrangler deploy`
- Directorio raíz: `/`

Desde ahí, cada `git push` a `main` publica solo (compilación en Cloudflare: Workers y Pages → `labs-candado` → Implementaciones). El código pegado a mano en el panel se reemplaza por el del repo.

## Cambiar la contraseña / cerrar sesiones
- Cambiar `PASSWORD` no cierra las sesiones abiertas (duran 7 días). Para expulsarlas a todas, cambia también `COOKIE_SECRET`.
- Cerrar sesión en un navegador: `/__salir`.

## Pruebas
- `node cloudflare/prueba.mjs` (lógica del Worker).
- `npx wrangler dev --local --var PASSWORD:x COOKIE_SECRET:y` (Worker + sitio reales, en local).

## Límite de intentos
El Worker limita `POST /__login` a **10 intentos por minuto por IP** (binding `LOGIN_LIMITER` en `wrangler.toml`).
Pasado el límite responde 429 hasta que termine el minuto. No hace falta crear ninguna regla en el WAF.
