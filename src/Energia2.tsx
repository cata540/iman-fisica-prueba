import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from './ui';
import {rnd} from './Prueba';
import {CYAN, MAG, Svg, seg} from './Fotones2';

// ---------- línea de tiempo cósmica (escala logarítmica) ----------
const EV: [string, number, string][] = [
  ['Planck · 10⁻⁴³ s', 0.04, '#FF4FD8'], ['Inflación · 10⁻³⁶ s', 0.17, '#FFD83A'], ['Quarks y gluones · 10⁻⁶ s', 0.36, '#2FD0F0'],
  ['Primeros núcleos · 3 min', 0.54, '#3DDC97'], ['Luz libre · 380 000 años', 0.7, '#FF8A4C'], ['Primeras estrellas · 200 M años', 0.85, '#fff1a0'], ['Hoy · 13 800 M años', 0.97, '#ffffff']];
export const Linea: React.FC<{s: any; dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const u = f / dur;
  const X0 = 140, X1 = 1780, Y = 560;
  const prog = 0.04 + 0.93 * seg(u, 0.05, 0.9);
  return (<Svg>
    <line x1={X0} y1={Y} x2={X1} y2={Y} stroke="#e9e4f7" strokeOpacity="0.35" strokeWidth="6" strokeLinecap="round" />
    <line x1={X0} y1={Y} x2={X0 + (X1 - X0) * prog} y2={Y} stroke={C.yellow} strokeWidth="8" strokeLinecap="round" />
    {EV.map((e, i) => { const x = X0 + (X1 - X0) * e[1]; const on = prog >= e[1] - 0.005; const up = i % 2 === 0;
      return (<g key={i} opacity={on ? 1 : 0.35}>
        <line x1={x} y1={Y} x2={x} y2={up ? Y - 120 : Y + 120} stroke={e[2]} strokeWidth="4" />
        <circle cx={x} cy={Y} r={on ? 18 : 10} fill={e[2]} />
        <text x={x} y={up ? Y - 140 : Y + 176} textAnchor="middle" fill={e[2]} fontSize="31" fontWeight="700" fontFamily={FONT}>{e[0]}</text></g>); })}
    <text x={X0} y="250" fill="#e9e4f7" fontSize="36" fontWeight="600" fontFamily={FONT}>La historia del universo, en escala logarítmica →</text>
    <circle cx={X0 + (X1 - X0) * prog} cy={Y} r="24" fill="none" stroke="#fff" strokeWidth="5" />
  </Svg>);
};

// ---------- corrimiento al rojo: la onda se estira y pierde energía ----------
export const Corrimiento: React.FC<{s: any; dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const t = f / 30; const u = f / dur;
  const stretch = 1 + 7 * seg(u, 0.05, 0.9); // longitud de onda ×1…×8
  const hue = 215 - 215 * seg(u, 0.05, 0.9) + 0; const col = `hsl(${Math.max(0, hue)}, 95%, 58%)`;
  const X0 = 140, X1 = 1780, Y = 460;
  const pts: string[] = []; for (let i = 0; i <= 400; i++) { const x = X0 + (X1 - X0) * i / 400; const ph = (i / 400) * 60 / stretch - t * 4; pts.push(`${x},${Y + Math.sin(ph) * 120 / Math.sqrt(stretch)}`); }
  const E = 1 / stretch;
  return (<Svg>
    <polyline points={pts.join(' ')} fill="none" stroke={col} strokeWidth="8" strokeLinecap="round" />
    <text x={X0} y="250" fill="#e9e4f7" fontSize="36" fontWeight="600" fontFamily={FONT}>luz de un fotón, mientras el espacio se expande</text>
    <text x={X0} y="720" fill="#fff" fontSize="40" fontWeight="700" fontFamily={FONT}>longitud de onda: ×{stretch.toFixed(1).replace('.', ',')}</text>
    <text x={X0} y="800" fill={col} fontSize="40" fontWeight="700" fontFamily={FONT}>energía del fotón: {(E * 100).toFixed(0)} %</text>
    <rect x={X0} y="830" width="700" height="26" rx="13" fill="rgba(255,255,255,.14)" /><rect x={X0} y="830" width={700 * E} height="26" rx="13" fill={col} />
    <text x="1000" y="800" fill="#e9e4f7" fontSize="34" fontWeight="600" fontFamily={FONT}>más estirada = menos energía</text>
  </Svg>);
};

