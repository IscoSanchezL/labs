/* Guías Makerspace · Grado 1° (ver plantilla en makerspace.js) */
window.MAKER = window.MAKER || {};
function rub1(a, b) { return [a, b, ['Cuenta lo que hizo', 'Necesita ayuda para contarlo', 'Cuenta lo que hizo con apoyo', 'Cuenta con sus palabras qué pasó y por qué'], ['Trabajo en equipo', 'Trabaja solo/a', 'Cumple su rol con recordatorios', 'Cumple su rol y ayuda a los demás']]; }
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

window.MAKER.sonidos = {
  dur: '45 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas del Makerspace (se puede hacer algo de ruido)',
  obj: 'Descubrir que el sonido nace de una vibración y que cambia (fuerte/suave, agudo/grave) según cómo vibra el objeto.',
  lab: 'Antes: el laboratorio «Sonidos que vibran» introduce xilófono, tambor y cuerda. Después: comparar el instrumento real con el digital y repetir el reto de fuerte, suave, agudo y grave.',
  mat: [
    ['Cajas de zapatos o latas vacías sin tapa (sin bordes filosos)', '1 por equipo', 'Serán la caja de resonancia'],
    ['Bandas elásticas de distintos grosores', '4 por equipo', 'Gruesas y delgadas'],
    ['Reglas de 30 cm o palitos de helado grandes', '2 por equipo', 'Para vibrar en el borde de la mesa'],
    ['Vasos de plástico + cuerda o lana (1 m)', '2 vasos y 1 cuerda por equipo', 'Teléfono de vasos; clip o nudo para sujetar'],
    ['Botellas pequeñas de plástico con arroz o lentejas', '2 por equipo', 'Maracas'],
    ['Cuchara de madera y olla pequeña', '1 por equipo', 'Tambor'],
    ['Cinta de enmascarar y marcadores', '1 rollo por equipo', 'Rotular y sujetar']
  ],
  herr: ['Tijeras de punta redonda (solo el docente corta cuerdas y vasos)', 'Punzón o lápiz para perforar los vasos (solo el docente)'],
  prep: ['Perfora el fondo de los vasos y pasa la cuerda con nudo por dentro.', 'Separa los materiales por equipo en bolsas.', 'Define zona «ruidosa» y pide hablar bajito entre ensayos con la señal «manos al aire = silencio».', 'Ten a mano un tambor o diapasón para la demostración.'],
  seg: ['Bandas elásticas: no apuntar a la cara ni a otros compañeros.', 'Volumen moderado: nunca acercar el sonido al oído de otra persona.', 'Revisar bordes de latas antes de entregarlas (cubrir con cinta).'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿Qué es un sonido?', x: ['Pide silencio total 10 segundos y que escuchen: «¿Qué sonidos hay?».', 'Toca la regla en el borde de la mesa o golpea un tambor y pide que pongan la mano en la garganta al decir «aaa»: ¡se siente algo que tiembla!', 'Pregunta: «¿Qué creen que tiembla cuando hay un sonido?».'] },
    { f: 'Explorar', min: 15, t: 'Hacemos que vibre', x: ['Cada equipo estira una banda elástica sobre la caja y la pulsa: ¿se ve temblar?', 'Prueban bandas gruesas y delgadas, más tensas y más flojas.', 'Con la regla en el borde de la mesa: más larga fuera suena más grave, más corta suena más aguda.', 'Anotan con dibujos: «suena grave / suena agudo».'] },
    { f: 'Explicar', min: 8, t: 'Fuerte, suave, agudo y grave', x: ['Pregunta: «¿Qué cambia cuando pulsamos más fuerte?» (el sonido es más fuerte y la banda vibra más grande).', 'Relaciona: banda delgada y tensa = agudo; gruesa y floja = grave.', 'Usa gestos: manos juntas = suave, manos abiertas = fuerte; mano arriba = agudo, abajo = grave.'] },
    { f: 'Elaborar', min: 12, t: 'Construimos un instrumento', x: ['Reto: «Con estos materiales, hagan un instrumento que suene fuerte y uno que suene suave».', 'Opciones: guitarra de caja con bandas, maracas con arroz, teléfono de vasos (estiran la cuerda para escuchar a su compañero).', 'Cada equipo prepara una pequeña canción de 10 segundos.'] },
    { f: 'Evaluar', min: 5, t: 'Concierto de la clase', x: ['Cada equipo toca su canción y explica: «Mi instrumento suena porque algo vibra: ___».', 'Cierre: sin vibración no hay sonido.', 'Conecta con el laboratorio digital: «Hoy en la computadora tocaremos xilófono, tambor y cuerda».'] }
  ],
  preg: ['¿Qué se movía cuando sonaba la banda?', '¿Qué hiciste para que sonara más fuerte? ¿Y más agudo?', '¿Escuchamos el sonido en el teléfono de vasos? ¿Qué pasa si la cuerda queda floja?', '¿Podrías inventar otro instrumento con material reciclado?'],
  rub: rub1(['Relaciona vibración y sonido', 'No relaciona sonido y movimiento', 'Nota que algo tiembla cuando suena', 'Explica que el sonido nace de una vibración'], ['Cambia agudo/grave', 'Necesita ayuda para cambiarlo', 'Lo logra con una de las opciones', 'Cambia agudo y grave a propósito']),
  err: ['Creer que «el sonido sale de la caja» sin ver la vibración: haz tocar la banda y la mesa.', 'Confundir fuerte con agudo: usa gestos distintos para cada pareja.'],
  ext: ['Tocar cuerdas de distinto grosor y ordenarlas de grave a agudo.', 'Poner arroz sobre un tambor y ver cómo salta al sonar.']
};

