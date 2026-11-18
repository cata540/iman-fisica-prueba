import React, {useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {useVideoConfig} from 'remotion';

export const Stage: React.FC<{children: React.ReactNode; cam?: [number, number, number]; fov?: number}> = ({children, cam = [0, 0, 9], fov = 40}) => {
  const {width, height} = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} camera={{position: cam, fov}} style={{position: 'absolute', inset: 0}} gl={{alpha: true, antialias: true}}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 7]} intensity={2.2} />
      <pointLight position={[-6, 2, 5]} intensity={40} color="#9a7bff" />
      {children}
    </ThreeCanvas>
  );
};

export const mat = (color: string, rough = 0.45) => <meshStandardMaterial color={color} roughness={rough} metalness={0.05} />;

export const Arrow: React.FC<{color: string; len?: number; pos?: [number, number, number]; dir?: 1 | -1; r?: number}> = ({color, len = 1, pos = [0, 0, 0], dir = 1, r = 0.06}) => (
  <group position={pos} rotation={[0, 0, dir === 1 ? 0 : Math.PI]}>
    <mesh position={[0, len / 2 - 0.1, 0]}><cylinderGeometry args={[r, r, len - 0.2, 16]} />{mat(color, 0.3)}</mesh>
    <mesh position={[0, len - 0.1, 0]}><coneGeometry args={[r * 2.6, 0.32, 20]} />{mat(color, 0.3)}</mesh>
  </group>
);

export const RoundedBox: React.FC<{size: [number, number, number]; color: string; pos?: [number, number, number]; rot?: [number, number, number]; radius?: number}> = ({size, color, pos, rot, radius = 0.06}) => {
  const geo = useMemo(() => {
    const [w, h, d] = size;
    const r = Math.min(radius, w / 2, h / 2);
    const sh = new THREE.Shape();
    sh.moveTo(-w / 2 + r, -h / 2); sh.lineTo(w / 2 - r, -h / 2); sh.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    sh.lineTo(w / 2, h / 2 - r); sh.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    sh.lineTo(-w / 2 + r, h / 2); sh.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    sh.lineTo(-w / 2, -h / 2 + r); sh.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    const g = new THREE.ExtrudeGeometry(sh, {depth: d - r, bevelEnabled: true, bevelThickness: r / 2, bevelSize: r / 2, bevelSegments: 4});
    g.translate(0, 0, -(d - r) / 2);
    return g;
  }, [size[0], size[1], size[2], radius]);
  return <mesh geometry={geo} position={pos} rotation={rot}>{mat(color)}</mesh>;
};

// Líneas de campo dipolar (lazos cian)
export const FieldLines: React.FC<{scale?: number; time: number; color?: string}> = ({scale = 1, time, color = '#2FD0F0'}) => {
  const loops = useMemo(() => {
    const out: THREE.BufferGeometry[] = [];
    const rs = [0.9, 1.35, 1.9, 2.5];
    const phis = [0, 0.8, 1.6, 2.4];
    for (const phi of phis) for (const r0 of rs) {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 90; i++) {
        const th = 0.12 + (i / 90) * (Math.PI - 0.24);
        const r = r0 * Math.sin(th) ** 2;
        pts.push(new THREE.Vector3(r * Math.cos(th) * 1.0 * 1.35, r * Math.sin(th) * Math.cos(phi), r * Math.sin(th) * Math.sin(phi)));
      }
      out.push(new THREE.BufferGeometry().setFromPoints(pts));
    }
    return out;
  }, []);
  return (
    <group scale={scale} rotation={[0, time * 0.25, 0]}>
      {loops.map((g, i) => (
        <line key={i}>
          <primitive object={g} attach="geometry" />
          <lineBasicMaterial color={color} transparent opacity={0.85} />
        </line>
      ))}
    </group>
  );
};

export const BarMagnet: React.FC<{pos?: [number, number, number]; rot?: [number, number, number]; scale?: number}> = ({pos, rot, scale = 1}) => (
  <group position={pos} rotation={rot} scale={scale}>
    <RoundedBox size={[1.3, 0.55, 0.55]} color="#3F6DFF" pos={[-0.65, 0, 0]} />
    <RoundedBox size={[1.3, 0.55, 0.55]} color="#EF4B4B" pos={[0.65, 0, 0]} />
  </group>
);
