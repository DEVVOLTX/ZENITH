'use client';
import { useRef } from 'react';
import { Play, Pause, Maximize, X } from 'lucide-react';
import { format } from 'date-fns';
import { useStore } from '@/lib/store';
import { useTimer, type Amb, type Mode } from '@/lib/timer';
import { useT } from '@/lib/i18n';
import { cn, dkey, isDay } from '@/lib/utils';
import { Card, Button, PageTitle } from '../ui';

export default function Focus() {
  const T = useTimer(); const { tasks, sessions } = useStore(); const t = useT(); const box = useRef<HTMLDivElement>(null);
  const mm = String(Math.floor(T.left / 60)).padStart(2, '0'), ss = String(T.left % 60).padStart(2, '0');
  const today = sessions.filter((s) => isDay(s.completedAt, dkey()));
  const live = T.mode === 'focus' && T.running ? Math.floor((T.total - T.left) / 60) : 0;
  const modes: [Mode, string][] = [['focus', 'focusMode'], ['short', 'shortBreak'], ['long', 'longBreak']];
  return (
    <div className="mx-auto max-w-xl">
      <PageTitle>{t('focus')}</PageTitle>
      <div ref={box} className="fs">
        <div className="mb-4 flex flex-wrap gap-2">
          {modes.map(([m, k]) => <button key={m} onClick={() => T.setMode(m)} className={cn('rounded-xl px-3 py-1.5 text-sm', T.mode === m ? 'bg-primary text-white' : 'bg-fg/10')}>{t(k)}</button>)}
          <button onClick={() => (document.fullscreenElement ? document.exitFullscreen() : box.current?.requestFullscreen())} className="ms-auto flex items-center gap-1 rounded-xl bg-fg/10 px-3 py-1.5 text-sm"><Maximize size={14} />{t('fullscreen')}</button>
        </div>
        <div className="rounded-[2.75rem] p-1 shadow-2xl" style={{ background: `conic-gradient(#ff9f0a ${(T.left / T.total) * 100}%, #2c2c30 0)` }}>
          <div className="flex items-center justify-between gap-3 rounded-[2.5rem] bg-black p-5 text-white">
            <button onClick={T.running ? T.pause : T.start} aria-label={T.running ? t('pause') : t('start')} className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-zinc-800 transition active:scale-90">{T.running ? <Pause fill="white" /> : <Play fill="white" />}</button>
            <div className="text-center">
              <p className="h-4 text-xs text-zinc-500">{T.running ? `🔔 ${format(T.endAt, 'HH:mm')}` : ''}</p>
              <p className="text-5xl font-bold tabular-nums sm:text-6xl" dir="ltr">{mm}:{ss}</p>
              <p className="text-zinc-400">{t(modes.find(([m]) => m === T.mode)![1])}</p>
            </div>
            <button onClick={T.reset} aria-label={t('reset')} className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-red-950 text-red-500 transition active:scale-90"><X size={28} strokeWidth={3} /></button>
          </div>
        </div>
      </div>
      <Card className="mt-4 space-y-3">
        <div><p className="mb-1.5 text-xs text-fg/60">{t('ambient')}</p><div className="flex flex-wrap gap-2">{(['off', 'brown', 'rain', 'waves'] as Amb[]).map((k) => <button key={k} onClick={() => T.setAmbient(k)} className={cn('rounded-xl px-3 py-1.5 text-sm', T.ambient === k ? 'bg-primary text-white' : 'bg-fg/10')}>{t(k)}</button>)}</div></div>
        <label className="block text-xs text-fg/60">{t('linkTask')}
          <select className="field mt-1" value={T.taskId} onChange={(e) => T.setTask(e.target.value)}><option value="">{t('noTask')}</option>{tasks.filter((x) => !x.completed).map((x) => <option key={x.id} value={x.id}>{x.title}</option>)}</select>
        </label>
      </Card>
      <Card className="mt-3">
        <h2 className="mb-2 font-semibold">{t('focusToday')}: {today.reduce((a, s) => a + s.duration, 0) + live} {t('min')} · {today.length} {t('sessions')}</h2>
        {today.map((s) => <p key={s.id} className="flex justify-between border-t border-fg/10 py-1.5 text-sm"><span>{tasks.find((x) => x.id === s.taskId)?.title ?? t('noTask')}</span><span className="text-fg/50">{s.duration} {t('min')}</span></p>)}
      </Card>
    </div>
  );
}
