import React from 'react';
import * as THREE from 'three';
import {interpolate, useCurrentFrame} from 'remotion';
import {Stage, mat, RoundedBox, BarMagnet, Arrow} from './three';
import {Battery, Plug, sp, clamp} from './Prueba';
import {C, FONT} from './ui';

const Em: React.FC<{color: string; i?: number}> = ({color, i = 0.8}) => <meshStandardMaterial color={color} emissive={color} emissiveIntensity={i} roughness={0.3} />;

export const NAMES: Record<string, string> = {
  movil: 'móvil', linterna: 'linterna', bombilla: 'bombilla', pila: 'pila', roca: 'roca', atomo: 'átomos', brujula: 'brújula', tierra: 'Tierra', rio: 'río',
  pared: 'pared', flecha: 'fuerza', rayo: 'energía', reloj: 'tiempo', rueda: 'rueda de imanes', motor: 'motor', libro: 'leyes', iman: 'imán', bobina: 'electroimán',
  clavo: 'hierro', llama: 'calor', martillo: 'golpes', clip: 'clip', mano: 'mano', caja: 'peso', valle: 'valle de energía', bacteria: 'bacteria', rana: 'rana', agua: 'agua',
  nota: 'nota', enchufe: 'enchufe', altavoz: 'altavoz', disco: 'disco duro',
};

