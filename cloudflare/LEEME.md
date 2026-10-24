# Candado de contraseña para labs.iscosanchez.com

GitHub Pages no puede pedir contraseña, así que este Worker de Cloudflare se pone **delante** del sitio:
sin la contraseña no se entrega ningún archivo (ni `index.html`, ni `proyectos.json`, ni `/stem/`).

## Pasos (una sola vez)
1. **DNS en Cloudflare** → registro `labs` (CNAME → `iscosanchezl.github.io`) con la nube **naranja (Proxied)**. Si está gris, el Worker no se ejecuta.
2. **SSL/TLS** → modo **Full**.
3. Desde la carpeta `cloudflare/`:
   ```
   npx wrangler login
   npx wrangler secret put PASSWORD        # la contraseña que compartirás
   npx wrangler secret put COOKIE_SECRET   # cadena aleatoria larga: openssl rand -hex 32
   npx wrangler deploy
   ```
   (También se puede hacer en el panel: Workers & Pages → Create → pegar `worker.js` → Settings → Variables (tipo *Secret*) → Triggers → Route `labs.iscosanchez.com/*`.)
4. Prueba en una ventana privada: `https://labs.iscosanchez.com` debe mostrar la pantalla de contraseña.

## Cambiar la contraseña / cerrar sesiones
- Cambiar `PASSWORD` no cierra las sesiones ya abiertas (duran 7 días). Para expulsarlas a todas, cambia también `COOKIE_SECRET`.
- Cerrar sesión en un navegador: `/__salir`.

## Recomendado
- Cloudflare → Security → WAF → **Rate limiting**: limitar `POST /__login` (p. ej. 10 por minuto por IP).
- Probar el Worker sin Cloudflare: `node cloudflare/prueba.mjs`.

## Límites que conviene conocer
- El repo `labs` es **público** en GitHub: quien conozca el repo puede ver el código y `proyectos.json`.
- Las tarjetas enlazan a `iscosanchezl.github.io/<proyecto>/`, que **sigue abierto** para quien tenga esa dirección. Para cerrarlas habría que moverlas bajo este dominio y ponerlas detrás del mismo Worker.
- La contraseña es compartida: quien la tenga puede pasarla. Para accesos individuales, usa Cloudflare Access con lista de correos.
