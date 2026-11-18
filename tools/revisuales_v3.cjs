// Sustituye las escenas 'foton' (onda cian/magenta repetida) por visuales acordes a cada frase.
// [inicio del texto, tipo, modo, cards?]
const fs = require('fs');
const root = require('path').resolve(__dirname, '..');
const g = JSON.parse(fs.readFileSync(root + '/data/guion_v3.json', 'utf8'));
const M = [
 ['Pero había un problema', 'cifra', '', [['¿Respecto a qué?', 'las ecuaciones daban una velocidad fija… pero ¿medida por quién?', '#FF4FD8']]],
 ['Todo lo que conocemos tiene velocidad relativa', 'cifra', '', [['10 km/h', 'tú, corriendo'], ['50 km/h', 'el tren, visto por ti', '#2FD0F0']]],
 ['Los físicos pensaron que la luz viajaba', 'cifra', '', [['Sonido', 'viaja por el aire'], ['Luz', '¿viaja por el éter?', '#FF4FD8']]],
 ['Pero Maxwell describía campos', 'maxwell', ''],
 ['La luz iba igual de rápido', 'tierrasol', 'v'],
 ['Fue uno de los resultados nulos', 'cifra', '', [['0', 'diferencia entre direcciones: el resultado nulo más famoso', '#2FD0F0']]],
 ['Lorentz y FitzGerald', 'cifra', '', [['Se encogen', 'según Lorentz y FitzGerald'], ['Un parche', 'ingenioso, pero no la explicación', '#FF4FD8']]],
 ['Einstein vio que no era un parche', 'minkowski', 'luz'],
 ['Einstein, con veintiséis años', 'cifra', '', [['26 años', 'Einstein, en 1905', '#FFD83A']]],
 ['Propuso dos principios', 'cifra', '', [['Principio 1', 'las leyes de la física son las mismas para todos', '#FFD83A'], ['v = constante', 'sin importar cómo te muevas', '#2FD0F0']]],
 ['Dos: la velocidad de la luz en el vacío', 'cifra', '', [['299 792 458 m/s', 'igual para cualquier observador', '#FFD83A']]],
 ['Eso rompe el sentido común', 'cuatro', ''],
 ['Ahí está el primer secreto', 'minkowski', 'luz'],
 ['Es como el cambio entre pulgadas', 'cifra', '', [['1 pulgada', '= 2,54 cm', '#2FD0F0'], ['1 segundo', '= 299 792 km de espacio', '#FFD83A']]],
 ['De hecho, desde mil novecientos ochenta y tres', 'cifra', '', [['299 792 458 m/s', 'desde 1983 esto define el metro', '#FFD83A']]],
 ['No se mide: se fija', 'cifra', '', [['299 792 458 m/s', 'en unidades del SI'], ['1 079 252 849 km/h', 'el mismo valor, otras unidades', '#2FD0F0']]],
 ['Si mañana la velocidad de la luz fuese distinta', 'cifra', '', [['299 792 458', 'metros por segundo: unidades humanas'], ['c = 1', 'unidades naturales de los físicos', '#2FD0F0']]],
 ['Lo que sí cambiaría el universo', 'cifra', '', [['α ≈ 1/137', 'sin unidades: si cambiara, los átomos no serían estables', '#FF4FD8']]],
 ['En dos mil diecisiete se confirmó', 'cifra', '', [['130 millones', 'de años luz de distancia'], ['2017', 'dos estrellas de neutrones chocan', '#2FD0F0']]],
 ['Es decir, sus velocidades coinciden', 'cifra', '', [['1 : 10¹⁵', 'diferencia entre la velocidad de la luz y la de las ondas gravitacionales', '#FFD83A']]],
 ['La luz no tiene ningún privilegio', 'cifra', '', [['< 10⁻¹⁸ eV', 'masa del fotón (límite experimental)', '#2FD0F0'], ['0 kg', 'masa de la luz', '#FFD83A']]],
 ['Y hay un efecto gemelo', 'reloj', ''],
 ['Y si te está gustando este viaje', 'minkowski', 'luz'],
 ['Curiosamente, no existe un sistema de referencia', 'cifra', '', [['0 s', 'el tiempo que experimenta un fotón en su viaje', '#2FD0F0']]],
 ['Así que la luz no viaja a la velocidad de la luz', 'cuatro', ''],
 ['Y aun así, cada vez que los aceleran', 'lhc', 'v'],
 ['Tampoco sirve sumar velocidades', 'cifra', '', [['½ c + ½ c', '≠ 1 c', '#FF4FD8'], ['0,8 c', 'el resultado relativista', '#FFD83A']]],
 ['La suma relativista da', 'barras', 'suma'],
 ['En dos mil once, un experimento llamado OPERA', 'cifra', '', [['60 ns', 'antes que la luz (OPERA, 2011)', '#FF4FD8'], ['730 km', 'del CERN al Gran Sasso', '#2FD0F0']]],
 ['Meses después se encontró la causa', 'cifra', '', [['1 cable', 'de fibra óptica mal conectado', '#FFD83A']]],
 ['Y por eso una partícula puede ir más rápido', 'vidrio', 'agua'],
 ['El límite real no es la luz en el vidrio', 'minkowski', 'cono'],
 ['Podrías recibir hoy la respuesta', 'cifra', '', [['−1 día', 'recibes la respuesta antes de enviar el mensaje', '#FF4FD8']]],
 ['Por eso la velocidad máxima no es una barrera', 'minkowski', 'cono'],
 ['¿Y el entrelazamiento cuántico?', 'cifra', '', [['Correlación', 'instantánea: sí', '#2FD0F0'], ['Mensaje', 'más rápido que c: no', '#FF4FD8']]],
 ['Pero no sirve para enviar mensajes', 'cifra', '', [['50 % · 50 %', 'cada resultado es aleatorio', '#FFD83A']]],
 ['Hay cosas que sí pueden ir más rápido', 'cifra', '', [['Sombras', 'pueden superar c', '#2FD0F0'], ['Información', 'no puede', '#FF4FD8']]],
 ['Un puntero láser que barres', 'cifra', '', [['384 400 km', 'a la Luna: el punto barre más deprisa que c, pero no lleva información', '#2FD0F0']]],
 ['Existe un horizonte cósmico', 'cifra', '', [['46 500 millones', 'de años luz: radio del universo observable', '#FFD83A']]],
 ['Por eso no existe un ahora común', 'cifra', '', [['2,5 millones', 'de años luz hasta Andrómeda', '#2FD0F0'], ['Días', 'de diferencia en tu «ahora» según cómo camines', '#FFD83A']]],
 ['¿Y existe algún truco?', 'cifra', '', [['1994', 'Miguel Alcubierre', '#FFD83A'], ['Burbuja', 'espacio contraído delante, expandido detrás', '#2FD0F0']]],
 ['La nave estaría quieta', 'cifra', '', [['Energía negativa', 'no sabemos si existe a esa escala', '#FF4FD8']]],
 ['Y esa misma constante aparece', 'cifra', '', [['E = m c²', 'la fórmula más famosa de la física', '#FFD83A']]],
 ['No tiene nada que ver con la luz', 'cifra', '', [['c²', '≈ 9 × 10¹⁶ m²/s²', '#2FD0F0'], ['1 kg', '≈ 9 × 10¹⁶ julios', '#FFD83A']]],
 ['Un gramo de materia', 'cifra', '', [['1 gramo', '≈ 9 × 10¹³ julios', '#FFD83A'], ['≈ 20 kt', 'una explosión de veinte kilotones', '#FF4FD8']]],
 ['Los físicos incluso eligen unidades', 'cifra', '', [['c = 1', 'tiempo y espacio, medidos con la misma regla', '#2FD0F0']]],
 ['Lo que de verdad importa son los números', 'cifra', '', [['α ≈ 1/137', 'la constante de estructura fina, sin unidades', '#FFD83A']]],
 ['Estos efectos no son teoría escondida', 'cifra', '', [['38 µs/día', 'de corrección en los relojes de los satélites', '#FFD83A'], ['11 km', 'de error diario evitado en tu móvil', '#2FD0F0']]],
 ['La luz viaja a ella porque no tiene masa', 'barras', 'sinmasa'],
 ['Nada con masa puede alcanzarla', 'lhc', 'inf'],
 ['Así que no, la velocidad de la luz nunca fue', 'cifra', '', [['Nunca fue sobre la luz', 'es la velocidad a la que el universo conecta causas y efectos', '#FFD83A']]],
 ['Si has llegado hasta aquí', 'tierrasol', 'v'],
];
let n = 0; const left = [];
for (const [pre, tipo, modo, cards] of M) {
  const s = g.find((x) => x.texto.startsWith(pre)); if (!s) { left.push(pre); continue; }
  s.tipo = tipo; if (modo) s.modo = modo; else delete s.modo; if (cards) s.cards = cards; else delete s.cards; delete s.items; delete s.title; n++;
}
fs.writeFileSync(root + '/data/guion_v3.json', JSON.stringify(g, null, 1));
console.log('remapeadas', n, 'sin encontrar:', left, 'foton restantes:', g.filter((x) => x.tipo === 'foton').length);
