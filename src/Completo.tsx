import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import tl from '../data/timeline_full.json';
import spec from '../data/guion_full.json';
import {Backdrop, C, FONT, Label, Pill, Title} from './ui';
import {Arrow, BarMagnet, FieldLines, RoundedBox, Stage, mat} from './three';
import {Battery, Cross, Fade, Plug, clamp, rnd, sp} from './Prueba';
import {Cues, Item, ZONE_TYPES} from './Props';

export type Spec = {tipo: string; pills?: [string, string, number][]; title?: string[]; labels?: [string, number, number, number, string?][]; barra?: boolean; items?: Item[]; texto?: string; final?: boolean; plano?: boolean; curva?: string};
const FR = tl.frames as number[];
export const TOTAL_FRAMES = FR.reduce((a, b) => a + b, 0);
const COL: Record<string, string> = {y: C.yellow, g: C.green, o: C.orange};

export const Overlay: React.FC<{s: Spec; dur: number}> = ({s, dur}) => (<>
  {(s.pills ?? []).map((p, i, arr) => (
    <Pill key={i} text={p[0]} color={p[1] === 'g' ? 'green' : 'yellow'} from={Math.round(p[2] * dur)} to={arr[i + 1] ? Math.round(arr[i + 1][2] * dur) : undefined} />
  ))}
  {s.title && <Title lines={s.title} from={Math.round(0.08 * dur)} />}
  {(s.labels ?? []).map((l, i) => <Label key={i} text={l[0]} x={l[1]} y={l[2]} from={Math.round(l[3] * dur)} color={l[4] ? COL[l[4]] : '#fff'} size={42} />)}
</>);

// ---- nevera ----
const Nevera: React.FC<{s: Spec; dur: number}> = ({s, dur}) => {
  const f = useCurrentFrame(); const t = f / 30;
  const mS = sp(f, 4), pS = sp(f, 0.55 * dur), bS = sp(f, 0.68 * dur);
  return (
    <Stage cam={[0, 0, 9.5]}>
      <group rotation={[0.04, Math.sin(t * 0.6) * 0.14 - 0.1, 0]}>
        <RoundedBox size={[3.3, 5.2, 0.9]} color="#cfc8ea" pos={[s.final ? 0.5 : 2.9, 0, 0]} radius={0.18} />
        <group position={[s.final ? -2.4 : 0, 0, 0]}>
          <mesh position={[1.45, 0.9, 0.55]}><boxGeometry args={[0.1, 1.2, 0.12]} />{mat('#8b7fc7')}</mesh>
        </group>
        <group position={[s.final ? -2.4 : 0, 0, 0]}>
          <mesh position={[2.9, 0.05, 0.62]}><planeGeometry args={[1.7, 2.1]} />{mat('#e9d9b3', 0.8)}</mesh>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => <mesh key={i} position={[2.9, 0.62 - i * 0.26, 0.63]}><planeGeometry args={[1.25 - (i === 3 ? 0.4 : 0), 0.07]} />{mat('#5a47a8', 0.8)}</mesh>)}
          <mesh position={[2.9, 0.78, 0.72]} rotation={[Math.PI / 2, 0, 0]} scale={mS}><cylinderGeometry args={[0.3, 0.3, 0.16, 40]} />{mat('#E8703A', 0.35)}</mesh>
        </group>
        {!s.final && <group position={[-4.3, -0.2, 0.5]}><Plug s={pS * 0.95} /></group>}
        {!s.final && <group position={[-1.6, -0.2, 0.5]} rotation={[0, t * 0.5, 0]}><Battery s={bS} /></group>}
      </group>
    </Stage>
  );
};

// ---- campo ----
const Campo: React.FC<{s: Spec; dur: number}> = ({s, dur}) => {
  const f = useCurrentFrame(); const t = f / 30;
  const barO = interpolate(f, [0.35 * dur, 0.35 * dur + 20], [0, 1], clamp);
  const pulse = 0.62 + Math.sin(t * 3) * 0.04;
  return (<>
    <Stage cam={[0, 0, 9]}>
      <group position={[2.9, 0, 0]} rotation={[0.25, t * 0.25, 0.1]} scale={1.15 * sp(f, 0)}>
        <BarMagnet /><FieldLines time={t} />
      </group>
    </Stage>
    {s.barra && <div style={{position: 'absolute', left: 70, top: 470, opacity: barO, fontFamily: FONT, color: '#fff', fontWeight: 500, fontSize: 36}}>
      ¿Gasta algo?
      <div style={{marginTop: 18, width: 520, height: 18, borderRadius: 9, background: 'rgba(255,255,255,.14)', overflow: 'hidden'}}>
        <div style={{width: `${pulse * 100}%`, height: '100%', background: C.yellow, borderRadius: 9}} />
      </div>
      <div style={{fontSize: 28, marginTop: 10, opacity: 0.85}}>Energía usada: ?</div>
    </div>}
  </>);
};

