/* Cuentas de docentes de STEM Labs: inicio de sesión con Google, aprobación del superadministrador y guías Makerspace propias.
   Usa un proyecto de Firebase propio de STEM Labs (Auth con Google + Firestore); su configuración va en firebase-config.js. Colecciones:
     labs_docentes/{correo}        → { email, nombre, foto, estado: 'pendiente' | 'aprobado' | 'bloqueado', pedido, resuelto, por }
     labs_guias/{correo}__{actividad} → { email, actividad, datos (JSON de la guía), actualizado }
   Expone window.DOCENTES. Para pruebas: definir window.__DOCENTES_MOCK antes de cargar este módulo. */
const ADMIN = 'franksanlo@gmail.com';
const CONF = window.STEM_FIREBASE || {};
const configurado = () => !!(CONF.apiKey && CONF.projectId && !/^(REEMPLAZA|PEGA)/i.test(CONF.apiKey));

let B = window.__DOCENTES_MOCK || null;
async function backendReal() {
  const [{ initializeApp }, A, F] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js')
  ]);
  const app = initializeApp(CONF, 'stem-labs'), auth = A.getAuth(app), db = F.getFirestore(app), prov = new A.GoogleAuthProvider(); prov.setCustomParameters({ prompt: 'select_account' });
  const ref = (c, id) => F.doc(db, c, id);
  return {
    onSesion: (fn) => A.onAuthStateChanged(auth, (u) => fn(u ? { email: String(u.email || '').toLowerCase(), nombre: u.displayName || '', foto: u.photoURL || '' } : null)),
    entrar: async () => { try { await A.signInWithPopup(auth, prov); } catch (e) { if (['auth/popup-blocked', 'auth/cancelled-popup-request', 'auth/web-storage-unsupported'].includes(e.code)) await A.signInWithRedirect(auth, prov); else throw e; } },
    salir: () => A.signOut(auth),
    leer: async (c, id) => { const s = await F.getDoc(ref(c, id)); return s.exists() ? s.data() : null; },
    guardar: (c, id, d) => F.setDoc(ref(c, id), d, { merge: true }),
    borrar: (c, id) => F.deleteDoc(ref(c, id)),
    listar: async (c, campo, valor) => (await F.getDocs(campo ? F.query(F.collection(db, c), F.where(campo, '==', valor)) : F.collection(db, c))).docs.map((d) => d.data())
  };
}

const D = { _u: null, _p: null, _est: 'cargando', _err: '', _fn: [], MAKER_ADMIN: ADMIN };
const avisar = () => D._fn.forEach((f) => { try { f(D.estado()); } catch (e) { console.error(e); } });
D.onCambio = (f) => { D._fn.push(f); f(D.estado()); };
D.estado = () => ({ estado: D._est, email: D._u ? D._u.email : '', nombre: D._u ? D._u.nombre : '', foto: D._u ? D._u.foto : '', admin: !!D._u && D._u.email === ADMIN, docente: D._est === 'aprobado', error: D._err });
D.esDocente = () => D._est === 'aprobado';
D.esAdmin = () => !!D._u && D._u.email === ADMIN;

async function sesion(u) {
  D._u = u; D._err = '';
  if (!u) { D._est = 'sin-sesion'; D._p = null; return avisar(); }
  try {
    let p = await B.leer('labs_docentes', u.email), ahora = new Date().toISOString();
    if (!p) { p = { email: u.email, nombre: u.nombre, foto: u.foto, estado: u.email === ADMIN ? 'aprobado' : 'pendiente', pedido: ahora }; if (u.email === ADMIN) { p.resuelto = ahora; p.por = ADMIN; } await B.guardar('labs_docentes', u.email, p); }
    else if (p.nombre !== u.nombre || p.foto !== u.foto) { await B.guardar('labs_docentes', u.email, { nombre: u.nombre, foto: u.foto }); }
    D._p = p; D._est = u.email === ADMIN ? 'aprobado' : (p.estado || 'pendiente');
  } catch (e) { console.error('Docentes:', e); D._est = 'error'; D._err = (e && (e.code || e.message)) || 'error'; }
  avisar();
}
D.entrar = async () => { try { D._err = ''; await B.entrar(); } catch (e) { D._err = (e && (e.code || e.message)) || 'error'; avisar(); } };
D.salir = async () => { await B.salir(); };
D.listar = async () => (D.esAdmin() ? (await B.listar('labs_docentes')).sort((a, b) => String(a.pedido).localeCompare(String(b.pedido))) : []);
D.cambiar = async (email, estado) => { if (!D.esAdmin()) throw new Error('Solo el administrador'); await B.guardar('labs_docentes', email.toLowerCase(), { estado, resuelto: new Date().toISOString(), por: D._u.email }); };
D.agregar = async (email, nombre) => { if (!D.esAdmin()) throw new Error('Solo el administrador'); email = String(email).trim().toLowerCase(); if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('Correo no válido'); const ahora = new Date().toISOString(); await B.guardar('labs_docentes', email, { email, nombre: nombre || email.split('@')[0], estado: 'aprobado', pedido: ahora, resuelto: ahora, por: D._u.email }); };
D.quitar = async (email) => { if (!D.esAdmin()) throw new Error('Solo el administrador'); await B.borrar('labs_docentes', email.toLowerCase()); };
const idGuia = (act) => D._u.email + '__' + act;
D.leerGuia = async (act) => { if (!D.esDocente()) return null; const g = await B.leer('labs_guias', idGuia(act)); if (!g) return null; try { return JSON.parse(g.datos); } catch (e) { return null; } };
D.guardarGuia = async (act, obj) => { if (!D.esDocente()) throw new Error('Sin permiso'); await B.guardar('labs_guias', idGuia(act), { email: D._u.email, actividad: act, datos: JSON.stringify(obj), actualizado: new Date().toISOString() }); };
D.borrarGuia = async (act) => { if (!D.esDocente()) throw new Error('Sin permiso'); await B.borrar('labs_guias', idGuia(act)); };
D.guiasPropias = async () => { if (!D.esDocente()) return []; return (await B.listar('labs_guias', 'email', D._u.email)).map((g) => g.actividad); };
window.DOCENTES = D;

(async () => { try { if (!B && !configurado()) { D._est = 'sin-configurar'; return avisar(); } if (!B) B = await backendReal(); B.onSesion(sesion); } catch (e) { console.error('Docentes:', e); D._est = 'error'; D._err = (e && (e.code || e.message)) || 'error'; avisar(); } })();