window.MAKER.sombras = {
  dur: '45 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Salón o Makerspace que se pueda oscurecer un poco (cortinas)',
  obj: 'Descubrir que la luz no atraviesa los objetos opacos y que la sombra cambia de tamaño y posición según dónde esté la luz.',
  lab: 'Antes: «Luz y sombras» enseña a mover la linterna y ver cambiar la sombra. Después: comparar las sombras reales con las de la pantalla.',
  mat: [
    ['Linterna pequeña (o la del celular del docente)', '1 por equipo', 'Pilas nuevas'],
    ['Muñecos, bloques o figuras de plástico', '3 por equipo', 'Objetos opacos de distinto tamaño'],
    ['Pantalla blanca: hoja grande, cartulina o pared', '1 por equipo', 'Donde se verá la sombra'],
    ['Objetos transparentes y translúcidos', '1 de cada tipo por equipo', 'Vaso plástico, papel mantequilla, vidrio de colores'],
    ['Cartulina negra, tijeras de punta redonda y palitos', '1 pliego por equipo', 'Títeres de sombras'],
    ['Cinta de enmascarar y regla', '1 por equipo', 'Marcar la posición']
  ],
  herr: ['Marcadores', 'Cinta métrica o regla para medir distancia'],
  prep: ['Prueba que las linternas funcionen y oscurece parcialmente el salón.', 'Recorta siluetas simples (estrella, pez) en cartulina negra para los títeres.', 'Pega las pantallas a la pared o apóyalas en cajas.', 'Asigna roles: Luz, Objeto, Medidor, Anotador.'],
  seg: ['No apuntar la linterna a los ojos.', 'Moverse con cuidado en penumbra; mantener los pasillos libres.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'Mi sombra y yo', x: ['Con la luz de una linterna, haz una sombra de tu mano en la pared.', 'Pregunta: «¿De dónde viene la sombra? ¿Qué necesita para existir?» (luz y algo que la tape).'] },
    { f: 'Explorar', min: 15, t: 'Jugamos con la sombra', x: ['Cada equipo proyecta la sombra de su muñeco sobre la pantalla.', 'Reto 1: sombra grande y sombra pequeña (acercando o alejando la linterna).', 'Reto 2: sombra a la izquierda o a la derecha (moviendo la luz).', 'Reto 3: probar objetos transparentes, translúcidos y opacos: ¿cuáles dejan pasar la luz?'] },
    { f: 'Explicar', min: 8, t: 'Cómo se forma una sombra', x: ['Dibujan en grande: luz → objeto → sombra.', 'Concluyen: cuanto más cerca de la luz, más grande la sombra; la sombra siempre queda al lado contrario de la luz.', 'Clasifican: opacos (sombra oscura), translúcidos (sombra tenue), transparentes (casi sin sombra).'] },
    { f: 'Elaborar', min: 12, t: 'Teatro de sombras', x: ['Los equipos recortan títeres de cartulina negra y los pegan a palitos.', 'Inventan una historia de 20 segundos y la presentan detrás de la pantalla.', 'Deben lograr un personaje que crezca y otro que se mueva de lado.'] },
    { f: 'Evaluar', min: 5, t: 'Función y cierre', x: ['Cada equipo presenta su teatro y dice: «Mi sombra creció cuando…».', 'Cierre: sin luz no hay sombra, y la sombra cambia si la luz cambia de lugar.'] }
  ],
  preg: ['¿Qué necesitas para tener una sombra?', '¿Qué pasa con la sombra si acercas la linterna?', '¿Por qué un vaso transparente casi no hace sombra?', '¿Dónde queda la sombra: del mismo lado de la luz o del lado contrario?'],
  rub: rub1(['Explica cómo se forma la sombra', 'No relaciona luz y sombra', 'Dice que necesita luz', 'Dice que se forma cuando el objeto tapa la luz'], ['Cambia el tamaño o la posición', 'No logra cambiarla', 'Lo logra por ensayo y error', 'Cambia tamaño y posición a propósito']),
  err: ['Creer que la sombra es del objeto y no de la luz tapada.', 'Pensar que la luz «se mete» en el objeto opaco.'],
  ext: ['Medir la sombra de un objeto a 3 distancias y dibujar una tabla.', 'Seguir la sombra de un poste en el patio en la mañana y en la tarde.']
};

