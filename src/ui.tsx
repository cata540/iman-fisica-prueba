import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Poppins';

const {fontFamily} = loadFont('normal', {weights: ['500', '600', '700'], subsets: ['latin', 'latin-ext']});
export const FONT = fontFamily;
export const C = {bg: '#140a28', yellow: '#FFD83A', green: '#3DDC97', cyan: '#2FD0F0', orange: '#FF8A4C', white: '#FFFFFF', ink: '#1a0f33'};

export const Backdrop: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 35% 30%, #241046 0%, ${C.bg} 62%, #0e0720 100%)`}} />
);

// Pastilla redondeada arriba a la izquierda
export const Pill: React.FC<{text: string; from: number; to?: number; color?: 'yellow' | 'green'; top?: number; left?: number}> = ({text, from, to, color = 'yellow', top = 56, left = 64}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - from, fps, config: {damping: 14, stiffness: 140}});
  const out = to === undefined ? 1 : interpolate(f, [to - 8, to], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (f < from || out <= 0) return null;
  return (
    <div style={{position: 'absolute', top, left, transform: `scale(${s}) translateY(${(1 - s) * -14}px)`, transformOrigin: 'left top', opacity: out * Math.min(1, s * 2),
      background: color === 'yellow' ? C.yellow : C.green, color: C.ink, fontFamily: FONT, fontWeight: 600, fontSize: 40, padding: '10px 34px', borderRadius: 999,
      boxShadow: '0 6px 24px rgba(0,0,0,.35)'}}>{text}</div>
  );
};

// Título corto en blanco, arriba izquierda
export const Title: React.FC<{lines: string[]; from: number; top?: number}> = ({lines, from, top = 150}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [from, from + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <div style={{position: 'absolute', top, left: 70, opacity: o, transform: `translateY(${(1 - o) * 18}px)`, color: '#fff', fontFamily: FONT, fontWeight: 700, fontSize: 64, lineHeight: 1.15}}>
    {lines.map((l, i) => <div key={i}>{l}</div>)}</div>;
};

export const Label: React.FC<{text: string; x: number; y: number; from: number; color?: string; size?: number}> = ({text, x, y, from, color = '#fff', size = 40}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [from, from + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <div style={{position: 'absolute', left: x, top: y, opacity: o, color, fontFamily: FONT, fontWeight: 600, fontSize: size, whiteSpace: 'nowrap'}}>{text}</div>;
};
