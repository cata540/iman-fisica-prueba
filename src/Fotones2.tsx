import React from 'react';
import * as THREE from 'three';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from './ui';
import {RoundedBox, Stage, mat} from './three';
import {rnd, sp} from './Prueba';
import {WavePacket} from './Fotones';

export const CYAN = '#2FD0F0', MAG = '#FF4FD8';
const ease = (x: number) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
export const seg = (u: number, a: number, b: number) => ease((u - a) / (b - a));
export const Dot: React.FC<{p: [number, number, number]; r?: number; c: string; o?: number}> = ({p, r = 0.09, c, o = 1}) => <mesh position={p}><sphereGeometry args={[r, 12, 10]} /><meshBasicMaterial color={c} transparent opacity={o} /></mesh>;
export const Txt: React.FC<{x: number; y: number; t: string; c?: string; s?: number; o?: number; w?: number}> = ({x, y, t, c = '#fff', s = 34, o = 1, w = 600}) => <div style={{position: 'absolute', left: x, top: y, opacity: o, color: c, fontFamily: FONT, fontWeight: w, fontSize: s, whiteSpace: 'nowrap'}}>{t}</div>;
export const Svg: React.FC<{o?: number; children: React.ReactNode}> = ({o = 1, children}) => <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, opacity: o, fontFamily: FONT}}>{children}</svg>;
const planck = (l: number, T: number) => { const h = 6.626e-34, c = 3e8, k = 1.381e-23; const x = h * c / (l * k * T); return 1 / (Math.pow(l, 5) * (Math.exp(x) - 1)); };
const lam2rgb = (nm: number) => { const h = 270 - ((nm - 400) / 350) * 270; return `hsl(${h}, 95%, 55%)`; };

// ---------- filamento ----------
export const Filamento: React.FC<{s: any; dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const t = f / 30; const u = f / dur;
  const heat = seg(u, 0.02, 0.35);
  const coil = [...Array(11)].map((_, i) => i);
  const N = 46;
  return (<>
    <Stage cam={[0, 0, 9]}>
      <group position={[1.8, 0.2, 0]} scale={sp(f, 0)}>
        <mesh><sphereGeometry args={[1.7, 36, 28]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.16} roughness={0.1} /></mesh>
        <mesh position={[0, -1.95, 0]}><cylinderGeometry args={[0.7, 0.55, 0.9, 24]} />{mat('#b9b3d4', 0.3)}</mesh>
        {coil.map((i) => <mesh key={i} position={[(i - 5) * 0.17, 0.05, 0]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.32, 0.05, 8, 20]} /><meshStandardMaterial color="#ff9a4c" emissive={heat > 0.6 ? '#ffe9a0' : '#ff6a2c'} emissiveIntensity={0.3 + heat * 1.6} /></mesh>)}
        {heat > 0.05 && <pointLight intensity={heat * 25} color="#ffcf8a" />}
        {[...Array(N)].map((_, k) => {
          const vis = k % 4 === 0; const ph = (t * 0.55 + k / N) % 1;
          const th = rnd(k * 3 + 1) * Math.PI * 2, el = (rnd(k * 3 + 2) - 0.5) * 1.6;
          const d = new THREE.Vector3(Math.cos(th) * Math.cos(el), Math.sin(el), Math.sin(th) * Math.cos(el));
          const p = d.multiplyScalar(1.7 + ph * 3.6);
          return <Dot key={k} p={[p.x, p.y, p.z]} r={vis ? 0.1 : 0.075} c={vis ? (k % 8 === 0 ? CYAN : MAG) : '#ff5a3c'} o={heat * (1 - ph * 0.8)} />;
        })}
      </group>
    </Stage>
    <Txt x={110} y={520} t={`${Math.round(300 + heat * 2200)} °C`} s={86} c={C.orange} w={700} />
    <Txt x={110} y={640} t="temperatura del filamento" s={34} c="#e9e4f7" w={500} />
    <Txt x={110} y={730} t="■ fotones visibles (pocos)" s={30} c={CYAN} o={heat} />
    <Txt x={110} y={780} t="■ fotones infrarrojos (casi todos)" s={30} c="#ff5a3c" o={heat} />
  </>);
};