// ---- batería vs imán ----
const Bateria: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const t = f / 30;
  const lvl = interpolate(f, [0.2 * dur, 0.62 * dur], [1, 0.0], clamp);
  const mag = interpolate(f, [0.62 * dur, 0.72 * dur], [0, 1], clamp);
  const flow = (f * 0.06 * Math.min(1, lvl * 3));
  const chem = interpolate(f, [0.05 * dur, 0.2 * dur], [0, 1], clamp);
  return (<>
    <Stage cam={[0, 0, 9.5]}>
      <group position={[-4.4, 0, 0]} rotation={[0, Math.sin(t * 0.7) * 0.5, 0.1]} scale={1.35 * sp(f, 0)}><Battery s={1} cross={false} /></group>
      {/* cable y cargas que se mueven */}
      <mesh position={[-1.6, 0.9, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.07, 0.07, 6.2, 12]} />{mat('#a65a36', 0.45)}</mesh>
      {Array.from({length: 9}).map((_, i) => <mesh key={i} position={[-4.6 + ((i * 0.75 + flow) % 6.4) * 1.0, 0.98, 0.06]} visible={lvl > 0.04}><sphereGeometry args={[0.1, 12, 12]} />{mat(C.cyan, 0.2)}</mesh>)}
      {/* bombilla que se apaga */}
      <group position={[1.4, 0.2, 0]}>
        <mesh position={[0, 0.2, 0]}><sphereGeometry args={[0.8, 32, 24]} /><meshStandardMaterial color={lvl > 0.05 ? '#FFD83A' : '#6f6891'} emissive="#FFD83A" emissiveIntensity={lvl * 1.1} roughness={0.3} transparent opacity={0.95} /></mesh>
        <mesh position={[0, -0.75, 0]}><cylinderGeometry args={[0.36, 0.3, 0.55, 20]} />{mat('#b9b3d4', 0.3)}</mesh>
        {lvl > 0.02 && <pointLight position={[0, 0.2, 1.2]} intensity={lvl * 30} color="#FFD83A" />}
      </group>
      <group position={[4.4, 0, 0]} rotation={[0.25, t * 0.25, 0.1]} scale={mag}><BarMagnet /><FieldLines time={t} scale={0.9} /></group>
    </Stage>
    <div style={{position: 'absolute', left: 90, top: 790, opacity: chem, fontFamily: FONT, color: '#fff', fontWeight: 600, fontSize: 36}}>Reserva química
      <div style={{marginTop: 10, width: 400, height: 18, borderRadius: 9, background: 'rgba(255,255,255,.14)'}}><div style={{width: `${lvl * 100}%`, height: '100%', background: lvl > 0.25 ? C.green : C.orange, borderRadius: 9}} /></div></div>
    <div style={{position: 'absolute', left: 1440, top: 790, opacity: mag, fontFamily: FONT, color: '#fff', fontWeight: 600, fontSize: 36}}>Imán: sin reserva
      <div style={{marginTop: 10, width: 380, height: 18, borderRadius: 9, background: 'rgba(255,255,255,.14)'}}><div style={{width: '100%', height: '100%', background: C.yellow, borderRadius: 9}} /></div></div>
    <Label text={lvl > 0.04 ? 'la corriente empuja cargas' : 'sin reserva: se apaga'} x={560} y={300} from={0.2 * dur} color={lvl > 0.04 ? C.cyan : C.orange} size={38} />
  </>);
};

