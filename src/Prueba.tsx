import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import tl from '../data/timeline.json';
import {Backdrop, C, FONT, Label, Pill, Title} from './ui';
import {Arrow, BarMagnet, FieldLines, RoundedBox, Stage, mat} from './three';

const FR = tl.frames as number[];
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const sp = (f: number, from: number, fps = 30) => spring({frame: f - from, fps, config: {damping: 13, stiffness: 120}});
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const Fade: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8, dur - 6, dur], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

// ---------- Escena 1: imán en la nevera ----------
const Plug: React.FC<{s: number}> = ({s}) => (
  <group scale={s}>
    <RoundedBox size={[0.9, 0.9, 0.5]} color="#b9b3d4" pos={[0, 0, 0]} />
    <mesh position={[-0.18, 0.62, 0]}><boxGeometry args={[0.1, 0.45, 0.08]} />{mat('#d8d3ee', 0.2)}</mesh>
    <mesh position={[0.18, 0.62, 0]}><boxGeometry args={[0.1, 0.45, 0.08]} />{mat('#d8d3ee', 0.2)}</mesh>
    <mesh position={[0, -0.8, 0]}><cylinderGeometry args={[0.07, 0.07, 0.9, 12]} />{mat('#8a84a8')}</mesh>
    <Cross />
  </group>
);
const Cross: React.FC = () => (
  <group position={[0, 0.1, 0.45]}>
    <mesh rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[1.9, 0.14, 0.08]} />{mat(C.orange, 0.3)}</mesh>
    <mesh rotation={[0, 0, -Math.PI / 4]}><boxGeometry args={[1.9, 0.14, 0.08]} />{mat(C.orange, 0.3)}</mesh>
  </group>
);
const Battery: React.FC<{s: number}> = ({s}) => (
  <group scale={s} rotation={[0, 0, 0]}>
    <mesh><cylinderGeometry args={[0.45, 0.45, 1.4, 32]} />{mat('#2fd69a', 0.35)}</mesh>
    <mesh position={[0, 0.78, 0]}><cylinderGeometry args={[0.16, 0.16, 0.2, 20]} />{mat('#d9d4ee', 0.3)}</mesh>
    <mesh position={[0, -0.45, 0]}><cylinderGeometry args={[0.461, 0.461, 0.5, 32]} />{mat('#1d1735', 0.5)}</mesh>
    <Cross />
  </group>
);

const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const mS = sp(f, 4);
  const pS = sp(f, 62), bS = sp(f, 80);
  return (<>
    <Stage cam={[0, 0, 9.5]}>
      <group rotation={[0.04, Math.sin(t * 0.6) * 0.14 - 0.1, 0]}>
        <RoundedBox size={[3.3, 5.2, 0.9]} color="#cfc8ea" pos={[2.9, 0, 0]} radius={0.18} />
        <mesh position={[1.45, 0.9, 0.55]}><boxGeometry args={[0.1, 1.2, 0.12]} />{mat('#8b7fc7')}</mesh>
        <mesh position={[2.9, 0.05, 0.62]}><planeGeometry args={[1.7, 2.1]} />{mat('#e9d9b3', 0.8)}</mesh>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <mesh key={i} position={[2.9, 0.62 - i * 0.26, 0.63]}><planeGeometry args={[1.25 - (i === 3 ? 0.4 : 0), 0.07]} />{mat('#5a47a8', 0.8)}</mesh>
        ))}
        <mesh position={[2.9, 0.78, 0.72]} rotation={[Math.PI / 2, 0, 0]} scale={mS}><cylinderGeometry args={[0.3, 0.3, 0.16, 40]} />{mat('#E8703A', 0.35)}</mesh>
        <group position={[-4.3, -0.2, 0.5]}><Plug s={pS * 0.95} /></group>
        <group position={[-1.6, -0.2, 0.5]} rotation={[0, t * 0.5, 0]}><Battery s={bS} /></group>
      </group>
    </Stage>
    <Pill text="Un imán pequeño" from={6} to={62} />
    <Pill text="Años sin recargarse" from={66} color="green" />
    <Label text="sin enchufe" x={170} y={800} from={74} />
    <Label text="sin batería" x={640} y={800} from={92} />
  </>);
};

