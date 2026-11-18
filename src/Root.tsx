import React from 'react';
import {Composition} from 'remotion';
import {Prueba} from './Prueba';
import {Completo, TOTAL_FRAMES} from './Completo';
import {Video2, TOTAL_V2} from './Video2';
import {Video3, TOTAL_V3} from './Video3';
import {Video4, TOTAL_V4} from './Video4';
import tl from '../data/timeline.json';

export const Root: React.FC = () => (
  <>
  <Composition id="Video4" component={Video4} durationInFrames={TOTAL_V4} fps={30} width={1920} height={1080} />
  <Composition id="Video3" component={Video3} durationInFrames={TOTAL_V3} fps={30} width={1920} height={1080} />
  <Composition id="Video2" component={Video2} durationInFrames={TOTAL_V2} fps={30} width={1920} height={1080} />
  <Composition id="Completo" component={Completo} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
  <Composition id="Prueba" component={Prueba} durationInFrames={tl.frames.reduce((a: number, b: number) => a + b, 0)}
    fps={30} width={1920} height={1080} />
  </>
);
