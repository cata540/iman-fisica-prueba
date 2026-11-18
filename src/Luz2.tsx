import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from './ui';
import {RoundedBox, Stage, mat} from './three';
import {rnd, sp} from './Prueba';
import {CYAN, Dot, MAG, Svg, Txt, seg} from './Fotones2';
import {WavePacket} from './Fotones';

const tri = (x: number) => { const p = x - Math.floor(x); return p < 0.5 ? p * 2 : 2 - p * 2; };

// ---------- reloj de luz (dilatación del tiempo) ----------
export const Reloj: React.FC<{s: any; dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const t = f / 30; const u = f / dur;
  const T0 = 1.2, T1 = 2.0; // tic en reposo / en movimiento (0,8 c)
  const yA = 330, yB = 740; const cxL = 560;
  const xm = 1000 + ((t * 170) % 640);
  const pyR = yA + (yB - yA) * tri(t / T0 / 2);
  const pyM = yA + (yB - yA) * tri(t / T1 / 2);
  const trail: string[] = []; for (let i = 0; i <= 80; i++) { const tt = t - (80 - i) * 0.03; if (tt < 0) continue; trail.push(`${1000 + ((tt * 170) % 640)},${yA + (yB - yA) * tri(tt / T1 / 2)}`); }
  const wrapGap = (t * 170) % 640 < 170 * 0.1;
  return (<Svg>
    <g opacity={0.35 + 0.65 * seg(u, 0, 0.1)}>
      <rect x={cxL - 120} y={yA - 18} width="240" height="14" rx="7" fill="#e9e4f7" /><rect x={cxL - 120} y={yB + 4} width="240" height="14" rx="7" fill="#e9e4f7" />
      <line x1={cxL} y1={yA} x2={cxL} y2={yB} stroke="#fff" strokeOpacity="0.25" strokeDasharray="10 10" strokeWidth="3" />
      <circle cx={cxL} cy={pyR} r="20" fill={CYAN} />
      <text x={cxL - 180} y="880" fill="#fff" fontSize="40" fontWeight="600">Reloj en reposo</text>
      <text x={cxL - 140} y="940" fill={CYAN} fontSize="52" fontWeight="700">tics: {Math.floor(t / T0)}</text>
      <rect x={xm - 120} y={yA - 18} width="240" height="14" rx="7" fill="#e9e4f7" /><rect x={xm - 120} y={yB + 4} width="240" height="14" rx="7" fill="#e9e4f7" />
      {!wrapGap && <polyline points={trail.join(' ')} fill="none" stroke={MAG} strokeWidth="5" strokeLinecap="round" strokeOpacity="0.7" />}
      <circle cx={xm} cy={pyM} r="20" fill={MAG} />
      <text x="1000" y="880" fill="#fff" fontSize="40" fontWeight="600">Reloj en movimiento (0,8 c)</text>
      <text x="1000" y="940" fill={MAG} fontSize="52" fontWeight="700">tics: {Math.floor(t / T1)}</text>
    </g>
  </Svg>);
};

// ---------- velocidad total constante por el espacio-tiempo ----------
export const Cuatro: React.FC<{s: any; dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const u = f / dur;
  const ox = 520, oy = 860, R = 600;
  const ph = (0.5 + 0.5 * Math.sin((u * 1.0 - 0.15) * Math.PI * 1.6)) * 1.5; // 0..1.5 rad aprox
  const phi = Math.min(Math.PI / 2, Math.max(0, ph * (Math.PI / 2) / 1.5 * 1.0));
  const px = ox + R * Math.sin(phi), py = oy - R * Math.cos(phi);
  const v = Math.sin(phi), rate = Math.cos(phi);
  return (<Svg>
    <path d={`M ${ox} ${oy - R} A ${R} ${R} 0 0 1 ${ox + R} ${oy}`} fill="none" stroke="#e9e4f7" strokeWidth="4" strokeDasharray="12 10" />
    <line x1={ox} y1={oy} x2={ox + R + 60} y2={oy} stroke={CYAN} strokeWidth="7" strokeLinecap="round" />
    <line x1={ox} y1={oy} x2={ox} y2={oy - R - 60} stroke={C.yellow} strokeWidth="7" strokeLinecap="round" />
    <text x={ox + R * 0.3} y={oy + 56} fill={CYAN} fontSize="40" fontWeight="700">movimiento en el espacio →</text>
    <text x={ox + 24} y={oy - R - 70} fill={C.yellow} fontSize="40" fontWeight="700">movimiento en el tiempo ↑</text>
    <line x1={ox} y1={oy} x2={px} y2={py} stroke="#fff" strokeWidth="6" />
    <line x1={ox} y1={py} x2={px} y2={py} stroke={C.yellow} strokeWidth="4" strokeDasharray="8 8" /><line x1={px} y1={oy} x2={px} y2={py} stroke={CYAN} strokeWidth="4" strokeDasharray="8 8" />
    <circle cx={px} cy={py} r="22" fill="#fff" />
    <text x="1250" y="400" fill="#fff" fontSize="44" fontWeight="700">Velocidad total = c (siempre)</text>
    <text x="1250" y="500" fill={CYAN} fontSize="46" fontWeight="700">por el espacio: {(v * 100).toFixed(0)} % de c</text>
    <text x="1250" y="580" fill={C.yellow} fontSize="46" fontWeight="700">ritmo de tu reloj: {(rate * 100).toFixed(0)} %</text>
    <rect x="1250" y="620" width="560" height="22" rx="11" fill="rgba(255,255,255,.14)" /><rect x="1250" y="620" width={560 * rate} height="22" rx="11" fill={C.yellow} />
  </Svg>);
};

