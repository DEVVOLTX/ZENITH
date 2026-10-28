'use client';
import { useCallback, useState } from 'react';
import { Flame, Trash2, Check } from 'lucide-react';
import { eachDayOfInterval, startOfWeek, subWeeks, subDays } from 'date-fns';
import { useStore, bestStreak, calcStreak } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { cn, dkey } from '@/lib/utils';
import { Card, Button, PageTitle, Empty } from '../ui';

const ICONS = ['💪', '📚', '💧', '🏃', '🧘', '😴', '🥗', '✍️', '💻', '🎧'];
const COLORS = ['#7c3aed', '#3b82f6', '#10b981', '#f43f5e', '#f59e0b', '#06b6d4'];

export default function Habits() {
  const { habits, addHabit, toggleHabit, delHabit, freezeHabit } = useStore(); const scrollEnd = useCallback((el: HTMLDivElement | null) => { if (el) el.scrollLeft = el.scrollWidth; }, []); const t = useT(); const today = dkey();
  const [name, setName] = useState(''), [icon, setIcon] = useState(ICONS[0]), [color, setColor] = useState(COLORS[0]), [sel, setSel] = useState('');
  const cur = habits.find((h) => h.id === sel) ?? habits[0];
  const days = eachDayOfInterval({ start: startOfWeek(subWeeks(new Date(), 51)), end: new Date() });
  const rate = cur ? Math.round((Array.from({ length: 30 }, (_, i) => dkey(subDays(new Date(), i))).filter((d) => cur.completions.includes(d)).length / 30) * 100) : 0;
  return (
    <div>
      <PageTitle>{t('habits')}</PageTitle>
      <Card className="mb-3">
        <form className="flex flex-wrap items-center gap-2" onSubmit={(e) => { e.preventDefault(); if (name.trim()) { addHabit({ name: name.trim(), icon, color }); setName(''); } }}>
          <input className="field min-w-40 flex-1" placeholder={t('habitName')} value={name} onChange={(e) => setName(e.target.value)} />
          <select className="field w-auto" value={icon} onChange={(e) => setIcon(e.target.value)}>{ICONS.map((i) => <option key={i}>{i}</option>)}</select>
          <div className="flex gap-1.5">{COLORS.map((c) => <button type="button" key={c} aria-label={c} onClick={() => setColor(c)} className={cn('h-6 w-6 rounded-full', color === c && 'ring-2 ring-fg ring-offset-2 ring-offset-transparent')} style={{ background: c }} />)}</div>
          <Button>{t('add')}</Button>
        </form>
      </Card>
      {habits.length === 0 && <Empty>{t('noHabits')}</Empty>}
      <div className="grid gap-2 md:grid-cols-2">
        {habits.map((h) => {
          const done = h.completions.includes(today); const yest = dkey(subDays(new Date(), 1)), fz = h.frozen || [], leftF = 2 - fz.filter((x) => x.startsWith(yest.slice(0, 7))).length;
          const canFreeze = leftF > 0 && !h.completions.includes(yest) && !fz.includes(yest) && h.completions.includes(dkey(subDays(new Date(), 2)));
          return (
            <Card key={h.id} className={cn('flex items-center gap-3 p-3', cur?.id === h.id && 'ring-1 ring-primary')}>
              <button onClick={() => toggleHabit(h.id)} aria-label="toggle" className="grid h-9 w-9 place-items-center rounded-xl border-2 transition" style={{ borderColor: h.color, background: done ? h.color : 'transparent' }}>{done && <Check size={18} className="text-white" />}</button>
              <button onClick={() => setSel(h.id)} className="flex-1 text-start"><p className="text-sm font-medium">{h.icon} {h.name}</p><p className="text-xs text-fg/50">{t('dailyTracking')}</p></button>
              <span className="flex items-center gap-1 font-bold text-orange-500"><Flame size={18} />{calcStreak(h.completions, h.frozen)}</span>
              {canFreeze && <button onClick={() => freezeHabit(h.id)} title={`${t('freeze')} · ${leftF} ${t('left')}`} className="rounded-lg bg-sky-400/20 px-2 py-1 text-xs text-sky-400">❄️ {leftF}</button>}
              <button onClick={() => delHabit(h.id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-500/10" aria-label="delete"><Trash2 size={15} /></button>
            </Card>
          );
        })}
      </div>
      {cur && (
        <Card className="mt-3">
          <h2 className="mb-3 font-semibold">{cur.icon} {cur.name} — {t('heatmap')}</h2>
          <div key={cur.id} ref={scrollEnd} className="overflow-x-auto pb-2" dir="ltr">
            <div className="grid w-max grid-flow-col grid-rows-7 gap-1">
              {days.map((d) => { const k = dkey(d), on = cur.completions.includes(k); return <button key={k} title={k} onClick={() => toggleHabit(cur.id, k)} className="h-3.5 w-3.5 rounded-[3px]" style={{ background: on ? cur.color : cur.frozen?.includes(k) ? '#7dd3fc' : 'rgb(var(--fg) / .1)' }} />; })}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            {[[t('total'), cur.completions.length], [t('best'), bestStreak(cur.completions)], [t('rate30'), `${rate}%`]].map(([l, v]) => <div key={String(l)} className="rounded-xl bg-fg/5 p-2"><p className="text-xl font-bold">{v}</p><p className="text-xs text-fg/50">{l}</p></div>)}
          </div>
        </Card>
      )}
    </div>
  );
}
