import React from 'react';
import {Composition} from 'remotion';
import {Prueba} from './Prueba';
import {Completo, TOTAL_FRAMES} from './Completo';
import tl from '../data/timeline.json';

export const Root: React.FC = () => (
  <>
  <Composition id="Completo" component={Completo} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
  <Composition id="Prueba" component={Prueba} durationInFrames={tl.frames.reduce((a: number, b: number) => a + b, 0)}
    fps={30} width={1920} height={1080} />
  </>
);