// ---- libro/mesa ----
const Libro: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const t = f / 30;
  const gS = sp(f, 0.4 * dur), tS = sp(f, 0.5 * dur);
  const legs: [number, number][] = [[-2.0, -0.9], [2.0, -0.9], [-2.0, 0.9], [2.0, 0.9]];
  return (
    <Stage cam={[0, 1.2, 10]}>
      <group position={[1.2, -0.2, 0]} rotation={[0.18, Math.sin(t * 0.5) * 0.16 - 0.15, 0]}>
        <RoundedBox size={[5.0, 0.28, 2.6]} color="#b57a43" pos={[0, -0.9, 0]} radius={0.08} />
        {legs.map(([x, z], i) => <mesh key={i} position={[x, -2.0, z]}><cylinderGeometry args={[0.12, 0.1, 2.0, 16]} />{mat('#8a5a2e')}</mesh>)}
        <RoundedBox size={[2.2, 0.5, 1.6]} color="#9a4de6" pos={[0, -0.51, 0]} radius={0.06} />
        <mesh position={[0, -0.51, 0]}><boxGeometry args={[2.1, 0.38, 1.66]} />{mat('#eadbb8', 0.8)}</mesh>
        <group scale={[1, gS, 1]} position={[-0.6, 0.2 + (1 - gS) * 0.6, 0.3]}><Arrow color={C.orange} dir={-1} pos={[0, 1.3, 0]} len={1.3} r={0.07} /></group>
        <group scale={[1, tS, 1]} position={[1.7, -0.78, 0.3]}><Arrow color={C.green} len={1.5} r={0.07} /></group>
      </group>
    </Stage>
  );
};

// ---- caja empujada / pared ----
const Bloque: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const t = f / 30;
  const half = 0.55 * dur;
  const x1 = interpolate(f, [0.08 * dur, 0.4 * dur], [-4.2, -1.2], clamp);
  const phase2 = f > half;
  return (<>
    <Stage cam={[0, 1.4, 10.5]}>
      <group rotation={[0.2, Math.sin(t * 0.4) * 0.08, 0]}>
        <RoundedBox size={[13, 0.3, 3]} color="#3a2466" pos={[0, -1.55, 0]} radius={0.1} />
        {!phase2 && <group position={[x1, -0.65, 0]}>
          <RoundedBox size={[1.5, 1.5, 1.5]} color="#9a4de6" radius={0.12} />
          <group position={[-1.9, 0, 0]} rotation={[0, 0, -Math.PI / 2]}><Arrow color={C.orange} len={1.2} r={0.08} /></group>
        </group>}
        {phase2 && <group>
          <RoundedBox size={[1.2, 3.4, 2.4]} color="#6f66a8" pos={[2.2, 0.1, 0]} radius={0.1} />
          <group position={[0.2, 0.1, 0]} rotation={[0, 0, -Math.PI / 2]} scale={1 + Math.sin(t * 6) * 0.04}><Arrow color={C.orange} len={1.6} r={0.09} /></group>
          <mesh position={[-1.9, -0.15, 0]}><sphereGeometry args={[0.5, 24, 24]} />{mat('#e8b48c')}</mesh>
          <mesh position={[-1.9, -0.9, 0]}><capsuleGeometry args={[0.45, 1.0, 8, 16]} />{mat(C.green)}</mesh>
        </group>}
      </group>
    </Stage>
    <div style={{position: 'absolute', left: 70, top: 200, fontFamily: FONT, color: '#fff', fontWeight: 700, fontSize: 56, opacity: interpolate(f, [0.05 * dur, 0.05 * dur + 12], [0, 1], clamp)}}>
      {phase2 ? 'Distancia = 0  →  Trabajo = 0' : 'Fuerza × distancia = energía'}</div>
  </>);
};

