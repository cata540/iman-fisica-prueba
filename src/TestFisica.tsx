import React, {Suspense} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {CuboidCollider, Physics, RigidBody} from '@react-three/rapier';
import {Backdrop, C} from './ui';
import {Fisica} from './Fisica';

const Cuerpos: React.FC = () => (<>
  {[[-2.5, 4, '#FFD83A'], [0, 6, '#2FD0F0'], [2.5, 8, '#FF4FD8']].map(([x, y, c], i) => (
    <RigidBody key={i} colliders="ball" restitution={0.75} position={[x as number, y as number, 0]}>
      <mesh><sphereGeometry args={[0.6, 32, 24]} /><meshStandardMaterial color={c as string} roughness={0.3} /></mesh>
    </RigidBody>
  ))}
  <RigidBody type="fixed"><CuboidCollider args={[8, 0.25, 4]} position={[0, -2.25, 0]} /></RigidBody>
  <mesh position={[0, -2.25, 0]}><boxGeometry args={[16, 0.5, 8]} /><meshStandardMaterial color="#3a2466" roughness={0.6} /></mesh>
</>);

// modo a: <Physics paused> sin más · b: con Suspense · c: helper Fisica determinista
export const TestFisica: React.FC<{modo: 'a' | 'b' | 'c'}> = ({modo}) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Backdrop />
      <ThreeCanvas width={width} height={height} camera={{position: [0, 1.5, 11], fov: 40}}>
        <ambientLight intensity={0.9} /><directionalLight position={[4, 6, 7]} intensity={2.2} />
        <mesh position={[-5, 3.2, 0]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#3DDC97" /></mesh>
        {modo === 'a' && <Physics paused><Cuerpos /></Physics>}
        {modo === 'b' && <Suspense fallback={null}><Physics paused><Cuerpos /></Physics></Suspense>}
        {modo === 'c' && <Fisica frame={frame} fps={fps}><Cuerpos /></Fisica>}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