// ---------- γ: la energía se dispara cerca de c ----------
export const Gamma: React.FC<{s: any; dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const u = f / dur;
  const X0 = 240, X1 = 1680, Y0 = 820, YT = 260;
  const vmax = 0.0 + seg(u, 0.05, 0.9) * 0.9995;
  const g = (b: number) => 1 / Math.sqrt(1 - b * b);
  const GY = 12;
  const pts: string[] = []; for (let i = 0; i <= 200; i++) { const b = i / 200 * Math.min(vmax, 0.9993); pts.push(`${X0 + (X1 - X0) * (i / 200) * (Math.min(vmax, 0.9993) / 1.0)},${Y0 - Math.min(1, g(b) / GY) * (Y0 - YT)}`); }
  const cx = X0 + (X1 - X0) * vmax, cy = Y0 - Math.min(1, g(vmax) / GY) * (Y0 - YT);
  return (<Svg>
    <path d={`M ${X0} ${YT - 20} V ${Y0} H ${X1 + 20}`} fill="none" stroke="#e9e4f7" strokeWidth="3" />
    <line x1={X1} y1={YT - 20} x2={X1} y2={Y0} stroke={MAG} strokeWidth="4" strokeDasharray="12 10" />
    <text x={X1 - 160} y={YT - 36} fill={MAG} fontSize="36" fontWeight="700">v = c</text>
    <text x={X0} y={YT - 36} fill="#fff" fontSize="34" fontWeight="500">energía necesaria (× la energía en reposo)</text>
    <text x={X0 + 600} y={Y0 + 60} fill="#fff" fontSize="34" fontWeight="500">velocidad (% de c) →</text>
    <polyline points={pts.join(' ')} fill="none" stroke={C.yellow} strokeWidth="8" strokeLinecap="round" />
    <circle cx={cx} cy={cy} r="16" fill="#fff" />
    <text x="320" y="420" fill={C.yellow} fontSize="76" fontWeight="700">×{g(vmax).toFixed(g(vmax) < 10 ? 1 : 0)}</text>
    <text x="320" y="480" fill="#e9e4f7" fontSize="36" fontWeight="600">a {(vmax * 100).toFixed(vmax > 0.99 ? 2 : 0)} % de c</text>
  </Svg>);
};

// ---------- luz atravesando vidrio ----------
export const Vidrio: React.FC<{s: any; dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const t = f / 30;
  const P = 5.5; const tt = t % P;
  const vOut = 3.4, vIn = vOut / 1.5; const x0 = -6.5, g0 = -1.8, g1 = 1.8;
  const tA = (g0 - x0) / vOut, tB = tA + (g1 - g0) / vIn;
  const x = tt < tA ? x0 + vOut * tt : tt < tB ? g0 + vIn * (tt - tA) : g1 + vOut * (tt - tB);
  const inside = x > g0 && x < g1; const k = inside ? 16 : 10;
  return (<>
    <Stage cam={[0, 0.6, 10]}>
      <group rotation={[0.12, -0.2, 0]}>
        <mesh position={[0, 0, 0]}><boxGeometry args={[3.6, 2.8, 1.8]} /><meshStandardMaterial color="#5fd0ff" transparent opacity={0.28} roughness={0.1} /></mesh>
        <mesh position={[0, 0, 0]}><boxGeometry args={[3.62, 2.82, 1.82]} /><meshBasicMaterial color="#9be7ff" wireframe transparent opacity={0.45} /></mesh>
        <group position={[x, 0, 0]}><WavePacket t={t * 1.3} len={2.4} amp={0.45} k={k} width={0.55} /></group>
      </group>
    </Stage>
    <Txt x={110} y={790} t="vacío: 299 792 km/s" c={C.yellow} s={38} o={inside ? 0.35 : 1} />
    <Txt x={110} y={850} t="vidrio (n = 1,5): ≈ 200 000 km/s" c={CYAN} s={38} o={inside ? 1 : 0.35} />
  </>);
};

