// Rompe las rachas de un mismo tipo de escena. [índice, inicio esperado del texto, tipo, modo, cards?]
const fs = require('fs'); const root = require('path').resolve(__dirname, '..');
const g = JSON.parse(fs.readFileSync(root + '/data/guion_v3.json', 'utf8'));
const Y = '#FFD83A', C = '#2FD0F0', M = '#FF4FD8';
const R = [
 [7, 'Y la velocidad de esa onda', 'cifra', '', [['c = 1/√(μ₀ ε₀)', 'una velocidad que salió sola de las ecuaciones', Y]]],
 [9, 'Aquellas dos constantes', 'cifra', '', [['ε₀', 'mide la fuerza entre cargas eléctricas', C], ['μ₀', 'mide la fuerza entre corrientes', M]]],
 [12, 'Fizeau', 'cifra', '', [['313 000 km/s', 'Fizeau, 1849: rueda dentada y ocho kilómetros de recorrido', Y]]],
 [15, 'Todo lo que conocemos tiene', 'minkowski', 'mundo'],
 [25, 'Propuso dos principios', 'minkowski', 'ejes'],
 [35, 'Con Marte', 'cifra', '', [['3 – 22 min', 'lo que tarda un mensaje en llegar a Marte', C]]],
 [40, 'No se mide', 'minkowski', 'luz'],
 [42, 'Lo que sí cambiaría', 'niveles', 'emision'],
 [58, 'Y hay un efecto gemelo', 'cifra', '', [['Se acorta', 'en la dirección en que se mueve', C], ['0,8 c → 60 %', 'de su longitud original', Y]]],
 [67, 'Al noventa y nueve', 'cifra', '', [['×2,3', 'energía a 0,9 c', C], ['×7', 'a 0,99 c', Y], ['×70', 'a 0,9999 c', M]]],
 [69, 'Con esto, un viaje largo', 'cifra', '', [['< 400 años', 'para el viajero, al 99,99 % de c, hasta el centro de la galaxia', Y]]],
 [78, 'Eso no contradice nada', 'cifra', '', [['299 792 km/s', 'el máximo: el de la luz en el vacío', Y]]],
 [80, 'Se ha llegado a frenar', 'cifra', '', [['17 m/s', 'luz en un gas ultrafrío', C], ['17 millones ×', 'más lenta que en el vacío', M]]],
 [91, 'Hay cosas que sí pueden', 'color', 'negro'],
 [92, 'Un puntero láser', 'tierrasol', 'v'],
 [97, 'Por eso no existe un ahora', 'minkowski', 'simul'],
 [98, '¿Y existe algún truco?', 'expansion', ''],
 [101, 'No tiene nada que ver con la luz', 'minkowski', 'luz'],
 [103, 'Los físicos incluso eligen', 'reloj', ''],
 [106, 'Viven solo dos microsegundos', 'cifra', '', [['2,2 µs', 'vida media del muón', C], ['≈ 660 m', 'lo que recorrería sin relatividad', M]]],
 [109, 'Además, al estar lejos', 'cifra', '', [['+45 µs/día', 'gravedad: los relojes se adelantan', C], ['−7 µs/día', 'velocidad: los relojes se atrasan', M]]],
];
for (const [i, pre, tipo, modo, cards] of R) {
  const s = g[i]; if (!s || !s.texto.startsWith(pre)) { console.log('NO COINCIDE', i, pre, '→', s && s.texto.slice(0, 40)); continue; }
  s.tipo = tipo; if (modo) s.modo = modo; else delete s.modo; if (cards) s.cards = cards; else delete s.cards; delete s.items;
}
fs.writeFileSync(root + '/data/guion_v3.json', JSON.stringify(g, null, 1));
let rep = 0, maxrun = 1, run = 1; for (let i = 1; i < g.length; i++) { const same = g[i].tipo === g[i - 1].tipo && g[i].modo === g[i - 1].modo; rep += same ? 1 : 0; run = same ? run + 1 : 1; maxrun = Math.max(maxrun, run); }
console.log('repeticiones consecutivas:', rep, '· racha más larga:', maxrun, '· cifra:', g.filter((x) => x.tipo === 'cifra').length);