// ---------- pozo de energía gravitatoria ----------
export const Pozo: React.FC<{s: any; dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const t = f / 30; const u = f / dur;
  const X0 = 240, X1 = 1680, Y0 = 400; // y=Y0 es la energía cero
  const U = (r: number) => -1 / Math.max(0.12, r); // r en 0..1+
  const mapX = (r: number) => X0 + (X1 - X0) * (r / 1.0);
  const mapY = (v: number) => Y0 - v * 150; // v negativo -> baja
  const pts: string[] = []; for (let i = 3; i <= 100; i++) { const r = i / 100; pts.push(`${mapX(r)},${Math.min(900, mapY(U(r) * 0.9))}`); }
  const rb = 1 - 0.9 * seg((u * 2.2) % 1.0, 0, 0.85); const bx = mapX(rb), by = Math.min(900, mapY(U(rb) * 0.9)) - 26;
  return (<Svg>
    <line x1={X0 - 40} y1={Y0} x2={X1 + 20} y2={Y0} stroke="#e9e4f7" strokeOpacity="0.7" strokeWidth="4" strokeDasharray="14 12" />
    <text x={X1 - 330} y={Y0 - 18} fill="#e9e4f7" fontSize="32" fontWeight="600" fontFamily={FONT}>energía cero (infinitamente lejos)</text>
    <polyline points={pts.join(' ')} fill="none" stroke={MAG} strokeWidth="8" strokeLinecap="round" />
    <circle cx={bx} cy={by} r="26" fill={C.yellow} />
    <text x={X0} y="250" fill="#fff" fontSize="40" fontWeight="700" fontFamily={FONT}>energía gravitatoria  U = − G·M·m / r</text>
    <text x={X0 + 40} y="960" fill={MAG} fontSize="38" fontWeight="700" fontFamily={FONT}>más cerca → energía más negativa</text>
  </Svg>);
};

// ---------- inflación: el volumen crece con densidad de energía constante ----------
export const Inflacion: React.FC<{s: any; dur: number}> = ({s, dur}) => {
  const f = useCurrentFrame(); const u = f / dur;
  const g = 0.18 + 0.82 * seg(u, 0.03, 0.9); const side = 220 + 520 * g; const cx = 560, cy = 560;
  const N = Math.round(10 + 90 * g * g);
  const E = g * g;
  return (<Svg>
    <rect x={cx - side / 2} y={cy - side / 2} width={side} height={side} rx="18" fill="rgba(47,208,240,.10)" stroke={CYAN} strokeWidth="6" />
    {[...Array(N)].map((_, i) => <circle key={i} cx={cx - side / 2 + 20 + rnd(i * 2 + 1) * (side - 40)} cy={cy - side / 2 + 20 + rnd(i * 2 + 2) * (side - 40)} r="5" fill={i % 3 ? CYAN : MAG} />)}
    <text x="200" y="230" fill="#fff" fontSize="38" fontWeight="700" fontFamily={FONT}>densidad de energía: constante</text>
    <text x="1180" y="400" fill={C.yellow} fontSize="46" fontWeight="700" fontFamily={FONT}>volumen × {(1 + 99 * g * g).toFixed(0)}</text>
    <text x="1180" y="480" fill={CYAN} fontSize="46" fontWeight="700" fontFamily={FONT}>energía total ↑</text>
    <rect x="1180" y="520" width="520" height="24" rx="12" fill="rgba(255,255,255,.14)" /><rect x="1180" y="520" width={520 * E} height="24" rx="12" fill={CYAN} />
    <text x="1180" y="640" fill={MAG} fontSize="40" fontWeight="700" fontFamily={FONT}>− energía gravitatoria ↓</text>
    <rect x="1180" y="670" width="520" height="24" rx="12" fill="rgba(255,255,255,.14)" /><rect x="1180" y="670" width={520 * E} height="24" rx="12" fill={MAG} />
    <text x="1180" y="790" fill={C.green} fontSize="44" fontWeight="700" fontFamily={FONT}>suma = 0</text>
  </Svg>);
};