// ---------- expansión del universo ----------
const GAL = [...Array(34)].map((_, i) => { const a = rnd(i * 3 + 1) * Math.PI * 2; const r = 0.8 + rnd(i * 3 + 2) * 5.2; return [Math.cos(a) * r, Math.sin(a) * r * 0.62, rnd(i * 3 + 3)] as const; });
export const Expansion: React.FC<{s: any; dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const t = f / 30; const u = f / dur;
  const k = 1 + u * 0.55;
  return (<>
    <Stage cam={[0, 0, 11]}>
      <mesh position={[0, 0, 0.2]}><sphereGeometry args={[0.2, 18, 14]} /><meshBasicMaterial color={C.yellow} /></mesh>
      {GAL.map((g, i) => { const x = g[0] * k, y = g[1] * k; const far = Math.hypot(g[0], g[1] / 0.62) > 3.4; const pulse = far ? 0.85 + 0.15 * Math.sin(t * 6 + i) : 1;
        return (<group key={i} position={[x, y, 0]} scale={pulse}>
          <mesh rotation={[0.9, 0.2, i]}><torusGeometry args={[0.16, 0.035, 8, 24]} /><meshBasicMaterial color={far ? MAG : CYAN} /></mesh>
          <mesh><sphereGeometry args={[0.07, 10, 8]} /><meshBasicMaterial color="#ffffff" /></mesh>
        </group>); })}
      <mesh position={[0, 0, -0.2]} rotation={[0, 0, 0]}><torusGeometry args={[3.4 * k, 0.025, 8, 100]} /><meshBasicMaterial color="#ff8a4c" transparent opacity={0.8} /></mesh>
    </Stage>
    <Txt x={80} y={900} t="■ se aleja a menos de c" c={CYAN} s={34} /><Txt x={600} y={900} t="■ se aleja a más de c (el espacio se estira)" c={MAG} s={34} />
    <Txt x={1480} y={170} t="nosotros" c={C.yellow} s={30} o={0.8} />
  </>);
};

// ---------- muones ----------
export const Muon: React.FC<{s: any; dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const t = f / 30;
  const P = 5; const q = (t % P) / P; const yT = 170, yG = 900;
  const xL = 520, xR = 1400;
  const yRel = yT + (yG - yT) * Math.min(1, q / 0.8);
  const yClas = yT + (yG - yT) * Math.min(0.044, q / 0.8 * 0.044 * 1.6);
  return (<Svg>
    <defs><linearGradient id="atm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a2a8a" stopOpacity="0.1" /><stop offset="1" stopColor="#6a4cc2" stopOpacity="0.55" /></linearGradient></defs>
    <rect x="220" y={yT - 20} width="1480" height={yG - yT + 20} rx="24" fill="url(#atm)" /><rect x="220" y={yG} width="1480" height="30" rx="10" fill="#3DDC97" />
    <text x="250" y={yT + 10} fill="#e9e4f7" fontSize="30" fontWeight="600">15 km de altura</text><text x="250" y={yG - 14} fill="#0e2a1c" fontSize="28" fontWeight="700">suelo</text>
    <text x={xL - 190} y="120" fill="#fff" fontSize="38" fontWeight="700">Sin relatividad</text><text x={xR - 200} y="120" fill="#fff" fontSize="38" fontWeight="700">Con relatividad</text>
    <circle cx={xL} cy={yClas} r="22" fill={q > 0.2 ? '#7a6a9a' : MAG} />{q > 0.2 && <text x={xL - 20} y={yClas + 12} fill={C.orange} fontSize="46" fontWeight="700">✕</text>}
    <text x={xL - 240} y={yT + 150} fill={C.orange} fontSize="34" fontWeight="600" opacity={q > 0.2 ? 1 : 0.3}>se desintegra a ≈ 660 m</text>
    <circle cx={xR} cy={yRel} r="22" fill={MAG} />
    <text x={xR - 230} y={yG - 70} fill={C.green} fontSize="36" fontWeight="700" opacity={q > 0.75 ? 1 : 0.25}>¡llega al suelo!</text>
    <text x={xR + 60} y={yRel + 12} fill="#c8bfe6" fontSize="30" fontWeight="600">reloj del muón: lento</text>
  </Svg>);
};

