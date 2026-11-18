// Varía los visuales: sustituye parte de las tarjetas de cifras. [inicio del texto, tipo, modo, objs?]
const fs = require('fs'); const root = require('path').resolve(__dirname, '..');
const g = JSON.parse(fs.readFileSync(root + '/data/guion_v4.json', 'utf8'));
const Y = '#FFD83A', C = '#2FD0F0', M = '#FF4FD8';
const R = [
 ['Se mide en julios', 'objetos', '', [['mano', 'levantar…', C], ['caja', 'una manzana, 1 metro: 1 julio', Y]]],
 ['Hubo que esperar al siglo', 'calorpared', 'calor'],
 ['Esa regla aguanta cualquier prueba', 'objetos', '', [['rueda', 'Movimiento perpetuo', M], ['rayo', '0 aparatos que funcionen', Y]]],
 ['Una bombilla transforma electricidad', 'objetos', '', [['bombilla', 'electricidad → luz y calor', Y], ['motor', 'electricidad → movimiento', C]]],
 ['Un coche que frena', 'objetos', '', [['motor', 'movimiento (½ m v²)', C], ['llama', '→ calor en frenos y aire', M]]],
 ['Y una batería de móvil', 'objetos', '', [['pila', 'batería', Y], ['movil', '≈ 50 000 J', C]]],
 ['El Sol convierte', 'tierrasol', 'v'],
 ['Su teorema dice algo precioso', 'minkowski', 'ejes'],
 ['Esa idea es tan profunda', 'lhc', 'v'],
 ['Si repites un experimento', 'pendulo', ''],
 ['Noether tuvo que dar clases', 'objetos', '', [['libro', 'clases bajo el nombre de Hilbert', Y]]],
 ['Es parecido a un péndulo', 'pendulo', ''],
 ['Eso sí: en cualquier región pequeña', 'objetos', '', [['pared', 'Local: se conserva', C], ['tierra', 'Cósmica: no definida', M]]],
 ['Para la relatividad general', 'minkowski', 'mundo'],
 ['Un detalle importante', 'bigbang', 'expande'],
 ['En el primer segundo, la temperatura', 'bigbang', 'viaje'],
 ['Trescientos ochenta mil años', 'espectro', 'cmb'],
 ['Las estrellas fabricaron', 'bigbang', 'expande'],
 ['Hoy, trece mil ochocientos', 'expansion', ''],
 ['Una piedra en el borde', 'objetos', '', [['roca', 'Borde: más energía', C], ['valle', 'Fondo: menos energía', M]]],
 ['Una forma intuitiva de verlo', 'cero', ''],
 ['Aunque la energía total pudiera', 'calorpared', 'calor'],
 ['Aun así, la idea es útil', 'cero', ''],
 ['La razón es una propiedad extraña', 'inflacion', ''],
 ['Al terminar la inflación, el campo', 'reparto', 'uno'],
 ['Es un buen modelo', 'bigbang', 'expande'],
 ['Si el universo tiene energía total cero', 'inflacion', ''],
 ['Pero ojo con la palabra nada', 'vacio', ''],
 ['Si la expansión sigue acelerándose', 'expansion', ''],
 ['Lo que sí podemos afirmar', 'pendulo', ''],
 ['Un detalle más: de toda la masa', 'objetos', '', [['caja', 'masa', Y], ['rayo', 'energía: lo mismo', C]]],
 ['Un protón pesa mucho más', 'objetos', '', [['atomo', 'protón: ≈ 99 % energía de enlace', C]]],
 ['Y esto es lo hermoso de la física', 'cero', ''],
];
let n = 0; const miss = [];
for (const [pre, tipo, modo, objs] of R) {
  const s = g.find((x) => x.texto.startsWith(pre)); if (!s) { miss.push(pre); continue; }
  s.tipo = tipo; if (modo) s.modo = modo; else delete s.modo; delete s.cards; if (objs) s.objs = objs; else delete s.objs; n++;
}
// los CTA no deben ser tarjetas vacías
const safe = ['pendulo', 'linea', 'minkowski'];
g.forEach((s, i) => { if (s.cta && s.cta < 3 && s.tipo === 'cifra') { s.tipo = safe[s.cta % 3]; if (s.tipo === 'linea') s.modo = 'cosmica'; if (s.tipo === 'minkowski') s.modo = 'luz'; delete s.cards; } });
fs.writeFileSync(root + '/data/guion_v4.json', JSON.stringify(g, null, 1));
let run = 1, mx = 1; for (let i = 1; i < g.length; i++) { run = g[i].tipo === g[i - 1].tipo ? run + 1 : 1; mx = Math.max(mx, run); }
console.log('remapeadas', n, 'sin encontrar', miss, '· cifra restantes', g.filter((x) => x.tipo === 'cifra').length, '· racha máx', mx);
