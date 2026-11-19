// Física 3D determinista para Remotion con @react-three/rapier.
// Remotion puede renderizar los fotogramas en cualquier orden y en pestañas distintas, así que el mundo físico
// NO puede avanzar con el reloj: aquí se reconstruye desde cero en cada fotograma y se avanza `frame` pasos fijos
// de 1/fps. El resultado es una función pura del fotograma (mismo render siempre, en cualquier orden).
//
// Uso (dentro de un <ThreeCanvas>; NO envolver en <Suspense>: el Canvas ya gestiona la carga del WASM de Rapier
// y Remotion espera por él; un Suspense propio hace que el contenido no llegue a pintarse):
//   <Fisica frame={useCurrentFrame()} fps={30} gravity={[0, -9.81, 0]}>
//     <RigidBody colliders="ball" restitution={0.8} position={[0, 4, 0]}><mesh>…</mesh></RigidBody>
//     <RigidBody type="fixed"><CuboidCollider args={[10, 0.2, 10]} position={[0, -2, 0]} /></RigidBody>
//   </Fisica>
// Los objetos deben ser iguales en cada fotograma (mismas posiciones iniciales). El coste es O(frame) pasos de
// Rapier por fotograma: trivial con pocos cuerpos. Para escenas largas usa el fotograma local de la <Sequence>.
import React, {useEffect, useLayoutEffect, useRef} from 'react';
import {continueRender, delayRender} from 'remotion';
import {useThree} from '@react-three/fiber';
import {Physics, useRapier} from '@react-three/rapier';

// Se monta dentro de <Physics>, DESPUÉS de los cuerpos (debe ser el último hijo).
const Avanzar: React.FC<{pasos: number; dt: number}> = ({pasos, dt}) => {
  const {step, world} = useRapier();
  const invalidate = useThree((s) => s.invalidate);
  const handle = useRef<number | null>(null);
  // 1) efecto de layout (síncrono con el commit): reserva el fotograma para que Remotion no capture antes de tiempo
  useLayoutEffect(() => {
    handle.current = delayRender(`rapier: simulando ${pasos} pasos`);
  }, []);
  // 2) efecto pasivo: se ejecuta DESPUÉS de los efectos de los RigidBody/colliders hermanos (que crean los cuerpos
  //    de Rapier en useEffect). Si se avanzara antes, el mundo estaría vacío y la simulación no moveria nada.
  useEffect(() => {
    const antes = world.bodies.len();
    for (let i = 0; i < pasos; i++) step(dt);
    const ys: number[] = []; world.forEachRigidBody((b: any) => ys.push(Number(b.translation().y.toFixed(2))));
    console.warn('FISICA_DEBUG pasos=' + pasos + ' cuerpos=' + antes + ' ys=' + JSON.stringify(ys));
    invalidate();
    // espera a que WebGL pinte el estado ya simulado antes de liberar el fotograma
    requestAnimationFrame(() => requestAnimationFrame(() => { invalidate(); requestAnimationFrame(() => { if (handle.current !== null) continueRender(handle.current); }); }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

export const Fisica: React.FC<{frame: number; fps?: number; gravity?: [number, number, number]; children: React.ReactNode}> = ({frame, fps = 30, gravity = [0, -9.81, 0], children}) => {
  const dt = 1 / fps;
  return (
    <Physics key={frame} paused timeStep={dt} interpolate={false} gravity={gravity}>
      {children}
      <Avanzar pasos={frame} dt={dt} />
    </Physics>
  );
};
