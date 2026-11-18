// Genera data/guion_v3.json (sin CTAs). Formato: [tipo, modo, texto, pill1, pill2, items?]
const fs = require('fs');
const root = require('path').resolve(__dirname, '..');
const hook = JSON.parse(fs.readFileSync(root + '/data/guion_v3_hook.json', 'utf8'));
const D = [
 // --- B: Maxwell y la medida de la velocidad
 ['maxwell','', 'Maxwell juntó las leyes de la electricidad y del magnetismo, y descubrió que un campo que cambia crea al otro.', 'Electricidad + magnetismo', 'Un campo crea al otro'],
 ['maxwell','', 'Un campo eléctrico que oscila crea un campo magnético, y ese crea otro eléctrico. Se empujan mutuamente a través del espacio, como una onda.', 'E crea B, B crea E', 'Una onda en el espacio'],
 ['maxwell','', 'Y la velocidad de esa onda salió de sus ecuaciones sin buscarla: uno dividido entre la raíz de dos constantes, la eléctrica y la magnética.', 'Salió de las ecuaciones', 'Dos constantes: ε₀ y μ₀'],
 ['maxwell','', 'Calculó el valor, y era casi exactamente la velocidad de la luz que ya se había medido. Maxwell comprendió que la luz es una onda electromagnética.', 'Coincidía con la luz', 'La luz es una onda'],
 ['tierrasol','v', 'Antes, en mil seiscientos setenta y seis, Rømer ya había estimado esa velocidad observando las lunas de Júpiter.', 'Rømer, 1676', 'Lunas de Júpiter'],
 ['foton','', 'Pero había un problema. Las ecuaciones daban una velocidad fija, y no decían respecto a qué. ¿Respecto a quién se mide?', '¿Respecto a qué?', 'Un problema enorme', [['velocidad','reloj','¿respecto a qué?']]],
 ['foton','', 'Todo lo que conocemos tiene velocidad relativa. Si corres detrás de un tren, el tren va más despacio para ti que para alguien parado.', 'La velocidad es relativa', 'Corres tras un tren', [['tren','motor','tren'],['corres','mano']]],
 ['foton','', 'Los físicos pensaron que la luz viajaba por un medio invisible, el éter, como el sonido viaja por el aire. Su velocidad sería respecto al éter.', 'El éter', 'Como el sonido en el aire', [['éter','agua','éter'],['sonido','altavoz']]],
 ['tierrasol','v', 'En mil ochocientos ochenta y siete, Michelson y Morley intentaron medir ese viento de éter con un experimento finísimo. No encontraron nada.', 'Michelson y Morley, 1887', 'No encontraron nada'],
 ['foton','', 'La luz iba igual de rápido en todas las direcciones, aunque la Tierra se mueve a treinta kilómetros por segundo. Parecía imposible.', 'Igual en todas direcciones', 'Parecía imposible', [['Tierra','tierra','30 km/s']]],
 ['foton','', 'Fue uno de los resultados nulos más importantes de toda la historia de la física.', 'Un resultado nulo histórico', '', [['nulos','rayo','resultado nulo',true]]],
 // --- C: Einstein 1905
 ['foton','', 'Einstein, con veintiséis años, hizo lo contrario que todos: aceptó el resultado, y se preguntó qué significaba de verdad.', 'Einstein, 1905', 'Aceptar el resultado', [['Einstein','libro','1905']]],
 ['foton','', 'Propuso dos principios. Uno: las leyes de la física son las mismas para cualquiera que se mueva con velocidad constante.', 'Principio 1', 'Mismas leyes para todos', [['leyes','libro']]],
 ['foton','', 'Dos: la velocidad de la luz en el vacío es la misma para cualquier observador, sin importar cómo se mueva él o la fuente.', 'Principio 2', 'c es igual para todos', [['velocidad','reloj']]],
 ['barras','c', 'Si corres detrás de un rayo de luz a la mitad de su velocidad, lo sigues midiendo a la velocidad de la luz. No se resta nada.', 'Corres tras la luz', 'Sigues midiendo c'],
 ['foton','', 'Eso rompe el sentido común. Y para que sea cierto, algo más tiene que ceder: el espacio y el tiempo.', 'Algo tiene que ceder', 'Espacio y tiempo', [['sentido','rayo','sentido común',true]]],
 // --- D: espacio-tiempo
 ['minkowski','ejes', 'Para verlo, los físicos dibujan un mapa con dos ejes: el espacio, en horizontal, y el tiempo, en vertical.', 'Un mapa del espacio-tiempo', 'Espacio ↔ tiempo'],
 ['minkowski','mundo', 'Cada punto es un suceso: un lugar y un momento. Tú, mientras lees esto, trazas una línea que sube: tu línea de vida.', 'Cada punto, un suceso', 'Tu línea de vida'],
 ['minkowski','mundo', 'Cuanto más rápido te mueves por el espacio, más se inclina esa línea. Pero hay una inclinación que nunca podrás alcanzar.', 'Más rápido = más inclinada', 'Un límite de inclinación'],
 ['minkowski','luz', 'Esa inclinación es la de la luz: cuarenta y cinco grados, cuando medimos el tiempo en unidades de distancia.', 'La luz: 45°', 'Tiempo en unidades de distancia'],
 ['minkowski','luz', 'Un segundo en vertical equivale a casi trescientos mil kilómetros en horizontal. Es un cambio de unidades entre espacio y tiempo.', '1 s = 299 792 km', 'Un cambio de unidades'],
 ['foton','', 'Ahí está el primer secreto. La velocidad de la luz no es una velocidad cualquiera: es el factor que convierte segundos en metros.', 'Primer secreto', 'c convierte segundos en metros', [['segundos','reloj'],['metros','pared','metros']]],
 ['foton','', 'Es como el cambio entre pulgadas y centímetros: no habla de lo que se mide, sino de cómo lo medimos.', 'Como pulgadas ↔ centímetros', '', [['pulgadas','libro'],['centímetros','caja']]],
 ['foton','', 'De hecho, desde mil novecientos ochenta y tres el metro se define a partir de ella: doscientos noventa y nueve millones setecientos noventa y dos mil cuatrocientos cincuenta y ocho metros por segundo.', 'Desde 1983 define el metro', '299 792 458 m/s', [['metro','pared']]],
 ['foton','', 'No se mide: se fija por definición. Si cambiaras de unidades, el número cambiaría, pero la física seguiría exactamente igual.', 'Se fija por definición', 'Otras unidades, misma física', [['unidades','caja']]],
 // --- E: conos y causalidad
 ['minkowski','cono', 'Esas dos líneas de luz forman un cono. Todo lo que queda dentro es tu futuro: lo que puedes alcanzar o influir.', 'El cono de luz', 'Dentro: tu futuro'],
 ['minkowski','cono', 'Todo lo que queda fuera del cono es inalcanzable. Nada de lo que hagas ahora puede afectarlo.', 'Fuera: inalcanzable', 'Sin influencia posible'],
 ['tierrasol','gravedad', 'Por eso, si el Sol desapareciera de repente, la Tierra seguiría en su órbita durante ocho minutos y veinte segundos.', 'El Sol desaparece', 'La Tierra sigue 8 min 20 s'],
 ['tierrasol','gravedad', 'Porque la gravedad también viaja a esa velocidad. El cono de luz limita cualquier influencia, no solo la de la luz.', 'La gravedad también va a c', 'Límite para toda influencia'],
 ['foton','', 'En dos mil diecisiete se confirmó con una precisión enorme: dos estrellas de neutrones chocaron a ciento treinta millones de años luz.', '2017: dos estrellas de neutrones', '130 millones de años luz', [['neutrones','atomo','estrellas de neutrones']]],
 ['barras','sinmasa', 'Las ondas gravitacionales y la luz de esa colisión llegaron con solo un par de segundos de diferencia, tras un viaje de ciento treinta millones de años.', 'Llegaron casi a la vez', 'Solo unos segundos de diferencia'],
 ['foton','', 'Es decir, sus velocidades coinciden con una precisión de una parte en mil billones. Esa velocidad no es de la luz: es del universo.', 'Coinciden: 1 parte en 10¹⁵', 'Es del universo', [['mil','rayo','10¹⁵']]],
 ['foton','', 'La luz no tiene ningún privilegio. Simplemente no tiene masa, así que no hay nada que la frene por debajo de ese límite.', 'Sin masa, sin freno', 'La luz no es especial', [['masa','caja','masa',true],['frene','mano','freno',true]]],
 ['barras','sinmasa', 'Los gluones, que mantienen unidos los núcleos de los átomos, tampoco tienen masa, y también viajan a esa velocidad.', 'Gluones: sin masa', 'También a c'],
 // --- F: todo se mueve a c por el espacio-tiempo
 ['cuatro','', 'Y aquí viene la idea más hermosa. Todo en el universo se mueve a la misma velocidad a través del espacio-tiempo.', 'Misma velocidad total', 'A través del espacio-tiempo'],
 ['cuatro','', 'Si estás quieto, toda esa velocidad la gastas en el tiempo. Por eso tu reloj avanza a tope.', 'Quieto: todo en el tiempo', 'Tu reloj, a tope'],
 ['cuatro','', 'Si empiezas a moverte por el espacio, le quitas velocidad al tiempo. Tu reloj se vuelve más lento.', 'Más espacio, menos tiempo', 'Tu reloj se ralentiza'],
 ['reloj','', 'Un reloj de luz lo muestra: un fotón rebota entre dos espejos. Cada rebote es un tic.', 'El reloj de luz', 'Cada rebote, un tic'],
 ['reloj','', 'Si el reloj se mueve, el fotón recorre una diagonal más larga. Como la velocidad de la luz es la misma, el tic tarda más.', 'Reloj en movimiento', 'Diagonal más larga = tic más lento'],
 ['reloj','', 'Es la dilatación del tiempo: un reloj en movimiento marca el tiempo más despacio que uno en reposo.', 'Dilatación del tiempo', 'Un reloj en movimiento va lento'],
 ['cuatro','', 'En el límite, la luz usa toda su velocidad en el espacio, y no le queda nada para el tiempo.', 'La luz: todo en el espacio', 'Nada para el tiempo'],
 ['cuatro','', 'Para un fotón no transcurre el tiempo. Un fotón que sale de una galaxia lejana y llega a tu ojo no envejece ni un instante.', 'Para un fotón no hay tiempo', 'No envejece ni un instante'],
 ['foton','', 'Así que la luz no viaja a la velocidad de la luz porque sea luz. Viaja así porque está justo en el límite de ese reparto.', 'No es por ser luz', 'Está en el límite del reparto', [['luz','bombilla']]],
 // --- G: por qué nada con masa llega a c
 ['gamma','', 'Entonces, ¿por qué nada con masa puede llegar a esa velocidad? Porque necesitaría una energía infinita.', '¿Por qué no se puede llegar a c?', 'Energía infinita'],
 ['gamma','', 'Al noventa por ciento de la velocidad de la luz, la energía ya se multiplica por más de dos.', '0,9 c → ×2,3', ''],
 ['gamma','', 'Al noventa y nueve por ciento, por siete. Y al noventa y nueve coma nueve nueve por ciento, por setenta.', '0,99 c → ×7', '0,9999 c → ×70'],
 ['gamma','', 'Cada nueve que añades cuesta más energía. La curva se dispara hacia el infinito justo en el límite.', 'Cada nueve cuesta más', 'La curva se dispara'],
 ['barras','masa', 'En el Gran Colisionador de Hadrones, los protones alcanzan el noventa y nueve coma nueve nueve nueve nueve nueve nueve por ciento de la velocidad de la luz.', 'LHC: 99,999999 % de c', ''],
 ['foton','', 'Y aun así, cada vez que los aceleran más, ganan energía, pero casi nada de velocidad. El límite se vuelve más duro.', 'Más energía, casi misma velocidad', '', [['energía','rayo']]],
 ['foton','', 'Tampoco sirve sumar velocidades. Si lanzas un cohete a la mitad de la luz, y desde él otro a la mitad, no obtienes la velocidad de la luz.', 'Sumar velocidades no vale', '½ c + ½ c ≠ c', [['cohete','motor','cohete']]],
 ['foton','', 'La suma relativista da el ochenta por ciento. El espacio y el tiempo se ajustan para que nunca puedas pasar.', 'Suma relativista: 80 %', 'Nunca puedes pasar', [['ochenta','reloj','0,8 c']]],
 // --- H: luz en el vidrio
 ['vidrio','', 'Entonces, ¿la luz siempre va a esa velocidad? No. En el vidrio, la luz avanza a unos doscientos mil kilómetros por segundo.', 'En el vidrio: 200 000 km/s', ''],
 ['vidrio','', 'Eso no contradice nada: la velocidad máxima es la del vacío. Dentro de un material, la onda se mezcla con los átomos y avanza más despacio.', 'El límite es el del vacío', 'En un material, más lenta'],
 ['vidrio','', 'En el agua va a unos doscientos veinticinco mil. Por eso un lápiz parece doblado al meterlo en un vaso.', 'En el agua: 225 000 km/s', 'El lápiz parece doblado'],
 ['foton','', 'Y por eso una partícula puede ir más rápido que la luz en el agua, sin romper la regla, y emitir un brillo azul: el efecto Cherenkov.', 'Efecto Cherenkov', 'Brillo azul', [['partícula','atomo'],['azul','bombilla','brillo azul']]],
 ['foton','', 'El límite real no es la luz en el vidrio. Es esa velocidad máxima del vacío, la de las ondas sin masa.', 'El límite real', 'La del vacío', [['vacío','tierra']]],
 // --- I: causalidad
 ['minkowski','simul', '¿Y si algo fuera más rápido que la luz? El problema no sería la energía. El problema sería la causalidad.', '¿Más rápido que la luz?', 'El problema: la causalidad'],
 ['minkowski','simul', 'Dos observadores en movimiento no están de acuerdo sobre qué sucede a la vez. Para uno, un suceso ocurre antes. Para otro, después.', 'Observadores en movimiento', 'No coinciden en qué es simultáneo'],
 ['minkowski','taquion', 'Con velocidades por debajo de la luz, nadie discute el orden entre causa y efecto. Todos coinciden: primero va la causa.', 'Bajo c: el orden se mantiene', 'Primero la causa'],
 ['minkowski','taquion', 'Pero una señal más rápida que la luz sería vista por algún observador llegando antes de ser enviada. El efecto, antes que la causa.', 'Señal más rápida que c', 'El efecto antes que la causa'],
 ['foton','', 'Podrías recibir hoy la respuesta a un mensaje que enviarás mañana. Las paradojas se acumularían, y la física dejaría de tener sentido.', 'Paradojas inevitables', '', [['mensaje','nota','mensaje'],['mañana','reloj']]],
 ['foton','', 'Por eso la velocidad máxima no es una barrera tecnológica. Es lo que mantiene ordenado el universo: que las causas vayan siempre antes que los efectos.', 'No es una barrera tecnológica', 'Ordena causas y efectos', [['causas','rayo']]],
 // --- J: expansión
 ['expansion','', 'Pero entonces, ¿cómo es posible que haya galaxias que se alejan de nosotros más rápido que la luz?', '¿Galaxias más rápidas que la luz?', ''],
 ['expansion','', 'Porque no se mueven por el espacio. Es el propio espacio entre nosotros y ellas el que se estira.', 'El espacio se estira', 'No se mueven por él'],
 ['expansion','', 'Ninguna señal local supera el límite. Lo que ocurre es que las más lejanas se alejan tan deprisa que su luz nunca nos alcanzará.', 'Ninguna señal supera c', 'Su luz nunca nos alcanzará'],
 ['foton','', 'Existe un horizonte cósmico: más allá, nada de lo que ocurra hoy podrá influir en nosotros, ni nosotros en ello.', 'Horizonte cósmico', 'Más allá: sin influencia', [['horizonte','tierra']]],
 // --- K: E=mc² y unidades
 ['foton','', 'Y esa misma constante aparece en la fórmula más famosa: E igual a m c cuadrado.', 'E = m · c²', '', [['fórmula','rayo']]],
 ['foton','', 'No tiene nada que ver con la luz. Es el factor de conversión entre masa y energía, igual que c convierte tiempo en distancia.', 'c² convierte masa en energía', 'Nada que ver con la luz', [['masa','caja'],['energía','rayo']]],
 ['foton','', 'Un gramo de materia equivale a unos noventa billones de julios: la energía de una explosión de unos veinte kilotones.', '1 g ≈ 9 × 10¹³ J', '≈ 20 kilotones', [['gramo','caja','1 gramo'],['julios','rayo']]],
 ['foton','', 'Los físicos incluso eligen unidades en las que c vale uno, y las fórmulas se vuelven más simples. Tiempo y espacio se miden con la misma regla.', 'Unidades con c = 1', 'Tiempo y espacio, misma regla', [['uno','reloj','c = 1']]],
 ['foton','', 'Lo que de verdad importa son los números sin unidades, como la constante de estructura fina: aproximadamente uno entre ciento treinta y siete.', 'Números sin unidades', 'α ≈ 1/137', [['estructura','atomo','α ≈ 1/137']]],
 // --- L: pruebas: muones y GPS
 ['muon','', 'Y hay pruebas. Los muones se crean a unos quince kilómetros de altura, cuando los rayos cósmicos chocan con la atmósfera.', 'Muones a 15 km de altura', 'Rayos cósmicos'],
 ['muon','', 'Viven solo dos microsegundos. Ni a la velocidad de la luz podrían recorrer más de seiscientos metros.', 'Vida: 2,2 µs', 'Alcance: ≈ 660 m'],
 ['muon','', 'Y sin embargo llegan al suelo, porque para ellos el reloj corre más lento. Sin relatividad, casi ninguno lo lograría.', 'Llegan al suelo', 'Su reloj va lento'],
 ['gps','', 'Otro ejemplo: el GPS. Los satélites se mueven a casi cuatro kilómetros por segundo, y sus relojes se retrasan un poco por eso.', 'GPS: satélites a 3,9 km/s', 'Relatividad especial: −7 µs/día'],
 ['gps','', 'Además, al estar lejos de la Tierra, la gravedad les afecta menos, y sus relojes se adelantan. En total ganan treinta y ocho microsegundos al día.', 'Relatividad general: +45 µs/día', 'Neto: +38 µs/día'],
 ['gps','', 'Si no se corrigiera, el error de posición crecería unos once kilómetros por día. Tu móvil funciona gracias a que c es lo que es.', 'Sin corregir: 11 km de error al día', 'Tu móvil lo corrige'],
 ['foton','', 'Estos efectos no son teoría escondida: se miden cada segundo, en tu bolsillo, en forma de coordenadas.', 'Se miden cada segundo', '', [['móvil','movil','tu móvil']]],
 // --- M: cierre
 ['minkowski','luz', 'Repasemos: la velocidad de la luz es el factor que convierte tiempo en espacio, y marca el ángulo máximo de la causalidad.', 'Repaso', 'c: tiempo ↔ espacio'],
 ['foton','', 'La luz viaja a ella porque no tiene masa. La gravedad también, y cualquier cosa sin masa.', 'Sin masa: velocidad máxima', '', [['luz','bombilla'],['gravedad','tierra']]],
 ['foton','', 'Nada con masa puede alcanzarla, porque se necesitaría energía infinita, y ningún mensaje puede superarla sin romper la causalidad.', 'Con masa: energía infinita', 'Superarla rompe la causalidad', [['infinita','rayo','∞']]],
 ['foton','', 'Así que no, la velocidad de la luz nunca fue sobre la luz. Es la velocidad a la que el universo conecta las causas con sus efectos.', 'Nunca fue sobre la luz', 'Conecta causas con efectos', [['causas','rayo']]],
];
const mk = (r) => { const [tipo, modo, texto, p1, p2, items] = r;
  const pills = []; if (p1) pills.push([p1, 'y', 0.05]); if (p2) pills.push([p2, 'g', 0.5]);
  const o = {tipo, ...(modo ? {modo} : {}), texto, pills}; if (items) o.items = items; return o; };
const EX = require('./extras_v3.cjs');
const base = [...hook, ...D.map(mk)];
const out = [];
for (const s of base) { out.push(s); for (const [anc, rows] of EX) if (s.texto.startsWith(anc)) rows.forEach((r) => out.push(mk(r))); }
const used = EX.filter(([anc]) => !base.some((s) => s.texto.startsWith(anc))).map((e) => e[0]); if (used.length) console.log('ANCLAS SIN USAR', used);
fs.writeFileSync(root + '/data/guion_v3.json', JSON.stringify(out, null, 1));
console.log(out.length, 'escenas', out.reduce((a, s) => a + s.texto.split(/\s+/).length, 0), 'palabras');