const Prop: React.FC<{k: string; t: number}> = ({k, t}) => {
  switch (k) {
    case 'movil': return (<group rotation={[0, t * 0.8, 0]}><RoundedBox size={[0.8, 1.5, 0.12]} color="#1d1735" radius={0.12} /><mesh position={[0, 0, 0.1]}><planeGeometry args={[0.66, 1.3]} /><Em color="#3DDC97" i={0.5} /></mesh><mesh position={[0, 0.2, 0.11]}><planeGeometry args={[0.35, 0.18]} /><meshBasicMaterial color="#0e3a2a" /></mesh></group>);
    case 'linterna': return (<group rotation={[0, t * 0.8, -0.5]}><mesh><cylinderGeometry args={[0.2, 0.2, 1.1, 24]} />{mat('#4a5bd6', 0.35)}</mesh><mesh position={[0, 0.75, 0]}><cylinderGeometry args={[0.38, 0.2, 0.45, 24]} />{mat('#d9d4ee', 0.3)}</mesh><mesh position={[0, 1.0, 0]}><cylinderGeometry args={[0.3, 0.3, 0.05, 24]} /><Em color="#FFD83A" i={1} /></mesh></group>);
    case 'bombilla': return (<group rotation={[0, t * 0.6, 0]}><mesh position={[0, 0.2, 0]}><sphereGeometry args={[0.6, 28, 24]} /><Em color="#FFD83A" i={0.9} /></mesh><mesh position={[0, -0.55, 0]}><cylinderGeometry args={[0.28, 0.24, 0.45, 20]} />{mat('#b9b3d4', 0.3)}</mesh></group>);
    case 'pila': return <group rotation={[0, t * 0.7, 0.2]} scale={0.9}><Battery s={1} /></group>;
    case 'enchufe': return <group scale={0.9}><Plug s={1} /></group>;
    case 'roca': return <mesh rotation={[t * 0.3, t * 0.4, 0]}><dodecahedronGeometry args={[0.85, 0]} />{mat('#6f6891', 0.8)}</mesh>;
    case 'atomo': return (<group rotation={[0.9, t * 0.3, 0]}><mesh><sphereGeometry args={[0.28, 24, 20]} />{mat('#ff8a4c', 0.3)}</mesh>{[0.8, 1.2].map((r, i) => (<group key={i}><mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[r, 0.015, 8, 60]} />{mat('#9be7ff')}</mesh><mesh position={[Math.cos(t * (2 - i * 0.6) + i * 2) * r, 0, Math.sin(t * (2 - i * 0.6) + i * 2) * r]}><sphereGeometry args={[0.12, 16, 16]} />{mat(C.cyan, 0.2)}</mesh></group>))}</group>);
    case 'brujula': return (<group rotation={[0.9, 0, 0]}><mesh><cylinderGeometry args={[0.95, 0.95, 0.14, 40]} />{mat('#f3e8b4', 0.4)}</mesh><mesh position={[0, -0.1, 0]}><cylinderGeometry args={[1.02, 1.02, 0.08, 40]} />{mat(C.yellow, 0.3)}</mesh><group position={[0, 0.12, 0]} rotation={[0, t * 1.2, 0]}><mesh position={[0.4, 0, 0]} rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[0.14, 0.8, 14]} />{mat('#EF4B4B', 0.3)}</mesh><mesh position={[-0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}><coneGeometry args={[0.14, 0.8, 14]} />{mat('#3F6DFF', 0.3)}</mesh></group></group>);
    case 'tierra': return (<group rotation={[0.3, t * 0.5, 0.35]}><mesh><sphereGeometry args={[0.95, 40, 32]} />{mat('#2f6bd6', 0.5)}</mesh>{[[0.4, 0.5, 0.7], [-0.5, 0.1, 0.78], [0.1, -0.5, 0.8], [-0.2, 0.7, -0.6]].map((p, i) => <mesh key={i} position={p as [number, number, number]} scale={[1, 0.7, 0.5]}><sphereGeometry args={[0.32, 14, 12]} />{mat('#3DDC97', 0.6)}</mesh>)}<mesh position={[0, 0, 0]}><cylinderGeometry args={[0.02, 0.02, 2.6, 8]} />{mat('#ffffff')}</mesh></group>);
    case 'rio': return (<group rotation={[0.5, -0.3, 0]}><mesh><boxGeometry args={[2.2, 0.15, 1.2]} />{mat('#2f8bd6', 0.3)}</mesh>{[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[((t * 0.9 + i * 0.45) % 2.0) - 1.0, 0.12, (i % 3 - 1) * 0.3]}><sphereGeometry args={[0.08, 10, 10]} />{mat('#fff', 0.2)}</mesh>)}</group>);
    case 'pared': return <group rotation={[0, -0.5, 0]}><RoundedBox size={[1.6, 1.9, 0.5]} color="#6f66a8" radius={0.08} /></group>;
    case 'flecha': return <group scale={1.3} position={[0, -0.6, 0]} rotation={[0, 0, -0.3]}><Arrow color={C.orange} len={1.3} r={0.1} /></group>;
    case 'rayo': { const sh = new THREE.Shape(); sh.moveTo(0.1, 1); sh.lineTo(-0.5, -0.1); sh.lineTo(-0.05, -0.1); sh.lineTo(-0.2, -1); sh.lineTo(0.5, 0.2); sh.lineTo(0.05, 0.2); sh.closePath();
      return <mesh rotation={[0, t * 0.8, 0]}><extrudeGeometry args={[sh, {depth: 0.2, bevelEnabled: false}]} /><Em color="#FFD83A" i={0.7} /></mesh>; }
    case 'reloj': return (<group rotation={[0.2, t * 0.4, 0]}><mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.95, 0.95, 0.2, 40]} />{mat('#f3ecff', 0.4)}</mesh><mesh position={[0, 0, 0.12]} rotation={[0, 0, -t * 2]}><boxGeometry args={[0.07, 0.75, 0.05]} />{mat('#1d1735')}</mesh><mesh position={[0, 0, 0.13]} rotation={[0, 0, -t * 0.2]}><boxGeometry args={[0.1, 0.5, 0.05]} />{mat('#EF4B4B')}</mesh></group>);
    case 'rueda': return (<group rotation={[0, 0.4, t * 0.8]}><mesh><torusGeometry args={[0.9, 0.08, 12, 40]} />{mat('#b9b3d4', 0.4)}</mesh>{[0, 1, 2, 3, 4, 5].map((i) => <mesh key={i} position={[Math.cos(i * 1.047) * 0.9, Math.sin(i * 1.047) * 0.9, 0]} rotation={[0, 0, i * 1.047]}><boxGeometry args={[0.3, 0.2, 0.2]} />{mat(i % 2 ? '#3F6DFF' : '#EF4B4B', 0.3)}</mesh>)}</group>);
    case 'motor': return (<group rotation={[0, t * 0.5, 0]}><mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.6, 0.6, 1.3, 28]} />{mat('#6f66a8', 0.4)}</mesh><mesh position={[0.95, 0, 0]} rotation={[0, 0, Math.PI / 2 + t * 4]}><cylinderGeometry args={[0.07, 0.07, 0.6, 10]} />{mat('#d9d4ee', 0.2)}</mesh></group>);
    case 'libro': return <group rotation={[0.4, t * 0.5, 0]}><RoundedBox size={[1.5, 0.45, 1.1]} color="#9a4de6" radius={0.05} /><mesh><boxGeometry args={[1.42, 0.32, 1.14]} />{mat('#eadbb8', 0.8)}</mesh></group>;
    case 'iman': return <group rotation={[0.3, t * 0.5, 0.2]} scale={0.8}><BarMagnet /></group>;
    case 'bobina': return (<group rotation={[0, 0.3, 0]}><mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.25, 0.25, 1.7, 16]} />{mat('#8a84a8', 0.3)}</mesh>{[-0.7, -0.45, -0.2, 0.05, 0.3, 0.55, 0.8].map((x, i) => <mesh key={i} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.36, 0.05, 8, 24]} />{mat('#E8703A', 0.3)}</mesh>)}</group>);
    case 'clavo': return <group rotation={[0, t * 0.6, 0.6]}><mesh><cylinderGeometry args={[0.07, 0.04, 1.8, 10]} />{mat('#9aa0b5', 0.3)}</mesh><mesh position={[0, 0.9, 0]}><cylinderGeometry args={[0.2, 0.2, 0.08, 16]} />{mat('#9aa0b5', 0.3)}</mesh></group>;
    case 'llama': return (<group><mesh position={[0, 0.1, 0]} scale={[1, 1 + Math.sin(t * 9) * 0.08, 1]}><coneGeometry args={[0.6, 1.5, 20]} /><Em color="#FF6A2C" i={0.7} /></mesh><mesh position={[0, -0.1, 0.05]} scale={[1, 1 + Math.sin(t * 11) * 0.1, 1]}><coneGeometry args={[0.32, 0.9, 16]} /><Em color="#FFD83A" i={0.9} /></mesh></group>);
    case 'martillo': return <group rotation={[0, 0, Math.sin(t * 5) * 0.4 + 0.3]}><mesh position={[0, -0.3, 0]}><cylinderGeometry args={[0.07, 0.07, 1.4, 10]} />{mat('#a65a36', 0.5)}</mesh><mesh position={[0, 0.4, 0]} rotation={[0, 0, Math.PI / 2]}><boxGeometry args={[0.45, 0.45, 0.9]} />{mat('#8a84a8', 0.3)}</mesh></group>;
    case 'clip': return <group rotation={[0, t * 0.6, 0.3]}><RoundedBox size={[1.2, 0.35, 0.45]} color="#b9b3d4" radius={0.1} /></group>;
    case 'mano': return <group rotation={[0, 0, 0.5]}><mesh position={[0, -0.4, 0]}><capsuleGeometry args={[0.22, 0.9, 8, 14]} />{mat('#e8b48c', 0.5)}</mesh><mesh position={[0, 0.35, 0]}><sphereGeometry args={[0.3, 20, 16]} />{mat('#e8b48c', 0.5)}</mesh></group>;
    case 'caja': return <group rotation={[0.3, t * 0.6, 0]}><RoundedBox size={[1.2, 1.2, 1.2]} color="#9a4de6" radius={0.1} /></group>;
    case 'valle': { const y = Math.cos(t * 1.6) * 0.0; return (<group rotation={[0.25, 0, 0]}><mesh rotation={[0, 0, Math.PI]}><cylinderGeometry args={[1.2, 1.2, 1.0, 40, 1, true, Math.PI * 0.75, Math.PI * 0.5]} /><meshStandardMaterial color="#6a4cc2" side={2} roughness={0.5} /></mesh><mesh position={[Math.sin(t * 1.6) * 0.5 * Math.exp(-0.3 * 0), -0.78 + Math.abs(Math.sin(t * 1.6)) * 0.12 + y, 0]}><sphereGeometry args={[0.18, 20, 16]} />{mat(C.yellow, 0.3)}</mesh></group>); }
    case 'bacteria': return <group rotation={[0, 0, 0.4]}><mesh rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.35, 0.9, 8, 16]} />{mat('#3DDC97', 0.4)}</mesh>{[-0.3, 0, 0.3].map((x, i) => <mesh key={i} position={[x, 0, 0.36]}><boxGeometry args={[0.14, 0.14, 0.14]} />{mat('#EF4B4B', 0.3)}</mesh>)}<mesh position={[-1.25 + Math.sin(t * 8) * 0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.02, 0.02, 0.7, 6]} />{mat('#3DDC97')}</mesh></group>;
    case 'rana': return <group rotation={[0, t * 0.5, 0]} position={[0, Math.sin(t * 2) * 0.12, 0]}><mesh scale={[1.3, 0.8, 1]}><sphereGeometry args={[0.6, 24, 20]} />{mat('#4fcf4f', 0.5)}</mesh>{[-0.3, 0.3].map((x, i) => <mesh key={i} position={[x, 0.5, 0.2]}><sphereGeometry args={[0.18, 14, 12]} />{mat('#ffffff', 0.3)}</mesh>)}</group>;
    case 'agua': return <mesh position={[0, Math.sin(t * 2) * 0.08, 0]}><sphereGeometry args={[0.7, 28, 24]} /><meshStandardMaterial color="#2f8bd6" transparent opacity={0.8} roughness={0.1} /></mesh>;
    case 'nota': return <group rotation={[0, t * 0.5, 0]}><mesh><planeGeometry args={[1.2, 1.5]} />{mat('#e9d9b3', 0.8)}</mesh><mesh position={[0, 0.5, 0.05]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.1, 24]} />{mat('#E8703A', 0.3)}</mesh></group>;
    case 'altavoz': return <group rotation={[0, t * 0.6, 0]}><RoundedBox size={[1.2, 1.7, 0.7]} color="#2a1c52" radius={0.1} /><mesh position={[0, -0.3, 0.36]} rotation={[Math.PI / 2, 0, 0]} scale={1 + Math.sin(t * 12) * 0.04}><cylinderGeometry args={[0.38, 0.38, 0.08, 28]} />{mat('#b9b3d4', 0.3)}</mesh><mesh position={[0, 0.45, 0.36]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.18, 0.18, 0.08, 20]} />{mat('#b9b3d4', 0.3)}</mesh></group>;
    case 'disco': return <group rotation={[0.9, 0, t * 0.8]}><mesh><cylinderGeometry args={[0.95, 0.95, 0.08, 40]} />{mat('#2a2a3a', 0.2)}</mesh><mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.35, 0.35, 0.02, 30]} />{mat('#d9b44a', 0.2)}</mesh></group>;
    default: return null;
  }
};

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zñ0-9 ]/g, '');
export const cueFraction = (texto: string, cue: string) => {
  const words = norm(texto).split(/\s+/).filter(Boolean); const c = norm(cue);
  const i = words.findIndex((w) => w.startsWith(c));
  return Math.max(0.02, (i < 0 ? 0.3 : i) / words.length - 0.03);
};

