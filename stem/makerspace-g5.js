/* Guías Makerspace · Grado 5° (ver plantilla en makerspace.js) */
window.MAKER = window.MAKER || {};
function rub5(a, b) { return [a, b, ['Registra datos con unidades', 'Registro incompleto', 'Registra los datos principales', 'Registra tabla, unidades y gráfica'], ['Trabajo en equipo', 'Trabaja solo/a', 'Cumple su rol con recordatorios', 'Cumple su rol y ayuda a los demás']]; }

window.MAKER.estructuras = {
  dur: '60 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas amplias; zona de pruebas con carga',
  obj: 'Diseñar y probar un puente y una torre con materiales simples, midiendo cuánta carga resisten y mejorando el diseño.',
  lab: 'Antes: «Laboratorio de puentes» permite diseñar estructuras en 3D y medir su factor de seguridad. Después: comparar el modelo real con el digital.',
  mat: [
    ['Palitos de helado o pajillas', '60 por equipo', 'Elementos estructurales'],
    ['Pegante de silicona frío o cinta de enmascarar', '1 por equipo', 'Uniones'],
    ['Pasta seca (espagueti) y malvaviscos (opcional)', '1 bolsa por equipo', 'Torre'],
    ['Pesas: monedas o arandelas', '40 por equipo', 'Carga'],
    ['Vasito plástico con cuerda', '1 por equipo', 'Colgar la carga'],
    ['Libros o bloques para apoyos', '2 por equipo', 'Distancia del puente'],
    ['Regla y balanza de cocina', '1 por equipo', 'Medir'],
    ['Hoja de diseño', '1 por equipo', 'Plano previo']
  ],
  herr: ['Tijeras', 'Marcadores'],
  prep: ['Marca la distancia entre apoyos (20 cm).', 'Prepara pesas y vasito de carga.', 'Muestra fotos de puentes (arco, vigas, colgante).'],
  seg: ['Silicona fría o cinta; evitar pistolas calientes con estudiantes.', 'Gafas si se llevan a rotura.', 'Recoger astillas.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿Por qué no se cae el puente?', x: ['Muestra una foto de un puente y pregunta: «¿Qué partes soportan el peso?».'] },
    { f: 'Explorar', min: 10, t: 'Planificamos', x: ['Dibujan su diseño con medidas y eligen un tipo de puente.', 'Anotan cuánta carga predicen.'] },
    { f: 'Explicar', min: 8, t: 'Fuerzas en una estructura', x: ['Compresión (aprieta) y tensión (estira); los triángulos dan rigidez.', 'Pregunta: «¿Qué forma resiste más?».'] },
    { f: 'Elaborar', min: 30, t: 'Construimos y probamos', x: ['Construyen el puente entre los apoyos.', 'Cuelgan el vasito y agregan monedas hasta que falle; anotan la carga máxima.', 'Mejoran el diseño y vuelven a probar.'] },
    { f: 'Evaluar', min: 7, t: 'Cierre', x: ['Calculan el factor de seguridad (carga máxima ÷ carga de uso).', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Dónde falló el puente? ¿Por qué?', '¿Qué forma agregó resistencia?', '¿Qué cambiarías en tu segundo intento?'],
  rub: rub5(['Mejora el diseño', 'No mejora', 'Mejora con ayuda', 'Mejora y justifica con datos'], ['Mide carga máxima', 'No mide', 'Mide una vez', 'Mide y calcula factor de seguridad']),
  err: ['Creer que más material siempre es más resistente.', 'Poner la carga en un solo punto y no repartirla.'],
  ext: ['Probar un puente de arco y comparar.', 'Calcular peso del puente vs. carga que soporta.']
};

window.MAKER['sistema-digestivo'] = {
  dur: '60 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas con bandejas; cerca de lavamanos',
  obj: 'Modelar el recorrido del alimento por el sistema digestivo y simular la digestión mecánica y química.',
  lab: 'Antes: «Sistema digestivo» sigue el bocado por los órganos. Después: comparar con el modelo.',
  mat: [
    ['Bolsa sellable', '1 por equipo', 'Estómago'],
    ['Galletas, agua y vinagre (jugo gástrico)', '1 porción por equipo', 'Digestión'],
    ['Medias largas o tubo de tela', '1 por equipo', 'Intestino'],
    ['Tubo de cartón o manguera transparente', '1 por equipo', 'Esófago'],
    ['Silueta del cuerpo en papel kraft', '1 por equipo', 'Ubicar órganos'],
    ['Plastilina de colores', '1 caja por equipo', 'Órganos'],
    ['Guantes y toallas', '1 por estudiante', 'Limpieza']
  ],
  herr: ['Marcadores', 'Cinta'],
  prep: ['Prepara galletas trituradas y vinagre diluido.', 'Confirma alergias antes de manipular alimentos.', 'Imprime siluetas.'],
  seg: ['Alergias: confirmar antes de usar galleta o gluten.', 'No ingerir lo del experimento.', 'Lavar manos al terminar.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿A dónde va la comida?', x: ['Pregunta: «¿Cuánto tarda una manzana en recorrer tu cuerpo?».'] },
    { f: 'Explorar', min: 20, t: 'Simulamos la digestión', x: ['Trituran galletas (boca) en la bolsa, agregan vinagre y agua (estómago) y la apretan.', 'Pasan la mezcla por la media (intestino) y observan lo que se filtra.'] },
    { f: 'Explicar', min: 10, t: 'Órganos y funciones', x: ['Boca, esófago, estómago, intestino delgado y grueso.', 'Digestión mecánica (masticar) y química (jugos).'] },
    { f: 'Elaborar', min: 20, t: 'Modelo del cuerpo', x: ['Colocan los órganos de plastilina en la silueta con sus nombres.', 'Reto: escribir qué pasa en cada órgano con un bocado de pan.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo cuenta el viaje del bocado.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué ocurre en la boca? ¿Y en el estómago?', '¿Dónde se absorben los nutrientes?', '¿Para qué sirve el intestino grueso?'],
  rub: rub5(['Ordena el recorrido', 'Ordena 2 o 3', 'Ordena 4', 'Ordena los 5 órganos'], ['Explica digestión mecánica y química', 'No explica', 'Explica una', 'Explica ambas']),
  err: ['Creer que la digestión empieza en el estómago.', 'Pensar que la comida cae sola por el esófago.'],
  ext: ['Medir el tiempo en que un trozo de pan se deshace en vinagre.', 'Investigar bacterias del intestino.']
};

window.MAKER.atomos = {
  dur: '60 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas despejadas',
  obj: 'Construir modelos de moléculas con enlaces simples, dobles y triples respetando la valencia de cada átomo.',
  lab: 'Antes: «Átomos y moléculas» arma agua, CO₂, metano y más. Después: comparar con modelos físicos.',
  mat: [
    ['Bolas de plastilina o espuma de colores', '40 por equipo', 'Blanco H, negro C, rojo O, azul N'],
    ['Palillos o limpiapipas', '40 por equipo', 'Enlaces (2 para doble, 3 para triple)'],
    ['Tarjetas de moléculas con fórmula', '1 juego por equipo', 'H₂O, CO₂, CH₄, NH₃, O₂, N₂'],
    ['Tabla de valencias', '1 por equipo', 'H=1, O=2, N=3, C=4'],
    ['Cartulina para registro', '1 por equipo', 'Fórmula · dibujo'],
    ['Marcadores', '1 caja', 'Rotular']
  ],
  herr: ['Tijeras de punta redonda', 'Regla'],
  prep: ['Prepara bolsas con átomos por color.', 'Imprime fichas de moléculas.', 'Muestra la tabla de valencias.'],
  seg: ['Palillos: usar con punta roma.', 'No ingerir material.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'Todo está hecho de átomos', x: ['Pregunta: «¿Qué crees que hay dentro de una gota de agua?».'] },
    { f: 'Explorar', min: 18, t: 'Construimos moléculas', x: ['Cada equipo arma H₂O, CO₂, CH₄ y NH₃ con átomos y palillos.', 'Cuentan enlaces por átomo y verifican su valencia.'] },
    { f: 'Explicar', min: 10, t: 'Valencia y enlaces', x: ['La valencia es cuántos enlaces forma un átomo; los dobles y triples comparten más electrones.', 'Compara O₂ (doble) y N₂ (triple).'] },
    { f: 'Elaborar', min: 22, t: 'Reto de moléculas', x: ['Reto: armar etano (C₂H₆) o HCN con enlaces correctos.', 'Registran cuántos átomos tiene cada molécula.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo presenta una molécula y explica sus enlaces.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Cuántos enlaces forma el carbono?', '¿Qué diferencia hay entre un enlace simple y uno doble?', '¿Qué moléculas del aire conocemos?'],
  rub: rub5(['Respeta la valencia', 'Falla en la mayoría', 'Acierta la mitad', 'Acierta casi todas'], ['Arma moléculas', 'Arma 1', 'Arma 2 o 3', 'Arma 4 o más y explica']),
  err: ['Poner más enlaces de los que permite la valencia.', 'Confundir átomo con molécula.'],
  ext: ['Armar moléculas orgánicas más grandes.', 'Relacionar fórmulas con sustancias cotidianas.']
};

window.MAKER['cambio-climatico'] = {
  dur: '60 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesa cerca de ventana con sol',
  obj: 'Modelar el efecto invernadero y diseñar acciones para reducir emisiones.',
  lab: 'Antes: «Cambio climático» muestra cómo los gases atrapan el calor. Después: comparar el experimento real con la simulación.',
  mat: [
    ['Botellas PET transparentes (2 L)', '2 por equipo', 'Una con tapa, otra abierta'],
    ['Termómetros', '2 por equipo', 'Uno por botella'],
    ['Lámpara o luz solar directa', '1 por grupo', 'Calentar'],
    ['Bicarbonato y vinagre (CO₂)', '2 cucharadas y 100 mL', 'Generar gas'],
    ['Cinta y cronómetro', '1 por equipo', 'Medir'],
    ['Hoja de registro con gráfica', '1 por equipo', 'Temperatura vs. tiempo'],
    ['Cartulinas para el plan de acción', '1 por equipo', 'Propuestas']
  ],
  herr: ['Regla', 'Marcadores'],
  prep: ['Instala la lámpara a 30 cm o saca al sol.', 'Prepara termómetros calibrados.', 'Ten a mano datos de CO₂ actuales.'],
  seg: ['Gas: no sellar herméticamente una botella con reacción (se expande).', 'Lámpara caliente: no tocar.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'Un carro al sol', x: ['Pregunta: «¿Por qué un carro cerrado se calienta tanto?».'] },
    { f: 'Explorar', min: 20, t: 'Dos botellas', x: ['Una botella con aire y otra con CO₂ (bicarbonato + vinagre) se exponen a la luz.', 'Registran la temperatura cada 2 minutos durante 20 minutos.'] },
    { f: 'Explicar', min: 10, t: 'Efecto invernadero', x: ['Los gases como el CO₂ atrapan calor.', 'Pregunta: «¿Qué actividades humanas aumentan el CO₂?».'] },
    { f: 'Elaborar', min: 20, t: 'Plan de acción', x: ['Grafican y diseñan un plan de 3 acciones para reducir emisiones en el colegio.', 'Calculan el impacto de una acción (por ejemplo, ahorro de papel).'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo presenta su plan.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué botella se calentó más? ¿Por qué?', '¿Qué acciones reducen emisiones?', '¿Qué podemos hacer en el colegio?'],
  rub: rub5(['Grafica temperatura', 'No grafica', 'Grafica una botella', 'Grafica ambas y compara'], ['Propone acciones', 'No propone', 'Propone 1', 'Propone 3 con impacto']),
  err: ['Confundir efecto invernadero con agujero de la capa de ozono.', 'Creer que el CO₂ es «contaminación visible».'],
  ext: ['Calcular la huella de carbono de un día.', 'Sembrar un árbol y medir CO₂ absorbido en un año (estimado).']
};

window.MAKER.fuerzas = {
  dur: '60 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas con pista de 1 m',
  obj: 'Investigar cómo la fuerza, la masa y la fricción cambian la aceleración de un carro.',
  lab: 'Antes: «Fuerzas y movimiento» empuja un carro de laboratorio. Después: contrastar con mediciones reales.',
  mat: [
    ['Carros de juguete o de laboratorio', '1 por equipo', 'Objeto'],
    ['Polea y cuerda', '1 por equipo', 'Tirar con pesas'],
    ['Pesas pequeñas o arandelas', '20 por equipo', 'Fuerza'],
    ['Cinta métrica y cronómetro', '1 por equipo', 'Distancia y tiempo'],
    ['Superficies de fricción (lija, tela, papel)', '3 por equipo', 'Cambiar fricción'],
    ['Plastilina o masas', '200 g por equipo', 'Cambiar masa'],
    ['Hoja de registro', '1 por equipo', 'Fuerza · masa · tiempo']
  ],
  herr: ['Regla', 'Cinta'],
  prep: ['Marca pista de 1 m.', 'Monta la polea en el borde de la mesa.', 'Prepara pesas por grupo.'],
  seg: ['No dejar caer pesas sobre los pies.', 'Cuerdas cortas lejos del cuello.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'Empujar un carro', x: ['Empuja un carro vacío y uno cargado y pregunta cuál acelera más.'] },
    { f: 'Explorar', min: 20, t: 'Medimos el movimiento', x: ['Con pesas colgantes cambian la fuerza y miden el tiempo de 1 m.', 'Cambian la masa del carro y repiten.', 'Cambian la superficie para variar la fricción.'] },
    { f: 'Explicar', min: 10, t: 'Fuerza, masa y aceleración', x: ['Más fuerza, más aceleración; más masa, menos aceleración; más fricción, menos movimiento.', 'Introduce F = m·a de forma cualitativa.'] },
    { f: 'Elaborar', min: 20, t: 'Gráficas', x: ['Grafican tiempo vs. fuerza para una masa fija.', 'Reto: lograr que el carro recorra 1 m en 2 segundos.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo concluye con una frase de relación entre variables.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué pasa si duplicas la fuerza?', '¿Qué pasa si duplicas la masa?', '¿Qué rol tiene la fricción?'],
  rub: rub5(['Controla variables', 'Cambia varias', 'Cambia dos', 'Cambia una a la vez'], ['Relaciona fuerza y movimiento', 'No relaciona', 'Relaciona una', 'Relaciona las tres']),
  err: ['Creer que sin fuerza el carro se detiene (inercia).', 'Pensar que la masa es lo mismo que el peso.'],
  ext: ['Calcular aceleración con distancia y tiempo.', 'Probar en un plano inclinado.']
};

window.MAKER.genetica = {
  dur: '60 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas despejadas',
  obj: 'Predecir la herencia de un rasgo con cuadros de Punnett y comprobar las proporciones con un modelo de azar.',
  lab: 'Antes: «Herencia genética» cruza plantas de arveja. Después: comparar proporciones del azar con el cuadro.',
  mat: [
    ['Fichas o monedas de dos colores', '40 por equipo', 'Alelos dominantes y recesivos'],
    ['Bolsas opacas', '2 por equipo', 'Padres'],
    ['Hoja con cuadro de Punnett', '2 por equipo', 'Cruces'],
    ['Plastilina de dos colores', '1 caja', 'Flores moradas y blancas'],
    ['Dados o monedas', '2 por equipo', 'Azar'],
    ['Hoja de registro', '1 por equipo', 'Conteo de resultados'],
    ['Marcadores', '1 caja', 'Dibujar']
  ],
  herr: ['Regla', 'Calculadora'],
  prep: ['Prepara bolsas con 5 fichas dominantes y 5 recesivas por padre.', 'Imprime cuadros de Punnett.', 'Explica genotipo y fenotipo.'],
  seg: ['Sin riesgos especiales.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'Por qué me parezco a mi mamá', x: ['Pregunta: «¿Qué rasgos heredaste y cuáles no?».'] },
    { f: 'Explorar', min: 18, t: 'Sacamos alelos', x: ['Cada estudiante saca una ficha de cada bolsa (un alelo de cada padre) 20 veces y anota.', 'Cuentan cuántos fueron dominantes y recesivos.'] },
    { f: 'Explicar', min: 10, t: 'Punnett', x: ['El cuadro de Punnett predice 3:1 en el cruce Aa × Aa.', 'Compara el azar con la predicción.'] },
    { f: 'Elaborar', min: 22, t: 'Cruzamos plantas', x: ['Con plastilina representan descendencia de varios cruces.', 'Reto: predecir el color en un cruce desconocido y comprobarlo con fichas.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo presenta sus proporciones.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Por qué el resultado no es exactamente 3:1?', '¿Qué significa dominante?', '¿Qué rasgos heredamos?'],
  rub: rub5(['Completa el cuadro de Punnett', 'No lo completa', 'Con errores', 'Correcto y explica'], ['Compara azar y predicción', 'No compara', 'Compara con ayuda', 'Compara y explica la diferencia']),
  err: ['Creer que un gen dominante es «el más frecuente».', 'Pensar que el resultado debe ser exacto.'],
  ext: ['Hacer un árbol genealógico de un rasgo.', 'Investigar a Gregor Mendel.']
};

window.MAKER.refraccion = {
  dur: '60 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Salón oscurecido',
  obj: 'Observar cómo se dobla la luz al cambiar de medio y cómo una lente enfoca.',
  lab: 'Antes: «Lentes y refracción» muestra el rayo doblándose. Después: comparar con montajes reales.',
  mat: [
    ['Vaso transparente con agua', '1 por equipo', 'Refracción'],
    ['Linterna con ranura', '1 por equipo', 'Rayo'],
    ['Lupa o lente convexa', '1 por equipo', 'Enfocar'],
    ['Lápiz', '1 por equipo', 'Parece quebrado en el agua'],
    ['Hoja blanca y regla', '2 por equipo', 'Marcar ángulos'],
    ['Monedas', '3 por equipo', 'Aparecen con agua'],
    ['Cinta', '1 rollo', 'Fijar']
  ],
  herr: ['Transportador', 'Marcadores'],
  prep: ['Prepara linternas con ranura.', 'Oscurece el salón.', 'Llena vasos con agua.'],
  seg: ['No apuntar la luz a los ojos.', 'Limpiar derrames.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'El lápiz quebrado', x: ['Mete un lápiz en el agua y pregunta por qué parece quebrado.'] },
    { f: 'Explorar', min: 20, t: 'Doblamos la luz', x: ['Con la linterna, apuntan el rayo al agua con distintos ángulos y marcan el camino.', 'Observan cómo cambia la dirección.'] },
    { f: 'Explicar', min: 10, t: 'Refracción', x: ['La luz cambia de velocidad al pasar de aire a agua y se desvía.', 'El índice de refracción mide cuánto se dobla.'] },
    { f: 'Elaborar', min: 20, t: 'Enfocamos con una lente', x: ['Con la lupa enfocan una ventana sobre una hoja.', 'Reto: encontrar la distancia focal.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo explica por qué un pez parece estar en otro lugar.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Hacia dónde se dobla el rayo al entrar al agua?', '¿Qué hace una lente convexa?', '¿Por qué parece menos profunda una piscina?'],
  rub: rub5(['Mide ángulos', 'No mide', 'Mide con ayuda', 'Mide y compara'], ['Explica la refracción', 'No explica', 'Dice que se dobla', 'Explica por cambio de medio']),
  err: ['Creer que la luz «se quiebra» como un palo.', 'Confundir reflexión y refracción.'],
  ext: ['Hacer un telescopio simple con dos lentes.', 'Medir el índice de refracción del agua.']
};

window.MAKER.cohetes = {
  dur: '60 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Patio abierto',
  obj: 'Diseñar y lanzar cohetes de agua o aire comprimido para estudiar empuje, forma y distancia.',
  lab: 'Antes: «Lanzamiento de cohetes» juega con empuje y etapas. Después: comparar con los lanzamientos reales.',
  mat: [
    ['Botellas PET de 2 L', '1 por equipo', 'Cuerpo del cohete'],
    ['Cartulina o foami', '1 pliego por equipo', 'Aletas y cono'],
    ['Cinta y pegante', '1 rollo', 'Armar'],
    ['Bomba de aire con base y tapón (o lanzador de agua)', '1 por grupo', 'Lanzador (docente)'],
    ['Cinta métrica de 30 m', '1 por grupo', 'Medir alcance'],
    ['Cronómetro', '1 por equipo', 'Tiempo de vuelo'],
    ['Agua', '1 L por lanzamiento', 'Combustible'],
    ['Hoja de registro', '1 por equipo', 'Agua usada · distancia']
  ],
  herr: ['Tijeras', 'Gafas de seguridad'],
  prep: ['Define una zona de lanzamiento de 10 × 20 m.', 'Revisa el lanzador y la presión máxima.', 'Marca una línea de seguridad para los estudiantes.'],
  seg: ['Solo el docente maneja la presión y el lanzador.', 'Todos detrás de la línea de seguridad con gafas.', 'Nunca apuntar hacia personas.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'Acción y reacción', x: ['Suelta un globo inflado y pregunta por qué sale volando.'] },
    { f: 'Explorar', min: 20, t: 'Construimos el cohete', x: ['Cada equipo agrega aletas y un cono a su botella.', 'Predicen cuánta agua conviene (1/3 de la botella).'] },
    { f: 'Explicar', min: 8, t: 'Empuje y forma', x: ['El agua sale hacia abajo y empuja el cohete hacia arriba.', 'Las aletas dan estabilidad.'] },
    { f: 'Elaborar', min: 22, t: 'Lanzamos y mejoramos', x: ['El docente lanza cada cohete con la misma presión; miden altura aproximada o alcance.', 'Cambian la cantidad de agua y relanzan.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo concluye cuál fue la mejor cantidad de agua.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Por qué sube el cohete?', '¿Qué efecto tuvo la cantidad de agua?', '¿Para qué sirven las aletas?'],
  rub: rub5(['Mide resultados', 'No mide', 'Mide una vez', 'Mide varias veces'], ['Mejora el diseño', 'No cambia', 'Cambia sin justificar', 'Cambia y justifica']),
  err: ['Poner demasiada agua (el cohete se hace pesado).', 'Pensar que el aire «empuja» desde afuera.'],
  ext: ['Probar con cono y sin cono.', 'Calcular la altura con trigonometría simple.']
};

window.MAKER['energias-renovables'] = {
  dur: '60 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas despejadas y ventana soleada',
  obj: 'Construir modelos de energía solar y eólica y comparar su rendimiento.',
  lab: 'Antes: «Energías renovables» diseña la central de una ciudad. Después: comparar con modelos reales.',
  mat: [
    ['Panel solar pequeño con motor o LED', '1 por equipo', 'Energía solar'],
    ['Motor DC con hélice', '1 por equipo', 'Generador eólico'],
    ['Ventilador pequeño', '1 por grupo', 'Viento'],
    ['Multímetro', '1 por grupo', 'Medir voltaje'],
    ['Cables con caimanes', '4 por equipo', 'Conexiones'],
    ['Cartón y palitos', '1 por equipo', 'Estructura de la turbina'],
    ['Lámpara', '1 por grupo', 'Luz controlada'],
    ['Hoja de registro', '1 por equipo', 'Voltaje · condición']
  ],
  herr: ['Tijeras', 'Cinta'],
  prep: ['Prepara paneles y motores.', 'Cuenta multímetros por grupo.', 'Marca distancias de la lámpara.'],
  seg: ['Solo bajo voltaje; sin enchufes.', 'Hélices: lejos de la cara.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿De dónde sale la luz de la ciudad?', x: ['Pregunta qué fuentes de energía conocen.'] },
    { f: 'Explorar', min: 20, t: 'Medimos', x: ['Con el panel miden voltaje a distintas distancias de la lámpara.', 'Con el motor y el ventilador miden voltaje a distintas velocidades.'] },
    { f: 'Explicar', min: 10, t: 'Renovables', x: ['Solar y eólica son renovables; dependen del clima.', 'Pregunta: «¿Qué pasa de noche o sin viento?».'] },
    { f: 'Elaborar', min: 20, t: 'Diseñamos la central', x: ['Reto: combinar panel y turbina para mantener un LED encendido.', 'Proponen un sistema de almacenamiento (batería).'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo presenta sus datos y una conclusión.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué influye en la energía solar?', '¿Qué hacer cuando no hay viento?', '¿Por qué almacenar energía?'],
  rub: rub5(['Mide voltaje', 'No mide', 'Mide una vez', 'Mide varias condiciones'], ['Diseña una solución', 'No diseña', 'Diseña con una fuente', 'Combina fuentes']),
  err: ['Creer que las renovables son siempre constantes.', 'Pensar que las baterías generan energía.'],
  ext: ['Calcular el consumo de una bombilla.', 'Investigar parques eólicos en Colombia.']
};

window.MAKER['algoritmos-datos'] = {
  dur: '55 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas con papel grande y marcadores',
  obj: 'Recolectar datos con una encuesta, organizarlos en una tabla y representarlos con la gráfica adecuada.',
  lab: 'Antes: «Datos y gráficas» registra votos y elige gráficas. Después: comparar la gráfica del Makerspace con la digital.',
  mat: [
    ['Fichas o stickers', '30 por equipo', 'Votos'],
    ['Pliegos de papel o cartulina', '2 por equipo', 'Gráfica'],
    ['Reglas y marcadores de colores', '1 juego por equipo', 'Dibujar'],
    ['Hojas cuadriculadas', '2 por estudiante', 'Gráficas precisas'],
    ['Calculadoras', '1 por equipo', 'Porcentajes'],
    ['Tablet con hoja de cálculo (opcional)', '1 por grupo', 'Graficar'],
    ['Hoja de registro', '1 por equipo', 'Tabla de conteo']
  ],
  herr: ['Tijeras', 'Cinta'],
  prep: ['Prepara preguntas de encuesta (frutas, deportes, mascotas).', 'Imprime plantillas de tabla.', 'Asigna roles: Encuestador, Contador, Graficador, Presentador.'],
  seg: ['Sin riesgos especiales; cuidar que las preguntas no sean ofensivas.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿Qué prefiere el grupo?', x: ['Pregunta: «¿Cuál es la fruta favorita del curso?» y recoge manos.'] },
    { f: 'Explorar', min: 15, t: 'Encuesta y tabla', x: ['Cada equipo hace una encuesta a 20 compañeros y llena una tabla de conteo.', 'Calculan totales y porcentajes.'] },
    { f: 'Explicar', min: 10, t: 'Tipos de gráficas', x: ['Barras para comparar categorías, líneas para cambios en el tiempo, círculos para partes de un total.', 'Pregunta: «¿Cuál usarías para esta encuesta?».'] },
    { f: 'Elaborar', min: 20, t: 'Construimos la gráfica', x: ['Dibujan la gráfica con título, ejes y escala.', 'Reto: escribir tres conclusiones con los datos.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo presenta su gráfica y una conclusión.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué gráfica es mejor para este dato? ¿Por qué?', '¿Qué conclusión se ve a simple vista?', '¿Cómo cambiaría la gráfica con más encuestados?'],
  rub: rub5(['Organiza datos', 'Datos desordenados', 'Tabla con errores', 'Tabla correcta con totales'], ['Elige la gráfica', 'No la elige', 'La elige sin justificar', 'La elige y justifica']),
  err: ['Escala del eje sin intervalos iguales.', 'Usar círculo cuando no hay un total.'],
  ext: ['Hacer una hoja de cálculo con los datos.', 'Comparar dos grupos de encuestados.']
};
