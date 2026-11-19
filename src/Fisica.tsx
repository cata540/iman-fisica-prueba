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
import React, {useLayoutEffect} from 'react';
import {continueRender, delayRender} from 'remotion';
import {useThree} from '@react-three/fiber';
import {Physics, useRapier} from '@react-three/rapier';

// Se monta dentro de <Physics>, después de los cuerpos. El delayRender se registra aquí (en un efecto, no en el
// render) para no dejar manejadores huérfanos si React descarta un render mientras Rapier carga.
const Avanzar: React.FC<{pasos: number; dt: number}> = ({pasos, dt}) => {
  const {step} = useRapier();
  const invalidate = useThree((s) => s.invalidate);
  useLayoutEffect(() => {
    const handle = delayRender(`rapier: simulando ${pasos} pasos`);
    for (let i = 0; i < pasos; i++) step(dt);
    invalidate();
    // espera a que WebGL pinte el estado ya simulado antes de dejar que Remotion capture el fotograma
    requestAnimationFrame(() => requestAnimationFrame(() => { invalidate(); requestAnimationFrame(() => continueRender(handle)); }));
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