// ---------- niveles de energía del átomo ----------
export const Niveles: React.FC<{s: any; dur: number}> = ({s, dur}) => {
  const f = useCurrentFrame(); const t = f / 30; const u = f / dur; const m = s.modo;
  const R = [0, 1.0, 1.8, 2.6];
  let ring = 1, glow = 0, photonX: number | null = null, emit: number | null = null;
  let extra: {at: number}[] = [];
  if (m === 'absorcion') { ring = u < 0.42 ? 1 : 1 + seg(u, 0.42, 0.52); if (u < 0.42) photonX = -7 + (u / 0.42) * 4.0; glow = seg(u, 0.5, 0.6); }
  if (m === 'relax') { ring = 2 - seg(u, 0.4, 0.5); glow = 1 - seg(u, 0.4, 0.55); }
  if (m === 'emision') { ring = 2 - seg(u, 0.25, 0.35); if (u > 0.35) emit = (u - 0.35) / 0.65; }
  if (m === 'fosf') { ring = 3; glow = 0.6 + 0.3 * Math.sin(t * 3); extra = [{at: 0.3}, {at: 0.55}, {at: 0.8}]; }
  const ang = (r: number, k = 0) => t * (2.4 - r * 0.5) + k;
  const rr = ring <= 2 ? R[1] + (ring - 1) * (R[2] - R[1]) : R[3];
  const heat = m === 'relax' ? seg(u, 0.45, 0.95) : 0;
  const yLvl = (n: number) => (n <= 2 ? 760 + (560 - 760) * (n - 1) : 330);
  return (<>
    <Stage cam={[0, 0, 9]}>
      <group position={[-2.6, 0.2, 0]} scale={sp(f, 0)}>
        <group rotation={[0.9, 0, 0]}>
          <mesh><sphereGeometry args={[0.32, 24, 20]} />{mat('#ff8a4c', 0.3)}</mesh>
          {[1, 2, 3].map((n) => <mesh key={n}><torusGeometry args={[R[n], 0.014, 8, 80]} />{mat('#9be7ff', 0.2)}</mesh>)}
          <mesh position={[Math.cos(ang(rr)) * rr, Math.sin(ang(rr)) * rr, 0]}><sphereGeometry args={[0.17, 18, 14]} /><meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.5 + glow * 1.8} /></mesh>
          {m === 'fosf' && extra.map((e, i) => (u < e.at ? <mesh key={i} position={[Math.cos(ang(R[3], i * 2.1)) * R[3], Math.sin(ang(R[3], i * 2.1)) * R[3], 0]}><sphereGeometry args={[0.13, 14, 12]} /><meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.2} /></mesh> : null))}
        </group>
        {m === 'relax' && [[-2.2, 1.7], [2.2, 1.5], [-2.0, -1.8], [2.3, -1.6], [0, 2.7]].map(([x, y], i) => <mesh key={i} position={[x + Math.sin(t * 22 + i) * 0.22 * heat, y + Math.cos(t * 19 + i) * 0.22 * heat, 0]}><sphereGeometry args={[0.32, 18, 14]} /><meshStandardMaterial color="#6f66a8" emissive="#ff6a2c" emissiveIntensity={heat * 1.2} /></mesh>)}
      </group>
      {photonX !== null && <group position={[photonX, 0.2, 0]}><WavePacket t={t} len={2.2} amp={0.35} k={9} width={0.45} /></group>}
      {emit !== null && <group position={[-1.4 + emit * 8, 0.2, 0]}><WavePacket t={t} len={2.2} amp={0.35} k={9} width={0.45} /></group>}
      {m === 'fosf' && extra.map((e, i) => (u > e.at ? <group key={i} position={[-1.4 + Math.min(1, (u - e.at) * 2.2) * 8, 0.8 - i * 0.5, 0]}><WavePacket t={t} len={1.6} amp={0.25} k={9} width={0.35} /></group> : null))}
    </Stage>
    <Svg>
      <g stroke="#e9e4f7" strokeWidth="3"><line x1="1180" y1="330" x2="1700" y2="330" /><line x1="1180" y1="560" x2="1700" y2="560" /><line x1="1180" y1="760" x2="1700" y2="760" /></g>
      <text x="1720" y="340" fill="#fff" fontSize="30" fontWeight="600">E₃</text><text x="1720" y="570" fill="#fff" fontSize="30" fontWeight="600">E₂</text><text x="1720" y="770" fill="#fff" fontSize="30" fontWeight="600">E₁</text>
      <circle cx="1440" cy={yLvl(m === 'fosf' ? 3 : ring)} r="18" fill={CYAN} />
      {(m === 'absorcion' && u > 0.42 && u < 0.7) && <text x="1220" y="660" fill={C.yellow} fontSize="34" fontWeight="600">↑ ΔE = h · f</text>}
      {(m === 'emision' && u > 0.3) && <text x="1220" y="660" fill={C.green} fontSize="34" fontWeight="600">↓ ΔE sale como fotón</text>}
      {(m === 'relax' && u > 0.4) && <text x="1220" y="660" fill={C.orange} fontSize="34" fontWeight="600">↓ ΔE → vibración (calor)</text>}
    </Svg>
  </>);
};