window.MAKER.sentidos = {
  dur: '40 minutos', equipo: 'Equipos de 4 estudiantes (rotación por estaciones)', espacio: 'Mesas con 5 estaciones, una por sentido',
  obj: 'Usar los cinco sentidos para describir objetos y reconocer qué sentido sirve para cada información.',
  lab: 'Antes: «Mis cinco sentidos» presenta el juego de adivinar objetos. Después: repetir con objetos distintos y comparar.',
  mat: [
    ['Cajas o bolsas de tela oscuras («caja misteriosa»)', '1 por equipo', 'Para tacto: objetos ocultos'],
    ['Objetos para tocar: esponja, lija, algodón, piedra lisa', '4 por equipo', 'Distintas texturas'],
    ['Frascos pequeños con olores seguros: canela, naranja, menta, café', '4 frascos tapados con tela', 'Para olfato (sin probar)'],
    ['Instrumentos o sonidos: campanilla, maraca, llaves, papel arrugado', '4 por equipo', 'Para oído (se escuchan sin ver)'],
    ['Alimentos pequeños para probar: limón, azúcar, sal, miel', 'Porciones mínimas por estudiante', 'Solo si no hay alergias; vasitos desechables'],
    ['Tarjetas con dibujos de cosas coloridas', '8 por equipo', 'Para vista'],
    ['Pañuelos para vendar los ojos (opcional)', '1 por equipo', 'Solo si el niño acepta']
  ],
  herr: ['Hoja de registro con 5 columnas (ojo, oído, mano, nariz, boca)', 'Lápices de colores'],
  prep: ['Consulta con las familias por alergias antes de usar alimentos; si hay dudas, omite la estación del gusto.', 'Prepara las 5 estaciones y rótulos con el dibujo del sentido.', 'Esconde los objetos en las cajas y tapa los frascos con tela.', 'Define señales para rotar cada 5 minutos.'],
  seg: ['Alergias alimentarias: confirmar antes de cualquier prueba de sabor.', 'Nada de probar objetos que no sean alimentos de la estación; manos limpias.', 'Olores suaves, nunca acercar el frasco a la nariz: se abanica con la mano.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'Adivina qué es', x: ['Muestra una caja misteriosa: «¿Qué creen que hay?». Deja que la toquen sin ver.', 'Pregunta: «¿Qué sentido usamos?» y presenta los cinco sentidos con una canción o gestos.'] },
    { f: 'Explorar', min: 18, t: 'Cinco estaciones', x: ['Cada equipo pasa 3–4 minutos por estación y anota o dibuja lo que descubre.', 'Vista: describen colores y formas. Oído: adivinan sonidos con los ojos cerrados.', 'Tacto: describen texturas (suave, áspero, frío). Olfato: huelen sin mirar y adivinan.', 'Gusto: prueban un solo bocado y dicen dulce, salado o ácido.'] },
    { f: 'Explicar', min: 7, t: 'Cada sentido, su trabajo', x: ['Unen cada sentido con su órgano: ojos, oídos, piel, nariz, lengua.', 'Pregunta: «¿Qué sentido te sirvió para saber si algo estaba caliente?».'] },
    { f: 'Elaborar', min: 7, t: 'Mi caja de sentidos', x: ['Cada estudiante dibuja un objeto y escribe/dibuja qué sentidos usó para conocerlo.', 'Reto: encontrar un objeto del salón que use al menos 3 sentidos.'] },
    { f: 'Evaluar', min: 3, t: 'Ronda de cierre', x: ['Cada niño completa «Con mis ___ puedo ___».', 'Conecta con el laboratorio digital y propón jugar con objetos nuevos.'] }
  ],
  preg: ['¿Con qué parte del cuerpo olemos? ¿Y con cuál oímos?', '¿Qué objeto fue difícil de adivinar? ¿Qué sentido ayudó más?', '¿Qué pasa si te tapas los ojos? ¿Los otros sentidos se vuelven más importantes?'],
  rub: rub1(['Relaciona sentido y órgano', 'No los relaciona', 'Relaciona 2 o 3', 'Relaciona los 5'], ['Describe con detalle', 'Usa una palabra', 'Usa dos o tres palabras', 'Describe con varias palabras (suave, frío, dulce)']),
  err: ['Creer que el gusto solo está en la lengua sin olfato: prueba con la nariz tapada.', 'Confundir tacto con «las manos»: toda la piel siente.'],
  ext: ['Probar un alimento con la nariz tapada y comparar.', 'Hacer una «ruta sensorial» de piso con texturas.']
};

