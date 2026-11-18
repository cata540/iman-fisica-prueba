// Genera data/guion_v4.json (sin CTAs). S(tipo, modo, texto, pill1, pill2, extra)
const fs = require('fs');
const root = require('path').resolve(__dirname, '..');
const hook = JSON.parse(fs.readFileSync(root + '/data/guion_v4_hook.json', 'utf8'));
const Y = '#FFD83A', C = '#2FD0F0', M = '#FF4FD8', G = '#3DDC97';
const S = (tipo, modo, texto, p1, p2, extra = {}) => { const pills = []; if (p1) pills.push([p1, 'y', 0.05]); if (p2) pills.push([p2, 'g', 0.5]); return {tipo, ...(modo ? {modo} : {}), ...extra, texto, pills}; };
const K = (texto, p1, p2, ...cards) => S('cifra', '', texto, p1, p2, {cards});
const D = [
 // ---- B: qué es la energía y su conservación
 K('Primero, ¿qué es la energía? Es la capacidad de producir cambios: mover, calentar, iluminar. No es una sustancia, sino una cuenta que sale siempre igual.', '¿Qué es la energía?', 'Una cuenta que sale igual', ['Energía', 'la capacidad de producir cambios', Y]),
 S('pendulo', '', 'En el péndulo, arriba toda la energía es de altura. Abajo, toda es de movimiento. En medio, un reparto. Y la suma no cambia.', 'Arriba: altura', 'Abajo: movimiento'),
 K('Hubo que esperar al siglo diecinueve para verlo claro. Joule midió que agitar agua con unas palas la calentaba, con una equivalencia exacta.', 'Joule, siglo XIX', 'Una equivalencia exacta', ['Palas → calor', 'el agua agitada se calienta', C], ['≈ 4,2 julios', 'para subir 1 °C un gramo de agua', Y]),
 K('Mayer y Helmholtz generalizaron la idea: calor, movimiento, electricidad y química son formas de lo mismo. Helmholtz la formuló en mil ochocientos cuarenta y siete.', 'Helmholtz, 1847', 'Formas de lo mismo', ['1847', 'Helmholtz formula la conservación de la energía', Y]),
 K('Una bombilla transforma electricidad en luz y calor. Un motor, electricidad en movimiento. Una planta, luz en azúcar. Ninguna crea energía: solo la cambia de forma.', 'Solo cambia de forma', '', ['Bombilla', 'electricidad → luz y calor', Y], ['Motor', 'electricidad → movimiento', C], ['Planta', 'luz → azúcar', G]),
 S('calorpared', 'calor', 'Incluso el rozamiento cumple la regla: el movimiento que parece perderse se convierte en calor, en agitación de átomos.', 'El rozamiento no destruye', 'Se vuelve calor'),
 K('Un coche que frena no destruye su energía: la deja como calor en los frenos y en el aire.', 'Un coche que frena', '', ['½ m v²', 'energía de movimiento', Y], ['→ calor', 'en los frenos y en el aire', M]),
 K('El Sol convierte unos cuatro millones de toneladas de materia en energía cada segundo, con la fórmula más famosa de Einstein.', 'El Sol: 4 millones de t/s', '', ['≈ 4 millones t/s', 'de masa del Sol convertida en energía', Y], ['E = m c²', 'la fórmula de Einstein', C]),
 K('La masa también es energía, concentrada. Un solo gramo equivale a unos noventa billones de julios, del orden de la bomba de Hiroshima.', 'La masa es energía concentrada', '', ['1 gramo', '≈ 9 × 10¹³ julios', Y], ['Hiroshima', 'del mismo orden de energía', M]),
 S('pastel', '', 'Hoy sabemos que la energía del universo se reparte en tres grandes partes: materia ordinaria, materia oscura y energía oscura.', 'Tres grandes partes', 'Materia y energía oscuras'),
 // ---- C: Noether
 K('Pero ¿por qué se conserva? Durante siglos fue un hecho experimental, sin explicación. Hasta que, en mil novecientos dieciocho, Emmy Noether encontró la razón.', '¿Por qué se conserva?', 'Emmy Noether, 1918', ['Emmy Noether', '1918: la razón de la conservación', Y]),
 K('Su teorema dice algo precioso: cada simetría de la naturaleza produce una ley de conservación.', 'Teorema de Noether', 'Simetría → conservación', ['Simetría', 'cambias algo y las leyes no cambian', C], ['→ Se conserva', 'una cantidad asociada', Y]),
 K('Si repites un experimento hoy, mañana o dentro de un año, obtienes el mismo resultado. Las leyes no cambian con el tiempo.', 'Las leyes no cambian con el tiempo', '', ['Ayer', 'mismo resultado', C], ['Hoy', 'mismo resultado', Y], ['Mañana', 'mismo resultado', M]),
 S('reloj', '', 'Esa simetría, que las leyes sean las mismas en cualquier instante, es exactamente lo que garantiza que la energía se conserve.', 'Simetría en el tiempo', 'Energía conservada'),
 K('Del mismo modo, que las leyes valgan igual en cualquier lugar garantiza la conservación del momento. Y que valgan igual al girar, la del momento angular.', 'Cada simetría, una ley', '', ['Tiempo', '→ energía', Y], ['Espacio', '→ momento', C], ['Giro', '→ momento angular', M]),
 K('Noether tuvo que dar clases en Gotinga bajo el nombre de Hilbert, porque no le permitían figurar como profesora. Aun así, cambió la física para siempre.', 'Gotinga, años 1910', 'Cambió la física', ['Noether', 'daba clases bajo el nombre de Hilbert', Y]),
 S('minkowski', 'ejes', 'Esto cambia la pregunta. La energía no se conserva por decreto: se conserva mientras el tiempo sea una simetría de las leyes.', 'No es un decreto', 'Depende de la simetría temporal'),
 K('Y aquí viene el truco. ¿Qué pasa si las leyes sí dependen del tiempo, porque el propio universo cambia con el tiempo?', '¿Y si el universo cambia?', '', ['¿Y si…?', 'el propio universo cambia con el tiempo', M]),
 // ---- D: expansión rompe la simetría
 S('expansion', '', 'Nuestro universo se expande. El espacio crece, y eso significa que el escenario donde ocurren las leyes no es el mismo hoy que ayer.', 'El universo se expande', 'El escenario cambia'),
 S('expansion', '', 'Ese cambio rompe la simetría temporal a escala global. Y sin esa simetría, el teorema de Noether ya no garantiza una energía total conservada.', 'Simetría rota a escala cósmica', 'Sin garantía de conservación'),
 S('corrimiento', '', 'Un ejemplo claro es la luz del fondo cósmico de microondas. Al expandirse el espacio, sus ondas se estiran y cada fotón pierde energía.', 'El espacio estira la luz', 'Cada fotón pierde energía'),
 S('corrimiento', '', 'Desde que salió, hace casi catorce mil millones de años, su longitud de onda se ha multiplicado por mil cien, y su energía se ha dividido por lo mismo.', '× 1 100 de longitud de onda', 'Energía ÷ 1 100'),
 K('¿A dónde fue esa energía? En cosmología no hay una respuesta única, porque no existe una energía total del universo definida de forma general.', '¿A dónde fue esa energía?', 'No hay energía total definida', ['Sin energía total', 'definida de forma general en un universo en expansión', M]),
 K('Eso sí: en cualquier región pequeña, la energía se conserva perfectamente. El problema aparece solo a escala cósmica.', 'En una región pequeña: se conserva', 'Solo falla a escala cósmica', ['Local: sí', 'la energía se conserva en cada región', G], ['Cósmica: no definida', 'en todo el universo en expansión', M]),
 S('pastel', 'oscura', 'Otro ejemplo es la energía oscura: parece una densidad de energía constante del propio espacio vacío.', 'Energía oscura', 'Densidad constante'),
 S('inflacion', 'oscura', 'Si cada metro cúbico tiene la misma energía y el universo crece, hay más metros cúbicos, y por tanto más energía. Sin que nadie la ponga.', 'Más volumen', 'Más energía total'),
 K('Para la relatividad general eso no rompe nada: la energía local se conserva, y no existe una cuenta global que lo prohíba.', 'La relatividad lo permite', '', ['Nada se rompe', 'la conservación local sigue intacta', Y]),
 // ---- E: línea de tiempo del Big Bang
 S('bigbang', 'viaje', 'Ahora sí, el viaje. Hace trece mil ochocientos millones de años, el universo observable era caliente, denso y casi uniforme.', 'Hace 13 800 millones de años', 'Caliente, denso y uniforme'),
 S('linea', 'cosmica', 'Los primeros instantes los conocemos solo en teoría. Antes de unos diez elevado a menos cuarenta y tres segundos, las leyes que conocemos dejan de valer.', 'Tiempo de Planck: 10⁻⁴³ s', 'Aquí fallan nuestras leyes'),
 S('linea', 'cosmica', 'Poco después, una fase de expansión explosiva, llamada inflación, habría estirado el universo en una fracción de segundo minúscula.', 'Inflación', 'Expansión explosiva'),
 S('inflacion', '', 'En esa fracción de segundo, el tamaño se habría multiplicado al menos por diez elevado a veintiséis.', '× 10²⁶ en tamaño', 'En una fracción minúscula'),
 S('linea', 'cosmica', 'Al terminar la inflación, esa energía se transformó en un mar de partículas y radiación, y empezó el Big Bang caliente que conocemos.', 'Fin de la inflación', 'Nace el Big Bang caliente'),
 K('En el primer segundo, la temperatura era de billones de grados. Había un caldo de quarks, gluones y electrones, sin átomos ni núcleos todavía.', 'Primer segundo', 'Billones de grados', ['> 10¹² K', 'un caldo de quarks y gluones', M], ['Sin átomos', 'ni núcleos todavía', C]),
 K('Había además una pequeñísima diferencia: algo más de materia que de antimateria. Esa pequeña ventaja es la que formó todo lo que existe.', 'Materia y antimateria', 'Una pequeña ventaja', ['1 por mil millones', 'exceso de materia sobre antimateria', Y]),
 S('bigbang', 'expande', 'Tres minutos después, el universo se enfrió lo suficiente para que se formaran los primeros núcleos: hidrógeno y helio.', 'A los 3 minutos', 'Hidrógeno y helio'),
 K('Trescientos ochenta mil años después, se formaron los átomos y la luz quedó libre. Es la luz que hoy detectamos como fondo cósmico de microondas.', '380 000 años', 'La luz queda libre', ['380 000 años', 'se forman los átomos: la luz queda libre', C], ['2,7 K', 'temperatura actual de esa luz', Y]),
 S('bigbang', 'viaje', 'Cientos de millones de años después, la gravedad reunió el gas en estrellas y galaxias.', 'Primeras estrellas', 'La gravedad construye galaxias'),
 K('Hoy, trece mil ochocientos millones de años después, hay al menos cien mil millones de galaxias en el universo observable.', 'Hoy', '≥ 100 000 millones de galaxias', ['≥ 10¹¹', 'galaxias en el universo observable', Y]),
 K('En total hay del orden de diez elevado a ochenta átomos, y una energía de materia de unos diez elevado a setenta julios.', 'Cifras del universo', '', ['≈ 10⁸⁰', 'átomos en el universo observable', C], ['≈ 10⁷⁰ J', 'energía de la materia', Y]),
 // ---- F: energía gravitatoria negativa
 S('pozo', '', 'Aquí aparece la idea clave: la gravedad tiene energía negativa. Para separar dos masas hay que gastar energía; juntas, tienen menos.', 'La gravedad: energía negativa', 'Juntas, tienen menos'),
 S('pozo', '', 'Es como un pozo: al caer hacia el fondo, la energía baja de cero a valores negativos. Tomamos como cero estar infinitamente lejos.', 'Un pozo de energía', 'Cero: infinitamente lejos'),
 K('Una piedra en el borde de un pozo tiene más energía que una piedra en el fondo. Para sacarla de allí, hay que aportar energía.', 'Sacar la piedra cuesta energía', '', ['Borde', 'más energía', C], ['Fondo', 'menos energía', M]),
 K('La Tierra y el Sol forman un sistema ligado: su energía total es negativa, y por eso están atados. Con energía positiva, se alejarían para siempre.', 'Sistemas ligados', 'Energía total negativa', ['E < 0', 'sistema ligado: no se escapa', M], ['E > 0', 'se aleja para siempre', C]),
 S('pozo', '', 'Ahora llevamos esa idea al cosmos. Toda la materia del universo se atrae a sí misma, y eso aporta una enorme energía gravitatoria negativa.', 'Toda la materia se atrae', 'Energía gravitatoria negativa'),
 S('cero', '', 'La pregunta es: ¿cuánta? En un universo plano, los cálculos aproximados indican que sumar la energía de la materia y la negativa de la gravedad da cero.', '¿Cuánta energía negativa?', 'Universo plano: suma cero'),
 K('El argumento más sencillo es de tipo newtoniano. Con la densidad crítica, la energía de movimiento de la expansión iguala a la energía gravitatoria.', 'Argumento newtoniano', 'Densidad crítica', ['Energía cinética', '= − energía gravitatoria', Y], ['Total', '= 0', G]),
 K('Y las medidas actuales de la geometría del universo lo muestran plano con una precisión mejor que el uno por ciento.', 'Un universo plano', 'Precisión mejor que el 1 %', ['< 1 %', 'desviación medida respecto a un universo plano', C]),
 S('cero', '', 'Si es así, el universo sería un ejemplo de algo que no costó nada: la energía positiva y la negativa se compensan exactamente.', 'Un universo que no costó nada', 'Positivo y negativo se compensan'),
 K('La idea la propuso en mil novecientos setenta y tres el físico Edward Tryon: quizá el universo es una fluctuación cuántica con energía total nula.', 'Edward Tryon, 1973', 'Universo = fluctuación cuántica', ['1973', 'Tryon: ¿es el universo una fluctuación del vacío?', Y]),
 K('Es una hipótesis elegante, pero hay que ser honestos: en relatividad general, la energía total de un universo en expansión no está definida de forma única.', 'Ojo: es una hipótesis', 'La energía total no es única', ['Hipótesis', 'elegante, pero no demostrada', M]),
 K('Aun así, la idea es útil: muestra que no hace falta violar ninguna ley para que exista mucho universo, si la cuenta total es pequeña.', 'No se viola ninguna ley', '', ['Sin violar leyes', 'si la cuenta total es pequeña, no hace falta pagar nada', G]),
 // ---- G: inflación y el almuerzo gratis
 S('inflacion', '', 'La inflación ofrece una forma concreta de ver cómo puede aparecer energía. Imagina un campo que llena el espacio con una densidad de energía constante.', 'Un campo con energía constante', ''),
 S('inflacion', '', 'Cuando el espacio se estira, ese campo mantiene la misma densidad. Pero hay más volumen, así que parece que sale energía de la nada.', 'Más volumen, misma densidad', 'Parece energía de la nada'),
 S('cero', 'inflacion', 'Alan Guth lo llamó el almuerzo gratis definitivo. La clave es que mientras sube la energía positiva del campo, baja, igual de deprisa, la energía gravitatoria negativa.', 'Alan Guth: el almuerzo gratis', 'Sube lo positivo, baja lo negativo'),
 K('Al terminar la inflación, el campo decae y convierte su energía en partículas: toda la materia y la radiación que existen hoy.', 'Fin de la inflación', 'Nacen las partículas', ['Campo → partículas', 'toda la materia y la radiación actuales', Y]),
 K('Es un buen modelo, con predicciones que ya se han comprobado, como las pequeñas variaciones de temperatura del fondo cósmico.', 'Un modelo con éxito', 'Predicciones comprobadas', ['Fondo cósmico', 'variaciones de temperatura que la inflación predice', C]),
 K('Pero todavía no sabemos con certeza si la inflación ocurrió, ni qué campo la provocó. Es una de las grandes preguntas abiertas.', 'Pregunta abierta', 'No sabemos qué campo', ['¿Ocurrió?', 'aún sin respuesta definitiva', M]),
 // ---- H: vacío cuántico
 S('vacio', '', 'La física cuántica añade otra pieza. El vacío no está vacío: está lleno de campos que fluctúan constantemente.', 'El vacío no está vacío', 'Campos que fluctúan'),
 S('vacio', '', 'El principio de incertidumbre permite que, durante un tiempo muy breve, aparezca una pequeña cantidad de energía. Cuanto menos dura, más puede ser.', 'Principio de incertidumbre', 'ΔE · Δt ≥ ħ/2'),
 S('vacio', '', 'Pueden surgir parejas de partículas y antipartículas, y desaparecer enseguida. Sus efectos se han medido, por ejemplo en el efecto Casimir.', 'Parejas que aparecen y desaparecen', 'Efecto Casimir'),
 K('Si el universo tiene energía total cero, nada impide en principio que una fluctuación así crezca. Es solo una posibilidad teórica.', 'Una fluctuación que crece', 'Solo una posibilidad teórica', ['¿Posible?', 'si la energía total es cero, una fluctuación no cuesta nada', M]),
 K('Es la idea del universo surgiendo de la nada cuántica, que han explorado físicos como Vilenkin, Hartle y Hawking.', 'Universo desde la nada cuántica', 'Vilenkin, Hartle y Hawking', ['Vilenkin · Hartle · Hawking', 'modelos de un universo desde la «nada» cuántica', C]),
 K('Pero ojo con la palabra nada: en esos modelos, la nada es un estado con leyes físicas, no la ausencia absoluta de todo.', 'Ojo con la palabra «nada»', '', ['La «nada»', 'sigue teniendo leyes de la física', Y]),
 K('Son propuestas teóricas. Ningún experimento ha confirmado todavía cómo empezó el universo.', 'Propuestas teóricas', 'Sin confirmación experimental', ['Sin confirmar', 'ningún experimento ha visto cómo empezó el universo', M]),
 // ---- I: lo que sabemos
 S('pastel', '', 'Lo que sí sabemos con mucha seguridad es la composición actual: materia ordinaria, materia oscura y energía oscura, en proporciones muy distintas.', 'Lo que sí sabemos', 'Composición actual'),
 S('pastel', '', 'Solo el cinco por ciento es materia como la de nuestros átomos. El veintisiete es materia oscura, y el sesenta y ocho, energía oscura.', '5 % materia ordinaria', '27 % oscura · 68 % energía oscura'),
 K('De la energía oscura sabemos casi nada, salvo que acelera la expansión. Su descubrimiento mereció el Nobel de Física de dos mil once.', 'Energía oscura', 'Nobel de Física 2011', ['2011', 'Nobel por descubrir la expansión acelerada', Y]),
 K('Y sobre el origen mismo, hay modelos, pero no una respuesta definitiva. Presentarlo como resuelto sería deshonesto.', 'No hay respuesta definitiva', '', ['Modelos, no certezas', 'sobre el origen del universo', M]),
 K('Lo que sí podemos afirmar es esto: ningún experimento ha mostrado jamás que se viole la conservación de la energía.', 'Ningún experimento la viola', '', ['0 violaciones', 'observadas de la conservación de la energía', G]),
 // ---- J: masa = energía; Higgs
 K('Un detalle más: de toda la masa del universo, ¿cuánta es realmente energía? Según Einstein, masa y energía son lo mismo.', 'Masa y energía son lo mismo', '', ['E = m c²', 'la masa es energía concentrada', Y]),
 K('Un protón pesa mucho más que los tres quarks que lo forman: casi toda su masa es la energía de la fuerza que los mantiene unidos.', 'El protón', '≈ 99 % es energía de enlace', ['≈ 99 %', 'de la masa de un protón es energía de la interacción fuerte', C]),
 K('Solo una parte de la masa viene de otra fuente: de cómo las partículas elementales interactúan con un campo que llena todo el espacio.', 'Otra fuente de masa', 'Un campo que llena el espacio', ['Un campo', 'que da masa a las partículas elementales', M]),
 S('lhc', 'v', 'Ese campo es el campo de Higgs, y su partícula, el bosón de Higgs, se detectó en el Gran Colisionador de Hadrones en dos mil doce.', 'El campo de Higgs', 'Detectado en 2012'),
 K('Pero esa historia, la de cómo consiguen masa las partículas, merece su propio vídeo. Y es justo el siguiente.', 'Próximo vídeo', 'El bosón de Higgs', ['El bosón de Higgs', 'el siguiente vídeo', Y]),
 // ---- K: cierre
 S('cero', '', 'Repasemos. La energía no se crea ni se destruye porque las leyes no cambian con el tiempo; esa simetría es la que la conserva.', 'Repaso', 'Simetría temporal = conservación'),
 S('corrimiento', '', 'En un universo en expansión, esa simetría se rompe a escala cósmica, y la energía total deja de ser un concepto sencillo.', 'En un universo en expansión', 'La energía total se complica'),
 S('cero', '', 'Una posibilidad muy elegante es que la energía positiva de la materia y la negativa de la gravedad sumen cero.', 'Una posibilidad elegante', 'Positivo + negativo = 0'),
 S('inflacion', '', 'Y la inflación o las fluctuaciones cuánticas podrían explicar cómo un universo así llega a existir.', 'Inflación y fluctuaciones', 'Posibles explicaciones'),
 K('Así que la respuesta honesta a «¿de dónde salió la energía?» es: quizá no salió de ninguna parte, porque la suma total pudo ser siempre cero.', '¿De dónde salió la energía?', 'Quizá de ninguna parte', ['Quizá, de ninguna parte', 'la suma total pudo ser siempre cero', Y]),
];
const EX = require('./extras_v4.cjs');
const mk = (r) => { const [tipo, modo, texto, p1, p2, extra] = r; return S(tipo, modo, texto, p1, p2, extra || {}); };
const base = [...hook, ...D]; const out = [];
for (const s of base) { out.push(s); for (const [anc, rows] of EX) if (s.texto.startsWith(anc)) rows.forEach((r) => out.push(mk(r))); }
const sinUsar = EX.filter(([anc]) => !base.some((s) => s.texto.startsWith(anc))).map((e) => e[0]); if (sinUsar.length) console.log('ANCLAS SIN USAR', sinUsar);
fs.writeFileSync(root + '/data/guion_v4.json', JSON.stringify(out, null, 1));
console.log(out.length, 'escenas', out.reduce((a, s) => a + s.texto.split(/\s+/).length, 0), 'palabras');
