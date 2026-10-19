/* Guías Makerspace · Grado 6° (ver plantilla en makerspace.js) */
window.MAKER = window.MAKER || {};
function rub6(a, b) { return [a, b, ['Registra datos con unidades y gráfica', 'Registro incompleto', 'Registra los datos principales', 'Registra tabla, unidades, gráfica y error'], ['Trabajo en equipo', 'Trabaja solo/a', 'Cumple su rol con recordatorios', 'Cumple su rol, ayuda a los demás y documenta']]; }

window.MAKER.circuitos = {
  dur: '60 minutos', equipo: 'Equipos de 3–4 estudiantes', espacio: 'Mesas despejadas; sin líquidos cerca',
  obj: 'Construir circuitos con resistencias, LED e interruptores y diseñar un semáforo con una secuencia lógica.',
  lab: 'Antes: «Laboratorio de circuitos» arma circuitos hasta el semáforo. Después: reproducir el semáforo con componentes reales.',
  mat: [
    ['Protoboard', '1 por equipo', 'Sin soldar'],
    ['Portapilas 4×AA (6 V) o fuente de 5 V USB', '1 por equipo', 'Alimentación segura'],
    ['LED rojo, amarillo y verde', '3 por equipo', 'Semáforo'],
    ['Resistencias de 220 Ω', '3 por equipo', 'Proteger los LED'],
    ['Pulsadores', '2 por equipo', 'Interruptores'],
    ['Cables jumper', '15 por equipo', 'Conexiones'],
    ['Multímetro', '1 por grupo', 'Medir'],
    ['Placa Arduino o micro:bit (opcional)', '1 por equipo', 'Secuencia automática']
  ],
  herr: ['Pinzas de punta (docente)', 'Cinta aislante'],
  prep: ['Revisa componentes y marca la polaridad de los LED.', 'Prepara el esquema del semáforo.', 'Si usas micro:bit/Arduino, carga el programa.'],
  seg: ['Solo bajo voltaje (5–6 V); nunca conectar a la red.', 'No conectar un LED sin resistencia.', 'Desconectar la pila al modificar el montaje.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿Cómo funciona un semáforo?', x: ['Muestra un semáforo real o video y pregunta: «¿Qué componentes necesita?».'] },
    { f: 'Explorar', min: 18, t: 'Circuito simple', x: ['Conectan pila + resistencia + LED en la protoboard y verifican que enciende.', 'Invierten el LED para ver qué pasa (polaridad).'] },
    { f: 'Explicar', min: 10, t: 'Resistencia y corriente', x: ['La resistencia limita la corriente: I = V / R.', 'Calculan por qué se usa 220 Ω con LED.'] },
    { f: 'Elaborar', min: 22, t: 'Semáforo', x: ['Conectan 3 LED con pulsadores y diseñan la secuencia rojo → verde → amarillo.', 'Reto: agregar un pulsador peatonal.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo demuestra su semáforo y explica su circuito.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué pasa si el LED se invierte?', '¿Por qué hace falta una resistencia?', '¿Cómo cambia el circuito en serie vs. paralelo?'],
  rub: rub6(['Arma el circuito', 'No funciona', 'Funciona con ayuda', 'Funciona y lo explica'], ['Diseña el semáforo', 'No', 'Dos luces', 'Tres luces y secuencia']),
  err: ['Conectar el LED sin resistencia.', 'Confundir cátodo y ánodo.'],
  ext: ['Programar el semáforo con micro:bit o Arduino.', 'Agregar un sensor de luz.']
};

window.MAKER['ley-ohm'] = {
  dur: '60 minutos', equipo: 'Equipos de 3–4 estudiantes', espacio: 'Mesas despejadas',
  obj: 'Comprobar experimentalmente la ley de Ohm midiendo voltaje y corriente con distintas resistencias.',
  lab: 'Antes: «Ley de Ohm» cambia voltaje y resistencia en pantalla. Después: comparar mediciones reales con el laboratorio.',
  mat: [
    ['Fuente variable 0–9 V (o pilas de 1,5 V)', '1 por equipo', 'Voltajes distintos'],
    ['Resistencias de 100, 220, 470 Ω y 1 kΩ', '1 de cada por equipo', 'Distintas R'],
    ['Multímetro', '1 por equipo', 'Voltaje y corriente'],
    ['Protoboard y cables', '1 por equipo', 'Montaje'],
    ['LED', '2 por equipo', 'Indicador'],
    ['Hoja de registro con gráfica V–I', '1 por equipo', 'Datos'],
    ['Calculadora', '1 por equipo', 'Cálculos']
  ],
  herr: ['Pinzas', 'Regla para graficar'],
  prep: ['Verifica que los multímetros midan en mA.', 'Prepara el circuito de ejemplo.', 'Imprime la tabla.'],
  seg: ['Voltajes bajos; nunca mA con el multímetro en paralelo.', 'Desconectar antes de cambiar resistencias.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿Por qué se calienta un cable?', x: ['Pregunta: «¿Qué relación hay entre voltaje y corriente?».'] },
    { f: 'Explorar', min: 20, t: 'Medimos V e I', x: ['Para cada resistencia, varían el voltaje y registran la corriente.', 'Calculan V/I y comparan con R.'] },
    { f: 'Explicar', min: 10, t: 'V = I × R', x: ['La corriente es proporcional al voltaje e inversa a la resistencia.', 'Revisan la gráfica V–I (recta).'] },
    { f: 'Elaborar', min: 20, t: 'Calculamos la resistencia del LED', x: ['Reto: calcular R para un LED de 2 V y 20 mA con una fuente de 6 V.', 'Comprueban con el montaje.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo presenta su gráfica y la ecuación.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué pasa con I al aumentar V?', '¿Qué pasa con I al aumentar R?', '¿Por qué se calculan resistencias para los LED?'],
  rub: rub6(['Mide V e I', 'No mide', 'Mide una resistencia', 'Mide varias y grafica'], ['Aplica V = I·R', 'No', 'Con ayuda', 'Aplica y comprueba']),
  err: ['Confundir voltaje, corriente y resistencia.', 'Medir corriente en paralelo.'],
  ext: ['Medir resistencias en serie y paralelo.', 'Investigar materiales no óhmicos (bombilla).']
};

window.MAKER['tabla-periodica'] = {
  dur: '60 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas amplias con espacio en la pared',
  obj: 'Construir una tabla periódica de gran formato, clasificando elementos en familias y relacionando su posición con propiedades.',
  lab: 'Antes: «Tabla periódica» explora los 36 primeros elementos. Después: comparar con el mural del Makerspace.',
  mat: [
    ['Tarjetas de 36 elementos (símbolo, nombre, Z)', '1 juego por equipo', 'Impresas'],
    ['Papel kraft de 1,5 × 1 m', '1 por grupo', 'Tabla grande'],
    ['Marcadores o stickers de colores', '1 juego', 'Familias (metales, no metales, gases nobles)'],
    ['Pegamento en barra y cinta', '1 por equipo', 'Pegar'],
    ['Muestras de materiales (cobre, aluminio, azufre, carbón)', '1 caja por grupo', 'Mostrar elementos reales'],
    ['Imán', '1 por equipo', 'Probar propiedades'],
    ['Hoja de registro', '1 por equipo', 'Propiedades observadas']
  ],
  herr: ['Regla', 'Tijeras'],
  prep: ['Imprime y recorta las tarjetas.', 'Dibuja la cuadrícula en el kraft.', 'Prepara muestras seguras.'],
  seg: ['Muestras selladas; no tocar azufre con las manos si hay alergias.', 'Lavado de manos.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'Elemento misterioso', x: ['Muestra cobre y pregunta: «¿Qué es y dónde se usa?».'] },
    { f: 'Explorar', min: 20, t: 'Ordenamos', x: ['Cada equipo coloca sus tarjetas por número atómico en la cuadrícula.', 'Colorean por familia: metales, no metales y gases nobles.'] },
    { f: 'Explicar', min: 10, t: 'Periodos y grupos', x: ['Filas = periodos; columnas = grupos con propiedades parecidas.', 'Pregunta: «¿Qué tienen en común los gases nobles?».'] },
    { f: 'Elaborar', min: 20, t: 'Predecimos', x: ['Con las muestras prueban conductividad y magnetismo y ubican cada una en la tabla.', 'Reto: predecir propiedades de un elemento vecino.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo presenta una familia.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué patrón sigue el número atómico?', '¿Por qué los gases nobles son poco reactivos?', '¿Dónde están los metales?'],
  rub: rub6(['Ordena por Z', 'Ordena menos de la mitad', 'Ordena la mitad', 'Ordena casi todo'], ['Clasifica familias', 'No', 'Algunas', 'Todas con criterios']),
  err: ['Creer que el orden es alfabético.', 'Confundir número atómico y masa.'],
  ext: ['Ampliar a los 54 primeros elementos.', 'Investigar a Mendeléyev.']
};

window.MAKER.reacciones = {
  dur: '60 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Laboratorio o mesas con lavamanos; ventilado',
  obj: 'Observar reacciones químicas seguras, balancear ecuaciones y comprobar la conservación de la masa.',
  lab: 'Antes: «Reacciones químicas» balancea ecuaciones. Después: comparar con la reacción real.',
  mat: [
    ['Bicarbonato de sodio y vinagre', '3 cucharadas y 100 mL', 'Reacción con gas'],
    ['Globos', '2 por equipo', 'Capturar el gas'],
    ['Botellas pequeñas', '2 por equipo', 'Reactor'],
    ['Balanza de cocina', '1 por equipo', 'Conservación de masa'],
    ['Pastilla efervescente y agua', '1 por equipo', 'Segunda reacción'],
    ['Gafas y guantes', '1 por estudiante', 'Protección'],
    ['Hoja de registro', '1 por equipo', 'Masa inicial y final']
  ],
  herr: ['Cucharas', 'Cuentagotas'],
  prep: ['Mide las cantidades y rotula.', 'Prueba la reacción antes de la clase.', 'Ventila el salón.'],
  seg: ['Gafas y guantes obligatorios.', 'No probar sustancias ni sellar recipientes sin salida de gas.', 'Limpiar derrames.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿Qué es un cambio químico?', x: ['Mezcla bicarbonato y vinagre y pregunta qué evidencias hay de que algo nuevo se formó.'] },
    { f: 'Explorar', min: 20, t: 'Medimos la masa', x: ['Pesan el sistema cerrado (botella + globo) antes y después de la reacción.', 'Comparan las masas.'] },
    { f: 'Explicar', min: 10, t: 'Conservación', x: ['La masa total se conserva: los átomos se reordenan.', 'Balancean NaHCO₃ + CH₃COOH → CO₂ + ...'] },
    { f: 'Elaborar', min: 20, t: 'Balanceamos', x: ['Con fichas representan átomos y balancean 3 ecuaciones sencillas (H₂ + O₂ → H₂O).', 'Registran los coeficientes.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo explica por qué la masa no cambió.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué evidencias indican una reacción?', '¿Por qué la masa no cambió en el sistema cerrado?', '¿Qué significan los coeficientes?'],
  rub: rub6(['Mide masas', 'No mide', 'Mide una vez', 'Mide antes y después'], ['Balancea ecuaciones', 'No', '1 o 2', 'Las 3 con justificación']),
  err: ['Cambiar los subíndices al balancear.', 'Creer que el gas «pesa cero».'],
  ext: ['Probar otra reacción efervescente.', 'Investigar la ley de Lavoisier.']
};

window.MAKER.fotosintesis = {
  dur: '60 minutos (con seguimiento)', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesa con luz natural',
  obj: 'Observar la fotosíntesis en una planta acuática y relacionar la luz con la producción de oxígeno.',
  lab: 'Antes: «Fotosíntesis» mide burbujas de oxígeno en una planta acuática. Después: comparar con el experimento real.',
  mat: [
    ['Planta acuática (elodea)', '1 ramita por equipo', 'Productora de burbujas'],
    ['Vaso alto transparente', '1 por equipo', 'Cámara'],
    ['Bicarbonato (pizca)', '1 por equipo', 'CO₂'],
    ['Lámpara de escritorio', '1 por grupo', 'Luz controlada'],
    ['Regla y cronómetro', '1 por equipo', 'Distancia de la lámpara'],
    ['Hoja de registro', '1 por equipo', 'Distancia · burbujas por minuto'],
    ['Caja de cartón', '1 por equipo', 'Condición sin luz']
  ],
  herr: ['Lupa', 'Marcadores'],
  prep: ['Consigue elodea o planta acuática del acuario.', 'Prepara vasos con agua del grifo reposada.', 'Ubica lámparas a distancias marcadas.'],
  seg: ['Lámpara caliente: no tocar.', 'Lavar manos tras manipular plantas.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'Burbujas en el agua', x: ['Muestra una ramita con burbujas y pregunta qué son.'] },
    { f: 'Explorar', min: 20, t: 'Contamos burbujas', x: ['Colocan la lámpara a 10, 20 y 40 cm y cuentan burbujas por minuto.', 'Registran en la tabla.'] },
    { f: 'Explicar', min: 10, t: 'Luz y fotosíntesis', x: ['Las plantas usan luz, agua y CO₂ para producir glucosa y O₂.', 'Más luz, más burbujas (hasta un límite).'] },
    { f: 'Elaborar', min: 20, t: 'Gráfica y factor limitante', x: ['Grafican burbujas vs. distancia.', 'Reto: agregar bicarbonato y ver si aumenta (CO₂ como factor).'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo concluye con datos.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué producen las burbujas?', '¿Qué pasó al alejar la lámpara?', '¿Qué otro factor podría limitar la fotosíntesis?'],
  rub: rub6(['Cuenta burbujas', 'No cuenta', 'Cuenta una vez', 'Cuenta varias veces'], ['Grafica y concluye', 'No grafica', 'Grafica sin concluir', 'Grafica y concluye']),
  err: ['Creer que las plantas «respiran» solo de noche.', 'Contar burbujas sin tiempo fijo.'],
  ext: ['Probar con luz de colores.', 'Comparar con una planta sin luz.']
};

window.MAKER.proyectil = {
  dur: '60 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Patio o pasillo largo (10 m)',
  obj: 'Investigar cómo el ángulo de lanzamiento y la velocidad afectan el alcance de un proyectil.',
  lab: 'Antes: «Tiro parabólico» dispara un cañón y cambia la gravedad. Después: comparar con lanzamientos reales.',
  mat: [
    ['Catapultas de cuchara o lanzadores de pelotas', '1 por equipo', 'Lanzador'],
    ['Pelotas pequeñas de goma o papel', '5 por equipo', 'Proyectil'],
    ['Cinta métrica de 10 m', '1 por grupo', 'Alcance'],
    ['Transportador', '1 por equipo', 'Medir ángulos'],
    ['Cinta de enmascarar', '1 rollo', 'Marcar posiciones'],
    ['Cronómetro', '1 por equipo', 'Tiempo de vuelo'],
    ['Hoja de registro', '1 por equipo', 'Ángulo · distancia']
  ],
  herr: ['Regla', 'Calculadora'],
  prep: ['Marca una línea de lanzamiento y una zona libre.', 'Construye una catapulta modelo.', 'Define una línea de seguridad.'],
  seg: ['Nadie delante de la línea de lanzamiento.', 'Usar pelotas livianas y gafas.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'Qué trayectoria sigue una pelota', x: ['Lanza una pelota y pregunta: «¿Qué forma tiene su camino?».'] },
    { f: 'Explorar', min: 20, t: 'Lanzamos a distintos ángulos', x: ['Lanzan con 15°, 30°, 45°, 60° y 75° con la misma fuerza y miden el alcance.', 'Registran 3 lanzamientos por ángulo.'] },
    { f: 'Explicar', min: 10, t: 'La parábola', x: ['El alcance máximo ocurre cerca de 45° sin resistencia del aire.', 'La gravedad curva la trayectoria.'] },
    { f: 'Elaborar', min: 20, t: 'Acierta el blanco', x: ['Reto: dar en un blanco a 5 m ajustando solo el ángulo.', 'Grafican alcance vs. ángulo.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo concluye con su gráfica.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué ángulo dio mayor alcance?', '¿Qué efecto tiene la gravedad?', '¿Qué cambiaría en la Luna?'],
  rub: rub6(['Mide alcance', 'No mide', 'Mide una vez', 'Mide 3 veces y promedia'], ['Grafica alcance vs. ángulo', 'No grafica', 'Grafica sin analizar', 'Grafica y analiza']),
  err: ['Creer que 90° da el mayor alcance.', 'Cambiar fuerza y ángulo a la vez.'],
  ext: ['Medir velocidad inicial con cronómetro.', 'Simular en la Luna con la herramienta digital.']
};

window.MAKER.astronomia = {
  dur: '60 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Salón oscurecido',
  obj: 'Modelar la vida de las estrellas y relacionar masa, color y temperatura con su evolución.',
  lab: 'Antes: «Galaxias y estrellas» relaciona masa y destino. Después: comparar con el modelo.',
  mat: [
    ['Globos de distintos tamaños', '6 por equipo', 'Estrellas'],
    ['Pintura o papel celofán de colores (rojo, amarillo, azul)', 'Varios', 'Temperatura'],
    ['Cartulina negra y pegatinas', '1 por equipo', 'Cielo'],
    ['Linterna', '1 por equipo', 'Luz'],
    ['Tarjetas de etapas (nebulosa → estrella → supernova)', '1 juego por equipo', 'Ordenar'],
    ['Hoja con diagrama HR simplificado', '1 por equipo', 'Color y brillo'],
    ['Marcadores', '1 caja', 'Dibujar']
  ],
  herr: ['Tijeras de punta redonda', 'Regla'],
  prep: ['Infla algunos globos.', 'Imprime tarjetas y diagramas.', 'Oscurece el salón.'],
  seg: ['Globos: alergia al látex posible.', 'No mirar la linterna a los ojos.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'Las estrellas nacen y mueren', x: ['Muestra una imagen de una nebulosa y pregunta qué creen que ocurre allí.'] },
    { f: 'Explorar', min: 15, t: 'Ordenamos el ciclo', x: ['Ordenan tarjetas del ciclo de una estrella como el Sol y de una estrella masiva.'] },
    { f: 'Explicar', min: 10, t: 'Masa y destino', x: ['Masa pequeña: enana blanca. Mucha masa: supernova y estrella de neutrones o agujero negro.', 'Color: rojas más frías, azules más calientes.'] },
    { f: 'Elaborar', min: 25, t: 'Modelo de estrellas', x: ['Con globos de distinto tamaño y color modelan estrellas de distintas masas.', 'Reto: ubicarlas por color y brillo en el diagrama.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo narra la vida de una estrella.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué determina el destino de una estrella?', '¿Qué color indica mayor temperatura?', '¿De dónde vienen los átomos de nuestro cuerpo?'],
  rub: rub6(['Ordena el ciclo', 'Ordena 2', 'Ordena 3', 'Ordena todo'], ['Relaciona masa y destino', 'No', 'Con ayuda', 'Con claridad']),
  err: ['Creer que el Sol explotará como supernova.', 'Pensar que las estrellas rojas son las más calientes.'],
  ext: ['Observar estrellas y reconocer colores.', 'Investigar cuándo morirá el Sol.']
};

window.MAKER.robotica = {
  dur: '60 minutos', equipo: 'Equipos de 3–4 estudiantes', espacio: 'Mesas despejadas y una pista de pruebas',
  obj: 'Construir y programar un robot sencillo que evite obstáculos con un sensor y decisiones «si… entonces».',
  lab: 'Antes: «Robótica y sensores» enseña eco ultrasónico y programación. Después: comparar con el robot real.',
  mat: [
    ['Robot educativo (micro:bit, Arduino, mBot)', '1 por equipo', 'Plataforma'],
    ['Sensor ultrasónico', '1 por equipo', 'Distancia'],
    ['Pista con obstáculos de cartón', '1 por grupo', 'Pruebas'],
    ['Cinta métrica', '1 por grupo', 'Calibrar'],
    ['Pilas o baterías', '1 por equipo', 'Energía'],
    ['Computador o tablet', '1 por equipo', 'Programar'],
    ['Hoja de diseño de algoritmo', '1 por equipo', 'Diagrama de flujo']
  ],
  herr: ['Destornillador', 'Cinta'],
  prep: ['Carga baterías y verifica robots.', 'Prepara programas base.', 'Monta la pista.'],
  seg: ['Cables y batería: no cortocircuitar.', 'Cuidar los dedos con ruedas.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'Cómo ve un robot', x: ['Pregunta: «¿Cómo evita un robot chocar con la pared?».'] },
    { f: 'Explorar', min: 20, t: 'Medimos con el sensor', x: ['Con el sensor miden distancias a un obstáculo y comparan con la cinta.', 'Calibran el error.'] },
    { f: 'Explicar', min: 10, t: 'Si… entonces', x: ['Algoritmo: si distancia < 20 cm, entonces girar.', 'Dibujan el diagrama de flujo.'] },
    { f: 'Elaborar', min: 20, t: 'Programamos', x: ['Programan el robot para recorrer la pista sin chocar.', 'Mejoran la velocidad y precisión.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo demuestra y explica su algoritmo.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Cómo mide distancias el sensor?', '¿Qué regla «si… entonces» usaste?', '¿Cómo mejorarías tu robot?'],
  rub: rub6(['Programa decisiones', 'No', 'Una regla', 'Varias reglas'], ['Recorre la pista', 'Choca siempre', 'Choca a veces', 'Sin choques']),
  err: ['Umbral de distancia demasiado pequeño.', 'No probar en distintas superficies.'],
  ext: ['Agregar un segundo sensor.', 'Hacer que siga una línea.']
};

window.MAKER['mecanica-fluidos'] = {
  dur: '60 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas con bandejas; cerca de lavamanos',
  obj: 'Construir una prensa hidráulica y comprobar el principio de Pascal; medir presión con la profundidad.',
  lab: 'Antes: «Presión y fluidos» presenta Pascal y profundidad. Después: comparar con la prensa real.',
  mat: [
    ['Jeringas de 5 mL y 20 mL', '2 por equipo', 'Émbolos distintos'],
    ['Manguera transparente', '30 cm por equipo', 'Conectar'],
    ['Agua con colorante', '1 vaso por equipo', 'Fluido'],
    ['Libros o pesas pequeñas', '3 por equipo', 'Carga'],
    ['Botella con agujeros a distinta altura', '1 por equipo', 'Presión por profundidad'],
    ['Bandeja y toallas', '1 por equipo', 'Derrames'],
    ['Regla y cinta', '1 por equipo', 'Medir']
  ],
  herr: ['Marcadores', 'Cinta'],
  prep: ['Conecta las jeringas con manguera y llénalas sin aire.', 'Prepara la botella con agujeros.', 'Cubre las mesas.'],
  seg: ['Limpiar derrames inmediatamente.', 'No apuntar jeringas a las personas.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: 'Mueve algo grande con poca fuerza', x: ['Pregunta: «¿Cómo levanta un gato hidráulico un auto?».'] },
    { f: 'Explorar', min: 20, t: 'Prensa de jeringas', x: ['Empujan el émbolo pequeño y miden cuánto sube el grande.', 'Cambian jeringas y comparan.'] },
    { f: 'Explicar', min: 10, t: 'Pascal', x: ['La presión se transmite igual; fuerza = presión × área.', 'Calculan la ventaja mecánica.'] },
    { f: 'Elaborar', min: 20, t: 'Presión y profundidad', x: ['En la botella con agujeros observan cómo sale el agua según la altura.', 'Reto: explicar por qué sale más lejos el chorro de abajo.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo presenta sus datos.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Qué émbolo requiere menos fuerza?', '¿Por qué sale más lejos el chorro inferior?', '¿Dónde usamos prensas hidráulicas?'],
  rub: rub6(['Aplica Pascal', 'No', 'Con ayuda', 'Calcula y comprueba'], ['Relaciona presión y profundidad', 'No', 'Parcial', 'Con explicación']),
  err: ['Dejar aire en el sistema.', 'Creer que el fluido «se comprime».'],
  ext: ['Medir ventaja mecánica con distintos pares de jeringas.', 'Investigar los frenos hidráulicos.']
};

window.MAKER.adn = {
  dur: '60 minutos', equipo: 'Equipos de 4 estudiantes', espacio: 'Mesas del Makerspace; lavamanos cerca',
  obj: 'Extraer ADN de una fruta y construir un modelo de doble hélice con pares de bases.',
  lab: 'Antes: «ADN» empareja bases y traduce codones. Después: comparar el modelo físico con el digital.',
  mat: [
    ['Fresas o banano', '1 por equipo', 'Fuente de ADN'],
    ['Detergente líquido y sal', '1 cucharada por equipo', 'Romper membranas'],
    ['Alcohol etílico (frío) o antiséptico 70 %', '30 mL por equipo', 'Precipitar el ADN (docente)'],
    ['Bolsa sellable y filtro de café', '1 por equipo', 'Triturar y filtrar'],
    ['Palito de madera', '1 por equipo', 'Recoger el ADN'],
    ['Cuentas de 4 colores y limpiapipas', '24 cuentas por equipo', 'Modelo de bases A, T, C, G'],
    ['Cinta y marcadores', '1 rollo', 'Rotular'],
    ['Gafas y guantes', '1 por estudiante', 'Protección']
  ],
  herr: ['Vaso medidor', 'Tijeras de punta redonda'],
  prep: ['Enfría el alcohol en el refrigerador.', 'Mezcla agua, detergente y sal.', 'Prepara cuentas por color.'],
  seg: ['Alcohol: inflamable y sin ingerir; solo el docente lo sirve.', 'Gafas y guantes.', 'Lavar manos.'],
  pasos: [
    { f: 'Enganchar', min: 5, t: '¿Podemos ver el ADN?', x: ['Pregunta: «¿Dónde está el ADN en una fruta?».'] },
    { f: 'Explorar', min: 20, t: 'Extraemos ADN', x: ['Trituran la fruta en la bolsa con la mezcla de detergente y sal.', 'Filtran y agregan alcohol frío por el borde del vaso.', 'Observan los filamentos blancos y los recogen con el palito.'] },
    { f: 'Explicar', min: 10, t: 'Estructura del ADN', x: ['Doble hélice formada por pares de bases: A-T y C-G.', 'El detergente rompe las membranas; el alcohol hace visible el ADN.'] },
    { f: 'Elaborar', min: 20, t: 'Modelo de doble hélice', x: ['Con cuentas y limpiapipas arman un tramo de ADN de 6 pares.', 'Reto: escribir la hebra complementaria de una secuencia dada.'] },
    { f: 'Evaluar', min: 5, t: 'Cierre', x: ['Cada equipo explica su modelo.', 'Conecta con el laboratorio digital.'] }
  ],
  preg: ['¿Por qué se agrega detergente?', '¿Qué base se empareja con la A?', '¿Qué función tiene el ADN?'],
  rub: rub6(['Extrae ADN', 'No', 'Con ayuda', 'Obtiene y explica'], ['Empareja bases', 'Errores en la mayoría', 'Acierta la mitad', 'Todas correctas']),
  err: ['Creer que el ADN solo existe en animales.', 'Confundir ADN con cromosoma.'],
  ext: ['Extraer ADN de otras frutas.', 'Traducir una secuencia a aminoácidos.']
};
