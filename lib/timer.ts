import { create } from 'zustand';
import { useStore } from './store';
import { tr } from './i18n';
import { isDay, dkey } from './utils';

export type Mode = 'focus' | 'short' | 'long';
export type Amb = 'off' | 'brown' | 'rain' | 'waves';
export const MIN: Record<Mode, number> = { focus: 25, short: 5, long: 15 };
interface T { mode: Mode; total: number; left: number; running: boolean; endAt: number; taskId: string; ambient: Amb;
  setMode(m: Mode): void; start(): void; pause(): void; reset(): void; setTask(id: string): void; setAmbient(k: Amb): void }

let iv: ReturnType<typeof setInterval> | undefined;
let ctx: AudioContext | null = null; let src: AudioBufferSourceNode | null = null;
const getCtx = () => (ctx ??= new (window.AudioContext || (window as any).webkitAudioContext)());

function beep() {
  try { const ctx = getCtx(); ctx.resume(); const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = 880; g.gain.value = 0.2; o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.6); } catch { /* ignore */ }
}
let lfo: OscillatorNode | null = null;
function ambient(k: Amb) {
  src?.stop(); lfo?.stop(); src = null; lfo = null; if (k === 'off') return;
  let ctx: AudioContext; try { ctx = getCtx(); } catch { return; } ctx.resume();
  const len = ctx.sampleRate * 4, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0); let l = 0;
  for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; if (k === 'rain') d[i] = w * 0.5; else { l = (l + 0.02 * w) / 1.02; d[i] = l * 3.5; } }
  src = ctx.createBufferSource(); src.buffer = b; src.loop = true;
  const g = ctx.createGain(); g.gain.value = k === 'rain' ? 0.25 : 0.4; let node: AudioNode = src;
  if (k === 'rain') { const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1200; src.connect(f); node = f; }
  node.connect(g); g.connect(ctx.destination);
  if (k === 'waves') { lfo = ctx.createOscillator(); lfo.frequency.value = 0.12; const lg = ctx.createGain(); lg.gain.value = 0.3; lfo.connect(lg); lg.connect(g.gain); lfo.start(); }
  src.start();
}
function finish() {
  const s = useTimer.getState(), st = useStore.getState(); beep();
  if (s.mode === 'focus') st.addSession({ duration: MIN.focus, taskId: s.taskId || undefined });
  try { if ('Notification' in window && Notification.permission === 'granted') new Notification('Zenith', { body: tr(st.settings.lang, 'done') }); } catch { /* Android Chrome يمنع new Notification */ }
  const n = useStore.getState().sessions.filter((x) => isDay(x.completedAt, dkey())).length;
  const next: Mode = s.mode === 'focus' ? (n % 4 === 0 ? 'long' : 'short') : 'focus';
  useTimer.setState({ mode: next, total: MIN[next] * 60, left: MIN[next] * 60, running: false });
}
const tick = () => {
  const left = Math.max(0, Math.round((useTimer.getState().endAt - Date.now()) / 1000));
  if (left <= 0) { clearInterval(iv); finish(); } else useTimer.setState({ left });
};
export const useTimer = create<T>((set, get) => ({
  mode: 'focus', total: 1500, left: 1500, running: false, endAt: 0, taskId: '', ambient: 'off',
  setMode: (m) => { clearInterval(iv); set({ mode: m, total: MIN[m] * 60, left: MIN[m] * 60, running: false }); },
  start: () => {
    if (get().running) return;
    try { if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission(); } catch { /* ignore */ }
    set({ running: true, endAt: Date.now() + get().left * 1000 }); iv = setInterval(tick, 500);
  },
  pause: () => { clearInterval(iv); set({ running: false }); },
  reset: () => { clearInterval(iv); set({ running: false, left: get().total }); },
  setTask: (taskId) => set({ taskId }),
  setAmbient: (k) => { ambient(k); set({ ambient: k }); },
}));
