import React from 'react';
import * as THREE from 'three';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from './ui';
import {Stage, mat} from './three';
import {rnd, sp} from './Prueba';
import {CYAN, Dot, MAG, Svg, Txt, seg} from './Fotones2';

// ---------- péndulo con barras de energía ----------
export const Pendulo: React.FC<{s: any; dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const t = f / 30; const u = f / dur;
  const A = 0.95; const th = A * Math.cos((t / 2.4) * Math.PI * 2);
  const Ep = (1 - Math.cos(th)) / (1 - Math.cos(A)); const Ek = 1 - Ep;
  const L = 3.1; const px = Math.sin(th) * L, py = -Math.cos(th) * L;
  const trail = [...Array(14)].map((_, i) => { const tt = t - i * 0.05; const a = A * Math.cos((tt / 2.4) * Math.PI * 2); return [Math.sin(a) * L, -Math.cos(a) * L, 1 - i / 14] as const; });
  const bar = (y: number, v: number, col: string, name: string) => (<g><text x="1250" y={y - 16} fill="#fff" fontSize="36" fontWeight="600">{name}</text><rect x="1250" y={y} width="500" height="46" rx="14" fill="rgba(255,255,255,.12)" /><rect x="1250" y={y} width={Math.max(2, 500 * v)} height="46" rx="14" fill={col} /></g>);
  return (<>
    <Stage cam={[0, -0.6, 10]}>
      <group position={[-2.5, 3.0, 0]} scale={sp(f, 0) * 1.2}>
        <mesh position={[0, 0.05, 0]}><boxGeometry args={[1.5, 0.18, 0.4]} />{mat('#8a84a8', 0.3)}</mesh>
        <mesh position={[px / 2, py / 2, 0]} rotation={[0, 0, th]}><cylinderGeometry args={[0.025, 0.025, L, 8]} />{mat('#d9d4ee', 0.3)}</mesh>
        {trail.map((p, i) => <Dot key={i} p={[p[0], p[1], -0.1]} r={0.1 * p[2]} c={C.yellow} o={0.5 * p[2]} />)}
        <mesh position={[px, py, 0]}><sphereGeometry args={[0.42, 28, 22]} /><meshStandardMaterial color={C.yellow} emissive={C.yellow} emissiveIntensity={0.3 + Ek * 0.8} roughness={0.3} /></mesh>
      </group>
    </Stage>
    <Svg o={0.4 + 0.6 * seg(u, 0, 0.1)}>
      {bar(360, Ep, CYAN, 'Energía potencial (altura)')}{bar(500, Ek, C.yellow, 'Energía cinética (movimiento)')}
      <line x1="1250" y1="590" x2="1750" y2="590" stroke="#e9e4f7" strokeOpacity="0.4" strokeWidth="3" />
      {bar(660, Ep + Ek, C.green, 'Total')}
      <text x="1250" y="800" fill={C.green} fontSize="44" fontWeight="700">siempre igual</text>
    </Svg>
  </>);
};

// ---------- Big Bang: expansión ----------
const PTS = [...Array(260)].map((_, i) => { const th = Math.acos(1 - 2 * rnd(i * 4 + 1)); const ph = rnd(i * 4 + 2) * Math.PI * 2; const v = 0.35 + rnd(i * 4 + 3) * 0.65; const c = ['#2FD0F0', '#FF4FD8', '#FFD83A', '#ffffff'][i % 4]; return {d: new THREE.Vector3(Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), Math.cos(th)), v, c}; });
export const BigBang: React.FC<{s: any; dur: number}> = ({s, dur}) => {
  const f = useCurrentFrame(); const t = f / 30; const u = f / dur; const m = s.modo;
  const P = 6.5; const q = (t % P) / P;
  const e = Math.pow(Math.min(1, q / 0.95), 0.62);
  const flash = q < 0.06 ? 1 - q / 0.06 : 0;
  const era = [['t = 0', 0.0], ['10⁻³⁶ s: inflación', 0.12], ['3 minutos: primeros núcleos', 0.3], ['380 000 años: primera luz', 0.5], ['200 millones de años: primeras estrellas', 0.7], ['13 800 millones de años: hoy', 0.92]] as [string, number][];
  const cur = [...era].reverse().find((x) => q >= x[1]) ?? era[0];
  return (<>
    <Stage cam={[0, 0, 11]}>
      <group rotation={[0.25, t * 0.15, 0]} scale={sp(f, 0)}>
        {PTS.map((p, i) => { const r = e * p.v * 6.2; return <Dot key={i} p={[p.d.x * r, p.d.y * r, p.d.z * r]} r={0.05 + 0.035 * (1 - e)} c={p.c} o={Math.min(1, 0.35 + (1 - e) * 0.7)} />; })}
        <mesh><sphereGeometry args={[0.35 + flash * 2.2, 24, 18]} /><meshBasicMaterial color="#fff6c0" transparent opacity={0.4 + flash * 0.6} /></mesh>
        {[1, 2, 3].map((k) => <mesh key={k} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[e * 6.4 * (k / 3), 0.012, 6, 100]} /><meshBasicMaterial color="#9be7ff" transparent opacity={0.25} /></mesh>)}
      </group>
    </Stage>
    <Txt x={110} y={900} t={cur[0]} c={C.yellow} s={42} w={700} />
    <Svg><line x1="110" y1="980" x2="1810" y2="980" stroke="#e9e4f7" strokeOpacity="0.35" strokeWidth="4" /><circle cx={110 + 1700 * q} cy="980" r="12" fill={C.yellow} />
      {era.map((x, i) => <circle key={i} cx={110 + 1700 * x[1]} cy="980" r="6" fill="#e9e4f7" />)}</Svg>
    {m === 'expande' && <Txt x={1260} y={170} t="≈ 10⁷⁰ J" c={C.yellow} s={76} w={700} o={seg(u, 0.35, 0.55)} />}
  </>);
};

// ---------- balance: energía positiva + gravitatoria negativa = 0 ----------
export const Cero: React.FC<{s: any; dur: number}> = ({s, dur}) => {
  const f = useCurrentFrame(); const u = f / dur; const m = s.modo;
  const inf = m === 'inflacion'; const up = inf ? 0.25 + 0.75 * seg(u, 0.05, 0.85) : 0.3 + 0.7 * seg(u, 0.05, 0.4), dn = inf ? up : 0.3 + 0.7 * seg(u, 0.2, 0.55), sum = inf ? 1 : seg(u, 0.55, 0.75);
  const Y0 = 560; const H = 300;
  return (<Svg>
    <line x1="260" y1={Y0} x2="1660" y2={Y0} stroke="#e9e4f7" strokeWidth="5" />
    <text x="270" y={Y0 - 14} fill="#e9e4f7" fontSize="30" fontWeight="600">cero</text>
    <rect x="360" y={Y0 - H * up} width="420" height={H * up} rx="20" fill={C.yellow} />
    <text x="360" y={Y0 - H * up - 22} fill={C.yellow} fontSize="40" fontWeight="700">+ Materia y radiación</text>
    <rect x="1000" y={Y0} width="420" height={H * dn} rx="20" fill={MAG} />
    <text x="1000" y={Y0 + H * dn + 52} fill={MAG} fontSize="40" fontWeight="700">− Energía gravitatoria</text>
    <text x="1480" y={Y0 - 60} fill={C.green} fontSize="150" fontWeight="700" opacity={sum}>= 0</text>
    <text x="1480" y={Y0 + 20} fill="#e9e4f7" fontSize="34" fontWeight="600" opacity={sum}>energía total</text>
  </Svg>);
};
