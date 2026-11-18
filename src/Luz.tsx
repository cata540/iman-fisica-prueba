import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from './ui';
import {Stage, mat} from './three';
import {rnd, sp} from './Prueba';
import {CYAN, Dot, MAG, Svg, Txt, seg} from './Fotones2';
import {WavePacket} from './Fotones';

const STARS = [...Array(90)].map((_, i) => [rnd(i * 2 + 7) * 16 - 8, rnd(i * 2 + 8) * 9 - 4.5, rnd(i * 5 + 1) * 0.05 + 0.02] as const);
const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

// ---------- Sol → Tierra con fotones ----------
export const TierraSol: React.FC<{s: any; dur: number}> = ({s, dur}) => {
  const f = useCurrentFrame(); const t = f / 30; const u = f / dur; const m = s.modo;
  if (m === 'gravedad') {
    const tv = 0.28, te = 0.86; const R = 4.2;
    const th = t * 0.55; const away = u > te ? (u - te) / (1 - te) : 0;
    const ex = Math.cos(th) * R + (away > 0 ? -Math.sin(th) * R * 0.55 * away * 3 : 0), ey = Math.sin(th) * R * 0.62 + (away > 0 ? Math.cos(th) * R * 0.62 * 0.55 * away * 3 : 0);
    const ring = u > tv ? Math.min(1, (u - tv) / (te - tv)) * R : 0;
    const secs = u > tv ? Math.min(1, (u - tv) / (te - tv)) * 500 : 0;
    return (<>
      <Stage cam={[0, 0, 11]}>
        {STARS.map((p, i) => <Dot key={i} p={[p[0], p[1], -2]} r={p[2] * (1 + 0.3 * Math.sin(t * 2 + i))} c="#ffffff" o={0.6} />)}
        <mesh position={[0, 0, -0.5]} scale={u < tv ? sp(f, 0) : Math.max(0, 1 - (u - tv) * 30)}><sphereGeometry args={[1.5, 36, 28]} /><meshBasicMaterial color="#ffd24a" /></mesh>
        {u >= tv && u < tv + 0.05 && <mesh position={[0, 0, -0.4]} scale={1 + (u - tv) * 60}><sphereGeometry args={[1.5, 24, 18]} /><meshBasicMaterial color="#fff6c0" transparent opacity={0.6 * (1 - (u - tv) / 0.05)} /></mesh>}
        <mesh rotation={[0, 0, 0]} scale={[1, 0.62, 1]}><torusGeometry args={[R, 0.012, 6, 120]} /><meshBasicMaterial color="#9be7ff" transparent opacity={0.5} /></mesh>
        {ring > 0 && <mesh scale={[1, 0.62, 1]}><torusGeometry args={[ring, 0.04, 8, 120]} /><meshBasicMaterial color={MAG} transparent opacity={0.8} /></mesh>}
        <group position={[ex, ey, 0]} rotation={[0.3, t * 0.5, 0.3]}><mesh><sphereGeometry args={[0.55, 28, 22]} />{mat('#2f6bd6', 0.5)}</mesh><mesh position={[0.2, 0.2, 0.45]} scale={[1, 0.7, 0.4]}><sphereGeometry args={[0.2, 10, 8]} />{mat('#3DDC97', 0.6)}</mesh></group>
      </Stage>
      <Txt x={760} y={92} t={u < tv ? 'Sol: presente' : u < te ? 't = ' + clock(secs) + ' · la Tierra aún no lo sabe' : '¡Ahora sí! La Tierra se suelta'} c={u < te ? C.yellow : C.green} s={40} w={700} />
    </>);
  }
  const secs = m === 'tarda' ? seg(u, 0.08, 0.85) * 500 : 0;
  return (<>
    <Stage cam={[0, 0, 11]}>
      {STARS.map((p, i) => <Dot key={i} p={[p[0], p[1], -2]} r={p[2] * (1 + 0.3 * Math.sin(t * 2 + i))} c="#ffffff" o={0.6} />)}
      <mesh position={[-6, 0, -0.5]} scale={sp(f, 0)}><sphereGeometry args={[1.9, 40, 32]} /><meshBasicMaterial color="#ffd24a" /></mesh>
      <mesh position={[-6, 0, -0.6]}><sphereGeometry args={[2.5, 32, 24]} /><meshBasicMaterial color="#ffb02a" transparent opacity={0.18 + 0.05 * Math.sin(t * 3)} /></mesh>
      <group position={[5, -0.2, 0]} rotation={[0.3, t * 0.5, 0.3]} scale={sp(f, 2)}>
        <mesh><sphereGeometry args={[0.8, 36, 28]} />{mat('#2f6bd6', 0.5)}</mesh>
        {[[0.3, 0.4, 0.7], [-0.4, 0.0, 0.7], [0.1, -0.5, 0.65]].map((p, i) => <mesh key={i} position={p as [number, number, number]} scale={[1, 0.7, 0.4]}><sphereGeometry args={[0.28, 12, 10]} />{mat('#3DDC97', 0.6)}</mesh>)}
      </group>
      {[...Array(9)].map((_, i) => { const ph = ((m === 'tarda' ? secs / 500 * 2 : t * 0.5) + i / 9) % 1; return <Dot key={i} p={[-4.2 + ph * 8.4, (i % 3 - 1) * 0.35, 0.3]} r={0.11} c={i % 2 ? CYAN : MAG} o={0.95} />; })}
      <group position={[-4.2 + ((m === 'tarda' ? secs / 500 : (t * 0.35) % 1)) * 8.4, 0, 0.5]}><WavePacket t={t} len={1.8} amp={0.3} k={10} width={0.4} /></group>
    </Stage>
    <Txt x={80} y={920} t="Sol" c="#ffd24a" s={38} />
    <Txt x={1620} y={920} t="Tierra" c="#7fb0ff" s={38} />
    <Txt x={720} y={880} t="150 millones de km" c="#e9e4f7" s={34} w={500} />
    <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}><line x1="260" y1="860" x2="1640" y2="860" stroke="#e9e4f7" strokeWidth="3" strokeDasharray="14 12" /></svg>
    {m === 'tarda' && <Txt x={1380} y={86} t={`t = ${clock(secs)}`} c={C.yellow} s={64} w={700} />}
    {m === 'v' && <Txt x={1300} y={86} t="c ≈ 299 792 km/s" c={C.yellow} s={56} w={700} />}
  </>);
};

