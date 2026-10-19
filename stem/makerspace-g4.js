/* Guías Makerspace · Grado 4° (ver plantilla en makerspace.js) */
window.MAKER = window.MAKER || {};
function rub4(a, b) { return [a, b, ['Registra datos y evidencias', 'Registro incompleto', 'Registra lo principal', 'Registra con tabla, unidades y dibujo'], ['Trabajo en equipo', 'Trabaja solo/a', 'Cumple su rol con recordatorios', 'Cumple su rol y ayuda a los demás']]; }

window.MAKER.planetas = {
  dur: '55 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Patio o pasillo largo (20 m)',
  obj: 'Construir un modelo a escala del Sistema Solar para comparar tamaños y distancias entre los planetas.',
  lab: 'Antes: «Sistema solar» en 3D permite viajar a cada planeta. Después: contrastar los tamaños reales con el modelo.',
  mat: [
    ['Rollo de papel o cinta de 10 m', '1 por grupo', 'Línea de distancias'],
    ['Plastilina de colores o pelotas de distinto tamaño', '1 juego por equipo', 'Planetas'],
    ['Tarjetas con datos de cada planeta', '1 juego por equipo', 'Diámetro, distancia y color'],
    ['Cinta métrica', '1 por grupo', 'Medir la escala'],
    ['Pegante y palillos', '1 por equipo', 'Soportes'],
    ['Cartulina negra y marcadores', '1 por equipo', 'Cartel de datos'],
    ['Calculadora', '1 por equipo', 'Escala']
  ],
  herr: ['Regla', 'Marcadores permanentes'],
  prep: ['Define la escala: 1 m = 150 millones de km (Sol 1,4 cm; Tierra a 1 m; Neptuno a 30 m).', 'Imprime tarjetas con diámetros y distancias.', 'Marca el pasillo con cinta cada metro.'],
  seg: ['Salir en fila al pasillo o patio.', 'Cuidar el paso para no tropezar con la cinta.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿Cuán grande es el espacio?', x: ['Pregunta: «¿Qué tan lejos está Neptuno si la Tierra está a 1 metro del Sol?». Deja predecir.'] },
    { f: 'Explorar', min: 18, t: 'Modelamos tamaños', x: ['Cada equipo convierte el diámetro de su planeta con la escala y lo modela con plastilina.', 'Ordenan los planetas por tamaño.'] },
    { f: 'Explicar', min: 8, t: 'Escalas y proporciones', x: ['Aclara que el modelo muestra tamaños, no el espacio vacío.', 'Pregunta: «¿Por qué Júpiter es gigante y Mercurio pequeño?».'] },
    { f: 'Elaborar', min: 19, t: 'Colocamos las distancias', x: ['En el pasillo ubican cada planeta a su distancia con la escala.', 'Reto: calcular cuánto tardaría la luz en llegar a cada planeta (1 m ≈ 8 minutos).'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo presenta su planeta con un dato curioso.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué sorprende del espacio entre los planetas?', '¿Qué planeta es más pequeño que la Tierra?', '¿Por qué la escala es necesaria?'],
  rub: rub4(['Usa la escala', 'No la usa', 'La usa con ayuda', 'La usa y comprueba'], ['Compara tamaños y distancias', 'Solo tamaños', 'Tamaños y distancias', 'Compara y explica']),
  err: ['Creer que los planetas están alineados y cerca.', 'Pensar que el Sol es del tamaño de un balón en el modelo.'],
  ext: ['Calcular el tiempo de viaje de un cohete a cada planeta.', 'Investigar lunas y asteroides y ubicarlos.']
};

window.MAKER.celula = {
  dur: '55 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas del Makerspace con zona de modelado',
  obj: 'Construir un modelo 3D de una célula animal y otra vegetal y explicar la función de cada orgánulo.',
  lab: 'Antes: «La célula por dentro» permite girar y tocar los orgánulos. Después: comparar el modelo con el digital.',
  mat: [
    ['Gelatina sin sabor o bolsas sellables con gel de cabello', '1 por equipo', 'Citoplasma'],
    ['Plastilina de colores', '1 caja por equipo', 'Orgánulos'],
    ['Cajas pequeñas de cartón o recipientes cuadrados', '1 por equipo', 'Célula vegetal (pared)'],
    ['Tarjetas con funciones de orgánulos', '1 juego por equipo', 'Emparejar'],
    ['Palillos y banderitas de papel', '10 por equipo', 'Rótulos'],
    ['Microscopio y láminas preparadas (opcional)', '1 por grupo', 'Ver células reales: cebolla, mejilla'],
    ['Marcadores', '1 caja', 'Nombrar']
  ],
  herr: ['Tijeras de punta redonda', 'Hoja de registro'],
  prep: ['Prepara la gelatina con antelación.', 'Imprime tarjetas con los nombres y funciones.', 'Si hay microscopio, prepara una lámina de cebolla con yodo.'],
  seg: ['Gelatina y plastilina: no ingerir.', 'Microscopio: sujetarlo con ambas manos.', 'Yodo: solo el docente lo manipula.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'Un mundo en miniatura', x: ['Muestra una foto de células de cebolla y pregunta: «¿Qué ven?».'] },
    { f: 'Explorar', min: 18, t: 'Construimos la célula', x: ['Moldean núcleo, mitocondrias, ribosomas, Golgi y lisosomas con plastilina y los ponen en el «citoplasma».', 'Colocan rótulos con palillos.'] },
    { f: 'Explicar', min: 10, t: 'Cada parte, una función', x: ['Relacionan cada orgánulo con su tarjeta de función.', 'Pregunta: «¿Qué le falta a la célula animal que sí tiene la vegetal?».'] },
    { f: 'Elaborar', min: 17, t: 'Célula vegetal', x: ['Reto: convertir su modelo en célula vegetal agregando pared, cloroplastos y vacuola.', 'Comparan ambos modelos.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo explica su modelo en 1 minuto.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué orgánulo produce energía?', '¿Qué diferencia hay entre una célula animal y una vegetal?', '¿Por qué los modelos nunca son iguales a la realidad?'],
  rub: rub4(['Ubica y nombra orgánulos', 'Ubica 1 o 2', 'Ubica 3 o 4', 'Ubica 5 o más con su función'], ['Diferencia animal y vegetal', 'No diferencia', 'Dice una diferencia', 'Dice tres diferencias']),
  err: ['Creer que los orgánulos flotan sin función.', 'Confundir pared celular con membrana.'],
  ext: ['Observar células de cebolla al microscopio.', 'Construir una célula con alimentos (gelatina y dulces) para comer después con permiso.']
};

window.MAKER.energia = {
  dur: '55 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas despejadas',
  obj: 'Reconocer y transformar energía (luz, movimiento, calor, electricidad) armando cadenas de conversión con materiales reales.',
  lab: 'Antes: «Formas de energía» construye cadenas con pilas y motores. Después: comparar con montajes reales.',
  mat: [
    ['Pilas AA y portapilas', '2 por equipo', 'Energía química → eléctrica'],
    ['Motores pequeños de 3 V con hélice', '1 por equipo', 'Eléctrica → movimiento'],
    ['LED con resistencia', '1 por equipo', 'Eléctrica → luz'],
    ['Panel solar pequeño', '1 por equipo', 'Luz → eléctrica'],
    ['Cables con caimanes', '4 por equipo', 'Conexiones'],
    ['Dinamo manual o generador de manivela', '1 por equipo', 'Movimiento → eléctrica'],
    ['Termómetro y vaso con agua', '1 por equipo', 'Detectar calor'],
    ['Hoja de registro', '1 por equipo', 'Entrada → salida']
  ],
  herr: ['Pinzas de punta (docente)', 'Cinta aislante'],
  prep: ['Revisa pilas, motores y LED.', 'Prepara 3 estaciones: luz, movimiento y calor.', 'Imprime el cuadro de transformaciones.'],
  seg: ['Solo pilas pequeñas; nunca conexión a la red eléctrica.', 'Evitar cortocircuitos.', 'Hélices: no acercar a la cara.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿De dónde sale la energía?', x: ['Enciende un LED con un panel solar y pregunta: «¿De dónde viene esa luz?».'] },
    { f: 'Explorar', min: 18, t: 'Estaciones de energía', x: ['En cada estación identifican la energía de entrada y la de salida (panel → LED, manivela → luz, pila → motor).', 'Anotan en el cuadro.'] },
    { f: 'Explicar', min: 10, t: 'Se transforma, no se crea', x: ['La energía cambia de forma y parte se pierde como calor.', 'Pregunta: «¿Qué se calentó en tu montaje?».'] },
    { f: 'Elaborar', min: 17, t: 'Cadena de energía', x: ['Reto: armar una cadena de al menos 3 transformaciones (por ejemplo manivela → electricidad → luz → panel).', 'Dibujar el diagrama de flujo.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo explica su cadena.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué energía entra y cuál sale?', '¿Dónde se pierde energía?', '¿Qué aparato de casa transforma electricidad en movimiento?'],
  rub: rub4(['Identifica transformaciones', 'Identifica 1', 'Identifica 2', 'Identifica 3 o más'], ['Arma la cadena', 'No la arma', 'Arma 2 pasos', 'Arma 3 o más y la explica']),
  err: ['Creer que la energía se gasta.', 'Confundir energía con fuerza.'],
  ext: ['Medir la energía de una pila con una bombilla.', 'Investigar fuentes renovables y no renovables.']
};

window.MAKER['fases-luna'] = {
  dur: '55 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Salón oscurecido',
  obj: 'Modelar el sistema Sol–Tierra–Luna para explicar las fases y los eclipses.',
  lab: 'Antes: «Fases de la Luna y eclipses» permite mover la Luna por su órbita. Después: comparar con el modelo físico.',
  mat: [
    ['Linterna fuerte o proyector', '1 por grupo', 'El Sol'],
    ['Pelota grande (la Tierra) en un palo', '1 por equipo', 'Observador'],
    ['Pelota pequeña blanca (la Luna) en un palo', '1 por equipo', 'Luna'],
    ['Cartulina con órbita dibujada y 8 posiciones', '1 por equipo', 'Marcar fases'],
    ['Hoja de registro con 8 círculos', '1 por equipo', 'Dibujar fases'],
    ['Plastilina', '1 barra', 'Sostener'],
    ['Cinta', '1 rollo', 'Fijar']
  ],
  herr: ['Lápices de colores', 'Transportador (opcional)'],
  prep: ['Fija la linterna a la altura de la Luna.', 'Oscurece el salón.', 'Marca las 8 posiciones en el piso.'],
  seg: ['No apuntar la linterna a los ojos.', 'Cuidado con los pasillos oscuros.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿Por qué cambia la Luna?', x: ['Muestra fotos de la Luna en distintas fases y pregunta qué las causa.'] },
    { f: 'Explorar', min: 18, t: 'Modelo del sistema', x: ['Un estudiante hace de Tierra y mueve la Luna alrededor mientras mira.', 'Dibujan lo que ven en cada una de las 8 posiciones.'] },
    { f: 'Explicar', min: 10, t: 'Fases', x: ['Siempre se ilumina la mitad de la Luna; vemos distinta parte según su posición.', 'Nombran las fases en orden.'] },
    { f: 'Elaborar', min: 17, t: 'Eclipses', x: ['Reto: alinear Sol, Luna y Tierra para producir un eclipse solar y uno lunar.', 'Discuten por qué no hay eclipse todos los meses (órbita inclinada).'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo dibuja el camino de la luz en un eclipse.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué fase se ve cuando la Luna está entre el Sol y la Tierra?', '¿Por qué no hay eclipse cada mes?', '¿Cómo cambia lo que ve el observador?'],
  rub: rub4(['Explica las fases', 'No las explica', 'Explica 2', 'Explica las 8'], ['Modela el eclipse', 'No lo logra', 'Logra uno', 'Logra solar y lunar']),
  err: ['Creer que las fases son la sombra de la Tierra.', 'Pensar que un eclipse solar es lo mismo que Luna nueva visible.'],
  ext: ['Observar la Luna durante un mes y registrar.', 'Investigar el próximo eclipse visible en Colombia.']
};

window.MAKER.volcanes = {
  dur: '55 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas con bandejas profundas, cerca de lavamanos; mejor en patio',
  obj: 'Modelar una erupción para relacionar presión de gases y viscosidad con erupciones suaves o explosivas.',
  lab: 'Antes: «Volcanes por dentro» muestra presión y tipos de erupción. Después: comparar con el volcán del Makerspace.',
  mat: [
    ['Botella pequeña de plástico (para la cámara)', '1 por equipo', 'Núcleo del volcán'],
    ['Bandeja honda', '1 por equipo', 'Contener la erupción'],
    ['Arcilla, plastilina o papel maché', '1 kg por equipo', 'Cono'],
    ['Vinagre y bicarbonato', '100 mL y 2 cucharadas', 'Gas CO₂'],
    ['Detergente líquido y colorante rojo', '1 cucharada', 'Espuma de lava'],
    ['Pintura y pinceles', '1 caja', 'Decorar'],
    ['Cuchara y cuentagotas', '1 por equipo', 'Dosificar'],
    ['Delantales y toallas', '1 por estudiante', 'Limpieza']
  ],
  herr: ['Embudo', 'Cronómetro'],
  prep: ['Monta una base para cada botella.', 'Mide vinagre y bicarbonato en vasitos.', 'Pon plástico en el piso.'],
  seg: ['Gafas de protección recomendadas; no inclinar la cara sobre el volcán.', 'Vinagre irrita ojos: lavar con agua si salpica.', 'Hacer en lugar ventilado.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'Un volcán en el salón', x: ['Muestra una foto de erupción y pregunta: «¿Qué empuja la lava hacia arriba?».'] },
    { f: 'Explorar', min: 20, t: 'Construimos y probamos', x: ['Cubren la botella con arcilla para formar el cono dejando la boca abierta.', 'Agregan bicarbonato, detergente y colorante; al final vierten el vinagre.', 'Observan y miden tiempo y altura de la espuma.'] },
    { f: 'Explicar', min: 10, t: 'Presión y viscosidad', x: ['Los gases empujan el magma; si es muy espeso, los gases quedan atrapados y la erupción es explosiva.', 'Introduce el efecto de la viscosidad.'] },
    { f: 'Elaborar', min: 15, t: 'Dos erupciones', x: ['Reto: hacer una erupción fluida (más agua) y otra espesa (más detergente y harina).', 'Comparan y registran.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo explica qué cambió y por qué.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué produce el gas en el volcán de bicarbonato?', '¿Qué tipo de erupción obtuviste con la mezcla espesa?', '¿Qué diferencia hay con un volcán real?'],
  rub: rub4(['Relaciona presión y erupción', 'No relaciona', 'Menciona la presión', 'Explica presión y viscosidad'], ['Hace dos erupciones', 'Solo una', 'Dos sin comparar', 'Dos y las compara']),
  err: ['Creer que el volcán de vinagre es igual a uno real.', 'Pensar que toda lava es igual de fluida.'],
  ext: ['Medir la altura máxima de la espuma.', 'Investigar volcanes de Colombia (Nevado del Ruiz, Galeras).']
};

window.MAKER.ecosistemas = {
  dur: '55 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas amplias; cartulinas en el piso',
  obj: 'Construir un bioma en maqueta e identificar las adaptaciones de sus animales y plantas.',
  lab: 'Antes: «Biomas y adaptaciones» une animales con su bioma. Después: comparar con la maqueta.',
  mat: [
    ['Cajas de zapatos', '1 por equipo', 'Bioma'],
    ['Arena, algodón, ramas, hojas secas, papel celofán', 'Varios', 'Desierto, polo, selva, océano'],
    ['Plastilina o animales de juguete', '1 juego por equipo', 'Animales'],
    ['Pegante y tijeras de punta redonda', '1 por equipo', 'Armar'],
    ['Tarjetas de adaptaciones', '1 juego por equipo', 'Ej.: grasa, camuflaje, raíces profundas'],
    ['Pintura y pinceles', '1 caja', 'Fondo'],
    ['Hoja de registro', '1 por equipo', 'Animal · adaptación']
  ],
  herr: ['Marcadores', 'Regla'],
  prep: ['Asigna un bioma por equipo.', 'Reúne materiales de cada bioma.', 'Imprime tarjetas de animales y adaptaciones.'],
  seg: ['Tijeras con supervisión.', 'No recolectar plantas protegidas.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿Quién vive aquí?', x: ['Muestra la foto de un desierto y de un polo; pregunta: «¿Qué necesitaría un animal para vivir en cada uno?».'] },
    { f: 'Explorar', min: 18, t: 'Maqueta del bioma', x: ['Construyen su bioma en la caja con materiales y ubican animales y plantas.'] },
    { f: 'Explicar', min: 8, t: 'Adaptaciones', x: ['Cada animal o planta tiene rasgos que le ayudan a sobrevivir (grasa, camuflaje, hojas grandes).'] },
    { f: 'Elaborar', min: 19, t: 'Cadena y equilibrio', x: ['Agregan una cadena alimentaria al bioma.', 'Reto: ¿qué pasa si se quita un animal o llueve menos?'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo presenta su bioma y dos adaptaciones.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué adaptación ayuda a un camello en el desierto?', '¿Qué pasa si falta agua en la selva?', '¿Qué bioma tenemos cerca?'],
  rub: rub4(['Relaciona animal y adaptación', 'No relaciona', 'Relaciona 1 o 2', 'Relaciona 3 o más'], ['Construye el bioma', 'Incompleto', 'Con animales', 'Con animales, plantas y cadena']),
  err: ['Creer que los animales «eligen» adaptarse.', 'Pensar que todos los biomas son calientes.'],
  ext: ['Comparar 2 biomas con una tabla.', 'Investigar un bioma de Colombia (páramo, manglar).']
};

window.MAKER.ondas = {
  dur: '55 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas con espacio largo; zona ruidosa',
  obj: 'Observar ondas en una cuerda y en resorte, y relacionar amplitud con volumen y frecuencia con tono.',
  lab: 'Antes: «Ondas y sonido» muestra una onda en un osciloscopio. Después: comparar con las ondas del resorte.',
  mat: [
    ['Resorte tipo slinky', '1 por equipo', 'Ondas longitudinales y transversales'],
    ['Cuerda de 3 m', '1 por equipo', 'Ondas transversales'],
    ['Diapasón o regla metálica', '1 por equipo', 'Vibración'],
    ['Vasos de plástico + hilo', '2 por equipo', 'Teléfono de vasos'],
    ['Cinta métrica y cronómetro', '1 por equipo', 'Medir longitud y frecuencia'],
    ['Tableta o celular con generador de tonos (docente)', '1 por grupo', 'Mostrar frecuencias'],
    ['Hoja de registro', '1 por equipo', 'Amplitud y frecuencia']
  ],
  herr: ['Marcadores', 'Cinta'],
  prep: ['Despeja una zona de 4 m en piso o mesas.', 'Prepara el generador de tonos.', 'Verifica que el resorte no esté enredado.'],
  seg: ['No estirar demasiado el resorte (puede soltarse).', 'Volumen moderado en tonos.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'La onda viaja', x: ['Mueve una cuerda en el piso y pregunta: «¿Qué viaja: la cuerda o la perturbación?».'] },
    { f: 'Explorar', min: 18, t: 'Hacemos ondas', x: ['Con el resorte hacen ondas transversales y longitudinales.', 'Cambian la amplitud (más grande) y la frecuencia (más rápida) y observan.'] },
    { f: 'Explicar', min: 10, t: 'Amplitud y frecuencia', x: ['Amplitud: tamaño de la onda → volumen. Frecuencia: ondas por segundo → tono.', 'Muestra tonos graves y agudos.'] },
    { f: 'Elaborar', min: 17, t: 'Medimos', x: ['Reto: contar cuántas ondas pasan en 10 segundos y calcular la frecuencia.', 'Usan el teléfono de vasos para transmitir una onda de sonido.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo explica la diferencia entre volumen y tono.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué cambia cuando la onda es más grande?', '¿Qué pasa con el tono si aumenta la frecuencia?', '¿Viaja el sonido en el vacío?'],
  rub: rub4(['Relaciona amplitud y volumen', 'No relaciona', 'Relaciona con ayuda', 'Relaciona y da ejemplo'], ['Mide frecuencia', 'No mide', 'Mide con ayuda', 'Mide y calcula']),
  err: ['Creer que la onda arrastra el material hasta el final.', 'Confundir volumen con tono.'],
  ext: ['Usar una app de osciloscopio con el celular.', 'Hacer una guitarra de bandas y medir tonos.']
};

window.MAKER.ph = {
  dur: '55 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas con lavamanos y bandejas; mejor con delantales',
  obj: 'Medir el pH de sustancias cotidianas con un indicador natural y clasificarlas como ácidas, neutras o básicas.',
  lab: 'Antes: «Ácidos y bases (pH)» mide sustancias con la escala de colores. Después: comparar los colores reales con la simulación.',
  mat: [
    ['Repollo morado', '1/4 de repollo por grupo', 'Indicador natural'],
    ['Agua caliente (docente) y licuadora o mortero', '1 por grupo', 'Extraer el color'],
    ['Vasos transparentes', '8 por equipo', 'Uno por sustancia'],
    ['Sustancias: limón, vinagre, jugo de naranja, agua, leche, jabón líquido, bicarbonato, cloro diluido (solo docente)', '1 vasito de cada', 'Gama ácida a básica'],
    ['Pajillas o cucharas', '8 por equipo', 'Una por vaso'],
    ['Tiras de pH (opcional)', '1 caja por grupo', 'Comparar'],
    ['Hoja de registro con escala de colores', '1 por equipo', 'Pegar o dibujar colores'],
    ['Guantes y gafas', '1 por estudiante', 'Protección']
  ],
  herr: ['Marcadores', 'Cuentagotas'],
  prep: ['Prepara el extracto de repollo con agua caliente y déjalo enfriar.', 'Rotula los vasos de sustancias.', 'El cloro diluido y el bicarbonato los manipula solo el docente.'],
  seg: ['Gafas y guantes obligatorios.', 'Nunca mezclar productos de limpieza; no probar ninguna sustancia.', 'Limpiar derrames de inmediato.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'Un indicador mágico', x: ['Agrega vinagre al extracto de repollo: ¡cambia de color!'] },
    { f: 'Explorar', min: 20, t: 'Medimos pH', x: ['Cada equipo agrega 2 cucharadas de extracto a cada sustancia y observa el color.', 'Anotan el color y lo comparan con la escala.'] },
    { f: 'Explicar', min: 10, t: 'Ácidos, neutros y bases', x: ['Rojo-rosado: ácido; morado: neutro; azul-verde: básico.', 'Pregunta: «¿Qué productos de casa son ácidos?».'] },
    { f: 'Elaborar', min: 15, t: 'Neutralizamos', x: ['Reto: agregar gota a gota bicarbonato al vinagre con indicador hasta lograr color neutro.', 'Dibujan la secuencia de colores.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo ordena sus sustancias de ácida a básica.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué color indicó un ácido? ¿Y una base?', '¿Qué pasó al agregar bicarbonato al vinagre?', '¿Por qué no se prueban las sustancias?'],
  rub: rub4(['Clasifica sustancias', 'Acierta menos de la mitad', 'Acierta la mitad', 'Acierta casi todas'], ['Neutraliza', 'No logra', 'Logra con ayuda', 'Logra y explica']),
  err: ['Creer que todos los productos de limpieza son iguales.', 'Pensar que «ácido» siempre es peligroso.'],
  ext: ['Hacer papel indicador con papel filtro y repollo.', 'Medir el pH del agua de la llave y de lluvia.']
};

window.MAKER.tectonicas = {
  dur: '55 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas con bandejas',
  obj: 'Modelar los tres tipos de borde de placas y relacionarlos con montañas, volcanes y terremotos.',
  lab: 'Antes: «Placas tectónicas» mueve placas y acumula tensión. Después: comparar con los modelos físicos.',
  mat: [
    ['Esponjas o espuma de colores', '2 por equipo', 'Placas'],
    ['Galletas tipo wafer o cartulina doblada', '4 por equipo', 'Corteza'],
    ['Plastilina o arcilla', '1 barra por equipo', 'Montañas'],
    ['Cartón corrugado', '2 por equipo', 'Capas rígidas'],
    ['Bandeja o caja', '1 por equipo', 'Base'],
    ['Cinta y marcadores', '1 rollo', 'Rotular'],
    ['Hoja con mapa de placas', '1 por equipo', 'Ubicar Colombia']
  ],
  herr: ['Tijeras de punta redonda', 'Regla'],
  prep: ['Prepara modelos de ejemplo.', 'Imprime el mapa de placas.', 'Despeja las mesas.'],
  seg: ['Alimentos solo si hay permiso; usar cartulina.', 'Tijeras con supervisión.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'La tierra se mueve', x: ['Muestra un video corto de un terremoto y pregunta: «¿Por qué tiembla?».'] },
    { f: 'Explorar', min: 18, t: 'Tres movimientos', x: ['Con esponjas hacen chocar (convergente), separar (divergente) y deslizar (transformante).', 'Dibujan lo que ocurre en cada caso.'] },
    { f: 'Explicar', min: 10, t: 'Bordes de placas', x: ['Convergente: montañas y volcanes; divergente: dorsales; transformante: fallas y terremotos.', 'Ubican Colombia en el mapa (placas de Nazca, Suramericana, Caribe).'] },
    { f: 'Elaborar', min: 17, t: 'Terremoto', x: ['Con cartón y resorte, acumulan tensión y la liberan.', 'Reto: predecir dónde habría terremotos según el mapa.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo presenta un borde y un ejemplo real.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué pasa cuando dos placas chocan?', '¿Dónde está Colombia en el mapa de placas?', '¿Por qué hay volcanes cerca de bordes?'],
  rub: rub4(['Modela tres bordes', 'Modela 1', 'Modela 2', 'Modela los 3 y los explica'], ['Relaciona con fenómenos', 'No relaciona', 'Relaciona uno', 'Relaciona los tres']),
  err: ['Creer que los continentes se mueven rápido.', 'Pensar que los terremotos solo ocurren en bordes de placa lejanos.'],
  ext: ['Investigar el terremoto del Eje Cafetero.', 'Ubicar volcanes y sismos en un mapamundi.']
};

window.MAKER.motores = {
  dur: '55 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas amplias',
  obj: 'Construir un sistema de engranajes y relacionar cantidad de dientes con velocidad y fuerza.',
  lab: 'Antes: «Engranajes y velocidad» muestra relaciones de dientes. Después: comparar con el montaje real.',
  mat: [
    ['Kit de engranajes (o engranajes de cartón corrugado impresos)', '1 por equipo', 'Distintos números de dientes'],
    ['Tablero de corcho o cartón grueso', '1 por equipo', 'Base'],
    ['Chinches o palillos', '10 por equipo', 'Ejes'],
    ['Manivela o alambre doblado', '1 por equipo', 'Girar'],
    ['Marcadores y cinta', '1 rollo', 'Marcar vueltas'],
    ['Cronómetro', '1 por equipo', 'Medir vueltas por minuto'],
    ['Hoja de registro', '1 por equipo', 'Dientes · vueltas']
  ],
  herr: ['Regla', 'Pinzas'],
  prep: ['Imprime plantillas de engranajes con 8, 16 y 24 dientes si no hay kit.', 'Marca una flecha en cada engranaje.', 'Prepara tableros.'],
  seg: ['Chinches: manipular con cuidado.', 'Evitar pellizcos entre engranajes.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'La bicicleta y sus cambios', x: ['Muestra los piñones de una bicicleta y pregunta: «¿Por qué hay uno grande y uno pequeño?».'] },
    { f: 'Explorar', min: 18, t: 'Giramos engranajes', x: ['Conectan 2 engranajes iguales y observan sentido de giro.', 'Cambian a uno grande y uno pequeño y cuentan vueltas.'] },
    { f: 'Explicar', min: 10, t: 'Relación de dientes', x: ['Si el motor tiene más dientes que el movido, este gira más rápido pero con menos fuerza.', 'Relación = dientes del motor ÷ dientes del movido.'] },
    { f: 'Elaborar', min: 17, t: 'Reto de velocidad', x: ['Diseñar un sistema que gire el doble de rápido que la manivela.', 'Medir y comparar con el cálculo.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo explica su sistema con números.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué pasa con el sentido de giro de dos engranajes juntos?', '¿Qué engranaje gira más rápido: el grande o el pequeño?', '¿Dónde usamos engranajes?'],
  rub: rub4(['Calcula la relación', 'No calcula', 'Calcula con ayuda', 'Calcula y comprueba'], ['Arma el sistema', 'No funciona', 'Funciona con ayuda', 'Funciona y lo explica']),
  err: ['Creer que más dientes siempre significa más velocidad.', 'Olvidar que cada par invierte el sentido.'],
  ext: ['Diseñar una cadena de 3 engranajes.', 'Investigar cajas de cambio de un auto.']
};
