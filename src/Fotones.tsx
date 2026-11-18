import React, {useMemo} from 'react';
import * as THREE from 'three';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, FONT} from './ui';
import {RoundedBox, Stage, mat} from './three';
import {clamp, sp} from './Prueba';

// ---------- paquete de onda de un fotón (E cian, B magenta) ----------
export const WavePacket: React.FC<{t: number; len?: number; amp?: number; k?: number; width?: number}> = ({t, len = 5, amp = 0.55, k = 7, width = 1.1}) => {
  const geos = useMemo(() => [0, 1].map(() => new THREE.BufferGeometry()), []);
  const mk = (axis: 0 | 1) => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 140; i++) {
      const x = -len / 2 + (i / 140) * len;
      const env = Math.exp(-(x * x) / (2 * width * width));
      const y = amp * env * Math.sin(k * x - t * 7);
      pts.push(axis === 0 ? new THREE.Vector3(x, y, 0) : new THREE.Vector3(x, 0, y));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 140, 0.028, 6, false);
  };
  const g0 = mk(0), g1 = mk(1);
  return (<group>
    <mesh geometry={g0}><meshBasicMaterial color="#2FD0F0" /></mesh>
    <mesh geometry={g1}><meshBasicMaterial color="#FF4FD8" /></mesh>
    <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012, 0.012, len, 6]} />{mat('#ffffff', 0.3)}</mesh>
  </group>);
};

// ---------- habitación con bombilla y fotones ----------
const LO = {x0: -5.2, x1: 5.2, y0: -2.4, y1: 3.2, z0: -3.2, z1: 0.0};
const ORI = new THREE.Vector3(0, 2.2, -1.6);
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const V = 5.2; // unidades/s (estilizado)

type Ev = {t0: number; dir: THREE.Vector3; hit: THREE.Vector3; tHit: number; col: string};
const EVENTS: Ev[] = (() => {
  const out: Ev[] = [];
  for (let j = 0; j < 420; j++) {
    const th = Math.acos(1 - 2 * rnd(j * 3 + 1)); const ph = rnd(j * 3 + 2) * Math.PI * 2;
    let d = new THREE.Vector3(Math.sin(th) * Math.cos(ph), Math.cos(th) * 0.8 - 0.25, -Math.abs(Math.sin(th) * Math.sin(ph)) - 0.15).normalize();
    // intersección con las paredes de la habitación (caja)
    let tMin = 1e9;
    const chk = (p: number, o: number, dd: number) => (dd > 1e-6 ? (p - o) / dd : dd < -1e-6 ? (p - o) / dd : 1e9);
    for (const t of [chk(LO.x1, ORI.x, d.x), chk(LO.x0, ORI.x, d.x), chk(LO.y1, ORI.y, d.y), chk(LO.y0, ORI.y, d.y), chk(LO.z0, ORI.z, d.z)]) if (t > 0 && t < tMin) tMin = t;
    out.push({t0: j * 0.02, dir: d, hit: ORI.clone().add(d.clone().multiplyScalar(tMin)), tHit: tMin / V, col: j % 2 ? '#2FD0F0' : '#FF4FD8'});
  }
  return out;
})();

