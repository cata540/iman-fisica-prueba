import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import tl from '../data/timeline_v2.json';
import spec from '../data/guion_v2.json';
import {Backdrop, C} from './ui';
import {Fade} from './Prueba';
import {BODY, Overlay, Zoom, Spec} from './Completo';
import {Cues} from './Props';
import {Foton, Habitacion} from './Fotones';

const FR = tl.frames as number[];
export const TOTAL_V2 = FR.reduce((a, b) => a + b, 0);
const B2: Record<string, React.FC<any>> = {...BODY, habitacion: Habitacion, foton: Foton};

export const Video2: React.FC = () => {
  const sc = spec as unknown as (Spec & {texto: string})[];
  let acc = 0;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Backdrop />
      {sc.map((s, i) => {
        const from = acc; acc += FR[i];
        const B = B2[s.tipo];
        return <Sequence key={i} from={from} durationInFrames={FR[i]} layout="none">
          <Fade dur={FR[i]}><Zoom dur={FR[i]} i={i}><B s={s} dur={FR[i]} />{s.items && <Cues items={s.items} texto={s.texto} dur={FR[i]} tipo={s.tipo} barra={s.barra} />}</Zoom><Overlay s={s} dur={FR[i]} /></Fade>
        </Sequence>;
      })}
    </AbsoluteFill>
  );
};