// ---------- espectros ----------
export const Espectro: React.FC<{s: any; dur: number}> = ({s, dur}) => {
  const f = useCurrentFrame(); const u = f / dur; const m = s.modo;
  const o = seg(u, 0.0, 0.08); const draw = seg(u, 0.08, 0.7);
  const X0 = 280, X1 = 1640, Y0 = 760, YT = 300;
  const curve = (T: number, lmin: number, lmax: number, color: string) => {
    const pts: string[] = []; const N = 160; let mx = 0;
    for (let i = 0; i <= N; i++) mx = Math.max(mx, planck(lmin + (lmax - lmin) * i / N, T));
    for (let i = 0; i <= N * draw; i++) { const l = lmin + (lmax - lmin) * i / N; pts.push(`${X0 + (X1 - X0) * i / N},${Y0 - (planck(l, T) / mx) * (Y0 - YT)}`); }
    return <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" />;
  };
  const defs = <defs><linearGradient id="arc" x1="0" x2="1">{[400, 450, 500, 550, 600, 650, 700, 750].map((n, i) => <stop key={i} offset={i / 7} stopColor={lam2rgb(n)} />)}</linearGradient></defs>;
  const band = (a: number, b: number, lmin: number, lmax: number) => <rect x={X0 + (X1 - X0) * (a - lmin) / (lmax - lmin)} y={YT - 20} width={(X1 - X0) * (b - a) / (lmax - lmin)} height={Y0 - YT + 20} fill="url(#arc)" opacity="0.35" />;
  const axes = <g stroke="#e9e4f7" strokeWidth="3" fill="none"><path d={`M ${X0} ${YT - 20} V ${Y0} H ${X1}`} /></g>;
  if (m === 'planck') return (<Svg o={o}>{defs}{axes}{band(0.4, 0.75, 0, 3)}
    {curve(5800, 0.1e-6, 3e-6, '#ffffff')}{curve(2800, 0.1e-6, 3e-6, '#ffd24a')}{curve(1500, 0.1e-6, 3e-6, '#ff5a3c')}
    <text x={X0} y={YT - 40} fill="#fff" fontSize="34" fontWeight="500">intensidad (normalizada)</text><text x={1230} y={Y0 + 60} fill="#fff" fontSize="34" fontWeight="500">longitud de onda →</text>
    <text x="1250" y="400" fill="#fff" fontSize="34" fontWeight="600" opacity={seg(u, 0.2, 0.3)}>Sol · 5 800 K</text><text x="1250" y="450" fill="#ffd24a" fontSize="34" fontWeight="600" opacity={seg(u, 0.35, 0.45)}>Filamento · 2 800 K</text><text x="1250" y="500" fill="#ff5a3c" fontSize="34" fontWeight="600" opacity={seg(u, 0.5, 0.6)}>Hierro al rojo · 1 500 K</text></Svg>);
  if (m === 'ambiente') return (<Svg o={o}>{defs}{axes}{band(0.4, 0.75, 0, 25)}
    {curve(293, 0.5e-6, 25e-6, '#ff5a3c')}
    <text x={X0} y={YT - 40} fill="#fff" fontSize="34" fontWeight="500">intensidad</text><text x={1130} y={Y0 + 60} fill="#fff" fontSize="34" fontWeight="500">longitud de onda (µm) →</text>
    <text x="700" y="360" fill="#ff8a6c" fontSize="38" fontWeight="600" opacity={seg(u, 0.3, 0.4)}>Pico ≈ 10 µm · 20 °C</text>
    <text x="300" y="840" fill="#fff" fontSize="30" fontWeight="600" opacity={seg(u, 0.5, 0.6)}>▲ luz visible: casi nada</text></Svg>);
  if (m === 'cmb') return (<Svg o={o}>{axes}
    {curve(2.725, 0.2e-3, 5e-3, '#9be7ff')}
    <text x={X0} y={YT - 40} fill="#fff" fontSize="34" fontWeight="500">intensidad</text><text x={1130} y={Y0 + 60} fill="#fff" fontSize="34" fontWeight="500">longitud de onda (mm) →</text>
    <text x="760" y="340" fill="#9be7ff" fontSize="42" fontWeight="700" opacity={seg(u, 0.3, 0.4)}>2,7 K · pico ≈ 1 mm</text></Svg>);
  const BX0 = 200, BX1 = 1720, BY = 520;
  const gradient = <defs><linearGradient id="g2" x1="0" x2="1">{[400, 450, 500, 550, 600, 650, 700, 750].map((n, i) => <stop key={i} offset={i / 7} stopColor={lam2rgb(n)} />)}</linearGradient></defs>;
  if (m === 'energia') {
    const w = (BX1 - BX0) * draw;
    return (<Svg o={o}>{gradient}
      <rect x={BX0} y={BY} width={w} height="120" rx="20" fill="url(#g2)" />
      <text x={BX0} y="460" fill="#ff8a8a" fontSize="40" fontWeight="600">Rojo</text><text x={BX1 - 170} y="460" fill="#b58aff" fontSize="40" fontWeight="600">Violeta</text>
      {[...Array(14)].map((_, i) => { const x = BX0 + (BX1 - BX0) * i / 13; const len = 70 - i * 3.4; return i / 13 < draw ? <path key={i} d={`M ${x} 780 q ${len * 0.25} -24 ${len * 0.5} 0 t ${len * 0.5} 0`} stroke={lam2rgb(750 - i * 27)} strokeWidth="5" fill="none" /> : null; })}
      <path d={`M ${BX0} 720 H ${BX1}`} stroke="#fff" strokeWidth="4" />
      <text x={BX0} y="700" fill="#fff" fontSize="36" fontWeight="600" opacity={seg(u, 0.4, 0.55)}>menos energía</text><text x={BX1 - 260} y="700" fill="#fff" fontSize="36" fontWeight="600" opacity={seg(u, 0.4, 0.55)}>más energía →</text>
      <text x="760" y="900" fill={C.yellow} fontSize="66" fontWeight="700" opacity={seg(u, 0.55, 0.7)}>E = h · f</text></Svg>);
  }
  if (m === 'visible') {
    const xa = BX0 + (BX1 - BX0) * 0.42, xb = BX0 + (BX1 - BX0) * 0.58;
    return (<Svg o={o}>{gradient}
      <rect x={BX0} y={BY} width={xa - BX0} height="120" rx="14" fill="#3a2a5a" /><rect x={xb} y={BY} width={BX1 - xb} height="120" rx="14" fill="#2a2058" />
      <rect x={xa} y={BY - 10} width={(xb - xa) * draw} height="140" rx="10" fill="url(#g2)" />
      <text x={BX0 + 20} y={BY + 72} fill="#ff9a8c" fontSize="40" fontWeight="600">Infrarrojo (no lo ves)</text><text x={xb + 20} y={BY + 72} fill="#b58aff" fontSize="40" fontWeight="600">Ultravioleta</text>
      <text x={xa - 20} y={BY - 40} fill="#fff" fontSize="34" fontWeight="600">400 nm</text><text x={xb - 60} y={BY - 40} fill="#fff" fontSize="34" fontWeight="600">750 nm</text>
      <text x={xa + 6} y={BY + 200} fill={C.yellow} fontSize="40" fontWeight="700" opacity={seg(u, 0.4, 0.55)}>luz visible</text></Svg>);
  }
  const gx = (a: number) => BX0 + (BX1 - BX0) * (a - 400) / 350;
  return (<Svg o={o}>{gradient}
    <rect x={BX0} y={BY} width={BX1 - BX0} height="120" rx="14" fill="url(#g2)" />
    <rect x={gx(430)} y={BY} width={gx(560) - gx(430)} height="120" fill="#140a28" opacity={0.92 * seg(u, 0.25, 0.45)} />
    <text x={gx(470)} y={BY + 200} fill={C.orange} fontSize="40" fontWeight="700" opacity={seg(u, 0.35, 0.5)}>absorbido</text>
    <text x={gx(640)} y={BY + 200} fill={C.green} fontSize="40" fontWeight="700" opacity={seg(u, 0.45, 0.6)}>reflejado</text>
    <text x={BX0} y={BY - 40} fill="#fff" fontSize="36" fontWeight="500">espectro de la luz blanca</text></Svg>);
};

