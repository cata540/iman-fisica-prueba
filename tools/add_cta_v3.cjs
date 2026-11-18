// Inserta los 3 CTAs usando las duraciones reales de la voz (timeline_v3.json) y regenera la locución.
const fs = require('fs'); const root = require('path').resolve(__dirname, '..');
const g = JSON.parse(fs.readFileSync(root + '/data/guion_v3.json', 'utf8'));
const tl = JSON.parse(fs.readFileSync(root + '/data/timeline_v3.json', 'utf8'));
if (g.length !== tl.durs.length) throw new Error('guion y timeline no coinciden: ' + g.length + ' vs ' + tl.durs.length);
const cum = []; let a = 0; for (const d of tl.durs) { cum.push(a); a += d; }
const near = (target) => { let b = 1, bd = 1e9; for (let i = 1; i < g.length - 1; i++) { const d = Math.abs(cum[i] - target); if (d < bd) { bd = d; b = i; } } return b; };
const i1 = near(120), i2 = near(355);
const mkCta = (v, prev, texto, pills, extra = {}) => ({tipo: prev.tipo, ...(prev.modo ? {modo: prev.modo} : {}), ...extra, cta: v, texto, pills});
const pills = (p2) => [['Suscríbete y activa la campanita', 'y', 0.1], ...(p2 ? [[p2, 'g', 0.6]] : [])];
const out = [];
g.forEach((s, i) => {
  if (i === i1) out.push(mkCta(1, g[i - 1], 'Si estás aprendiendo algo nuevo, suscríbete y activa la campanita, así no te pierdes el siguiente vídeo.', pills('Así no te pierdes el siguiente')));
  if (i === i2) out.push(mkCta(2, g[i - 1], 'Y si te está gustando este viaje, suscríbete y activa la campanita ahora mismo. Todavía queda lo mejor.', pills('Todavía queda lo mejor')));
  out.push(s);
});
out.push({tipo: 'foton', cta: 3, title: ['Gracias por', 'llegar hasta aquí'], texto: 'Si has llegado hasta aquí, suscríbete y activa la campanita para no perderte nada. El próximo vídeo ya lo tienes en pantalla. Nos vemos allí.', pills: [['Suscríbete y activa la campanita', 'y', 0.05], ['El próximo vídeo, en pantalla', 'g', 0.5]]});
fs.writeFileSync(root + '/data/guion_v3.json', JSON.stringify(out, null, 1));
console.log('CTA1 antes de la escena', i1, 'en', cum[i1].toFixed(1), 's; CTA2 antes de la', i2, 'en', cum[i2].toFixed(1), 's; total escenas', out.length);
