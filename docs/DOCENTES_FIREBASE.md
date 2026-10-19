# Cuentas de docentes de STEM Labs

Usan el **mismo proyecto de Firebase que Class Drive** (`classdrive-981c2`): un solo inicio de sesión con Google.

## 1. Dominio autorizado (una vez)
Firebase Console → **Authentication → Settings → Authorized domains → Add domain**:
- `labs.iscosanchez.com`

(El proveedor Google ya está activo por Class Drive.)

## 2. Reglas de Firestore (una vez)
Firebase Console → **Firestore Database → Rules**. Pega estos bloques **dentro de** `match /databases/{database}/documents { ... }`, junto a los de Class Drive (usan sus funciones `mi()` y `esAdmin()`):

```
    // ===== STEM Labs: cuentas de docentes y guías Makerspace =====
    function aprobadoLabs() {
      return mi() != '' && (esAdmin()
        || (exists(/databases/$(database)/documents/labs_docentes/$(mi()))
            && get(/databases/$(database)/documents/labs_docentes/$(mi())).data.estado == 'aprobado'));
    }
    // Solicitudes: cada docente crea y ve la suya (siempre «pendiente»); solo el administrador cambia el estado
    match /labs_docentes/{id} {
      allow read: if mi() != '' && (id == mi() || esAdmin());
      allow create: if esAdmin()
        || (id == mi() && request.resource.data.email == mi() && request.resource.data.estado == 'pendiente');
      allow update: if esAdmin()
        || (id == mi() && request.resource.data.estado == resource.data.estado);
      allow delete: if esAdmin();
    }
    // Guías editadas por cada docente (solo las suyas)
    match /labs_guias/{id} {
      allow read: if aprobadoLabs() && (esAdmin() || resource.data.email == mi());
      allow create, update: if aprobadoLabs() && request.resource.data.email == mi()
        && id == mi() + '__' + request.resource.data.actividad;
      allow delete: if aprobadoLabs() && id.split('__')[0] == mi();
    }
```
Pulsa **Publish**. También conviene guardar estos bloques en `firestore.rules` del repositorio de Class Drive para no perderlos en una próxima publicación.

## 3. Cómo funciona
- El docente entra a `labs.iscosanchez.com/stem/` → **👩‍🏫 Docentes → Entrar con Google**. Queda en estado **pendiente**.
- El superadministrador (`franksanlo@gmail.com`) entra con su cuenta, abre **Docentes** y ve «Pendientes» con **Aprobar / Bloquear / Quitar**; también puede **agregar un correo** ya aprobado.
- Un docente aprobado ve **🛠️ Guía Makerspace** en las tarjetas y dentro de cada laboratorio que ya tenga guía; puede **editarla** (se guarda solo en su cuenta, `labs_guias/{correo}__{actividad}`), imprimirla o **restaurar la original**.
- El administrador siempre queda aprobado (por su correo).