// ---- anillo con corriente ----
const Dots: React.FC<{speed: (t: number) => number; plano?: boolean; r?: number}> = ({speed, r = 1.6}) => {
  const f = useCurrentFrame(); const t = f / 30;
  // ángulo acumulado
  let a = 0; for (let i = 0; i < f; i += 3) a += speed(i / 30) * 0.1;
  return <>{Array.from({length: 18}).map((_, i) => {
    const th = a + (i / 18) * Math.PI * 2;
    return <mesh key={i} position={[Math.cos(th) * r, Math.sin(th) * r, 0]}><sphereGeometry args={[0.1, 12, 12]} />{mat(C.cyan, 0.2)}</mesh>;
  })}</>;
};
const Anillo: React.FC<{s: Spec; dur: number}> = ({s, dur}) => {
  const f = useCurrentFrame(); const t = f / 30;
  const heat = s.plano ? 0 : interpolate(f, [0.3 * dur, 0.9 * dur], [0, 1], clamp);
  const speed = (tt: number) => (s.plano ? 3.2 : 3.2 * Math.exp(-tt * 0.55));
  const chartO = interpolate(f, [0.15 * dur, 0.3 * dur], [0, 1], clamp);
  const draw = interpolate(f, [0.2 * dur, 0.85 * dur], [0, 1], clamp);
  const pts = Array.from({length: 61}).map((_, i) => { const x = i / 60; const y = s.plano ? 1 : Math.exp(-x * 3.2); return `${1180 + x * 560 * draw},${760 - y * 300}`; });
  return (<>
    <Stage cam={[0, 0, 9.5]}>
      <group position={[-3.1, 0.2, 0]} rotation={[0.35, Math.sin(t * 0.5) * 0.2, 0]}>
        <mesh><torusGeometry args={[1.6, 0.17, 20, 80]} /><meshStandardMaterial color="#ff8a4c" emissive="#ff3b1a" emissiveIntensity={heat * 0.6} roughness={0.4} /></mesh>
        <Dots speed={speed} />
      </group>
    </Stage>
    <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, opacity: chartO, fontFamily: FONT}}>
      <path d="M 1180 420 V 780 H 1800" stroke="#e9e4f7" strokeWidth="3" fill="none" />
      <text x="1160" y="390" fill="#fff" fontSize="34" fontWeight="500">corriente</text>
      <text x="1650" y="835" fill="#fff" fontSize="34" fontWeight="500">tiempo</text>
      <polyline points={pts.join(' ')} fill="none" stroke={s.plano ? C.yellow : C.orange} strokeWidth="7" strokeLinecap="round" />
    </svg>
  </>);
};

// ---- Ørsted ----
const Oersted: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const t = f / 30;
  const on = interpolate(f, [0.3 * dur, 0.42 * dur], [0, 1], clamp);
  const ang = on * 0.95 + Math.sin(t * 5) * 0.03 * on;
  const flow = f * 0.07 * on;
  return (<>
    <Stage cam={[0, 3.2, 8.5]}>
      <group rotation={[0.45, Math.sin(t * 0.4) * 0.1 - 0.1, 0]}>
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.16, 0.16, 12, 20]} />{mat('#a65a36', 0.45)}</mesh>
        {Array.from({length: 14}).map((_, i) => <mesh key={i} position={[((i * 0.9 + flow) % 12.6) - 6.3, 0.19, 0]} visible={on > 0.05}><sphereGeometry args={[0.1, 12, 12]} />{mat(C.cyan, 0.2)}</mesh>)}
        <group position={[0, -0.2, 0.1]}>
          <mesh rotation={[0, 0, 0]}><cylinderGeometry args={[1.5, 1.5, 0.18, 48]} />{mat('#f3e8b4', 0.35)}</mesh>
          <mesh position={[0, -0.12, 0]}><cylinderGeometry args={[1.62, 1.62, 0.1, 48]} />{mat(C.yellow, 0.3)}</mesh>
          <group position={[0, 0.2, 0]} rotation={[0, ang, 0]}>
            <mesh position={[0.65, 0, 0]} rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[0.2, 1.3, 16]} />{mat('#EF4B4B', 0.3)}</mesh>
            <mesh position={[-0.65, 0, 0]} rotation={[0, 0, Math.PI / 2]}><coneGeometry args={[0.2, 1.3, 16]} />{mat('#3F6DFF', 0.3)}</mesh>
          </group>
        </group>
        <group position={[-5.3, -0.2, 0]}><mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.5, 0.5, 1.4, 28]} />{mat('#2fd69a', 0.35)}</mesh></group>
      </group>
    </Stage>
    <Label text={on > 0.5 ? 'corriente: ON' : 'corriente: OFF'} x={1480} y={170} from={0} color={on > 0.5 ? C.cyan : '#b9b0d6'} size={42} />
  </>);
};

