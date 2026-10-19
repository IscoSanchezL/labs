# Cuentas de docentes de STEM Labs (proyecto de Firebase propio)

STEM Labs usa **su propio proyecto de Firebase**, separado de Class Drive y de cualquier otra app.

## 1. Crear el proyecto (una vez, plan gratuito Spark)
1. https://console.firebase.google.com → **Agregar proyecto** → nombre, por ejemplo `stem-labs-gi` (sin Google Analytics).
2. **Build → Authentication → Comenzar → Sign-in method → Google → Habilitar** (correo de asistencia: franksanlo@gmail.com) → Guardar.
3. **Authentication → Settings → Authorized domains → Add domain**: `labs.iscosanchez.com`.
4. **Build → Firestore Database → Crear base de datos** → modo **producción** → ubicación cercana (p. ej. `nam5` o `southamerica-east1`).
5. **Firestore → Rules**: pega **todo** el contenido de `docs/firestore.stem.rules` → **Publish**.
6. **Project settings (⚙️) → General → Tus apps → ícono `</>` (Web)** → registra la app «STEM Labs» (sin Hosting) → copia el bloque `firebaseConfig`.
7. Pégalo (o pásamelo en el chat) en `stem/firebase-config.js`, reemplazando los valores `PEGA_…`. Esa configuración es pública; la seguridad la dan las reglas.

## 2. Cómo funciona
- El docente entra a `labs.iscosanchez.com/stem/` → **👩‍🏫 Docentes → Entrar con Google**. Queda **pendiente**.
- El superadministrador (`franksanlo@gmail.com`) abre **Docentes** y ve «Pendientes» con **Aprobar / Bloquear / Quitar**; también puede **agregar un correo** ya aprobado. Su cuenta siempre queda aprobada.
- Un docente aprobado ve **🛠️ Guía Makerspace** en las tarjetas y dentro de cada laboratorio con guía; puede **editarla** (se guarda solo en su cuenta, `labs_guias/{correo}__{actividad}`), imprimirla o **restaurar la original**.
- Mientras `firebase-config.js` tenga los valores `PEGA_…`, el botón Docentes avisa que falta configurar.
