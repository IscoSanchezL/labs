/* Guías Makerspace · Grado 3° (ver plantilla en makerspace.js) */
window.MAKER = window.MAKER || {};
function rub3(a, b) { return [a, b, ['Registra datos', 'Registro incompleto', 'Registra lo principal', 'Registra con tabla y unidades claras'], ['Trabajo en equipo', 'Trabaja solo/a', 'Cumple su rol con recordatorios', 'Cumple su rol y ayuda a los demás']]; }

window.MAKER.mezclas = {
  dur: '50 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas con lavamanos y bandejas para derrames',
  obj: 'Distinguir mezclas y disoluciones probando qué sustancias se disuelven en agua y comprobar que algunas mezclas se pueden separar.',
  lab: 'Antes: «Mezclas y disoluciones» deja probar sal, azúcar, arena y aceite en pantalla. Después: contrastar lo observado con la simulación.',
  mat: [
    ['Vasos transparentes de plástico', '6 por equipo', 'Uno por sustancia'],
    ['Agua a temperatura ambiente', '1 jarra por equipo', 'Mismo volumen en cada vaso (100 mL)'],
    ['Sal, azúcar, arena, aceite, harina, jugo en polvo', '1 cucharadita de cada una', 'Mezclas y disoluciones'],
    ['Cucharas o palitos', '6 por equipo', 'Una por vaso para no contaminar'],
    ['Filtros de café o papel filtro + embudo', '2 por equipo', 'Separar por filtración'],
    ['Lupas', '1 por equipo', 'Observar partículas'],
    ['Cronómetro', '1 por equipo', 'Medir el tiempo de disolución'],
    ['Hoja de registro', '1 por equipo', 'Tabla: sustancia · ¿se disuelve? · observación']
  ],
  herr: ['Marcadores', 'Probeta o vaso medidor'],
  prep: ['Prepara porciones de cada sustancia en recipientes rotulados.', 'Mide 100 mL de agua por vaso con un vaso medidor.', 'Cubre las mesas con plástico.', 'Define roles: Medidor, Mezclador, Cronometrista y Anotador.'],
  seg: ['No probar ni oler directamente ninguna sustancia.', 'Derrames de aceite: limpiar de inmediato (resbalan).', 'Lavado de manos al terminar.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿Desaparece la sal?', x: ['Echa sal en un vaso de agua y revuelve delante de todos.', 'Pregunta: «¿Dónde fue la sal? ¿Cómo podemos comprobar si sigue allí?».'] },
    { f: 'Explorar', min: 18, t: 'Probamos 6 sustancias', x: ['Cada equipo predice si cada sustancia se disolverá y lo anota.', 'Agregan una cucharadita a cada vaso, revuelven 20 segundos y observan.', 'Registran si queda transparente, turbio o con residuos.'] },
    { f: 'Explicar', min: 8, t: 'Disolución y mezcla', x: ['Disolución: se ve una sola fase (sal, azúcar). Mezcla: se distinguen partes (arena, aceite).', 'Introduce soluto y disolvente.', 'Pregunta: «¿Cómo recuperarías la arena? ¿Y la sal?».'] },
    { f: 'Elaborar', min: 14, t: 'Separamos mezclas', x: ['Filtran la mezcla de arena y agua.', 'Reto: separar sal del agua evaporando una muestra sobre un plato al sol o junto a una ventana.', 'Comparan lo que queda en el filtro y en el plato.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo completa: «Se disuelve ___ pero no ___ porque ___».', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué sustancias se disolvieron? ¿Cuáles no?', '¿En qué se parece la disolución de sal y la de azúcar?', '¿Cómo separarías arena y agua? ¿Y sal y agua?'],
  rub: rub3(['Predice y compara', 'No predice', 'Predice sin comparar', 'Predice, prueba y compara'], ['Distingue mezcla y disolución', 'No distingue', 'Distingue un caso', 'Distingue y da ejemplos']),
  err: ['Creer que lo disuelto «desapareció».', 'Confundir disolver con derretir.'],
  ext: ['Probar agua fría vs. tibia y ver si cambia la rapidez.', 'Hacer cromatografía de tinta de marcador en papel filtro.']
};

window.MAKER['ciclo-agua'] = {
  dur: '50 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesa cerca de ventana con sol',
  obj: 'Modelar la evaporación, condensación y precipitación con un terrario o bolsa y explicar el recorrido del agua.',
  lab: 'Antes: «El ciclo del agua» sigue la gota paso a paso. Después: comparar el modelo real con la simulación.',
  mat: [
    ['Bolsas sellables transparentes (tipo Ziploc)', '1 por equipo', 'Mini ciclo del agua'],
    ['Agua y colorante azul', '1/4 de taza por equipo', 'Para ver el agua'],
    ['Marcador permanente', '1 por equipo', 'Dibujar sol y nubes en la bolsa'],
    ['Cinta transparente', '1 rollo', 'Pegar la bolsa a la ventana'],
    ['Plato hondo, vaso y film plástico', '1 juego por equipo', 'Terrario alternativo'],
    ['Cubos de hielo', '3 por equipo', 'Enfriar el film y ver condensar'],
    ['Hoja con diagrama del ciclo', '1 por estudiante', 'Para dibujar y rotular']
  ],
  herr: ['Lápices de colores', 'Cronómetro'],
  prep: ['Prepara agua con colorante.', 'Pega bolsas a una ventana con luz.', 'Ten hielo en un termo.'],
  seg: ['Agua tibia solamente.', 'Cuidar derrames cerca de enchufes.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'La gota viajera', x: ['Pregunta: «¿A dónde se fue el charco de ayer?».', 'Muestra una bolsa sellada con gotas ya formadas.'] },
    { f: 'Explorar', min: 15, t: 'Armamos el modelo', x: ['En cada bolsa: 1/4 de taza de agua con colorante, dibujan un sol y una nube con marcador y sellan.', 'La pegan a la ventana y marcan la hora.', 'Con un vaso con agua tibia y film con hielo encima observan las gotas formarse bajo el film.'] },
    { f: 'Explicar', min: 10, t: 'Cuatro pasos', x: ['Evaporación (sol), condensación (nubes), precipitación (lluvia), recolección (ríos y mares).', 'Relaciona cada paso con lo que se vio en la bolsa.'] },
    { f: 'Elaborar', min: 15, t: 'Diagrama y predicción', x: ['Cada estudiante dibuja el ciclo con flechas y rótulos.', 'Reto: predecir qué pasa si la bolsa se mueve a la sombra.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo cuenta el ciclo con sus palabras.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Dónde se ve la evaporación en la bolsa?', '¿Por qué se forman las gotas arriba?', '¿Cómo vuelve el agua al río?'],
  rub: rub3(['Explica el ciclo', 'Nombra 1 paso', 'Nombra 2 o 3 pasos', 'Explica los 4 pasos'], ['Diagrama con rótulos', 'Incompleto', 'Con 3 etapas', 'Con 4 etapas y flechas']),
  err: ['Creer que la lluvia sale «de un agujero» en las nubes.', 'Pensar que el agua se «gasta».'],
  ext: ['Medir el agua que se evapora en un recipiente abierto en 3 días.', 'Hacer lluvia ácida simulada con agua y limón.']
};

window.MAKER.electricidad = {
  dur: '50 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas despejadas; sin agua cerca',
  obj: 'Armar un circuito simple, encender un bombillo y clasificar materiales como conductores o aislantes.',
  lab: 'Antes: «Circuito eléctrico» permite cerrar el circuito y probar materiales. Después: comparar con montajes reales.',
  mat: [
    ['Pilas AA (1,5 V) con portapilas', '2 por equipo', 'Usar pilas, nunca la red eléctrica'],
    ['Bombillos o LED con portabombillo', '2 por equipo', 'LED con resistencia'],
    ['Cables con caimanes', '4 por equipo', 'Conexiones'],
    ['Interruptor simple (pulsador)', '1 por equipo', 'Abrir y cerrar'],
    ['Objetos para probar: clip, moneda, goma, lápiz, plástico, aluminio, madera', '8 por equipo', 'Conductores y aislantes'],
    ['Cinta aislante', '1 rollo', 'Fijar'],
    ['Hoja de registro', '1 por equipo', 'Material · ¿enciende?']
  ],
  herr: ['Pinzas de punta (docente)', 'Lápiz y regla'],
  prep: ['Revisa pilas y cables; prepara kits por equipo.', 'Retira cargadores y baterías de otras fuentes.', 'Explica el circuito con una lámina antes de entregar materiales.'],
  seg: ['Solo pilas pequeñas; nunca conectar a enchufes.', 'No cortocircuitar la pila con un cable directo (se calienta).', 'No dejar el circuito encendido mucho tiempo.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿Cómo se enciende una luz?', x: ['Muestra un bombillo, una pila y un cable. Pregunta: «¿Cómo lo encendemos?». Deja que prueben 1 minuto.'] },
    { f: 'Explorar', min: 18, t: 'Armamos el circuito', x: ['Conectan pila, cable y bombillo hasta que encienda.', 'Dibujan el recorrido de la corriente.', 'Cambian un cable por distintos objetos y anotan si enciende.'] },
    { f: 'Explicar', min: 8, t: 'Circuito cerrado', x: ['Circuito cerrado = camino completo. Conductores (metales) dejan pasar la corriente; aislantes (plástico, madera) no.', 'Introduce el interruptor como puente que abre y cierra.'] },
    { f: 'Elaborar', min: 14, t: 'Serie y paralelo', x: ['Conectan dos bombillos uno tras otro (serie) y comparan el brillo.', 'Reto: conectar un interruptor para encenderlo y apagarlo.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo dice: «El circuito funciona cuando ___».', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué pasa si se desconecta un cable?', '¿Qué materiales dejaron pasar la corriente?', '¿Por qué los cables se cubren de plástico?'],
  rub: rub3(['Arma el circuito', 'No lo logra', 'Lo logra con ayuda', 'Lo logra y lo dibuja'], ['Clasifica materiales', 'Acierta menos de la mitad', 'Acierta la mitad', 'Acierta casi todos y explica']),
  err: ['Conectar solo un cable por bombillo.', 'Creer que todos los metales brillan igual al conducir.'],
  ext: ['Hacer un interruptor con papel de aluminio y clip.', 'Probar bombillos en serie y paralelo y comparar.']
};

window.MAKER.palancas = {
  dur: '50 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas amplias',
  obj: 'Descubrir cómo funciona una palanca (punto de apoyo, fuerza y carga) y cómo mover el apoyo cambia el esfuerzo necesario.',
  lab: 'Antes: «Palancas» equilibra balancines. Después: contrastar con una palanca de regla real.',
  mat: [
    ['Reglas de 30 cm o tablas de madera', '2 por equipo', 'Brazo de la palanca'],
    ['Lápiz hexagonal, goma o tubo de cartón', '1 por equipo', 'Punto de apoyo'],
    ['Monedas del mismo valor', '20 por equipo', 'Pesas'],
    ['Cinta de enmascarar', '1 rollo', 'Fijar'],
    ['Cucharas, tijeras o tenazas de cocina para observar palancas cotidianas', '1 de cada', 'Ejemplos'],
    ['Hoja de registro', '1 por equipo', 'Posición del apoyo · monedas']
  ],
  herr: ['Regla milimetrada', 'Marcadores'],
  prep: ['Marca el centro de cada regla.', 'Cuenta 20 monedas por equipo.', 'Prepara 3 ejemplos de palancas de la vida diaria.'],
  seg: ['Cuidar que las monedas no se caigan al piso.', 'No usar tijeras abiertas sin supervisión.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'Levantar con poco esfuerzo', x: ['Intenta levantar un libro pesado con la mano y luego con una regla sobre un lápiz.', 'Pregunta: «¿Qué cambió?».'] },
    { f: 'Explorar', min: 18, t: 'Equilibramos la regla', x: ['Colocan 5 monedas a un lado y buscan la posición de 5 monedas del otro lado que equilibre.', 'Repiten con 3 y 5 monedas, 4 y 4... y registran distancias al apoyo.', 'Mueven el apoyo y vuelven a equilibrar.'] },
    { f: 'Explicar', min: 8, t: 'Ley de la palanca', x: ['Fuerza × distancia al apoyo es igual a cada lado.', 'Cuanto más lejos del apoyo, menos fuerza hace falta.'] },
    { f: 'Elaborar', min: 14, t: 'Reto de la carga pesada', x: ['Con 2 monedas lejos del apoyo, levantar 6 monedas cerca.', 'Reto: encontrar tres ejemplos de palancas en el salón y clasificarlos.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo completa: «Para levantar más peso con menos fuerza ___».', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué pasa si acercas la carga al apoyo?', '¿Dónde es más fácil empujar: lejos o cerca del apoyo?', '¿Qué objetos del salón son palancas?'],
  rub: rub3(['Equilibra la palanca', 'No logra equilibrar', 'Equilibra una vez', 'Equilibra varios casos'], ['Relaciona fuerza y distancia', 'No la relaciona', 'Dice que influye', 'Explica la relación']),
  err: ['Creer que solo importa el peso, sin la distancia.', 'Pensar que todas las palancas son balancines.'],
  ext: ['Hacer una catapulta de cuchara y medir distancias.', 'Calcular fuerza × distancia con números.']
};

window.MAKER.esqueleto = {
  dur: '50 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas del Makerspace',
  obj: 'Construir un modelo de brazo con hueso y músculos para explicar cómo se mueve el cuerpo.',
  lab: 'Antes: «Huesos y músculos» muestra bíceps y tríceps. Después: comparar el modelo con el laboratorio.',
  mat: [
    ['Cartón grueso (tiras de 3×25 cm)', '2 por equipo', 'Huesos del brazo'],
    ['Broche mariposa', '1 por equipo', 'Codo'],
    ['Globos alargados', '2 por equipo', 'Músculos'],
    ['Cuerda o lana', '1 m por equipo', 'Tendones'],
    ['Pajillas', '4 por equipo', 'Guías'],
    ['Cinta y pegante', '1 rollo', 'Fijar'],
    ['Silueta del brazo (impresa)', '1 por equipo', 'Rotular'],
    ['Hoja de registro', '1 por equipo', 'Movimiento · músculo que se contrae']
  ],
  herr: ['Perforadora (docente)', 'Marcadores'],
  prep: ['Corta las tiras y perfora los extremos.', 'Prepara una demostración del modelo armado.', 'Infla los globos antes de la clase.'],
  seg: ['Cuidado con globos: algunos niños pueden ser alérgicos al látex (usar alternativas).', 'Tijeras solo para el docente.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'Doblar el brazo', x: ['Pide que doblen y estiren el brazo con la mano en el bíceps.', 'Pregunta: «¿Qué sentiste endurecerse?».'] },
    { f: 'Explorar', min: 18, t: 'Armamos el brazo', x: ['Unen dos tiras con el broche (codo).', 'Pegan un globo arriba (bíceps) y otro abajo (tríceps) con cuerda a los extremos.', 'Tiran de la cuerda del bíceps: el brazo se dobla.'] },
    { f: 'Explicar', min: 8, t: 'Músculos en pareja', x: ['Los músculos tiran, no empujan; por eso trabajan en pareja.', 'Cuando uno se contrae, el otro se relaja.'] },
    { f: 'Elaborar', min: 14, t: 'Mejoramos el modelo', x: ['Reto: hacer que el brazo levante un objeto pequeño.', 'Dibujan los músculos en una silueta y rotulan.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo explica cómo mueve su modelo y qué músculo se contrae.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué músculo dobla el brazo? ¿Cuál lo estira?', '¿Por qué los músculos trabajan en pareja?', '¿Qué función tienen los huesos?'],
  rub: rub3(['Explica la pareja bíceps-tríceps', 'No la explica', 'Nombra uno', 'Explica los dos'], ['Construye el modelo', 'No lo termina', 'Lo termina con ayuda', 'Funciona y lo mejora']),
  err: ['Creer que los músculos empujan los huesos.', 'Pensar que los huesos se mueven solos.'],
  ext: ['Modelar una pierna con músculos y rodilla.', 'Contar cuántos huesos tiene la mano.']
};

window.MAKER['luz-reflejo'] = {
  dur: '50 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Salón oscurecido',
  obj: 'Comprobar que la luz se refleja con el mismo ángulo con que llega y usar espejos para dirigir un rayo.',
  lab: 'Antes: «Espejos y reflexión» pide dirigir un rayo al blanco. Después: repetir el reto con espejos reales.',
  mat: [
    ['Espejos pequeños de plástico o lámina reflectiva', '2 por equipo', 'Con base de plastilina'],
    ['Linterna o puntero de baja potencia con rendija', '1 por equipo', 'Rayo delgado: cartón con ranura'],
    ['Hojas con semicírculo graduado', '1 por equipo', 'Medir ángulos'],
    ['Cartulina con un blanco dibujado', '1 por equipo', 'Meta'],
    ['Plastilina', '1 barra', 'Sostener espejos'],
    ['Cinta y marcadores', '1 rollo', 'Marcar posiciones']
  ],
  herr: ['Transportador', 'Regla'],
  prep: ['Prepara linternas con una tira de cartón con ranura delante.', 'Oscurece el salón.', 'Coloca blancos a 40–60 cm de la linterna.'],
  seg: ['No apuntar linternas a los ojos.', 'Usar punteros láser solo con control del docente.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'Luz que rebota', x: ['Con un espejo, proyecta un reflejo en el techo.', 'Pregunta: «¿Cómo cambiaría si inclino el espejo?».'] },
    { f: 'Explorar', min: 15, t: 'Ángulo de incidencia', x: ['Cada equipo dibuja una línea normal y ubica el espejo.', 'Emiten el rayo con varios ángulos y marcan dónde rebota.', 'Miden ángulo de entrada y de salida.'] },
    { f: 'Explicar', min: 8, t: 'Ley de la reflexión', x: ['El ángulo de llegada es igual al de salida.', 'Pregunta: «¿Qué pasa si el rayo llega perpendicular?».'] },
    { f: 'Elaborar', min: 17, t: 'Laberinto de espejos', x: ['Con dos espejos, hacer que el rayo llegue a un blanco detrás de un obstáculo.', 'Registran la disposición ganadora con un dibujo.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo presenta su dibujo y explica el camino del rayo.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué relación hay entre el ángulo de entrada y el de salida?', '¿Cómo hiciste para llegar al blanco con dos espejos?', '¿Dónde usamos espejos en la vida diaria?'],
  rub: rub3(['Mide ángulos', 'No mide', 'Mide con ayuda', 'Mide y compara'], ['Dirige el rayo al blanco', 'No lo logra', 'Lo logra con un espejo', 'Lo logra con dos y explica']),
  err: ['Creer que el espejo «cambia» el color de la luz.', 'Medir los ángulos desde la superficie en lugar de la normal.'],
  ext: ['Hacer un periscopio con cartón y dos espejos.', 'Explorar espejos curvos (cuchara).']
};

window.MAKER['cadena-alimento'] = {
  dur: '50 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Patio o salón amplio',
  obj: 'Construir cadenas alimentarias identificando productores, consumidores y descomponedores, y predecir qué pasa si desaparece un eslabón.',
  lab: 'Antes: «Cadenas alimentarias» ordena cadenas en pantalla. Después: contrastar con la red construida en el Makerspace.',
  mat: [
    ['Tarjetas de seres vivos (planta, saltamontes, rana, serpiente, águila, hongo)', '1 juego por equipo', 'Productores, consumidores, descomponedores'],
    ['Lana o cuerda de colores', '10 m por equipo', 'Conectar la red'],
    ['Cartulina grande', '1 por equipo', 'Mural de la red'],
    ['Cinta y pegante', '1 rollo', 'Pegar'],
    ['Pelotas pequeñas o fichas', '10 por equipo', 'Representar energía'],
    ['Marcadores', '1 caja por equipo', 'Rotular'],
    ['Hoja de registro', '1 por equipo', 'Quién come a quién']
  ],
  herr: ['Tijeras de punta redonda', 'Regla'],
  prep: ['Imprime tarjetas de seres vivos.', 'Prepara el mural con espacio para pegar.', 'Define un espacio libre para el juego de pasar la lana.'],
  seg: ['Cuidar los pasillos con la lana.', 'No usar cuerdas alrededor del cuello.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿Quién se come a quién?', x: ['Muestra la foto de un águila y pregunta: «¿Qué comió antes de volar?».'] },
    { f: 'Explorar', min: 15, t: 'Armamos cadenas', x: ['Cada equipo ordena sus tarjetas en una cadena con flechas (hacia quien come).', 'Clasifican productores, consumidores primarios, secundarios y descomponedores.'] },
    { f: 'Explicar', min: 10, t: 'Flujo de energía', x: ['La energía viene del Sol y pasa de eslabón en eslabón.', 'Pregunta: «¿Qué hacen los descomponedores?».'] },
    { f: 'Elaborar', min: 15, t: 'Red alimentaria con lana', x: ['Cada niño representa un ser vivo y se conecta con lana a quien come y a quien lo come.', 'Retiran un eslabón (por ejemplo, la rana) y observan cómo se afecta la red.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo explica el efecto de quitar una especie.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Quién es el productor de tu cadena?', '¿Qué pasa si desaparece la rana?', '¿Por qué son importantes los hongos?'],
  rub: rub3(['Ordena cadenas', 'Ordena 1', 'Ordena 2', 'Ordena 3 con dirección correcta'], ['Predice el efecto', 'No predice', 'Predice un efecto', 'Predice y explica en cadena']),
  err: ['Dibujar la flecha al revés (hacia quien es comido).', 'Creer que los descomponedores no forman parte de la cadena.'],
  ext: ['Crear una cadena de un ecosistema local.', 'Hacer una red con 10 organismos de un humedal.']
};

window.MAKER.suelos = {
  dur: '50 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas con lavamanos o patio',
  obj: 'Comparar tipos de suelo (arena, tierra, arcilla) según cuánta agua dejan pasar y relacionarlos con el crecimiento de plantas.',
  lab: 'Antes: «Los suelos» mide cuánta agua pasa por cada suelo. Después: contrastar con los embudos reales.',
  mat: [
    ['Botellas PET cortadas por la mitad (embudos)', '3 por equipo', 'Una por suelo'],
    ['Arena, tierra negra y arcilla', '1 taza de cada una por equipo', 'Suelos de prueba'],
    ['Filtro de café o tela', '3 por equipo', 'Tapar el pico'],
    ['Vasos transparentes graduados', '3 por equipo', 'Recoger el agua'],
    ['Agua', '1 jarra por equipo', '100 mL por prueba'],
    ['Cronómetro', '1 por equipo', 'Tiempo de filtrado'],
    ['Lupas', '1 por equipo', 'Mirar los granos']
  ],
  herr: ['Probeta', 'Cinta para rotular'],
  prep: ['Corta las botellas y prepara los embudos con filtros.', 'Prepara tazas de cada suelo.', 'Mide 100 mL de agua por prueba.'],
  seg: ['Lavar manos tras tocar tierra.', 'Ventilar si hay polvo de arcilla.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿Todo el suelo es igual?', x: ['Muestra tres muestras de suelo y pregunta cuál retiene más agua.'] },
    { f: 'Explorar', min: 18, t: 'Embudos de suelo', x: ['Llenan cada embudo con una taza de suelo.', 'Vierten 100 mL de agua en cada uno y miden cuánta agua sale y cuánto tarda.', 'Registran la tabla.'] },
    { f: 'Explicar', min: 8, t: 'Permeabilidad', x: ['La arena deja pasar rápido; la arcilla casi nada; la tierra negra está en medio.', 'Relaciona con granos grandes y pequeños.'] },
    { f: 'Elaborar', min: 14, t: 'Elegimos el mejor suelo', x: ['Reto: decidir qué suelo conviene para una huerta y justificar con datos.', 'Mezclan suelos (arena + arcilla) y vuelven a medir.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo presenta su conclusión con datos.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué suelo dejó pasar más agua?', '¿Qué suelo conviene para un cactus? ¿Para arroz?', '¿Qué pasa al mezclar arena con arcilla?'],
  rub: rub3(['Mide y registra', 'No registra', 'Registra una medida', 'Registra tiempo y volumen'], ['Concluye con datos', 'Sin datos', 'Conclusión parcial', 'Concluye y justifica']),
  err: ['Creer que la arcilla «absorbe» y la arena «no».', 'No usar la misma cantidad de agua en todas las pruebas.'],
  ext: ['Sembrar semillas en cada suelo y comparar el crecimiento.', 'Observar lombrices en el patio.']
};

window.MAKER['fuerza-gravedad'] = {
  dur: '50 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Zona despejada con altura segura para soltar objetos',
  obj: 'Comprobar que la gravedad atrae todos los objetos y que el aire cambia la caída de algunos.',
  lab: 'Antes: «Gravedad» compara la caída con y sin aire. Después: contrastar con las pruebas reales.',
  mat: [
    ['Hojas de papel', '4 por equipo', 'Una abierta y otra arrugada'],
    ['Bolas pequeñas (de papel y de goma)', '2 por equipo', 'Masa distinta'],
    ['Filtros de café o paracaídas de bolsa plástica con hilo', '2 por equipo', 'Resistencia del aire'],
    ['Plastilina y clips', '1 por equipo', 'Carga de paracaídas'],
    ['Cronómetro', '1 por equipo', 'Tiempo de caída'],
    ['Cinta métrica', '1 por equipo', 'Altura de caída'],
    ['Hoja de registro', '1 por equipo', 'Objeto · tiempo']
  ],
  herr: ['Tijeras de punta redonda', 'Regla'],
  prep: ['Marca una altura fija (1,5–2 m).', 'Prepara paracaídas con bolsa y 4 hilos.', 'Despeja el piso.'],
  seg: ['Soltar objetos livianos desde alturas seguras.', 'Mirar hacia arriba solo con permiso.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿Cuál cae primero?', x: ['Suelta una hoja y una bola a la vez. Pregunta: «¿Por qué no caen igual?».'] },
    { f: 'Explorar', min: 18, t: 'Pruebas de caída', x: ['Sueltan dos objetos desde la misma altura y miden el tiempo con el cronómetro.', 'Prueban hoja abierta vs. arrugada y paracaídas con y sin carga.'] },
    { f: 'Explicar', min: 8, t: 'Gravedad y aire', x: ['La gravedad atrae todos; el aire frena más a lo plano.', 'Sin aire, todos caerían igual.'] },
    { f: 'Elaborar', min: 14, t: 'Reto del paracaídas', x: ['Diseñar el paracaídas que más tarde en caer con la misma carga.', 'Probar tamaños y registrar tiempos.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo comparte la regla que descubrió.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Por qué la hoja cae más lento que la bola?', '¿Qué pasaría en la Luna?', '¿Cómo ayuda un paracaídas?'],
  rub: rub3(['Mide el tiempo', 'No mide', 'Mide una vez', 'Mide varias veces y promedia'], ['Explica aire y gravedad', 'No explica', 'Menciona una', 'Relaciona ambas']),
  err: ['Creer que lo pesado siempre cae más rápido.', 'Confundir gravedad con «viento».'],
  ext: ['Medir cuánto cambia el tiempo con la altura.', 'Investigar la gravedad en otros planetas.']
};

window.MAKER.calor = {
  dur: '50 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas con lavamanos; agua caliente controlada por el docente',
  obj: 'Medir temperatura con un termómetro y comparar conductores y aislantes térmicos.',
  lab: 'Antes: «Calor y temperatura» mide la temperatura y compara cucharas. Después: comparar con pruebas reales.',
  mat: [
    ['Termómetros de laboratorio', '1 por equipo', 'De alcohol, no de mercurio'],
    ['Cucharas de metal, plástico y madera', '3 por equipo', 'Conductores y aislantes'],
    ['Agua tibia (45–50 °C) en termo', '1 por equipo', 'Solo la entrega el docente'],
    ['Vasos de plástico', '3 por equipo', 'Recipientes'],
    ['Cubos de hielo', '3 por equipo', 'Enfriar'],
    ['Mantequilla o cera', 'Una porción pequeña', 'Ver qué cuchara la derrite primero'],
    ['Cronómetro y hoja de registro', '1 por equipo', 'Medir tiempos']
  ],
  herr: ['Marcadores', 'Cinta'],
  prep: ['Prepara agua tibia y verifica la temperatura.', 'Ten toallas a mano.', 'Pega un trozo de mantequilla en el mango de cada cuchara.'],
  seg: ['Nunca agua hirviendo: solo tibia entregada por el docente.', 'Termómetros: sujetar con cuidado y no agitar.', 'Los niños no manipulan el termo.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿Caliente o frío?', x: ['Toca con las manos tres vasos con agua tibia, fría y del grifo y pregunta si la mano siempre juzga bien.'] },
    { f: 'Explorar', min: 18, t: 'Medimos y comparamos', x: ['Miden la temperatura de agua fría, ambiente y tibia con el termómetro.', 'Ponen las tres cucharas en el agua tibia y miden cuánto tarda en derretirse la mantequilla de cada mango.'] },
    { f: 'Explicar', min: 8, t: 'Calor y conducción', x: ['El calor pasa de lo caliente a lo frío; los metales lo conducen rápido, la madera y el plástico lo conducen despacio.'] },
    { f: 'Elaborar', min: 14, t: 'Diseñamos un aislante', x: ['Reto: mantener un cubo de hielo sin derretirse 10 minutos usando papel, tela o plástico.', 'Comparan resultados entre equipos.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo explica por qué sus mangos de olla son de madera o plástico.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué cuchara calentó primero? ¿Por qué?', '¿Para qué sirve un termómetro?', '¿Qué material usarías para un mango de olla?'],
  rub: rub3(['Usa el termómetro', 'No lo usa', 'Lo usa con ayuda', 'Lo usa y registra °C'], ['Clasifica materiales', 'No clasifica', 'Clasifica uno', 'Clasifica y explica']),
  err: ['Confundir calor con temperatura.', 'Creer que el hielo «transmite frío» (en realidad absorbe calor).'],
  ext: ['Comparar abrigos para mantener una botella tibia.', 'Medir enfriamiento de agua cada 2 minutos y graficar.']
};
