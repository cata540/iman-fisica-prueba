// Sintetiza cada escena con es-ES-AlvaroNeural (+6 %), concatena sin huecos y normaliza a -17,5 dB (mean_volume).
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync, spawnSync} from 'node:child_process';
import {MsEdgeTTS, OUTPUT_FORMAT} from 'msedge-tts';

const ROOT = path.resolve(import.meta.dirname, '..');
const TMP = path.join(ROOT, 'data', 'voz');
fs.mkdirSync(TMP, {recursive: true});
const scenes = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'guion.json'), 'utf8'));

const tts = new MsEdgeTTS();
await tts.setMetadata('es-ES-AlvaroNeural', OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
for (let i = 0; i < scenes.length; i++) {
  const {audioStream} = tts.toStream(scenes[i].texto, {rate: '+6%'});
  const chunks = [];
  await new Promise((res, rej) => { audioStream.on('data', (c) => chunks.push(c)); audioStream.on('end', res); audioStream.on('error', rej); audioStream.on('close', res); });
  fs.writeFileSync(path.join(TMP, `s${i}.mp3`), Buffer.concat(chunks));
}
// recorta silencios de borde de cada clip y los concatena sin huecos
const list = [];
const durs = [];
for (let i = 0; i < scenes.length; i++) {
  const out = path.join(TMP, `t${i}.wav`);
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', path.join(TMP, `s${i}.mp3`), '-ar', '48000', '-ac', '1',
    '-af', 'silenceremove=start_periods=1:start_threshold=-38dB:start_silence=0.03:stop_periods=-1:stop_duration=0.2:stop_threshold=-38dB:stop_silence=0.14,areverse,silenceremove=start_periods=1:start_threshold=-38dB:start_silence=0.03,areverse', out]);
  list.push(`file '${out.split(path.sep).join('/')}'`);
  const d = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', out]).toString());
  durs.push(d);
}
fs.writeFileSync(path.join(TMP, 'list.txt'), list.join('\n'));
const raw = path.join(TMP, 'raw.wav');
execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(TMP, 'list.txt'), '-c', 'copy', raw]);
// mide y ajusta ganancia para mean_volume = -17.5 dB
const r = spawnSync('ffmpeg', ['-hide_banner', '-i', raw, '-af', 'volumedetect', '-f', 'null', '-'], {encoding: 'utf8'});
const mean = Number(/mean_volume: (-?[0-9.]+) dB/.exec(r.stderr)?.[1]);
const mix = (g) => spawnSync('ffmpeg', ['-y', '-hide_banner', '-i', raw, '-af', `volume=${g.toFixed(2)}dB,alimiter=limit=0.9:level=disabled,volumedetect`, '-c:a', 'aac', '-b:a', '192k', path.join(ROOT, 'public', 'audio', 'voz.m4a')], {encoding: 'utf8'});
let gain = -17.5 - mean;
for (let k = 0; k < 4; k++) {
  const m = Number(/mean_volume: (-?[0-9.]+) dB/.exec(mix(gain).stderr)?.[1]);
  if (Math.abs(m + 17.5) < 0.15) break;
  gain += -17.5 - m;
}
const total = durs.reduce((a, b) => a + b, 0);
fs.writeFileSync(path.join(ROOT, 'data', 'timeline.json'), JSON.stringify({fps: 30, totalSeconds: total, durs, frames: durs.map((d) => Math.round(d * 30))}, null, 1));
console.log({mean, gain, durs, total});
