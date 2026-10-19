/* Guías para el docente: cómo llevar cada experimento al Makerspace (materiales, preparación, seguridad, pasos, evaluación).
   Plantilla: modelo 5E (Enganchar · Explorar · Explicar · Elaborar · Evaluar) + hoja de materiales y rúbrica de 3 niveles.
   window.MAKER[id] = { dur, equipo, espacio, obj, lab, mat:[[material, cantidad, nota]], herr:[], prep:[], seg:[], pasos:[{f,min,t,x:[]}], preg:[], rub:[[criterio, inicia, avanza, logra]], err:[], ext:[] } */
window.MAKER = window.MAKER || {};
window.MAKER.flotar = {
  dur: '45 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas con tina de agua (cerca de un lavamanos o de un balde para vaciar)',
  obj: 'Predecir y comprobar si distintos objetos flotan o se hunden, y descubrir que la forma de un objeto también influye (un barquito de plastilina flota).',
  lab: 'Hacer el laboratorio digital «¿Flota o se hunde?» antes de la sesión prepara el vocabulario (flota, se hunde, adivinar). Después de la sesión, repetirlo permite comparar lo que predijeron con lo que vieron.',
  mat: [
    ['Tina o balde transparente con agua (2/3 llena)', '1 por equipo', 'Un recipiente transparente permite ver el objeto hundirse'],
    ['Objetos para probar', '8 por equipo', 'Corcho, moneda, clip, esponja, piedra pequeña, trozo de madera, tapa plástica, crayón'],
    ['Plastilina (barra de plastilina comercial)', '1 bolita del tamaño de una nuez por estudiante', 'No usar masa casera de sal o harina: se deshace en el agua'],
    ['Monedas o clips (para el reto del barquito)', '15 por equipo', 'Son la «carga» del barco'],
    ['Toallas o trapos', '2 por equipo', 'Para secar mesa y objetos'],
    ['Bandeja o caja', '1 por equipo', 'Para dejar los objetos mojados'],
    ['Hoja de registro (tabla que dibujas en una hoja)', '1 por equipo', 'Tabla de 8 filas: objeto · mi predicción · resultado'],
    ['Delantales o batas (opcional)', '1 por estudiante', 'Evita mojar el uniforme']
  ],
  herr: ['Lápices o crayones', 'Jarra para llenar las tinas', 'Cronómetro o reloj de pared'],
  prep: [
    'Llena las tinas hasta 2/3 de su capacidad y ponlas sobre un plástico o mantel impermeable.',
    'Prepara una bolsa por equipo con los 8 objetos y su hoja de registro.',
    'Prueba tú misma/o la plastilina en el agua: la bolita debe hundirse y el barquito con bordes altos debe flotar.',
    'Deja a mano un balde para vaciar agua y trapos para el piso.',
    'Define los equipos y los roles: «Pronosticador» (adivina), «Probador» (mete el objeto), «Anotador» (registra), «Secador» (cuida la mesa).'
  ],
  seg: [
    'Piso mojado: pide caminar y limpiar derrames de inmediato.',
    'Objetos pequeños (clips, monedas, corcho): con grado 1° no se llevan a la boca; supervisa de cerca.',
    'Lavado de manos al terminar.'
  ],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'Una pregunta para empezar', x: ['Muestra dos objetos (por ejemplo una piedra y un corcho) y pregunta: «¿Qué pasará cuando los ponga en el agua?».', 'Votación con el cuerpo: manos arriba = flota, manos abajo = se hunde.', 'Prueba los dos delante de todos y celebra los aciertos y los errores («¡nos equivocamos y aprendimos!»).'] },
    { f: 'Explorar', min: 15, t: 'Adivina y prueba', x: ['Cada equipo toma un objeto a la vez.', 'El Pronosticador dice su idea y el Anotador la marca en la hoja antes de probar.', 'El Probador mete el objeto con suavidad en el agua y todos observan.', 'Anotan el resultado (flota ↑ o se hunde ↓) y pasan al siguiente objeto. Los 8 objetos.'] },
    { f: 'Explicar', min: 8, t: 'Agrupamos y ponemos palabras', x: ['Con los resultados, cada equipo separa los objetos en dos grupos: «flotan» y «se hunden».', 'Pregunta: «¿Qué tienen en común los que flotan?». Acepta ideas (livianos, de madera, con aire).', 'Plantea un desafío a la idea «lo pesado se hunde»: un barco enorme flota. Deja la pregunta abierta para el siguiente paso.'] },
    { f: 'Elaborar', min: 12, t: 'Reto: la plastilina que flota', x: ['Entrega la bolita de plastilina: «¿Flotará?». Prueban: se hunde.', 'Reto: «Sin agregar ni quitar plastilina, cambien su forma para que flote». Dales 5 minutos para construir.', 'Cuando una forma flota (barquito con bordes altos), pregunta qué cambió y pide que cuenten cuántas monedas o clips aguanta antes de hundirse.', 'Registran el mejor barco del equipo.'] },
    { f: 'Evaluar', min: 5, t: 'Círculo de cierre', x: ['Cada equipo muestra su barco y dice una frase: «Mi barco flota porque…».', 'Repasa la idea principal: la forma ayuda a flotar.', 'Conecta con el laboratorio digital: «En la computadora vamos a repetir el experimento y a ver si adivinamos mejor».'] }
  ],
  preg: ['¿Qué pensabas que iba a pasar? ¿Qué pasó de verdad?', '¿Todos los objetos livianos flotan? ¿Todos los pesados se hunden?', '¿Qué cambió en la plastilina para que flotara?', '¿Cómo harías un barco que cargue más monedas?'],
  rub: [
    ['Predice antes de probar', 'Prueba sin decir su idea', 'Dice su idea pero no la compara con el resultado', 'Predice, prueba y compara con lo que vio'],
    ['Registra resultados', 'Registro incompleto', 'Registra la mayoría de los objetos', 'Registra todos los objetos con su resultado'],
    ['Construye el barquito', 'Necesita ayuda para cambiar la forma', 'Logra que flote después de varios intentos', 'Logra que flote y explica por qué'],
    ['Trabajo en equipo', 'Trabaja solo/a', 'Cumple su rol con recordatorios', 'Cumple su rol y ayuda a los demás']
  ],
  err: ['Creer que «lo pequeño flota y lo grande se hunde»: contrasta con el barco y la moneda.', 'Confundir «pesado» con «se hunde»: lo que importa es cómo está repartido el material (forma y espacios con aire).', 'Apretar la plastilina como una bola cuando deben abrirla como una taza.'],
  ext: ['Probar los mismos objetos en agua con sal y comparar (el agua salada sostiene más).', 'Construir un barco con papel aluminio y ver cuántas monedas carga.', 'Dibujar el barco ideal y presentarlo al grupo.']
};