// ---- órbita ----
const Orbita: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const t = f / 30;
  return (
    <Stage cam={[0, 0, 9.5]}>
      <group position={[2.4, 0, 0]} rotation={[1.0, 0.3, 0]} scale={1.2}>
        <mesh><sphereGeometry args={[0.45, 32, 24]} />{mat('#ff8a4c', 0.3)}</mesh>
        {[1.6, 2.5].map((r, i) => (<group key={i}>
          <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[r, 0.02, 8, 90]} />{mat('#9be7ff', 0.2)}</mesh>
          <mesh position={[Math.cos(t * (1.6 - i * 0.5) + i * 2) * r, 0, Math.sin(t * (1.6 - i * 0.5) + i * 2) * r]}><sphereGeometry args={[0.2, 20, 20]} />{mat(C.cyan, 0.2)}</mesh>
        </group>))}
      </group>
    </Stage>
  );
};

// ---- espines ----
const SpinG: React.FC<{x: number; y: number; k: number; t: number; rz: number; rx: number}> = ({x, y, k, t, rz, rx}) => (
  <group position={[x, y, 0]}>
    <group rotation={[rx, 0, rz]}>
      <group rotation={[0, t * 1.2 + k, 0]}>
        <mesh><sphereGeometry args={[0.34, 32, 24]} />{mat('#2FB8C8', 0.3)}</mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.46, 0.018, 8, 48, Math.PI * 1.5]} />{mat('#9be7ff', 0.2)}</mesh>
      </group>
      <Arrow color={C.yellow} len={0.8} pos={[0, 0.3, 0]} r={0.05} />
    </group>
  </group>
);
const Grid: React.FC<{mode: 'ordenado' | 'alinea' | 'dominios' | 'calor'; dur: number}> = ({mode, dur}) => {
  const f = useCurrentFrame(); const t = f / 30;
  const al = mode === 'ordenado' ? 1 : mode === 'calor' ? 1 - interpolate(f, [0.15 * dur, 0.7 * dur], [0, 1], clamp) : interpolate(f, [0.25 * dur, 0.7 * dur], [0, 1], clamp);
  return (
    <Stage cam={[0, 0, 10.5]}>
      <group rotation={[0.12, Math.sin(t * 0.5) * 0.12, 0]} scale={sp(f, 0)} position={[0.8, -0.2, 0]}>
        {[0, 1, 2].flatMap((r) => [0, 1, 2, 3, 4].map((c) => {
          const k = r * 5 + c;
          const g = (r === 0 ? 0 : r === 1 ? 1 : 2) * 2 + (c < 2 ? 0 : c < 3 ? 1 : 2); // dominios por zonas
          const seed = mode === 'dominios' ? (c < 2 ? 3 : c < 4 ? (r < 2 ? 7 : 11) : 5) : k;
          const jit = mode === 'calor' ? Math.sin(t * 9 + k * 1.7) * 0.5 * (1 - al) : 0;
          const domAng = c < 2 ? -1.2 : c < 4 ? (r < 2 ? 1.3 : 2.6) : -0.4;
          const rz = (mode === 'dominios' ? domAng : (rnd(seed) - 0.5) * Math.PI * 1.7) * (1 - al) + jit;
          const rx = (rnd(seed + 50) - 0.5) * 1.2 * (1 - al);
          return <SpinG key={k} k={k} x={(c - 2) * 1.9} y={(1 - r) * 1.9} t={t} rz={rz} rx={rx} />;
        }))}
      </group>
    </Stage>
  );
};

// ---- gráfica ----
const Grafica: React.FC<{s: Spec; dur: number}> = ({s, dur}) => {
  const f = useCurrentFrame(); const t = f / 30;
  const o = interpolate(f, [4, 20], [0, 1], clamp);
  const line = interpolate(f, [0.2 * dur, 0.8 * dur], [0, 1], clamp);
  const pts = Array.from({length: 41}).map((_, i) => { const x = i / 40; const y = s.curva === 'suave' ? 400 + x * x * 28 : 400; return `${500 + x * 1020 * line},${y}`; });
  return (<>
    <Stage cam={[0, 0, 10.5]}>
      <group position={[-5.0, -1.6, 0]} rotation={[0.2, t * 0.3, 0]} scale={0.5 * sp(f, 0)}><BarMagnet /><FieldLines time={t} /></group>
    </Stage>
    <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, opacity: o, fontFamily: FONT}}>
      <path d="M 500 330 V 800 H 1560" stroke="#e9e4f7" strokeWidth="3" fill="none" />
      <text x="480" y="290" fill="#fff" fontSize="34" fontWeight="500">fuerza (%)</text>
      <text x="1170" y="860" fill="#fff" fontSize="34" fontWeight="500">décadas de uso</text>
      <polyline points={pts.join(' ')} fill="none" stroke={C.yellow} strokeWidth="7" strokeLinecap="round" />
      <text x="1330" y="940" fill="#b9b0d6" fontSize="26" fontWeight="500">CURVA ILUSTRATIVA</text>
    </svg>
  </>);
};

