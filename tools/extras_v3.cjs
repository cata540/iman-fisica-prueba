// Escenas extra para llegar a 12 min. [ancla (inicio del texto tras el que se inserta), [tipo, modo, texto, pill1, pill2, items?]...]
module.exports = [
 ['Antes, en mil seiscientos setenta y seis', [
  ['tierrasol','v','Fizeau, en mil ochocientos cuarenta y nueve, la midió en la Tierra con una rueda dentada y un espejo situado a unos ocho kilómetros.','Fizeau, 1849','Rueda dentada y espejo'],
  ['tierrasol','v','Michelson la fue afinando durante décadas con espejos giratorios, hasta acercarse al valor que usamos hoy.','Michelson','Espejos giratorios']]],
 ['Calculó el valor', [
  ['maxwell','','Aquellas dos constantes se habían medido en el laboratorio, con cargas y corrientes, sin pensar en la luz. Y su combinación daba, sorprendentemente, la velocidad de la luz.','Constantes de laboratorio','¡Daban c!']]],
 ['Los físicos pensaron que la luz', [
  ['foton','','Pero Maxwell describía campos, que no necesitan nada para propagarse. Aun así, casi todos siguieron buscando el medio que, según ellos, tenía que existir.','Campos sin medio','La búsqueda del éter',[['campos','iman']]]]],
 ['Fue uno de los resultados nulos', [
  ['foton','','Lorentz y FitzGerald propusieron que los objetos se encogen al moverse por el éter, y por eso el experimento no detectaba nada. Era un parche ingenioso.','Lorentz y FitzGerald','Un parche ingenioso',[['encogen','caja']]],
  ['foton','','Einstein vio que no era un parche: era una propiedad real del espacio y del tiempo, y no hacía falta ningún éter.','Una propiedad real','Sin éter',[['éter','agua','éter',true]]]]],
 ['Un segundo en vertical', [
  ['tierrasol','v','En la práctica, ese límite ya se nota. Hablar con la Luna tiene un retraso de más de un segundo en cada dirección.','Luna: ≈ 1,3 s de retraso','Un segundo en cada dirección'],
  ['tierrasol','v','Con Marte, un mensaje tarda entre tres y veintidós minutos, según dónde estén los dos planetas.','Marte: 3 a 22 minutos','Según la posición'],
  ['tierrasol','v','Y la estrella más cercana, Próxima Centauri, está a algo más de cuatro años luz: aunque viajaras a la velocidad de la luz, tardarías cuatro años.','Próxima Centauri: 4,2 años luz','Cuatro años a c']]],
 ['No se mide: se fija', [
  ['foton','','Si mañana la velocidad de la luz fuese distinta en tus unidades, nadie lo notaría: tus reglas y tus relojes cambiarían con ella.','¿Y si c cambiara?','Nadie lo notaría',[['reglas','pared'],['relojes','reloj']]],
  ['foton','','Lo que sí cambiaría el universo es un número sin unidades, como la constante de estructura fina. Con otro valor, los átomos no serían estables.','Otro α = otro universo','Átomos inestables',[['constante','atomo','α']]]]],
 ['Es la dilatación del tiempo', [
  ['foton','','Y hay un efecto gemelo: la contracción de longitudes. Un objeto en movimiento se acorta en la dirección en que se mueve.','Contracción de longitudes','Se acorta al moverse',[['acorta','caja']]],
  ['muon','','Para el muón, la atmósfera se acorta tanto que sus quince kilómetros se reducen a una distancia que sí puede recorrer. Dos formas de contar la misma verdad.','Para el muón, la atmósfera se encoge','Dos descripciones, un mismo hecho']]],
 ['Para un fotón no transcurre', [
  ['foton','','Curiosamente, no existe un sistema de referencia que viaje junto a un fotón. Las reglas de la relatividad no permiten ponerte en su lugar.','Sin sistema de referencia','Imposible acompañar a un fotón',[['fotón','foton']]]]],
 ['Cada nueve que añades', [
  ['gamma','','Con esto, un viaje largo se vuelve posible para el viajero. A noventa y nueve coma nueve nueve por ciento de c, llegar al centro de la galaxia le llevaría menos de cuatrocientos años de su tiempo.','Al 99,99 % de c','Centro galáctico: < 400 años de viaje'],
  ['gamma','','Pero en la Tierra habrían pasado unos veintiséis mil años. Solo lo que viaja sin masa no envejece nada.','En la Tierra: 26 000 años','El viajero: < 400']]],
 ['La suma relativista da', [
  ['foton','','En dos mil once, un experimento llamado OPERA anunció que unos neutrinos habían llegado sesenta nanosegundos antes que la luz. Medio mundo se emocionó.','OPERA, 2011','¿Neutrinos más rápidos que la luz?',[['neutrinos','atomo']]],
  ['foton','','Meses después se encontró la causa: un cable de fibra óptica mal conectado. El límite de la velocidad seguía intacto.','Un cable mal conectado','El límite seguía intacto',[['cable','bobina','cable']]]]],
 ['En el agua va a unos', [
  ['vidrio','','Se ha llegado a frenar la luz hasta diecisiete metros por segundo dentro de un gas ultrafrío: más de diecisiete millones de veces más lenta que en el vacío.','Luz a 17 m/s','En un gas ultrafrío']]],
 ['Por eso la velocidad máxima no es', [
  ['foton','','¿Y el entrelazamiento cuántico? Dos partículas entrelazadas parecen coordinarse al instante, sin importar la distancia.','Entrelazamiento cuántico','Correlación instantánea',[['partículas','atomo']]],
  ['foton','','Pero no sirve para enviar mensajes. El resultado de cada medida es aleatorio, y solo al compararlas por un canal normal descubres la correlación.','No transmite información','Sin mensajes más rápidos que c',[['mensajes','nota','mensajes',true]]],
  ['foton','','Hay cosas que sí pueden ir más rápido que la luz sin romper nada: sombras, puntos de luz, o la velocidad de fase de una onda.','Sombras y puntos de luz','Velocidad de fase',[['sombras','pared']]],
  ['foton','','Un puntero láser que barres sobre la Luna puede hacer correr el punto más deprisa que la luz, pero el punto no lleva información ni energía de un lado a otro.','Punto láser en la Luna','No lleva información',[['láser','linterna']]]]],
 ['Existe un horizonte cósmico', [
  ['foton','','Por eso no existe un ahora común en el universo. Lo que llamas ahora en Andrómeda depende de cómo te muevas, y nadie tiene razón sobre los demás.','Sin un ahora universal','Depende de cómo te muevas',[['ahora','reloj']]],
  ['foton','','¿Y existe algún truco? El físico Miguel Alcubierre propuso en mil novecientos noventa y cuatro una burbuja que contrae el espacio por delante y lo expande por detrás.','Alcubierre, 1994','Mover el espacio, no la nave',[['burbuja','agua','burbuja']]],
  ['foton','','La nave estaría quieta dentro de su burbuja, y sería el espacio el que se moviese. Pero haría falta energía negativa que no sabemos si existe.','Requiere energía negativa','Solo una idea teórica',[['negativa','rayo','energía negativa',true]]]]],
];
