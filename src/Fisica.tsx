// Física 3D determinista para Remotion con @react-three/rapier.
//
// POR QUÉ ASÍ (aprendido probando en Actions):
//  1. Remotion puede renderizar los fotogramas en cualquier orden y en pestañas distintas, así que el mundo físico
//     NO puede avanzar con el reloj: se reconstruye desde cero en cada fotograma y se avanza `frame` pasos fijos de
//     1/fps. El resultado es una función pura del fotograma.
//  2. En render, <ThreeCanvas> usa frameloop="never" y pinta UNA vez por fotograma (advance) en un efecto que corre
//     ANTES que los de sus hijos. Por eso este helper reserva el fotograma (delayRender), avanza la física y vuelve a
//     llamar a advance() para que WebGL pinte el estado ya simulado.
//  3. NO envolver en <Suspense>: el Canvas ya gestiona la carga del WASM de Rapier y Remotion espera por él; un
//     Suspense propio hace que el contenido no llegue a pintarse.
//  4. <Avanzar/> debe ser el ÚLTIMO hijo de <Physics>: los cuerpos de Rapier se crean en useEffect, y su efecto
//     tiene que correr después del de todos los RigidBody/colliders hermanos.
//
// Uso (dentro de un <ThreeCanvas>):
//   <Fisica frame={useCurrentFrame()} fps={30} gravity={[0, -9.81, 0]}>
//     <RigidBody colliders="ball" restitution={0.8} position={[0, 4, 0]}><mesh>…</mesh></RigidBody>
//     <RigidBody type="fixed"><CuboidCollider args={[10, 0.2, 10]} position={[0, -2, 0]} /></RigidBody>
//   </Fisica>
// Los objetos deben ser iguales en cada fotograma (mismas posiciones iniciales). Coste: O(frame) pasos de Rapier
// por fotograma, trivial con pocos cuerpos. En escenas largas usa el fotograma local de la <Sequence>.
import React, {useEffect, useLayoutEffect, useRef} from 'react';
import {continueRender, delayRender} from 'remotion';
import {useThree} from '@react-three/fiber';
import {Physics, useRapier} from '@react-three/rapier';

const Avanzar: React.FC<{pasos: number; dt: number}> = ({pasos, dt}) => {
  const {step} = useRapier();
  const advance = useThree((s) => s.advance);
  const handle = useRef<number | null>(null);
  // efecto de layout (síncrono con el commit): reserva el fotograma para que Remotion no lo capture todavía
  useLayoutEffect(() => {
    handle.current = delayRender(`rapier: simulando ${pasos} pasos`);
  }, []);
  // efecto pasivo: tras los efectos de los cuerpos hermanos (ya creados en Rapier)
  useEffect(() => {
    for (let i = 0; i < pasos; i++) step(dt);
    advance(performance.now()); // repinta con las posiciones ya simuladas (frameloop "never" en render)
    requestAnimationFrame(() => { if (handle.current !== null) continueRender(handle.current); });
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
