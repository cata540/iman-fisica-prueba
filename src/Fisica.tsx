// ⚠ EXPERIMENTAL / NO VERIFICADO (2026-11-19): en las pruebas de Actions (workflow test_rapier) los cuerpos NO caen en render
// (las bolas quedan en su posición inicial aunque se llame a world.step y a advance()). Contiene sondas de depuración.
// No usar en un vídeo sin resolverlo antes. Ver las notas de abajo sobre frameloop="never" de <ThreeCanvas>.
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

const Avanzar: React.FC<{pasos: number; dt: number; gravity: [number, number, number]}> = ({pasos, dt, gravity}) => {
  const {step, world} = useRapier();
  const d1 = useRef<any>(null); const d2 = useRef<any>(null); const d3 = useRef<any>(null);
  const advance = useThree((s) => s.advance);
  const handle = useRef<number | null>(null);
  // efecto de layout (síncrono con el commit): reserva el fotograma para que Remotion no lo capture todavía
  useLayoutEffect(() => {
    handle.current = delayRender(`rapier: simulando ${pasos} pasos`);
  }, []);
  // efecto pasivo: tras los efectos de los cuerpos hermanos (ya creados en Rapier)
  useEffect(() => {
    // los efectos de <Physics> (padre) corren después que los de este hijo: fijamos aquí la gravedad y el paso
    world.gravity = {x: gravity[0], y: gravity[1], z: gravity[2]};
    world.timestep = dt;
    const n0 = world.bodies.len();
    for (let i = 0; i < pasos; i++) world.step();   // avance fijo y exacto del mundo de Rapier
    step(0);                                         // sin avanzar: solo sincroniza las mallas con los cuerpos
    let y0 = -99; let nd = 0; let gy = 0; world.forEachRigidBody((b: any) => { if (b.isDynamic()) { nd++; if (y0 === -99) y0 = b.translation().y; } }); gy = world.gravity.y;
    if (d1.current) { d1.current.material.color.set('#00ff00'); d1.current.scale.setScalar(0.3 + n0 * 0.25); }
    if (d2.current) { d2.current.position.y = y0 === -99 ? 3.5 : Math.max(-3, Math.min(3, y0)); d2.current.material.color.set(Math.abs(gy) > 5 ? '#ffffff' : '#ff0000'); d2.current.scale.setScalar(nd === 3 ? 1 : 0.3); }
    if (d3.current) { d3.current.scale.setScalar(0.2 + pasos * 0.01); }
    advance(performance.now()); // repinta con las posiciones ya simuladas (frameloop "never" en render)
    requestAnimationFrame(() => { if (handle.current !== null) continueRender(handle.current); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (<>
    <mesh ref={d1} position={[5, 3.2, 0.5]} scale={0.3}><boxGeometry args={[1, 1, 1]} /><meshBasicMaterial color="#ff0000" /></mesh>
    <mesh ref={d2} position={[6, 1, 0.5]}><boxGeometry args={[0.5, 0.5, 0.5]} /><meshBasicMaterial color="#ff00ff" /></mesh>
    <mesh ref={d3} position={[5, 2, 0.5]} scale={0.2}><boxGeometry args={[1, 1, 1]} /><meshBasicMaterial color="#ffff00" /></mesh>
  </>);
};

export const Fisica: React.FC<{frame: number; fps?: number; gravity?: [number, number, number]; children: React.ReactNode}> = ({frame, fps = 30, gravity = [0, -9.81, 0], children}) => {
  const dt = 1 / fps;
  return (
    <Physics key={frame} paused timeStep={dt} interpolate={false} gravity={gravity}>
      {children}
      <Avanzar pasos={frame} dt={dt} gravity={gravity} />
    </Physics>
  );
};