// ---------- pared a escala atómica ----------
export const CalorPared: React.FC<{s: any; dur: number}> = ({s, dur}) => {
  const f = useCurrentFrame(); const t = f / 30; const u = f / dur; const m = s.modo;
  const warm = m === 'ir' ? 1 : m === 'calor' ? seg(u, 0.15, 0.9) : seg(u, 0.4, 1) * 0.3;
  const amp = 0.04 + warm * 0.2;
  const rows = [0, 1, 2, 3, 4], cols = [0, 1, 2, 3, 4, 5, 6];
  const hitA = (i: number) => Math.max(0, 1 - Math.abs(((t * 1.6 + i * 0.37) % 2) - 0.2) * 5);
  return (<>
    <Stage cam={[0, 0, 9.5]}>
      <group position={[1.2, 0, 0]} rotation={[0.1, -0.35, 0]}>
        {rows.flatMap((r) => cols.map((c) => { const k = r * 7 + c; const hl = m === 'absorbe' ? hitA(r) * (c === 0 ? 1 : 0) : 0;
          return <mesh key={k} position={[c * 0.95 - 2.8 + Math.sin(t * 16 + k * 1.3) * amp, (r - 2) * 0.95 + Math.cos(t * 14 + k) * amp, 0]}><sphereGeometry args={[0.3, 18, 14]} /><meshStandardMaterial color="#6f66a8" emissive="#ff6a2c" emissiveIntensity={warm * 1.1 + hl * 2} roughness={0.4} /></mesh>; }))}
      </group>
      {(m === 'absorbe' || m === 'calor') && [0, 1, 2, 3].map((i) => { const ph = ((t * 0.9 + i * 0.25) % 1); const y = (i - 1.5) * 0.95; return <group key={i} position={[-6 + ph * 3.6, y, 0.3]} visible={ph < 0.97}><WavePacket t={t + i} len={1.5} amp={0.22} k={10} width={0.35} /></group>; })}
      {m === 'ir' && [0, 1, 2, 3, 4, 5].map((i) => { const ph = ((t * 0.6 + i / 6) % 1); return <Dot key={i} p={[3.2 + ph * 4, (i - 2.5) * 0.7, 0.4]} r={0.12} c="#ff5a3c" o={1 - ph} />; })}
    </Stage>
    {m !== 'ir' ? <Txt x={110} y={800} t={m === 'calor' ? 'Temperatura de la pared ↑' : 'Fotones llegando a la pared'} c={m === 'calor' ? C.orange : CYAN} s={38} /> : <Txt x={110} y={800} t="Cada pared emite fotones infrarrojos" c="#ff8a6c" s={38} />}
  </>);
};

