import React from 'react';
import {Composition} from 'remotion';
import {Prueba} from './Prueba';
import tl from '../data/timeline.json';

export const Root: React.FC = () => (
  <Composition id="Prueba" component={Prueba} durationInFrames={tl.frames.reduce((a: number, b: number) => a + b, 0)}
    fps={30} width={1920} height={1080} />
);
