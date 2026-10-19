/* Guías Makerspace · Grado 2° (ver plantilla en makerspace.js) */
window.MAKER = window.MAKER || {};
function rub2(a, b) { return [a, b, ['Registra lo que observa', 'Registro incompleto', 'Registra con ayuda', 'Registra con dibujos y palabras claras'], ['Trabajo en equipo', 'Trabaja solo/a', 'Cumple su rol con recordatorios', 'Cumple su rol y ayuda a los demás']]; }

window.MAKER.imanes = {
  dur: '45 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas del Makerspace (lejos de celulares y tarjetas)',
  obj: 'Predecir y comprobar qué materiales atrae un imán y descubrir que la fuerza actúa a distancia y atraviesa algunos materiales.',
  lab: 'Antes: «Imanes» presenta objetos de varios materiales. Después: comparar sus predicciones con las del laboratorio.',
  mat: [
    ['Imanes de barra o de herradura medianos', '1 por equipo', 'Evita imanes muy fuertes (neodimio) con niños'],
    ['Objetos de prueba: clip, moneda, llave, tapa plástica, goma, lápiz, papel de aluminio, tornillo', '8 por equipo', 'Mezcla metales y no metales'],
    ['Cartulina o vaso de plástico', '1 por equipo', 'Para atravesar con la fuerza del imán'],
    ['Limaduras de hierro en frasco sellado (o clips pequeños)', '1 frasco por equipo', 'Para ver el campo; el frasco debe quedar cerrado'],
    ['Hoja de registro (tabla objeto · predigo · resultado)', '1 por equipo', 'Dibuja ✔ y ✖'],
    ['Cinta de enmascarar y cuerda', '1 rollo', 'Pesca magnética'],
    ['Palitos de helado y clips', '6 por equipo', 'Pescar con imán']
  ],
  herr: ['Lápices de colores', 'Cronómetro'],
  prep: ['Separa 8 objetos por equipo en una bolsa.', 'Cierra con cinta cualquier frasco con limaduras: nunca se abre en clase.', 'Aleja celulares, tarjetas y relojes de los imanes.', 'Prueba tú los objetos: algunas monedas y llaves se pegan, otras no.'],
  seg: ['Los imanes fuertes pueden pellizcar los dedos: usar solo imanes escolares.', 'No acercar imanes a celulares, tarjetas, marcapasos o aparatos.', 'No llevarse imanes ni objetos pequeños a la boca.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'Una fuerza invisible', x: ['Acerca un imán a un clip sin tocarlo: se mueve solo.', 'Pregunta: «¿Qué creen que pasó? ¿Qué objetos se pegarán?».'] },
    { f: 'Explorar', min: 15, t: 'Predigo y compruebo', x: ['En cada objeto, el equipo marca primero su predicción (✔ se pega / ✖ no).', 'Acercan el imán y registran el resultado.', 'Prueban a pescar clips a través de una cartulina o un vaso.'] },
    { f: 'Explicar', min: 8, t: 'Qué atrae el imán', x: ['Clasifican en «se pegan» y «no se pegan». Pregunta: «¿Qué tienen en común los que se pegan?» (hierro/acero).', 'Aclara que no todos los metales son atraídos (aluminio y cobre no).', 'Muestra que la fuerza actúa a distancia y atraviesa materiales delgados.'] },
    { f: 'Elaborar', min: 12, t: 'Pesca magnética', x: ['Cada equipo hace una caña de pescar con un palito, cuerda e imán.', 'Reto: pescar el mayor número de clips en 60 segundos.', 'Prueban qué grosor de cartulina deja pasar la fuerza.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo comparte una regla: «Un imán atrae ___ pero no ___».', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué tienen en común los objetos que se pegaron?', '¿El imán necesita tocar el objeto para atraerlo?', '¿Qué pasó cuando pusimos cartulina entre el imán y el clip?'],
  rub: rub2(['Predice antes de probar', 'No predice', 'Predice sin comparar', 'Predice, prueba y compara'], ['Clasifica por material', 'No clasifica', 'Clasifica con ayuda', 'Clasifica y da la regla']),
  err: ['Creer que el imán atrae todos los metales.', 'Pensar que el imán atrae «porque pega» como un pegamento.'],
  ext: ['Cargar un clip con un imán y ver cuántos clips en cadena sostiene.', 'Hacer un laberinto con un imán por debajo de una cartulina.']
};

window.MAKER.plantas = {
  dur: '45 minutos (más seguimiento durante 2 semanas)', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesa con ventana luminosa para dejar los vasos',
  obj: 'Observar que una planta necesita agua, luz y aire para crecer y comparar qué pasa cuando falta alguno.',
  lab: 'Antes: «Cómo crece una planta» deja regar y dar luz. Después: comparar sus plantas reales con la simulación.',
  mat: [
    ['Vasos transparentes de plástico', '3 por equipo', 'Para ver las raíces'],
    ['Algodón o papel absorbente', '1 paquete por equipo', 'Cama de la semilla'],
    ['Semillas de fríjol o lenteja', '9 por equipo', 'Germinan rápido'],
    ['Agua y pulverizador o vasito', '1 por equipo', 'Riego'],
    ['Caja de cartón oscura', '1 por equipo', 'Plantita «sin luz»'],
    ['Marcadores y etiquetas', '3 por equipo', 'Rotular: con todo, sin agua, sin luz'],
    ['Regla pequeña de 15 cm', '1 por equipo', 'Medir crecimiento'],
    ['Hoja de seguimiento con 14 casillas', '1 por equipo', 'Un registro por día']
  ],
  herr: ['Lápices de colores', 'Cámara o dibujo para registro'],
  prep: ['Pon a remojar las semillas desde la noche anterior.', 'Prepara 3 vasos con algodón por equipo (rotulados).', 'Define un lugar con luz y otro oscuro (caja).', 'Asigna un «Cuidador» por turnos para los días siguientes.'],
  seg: ['Lavarse las manos después de tocar tierra, algodón o semillas.', 'Las semillas no se comen.', 'Mantener el agua lejos de enchufes.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿Qué necesita una semilla?', x: ['Muestra una semilla seca y una germinada.', 'Pregunta: «¿Qué creen que necesita para convertirse en planta?».'] },
    { f: 'Explorar', min: 15, t: 'Tres vasos, tres condiciones', x: ['Vaso 1: agua + luz. Vaso 2: luz pero sin agua. Vaso 3: agua pero dentro de la caja oscura.', 'Colocan 3 semillas en cada vaso sobre algodón (húmedo solo en 1 y 3).', 'Hacen su predicción: ¿cuál crecerá mejor?'] },
    { f: 'Explicar', min: 8, t: 'Lo que necesita una planta', x: ['Conversa sobre las predicciones: agua, luz, aire y tiempo.', 'Dibujan qué esperan ver en 3, 7 y 14 días.'] },
    { f: 'Elaborar', min: 12, t: 'Cuidamos y registramos', x: ['Cada día un cuidador riega y mide; dibujan lo que cambia.', 'Reto: hacer un gráfico de barras de la altura de cada plantita al final de la semana.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo concluye: «La planta que creció más fue ___ porque tuvo ___».', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué necesita una semilla para crecer?', '¿Qué pasó con la planta sin luz? ¿Y sin agua?', '¿Cuál fue la que más creció? ¿Por qué?'],
  rub: rub2(['Compara condiciones', 'No compara', 'Compara 2 vasos', 'Compara los 3 y concluye'], ['Registra el crecimiento', 'No registra', 'Registra algunos días', 'Registra con medidas y dibujos']),
  err: ['Creer que la planta «come» tierra.', 'Pensar que más agua siempre es mejor (se pudre).'],
  ext: ['Probar con otra semilla y otra posición de luz.', 'Sembrar una planta en maceta y llevarla a casa.']
};

window.MAKER['luz-sombra-2'] = {
  dur: '45 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Salón que se pueda oscurecer',
  obj: 'Modelar con una pelota y una linterna por qué vemos las fases de la Luna y ordenarlas.',
  lab: 'Antes: «Fases de la Luna» muestra las 8 fases y su orden. Después: comparar la secuencia del modelo con la de la pantalla.',
  mat: [
    ['Pelota blanca (poliestireno o de papel) en un palito', '1 por estudiante', 'La Luna'],
    ['Linterna fuerte o proyector', '1 por grupo grande', 'El Sol (fija)'],
    ['Hoja con círculo de 8 posiciones', '1 por equipo', 'Órbita para registrar'],
    ['Cartulina negra y círculos blancos de cartulina', '8 círculos por equipo', 'Cada fase'],
    ['Tijeras de punta redonda y pegante', '1 por equipo', 'Armar el calendario'],
    ['Cinta y marcadores', '1 rollo', 'Marcar el sentido de giro']
  ],
  herr: ['Lápices de colores', 'Hoja de registro de fases'],
  prep: ['Fija una linterna a la altura de la cabeza en un extremo del salón.', 'Oscurece el salón.', 'Prepara pelotas en palitos para todos.', 'Marca en el piso un círculo de 8 posiciones.'],
  seg: ['No apuntar la linterna a los ojos.', 'Moverse despacio y con cuidado en la penumbra.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿Siempre es igual la Luna?', x: ['Muestra fotos de la Luna en distintos días.', 'Pregunta: «¿Por qué cambia de forma?».'] },
    { f: 'Explorar', min: 15, t: 'Giramos la Luna', x: ['Cada niño sostiene su pelota frente a la linterna y gira lentamente sobre sí mismo.', 'Observan qué parte de la pelota está iluminada en cada posición.', 'Dibujan lo que ven en las 8 posiciones.'] },
    { f: 'Explicar', min: 8, t: 'Una mitad iluminada', x: ['Explica: la Luna siempre está iluminada por la mitad; nosotros vemos más o menos de esa mitad.', 'Nombra las fases: nueva, creciente, cuarto creciente, gibosa, llena...'] },
    { f: 'Elaborar', min: 12, t: 'Calendario lunar', x: ['Cada estudiante arma una tira de 8 círculos con las fases en orden.', 'Reto: predecir la fase que sigue a la Luna llena.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo coloca sus fases en orden en el piso.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿La Luna tiene luz propia?', '¿Por qué en algunas posiciones solo vemos una parte iluminada?', '¿Qué fase sigue a la Luna nueva?'],
  rub: rub2(['Explica las fases', 'No explica', 'Dice que cambia de forma', 'Dice que vemos distinta parte iluminada'], ['Ordena las fases', 'Ordena 2 o 3', 'Ordena la mayoría', 'Ordena las 8 fases']),
  err: ['Creer que la sombra de la Tierra produce las fases (eso son los eclipses).', 'Pensar que la Luna cambia de tamaño real.'],
  ext: ['Observar la Luna 5 noches y dibujarla.', 'Hacer una galleta Oreo de fases raspando la crema.']
};

window.MAKER['animales-ciclo'] = {
  dur: '45 minutos (con seguimiento opcional)', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas del Makerspace; zona de pegado y recorte',
  obj: 'Reconocer las cuatro etapas del ciclo de vida de la mariposa y ordenarlas con un modelo construido por el equipo.',
  lab: 'Antes: «La mariposa» enseña la secuencia huevo-oruga-crisálida-mariposa. Después: comparar el modelo del equipo con el del laboratorio.',
  mat: [
    ['Platos de cartón o cartulinas redondas', '4 por equipo', 'Un plato por etapa'],
    ['Pasta pequeña (arroz, lentejas), pasta larga, hojas de papel', 'Varios', 'Huevos, oruga, crisálida'],
    ['Limpiapipas o cordón verde', '3 por equipo', 'Oruga'],
    ['Pinturas témpera y pinceles', '1 caja por equipo', 'Alas de la mariposa'],
    ['Pegante y tijeras de punta redonda', '1 por equipo', 'Armar el ciclo'],
    ['Cuerda o lana', '1 m por equipo', 'Colgar el ciclo'],
    ['Tarjetas con los nombres de las etapas', '1 juego por equipo', 'Para ordenar']
  ],
  herr: ['Marcadores', 'Hojas de colores'],
  prep: ['Recorta platos y prepara los materiales de cada etapa.', 'Imprime las tarjetas de las 4 etapas.', 'Consigue una lámina o video corto del ciclo.'],
  seg: ['Tijeras: solo de punta redonda y con supervisión.', 'Témpera no tóxica; lavar las manos.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'Una oruga que cambia', x: ['Muestra la lámina de una oruga y una mariposa.', 'Pregunta: «¿Son el mismo animal? ¿Cómo cambió?».'] },
    { f: 'Explorar', min: 12, t: 'Ordenamos las etapas', x: ['Cada equipo recibe las 4 tarjetas mezcladas y las ordena en el círculo de platos.', 'Comparan con el equipo vecino y corrigen.'] },
    { f: 'Explicar', min: 8, t: 'Ciclo de vida', x: ['Huevo → oruga → crisálida → mariposa adulta.', 'Pregunta: «¿Qué hace la oruga? (comer y crecer) ¿Qué pasa dentro de la crisálida?» (se transforma).'] },
    { f: 'Elaborar', min: 15, t: 'Modelo del ciclo', x: ['En cada plato construyen una etapa con los materiales: huevos con pasta, oruga con limpiapipas, crisálida con papel doblado, mariposa con témpera.', 'Cuelgan los platos en círculo con lana.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo cuenta el ciclo con sus platos: «Primero…, luego…, después…, al final…».', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué etapa viene después del huevo?', '¿Qué come la oruga?', '¿Qué pasa dentro de la crisálida?'],
  rub: rub2(['Ordena el ciclo', 'Ordena 1 o 2 etapas', 'Ordena 3 etapas', 'Ordena las 4'], ['Construye el modelo', 'Incompleto', 'Tiene 3 etapas', 'Tiene las 4 con detalles']),
  err: ['Creer que la oruga y la mariposa son animales distintos.', 'Pensar que la crisálida es un «huevo».'],
  ext: ['Comparar con el ciclo de la rana.', 'Plantar flores para atraer mariposas.']
};

window.MAKER.rampas = {
  dur: '50 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas con espacio para rampas de 60 cm',
  obj: 'Descubrir cómo la inclinación de una rampa y el tipo de superficie (fricción) cambian cuánto avanza un objeto.',
  lab: 'Antes: «Rampas y fricción» permite probar superficies e inclinaciones. Después: comparar sus mediciones con las del laboratorio.',
  mat: [
    ['Tablas o cartones rígidos de 60 cm', '1 por equipo', 'La rampa'],
    ['Libros para elevar', '5 por equipo', 'Cambiar la inclinación'],
    ['Superficies: lija, papel de aluminio, tela, papel de cuaderno', '4 por equipo', 'Pegadas con cinta a la rampa'],
    ['Carros de juguete o cajas pequeñas', '1 por equipo', 'Objeto que baja'],
    ['Cinta métrica o regla', '1 por equipo', 'Medir distancia'],
    ['Cinta de enmascarar', '1 rollo', 'Fijar superficies'],
    ['Hoja de registro (rampa · distancia)', '1 por equipo', 'Tabla de 3 intentos']
  ],
  herr: ['Marcadores', 'Cronómetro (opcional)'],
  prep: ['Cada equipo arma la rampa apoyada en libros.', 'Pega las superficies en tiras separadas.', 'Marca una línea de salida en la rampa.'],
  seg: ['Libros bien apoyados para que no caigan.', 'Cuidar los pies al lado de la rampa.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'Resbala o no resbala', x: ['Frota un papel y una lija con la mano.', 'Pregunta: «¿Cuál sentirías más resbaladiza? ¿Por qué?».'] },
    { f: 'Explorar', min: 18, t: 'Probamos superficies', x: ['Sueltan el carro desde la misma altura sobre cada superficie.', 'Miden cuánto avanza después de la rampa y anotan.', 'Repiten 3 veces y buscan la superficie que hace llegar más lejos.'] },
    { f: 'Explicar', min: 7, t: 'La fricción', x: ['Explica fricción como el roce que frena.', 'Pregunta: «¿Qué pasa con una lija? ¿Y con el aluminio?».'] },
    { f: 'Elaborar', min: 12, t: 'Cambiamos la inclinación', x: ['Suben la rampa con más libros y repiten con la mejor superficie.', 'Reto: lograr que el carro llegue a una línea marcada a 1 metro.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo comparte: «Con más inclinación el carro…» y «Con más fricción el carro…».', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué superficie frenó más al carro?', '¿Qué pasó cuando subimos la rampa?', '¿Cómo podemos hacer que el carro llegue más lejos?'],
  rub: rub2(['Controla una variable', 'Cambia varias cosas a la vez', 'Cambia una con ayuda', 'Cambia una cosa a la vez'], ['Explica la fricción', 'No la explica', 'Dice que frena', 'Relaciona rugosidad y frenado']),
  err: ['Soltar el carro con empujón distinto cada vez.', 'Creer que lo pesado «siempre» llega más lejos.'],
  ext: ['Probar con un objeto más pesado.', 'Hacer una tabla con 3 inclinaciones y 3 superficies.']
};

window.MAKER.estaciones = {
  dur: '45 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas con papel grande en el centro',
  obj: 'Reconocer las cuatro estaciones por los cambios en el árbol, el clima y las actividades, y ordenarlas en un ciclo.',
  lab: 'Antes: «Las estaciones» muestra el árbol cambiando en el año. Después: comparar el mural con la simulación.',
  mat: [
    ['Cartulina grande o círculo de 60 cm dividido en 4', '1 por equipo', 'Rueda de las estaciones'],
    ['Papel de colores (verde, amarillo, naranja, blanco, rosa)', 'Varios', 'Hojas y flores'],
    ['Algodón', '1 bolsa por equipo', 'Nieve'],
    ['Tijeras de punta redonda y pegante', '1 por equipo', 'Collage'],
    ['Palito y broche (para la flecha giratoria)', '1 por equipo', 'Ruleta'],
    ['Tarjetas de actividades (nadar, tejer, cosechar, sembrar)', '8 por equipo', 'Clasificar por estación'],
    ['Marcadores y crayones', '1 caja por equipo', 'Colorear']
  ],
  herr: ['Regla', 'Hojas de recorte'],
  prep: ['Divide los círculos en 4 sectores y rotula cada uno.', 'Corta tiras de colores y hojas.', 'Imprime las tarjetas de actividades.'],
  seg: ['Tijeras de punta redonda con supervisión.', 'Pegante en barra, sin ingerir.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'El árbol del patio', x: ['Muestra fotos de un árbol en las cuatro estaciones.', 'Pregunta: «¿Qué cambió? ¿Qué creen que lo causa?».'] },
    { f: 'Explorar', min: 12, t: 'Armamos la rueda', x: ['Cada equipo arma un árbol por estación en su sector con papel y algodón.', 'Colocan la flecha y giran la ruleta.'] },
    { f: 'Explicar', min: 8, t: 'Cuatro estaciones', x: ['Primavera, verano, otoño e invierno: cambios en el clima, el árbol y las personas.', 'Aclara que en Colombia casi no hay estaciones, pero sí épocas de lluvia y sequía.'] },
    { f: 'Elaborar', min: 15, t: 'Actividades del año', x: ['Ubican las tarjetas de actividades en la estación adecuada.', 'Reto: inventar una actividad nueva para cada estación.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo presenta su rueda y dice una diferencia entre dos estaciones.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué estación viene después del invierno?', '¿Por qué el árbol pierde las hojas?', '¿Qué hacemos en un día de mucho calor?'],
  rub: rub2(['Ordena las estaciones', 'Ordena menos de 3', 'Ordena 3', 'Ordena las 4 y explica'], ['Relaciona actividades', 'Ubica 1 o 2', 'Ubica la mitad', 'Ubica casi todas']),
  err: ['Creer que el verano es «cuando el Sol está más cerca».', 'Pensar que en todos los lugares hay las mismas estaciones.'],
  ext: ['Comparar con las épocas de lluvia y sequía de nuestra región.', 'Observar un árbol del colegio durante un mes.']
};

window.MAKER.reciclaje = {
  dur: '50 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas con zona de clasificación y un punto de recolección',
  obj: 'Separar residuos en la caneca correcta y aplicar las 3 erres (reducir, reutilizar, reciclar) construyendo un objeto nuevo.',
  lab: 'Antes: «A reciclar» enseña las canecas y las 3 erres. Después: comparar la clasificación real con la del juego.',
  mat: [
    ['Residuos limpios y secos: papel, cartón, botellas PET, latas, vidrio, empaques', '15 por equipo', 'Preferiblemente traídos desde casa'],
    ['Canecas o cajas rotuladas (blanca, negra, verde, azul)', '1 juego por equipo', 'Según el código de color de tu ciudad'],
    ['Cajas de cartón, botellas, tapas', 'Varios', 'Para construir un objeto nuevo'],
    ['Cinta, pegante, tijeras de punta redonda', '1 por equipo', 'Armar'],
    ['Pinturas témpera y pinceles', '1 caja por equipo', 'Decorar'],
    ['Guantes desechables', '1 par por estudiante', 'Al manipular residuos'],
    ['Báscula pequeña o balanza (opcional)', '1', 'Pesar el residuo']
  ],
  herr: ['Marcadores', 'Hojas de colores'],
  prep: ['Pide a las familias residuos limpios con una semana de antelación.', 'Revisa que no haya vidrio roto ni latas filosas.', 'Prepara cuatro canecas con rótulos y colores.', 'Aparta cartón y botellas para el reto de construcción.'],
  seg: ['Solo residuos limpios y secos; nada de vidrio roto ni latas con bordes filosos.', 'Usar guantes y lavarse las manos.', 'Tijeras solo con supervisión.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿A dónde va la basura?', x: ['Muestra un montón de residuos y pregunta: «¿A dónde deberían ir?».', 'Presenta las 3 erres con gestos: Reducir (menos), Reutilizar (usar otra vez), Reciclar (convertir).'] },
    { f: 'Explorar', min: 12, t: 'Clasificamos', x: ['Cada equipo separa sus residuos en las canecas rotuladas.', 'Revisan juntos y corrigen errores.', 'Pesan o cuentan cuánto reciclable hay.'] },
    { f: 'Explicar', min: 8, t: 'Las 3 erres', x: ['Pregunta: «¿Cómo podemos reducir? ¿Qué podemos reutilizar?».', 'Relaciona cada caneca con el material correspondiente.'] },
    { f: 'Elaborar', min: 20, t: 'De residuo a objeto', x: ['Cada equipo construye un objeto útil: porta lápices, juguete, maceta o instrumento con residuos limpios.', 'Debe usar al menos 3 materiales reciclados.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo presenta su creación y dice qué erre aplicó.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué residuo se puede reutilizar en casa?', '¿Por qué es importante separar los residuos?', '¿Cómo podemos producir menos basura?'],
  rub: rub2(['Clasifica los residuos', 'Acierta menos de la mitad', 'Acierta la mitad', 'Acierta casi todos'], ['Aplica las 3 erres', 'No las menciona', 'Nombra 1 o 2', 'Aplica y explica las 3']),
  err: ['Poner residuos sucios en la caneca de reciclaje.', 'Creer que reciclar sirve más que reducir.'],
  ext: ['Hacer un punto de reciclaje en el salón.', 'Medir cuánta basura produce el curso en un día.']
};

window.MAKER['empujar-halar'] = {
  dur: '45 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Piso liso o mesas con espacio para mover cajas',
  obj: 'Descubrir que empujar y halar son fuerzas y que más fuerza o menos peso cambia cuánto se mueve un objeto.',
  lab: 'Antes: «Empujar y halar» permite mover cajas con distinta fuerza. Después: comparar con lo medido en el Makerspace.',
  mat: [
    ['Cajas pequeñas de cartón', '3 por equipo', 'Livianas, medianas y pesadas'],
    ['Objetos para llenar las cajas (bloques, libros)', '5 por equipo', 'Cambiar el peso'],
    ['Cuerda o lana (1 m)', '2 por equipo', 'Para halar'],
    ['Carritos de juguete', '1 por equipo', 'Empujar'],
    ['Cinta de enmascarar y regla', '1 rollo', 'Marcar la salida y medir'],
    ['Resorte o banda elástica gruesa', '1 por equipo', 'Fuerza medida'],
    ['Hoja de registro (caja · empujar o halar · distancia)', '1 por equipo', 'Tabla de resultados']
  ],
  herr: ['Marcadores', 'Cinta métrica'],
  prep: ['Marca una línea de salida con cinta.', 'Prepara 3 cajas con distinto peso.', 'Despeja el piso de obstáculos.'],
  seg: ['Cuidado con los dedos al atar la cuerda.', 'No halar fuerte a otros compañeros.', 'Zapatos cerrados.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿Empujo o halo?', x: ['Pide a un voluntario abrir una puerta de un empujón y un cajón halándolo.', 'Pregunta: «¿Qué hicimos para mover la puerta y el cajón?».'] },
    { f: 'Explorar', min: 15, t: 'Movemos cajas', x: ['Cada equipo empuja y hala la caja liviana, mediana y pesada.', 'Miden cuánto se mueve con un empujón pequeño y con uno grande.', 'Anotan qué cambia.'] },
    { f: 'Explicar', min: 8, t: 'Fuerzas', x: ['Fuerza = empujar o halar. Más fuerza, más movimiento; más peso, menos movimiento.', 'Pregunta: «¿Por qué cuesta más mover la caja pesada?».'] },
    { f: 'Elaborar', min: 12, t: 'Reto de carreras', x: ['Con el mismo empujón, ¿qué caja llega más lejos?', 'Reto: llevar una caja a una meta marcada usando solo la fuerza justa.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo dice: «Para mover algo más pesado necesitamos…».', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Cuándo es mejor empujar? ¿Y halar?', '¿Qué pasa si la caja pesa más?', '¿Cómo podemos mover algo grande entre varios?'],
  rub: rub2(['Diferencia empujar y halar', 'No los distingue', 'Distingue con ayuda', 'Distingue y da ejemplos'], ['Relaciona fuerza y peso', 'No lo relaciona', 'Dice que pesa más', 'Dice que necesita más fuerza']),
  err: ['Creer que las fuerzas «se acaban» al soltar el objeto.', 'Pensar que solo se empuja con las manos.'],
  ext: ['Probar a mover la caja sobre distintas superficies.', 'Hacer una carrera de carritos con rampas.']
};

window.MAKER.alimentos = {
  dur: '45 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas limpias; lavamanos cercano',
  obj: 'Armar un plato equilibrado con alimentos de varios grupos y reconocer cuáles se comen todos los días y cuáles de vez en cuando.',
  lab: 'Antes: «Alimentos saludables» deja armar el plato en pantalla. Después: comparar el plato real con el del laboratorio.',
  mat: [
    ['Platos de cartón o desechables', '1 por estudiante', 'Para armar el plato'],
    ['Recortes de alimentos (revistas o impresos)', '20 por equipo', 'Frutas, verduras, cereales, proteínas, dulces y fritos'],
    ['Alimentos reales para observar (fruta, pan, huevo)', '1 de cada grupo', 'Solo si se confirma que no hay alergias'],
    ['Pegante y tijeras de punta redonda', '1 por equipo', 'Armar el plato'],
    ['Cartulina dividida en 4 grupos', '1 por equipo', 'Frutas y verduras, cereales, proteínas y lácteos, dulces/fritos'],
    ['Marcadores y crayones', '1 caja por equipo', 'Colorear'],
    ['Toallas húmedas', 'Varias', 'Limpieza']
  ],
  herr: ['Hoja con el «plato saludable» de referencia', 'Lápices de colores'],
  prep: ['Confirma alergias antes de mostrar alimentos reales; si hay dudas, usa solo recortes.', 'Imprime recortes de alimentos y mezcla por equipo.', 'Prepara las cartulinas de los 4 grupos.'],
  seg: ['Alergias alimentarias: confirmar antes de cualquier alimento real.', 'Lavar manos antes y después.', 'No probar lo que no sea alimento de la estación.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿Qué hay en tu desayuno?', x: ['Cada niño dibuja su desayuno en una tarjeta.', 'Pregunta: «¿Cuántos colores hay en tu plato?».'] },
    { f: 'Explorar', min: 15, t: 'Clasificamos alimentos', x: ['Cada equipo clasifica los recortes en los 4 grupos.', 'Revisan juntos: ¿hay alguno que cambie de grupo?'] },
    { f: 'Explicar', min: 8, t: 'Plato equilibrado', x: ['Frutas y verduras dan vitaminas; cereales dan energía; proteínas ayudan a crecer; los dulces se comen poco.', 'Pregunta: «¿Qué ponemos más en el plato? ¿Qué menos?».'] },
    { f: 'Elaborar', min: 12, t: 'Armamos nuestro plato', x: ['Cada estudiante pega en su plato un menú con al menos un alimento de cada grupo saludable.', 'Reto: crear un menú saludable para un cumpleaños.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada niño presenta su plato y explica una elección.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué alimentos nos dan energía?', '¿Por qué no comemos solo dulces?', '¿Qué alimentos de colores comemos en casa?'],
  rub: rub2(['Clasifica los alimentos', 'Acierta pocos', 'Acierta la mitad', 'Acierta casi todos'], ['Arma un plato equilibrado', 'Solo un grupo', 'Dos grupos', 'Los tres grupos saludables y poco dulce']),
  err: ['Creer que «saludable» es solo comer verduras.', 'Pensar que los jugos azucarados equivalen a fruta.'],
  ext: ['Hacer una brocheta de frutas en casa con ayuda.', 'Preparar un mural de «mi plato favorito saludable».']
};

window.MAKER['partes-animales'] = {
  dur: '45 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas del Makerspace; zona de pegado',
  obj: 'Relacionar partes de los animales (alas, aletas, patas, pico, caparazón) con su función y construir un animal con partes adecuadas.',
  lab: 'Antes: «Partes de los animales» muestra para qué sirve cada parte. Después: comparar el animal construido con el del laboratorio.',
  mat: [
    ['Tarjetas de animales (pájaro, pez, perro, tortuga)', '1 juego por equipo', 'Con partes señaladas'],
    ['Cartulinas de colores y papel crepé', 'Varios', 'Alas, aletas, caparazón'],
    ['Palitos de helado, limpiapipas, plumas', 'Varios', 'Patas, picos'],
    ['Pegante y tijeras de punta redonda', '1 por equipo', 'Armar'],
    ['Plato de cartón', '1 por equipo', 'Cuerpo del animal'],
    ['Marcadores y ojos móviles', '1 por equipo', 'Detalles'],
    ['Hoja con tabla: parte · para qué sirve', '1 por equipo', 'Registro']
  ],
  herr: ['Lápices de colores', 'Regla'],
  prep: ['Imprime las tarjetas de animales con las partes marcadas.', 'Prepara cartulinas pre-cortadas en formas de alas y aletas.', 'Pega un modelo en la pared como ejemplo.'],
  seg: ['Tijeras de punta redonda con supervisión.', 'Plumas: lavar las manos al terminar.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'Parte misteriosa', x: ['Muestra una pluma, una aleta de goma y un caparazón.', 'Pregunta: «¿A qué animal pertenece? ¿Para qué le sirve?».'] },
    { f: 'Explorar', min: 12, t: 'Emparejamos partes', x: ['Cada equipo une la parte con el animal y con su función.', 'Completan la tabla: ala → volar, aleta → nadar, patas → caminar...'] },
    { f: 'Explicar', min: 8, t: 'Cada parte cumple una función', x: ['Alas: volar. Aletas: nadar. Patas: caminar o correr. Pico: comer. Caparazón: protegerse.', 'Pregunta: «¿Qué pasaría si un pez tuviera patas?».'] },
    { f: 'Elaborar', min: 15, t: 'Construimos un animal', x: ['Cada equipo elige un ambiente y construye un animal con partes que le sirvan para vivir allí.', 'Debe dibujar o pegar una etiqueta con las partes y su función.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo presenta su animal: «Tiene ___ para ___».', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Para qué sirven las aletas?', '¿Qué parte ayuda a la tortuga a protegerse?', '¿Qué parte necesitaría un animal que vive en el hielo?'],
  rub: rub2(['Relaciona parte y función', 'Relaciona 1 o 2', 'Relaciona la mitad', 'Relaciona casi todas'], ['Construye el animal', 'Incompleto', 'Con partes pero sin función', 'Con partes y función explicadas']),
  err: ['Creer que todas las aves vuelan (pingüino, avestruz).', 'Pensar que los animales eligen sus partes.'],
  ext: ['Inventar un animal para un planeta imaginario.', 'Buscar animales con la misma parte pero distinta función.']
};