// ---------- GPS ----------
export const Gps: React.FC<{s: any; dur: number}> = ({dur}) => {
  const f = useCurrentFrame(); const t = f / 30; const u = f / dur;
  const a = t * 0.9;
  return (<>
    <Stage cam={[0, 0, 11]}>
      <group position={[-3.4, 0, 0]} rotation={[0.3, t * 0.2, 0.3]} scale={sp(f, 0)}>
        <mesh><sphereGeometry args={[1.6, 40, 32]} />{mat('#2f6bd6', 0.5)}</mesh>
        {[[0.7, 0.8, 1.2], [-0.9, 0.3, 1.3], [0.2, -0.9, 1.35]].map((p, i) => <mesh key={i} position={p as [number, number, number]} scale={[1, 0.7, 0.4]}><sphereGeometry args={[0.5, 12, 10]} />{mat('#3DDC97', 0.6)}</mesh>)}
      </group>
      <group position={[-3.4, 0, 0]} rotation={[1.1, 0, 0.4]}>
        <mesh><torusGeometry args={[3.6, 0.02, 8, 120]} /><meshBasicMaterial color="#9be7ff" /></mesh>
        <group position={[Math.cos(a) * 3.6, Math.sin(a) * 3.6, 0]}><mesh><boxGeometry args={[0.34, 0.2, 0.2]} />{mat('#d9d4ee', 0.3)}</mesh><mesh position={[0, 0.0, 0]}><boxGeometry args={[0.9, 0.04, 0.2]} />{mat('#4f7bff', 0.3)}</mesh></group>
      </group>
    </Stage>
    {[['Relatividad especial', '−7 µs / día', C.orange, 0.1], ['Relatividad general', '+45 µs / día', CYAN, 0.35], ['Resultado neto', '+38 µs / día  →  11 km de error al día', C.yellow, 0.6]].map((r, i) => (
      <div key={i} style={{position: 'absolute', left: 1020, top: 330 + i * 150, opacity: Math.max(0.25, seg(u, r[3] as number, (r[3] as number) + 0.15)), fontFamily: FONT, color: r[2] as string, fontWeight: 700}}>
        <div style={{fontSize: 34, color: '#e9e4f7', fontWeight: 600}}>{r[0] as string}</div><div style={{fontSize: 50}}>{r[1] as string}</div></div>))}
  </>);
};

// ---------- CTA: botón de suscripción animado ----------
export const Cta: React.FC<{v: number; dur: number}> = ({v, dur}) => {
  const f = useCurrentFrame(); const t = f / 30; const u = f / dur;
  const inn = seg(u, 0.04, 0.16), out = 1 - seg(u, 0.9, 1.0);
  const o = inn * out;
  const click = seg(u, 0.45, 0.5) - seg(u, 0.5, 0.58);
  const bell = Math.sin(t * 14) * 22 * seg(u, 0.5, 0.58) * (1 - seg(u, 0.85, 0.95));
  const big = v === 3 ? 1.5 : v === 2 ? 1.18 : 0.92;
  const left = v === 3 ? 130 : 70, top = v === 3 ? 560 : 900;
  return (<>
    <div style={{position: 'absolute', left, top: top + (1 - inn) * 40, opacity: o, transform: `scale(${big * (1 - click * 0.06)})`, transformOrigin: 'left top', display: 'flex', alignItems: 'center', gap: 16, fontFamily: FONT}}>
      <div style={{background: '#FF1E1E', color: '#fff', fontWeight: 700, fontSize: 34, padding: '16px 34px', borderRadius: 16, boxShadow: '0 8px 28px rgba(0,0,0,.45)', letterSpacing: 1}}>▶ SUSCRÍBETE</div>
      <div style={{width: 70, height: 70, borderRadius: 999, background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 28px rgba(0,0,0,.45)', transform: `rotate(${bell}deg)`, transformOrigin: '50% 12%'}}>
        <svg width="40" height="40" viewBox="0 0 24 24"><path d="M12 2a6 6 0 0 0-6 6v4l-2 3v1h16v-1l-2-3V8a6 6 0 0 0-6-6zm0 20a2.5 2.5 0 0 0 2.4-2h-4.8A2.5 2.5 0 0 0 12 22z" fill="#1a0f33" /></svg></div>
    </div>
    {v === 3 && (() => { const a = seg(u, 0.15, 0.35); return (<div style={{position: 'absolute', right: 110, top: 190, width: 760, height: 428, borderRadius: 24, border: '4px solid #FFD83A', background: '#1d1040', opacity: a * out, transform: `scale(${0.92 + a * 0.08})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, color: '#fff'}}>
      <div style={{width: 120, height: 120, borderRadius: 999, background: '#FF1E1E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56}}>▶</div>
      <div style={{marginTop: 24, fontSize: 44, fontWeight: 700}}>PRÓXIMO VÍDEO</div><div style={{fontSize: 30, fontWeight: 500, opacity: 0.8, marginTop: 8}}>Física Infinita</div></div>); })()}
  </>);
};