// ---------- Tierra / espacio ----------
const STARS = [...Array(110)].map((_, i) => [rnd(i * 2) * 15 - 7.5, rnd(i * 2 + 1) * 8.5 - 4.2, rnd(i * 5) * 0.05 + 0.02] as const);
export const Tierra: React.FC<{s: any; dur: number}> = ({s}) => {
  const f = useCurrentFrame(); const t = f / 30; const m = s.modo;
  const sol = m === 'sol';
  return (<>
    <Stage cam={[0, 0, 10]}>
      {STARS.map((p, i) => <Dot key={i} p={[p[0], p[1], -2]} r={p[2] * (1 + 0.3 * Math.sin(t * 2 + i))} c="#ffffff" o={0.7} />)}
      <group position={[sol ? -1.2 : -3.4, sol ? 0 : -0.4, 0]} rotation={[0.3, t * 0.25, 0.35]} scale={sp(f, 0) * (sol ? 1.25 : 1.5)}>
        <mesh><sphereGeometry args={[1.5, 44, 36]} />{mat('#2f6bd6', 0.5)}</mesh>
        {[[0.7, 0.8, 1.0], [-0.9, 0.2, 1.1], [0.2, -0.9, 1.2], [-0.4, 1.1, -0.9], [1.2, -0.3, -0.8]].map((p, i) => <mesh key={i} position={p as [number, number, number]} scale={[1, 0.75, 0.45]} rotation={[i, i, 0]}><sphereGeometry args={[0.5, 14, 12]} />{mat('#3DDC97', 0.6)}</mesh>)}
      </group>
      {sol && <mesh position={[-7.6, 0, -0.5]}><sphereGeometry args={[1.6, 32, 24]} /><meshBasicMaterial color="#ffd24a" /></mesh>}
      {sol && [0, 1, 2].map((i) => { const ph = (t * 0.5 + i / 3) % 1; return <group key={i} position={[-6 + ph * 3.2, (i - 1) * 0.9, 0.4]} scale={1.1}><mesh><sphereGeometry args={[0.18, 14, 12]} /><meshBasicMaterial color="#fff1a0" /></mesh></group>; })}
      {[...Array(sol ? 22 : 16)].map((_, k) => { const ph = (t * (sol ? 0.45 : 0.3) + k / (sol ? 22 : 16)) % 1; const a = rnd(k + 9) * 1.4 - 0.7; const x0 = sol ? 0.5 : -1.9;
        return <Dot key={k} p={[x0 + ph * 8, (sol ? 0 : -0.4) + Math.sin(a) * ph * 4 + (rnd(k) - 0.5) * 1.2, 0.5]} r={0.095} c={k % 2 ? '#ff5a3c' : '#ff8a4c'} o={1 - ph * 0.7} />; })}
    </Stage>
    {sol && <><Txt x={190} y={870} t="luz visible → entra" c="#fff1a0" s={34} /><Txt x={1180} y={870} t="infrarrojo ← sale (×20 fotones)" c="#ff8a6c" s={34} /></>}
    {!sol && <Txt x={900} y={880} t="infrarrojo → rumbo al espacio" c="#ff8a6c" s={34} />}
  </>);
};

// ---------- decaimiento ----------
export const Decaimiento: React.FC<{s: any; dur: number}> = ({s, dur}) => {
  const f = useCurrentFrame(); const u = f / dur; const m = s.modo;
  const X0 = 220, X1 = 1700, Y0 = 790, YT = 300; const draw = seg(u, 0.05, 0.6);
  const curves = [
    {k: 'led', n: 'LED · ns', c: CYAN, x: 0.12, st: 0.05}, {k: 'fluor', n: 'Fluorescente · ms', c: C.green, x: 0.45, st: 0.07},
    {k: 'filamento', n: 'Filamento · décimas de s', c: C.orange, x: 0.62, st: 0.07}, {k: 'fosf', n: 'Fosforescente · horas', c: MAG, x: 0.9, st: 0.05}];
  return (<Svg>
    <g stroke="#e9e4f7" strokeWidth="3" fill="none"><path d={`M ${X0} ${YT - 20} V ${Y0} H ${X1}`} /></g>
    <text x={X0} y={YT - 40} fill="#fff" fontSize="34" fontWeight="500">brillo</text>
    {['1 ns', '1 µs', '1 ms', '1 s', '1 h'].map((l, i) => <text key={i} x={X0 + 120 + i * 340} y={Y0 + 50} fill="#c8bfe6" fontSize="30" fontWeight="500">{l}</text>)}
    {curves.map((c, ci) => {
      const hi = m === 'todos' || m === 'intro' || m === c.k; const pts: string[] = [];
      for (let i = 0; i <= 120 * draw; i++) { const x = i / 120; const y = 1 / (1 + Math.exp((x - c.x) / c.st)); pts.push(`${X0 + (X1 - X0) * x},${Y0 - y * (Y0 - YT) * 0.9}`); }
      return <g key={ci} opacity={hi ? 1 : 0.18}><polyline points={pts.join(' ')} fill="none" stroke={c.c} strokeWidth={m === c.k ? 11 : 7} strokeLinecap="round" /><text x={1060} y={380 + ci * 52} fill={c.c} fontSize="34" fontWeight="700" opacity={hi ? 1 : 0.35}>● {c.n}</text></g>;
    })}
  </Svg>);
};

