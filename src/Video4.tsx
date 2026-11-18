import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import tl from '../data/timeline_v4.json';
import spec from '../data/guion_v4.json';
import {Backdrop, C} from './ui';
import {Fade} from './Prueba';
import {BODY, Overlay, Zoom, Spec} from './Completo';
import {Cues} from './Props';
import {Foton, Habitacion} from './Fotones';
import {TierraSol, Minkowski, Barras, Maxwell} from './Luz';
import {Pendulo, BigBang, Cero} from './Energia';
import {Reloj, Cuatro, Gamma, Vidrio, Expansion, Muon, Gps, Cta, Cifra, Lhc} from './Luz2';
import {Filamento, Niveles, Espectro, CalorPared, Tierra, Decaimiento, ColorSup, Banda, Reparto, Balance, Cuerpo, Ojo} from './Fotones2';

const FR = tl.frames as number[];
export const TOTAL_V4 = FR.reduce((a, b) => a + b, 0);
const B2: Record<string, React.FC<any>> = {...BODY, habitacion: Habitacion, foton: Foton, tierrasol: TierraSol, minkowski: Minkowski, barras: Barras, maxwell: Maxwell, pendulo: Pendulo, bigbang: BigBang, cero: Cero, reloj: Reloj, cuatro: Cuatro, gamma: Gamma, vidrio: Vidrio, expansion: Expansion, muon: Muon, gps: Gps, cifra: Cifra, lhc: Lhc, filamento: Filamento, niveles: Niveles, espectro: Espectro, calorpared: CalorPared, tierra: Tierra, decaimiento: Decaimiento, color: ColorSup, banda: Banda, reparto: Reparto, balance: Balance, cuerpo: Cuerpo, ojo: Ojo};

export const Video4: React.FC = () => {
  const sc = spec as unknown as (Spec & {texto: string})[];
  let acc = 0;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Backdrop />
      {sc.map((s, i) => {
        const from = acc; acc += FR[i];
        const B = B2[s.tipo];
        return <Sequence key={i} from={from} durationInFrames={FR[i]} layout="none">
          <Fade dur={FR[i]}><Zoom dur={FR[i]} i={i}><B s={s} dur={FR[i]} />{s.items && <Cues items={s.items} texto={s.texto} dur={FR[i]} tipo={s.tipo} barra={s.barra} />}</Zoom><Overlay s={s} dur={FR[i]} />{(s as any).cta && <Cta v={(s as any).cta} dur={FR[i]} />}</Fade>
        </Sequence>;
      })}
    </AbsoluteFill>
  );
};