// ---- imán y clip ----
const Clip: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const t = f / 30;
  const up = interpolate(f, [0.12 * dur, 0.3 * dur], [-2.2, -0.35], clamp);
  const down = interpolate(f, [0.58 * dur, 0.78 * dur], [0, -1.9], clamp);
  const y = f < 0.58 * dur ? up : -0.35 + down;
  const handO = interpolate(f, [0.55 * dur, 0.6 * dur], [0, 1], clamp);
  return (
    <Stage cam={[0, 0, 9.5]}>
      <group rotation={[0.15, Math.sin(t * 0.5) * 0.15, 0]} position={[1.5, 0.3, 0]}>
        <group position={[0, 1.6, 0]} rotation={[0, 0, Math.PI / 2]}><BarMagnet scale={1.2} /></group>
        <group position={[0, y, 0]}>
          <RoundedBox size={[1.3, 0.35, 0.5]} color="#b9b3d4" radius={0.1} />
        </group>
        <mesh position={[0, y - 0.55, 0]} visible={handO > 0.1} rotation={[0, 0, 0]}><capsuleGeometry args={[0.12, 0.9, 6, 12]} />{mat(C.orange, 0.4)}</mesh>
        <group position={[0, 1.6, 0]} rotation={[0, 0, Math.PI / 2]}><FieldLines time={t} scale={0.8} /></group>
      </group>
    </Stage>
  );
};

// ---- imán cayendo por un tubo de cobre ----
const Tubo: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const t = f / 30;
  const yFast = 2.4 - ((t * 1.0) % 1.0) * 5.2;
  const yMag = 2.2 - interpolate(f, [0.1 * dur, 0.9 * dur], [0, 4.4], clamp);
  return (<>
    <Stage cam={[0, 0, 11]}>
      <group rotation={[0.1, Math.sin(t * 0.4) * 0.12, 0]}>
        <group position={[2.8, 0, 0]}>
          <mesh><cylinderGeometry args={[0.8, 0.8, 5.6, 40, 1, true]} /><meshStandardMaterial color="#d9803f" metalness={0.5} roughness={0.35} transparent opacity={0.4} side={2} /></mesh>
          <group position={[0, yMag, 0]}><group rotation={[0, 0, Math.PI / 2]}><BarMagnet scale={0.38} /></group></group>
        </group>
        <group position={[-2.8, 0, 0]}>
          <group position={[0, yFast, 0]}><RoundedBox size={[0.55, 0.9, 0.55]} color="#b9b3d4" radius={0.1} /></group>
        </group>
      </group>
    </Stage>
    <Label text="sin tubo: cae rápido" x={170} y={850} from={0.2 * dur} size={36} />
    <Label text="en el tubo de cobre: cae lento" x={1100} y={850} from={0.2 * dur} size={36} color={C.orange} />
  </>);
};