// ---------- vacío cuántico: parejas que aparecen y desaparecen ----------
export const Vacio: React.FC<{s: any; dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const t = f / 30;
  return (<Svg>
    {[...Array(34)].map((_, i) => { const per = 1.4 + rnd(i * 5 + 1) * 2.2; const ph = ((t + rnd(i * 5 + 2) * 6) % per) / per; const life = Math.sin(ph * Math.PI);
      const x = 200 + rnd(i * 5 + 3) * 1500, y = 220 + rnd(i * 5 + 4) * 700; const d = 14 + life * 46;
      return (<g key={i} opacity={Math.max(0, life) * 0.95}><circle cx={x - d} cy={y} r={8 + life * 8} fill={CYAN} /><circle cx={x + d} cy={y} r={8 + life * 8} fill={MAG} /><line x1={x - d} y1={y} x2={x + d} y2={y} stroke="#ffffff" strokeOpacity="0.25" strokeWidth="2" /></g>); })}
    <text x="200" y="150" fill="#fff" fontSize="40" fontWeight="700" fontFamily={FONT}>el vacío cuántico: campos que fluctúan</text>
    <text x="200" y="1010" fill={C.yellow} fontSize="48" fontWeight="700" fontFamily={FONT}>ΔE · Δt ≥ ħ / 2</text>
  </Svg>);
};

// ---------- composición del universo ----------
export const Pastel: React.FC<{s: any; dur: number}> = ({s, dur}) => {
  const f = useCurrentFrame(); const u = f / dur; const m = s.modo;
  const parts: [string, number, string][] = [['Energía oscura', 68, MAG], ['Materia oscura', 27, CYAN], ['Materia ordinaria', 5, C.yellow]];
  const k = seg(u, 0.05, 0.6); const cx = 600, cy = 560, R = 300, r = 170;
  let a0 = -Math.PI / 2;
  const arcs = parts.map((p) => { const a1 = a0 + (p[1] / 100) * Math.PI * 2 * k; const large = a1 - a0 > Math.PI ? 1 : 0; const P = (a: number, rr: number) => `${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr}`;
    const d = `M ${P(a0, R)} A ${R} ${R} 0 ${large} 1 ${P(a1, R)} L ${P(a1, r)} A ${r} ${r} 0 ${large} 0 ${P(a0, r)} Z`; a0 = a1; return {d, c: p[2], n: p[0], v: p[1]}; });
  return (<Svg>
    {arcs.map((a, i) => <path key={i} d={a.d} fill={a.c} opacity={m === 'oscura' && i !== 0 ? 0.35 : 1} />)}
    <text x={cx} y={cy + 14} textAnchor="middle" fill="#fff" fontSize="46" fontWeight="700" fontFamily={FONT}>universo</text>
    {parts.map((p, i) => <g key={i} opacity={m === 'oscura' && i !== 0 ? 0.4 : seg(u, 0.2 + i * 0.1, 0.4 + i * 0.1)}><rect x="1080" y={380 + i * 130} width="40" height="40" rx="10" fill={p[2]} /><text x="1150" y={414 + i * 130} fill="#fff" fontSize="46" fontWeight="700" fontFamily={FONT}>{p[1]} %  {p[0]}</text></g>)}
  </Svg>);
};

// ---------- objetos 3D grandes con rótulo ----------
import {Stage} from './three';
import {Prop} from './Props';
import {sp} from './Prueba';
import {Txt} from './Fotones2';
export const Objetos: React.FC<{s: any; dur: number}> = ({s, dur}) => {
  const f = useCurrentFrame(); const t = f / 30;
  const objs: [string, string, string?][] = s.objs ?? [];
  const n = Math.max(1, objs.length);
  const xs = (i: number) => (n === 1 ? 0 : (i - (n - 1) / 2) * 5.2);
  return (<>
    <Svg>
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={960 + Math.sin(t * 0.3 + i) * 80} cy={500 + Math.cos(t * 0.25 + i * 1.7) * 40} r={220 + i * 170} fill="none" stroke={i % 2 ? MAG : CYAN} strokeOpacity="0.10" strokeWidth="3" strokeDasharray="14 18" />)}
    </Svg>
    <Stage cam={[0, 0, 11]}>
      {objs.map((o, i) => (<group key={i} position={[xs(i), 0.3, 0]} scale={sp(f, i * 4) * 1.9}><Prop k={o[0]} t={t + i} /></group>))}
    </Stage>
    {objs.map((o, i) => { const px = 960 + xs(i) * (960 / (11 * Math.tan(Math.PI / 9) * (16 / 9))); const a = seg(f / dur, 0.02 + i * 0.08, 0.2 + i * 0.08);
      return <div key={i} style={{position: 'absolute', left: px - 330, width: 660, top: 800, textAlign: 'center', opacity: 0.3 + 0.7 * a, color: o[2] ?? '#fff', fontFamily: FONT, fontWeight: 700, fontSize: n === 1 ? 52 : 42, lineHeight: 1.15}}>{o[1]}</div>; })}
  </>);
};