// ---------- diagrama espacio-tiempo ----------
export const Minkowski: React.FC<{s: any; dur: number}> = ({s, dur}) => {
  const f = useCurrentFrame(); const u = f / dur; const m = s.modo;
  const ox = 960, oy = 900, L = 780;
  const ax = 1;
  const lx = 0.25 + 0.75 * seg(u, 0.0, 0.6);
  const arrow = (x1: number, y1: number, x2: number, y2: number, c: string, w = 6) => <><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={w} strokeLinecap="round" /></>;
  return (<Svg>
    {m === 'cono' && <g opacity={seg(u, 0.05, 0.3)}>
      <polygon points={`${ox},${oy} ${ox - L * 0.6},${oy - L * 0.6} ${ox + L * 0.6},${oy - L * 0.6}`} fill="#FFD83A" opacity="0.18" />
      <polygon points={`${ox},${oy} ${ox - L * 0.1},${oy + 0} ${ox + L * 0.1},${oy}`} fill="#2FD0F0" opacity="0.0" />
      <text x={ox - 140} y={oy - L * 0.35} fill={C.yellow} fontSize="40" fontWeight="700">futuro</text><text x={ox - 500} y={oy - 170} fill="#e9e4f7" fontSize="32" fontWeight="600" opacity="0.8">fuera del alcance</text><text x={ox + 230} y={oy - 170} fill="#e9e4f7" fontSize="32" fontWeight="600" opacity="0.8">fuera del alcance</text></g>}
    {arrow(ox - L * ax, oy, ox + L * ax, oy, CYAN)}
    {arrow(ox, oy, ox, oy - 780 * ax, C.yellow)}
    <text x={ox + L * 0.6} y={oy + 56} fill={CYAN} fontSize="42" fontWeight="700" opacity={ax}>ESPACIO →</text>
    <text x={ox + 26} y={oy - 780 * ax + 10} fill={C.yellow} fontSize="42" fontWeight="700" opacity={ax}>TIEMPO ↑</text>
    {(m === 'luz' || m === 'cono' || m === 'mundo' || m === 'ejes' || m === 'taquion') && <g opacity={m === 'ejes' ? 0.55 : 1}>
      {arrow(ox, oy, ox + L * 0.62 * Math.max(lx, m === 'cono' ? 1 : 0), oy - L * 0.62 * Math.max(lx, m === 'cono' ? 1 : 0), MAG, 7)}
      {arrow(ox, oy, ox - L * 0.62 * Math.max(lx, m === 'cono' ? 1 : 0), oy - L * 0.62 * Math.max(lx, m === 'cono' ? 1 : 0), MAG, 7)}
      <circle cx={ox + L * 0.62 * Math.max(lx, m === 'cono' ? 1 : 0)} cy={oy - L * 0.62 * Math.max(lx, m === 'cono' ? 1 : 0)} r="14" fill="#fff" />
      <text x={ox + L * 0.64} y={oy - L * 0.7} fill={MAG} fontSize="38" fontWeight="700" opacity={seg(u, 0.4, 0.55)}>luz: 45°</text></g>}
    {m === 'mundo' && (() => { const k = seg(u, 0.25, 0.8); const pts: string[] = []; for (let i = 0; i <= 60 * k; i++) { const tt = i / 60; pts.push(`${ox + 90 * Math.sin(tt * 5) * tt * 1.5 + 0},${oy - tt * 620}`); } return <polyline points={pts.join(' ')} fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" />; })()}
    {m === 'mundo' && <text x={ox + 150} y={oy - 520} fill="#fff" fontSize="38" fontWeight="700" opacity={seg(u, 0.5, 0.65)}>tú: más empinado que la luz</text>}
    <circle cx={ox} cy={oy} r="16" fill="#fff" />
    {(() => { const k = (u * 1.4) % 1; return <circle cx={ox} cy={oy - 700 * k} r="11" fill={C.yellow} opacity={1 - k * 0.7} />; })()}
    {[1, 2, 3, 4, 5].map((i) => <g key={i}><line x1={ox - 14} y1={oy - i * 130} x2={ox + 14} y2={oy - i * 130} stroke="#e9e4f7" strokeWidth="3" /><line x1={ox + i * 130} y1={oy - 14} x2={ox + i * 130} y2={oy + 14} stroke="#e9e4f7" strokeWidth="3" /><line x1={ox - i * 130} y1={oy - 14} x2={ox - i * 130} y2={oy + 14} stroke="#e9e4f7" strokeWidth="3" /></g>)}
    {m === 'simul' && (() => { const th = 0.42 * Math.sin(u * Math.PI * 2.2); const ax = ox - 300, bx = ox + 300, ty = oy - 400; const sl = Math.tan(th); const order = sl > 0 ? 'para otro observador: B ocurre DESPUÉS de A' : 'para otro observador: B ocurre ANTES de A'; return <g>
      <line x1={ax - 200} y1={ty} x2={bx + 200} y2={ty} stroke={C.green} strokeWidth="4" strokeDasharray="12 10" /><text x={ax - 190} y={ty - 24} fill={C.green} fontSize="34" fontWeight="600">simultáneos para ti</text>
      <line x1={ax - 200} y1={ty + sl * 200} x2={bx + 200} y2={ty - sl * 800 + sl * 200} stroke={MAG} strokeWidth="4" strokeDasharray="6 8" opacity="0.9" />
      <circle cx={ax} cy={ty} r="18" fill="#fff" /><text x={ax - 18} y={ty + 56} fill="#fff" fontSize="38" fontWeight="700">A</text><circle cx={bx} cy={ty} r="18" fill="#fff" /><text x={bx - 14} y={ty + 56} fill="#fff" fontSize="38" fontWeight="700">B</text>
      <text x="430" y="1010" fill={MAG} fontSize="42" fontWeight="700">{order}</text></g>; })()}
    {m === 'taquion' && <g>
      <line x1={ox} y1={oy} x2={ox + 520} y2={oy - 250 * seg(u, 0.1, 0.5) - 30} stroke={C.orange} strokeWidth="8" strokeLinecap="round" /><circle cx={ox + 520} cy={oy - 280} r="18" fill={C.orange} opacity={seg(u, 0.4, 0.5)} />
      <text x={ox + 330} y={oy - 330} fill={C.orange} fontSize="36" fontWeight="700" opacity={seg(u, 0.4, 0.55)}>señal más rápida que c</text>
      <line x1={ox - 300} y1={oy + 90} x2={ox + 700} y2={oy - 650} stroke={MAG} strokeWidth="4" strokeDasharray="6 8" opacity={seg(u, 0.55, 0.7)} />
      <text x={ox - 560} y={oy - 520} fill={MAG} fontSize="36" fontWeight="700" opacity={seg(u, 0.65, 0.8)}>otro observador: ¡llega antes de enviarse!</text></g>}
    {m === 'luz' && <text x={ox - 330} y={oy - 520} fill="#e9e4f7" fontSize="40" fontWeight="600" opacity={seg(u, 0.55, 0.8)}>1 s de tiempo = 299 792 km de espacio</text>}
  </Svg>);
};

// ---------- barras de porcentaje de c ----------
export const Barras: React.FC<{s: any; dur: number}> = ({s, dur}) => {
  const f = useCurrentFrame(); const u = f / dur; const m = s.modo;
  const rows: [string, number, string, string][] = m === 'c' ? [['Luz medida por quien está parado', 1, '100 % de c', C.yellow], ['Luz medida por quien corre a 0,5 c', 1, '100 % de c', CYAN]] : m === 'sinmasa'
    ? [['Luz', 1, '100 % de c', C.yellow], ['Ondas gravitacionales', 1, '100 % de c', CYAN], ['Gluones', 1, '100 % de c', MAG]]
    : [['Una persona caminando', 4.7e-9, '0,00000047 %', C.green], ['Un avión de pasajeros', 8.3e-7, '0,000083 %', C.green], ['La Tierra en su órbita', 1e-4, '0,01 %', C.yellow], ['Protón en el LHC', 0.99999999, '99,999999 %', MAG]];
  return (<Svg>
    {rows.map((r, i) => { const a = 0.12 + 0.88 * seg(u, 0.02 + i * 0.1, 0.35 + i * 0.1); const w = 1100 * Math.max(0.004, r[1]) * a; const y = 330 + i * 150;
      return <g key={i} opacity={1}><text x="220" y={y - 20} fill="#fff" fontSize="38" fontWeight="600">{r[0]}</text><rect x="220" y={y} width="1100" height="64" rx="14" fill="rgba(255,255,255,.12)" /><rect x="220" y={y} width={w} height="64" rx="14" fill={r[3]} /><text x="1350" y={y + 46} fill={r[3]} fontSize="40" fontWeight="700" opacity={Math.max(0.35, a)}>{r[2]}</text></g>; })}
  </Svg>);
};

// ---------- onda electromagnética de Maxwell ----------
export const Maxwell: React.FC<{s: any; dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const t = f / 30; const u = f / dur;
  const N = 120; const pts = (axis: 0 | 1) => [...Array(N)].map((_, i) => { const x = -6 + (i / (N - 1)) * 12; const y = Math.sin(x * 1.6 - t * 5) * 1.0; return axis === 0 ? [x, y, 0] : [x, 0, y]; });
  const mk = (axis: 0 | 1, color: string) => pts(axis).map((p, i) => i < N - 1 ? (<mesh key={i} position={[(p[0] + pts(axis)[i + 1][0]) / 2, (p[1] + pts(axis)[i + 1][1]) / 2, (p[2] + pts(axis)[i + 1][2]) / 2]}><sphereGeometry args={[0.055, 6, 6]} /><meshBasicMaterial color={color} /></mesh>) : null);
  return (<>
    <Stage cam={[0, 1.2, 10]}>
      <group position={[1.2, -1.3, 0]} rotation={[0.28, -0.35, 0]} scale={sp(f, 0) * 0.9}>
        <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012, 0.012, 12, 6]} />{mat('#ffffff', 0.3)}</mesh>
        {mk(0, CYAN)}{mk(1, MAG)}
      </group>
    </Stage>
    <Txt x={110} y={430} t="E: campo eléctrico" c={CYAN} s={40} /><Txt x={110} y={490} t="B: campo magnético" c={MAG} s={40} />
    <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, opacity: 0.35 + 0.65 * seg(u, 0.2, 0.4)}}><text x="110" y="300" fill={C.yellow} fontSize="76" fontWeight="700" fontFamily={FONT}>c = 1 / √(μ₀ ε₀)</text></svg>
  </>);
};