export const Habitacion: React.FC<{s: any; dur: number}> = ({s, dur}) => {
  const f = useCurrentFrame(); const t = f / 30;
  const choque = s.modo === 'choque';
  const P = 3.4;                                   // modo choque: se repite el apagado en bucle
  const tt = choque ? t % P : t;
  const tOn = choque ? 0 : (s.enciende ?? 0.0) * dur / 30;
  const tOff = choque ? 0.7 : (s.apaga ?? 0.15) * dur / 30;
  const on = tt >= tOn && tt < tOff;
  const evs = EVENTS.filter((e) => e.t0 + tOn <= tOff);
  const hitsSoFar = evs.filter((e) => e.t0 + tOn + e.tHit < tt).length;
  const warm = Math.min(0.07, hitsSoFar / 900);
  const ns = Math.max(0, Math.min(20, ((tt - tOff) / 1.5) * 20));
  const active = evs.filter((e) => tt >= e.t0 + tOn && tt < e.t0 + tOn + e.tHit + 0.28);
  return (<>
    <Stage cam={[0, 0.6, 10.5]} fov={42}>
      <group rotation={[0.04, Math.sin(t * 0.35) * 0.05, 0]}>
        {/* suelo y paredes */}
        <RoundedBox size={[10.8, 0.25, 3.6]} color="#2a1856" pos={[0, LO.y0 - 0.12, -1.6]} radius={0.05} />
        <mesh position={[0, 0.4, LO.z0 - 0.06]}><boxGeometry args={[10.6, 5.7, 0.12]} /><meshStandardMaterial color="#241448" emissive="#FF8A4C" emissiveIntensity={warm} roughness={0.8} /></mesh>
        <mesh position={[LO.x0 - 0.06, 0.4, -1.6]}><boxGeometry args={[0.12, 5.7, 3.4]} /><meshStandardMaterial color="#1f1040" emissive="#FF8A4C" emissiveIntensity={warm * 0.8} roughness={0.8} /></mesh>
        <mesh position={[LO.x1 + 0.06, 0.4, -1.6]}><boxGeometry args={[0.12, 5.7, 3.4]} /><meshStandardMaterial color="#1f1040" emissive="#FF8A4C" emissiveIntensity={warm * 0.8} roughness={0.8} /></mesh>
        {/* ventana */}
        <mesh position={[2.6, 1.2, LO.z0 + 0.01]}><planeGeometry args={[2.2, 1.7]} /><meshStandardMaterial color="#0e0a30" emissive="#1a2a6a" emissiveIntensity={0.5} /></mesh>
        <mesh position={[2.6, 1.2, LO.z0 + 0.03]}><boxGeometry args={[0.07, 1.7, 0.03]} />{mat('#b9b3d4')}</mesh>
        <mesh position={[2.6, 1.2, LO.z0 + 0.03]}><boxGeometry args={[2.2, 0.07, 0.03]} />{mat('#b9b3d4')}</mesh>
        {/* interruptor */}
        <group position={[-4.8, 0, LO.z0 + 0.1]}>
          <RoundedBox size={[0.5, 0.8, 0.1]} color="#d9d4ee" radius={0.05} />
          <mesh position={[0, on ? 0.12 : -0.12, 0.1]}><boxGeometry args={[0.18, 0.28, 0.1]} />{mat(on ? C.green : '#6f6891', 0.3)}</mesh>
        </group>
        {/* cable y bombilla */}
        <mesh position={[ORI.x, 3.0, ORI.z]}><cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />{mat('#8a84a8')}</mesh>
        <mesh position={[ORI.x, ORI.y - 0.02, ORI.z]}><sphereGeometry args={[0.32, 28, 22]} /><meshStandardMaterial color={on ? '#FFE680' : '#5a4a8a'} emissive="#FFD83A" emissiveIntensity={on ? 1.4 : 0.03} /></mesh>
        <mesh position={[ORI.x, ORI.y + 0.36, ORI.z]}><cylinderGeometry args={[0.15, 0.13, 0.22, 16]} />{mat('#b9b3d4', 0.3)}</mesh>
        {on && <pointLight position={[ORI.x, ORI.y, ORI.z + 0.5]} intensity={14} color="#FFE9A0" />}
        {/* fotones */}
        {active.map((e, i) => {
          const age = tt - e.t0 - tOn;
          const alive = age < e.tHit;
          if (alive) {
            const p = ORI.clone().add(e.dir.clone().multiplyScalar(V * age));
            const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), e.dir);
            return (<group key={i} position={p} quaternion={q}>
              <mesh scale={[3.2, 1, 1]}><sphereGeometry args={[0.1, 10, 8]} /><meshBasicMaterial color={e.col} /></mesh>
              <mesh scale={[1, 1, 1]}><sphereGeometry args={[0.22, 10, 8]} /><meshBasicMaterial color={e.col} transparent opacity={0.22} /></mesh>
            </group>);
          }
          const k = (age - e.tHit) / 0.28;
          return (<group key={i} position={e.hit}>
            <mesh scale={0.1 + k * 0.3}><sphereGeometry args={[0.5, 12, 10]} /><meshBasicMaterial color="#FF9A4C" transparent opacity={0.7 * (1 - k)} /></mesh>
          </group>);
        })}
      </group>
    </Stage>
    {choque && (() => { const after = Math.max(0, tt - tOff); const ph = Math.min(1, after / 1.4); return (<div style={{position: 'absolute', left: 90, top: 760, fontFamily: FONT, color: '#fff', fontWeight: 600, fontSize: 34}}>
      {[['Fotones en vuelo', 1 - ph, C.cyan], ['Calor en las paredes', ph, C.orange], ['Energía total', 1, C.yellow]].map(([n, v, c], i) => (
        <div key={i} style={{marginBottom: 18}}>{n as string}<div style={{marginTop: 6, width: 440, height: 16, borderRadius: 8, background: 'rgba(255,255,255,.14)'}}><div style={{width: `${(v as number) * 100}%`, height: '100%', borderRadius: 8, background: c as string}} /></div></div>))}
    </div>); })()}
    <div style={{position: 'absolute', right: 70, top: 62, fontFamily: FONT, fontWeight: 600, fontSize: 34, color: on ? C.green : '#b9b0d6', opacity: interpolate(f, [0, 8], [0, 1], clamp)}}>
      {tt < tOn ? 'LUZ: OFF' : on ? 'LUZ: ON' : `LUZ: OFF · t = ${ns.toFixed(0)} ns`}</div>
  </>);
};

export const Foton: React.FC<{s: any; dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const t = f / 30;
  return (
    <Stage cam={[0, 0, 9]}>
      <group position={[2.3, 0.4, 0]} rotation={[0.35, -0.5 + Math.sin(t * 0.4) * 0.15, 0.1]} scale={sp(f, 0) * 1.05}>
        <WavePacket t={t} len={5.4} amp={0.85} k={5} width={1.3} />
      </group>
    </Stage>
  );
};