// ---------- color de superficies ----------
export const ColorSup: React.FC<{s: any; dur: number}> = ({s, dur}) => {
  const f = useCurrentFrame(); const t = f / 30; const m = s.modo;
  const col = m === 'rojo' ? '#d6403a' : m === 'espejo' ? '#cfd6e8' : '#15101f';
  const rays = [{c: '#4f7bff', y: 0.9, keep: m === 'espejo'}, {c: '#3DDC97', y: 0.0, keep: m === 'espejo'}, {c: '#ff4f4f', y: -0.9, keep: m !== 'negro'}];
  const hot = m === 'negro' ? seg(f / dur, 0.1, 0.9) : 0;
  return (<>
    <Stage cam={[0, 0, 9]}>
      <group position={[2.6, 0, 0]} rotation={[0, -0.25, 0]}>
        <RoundedBox size={[1.0, 4.2, 1.4]} color={col} radius={0.06} />
        {hot > 0 && <mesh position={[-0.52, 0, 0]}><boxGeometry args={[0.04, 4.0, 1.3]} /><meshBasicMaterial color="#ff6a2c" transparent opacity={hot * 0.6} /></mesh>}
      </group>
      {rays.map((r, i) => { const ph = (t * 0.55 + i * 0.22) % 1; const H: [number, number] = [2.0, r.y]; const A: [number, number] = [-4.5, r.y + 2.3]; const B: [number, number] = [-4.5, r.y - 2.3];
        const inc = ph < 0.5; const q = inc ? ph / 0.5 : (ph - 0.5) / 0.5;
        if (inc) return <Dot key={i} p={[A[0] + (H[0] - A[0]) * q, A[1] + (H[1] - A[1]) * q, 0.4]} r={0.22} c={r.c} />;
        if (r.keep) return <Dot key={i} p={[H[0] + (B[0] - H[0]) * q, H[1] + (B[1] - H[1]) * q, 0.4]} r={0.22} c={r.c} o={1 - q * 0.2} />;
        return <mesh key={i} position={[H[0] - 0.05, H[1], 0.5]} scale={0.2 + q * 0.7}><sphereGeometry args={[0.4, 14, 12]} /><meshBasicMaterial color="#ff9a4c" transparent opacity={0.8 * (1 - q)} /></mesh>; })}
    </Stage>
    <Txt x={110} y={800} t={m === 'rojo' ? 'azul y verde → calor · rojo → reflejado' : m === 'espejo' ? 'casi todos reflejados' : 'todo absorbido → calor'} c="#e9e4f7" s={36} />
  </>);
};

// ---------- diagrama de bandas (LED) ----------
export const Banda: React.FC<{s: any; dur: number}> = ({s}) => {
  const f = useCurrentFrame(); const t = f / 30; const m = s.modo;
  const gap = m === 'gap' ? 150 + 130 * (0.5 + 0.5 * Math.sin(t * 1.1 - 1)) : 200;
  const yTop = 520 - gap / 2, yBot = 520 + gap / 2;
  const nm = 750 - (gap - 150) / 130 * 330; const pc = lam2rgb(nm);
  const cyc = (t * 0.7) % 1;
  return (<Svg>
    <rect x="260" y={yTop - 170} width="1100" height="170" rx="18" fill="#3a2a8a" opacity="0.8" /><text x="290" y={yTop - 120} fill="#c8bfe6" fontSize="32" fontWeight="600">banda de conducción</text>
    <rect x="260" y={yBot} width="1100" height="170" rx="18" fill="#3a2a8a" opacity="0.8" /><text x="290" y={yBot + 135} fill="#c8bfe6" fontSize="32" fontWeight="600">banda de valencia</text>
    {[0, 1, 2, 3, 4, 5].map((i) => { const x = 380 + i * 160; const fall = ease(cyc * 2); const y = i === 2 ? (cyc < 0.5 ? yTop - 60 + fall * (gap + 120) : yBot + 60) : yTop - 60; return <circle key={i} cx={x} cy={y} r="20" fill={CYAN} />; })}
    <g stroke="#fff" strokeWidth="3"><path d={`M 1420 ${yTop} v ${gap}`} /></g>
    <text x="1445" y="532" fill="#fff" fontSize="34" fontWeight="600">{m === 'gap' ? 'banda prohibida' : 'salto'}</text>
    {cyc > 0.45 && <path d={`M ${700 + (cyc - 0.45) * 1100} 520 q 25 -50 50 0 t 50 0 t 50 0 t 50 0`} stroke={pc} strokeWidth="7" fill="none" opacity={Math.max(0, 1 - Math.max(0, (cyc - 0.85) * 6))} />}
    {m === 'gap' && <text x="300" y="900" fill={pc} fontSize="40" fontWeight="700">más banda prohibida → fotón más azul</text>}
    {m === 'led' && <text x="300" y="900" fill={C.green} fontSize="40" fontWeight="700">cada caída → un fotón</text>}
  </Svg>);
};

// ---------- 1 fotón → 20 ----------
export const Reparto: React.FC<{s: any; dur: number}> = ({s, dur}) => {
  const f = useCurrentFrame(); const u = f / dur; const m = s.modo;
  const tb = 0.38; const pre = Math.min(1, u / tb);
  return (<>
    <Stage cam={[0, 0, 9.5]}>
      {u < tb && <group position={[-5 + pre * 4.2, 0, 0]}><mesh><sphereGeometry args={[0.38, 24, 20]} /><meshBasicMaterial color="#fff1a0" /></mesh><mesh><sphereGeometry args={[0.7, 20, 16]} /><meshBasicMaterial color="#ffd24a" transparent opacity={0.25} /></mesh></group>}
      {u >= tb && [...Array(20)].map((_, k) => { const a = (k / 19 - 0.5) * 2.4; const ph = Math.min(1, (u - tb) / 0.5); const sp2 = 0.55 + rnd(k + 3) * 0.6;
        return <Dot key={k} p={[-0.8 + Math.cos(a) * ph * 7 * sp2, Math.sin(a) * ph * 4.3 * sp2, 0.3]} r={0.11} c={k % 2 ? '#ff5a3c' : '#ff8a4c'} o={0.4 + 0.6 * (1 - ph * 0.3)} />; })}
      {u >= tb && u < tb + 0.04 && <mesh position={[-0.8, 0, 0]} scale={1 + (u - tb) * 70}><sphereGeometry args={[0.5, 16, 12]} /><meshBasicMaterial color="#fff" transparent opacity={0.6 * (1 - (u - tb) / 0.04)} /></mesh>}
    </Stage>
    <Txt x={110} y={800} t={u < tb ? '1 fotón visible (energía E)' : '≈ 20 fotones infrarrojos (E/20 cada uno)'} c={u < tb ? '#fff1a0' : '#ff8a6c'} s={40} />
    {m === 'entropia' && <Txt x={110} y={880} t="orden → desorden (entropía ↑)" c={C.yellow} s={36} o={seg(u, 0.5, 0.65)} />}
  </>);
};