window.MAKER['luz-color'] = {
  dur: '45 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas con mantel o papel; cerca de una ventana con luz natural',
  obj: 'Descubrir que la luz del sol puede separarse en colores y que se obtienen colores nuevos al mezclar los primarios.',
  lab: 'Antes: «Colores del arco iris» muestra sol + lluvia = arco iris y la mezcla de colores. Después: comparar sus mezclas con las del laboratorio.',
  mat: [
    ['Vaso transparente con agua + hoja blanca', '1 por equipo', 'Para ver el arco iris con luz del sol'],
    ['Linterna o luz solar directa', '1 por equipo', 'Espejo pequeño opcional'],
    ['Pinturas témpera rojo, amarillo y azul', '1 de cada por equipo', 'Colores primarios'],
    ['Vasitos o paleta de huevos para mezclar', '1 paleta por equipo', 'Una celda por mezcla'],
    ['Palitos de helado o pinceles', '3 por equipo', 'Mezclar sin ensuciar'],
    ['Hojas blancas gruesas o cartulina', '2 por estudiante', 'Para pintar el arco iris'],
    ['Delantales o camisetas viejas, toallas húmedas', '1 por estudiante', 'Limpieza']
  ],
  herr: ['Marcadores', 'Hoja con círculos para registrar mezclas'],
  prep: ['Prueba el vaso con agua frente a la luz del sol hasta ver el arco iris en la hoja.', 'Pon un poco de cada témpera en los vasitos (diluida en agua).', 'Cubre las mesas con papel o mantel plástico.', 'Elige los roles: Mezclador, Pintor, Anotador, Ayudante de limpieza.'],
  seg: ['Usar témperas no tóxicas; no llevarse nada a la boca.', 'No mirar directamente al sol ni apuntar espejos a los ojos.', 'Lavarse las manos al terminar.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿Cómo nace un arco iris?', x: ['Pregunta: «¿Cuándo vemos un arco iris?» (sol y lluvia).', 'Muestra el vaso con agua frente a la luz: «¿Qué colores aparecen?».'] },
    { f: 'Explorar', min: 15, t: 'Atrapamos los colores', x: ['Con el vaso de agua y la hoja blanca buscan el ángulo donde aparecen los colores.', 'Luego mezclan témperas en la paleta: rojo + amarillo, amarillo + azul, rojo + azul.', 'Anotan el color que sale: naranja, verde, morado.'] },
    { f: 'Explicar', min: 8, t: 'Primarios y secundarios', x: ['Nombra rojo, amarillo y azul como colores primarios.', 'Pregunta: «¿Qué pasa si mezclamos mucho de uno y poco de otro?» (cambia el tono).', 'Ordena los colores del arco iris en la pizarra.'] },
    { f: 'Elaborar', min: 12, t: 'Pintamos un arco iris', x: ['Cada estudiante pinta un arco iris usando solo los tres primarios y las mezclas que descubrió.', 'Reto: hacer un color nuevo que no esté en el arco iris (café, gris).'] },
    { f: 'Evaluar', min: 5, t: 'Galería de colores', x: ['Se cuelgan los dibujos. Cada niño explica una mezcla: «Mezclé ___ con ___ y salió ___».', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué necesitamos para ver un arco iris?', '¿Cuáles son los colores primarios?', '¿Qué color sale al mezclar azul y amarillo?', '¿Se puede hacer un color nuevo con tres témperas?'],
  rub: rub1(['Mezcla colores', 'No logra mezclar', 'Logra una mezcla', 'Logra las tres mezclas y las nombra'], ['Explica el arco iris', 'No lo explica', 'Dice que hay sol y lluvia', 'Dice que la luz se separa en colores']),
  err: ['Creer que mezclar «siempre» da café: depende de cuáles colores.', 'Pensar que el arco iris tiene solo 3 colores.'],
  ext: ['Hacer un arco iris con leche, colorante y detergente.', 'Girar un disco de Newton (colores en círculo) y ver cómo se «mezclan».']
};

window.MAKER.animales = {
  dur: '45 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas con cuatro «hábitats» de cartulina',
  obj: 'Reconocer que cada animal vive en un lugar (hábitat) donde encuentra lo que necesita.',
  lab: 'Antes: «¿Dónde vive cada animal?» muestra mar, granja, selva y polo. Después: repetir y comparar con sus murales.',
  mat: [
    ['Cartulinas grandes pintadas (azul, verde, selva, blanco)', '4 por equipo', 'Cada una es un hábitat: mar, granja, selva y polo'],
    ['Tarjetas con animales (recortes o impresas)', '12 por equipo', 'Pez, pulpo, vaca, gallina, mono, loro, pingüino, oso polar...'],
    ['Plastilina de colores', '1 caja por equipo', 'Modelar animales'],
    ['Pegante en barra y tijeras de punta redonda', '1 de cada por equipo', 'Pegar los animales'],
    ['Cajas pequeñas de cartón', '1 por equipo', 'Para hacer una maqueta de hábitat'],
    ['Hojas de colores, algodón, papel celofán', 'Varios', 'Nieve, agua, hojas']
  ],
  herr: ['Marcadores', 'Hoja con tabla: animal · dónde vive'],
  prep: ['Pinta o prepara las cuatro cartulinas de hábitat.', 'Imprime o recorta las tarjetas de animales y mézclalas por equipo.', 'Prepara una maqueta modelo de un hábitat para mostrar al inicio.'],
  seg: ['Tijeras: usarlas solo con supervisión.', 'Plastilina: no llevar a la boca.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿Dónde vivo yo?', x: ['Pregunta: «¿Dónde vive un pez? ¿Y una vaca?». Escucha ideas.', 'Presenta los cuatro hábitats con las cartulinas.'] },
    { f: 'Explorar', min: 15, t: 'Llevamos cada animal a su casa', x: ['Cada equipo reparte las tarjetas de animales en los cuatro hábitats y explica por qué.', 'Si un animal «no cabe», ¿qué le falta? (agua, frío, árboles, comida).'] },
    { f: 'Explicar', min: 8, t: 'Hábitat = casa', x: ['Define hábitat como el lugar donde el animal encuentra agua, comida, abrigo y espacio.', 'Compara: «¿Por qué el pingüino no vive en la selva?».'] },
    { f: 'Elaborar', min: 12, t: 'Hacemos un hábitat', x: ['Cada equipo elige un hábitat y construye una maqueta en una caja con plastilina, algodón, papel celofán y hojas.', 'Debe incluir al menos 3 animales y algo de lo que necesitan (agua, árboles, hielo).'] },
    { f: 'Evaluar', min: 5, t: 'Presentamos', x: ['Cada equipo presenta: «En mi hábitat viven ___ porque ___».', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué necesita un animal para vivir en su casa?', '¿Qué pasaría si un pez saliera del agua?', '¿Qué animales viven cerca de nosotros?'],
  rub: rub1(['Ubica animales en su hábitat', 'Ubica 0 o 1', 'Ubica la mitad', 'Ubica casi todos y explica por qué'], ['Construye la maqueta', 'Solo pone el fondo', 'Pone 1 o 2 animales', 'Incluye animales y lo que necesitan']),
  err: ['Creer que un animal vive en cualquier lugar.', 'Pensar que las mascotas son animales «de la selva».'],
  ext: ['Buscar un animal de nuestra región y decir su hábitat.', 'Hacer un diorama de un animal en peligro.']
};

window.MAKER.estados = {
  dur: '45 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas con lavamanos cercano',
  obj: 'Clasificar objetos y materiales como sólidos, líquidos o gases y observar que el agua cambia de estado.',
  lab: 'Antes: «Sólido, líquido o gas» muestra el hielo, el agua y el vapor. Después: clasificar objetos del salón en la pantalla.',
  mat: [
    ['Cubos de hielo (en termo)', '3 por equipo', 'Sólido'],
    ['Agua tibia en vasos', '1 vaso por equipo', 'Líquido'],
    ['Globos inflados y bolsas sellables con aire', '2 por equipo', 'Gas (aire)'],
    ['Piedras, lápices y bloques', '4 por equipo', 'Sólidos de forma propia'],
    ['Jugo, leche o aceite en vasitos', '1 por equipo', 'Líquidos con distinta forma'],
    ['Bandejas plásticas y toallas', '1 por equipo', 'Derrames'],
    ['Cartulina dividida en 3 zonas: sólido, líquido, gas', '1 por equipo', 'Para clasificar']
  ],
  herr: ['Termómetro de salón (opcional)', 'Marcadores'],
  prep: ['Lleva el hielo en un termo. Prepara agua tibia (no caliente).', 'Infla los globos y llena las bolsas con aire antes de la clase.', 'Alista las cartulinas de clasificación por equipo.'],
  seg: ['Agua tibia solamente, nunca caliente.', 'Limpiar derrames de inmediato.', 'Los globos pueden asustar si explotan: usar con cuidado.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿Hielo, agua o aire?', x: ['Muestra un cubo de hielo, un vaso de agua y un globo.', 'Pregunta: «¿En qué se parecen? ¿En qué se diferencian?».'] },
    { f: 'Explorar', min: 15, t: 'Tocamos y observamos', x: ['Cada equipo toca (con permiso) el hielo, vierte el agua en dos recipientes distintos y aprieta el globo.', 'Anotan: ¿mantiene su forma? ¿toma la forma del recipiente? ¿llena todo el espacio?', 'Observan el hielo derretirse en la bandeja.'] },
    { f: 'Explicar', min: 8, t: 'Tres estados', x: ['Sólido: forma propia. Líquido: toma la forma del recipiente. Gas: llena todo el espacio.', 'Pregunta: «¿Qué pasó con el hielo después de unos minutos? ¿Qué se necesita para cambiar de estado?» (calor).'] },
    { f: 'Elaborar', min: 12, t: 'Clasificamos', x: ['Cada equipo recibe 12 objetos y los ubica en la cartulina de tres zonas.', 'Reto: encontrar un objeto «difícil» (arena, gelatina, espuma) y discutir dónde va.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo muestra su clasificación y explica una decisión.', 'Conecta con el laboratorio digital: calentar y enfriar el agua.'] }
  ],
  preg: ['¿Qué pasa con el hielo al sol?', '¿Qué tiene en común un cubo de hielo y una piedra?', '¿Cómo sabes que el aire ocupa espacio?'],
  rub: rub1(['Clasifica correctamente', 'Clasifica menos de la mitad', 'Clasifica la mitad', 'Clasifica casi todo y explica'], ['Describe el cambio del hielo', 'No lo describe', 'Dice que se derrite', 'Dice que se derrite por el calor']),
  err: ['Creer que el aire «no existe» porque no se ve: haz inflar un globo.', 'Pensar que la arena es líquida porque se desliza (se parece pero es un conjunto de sólidos).'],
  ext: ['Congelar agua con colorante y ver cuánto tarda en derretirse en distintos lugares.', 'Hacer «nubes» de vapor con agua tibia en un frasco.']
};

window.MAKER.clima = {
  dur: '45 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Salón con vista a una ventana o patio',
  obj: 'Observar y registrar el clima del día (sol, nubes, lluvia, viento) y escoger la ropa adecuada.',
  lab: 'Antes: «El clima de hoy» enseña a cambiar el cielo y vestir al personaje. Después: comparar el clima observado con el del laboratorio.',
  mat: [
    ['Cartulina con ventana del clima (sol, nube, lluvia, viento)', '1 por equipo', 'Rueda de clima giratoria'],
    ['Tiras de papel de seda o cintas', '4 por equipo', 'Veleta casera para ver el viento'],
    ['Palito, grapa o vaso para soporte', '1 por equipo', 'Para la veleta'],
    ['Termómetro de ambiente o dibujo de termómetro', '1 por equipo', 'Valores simples'],
    ['Tarjetas de ropa (gorra, abrigo, paraguas, sandalias)', '8 por equipo', 'Para vestir al muñeco'],
    ['Hojas blancas y crayones', '2 por estudiante', 'Dibujar el clima'],
    ['Cinta de enmascarar', '1 rollo', 'Pegar los registros']
  ],
  herr: ['Tijeras de punta redonda', 'Marcadores'],
  prep: ['Corta la rueda del clima y haz el modelo.', 'Imprime o recorta las tarjetas de ropa.', 'Elige un lugar del patio seguro para colgar la veleta.'],
  seg: ['Salir al patio en fila y con supervisión.', 'No mirar directamente al sol.', 'Si llueve, observar desde la ventana.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿Cómo está el cielo hoy?', x: ['Pide que miren por la ventana o salgan 1 minuto.', 'Pregunta: «¿Qué ves? ¿Qué sientes? ¿Qué ropa te pusiste hoy?».'] },
    { f: 'Explorar', min: 15, t: 'Detectives del clima', x: ['Cada equipo observa cielo, viento (veleta) y temperatura (frío/calor) y lo registra con dibujos.', 'Giran la rueda del clima para mostrar el del día.', 'Prueban con las tarjetas de ropa qué se pone en cada clima.'] },
    { f: 'Explicar', min: 8, t: 'Cuatro climas', x: ['Soleado, nublado, lluvioso y ventoso: ¿qué se ve, qué se siente, qué ropa se usa?', 'Conclusión: el clima cambia durante el día y de un día a otro.'] },
    { f: 'Elaborar', min: 12, t: 'Calendario del clima', x: ['Cada estudiante dibuja el clima de hoy en un calendario de 5 casillas y lo continuará durante la semana.', 'Reto: dibujar el personaje con la ropa ideal para un día de lluvia y viento.'] },
    { f: 'Evaluar', min: 5, t: 'Ronda de cierre', x: ['Cada equipo dice: «Hoy está ___ y me pongo ___ porque ___».', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Cómo sabes que hay viento?', '¿Qué ropa necesitas cuando llueve? ¿Por qué?', '¿El clima es igual todos los días?'],
  rub: rub1(['Describe el clima', 'Usa una palabra', 'Describe cielo o temperatura', 'Describe cielo, viento y temperatura'], ['Elige la ropa adecuada', 'No relaciona clima y ropa', 'Acierta con ayuda', 'Acierta y explica por qué']),
  err: ['Confundir clima de hoy (tiempo) con estaciones del año.', 'Creer que nublado siempre significa lluvia.'],
  ext: ['Registrar el clima 5 días y hacer un pictograma.', 'Medir la lluvia con un vaso transparente y una regla.']
};

window.MAKER['dia-noche'] = {
  dur: '45 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Salón oscurecido con una pared libre',
  obj: 'Comprender que la Tierra gira y por eso hay día y noche, y que el Sol alumbra siempre la mitad del planeta.',
  lab: 'Antes: «Día y noche» muestra la Tierra girando y las actividades de día y de noche. Después: repetirlo señalando dónde está su ciudad.',
  mat: [
    ['Globo terráqueo o pelota con un punto pegado (tu ciudad)', '1 por equipo', 'La Tierra'],
    ['Linterna fuerte', '1 por grupo grande', 'El Sol (colocada fija)'],
    ['Plastilina o palito para marcar la ciudad', '1 por equipo', 'Punto de referencia'],
    ['Tarjetas de actividades de día/noche (desayunar, dormir, jugar, ver estrellas)', '8 por equipo', 'Clasificar'],
    ['Cartulina azul oscuro y amarilla', '1 por estudiante', 'Dibujar el día y la noche'],
    ['Pegante y tijeras de punta redonda', '1 por equipo', 'Collage']
  ],
  herr: ['Marcadores', 'Cinta para fijar la linterna'],
  prep: ['Fija una linterna en un soporte a la altura de las pelotas.', 'Oscurece el salón.', 'Marca en cada pelota/globo un punto para «nuestra ciudad».', 'Prepara las tarjetas de actividades.'],
  seg: ['No apuntar la linterna a los ojos.', 'Cuidar los pasillos con poca luz.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿Por qué se hace de noche?', x: ['Pregunta: «¿Dónde está el Sol de noche? ¿Se apaga?». Escucha ideas.', 'Enciende la linterna y muestra que alumbra solo una parte de la pelota.'] },
    { f: 'Explorar', min: 15, t: 'La Tierra gira', x: ['Cada equipo gira lentamente su pelota frente a la linterna y observa cuándo su ciudad queda iluminada (día) o en sombra (noche).', 'Cuentan cuántas vueltas dan para «un día».', 'Giran en ambos sentidos para ver qué cambia.'] },
    { f: 'Explicar', min: 8, t: 'Día y noche', x: ['Define: la Tierra gira sobre sí misma; cuando mira al Sol es de día, cuando le da la espalda es de noche.', 'Aclara: el Sol no se mueve «de lado a lado»; parece que sí por el giro.', 'Pregunta: «¿Qué hacemos de día? ¿Y de noche?». Clasifican tarjetas.'] },
    { f: 'Elaborar', min: 12, t: 'Collage del día y la noche', x: ['En una cartulina dividida, cada niño pega o dibuja 3 cosas del día y 3 de la noche.', 'Reto: dibujar qué hace un niño al otro lado del mundo cuando aquí es de noche.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo dice: «Es de día cuando ___ y de noche cuando ___».', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Se mueve el Sol o se mueve la Tierra?', '¿Por qué la linterna alumbra solo la mitad de la pelota?', '¿Cuánto tarda la Tierra en dar una vuelta completa?'],
  rub: rub1(['Explica el día y la noche', 'No explica', 'Dice «el Sol se va»', 'Dice que la Tierra gira y el Sol alumbra una mitad'], ['Usa el modelo', 'No lo usa', 'Lo usa con ayuda', 'Lo usa y lo explica']),
  err: ['Creer que el Sol «se esconde» o se apaga de noche.', 'Pensar que la Luna produce la noche.'],
  ext: ['Medir la sombra de un palito a distintas horas del día.', 'Comparar la hora en dos ciudades del mundo.']
};

window.MAKER.cuerpo = {
  dur: '45 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas del Makerspace con espacio para moverse',
  obj: 'Identificar el corazón, los pulmones, el cerebro y los huesos, y descubrir cómo cambian el pulso y la respiración al moverse.',
  lab: 'Antes: «Mi cuerpo» muestra el corazón latiendo más rápido al correr. Después: comparar sus propios latidos con los del laboratorio.',
  mat: [
    ['Silueta de cuerpo humano en papel kraft (tamaño de un niño)', '1 por equipo', 'Para ubicar los órganos'],
    ['Tarjetas o recortes de corazón, pulmones, cerebro y huesos', '1 juego por equipo', 'Para pegar'],
    ['Estetoscopios de juguete o tubos de cartón', '1 por equipo', 'Escuchar el corazón'],
    ['Globos grandes y pajillas', '2 por equipo', 'Modelo de pulmones'],
    ['Cronómetro o reloj de pared', '1 por equipo', 'Medir 15 segundos'],
    ['Tizas, cinta y marcadores', 'Varios', 'Marcar la zona de saltos']
  ],
  herr: ['Hojas con tabla: antes de saltar / después de saltar', 'Lápices de colores'],
  prep: ['Dibuja o imprime las siluetas y las tarjetas de órganos.', 'Prepara los tubos de cartón como estetoscopios.', 'Marca una zona de 2×2 m para saltar.'],
  seg: ['Calentar suave antes de saltar; pedir descansar si alguien se cansa.', 'Niños con asma o problemas del corazón: participar sin esfuerzo y con permiso de la familia.', 'No compartir pajillas ni estetoscopios sin limpiar.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿Qué hay dentro de mí?', x: ['Pide a los niños que se pongan la mano en el pecho y sientan.', 'Pregunta: «¿Qué late? ¿Qué mueve el aire cuando respiramos?».'] },
    { f: 'Explorar', min: 18, t: 'Escuchamos y medimos', x: ['Con el estetoscopio o la mano en el pecho cuentan latidos en 15 segundos en reposo.', 'Saltan 30 segundos y vuelven a contar. Anotan ambos números.', 'Con globos y pajillas inflan un «pulmón» y sienten cómo se llena de aire.', 'Colocan en la silueta corazón, pulmones, cerebro y huesos.'] },
    { f: 'Explicar', min: 7, t: 'Cada órgano tiene su trabajo', x: ['Corazón: bombea la sangre. Pulmones: llenan el cuerpo de aire. Cerebro: piensa y manda órdenes. Huesos: sostienen el cuerpo.', 'Pregunta: «¿Por qué late más rápido después de saltar?» (el cuerpo necesita más energía).'] },
    { f: 'Elaborar', min: 10, t: 'Mi esqueleto de cartón', x: ['Cada estudiante dibuja su silueta y pega los órganos en su lugar.', 'Reto: escribir una regla de cuidado (dormir, comer bien, moverse) para cada órgano.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo dice: «Mi corazón late más rápido cuando ___».', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Dónde sentiste los latidos?', '¿Qué pasó con tu corazón al saltar? ¿Y cuando descansaste?', '¿Qué órgano usamos para pensar? ¿Para respirar?'],
  rub: rub1(['Ubica los órganos', 'Ubica 1 o 2', 'Ubica 3', 'Ubica los 4 y dice qué hacen'], ['Compara el pulso', 'No registra los números', 'Registra uno', 'Registra y compara reposo y movimiento']),
  err: ['Ubicar el corazón en el lado izquierdo del pecho: está al centro, un poco a la izquierda.', 'Creer que los huesos están «muertos»: son tejido vivo.'],
  ext: ['Medir el pulso después de distintos ejercicios y hacer una tabla.', 'Construir un modelo del pulmón con una botella y globos.']
};
