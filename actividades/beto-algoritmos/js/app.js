/* Beto y los Algoritmos · interfaz. Sin dependencias: HTML + CSS 3D + JavaScript. */
(function () {
  'use strict';
  const C = window.AlgoCore;
  const $app = document.getElementById('app');
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const AVATARES = ['🦊', '🐼', '🐯', '🦄', '🐸', '🐙', '🦁', '🐰', '🐵', '🐧', '🐶', '🐱'];
  
  /* ================= Almacenamiento (a prueba de fallos) ================= */
  const LS = {
    get(k, def) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  };
  const K_PERFILES = 'beto_perfiles_v1', K_ACTUAL = 'beto_actual_v1', K_CFG = 'beto_cfg_v1';
  let perfiles = LS.get(K_PERFILES, {});
  let cfg = Object.assign({ silencio: false, vozURI: '', ritmo: 0.92 }, LS.get(K_CFG, {}));
  let actual = null; // clave del perfil activo

  const clave = (n) => n.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ');
  const guardar = () => LS.set(K_PERFILES, perfiles);
  const perfil = () => perfiles[actual];
  const totalEstrellas = (p) => Object.values(p.done).reduce((a, b) => a + b, 0);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ================= Idiomas (es / en) ================= */
  const UI = {
    es: {
      titulo: 'Beto y los Algoritmos', descripcion: 'Aprende qué es un algoritmo jugando con Beto el robot. Para primer grado.',
      aMapa: 'Ir al mapa', aEstrellas: 'Estrellas ganadas', aVoz: 'Voz y sonido', aAjustes: 'Ajustes para la profe', aIdioma: 'Idioma / Language',
      bienvenidaTit: 'Beto y los<br>Algoritmos', bienvenidaSub: '¡Aprende a dar instrucciones como un programador!', comoTeLlamas: '¿Cómo te llamas?',
      escribeNombre: 'Escribe tu nombre', tipNombre: 'Tip: nombre + inicial del apellido (ej. “Ana R”) para no confundirnos.', eligeAmigo: 'Elige tu amigo', amigo: 'Amigo {a}',
      empezar: '¡Empezar! 🚀', ninosAqui: 'Niños que ya jugaron aquí', yaJugaste: '¿Ya jugaste? ¡Toca tu nombre!', paraProfe: '⚙️ Para la profe',
      jugarOtra: '¡Jugar de nuevo!', continuar: 'Continuar ▶', mundo: 'Mundo {n}: {t}', bloqueado: ', bloqueado',
      nivelCompletado: 'Nivel completado', estrellasN: '{n} estrellas', siguiente: 'Siguiente ▶', otraVez: 'Otra vez 🔁', mapa: 'Mapa 🗺️',
      ordenaste: 'Ordenaste todos los pasos. ¡Eso es un algoritmo!', pocos: '¡Usaste muy pocos bloques!', menosBloques: 'Puedes intentarlo con menos bloques para ganar más estrellas.',
      escucharOtra: 'Escuchar otra vez', Avanzar: 'Avanzar', Izquierda: 'Izquierda', Derecha: 'Derecha',
      avanzar: 'avanzar', girarIz: 'girar a la izquierda', girarDer: 'girar a la derecha', escuchar: '🔊 Escuchar', paso: 'Paso {n}',
      pista: '💡 Pista', tocaBotones: 'Toca los botones para dar instrucciones a Beto.', programaBeto: 'Programa de Beto', ir: '▶ ¡Ir!', quitar: '↩ Quitar', borrarTodo: '🗑 Borrar todo',
      repetirLbl: '🔁 Repetir:', repetirN: 'Repetir {n} veces', repetirQue: 'Repetir {n} veces… ¿qué quieres repetir?', aqui: '👆 Aquí aparecen los pasos de Beto',
      veces: ' {n} veces', tocaQuitar: '. Toca para quitar', llega: '🚩 Llega a la bandera', primeroInstr: '¡Primero dale instrucciones a Beto!', enMarcha: '¡Beto está en marcha! 🤖', llegaste: '¡Llegaste! 🎉',
      soloAdultos: '🔒 Solo para adultos', cuantoEs: '¿Cuánto es {a} + {b}?', entrar: 'Entrar', cerrar: 'Cerrar', denuevo: 'Inténtalo de nuevo. ',
      ajustesH: '⚙️ Ajustes', revisando: 'Revisando audios de Beto…', vozRespaldo: 'Voz de respaldo del navegador (solo suena en las frases que no tienen audio pregrabado)',
      sinVoces: 'No hay voces en español en este equipo', velocidad: 'Velocidad al hablar', silenciar: 'Silenciar voz y sonidos', escucharBeto: '▶ Escuchar a Beto', probarResp: '▶ Probar voz de respaldo',
      ninosEquipo: 'Niños en este equipo', copia: 'Copia de seguridad', descargar: '⬇ Descargar copia', cargar: '⬆ Cargar copia', avanceNota: 'El avance se guarda en este navegador y equipo. Para usar otro equipo, descarga la copia y cárgala allá.',
      nadie: 'Aún no hay niños registrados.', nivelesN: '{a}/{b} niveles', bloquear: 'Bloquear niveles', abrirTodos: 'Abrir todos', reiniciar: 'Reiniciar', borrar: 'Borrar',
      audiosTodos: '✅ Beto habla con audios pregrabados{v}: {ok} de {t} frases.', audiosAlgunos: '⚠️ Hay {ok} de {t} audios pregrabados. Las demás frases usan la voz de respaldo.',
      audiosNinguno: '⚠️ No hay audios pregrabados: Beto usa la voz del navegador (la de abajo).',
      confReiniciar: '¿Reiniciar el avance de {n}?', confBorrar: '¿Borrar a {n}?', noLeer: 'No se pudo leer el archivo.',
      pruebaResp: '¡Hola! Soy Beto, el robot. ¿Listo para aprender algoritmos?'
    },
    en: {
      titulo: 'Beto and the Algorithms', descripcion: 'Learn what an algorithm is by playing with Beto the robot. For first grade.',
      aMapa: 'Go to the map', aEstrellas: 'Stars earned', aVoz: 'Voice and sound', aAjustes: 'Settings for the teacher', aIdioma: 'Idioma / Language',
      bienvenidaTit: 'Beto and the<br>Algorithms', bienvenidaSub: 'Learn to give instructions like a programmer!', comoTeLlamas: 'What is your name?',
      escribeNombre: 'Type your name', tipNombre: 'Tip: first name + last initial (e.g. “Ana R”) so we do not mix you up.', eligeAmigo: 'Choose your friend', amigo: 'Friend {a}',
      empezar: 'Start! 🚀', ninosAqui: 'Kids who already played here', yaJugaste: 'Already played? Tap your name!', paraProfe: '⚙️ For the teacher',
      jugarOtra: 'Play again!', continuar: 'Continue ▶', mundo: 'World {n}: {t}', bloqueado: ', locked',
      nivelCompletado: 'Level complete', estrellasN: '{n} stars', siguiente: 'Next ▶', otraVez: 'Again 🔁', mapa: 'Map 🗺️',
      ordenaste: 'You put all the steps in order. That is an algorithm!', pocos: 'You used very few blocks!', menosBloques: 'You can try with fewer blocks to earn more stars.',
      escucharOtra: 'Listen again', Avanzar: 'Forward', Izquierda: 'Left', Derecha: 'Right',
      avanzar: 'move forward', girarIz: 'turn left', girarDer: 'turn right', escuchar: '🔊 Listen', paso: 'Step {n}',
      pista: '💡 Hint', tocaBotones: 'Tap the buttons to give instructions to Beto.', programaBeto: "Beto's program", ir: '▶ Go!', quitar: '↩ Undo', borrarTodo: '🗑 Clear all',
      repetirLbl: '🔁 Repeat:', repetirN: 'Repeat {n} times', repetirQue: 'Repeat {n} times… what do you want to repeat?', aqui: "👆 Beto's steps appear here",
      veces: ' {n} times', tocaQuitar: '. Tap to remove', llega: '🚩 Reach the flag', primeroInstr: 'First give Beto some instructions!', enMarcha: 'Beto is on his way! 🤖', llegaste: 'You made it! 🎉',
      soloAdultos: '🔒 Adults only', cuantoEs: 'What is {a} + {b}?', entrar: 'Enter', cerrar: 'Close', denuevo: 'Try again. ',
      ajustesH: '⚙️ Settings', revisando: "Checking Beto's audio files…", vozRespaldo: 'Browser backup voice (it only speaks the phrases that have no pre-recorded audio)',
      sinVoces: 'There are no English voices on this device', velocidad: 'Speaking speed', silenciar: 'Mute voice and sounds', escucharBeto: '▶ Listen to Beto', probarResp: '▶ Test backup voice',
      ninosEquipo: 'Kids on this device', copia: 'Backup', descargar: '⬇ Download backup', cargar: '⬆ Load backup', avanceNota: 'Progress is saved in this browser and device. To use another device, download the backup and load it there.',
      nadie: 'No kids registered yet.', nivelesN: '{a}/{b} levels', bloquear: 'Lock levels', abrirTodos: 'Unlock all', reiniciar: 'Reset', borrar: 'Delete',
      audiosTodos: '✅ Beto speaks with pre-recorded audio{v}: {ok} of {t} phrases.', audiosAlgunos: '⚠️ There are {ok} of {t} pre-recorded audio files. The other phrases use the backup voice.',
      audiosNinguno: '⚠️ There are no pre-recorded audio files: Beto uses the browser voice (the one below).',
      confReiniciar: "Reset {n}'s progress?", confBorrar: 'Delete {n}?', noLeer: 'The file could not be read.',
      pruebaResp: "Hello! I'm Beto, the robot. Ready to learn algorithms?"
    }
  };
  let idioma = 'es';
  (function () { let g = null; try { g = localStorage.getItem('labs-lang'); } catch (e) { /* sin almacenamiento */ } idioma = g === 'es' || g === 'en' ? g : ((navigator.language || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es'); })();
  C.setIdioma(idioma);
  const tx = (k, v) => { let x = UI[idioma][k]; if (x === undefined) x = UI.es[k] !== undefined ? UI.es[k] : k; if (v) for (const q in v) x = x.split('{' + q + '}').join(v[q]); return x; };

  /* ================= Voz (menos robótica) ================= */
  const Voz = {
    voces: [],
    cargar() { try { this.voces = (speechSynthesis.getVoices() || []).filter((v) => new RegExp('^' + idioma, 'i').test(v.lang)); } catch (e) { this.voces = []; } },
    puntaje(v) {
      const n = v.name.toLowerCase(); let s = 0;
      if (/natural|neural|online/.test(n)) s += 6;
      if (/premium|enhanced|mejorada|siri/.test(n)) s += 5;
      if (/google/.test(n)) s += 3;
      if (/paulina|m[oó]nica|sabina|helena|laura|luc[ií]a|marisol|dalia|elvira|paloma|catalina|camila|salome|valentina|samantha|ava|allison|susan|zira|aria|jenny|karen|female|mujer/.test(n)) s += 3;
      if (idioma === 'en') { if (/en[-_]us/i.test(v.lang)) s += 3; else if (/en[-_](gb|au|ca)/i.test(v.lang)) s += 2; }
      else if (/es[-_]mx/i.test(v.lang)) s += 3; else if (/es[-_](us|419|co|ar)/i.test(v.lang)) s += 2; else if (/es[-_]es/i.test(v.lang)) s += 1;
      if (!v.localService) s += 1;
      if (/jorge|diego|pablo|enrique|raul|carlos|male/.test(n)) s -= 4;
      return s;
    },
    mejor() {
      if (cfg.vozURI) { const v = this.voces.find((x) => x.voiceURI === cfg.vozURI); if (v) return v; }
      return [...this.voces].sort((a, b) => this.puntaje(b) - this.puntaje(a))[0] || null;
    },
    token: 0, audio: null, archivos: new Map(),
    parar() { this.token++; this.paraAudio(); try { speechSynthesis.cancel(); } catch (e) { /* sin voz */ } },
    paraAudio() { if (this.audio) { try { this.audio.pause(); } catch (e) { /* nada */ } this.audio = null; } },
    /* Busca audio/<id>.mp3 (voz neuronal pregrabada). Devuelve la URL o null si no existe. */
    async buscar(id) {
      if (!id) return null;
      const ruta = (idioma === 'en' ? 'audio/en/' : 'audio/') + id + '.mp3';
      if (this.archivos.has(ruta)) return this.archivos.get(ruta);
      let url = null;
      try { const r = await fetch(ruta, { method: 'HEAD' }); if (r.ok) url = ruta; } catch (e) { /* sin archivo */ }
      this.archivos.set(ruta, url); return url;
    },
    tocar(url, tk) {
      return new Promise((resolve) => {
        const a = new Audio(url); this.audio = a; let fin = false;
        const f = (ok) => { if (!fin) { fin = true; clearInterval(vigila); resolve(ok); } };
        a.onended = () => f(true); a.onerror = () => f(false);
        a.play().catch(() => f(false));
        const vigila = setInterval(() => { if (tk !== this.token) { try { a.pause(); } catch (e) { /* nada */ } f(true); } }, 150);
      });
    },
    limpiar(t) { return String(t).replace(/\p{Extended_Pictographic}|️/gu, '').replace(/\s+/g, ' ').trim(); },
    /* Devuelve una promesa que se cumple cuando termina de hablar (o tras un tiempo prudente). */
    async decir(texto, id) {
      const tk = ++this.token; this.paraAudio();
      const limpio = this.limpiar(texto);
      const espera = Math.max(900, limpio.length * 75);
      if (cfg.silencio || !limpio) return sleep(Math.min(espera, 1800));
      const url = await this.buscar(id);
      if (tk !== this.token) return;
      if (url && await this.tocar(url, tk)) return;
      if (tk !== this.token) return;
      return this.hablar(limpio, tk, espera);
    },
    hablar(limpio, tk, espera) {
      if (!('speechSynthesis' in window)) return sleep(Math.min(espera, 1800));
      return new Promise((resolve) => {
        let fin = false;
        const listo = () => { if (!fin) { fin = true; resolve(); } };
        try {
          speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(limpio);
          const v = this.mejor();
          u.lang = v ? v.lang : (idioma === 'en' ? 'en-US' : 'es-MX'); if (v) u.voice = v;
          u.rate = cfg.ritmo; u.pitch = 1.12; u.volume = 1;
          u.onend = listo; u.onerror = listo;
          setTimeout(() => speechSynthesis.speak(u), 40);
          setTimeout(listo, espera + 4000);
        } catch (e) { setTimeout(listo, espera); }
        const vigila = setInterval(() => { if (fin || tk !== this.token) { clearInterval(vigila); listo(); } }, 200);
      });
    }
  };
  try { Voz.cargar(); if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = () => Voz.cargar(); } catch (e) { /* sin voz */ }
  // t puede llevar {n} (nombre). Con audio pregrabado se usa la frase sin nombre; con la voz del navegador, con nombre.
  const nom = (t) => t.replace(/\{n\}/g, perfil() ? perfil().name : '');
  const decir = (t) => Voz.decir(nom(t), C.idFrase(C.generica(t)));

  /* ================= Sonidos (WebAudio) ================= */
  let audio;
  function tono(f, dur, tipo, vol, retraso) {
    if (cfg.silencio) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const t0 = audio.currentTime + (retraso || 0), o = audio.createOscillator(), g = audio.createGain();
      o.type = tipo || 'sine'; o.frequency.setValueAtTime(f, t0);
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol || 0.15, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(audio.destination); o.start(t0); o.stop(t0 + dur + 0.05);
    } catch (e) { /* sin audio */ }
  }
  const Sfx = {
    clic() { tono(620, 0.08, 'triangle'); },
    paso() { tono(300, 0.07, 'square', 0.06); },
    giro() { tono(480, 0.1, 'triangle'); tono(620, 0.1, 'triangle', 0.12, 0.08); },
    estrella() { tono(880, 0.12, 'sine'); tono(1320, 0.25, 'sine', 0.15, 0.1); },
    mal() { tono(220, 0.2, 'sawtooth', 0.08); tono(150, 0.3, 'sawtooth', 0.08, 0.15); },
    bien() { tono(660, 0.12, 'triangle'); tono(880, 0.2, 'triangle', 0.15, 0.1); },
    gana() { [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tono(f, 0.22, 'triangle', 0.16, i * 0.12)); }
  };

  /* ================= Confeti ================= */
  const lienzo = document.getElementById('confeti'); const ctx = lienzo.getContext('2d'); let parts = [], anim = 0;
  function confeti() {
    lienzo.width = innerWidth; lienzo.height = innerHeight;
    const cols = ['#ff5d8f', '#ffd23f', '#2ecc71', '#4cc9f0', '#5b3df5', '#ff9f1c'];
    parts = Array.from({ length: 150 }, () => ({ x: innerWidth / 2 + (Math.random() - .5) * 200, y: innerHeight * 0.45, vx: (Math.random() - .5) * 18, vy: -Math.random() * 18 - 5, w: 8 + Math.random() * 10, h: 5 + Math.random() * 8, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: cols[(Math.random() * cols.length) | 0] }));
    cancelAnimationFrame(anim);
    let n = 0;
    (function paso() {
      ctx.clearRect(0, 0, lienzo.width, lienzo.height);
      parts.forEach((p) => { p.vy += .45; p.x += p.vx; p.y += p.vy; p.r += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.scale(1, Math.cos(p.r * 2)); ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore(); });
      if (++n < 200) anim = requestAnimationFrame(paso); else ctx.clearRect(0, 0, lienzo.width, lienzo.height);
    })();
  }

  /* ================= Cubos 3D con CSS ================= */
  const BRILLO = { top: 1, fr: .88, bk: .8, dr: .78, iz: .62 };
  function cubo(w, d, h, o) {
    o = o || {};
    const e = document.createElement('div'); e.className = 'cubo ' + (o.cls || '');
    e.style.cssText = `width:${w}px;height:${d}px;left:${o.x || 0}px;top:${o.y || 0}px;transform:translateZ(${o.z || 0}px)`;
    const geo = {
      top: `width:${w}px;height:${d}px;transform:translateZ(${h}px)`,
      fr: `width:${w}px;height:${h}px;top:${d}px`, bk: `width:${w}px;height:${h}px;top:0`,
      dr: `width:${h}px;height:${d}px;left:${w}px`, iz: `width:${h}px;height:${d}px;left:0`
    };
    Object.keys(geo).forEach((k) => {
      const f = document.createElement('div'); f.className = 'f ' + k;
      f.style.cssText = geo[k] + `;background:${(o.caras && o.caras[k]) || o.color || '#ccc'};filter:brightness(${BRILLO[k]})`;
      if (o.html && o.html[k]) f.innerHTML = o.html[k];
      e.appendChild(f);
    });
    return e;
  }

  /* Beto: robot hecho con cubos. T = tamaño de una baldosa. Devuelve el grupo (origen en el centro). */
  function robot(T) {
    const g = document.createElement('div'); g.className = 'gira';
    const s = (v) => v * T;
    const ojos = `<i class="ojo" style="position:absolute;left:52%;top:14%;width:${s(.13)}px;height:${s(.13)}px"></i><i class="ojo" style="position:absolute;left:52%;top:60%;width:${s(.13)}px;height:${s(.13)}px"></i>`;
    const panel = `<i style="width:55%;height:55%;border-radius:20%;background:#ff5d8f;box-shadow:inset 0 0 0 3px #fff"></i>`;
    g.append(
      cubo(s(.34), s(.40), s(.07), { x: s(-.17), y: s(-.20), z: 0, color: '#3d3d5c' }),
      cubo(s(.34), s(.40), s(.30), { x: s(-.17), y: s(-.20), z: s(.07), color: '#4cc9f0', html: { dr: panel } }),
      cubo(s(.09), s(.10), s(.22), { x: s(-.045), y: s(-.31), z: s(.12), color: '#3a86ff' }),
      cubo(s(.09), s(.10), s(.22), { x: s(-.045), y: s(.21), z: s(.12), color: '#3a86ff' }),
      cubo(s(.36), s(.40), s(.26), { x: s(-.18), y: s(-.20), z: s(.37), color: '#f8f9ff', html: { dr: ojos } }),
      cubo(s(.04), s(.04), s(.14), { x: s(-.02), y: s(-.02), z: s(.63), color: '#555' }),
      cubo(s(.10), s(.10), s(.10), { x: s(-.05), y: s(-.05), z: s(.77), color: '#ff5d8f' })
    );
    return g;
  }

  function betoPose(T) {
    const caja = document.createElement('div'); caja.className = 'escena3d';
    caja.style.cssText = `width:${T * 1.7}px;height:${T * 1.9}px;position:relative`;
    const rot = document.createElement('div');
    rot.style.cssText = 'position:absolute;left:50%;top:62%;width:0;height:0;transform-style:preserve-3d;animation:pose 6s ease-in-out infinite';
    rot.appendChild(robot(T)); caja.appendChild(rot);
    return caja;
  }
  const estiloPose = document.createElement('style');
  estiloPose.textContent = '@keyframes pose{0%,100%{transform:rotateX(68deg) rotateZ(62deg)}50%{transform:rotateX(68deg) rotateZ(118deg)}}';
  document.head.appendChild(estiloPose);

  /* ================= Fondo con formas 3D flotantes ================= */
  (function fondo() {
    const cont = document.getElementById('flotantes'); const cols = ['#ff5d8f', '#ffd23f', '#9b5de5', '#2ecc71', '#4cc9f0', '#ff9f1c'];
    for (let i = 0; i < 9; i++) {
      const tam = 26 + Math.random() * 40, w = document.createElement('div');
      w.className = 'flota';
      w.style.cssText = `left:${Math.random() * 96}%;top:${8 + Math.random() * 60}%;width:0;height:0;animation-duration:${14 + Math.random() * 16}s;animation-delay:${-Math.random() * 20}s`;
      w.appendChild(cubo(tam, tam, tam, { x: -tam / 2, y: -tam / 2, z: -tam / 2, color: cols[i % cols.length] }));
      cont.appendChild(w);
    }
  })();

  /* ================= Utilidades de UI ================= */
  function h(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  function mostrar(el) { Voz.parar(); sesion++; $app.replaceChildren(el); el.classList.add('pantalla'); window.scrollTo({ top: 0 }); }
  let sesion = 0; // se incrementa al cambiar de pantalla para cancelar animaciones pendientes
  const ICON = {
    F: '<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true"><path d="M12 2l9 10h-6v10H9V12H3z" fill="currentColor"/></svg>',
    R: '<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true"><path d="M4 21v-7a6 6 0 0 1 6-6h6V3l6 6-6 6v-4h-6a2 2 0 0 0-2 2v8z" fill="currentColor" transform="translate(-2 0)"/></svg>',
    L: '<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" style="transform:scaleX(-1)"><path d="M4 21v-7a6 6 0 0 1 6-6h6V3l6 6-6 6v-4h-6a2 2 0 0 0-2 2v8z" fill="currentColor" transform="translate(-2 0)"/></svg>'
  };
  const NOMBRE_C = { get F() { return tx('Avanzar'); }, get L() { return tx('Izquierda'); }, get R() { return tx('Derecha'); } };
  const CAMINA = { get F() { return tx('avanzar'); }, get L() { return tx('girarIz'); }, get R() { return tx('girarDer'); } };

  /* ================= Bienvenida ================= */
  let ultima = null; // función que vuelve a pintar la pantalla actual (al cambiar de idioma)
  function pantallaBienvenida() {
    ultima = () => pantallaBienvenida();
    let avatar = AVATARES[(Math.random() * AVATARES.length) | 0];
    const el = h(`<section class="bienvenida">
      <h1 class="titulo">${tx('bienvenidaTit')}</h1>
      <p class="sub">${tx('bienvenidaSub')}</p>
      <div id="pose"></div>
      <form class="formulario" id="frm" autocomplete="off">
        <label for="nombre" class="sub">${tx('comoTeLlamas')}</label>
        <input id="nombre" class="campo" maxlength="24" placeholder="${tx('escribeNombre')}" autocapitalize="words" spellcheck="false" required>
        <p class="aviso">${tx('tipNombre')}</p>
        <div class="avatares" role="group" aria-label="${tx('eligeAmigo')}"></div>
        <button class="btn verde pulsa" type="submit">${tx('empezar')}</button>
      </form>
      <div id="recientes" class="recientes" aria-label="${tx('ninosAqui')}"></div>
      <button class="chip" id="profe" type="button">${tx('paraProfe')}</button>
    </section>`);
    el.insertBefore(selectorIdioma(), el.firstChild);
    el.querySelector('#profe').onclick = () => { Sfx.clic(); ajustes(); };
    el.querySelector('#pose').appendChild(betoPose(110));
    const av = el.querySelector('.avatares');
    function pintaAvatares() {
      av.replaceChildren(...AVATARES.map((a) => { const b = h(`<button type="button" class="avatar" aria-label="${tx('amigo', { a })}" aria-pressed="${a === avatar}">${a}</button>`); b.onclick = () => { avatar = a; Sfx.clic(); pintaAvatares(); }; return b; }));
    }
    pintaAvatares();
    const lista = Object.entries(perfiles).sort((a, b) => b[1].last - a[1].last).slice(0, 24);
    const rec = el.querySelector('#recientes');
    if (lista.length) {
      rec.appendChild(h(`<p class="sub" style="width:100%">${tx('yaJugaste')}</p>`));
      lista.forEach(([k, p]) => { const b = h(`<button class="chip" type="button">${esc(p.avatar)} ${esc(p.name)} · ⭐${totalEstrellas(p)}</button>`); b.onclick = () => entrar(p.name, p.avatar); rec.appendChild(b); });
    }
    el.querySelector('#frm').onsubmit = (e) => { e.preventDefault(); const n = el.querySelector('#nombre').value.trim(); if (n) entrar(n, avatar); };
    mostrar(el);
    document.getElementById('barra').hidden = true;
  }

  function entrar(nombre, avatar) {
    const k = clave(nombre); Sfx.clic();
    const existia = !!perfiles[k];
    if (!existia) perfiles[k] = { name: nombre.replace(/\s+/g, ' ').trim(), avatar, done: {}, created: Date.now(), last: Date.now(), libre: false };
    else if (avatar) perfiles[k].avatar = perfiles[k].avatar || avatar;
    perfiles[k].last = Date.now(); actual = k; guardar(); LS.set(K_ACTUAL, k);
    document.getElementById('barra').hidden = false;
    pintaBarra();
    pantallaMapa(existia ? 'vuelta' : 'nuevo');
  }

  function pintaBarra() {
    const p = perfil(); if (!p) return;
    document.getElementById('jugador').innerHTML = `<span class="av">${esc(p.avatar)}</span><span>${esc(p.name)}</span>`;
    document.getElementById('totalEstrellas').textContent = '⭐ ' + totalEstrellas(p);
    document.getElementById('btnSonido').textContent = cfg.silencio ? '🔇' : '🔊';
  }

  /* ================= Mapa ================= */
  const desbloqueado = (i) => i === 0 || perfil().libre || C.NIVELES[i - 1].id in perfil().done;
  const siguienteIdx = () => { const i = C.NIVELES.findIndex((n) => !(n.id in perfil().done)); return i < 0 ? 0 : i; };
  const iconoNivel = (n) => n.tipo === 'leccion' ? '📖' : n.tipo === 'orden' ? n.pasos[0][0] : n.id === 't12' ? '🏆' : n.id === 't3' || n.id === 't6' || n.id === 't10' || n.id === 't11' ? '⭐' : '🤖';

  function pantallaMapa(modo) {
    ultima = () => pantallaMapa();
    const p = perfil(); const sig = siguienteIdx();
    const terminado = C.NIVELES.every((n) => n.id in p.done);
    const plantilla = modo === 'nuevo' ? C.MSG.mapaNuevo : modo === 'vuelta' ? C.MSG.mapaVuelta : terminado ? C.MSG.mapaFin : C.MSG.mapaElige;
    const frase = nom(plantilla);
    const el = h(`<section>
      <div class="mapa-cab"><div id="poseMapa"></div><div class="burbuja">${esc(frase)}</div>
        <button class="btn verde pulsa" id="seguir">${terminado ? tx('jugarOtra') : tx('continuar')}</button></div>
      <div id="mundos"></div></section>`);
    el.querySelector('#poseMapa').appendChild(betoPose(70));
    const cont = el.querySelector('#mundos');
    C.MUNDOS.forEach((m) => {
      const w = h(`<div class="mundo"><h2 style="background:${m.color}">${m.emoji} ${esc(tx('mundo', { n: m.n, t: m.nombre }))}</h2><div class="camino"></div></div>`);
      C.NIVELES.forEach((n, i) => {
        if (n.mundo !== m.n) return;
        const ok = desbloqueado(i), es = p.done[n.id] || 0;
        const b = h(`<button class="nodo ${n.id in p.done ? 'hecho' : ''} ${i === sig && !terminado ? 'actual' : ''}" ${ok ? '' : 'disabled'} aria-label="${esc(n.titulo)}${ok ? '' : tx('bloqueado')}">
          ${ok ? '' : '<span class="candado">🔒</span>'}<span class="ic">${iconoNivel(n)}</span><span>${esc(n.titulo)}</span>
          <span class="es">${'⭐'.repeat(es)}${'☆'.repeat(n.tipo === 'leccion' ? 0 : 3 - es)}</span></button>`);
        b.onclick = () => abrirNivel(i);
        w.querySelector('.camino').appendChild(b);
      });
      cont.appendChild(w);
    });
    el.querySelector('#seguir').onclick = () => abrirNivel(terminado ? 0 : sig);
    mostrar(el); pintaBarra();
    decir(plantilla);
  }

  function abrirNivel(i) {
    Sfx.clic(); const n = C.NIVELES[i];
    if (n.tipo === 'leccion') pantallaLeccion(i);
    else if (n.tipo === 'orden') pantallaOrden(i);
    else pantallaTablero(i);
  }

  /* ================= Premio ================= */
  function guardarResultado(nivel, est) {
    const p = perfil(); p.done[nivel.id] = Math.max(p.done[nivel.id] || 0, est); p.last = Date.now(); guardar(); pintaBarra();
  }
  function premio(i, est, extra) {
    const nivel = C.NIVELES[i]; const hay = i + 1 < C.NIVELES.length; const alabanza = C.MSG.alabanzas[(Math.random() * C.MSG.alabanzas.length) | 0]; const ses = sesion;
    const caja = h(`<div class="premio-fondo"><div class="premio" role="dialog" aria-label="${tx('nivelCompletado')}">
      <h2>${esc(nom(alabanza))}</h2>
      <div class="estrellas-gr" aria-label="${tx('estrellasN', { n: est })}"><span>⭐</span><span>⭐</span><span>⭐</span></div>
      <p style="margin:0;font-weight:600">${esc(extra || '')}</p>
      <div class="acciones">${hay ? `<button class="btn verde pulsa" data-a="sig">${tx('siguiente')}</button>` : ''}
      <button class="btn amarillo" data-a="rep">${tx('otraVez')}</button><button class="btn" data-a="mapa">${tx('mapa')}</button></div></div></div>`);
    document.body.appendChild(caja); confeti(); Sfx.gana();
    caja.querySelectorAll('.estrellas-gr span').forEach((s, k) => { if (k < est) setTimeout(() => { s.classList.add('on'); Sfx.estrella(); }, 400 + k * 450); });
    decir(alabanza).then(() => { if (est === 3 && ses === sesion) decir(C.MSG.tres); });
    caja.onclick = (e) => {
      const a = e.target.closest('[data-a]'); if (!a) return;
      caja.remove(); Sfx.clic();
      if (a.dataset.a === 'sig') abrirNivel(i + 1); else if (a.dataset.a === 'rep') abrirNivel(i); else pantallaMapa();
    };
  }

  /* ================= Lección: ¿Qué es un algoritmo? ================= */
  const DIAPOS = C.DIAPOS;

  function pantallaLeccion(idx) {
    ultima = () => pantallaLeccion(idx);
    let k = 0;
    const el = h(`<section class="leccion tarjeta">
      <div class="beto-lado" id="lado"></div>
      <div><div class="diapo" id="diapo"></div>
      <div class="nav"><button class="btn" id="ant">◀</button><div class="puntos" id="puntos"></div>
      <button class="btn amarillo" id="oir" aria-label="${tx('escucharOtra')}">🔊</button><button class="btn verde pulsa" id="sig">▶</button></div></div></section>`);
    el.querySelector('#lado').appendChild(betoPose(140));
    const diapo = el.querySelector('#diapo');
    async function pinta() {
      const ses = sesion; const d = DIAPOS[k]; const yo = ++pinta.n;
      el.querySelector('#puntos').innerHTML = DIAPOS.map((_, j) => `<i class="${j === k ? 'on' : ''}"></i>`).join('');
      el.querySelector('#ant').style.visibility = k ? 'visible' : 'hidden';
      const nombre = perfil().name;
      let esc3d = '';
      if (d.grande) esc3d = `<div class="escenario" style="font-size:6rem">${d.grande}</div>`;
      else if (d.iconos) esc3d = `<div class="escenario">${d.iconos.map((c) => `<div class="paso"><span class="em" style="color:${c === 'F' ? '#2ecc71' : c === 'R' ? '#4cc9f0' : '#ff9f1c'}">${ICON[c]}</span><span>${NOMBRE_C[c]}</span></div>`).join('')}</div>`;
      else {
        const todos = d.pasos.concat(d.extra || []);
        esc3d = `<div class="escenario">${todos.map((s, j) => `<div class="paso ${d.loco && j < 2 ? 'loco' : ''}">${d.loco ? '' : `<span class="num">${j + 1}</span>`}<span class="em">${s[0]}</span><span>${s[1]}</span></div>`).join('')}</div>`;
      }
      diapo.innerHTML = `<h2>${esc(d.titulo.replace('{n}', nombre))}</h2>${esc3d}<p></p>`;
      const pasos = diapo.querySelectorAll('.paso');
      for (const parte of d.partes) {
        if (yo !== pinta.n || ses !== sesion) return;
        diapo.querySelector('p').textContent = parte.t.replace('{n}', nombre);
        [].concat(parte.ver === undefined ? [] : parte.ver).forEach((j) => pasos[j] && pasos[j].classList.add('ver'));
        if (parte.ver !== undefined) Sfx.bien();
        await decir(parte.t);
        await sleep(250);
      }
      if (!d.pasos && !d.iconos) return;
      pasos.forEach((p) => p.classList.add('ver'));
    }
    pinta.n = 0;
    // Mostrar pasos de golpe en las diapositivas sin narración paso a paso se hace dentro de pinta().
    el.querySelector('#sig').onclick = () => {
      Sfx.clic();
      if (k < DIAPOS.length - 1) { k++; pinta(); } else { guardarResultado(C.NIVELES[idx], 3); pantallaMapa(); }
    };
    el.querySelector('#ant').onclick = () => { Sfx.clic(); if (k) { k--; pinta(); } };
    el.querySelector('#oir').onclick = () => { Sfx.clic(); pinta(); };
    mostrar(el); pinta();
  }

  /* ================= Ordenar los pasos ================= */
  function pantallaOrden(idx) {
    ultima = () => pantallaOrden(idx);
    const nivel = C.NIVELES[idx]; const pasos = nivel.pasos.map((p, j) => ({ e: p[0], t: p[1], j }));
    let mezcla; do { mezcla = pasos.slice().sort(() => Math.random() - .5); } while (mezcla.every((p, j) => p.j === j));
    let sig = 0, fallos = 0, listo = false;
    const el = h(`<section class="orden tarjeta"><h2>${esc(nivel.titulo)}</h2>
      <div class="acciones"><button class="btn amarillo" id="oir">${tx('escuchar')}</button></div>
      <div class="ranuras" id="ranuras"></div><div class="banco" id="banco"></div></section>`);
    const rs = el.querySelector('#ranuras'), bn = el.querySelector('#banco');
    pasos.forEach((_, j) => rs.appendChild(h(`<div class="ranura" aria-label="${tx('paso', { n: j + 1 })}">${j + 1}</div>`)));
    mezcla.forEach((p) => {
      const f = h(`<button class="ficha" style="--r:${(Math.random() * 8 - 4).toFixed(1)}deg"><span class="em">${p.e}</span><span>${esc(p.t)}</span></button>`);
      f.onclick = async () => {
        if (listo) return;
        if (p.j === sig) {
          Sfx.bien(); f.classList.add('usada');
          rs.children[sig].replaceChildren(h(`<div class="paso"><span class="num">${sig + 1}</span><span class="em">${p.e}</span><span>${esc(p.t)}</span></div>`));
          sig++;
          if (sig === pasos.length) {
            listo = true; const ses = sesion; const est = fallos === 0 ? 3 : fallos <= 2 ? 2 : 1;
            guardarResultado(nivel, est);
            await decir(nivel.cierre);
            if (ses === sesion) premio(idx, est, tx('ordenaste'));
          } else decir(C.MSG.ordenBien[sig % 3]);
        } else {
          fallos++; Sfx.mal(); f.classList.remove('malo'); void f.offsetWidth; f.classList.add('malo');
          decir(sig === 0 ? C.MSG.ordenMal1 : C.MSG.ordenMal2);
        }
      };
      bn.appendChild(f);
    });
    el.querySelector('#oir').onclick = () => { Sfx.clic(); decir(nivel.voz); };
    mostrar(el); decir(nivel.voz);
  }

  /* ================= Tablero de Beto (3D) ================= */
  function pantallaTablero(idx) {
    ultima = () => pantallaTablero(idx);
    const nivel = C.NIVELES[idx];
    let programa = [], pendienteRep = 0, corriendo = false;
    const el = h(`<section class="juego">
      <div class="juego-cab"><h2>${esc(nivel.titulo)}</h2><button class="btn amarillo" id="oir">🔊</button><button class="btn rosa" id="pista">${tx('pista')}</button><span class="total-estrellas" id="cuenta"></span></div>
      <div class="vista" id="vista"></div>
      <div class="mensaje" id="msg">${tx('tocaBotones')}</div>
      <div class="programa" id="prog" aria-label="${tx('programaBeto')}"></div>
      <div class="paleta" id="pal"></div>
      <div class="acciones"><button class="btn verde pulsa" id="correr">${tx('ir')}</button><button class="btn amarillo" id="atras">${tx('quitar')}</button><button class="btn rosa" id="borrar">${tx('borrarTodo')}</button></div>
    </section>`);
    const msg = el.querySelector('#msg'), prog = el.querySelector('#prog'), vista = el.querySelector('#vista');
    mostrar(el);

    /* --- escena --- */
    const w = vista.clientWidth || 600, hh = vista.clientHeight || 300;
    const T = Math.max(34, Math.min(92, (w / (nivel.w * .79 + nivel.h * .62)) * .9, (hh / ((nivel.w * .62 + nivel.h * .79) * .83)) * .92));
    const A = T * .2;
    const mundo = document.createElement('div'); mundo.className = 'mundo3d';
    mundo.style.cssText = `width:${nivel.w * T}px;height:${nivel.h * T}px`;
    mundo.appendChild(cubo(nivel.w * T + 18, nivel.h * T + 18, A * .9, { x: -9, y: -9, z: -A * .9, color: '#5a8f3a' }));
    for (let y = 0; y < nivel.h; y++) for (let x = 0; x < nivel.w; x++) {
      const meta = x === nivel.goal.x && y === nivel.goal.y;
      const c = cubo(T - 3, T - 3, A, { x: x * T + 1.5, y: y * T + 1.5, z: 0, cls: 'baldosa' + (meta ? ' meta-tile' : ''), color: (x + y) % 2 ? '#7fd34d' : '#9be564', caras: { fr: '#a06a37', bk: '#a06a37', dr: '#7a4a22', iz: '#7a4a22' } });
      if (meta) c.querySelector('.f.top').style.background = 'repeating-conic-gradient(#fff 0 25%,#333 0 50%) 0 0/50% 50%';
      mundo.appendChild(c);
    }
    const sprite = (x, y, z) => { const s = document.createElement('div'); s.className = 'sprite'; s.style.cssText = `left:${(x + .5) * T}px;top:${(y + .5) * T}px;width:0;height:0;transform:translateZ(${z}px)`; return s; };
    const vertical = (em, tam, cls) => { const v = document.createElement('div'); v.className = 'vertical'; v.innerHTML = `<span class="em ${cls || ''}" style="font-size:${tam}px">${em}</span>`; return v; };
    const bandera = sprite(nivel.goal.x, nivel.goal.y, A); bandera.appendChild(vertical('🚩', T * .9, 'estrella')); mundo.appendChild(bandera);
    const estrellas = {};
    nivel.stars.forEach((s) => { const sp = sprite(s.x, s.y, A + T * .12); sp.appendChild(vertical('⭐', T * .62, 'estrella')); estrellas[s.x + ',' + s.y] = sp; mundo.appendChild(sp); });
    nivel.walls.forEach((p) => { const r = cubo(T * .7, T * .7, T * .5, { x: (p.x + .15) * T, y: (p.y + .15) * T, z: A, color: '#8d99ae' }); mundo.appendChild(r); const m = sprite(p.x, p.y, A + T * .5); m.appendChild(vertical('🪨', T * .5, 'roca')); mundo.appendChild(m); });

    const beto = sprite(nivel.start.x, nivel.start.y, A); beto.classList.add('beto');
    beto.style.transition = 'left .5s ease-in-out, top .5s ease-in-out';
    const reb = document.createElement('div'); reb.className = 'rebote'; reb.style.setProperty('--sx', T * .3 + 'px');
    const gira = robot(T); let ang = (nivel.start.d - 1) * 90; gira.style.transform = `rotateZ(${ang}deg)`;
    reb.appendChild(gira); beto.appendChild(reb); mundo.appendChild(beto); vista.appendChild(mundo);

    /* --- paleta y programa --- */
    const pal = el.querySelector('#pal');
    nivel.allowed.forEach((c) => {
      const b = h(`<button class="pal-btn ${c}" aria-label="${NOMBRE_C[c]}">${ICON[c]}<span>${NOMBRE_C[c]}</span></button>`);
      b.onclick = () => agrega(c); pal.appendChild(b);
    });
    if (nivel.rep) {
      const grupo = h('<div class="paleta" style="gap:8px;padding:6px 10px;background:rgba(255,255,255,.6);border-radius:20px"><b>' + tx('repetirLbl') + '</b></div>');
      [2, 3, 4, 5, 6].forEach((n) => {
        const b = h(`<button class="pal-btn rep" aria-pressed="false" style="min-width:58px;height:58px;font-size:1.5rem" aria-label="${tx('repetirN', { n })}">${n}</button>`);
        b.onclick = () => { Sfx.clic(); pendienteRep = pendienteRep === n ? 0 : n; grupo.querySelectorAll('.rep').forEach((x) => x.setAttribute('aria-pressed', String(+x.textContent === pendienteRep))); if (pendienteRep) { msg.textContent = tx('repetirQue', { n }); decir(C.MSG.repetir[n]); } };
        grupo.appendChild(b);
      });
      pal.appendChild(grupo);
    }
    function cuenta() { const q = nivel.stars.length; const rec = Object.keys(estrellas).filter((k) => estrellas[k].dataset.tomada).length; el.querySelector('#cuenta').textContent = q ? `⭐ ${rec}/${q}` : tx('llega'); }
    cuenta();
    function pintaPrograma(nuevo) {
      prog.replaceChildren();
      if (!programa.length) prog.appendChild(h('<span class="vacio">' + tx('aqui') + '</span>'));
      programa.forEach((b, i) => {
        const x = h(`<button class="bloque ${b.c} ${nuevo && i === programa.length - 1 ? 'nuevo' : ''}" data-i="${i}" aria-label="${CAMINA[b.c]}${b.n > 1 ? tx('veces', { n: b.n }) : ''}${tx('tocaQuitar')}">${ICON[b.c]}${b.n > 1 ? `<small>×${b.n}</small>` : ''}</button>`);
        x.onclick = () => { if (corriendo) return; programa.splice(i, 1); Sfx.clic(); pintaPrograma(); };
        prog.appendChild(x);
      });
    }
    function agrega(c) {
      if (corriendo) return;
      const tope = nivel.maxBlocks || 16;
      if (programa.length >= tope) { Sfx.mal(); const t = nivel.maxBlocks ? C.MSG.usaRepetir : C.MSG.muchos; msg.textContent = t; decir(t); return; }
      programa.push({ c, n: pendienteRep || 1 }); pendienteRep = 0;
      pal.querySelectorAll('.rep').forEach((x) => x.setAttribute('aria-pressed', 'false'));
      c === 'F' ? Sfx.paso() : Sfx.giro(); pintaPrograma(true);
    }
    pintaPrograma();

    /* --- ejecución animada --- */
    const px = (v) => (v + .5) * T;
    function reinicia() {
      ang = (nivel.start.d - 1) * 90; beto.style.transition = 'none'; beto.style.left = px(nivel.start.x) + 'px'; beto.style.top = px(nivel.start.y) + 'px';
      gira.style.transition = 'none'; gira.style.transform = `rotateZ(${ang}deg)`; void beto.offsetWidth; beto.style.transition = ''; gira.style.transition = '';
      Object.values(estrellas).forEach((s) => { delete s.dataset.tomada; s.querySelector('.em').classList.remove('tomada'); });
      cuenta();
    }
    reinicia();
    async function correr() {
      if (corriendo) return;
      if (!programa.length) { Sfx.mal(); msg.textContent = tx('primeroInstr'); decir(C.MSG.sinPasos); return; }
      const ses = sesion; corriendo = true; reinicia(); Voz.parar();
      el.querySelectorAll('button').forEach((b) => { if (b.id !== 'oir') b.disabled = true; });
      const res = C.simular(nivel, programa); msg.textContent = tx('enMarcha');
      await sleep(400);
      for (const ev of res.eventos) {
        if (ses !== sesion) return;
        prog.querySelectorAll('.bloque').forEach((b) => b.classList.toggle('activo', +b.dataset.i === ev.idx));
        if (ev.t === 'giro') { ang += ev.dir === 'R' ? 90 : -90; gira.style.transform = `rotateZ(${ang}deg)`; Sfx.giro(); await sleep(560); }
        else if (ev.t === 'avanza') {
          reb.classList.remove('salta'); void reb.offsetWidth; reb.classList.add('salta');
          beto.style.left = px(ev.x) + 'px'; beto.style.top = px(ev.y) + 'px'; Sfx.paso(); await sleep(560);
          if (ev.estrella) { const s = estrellas[ev.x + ',' + ev.y]; s.dataset.tomada = '1'; s.querySelector('.em').classList.add('tomada'); Sfx.estrella(); cuenta(); }
        } else {
          const dx = (ev.hx - ev.x) * T * .38, dy = (ev.hy - ev.y) * T * .38;
          beto.style.left = px(ev.x) + dx + 'px'; beto.style.top = px(ev.y) + dy + 'px'; await sleep(300);
          reb.classList.remove('ups'); void reb.offsetWidth; reb.classList.add('ups'); Sfx.mal();
          beto.style.left = px(ev.x) + 'px'; beto.style.top = px(ev.y) + 'px'; await sleep(600);
        }
      }
      prog.querySelectorAll('.bloque').forEach((b) => b.classList.remove('activo'));
      if (ses !== sesion) return;
      if (res.ok) {
        const est = C.estrellasGanadas(nivel, programa); guardarResultado(nivel, est);
        reb.classList.add('baila'); beto.classList.add('baila'); msg.textContent = tx('llegaste');
        const tip = est === 3 ? tx('pocos') : tx('menosBloques');
        await sleep(500); if (ses !== sesion) return; premio(idx, est, tip);
      } else {
        let t;
        if (res.choco) t = C.MSG.choco;
        else if (res.faltan > 0 && res.llego) t = C.MSG.faltaEstrella;
        else t = C.MSG.noLlego;
        msg.textContent = t; decir(t); await sleep(1400);
        if (ses !== sesion) return; reinicia();
      }
      corriendo = false; el.querySelectorAll('button').forEach((b) => { b.disabled = false; });
    }
    el.querySelector('#correr').onclick = () => { Sfx.clic(); correr(); };
    el.querySelector('#atras').onclick = () => { if (corriendo) return; Sfx.clic(); programa.pop(); pintaPrograma(); };
    el.querySelector('#borrar').onclick = () => { if (corriendo) return; Sfx.clic(); programa = []; pendienteRep = 0; pintaPrograma(); };
    el.querySelector('#oir').onclick = () => { Sfx.clic(); decir(nivel.voz); };
    el.querySelector('#pista').onclick = () => { Sfx.clic(); msg.textContent = '💡 ' + nivel.pista; decir(nivel.pista); };
    decir(nivel.voz);
  }

  /* ================= Ajustes de la profe ================= */
  function ajustes() {
    const dlg = document.getElementById('dlgAjustes'), form = document.getElementById('formAjustes');
    const a = 3 + ((Math.random() * 6) | 0), b = 4 + ((Math.random() * 5) | 0);
    form.innerHTML = `<h2>${tx('soloAdultos')}</h2><p>${tx('cuantoEs', { a, b })}</p>
      <input type="text" id="resp" inputmode="numeric" autocomplete="off"><div class="acciones"><button type="button" class="btn-peq" id="ok">${tx('entrar')}</button><button class="btn-peq gris" value="x">${tx('cerrar')}</button></div>`;
    dlg.showModal();
    form.querySelector('#resp').onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); form.querySelector('#ok').click(); } };
    form.querySelector('#ok').onclick = () => { if (+form.querySelector('#resp').value === a + b) panelAjustes(); else form.querySelector('p').textContent = tx('denuevo') + tx('cuantoEs', { a, b }); };
  }
  function panelAjustes() {
    Voz.cargar();
    const dlg = document.getElementById('dlgAjustes'), form = document.getElementById('formAjustes');
    const mejor = Voz.mejor();
    const opciones = Voz.voces.map((v) => `<option value="${esc(v.voiceURI)}" ${mejor && mejor.voiceURI === v.voiceURI ? 'selected' : ''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('') || '<option>' + tx('sinVoces') + '</option>';
    const filas = Object.entries(perfiles).sort((x, y) => y[1].last - x[1].last).map(([k, p]) => `<div class="perfil-fila"><span>${esc(p.avatar)} <b>${esc(p.name)}</b> · ⭐${totalEstrellas(p)} · ${tx('nivelesN', { a: Object.keys(p.done).length, b: C.NIVELES.length })}</span>
      <span><button type="button" class="btn-peq gris" data-act="libre" data-k="${esc(k)}">${p.libre ? tx('bloquear') : tx('abrirTodos')}</button> <button type="button" class="btn-peq gris" data-act="reset" data-k="${esc(k)}">${tx('reiniciar')}</button> <button type="button" class="btn-peq peligro" data-act="del" data-k="${esc(k)}">${tx('borrar')}</button></span></div>`).join('') || '<p>' + tx('nadie') + '</p>';
    form.innerHTML = `<h2>${tx('ajustesH')}</h2>
      <p id="estadoVoz" style="margin:0;font-weight:700;background:#fff;border-radius:14px;padding:10px 14px">${tx('revisando')}</p>
      <label>${tx('vozRespaldo')}<select id="selVoz">${opciones}</select></label>
      <label>${tx('velocidad')} <input type="range" id="ritmo" min="0.6" max="1.2" step="0.02" value="${cfg.ritmo}"></label>
      <label><input type="checkbox" id="mudo" ${cfg.silencio ? 'checked' : ''}> ${tx('silenciar')}</label>
      <div class="acciones"><button type="button" class="btn-peq" id="probar">${tx('escucharBeto')}</button><button type="button" class="btn-peq gris" id="probar2">${tx('probarResp')}</button></div>
      <h3>${tx('ninosEquipo')}</h3>${filas}
      <h3>${tx('copia')}</h3>
      <div class="acciones"><button type="button" class="btn-peq" id="exportar">${tx('descargar')}</button><label class="btn-peq gris" style="cursor:pointer">${tx('cargar')}<input type="file" id="importar" accept="application/json" hidden></label></div>
      <p class="aviso">${tx('avanceNota')}</p>
      <div class="acciones"><button class="btn-peq gris" value="x">${tx('cerrar')}</button></div>`;
    form.querySelector('#selVoz').onchange = (e) => { cfg.vozURI = e.target.value; LS.set(K_CFG, cfg); };
    form.querySelector('#ritmo').oninput = (e) => { cfg.ritmo = +e.target.value; LS.set(K_CFG, cfg); };
    form.querySelector('#mudo').onchange = (e) => { cfg.silencio = e.target.checked; LS.set(K_CFG, cfg); if (actual) pintaBarra(); };
    const muestra = C.todasLasFrases()[0];
    form.querySelector('#probar').onclick = () => Voz.decir(muestra.texto, muestra.id);
    form.querySelector('#probar2').onclick = () => Voz.decir(tx('pruebaResp'));
    (async () => {
      const lista = C.todasLasFrases(), total = lista.length; let ok = 0, nombre = '';
      await Promise.all(lista.map(async (f) => { if (await Voz.buscar(f.id)) ok++; }));
      try { const r = await fetch((idioma === 'en' ? 'audio/en/' : 'audio/') + 'voz.json'); if (r.ok) nombre = (await r.json()).voz || ''; } catch (e) { /* sin datos de la voz */ }
      const el = form.querySelector('#estadoVoz'); if (!el) return;
      el.textContent = ok === total ? tx('audiosTodos', { v: nombre ? ' (' + nombre + ')' : '', ok, t: total })
        : ok ? tx('audiosAlgunos', { ok, t: total })
        : tx('audiosNinguno');
    })();
    form.onclick = (e) => {
      const bt = e.target.closest('[data-act]'); if (!bt) return; const k = bt.dataset.k, p = perfiles[k];
      if (bt.dataset.act === 'libre') p.libre = !p.libre;
      else if (bt.dataset.act === 'reset' && confirm(tx('confReiniciar', { n: p.name }))) { p.done = {}; }
      else if (bt.dataset.act === 'del' && confirm(tx('confBorrar', { n: p.name }))) { delete perfiles[k]; if (actual === k) { actual = null; guardar(); dlg.close(); pantallaBienvenida(); return; } }
      else return;
      guardar(); panelAjustes(); if (actual) pintaBarra();
    };
    form.querySelector('#exportar').onclick = () => {
      const blob = new Blob([JSON.stringify({ v: 1, perfiles }, null, 1)], { type: 'application/json' }); const u = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = u; a.download = 'beto-avance.json'; a.click(); setTimeout(() => URL.revokeObjectURL(u), 2000);
    };
    form.querySelector('#importar').onchange = async (e) => {
      try { const d = JSON.parse(await e.target.files[0].text()); Object.entries(d.perfiles || {}).forEach(([k, p]) => { if (p && p.name && p.done) perfiles[k] = Object.assign({ avatar: '🦊', last: 0 }, p); }); guardar(); panelAjustes(); }
      catch (err) { alert(tx('noLeer')); }
    };
  }

  /* ================= Cambio de idioma ================= */
  function selectorIdioma() {
    const d = h(`<div class="lang" role="group" aria-label="${tx('aIdioma')}"><button type="button" data-l="es">ES</button><button type="button" data-l="en">EN</button></div>`);
    d.querySelectorAll('button').forEach((b) => { b.setAttribute('aria-pressed', String(b.dataset.l === idioma)); b.onclick = () => cambiarIdioma(b.dataset.l); });
    return d;
  }
  function textosFijos() {
    document.documentElement.lang = idioma;
    document.title = tx('titulo');
    const meta = document.querySelector('meta[name="description"]'); if (meta) meta.setAttribute('content', tx('descripcion'));
    [['btnInicio', 'aMapa'], ['totalEstrellas', 'aEstrellas'], ['btnSonido', 'aVoz'], ['btnAjustes', 'aAjustes']].forEach(([id, k]) => document.getElementById(id).setAttribute('aria-label', tx(k)));
    document.querySelectorAll('.lang').forEach((d) => { d.setAttribute('aria-label', tx('aIdioma')); d.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.l === idioma))); });
  }
  function cambiarIdioma(l) {
    if (l === idioma || (l !== 'es' && l !== 'en')) return;
    idioma = l; C.setIdioma(l);
    try { localStorage.setItem('labs-lang', l); } catch (e) { /* sin almacenamiento */ }
    Voz.parar(); Voz.cargar();
    document.querySelectorAll('.premio-fondo').forEach((x) => x.remove());
    textosFijos();
    if (actual && ultima) { if (document.getElementById('barra').hidden) document.getElementById('barra').hidden = false; ultima(); }
    else pantallaBienvenida();
    textosFijos(); if (actual) pintaBarra();
  }

  /* ================= Arranque ================= */
  document.querySelector('#barra .lang').replaceWith(selectorIdioma());
  document.getElementById('btnInicio').onclick = () => { Sfx.clic(); if (actual) pantallaMapa(); };
  document.getElementById('btnAjustes').onclick = () => { Sfx.clic(); ajustes(); };
  document.getElementById('btnSonido').onclick = () => { cfg.silencio = !cfg.silencio; LS.set(K_CFG, cfg); if (cfg.silencio) Voz.parar(); else Sfx.bien(); pintaBarra(); };
  textosFijos();
  pantallaBienvenida();
})();