// ---------- balances ----------
export const Balance: React.FC<{s: any; dur: number}> = ({s, dur}) => {
  const f = useCurrentFrame(); const u = f / dur; const m = s.modo; const o = seg(u, 0, 0.08);
  const Bar = ({y, a, ca, cb, la, lb, name, p}: {y: number; a: number; ca: string; cb: string; la: string; lb: string; name: string; p: number}) => (<g>
    <text x="220" y={y - 24} fill="#fff" fontSize="38" fontWeight="600">{name}</text>
    <rect x="220" y={y} width={Math.max(1, 1300 * a * p)} height="80" rx="16" fill={ca} /><rect x={220 + 1300 * a * p} y={y} width={Math.max(1, 1300 * (1 - a) * p)} height="80" rx="16" fill={cb} />
    <text x="240" y={y + 54} fill="#1a0f33" fontSize="34" fontWeight="700">{p > 0.8 ? la : ''}</text><text x={220 + 1300 * a * p + 20} y={y + 54} fill="#1a0f33" fontSize="34" fontWeight="700">{p > 0.8 ? lb : ''}</text></g>);
  if (m === 'eficiencia') return (<Svg o={o}><Bar y={330} a={0.05} ca={C.yellow} cb={C.orange} la="" lb="5 % luz · 95 % calor" name="Bombilla incandescente" p={seg(u, 0.1, 0.5)} /><Bar y={560} a={0.35} ca={C.yellow} cb={C.orange} la="35 % luz" lb="65 % calor" name="LED moderno" p={seg(u, 0.4, 0.8)} /></Svg>);
  if (m === 'casa') { const p = seg(u, 0.1, 0.5); const q = seg(u, 0.4, 0.8); return (<Svg o={o}>
    <rect x="220" y="400" width={Math.max(1, 500 * p)} height="140" rx="20" fill={C.yellow} /><text x="240" y="490" fill="#1a0f33" fontSize="48" fontWeight="700">{p > 0.9 ? '10 W de luz' : ''}</text>
    <path d="M 780 470 H 960" stroke="#fff" strokeWidth="8" opacity={p} /><polygon points="960,440 1020,470 960,500" fill="#fff" opacity={p} />
    <rect x="1100" y="400" width={Math.max(1, 500 * q)} height="140" rx="20" fill={C.orange} /><text x="1120" y="490" fill="#1a0f33" fontSize="48" fontWeight="700">{q > 0.9 ? '10 W de calor' : ''}</text>
    <text x="520" y="680" fill="#e9e4f7" fontSize="40" fontWeight="600" opacity={seg(u, 0.6, 0.8)}>energía que entra = energía que queda</text></Svg>); }
  if (m === 'fotones') { const p = seg(u, 0.15, 0.55); return (<Svg o={o}>
    <text x="300" y="330" fill="#fff" fontSize="40" fontWeight="600">Antes</text><text x="1050" y="330" fill="#fff" fontSize="40" fontWeight="600" opacity={p}>Después</text>
    <circle cx="460" cy="520" r="70" fill="#fff1a0" /><text x="380" y="680" fill="#fff1a0" fontSize="36" fontWeight="600">1 fotón · E</text>
    {[...Array(20)].map((_, i) => <circle key={i} cx={1080 + (i % 5) * 100} cy={440 + Math.floor(i / 5) * 90} r={24 * p} fill="#ff8a6c" />)}
    <text x="1030" y="830" fill="#ff8a6c" fontSize="36" fontWeight="600" opacity={p}>20 fotones · E/20 cada uno</text>
    <rect x="460" y="920" width={Math.max(1, 800 * seg(u, 0.6, 0.85))} height="22" rx="11" fill={C.yellow} /><text x="460" y="900" fill={C.yellow} fontSize="34" fontWeight="600" opacity={seg(u, 0.6, 0.8)}>Energía total: igual</text></Svg>); }
  const names = ['Luz', 'Calor', 'Infrarrojo', 'Exterior']; const cols = [C.yellow, C.orange, '#ff5a3c', '#9be7ff'];
  return (<Svg o={o}>{names.map((n, i) => { const a = seg(u, 0.1 + i * 0.22, 0.2 + i * 0.22); return (<g key={i} opacity={a}><rect x={170 + i * 440} y="400" width="340" height="160" rx="30" fill={cols[i]} /><text x={170 + i * 440 + 170} y="500" textAnchor="middle" fill="#1a0f33" fontSize="46" fontWeight="700">{n}</text>{i < 3 && <polygon points={`${170 + i * 440 + 360},470 ${170 + i * 440 + 420},500 ${170 + i * 440 + 360},530`} fill="#fff" />}</g>); })}
    <rect x="170" y="700" width={Math.max(1, 1500 * seg(u, 0.2, 0.9))} height="22" rx="11" fill="#e9e4f7" /><text x="170" y="680" fill="#e9e4f7" fontSize="36" fontWeight="600" opacity={seg(u, 0.25, 0.4)}>energía total constante</text></Svg>);
};