// ---------- Escena 2: campo y pregunta ----------
const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const barO = interpolate(f, [60, 80], [0, 1], clamp);
  const pulse = 0.62 + Math.sin(t * 3) * 0.04;
  return (<>
    <Stage cam={[0, 0, 9]}>
      <group position={[2.9, 0, 0]} rotation={[0.25, t * 0.25, 0.1]} scale={1.15 * sp(f, 0)}>
        <BarMagnet />
        <FieldLines time={t} />
      </group>
    </Stage>
    <Pill text="Un misterio antiguo" from={6} />
    <Title lines={['¿De dónde sale', 'su energía?']} from={14} top={150} />
    <div style={{position: 'absolute', left: 70, top: 470, opacity: barO, fontFamily: FONT, color: '#fff', fontWeight: 500, fontSize: 36}}>
      ¿Gasta algo?
      <div style={{marginTop: 18, width: 520, height: 18, borderRadius: 9, background: 'rgba(255,255,255,.14)', overflow: 'hidden'}}>
        <div style={{width: `${pulse * 100}%`, height: '100%', background: C.yellow, borderRadius: 9}} />
      </div>
      <div style={{fontSize: 28, marginTop: 10, opacity: 0.85}}>Energía usada: ?</div>
    </div>
  </>);
};

// ---------- Escena 3: libro sobre mesa ----------
const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const gS = sp(f, 50), tS = sp(f, 64);
  const legs: [number, number][] = [[-2.0, -0.9], [2.0, -0.9], [-2.0, 0.9], [2.0, 0.9]];
  return (<>
    <Stage cam={[0, 1.2, 10]}>
      <group position={[1.2, -0.2, 0]} rotation={[0.18, Math.sin(t * 0.5) * 0.16 - 0.15, 0]}>
        <RoundedBox size={[5.0, 0.28, 2.6]} color="#b57a43" pos={[0, -0.9, 0]} radius={0.08} />
        {legs.map(([x, z], i) => <mesh key={i} position={[x, -2.0, z]}><cylinderGeometry args={[0.12, 0.1, 2.0, 16]} />{mat('#8a5a2e')}</mesh>)}
        <RoundedBox size={[2.2, 0.5, 1.6]} color="#9a4de6" pos={[0, -0.51, 0]} radius={0.06} />
        <mesh position={[0, -0.51, 0.0]}><boxGeometry args={[2.1, 0.38, 1.66]} />{mat('#eadbb8', 0.8)}</mesh>
        <group scale={[1, gS, 1]} position={[-0.6, 0.2 + (1 - gS) * 0.6, 0.3]}><Arrow color={C.orange} dir={-1} pos={[0, 1.3, 0]} len={1.3} r={0.07} /></group>
        <group scale={[1, tS, 1]} position={[1.7, -0.78, 0.3]}><Arrow color={C.green} len={1.5} r={0.07} /></group>
      </group>
    </Stage>
    <Pill text="Un libro pesado" from={6} to={50} />
    <Pill text="Fuerza: sí" from={54} to={120} color="green" />
    <Pill text="Energía gastada: 0" from={124} />
    <Label text="Gravedad" x={560} y={260} from={52} color={C.orange} size={42} />
    <Label text="La mesa empuja" x={1230} y={300} from={66} color={C.green} size={42} />
  </>);
};