const ZONES: Record<string, [number, number][]> = {
  campo: [[-4.5, -1.9], [-2.4, -1.9], [-0.3, -1.9], [-4.5, -0.1], [-2.4, -0.1], [-0.3, -0.1]],
  libro: [[-4.7, -0.4], [-2.9, -0.4], [-4.7, -2.3], [-2.9, -2.3]],
  clip: [[-4.7, -0.4], [-2.9, -0.4], [-4.7, -2.3], [-2.9, -2.3]],
};
export const ZONE_TYPES = Object.keys(ZONES);

export type Item = [string, string, string?, boolean?];
export const Cues: React.FC<{items: Item[]; texto: string; dur: number; tipo: string; barra?: boolean}> = ({items, texto, dur, tipo, barra}) => {
  const f = useCurrentFrame(); const t = f / 30;
  const slots = ZONES[tipo] ?? ZONES.campo;
  const place = items.map((it, i) => {
    const s = barra ? slots[Math.min(i, 2)] : slots[i % slots.length];
    return {it, s, from: Math.round(cueFraction(texto, it[0]) * dur)};
  });
  const px = (x: number) => 960 + (x / (9 * Math.tan(Math.PI / 9) * (16 / 9))) * 960;
  const py = (y: number) => 540 - (y / (9 * Math.tan(Math.PI / 9))) * 540;
  return (<>
    <Stage cam={[0, 0, 9]}>
      {place.map(({it, s, from}, i) => {
        if (f < from) return null;
        const k = sp(f, from);
        return (<group key={i} position={[s[0], s[1] + Math.sin(t * 1.5 + i) * 0.06, 0]} scale={k * 0.95}>
          <Prop k={it[1]} t={t} />
          {it[3] && <group position={[0, 0, 0.9]}>
            <mesh rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[2.3, 0.13, 0.08]} />{mat(C.orange, 0.3)}</mesh>
            <mesh rotation={[0, 0, -Math.PI / 4]}><boxGeometry args={[2.3, 0.13, 0.08]} />{mat(C.orange, 0.3)}</mesh>
          </group>}
        </group>);
      })}
    </Stage>
    {place.map(({it, s, from}, i) => {
      const o = interpolate(f, [from + 4, from + 16], [0, 1], clamp);
      return <div key={i} style={{position: 'absolute', left: px(s[0]) - 200, width: 400, textAlign: 'center', top: py(s[1]) + 105, opacity: o, color: '#fff', fontFamily: FONT, fontWeight: 600, fontSize: 32}}>{it[2] ?? NAMES[it[1]] ?? ''}</div>;
    })}
  </>);
};