// ---- histéresis ----
const Histeresis: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const t = f / 30;
  const o = interpolate(f, [4, 20], [0, 1], clamp);
  const draw = interpolate(f, [0.15 * dur, 0.85 * dur], [0, 1], clamp);
  const N = 80; const pts: string[] = [];
  const up = (h: number) => Math.tanh((h - 0.35) * 3.2), dn = (h: number) => Math.tanh((h + 0.35) * 3.2);
  for (let i = 0; i <= N * draw * 2; i++) {
    const u = i / N; // 0..2
    const h = u <= 1 ? -1 + u * 2 : 1 - (u - 1) * 2; const m = u <= 1 ? up(h) : dn(h);
    pts.push((1350 + h * 380) + ',' + (560 - m * 220));
  }
  return (<>
    <Stage cam={[0, 0, 10.5]}>
      <group position={[-4.2, -0.2, 0]} rotation={[0.2, t * 0.3, 0]} scale={0.8 * sp(f, 0)}><BarMagnet /><FieldLines time={t} /></group>
    </Stage>
    <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, opacity: o, fontFamily: FONT}}>
      <path d="M 900 560 H 1800 M 1350 300 V 820" stroke="#e9e4f7" strokeWidth="3" fill="none" />
      <text x="1370" y="300" fill="#fff" fontSize="34" fontWeight="500">magnetización</text>
      <text x="1560" y="610" fill="#fff" fontSize="34" fontWeight="500">campo aplicado</text>
      <polyline points={pts.join(' ')} fill="none" stroke={C.yellow} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="1350" cy={560 - dn(0) * 220} r="10" fill={C.green} opacity={draw > 0.55 ? 1 : 0} />
      <text x="1375" y={540 - dn(0) * 220} fill={C.green} fontSize="30" fontWeight="600" opacity={draw > 0.55 ? 1 : 0}>remanencia</text>
    </svg>
  </>);
};

// ---- bandas del fondo oceánico ----
const Bandas: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const t = f / 30;
  const widths = [0.35, 0.7, 0.45, 0.9, 0.5, 0.65];
  const bars: {x: number; w: number; c: string}[] = []; let x = 0.25; let i = 0;
  for (const w of widths) { bars.push({x, w, c: i % 2 === 0 ? '#EF7B3C' : '#3F6DFF'}); bars.push({x: -x - w, w, c: i % 2 === 0 ? '#EF7B3C' : '#3F6DFF'}); x += w; i++; }
  const grow = interpolate(f, [0.1 * dur, 0.6 * dur], [0, 1], clamp);
  return (
    <Stage cam={[0, 5.5, 8]}>
      <group rotation={[-0.35, Math.sin(t * 0.3) * 0.15, 0]}>
        {bars.map((b, k) => <mesh key={k} position={[(b.x + b.w / 2) * 1.5, 0, 0]} scale={[Math.min(1, grow * 1.6 - Math.abs(b.x) * 0.15), 1, 1]}><boxGeometry args={[b.w * 1.5, 0.12, 5]} />{mat(b.c, 0.5)}</mesh>)}
        <mesh position={[0, 0.1, 0]}><boxGeometry args={[0.3, 0.12, 5.2]} />{mat(C.yellow, 0.3)}</mesh>
      </group>
    </Stage>
  );
};

export const BODY: Record<string, React.FC<any>> = {
  nevera: Nevera, campo: Campo, bateria: Bateria, libro: Libro, bloque: Bloque, anillo: Anillo, oersted: Oersted, orbita: Orbita, grafica: Grafica, clip: Clip, tubo: Tubo, histeresis: Histeresis, bandas: Bandas,
  espines: (p: any) => <Grid mode="ordenado" dur={p.dur} />, alinea: (p: any) => <Grid mode="alinea" dur={p.dur} />,
  dominios: (p: any) => <Grid mode="dominios" dur={p.dur} />, calor: (p: any) => <Grid mode="calor" dur={p.dur} />,
};

export const Zoom: React.FC<{dur: number; i: number; children: React.ReactNode}> = ({dur, i, children}) => {
  const f = useCurrentFrame();
  const p = f / dur; const dir = i % 2 === 0 ? 1 : -1;
  return <AbsoluteFill style={{transform: `scale(${1.0 + 0.05 * p}) translate(${dir * p * -14}px, ${p * -8}px)`, transformOrigin: '60% 50%'}}>{children}</AbsoluteFill>;
};

export const Completo: React.FC = () => {
  const sc = spec as unknown as Spec[];
  let acc = 0;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Backdrop />
      {sc.map((s, i) => {
        const from = acc; acc += FR[i];
        const B = BODY[s.tipo];
        return <Sequence key={i} from={from} durationInFrames={FR[i]} layout="none">
          <Fade dur={FR[i]}><Zoom dur={FR[i]} i={i}><B s={s} dur={FR[i]} />{s.items && <Cues items={s.items} texto={(s as any).texto} dur={FR[i]} tipo={s.tipo} barra={s.barra} />}</Zoom><Overlay s={s} dur={FR[i]} /></Fade>
        </Sequence>;
      })}
    </AbsoluteFill>
  );
};