// ---------- cuerpo / cámara térmica ----------
export const Cuerpo: React.FC<{s: any; dur: number}> = ({s}) => {
  const f = useCurrentFrame(); const t = f / 30; const m = s.modo; const cam = m === 'camara';
  const skin = (hot: string, cold: string, ei = 0.35) => cam ? <meshBasicMaterial color={hot} /> : <meshStandardMaterial color={cold} emissive="#ff6a2c" emissiveIntensity={ei} />;
  return (<>
    <Stage cam={[0, 0, 9.5]}>
      {cam && <mesh position={[0, 0, -1.5]}><planeGeometry args={[16, 9]} /><meshBasicMaterial color="#3a1c6e" /></mesh>}
      <group position={[2.2, -0.2, 0]} scale={sp(f, 0)}>
        <mesh position={[0, 2.0, 0]}><sphereGeometry args={[0.55, 24, 20]} />{skin('#ffe14a', '#e8b48c', 0.5)}</mesh>
        <mesh position={[0, 0.5, 0]}><capsuleGeometry args={[0.75, 1.5, 10, 20]} />{skin('#ff8a3c', '#5a3fa8')}</mesh>
        {[-1.15, 1.15].map((x, i) => <mesh key={i} position={[x, 0.5, 0]} rotation={[0, 0, x * 0.15]}><capsuleGeometry args={[0.2, 1.7, 8, 14]} />{skin('#d9433a', '#5a3fa8', 0.3)}</mesh>)}
        {[-0.38, 0.38].map((x, i) => <mesh key={i} position={[x, -1.8, 0]}><capsuleGeometry args={[0.28, 1.9, 8, 14]} />{skin('#c7343a', '#5a3fa8', 0.3)}</mesh>)}
        {!cam && [0, 1, 2, 3].map((i) => { const ph = (t * 0.6 + i / 4) % 1; return <mesh key={i} scale={1 + ph * 2.4} position={[0, 0.2, -0.3]}><torusGeometry args={[1.6, 0.025, 8, 60]} /><meshBasicMaterial color="#ff5a3c" transparent opacity={0.8 * (1 - ph)} /></mesh>; })}
      </group>
    </Stage>
    {cam && <Svg><g stroke="#fff" strokeWidth="5" fill="none"><path d="M 120 120 h 80 M 120 120 v 80 M 1800 120 h -80 M 1800 120 v 80 M 120 960 h 80 M 120 960 v -80 M 1800 960 h -80 M 1800 960 v -80" /></g>
      <text x="180" y="190" fill="#fff" fontSize="36" fontWeight="700">36 °C</text><text x="180" y="900" fill="#c9b6ff" fontSize="34" fontWeight="600">pared 20 °C</text></Svg>}
    {!cam && <Txt x={110} y={800} t="infrarrojo emitido por tu cuerpo" c="#ff8a6c" s={38} />}
  </>);
};

// ---------- ojo ----------
export const Ojo: React.FC<{s: any; dur: number}> = ({s, dur}) => {
  const f = useCurrentFrame(); const t = f / 30; const u = f / dur; const m = s.modo;
  const hits = m === 'poco' ? Math.min(7, Math.floor(u * 9)) : 7;
  const sig = m === 'retina';
  return (<>
    <Stage cam={[0, 0, 9.5]}>
      <group position={[2.4, 0, 0]} scale={sp(f, 0)}>
        <mesh><sphereGeometry args={[1.8, 40, 32]} /><meshStandardMaterial color="#f3ecff" roughness={0.5} /></mesh>
        <mesh position={[-1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1, 0.3, 1]}><sphereGeometry args={[0.9, 28, 20]} />{mat('#4f7bff', 0.3)}</mesh>
        <mesh position={[-1.72, 0, 0]}><sphereGeometry args={[0.38, 20, 16]} /><meshBasicMaterial color="#0e0820" /></mesh>
        {[...Array(7)].map((_, i) => <mesh key={i} position={[1.7, (i - 3) * 0.38, 0.0]}><sphereGeometry args={[0.11, 10, 8]} /><meshBasicMaterial color={i < hits ? '#ffffff' : '#c46a60'} /></mesh>)}
      </group>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => { const ph = (u * 9) - i; if (ph < 0 || ph > 1.0) return null; return <Dot key={i} p={[-6 + ph * 8.1, (i - 3) * 0.08, 0.5]} r={0.12} c={i % 2 ? CYAN : MAG} />; })}
      {sig && [0, 1, 2, 3].map((i) => { const ph = (t * 0.7 + i / 4) % 1; return <Dot key={i} p={[4.4 + ph * 2.8, 0, 0.3]} r={0.1} c={C.yellow} o={1 - ph * 0.6} />; })}
    </Stage>
    {m === 'poco' && <Txt x={110} y={800} t={`fotones absorbidos: ${hits}`} c={CYAN} s={44} />}
    {m === 'poco' && hits >= 7 && <Txt x={110} y={880} t="¡destello percibido!" c={C.yellow} s={44} />}
    {sig && <Txt x={110} y={800} t="cada fotón desaparece → señal nerviosa →" c={C.yellow} s={38} />}
  </>);
};