// ---------- Cuadrícula de espines ----------
const Spin: React.FC<{x: number; y: number; k: number; t: number; align: number}> = ({x, y, k, t, align}) => {
  const rz = (rnd(k) - 0.5) * Math.PI * 1.7 * (1 - align);
  const rx = (rnd(k + 50) - 0.5) * 1.2 * (1 - align);
  return (
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
};
const SpinGrid: React.FC<{t: number; align: number; scale?: number; pos?: [number, number, number]}> = ({t, align, scale = 1, pos = [0, 0, 0]}) => (
  <group scale={scale} position={pos}>
    {[0, 1, 2].flatMap((r) => [0, 1, 2, 3, 4].map((c) => <Spin key={`${r}${c}`} k={r * 5 + c} x={(c - 2) * 1.9} y={(1 - r) * 1.9} t={t} align={align} />))}
  </group>
);

const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  return (<>
    <Stage cam={[0, 0, 10.5]}>
      <group rotation={[0.12, Math.sin(t * 0.5) * 0.12, 0]}>
        <SpinGrid t={t} align={1} scale={sp(f, 0)} pos={[0.8, -0.2, 0]} />
      </group>
    </Stage>
    <Pill text="Espín intrínseco" from={6} to={92} />
    <Pill text="Cada electrón, un imán" from={96} color="green" />
  </>);
};

// ---------- Escena 5: alineados y gráfica ----------
const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const align = interpolate(f, [8, 60], [0, 1], clamp);
  const gridS = interpolate(f, [70, 90], [1, 0], clamp);
  const chartO = interpolate(f, [84, 100], [0, 1], clamp);
  const line = interpolate(f, [100, 140], [0, 1], clamp);
  return (<>
    <Stage cam={[0, 0, 10.5]}>
      <group rotation={[0.1, Math.sin(t * 0.5) * 0.1, 0]}>
        {gridS > 0.01 && <SpinGrid t={t} align={align} scale={gridS} pos={[0.8, -0.2, 0]} />}
      </group>
      <group position={[-5.2, -1.6, 0]} rotation={[0.2, t * 0.3, 0]} scale={0.5 * chartO}>
        <BarMagnet /><FieldLines time={t} />
      </group>
    </Stage>
    <Pill text="Todos alineados" from={10} to={80} />
    <Pill text="Sin energía consumida" from={96} color="green" />
    <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, opacity: chartO, fontFamily: FONT}}>
      <g stroke="#e9e4f7" strokeWidth="3" fill="none"><path d="M 500 330 V 800 H 1560" /></g>
      <text x="480" y="290" fill="#fff" fontSize="34" fontWeight="500">fuerza (%)</text>
      <text x="1170" y="860" fill="#fff" fontSize="34" fontWeight="500">décadas de uso</text>
      <line x1="500" y1="400" x2={500 + 1020 * line} y2="400" stroke={C.yellow} strokeWidth="7" strokeLinecap="round" />
      <text x="1330" y="940" fill="#b9b0d6" fontSize="26" fontWeight="500">CURVA ILUSTRATIVA</text>
    </svg>
  </>);
};

// ---------- Escena 6: cierre ----------
const Scene6: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  return (<>
    <Stage cam={[0, 0, 9]}>
      <group position={[2.9, 0, 0]} rotation={[0.25, t * 0.3, 0.1]} scale={1.15 * sp(f, 0)}>
        <BarMagnet /><FieldLines time={t} />
      </group>
    </Stage>
    <Pill text="La clave" from={4} />
    <Title lines={['Un imán no crea', 'energía.']} from={10} />
    <Pill text="Solo mantiene una fuerza" from={34} color="green" top={440} />
  </>);
};

export const Prueba: React.FC = () => {
  const scenes = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6];
  let acc = 0;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Backdrop />
      {scenes.map((S, i) => {
        const from = acc; acc += FR[i];
        return <Sequence key={i} from={from} durationInFrames={FR[i]}><Fade dur={FR[i]}><S /></Fade></Sequence>;
      })}
      <Audio src={staticFile('audio/voz.m4a')} volume={1.41} />
    </AbsoluteFill>
  );
};
